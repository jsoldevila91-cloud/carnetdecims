/**
 * Bloc 4a · Registrar una ascensió (full inferior i pàgina /app/registrar).
 * Cada test comença amb IndexedDB buit (context nou de Playwright; `expectBdBuida` ho comprova).
 */
import type { Page, Response } from '@playwright/test';
import { test, expect, gotoHydrated, mainNav, settleAnimations } from './fixtures';
import {
	CIM,
	botoRegistrar,
	campData,
	campNota,
	combobox,
	expectBdBuida,
	filesBd,
	fitxerExportacio,
	obrirFullNav,
	sembrar,
	sheetRegistre,
	toast,
	triarCim,
	type FilaSembra
} from './ascensions';

const FITXA_PEDRAFORCA = `/ca/cims/${CIM.pedraforca.slug}`;

async function comptador(page: Page) {
	return (await page.locator('p.count').innerText()).replace(/\s+/g, '');
}

test.describe('Registrar des de la fitxa, la barra i la URL', () => {
	test('des de la fitxa del Pedraforca: cim preseleccionat, toast "+1 → 1/100" i torna a la fitxa', async ({
		page
	}) => {
		await gotoHydrated(page, FITXA_PEDRAFORCA);
		await expectBdBuida(page);
		await page.locator('main').getByRole('link', { name: 'Registrar aquest cim' }).click();

		const full = sheetRegistre(page);
		await expect(full).toBeVisible();
		await expect(page).toHaveURL(`/ca/app/registrar?cim=${CIM.pedraforca.slug}`);
		// Preseleccionat: targeta del cim amb "Canvia", sense cercador
		await expect(full.getByRole('button', { name: 'Canvia el cim (Pedraforca)' })).toBeVisible();
		await expect(combobox(full)).toHaveCount(0);
		await expect(full).toContainText('Essencial');

		await botoRegistrar(full).click();
		await expect(full).toBeHidden();
		await expect(page).toHaveURL(FITXA_PEDRAFORCA);

		const t = toast(page, 'Segellat: Pedraforca.');
		await expect(t).toBeVisible();
		await expect(t.locator('.delta')).toHaveText('+1');
		await expect(t).toContainText('1/100');
		await expect(t.getByRole('button', { name: 'Desfés' })).toBeVisible();

		const files = await filesBd(page);
		expect(files).toHaveLength(1);
		expect(files[0]).toMatchObject({ cimId: CIM.pedraforca.id, deletedAt: null });
	});

	test('tancar el full de la fitxa i obrir-lo des de la barra no conserva el cim', async ({
		page
	}) => {
		await gotoHydrated(page, FITXA_PEDRAFORCA);
		await page.locator('main').getByRole('link', { name: 'Registrar aquest cim' }).click();
		await expect(sheetRegistre(page).getByRole('button', { name: /Canvia el cim/ })).toBeVisible();
		await sheetRegistre(page).getByRole('button', { name: 'Tanca' }).click();
		await expect(sheetRegistre(page)).toBeHidden();
		const full = await obrirFullNav(page);
		await expect(combobox(full)).toBeVisible();
		await expect(combobox(full)).toHaveValue('');
	});

	test('des de la barra inferior: tria amb el teclat, desa i persisteix en recarregar', async ({
		page
	}) => {
		await gotoHydrated(page, '/ca/cims');
		await expectBdBuida(page);
		const full = await obrirFullNav(page);
		// Sense cim: el cercador és buit i la data per defecte és avui
		await expect(combobox(full)).toHaveValue('');
		const avui = await page.evaluate(() =>
			new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid' }).format(new Date())
		);
		await expect(campData(full)).toHaveValue(avui);

		await triarCim(full, 'matagalls', 'Matagalls');
		await full.getByRole('radio', { name: 'Raquetes' }).check();
		await campNota(full).fill('Amb boira');
		await botoRegistrar(full).click();
		await expect(full).toBeHidden();
		await expect(page).toHaveURL('/ca/cims');
		await expect(toast(page, 'Segellat: Matagalls.')).toBeVisible();

		await gotoHydrated(page, '/ca/app/historial');
		await expect(page.getByRole('heading', { name: 'Matagalls' })).toBeVisible();
		await page.reload();
		await expect(page.getByRole('heading', { name: 'Matagalls' })).toBeVisible();
		await expect(page.locator('main')).toContainText('Raquetes');
		await expect(page.locator('main')).toContainText('Amb boira');
	});

	test('/ca/app/registrar?cim=… (pàgina completa) preselecciona el cim, recarrega i desa', async ({
		page
	}) => {
		await gotoHydrated(page, `/ca/app/registrar?cim=${CIM.matagalls.slug}`);
		await expectBdBuida(page);
		await expect(page.locator('main h1')).toHaveText('Registrar una ascensió');
		await expect(page.getByRole('button', { name: 'Canvia el cim (Matagalls)' })).toBeVisible();
		await page.reload();
		await expect(page.getByRole('button', { name: 'Canvia el cim (Matagalls)' })).toBeVisible();
		await botoRegistrar(page.locator('main')).click();
		await expect(page).toHaveURL('/ca/app');
		await expect(toast(page, 'Segellat: Matagalls.')).toBeVisible();
		await expect.poll(() => comptador(page)).toBe('1/100');
	});

	test('recarregar amb el full obert des de la fitxa conserva el cim a la pàgina completa', async ({
		page
	}) => {
		await gotoHydrated(page, FITXA_PEDRAFORCA);
		await page.locator('main').getByRole('link', { name: 'Registrar aquest cim' }).click();
		await expect(sheetRegistre(page)).toBeVisible();
		await page.reload();
		await expect(sheetRegistre(page)).toBeHidden();
		await expect(
			page.locator('main').getByRole('button', { name: 'Canvia el cim (Pedraforca)' })
		).toBeVisible();
	});

	test('?cim= amb un slug inexistent deixa el cercador buit (sense errors)', async ({ page }) => {
		await gotoHydrated(page, '/ca/app/registrar?cim=no-existeix');
		await expect(combobox(page.locator('main'))).toHaveValue('');
	});
});

