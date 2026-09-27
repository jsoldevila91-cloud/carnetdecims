# 04 · Decisiones y plan de fases — Carnet de Cims

> Consolidado a partir de los documentos 01, 02, 03 y 05. Fecha: 2026-09-27.

## Decisiones tomadas

| Tema | Decisión |
|---|---|
| Marca y dominio | **Carnet de Cims**, `carnetdecims.cat`. "100 Cims" solo como descripción; aviso de web no oficial en todas las páginas |
| Producto | Seguimiento personal, registro manual y uso sin cuenta (offline) con cuenta opcional |
| Idiomas | Catalán (principal) y castellano, en `/ca/` y `/es/` |
| Stack | SvelteKit 2 + TypeScript, Cloudflare Workers, Supabase (UE), Dexie (IndexedDB), MapLibre + ICGC, Open-Meteo con proxy, Paraglide, Vitest + Playwright, Capacitor en el futuro |
| Dirección visual | **3 · Segells** tal cual: tinta azul `#1B2A47`, sello rojo `#C0392B`, Archivo + IBM Plex Mono y páginas de carnet I–V |
| Modo oscuro | **Desde el MVP**, siguiendo el ajuste del sistema |
| Cuentas | Email (enlace mágico) y Google en el MVP. Apple cuando llegue la app iOS |
| Monetización | Ninguna de momento. El proveedor de meteo se hace intercambiable por si cambia |
| Reglas ambiguas | Interpretación de `03-modelo-datos.md` §3.3 (cimas distintas para 2×100, etc.), configurable |

## Ciclo de trabajo por página

1. **backend** y **frontend** construyen la página.
2. **seo** la revisa y la optimiza.
3. **qa** la prueba: tests, navegador en móvil y escritorio, modo oscuro, offline y accesibilidad.
4. Se corrigen los errores y **qa** verifica los arreglos.
5. Commit.

Al final de cada fase, el usuario revisa y aprueba.

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
- [ ] Comprobar que **carnetdecims.cat** está libre y comprarlo.
- [ ] Buscar "Carnet de Cims" en TMview.
- [ ] Crear una cuenta en **GitHub** (hace falta para desplegar en Cloudflare).
- [ ] Escribir a **100cims@feec.cat**: permiso para usar la lista de 522 cimas y confirmación de las reglas ambiguas. Claude puede redactar el email.
