/**
 * Build del conjunt de municipis d'origen (bloc R1): d'on surt l'usuari, per calcular "el cim
 * més llunyà" i, a R2, "El teu proper cim". Només el municipi (mai l'adreça).
 *
 *   npm run municipis:build                   # usa la caché i consulta el que falti
 *   CATALOG_OFFLINE=1 npm run municipis:build # només caché (falla si en falta)
 *   CATALOG_REFRESH=1 npm run municipis:build # torna a consultar l'ICGC
 *
 * Font única: **ICGC** (dades obertes, CC BY 4.0). La caché és la mateixa del catàleg
 * (`scripts/catalog/.cache/`, ignorada a git).
 *
 * - **Catalunya (947 municipis):** WFS "Divisions administratives"
 *   (https://geoserveis.icgc.cat/servei/catalunya/divisions-administratives/wfs):
 *     · `municipis_1000000` (sense geometria): `CODIMUNI`, `NOMMUNI`, `CAPMUNI`, `CODICOMAR`,
 *       `NOMCOMAR` → codi, nom oficial i comarca;
 *     · `capsdemunicipi_capmunicipi`: punt del **cap de municipi** (UTM 31N, ETRS89) → coordenada
 *       de referència. És millor que el centroide del terme: és on viu la gent (el centroide de
 *       la Vall de Boí cau en un circ a 2.500 m; el cap, Barruera, és al fons de la vall).
 * - **Andorra i Catalunya Nord:** no tenen divisió municipal a l'ICGC, però el Geocodificador
 *   (https://eines.icgc.cat/geocodificador) hi té els topònims de tipus "Cap de municipi" (base
 *   topogràfica 1:250.000). S'hi afegeix una **llista curta** (`EXTRES`): les 7 parròquies
 *   d'Andorra i 26 poblacions de la Catalunya Nord repartides per totes les comarques, perquè
 *   qualsevol persona d'allà en tingui una a menys d'uns 15 km. No és la llista completa de
 *   comuns (226): per a la distància a un cim n'hi ha prou amb la població de referència més
 *   propera. La tria de noms és manual; les coordenades i la grafia són de l'ICGC.
 *
 * Sortida (determinista, formatada amb Prettier): `src/lib/data/municipis/municipis.json`.
 * **No l'editeu a mà.** Format compacte (tuples) perquè es carrega en un chunk diferit:
 *   comarques: [slug, nom, zona][]
 *   municipis: [codi, nom, índex de comarca, lat, lon, cap?][]   (cap només si ≠ nom)
 *
 * Codis: Catalunya, `CODIMUNI` de l'ICGC (6 xifres: INE + dígit de control); Andorra,
 * `ad:{slug}`; Catalunya Nord, `cn:{slug}`. Són estables: es desen com a preferència de l'usuari.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import * as prettier from 'prettier';
import { slugify } from '../../src/lib/domain/toponims.ts';
import type { Zona } from '../../src/lib/domain/types.ts';
import { COMARQUES } from '../catalog/comarques.ts';
import { cercaIcgc } from '../catalog/fonts/icgc.ts';
import { arrodonir, deUtm31, distanciaM } from '../catalog/lib/geo.ts';
import { estadistiques, fetchText } from '../catalog/lib/http.ts';

const ROOT = join(import.meta.dirname, '..', '..');
const SORTIDA = join(ROOT, 'src', 'lib', 'data', 'municipis', 'municipis.json');

const WFS =
	'https://geoserveis.icgc.cat/servei/catalunya/divisions-administratives/wfs?SERVICE=WFS&VERSION=2.0.0' +
	'&REQUEST=GetFeature&SRSNAME=EPSG:25831&TYPENAMES=divisions_administratives_wfs:';

/** Municipis de Catalunya (Idescat/ICGC, 2026). Si canvia, cal revisar-ho a consciència. */
const N_MUNICIPIS_CATALUNYA = 947;
/** Decimals de les coordenades (4 ≈ 11 m: de sobres per a una distància municipi → cim). */
const DECIMALS = 4;

