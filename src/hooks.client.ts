import type { ClientInit } from '@sveltejs/kit';
import { retirarNoindexShell } from '$lib/seo/robots-shell';

/**
 * Abans del primer render: treu el meta robots que el servidor injecta al shell de `/app`
 * (`hooks.server.ts`). A partir d'aquí el gestiona `PageMeta`, que el torna a posar a les
 * pàgines `noindex` i no el deixa orfe en navegar cap a una pàgina pública.
 */
export const init: ClientInit = () => {
	retirarNoindexShell(document);
};
