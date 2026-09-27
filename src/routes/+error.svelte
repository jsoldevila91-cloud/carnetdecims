<script lang="ts">
	import { page } from '$app/state';
	import { Button, EmptyState, PageMeta } from '$lib/ui';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	const title = $derived(page.status === 404 ? m.error_title_404() : m.error_title_generic());
</script>

<PageMeta {title} noindex />

<div class="error">
	<p class="label code">{page.status}</p>
	<EmptyState {title} icon="search" headingLevel={1}>
		<p>{m.error_text()}</p>
		{#snippet actions()}
			<Button href={href('/')} variant="ink" icon="home">{m.error_home()}</Button>
			<Button href={href('/cims')} variant="outline" icon="peak">{m.nav_peaks()}</Button>
		{/snippet}
	</EmptyState>
</div>

<style>
	.error {
		display: grid;
		gap: var(--sp-3);
		max-width: 36rem;
		margin: var(--sp-8) auto 0;
	}

	.code {
		color: var(--c-stamp-ink);
		text-align: center;
	}
</style>
