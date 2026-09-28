/**
 * Build del catàleg de cims essencials (fase 2).
 *
 *   npm run catalog:build                   # usa la caché (.cache/) i consulta el que falti
 *   CATALOG_OFFLINE=1 npm run catalog:build # només caché (falla si en falta)
 *   CATALOG_REFRESH=1 npm run catalog:build # torna a consultar totes les fonts
 *
 * Entrades: `essencials.ts` (llista pública FEEC), `comarques.ts`, `manual.ts`.
 * Fonts: ICGC (geocodificador, MET-5, límits comarcals; CC BY 4.0), IGN France
 * (geocodificació i RGE ALTI; Licence Ouverte 2.0), OSM (Overpass; ODbL) i Wikidata (CC0).
 * Sortides (deterministes, formatades amb Prettier):
 *   src/lib/data/catalog/cims.json, src/lib/data/catalog/comarques.json, scripts/catalog/informe.md
 */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as prettier from 'prettier';
import { ambArticle, ambDe, slugify } from '../../src/lib/domain/toponims.ts';
import type {
	CimCataleg,
	ComarcaCataleg,
	Confianca,
	FontCamp,
	Zona
} from '../../src/lib/domain/types.ts';
import { COMARQUES, type ComarcaDef } from './comarques.ts';
import { ESSENCIALS, articleDelNom, type EssencialDef } from './essencials.ts';
import {
	comarquesIcgc,
	cercaIcgc,
	distanciaAComarca,
	inversIcgc,
	maxMdtIcgc,
	urlCerca,
	type ComarcaPoligon,
	type MaxMdt,
	type ToponimIcgc
} from './fonts/icgc.ts';
import { cercaIgn, maxAltiIgn, urlCercaIgn, type PoiIgn } from './fonts/ign.ts';
import { cimsOsm, urlNodeOsm, type CimOsm } from './fonts/osm.ts';
import { cimsWikidata, urlWikidata, type CimWikidata } from './fonts/wikidata.ts';
import { arrodonir, distanciaM } from './lib/geo.ts';
import { estadistiques } from './lib/http.ts';
import { millorPuntuacio, termesDeCerca } from './lib/noms.ts';
import { MANUAL, type ResolucioManual } from './manual.ts';

const ROOT = join(import.meta.dirname, '..', '..');
const OUT = join(ROOT, 'src', 'lib', 'data', 'catalog');
const INFORME = join(import.meta.dirname, 'informe.md');
const PDF_FEEC = 'https://www.feec.cat/wp-content/uploads/2020/02/Essencials-100-cims.pdf';

/** Diferència d'altitud entre fonts a partir de la qual es marca per revisar (m). */
const TOL_ALT = 15;
/** Distància màxima perquè una altra font "corrobori" el punt (m). */
const DIST_CORROBORA = 300;
/** Distància màxima per buscar el mateix cim en una altra font (m). */
const DIST_VEI = 1000;
/** Tolerància de frontera: un cim a menys d'aquesta distància d'una comarca hi pot pertànyer (m). */
const TOL_COMARCA = 3000;
/** Radi de cerca del punt més alt al MDT al voltant de la coordenada (m). */
const RADI_MDT = 60;

const BBOX_ZONA: Record<
	Exclude<Zona, 'catalunya'>,
	{ s: number; n: number; w: number; e: number }
> = {
	andorra: { s: 42.42, n: 42.66, w: 1.4, e: 1.8 },
	'catalunya-nord': { s: 42.33, n: 42.93, w: 1.72, e: 3.2 }
};

/** Pes del tipus de topònim de l'ICGC (un "Cim" és millor que un "Indret"). */
function pesTipusIcgc(tipus: string): number {
	if (tipus === 'Cim') return 1;
	if (tipus === 'Orografia' || tipus === 'Relleu del Litoral') return 0.8;
	if (tipus === 'Edificació Històrica') return 0.75;
	if (tipus.startsWith('Massís')) return 0.6;
	if (tipus === 'Edificació' || tipus === 'Equipament' || tipus === 'Indret') return 0.5;
	if (/Comunicacions|Hidrogr/.test(tipus)) return 0.1;
	return 0.2; // nuclis, barris, municipis...
}

interface Punt {
	lat: number;
	lon: number;
}

interface Primari extends Punt {
	font: 'icgc' | 'ign' | 'osm' | 'wikidata' | 'manual';
	nom: string | null;
	puntNom: number;
	ref: string | null;
	url: string | null;
	nota?: string;
	/** Tipus de topònim ICGC ("Cim", "Edificació Històrica"...), si el punt és de l'ICGC. */
	tipus?: string;
	/** Comarca ICGC del punt (només Catalunya). */
	comarcaIcgc?: string;
	/** Distància a la comarca assignada (m; 0 = dins). */
	distComarca?: number;
	/** Altres candidats plausibles (mateix nom, dins de la tolerància, a > 300 m). */
	alternatives: string[];
	osm?: CimOsm;
	wd?: CimWikidata;
}

