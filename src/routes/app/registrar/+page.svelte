<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { PageMeta } from '$lib/ui';
	import RegisterPanel from '$lib/ui/RegisterPanel.svelte';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	// Pàgina completa (enllaç directe, recàrrega o pestanya nova). `?cim=slug` preselecciona el cim.
	const cim = page.url.searchParams.get('cim') ?? undefined;

	// Desat: al carnet (`href` ja aplica `resolve()` i la localització).
	function alCarnet() {
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- href() fa resolve()
		goto(href('/app'));
	}
</script>

<PageMeta title={m.register_meta_title()} noindex />

<h1 class="x-wide title">{m.register_title()}</h1>

<div class="panel">
	<RegisterPanel {cim} ondone={alCarnet} />
</div>

<style>
	.title {
		margin-bottom: var(--sp-5);
		font-size: clamp(var(--fs-lg), 5vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1;
	}

	.panel {
		max-width: 40rem;
		padding-bottom: var(--sp-8);
	}
</style>
