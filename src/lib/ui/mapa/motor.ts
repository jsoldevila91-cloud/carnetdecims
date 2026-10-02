/**
 * Motor del mapa interactiu (bloc 4c): MapLibre GL + estil vectorial de l'ICGC.
 *
 * Aquest mòdul (i MapLibre, ~250 kB gzip) només es carrega amb `import()` des de `/mapa`: cap
 * altra pàgina no l'inclou. La UI (controls, filtres, full del cim) és Svelte; aquí només hi ha
 * el mapa i una API petita i imperativa.
 *
 * - Una sola font GeoJSON amb `cluster` (docs/05 §3); els filtres regeneren les dades
 *   (`setDades`) perquè els clústers comptin només els cims visibles.
 * - Icones i clústers dibuixats amb `<canvas>` amb els colors del tema (`dibuix.ts`), sota
 *   demanda (`styleimagemissing`): en canviar de tema es tornen a dibuixar.
 * - Amb `prefers-reduced-motion`, cap animació de càmera (salts directes).
 */
import 'maplibre-gl/dist/maplibre-gl.css';
import {
	AttributionControl,
	Map as MapLibreMap,
	setWorkerUrl,
	type GeoJSONSource,
	type LngLatBoundsLike,
	type MapGeoJSONFeature,
	type StyleSpecification
} from 'maplibre-gl';
import workerUrl from './maplibre-worker?worker&url';
import {
	CAPA_IGN_ID,
	estilMapa,
	mostraRespatllaIgn,
	transformarEstil,
	type TemaMapa
} from '$lib/platform/mapa-estil';
import type { GeojsonCims } from '$lib/data/catalog/geojson';
import type { Punt } from '$lib/domain';
import {
	dibuixarCluster,
	dibuixarMarcador,
	idMarcador,
	paletaDelTema,
	TIPUS_MARCADORS,
	type PaletaMapa,
	type TipusMarcador
} from './dibuix';
import { ZOOM_CIM, idCluster, llegirIdCluster } from './vista';

setWorkerUrl(workerUrl);

export const FONT_CIMS = 'carnet-cims';
export const FONT_JO = 'carnet-jo';
export const CAPA_CLUSTERS = 'carnet-clusters';
export const CAPA_PUNTS = 'carnet-punts';
export const CAPA_NOMS = 'carnet-noms';
export const CAPA_SEL = 'carnet-seleccio';
export const CAPA_JO = 'carnet-jo';

/** Radi de tolerància (px) per tocar un marcador amb el dit. */
const TOLERANCIA_PX = 16;

export interface TextosMapa {
	/** `aria-label` del canvas (regió del mapa). */
	regio: string;
}

export interface OpcionsMotor {
	contenidor: HTMLElement;
	tema: TemaMapa;
	/** Extensió inicial (la de la imatge estàtica que el mapa substitueix). */
	limits: LngLatBoundsLike;
	/** Si n'hi ha, el mapa s'obre centrat en aquest punt a `ZOOM_CIM`. */
	centre?: Punt | null;
	dades: GeojsonCims;
	seleccionat: string | null;
	movimentReduit: boolean;
	textos: TextosMapa;
	onseleccio: (slug: string) => void;
	/** En avortar-se (la pàgina es desmunta) abans de 'load', el mapa es destrueix i es rebutja. */
	senyal?: AbortSignal;
}

export interface MotorMapa {
	setDades(dades: GeojsonCims): void;
	setSeleccionat(slug: string | null): void;
	/** Centra el mapa en un punt (sense canviar el zoom si ja és prou a prop). */
	centrar(p: Punt, opcions?: { zoom?: number; desplacamentY?: number }): void;
	setTema(tema: TemaMapa): void;
	setPosicioUsuari(p: Punt | null): void;
	zoom(delta: 1 | -1): void;
	setMovimentReduit(reduit: boolean): void;
	redimensionar(): void;
	destruir(): void;
}

function puntGeojson(p: Punt | null) {
	return {
		type: 'FeatureCollection' as const,
		features: p
			? [
					{
						type: 'Feature' as const,
						properties: {},
						geometry: { type: 'Point' as const, coordinates: [p.lon, p.lat] }
					}
				]
			: []
	};
}