interface Diagnosi {
	id: number;
	def: EssencialDef;
	slug: string;
	primari: Primari | null;
	osm: { c: CimOsm; d: number } | null;
	wd: { c: CimWikidata; d: number } | null;
	mdt: {
		z: number;
		font: 'icgc_mdt' | 'ign_alti';
		desplacamentM?: number;
		aLaVora?: boolean;
	} | null;
	altitud: { valor: number; font: FontCamp } | null;
	confianca: Confianca;
	alertes: string[];
	manual: ResolucioManual | undefined;
}

// ---------------------------------------------------------------------------------------------

async function main() {
	const comarques = new Map(COMARQUES.map((c) => [c.slug, c]));
	const [osm, wd, poligons] = await Promise.all([cimsOsm(), cimsWikidata(), comarquesIcgc()]);
	const poligonPerCodi = new Map(poligons.map((p) => [p.codi, p]));
	console.log(
		`OSM: ${osm.length} cims amb nom · Wikidata: ${wd.length} · comarques ICGC: ${poligons.length}`
	);

	const diagnosis: Diagnosi[] = [];
	const slugs = new Set<string>();
	for (const [i, def] of ESSENCIALS.entries()) {
		const comarca = comarques.get(def.comarca);
		if (!comarca) throw new Error(`Comarca desconeguda: ${def.comarca} (${def.nom})`);
		const slug = def.slug ?? slugify(def.nom.replace(/\s*\([^)]*\)/, ''));
		if (slugs.has(slug)) throw new Error(`Slug duplicat: ${slug}`);
		slugs.add(slug);
		const d = await resoldre(i + 1, def, slug, comarca, {
			osm,
			wd,
			poligon: comarca.codiIcgc ? poligonPerCodi.get(comarca.codiIcgc) : undefined,
			poligons
		});
		diagnosis.push(d);
		process.stdout.write(`\r${i + 1}/${ESSENCIALS.length} ${def.nom.padEnd(50)}`);
	}
	process.stdout.write('\n');

	const cims = diagnosis.map(aCim);
	const comarquesOut: ComarcaCataleg[] = COMARQUES.map((c) => ({
		slug: c.slug,
		nom: c.nom,
		nom_amb_article: ambArticle(c.nom, c.article),
		nom_amb_de: ambDe(c.nom, c.article),
		zona: c.zona,
		codi_icgc: c.codiIcgc,
		n_essencials: cims.filter((x) => x.comarca === c.slug).length
	}));

	await escriure(join(OUT, 'cims.json'), JSON.stringify(cims), 'json');
	await escriure(join(OUT, 'comarques.json'), JSON.stringify(comarquesOut), 'json');
	await escriure(INFORME, informe(diagnosis), 'markdown');

	const n = (c: Confianca) => cims.filter((x) => x.confianca === c).length;
	console.log(
		`Cims: ${cims.length} · amb coordenades: ${cims.filter((c) => c.lat !== null).length} · ` +
			`alta ${n('alta')} / mitjana ${n('mitjana')} / baixa ${n('baixa')}`
	);
	console.log(`Peticions: ${estadistiques.cache} de caché, ${estadistiques.xarxa} a la xarxa`);
}

// ---------------------------------------------------------------------------------------------

interface Context {
	osm: CimOsm[];
	wd: CimWikidata[];
	poligon: ComarcaPoligon | undefined;
	poligons: ComarcaPoligon[];
}

