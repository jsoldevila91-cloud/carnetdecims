// El fitxer del worker de MapLibre no porta tipus propis (vegeu `maplibre-worker.ts`).
declare module 'maplibre-gl/dist/maplibre-gl-worker.mjs' {
	const MaplibreWorker: new (scope: never) => unknown;
	export default MaplibreWorker;
}
