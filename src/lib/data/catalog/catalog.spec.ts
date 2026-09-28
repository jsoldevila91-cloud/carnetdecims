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
		// Regla de subcims (docs/02-arquitectura-seo.md §3.2)
		expect(CIMS.find((c) => c.nom.startsWith('Pollegó Superior'))?.slug).toBe(
			'pedraforca-pollego-superior'
		);
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
		expect(a('pedraforca-pollego-superior')).toBe('al Pollegó Superior (Pedraforca)');
		expect(a('els-bessons')).toBe('als Bessons');
		expect(a('sant-jeroni')).toBe('a Sant Jeroni');
		expect(cim('les-agudes').nom_amb_de).toBe('de les Agudes');
		expect(cim('el-cogullo-de-cabra').nom_amb_de).toBe('del Cogulló de Cabra');
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
			expect(c.restriccions).toEqual([]);
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
		for (const x of COMARQUES) {
			const { article, nom } = separarArticle(x.nom_amb_article);
			expect(nom).toBe(x.nom);
			expect(x.nom_amb_de).toBe(ambDe(nom, article));
		}
	});
});
