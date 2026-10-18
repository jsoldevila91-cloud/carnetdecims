/**
 * Informació ràpida de les llistes (R5.2): caixa d'espai fix amb dades o sense, text per a
 * lectors de pantalla, lluna de nit i avís d'accés (incert sense "tancat").
 */
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import InfoRapidaCim from './InfoRapidaCim.svelte';
import AvisRestriccio from './AvisRestriccio.svelte';
import AtribucioMeteoAra from './AtribucioMeteoAra.svelte';

const caixa = (container: HTMLElement) =>
	container.querySelector<HTMLElement>('[data-testid="info-rapida"]')!;

const mida = (el: HTMLElement) => {
	const r = el.getBoundingClientRect();
	return { w: Math.round(r.width), h: Math.round(r.height) };
};

const HORA = '2026-10-18T10:15';

describe('InfoRapidaCim', () => {
	it('sense dades no mostra ni anuncia res, però reserva l’espai', () => {
		const { container } = render(InfoRapidaCim, { info: null });
		const el = caixa(container);
		expect(el.textContent?.trim()).toBe('');
		expect(el.querySelector('svg')).toBeNull();
		expect(mida(el).w).toBeGreaterThan(30);
	});

	it('amb dades ocupa exactament el mateix espai (cap salt de maquetació)', () => {
		const buida = render(InfoRapidaCim, { info: null });
		const plena = render(InfoRapidaCim, {
			info: {
				temps: { categoria: 'neu', temperatura: -12.3, esDia: true },
				acces: { tipus: 'fauna', fins: '2026-07-15', incerta: false },
				hora: HORA
			}
		});
		expect(mida(caixa(plena.container))).toEqual(mida(caixa(buida.container)));
	});

	it('dona el temps i l’avís en text per a lectors de pantalla', async () => {
		render(InfoRapidaCim, {
			info: {
				temps: { categoria: 'sol', temperatura: 12.4, esDia: true },
				acces: { tipus: 'militar', fins: null, incerta: false },
				hora: HORA
			}
		});
		await expect
			.element(page.getByText('Temps actual al cim (hora 10:15): Assolellat, 12 °C'))
			.toBeInTheDocument();
		await expect
			.element(page.getByText('Accés restringit (sense data de fi) · Zona militar'))
			.toBeInTheDocument();
	});

	it('de nit, "Serè" amb la lluna', async () => {
		const { container } = render(InfoRapidaCim, {
			info: { temps: { categoria: 'sol', temperatura: 3, esDia: false }, hora: HORA }
		});
		await expect.element(page.getByText(/Serè, 3 °C/)).toBeInTheDocument();
		expect(container.querySelector('svg.lluna')).not.toBeNull();
	});
});

describe('AvisRestriccio', () => {
	it('restricció incerta: dubte, mai "tancat"', async () => {
		render(AvisRestriccio, {
			acces: { tipus: 'obres', fins: null, incerta: true },
			variant: 'complet'
		});
		const avis = page.getByTestId('avis-restriccio');
		await expect
			.element(avis)
			.toHaveTextContent('Possible restricció (obres): comprova-ho a la FEEC');
		await expect.element(avis).not.toHaveTextContent(/tancat/i);
	});
});

describe('AvisRestriccio curt (llistes)', () => {
	it('text curt visible sense hover (incerta) i el complet al title i per a lectors', async () => {
		render(AvisRestriccio, {
			acces: { tipus: 'obres', fins: null, incerta: true },
			variant: 'curt'
		});
		const avis = page.getByTestId('avis-restriccio');
		await expect.element(avis.getByText('Possible restricció', { exact: true })).toBeVisible();
		await expect
			.element(avis)
			.toHaveAttribute('title', 'Possible restricció (obres): comprova-ho a la FEEC');
		await expect.element(avis).not.toHaveTextContent(/tancat|restringit/i);
	});
});

describe('AtribucioMeteoAra', () => {
	it('atribució CC BY 4.0 amb enllaços; sense dades, línia buida', async () => {
		const buida = render(AtribucioMeteoAra, {});
		const p = buida.container.querySelector('[data-testid="atribucio-meteo"]')!;
		expect(p.textContent?.trim()).toBe('');
		render(AtribucioMeteoAra, {
			font: {
				nom: 'Open-Meteo',
				url: 'https://open-meteo.com/',
				llicencia: 'CC BY 4.0',
				llicenciaUrl: 'https://creativecommons.org/licenses/by/4.0/'
			},
			hora: HORA
		});
		await expect.element(page.getByRole('link', { name: 'Open-Meteo' })).toBeVisible();
		await expect.element(page.getByRole('link', { name: 'CC BY 4.0' })).toBeVisible();
		await expect.element(page.getByText(/hora 10:15/)).toBeVisible();
	});
});
