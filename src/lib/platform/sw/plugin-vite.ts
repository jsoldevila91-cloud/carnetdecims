/**
 * Plugin de Vite (només `vite.config.ts`, mai al client ni al SW): després del bundle del
 * client escriu `.svelte-kit/sw-diferits.json` amb els fitxers que el service worker no ha de
 * precarregar (`calculaDiferits`). SvelteKit construeix el SW després del client, de manera
 * que el JSON ja hi és quan `src/service-worker.ts` l'importa.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { calculaDiferits, FITXER_DIFERITS, MODULS_DIFERITS, type ChunkResum } from './diferits.ts';

type MetadadesVite = { importedCss?: Set<string>; importedAssets?: Set<string> };

export function pluginSwDiferits(): Plugin {
	let arrel = process.cwd();
	return {
		name: 'carnet-sw-diferits',
		apply: 'build',
		configResolved(config) {
			arrel = config.root;
		},
		generateBundle(_opcions, bundle) {
			if (this.environment.config.consumer !== 'client') return;
			const chunks: ChunkResum[] = [];
			for (const sortida of Object.values(bundle)) {
				if (sortida.type !== 'chunk') continue;
				const meta = (sortida as { viteMetadata?: MetadadesVite }).viteMetadata;
				chunks.push({
					fileName: sortida.fileName,
					isEntry: sortida.isEntry,
					isDynamicEntry: sortida.isDynamicEntry,
					modul: sortida.facadeModuleId
						? path.relative(arrel, sortida.facadeModuleId).split(path.sep).join('/')
						: null,
					imports: sortida.imports,
					css: [...(meta?.importedCss ?? [])],
					assets: [...(meta?.importedAssets ?? [])]
				});
			}
			const diferits = calculaDiferits(chunks, MODULS_DIFERITS);
			if (diferits.length === 0) {
				this.warn(
					`Cap fitxer diferit per al SW: ${MODULS_DIFERITS.join(', ')} no és cap chunk dinàmic`
				);
			}
			const desti = path.join(arrel, FITXER_DIFERITS);
			fs.mkdirSync(path.dirname(desti), { recursive: true });
			fs.writeFileSync(desti, JSON.stringify(diferits, null, '\t') + '\n');
		}
	};
}
