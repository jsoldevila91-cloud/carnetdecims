import { CIMS } from '$lib/data/catalog';
import { crearOpenMeteoActual } from '$lib/server/meteo/open-meteo';
import type { CacheMeteo } from '$lib/server/meteo/servei';
import { respostaMeteoAra, type CimMeteoAra } from '$lib/server/meteo/servei-ara';
import type { RequestHandler } from './$types';

// Temps actual de tots els cims (icones de les llistes, R5.2): una sola foto per hora amb una
// crida multipunt a Open-Meteo. S'executa al Worker a cada petició, mai al prerender. Ruta
// estàtica: té prioritat sobre `/api/meteo/[slug]` (cap cim es diu `ara`; hi ha test).
// Lògica, cache i validació: `$lib/server/meteo/servei-ara.ts`.
export const prerender = false;

const proveidor = crearOpenMeteoActual();

const CIMS_AMB_PUNT: readonly CimMeteoAra[] = CIMS.flatMap((c) =>
	c.lat !== null && c.lon !== null
		? [{ slug: c.slug, punt: { lat: c.lat, lon: c.lon, altitud: c.altitud } }]
		: []
);

export const GET: RequestHandler = ({ url, platform }) => {
	const cache = (platform?.caches as { default?: CacheMeteo } | undefined)?.default;
	return respostaMeteoAra({
		url,
		cims: CIMS_AMB_PUNT,
		proveidor,
		cache,
		enSegonPla: platform?.ctx ? (p) => platform.ctx.waitUntil(p) : undefined
	});
};
