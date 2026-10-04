<script lang="ts" module>
	import type { ClauDificultat, DadaDificultat, NivellDificultat } from '$lib/domain';
	import { m } from '$lib/paraglide/messages';

	/**
	 * Dades mínimes per pintar el distintiu. Les llistes en reben només `nivell`, `clau` i
	 * `aproximada` (mapa lleuger calculat al servidor); la fitxa, també `dadesQueFalten`.
	 */
	export interface DificultatResum {
		nivell: NivellDificultat;
		clau: ClauDificultat;
		aproximada: boolean;
		dadesQueFalten?: readonly DadaDificultat[];
	}

	/** Nom visible de cada nivell ("Fàcil", "Moderada"…). */
	export const NOM_DIFICULTAT: Readonly<Record<ClauDificultat, () => string>> = {
		facil: m.cim_difficulty_facil,
		moderada: m.cim_difficulty_moderada,
		exigent: m.cim_difficulty_exigent,
		'molt-exigent': m.cim_difficulty_molt_exigent
	};

	const NOM_DADA: Readonly<Record<DadaDificultat, () => string>> = {
		desnivell: m.cim_difficulty_data_desnivell,
		distancia: m.cim_difficulty_data_distancia,
		temps: m.cim_difficulty_data_temps,
		tecnicitat: m.cim_difficulty_data_tecnicitat
	};

	/** Quatre cims (triangles) en fila: plens fins al nivell, buits (només vora) la resta. */
	const PICS = [0, 1, 2, 3].map((i) => {
		const x = i * 11 + 1;
		return `M${x} 11 L${x + 5} 2 L${x + 10} 11 Z`;
	});
</script>

<script lang="ts">
	import { getLocale, href } from '$lib/i18n';
	import { PAGINES_CONTINGUT } from '$lib/content/types';

	/**
	 * "Dificultat orientativa" de Carnet de Cims (estimació pròpia, **no és el MIDE**).
	 * El nivell sempre és text ("Moderada"); els quatre pics (plens / buits) el reforcen amb la
	 * forma, i el color només hi afegeix un tercer senyal.
	 * - `complet` (fitxa i targetes de ruta): etiqueta, nivell, "aprox." amb l'explicació de les
	 *   dades que falten en un `<details>`, avís "no és el MIDE" i enllaç a la metodologia.
	 * - `compacte` (llistes de cims, dins d'un enllaç): només els pics i el nivell, sense cap
	 *   element interactiu; el nom accessible inclou "Dificultat orientativa".
	 */
	let {
		dificultat,
		variant = 'complet',
		abast
	}: {
		dificultat: DificultatResum;
		variant?: 'complet' | 'compacte';
		/** Text després de l'etiqueta, p. ex. "ruta normal" a la capçalera de la fitxa. */
		abast?: string;
	} = $props();

	const locale = getLocale();
	const nom = $derived(NOM_DIFICULTAT[dificultat.clau]());
	const metodologiaHref = `${href(PAGINES_CONTINGUT.metodologia)}#dificultat-orientativa`;

	const dadesQueFalten = $derived.by(() => {
		const dades = (dificultat.dadesQueFalten ?? []).map((d) => NOM_DADA[d]?.()).filter(Boolean);
		if (dades.length === 0) return m.cim_difficulty_missing_generic();
		const llista = new Intl.ListFormat(locale, { type: 'conjunction' }).format(dades as string[]);
		return m.cim_difficulty_missing({ dades: llista });
	});
</script>

