<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { afterNavigate, pushState, replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { BottomSheet, Icon, LlistaCims, PageMeta } from '$lib/ui';
	import MarcaCim from '$lib/ui/MarcaCim.svelte';
	import FiltresMapa from '$lib/ui/mapa/FiltresMapa.svelte';
	import FitxaCimMapa from '$lib/ui/mapa/FitxaCimMapa.svelte';
	import { ZOOM_JO, limitsDeBbox } from '$lib/ui/mapa/vista';
	import type { MotorMapa } from '$lib/ui/mapa/motor';
	import { esClicSimple, registrarHref } from '$lib/ui/fulls';
	import {
		CIMS,
		cimPerSlug,
		comarcaPerSlug,
		filtrarCims,
		filtresAQuery,
		filtresDesDeQuery,
		geojsonCims,
		type FiltresMapa as Filtres
	} from '$lib/data/catalog';
	import {
		ascensionsValides,
		avuiLocal,
		estatCims,
		primeresAscensions,
		type CimCataleg,
		type DataISO,
		type EstatsCims,
		type Punt
	} from '$lib/domain';
	import { mapaEstaticComarca, type MapaEstaticComarca } from '$lib/platform/mapa-estatic';
	import { demanarPosicio, type ErrorPosicio } from '$lib/platform/geolocalitzacio';
	import { prefersReducedMotion } from '$lib/platform/motion';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import { PAGINES_NOINDEX } from '$lib/seo/indexabilitat';

	// ---------- Imatge estàtica (LCP i contingut sense JS) ----------
	// Dues proporcions (mòbil 4:5, escriptori 16:10) amb la mateixa BBOX que farà servir MapLibre:
	// en carregar-se, el mapa interactiu s'obre exactament sobre l'extensió de la imatge.
	const MOBIL = { ample: 640, alt: 800 } as const;
	const ESCRIPTORI = { ample: 1280, alt: 800 } as const;
	const estaticMobil = mapaEstaticComarca(CIMS, { ...MOBIL, format: 'jpeg' })!;
	const estaticEscriptori = mapaEstaticComarca(CIMS, { ...ESCRIPTORI, format: 'jpeg' })!;
	const ESSENCIAL = new Map(CIMS.map((c) => [c.slug, c.essencial]));

	// Llista (vista alternativa): per ordre alfabètic.
	const collator = new Intl.Collator('ca');
	const ORDENATS = [...CIMS].sort((a, b) => collator.compare(a.nom, b.nom));

	// ---------- Estat ----------
	type Vista = 'mapa' | 'llista';
	type EstatMapa = 'inactiu' | 'carregant' | 'actiu' | 'error';

	let filtres = $state<Filtres>({});
	let vista = $state<Vista>('mapa');
	let llest = $state(false);
	let noTrobat = $state(false);

	/** Estat de l'usuari (IndexedDB, carregat en diferit): buit = tot pendent. */
	let estat = $state.raw<EstatsCims>(new Map());
	let primeres = $state.raw<ReadonlyMap<number, DataISO>>(new Map());
	let avui = $state<DataISO | null>(null);

	let estatMapa = $state<EstatMapa>('inactiu');
	let motor = $state.raw<MotorMapa | null>(null);
	let marc: HTMLElement | undefined = $state();
	let contenidor: HTMLDivElement | undefined = $state();
	/** Cim on s'ha d'obrir el mapa (enllaç `?cim=`), si encara no s'ha creat. */
	let centreInicial: Punt | null = null;

	let buscant = $state(false);
	let errorGeo = $state<ErrorPosicio | null>(null);
	let avisGeo = $state('');
	let potPantallaCompleta = $state(false);
	let pantallaCompleta = $state(false);

	const visibles = $derived(filtrarCims(CIMS, filtres, estat));
	const amagats: ReadonlySet<string> = $derived.by(() => {
		const si = new Set(visibles.map((c) => c.slug));
		return new Set(CIMS.filter((c) => !si.has(c.slug)).map((c) => c.slug));
	});
	const nFets = $derived(visibles.filter((c) => estat.get(c.id) === 'fet').length);
	const dades = $derived(geojsonCims(CIMS, estat, filtres));
	const seleccionat = $derived(page.state.sheet === 'cim' ? (page.state.cim ?? null) : null);
	const cimObert = $derived(seleccionat ? cimPerSlug(seleccionat) : undefined);

	const ERRORS_GEO: Record<ErrorPosicio, () => string> = {
		denegada: m.geo_error_denied,
		'no-disponible': m.ess_error_unavailable,
		temps: m.ess_error_timeout,
		'no-suportada': m.ess_error_unsupported
	};

	// ---------- URL (query no indexable: el canonical és la URL base) ----------
	function urlMapa(f: Filtres, v: Vista, cim?: string | null): string {
		const qs = [
			filtresAQuery(f),
			v === 'llista' ? 'vista=llista' : '',
			cim ? `cim=${encodeURIComponent(cim)}` : ''
		]
			.filter(Boolean)
			.join('&');
		return href('/mapa') + (qs ? `?${qs}` : '');
	}

	// A cada navegació cap a la pàgina: filtres i vista des de la query. `?cim=slug` obre el full
	// del cim amb una entrada d'historial pròpia (enrere el tanca i deixa el mapa).
	afterNavigate((nav) => {
		const params = nav.to?.url.searchParams ?? new URLSearchParams(location.search);
		filtres = filtresDesDeQuery(params);
		vista = params.get('vista') === 'llista' ? 'llista' : 'mapa';
		const slug = params.get('cim');
		noTrobat = false;
		// El router encara no és a punt a la primera càrrega (vegeu `/cims`).
		queueMicrotask(() => {
			llest = true;
			if (!slug || page.state.sheet === 'cim') return;
			const cim = cimPerSlug(slug);
			replaceState(urlMapa(filtres, vista), {});
			if (!cim) {
				noTrobat = true;
				return;
			}
			vista = 'mapa';
			if (cim.lat !== null && cim.lon !== null) {
				centreInicial = { lat: cim.lat, lon: cim.lon };
				void activarMapa();
			}
			pushState(urlMapa(filtres, vista, slug), { sheet: 'cim', cim: slug });
		});
	});

	// La query segueix els filtres i la vista (compartir, enrere/endavant), sense entrades noves.
	$effect(() => {
		// Amb un altre full obert (registre), l'URL és la d'aquell full.
		if (!llest || (page.state.sheet && page.state.sheet !== 'cim')) return;
		const url = urlMapa(filtres, vista, seleccionat);
		if (url === location.pathname + location.search) return;
		replaceState(url, page.state);
	});

	// ---------- Mapa interactiu (import diferit) ----------
	const temaActual = () =>
		matchMedia('(prefers-color-scheme: dark)').matches ? ('fosc' as const) : ('clar' as const);

	async function activarMapa() {
		if (estatMapa === 'carregant' || estatMapa === 'actiu' || !contenidor) return;
		estatMapa = 'carregant';
		try {
			const { crearMotor } = await import('$lib/ui/mapa/motor');
			const escriptori = matchMedia('(min-width: 48rem)').matches;
			const estatic: MapaEstaticComarca = escriptori ? estaticEscriptori : estaticMobil;
			motor = await crearMotor({
				contenidor,
				tema: temaActual(),
				limits: limitsDeBbox(estatic.bbox),
				centre: centreInicial,
				dades,
				seleccionat,
				movimentReduit: prefersReducedMotion(),
				textos: { regio: m.map_region_label() },
				onseleccio: obrirCim
			});
			estatMapa = 'actiu';
		} catch (error) {
			console.warn('[mapa]', error);
			estatMapa = 'error';
		}
	}

	$effect(() => {
		motor?.setDades(dades);
	});

	$effect(() => {
		if (!motor) return;
		motor.setSeleccionat(seleccionat);
		if (cimObert && cimObert.lat !== null && cimObert.lon !== null)
			motor.centrar({ lat: cimObert.lat, lon: cimObert.lon });
	});

	function obrirCim(slug: string) {
		if (page.state.sheet === 'cim')
			replaceState(urlMapa(filtres, vista, slug), { sheet: 'cim', cim: slug });
		else pushState(urlMapa(filtres, vista, slug), { sheet: 'cim', cim: slug });
	}

	function tancarCim() {
		history.back();
	}

	/** "Registrar" des del full: el full de registre (layout) substitueix el del cim. */
	function registrar(event: MouseEvent) {
		if (!esClicSimple(event) || !seleccionat) return;
		event.preventDefault();
		replaceState(registrarHref(seleccionat), { sheet: 'registrar', cim: seleccionat });
	}

	async function canviaVista(v: Vista) {
		vista = v;
		if (v === 'mapa') {
			await tick();
			if (estatMapa === 'inactiu' && !estalviDades()) void activarMapa();
			else motor?.redimensionar();
		}
	}

	async function laMevaUbicacio() {
		if (buscant) return;
		buscant = true;
		errorGeo = null;
		avisGeo = '';
		const r = await demanarPosicio();
		buscant = false;
		if (!r.ok) {
			errorGeo = r.error;
			return;
		}
		motor?.setPosicioUsuari(r.punt);
		motor?.centrar(r.punt, { zoom: ZOOM_JO });
		avisGeo = m.map_located();
	}

	async function commutaPantallaCompleta() {
		try {
			if (document.fullscreenElement) await document.exitFullscreen();
			else await marc?.requestFullscreen();
		} catch {
			// Denegat pel navegador: el mapa continua dins de la pàgina.
		}
	}

	const estalviDades = () =>
		(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ===
		true;

	onMount(() => {
		potPantallaCompleta = document.fullscreenEnabled === true;
		const neteja: (() => void)[] = [];

		// Estat de l'usuari (Dexie en un chunk diferit; no pesa a la càrrega inicial).
		let viu = true;
		void import('$lib/data/ascensions').then(({ ascensionsVivesAmbEstat }) => {
			if (!viu) return;
			const dia = avuiLocal();
			avui = dia;
			neteja.push(
				ascensionsVivesAmbEstat().subscribe(({ ascensions }) => {
					estat = estatCims(ascensions, CIMS, dia);
					primeres = primeresAscensions(ascensionsValides(ascensions, CIMS, dia));
				})
			);
		});

		// El mapa es carrega quan el marc és a la pantalla i el navegador està ociós (la imatge
		// estàtica ja és el LCP), o de seguida si l'usuari hi interactua. Amb "estalvi de dades",
		// només amb el botó.
		if (marc && !estalviDades()) {
			const obs = new IntersectionObserver((entrades) => {
				if (!entrades.some((e) => e.isIntersecting) || vista !== 'mapa') return;
				obs.disconnect();
				if ('requestIdleCallback' in window)
					requestIdleCallback(() => void activarMapa(), { timeout: 1500 });
				else setTimeout(() => void activarMapa(), 300);
			});
			obs.observe(marc);
			neteja.push(() => obs.disconnect());
		}
		// Tocar la imatge fixa també carrega el mapa (també amb "estalvi de dades").
		const enTocar = () => {
			if (estatMapa === 'inactiu') void activarMapa();
		};
		marc?.addEventListener('pointerdown', enTocar);
		neteja.push(() => marc?.removeEventListener('pointerdown', enTocar));

		const esquema = matchMedia('(prefers-color-scheme: dark)');
		const canviEsquema = () => motor?.setTema(temaActual());
		esquema.addEventListener('change', canviEsquema);
		const moviment = matchMedia('(prefers-reduced-motion: reduce)');
		const canviMoviment = () => motor?.setMovimentReduit(moviment.matches);
		moviment.addEventListener('change', canviMoviment);
		const canviFs = () => {
			pantallaCompleta = !!marc && document.fullscreenElement === marc;
			motor?.redimensionar();
		};
		document.addEventListener('fullscreenchange', canviFs);

		return () => {
			viu = false;
			esquema.removeEventListener('change', canviEsquema);
			moviment.removeEventListener('change', canviMoviment);
			document.removeEventListener('fullscreenchange', canviFs);
			for (const f of neteja) f();
			motor?.destruir();
			motor = null;
		};
	});

	const metaLlista = (cim: CimCataleg) =>
		[comarcaPerSlug(cim.comarca)?.nom, estat.get(cim.id) === 'fet' ? m.map_legend_done() : null]
			.filter(Boolean)
			.join(' · ');
</script>

<PageMeta
	title={m.map_meta_title()}
	description={m.map_meta_description()}
	noindex={PAGINES_NOINDEX.has('/mapa')}
/>

<svelte:head>
	<!-- Sense JS: el mapa és una imatge i la llista és visible; els controls s'amaguen. -->
	<noscript
		><style>
			.barra,
			.filtres-w,
			.resultat,
			.capa {
				display: none !important;
			}
			.vista-llista[hidden] {
				display: block !important;
			}
		</style></noscript
	>
</svelte:head>

<header class="page-head">
	<h1 class="x-wide">{m.map_title()}</h1>
	<p class="lede">{m.map_lede()}</p>
</header>

<noscript><p class="noscript">{m.map_noscript()}</p></noscript>

<div class="barra">
	<div class="commutador" role="group" aria-label={m.map_view_label()}>
		<button type="button" aria-pressed={vista === 'mapa'} onclick={() => canviaVista('mapa')}>
			<Icon name="map" size={18} />{m.map_view_map()}
		</button>
		<button type="button" aria-pressed={vista === 'llista'} onclick={() => canviaVista('llista')}>
			<Icon name="list" size={18} />{m.map_view_list()}
		</button>
	</div>
	<a class="aprop" href={href('/app/a-prop')}>
		<Icon name="locate" size={18} />{m.map_nearby()}
	</a>
</div>

<div class="filtres-w">
	<FiltresMapa {filtres} onchange={(f) => (filtres = f)} />
</div>

<p class="resultat mono" role="status">
	{visibles.length === 1
		? m.map_count_one({ total: String(CIMS.length) })
		: m.map_count({ count: String(visibles.length), total: String(CIMS.length) })}
	{#if nFets > 0}· {m.map_count_done({ done: String(nFets) })}{/if}
</p>
{#if noTrobat}
	<p class="avis" role="alert">{m.map_not_found()}</p>
{/if}

<figure class="vista-mapa" hidden={vista !== 'mapa'}>
	<div class={['marc', { actiu: estatMapa === 'actiu', fs: pantallaCompleta }]} bind:this={marc}>
		<div class="estatic">
			<picture>
				<source
					media="(min-width: 48rem)"
					srcset={estaticEscriptori.url}
					width={ESCRIPTORI.ample}
					height={ESCRIPTORI.alt}
				/>
				<img
					src={estaticMobil.url}
					width={MOBIL.ample}
					height={MOBIL.alt}
					alt={m.map_static_alt({ count: String(CIMS.length) })}
					fetchpriority="high"
					decoding="async"
				/>
			</picture>
			{#each [{ e: estaticMobil, mida: MOBIL, cls: 'mobil' }, { e: estaticEscriptori, mida: ESCRIPTORI, cls: 'escriptori' }] as v (v.cls)}
				<svg
					class={['punts', v.cls]}
					viewBox="0 0 {v.mida.ample} {v.mida.alt}"
					preserveAspectRatio="xMidYMid slice"
					aria-hidden="true"
				>
					{#each v.e.punts as p (p.slug)}
						{@const x = (p.xPct / 100) * v.mida.ample}
						{@const y = (p.yPct / 100) * v.mida.alt}
						{#if ESSENCIAL.get(p.slug)}
							<path class="ess" d="M{x} {y - 9}l9 9-9 9-9-9z" />
						{:else}
							<circle class="cim" cx={x} cy={y} r="6.5" />
						{/if}
					{/each}
				</svg>
			{/each}
		</div>

		<div class="viu" bind:this={contenidor}></div>

		{#if estatMapa === 'actiu'}
			<div class="controls" role="group" aria-label={m.map_controls_label()}>
				<button type="button" class="ctl" title={m.map_zoom_in()} onclick={() => motor?.zoom(1)}>
					<Icon name="plus" /><span class="sr-only">{m.map_zoom_in()}</span>
				</button>
				<button type="button" class="ctl" title={m.map_zoom_out()} onclick={() => motor?.zoom(-1)}>
					<Icon name="minus" /><span class="sr-only">{m.map_zoom_out()}</span>
				</button>
				<button
					type="button"
					class="ctl"
					title={m.map_locate()}
					aria-disabled={buscant}
					onclick={laMevaUbicacio}
				>
					<Icon name="locate" /><span class="sr-only">{m.map_locate()}</span>
				</button>
				{#if potPantallaCompleta}
					<button
						type="button"
						class="ctl"
						title={pantallaCompleta ? m.map_fullscreen_exit() : m.map_fullscreen_enter()}
						aria-pressed={pantallaCompleta}
						onclick={commutaPantallaCompleta}
					>
						<Icon name={pantallaCompleta ? 'shrink' : 'expand'} />
						<span class="sr-only">{m.map_fullscreen_enter()}</span>
					</button>
				{/if}
			</div>
		{:else}
			<div class="capa">
				{#if estatMapa === 'carregant'}
					<p class="pastilla mono" role="status">{m.map_loading()}</p>
				{:else}
					{#if estatMapa === 'error'}
						<p class="pastilla error" role="alert">{m.map_load_error()}</p>
					{/if}
					<button type="button" class="activa" onclick={activarMapa}>
						<Icon name="map" />
						{estatMapa === 'error' ? m.map_load_retry() : m.map_activate()}
					</button>
				{/if}
			</div>
		{/if}
	</div>

	<figcaption>
		<ul class="llegenda mono" aria-label={m.map_legend_label()}>
			<li><MarcaCim essencial={false} fet size={16} />{m.map_legend_done()}</li>
			<li><MarcaCim essencial={false} fet={false} size={16} />{m.map_legend_pending()}</li>
			<li class="ess"><MarcaCim essencial fet={false} size={16} />{m.map_legend_essential()}</li>
		</ul>
		<p class="atribucio mono" class:amagada={estatMapa === 'actiu'}>
			<a href={estaticMobil.llicenciaUrl} rel="external noopener license" target="_blank">
				{m.map_attribution_static()}<span class="sr-only"> {m.external_new_tab()}</span>
			</a>
		</p>
	</figcaption>
</figure>
<div class="geo-w" hidden={vista !== 'mapa'}>
	<p class="geo mono" role="status">{buscant ? m.ess_locating() : avisGeo}</p>
	{#if errorGeo}
		<p class="avis" role="alert">{ERRORS_GEO[errorGeo]()}</p>
	{/if}
</div>

<section class="vista-llista" aria-labelledby="llista-t" hidden={vista !== 'llista'}>
	<h2 id="llista-t" class="x-wide">{m.map_list_title()}</h2>
	<p class="hint">{m.map_list_hint()}</p>
	{#if visibles.length === 0}
		<div class="buit">
			<p class="buit-titol">{m.filters_empty_title()}</p>
			<p>{m.filters_empty_text()}</p>
		</div>
	{/if}
	<LlistaCims cims={ORDENATS} {amagats} meta={metaLlista} />
</section>

<BottomSheet open={page.state.sheet === 'cim'} title={cimObert?.nom ?? ''} onclose={tancarCim}>
	{#if cimObert}
		<FitxaCimMapa
			cim={cimObert}
			fetEl={primeres.get(cimObert.id) ?? null}
			{avui}
			onregistrar={registrar}
		/>
	{/if}
</BottomSheet>

<style>
	.page-head {
		margin-bottom: var(--sp-4);
	}

	h1 {
		font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1;
	}

	.lede {
		margin-top: var(--sp-3);
		color: var(--c-ink-2);
		max-width: 50ch;
	}

	.noscript,
	.avis {
		margin: var(--sp-2) 0;
		padding: var(--sp-2) var(--sp-3);
		border: 1.5px solid var(--c-stamp-ink);
		border-radius: var(--r-sm);
		background: var(--c-stamp-soft);
		font-size: var(--fs-sm);
	}

	/* ---------- Barra: Mapa | Llista + Cims a prop ---------- */
	.barra {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-2) var(--sp-3);
		margin-bottom: var(--sp-3);
	}

	.commutador {
		display: inline-flex;
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		overflow: hidden;
		box-shadow: var(--sh-1);
	}

	.commutador button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: var(--tap);
		padding: 0 var(--sp-4);
		border: 0;
		background: var(--c-card);
		color: var(--c-ink);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--ls-caps);
		text-transform: uppercase;
		cursor: pointer;
	}

	.commutador button + button {
		border-left: var(--bw) solid var(--c-line);
	}

	.commutador button[aria-pressed='true'] {
		background: var(--c-ink);
		color: var(--c-on-ink);
	}

	.aprop {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: var(--tap);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		color: var(--c-stamp-ink);
		text-decoration: none;
	}

	.aprop:hover {
		text-decoration: underline;
	}

	.resultat {
		min-height: 1.5em;
		margin: var(--sp-3) 0 var(--sp-2);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	/* ---------- Marc del mapa (proporció fixa: sense CLS) ---------- */
	.vista-mapa {
		margin: 0 0 var(--sp-6);
	}

	.vista-mapa[hidden],
	.vista-llista[hidden] {
		display: none;
	}

	.marc {
		position: relative;
		width: 100%;
		aspect-ratio: 4 / 5;
		max-height: 72dvh;
		overflow: hidden;
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-lg);
		background: var(--c-paper-2);
		box-shadow: var(--sh-3);
		isolation: isolate;
	}

	.marc.fs {
		max-height: none;
		aspect-ratio: auto;
		width: 100%;
		height: 100%;
		border: 0;
		border-radius: 0;
	}

	.estatic,
	.viu,
	.estatic img,
	.punts {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.estatic img {
		object-fit: cover;
	}

	.punts.escriptori {
		display: none;
	}

	.punts .cim {
		fill: var(--c-card);
		stroke: var(--c-ink);
		stroke-width: 2.5;
	}

	.punts .ess {
		fill: var(--c-card);
		stroke: var(--c-stamp-ink);
		stroke-width: 2.8;
	}

	.viu {
		opacity: 0;
		z-index: 1;
	}

	.actiu .viu {
		opacity: 1;
	}

	/* Un cop actiu, la imatge fixa surt de l'arbre d'accessibilitat. */
	.actiu .estatic {
		visibility: hidden;
	}

	@media (prefers-reduced-motion: no-preference) {
		.viu {
			transition: opacity var(--dur-slow) var(--ease);
		}
	}

	.capa {
		position: absolute;
		inset: auto 0 var(--sp-4) 0;
		z-index: 2;
		display: grid;
		justify-items: center;
		gap: var(--sp-2);
		padding: 0 var(--sp-4);
	}

	.pastilla {
		max-width: 28rem;
		padding: var(--sp-2) var(--sp-3);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-card);
		font-size: var(--fs-xs);
		text-align: center;
		box-shadow: var(--sh-2);
	}

	.pastilla.error {
		border-color: var(--c-stamp-ink);
		background: var(--c-stamp-soft);
	}

	.activa {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
		min-height: var(--tap);
		padding: 0 var(--sp-5);
		border: var(--bw) solid var(--c-ink);
		border-radius: var(--r-md);
		background: var(--c-ink);
		color: var(--c-on-ink);
		font-family: var(--font-wide);
		font-weight: var(--fw-heavy);
		font-size: var(--fs-sm);
		box-shadow: var(--sh-2);
		cursor: pointer;
	}

	.controls {
		position: absolute;
		top: var(--sp-3);
		right: var(--sp-3);
		z-index: 2;
		display: grid;
		gap: var(--sp-2);
	}

	.ctl {
		display: grid;
		place-items: center;
		width: var(--tap);
		height: var(--tap);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-card);
		color: var(--c-ink);
		box-shadow: var(--sh-2);
		cursor: pointer;
	}

	.ctl:hover {
		background: var(--c-paper-2);
	}

	.ctl[aria-disabled='true'] {
		opacity: 0.6;
		cursor: progress;
	}

	/* Atribució de MapLibre (sempre visible, compacta per tipografia) */
	.marc :global(.maplibregl-ctrl-attrib) {
		max-width: calc(100% - var(--sp-2));
		font-family: var(--font-mono);
		font-size: 10px;
		line-height: 1.35;
		background: color-mix(in srgb, var(--c-card) 88%, transparent);
		color: var(--c-ink);
	}

	.marc :global(.maplibregl-ctrl-attrib a) {
		color: var(--c-ink);
	}

	.marc :global(.maplibregl-canvas:focus-visible) {
		outline: 3px solid var(--c-focus);
		outline-offset: -3px;
	}

	figcaption {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-1) var(--sp-4);
		margin-top: var(--sp-2);
	}

	.llegenda {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-1) var(--sp-4);
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: var(--fs-xs);
	}

	.llegenda li {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.llegenda .ess {
		color: var(--c-stamp-ink);
	}

	.atribucio {
		font-size: var(--fs-2xs);
		color: var(--c-ink-2);
	}

	.atribucio a {
		color: inherit;
	}

	.atribucio.amagada {
		visibility: hidden;
	}

	.geo {
		min-height: 1.5em;
		margin-top: var(--sp-1);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	/* ---------- Llista ---------- */
	.vista-llista {
		margin-bottom: var(--sp-8);
	}

	.vista-llista h2 {
		font-size: var(--fs-md);
		font-weight: var(--fw-black);
	}

	.hint {
		margin: var(--sp-1) 0 var(--sp-3);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	.buit {
		display: grid;
		gap: var(--sp-1);
		margin-bottom: var(--sp-4);
		padding: var(--sp-5) var(--sp-4);
		border: var(--bw) dashed var(--c-ink-2);
		border-radius: var(--r-lg);
		color: var(--c-ink-2);
	}

	.buit-titol {
		font-weight: var(--fw-bold);
		color: var(--c-ink);
	}

	@media (prefers-color-scheme: dark) {
		.estatic img {
			filter: brightness(0.78) contrast(1.05);
		}
	}

	@media (min-width: 48rem) {
		.marc {
			aspect-ratio: 16 / 10;
		}

		.punts.mobil {
			display: none;
		}

		.punts.escriptori {
			display: block;
		}
	}
</style>
