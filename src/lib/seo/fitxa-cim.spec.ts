import { describe, expect, it } from 'vitest';
import { CIMS, cimPerSlug, comarcaPerSlug } from '$lib/data/catalog';
import { formatAltitude } from '$lib/ui/format';
import {
	MAX_DESCRIPTION,
	MAX_TITLE,
	ambAltitud,
	nomAmbA,
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
		expect(seo('sant-jeroni', 'es').comarcaDe).toBe("de l'Anoia");
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
});