/** Caixes de cada zona (les mateixes del catàleg) per descartar homònims d'altres llocs. */
const BBOX_ZONA: Record<
	Exclude<Zona, 'catalunya'>,
	{ s: number; n: number; w: number; e: number }
> = {
	andorra: { s: 42.42, n: 42.66, w: 1.4, e: 1.8 },
	'catalunya-nord': { s: 42.33, n: 42.93, w: 1.72, e: 3.2 }
};

interface Extra {
	zona: Exclude<Zona, 'catalunya'>;
	/** Topònim "Cap de municipi" tal com el té l'ICGC (text de cerca i nom del cap). */
	toponim: string;
	/** Nom que es mostra, si no és el del topònim (parròquia amb un cap de nom diferent). */
	nom?: string;
	/** Pista per triar entre homònims dins de la mateixa caixa (a menys de 5 km). */
	prop?: { lat: number; lon: number };
}

const ad = (toponim: string, nom?: string): Extra => ({ zona: 'andorra', toponim, nom });
const cn = (toponim: string, prop?: Extra['prop']): Extra => ({
	zona: 'catalunya-nord',
	toponim,
	prop
});

/** Parròquies d'Andorra (les 7) i poblacions de referència de la Catalunya Nord. */
const EXTRES: Extra[] = [
	ad('Canillo'),
	ad('Encamp'),
	ad('Ordino'),
	ad('la Massana'),
	ad('Andorra la Vella'),
	ad('Sant Julià de Lòria'),
	// El cap de la parròquia d'Escaldes-Engordany és les Escaldes.
	ad('les Escaldes', 'Escaldes-Engordany'),
	// Rosselló
	cn('Perpinyà'),
	cn('Canet de Rosselló'),
	cn('Ribesaltes'),
	cn('Salses'),
	cn('Tuïr'),
	cn('Elna'),
	cn('Illa'),
	cn('Argelers'),
	cn('Cotlliure'),
	cn('Portvendres'),
	cn('Banyuls de la Marenda'),
	cn('el Voló'),
	// Vallespir
	cn('Ceret'),
	cn('Arles'),
	cn('Prats de Molló'),
	cn('Sant Llorenç de Cerdans'),
	// Conflent (hi ha un altre Prada, a l'Arieja, dins de la caixa)
	cn('Prada', { lat: 42.61, lon: 2.35 }),
	cn('Vinçà'),
	cn('Vilafranca de Conflent'),
	cn('Vernet'),
	// Fenolleda
	cn('Sant Pau de Fenollet'),
	// Alta Cerdanya
	cn('Font-romeu'),
	cn('Sallagosa'),
	cn("la Guingueta d'Ix"),
	// Capcir
	cn('Formiguera'),
	cn('els Angles')
];

type Tupla = [codi: string, nom: string, comarca: number, lat: number, lon: number, cap?: string];

interface ComarcaSortida {
	slug: string;
	nom: string;
	zona: Zona;
}

/** Valor d'un camp d'un membre del WFS (les entitats XML bàsiques, descodificades). */
function camp(membre: string, nom: string): string | null {
	const m = new RegExp(`:${nom}>([^<]*)<`).exec(membre);
	if (!m) return null;
	return m[1]
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&apos;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, '&')
		.trim();
}

function membres(xml: string): string[] {
	return xml.split('<wfs:member>').slice(1);
}

const mateixText = (a: string, b: string) =>
	a.localeCompare(b, 'ca', { sensitivity: 'base' }) === 0;

