# 02 · Arquitectura SEO — carnetdecims.cat

> Fase 0 (planificación). Autor: agente seo-expert. Fecha: 2026-09-27. Stack aún abierto (Next.js o Astro, SSR/SSG). Donde algo depende del framework se indica con **[Next]** / **[Astro]**.

## 1. Análisis competitivo SERP (septiembre 2026)

Búsquedas revisadas: "100 cims FEEC", "repte 100 cims app", "cims essencials 100 cims llista", "pujar al Pedraforca ruta", "100 cimas Cataluña reto", "cims del Berguedà 100 cims", "cims fàcils per fer amb nens", "subir Pica d'Estats ruta", "100 cims normativa", "sostre comarcal Osona".

| Competidor                                                                                                                                                 | Qué posiciona                                                           | Fortaleza                                                               | Debilidad / hueco                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **feec.cat** (oficial)                                                                                                                                     | Todo lo de marca: "100 cims", normativa, llistat, "registra el teu cim" | Autoridad y marca                                                       | Lista en tabla/PDF (`Essencials-100-cims.pdf`), sin ficha por cima con ruta, dificultad ni mapa                   |
| **ca.wikipedia.org**                                                                                                                                       | "repte dels 100 cims"                                                   | Autoridad                                                               | Enciclopédico, sin utilidad práctica                                                                              |
| **mirador.cat**                                                                                                                                            | Listas "100 Cims FEEC" / "Essencials" con páginas por cima (ca/es/en)   | Cobertura completa, mapa                                                | Contenido escaso por cima (altitud + foto), URLs con mayúsculas y guiones bajos                                   |
| **cimcat.cat**                                                                                                                                             | "cims del Berguedà", `/cims/pedraforca`, ca/es/en                       | **Competidor directo**: fichas y comarcas con dificultad y valoraciones | Mezcla la lista del ICGC y la de la FEEC; no hace seguimiento del reto; poca profundidad en rutas y restricciones |
| **Apps**: fescims.com ("Cims, sempre amunt"), "Cims – Retos de montaña" (Play), "100 Cims – Catalunya", pirisport (mapa + checklist), GitHub 100-Cims-Mapa | "repte 100 cims app"                                                    | Funcionalidad de seguimiento                                            | **No tienen fichas indexables** con contenido: landings de app o listas                                           |
| **Wikiloc**                                                                                                                                                | Domina "[cim] ruta", "pujada al [cim]"                                  | Tracks de usuarios, enorme autoridad                                    | Contenido de usuario disperso, sin síntesis ni contexto del reto                                                  |
| **Blogs ES**: lapisadaverde.com, rutaspirineos.org, sumiloc.com, viajarruteando, rocjumper, coronandopicos                                                 | "100 cimas Cataluña", "subir al Pedraforca", "Pica d'Estats dificultad" | Guías largas en castellano sobre cimas famosas                          | Solo cubren las ~30–50 cimas conocidas; el long tail de las 522 está vacío en castellano                          |
| **Blogs y clubs CA**: decimencim.cat, elsnostrescentcims, cep.cat, totnens.cat, clubs locales                                                              | Cimas concretas, "100 cims amb nens"                                    | Experiencia real (E-E-A-T)                                              | Sin estructura ni actualización, calidad variable                                                                 |
| **Medios**: naciodigital (edición comarcal), 3cat, descobrir.cat, publico                                                                                  | "cims del [comarca]", "cims per fer amb nens"                           | Autoridad                                                               | Artículos puntuales, sin listas completas                                                                         |

**Huecos de contenido y oportunidades (por orden de impacto):**

1. **Ficha útil por cada una de las 522 cimas** con los atributos propios del reto: si es esencial, comarca FEEC, restricciones, MIDE y ruta normal. Nadie lo ofrece completo y fiable, y en castellano el long tail está prácticamente vacío.
2. **"Cims essencials [comarca]"**: hoy solo existe el PDF de la FEEC. Una sección HTML por comarca y un listado global de esenciales captan esa intención.
3. **Normativa explicada en lenguaje claro** (esenciales desde 2019, normativa vigente desde 2024, máximo 100/año, métodos válidos, reto infantil), con FAQ y enlace a la FEEC para validar.
4. **Restricciones de acceso** (nidificación, reservas, propiedad privada, cierres) agregadas por cima. Nadie las recopila.
5. **Dificultad MIDE homogénea** para todas las cimas: permite crear listados "cims fàcils" con criterio objetivo.
6. **Desambiguación ICGC vs FEEC**: el ICGC tiene otra lista, "100 cims més emblemàtics", que confunde. Una guía que explique la diferencia capta búsquedas confusas.
7. **Sinergia app + contenido**: ningún competidor combina fichas indexables con seguimiento personal. La ficha actúa como puerta de entrada a la app (CTA "Marca-la com a feta").

