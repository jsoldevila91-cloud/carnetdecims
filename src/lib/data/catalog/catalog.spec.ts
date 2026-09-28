/**
 * Validador del catàleg estàtic (`cims.json` + `comarques.json`) generat per
 * `npm run catalog:build`. Els recomptes per comarca es copien a mà del PDF públic de la FEEC
 * (https://www.feec.cat/wp-content/uploads/2020/02/Essencials-100-cims.pdf) com a control
 * independent de `scripts/catalog/essencials.ts`.
 */
import { describe, expect, it } from 'vitest';
import {
	ARTICLES,
	FONTS_DADES,
	SLUG_RE,
	ZONES,
	ambA,
	ambDe,
	essencialsPendents,
	progres100,
	separarArticle
} from '$lib/domain';
import { CIMS, COMARQUES } from './index';

/** Nombre d'essencials per comarca/zona segons el PDF (6 pàgines). */
const RECOMPTE_PDF: Record<string, number> = {
	'alt-camp': 3,
	'alt-emporda': 5,
	'alt-penedes': 2,
	'alt-urgell': 9,
	'alta-ribagorca': 6,
	anoia: 3,
	bages: 3,
	'baix-camp': 6,
	'baix-ebre': 3,
	'baix-emporda': 1,
	'baix-llobregat': 4,
	'baix-penedes': 1,
	barcelones: 2,
	bergueda: 6,
	cerdanya: 4,
	'conca-de-barbera': 4,
	garraf: 1,
	garrigues: 1,
	garrotxa: 4,
	girones: 2,
	maresme: 2,
	moianes: 1,
	montsia: 2,
	noguera: 4,
	osona: 5,
	'pallars-jussa': 7,
	'pallars-sobira': 11,
	'pla-d-urgell': 1,
	'pla-de-l-estany': 1,
	priorat: 1,
	'ribera-d-ebre': 3,
	ripolles: 6,
	segarra: 1,
	segria: 1,
	selva: 3,
	solsones: 2,
	tarragones: 1,
	'terra-alta': 2,
	urgell: 1,
	'val-d-aran': 6,
	'valles-occidental': 4,
	'valles-oriental': 2,
	andorra: 5,
	'catalunya-nord': 8
};

/** Catalunya + Andorra + Catalunya Nord. */
const BBOX = { s: 40.4, n: 43.0, w: 0.1, e: 3.4 };

const decimals = (v: number) => (String(v).split('.')[1] ?? '').length;

