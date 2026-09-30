/**
 * Geolocalització (implementació web). Només s'ha de cridar en resposta a una acció explícita de
 * l'usuari (p. ex. "Ordena per proximitat"), mai en carregar una pàgina.
 */
import type { Punt } from '$lib/domain';

/** Per què no s'ha pogut obtenir la posició. */
export type ErrorPosicio = 'no-suportada' | 'denegada' | 'no-disponible' | 'temps';

export type ResultatPosicio = { ok: true; punt: Punt } | { ok: false; error: ErrorPosicio };

/** Codis de `GeolocationPositionError` (1, 2, 3) → error propi. */
export function errorDeCodi(codi: number): ErrorPosicio {
	if (codi === 1) return 'denegada';
	if (codi === 3) return 'temps';
	return 'no-disponible';
}

/**
 * Demana la posició actual (precisió baixa: n'hi ha prou per ordenar cims per distància i estalvia
 * bateria). Mai llança: retorna `{ ok: false, error }`.
 */
export function demanarPosicio(
	geo: Geolocation | undefined = typeof navigator !== 'undefined'
		? navigator.geolocation
		: undefined,
	opcions: PositionOptions = { enableHighAccuracy: false, timeout: 15_000, maximumAge: 300_000 }
): Promise<ResultatPosicio> {
	if (!geo) return Promise.resolve({ ok: false, error: 'no-suportada' });
	return new Promise((resolve) => {
		try {
			geo.getCurrentPosition(
				(p) => resolve({ ok: true, punt: { lat: p.coords.latitude, lon: p.coords.longitude } }),
				(e) => resolve({ ok: false, error: errorDeCodi(e.code) }),
				opcions
			);
		} catch {
			resolve({ ok: false, error: 'no-disponible' });
		}
	});
}
