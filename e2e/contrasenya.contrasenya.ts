/**
 * Entrada amb correu i contrasenya (`PUBLIC_PASSWORD_AUTH=true`, i Google també actiu; vegeu
 * `playwright.contrasenya.config.ts`). Supabase és el fals (`supabase-fals.ts`): cap correu real,
 * cap compte real. Les contrasenyes d'aquí són valors de prova.
 *
 * Cobreix: ordre Google → contrasenya → enllaç, pestanyes (ratolí i teclat), autocomplete,
 * registre (missatge de confirmació, correu ja registrat sense revelar-ho, validació al client),
 * confirmació amb codi i amb enllaç, entrar, credencials incorrectes (aria-invalid +
 * aria-describedby), correu sense confirmar + reenviar, "He oblidat la contrasenya" (missatge
 * neutre), recuperació (`type=recovery`), canvi des del perfil (també errors del servidor), botó
 * per mostrar-la, "Prefereixo rebre un enllaç o un codi", sense connexió, axe clar/fosc,
 * objectius tàctils i reflow a 375 px.
 */
import AxeBuilder from '@axe-core/playwright';
import type { Locator, Page } from '@playwright/test';
import { toast } from './ascensions';
import { test as base, expect, gotoHydrated, settleAnimations } from './fixtures';
import {
	CLAU_SESSIO,
	CODI_BO,
	TOKEN_HASH_BO,
	TOKEN_HASH_RECUPERACIO,
	desarSessio,
	idUsuari,
	supabaseFals,
	type SupabaseFals
} from './supabase-fals';
import { escapeRe, t as tl } from './r1';

/**
 * Textos de `messages/ca.json` (s'estan revisant): només els noms de pestanyes, etiquetes i botons
 * de la contrasenya són fixos i es fan servir literals; la resta es llegeix del fitxer.
 */
const t = (clau: string, params: Record<string, string | number> = {}) => tl('ca', clau, params);
/** RegExp d'un text amb un compte enrere `{seconds}` (60, 59 o 58 s). */
const ambSegons = (clau: string) =>
	new RegExp(escapeRe(t(clau, { seconds: 'SEGONS' })).replace('SEGONS', '(60|59|58)'));

const COMPTE = '/ca/app/compte';
const INESA = 'inesa@exemple.cat';
const NOU = 'nou.compte@exemple.cat';
const PWD = 'cim-de-prova-2026';
const PWD_NOVA = 'una-altra-de-prova-77';

const test = base.extend<{ supa: SupabaseFals }>({
	supa: [
		async ({ context, consoleGuard }, use) => {
			// Errors que el servidor fals torna a propòsit (credencials, codi caducat, 422 de la
			// contrasenya) i el 403 d'algun recurs de `vite dev` (com a `google-actiu.google.ts`).
			consoleGuard.allow(/status of (400|401|403|422|429|500)/);
			const s = await supabaseFals(context, [INESA]);
			await use(s);
			expect(s.noGestionades, 'peticions a Supabase sense resposta al servidor fals').toEqual([]);
		},
		{ auto: true }
	]
});

const seccio = (page: Page) => page.locator('section#compte');
const tab = (page: Page, nom: 'Entra' | 'Crea un compte') =>
	seccio(page).getByRole('tab', { name: nom, exact: true });
const campEmail = (page: Page) => seccio(page).getByLabel('Correu electrònic').first();
const campPwd = (page: Page) => seccio(page).getByLabel('Contrasenya', { exact: true });
const campNova = (page: Page) => seccio(page).getByLabel('Contrasenya nova', { exact: true });
const boto = (page: Page, nom: string) =>
	seccio(page).getByRole('button', { name: nom, exact: true });
const ull = (page: Page) => boto(page, 'Mostra la contrasenya');

/** Ids de `aria-describedby` d'un element. */
async function descritPer(l: Locator): Promise<string[]> {
	return ((await l.getAttribute('aria-describedby')) ?? '').split(/\s+/).filter(Boolean);
}

async function entrarAmbContrasenya(page: Page, email: string, pwd: string) {
	await campEmail(page).fill(email);
	await campPwd(page).fill(pwd);
	await boto(page, 'Entra amb la contrasenya').click();
}

async function crearCompte(page: Page, email: string, pwd: string) {
	await tab(page, 'Crea un compte').click();
	await campEmail(page).fill(email);
	await campPwd(page).fill(pwd);
	await boto(page, 'Crea el compte').click();
}

const confirmacioEnviada = (page: Page, email: string) =>
	seccio(page).getByText(t('cloud_password_confirm_sent', { email }), { exact: true });
const hasEntrat = (page: Page) => seccio(page).getByText(t('cloud_signed_in_as'), { exact: true });
const alerta = (page: Page, clau: string, params: Record<string, string | number> = {}) =>
	seccio(page)
		.getByRole('alert')
		.filter({ hasText: t(clau, params) });
