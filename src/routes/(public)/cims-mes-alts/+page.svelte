<script lang="ts">
	let { data } = $props();
	import { m } from '$lib/paraglide/messages';
	import { CIMS, cimsDelLlistat } from '$lib/data/catalog';
	import { formatAltitude } from '$lib/ui';
	import PaginaLlistat from '../PaginaLlistat.svelte';

	const cims = cimsDelLlistat('mes-alts');
	const count = cims.length;
	const max = formatAltitude(cims[0].altitud);
	const min = formatAltitude(cims[cims.length - 1].altitud);
	// Catàleg només d'essencials (fase 2): el rànquing és d'essencials i així es diu.
	const nomesEssencials = CIMS.every((c) => c.essencial);
</script>

<PaginaLlistat
	id="mes-alts"
	{cims}
	dificultats={data.dificultats}
	titol={nomesEssencials ? m.highest_title_essentials({ count }) : m.highest_title({ count })}
	metaTitol={nomesEssencials
		? m.highest_meta_title_essentials({ count })
		: m.highest_meta_title({ count })}
	descripcio={nomesEssencials
		? m.highest_meta_description_essentials({ count, max, min })
		: m.highest_meta_description({ count, max, min })}
	entradeta={nomesEssencials
		? m.highest_lede_essentials({ count, max, min })
		: m.highest_lede({ count, max, min })}
	nomCurt={m.explore_highest()}
/>