test.describe('Cercador de cims (combobox)', () => {
	test.beforeEach(async ({ page }) => {
		await gotoHydrated(page, '/ca/cims');
		await obrirFullNav(page);
	});

	const CASOS: [string, string][] = [
		['pollego', 'Pedraforca'], // àlies sense accent
		['Pollegó Superior', 'Pedraforca'],
		['canigo', 'Canigó'],
		['pica destats', "Pica d'Estats"],
		['pica d’estats', "Pica d'Estats"], // apòstrof tipogràfic
		['PUIG DE L ALIGA', "Puig de l'Àliga"]
	];
	for (const [consulta, nom] of CASOS) {
		test(`"${consulta}" troba ${nom}`, async ({ page }) => {
			await triarCim(sheetRegistre(page), consulta, nom);
		});
	}

	test('fletxes mouen l’opció activa (aria-activedescendant) i Retorn tria sense enviar', async ({
		page
	}) => {
		const full = sheetRegistre(page);
		const cb = combobox(full);
		await cb.pressSequentially('puig');
		await expect(cb).toHaveAttribute('aria-expanded', 'true');
		const opcions = full.getByRole('option');
		expect(await opcions.count()).toBeGreaterThan(2);
		const id0 = await opcions.nth(0).getAttribute('id');
		const id1 = await opcions.nth(1).getAttribute('id');
		await expect(cb).toHaveAttribute('aria-activedescendant', id0!);
		await cb.press('ArrowDown');
		await expect(cb).toHaveAttribute('aria-activedescendant', id1!);
		await expect(opcions.nth(1)).toHaveAttribute('aria-selected', 'true');
		await cb.press('ArrowUp');
		await cb.press('ArrowUp'); // dona la volta a l'última
		const idUltima = await opcions.last().getAttribute('id');
		await expect(cb).toHaveAttribute('aria-activedescendant', idUltima!);
		await cb.press('ArrowDown'); // torna a la primera
		await cb.press('ArrowDown');
		const nom = (await opcions.nth(1).locator('.o-nom').innerText()).trim();
		await cb.press('Enter');
		// Tria i el focus passa al botó "Canvia"; el full continua obert (no s'ha enviat)
		const canvia = full.getByRole('button', { name: `Canvia el cim (${nom})` });
		await expect(canvia).toBeFocused();
		await expect(full).toBeVisible();
		expect(await filesBd(page)).toHaveLength(0);
	});

	test('Esc buida la cerca sense tancar el full; sense resultats ho diu', async ({ page }) => {
		const full = sheetRegistre(page);
		const cb = combobox(full);
		await cb.fill('zzzzqq');
		await expect(full.getByRole('status')).toHaveText('Cap cim coincideix amb la cerca.');
		await cb.press('Escape');
		await expect(cb).toHaveValue('');
		await expect(full).toBeVisible();
		await expect(cb).toHaveAttribute('aria-expanded', 'false');
	});

	test('"Canvia" torna al cercador i Esc hi torna a deixar el cim', async ({ page }) => {
		const full = sheetRegistre(page);
		await triarCim(full, 'montcau', 'Montcau');
		await full.getByRole('button', { name: 'Canvia el cim (Montcau)' }).click();
		await expect(combobox(full)).toBeFocused();
		await combobox(full).press('Escape');
		await expect(full.getByRole('button', { name: 'Canvia el cim (Montcau)' })).toBeFocused();
		await expect(full).toBeVisible();
	});
});

