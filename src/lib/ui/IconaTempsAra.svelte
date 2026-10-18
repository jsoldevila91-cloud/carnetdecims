<script lang="ts">
	import type { CategoriaTemps } from '$lib/domain/temps';
	import IconaTemps from './fitxa/IconaTemps.svelte';

	/**
	 * Icona del temps actual a les llistes (R5.2). Reutilitza les icones pròpies de la fitxa
	 * (`IconaTemps`) i hi afegeix la lluna: `sol` de nit (`esDia === false`). Decorativa: el text
	 * va a part (etiqueta de qui la fa servir).
	 */
	let {
		categoria,
		esDia = true,
		size = 20
	}: { categoria: CategoriaTemps; esDia?: boolean; size?: number } = $props();
</script>

{#if categoria === 'sol' && !esDia}
	<svg
		class="lluna"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.6"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		focusable="false"
	>
		<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z" />
		<path d="M16.5 3.5v2M15.5 4.5h2M20 8v1.6M19.2 8.8h1.6" stroke-width="1.2" />
	</svg>
{:else}
	<IconaTemps categoria={categoria === 'sol' ? 'sere' : categoria} {size} />
{/if}

<style>
	.lluna {
		flex: none;
		color: var(--c-blue);
	}
</style>
