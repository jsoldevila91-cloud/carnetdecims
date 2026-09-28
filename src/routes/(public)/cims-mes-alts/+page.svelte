<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { cimsDelLlistat } from '$lib/data/catalog';
	import { formatAltitude } from '$lib/ui';
	import PaginaLlistat from '../PaginaLlistat.svelte';

	const cims = cimsDelLlistat('mes-alts');
	const count = cims.length;
	const max = formatAltitude(cims[0].altitud);
	const min = formatAltitude(cims[cims.length - 1].altitud);
</script>

<PaginaLlistat
	id="mes-alts"
	{cims}
	titol={m.highest_title({ count })}
	metaTitol={m.highest_meta_title({ count })}
	descripcio={m.highest_meta_description({ count, max, min })}
	entradeta={m.highest_lede({ count, max, min })}
	nomCurt={m.explore_highest()}
/>
