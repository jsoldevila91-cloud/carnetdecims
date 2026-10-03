# 01 · Propuesta de stack

> Fase 0 (planificación). Autor: agente backend-expert. Fecha: 2026-09-27.
> Versiones y precios verificados en la web en esa fecha (fuentes al final). Pendiente de aprobación del usuario.

## 1. Requisitos que condicionan la elección

| Requisito                                                               | Consecuencia técnica                                                                                                                  |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| SEO: 522 fichas + ~45 comarcas + páginas guía, en ca y es (~1.200 URLs) | Prerender (SSG) en build, HTML completo sin JS, muy poco JS por página (Core Web Vitals)                                              |
| Navegación tipo app, PWA instalable, offline                            | Router en cliente, service worker con precache del shell + catálogo, datos del usuario en IndexedDB                                   |
| Uso sin cuenta + cuenta opcional con sync                               | _Local-first_: el dispositivo es la fuente primaria; la nube es réplica y copia de seguridad                                          |
| "Cimas cercanas"                                                        | 522 puntos caben en memoria: distancia calculada **en el cliente** (funciona offline). PostGIS solo para usos futuros (GPX, check-in) |
| App nativa futura reutilizando código                                   | Envolver la misma web con Capacitor (reutilización ~95 %)                                                                             |
| Presupuesto modesto                                                     | Hosting estático en CDN + BaaS gestionado con plan fijo                                                                               |

## 2. Alternativas comparadas

### 2.1 Framework web

| Criterio                                      | **SvelteKit 2** (Svelte 5)                                | Astro 7                                                               | Next.js 16                                                                                        |
| --------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Versión estable (sep-2026)                    | 2.70 (v3 en `@next`, preview)                             | 7.3                                                                   | 16.3 (LTS activa)                                                                                 |
| SSG/SEO                                       | Excelente: `prerender = true` por ruta, HTML completo     | Excelente, 0 JS por defecto                                           | Muy bueno, pero con más JS base (runtime React)                                                   |
| Parte "app" (router cliente, estado, offline) | Nativa: la misma app hidrata y navega en cliente          | Débil: es MPA; la zona app sería una isla SPA aparte (dos paradigmas) | Buena, pero `output: 'export'` (necesario para offline/Capacitor) desactiva funciones de servidor |
| Peso JS típico                                | Bajo (compilador, sin runtime virtual DOM)                | Mínimo en páginas de contenido                                        | El más alto de los tres                                                                           |
| Service worker / PWA                          | `src/service-worker.ts` integrado + `@vite-pwa/sveltekit` | Plugin de terceros                                                    | Serwist (terceros)                                                                                |
| Capacitor                                     | `adapter-static` con fallback SPA: directo                | Posible, pero la zona app es la isla SPA                              | Posible con `export`                                                                              |
| Ecosistema / contratación                     | Medio                                                     | Medio                                                                 | El mayor                                                                                          |

**Elección: SvelteKit 2.** Un solo modelo mental para las páginas de contenido prerenderizadas y para la zona app offline, con JS muy bajo (buena base para CWV) y build estático reutilizable en Capacitor. Astro sería la mejor opción si fuera solo contenido; Next.js, si se priorizara el ecosistema React o una futura app React Native (que no es la vía recomendada, ver 2.3). Riesgo: SvelteKit 3 está en preview; empezamos en 2.x y migramos cuando sea estable (el equipo de Svelte anuncia una ruta de migración gradual).

> Nota para seo-expert: equivalencias SvelteKit de lo marcado [Astro]/[Next] en `02-arquitectura-seo.md`: prerender por ruta (`export const prerender = true`), mapa diferido con `import()` dinámico + IntersectionObserver, sitemaps generados como endpoints prerenderizados (`/sitemap-*.xml/+server.ts`).

### 2.2 Backend (BD + auth)