/** Afegeix les fonts i capes pròpies a l'estil base (dins de `transformStyle`). */
function ambCapesPropies(
	estil: StyleSpecification,
	dades: GeojsonCims,
	jo: Punt | null,
	seleccionat: string | null
): StyleSpecification {
	const fet = ['==', ['get', 'estat'], 'fet'];
	const sources = {
		...estil.sources,
		[FONT_CIMS]: {
			type: 'geojson' as const,
			data: dades,
			cluster: true,
			clusterRadius: 48,
			clusterMaxZoom: 11,
			clusterProperties: { fets: ['+', ['case', fet, 1, 0]] }
		},
		[FONT_JO]: { type: 'geojson' as const, data: puntGeojson(jo) }
	};
	const layers = [
		...estil.layers.filter((l) => !l.id.startsWith('carnet-')),
		{
			id: CAPA_SEL,
			type: 'symbol' as const,
			source: FONT_CIMS,
			filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'slug'], seleccionat ?? '']],
			layout: {
				'icon-image': idMarcador('sel'),
				'icon-allow-overlap': true,
				'icon-ignore-placement': true
			}
		},
		{
			id: CAPA_CLUSTERS,
			type: 'symbol' as const,
			source: FONT_CIMS,
			filter: ['has', 'point_count'],
			layout: {
				'icon-image': ['concat', 'cl:', ['get', 'point_count'], ':', ['get', 'fets']],
				'icon-allow-overlap': true,
				'icon-ignore-placement': true
			}
		},
		{
			id: CAPA_PUNTS,
			type: 'symbol' as const,
			source: FONT_CIMS,
			filter: ['!', ['has', 'point_count']],
			layout: {
				'icon-image': [
					'case',
					['get', 'essencial'],
					['case', fet, idMarcador('ess-fet'), idMarcador('ess')],
					['case', fet, idMarcador('cim-fet'), idMarcador('cim')]
				],
				'icon-allow-overlap': true,
				'icon-ignore-placement': true,
				// Els essencials, i dins de cada grup els més alts, a sobre.
				'symbol-sort-key': ['+', ['case', ['get', 'essencial'], 10000, 0], ['get', 'altitud']]
			}
		},
		{
			id: CAPA_NOMS,
			type: 'symbol' as const,
			source: FONT_CIMS,
			minzoom: 10,
			filter: ['!', ['has', 'point_count']],
			layout: {
				'text-field': ['get', 'nom'],
				// Fonts dels glifs de l'estil ICGC (clar i fosc).
				'text-font': ['FiraSans-Bold'],
				'text-size': 12,
				'text-offset': [0, 1.1],
				'text-anchor': 'top',
				'text-optional': true,
				'symbol-sort-key': ['-', 0, ['get', 'altitud']]
			},
			paint: {
				'text-color': '#1b2a47',
				'text-halo-color': '#fbf8f1',
				'text-halo-width': 1.6
			}
		},
		{
			id: CAPA_JO,
			type: 'symbol' as const,
			source: FONT_JO,
			layout: {
				'icon-image': idMarcador('jo'),
				'icon-allow-overlap': true,
				'icon-ignore-placement': true
			}
		}
	];
	return { ...estil, sources, layers } as StyleSpecification;
}

/**
 * Crea el mapa i espera que l'estil base s'hagi carregat.
 * @throws si el navegador no pot crear el context WebGL o l'estil no carrega.
 */
