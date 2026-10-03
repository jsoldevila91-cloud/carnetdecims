<script lang="ts">
	import Icon from '../Icon.svelte';
	import { wikilocEmbedUrl } from '$lib/platform/wikiloc';
	import { getLocale } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import type { RutaWikiloc } from '$lib/content/fitxes/types';

	/**
	 * Ruta recomanada de Wikiloc amb "clic per carregar": fins que l'usuari no prem "Mostra la
	 * ruta" no es fa cap petició a Wikiloc (privacitat: és un tercer amb galetes). Abans només hi
	 * ha el títol i l'enllaç extern.
	 */
	let { ruta }: { ruta: RutaWikiloc } = $props();

	const locale = getLocale();
	let obert = $state(false);
	const idMapa = $derived(`wikiloc-${ruta.id}`);
	const idAvis = $derived(`wikiloc-avis-${ruta.id}`);
	const src = $derived(wikilocEmbedUrl(ruta.id, locale));
</script>

<li class="wl">
	<p class="wl-titol">{ruta.titol}</p>
	<div class="wl-accions">
		<button
			type="button"
			class="mostra"
			aria-expanded={obert}
			aria-controls={idMapa}
			aria-describedby={obert ? undefined : idAvis}
			onclick={() => (obert = !obert)}
		>
			<Icon name={obert ? 'minus' : 'map'} size={16} />
			{obert ? m.cim_wikiloc_hide() : m.cim_wikiloc_show()}
		</button>
		<a class="ext" href={ruta.url} rel="external nofollow noopener" target="_blank">
			{m.cim_wikiloc_open()}<Icon name="external" size={14} />
			<span class="sr-only">{m.external_new_tab()}</span>
		</a>
	</div>
	{#if !obert}
		<!-- Consentiment informat: abans del clic no es contacta amb Wikiloc. -->
		<p id={idAvis} class="avis">{m.cim_wikiloc_privacy()}</p>
	{/if}
	<div id={idMapa} class="wl-mapa">
		{#if obert}
			<iframe
				{src}
				title={m.cim_wikiloc_iframe_title({ titol: ruta.titol })}
				width="640"
				height="400"
				loading="lazy"
				referrerpolicy="strict-origin-when-cross-origin"
				sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
			></iframe>
			<p class="credit mono">
				<a href={`https://${locale}.wikiloc.com/`} rel="external nofollow noopener" target="_blank"
					>{m.cim_wikiloc_credit()}<span class="sr-only"> {m.external_new_tab()}</span></a
				>
			</p>
		{/if}
	</div>
</li>

<style>
	.wl {
		display: grid;
		gap: var(--sp-2);
		padding: var(--sp-3) var(--sp-4);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-card);
		min-width: 0;
	}

	.wl-titol {
		font-weight: var(--fw-bold);
		overflow-wrap: anywhere;
	}

	.wl-accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--sp-2) var(--sp-4);
	}

	.mostra {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
		min-height: var(--tap);
		padding: 0 var(--sp-4);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-paper);
		color: var(--c-ink);
		font: inherit;
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		cursor: pointer;
	}

	.mostra[aria-expanded='true'] {
		background: var(--c-paper-2);
	}

	.ext {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-1);
		min-height: var(--tap);
		color: var(--c-blue);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}

	.avis {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.wl-mapa:empty {
		display: none;
	}

	iframe {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 3;
		max-height: 420px;
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-sm);
		background: var(--c-paper-2);
	}

	.credit {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.credit a {
		display: inline-flex;
		align-items: center;
		min-height: 24px;
		color: inherit;
	}
</style>
