# 05 · Arquitectura frontend — Carnet de Cims (carnetdecims.cat)

> Fase 0 (planificación). Autor: agente frontend-expert. Fecha: 2026-09-27. Pendiente de aprobación.
> Alineado con `01-stack.md` (SvelteKit 2 + MapLibre + Dexie + `@vite-pwa/sveltekit` + Capacitor) y con las URLs de `02-arquitectura-seo.md`. Lo marcado **[agnóstico]** vale igual con Next.js o Astro; entre corchetes, la equivalencia en Next.
> Propuestas visuales: `docs/propuestas-visuales/index.html`.

## 1. Navegación tipo app

**Dos zonas, un solo proyecto:**

| Zona | Rutas (ca; es equivalente) | Render | Indexable |
|---|---|---|---|
| Pública (contenido) | `/ca/cims`, `/ca/cims/{slug}`, `/ca/comarques/{slug}`, `/ca/cims-essencials`, `/ca/mapa`, `/ca/repte-100-cims/*`, guías | Prerender (SSG), HTML completo sin JS | Sí (fichas solo si `revisat`) |
| App (datos del usuario) | `/ca/app` (progreso), `/ca/app/registrar`, `/ca/app/historial`, `/ca/app/a-prop`, `/ca/app/compte` | SPA en cliente (`ssr = false`) [Next: `'use client'` + export estático] | No (`noindex`, fuera del sitemap) |

**Barra inferior (móvil < 768 px), 5 destinos fijos:** Inici → `/ca/app` · Mapa → `/ca/mapa` · **Registrar** (botón central, abre modal) · Cims → `/ca/cims` · Perfil → `/ca/app/compte`. En escritorio se convierte en barra lateral/superior. Se muestra también en las páginas públicas, para que quien llega desde Google entre directamente en la app.

- **Modales y bottom sheets como estado de ruta** (SvelteKit *shallow routing* `pushState` [Next: parallel/intercepting routes]): el botón "atrás" del móvil cierra el sheet del mapa o el formulario de registro, igual que en una app nativa. **[agnóstico]**
- **Transiciones:** View Transitions API (`onNavigate` + `document.startViewTransition`) con *fallback* sin animación; en push de ficha, desplazamiento lateral; en modal, subida desde abajo. Todo desactivado con `prefers-reduced-motion`. **[agnóstico]**
- **Memoria por pestaña:** cada tab conserva su scroll y filtros (store en memoria + `sessionStorage`); tocar la pestaña activa hace scroll arriba.
- **Estados definidos en cada pantalla:** vacío (0 ascensiones → CTA "Registra el teu primer cim" + 3 sugerencias cercanas), cargando (*skeletons* con la forma final, sin *spinners*), error, **sin conexión** (banner discreto "Sense connexió · les dades es desen al dispositiu") y éxito (toast + `aria-live`).
- **Registro optimista:** al guardar, se escribe en IndexedDB, se actualiza el contador (37 → 38) con microanimación y la sincronización va a la cola (outbox). Nunca bloquear la UI esperando a la red.
- Aviso de **web no oficial** en el pie de todas las páginas públicas y en el formulario de registro ("La validació la fa la FEEC a través de les entitats"). "100 Cims" solo como descriptor, nunca como logo.

## 2. Estrategia PWA

**Manifest** (`/manifest.webmanifest`, uno por idioma): `name: "Carnet de Cims"`, `short_name: "Carnet de Cims"`, `start_url: "/ca/app?source=pwa"`, `scope: "/"`, `display: "standalone"`, `theme_color`/`background_color` = tokens de la propuesta elegida, iconos 192/512 + `maskable` + monocromo, `shortcuts` (Registrar ascensió, Mapa, Cims a prop), `screenshots` para la instalación enriquecida en Android.

**Service worker (Workbox vía `@vite-pwa/sveltekit`) [Next: Serwist]:**

| Recurso | Estrategia | Notas |
|---|---|---|
| Shell de la app (JS/CSS/fuentes/iconos) | Precache con hash | Actualización con aviso "Nova versió disponible · Actualitza" (sin `skipWaiting` forzado) |
| Catálogo `cims.{hash}.json` (522 cimas, campos mínimos) | Precache | ≈ 120 KB sin comprimir, ≈ 30 KB gzip. Alimenta mapa, listas, búsqueda y "a prop" sin red |
| Fichas y comarcas (HTML) | Stale-while-revalidate, LRU 200 entradas | Las fichas de los esenciales pendientes del usuario se precargan en segundo plano con wifi |
| Teselas ICGC | Cache-first, LRU (~3.000 teselas / ~60 MB) | Futuro: "Descarregar zona" para uso sin cobertura |
| Meteo `/api/meteo/:cim` | Network-first, timeout 3 s, caché 3 h | Offline: último dato con su hora ("fa 5 h") |
| Datos del usuario | **No van al SW**: Dexie/IndexedDB | Fuente primaria; sync outbox cuando hay sesión y red |

- `navigator.storage.persist()` tras la primera ascensión (evita el desalojo, sobre todo en iOS, que borra datos de webs no instaladas tras 7 días sin uso).
- Instalación: evento `beforeinstallprompt` propio (Android/desktop) mostrado **después** de un registro, no al entrar; en iOS, hoja con instrucciones "Comparteix → Afegeix a la pantalla d'inici".
- El SW **no** sustituye el HTML de las páginas públicas por un shell vacío (requisito SEO).

## 3. Estrategia de mapa

