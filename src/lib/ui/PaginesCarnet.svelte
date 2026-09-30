<script lang="ts">
	import type { Carnet, NumeroPagina, Segell as SegellCarnet, SegellFora } from '$lib/domain';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import { cimPerId } from './cim-per-id';
	import {
		CASELLES_PAGINA,
		dataSegellCurta,
		dataSegellLlarga,
		inclinacioSegell,
		inicialsCim
	} from './carnet';
	import { formatDataLlarga, romanPage } from './format';
	import Segell from './Segell.svelte';
	import SegellMini from './SegellMini.svelte';

	/**
	 * Les 5 pàgines del carnet com a pestanyes (patró ARIA tabs: fletxes, Inici i Fi) i la
	 * quadrícula de 100 caselles de la pàgina visible. Només es renderitza la pàgina visible
	 * (100 caselles, no 500). `aria-current="step"` marca la pàgina que s'està omplint.
	 */
	let {
		carnet,
		onobrir
	}: {
		carnet: Carnet;
		/** Tocar un segell (obre el detall). */
		onobrir: (segell: SegellCarnet | SegellFora) => void;
	} = $props();

	const locale = getLocale();
	const uid = $props.id();
	const PAGINES: NumeroPagina[] = [1, 2, 3, 4, 5];

	let triada = $state<NumeroPagina | null>(null);
	const visible = $derived<NumeroPagina>(triada ?? carnet.paginaActual);
	const pagina = $derived(carnet.pagines[visible - 1]);

	const perCasella = $derived(new Map(pagina.segells.map((s) => [s.casella, s])));
	const nSegells = (p: NumeroPagina) => carnet.pagines[p - 1].segells.length;
	const tabs: HTMLButtonElement[] = $state([]);

	function tria(p: NumeroPagina, enfocar = false) {
		triada = p;
		if (enfocar) tabs[p - 1]?.focus();
	}

	function teclat(event: KeyboardEvent, p: NumeroPagina) {
		const seguent: Record<string, number> = {
			ArrowRight: p === 5 ? 1 : p + 1,
			ArrowLeft: p === 1 ? 5 : p - 1,
			Home: 1,
			End: 5
		};
		const nova = seguent[event.key];
		if (nova === undefined) return;
		event.preventDefault();
		tria(nova as NumeroPagina, true);
	}

	function etiqueta(s: SegellCarnet): string {
		const cim = cimPerId(s.cimId)?.nom ?? `#${s.cimId}`;
		return m.carnet_cell_stamp({
			n: String(s.casella),
			cim,
			date: formatDataLlarga(s.data, locale)
		});
	}

	function etiquetaExtra(s: SegellFora): string {
		const cim = cimPerId(s.cimId)?.nom ?? `#${s.cimId}`;
		return `${cim}, ${formatDataLlarga(s.data, locale)}`;
	}
</script>

