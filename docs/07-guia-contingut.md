# 07 · Guía de redacción de las fichas de cim

> Fase 6. Se aplica a las 150 fichas esenciales (y después a las 522). Contrato de datos: `src/lib/content/fitxes/types.ts` (un archivo `src/lib/content/fitxes/{slug}.ts` por cim, con el slug exacto de `src/lib/data/catalog/cims.json`). Plantilla on-page: `02-arquitectura-seo.md` §4.1. Política de contenido IA y E-E-A-T: `02-arquitectura-seo.md` §6.

## 1. Objetivo

Cada ficha responde a lo que busca quien quiere subir ese cim ("com pujar al Pedraforca", "Pica d'Estats ruta normal", "Matagalls des de Collformic"): dónde empezar, cuánto cuesta, qué dificultad tiene, cuándo ir y qué lo hace especial. Debe ser **útil, veraz y distinta** de las demás fichas. Nada de relleno.

## 2. Estructura de `ContingutFitxa`

| Campo         | Contenido                                                                                                                    | Extensión orientativa (por idioma) |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `descripcio`  | 3–4 párrafos (ver §3)                                                                                                        | 220–350 palabras                   |
| `rutes`       | La ruta normal primero y, si procede, 1–2 alternativas reales                                                                | 2–4 frases por ruta                |
| `consells`    | 3–6 consejos concretos de ese cim (temporada, agua, aparcamiento, transporte, peligros, normativa del espacio protegido)     | 1–2 frases cada uno                |
| `faq`         | 3–5 preguntas reales y específicas del cim (tiempo, con niños, desde dónde es más fácil, invierno, si cuenta como esencial…) | 30–70 palabras por respuesta       |
| `wikiloc`     | 2–3 rutas de la ruta normal elegidas a mano (§8)                                                                             | —                                  |
| `fonts`       | Fuentes generales del texto, con `consultat` (fecha ISO)                                                                     | —                                  |
| `estat`       | Siempre `'esborrany'` al redactar. Solo una persona lo pasa a `'verificat'` / `'revisat'`                                    | —                                  |
| `actualitzat` | Fecha ISO de la última edición                                                                                               | —                                  |

**Longitud mínima:** **≥ 400 palabras por idioma** sumando descripción + descripciones de rutas + consells + FAQ (preguntas y respuestas). En cims famosos y tresmils, apuntar a 550–700. Por debajo de 400 la ficha no puede pasar a `revisat` (el test lo comprueba).

## 3. La descripción (`descripcio`)

Párrafos en este orden (se pueden fusionar si el cim da para poco):

1. **Situación y entorno.** Sierra o macizo, comarca (enlazada), municipios, espacio protegido, relieve y paisaje inmediato. La altitud ya sale en el bloque de datos: no hace falta repetirla salvo que aporte algo (techo de Catalunya, de Andorra, de una comarca).
2. **Por qué es especial.** Historia, toponimia (origen del nombre solo si hay fuente), geología, patrimonio (ermitas, monasterios, cruces, vértices geodésicos), tradiciones (Flama del Canigó, aplecs), su papel en el excursionismo catalán. **Es el bloque que diferencia la ficha**: hechos propios de ese cim, nunca frases intercambiables.
3. **Vistas.** Qué se ve desde la cima, de forma concreta y prudente ("en días claros", "se distinguen…"). No afirmar que se ve el mar o Mallorca si ninguna fuente lo dice.
4. **Cuándo ir.** Temporada recomendable, nieve, calor, tormentas de verano, afluencia (fines de semana, Sant Joan), restricciones si las hay.

## 4. Tono y estilo

