# 06 · Estrategia de QA — Carnet de Cims

> Autor: agente qa-expert. Fecha: 2026-09-27. Aplica desde la fase 1.

## Pirámide de tests

| Capa                    | Herramienta                              | Dónde                     | Qué se prueba                                                                                                                               |
| ----------------------- | ---------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Unitarios (base, ~70 %) | Vitest (Node)                            | `src/**/*.spec.ts`        | Reglas del reto (`domain/`): fechas ≥ 01/07/2006 y no futuras, 100/año, niveles I–V, infantil, métodos; rutas i18n, formato, sitemap        |
| Componentes (~20 %)     | Vitest browser + `vitest-browser-svelte` | `src/**/*.svelte.spec.ts` | Contrato de los componentes de `ui/`: roles/nombres accesibles, estados, eventos (BottomSheet, BottomNav…), con `$app/*` mockeado           |
| E2E (~10 %)             | Playwright + `@axe-core/playwright`      | `e2e/*.e2e.ts`            | Flujos reales sobre la build de producción (`wrangler dev`): navegación, idioma, redirecciones, cabeceras, sheets, offline, axe WCAG 2.2 AA |
| Manual / exploratorio   | Navegador (móvil 375 px y escritorio)    | checklist de abajo        | Lo que no automatizamos bien: sensación táctil, lector de pantalla (VoiceOver/TalkBack) antes de cerrar cada fase, mala conexión real       |

Regla: cada bug que llega a E2E o manual deja un test en la capa más baja posible que lo reproduzca.

## Dispositivos y viewports (proyectos Playwright)

- `mobile-chrome`: Pixel 7 (412 × 839, Chromium, táctil).
- `mobile-safari`: iPhone SE 3.ª gen. (375 × 667, WebKit, táctil) → el ancho de referencia de 375 px.
- `desktop-chrome`: 1280 × 800 (barra lateral en vez de barra inferior).
- Reflow: test específico a 320 px en todas las rutas (WCAG 1.4.10).
- Modo oscuro: `colorScheme: 'dark'` en todos los tests axe (claro y oscuro).

## Checklist por página (antes de marcarla como hecha)

- [ ] Claro y oscuro: contraste correcto, sin colores "quemados" ni fondos sin tema.
- [ ] ca y es: textos traducidos, `<html lang>` correcto, el selector lleva a la ruta equivalente (conserva la query).
- [ ] 375 px y escritorio: sin scroll horizontal (también a 320 px), nada tapado por la barra inferior, objetivos ≥ 44 × 44 px.
- [ ] Teclado: orden de foco lógico, foco visible, "Salta al contingut", Esc cierra sheets y el foco vuelve al control que los abrió.
- [ ] Offline (`context.setOffline` o DevTools): banner "Sense connexió", toast al volver; nada se rompe.
- [ ] SEO: pública → canonical + hreflang, sin `noindex`; `/app/*` → `meta robots noindex` + `X-Robots-Tag`.
- [ ] Sin errores de consola (la fixture de E2E los hace fallar).
- [ ] axe sin violaciones WCAG 2.2 AA en claro y oscuro (y con los sheets abiertos).
- [ ] Estados definidos: vacío, cargando, error, sin conexión, éxito.

## Criterios de "hecho"

1. `npm run check`, `npm run lint` y `npm test` en verde (unitarios + componentes + E2E en los 3 proyectos).
2. Reglas de negocio nuevas → tests unitarios con casos límite (cambio de año, zona horaria Europe/Madrid, duplicados, cima repetida, datos inválidos).
3. Componentes nuevos de `ui/` con interacción → test de componente.
4. Página nueva → añadida a `ROUTES` de `e2e/fixtures.ts` (entra sola en axe, lang, 200, reflow) + checklist manual.
5. Sin bugs abiertos de severidad alta; los medios, documentados con dueño.

## Cómo se ejecuta

```powershell
npm test                      # unitarios + componentes (vitest --run) y después E2E (playwright)
npx vitest                    # modo watch; --project server | client para una sola capa
npx playwright test           # hace build + wrangler dev en :4173 (o reutiliza uno ya abierto)
npx playwright test --project mobile-safari -g "Registrar"
npx playwright test --ui      # depuración; trazas en test-results/ cuando falla
```

- El `webServer` de Playwright borra `.svelte-kit/cloudflare` antes del build: en Windows el adapter falla con `EPERM` si la carpeta ya existe (o si otro proceso, p. ej. otro build o `eslint .`, la tiene abierta).
- La primera vez: `npx playwright install chromium webkit` (lo hace `npm run test:e2e`).
- Tests nuevos: usa `test`/`expect` de `e2e/fixtures.ts` (vigila la consola) y `gotoHydrated()` antes de interactuar con shallow routing.
