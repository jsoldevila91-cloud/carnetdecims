/**
 * Imatge per compartir el carnet (bloc R3): un PNG de 1080×1350 (4:5, el format vertical
 * d'Instagram i WhatsApp) dibuixat al client amb l'estètica Segells. No surt res del dispositiu.
 *
 * Els colors són els del tema clar (`tokens.css`) i fixos: la imatge és la mateixa amb el tema
 * fosc. Els textos arriben ja traduïts (`TextosImatge`); aquí només hi ha dibuix.
 */

export const AMPLE_IMATGE = 1080;
export const ALT_IMATGE = 1350;

/** Paleta Segells (tema clar), igual que `src/lib/ui/styles/tokens.css`. */
const C = {
	paper: '#f6f2e9',
	dot: '#e2d9c7',
	card: '#fbf8f1',
	ink: '#1b2a47',
	ink2: '#4a5570',
	rule: '#d6cab3',
	stamp: '#c0392b',
	stampInk: '#b3352a'
} as const;

const FONT_WIDE = '"Archivo Variable", "Archivo", system-ui, sans-serif';
const FONT_MONO = '"IBM Plex Mono", ui-monospace, monospace';

export interface SegellImatge {
	/** 1..100 dins de la pàgina. */
	casella: number;
	inicials: string;
	essencial: boolean;
	/** Encara no compta (no essencial en espera): tinta blava i anella puntejada. */
	espera: boolean;
	/** Inclinació estable en graus (`inclinacioSegell`). */
	rotacio: number;
}

export interface TextosImatge {
	/** "Carnet de Cims" */
	marca: string;
	/** "Pàgina I" */
	pagina: string;
	/** "Nivell 1×100" o "Sense nivell" */
	nivell: string;
	/** "Essencials: 20/150" */
	essencials: string;
	/** "Medalles" */
	titolMedalles: string;
	/** Noms de les medalles (les més recents primer); buit → `senseMedalles`. */
	medalles: string[];
	senseMedalles: string;
	/** "+3 més" quan n'hi ha més de les que hi caben (o buit). */
	mesMedalles: (n: number) => string;
	/** Data llarga d'avui. */
	data: string;
	/** "carnetdecims.cat" */
	web: string;
}

export interface DadesImatge {
	total: number;
	objectiu: number;
	segells: SegellImatge[];
	textos: TextosImatge;
}

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

type Ctx = CanvasRenderingContext2D & { fontStretch?: string; letterSpacing?: string };

function font(ctx: Ctx, pes: number, mida: number, familia: string, ample = false) {
	ctx.font = `${pes} ${mida}px ${familia}`;
	if ('fontStretch' in ctx) ctx.fontStretch = ample ? 'expanded' : 'normal';
}

function espaiat(ctx: Ctx, px: number) {
	if ('letterSpacing' in ctx) ctx.letterSpacing = `${px}px`;
}