async function resoldre(
	id: number,
	def: EssencialDef,
	slug: string,
	comarca: ComarcaDef,
	ctx: Context
): Promise<Diagnosi> {
	const termes = termesDeCerca(def.nom, def.cerca);
	const man = MANUAL[slug];
	const alertes: string[] = [];

	/** El punt és dins de l'àmbit de la comarca/zona assignada (amb tolerància de frontera)? */
	const dinsAmbit = (p: Punt): number | null => {
		if (comarca.zona === 'catalunya') {
			if (!ctx.poligon) return null;
			const d = distanciaAComarca(ctx.poligon, p.lat, p.lon);
			return d <= TOL_COMARCA ? d : null;
		}
		const b = BBOX_ZONA[comarca.zona];
		return p.lat >= b.s && p.lat <= b.n && p.lon >= b.w && p.lon <= b.e ? 0 : null;
	};

	const nomsOsm = (c: CimOsm) => millorPuntuacio(termes, c.noms);
	const nomsWd = (c: CimWikidata) => millorPuntuacio(termes, c.noms);

	/** Corroboració: el candidat d'OSM/Wikidata amb nom semblant més proper a un punt. */
	const veiOsm = (p: Punt) => mesProper(ctx.osm, p, (c) => nomsOsm(c) >= 0.6);
	const veiWd = (p: Punt) => mesProper(ctx.wd, p, (c) => nomsWd(c) >= 0.6);
	const bonus = (p: Punt) =>
		((veiOsm(p)?.d ?? Infinity) <= DIST_CORROBORA ? 0.1 : 0) +
		((veiWd(p)?.d ?? Infinity) <= DIST_CORROBORA ? 0.15 : 0);

	let primari: Primari | null = null;

	// 1. Tria manual d'un registre concret o coordenades manuals
	if (man?.coord) {
		primari = {
			font: 'manual',
			nom: null,
			puntNom: 1,
			lat: man.coord.lat,
			lon: man.coord.lon,
			ref: man.coord.font.ref,
			url: man.coord.font.url,
			nota: man.coord.font.nota,
			alternatives: []
		};
	}

	if (!primari && man?.primari === 'wikidata' && man.wikidata) {
		const c = ctx.wd.find((x) => x.qid === man.wikidata);
		if (!c) throw new Error(`manual.wikidata ${man.wikidata} no és a la consulta de Wikidata`);
		primari = {
			font: 'wikidata',
			nom: c.noms[0] ?? null,
			puntNom: nomsWd(c),
			lat: c.lat,
			lon: c.lon,
			ref: c.qid,
			url: urlWikidata(c.qid),
			alternatives: [],
			wd: c
		};
	}
	if (!primari && man?.primari === 'osm' && man.osm) {
		const c = ctx.osm.find((x) => x.id === man.osm);
		if (!c) throw new Error(`manual.osm ${man.osm} no és a la consulta d'Overpass`);
		primari = {
			font: 'osm',
			nom: c.noms[0] ?? null,
			puntNom: nomsOsm(c),
			lat: c.lat,
			lon: c.lon,
			ref: `node/${c.id}`,
			url: urlNodeOsm(c.id),
			alternatives: [],
			osm: c
		};
	}

	// 2. Catalunya: geocodificador ICGC
	if (!primari && comarca.zona === 'catalunya') {
		const vistos = new Map<string, ToponimIcgc>();
		for (const t of termes) {
			for (const c of await cercaIcgc(t)) vistos.set(`${c.nom}|${c.utm.join(',')}`, c);
		}
		let cands = [...vistos.values()]
			.map((c) => {
				const puntNom = millorPuntuacio(termes, [c.nom]);
				const dist = dinsAmbit(c);
				return { c, puntNom, dist, s: puntNom * pesTipusIcgc(c.tipus) };
			})
			// La tria manual no depèn de la tolerància de comarca (canvis de límits, p. ex. Torà).
			.filter((x) => x.puntNom >= 0.6 && (x.dist !== null || man?.icgc));
		if (man?.icgc) {
			cands = cands.filter(
				(x) =>
					x.c.nom === man.icgc!.nom && (!man.icgc!.municipi || x.c.municipi === man.icgc!.municipi)
			);
			if (cands.length > 1) cands = cands.filter((x) => x.c.tipus === 'Cim');
			if (cands.length !== 1)
				throw new Error(`manual.icgc "${man.icgc.nom}" (${slug}): ${cands.length} candidats`);
		}
		// Si hi ha diversos candidats forts, el MDT desempata una mica a favor del més alt
		// (els cims del repte solen ser el punt dominant de la zona).
		const forts = cands.filter((x) => x.s >= 0.85);
		const zs = new Map<ToponimIcgc, number>();
		if (forts.length > 1) {
			for (const x of forts) zs.set(x.c, (await maxMdtIcgc(x.c.lat, x.c.lon, RADI_MDT))?.z ?? 0);
		}
		const zMin = Math.min(...zs.values());
		const zMax = Math.max(...zs.values());
		const bonusAlt = (c: ToponimIcgc) =>
			zs.has(c) && zMax > zMin ? (0.1 * (zs.get(c)! - zMin)) / (zMax - zMin) : 0;
		const puntuats = cands
			.map((x) => ({
				...x,
				total: x.s + bonus(x.c) + (x.dist === 0 ? 0.05 : -0.05) + bonusAlt(x.c)
			}))
			.sort((a, b) => b.total - a.total);
		const millor = puntuats[0];
		if (millor && millor.s >= 0.5) {
			primari = {
				font: 'icgc',
				nom: millor.c.nom,
				puntNom: millor.puntNom,
				lat: millor.c.lat,
				lon: millor.c.lon,
				ref: `${millor.c.nom} (${millor.c.tipus}, ${millor.c.municipi || 'sense municipi'})`,
				url: urlCerca(millor.c.nom),
				comarcaIcgc: millor.c.comarca,
				tipus: millor.c.tipus,
				distComarca:
					millor.dist ??
					(ctx.poligon ? distanciaAComarca(ctx.poligon, millor.c.lat, millor.c.lon) : undefined),
				// Homònims que també podrien ser el cim: mateix nom i tipus fort, a més de 300 m
				// i dins la tolerància de la comarca. Una tria manual (revisada) els dona per resolts.
				alternatives: man?.icgc
					? []
					: puntuats
							.slice(1)
							.filter((x) => x.s >= 0.85 && distanciaM(x.c, millor.c) > DIST_CORROBORA)
							.map(
								(x) =>
									`${x.c.nom} (${x.c.tipus}, ${x.c.municipi || x.c.comarca || '—'}` +
									`${zs.has(x.c) ? `, MDT ${Math.round(zs.get(x.c)!)} m` : ''})`
							)
			};
		}
	}

	// 3. Catalunya Nord: geocodificació de l'IGN
	if (!primari && comarca.zona === 'catalunya-nord') {
		const vistos = new Map<string, PoiIgn>();
		for (const t of termes) for (const c of await cercaIgn(t)) vistos.set(c.id, c);
		let cands = [...vistos.values()]
			.map((c) => ({ c, puntNom: millorPuntuacio(termes, [c.nom]) }))
			.filter((x) => x.puntNom >= 0.85 && dinsAmbit(x.c) !== null);
		if (man?.ign) cands = cands.filter((x) => x.c.id === man.ign);
		const puntuats = cands
			.map((x) => ({ ...x, total: x.puntNom + bonus(x.c) }))
			.sort((a, b) => b.total - a.total);
		const millor = puntuats[0];
		if (millor) {
			primari = {
				font: 'ign',
				nom: millor.c.nom,
				puntNom: millor.puntNom,
				lat: millor.c.lat,
				lon: millor.c.lon,
				ref: millor.c.id,
				url: urlCercaIgn(millor.c.nom),
				alternatives: puntuats
					.slice(1)
					.filter((x) => distanciaM(x.c, millor.c) > DIST_CORROBORA)
					.map((x) => x.c.nom)
			};
		}
	}

	// 4. Andorra, o si l'ICGC/IGN no l'han trobat: OSM (i si no, Wikidata)
	if (!primari) {
		let cands = ctx.osm
			.map((c) => ({ c, puntNom: nomsOsm(c), dist: dinsAmbit(c) }))
			.filter((x) => x.puntNom >= 0.85 && x.dist !== null);
		if (man?.osm)
			cands = ctx.osm
				.filter((c) => c.id === man.osm)
				.map((c) => ({ c, puntNom: nomsOsm(c), dist: dinsAmbit(c) }));
		const puntuats = cands
			.map((x) => ({
				...x,
				total: x.puntNom + ((veiWd(x.c)?.d ?? Infinity) <= DIST_CORROBORA ? 0.15 : 0)
			}))
			.sort((a, b) => b.total - a.total || (b.c.ele ?? 0) - (a.c.ele ?? 0));
		const millor = puntuats[0];
		// Si Wikidata (CC0) té el mateix cim a ≤ 50 m, es cita Wikidata per evitar l'ODbL a la coordenada.
		const wdIgual = millor ? veiWd(millor.c) : null;
		if (millor && wdIgual && wdIgual.d <= 50) {
			primari = {
				font: 'wikidata',
				nom: wdIgual.c.noms[0] ?? null,
				puntNom: Math.max(millor.puntNom, nomsWd(wdIgual.c)),
				lat: wdIgual.c.lat,
				lon: wdIgual.c.lon,
				ref: wdIgual.c.qid,
				url: urlWikidata(wdIgual.c.qid),
				distComarca: millor.dist ?? undefined,
				alternatives: puntuats
					.slice(1)
					.filter((x) => distanciaM(x.c, millor.c) > DIST_CORROBORA)
					.map((x) => `${x.c.noms[0]} (node/${x.c.id})`),
				wd: wdIgual.c,
				osm: millor.c
			};
		} else if (millor) {
			primari = {
				font: 'osm',
				nom: millor.c.noms[0] ?? null,
				puntNom: millor.puntNom,
				lat: millor.c.lat,
				lon: millor.c.lon,
				ref: `node/${millor.c.id}`,
				url: urlNodeOsm(millor.c.id),
				distComarca: millor.dist ?? undefined,
				alternatives: puntuats
					.slice(1)
					.filter((x) => distanciaM(x.c, millor.c) > DIST_CORROBORA)
					.map((x) => `${x.c.noms[0]} (node/${x.c.id})`),
				osm: millor.c
			};
		}
	}
	if (!primari) {
		const cands = ctx.wd
			.map((c) => ({ c, puntNom: nomsWd(c), dist: dinsAmbit(c) }))
			.filter((x) =>
				man?.wikidata ? x.c.qid === man.wikidata : x.puntNom >= 0.85 && x.dist !== null
			)
			.sort((a, b) => b.puntNom - a.puntNom);
		const millor = cands[0];
		if (millor) {
			primari = {
				font: 'wikidata',
				nom: millor.c.noms[0] ?? null,
				puntNom: millor.puntNom,
				lat: millor.c.lat,
				lon: millor.c.lon,
				ref: millor.c.qid,
				url: urlWikidata(millor.c.qid),
				alternatives: cands
					.slice(1)
					.filter((x) => distanciaM(x.c, millor.c) > DIST_CORROBORA)
					.map((x) => `${x.c.noms[0]} (${x.c.qid})`),
				wd: millor.c
			};
		}
	}

	// Punt d'OSM/Wikidata a Catalunya: si l'ICGC hi té un topònim de tipus "Cim" (a ≤ 60 m, o a
	// ≤ 150 m amb un nom semblant), es fa servir el punt i el nom oficial de l'ICGC (CC BY).
	if (
		primari &&
		comarca.zona === 'catalunya' &&
		(primari.font === 'osm' || primari.font === 'wikidata')
	) {
		const inv = await inversIcgc(primari.lat, primari.lon);
		const cim = inv
			.filter((t) => t.tipus === 'Cim')
			.map((t) => ({ t, d: distanciaM(t, primari!), s: millorPuntuacio(termes, [t.nom]) }))
			.filter((x) => x.d <= 60 || (x.d <= 150 && x.s >= 0.6))
			.sort((a, b) => b.s - a.s || a.d - b.d)[0];
		if (cim) {
			alertes.push(
				`Punt ${primari.font.toUpperCase()} (${primari.ref}) substituït pel cim ICGC "${cim.t.nom}" a ${Math.round(cim.d)} m`
			);
			primari = {
				...primari,
				font: 'icgc',
				nom: cim.t.nom,
				puntNom: Math.max(primari.puntNom, cim.s),
				lat: cim.t.lat,
				lon: cim.t.lon,
				ref: `${cim.t.nom} (${cim.t.tipus}, ${cim.t.municipi || 'sense municipi'})`,
				url: urlCerca(cim.t.nom),
				comarcaIcgc: cim.t.comarca,
				tipus: cim.t.tipus
			};
		}
		primari.comarcaIcgc ??= inv.find((t) => t.comarca)?.comarca ?? '';
		if (ctx.poligon) primari.distComarca = distanciaAComarca(ctx.poligon, primari.lat, primari.lon);
	}

	// Corroboració amb OSM i Wikidata
	let vOsm: Diagnosi['osm'] = null;
	let vWd: Diagnosi['wd'] = null;
	if (primari) {
		if (man?.osm) {
			const c = ctx.osm.find((x) => x.id === man.osm);
			if (c) vOsm = { c, d: distanciaM(c, primari) };
		} else if (primari.osm) vOsm = { c: primari.osm, d: distanciaM(primari.osm, primari) };
		else {
			const v = veiOsm(primari);
			if (v && v.d <= DIST_VEI) vOsm = v;
		}
		if (man?.wikidata) {
			const c = ctx.wd.find((x) => x.qid === man.wikidata);
			if (c) vWd = { c, d: distanciaM(c, primari) };
		} else if (primari.wd) vWd = { c: primari.wd, d: distanciaM(primari.wd, primari) };
		else {
			const v = veiWd(primari);
			if (v && v.d <= DIST_VEI) vWd = v;
		}
	}

	// Model d'elevacions al voltant del punt
	let mdt: Diagnosi['mdt'] = null;
	if (primari) {
		if (comarca.zona === 'catalunya-nord') {
			const ign = await maxAltiIgn(primari.lat, primari.lon);
			if (ign) mdt = { z: ign.z, font: 'ign_alti' };
		}
		if (!mdt) {
			const m: MaxMdt | null = await maxMdtIcgc(primari.lat, primari.lon, RADI_MDT);
			if (m) mdt = { z: m.z, font: 'icgc_mdt', desplacamentM: m.desplacamentM, aLaVora: m.aLaVora };
		}
	}

	// Si el punt més alt del MDT queda a la vora del radi (el punt no és al cim) i el punt de
	// Wikidata/OSM és clarament més alt (≥ 3 m al MDT), es fa servir aquest punt.
	if (primari && mdt?.aLaVora && !man?.coord && !man?.icgc) {
		const opcions = [
			vWd && vWd.d <= DIST_CORROBORA ? { font: 'wikidata' as const, c: vWd.c } : null,
			vOsm && vOsm.d <= DIST_CORROBORA ? { font: 'osm' as const, c: vOsm.c } : null
		].filter((o) => o !== null);
		for (const o of opcions) {
			const m = await maxMdtIcgc(o.c.lat, o.c.lon, 30);
			if (m && m.z >= mdt.z + 3 && !m.aLaVora) {
				alertes.push(
					`Punt ${primari.font.toUpperCase()} a ${mdt.desplacamentM} m del màxim del MDT; es fa servir el de ${o.font === 'osm' ? 'OSM' : 'Wikidata'} (MDT ${m.z} m)`
				);
				primari = {
					...primari,
					font: o.font,
					nom: o.c.noms[0] ?? primari.nom,
					lat: o.c.lat,
					lon: o.c.lon,
					ref: 'qid' in o.c ? o.c.qid : `node/${o.c.id}`,
					url: 'qid' in o.c ? urlWikidata(o.c.qid) : urlNodeOsm(o.c.id),
					tipus: undefined
				};
				mdt = { z: m.z, font: 'icgc_mdt', desplacamentM: m.desplacamentM, aLaVora: false };
				if (vOsm) vOsm = { c: vOsm.c, d: distanciaM(vOsm.c, primari) };
				if (vWd) vWd = { c: vWd.c, d: distanciaM(vWd.c, primari) };
				break;
			}
		}
	}

	// Altitud
	const altitud = triarAltitud(man, mdt, vOsm, vWd, alertes);

	// Alertes i confiança
	if (!primari) alertes.push('Sense coordenades');
	if (primari?.tipus && primari.tipus !== 'Cim')
		alertes.push(`Topònim ICGC de tipus "${primari.tipus}"`);
	if (primari?.alternatives.length)
		alertes.push(`Homònims a prop: ${primari.alternatives.join('; ')}`);
	if (primari && primari.puntNom < 0.85)
		alertes.push(`Coincidència de nom parcial (${primari.puntNom})`);
	// Els límits 1:250.000 són generalitzats: a < 200 m es considera cim fronterer, sense alerta.
	if (primari && comarca.zona === 'catalunya' && (primari.distComarca ?? 0) > 200)
		alertes.push(
			`Fora de la comarca assignada (${primari.distComarca} m; ICGC: ${primari.comarcaIcgc || '—'})`
		);
	// El màxim del MDT a la vora del radi només preocupa si les cotes declarades són clarament més
	// altes (el cim real queda fora del radi); si coincideixen, el punt és a ≤ 60 m del cim.
	const declarades = [vOsm?.c.ele, ...(vWd?.c.eles ?? [])].filter(
		(v): v is number => typeof v === 'number'
	);
	const puntLluny =
		!!mdt?.aLaVora && (declarades.length === 0 || Math.max(...declarades) > mdt.z + 5);
	if (puntLluny)
		alertes.push(
			`El punt més alt del MDT és a la vora del radi (${mdt!.desplacamentM} m): punt potser desplaçat del cim`
		);
	if (primari && vOsm && vOsm.d > DIST_CORROBORA)
		alertes.push(`Node OSM a ${Math.round(vOsm.d)} m`);
	if (primari && vWd && vWd.d > DIST_CORROBORA)
		alertes.push(`Element Wikidata a ${Math.round(vWd.d)} m`);
	if (def.revisarArticle) alertes.push(`Article: ${def.revisarArticle}`);
	if (man) alertes.push(`Manual: ${man.nota}`);

	const corroborat =
		(vOsm !== null && vOsm.d <= DIST_CORROBORA && primari?.font !== 'osm') ||
		(vWd !== null && vWd.d <= DIST_CORROBORA && primari?.font !== 'wikidata');
	const fontsAlt = [mdt?.z, vOsm?.c.ele, ...(vWd?.c.eles ?? [])].filter(
		(v): v is number => typeof v === 'number'
	);
	// Altitud coherent: dues fonts a ±15 m, i una d'elles ha de ser un MDT (mesura independent);
	// sense MDT (Andorra), cal que OSM i Wikidata coincideixin a ±3 m.
	const altCoherent =
		altitud !== null &&
		fontsAlt.filter((v) => Math.abs(v - altitud.valor) <= TOL_ALT).length >= 2 &&
		(mdt !== null
			? Math.abs(mdt.z - altitud.valor) <= TOL_ALT
			: vOsm?.c.ele != null && (vWd?.c.eles ?? []).some((v) => Math.abs(v - vOsm.c.ele!) <= 3));

	let confianca: Confianca;
	if (!primari || !altitud) confianca = 'baixa';
	else if (primari.puntNom < 0.85 && !corroborat) confianca = 'baixa';
	else if (
		primari.puntNom >= 0.85 &&
		corroborat &&
		altCoherent &&
		!primari.alternatives.length &&
		!puntLluny &&
		primari.font !== 'manual'
	)
		confianca = 'alta';
	else confianca = 'mitjana';
	if (man?.confianca) confianca = man.confianca;

	return {
		id,
		def,
		slug,
		primari,
		osm: vOsm,
		wd: vWd,
		mdt,
		altitud,
		confianca,
		alertes,
		manual: man
	};
}

