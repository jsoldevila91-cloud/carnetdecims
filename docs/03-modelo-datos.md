# 03 · Modelo de datos, reglas del reto y obtención de datos

> Fase 0 (planificación). Autor: agente backend-expert. Fecha: 2026-09-27. Depende de `01-stack.md` (Supabase/Postgres + Dexie).
> Convenciones: identificadores SQL en catalán sin acentos (coinciden con el dominio); fechas de ascensión como `date` (`YYYY-MM-DD`, sin hora ni zona horaria).

## 1. Esquema en la nube (Postgres + PostGIS)

### 1.1 Catálogo (lectura pública, escritura solo `service_role` mediante scripts)

```sql
create type ambit as enum ('catalunya','andorra','catalunya_nord');
create type estat_revisio as enum ('esborrany','revisat');
create type lang as enum ('ca','es');

zones (                           -- comarques usadas por la FEEC (hay 43 oficiales desde el Lluçanès, 2023; verificar cuáles usa la FEEC) + Andorra + Catalunya Nord (≈45 páginas)
  id smallint pk, ambit ambit not null, codi text unique,          -- codi ICGC de comarca o 'AD' / 'CN'
  nom_ca text not null, nom_es text not null,
  slug_ca text unique not null, slug_es text unique not null,
  geom geography(MultiPolygon,4326),                               -- límite (ICGC CC BY / IGN FR / Andorra)
  updated_at timestamptz)

cims (
  id smallint pk,                         -- id estable propio (1..n); nunca se reutiliza
  nom_oficial text not null,              -- tal cual en la lista de la FEEC
  nom_ca text not null, nom_es text,      -- nombre visible (normalmente igual; null = igual que ca)
  slug_ca text unique not null, slug_es text unique not null,       -- por defecto iguales (ver 02-arquitectura-seo §3.2)
  zona_id smallint fk zones not null,     -- comarca asignada por la FEEC (aunque la cima sea fronteriza)
  altitud_m numeric(6,1) not null,        -- valor FEEC
  essencial boolean not null default false,
  geom geography(Point,4326),             -- null hasta que esté verificada
  coord_precisio_m smallint,              -- distancia estimada al vértice real
  actiu boolean not null default true, retirat_at date,             -- si la FEEC la saca de la lista
  cataleg_versio text not null,           -- p. ej. '2022-07' (ampliación a 522)
  updated_at timestamptz)
  -- índices: gist(geom), (zona_id), (essencial)

cim_alias (cim_id fk, nom text, lang lang null)          -- "Pedraforca" → "Pollegó Superior (Pedraforca)"; búsqueda
slug_redireccions (lang, slug_antic text, cim_id | zona_id, created_at)   -- 301 al renombrar

fonts_dades (                             -- procedencia campo a campo (requisito: "dejar constancia de la fuente")
  id pk, entitat text check (entitat in ('cim','zona','ruta','restriccio')), entitat_id int,
  camp text,                              -- 'geom', 'altitud_m', 'essencial'...
  font text,                              -- 'feec_web', 'feec_pdf_essencials', 'icgc_ngcat', 'osm', 'wikidata', 'manual'
  ref text, url text, llicencia text,     -- ref = id OSM / id NGCat
  obtingut_at date, nota text)

restriccions_acces (
  id pk, cim_id fk, tipus text check (tipus in ('fauna','obres','propietat','militar','altres')),
  periode_inici_mmdd char(5), periode_fi_mmdd char(5),   -- recurrente anual ('12-01'..'06-01'); null = permanente
  data_inici date, data_fi date,                           -- puntual (obras)
  font_url text not null, verificat_at date not null, vigent boolean)
  -- textos en `continguts` (camp = 'descripcio')

rutes (                                   -- rutas de acceso (0..n por cima; una marcada como normal)
  id pk, cim_id fk, es_normal boolean,
  sortida_nom text, sortida_geom geography(Point,4326),
  desnivell_pos_m int, distancia_km numeric(5,2), temps_min int,   -- ida; null si se desconoce
  mide_medi smallint check (mide_medi between 1 and 5),
  mide_itinerari smallint check (… 1..5), mide_desplacament smallint check (… 1..5), mide_esforc smallint check (… 1..5),
  estat estat_revisio not null default 'esborrany', updated_at timestamptz)
ruta_enllacos (ruta_id fk, url text, titol text, font text, lang lang null)

continguts (                              -- textos traducibles con revisión
  id pk, entitat text, entitat_id int, camp text,          -- 'descripcio','intro','titol_seo','meta_descripcio','acces'
  lang lang, text text,
  estat estat_revisio not null default 'esborrany',
  generat_per text check (generat_per in ('ia','huma')), model_ia text,
  revisat_per text, revisat_at timestamptz, updated_at timestamptz,
  unique (entitat, entitat_id, camp, lang))
contingut_fonts (contingut_id fk, url text, titol text, consultat_at date, llicencia text)
```

