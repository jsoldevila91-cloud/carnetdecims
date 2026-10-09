import { writable } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import type { ApiCompte } from './api';
import type { SessioUi, SyncUi } from './nuvol';

// El contracte real (Supabase) no es carrega: els tests hi passen un doble.
vi.mock('./api-real', () => ({ apiReal: {} }));

const { default: CompteNuvol } = await import('./CompteNuvol.svelte');

function doble(
	sessioInicial: SessioUi,
	syncInicial: SyncUi = { pendents: 0, ultimaSync: null },
	extra: Partial<ApiCompte> = {}
) {
	const sessio = writable<SessioUi>(sessioInicial);
	const estatSync = writable<SyncUi>(syncInicial);
	const api: ApiCompte = {
		sessio,
		estatSync,
		compteDisponible: () => true,
		entrarAmbEmail: vi.fn(async () => {}),
		verificarCodi: vi.fn(async () => ({})),
		completarEntradaDesDeUrl: vi.fn(async () => 'cap' as const),
		sortir: vi.fn(async () => sessio.set({ estat: 'anonim' })),
		esborrarCompte: vi.fn(async () => sessio.set({ estat: 'anonim' })),
		exportarDadesCompte: vi.fn(async () => '{}'),
		sincronitzarAra: vi.fn(async () => {}),
		resoldreConflicteCompte: vi.fn(async () => {}),
		...extra
	};
	return { api, sessio, estatSync };
}

const autenticat: SessioUi = {
	estat: 'autenticat',
	usuari: { id: 'u1', email: 'nom@exemple.cat' }
};

