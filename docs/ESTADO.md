# Estado del proyecto

> Se actualiza al final de cada bloque. Última actualización: 2026-10-10.

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
  - `www.carnetdecims.cat`: sin configurar (más adelante, redirección al apex).
- **Pendiente del usuario (bloquea a Inesa):**
  1. Supabase → URL Configuration: Site URL `https://carnetdecims.cat`; Redirect URLs `https://carnetdecims.cat/**`, `https://carnetdecims.carnetdecims.workers.dev/**`, `http://localhost:5190/**`.
  2. Supabase → **SMTP propio** (`smtp.hostinger.com`, 465 SSL, `hola@carnetdecims.cat`; la contraseña solo en el panel). Sin esto, el correo solo llega a los miembros de la organización de Supabase.
  3. Plantilla **Magic Link** de `docs/09` §2.3.
  4. Probar el registro con su propio correo; después, pasar el enlace a Inesa.
  5. Hostinger → Correos → "Comprobar estado" del DKIM en verde.
- **QA de cuentas** (`e2e/compte.e2e.ts`, 26 tests con Supabase simulado en `e2e/supabase-fals.ts`; ningún correo real). 4 bugs corregidos y verificados (`30caf43`, publicado el 2026-10-10): ids de otra cuenta ("id en ús") reasignados al subir; email inválido; texto de "Esborra totes les dades" con sesión; banner solo en beta. E2E: 412 pasados, 1 intermitente de WebKit (`pwa.e2e.ts:400`, `import()` abortado por `page.goto`).
- **Pendientes no bloqueantes de cuentas:**
  - importar dos veces el JSON de **otra** cuenta duplica (el id viejo se borra al reasignar): guardar el mapeo idVell → idNou en `meta` o deduplicar por (cim, fecha, método, createdAt);
  - si la hoja de edición o el "Desfés" está abierto justo cuando se reasigna un id, sale un error genérico (sin pérdida de datos);
  - texto propio para entradas de sync bloqueadas (hoy, `cloud_sync_error` genérico);
  - tolerar en `pwa.e2e.ts:400` el `import()` abortado en WebKit.

## Bloque 6b (terminado, 2026-10-10; publicado en carnetdecims.cat)

- **Contenido:** 50 fichas en `esborrany` (10 pilotos + 40). Revisión SEO de las 50: FAQ "compta com a essencial" propia de cada cim, frases plantilla reescritas, errores corregidos (la Tosa en telecabina no compta, Agudes, Santa Fe, Àngels, nombres de fuentes). Sin cambios de datos numéricos.
  - **Para que el usuario revise:** Puig de l'Àliga (`tempsMinuts: 75`, ritmo con niños de Totnens) y Pilar d'Almenara (7 min de ida); los pasos `grimpada-facil` de Castellsapera, Talaia del Montmell, Tristaina, Mola de Colldejou y Carlit.
- **Correcciones del usuario del 2026-10-05:** aplicadas (Caro 1.441 m, La Fita Alta 286 m, Valarties en el Montardo, Burriac SL-C 114/115, notas del Montgrí y Saverdera).
- **Listados:** `/cims-facils` (11) y `/cims-amb-nens` (8), ya indexables (≥ 3). En amb nens cada cim muestra "Des de {ruta}", desnivel y tiempo de ida, y el distintivo de la ruta con niños (Burriac y Santa Fe no usan la ruta normal). Enlaces desde portada, `/cims` y pie.
- **SEO:** "Cómo subir a Els Àngels" (artículo plural) con test sobre todo el catálogo.
- **Correcciones de QA:** H1 de la ficha con saltos por 9 tramos de ancho (CLS 0 al cargar Archivo en tablet); carrera borrado local ↔ sync resuelta con `meta.epoca` (las pasadas en curso abortan sin escribir).
- **QA:** E2E ampliados a las 50 fichas con oráculo independiente (`e2e/fitxes-contingut.ts`). Pasada completa: 2806 pasados; verificación final 744/744 en los 3 proyectos; 1002 unitarios.
- **No bloqueantes:** a 960 px la cabecera de algunas fichas crece +23 px al cargar la fuente (no es el H1; posiblemente los botones); si un push ya ha salido cuando se borran los datos locales, esas filas llegan a la nube (habrían llegado igual).

## Siguiente