test.describe('Validacions (errors al costat del camp i focus al primer)', () => {
	test('sense cim: error al cercador, resum i focus al cercador', async ({ page }) => {
		await gotoHydrated(page, '/ca/cims');
		const full = await obrirFullNav(page);
		await botoRegistrar(full).click();
		await expect(full.getByText('Revisa el formulari:')).toBeVisible();
		const cb = combobox(full);
		await expect(cb).toBeFocused();
		await expect(cb).toHaveAttribute('aria-invalid', 'true');
		await expect(cb).toHaveAccessibleDescription(/Tria un cim de la llista\./);
		expect(await filesBd(page)).toHaveLength(0);
	});

	test('data anterior al 01/07/2006: error a la data i focus; el 01/07/2006 és vàlid', async ({
		page
	}) => {
		await gotoHydrated(page, `/ca/app/registrar?cim=${CIM.montcau.slug}`);
		const main = page.locator('main');
		const data = campData(main);
		await expect(data).toHaveAttribute('min', '2006-07-01');
		await data.fill('2006-06-30');
		await botoRegistrar(main).click();
		await expect(data).toBeFocused();
		await expect(data).toHaveAttribute('aria-invalid', 'true');
		await expect(data).toHaveAccessibleDescription(/a partir de l'1 de juliol de 2006/);
		expect(await filesBd(page)).toHaveLength(0);

		// L'error s'actualitza en viu; el límit exacte es desa
		await data.fill('2006-07-01');
		await expect(data).not.toHaveAttribute('aria-invalid', 'true');
		await botoRegistrar(main).click();
		await expect(page).toHaveURL('/ca/app');
		const files = await filesBd(page);
		expect(files.map((f) => f.data)).toEqual(['2006-07-01']);
	});

	test('data futura (avui fixat amb page.clock): error; avui és vàlid', async ({ page }) => {
		// 10/03/2026 a les 12:00 a Madrid
		await page.clock.setFixedTime(new Date('2026-03-10T11:00:00Z'));
		await gotoHydrated(page, `/ca/app/registrar?cim=${CIM.montcau.slug}`);
		const main = page.locator('main');
		const data = campData(main);
		await expect(data).toHaveValue('2026-03-10');
		await expect(data).toHaveAttribute('max', '2026-03-10');
		await data.fill('2026-03-11');
		await botoRegistrar(main).click();
		await expect(data).toBeFocused();
		await expect(data).toHaveAccessibleDescription(/La data no pot ser posterior a avui\./);
		expect(await filesBd(page)).toHaveLength(0);
		await data.fill('2026-03-10');
		await botoRegistrar(main).click();
		await expect(page).toHaveURL('/ca/app');
		expect((await filesBd(page)).map((f) => f.data)).toEqual(['2026-03-10']);
	});

	test('zona horària: a les 00:30 de Madrid (23:30 UTC) "avui" ja és el dia nou', async ({
		page
	}) => {
		await page.clock.setFixedTime(new Date('2025-12-31T23:30:00Z'));
		await gotoHydrated(page, `/ca/app/registrar?cim=${CIM.montcau.slug}`);
		const data = campData(page.locator('main'));
		await expect(data).toHaveValue('2026-01-01');
		await expect(data).toHaveAttribute('max', '2026-01-01');
	});

	test('diversos errors: el focus va al primer (el cim), no a la data', async ({ page }) => {
		await page.clock.setFixedTime(new Date('2026-03-10T11:00:00Z'));
		await gotoHydrated(page, '/ca/app/registrar');
		const main = page.locator('main');
		await campData(main).fill('2030-01-01');
		await botoRegistrar(main).click();
		await expect(combobox(main)).toBeFocused();
		await expect(main.locator('.resum li')).toHaveText([
			'Tria un cim de la llista.',
			'La data no pot ser posterior a avui.'
		]);
	});

	test('nota: el camp no admet més de 500 caràcters i el comptador ho reflecteix', async ({
		page
	}) => {
		await gotoHydrated(page, `/ca/app/registrar?cim=${CIM.montcau.slug}`);
		const main = page.locator('main');
		const nota = campNota(main);
		await expect(nota).toHaveAttribute('maxlength', '500');
		await nota.fill('a'.repeat(501));
		const valor = await nota.inputValue();
		if (valor.length > 500) {
			// Si el navegador deixa passar els 501, la validació ha de parar-ho al costat del camp
			await botoRegistrar(main).click();
			await expect(nota).toBeFocused();
			await expect(nota).toHaveAccessibleDescription(/500 caràcters com a màxim/);
			expect(await filesBd(page)).toHaveLength(0);
		} else {
			expect(valor).toHaveLength(500);
			await expect(main.getByText('500 de 500 caràcters')).toBeVisible();
			await botoRegistrar(main).click();
			await expect(page).toHaveURL('/ca/app');
		}
	});

	test('nota > 500 injectada (sense maxlength): error al costat del camp i focus', async ({
		page
	}) => {
		await gotoHydrated(page, `/ca/app/registrar?cim=${CIM.montcau.slug}`);
		const main = page.locator('main');
		const nota = campNota(main);
		// Simula un navegador/teclat que no respecta maxlength (p. ex. IME o autocompletar)
		await nota.evaluate((el) => el.removeAttribute('maxlength'));
		await nota.fill('b'.repeat(501));
		await expect(main.getByText('501 de 500 caràcters')).toBeVisible();
		await botoRegistrar(main).click();
		await expect(nota).toBeFocused();
		await expect(nota).toHaveAttribute('aria-invalid', 'true');
		await expect(nota).toHaveAccessibleDescription(/La nota pot tenir 500 caràcters com a màxim\./);
		expect(await filesBd(page)).toHaveLength(0);
	});
});

test.describe('Avisos no bloquejants', () => {
	const avisos = (page: Page) => page.locator('main .avisos');

	test('La Picossa: avís dins del període 15/01–15/06 (límits inclosos) i no fora', async ({
		page
	}) => {
		await gotoHydrated(page, `/ca/app/registrar?cim=${CIM.picossa.slug}`);
		const main = page.locator('main');
		const data = campData(main);
		const RE = /Aquest dia hi havia una restricció d'accés al cim/;
		for (const [d, dins] of [
			['2025-03-01', true],
			['2025-01-15', true],
			['2025-06-15', true],
			['2025-01-14', false],
			['2025-06-16', false],
			['2025-08-20', false]
		] as const) {
			await data.fill(d);
			if (dins) await expect(avisos(page), d).toContainText(RE);
			else await expect(avisos(page).getByText(RE), d).toHaveCount(0);
		}
		// No bloqueja: es desa dins del període
		await data.fill('2025-03-01');
		await botoRegistrar(main).click();
		await expect(page).toHaveURL('/ca/app');
		expect(await filesBd(page)).toHaveLength(1);
	});

	test('Sant Salvador de les Espases: avís de restricció "incerta"', async ({ page }) => {
		await gotoHydrated(page, `/ca/app/registrar?cim=${CIM.santSalvador.slug}`);
		await campData(page.locator('main')).fill('2024-10-12');
		await expect(avisos(page)).toContainText(
			/té una restricció d'accés sense dates conegudes: comprova si aquest dia hi entrava/
		);
		await botoRegistrar(page.locator('main')).click();
		await expect(page).toHaveURL('/ca/app');
	});

	test('repetició del mateix cim: avís i toast "no suma" (sense +1)', async ({ page }) => {
		await sembrar(page, [{ cimId: CIM.pedraforca.id, data: '2024-08-10' }], FITXA_PEDRAFORCA);
		await page.locator('main').getByRole('link', { name: 'Registrar aquest cim' }).click();
		const full = sheetRegistre(page);
		await expect(full.locator('.avisos')).toContainText(
			/Ja tens aquest cim registrat \(10 d.agost de?l? 2024\)/
		);
		await botoRegistrar(full).click();
		await expect(full).toBeHidden();
		const t = toast(page, 'Desat: Pedraforca. No suma per al repte.');
		await expect(t).toBeVisible();
		await expect(t.locator('.delta')).toHaveCount(0);
		await expect(t).toContainText('1/100');
		expect(await filesBd(page)).toHaveLength(2);
	});

	test('més de 100 cims nous en un any: avís del límit anual (sembrat important un JSON)', async ({
		page
	}) => {
		// 100 cims diferents el 2025 (sense el Pedraforca)
		const ids = Array.from({ length: 102 }, (_, i) => i + 1)
			.filter((id) => id !== CIM.pedraforca.id)
			.slice(0, 100);
		const files: FilaSembra[] = ids.map((cimId, i) => ({
			cimId,
			data: `2025-${String((i % 12) + 1).padStart(2, '0')}-10`
		}));
		await gotoHydrated(page, '/ca/app/compte');
		await page.locator('input[type=file]').setInputFiles({
			name: 'seed.json',
			mimeType: 'application/json',
			buffer: Buffer.from(JSON.stringify(fitxerExportacio(files)))
		});
		// WebKit sota càrrega (3 projectes en paral·lel) pot trigar > 5 s a importar-ne 100
		await expect(toast(page, /Importació feta\. Noves: 100\./)).toBeVisible({ timeout: 20_000 });

		await gotoHydrated(page, `/ca/app/registrar?cim=${CIM.pedraforca.slug}`);
		const main = page.locator('main');
		const RE = /el 2025 tindries 101 cims nous: la FEEC en valida 100 per any com a màxim/;
		await campData(main).fill('2025-11-20');
		await expect(avisos(page)).toContainText(RE);
		// Un altre any: cap avís de límit
		await campData(main).fill('2024-11-20');
		await expect(avisos(page).getByText(/cims nous/)).toHaveCount(0);
		// No bloqueja
		await campData(main).fill('2025-11-20');
		await botoRegistrar(main).click();
		await expect(page).toHaveURL('/ca/app');
		expect(await filesBd(page)).toHaveLength(101);
	});

	test('repetir un cim del mateix any amb 100 cims no dispara el límit anual', async ({ page }) => {
		const files: FilaSembra[] = Array.from({ length: 100 }, (_, i) => ({
			cimId: i + 1,
			data: '2025-05-05'
		}));
		await sembrar(page, files, '/ca/app/registrar?cim=el-cogullo-de-cabra');
		await campData(page.locator('main')).fill('2025-06-06');
		await expect(avisos(page)).toContainText(/Ja tens aquest cim registrat/);
		await expect(avisos(page).getByText(/cims nous/)).toHaveCount(0);
	});
});

test.describe('Desfés, persistència i moviment', () => {
	test('Desfés d’una alta la deixa com a làpida i el carnet torna a 0', async ({ page }) => {
		await gotoHydrated(page, '/ca/app');
		await expect(page.getByRole('heading', { name: 'Registra el teu primer cim' })).toBeVisible();
		const full = await obrirFullNav(page);
		await triarCim(full, 'montcau', 'Montcau');
		await botoRegistrar(full).click();
		const t = toast(page, 'Segellat: Montcau.');
		await expect(t).toBeVisible();
		await expect.poll(() => comptador(page)).toBe('1/100');
		await t.getByRole('button', { name: 'Desfés' }).click();
		await expect(toast(page, 'Desfet')).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Registra el teu primer cim' })).toBeVisible();
		await expect.poll(() => comptador(page)).toBe('0/100');
		const files = await filesBd(page);
		expect(files).toHaveLength(1);
		expect(files[0].deletedAt).not.toBeNull();
		// Persisteix desfet després de recarregar
		await page.reload();
		await expect(page.getByRole('heading', { name: 'Registra el teu primer cim' })).toBeVisible();
	});

	// Bloc 4b: la llista "Últimes ascensions" de /app l'ha substituïda el carnet de segells.
	test('/ca/app mostra el progrés, els segells en ordre i l’últim segell després de recarregar', async ({
		page
	}) => {
		await sembrar(page, [
			{ cimId: CIM.pedraforca.id, data: '2024-08-10' },
			{ cimId: CIM.montcau.id, data: '2025-02-01' },
			{ cimId: CIM.matagalls.id, data: '2023-05-01' },
			{ cimId: CIM.canigo.id, data: '2022-07-01' }
		]);
		await expect.poll(() => comptador(page)).toBe('4/100');
		const segells = page.getByRole('list', { name: 'Caselles de la pàgina I' }).getByRole('button');
		await expect(segells).toHaveCount(4);
		const noms = await segells.evaluateAll((bs) =>
			bs.map((b) => /^Casella \d+: (.+), [^,]+$/.exec(b.getAttribute('aria-label') ?? '')?.[1])
		);
		expect(noms).toEqual(['Canigó', 'Matagalls', 'Pedraforca', 'Montcau']);
		await expect(page.getByRole('region', { name: 'Progrés del repte' })).toContainText(
			'Últim segell: Montcau'
		);
	});

	test('prefers-reduced-motion: el segell del toast no s’anima', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await gotoHydrated(page, `/ca/app/registrar?cim=${CIM.montcau.slug}`);
		await botoRegistrar(page.locator('main')).click();
		const t = toast(page, 'Segellat: Montcau.');
		await expect(t).toBeVisible();
		const anim = await t.locator('.stamp-ic').evaluate((el) => getComputedStyle(el).animationName);
		expect(anim).toBe('none');
		expect(await t.locator('.delta').evaluate((el) => getComputedStyle(el).animationName)).toBe(
			'none'
		);
	});

	test('sense reduced-motion el segell sí que s’anima (control)', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'no-preference' });
		await gotoHydrated(page, `/ca/app/registrar?cim=${CIM.montcau.slug}`);
		await botoRegistrar(page.locator('main')).click();
		const t = toast(page, 'Segellat: Montcau.');
		await expect(t).toBeVisible();
		expect(
			await t.locator('.stamp-ic').evaluate((el) => getComputedStyle(el).animationName)
		).not.toBe('none');
	});
});

