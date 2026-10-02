/**
 * Filtres del catàleg de cims (bloc 3b, `/cims`; reutilitzats pel mapa al bloc 4c a través de
 * `$lib/data/catalog/geojson.ts`). Funcions pures, sense DOM. `$lib/ui/filtre-cims` les
 * reexporta per compatibilitat.
 *
 * L'estat es desa a la query string (`?q=…&zona=…&alt=…&essencials=1`), que no és cap URL
 * indexable: el canonical de la pàgina sempre és la URL base.
 */
import { ZONES, type CimCataleg, type Zona } from './types';

/** Franges d'altitud del filtre (m): [mínim inclòs, màxim exclòs). */
export const FRANGES_ALTITUD = {
	'fins-1000': [0, 1000],
	'1000-2000': [1000, 2000],
	'2000-3000': [2000, 3000],
	'des-3000': [3000, Infinity]
} as const satisfies Record<string, readonly [number, number]>;

export type FranjaAltitud = keyof typeof FRANGES_ALTITUD;
export const FRANGES: readonly FranjaAltitud[] = Object.keys(FRANGES_ALTITUD) as FranjaAltitud[];

export interface FiltresCims {
	/** Text lliure (nom, àlies o comarca), sense distingir accents ni majúscules. */
	text: string;
	zona: Zona | '';
	altitud: FranjaAltitud | '';
	nomesEssencials: boolean;
}

export const FILTRES_BUITS: Readonly<FiltresCims> = Object.freeze({
	text: '',
	zona: '',
	altitud: '',
	nomesEssencials: false
});

/**
 * Text normalitzat per cercar: minúscules, sense diacrítics ("Puigmal" = "puígmal"), sense
 * apòstrofs ("d'Estats" = "d’Estats" = "destats") ni punt volat ("col·legi" = "collegi"), i la
 * resta de puntuació (guions, parèntesis, punts…) com a espais. Com que cada paraula de la
 * consulta s'ha de trobar dins del text, "pica d estats" també troba "pica destats".
 */
export function normalitzar(text: string): string {
	return text
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLocaleLowerCase('ca')
		.replace(/['’‘`´·]/g, '')
		.replace(/[^\p{L}\p{N}]+/gu, ' ')
		.trim();
}

/** Text de cerca d'un cim: tots els noms coneguts + la comarca. */
export function textCerca(cim: CimCataleg, nomComarca = ''): string {
	return normalitzar(
		[cim.nom, cim.nom_oficial, cim.toponim ?? '', ...cim.alies, nomComarca].join(' | ')
	);
}

/** Hi ha algun filtre actiu? */
export function filtresActius(f: FiltresCims): boolean {
	return f.text.trim() !== '' || f.zona !== '' || f.altitud !== '' || f.nomesEssencials;
}

/**
 * Cim que passa els filtres. `cerca` és el text de cerca precalculat (`textCerca`) per no
 * normalitzar-lo a cada tecla; totes les paraules de la consulta hi han d'aparèixer.
 */
export function passaFiltres(cim: CimCataleg, cerca: string, f: FiltresCims): boolean {
	if (f.nomesEssencials && !cim.essencial) return false;
	if (f.zona !== '' && cim.zona !== f.zona) return false;
	if (f.altitud !== '') {
		const [min, max] = FRANGES_ALTITUD[f.altitud];
		if (cim.altitud < min || cim.altitud >= max) return false;
	}
	const paraules = normalitzar(f.text).split(' ').filter(Boolean);
	return paraules.every((p) => cerca.includes(p));
}

const esZona = (v: string | null): v is Zona =>
	v !== null && (ZONES as readonly string[]).includes(v);
const esFranja = (v: string | null): v is FranjaAltitud =>
	v !== null && Object.hasOwn(FRANGES_ALTITUD, v);

/** Filtres a partir de la query string (valors desconeguts s'ignoren). */
export function filtresDesDeUrl(params: URLSearchParams): FiltresCims {
	const zona = params.get('zona');
	const altitud = params.get('alt');
	return {
		text: (params.get('q') ?? '').slice(0, 80),
		zona: esZona(zona) ? zona : '',
		altitud: esFranja(altitud) ? altitud : '',
		nomesEssencials: params.get('essencials') === '1'
	};
}

/** Query string dels filtres actius (buida si no n'hi ha cap), sense `?`. */
export function filtresAUrl(f: FiltresCims): string {
	const params = new URLSearchParams();
	if (f.text.trim()) params.set('q', f.text.trim());
	if (f.zona) params.set('zona', f.zona);
	if (f.altitud) params.set('alt', f.altitud);
	if (f.nomesEssencials) params.set('essencials', '1');
	return params.toString();
}