function mesProper<T extends Punt>(llista: T[], p: Punt, filtre: (c: T) => boolean) {
	let millor: { c: T; d: number } | null = null;
	for (const c of llista) {
		if (Math.abs(c.lat - p.lat) > 0.05 || Math.abs(c.lon - p.lon) > 0.07) continue;
		if (!filtre(c)) continue;
		const d = distanciaM(c, p);
		if (!millor || d < millor.d) millor = { c, d };
	}
	return millor;
}

/**
 * Altitud del cim:
 * 1. Manual, si n'hi ha.
 * 2. Si hi ha MDT (ICGC MET-5 o IGN RGE ALTI): el valor declarat (Wikidata/OSM, normalment la
 *    cota del mapa oficial) que quedi a ±15 m del màxim del MDT; si Wikidata i OSM coincideixen
 *    es cita Wikidata (CC0). Si cap no hi encaixa, el màxim del MDT arrodonit.
 * 3. Sense MDT: valor declarat (Wikidata/OSM), amb preferència pel que coincideixen totes dues.
 */
function triarAltitud(
	man: ResolucioManual | undefined,
	mdt: Diagnosi['mdt'],
	vOsm: Diagnosi['osm'],
	vWd: Diagnosi['wd'],
	alertes: string[]
): Diagnosi['altitud'] {
	if (man?.altitud) return man.altitud;
	const osmEle = vOsm && vOsm.d <= DIST_CORROBORA ? vOsm.c.ele : null;
	const wdEles = vWd && vWd.d <= DIST_CORROBORA ? vWd.c.eles : [];
	const fOsm = (v: number): Diagnosi['altitud'] => ({
		valor: Math.round(v),
		font: { font: 'osm', ref: `node/${vOsm!.c.id}`, url: urlNodeOsm(vOsm!.c.id) }
	});
	const fWd = (v: number): Diagnosi['altitud'] => ({
		valor: Math.round(v),
		font: { font: 'wikidata', ref: vWd!.c.qid, url: urlWikidata(vWd!.c.qid) }
	});

	const declarats: { v: number; f: () => Diagnosi['altitud'] }[] = [
		...wdEles.map((v) => ({ v, f: () => fWd(v) })),
		...(osmEle !== null ? [{ v: osmEle, f: () => fOsm(osmEle) }] : [])
	];

	// Discrepàncies entre fonts (per a l'informe)
	const totes: [string, number][] = [
		...(mdt
			? [[mdt.font === 'icgc_mdt' ? 'MDT ICGC' : 'RGE ALTI IGN', mdt.z] as [string, number]]
			: []),
		...(osmEle !== null ? [['OSM', osmEle] as [string, number]] : []),
		...wdEles.map((v) => ['Wikidata', v] as [string, number])
	];
	const max = Math.max(...totes.map((t) => t[1]));
	const min = Math.min(...totes.map((t) => t[1]));
	if (totes.length >= 2 && max - min > TOL_ALT)
		alertes.push(
			`Discrepància d'altitud ${Math.round(max - min)} m: ${totes.map(([k, v]) => `${k} ${v}`).join(', ')}`
		);

	if (mdt) {
		const dins = declarats.filter((d) => Math.abs(d.v - mdt.z) <= TOL_ALT);
		if (dins.length) {
			// El MDT de 5 m sol quedar 1–3 m per sota del vèrtex: s'afavoreix el valor declarat
			// més proper a MDT + 2 m. Wikidata (CC0) té 3 m d'avantatge sobre OSM (ODbL). Una cota
			// declarada més de 2 m per sota del terreny del MDT és poc versemblant i es penalitza.
			const cost = (d: (typeof dins)[number]) =>
				Math.abs(d.v - mdt.z - 2) + (wdEles.includes(d.v) ? 0 : 3) + (d.v < mdt.z - 2 ? 5 : 0);
			dins.sort((a, b) => cost(a) - cost(b));
			return dins[0].f();
		}
		return {
			valor: Math.round(mdt.z),
			font:
				mdt.font === 'icgc_mdt'
					? {
							font: 'icgc_mdt',
							ref: `MET-5 màxim en ${RADI_MDT} m`,
							url: 'https://geoserveis.icgc.cat/icc_mdt/wcs/service'
						}
					: {
							font: 'ign_alti',
							ref: 'RGE ALTI màxim en 40 m',
							url: 'https://data.geopf.fr/altimetrie/1.0/calcul/alti/rest/elevation.json'
						}
		};
	}
	if (!declarats.length) return null;
	const acord = wdEles.find((v) => osmEle !== null && Math.abs(v - osmEle) <= TOL_ALT);
	if (acord !== undefined) return fWd(acord);
	return declarats[declarats.length - 1].f(); // OSM si n'hi ha; si no, Wikidata
}

