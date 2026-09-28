/**
 * Enllaç extern a les rutes de Wikiloc al voltant d'un cim.
 *
 * Wikiloc no té API pública i les seves condicions prohibeixen el scraping: no es genera cap
 * llistat propi, només s'obre Wikiloc. Es fa servir el mapa de Wikiloc amb una caixa
 * (`sw`/`ne`) centrada al cim: dona les rutes que passen per la zona encara que el cim tingui
 * altres noms o grafies. Subdomini segons l'idioma de la pàgina (`ca.` / `es.`).
 *
 * Fase 6: s'hi afegiran rutes recomanades amb el widget oficial de Wikiloc.
 */

export type WikilocLocale = 'ca' | 'es';

/**
 * Mitja amplada de la caixa, en km (caixa d'uns 3 km de costat). Amb 3 km de radi, a zones
 * denses (Montcau) només 4 de 24 rutes pujaven al cim. No s'afegeix filtre d'activitat: el
 * paràmetre del mapa no s'ha pogut verificar.
 */
export const RADI_KM = 1.5;
const KM_PER_GRAU_LAT = 111.32;

const arrodonir = (n: number) => Math.round(n * 1e5) / 1e5;

export function wikilocUrl(lat: number, lon: number, locale: WikilocLocale): string {
	if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90) {
		throw new RangeError('Coordenades invàlides');
	}
	const dLat = RADI_KM / KM_PER_GRAU_LAT;
	const dLon = RADI_KM / (KM_PER_GRAU_LAT * Math.cos((lat * Math.PI) / 180));
	const sw = `${arrodonir(lat - dLat)},${arrodonir(lon - dLon)}`;
	const ne = `${arrodonir(lat + dLat)},${arrodonir(lon + dLon)}`;
	return `https://${locale}.wikiloc.com/wikiloc/map.do?sw=${sw}&ne=${ne}&page=1`;
}
