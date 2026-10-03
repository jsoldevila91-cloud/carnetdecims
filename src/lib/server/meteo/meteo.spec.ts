import { describe, expect, it, vi } from 'vitest';
import type { DiaMeteo, PrevisioMeteo } from '$lib/platform/meteo';
import { FONT_OPEN_METEO, crearOpenMeteo, parsejarOpenMeteo, urlOpenMeteo } from './open-meteo';
import { ErrorProveidor, type ProveidorMeteo } from './proveidor';
import {
	CAPCALERA_ESTAT_CACHE,
	DIES_PREVISIO,
	TTL_FRESCA_S,
	respostaMeteo,
	type CacheMeteo
} from './servei';

const PEDRAFORCA = { lat: 42.2397, lon: 1.7036, altitud: 2506 };

/** Resposta real d'Open-Meteo (2026-10-03, Pedraforca), retallada. */
function respostaOpenMeteo() {
	const hores = (dia: string, valors: (number | null)[]) =>
		valors.map((v, h) => ({ t: `${dia}T${String(h * 6).padStart(2, '0')}:00`, v }));
	const h = [
		...hores('2026-10-03', [3560, 3610, 3750, 3530]),
		...hores('2026-10-04', [3450, 3400, 3800, null]),
		...hores('2026-10-05', [null, null, null, null])
	];
	return {
		latitude: 42.24,
		elevation: 2506,
		daily: {
			time: ['2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06'],
			temperature_2m_max: [7.54, 7.8, 11.8, 12.2],
			temperature_2m_min: [3.0, 3.8, 3.7, null],
			wind_speed_10m_max: [15.7, 21.2, 21.4, 8.1],
			wind_gusts_10m_max: [45.4, 48.6, 45.0, 25.2],
			precipitation_sum: [17.75, 23.0, 0.2, 0.5],
			precipitation_probability_max: [80, 80, null, 40],
			weather_code: [53, 63, 51, 51],
			cloud_cover_mean: [94, 94, 56, 64]
		},
		hourly: { time: h.map((x) => x.t), freezing_level_height: h.map((x) => x.v) }
	};
}

describe('Open-Meteo', () => {
	it('URL: punt i altitud del cim, variables diàries, isoterma horària i Europe/Madrid', () => {
		const url = new URL(urlOpenMeteo(PEDRAFORCA, 4));
		expect(url.origin + url.pathname).toBe('https://api.open-meteo.com/v1/forecast');
		const p = url.searchParams;
		expect(p.get('latitude')).toBe('42.2397');
		expect(p.get('longitude')).toBe('1.7036');
		expect(p.get('elevation')).toBe('2506');
		expect(p.get('timezone')).toBe('Europe/Madrid');
		expect(p.get('forecast_days')).toBe('4');
		expect(p.get('hourly')).toBe('freezing_level_height');
		expect(p.get('daily')?.split(',')).toEqual(
			expect.arrayContaining([
				'temperature_2m_max',
				'temperature_2m_min',
				'wind_speed_10m_max',
				'wind_gusts_10m_max',
				'precipitation_sum',
				'precipitation_probability_max',
				'weather_code',
				'cloud_cover_mean'
			])
		);
		// Cap paràmetre que pugui identificar el visitant: només el punt del cim.
		expect([...p.keys()].sort()).toEqual(
			[
				'daily',
				'elevation',
				'forecast_days',
				'hourly',
				'latitude',
				'longitude',
				'precipitation_unit',
				'temperature_unit',
				'timezone',
				'wind_speed_unit'
			].sort()
		);
	});

	it('format propi compacte: arrodonits, isoterma mínima del dia, dies incomplets fora', () => {
		const dies = parsejarOpenMeteo(respostaOpenMeteo(), 4);
		expect(dies).toEqual<DiaMeteo[]>([
			{
				data: '2026-10-03',
				tMax: 7.5,
				tMin: 3,
				ventMax: 16,
				ratxaMax: 45,
				precipitacio: 17.8,
				probPrecipitacio: 80,
				codi: 53,
				iso0: 3530,
				nuvolositat: 94
			},
			{
				data: '2026-10-04',
				tMax: 7.8,
				tMin: 3.8,
				ventMax: 21,
				ratxaMax: 49,
				precipitacio: 23,
				probPrecipitacio: 80,
				codi: 63,
				iso0: 3400,
				nuvolositat: 94
			},
			// Sense isoterma ni probabilitat: s'ometen / null, no s'inventen.
			{
				data: '2026-10-05',
				tMax: 11.8,
				tMin: 3.7,
				ventMax: 21,
				ratxaMax: 45,
				precipitacio: 0.2,
				probPrecipitacio: null,
				codi: 51,
				nuvolositat: 56
			}
			// 2026-10-06 sense tMin → descartat.
		]);
	});

	it('resposta sense daily o sense cap dia complet → ErrorProveidor', () => {
		expect(() => parsejarOpenMeteo({ error: true, reason: 'x' }, 4)).toThrow(ErrorProveidor);
		expect(() => parsejarOpenMeteo({ daily: { time: ['2026-10-03'] } }, 4)).toThrow(ErrorProveidor);
	});

	it('HTTP no 200, xarxa o JSON no vàlid → ErrorProveidor', async () => {
		const ambResposta = (r: Response | Error) =>
			crearOpenMeteo((async () => {
				if (r instanceof Error) throw r;
				return r;
			}) as typeof fetch);
		await expect(
			ambResposta(new Response('{}', { status: 429 })).previsio(PEDRAFORCA, 4)
		).rejects.toThrow(/HTTP 429/);
		await expect(
			ambResposta(new TypeError('fetch failed')).previsio(PEDRAFORCA, 4)
		).rejects.toThrow(ErrorProveidor);
		await expect(
			ambResposta(new Response('<html>', { status: 200 })).previsio(PEDRAFORCA, 4)
		).rejects.toThrow(/JSON/);
		const ok = await ambResposta(
			new Response(JSON.stringify(respostaOpenMeteo()), { status: 200 })
		).previsio(PEDRAFORCA, 4);
		expect(ok).toHaveLength(3);
	});

	it('atribució CC BY 4.0', () => {
		expect(FONT_OPEN_METEO).toEqual({
			nom: 'Open-Meteo',
			url: 'https://open-meteo.com/',
			llicencia: 'CC BY 4.0',
			llicenciaUrl: 'https://creativecommons.org/licenses/by/4.0/'
		});
	});
});

