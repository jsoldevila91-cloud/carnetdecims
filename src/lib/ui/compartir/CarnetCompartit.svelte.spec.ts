/**
 * Carnet compartit de només lectura (bloc R3): un enllaç real (`enllacCarnet`) es llegeix
 * (`llegeixEnllac`) i es pinta sense cap botó de segell ni detall editable.
 */
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { CIMS } from '$lib/data/catalog';
import { enllacCarnet, llegeixEnllac } from '$lib/data/compartir';
import { esErrorCarnet, type CarnetCompartit as TipusCarnet } from '$lib/domain';
import CarnetCompartit from './CarnetCompartit.svelte';
import { estatDeLectura, titolCarnetCompartit } from './carnet-compartit';
import { formatDataLlarga } from '../format';

const AVUI = '2026-10-17';
const d = (iso: string) => formatDataLlarga(iso, 'ca');

async function llegeix(entrada: Parameters<typeof enllacCarnet>[2]): Promise<TipusCarnet> {
	const url = await enllacCarnet('https://carnetdecims.cat', 'ca', entrada);
	expect(url.startsWith('https://carnetdecims.cat/ca/carnet#c=')).toBe(true);
	const r = await llegeixEnllac(url, CIMS, AVUI);
	if (esErrorCarnet(r)) throw new Error(`Enllaç il·legible: ${r.error}`);
	return r;
}

describe('CarnetCompartit', () => {
	it('mostra el nom, el resum i les caselles sense botons (només lectura)', async () => {
		const carnet = await llegeix({
			nom: 'Inesa',
			ascensions: [
				{ cimId: 30, data: '2018-01-01' }, // Montcau
				{ cimId: 54, data: '2020-01-01' } // Pedraforca
			]
		});
		render(CarnetCompartit, { carnet, avui: AVUI });

		await expect
			.element(page.getByRole('heading', { level: 1, name: "Carnet d'Inesa" }))
			.toBeVisible();
		await expect.element(page.getByTestId('carnet-compartit-total')).toHaveTextContent('2/100');

		const graella = page.getByRole('list', { name: 'Caselles de la pàgina I' });
		await expect.element(graella).toBeVisible();
		expect(graella.getByRole('button').elements()).toHaveLength(0);
		await expect
			.element(graella.getByText(`Casella 1: Montcau, ${d('2018-01-01')}`))
			.toBeInTheDocument();
		await expect
			.element(graella.getByText(`Casella 2: Pedraforca, ${d('2020-01-01')}`))
			.toBeInTheDocument();
		// Les pestanyes de pàgina sí que són navegables.
		await expect.element(page.getByRole('tab', { name: 'Pàgina I: 2 segells' })).toBeVisible();
		expect(page.getByTestId('carnet-compartit-descartades').elements()).toHaveLength(0);
	});

	it('sense nom: "Un carnet compartit"; avisa de les entrades descartades', async () => {
		const carnet: TipusCarnet = {
			ascensions: [{ cimId: 54, data: '2020-01-01' }],
			descartades: 2
		};
		render(CarnetCompartit, { carnet, avui: AVUI });
		await expect
			.element(page.getByRole('heading', { level: 1, name: 'Un carnet compartit' }))
			.toBeVisible();
		await expect
			.element(page.getByTestId('carnet-compartit-descartades'))
			.toHaveTextContent('2 entrades');
	});
});

describe('estatDeLectura', () => {
	it('error del còdec → error; carnet → ok', async () => {
		expect(estatDeLectura(await llegeixEnllac('#c=!!!', CIMS, AVUI))).toEqual({ tipus: 'error' });
		expect(estatDeLectura(await llegeixEnllac('#', CIMS, AVUI))).toEqual({ tipus: 'error' });
		const carnet = await llegeix({ ascensions: [{ cimId: 54, data: '2020-01-01' }] });
		expect(estatDeLectura(carnet)).toMatchObject({ tipus: 'ok', carnet: { descartades: 0 } });
	});
});

describe('titolCarnetCompartit', () => {
	it('apostrofa davant de vocal i h en català', () => {
		expect(titolCarnetCompartit('Inesa')).toBe("Carnet d'Inesa");
		expect(titolCarnetCompartit('Helena')).toBe("Carnet d'Helena");
		expect(titolCarnetCompartit('Àlex')).toBe("Carnet d'Àlex");
		expect(titolCarnetCompartit('Pere')).toBe('Carnet de Pere');
		expect(titolCarnetCompartit('  ')).toBe('Un carnet compartit');
		expect(titolCarnetCompartit(undefined)).toBe('Un carnet compartit');
	});
});