const botoT = (page: Page, clau: string) => seccio(page).getByRole('button', { name: t(clau) });
const campCodi = (page: Page) => seccio(page).getByLabel(t('cloud_code_label'));

// ---------------------------------------------------------------------------
// Estructura, pestanyes i autocomplete
// ---------------------------------------------------------------------------

test.describe('Formulari', () => {
	test('ordre Google → contrasenya → enllaç i autocomplete correctes', async ({ page }) => {
		await gotoHydrated(page, COMPTE);
		const google = botoT(page, 'cloud_google');
		const entra = tab(page, 'Entra');
		const enllac = boto(page, 'Prefereixo rebre un enllaç o un codi');
		await expect(google).toBeVisible();
		await expect(entra).toBeVisible();
		await expect(enllac).toBeVisible();
		const ordre = await page.evaluate(
			([a, b, c]) => {
				const pos = (x: Element, y: Element) =>
					!!(x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING);
				return pos(a!, b!) && pos(b!, c!);
			},
			[
				await google.elementHandle(),
				await entra.elementHandle(),
				await enllac.elementHandle()
			] as const
		);
		expect(ordre, 'Google, després la contrasenya i després l’enllaç').toBe(true);
		// Sense desplegar, el formulari de l'enllaç no hi és (un sol camp de correu).
		await expect(seccio(page).getByLabel('Correu electrònic')).toHaveCount(1);

		// Entrar: correu + current-password.
		await expect(campEmail(page)).toHaveAttribute('autocomplete', 'email');
		await expect(campEmail(page)).toHaveAttribute('type', 'email');
		await expect(campPwd(page)).toHaveAttribute('autocomplete', 'current-password');
		await expect(campPwd(page)).toHaveAttribute('type', 'password');
		await expect(campPwd(page)).toHaveAttribute('name', 'password');
		// Crear: new-password + pista de la llargada lligada amb aria-describedby.
		await tab(page, 'Crea un compte').click();
		await expect(campPwd(page)).toHaveAttribute('autocomplete', 'new-password');
		await expect(campPwd(page)).toHaveAttribute('name', 'new-password');
		const pista = seccio(page).getByText(t('cloud_password_hint', { min: 10 }));
		await expect(pista).toBeVisible();
		expect(await descritPer(campPwd(page))).toContain(await pista.getAttribute('id'));
	});

	test('pestanyes amb teclat: fletxes, Inici i Fi; roving tabindex i panell lligat', async ({
		page
	}) => {
		await gotoHydrated(page, COMPTE);
		const entra = tab(page, 'Entra');
		const crea = tab(page, 'Crea un compte');
		await expect(seccio(page).getByRole('tablist')).toHaveAccessibleName(
			t('cloud_password_modes_label')
		);
		await expect(entra).toHaveAttribute('aria-selected', 'true');
		await expect(entra).toHaveAttribute('tabindex', '0');
		await expect(crea).toHaveAttribute('tabindex', '-1');
		const panell = seccio(page).getByRole('tabpanel');
		await expect(panell).toHaveAccessibleName('Entra');

		await entra.focus();
		await page.keyboard.press('ArrowRight');
		await expect(crea).toBeFocused();
		await expect(crea).toHaveAttribute('aria-selected', 'true');
		await expect(entra).toHaveAttribute('aria-selected', 'false');
		await expect(panell).toHaveAccessibleName('Crea un compte');
		await expect(boto(page, 'Crea el compte')).toBeVisible();
		await expect(boto(page, 'He oblidat la contrasenya')).toHaveCount(0);

		await page.keyboard.press('ArrowLeft');
		await expect(entra).toBeFocused();
		await expect(entra).toHaveAttribute('aria-selected', 'true');
		await page.keyboard.press('End');
		await expect(crea).toBeFocused();
		await page.keyboard.press('Home');
		await expect(entra).toBeFocused();
		// Fletxa des de l'última torna a la primera (cicle).
		await page.keyboard.press('ArrowLeft');
		await expect(crea).toBeFocused();
		await page.keyboard.press('ArrowRight');
		await expect(entra).toBeFocused();
		// Tab surt de la llista de pestanyes cap al formulari (no passa per la pestanya inactiva).
		await page.keyboard.press('Tab');
		await expect(crea).not.toBeFocused();
	});

	test('botó per mostrar la contrasenya: type text i aria-pressed; el valor es conserva', async ({
		page
	}) => {
		await gotoHydrated(page, COMPTE);
		await campPwd(page).fill(PWD);
		await expect(ull(page)).toHaveAttribute('aria-pressed', 'false');
		await expect(campPwd(page)).toHaveAttribute('type', 'password');
		await ull(page).click();
		await expect(ull(page)).toHaveAttribute('aria-pressed', 'true');
		await expect(campPwd(page)).toHaveAttribute('type', 'text');
		await expect(campPwd(page)).toHaveValue(PWD);
		await ull(page).click();
		await expect(ull(page)).toHaveAttribute('aria-pressed', 'false');
		await expect(campPwd(page)).toHaveAttribute('type', 'password');
		await expect(campPwd(page)).toHaveValue(PWD);
	});

	test('"Prefereixo rebre un enllaç o un codi" desplega el flux de l’enllaç i l’envia', async ({
		page,
		supa
	}) => {
		await gotoHydrated(page, COMPTE);
		const toggle = boto(page, 'Prefereixo rebre un enllaç o un codi');
		await expect(toggle).toHaveAttribute('aria-expanded', 'false');
		await toggle.click();
		await expect(toggle).toHaveAttribute('aria-expanded', 'true');
		const controla = await toggle.getAttribute('aria-controls');
		expect(controla).toBeTruthy();
		const bloc = page.locator(`[id="${controla}"]`);
		await expect(bloc).toBeVisible();
		await bloc.getByLabel('Correu electrònic').fill(INESA);
		await bloc.getByRole('button', { name: t('cloud_send') }).click();
		await expect(seccio(page).getByText(t('cloud_sent', { email: INESA }))).toBeVisible();
		expect(supa.otps).toEqual([INESA]);
		expect(supa.signups).toEqual([]);
	});

	test('sense connexió: no crida Supabase i ho diu', async ({ page, context, supa }) => {
		await gotoHydrated(page, COMPTE);
		await campEmail(page).fill(INESA);
		await campPwd(page).fill(PWD);
		await context.setOffline(true);
		await boto(page, 'Entra amb la contrasenya').click();
		await expect(alerta(page, 'cloud_password_offline')).toBeVisible();
		await context.setOffline(false);
		expect(supa.crides('/auth/v1/token')).toHaveLength(0);
	});
});

