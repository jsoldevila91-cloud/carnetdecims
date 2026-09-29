<script lang="ts" module>
	import { m } from '$lib/paraglide/messages';
	import type { ClauPagina } from '$lib/content/types';

	/** Nom curt de cada pàgina (molla de pa visible i JSON-LD, targetes del hub, peu). */
	export const NOM_PAGINA: Record<ClauPagina, () => string> = {
		repte: m.content_name_repte,
		normativa: m.content_name_normativa,
		comValidar: m.content_name_com_validar,
		repteInfantil: m.content_name_repte_infantil,
		metodologia: m.content_name_metodologia,
		sobreElProjecte: m.content_name_sobre,
		avisLegal: m.content_name_avis_legal,
		privacitat: m.content_name_privacitat
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Breadcrumb, Icon, JsonLd, PageMeta, TextEnLinia, formatDataLlarga } from '$lib/ui';
	import { esUrlExterna } from '$lib/ui/text-en-linia';
	import { ampleParaulaMesLlargaEm, ampleTextEm } from '$lib/ui/titol-ample';
	import { getLocale, href } from '$lib/i18n';
	import { CONTINGUTS, PAGINES_CONTINGUT } from '$lib/content';
	import { paginaGraph } from '$lib/seo/jsonld';

	/**
	 * Plantilla de les pàgines de text (hub del repte, normativa, legals…): pinta la
	 * `PaginaContingut` de l'idioma actual amb molla de pa, H1, entradeta, índex de seccions,
	 * seccions (H2 + blocs), preguntes freqüents, fonts i data de revisió, més meta i JSON-LD.
	 * - `destacat`: contingut extra entre l'entradeta i les seccions (p. ex. targetes del hub).
	 */
	let { clau, destacat }: { clau: ClauPagina; destacat?: Snippet } = $props();

	const locale = getLocale();
	const pagina = $derived(CONTINGUTS[clau][locale]);
	const path = $derived(PAGINES_CONTINGUT[clau]);

	/** Les subpàgines del repte pengen del hub a la molla de pa. */
	const dinsRepte = $derived(clau !== 'repte' && path.startsWith(PAGINES_CONTINGUT.repte + '/'));
	const crumbs = $derived([
		{ name: m.nav_home(), href: href('/') },
		...(dinsRepte ? [{ name: NOM_PAGINA.repte(), href: href(PAGINES_CONTINGUT.repte) }] : []),
		{ name: NOM_PAGINA[clau]() }
	]);

	const jsonLd = $derived(
		paginaGraph({
			pagina,
			locale,
			path,
			breadcrumbNames: {
				inici: m.nav_home(),
				repte: NOM_PAGINA.repte(),
				pagina: NOM_PAGINA[clau]()
			}
		})
	);

	const ID_FAQ = 'preguntes-frequents';
	const ID_FONTS = 'fonts';
	const faq = $derived(pagina.faq ?? []);
	const fonts = $derived(pagina.fonts ?? []);

	/** Índex de seccions (amb les preguntes freqüents) si la pàgina en té prou per orientar-s'hi. */
	const entradesIndex = $derived([
		...pagina.seccions.map((s) => ({ id: s.id, titol: s.titol })),
		...(faq.length ? [{ id: ID_FAQ, titol: m.content_faq_title() }] : [])
	]);
	const ambIndex = $derived(entradesIndex.length >= 3);

	// Mida del H1 perquè la paraula més llarga hi càpiga sencera (vegeu `titol-ample.ts`).
	const paraulaEm = $derived(ampleParaulaMesLlargaEm(pagina.h1));
	const titolEm = $derived(ampleTextEm(pagina.h1));
</script>

<PageMeta
	title={pagina.title}
	description={pagina.description}
	noindex={pagina.noindex}
	type="article"
/>
<JsonLd data={jsonLd} />

