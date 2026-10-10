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
	{#snippet detall(cim: CimCataleg)}
		{@const ruta = data.rutesAmbNens[cim.slug]}
		{#if ruta}
			<!-- Nom curt de la ruta i, a sota, les xifres. Els espais entre blocs es conserven: el nom
			     accessible de l'enllaç no ajunta les parts. -->
			<span class="ruta">
				<span class="sr-only">{m.kids_route_sr()}</span>
				<span class="nom-ruta">{ruta.nomCurt}</span>
				{#if ruta.desnivell || ruta.temps}
					<span class="dades mono">
						{#if ruta.desnivell}<span class="dada">{ruta.desnivell}</span>{/if}
						{#if ruta.desnivell && ruta.temps}<span class="sep" aria-hidden="true">·</span>{/if}
						{#if ruta.temps}<span class="dada">{ruta.temps}</span>{/if}
					</span>
				{/if}
			</span>
		{/if}
	{/snippet}
</PaginaLlistat>

<style>
	/* Segona part de cada cim (dins l'enllaç de `LlistaCims`): ocupa tota la fila */
	.ruta {
		display: grid;
		flex: 1 1 100%;
		min-width: 0;
		margin-top: 2px;
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	.nom-ruta {
		overflow-wrap: anywhere;
	}

	.dades {
		font-size: var(--fs-xs);
	}

	/* Cada xifra no es parteix ("1 h 40 min d'anada"); el salt, si cal, entre xifres */
	.dada {
		white-space: nowrap;
	}

	/* Separador visual entre xifres (no es llegeix) */
	.sep {
		color: var(--c-rule);
	}
</style>