| Criterio                | **Supabase**                                                      | Cloudflare D1 + Better Auth  | Firebase            |
| ----------------------- | ----------------------------------------------------------------- | ---------------------------- | ------------------- |
| Modelo                  | Postgres + PostGIS + RLS                                          | SQLite en el edge            | NoSQL (Firestore)   |
| Geoespacial             | PostGIS nativo                                                    | No (cálculo manual)          | No nativo (geohash) |
| Auth email/Google/Apple | Incluida (magic link/OTP, OAuth, `signInWithIdToken` para nativo) | Librería a mantener nosotros | Incluida            |
| Seguridad por fila      | RLS en SQL, testeable                                             | En código                    | Reglas propias      |
| Portabilidad            | Alta (es Postgres estándar, CLI de migraciones)                   | Media                        | Baja (lock-in)      |
| Coste                   | Free (se pausa tras 7 días sin uso) → **Pro 25 $/mes**            | ~0–5 $/mes                   | Pago por uso        |

**Elección: Supabase**, región UE (Frankfurt o París) por RGPD. Migraciones SQL versionadas con Supabase CLI. El cliente habla con PostgREST/RPC protegidos por RLS; no hace falta servidor propio para el MVP.

### 2.3 App nativa futura

| Criterio             | **Capacitor 8.5**                              | Expo SDK 57 (React Native)                   | Solo PWA           |
| -------------------- | ---------------------------------------------- | -------------------------------------------- | ------------------ |
| Reutilización        | ~95 % (misma web en WebView + plugins nativos) | UI a reescribir (solo se comparte lógica TS) | 100 %, sin tiendas |
| Rendimiento del mapa | WebGL en WebView: suficiente para 522 puntos   | Nativo (MapLibre Native)                     | WebGL              |
| Coste de mantener    | Bajo                                           | Alto (dos UIs)                               | Nulo               |

**Elección: Capacitor** cuando toque (Capacitor 9 previsto para finales de noviembre de 2026). Por eso la lógica de dominio, el almacenamiento y la sync van en módulos TS puros, sin dependencias de SvelteKit.

## 3. Recomendación completa

| Capa              | Elección                                                                                                                                                                                                      | Motivo                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lenguaje          | TypeScript estricto                                                                                                                                                                                           | Tipos compartidos entre dominio, BD (tipos generados por Supabase CLI) y UI                                                                             |
| Framework         | **SvelteKit 2 + Svelte 5 + Vite**                                                                                                                                                                             | Ver 2.1                                                                                                                                                 |
| Render            | Rutas públicas **prerenderizadas** (fichas, comarcas, guías); `/{lang}/app/*` como SPA offline (`ssr = false`)                                                                                                | SEO + app en un solo proyecto                                                                                                                           |
| Hosting           | **Cloudflare Workers + Static Assets** (`adapter-cloudflare`)                                                                                                                                                 | Estáticos gratis e ilimitados, sin coste de tráfico; Worker para la API proxy de meteo y redirecciones                                                  |
| BD + Auth         | **Supabase** (Postgres + PostGIS + Auth + RLS)                                                                                                                                                                | Ver 2.2                                                                                                                                                 |
| Login             | Email con magic link/OTP (sin contraseñas), Google, Apple                                                                                                                                                     | Menos soporte y menos riesgo de seguridad. Apple exige Apple Developer Program (99 $/año)                                                               |
| Local             | **IndexedDB con Dexie 4.4**                                                                                                                                                                                   | API madura, consultas indexadas, `liveQuery` reactiva, testeable con `fake-indexeddb`                                                                   |
| Sync              | **Propia, tipo outbox + LWW** (detalle en `03-modelo-datos.md`)                                                                                                                                               | El volumen es mínimo (una tabla de ascensiones por usuario); PowerSync, ElectricSQL o Dexie Cloud serían sobredimensionados o añadirían coste o lock-in |
| Catálogo de cimas | JSON versionado en el repo → prerender + precache offline; copia en Postgres para las FK                                                                                                                      | Revisable en diffs, reproducible, funciona sin red                                                                                                      |
| Validación        | **Valibot** (esquemas compartidos cliente/servidor)                                                                                                                                                           | Ligero (tree-shaking)                                                                                                                                   |
| Mapas             | **MapLibre GL JS 6.x** (WebGL2) + estilo vectorial **ICGC `mapa-base-topografic`** + relieve ICGC 5 m. Clustering con la fuente GeoJSON nativa                                                                | Cartografía topográfica oficial y gratuita, con cobertura mundial vía OpenMapTiles/OSM                                                                  |
| Fallback de mapa  | Leaflet + ráster WMTS ICGC solo si hay que dar soporte a dispositivos sin WebGL2                                                                                                                              | MapLibre 6 ha eliminado WebGL1                                                                                                                          |
| Meteo             | **Open-Meteo** detrás de un proxy en un Worker con caché de 3 h por cima                                                                                                                                      | Modelos de alta resolución (AROME, ICON-D2), sin clave. Ver 4 (licencia)                                                                                |
| i18n              | **Paraglide JS** (inlang) para textos de UI; contenido ca/es desde el catálogo; mapa de rutas localizado (`cims`↔`cimas`)                                                                                     | Compilado y tree-shakeable, integración oficial (`sv add paraglide`)                                                                                    |
| PWA               | `@vite-pwa/sveltekit` (Workbox): precache del shell + `cims.json`; páginas de ficha _stale-while-revalidate_; teselas _cache-first_ con límite                                                                | Offline real                                                                                                                                            |
| Tests             | **Vitest** (reglas puras, sync con `fake-indexeddb`), `@testing-library/svelte`, **Playwright** (E2E móvil/escritorio, `context.setOffline(true)`), tests de RLS contra Supabase local (CLI + Docker Desktop) | Cada regla del reto con su test                                                                                                                         |
| Calidad           | ESLint + Prettier + `svelte-check`; CI en GitHub Actions (gratis)                                                                                                                                             |                                                                                                                                                         |
| Analítica         | Cloudflare Web Analytics (sin cookies)                                                                                                                                                                        | Evita el banner de cookies                                                                                                                              |
| Errores           | Sentry (plan gratuito) con los datos personales filtrados                                                                                                                                                     |                                                                                                                                                         |