// ---------------------------------------------------------------------------
// Registre i confirmació
// ---------------------------------------------------------------------------

test.describe('Crear un compte', () => {
	test('registre → correu de confirmació → codi → sessió', async ({ page, supa }) => {
		await gotoHydrated(page, COMPTE);
		const origen = new URL(page.url()).origin;
		await crearCompte(page, `  ${NOU.toUpperCase()} `, PWD);
		// El missatge mostra el correu tal com s'ha escrit (retallat); el servidor el rep normalitzat.
		await expect(confirmacioEnviada(page, NOU.toUpperCase())).toBeVisible();
		await expect(seccio(page).locator('.enviat')).toBeFocused();
		expect(supa.signups).toEqual([NOU]);
		const signup = supa.crides('/auth/v1/signup')[0];
		expect(signup.cos).toMatchObject({ email: NOU, password: PWD });
		expect(decodeURIComponent(signup.query)).toContain(`redirect_to=${origen}${COMPTE}`);
		expect(supa.correusEnviats).toEqual([{ tipus: 'signup', email: NOU }]);
		// Sense sessió encara.
		expect(await page.evaluate((c) => localStorage.getItem(c), CLAU_SESSIO)).toBeNull();
		await expect(seccio(page).getByText(ambSegons('cloud_password_confirm_wait'))).toBeVisible();

		await campCodi(page).fill(CODI_BO);
		await botoT(page, 'cloud_code_submit').click();
		await expect(hasEntrat(page)).toBeVisible({ timeout: 15_000 });
		await expect(seccio(page).getByText(NOU, { exact: true })).toBeVisible();
		expect(supa.comptes.get(NOU)?.confirmat).toBe(true);
		// Ja confirmat: pot tornar a entrar amb la contrasenya.
		await botoT(page, 'cloud_sign_out').click();
		await expect(tab(page, 'Entra')).toBeVisible();
		await entrarAmbContrasenya(page, NOU, PWD);
		await expect(hasEntrat(page)).toBeVisible({ timeout: 15_000 });
	});

	test('registre → confirmació amb l’enllaç (?token_hash=…&type=email) → sessió i URL neta', async ({
		page,
		supa
	}) => {
		await gotoHydrated(page, COMPTE);
		await crearCompte(page, INESA, PWD);
		await expect(confirmacioEnviada(page, INESA)).toBeVisible();
		await page.goto(`${COMPTE}?token_hash=${TOKEN_HASH_BO}&type=email`);
		await expect(hasEntrat(page)).toBeVisible({ timeout: 15_000 });
		await expect(page).toHaveURL(/\/ca\/app\/compte$/);
		expect(supa.crides('/auth/v1/verify').at(-1)?.cos).toMatchObject({
			token_hash: TOKEN_HASH_BO,
			type: 'email'
		});
		expect(supa.comptes.get(INESA)?.confirmat).toBe(true);
		expect(await page.evaluate((c) => localStorage.getItem(c), CLAU_SESSIO)).toContain(
			idUsuari(INESA)
		);
		// L'estat "t'hem enviat un correu" queda oblidat.
		await expect(confirmacioEnviada(page, INESA)).toHaveCount(0);
	});

	test('després del registre, "Fes servir un altre correu" torna a les pestanyes amb el focus al correu', async ({
		page
	}) => {
		await gotoHydrated(page, COMPTE);
		await crearCompte(page, NOU, PWD);
		await expect(confirmacioEnviada(page, NOU)).toBeVisible();
		// L'estat sobreviu a una recàrrega (una hora), també per al registre.
		await gotoHydrated(page, COMPTE);
		await expect(confirmacioEnviada(page, NOU)).toBeVisible();
		await botoT(page, 'cloud_change_email').click();
		await expect(tab(page, 'Entra')).toBeVisible();
		await expect(campEmail(page)).toBeFocused();
		// No s'obre el formulari de l'enllaç (era un registre amb contrasenya).
		await expect(seccio(page).getByLabel('Correu electrònic')).toHaveCount(1);
	});

	test('correu que ja té compte: mateix missatge, cap correu enviat (no es revela)', async ({
		page,
		supa
	}) => {
		supa.crearCompte(INESA, 'la-que-ja-tenia-1');
		await gotoHydrated(page, COMPTE);
		await crearCompte(page, INESA, PWD);
		await expect(confirmacioEnviada(page, INESA)).toBeVisible();
		expect(supa.signups).toEqual([INESA]);
		expect(supa.correusEnviats).toEqual([]);
		// La contrasenya del compte existent no canvia.
		expect(supa.comptes.get(INESA)?.contrasenya).toBe('la-que-ja-tenia-1');
	});

	test('validació al client: contrasenya curta, igual que el correu i buida, sense xarxa', async ({
		page,
		supa
	}) => {
		await gotoHydrated(page, COMPTE);
		await crearCompte(page, NOU, 'curta');
		const err = seccio(page).getByText(t('cloud_password_error_short', { min: 10 }));
		await expect(err).toBeVisible();
		await expect(campPwd(page)).toHaveAttribute('aria-invalid', 'true');
		await expect(campPwd(page)).toBeFocused();
		expect(await descritPer(campPwd(page))).toContain(await err.getAttribute('id'));
		// Límit: 9 caràcters encara no.
		await campPwd(page).fill('123456789');
		await boto(page, 'Crea el compte').click();
		await expect(err).toBeVisible();
		// Igual que el correu (ignorant majúscules).
		await campPwd(page).fill(NOU.toUpperCase());
		await boto(page, 'Crea el compte').click();
		await expect(seccio(page).getByText(t('cloud_password_error_same_email'))).toBeVisible();
		// Massa llarga (> 72 bytes UTF-8): 37 × "à" = 74 bytes.
		await campPwd(page).fill('à'.repeat(37));
		await boto(page, 'Crea el compte').click();
		await expect(seccio(page).getByText(t('cloud_password_error_long'))).toBeVisible();
		// Entrar amb la contrasenya buida (la pestanya conserva el valor: s'esborra).
		await tab(page, 'Entra').click();
		await campEmail(page).fill(INESA);
		await campPwd(page).fill('');
		await boto(page, 'Entra amb la contrasenya').click();
		await expect(seccio(page).getByText(t('cloud_password_error_empty'))).toBeVisible();
		// Correu invàlid.
		await campEmail(page).fill('no-es-un-correu');
		await campPwd(page).fill(PWD);
		await boto(page, 'Entra amb la contrasenya').click();
		await expect(campEmail(page)).toHaveAttribute('aria-invalid', 'true');
		await expect(campEmail(page)).toBeFocused();

		expect(supa.crides('/auth/v1/signup')).toHaveLength(0);
		expect(supa.crides('/auth/v1/token')).toHaveLength(0);
	});
});

