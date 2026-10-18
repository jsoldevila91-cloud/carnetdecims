/**
 * Imatge per compartir una ascensió (bloc R5): PNG de 1080×1350 dibuixat al client amb
 * l'estètica Segells (peces comunes a `imatge-comu.ts`, les mateixes que la imatge del carnet).
 * Un segell gran amb el nom del cim, la data i l'altitud; a sota, el nom, l'altitud i la
 * comarca; al peu, la data llarga i el web. Només dades del catàleg i la data: cap nota, cap
 * company ni el mètode. Segueix el tema clar o fosc que se li demani.
 */
import {
	FONT_MONO,
	FONT_WIDE,
	capcalera,
	espaiat,
	font,
	linies,
	paletaDe,
	peu,
	prepararFull,
	rectArrodonit,
	type Ctx,
	type PaletaImatge,
	type TemaImatge
} from './imatge-comu';

export interface TextosImatgeAscensio {
	/** "Carnet de Cims" */
	marca: string;
	/** "Ascensió" (capçalera, a la dreta). */
	etiqueta: string;
	/** "Cim essencial" (només si `essencial`). */
	essencial: string;
	/** "2.913 m · Pallars Sobirà" */
	meta: string;
	/** Data llarga de l'ascensió: "12 de juliol de 2024". */
	data: string;
	/** "carnetdecims.cat" */
	web: string;
}

export interface DadesImatgeAscensio {
	/** Nom del cim (catàleg). */
	nom: string;
	/** Altitud ja formatada, sense unitat: "2.913". */
	altitud: string;
	/** Nom de la comarca (dins del segell, en majúscules). */
	comarca: string;
	essencial: boolean;
	/** Data del segell: "12 · VII · 2024". */
	dataSegell: string;
	tema: TemaImatge;
	textos: TextosImatgeAscensio;
}

/**
 * Text seguint un arc de radi `r` centrat a dalt (`dalt`) o a baix del cercle. A baix, les
 * lletres queden dretes i cap a dins (com el `textPath` inferior de `Segell.svelte`).
 */
function textEnArc(
	ctx: Ctx,
	text: string,
	cx: number,
	cy: number,
	r: number,
	dalt: boolean,
	espai: number
): void {
	const lletres = [...text];
	const amples = lletres.map((l) => ctx.measureText(l).width);
	const total = amples.reduce((a, b) => a + b, 0) + espai * Math.max(0, lletres.length - 1);
	let acc = 0;
	ctx.save();
	ctx.textAlign = 'center';
	ctx.textBaseline = 'alphabetic';
	lletres.forEach((l, i) => {
		const mig = (acc + amples[i] / 2) / r;
		const a = dalt ? -Math.PI / 2 - total / (2 * r) + mig : Math.PI / 2 + total / (2 * r) - mig;
		ctx.save();
		ctx.translate(cx + r * Math.cos(a), cy + r * Math.sin(a));
		ctx.rotate(dalt ? a + Math.PI / 2 : a - Math.PI / 2);
		ctx.fillText(l, 0, 0);
		ctx.restore();
		acc += amples[i] + espai;
	});
	ctx.restore();
}

/**
 * Mida de lletra més gran (entre `min` i `max`) amb què `text` cap a `ample`; si ni amb `min`
 * no hi cap, es retalla amb "…".
 */
function ajustar(
	ctx: Ctx,
	text: string,
	ample: number,
	max: number,
	min: number,
	aplica: (mida: number) => void,
	espai = 0
): string {
	const mesura = (t: string) => ctx.measureText(t).width + espai * Math.max(0, [...t].length - 1);
	for (let mida = max; mida >= min; mida -= 2) {
		aplica(mida);
		if (mesura(text) <= ample) return text;
	}
	aplica(min);
	let t = text;
	while (t.length > 1 && mesura(`${t}…`) > ample) t = t.slice(0, -1);
	return `${t.trimEnd()}…`;
}

