# Estado del proyecto

> Se actualiza al final de cada bloque. Última actualización: 2026-10-18.

## Hecho

- **Fase 0:** planificación (docs 01–05, propuestas visuales). Las decisiones están en `04-plan-fases.md`.
- **Fase 1:**
  - base SvelteKit, sistema de diseño Segells en claro y oscuro, layout tipo app, i18n ca/es;
  - reglas del reto (105 tests);
  - SEO base (sitemap, OG, JSON-LD, hreflang);
  - QA (Playwright + axe).
- **Fase 2 (aprobada):**
  - catálogo de las 150 esenciales (`src/lib/data/catalog/`), generado con `scripts/catalog/`;
  - prioridad ICGC; la altitud es la cota más popular;
  - restricciones de La Picossa y de Sant Salvador de les Espases.
- **Bloque 3a (terminado, 2026-09-28): ficha de cim** `/ca/cims/{slug}` y `/es/cimas/{slug}` (150 × 2, prerender).
  - **Backend:** `queries.ts` (`cimPerSlug`, `cimsPropers`, `cimsMateixaComarca`), `domain/geo.ts`, `estatRestriccions`, `cimEntries()`, `localizeCimPath()`, `cimGraph` (Mountain + WebPage + BreadcrumbList).
  - **Mapa estático:** ICGC en Catalunya y Andorra, Plan IGN en Catalunya Nord (`mapaEstaticPerCim`).
  - **Frontend:**
    - ficha Segells con sello de esencial, alias, datos y restricciones ("vigent avui" calculado en el cliente);
    - mapa con atribución, CTA de registrar, 6 cims cercanas, 3 de la misma comarca y enlace "Tots els cims del…";
    - botón de Wikiloc (caja de ~3 km, `nofollow`);
    - H1 compacto (`ui/titol-ample.ts`).
    - `/cims` lista las 150 agrupadas por comarca.
  - **SEO:**
    - `seoFitxaCim()`: title ≤ 60, description ≤ 155, castellano correcto;
    - `additionalProperty` de esencial;
    - sitemap preparado para las fichas `revisat` (hoy vacío);
    - todas las fichas en `noindex` mientras estén en `esborrany`.
  - **QA:** `e2e/fitxa-cim.e2e.ts` y `e2e/fitxes-totes.e2e.ts` (las 150 fichas a 320/375/768/1280: desborde, palabras partidas, H1 ≤ 3 líneas, sello sin solaparse). **529 E2E pasados y 0 fallidos** en los 3 proyectos; 221 unitarios; build OK.

- **Bloque 3b (terminado, 2026-09-29): comarcas y listados.**
  - **Páginas:**
    - índice `/ca/comarques` (`/es/comarcas`);
    - 43 comarcas `/ca/comarques/{slug}` (Segarra sin cims → 404) con intro generada con datos, mapa estático con marcadores numerados (`ui/MapaMarcadors.svelte`, `ui/marcadors.ts`: separación ≥ 26 px con línea guía al punto real) y lista;
    - listados `/cims-essencials`, `/tresmils` (5) y `/cims-mes-alts` (25);
    - filtros en cliente en `/cims` (nombre sin acentos ni apóstrofos, alias, zona, altitud, solo esenciales; estado en query no indexable).
  - **Ficha:** breadcrumb Inici › Comarques › {comarca} › {cim} y comarca enlazada.
  - **Backend:** `cimsPerComarca`, `comarquesAmbCims`, `LLISTATS`, `localizeComarcaPath`, `comarcaEntries`, `mapaEstaticComarca` (con proyección de puntos), `comarcaGraph` / `llistatGraph` / `comarquesGraph` / `cimsGraph`, sitemaps de comarques y llistats.
  - **SEO:** textos "essencials" (sin cifras falsas del reto completo); una comarca es **indexable solo con ≥ 3 cims** (`seo/indexabilitat.ts`: 25 indexables y 18 `noindex`); castellano "de la Anoia".
  - **QA:** `e2e/comarques`, `llistats`, `filtres-cims` y el helper `e2e/cataleg.ts`. **998 E2E pasados y 0 fallidos** en los 3 proyectos; 266 unitarios; build OK.

- **Bloque 3c (terminado, 2026-09-29): el reto, portada y legales.**
  - **Contenido** (`src/lib/content/*.ts`, contrato `types.ts`; pintado por `PaginaContingut.svelte` con parser seguro `ui/text-en-linia.ts`): hub `/repte-100-cims`, normativa explicada (normativa FEEC vigente desde el 01/01/2024), com-validar, repte-infantil, metodologia, sobre-el-projecte, avís legal, privacitat.
  - **Titular y contacto:** "Carnet de Cims" y hola@carnetdecims.cat (`content/titular.ts`). Responsable visible solo como **"JSR"**, con la presentación de JSR y su pareja; **el nombre real no se publica nunca**. 0 marcadores pendientes (`pendents.ts`).
  - **Dominio:** `ascensionsEnRestriccio` (aviso), reto infantil desde 2026-07-01 con `edatInfantilValida`; docs/03 §3.3 actualizado.
  - **Portada** con textos veraces ("cims essencials i guia del repte 100 Cims", funciones futuras con "Aviat…"); pie "Informació del web".
  - **SEO:** `paginaGraph` (WebPage/AboutPage + BreadcrumbList + FAQPage), sitemap de contenido con `lastmod`; legales fuera del sitemap; **`/mapa` en `noindex`** hasta que exista (`PAGINES_NOINDEX`).
  - **QA:** `e2e/contingut.e2e.ts`. **1471 E2E pasados** en los 3 proyectos (4 fallos de tests frágiles, ya corregidos); build OK.

- **Bloque 3d exprés (terminado, 2026-09-29):**
  - marcadores con guía y punto real visibles (≥ 20 px);
  - filtro de `/cims` resincronizado con la URL en cada navegación;
  - H1 de ficha `{nom} ({alt} m)` (palabras con guion en `nowrap`) y CTA bajo el H1, visible en móvil;
  - sheets sin H2 mientras están cerrados;
  - textos de portada veraces;
  - E2E endurecidos (`hrefsAbsoluts`, `expectHref`, `waitForHydration` en lugar de `networkidle`; `mobile-safari` con 60 s).
  - **QA final de la fase 3: 1506 E2E pasados, 0 fallidos, 0 flaky** en los 3 proyectos (build de `591d0f3`).