{#snippet pics()}
	<svg class="pics" viewBox="0 0 45 13" width="40" height="12" aria-hidden="true" focusable="false">
		{#each PICS as d, i (i)}
			<path {d} class={{ ple: i < dificultat.nivell }} />
		{/each}
	</svg>
{/snippet}

{#if variant === 'compacte'}
	<span class="dif-mini nivell-{dificultat.nivell}">
		{@render pics()}
		<span class="sr-only">{m.cim_difficulty_list_sr({ nivell: nom })}</span>
		<span aria-hidden="true">{nom}</span>
		{#if dificultat.aproximada}
			<span class="aprox-mini" aria-hidden="true">{m.cim_difficulty_approx()}</span>
			<span class="sr-only">({m.cim_difficulty_approx_sr()})</span>
		{/if}
	</span>
{:else}
	<div class="dif nivell-{dificultat.nivell}">
		<p class="fila">
			<span class="label">
				{m.cim_difficulty_label()}{#if abast}<span class="abast">· {abast}</span>{/if}
			</span>
			<span class="nivell">
				{@render pics()}
				<strong>{nom}</strong>
				<span class="sr-only">({m.cim_difficulty_level_sr({ nivell: dificultat.nivell })})</span>
				{#if dificultat.aproximada}
					<span class="aprox" aria-hidden="true">{m.cim_difficulty_approx()}</span>
					<span class="sr-only">({m.cim_difficulty_approx_sr()})</span>
				{/if}
			</span>
		</p>
		<p class="peu">
			<span>{m.cim_difficulty_not_mide()}</span>
			<a href={metodologiaHref}>{m.cim_difficulty_how()}</a>
		</p>
		{#if dificultat.aproximada}
			<details class="falten">
				<summary>{m.cim_difficulty_why_approx()}</summary>
				<p>{dadesQueFalten}</p>
			</details>
		{/if}
	</div>
{/if}

<style>
	/* Color de reforç per nivell (el text i la forma ja diuen el nivell). Contrast ≥ 3:1. */
	.nivell-1 {
		--dif-c: var(--c-pine);
	}
	.nivell-2 {
		--dif-c: var(--c-blue);
	}
	.nivell-3 {
		--dif-c: var(--c-ink);
	}
	.nivell-4 {
		--dif-c: var(--c-stamp-ink);
	}

	.pics {
		flex: none;
		overflow: visible;
	}

	.pics path {
		fill: none;
		stroke: var(--c-ink-2);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}

	.pics path.ple {
		fill: var(--dif-c);
		stroke: var(--dif-c);
	}

	/* ---------- Complet ---------- */
	.dif {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.fila {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--sp-1) var(--sp-2);
	}

	/* "· ruta normal" sempre junt (sense el punt a final de línia a 320 px). */
	.abast {
		margin-left: 0.4em;
		text-transform: none;
		letter-spacing: 0;
		white-space: nowrap;
	}

	.nivell {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 2px var(--sp-2);
		border: var(--bw) solid var(--dif-c);
		border-radius: var(--r-xs);
		background: var(--c-card);
		font-size: var(--fs-sm);
		line-height: var(--lh-snug);
		white-space: nowrap;
	}

	.nivell strong {
		font-weight: var(--fw-black);
	}

	.aprox {
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		color: var(--c-ink-2);
	}

	.peu {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0 var(--sp-2);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	/* Objectiu tàctil ≥ 24 px (WCAG 2.2 AA, 2.5.8) sense eixamplar la capçalera. */
	.peu a {
		display: inline-flex;
		align-items: center;
		min-height: 24px;
		color: var(--c-stamp-ink);
		font-weight: var(--fw-semibold);
		text-underline-offset: 2px;
	}

	.falten summary {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-1);
		min-height: 24px;
		cursor: pointer;
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		color: var(--c-ink-2);
		list-style: none;
		text-decoration: underline dotted;
		text-underline-offset: 2px;
	}

	.falten summary::-webkit-details-marker {
		display: none;
	}

	.falten summary::before {
		content: '+';
		color: var(--c-stamp-ink);
		font-family: var(--font-mono);
		text-decoration: none;
	}

	.falten[open] summary::before {
		content: '−';
	}

	.falten p {
		margin-top: 2px;
		padding: var(--sp-1) var(--sp-2);
		border-left: 3px solid var(--c-kraft);
		background: var(--c-paper-2);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
		max-width: 60ch;
	}

	/* ---------- Compacte (llistes) ---------- */
	.dif-mini {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		color: var(--c-ink-2);
		white-space: nowrap;
	}

	.aprox-mini {
		font-weight: var(--fw-medium);
	}
</style>