**Riesgos detectados:** cimcat.cat ya usa un patrón de URL casi idéntico y lo ofrece en tres idiomas; en consultas por cima famosa Wikiloc y los blogs llevan años de ventaja. Por eso la estrategia debe apoyarse en el **long tail**: 522 cimas × comarcas × esenciales.

## 2. Estudio de palabras clave

Sin herramientas de volumen. La prioridad es cualitativa y combina la demanda estimada (autocompletado, densidad de la SERP y popularidad de la cima), la competencia y el encaje con nuestro producto. **A** = alta, **M** = media, **B** = baja.

| Clúster (intención)       | Ejemplos CA                                                                                                  | Ejemplos ES                                                    | Prio                                         | Justificación                                                                              | Página destino              |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------- |
| Marca del reto (info/nav) | 100 cims, repte 100 cims, repte dels 100 cims                                                                | reto 100 cims, 100 cimas Cataluña                              | A (difícil)                                  | Mucha demanda, pero la FEEC ocupa el top. Aspirar a top 3–5                                | Home + hub del reto         |
| Lista (info)              | llista 100 cims, cims essencials, llistat cims essencials                                                    | lista 100 cims, cimas esenciales 100 cims                      | **A**                                        | Hoy la cubre un PDF: hueco claro                                                           | `/cims-essencials`, `/cims` |
| Normativa (info)          | normativa 100 cims, com validar cims, 100 cims nens                                                          | normativa 100 cims, cómo validar ascensiones                   | M                                            | Demanda estable. La FEEC gana, pero la FAQ puede lograr fragmentos destacados              | Hub `/repte-100-cims/*`     |
| Mapa / app (transacc.)    | mapa 100 cims, app 100 cims                                                                                  | mapa 100 cims, app 100 cimas                                   | **A**                                        | Encaje perfecto con el producto y competencia débil (apps sin SEO)                         | `/mapa`, home               |
| Por cima (info/práctica)  | com pujar al [cim], [cim] ruta, [cim] altitud, [cim] des de [poble], [cim] dificultat                        | subir al [cima], [cima] ruta, [cima] altura, [cima] dificultad | **A** en esenciales y famosas; M en el resto | Es el volumen agregado más grande. Wikiloc domina las famosas y el long tail es alcanzable | Ficha de cima               |
| Por comarca (info)        | cims del [comarca], muntanyes del [comarca], sostre del [comarca]                                            | cimas del [comarca], montañas del [comarca]                    | **A**                                        | ~50 páginas con competencia media (cimcat, medios)                                         | Página de comarca           |
| Long tail temático        | cims fàcils, cims per fer amb nens, cims prop de Barcelona, tresmils de Catalunya, cims essencials [comarca] | cimas fáciles Cataluña, montañas para hacer con niños          | M–A                                          | Intención muy alineada. Los listados deben apoyarse en datos MIDE reales                   | Listados y guías            |
| Estacional / práctica     | cims a l'hivern, cims amb raquetes, cims amb BTT                                                             | cimas con raquetas                                             | B–M                                          | Nicho y fuertemente estacional. Encaja con los métodos válidos del reto                    | Guías (fase 3)              |

**Notas de lenguaje:**

- Los topónimos se mantienen en catalán también en castellano ("Pica d'Estats", "Turó de l'Home"), porque así es como se busca.
- En castellano se usa "100 cims" más que "100 cimas": emplear ambas formas en el hub ES.
- **Preposición + artículo:** "pujar **al** Pedraforca / **a la** Pica d'Estats / **a l'**Obac"; "cims **del** Berguedà / **de la** Selva / **d'**Osona". El modelo de datos necesita los campos `nom_amb_article` y `nom_amb_de` (y sus equivalentes en ES) para que títulos y H1 suenen naturales.

## 3. Arquitectura de URLs e información

### 3.1 Estrategia de idioma

**Recomendación: subcarpetas simétricas `/ca/` y `/es/`, con `x-default` → versión `ca`.**

- La raíz `/` hace una **redirección 301 a `/ca/`**, sin redirigir según `Accept-Language`, para que Googlebot (que rastrea sin idioma) vea siempre lo mismo. Si el navegador está en castellano, se ofrece un banner no intrusivo: "¿Ver en castellano?".
- La simetría simplifica el i18n en ambos frameworks ([Next] routing `[locale]`; [Astro] `i18n.prefixDefaultLocale: true`), evita ambigüedades de canonical y permite añadir `/en/` o `/fr/` (Catalunya Nord) sin tocar URLs.
- Código hreflang `ca` y `es`, sin región: el público abarca también Andorra y Catalunya Nord.

### 3.2 Reglas de slug

