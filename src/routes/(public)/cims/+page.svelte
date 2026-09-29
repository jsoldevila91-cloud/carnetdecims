<script lang="ts">
	import { afterNavigate, replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { Breadcrumb, JsonLd, LlistaCims, NOM_ZONA, PageMeta } from '$lib/ui';
	import {
		FILTRES_BUITS,
		FRANGES,
		filtresActius,
		filtresAUrl,
		filtresDesDeUrl,
		passaFiltres,
		textCerca,
		type FiltresCims,
		type FranjaAltitud
	} from '$lib/ui/filtre-cims';
	import { getLocale, href } from '$lib/i18n';
	import { cimsGraph } from '$lib/seo/jsonld';
	import { m } from '$lib/paraglide/messages';
	import { ZONES } from '$lib/domain';
	import { CIMS, agruparPerComarca, comarcaPerSlug } from '$lib/data/catalog';

	// Tots els cims al HTML (SSR), agrupats per comarca i per nom dins de cada grup.
	// Els filtres només amaguen elements al client: sense JS la pàgina és la llista completa.
	const collator = new Intl.Collator('ca');
	const grups = agruparPerComarca([...CIMS].sort((a, b) => collator.compare(a.nom, b.nom)));
	// JSON-LD i breadcrumb (visible = BreadcrumbList): la llista sencera, en l'ordre de la pàgina.
	const jsonLd = cimsGraph({
		cims: grups.flatMap((g) => g.cims),
		locale: getLocale(),
		title: m.peaks_meta_title(),
		description: m.peaks_meta_description(),
		breadcrumbNames: { inici: m.nav_home(), cims: m.explore_all() }
	});
	const cerca = new Map(CIMS.map((c) => [c.slug, textCerca(c, comarcaPerSlug(c.comarca)?.nom)]));

	const ETIQUETA_FRANJA: Record<FranjaAltitud, () => string> = {
		'fins-1000': m.filters_alt_fins_1000,
		'1000-2000': m.filters_alt_1000_2000,
		'2000-3000': m.filters_alt_2000_3000,
		'des-3000': m.filters_alt_des_3000
	};

	let filtres = $state<FiltresCims>({ ...FILTRES_BUITS });
	let llest = $state(false);

	const actius = $derived(filtresActius(filtres));
	const amagats: ReadonlySet<string> = $derived(
		new Set(
			actius
				? CIMS.filter((c) => !passaFiltres(c, cerca.get(c.slug)!, filtres)).map((c) => c.slug)
				: []
		)
	);
	const visibles = $derived(CIMS.length - amagats.size);

	// Estat des de la query string (no indexable: el canonical és la URL base) a cada navegació
	// cap a aquesta pàgina: la càrrega inicial, enrere/endavant i també un enllaç a la mateixa
	// pàgina (p. ex. "Cims" a la barra inferior amb un filtre actiu → URL sense query = sense
	// filtres). Els valors desconeguts s'ignoren i la URL es normalitza quan el router és a punt.
	// `replaceState` falla si el router encara no s'ha inicialitzat: a la primera càrrega,
	// SvelteKit crida `afterNavigate` just abans de marcar-lo com a iniciat, per això s'espera
	// una microtasca.
	afterNavigate((nav) => {
		filtres = filtresDesDeUrl(nav.to?.url.searchParams ?? new URLSearchParams(location.search));
		if (!llest) queueMicrotask(() => (llest = true));
	});

	// Manté la query string al dia (compartir, enrere/endavant) sense crear entrades a l'historial.
	$effect(() => {
		if (!llest) return;
		const qs = filtresAUrl(filtres);
		if (qs === location.search.replace(/^\?/, '')) return;
		// La query string no forma part de la ruta: el camí és el de la pàgina (`href`).
		replaceState(href('/cims') + (qs ? `?${qs}` : ''), page.state);
	});

	function netejar() {
		filtres = { ...FILTRES_BUITS };
		document.getElementById('f-text')?.focus();
	}
</script>

<PageMeta title={m.peaks_meta_title()} description={m.peaks_meta_description()} />
<JsonLd data={jsonLd} />

<svelte:head>
	<!-- Sense JS els filtres no funcionen: s'amaguen i es mostra la llista completa. -->
	<noscript
		><style>
			.filtres {
				display: none !important;
			}
		</style></noscript
	>
</svelte:head>

<header class="page-head">
	<Breadcrumb items={[{ name: m.nav_home(), href: href('/') }, { name: m.explore_all() }]} />
	<h1 class="x-wide">{m.peaks_title()}</h1>
	<p class="lede">{m.peaks_lede({ count: CIMS.length })}</p>
	<nav class="explora" aria-label={m.explore_label()}>
		<a href={href('/comarques')}>{m.explore_comarques()}</a>
		<a href={href('/cims-essencials')}>{m.explore_essentials()}</a>
		<a href={href('/tresmils')}>{m.explore_tresmils()}</a>
		<a href={href('/cims-mes-alts')}>{m.explore_highest()}</a>
	</nav>
</header>

<form
	class="filtres"
	role="search"
	aria-label={m.filters_label()}
	onsubmit={(e) => {
		e.preventDefault();
		(document.activeElement as HTMLElement | null)?.blur();
	}}
>
	<div class="camp cerca">
		<label for="f-text">{m.filters_search()}</label>
		<input
			id="f-text"
			type="search"
			bind:value={filtres.text}
			placeholder={m.filters_search_placeholder()}
			autocomplete="off"
			spellcheck="false"
			enterkeyhint="search"
			maxlength="80"
		/>
	</div>
	<div class="camp">
		<label for="f-zona">{m.filters_zone()}</label>
		<select id="f-zona" bind:value={filtres.zona}>
			<option value="">{m.filters_zone_all()}</option>
			{#each ZONES as z (z)}
				<option value={z}>{NOM_ZONA[z]()}</option>
			{/each}
		</select>
	</div>
	<div class="camp">
		<label for="f-alt">{m.filters_altitude()}</label>
		<select id="f-alt" bind:value={filtres.altitud}>
			<option value="">{m.filters_altitude_all()}</option>
			{#each FRANGES as f (f)}
				<option value={f}>{ETIQUETA_FRANJA[f]()}</option>
			{/each}
		</select>
	</div>
	<div class="accions">
		<label class="check">
			<input type="checkbox" bind:checked={filtres.nomesEssencials} />
			<span class="diamond" aria-hidden="true"></span>
			{m.filters_essentials()}
		</label>
		{#if actius}
			<button type="button" class="netejar" onclick={netejar}>{m.filters_clear()}</button>
		{/if}
	</div>
</form>

<p class="resultat mono" role="status">
	{#if actius}
		{visibles === 1
			? m.filters_results_one({ total: CIMS.length })
			: m.filters_results({ count: visibles, total: CIMS.length })}
	{/if}
</p>

<section aria-labelledby="per-comarca">
	<h2 id="per-comarca" class="sr-only">{m.peaks_by_comarca()}</h2>
	{#if actius && visibles === 0}
		<div class="buit">
			<p class="buit-titol">{m.filters_empty_title()}</p>
			<p>{m.filters_empty_text()}</p>
		</div>
	{/if}
	<div class="grups">
		{#each grups as { comarca, cims } (comarca.slug)}
			{@const n = cims.filter((c) => !amagats.has(c.slug)).length}
			<section class="grup" aria-labelledby="comarca-{comarca.slug}" hidden={n === 0}>
				<h3 id="comarca-{comarca.slug}" class="x-wide">
					<a href={href(`/comarques/${comarca.slug}`)}>{comarca.nom}</a>
					<span class="count mono">{n}</span>
				</h3>
				<LlistaCims {cims} {amagats} />
			</section>
		{/each}
	</div>
</section>

<style>
	.page-head {
		margin-bottom: var(--sp-5);
	}

	h1 {
		margin-top: var(--sp-1);
		font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1;
	}

	.lede {
		margin-top: var(--sp-3);
		color: var(--c-ink-2);
		max-width: 50ch;
	}

	.explora {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--sp-5);
		margin-top: var(--sp-2);
	}

	.explora a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		color: var(--c-stamp-ink);
	}

	/* ---------- Filtres ---------- */
	.filtres {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--sp-3);
		padding: var(--sp-4);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-lg);
		background: var(--c-card);
		box-shadow: var(--sh-2);
	}

	.camp {
		display: grid;
		gap: var(--sp-1);
		min-width: 0;
	}

	.cerca,
	.accions {
		grid-column: 1 / -1;
	}

	label {
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--ls-caps);
		text-transform: uppercase;
		color: var(--c-ink-2);
	}

	input[type='search'],
	select {
		width: 100%;
		min-height: var(--tap);
		padding: 0 var(--sp-3);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-paper);
		color: var(--c-ink);
		/* 16 px: iOS no fa zoom en enfocar */
		font-size: var(--fs-base);
	}

	input[type='search']::placeholder {
		color: var(--c-ink-2);
		opacity: 1;
	}

	.accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-2) var(--sp-4);
	}

	.check {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
		min-height: var(--tap);
		cursor: pointer;
		color: var(--c-ink);
	}

	.check input {
		width: 1.25rem;
		height: 1.25rem;
		margin: 0;
		accent-color: var(--c-stamp);
	}

	.diamond {
		display: inline-block;
		flex: none;
		width: 8px;
		height: 8px;
		transform: rotate(45deg);
		background: var(--c-stamp);
	}

	.netejar {
		min-height: var(--tap);
		padding: 0 var(--sp-3);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: transparent;
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--ls-caps);
		text-transform: uppercase;
		cursor: pointer;
	}

	.netejar:hover {
		background: var(--c-paper-2);
	}

	.resultat {
		min-height: 1.5em;
		margin: var(--sp-3) 0 var(--sp-2);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	.buit {
		display: grid;
		gap: var(--sp-1);
		margin-bottom: var(--sp-6);
		padding: var(--sp-5) var(--sp-4);
		border: var(--bw) dashed var(--c-ink-2);
		border-radius: var(--r-lg);
		color: var(--c-ink-2);
	}

	.buit-titol {
		font-weight: var(--fw-bold);
		color: var(--c-ink);
	}

	/* ---------- Grups ---------- */
	.grups {
		display: grid;
		gap: var(--sp-8) var(--sp-10);
	}

	h3 {
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

	h3 a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		color: var(--c-stamp-ink);
		text-decoration: none;
	}

	h3 a:hover {
		text-decoration: underline;
	}

	.count {
		font-size: var(--fs-xs);
		font-weight: var(--fw-medium);
		color: var(--c-ink-2);
	}

	@media (min-width: 48rem) {
		.filtres {
			grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
			align-items: end;
		}

		.cerca {
			grid-column: auto;
		}

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
