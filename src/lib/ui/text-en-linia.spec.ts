import { describe, expect, it } from 'vitest';
import { analitzarTextEnLinia, esCamiIntern, esUrlExterna, type Segment } from './text-en-linia';

/** Reconstrueix el text visible a partir dels segments (el que veurà l'usuari). */
function visible(segments: Segment[]): string {
	return segments
		.map((s) => (s.tipus === 'negreta' ? visible(s.fills) : s.tipus === 'enllac' ? s.text : s.text))
		.join('');
}

describe('analitzarTextEnLinia', () => {
	it('text pla: un sol segment', () => {
		expect(analitzarTextEnLinia('Puja 100 cims.')).toEqual([
			{ tipus: 'text', text: 'Puja 100 cims.' }
		]);
	});

	it('enllaç intern amb camí deslocalitzat', () => {
		expect(analitzarTextEnLinia('Vegeu la [normativa](/repte-100-cims/normativa).')).toEqual([
			{ tipus: 'text', text: 'Vegeu la ' },
			{ tipus: 'enllac', text: 'normativa', desti: '/repte-100-cims/normativa', extern: false },
			{ tipus: 'text', text: '.' }
		]);
	});

	it('enllaç intern amb àncora', () => {
		const [s] = analitzarTextEnLinia('[excepcions](/repte-100-cims/normativa#excepcions)');
		expect(s).toEqual({
			tipus: 'enllac',
			text: 'excepcions',
			desti: '/repte-100-cims/normativa#excepcions',
			extern: false
		});
	});

	it('enllaç extern https (admet parèntesis equilibrats a la URL)', () => {
		expect(analitzarTextEnLinia('[FEEC](https://www.feec.cat/)')).toEqual([
			{ tipus: 'enllac', text: 'FEEC', desti: 'https://www.feec.cat/', extern: true }
		]);
		const [s] = analitzarTextEnLinia(
			'[Wiki](https://ca.wikipedia.org/wiki/Canig%C3%B3_(muntanya))'
		);
		expect(s).toMatchObject({
			tipus: 'enllac',
			desti: 'https://ca.wikipedia.org/wiki/Canig%C3%B3_(muntanya)'
		});
	});

	it('destins no permesos es queden com a text literal', () => {
		for (const text of [
			'[clic](javascript:alert(1))',
			'[clic](data:text/html,hola)',
			'[clic](http://exemple.cat)',
			'[clic](//evil.example)',
			'[clic](ftp://exemple.cat)',
			'[clic](https://)',
			'[clic](cims/relatiu)'
		]) {
			const segments = analitzarTextEnLinia(text);
			expect(segments, text).toEqual([{ tipus: 'text', text }]);
		}
	});

	it('HTML i caràcters especials es conserven com a text (els escapa el component)', () => {
		const text = '<script>alert("x")</script> & <b>no</b>';
		expect(analitzarTextEnLinia(text)).toEqual([{ tipus: 'text', text }]);
	});

	it('negreta, també amb un enllaç a dins', () => {
		expect(analitzarTextEnLinia('Cal **pujar a peu** i prou.')).toEqual([
			{ tipus: 'text', text: 'Cal ' },
			{ tipus: 'negreta', fills: [{ tipus: 'text', text: 'pujar a peu' }] },
			{ tipus: 'text', text: ' i prou.' }
		]);
		expect(analitzarTextEnLinia('**Llegeix la [normativa](/repte-100-cims/normativa)**')).toEqual([
			{
				tipus: 'negreta',
				fills: [
					{ tipus: 'text', text: 'Llegeix la ' },
					{
						tipus: 'enllac',
						text: 'normativa',
						desti: '/repte-100-cims/normativa',
						extern: false
					}
				]
			}
		]);
	});

	it('`**` sense parella o negreta buida: asteriscs visibles', () => {
		expect(analitzarTextEnLinia('2 ** 3')).toEqual([{ tipus: 'text', text: '2 ** 3' }]);
		expect(analitzarTextEnLinia('a****b')).toEqual([{ tipus: 'text', text: 'a****b' }]);
		expect(visible(analitzarTextEnLinia('**a** i **b'))).toBe('a i **b');
	});

	it('marcadors pendents (ca i es) es conserven sencers', () => {
		expect(analitzarTextEnLinia('Termini: [PENDENT: confirmar amb la FEEC].')).toEqual([
			{ tipus: 'text', text: 'Termini: ' },
			{ tipus: 'pendent', text: '[PENDENT: confirmar amb la FEEC]' },
			{ tipus: 'text', text: '.' }
		]);
		const [s] = analitzarTextEnLinia('[PENDIENTE: fecha]');
		expect(s).toEqual({ tipus: 'pendent', text: '[PENDIENTE: fecha]' });
	});

	it('claudàtors sense sintaxi coneguda: text literal', () => {
		for (const text of ['[nota] sense destí', 'a [b', 'a ] b', '[](/buit)', '[x] (/separat)']) {
			expect(visible(analitzarTextEnLinia(text)), text).toBe(text);
			expect(
				analitzarTextEnLinia(text).every((s) => s.tipus === 'text'),
				text
			).toBe(true);
		}
	});

	it('diversos enllaços seguits', () => {
		const segments = analitzarTextEnLinia('[A](/a) i [B](https://b.example/x)');
		expect(segments.map((s) => s.tipus)).toEqual(['enllac', 'text', 'enllac']);
	});
});

describe('esCamiIntern / esUrlExterna', () => {
	it('camins interns', () => {
		expect(esCamiIntern('/')).toBe(true);
		expect(esCamiIntern('/cims/matagalls')).toBe(true);
		expect(esCamiIntern('//evil.example')).toBe(false);
		expect(esCamiIntern('/a b')).toBe(false);
		expect(esCamiIntern('/\\evil')).toBe(false);
	});

	it('URL externes', () => {
		expect(esUrlExterna('https://www.feec.cat/')).toBe(true);
		expect(esUrlExterna('http://www.feec.cat/')).toBe(false);
		expect(esUrlExterna('https://')).toBe(false);
		expect(esUrlExterna('javascript:alert(1)')).toBe(false);
	});
});
