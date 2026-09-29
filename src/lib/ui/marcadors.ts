/**
 * Separació de marcadors del mapa estàtic de comarca (funció pura, SSR).
 *
 * Els marcadors es posen en % sobre la imatge; si dos cims són a prop (Pica d'Estats i Pic de
 * Sotllo, a uns 500 m), els marcadors se solapen i un queda tapat. Es calcula una posició
 * separada per a l'amplada de mapa més petita (mòbil de 320 px): si no se solapen allà, tampoc
 * a amplades més grans, perquè les distàncies en px creixen amb el mapa. El punt real es manté
 * i la UI hi dibuixa una línia guia quan el marcador s'ha desplaçat.
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
}

const ITERACIONS = 200;
/** Desplaçament (px) a partir del qual es dibuixa la línia guia. */
const LLINDAR_GUIA = 3;

/**
 * Separa els marcadors perquè cap parell quedi a menys de `distancia` px a l'amplada de
 * referència. Relaxació iterativa determinista: cada parell massa proper s'allunya en la direcció
 * que els uneix (o en un angle fix si coincideixen), i tots queden dins del mapa.
 */
export function separarMarcadors(
	punts: readonly PuntMapa[],
	opts: OpcionsSeparacio = {}
): MarcadorSeparat[] {
	const W = opts.ample ?? 280;
	const H = opts.alt ?? (W * 480) / 640;
	const D = opts.distancia ?? 26;
	const marge = opts.marge ?? 13;

	const p = punts.map((pt) => ({ x: (pt.xPct / 100) * W, y: (pt.yPct / 100) * H }));
	const dins = (v: number, max: number) => Math.min(max - marge, Math.max(marge, v));
	for (const q of p) {
		q.x = dins(q.x, W);
		q.y = dins(q.y, H);
	}

	for (let it = 0; it < ITERACIONS; it++) {
		let mogut = false;
		for (let i = 0; i < p.length; i++) {
			for (let j = i + 1; j < p.length; j++) {
				let dx = p[j].x - p[i].x;
				let dy = p[j].y - p[i].y;
				let d = Math.hypot(dx, dy);
				if (d >= D - 1e-6) continue;
				if (d < 1e-6) {
					// Coincidents: direcció fixa segons l'índex (determinista).
					const angle = ((i * 7 + j * 13) % 12) * (Math.PI / 6);
					dx = Math.cos(angle);
					dy = Math.sin(angle);
					d = 1;
				}
				const empenta = (D - d) / 2 + 0.01;
				const ux = dx / d;
				const uy = dy / d;
				p[i].x = dins(p[i].x - ux * empenta, W);
				p[i].y = dins(p[i].y - uy * empenta, H);
				p[j].x = dins(p[j].x + ux * empenta, W);
				p[j].y = dins(p[j].y + uy * empenta, H);
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
