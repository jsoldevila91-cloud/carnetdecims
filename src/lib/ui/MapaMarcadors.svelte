<script lang="ts">
	import type { CimCataleg } from '$lib/domain';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import { formatAltitude } from './format';
	import { separarMarcadors } from './marcadors';

	/**
	 * Mapa estàtic (imatge WMS, SSR) amb un marcador enllaçat per cim a sobre.
	 * - Cada marcador és un enllaç a la fitxa, amb nom accessible "{nom}, {alt} m" i el número
	 *   del cim a la llista de la pàgina (mateix ordre de tabulació que la llista).
	 * - Àrea tàctil de 24 × 24 px (WCAG 2.2, 2.5.8) i etiqueta visible en passar-hi o en fer-hi focus.
	 * - Els cims molt propers se separen (`separarMarcadors`) perquè cap marcador en tapi un altre
	 *   ni a 320 px; una línia guia uneix el marcador desplaçat amb el punt real del cim. El
	 *   desplaçament mínim i la distància als punts reals fan que guia i punt quedin a la vista
	 *   (no sota el disc del marcador), amb un halo blanc per llegir-se sobre el mapa.
	 * - Atribució visible sota la imatge (ICGC CC BY 4.0 / IGN Llicència Oberta).
	 */
	let {
		mapa,
		cims,
		numeros,
		alt,
		ample = 640,
		altura = 480,
		etiqueta
	}: {
		mapa: {
			url: string;
			llicenciaUrl: string;
			font: 'icgc' | 'ign';
			punts: readonly { slug: string; xPct: number; yPct: number }[];
		};
		cims: readonly CimCataleg[];
		numeros: ReadonlyMap<string, number>;
		/** Text alternatiu de la imatge. */
		alt: string;
		ample?: number;
		altura?: number;
		/** Nom accessible de la llista de marcadors. */
		etiqueta: string;
	} = $props();

	const perSlug = $derived(new Map(cims.map((c) => [c.slug, c])));
	// Marcadors en l'ordre de la llista de la pàgina (ordre de tabulació coherent).
	const marcadors = $derived(
		separarMarcadors(mapa.punts)
			.map((p) => ({ ...p, cim: perSlug.get(p.slug), num: numeros.get(p.slug) }))
			.filter((p): p is typeof p & { cim: CimCataleg; num: number } => !!p.cim && !!p.num)
			.sort((a, b) => a.num - b.num)
	);
</script>

