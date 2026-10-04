<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { cimPerSlug } from '$lib/data/catalog';
	import type { CimCataleg } from '$lib/domain';
	import PaginaLlistat from '../PaginaLlistat.svelte';
	import AvisosDificultat from '../AvisosDificultat.svelte';

	// Llistat de dificultat (fase 6a-bis): només cims amb fitxa completa. Els slugs, el mapa de
	// dificultat i la indexabilitat vénen del `+page.server.ts` (el contingut no va al client).
	let { data } = $props();

	const cims = $derived(data.slugs.map(cimPerSlug).filter((c): c is CimCataleg => c !== undefined));
	const count = $derived(cims.length);
	const entradeta = $derived(
		count === 0 ? m.easy_lede_empty() : count === 1 ? m.easy_lede_one() : m.easy_lede({ count })
	);
</script>

<PaginaLlistat
	id="cims-facils"
	{cims}
	agrupat
	dificultats={data.dificultats}
	noindex={!data.indexable}
	titol={m.easy_title()}
	metaTitol={m.easy_meta_title()}
	descripcio={m.easy_meta_description()}
	{entradeta}
	nota={m.difficulty_list_growing()}
	nomCurt={m.explore_easy()}
>
	{#snippet avisos()}
		<AvisosDificultat />
	{/snippet}
</PaginaLlistat>
