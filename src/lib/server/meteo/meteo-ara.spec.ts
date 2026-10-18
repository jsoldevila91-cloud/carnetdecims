import { describe, expect, it, vi } from 'vitest';
import { CIMS, cimPerSlug } from '$lib/data/catalog';
import {
	CAMI_METEO_ARA,
	MAX_SLUGS_METEO_ARA,
	camiMeteoAra,
	obtenirMeteoAra,
	type MeteoAra
} from '$lib/platform/meteo';
import { CAMI_METEO_ARA_SW } from '$lib/platform/sw/estrategia';
import {
	FONT_OPEN_METEO,
	MAX_PUNTS_PER_CRIDA,
	TIMEOUT_ACTUAL_MS,
	TIMEOUT_MS,
	crearOpenMeteoActual,
	parsejarOpenMeteoActual,
	urlOpenMeteoActual
} from './open-meteo';
import { ErrorProveidor, type ActualPunt, type ProveidorMeteoActual } from './proveidor';
import { CAPCALERA_ESTAT_CACHE, type CacheMeteo } from './servei';
import {
	ESPERA_MAX_ARA_MS,
	MAX_AGE_NAVEGADOR_ARA_S,
	REPOS_DESPRES_ERROR_MS,
	RETRY_AFTER_ARA_S,
	TTL_CACHE_ARA_S,
	TTL_FRESCA_ARA_S,
	llegirQueryAra,
	respostaMeteoAra,
	type CimMeteoAra
} from './servei-ara';

const PEDRAFORCA = { lat: 42.2397, lon: 1.7036, altitud: 2506 };
const CANIGO = { lat: 42.5188, lon: 2.4568, altitud: 2784 };

/** Resposta real d'Open-Meteo multipunt (2026-10-18, Pedraforca i Canigó), retallada. */
function respostaReal() {
	const base = (lat: number, temp: number, codi: number, extra = {}) => ({
		latitude: lat,
		timezone: 'Europe/Madrid',
		current_units: { time: 'iso8601', interval: 'seconds' },
		current: {
			time: '2026-10-18T08:45',
			interval: 900,
			temperature_2m: temp,
			weather_code: codi,
			is_day: 1
		},
		...extra
	});
	return [base(42.24, 2.6, 61), base(42.51, 0.3, 3, { location_id: 1 })];
}

describe('Open-Meteo multipunt (temps actual)', () => {
	it('URL: llistes de coordenades i altituds en ordre, current i Europe/Madrid', () => {
		const url = new URL(urlOpenMeteoActual([PEDRAFORCA, CANIGO]));
		expect(url.origin + url.pathname).toBe('https://api.open-meteo.com/v1/forecast');
		const p = url.searchParams;
		expect(p.get('latitude')).toBe('42.2397,42.5188');
		expect(p.get('longitude')).toBe('1.7036,2.4568');
		expect(p.get('elevation')).toBe('2506,2784');
		expect(p.get('current')).toBe('temperature_2m,weather_code,is_day');
		expect(p.get('timezone')).toBe('Europe/Madrid');
		// Cap dada del visitant: només els punts dels cims.
		expect([...p.keys()].sort()).toEqual(
			['current', 'elevation', 'latitude', 'longitude', 'temperature_unit', 'timezone'].sort()
		);
		expect(() => urlOpenMeteoActual([])).toThrow(RangeError);
		expect(() =>
			urlOpenMeteoActual(Array.from({ length: MAX_PUNTS_PER_CRIDA + 1 }, () => PEDRAFORCA))
		).toThrow(RangeError);
	});

	it('parseja l’array en ordre; un sol punt pot venir com a objecte', () => {
		expect(parsejarOpenMeteoActual(respostaReal(), 2)).toEqual<ActualPunt[]>([
			{ codi: 61, temperatura: 2.6, esDia: true, hora: '2026-10-18T08:45' },
			{ codi: 3, temperatura: 0.3, esDia: true, hora: '2026-10-18T08:45' }
		]);
		expect(parsejarOpenMeteoActual(respostaReal()[0], 1)).toHaveLength(1);
	});

	it('punt incomplet → null; forma inesperada o cap punt → ErrorProveidor', () => {
		const r = respostaReal();
		(r[1].current as Record<string, unknown>).weather_code = null;
		expect(parsejarOpenMeteoActual(r, 2)[1]).toBeNull();
		const decimal = respostaReal();
		decimal[0].current.weather_code = 61.5;
		expect(parsejarOpenMeteoActual(decimal, 2)[0]).toBeNull();

		expect(() => parsejarOpenMeteoActual({ error: true, reason: 'x' }, 2)).toThrow(ErrorProveidor);
		expect(() => parsejarOpenMeteoActual(respostaReal(), 3)).toThrow(ErrorProveidor);
		expect(() => parsejarOpenMeteoActual([{}, {}], 2)).toThrow(ErrorProveidor);
		expect(() => parsejarOpenMeteoActual(null, 1)).toThrow(ErrorProveidor);
	});

	it('trossos de 100 punts en paral·lel; ordre conservat; un tros caigut ho fa caure tot', async () => {
		const urls: string[] = [];
		const f = (async (u: string) => {
			urls.push(u);
			const n = new URL(u).searchParams.get('latitude')!.split(',').length;
			const llista = Array.from({ length: n }, (_, i) => ({
				current: { time: '2026-10-18T08:45', temperature_2m: i, weather_code: 0, is_day: 0 }
			}));
			return new Response(JSON.stringify(n === 1 ? llista[0] : llista), { status: 200 });
		}) as typeof fetch;
		const punts = Array.from({ length: 250 }, () => PEDRAFORCA);
		const res = await crearOpenMeteoActual(f).actual(punts);
		expect(urls).toHaveLength(3);
		expect(res).toHaveLength(250);
		expect(res[100]?.temperatura).toBe(0);
		expect(res[249]?.temperatura).toBe(49);

		let crida = 0;
		const unaFalla = (async () =>
			++crida === 2
				? new Response('{}', { status: 429 })
				: new Response(JSON.stringify(respostaReal()), { status: 200 })) as typeof fetch;
		await expect(
			crearOpenMeteoActual(unaFalla).actual(Array.from({ length: 150 }, () => PEDRAFORCA))
		).rejects.toThrow(ErrorProveidor);
		await expect(crearOpenMeteoActual(f).actual([])).resolves.toEqual([]);
	});
});

