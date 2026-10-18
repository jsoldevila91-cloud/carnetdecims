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
		googleDisponible: () => false,
		entrarAmbGoogle: vi.fn(async () => {}),
		verificarCodi: vi.fn(async () => ({})),
		contrasenyaDisponible: () => false,
		crearCompteAmbContrasenya: vi.fn(async () => 'confirmar-correu' as const),
		entrarAmbContrasenya: vi.fn(async () => ({})),
		reenviarConfirmacio: vi.fn(async () => {}),
		demanarRestabliment: vi.fn(async () => {}),
		canviarContrasenya: vi.fn(async () => {}),
		modeRecuperacio: writable(false),
		sortirModeRecuperacio: vi.fn(),
		completarEntradaDesDeUrl: vi.fn(async () => 'cap' as const),
		sortir: vi.fn(async () => sessio.set({ estat: 'anonim' })),
		esborrarCompte: vi.fn(async () => sessio.set({ estat: 'anonim' })),
		exportarDadesCompte: vi.fn(async () => '{}'),
		exportarDadesLocals: vi.fn(async () => '{}'),
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

	it('autenticat: canvis bloquejats pel servidor amb text propi i còpia local', async () => {
		const { api } = doble(autenticat, {
			pendents: 0,
			ultimaSync: null,
			error: 'servidor',
			bloquejades: 2
		});
		render(CompteNuvol, { ascensionsLocals: 3, api });
		await expect.element(page.getByText("2 canvis no s'han pogut desar al núvol")).toBeVisible();
		await page.getByRole('button', { name: 'Descarrega una còpia' }).click();
		expect(api.exportarDadesLocals).toHaveBeenCalled();
		expect(page.getByText(/No s'ha pogut sincronitzar/).query()).toBeNull();
	});

	it('Google: sense configurar no es mostra; configurat redirigeix a la pàgina del compte', async () => {
		const sense = doble({ estat: 'anonim' });
		const r = render(CompteNuvol, { ascensionsLocals: 0, api: sense.api });
		await expect.element(page.getByLabelText('Correu electrònic')).toBeVisible();
		expect(page.getByRole('button', { name: /Google/ }).query()).toBeNull();
		await expect.element(page.getByText(/^Només et demanem el correu/)).toBeVisible();
		expect(page.getByText(/compte de Google/).query()).toBeNull();
		r.unmount();

		const { api } = doble({ estat: 'anonim' }, undefined, { googleDisponible: () => true });
		render(CompteNuvol, { ascensionsLocals: 0, api });
		// El text d'entrada no contradiu el botó: correu o compte de Google.
		await expect
			.element(page.getByText(/^Entra amb el correu, .* o amb el teu compte de Google\./))
			.toBeVisible();
		await page.getByRole('button', { name: 'Continua amb Google' }).click();
		expect(api.entrarAmbGoogle).toHaveBeenCalledWith({
			redirectTo: expect.stringMatching(/\/ca\/app\/compte$/)
		});
	});

	it('Google: un error es mostra i el botó es pot tornar a fer servir', async () => {
		const { api } = doble({ estat: 'anonim' }, undefined, {
			googleDisponible: () => true,
			entrarAmbGoogle: vi.fn(async () => {
				throw Object.assign(new Error('x'), { codi: 'xarxa' });
			})
		});
		render(CompteNuvol, { ascensionsLocals: 0, api });
		await page.getByRole('button', { name: 'Continua amb Google' }).click();
		await expect.element(page.getByRole('alert')).toHaveTextContent(/No s'ha pogut connectar/);
		await expect.element(page.getByRole('button', { name: 'Continua amb Google' })).toBeEnabled();
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

describe('CompteNuvol amb contrasenya (PUBLIC_PASSWORD_AUTH)', () => {
	beforeEach(() => localStorage.clear());

	const BONA = 'una-frase-llarga';
	const ambPwd = (sessio: SessioUi = { estat: 'anonim' }, extra: Partial<ApiCompte> = {}) =>
		doble(sessio, undefined, { contrasenyaDisponible: () => true, ...extra });
	const campPwd = () => page.getByLabelText('Contrasenya', { exact: true });
	const campEmail = () => page.getByLabelText('Correu electrònic');

	it('desactivada: no hi ha cap camp de contrasenya', async () => {
		const { api } = doble({ estat: 'anonim' }, undefined, { googleDisponible: () => true });
		render(CompteNuvol, { ascensionsLocals: 0, api });
		await expect.element(campEmail()).toBeVisible();
		expect(campPwd().query()).toBeNull();
		expect(page.getByRole('tab').query()).toBeNull();
		expect(page.getByRole('button', { name: /Prefereixo rebre/ }).query()).toBeNull();
	});

	it('activada: ordre Google, contrasenya i enllaç o codi', async () => {
		const { api } = ambPwd(undefined, { googleDisponible: () => true });
		render(CompteNuvol, { ascensionsLocals: 0, api });
		const google = page.getByRole('button', { name: 'Continua amb Google' }).element();
		const tab = page.getByRole('tab', { name: 'Entra' }).element();
		const enllac = page.getByRole('button', { name: 'Prefereixo rebre un enllaç o un codi' });
		const despres = (a: Element, b: Element) =>
			!!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
		expect(despres(google, tab)).toBe(true);
		expect(despres(tab, enllac.element())).toBe(true);
		await expect
			.element(page.getByRole('tab', { name: 'Entra' }))
			.toHaveAttribute('aria-selected', 'true');
		// L'enllaç queda plegat; en obrir-lo, el flux de sempre.
		await expect.element(enllac).toHaveAttribute('aria-expanded', 'false');
		expect(page.getByRole('button', { name: "Envia'm l'enllaç" }).query()).toBeNull();
		await enllac.click();
		await expect.element(enllac).toHaveAttribute('aria-expanded', 'true');
		await page.getByRole('button', { name: "Envia'm l'enllaç" }).click();
		await expect.element(page.getByRole('alert')).toHaveTextContent(/adreça de correu vàlida/);
	});

	it('mostra la contrasenya amb un botó aria-pressed; autocompletat correcte', async () => {
		const { api } = ambPwd();
		render(CompteNuvol, { ascensionsLocals: 0, api });
		await expect.element(campPwd()).toHaveAttribute('type', 'password');
		await expect.element(campPwd()).toHaveAttribute('autocomplete', 'current-password');
		await expect.element(campEmail()).toHaveAttribute('autocomplete', 'email');
		const ull = page.getByRole('button', { name: 'Mostra la contrasenya' });
		await expect.element(ull).toHaveAttribute('aria-pressed', 'false');
		await ull.click();
		await expect.element(ull).toHaveAttribute('aria-pressed', 'true');
		await expect.element(campPwd()).toHaveAttribute('type', 'text');
	});

	it('entra amb correu i contrasenya i anuncia el primer accés', async () => {
		const { api, sessio } = ambPwd();
		api.entrarAmbContrasenya = vi.fn(async () => {
			sessio.set(autenticat);
			return {};
		});
		render(CompteNuvol, { ascensionsLocals: 2, api });
		await campEmail().fill('nom@exemple.cat');
		await campPwd().fill('qualsevol');
		await page.getByRole('button', { name: 'Entra amb la contrasenya' }).click();
		expect(api.entrarAmbContrasenya).toHaveBeenCalledWith('nom@exemple.cat', 'qualsevol');
		await expect.element(page.getByText(/Desant les teves ascensions al núvol/)).toBeVisible();
	});

	it('credencials incorrectes: error lligat als camps amb aria-describedby', async () => {
		const { api } = ambPwd(undefined, {
			entrarAmbContrasenya: vi.fn(async () => {
				throw Object.assign(new Error('x'), { codi: 'credencials' });
			})
		});
		render(CompteNuvol, { ascensionsLocals: 0, api });
		await campEmail().fill('nom@exemple.cat');
		await campPwd().fill('dolenta');
		await page.getByRole('button', { name: 'Entra amb la contrasenya' }).click();
		const alerta = page.getByRole('alert');
		await expect.element(alerta).toHaveTextContent('El correu o la contrasenya no són correctes.');
		const id = alerta.element().id;
		expect(id).toBeTruthy();
		await expect.element(campPwd()).toHaveAttribute('aria-invalid', 'true');
		expect(campPwd().element().getAttribute('aria-describedby')).toContain(id);
		expect(campEmail().element().getAttribute('aria-describedby')).toContain(id);
	});

	it('crea un compte: valida la llargada i després demana confirmar el correu', async () => {
		const { api } = ambPwd();
		render(CompteNuvol, { ascensionsLocals: 0, api });
		await page.getByRole('tab', { name: 'Entra' }).click();
		await userEvent.keyboard('{ArrowRight}');
		const crear = page.getByRole('tab', { name: 'Crea un compte' });
		await expect.element(crear).toHaveAttribute('aria-selected', 'true');
		await expect.element(crear).toHaveFocus();
		await expect.element(campPwd()).toHaveAttribute('autocomplete', 'new-password');
		await expect.element(page.getByText('Mínim 10 caràcters.')).toBeVisible();
		await campEmail().fill('nom@exemple.cat');
		await campPwd().fill('curta');
		await page.getByRole('button', { name: 'Crea el compte' }).click();
		await expect
			.element(page.getByRole('alert'))
			.toHaveTextContent('La contrasenya ha de tenir com a mínim 10 caràcters.');
		expect(api.crearCompteAmbContrasenya).not.toHaveBeenCalled();
		expect(campPwd().element().getAttribute('aria-describedby')).toMatch(/hint.*err/);

		await campPwd().fill(BONA);
		await page.getByRole('button', { name: 'Crea el compte' }).click();
		expect(api.crearCompteAmbContrasenya).toHaveBeenCalledWith('nom@exemple.cat', BONA, {
			redirectTo: expect.stringMatching(/\/ca\/app\/compte$/)
		});
		await expect
			.element(page.getByText(/T'hem enviat un correu a nom@exemple.cat per confirmar-lo/))
			.toBeVisible();
		await expect.element(page.getByLabelText('O escriu el codi del correu')).toBeVisible();
		await expect.element(page.getByText(/Podràs tornar a enviar el correu d'aquí a/)).toBeVisible();
	});

	it('correu sense confirmar: ofereix reenviar la confirmació', async () => {
		const { api } = ambPwd(undefined, {
			entrarAmbContrasenya: vi.fn(async () => {
				throw Object.assign(new Error('x'), { codi: 'correu-no-confirmat' });
			})
		});
		render(CompteNuvol, { ascensionsLocals: 0, api });
		await campEmail().fill('nom@exemple.cat');
		await campPwd().fill(BONA);
		await page.getByRole('button', { name: 'Entra amb la contrasenya' }).click();
		await expect.element(page.getByRole('alert')).toHaveTextContent(/no has confirmat el correu/);
		await page.getByRole('button', { name: 'Reenvia el correu de confirmació' }).click();
		expect(api.reenviarConfirmacio).toHaveBeenCalledWith('nom@exemple.cat', {
			redirectTo: expect.stringMatching(/\/ca\/app\/compte$/)
		});
		await expect.element(page.getByText(/per confirmar-lo/)).toBeVisible();
	});

	it('he oblidat la contrasenya: demana el correu i respon de manera neutra', async () => {
		const { api } = ambPwd();
		render(CompteNuvol, { ascensionsLocals: 0, api });
		await page.getByRole('button', { name: 'He oblidat la contrasenya' }).click();
		const titol = page.getByRole('heading', { name: 'Restableix la contrasenya' });
		await expect.element(titol).toHaveFocus();
		expect(campPwd().query()).toBeNull();
		await campEmail().fill('nom@exemple.cat');
		await page.getByRole('button', { name: "Envia l'enllaç per restablir-la" }).click();
		expect(api.demanarRestabliment).toHaveBeenCalledWith('nom@exemple.cat', {
			redirectTo: expect.stringMatching(/\/ca\/app\/compte$/)
		});
		await expect
			.element(page.getByRole('status'))
			.toHaveTextContent(/Si hi ha un compte amb aquest correu, t'hem enviat un enllaç/);
		await page.getByRole('button', { name: "Torna a l'entrada" }).click();
		await expect
			.element(page.getByRole('button', { name: 'He oblidat la contrasenya' }))
			.toHaveFocus();
	});

	it('recuperació: en tornar de l’enllaç demana la contrasenya nova', async () => {
		const modeRecuperacio = writable(false);
		const { api } = ambPwd(autenticat, {
			modeRecuperacio,
			completarEntradaDesDeUrl: vi.fn(async () => 'recuperacio' as const)
		});
		api.canviarContrasenya = vi.fn(async () => modeRecuperacio.set(false));
		render(CompteNuvol, { ascensionsLocals: 0, api });
		const titol = page.getByRole('heading', { name: 'Tria una contrasenya nova' });
		await expect.element(titol).toHaveFocus();
		// La secció del perfil no es duplica mentre hi ha el panell.
		expect(page.getByRole('button', { name: 'Crea o canvia la contrasenya' }).query()).toBeNull();
		await page.getByLabelText('Contrasenya nova', { exact: true }).fill(BONA);
		await page.getByRole('button', { name: 'Desa la contrasenya' }).click();
		expect(api.canviarContrasenya).toHaveBeenCalledWith(BONA);
		expect(api.sortirModeRecuperacio).toHaveBeenCalled();
		await expect.element(titol).not.toBeInTheDocument();
		await expect.element(page.getByRole('heading', { name: 'El teu compte' })).toHaveFocus();
	});

	it('recuperació: també amb el store modeRecuperacio, i "Ara no" el tanca', async () => {
		const { api } = ambPwd(autenticat, { modeRecuperacio: writable(true) });
		render(CompteNuvol, { ascensionsLocals: 0, api });
		await expect
			.element(page.getByRole('heading', { name: 'Tria una contrasenya nova' }))
			.toBeVisible();
		await page.getByRole('button', { name: 'Ara no' }).click();
		expect(api.sortirModeRecuperacio).toHaveBeenCalled();
	});

	it('perfil: crea o canvia la contrasenya, amb error de reautenticació', async () => {
		const { api } = ambPwd(autenticat, {
			canviarContrasenya: vi.fn(async () => {
				throw Object.assign(new Error('x'), { codi: 'reautenticacio' });
			})
		});
		render(CompteNuvol, { ascensionsLocals: 0, api });
		await expect
			.element(page.getByText(/Pots entrar també amb el correu i una contrasenya/))
			.toBeVisible();
		const obre = page.getByRole('button', { name: 'Crea o canvia la contrasenya' });
		await expect.element(obre).toHaveAttribute('aria-expanded', 'false');
		await obre.click();
		await expect.element(obre).toHaveAttribute('aria-expanded', 'true');
		const nova = page.getByLabelText('Contrasenya nova', { exact: true });
		await expect.element(nova).toHaveAttribute('autocomplete', 'new-password');
		await nova.fill('nom@exemple.cat');
		await page.getByRole('button', { name: 'Desa la contrasenya' }).click();
		await expect
			.element(page.getByRole('alert'))
			.toHaveTextContent('La contrasenya no pot ser el teu correu.');
		expect(api.canviarContrasenya).not.toHaveBeenCalled();
		await nova.fill(BONA);
		await page.getByRole('button', { name: 'Desa la contrasenya' }).click();
		await expect
			.element(page.getByRole('alert'))
			.toHaveTextContent(/Per seguretat, torna a entrar amb un enllaç del correu/);
	});

	it('perfil sense contrasenya activada: no hi ha la secció', async () => {
		const { api } = doble(autenticat);
		render(CompteNuvol, { ascensionsLocals: 0, api });
		await expect.element(page.getByText('nom@exemple.cat')).toBeVisible();
		expect(page.getByRole('button', { name: 'Crea o canvia la contrasenya' }).query()).toBeNull();
	});
});