> **Fase 2 (2026-09-28):** el esquema está en `supabase/migrations/0001_cataleg.sql` con estos cambios respecto al borrador: `zones` → **`comarques`** (mismo contenido, nombre alineado con `comarques.json`); `cims.zona_id` → `comarca_id`; `altitud_m` pasa a `smallint` (valor propio, no FEEC; ver §4.4); nuevas columnas `nom_amb_article_ca`, `nom_amb_de_ca`, `toponim`, `confianca` (`alta|mitjana|baixa`) y `estat_revisio`; `fonts_dades.font` es un enum (`feec_pdf_essencials`, `icgc`, `icgc_mdt`, `ign`, `ign_alti`, `osm`, `wikidata`, `manual`) con `nota` obligatoria si es `manual`. RLS: lectura pública (rutas y textos solo si están `revisat`); escritura solo `service_role`. El catálogo estático está en `src/lib/data/catalog/` (no en `data/catalog/`).

Reglas de contenido: un campo sin datos fiables queda en `null` (nunca se inventa). Una página ca/es solo es indexable si sus `continguts` principales están en `revisat` (coordinado con seo-expert). La **fuente de verdad del catálogo son ficheros versionados en el repo** (`data/catalog/*.json`), que un script de _seed_ vuelca a Postgres; el prerender lee los mismos ficheros.

### 1.2 Datos de usuario (RLS: `user_id = auth.uid()`)

```sql
create type metode as enum ('a_peu','btt','esqui','raquetes');

perfils (user_id uuid pk fk auth.users on delete cascade,
  nom_visible text, idioma lang default 'ca',
  privacitat_versio text, privacitat_acceptada_at timestamptz,
  created_at, updated_at)

ascensions (
  id uuid pk,                             -- UUIDv7 generado en el cliente (sin colisiones entre dispositivos)
  user_id uuid not null fk auth.users on delete cascade,
  cim_id smallint not null fk cims,
  data date not null check (data >= '2006-07-01'),         -- "no futura" se valida en RPC (depende de la zona horaria)
  metode metode not null,
  nota text check (char_length(nota) <= 2000),
  client_updated_at timestamptz not null, -- reloj del dispositivo (LWW)
  device_id uuid not null,
  server_updated_at timestamptz not null default clock_timestamp(),  -- trigger en cada escritura (cursor del pull)
  deleted_at timestamptz,                 -- tombstone: nunca se borra físicamente mientras exista la cuenta
  created_at timestamptz default now())
  -- índices: (user_id, server_updated_at), (user_id, cim_id)
  -- se permiten varias ascensiones a la misma cima (historial); las reglas usan la primera válida

assoliments_usuari (user_id, codi text, assolit_en date, notificat_at timestamptz, pk (user_id, codi))
```

- Los **logros** se calculan con funciones puras a partir de las ascensiones y del catálogo (`nivell_100`, `nivell_200`…, `comarca_completa:{zona}`, `essencials_50`…). La definición vive en el código y la tabla solo guarda cuándo se notificó al usuario, para no repetir avisos. Todo se puede recalcular.
- RGPD: exportación = `select` de `perfils` + `ascensions` en JSON o CSV; al borrar la cuenta, `auth.admin.deleteUser` y el borrado en cascada. Los datos de menores (reto infantil, fecha de nacimiento) quedan fuera del MVP.