- Minúsculas, sin acentos ni apóstrofos, separadas por guiones, sin barra final (y 301 desde la versión con barra). Ej.: `Pica d'Estats` → `pica-d-estats`.
- **El slug de la cima es el mismo en ca y es** (topónimo oficial); solo se traduce el segmento de sección.
- Si hay homónimos, se añade la comarca: `puig-de-l-home-alt-emporda`. Si es una subcima o variante: `pedraforca-pollego-superior`.
- **URLs de cima planas** (`/cims/{slug}`, sin la comarca en la ruta): hay cimas que hacen frontera entre comarcas y la URL tiene que ser estable. La comarca aparece en el breadcrumb.
- Slugs inmutables. Cualquier cambio → 301 registrado en una tabla `redirects` del modelo de datos.

### 3.3 Árbol del sitio (se muestra `ca`; `es` es equivalente)

```
/ca                                   Home                                 index
/ca/repte-100-cims                    Hub: què és, nivells, com funciona   index
  /ca/repte-100-cims/normativa        Normativa resumida + enllaç FEEC      index
  /ca/repte-100-cims/com-validar      Com validar ascensions (via entitat) index
  /ca/repte-100-cims/repte-infantil   Repte infantil (50 cims)             index
/ca/cims                              Llistat complet 522 (SSR, filtrable) index
/ca/cims/{slug}                       Fitxa de cim                          index si `revisat`
/ca/cims-essencials                   Els ~150 essencials per comarca       index
/ca/cims-facils                       MIDE baix (criteri publicat)          index
/ca/cims-amb-nens                     Selecció revisada (no automàtica)     index
/ca/tresmils                          Cims ≥ 3.000 m                        index
/ca/cims-mes-alts                     Rànquing per altitud                  index
/ca/comarques                         Índex de comarques                    index
/ca/comarques/{slug}                  Pàgina de comarca                     index si ≥ 3 cims (§4.2)
/ca/guies/{slug}                      Guies long tail (≈15)                 index
/ca/mapa                              Mapa (SSR amb text + illa de mapa)   index
/ca/app/a-prop                        Cims propers (geolocalització)        noindex
/ca/app/progres | /historial | /registrar | /compte | /entrar           noindex
/ca/sobre-el-projecte                 Qui som, no oficialitat, contacte     index
/ca/metodologia                       Fonts de dades, IA i revisió          index
/ca/avis-legal | /privacitat | /cookies                                  index (baix valor)
```

Equivalencias ES: `/es/reto-100-cims` (`/normativa`, `/como-validar`, `/reto-infantil`), `/es/cimas`, `/es/cimas/{slug}`, `/es/cimas-esenciales`, `/es/cimas-faciles`, `/es/cimas-con-ninos`, `/es/tresmiles`, `/es/cimas-mas-altas`, `/es/comarcas/{slug}`, `/es/guias/{slug}`, `/es/mapa`, `/es/app/...`, `/es/sobre-el-proyecto`, `/es/metodologia`.

**Filtros y facetas:** las combinaciones de filtros (`?comarca=&mide=&estat=`) **no son URLs indexables**; su canonical apunta a la URL base. Solo se crean páginas estáticas para las combinaciones con demanda demostrada: los esenciales por comarca van como sección dentro de la página de comarca, no como URL propia, para no canibalizar.

**Páginas `noindex`:** todo `/app/*` (datos personales o dependientes de la geolocalización, sin valor para búsqueda). Se sirven con `<meta name="robots" content="noindex">` y la cabecera `X-Robots-Tag`, **sin bloquearlas en robots.txt** (si se bloquean, Google no puede leer el noindex). Se excluyen del sitemap.

**Guías iniciales propuestas:** diferencia entre la lista del ICGC y la de la FEEC · què són els cims essencials · cims amb restriccions d'accés · escala MIDE explicada · sostres comarcals del repte · cims prop de Barcelona / Girona / Lleida / Tarragona · cims per fer a l'hivern / amb raquetes · primer cop al repte: per on començar.

### 3.4 Estimación de URLs indexables

| Tipo                                                                                                | Lanzamiento (fase 1)     | Completo            |
| --------------------------------------------------------------------------------------------------- | ------------------------ | ------------------- |
| Fichas de cima                                                                                      | 150 esenciales × 2 = 300 | 522 × 2 = **1.044** |
| Comarcas (Catalunya ~43 + Catalunya Nord ~5 + Andorra; confirmar con los datos de la FEEC) + índice | ~100                     | ~100                |
| Hub del reto (4) + listados (6) + mapa + estáticas (5)                                              | ~32                      | ~32                 |
| Guías                                                                                               | 4 × 2 = 8                | ~15 × 2 = 30        |
| **Total**                                                                                           | **≈ 440**                | **≈ 1.200**         |

## 4. Plantillas on-page

### 4.1 Ficha de cima (`/ca/cims/{slug}`)

**Title** (≤ 60 caracteres; si no cabe, se prescinde del sufijo de marca):

- CA: `{Nom} ({alt} m): com pujar-hi, ruta i dificultat` → "Pedraforca (2.506 m): com pujar-hi, ruta i dificultat" (53)
- ES: `{Nombre} ({alt} m): cómo subir, ruta y dificultad`
- Si queda hueco, se añade: ` · Carnet de Cims`.

