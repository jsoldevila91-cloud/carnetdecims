/**
 * Validació del contingut editorial d'una fitxa de cim (contracte a `types.ts`).
 *
 * `fitxes.spec.ts` la passa a **totes** les fitxes: cap fitxa amb errors arriba al build.
 * Retorna la llista d'errors (buida = vàlida), cadascun amb el camí del camp (`rutes[0].fonts`).
 * Sense dependències de `$lib` (l'importa `index.ts`, que arriba a `vite.config.ts`).
 */
import { distanciaKm } from '../../domain/geo.ts';
import { LOCALES, PRERENDER_PATHS, slugsComarquesAmbCims } from '../../i18n/routes.ts';
import { esUrlExterna } from '../../ui/text-en-linia.ts';
import { destinsEnllacos } from '../text.ts';
import type { FontCitada } from '../types.ts';
import { paraulesFitxa } from './paraules.ts';
import type { ContingutFitxa, EstatContingut } from './types.ts';

/** Cims del catàleg que necessita la validació (`CIMS` de `$lib/data/catalog`). */
export type CatalegValidacio = readonly { slug: string; lat: number | null; lon: number | null }[];

/** Mínim de paraules de contingut propi per idioma (docs/02 §4.1). */
export const MIN_PARAULES_FITXA = 400;

/** Màxim de rutes de Wikiloc triades a mà per fitxa. */
export const MAX_RUTES_WIKILOC = 3;

/**
 * Caixa del territori del repte (Catalunya, Andorra i Catalunya Nord) amb marge: una coordenada
 * de fora és un error de transcripció (lat/lon girades, signe…).
 */
export const BBOX_TERRITORI = { latMin: 40.4, latMax: 43.0, lonMin: 0.1, lonMax: 3.4 } as const;

/** Distància màxima del punt de sortida al cim (km). Més lluny, gairebé segur que és un error. */
export const MAX_KM_SORTIDA = 25;

const ESTATS: readonly EstatContingut[] = ['esborrany', 'verificat', 'revisat'];
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;

function esDataIso(d: unknown): boolean {
	if (typeof d !== 'string' || !DATA_ISO.test(d)) return false;
	const t = new Date(`${d}T00:00:00Z`);
	return !Number.isNaN(t.getTime()) && t.toISOString().slice(0, 10) === d;
}

const textNoBuit = (t: unknown): t is string => typeof t === 'string' && t.trim().length > 0;

function validarFonts(fonts: readonly FontCitada[] | undefined, camp: string, errors: string[]) {
	for (const [i, f] of (fonts ?? []).entries()) {
		if (!textNoBuit(f.nom)) errors.push(`${camp}[${i}].nom buit`);
		if (!esUrlExterna(f.url)) errors.push(`${camp}[${i}].url no és https: ${f.url}`);
		if (f.consultat !== undefined && !esDataIso(f.consultat)) {
			errors.push(`${camp}[${i}].consultat no és una data ISO: ${f.consultat}`);
		}
	}
}

/** Camins interns existents (deslocalitzats): pàgines, fitxes i comarques amb cims. */
function caminsInterns(cataleg: CatalegValidacio): Set<string> {
	return new Set<string>([
		...PRERENDER_PATHS,
		...cataleg.map((c) => `/cims/${c.slug}`),
		...slugsComarquesAmbCims().map((s) => `/comarques/${s}`)
	]);
}

function validarEnllacos(text: string, camp: string, interns: Set<string>, errors: string[]) {
	for (const desti of destinsEnllacos(text)) {
		if (desti.startsWith('/')) {
			const cami = desti.split('#')[0].replace(/(.)\/+$/, '$1');
			if (!interns.has(cami)) errors.push(`${camp}: enllaç intern inexistent ${desti}`);
		} else if (!esUrlExterna(desti)) {
			errors.push(`${camp}: enllaç no vàlid (ni camí intern ni https) ${desti}`);
		}
	}
}

/** `ca` i `es` presents i no buits (text). */
function simetricText(
	valor: Partial<Record<string, string>> | undefined,
	camp: string,
	errors: string[]
) {
	for (const l of LOCALES) {
		if (!textNoBuit(valor?.[l])) errors.push(`${camp}.${l} buit o absent`);
	}
}

