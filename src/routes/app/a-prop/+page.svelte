<script lang="ts">
	import { ascensionsVivesAmbEstat } from '$lib/data/ascensions';
	import { CIMS, comarcaPerSlug } from '$lib/data/catalog';
	import { avuiLocal, cimsAProp, estatCims, type Punt, type Rumb } from '$lib/domain';
	import { Button, PageMeta, formatAltitude, formatKm } from '$lib/ui';
	import MarcaCim from '$lib/ui/MarcaCim.svelte';
	import { obrirRegistre, registrarHref } from '$lib/ui/fulls';
	import { demanarPosicio, type ErrorPosicio } from '$lib/platform/geolocalitzacio';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	/** Quants cims es mostren (els més propers). */
	const N = 15;

	const locale = getLocale();
	const vives = ascensionsVivesAmbEstat();
	const avui = avuiLocal();
	const estat = $derived(estatCims($vives.ascensions, CIMS, avui));

	/** Posició: només es demana en prémer el botó, mai en carregar la pàgina. */
	let posicio = $state<Punt | null>(null);
	let buscant = $state(false);
	let error = $state<ErrorPosicio | null>(null);
	let nomesPendents = $state(false);

	const propers = $derived(posicio ? cimsAProp(posicio, CIMS, estat, { n: N, nomesPendents }) : []);

	const ERRORS: Record<ErrorPosicio, () => string> = {
		denegada: m.geo_error_denied,
		'no-disponible': m.ess_error_unavailable,
		temps: m.ess_error_timeout,
		'no-suportada': m.ess_error_unsupported
	};

	const DIRECCIONS: Record<Rumb, () => string> = {
		N: m.dir_N,
		NE: m.dir_NE,
		E: m.dir_E,
		SE: m.dir_SE,
		S: m.dir_S,
		SO: m.dir_SO,
		O: m.dir_O,
		NO: m.dir_NO
	};

	async function localitzar() {
		if (buscant) return;
		buscant = true;
		error = null;
		const r = await demanarPosicio();
		buscant = false;
		if (r.ok) posicio = r.punt;
		else error = r.error;
	}

	const mapaHref = (slug: string) => `${href('/mapa')}?cim=${slug}`;
</script>

<PageMeta title={m.near_meta_title()} noindex />

<p class="crumb mono"><a href={href('/app')}>← {m.app_title()}</a></p>
<h1 class="x-wide title">{m.near_title()}</h1>
<p class="lede">{m.near_lede()}</p>

<div class="accions">
	<!-- Un sol botó (el focus no es perd en canviar de text); ocupat, `aria-disabled`. -->
	<Button
		variant={posicio ? 'outline' : 'ink'}
		icon="locate"
		aria-disabled={buscant}
		onclick={localitzar}
	>
		{posicio ? m.near_refresh() : m.near_find()}
	</Button>
	<p class="hint">{m.near_privacy()}</p>
</div>

<label class="check">
	<input type="checkbox" bind:checked={nomesPendents} />
	{m.near_only_pending()}
</label>

