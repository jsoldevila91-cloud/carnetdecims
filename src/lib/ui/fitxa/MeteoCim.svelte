<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import IconaTemps from './IconaTemps.svelte';
	import TextEnLinia from '../TextEnLinia.svelte';
	import { formatAltitude } from '../format';
	import {
		categoriaTemps,
		diesDesDe,
		EDAT_ANTIGA_MIN,
		edatMinuts,
		formatEdat,
		formatPrecipitacio,
		formatProbabilitat,
		formatTemperatura,
		formatVent,
		type CategoriaTemps
	} from './meteo';
	import { ErrorMeteo, obtenirMeteo, type PrevisioMeteo } from '$lib/platform/meteo';
	import { network } from '$lib/platform/network.svelte';
	import { avuiLocal } from '$lib/domain';
	import { getLocale } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	/**
	 * Previsió del temps al cim (fase 6a). No s'indexa: es carrega al client quan la secció
	 * s'acosta a la pantalla (o de seguida si no hi ha connexió, perquè el service worker pugui
	 * servir l'última previsió guardada). L'espai està reservat amb un esquelet de la mateixa mida.
	 */
	let { slug, altitud }: { slug: string; altitud: number } = $props();

	const DIES = 4;
	const locale = getLocale();

	type Estat = 'esperant' | 'carregant' | 'ok' | 'error' | 'offline';
	let estat = $state<Estat>('esperant');
	let previsio = $state<PrevisioMeteo | null>(null);
	let avui = $state<string | null>(null);
	let seccio: HTMLElement | undefined = $state();
	let peticio = 0;
	/** S'avorta en desmuntar el component (navegació a una altra fitxa). */
	const desmuntatge = new AbortController();

	const CONDICIO: Record<CategoriaTemps, () => string> = {
		sere: m.cim_weather_sere,
		'poc-nuvol': m.cim_weather_poc_nuvol,
		nuvol: m.cim_weather_nuvol,
		boira: m.cim_weather_boira,
		plugim: m.cim_weather_plugim,
		pluja: m.cim_weather_pluja,
		neu: m.cim_weather_neu,
		tempesta: m.cim_weather_tempesta,
		desconegut: m.cim_weather_desconegut
	};

	const fmtDia = new Intl.DateTimeFormat(locale, {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
		timeZone: 'UTC'
	});
	const fmtActualitzat = new Intl.DateTimeFormat(locale, {
		day: 'numeric',
		month: 'long',
		hour: '2-digit',
		minute: '2-digit'
	});
	/** Moment en què s'ha rebut la previsió (per calcular-ne l'edat). */
	let rebuda = $state<Date | null>(null);

	/** Només dies d'avui endavant (una previsió guardada pot ser d'ahir). */
	const dies = $derived.by(() => {
		if (!previsio) return [];
		const ref = avui ?? previsio.dies[0]?.data ?? '';
		return previsio.dies.filter((d) => !ref || diesDesDe(ref, d.data) >= 0).slice(0, DIES);
	});

	function nomDia(data: string): { nom: string | null; data: string } {
		const delta = avui ? diesDesDe(avui, data) : null;
		const text = fmtDia.format(new Date(`${data.slice(0, 10)}T00:00:00Z`));
		if (delta === 0) return { nom: m.cim_weather_today(), data: text };
		if (delta === 1) return { nom: m.cim_weather_tomorrow(), data: text };
		return { nom: null, data: text };
	}

	/** "Previsió actualitzada fa 2 hores" + data absoluta (atribut `title`) i si és antiga. */
	const actualitzacio = $derived.by(() => {
		if (!previsio || !rebuda) return null;
		const minuts = edatMinuts(previsio.actualitzat, rebuda);
		if (minuts === null) return null;
		return {
			text: m.cim_weather_updated({ fa: formatEdat(minuts, locale) }),
			absoluta: fmtActualitzat.format(new Date(previsio.actualitzat)),
			antiga: minuts > EDAT_ANTIGA_MIN
		};
	});

	async function carregar() {
		const id = ++peticio;
		estat = 'carregant';
		try {
			const res = await obtenirMeteo(slug, { signal: desmuntatge.signal });
			if (id !== peticio) return;
			previsio = res;
			rebuda = new Date();
			estat = 'ok';
		} catch (e) {
			if (id !== peticio || desmuntatge.signal.aborted) return;
			const senseXarxa = (e instanceof ErrorMeteo && e.estat === 0) || !navigator.onLine;
			estat = senseXarxa ? 'offline' : 'error';
		}
	}

	onMount(() => {
		avui = avuiLocal();
		const aturarXarxa = network.start();

		// Sense connexió: es prova de seguida (resposta local del SW o error immediat).
		if (!navigator.onLine || typeof IntersectionObserver === 'undefined' || !seccio) {
			void carregar();
			return () => {
				desmuntatge.abort();
				aturarXarxa();
			};
		}
		const io = new IntersectionObserver(
			(entrades) => {
				if (entrades.some((e) => e.isIntersecting)) {
					io.disconnect();
					void carregar();
				}
			},
			{ rootMargin: '200px 0px' }
		);
		io.observe(seccio);
		return () => {
			io.disconnect();
			desmuntatge.abort();
			aturarXarxa();
		};
	});

	// En tornar la connexió (transició fora de línia → en línia), es reintenta sol una vegada.
	// No es reintenta en bucle si la xarxa diu "en línia" però la petició falla.
	let estavaEnLinia = true;
	$effect(() => {
		const enLinia = network.online;
		const tornaLaXarxa = enLinia && !estavaEnLinia;
		estavaEnLinia = enLinia;
		if (tornaLaXarxa && untrack(() => estat === 'offline')) void carregar();
	});

	const ambDades = $derived(estat === 'ok' && dies.length > 0);
	const desada = $derived(ambDades && !network.online);
