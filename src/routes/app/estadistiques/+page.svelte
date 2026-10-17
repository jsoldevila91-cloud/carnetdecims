<script lang="ts">
	import { ascensionsVives } from '$lib/data/ascensions';
	import { CIMS } from '$lib/data/catalog';
	import { estadistiques } from '$lib/data/estadistiques';
	import { origen } from '$lib/data/origen';
	import {
		METODES,
		avuiLocal,
		medalles,
		REPTE_CENT_CIMS,
		REPTE_INFANTIL,
		companysUsats,
		type Metode,
		type ProgresRepteResum,
		type Proporcio
	} from '$lib/domain';
	import {
		BottomSheet,
		Button,
		Card,
		EmptyState,
		PageMeta,
		Segell,
		formatAltitude,
		formatDataLlarga,
		formatKm
	} from '$lib/ui';
	import OrigenMunicipi from '$lib/ui/OrigenMunicipi.svelte';
	import { obrirRegistre, registrarHref } from '$lib/ui/fulls';
	import { formatMes, formatPercentatge } from '$lib/ui/format';
	import { nomMedalla } from '$lib/ui/reptes';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	/**
	 * Estadístiques personals (bloc R1). Tot es calcula al dispositiu (`estadistiques()`); el
	 * municipi d'origen només s'hi fa servir per a "El cim més llunyà". Amb poques dades s'amaga
	 * el que no té sentit: "el que més has fet" (cap cim repetit), el gràfic per anys i el millor
	 * any (un sol any), la ratxa (menys de 2 mesos seguits).
	 */
	const est = estadistiques();
	const or = origen();
	const vives = ascensionsVives();
	const locale = getLocale();

	const e = $derived($est.estadistiques);
	/** Medalles dels reptes (R2), de la més recent a la més antiga. */
	const llistaMedalles = $derived(medalles($vives, CIMS, { avui: avuiLocal() }).reverse());
	const companys = $derived(companysUsats($vives, { limit: 5 }));
	const repetits = $derived(e.rankingCims.filter((r) => r.ascensions >= 2).slice(0, 5));
	const metodesUsats = $derived(METODES.filter((mt) => e.totals.perMetode[mt] > 0));
	const capRetriar = $derived($or.carregat && $or.codi !== null && $or.municipi === null);
	const catalegNomesEssencials = $derived(
		e.percentatges.cataleg.total === e.percentatges.essencials.total
	);
	const repte = (id: string) => e.percentatges.reptes.find((r) => r.id === id);
	const cent = $derived(repte(REPTE_CENT_CIMS));
	const infantil = $derived(repte(REPTE_INFANTIL));
	const maxAny = $derived(Math.max(1, ...e.perAny.map((a) => a.ascensions)));
	const ratxa = $derived(e.ratxa);
	const ambRatxa = $derived(ratxa.maxima.mesos >= 2);
	const ultimDiferent = $derived(
		e.ultimCimNou && e.primeraAscensio && e.ultimCimNou.ascensioId !== e.primeraAscensio.ascensioId
	);

	const METODE: Record<Metode, () => string> = {
		'a-peu': m.method_a_peu,
		btt: m.method_btt,
		esqui: m.method_esqui,
		raquetes: m.method_raquetes
	};

	const fitxa = (slug: string) => href(`/cims/${slug}`);
	const data = (iso: string) => formatDataLlarga(iso, locale);
	const pct = (p: Pick<Proporcio, 'fraccio'>) => formatPercentatge(p.fraccio, locale);
	const ascensions = (n: number) =>
		n === 1 ? m.stats_count_ascents_one() : m.stats_count_ascents({ count: String(n) });
	const nous = (n: number) =>
		n === 1 ? m.stats_count_new_one() : m.stats_count_new({ count: String(n) });
	const mesos = (n: number) =>
		n === 0
			? m.stats_streak_none()
			: n === 1
				? m.stats_streak_months_one()
				: m.stats_streak_months({ count: String(n) });

	// ── Full del municipi d'origen (estat local; el focus torna al botó que l'obre) ──
	let fullOrigen = $state(false);