async function municipisCatalunya(comarques: ComarcaSortida[]): Promise<Tupla[]> {
	const [xmlMunicipis, xmlCaps] = [
		await fetchText({
			font: 'icgc-municipis',
			url: `${WFS}divisions_administratives_municipis_1000000&PROPERTYNAME=CODIMUNI,NOMMUNI,CAPMUNI,CODICOMAR,NOMCOMAR`,
			valida: (s) => s.includes('CODIMUNI')
		}),
		await fetchText({
			font: 'icgc-municipis',
			url: `${WFS}divisions_administratives_capsdemunicipi_capmunicipi`,
			valida: (s) => s.includes('NOMCAP')
		})
	];

	// Punt del cap de cada municipi (UTM 31N → WGS84).
	const caps = new Map<string, { lat: number; lon: number; nom: string }>();
	for (const m of membres(xmlCaps)) {
		const codi = camp(m, 'CODIMUNI');
		const pos = /<gml:pos>([^<]+)<\/gml:pos>/.exec(m)?.[1].trim().split(/\s+/).map(Number);
		const nom = camp(m, 'NOMCAP');
		if (!codi || !nom || !pos || pos.length !== 2 || !pos.every(Number.isFinite)) {
			throw new Error(`Cap de municipi sense codi, nom o punt: ${m.slice(0, 200)}`);
		}
		if (caps.has(codi)) throw new Error(`Cap de municipi repetit: ${codi}`);
		caps.set(codi, { ...deUtm31(pos[0], pos[1]), nom });
	}

	const files = membres(xmlMunicipis).map((m) => {
		const codi = camp(m, 'CODIMUNI');
		const nom = camp(m, 'NOMMUNI');
		const codiComarca = Number(camp(m, 'CODICOMAR'));
		const nomComarca = camp(m, 'NOMCOMAR');
		if (!codi || !/^\d{6}$/.test(codi) || !nom || !Number.isInteger(codiComarca) || !nomComarca) {
			throw new Error(`Municipi amb camps invàlids: ${m.slice(0, 300)}`);
		}
		return { codi, nom, codiComarca, nomComarca };
	});
	// Ordre estable (comarca i codi), independent de l'ordre en què respon el servei.
	files.sort((x, y) => x.codiComarca - y.codiComarca || (x.codi < y.codi ? -1 : 1));

	const indexComarca = new Map<number, number>();
	const tuples: Tupla[] = [];
	const vistos = new Set<string>();
	for (const { codi, nom, codiComarca, nomComarca } of files) {
		// Un municipi amb enclavaments pot sortir en més d'un polígon: només compta un cop.
		if (vistos.has(codi)) continue;
		vistos.add(codi);
		const cap = caps.get(codi);
		if (!cap) throw new Error(`Municipi sense cap a l'ICGC: ${codi} ${nom}`);
		if (cap.lat < 40.4 || cap.lat > 42.95 || cap.lon < 0.1 || cap.lon > 3.4) {
			throw new Error(`Cap fora de Catalunya: ${codi} ${nom} (${cap.lat}, ${cap.lon})`);
		}

		let idx = indexComarca.get(codiComarca);
		if (idx === undefined) {
			// El nom i l'slug són els del catàleg quan la comarca hi és (p. ex. "Val d'Aran"; l'ICGC
			// en diu "Aran"); si no (comarca sense cims essencials), els de l'ICGC.
			const def = COMARQUES.find((c) => c.codiIcgc === codiComarca);
			idx = comarques.length;
			comarques.push({
				slug: def?.slug ?? slugify(nomComarca),
				nom: def?.nom ?? nomComarca,
				zona: 'catalunya'
			});
			indexComarca.set(codiComarca, idx);
		}
		const tupla: Tupla = [
			codi,
			nom,
			idx,
			arrodonir(cap.lat, DECIMALS),
			arrodonir(cap.lon, DECIMALS)
		];
		if (!mateixText(cap.nom, nom)) tupla.push(cap.nom);
		tuples.push(tupla);
	}
	if (tuples.length !== N_MUNICIPIS_CATALUNYA) {
		throw new Error(
			`S'esperaven ${N_MUNICIPIS_CATALUNYA} municipis i l'ICGC en dona ${tuples.length}`
		);
	}
	return tuples;
}

