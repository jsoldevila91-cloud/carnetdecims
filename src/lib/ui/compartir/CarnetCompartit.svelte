<script lang="ts">
	/**
	 * Carnet compartit de només lectura (bloc R3): capçalera, resum, medalles i les pàgines de
	 * segells sense detall editable. Les dades són les de l'enllaç (`CarnetLlegit`).
	 */
	import { CIMS } from '$lib/data/catalog';
	import {
		ascensionsDeCarnetCompartit,
		avuiLocal,
		medalles,
		paginesCarnet,
		resumCarnet,
		type CarnetCompartit,
		type DataISO
	} from '$lib/domain';
	import { m } from '$lib/paraglide/messages';
	import Card from '../Card.svelte';
	import Icon from '../Icon.svelte';
	import PaginesCarnet from '../PaginesCarnet.svelte';
	import { romanPage } from '../format';
	import { nomMedalla } from '../reptes';
	import { titolCarnetCompartit } from './carnet-compartit';

	let { carnet, avui = avuiLocal() }: { carnet: CarnetCompartit; avui?: DataISO } = $props();

	const ascensions = $derived(ascensionsDeCarnetCompartit(carnet));
	const pagines = $derived(paginesCarnet(ascensions, CIMS, { avui }));
	const resum = $derived(resumCarnet(ascensions, CIMS, { avui }));
	const llistaMedalles = $derived(medalles(ascensions, CIMS, { avui }).reverse());
</script>

<h1 class="x-wide title" data-testid="carnet-compartit-titol">
	{titolCarnetCompartit(carnet.nom)}
</h1>
<p class="lede">
	<Icon name="book" size={18} />
	<span>{m.shared_readonly_note()}</span>
</p>

{#if carnet.descartades > 0}
	<p class="avis" role="note" data-testid="carnet-compartit-descartades">
		<span class="signe" aria-hidden="true">!</span>
		<span>{m.shared_discarded({ count: String(carnet.descartades) })}</span>
	</p>
{/if}

<Card as="section" padding="md" class="resum-compartit" aria-labelledby="resum-t">
	<h2 id="resum-t" class="sr-only">{m.shared_summary_title()}</h2>
	<div class="top">
		<span class="label">{m.app_page({ page: romanPage(pagines.paginaActual) })}</span>
		<span class="label level">
			{resum.nivell === 0 ? m.app_level_none() : m.app_level({ level: String(resum.nivell) })}
		</span>
	</div>
	<p class="count" data-testid="carnet-compartit-total">
		{resum.total}<small>{m.app_count_of({ target: String(resum.objectiuActual) })}</small>
	</p>
	<p class="sr-only">
		{m.app_ruler_label({ count: String(resum.total), target: String(resum.objectiuActual) })}
	</p>
	<p class="mono dades">
		{m.app_essentials({
			done: String(resum.essencials.fetes),
			total: String(resum.essencials.total)
		})}
	</p>
</Card>

{#if llistaMedalles.length > 0}
	<section class="sec" aria-labelledby="medalles-t">
		<h2 id="medalles-t" class="sec-h x-wide">
			{m.medals_title()} · {llistaMedalles.length}
		</h2>
		<ul class="medalles">
			{#each llistaMedalles as md (`${md.repteId}#${md.nivell}`)}
				<li><Icon name="medal" size={18} /><span>{nomMedalla(md)}</span></li>
			{/each}
		</ul>
	</section>
{/if}

<section class="sec" aria-labelledby="pagines-compartit-t">
	<h2 id="pagines-compartit-t" class="sec-h x-wide">{m.carnet_pages_title()}</h2>
	{#if ascensions.length === 0}
		<p class="buit">{m.shared_empty()}</p>
	{:else}
		<PaginesCarnet carnet={pagines} />
	{/if}
</section>

<style>
	.title {
		margin-bottom: var(--sp-3);
		font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1.05;
		overflow-wrap: anywhere;
	}

	.lede {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		margin-bottom: var(--sp-4);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	.lede :global(svg) {
		flex: none;
	}

	.avis {
		display: flex;
		gap: var(--sp-2);
		max-width: 44rem;
		margin-bottom: var(--sp-4);
		padding: var(--sp-2) var(--sp-3);
		border: 1.5px solid var(--c-stamp-ink);
		border-radius: var(--r-sm);
		background: var(--c-stamp-soft);
		font-size: var(--fs-sm);
	}

	.signe {
		font-weight: var(--fw-black);
		color: var(--c-stamp-ink);
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: var(--sp-2);
		border-bottom: 1px dashed var(--c-rule);
	}

	.level {
		color: var(--c-stamp-ink);
	}

	.count {
		margin-top: var(--sp-3);
		font-stretch: var(--stretch-wide);
		font-weight: var(--fw-black);
		font-size: var(--fs-display);
		line-height: 0.85;
		letter-spacing: -0.02em;
		white-space: nowrap;
	}

	.count small {
		font-size: var(--fs-lg);
		font-weight: var(--fw-bold);
		color: var(--c-ink-2);
		letter-spacing: 0;
	}

	.dades {
		margin-top: var(--sp-2);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.sec {
		margin-top: var(--sp-8);
	}

	.sec-h {
		margin-bottom: var(--sp-3);
		padding-top: var(--sp-2);
		border-top: 1.5px solid var(--c-ink);
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}

	.medalles {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
		gap: var(--sp-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.medalles li {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		min-width: 0;
		padding: var(--sp-2) var(--sp-3);
		border: 1px solid var(--c-rule);
		border-radius: var(--r-sm);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}

	.medalles li :global(svg) {
		flex: none;
		color: var(--c-stamp-ink);
	}

	.medalles span {
		overflow-wrap: anywhere;
	}

	.buit {
		padding: var(--sp-4);
		border: var(--bw) dashed var(--c-ink-2);
		border-radius: var(--r-lg);
		color: var(--c-ink-2);
	}
</style>