describe('temps d’espera de la crida multipunt', () => {
	it('propi i més llarg que el de la previsió (en fred Open-Meteo triga ~20 s)', () => {
		expect(TIMEOUT_ACTUAL_MS).toBe(25_000);
		expect(TIMEOUT_ACTUAL_MS).toBeGreaterThan(TIMEOUT_MS);
	});

	it('esgotat → ErrorProveidor (TimeoutError), sense penjar-se', async () => {
		const penjat = ((_u: string, init?: RequestInit) =>
			new Promise<Response>((_, rebutja) => {
				init?.signal?.addEventListener('abort', () => rebutja(init.signal!.reason));
			})) as typeof fetch;
		await expect(
			crearOpenMeteoActual(penjat, { timeoutMs: 20 }).actual([PEDRAFORCA])
		).rejects.toThrow(/TimeoutError/);
	});
});

describe('llegirQueryAra (validació estricta)', () => {
	const q = (s: string) => llegirQueryAra(new URL(`https://carnetdecims.cat/api/meteo/ara${s}`));

	it('sense query → tots; slugs vàlids → conjunt sense repetits', () => {
		expect(q('')).toBeNull();
		expect(q('?slugs=canigo,montcau,canigo')).toEqual(new Set(['canigo', 'montcau']));
	});

	it('errors → 400', () => {
		expect(q('?x=1')).toEqual({ error: 'parametre_desconegut' });
		expect(q('?slugs=canigo&v=1')).toEqual({ error: 'parametre_desconegut' });
		expect(q('?slugs=a&slugs=b')).toEqual({ error: 'slugs_repetit' });
		expect(q('?slugs=')).toEqual({ error: 'slugs_buit' });
		expect(q('?slugs=canigo,')).toEqual({ error: 'slug_invalid' });
		expect(q('?slugs=Canigo')).toEqual({ error: 'slug_invalid' });
		expect(q('?slugs=..%2Fx')).toEqual({ error: 'slug_invalid' });
		const massa = Array.from({ length: MAX_SLUGS_METEO_ARA + 1 }, (_, i) => `c${i}`).join(',');
		expect(q(`?slugs=${massa}`)).toEqual({ error: 'massa_slugs' });
		expect(q(`?slugs=${'a'.repeat(9000)}`)).toEqual({ error: 'query_massa_llarga' });
	});
});

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