async function extres(comarques: ComarcaSortida[]): Promise<Tupla[]> {
	const index = new Map<Zona, number>();
	for (const zona of ['andorra', 'catalunya-nord'] as const) {
		const def = COMARQUES.find((c) => c.zona === zona);
		if (!def) throw new Error(`Falta la zona ${zona} a scripts/catalog/comarques.ts`);
		index.set(zona, comarques.length);
		comarques.push({ slug: def.slug, nom: def.nom, zona });
	}
	const tuples: Tupla[] = [];
	for (const e of EXTRES) {
		const b = BBOX_ZONA[e.zona];
		const candidats = (await cercaIcgc(e.toponim)).filter(
			(t) =>
				t.tipus === 'Cap de municipi' &&
				t.municipi === '' &&
				mateixText(t.nom, e.toponim) &&
				t.lat >= b.s &&
				t.lat <= b.n &&
				t.lon >= b.w &&
				t.lon <= b.e &&
				(!e.prop || distanciaM(t, e.prop) < 5000)
		);
		// Punts diferents (el mateix lloc pot sortir amb dues grafies).
		const punts = new Map(candidats.map((t) => [`${t.lat.toFixed(4)},${t.lon.toFixed(4)}`, t]));
		if (punts.size !== 1) {
			throw new Error(
				`"${e.toponim}" (${e.zona}): s'esperava 1 cap de municipi a l'ICGC i n'hi ha ${punts.size}`
			);
		}
		// La grafia exacta de la llista, si l'ICGC la té (p. ex. "Font-romeu" i no "Font-Romeu").
		const t = candidats.find((c) => c.nom === e.toponim) ?? candidats[0];
		const nom = e.nom ?? t.nom;
		const prefix = e.zona === 'andorra' ? 'ad' : 'cn';
		const tupla: Tupla = [
			`${prefix}:${slugify(nom)}`,
			nom,
			index.get(e.zona)!,
			arrodonir(t.lat, DECIMALS),
			arrodonir(t.lon, DECIMALS)
		];
		if (!mateixText(t.nom, nom)) tupla.push(t.nom);
		tuples.push(tupla);
	}
	return tuples;
}

async function main() {
	const comarques: ComarcaSortida[] = [];
	const catalunya = await municipisCatalunya(comarques);
	const fora = await extres(comarques);
	const tots = [...catalunya, ...fora];

	const codis = new Set(tots.map((t) => t[0]));
	if (codis.size !== tots.length) throw new Error('Hi ha codis de municipi repetits');
	for (const [codi] of tots) {
		if (!/^(\d{6}|(ad|cn):[a-z0-9]+(-[a-z0-9]+)*)$/.test(codi) || codi.length > 40) {
			throw new Error(`Codi de municipi invàlid: ${codi}`);
		}
	}
	// Ordre estable (per codi): el diff del JSON només mostra canvis reals.
	tots.sort((a, b) => (a[0] < b[0] ? -1 : 1));

	const sortida = {
		font: 'ICGC (Institut Cartogràfic i Geològic de Catalunya), CC BY 4.0: Divisions administratives (municipis i caps de municipi) i Geocodificador (Andorra i Catalunya Nord)',
		comarques: comarques.map((c) => [c.slug, c.nom, c.zona]),
		municipis: tots
	};
	const opcions = (await prettier.resolveConfig(SORTIDA)) ?? {};
	await mkdir(dirname(SORTIDA), { recursive: true });
	await writeFile(
		SORTIDA,
		await prettier.format(JSON.stringify(sortida), { ...opcions, parser: 'json' }),
		'utf8'
	);

	const ambCap = tots.filter((t) => t.length === 6).length;
	console.log(
		`Municipis: ${catalunya.length} de Catalunya + ${fora.length} d'Andorra i la Catalunya Nord ` +
			`(${comarques.length} comarques/zones; ${ambCap} amb el cap de nom diferent).`
	);
	console.log(`Peticions: ${estadistiques.xarxa} a la xarxa, ${estadistiques.cache} de la caché.`);
	console.log(`Escrit: ${SORTIDA}`);
}

await main();
