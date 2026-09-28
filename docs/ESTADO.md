# Estado del proyecto

> Se actualiza al final de cada bloque. Última actualización: 2026-09-28.

## Hecho

- **Fase 0:** planificación (docs 01–05, propuestas visuales). Decisiones en `04-plan-fases.md`.
- **Fase 1:** base SvelteKit, sistema de diseño Segells claro/oscuro, layout tipo app, i18n ca/es, reglas del reto (105 tests), SEO base (sitemap, OG, JSON-LD, hreflang), QA (Playwright + axe, 223 E2E en verde).
- **Fase 2 (bloque 2a):** catálogo de las 150 esenciales (`src/lib/data/catalog/`), scripts `scripts/catalog/`, esquema `supabase/migrations/0001_cataleg.sql`, atribución de fuentes en el pie.

## En curso: bloque 2b

- [ ] Revisión SEO de slugs y formas con artículo (agente en curso el 2026-09-28).
- [ ] Verificación QA por muestreo de ~25 cimas (agente en curso).
- [ ] **Prioridad ICGC** (decisión del usuario): comarca y cota oficial del ICGC cuando existan. El Tossal de la Creu pasa al Solsonès, y hay que ajustar el test "conteo por comarca = PDF".
- [ ] El usuario revisa `scripts/catalog/informe.md` y aprueba la fase 2.

## Siguiente

Bloque **3a**: ficha de cim (ver la tabla de bloques en `04-plan-fases.md`).

## Pendiente o decisiones abiertas

- Reglas ambiguas del reto: interpretación por defecto en `03-modelo-datos.md` §3.3.
- Restricciones de acceso por cima: todavía sin datos.
