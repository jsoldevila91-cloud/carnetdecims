import type { Zona } from '$lib/domain';
import { m } from '$lib/paraglide/messages';

/** Nom visible de cada zona del repte (Catalunya, Andorra, Catalunya Nord), en l'idioma actiu. */
export const NOM_ZONA: Readonly<Record<Zona, () => string>> = {
	catalunya: m.zone_catalunya,
	andorra: m.zone_andorra,
	'catalunya-nord': m.zone_catalunya_nord
};