/** Talla un text en línies d'amplada màxima `max` (com a molt `maxLinies`, amb "…"). */
function linies(ctx: Ctx, text: string, max: number, maxLinies: number): string[] {
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

function rectArrodonit(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}

function segell(ctx: Ctx, cx: number, cy: number, mida: number, s: SegellImatge) {
	const color = s.espera ? C.ink : C.stampInk;
	const k = mida / 120; // mateix viewBox que `SegellMini.svelte`
	ctx.save();
	ctx.translate(cx, cy);
	ctx.rotate((s.rotacio * Math.PI) / 180);
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	ctx.lineWidth = 6 * k;
	if (s.espera) ctx.setLineDash([10 * k, 8 * k]);
	ctx.beginPath();
	ctx.arc(0, 0, 54 * k, 0, Math.PI * 2);
	ctx.stroke();
	ctx.setLineDash([]);
	ctx.lineWidth = 2.5 * k;
	ctx.beginPath();
	ctx.arc(0, 0, 43 * k, 0, Math.PI * 2);
	ctx.stroke();
	font(ctx, 900, (s.inicials.length >= 3 ? 30 : 38) * k, FONT_WIDE, true);
	ctx.textAlign = 'center';
	ctx.textBaseline = 'alphabetic';
	ctx.fillText(s.inicials, 0, (s.essencial ? 4 : 12) * k);
	if (s.essencial) {
		ctx.beginPath();
		ctx.moveTo(0, 16 * k);
		ctx.lineTo(7 * k, 23 * k);
		ctx.lineTo(0, 30 * k);
		ctx.lineTo(-7 * k, 23 * k);
		ctx.closePath();
		ctx.fill();
	}
	ctx.restore();
}

function medalla(ctx: Ctx, cx: number, cy: number, r: number) {
	ctx.save();
	ctx.strokeStyle = C.stampInk;
	ctx.fillStyle = C.stampInk;
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(cx - r * 0.7, cy - r * 2);
	ctx.lineTo(cx - r * 0.15, cy - r);
	ctx.moveTo(cx + r * 0.7, cy - r * 2);
	ctx.lineTo(cx + r * 0.15, cy - r);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(cx, cy, r, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = C.card;
	ctx.beginPath();
	for (let i = 0; i < 10; i++) {
		const a = -Math.PI / 2 + (i * Math.PI) / 5;
		const rr = i % 2 === 0 ? r * 0.55 : r * 0.23;
		ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
	}
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}

/** Dibuixa la imatge del carnet a `canvas` (es redimensiona a 1080×1350). */
export function dibuixarImatgeCarnet(canvas: HTMLCanvasElement, dades: DadesImatge): void {
	canvas.width = AMPLE_IMATGE;
	canvas.height = ALT_IMATGE;
	const ctx = canvas.getContext('2d') as Ctx | null;
	if (!ctx) return;
	const { textos } = dades;

	// Paper amb trama de punts.
	ctx.fillStyle = C.paper;
	ctx.fillRect(0, 0, AMPLE_IMATGE, ALT_IMATGE);
	ctx.fillStyle = C.dot;
	for (let y = 12; y < ALT_IMATGE; y += 24) {
		for (let x = 12; x < AMPLE_IMATGE; x += 24) ctx.fillRect(x, y, 3, 3);
	}

	// Full del carnet amb ombra dura.
	const fx = 56;
	const fy = 56;
	const fw = AMPLE_IMATGE - fx * 2 - 10;
	const fh = ALT_IMATGE - fy * 2 - 10;
	ctx.fillStyle = C.ink;
	rectArrodonit(ctx, fx + 12, fy + 12, fw, fh, 16);
	ctx.fill();
	ctx.fillStyle = C.card;
	rectArrodonit(ctx, fx, fy, fw, fh, 16);
	ctx.fill();
	ctx.lineWidth = 4;
	ctx.strokeStyle = C.ink;
	ctx.stroke();

	const x0 = fx + 48;
	const x1 = fx + fw - 48;

	// Capçalera: marca i pàgina.
	ctx.fillStyle = C.ink;
	ctx.textBaseline = 'alphabetic';
	font(ctx, 600, 30, FONT_MONO);
	espaiat(ctx, 4);
	ctx.textAlign = 'left';
	ctx.fillText(textos.marca.toUpperCase(), x0, fy + 84);
	ctx.textAlign = 'right';
	ctx.fillStyle = C.stampInk;
	ctx.fillText(textos.pagina.toUpperCase(), x1, fy + 84);
	espaiat(ctx, 0);
	ctx.strokeStyle = C.rule;
	ctx.lineWidth = 2;
	ctx.setLineDash([10, 8]);
	ctx.beginPath();
	ctx.moveTo(x0, fy + 112);
	ctx.lineTo(x1, fy + 112);
	ctx.stroke();
	ctx.setLineDash([]);

	// Xifra gran "n/100".
	ctx.textAlign = 'left';
	ctx.fillStyle = C.ink;
	font(ctx, 900, 240, FONT_WIDE, true);
	espaiat(ctx, -6);
	const xifra = String(dades.total);
	ctx.fillText(xifra, x0 - 8, fy + 330);
	const ampleXifra = ctx.measureText(xifra).width;
	espaiat(ctx, 0);
	font(ctx, 800, 72, FONT_WIDE, true);
	ctx.fillStyle = C.ink2;
	ctx.fillText(`/${dades.objectiu}`, x0 + ampleXifra + 4, fy + 330);

	// Nivell i essencials.
	font(ctx, 800, 40, FONT_WIDE, true);
	ctx.fillStyle = C.stampInk;
	ctx.fillText(textos.nivell, x0, fy + 402);
	font(ctx, 400, 30, FONT_MONO);
	ctx.fillStyle = C.ink2;
	ctx.fillText(textos.essencials, x0, fy + 450);

	// Mini-graella de la pàgina (10×10).
	const gy = fy + 500;
	const cel = 52;
	const gap = 6;
	const perCasella = new Map(dades.segells.map((s) => [s.casella, s]));
	for (let i = 0; i < 100; i++) {
		const x = x0 + (i % 10) * (cel + gap);
		const y = gy + Math.floor(i / 10) * (cel + gap);
		const s = perCasella.get(i + 1);
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = C.rule;
		if (!s) ctx.setLineDash([5, 4]);
		rectArrodonit(ctx, x, y, cel, cel, 4);
		ctx.stroke();
		ctx.setLineDash([]);
		if (s) segell(ctx, x + cel / 2, y + cel / 2, cel * 0.88, s);
	}
	const ampleGraella = 10 * cel + 9 * gap;

	// Medalles (columna dreta).
	const mx = x0 + ampleGraella + 40;
	const mAmple = x1 - mx;
	ctx.textAlign = 'left';
	ctx.fillStyle = C.ink;
	font(ctx, 600, 26, FONT_MONO);
	espaiat(ctx, 3);
	ctx.fillText(textos.titolMedalles.toUpperCase(), mx, gy + 20);
	espaiat(ctx, 0);
	let my = gy + 76;
	const limitY = gy + ampleGraella;
	if (textos.medalles.length === 0) {
		font(ctx, 400, 26, FONT_WIDE);
		ctx.fillStyle = C.ink2;
		for (const l of linies(ctx, textos.senseMedalles, mAmple, 4)) {
			ctx.fillText(l, mx, my);
			my += 34;
		}
	} else {
		font(ctx, 700, 26, FONT_WIDE);
		let dibuixades = 0;
		for (const nom of textos.medalles) {
			const ls = linies(ctx, nom, mAmple - 44, 2);
			const alt = ls.length * 32 + 22;
			if (my + alt > limitY - 40 && dibuixades < textos.medalles.length) {
				if (dibuixades < textos.medalles.length) {
					font(ctx, 400, 24, FONT_MONO);
					ctx.fillStyle = C.ink2;
					ctx.fillText(textos.mesMedalles(textos.medalles.length - dibuixades), mx, my);
				}
				break;
			}
			medalla(ctx, mx + 14, my - 8, 13);
			ctx.fillStyle = C.ink;
			font(ctx, 700, 26, FONT_WIDE);
			ls.forEach((l, i) => ctx.fillText(l, mx + 44, my + i * 32));
			my += alt;
			dibuixades++;
		}
	}

	// Peu: data i web.
	const py = fy + fh - 56;
	ctx.strokeStyle = C.ink;
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(x0, py - 54);
	ctx.lineTo(x1, py - 54);
	ctx.stroke();
	font(ctx, 400, 28, FONT_MONO);
	ctx.fillStyle = C.ink2;
	ctx.textAlign = 'left';
	ctx.fillText(textos.data, x0, py);
	font(ctx, 900, 34, FONT_WIDE, true);
	ctx.fillStyle = C.stampInk;
	ctx.textAlign = 'right';
	ctx.fillText(textos.web, x1, py);
}

/** PNG del canvas (o `null` si el navegador no el pot generar). */
export function pngDelCanvas(canvas: HTMLCanvasElement): Promise<Blob | null> {
	return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
}
