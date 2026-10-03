import { describe, expect, it } from 'vitest';
import { LOCALES, localizeCimPath, type AppLocale } from '$lib/i18n/routes';
import { totsElsContingutsFitxa, type ContingutFitxa } from '$lib/content/fitxes';
import { load } from './+page.server';

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

	it('cim sense contingut editorial → contingut null i no indexable', () => {
		const json = dadesSerialitzades('balandrau', 'ca');
		expect(JSON.parse(json)).toEqual({ contingut: null, indexable: false });
	});
});
