<script lang="ts">
	import { ascensionsVivesAmbEstat } from '$lib/data/ascensions';
	import { CIMS } from '$lib/data/catalog';
	import { GRUP_MASSISSOS, REPTES, avaluarReptes, avuiLocal } from '$lib/domain';
	import { PageMeta } from '$lib/ui';
	import TargetaRepte from '$lib/ui/TargetaRepte.svelte';
	import { slugRepte } from '$lib/ui/reptes';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	/**
	 * Reptes (bloc R2): el 100 Cims destacat (targeta gran), la resta de reptes i els massissos
	 * agrupats. Tot es calcula al dispositiu a partir de les ascensions (no es desa res).
	 */
	const vives = ascensionsVivesAmbEstat();
	const avui = avuiLocal();
	const locale = getLocale();

	const resultats = $derived(avaluarReptes($vives.ascensions, CIMS, { avui }));
	const files = $derived(REPTES.map((r, i) => ({ repte: r, resultat: resultats[i] })));
	const destacats = $derived(files.filter((f) => f.repte.destacat));
	const altres = $derived(files.filter((f) => !f.repte.destacat && !f.repte.grup));
	const massissos = $derived(files.filter((f) => f.repte.grup === GRUP_MASSISSOS));
	const completats = $derived(resultats.filter((r) => r.completat).length);

	const enllac = (r: (typeof REPTES)[number]) => href(`/app/reptes/${slugRepte(r, locale)}`);
</script>

<PageMeta title={m.reptes_meta_title()} noindex />

<p class="crumb mono"><a href={href('/app')}>← {m.app_title()}</a></p>
<h1 class="x-wide title">{m.reptes_title()}</h1>
<p class="lede">{m.reptes_lede()}</p>

{#if !$vives.carregat}
	<p class="mono estat" role="status">{m.app_loading()}</p>
{:else}
	<p class="resum mono" data-testid="reptes-resum">
		{m.reptes_summary({ done: String(completats), total: String(resultats.length) })}
	</p>
{/if}

<section class="sec" aria-labelledby="rp-destacat">
	<h2 id="rp-destacat" class="sec-h x-wide">{m.reptes_featured_title()}</h2>
	{#each destacats as f (f.repte.id)}
		<TargetaRepte resultat={f.resultat} href={enllac(f.repte)} {locale} gran />
	{/each}
	<p class="nota">{m.reptes_featured_note()}</p>
</section>

<section class="sec" aria-labelledby="rp-altres">
	<h2 id="rp-altres" class="sec-h x-wide">{m.reptes_others_title()}</h2>
	<ul class="graella">
		{#each altres as f (f.repte.id)}
			<li><TargetaRepte resultat={f.resultat} href={enllac(f.repte)} {locale} /></li>
		{/each}
	</ul>
</section>

<section class="sec" aria-labelledby="rp-massissos">
	<h2 id="rp-massissos" class="sec-h x-wide">{m.reptes_massifs_title()}</h2>
	<p class="nota">{m.reptes_massifs_lede()}</p>
	<ul class="graella">
		{#each massissos as f (f.repte.id)}
			<li><TargetaRepte resultat={f.resultat} href={enllac(f.repte)} {locale} /></li>
		{/each}
	</ul>
</section>

<p class="nota peu">{m.reptes_own_note()}</p>

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
	.estat,
	.nota {
		color: var(--c-ink-2);
	}

	.estat,
	.resum {
		margin-top: var(--sp-3);
		font-size: var(--fs-xs);
	}

	.nota {
		margin-top: var(--sp-2);
		font-size: var(--fs-sm);
	}

	.peu {
		margin: var(--sp-8) 0;
	}

	.sec {
		margin-top: var(--sp-8);
	}

	.sec-h {
		margin-bottom: var(--sp-3);
		padding-top: var(--sp-2);
		border-top: 1.5px solid var(--c-ink);
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}

	.graella {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
		gap: var(--sp-3);
		margin: var(--sp-3) 0 0;
		padding: 0;
		list-style: none;
	}

	.graella li {
		display: grid;
		min-width: 0;
	}
</style>
