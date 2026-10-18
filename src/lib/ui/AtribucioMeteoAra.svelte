<script lang="ts">
	import type { FontMeteo } from '$lib/platform/meteo';
	import { m } from '$lib/paraglide/messages';
	import { horaCurta } from './info-rapida';

	/**
	 * Llegenda i atribució del temps actual de les llistes (R5.2, CC BY 4.0 obligatòria a prop de
	 * les icones): "Temps actual a cada cim (hora 10:15) · Dades: Open-Meteo (CC BY 4.0)". La línia
	 * sempre ocupa el seu lloc: sense dades (sense connexió) queda buida i no mou la llista.
	 */
	let { font = null, hora = null }: { font?: FontMeteo | null; hora?: string | null } = $props();
</script>

<p class="atribucio mono" data-testid="atribucio-meteo">
	{#if font && hora}
		{m.quick_weather_caption({ hora: horaCurta(hora) })} · {m.quick_weather_data()}
		<a href={font.url} rel="external noopener" target="_blank"
			>{font.nom}<span class="sr-only"> {m.external_new_tab()}</span></a
		>
		(<a href={font.llicenciaUrl} rel="external noopener license" target="_blank"
			>{font.llicencia}<span class="sr-only"> {m.external_new_tab()}</span></a
		>)
	{/if}
</p>

<style>
	.atribucio {
		min-height: calc(var(--fs-xs) * 1.5);
		margin: var(--sp-2) 0 0;
		font-size: var(--fs-xs);
		line-height: 1.5;
		color: var(--c-ink-2);
	}

	/* Al mòbil la línia en fa dues: es reserven des del principi. */
	@media (max-width: 40rem) {
		.atribucio {
			min-height: calc(var(--fs-xs) * 3);
		}
	}

	a {
		color: inherit;
		text-underline-offset: 0.2em;
	}
</style>