describe('catàleg: cims', () => {
	it('té exactament 150 cims, tots essencials', () => {
		expect(CIMS).toHaveLength(150);
		expect(CIMS.every((c) => c.essencial)).toBe(true);
		expect(Object.values(RECOMPTE_PDF).reduce((a, b) => a + b, 0)).toBe(150);
	});

	it('ids 1..150 únics i estables (ordre del PDF)', () => {
		expect(CIMS.map((c) => c.id)).toEqual(Array.from({ length: 150 }, (_, i) => i + 1));
	});

	it('slugs únics i amb format vàlid', () => {
		const slugs = CIMS.map((c) => c.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
		for (const s of slugs) expect(s, s).toMatch(SLUG_RE);
		// Regla de subcims i noms populars (docs/02-arquitectura-seo.md §3.2)
		expect(CIMS.find((c) => c.nom_oficial.startsWith('Pollegó Superior'))?.slug).toBe(
			'pedraforca-pollego-superior'
		);
		expect(CIMS.find((c) => c.nom_oficial.startsWith('Roca de Sant Salvador'))?.slug).toBe(
			'elefant-roca-de-sant-salvador'
		);
		// Homònim de "la Mola" (Sant Llorenç del Munt): qualificador de comarca
		expect(CIMS.find((c) => c.comarca === 'tarragones')?.slug).toBe('la-mola-tarragones');
		// Sense "o" ni parèntesis ni slugs massa llargs
		for (const s of slugs) {
			expect(s, s).not.toMatch(/-o-/);
			expect(s.length, s).toBeLessThanOrEqual(35);
		}
	});

	it('nom visible (popular, H1/title) separat del nom oficial de la FEEC', () => {
		const perSlug = (slug: string) => CIMS.find((c) => c.slug === slug)!;
		expect(perSlug('pedraforca-pollego-superior')).toMatchObject({
			nom: 'Pedraforca',
			nom_oficial: 'Pollegó Superior (Pedraforca)',
			nom_amb_article: 'el Pedraforca'
		});
		expect(perSlug('pedraforca-pollego-superior').alies).toContain('Pollegó Superior');
		expect(perSlug('elefant-roca-de-sant-salvador')).toMatchObject({
			nom: "L'Elefant",
			nom_amb_article: "l'Elefant",
			nom_amb_de: "de l'Elefant"
		});
		expect(perSlug('creu-de-santos').nom_oficial).toBe('Xàquera o Creu de Santos');
		// Grafia de l'ICGC quan la FEEC escriu el mateix topònim diferent
		expect(perSlug('mola-de-genessies').nom).toBe('Mola de Genessies');
		expect(perSlug('tuc-deth-port-de-vielha').nom).toBe('Tuc deth Pòrt de Vielha');
		for (const c of CIMS) {
			expect(c.nom, c.slug).not.toMatch(/ o /);
			expect(c.alies, c.slug).not.toContain(c.nom);
		}
	});

	it('coordenades dins del bbox i amb 5 decimals com a màxim', () => {
		for (const c of CIMS) {
			expect(c.lat, c.slug).not.toBeNull();
			expect(c.lon, c.slug).not.toBeNull();
			expect(c.lat!, c.slug).toBeGreaterThanOrEqual(BBOX.s);
			expect(c.lat!, c.slug).toBeLessThanOrEqual(BBOX.n);
			expect(c.lon!, c.slug).toBeGreaterThanOrEqual(BBOX.w);
			expect(c.lon!, c.slug).toBeLessThanOrEqual(BBOX.e);
			expect(decimals(c.lat!), c.slug).toBeLessThanOrEqual(5);
			expect(decimals(c.lon!), c.slug).toBeLessThanOrEqual(5);
		}
	});

	it('altitud entera entre 0 i 3.200 m', () => {
		for (const c of CIMS) {
			expect(Number.isInteger(c.altitud), c.slug).toBe(true);
			expect(c.altitud, c.slug).toBeGreaterThan(0);
			expect(c.altitud, c.slug).toBeLessThanOrEqual(3200);
		}
		// Punts de control coneguts (±3 m)
		const alt = (slug: string) => CIMS.find((c) => c.slug === slug)!.altitud;
		expect(Math.abs(alt('pica-d-estats') - 3143)).toBeLessThanOrEqual(3);
		expect(Math.abs(alt('pedraforca-pollego-superior') - 2506)).toBeLessThanOrEqual(3);
		expect(Math.abs(alt('canigo') - 2784)).toBeLessThanOrEqual(3);
		expect(Math.abs(alt('comapedrosa') - 2942)).toBeLessThanOrEqual(3);
	});

	it('cada cim és d’una comarca existent i de la seva zona', () => {
		const perSlug = new Map(COMARQUES.map((c) => [c.slug, c]));
		for (const c of CIMS) {
			const comarca = perSlug.get(c.comarca);
			expect(comarca, `${c.slug} → ${c.comarca}`).toBeDefined();
			expect(c.zona, c.slug).toBe(comarca!.zona);
			expect(ZONES).toContain(c.zona);
		}
	});

	it('recompte per comarca = PDF de la FEEC', () => {
		const recompte: Record<string, number> = {};
		for (const c of CIMS) recompte[c.comarca] = (recompte[c.comarca] ?? 0) + 1;
		expect(recompte).toEqual(RECOMPTE_PDF);
	});

	it('formes amb article coherents ("pujar a/al/a la/a l\'", "cims de/del")', () => {
		for (const c of CIMS) {
			const { article, nom } = separarArticle(c.nom_amb_article);
			expect(ARTICLES, c.slug).toContain(article);
			// El nom visible és el mateix, amb l'article en majúscula o sense article.
			expect(c.nom.toLowerCase().endsWith(nom.toLowerCase()), c.slug).toBe(true);
			expect(c.nom_amb_de, c.slug).toBe(ambDe(nom, article));
			// L'article va en minúscula dins la frase
			expect(c.nom_amb_article, c.slug).not.toMatch(/^(El|La|Els|Les|Lo|L') /);
		}
		const cim = (slug: string) => CIMS.find((c) => c.slug === slug)!;
		const a = (slug: string) => {
			const { article, nom } = separarArticle(cim(slug).nom_amb_article);
			return ambA(nom, article);
		};
		expect(a('pica-d-estats')).toBe("a la Pica d'Estats");
		expect(a('pedraforca-pollego-superior')).toBe('al Pedraforca');
		expect(a('els-bessons')).toBe('als Bessons');
		expect(a('sant-jeroni')).toBe('a Sant Jeroni');
		expect(a('cabrera')).toBe('a Cabrera');
		expect(a('bellmunt')).toBe('a Bellmunt');
		expect(a('comabona')).toBe('al Comabona');
		expect(a('tristaina')).toBe('al Tristaina');
		expect(a('lo-tormo')).toBe('al Tormo');
		expect(a('elefant-roca-de-sant-salvador')).toBe("a l'Elefant");
		expect(cim('lo-tesol').nom_amb_article).toBe('lo Tésol');
		expect(cim('lo-tesol').nom_amb_de).toBe('del Tésol');
		expect(cim('pilar-d-almenara').nom_amb_de).toBe("del Pilar d'Almenara");
		expect(cim('les-agudes').nom_amb_de).toBe('de les Agudes');
		expect(cim('el-cogullo-de-cabra').nom_amb_de).toBe('del Cogulló de Cabra');
		expect(cim('tuc-deth-port-de-vielha').nom_amb_de).toBe('del Tuc deth Pòrt de Vielha');
		// Cap forma no normativa "de lo" / "a lo" / "de el" / "de els"
		for (const c of CIMS) expect(c.nom_amb_de, c.slug).not.toMatch(/^de (lo|el|els) /);
	});

	it('procedència per camp, confiança i estat de revisió', () => {
		for (const c of CIMS) {
			expect(c.fonts.nom.font).toBe('feec_pdf_essencials');
			for (const f of [c.fonts.coordenades, c.fonts.altitud]) {
				expect(f, c.slug).not.toBeNull();
				expect(FONTS_DADES).toContain(f!.font);
				if (f!.font === 'manual') expect(f!.nota, c.slug).toBeTruthy();
				if (f!.url) expect(f!.url, c.slug).toMatch(/^https:\/\//);
			}
			expect(['alta', 'mitjana', 'baixa']).toContain(c.confianca);
			expect(c.estat_revisio).toBe('esborrany');
			expect(Array.isArray(c.alies)).toBe(true);
			// Abans s'exigia `[]`, però contradiu la regla del repte (vegeu el test de restriccions).
			expect(Array.isArray(c.restriccions)).toBe(true);
		}
	});

	it('funciona amb les regles del repte (catàleg real)', () => {
		expect(essencialsPendents([], CIMS)).toHaveLength(150);
		const p = progres100(
			CIMS.slice(0, 100).map((c) => ({ cimId: c.id, data: '2024-06-01' })),
			CIMS
		);
		expect(p.completat).toBe(true);
	});
});

describe('catàleg: comarques', () => {
	it('44 zones (42 comarques + Andorra + Catalunya Nord) amb slugs únics', () => {
		expect(COMARQUES).toHaveLength(44);
		const slugs = COMARQUES.map((c) => c.slug);
		expect(new Set(slugs).size).toBe(44);
		for (const s of slugs) expect(s).toMatch(SLUG_RE);
		expect(new Set(COMARQUES.map((c) => c.codi_icgc).filter((c) => c !== null)).size).toBe(42);
	});

	it('nombre d’essencials coherent amb cims.json i el PDF', () => {
		for (const c of COMARQUES) {
			expect(c.n_essencials, c.slug).toBe(RECOMPTE_PDF[c.slug]);
			expect(c.n_essencials).toBe(CIMS.filter((x) => x.comarca === c.slug).length);
		}
	});

	it('formes amb article', () => {
		const c = (slug: string) => COMARQUES.find((x) => x.slug === slug)!;
		expect(c('bergueda').nom_amb_de).toBe('del Berguedà');
		expect(c('alt-urgell').nom_amb_de).toBe("de l'Alt Urgell");
		expect(c('osona').nom_amb_de).toBe("d'Osona");
		expect(c('andorra').nom_amb_de).toBe("d'Andorra");
		expect(c('garrigues').nom_amb_article).toBe('les Garrigues');
		expect(c('catalunya-nord').nom_amb_de).toBe('de la Catalunya Nord');
		expect(c('garrotxa').nom_amb_de).toBe('de la Garrotxa');
		expect(c('alt-emporda').nom_amb_de).toBe("de l'Alt Empordà");
		expect(c('val-d-aran').nom_amb_de).toBe("de la Val d'Aran");
		expect(c('garrigues').nom_amb_de).toBe('de les Garrigues');
		for (const x of COMARQUES) {
			const { article, nom } = separarArticle(x.nom_amb_article);
			expect(nom).toBe(x.nom);
			expect(x.nom_amb_de).toBe(ambDe(nom, article));
		}
	});
});

/** Distància de gran cercle en metres (WGS84, esfera mitjana). */
function distM(aLat: number, aLon: number, bLat: number, bLon: number): number {
	const r = (d: number) => (d * Math.PI) / 180;
	const h =
		Math.sin(r(bLat - aLat) / 2) ** 2 +
		Math.cos(r(aLat)) * Math.cos(r(bLat)) * Math.sin(r(bLon - aLon) / 2) ** 2;
	return 2 * 6371008.8 * Math.asin(Math.sqrt(h));
}

const perId = (id: number) => CIMS.find((c) => c.id === id)!;

describe('catàleg: controls de qualitat addicionals (QA)', () => {
	it('sense cims duplicats: cap parell a menys de 200 m ni noms repetits a la mateixa comarca', () => {
		const massaAprop: string[] = [];
		for (let i = 0; i < CIMS.length; i++)
			for (let j = i + 1; j < CIMS.length; j++) {
				const [a, b] = [CIMS[i], CIMS[j]];
				const d = distM(a.lat!, a.lon!, b.lat!, b.lon!);
				if (d < 200) massaAprop.push(`${a.id}/${b.id} (${Math.round(d)} m)`);
			}
		expect(massaAprop).toEqual([]);
		const claus = CIMS.map((c) => `${c.comarca}|${c.nom_oficial.toLowerCase()}`);
		expect(new Set(claus).size).toBe(claus.length);
	});

	it('coherència comarca ↔ coordenades (aproximada, detecta homònims llunyans)', () => {
		// Radi màxim respecte del centroide dels cims de la mateixa comarca. Valors actuals:
		// comarques ≤ 28 km, Catalunya Nord 64 km (Rosselló–Cerdanya).
		const perComarca = new Map<string, typeof CIMS>();
		for (const c of CIMS) perComarca.set(c.comarca, [...(perComarca.get(c.comarca) ?? []), c]);
		for (const [comarca, llista] of perComarca) {
			if (llista.length < 2) continue;
			const lat = llista.reduce((s, c) => s + c.lat!, 0) / llista.length;
			const lon = llista.reduce((s, c) => s + c.lon!, 0) / llista.length;
			const max = comarca === 'catalunya-nord' ? 80_000 : 35_000;
			for (const c of llista)
				expect(distM(c.lat!, c.lon!, lat, lon), `${c.id} ${c.nom_oficial}`).toBeLessThan(max);
		}
		// Ancoratges independents per zona
		for (const c of CIMS.filter((x) => x.zona === 'andorra'))
			// Andorra la Vella; el país fa ~30 × 25 km
			expect(distM(c.lat!, c.lon!, 42.5078, 1.5211), c.nom_oficial).toBeLessThan(25_000);
		for (const c of CIMS.filter((x) => x.zona === 'catalunya-nord')) {
			// Perpinyà; tot el Rosselló/Conflent/Vallespir/Capcir/Alta Cerdanya a < 100 km
			expect(distM(c.lat!, c.lon!, 42.6986, 2.8954), c.nom_oficial).toBeLessThan(100_000);
			expect(c.lat!, c.nom_oficial).toBeGreaterThan(42.4);
		}
	});

	it('recompte per zona: 137 Catalunya + 5 Andorra + 8 Catalunya Nord; comarques 42 + 1 + 1', () => {
		const n = (z: string) => CIMS.filter((c) => c.zona === z).length;
		expect([n('catalunya'), n('andorra'), n('catalunya-nord')]).toEqual([137, 5, 8]);
		const m = (z: string) => COMARQUES.filter((c) => c.zona === z).length;
		expect([m('catalunya'), m('andorra'), m('catalunya-nord')]).toEqual([42, 1, 1]);
		expect(COMARQUES.filter((c) => c.zona !== 'catalunya').every((c) => c.codi_icgc === null)).toBe(
			true
		);
	});

	it('fonts i atribució: ref + URL per camp, host coherent i cap coordenada d’OSM (ODbL)', () => {
		const HOSTS: Partial<Record<string, RegExp>> = {
			feec_pdf_essencials:
				/^https:\/\/www\.feec\.cat\/wp-content\/uploads\/2020\/02\/Essencials-100-cims\.pdf$/,
			icgc: /^https:\/\/(eines|geoserveis)\.icgc\.cat\//,
			icgc_mdt: /^https:\/\/geoserveis\.icgc\.cat\//,
			ign: /^https:\/\/data\.geopf\.fr\//,
			ign_alti: /^https:\/\/data\.geopf\.fr\//,
			osm: /^https:\/\/www\.openstreetmap\.org\/(node|way|relation)\/\d+$/
		};
		const COORD_PER_ZONA: Record<string, string[]> = {
			catalunya: ['icgc', 'wikidata', 'manual'],
			andorra: ['wikidata', 'icgc', 'manual'],
			'catalunya-nord': ['ign', 'wikidata', 'manual']
		};
		for (const c of CIMS) {
			expect(c.nom_oficial, c.slug).toBeTruthy();
			expect(c.fonts.nom.url, c.slug).toMatch(HOSTS.feec_pdf_essencials!);
			for (const f of [c.fonts.coordenades!, c.fonts.altitud!]) {
				if (f.font === 'manual') continue;
				expect(f.ref, `${c.slug} ${f.font}`).toBeTruthy();
				expect(f.url, `${c.slug} ${f.font}`).toBeTruthy();
				if (f.font === 'wikidata') {
					expect(f.ref, c.slug).toMatch(/^Q\d+$/);
					expect(f.url, c.slug).toBe(`https://www.wikidata.org/wiki/${f.ref}`);
				} else if (HOSTS[f.font]) expect(f.url, `${c.slug} ${f.font}`).toMatch(HOSTS[f.font]!);
			}
			// docs/03 §4.4: cap coordenada publicada surt d'OSM (evita el share-alike ODbL)
			expect(COORD_PER_ZONA[c.zona], `${c.slug} coord ${c.fonts.coordenades!.font}`).toContain(
				c.fonts.coordenades!.font
			);
		}
		// Les altituds d'OSM (ODbL) han de ser l'excepció i quedar identificades
		expect(CIMS.filter((c) => c.fonts.altitud!.font === 'osm').length).toBeLessThanOrEqual(5);
	});

	it('restriccions d’accés publicades per la FEEC reflectides al catàleg', () => {
		// https://www.feec.cat/activitats/100-cims/cims-amb-restriccions-dacces/ (consultat 2026-09-28):
		// La Picossa (fauna, 15/01–15/06) i Sant Salvador de les Espases (obres) són essencials.
		const picossa = perId(106);
		expect(picossa.nom_oficial).toBe('La Picossa');
		expect(picossa.restriccions.length, 'La Picossa sense restricció').toBeGreaterThan(0);
		expect(picossa.restriccions[0]).toMatchObject({
			tipus: 'fauna',
			periodeIniciMmdd: '01-15',
			periodeFiMmdd: '06-15'
		});
		const espases = perId(45);
		expect(espases.nom_oficial).toBe('Sant Salvador de les Espases');
		expect(
			espases.restriccions.length,
			'Sant Salvador de les Espases sense restricció'
		).toBeGreaterThan(0);
		expect(espases.restriccions[0].tipus).toBe('obres');
	});

	it('punts de control independents: cim real (< 150 m) i cota ICGC (±15 m)', () => {
		// [id, lat, lon, cota]. Cota del Mapa Topogràfic de Catalunya 1:10.000 (ICGC) citada a la
		// Viquipèdia; coordenades del cim/vèrtex geodèsic (coincideixen amb la fitxa pública FEEC).
		const CONTROL: [number, number, number, number][] = [
			[99, 42.66694, 1.3979, 3143], // Pica d'Estats
			[55, 42.45798, 1.72717, 2740], // La Carabassa (no "la Carbassa" 565 m al sud)
			[28, 41.60538, 1.8115, 1236], // Sant Jeroni (Montserrat)
			[30, 41.67504, 2.00463, 1057], // Montcau (Sant Llorenç del Munt)
			[106, 41.10941, 0.57642, 499], // La Picossa (Móra d'Ebre)
			[108, 41.17903, 0.64346, 523], // Lo Tormo: vèrtex geodèsic 252136001, 523 m
			[61, 41.46573, 1.34565, 948] // Montclar (Pontils): cim, no l'ermita de Sant Miquel
		];
		const errors: string[] = [];
		for (const [id, lat, lon, cota] of CONTROL) {
			const c = perId(id);
			const d = distM(c.lat!, c.lon!, lat, lon);
			if (d > 150 || Math.abs(c.altitud - cota) > 15)
				errors.push(`${id} ${c.nom_oficial}: ${Math.round(d)} m, ${c.altitud} vs ${cota} m`);
		}
		expect(errors).toEqual([]);
	});
});
