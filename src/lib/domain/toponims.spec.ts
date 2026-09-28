import { describe, expect, it } from 'vitest';
import {
	ambA,
	ambArticle,
	ambDe,
	senseAccents,
	separarArticle,
	slugify,
	SLUG_RE
} from './toponims';

describe('slugify', () => {
	it.each([
		["Pica d'Estats", 'pica-d-estats'],
		['Pica d’Estats', 'pica-d-estats'],
		['Tuc deth Pòrt de Vielha', 'tuc-deth-port-de-vielha'],
		['Sant Llorenç del Munt', 'sant-llorenc-del-munt'],
		['Coll de la Cel·lada', 'coll-de-la-cellada'],
		['Mont-roig', 'mont-roig'],
		['  Els Àngels ', 'els-angels']
	])('%s → %s', (entrada, esperat) => {
		expect(slugify(entrada)).toBe(esperat);
		expect(esperat).toMatch(SLUG_RE);
	});

	it('senseAccents treu diacrítics i el punt volat', () => {
		expect(senseAccents('Àèéíòóúüç l·l')).toBe('Aeeioouuc ll');
	});
});

describe('formes amb article', () => {
	it.each([
		['Pedraforca', 'el', 'el Pedraforca', 'del Pedraforca', 'al Pedraforca'],
		["Pica d'Estats", 'la', "la Pica d'Estats", "de la Pica d'Estats", "a la Pica d'Estats"],
		['Alt Urgell', "l'", "l'Alt Urgell", "de l'Alt Urgell", "a l'Alt Urgell"],
		['Bessons', 'els', 'els Bessons', 'dels Bessons', 'als Bessons'],
		['Agudes', 'les', 'les Agudes', 'de les Agudes', 'a les Agudes'],
		['Tésol', 'lo', 'lo Tésol', 'del Tésol', 'al Tésol'],
		['Tormo', 'lo', 'lo Tormo', 'del Tormo', 'al Tormo'],
		['Elefant', "l'", "l'Elefant", "de l'Elefant", "a l'Elefant"],
		["Val d'Aran", 'la', "la Val d'Aran", "de la Val d'Aran", "a la Val d'Aran"],
		['Sant Jeroni', '', 'Sant Jeroni', 'de Sant Jeroni', 'a Sant Jeroni'],
		['Osona', '', 'Osona', "d'Osona", 'a Osona'],
		['Horta', '', 'Horta', "d'Horta", 'a Horta']
	] as const)('%s (%s)', (nom, article, ambArt, de, a) => {
		expect(ambArticle(nom, article)).toBe(ambArt);
		expect(ambDe(nom, article)).toBe(de);
		expect(ambA(nom, article)).toBe(a);
		expect(separarArticle(ambArt)).toEqual({ article, nom });
	});
});
