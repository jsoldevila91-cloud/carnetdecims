import { describe, expect, it } from 'vitest';
import { CONTINGUTS } from '../content/index.ts';
import type { ClauPagina, PaginaContingut } from '../content/types.ts';
import { ID_FAQ, ID_FONTS, PREFIX_PLANTILLA, idsPagina } from './pagina-contingut-ids';

const PAGINES = (Object.keys(CONTINGUTS) as ClauPagina[]).flatMap((clau) =>
	(['ca', 'es'] as const).map((l) => ({ nom: `${clau}.${l}`, pagina: CONTINGUTS[clau][l] }))
);

const repetits = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);

describe('ids de PaginaContingut', () => {
	it.each(PAGINES)('$nom: cap id repetit', ({ pagina }) => {
		expect(repetits(idsPagina(pagina))).toEqual([]);
	});

	it.each(PAGINES)(
		'$nom: les àncores de secció no fan servir el prefix de la plantilla',
		({ pagina }) => {
			expect(pagina.seccions.filter((s) => s.id.startsWith(PREFIX_PLANTILLA))).toEqual([]);
		}
	);

	it('una secció anomenada `fonts` o `preguntes-frequents` ja no xoca amb la plantilla', () => {
		const pagina: PaginaContingut = {
			title: 't',
			description: 'd',
			h1: 'h',
			intro: 'i',
			actualitzat: '2026-09-29',
			seccions: ['fonts', 'preguntes-frequents', 'faq'].map((id) => ({ id, titol: id, blocs: [] })),
			faq: [{ pregunta: 'p', resposta: 'r' }],
			fonts: [{ nom: 'n', url: 'https://exemple.cat/' }]
		};
		const ids = idsPagina(pagina);
		expect(ids).toContain(ID_FAQ);
		expect(ids).toContain(ID_FONTS);
		expect(repetits(ids)).toEqual([]);
	});
});
