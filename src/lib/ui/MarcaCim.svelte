<script lang="ts">
	/**
	 * Símbol del cim amb la mateixa codificació que el mapa (docs/05 §3): cercle = cim, rombe =
	 * essencial; ple amb "✓" = fet, només contorn = pendent. Decoratiu (`aria-hidden`): qui el fa
	 * servir ha de dir l'estat en text.
	 */
	let { essencial, fet, size = 20 }: { essencial: boolean; fet: boolean; size?: number } = $props();
</script>

<svg
	class={['marca', { essencial, fet }]}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	aria-hidden="true"
	focusable="false"
>
	{#if essencial}
		<path class="forma" d="M12 1.8 22.2 12 12 22.2 1.8 12z" />
		{#if !fet}<circle class="punt" cx="12" cy="12" r="2.6" />{/if}
	{:else}
		<circle class="forma" cx="12" cy="12" r={fet ? 9.2 : 7.4} />
	{/if}
	{#if fet}<path class="check" d="M7.8 12.3l2.9 2.9 5.6-6" />{/if}
</svg>

<style>
	.marca {
		flex: none;
		overflow: visible;
	}

	.forma {
		fill: var(--c-card);
		stroke: var(--c-ink);
		stroke-width: 2.4;
	}

	.fet .forma {
		fill: var(--c-ink);
		stroke: var(--c-paper);
		stroke-width: 1.6;
	}

	.essencial .forma {
		stroke: var(--c-stamp-ink);
		stroke-width: 2.4;
	}

	.essencial.fet .forma {
		fill: var(--c-stamp);
		stroke: var(--c-paper);
	}

	.punt {
		fill: var(--c-stamp-ink);
	}

	.check {
		fill: none;
		stroke: var(--c-paper);
		stroke-width: 2.2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.essencial.fet .check {
		stroke: var(--c-on-stamp);
	}
</style>