**Meta description** (140–155 caracteres, generada a partir de datos, nunca vacía):

- CA: `{Nom}, cim {essencial?} del repte 100 Cims {nom_amb_de_comarca}. Ruta normal des de {sortida}: {desnivell} m, {temps}. MIDE, accessos, mapa i temps.`
- Si faltan datos de ruta, se usa una variante sin cifras. No se inventan cifras.

**Estructura:**

- **H1:** `{Nom} ({alt} m)`. Subtítulo visual (no Hn) con: comarca · esencial · MIDE.
- **Bloque de datos clave** (tabla/dl, SSR): altitud, comarca(s), municipio, coordenadas, esencial sí/no, MIDE M-I-D-E, desnivel y tiempo de la ruta normal, restricciones (sí/no + enlace a la sección). CTA de la app: "Marca'l com a fet".
- **H2 Com pujar {nom_amb_article}: ruta normal** — punto de salida y acceso en coche/transporte público, descripción del itinerario, pasos clave. _150–300 palabras._
  - H3 Punt de sortida i aparcament · H3 Itinerari · H3 Tornada / variant
- **H2 Altres rutes d'accés** — lista con salida, desnivel, tiempo y enlaces externos (Wikiloc/ICGC con `rel="nofollow noopener"` si son de usuario). _50–150 palabras._
- **H2 Dificultat MIDE** — valores y explicación breve de por qué, con enlace a la guía MIDE. _40–80 palabras._
- **H2 Restriccions d'accés i consells** — solo si hay datos. Si no, "Sense restriccions conegudes (última revisió: {data})".
- **H2 Sobre {nom}** — historia, paisaje, toponimia, lo que lo hace singular. _100–200 palabras. Es el bloque que más diferencia una ficha de otra._
- **H2 Mapa i ubicació** — imagen estática del mapa en SSR y mapa interactivo con carga diferida (ver §6).
- **H2 El temps al cim** — widget cargado en el cliente, con altura reservada. No se indexa como contenido.
- **H2 Cims propers del repte** — 6 cimas por distancia (calculada en build), con altitud y esencial.
- **H2 Preguntes freqüents** — 3–5 preguntas **específicas** de la cima (¿cuánto se tarda?, ¿se puede ir con niños?, ¿desde dónde es más fácil?, ¿cuenta para esenciales?). Nada de FAQ genéricas repetidas.
- **Bloque de fuentes y revisión:** fuentes por campo, "Revisat per {persona} el {data}" y aviso de no oficialidad.

**Mínimo orientativo:** 400 palabras únicas (600+ en esenciales y cimas famosas). Por debajo de ese umbral → `noindex` hasta completarla.

**Enlazado interno obligatorio:** comarca (breadcrumb + texto), 6 cimas cercanas, 3 de la misma comarca, 3 del mismo nivel MIDE, `/cims-essencials` (si es esencial), guía MIDE, hub del reto. Anclas descriptivas ("Cims del Berguedà", no "aquí").

**Breadcrumb:** `Inici › Comarques › Berguedà › Pedraforca` (visible y con BreadcrumbList). Si la cima pertenece a varias comarcas, se usa la comarca principal según la FEEC.

**Imágenes:** en el MVP no hay fotos propias. Se usa (a) una imagen estática del mapa topográfico con `alt="Mapa de situació del {nom} ({alt} m) al {comarca}"` y atribución ICGC/OSM; (b) una **imagen OG generada** para cada cima (nombre, altitud, silueta/mapa, 1200×630). Fotos opcionales de Wikimedia Commons con la licencia y el autor visibles. Formato AVIF/WebP, `width`/`height` explícitos y `loading="lazy"` salvo la primera.

### 4.2 Página de comarca (`/ca/comarques/{slug}`)