### Arquitectura resumida

```
Navegador / Capacitor
  ├─ SvelteKit (páginas prerenderizadas + SPA /app)
  ├─ Service worker (precache shell + catálogo, caché de teselas y meteo)
  └─ Dexie/IndexedDB  ← fuente primaria del usuario
        │ sync (outbox push / pull incremental) solo si hay sesión
        ▼
Supabase (Auth + Postgres/PostGIS + RLS + RPC sync_push/sync_pull)
Cloudflare Worker: estáticos, /api/meteo/:cim (proxy+caché), redirecciones 301
Terceros: ICGC (teselas), Open-Meteo (previsión)
```

## 4. Licencias y condiciones de terceros

| Servicio                                               | Licencia / condiciones                                                                                                                                                                                                         | Qué implica                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ICGC (teselas, relieve, topónimos, límites comarcales) | CC BY 4.0; fuera de Catalunya, datos OpenMapTiles/OSM (ODbL); relieve © Mapterhorn                                                                                                                                             | Atribución visible en el mapa: "© ICGC CC BY 4.0 · © OpenMapTiles © OpenStreetMap contributors"                                                                                                                                                                                              |
| OpenStreetMap                                          | ODbL 1.0                                                                                                                                                                                                                       | Atribución "© OpenStreetMap contributors". Si publicamos una **base de datos derivada** (p. ej. coordenadas sacadas de OSM), debe ser ODbL (_share-alike_)                                                                                                                                   |
| Open-Meteo                                             | Datos CC BY 4.0. **Gratis solo para uso no comercial**: se considera comercial una web con **publicidad o suscripciones**. Límites: 10.000 llamadas/día, 5.000/h, 600/min, 300.000/mes. Plan Standard: 29 $/mes (1 M llamadas) | Con caché de 3 h: máx. 522×8 ≈ 4.200 llamadas/día (por centro de datos de Cloudflare). Términos reverificados el 2026-10-03 (bloque 6a: `src/lib/server/meteo/`, proveedor intercambiable `ProveidorMeteo`). Si algún día hay anuncios o suscripción → pagar Standard o cambiar a MET Norway |
| MET Norway (alternativa)                               | CC BY 4.0, **uso comercial gratuito**, User-Agent identificativo obligatorio, máx. 20 req/s, prohíbe llamadas masivas desde el cliente (exige proxy con caché)                                                                 | Plan B sin coste; nuestro proxy ya cumple ese requisito                                                                                                                                                                                                                                      |

