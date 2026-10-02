/**
 * Icones del mapa interactiu dibuixades amb `<canvas>` amb els colors del tema (tokens Segells):
 * no calen imatges ni fonts de glifs, i en canviar entre clar i fosc es tornen a dibuixar.
 *
 * Codificació doble (docs/05 §3), l'estat mai depèn només del color:
 * - forma: cercle = cim, rombe = essencial;
 * - farciment: ple (amb un "✓") = fet, només contorn = pendent.
 */
import { midaCluster } from './vista';

export interface PaletaMapa {
	paper: string;
	card: string;
	ink: string;
	rule: string;
	stamp: string;
	stampInk: string;
	onStamp: string;
	blue: string;
	fontMono: string;
}

/** Colors actuals del tema a partir de les custom properties de `:root`. */
export function paletaDelTema(el: Element = document.documentElement): PaletaMapa {
	const css = getComputedStyle(el);
	const v = (nom: string, perDefecte: string) => css.getPropertyValue(nom).trim() || perDefecte;
	return {
		paper: v('--c-paper', '#f6f2e9'),
		card: v('--c-card', '#fbf8f1'),
		ink: v('--c-ink', '#1b2a47'),
		rule: v('--c-rule', '#d6cab3'),
		stamp: v('--c-stamp', '#c0392b'),
		stampInk: v('--c-stamp-ink', '#b3352a'),
		onStamp: v('--c-on-stamp', '#ffffff'),
		blue: v('--c-blue', '#2f5da8'),
		fontMono: v('--font-mono', 'monospace')
	};
}

export type TipusMarcador = 'cim' | 'cim-fet' | 'ess' | 'ess-fet' | 'sel' | 'jo';

export const TIPUS_MARCADORS: readonly TipusMarcador[] = [
	'cim',
	'cim-fet',
	'ess',
	'ess-fet',
	'sel',
	'jo'
];

/** Nom de la imatge a l'estil del mapa. */
export const idMarcador = (t: TipusMarcador) => `mk:${t}`;

export interface ImatgeMapa {
	data: ImageData;
	pixelRatio: number;
}

function llenç(midaCss: number, ratio: number) {
	const px = Math.ceil(midaCss * ratio);
	const canvas = document.createElement('canvas');
	canvas.width = px;
	canvas.height = px;
	const ctx = canvas.getContext('2d')!;
	ctx.scale(ratio, ratio);
	return { ctx, px };
}

function rombe(ctx: CanvasRenderingContext2D, c: number, r: number) {
	ctx.beginPath();
	ctx.moveTo(c, c - r);
	ctx.lineTo(c + r, c);
	ctx.lineTo(c, c + r);
	ctx.lineTo(c - r, c);
	ctx.closePath();
}

function check(ctx: CanvasRenderingContext2D, c: number, s: number, color: string) {
	ctx.beginPath();
	ctx.moveTo(c - 0.45 * s, c + 0.02 * s);
	ctx.lineTo(c - 0.12 * s, c + 0.34 * s);
	ctx.lineTo(c + 0.46 * s, c - 0.3 * s);
	ctx.strokeStyle = color;
	ctx.lineWidth = 2;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.stroke();
}