const CIMS_PROVA: CimMeteoAra[] = [
	{ slug: 'pedraforca-pollego-superior', punt: PEDRAFORCA },
	{ slug: 'canigo', punt: CANIGO },
	{ slug: 'montcau', punt: { lat: 41.69, lon: 2.0, altitud: 1056 } }
];

function proveidorFals(falla = false, retardMs = 0): ProveidorMeteoActual & { crides: number } {
	const p = {
		font: FONT_OPEN_METEO,
		crides: 0,
		async actual(punts: readonly unknown[]) {
			p.crides++;
			if (retardMs) await new Promise((r) => setTimeout(r, retardMs));
			if (falla) throw new ErrorProveidor('caigut');
			expect(punts).toHaveLength(3);
			return [
				{ codi: 61, temperatura: 2.6, esDia: true, hora: '2026-10-18T08:45' },
				{ codi: 3, temperatura: -0.4, esDia: false, hora: '2026-10-18T08:45' },
				// Codi no documentat: el cim no surt (sense icona inventada).
				{ codi: 42, temperatura: 15, esDia: true, hora: '2026-10-18T08:45' }
			];
		}
	};
	return p;
}

describe('servei /api/meteo/ara', () => {
	const T0 = new Date('2026-10-18T07:00:00Z');
	const url = (s = '') => new URL(`https://carnetdecims.cat/api/meteo/ara${s}`);

	it('MISS: una sola foto del catàleg, compacta; HIT amb filtre sense tornar al proveïdor', async () => {
		const cache = cacheMemoria();
		const proveidor = proveidorFals();
		const r1 = await respostaMeteoAra({
			url: url(),
			cims: CIMS_PROVA,
			proveidor,
			cache,
			ara: () => T0
		});
		expect(r1.status).toBe(200);
		expect(r1.headers.get(CAPCALERA_ESTAT_CACHE)).toBe('MISS');
		expect(r1.headers.get('cache-control')).toBe(`public, max-age=${MAX_AGE_NAVEGADOR_ARA_S}`);
		expect(r1.headers.get('x-robots-tag')).toBe('noindex');
		expect(await r1.json()).toEqual<MeteoAra>({
			actualitzat: '2026-10-18T07:00:00.000Z',
			hora: '2026-10-18T08:45',
			font: FONT_OPEN_METEO,
			cims: {
				'pedraforca-pollego-superior': {
					categoria: 'pluja',
					codi: 61,
					temperatura: 3,
					esDia: true
				},
				canigo: { categoria: 'nuvol', codi: 3, temperatura: 0, esDia: false }
			}
		});
		expect(cache.claus()).toEqual(['https://carnetdecims.cat/api/meteo/ara?v=1']);

		const r2 = await respostaMeteoAra({
			url: url('?slugs=canigo,no-existeix'),
			cims: CIMS_PROVA,
			proveidor,
			cache,
			ara: () => new Date(T0.getTime() + (TTL_FRESCA_ARA_S - 60) * 1000)
		});
		expect(r2.headers.get(CAPCALERA_ESTAT_CACHE)).toBe('HIT');
		expect(Object.keys(((await r2.json()) as MeteoAra).cims)).toEqual(['canigo']);
		expect(proveidor.crides).toBe(1);

		const r3 = await respostaMeteoAra({
			url: url(),
			cims: CIMS_PROVA,
			proveidor,
			cache,
			ara: () => new Date(T0.getTime() + (TTL_FRESCA_ARA_S + 60) * 1000)
		});
		expect(r3.headers.get(CAPCALERA_ESTAT_CACHE)).toBe('MISS');
		expect(proveidor.crides).toBe(2);
	});

	it('peticions simultànies en caducar: una sola crida al proveïdor', async () => {
		const proveidor = proveidorFals();
		const o = { url: url(), cims: CIMS_PROVA, proveidor, ara: () => T0 };
		const rs = await Promise.all([respostaMeteoAra(o), respostaMeteoAra(o), respostaMeteoAra(o)]);
		expect(rs.map((r) => r.status)).toEqual([200, 200, 200]);
		expect(proveidor.crides).toBe(1);
	});

	it('query no vàlida → 400 sense cache ni crida', async () => {
		const proveidor = proveidorFals();
		const res = await respostaMeteoAra({ url: url('?slugs=A'), cims: CIMS_PROVA, proveidor });
		expect(res.status).toBe(400);
		expect(res.headers.get('cache-control')).toBe('no-store');
		expect(await res.json()).toEqual({ error: 'slug_invalid' });
		expect(proveidor.crides).toBe(0);
	});

	it('proveïdor caigut: foto antiga (STALE) fins a 3 h; després, o sense foto, 502', async () => {
		const cache = cacheMemoria();
		await respostaMeteoAra({
			url: url(),
			cims: CIMS_PROVA,
			proveidor: proveidorFals(),
			cache,
			ara: () => T0
		});
		const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);

		const stale = await respostaMeteoAra({
			url: url('?slugs=canigo'),
			cims: CIMS_PROVA,
			proveidor: proveidorFals(true),
			cache,
			ara: () => new Date(T0.getTime() + 2 * 3600 * 1000)
		});
		expect(stale.status).toBe(200);
		expect(stale.headers.get(CAPCALERA_ESTAT_CACHE)).toBe('STALE');
		expect(Object.keys(((await stale.json()) as MeteoAra).cims)).toEqual(['canigo']);

		const massaVella = await respostaMeteoAra({
			url: url(),
			cims: CIMS_PROVA,
			proveidor: proveidorFals(true),
			cache,
			ara: () => new Date(T0.getTime() + (TTL_CACHE_ARA_S + 60) * 1000)
		});
		expect(massaVella.status).toBe(502);
		expect(await massaVella.json()).toEqual({ error: 'proveidor_no_disponible' });

		const sense = await respostaMeteoAra({
			url: url(),
			cims: CIMS_PROVA,
			proveidor: proveidorFals(true)
		});
		expect(sense.status).toBe(502);
		expect(sense.headers.get('cache-control')).toBe('no-store');
		err.mockRestore();
	});

	it('proveïdor lent sense còpia: 503 ràpid amb retry-after; la foto es desa en segon pla', async () => {
		const cache = cacheMemoria();
		const proveidor = proveidorFals(false, 60);
		const segonPla: Promise<unknown>[] = [];
		const o = {
			url: url(),
			cims: CIMS_PROVA,
			proveidor,
			cache,
			enSegonPla: (p: Promise<unknown>) => void segonPla.push(p),
			esperaMaxMs: 10,
			ara: () => T0
		};
		const r1 = await respostaMeteoAra(o);
		expect(r1.status).toBe(503);
		expect(r1.headers.get('retry-after')).toBe(String(RETRY_AFTER_ARA_S));
		expect(r1.headers.get('cache-control')).toBe('no-store');
		expect(await r1.json()).toEqual({ error: 'meteo_en_preparacio' });
		expect(cache.claus()).toEqual([]);

		// Una altra petició mentre es prepara: no torna a cridar el proveïdor.
		expect((await respostaMeteoAra(o)).status).toBe(503);
		expect(segonPla).toHaveLength(2);
		await Promise.all(segonPla);
		expect(cache.claus()).toEqual(['https://carnetdecims.cat/api/meteo/ara?v=1']);

		const r2 = await respostaMeteoAra({ ...o, ara: () => new Date(T0.getTime() + 60_000) });
		expect(r2.headers.get(CAPCALERA_ESTAT_CACHE)).toBe('HIT');
		expect(proveidor.crides).toBe(1);
		expect(ESPERA_MAX_ARA_MS).toBeLessThan(8000); // el client abandona als 8 s
	});

	it('proveïdor lent amb foto caducada: STALE ràpid i la nova queda desada per al següent', async () => {
		const cache = cacheMemoria();
		await respostaMeteoAra({
			url: url(),
			cims: CIMS_PROVA,
			proveidor: proveidorFals(),
			cache,
			ara: () => T0
		});
		const segonPla: Promise<unknown>[] = [];
		const T1 = new Date(T0.getTime() + (TTL_FRESCA_ARA_S + 60) * 1000);
		const lent = proveidorFals(false, 60);
		const o = {
			url: url('?slugs=canigo'),
			cims: CIMS_PROVA,
			proveidor: lent,
			cache,
			enSegonPla: (p: Promise<unknown>) => void segonPla.push(p),
			esperaMaxMs: 10,
			ara: () => T1
		};
		const r = await respostaMeteoAra(o);
		expect(r.headers.get(CAPCALERA_ESTAT_CACHE)).toBe('STALE');
		expect(((await r.json()) as MeteoAra).actualitzat).toBe(T0.toISOString());
		await Promise.all(segonPla);
		const r2 = await respostaMeteoAra({ ...o, ara: () => new Date(T1.getTime() + 1000) });
		expect(r2.headers.get(CAPCALERA_ESTAT_CACHE)).toBe('HIT');
		expect(((await r2.json()) as MeteoAra).actualitzat).toBe(T1.toISOString());
		expect(lent.crides).toBe(1);
	});

	it('després d’un error, repòs: no es torna a cridar el proveïdor fins al cap d’un minut', async () => {
		const err = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const caigut = proveidorFals(true);
		const o = { url: url(), cims: CIMS_PROVA, proveidor: caigut };
		expect((await respostaMeteoAra({ ...o, ara: () => T0 })).status).toBe(502);
		const enRepos = await respostaMeteoAra({ ...o, ara: () => new Date(T0.getTime() + 30_000) });
		expect(enRepos.status).toBe(503);
		expect(enRepos.headers.get('retry-after')).toBe(String(RETRY_AFTER_ARA_S));
		expect(caigut.crides).toBe(1);
		await respostaMeteoAra({
			...o,
			ara: () => new Date(T0.getTime() + REPOS_DESPRES_ERROR_MS + 1000)
		});
		expect(caigut.crides).toBe(2);
		err.mockRestore();
	});

	it('la ruta estàtica `ara` no xoca amb cap cim i el SW la coneix', () => {
		expect(cimPerSlug('ara')).toBeUndefined();
		expect(CAMI_METEO_ARA_SW).toBe(CAMI_METEO_ARA);
		// Tots els cims del catàleg hi caben en una sola llista (`?slugs=`).
		expect(CIMS.length).toBeLessThanOrEqual(MAX_SLUGS_METEO_ARA);
	});
});

