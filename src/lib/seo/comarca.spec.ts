import { describe, expect, it } from 'vitest';
import { comarcaPerSlug, comarquesAmbCims, cimsPerComarca } from '$lib/data/catalog';
import { MAX_DESCRIPTION, MAX_TITLE } from './fitxa-cim';
import { seoComarca } from './comarca';

const seo = (slug: string, locale: 'ca' | 'es') =>
	seoComarca(comarcaPerSlug(slug)!, cimsPerComarca(slug), locale);

describe('pàgina de comarca · SEO', () => {
	it('H1 amb la contracció correcta (ca i es)', () => {
		expect(seo('bergueda', 'ca').h1).toBe('Cims del Berguedà');
		expect(seo('bergueda', 'es').h1).toBe('Cimas del Berguedà');
		expect(seo('garrotxa', 'es').h1).toBe('Cimas de la Garrotxa');
		expect(seo('alt-emporda', 'ca').h1).toBe("Cims de l'Alt Empordà");
		expect(seo('alt-emporda', 'es').h1).toBe('Cimas del Alt Empordà');
		expect(seo('osona', 'ca').h1).toBe("Cims d'Osona");
		expect(seo('val-d-aran', 'es').h1).toBe("Cimas de la Val d'Aran");
	});

	it('title ≤ 60 i description ≤ 155 a totes les comarques, únics', () => {
		for (const locale of ['ca', 'es'] as const) {
			const titols = new Set<string>();
			const descripcions = new Set<string>();
			for (const c of comarquesAmbCims()) {
				const s = seo(c.slug, locale);
				expect(s.title.length, s.title).toBeLessThanOrEqual(MAX_TITLE);
				expect(s.description.length, s.description).toBeLessThanOrEqual(MAX_DESCRIPTION);
				titols.add(s.title);
				descripcions.add(s.description);
			}
			expect(titols.size).toBe(comarquesAmbCims().length);
			expect(descripcions.size).toBe(comarquesAmbCims().length);
		}
	});

	it('introducció amb el nombre de cims, el més alt i el més baix', () => {
		const cims = cimsPerComarca('bergueda');
		const [intro, rang] = seo('bergueda', 'ca').intro;
		expect(intro).toMatch(new RegExp(`^Al Berguedà hi ha ${cims.length} cims`));
		expect(rang).toBe(
			"El més alt és el Comabona (2.548 m) i el més baix, el Cogulló d'Estela (1.870 m)."
		);
		expect(seo('bergueda', 'es').intro[0]).toMatch(/^En el Berguedà hay \d+ cimas/);
		expect(seo('andorra', 'ca').intro[0]).toMatch(/^A Andorra hi ha/);
	});

	it('comarca amb un sol cim', () => {
		const un = comarquesAmbCims().find((c) => cimsPerComarca(c.slug).length === 1);
		if (!un) return expect(un).toBeUndefined();
		const s = seo(un.slug, 'ca');
		expect(s.intro[0]).toContain('un sol cim');
		expect(s.title).not.toMatch(/\b1 cims\b/);
	});
});