// ---------------------------------------------------------------------------------------------

function aCim(d: Diagnosi): CimCataleg {
	const { article, base } = articleDelNom(d.def);
	const comarca = COMARQUES.find((c) => c.slug === d.def.comarca)!;
	const p = d.primari;
	const coordenades: FontCamp | null = p
		? { font: p.font, ref: p.ref, url: p.url, ...(p.nota ? { nota: p.nota } : {}) }
		: null;
	return {
		id: d.id,
		slug: d.slug,
		nom: d.def.nom,
		nom_amb_article: ambArticle(base, article),
		nom_amb_de: ambDe(base, article),
		nom_oficial: d.def.nom,
		toponim: p?.nom ?? null,
		alies: d.def.alies ?? [],
		altitud: d.altitud?.valor ?? 0,
		lat: p ? arrodonir(p.lat, 5) : null,
		lon: p ? arrodonir(p.lon, 5) : null,
		comarca: comarca.slug,
		zona: comarca.zona,
		essencial: true,
		restriccions: [],
		fonts: {
			nom: { font: 'feec_pdf_essencials', ref: null, url: PDF_FEEC },
			coordenades,
			altitud: d.altitud?.font ?? null
		},
		confianca: d.confianca,
		estat_revisio: 'esborrany'
	};
}