- **Title:** `Cims {nom_amb_de}: {n} cims del repte 100 Cims` → "Cims del Berguedà: 24 cims del repte 100 Cims". ES: `Cimas {del/de la} {comarca}: {n} cimas del reto 100 Cims`.
- **Meta description:** `Els {n} cims {nom_amb_de} del repte 100 Cims, {e} essencials. Mapa, altitud, dificultat MIDE i com pujar a cadascun. Sostre comarcal: {cim} ({alt} m).`
- **H1:** `Cims {nom_amb_de}`
- **Intro** (150–250 palabras únicas): relieve, sierras principales, techo comarcal y cuándo ir.
- **H2 Cims essencials {nom_amb_de}**: tarjetas enlazadas (captura "cims essencials [comarca]").
- **H2 Tots els cims del repte {nom_amb_de}**: tabla SSR ordenable (nombre, altitud, MIDE, esencial) con los enlaces en el HTML.
- **H2 Mapa** (imagen estática + mapa diferido).
- **H2 Cims més fàcils / més alts** (top 3 de cada, con datos).
- **H2 Preguntes freqüents** (2–4: techo comarcal, cuántos esenciales, cima más fácil).
- **H2 Comarques veïnes** (enlaces).
- **Mínimo:** 300 palabras únicas además del listado.
- **Mientras el catálogo sea solo de esenciales** (fase 2): el title, la description y la intro dicen "{n} cims essencials" (`Cims del Berguedà: 6 cims essencials del repte 100 Cims`), nunca "{n} cims del repte", que sería falso. Lo mismo en `/tresmils` y `/cims-mes-alts` ("tresmils essencials", "cims essencials més alts").
- **Umbral de indexación (contenido escaso), decidido en el bloque 3b:** una página de comarca es indexable solo si tiene **≥ 3 cims** en el catálogo (`MIN_CIMS_COMARCA_INDEXABLE`, `src/lib/seo/indexabilitat.ts`). Con 1–2 cims la página es poco más que un enlace a una o dos fichas (todavía `noindex`) con texto de plantilla: se publica con `noindex` (los enlaces se siguen), sin canonical ni hreflang, y fuera del sitemap. Página y sitemap usan la misma función (`comarcaIndexable`). Con el catálogo de 150 esenciales quedan 25 comarcas indexables y 18 en `noindex`.
  - **Revisión en la fase 6** (catálogo de 522 e intro editorial de cada comarca): se mantiene el mínimo de 3 cims y se añade la condición de tener la intro editorial (≥ 150 palabras únicas); una comarca con menos cims pero con intro editorial revisada puede indexarse como excepción.

### 4.3 Otras páginas (resumen)

- **Home:** H1 "Segueix el repte 100 Cims: mapa, llista i el teu progrés". Title: "Carnet de Cims: mapa, llista i seguiment del repte 100 Cims" (59). _Revisado en fase 1: la marca propia va delante y "100 Cims" queda como complemento descriptivo, para no presentar la home como si fuera el reto oficial._
- **Hub del reto:** H1 "El repte dels 100 Cims: com funciona". Enlaza a la FEEC como fuente oficial.
- **`/cims-essencials`:** H1 "Els 150 cims essencials del repte 100 Cims", agrupados por comarca (H2 por comarca).
- **`/mapa` (`/es/mapa`) — decisión del bloque 4c (2026-10-02): pasa a indexable y entra en el sitemap `pagines`.** Estuvo en `noindex` (`PAGINES_NOINDEX`) desde el bloque 3c porque era un placeholder; con el mapa real tiene valor propio para la intención "mapa 100 cims" / "mapa cims essencials" / "mapa dels cims de Catalunya" (prioridad A en §2; las apps competidoras no tienen landing indexable) y no duplica `/cims` (intención de mapa, no de listado).
  - **Title** "Mapa del repte 100 Cims: cims essencials" (+ sufijo = 57) · ES "Mapa del reto 100 Cims: cimas esenciales". **Description** con el número real de esenciales (`{count}`): "Mapa interactiu amb els 150 cims essencials del repte 100 Cims sobre el topogràfic de l'ICGC…" (≤ 155). **H1** "Mapa del repte 100 Cims" (corto: el mapa debe quedar cerca del primer viewport). Lede con `{count}`.
  - **Contenido sin JS (SSR):** H1 + lede, imagen estática ICGC (LCP, `alt` descriptivo), leyenda, lista `LlistaCims` de las fichas (vista alternativa, visible con `<noscript>`) y una sección **"Sobre aquest mapa"** (qué representa cada punto, fuentes del mapa base, que es orientativo y no sustituye un mapa de montaña ni la reseña, que el estado "fet" se calcula en el dispositivo) con enlaces a `/cims`, `/comarques`, `/cims-essencials` y `/metodologia`.
  - **Canonical** siempre sin query (`PageMeta` usa `page.url.pathname`): los filtros en query (`?zona=…`, `?comarca=…`, `?estat=…`, etc.), `?vista=llista` y `?cim=…` apuntan a la URL base y no van al sitemap. Los enlaces internos con `?cim=` (botón "Obre al mapa" de la ficha, `/app/a-prop`) llevan `rel="nofollow"`.
  - **JSON-LD** (`mapaGraph`): `WebPage` con `mainEntity` → `Map` (nombre = H1, `publisher` = la organización). Sin `ItemList` (ya está en `/cims`, sería duplicado) ni `BreadcrumbList` (la página no muestra breadcrumb; es sección de primer nivel de la navegación).
  - **Enlazado interno** con anchor descriptivo ("Mapa dels cims" / "Veure tots els cims al mapa"): portada (Explora els cims), `/cims`, listados (`PaginaLlistat`), fichas (bajo el mapa de situación, enlace limpio sin query) y contenido editorial (hub, normativa, com-validar, repte-infantil, sobre-el-projecte, metodologia). Además, la barra de navegación inferior.
  - **Revisar en la fase 6** (catálogo de 522): title, description, H1 y lede hablan de "cims essencials"; cuando el mapa muestre también no esenciales, hay que reescribirlos ("Mapa dels cims del repte 100 Cims…").