- **Catalán estándar** claro, segunda persona del singular cuando se dan consejos ("si hi vas a l'hivern…"), frases cortas, sin superlativos vacíos ("espectacular", "impressionant", "imprescindible") salvo que se justifiquen.
- **Castellano natural**, redactado de nuevo, no traducción literal: "subir al Pedraforca", "la cima", "el collado", "la canal", "desnivel positivo". Los topónimos se mantienen en su forma oficial catalana (Pollegó Superior, Enforcadura, coll de Pal); en Catalunya Nord, forma catalana con la francesa entre paréntesis la primera vez si ayuda (Cortalets, _Cortalets_; Vernet, _Vernet-les-Bains_).
- **Formas con artículo del catálogo:** usar `nom_amb_article` y `nom_amb_de` de `cims.json` y `comarques.json` ("el Pedraforca", "del Pedraforca", "de la Pica d'Estats", "del Berguedà"). En castellano se mantiene el artículo catalán del topónimo cuando forma parte del uso ("el Pedraforca", "la Pica d'Estats", "el Montcau"); las comarcas, "del Berguedà", "de la Anoia" (ver `docs/02` §4.2).
- **Marca:** "100 Cims" solo como descriptor del reto ("cim essencial del repte 100 Cims"); nunca "oficial", nunca hablar en nombre de la FEEC. La validación la hace la FEEC a través de las entidades.
- Prohibido: keyword stuffing, repetir el nombre del cim en cada frase, frases plantilla idénticas entre fichas ("Aquest cim és ideal per a tota la família…").

## 5. Reglas de veracidad (obligatorias)