// ---------------------------------------------------------------------------
// Entrar
// ---------------------------------------------------------------------------

test.describe('Entrar amb contrasenya', () => {
	test('correcta: sessió i correu normalitzat; la contrasenya no es desa al dispositiu', async ({
		page,
		supa
	}) => {
		supa.crearCompte(INESA, PWD);
		await gotoHydrated(page, COMPTE);
		await entrarAmbContrasenya(page, '  Inesa@Exemple.CAT ', PWD);
		await expect(hasEntrat(page)).toBeVisible({ timeout: 15_000 });
		const tok = supa.crides('/auth/v1/token')[0];
		expect(tok.query).toContain('grant_type=password');
		expect(tok.cos).toMatchObject({ email: INESA, password: PWD });
		const tot = await page.evaluate(() => JSON.stringify({ ...localStorage }));
		expect(tot).not.toContain(PWD);
	});

	test('després d’entrar, el focus va a l’avís del primer accés (no a <body>)', async ({
		page,
		supa
	}) => {
		supa.crearCompte(INESA, PWD);
		await gotoHydrated(page, COMPTE);
		await entrarAmbContrasenya(page, INESA, PWD);
		await expect(hasEntrat(page)).toBeVisible({ timeout: 15_000 });
		await expect(seccio(page).locator('.primer')).toBeFocused({ timeout: 15_000 });
	});

	test('credencials incorrectes: alerta, aria-invalid a tots dos camps i aria-describedby', async ({
		page,
		supa
	}) => {
		supa.crearCompte(INESA, PWD);
		await gotoHydrated(page, COMPTE);
		await entrarAmbContrasenya(page, INESA, 'no-es-aquesta-123');
		const credencials = alerta(page, 'cloud_password_error_credentials');
		await expect(credencials).toBeVisible();
		const id = await credencials.getAttribute('id');
		expect(id).toBeTruthy();
		for (const camp of [campEmail(page), campPwd(page)]) {
			await expect(camp).toHaveAttribute('aria-invalid', 'true');
			expect(await descritPer(camp)).toContain(id);
		}
		await expect(campPwd(page)).toBeFocused();
		// El missatge no diu quin dels dos falla; correu inexistent → mateix text.
		await entrarAmbContrasenya(page, 'ningu@exemple.cat', PWD);
		await expect(credencials).toBeVisible();
		// Corregir i tornar-hi: entra i els errors desapareixen.
		await entrarAmbContrasenya(page, INESA, PWD);
		await expect(hasEntrat(page)).toBeVisible({ timeout: 15_000 });
	});

	test('canviar de pestanya neteja l’error de credencials', async ({ page, supa }) => {
		supa.crearCompte(INESA, PWD);
		await gotoHydrated(page, COMPTE);
		await entrarAmbContrasenya(page, INESA, 'no-es-aquesta-123');
		await expect(seccio(page).getByRole('alert')).toBeVisible();
		await tab(page, 'Crea un compte').click();
		await expect(seccio(page).getByRole('alert')).toHaveCount(0);
		await expect(campEmail(page)).not.toHaveAttribute('aria-invalid', 'true');
	});

	test('correu sense confirmar: avís i "Reenvia el correu de confirmació"', async ({
		page,
		supa
	}) => {
		supa.crearCompte(NOU, PWD, { confirmat: false });
		await gotoHydrated(page, COMPTE);
		await entrarAmbContrasenya(page, NOU, PWD);
		await expect(alerta(page, 'cloud_password_unconfirmed')).toBeVisible();
		const reenvia = boto(page, 'Reenvia el correu de confirmació');
		await expect(reenvia).toBeVisible();
		await reenvia.click();
		await expect(confirmacioEnviada(page, NOU)).toBeVisible();
		const r = supa.crides('/auth/v1/resend');
		expect(r).toHaveLength(1);
		expect(r[0].cos).toMatchObject({ email: NOU, type: 'signup' });
		expect(supa.correusEnviats).toEqual([{ tipus: 'resend', email: NOU }]);
		// Confirma amb el codi i entra.
		await campCodi(page).fill(CODI_BO);
		await botoT(page, 'cloud_code_submit').click();
		await expect(hasEntrat(page)).toBeVisible({ timeout: 15_000 });
	});
});

