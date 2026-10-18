# 10 · Comparativa con Fes Cims

> Consulta: **2026-10-18**. Alcance: web pública fescims.com, fichas de App Store y Google Play y la API pública que usan sus propias fichas (`api.fescims.com/api/public/catalogue/mountain?slug=…`). Sin cuenta, sin iniciar sesión y sin formularios. No se copian sus textos ni sus datos al catálogo: se citan solo para compararlos. Sale de `docs/08-ideas-producte.md` §"Apunts nous", punto 5.

La marca pública es **"Cims"** ("Cims, sempre amunt"). Las redes y el dominio usan *fescims*, y en las tiendas el slug es `100cims` (`app.x100cims.x100cims`). Autor: Josep Vidal (persona física).

## 1. Qué ofrece Fes Cims

| Aspecto | Qué hay | Fuente |
| --- | --- | --- |
| Producto | App nativa iOS/Android (también Mac con chip M1 y visionOS). La web es un **escaparate y catálogo de solo lectura**: cada ficha termina en "Obre-ho a l'app" y no se puede registrar nada desde la web | https://fescims.com/en, https://apps.apple.com/es/app/100cims/id6740161401 |
| Escala (según su portada) | 19.630 cimas, 45.667 ascensiones, 6.433 usuarios y 25 retos | https://fescims.com/en |
| Retos | 100 Cims destacado (las **522**, con las **150 esenciales en negrita**). También "100 Cims LICC", Sostres Comarcals, Repte del Gironès, Highland Terra Alta, Ehun Mendiak, Aragón, Asturias, Canarias, Munros, Three Peaks, French Alps, GR-20 y otros; permite crear listas propias | https://fescims.com/100cims, https://fescims.com/en |
| Registro | Cima + fecha + foto; compañeros (también el perro); valoración de dificultad, "amb nens" y "amb gossos"; tarjeta para historias; cimas antiguas con su fecha real | https://fescims.com/en, https://fescims.com/100cims (FAQ) |
| Social | Rankings por reto (también de perros), planes de grupo con chat y calendario (al completarlos se registra la ascensión de todo el grupo), clubes, comentarios y 30 insignias | https://fescims.com/en |
| Mapa y rutas | Mapa de todas las cimas filtrable por reto; en cada ficha, unas 5 rutas de Wikiloc con km, desnivel y dificultad; cimas cercanas; grabación de tracks con export GPX | Ficha del Pedraforca (abajo), Google Play |
| Integraciones | Strava (el usuario confirma qué se añade) e importación de GPX (Wikiloc, Garmin, Komoot, Suunto) | https://fescims.com/en |
| Otras actividades | 286 vías ferratas, 333 barrancos y 497 zonas de escalada (v5.0, octubre de 2026) | https://fescims.com/en, Google Play "Novedades" |
| Cuenta | **App sin web de registro.** Hay inicio de sesión con Google (lo cita una respuesta del desarrollador en Google Play, 13/10/2026). Que la cuenta sea **obligatoria** y que haya Apple o email: **no verificado** (probable, por los rankings y perfiles). La política de privacidad no detalla los métodos | https://play.google.com/store/apps/details?id=app.x100cims.x100cims, https://fescims.com/privacy-policy |
| Privacidad | App Store: datos vinculados a la identidad (ubicación exacta, contactos, contacto, fotos, salud y forma física, identificadores, uso), algunos "para publicidad o marketing". Google Play: "no se comparten datos con terceros". La política (9/10/2026) no identifica a una persona jurídica responsable ni dice dónde se alojan los datos | App Store, Google Play, privacy-policy |
| Precio | Gratis y sin anuncios. **Cims Pro** "Aviat": 1,99 €/mes o 9,99 €/año, sin prueba gratis. Incluye planes privados, **export CSV del historial**, catálogo completo de ferratas, barrancos y escalada, más fotos e insignia Pro. Tienda de ropa y tazas (20–39 €) | https://fescims.com/ca/pro, https://fescims.com/en/shop |
| Idiomas | Catalán, castellano e inglés (inglés por defecto: `x-default` = `/en`) | https://fescims.com/sitemap.xml |
| Valoraciones | App Store 4,8 (128); Google Play 4,6 (55 reseñas, más de 1.000 descargas, actualizada el 8/10/2026). Las reseñas citan cuelgues en la pantalla inicial y un fallo de fecha ya corregido | Tiendas |
| Oficialidad | En su FAQ dicen claramente que **no** son oficiales ni están afiliados a la FEEC | https://fescims.com/100cims |

