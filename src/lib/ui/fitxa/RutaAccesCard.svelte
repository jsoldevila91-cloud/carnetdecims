<script lang="ts">
	import Card from '../Card.svelte';
	import Icon from '../Icon.svelte';
	import TextEnLinia from '../TextEnLinia.svelte';
	import LlistaFonts from './LlistaFonts.svelte';
	import MideIndicadors from './MideIndicadors.svelte';
	import { formatAltitude, formatDurada, formatKm } from '../format';
	import { getLocale } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import type { RutaAccesLocal } from '$lib/content/fitxes/local';

	/** Targeta d'una ruta d'accés: nom, sortida, xifres d'anada, descripció, MIDE i fonts. */
	// Ja en l'idioma de la pàgina (`contingutFitxaLocal`).
	let { ruta }: { ruta: RutaAccesLocal } = $props();

	const locale = getLocale();
	const idTitol = $derived(`ruta-${ruta.id}`);

	/** Punt de sortida a OpenStreetMap (dades obertes; amb marcador). */
	const mapaSortida = $derived.by(() => {
		const { lat, lon } = ruta.sortida;
		if (lat === undefined || lon === undefined) return null;
		const la = lat.toFixed(5);
		const lo = lon.toFixed(5);
		return `https://www.openstreetmap.org/?mlat=${la}&mlon=${lo}#map=15/${la}/${lo}`;
	});

	/** Espai fix (U+00A0). */
	const NBSP = String.fromCharCode(0xa0);

	/** Número i unitat sempre junts ("3 h" / "30 min"); el salt, si cal, entre les dues parts. */
	const ambEspaisFixos = (text: string) => text.replace(/(\d) /g, `$1${NBSP}`);

	const xifres = $derived.by(() => {
		const out: { nom: string; valor: string }[] = [];
		if (ruta.desnivellPositiuM !== undefined) {
			out.push({
				nom: m.cim_route_elevation(),
				valor: `+${formatAltitude(ruta.desnivellPositiuM)}${NBSP}m`
			});
		}
		if (ruta.distanciaKm !== undefined) {
			out.push({
				nom: m.cim_route_distance(),
				valor: `${formatKm(ruta.distanciaKm, locale)}${NBSP}km`
			});
		}
		if (ruta.tempsMinuts !== undefined) {
			out.push({ nom: m.cim_route_time(), valor: ambEspaisFixos(formatDurada(ruta.tempsMinuts)) });
		}
		return out;
	});
</script>

<Card as="article" variant="flat" class="ruta" aria-labelledby={idTitol}>
	<h3 id={idTitol}>{ruta.nom}</h3>

	<p class="sortida">
		<span class="label">{m.cim_route_start()}</span>
		<span class="sortida-nom">{ruta.sortida.nom}</span>
		{#if mapaSortida}
			<a class="ext" href={mapaSortida} rel="external noopener" target="_blank">
				<Icon name="map" size={16} />{m.cim_route_open_map()}
				<span class="sr-only">{m.cim_route_open_map_sr()}</span>
			</a>
		{/if}
	</p>

	{#if xifres.length > 0}
		<dl class="xifres">
			{#each xifres as x (x.nom)}
				<div>
					<dt class="label">{x.nom}</dt>
					<dd class="mono">{x.valor}</dd>
				</div>
			{/each}
		</dl>
		<p class="nota">{m.cim_route_note()}</p>
	{/if}

	<p class="desc"><TextEnLinia text={ruta.descripcio} /></p>

	{#if ruta.mide}
		<MideIndicadors mide={ruta.mide} titolId={`${idTitol}-mide`} />
	{/if}

	{#if ruta.fonts.length > 0}
		<details class="fonts">
			<summary>{m.cim_route_sources()}</summary>
			<LlistaFonts fonts={ruta.fonts} />
		</details>
	{/if}
</Card>

<style>
	:global(.card.ruta) {
		display: grid;
		gap: var(--sp-3);
		min-width: 0;
		padding: var(--sp-4);
		container-type: inline-size;
	}

	h3 {
		font-size: var(--fs-md);
		font-weight: var(--fw-black);
		line-height: var(--lh-snug);
		overflow-wrap: break-word;
	}

	.sortida {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0 var(--sp-2);
		font-size: var(--fs-sm);
	}

	.sortida-nom {
		font-weight: var(--fw-semibold);
	}

	.ext {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-1);
		min-height: var(--tap);
		color: var(--c-blue);
		font-weight: var(--fw-semibold);
		text-underline-offset: 2px;
	}

	/*
	 * Targeta estreta (320 px): una fila per xifra, com la taula de dades de la fitxa.
	 * Targeta ampla: tres caselles en fila.
	 */
	.xifres {
		display: grid;
		margin: 0;
		border: 1px dashed var(--c-rule);
		border-radius: var(--r-sm);
		background: var(--c-paper);
	}

	.xifres div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--sp-2);
		padding: var(--sp-1) var(--sp-3);
	}

	.xifres div + div {
		border-top: 1px dashed var(--c-rule);
	}

	.xifres dt {
		color: var(--c-ink-2);
	}

	.xifres dd {
		margin: 0;
		font-size: var(--fs-base);
		font-weight: var(--fw-bold);
		line-height: var(--lh-snug);
		white-space: nowrap;
	}

	@container (min-width: 18rem) {
		.xifres {
			grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
			gap: var(--sp-2);
			border: 0;
			background: none;
		}

		.xifres div {
			display: block;
			padding: var(--sp-2);
			border: 1px dashed var(--c-rule);
			border-radius: var(--r-sm);
			background: var(--c-paper);
		}

		.xifres div + div {
			border-top: 1px dashed var(--c-rule);
		}

		/* Espais fixos entre número i unitat: "3 h" / "30 min" en dues línies si no hi cap. */
		.xifres dd {
			white-space: normal;
		}
	}

	.nota {
		margin-top: calc(-1 * var(--sp-1));
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.desc {
		max-width: 68ch;
	}

	.fonts summary {
		display: flex;
		align-items: center;
		min-height: var(--tap);
		cursor: pointer;
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		color: var(--c-ink-2);
	}

	.fonts summary {
		gap: var(--sp-2);
		list-style: none;
	}

	.fonts summary::-webkit-details-marker {
		display: none;
	}

	.fonts summary::before {
		content: '+';
		color: var(--c-stamp-ink);
		font-family: var(--font-mono);
		font-size: var(--fs-md);
		line-height: 1;
	}

	.fonts[open] summary::before {
		content: '−';
	}

	.fonts[open] summary {
		margin-bottom: var(--sp-2);
	}
</style>