// ---------------------------------------------------------------------------
// He oblidat la contrasenya i recuperació
// ---------------------------------------------------------------------------

test.describe('Restablir la contrasenya', () => {
	test('"He oblidat": focus al títol, missatge neutre (amb compte o sense) i tornar', async ({
		page,
		supa
	}) => {
		supa.crearCompte(INESA, PWD);
		await gotoHydrated(page, COMPTE);
		const origen = new URL(page.url()).origin;
		await campEmail(page).fill(INESA);
		await boto(page, 'He oblidat la contrasenya').click();
		await expect(
			seccio(page).getByRole('heading', { name: t('cloud_password_reset_title') })
		).toBeFocused();
		// El correu ja escrit es conserva.
		await expect(campEmail(page)).toHaveValue(INESA);
		await boto(page, "Envia l'enllaç per restablir-la").click();
		const neutre = seccio(page)
			.getByRole('status')
			.filter({ hasText: t('cloud_password_reset_sent') });
		await expect(neutre).toBeVisible();
		const rec = supa.crides('/auth/v1/recover');
		expect(rec[0].cos).toMatchObject({ email: INESA });
		expect(decodeURIComponent(rec[0].query)).toContain(`redirect_to=${origen}${COMPTE}`);

		// Correu sense compte: mateix missatge (no es revela), cap correu enviat.
		await campEmail(page).fill('ningu@exemple.cat');
		await boto(page, "Envia l'enllaç per restablir-la").click();
		await expect(neutre).toBeVisible();
		expect(supa.crides('/auth/v1/recover')).toHaveLength(2);
		expect(supa.correusEnviats).toEqual([{ tipus: 'recover', email: INESA }]);

		// Correu invàlid: error al camp, sense xarxa.
		await campEmail(page).fill('malament');
		await boto(page, "Envia l'enllaç per restablir-la").click();
		await expect(campEmail(page)).toHaveAttribute('aria-invalid', 'true');
		expect(supa.crides('/auth/v1/recover')).toHaveLength(2);

		await boto(page, "Torna a l'entrada").click();
		await expect(boto(page, 'He oblidat la contrasenya')).toBeFocused();
		await expect(tab(page, 'Entra')).toHaveAttribute('aria-selected', 'true');
	});

	test('enllaç de restabliment (type=recovery): panell amb focus → desar → toast', async ({
		page,
		supa
	}) => {
		supa.crearCompte(INESA, PWD);
		await page.goto(`${COMPTE}?token_hash=${TOKEN_HASH_RECUPERACIO}&type=recovery`);
		const titol = seccio(page).getByRole('heading', { name: 'Tria una contrasenya nova' });
		await expect(titol).toBeVisible({ timeout: 15_000 });
		await expect(titol).toBeFocused();
		await expect(page).toHaveURL(/\/ca\/app\/compte$/);
		expect(supa.crides('/auth/v1/verify')[0].cos).toMatchObject({
			token_hash: TOKEN_HASH_RECUPERACIO,
			type: 'recovery'
		});
		// Mentre es demana la nova, no surt la secció "Crea o canvia la contrasenya".
		await expect(boto(page, 'Crea o canvia la contrasenya')).toHaveCount(0);
		await expect(campNova(page)).toHaveAttribute('autocomplete', 'new-password');
		// Camp ocult `username` per als gestors de contrasenyes.
		await expect(seccio(page).locator('input[autocomplete="username"]')).toHaveValue(INESA);

		// La mateixa que l'actual: el servidor la rebutja (same_password).
		await campNova(page).fill(PWD);
		await boto(page, 'Desa la contrasenya').click();
		await expect(seccio(page).getByText(t('cloud_password_error_same'))).toBeVisible();
		await expect(campNova(page)).toHaveAttribute('aria-invalid', 'true');
		await expect(campNova(page)).toBeFocused();

		await campNova(page).fill(PWD_NOVA);
		await boto(page, 'Desa la contrasenya').click();
		await expect(toast(page, t('cloud_password_saved'))).toBeVisible();
		await expect(titol).toHaveCount(0);
		await expect(seccio(page).getByRole('heading', { name: t('cloud_title') })).toBeFocused();
		expect(supa.comptes.get(INESA)?.contrasenya).toBe(PWD_NOVA);
		const puts = supa.peticions.filter((p) => p.metode === 'PUT' && p.cami === '/auth/v1/user');
		expect(puts.at(-1)?.cos).toMatchObject({ password: PWD_NOVA });

		// Amb la nova es pot entrar; amb l'antiga, no.
		await botoT(page, 'cloud_sign_out').click();
		await entrarAmbContrasenya(page, INESA, PWD);
		await expect(alerta(page, 'cloud_password_error_credentials')).toBeVisible();
		await entrarAmbContrasenya(page, INESA, PWD_NOVA);
		await expect(hasEntrat(page)).toBeVisible({ timeout: 15_000 });
	});

	test('recuperació: "Ara no" tanca el panell i la sessió continua', async ({ page, supa }) => {
		supa.crearCompte(INESA, PWD);
		await page.goto(`${COMPTE}?token_hash=${TOKEN_HASH_RECUPERACIO}&type=recovery`);
		const titol = seccio(page).getByRole('heading', { name: 'Tria una contrasenya nova' });
		await expect(titol).toBeVisible({ timeout: 15_000 });
		await boto(page, 'Ara no').click();
		await expect(titol).toHaveCount(0);
		await expect(hasEntrat(page)).toBeVisible();
		await expect(boto(page, 'Crea o canvia la contrasenya')).toBeVisible();
		expect(supa.peticions.filter((p) => p.metode === 'PUT')).toHaveLength(0);
	});

	test('enllaç de restabliment caducat: avís i continua anònim', async ({ page }) => {
		await page.goto(`${COMPTE}?token_hash=caducat&type=recovery`);
		await expect(alerta(page, 'cloud_link_invalid')).toBeVisible({ timeout: 15_000 });
		await expect(page).toHaveURL(/\/ca\/app\/compte$/);
		await expect(tab(page, 'Entra')).toBeVisible();
	});
});

