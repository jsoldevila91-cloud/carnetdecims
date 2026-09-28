# 04 · Decisiones y plan de fases — Carnet de Cims

> Consolidado a partir de los documentos 01, 02, 03 y 05. Fecha: 2026-09-27.

## Decisiones tomadas

| Tema             | Decisión                                                                                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Marca y dominio  | **Carnet de Cims**, `carnetdecims.cat`. "100 Cims" solo como descripción; aviso de web no oficial en todas las páginas                                                        |
| Producto         | Seguimiento personal, registro manual y uso sin cuenta (offline) con cuenta opcional                                                                                          |
| Idiomas          | Catalán (principal) y castellano, en `/ca/` y `/es/`                                                                                                                          |
| Stack            | SvelteKit 2 + TypeScript, Cloudflare Workers, Supabase (UE), Dexie (IndexedDB), MapLibre + ICGC, Open-Meteo con proxy, Paraglide, Vitest + Playwright, Capacitor en el futuro |
| Dirección visual | **3 · Segells** tal cual: tinta azul `#1B2A47`, sello rojo `#C0392B`, Archivo + IBM Plex Mono y páginas de carnet I–V                                                         |
| Modo oscuro      | **Desde el MVP**, siguiendo el ajuste del sistema                                                                                                                             |
| Cuentas          | Email (enlace mágico) y Google en el MVP. Apple cuando llegue la app iOS                                                                                                      |
| Monetización     | Ninguna de momento. El proveedor de meteo se hace intercambiable por si cambia                                                                                                |
| Reglas ambiguas  | Interpretación de `03-modelo-datos.md` §3.3 (cimas distintas para 2×100, etc.), configurable                                                                                  |

## Ciclo de trabajo por página

1. **backend** y **frontend** construyen la página.
2. **seo** la revisa y la optimiza.
3. **qa** la prueba: tests, navegador en móvil y escritorio, modo oscuro, offline y accesibilidad.
4. Se corrigen los errores y **qa** verifica los arreglos.
5. Commit.

Al final de cada fase, el usuario revisa y aprueba.

## Bloques de sesión (plan Claude Pro, ~5 h por sesión)

Cada fase se divide en **bloques de una sesión**. Cada bloque tiene un entregable cerrado y termina con commit + push y la actualización de `docs/ESTADO.md`.

**Reglas de trabajo (decisión del usuario: siempre con agentes):**

1. Al empezar, se leen `CLAUDE.md` y `docs/ESTADO.md`.
2. En **cada bloque** trabajan los agentes:
   1. **backend** y **frontend** construyen, en paralelo con un contrato de API acordado;
   2. **seo** optimiza;
   3. **qa** prueba;
   4. se corrige y **qa** verifica.
3. Claude coordina, verifica (`check`, `lint`, `vitest`, E2E del área) y hace commit + push.
4. La suite E2E completa (3 dispositivos) se ejecuta al cerrar cada fase.
5. Si la sesión se corta, `docs/ESTADO.md` indica exactamente por dónde seguir.

