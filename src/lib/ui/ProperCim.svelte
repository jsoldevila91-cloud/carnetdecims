<script lang="ts">
	import { CIMS } from '$lib/data/catalog';
	import { origen } from '$lib/data/origen';
	import {
		N_CANDIDATES_METEO,
		N_PROPER_CIM,
		ajustarAmbMeteo,
		avaluarReptes,
		avuiLocal,
		puntuarPendents,
		type Ascensio,
		type CimCataleg,
		type DiaMeteoMinim,
		type NivellDificultat,
		type RecomanacioCim
	} from '$lib/domain';
	import { obtenirMeteo, type FontMeteo } from '$lib/platform/meteo';
	import BottomSheet from './BottomSheet.svelte';
	import Button from './Button.svelte';
	import OrigenMunicipi from './OrigenMunicipi.svelte';
	import { formatAltitude, formatDataLlarga } from './format';
	import { EDAT_ANTIGA_MIN, edatMinuts, formatEdat } from './fitxa/meteo';
	import { capDeSetmanaVinent, textMotiu } from './reptes';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	/**
	 * "El teu proper cim" (bloc R2, docs/08 §6): 3 cims pendents recomanats per al cap de setmana
	 * vinent. Flux: `puntuarPendents` → 6 candidates → `/api/meteo/{slug}` → `ajustarAmbMeteo(…, 3)`.
	 * Sense connexió o si la meteo falla, es mostren les 3 primeres sense meteo. Les dificultats
	 * (de les fitxes) es demanen sota demanda a `/api/dificultats.json`; si no arriben, no puntuen.
	 */
	let { ascensions, carregat }: { ascensions: readonly Ascensio[]; carregat: boolean } = $props();

	const or = origen();
	const avui = avuiLocal();
	const dies = capDeSetmanaVinent(avui);
	const locale = getLocale();

	type EstatMeteoUi = 'carregant' | 'amb' | 'sense';
	let recomanacions = $state<RecomanacioCim<CimCataleg>[]>([]);
	let senseOrigen = $state(false);
	let estatMeteo = $state<EstatMeteoUi>('carregant');
	let font = $state<FontMeteo | null>(null);
	/** La previsió més antiga de les rebudes (pot venir de la còpia del service worker). */
	let actualitzat = $state<string | null>(null);
	let rebuda = $state<Date | null>(null);
	/** S'ha rebut sense connexió: és la còpia desada. */
	let desada = $state(false);

	/** Edat de la previsió: es mostra si és la còpia desada o si és antiga. */
	const edat = $derived.by(() => {
		if (!actualitzat || !rebuda) return null;
		const minuts = edatMinuts(actualitzat, rebuda);
		if (minuts === null) return null;
		const antiga = minuts > EDAT_ANTIGA_MIN;
		if (!desada && !antiga) return null;
		return { text: m.cim_weather_updated({ fa: formatEdat(minuts, locale) }), antiga };
	});
	let calculat = $state(false);
	let fullOrigen = $state(false);

	let dificultatsPromesa: Promise<ReadonlyMap<number, NivellDificultat>> | null = null;

	function carregarDificultats(): Promise<ReadonlyMap<number, NivellDificultat>> {
		dificultatsPromesa ??= fetch('/api/dificultats.json')
			.then((r): Promise<Record<string, NivellDificultat>> =>
				r.ok ? r.json() : Promise.resolve({})
			)
			.then((obj) => {
				const perSlug = new Map(Object.entries(obj));
				// eslint-disable-next-line svelte/prefer-svelte-reactivity -- mapa local, no reactiu
				const mapa = new Map<number, NivellDificultat>();
				for (const c of CIMS) {
					const n = perSlug.get(c.slug);
					if (n !== undefined) mapa.set(c.id, n);
				}
				return mapa;
			})
			.catch(() => {
				dificultatsPromesa = null; // es tornarà a provar la propera vegada
				return new Map<number, NivellDificultat>();
			});
		return dificultatsPromesa;
	}

	$effect(() => {
		if (!carregat || !$or.carregat) return;
		const llista = ascensions;
		const municipi = $or.municipi;
		const control = new AbortController();
		void calcular(
			llista,
			municipi ? { lat: municipi.lat, lon: municipi.lon } : null,
			control.signal
		);
		return () => control.abort();
	});

	async function calcular(
		llista: readonly Ascensio[],
		punt: { lat: number; lon: number } | null,
		signal: AbortSignal
	) {
		const dificultats = await carregarDificultats();
		if (signal.aborted) return;
		const reptes = avaluarReptes(llista, CIMS, { avui });
		const r = puntuarPendents({
			ascensions: llista,
			cataleg: CIMS,
			avui,
			origen: punt,
			dificultats,
			reptes,
			diesSortida: dies
		});
		const candidates = r.candidates.slice(0, N_CANDIDATES_METEO);
		senseOrigen = r.senseOrigen;
		recomanacions = candidates.slice(0, N_PROPER_CIM);
		calculat = true;
		if (candidates.length === 0) return;
		// Sense connexió també es demana: el service worker torna l'última previsió desada.
		estatMeteo = 'carregant';
		const respostes = await Promise.allSettled(
			candidates.map((c) => obtenirMeteo(c.cim.slug, { signal }))
		);
		if (signal.aborted) return;
		// eslint-disable-next-line svelte/prefer-svelte-reactivity -- mapa local, no reactiu
		const meteo = new Map<number, readonly DiaMeteoMinim[]>();
		let mesAntiga: string | null = null;
		respostes.forEach((res, i) => {
			if (res.status === 'fulfilled') {
				meteo.set(candidates[i].cim.id, res.value.dies);
				font ??= res.value.font;
				if (mesAntiga === null || res.value.actualitzat < mesAntiga)
					mesAntiga = res.value.actualitzat;
			}
		});
		desada = typeof navigator !== 'undefined' && !navigator.onLine;
		actualitzat = mesAntiga;
		rebuda = new Date();
		if (meteo.size === 0) {
			estatMeteo = 'sense';
			return;
		}
		recomanacions = ajustarAmbMeteo(candidates, meteo, dies, N_PROPER_CIM);
		estatMeteo = 'amb';
	}

	const finde = $derived(
		dies.length === 1
			? m.proper_cim_day({ date: formatDataLlarga(dies[0], locale) })
			: m.proper_cim_weekend({
					from: formatDataLlarga(dies[0], locale),
					to: formatDataLlarga(dies[1], locale)
				})
	);
	const ambMeteo = (r: RecomanacioCim) => r.motius.some((mt) => mt.clau.startsWith('meteo-'));