- **FASE 3 TERMINADA — pendiente de aprobación del usuario.**
  - Cosmético pendiente (bajo): en el Alt Urgell, la separación en cascada desplaza algunos marcadores más de lo necesario (Monturull a 42,6 px).

- **Bloque 4a (terminado, 2026-09-30): registrar ascensiones.**
  - **Datos locales:** Dexie (`src/lib/data/ascensions.ts`, `local/db.ts`; BD `carnetdecims` v1, tablas `ascensions` y `outbox`; ids UUIDv7; reloj inyectable). CRUD con tombstones y restaurar; `ascensionsVives`/`ascensionsVivesAmbEstat`; export/import JSON versionado (fusionar LWW / substituir, en bloques de 200 con `onProgres`); `esborrarTot`; `demanarPersistencia`.
  - **UI:**
    - formulario de registro (combobox `SelectorCim`, fecha, método, nota ≤ 500) en sheet y en `/app/registrar`;
    - avisos no bloqueantes: restricción, repetición, > 100 al año;
    - toast "+1 → n/100" con sello y Desfés;
    - `/app/historial` por años;
    - `/app` con progreso mínimo;
    - `/app/compte` con "Les teves dades" (exportar, importar con barra de progreso, borrar todo).
  - **Rendimiento:** Dexie solo en un chunk diferido; precarga en reposo 3 s después de la primera interacción (permite registrar offline con la página ya cargada); error con "Torna-ho a provar" si el formulario no carga.
  - **SEO:** textos veraces con el registro disponible; `nofollow` en el CTA de registro; meta `noindex` en el HTML inicial de `/app` (`seo/robots-shell.ts`, `hooks.server.ts`, `hooks.client.ts`).
  - **Privacitat:** actualizada (datos solo en el dispositivo).
  - **QA:** `e2e/registre`, `historial`, `dades`; **810 E2E pasados** en los 3 proyectos (1 fallo intermitente de WebKit corregido en el test).
  - **Pendientes bajos (para 4b/4d):**
    - al abrir el error offline el foco cae en "Tanca" y no en "Torna-ho a provar";
    - "Importades n de N" queda detrás de la barra inferior;
    - durante la importación el foco se va a `<body>` (el botón se desactiva).
  - **A vigilar:**
    - importar en WebKit/Windows cuesta ~15 ms por petición a IndexedDB (2000 entradas ≈ 60 s): **medir en un iPhone real**;
    - descartado de momento no escribir `outbox` sin cuentas (reduciría el tiempo a la mitad), para no cambiar el diseño de la sync de la fase 5.

- **Bloque 4b (terminado, 2026-09-30): el carnet con sellos.**
  - **Dominio** `src/lib/domain/carnet.ts`:
    - `paginesCarnet` (I–V, 100 casillas por página; página I con la regla de esenciales §3.1; `enEspera` para no esenciales ≥ 2019-07-01 sin el 100; `fora` para > 500);
    - `resumCarnet`, `progresComarques`, `essencialsPendentsOrdenades`.
  - **UI:**
    - `/app` "El meu carnet": pestañas ARIA I–V, cuadrícula con sellos (solo la página visible; casillas vacías `aria-hidden` con resumen "Caselles buides: n–100");
    - detalle del sello en una hoja (foco vuelve al sello, también tras editar y reordenar);
    - `/app/essencials` (geolocalización solo al pulsar) y `/app/comarques` (`role="meter"`);
    - el historial marca "Fora del repte" las inválidas.
  - **SEO:** textos públicos en presente; privacitat menciona la ubicación opcional.
  - **QA:** `e2e/carnet.e2e.ts` + `PaginesCarnet.svelte.spec.ts`. **916 E2E pasados, 0 fallidos** en los 3 proyectos; 522 unitarios.

- **Bloque 4c (terminado, 2026-10-02): mapa interactivo.**
  - **Backend:**
    - `platform/mapa-estil.ts`: estilo vectorial ICGC claro/oscuro con `transformarEstil` (atribución exacta, relieve en oscuro, saneo de sprites y `text-size`: 0 avisos) y capa IGN de respaldo en Catalunya Nord (`mostraRespatllaIgn`);
    - `data/catalog/geojson.ts` y filtro compartido con `/cims` (`domain/filtres-cims.ts`);
    - `domain/a-prop.ts` (`cimsAProp` con rumbo).
  - **Frontend:**
    - `/mapa` con imagen estática ICGC (LCP y contenido sin JS) y MapLibre diferido (chunk ~275 kB gzip + worker propio, solo en `/mapa`);
    - clustering dibujado con tokens del tema, forma + color, filtros en query, sheet de cim (`?cim=`), conmutador Mapa|Llista, "La meva ubicació", ahorro de datos (solo con botón);
    - `/app/a-prop` "Cims a prop".
  - **SEO:** `/mapa` **indexable** (JSON-LD Map, en el sitemap, enlaces desde portada, `/cims`, listados y fichas); privacitat con los terceros del mapa (ICGC, IGN, Mapterhorn).
  - **QA:** `e2e/mapa.e2e.ts` (WebGL real en Chromium y WebKit; fallback sin WebGL). **1169 E2E pasados, 0 fallidos** en los 3 proyectos.

