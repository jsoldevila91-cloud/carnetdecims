/**
 * Peces comunes de les imatges per compartir (carnet R3, ascensió R5): mida 1080×1350 (4:5, el
 * format vertical d'Instagram i WhatsApp), paleta Segells, fonts, paper amb trama, full amb
 * ombra dura, marca (segell de la muntanya) i peu amb el web. Tot es dibuixa al client: no surt
 * res del dispositiu. Els textos arriben ja traduïts; aquí només hi ha dibuix.
 */

export const AMPLE_IMATGE = 1080;
export const ALT_IMATGE = 1350;

/** Paleta Segells, igual que `src/lib/ui/styles/tokens.css`. */
export interface PaletaImatge {
	paper: string;
	dot: string;
	card: string;
	/** Ombra dura i vora del full. */
	ombra: string;
	ink: string;
	ink2: string;
	rule: string;
	stamp: string;
	stampInk: string;
}

export const PALETA_CLARA: PaletaImatge = {
	paper: '#f6f2e9',
	dot: '#e2d9c7',
	card: '#fbf8f1',
	ombra: '#1b2a47',
	ink: '#1b2a47',
	ink2: '#4a5570',
	rule: '#d6cab3',
	stamp: '#c0392b',
	stampInk: '#b3352a'
};

/** Tema fosc ("tinta de nit"). */
export const PALETA_FOSCA: PaletaImatge = {
	paper: '#10172a',
	dot: '#1c2740',
	card: '#1a253d',
	ombra: '#05080f',
	ink: '#f1ebdd',
	ink2: '#b7bdcc',
	rule: '#34405a',
	stamp: '#c0392b',
	stampInk: '#ff8f7e'
};

export type TemaImatge = 'clar' | 'fosc';

export const paletaDe = (tema: TemaImatge): PaletaImatge =>
	tema === 'fosc' ? PALETA_FOSCA : PALETA_CLARA;

/** Tema del sistema (el web no té selector propi: segueix `prefers-color-scheme`). */
export function temaDelSistema(): TemaImatge {
	if (typeof matchMedia !== 'function') return 'clar';
	return matchMedia('(prefers-color-scheme: dark)').matches ? 'fosc' : 'clar';
}

export const FONT_WIDE = '"Archivo Variable", "Archivo", system-ui, sans-serif';
export const FONT_MONO = '"IBM Plex Mono", ui-monospace, monospace';

/** Espera que les fonts del web estiguin carregades (el canvas no les demana sol). */
export async function carregarFontsImatge(): Promise<void> {
	if (typeof document === 'undefined' || !document.fonts) return;
	await Promise.allSettled([
		document.fonts.load(`900 120px ${FONT_WIDE}`),
		document.fonts.load(`700 40px ${FONT_WIDE}`),
		document.fonts.load(`400 28px ${FONT_MONO}`),
		document.fonts.load(`600 28px ${FONT_MONO}`)
	]);
	await document.fonts.ready;
}

export type Ctx = CanvasRenderingContext2D & { fontStretch?: string; letterSpacing?: string };

export function font(ctx: Ctx, pes: number, mida: number, familia: string, ample = false): void {
	ctx.font = `${pes} ${mida}px ${familia}`;
	if ('fontStretch' in ctx) ctx.fontStretch = ample ? 'expanded' : 'normal';
}

export function espaiat(ctx: Ctx, px: number): void {
	if ('letterSpacing' in ctx) ctx.letterSpacing = `${px}px`;
}

/** Talla un text en línies d'amplada màxima `max` (com a molt `maxLinies`, amb "…"). */
export function linies(ctx: Ctx, text: string, max: number, maxLinies: number): string[] {
	const paraules = text.split(/\s+/).filter(Boolean);
	const out: string[] = [];
	let actual = '';
	for (const p of paraules) {
		const prova = actual ? `${actual} ${p}` : p;
		if (ctx.measureText(prova).width <= max || !actual) actual = prova;
		else {
			out.push(actual);
			actual = p;
		}
	}
	if (actual) out.push(actual);
	if (out.length <= maxLinies) return out;
	const tallat = out.slice(0, maxLinies);
	let darrera = tallat[maxLinies - 1];
	while (darrera.length > 1 && ctx.measureText(`${darrera}…`).width > max) {
		darrera = darrera.slice(0, -1);
	}
	tallat[maxLinies - 1] = `${darrera.trimEnd()}…`;
	return tallat;
}

export function rectArrodonit(
	ctx: Ctx,
	x: number,
	y: number,
	w: number,
	h: number,
	r: number
): void {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}

/** Rectangle del full (la "pàgina" del carnet) i marges interiors del text. */
export interface Full {
	fx: number;
	fy: number;
	fw: number;
	fh: number;
	/** Marge esquerre i dret del contingut. */
	x0: number;
	x1: number;
}

/**
 * Prepara el canvas (1080×1350) i hi dibuixa el paper amb trama de punts i el full amb ombra
 * dura. Retorna el context i el rectangle del full, o `null` si no hi ha context 2D.
 */
