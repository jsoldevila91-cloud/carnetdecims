<script lang="ts">
	import type { CimCataleg } from '$lib/domain';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import { formatAltitude } from './format';
	import DificultatBadge, { type DificultatResum } from './fitxa/DificultatBadge.svelte';

	/**
	 * Llista de fitxes de cim (nom amb el rombe d'essencial + altitud), amb enllaços a les fitxes
	 * al HTML (SSR). Ús: comarques, llistats curats i `/cims`.
	 * - `ordenada`: `<ol>` amb el número de posició visible (rànquings).
	 * - `numeros`: número visible per cim (p. ex. el del marcador al mapa de comarca).
	 * - `meta`: text secundari opcional (p. ex. la comarca), abans de l'altitud.
	 * - `amagats`: slugs que no es mostren (filtres en client); el HTML inicial els conté tots.
	 * - `dificultats`: dificultat orientativa (ruta normal) dels cims amb contingut, per slug
	 *   (mapa lleuger del `+page.server.ts`, `$lib/server/dificultats`).
	 */
	let {
		cims,
		ordenada = false,
		numeros,
		meta,
		amagats,
		dificultats
	}: {
		cims: readonly CimCataleg[];
		ordenada?: boolean;
		numeros?: ReadonlyMap<string, number>;
		meta?: (cim: CimCataleg) => string | null;
		amagats?: ReadonlySet<string>;
		dificultats?: Readonly<Record<string, DificultatResum>>;
	} = $props();
</script>

{#snippet fila(cim: CimCataleg, num: number | undefined)}
	<a href={href(`/cims/${cim.slug}`)}>
		{#if num !== undefined}
			<span class={['num', 'mono', { essencial: cim.essencial }]} aria-hidden="true">{num}</span>
		{/if}
		<span class="nom">
			{#if cim.essencial}<span class="diamond" aria-hidden="true"></span>{/if}
			<span>
				{cim.nom}
				{#if cim.essencial}<span class="sr-only">({m.peaks_essential_short()})</span>{/if}
			</span>
		</span>
		{#if dificultats?.[cim.slug]}
			<span class="dif"
				><DificultatBadge dificultat={dificultats[cim.slug]} variant="compacte" /></span
			>
		{/if}
		<span class="meta mono">
			{[meta?.(cim), `${formatAltitude(cim.altitud)} m`].filter(Boolean).join(' · ')}
		</span>
	</a>
{/snippet}

<svelte:element this={ordenada ? 'ol' : 'ul'} class={['llista', { numerada: ordenada || numeros }]}>
	{#each cims as cim, i (cim.slug)}
		<li hidden={amagats?.has(cim.slug)}>
			{@render fila(cim, ordenada ? i + 1 : numeros?.get(cim.slug))}
		</li>
	{/each}
</svelte:element>

<style>
	.llista {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* Separador entre elements visibles (els amagats pel filtre no compten) */
	li:not([hidden]) ~ li:not([hidden]) {
		border-top: 1px dashed var(--c-rule);
	}

	a {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 var(--sp-3);
		min-height: var(--tap);
		padding: var(--sp-2) 0;
		text-decoration: none;
	}

	a:hover .nom > span:last-child {
		text-decoration: underline;
	}

	.nom {
		display: inline-flex;
		align-items: baseline;
		gap: var(--sp-2);
		flex: 1 1 auto;
		min-width: 0;
		font-weight: var(--fw-bold);
		overflow-wrap: anywhere;
	}

	.diamond {
		display: inline-block;
		flex: none;
		width: 8px;
		height: 8px;
		transform: translateY(-1px) rotate(45deg);
		background: var(--c-stamp);
	}

	.num {
		display: inline-grid;
		place-items: center;
		flex: none;
		align-self: center;
		min-width: 1.5rem;
		height: 1.5rem;
		padding: 0 4px;
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-full);
		font-size: var(--fs-2xs);
		font-weight: var(--fw-bold);
		color: var(--c-ink);
		background: var(--c-card);
	}

	.num.essencial {
		border-color: var(--c-stamp);
		background: var(--c-stamp);
		color: var(--c-on-stamp);
	}

	.dif {
		flex: none;
	}

	.meta {
		flex: none;
		margin-left: auto;
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
		white-space: nowrap;
	}
</style>
