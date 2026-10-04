<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { cimPerSlug } from '$lib/data/catalog';
	import { CRITERIS_LLISTATS_DIFICULTAT, type CimCataleg } from '$lib/domain';
	import { formatAltitude, formatDurada } from '$lib/ui';
	import PaginaLlistat from '../PaginaLlistat.svelte';
	import AvisosDificultat from '../AvisosDificultat.svelte';

	// Llistat de dificultat (fase 6a-bis): només cims amb fitxa completa. Els slugs, el mapa de
	// dificultat i la indexabilitat vénen del `+page.server.ts` (el contingut no va al client).
	let { data } = $props();

	const cims = $derived(data.slugs.map(cimPerSlug).filter((c): c is CimCataleg => c !== undefined));
	const count = $derived(cims.length);
	// Els llindars de l'entradeta surten dels criteris del domini (no es copien a mà).
	const { desnivellMaxM, tempsMaxMinuts } = CRITERIS_LLISTATS_DIFICULTAT['cims-amb-nens'];
	const llindars = {
		desnivell: formatAltitude(desnivellMaxM),
		temps: formatDurada(tempsMaxMinuts)
	};
	const entradeta = $derived(
		count === 0
			? m.kids_lede_empty()
			: count === 1
				? m.kids_lede_one(llindars)
				: m.kids_lede({ count, ...llindars })
	);
</script>

<PaginaLlistat
	id="cims-amb-nens"
	{cims}
	agrupat
	dificultats={data.dificultats}
	noindex={!data.indexable}
	titol={m.kids_title()}
	metaTitol={m.kids_meta_title()}
	descripcio={m.kids_meta_description()}
	{entradeta}
	nota={m.difficulty_list_growing()}
	nomCurt={m.explore_kids()}
>
	{#snippet avisos()}
		<AvisosDificultat seguretat={m.kids_safety()} />
	{/snippet}
</PaginaLlistat>
