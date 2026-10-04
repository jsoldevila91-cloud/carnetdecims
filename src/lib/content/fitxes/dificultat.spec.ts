import { describe, expect, it } from 'vitest';
import { cimPerSlug } from '$lib/data/catalog';
import type { ClauDificultat } from '$lib/domain';
import {
	contingutFitxa,
	dificultatFitxa,
	dificultatsRutes,
	rutaNormalAmbDificultat,
	rutesNormalsAmbDificultat,
	slugsLlistatDificultat,
	totsElsContingutsFitxa,
	type ContingutFitxa,
	type RutaAcces
} from './index';

const ruta = (r: Partial<RutaAcces>): RutaAcces => ({
	id: 'r',
	nom: { ca: 'R', es: 'R' },
	sortida: { nom: 'S' },
	descripcio: { ca: 'D', es: 'D' },
	fonts: [],
	...r
});

const fitxa = (slug: string, rutes: RutaAcces[]): ContingutFitxa => ({
	slug,
	descripcio: { ca: [], es: [] },
	rutes,
	fonts: [],
	estat: 'esborrany',
	actualitzat: '2026-10-01'
});

describe('dificultatFitxa', () => {
	it('fa servir la ruta normal (la primera) i l’altitud del catàleg', () => {
		const altitud = cimPerSlug('pica-d-estats')!.altitud;
		expect(altitud).toBeGreaterThanOrEqual(3000);
		const f = fitxa('pica-d-estats', [
			ruta({ tempsMinuts: 60, tecnicitat: 'cap' }),
			ruta({ tecnicitat: 'via-equipada' })
		]);
		const d = dificultatFitxa(f)!;
		expect(d.factors).toEqual({ esforc: 1, tecnica: 1, altitud: 3 });
		expect(d.clau).toBe('exigent');
		expect(dificultatsRutes(f).map((x) => x?.clau)).toEqual(['exigent', 'molt-exigent']);
		expect(rutaNormalAmbDificultat(f)!.ruta.altitudCim).toBe(altitud);
	});

	it('sense rutes o sense dades → null', () => {
		expect(dificultatFitxa(fitxa('montcau', []))).toBeNull();
		expect(rutaNormalAmbDificultat(fitxa('montcau', []))).toBeUndefined();
		expect(dificultatFitxa(fitxa('montcau', [ruta({ distanciaKm: 3 })]))).toBeNull();
	});

	it('slug fora del catàleg: sense factor d’altitud', () => {
		const d = dificultatFitxa(fitxa('no-existeix', [ruta({ tecnicitat: 'cap' })]))!;
		expect(d.factors).toEqual({ tecnica: 1 });
	});
});

/**
 * Integració amb les fitxes reals: la dificultat de la ruta normal ha de ser raonable per a
 * un muntanyenc (forquilles acceptables; la taula exacta és a `domain/dificultat.spec.ts`).
 */
describe('fitxes pilot: dificultat raonable de la ruta normal', () => {
	const ACCEPTABLE: Record<string, ClauDificultat[]> = {
		montcau: ['facil', 'moderada'],
		'la-mola-de-sant-llorenc-del-munt': ['facil', 'moderada'],
		matagalls: ['facil', 'moderada'],
		'sant-jeroni': ['facil', 'moderada'],
		taga: ['moderada'],
		puigmal: ['moderada', 'exigent'],
		canigo: ['exigent', 'molt-exigent'],
		comapedrosa: ['exigent', 'molt-exigent'],
		'pedraforca-pollego-superior': ['exigent', 'molt-exigent'],
		'pica-d-estats': ['exigent', 'molt-exigent']
	};

	it.each(Object.entries(ACCEPTABLE))('%s', (slug, acceptables) => {
		const c = contingutFitxa(slug);
		if (!c) return; // pilot retirada: res a comprovar
		const d = dificultatFitxa(c);
		expect(d, `${slug}: la ruta normal necessita dades d'esforç o tecnicitat`).not.toBeNull();
		expect(acceptables).toContain(d!.clau);
	});

	it('cada fitxa amb contingut té dificultat a rutesNormalsAmbDificultat', () => {
		const mapa = rutesNormalsAmbDificultat();
		for (const c of totsElsContingutsFitxa()) {
			if (c.rutes.length === 0) continue;
			expect(mapa.get(c.slug)?.dificultat).toEqual(dificultatFitxa(c));
		}
	});

	it('llistats: cap cim exigent ni amb grimpades; slugs ordenats i del catàleg', () => {
		const mapa = rutesNormalsAmbDificultat();
		for (const id of ['cims-facils', 'cims-amb-nens'] as const) {
			const slugs = slugsLlistatDificultat(id);
			expect(slugs).toEqual([...slugs].sort());
			for (const s of slugs) {
				expect(cimPerSlug(s)).toBeDefined();
				const r = mapa.get(s)!;
				expect(r.dificultat!.nivell).toBeLessThanOrEqual(id === 'cims-facils' ? 1 : 2);
				expect(['cap', 'terreny-irregular']).toContain(r.ruta.tecnicitat);
			}
		}
	});
});