- **OG/Twitter:** `og:title`, `og:description`, `og:image` (generada), `og:locale` `ca_ES`/`es_ES` + `og:locale:alternate`, `twitter:card=summary_large_image`.

## 5. Datos estructurados (JSON-LD)

Un `@graph` por página. Valores ilustrativos: **validar coordenadas y altitud con el catálogo**. `FAQPage` es opcional (Google solo muestra resultados enriquecidos de FAQ en sitios gubernamentales o de salud), pero no hace daño si la FAQ es visible. No se usa `SearchAction` (el cuadro de búsqueda de sitelinks se retiró en 2024).

**Ficha de cima:**

```json
{
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "Mountain",
			"@id": "https://carnetdecims.cat/ca/cims/pedraforca-pollego-superior#cim",
			"name": "Pedraforca (Pollegó Superior)",
			"alternateName": "Pedraforca",
			"description": "Cim essencial del repte 100 Cims al Berguedà, amb dos pollegons units per l'Enforcadura.",
			"geo": {
				"@type": "GeoCoordinates",
				"latitude": 42.2386,
				"longitude": 1.7036,
				"elevation": 2506
			},
			"containedInPlace": {
				"@type": "AdministrativeArea",
				"name": "Berguedà",
				"url": "https://carnetdecims.cat/ca/comarques/bergueda"
			},
			"additionalProperty": [
				{ "@type": "PropertyValue", "name": "Cim essencial 100 Cims", "value": true },
				{
					"@type": "PropertyValue",
					"name": "MIDE (medi-itinerari-desplaçament-esforç)",
					"value": "2-2-3-3"
				}
			],
			"image": "https://carnetdecims.cat/og/ca/pedraforca-pollego-superior.png",
			"sameAs": [
				"https://www.wikidata.org/wiki/Q_PENDENT",
				"https://ca.wikipedia.org/wiki/Pedraforca"
			]
		},
		{
			"@type": "WebPage",
			"@id": "https://carnetdecims.cat/ca/cims/pedraforca-pollego-superior",
			"url": "https://carnetdecims.cat/ca/cims/pedraforca-pollego-superior",
			"inLanguage": "ca",
			"name": "Pedraforca (2.506 m): com pujar-hi, ruta i dificultat",
			"about": { "@id": "https://carnetdecims.cat/ca/cims/pedraforca-pollego-superior#cim" },
			"isPartOf": { "@id": "https://carnetdecims.cat/#website" },
			"dateModified": "2026-10-15",
			"breadcrumb": {
				"@id": "https://carnetdecims.cat/ca/cims/pedraforca-pollego-superior#breadcrumb"
			}
		},
		{
			"@type": "BreadcrumbList",
			"@id": "https://carnetdecims.cat/ca/cims/pedraforca-pollego-superior#breadcrumb",
			"itemListElement": [
				{
					"@type": "ListItem",
					"position": 1,
					"name": "Inici",
					"item": "https://carnetdecims.cat/ca"
				},
				{
					"@type": "ListItem",
					"position": 2,
					"name": "Comarques",
					"item": "https://carnetdecims.cat/ca/comarques"
				},
				{
					"@type": "ListItem",
					"position": 3,
					"name": "Berguedà",
					"item": "https://carnetdecims.cat/ca/comarques/bergueda"
				},
				{ "@type": "ListItem", "position": 4, "name": "Pedraforca" }
			]
		}
	]
}
```

**Comarca** (`CollectionPage` + `ItemList`):

```json
{
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "CollectionPage",
			"@id": "https://carnetdecims.cat/ca/comarques/bergueda",
			"inLanguage": "ca",
			"name": "Cims del Berguedà",
			"isPartOf": { "@id": "https://carnetdecims.cat/#website" },
			"about": {
				"@type": "AdministrativeArea",
				"name": "Berguedà",
				"sameAs": "https://www.wikidata.org/wiki/Q_PENDENT"
			},
			"mainEntity": {
				"@type": "ItemList",
				"numberOfItems": 24,
				"itemListElement": [
					{
						"@type": "ListItem",
						"position": 1,
						"url": "https://carnetdecims.cat/ca/cims/pedraforca-pollego-superior",
						"name": "Pedraforca"
					},
					{
						"@type": "ListItem",
						"position": 2,
						"url": "https://carnetdecims.cat/ca/cims/cap-de-la-gallina-pelada",
						"name": "Cap de la Gallina Pelada"
					}
				]
			}
		},
		{
			"@type": "BreadcrumbList",
			"itemListElement": [
				{
					"@type": "ListItem",
					"position": 1,
					"name": "Inici",
					"item": "https://carnetdecims.cat/ca"
				},
				{
					"@type": "ListItem",
					"position": 2,
					"name": "Comarques",
					"item": "https://carnetdecims.cat/ca/comarques"
				},
				{ "@type": "ListItem", "position": 3, "name": "Berguedà" }
			]
		}
	]
}
```

