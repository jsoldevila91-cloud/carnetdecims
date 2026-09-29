import { describe, expect, it } from 'vitest';
import { analitzarTextEnLinia } from '$lib/ui/text-en-linia';
import { CONTINGUTS } from './index';
import { destinsEnllacos, textPla } from './text';
import type { Bloc } from './types';

describe('textPla (mateixa sintaxi que la UI)', () => {
	it('enllaços → etiqueta, sense negreta, espais normalitzats', () => {
		expect(textPla('Vegeu la [normativa](/repte-100-cims/normativa) i **la  FEEC**.')).toBe(
			'Vegeu la normativa i la FEEC.'
		);
	});

	it('URL amb parèntesis equilibrats: com la UI', () => {
		const t = 'Font: [Viquipèdia](https://ca.wikipedia.org/wiki/Montcau_(Bages)).';
		expect(textPla(t)).toBe('Font: Viquipèdia.');
		expect(destinsEnllacos(t)).toEqual(['https://ca.wikipedia.org/wiki/Montcau_(Bages)']);
	});

	it('destí no vàlid: la UI el pinta cru i el text pla també', () => {
		const t = 'Mal: [clic](javascript:alert(1)) i [x](http://a.cat).';
		expect(textPla(t)).toBe(t);
		expect(destinsEnllacos(t)).toEqual(['javascript:alert(1)', 'http://a.cat']);
	});

	it('marcadors pendents i enllaços dins de negreta', () => {
		expect(textPla('**[PENDENT: nom]** i **[FEEC](https://www.feec.cat/)**')).toBe(
			'[PENDENT: nom] i FEEC'
		);
	});

	it('destinsEnllacos coincideix amb els enllaços que pinta la UI a tots els continguts', () => {
		const deBloc = (b: Bloc) => (b.tipus === 'llista' ? b.items : [b.text]);
		for (const contingut of Object.values(CONTINGUTS)) {
			for (const p of Object.values(contingut)) {
				const texts = [
					...p.seccions.flatMap((s) => s.blocs.flatMap(deBloc)),
					...(p.faq ?? []).map((f) => f.resposta)
				];
				for (const text of texts) {
					const ui = analitzarTextEnLinia(text)
						.flatMap((s) => (s.tipus === 'negreta' ? s.fills : [s]))
						.flatMap((s) => (s.tipus === 'enllac' ? [s.desti] : []));
					expect(destinsEnllacos(text)).toEqual(ui);
				}
			}
		}
	});
});
