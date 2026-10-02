/**
 * Instantània dels noms d'icona del sprite de l'ICGC que fan servir els estils del mapa
 * (`src/lib/platform/mapa-estil.ts`). `transformarEstil` la usa per no demanar a MapLibre
 * icones que el sprite no té (avisos "Image … could not be loaded"; sense icona el mapa es veu
 * igual). Torneu-la a generar si l'ICGC canvia el sprite:
 *
 *   node --experimental-strip-types scripts/mapa/sprite-icgc.ts
 *
 * Font: https://geoserveis.icgc.cat/vector-tiles/simbologia/sprites1/sprite.json (CC BY 4.0).
 */
import { writeFileSync } from 'node:fs';

const URL_SPRITE = 'https://geoserveis.icgc.cat/vector-tiles/simbologia/sprites1/sprite.json';
const SORTIDA = new URL('../../src/lib/platform/sprite-icgc.json', import.meta.url);

const resposta = await fetch(URL_SPRITE);
if (!resposta.ok) throw new Error(`${URL_SPRITE}: HTTP ${resposta.status}`);
const sprite = (await resposta.json()) as Record<string, unknown>;
const noms = Object.keys(sprite).sort();
if (noms.length < 100) throw new Error(`Sprite sospitós: només ${noms.length} icones`);

const dades = {
	font: URL_SPRITE,
	data: new Date().toISOString().slice(0, 10),
	noms
};
writeFileSync(SORTIDA, JSON.stringify(dades, null, '\t') + '\n');
console.log(`${noms.length} icones → ${SORTIDA.pathname}`);
