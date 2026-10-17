<script lang="ts">
	import { page } from '$app/state';
	import { ascensionsVivesAmbEstat } from '$lib/data/ascensions';
	import { CIMS, COMARQUES } from '$lib/data/catalog';
	import {
		ID_REPTE_CENT_CIMS,
		ID_REPTE_INFANTIL,
		avaluarRepte,
		avuiLocal,
		type Estacio
	} from '$lib/domain';
	import { EmptyState, PageMeta, Segell, formatAltitude } from '$lib/ui';
	import TargetaRepte from '$lib/ui/TargetaRepte.svelte';
	import { cimPerId } from '$lib/ui/cim-per-id';
	import { formatDataLlarga, formatMes } from '$lib/ui/format';
	import { descripcioRepte, nivellText, nomRepte, repteDeSlugQualsevol } from '$lib/ui/reptes';
	import { PAGINES_CONTINGUT } from '$lib/content/types';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	/** Detall d'un repte (bloc R2): progrés, què falta segons la regla i la medalla si està fet. */
	const vives = ascensionsVivesAmbEstat();
	const avui = avuiLocal();
	const locale = getLocale();
	/** Amb més cims pendents, la llista es plega (es pot desplegar). */
	const MAX_VISIBLES = 24;

	const repte = $derived(repteDeSlugQualsevol(page.params.slug ?? '', locale));
	const resultat = $derived(
		repte ? avaluarRepte(repte, $vives.ascensions, CIMS, { avui }) : undefined
	);
	const pendents = $derived(resultat?.pendents);
	const cimsPendents = $derived(
		pendents?.tipus === 'cims'
			? pendents.cimIds.map((id) => cimPerId(id)).filter((c) => c !== undefined)
			: []
	);
	const nomComarca = (slug: string) => COMARQUES.find((c) => c.slug === slug)?.nom ?? slug;

	const ESTACIO: Record<Estacio, () => string> = {
		primavera: m.season_spring,
		estiu: m.season_summer,
		tardor: m.season_autumn,
		hivern: m.season_winter
	};
	const mesos = (n: number) =>
		n === 1 ? m.stats_streak_months_one() : m.stats_streak_months({ count: String(n) });
	const data = (iso: string) => formatDataLlarga(iso, locale);
</script>

<PageMeta title={repte ? nomRepte(repte.id) : m.reptes_title()} noindex />

<p class="crumb mono"><a href={href('/app/reptes')}>← {m.reptes_title()}</a></p>