// ---------------------------------------------------------------------------
// Canviar la contrasenya des del perfil
// ---------------------------------------------------------------------------

test.describe('Canviar la contrasenya (amb sessió)', () => {
	async function ambSessio(page: Page) {
		await gotoHydrated(page, COMPTE);
		await desarSessio(page, INESA);
		await gotoHydrated(page, COMPTE);
		await expect(hasEntrat(page)).toBeVisible({ timeout: 15_000 });
	}

	test('obre, valida al client, error del servidor i desa amb toast; focus torna al botó', async ({
		page,
		supa
	}) => {
		supa.crearCompte(INESA, PWD);
		await ambSessio(page);
		const obre = boto(page, 'Crea o canvia la contrasenya');
		await expect(obre).toHaveAttribute('aria-expanded', 'false');
		await obre.click();
		await expect(obre).toHaveAttribute('aria-expanded', 'true');
		await expect(campNova(page)).toBeVisible();

		// Curta: no surt cap PUT.
		await campNova(page).fill('curta');
		await boto(page, 'Desa la contrasenya').click();
		await expect(
			seccio(page).getByText(t('cloud_password_error_short', { min: 10 }))
		).toBeVisible();
		// Igual que el correu.
		await campNova(page).fill(INESA);
		await boto(page, 'Desa la contrasenya').click();
		await expect(seccio(page).getByText(t('cloud_password_error_same_email'))).toBeVisible();
		expect(supa.peticions.filter((p) => p.metode === 'PUT')).toHaveLength(0);

		// El servidor la rebutja (weak_password).
		supa.errorCanviContrasenya = {
			status: 422,
			error_code: 'weak_password',
			msg: 'Password is known to be weak and easy to guess'
		};
		await campNova(page).fill(PWD_NOVA);
		await boto(page, 'Desa la contrasenya').click();
		await expect(seccio(page).getByText(t('cloud_password_error_weak'))).toBeVisible();
		await expect(campNova(page)).toHaveAttribute('aria-invalid', 'true');

		// Filtrada (pwned).
		supa.motiusFeble = ['pwned'];
		await boto(page, 'Desa la contrasenya').click();
		await expect(seccio(page).getByText(t('cloud_password_error_leaked'))).toBeVisible();

		supa.errorCanviContrasenya = null;
		await boto(page, 'Desa la contrasenya').click();
		await expect(toast(page, t('cloud_password_saved'))).toBeVisible();
		await expect(campNova(page)).toHaveCount(0);
		await expect(obre).toHaveAttribute('aria-expanded', 'false');
		await expect(obre).toBeFocused();
		expect(supa.comptes.get(INESA)?.contrasenya).toBe(PWD_NOVA);
	});

	test('cancel·lar tanca el formulari sense desar i el focus torna al botó', async ({
		page,
		supa
	}) => {
		await ambSessio(page);
		const obre = boto(page, 'Crea o canvia la contrasenya');
		await obre.click();
		await campNova(page).fill(PWD_NOVA);
		await botoT(page, 'cloud_password_cancel').click();
		await expect(campNova(page)).toHaveCount(0);
		await expect(obre).toBeFocused();
		expect(supa.peticions.filter((p) => p.metode === 'PUT')).toHaveLength(0);
	});
});

