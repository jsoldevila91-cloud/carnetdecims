/**
 * PaginesCarnet i DetallSegell amb un catàleg sintètic: la secció "En espera" (no essencials
 * pujades des del 01/07/2019 sense el 100 fet) i "Més enllà del 5×100" no es poden provar per E2E
 * perquè el catàleg real només té les 150 essencials.
 */
import { describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { CIMS } from '$lib/data/catalog';
import { paginesCarnet, type Ascensio, type Carnet } from '$lib/domain';
import PaginesCarnet from './PaginesCarnet.svelte';
import DetallSegell from './DetallSegell.svelte';
import { formatDataLlarga } from './format';

/** Data llarga amb l'ICU del navegador ('de 2018' o 'del 2018' segons la versió). */
const d = (iso: string) => formatDataLlarga(iso, 'ca');

const AVUI = '2026-09-30';
/** Matagalls (83) i Montcau (30) com a no essencials; la resta del catàleg real. */
const NO_ESS = new Set([83, 30]);
const CATALEG = CIMS.map((c) => (NO_ESS.has(c.id) ? { ...c, essencial: false } : c));

let n = 0;
function asc(cimId: number, data: string, extra: Partial<Ascensio> = {}): Ascensio {
	n++;
	return {
		id: `0190a1b2-c3d4-4e5f-8a6b-${String(n).padStart(12, '0')}`,
		cimId,
		data,
		metode: 'a-peu',
		nota: null,
		createdAt: `2025-01-01T10:00:${String(n % 60).padStart(2, '0')}.000Z`,
		updatedAt: `2025-01-01T10:00:00.000Z`,
		deletedAt: null,
		...extra
	} as Ascensio;
}

describe('PaginesCarnet · En espera (catàleg sintètic)', () => {
	const ascensions = [
		asc(54, '2020-01-01'), // Pedraforca, essencial → pàgina I
		asc(30, '2018-01-01'), // Montcau, no essencial anterior al 2019-07-01 → compta
		asc(83, '2021-05-01') // Matagalls, no essencial posterior → en espera
	];
	const carnet = paginesCarnet(ascensions, CATALEG, { avui: AVUI });

	it('el domini posa Matagalls a enEspera amb la posició provisional 101', () => {
		expect(carnet.pagines[0].segells.map((s) => s.cimId)).toEqual([30, 54]);
		expect(carnet.enEspera).toMatchObject([
			{ cimId: 83, ordre: 101, comptaPerRepte: false, essencial: false }
		]);
	});

	it('la graella només té els 2 que compten; "En espera (1)" a part, amb botó i enllaç', async () => {
		const onobrir = vi.fn();
		render(PaginesCarnet, { carnet, onobrir });
		const graella = page.getByRole('list', { name: 'Caselles de la pàgina I' });
		await expect.element(graella).toBeInTheDocument();
		const botons = graella.getByRole('button').elements();
		expect(botons.map((b) => b.getAttribute('aria-label'))).toEqual([
			`Casella 1: Montcau, ${d('2018-01-01')}`,
			`Casella 2: Pedraforca, ${d('2020-01-01')}`
		]);
		const espera = page.getByRole('region', { name: 'En espera (1)' });
		await expect.element(espera).toBeVisible();
		await expect
			.element(espera.getByRole('link', { name: 'Què diu la normativa' }))
			.toHaveAttribute('href', '/ca/repte-100-cims/normativa#cims-essencials');
		const boto = espera.getByRole('button', { name: `Matagalls, ${d('2021-05-01')}` });
		await boto.click();
		expect(onobrir).toHaveBeenCalledWith(
			expect.objectContaining({ cimId: 83, comptaPerRepte: false, ordre: 101 })
		);
		// La pestanya I diu 2 segells (els d'espera no compten)
		await expect
			.element(page.getByRole('tab', { name: 'Pàgina I: 2 segells' }))
			.toHaveAttribute('aria-selected', 'true');
		expect(page.getByRole('region', { name: /Més enllà del 5×100/ }).elements()).toHaveLength(0);
	});

	it('DetallSegell d’un segell en espera: posició provisional i estat "En espera"', async () => {
		const segell = carnet.enEspera[0];
		render(DetallSegell, {
			segell,
			ascensions,
			onedit: vi.fn(),
			onregister: vi.fn()
		});
		await expect.element(page.getByText('Casella provisional 101 (en espera)')).toBeVisible();
		await expect.element(page.getByText('En espera: encara no compta per al repte')).toBeVisible();
		await expect.element(page.getByText('Cim essencial')).not.toBeInTheDocument();
	});

	it('completat el 100 amb essencials, Matagalls deixa d’estar en espera (retroactiu)', () => {
		const essencials = CATALEG.filter((c) => c.essencial).slice(0, 100);
		const cent = essencials.map((c, i) =>
			asc(c.id, `${2010 + Math.floor(i / 10)}-${String((i % 10) + 1).padStart(2, '0')}-15`)
		);
		const c = paginesCarnet([...cent, asc(83, '2021-05-01')], CATALEG, { avui: AVUI });
		expect(c.enEspera).toEqual([]);
		expect(c.pagines[0].completa).toBe(true);
		expect(c.pagines[1].segells).toMatchObject([{ cimId: 83, casella: 1, comptaPerRepte: true }]);
	});
});

describe('PaginesCarnet · Més enllà del 5×100', () => {
	it('mostra la secció amb el segell fora del carnet', async () => {
		const buida = { segells: [], completa: false, dataCompletada: null };
		const carnet: Carnet = {
			pagines: [1, 2, 3, 4, 5].map((k) => ({ ...buida, numero: k as 1 | 2 | 3 | 4 | 5 })),
			paginaActual: 5,
			enEspera: [],
			fora: [
				{
					cimId: 54,
					data: '2025-06-12',
					ascensioId: 'x',
					ordre: 501,
					essencial: true,
					comptaPerRepte: true
				}
			]
		};
		render(PaginesCarnet, { carnet, onobrir: vi.fn() });
		const fora = page.getByRole('region', { name: 'Més enllà del 5×100 (1)' });
		await expect.element(fora).toBeVisible();
		await expect
			.element(fora.getByRole('button', { name: `Pedraforca, ${d('2025-06-12')}` }))
			.toBeVisible();
	});
});
