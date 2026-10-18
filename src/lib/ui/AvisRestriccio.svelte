<script lang="ts">
	import { getLocale } from '$lib/i18n';
	import type { DataISO } from '$lib/domain';
	import { textAcces, type AccesAra } from './info-rapida';

	/**
	 * Avís de restricció d'accés vigent avui (R5.2). Senyal propi:
	 * - restricció coneguda: triangle d'avís en tinta de segell;
	 * - `incerta` (permanent sense dates, p. ex. Sant Salvador de les Espases): cercle amb "?" en
	 *   tinta suau; el text diu "Possible restricció…: comprova-ho a la FEEC", mai "tancat".
	 * Variants: `compacte` (només el senyal, 1.25rem; text per a lectors de pantalla i `title`) i
	 * `complet` (senyal + text visible).
	 */
	let {
		acces,
		avui = null,
		variant = 'compacte'
	}: { acces: AccesAra; avui?: DataISO | null; variant?: 'compacte' | 'complet' } = $props();

	const locale = getLocale();
	const text = $derived(textAcces(acces, avui, locale));
</script>

<span
	class={['avis', variant, { incerta: acces.incerta }]}
	title={variant === 'compacte' ? text : undefined}
	data-testid="avis-restriccio"
>
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.8"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		focusable="false"
	>
		{#if acces.incerta}
			<circle cx="12" cy="12" r="9" stroke-dasharray="3 2.4" />
			<path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.6M12 16.8h.01" stroke-width="2" />
		{:else}
			<path d="M12 3.5 21.5 20h-19z" />
			<path d="M12 10v4.5M12 17.4h.01" stroke-width="2.2" />
		{/if}
	</svg>
	{#if variant === 'complet'}
		<span class="text">{text}</span>
	{:else}
		<span class="sr-only">{text}</span>
	{/if}
</span>

<style>
	.avis {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-1);
		flex: none;
		color: var(--c-stamp-ink);
	}

	.avis.incerta {
		color: var(--c-ink-2);
	}

	.compacte {
		justify-content: center;
		width: 1.25rem;
		height: 1.25rem;
	}

	.compacte svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.complet {
		padding: 1px var(--sp-2);
		border: 1px solid currentColor;
		border-radius: var(--r-xs);
		font-family: var(--font-mono);
		font-size: var(--fs-2xs);
		font-weight: var(--fw-semibold);
	}

	.complet svg {
		flex: none;
		width: 0.9rem;
		height: 0.9rem;
	}
</style>
