/**
 * Entrada del web worker de MapLibre. MapLibre 6 el busca al costat del seu mòdul
 * (`import.meta.url`), cosa que no funciona un cop empaquetat per Vite: aquí s'empaqueta com a
 * worker propi (`?worker&url`) i `motor.ts` en passa l'URL amb `setWorkerUrl`.
 *
 * El `package.json` de MapLibre declara `dist/*.mjs` sense efectes secundaris, i en el build el
 * `self.worker = new Worker(self)` del mòdul s'elimina (el worker quedava buit). Per això el
 * creem aquí; en desenvolupament (sense tree-shaking) el mòdul ja l'ha creat i no es duplica.
 */
import MaplibreWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs';

const ambit = self as unknown as { worker?: unknown };
ambit.worker ??= new MaplibreWorker(self as never);
