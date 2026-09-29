<script lang="ts">
	import { Button, Card, Icon, JsonLd, PageMeta, Segell, formatAltitude, romanPage } from '$lib/ui';
	import { getLocale, href } from '$lib/i18n';
	import { homeGraph } from '$lib/seo/jsonld';
	import { m } from '$lib/paraglide/messages';
	import { cimPerSlug, cimsPerComarca, comarcaPerSlug, comarquesAmbCims } from '$lib/data/catalog';
	import { comarcaIndexable } from '$lib/seo/indexabilitat';
	import { nomAmbDe } from '$lib/seo/fitxa-cim';
	import { PAGINES_CONTINGUT } from '$lib/content/types';
	import type { CimCataleg } from '$lib/domain';

	const jsonLd = homeGraph({
		locale: getLocale(),
		title: m.home_meta_title(),
		description: m.home_meta_description(),
		orgDescription: m.seo_org_description()
	});

	const explora = [
		{ path: '/comarques', text: m.explore_comarques },
		{ path: '/cims-essencials', text: m.explore_essentials },
		{ path: '/tresmils', text: m.explore_tresmils },
		{ path: '/cims-mes-alts', text: m.explore_highest }
	];

	const valors = [
		{ title: m.home_value1_title, text: m.home_value1_text },
		{ title: m.home_value2_title, text: m.home_value2_text },
		{ title: m.home_value3_title, text: m.home_value3_text }
	];

	const steps = [
		{ n: '01', title: m.home_step1_title, text: m.home_step1_text },
		{ n: '02', title: m.home_step2_title, text: m.home_step2_text },
		{ n: '03', title: m.home_step3_title, text: m.home_step3_text }
	];

	const repte = [
		{ path: PAGINES_CONTINGUT.repte, text: m.home_repte_link_hub },
		{ path: PAGINES_CONTINGUT.normativa, text: m.home_repte_link_normativa },
		{ path: PAGINES_CONTINGUT.comValidar, text: m.home_repte_link_validar },
		{ path: PAGINES_CONTINGUT.repteInfantil, text: m.home_repte_link_infantil }
	];

	// Comarques amb més cims (només les indexables): enllaços amb la intenció «cims del Berguedà».
	const N_COMARQUES = 6;
	const comarquesTop = comarquesAmbCims()
		.map((c) => ({ comarca: c, n: cimsPerComarca(c.slug).length }))
		.filter(({ n }) => comarcaIndexable(n))
		.sort((a, b) => b.n - a.n)
		.slice(0, N_COMARQUES)
		.map(({ comarca }) => ({
			slug: comarca.slug,
			text: m.home_comarca_link({ comarca_de: nomAmbDe(comarca.nom_amb_article, getLocale()) })
		}));

	// Essencials emblemàtics (del catàleg; si algun slug desaparegués, simplement no surt).
	const DESTACATS = ['pica-d-estats', 'pedraforca-pollego-superior', 'canigo', 'matagalls'];
	const destacats = DESTACATS.map(cimPerSlug).filter(
		(c): c is CimCataleg => c !== undefined && c.essencial
	);
	const nomComarca = (cim: CimCataleg) => comarcaPerSlug(cim.comarca)?.nom ?? '';

	// Carnet d'exemple del hero (il·lustració, `aria-hidden`): pàgina I amb 37 segells.
	const EXEMPLE = 37;
	const pagines = [1, 2, 3, 4, 5];
	const segellsHero = destacats.slice(0, 2);
</script>

<PageMeta title={m.home_meta_title()} description={m.home_meta_description()} />
<JsonLd data={jsonLd} />

