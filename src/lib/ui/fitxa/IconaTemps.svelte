<script lang="ts">
	import type { CategoriaTemps } from './meteo';

	/**
	 * Icones pròpies del temps (traç 24×24, mateix estil que `Icon`). Decoratives: el text de la
	 * condició sempre es mostra al costat. Sol en tinta de segell, aigua en blau, núvol en tinta.
	 */
	let { categoria, size = 40 }: { categoria: CategoriaTemps; size?: number } = $props();

	const NUVOL = 'M7 18.5h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 10 4.3 4.3 0 0 0 7 18.5z';
	const RAIGS =
		'M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4';
</script>

<svg
	class="icona-temps"
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
	{#if categoria === 'sere'}
		<g class="sol">
			<circle cx="12" cy="12" r="4.2" />
			<path d={RAIGS} />
		</g>
	{:else if categoria === 'poc-nuvol'}
		<g class="sol">
			<circle cx="9" cy="8.5" r="3.2" />
			<path d="M9 2.5v1.5M3 8.5h1.5M4.8 4.3l1 1M13.2 4.3l-1 1" />
		</g>
		<path
			class="nuvol"
			d="M9.5 20h8.5a3.5 3.5 0 0 0 .5-6.96A5 5 0 0 0 9 12.5a3.8 3.8 0 0 0 .5 7.5z"
		/>
	{:else if categoria === 'nuvol'}
		<path class="nuvol" d={NUVOL} />
		<path class="nuvol-2" d="M15.5 6.2A5 5 0 0 1 21 10.5" />
	{:else if categoria === 'boira'}
		<path class="nuvol" d="M7 12.5h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 4 4.3 4.3 0 0 0 7 12.5z" />
		<path class="boira" d="M4 16h16M6 19.5h12M8 23h8" />
	{:else if categoria === 'plugim'}
		<path class="nuvol" d="M7 14.5h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 6 4.3 4.3 0 0 0 7 14.5z" />
		<path
			class="aigua"
			d="M8 18h.01M12 19h.01M16 18h.01M10 21.5h.01M14 21.5h.01"
			stroke-width="2.4"
		/>
	{:else if categoria === 'pluja'}
		<path class="nuvol" d="M7 14.5h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 6 4.3 4.3 0 0 0 7 14.5z" />
		<path class="aigua" d="M8.5 17l-1.2 3.5M12.5 17l-1.2 3.5M16.5 17l-1.2 3.5" />
	{:else if categoria === 'neu'}
		<path class="nuvol" d="M7 14.5h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 6 4.3 4.3 0 0 0 7 14.5z" />
		<path
			class="neu"
			d="M8 17.5v3M6.7 18.2l2.6 1.6M9.3 18.2l-2.6 1.6M16 17.5v3M14.7 18.2l2.6 1.6M17.3 18.2l-2.6 1.6M12 19.5v3M10.7 20.2l2.6 1.6M13.3 20.2l-2.6 1.6"
		/>
	{:else if categoria === 'tempesta'}
		<path class="nuvol" d="M7 14.5h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 6 4.3 4.3 0 0 0 7 14.5z" />
		<path class="llamp" d="M12.5 13.5 10 18h3.5L11 22.5" />
	{:else}
		<path class="nuvol" d={NUVOL} stroke-dasharray="2 2.5" />
	{/if}
</svg>

<style>
	.icona-temps {
		flex: none;
		color: var(--c-ink);
	}

	.sol,
	.llamp {
		color: var(--c-stamp-ink);
	}

	.aigua {
		color: var(--c-blue);
	}

	.neu {
		color: var(--c-blue);
	}

	.boira,
	.nuvol-2 {
		color: var(--c-ink-2);
	}
</style>
