import { readFileSync } from 'node:fs';
import { test, expect } from './fixtures';

/**
 * Recorregut lleuger de TOTES les fitxes de cim del build (ca + es), sense render al navegador:
 * status 200, `<html lang>`, H1 = "{nom} ({alt} m)" i `<title>` ≤ 60 caràcters (docs/02 §4.1).
 * Només corre a `desktop-chrome`: fa servir `request`, el dispositiu no hi influeix.
 */

const CIMS: { slug: string; nom: string; altitud: number }[] = JSON.parse(
	readFileSync(new URL('../src/lib/data/catalog/cims.json', import.meta.url), 'utf8')
);

/** H1 de la fitxa (docs/02 §4.1), amb l'altitud com `formatAltitude`: "Pica d'Estats (3.143 m)". */
const h1Cim = (c: { nom: string; altitud: number }) =>
	`${c.nom} (${String(Math.round(c.altitud)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} m)`;

const decode = (s: string) =>
	s
		.replace(/<!--.*?-->/gs, '')
		.replace(/<[^>]+>/g, '')
		.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
		.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/\s+/g, ' ')
		.trim();

test('les 300 fitxes (150 × ca/es) responen 200 amb H1 i <title> ≤ 60', async ({
	request
}, testInfo) => {
	test.skip(testInfo.project.name !== 'desktop-chrome', 'Una sola passada n’hi ha prou');
	test.setTimeout(180_000);

	const urls = CIMS.flatMap((c) => [
		{ url: `/ca/cims/${c.slug}`, lang: 'ca', nom: h1Cim(c) },
		{ url: `/es/cimas/${c.slug}`, lang: 'es', nom: h1Cim(c) }
	]);
	expect(urls).toHaveLength(300);

	const errors: string[] = [];
	const LOT = 20;
	for (let i = 0; i < urls.length; i += LOT) {
		await Promise.all(
			urls.slice(i, i + LOT).map(async ({ url, lang, nom }) => {
				const res = await request.get(url, { maxRedirects: 0 });
				if (res.status() !== 200) return errors.push(`${url}: status ${res.status()}`);
				const html = await res.text();
				if (!new RegExp(`<html[^>]*\\slang="${lang}"`).test(html))
					errors.push(`${url}: <html lang> no és ${lang}`);
				const h1s = [...html.matchAll(/<h1\b[^>]*>(.*?)<\/h1>/gs)].map((m) => decode(m[1]));
				if (h1s.length !== 1) errors.push(`${url}: ${h1s.length} H1`);
				else if (h1s[0] === '') errors.push(`${url}: H1 buit`);
				else if (h1s[0] !== nom) errors.push(`${url}: H1 "${h1s[0]}" ≠ "${nom}"`);
				const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1] ?? '');
				if (title === '') errors.push(`${url}: <title> buit`);
				else if (title.length > 60) errors.push(`${url}: <title> de ${title.length} (${title})`);
			})
		);
	}
	expect(errors).toEqual([]);
});

/**
 * Noms llargs (una sola paraula a l'H1 en lletra ampla) poden forçar l'amplada de la targeta.
 * També: l'H1 no parteix paraules, fa com a màxim 3 línies a 320 px i no toca el segell.
 */
const MAX_LINIES_320 = 3;
for (const width of [320, 375, 768, 1280]) {
	test(`cap fitxa (ca) desborda ni xoca amb el segell a ${width} px`, async ({
		page
	}, testInfo) => {
		test.skip(testInfo.project.name !== 'desktop-chrome', 'Una sola passada n’hi ha prou');
		test.setTimeout(300_000);
		// Els mapes WMS externs no hi influeixen (la mida de la imatge és fixa per CSS)
		const png = Buffer.from(
			'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
			'base64'
		);
		await page.route(/geoserveis\.icgc\.cat|data\.geopf\.fr/, (r) =>
			r.fulfill({ status: 200, contentType: 'image/png', body: png })
		);
		await page.setViewportSize({ width, height: 700 });
		const desborden: string[] = [];
		const paraulesPartides: string[] = [];
		const massaLinies: string[] = [];
		const xocSegell: string[] = [];
		for (const { slug } of CIMS) {
			await page.goto(`/ca/cims/${slug}`, { waitUntil: 'load' });
			await page.evaluate(() => document.fonts.ready);
			const { px, partides, linies, xoc } = await page.evaluate(() => {
				// `overflow-wrap: anywhere` evita el desbordament partint paraules: cap paraula de
				// l'H1 ha d'ocupar més d'una línia (la mida s'ajusta a la paraula més llarga).
				// L'H1 és "{nom} <span>({alt} m)</span>": es recorren tots els nodes de text.
				const h1 = document.querySelector('main h1')!;
				const partides: string[] = [];
				const nodes = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
				for (let text = nodes.nextNode(); text; text = nodes.nextNode()) {
					for (const m of text.textContent!.matchAll(/\S+/g)) {
						const r = document.createRange();
						r.setStart(text, m.index!);
						r.setEnd(text, m.index! + m[0].length);
						const linies = new Set([...r.getClientRects()].map((x) => Math.round(x.top)));
						if (linies.size > 1) partides.push(m[0]);
					}
				}
				// Línies de l'H1 i solapament de cada línia amb el segell (cercle inscrit a l'SVG)
				const tot = document.createRange();
				tot.selectNodeContents(h1);
				const rects = [...tot.getClientRects()];
				// Per alçada: l'altitud (més petita) té un altre `top` dins de la mateixa línia.
				const linies = Math.round(
					h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight)
				);
				const segell = document.querySelector('main .stamp svg')?.getBoundingClientRect();
				const xoc =
					!!segell &&
					rects.some(
						(x) =>
							x.right > segell.left &&
							x.left < segell.right &&
							x.bottom > segell.top &&
							x.top < segell.bottom
					);
				return {
					px: document.documentElement.scrollWidth - document.documentElement.clientWidth,
					partides,
					linies,
					xoc
				};
			});
			if (px > 0) desborden.push(`${slug} (+${px} px)`);
			if (partides.length) paraulesPartides.push(`${slug}: ${partides.join(', ')}`);
			if (width === 320 && linies > MAX_LINIES_320) massaLinies.push(`${slug}: ${linies} línies`);
			if (xoc) xocSegell.push(slug);
		}
		expect(desborden).toEqual([]);
		expect(paraulesPartides, 'paraules de l’H1 partides entre línies').toEqual([]);
		expect(massaLinies, `H1 de més de ${MAX_LINIES_320} línies a 320 px`).toEqual([]);
		expect(xocSegell, 'H1 solapat amb el segell d’essencial').toEqual([]);
	});
}
