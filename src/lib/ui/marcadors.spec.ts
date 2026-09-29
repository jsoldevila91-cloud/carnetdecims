import { describe, expect, it } from 'vitest';
import { cimsPerComarca, comarquesAmbCims } from '$lib/data/catalog';
import { mapaEstaticComarca } from '$lib/platform/mapa-estatic';
import { separarMarcadors, type MarcadorSeparat } from './marcadors';

const W = 280;
const H = 210;

function distanciaMinima(ms: readonly MarcadorSeparat[]): number {
	let min = Infinity;
	for (let i = 0; i < ms.length; i++)
		for (let j = i + 1; j < ms.length; j++)
			min = Math.min(
				min,
				Math.hypot(((ms[i].xPct - ms[j].xPct) / 100) * W, ((ms[i].yPct - ms[j].yPct) / 100) * H)
			);
	return min;
}

describe('separació de marcadors del mapa de comarca', () => {
	it('no mou marcadors que ja estan separats', () => {
		const ms = separarMarcadors([
			{ slug: 'a', xPct: 20, yPct: 20 },
			{ slug: 'b', xPct: 80, yPct: 80 }
		]);
		expect(ms.map((m) => [m.xPct, m.yPct, m.desplacat])).toEqual([
			[20, 20, false],
			[80, 80, false]
		]);
	});

	it('separa punts coincidents i propers, i conserva la posició real', () => {
		const ms = separarMarcadors([
			{ slug: 'a', xPct: 50, yPct: 50 },
			{ slug: 'b', xPct: 50, yPct: 50 },
			{ slug: 'c', xPct: 51, yPct: 50.5 }
		]);
		expect(distanciaMinima(ms)).toBeGreaterThanOrEqual(25.9);
		expect(ms[0]).toMatchObject({ x0Pct: 50, y0Pct: 50 });
		expect(ms.some((m) => m.desplacat)).toBe(true);
	});

	it('a totes les comarques: cap parell a menys de 26 px a 280 px i tots dins del mapa', () => {
		for (const c of comarquesAmbCims()) {
			const mapa = mapaEstaticComarca(cimsPerComarca(c.slug), { ample: 640, alt: 480 });
			if (!mapa) continue;
			const ms = separarMarcadors(mapa.punts);
			expect(distanciaMinima(ms), c.slug).toBeGreaterThanOrEqual(25.9);
			for (const m of ms) {
				expect(m.xPct, `${c.slug}/${m.slug}`).toBeGreaterThanOrEqual(0);
				expect(m.xPct).toBeLessThanOrEqual(100);
				expect(m.yPct).toBeGreaterThanOrEqual(0);
				expect(m.yPct).toBeLessThanOrEqual(100);
			}
		}
	});

	it('a totes les comarques: el punt real i la guia dels desplaçats queden a la vista', () => {
		const px = (m: MarcadorSeparat) => ({
			x: (m.xPct / 100) * W,
			y: (m.yPct / 100) * H,
			x0: (m.x0Pct / 100) * W,
			y0: (m.y0Pct / 100) * H
		});
		for (const c of comarquesAmbCims()) {
			const mapa = mapaEstaticComarca(cimsPerComarca(c.slug), { ample: 640, alt: 480 });
			if (!mapa) continue;
			const ms = separarMarcadors(mapa.punts).map(px);
			for (const [i, m] of ms.entries()) {
				const desp = Math.hypot(m.x - m.x0, m.y - m.y0);
				if (desp < 3) continue;
				// Disc de radi ~11 px + punt real de 3 px + tram de guia visible.
				expect(desp, `${c.slug}: desplaçament`).toBeGreaterThanOrEqual(19.9);
				for (const [j, n] of ms.entries())
					if (j !== i)
						expect(
							Math.hypot(n.x - m.x0, n.y - m.y0),
							`${c.slug}: punt real tapat`
						).toBeGreaterThanOrEqual(14.9);
			}
		}
	});
});