- **Bloque 4d (terminado, 2026-10-03): PWA instalable y offline.**
  - **Service worker nativo de SvelteKit** (`src/service-worker.ts`, lógica en `platform/sw/`):
    - precache del shell, los assets y 16 páginas (shells de `/app` y `/ca|es/offline`; ~520 kB gzip);
    - HTML público con stale-while-revalidate y LRU 200;
    - teselas cache-first con LRU 3000 (solo respuestas CORS 200);
    - MapLibre en caché solo tras visitar el mapa;
    - actualización controlada (SKIP_WAITING a petición).
  - **Contrato** `platform/pwa.ts`: `registrarServiceWorker`, `estatSW`, `aplicarActualitzacio`, `precarregarFitxes` (solo con wifi y sin ahorro de datos).
  - **Frontend:**
    - manifests por idioma (`id` común, dreceres, capturas) e iconos generados (`npm run pwa:icones`);
    - aviso de instalación tras la primera ascensión (hoja de instrucciones en iOS), banner de nueva versión y toast "Preparat per funcionar sense connexió";
    - `crossorigin` en los mapas estáticos (se guardan para offline).
  - **Rendimiento:** fallbacks métricos de fuentes y preload de Plex Mono; CSS inline (`inlineStyleThreshold`). Ficha: CLS 0,19 → 0; Perf 93–95.
  - **SEO:** textos en presente; privacitat con la caché del SW y las 2 preferencias en `localStorage`; favicons en `app.html`; Lighthouse portada 100/100/100/89.
  - **Config:** `paths.relative: false`; SW no se registra en dev (`VITE_SW_DEV=true` para forzarlo).
  - **QA:** `e2e/pwa.e2e.ts`; fixture `senyalHidratacio`; SW bloqueado por defecto en E2E.
- **FASE 4 TERMINADA (2026-10-03) — pendiente de aprobación del usuario.** Suite completa: **2072 E2E pasados, 0 fallidos, 0 flaky** en los 3 proyectos; 637 unitarios.

## Beta privada (bloque 5-exprés, 2026-10-09)

Objetivo del usuario: que Inesa pueda **crear su perfil el viernes 2026-10-10** y usar la app el sábado, con sus ascensiones **guardadas en la nube** hasta el lanzamiento.

- **Cuentas en la nube (commit `2a28381`):**
  - Supabase `ckqhdryopasitqtwjyys` (UE, eu-west-1); migraciones `0002`–`0004` aplicadas (RLS `user_id = auth.uid()`, `sync_push` LWW, `esborrar_compte` con la parte privilegiada en el esquema `privat`). Detalle y pasos del panel: `docs/09-supabase-auth.md`.
  - Entrada por **enlace o código de 6 cifras** por correo (el código sirve en la PWA instalada del iPhone). Sin contraseñas ni Google en la beta.
  - Sync con outbox + LWW + tombstones; en el primer inicio de sesión se suben los datos locales (o se pregunta si son de otra cuenta).
  - Pantallas: `/app/compte` (`CompteNuvol`), indicador de nube, aviso en la cabecera, exportar y borrar la cuenta.
  - Privacitat con responsable del tratamiento (nombre real **solo ahí**), Supabase como encargado (Irlanda), derechos y AEPD.
- **Modo beta** (`PUBLIC_MODE_BETA=true`, se lee al compilar): banner beta, `noindex` en meta y en `X-Robots-Tag`, sitemaps vacíos. Los E2E se ejecutan con `PUBLIC_MODE_BETA=false`.
- **Publicación (commit `90dc423`):** Cloudflare Workers (`carnetdecims`); dominio y correo siguen en Hostinger.
  - **https://carnetdecims.cat** (custom domain) y https://carnetdecims.carnetdecims.workers.dev. Verificado el 2026-10-09: 200 en `/ca`, `/ca/app`, `/es/app/cuenta` y `/api/meteo/…`; `noindex, nofollow` en cabecera y meta.
  - DNS en Cloudflare (lee/sofia.ns.cloudflare.com): MX, SPF, DMARC y DKIM (a/b/c) de Hostinger en "DNS only"; borrados el A del apex y el CNAME de `www` de Hostinger.
  - Despliegue: compilar con `PUBLIC_MODE_BETA=true` y `npx wrangler deploy` (sesión OAuth de wrangler ya hecha). Mejor desde un worktree aparte si hay un servidor de dev/preview abierto (EPERM en `.svelte-kit/cloudflare`).
  - `www.carnetdecims.cat`: 301 al apex desde el 2026-10-18 (Redirect Rule; ver "Fase 5 · cierre").
- **Pendiente del usuario (bloquea a Inesa):**
  1. Supabase → URL Configuration: Site URL `https://carnetdecims.cat`; Redirect URLs `https://carnetdecims.cat/**`, `https://carnetdecims.carnetdecims.workers.dev/**`, `http://localhost:5190/**`.
  2. Supabase → **SMTP propio** (`smtp.hostinger.com`, 465 SSL, `hola@carnetdecims.cat`; la contraseña solo en el panel). Sin esto, el correo solo llega a los miembros de la organización de Supabase.
  3. Plantilla **Magic Link** de `docs/09` §2.3.
  4. Probar el registro con su propio correo; después, pasar el enlace a Inesa.
  5. Hostinger → Correos → "Comprobar estado" del DKIM en verde.
- **QA de cuentas** (`e2e/compte.e2e.ts`, 26 tests con Supabase simulado en `e2e/supabase-fals.ts`; ningún correo real). 4 bugs corregidos y verificados (`30caf43`, publicado el 2026-10-10): ids de otra cuenta ("id en ús") reasignados al subir; email inválido; texto de "Esborra totes les dades" con sesión; banner solo en beta. E2E: 412 pasados, 1 intermitente de WebKit (`pwa.e2e.ts:400`, `import()` abortado por `page.goto`).
- **Pendientes no bloqueantes de cuentas:** todos resueltos en el bloque "Fase 5 · cierre" (más abajo); la tolerancia de `pwa.e2e.ts` ya estaba desde `173ae45`.

## Bloque 6b (terminado, 2026-10-10; publicado en carnetdecims.cat)

- **Contenido:** 50 fichas en `esborrany` (10 pilotos + 40). Revisión SEO de las 50: FAQ "compta com a essencial" propia de cada cim, frases plantilla reescritas, errores corregidos (la Tosa en telecabina no compta, Agudes, Santa Fe, Àngels, nombres de fuentes). Sin cambios de datos numéricos.
  - **Para que el usuario revise:** Puig de l'Àliga (`tempsMinuts: 75`, ritmo con niños de Totnens) y Pilar d'Almenara (7 min de ida); los pasos `grimpada-facil` de Castellsapera, Talaia del Montmell, Tristaina, Mola de Colldejou y Carlit.