</script>

<section class="meteo" aria-labelledby="meteo-titol" bind:this={seccio}>
	<h2 id="meteo-titol" class="x-wide">{m.cim_weather_title()}</h2>
	<p class="alt mono">{m.cim_weather_altitude({ alt: formatAltitude(altitud) })}</p>

	<div class="cos">
		<p class="sr-only" role="status">
			{#if estat === 'carregant'}{m.cim_weather_loading()}{/if}
		</p>

		{#if ambDades && previsio}
			<ul class="dies">
				{#each dies as d (d.data)}
					{@const cat = categoriaTemps(d.codi)}
					{@const nd = nomDia(d.data)}
					<li class="dia">
						<p class="dia-nom">
							{#if nd.nom}<strong>{nd.nom}</strong>{/if}
							<span class="mono">{nd.data}</span>
						</p>
						<div class="dia-cap">
							<IconaTemps categoria={cat} />
							<p class="temps">
								<span class="tmax"
									><span class="sr-only">{`${m.cim_weather_max()}: `}</span>{formatTemperatura(
										d.tMax,
										locale
									)}</span
								>
								<span class="tmin"
									><span class="sr-only">{`, ${m.cim_weather_min()}: `}</span>{formatTemperatura(
										d.tMin,
										locale
									)}</span
								>
							</p>
						</div>
						<p class="condicio">{CONDICIO[cat]()}</p>
						<dl class="detalls">
							<div>
								<dt>{m.cim_weather_wind()}</dt>
								<dd>
									{formatVent(d.ventMax, locale)}{#if d.ratxaMax != null},
										<span class="nowrap"
											>{m.cim_weather_gusts({ valor: formatVent(d.ratxaMax, locale) })}</span
										>{/if}
								</dd>
							</div>
							<div>
								<dt>{m.cim_weather_precip()}</dt>
								<dd>
									{formatPrecipitacio(
										d.precipitacio,
										locale
									)}{#if d.probPrecipitacio != null}{` (${formatProbabilitat(
											d.probPrecipitacio,
											locale
										)})`}{/if}
								</dd>
							</div>
							{#if d.iso0 != null}
								<div>
									<dt>{m.cim_weather_freezing()}</dt>
									<dd>{formatAltitude(d.iso0)} m</dd>
								</div>
							{/if}
						</dl>
					</li>
				{/each}
			</ul>
		{:else if estat === 'error' || estat === 'offline' || (estat === 'ok' && dies.length === 0)}
			<div class="avis-estat" role="status">
				<p>{estat === 'error' ? m.cim_weather_error() : m.cim_weather_offline()}</p>
				{#if estat === 'error'}
					<button type="button" class="reintenta" onclick={carregar}>{m.cim_weather_retry()}</button
					>
				{/if}
			</div>
		{:else}
			<!-- Esquelet: mateixa graella i mida que les dades (sense salts de disseny). -->
			<ul class="dies esquelet" aria-hidden="true">
				{#each Array.from({ length: DIES }, (_, i) => i) as i (i)}
					<li class="dia">
						<span class="barra curta"></span>
						<div class="dia-cap">
							<span class="cercle"></span>
							<span class="barra mitjana"></span>
						</div>
						<span class="barra"></span>
						<span class="barra"></span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	{#if ambDades && previsio}
		{#if actualitzacio}
			<p class="actualitzada">
				<time datetime={previsio.actualitzat} title={actualitzacio.absoluta}
					>{actualitzacio.text}</time
				>
			</p>
		{/if}
		{#if desada || actualitzacio?.antiga}
			<p class="avis-estat" role="note">
				{desada ? m.cim_weather_saved() : ''}
				{actualitzacio?.antiga ? m.cim_weather_old() : ''}
			</p>
		{/if}
		<p class="font mono">
			<a href={previsio.font.url} rel="external noopener" target="_blank"
				>{m.cim_weather_source({ nom: previsio.font.nom })}<span class="sr-only">
					{m.external_new_tab()}</span
				></a
			>{#if previsio.font.llicencia}<span class="sep" aria-hidden="true">·</span
				>{#if previsio.font.llicenciaUrl}<a
						href={previsio.font.llicenciaUrl}
						rel="external noopener license"
						target="_blank"
						>{previsio.font.llicencia}<span class="sr-only"> {m.external_new_tab()}</span></a
					>{:else}{previsio.font.llicencia}{/if}{/if}
		</p>
	{:else if estat === 'esperant' || estat === 'carregant'}
		<!-- Reserva l'alçada de "actualitzada" i de la font mentre carrega (sense salts). -->
		<p class="actualitzada" aria-hidden="true">&nbsp;</p>
		<p class="font" aria-hidden="true">&nbsp;</p>
	{/if}

	<p class="avis"><TextEnLinia text={m.cim_weather_warning()} /></p>
</section>

<style>
	.meteo {
		container-type: inline-size;
	}

	h2 {
		margin-bottom: var(--sp-1);
		padding-top: var(--sp-2);
		border-top: var(--bw) solid var(--c-line);
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
	}

	.alt {
		margin-bottom: var(--sp-3);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.dies {
		display: grid;
		gap: var(--sp-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/*
	 * Mòbil: una fila per dia (icona + dia/condició + temperatures; detalls a sota).
	 * Alçada mínima fixa, compartida amb l'esquelet: el canvi d'estat no mou la pàgina.
	 */
	.dia {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		grid-template-areas:
			'nom cap'
			'cond cap'
			'det det';
		align-content: start;
		gap: 2px var(--sp-3);
		min-height: 9.5rem;
		padding: var(--sp-3);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-card);
	}

	.dia-nom {
		grid-area: nom;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 var(--sp-2);
		font-size: var(--fs-sm);
	}

	.dia-nom .mono {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.dia-cap {
		grid-area: cap;
		display: flex;
		align-items: center;
		gap: var(--sp-2);
	}

	.temps {
		display: grid;
		justify-items: end;
		line-height: 1.1;
	}

	.tmax {
		font-size: var(--fs-lg);
		font-weight: var(--fw-black);
	}

	.tmin {
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		color: var(--c-ink-2);
	}

	.condicio {
		grid-area: cond;
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}

	.detalls {
		grid-area: det;
		display: grid;
		gap: 2px;
		margin: var(--sp-2) 0 0;
		padding-top: var(--sp-2);
		border-top: 1px dashed var(--c-rule);
		font-size: var(--fs-xs);
	}

	.detalls div {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--sp-2);
	}

	.detalls dt {
		color: var(--c-ink-2);
	}

	.detalls dd {
		margin: 0;
		font-family: var(--font-mono);
		font-weight: var(--fw-semibold);
	}

	.nowrap {
		white-space: nowrap;
	}

	/* Esquelet */
	.esquelet .dia {
		grid-template-areas: none;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--sp-2);
	}

	.barra,
	.cercle {
		display: block;
		height: 0.75rem;
		border-radius: var(--r-xs);
		background: var(--c-paper-2);
	}

	.barra.curta {
		width: 40%;
	}

	.barra.mitjana {
		width: 30%;
		height: 1.25rem;
	}

	.cercle {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: var(--r-full);
	}

	@media (prefers-reduced-motion: no-preference) {
		.barra,
		.cercle {
			animation: pols 1.4s ease-in-out infinite;
		}
	}

	@keyframes pols {
		50% {
			opacity: 0.55;
		}
	}

	.avis-estat {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-2) var(--sp-3);
		margin-bottom: var(--sp-2);
		padding: var(--sp-3) var(--sp-4);
		border-left: 3px solid var(--c-kraft);
		background: var(--c-paper-2);
		font-size: var(--fs-sm);
		color: var(--c-ink);
	}

	.reintenta {
		min-height: var(--tap);
		padding: 0 var(--sp-4);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-card);
		color: var(--c-ink);
		font: inherit;
		font-weight: var(--fw-semibold);
		cursor: pointer;
	}

	.actualitzada {
		margin-top: var(--sp-2);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}

	.avis-estat[role='note'] {
		margin: var(--sp-2) 0 0;
	}

	.font {
		min-height: 24px;
		margin-top: var(--sp-2);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
		overflow-wrap: anywhere;
	}

	.font .sep {
		margin-inline: 0.5em;
	}

	.font a {
		display: inline-flex;
		align-items: center;
		min-height: 24px;
		color: inherit;
		text-underline-offset: 0.2em;
	}

	.avis {
		margin-top: var(--sp-2);
		max-width: 60ch;
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	/* Columna ampla: quatre targetes en fila. */
	@container (min-width: 36rem) {
		.dies {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		.dia {
			grid-template-columns: minmax(0, 1fr);
			grid-template-areas:
				'nom'
				'cap'
				'cond'
				'det';
			min-height: 18.5rem;
		}

		.dia-cap {
			justify-content: space-between;
			margin-top: var(--sp-1);
		}
	}
</style>
