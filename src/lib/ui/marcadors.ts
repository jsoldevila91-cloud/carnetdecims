/**
 * Separació de marcadors del mapa estàtic de comarca (funció pura, SSR).
 *
 * Els marcadors es posen en % sobre la imatge; si dos cims són a prop (Pica d'Estats i Pic de
 * Sotllo, a uns 500 m), els marcadors se solapen i un queda tapat. Es calcula una posició
 * separada per a l'amplada de mapa més petita (mòbil de 320 px): si no se solapen allà, tampoc
 * a amplades més grans, perquè les distàncies en px creixen amb el mapa. El punt real es manté
 * i la UI hi dibuixa una línia guia quan el marcador s'ha desplaçat.
 *
 * Perquè la guia i el punt real es vegin (i no quedin sota el disc del marcador, de radi ~11 px):
 * - un marcador desplaçat s'allunya com a mínim `desplacamentMinim` px del seu punt real;
 * - cap marcador (ni el propi ni un altre) queda a menys de `llindarPunt` px d'un punt real
 *   dibuixat.
 */

export interface PuntMapa {
	slug: string;
	/** % des de la vora esquerra. */
	xPct: number;
	/** % des de la vora superior. */
	yPct: number;
}

export interface MarcadorSeparat extends PuntMapa {
	/** Posició real del cim (%). */
	x0Pct: number;
	y0Pct: number;
	/** El marcador s'ha mogut prou per dibuixar-hi una línia guia. */
	desplacat: boolean;
}

export interface OpcionsSeparacio {
	/** Amplada de referència del mapa (px): la més petita on es mostra. Per defecte 280. */
	ample?: number;
	/** Alçada de referència (px). Per defecte, amb proporció 640 × 480. */
	alt?: number;
	/** Distància mínima entre centres (px): àrea tàctil de 24 px + marge. Per defecte 26. */
	distancia?: number;
	/** Marge mínim entre el centre del marcador i la vora (px). Per defecte 13. */
	marge?: number;
	/**
	 * Distància mínima (px) entre un marcador desplaçat i el seu punt real: radi del disc (11) +
	 * punt real (3) + tram de guia visible. Per defecte 20.
	 */
	desplacamentMinim?: number;
	/** Distància mínima (px) entre el centre de qualsevol marcador i un punt real dibuixat. Per defecte 15. */
	llindarPunt?: number;
}

const ITERACIONS = 400;
/** Desplaçament (px) a partir del qual el marcador es considera desplaçat durant la relaxació. */
const LLINDAR_MOVIMENT = 0.5;
/** Desplaçament (px) a partir del qual es dibuixa la línia guia. */
const LLINDAR_GUIA = 3;

/**
 * Separa els marcadors perquè cap parell quedi a menys de `distancia` px a l'amplada de
 * referència i perquè el punt real i la guia dels desplaçats quedin a la vista. Relaxació
 * iterativa determinista: cada restricció incomplerta s'arregla empenyent en la direcció que
 * uneix els dos punts (o en un angle fix si coincideixen), i tots queden dins del mapa.
 */
export function separarMarcadors(
	punts: readonly PuntMapa[],
	opts: OpcionsSeparacio = {}
): MarcadorSeparat[] {
	const W = opts.ample ?? 280;
	const H = opts.alt ?? (W * 480) / 640;
	const D = opts.distancia ?? 26;
	const marge = opts.marge ?? 13;
	const DMIN = opts.desplacamentMinim ?? 20;
	const CLAR = opts.llindarPunt ?? 15;

	const reals = punts.map((pt) => ({ x: (pt.xPct / 100) * W, y: (pt.yPct / 100) * H }));
	const p = reals.map((r) => ({ ...r }));
	const dins = (v: number, max: number) => Math.min(max - marge, Math.max(marge, v));
	const posar = (q: { x: number; y: number }, x: number, y: number) => {
		q.x = dins(x, W);
		q.y = dins(y, H);
	};
	for (const q of p) posar(q, q.x, q.y);

	/** Direcció unitària de `a` cap a `b` (o una de fixa, determinista, si coincideixen). */
	const direccio = (ax: number, ay: number, bx: number, by: number, llavor: number) => {
		const dx = bx - ax;
		const dy = by - ay;
		const d = Math.hypot(dx, dy);
		if (d < 1e-6) {
			const angle = (llavor % 12) * (Math.PI / 6);
			return { ux: Math.cos(angle), uy: Math.sin(angle), d: 0 };
		}
		return { ux: dx / d, uy: dy / d, d };
	};
	const desplacat = (i: number) =>
		Math.hypot(p[i].x - reals[i].x, p[i].y - reals[i].y) >= LLINDAR_MOVIMENT;

	for (let it = 0; it < ITERACIONS; it++) {
		let mogut = false;

		// 1. Cap parell de marcadors a menys de D.
		for (let i = 0; i < p.length; i++) {
			for (let j = i + 1; j < p.length; j++) {
				const { ux, uy, d } = direccio(p[i].x, p[i].y, p[j].x, p[j].y, i * 7 + j * 13);
				if (d >= D - 1e-6) continue;
				const empenta = (D - d) / 2 + 0.01;
				posar(p[i], p[i].x - ux * empenta, p[i].y - uy * empenta);
				posar(p[j], p[j].x + ux * empenta, p[j].y + uy * empenta);
				mogut = true;
			}
		}

		// 2. Un marcador desplaçat, prou lluny del seu punt real perquè la guia es vegi.
		for (let i = 0; i < p.length; i++) {
			if (!desplacat(i)) continue;
			const { ux, uy, d } = direccio(reals[i].x, reals[i].y, p[i].x, p[i].y, i * 5);
			if (d >= DMIN - 1e-6) continue;
			posar(p[i], reals[i].x + ux * (DMIN + 0.01), reals[i].y + uy * (DMIN + 0.01));
			mogut = true;
		}

		// 3. Cap altre marcador damunt del punt real d'un marcador desplaçat.
		for (let i = 0; i < p.length; i++) {
			if (!desplacat(i)) continue;
			for (let j = 0; j < p.length; j++) {
				if (j === i) continue;
				const { ux, uy, d } = direccio(reals[i].x, reals[i].y, p[j].x, p[j].y, i * 11 + j * 3);
				if (d >= CLAR - 1e-6) continue;
				posar(p[j], reals[i].x + ux * (CLAR + 0.01), reals[i].y + uy * (CLAR + 0.01));
				mogut = true;
			}
		}

		if (!mogut) break;
	}

	const arrodonir = (v: number) => Math.round(v * 100) / 100;
	return punts.map((pt, i) => {
		const x = (p[i].x / W) * 100;
		const y = (p[i].y / H) * 100;
		const desp = Math.hypot(((x - pt.xPct) / 100) * W, ((y - pt.yPct) / 100) * H);
		return {
			slug: pt.slug,
			xPct: arrodonir(x),
			yPct: arrodonir(y),
			x0Pct: pt.xPct,
			y0Pct: pt.yPct,
			desplacat: desp >= LLINDAR_GUIA
		};
	});
}
