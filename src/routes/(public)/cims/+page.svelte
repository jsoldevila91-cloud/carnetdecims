<script lang="ts">
	import { Button, EmptyState, PageMeta } from '$lib/ui';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
</script>

<PageMeta title={m.peaks_meta_title()} description={m.peaks_meta_description()} />

<header class="page-head">
	<h1 class="x-wide">{m.peaks_title()}</h1>
	<p class="lede">{m.peaks_lede()}</p>
</header>

<EmptyState title={m.peaks_empty_title()} icon="peak">
	<p>{m.peaks_empty_text()}</p>
	{#snippet actions()}
		<Button href={href('/mapa')} variant="outline" icon="map">{m.peaks_empty_cta()}</Button>
	{/snippet}
</EmptyState>

<style>
	.page-head {
		margin-bottom: var(--sp-6);
	}

	h1 {
		font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1;
	}

	.lede {
		margin-top: var(--sp-3);
		color: var(--c-ink-2);
		max-width: 50ch;
	}
</style>