{#if !repte || !resultat}
	<EmptyState title={m.reptes_not_found()} icon="peak">
		<p><a href={href('/app/reptes')}>{m.reptes_back()}</a></p>
	</EmptyState>
{:else}
	<h1 class="x-wide title">{nomRepte(repte.id)}</h1>
	<p class="lede">{descripcioRepte(repte.id)}</p>

	<div class="progres" aria-busy={!$vives.carregat}>
		<TargetaRepte {resultat} {locale} gran />
	</div>

	{#if resultat.assoliments.length > 0}
		<section class="sec" aria-labelledby="rd-medalla" data-testid="repte-medalla">
			<h2 id="rd-medalla" class="sec-h x-wide">
				{resultat.assoliments.length > 1 ? m.medals_title() : m.reptes_medal_title()}
			</h2>
			<ul class="medalles">
				{#each resultat.assoliments as a (a.nivell)}
					{@const etiqueta =
						resultat.nivellMaxim > 1
							? m.medal_level_name({ name: nomRepte(repte.id), level: nivellText(a.nivell) })
							: nomRepte(repte.id)}
					<li>
						<Segell
							top={nomRepte(repte.id)}
							center={resultat.nivellMaxim > 1 ? nivellText(a.nivell) : '★'}
							bottom={a.data}
							size={96}
							rotate={-5}
							texture={false}
							label={m.medal_sr({ name: etiqueta, date: data(a.data) })}
						/>
						<span class="m-data mono" aria-hidden="true">{data(a.data)}</span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if pendents && (!resultat.completat || resultat.fraccio < 1)}
		<section class="sec" aria-labelledby="rd-pendents" data-testid="repte-pendents">
			<h2 id="rd-pendents" class="sec-h x-wide">{m.reptes_pending_title()}</h2>
			{#if pendents.tipus === 'cims'}
				<p class="nota">
					{repte.id === ID_REPTE_CENT_CIMS && resultat.nivell === 0
						? m.reptes_pending_essentials({ count: String(cimsPendents.length) })
						: m.reptes_pending_peaks({ count: String(cimsPendents.length) })}
				</p>
				{#snippet llistaCims(cims: typeof cimsPendents)}
					<ul class="cims">
						{#each cims as c (c.id)}
							<li>
								<a href={href(`/cims/${c.slug}`)}>{c.nom}</a>
								<span class="mono">{formatAltitude(c.altitud)} m</span>
							</li>
						{/each}
					</ul>
				{/snippet}
				{@render llistaCims(cimsPendents.slice(0, MAX_VISIBLES))}
				{#if cimsPendents.length > MAX_VISIBLES}
					<details class="mes">
						<summary>
							{m.reptes_pending_more({ count: String(cimsPendents.length - MAX_VISIBLES) })}
						</summary>
						{@render llistaCims(cimsPendents.slice(MAX_VISIBLES))}
					</details>
				{/if}
			{:else if pendents.tipus === 'comarques'}
				<p class="nota">
					{m.reptes_pending_comarques({ count: String(pendents.comarques.length) })}
				</p>
				<ul class="chips">
					{#each pendents.comarques as c (c)}
						<li><a href={href(`/comarques/${c}`)}>{nomComarca(c)}</a></li>
					{/each}
				</ul>
			{:else if pendents.tipus === 'estacions'}
				<p class="nota">
					{pendents.any === null
						? m.reptes_pending_seasons_none()
						: m.reptes_pending_seasons({ year: String(pendents.any) })}
				</p>
				<ul class="chips">
					{#each pendents.estacions as e (e)}
						<li><span>{ESTACIO[e]()}</span></li>
					{/each}
				</ul>
				<p class="nota">{m.reptes_seasons_hint()}</p>
			{:else if pendents.tipus === 'mesos'}
				<dl class="fites">
					<div>
						<dt>{m.stats_streak_current()}</dt>
						<dd>
							{pendents.ratxaActual === 0 ? m.stats_streak_none() : mesos(pendents.ratxaActual)}
							{#if pendents.inici && pendents.fi && pendents.ratxaActual > 1}
								<span class="petit">
									{m.stats_streak_range({
										from: formatMes(pendents.inici, locale),
										to: formatMes(pendents.fi, locale)
									})}
								</span>
							{/if}
						</dd>
					</div>
					<div>
						<dt>{m.stats_streak_max()}</dt>
						<dd>
							{pendents.millorRatxa === 0 ? m.stats_streak_none() : mesos(pendents.millorRatxa)}
						</dd>
					</div>
				</dl>
				<p class="nota">
					{pendents.mesActualFet
						? m.reptes_months_done_this_month()
						: m.reptes_months_todo_this_month()}
				</p>
			{/if}
		</section>
	{/if}

	{#if repte.id === ID_REPTE_CENT_CIMS || repte.id === ID_REPTE_INFANTIL}
		<section class="sec" aria-labelledby="rd-feec">
			<h2 id="rd-feec" class="sec-h x-wide">{m.reptes_feec_title()}</h2>
			<p class="nota">{m.reptes_feec_note()}</p>
			<p class="enllacos">
				{#if repte.id === ID_REPTE_CENT_CIMS}
					<a href={href('/app')}>{m.reptes_open_carnet()} →</a>
					<a href={href(PAGINES_CONTINGUT.normativa)}>{m.home_repte_link_normativa()} →</a>
				{:else}
					<a href={href(PAGINES_CONTINGUT.repteInfantil)}>{m.home_repte_link_infantil()} →</a>
				{/if}
			</p>
		</section>
	{:else}
		<p class="nota peu">{m.reptes_own_note()}</p>
	{/if}
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
		overflow-wrap: anywhere;
	}

	.lede,
	.nota {
		color: var(--c-ink-2);
	}

	.nota {
		margin-top: var(--sp-2);
		font-size: var(--fs-sm);
	}

	.peu {
		margin: var(--sp-8) 0;
	}

	.progres {
		margin-top: var(--sp-5);
	}

	.sec {
		margin-top: var(--sp-8);
	}

	.sec:last-child {
		margin-bottom: var(--sp-8);
	}

	.sec-h {
		margin-bottom: var(--sp-3);
		padding-top: var(--sp-2);
		border-top: 1.5px solid var(--c-ink);
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}

	.medalles {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-4);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.medalles li {
		display: grid;
		justify-items: center;
		gap: var(--sp-1);
	}

	.m-data {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.cims {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
		gap: 0 var(--sp-5);
		margin: var(--sp-3) 0 0;
		padding: 0;
		list-style: none;
	}

	.cims li {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--sp-2);
		min-height: var(--tap);
		padding: var(--sp-2) 0;
		border-bottom: 1px dashed var(--c-rule);
	}

	.cims a {
		font-weight: var(--fw-bold);
		color: var(--c-ink);
		overflow-wrap: anywhere;
	}

	.cims .mono {
		flex: none;
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.mes {
		margin-top: var(--sp-3);
	}

	.mes summary {
		display: flex;
		align-items: center;
		min-height: var(--tap);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		color: var(--c-stamp-ink);
		cursor: pointer;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
		margin: var(--sp-3) 0 0;
		padding: 0;
		list-style: none;
	}

	.chips a,
	.chips span {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		padding: 0 var(--sp-3);
		border: var(--bw) solid var(--c-line);
		border-radius: 999px;
		background: var(--c-card);
		color: var(--c-ink);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		text-decoration: none;
	}

	.chips a:hover {
		background: var(--c-paper-2);
	}

	.fites {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
		gap: var(--sp-4) var(--sp-5);
		margin: 0;
	}

	.fites div {
		padding-top: var(--sp-2);
		border-top: 1px dashed var(--c-rule);
	}

	dt {
		font-family: var(--font-mono);
		font-size: var(--fs-2xs);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--c-ink-2);
	}

	.fites dd {
		display: grid;
		gap: 2px;
		margin: var(--sp-1) 0 0;
		font-weight: var(--fw-heavy);
		font-size: var(--fs-lg);
	}

	.petit {
		font-size: var(--fs-xs);
		font-weight: normal;
		color: var(--c-ink-2);
	}

	.enllacos {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2) var(--sp-5);
		margin-top: var(--sp-3);
	}

	.enllacos a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		color: var(--c-stamp-ink);
	}
</style>
