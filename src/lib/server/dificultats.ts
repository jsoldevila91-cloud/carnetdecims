/**
 * Dificultat orientativa per a les llistes de cims (fase 6a-bis), **només al servidor**.
 *
 * Les llistes (`/cims`, comarques, llistats curats) mostren el distintiu de dificultat dels cims
 * amb contingut editorial. El càlcul necessita les rutes de cada fitxa, que no poden anar al JS
 * del client (`$lib/content/fitxes` és només per al servidor): el `+page.server.ts` de cada
 * pàgina en passa un mapa lleuger `slug → { nivell, clau, aproximada }` (prerender → dades
 * inline de l'HTML i `__data.json`).
 */
import { dificultatFitxa, totsElsContingutsFitxa } from '$lib/content/fitxes';
import type { DificultatOrientativa } from '$lib/domain';

/** El que necessita el distintiu compacte d'una llista. */
export type DificultatLlista = Pick<DificultatOrientativa, 'nivell' | 'clau' | 'aproximada'>;

/** Mapa slug → dificultat de la ruta normal (només cims amb contingut i dificultat calculable). */
export type MapaDificultats = Record<string, DificultatLlista>;

/** Només els camps que pinta el distintiu (`DificultatBadge`). */
export function resumDificultat(
	d: DificultatOrientativa
): DificultatLlista & Pick<DificultatOrientativa, 'dadesQueFalten'> {
	return {
		nivell: d.nivell,
		clau: d.clau,
		aproximada: d.aproximada,
		dadesQueFalten: d.dadesQueFalten
	};
}

/**
 * Dificultat orientativa (ruta normal) dels cims amb contingut. Amb `slugs`, només d'aquests
 * (p. ex. els d'una comarca), perquè cada pàgina porti només el que pinta.
 */
export function mapaDificultats(slugs?: Iterable<string>): MapaDificultats {
	const filtre = slugs ? new Set(slugs) : null;
	const mapa: MapaDificultats = {};
	for (const contingut of totsElsContingutsFitxa()) {
		if (filtre && !filtre.has(contingut.slug)) continue;
		const d = dificultatFitxa(contingut);
		if (d) mapa[contingut.slug] = { nivell: d.nivell, clau: d.clau, aproximada: d.aproximada };
	}
	return mapa;
}