</script>

<section class="proper" aria-labelledby="proper-t" data-testid="proper-cim">
	<div class="cap">
		<h2 id="proper-t" class="x-wide">{m.proper_cim_title()}</h2>
		<p class="finde mono">{finde}</p>
	</div>

	{#if calculat && senseOrigen}
		<div class="avis" role="note">
			<p>{m.proper_cim_no_origin()}</p>
			<Button variant="outline" size="sm" icon="locate" onclick={() => (fullOrigen = true)}>
				{m.stats_far_choose()}
			</Button>
		</div>
	{/if}

	{#if !calculat}
		<p class="nota mono" role="status">{m.proper_cim_loading()}</p>
	{:else if recomanacions.length === 0}
		<p class="nota">{m.proper_cim_none()}</p>
	{:else}
		<ol class="llista">
			{#each recomanacions as r (r.cim.id)}
				<li class="cim">
					<p class="nom">
						<a href={href(`/cims/${r.cim.slug}`)}>{r.cim.nom}</a>
						<span class="alt mono">{formatAltitude(r.cim.altitud)} m</span>
					</p>
					<ul class="motius">
						{#each r.motius
							.filter((mt) => mt.punts !== 0 || mt.clau === 'meteo-variable' || mt.clau === 'pendent')
							.slice(0, 3) as mt (mt.clau)}
							<li class={mt.punts < 0 ? 'contra' : 'favor'}>
								<span aria-hidden="true">{mt.punts < 0 ? '−' : '+'}</span>
								{textMotiu(mt)}
							</li>
						{/each}
					</ul>
					{#if estatMeteo === 'amb' && !ambMeteo(r)}
						<p class="sense-meteo mono">{m.proper_cim_no_forecast_peak()}</p>
					{/if}
				</li>
			{/each}
		</ol>
		<p class="peu mono" aria-live="polite">
			{#if estatMeteo === 'carregant'}
				{m.proper_cim_meteo_loading()}
			{:else if estatMeteo === 'sense'}
				{m.proper_cim_meteo_unavailable()}
			{:else if font}
				{m.proper_cim_meteo_source()}
				<a href={font.url} rel="noopener" target="_blank">{font.nom}</a>
				(<a href={font.llicenciaUrl} rel="noopener license" target="_blank">{font.llicencia}</a>)
			{/if}
		</p>
		{#if estatMeteo === 'amb' && edat && actualitzat}
			<p class="edat mono" role="note" data-testid="proper-cim-meteo-edat">
				{desada ? m.cim_weather_saved() : ''}
				<time datetime={actualitzat}>{edat.text}</time>.
				{edat.antiga ? m.cim_weather_old() : ''}
			</p>
		{/if}
		<p class="nota">{m.proper_cim_disclaimer()}</p>
	{/if}
</section>

<BottomSheet open={fullOrigen} title={m.origin_title()} onclose={() => (fullOrigen = false)}>
	<OrigenMunicipi cercaInicial onfet={() => (fullOrigen = false)} />
</BottomSheet>

<style>
	.proper {
		margin-top: var(--sp-8);
		padding: var(--sp-4);
		border: 2px solid var(--c-ink);
		border-radius: var(--r-md);
		background: var(--c-card);
		box-shadow: var(--sh-2);
	}

	.cap {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--sp-1) var(--sp-3);
		padding-bottom: var(--sp-2);
		border-bottom: 1px dashed var(--c-rule);
	}

	h2 {
		font-size: var(--fs-lg);
		font-weight: var(--fw-black);
	}

	.finde {
		font-size: var(--fs-xs);
		color: var(--c-stamp-ink);
	}

	.avis {
		display: grid;
		justify-items: start;
		gap: var(--sp-2);
		margin-top: var(--sp-3);
		padding: var(--sp-2) var(--sp-3);
		border: 1.5px solid var(--c-stamp-ink);
		border-radius: var(--r-sm);
		background: var(--c-stamp-soft);
		font-size: var(--fs-sm);
	}

	.nota {
		margin-top: var(--sp-3);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.llista {
		display: grid;
		gap: var(--sp-3);
		margin: var(--sp-3) 0 0;
		padding: 0 0 0 var(--sp-5);
	}

	.llista > li::marker {
		font-family: var(--font-mono);
		font-weight: var(--fw-bold);
		color: var(--c-ink-2);
	}

	.cim {
		padding-bottom: var(--sp-3);
		border-bottom: 1px dashed var(--c-rule);
		min-width: 0;
	}

	.nom {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 var(--sp-2);
	}

	.nom a {
		font-stretch: var(--stretch-semi);
		font-weight: var(--fw-heavy);
		font-size: var(--fs-md);
		color: var(--c-ink);
		overflow-wrap: anywhere;
	}

	.alt {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.motius {
		display: grid;
		gap: 2px;
		margin: var(--sp-1) 0 0;
		padding: 0;
		list-style: none;
		font-size: var(--fs-sm);
	}

	.motius span {
		display: inline-block;
		width: 1ch;
		font-family: var(--font-mono);
		font-weight: var(--fw-bold);
	}

	.favor span {
		color: var(--c-pine);
	}

	.contra {
		color: var(--c-ink-2);
	}

	.contra span {
		color: var(--c-stamp-ink);
	}

	.sense-meteo,
	.edat,
	.peu {
		margin-top: var(--sp-1);
		font-size: var(--fs-2xs);
		color: var(--c-ink-2);
	}

	.peu {
		margin-top: var(--sp-3);
	}

	.peu a {
		color: inherit;
	}
</style>