/** Cache API en memòria. */
function cacheMemoria(): CacheMeteo & { claus: () => string[] } {
	const m = new Map<string, Response>();
	return {
		async match(req) {
			return m.get(req.url)?.clone();
		},
		async put(req, res) {
			m.set(req.url, res.clone());
		},
		claus: () => [...m.keys()]
	};
}

const DIA: DiaMeteo = {
	data: '2026-10-03',
	tMax: 7.5,
	tMin: 3,
	ventMax: 16,
	ratxaMax: 45,
	precipitacio: 17.8,
	probPrecipitacio: 80,
	codi: 53
};

function proveidorFals(falla = false): ProveidorMeteo & { crides: number } {
	const p = {
		font: FONT_OPEN_METEO,
		crides: 0,
		async previsio(_punt: unknown, dies: number) {
			p.crides++;
			if (falla) throw new ErrorProveidor('caigut');
			expect(dies).toBe(DIES_PREVISIO);
			return [DIA];
		}
	};
	return p;
}

describe('servei /api/meteo/{slug}', () => {
	const origen = 'https://carnetdecims.cat';
	const T0 = new Date('2026-10-03T08:00:00Z');

	it('cim desconegut → 404 JSON sense cache', async () => {
		const res = await respostaMeteo({
			slug: 'no-existeix',
			origen,
			punt: undefined,
			proveidor: proveidorFals()
		});
		expect(res.status).toBe(404);
		expect(res.headers.get('cache-control')).toBe('no-store');
		expect(await res.json()).toEqual({ error: 'cim_desconegut' });
	});

	it('MISS → demana al proveïdor i desa; HIT dins de les 3 h sense tornar-hi', async () => {
		const cache = cacheMemoria();
		const proveidor = proveidorFals();
		const base = {
			slug: 'pedraforca-pollego-superior',
			origen,
			punt: PEDRAFORCA,
			proveidor,
			cache
		};

		const r1 = await respostaMeteo({ ...base, ara: () => T0 });
		expect(r1.status).toBe(200);
		expect(r1.headers.get(CAPCALERA_ESTAT_CACHE)).toBe('MISS');
		expect(r1.headers.get('content-type')).toMatch(/application\/json/);
		expect(r1.headers.get('cache-control')).toBe('public, max-age=900');
		expect(await r1.json()).toEqual({
			actualitzat: '2026-10-03T08:00:00.000Z',
			altitud: 2506,
			font: FONT_OPEN_METEO,
			dies: [DIA]
		});
		expect(cache.claus()).toEqual([`${origen}/api/meteo/pedraforca-pollego-superior?v=1`]);

		const r2 = await respostaMeteo({
			...base,
			ara: () => new Date(T0.getTime() + (TTL_FRESCA_S - 60) * 1000)
		});
		expect(r2.headers.get(CAPCALERA_ESTAT_CACHE)).toBe('HIT');
		expect(((await r2.json()) as PrevisioMeteo).actualitzat).toBe('2026-10-03T08:00:00.000Z');
		expect(proveidor.crides).toBe(1);

		const r3 = await respostaMeteo({
			...base,
			ara: () => new Date(T0.getTime() + (TTL_FRESCA_S + 60) * 1000)
		});
		expect(r3.headers.get(CAPCALERA_ESTAT_CACHE)).toBe('MISS');
		expect(proveidor.crides).toBe(2);
	});

	it('proveïdor caigut: còpia antiga (STALE) si n’hi ha; si no, 502 net', async () => {
		const cache = cacheMemoria();
		const base = { slug: 'canigo', origen, punt: { lat: 42.52, lon: 2.46, altitud: 2784 }, cache };
		await respostaMeteo({ ...base, proveidor: proveidorFals(), ara: () => T0 });

		const stale = await respostaMeteo({
			...base,
			proveidor: proveidorFals(true),
			ara: () => new Date(T0.getTime() + 5 * 3600 * 1000)
		});
		expect(stale.status).toBe(200);
		expect(stale.headers.get(CAPCALERA_ESTAT_CACHE)).toBe('STALE');
		expect(((await stale.json()) as PrevisioMeteo).actualitzat).toBe('2026-10-03T08:00:00.000Z');

		const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const res = await respostaMeteo({
			slug: 'canigo',
			origen,
			punt: base.punt,
			proveidor: proveidorFals(true),
			cache: cacheMemoria()
		});
		expect(res.status).toBe(502);
		expect(res.headers.get('cache-control')).toBe('no-store');
		expect(await res.json()).toEqual({ error: 'proveidor_no_disponible' });
		err.mockRestore();
	});

	it('sense Cache API (vite dev) funciona igualment', async () => {
		const res = await respostaMeteo({
			slug: 'canigo',
			origen,
			punt: PEDRAFORCA,
			proveidor: proveidorFals()
		});
		expect(res.status).toBe(200);
	});
});