</script>

<PageMeta title={m.stats_meta_title()} noindex />

<p class="crumb mono"><a href={href('/app')}>← {m.app_title()}</a></p>
<h1 class="x-wide title">{m.stats_title()}</h1>
<p class="lede">{m.stats_lede()}</p>

{#snippet meter(etiqueta: string, p: { fets: number; total: number; fraccio: number }, id: string)}
	<div class="fila">
		<span class="m-nom" id="{id}-l">{etiqueta}</span>
		<span class="xifra mono" aria-hidden="true">
			{m.stats_pct_value({ done: String(p.fets), total: String(p.total) })} · {pct(p)}
		</span>
	</div>
	<div
		class="meter"
		role="meter"
		aria-labelledby="{id}-l"
		aria-valuemin={0}
		aria-valuemax={p.total}
		aria-valuenow={Math.min(p.fets, p.total)}
		aria-valuetext="{m.stats_pct_value({ done: String(p.fets), total: String(p.total) })} ({pct(
			p
		)})"
	>
		<span style:width="{Math.min(1, p.fraccio) * 100}%"></span>
	</div>
{/snippet}

{#if !$est.carregat}
	<div class="esquelet" aria-hidden="true">
		<span></span><span></span><span></span>
	</div>
	<p class="mono estat" role="status">{m.stats_loading()}</p>
{:else if e.totals.ascensions === 0}
	<div class="buit">
		<EmptyState title={m.stats_empty_title()} icon="book">
			<p>{m.stats_empty_text()}</p>
			{#if e.totals.foraRepte > 0}
				<p class="fora">
					{e.totals.foraRepte === 1
						? m.stats_out_of_challenge_one()
						: m.stats_out_of_challenge({ count: String(e.totals.foraRepte) })}
				</p>
			{/if}
			{#snippet actions()}
				<Button
					href={registrarHref()}
					variant="stamp"
					size="lg"
					icon="stamp"
					onclick={(ev: MouseEvent) => obrirRegistre(ev)}
				>
					{m.app_empty_cta()}
				</Button>
			{/snippet}
		</EmptyState>
	</div>
{:else}
	<div class="graella">
		<!-- Resum -->
		<section class="sec ample" aria-labelledby="st-resum" data-testid="stats-resum">
			<h2 id="st-resum" class="sec-h x-wide">{m.stats_totals_title()}</h2>
			<dl class="xifres">
				<div>
					<dt>{m.stats_total_cims()}</dt>
					<dd>{e.totals.cimsDiferents}</dd>
				</div>
				<div>
					<dt>{m.stats_total_ascents()}</dt>
					<dd>{e.totals.ascensions}</dd>
				</div>
				<div>
					<dt>{m.stats_total_repeats()}</dt>
					<dd>{e.totals.repeticions}</dd>
				</div>
			</dl>
			{#if metodesUsats.length > 1}
				<p class="metodes mono">
					<span class="sr-only">{m.stats_methods_label()}:</span>
					{#each metodesUsats as mt, i (mt)}{i > 0 ? ' · ' : ''}{METODE[mt]()}
						{e.totals.perMetode[mt]}{/each}
				</p>
			{/if}
			{#if e.totals.foraRepte > 0}
				<p class="fora">
					{e.totals.foraRepte === 1
						? m.stats_out_of_challenge_one()
						: m.stats_out_of_challenge({ count: String(e.totals.foraRepte) })}
				</p>
			{/if}
		</section>

		<!-- Medalles dels reptes (R2) -->
		<section class="sec ample" aria-labelledby="st-medalles" data-testid="stats-medalles">
			<h2 id="st-medalles" class="sec-h x-wide">{m.medals_title()}</h2>
			{#if llistaMedalles.length === 0}
				<p class="m-nota">{m.medals_empty()}</p>
			{:else}
				<ul class="medalles">
					{#each llistaMedalles as md (`${md.repteId}#${md.nivell}`)}
						<li>
							<span class="md-ic" aria-hidden="true">★</span>
							<span class="md-nom">{nomMedalla(md)}</span>
							<time class="petit mono" datetime={md.data}>{data(md.data)}</time>
						</li>
					{/each}
				</ul>
			{/if}
			<a class="mes" href={href('/app/reptes')}>{m.app_reptes_link()} →</a>
		</section>

		<!-- El cim que més has fet (només si n'hi ha algun de repetit) -->
		{#if e.cimMesFet}
			{@const f = e.cimMesFet}
			<section class="sec" aria-labelledby="st-mes-fet" data-testid="stats-mes-fet">
				<h2 id="st-mes-fet" class="sec-h x-wide">{m.stats_most_title()}</h2>
				<Card padding="md" class="destacat">
					<Segell
						top={f.cim.nom}
						center={`×${f.ascensions}`}
						sub={`${formatAltitude(f.cim.altitud)} m`}
						size={88}
						rotate={-6}
						texture={false}
					/>
					<div class="d-cos">
						<p class="d-nom"><a href={fitxa(f.cim.slug)}>{f.cim.nom}</a></p>
						<p class="d-xifra">{m.stats_most_count({ count: String(f.ascensions) })}</p>
						<p class="d-meta mono">
							{m.stats_most_dates({ first: data(f.primera), last: data(f.ultima) })}
						</p>
					</div>
				</Card>
				{#if repetits.length > 1}
					<ol class="ranking" aria-label={m.stats_ranking_label()}>
						{#each repetits as r (r.cim.id)}
							<li>
								<a href={fitxa(r.cim.slug)}>{r.cim.nom}</a>
								<span class="mono">{m.stats_most_count({ count: String(r.ascensions) })}</span>
							</li>
						{/each}
					</ol>
				{/if}
			</section>
		{/if}

		<!-- El cim més llunyà (necessita el municipi d'origen) -->
		<section class="sec" aria-labelledby="st-llunya" data-testid="stats-llunya">
			<h2 id="st-llunya" class="sec-h x-wide">{m.stats_far_title()}</h2>
			<Card padding="md" variant={e.cimMesLlunya ? 'raised' : 'dashed'}>
				{#if e.cimMesLlunya && $est.origen}
					{@const l = e.cimMesLlunya}
					<p class="d-nom"><a href={fitxa(l.cim.slug)}>{l.cim.nom}</a></p>
					<p class="d-xifra">
						{m.stats_far_value({
							km: formatKm(l.distanciaKm, locale),
							municipi: $est.origen.nom
						})}
					</p>
					<p class="d-meta">{m.stats_far_note()}</p>
				{:else if capRetriar}
					<p class="avis">{m.origin_rechoose()}</p>
				{:else}
					<p class="d-meta">{m.stats_far_empty()}</p>
				{/if}
				<div class="accions">
					<Button
						variant={e.cimMesLlunya ? 'outline' : 'ink'}
						icon="locate"
						onclick={() => (fullOrigen = true)}
					>
						{$or.codi ? m.stats_far_change() : m.stats_far_choose()}
					</Button>
				</div>
			</Card>
		</section>

		<!-- Percentatges -->
		<section class="sec ample" aria-labelledby="st-pct" data-testid="stats-percentatges">
			<h2 id="st-pct" class="sec-h x-wide">{m.stats_pct_title()}</h2>
			<ul class="meters">
				{#if !catalegNomesEssencials}
					<li>{@render meter(m.stats_pct_catalog(), e.percentatges.cataleg, 'pct-cataleg')}</li>
				{/if}
				<li>
					{@render meter(m.stats_pct_essentials(), e.percentatges.essencials, 'pct-ess')}
					{#if catalegNomesEssencials}
						<p class="m-nota">{m.stats_pct_catalog_only_essentials()}</p>
					{/if}
				</li>
				{#if cent}
					{@render repteFila(cent, m.stats_challenge_100(), 'pct-100')}
				{/if}
				{#if infantil}
					{@render repteFila(infantil, m.stats_challenge_kids(), 'pct-inf')}
				{/if}
			</ul>
			<div class="comarques">
				<p>
					<b>{m.stats_comarques()}:</b>
					{m.stats_comarques_value({
						done: String(e.percentatges.comarquesAmbCims.fets),
						total: String(e.percentatges.comarquesAmbCims.total)
					})}
					{#if e.percentatges.comarquesCompletes > 0}
						{m.stats_comarques_complete({ count: String(e.percentatges.comarquesCompletes) })}
					{/if}
				</p>
				<a class="mes" href={href('/app/comarques')}>{m.stats_comarques_link()} →</a>
			</div>
		</section>

		<!-- Fites -->
		<section class="sec ample" aria-labelledby="st-fites" data-testid="stats-fites">
			<h2 id="st-fites" class="sec-h x-wide">{m.stats_milestones_title()}</h2>
			<dl class="fites">
				<div>
					<dt>{m.stats_altitude_sum()}</dt>
					<dd>
						<span class="gran">{formatAltitude(e.altitudAcumulada)} m</span>
						<span class="petit">{m.stats_altitude_sum_hint()}</span>
					</dd>
				</div>
				{#if e.cimMesAlt}
					<div>
						<dt>{m.stats_highest()}</dt>
						<dd>
							<a href={fitxa(e.cimMesAlt.cim.slug)}>{e.cimMesAlt.cim.nom}</a>
							<span class="petit mono">{formatAltitude(e.cimMesAlt.cim.altitud)} m</span>
						</dd>
					</div>
				{/if}
				{#if e.primeraAscensio}
					<div>
						<dt>{m.stats_first()}</dt>
						<dd>
							<a href={fitxa(e.primeraAscensio.cim.slug)}>{e.primeraAscensio.cim.nom}</a>
							<time class="petit mono" datetime={e.primeraAscensio.data}
								>{data(e.primeraAscensio.data)}</time
							>
						</dd>
					</div>
				{/if}
				{#if ultimDiferent && e.ultimCimNou}
					<div>
						<dt>{m.stats_last()}</dt>
						<dd>
							<a href={fitxa(e.ultimCimNou.cim.slug)}>{e.ultimCimNou.cim.nom}</a>
							<time class="petit mono" datetime={e.ultimCimNou.data}
								>{data(e.ultimCimNou.data)}</time
							>
						</dd>
					</div>
				{/if}
				{#if e.millorAny && e.perAny.length > 1}
					<div>
						<dt>{m.stats_best_year()}</dt>
						<dd>
							{m.stats_best_year_value({
								year: String(e.millorAny.any),
								new: nous(e.millorAny.cimsNous)
							})}
						</dd>
					</div>
				{/if}
			</dl>
		</section>

		<!-- Per anys (amb dos anys o més) -->
		{#if e.perAny.length > 1}
			<section class="sec ample" aria-labelledby="st-anys" data-testid="stats-anys">
				<h2 id="st-anys" class="sec-h x-wide">{m.stats_years_title()}</h2>
				<p class="llegenda mono" aria-hidden="true">
					<span class="ll"><span class="mostra nous"></span>{m.stats_years_legend_new()}</span>
					<span class="ll"><span class="mostra repes"></span>{m.stats_years_legend_repeat()}</span>
				</p>
				<ul class="anys">
					{#each e.perAny as a (a.any)}
						{@const millor = e.millorAny?.any === a.any}
						<li class={{ millor }}>
							<span class="sr-only">
								{m.stats_year_sr({
									year: String(a.any),
									ascents: ascensions(a.ascensions),
									new: nous(a.cimsNous)
								})}{millor ? ` (${m.stats_year_best()})` : ''}
							</span>
							<span class="any mono" aria-hidden="true">{a.any}</span>
							<span class="barra" aria-hidden="true">
								<span class="total" style:width="{(a.ascensions / maxAny) * 100}%">
									<span
										class="nous"
										style:width="{a.ascensions > 0 ? (a.cimsNous / a.ascensions) * 100 : 0}%"
									></span>
								</span>
							</span>
							<span class="valor mono" aria-hidden="true">
								{m.stats_year_value({
									ascents: String(a.ascensions),
									new:
										a.cimsNous === 1
											? m.stats_year_new_one()
											: m.stats_year_new({ count: String(a.cimsNous) })
								})}
								{#if millor}<span class="estrella">◆</span>{/if}
							</span>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		<!-- Ratxa de mesos (amb 2 mesos seguits o més en algun moment) -->
		{#if ambRatxa}
			<section class="sec" aria-labelledby="st-ratxa" data-testid="stats-ratxa">
				<h2 id="st-ratxa" class="sec-h x-wide">{m.stats_streak_title()}</h2>
				<dl class="fites dues">
					<div>
						<dt>{m.stats_streak_current()}</dt>
						<dd>
							<span class="gran">{mesos(ratxa.actual.mesos)}</span>
							{#if ratxa.actual.mesos > 0 && !ratxa.mesActualFet}
								<span class="petit">{m.stats_streak_keep()}</span>
							{/if}
						</dd>
					</div>
					<div>
						<dt>{m.stats_streak_max()}</dt>
						<dd>
							<span class="gran">{mesos(ratxa.maxima.mesos)}</span>
							{#if ratxa.maxima.inici && ratxa.maxima.fi}
								<span class="petit">
									{m.stats_streak_range({
										from: formatMes(ratxa.maxima.inici, locale),
										to: formatMes(ratxa.maxima.fi, locale)
									})}
								</span>
							{/if}
						</dd>
					</div>
				</dl>
				<p class="m-nota">{m.stats_streak_hint()}</p>
			</section>
		{/if}

		<!-- Amb qui has pujat més (diari) -->
		<section class="sec" aria-labelledby="st-companys" data-testid="stats-companys">
			<h2 id="st-companys" class="sec-h x-wide">{m.stats_partners_title()}</h2>
			{#if companys.length > 0}
				<ol class="ranking">
					{#each companys as c (c.nom)}
						<li>
							<span class="c-nom">{c.nom}</span>
							<span class="mono">
								{ascensions(c.vegades)}
							</span>
						</li>
					{/each}
				</ol>
			{:else}
				<p class="m-nota">{m.stats_partners_empty()}</p>
			{/if}
		</section>
	</div>
{/if}

{#snippet repteFila(r: ProgresRepteResum, etiqueta: string, id: string)}
	<li>
		{@render meter(etiqueta, { fets: r.fets, total: r.objectiu, fraccio: r.fraccio }, id)}
		{#if r.id === REPTE_CENT_CIMS && r.nivell > 0}
			<p class="m-nota">{m.stats_challenge_100_level({ level: String(r.nivell) })}</p>
		{:else if r.id === REPTE_INFANTIL}
			<p class="m-nota">
				{#if r.assoliments[0]}
					{m.stats_challenge_kids_done({ date: data(r.assoliments[0].data) })} ·
				{/if}{m.stats_challenge_kids_note()}
			</p>
		{/if}
	</li>
{/snippet}

<BottomSheet open={fullOrigen} title={m.origin_title()} onclose={() => (fullOrigen = false)}>
	<OrigenMunicipi cercaInicial onfet={() => (fullOrigen = false)} />
</BottomSheet>

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

	.buit {
		margin-top: var(--sp-6);
	}

	.fora {
		margin-top: var(--sp-2);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	/* Esquelet amb la forma aproximada del resum (sense spinners). */
	.esquelet {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--sp-3);
		margin-top: var(--sp-8);
	}

	.esquelet span {
		height: 5rem;
		border-radius: var(--r-md);
		background: var(--c-paper-2);
	}

	@media (prefers-reduced-motion: no-preference) {
		.esquelet span {
			animation: pols 1.4s ease-in-out infinite alternate;
		}
	}

	@keyframes pols {
		to {
			opacity: 0.55;
		}
	}

	.graella {
		display: grid;
		gap: var(--sp-8);
		margin: var(--sp-6) 0 var(--sp-8);
	}

	@media (min-width: 60rem) {
		.graella {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: var(--sp-8) var(--sp-6);
		}

		.ample {
			grid-column: 1 / -1;
		}
	}

	.sec {
		min-width: 0;
	}

	.sec-h {
		margin-bottom: var(--sp-3);
		padding-top: var(--sp-2);
		border-top: 1.5px solid var(--c-ink);
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}

	/* ── Resum ── */
	.xifres {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--sp-3);
		margin: 0;
	}

	.xifres div {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: var(--sp-2);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-card);
		box-shadow: var(--sh-2);
		min-width: 0;
	}

	dt {
		font-family: var(--font-mono);
		font-size: var(--fs-2xs);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--c-ink-2);
		overflow-wrap: anywhere;
	}

	/* Tres columnes fins a 320 px: etiqueta en minúscules, tallada només entre paraules. */
	.xifres dt {
		font-family: var(--font-wide);
		font-size: var(--fs-2xs);
		font-weight: var(--fw-semibold);
		text-transform: none;
		letter-spacing: 0;
		overflow-wrap: normal;
		hyphens: auto;
	}

	@media (min-width: 30rem) {
		.xifres div {
			padding: var(--sp-3);
		}

		.xifres dt {
			font-size: var(--fs-xs);
		}
	}

	.xifres dd {
		margin: var(--sp-1) 0 0;
		font-stretch: var(--stretch-wide);
		font-weight: var(--fw-black);
		font-size: clamp(var(--fs-xl), 8vw, var(--fs-3xl));
		line-height: 1;
	}

	.metodes {
		margin-top: var(--sp-3);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	/* ── Medalles ── */
	.medalles {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
		gap: var(--sp-2) var(--sp-4);
		margin: 0 0 var(--sp-2);
		padding: 0;
		list-style: none;
	}

	.medalles li {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
		gap: 0 var(--sp-2);
		padding: var(--sp-2) 0;
		border-bottom: 1px dashed var(--c-rule);
	}

	.md-ic {
		grid-row: span 2;
		display: grid;
		place-items: center;
		width: 2.25rem;
		height: 2.25rem;
		border: 2px double var(--c-stamp-ink);
		border-radius: 50%;
		color: var(--c-stamp-ink);
	}

	.md-nom {
		font-weight: var(--fw-bold);
		overflow-wrap: anywhere;
	}

	/* ── Targetes destacades ── */
	.sec :global(.destacat) {
		display: flex;
		align-items: center;
		gap: var(--sp-4);
	}

	.d-cos {
		min-width: 0;
	}

	.d-nom {
		font-stretch: var(--stretch-semi);
		font-weight: var(--fw-heavy);
		font-size: var(--fs-lg);
		line-height: var(--lh-snug);
		overflow-wrap: anywhere;
	}

	.d-nom a,
	.ranking a,
	.fites a {
		color: var(--c-ink);
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}

	.d-xifra {
		margin-top: var(--sp-1);
		font-weight: var(--fw-bold);
	}

	.d-meta {
		margin-top: var(--sp-1);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	.d-meta.mono {
		font-size: var(--fs-xs);
	}

	.avis {
		padding: var(--sp-2) var(--sp-3);
		border: 1.5px solid var(--c-stamp-ink);
		border-radius: var(--r-sm);
		background: var(--c-stamp-soft);
		font-size: var(--fs-sm);
	}

	.accions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-3);
		margin-top: var(--sp-4);
	}

	.ranking {
		display: grid;
		margin: var(--sp-3) 0 0;
		padding: 0 0 0 var(--sp-6);
	}

	.ranking li {
		padding: var(--sp-2) 0;
		border-bottom: 1px dashed var(--c-rule);
	}

	.ranking li::marker {
		font-family: var(--font-mono);
		font-weight: var(--fw-bold);
		color: var(--c-ink-2);
	}

	.ranking li > :first-child {
		font-weight: var(--fw-bold);
		overflow-wrap: anywhere;
	}

	.ranking li .mono {
		display: block;
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	/* ── Percentatges ── */
	.meters {
		display: grid;
		gap: var(--sp-4);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.fila {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0 var(--sp-3);
		margin-bottom: var(--sp-1);
	}

	.m-nom {
		font-weight: var(--fw-bold);
	}

	.xifra {
		font-size: var(--fs-sm);
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

	.meter span {
		display: block;
		height: 100%;
		background: var(--c-ink);
	}

	.m-nota {
		margin-top: var(--sp-1);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.comarques {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-2) var(--sp-4);
		margin-top: var(--sp-5);
		padding-top: var(--sp-3);
		border-top: 1px dashed var(--c-rule);
	}

	.comarques p {
		flex: 1 1 16rem;
		font-size: var(--fs-sm);
	}

	.mes {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		color: var(--c-stamp-ink);
		text-decoration: none;
	}

	.mes:hover {
		text-decoration: underline;
	}

	/* ── Fites ── */
	.fites {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
		gap: var(--sp-4) var(--sp-5);
		margin: 0;
	}

	.fites div {
		min-width: 0;
		padding-top: var(--sp-2);
		border-top: 1px dashed var(--c-rule);
	}

	.fites dd {
		display: grid;
		gap: 2px;
		margin: var(--sp-1) 0 0;
		font-weight: var(--fw-bold);
		overflow-wrap: anywhere;
	}

	.gran {
		font-stretch: var(--stretch-semi);
		font-weight: var(--fw-heavy);
		font-size: var(--fs-lg);
		line-height: var(--lh-snug);
	}

	.petit {
		font-size: var(--fs-xs);
		font-weight: normal;
		color: var(--c-ink-2);
	}

	/* ── Per anys: barres horitzontals (cims nous ple, repeticions ratllat) ── */
	.llegenda {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--sp-1) var(--sp-2);
		margin-bottom: var(--sp-3);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.mostra {
		display: inline-block;
		width: 1rem;
		height: 0.75rem;
		border: var(--bw) solid var(--c-line);
		border-radius: 2px;
	}

	.ll {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-1);
		margin-right: var(--sp-3);
	}

	.mostra.nous,
	.barra .nous {
		background: var(--c-ink);
	}

	.mostra.repes,
	.barra .total {
		background: repeating-linear-gradient(-45deg, var(--c-paper-2) 0 3px, var(--c-ink-2) 3px 4.5px);
	}

	/* Columnes compartides (subgrid): totes les barres comencen i acaben al mateix lloc. */
	.anys {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		gap: var(--sp-2) var(--sp-3);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.anys li {
		display: grid;
		grid-column: 1 / -1;
		grid-template-columns: 3.25rem minmax(0, 1fr) 8.5rem;
		grid-template-columns: subgrid;
		align-items: center;
	}

	.any {
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}

	.barra {
		display: block;
		min-width: 0;
	}

	.barra .total {
		display: block;
		min-width: 4px;
		height: 1rem;
		border: var(--bw) solid var(--c-line);
		border-radius: 2px;
		overflow: hidden;
	}

	.barra .nous {
		display: block;
		height: 100%;
	}

	.valor {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
		white-space: nowrap;
	}

	.millor .any,
	.estrella {
		color: var(--c-stamp-ink);
	}
</style>
