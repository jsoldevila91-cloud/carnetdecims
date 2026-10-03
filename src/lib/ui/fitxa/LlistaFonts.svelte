<script lang="ts">
	import Icon from '../Icon.svelte';
	import { formatDataLlarga } from '../format';
	import { esUrlExterna } from '../text-en-linia';
	import { getLocale } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import type { FontCitada } from '$lib/content/types';

	/** Llista de fonts citades (nom enllaçat + data de consulta), com al peu de les pàgines de contingut. */
	let { fonts }: { fonts: readonly FontCitada[] } = $props();

	const locale = getLocale();
</script>

<ul class="fonts">
	{#each fonts as f, i (i)}
		<li>
			{#if esUrlExterna(f.url)}
				<a href={f.url} rel="external noopener" target="_blank">
					<span class="nom">{f.nom}</span><Icon name="external" size={13} strokeWidth={2} />
					<span class="sr-only">{m.content_new_tab()}</span>
				</a>
			{:else}
				{f.nom}
			{/if}
			{#if f.consultat}
				<time class="consultat" datetime={f.consultat}>
					{m.content_source_consulted({ date: formatDataLlarga(f.consultat, locale) })}
				</time>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.fonts {
		display: grid;
		gap: var(--sp-2);
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: var(--fs-sm);
		overflow-wrap: anywhere;
	}

	a {
		display: inline-flex;
		align-items: center;
		gap: 2px;
		min-height: 24px;
		color: var(--c-stamp-ink);
		font-weight: var(--fw-semibold);
		text-decoration: none;
	}

	.nom {
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.consultat {
		display: block;
		color: var(--c-ink-2);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
	}
</style>