export function crearMotor(o: OpcionsMotor): Promise<MotorMapa> {
	let dades = o.dades;
	let seleccionat = o.seleccionat;
	let jo: Punt | null = null;
	let tema = o.tema;
	let reduit = o.movimentReduit;
	let paleta: PaletaMapa = paletaDelTema();

	const map = new MapLibreMap({
		container: o.contenidor,
		bounds: o.limits,
		fitBoundsOptions: { padding: 0 },
		...(o.centre ? { center: [o.centre.lon, o.centre.lat], zoom: ZOOM_CIM } : {}),
		minZoom: 5,
		maxZoom: 17,
		maxBounds: [
			[-3.5, 39],
			[6.5, 44.6]
		],
		attributionControl: false,
		dragRotate: false,
		pitchWithRotate: false,
		touchPitch: false,
		fadeDuration: reduit ? 0 : 300,
		locale: { 'Map.Title': o.textos.regio },
		cancelPendingTileRequestsWhileZooming: true
	});
	map.touchZoomRotate.disableRotation();
	map.keyboard.disableRotation();
	map.addControl(
		new AttributionControl({ compact: false, customAttribution: undefined }),
		'bottom-right'
	);

	const aplicarEstil = () =>
		map.setStyle(estilMapa(tema), {
			transformStyle: (anterior, seguent) =>
				ambCapesPropies(transformarEstil(tema)(anterior, seguent), dades, jo, seleccionat)
		});

	// Icones sota demanda: marcadors (`mk:*`) i clústers (`cl:n:fets`). A MapLibre 6 l'esdeveniment
	// `styleimagemissing` arriba quan la tessel·la ja s'ha resolt sense la icona (es perdia en
	// canviar els filtres); el resolutor, en canvi, s'espera abans de donar-la per absent.
	const afegirIcona = (id: string) => {
		if (map.hasImage(id)) return;
		if (id.startsWith('mk:')) {
			const tipus = id.slice(3) as TipusMarcador;
			if (!TIPUS_MARCADORS.includes(tipus)) return;
			const img = dibuixarMarcador(tipus, paleta);
			map.addImage(id, img.data, { pixelRatio: img.pixelRatio });
			return;
		}
		const cl = llegirIdCluster(id);
		if (cl) {
			const img = dibuixarCluster(cl.n, cl.fets, paleta);
			map.addImage(idCluster(cl.n, cl.fets), img.data, { pixelRatio: img.pixelRatio });
		}
	};
	map.setMissingStyleImageResolver(afegirIcona);
	// Els marcadors (pocs i coneguts) es registren d'entrada a cada estil.
	map.on('style.load', () => {
		for (const t of TIPUS_MARCADORS) afegirIcona(idMarcador(t));
	});

	const colorsText = () => {
		if (!map.getLayer(CAPA_NOMS)) return;
		map.setPaintProperty(CAPA_NOMS, 'text-color', paleta.ink);
		map.setPaintProperty(CAPA_NOMS, 'text-halo-color', paleta.card);
	};

	const actualitzarIgn = () => {
		if (!map.getLayer(CAPA_IGN_ID)) return;
		const visible = mostraRespatllaIgn(map.getCenter(), map.getZoom());
		map.setLayoutProperty(CAPA_IGN_ID, 'visibility', visible ? 'visible' : 'none');
	};
	map.on('moveend', actualitzarIgn);
	map.on('style.load', () => {
		colorsText();
		actualitzarIgn();
	});

	// Tocs: el marcador més proper dins d'un radi (els dits són més grossos que les icones).
	map.on('click', (e) => {
		const { x, y } = e.point;
		const trobats = map.queryRenderedFeatures(
			[
				[x - TOLERANCIA_PX, y - TOLERANCIA_PX],
				[x + TOLERANCIA_PX, y + TOLERANCIA_PX]
			],
			{ layers: [CAPA_PUNTS, CAPA_CLUSTERS] }
		);
		if (trobats.length === 0) return;
		const dist = (f: MapGeoJSONFeature) => {
			const [lon, lat] = (f.geometry as GeoJSON.Point).coordinates;
			const p = map.project([lon, lat]);
			return (p.x - x) ** 2 + (p.y - y) ** 2;
		};
		const f = trobats.reduce((a, b) => (dist(b) < dist(a) ? b : a));
		if (f.properties.cluster) {
			const font = map.getSource<GeoJSONSource>(FONT_CIMS);
			const [lon, lat] = (f.geometry as GeoJSON.Point).coordinates;
			void font
				?.getClusterExpansionZoom(f.properties.cluster_id as number)
				.then((zoom) =>
					map.easeTo({ center: [lon, lat], zoom: Math.min(zoom + 0.5, 17), animate: !reduit })
				)
				.catch(() => {});
			return;
		}
		o.onseleccio(String(f.properties.slug));
	});

	let sobre = false;
	map.on('mousemove', (e) => {
		const { x, y } = e.point;
		const hi = map.queryRenderedFeatures(
			[
				[x - 6, y - 6],
				[x + 6, y + 6]
			],
			{ layers: [CAPA_PUNTS, CAPA_CLUSTERS] }
		);
		const ara = hi.length > 0;
		if (ara !== sobre) {
			sobre = ara;
			map.getCanvas().style.cursor = ara ? 'pointer' : '';
		}
	});

	const motor: MotorMapa = {
		setDades(d) {
			dades = d;
			map.getSource<GeoJSONSource>(FONT_CIMS)?.setData(d);
		},
		setSeleccionat(slug) {
			seleccionat = slug;
			if (map.getLayer(CAPA_SEL))
				map.setFilter(CAPA_SEL, [
					'all',
					['!', ['has', 'point_count']],
					['==', ['get', 'slug'], slug ?? '']
				]);
		},
		centrar(p, opcions = {}) {
			const zoom = Math.max(map.getZoom(), opcions.zoom ?? ZOOM_CIM);
			const offset: [number, number] = [0, -(opcions.desplacamentY ?? 0)];
			if (reduit) map.jumpTo({ center: [p.lon, p.lat], zoom });
			else map.easeTo({ center: [p.lon, p.lat], zoom, offset, duration: 600 });
			if (reduit && offset[1] !== 0) map.panBy([0, -offset[1]], { animate: false });
		},
		setTema(t) {
			if (t === tema) return;
			tema = t;
			paleta = paletaDelTema();
			// Les icones del tema anterior es treuen: el resolutor les torna a dibuixar.
			for (const id of map.listImages())
				if (id.startsWith('mk:') || id.startsWith('cl:')) map.removeImage(id);
			aplicarEstil();
		},
		setPosicioUsuari(p) {
			jo = p;
			map.getSource<GeoJSONSource>(FONT_JO)?.setData(puntGeojson(p));
		},
		zoom(delta) {
			if (delta > 0) map.zoomIn({ animate: !reduit });
			else map.zoomOut({ animate: !reduit });
		},
		setMovimentReduit(r) {
			reduit = r;
		},
		redimensionar() {
			map.resize();
		},
		destruir() {
			map.remove();
		}
	};

	return new Promise((resolve, reject) => {
		let acabat = false;
		const falla = (error: unknown) => {
			if (acabat) return;
			acabat = true;
			clearTimeout(limit);
			map.remove();
			reject(error instanceof Error ? error : new Error(String(error)));
		};
		// Sense cobertura l'estil pot no arribar mai: la UI ofereix la llista i tornar-ho a provar.
		const limit = setTimeout(() => falla(new Error('Temps esgotat carregant el mapa')), 25_000);
		// Abans de 'load', només l'error de l'estil base impedeix el mapa (les tessel·les o els
		// glifs que fallen no el trenquen).
		const errorInicial = (e: { error: unknown }) => {
			const url = (e.error as { url?: unknown } | undefined)?.url;
			if (typeof url === 'string' && url === estilMapa(tema)) falla(e.error);
		};
		map.on('error', errorInicial);
		// Sortir de la pàgina mentre es carrega: es destrueix el mapa (i les peticions pendents).
		const avorta = () => falla(new DOMException('Mapa desmuntat', 'AbortError'));
		if (o.senyal?.aborted) avorta();
		o.senyal?.addEventListener('abort', avorta, { once: true });
		map.once('load', () => {
			if (acabat) return;
			acabat = true;
			clearTimeout(limit);
			map.off('error', errorInicial);
			o.senyal?.removeEventListener('abort', avorta);
			// Tessel·les que fallen (sense cobertura): el mapa continua amb el que té.
			map.on('error', (e) => {
				if (!('sourceId' in e) && !('tile' in e)) console.warn('[mapa]', e.error);
			});
			resolve(motor);
		});
		if (!acabat) aplicarEstil();
	});
}
