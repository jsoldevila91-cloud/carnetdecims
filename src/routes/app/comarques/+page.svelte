<script lang="ts">
	import { ascensionsVivesAmbEstat } from '$lib/data/ascensions';
	import { CIMS } from '$lib/data/catalog';
	import { avuiLocal, progresComarques } from '$lib/domain';
	import { PageMeta } from '$lib/ui';
	import BarresComarques from '$lib/ui/BarresComarques.svelte';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	const vives = ascensionsVivesAmbEstat();
	const avui = avuiLocal();
	const comarques = $derived(progresComarques($vives.ascensions, CIMS, { avui }));
</script>

<PageMeta title={m.com_meta_title()} noindex />

<p class="crumb mono"><a href={href('/app')}>← {m.app_title()}</a></p>
<h1 class="x-wide title">{m.com_title()}</h1>
<p class="lede">{m.com_lede()}</p>

{#if !$vives.carregat}
	<p class="mono estat" role="status">{m.app_loading()}</p>
{:else}
	<div class="barres">
		<BarresComarques {comarques} />
	</div>
{/if}

<style>
	.crumb {
		margin-bottom: var(--sp-2);
		font-size: var(--fs-xs);
	}

	.crumb a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		color: var(--c-ink-2);
	}

	.title {
		margin-bottom: var(--sp-3);
		font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1;
	}

	.lede,
	.estat {
		color: var(--c-ink-2);
	}

	.estat {
		margin-top: var(--sp-4);
		font-size: var(--fs-xs);
	}

	.barres {
		max-width: 40rem;
		margin: var(--sp-5) 0 var(--sp-8);
	}
</style>
