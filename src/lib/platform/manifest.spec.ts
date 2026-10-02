import { existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { LOCALES } from '$lib/i18n/routes';
import { CAPTURES, COLOR_TEMA, manifestPath, webManifest } from './manifest';

const STATIC = join(process.cwd(), 'static');

describe('webManifest', () => {
	it.each(LOCALES)('%s: camps bàsics i start_url de l’idioma', (locale) => {
		const mf = webManifest(locale);
		expect(mf.name).toBe('Carnet de Cims');
		expect(mf.short_name).toBe('Carnet de Cims');
		expect(mf.lang).toBe(locale);
		expect(mf.start_url).toBe(`/${locale}/app?source=pwa`);
		expect(mf.scope).toBe('/');
		expect(mf.display).toBe('standalone');
		expect(mf.theme_color).toBe(COLOR_TEMA);
		expect(mf.background_color).toBe(COLOR_TEMA);
		expect(mf.description.length).toBeGreaterThan(30);
		// Marca: "100 Cims" només com a descriptor, mai com a nom.
		expect(mf.name).not.toMatch(/100 Cims/);
	});

	it('el mateix id en tots dos idiomes (una sola app)', () => {
		expect(new Set(LOCALES.map((l) => webManifest(l).id)).size).toBe(1);
	});

	it('icones any 192/512, maskable i monochrome', () => {
		const { icons } = webManifest('ca');
		const per = (purpose: string) => icons.filter((i) => i.purpose === purpose);
		expect(per('any').map((i) => i.sizes)).toEqual(['192x192', '512x512']);
		expect(per('maskable')).toHaveLength(1);
		expect(per('monochrome')).toHaveLength(1);
	});

	it('dreceres localitzades', () => {
		expect(webManifest('ca').shortcuts.map((s) => s.url)).toEqual([
			'/ca/app/registrar?source=pwa-drecera',
			'/ca/mapa?source=pwa-drecera',
			'/ca/app/a-prop?source=pwa-drecera',
			'/ca/app?source=pwa-drecera'
		]);
		expect(webManifest('es').shortcuts.map((s) => s.url)).toEqual([
			'/es/app/registrar?source=pwa-drecera',
			'/es/mapa?source=pwa-drecera',
			'/es/app/cerca?source=pwa-drecera',
			'/es/app?source=pwa-drecera'
		]);
		expect(webManifest('es').shortcuts[0].name).toBe('Registrar ascensión');
	});

	it('captures narrow i wide amb una proporció acceptada (≤ 2,3)', () => {
		const { screenshots } = webManifest('es');
		expect(screenshots.map((s) => s.form_factor)).toEqual(['narrow', 'wide']);
		for (const { amplada, alcada } of Object.values(CAPTURES)) {
			expect(Math.max(amplada, alcada) / Math.min(amplada, alcada)).toBeLessThanOrEqual(2.3);
		}
	});

	it('manifestPath', () => {
		expect(manifestPath('es')).toBe('/manifest-es.webmanifest');
	});
});

describe('fitxers de static/ referenciats pel manifest', () => {
	it.each(LOCALES)('%s: icones i captures existeixen amb la mida declarada', async (locale) => {
		const mf = webManifest(locale);
		for (const img of [...mf.icons, ...mf.screenshots]) {
			const fitxer = join(STATIC, img.src);
			expect(existsSync(fitxer), img.src).toBe(true);
			const { width, height } = await sharp(fitxer).metadata();
			expect(`${width}x${height}`, img.src).toBe(img.sizes);
		}
	});

	it('apple-touch-icon (180) i favicon.ico', async () => {
		const { width } = await sharp(join(STATIC, 'apple-touch-icon.png')).metadata();
		expect(width).toBe(180);
		expect(existsSync(join(STATIC, 'favicon.ico'))).toBe(true);
	});
});
