<script lang="ts">
	import { onMount } from 'svelte';
	import { network } from '$lib/platform/network.svelte';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import type { ApiCompte } from './api';
	import { apiReal } from './api-real';
	import EstatNuvolText from './EstatNuvolText.svelte';
	import { estatNuvol } from './nuvol';

	/**
	 * Indicador discret de l'estat del núvol al carnet. Tot és un enllaç al Perfil, on hi ha el
	 * detall i les accions. L'alçada es reserva mentre es comprova la sessió (sense salts).
	 */
	let { api = apiReal }: { api?: ApiCompte } = $props();

	// svelte-ignore state_referenced_locally
	const { sessio, estatSync } = api;
	// svelte-ignore state_referenced_locally
	const disponible = api.compteDisponible();

	onMount(() => network.start());

	const estat = $derived(estatNuvol($sessio, $estatSync, network.online));
	const locale = getLocale();
</script>

{#if disponible}
	<p class="indicador">
		{#if estat.tipus === 'carregant'}
			<span class="reserva" aria-hidden="true"></span>
		{:else}
			<a href={href('/app/compte')}>
				<span class="sr-only">{m.cloud_status_label()}:</span>
				<EstatNuvolText {estat} {locale} curt />
				<span class="cta">
					{estat.tipus === 'local' ? m.cloud_status_create() : m.cloud_status_see()}
					<span aria-hidden="true">→</span>
				</span>
			</a>
		{/if}
	</p>
{/if}

<style>
	.indicador {
		margin: calc(-1 * var(--sp-2)) 0 var(--sp-4);
		min-height: var(--tap);
	}

	.reserva {
		display: block;
		height: var(--tap);
	}

	a {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		column-gap: var(--sp-3);
		row-gap: 0;
		min-height: var(--tap);
		color: var(--c-ink);
		text-decoration: none;
	}

	.cta {
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		color: var(--c-stamp-ink);
	}

	a:hover .cta {
		text-decoration: underline;
	}
</style>