// ---------------------------------------------------------------------------
// Accessibilitat, objectius tàctils i reflow
// ---------------------------------------------------------------------------

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function expectNoAxeViolations(page: Page, que: string) {
	await page.evaluate(() => document.fonts.ready);
	await settleAnimations(page);
	const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
	const summary = violations.map((v) => ({
		id: v.id,
		nodes: v.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} → ${n.failureSummary}`)
	}));
	expect(summary, `violacions axe (${que})`).toEqual([]);
}

/**
 * Recorre els estats nous de /app/compte (anònim i amb sessió) i hi aplica `comprovar`.
 * Deixa la pàgina amb sessió i el formulari de canvi obert.
 */
async function recorrerEstats(
	page: Page,
	supa: SupabaseFals,
	comprovar: (que: string) => Promise<void>,
	email = INESA
) {
	supa.crearCompte(email, PWD);
	supa.correus.add(email);
	supa.emailEnllac = email;
	await gotoHydrated(page, COMPTE);
	await comprovar('anònim · Entra');
	await entrarAmbContrasenya(page, email, 'no-es-aquesta-123');
	await expect(seccio(page).getByRole('alert')).toBeVisible();
	await comprovar('credencials incorrectes');
	await tab(page, 'Crea un compte').click();
	await campPwd(page).fill('curta');
	await ull(page).click();
	await boto(page, 'Crea el compte').click();
	await expect(seccio(page).getByRole('alert')).toBeVisible();
	await comprovar('Crea un compte · contrasenya curta i visible');
	await boto(page, 'Prefereixo rebre un enllaç o un codi').click();
	await comprovar('enllaç desplegat');
	await tab(page, 'Entra').click();
	await boto(page, 'He oblidat la contrasenya').click();
	await boto(page, "Envia l'enllaç per restablir-la").click();
	await expect(seccio(page).getByText(t('cloud_password_reset_sent'))).toBeVisible();
	await comprovar('he oblidat · enviat');
	// Recuperació.
	await page.goto(`${COMPTE}?token_hash=${TOKEN_HASH_RECUPERACIO}&type=recovery`);
	await expect(
		seccio(page).getByRole('heading', { name: 'Tria una contrasenya nova' })
	).toBeVisible({ timeout: 15_000 });
	await campNova(page).fill('curta');
	await boto(page, 'Desa la contrasenya').click();
	await expect(seccio(page).getByRole('alert')).toBeVisible();
	await comprovar('recuperació amb error');
	await boto(page, 'Ara no').click();
	await boto(page, 'Crea o canvia la contrasenya').click();
	await expect(campNova(page)).toBeVisible();
	await comprovar('amb sessió · canvi obert');
}

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`axe · ${colorScheme}`, () => {
		test.use({ colorScheme });
		test('estats de la contrasenya sense violacions WCAG 2.2 AA', async ({ page, supa }) => {
			test.slow();
			await recorrerEstats(page, supa, (que) => expectNoAxeViolations(page, que));
		});
	});
}

test.describe('Mòbil · 375 px', () => {
	test.use({ viewport: { width: 375, height: 740 } });

	test('sense scroll horitzontal en cap estat (correu llarg)', async ({ page, supa }) => {
		test.slow();
		const llarg = 'una.adreca.de.correu.molt.llarga.per.provar@subdomini.exemple.cat';
		await recorrerEstats(
			page,
			supa,
			async (que) => {
				await settleAnimations(page);
				const { sw, cw } = await page.evaluate(() => ({
					sw: document.documentElement.scrollWidth,
					cw: document.documentElement.clientWidth
				}));
				expect(sw, `scroll horitzontal (${que})`).toBeLessThanOrEqual(cw);
			},
			llarg
		);
	});

	test('objectius tàctils >= 44 px als botons nous', async ({ page, supa }) => {
		const mida = async (l: Locator, nom: string, ample = false) => {
			await expect(l, nom).toBeVisible();
			const b = (await l.boundingBox())!;
			expect(b.height, `alçada de "${nom}"`).toBeGreaterThanOrEqual(44);
			if (ample) expect(b.width, `amplada de "${nom}"`).toBeGreaterThanOrEqual(44);
		};
		supa.crearCompte(NOU, PWD, { confirmat: false });
		await gotoHydrated(page, COMPTE);
		await mida(tab(page, 'Entra'), 'Entra');
		await mida(tab(page, 'Crea un compte'), 'Crea un compte');
		await mida(ull(page), 'Mostra la contrasenya', true);
		await mida(campPwd(page), 'camp Contrasenya');
		await mida(boto(page, 'Entra amb la contrasenya'), 'Entra amb la contrasenya');
		await mida(boto(page, 'He oblidat la contrasenya'), 'He oblidat la contrasenya');
		await mida(
			boto(page, 'Prefereixo rebre un enllaç o un codi'),
			'Prefereixo rebre un enllaç o un codi'
		);
		await entrarAmbContrasenya(page, NOU, PWD);
		await mida(boto(page, 'Reenvia el correu de confirmació'), 'Reenvia el correu de confirmació');
		await tab(page, 'Crea un compte').click();
		await mida(boto(page, 'Crea el compte'), 'Crea el compte');
		await tab(page, 'Entra').click();
		await boto(page, 'He oblidat la contrasenya').click();
		await mida(boto(page, "Envia l'enllaç per restablir-la"), "Envia l'enllaç per restablir-la");
		await mida(boto(page, "Torna a l'entrada"), "Torna a l'entrada");
		// Amb sessió (recuperació i perfil).
		supa.crearCompte(INESA, PWD);
		await page.goto(`${COMPTE}?token_hash=${TOKEN_HASH_RECUPERACIO}&type=recovery`);
		await expect(
			seccio(page).getByRole('heading', { name: 'Tria una contrasenya nova' })
		).toBeVisible({ timeout: 15_000 });
		await mida(boto(page, 'Desa la contrasenya'), 'Desa la contrasenya');
		await mida(boto(page, 'Ara no'), 'Ara no');
		await boto(page, 'Ara no').click();
		await mida(boto(page, 'Crea o canvia la contrasenya'), 'Crea o canvia la contrasenya');
		await boto(page, 'Crea o canvia la contrasenya').click();
		await mida(botoT(page, 'cloud_password_cancel'), 'Cancel·la');
	});
});
