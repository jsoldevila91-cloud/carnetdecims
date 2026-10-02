<script lang="ts">
	import {
		restriccioActiva,
		type CimCataleg,
		type DataISO,
		type TipusRestriccio
	} from '$lib/domain';
	import { comarcaPerSlug } from '$lib/data/catalog';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import Button from '../Button.svelte';
	import MarcaCim from '../MarcaCim.svelte';
	import { formatAltitude, formatDataLlarga } from '../format';
	import { NOM_ZONA } from '../zona';
	import { registrarHref } from '../fulls';

	/**
	 * Contingut del full del cim al mapa: dades bàsiques, segell d'essencial, estat de l'usuari
	 * (fet amb la data de la primera ascensió vàlida, o pendent), restricció vigent avui i accions.
	 */
	let {
		cim,
		fetEl,
		avui,
		onregistrar
	}: {
		cim: CimCataleg;
		/** Data de la primera ascensió vàlida; `null` = pendent. */
		fetEl: DataISO | null;
		avui: DataISO | null;
		onregistrar: (event: MouseEvent) => void;
	} = $props();

	const locale = getLocale();
	const comarca = $derived(comarcaPerSlug(cim.comarca));
	const zona = $derived(comarca?.slug === cim.zona ? null : NOM_ZONA[cim.zona]());
	const TIPUS: Record<TipusRestriccio, () => string> = {
		fauna: m.restriction_fauna,
		obres: m.restriction_obres,
		propietat: m.restriction_propietat,
		militar: m.restriction_militar,
		altres: m.restriction_altres
	};
	const vigents = $derived(
		avui === null
			? []
			: cim.restriccions.filter((r) => r.vigent !== false && restriccioActiva(r, avui))
	);
</script>

<div class="fitxa">
	{#if cim.essencial}
		<p class="segell mono"><span class="dia" aria-hidden="true"></span>{m.cim_essential()}</p>
	{/if}

	<dl class="dades mono">
		<div>
			<dt>{m.cim_altitude()}</dt>
			<dd>{formatAltitude(cim.altitud)} m</dd>
		</div>
		<div>
			<dt>{m.cim_comarca()}</dt>
			<dd>{[comarca?.nom ?? cim.comarca, zona].filter(Boolean).join(' · ')}</dd>
		</div>
		<div class="estat">
			<dt>{m.map_sheet_status()}</dt>
			<dd>
				<MarcaCim essencial={cim.essencial} fet={fetEl !== null} size={18} />
				{fetEl !== null
					? m.map_sheet_done_on({ date: formatDataLlarga(fetEl, locale) })
					: m.map_sheet_pending()}
			</dd>
		</div>
	</dl>

	{#if vigents.length > 0}
		<div class="restriccio" role="note">
			<p>
				<strong>{m.map_sheet_restriction()}</strong>: {vigents
					.map((r) => TIPUS[r.tipus]())
					.join(', ')}.
			</p>
			<p>{m.map_sheet_restriction_more()}</p>
		</div>
	{/if}

	<div class="accions">
		<Button href={href(`/cims/${cim.slug}`)} variant="outline" icon="peak" block>
			<span aria-hidden="true">{m.map_sheet_peak()}</span>
			<span class="sr-only">{m.map_sheet_peak_label({ cim: cim.nom })}</span>
		</Button>
		<Button
			href={registrarHref(cim.slug)}
			rel="nofollow"
			variant="stamp"
			icon="stamp"
			block
			onclick={onregistrar}
		>
			<span aria-hidden="true">{m.map_sheet_register()}</span>
			<span class="sr-only">{m.map_sheet_register_label({ cim: cim.nom })}</span>
		</Button>
	</div>
</div>

<style>
	.fitxa {
		display: grid;
		gap: var(--sp-4);
	}

	.segell {
		display: inline-flex;
		align-items: center;
		justify-self: start;
		gap: 6px;
		min-height: 1.75rem;
		padding: 0 var(--sp-2);
		border: var(--bw) solid var(--c-stamp-ink);
		border-radius: var(--r-xs);
		color: var(--c-stamp-ink);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--ls-caps);
		text-transform: uppercase;
	}

	.dia {
		width: 8px;
		height: 8px;
		transform: rotate(45deg);
		background: currentColor;
	}

	.dades {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--sp-3);
		margin: 0;
	}

	.dades div {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.dades .estat {
		grid-column: 1 / -1;
	}

	dt {
		font-size: var(--fs-2xs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--ls-caps);
		text-transform: uppercase;
		color: var(--c-ink-2);
	}

	dd {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		margin: 0;
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		overflow-wrap: anywhere;
	}

	.restriccio {
		display: grid;
		gap: var(--sp-1);
		padding: var(--sp-2) var(--sp-3);
		border: 1.5px solid var(--c-stamp-ink);
		border-radius: var(--r-sm);
		background: var(--c-stamp-soft);
		font-size: var(--fs-sm);
	}

	.accions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--sp-3);
	}
</style>
