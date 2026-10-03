/**
 * Components del contingut de la fitxa (fase 6a) amb dades sintètiques: les fitxes pilot encara
 * no tenen MIDE ni coordenades de sortida (sí 2–3 rutes de Wikiloc cadascuna; vegeu
 * `e2e/contingut-fitxa.e2e.ts`), i la meteo depèn de la xarxa.
 * Les dades d'aquí són de prova (no són cap fitxa real).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import type { RutaAccesLocal } from '$lib/content/fitxes/local';
import type { RutaWikiloc } from '$lib/content/fitxes/types';
import { ErrorMeteo, type PrevisioMeteo } from '$lib/platform/meteo';
import { avuiLocal } from '$lib/domain';
import RutaAccesCard from './RutaAccesCard.svelte';
import WikilocRecomanada from './WikilocRecomanada.svelte';
import MeteoCim from './MeteoCim.svelte';

// La meteo es prova sense xarxa: es substitueix el client (`obtenirMeteo`).
const { obtenir } = vi.hoisted(() => ({ obtenir: vi.fn() }));
vi.mock('$lib/platform/meteo', async (importOriginal) => ({
	...(await importOriginal<typeof import('$lib/platform/meteo')>()),
	obtenirMeteo: obtenir
}));

const RUTA: RutaAccesLocal = {
	id: 'prova',
	nom: 'Ruta de prova',
	sortida: { nom: 'Aparcament de prova', lat: 42.1, lon: 1.8 },
	desnivellPositiuM: 1050,
	distanciaKm: 4.25,
	tempsMinuts: 195,
	mide: { medi: 2, itinerari: 3, desplacament: 3, esforc: 4 },
	descripcio: 'Descripció **de prova**.',
	fonts: [{ nom: 'Font de prova', url: 'https://example.org/', consultat: '2026-10-03' }]
};

describe('RutaAccesCard', () => {
	it('mostra les xifres, la sortida al mapa i el MIDE com a text', async () => {
		render(RutaAccesCard, { ruta: RUTA });
		await expect
			.element(page.getByRole('heading', { level: 3 }))
			.toHaveTextContent('Ruta de prova');
		await expect.element(page.getByText('+1.050 m')).toBeVisible();
		await expect.element(page.getByText('4,3 km')).toBeVisible();
		await expect.element(page.getByText('3 h 30 min')).not.toBeInTheDocument();
		await expect.element(page.getByText('3 h 15 min')).toBeVisible();

		const mapa = page.getByRole('link', { name: /Obre al mapa/ });
		await expect.element(mapa).toHaveAttribute('href', expect.stringContaining('mlat=42.10000'));
		await expect.element(mapa).toHaveAttribute('rel', 'external noopener');

		// MIDE: llista amb nom, valor i explicació llegibles (no només forma o color).
		const mide = page.getByRole('list', { name: 'Dificultat MIDE' });
		await expect.element(mide).toBeVisible();
		const items = mide.getByRole('listitem');
		expect(items.elements()).toHaveLength(4);
		await expect.element(items.nth(3)).toHaveTextContent('Esforç');
		await expect.element(items.nth(3)).toHaveTextContent('4 de 5');
		await expect.element(items.nth(3)).toHaveTextContent('De 6 a 10 h de marxa.');
		await expect
			.element(page.getByRole('link', { name: /Què és el MIDE/ }))
			.toHaveAttribute('href', 'https://mide.montanasegura.com/');

		// Fonts plegades en un <details>
		const details = document.querySelector('details.fonts') as HTMLDetailsElement;
		expect(details.open).toBe(false);
		expect(details.querySelector('a')?.getAttribute('href')).toBe('https://example.org/');
		expect(details.querySelector('summary')?.textContent).toBe("Fonts d'aquesta ruta");
	});

	it('sense xifres ni MIDE no pinta caselles buides', async () => {
		const { container } = render(RutaAccesCard, {
			ruta: {
				...RUTA,
				sortida: { nom: 'Poble' },
				desnivellPositiuM: undefined,
				distanciaKm: undefined,
				tempsMinuts: undefined,
				mide: undefined,
				fonts: []
			}
		});
		expect(container.querySelector('dl')).toBeNull();
		expect(container.querySelector('.mide')).toBeNull();
		expect(container.querySelector('details')).toBeNull();
		expect(page.getByRole('link', { name: /Obre al mapa/ }).elements()).toHaveLength(0);
	});
});

describe('WikilocRecomanada (clic per carregar)', () => {
	const WL: RutaWikiloc = {
		id: 227473032,
		titol: 'Ruta de prova a Wikiloc',
		url: 'https://ca.wikiloc.com/rutes-senderisme/prova-227473032'
	};

	it("no carrega l'iframe fins que es demana", async () => {
		const { container } = render(WikilocRecomanada, { ruta: WL });
		expect(container.querySelector('iframe')).toBeNull();
		await expect
			.element(page.getByRole('link', { name: /Obre a Wikiloc/ }))
			.toHaveAttribute('rel', 'external nofollow noopener');

		const boto = page.getByRole('button', { name: 'Mostra la ruta' });
		await expect.element(boto).toHaveAttribute('aria-expanded', 'false');
		await boto.click();
		const iframe = container.querySelector('iframe');
		expect(iframe?.getAttribute('src')).toBe(
			'https://ca.wikiloc.com/wikiloc/embedv2.do?id=227473032&elevation=on&images=off&maptype=H'
		);
		expect(iframe?.getAttribute('title')).toBe('Mapa de Wikiloc: Ruta de prova a Wikiloc');
		await expect
			.element(page.getByRole('button', { name: 'Amaga la ruta' }))
			.toHaveAttribute('aria-expanded', 'true');
		await page.getByRole('button', { name: 'Amaga la ruta' }).click();
		expect(container.querySelector('iframe')).toBeNull();
	});
});

describe('MeteoCim', () => {
	const ara = Date.now();
	const iso = (offsetDies: number) => {
		const d = new Date(`${avuiLocal()}T12:00:00Z`);
		d.setUTCDate(d.getUTCDate() + offsetDies);
		return d.toISOString().slice(0, 10);
	};
	const previsio = (edatHores: number): PrevisioMeteo => ({
		actualitzat: new Date(ara - edatHores * 3_600_000).toISOString(),
		altitud: 2506,
		font: {
			nom: 'Open-Meteo',
			url: 'https://open-meteo.com/',
			llicencia: 'CC BY 4.0',
			llicenciaUrl: 'https://creativecommons.org/licenses/by/4.0/'
		},
		dies: [
			{
				data: iso(-1),
				tMax: 1,
				tMin: 0,
				ventMax: 1,
				ratxaMax: 1,
				precipitacio: 0,
				probPrecipitacio: 0,
				codi: 0
			},
			{
				data: iso(0),
				tMax: 7.6,
				tMin: 3,
				ventMax: 15,
				ratxaMax: 35,
				precipitacio: 17.9,
				probPrecipitacio: 83,
				codi: 63,
				iso0: 3440
			},
			{
				data: iso(1),
				tMax: 10.9,
				tMin: -0.4,
				ventMax: 7,
				ratxaMax: 22,
				precipitacio: 0,
				probPrecipitacio: null,
				codi: 0
			}
		]
	});

	afterEach(() => {
		obtenir.mockReset();
	});

	it("mostra els dies d'avui endavant amb unitats, edat, font i avís", async () => {
		obtenir.mockResolvedValue(previsio(2));
		const { container } = render(MeteoCim, { slug: 'pedraforca-pollego-superior', altitud: 2506 });

		await expect.element(page.getByText('Previsió a 2.506 m')).toBeVisible();
		await expect.element(page.getByText('Avui')).toBeVisible();
		expect(obtenir).toHaveBeenCalledWith('pedraforca-pollego-superior', expect.anything());
		// El dia d'ahir (previsió guardada) no es mostra.
		expect(container.querySelectorAll('.dies:not(.esquelet) > li')).toHaveLength(2);
		await expect.element(page.getByText('Demà')).toBeVisible();
		await expect.element(page.getByText('Pluja')).toBeVisible();
		await expect.element(page.getByText('Serè')).toBeVisible();
		expect(container.querySelector('.tmax')?.textContent).toMatch(/màxima: 8\s?°C/);
		expect(container.querySelector('.tmin')?.textContent).toMatch(/mínima: 3\s?°C/);
		await expect.element(page.getByText(/ratxes 35 km\/h/)).toBeVisible();
		await expect.element(page.getByText(/17,9 mm/)).toBeVisible();
		await expect.element(page.getByText('3.440 m')).toBeVisible();
		await expect.element(page.getByText('Previsió actualitzada fa 2 hores')).toBeVisible();
		expect(page.getByText(/Previsió antiga/).elements()).toHaveLength(0);
		await expect.element(page.getByRole('link', { name: /Dades: Open-Meteo/ })).toBeVisible();
		await expect
			.element(page.getByRole('link', { name: /CC BY 4\.0/ }))
			.toHaveAttribute('href', 'https://creativecommons.org/licenses/by/4.0/');
		await expect
			.element(page.getByRole('link', { name: /Servei Meteorològic de Catalunya/ }))
			.toHaveAttribute('href', 'https://www.meteo.cat/');
	});

	it('avisa si la previsió és antiga', async () => {
		obtenir.mockResolvedValue(previsio(30));
		render(MeteoCim, { slug: 'puigmal', altitud: 2910 });
		await expect.element(page.getByText('Previsió actualitzada fa 30 hores')).toBeVisible();
		await expect.element(page.getByText(/Previsió antiga: pot no estar al dia/)).toBeVisible();
	});

	it('error del servidor: missatge i "Torna-ho a provar"', async () => {
		obtenir.mockRejectedValue(new ErrorMeteo(502, 'proveidor'));
		render(MeteoCim, { slug: 'puigmal', altitud: 2910 });
		await expect.element(page.getByText("No s'ha pogut carregar la previsió.")).toBeVisible();
		obtenir.mockResolvedValue(previsio(0));
		await page.getByRole('button', { name: 'Torna-ho a provar' }).click();
		await expect.element(page.getByText('Avui')).toBeVisible();
	});

	it('sense xarxa: avís de previsió no disponible', async () => {
		obtenir.mockRejectedValue(new ErrorMeteo(0, 'Sense connexió'));
		render(MeteoCim, { slug: 'puigmal', altitud: 2910 });
		await expect.element(page.getByText('Sense connexió: previsió no disponible.')).toBeVisible();
	});
});
