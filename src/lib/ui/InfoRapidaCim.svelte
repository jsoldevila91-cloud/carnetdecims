<script lang="ts">
	import { getLocale } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import AvisRestriccio from './AvisRestriccio.svelte';
	import IconaTempsAra from './IconaTempsAra.svelte';
	import { formatTemperatura } from './fitxa/meteo';
	import { horaCurta, textCondicio, type InfoRapidaCim } from './info-rapida';

	/**
	 * Informació ràpida d'un cim a les llistes (R5.2): el temps d'ara (icona pròpia + temperatura)
	 * i l'avís de restricció d'accés vigent avui (text curt visible). És una línia d'alçada fixa,
	 * amb dades o sense: quan arriben no mou res; sense connexió, queda buida.
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
	<span class="slot temps" title={textTemps || undefined}>
		{#if temps}
			<IconaTempsAra categoria={temps.categoria} esDia={temps.esDia} size={20} />
			{#if temperatura !== null}<span class="graus" aria-hidden="true">{temperatura}°</span>{/if}
			<span class="sr-only">{textTemps}</span>
		{/if}
	</span>
	<span class="slot acces">
		{#if info?.acces}<AvisRestriccio
				acces={info.acces}
				avui={info.avui ?? null}
				variant="curt"
			/>{/if}
	</span>
</span>

<style>
	/*
	 * Línia pròpia d'alçada fixa sota el nom (1.25rem), amb dades o sense: el temps (icona +
	 * "-12°", amplada fixa) i l'avís d'accés amb text curt visible (es retalla amb "…").
	 * Qui la posa (`LlistaCims`, `FilaEssencial`) li dona tota l'amplada de la fila.
	 */
	.info {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		min-width: 0;
		height: 1.25rem;
		overflow: hidden;
		/* L'amplada la posa la fila: el text de l'avís (sense salts) no l'eixampla mai. */
		contain: inline-size;
	}

	.slot {
		display: inline-flex;
		align-items: center;
		height: 1.25rem;
	}

	.temps {
		flex: none;
		gap: 2px;
		width: calc(1.25rem + 2px + 4ch);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
	}

	.acces {
		flex: 1 1 auto;
		min-width: 0;
	}

	.graus {
		font-weight: var(--fw-semibold);
		color: var(--c-ink-2);
		font-variant-numeric: tabular-nums;
	}
</style>