- **Correcciones del usuario del 2026-10-05:** aplicadas (Caro 1.441 m, La Fita Alta 286 m, Valarties en el Montardo, Burriac SL-C 114/115, notas del Montgrí y Saverdera).
- **Listados:** `/cims-facils` (11) y `/cims-amb-nens` (8), ya indexables (≥ 3). En amb nens cada cim muestra "Des de {ruta}", desnivel y tiempo de ida, y el distintivo de la ruta con niños (Burriac y Santa Fe no usan la ruta normal). Enlaces desde portada, `/cims` y pie.
- **SEO:** "Cómo subir a Els Àngels" (artículo plural) con test sobre todo el catálogo.
- **Correcciones de QA:** H1 de la ficha con saltos por 9 tramos de ancho (CLS 0 al cargar Archivo en tablet); carrera borrado local ↔ sync resuelta con `meta.epoca` (las pasadas en curso abortan sin escribir).
- **QA:** E2E ampliados a las 50 fichas con oráculo independiente (`e2e/fitxes-contingut.ts`). Pasada completa: 2806 pasados; verificación final 744/744 en los 3 proyectos; 1002 unitarios.
- **No bloqueantes:** a 960 px la cabecera de algunas fichas crece +23 px al cargar la fuente (no es el H1; posiblemente los botones); si un push ya ha salido cuando se borran los datos locales, esas filas llegan a la nube (habrían llegado igual).

## Bloque 6c (terminado, 2026-10-11; publicado en carnetdecims.cat) — FASE 6 TERMINADA, pendiente de aprobación del usuario

- **Contenido:** las **150 esenciales tienen ficha** (`src/lib/content/fitxes/`, todas en `esborrany`; solo el usuario marca `revisat`). 100 fichas nuevas en 4 tandas, redactadas con Sonnet y **revisadas enteras con Opus abriendo las fuentes** (`e4abc78`, `6f623c0`, `084d02e`).
- **Listados:** Cims fàcils 14, Cims amb nens 9.
- **Catálogo:** `el-tossal-gros` era el homónimo equivocado (Mont-ral, 844 m) → **Tossal Gros de la serra de Miramar** (867 m; `595f64d`). Auditoría: los 150 cims quedan a ≤ 119 m de un elemento de Wikidata etiquetado en la lista de la FEEC. Pendiente bajo: 46 búsquedas ICGC llegan al tope de 25 resultados sin aviso (añadir una alerta al informe del build).
- **QA (`ec171b7`):** pasada completa de 4866 E2E: 3457 pasados, 1398 saltados por diseño, 11 fallidos que eran del test (sondas que coincidían con nombres del catálogo, un grupo de CLS demasiado grande, un timeout) y ya pasan; ningún bug de la app. 1205 unitarios. La batería por ficha corre entera en desktop-chrome y con las 10 pilotos en móviles.
- **Publicación:** se compila con `PUBLIC_MODE_BETA=true` en un worktree aparte y `npx wrangler deploy`. En producción está `084d02e` (los commits posteriores son solo tests y docs).

**Lección sobre modelos (2026-10-11):** los borradores de Sonnet tuvieron 1,0–1,5 errores de hecho por ficha (8–12 serios por tanda) incluso con el encargo estricto ("cita literal o no se escribe", archivo de notas, comillas dobles); la revisión completa de Opus costó tanto o más que redactar. **Para fichas futuras: redactar con Opus y con el encargo estricto; Sonnet solo para QA de suites y tareas mecánicas.** Reglas del encargo que funcionaron: cita literal por cada cifra; campos numéricos solo de ida y con fuente no-blog; `tecnicitat` solo con la frase de la fuente sobre la ruta de subida; no comentar las fuentes en el texto público; altitud y comarca del catálogo; regulaciones con año y "consulta la regulació vigent"; no usar la versión `/en/` de las fuentes; leer el itinerario cronometrado entero; buscar "tancat / obres" en la web municipal.

**Para la revisión humana (JSR), antes de marcar `revisat`:**

- **Técnica dudosa:** Pic de Certascan, Montgròs, Bassegoda (¿grapas y cadenas?), Elefant (¿II y cuerda fija?), Cavall Bernat de Llaberia (II; estado del equipamiento), Roques de Benet, Pic de Sotllo, Comaloforno.
- **Fuentes solo de blog:** Mont-roig, Tuc de la Llança (solo reseña invernal), Monturull, Vulturó, Cogulló de Turp, Cap del Verd, Puig Peric, Tretzevents, Salòria, y 13 rutas del sur (Reptes Muntanyencs); 22 de las 24 fichas del sur muestran la dificultad "aproximada".
- **Datos a confirmar:** Rocallarga (70 min, suma de dos tramos), Pic del Vent (¿2 km / 35 min son de ida?), Puig de l'Àliga (75 min), Pilar d'Almenara (7 min), Sant Salvador de les Espases (camino cerrado en 2024; sin cifras a propósito), lo Tormo (¿dentro del Parc de Montsant?), Sant Mamet (estado de la ermita), Balandrau (mención del temporal del 30-12-2000).
- **Comarca del catálogo discutible** (limítrofes; prevalece el ICGC): Cap del Verd, Monturull, Penyes Altes, Pic de Peguera, Tuc de la Cometa, Tuc de Ratera, Gran Tuc de Colomèrs, Castell de Milany, Turó de la Magarola, Tossal d'Engrilló, Mola de Genessies, Mola d'Estat, la Mola (Tarragonès), Creu de Santos, Cabrera.
- `wikiloc` vacío en las 100 fichas nuevas.

**Uso:** el 2026-10-11 el límite semanal del plan Pro estaba al 83 % (se restablece el 2026-10-16). El bloque siguiente se empieza en una **sesión nueva**.

