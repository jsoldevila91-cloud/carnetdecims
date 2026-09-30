<script lang="ts">
	import type { CimCataleg } from '$lib/domain';
	import { comarcaPerSlug } from '$lib/data/catalog';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import { obrirRegistre, registrarHref } from './fulls';
	import { formatAltitude, formatKm } from './format';

	/**
	 * Una essencial pendent: casella buida (forat de segell), nom enllaçat a la fitxa, altitud i
	 * comarca, distància (si s'ha ordenat per proximitat) i enllaç per registrar-la.
	 */
	let { cim, distanciaKm = null }: { cim: CimCataleg; distanciaKm?: number | null } = $props();

	const locale = getLocale();
	const comarca = $derived(comarcaPerSlug(cim.comarca)?.nom ?? cim.comarca);
</script>

<div class="fila">
	<span class="slot" aria-hidden="true"><i class="dia"></i></span>
	<div class="cos">
		<a class="nom" href={href(`/cims/${cim.slug}`)}>{cim.nom}</a>
		<small class="mono">
			{m.ess_peak_meta({ alt: formatAltitude(cim.altitud), comarca })}
		</small>
	</div>
	{#if distanciaKm !== null && Number.isFinite(distanciaKm)}
		<span class="km mono">
			<span aria-hidden="true">{m.ess_distance({ km: formatKm(distanciaKm, locale) })}</span>
			<span class="sr-only">{m.ess_distance_label({ km: formatKm(distanciaKm, locale) })}</span>
		</span>
	{/if}
	<a
		class="reg"
		href={registrarHref(cim.slug)}
		rel="nofollow"
		aria-label={m.ess_register_label({ cim: cim.nom })}
		onclick={(e) => obrirRegistre(e, cim.slug)}>{m.ess_register()}</a
	>
</div>

<style>
	.fila {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		padding: var(--sp-2) 0;
		border-bottom: 1px dashed var(--c-rule);
	}

	.slot {
		display: grid;
		place-items: center;
		width: 2.125rem;
		height: 2.125rem;
		flex: none;
		border: 1.5px dashed var(--c-stamp-ink);
		border-radius: 50%;
		color: var(--c-stamp-ink);
	}

	.dia {
		display: block;
		width: 8px;
		height: 8px;
		background: currentColor;
		transform: rotate(45deg);
	}

	.cos {
		display: grid;
		min-width: 0;
		flex: 1;
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

	.km {
		flex: none;
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}

	.reg {
		display: inline-grid;
		place-items: center;
		flex: none;
		min-height: var(--tap);
		padding: 0 var(--sp-3);
		border: var(--bw) solid var(--c-stamp-ink);
		border-radius: var(--r-md);
		color: var(--c-stamp-ink);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		text-decoration: none;
	}
</style>