test.describe('Idioma: registre en castellà', () => {
	test('/es: full "Registrar una ascensión", toast "Sellada" i historial en castellà', async ({
		page
	}) => {
		await gotoHydrated(page, '/es/cimas');
		const full = await obrirFullNav(page, 'es');
		await expect(full.getByRole('combobox', { name: 'Cima' })).toBeVisible();
		await botoRegistrar(full).click();
		await expect(full.getByText('Revisa el formulario:')).toBeVisible();
		await triarCim(full, 'pollego', 'Pedraforca');
		await full.getByRole('radio', { name: 'A pie' }).check();
		await botoRegistrar(full).click();
		await expect(toast(page, 'Sellada: Pedraforca.')).toBeVisible();
		await expect(toast(page, 'Sellada').getByRole('button', { name: 'Deshacer' })).toBeVisible();
		await gotoHydrated(page, '/es/app/historial');
		await expect(page.locator('html')).toHaveAttribute('lang', 'es');
		await expect(page.locator('main')).toContainText('A pie');
		await expect(page.getByRole('button', { name: /^Edita|^Editar/ }).first()).toBeVisible();
	});
});

test.describe('Rendiment: Dexie només es baixa en obrir el registre', () => {
	/** Registra quines respostes JS contenen Dexie (per contingut, independent del hash). */
	function vigilaDexie(page: Page) {
		const urls: string[] = [];
		const pendents: Promise<void>[] = [];
		page.on('response', (r: Response) => {
			if (!/\.js(\?|$)/.test(r.url())) return;
			pendents.push(
				r
					.text()
					.then((t) => {
						if (t.includes('DatabaseClosedError')) urls.push(r.url());
					})
					.catch(() => {})
			);
		});
		return {
			urls: async () => {
				await Promise.all(pendents);
				return urls;
			}
		};
	}

	for (const url of ['/ca', FITXA_PEDRAFORCA, '/ca/cims']) {
		test(`${url} no descarrega Dexie abans de cap interacció; sí en obrir el registre`, async ({
			page
		}) => {
			const dexie = vigilaDexie(page);
			await gotoHydrated(page, url);
			// Més que el retard de la precàrrega (3 s): sense interacció no s'ha de demanar mai
			await page.waitForTimeout(4500);
			expect(await dexie.urls(), 'Dexie abans d’interactuar').toEqual([]);

			await mainNav(page).getByRole('link', { name: 'Registrar una ascensió' }).click();
			await expect(botoRegistrar(sheetRegistre(page))).toBeVisible();
			await expect.poll(async () => (await dexie.urls()).length).toBeGreaterThan(0);
		});
	}

	test('precàrrega: amb la pàgina carregada i una interacció, el registre funciona offline', async ({
		page,
		context,
		consoleGuard
	}) => {
		// Offline, SvelteKit intenta precarregar la ruta /app/registrar en tocar l'enllaç
		// (data-sveltekit-preload-data="hover") i ho registra a la consola; no afecta el full.
		consoleGuard.allow(
			/Failed to load resource|Failed to fetch dynamically imported module|Importing a module script failed|ERR_INTERNET_DISCONNECTED|Load failed/i
		);
		const dexie = vigilaDexie(page);
		await gotoHydrated(page, FITXA_PEDRAFORCA);
		await expectBdBuida(page);
		expect(await dexie.urls()).toEqual([]);
		// Primera interacció (keydown a la finestra) → precàrrega en reposo al cap de ~3 s
		await page.keyboard.press('Shift');
		await expect
			.poll(async () => (await dexie.urls()).length, { timeout: 15_000 })
			.toBeGreaterThan(0);
		await settleAnimations(page);

		await context.setOffline(true);
		await expect(page.getByText(/Sense connexió/)).toBeVisible();
		await page.locator('main').getByRole('link', { name: 'Registrar aquest cim' }).click();
		const full = sheetRegistre(page);
		await expect(full.getByRole('button', { name: 'Canvia el cim (Pedraforca)' })).toBeVisible();
		await botoRegistrar(full).click();
		await expect(full).toBeHidden();
		await expect(toast(page, 'Segellat: Pedraforca.')).toBeVisible();
		const files = await filesBd(page);
		expect(files).toHaveLength(1);
		expect(files[0]).toMatchObject({ cimId: CIM.pedraforca.id, deletedAt: null });
		await context.setOffline(false);
	});

	test('sense precàrrega i offline: error visible amb "Torna-ho a provar" (no un full buit)', async ({
		page,
		context,
		consoleGuard
	}) => {
		consoleGuard.allow(
			/Failed to (load resource|fetch dynamically imported module)|Importing a module script failed|ERR_INTERNET_DISCONNECTED|Load failed|error loading dynamically imported module/i
		);
		await gotoHydrated(page, '/ca/cims');
		// Sense cap interacció prèvia: el formulari no s'ha precarregat
		await context.setOffline(true);
		await mainNav(page).getByRole('link', { name: 'Registrar una ascensió' }).click();
		const full = sheetRegistre(page);
		await expect(full).toBeVisible();
		const alerta = full.getByRole('alert');
		await expect(alerta).toContainText("No s'ha pogut carregar el formulari");
		const reintenta = alerta.getByRole('button', { name: 'Torna-ho a provar' });
		await expect(reintenta).toBeVisible();
		// Reintentar encara offline: continua l'error i el focus queda al botó
		await reintenta.click();
		await expect(
			full.getByRole('alert').getByRole('button', { name: 'Torna-ho a provar' })
		).toBeFocused();
		await context.setOffline(false);
	});
});
