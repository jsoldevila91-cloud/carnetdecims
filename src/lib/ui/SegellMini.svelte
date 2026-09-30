<script lang="ts">
	/**
	 * Segell petit per a les caselles del carnet: doble anella i inicials del cim (sense text en
	 * arc ni filtre de tinta, que a 50 px no es llegirien i pesarien ×100). Sempre decoratiu:
	 * el nom accessible el porta la casella.
	 * - `espera`: segell que encara no compta (tinta blava i anella puntejada).
	 * - `essencial`: rombe sota les inicials.
	 */
	let {
		inicials,
		essencial = false,
		espera = false,
		rotate = 0
	}: { inicials: string; essencial?: boolean; espera?: boolean; rotate?: number } = $props();

	const mida = $derived(inicials.length >= 3 ? 30 : 38);
</script>

<svg
	class={['mini', espera ? 'espera' : 'compta']}
	viewBox="0 0 120 120"
	style:transform={rotate ? `rotate(${rotate}deg)` : undefined}
	aria-hidden="true"
	focusable="false"
>
	<circle
		cx="60"
		cy="60"
		r="54"
		fill="none"
		stroke="currentColor"
		stroke-width="6"
		stroke-dasharray={espera ? '10 8' : undefined}
	/>
	<circle cx="60" cy="60" r="43" fill="none" stroke="currentColor" stroke-width="2.5" />
	<text x="60" y={essencial ? 64 : 72} font-size={mida} text-anchor="middle" fill="currentColor"
		>{inicials}</text
	>
	{#if essencial}
		<path d="M60 76l7 7-7 7-7-7z" fill="currentColor" />
	{/if}
</svg>

<style>
	.mini {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.compta {
		color: var(--c-stamp-ink);
	}

	.espera {
		color: var(--c-ink);
	}

	@media (prefers-color-scheme: light) {
		.mini {
			mix-blend-mode: multiply;
		}
	}

	text {
		font-family: var(--font-wide);
		font-stretch: 125%;
		font-weight: 900;
		letter-spacing: -0.02em;
	}
</style>