<div class="carnet">
	<div class="tabs" role="tablist" aria-label={m.carnet_pages_tabs_label()}>
		{#each PAGINES as p (p)}
			{@const sel = p === visible}
			<button
				bind:this={tabs[p - 1]}
				type="button"
				role="tab"
				id="{uid}-tab-{p}"
				class={{
					tab: true,
					sel,
					cur: p === carnet.paginaActual,
					done: carnet.pagines[p - 1].completa
				}}
				aria-selected={sel}
				aria-controls="{uid}-panel"
				aria-current={p === carnet.paginaActual ? 'step' : undefined}
				aria-label={m.carnet_tab_label({ page: romanPage(p), count: String(nSegells(p)) })}
				tabindex={sel ? 0 : -1}
				onclick={() => tria(p)}
				onkeydown={(e) => teclat(e, p)}
			>
				<span class="roman">{romanPage(p)}</span>
				<span class="n mono" aria-hidden="true">{nSegells(p)}</span>
			</button>
		{/each}
	</div>

	<div
		class="panel"
		role="tabpanel"
		id="{uid}-panel"
		aria-labelledby="{uid}-tab-{visible}"
		tabindex="-1"
	>
		<header class="head">
			<div>
				<h3 class="x-wide">{m.carnet_page_heading({ page: romanPage(visible) })}</h3>
				<p class="range mono">
					{m.carnet_page_range({
						from: String((visible - 1) * 100 + 1),
						to: String(visible * 100),
						count: String(pagina.segells.length)
					})}
				</p>
				{#if visible === carnet.paginaActual && !pagina.completa}
					<p class="cur-note">{m.carnet_page_current()}</p>
				{/if}
			</div>
			{#if pagina.completa}
				<div class="complete" role="note">
					<div class="big-stamp">
						<Segell
							top={m.carnet_page_complete_stamp()}
							bottom={pagina.dataCompletada ? dataSegellLlarga(pagina.dataCompletada) : ''}
							center={romanPage(visible)}
							sub={`${visible}×100`}
							size={96}
							rotate={-8}
						/>
					</div>
					<p class="mono">
						{pagina.dataCompletada
							? m.carnet_page_complete({ date: formatDataLlarga(pagina.dataCompletada, locale) })
							: m.carnet_page_done_level({ level: String(visible) })}
					</p>
				</div>
			{/if}
		</header>

		{#key visible}
			<ol class="graella" aria-label={m.carnet_grid_label({ page: romanPage(visible) })}>
				{#each CASELLES_PAGINA as n (n)}
					{@const s = perCasella.get(n)}
					{#if s}
						{@const cim = cimPerId(s.cimId)}
						<li class="casella plena">
							<button
								type="button"
								aria-label={etiqueta(s)}
								data-casella={n}
								onclick={() => onobrir(s)}
							>
								<span class="num mono" aria-hidden="true">{n}</span>
								<span class="segell">
									<SegellMini
										inicials={inicialsCim(cim?.nom ?? '?')}
										essencial={s.essencial}
										espera={!s.comptaPerRepte}
										rotate={inclinacioSegell(s.ordre)}
									/>
								</span>
								<span class="data mono" aria-hidden="true">{dataSegellCurta(s.data)}</span>
							</button>
						</li>
					{:else}
						<li class="casella buida">
							<span class="num mono" aria-hidden="true">{n}</span>
							<span class="sr-only">{m.carnet_cell_empty({ n: String(n) })}</span>
						</li>
					{/if}
				{/each}
			</ol>
		{/key}

		<p class="llegenda">
			<span class="mostra compta" aria-hidden="true"></span>{m.carnet_legend_counts()}
		</p>
	</div>

	{#snippet extres(llista: SegellFora[], espera: boolean)}
		<ul class="extres">
			{#each llista as s (s.ascensioId)}
				{@const cim = cimPerId(s.cimId)}
				<li>
					<button type="button" onclick={() => onobrir(s)} aria-label={etiquetaExtra(s)}>
						<span class="segell">
							<SegellMini
								inicials={inicialsCim(cim?.nom ?? '?')}
								essencial={s.essencial}
								{espera}
								rotate={inclinacioSegell(s.ordre)}
							/>
						</span>
						<span class="text" aria-hidden="true">
							<b>{cim?.nom ?? `#${s.cimId}`}</b>
							<small class="mono">{dataSegellCurta(s.data)}</small>
						</span>
					</button>
				</li>
			{/each}
		</ul>
	{/snippet}

	{#if carnet.enEspera.length > 0}
		<section class="extra espera" aria-labelledby="{uid}-espera">
			<h3 id="{uid}-espera" class="x-wide">
				{m.carnet_waiting_title({ count: String(carnet.enEspera.length) })}
			</h3>
			<p class="explica">
				{m.carnet_waiting_explain()}
				<a href="{href('/repte-100-cims/normativa')}#cims-essencials">{m.carnet_waiting_link()}</a>
			</p>
			{@render extres(carnet.enEspera, true)}
		</section>
	{/if}

	{#if carnet.fora.length > 0}
		<section class="extra" aria-labelledby="{uid}-fora">
			<h3 id="{uid}-fora" class="x-wide">
				{m.carnet_extra_title({ count: String(carnet.fora.length) })}
			</h3>
			<p class="explica">{m.carnet_extra_explain()}</p>
			{@render extres(carnet.fora, false)}
		</section>
	{/if}
</div>

<style>
	.tabs {
		display: flex;
		gap: var(--sp-2);
		margin-bottom: var(--sp-3);
	}

	.tab {
		position: relative;
		display: grid;
		justify-items: center;
		align-content: center;
		gap: 1px;
		flex: 1 1 0;
		min-width: var(--tap);
		max-width: 4.5rem;
		min-height: 3.25rem;
		padding: var(--sp-1) 0;
		background: var(--c-card);
		color: var(--c-ink);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-sm);
		cursor: pointer;
		font: inherit;
	}

	.tab .roman {
		font-family: var(--font-wide);
		font-stretch: var(--stretch-wide);
		font-weight: var(--fw-black);
		font-size: var(--fs-md);
		line-height: 1;
	}

	.tab .n {
		font-size: var(--fs-2xs);
		color: var(--c-ink-2);
	}

	.tab.done {
		background: var(--c-ink);
		color: var(--c-on-ink);
	}

	.tab.done .n {
		color: inherit;
	}

	.tab.cur {
		border-color: var(--c-stamp-ink);
		color: var(--c-stamp-ink);
	}

	.tab.sel {
		box-shadow: var(--sh-2);
		transform: translate(-1px, -1px);
		outline: 2.5px solid var(--c-ink);
		outline-offset: 1px;
	}

	.tab:focus-visible {
		outline: 3px solid var(--c-focus, var(--c-ink));
		outline-offset: 3px;
	}

	.panel {
		padding: var(--sp-4);
		background: var(--c-card);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-lg);
		box-shadow: var(--sh-3);
	}

	.panel:focus {
		outline: none;
	}

	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--sp-3);
		padding-bottom: var(--sp-3);
		margin-bottom: var(--sp-3);
		border-bottom: 1px dashed var(--c-rule);
	}

	.head h3 {
		font-size: var(--fs-md);
		font-weight: var(--fw-black);
	}

	.range {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.cur-note {
		margin-top: 2px;
		font-size: var(--fs-xs);
		color: var(--c-stamp-ink);
		font-weight: var(--fw-semibold);
	}

	.complete {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.complete p {
		max-width: 12rem;
	}

	.big-stamp {
		animation: segellar 520ms var(--ease) both;
	}

	@keyframes segellar {
		0% {
			opacity: 0;
			transform: scale(1.6) rotate(6deg);
		}
		60% {
			opacity: 1;
			transform: scale(0.94);
		}
		100% {
			transform: scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.big-stamp {
			animation: none;
		}
	}

	.graella {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 4px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	@media (min-width: 40rem) {
		.graella {
			grid-template-columns: repeat(10, minmax(0, 1fr));
		}
	}

	.casella {
		position: relative;
		aspect-ratio: 1 / 1.25;
		min-width: 0;
		border: 1px dashed var(--c-rule);
		border-radius: var(--r-xs);
	}

	.num {
		position: absolute;
		top: 2px;
		left: 4px;
		font-size: 0.625rem;
		line-height: 1;
		color: var(--c-ink-2);
	}

	.buida .num {
		opacity: 0.8;
	}

	.plena {
		border-style: solid;
		border-color: var(--c-rule);
	}

	.plena button {
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto;
		grid-template-columns: minmax(0, 1fr);
		justify-items: center;
		align-items: center;
		width: 100%;
		height: 100%;
		min-height: var(--tap);
		padding: 10px 3px 3px;
		background: transparent;
		border: 0;
		border-radius: inherit;
		color: inherit;
		cursor: pointer;
		font: inherit;
	}

	.plena button:hover {
		background: var(--c-paper-2);
	}

	.plena button:focus-visible {
		outline: 3px solid var(--c-focus, var(--c-ink));
		outline-offset: 1px;
	}

	.segell {
		display: block;
		width: min(80%, 3.25rem);
	}

	.data {
		font-size: 0.625rem;
		line-height: 1.1;
		color: var(--c-ink-2);
		white-space: nowrap;
		letter-spacing: -0.04em;
	}

	.llegenda {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		margin-top: var(--sp-4);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.mostra {
		width: 0.875rem;
		height: 0.875rem;
		flex: none;
		border-radius: 50%;
		border: 2.5px solid var(--c-stamp-ink);
	}

	.extra {
		margin-top: var(--sp-5);
		padding: var(--sp-4);
		border: var(--bw) dashed var(--c-line);
		border-radius: var(--r-lg);
	}

	.extra h3 {
		font-size: var(--fs-sm);
		font-weight: var(--fw-black);
		letter-spacing: 0.02em;
	}

	.explica {
		margin-top: var(--sp-2);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
		max-width: 62ch;
	}

	.explica a {
		color: var(--c-ink);
		text-underline-offset: 3px;
	}

	.extres {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
		gap: var(--sp-2);
		margin: var(--sp-3) 0 0;
		padding: 0;
		list-style: none;
	}

	.extres button {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		width: 100%;
		min-height: var(--tap);
		padding: var(--sp-1) var(--sp-2);
		background: var(--c-card);
		border: 1px solid var(--c-rule);
		border-radius: var(--r-sm);
		color: var(--c-ink);
		text-align: start;
		cursor: pointer;
		font: inherit;
	}

	.extres button:hover {
		background: var(--c-paper-2);
	}

	.extres .segell {
		width: 2.25rem;
		flex: none;
	}

	.extres .text {
		display: grid;
		min-width: 0;
		font-size: var(--fs-sm);
		line-height: 1.2;
	}

	.extres b {
		overflow-wrap: anywhere;
	}

	.extres small {
		font-size: var(--fs-2xs);
		color: var(--c-ink-2);
	}
</style>
