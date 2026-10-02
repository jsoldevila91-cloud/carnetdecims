/**
 * Service worker des de la pàgina (implementació web). Contracte per a la UI de la PWA:
 *
 * - `registrarServiceWorker()`: registra `/service-worker.js` (scope `/`). En dev no fa res
 *   tret que `VITE_SW_DEV=true` (llavors el registra com a mòdul, que és com el serveix Vite).
 * - `estatSW`: store `{ actualitzacioDisponible, llestOffline }`.
 *   - `llestOffline`: hi ha un SW actiu amb el precache complet (la pàgina funciona sense xarxa).
 *   - `actualitzacioDisponible`: una versió nova ja s'ha instal·lat i espera (no s'activa sola).
 * - `aplicarActualitzacio()`: activa la versió en espera i recarrega la pàgina quan pren el
 *   control (`controllerchange`). Sense versió en espera no fa res.
 * - `precarregarFitxes(slugs)`: demana al SW que baixi en segon pla aquestes fitxes (idioma
 *   actual) a la cache de pàgines, només amb bona connexió (`sw/connexio.ts`). Es resol quan
 *   el SW acaba (o al cap d'un minut); no falla mai.
 *
 * Les estratègies de cache són a `src/service-worker.ts` i `platform/sw/`.
 */
import { readonly, writable, type Readable } from 'svelte/store';
import { browser, dev } from '$app/environment';
import { getLocale } from '$lib/paraglide/runtime';
import { connexioPermetPrecarrega, type InfoConnexio } from './sw/connexio';
import { MISSATGE, camiFitxa, type LocaleSW } from './sw/estrategia';

export type EstatSW = { actualitzacioDisponible: boolean; llestOffline: boolean };

const estat = writable<EstatSW>({ actualitzacioDisponible: false, llestOffline: false });
export const estatSW: Readable<EstatSW> = readonly(estat);

const URL_SW = '/service-worker.js';
/** Comprova si hi ha versió nova en tornar a la pestanya, com a molt un cop cada hora. */
const INTERVAL_COMPROVACIO_MS = 60 * 60 * 1000;
const TEMPS_MAX_PRECARREGA_MS = 60 * 1000;

let registre: ServiceWorkerRegistration | null = null;
let registrant: Promise<void> | null = null;

function swDisponible(): boolean {
	return browser && 'serviceWorker' in navigator;
}

function actualitza(canvis: Partial<EstatSW>): void {
	estat.update((e) => ({ ...e, ...canvis }));
}

/** Segueix un SW que s'està instal·lant fins que queda instal·lat o actiu. */
function segueix(worker: ServiceWorker): void {
	const comprova = () => {
		if (worker.state === 'installed' && navigator.serviceWorker.controller) {
			// Ja hi ha una versió controlant la pàgina: la nova espera l'usuari.
			actualitza({ actualitzacioDisponible: true });
		} else if (worker.state === 'activated') {
			actualitza({ llestOffline: true });
		}
	};
	comprova();
	worker.addEventListener('statechange', comprova);
}

export function registrarServiceWorker(): Promise<void> {
	if (!swDisponible()) return Promise.resolve();
	if (dev && import.meta.env.VITE_SW_DEV !== 'true') return Promise.resolve();
	registrant ??= (async () => {
		try {
			// Si ja hi havia un SW controlant la pàgina, un canvi de controlador vol dir que una
			// versió nova s'ha activat (des d'aquesta pestanya o una altra): es recarrega per no
			// barrejar el JS antic amb les caches noves. En la primera instal·lació (`claim()`) no.
			const teniaControlador = navigator.serviceWorker.controller !== null;
			navigator.serviceWorker.addEventListener('controllerchange', () => {
				if (teniaControlador || actualitzacioDemanada) recarrega();
			});
			const reg = await navigator.serviceWorker.register(URL_SW, {
				scope: '/',
				type: dev ? 'module' : 'classic',
				updateViaCache: 'none'
			});
			registre = reg;
			if (reg.active?.state === 'activated') actualitza({ llestOffline: true });
			else if (reg.active) segueix(reg.active);
			if (reg.waiting && navigator.serviceWorker.controller) {
				actualitza({ actualitzacioDisponible: true });
			}
			if (reg.installing) segueix(reg.installing);
			reg.addEventListener('updatefound', () => {
				if (reg.installing) segueix(reg.installing);
			});

			let darrera = Date.now();
			document.addEventListener('visibilitychange', () => {
				if (document.visibilityState !== 'visible') return;
				if (Date.now() - darrera < INTERVAL_COMPROVACIO_MS) return;
				darrera = Date.now();
				reg.update().catch(() => undefined);
			});
		} catch (error) {
			// Sense SW la web funciona igual (només en línia): no es mostra cap error.
			console.warn('[pwa] No s’ha pogut registrar el service worker', error);
		}
	})();
	return registrant;
}

let recarregant = false;
let actualitzacioDemanada = false;

function recarrega(): void {
	if (recarregant) return;
	recarregant = true;
	window.location.reload();
}

export async function aplicarActualitzacio(): Promise<void> {
	if (!swDisponible()) return;
	const reg = registre ?? (await navigator.serviceWorker.getRegistration('/')) ?? null;
	const enEspera = reg?.waiting;
	if (!enEspera) return;
	actualitzacioDemanada = true;
	await new Promise<void>((resolt) => {
		navigator.serviceWorker.addEventListener(
			'controllerchange',
			() => {
				recarrega();
				resolt();
			},
			{ once: true }
		);
		enEspera.postMessage({ type: MISSATGE.skipWaiting });
	});
}

export async function precarregarFitxes(slugs: string[]): Promise<void> {
	if (!swDisponible() || slugs.length === 0) return;
	const connexio = (navigator as Navigator & { connection?: InfoConnexio }).connection;
	if (!connexioPermetPrecarrega(connexio, navigator.onLine)) return;
	const actiu = (registre ?? (await navigator.serviceWorker.getRegistration('/')))?.active;
	if (!actiu) return;
	const locale = getLocale() as LocaleSW;
	const urls: string[] = [];
	for (const slug of slugs) {
		try {
			urls.push(camiFitxa(slug, locale));
		} catch {
			// slug invàlid: s'omet
		}
	}
	if (urls.length === 0) return;
	await new Promise<void>((resolt) => {
		const canal = new MessageChannel();
		const temps = setTimeout(resolt, TEMPS_MAX_PRECARREGA_MS);
		canal.port1.onmessage = () => {
			clearTimeout(temps);
			canal.port1.close();
			resolt();
		};
		actiu.postMessage({ type: MISSATGE.precarregar, urls }, [canal.port2]);
	});
}