| Bloque | Contenido                                                                                                          | Entregable                             |
| ------ | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| **2b** | Prioridad ICGC (comarca + cota oficial), Tossal de la Creu → Solsonès, integrar la revisión SEO/QA del catálogo    | Catálogo cerrado, fase 2 aprobada      |
| **3a** | Ficha de cim: plantilla, prerender de 150 × 2 idiomas, JSON-LD Mountain + Breadcrumb, mapa estático, cims cercanas | `/ca/cims/{slug}` y `/es/cimas/{slug}` |
| **3b** | Páginas de comarca, listados (cims, esenciales, tresmils…), sitemap con fichas                                     | `/ca/comarques/{slug}` y listados      |
| **3c** | Hub del reto (normativa explicada), portada definitiva, páginas legales y metodología                              | Web pública completa                   |
| **3d** | Pasada completa de QA + SEO de la fase 3 y arreglos                                                                | Fase 3 aprobada                        |
| **4a** | Capa de datos local (Dexie), registrar ascensión, historial                                                        | Registro offline funcionando           |
| **4b** | Carnet: progreso con sellos I–V, esenciales pendientes, progreso por comarca                                       | Pantalla "El meu carnet" real          |
| **4c** | Mapa MapLibre + ICGC, filtros, "Cims a prop"                                                                       | Mapa interactivo                       |
| **4d** | PWA (manifest, service worker, offline, instalación) + pasada completa QA/SEO                                      | Fase 4 aprobada                        |
| **5a** | Proyecto Supabase (UE), auth con email y Google (el usuario crea las cuentas)                                      | Login funcionando                      |
| **5b** | Sincronización y migración local → nube, RGPD (exportar/borrar), QA                                                | Fase 5 aprobada                        |
| **6a** | Plantilla de contenido, meteo (Open-Meteo), textos de 50 esenciales                                                | 50 fichas completas                    |
| **6b** | Textos de 50 esenciales más + rutas de acceso + MIDE                                                               | 100 fichas                             |
| **6c** | Últimas 50 + revisión de calidad + pasada SEO                                                                      | Fase 6 aprobada                        |
| **7a** | Despliegue en Cloudflare, dominio, Search Console, analítica                                                       | Web en producción                      |
| **7b** | QA/SEO final en producción, arreglos, lanzamiento                                                                  | 🚀                                     |

Son unas **16 sesiones** en total. Es una estimación: algunos bloques pueden sobrar y otros alargarse.

## Fases

### Fase 1 · Fundamentos

- Proyecto SvelteKit + TypeScript, estructura por capas (`domain/`, `data/`, `platform/`, `ui/`) e i18n ca/es.
- Sistema de diseño Segells: tokens de color, tipografía y espacio en claro y oscuro, y componentes base (botón, tarjeta, sello, chips, bottom sheet, toast).
- Layout tipo app: barra inferior de 5 pestañas, cabecera, aviso de web no oficial y transiciones entre pantallas.
- Reglas del reto (`domain/repte.ts`) con tests unitarios completos.
- **qa-expert**: estrategia de tests, Playwright + axe, pruebas en móvil (375 px) y escritorio.

### Fase 2 · Catálogo de cimas

- Scripts reproducibles en `scripts/catalog/` para las **150 esenciales** (lista pública del PDF de la FEEC).
- Coordenadas y altitud del ICGC y OSM, con la fuente de cada dato; comarcas; slugs y campos `nom_amb_article` / `nom_amb_de`.
- Se genera un `cims.json` estático y el esquema de Supabase queda preparado.
- La lista completa de 522 queda pendiente del permiso de la FEEC (ver acciones del usuario).

### Fase 3 · Páginas públicas (SEO)

- Ficha de cim, página de comarca, listado de cims y de esenciales, hub del reto con la normativa y portada.
- Metadatos, JSON-LD, hreflang y sitemaps.
- Páginas `/metodologia`, `/sobre-el-projecte`, avís legal y privacitat.

### Fase 4 · La app

- Registrar ascensió, progreso (carnet I–V con sellos), historial, mapa con filtros y "Cims a prop".
- PWA: manifest, service worker, funcionamiento offline e instalación.

### Fase 5 · Cuentas y sincronización

- Supabase Auth (email y Google), migración de los datos locales al crear cuenta y sincronización con cola de cambios pendientes.
- RGPD: exportar y borrar la cuenta.

### Fase 6 · Contenido

- Textos, rutas de acceso y dificultad MIDE de las esenciales, generados con IA y revisados. Solo se indexan las fichas en estado `revisat`.
- Meteo en las fichas.

### Fase 7 · Lanzamiento

- Dominio y despliegue en Cloudflare, Search Console y analítica.
- Revisión final de QA y SEO.
- Después del lanzamiento: el resto de cimas en lotes de 30–50.

## Acciones del usuario (en paralelo)

- [x] Comprobar **carnetdecims.cat**.
- [x] Buscar "Carnet de Cims" en TMview: sin conflictos.
- [x] Crear la cuenta de **GitHub**. Falta crear el repositorio y conectarlo.
- [x] ~~Escribir a la FEEC~~. Decisión del usuario: no se contacta. El catálogo se construye con datos propios (ICGC/OSM) y no se copia la tabla de la FEEC.
