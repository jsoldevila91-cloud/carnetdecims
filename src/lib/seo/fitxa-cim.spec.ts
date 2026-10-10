import { describe, expect, it } from 'vitest';
import { CIMS, cimPerSlug, comarcaPerSlug } from '$lib/data/catalog';
import { formatAltitude } from '$lib/ui/format';
import { separarArticle } from '$lib/domain';
import {
	contingutFitxa,
	contingutFitxaLocal,
	totsElsContingutsFitxa,
	type RutaAccesLocal
} from '$lib/content/fitxes';
import {
	MAX_DESCRIPTION,
	MAX_TITLE,
	ambAltitud,
	ambMajuscula,
	nomAmbA,
	nomAmbArticle,
	nomAmbDe,
	nomAmbEn,
	nomRutaCurt,
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
		expect(nomAmbA('els Bessons', 'es')).toBe('a Els Bessons');
		expect(nomAmbA('Montcau', 'es')).toBe('a Montcau');
	});

	it('article plural: "als/dels" en català; "Els" amb majúscula i sense contraure en castellà', () => {
		expect(nomAmbA('els Àngels', 'ca')).toBe('als Àngels');
		expect(nomAmbDe('els Àngels', 'ca')).toBe('dels Àngels');
		expect(nomAmbEn('els Àngels', 'ca')).toBe('als Àngels');
		expect(nomAmbArticle('els Àngels', 'ca')).toBe('els Àngels');
		expect(nomAmbA('els Àngels', 'es')).toBe('a Els Àngels');
		expect(nomAmbDe('els Àngels', 'es')).toBe('de Els Àngels');
		expect(nomAmbEn('els Àngels', 'es')).toBe('en Els Àngels');
		expect(nomAmbArticle('els Àngels', 'es')).toBe('Els Àngels');
		// `les` es manté com a "de les Garrigues" (docs/02 §4.2)
		expect(nomAmbA('les Agudes', 'es')).toBe('a les Agudes');
		expect(seo('els-angels', 'es').title).toMatch(/^Cómo subir a Els Àngels \(/);
		expect(seo('els-angels', 'ca').title).toMatch(/^Com pujar als Àngels \(/);
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
			const c = contingutFitxa(slug);
			return seoFitxaCim(
				cim,
				comarcaPerSlug(cim.comarca)!,
				locale,
				c && contingutFitxaLocal(c, locale)
			);
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
			const ruta: RutaAccesLocal = {
				id: 'llarga',
				nom: 'Des de ' + 'molt '.repeat(40),
				sortida: { nom: 'x' },
				descripcio: '',
				fonts: []
			};
			const d = seoFitxaCim(cim, comarcaPerSlug(cim.comarca)!, 'ca', { rutes: [ruta] });
			expect(d.description).toBe(seoFitxaCim(cim, comarcaPerSlug(cim.comarca)!, 'ca').description);
		});

		it('nomRutaCurt: treu el tram "per/por …" i el que va després de la coma', () => {
			expect(nomRutaCurt('Circular desde el santuario de Montferri por la Torre del Moro')).toBe(
				'Circular desde el santuario de Montferri'
			);
			expect(nomRutaCurt('des de Gósol pel coll de Jou')).toBe('des de Gósol');
			expect(nomRutaCurt('des del Collell, per la tartera')).toBe('des del Collell');
			expect(nomRutaCurt('des de Gósol')).toBe('des de Gósol');
			// Si el tall deixaria una sola paraula, el nom sencer
			expect(nomRutaCurt('Circular per les Dunes')).toBe('Circular per les Dunes');
			expect(nomRutaCurt('Circular, per la carena')).toBe('Circular, per la carena');
		});

		it('ruta sense xifres i nom massa llarg: ruta normal amb el nom curt', () => {
			const cim = cimPerSlug('canigo')!;
			const comarca = comarcaPerSlug(cim.comarca)!;
			const ruta: RutaAccesLocal = {
				id: 'sense-xifres',
				nom: 'Circular des del refugi de Cortalets per la cresta ' + 'llarga '.repeat(6),
				sortida: { nom: 'x' },
				descripcio: '',
				fonts: []
			};
			const { description } = seoFitxaCim(cim, comarca, 'ca', { rutes: [ruta] });
			expect(description).toContain('Ruta normal circular des del refugi de Cortalets.');
			expect(description.length).toBeLessThanOrEqual(MAX_DESCRIPTION);
		});

		it('totes les fitxes amb contingut: ≤ 155, úniques, amb altitud, comarca i ruta normal', () => {
			const continguts = totsElsContingutsFitxa();
			expect(continguts.length).toBeGreaterThan(0);
			for (const locale of ['ca', 'es'] as const) {
				const descripcions = new Set<string>();
				for (const c of continguts) {
					const cim = cimPerSlug(c.slug)!;
					const comarca = comarcaPerSlug(cim.comarca)!;
					const { description } = seoFitxaCim(cim, comarca, locale, contingutFitxaLocal(c, locale));
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
	describe('articles i contraccions (totes les fitxes amb contingut i tots els cims)', () => {
		/** Formes mal contretes: "a el", "de els", "a lo"… (ca) · "a els", "de el", "en lo"… (es). */
		const MAL: Record<'ca' | 'es', RegExp> = {
			ca: /\b(?:a|de) (?:el|els|lo)\s/,
			es: /\b(?:a|de|en) (?:els|lo)\s|\b(?:a|de) el\s/
		};
		const textos = (slug: string, locale: 'ca' | 'es', ambContingut: boolean) => {
			const cim = cimPerSlug(slug)!;
			const c = ambContingut ? contingutFitxa(slug) : undefined;
			const s = seoFitxaCim(
				cim,
				comarcaPerSlug(cim.comarca)!,
				locale,
				c ? contingutFitxaLocal(c, locale) : undefined
			);
			return [s.title, s.description, s.mapAlt, s.comarcaDe];
		};

		it.each(['ca', 'es'] as const)(
			'%s: cap contracció incorrecta ni article plural en minúscula',
			(locale) => {
				const continguts = totsElsContingutsFitxa();
				expect(continguts.length).toBeGreaterThanOrEqual(50);
				const casos = [
					...continguts.map((c) => [c.slug, true] as const),
					...CIMS.map((cim) => [cim.slug, false] as const)
				];
				for (const [slug, ambContingut] of casos) {
					const cim = cimPerSlug(slug)!;
					const { article, nom } = separarArticle(cim.nom_amb_article);
					for (const text of textos(slug, locale, ambContingut)) {
						const id = `${locale}/${slug}: ${text}`;
						expect(text, id).not.toMatch(MAL[locale]);
						if (article === 'els') {
							// ca: "als/dels Àngels"; es: "Els Àngels", mai "els" ni "los"
							if (locale === 'es') {
								expect(text, id).not.toContain(`els ${nom}`);
								expect(text, id).not.toContain(`los ${nom}`);
							}
						}
					}
				}
			}
		);
	});
});
