import { ROBOTS_BETA } from './mode-beta-config';

/** Definit per `plugin-mode-beta.ts` (Vite `define`) a partir de `PUBLIC_MODE_BETA`. */
declare const __MODE_BETA__: boolean | undefined;

/**
 * Beta privada: tot el lloc `noindex, nofollow` (capçalera, meta robots i sitemaps buits).
 * Es decideix al build; per defecte `true` fins al llançament (docs/02 §7.1).
 */
export const MODE_BETA: boolean = typeof __MODE_BETA__ === 'boolean' ? __MODE_BETA__ : true;

export { ROBOTS_BETA };
