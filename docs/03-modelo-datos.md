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

- **Implementado en la fase 5 (beta)** con migraciones `supabase/migrations/0002`–`0004` (ver `docs/09-supabase-auth.md`). Diferencias con este esquema: sin `device_id` (empate de `updated_at` → gana el servidor), `updated_at`/`created_at` son el reloj del cliente, `cim_id` sin FK hasta cargar el catálogo en la BD, `perfils` solo con `alias`, y las escrituras pasan por la RPC `sync_push` (LWW en el servidor).
- Los **logros** se calculan con funciones puras a partir de las ascensiones y del catálogo (`nivell_100`, `nivell_200`…, `comarca_completa:{zona}`, `essencials_50`…). La definición vive en el código y la tabla solo guarda cuándo se notificó al usuario, para no repetir avisos. Todo se puede recalcular.
- **Bloque R1 (migración `0005_diari_i_origen.sql`):**
  - `ascensions.companys text[] not null default '{}'`: compañeros de la ascensión (nombres o alias en texto libre; el cliente admite 10 de 40 caracteres y el servidor 20 de 80). `sync_push` los guarda; **si la fila llega sin la clave `companys`, conserva los que hubiera** (clientes antiguos en caché y filas locales anteriores a R1); con la clave presente (también `[]`), manda el cliente.
  - `perfils.origen_municipi` + `perfils.origen_updated_at`: municipio de origen como preferencia de la cuenta (código ICGC de 6 cifras, o `ad:{slug}` / `cn:{slug}` fuera de Catalunya). Se lee y se escribe con la RPC `sync_origen(canvi)`, con LWW por el instante del cliente (empate → servidor). Quitar el origen deja `origen_municipi = null` con el instante informado, para que el cambio se propague.
  - RLS sin cambios (políticas por fila); `esborrar_compte` ya borra `perfils` y `ascensions` enteros.
  - Tombstones: la nube no purga nada por sí misma; recibe los tombstones ya vaciados de `nota` y `companys` desde el cliente (regla en §2, "Minimización en las ascensiones borradas"), sin migración nueva.
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

**Bloque R1 (implementado; Dexie v3, `src/lib/data/local/db.ts`):**

- Tabla nueva `preferencies` (`clau`): hoy solo `origen` = `{ valor: código de municipio | null, updatedAt, pendent }`. Sin sesión vive solo en el dispositivo; con sesión, `sync.ts` lo sincroniza con `sync_origen` (sube si `pendent`, si no solo lee; LWW).
- `ascensions` no cambia de esquema: `companys` es un campo opcional de la fila. Una fila **sin la clave** (anterior a R1) se lee como `[]` y se sube sin la clave, de modo que el servidor conserva los compañeros que tenga. La migración a v3 pone `cursorPull` a cero para que el siguiente pull sea completo y traiga los compañeros guardados desde otros dispositivos.
- Qué pasa con el origen: `esborrarTot` y `sortir({ esborrarDades })` lo borran del dispositivo (la sync lo vuelve a bajar si hay sesión); `sortir()` lo conserva; `esborrarCompte` lo borra de la nube y del dispositivo, salvo `conservarDispositiu` (queda local y pendiente de subir a una cuenta futura); con datos de otra cuenta, `descartar-locals` lo borra y baja el de la cuenta actual, y `fusionar` lo sube como un cambio local más (LWW).
- Exportación JSON **versión 2** (`companys` por ascensión y `preferencies.origen`); la importación acepta las versiones 1 y 2 (un fichero v1 no toca compañeros ni origen).
- **Minimización en las ascensiones borradas** (`src/lib/data/local/lapides.ts`). La nota y los compañeros son datos personales y de terceros: un tombstone solo los conserva mientras el borrado se puede deshacer.
  - **Ventana de deshacer: 10 min desde `deletedAt`** (`FINESTRA_DESFER_MS`). El toast "Desfés" dura 8 s, pero se pausa con el ratón encima o el foco dentro (WCAG 2.2.1) y desaparece al recargar: 10 min lo cubre con margen y sigue siendo corto. Es una regla fija sobre un dato que ya está en la fila (sin estado de UI), así que vale igual en todos los dispositivos.
  - **Fuera de la ventana**, el tombstone se vacía: `nota: null`, `companys: []` (con la clave presente, para que `sync_push` también vacíe los de la nube) y `updatedAt` = el del tombstone **+ 1 ms**. No se usa "ahora": vaciar no es un cambio del usuario y solo debe ganar (LWW) a la versión que vacía, nunca a un cambio real posterior (p. ej. una restauración desde otro dispositivo). Dos dispositivos que vacían el mismo tombstone producen la misma fila. Se encola en `outbox` y la sync lo sube.
  - **Cuándo se ejecuta** (idempotente: un tombstone ya vacío no se reescribe): al abrir la BD (`obtenirBd`, evento `ready` de Dexie, antes de la primera lectura; si falla, la BD se abre igual), al empezar cada pasada de sync (antes del push, con la comprobación de época), con un temporizador tras cada borrado (10 min + 1 s, para la app abierta sin sesión) y al bajar del pull un tombstone fuera de la ventana con nota o compañeros (de un dispositivo con el cliente antiguo): se guarda ya vacío y se sube vacío en la pasada siguiente.
  - **`restaurarAscensio`**: dentro de la ventana devuelve la ascensión entera; fuera (toast pausado más de 10 min) la devuelve **sin nota ni compañeros**, se haya ejecutado ya la purga o no (resultado determinista).
  - **Exportaciones**: `exportarDades` solo exporta ascensiones vivas; `exportarDadesCompte` incluye los tombstones de la nube (`deletedAt`) siempre con `nota: null` y `companys: []`, aunque la nube aún los tenga (ventana o cliente antiguo).
  - Importar en modo `substituir` crea tombstones ya vacíos (ese borrado no tiene "Desfés").
  - Límites conocidos: un tombstone borrado desde un dispositivo con el reloj atrasado más de 10 min se vacía antes en los demás; y un cliente antiguo sigue subiendo tombstones con datos, que la nube conserva hasta que un cliente nuevo los baja y los vacía.