export function prepararFull(
	canvas: HTMLCanvasElement,
	C: PaletaImatge
): { ctx: Ctx; full: Full } | null {
	canvas.width = AMPLE_IMATGE;
	canvas.height = ALT_IMATGE;
	const ctx = canvas.getContext('2d') as Ctx | null;
	if (!ctx) return null;

	ctx.fillStyle = C.paper;
	ctx.fillRect(0, 0, AMPLE_IMATGE, ALT_IMATGE);
	ctx.fillStyle = C.dot;
	for (let y = 12; y < ALT_IMATGE; y += 24) {
		for (let x = 12; x < AMPLE_IMATGE; x += 24) ctx.fillRect(x, y, 3, 3);
	}

	const fx = 56;
	const fy = 56;
	const fw = AMPLE_IMATGE - fx * 2 - 10;
	const fh = ALT_IMATGE - fy * 2 - 10;
	ctx.fillStyle = C.ombra;
	rectArrodonit(ctx, fx + 12, fy + 12, fw, fh, 16);
	ctx.fill();
	ctx.fillStyle = C.card;
	rectArrodonit(ctx, fx, fy, fw, fh, 16);
	ctx.fill();
	ctx.lineWidth = 4;
	ctx.strokeStyle = C.ink;
	ctx.stroke();

	return { ctx, full: { fx, fy, fw, fh, x0: fx + 48, x1: fx + fw - 48 } };
}

/** Marca del web (mateix dibuix que `Logo.svelte`, viewBox 24): segell amb una muntanya. */
export function marca(ctx: Ctx, x: number, y: number, mida: number, color: string): void {
	const k = mida / 24;
	ctx.save();
	ctx.translate(x, y);
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.lineWidth = 1.5 * k;
	ctx.beginPath();
	ctx.arc(12 * k, 12 * k, 10.8 * k, 0, Math.PI * 2);
	ctx.stroke();
	ctx.setLineDash([1.2 * k, 1.4 * k]);
	ctx.beginPath();
	ctx.arc(12 * k, 12 * k, 8.4 * k, 0, Math.PI * 2);
	ctx.stroke();
	ctx.setLineDash([]);
	ctx.beginPath();
	ctx.moveTo(6.2 * k, 15.8 * k);
	ctx.lineTo(10 * k, 9.6 * k);
	ctx.lineTo(12.2 * k, 13 * k);
	ctx.lineTo(13.8 * k, 10.8 * k);
	ctx.lineTo(17.8 * k, 15.8 * k);
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}

/**
 * Capçalera del full: text de l'esquerra (la marca, en majúscules; amb `logo`, precedit del
 * segell del web) i text de la dreta en tinta de segell, sobre una línia puntejada.
 */
export function capcalera(
	ctx: Ctx,
	full: Full,
	C: PaletaImatge,
	textos: { esquerra: string; dreta: string },
	opcions: { logo?: boolean } = {}
): void {
	const { x0, x1, fy } = full;
	let xt = x0;
	if (opcions.logo) {
		marca(ctx, x0, fy + 50, 44, C.stampInk);
		xt = x0 + 60;
	}
	ctx.fillStyle = C.ink;
	ctx.textBaseline = 'alphabetic';
	font(ctx, 600, 30, FONT_MONO);
	espaiat(ctx, 4);
	ctx.textAlign = 'left';
	ctx.fillText(textos.esquerra.toUpperCase(), xt, fy + 84);
	if (textos.dreta) {
		ctx.textAlign = 'right';
		ctx.fillStyle = C.stampInk;
		ctx.fillText(textos.dreta.toUpperCase(), x1, fy + 84);
	}
	espaiat(ctx, 0);
	ctx.strokeStyle = C.rule;
	ctx.lineWidth = 2;
	ctx.setLineDash([10, 8]);
	ctx.beginPath();
	ctx.moveTo(x0, fy + 112);
	ctx.lineTo(x1, fy + 112);
	ctx.stroke();
	ctx.setLineDash([]);
}

/** Peu del full: línia, text de l'esquerra (data…) i el web a la dreta en tinta de segell. */
export function peu(
	ctx: Ctx,
	full: Full,
	C: PaletaImatge,
	textos: { esquerra: string; web: string }
): void {
	const { x0, x1, fy, fh } = full;
	const py = fy + fh - 56;
	ctx.strokeStyle = C.ink;
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(x0, py - 54);
	ctx.lineTo(x1, py - 54);
	ctx.stroke();
	ctx.textBaseline = 'alphabetic';
	font(ctx, 400, 28, FONT_MONO);
	ctx.fillStyle = C.ink2;
	ctx.textAlign = 'left';
	ctx.fillText(textos.esquerra, x0, py);
	font(ctx, 900, 34, FONT_WIDE, true);
	ctx.fillStyle = C.stampInk;
	ctx.textAlign = 'right';
	ctx.fillText(textos.web, x1, py);
}

/** PNG del canvas (o `null` si el navegador no el pot generar). */
export function pngDelCanvas(canvas: HTMLCanvasElement): Promise<Blob | null> {
	return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
}
