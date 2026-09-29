# Estado del proyecto

> Se actualiza al final de cada bloque. Última actualización: 2026-09-28.

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

## Siguiente

Bloque **3c**: hub del reto (normativa explicada), portada definitiva, páginas legales y metodología.

## Pendiente o decisiones abiertas

- Reglas ambiguas del reto: interpretación por defecto en `03-modelo-datos.md` §3.3.
- Restricciones de acceso: cargadas las 2 esenciales afectadas; hay que revisarlas antes del lanzamiento.
- Pendientes de confirmar: "Pic d'Enclar (Bony de la Pica)" y "La Tossa (Tivissa)" (nombre visible con paréntesis).
- **Fichas:**
  - Tienen unas 360 palabras y el mínimo para indexar es 400: ninguna se marca `revisat` hasta tener el contenido de la fase 6.
  - Falta el campo `data_revisio` (para `lastmod`).
- **Cosmético (para el bloque 3d):** en móvil, el CTA "Registrar aquest cim" queda debajo de la barra inferior en fichas con H1 de 3 líneas (hace falta un poco de scroll) y a 320 px ocupa 2 líneas. La barra inferior ya tiene "Registrar".
- **Wikiloc:** sin filtro de actividad (no se ha podido verificar el parámetro); en el Montcau son relevantes unas 11 de 24 rutas.
- **SEO (para el bloque 3d):** H1 sin "(alt m)" (§4.1); H2 de los sheets del layout en todas las páginas.
- **Bugs bajos del 3b (para el bloque 3d):**
  1. A 320 px las líneas guía y el punto real de los marcadores desplazados quedan tapados por el marcador (desplazamientos de 4,6 a 11 px). Además, en Catalunya Nord a 1280 px los puntos 1 y 3 apenas asoman (`MapaMarcadors.svelte`: `.real` y `.guies` se pintan debajo de `.marcadors`).
  2. Con un filtro activo en `/cims`, pulsar "Cims" (BottomNav o pie) deja la URL sin query pero la lista sigue filtrada (`afterNavigate` no relee la URL con la página ya montada).
- Las páginas de comarca con < 3 cims son `noindex`: hay que revisar el umbral en la fase 6 o con el catálogo de 522.
