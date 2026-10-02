import { describe, expect, it } from 'vitest';
import { calculaDiferits, type ChunkResum } from './diferits';

const chunk = (c: Partial<ChunkResum> & { fileName: string }): ChunkResum => ({
	isEntry: false,
	isDynamicEntry: false,
	modul: null,
	imports: [],
	css: [],
	assets: [],
	...c
});

const MOTOR = 'src/lib/ui/mapa/motor.ts';

describe('calculaDiferits', () => {
	const chunks = [
		chunk({
			fileName: '_app/immutable/entry/app.js',
			isEntry: true,
			imports: ['_app/immutable/chunks/comu.js']
		}),
		chunk({
			fileName: '_app/immutable/nodes/mapa.js',
			isDynamicEntry: true,
			modul: 'src/routes/(public)/mapa/+page.svelte',
			imports: ['_app/immutable/chunks/comu.js', '_app/immutable/chunks/geojson.js']
		}),
		chunk({
			fileName: '_app/immutable/chunks/motor.js',
			isDynamicEntry: true,
			modul: MOTOR,
			imports: ['_app/immutable/chunks/geojson.js', '_app/immutable/chunks/nomesmotor.js'],
			css: ['_app/immutable/assets/motor.css', '_app/immutable/assets/comu.css'],
			assets: ['_app/immutable/workers/maplibre-worker.js']
		}),
		chunk({ fileName: '_app/immutable/chunks/nomesmotor.js' }),
		chunk({ fileName: '_app/immutable/chunks/geojson.js' }),
		chunk({ fileName: '_app/immutable/chunks/comu.js', css: ['_app/immutable/assets/comu.css'] })
	];

	it('treu el chunk del motor, els seus imports exclusius, el seu CSS i el worker', () => {
		expect(calculaDiferits(chunks, [MOTOR])).toEqual([
			'/_app/immutable/assets/motor.css',
			'/_app/immutable/chunks/motor.js',
			'/_app/immutable/chunks/nomesmotor.js',
			'/_app/immutable/workers/maplibre-worker.js'
		]);
	});

	it('no treu res compartit amb altres entrades (geojson, CSS comú)', () => {
		const d = calculaDiferits(chunks, [MOTOR]);
		expect(d).not.toContain('/_app/immutable/chunks/geojson.js');
		expect(d).not.toContain('/_app/immutable/assets/comu.css');
	});

	it('sense el mòdul al bundle → cap fitxer', () => {
		expect(calculaDiferits(chunks, ['src/no/existeix.ts'])).toEqual([]);
	});

	it('un mòdul importat estàticament (no dinàmic) no és diferit', () => {
		const estatic = chunks.map((c) => (c.modul === MOTOR ? { ...c, isDynamicEntry: false } : c));
		expect(calculaDiferits(estatic, [MOTOR])).toEqual([]);
	});
});