**Home** (`WebSite` + `Organization`, sin afirmar vínculo con la FEEC):

```json
{
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "WebSite",
			"@id": "https://carnetdecims.cat/#website",
			"url": "https://carnetdecims.cat/ca",
			"name": "Carnet de Cims",
			"alternateName": "carnetdecims.cat",
			"inLanguage": ["ca", "es"],
			"publisher": { "@id": "https://carnetdecims.cat/#org" }
		},
		{
			"@type": "Organization",
			"@id": "https://carnetdecims.cat/#org",
			"name": "Carnet de Cims",
			"url": "https://carnetdecims.cat",
			"logo": "https://carnetdecims.cat/logo-512.png",
			"description": "Web independent i no oficial per seguir el repte 100 Cims. No vinculada a la FEEC.",
			"sameAs": ["https://www.instagram.com/PENDENT"]
		}
	]
}
```

## 6. SEO técnico

**Sitemaps:** `/sitemap-index.xml` → `sitemap-ca-cims.xml`, `sitemap-es-cimas.xml`, `sitemap-ca-comarques.xml`, `sitemap-es-comarcas.xml`, `sitemap-ca-pagines.xml`, `sitemap-es-paginas.xml`. Solo URLs indexables con estado 200 y canonical propio. `lastmod` = fecha real de la última revisión del contenido (nunca la del build). Se generan en el build [Astro `@astrojs/sitemap` personalizado / Next `app/sitemap.ts` con `generateSitemaps`].

**hreflang:** en el `<head>` de cada página: `ca`, `es` y `x-default` (→ ca), recíprocos y autorreferenciales. **Solo se emparejan versiones que sean indexables en ambos idiomas**: si la ES de una cima aún no está revisada, no se publica o se marca noindex y se omite su hreflang.

**Canonical:** absoluto y autorreferencial, siempre `https://carnetdecims.cat` (301 desde `www` y `http`). Los parámetros (`?filtre`, `?utm`) apuntan al canonical base. No se hace canonical cruzado entre idiomas.

**robots.txt:**

```
User-agent: *
Disallow: /api/
Sitemap: https://carnetdecims.cat/sitemap-index.xml
```

(No se bloquean `/app/*` ni los assets JS/CSS.) Mientras exista preproducción, se protege con autenticación, no con robots.

**Estados HTTP:** 404 real con buscador de cimas; si la FEEC retira una cima de la lista, la página se mantiene con el aviso "ja no forma part del repte" (noindex) o se redirige con 301 a su comarca. Se registran las redirecciones al renombrar slugs.

**Core Web Vitals (p75 móvil):** LCP < 2,0 s · INP < 200 ms · CLS < 0,05. Presupuesto de JS en fichas y comarcas: < 90 KB gz.

- **Mapa diferido:** en SSR se sirve una imagen estática (pre-generada en build o tile estático) con `aspect-ratio` fijo. La librería de mapa (MapLibre/Leaflet) se carga **al interactuar o al entrar en el viewport** [Astro `client:visible` / Next `dynamic(..., {ssr:false})` + IntersectionObserver]. Nunca en el LCP.
- Meteo y "cims propers" personalizados se cargan en el cliente después del render, con altura reservada.
- Fuentes autoalojadas en subset con `font-display: swap`; imágenes con dimensiones fijas.
- **Framework:** Astro produce páginas de contenido con casi 0 JS por defecto (ventaja SEO/CWV). Next.js requiere disciplina con Server Components y dynamic imports para lograr lo mismo.

**PWA y SEO:**

- Cada URL de contenido devuelve **HTML completo desde el servidor o el build** (sin un app shell vacío hidratado después). El service worker puede cachear las fichas para usarlas offline, pero no debe sustituir el HTML de navegación por un shell genérico.
- Enlaces internos siempre como `<a href>` reales (el router cliente puede interceptarlos).
- Sin interstitial de "instala l'app" que tape el contenido: se ofrece un banner discreto o el prompt tras interacción.
- `manifest.start_url` = `/ca/app/progres` (noindex). La home sigue siendo contenido.
- Los datos personales (localStorage/IndexedDB) nunca alteran el HTML inicial de páginas indexables. El estado "fet/pendent" se pinta después, en el cliente.

**Contenido generado con IA (política de calidad):**

