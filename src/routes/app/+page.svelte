<script lang="ts">
	import { pushState, replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { ascensionsVivesAmbEstat } from '$lib/data/ascensions';
	import { CIMS } from '$lib/data/catalog';
	import {
		avuiLocal,
		essencialsPendentsOrdenades,
		paginesCarnet,
		progresComarques,
		resumCarnet,
		type Segell as SegellCarnet,
		type SegellFora
	} from '$lib/domain';
	import { BottomSheet, Button, Card, EmptyState, Icon, PageMeta, romanPage } from '$lib/ui';
	import BarresComarques from '$lib/ui/BarresComarques.svelte';
	import DetallSegell from '$lib/ui/DetallSegell.svelte';
	import FilaEssencial from '$lib/ui/FilaEssencial.svelte';
	import PaginesCarnet from '$lib/ui/PaginesCarnet.svelte';
	import { cimPerId } from '$lib/ui/cim-per-id';
	import { CASELLES_PAGINA } from '$lib/ui/carnet';
	import { esClicSimple, obrirRegistre, registrarHref } from '$lib/ui/fulls';
	import { formatDataLlarga } from '$lib/ui/format';
	import { precarregarFitxes } from '$lib/platform/pwa';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	const vives = ascensionsVivesAmbEstat();
	const avui = avuiLocal();
	const locale = getLocale();
	const ticks = [0, 25, 50, 75, 100];
	const N_ESSENCIALS = 3;
	const N_COMARQUES = 5;

	const ascensions = $derived($vives.ascensions);
	const carnet = $derived(paginesCarnet(ascensions, CIMS, { avui }));
	const resum = $derived(resumCarnet(ascensions, CIMS, { avui }));
	const pendents = $derived(essencialsPendentsOrdenades(ascensions, CIMS, { avui }));
	const comarques = $derived(progresComarques(ascensions, CIMS, { avui }));
	const comarquesResum = $derived(comarques.slice(0, N_COMARQUES));

	/**
	 * Un cop carregat el carnet, les fitxes dels essencials pendents es desen per a ús sense
	 * connexió (el SW decideix si toca: wifi, estalvi de dades…). Un sol cop per visita.
	 */
	let fitxesDemanades = false;
	$effect(() => {
		if (!$vives.carregat || fitxesDemanades) return;
		fitxesDemanades = true;
		const slugs = pendents.map((c) => c.slug);
		if (slugs.length > 0) void precarregarFitxes(slugs);
	});

	/** Pàgina que s'està omplint i segells dins d'ella (per a la regla). */
	const pagina = $derived(carnet.paginaActual);
	const dinsPagina = $derived(Math.max(0, Math.min(100, resum.total - (pagina - 1) * 100)));
	const falten = $derived(Math.max(0, resum.objectiuActual - resum.total));
	const ple = $derived(carnet.pagines[4].completa);

	// ── Detall del segell (full amb shallow routing: el botó enrere el tanca) ──
	const segellObert = $derived.by((): SegellCarnet | SegellFora | null => {
		if (page.state.sheet !== 'segell' || !page.state.ascensio) return null;
		const id = page.state.ascensio;
		return (
			carnet.pagines.flatMap((p) => p.segells).find((s) => s.ascensioId === id) ??
			carnet.enEspera.find((s) => s.ascensioId === id) ??
			carnet.fora.find((s) => s.ascensioId === id) ??
			null
		);
	});

	function obrirSegell(s: SegellCarnet | SegellFora) {
		if (page.state.sheet) return;
		segellActiu = s.ascensioId;
		pushState('', { sheet: 'segell', ascensio: s.ascensioId });
	}

	/**
	 * Focus en tancar el detall (o l'edició / el registre que s'hi obre): no es confia en el
	 * `<dialog>` natiu (WebKit el deixa a <body> i, si l'edició reordena les caselles, el botó
	 * original ja és un altre cim). Es demana a la graella que enfoqui el segell per
	 * `ascensioId`, també quan arribin les dades desades; s'oblida a la primera interacció o
	 * al cap d'uns segons.
	 */
	let segellActiu: string | null = null;
	let focusSegell = $state<string | null>(null);

	$effect(() => {
		if (page.state.sheet) {
			focusSegell = null;
			return;
		}
		if (!segellActiu) return;
		focusSegell = segellActiu;
		segellActiu = null;
		const oblida = () => (focusSegell = null);
		const temps = setTimeout(oblida, 2500);
		const opts = { once: true, capture: true } as const;
		window.addEventListener('pointerdown', oblida, opts);
		window.addEventListener('keydown', oblida, opts);
		return () => {
			clearTimeout(temps);
			window.removeEventListener('pointerdown', oblida, opts);
			window.removeEventListener('keydown', oblida, opts);
		};
	});

	function tancarSegell() {
		history.back();
	}

	/** Del detall a l'edició: substitueix l'entrada de l'historial (enrere torna al carnet). */
	function editar(id: string) {
		replaceState('', { sheet: 'editar', ascensio: id });
	}

	function registrarAltra(event: MouseEvent, slug: string) {
		if (!esClicSimple(event)) return;
		event.preventDefault();
		replaceState(registrarHref(slug), { sheet: 'registrar', cim: slug });
	}
</script>

<PageMeta title={m.app_meta_title()} noindex />

<h1 class="x-wide title">{m.app_title()}</h1>

<Card
	as="section"
	padding="md"
	class="passport"
	aria-label={m.app_progress_label()}
	aria-busy={!$vives.carregat}
>
	<div class="top">
		<span class="label">{m.app_page({ page: romanPage(pagina) })}</span>
		<span class="label level">
			{resum.nivell === 0 ? m.app_level_none() : m.app_level({ level: String(resum.nivell) })}
		</span>
	</div>
	<p class="count" class:skeleton={!$vives.carregat}>
		{resum.total}<small>{m.app_count_of({ target: String(resum.objectiuActual) })}</small>
	</p>
	<div
		class="ruler"
		role="img"
		aria-label={m.app_ruler_label({
			count: String(resum.total),
			target: String(resum.objectiuActual)
		})}
	>
		<div class="track"></div>
		<div class="fill" style:width="{dinsPagina}%"></div>
		<div class="ticks" aria-hidden="true">
			{#each ticks as t (t)}<span>{t + (pagina - 1) * 100}</span>{/each}
		</div>
	</div>
	<p class="remaining mono">
		{#if !ple}{m.app_remaining({ count: String(falten) })} ·{/if}
		{m.app_essentials({
			done: String(resum.essencials.fetes),
			total: String(resum.essencials.total)
		})}
	</p>
	<p class="year mono">
		{m.carnet_year_new({
			year: String(resum.anyActual.any),
			count: String(resum.anyActual.cimsNous),
			limit: String(resum.anyActual.limit)
		})}
	</p>
	{#if resum.anyActual.excedit}
		<p class="avis" role="note">
			<span aria-hidden="true">!</span>
			{m.carnet_year_exceeded({
				count: String(resum.anyActual.cimsNous),
				limit: String(resum.anyActual.limit)
			})}
		</p>
	{/if}
	{#if resum.ultimSegell}
		{@const u = resum.ultimSegell}
		<p class="last">
			{m.carnet_last_stamp({
				cim: cimPerId(u.cimId)?.nom ?? `#${u.cimId}`,
				date: formatDataLlarga(u.data, locale)
			})}
		</p>
	{/if}
</Card>

{#if ple}
	<p class="full-banner x-wide" role="note">{m.carnet_full()}</p>
{/if}

{#if !$vives.carregat}
	<div class="skeleton-carnet" aria-hidden="true">
		<div class="sk-tabs">
			{#each [1, 2, 3, 4, 5] as t (t)}<span></span>{/each}
		</div>
		<div class="sk-panel">
			<span class="sk-line"></span>
			<div class="sk-grid">
				{#each CASELLES_PAGINA as n (n)}<span></span>{/each}
			</div>
		</div>
	</div>
	<p class="sr-only" role="status">{m.carnet_skeleton()}</p>
{:else if ascensions.length === 0}
	<div class="empty">
		<EmptyState title={m.app_empty_title()} icon="stamp">
			<p>{m.app_empty_text()}</p>
			{#snippet actions()}
				<Button
					href={registrarHref()}
					variant="stamp"
					size="lg"
					icon="stamp"
					onclick={(e: MouseEvent) => obrirRegistre(e)}
				>
					{m.app_empty_cta()}
				</Button>
				<Button href={href('/cims')} variant="outline" size="lg" icon="peak">
					{m.home_cta_secondary()}
				</Button>
			{/snippet}
		</EmptyState>
	</div>
{:else}
	<section class="sec" aria-labelledby="pagines-t">
		<div class="sec-h">
			<h2 id="pagines-t" class="x-wide">{m.carnet_pages_title()}</h2>
			<a href={href('/app/historial')}>{m.app_history_link()} →</a>
		</div>
		<PaginesCarnet {carnet} onobrir={obrirSegell} enfocar={focusSegell} />
		<div class="actions">
			<Button
				href={registrarHref()}
				variant="stamp"
				icon="stamp"
				onclick={(e: MouseEvent) => obrirRegistre(e)}
			>
				{m.app_register_more()}
			</Button>
		</div>
	</section>
{/if}

{#if $vives.carregat}
	<section class="sec" aria-labelledby="ess-t">
		<div class="sec-h">
			<h2 id="ess-t" class="x-wide">{m.ess_title()}</h2>
			{#if pendents.length > 0}
				<a href={href('/app/essencials')}>{m.ess_see_all({ count: String(pendents.length) })} →</a>
			{/if}
		</div>
		{#if pendents.length === 0}
			<p class="nota">{m.ess_all_done()}</p>
		{:else}
			<p class="nota">
				{m.ess_lede({ count: String(pendents.length), total: String(resum.essencials.total) })}
			</p>
			<ul class="llista">
				{#each pendents.slice(0, N_ESSENCIALS) as cim (cim.id)}
					<li><FilaEssencial {cim} /></li>
				{/each}
			</ul>
		{/if}
		<p class="mes">
			<a href={href('/app/a-prop')}><Icon name="locate" size={18} />{m.app_nearby_link()} →</a>
		</p>
	</section>

	{#if ascensions.length > 0}
		<section class="sec" aria-labelledby="com-t">
			<div class="sec-h">
				<h2 id="com-t" class="x-wide">{m.com_title()}</h2>
				<a href={href('/app/comarques')}>{m.com_see_all()} →</a>
			</div>
			<BarresComarques comarques={comarquesResum} />
		</section>
	{/if}
{/if}

<BottomSheet
	open={page.state.sheet === 'segell'}
	title={segellObert ? (cimPerId(segellObert.cimId)?.nom ?? '') : m.app_title()}
	onclose={tancarSegell}
>
	{#if segellObert}
		<DetallSegell segell={segellObert} {ascensions} onedit={editar} onregister={registrarAltra} />
	{:else if $vives.carregat}
		<p>{m.stamp_detail_missing()}</p>
	{:else}
		<p class="mono" role="status">{m.app_loading()}</p>
	{/if}
</BottomSheet>

<style>
	.title {
		margin-bottom: var(--sp-5);
		font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1;
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: var(--sp-2);
		border-bottom: 1px dashed var(--c-rule);
	}

	.level {
		color: var(--c-stamp-ink);
	}

	.count {
		margin-top: var(--sp-3);
		font-stretch: var(--stretch-wide);
		font-weight: var(--fw-black);
		font-size: var(--fs-display);
		line-height: 0.85;
		letter-spacing: -0.02em;
		white-space: nowrap;
	}

	.count small {
		font-size: var(--fs-lg);
		font-weight: var(--fw-bold);
		color: var(--c-ink-2);
		letter-spacing: 0;
	}

	.ruler {
		position: relative;
		height: 1.75rem;
		margin-top: var(--sp-4);
	}

	.track,
	.fill {
		position: absolute;
		left: 0;
		top: 0;
		height: 10px;
		border-radius: 2px;
	}

	.track {
		right: 0;
		border: var(--bw) solid var(--c-line);
		background: repeating-linear-gradient(
			90deg,
			transparent 0 calc(10% - 1px),
			var(--c-rule) calc(10% - 1px) 10%
		);
	}

	.fill {
		background: var(--c-ink);
	}

	.ticks {
		position: absolute;
		left: 0;
		right: 0;
		top: 13px;
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: var(--fs-2xs);
		color: var(--c-ink-2);
	}

	.remaining,
	.year {
		margin-top: var(--sp-1);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.avis {
		display: flex;
		gap: var(--sp-2);
		margin-top: var(--sp-2);
		padding: var(--sp-2) var(--sp-3);
		border: 1.5px solid var(--c-stamp-ink);
		border-radius: var(--r-sm);
		background: var(--c-stamp-soft);
		font-size: var(--fs-sm);
	}

	.avis span {
		font-weight: var(--fw-black);
		color: var(--c-stamp-ink);
	}

	.last {
		margin-top: var(--sp-2);
		padding-top: var(--sp-2);
		border-top: 1px dashed var(--c-rule);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	.skeleton {
		color: transparent;
		background: var(--c-paper-2);
		border-radius: var(--r-sm);
	}

	.skeleton small {
		color: transparent;
	}

	.full-banner {
		margin-top: var(--sp-4);
		padding: var(--sp-3) var(--sp-4);
		border: 2px solid var(--c-stamp-ink);
		border-radius: var(--r-md);
		color: var(--c-stamp-ink);
		font-weight: var(--fw-black);
		text-align: center;
	}

	.empty {
		margin-top: var(--sp-8);
	}

	.sec {
		margin-top: var(--sp-8);
	}

	.sec-h {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: var(--sp-2);
		margin-bottom: var(--sp-3);
		padding-top: var(--sp-2);
		border-top: 1.5px solid var(--c-ink);
	}

	.sec-h h2 {
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}

	.sec-h a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		color: var(--c-stamp-ink);
		text-decoration: none;
	}

	.sec-h a:hover {
		text-decoration: underline;
	}

	.mes a {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
		min-height: var(--tap);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		color: var(--c-stamp-ink);
		text-decoration: none;
	}

	.mes a:hover {
		text-decoration: underline;
	}

	.nota {
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	.llista {
		margin: var(--sp-2) 0 0;
		padding: 0;
		list-style: none;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-3);
		margin-top: var(--sp-5);
	}

	/* Esquelet amb la forma final: pestanyes I–V i 100 caselles. */
	.skeleton-carnet {
		margin-top: var(--sp-8);
	}

	.sk-tabs {
		display: flex;
		gap: var(--sp-2);
		margin-bottom: var(--sp-3);
	}

	.sk-tabs span {
		flex: 1 1 0;
		max-width: 4.5rem;
		height: 3.25rem;
		border-radius: var(--r-sm);
		background: var(--c-paper-2);
	}

	.sk-panel {
		padding: var(--sp-4);
		border: var(--bw) solid var(--c-rule);
		border-radius: var(--r-lg);
	}

	.sk-line {
		display: block;
		width: 40%;
		height: 1.25rem;
		margin-bottom: var(--sp-4);
		border-radius: var(--r-sm);
		background: var(--c-paper-2);
	}

	.sk-grid {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 4px;
	}

	.sk-grid span {
		aspect-ratio: 1 / 1.25;
		border-radius: var(--r-xs);
		background: var(--c-paper-2);
	}

	@media (min-width: 40rem) {
		.sk-grid {
			grid-template-columns: repeat(10, minmax(0, 1fr));
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.sk-grid span,
		.sk-tabs span,
		.sk-line {
			animation: pols 1.4s ease-in-out infinite alternate;
		}
	}

	@keyframes pols {
		to {
			opacity: 0.55;
		}
	}
</style>
