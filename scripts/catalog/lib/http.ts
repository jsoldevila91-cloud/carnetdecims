/**
 * `fetch` amb caché en disc i ritme lent per amfitrió.
 *
 * - Totes les respostes es desen a `scripts/catalog/.cache/<font>/<sha1>.txt` (ignorat a git),
 *   de manera que el build és reproduïble i no torna a consultar els serveis.
 * - `CATALOG_OFFLINE=1` fa fallar qualsevol petició que no sigui a la caché.
 * - `CATALOG_REFRESH=1` ignora la caché i torna a consultar (respectant el ritme).
 * - User-Agent identificable, com demanen les polítiques d'ús d'OSM/Overpass i Wikidata.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export const USER_AGENT =
	'carnetdecims.cat catalog script (+https://carnetdecims.cat; build puntual del catàleg)';

const CACHE_DIR = join(import.meta.dirname, '..', '.cache');
const OFFLINE = process.env.CATALOG_OFFLINE === '1';
const REFRESH = process.env.CATALOG_REFRESH === '1';

/** Pausa mínima entre peticions al mateix amfitrió (ms). */
const RITME: Record<string, number> = {
	'overpass-api.de': 10_000,
	'query.wikidata.org': 5_000,
	default: 1_100
};
const darrera = new Map<string, number>();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const estadistiques = { cache: 0, xarxa: 0 };

export interface Peticio {
	/** Subcarpeta de la caché (`icgc`, `osm`...). */
	font: string;
	url: string;
	method?: 'GET' | 'POST';
	body?: string;
	headers?: Record<string, string>;
	/** Si retorna `false`, la resposta (encara que sigui 200) no es desa i es llança un error. */
	valida?: (text: string) => boolean;
}

function clau(p: Peticio) {
	return createHash('sha1')
		.update(`${p.method ?? 'GET'} ${p.url}\n${p.body ?? ''}`)
		.digest('hex');
}

/** Retorna el cos de la resposta com a text (de la caché si hi és). */
export async function fetchText(p: Peticio): Promise<string> {
	const fitxer = join(CACHE_DIR, p.font, `${clau(p)}.txt`);
	if (!REFRESH) {
		try {
			const t = await readFile(fitxer, 'utf8');
			estadistiques.cache++;
			return t;
		} catch {
			/* no és a la caché */
		}
	}
	if (OFFLINE) throw new Error(`CATALOG_OFFLINE=1 i no hi ha caché per a ${p.url}`);

	const host = new URL(p.url).host;
	const pausa = RITME[host] ?? RITME.default;
	for (let intent = 1; ; intent++) {
		const espera = (darrera.get(host) ?? 0) + pausa - Date.now();
		if (espera > 0) await sleep(espera);
		darrera.set(host, Date.now());
		const res = await fetch(p.url, {
			method: p.method ?? 'GET',
			body: p.body,
			headers: { 'User-Agent': USER_AGENT, ...p.headers }
		});
		const text = await res.text();
		if (res.ok) {
			estadistiques.xarxa++;
			if (p.valida && !p.valida(text)) {
				throw new Error(`Resposta no vàlida de ${p.url}\n${text.slice(0, 300)}`);
			}
			await mkdir(dirname(fitxer), { recursive: true });
			await writeFile(fitxer, text, 'utf8');
			return text;
		}
		if ((res.status === 429 || res.status >= 500) && intent < 4) {
			await sleep(pausa * intent * 3);
			continue;
		}
		throw new Error(`HTTP ${res.status} ${p.url}\n${text.slice(0, 300)}`);
	}
}

export async function fetchJson<T>(p: Peticio): Promise<T> {
	return JSON.parse(await fetchText(p)) as T;
}
