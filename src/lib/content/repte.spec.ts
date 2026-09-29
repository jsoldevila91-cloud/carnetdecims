import { describe, expect, it } from 'vitest';
import { SLUGS_CIMS } from '$lib/data/catalog';
import { LOCALES, PRERENDER_PATHS, slugsComarquesAmbCims } from '$lib/i18n/routes';
import { comValidar } from './com-validar';
import { normativa } from './normativa';
import { repte } from './repte';
import { repteInfantil } from './repte-infantil';
import { destinsEnllacos, textPla } from './text';
import { PAGINES_CONTINGUT, type Bloc, type Contingut, type PaginaContingut } from './types';

/** Pàgines del hub del repte (bloc 3c). */
const PAGINES: Record<string, Contingut> = { repte, normativa, comValidar, repteInfantil };

/**
 * Camins interns que existeixen: pàgines prerenderitzades, pàgines de contingut, fitxes,
 * comarques amb cims i la zona app (`src/routes/app/+page.svelte`, noindex).
 */
const CAMINS_EXISTENTS = new Set<string>([
	...PRERENDER_PATHS,
	...Object.values(PAGINES_CONTINGUT),
	...SLUGS_CIMS.map((s) => `/cims/${s}`),
	...slugsComarquesAmbCims().map((s) => `/comarques/${s}`),
	'/app'
]);

/** Tot el text en línia d'una pàgina (on es permeten enllaços). */
function textsEnLinia(p: PaginaContingut): string[] {
	const deBloc = (b: Bloc): string[] => (b.tipus === 'llista' ? b.items : [b.text]);
	return [
		...p.seccions.flatMap((s) => s.blocs.flatMap(deBloc)),
		...(p.faq ?? []).map((f) => f.resposta)
	];
}

/** Textos on no hi pot haver cap marca (title, description, H1, H2, preguntes…). */
function textsPlans(p: PaginaContingut): string[] {
	return [
		p.title,
		p.description,
		p.h1,
		p.intro,
		...p.seccions.map((s) => s.titol),
		...(p.faq ?? []).map((f) => f.pregunta)
	];
}

/** Estructura comparable entre idiomes: ids de secció i tipus de cada bloc. */
function estructura(p: PaginaContingut) {
	return {
		seccions: p.seccions.map((s) => ({
			id: s.id,
			blocs: s.blocs.map((b) =>
				b.tipus === 'llista'
					? `llista:${b.ordenada ? 'o' : 'u'}:${b.items.length}`
					: b.tipus === 'avis'
						? `avis:${b.to}`
						: b.tipus
			)
		})),
		faq: p.faq?.length ?? 0,
		fonts: (p.fonts ?? []).map((f) => f.url)
	};
}