## 5. Coste mensual estimado

| Concepto                                        | Desarrollo                         | Lanzamiento (≤ 10k usuarios/mes)                        |
| ----------------------------------------------- | ---------------------------------- | ------------------------------------------------------- |
| Cloudflare Workers                              | 0 € (Free: 100k req/día)           | 0–5 $ (Paid: 10 M req/mes incluidas)                    |
| Supabase                                        | 0 € (Free, se pausa sin actividad) | **25 $** (Pro: 8 GB BD, 100k MAU, backups, sin pausa)   |
| Dominio `.com` (+ `.cat` opcional)              | —                                  | ~1–3 €/mes prorrateado                                  |
| Open-Meteo                                      | 0 €                                | 0 € no comercial / 29 $ si hay publicidad o suscripción |
| Apple Developer (Sign in with Apple, App Store) | —                                  | 99 $/año ≈ 8 €/mes (Google Play: 25 $ pago único)       |
| **Total**                                       | **~0 €**                           | **≈ 30–35 €/mes** (≈ 60 €/mes con Open-Meteo comercial) |

## 6. Entorno de desarrollo (Windows)

1. **Instalar Git** (imprescindible para versionar, CI y despliegues): `winget install --id Git.Git -e`, y después `git init` en el proyecto. Recomendado: repositorio privado en GitHub.
2. Node 24 LTS + npm (ya instalados) son válidos. Fijar `"engines": { "node": ">=24" }` y usar `package-lock.json`.
3. Docker Desktop (opcional, necesario para `supabase start` en local y los tests de RLS). Alternativa: un proyecto Supabase de _staging_ en el plan gratuito.
4. Cuentas necesarias: Cloudflare, Supabase, GitHub; Google Cloud (OAuth) y Apple Developer cuando se active ese login.
5. Secretos solo en `.env` (en `.gitignore`) y en las variables de Cloudflare/GitHub; nunca en el repo.

## 7. Decisiones que debe tomar el usuario

1. **SvelteKit vs Astro/Next**: la recomendación es SvelteKit; seo-expert ha preparado su documento para Next/Astro (las equivalencias son directas).
2. **¿Habrá publicidad o suscripción?** Si la respuesta es sí, la meteo pasa a ser de pago (Open-Meteo 29 $/mes) o se cambia a MET Norway.
3. **Login con Apple desde el MVP** (99 $/año) o solo email + Google hasta que exista la app iOS.
4. ~~**Dominio**~~ — Resuelto (2026-09-27): marca **Carnet de Cims**, dominio `carnetdecims.cat` ("100 Cims" es marca registrada de la FEEC).

## Fuentes (consultadas el 2026-09-27)

- Svelte, "What's new in Svelte: August 2026" (SvelteKit 2.70, v3 `@next`): https://svelte.dev/blog/whats-new-in-svelte-august-2026
- Next.js 16.3.6 LTS: https://nextjs.org/blog · Astro 7.3: https://tech-insider.org/astro-vs-nextjs-2026/
- Capacitor 8.5 / hoja de ruta 9: https://ionic.io/blog/capacitor-8-5-released · https://ionic.io/blog/the-road-to-capacitor-9
- Expo SDK 57/58: https://expo.dev/changelog/sdk-58-beta
- Precios de Supabase: https://supabase.com/pricing (resumen en https://uibakery.io/blog/supabase-pricing)
- Precios de Cloudflare Workers: https://developers.cloudflare.com/workers/platform/pricing/
- Vercel Hobby = no comercial (motivo para descartarlo): https://vercel.com/docs/plans/hobby
- Open-Meteo: https://open-meteo.com/en/terms · https://open-meteo.com/en/pricing
- MET Norway: https://api.met.no/doc/TermsOfService
- Recursos ICGC (teselas, estilos, licencias): https://openicgc.github.io/
- MapLibre GL JS v6: https://maplibre.org/maplibre-gl-js/docs/guides/v5-to-v6-migration-guide/
- Dexie 4.4: https://www.npmjs.com/package/dexie
- @vite-pwa/sveltekit: https://vite-pwa-org.netlify.app/frameworks/sveltekit.html
