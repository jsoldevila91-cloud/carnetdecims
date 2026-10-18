/**
 * Enllaç extern a les rutes de Wikiloc al voltant d'un cim.
 *
 * Wikiloc no té API pública i les seves condicions prohibeixen el scraping: no es genera cap
 * llistat propi, només s'obre Wikiloc. Es fa servir el mapa de Wikiloc amb una caixa
 * (`sw`/`ne`) centrada al cim: dona les rutes que passen per la zona encara que el cim tingui
 * altres noms o grafies. Subdomini segons l'idioma de la pàgina (`ca.` / `es.`).
 *
 * Fase 6: s'hi afegiran rutes recomanades amb el widget oficial de Wikiloc.
 *
 * **Obrir l'app de Wikiloc (R5.4)**, comprovat el 2026-10-18:
 * - El camí `/openMap` és dels que Wikiloc declara per obrir l'app. iOS (Universal Links):
 *   l'`apple-app-site-association` de `www.`, `ca.`, `es.` i `wikiloc.com` (llegit de la CDN
 *   d'Apple, `app-site-association.cdn-apple.com/a/v1/{host}`, perquè el web el bloqueja als
 *   robots) inclou `/openMap`, `/openApp`, les rutes (`/rutes-*` + `/*`, `/rutas-*` + `/*`,
 *   `/wikiloc/view.do`…) i **no** inclou `/wikiloc/map.do`: per això el mapa obria el navegador.
 *   Android (App Links): `assetlinks.json` de `www.`, `ca.` i `es.wikiloc.com` (API Digital Asset
 *   Links de Google) verifica l'app `com.wikiloc.wikilocandroid` per a tot el domini; quins
 *   camins obre ho diu el manifest de l'app, que no es pot llegir sense l'APK.
 * - Sense l'app (o a l'ordinador), `/openMap` redirigeix (HTTP, 2 salts) a
 *   `/wikiloc/map.do` **conservant `sw`, `ne` i `page`**: el web es veu igual que abans.
 * - No es fa servir `intent://` (només Chrome Android; esquema de l'app no documentat) ni cap
 *   esquema propi: un enllaç `https` normal funciona a tot arreu i manté `rel="nofollow"`.
 * - **No verificat sense dispositiu:** que l'app, en obrir-se, centri el mapa a `sw`/`ne` (pot
 *   obrir el mapa a la posició de l'usuari) i que el manifest d'Android declari `/openMap`.
 *   iOS no obre l'app si l'enllaç s'obre des d'una WebView o des del mateix domini, i en una
 *   PWA instal·lada el comportament pot variar.
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

/** Camí declarat per Wikiloc per obrir l'app (iOS i Android); al web redirigeix a `map.do`. */
export const CAMI_WIKILOC_APP = '/openMap';

export function wikilocUrl(lat: number, lon: number, locale: WikilocLocale): string {
	if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90) {
		throw new RangeError('Coordenades invàlides');
	}
	const dLat = RADI_KM / KM_PER_GRAU_LAT;
	const dLon = RADI_KM / (KM_PER_GRAU_LAT * Math.cos((lat * Math.PI) / 180));
	const sw = `${arrodonir(lat - dLat)},${arrodonir(lon - dLon)}`;
	const ne = `${arrodonir(lat + dLat)},${arrodonir(lon + dLon)}`;
	return `https://${locale}.wikiloc.com${CAMI_WIKILOC_APP}?sw=${sw}&ne=${ne}&page=1`;
}

/**
 * URL del widget oficial d'incrustació de Wikiloc (el codi que dona "Compartir › Incrustar mapa"
 * a cada ruta): `https://{idioma}.wikiloc.com/wikiloc/embedv2.do?id={id}&elevation=on&images=off&maptype=H`.
 * Només es carrega quan l'usuari ho demana (privacitat: és un tercer).
 */
export function wikilocEmbedUrl(id: number, locale: WikilocLocale): string {
	if (!Number.isSafeInteger(id) || id <= 0) throw new RangeError('Id de ruta de Wikiloc invàlid');
	return `https://${locale}.wikiloc.com/wikiloc/embedv2.do?id=${id}&elevation=on&images=off&maptype=H`;
}