/** `ca` i `es` amb el mateix nombre d'elements (traducció paral·lela). */
function simetricLlista(
	valor: Partial<Record<string, readonly unknown[]>> | undefined,
	camp: string,
	errors: string[],
	obligatori: boolean
) {
	if (!valor) {
		if (obligatori) errors.push(`${camp} absent`);
		return;
	}
	const [a, b] = LOCALES.map((l) => valor[l]);
	if (!Array.isArray(a) || !Array.isArray(b)) {
		errors.push(`${camp}: cal ca i es`);
		return;
	}
	if (a.length !== b.length) {
		errors.push(`${camp}: ca té ${a.length} elements i es ${b.length} (han de ser paral·lels)`);
	}
	if (obligatori && a.length === 0) errors.push(`${camp} buit`);
}

function enRang(v: unknown, min: number, max: number): boolean {
	return typeof v === 'number' && Number.isFinite(v) && v > min && v <= max;
}

function dinsTerritori(lat: number, lon: number): boolean {
	const b = BBOX_TERRITORI;
	return lat >= b.latMin && lat <= b.latMax && lon >= b.lonMin && lon <= b.lonMax;
}

/**
 * Errors del contingut d'una fitxa respecte del contracte (`types.ts`) i del catàleg:
 * slug existent; ca/es simètrics; ≥ 400 paraules per idioma; rutes amb dades numèriques o MIDE
 * amb `fonts`; MIDE 1..5; coordenades dins del territori i a prop del cim; enllaços interns
 * existents i externs https; ids únics; `estat` vàlid; Wikiloc amb id numèric i URL de
 * wikiloc.com que hi acaba; dates ISO.
 */
