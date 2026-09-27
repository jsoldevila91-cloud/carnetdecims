<script lang="ts">
	import { PageMeta, RegisterPanel } from '$lib/ui';
	import { m } from '$lib/paraglide/messages';
</script>

<!-- Versió de pàgina completa (enllaç directe, recàrrega o obrir en pestanya nova). -->
<PageMeta title={m.register_meta_title()} noindex />

<h1 class="x-wide title">{m.register_title()}</h1>

<div class="panel">
	<RegisterPanel />
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
	}
</style>