<figure class="map">
	<div class="map-img" style:aspect-ratio="{ample} / {altura}">
		<img src={mapa.url} width={ample} height={altura} {alt} loading="lazy" decoding="async" />
		{#if marcadors.some((p) => p.desplacat)}
			<svg class="guies" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
				{#each marcadors.filter((p) => p.desplacat) as p (p.slug)}
					<line
						class="halo"
						x1={p.x0Pct}
						y1={p.y0Pct}
						x2={p.xPct}
						y2={p.yPct}
						vector-effect="non-scaling-stroke"
					/>
					<line
						x1={p.x0Pct}
						y1={p.y0Pct}
						x2={p.xPct}
						y2={p.yPct}
						vector-effect="non-scaling-stroke"
					/>
				{/each}
			</svg>
			{#each marcadors.filter((p) => p.desplacat) as p (p.slug)}
				<span class="real" style:left="{p.x0Pct}%" style:top="{p.y0Pct}%" aria-hidden="true"></span>
			{/each}
		{/if}
		<ul class="marcadors" aria-label={etiqueta}>
			{#each marcadors as p (p.slug)}
				<li
					style:left="{p.xPct}%"
					style:top="{p.yPct}%"
					class={{ dreta: p.xPct >= 50, sota: p.yPct < 25 }}
				>
					<a
						href={href(`/cims/${p.slug}`)}
						class={{ essencial: p.cim.essencial }}
						aria-label="{p.cim.nom}, {formatAltitude(p.cim.altitud)} m"
					>
						<span class="punt mono" aria-hidden="true">{p.num}</span>
						<span class="etiqueta" aria-hidden="true">{p.cim.nom}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
	<figcaption class="mono">
		<a href={mapa.llicenciaUrl} rel="external noopener license" target="_blank">
			{mapa.font === 'icgc' ? m.cim_map_attribution_icgc() : m.cim_map_attribution_ign()}
			<span class="sr-only">{m.external_new_tab()}</span>
		</a>
	</figcaption>
</figure>

<style>
	.map {
		margin: 0;
	}

	.map-img {
		position: relative;
		/* Referència (cqi) de l'amplada màxima de les etiquetes */
		container-type: inline-size;
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-lg);
		background: var(--c-paper-2);
		box-shadow: var(--sh-2);
	}

	.map-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: calc(var(--r-lg) - var(--bw));
	}

	/* Línies guia i punt real dels marcadors desplaçats */
	.guies {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
	}

	.guies line {
		stroke: #1b2a47;
		stroke-width: 1.5;
	}

	/* Halo blanc sota la guia: es llegeix sobre qualsevol zona del mapa */
	.guies line.halo {
		stroke: #fff;
		stroke-width: 4;
		stroke-opacity: 0.85;
	}

	.real {
		position: absolute;
		width: 8px;
		height: 8px;
		margin: -4px 0 0 -4px;
		border: 1.5px solid #fff;
		border-radius: var(--r-full);
		background: #1b2a47;
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.35);
		pointer-events: none;
	}

	.marcadors {
		position: absolute;
		inset: 0;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.marcadors li {
		position: absolute;
		width: 0;
		height: 0;
	}

	/* Àrea tàctil de 24 px centrada al punt del cim */
	.marcadors a {
		position: absolute;
		top: -12px;
		left: -12px;
		display: grid;
		place-items: center;
		width: 24px;
		height: 24px;
		border-radius: var(--r-full);
		text-decoration: none;
	}

	.punt {
		display: grid;
		place-items: center;
		width: 20px;
		height: 20px;
		border: 2px solid #fff;
		border-radius: var(--r-full);
		background: var(--c-ink);
		color: var(--c-on-ink);
		box-shadow: 0 0 0 1px rgb(0 0 0 / 0.45);
		font-size: 0.625rem;
		font-weight: var(--fw-bold);
		line-height: 1;
	}

	/* Sobre el mapa (sempre clar) els colors són fixos, igual en tema clar i fosc */
	.marcadors a .punt {
		background: #1b2a47;
		color: #fff;
	}

	.marcadors a.essencial .punt {
		background: #c0392b;
	}

	/*
	 * Etiqueta ancorada a la vora del marcador i cap al centre del mapa (esquerra → cap a la dreta
	 * i al revés), amb una amplada màxima de mig mapa: mai surt de la imatge, ni a 320 px.
	 */
	.etiqueta {
		position: absolute;
		bottom: calc(100% + 4px);
		left: 0;
		z-index: 2;
		width: max-content;
		max-width: 46cqi;
		padding: 2px var(--sp-2);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-sm);
		background: var(--c-card);
		color: var(--c-ink);
		box-shadow: var(--sh-1);
		font-size: var(--fs-xs);
		font-weight: var(--fw-bold);
		line-height: 1.3;
		overflow-wrap: anywhere;
		opacity: 0;
		pointer-events: none;
		transition: opacity var(--dur-fast) ease;
	}

	.dreta .etiqueta {
		left: auto;
		right: 0;
	}

	.sota .etiqueta {
		top: calc(100% + 4px);
		bottom: auto;
	}

	.marcadors a:hover,
	.marcadors a:focus-visible {
		z-index: 3;
	}

	.marcadors a:hover .etiqueta,
	.marcadors a:focus-visible .etiqueta {
		opacity: 1;
	}

	.marcadors a:focus-visible {
		outline: 3px solid var(--c-focus);
		outline-offset: 1px;
	}

	.map figcaption {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	/* Text discret però amb àrea tàctil de 44 px d'alt */
	.map figcaption a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		color: inherit;
		text-underline-offset: 0.2em;
	}
</style>