/** Dibuixa un marcador (mida en px CSS; la imatge té `ratio` píxels per px). */
export function dibuixarMarcador(tipus: TipusMarcador, p: PaletaMapa, ratio = 2): ImatgeMapa {
	const mida = tipus === 'sel' ? 44 : tipus.startsWith('ess') ? 28 : 24;
	const { ctx, px } = llenç(mida, ratio);
	const c = mida / 2;

	switch (tipus) {
		case 'cim':
			ctx.beginPath();
			ctx.arc(c, c, 7, 0, Math.PI * 2);
			ctx.fillStyle = p.card;
			ctx.fill();
			ctx.lineWidth = 2.4;
			ctx.strokeStyle = p.ink;
			ctx.stroke();
			break;
		case 'cim-fet':
			ctx.beginPath();
			ctx.arc(c, c, 9, 0, Math.PI * 2);
			ctx.fillStyle = p.ink;
			ctx.fill();
			ctx.lineWidth = 2;
			ctx.strokeStyle = p.paper;
			ctx.stroke();
			check(ctx, c, 9, p.paper);
			break;
		case 'ess':
			rombe(ctx, c, 11);
			ctx.fillStyle = p.card;
			ctx.fill();
			ctx.lineWidth = 2.6;
			ctx.strokeStyle = p.stampInk;
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(c, c, 3, 0, Math.PI * 2);
			ctx.fillStyle = p.stampInk;
			ctx.fill();
			break;
		case 'ess-fet':
			rombe(ctx, c, 12);
			ctx.fillStyle = p.stamp;
			ctx.fill();
			ctx.lineWidth = 2;
			ctx.strokeStyle = p.paper;
			ctx.stroke();
			check(ctx, c, 9, p.onStamp);
			break;
		case 'sel':
			// Anell discontinu al voltant del marcador seleccionat.
			ctx.beginPath();
			ctx.arc(c, c, 18, 0, Math.PI * 2);
			ctx.globalAlpha = 0.14;
			ctx.fillStyle = p.stamp;
			ctx.fill();
			ctx.globalAlpha = 1;
			ctx.setLineDash([4, 3]);
			ctx.lineWidth = 2.5;
			ctx.strokeStyle = p.stampInk;
			ctx.stroke();
			break;
		case 'jo':
			ctx.beginPath();
			ctx.arc(c, c, 11, 0, Math.PI * 2);
			ctx.globalAlpha = 0.22;
			ctx.fillStyle = p.blue;
			ctx.fill();
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.arc(c, c, 6, 0, Math.PI * 2);
			ctx.fillStyle = p.blue;
			ctx.fill();
			ctx.lineWidth = 2.5;
			ctx.strokeStyle = '#ffffff';
			ctx.stroke();
			break;
	}
	return { data: ctx.getImageData(0, 0, px, px), pixelRatio: ratio };
}

/**
 * Clúster: cercle de paper amb el nombre de cims i un anell amb la proporció feta (arc ple de
 * tinta) i pendent (arc clar). El número és el text principal; l'anell és informació extra.
 */
export function dibuixarCluster(n: number, fets: number, p: PaletaMapa, ratio = 2): ImatgeMapa {
	const mida = midaCluster(n) + 6;
	const { ctx, px } = llenç(mida, ratio);
	const c = mida / 2;
	const rAnell = c - 4;
	const inici = -Math.PI / 2;

	// Ombra dura desplaçada (estil segell)
	ctx.beginPath();
	ctx.arc(c + 1.5, c + 1.5, rAnell + 2, 0, Math.PI * 2);
	ctx.globalAlpha = 0.35;
	ctx.fillStyle = p.ink;
	ctx.fill();
	ctx.globalAlpha = 1;

	ctx.beginPath();
	ctx.arc(c, c, rAnell + 2, 0, Math.PI * 2);
	ctx.fillStyle = p.card;
	ctx.fill();
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = p.ink;
	ctx.stroke();

	// Anell pendent (sencer) i fet (arc proporcional)
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.arc(c, c, rAnell - 2, 0, Math.PI * 2);
	ctx.strokeStyle = p.rule;
	ctx.stroke();
	if (fets > 0) {
		ctx.beginPath();
		ctx.arc(c, c, rAnell - 2, inici, inici + (Math.PI * 2 * Math.min(fets, n)) / n);
		ctx.strokeStyle = p.ink;
		ctx.stroke();
	}

	ctx.fillStyle = p.ink;
	ctx.font = `700 ${n >= 100 ? 12 : 13}px ${p.fontMono}`;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(String(n), c, c + 0.5);
	return { data: ctx.getImageData(0, 0, px, px), pixelRatio: ratio };
}