1. **Indexar solo fichas en estado `revisat`**, validadas por una persona con criterio de montaña. Los borradores quedan visibles para quien usa la app, pero con `noindex` y fuera del sitemap.
2. **Trazabilidad por campo:** cada dato lleva su fuente (FEEC, ICGC, OSM, parque natural, club). Si falta información, el campo se deja vacío y se oculta el bloque; nada de relleno.
3. **Unicidad:** prohibido el spinning de plantillas. El bloque "Sobre {nom}" y la ruta deben contener hechos propios de esa cima. Control automático de similitud entre fichas (p. ej. shingles/coseno > 0,6 → revisión).
4. **La versión ES se revisa, no se publica automáticamente.** El riesgo principal es que Google interprete ~1.000 fichas como _scaled content abuse_, así que se publican por lotes y solo cuando alcanzan el umbral de calidad.
5. **E-E-A-T:** página `/metodologia` (fuentes, proceso IA + revisión, criterios MIDE), `/sobre-el-projecte` con la persona responsable y su experiencia real, "Revisat per / data" en cada ficha y canal para reportar errores. En el futuro: fotos y ascensiones reales de los usuarios (UGC moderado).

**No oficialidad y marca FEEC:**

- Aviso visible en el footer de todas las páginas, en la home y en el hub: "Web independent, no oficial i no vinculada a la FEEC. La validació d'ascensions la fa la FEEC a través de les entitats" (con enlace a la página oficial para registrar el cim).
- **Uso nominativo** de "100 Cims" y "FEEC" solo para describir el reto. Sin logotipo de la FEEC, sin la palabra "oficial" y sin imitar su identidad visual. La marca propia es "Carnet de Cims".
- **Riesgo legal:** comprobar en la OEPM si "100 Cims" es marca registrada de la FEEC y hacer una revisión legal del dominio y el nombre antes de lanzar. Valorar contactar con la FEEC para que conozca el proyecto (posible enlace o colaboración).
- Catálogo: citar a la FEEC como fuente de la lista. Atribución ICGC (CC BY 4.0) y OSM (ODbL) en los mapas y en `/metodologia`.

## 7. Plan de lanzamiento

**Orden de publicación:**

1. **Fase 1 (lanzamiento):** home, hub del reto (4), `/cims` (listado de 522 con fichas enlazadas solo si son indexables), `/cims-essencials`, todas las comarcas, `/mapa`, `/metodologia`, `/sobre-el-projecte` y las **150 fichas esenciales revisadas** en ca. ES a la vez si hay capacidad de revisión; si no, entre 2 y 4 semanas después, sin publicar ES a medias.
2. **Fase 2 (semanas 2–12):** resto de cimas en lotes de 30–50 por semana, priorizando la demanda: primero las famosas no esenciales y las de comarcas cercanas al área metropolitana. Los listados `cims-facils` y `tresmils` se publican cuando haya datos MIDE suficientes.
3. **Fase 3:** guías long tail, `cims-amb-nens` (curada), guías estacionales y, más adelante, `/en/` o `/fr/` si los datos lo justifican.

**Search Console y herramientas:** propiedad de dominio (DNS) antes del lanzamiento; envío del sitemap index; revisión semanal del informe de indexación ("Rastrejada - no indexada" = señal de contenido flojo); inspección de URL de 10 plantillas; Bing Webmaster Tools (importando desde GSC) + IndexNow; seguimiento de CWV con CrUX y RUM propio (web-vitals).

**Enlaces y menciones (white-hat):**

- **Clubs y entidades excursionistas** (la FEEC agrupa varios cientos): presentar la herramienta gratuita. Muchas webs de clubs tienen páginas "100 cims" o de enlaces útiles.
- **Blogs** de montaña y familia (totnens, decimencim, lapisadaverde…): colaboraciones con contenido útil (p. ej. datos de restricciones), sin comprar enlaces.
- **Medios comarcales** (edición comarcal de Nació Digital, El Pirineu, Regió7): nota de prensa sobre una app gratuita e independiente, con enfoque local ("els X cims essencials del Berguedà").
- Directorios de apps (Gencat CercaApps, llengua.gencat), comunidades (Reddit r/catalunya, grupos de Facebook de 100 Cims) y redes con #100cims.
- Recursos enlazables: guía ICGC vs FEEC, mapa de restricciones y el listado de esenciales en HTML accesible.
- Evitar: widgets o insignias con enlaces dofollow forzados (esquema de enlaces), intercambios masivos y spam en Viquipèdia.

**KPIs (revisión mensual):**

| KPI                                                | Objetivo 3 meses | 6 meses     |
| -------------------------------------------------- | ---------------- | ----------- |
| % URLs enviadas indexadas                          | > 80 %           | > 90 %      |
| Clics orgánicos / mes                              | 2.000            | 10.000      |
| Consultas "[cim] + ruta/pujar" en top 10           | 50               | 200         |
| "cims del [comarca]" en top 5                      | 15 comarcas      | 35 comarcas |
| "cims essencials" / "llista 100 cims"              | top 10           | top 3       |
| CWV "Bo" (móvil)                                   | 100 % plantillas | 100 %       |
| Dominios de referencia                             | 10               | 30          |
| Conversión orgánica → primera ascensión registrada | medir línea base | +20 %       |
