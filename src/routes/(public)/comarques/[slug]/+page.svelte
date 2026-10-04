<script lang="ts">
	import { Breadcrumb, Card, JsonLd, LlistaCims, MapaMarcadors, NOM_ZONA, PageMeta } from '$lib/ui';
	import { ampleParaulaMesLlargaEm, ampleTextEm } from '$lib/ui/titol-ample';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import { CIMS } from '$lib/data/catalog';
	import { comarcaGraph } from '$lib/seo/jsonld';
	import { seoComarca } from '$lib/seo/comarca';
	import { comarcaIndexable } from '$lib/seo/indexabilitat';
	import { mapaEstaticComarca } from '$lib/platform/mapa-estatic';

	let { data } = $props();

	const locale = getLocale();
	const comarca = $derived(data.comarca);
	const cims = $derived(data.cims);

	const seo = $derived(seoComarca(comarca, cims, locale));
	// Contingut prim (1–2 cims): `noindex` i fora del sitemap, amb el mateix criteri (docs/02 §4.2).
	const indexable = $derived(comarcaIndexable(cims.length));
	const jsonLd = $derived(
		comarcaGraph({
			comarca,
			cims,
			locale,
			title: seo.title,
			description: seo.description,
			breadcrumbNames: { inici: m.nav_home(), comarques: m.nav_comarques() }
		})
	);
	const crumbs = $derived([
		{ name: m.nav_home(), href: href('/') },
		{ name: m.nav_comarques(), href: href('/comarques') },
		{ name: comarca.nom }
	]);

	// Mida del H1 com a la fitxa de cim (noms llargs: "Cims de la Conca de Barberà").
	const paraulaEm = $derived(ampleParaulaMesLlargaEm(seo.h1));
	const nomEm = $derived(ampleTextEm(seo.h1));

	const essencials = $derived(cims.filter((c) => c.essencial));
	const altres = $derived(cims.filter((c) => !c.essencial));
	// Número de cada cim (de més alt a més baix): el mateix a la llista i al marcador del mapa.
	const numeros = $derived(new Map(cims.map((c, i) => [c.slug, i + 1])));

	// Andorra i la Catalunya Nord són alhora "comarca" i zona: no es repeteix.
	const zona = $derived(comarca.slug === comarca.zona ? null : NOM_ZONA[comarca.zona]());
	const resum = $derived(
		[
			cims.length === 1 ? m.count_cims_one() : m.count_cims({ count: cims.length }),
			essencials.length === 1
				? m.count_essentials_one()
				: m.count_essentials({ count: essencials.length }),
			zona
		]
			.filter(Boolean)
			.join(' · ')
	);

	// El catàleg encara és només d'essencials (fase 2): s'avisa perquè el recompte no enganyi.
	const nomesEssencials = CIMS.every((c) => c.essencial);

	const MAPA_AMPLE = 640;
	const MAPA_ALT = 480;
	const mapa = $derived(mapaEstaticComarca(cims, { ample: MAPA_AMPLE, alt: MAPA_ALT }));
</script>

<PageMeta title={seo.title} description={seo.description} noindex={!indexable} />
<JsonLd data={jsonLd} />

