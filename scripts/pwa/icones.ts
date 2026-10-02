/**
 * Icones de la PWA a partir del logo (segell del carnet, `src/lib/ui/Logo.svelte`).
 *
 *   npm run pwa:icones
 *
 * Genera a `static/` (reproducible: mateix SVG d'entrada → mateixos PNG):
 *   - icons/icon-192.png, icons/icon-512.png       · `purpose: any` (paper arrodonit + segell)
 *   - icons/maskable-512.png                       · `purpose: maskable` (a sang; segell dins
 *                                                    la zona segura del 80 %)
 *   - icons/monochrome-512.png                     · `purpose: monochrome` (només alfa)
 *   - apple-touch-icon.png (180)                   · iOS hi arrodoneix les cantonades
 *   - favicon.ico (32 + 48, PNG dins ICO)          · traç més gruixut per a mides petites
 *
 * Colors: tokens Segells del tema clar (`--c-paper`, `--c-stamp`), com el `favicon.svg`.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ARREL = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const STATIC = join(ARREL, 'static');

/** Tokens (src/lib/ui/styles/tokens.css, tema clar). */
const PAPER = '#f6f2e9';
const SEGELL = '#c0392b';

/** Geometria del logo (viewBox 24×24): mateixos elements que `Logo.svelte`. */
const RADI_EXTERIOR = 10.8;
const RADI_INTERIOR = 8.4;
const MUNTANYA = 'M6.2 15.8 10 9.6l2.2 3.4 1.6-2.2 4 5z';

interface OpcionsIcona {
	/** Costat en píxels. */
	mida: number;
	/** Fons: quadrat arrodonit (any), quadrat a sang (maskable/apple) o cap (monocrom). */
	fons: 'arrodonit' | 'sang' | 'cap';
	/** Diàmetre exterior del segell (amb el traç) respecte del costat. */
	escala: number;
	color: string;
	/** Gruix del traç en unitats del viewBox 24 (el logo fa servir 1,5). */
	gruix?: number;
	/** L'anell discontinu es perd a mides petites: es pot ometre. */
	anell?: boolean;
	/** Ampliació de la muntanya respecte del seu centre (mides petites). */
	muntanya?: number;
}

/** SVG d'una icona (sense dependre de cap font: només geometria). */
export function svgIcona({
	mida,
	fons,
	escala,
	color,
	gruix = 1.5,
	anell = true,
	muntanya = 1
}: OpcionsIcona): string {
	const diametre = 2 * RADI_EXTERIOR + gruix;
	const k = (escala * mida) / diametre;
	const c = mida / 2;
	const fonsSvg =
		fons === 'sang'
			? `<rect width="${mida}" height="${mida}" fill="${PAPER}"/>`
			: fons === 'arrodonit'
				? `<rect x="${mida * 0.04}" y="${mida * 0.04}" width="${mida * 0.92}" height="${mida * 0.92}" rx="${mida * 0.2}" fill="${PAPER}"/>`
				: '';
	const anellSvg = anell
		? `<circle cx="12" cy="12" r="${RADI_INTERIOR}" stroke-dasharray="1.2 1.4"/>`
		: '';
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${mida}" height="${mida}" viewBox="0 0 ${mida} ${mida}">${fonsSvg}<g transform="translate(${c} ${c}) scale(${k}) translate(-12 -12)" fill="none" stroke="${color}" stroke-width="${gruix}"><circle cx="12" cy="12" r="${RADI_EXTERIOR}"/>${anellSvg}<path d="${MUNTANYA}" fill="${color}" stroke="none"${muntanya === 1 ? '' : ` transform="translate(12 12.7) scale(${muntanya}) translate(-12 -12.7)"`}/></g></svg>`;
}

async function png(opcions: OpcionsIcona): Promise<Buffer> {
	return sharp(Buffer.from(svgIcona(opcions)))
		.png({ compressionLevel: 9, adaptiveFiltering: true })
		.toBuffer();
}

/** Contenidor ICO amb imatges PNG (suportat per tots els navegadors actuals). */
export function ico(imatges: Array<{ mida: number; png: Buffer }>): Buffer {
	const capcalera = Buffer.alloc(6);
	capcalera.writeUInt16LE(0, 0);
	capcalera.writeUInt16LE(1, 2);
	capcalera.writeUInt16LE(imatges.length, 4);
	const entrades: Buffer[] = [];
	let offset = 6 + 16 * imatges.length;
	for (const { mida, png: dades } of imatges) {
		const e = Buffer.alloc(16);
		e.writeUInt8(mida >= 256 ? 0 : mida, 0);
		e.writeUInt8(mida >= 256 ? 0 : mida, 1);
		e.writeUInt8(0, 2);
		e.writeUInt8(0, 3);
		e.writeUInt16LE(1, 4);
		e.writeUInt16LE(32, 6);
		e.writeUInt32LE(dades.length, 8);
		e.writeUInt32LE(offset, 12);
		offset += dades.length;
		entrades.push(e);
	}
	return Buffer.concat([capcalera, ...entrades, ...imatges.map((i) => i.png)]);
}

async function escriu(relatiu: string, dades: Buffer | string) {
	const desti = join(STATIC, relatiu);
	await mkdir(dirname(desti), { recursive: true });
	await writeFile(desti, dades);
	console.log(`  static/${relatiu.replaceAll('\\', '/')} (${dades.length} B)`);
}

async function main() {
	console.log('Icones PWA:');
	for (const mida of [192, 512]) {
		await escriu(
			`icons/icon-${mida}.png`,
			await png({ mida, fons: 'arrodonit', escala: 0.74, color: SEGELL })
		);
	}
	// Zona segura del maskable: cercle de radi 0,4 × costat (diàmetre 80 %). El segell en fa el 66 %.
	await escriu(
		'icons/maskable-512.png',
		await png({ mida: 512, fons: 'sang', escala: 0.66, color: SEGELL })
	);
	// Monocrom: el sistema només en fa servir l'alfa i el tenyeix amb el color del tema.
	await escriu(
		'icons/monochrome-512.png',
		await png({ mida: 512, fons: 'cap', escala: 0.66, color: '#ffffff' })
	);
	await escriu(
		'apple-touch-icon.png',
		await png({ mida: 180, fons: 'sang', escala: 0.72, color: SEGELL })
	);
	// Favicon: a 32/48 px l'anell discontinu fa soroll: sense anell, traç més gruixut i muntanya
	// més gran perquè es llegeixi.
	const petites = await Promise.all(
		[32, 48].map(async (mida) => ({
			mida,
			png: await png({
				mida,
				fons: 'arrodonit',
				escala: 0.86,
				color: SEGELL,
				gruix: 2.2,
				anell: false,
				muntanya: 1.3
			})
		}))
	);
	await escriu('favicon.ico', ico(petites));
}

await main();