<article class="contingut">
	<header class="page-head">
		<Breadcrumb items={crumbs} />
		<h1 class="x-wide" style:--paraula-em={paraulaEm} style:--titol-em={titolEm}>{pagina.h1}</h1>
		<p class="lede"><TextEnLinia text={pagina.intro} /></p>
		<p class="updated mono">
			<time datetime={pagina.actualitzat}>
				{m.content_updated({ date: formatDataLlarga(pagina.actualitzat, locale) })}
			</time>
		</p>
	</header>

	{#if destacat}
		<div class="destacat">{@render destacat()}</div>
	{/if}

	<div class={['cos', { 'amb-index': ambIndex }]}>
		{#if ambIndex}
			<nav class="index" aria-labelledby="index-titol">
				<p id="index-titol" class="label">{m.content_toc_label()}</p>
				<ol>
					{#each entradesIndex as e (e.id)}
						<li><a href="#{e.id}">{e.titol}</a></li>
					{/each}
				</ol>
			</nav>
		{/if}

		<div class="text">
			{#each pagina.seccions as seccio (seccio.id)}
				<section id={seccio.id} aria-labelledby="{seccio.id}-titol">
					<h2 id="{seccio.id}-titol" class="x-wide">{seccio.titol}</h2>
					{#each seccio.blocs as bloc, i (i)}
						{#if bloc.tipus === 'paragraf'}
							<p><TextEnLinia text={bloc.text} /></p>
						{:else if bloc.tipus === 'llista'}
							<svelte:element this={bloc.ordenada ? 'ol' : 'ul'} class="llista">
								{#each bloc.items as item, j (j)}
									<li><TextEnLinia text={item} /></li>
								{/each}
							</svelte:element>
						{:else if bloc.tipus === 'avis'}
							<div class={['avis', bloc.to]} role="note">
								<p class="avis-label label">
									{bloc.to === 'alerta' ? m.content_note_alert() : m.content_note_info()}
								</p>
								<p><TextEnLinia text={bloc.text} /></p>
							</div>
						{/if}
					{/each}
				</section>
			{/each}

			{#if faq.length}
				<section id={ID_FAQ} class="faq" aria-labelledby="{ID_FAQ}-titol">
					<h2 id="{ID_FAQ}-titol" class="x-wide">{m.content_faq_title()}</h2>
					{#each faq as p, i (i)}
						<details>
							<summary>{p.pregunta}</summary>
							<div class="resposta"><p><TextEnLinia text={p.resposta} /></p></div>
						</details>
					{/each}
				</section>
			{/if}

			{#if fonts.length}
				<section id={ID_FONTS} class="fonts" aria-labelledby="{ID_FONTS}-titol">
					<h2 id="{ID_FONTS}-titol" class="label">{m.content_sources_title()}</h2>
					<ul>
						{#each fonts as f (f.url)}
							<li>
								{#if esUrlExterna(f.url)}
									<a href={f.url} rel="external noopener" target="_blank">
										<span class="nom-font">{f.nom}</span><Icon
											name="external"
											size={13}
											strokeWidth={2}
										/>
										<span class="sr-only">{m.content_new_tab()}</span>
									</a>
								{:else}
									{f.nom}
								{/if}
								{#if f.consultat}
									<time class="consultat" datetime={f.consultat}>
										{m.content_source_consulted({
											date: formatDataLlarga(f.consultat, locale)
										})}
									</time>
								{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/if}
		</div>
	</div>
</article>

<style>
	.contingut {
		container-type: inline-size;
	}

	.page-head {
		margin-bottom: var(--sp-6);
	}

	h1 {
		margin-top: var(--sp-1);
		/*
		 * Com a la fitxa de cim: la més petita de (a) la paraula més llarga cap sencera, (b) el
		 * títol sencer en ~4 línies, (c) un sostre de 10cqi i 2,25rem. Mínim llegible 1,25rem.
		 */
		font-size: clamp(
			1.25rem,
			min(
				100cqi / (var(--paraula-em, 10) * 1.04),
				400cqi / (var(--titol-em, 10) * 1.25),
				10cqi,
				var(--fs-2xl)
			),
			var(--fs-2xl)
		);
		font-weight: var(--fw-black);
		line-height: 1;
		letter-spacing: -0.005em;
		overflow-wrap: anywhere;
	}

	.lede {
		margin-top: var(--sp-3);
		max-width: 62ch;
		font-size: var(--fs-md);
		color: var(--c-ink-2);
	}

	.updated {
		margin-top: var(--sp-3);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.destacat {
		margin-bottom: var(--sp-8);
	}

	.cos {
		display: grid;
		gap: var(--sp-6);
	}

	/* Índex de seccions: full de carnet discret al capdamunt (mòbil) o columna fixa (escriptori). */
	.index {
		align-self: start;
		padding: var(--sp-3) var(--sp-4);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-lg);
		background: var(--c-card);
		box-shadow: var(--sh-1);
	}

	.index ol {
		margin: var(--sp-2) 0 0;
		padding: 0;
		list-style: none;
		counter-reset: idx;
	}

	.index li {
		counter-increment: idx;
		border-top: 1px dashed var(--c-rule);
	}

	.index a {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		min-height: var(--tap);
		padding: var(--sp-1) 0;
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		text-decoration: none;
	}

	.index a::before {
		content: counter(idx, decimal-leading-zero);
		flex: none;
		min-width: 2ch;
		color: var(--c-stamp-ink);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
	}

	.index a:hover {
		text-decoration: underline;
	}

	.text {
		display: grid;
		gap: var(--sp-8);
		min-width: 0;
		max-width: 68ch;
	}

	section {
		display: grid;
		gap: var(--sp-3);
	}

	h2 {
		padding-top: var(--sp-2);
		border-top: var(--bw) solid var(--c-line);
		font-size: var(--fs-md);
		font-weight: var(--fw-black);
		line-height: var(--lh-snug);
		overflow-wrap: break-word;
	}

	.llista {
		display: grid;
		gap: var(--sp-2);
		margin: 0;
		padding-left: var(--sp-6);
	}

	.llista li::marker {
		color: var(--c-stamp-ink);
		font-weight: var(--fw-bold);
	}

	.avis {
		padding: var(--sp-3) var(--sp-4);
		border: var(--bw) solid var(--c-line);
		border-left-width: 6px;
		border-radius: var(--r-md);
		background: var(--c-paper-2);
	}

	.avis.alerta {
		border-color: var(--c-stamp-ink);
		background: var(--c-stamp-soft);
	}

	.avis-label {
		margin-bottom: var(--sp-1);
		color: var(--c-ink);
	}

	.avis.alerta .avis-label {
		color: var(--c-stamp-ink);
	}

	.faq details {
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-card);
	}

	.faq summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-3);
		min-height: var(--tap);
		padding: var(--sp-2) var(--sp-4);
		cursor: pointer;
		font-weight: var(--fw-bold);
		list-style: none;
	}

	.faq summary::-webkit-details-marker {
		display: none;
	}

	.faq summary::after {
		content: '+';
		flex: none;
		color: var(--c-stamp-ink);
		font-family: var(--font-mono);
		font-size: var(--fs-lg);
		line-height: 1;
	}

	.faq details[open] summary::after {
		content: '−';
	}

	.faq details[open] summary {
		border-bottom: 1px dashed var(--c-rule);
	}

	.resposta {
		padding: var(--sp-3) var(--sp-4) var(--sp-4);
		color: var(--c-ink-2);
	}

	.fonts {
		gap: var(--sp-2);
		font-size: var(--fs-sm);
	}

	.fonts h2 {
		border-top-width: 1px;
		border-top-style: dashed;
		border-top-color: var(--c-rule);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
	}

	.fonts ul {
		display: grid;
		gap: var(--sp-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.fonts a {
		color: var(--c-stamp-ink);
		font-weight: var(--fw-semibold);
		text-decoration: none;
	}

	.fonts a .nom-font {
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.fonts a :global(.icon) {
		display: inline;
		margin-left: 2px;
		vertical-align: -0.1em;
	}

	.consultat {
		display: block;
		color: var(--c-ink-2);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
	}

	@media (min-width: 60rem) {
		.cos.amb-index {
			grid-template-columns: 15rem minmax(0, 1fr);
			gap: var(--sp-10);
		}

		.amb-index .index {
			position: sticky;
			top: calc(var(--sp-16) + var(--safe-top));
			/* Índexs llargs (normativa): desplaçament propi si no caben a la pantalla. */
			max-height: calc(100dvh - var(--sp-16) - var(--safe-top) - var(--sp-4));
			overflow-y: auto;
			overscroll-behavior: contain;
		}
	}
</style>
