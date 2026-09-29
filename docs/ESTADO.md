# Estado del proyecto

> Se actualiza al final de cada bloque. Última actualización: 2026-09-29.

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

## En curso: bloque 3d exprés (decisión del usuario: solo pendientes + E2E completo)

Pendientes que hay que arreglar:

1. Marcadores: a 320 px las líneas guía y el punto real quedan tapados (`MapaMarcadors.svelte`: `.real` y `.guies` debajo de `.marcadors`); en Catalunya Nord a 1280 px los puntos 1 y 3 apenas asoman.
2. `/cims`: con un filtro activo, pulsar "Cims" (BottomNav o pie) deja la URL sin query pero la lista filtrada.
3. Ficha: en móvil, el CTA "Registrar aquest cim" queda bajo la barra inferior con H1 de 3 líneas; a 320 px ocupa 2 líneas.
4. SEO ficha: H1 sin "(alt m)" (§4.1).
5. H2 de los sheets del layout presentes en todas las páginas.
6. Textos de portada en presente: `home_step1_text` ("…o al mapa"), `home_value3_text` ("l'origen de cada dada"), `home_value2_text` ("el carnet és teu…").
7. QA: E2E que leen `getAttribute('href')` crudo (`comarques.e2e.ts:71`, `filtres-cims.e2e.ts:21`, `fitxa-cim.e2e.ts:273`): resolverlos contra la URL de la página.

Después: batería E2E completa de la fase 3 en los 3 proyectos → fase 3 terminada (**pendiente de aprobación del usuario**).

## Siguiente

Bloque **4a**: capa de datos local (Dexie), registrar ascensión e historial.

## Pendiente o decisiones abiertas

- **Titular y contacto** (decisión del usuario, 2026-09-29): el titular es "Carnet de Cims" (nombre del proyecto) y el email **hola@carnetdecims.cat**. Hay que crear el buzón al activar el dominio (fase 7).

- Reglas ambiguas del reto: interpretación por defecto en `03-modelo-datos.md` §3.3.
- Restricciones de acceso: cargadas las 2 esenciales afectadas; hay que revisarlas antes del lanzamiento.
- Pendientes de confirmar: "Pic d'Enclar (Bony de la Pica)" y "La Tossa (Tivissa)" (nombre visible con paréntesis).
- **Fichas:**
  - Tienen unas 360 palabras y el mínimo para indexar es 400: ninguna se marca `revisat` hasta tener el contenido de la fase 6.
  - Falta el campo `data_revisio` (para `lastmod`).
- **Wikiloc:** sin filtro de actividad (no se ha podido verificar el parámetro); en el Montcau son relevantes unas 11 de 24 rutas.
- Las páginas de comarca con < 3 cims son `noindex`: hay que revisar el umbral en la fase 6 o con el catálogo de 522.