## 2. Modelo local (IndexedDB con Dexie) y sincronización

```ts
db.version(1).stores({
	cims: '&id, zonaId, essencial, altitud', // desde /data/cims.<versio>.json (precacheado)
	zones: '&id, slugCa, slugEs',
	ascensions: '&id, cimId, data, dirty, deletedAt', // mismos campos que la nube + dirty: 0|1
	meta: '&key', // catalegVersio, deviceId, ownerUserId (null = anónimo), lastPullCursor
	meteo: '&cimId, fetchedAt' // caché de 3 h
});
```

**Principio local-first:** toda escritura va primero a Dexie (`dirty = 1`, `clientUpdatedAt = now`). La UI solo lee de Dexie. La sync es un proceso en segundo plano que se lanza al abrir la app, al volver la conexión (`online`), tras cada escritura (con _debounce_) y en `visibilitychange`.

**Ciclo de sync (con sesión):**

1. **Push:** `rpc('sync_push', rows[])` con las filas `dirty`. El servidor aplica LWW por fila: actualiza solo si `incoming.client_updated_at > stored.client_updated_at` (empate → gana el `device_id` mayor). Valida con las mismas reglas (fecha, método, cima activa). Devuelve los ids aceptados → `dirty = 0`.
2. **Pull:** `rpc('sync_pull', cursor)` → filas con `server_updated_at > cursor − 5 s` (el solape cubre transacciones que confirman fuera de orden; el upsert es idempotente). Se aplican en local con la misma regla LWW, salvo si la fila local tiene `dirty = 1` y es más reciente.
3. Los borrados son tombstones (`deletedAt`) y se sincronizan como cualquier otro cambio.

**Fusión al crear cuenta o iniciar sesión por primera vez en el dispositivo:**

1. Los datos anónimos tienen `ownerUserId = null`. Tras el login se asigna `ownerUserId = user.id` y todas las filas quedan `dirty = 1`.
2. Pull completo (cursor 0) → unión por `id` (los UUID no colisionan).
3. **Deduplicación** de posibles duplicados reales (misma ascensión apuntada en dos dispositivos): igual `cimId` + `data` + `metode` → se conserva la versión con `clientUpdatedAt` más reciente. Si las notas son distintas, se unen con un separador para no perder texto. La otra queda como tombstone. Se informa: "S'han fusionat N ascensions duplicades".
4. Push del resultado.
5. Si el dispositivo tiene datos de **otra** cuenta (`ownerUserId` ≠ usuario nuevo), no se fusionan: se pregunta si se borran del dispositivo.
6. Al cerrar sesión: opción "conservar en este dispositivo" (vuelven a ser anónimos) o "borrar del dispositivo".

## 3. Reglas del reto (funciones puras en `src/lib/domain/repte.ts`, 100 % cubiertas por tests)

### 3.1 Qué dice la normativa FEEC (verificado el 2026-09-27)

- Inicio: _"L'inici de l'activitat és el dia 1 de juliol de 2006"_. Sin medios motorizados; se aceptan BTT, esquí y raquetas.
- Límite anual: _"Es poden presentar un màxim de 100 cims per ser validats anualment"_. Las listas deben llegar a la FEEC antes del 31 de diciembre para contar en el año en curso. Los cims registrados en la web de la FEEC y no validados en 12 meses se borran.
- **Esenciales** (normativa vigente desde el 01/07/2019): _"s'han d'assolir un centenar de cims del llistat de 150 que es qualifiquen com 'essencials'"_. _"La resta de cims del llistat són vàlids, però no es tindran en compte … a efectes d'assolir els reptes de '2×100' … '5×100' fins que no s'hagin assolit 100 cims dels llistat d'essencials"_. La circular 63/2019 añade que los cims conseguidos **antes del 01/07/2019** siguen siendo válidos aunque no sean esenciales.
- **Lista de esenciales:** el PDF contiene exactamente **150** cims (contados uno a uno). La ampliación a 522 (junio de 2022) _"no modifica els cims considerats essencials"_.
- **Niveles:** _"es fa un reconeixement als federats que han assolit 200, 300, 400 o 500 dels cims del llistat"_.
- **Reto infantil** (vigente desde el 01/07/2026): de 7 a 14 años, 50 cims cualesquiera de los 522, sin distinción de esenciales ni límite anual, y cuentan también para el reto adulto.
- Validación: la avala el presidente o presidenta de la entidad del federado. **La app no valida nada**: solo hace seguimiento.