## Bloque R1 · Estadístiques i diari (terminado, 2026-10-17; `86f3057`)

- **Backend (`a5cb659`):**
  - `domain/estadistiques.ts`, `diari.ts`, `municipis.ts` (puros, con tests). Las ascensiones "fora del repte" no cuentan, salvo en "amb qui has pujat més".
  - Municipios ICGC por script (`npm run municipis:build`): 947 de Catalunya + 7 parroquias de Andorra + 26 poblaciones de la Catalunya Nord. Se sirven como asset JSON con hash, pedido con `fetch` (en el precache del SW).
  - `companys` en la ascensión (cliente ≤ 10 × 40; servidor ≤ 20 × 80). Dexie v3 (`preferencies`). Exportación v2 (importa v1).
  - **Migración 0005 aplicada en Supabase el 2026-10-16** (`companys`, `sync_push` compatible con el cliente viejo, `perfils.origen_*`, RPC `sync_origen`). Tipos regenerados y comprobados. La lógica plpgsql **no se ha probado contra Postgres** (el usuario no autorizó la prueba con un usuario real); la cubren los unitarios y `e2e/supabase-fals.ts`.
- **Frontend (`34b90c5`):** `/ca/app/estadistiques` y `/es/app/estadisticas`, `SelectorMunicipi`/`OrigenMunicipi` (en `/app/compte` y desde "El cim més llunyà"), `CampCompanys` en el registro, filtro "Només el diari" en el historial.
- **SEO (`a8a37aa`, `b41b611`):** privacitat (municipio, compañeros como datos de terceros, catálogo local), metodologia (fuente ICGC, cálculo del cim més llunyà), textos ca/es, full de ruta de "Sobre el projecte" al día.
- **Lápidas (`45cb215`, decisión del usuario):** pasados 10 min (`FINESTRA_DESFER_MS`) se vacían nota y compañeros, en local y en la nube (`updatedAt` + 1 ms).
- **QA (`133269a`, `86f3057`):** 55 E2E nuevos por proyecto. Suite completa: 3665 pasados, 4 fallidos (frágil corregido y entorno WebKit; pasan aislados), 0 flaky. Bugs corregidos: fila anterior a R1 que borraba compañeros del servidor al editarla; reintento del selector de municipios y del mapa en Chromium; foco y región viva en `OrigenMunicipi`; claves duplicadas en `CampCompanys`. 1386 unitarios.
- **Decisiones del usuario (2026-10-16):** se quedan las 26 poblaciones de la Catalunya Nord, `NOTA_MAX` 500, altitud acumulada por cimas distintas y el Repte infantil visible para todos.
- **Sin probar:** migración Dexie v3 desde una PWA real instalada, lectores de pantalla reales, dispositivos físicos.
- **Bajos pendientes:** al elegir el origen desde la sheet de estadísticas, "Municipi desat" no se anuncia (se cierra antes); el primer recuento de `SelectorMunicipi` puede no anunciarse; una fila con > 10 compañeros (cliente futuro) no se puede editar en este cliente.

## Bloque R2 · Reptes, medalles i "El teu proper cim" (terminado y publicado, 2026-10-17; Worker `8c5e4228`)

- **Dominio (`fc5c498`, `0a76d6c`, `56f271a`):** `domain/reptes.ts` (motor: el reto es un dato y `avaluarRepte`/`avaluarReptes`/`medalles` son funciones puras), `massissos.ts` (lista curada y validada contra el catálogo) y `proper-cim.ts` (puntuación con motivos y ajuste con la meteo). Reglas en docs/03 §3.6.
  - Retos: 100 Cims (destacado; **completado al llegar a 100**, una medalla por nivel I–V), Repte infantil, Totes les comarques (43), Les 4 estacions (meteorológicas, por año natural), 12 mesos 12 cims (cim **nuevo de verdad**, puede cruzar el año) y 7 massissos (Montseny 4 con Montsoriu, Montserrat 3, Sant Llorenç 3, Ports 5 con Santa Bàrbara, Cadí-Moixeró 5 con Pedraforca y la Tosa, Prades 3, Montsec 3).
  - Los retos propios cuentan cims distintos, incluidas las ascensiones anteriores a 2006; no cuentan las borradas, las futuras ni las de método motorizado.
- **UI (`75866ab`, `338fb78`):** `/ca/app/reptes` (`/es/app/retos`) y el detalle `/…/{slug}` con slug por idioma; medallas en estadísticas con toast al conseguirlas; "El teu proper cim" en `/app` (6 candidatas → meteo → 3; sin conexión usa la previsión guardada); `/api/dificultats.json` prerenderizado y en el precache; Reptes en el rail de escritorio (en móvil, enlace desde `/app`).
  - **Novetats tras cada actualización** (petición del usuario): entradas en `src/lib/content/novetats.ts` y clave `carnetdecims:novetat-vista`; los usuarios nuevos no lo ven. **En cada publicación con cambios visibles, añadir una entrada.**
- **SEO (`b8e306c`):** portada como "carnet de muntanya", con el 100 Cims como reto destacado; privacitat, metodologia (retos y recomendación) y full de ruta actualizados.
- **QA (`b8a84e0`, `91bab0b`, más correcciones de Claude):** `e2e/reptes.e2e.ts` (61 tests por proyecto): **366/366 en los 3 proyectos con `--repeat-each 2`**. Suite completa en desktop-chrome: 1699 pasados (2 timeouts por carga, ya ajustados). 1459 unitarios. Build OK.
- **Bajos pendientes:** el toast del 100.º cim dice "100/200"; `compte.e2e.ts:244` es intermitente en mobile-safari (también antes de R2).

## Bloque R3 · Compartir i validar (terminado y publicado, 2026-10-18; Worker `6977e9b5`; verificado: 200 y `noindex, nofollow` en las páginas nuevas ca/es)

