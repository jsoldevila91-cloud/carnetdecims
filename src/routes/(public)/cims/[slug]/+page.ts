import { error } from '@sveltejs/kit';
import { cimPerSlug, cimsMateixaComarca, cimsPropers, comarcaPerSlug } from '$lib/data/catalog';
import type { PageLoad } from './$types';

// Fitxa estàtica (SSG). Les URL localitzades (/ca/cims/…, /es/cimas/…) s'afegeixen a
// `prerender.entries` a vite.config.ts amb `cimEntries()`. No s'exporta `entries` aquí:
// SvelteKit en generaria el camí intern sense idioma (/cims/{slug}), que no és cap URL
// pública (el hook el redirigeix a /ca/…) i trenca el prerender.
export const prerender = true;

export const load: PageLoad = ({ params, data }) => {
	const cim = cimPerSlug(params.slug);
	if (!cim) error(404, 'Not found');

	const comarca = comarcaPerSlug(cim.comarca);
	if (!comarca) error(500, `Comarca desconeguda: ${cim.comarca}`);

	return {
		// `contingut` i `indexable` (contingut editorial, fase 6): `+page.server.ts`.
		...data,
		cim,
		comarca,
		propers: cimsPropers(cim, 6),
		mateixaComarca: cimsMateixaComarca(cim, 3)
	};
};