// ---------------------------------------------------------------------------------------------

const esc = (s: string) => s.replace(/\|/g, '\\|');

function informe(ds: Diagnosi[]): string {
	const n = (c: Confianca) => ds.filter((d) => d.confianca === c).length;
	const perFont = (sel: (d: Diagnosi) => string | undefined) => {
		const m = new Map<string, number>();
		for (const d of ds) {
			const k = sel(d) ?? 'cap';
			m.set(k, (m.get(k) ?? 0) + 1);
		}
		return [...m.entries()].map(([k, v]) => `${k}: ${v}`).join(' · ');
	};
	const fila = (d: Diagnosi) =>
		`| ${d.id} | ${esc(d.def.nom)} | ${d.def.comarca} | ${d.altitud?.valor ?? '—'} | ${d.primari?.font ?? '—'} | ${d.altitud?.font.font ?? '—'} | ${d.confianca} | ${esc(d.alertes.join(' · ') || '—')} |`;
	const cap =
		'| id | Cim | Comarca | Alt. | Coord. | Alt. font | Confiança | Alertes |\n|---|---|---|---|---|---|---|---|';

	const baixes = ds.filter((d) => d.confianca === 'baixa' || !d.primari);
	const discrep = ds.filter((d) => d.alertes.some((a) => a.startsWith('Discrepància')));
	const altres = ds.filter((d) => d.confianca === 'mitjana' && !discrep.includes(d));
	const altaAmbNotes = ds.filter(
		(d) => d.confianca === 'alta' && !discrep.includes(d) && d.alertes.length
	);

	const detall = ds.map((d) => {
		const p = d.primari;
		return `| ${d.id} | ${esc(d.def.nom)} | ${esc(p?.nom ?? '—')} | ${p ? `${arrodonir(p.lat, 5)}, ${arrodonir(p.lon, 5)}` : '—'} | ${d.mdt ? `${d.mdt.z}` : '—'} | ${d.osm ? `${d.osm.c.ele ?? '—'} (${Math.round(d.osm.d)} m)` : '—'} | ${d.wd ? `${d.wd.c.eles.join('/') || '—'} (${Math.round(d.wd.d)} m)` : '—'} | ${d.altitud?.valor ?? '—'} | ${d.confianca} |`;
	});

	return `# Informe del catàleg d'essencials (generat)

> Generat per \`npm run catalog:build\` (\`scripts/catalog/build.ts\`). No l'editeu a mà: les
> correccions van a \`scripts/catalog/manual.ts\` o \`essencials.ts\`. Tots els cims queden en
> \`estat_revisio: 'esborrany'\` fins que una persona els revisi.

## Resum

- Cims: **${ds.length}** · amb coordenades: **${ds.filter((d) => d.primari).length}** · amb altitud: **${ds.filter((d) => d.altitud).length}**
- Confiança: alta **${n('alta')}** · mitjana **${n('mitjana')}** · baixa **${n('baixa')}**
- Font de les coordenades: ${perFont((d) => d.primari?.font)}
- Font de l'altitud: ${perFont((d) => d.altitud?.font.font)}

Criteris: **alta** = nom coincident a la font principal, punt corroborat per una altra font a
≤ ${DIST_CORROBORA} m, com a mínim dues altituds coincidents (±${TOL_ALT} m), sense homònims a prop
i el punt més alt del MDT a prop de la coordenada. **baixa** = sense coordenades/altitud o
coincidència de nom parcial sense corroborar. La resta, **mitjana**.

## 1. Confiança baixa o sense coordenades (${baixes.length})

${baixes.length ? `${cap}\n${baixes.map(fila).join('\n')}` : 'Cap.'}

## 2. Discrepàncies d'altitud entre fonts > ${TOL_ALT} m (${discrep.length})

${discrep.length ? `${cap}\n${discrep.map(fila).join('\n')}` : 'Cap.'}

## 3. Altres cims de confiança mitjana (${altres.length})

${altres.length ? `${cap}\n${altres.map(fila).join('\n')}` : 'Cap.'}

## 4. Confiança alta amb observacions (${altaAmbNotes.length})

Resolucions manuals, punts substituïts, cims fronterers i articles a revisar.

${altaAmbNotes.length ? `${cap}\n${altaAmbNotes.map(fila).join('\n')}` : 'Cap.'}

## 5. Detall de fonts per cim

MDT = màxim del model d'elevacions (ICGC MET-5 o IGN RGE ALTI) en ${RADI_MDT} m al voltant del punt.
Entre parèntesis, distància del node OSM / element Wikidata al punt triat.

| id | Cim | Topònim a la font | Lat, lon | MDT | OSM ele | Wikidata ele | Altitud | Confiança |
|---|---|---|---|---|---|---|---|---|
${detall.join('\n')}
`;
}

async function escriure(fitxer: string, contingut: string, parser: 'json' | 'markdown') {
	const opcions = (await prettier.resolveConfig(fitxer)) ?? {};
	await writeFile(fitxer, await prettier.format(contingut, { ...opcions, parser }), 'utf8');
}

await main();
