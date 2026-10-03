import { cimPerSlug } from '$lib/data/catalog';
import { crearOpenMeteo } from '$lib/server/meteo/open-meteo';
import { respostaMeteo, type CacheMeteo } from '$lib/server/meteo/servei';
import type { RequestHandler } from './$types';

// Previsió meteorològica d'un cim (proxy amb cache cap a Open-Meteo): s'executa al Worker de
// Cloudflare a cada petició, mai al prerender. Lògica i cache: `$lib/server/meteo/servei.ts`.
export const prerender = false;

const proveidor = crearOpenMeteo();

export const GET: RequestHandler = ({ params, url, platform }) => {
	const cim = cimPerSlug(params.slug);
	const punt =
		cim && cim.lat !== null && cim.lon !== null
			? { lat: cim.lat, lon: cim.lon, altitud: cim.altitud }
			: undefined;
	// `caches.default` del Worker (a `vite dev` no hi ha `platform`: sense cache).
	const cache = (platform?.caches as { default?: CacheMeteo } | undefined)?.default;
	return respostaMeteo({
		slug: params.slug,
		origen: url.origin,
		punt,
		proveidor,
		cache,
		enSegonPla: platform?.ctx ? (p) => platform.ctx.waitUntil(p) : undefined
	});
};