- **Dominio (`10c4b7a`, `8e2146d`):** `domain/validacio.ts` (`exportValidacio`: filas del año que cuentan para el 100 Cims con avisos `restriccio`, `restriccio-incerta`, `repetit`, `mes-de-100`, `en-espera`; excluidas con motivo; `terminiValidacio` 31/12; `csvValidacio` con BOM, `;`, CRLF y protección contra fórmulas). `domain/carnet-compartit.ts` + `platform/compressio.ts` + `data/compartir.ts`: enlace de solo lectura en el fragmento (`/ca/carnet#c=…`), formato binario v1 (varints, nombre opcional ≤ 40, un sello por cim y **medallas de quien comparte**), lectura estricta (base64url canónico, límite contra bombas de descompresión, cims desconocidos y fechas futuras descartados). 100 ascensiones + 10 medallas ≈ 465 caracteres de URL. Reglas en docs/03 §3.7.
  - **Ids del catálogo fijados** (`catalog/ids-estables.json` + test): la lista solo puede crecer por el final. Códigos de reto propios en `CODIS_REPTE_COMPARTIT` (solo crecen).
- **UI:** `/ca/app/validacio` (`/es/app/validacion`): año, "solo a partir de", termini, avisos con texto, excluidas, CSV e impresión/PDF con huecos a mano para nombre, DNI, licencia y entidad (no se guardan). `/app/compartir`: imagen 1080×1350 en canvas (`navigator.share` con archivo o descarga) y enlace con nombre opcional. Pública `/ca|es/carnet` (prerender del shell, `noindex, nofollow` en meta y `X-Robots-Tag` vía `_headers`, fuera del sitemap, en el precache del SW). Entradas desde `/app`, historial y compte. Novetat `2026-10-18-compartir-validar`.
- **SEO (`6cc31d9`):** textos ca/es, privacitat (sección compartir: el fragmento no llega nunca al servidor), metodologia (lista de validación), com-validar y sobre el projecte.
- **QA (`e2e/r3.e2e.ts`, 28 tests por proyecto):** 166 pasados, 0 fallidos, 0 flaky en los 3 proyectos con `--repeat-each 2` (2 saltados: offline en WebKit). Regresión (carnet, historial, reptes, pwa, compte, contingut): 893 pasados, 3 intermitentes de carga/WebKit (uno tolerado en el test). 1561 unitarios. Bugs corregidos: impresión global que dejaba otras páginas en blanco, falsa alarma de restricción en Sant Salvador de les Espases, medallas perdidas en el enlace, año por defecto futuro, apóstrofo catalán.
- **A confirmar con 100cims@feec.cat** (docs/03 §3.7): si el 31/12 entra en plazo; si las repeticiones se presentan; si los no esenciales en espera cuentan para el máximo de 100 al año.
- **Sin probar:** `navigator.share` y portapapeles en móviles reales; impresión real a papel/PDF; offline en WebKit.
- **Bajos pendientes:** el cambio de idioma en `/carnet` probablemente pierde el fragmento; `platform/fitxers.ts` no tiene `descarregarBlob` (helper inline en la página); `municipis/carrega.spec.ts` intermitente bajo carga.

## Bloque R5 · Detalls útils (terminado y publicado, 2026-10-18; Worker `17f3906d`; verificado: 200 en `/ca`, `/ca/cims`, fichas, `/ca/mapa?cim=`, `/ca/app/essencials`, `/ca/app/historial`; `/api/meteo/ara` con las 150 cims; `noindex, nofollow`)

- **Compartir una ascensión (`0bdaa68`):** `CompartirAscensio.svelte` en historial (`FilaAscensio`) y en `DetallSegell`. Imagen 1080×1350 (`ui/compartir/imatge-ascensio.ts`; código común en `imatge-comu.ts` y `compartir-fitxer.ts`, también usados por el carnet de R3) con cim, altitud, comarca, día y "carnetdecims.cat"; sigue el tema del dispositivo; nunca nota, compañeros ni método.
- **Tiempo actual y restricciones en las listas** (`/cims`, `/app/essencials`): `GET /api/meteo/ara` (una foto de las 150 cims por hora y centro de datos, en `caches.default`; llamada multipunto a Open-Meteo en trozos de 100; STALE hasta 3 h). En producción la primera llamada en frío superaba los 8 s y siempre daba 502: corregido en `ac9777f` (timeout propio de 25 s, foto en segundo plano con `waitUntil`, espera máxima de 6 s, 503 `meteo_en_preparacio` con `retry-after`, pausa de 60 s tras error). Cliente `obtenirMeteoAra()` (nunca lanza; sin red, sin iconos). Restricciones con `restriccionsVigents()` en el cliente; Sant Salvador de les Espases como "Possible restricció… comprova-ho", nunca "tancat". En móvil la info va en una segunda línea de altura fija (sin CLS). Reglas en docs/03 §3.8.
- **Mapa interactivo desde la ficha:** la imagen estática enlaza (`nofollow`) a `/{ca|es}/mapa?cim={slug}`, que ya centraba y abría la cima.
- **Wikiloc:** `/openMap?sw=..&ne=..` en lugar de `/wikiloc/map.do` (que no está en el `apple-app-site-association`); sin la app redirige al mismo mapa web.
- **SEO (`2ab70e7`):** apostrofación de fechas ("del dia {date}"), privacitat (la petición del tiempo pide siempre todo el catálogo), metodologia (nueva sección y atribución Open-Meteo CC BY 4.0), full de ruta. Novetat `2026-10-18-detalls-utils`.
- **QA (`72e46b0`, `c84272e`):** `e2e/r5.e2e.ts` (113 por proyecto). Desktop-chrome (r5, fitxa-cim, pwa, historial, r3, carnet): 300 pasados, 0 fallidos. Mobile-chrome + mobile-safari (r5, fitxa-cim, pwa): 468 pasados, 1 fallo de entorno WebKit ya tolerado. 1637 unitarios. Bugs corregidos: desborde a 320 px en essencials por proximidad, nombre estrecho en móvil, solape de 2 px en WebKit, restricción incierta solo con "?".
- **Entorno:** un `wrangler dev` huérfano en :4173 (reutilizado por Playwright con `reuseExistingServer`) colgaba los E2E; si pasa, matar el árbol entero de `wrangler dev`, no solo `workerd`.
- **Open-Meteo:** cuenta cada punto como una llamada (límite 600/min y 10.000/día); hoy ~3.600/día por centro de datos más `/api/meteo/{slug}`. Con el catálogo de 522 hará falta alargar la frescura o reducir puntos.
- **Sin probar:** Wikiloc `/openMap` en Android e iPhone con la app (y desde la PWA instalada); "enrere" desde `/mapa?cim=` en iPhone real; `navigator.share` de la imagen en móviles reales.
- **Bajos pendientes:** `restriction_from`/`restriction_until` de la ficha ("Des del 1…", "Fins al 11…") con el mismo fallo de apostrofación; la imagen del carnet de R3 siempre en claro.