describe('CompteNuvol', () => {
	beforeEach(() => localStorage.clear());

	it('anònim: explica el compte i valida el correu abans d’enviar', async () => {
		const { api } = doble({ estat: 'anonim' });
		render(CompteNuvol, { ascensionsLocals: 3, api });
		await expect
			.element(page.getByText(/Crea un compte per desar el teu carnet al núvol/))
			.toBeVisible();
		await page.getByLabelText('Correu electrònic').fill('no-es-un-correu');
		await page.getByRole('button', { name: "Envia'm l'enllaç" }).click();
		await expect.element(page.getByRole('alert')).toHaveTextContent(/adreça de correu vàlida/);
		expect(api.entrarAmbEmail).not.toHaveBeenCalled();
	});

	it('anònim: envia l’enllaç i mostra l’estat "t’hem enviat un correu" amb espera per reenviar', async () => {
		const { api } = doble({ estat: 'anonim' });
		render(CompteNuvol, { ascensionsLocals: 3, api });
		await page.getByLabelText('Correu electrònic').fill('nom@exemple.cat');
		await page.getByRole('button', { name: "Envia'm l'enllaç" }).click();
		await expect.element(page.getByText(/T'hem enviat un correu a nom@exemple.cat/)).toBeVisible();
		expect(api.entrarAmbEmail).toHaveBeenCalledWith('nom@exemple.cat', {
			redirectTo: expect.stringMatching(/\/ca\/app\/compte$/)
		});
		await expect.element(page.getByText(/Podràs tornar a enviar l'enllaç d'aquí a/)).toBeVisible();
		expect(page.getByRole('button', { name: "Torna a enviar l'enllaç" }).query()).toBeNull();
		// Alternativa amb codi (PWA a l'iPhone).
		await expect.element(page.getByLabelText('O escriu el codi del correu')).toBeVisible();
	});

	it('anònim: un error de límit es tradueix', async () => {
		const { api } = doble({ estat: 'anonim' }, undefined, {
			entrarAmbEmail: vi.fn(async () => {
				throw Object.assign(new Error('x'), { codi: 'limit' });
			})
		});
		render(CompteNuvol, { ascensionsLocals: 0, api });
		await page.getByLabelText('Correu electrònic').fill('nom@exemple.cat');
		await page.getByRole('button', { name: "Envia'm l'enllaç" }).click();
		await expect.element(page.getByRole('alert')).toHaveTextContent(/massa enllaços seguits/);
	});

	it('autenticat: correu, estat desat i accions', async () => {
		const { api } = doble(autenticat, { pendents: 0, ultimaSync: new Date() });
		render(CompteNuvol, { ascensionsLocals: 3, api });
		await expect.element(page.getByText('nom@exemple.cat')).toBeVisible();
		await expect.element(page.getByText('Tot desat al núvol · ara mateix')).toBeVisible();
		await page.getByRole('button', { name: 'Sincronitza ara' }).click();
		expect(api.sincronitzarAra).toHaveBeenCalled();
		await expect.element(page.getByRole('button', { name: 'Tanca la sessió' })).toBeVisible();
	});

	it('autenticat: canvis pendents i error amb reintent', async () => {
		const { api, estatSync } = doble(autenticat, { pendents: 3, ultimaSync: null });
		render(CompteNuvol, { ascensionsLocals: 3, api });
		await expect.element(page.getByText('3 canvis pendents de desar al núvol')).toBeVisible();
		estatSync.set({ pendents: 3, ultimaSync: null, error: 'xarxa' });
		await expect.element(page.getByText('Error en sincronitzar')).toBeVisible();
		await page.getByRole('button', { name: 'Torna-ho a provar' }).click();
		expect(api.sincronitzarAra).toHaveBeenCalled();
	});

	it('esborrar el compte demana escriure el correu o ESBORRAR', async () => {
		const { api } = doble(autenticat, { pendents: 0, ultimaSync: new Date() });
		render(CompteNuvol, { ascensionsLocals: 3, api });
		await page.getByRole('button', { name: 'Esborra el compte' }).click();
		const confirma = page.getByRole('button', { name: 'Esborra el compte definitivament' });
		await expect.element(confirma).toBeDisabled();
		await page.getByLabelText(/escriu el teu correu o la paraula ESBORRAR/).fill('esborra');
		await expect.element(confirma).toBeDisabled();
		await page.getByLabelText(/escriu el teu correu o la paraula ESBORRAR/).fill('ESBORRAR');
		await expect.element(confirma).toBeEnabled();
		await confirma.click();
		expect(api.esborrarCompte).toHaveBeenCalledWith({ conservarDispositiu: true });
		await expect.element(page.getByLabelText('Correu electrònic')).toBeVisible();
	});

	it('primer accés: anuncia les ascensions desades quan acaba la sincronització', async () => {
		const { api, estatSync } = doble(
			autenticat,
			{ pendents: 5, ultimaSync: null },
			{
				completarEntradaDesDeUrl: vi.fn(async () => 'entrat' as const)
			}
		);
		render(CompteNuvol, { ascensionsLocals: 5, api });
		await expect.element(page.getByText(/Desant les teves ascensions al núvol/)).toBeVisible();
		estatSync.set({ pendents: 0, ultimaSync: new Date(Date.now() + 10) });
		await expect
			.element(page.getByText('Hem desat les teves 5 ascensions al núvol.').first())
			.toBeVisible();
	});

	it('enllaç caducat: missatge clar', async () => {
		const { api } = doble({ estat: 'anonim' }, undefined, {
			completarEntradaDesDeUrl: vi.fn(async () => ({ codi: 'codi:invalid' }))
		});
		render(CompteNuvol, { ascensionsLocals: 0, api });
		await expect
			.element(page.getByRole('alert'))
			.toHaveTextContent(/ha caducat o ja s'ha fet servir/);
	});

	it('sense configuració del núvol, no ofereix el compte', async () => {
		const { api } = doble({ estat: 'anonim' }, undefined, { compteDisponible: () => false });
		render(CompteNuvol, { ascensionsLocals: 0, api });
		await expect.element(page.getByText(/encara no estan disponibles/)).toBeVisible();
		expect(page.getByLabelText('Correu electrònic').query()).toBeNull();
	});

	it('el teclat arriba al formulari', async () => {
		const { api } = doble({ estat: 'anonim' });
		render(CompteNuvol, { ascensionsLocals: 0, api });
		await page.getByLabelText('Correu electrònic').click();
		await userEvent.keyboard('nom@exemple.cat{Enter}');
		await expect.element(page.getByText(/T'hem enviat un correu/)).toBeVisible();
	});
});
