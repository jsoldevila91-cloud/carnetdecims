import { describe, expect, it } from 'vitest';
import { CIMS, cimPerSlug, comarcaPerSlug } from '$lib/data/catalog';
import {
	FILTRES_BUITS,
	filtresActius,
	filtresAUrl,
	filtresDesDeUrl,
	normalitzar,
	passaFiltres,
	textCerca,
	type FiltresCims
} from './filtre-cims';

const f = (parcial: Partial<FiltresCims>): FiltresCims => ({ ...FILTRES_BUITS, ...parcial });
const resultat = (filtres: FiltresCims) =>
	CIMS.filter((c) => passaFiltres(c, textCerca(c, comarcaPerSlug(c.comarca)?.nom), filtres));

describe('filtres de /cims', () => {
	it('normalitza accents, majúscules, apòstrofs i guions', () => {
		expect(normalitzar('  Pica  d’Estats ')).toBe('pica destats');
		expect(normalitzar("Pica d'Estats")).toBe('pica destats');
		expect(normalitzar('Pic d’Enclar (Bony de la Pica)')).toBe('pic denclar bony de la pica');
		expect(normalitzar('CANIGÓ')).toBe('canigo');
		expect(normalitzar('Puig-agut')).toBe('puig agut');
		expect(normalitzar('Col·legi')).toBe('collegi');
	});

	it('sense filtres passen tots els cims', () => {
		expect(filtresActius(FILTRES_BUITS)).toBe(false);
		expect(resultat(FILTRES_BUITS)).toHaveLength(CIMS.length);
	});

	it('cerca sense accents ni majúscules, per nom i per comarca', () => {
		const canigo = resultat(f({ text: 'canigo' })).map((c) => c.slug);
		expect(canigo).toContain('canigo');
		for (const text of ["PICA D'ESTATS", 'PICA DESTATS', 'pica d’estats', 'pica  d estats']) {
			expect(
				resultat(f({ text })).map((c) => c.slug),
				text
			).toEqual(['pica-d-estats']);
		}
		const bergueda = resultat(f({ text: 'bergueda' }));
		expect(bergueda.length).toBeGreaterThan(0);
		expect(bergueda.every((c) => c.comarca === 'bergueda')).toBe(true);
		expect(resultat(f({ text: 'xyzzy' }))).toHaveLength(0);
	});

	it('zona, franja d’altitud i només essencials', () => {
		const andorra = resultat(f({ zona: 'andorra' }));
		expect(andorra.length).toBeGreaterThan(0);
		expect(andorra.every((c) => c.zona === 'andorra')).toBe(true);

		const tresmils = resultat(f({ altitud: 'des-3000' }));
		expect(tresmils.length).toBeGreaterThan(0);
		expect(tresmils.every((c) => c.altitud >= 3000)).toBe(true);

		const baixos = resultat(f({ altitud: 'fins-1000' }));
		expect(baixos.every((c) => c.altitud < 1000)).toBe(true);

		expect(resultat(f({ nomesEssencials: true })).every((c) => c.essencial)).toBe(true);
	});

	it('combina filtres', () => {
		const r = resultat(f({ zona: 'catalunya', altitud: 'des-3000' }));
		expect(r.every((c) => c.zona === 'catalunya' && c.altitud >= 3000)).toBe(true);
		const pica = cimPerSlug('pica-d-estats')!;
		expect(r).toContain(pica);
	});

	it('anada i tornada a la query string, ignorant valors desconeguts', () => {
		const filtres = f({
			text: 'puig',
			zona: 'catalunya-nord',
			altitud: '2000-3000',
			nomesEssencials: true
		});
		const qs = filtresAUrl(filtres);
		expect(filtresDesDeUrl(new URLSearchParams(qs))).toEqual(filtres);
		expect(filtresAUrl(FILTRES_BUITS)).toBe('');
		expect(filtresDesDeUrl(new URLSearchParams('zona=marte&alt=9000&essencials=si'))).toEqual(
			FILTRES_BUITS
		);
	});
});
