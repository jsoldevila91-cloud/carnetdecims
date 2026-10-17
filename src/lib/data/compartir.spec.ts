import { describe, expect, it } from 'vitest';
import { CIMS } from '$lib/data/catalog';
import {
	CODIS_REPTE_COMPARTIT,
	aBase64Url,
	codificaCarnet,
	esErrorCarnet,
	type AscensioCompartida,
	type Cim,
	type DataISO
} from '$lib/domain';
import { comprimeix } from '$lib/platform/compressio';
import { MAX_CARACTERS_FRAGMENT, enllacCarnet, fragmentCarnet, llegeixEnllac } from './compartir';

const AVUI = '2026-10-17';

function sumarDies(data: DataISO, n: number): DataISO {
	const [y, m, d] = data.split('-').map(Number);
	return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Generador pseudoaleatori determinista (mulberry32). */
function rng(llavor: number) {
	let s = llavor >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = s;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Cas realista: cims diferents, dates repartides en `anys` anys fins a AVUI. */
function carnet(ids: number[], anys: number, llavor = 1): AscensioCompartida[] {
	const r = rng(llavor);
	const inici = sumarDies(AVUI, -Math.round(anys * 365.25));
	return ids.map((cimId) => ({ cimId, data: sumarDies(inici, Math.floor(r() * anys * 365)) }));
}

/** Catàleg sintètic de 522 cims (el real encara en té 150). */
const CATALEG_522: Cim[] = Array.from({ length: 522 }, (_, i) => ({
	...CIMS[i % CIMS.length],
	id: i + 1
}));

describe('enllacCarnet / llegeixEnllac', () => {
	it('forma de l’enllaç per idioma', async () => {
		const entrada = { ascensions: [{ cimId: 1, data: '2020-01-01' }] };
		const ca = await enllacCarnet('https://carnetdecims.cat/', 'ca', entrada);
		const es = await enllacCarnet('https://carnetdecims.cat', 'es', entrada);
		expect(ca).toMatch(/^https:\/\/carnetdecims\.cat\/ca\/carnet#c=[A-Za-z0-9_-]+$/);
		expect(es).toMatch(/^https:\/\/carnetdecims\.cat\/es\/carnet#c=[A-Za-z0-9_-]+$/);
	});

	it('round-trip amb el catàleg real, des de l’URL, el fragment o el valor', async () => {
		const ascensions = carnet(
			CIMS.slice(0, 100).map((c) => c.id),
			8
		);
		const url = await enllacCarnet('https://carnetdecims.cat', 'ca', { nom: 'JSR', ascensions });
		const fragment = url.slice(url.indexOf('#'));
		for (const entrada of [url, fragment, fragment.slice(1)]) {
			const r = await llegeixEnllac(entrada, CIMS, AVUI);
			if (esErrorCarnet(r)) throw new Error(r.error);
			expect(r.nom).toBe('JSR');
			expect(r.descartades).toBe(0);
			expect(r.ascensions).toHaveLength(100);
			expect(new Set(r.ascensions.map((a) => a.cimId))).toEqual(
				new Set(ascensions.map((a) => a.cimId))
			);
		}
	});

	it('mida: 100 ascensions + 10 medalles < 1.000 caràcters de fragment; 500 també cabent en un URL', async () => {
		const medalles = CODIS_REPTE_COMPARTIT.slice(0, 10).map((repteId, i) => ({
			repteId,
			nivell: 1,
			data: sumarDies('2019-03-01', i * 97)
		}));
		const entrada100 = {
			nom: 'Nom de quaranta caràcters per a la prova',
			ascensions: carnet(
				CIMS.slice(0, 100).map((c) => c.id),
				8
			),
			medalles
		};
		const f100 = await fragmentCarnet(entrada100);
		const r100 = await llegeixEnllac(`#c=${f100}`, CIMS, AVUI);
		expect(!esErrorCarnet(r100) && r100.medalles).toEqual(medalles);
		const f500 = await fragmentCarnet({
			ascensions: carnet(
				CATALEG_522.slice(0, 500).map((c) => c.id),
				20
			)
		});
		expect(f100.length).toBeLessThan(1000);
		expect(f500.length).toBeLessThan(2500);
		const r = await llegeixEnllac(`#c=${f500}`, CATALEG_522, AVUI);
		expect(!esErrorCarnet(r) && r.ascensions.length).toBe(500);
	});

	it('errors: buit, base64, compressió, versió, format i massa gran', async () => {
		expect(await llegeixEnllac('', CIMS, AVUI)).toEqual({ error: 'buit' });
		expect(await llegeixEnllac('#', CIMS, AVUI)).toEqual({ error: 'buit' });
		expect(await llegeixEnllac('#x=abc', CIMS, AVUI)).toEqual({ error: 'buit' });
		expect(await llegeixEnllac('#c=', CIMS, AVUI)).toEqual({ error: 'buit' });
		expect(await llegeixEnllac('#c=ab+c', CIMS, AVUI)).toEqual({ error: 'base64' });
		expect(await llegeixEnllac('#c=A', CIMS, AVUI)).toEqual({ error: 'base64' });
		expect(await llegeixEnllac('#c=YWJj%3D', CIMS, AVUI)).toEqual({ error: 'base64' });
		// Capçalera de compressió desconeguda (9)
		expect(await llegeixEnllac(`#c=${aBase64Url(Uint8Array.from([9, 1]))}`, CIMS, AVUI)).toEqual({
			error: 'compressio'
		});
		// Deflate corrupte
		expect(
			await llegeixEnllac(`#c=${aBase64Url(Uint8Array.from([1, 0xff, 0xfe]))}`, CIMS, AVUI)
		).toEqual({ error: 'compressio' });
		// Versió 2 sense comprimir
		expect(
			await llegeixEnllac(`#c=${aBase64Url(Uint8Array.from([0, 2, 0, 0]))}`, CIMS, AVUI)
		).toEqual({ error: 'versio' });
		// Truncat
		expect(
			await llegeixEnllac(`#c=${aBase64Url(Uint8Array.from([0, 1, 0, 3, 0]))}`, CIMS, AVUI)
		).toEqual({ error: 'format' });
		expect(await llegeixEnllac(`#c=${'A'.repeat(MAX_CARACTERS_FRAGMENT + 4)}`, CIMS, AVUI)).toEqual(
			{ error: 'massa-gran' }
		);
		expect(await llegeixEnllac(`#${'x'.repeat(MAX_CARACTERS_FRAGMENT * 3)}`, CIMS, AVUI)).toEqual({
			error: 'massa-gran'
		});
	});

	it('bomba de descompressió dins de l’enllaç → compressio', async () => {
		const bomba = await comprimeix(new Uint8Array(2_000_000).fill(1));
		const r = await llegeixEnllac(`#c=${aBase64Url(bomba)}`, CIMS, AVUI);
		expect(r).toEqual({ error: 'compressio' });
	});

	it('cims desconeguts i dates futures es compten com a descartades', async () => {
		const bytes = codificaCarnet({
			ascensions: [
				{ cimId: 1, data: '2020-01-01' },
				{ cimId: 9999, data: '2020-01-01' },
				{ cimId: 2, data: '2030-01-01' }
			]
		});
		const r = await llegeixEnllac(`#c=${aBase64Url(await comprimeix(bytes))}`, CIMS, AVUI);
		expect(r).toEqual({
			ascensions: [{ cimId: 1, data: '2020-01-01' }],
			descartades: 2,
			medalles: []
		});
	});
});
