import { describe, expect, it } from 'vitest';
import { SLUGS_CIMS } from '$lib/data/catalog';
import { LOCALES, PRERENDER_PATHS, slugsComarquesAmbCims } from '$lib/i18n/routes';
import { CONTINGUTS, PAGINES_CONTINGUT, clauPerCami, contingutPerCami } from './index';
import { MARCADORS_PENDENTS, PATRO_PENDENT, pendentsDe } from './pendents';
import { destinsEnllacos } from './text';
import { TITULAR } from './titular';
import type { Bloc, ClauPagina, PaginaContingut } from './types';

/** Pàgines institucionals i legals (bloc 3c, backend). El hub el prova `repte.spec.ts`. */
const PROPIES: ClauPagina[] = ['metodologia', 'sobreElProjecte', 'avisLegal', 'privacitat'];

const CAMINS_EXISTENTS = new Set<string>([
	...PRERENDER_PATHS,
	...SLUGS_CIMS.map((s) => `/cims/${s}`),
	...slugsComarquesAmbCims().map((s) => `/comarques/${s}`)
]);

const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function textsEnLinia(p: PaginaContingut): string[] {
	const deBloc = (b: Bloc): string[] => (b.tipus === 'llista' ? b.items : [b.text]);
	return [
		...p.seccions.flatMap((s) => s.blocs.flatMap(deBloc)),
		...(p.faq ?? []).map((f) => f.resposta)
	];
}

describe('índex de continguts', () => {
	it('CONTINGUTS té les 8 pàgines de PAGINES_CONTINGUT en ca i es', () => {
		expect(Object.keys(CONTINGUTS).sort()).toEqual(Object.keys(PAGINES_CONTINGUT).sort());
		for (const c of Object.values(CONTINGUTS)) expect(Object.keys(c).sort()).toEqual([...LOCALES]);
	});

	it('contingutPerCami: camí intern deslocalitzat (tolera la barra final)', () => {
		expect(contingutPerCami('/metodologia')).toBe(CONTINGUTS.metodologia);
		expect(contingutPerCami('/repte-100-cims/normativa/')).toBe(CONTINGUTS.normativa);
		expect(clauPerCami('/privacitat')).toBe('privacitat');
		expect(contingutPerCami('/privacidad')).toBeUndefined();
		expect(contingutPerCami('/cims')).toBeUndefined();
		expect(contingutPerCami('/')).toBeUndefined();
	});
});

describe.each(PROPIES)('pàgina %s', (clau) => {
	it.each(LOCALES)('%s: metadades dins dels límits i data de revisió ISO', (locale) => {
		const p = CONTINGUTS[clau][locale];
		expect(p.title.length).toBeLessThanOrEqual(60);
		expect(p.description.length).toBeLessThanOrEqual(155);
		expect(p.description.length).toBeGreaterThan(70);
		expect(p.actualitzat).toMatch(DATA_ISO);
		expect(p.noindex).toBeFalsy();
		const ids = p.seccions.map((s) => s.id);
		for (const id of ids) expect(id).toMatch(ID);
		expect(new Set(ids).size).toBe(ids.length);
		for (const f of p.fonts ?? []) {
			expect(f.url).toMatch(/^https:\/\//);
			if (f.consultat) expect(f.consultat).toMatch(DATA_ISO);
		}
	});

	it.each(LOCALES)('%s: enllaços interns existents i externs https', (locale) => {
		for (const text of textsEnLinia(CONTINGUTS[clau][locale])) {
			for (const desti of destinsEnllacos(text)) {
				if (desti.startsWith('/')) {
					// `/cami#ancora`: el camí ha d'existir i, si és una pàgina de contingut, l'àncora
					// ha de ser una de les seves seccions.
					const [cami, ancora] = desti.split('#');
					expect(CAMINS_EXISTENTS, desti).toContain(cami);
					if (ancora !== undefined) {
						const pagDesti = contingutPerCami(cami);
						expect(pagDesti, desti).toBeDefined();
						expect(
							pagDesti![locale].seccions.map((s) => s.id),
							desti
						).toContain(ancora);
					}
				} else expect(desti).toMatch(/^https:\/\/[^\s]+$/);
			}
			// Cap enllaç mal format (p. ex. `[text] (destí)` o destí http://).
			expect(text).not.toMatch(/\]\s+\(|\]\(http:/);
		}
	});

	it('ca i es tenen les mateixes seccions', () => {
		const ids = (l: 'ca' | 'es') => CONTINGUTS[clau][l].seccions.map((s) => s.id);
		expect(ids('es')).toEqual(ids('ca'));
		expect(CONTINGUTS[clau].es.faq?.length).toBe(CONTINGUTS[clau].ca.faq?.length);
	});
});

describe('dades del titular i marcadors pendents', () => {
	it('legals i contacte fan servir el titular i el correu decidits', () => {
		for (const clau of ['avisLegal', 'privacitat'] as const) {
			for (const l of LOCALES) {
				const text = JSON.stringify(CONTINGUTS[clau][l]);
				expect(text).toContain(TITULAR.nom);
				expect(text).toContain(TITULAR.correu);
			}
		}
		for (const l of LOCALES) {
			expect(JSON.stringify(CONTINGUTS.metodologia[l])).toContain(TITULAR.correu);
			expect(JSON.stringify(CONTINGUTS.sobreElProjecte[l])).toContain(TITULAR.correu);
		}
	});

	it('les pàgines pròpies no porten cap altre correu que el de contacte', () => {
		const propies = PROPIES.map((c) => CONTINGUTS[c]);
		const correus = JSON.stringify(propies).match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g) ?? [];
		expect(new Set(correus)).toEqual(new Set([TITULAR.correu]));
	});

	it('pendentsDe troba els marcadors, fins i tot els escrits a mà', () => {
		expect(pendentsDe({ a: ['x [PENDENT: nom] y', { b: '[PENDIENTE: correo]' }] })).toEqual([
			'[PENDENT: nom]',
			'[PENDIENTE: correo]'
		]);
		for (const m of MARCADORS_PENDENTS) expect(m).toMatch(new RegExp(PATRO_PENDENT.source));
	});

	/** Inventari: cap contingut no pot portar marcadors pendents. */
	it('inventari de marcadors pendents: buit', () => {
		expect(MARCADORS_PENDENTS).toEqual([]);
		expect(pendentsDe(CONTINGUTS)).toEqual([]);
	});

	it('la persona responsable només surt amb les inicials', () => {
		expect(TITULAR.responsable).toBe('JSR');
		for (const l of LOCALES) {
			expect(JSON.stringify(CONTINGUTS.sobreElProjecte[l])).toContain('JSR');
		}
	});
});
