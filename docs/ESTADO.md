# Estado del proyecto

> Se actualiza al final de cada bloque. Última actualización: 2026-09-28.

## Hecho

- **Fase 0:** planificación (docs 01–05, propuestas visuales). Decisiones en `04-plan-fases.md`.
- **Fase 1:** base SvelteKit, sistema de diseño Segells claro/oscuro, layout tipo app, i18n ca/es, reglas del reto (105 tests), SEO base (sitemap, OG, JSON-LD, hreflang), QA (Playwright + axe, 223 E2E en verde).
- **Fase 2 (bloque 2a):** catálogo de las 150 esenciales (`src/lib/data/catalog/`), scripts `scripts/catalog/`, esquema `supabase/migrations/0001_cataleg.sql`, atribución de fuentes en el pie.

## Bloque 2b (terminado, pendiente de aprobación del usuario)

- [x] Revisión SEO: slugs definitivos, nombres con grafía ICGC, formas con artículo, `nom` visible/popular, `nom_oficial` y `alies`.
- [x] QA: muestreo de 38 cimas (34 OK, 2 dudosas aceptables, 2 errores corregidos) y controles de calidad nuevos.
- [x] **Prioridad ICGC:**
  - El Tossal de la Creu pasa al Solsonès (`manual.ts` → `comarca`).
  - Lo Tormo toma el vértice geodésico ICGC (523 m).
  - Montclar toma la cima en lugar de la ermita.
- [x] Restricciones de acceso cargadas: La Picossa (fauna, 15/01–15/06) y Sant Salvador de les Espases (obras).
- [x] 155/155 tests; check, lint y catalog:typecheck OK; build reproducible (0 peticiones de red).
- [x] **Fase 2 aprobada por el usuario (2026-09-28).**
- [x] Criterio de altitud (decisión del usuario): **siempre la cota más popular o conocida**, la de los mapas, validada contra el MDT del ICGC. No se usa el máximo bruto del MDT.

## Siguiente

Bloque **3a**: ficha de cim (ver la tabla de bloques en `04-plan-fases.md`).

## Pendiente o decisiones abiertas

- Reglas ambiguas del reto: interpretación por defecto en `03-modelo-datos.md` §3.3.
- Restricciones de acceso: cargadas las 2 esenciales afectadas; hay que revisarlas antes del lanzamiento.
- Pendientes de confirmar: "Pic d'Enclar (Bony de la Pica)" y "La Tossa (Tivissa)" (nombre visible con paréntesis).