## Fase 5 · cierre (terminado y publicado, 2026-10-18; Worker `f6595d7d`; verificado: 200 y `noindex, nofollow` en `/ca`, `/ca/app`, `/es/app/cuenta`, privacitat ca/es con el texto nuevo, `/ca/cims`, `/api/meteo/ara`; `www` → 301)

- **Deduplicación** (`dc55958`; regla en docs/03): dos ascensiones **vivas** con el mismo `cimId`, `data` y `metode` son la misma. Ganadora determinista (`createdAt` más antiguo, luego id menor); notas unidas (si pasan de 500, la más reciente) y companys unidos (≤ 10); `updatedAt` = máximo del grupo + 1 ms, así dos dispositivos convergen sin bucles. Se aplica tras el pull (`resoldreDuplicats`, perdedoras a lápida vacía) y en `importarDades` (ambos modos; reimportar el JSON de otra cuenta = 0 añadidas). Dexie **v4** `redireccions` (idVell → idNou, por `id en ús` o duplicado): editar, Desfés y borrar siguen la redirección. **Sin migración de Supabase.**
  - Riesgo aceptado (a confirmar por el usuario): dos registros intencionados del mismo cim, día y método se fusionan.
- **Google OAuth, desactivado** (flag de build `PUBLIC_GOOGLE_AUTH`, `"false"` en `wrangler.jsonc`; `platform/flags.ts`): `entrarAmbGoogle`, `BotoGoogle.svelte` (directrices de Google, claro/oscuro), error `cancelat`, `cloud_intro_how_google`, privacitat con variante Google (`privacitatAmbGoogle`, elegida en build). Pasos para el usuario: **`docs/12-google-oauth.md`**. **Activado el 2026-10-18** (`PUBLIC_GOOGLE_AUTH: "true"`; probado en local por el usuario con su cuenta; **publicado** en el Worker `b851bba6`, verificado en producción: botón visible en `/es/app/cuenta`, ida y vuelta con Google con la sesión iniciada, privacitat ca/es con Google Ireland). La app de Google sigue en «Testing» (solo usuarios de prueba); antes de «Publicar app», cambiar el correo de asistencia a `hola@carnetdecims.cat`. Al activarlo: cambiar `actualitzat` de privacitat.
- **Sync bloqueada:** `EstatSync.bloquejades` con texto propio y "Descarrega una còpia"; el toast de la sync manual se sustituye en lugar de apilarse.
- **SEO:** textos ca/es revisados, privacitat (deduplicación), novetat `2026-10-18-sense-duplicats`.
- **QA:** `e2e/duplicats.e2e.ts` (12 por proyecto) y `e2e/google-actiu.google.ts` con config propia (`npx playwright test -c e2e/playwright.google.config.ts`, `vite dev` en :5192 con el flag activo). `supabase-fals.ts` con `rebutjarIds`. 1689 unitarios.
- **`www.carnetdecims.cat` → apex (hecho en el panel el 2026-10-18, con permiso del usuario):** registro `A www → 192.0.2.1` con proxy y Redirect Rule "www.carnetdecims.cat -> carnetdecims.cat (301)" (`http*://www.carnetdecims.cat/*` → `https://carnetdecims.cat/${2}`, conserva la query). Verificado con curl: 301 en http y https, con ruta y query.
- **Bajos:** "substituir" sin E2E (la UI solo ofrece fusionar); tras un error 503 no hay reintento automático hasta `online`/visibilidad/5 min; un dispositivo que recibe por pull la lápida de una perdedora no guarda redirección (si tenía la hoja abierta, "no trobada").

## Fase 5 · contrasenya (terminado, 2026-10-18; **no publicado**; flag desactivado)