describe('client obtenirMeteoAra (mai llança)', () => {
	const foto: MeteoAra = {
		actualitzat: '2026-10-18T07:00:00.000Z',
		hora: '2026-10-18T08:45',
		font: FONT_OPEN_METEO,
		cims: {
			canigo: { categoria: 'nuvol', codi: 3, temperatura: 0, esDia: true },
			montcau: { categoria: 'sol', codi: 61, temperatura: 9, esDia: true },
			'Mal-format': { categoria: 'sol', codi: 0, temperatura: 9, esDia: true }
		}
	};
	const ambResposta = (r: Response | Error) =>
		(async (u: string) => {
			ambResposta.darrera = u;
			if (r instanceof Error) throw r;
			return r;
		}) as unknown as typeof fetch;
	ambResposta.darrera = '';

	it('camí: ordenat i sense repetits; límits', () => {
		expect(camiMeteoAra()).toBe('/api/meteo/ara');
		expect(camiMeteoAra(['montcau', 'canigo', 'montcau'])).toBe(
			'/api/meteo/ara?slugs=canigo,montcau'
		);
		expect(() => camiMeteoAra([])).toThrow(RangeError);
		expect(() => camiMeteoAra(['a/b'])).toThrow(RangeError);
	});

	it('resposta bona → dades; entrades incoherents o mal formades descartades', async () => {
		const res = await obtenirMeteoAra({
			slugs: ['canigo'],
			fetch: ambResposta(new Response(JSON.stringify(foto), { status: 200 }))
		});
		expect(ambResposta.darrera).toBe('/api/meteo/ara?slugs=canigo');
		expect(res?.cims).toEqual({ canigo: foto.cims.canigo });
		expect(res?.font.nom).toBe('Open-Meteo');
	});

	it('sense xarxa, HTTP d’error, JSON dolent, slugs invàlids o cancel·lat → null', async () => {
		expect(await obtenirMeteoAra({ fetch: ambResposta(new TypeError('offline')) })).toBeNull();
		expect(
			await obtenirMeteoAra({ fetch: ambResposta(new Response('{}', { status: 502 })) })
		).toBeNull();
		expect(
			await obtenirMeteoAra({ fetch: ambResposta(new Response('<html>', { status: 200 })) })
		).toBeNull();
		expect(
			await obtenirMeteoAra({ fetch: ambResposta(new Response('{"cims":{}}', { status: 200 })) })
		).toBeNull();
		expect(await obtenirMeteoAra({ slugs: [], fetch: ambResposta(new Response('{}')) })).toBeNull();
		const c = new AbortController();
		c.abort();
		expect(
			await obtenirMeteoAra({
				signal: c.signal,
				fetch: ambResposta(new DOMException('x', 'AbortError'))
			})
		).toBeNull();
	});
});
