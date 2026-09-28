# Carnet de Cims (carnetdecims.cat)

PWA de seguimiento personal del reto 100 Cims de la FEEC. Web **no oficial**. "100 Cims" es marca de la FEEC: se usa solo como descriptor, nunca como nombre ni logo, y no se usan logos de la FEEC. El usuario habla castellano; la interfaz es en catalán (principal) y castellano.

## Empezar cada sesión

1. Leer `docs/ESTADO.md`: bloque actual y siguiente paso.
2. Leer solo la sección de los documentos que haga falta:
   - `docs/04-plan-fases.md`: bloques de sesión y reglas para ahorrar uso.
   - `docs/02-arquitectura-seo.md`: URLs y plantillas.
   - `docs/03-modelo-datos.md`: datos y reglas del reto.
   - `docs/05-frontend-arquitectura.md`: frontend.
   - `docs/06-estrategia-qa.md`: tests.
3. Al terminar el bloque: commit + push y actualizar `docs/ESTADO.md`.

## Stack

SvelteKit 2 + Svelte 5 (runes) + TypeScript, Paraglide 2 (`/ca/…`, `/es/…`; rutas en `src/lib/i18n/routes.ts`), adapter Cloudflare Workers, Vitest 4 + Playwright + axe. Futuro: Supabase (UE), Dexie, MapLibre + ICGC, Capacitor.

- Capas: `src/lib/domain` (reglas puras y testeadas), `src/lib/data` (catálogo `data/catalog/*.json`), `src/lib/platform`, `src/lib/ui` (sistema de diseño **Segells**, claro/oscuro).
- Textos de la interfaz siempre en `messages/ca.json` y `messages/es.json`, nunca hardcodeados.
- Catálogo: generado por `npm run catalog:build` (`scripts/catalog/`). Nunca se edita el JSON a mano. **Cuando las fuentes no coinciden, prevalece el ICGC.** No se copia la tabla de la FEEC.

## Comandos

- `npm run dev`: http://localhost:5190 (puerto propio).
- `npm run check`, `npm run lint`, `npx vitest run`.
- `npx playwright test`: E2E completo; solo al cerrar una fase.

## Entorno

Windows + PowerShell. Git no está en el PATH de las shells abiertas antes de instalarlo: recargar con
`$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")`.
Remoto: https://github.com/jsoldevila91-cloud/carnetdecims (rama `main`).

## Agentes

`.claude/agents/`: frontend-expert, backend-expert, seo-expert, qa-expert. Plan Pro: como máximo un agente por bloque. QA y SEO completos solo al cerrar una fase.