<article class="comarca">
	<div class="col-main">
		<Card as="header" padding="lg" class="head">
			<Breadcrumb items={crumbs} />
			<h1 class="x-wide" style:--paraula-em={paraulaEm} style:--nom-em={nomEm}>{seo.h1}</h1>
			<p class="sub mono">{resum}</p>
			<div class="intro">
				{#each seo.intro as p (p)}
					<p>{p}</p>
				{/each}
			</div>
			{#if nomesEssencials}
				<p class="draft" role="note">{m.catalog_only_essentials({ count: CIMS.length })}</p>
			{/if}
		</Card>

		{#if mapa}
			<section class="blk" aria-labelledby="mapa">
				<h2 id="mapa" class="x-wide">{m.comarca_map_title()}</h2>
				<MapaMarcadors
					{mapa}
					{cims}
					{numeros}
					alt={seo.mapAlt}
					ample={MAPA_AMPLE}
					altura={MAPA_ALT}
					etiqueta={m.comarca_map_markers()}
				/>
				<p class="note">{m.comarca_map_hint()}</p>
			</section>
		{/if}
	</div>

	<div class="col-side">
		{#if essencials.length > 0}
			<section class="blk" aria-labelledby="essencials">
				<h2 id="essencials" class="x-wide">
					{m.comarca_essentials_title({ comarca_de: seo.comarcaDe })}
				</h2>
				<LlistaCims cims={essencials} {numeros} dificultats={data.dificultats} />
			</section>
		{/if}

		{#if altres.length > 0}
			<section class="blk" aria-labelledby="altres">
				<h2 id="altres" class="x-wide">
					{m.comarca_others_title({ comarca_de: seo.comarcaDe })}
				</h2>
				<LlistaCims cims={altres} {numeros} dificultats={data.dificultats} />
			</section>
		{/if}

		<section class="blk" aria-labelledby="properes">
			<h2 id="properes" class="x-wide">{m.comarca_nearby_title()}</h2>
			{#if data.properes.length > 0}
				<ul class="links">
					{#each data.properes as c (c.slug)}
						<li><a href={href(`/comarques/${c.slug}`)}>{c.nom}</a></li>
					{/each}
				</ul>
			{/if}
			<a class="more" href={href('/comarques')}>{m.comarca_all_link()}</a>
		</section>
	</div>
</article>

<style>
	.comarca {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--sp-8);
	}

	.col-main,
	.col-side {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--sp-8);
		align-content: start;
		min-width: 0;
	}

	.comarca :global(.head) {
		min-width: 0;
		container-type: inline-size;
		padding: var(--sp-5) var(--sp-4);
	}

	h1 {
		margin-top: var(--sp-1);
		/* Mateix criteri que el H1 de la fitxa de cim (vegeu-la): la paraula més llarga sencera,
		   el text en ~3 línies i un sostre compacte de 11cqi. */
		font-size: clamp(
			1.25rem,
			min(
				100cqi / (var(--paraula-em, 10) * 1.04),
				300cqi / (var(--nom-em, 10) * 1.25),
				11cqi,
				var(--fs-3xl)
			),
			var(--fs-3xl)
		);
		font-weight: var(--fw-black);
		line-height: 0.95;
		letter-spacing: -0.01em;
		overflow-wrap: anywhere;
	}

	.sub {
		margin-top: var(--sp-2);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	.intro {
		display: grid;
		gap: var(--sp-2);
		margin-top: var(--sp-4);
		max-width: 60ch;
	}

	.draft {
		margin-top: var(--sp-4);
		padding: var(--sp-2) var(--sp-3);
		border-left: 3px solid var(--c-kraft);
		background: var(--c-paper-2);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	.blk h2 {
		margin-bottom: var(--sp-3);
		padding-top: var(--sp-2);
		border-top: var(--bw) solid var(--c-line);
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
	}

	.note {
		margin-top: var(--sp-1);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
		margin: 0 0 var(--sp-2);
		padding: 0;
		list-style: none;
	}

	.links a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		padding: 0 var(--sp-3);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-card);
		box-shadow: var(--sh-1);
		font-size: var(--fs-sm);
		font-weight: var(--fw-bold);
		text-decoration: none;
	}

	.links a:hover {
		text-decoration: underline;
	}

	.more {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		color: var(--c-stamp-ink);
	}

	@media (min-width: 30rem) {
		.comarca :global(.head) {
			padding: var(--sp-6);
		}
	}

	@media (min-width: 60rem) {
		.comarca {
			grid-template-columns: minmax(0, 1fr) 20rem;
			gap: var(--sp-10);
		}
	}
</style>