Otra competidora que ha aparecido: **"Cimas de Cataluña"** (`com.dnos.cims.app`, Android), con una lista "100feec" y datos de ICC/FEEC/Wikipedia (https://www.bluestacks.com/campaign/com.dnos.cims.app/es). No se ha analizado: **no verificado**.

## 2. Diferencias con Carnet de Cims

| Función | Carnet de Cims (ESTADO.md) | Fes Cims |
| --- | --- | --- |
| Plataforma | PWA instalable, web completa y offline (SW) | App nativa; la web no deja registrar |
| Cuenta | **No hace falta**: datos locales; nube opcional (Supabase UE, código por correo) | Probablemente obligatoria (Google; resto no verificado) |
| Catálogo 100 Cims | 150 esenciales (las 522 más adelante) | Las 522, con las esenciales marcadas |
| Ficha de cim | Fichas redactadas (ruta normal, acceso, restricciones, FAQ propia), mapa ICGC, Wikiloc en una caja de unos 3 km | Ficha generada: altitud, provincia, coordenadas, valoraciones de la comunidad, 5 rutas de Wikiloc, cercanas y FAQ de plantilla |
| Comarcas | 43 páginas de comarca con mapa y listado | Solo el campo `location`, que lista varias comarcas en las cimas limítrofes; no hay páginas por comarca |
| Reglas FEEC | Carnet I–V con las reglas de las esenciales, "en espera", máximo 100 al año y restricciones | Barra de progreso; las esenciales "cuentan doble". No consta que aplique las reglas de validación |
| Validación FEEC | Lista del año con avisos, CSV y PDF (gratis) | CSV solo con Pro (aún no disponible) |
| Retos propios | 100 Cims, Infantil, 43 comarcas, 4 estaciones, 12 meses, 7 macizos y medallas | 25 retos de varias regiones, listas propias y 30 insignias |
| Social | Compartir ascensión (imagen) y enlace del carnet de solo lectura | Rankings, planes, chat, clubes y comentarios |
| Meteo y "proper cim" | Recomendación con meteo, tiempo actual y restricciones en las listas | No consta |
| Estadísticas y diario | Sí (R1) | Progreso e insignias (detalle no verificado) |
| Tracks y GPX | No | Grabación, export GPX, Strava e import GPX |
| Fotos | No (fase 5+) | Sí (portada gratis y más con Pro) |
| Otras actividades | No | Ferratas, barrancos y escalada |
| Privacidad | Responsable identificado, datos en la UE y local primero | Muchos datos vinculados; no dice dónde se alojan |

**Qué hacen mejor:** escala y comunidad (rankings, planes de grupo, unos 900 registros por cima popular), las 522 cimas ya cargadas, Strava/GPX, valoraciones con niños y con perros, rutas de Wikiloc **seleccionadas** con km y desnivel, y retos de fuera de Cataluña.

**Qué copiaríamos (adaptado):**
- lista de las 522 con las esenciales marcadas;
- 3–5 rutas seleccionadas por cima, con km y desnivel (enlace `nofollow`, sin copiar sus datos);
- en las cimas limítrofes, mostrar todas las comarcas ("al límit de…");
- reto "sostres comarcals";
- importar GPX (fase 5+).

**Qué evitaríamos:**
- poner la marca FEEC en el `<title>` ("Els 100 Cims de la FEEC…");
- `lang="en"` en todas las páginas, también las catalanas;
- fichas que se pintan solo en el cliente ("Carregant…" en el HTML) y en `noindex`;
- "las esenciales cuentan doble" (no es la regla de la FEEC);
- recoger datos que no hacen falta;
- obligar a crear cuenta.

## 3. Fiabilidad de sus datos

**Cómo se ha comparado:**
- **Las 150 esenciales**, a partir de la lista de https://fescims.com/100cims (nombre y altitud). Coinciden en las 150, y su negrita marca exactamente nuestras 150 esenciales.
- **22 cimas**, con las coordenadas y la comarca de su API pública. Se comparan con `src/lib/data/catalog/cims.json` y con `scripts/catalog/informe.md`, y en 2 casos con el geocodificador del ICGC (https://eines.icgc.cat/geocodificador).

**Conclusión:** sus datos son buenos y sus coordenadas coinciden casi siempre con el punto de **Wikidata** (las distancias son las mismas que la columna "Wikidata ele" de nuestro informe). Es una inferencia: **no verificado** con ellos. De las 150, 13 difieren en altitud (12 en ≤ 3 m y una en 9 m). 3 de las 22 están a más de 50 m de nuestro punto ICGC.

| Cim (nuestro slug) | Altitud nuestra / suya | Comarca nuestra / suya | Distancia | Grafía | Quién tiene razón |
| --- | --- | --- | --- | --- | --- |
| pica-d-estats | 3143 / 3144 | Pallars Sobirà / P. Sobirà (región "Ariège", FR) | 2 m | = | Nosotros (MDT 3142,7; OSM/Wikidata 3143,45) |
| pedraforca-pollego-superior | 2506 / 2506 | Berguedà / Berguedà | 1 m | "Pedraforca" / "Pollegó Superior (Pedraforca)" | Iguales |
| puigmal | 2910 / 2910 | Ripollès / "Cerdanya Nord, Ripollès" | 6 m | = | Iguales (ICGC: Queralbs) |
| canigo | 2784 / 2784 | Catalunya Nord (zona) / Conflent | 23 m | = | Iguales (IGN; ellos dan la comarca histórica) |
| mola-d-estat | **1127 / 1136** | **Conca de Barberà** / "Baix Camp, Conca de Barberà" | **119 m** | = | Altitud: nosotros (punto ICGC "Mola d'Estat, Prades"; MDT 1127,2; OSM 1127,3); su 1136 coincide con el punto de Wikidata, a 118 m. Comarca: **revisar en nuestro catálogo** (el ICGC da Prades, Baix Camp) |
| la-fita-alta | 286 / 289 | Pla d'Urgell / = | 19 m | = | Nosotros (ICGC 1:10.000; corrección del usuario del 5/10); su 289 es el de Wikidata |
| els-angels | 485 / 483 | Gironès / = | 34 m | = | Nosotros (ICGC "Puig Alt"; MDT 485,2) |
| torreta-de-l-orri | 2438 / 2436 | Pallars Sobirà / = | 57 m | = | Nosotros (ICGC; MDT 2437,8) |
| tagamanent | 1058 / 1056 | Vallès Oriental / = | 33 m | = | Nosotros (ICGC "Turó de Tagamanent"; MDT 1057,7) |
| punta-de-montmaneu | 495 / 495 | Segrià / = | 0 m | **Montmaneu / Montmeneu** | Nosotros: el ICGC escribe "Punta de Montmaneu, Seròs"; "Montmeneu" es la grafía del PDF de la FEEC |
| lo-tormo | 523 / 523 | Ribera d'Ebre / = | 0 m | añaden "(Lo piló)" | Iguales (vértice ICGC) |
| roques-de-benet | 1017 / 1017 | Terra Alta / = | 1 m | añaden "(el Castell)" | Iguales |
| pic-d-enclar | 2405 / 2405 | Alt Urgell / "Alt Urgell, Andorra" | 36 m | "Pic d'Enclar (Bony de la Pica)" / "Bony de la Pica o Pica d'Os" | Iguales en los datos; el ICGC dice "Bony de la Pica". El nombre visible sigue pendiente (ESTADO) |
| costa-pubilla | 2056 / 2056 | Ripollès / = | 3 m | añaden "o Pla de Pujalts" | Iguales |
| lo-tesol | 2700 / 2700 | Pallars Sobirà / = | 3 m | añaden "(Tesó de Son)" | Iguales |
| elefant-roca-de-sant-salvador | 1156 / 1156 | Bages / = | 2 m | "L'Elefant" / "Roca de Sant Salvador (l'Elefant)" | Iguales |
| cap-del-verd | 2284 / 2284 | **Alt Urgell** / "Alt Urgell, Berguedà, Solsonès" | 3 m | = | **Revisar en nuestro catálogo**: el punto ICGC es "la Coma i la Pedra" (Solsonès) |
| monturull | 2760 / 2760 | **Alt Urgell** / "Alt Urgell, Andorra, Cerdanya" | 31 m | = | **Revisar en nuestro catálogo**: el punto ICGC es "Lles de Cerdanya" (Cerdanya) |
| tuc-de-ratera | 2861 / 2861 | **Pallars Sobirà** / "Pallars Sobirà, Val d'Aran" | 18 m | = | **Revisar en nuestro catálogo**: el punto ICGC es "Naut Aran" (Aran) |
| creu-de-santos | 942 / 942 | Baix Ebre / "Baix Ebre, Ribera d'Ebre" | **101 m** | = | Nosotros (ICGC "la Creu de Santos, Benifallet"; MDT 941,7); su punto es el de Wikidata |
| cabrera | 1308 / 1308 | Garrotxa / "Garrotxa, Osona" | 6 m | = | Iguales (ICGC: la Vall d'en Bas) |
| castell-de-milany | 1529 / 1529 | **Osona** / "Osona, Ripollès" | 7 m | = | **Revisar en nuestro catálogo**: el punto ICGC es "Vallfogona de Ripollès" (Ripollès) |

Fuera de la muestra, también difieren en altitud (≤ 2 m, en todos tenemos MDT y OSM o Wikidata en `informe.md`): Sant Jeroni 1237/1236, Collbaix 544/543, Castell de Sant Miquel 386/385, Mola de Sant Llorenç 1103/1102 y Pic del Vent 815/816. Ellos ponen 816 en el Pic del Vent, aunque nuestro MDT da 815,3. No hace falta tocar nada.

**Ojo con las comarcas:** el geocodificador del ICGC asigna **un solo municipio** a un punto que está sobre el límite. Las 5 marcas "revisar" son cimas limítrofes que ya figuran en la lista "Comarca del catálogo discutible" de `ESTADO.md`. Antes de cambiar nada, hay que decidirlo con el polígono comarcal del ICGC (`scripts/catalog/build.ts`, tolerancia de frontera) y el visor (https://www.instamaps.cat o https://visors.icgc.cat). Mola d'Estat es la más clara: el ICGC la pone en Prades, Baix Camp.

## 4. SEO

**Búsquedas:** las pruebas se hicieron con WebSearch, un buscador **con sede en EE. UU.**, así que los resultados son **orientativos y poco representativos de Google.es/cat**:

| Consulta | Resultado aproximado |
| --- | --- |
| "100 cims app" | No sale ni Fes Cims ni la FEEC (ruido en inglés) |
| "aplicación 100 cims FEEC registrar cimas" | Sale su ficha de App Store (`cims-mountain-challenges`) y la app "Cimas de Cataluña" |
| "pujar al Pedraforca 100 cims", "Puigmal 100 cims ruta" | femturisme.cat, naciodigital.cat, rutaspirineos, Wikiloc/TwoNav; **Fes Cims no sale** |
| "100 cims essencials llista", "cimas esenciales 100 cims app gratis" | Nada relevante; no sale Fes Cims |
| "fescims" | Su marca no se reconoce |

**Hay que repetir estas consultas en Google España, en una ventana privada y con ubicación en Cataluña, antes del lanzamiento: no verificado.**

**Estructura técnica (comprobada con curl y en el navegador):**

| Elemento | Qué hacen | Comentario |
| --- | --- | --- |
| URLs | `/{en,ca,es}`, `/{lang}/mountains/{slug}`, `/{lang}/ferratas/…`; retos sin idioma (`/100cims`, `/sostres-comarcals`, `/challenges/{slug}`) | Los retos solo existen en una versión: `/es/100cims` y `/ca/100cims` dan 404 |
| Fichas de cima | Title genérico "Explore · Cims", `noindex, follow` y H1 "Carregant…" en el HTML; el contenido llega por API en el cliente. Después de hidratar hay JSON-LD `Mountain` + `BreadcrumbList` + `FAQPage` y H1 con el nombre | **Las fichas no se pueden indexar**: no compiten por "{cim}" |
| Landing `/100cims` | Title "Els 100 Cims de la FEEC · Llista, mapa i altituds \| Cims"; description de unos 160 caracteres; OG con imagen propia; JSON-LD `MobileApplication` (precio 0) + `FAQPage` (FAQ con "no som oficials"); lista de las 522 renderizada en el servidor | Es su página fuerte. Usa la marca FEEC en el title |
| `lang` | `<html lang="en">` en todas las páginas, también `/ca` y `/100cims` | Error: Google puede no ver el catalán |
| hreflang | En el sitemap y en la portada (en/ca/es, `x-default` = en); en las landings de retos no hay | Correcto solo en la portada |
| Sitemap | 55 URLs: portadas, retos, tienda y legales. **Ni una ficha de cima** | https://fescims.com/sitemap.xml |
| robots.txt | Permite los bots de búsqueda (también OAI-SearchBot y Claude-SearchBot); a los bots de entrenamiento les bloquea `/*/mountains/` y `/*/ferratas/` | https://fescims.com/robots.txt |
| Portada | `/` redirige a `/en`; `/ca` tiene title en catalán y hreflang | Inglés por defecto aunque el público sea catalán |

**Oportunidades para nosotros:**
1. **Long tail por cima** ("pujar al {cim}", "{cim} 100 cims", "{cim} altitud", "cómo subir al {cim}"): Fes Cims no compite porque sus fichas son `noindex` y se pintan en el cliente. Las nuestras se prerenderizan con contenido redactado: es nuestra ventaja principal, pero solo cuenta cuando estén en `revisat` e indexables.
2. **Comarcas** ("cims del Berguedà", "cims essencials de l'Alt Urgell"): ellos no tienen páginas de comarca.
3. **Castellano**: ellos no tienen landing de los 100 Cims en castellano, y todas sus páginas se declaran `en`.
4. **Consultas de reglas y validación** ("com validar els 100 cims", "100 cims normativa"): ellos solo tienen una FAQ breve. Nosotros tenemos com-validar, normativa y la exportación.
5. **Lista completa (522)**: ellos ya la cubren con la landing. Para competir hace falta el catálogo de 522 (fase futura) o, de momento, posicionar la lista de **esenciales**.

## 5. Recomendaciones antes del lanzamiento (fase 7)

| # | Recomendación | Prioridad | Esfuerzo |
| --- | --- | --- | --- |
| 1 | Pasar a `revisat` (≥ 400 palabras, revisión de JSR) un primer lote de fichas de las cimas más buscadas (Pedraforca, Puigmal, Pica d'Estats, Matagalls, Montseny, Canigó, Tagamanent, Sant Jeroni…) para indexar ya el long tail que Fes Cims no cubre | Alta | Alto (revisión humana) |
| 2 | Decidir la comarca de las 5 limítrofes de §3 (Mola d'Estat, Cap del Verd, Monturull, Tuc de Ratera, Castell de Milany) con el polígono y el visor del ICGC. Mostrar "al límit de X i Y" en la ficha y en el JSON-LD (`containedInPlace` múltiple) | Alta | Bajo-medio |
| 3 | Sección en `metodologia` y FAQ en fichas con dudas: "Per què l'altitud pot diferir d'altres apps" (ICGC/MDT frente a Wikidata). Refuerza E-E-A-T, y la Mola d'Estat (1127 frente a 1136) es un buen ejemplo | Alta | Bajo |
| 4 | Comprobar en Google.es/cat, en una ventana privada, las consultas de §4 y guardar la línea base (Search Console nada más quitar el `noindex`) | Alta | Bajo |
| 5 | Mensaje diferencial en portada y en `/repte-100-cims`: sin cuenta obligatoria, funciona en el navegador y offline, export de validación FEEC gratis y datos en la UE. Sin nombrar al competidor | Media | Bajo |
| 6 | Landing castellana fuerte (`/es/reto-100-cims`, `/es/cimas-esenciales`) con title y H1 propios; comprobar `lang="es"` y hreflang recíproco | Media | Bajo |
| 7 | `og:image` por ficha (ya está prevista; ellos tienen imagen por cima y por landing) | Media | Medio |
| 8 | 3–5 rutas seleccionadas por ficha (enlaces Wikiloc o de fuentes públicas, `nofollow`, sin copiar sus datos), con km y desnivel de nuestras fuentes | Media | Medio |
| 9 | Seguir sin la marca "FEEC" en titles; usar "repte 100 Cims" como descriptor y el aviso de web no oficial (ellos lo tienen en la FAQ) | Media | Bajo |
| 10 | Más adelante (fase 5+): importar GPX y un reto "sostres comarcals" con los datos del ICGC | Baja | Medio-alto |