describe.each(Object.entries(PAGINES))('contingut del hub: %s', (_nom, contingut) => {
	it('ca i es tenen la mateixa estructura de seccions, FAQ i fonts', () => {
		expect(estructura(contingut.es)).toEqual(estructura(contingut.ca));
	});

	it.each(LOCALES)('%s: enllaços i sense marques fora del text en línia', (locale) => {
		const p = contingut[locale];
		for (const text of textsEnLinia(p)) {
			for (const desti of destinsEnllacos(text)) {
				if (desti.startsWith('https://')) {
					expect(() => new URL(desti)).not.toThrow();
					continue;
				}
				expect(CAMINS_EXISTENTS.has(desti), `camí intern inexistent: ${desti}`).toBe(true);
			}
			// Cap resta de sintaxi mal formada un cop tret el marcatge permès.
			const pla = textPla(text);
			expect(pla, `marcatge mal format a: ${text}`).not.toMatch(/\]\(|\*\*|\[[^\]]*\]\(/);
			expect((text.match(/\*\*/g) ?? []).length % 2, `negreta sense tancar a: ${text}`).toBe(0);
		}
		for (const text of textsPlans(p)) {
			expect(text, `marcatge no permès a: ${text}`).not.toMatch(/\]\(|\*\*/);
		}
	});

	it.each(LOCALES)('%s: title ≤ 60, description ≤ 155 i camps SEO omplerts', (locale) => {
		const p = contingut[locale];
		expect(p.title.length).toBeLessThanOrEqual(60);
		expect(p.title.length).toBeGreaterThanOrEqual(25);
		expect(p.description.length).toBeLessThanOrEqual(155);
		expect(p.description.length).toBeGreaterThanOrEqual(110);
		expect(p.h1.length).toBeGreaterThan(0);
		expect(p.intro.length).toBeGreaterThan(0);
		expect(p.actualitzat).toBe('2026-09-29');
		expect(p.noindex).toBeFalsy();
		// "100 Cims" com a descriptor del repte, sempre amb la grafia de la marca.
		expect(p.title).toContain('100 Cims');
		expect(p.h1).toContain('100 Cims');
	});

	it.each(LOCALES)('%s: ids de secció únics i estables', (locale) => {
		const ids = contingut[locale].seccions.map((s) => s.id);
		expect(new Set(ids).size).toBe(ids.length);
		for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
		const titols = contingut[locale].seccions.map((s) => s.titol);
		expect(new Set(titols).size).toBe(titols.length);
	});

	it.each(LOCALES)('%s: fonts de la FEEC amb data de consulta', (locale) => {
		const fonts = contingut[locale].fonts ?? [];
		expect(fonts.length).toBeGreaterThan(0);
		for (const f of fonts) {
			expect(f.url).toMatch(/^https:\/\/www\.feec\.cat\//);
			expect(f.consultat).toBe('2026-09-29');
		}
	});
});

describe('avís de web no oficial', () => {
	it.each([
		['repte', repte],
		['normativa', normativa]
	] as const)('%s porta un avís que remet a la FEEC', (_nom, contingut) => {
		for (const locale of LOCALES) {
			const avisos = contingut[locale].seccions
				.flatMap((s) => s.blocs)
				.filter((b): b is Extract<Bloc, { tipus: 'avis' }> => b.tipus === 'avis');
			const avis = avisos.find((b) => /no oficial/.test(b.text));
			expect(avis, `${locale}: falta l'avís de web no oficial`).toBeDefined();
			expect(destinsEnllacos(avis!.text).some((d) => d.startsWith('https://www.feec.cat/'))).toBe(
				true
			);
		}
	});

	it('cap pàgina es presenta com a oficial', () => {
		for (const contingut of Object.values(PAGINES)) {
			for (const locale of LOCALES) {
				const p = contingut[locale];
				const tot = [...textsPlans(p), ...textsEnLinia(p)].join('\n');
				// "oficial" només en negatiu ("no oficial"), referit a la FEEC ("text/llistat oficial")
				// o a la pregunta "és la web oficial?" (que es respon amb un no).
				for (const m of tot.matchAll(/(\S+\s+)?\*{0,2}oficial/gi)) {
					expect(m[0], `ús dubtós de "oficial": ${m[0]}`).toMatch(
						/^\*{0,2}(?:no\s+\*{0,2}|texto?\s+|llistat\s+|lista\s+|web\s+)oficial/i
					);
				}
			}
		}
	});
});

describe('enllaçat intern del hub', () => {
	it('el hub enllaça les subpàgines, els essencials, les comarques i el carnet', () => {
		for (const locale of LOCALES) {
			const destins = new Set(textsEnLinia(repte[locale]).flatMap(destinsEnllacos));
			for (const cami of [
				PAGINES_CONTINGUT.normativa,
				PAGINES_CONTINGUT.comValidar,
				PAGINES_CONTINGUT.repteInfantil,
				'/cims-essencials',
				'/comarques',
				'/app'
			]) {
				expect(destins.has(cami), `${locale}: falta l'enllaç a ${cami}`).toBe(true);
			}
		}
	});
});