1. **Nada inventado.** Si un dato no está en una fuente fiable, no se escribe. Mejor una ficha más corta que una cifra falsa.
2. **Cada dato numérico lleva fuente.** Desnivel, distancia, tiempo, altitudes de collados o refugios, años, cifras históricas: la fuente va en `fonts` de la ruta (datos de ruta) o en `fonts` de la ficha (texto general).
3. **Datos de ruta** (`desnivellPositiuM`, `distanciaKm`, `tempsMinuts`): son de **ida** hasta la cima. Solo se rellenan si una fuente fiable los publica o si dos fuentes coinciden razonablemente (±10 %). Si las fuentes dan cifras de ida y vuelta, se convierten solo si la fuente lo permite sin ambigüedad (p. ej. itinerario lineal con el mismo camino de vuelta); si no, se omiten y se describen en el texto citando la fuente. Si el punto de salida es distinto en cada fuente, se elige uno y se usan solo las cifras de las fuentes con ese mismo punto.
4. **MIDE solo si una fuente fiable lo publica** para ese itinerario: fichas o reseñas de la FEEC, Diputació de Barcelona / parques naturales, Generalitat, Prames, guías editoriales reconocidas, refugios que publiquen el MIDE oficial. Nunca se estima.
5. **Altitud del cim:** la del catálogo (cota popular validada con el ICGC). Si una fuente da otra cota, no se "corrige" la ficha: se anota para revisión.
6. **Grafía:** prevalece el ICGC (nomenclátor) en Catalunya; Govern d'Andorra en Andorra; forma catalana tradicional con la francesa del IGN como alias en Catalunya Nord.
7. **Redacción propia.** Se leen varias fuentes y se escribe con palabras propias; no se copian frases ni la estructura de una reseña concreta. No se copian las tablas de la FEEC.
8. **Coordenadas de salida:** solo con fuente (ICGC, IGN, parque natural, refugio); si no, solo el nombre.
9. **Fuentes válidas, por orden de preferencia:** ICGC; parques naturales y espacios protegidos (Generalitat, Diputació de Barcelona, Govern d'Andorra, Grand Site/PNR en Catalunya Nord); ayuntamientos y oficinas de turismo; FEEC y sus entidades; refugios; Viquipèdia/Wikipedia (para historia y toponimia, contrastada); guías editoriales y clubes reconocidos. Blogs personales y tracks de usuarios: solo para contrastar, no como única fuente de una cifra.
10. Cada `FontCitada` lleva `consultat` con la fecha de consulta.

## 6. Seguridad de montaña

- No dar indicaciones que puedan inducir a error: si un paso exige trepar (Pedraforca, canal del Verdet), decirlo claramente; si hay riesgo de desprendimientos, tartera, hielo o niebla, decirlo.
- No describir variantes de escalada o alpinismo como "excursión". Si una ruta exige material o experiencia, se indica.
- Invierno: en cims que se cubren de nieve, avisar de que la ruta cambia (crampones, piolet, riesgo de aludes) y remitir a la predicción del ICGC/Meteocat; no dar itinerarios invernales concretos sin fuente.
- Tormentas de verano en el Pirineo: madrugar y bajar antes de mediodía.
- Emergencias: **112**. No dar otros teléfonos sin fuente.
- Respetar la normativa de los espacios protegidos (aparcamientos regulados, accesos restringidos, perros, acampada).
- Frase prudente cuando proceda: la ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.

## 7. Enlaces internos

- Sintaxis `[text](/camí)` con caminos internos deslocalizados: `/cims/{slug}`, `/comarques/{slug}`, `/cims-essencials`, `/tresmils`, `/cims-mes-alts`, `/repte-100-cims`, `/repte-100-cims/normativa`, `/mapa`. El componente los localiza (`/es/cimas/…`).
- En cada ficha: **la comarca** (en la descripción) y **1–3 cims cercanos** del catálogo con relación real (mismo macizo, travesía habitual, mismo parque). Anclas descriptivas ("el Comabona", "els cims del Berguedà"), nunca "aquí".
- Solo slugs existentes (el test lo comprueba). Máximo ~6 enlaces internos en el texto para no saturar.
- Externos (`https://…`) solo a fuentes oficiales útiles (parque natural, refugio, transporte). Wikiloc va en su campo, no en el texto.

## 8. Wikiloc (`wikiloc`)

- 2–3 rutas **de la ruta normal** (o de la alternativa principal descrita en `rutes`), **no motorizadas** (senderismo, alpinismo, a pie, raquetas), **bien valoradas** cuando haya valoración, con un track completo (distancia y desnivel coherentes con la ascensión) y título claro.
- Solo se guarda `id`, `titol` (tal como sale en Wikiloc) y `url`. No se copian descripciones, fotos ni datos del track.
- Se eligen a mano en el navegador (las condiciones de Wikiloc prohíben el scraping; no se automatiza la selección). Si no se puede acceder a Wikiloc, el campo se deja vacío y se anota en el informe.

## 9. FAQ

- 3–5 por idioma, mismas preguntas en ca y es (estructura simétrica).
- Preguntas que la gente busca de verdad: "Quant es triga a pujar…?", "Es pot pujar amb nens?", "Quina és la ruta més fàcil?", "Cal material a l'hivern?", "Compta com a cim essencial?".
- Las respuestas repiten los datos con la misma fuente que la ruta (no cifras nuevas sin fuente). Sin FAQ genéricas copiadas entre fichas.

## 10. Checklist antes de pedir revisión

- [ ] Slug exacto del catálogo y `estat: 'esborrany'`.
- [ ] ≥ 400 palabras por idioma (550+ en cims famosos).
- [ ] ca y es simétricos: mismo número de párrafos, rutas, consells y FAQ.
- [ ] Cada cifra y cada MIDE con fuente; `consultat` en todas las fuentes.
- [ ] Enlace a la comarca y a 1–3 cims cercanos; todos los enlaces existen.
- [ ] Ninguna frase copiada; ninguna frase plantilla repetida de otra ficha.
- [ ] Avisos de seguridad donde toca (trepadas, nieve, tormentas).
- [ ] Wikiloc: 2–3 rutas o campo vacío con nota.
- [ ] `npx vitest run --project server` en verde.

## 11. Proceso de revisión

1. Redacción asistida por IA → `esborrany` (noindex).
2. Verificación de datos contra las fuentes citadas → `verificat`.
3. Revisión humana con criterio de montaña (JSR) → `revisat` (indexable, en el sitemap, "Revisat el {data}").
