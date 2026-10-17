<script lang="ts">
	import type { ResultatRepte } from '$lib/domain';
	import { formatDataLlarga, formatPercentatge } from './format';
	import { descripcioRepte, nivellText, nomRepte } from './reptes';
	import { m } from '$lib/paraglide/messages';

	/**
	 * Targeta d'un repte amb el progrés (`role="meter"`). `gran`: la del repte destacat.
	 * Amb `href`, tota la targeta és un enllaç al detall (el nom és el text de l'enllaç); sense,
	 * només el progrés (al detall, el nom ja és l'H1).
	 */
	let {
		resultat,
		href,
		locale,
		gran = false
	}: { resultat: ResultatRepte; href?: string; locale: string; gran?: boolean } = $props();

	const id = $props.id();
	const nom = $derived(nomRepte(resultat.id));
	const valor = $derived(
		m.reptes_progress_value({ done: String(resultat.fets), total: String(resultat.objectiu) })
	);
	const pct = $derived(formatPercentatge(resultat.fraccio, locale));
	const multinivell = $derived(resultat.nivellMaxim > 1);
</script>

<article
	class={['targeta', { gran, completat: resultat.completat, multinivell }]}
	data-testid="targeta-repte"
>
	{#if href}
		<h3 class="nom" id="{id}-n">
			<a {href}>{nom}</a>
		</h3>
	{/if}
	{#if gran && href}
		<p class="desc">{descripcioRepte(resultat.id)}</p>
	{/if}
	<div class="fila">
		<span class="xifra mono">{valor} · {pct}</span>
		{#if resultat.completat && resultat.dataCompletat}
			<span class="medalla mono">
				{m.reptes_completed_on({ date: formatDataLlarga(resultat.dataCompletat, locale) })}
			</span>
		{/if}
		{#if multinivell && resultat.nivell > 0}
			<span class="medalla mono"
				>{m.reptes_level_reached({ level: nivellText(resultat.nivell) })}</span
			>
		{/if}
	</div>
	<div
		class="meter"
		role="meter"
		aria-labelledby={href ? `${id}-n` : undefined}
		aria-label={href ? undefined : nom}
		aria-valuemin={0}
		aria-valuemax={resultat.objectiu}
		aria-valuenow={Math.min(resultat.fets, resultat.objectiu)}
		aria-valuetext="{valor} ({pct})"
	>
		<span style:width="{resultat.fraccio * 100}%"></span>
	</div>
</article>

<style>
	.targeta {
		position: relative;
		display: grid;
		gap: var(--sp-2);
		padding: var(--sp-3) var(--sp-4);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-card);
		box-shadow: var(--sh-2);
		min-width: 0;
	}

	.targeta:focus-within {
		outline: 2px solid var(--c-focus);
		outline-offset: 2px;
	}

	.gran {
		padding: var(--sp-5);
		border-width: 2px;
	}

	.nom {
		font-stretch: var(--stretch-semi);
		font-weight: var(--fw-heavy);
		font-size: var(--fs-md, var(--fs-base));
		line-height: var(--lh-snug);
		overflow-wrap: anywhere;
	}

	.gran .nom {
		font-stretch: var(--stretch-wide);
		font-size: var(--fs-xl);
	}

	.nom a {
		color: var(--c-ink);
		text-decoration: none;
	}

	.nom a:focus-visible {
		outline: none;
	}

	/* Tota la targeta és clicable. */
	.nom a::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
	}

	.nom a:hover {
		text-decoration: underline;
	}

	.desc {
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	.fila {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0 var(--sp-3);
	}

	.xifra {
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}

	.medalla {
		font-size: var(--fs-xs);
		color: var(--c-stamp-ink);
		font-weight: var(--fw-semibold);
	}

	.meter {
		height: 10px;
		border: var(--bw) solid var(--c-line);
		border-radius: 2px;
		background: repeating-linear-gradient(
			90deg,
			transparent 0 calc(10% - 1px),
			var(--c-rule) calc(10% - 1px) 10%
		);
		overflow: hidden;
	}

	.gran .meter {
		height: 14px;
	}

	.meter span {
		display: block;
		height: 100%;
		background: var(--c-ink);
	}

	.completat:not(.multinivell) .meter span {
		background: var(--c-stamp);
	}
</style>