- Municipios: `src/lib/data/municipis/municipis.json` (947 de Catalunya + 7 parroquias de Andorra + 26 poblaciones de la Catalunya Nord), generado por `npm run municipis:build` (`scripts/municipis/build.ts`) solo con datos del ICGC (WFS de divisiones administrativas: capital del municipio; geocodificador para Andorra y Catalunya Nord). Se carga en diferido (chunk de ~18 kB gzip).

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
| `ascensionsEnRestriccio(asc, cat)`  | Ascensiones hechas con una restricción activa (la FEEC no las valida) → **aviso**, no bloquea ni resta progreso; `incerta` si la restricción es permanente sin fechas               |
| `progresInfantil(asc, cat, o, p)`   | 50 cimas distintas desde el 2026-07-01; si hay `dataNaixement`, solo las hechas con 7–14 años cumplidos ese día                                                                     |
| `cimsPropers(pos, cims, filtre)`    | Haversine sobre 522 puntos, ordenado por distancia, funciona offline                                                                                                                |
| `progresPerZona(primeres, cataleg)` | % hecho por comarca/zona                                                                                                                                                            |

### 3.3 Ambigüedades de la normativa

Estado a **2026-09-29**, tras leer la normativa vigente de la FEEC (vigente desde el **01/01/2024**; reto infantil desde el 01/07/2026): [Normativa i funcionament](https://www.feec.cat/activitats/100-cims/normativa-i-funcionament/) y [Cims amb restriccions d'accés](https://www.feec.cat/activitats/100-cims/cims-amb-restriccions-dacces/), consultadas el 2026-09-29 (lectura del agente SEO, bloque 3c). Las interpretaciones siguen siendo configurables en `OpcionsRepte` (`src/lib/domain/repte.ts`).

**Resueltas (con la fuente y la fecha de arriba):**

- **§3.3.3 Día de corte 01/07/2019.** La normativa dice "abans del dia 1 de juliol de 2019": normativa antigua = primera ascensión `< 2019-07-01`. Es el valor por defecto que ya había (`diaTallEsNormativaAntiga: false`); hay un test que lo fija.
- **§3.3.5 Restricciones de acceso.** La FEEC **no valida** las ascensiones hechas dentro del periodo restringido. La app solo avisa: `ascensionsEnRestriccio(ascensions, cataleg)` devuelve las ascensiones afectadas (con las restricciones activas ese día) y `calcularEstatRepte(...).enRestriccio` las expone a la UI. No bloquea el registro ni las quita del progreso (seguimiento personal). Si la restricción es permanente y sin fechas (p. ej. obras sin inicio conocido), el aviso lleva `incerta: true`: no se puede saber si una ascensión antigua cae dentro, y la UI debe formularlo como duda.
- **§3.3.6 Reto infantil.** Cuenta la **edad el día de cada ascensión** (7 a 14 años cumplidos, ambos inclusive) y las ascensiones **anteriores al 2026-07-01 no cuentan**. Por defecto `dataIniciInfantil: '2026-07-01'` (`DATA_INICI_INFANTIL`). `progresInfantil(asc, cataleg, opcions, { dataNaixement })` filtra por edad si se conoce la fecha de nacimiento (`edatEnData`, `edatInfantilValida`; quien nace un 29/02 cumple el 01/03 en años no bisiestos). El MVP no pide la fecha de nacimiento (dato personal de un menor): sin ella no se filtra por edad.

**Siguen ambiguas** (interpretación por defecto indicada; conviene confirmarlas con 100cims@feec.cat):

- **§3.3.1 ¿Cuentan las repeticiones para 2×100?** La normativa no lo dice explícitamente. "200… 500 **dels cims del llistat**" y que 5×100 = 500 ≤ 522 apuntan a **cimas distintas**. Por defecto: solo cimas distintas; las repeticiones son historial (`comptarRepeticions: false`).
- **§3.3.2 Exceso de más de 100 al año:** el límite es de cims _presentados para validar_ por año, no de ascensiones por año natural. Como la app no presenta nada a la FEEC, se avisa por año de ascensión (> 100 cimas nuevas) y no se bloquea. No se sabe si el excedente se puede presentar al año siguiente.
- **§3.3.4 No esenciales posteriores al 01/07/2019 y el 2×100:** se interpreta que cuentan con carácter retroactivo una vez completado el 100 (resumen del CE Taradell; `noEssencialsRetroactives: true`). La literalidad ("no es tindran en compte… fins que") permite leer que solo cuentan las posteriores a completar el 100.
- **§3.3.8 Licencia federativa vigente el día de la ascensión:** la normativa exige licencia; la app no lo comprueba ni lo modela (es cosa de cada persona y de su entidad). No está claro si basta con tenerla al presentar el full.
- **§3.3.7 Cimas que salgan de la lista o cambien de comarca** en futuras revisiones: se conservan con `actiu = false` y la ascensión sigue en el historial. No se sabe si siguen contando.
- **§3.3.6 (resto) Detalles del reto infantil:** como cuenta la edad el día de la ascensión, parece que las ascensiones hechas antes de cumplir 15 se pueden presentar después, pero la normativa no lo concreta. Tampoco detalla cómo se aplican las reglas del adulto (esenciales, límite anual) a esas mismas ascensiones cuando cuentan para los 100 Cims.

**Restricciones de acceso publicadas por la FEEC (2026-09-29):** 4 cimas.

| Cima                         | Esencial | Restricción                              | En el catálogo                    |
| ---------------------------- | -------- | ---------------------------------------- | --------------------------------- |
| La Picossa                   | Sí       | Fauna: del 15/01 al 15/06 (anual)        | Sí (`01-15`..`06-15`)             |
| Sant Salvador de les Espases | Sí       | Obras (sin fechas publicadas)            | Sí (permanente → aviso `incerta`) |
| Les Càrcoles                 | No       | Fauna: del 15/01 al 15/06 (anual)        | **Pendiente** (catálogo de 522)   |
| Roc Roi                      | No       | Gall fer: del 01/12 al 01/06 (cruza año) | **Pendiente** (catálogo de 522)   |

Al ampliar el catálogo a 522 hay que cargar Les Càrcoles y Roc Roi en `scripts/catalog/manual.ts` (o la fuente de restricciones), con `fontUrl` a la página de restricciones de la FEEC, y revisar la página en cada build.

### 3.4 Dificultat orientativa (bloque 6a-bis, `src/lib/domain/dificultat.ts`)

Estimación **propia** de Carnet de Cims (no es el MIDE ni una valoración oficial) de una ruta de acceso (ida), calculada con las datos con fuente de la ficha. Umbrales exportados en `ESCALA_DIFICULTAT` (la Metodología los muestra desde ahí).

- **Esfuerzo** (km-esfuerzo de ida; 100 m de subida = 1 km llano): con desnivel y distancia, `km + m/100`; si no, con el tiempo, `minutos / 15` (~4 km-esfuerzo/h); si solo hay desnivel, `m/100 × 1,4` (pendiente media del 25 %). La distancia sola no basta. ≤ 7 → 1 · ≤ 15 → 2 · ≤ 22 → 3 · > 22 → 4.
- **Técnica** (`tecnicitat` con fuente): `cap` 1 · `terreny-irregular` 2 · `grimpada-facil` 2 · `grimpada` 3 · `via-equipada` 4.
- **Altitud** del cim (catálogo): < 2.500 m → 1 · 2.500–2.999 → 2 · ≥ 3.000 → 3. Actúa de mínimo; sola no da resultado.
- **Nivel = el factor más alto** (1 Fàcil · 2 Moderada · 3 Exigent · 4 Molt exigent). Sin esfuerzo ni técnica → `null` (no se muestra). Si falta desnivel, distancia (o el tiempo cuando no hay ambos) o la tecnicidad → `aproximada: true` con `dadesQueFalten`.
- **Calibración** (ruta normal de las 10 pilotos): La Mola fàcil (6,7 km-esf.); Montcau (solo técnica, aproximada), Matagalls (9,2), Sant Jeroni (10,3), Taga (12,5) y Puigmal (14) moderada; Canigó (16), Pedraforca por Gósol (15,2) y Comapedrosa (19,3) exigent; Pica d'Estats (23,6) molt exigent. Pedraforca por el Verdet (grimpada) sería exigent. Tabla en `dificultat.spec.ts`.
- **Listados** (solo cims con contenido):
  - `cims-facils`: la **ruta normal** tiene nivel 1, con esfuerzo calculado y tecnicidad con fuente.
  - `cims-amb-nens` (decisión del coordinador por seguridad, 6b; el usuario fijó ≤ 2 h 30 y ≤ 600 m): **alguna ruta** de la ficha (`rutaAmbNens`: la más fácil que cumple; desempate por nivel, km-esfuerzo, tiempo y orden en la ficha) con nivel ≤ 2, tecnicidad **con fuente** `cap` o `terreny-irregular`, y desnivel de ida **con fuente** ≤ 600 m y tiempo de ida **con fuente** ≤ 150 min. Si falta cualquiera de esos datos, la ruta no cuenta (antes bastaba "cuando se conozcan"; el Casamanya Nord entraba sin desnivel con fuente, ~760 m reales). La página recibe la ruta elegida (`rutesAmbNens` en `cims-amb-nens/+page.server.ts`) para decir "des de …". Criterios en `CRITERIS_LLISTATS_DIFICULTAT` (la Metodología los lee de ahí).

### 3.5 Estadísticas personales (bloque R1, `src/lib/domain/estadistiques.ts`)

Funciones puras sobre las ascensiones y el catálogo; no se guarda nada. Todo parte de las ascensiones **válidas** (`ascensionsValides`): las "fora del repte" no cuentan en ninguna estadística (se informa cuántas hay en `totals.foraRepte`). Las no esenciales posteriores al 01/07/2019 sí cuentan (son historial), salvo en el progreso del reto 100 Cims, que es el mismo marcador del carnet.

| Dato                                                   | Cuenta                                                                                     | Desempate                                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `rankingCims`, `cimMesFet`                             | ascensiones por cima (`cimMesFet` solo si ≥ 2)                                             | última ascensión más reciente → primera más antigua → id                                      |
| `cimMesLlunya`                                         | cimas distintas hechas, distancia de gran círculo desde la capital del municipio de origen | más alta → id                                                                                 |
| `percentatges` (catálogo, esenciales, comarcas, retos) | cimas distintas                                                                            | comarcas: orden de `progresComarques`                                                         |
| `altitudAcumulada` / `altitudAcumuladaAscensions`      | suma de altitudes de cimas distintas / de cada ascensión (no es desnivel)                  | —                                                                                             |
| `cimMesAlt`, `ultimCimNou`                             | cimas distintas (primera ascensión)                                                        | primera ascensión más antigua → id                                                            |
| `primeraAscensio`, `ultimaAscensio`                    | ascensiones                                                                                | fecha → `createdAt` → id                                                                      |
| `perAny`, `millorAny`                                  | ascensiones y cimas nuevas por año; el mejor año es el de más **cimas nuevas**             | más ascensiones → año más reciente                                                            |
| `ratxa`                                                | meses naturales seguidos con alguna ascensión (las repeticiones también cuentan)           | la racha actual sigue viva si el mes en curso aún no tiene ascensión; máxima: la más reciente |

"% por reto" en R1: `cent-cims` (objetivo = página actual del carnet, 100…500) e `infantil` (50 cimas desde el 01/07/2026, sin filtrar por edad). `ProgresRepteResum` tiene ya la forma que devolverá el motor de retos de R2.

### 3.6 Retos propios, medallas y "El teu proper cim" (bloque R2)

`src/lib/domain/reptes.ts`, `massissos.ts` y `proper-cim.ts` (puros, con tests). No se guarda nada nuevo: progreso y medallas se derivan de las ascensiones y del catálogo (sin tocar Dexie, sync ni Supabase).

- **Un reto es un dato** (`Repte`: `id`, `slug.ca/es`, `condicio` = filtro de cimas + regla). Textos en `messages/*.json` con la clave `repte_<id con _>_nom` / `_descripcio`.
- **Qué cuenta en los retos propios:** las borradas nunca; fechas válidas ≤ hoy (también anteriores al 01/07/2006: los retos propios no siguen la normativa FEEC); sin regla de esenciales ni límite anual; siempre **cimas distintas** (fecha de una cima = su primera ascensión). `cent-cims` e `infantil` delegan en `calcularEstatRepte` (idéntico a carnet y estadísticas de R1). Objetivo 0 (catálogo o conjunto vacío) → nunca completado.
- **Les 4 estacions:** estaciones **meteorológicas** por meses enteros (primavera mar–may, verano jun–ago, otoño sep–nov, invierno dic–feb), dentro de un mismo **año natural**: el invierno de un año es enero, febrero y diciembre de ese año (el invierno que cruza el año no une diciembre con el enero siguiente). Se eligieron frente a las astronómicas porque no dependen de la fecha variable del equinoccio/solsticio y son fáciles de explicar. Cualquier ascensión cuenta (también repetir cima).
- **12 mesos, 12 cims:** 12 meses de calendario consecutivos con al menos una **cima nueva** (primera ascensión de toda la vida a esa cima); una repetición no cuenta. Puede cruzar el año. Una vez completado, sigue completado. Confirmado por el usuario, como las estaciones meteorológicas por año natural y que en los retos propios cuenten las ascensiones anteriores a 2006.
- **Totes les comarques:** una cima en cada comarca con cimas en el catálogo (incluye `andorra` y `catalunya-nord`, que en el catálogo son comarcas).
- **Massissos:** lista curada de slugs por macizo (`massissos.ts`, con fuente y caja de control); el test la valida contra `cims.json` (existencia, caja, ≥ 3 cimas). Decisión del usuario: Turó de Montsoriu en el Montseny, Santa Bàrbara en los Ports, Pedraforca y la Tosa en el Cadí-Moixeró; el Puig de la Creu de Castellar no entra en Sant Llorenç.
- **Medallas:** una por nivel alcanzado (`assoliments`); el 100 Cims da hasta 5 (I–V: 100 … 5×100) y se considera `completat` (con `dataCompletat`) al llegar a 100 (decisión del usuario).
- **El teu proper cim:** puntuación aditiva y explicable (motivos devueltos): distancia al origen, dificultad habitual (mediana de los hechos), época (altitud vs mes; también `bona-epoca` +5 en primavera y otoño por debajo de 2.000 m), restricción activa = excluida, bonus de reto a punto (faltan ≤ 3 y ≥ 50 % hecho; en empate, gana el reto con menos pendientes y después el de fracción más alta; Les 4 estacions solo cuenta con el año en curso y si todas las estaciones que faltan aún caben en el año, campo `ResultatRepte.aPunt`) y meteo opcional (`ajustarAmbMeteo`). Pesos en `PUNTS`. Si una cima no tiene ningún motivo, lleva el motivo neutro `pendent` (0 puntos), para que siempre haya uno que mostrar.

### 3.7 Validació i compartir (bloque R3)

Funciones puras en `src/lib/domain/validacio.ts` y `src/lib/domain/carnet-compartit.ts`; compresión en `src/lib/platform/compressio.ts`; enlace completo en `src/lib/data/compartir.ts` (sin Dexie, lo puede importar la página pública). No se guarda nada nuevo ni sale nada del dispositivo.

**Exportación para la validación oficial** (`exportValidacio(ascensions, cataleg, any, { desDe?, avui?, ...OpcionsRepte })`). Ayuda para rellenar el full de la FEEC; la app no valida ni presenta nada. Sin nombre, DNI ni licencia (el full los rellena la persona a mano).

- **Filas:** ascensiones que cuentan (`ascensionsValides`) del año natural `any` y desde `desDe` (inclusive). Orden: fecha, `createdAt`, id; `num` correlativo 1..n.
- **Excluidas** (`excloses`, nunca filas) con motivo: `esborrada`, `metode` (motor o desconocido), `fora-del-repte` (< 01/07/2006), `futura` (> hoy), `cim-desconegut`; si hay varios, el primero en este orden. Las de fecha con formato inválido no tienen año y no salen.
- **Avisos** (acumulables, en este orden):
  - `restriccio`: restricción de acceso activa el día de la ascensión (`ascensionsEnRestriccio`; §3.3.5, la FEEC no la valida).
  - `restriccio-incerta`: en lugar de `restriccio` (nunca los dos) cuando todas las restricciones activas ese día son permanentes y sin fechas (`incerta`, p. ej. Sant Salvador de les Espases, obras sin inicio conocido): no se sabe si la ascensión cae dentro; la UI lo dice como duda ("comprova-ho"), no como "la FEEC no la valida".
  - `repetit`: la cima ya tenía una ascensión válida anterior (cualquier año o el mismo; orden fecha, `createdAt`, id). No es cima nueva.
  - `mes-de-100`: cima nueva número 101 o posterior del año natural (`limitAnual`, §3.3.2). El recuento es de **todo el año** aunque `desDe` oculte filas.
  - `en-espera`: no esencial con la primera ascensión desde el 01/07/2019 mientras el 100 no está completado (§3.1; misma regla que `Carnet.enEspera`, también con `noEssencialsRetroactives: false`).
  - `fora-del-repte`: **no se emite nunca en una fila** (se mantiene en el tipo por estabilidad del contrato; las ascensiones fuera del reto van a `excloses`).
- `totalNous` = cimas nuevas de todo el año; `superaMaxim = totalNous > limitAnual`. Solo aviso.
- `anysAmbAscensions(asc, avui?)`: años (desc.) con alguna ascensión viva y fecha válida ≥ 01/07/2006 (y ≤ `avui` si se pasa).
- `terminiValidacio(avui)`: `{ any, dataLimit: 'AAAA-12-31', dies }` (0 el mismo 31/12).
- `csvValidacio(exp, cataleg, textos, comarques)`: RFC 4180 con `;`, BOM UTF-8 y CRLF (también al final). Columnas: núm., fecha `dd/mm/aaaa`, cima (`nom`), altitud, comarca (nombre), método, avisos (separados por ", "). Los textos de idioma los pasa la UI. Protección contra inyección de fórmulas: un campo que empieza por `= + - @`, tabulador o CR lleva el prefijo `'`.

**Ambigüedades (a confirmar con 100cims@feec.cat):**

- **Plazo:** la normativa dice que las listas deben llegar "abans del 31 de desembre". Puede leerse como "como muy tarde el 31/12" o "antes del 31/12" (último día el 30). `terminiValidacio` usa el 31/12 (contrato del bloque); la UI debería decir "fins al 31 de desembre" sin prometer que ese día se acepte.
- **Repeticiones en el full:** no se sabe si la FEEC quiere que se presenten repeticiones de cimas ya validadas. Salen con el aviso `repetit` y no cuentan como cimas nuevas para el límite anual.
- **No esenciales en espera:** se cuentan para el límite de 100 al año (como `excesAnual`), aunque aún no sumen para el reto.

**Enlace de solo lectura sin servidor** (`/ca/carnet#c=…`, `/es/carnet#c=…`):

- **Qué contiene:** un sello por cima tal como lo muestra el carnet (`entradaCompartir`: páginas, `enEspera` y `fora` de `paginesCarnet`), con cima y fecha; las **medallas** de quien comparte (`medalles()` sobre sus ascensiones reales: repeticiones, ascensiones anteriores a 2006 de los retos propios…), y un nombre opcional. Nada más: ni notas, ni compañeros, ni método, ni ids, ni `createdAt`. El fragmento no llega nunca al servidor.
- **Formato binario v1** (varints LEB128 de ≤ 3 bytes): `[1] · varint L · L bytes de nombre UTF-8 · varint N · N × (varint Δdías, varint cimId) · varint M · M × (varint codi, byte nivell, varint zigzag(días))`. Medallas (≤ 100): `codi` = posición en `CODIS_REPTE_COMPARTIT` (tabla propia que solo crece por el final; no la posición en `REPTES`, que es orden de UI), nivel 1..5, días respecto del 01/07/2006 con signo (zigzag; mínimo 01/01/1900). Entradas ordenadas por fecha (estable dentro del día: el orden del carnet de quien comparte); Δdías respecto de la anterior y la primera respecto del 01/07/2006. Después, `comprimeix` (1 byte de cabecera: `0` sin comprimir, `1` `deflate-raw`; sin comprimir si no hay `CompressionStream` o si comprimido no es más corto) y base64url sin relleno.
- **Tamaño medido** (catálogo de 522, fechas repartidas): 100 ascensiones ≈ 290 bytes → **~385 caracteres** de fragmento; **100 ascensiones + 10 medallas ≈ 327 bytes → ~430 caracteres** (URL ~465); 500 + 16 medallas ≈ **1.640**. Deflate gana poco (los datos ya son densos).
- **Validación al leer** (`descodificaCarnet(bytes, cataleg, avui)`, `llegeixEnllac(fragment, cataleg, avui)`; nunca lanzan por una entrada mala): errores `buit`, `base64` (alfabeto URL-safe estricto, sin `=`, bits sobrantes a cero), `compressio` (corrupto o > `MAX_BYTES_CARNET`, ~12 KB: protección contra bombas de descompresión, se corta leyendo a trozos), `versio`, `format` (truncado, bytes de más, varint no canónico o > 3 bytes, nombre no UTF-8), `massa-gran` (> 2.000 entradas, > 100 medallas, nombre > 160 bytes, fragmento demasiado largo). `buit` es solo un fragmento sin carnet (`c=` ausente o vacío): un carnet con 0 entradas es válido. Medallas: nivel fuera de 1..5 o fecha < 1900 → `format`; código desconocido (o de un reto que ya no está en `REPTES`) o fecha posterior a `avui` → se descarta; duplicadas (reto y nivel) → la primera. Las entradas con cima fuera del catálogo o fecha posterior a `avui` se **descartan y se cuentan** (`descartades`); los duplicados exactos se quedan en uno.
- **Nombre** (`sanejaNom`): saltos y tabuladores → espacio; se quitan controles (Cc) y formato invisible (Cf: bidi, zero-width, BOM), salvo el ZWJ de los emojis; espacios colapsados; ≤ 40 puntos de código. Es texto plano: la UI nunca lo interpreta como HTML.
- **Para pintarlo:** `ascensionsDeCarnetCompartit(carnet)` da ascensiones sintéticas (`c0001`…, `a-peu`) para `paginesCarnet`/`resumCarnet`; el carnet de quien recibe es el mismo que el de quien comparte (test). Las medallas se pintan desde `carnet.medalles`; **no** se recalculan con esas ascensiones sintéticas (se perderían, p. ej. Les 4 estacions con repeticiones; hay test).
- **Clave del cim:** `Cim.id`, la misma de las ascensiones guardadas. `scripts/catalog/build.ts` la asigna por la posición en `ESSENCIALS`; `src/lib/data/catalog/ids-estables.spec.ts` la fija contra `ids-estables.json` (id → `nom_oficial`). **La lista solo crece por el final**; al ampliar el catálogo se añaden los ids nuevos al JSON, sin tocar los existentes.

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
