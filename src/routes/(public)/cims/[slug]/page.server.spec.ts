import { afterEach, describe, expect, it, vi } from 'vitest';
import { LOCALES, localizeCimPath, type AppLocale } from '$lib/i18n/routes';
import { CIMS } from '$lib/data/catalog';
import * as fitxes from '$lib/content/fitxes';
import { totsElsContingutsFitxa, type ContingutFitxa } from '$lib/content/fitxes';
import { load } from './+page.server';

// Doble del mòdul de contingut: per defecte és el real (passa tot a l'original); el test de
// "cim sense contingut" fa que `contingutFitxa` torni `undefined`, de manera que no depèn de quins
// cims tenen fitxa avui (amb les 150 fitxes publicades ja no n'hi ha cap sense).
vi.mock('$lib/content/fitxes', async (importOriginal) => {
	const original = await importOriginal<typeof import('$lib/content/fitxes')>();
	return { ...original, contingutFitxa: vi.fn(original.contingutFitxa) };
});
const { contingutFitxa: realContingutFitxa } =
	await vi.importActual<typeof import('$lib/content/fitxes')>('$lib/content/fitxes');

/** Textos propis d'un idioma (els que el `__data.json` de l'altre idioma no pot portar). */
function textos(c: ContingutFitxa, l: AppLocale): string[] {
	return [
		...c.descripcio[l],
		...c.rutes.flatMap((r) => [r.nom[l], r.descripcio[l]]),
		...(c.consells?.[l] ?? []),
		...(c.faq?.[l] ?? []).flatMap((f) => [f.pregunta, f.resposta])
	];
}

/** Dades que serialitza el `load` del servidor (inline a l'HTML i a `__data.json`). */
function dadesSerialitzades(slug: string, locale: AppLocale): string {
	const url = new URL(`https://carnetdecims.cat${localizeCimPath(slug, locale)}`);
	const dades = (load as unknown as (e: unknown) => unknown)({ params: { slug }, url });
	return JSON.stringify(dades);
}

describe('load de la fitxa: contingut només en l’idioma de la pàgina', () => {
	const continguts = totsElsContingutsFitxa();

	it('hi ha fitxes amb contingut per provar', () => {
		expect(continguts.length).toBeGreaterThan(0);
	});

	it.each(continguts.map((c) => [c.slug, c] as const))('%s', (slug, c) => {
		for (const locale of LOCALES) {
			const altre = LOCALES.find((l) => l !== locale)!;
			const json = dadesSerialitzades(slug, locale);
			const propis = new Set(textos(c, locale));
			// Els textos de l'altre idioma (els que no són idèntics en tots dos) no hi són.
			for (const t of textos(c, altre).filter((t) => t.trim() && !propis.has(t))) {
				expect(json.includes(JSON.stringify(t).slice(1, -1)), `${locale}/${slug}: ${t}`).toBe(
					false
				);
			}
			// I els de l'idioma de la pàgina, sí.
			expect(json).toContain(JSON.stringify(c.descripcio[locale][0]).slice(1, -1));
			expect(json).toContain(`"locale":"${locale}"`);
		}
	});

	describe('cim sense contingut editorial (doble de `contingutFitxa`)', () => {
		afterEach(() => vi.mocked(fitxes.contingutFitxa).mockImplementation(realContingutFitxa));

		it.each(LOCALES)('(%s) → contingut null, sense dificultat i no indexable', (locale) => {
			// Un cim qualsevol del catàleg: el doble el fa passar per "encara sense fitxa".
			const slug = CIMS[0]!.slug;
			vi.mocked(fitxes.contingutFitxa).mockImplementation(() => undefined);
			expect(JSON.parse(dadesSerialitzades(slug, locale))).toEqual({
				contingut: null,
				dificultat: null,
				dificultatRutes: {},
				indexable: false
			});
			expect(fitxes.contingutFitxa).toHaveBeenCalledWith(slug);
		});

		it('el doble no filtra als altres tests: amb el mòdul real, el mateix cim torna a tenir contingut', () => {
			const slug = CIMS[0]!.slug;
			const dades = JSON.parse(dadesSerialitzades(slug, 'ca')) as { contingut: unknown };
			expect(dades.contingut).not.toBeNull();
		});

		it('slug que no és al catàleg ni té fitxa → contingut null i no indexable', () => {
			expect(JSON.parse(dadesSerialitzades('cim-que-no-existeix', 'ca'))).toEqual({
				contingut: null,
				dificultat: null,
				dificultatRutes: {},
				indexable: false
			});
		});
	});
});
