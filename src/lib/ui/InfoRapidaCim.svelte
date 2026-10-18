<script lang="ts">
	import { getLocale } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import AvisRestriccio from './AvisRestriccio.svelte';
	import IconaTempsAra from './IconaTempsAra.svelte';
	import { formatTemperatura } from './fitxa/meteo';
	import { horaCurta, textCondicio, type InfoRapidaCim } from './info-rapida';

	/**
	 * Informació ràpida d'un cim a les llistes (R5.2): avís de restricció d'accés vigent avui i el
	 * temps d'ara (icona pròpia + temperatura). Ocupa sempre la mateixa caixa, amb dades o sense:
	 * quan arriben (després de la càrrega) no mou res; sense connexió, la caixa queda buida.
	 * Va dins de l'enllaç de la fila: el text per a lectors de pantalla s'afegeix al nom.
	 */
	let { info }: { info?: InfoRapidaCim | null } = $props();

	const locale = getLocale();
	const temps = $derived(info?.temps ?? null);
	const temperatura = $derived(
		typeof temps?.temperatura === 'number' && Number.isFinite(temps.temperatura)
			? Math.round(temps.temperatura)
			: null
	);
	const textTemps = $derived.by(() => {
		if (!temps) return '';
		return m.quick_weather_label({
			hora: info?.hora ? horaCurta(info.hora) : '–',
			condicio: textCondicio(temps),
			temp: temperatura === null ? '–' : formatTemperatura(temperatura, locale)
		});
	});
</script>

<span class="info" data-testid="info-rapida">
	<span class="slot acces">
		{#if info?.acces}<AvisRestriccio acces={info.acces} avui={info.avui ?? null} />{/if}
	</span>
	<span class="slot temps" title={textTemps || undefined}>
		{#if temps}
			<IconaTempsAra categoria={temps.categoria} esDia={temps.esDia} size={20} />
			{#if temperatura !== null}<span class="graus" aria-hidden="true">{temperatura}°</span>{/if}
			<span class="sr-only">{textTemps}</span>
		{/if}
	</span>
</span>

<style>
	/* Caixa fixa: 1.25rem (avís) + 1.25rem (icona) + 4ch ("-12°"). */
	.info {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-1);
		flex: none;
		align-self: center;
		height: 1.25rem;
	}

	.slot {
		display: inline-flex;
		align-items: center;
		flex: none;
		height: 1.25rem;
	}

	.acces {
		width: 1.25rem;
	}

	.temps {
		gap: 2px;
		width: calc(1.25rem + 2px + 4ch);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
	}

	.graus {
		font-weight: var(--fw-semibold);
		color: var(--c-ink-2);
		font-variant-numeric: tabular-nums;
	}
</style>
