import { json } from '@sveltejs/kit';
import { dificultatFitxa, totsElsContingutsFitxa } from '$lib/content/fitxes';
import type { NivellDificultat } from '$lib/domain';
import type { RequestHandler } from './$types';

// Dificultat orientativa (nivell 1–4) de la ruta normal de cada cim amb fitxa, per a "El teu
// proper cim" (bloc R2). Es prerenderitza: el client la demana sota demanda (no carrega les fitxes).
export const prerender = true;

export const GET: RequestHandler = () => {
	const dificultats: Record<string, NivellDificultat> = {};
	for (const c of totsElsContingutsFitxa()) {
		const d = dificultatFitxa(c);
		if (d) dificultats[c.slug] = d.nivell;
	}
	return json(dificultats);
};