<p class="estat mono" role="status">
	{#if buscant}
		{m.ess_locating()}
	{:else if posicio && $vives.carregat && propers.length > 0}
		{nomesPendents
			? m.near_results_pending({ count: String(propers.length) })
			: m.near_results({ count: String(propers.length) })}
	{:else if posicio && $vives.carregat}
		{m.near_empty()}
	{/if}
</p>
{#if error}
	<p class="error" role="alert">{ERRORS[error]()}</p>
{/if}

{#if posicio && propers.length > 0}
	<ol class="llista" aria-label={m.near_list_label()}>
		{#each propers as { cim, distanciaKm, rumb, azimut, estat: e } (cim.id)}
			{@const fet = e === 'fet'}
			{@const km = formatKm(distanciaKm, locale)}
			<li class="fila">
				<MarcaCim essencial={cim.essencial} {fet} size={22} />
				<div class="cos">
					<a class="nom" href={href(`/cims/${cim.slug}`)}>{cim.nom}</a>
					<small class="mono">
						{m.ess_peak_meta({
							alt: formatAltitude(cim.altitud),
							comarca: comarcaPerSlug(cim.comarca)?.nom ?? cim.comarca
						})}
						{#if cim.essencial}· {m.cim_essential()}{/if}
						· <span class={{ fet }}>{fet ? m.near_done() : m.near_pending()}</span>
					</small>
				</div>
				<p class="dist mono">
					<span aria-hidden="true">
						<span class="km">{m.ess_distance({ km })}</span>
						<span class="rumb">
							<svg
								class="fletxa"
								viewBox="0 0 16 16"
								width="14"
								height="14"
								style:transform="rotate({Math.round(azimut)}deg)"
							>
								<path d="M8 1.5 12.5 13 8 10.4 3.5 13z" />
							</svg>
							{rumb}
						</span>
					</span>
					<span class="sr-only">
						{m.ess_distance_label({ km })}, {m.near_direction({ dir: DIRECCIONS[rumb]() })}
					</span>
				</p>
				<div class="enllacos">
					<a class="mini" href={mapaHref(cim.slug)} rel="nofollow">
						<span aria-hidden="true">{m.near_see_map()}</span>
						<span class="sr-only">{m.near_see_map_label({ cim: cim.nom })}</span>
					</a>
					<a
						class="mini reg"
						href={registrarHref(cim.slug)}
						rel="nofollow"
						onclick={(ev) => obrirRegistre(ev, cim.slug)}
					>
						<span aria-hidden="true">{m.ess_register()}</span>
						<span class="sr-only">{m.ess_register_label({ cim: cim.nom })}</span>
					</a>
				</div>
			</li>
		{/each}
	</ol>
	<p class="nota">{m.near_straight_line()}</p>
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

	.lede {
		color: var(--c-ink-2);
		max-width: 50ch;
	}

	.accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--sp-3);
		margin-top: var(--sp-4);
	}

	.hint {
		flex: 1 1 14rem;
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.check {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
		min-height: var(--tap);
		margin-top: var(--sp-2);
		cursor: pointer;
	}

	.check input {
		width: 1.25rem;
		height: 1.25rem;
		margin: 0;
		accent-color: var(--c-ink);
	}

	.estat {
		min-height: 1.5em;
		margin-top: var(--sp-2);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.error {
		margin-top: var(--sp-2);
		padding: var(--sp-2) var(--sp-3);
		border: 1.5px solid var(--c-stamp-ink);
		border-radius: var(--r-sm);
		background: var(--c-stamp-soft);
		font-size: var(--fs-sm);
	}

	.llista {
		margin: var(--sp-3) 0 0;
		padding: 0;
		list-style: none;
	}

	.fila {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--sp-1) var(--sp-3);
		padding: var(--sp-3) 0;
		border-bottom: 1px dashed var(--c-rule);
	}

	.cos {
		display: grid;
		min-width: 0;
	}

	.nom {
		font-weight: var(--fw-bold);
		color: var(--c-ink);
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
		overflow-wrap: anywhere;
	}

	small {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	small .fet {
		color: var(--c-ink);
		font-weight: var(--fw-semibold);
	}

	.dist {
		justify-self: end;
		text-align: right;
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		white-space: nowrap;
	}

	.dist > span[aria-hidden] {
		display: grid;
		justify-items: end;
	}

	.rumb {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: var(--fs-xs);
		font-weight: var(--fw-medium);
		color: var(--c-ink-2);
	}

	.fletxa {
		fill: var(--c-blue);
	}

	.enllacos {
		grid-column: 2 / -1;
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
	}

	.mini {
		display: inline-grid;
		place-items: center;
		min-height: var(--tap);
		min-width: var(--tap);
		padding: 0 var(--sp-3);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		color: var(--c-ink);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		text-decoration: none;
	}

	.mini.reg {
		border-color: var(--c-stamp-ink);
		color: var(--c-stamp-ink);
	}

	.nota {
		margin: var(--sp-3) 0 var(--sp-8);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	@media (prefers-reduced-motion: no-preference) {
		.fletxa {
			transition: transform var(--dur) var(--ease);
		}
	}
</style>