### 3.2 Funciones

| Función                             | Regla implementada                                                                                                                                                                  |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `validarData(data, avui)`           | `'2006-07-01' ≤ data ≤ avui`; `avui` = fecha local Europe/Madrid, que se inyecta para poder testearla                                                                               |
| `validarMetode(m)`                  | ∈ {a_peu, btt, esqui, raquetes}                                                                                                                                                     |
| `ascensionsValides(asc, cataleg)`   | Sin tombstones, fecha y método válidos, cima existente                                                                                                                              |
| `primeresAscensions(asc)`           | Por cima, la ascensión válida más antigua (`Map<cimId, data>`)                                                                                                                      |
| `progres100(primeres, cataleg)`     | `comptador =                                                                                                                                                                        | cims con 1ª ascensión < 2019-07-01 | +   | esenciales con 1ª ascensión ≥ 2019-07-01 | `; `completat = comptador ≥ 100`; `dataAssoliment`= fecha en que llega a 100;`essencialsPendents` |
| `nivell(primeres, cataleg)`         | 0 si no se ha completado 100; si no, `min(5, floor(cimsDistints / 100))` contando **todas** las cimas distintas (esenciales y no esenciales, también las anteriores a llegar a 100) |
| `excesAnual(primeres)`              | Años con más de 100 cimas nuevas → **aviso informativo**, no bloquea el registro                                                                                                    |
| `restriccioActiva(r, data)`         | Periodo `mm-dd` que puede cruzar el cambio de año (01-12 → 01-06) o rango de fechas → aviso                                                                                         |
| `cimsPropers(pos, cims, filtre)`    | Haversine sobre 522 puntos, ordenado por distancia, funciona offline                                                                                                                |
| `progresPerZona(primeres, cataleg)` | % hecho por comarca/zona                                                                                                                                                            |

### 3.3 Ambigüedades (se implementan con la interpretación indicada, configurable, y conviene confirmarlas con 100cims@feec.cat)

1. **¿Cuentan las repeticiones para 2×100?** La normativa no lo dice explícitamente. "200… 500 **dels cims del llistat**" y que 5×100 = 500 ≤ 522 apuntan a **cimas distintas**. Implementamos: solo cuentan cimas distintas; las repeticiones se guardan como historial.
2. **Límite de 100 por año:** habla de cims _presentados para validar_ por año, no de ascensiones por año natural. Como la app no presenta nada a la FEEC, se muestra un aviso por año de ascensión (> 100 cimas nuevas) y no se bloquea. Queda por aclarar si un excedente se puede presentar al año siguiente.
3. **Día de corte 01/07/2019:** "des del dia 1 de juliol" frente a "assolits fins al dia 1 de juliol". Tomamos `< 2019-07-01` como normativa antigua.
4. **Esenciales como requisito:** se interpreta que los primeros 100 (salvo los anteriores a 2019) deben ser esenciales, y que las no esenciales posteriores a 2019 cuentan con carácter retroactivo para 2×100 una vez completado el 100 (así lo resume el CE Taradell). La literalidad ("no es tindran en compte… fins que") permite otra lectura: que solo cuenten las posteriores a completar el 100.
5. **Restricciones de acceso:** no se sabe si la FEEC invalida una ascensión hecha dentro del periodo restringido. Solo mostramos un aviso.
6. **Reto infantil:** ¿cuentan las ascensiones anteriores al 01/07/2026? ¿La edad se mide en la fecha de cada ascensión? Queda fuera del MVP.
7. **Cimas retiradas o reasignadas de comarca** en futuras revisiones de la lista: se conservan `actiu = false` y la ascensión sigue en el historial. No sabemos si siguen contando.

