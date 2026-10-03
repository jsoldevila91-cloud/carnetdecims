import { describe, expect, it } from 'vitest';
import { CIMS, cimPerSlug, comarcaPerSlug } from '$lib/data/catalog';
import { formatAltitude } from '$lib/ui/format';
import { contingutFitxa, totsElsContingutsFitxa } from '$lib/content/fitxes';
import type { RutaAcces } from '$lib/content/fitxes/types';
import {
	MAX_DESCRIPTION,
	MAX_TITLE,
	ambAltitud,
	ambMajuscula,
	nomAmbA,
	nomAmbArticle,
	nomAmbDe,
	nomAmbEn,
	primerQueHiCapi,
	seoFitxaCim
} from './fitxa-cim';

const seo = (slug: string, locale: 'ca' | 'es') => {
	const cim = cimPerSlug(slug)!;
	return seoFitxaCim(cim, comarcaPerSlug(cim.comarca)!, locale);
};

describe('fitxa de cim · SEO', () => {
	it('contracció amb "a" en català', () => {
		expect(nomAmbA('el Pedraforca', 'ca')).toBe('al Pedraforca');
		expect(nomAmbA('lo Tormo', 'ca')).toBe('al Tormo');
		expect(nomAmbA("la Pica d'Estats", 'ca')).toBe("a la Pica d'Estats");
		expect(nomAmbA("l'Elefant", 'ca')).toBe("a l'Elefant");
		expect(nomAmbA('els Bessons', 'ca')).toBe('als Bessons');
		expect(nomAmbA('Sant Salvador de les Espases', 'ca')).toBe('a Sant Salvador de les Espases');
	});

	it('en castellà només contrau el/lo', () => {
		expect(nomAmbA('el Pedraforca', 'es')).toBe('al Pedraforca');
		expect(nomAmbA("la Pica d'Estats", 'es')).toBe("a la Pica d'Estats");
		expect(nomAmbA('els Bessons', 'es')).toBe('a els Bessons');
		expect(nomAmbA('Montcau', 'es')).toBe('a Montcau');
	});

	it('tria el primer títol que hi cap', () => {
		expect(primerQueHiCapi(['a'.repeat(61), 'curt'])).toBe('curt');
		expect(primerQueHiCapi(['a'.repeat(70), 'b'.repeat(65)])).toBe('b'.repeat(65));
		expect(primerQueHiCapi(['ok'])).toBe('ok');
	});

	it('"de" i lloc ("a"/"en") per a comarques i cims', () => {
		expect(nomAmbDe('el Berguedà', 'ca')).toBe('del Berguedà');
		expect(nomAmbDe('Osona', 'ca')).toBe("d'Osona");
		expect(nomAmbDe('el Berguedà', 'es')).toBe('del Berguedà');
		expect(nomAmbDe('lo Tormo', 'es')).toBe('del Tormo');
		expect(nomAmbDe("la Ribera d'Ebre", 'es')).toBe("de la Ribera d'Ebre");
		expect(nomAmbDe('Osona', 'es')).toBe('de Osona');
		expect(nomAmbEn('el Berguedà', 'ca')).toBe('al Berguedà');
		expect(nomAmbEn("l'Anoia", 'ca')).toBe("a l'Anoia");
		expect(nomAmbEn('el Berguedà', 'es')).toBe('en el Berguedà');
		expect(nomAmbEn('la Catalunya Nord', 'es')).toBe('en la Catalunya Nord');
		expect(nomAmbEn('Andorra', 'es')).toBe('en Andorra');
	});

	it("en castellà, l' davant de masculí es contrau; davant de femení passa a la", () => {
		expect(nomAmbDe("l'Alt Empordà", 'ca')).toBe("de l'Alt Empordà");
		expect(nomAmbDe("l'Alt Empordà", 'es')).toBe('del Alt Empordà');
		expect(nomAmbDe("l'Urgell", 'es')).toBe('del Urgell');
		expect(nomAmbDe("l'Alta Ribagorça", 'es')).toBe('de la Alta Ribagorça');
		expect(nomAmbDe("l'Anoia", 'es')).toBe('de la Anoia');
		expect(nomAmbEn("l'Anoia", 'es')).toBe('en la Anoia');
		expect(nomAmbA("l'Alta Ribagorça", 'es')).toBe('a la Alta Ribagorça');
		expect(nomAmbArticle("l'Alta Ribagorça", 'es')).toBe('la Alta Ribagorça');
		expect(nomAmbDe("l'Anoia", 'ca')).toBe("de l'Anoia");
		expect(nomAmbEn("l'Alt Camp", 'es')).toBe('en el Alt Camp');
		expect(nomAmbA("l'Elefant", 'es')).toBe('al Elefant');
		expect(nomAmbArticle("l'Alt Urgell", 'es')).toBe('el Alt Urgell');
		expect(nomAmbArticle('lo Tormo', 'es')).toBe('el Tormo');
		expect(nomAmbArticle('lo Tormo', 'ca')).toBe('lo Tormo');
		expect(nomAmbArticle("la Pica d'Estats", 'es')).toBe("la Pica d'Estats");
		expect(ambMajuscula('en el Berguedà')).toBe('En el Berguedà');
	});

	it("l'altitud es fusiona amb un parèntesi final", () => {
		expect(ambAltitud('al Pedraforca', '2.506')).toBe('al Pedraforca (2.506 m)');
		expect(ambAltitud('a la Tossa (Tivissa)', '718')).toBe('a la Tossa (Tivissa, 718 m)');
	});

	it('títols i descripcions de mostra (ca i es)', () => {
		expect(seo('pedraforca-pollego-superior', 'ca').title).toBe(
			'Com pujar al Pedraforca (2.506 m) · Berguedà'
		);
		expect(seo('pedraforca-pollego-superior', 'es').title).toBe(
			'Cómo subir al Pedraforca (2.506 m) · Berguedà'
		);
		expect(seo('pica-d-estats', 'es').title).toBe(
			"Cómo subir a la Pica d'Estats (3.143 m) · Pallars Sobirà"
		);
		expect(seo('lo-tormo', 'ca').title).toBe("Com pujar al Tormo (523 m) · Ribera d'Ebre");
		expect(seo('la-tossa-tivissa', 'ca').title).toBe(
			"Com pujar a la Tossa (Tivissa, 718 m) · Ribera d'Ebre"
		);
		expect(seo('pedraforca-pollego-superior', 'ca').description).toMatch(
			/^Pedraforca \(2\.506 m\), cim essencial del repte 100 Cims al Berguedà\. /
		);
		expect(seo('canigo', 'es').description).toMatch(
			/^Canigó \(2\.784 m\), cima esencial del reto 100 Cims en la Catalunya Nord\. /
		);
		expect(seo('lo-tormo', 'es').mapAlt).toBe(
			"Mapa topográfico de situación del Tormo (523 m), en la Ribera d'Ebre"
		);
		expect(seo('elefant-roca-de-sant-salvador', 'ca').mapAlt).toBe(
			"Mapa topogràfic de situació de l'Elefant (1.156 m), al Bages"
		);
		expect(seo('sant-jeroni', 'es').comarcaDe).toBe('de la Anoia');
	});

	it('tots els cims: title ≤ 60 i description ≤ 155, única, amb altitud i comarca', () => {
		for (const locale of ['ca', 'es'] as const) {
			const descripcions = new Set<string>();
			for (const cim of CIMS) {
				const comarca = comarcaPerSlug(cim.comarca)!;
				const { title, description } = seoFitxaCim(cim, comarca, locale);
				const id = `${locale}/${cim.slug}`;
				expect(title.length, `${id}: ${title}`).toBeLessThanOrEqual(MAX_TITLE);
				expect(title, id).toMatch(locale === 'ca' ? /^Com pujar / : /^Cómo subir /);
				expect(description.length, `${id}: ${description}`).toBeLessThanOrEqual(MAX_DESCRIPTION);
				expect(description, id).toContain(`${formatAltitude(cim.altitud)} m`);
				expect(description, id).toContain(comarca.nom);
				expect(description, id).not.toMatch(/\) \(/);
				descripcions.add(description);
			}
			expect(descripcions.size, locale).toBe(CIMS.length);
		}
	});

	describe('amb contingut editorial (fase 6): la ruta normal a la description', () => {
		const ambContingut = (slug: string, locale: 'ca' | 'es') => {
			const cim = cimPerSlug(slug)!;
			return seoFitxaCim(cim, comarcaPerSlug(cim.comarca)!, locale, contingutFitxa(slug));
		};

		it("punt de sortida, desnivell i temps d'anada (dades amb font)", () => {
			expect(ambContingut('pedraforca-pollego-superior', 'ca').description).toBe(
				"Pedraforca (2.506 m), cim essencial del repte 100 Cims al Berguedà. Ruta normal des de Gósol per l'Enforcadura: 1.100 m de desnivell i 3 h 30 min d'anada."
			);
			expect(ambContingut('pedraforca-pollego-superior', 'es').description).toBe(
				'Pedraforca (2.506 m), cima esencial del reto 100 Cims en el Berguedà. Ruta normal desde Gósol por la Enforcadura: 1.100 m de desnivel y 3 h 30 min de ida.'
			);
			expect(ambContingut('taga', 'es').description).toBe(
				'Taga (2.040 m), cima esencial del reto 100 Cims en el Ripollès. Ruta normal desde Bruguera por el coll de Jou: 893 m de desnivel.'
			);
		});

		it('sense dades de la ruta: només el nom, i hi afegeix què ofereix la fitxa si hi cap', () => {
			expect(ambContingut('montcau', 'ca').description).toBe(
				"Montcau (1.057 m), cim essencial del repte 100 Cims al Bages. Ruta normal des del coll d'Estenalles. Rutes, mapa i previsió meteorològica."
			);
		});

		it('el title no canvia amb el contingut', () => {
			for (const locale of ['ca', 'es'] as const) {
				expect(ambContingut('canigo', locale).title).toBe(seo('canigo', locale).title);
			}
		});

		it('sense rutes, o sense contingut, la cua genèrica', () => {
			const cim = cimPerSlug('canigo')!;
			const comarca = comarcaPerSlug(cim.comarca)!;
			const generica = seoFitxaCim(cim, comarca, 'ca').description;
			expect(seoFitxaCim(cim, comarca, 'ca', null).description).toBe(generica);
			expect(seoFitxaCim(cim, comarca, 'ca', { rutes: [] }).description).toBe(generica);
		});

		it('una ruta massa llarga no trenca el límit: cau a la cua genèrica', () => {
			const cim = cimPerSlug('canigo')!;
			const ruta: RutaAcces = {
				id: 'llarga',
				nom: { ca: 'Des de ' + 'molt '.repeat(40), es: 'Desde ' + 'muy '.repeat(40) },
				sortida: { nom: 'x' },
				descripcio: { ca: '', es: '' },
				fonts: []
			};
			const d = seoFitxaCim(cim, comarcaPerSlug(cim.comarca)!, 'ca', { rutes: [ruta] });
			expect(d.description).toBe(seoFitxaCim(cim, comarcaPerSlug(cim.comarca)!, 'ca').description);
		});

		it('totes les fitxes amb contingut: ≤ 155, úniques, amb altitud, comarca i ruta normal', () => {
			const continguts = totsElsContingutsFitxa();
			expect(continguts.length).toBeGreaterThan(0);
			for (const locale of ['ca', 'es'] as const) {
				const descripcions = new Set<string>();
				for (const c of continguts) {
					const cim = cimPerSlug(c.slug)!;
					const comarca = comarcaPerSlug(cim.comarca)!;
					const { description } = seoFitxaCim(cim, comarca, locale, c);
					const id = `${locale}/${c.slug}`;
					expect(description.length, `${id}: ${description}`).toBeLessThanOrEqual(MAX_DESCRIPTION);
					expect(description, id).toContain(`${formatAltitude(cim.altitud)} m`);
					expect(description, id).toContain(comarca.nom);
					expect(description, id).toMatch(/ Ruta normal[ :]/);
					expect(description, id).not.toMatch(/\.\./);
					descripcions.add(description);
				}
				expect(descripcions.size, locale).toBe(continguts.length);
			}
		});
	});
});