- **Qué es:** entrar con correo + contraseña como **tercera vía** (Google arriba, después correo + contraseña y, al final, "Prefereixo rebre un enllaç o un codi"). Detrás del flag de build `PUBLIC_PASSWORD_AUTH` (`"false"` en `wrangler.jsonc`; `contrasenyaAuthActiu` en `platform/flags.ts`). Con el flag desactivado la pantalla es la de hoy.
- **Backend (`64f2cf8`):** `crearCompteAmbContrasenya` (signUp; devuelve `'confirmar-correu'` también si el correo ya existe, sin revelarlo), `entrarAmbContrasenya`, `reenviarConfirmacio`, `demanarRestabliment`, `canviarContrasenya` (también para quien entra con enlace o Google), `modeRecuperacio` (`?token_hash=…&type=recovery` o evento `PASSWORD_RECOVERY`; `completarEntradaDesDeUrl` devuelve `'recuperacio'`). Códigos nuevos de `ErrorCompte`: `credencials`, `correu-no-confirmat`, `contrasenya:*` (curta, llarga, buida, igual-correu, feble, filtrada, igual), `reautenticacio`, `no-disponible`. `domain/contrasenya.ts`: mínimo 10 caracteres, máximo 72 bytes, sin reglas de composición. **Sin migración.**
- **Frontend (`5667eb8` + foco):** `EntradaContrasenya` (pestañas Entra / Crea un compte, he oblidat), `CanviContrasenya` (panel de recuperación y sección "Contrasenya" del perfil), `CampContrasenya` (mostrar, aria-describedby, autocomplete). Sin campo de repetir contraseña (hay botón de mostrar). El foco tras entrar (con cualquier vía) va al aviso de primer acceso: antes caía en `<body>`, también con el código.
- **SEO (`11b65de`, `f2a42bc`):** privacitat con variante de contraseña (`privacitatSegons(google, contrasenya)`; sin flag, el texto publicado no cambia), novetat `2026-10-18-contrasenya` que solo se ve con el flag (`novetats-llista.ts`, `nomesSi`), textos ca/es revisados.
- **QA (`a7624e5`):** `e2e/contrasenya.contrasenya.ts` con su config (`npx playwright test -c e2e/playwright.contrasenya.config.ts`, `vite dev` en :5193 con los flags de contraseña y Google): **75/75 en los 3 proyectos** (axe claro/oscuro, 44 px, 375 px). `supabase-fals.ts` con signup, password, resend, recover, verify recovery y `PUT /user`. `compte.e2e.ts` con un test "sense PUBLIC_PASSWORD_AUTH" (34/34 en desktop-chrome; ver abajo móviles). 1741 unitarios.
- **Supabase está en plan Free:** la protección de contraseñas filtradas es de Pro; el código ya traduce el error por si se activa.
- **Panel de Supabase (2026-10-18, con permiso del usuario):** hecho «Minimum password length» = 10 (verificado tras recargar). Ya estaban: «Secure password change» y «Require current password» desactivados; «Prevent leaked passwords» no disponible (Free); OTP de 8 cifras y 1 h. Plantillas Confirm sign up y Reset Password pegadas por el usuario y comprobadas (asunto, `token_hash`, `type`, `{{ .Token }}`). Falta la prueba real del usuario en local.
- **Para activarlo (usuario):** pasos del panel en **`docs/13-contrasenya.md`** (longitud mínima 10, "Secure password change" desactivado, plantillas Reset Password y Confirm signup en ca/es), probar en local con una cuenta de prueba, `PUBLIC_PASSWORD_AUTH: "true"`, cambiar `actualitzat` de privacitat y la fecha/id de la novetat, y publicar.
- **Decisión pendiente del usuario (RGPD):** si el SMTP de Hostinger ya está activo, Hostinger es un encargado más que la privacitat publicada no nombra.
- **Bajo:** al recargar en modo recuperación se pierde el panel (la sesión sigue; se cambia desde el perfil).

## Siguiente

R1, R2, R3 y R5 publicados. Comparativa con Fes Cims hecha (`docs/10-comparativa-fes-cims.md`, 2026-10-18). Cierre de la fase 5 publicado (Worker `f6595d7d`; Google en `b851bba6`); Google activado (app de Google en «Testing»); `www` → apex activo. Entrar con contraseña hecho y desactivado (`docs/13`; lo activa el usuario). Después: fase 7 (lanzamiento) y **R6 · notificaciones push** (pendiente; cuándo hacerlo lo decide el usuario).

Histórico de la fase 6 (6a, 6a-bis): en `git log` y en `docs/07-guia-contingut.md`.

## Pendiente o decisiones abiertas

- **Apuntes del usuario del 2026-10-17:** en `docs/08-ideas-producte.md` ("Apunts nous"): R5 y la comparativa con Fes Cims hechos; fotos y panel de administrador en la fase 5+.

- **Comparativa con Fes Cims (`docs/10`, §5):** 10 recomendaciones para antes del lanzamiento. Las de prioridad alta: indexar un primer lote de fichas populares, decidir la comarca de 5 cimas limítrofes (Mola d'Estat, que el ICGC pone en Prades, Baix Camp; Cap del Verd, Monturull, Tuc de Ratera y Castell de Milany), explicar en metodologia por qué la altitud difiere de otras apps, y tomar una línea base en Google.es y Search Console. Lo que falta para superarles está en docs/08, puntos 9–14 (fichas indexadas y las 522, primero).

- **Notificaciones push (R6, pendiente de implementar; apunte del usuario del 2026-10-18):** Web Push para Android/escritorio e iPhone con la PWA instalada. Plan en `docs/04-plan-fases.md` (bloque R6) y en docs/08, punto 8.

- **Datos de prueba en la cuenta del usuario (2026-10-18):** al entrar con Google en `localhost` del navegador integrado se subieron 21 ascensiones de prueba (creadas el 10, 11, 17 y 18 de octubre). Las revisa y borra el usuario. Las pruebas de desarrollo, en otro perfil de navegador.
- **Fase 5:** para abrir Google a todos: correo de asistencia `hola@carnetdecims.cat` en Google Cloud y «Publicar app» (`docs/12`).
- **Probar en dispositivos reales:** instalación en Android e iPhone; offline en iPhone (WebKit de Playwright no lo permite); tiempo de importación en iPhone.
- **Rendimiento pendiente:** LCP de la ficha ~2,7–2,9 s (objetivo < 2,5 s): subsetear la woff2 de Archivo (90 kB); `/mapa` Perf 59 (TBT de MapLibre); `og:image` de las fichas (prevista).

- **Titular y contacto** (decisión del usuario, 2026-09-29): el titular es "Carnet de Cims" (nombre del proyecto) y el email **hola@carnetdecims.cat**. Buzón creado en Hostinger (2026-10-09); será el remitente del SMTP de Supabase.

- Reglas ambiguas del reto: interpretación por defecto en `03-modelo-datos.md` §3.3.
- Restricciones de acceso: cargadas las 2 esenciales afectadas; hay que revisarlas antes del lanzamiento.
- Pendientes de confirmar: "Pic d'Enclar (Bony de la Pica)" y "La Tossa (Tivissa)" (nombre visible con paréntesis).
- **Fichas:**
  - Tienen unas 360 palabras y el mínimo para indexar es 400: ninguna se marca `revisat` hasta tener el contenido de la fase 6.
  - Falta el campo `data_revisio` (para `lastmod`).
- **Wikiloc:** sin filtro de actividad (no se ha podido verificar el parámetro); en el Montcau son relevantes unas 11 de 24 rutas.
- Las páginas de comarca con < 3 cims son `noindex`: hay que revisar el umbral en la fase 6 o con el catálogo de 522.