## 4. Plan de obtención de datos (solo investigación; no se ha descargado ni scrapeado nada)

### 4.1 Qué publica la FEEC

- **Lista de 522**: `feec.cat/activitats/100-cims/` muestra una tabla (Nom, Comarca, Altitud, Ascensions) cargada **dinámicamente por JavaScript**. No hay CSV, GPX, KML ni API pública documentada, y la FEEC **no publica coordenadas**.
- **Esenciales**: PDF de 6 páginas con 150 nombres agrupados por comarca, sin altitud ni coordenadas. Ojo: los nombres del PDF no coinciden siempre con los de la web ("Pollegó Superior (Pedraforca)", "Pic d'Enclar (Bony de la Pica)") → emparejamiento manual.
- **Restricciones**: la página `cims-amb-restriccions-dacces` lista hoy 4 cimas (La Picossa y Les Càrcoles del 15/01 al 15/06 por fauna; Roc Roi del 01/12 al 01/06; Sant Salvador de les Espases por obras). Hay que revisarla en cada build.
- **Aspecto legal:** los datos sueltos (nombre, altitud) no tienen derechos de autor, pero la **lista completa puede estar protegida por el derecho _sui generis_ de bases de datos** (Directiva 96/9/CE), que prohíbe extraer una parte sustancial. **Recomendación: escribir a 100cims@feec.cat** explicando el proyecto (no oficial, sin ánimo de suplantar), pedir permiso y, si es posible, la lista en formato estructurado.

### 4.2 Coordenadas: fuentes por orden de preferencia

| Fuente                                                      | Cobertura                                | Licencia                                                            | Uso                                                                                                                                                                                                                                                                      |
| ----------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **ICGC – Noms geogràfics (NGCat)** / Nomenclàtor            | Catalunya                                | CC BY 4.0 (solo atribución, sin _share-alike_)                      | **Fuente principal** para Catalunya. Coordenadas UTM 31N ETRS89 → WGS84 con `proj4`                                                                                                                                                                                      |
| **OpenStreetMap** (`natural=peak` vía Overpass)             | Todo, incluidas Andorra y Catalunya Nord | ODbL (atribución + _share-alike_ si se redistribuye la BD derivada) | Principal para Andorra y Catalunya Nord; validación cruzada en Catalunya. **Una sola consulta** por _bounding box_, guardada en `data/raw/` (política de Overpass: el uso comercial debería usar una instancia propia o de pago; una consulta puntual no es un problema) |
| IGN France (BD TOPO)                                        | Catalunya Nord                           | Licence Ouverte 2.0                                                 | Alternativa a OSM para evitar el _share-alike_                                                                                                                                                                                                                           |
| Wikidata                                                    | Parcial                                  | CC0                                                                 | Validación cruzada                                                                                                                                                                                                                                                       |
| Listas de terceros (RocJumper GPX, mirador.cat, Viquipèdia) | 522                                      | Sin licencia de reutilización clara                                 | **No importar**; solo para revisar a mano                                                                                                                                                                                                                                |
| ICGC MDT 5 m                                                | Catalunya                                | CC BY 4.0                                                           | Comprobar la altitud (diferencia con la FEEC > 20 m → revisar)                                                                                                                                                                                                           |

Nota ODbL: si una coordenada sale de OSM y publicamos el catálogo como base de datos (JSON descargable), esa parte debe ser ODbL. Mostrar las cimas en páginas y mapas es una "obra producida": basta con atribuir. Por eso priorizamos ICGC para Catalunya.

### 4.3 Pipeline reproducible (`scripts/catalog/`, Node + TS, idempotente)

