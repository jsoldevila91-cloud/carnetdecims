# Prompt inicial — Carnet de Cims (carnetdecims.cat)

## Objetivo
Construir **Carnet de Cims** (dominio **carnetdecims.cat**), una web-app para el seguimiento personal del reto **100 Cims de la FEEC**. Tiene que comportarse como una app nativa: navegación fluida, instalable en el móvil (PWA) y usable con mala cobertura. La arquitectura debe permitir convertirla más adelante en app nativa (iOS/Android) reutilizando el máximo de código.

Es un proyecto **independiente, no oficial**. La web debe dejar claro que la validación oficial de ascensiones la hace la FEEC a través de las entidades, y no debe usar la marca FEEC de forma que parezca oficial.

**Marca:** "100 Cims" es una marca registrada de la FEEC. Por eso:
- El nombre propio de la web es **Carnet de Cims**, que evoca el carnet del excursionista con sellos.
- "100 Cims" solo se usa para describir el servicio, por ejemplo con el subtítulo "El teu seguiment del repte 100 Cims", y nunca forma parte del nombre ni del logo.
- No se usan logos de la FEEC.
- Todas las páginas llevan un aviso de que la web no es oficial.

## Contexto del reto
- 522 cimas de Catalunya, Andorra y Catalunya Nord, agrupadas por comarca. Unas 150 son "essencials".
- El objetivo es subir 100. Niveles de reconocimiento: 100, 2×100, 3×100, 4×100 y 5×100.
- Solo cuentan las ascensiones desde el 01/07/2006. Máximo 100 cimas validadas por año natural.
- Métodos válidos: a pie, BTT, esquí y raquetas. Nada motorizado.
- Reto infantil (7–14 años): 50 cimas, sin distinción de esenciales ni límite anual.
- Algunas cimas tienen restricciones de acceso.
- Fuentes: https://www.feec.cat/activitats/100-cims/ · https://www.feec.cat/wp-content/uploads/2020/02/Essencials-100-cims.pdf

## Usuarios y datos
- Se puede usar **sin cuenta**: los datos se guardan en el dispositivo y la app funciona offline.
- Hay **cuenta opcional** (email / Google / Apple) para sincronizar entre dispositivos y tener copia de seguridad. Al crear la cuenta se migran los datos locales.
- **Registro manual de ascensión:** cima, fecha, método y nota opcional.
- Cumplimiento del RGPD: aviso de privacidad, exportar y borrar datos.

## Funcionalidades del MVP
1. **Mapa de cimas:** las 522 cimas con clustering y filtros (comarca, altitud, dificultad, esencial, hecha/pendiente). Base topográfica (ICGC/OSM).
2. **Progreso y logros:** contador, nivel actual (100, 2×100…), % por comarca, esenciales pendientes e historial.
3. **Cimas cercanas:** con la geolocalización del usuario, sugerir cimas pendientes ordenadas por distancia.
4. **Fichas públicas de cada cima (indexables):**
   - Nombre, altitud, comarca, si es esencial, coordenadas, mapa y restricciones de acceso.
   - Dificultad según la **escala MIDE** (medio, itinerario, desplazamiento, esfuerzo; 1–5) de la ruta normal.
   - Texto descriptivo único.
   - Rutas de acceso: puntos de salida, desnivel, tiempo y enlaces externos.
   - Previsión meteorológica en la cima.
5. **Páginas de comarca (indexables):** listado de cimas, mapa y texto introductorio.

Fuera del MVP (futuro): exportación para la FEEC, parte social, fotos, check-in GPS, GPX, reto infantil como modo separado.

## Datos y contenido
- **Catálogo de cimas:** la lista y los atributos oficiales salen de la FEEC. Las coordenadas se completan con OpenStreetMap/ICGC mediante scripts reproducibles, dejando constancia de la fuente de cada dato.
- **Textos, rutas y dificultad MIDE:** se generan con IA a partir de fuentes y cada ficha lleva un estado de revisión (`borrador` / `revisado`). Se empieza por las ~150 esenciales. No se inventan datos: si falta información, el campo queda vacío.

## Idiomas
- Catalán como idioma principal y castellano como segundo.
- URLs localizadas y `hreflang` (p. ej. `/ca/cims/pedraforca`, `/es/cimas/pedraforca`). La estructura exacta la decide el SEO.

## Equipo de agentes y flujo de trabajo
- **backend-expert:** propone y justifica el stack junto con el frontend (priorizando SSR/SSG para el SEO, PWA/offline y futura app nativa). También se encarga del modelo de datos, la API, la autenticación opcional, la sincronización local↔nube, los scripts de importación y las reglas del reto con tests.
- **frontend-expert:** construye cada página con el backend. Propone **2–3 direcciones visuales** para que el usuario elija. Trabaja mobile-first, con navegación tipo app, PWA instalable, offline y accesibilidad WCAG 2.2 AA.
- **seo-expert:** hace un trabajo de posicionamiento a fondo:
  - estudio de palabras clave en catalán y castellano, y arquitectura de URLs;
  - metadatos, schema.org, sitemap y hreflang;
  - enlazado interno y Core Web Vitals;
  - plantilla de contenido para las fichas.
  Revisa cada página antes de darla por terminada.
- **qa-expert:** tras cada página o funcionalidad, prueba en el navegador (móvil y escritorio, offline) y escribe tests (unitarios, integración y E2E). Reporta los bugs con pasos para reproducirlos y verifica los arreglos.

Ciclo por página: **backend + frontend construyen → seo optimiza → qa prueba → se corrigen los errores → qa verifica → se pasa a la siguiente.**

## Primera tarea
Antes de escribir código, presentar para aprobación:
1. Propuesta de stack justificada.
2. Arquitectura de URLs e información (SEO).
3. Modelo de datos.
4. Plan de fases con el orden de las páginas.
5. Las 2–3 propuestas visuales.
