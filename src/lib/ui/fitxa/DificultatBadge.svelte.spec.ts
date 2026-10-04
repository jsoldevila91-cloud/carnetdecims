/**
 * Distintiu de la "dificultat orientativa" (fase 6a-bis): nivell en text, forma (pics plens),
 * "aprox." amb l'explicació de les dades que falten, avís "no és el MIDE" i enllaç a la
 * metodologia. Dades sintètiques.
 */
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import DificultatBadge from './DificultatBadge.svelte';
import RutaAccesCard from './RutaAccesCard.svelte';
import type { RutaAccesLocal } from '$lib/content/fitxes/local';

describe('DificultatBadge', () => {
	it('complet: nivell en text, forma, avís de no MIDE i enllaç a la metodologia', async () => {
		const { container } = render(DificultatBadge, {
			dificultat: { nivell: 2, clau: 'moderada', aproximada: false, dadesQueFalten: [] },
			abast: 'ruta normal'
		});
		await expect.element(page.getByText('Dificultat orientativa')).toBeVisible();
		await expect.element(page.getByText('Moderada', { exact: true })).toBeVisible();
		await expect.element(page.getByText(/no és el MIDE/)).toBeVisible();
		await expect
			.element(page.getByRole('link', { name: 'Com es calcula' }))
			.toHaveAttribute('href', '/ca/metodologia#dificultat-orientativa');
		// Forma: 2 de 4 pics plens (no només color).
		expect(container.querySelectorAll('.pics path')).toHaveLength(4);
		expect(container.querySelectorAll('.pics path.ple')).toHaveLength(2);
		// Sense "aprox." ni explicació si no és aproximada.
		expect(container.querySelector('details')).toBeNull();
		expect(container.textContent).not.toContain('aprox.');
	});

	it('aproximada: "aprox." i les dades que falten en un <details>', async () => {
		const { container } = render(DificultatBadge, {
			dificultat: {
				nivell: 4,
				clau: 'molt-exigent',
				aproximada: true,
				dadesQueFalten: ['temps', 'tecnicitat']
			}
		});
		await expect.element(page.getByText('Molt exigent', { exact: true })).toBeVisible();
		await expect.element(page.getByText('aprox.', { exact: true })).toBeVisible();
		const details = container.querySelector('details') as HTMLDetailsElement;
		expect(details.open).toBe(false);
		await page.getByText('Per què és aproximada?').click();
		expect(details.open).toBe(true);
		await expect
			.element(page.getByText(/Falten dades de la ruta amb font: temps i pas més tècnic/))
			.toBeVisible();
	});

	it('compacte: sense elements interactius, amb el nom accessible complet', async () => {
		const { container } = render(DificultatBadge, {
			dificultat: { nivell: 1, clau: 'facil', aproximada: true },
			variant: 'compacte'
		});
		expect(container.querySelector('a, button, details')).toBeNull();
		expect(container.textContent).toContain('Dificultat orientativa: Fàcil');
		expect(container.textContent).toContain('estimació aproximada');
		expect(container.querySelectorAll('.pics path.ple')).toHaveLength(1);
	});
});

describe('RutaAccesCard amb dificultat i MIDE', () => {
	const RUTA: RutaAccesLocal = {
		id: 'prova',
		nom: 'Ruta de prova',
		sortida: { nom: 'Aparcament de prova' },
		desnivellPositiuM: 800,
		distanciaKm: 5,
		mide: { medi: 2, itinerari: 2, desplacament: 3, esforc: 3 },
		descripcio: 'Descripció de prova.',
		fonts: []
	};

	it('mostra tots dos, diferenciats', async () => {
		render(RutaAccesCard, {
			ruta: RUTA,
			dificultat: { nivell: 2, clau: 'moderada', aproximada: false, dadesQueFalten: [] }
		});
		await expect.element(page.getByText('Dificultat orientativa')).toBeVisible();
		await expect.element(page.getByRole('list', { name: 'Dificultat MIDE' })).toBeVisible();
		await expect.element(page.getByText(/no és el MIDE/)).toBeVisible();
	});
});