1. `01-fuentes`: descarga puntual de cada fuente a `data/raw/<fuente>/<fecha>.*` con hash SHA-256 y un `SOURCES.md` (URL, fecha, licencia). La lista FEEC, solo tras el permiso o la decisión del usuario.
2. `02-normalizar`: nombres (minúsculas, sin artículos ni acentos, alias), comarcas → `zona_id`.
3. `03-emparejar`: candidatos por nombre normalizado + altitud (±25 m) + punto dentro del polígono de la comarca (límites ICGC, CC BY). Puntuación de confianza.
4. `04-revision`: genera `data/review/pendientes.csv` con los casos ambiguos o sin candidato, para resolverlos a mano (`font = 'manual'` y nota).
5. `05-build`: `data/catalog/cims.json` y `zones.json` con `fonts` por campo y `cataleg_versio`.
6. `06-seed`: upsert en Postgres (`service_role`, solo desde local o CI).
7. **Controles de calidad (tests):** exactamente 522 cimas activas; 150 esenciales; cada cima dentro de su zona (o marcada como fronteriza); diferencia de altitud con el MDT < 20 m; distancia al pico OSM o NGCat < 150 m; slugs únicos por idioma.

### 4.4 Atribuciones obligatorias (pie del mapa + página `/metodologia`)

"© Institut Cartogràfic i Geològic de Catalunya (ICGC), CC BY 4.0" · "© OpenStreetMap contributors, ODbL" · "© OpenMapTiles" · relieve "© Mapterhorn" · meteo "Open-Meteo, CC BY 4.0" (o "MET Norway, CC BY 4.0") · "Llista de cims: FEEC, repte 100 Cims. Web no oficial; la validació d'ascensions la fa la FEEC a través de les entitats."

**Lo que se ha usado finalmente en la fase 2 (150 esenciales, `npm run catalog:build`, 2026-09-28).** Decisión del usuario: no se contacta con la FEEC y **no se copia la tabla de 522** (ni altitudes ni nº de ascensiones de su web). De la FEEC solo se usa el hecho público de qué cimas son esenciales y a qué comarca las asigna (PDF).

| Dato                                  | Fuente (servicio)                                                                           | Licencia / atribución                                               | Uso en `cims.json`                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Lista de esenciales y comarca         | PDF `Essencials-100-cims.pdf` de la FEEC                                                    | Hechos (sin derechos); se cita la fuente                            | `nom`, `nom_oficial`, `comarca`, `essencial` (`fonts.nom = feec_pdf_essencials`)                  |
| Coordenadas y topónimo (Catalunya)    | Geocodificador ICGC `eines.icgc.cat/geocodificador` (capas topo1/topo2)                     | CC BY 4.0 — "© Institut Cartogràfic i Geològic de Catalunya (ICGC)" | 134 cimas (`fonts.coordenades = icgc`)                                                            |
| Elevación de control                  | WCS MET-5 del ICGC `geoserveis.icgc.cat/icc_mdt/wcs/service` (Catalunya y parte de Andorra) | CC BY 4.0 (ICGC)                                                    | Validación de la altitud (máximo en 60 m); valor de reserva `icgc_mdt`                            |
| Límites comarcales                    | WFS Divisions administratives del ICGC (1:250.000)                                          | CC BY 4.0 (ICGC)                                                    | Solo para emparejar (no se publica)                                                               |
| Coordenadas (Catalunya Nord)          | Géoplateforme IGN `data.geopf.fr/geocodage` (POI BD TOPO)                                   | Licence Ouverte 2.0 — "© IGN France"                                | 6 cimas (`ign`)                                                                                   |
| Elevación de control (Catalunya Nord) | IGN RGE ALTI `data.geopf.fr/altimetrie`                                                     | Licence Ouverte 2.0 — "© IGN France"                                | Validación de la altitud                                                                          |
| Altitud declarada y coordenadas       | Wikidata (SPARQL, una consulta por bbox)                                                    | CC0 (sin obligación; se cita por transparencia)                     | Altitud de 147 cimas; coordenadas de 10 (Andorra, casos revisados)                                |
| Altitud declarada (y validación)      | OpenStreetMap vía Overpass (una consulta por bbox, `natural=peak`)                          | ODbL 1.0 — "© OpenStreetMap contributors"                           | Altitud de 3 cimas; validación cruzada de las demás. **Ninguna coordenada publicada sale de OSM** |