- **Librería:** MapLibre GL JS 6 (WebGL2) + estilo vectorial ICGC topográfico + relieve; el estilo se personaliza con los tokens de la propuesta (curvas de nivel, bosque, tipografía). Atribución ICGC/OSM siempre visible.
- **522 puntos = una sola fuente GeoJSON** generada en cliente a partir del catálogo + estado del usuario (`fet`, `essencial`). `cluster: true`, `clusterRadius: 48`, `clusterMaxZoom: 11`; los clusters muestran el número y un anillo con la proporción hecha/pendiente. Con 522 puntos no hace falta supercluster aparte ni teselas de puntos.
- **Codificación doble (color + forma):** cercle = cim, rombe = essencial; relleno = fet, contorno = pendent. Iconos SDF para recolorear por tema sin duplicar imágenes.
- **Filtros** (comarca, altitud, MIDE, essencial, fet/pendent) con `setFilter` sobre la misma capa: instantáneo, sin recargar datos; sincronizados con la query string (`?essencials=1&estat=pendent`), no indexable (canonical a la base).
- **Carga diferida:** el chunk de MapLibre (~220 KB gzip) solo se descarga en `/ca/mapa` o cuando el contenedor entra en viewport (`IntersectionObserver` + `import()`). Antes, se muestra una **imagen estática** prerenderizada del mapa (SVG/WebP) con los puntos, que es el LCP y sirve sin JS. En la ficha: miniatura estática + botón "Obre al mapa".
- **Alternativa accesible:** conmutador "Mapa | Llista" con los mismos filtros; la lista ordenada por distancia es también la vista "Cims a prop" (distancia Haversine en cliente, sin red).
- Geolocalización solo tras acción explícita del usuario ("Troba cims a prop"), nunca al cargar.

## 4. Accesibilidad (WCAG 2.2 AA)

- Tokens de color verificados: texto ≥ 4,5:1, componentes y gráficos ≥ 3:1; el estado nunca depende solo del color (forma + texto).
- Objetivos táctiles ≥ 44 × 44 px (supera el 2.5.8, 24 px); foco visible propio (2.4.11/2.4.13) que no queda tapado por la barra inferior ni por los sheets (2.4.11 *Focus Not Obscured*: `scroll-padding-bottom`).
- Bottom sheets y modales: `role="dialog"`, foco atrapado y devuelto, cierre con Esc/atrás, título enlazado. Alternativa a arrastrar (2.5.7): botones de expandir/cerrar.
- Formularios: `label` reales, errores en texto junto al campo y resumen con `aria-live`; el método (a peu/BTT/esquí/raquetes) como `radiogroup` nativo.
- Tipografía en `rem` (respeta el tamaño del sistema), reflow a 320 px, `lang` correcto por página, `prefers-reduced-motion` y `prefers-color-scheme` (modo oscuro).
- Tests: `axe-core` en Playwright para cada página + revisión manual con VoiceOver/TalkBack antes de cerrar cada fase.

## 5. Rendimiento (Core Web Vitals, p75 móvil)

- Objetivos: **LCP < 2,0 s** (4G, gama media), **INP < 200 ms**, **CLS < 0,05**.
- Presupuesto de JS: páginas públicas < 50 KB gzip (sin mapa); zona app < 150 KB; MapLibre aparte y diferido.
- Fuentes: máx. 2 familias, `woff2` autoalojadas con subset latin + catalán (·l), `preload` de la principal, `font-display: swap` y *fallback* con `size-adjust` para no generar CLS.
- Imágenes: AVIF/WebP responsive con `width/height`; imágenes OG por ficha generadas en build (el segell/tarjeta de la propuesta elegida).
- Listas largas (522): renderizado por bloques con `content-visibility: auto`; búsqueda con índice normalizado (sin acentos) precalculado en build.
- Medición: Lighthouse CI en cada PR con presupuestos que rompen el build + RUM con Cloudflare Web Analytics.

## 6. Preparación para app nativa (Capacitor)

- **Capas separadas [agnóstico]:** `domain/` (reglas del reto, niveles, límite anual, validación de fechas: TS puro y testeado), `data/` (repositorios sobre Dexie + sync, sin imports del framework), `platform/` (interfaces `Geolocation`, `Share`, `Storage`, `Haptics`, `Notifications` con implementación web y Capacitor) y `ui/` (componentes). Los componentes no llaman a APIs del navegador directamente.
- La zona `/app` se compila con `adapter-static` + fallback SPA → misma build dentro de Capacitor; las páginas públicas siguen en la web.
- **Design tokens en JSON** (color, tipografía, espacio, radio, sombra) → CSS custom properties hoy; mañana, recursos nativos (splash, iconos, status bar) con Style Dictionary.
- UI pensada para táctil: nada depende de `hover`; `env(safe-area-inset-*)` en barra inferior y cabeceras; gestos con alternativa en botón.
- Enlaces profundos estables (`/ca/cims/{slug}`) → Universal Links / App Links para abrir la ficha en la app instalada.
- Autenticación con flujo compatible con nativo (OTP por email, `signInWithIdToken` para Google/Apple), sin depender de cookies de terceros.

## 7. Decisiones pendientes para el usuario

1. Elegir dirección visual (recomendación: **3 · Segells** como identidad + la sobriedad de **1 · Topogràfic** en mapa y fichas; ver `propuestas-visuales/index.html`).
2. ¿Modo oscuro desde el MVP o en una fase posterior? (recomendado: tokens preparados desde el día 1, tema oscuro en la fase 2).