<section class="hero" aria-labelledby="home-title">
	<div class="copy">
		<p class="label kicker">{m.home_kicker()}</p>
		<h1 id="home-title" class="x-wide">{m.home_title()}</h1>
		<p class="lede">{m.home_lede()}</p>
		<div class="ctas">
			<Button href={href('/app')} variant="stamp" size="lg" icon="book">
				{m.home_cta_primary()}
			</Button>
			<Button href={href('/cims')} variant="outline" size="lg" icon="peak">
				{m.home_cta_secondary()}
			</Button>
		</div>
	</div>

	<!-- Il·lustració del carnet (proposta Segells): decorativa, amb dades d'exemple. -->
	<div class="art" aria-hidden="true">
		<div class="carnet">
			<div class="top">
				<span class="label"
					>{m.app_page({ page: romanPage(1) })} · {m.app_level({ level: '1' })}</span
				>
				<span class="label exemple">{m.home_passport_example()}</span>
			</div>
			<div class="row">
				<p class="count">{EXEMPLE}<small>{m.app_count_of()}</small></p>
				<ol class="pages">
					{#each pagines as p (p)}
						<li class={{ cur: p === 1 }} style:--omplert="{p === 1 ? EXEMPLE : 0}%">
							{romanPage(p)}
						</li>
					{/each}
				</ol>
			</div>
			<div class="ruler">
				<div class="track"></div>
				<div class="fill" style:width="{EXEMPLE}%"></div>
			</div>
			<p class="remaining mono">{m.app_remaining({ count: String(100 - EXEMPLE) })}</p>
		</div>
		<div class="segells">
			{#each segellsHero as cim, i (cim.slug)}
				<Segell
					top={cim.nom}
					center={formatAltitude(cim.altitud)}
					sub="m"
					bottom="◆ ◆ ◆"
					tone={i === 0 ? 'stamp' : 'ink'}
					rotate={i === 0 ? -9 : 7}
					size={112}
				/>
			{/each}
		</div>
	</div>
</section>

<section class="valors" aria-labelledby="valors-title">
	<h2 id="valors-title" class="section-title x-wide">{m.home_value_title()}</h2>
	<ul>
		{#each valors as v (v.title)}
			<li>
				<h3>{v.title()}</h3>
				<p>{v.text()}</p>
			</li>
		{/each}
	</ul>
</section>

<section class="steps" aria-labelledby="steps-title">
	<h2 id="steps-title" class="section-title x-wide">{m.home_steps_title()}</h2>
	<ol>
		{#each steps as step (step.n)}
			<Card as="li" padding="md">
				<span class="num mono" aria-hidden="true">{step.n}</span>
				<h3 class="x-wide">{step.title()}</h3>
				<p>{step.text()}</p>
			</Card>
		{/each}
	</ol>
</section>

<section class="repte" aria-labelledby="repte-title">
	<h2 id="repte-title" class="section-title x-wide">{m.home_repte_title()}</h2>
	<Card padding="lg" variant="flat" class="repte-card">
		<p>{m.home_repte_text()}</p>
		<ul>
			{#each repte as r (r.path)}
				<li>
					<a href={href(r.path)}>{r.text()}<Icon name="arrow" size={18} /></a>
				</li>
			{/each}
		</ul>
	</Card>
</section>

{#if destacats.length}
	<section class="destacats" aria-labelledby="destacats-title">
		<h2 id="destacats-title" class="section-title x-wide">{m.home_featured_title()}</h2>
		<ul>
			{#each destacats as cim, i (cim.slug)}
				<li>
					<a href={href(`/cims/${cim.slug}`)}>
						<Segell
							top={cim.nom}
							center={formatAltitude(cim.altitud)}
							sub="m"
							bottom="◆ ◆ ◆"
							rotate={i % 2 ? 6 : -6}
							size={96}
						/>
						<span class="nom">{cim.nom}</span>
						<span class="meta mono">{nomComarca(cim)} · {formatAltitude(cim.altitud)} m</span>
					</a>
				</li>
			{/each}
		</ul>
		<p class="tots">
			<a href={href('/cims-essencials')}>{m.home_featured_all()}<Icon name="arrow" size={18} /></a>
		</p>
	</section>
{/if}

<section class="explore" aria-labelledby="explore-title">
	<h2 id="explore-title" class="section-title x-wide">{m.explore_label()}</h2>
	<ul>
		{#each explora as e (e.path)}
			<li><a href={href(e.path)}>{e.text()}<span aria-hidden="true">›</span></a></li>
		{/each}
	</ul>
	{#if comarquesTop.length}
		<h3 id="comarques-title" class="subtitol">{m.home_comarques_title()}</h3>
		<ul aria-labelledby="comarques-title">
			{#each comarquesTop as c (c.slug)}
				<li>
					<a href={href(`/comarques/${c.slug}`)}>{c.text}<span aria-hidden="true">›</span></a>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<section class="unofficial" aria-labelledby="unofficial-title">
	<h2 id="unofficial-title" class="section-title x-wide">{m.home_unofficial_title()}</h2>
	<p>{m.footer_disclaimer()}</p>
</section>

<style>
	section + section {
		margin-top: var(--sp-10);
	}

	/* ---------- Hero ---------- */
	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: var(--sp-8);
		align-items: center;
		padding-bottom: var(--sp-4);
	}

	.kicker {
		color: var(--c-stamp-ink);
		margin-bottom: var(--sp-2);
	}

	h1 {
		font-size: clamp(var(--fs-xl), 7vw, var(--fs-3xl));
		font-weight: var(--fw-black);
		line-height: 1;
		letter-spacing: -0.005em;
	}

	.lede {
		margin-top: var(--sp-4);
		max-width: 44ch;
		font-size: var(--fs-md);
		color: var(--c-ink-2);
	}

	.ctas {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-3);
		margin-top: var(--sp-6);
	}

	.art {
		/* Mida dels segells: només trepitgen el marge inferior del carnet, mai el text. */
		--segell: clamp(5rem, 24vw, 7rem);
		position: relative;
		width: min(100%, 24rem);
		margin: 0 auto;
		padding-bottom: calc(var(--segell) * 0.9);
	}

	.carnet {
		position: relative;
		padding: var(--sp-4);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-lg);
		background: var(--c-card);
		box-shadow: var(--sh-3);
	}

	.carnet .top {
		display: flex;
		justify-content: space-between;
		gap: var(--sp-2);
		padding-bottom: var(--sp-2);
		border-bottom: 1px dashed var(--c-rule);
	}

	.exemple {
		color: var(--c-stamp-ink);
	}

	.carnet .row {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--sp-3);
		margin-top: var(--sp-3);
	}

	.count {
		font-stretch: var(--stretch-wide);
		font-weight: var(--fw-black);
		font-size: clamp(var(--fs-xl), 12vw, var(--fs-display));
		line-height: 0.85;
		letter-spacing: -0.02em;
		white-space: nowrap;
	}

	.count small {
		font-size: var(--fs-md);
		font-weight: var(--fw-bold);
		color: var(--c-ink-2);
		letter-spacing: 0;
	}

	.pages {
		display: flex;
		gap: 4px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.pages li {
		display: grid;
		place-items: end center;
		width: 1.625rem;
		height: 2.125rem;
		padding-bottom: 2px;
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-xs);
		background: linear-gradient(to top, var(--c-stamp) var(--omplert), var(--c-card) 0);
		font-family: var(--font-mono);
		font-size: var(--fs-2xs);
		font-weight: var(--fw-semibold);
	}

	.pages li.cur {
		color: var(--c-on-stamp);
	}

	.ruler {
		position: relative;
		height: 10px;
		margin-top: var(--sp-4);
	}

	.track,
	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 2px;
	}

	.track {
		right: 0;
		border: var(--bw) solid var(--c-line);
		background: repeating-linear-gradient(
			90deg,
			transparent 0 calc(10% - 1px),
			var(--c-rule) calc(10% - 1px) 10%
		);
	}

	.fill {
		background: var(--c-ink);
	}

	.remaining {
		margin-top: var(--sp-2);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.segells {
		position: absolute;
		right: calc(-1 * var(--sp-2));
		bottom: 0;
		display: flex;
	}

	.segells :global(.segell) {
		width: var(--segell);
		height: auto;
	}

	.segells :global(.segell + .segell) {
		margin-left: calc(-1 * var(--sp-4));
	}

	/* ---------- Seccions ---------- */
	.section-title {
		margin-bottom: var(--sp-4);
		padding-top: var(--sp-2);
		border-top: var(--bw) solid var(--c-line);
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
	}

	.valors ul {
		display: grid;
		gap: var(--sp-5);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.valors li {
		padding-left: var(--sp-4);
		border-left: 3px solid var(--c-stamp);
	}

	.valors h3 {
		font-size: var(--fs-base);
		font-weight: var(--fw-bold);
	}

	.valors p {
		margin-top: var(--sp-1);
		color: var(--c-ink-2);
	}

	.steps ol {
		display: grid;
		gap: var(--sp-4);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.num {
		display: block;
		color: var(--c-stamp-ink);
		font-weight: var(--fw-semibold);
		font-size: var(--fs-xs);
		letter-spacing: var(--ls-label);
	}

	.steps h3 {
		margin: var(--sp-1) 0 var(--sp-2);
		font-size: var(--fs-md);
		font-weight: var(--fw-black);
	}

	.steps p {
		color: var(--c-ink-2);
	}

	.repte :global(.repte-card) {
		display: grid;
		gap: var(--sp-4);
		background: var(--c-paper-2);
	}

	.repte p {
		max-width: 60ch;
	}

	.repte ul,
	.destacats ul,
	.explore ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.repte ul {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-1) var(--sp-6);
	}

	.repte a,
	.tots a {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
		min-height: var(--tap);
		color: var(--c-stamp-ink);
		font-weight: var(--fw-bold);
	}

	.destacats ul {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--sp-4);
	}

	.destacats li a {
		display: grid;
		justify-items: center;
		gap: var(--sp-1);
		height: 100%;
		padding: var(--sp-4) var(--sp-2);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-lg);
		background: var(--c-card);
		box-shadow: var(--sh-1);
		text-align: center;
		text-decoration: none;
	}

	.destacats li a:hover .nom {
		text-decoration: underline;
	}

	.destacats :global(.segell) {
		width: min(6rem, 100%);
		height: auto;
		margin-bottom: var(--sp-2);
	}

	.nom {
		font-weight: var(--fw-bold);
		overflow-wrap: anywhere;
	}

	.meta {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.tots {
		margin-top: var(--sp-2);
	}

	.explore .subtitol {
		margin: var(--sp-6) 0 var(--sp-3);
		font-size: var(--fs-base);
		font-weight: var(--fw-bold);
	}

	.explore ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 13rem), 1fr));
		gap: var(--sp-3);
	}

	.explore a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-3);
		min-height: var(--tap);
		padding: var(--sp-3) var(--sp-4);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-card);
		box-shadow: var(--sh-1);
		font-weight: var(--fw-bold);
		text-decoration: none;
	}

	.explore a:hover {
		text-decoration: underline;
	}

	.explore a span {
		color: var(--c-stamp-ink);
		font-size: var(--fs-lg);
		line-height: 1;
	}

	.unofficial p {
		max-width: 60ch;
		color: var(--c-ink-2);
	}

	@media (min-width: 48rem) {
		.hero {
			grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
			gap: var(--sp-10);
			padding: var(--sp-6) 0 var(--sp-8);
		}

		.valors ul,
		.steps ol {
			grid-template-columns: repeat(3, 1fr);
		}

		.destacats ul {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
</style>