Notas de licencia:

- Como 3 altitudes proceden de OSM, `cims.json` contiene una parte pequeña derivada de una base ODbL. Mostrarlas en páginas/mapas es "obra producida" (basta atribuir). Si algún día se publica el JSON como descarga, esas filas (`fonts.altitud.font = 'osm'`) deben ofrecerse bajo ODbL o sustituirse por otra fuente. El build ya prefiere Wikidata (CC0) sobre OSM cuando ambas cuadran con el MDT.
- Regla de altitud: valor declarado (Wikidata/OSM, que suele reproducir la cota del mapa oficial) que queda a ±15 m del máximo del MDT; si ninguno encaja, el MDT redondeado. Diferencias > 15 m entre fuentes → `scripts/catalog/informe.md`.
- Cortesía de uso: User-Agent identificable (`carnetdecims.cat catalog script`), ritmo lento (1,1 s entre peticiones; 10 s Overpass; 5 s Wikidata) y caché en `scripts/catalog/.cache/` (ignorada en git): una reconstrucción no vuelve a consultar los servicios (`CATALOG_OFFLINE=1` lo garantiza).
- Claves de mensajes para el texto de atribución (sin UI todavía): `attribution_title`, `attribution_list`, `attribution_icgc`, `attribution_ign`, `attribution_osm`, `attribution_wikidata`, `catalog_draft_notice` (`messages/ca.json`, `messages/es.json`).

### 4.5 Estado del catálogo (fase 2)

- Pipeline: `scripts/catalog/` (`essencials.ts` lista del PDF, `comarques.ts`, `fonts/*` por servicio, `manual.ts` resoluciones manuales documentadas, `build.ts`). Salidas deterministas: `src/lib/data/catalog/cims.json`, `comarques.json` y `scripts/catalog/informe.md` (revisión humana). Validador: `src/lib/data/catalog/catalog.spec.ts`.
- Resultado: 150/150 con coordenadas y altitud. Confianza calculada: alta 146, mitjana 4, baixa 0. Todas las cimas quedan `estat_revisio = 'esborrany'` hasta la revisión humana.
- Casos resueltos a mano (homónimos, límites comarcales cambiados como Torà/Biosca → Solsonès, puntos OSM desplazados) en `manual.ts`, cada uno con nota y fuente.

## Fuentes

- Normativa: https://www.feec.cat/activitats/100-cims/normativa-i-funcionament/
- Circular 63/2019: https://www.feec.cat/wp-content/uploads/2020/02/63-2019-Circular-FEEC-Normativa-100-cims.pdf
- Esenciales (150): https://www.feec.cat/wp-content/uploads/2020/02/Essencials-100-cims.pdf
- Qué es el reto (niveles 200–500): https://www.feec.cat/activitats/100-cims/que-es-el-repte-dels-100-cims/
- Ampliación a 522 (20/06/2022): https://www.feec.cat/actualitat/noticies/214-nous-cims-entren-a-formar-part-del-repte-dels-100-cims/
- Reto infantil (08/07/2026): https://www.feec.cat/actualitat/noticies/la-feec-impulsa-el-repte-infantil-dels-100-cims/
- Restricciones: https://www.feec.cat/activitats/100-cims/cims-amb-restriccions-dacces/
- Interpretación del CE Taradell: https://cetaradell.cat/ce/100-cims-modifica-la-normativa/
- ICGC NGCat: https://www.icgc.cat/Descarregues/Llocs/Noms-geografics-NGCat · Overpass: https://wiki.openstreetmap.org/wiki/Overpass_API · Atribución OSM: https://osmfoundation.org/wiki/Licence/Attribution_Guidelines
