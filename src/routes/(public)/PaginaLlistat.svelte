<script lang="ts">
	import { Breadcrumb, JsonLd, LlistaCims, PageMeta } from '$lib/ui';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import type { CimCataleg } from '$lib/domain';
	import { CIMS, agruparPerComarca, comarcaPerSlug, type LlistatId } from '$lib/data/catalog';
	import { llistatGraph } from '$lib/seo/jsonld';

	/**
	 * Plantilla comuna dels llistats curats (`/cims-essencials`, `/tresmils`, `/cims-mes-alts`):
	 * H1, introducció, llista enllaçada (SSR) i JSON-LD `CollectionPage` + `ItemList`.
	 * - `agrupat`: un H2 per comarca (enllaçat a la pàgina de comarca), com a `/cims-essencials`.
	 * - Si no, rànquing numerat amb la comarca de cada cim.
	 */
	let {
		id,
		cims,
		titol,
		metaTitol,
		descripcio,
		entradeta,
		nomCurt,
		agrupat = false
	}: {
		id: LlistatId;
		cims: readonly CimCataleg[];
		titol: string;
		metaTitol: string;
		descripcio: string;
		entradeta: string;
		/** Nom al breadcrumb (visible i JSON-LD). */
		nomCurt: string;
		agrupat?: boolean;
	} = $props();

	const locale = getLocale();
	const jsonLd = $derived(
		llistatGraph({
			id,
			cims,
			locale,
			title: metaTitol,
			description: descripcio,
			breadcrumbNames: { inici: m.nav_home(), llistat: nomCurt }
		})
	);
	const grups = $derived(agrupat ? agruparPerComarca(cims) : []);
	const nomComarca = (cim: CimCataleg) => comarcaPerSlug(cim.comarca)?.nom ?? null;

	// El catàleg encara és només d'essencials (fase 2): els rànquings són només entre essencials.
	const nomesEssencials = CIMS.every((c) => c.essencial);
</script>

<PageMeta title={metaTitol} description={descripcio} />
<JsonLd data={jsonLd} />

<header class="page-head">
	<Breadcrumb items={[{ name: m.nav_home(), href: href('/') }, { name: nomCurt }]} />
	<h1 class="x-wide">{titol}</h1>
	<p class="lede">{entradeta}</p>
	{#if nomesEssencials && !agrupat}
		<p class="draft" role="note">{m.catalog_only_essentials({ count: CIMS.length })}</p>
	{/if}
</header>

{#if agrupat}
	<div class="grups">
		{#each grups as { comarca, cims: delGrup } (comarca.slug)}
			<section class="grup" aria-labelledby="comarca-{comarca.slug}">
				<h2 id="comarca-{comarca.slug}" class="x-wide">
					<a href={href(`/comarques/${comarca.slug}`)}>{comarca.nom}</a>
					<span class="count mono">{delGrup.length}</span>
				</h2>
				<LlistaCims cims={delGrup} />
			</section>
		{/each}
	</div>
{:else}
	<LlistaCims {cims} ordenada meta={nomComarca} />
{/if}

<nav class="altres" aria-label={m.explore_label()}>
	<a href={href('/comarques')}>{m.explore_comarques()}</a>
	{#if id !== 'essencials'}<a href={href('/cims-essencials')}>{m.explore_essentials()}</a>{/if}
	{#if id !== 'tresmils'}<a href={href('/tresmils')}>{m.explore_tresmils()}</a>{/if}
	{#if id !== 'mes-alts'}<a href={href('/cims-mes-alts')}>{m.explore_highest()}</a>{/if}
	<a href={href('/cims')}>{m.explore_all()}</a>
</nav>

<style>
	.page-head {
		margin-bottom: var(--sp-6);
	}

	h1 {
		margin-top: var(--sp-1);
		font-size: clamp(var(--fs-lg), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1;
		overflow-wrap: anywhere;
	}

	.lede {
		margin-top: var(--sp-3);
		color: var(--c-ink-2);
		max-width: 60ch;
	}

	.draft {
		margin-top: var(--sp-4);
		padding: var(--sp-2) var(--sp-3);
		border-left: 3px solid var(--c-kraft);
		background: var(--c-paper-2);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
		max-width: 70ch;
	}

	.grups {
		display: grid;
		gap: var(--sp-8) var(--sp-10);
	}

	h2 {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--sp-3);
		margin-bottom: var(--sp-1);
		padding-top: var(--sp-2);
		border-top: var(--bw) solid var(--c-line);
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
	}

	h2 a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		color: var(--c-stamp-ink);
		text-decoration: none;
	}

	h2 a:hover {
		text-decoration: underline;
	}

	.count {
		font-size: var(--fs-xs);
		font-weight: var(--fw-medium);
		color: var(--c-ink-2);
	}

	.altres {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2) var(--sp-5);
		margin-top: var(--sp-10);
		padding-top: var(--sp-3);
		border-top: var(--bw) solid var(--c-line);
	}

	.altres a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		color: var(--c-stamp-ink);
	}

	@media (min-width: 48rem) {
		.grups {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 72rem) {
		.grups {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
