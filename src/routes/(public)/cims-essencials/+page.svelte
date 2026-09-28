<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { cimsDelLlistat } from '$lib/data/catalog';
	import PaginaLlistat from '../PaginaLlistat.svelte';

	const cims = cimsDelLlistat('essencials');
	const count = cims.length;
</script>

<PaginaLlistat
	id="essencials"
	{cims}
	agrupat
	titol={m.essentials_title({ count })}
	metaTitol={m.essentials_meta_title({ count })}
	descripcio={m.essentials_meta_description({ count })}
	entradeta={m.essentials_lede()}
	nomCurt={m.explore_essentials()}
/>