/** Segell gran (mateixa geometria que `Segell.svelte`, viewBox 120 amb radi exterior 55). */
function segellGran(
	ctx: Ctx,
	C: PaletaImatge,
	cx: number,
	cy: number,
	R: number,
	d: DadesImatgeAscensio
) {
	const k = R / 55;
	ctx.save();
	ctx.translate(cx, cy);
	ctx.rotate((-6 * Math.PI) / 180);
	ctx.strokeStyle = C.stampInk;
	ctx.fillStyle = C.stampInk;
	ctx.lineWidth = 3 * k;
	ctx.beginPath();
	ctx.arc(0, 0, 55 * k, 0, Math.PI * 2);
	ctx.stroke();
	ctx.lineWidth = 1.2 * k;
	ctx.beginPath();
	ctx.arc(0, 0, 48 * k, 0, Math.PI * 2);
	ctx.stroke();

	// Nom a l'arc superior (fins a 216°: els noms llargs baixen pels costats).
	espaiat(ctx, 0);
	const espaiDalt = 1.5 * k;
	const nom = ajustar(
		ctx,
		d.nom.toUpperCase(),
		Math.PI * 1.2 * 38 * k,
		10.5 * k,
		5 * k,
		(mida) => font(ctx, 600, mida, FONT_MONO),
		espaiDalt
	);
	textEnArc(ctx, nom, 0, 0, 38 * k, true, espaiDalt);

	// Data a l'arc inferior.
	font(ctx, 600, 9 * k, FONT_MONO);
	textEnArc(ctx, d.dataSegell, 0, 0, 43 * k, false, 1.2 * k);

	// Altitud al centre i comarca a sota.
	ctx.textAlign = 'center';
	ctx.textBaseline = 'alphabetic';
	const xifra = ajustar(ctx, d.altitud, 60 * k, 21 * k, 12 * k, (mida) =>
		font(ctx, 900, mida, FONT_WIDE, true)
	);
	ctx.fillText(xifra, 0, (d.comarca ? 6 : 10) * k);
	if (d.comarca) {
		const comarca = ajustar(ctx, d.comarca.toUpperCase(), 50 * k, 8 * k, 5 * k, (mida) =>
			font(ctx, 600, mida, FONT_MONO)
		);
		ctx.fillText(comarca, 0, 20 * k);
	}
	if (d.essencial) {
		const y = 28 * k;
		ctx.beginPath();
		ctx.moveTo(0, y - 3.5 * k);
		ctx.lineTo(3.5 * k, y);
		ctx.lineTo(0, y + 3.5 * k);
		ctx.lineTo(-3.5 * k, y);
		ctx.closePath();
		ctx.fill();
	}
	ctx.restore();
}

/** Dibuixa la imatge de l'ascensió a `canvas` (es redimensiona a 1080×1350). */
export function dibuixarImatgeAscensio(canvas: HTMLCanvasElement, d: DadesImatgeAscensio): void {
	const C = paletaDe(d.tema);
	const preparat = prepararFull(canvas, C);
	if (!preparat) return;
	const { ctx, full } = preparat;
	const { fx, fw, fy, x0, x1 } = full;
	const { textos } = d;
	const cx = fx + fw / 2;
	const ample = x1 - x0;

	capcalera(ctx, full, C, { esquerra: textos.marca, dreta: textos.etiqueta }, { logo: true });

	// Segell gran.
	const R = 280;
	const cy = fy + 112 + 44 + R;
	segellGran(ctx, C, cx, cy, R, d);

	// Nom del cim (fins a 2 línies, centrat).
	ctx.textAlign = 'center';
	ctx.textBaseline = 'alphabetic';
	ctx.fillStyle = C.ink;
	espaiat(ctx, -1);
	let mida = 76;
	font(ctx, 900, mida, FONT_WIDE, true);
	const paraulaLlarga = d.nom
		.split(/\s+/)
		.reduce((max, p) => Math.max(max, ctx.measureText(p).width), 0);
	if (paraulaLlarga > ample) {
		mida = Math.max(44, Math.floor((mida * ample) / paraulaLlarga));
		font(ctx, 900, mida, FONT_WIDE, true);
	}
	const ls = linies(ctx, d.nom, ample, 2);
	let y = cy + R + 40 + mida;
	for (const l of ls) {
		ctx.fillText(l, cx, y);
		y += mida * 1.1;
	}
	espaiat(ctx, 0);

	// Altitud i comarca.
	y += 6;
	font(ctx, 400, 34, FONT_MONO);
	ctx.fillStyle = C.ink2;
	const meta = ajustar(ctx, textos.meta, ample, 34, 24, (m) => font(ctx, 400, m, FONT_MONO));
	ctx.fillText(meta, cx, y);

	// Etiqueta d'essencial (rombe + text) en tinta de segell.
	if (d.essencial && textos.essencial) {
		y += 40;
		font(ctx, 600, 26, FONT_MONO);
		espaiat(ctx, 3);
		const t = textos.essencial.toUpperCase();
		const w = ctx.measureText(t).width + 3 + 40;
		const h = 52;
		const x = cx - w / 2 - 18;
		ctx.strokeStyle = C.stampInk;
		ctx.lineWidth = 3;
		rectArrodonit(ctx, x, y, w + 36, h, 8);
		ctx.stroke();
		ctx.fillStyle = C.stampInk;
		const dx = x + 32;
		const dy = y + h / 2;
		ctx.beginPath();
		ctx.moveTo(dx, dy - 8);
		ctx.lineTo(dx + 8, dy);
		ctx.lineTo(dx, dy + 8);
		ctx.lineTo(dx - 8, dy);
		ctx.closePath();
		ctx.fill();
		ctx.textAlign = 'left';
		ctx.fillText(t, dx + 22, dy + 9);
		espaiat(ctx, 0);
	}

	peu(ctx, full, C, { esquerra: textos.data, web: textos.web });
}