**Fase 6 · Contenido** (en curso; el usuario eligió adelantarla a la 5, el 2026-10-03, porque la 5 requiere acciones suyas).

- **Bloque 6a (terminado, 2026-10-04; QA: 882 E2E pasados, 0 fallidos en los 3 proyectos):** contrato `src/lib/content/fitxes/types.ts` (descripció, rutes d'accés con MIDE y fuentes, consells, FAQ, Wikiloc, `estat`); guía `docs/07-guia-contingut.md`; **10 fichas piloto** (Pedraforca, Pica d'Estats, Puigmal, Canigó, Matagalls, Montcau, Sant Jeroni, Comapedrosa, La Mola, Taga); meteo con Open-Meteo vía `/api/meteo/{slug}` (caché de 3 h en el Worker); Wikiloc click-to-load.
- **Decisiones de Claude, pendientes de que el usuario las confirme:**
  1. Todo el contenido redactado por agentes queda en `estat: 'esborrany'`. **Solo el usuario puede marcar `revisat`**, que es lo que hace indexable la ficha.
  2. Primero un piloto de 10 fichas; si la calidad es buena, el 6b y el 6c escalan a las 150.
  3. Ningún dato sin fuente: MIDE, desnivel y tiempos vacíos si no hay fuente fiable.
- **Revisión del usuario (2026-10-03):**
  - Pedraforca: la tartera de Saldes **no está prohibida**, solo desaconsejada por el parque y los servicios de emergencia;
  - Canigó y La Mola: correctos;
  - la grafía es **"Mas Malet"**.
- **Dificultad (propuesta de Claude, aceptada por defecto):** escala propia **"Dificultat orientativa"** de 4 niveles (Fàcil · Moderada · Exigent · Molt exigent), calculada a partir de la ruta normal (desnivel, distancia, tiempo, altitud) y de los pasos técnicos con fuente (grimpada…).
  - Se etiqueta como estimación de Carnet de Cims y enlaza a Metodología.
  - El MIDE solo se muestra cuando una fuente lo publica.
  - Desbloquea los listados "Cims fàcils" y "Cims amb nens".
  - Pendiente de implementar tras el QA del 6a.
- **Resultado del 6a:**
  - **Contenido:** 10 pilotos (583–734 palabras por idioma, 2 rutas, 5 consells, 4 FAQ y 2–3 rutas de Wikiloc cada una; MIDE vacío por falta de fuente). Cada ficha solo envía su idioma (`contingutFitxaLocal`).
  - **Meteo:** `/api/meteo/{slug}` (Open-Meteo, caché de 3 h + 24 h de respaldo; en el SW, network-first con la última previsión ≤ 3 días). UI `MeteoCim` sin CLS en ningún estado.
  - **SEO:** FAQPage solo en fichas indexables; description con la ruta normal; privacitat con el widget de Wikiloc.
  - **H1:** saltos de línea calculados (CLS 0 a 320/375/768 px).
  - **Pendiente bajo:** a 768 px La Mola tiene CLS 0,126 con fuentes lentas (reflujo lateral); salto puntual no reproducible en Bastiments.
- **Bloque 6a-bis (terminado, 2026-10-04): dificultad orientativa.**
  - **Fórmula** en `domain/dificultat.ts`: km-esfuerzo = km + D+/100 (o el tiempo); técnica según `tecnicitat`; altitud; el nivel es el factor más alto; "aproximada" si faltan datos.
  - **Datos:** `tecnicitat` con fuente en las pilotos; La Mola con distancia (pasa a Moderada).
  - **UI:** `DificultatBadge` en la ficha, en las rutas y en las listas; metodología `#dificultat-orientativa`; listados `/cims-facils` (hoy 0) y `/cims-amb-nens` (hoy 2), `noindex` hasta tener 3 cims.
  - **QA:** `e2e/dificultat.e2e.ts`; 1305 E2E pasados.
  - **Decisiones del usuario (2026-10-05):** "amb nens" se mantiene en **≤ 2 h 30** de ida; el tramo "Moderada" **no cambia**.
- Después: 6b (+ fichas), 6c (resto + revisión). La **fase 5** se hará cuando el usuario haga las acciones previas.

## Pendiente o decisiones abiertas

- **Fase 5, después de la beta:** Google OAuth (credenciales en Google Cloud Console, las crea el usuario), deduplicación entre dispositivos, `www` → apex.
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