export function validarContingutFitxa(c: ContingutFitxa, cataleg: CatalegValidacio): string[] {
	const errors: string[] = [];
	const cim = cataleg.find((x) => x.slug === c.slug);
	if (!cim) errors.push(`slug inexistent al catàleg: ${c.slug}`);
	if (!ESTATS.includes(c.estat)) errors.push(`estat no vàlid: ${String(c.estat)}`);
	if (!esDataIso(c.actualitzat)) errors.push(`actualitzat no és una data ISO: ${c.actualitzat}`);
	if (!Array.isArray(c.fonts) || c.fonts.length === 0) errors.push('fonts generals buides');
	validarFonts(c.fonts, 'fonts', errors);

	const interns = caminsInterns(cataleg);
	const enllacos = (textos: readonly string[] | undefined, camp: string) =>
		(textos ?? []).forEach((t, i) => validarEnllacos(t, `${camp}[${i}]`, interns, errors));

	// Descripció
	simetricLlista(c.descripcio, 'descripcio', errors, true);
	for (const l of LOCALES) {
		(c.descripcio?.[l] ?? []).forEach((p, i) => {
			if (!textNoBuit(p)) errors.push(`descripcio.${l}[${i}] buit`);
		});
		enllacos(c.descripcio?.[l], `descripcio.${l}`);
	}

	// Rutes
	if (!Array.isArray(c.rutes) || c.rutes.length === 0) errors.push('cal almenys una ruta');
	const ids = new Set<string>();
	for (const [i, r] of (c.rutes ?? []).entries()) {
		const camp = `rutes[${i}]`;
		if (!ID.test(r.id)) errors.push(`${camp}.id no vàlid: ${r.id}`);
		if (ids.has(r.id)) errors.push(`${camp}.id repetit: ${r.id}`);
		ids.add(r.id);
		simetricText(r.nom, `${camp}.nom`, errors);
		simetricText(r.descripcio, `${camp}.descripcio`, errors);
		for (const l of LOCALES) {
			if (r.descripcio?.[l])
				validarEnllacos(r.descripcio[l], `${camp}.descripcio.${l}`, interns, errors);
		}
		if (!textNoBuit(r.sortida?.nom)) errors.push(`${camp}.sortida.nom buit`);

		const { lat, lon } = r.sortida ?? {};
		if ((lat === undefined) !== (lon === undefined)) {
			errors.push(`${camp}.sortida: cal lat i lon alhora`);
		} else if (lat !== undefined && lon !== undefined) {
			if (!dinsTerritori(lat, lon)) {
				errors.push(`${camp}.sortida fora del territori: ${lat}, ${lon}`);
			} else if (cim?.lat != null && cim.lon != null) {
				const d = distanciaKm({ lat, lon }, { lat: cim.lat, lon: cim.lon });
				if (d > MAX_KM_SORTIDA) {
					errors.push(`${camp}.sortida a ${d.toFixed(1)} km del cim (màx. ${MAX_KM_SORTIDA})`);
				}
			}
		}

		if (r.desnivellPositiuM !== undefined && !enRang(r.desnivellPositiuM, 0, 3000)) {
			errors.push(`${camp}.desnivellPositiuM fora de rang: ${r.desnivellPositiuM}`);
		}
		if (r.distanciaKm !== undefined && !enRang(r.distanciaKm, 0, 60)) {
			errors.push(`${camp}.distanciaKm fora de rang: ${r.distanciaKm}`);
		}
		if (
			r.tempsMinuts !== undefined &&
			(!enRang(r.tempsMinuts, 0, 1440) || !Number.isInteger(r.tempsMinuts))
		) {
			errors.push(`${camp}.tempsMinuts ha de ser un enter de minuts: ${r.tempsMinuts}`);
		}
		if (r.mide !== undefined) {
			for (const eix of ['medi', 'itinerari', 'desplacament', 'esforc'] as const) {
				const v: unknown = r.mide[eix];
				if (!Number.isInteger(v) || (v as number) < 1 || (v as number) > 5) {
					errors.push(`${camp}.mide.${eix} ha de ser un enter 1..5: ${String(v)}`);
				}
			}
		}
		const ambDades =
			r.desnivellPositiuM !== undefined ||
			r.distanciaKm !== undefined ||
			r.tempsMinuts !== undefined ||
			r.mide !== undefined ||
			r.sortida?.lat !== undefined;
		if (ambDades && (!Array.isArray(r.fonts) || r.fonts.length === 0)) {
			errors.push(`${camp}.fonts: obligatòries perquè la ruta té dades numèriques o MIDE`);
		}
		validarFonts(r.fonts, `${camp}.fonts`, errors);
	}

	// Consells i FAQ
	simetricLlista(c.consells, 'consells', errors, false);
	for (const l of LOCALES) {
		(c.consells?.[l] ?? []).forEach((t, i) => {
			if (!textNoBuit(t)) errors.push(`consells.${l}[${i}] buit`);
		});
		enllacos(c.consells?.[l], `consells.${l}`);
	}
	simetricLlista(c.faq, 'faq', errors, false);
	for (const l of LOCALES) {
		(c.faq?.[l] ?? []).forEach((f, i) => {
			if (!textNoBuit(f.pregunta)) errors.push(`faq.${l}[${i}].pregunta buida`);
			if (!textNoBuit(f.resposta)) errors.push(`faq.${l}[${i}].resposta buida`);
			validarEnllacos(f.resposta ?? '', `faq.${l}[${i}].resposta`, interns, errors);
		});
	}

	// Wikiloc
	const wikiloc = c.wikiloc ?? [];
	if (wikiloc.length > MAX_RUTES_WIKILOC) {
		errors.push(`wikiloc: màxim ${MAX_RUTES_WIKILOC} rutes (n'hi ha ${wikiloc.length})`);
	}
	const idsWikiloc = new Set<number>();
	for (const [i, w] of wikiloc.entries()) {
		const camp = `wikiloc[${i}]`;
		if (!Number.isSafeInteger(w.id) || w.id <= 0) errors.push(`${camp}.id no numèric: ${w.id}`);
		if (idsWikiloc.has(w.id)) errors.push(`${camp}.id repetit: ${w.id}`);
		idsWikiloc.add(w.id);
		if (!textNoBuit(w.titol)) errors.push(`${camp}.titol buit`);
		let url: URL | null = null;
		try {
			url = new URL(w.url);
		} catch {
			/* error a sota */
		}
		const host = url?.hostname ?? '';
		if (
			!url ||
			url.protocol !== 'https:' ||
			!(host === 'wikiloc.com' || host.endsWith('.wikiloc.com'))
		) {
			errors.push(`${camp}.url no és de https://…wikiloc.com: ${w.url}`);
		} else if (!url.pathname.replace(/\/+$/, '').endsWith(`-${w.id}`)) {
			errors.push(`${camp}.url no acaba amb l'id ${w.id}: ${w.url}`);
		}
	}

	// Paraules
	for (const l of LOCALES) {
		const n = paraulesFitxa(c, l);
		if (n < MIN_PARAULES_FITXA) {
			errors.push(`${l}: ${n} paraules de contingut propi (mínim ${MIN_PARAULES_FITXA})`);
		}
	}
	return errors;
}
