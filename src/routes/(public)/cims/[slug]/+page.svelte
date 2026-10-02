<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Breadcrumb,
		Button,
		Card,
		Icon,
		JsonLd,
		PageMeta,
		Segell,
		formatAltitude,
		formatCoordinate,
		formatKm
	} from '$lib/ui';
	import { ampleLiniesEm, ampleParaulaMesLlargaEm } from '$lib/ui/titol-ample';
	import { obrirRegistre, registrarHref as registrarUrl } from '$lib/ui/fulls';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import {
		avuiLocal,
		restriccioActiva,
		type CimCataleg,
		type DataISO,
		type RestriccioAcces,
		type TipusRestriccio,
		type Zona
	} from '$lib/domain';
	import { cimGraph } from '$lib/seo/jsonld';
	import { seoFitxaCim } from '$lib/seo/fitxa-cim';
	import { mapaEstaticPerCim } from '$lib/platform/mapa-estatic';
	import { wikilocUrl } from '$lib/platform/wikiloc';

	let { data } = $props();

	const locale = getLocale();
	const cim = $derived(data.cim);
	const comarca = $derived(data.comarca);
	const alt = $derived(formatAltitude(cim.altitud));

	// ---------- SEO ----------
	const seo = $derived(seoFitxaCim(cim, comarca, locale));
	// Política de docs/02: només s'indexen les fitxes revisades (el sitemap aplica el mateix filtre).
	const noindex = $derived(cim.estat_revisio !== 'revisat');
	const jsonLd = $derived(
		cimGraph({
			cim,
			comarca,
			locale,
			title: seo.title,
			description: seo.description,
			breadcrumbNames: { inici: m.nav_home(), comarques: m.nav_comarques() },
			essencialLabel: m.cim_ld_essential()
		})
	);

	// ---------- Dades ----------
	const ZONES: Record<Zona, () => string> = {
		catalunya: m.zone_catalunya,
		andorra: m.zone_andorra,
		'catalunya-nord': m.zone_catalunya_nord
	};
	// Andorra i la Catalunya Nord són alhora "comarca" i zona: no es repeteix.
	const zona = $derived(comarca.slug === cim.zona ? null : ZONES[cim.zona]());

	// H1 = "{nom} ({alt} m)" (docs/02 §4.1), amb l'altitud en un <span> més petit i sense salt.
	// Amplades estimades (em) per ajustar la mida del H1 (lletra ampla): la paraula més llarga hi
	// ha de cabre sencera ("Castellsapera") i el titular sencer, altitud inclosa, en 3 línies
	// com a màxim, amb el salt per paraules ("Sant Salvador de les Espases (413 m)"). Vegeu el CSS
	// del h1 i de `.h1-alt`.
	const ESCALA_ALT = 0.5;
	const paraulaEm = $derived(ampleParaulaMesLlargaEm(cim.nom));
	// Les paraules amb guionet ("Mont-roig") no es parteixen pel guionet: amb l'altitud al
	// darrere, el navegador hi faria el salt. Parts senars = paraules amb guionet.
	const partsNom = $derived(cim.nom.split(/(\S*-\S*)/));
	const liniesEm = $derived(ampleLiniesEm(cim.nom, 3, { text: `(${alt} m)`, escala: ESCALA_ALT }));

	const altresNoms = $derived.by(() => {
		// Noms diferents del visible, sense repetits (sense distingir majúscules).
		const claus = [cim.nom, cim.nom_oficial, ...cim.alies].map((n) => n.toLocaleLowerCase('ca'));
		return [cim.nom_oficial, ...cim.alies].filter((_, i) => claus.indexOf(claus[i + 1]) === i + 1);
	});
	const llistaNoms = $derived(
		new Intl.ListFormat(locale, { type: 'disjunction' }).format(altresNoms)
	);

	const coords = $derived(
		cim.lat !== null && cim.lon !== null
			? {
					lat: `${formatCoordinate(cim.lat, locale)}° ${cim.lat >= 0 ? m.coord_n() : m.coord_s()}`,
					lon: `${formatCoordinate(cim.lon, locale)}° ${cim.lon >= 0 ? m.coord_e() : m.coord_w()}`
				}
			: null
	);

	// Mateix ordre i noms que el `BreadcrumbList` de `cimGraph`: Inici › Comarques › {comarca} › {cim}.
	const comarcaHref = $derived(href(`/comarques/${comarca.slug}`));
	const crumbs = $derived([
		{ name: m.nav_home(), href: href('/') },
		{ name: m.nav_comarques(), href: href('/comarques') },
		{ name: comarca.nom, href: comarcaHref },
		{ name: cim.nom }
	]);

	const mapaHref = $derived(`${href('/mapa')}?cim=${cim.slug}`);
	const registrarHref = $derived(registrarUrl(cim.slug));

	// ---------- Restriccions ----------
	const TIPUS: Record<TipusRestriccio, () => string> = {
		fauna: m.restriction_fauna,
		obres: m.restriction_obres,
		propietat: m.restriction_propietat,
		militar: m.restriction_militar,
		altres: m.restriction_altres
	};
	const restriccions = $derived(cim.restriccions.filter((r) => r.vigent !== false));

	const diaMes = new Intl.DateTimeFormat(locale, {
		day: 'numeric',
		month: 'long',
		timeZone: 'UTC'
	});
	const dataLlarga = new Intl.DateTimeFormat(locale, {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC'
	});
	const fmtMmdd = (mmdd: string) => {
		const [mes, dia] = mmdd.split('-').map(Number);
		return diaMes.format(new Date(Date.UTC(2000, mes - 1, dia)));
	};
	const fmtData = (iso: DataISO) => dataLlarga.format(new Date(`${iso}T00:00:00Z`));

	function periodes(r: RestriccioAcces): string[] {
		const out: string[] = [];
		if (r.periodeIniciMmdd && r.periodeFiMmdd) {
			out.push(
				m.restriction_yearly({ inici: fmtMmdd(r.periodeIniciMmdd), fi: fmtMmdd(r.periodeFiMmdd) })
			);
		}
		if (r.dataInici && r.dataFi) {
			out.push(m.restriction_range({ inici: fmtData(r.dataInici), fi: fmtData(r.dataFi) }));
		} else if (r.dataInici) {
			out.push(m.restriction_from({ inici: fmtData(r.dataInici) }));
		} else if (r.dataFi) {
			out.push(m.restriction_until({ fi: fmtData(r.dataFi) }));
		}
		if (out.length === 0) out.push(m.restriction_permanent());
		return out;
	}

	// La pàgina és estàtica: "vigent avui" es calcula al navegador, amb la data real.
	let avui = $state<DataISO | null>(null);
	onMount(() => {
		avui = avuiLocal();
	});

	// ---------- Mapa i rutes ----------
	const MAPA_AMPLE = 640;
	const MAPA_ALT = 400;
	const mapa = $derived(mapaEstaticPerCim(cim, { ample: MAPA_AMPLE, alt: MAPA_ALT }));
	const wikiloc = $derived(
		cim.lat !== null && cim.lon !== null ? wikilocUrl(cim.lat, cim.lon, locale) : null
	);
</script>

<PageMeta title={seo.title} description={seo.description} {noindex} />
<JsonLd data={jsonLd} />

{#snippet llistaCims(items: readonly { cim: CimCataleg; distanciaKm?: number }[])}
	<ul class="peaks">
		{#each items as item (item.cim.slug)}
			<li>
				<a href={href(`/cims/${item.cim.slug}`)}>
					<span class="pk-name">
						{#if item.cim.essencial}
							<span class="diamond" aria-hidden="true"></span>
						{/if}
						{item.cim.nom}
						{#if item.cim.essencial}<span class="sr-only">({m.peaks_essential_short()})</span>{/if}
					</span>
					<span class="pk-meta mono">
						{[
							`${formatAltitude(item.cim.altitud)} m`,
							item.distanciaKm === undefined
								? null
								: m.cim_distance({ km: formatKm(item.distanciaKm, locale) })
						]
							.filter(Boolean)
							.join(' · ')}
					</span>
				</a>
			</li>
		{/each}
	</ul>
{/snippet}

<article class="fitxa">
	<div class="col-main">
		<Card as="header" padding="lg" class={['head', { 'has-stamp': cim.essencial }]}>
			{#if cim.essencial}
				<div class="stamp">
					<Segell
						top={m.cim_essential_stamp()}
						center={alt}
						sub="m"
						bottom="◆ ◆ ◆"
						rotate={-8}
						size={120}
					/>
				</div>
			{/if}

			<Breadcrumb items={crumbs} class={{ 'beside-stamp': cim.essencial }} />

			<h1
				class="x-wide"
				style:--paraula-em={paraulaEm}
				style:--linies-em={liniesEm}
				style:--escala-alt={ESCALA_ALT}
			>
				{#each partsNom as part, i (i)}{#if i % 2}<span class="nowrap">{part}</span
						>{:else}{part}{/if}{/each}
				<span class="h1-alt">({alt} m)</span>
			</h1>
			<p class="sub mono">
				{[comarca.nom, zona].filter(Boolean).join(' · ')}
			</p>

			{#if altresNoms.length > 0}
				<p class="aka">{m.cim_also_known({ names: llistaNoms })}</p>
			{/if}

			<!-- Just sota el titular: visible al primer viewport del mòbil, abans de la taula. -->
			<!-- `nofollow`: són URL amb query (`/app/registrar?cim=…`, `/mapa?cim=…`) que porten a
			     pàgines `noindex`; així els cercadors no rastregen una variant per fitxa i idioma.
			     L'enllaç continua sent real (pestanya nova, sense JS). -->
			<div class="ctas">
				<Button
					href={registrarHref}
					rel="nofollow"
					onclick={(e: MouseEvent) => obrirRegistre(e, cim.slug)}
					variant="stamp"
					size="lg"
					icon="stamp"
					block
					class="cta-registre"
				>
					{m.cim_register_cta()}
				</Button>
				{#if coords}
					<Button href={mapaHref} rel="nofollow" variant="outline" icon="map" block
						>{m.cim_open_map()}</Button
					>
				{/if}
			</div>

			<h2 class="sr-only">{m.cim_data_title()}</h2>
			<dl class="tbl mono">
				<div>
					<dt>{m.cim_altitude()}</dt>
					<dd>{alt} m</dd>
				</div>
				<div>
					<dt>{m.cim_comarca()}</dt>
					<dd><a class="dd-link" href={comarcaHref}>{comarca.nom}</a></dd>
				</div>
				<div>
					<dt>{m.cim_category()}</dt>
					{#if cim.essencial}
						<dd class="essential">
							<span class="diamond" aria-hidden="true"></span>{m.cim_essential()}
						</dd>
					{:else}
						<dd>{m.cim_not_essential()}</dd>
					{/if}
				</div>
				{#if coords}
					<div>
						<dt>{m.cim_coordinates()}</dt>
						<dd>
							<span class="nowrap">{coords.lat}</span> · <span class="nowrap">{coords.lon}</span>
						</dd>
					</div>
				{/if}
				<div>
					<dt>{m.cim_review()}</dt>
					{#if cim.estat_revisio === 'revisat'}
						<dd class="reviewed"><Icon name="check" size={14} />{m.cim_reviewed()}</dd>
					{:else}
						<dd>{m.cim_in_review()}</dd>
					{/if}
				</div>
			</dl>

			{#if cim.estat_revisio === 'esborrany'}
				<p class="draft" role="note">{m.catalog_draft_notice()}</p>
			{/if}
		</Card>

		{#if restriccions.length > 0}
			<section class="blk" aria-labelledby="restriccions">
				<h2 id="restriccions" class="x-wide">{m.cim_restrictions_title()}</h2>
				<ul class="restr">
					{#each restriccions as r, i (i)}
						{@const activa = avui !== null && restriccioActiva(r, avui)}
						<li class={{ activa }}>
							<p class="restr-head">
								<strong>{TIPUS[r.tipus]()}</strong>
								{#if activa}<span class="badge">{m.restriction_active_today()}</span>{/if}
							</p>
							{#each periodes(r) as p (p)}
								<p class="mono restr-when">{p}</p>
							{/each}
							<a class="ext" href={r.fontUrl} rel="external noopener" target="_blank">
								{m.restriction_source()}<Icon name="external" size={14} />
								<span class="sr-only">{m.external_new_tab()}</span>
							</a>
						</li>
					{/each}
				</ul>
				<p class="note">{m.cim_restrictions_note()}</p>
			</section>
		{/if}

		{#if mapa}
			<section class="blk" aria-labelledby="mapa">
				<h2 id="mapa" class="x-wide">{m.cim_map_title()}</h2>
				<figure class="map">
					<div class="map-img">
						<img
							src={mapa.url}
							width={MAPA_AMPLE}
							height={MAPA_ALT}
							alt={seo.mapAlt}
							loading="lazy"
							decoding="async"
							crossorigin="anonymous"
						/>
						<span class="pin" aria-hidden="true"></span>
					</div>
					<figcaption class="mono">
						<a href={mapa.llicenciaUrl} rel="external noopener license" target="_blank">
							{mapa.font === 'icgc' ? m.cim_map_attribution_icgc() : m.cim_map_attribution_ign()}
							<span class="sr-only">{m.external_new_tab()}</span>
						</a>
					</figcaption>
				</figure>
				<!-- Enllaç net (indexable) al mapa general; el botó "Obre al mapa" amb `?cim=` és `nofollow`. -->
				<a class="mapa-tots" href={href('/mapa')}>{m.cim_map_all()}</a>
			</section>
		{/if}

		<!-- Fase 6: aquí aniran la descripció, la ruta normal, el MIDE, la meteo i les rutes
		     recomanades (widget oficial de Wikiloc). No es mostren seccions buides. -->
		{#if wikiloc}
			<section class="blk" aria-labelledby="wikiloc">
				<h2 id="wikiloc" class="x-wide">{m.cim_wikiloc_title()}</h2>
				<p class="note">{m.cim_wikiloc_text()}</p>
				<Button
					href={wikiloc}
					variant="outline"
					icon="external"
					rel="external nofollow noopener"
					target="_blank"
				>
					{m.cim_wikiloc_cta()}<span class="sr-only"> {m.external_new_tab()}</span>
				</Button>
			</section>
		{/if}
	</div>

	<aside class="col-side">
		{#if data.propers.length > 0}
			<section class="blk" aria-labelledby="propers">
				<h2 id="propers" class="x-wide">{m.cim_nearby_title()}</h2>
				{@render llistaCims(data.propers)}
			</section>
		{/if}

		{#if data.mateixaComarca.length > 0}
			<section class="blk" aria-labelledby="comarca">
				<h2 id="comarca" class="x-wide">
					{m.cim_same_comarca_title({ comarca_de: seo.comarcaDe })}
				</h2>
				{@render llistaCims(data.mateixaComarca.map((c) => ({ cim: c })))}
			</section>
			<!-- Fora de la secció: aquesta només conté fitxes. -->
			<a class="more" href={comarcaHref}>
				{m.cim_same_comarca_all({ comarca_de: seo.comarcaDe })}
			</a>
		{/if}
	</aside>
</article>

<style>
	/* Pistes `minmax(0, 1fr)`: cap contingut (un nom llarg) pot eixamplar la columna. */
	.fitxa {
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

	/* La capçalera és el contenidor de referència de la mida del H1 (unitats cqi) */
	.fitxa :global(.head) {
		min-width: 0;
		container-type: inline-size;
		padding: var(--sp-5) var(--sp-4);
	}

	/* ---------- Capçalera (full del carnet) ---------- */
	/* El segell "essencial" queda estampat damunt la vora del full, com a la proposta */
	.fitxa :global(.has-stamp) {
		margin-top: var(--sp-8);
	}

	.stamp {
		position: absolute;
		top: calc(-1 * var(--sp-8));
		right: var(--sp-3);
		pointer-events: none;
	}

	.stamp :global(.segell) {
		width: 5.5rem;
		height: auto;
	}

	/*
	 * El segell entra dins del full (mida − 2rem sota la vora superior). La molla de pa li
	 * reserva l'amplada i, amb l'alçada mínima, també l'alçada: el H1 comença per sota del
	 * segell i no s'hi solapa encara que ocupi tota l'amplada.
	 * Mòbil: 5,5rem − 2rem − 1,25rem de farciment = 2,25rem, + marge per la rotació del segell
	 * i la caixa de línia del H1.
	 */
	.fitxa :global(.crumb.beside-stamp) {
		min-height: 3rem;
		padding-right: 5.5rem;
	}

	h1 {
		margin-top: var(--sp-1);
		/*
		 * Mida fluida (100cqi = amplada del full), la més petita de:
		 * - la paraula més llarga cap sencera, amb un 4 % de marge (mai es parteix);
		 * - el titular sencer (nom + altitud) cap en 3 línies amb el salt per paraules, amb un 6 %
		 *   de marge (`ampleLiniesEm` ja simula el salt; les amplades per lletra són a l'alça);
		 * - un sostre de 11cqi (≈ 28 px a 320–375 px, 48 px a escriptori), perquè la mida sigui
		 *   compacta i semblant entre fitxes al mòbil.
		 * Mínim llegible 1,25rem; `overflow-wrap: anywhere` només és la xarxa de seguretat.
		 */
		font-size: clamp(
			1.25rem,
			min(
				100cqi / (var(--paraula-em, 10) * 1.04),
				100cqi / (var(--linies-em, 10) * 1.06),
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

	/* Altitud dins del H1: més petita, discreta i mai partida */
	.h1-alt {
		font-size: calc(var(--escala-alt, 0.5) * 1em);
		font-weight: var(--fw-bold);
		letter-spacing: 0;
		color: var(--c-ink-2);
		white-space: nowrap;
	}

	.sub {
		margin-top: var(--sp-2);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	.aka {
		margin-top: var(--sp-3);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	.tbl {
		margin: var(--sp-4) 0 0;
		font-size: var(--fs-sm);
	}

	.tbl div {
		display: flex;
		align-items: baseline;
		gap: var(--sp-2);
		padding: var(--sp-1) 0;
	}

	/* Punts de guia entre el terme i el valor, com al carnet */
	.tbl div::after {
		content: '';
		order: 2;
		flex: 1 1 var(--sp-4);
		min-width: var(--sp-4);
		border-bottom: var(--bw) dotted var(--c-rule);
		transform: translateY(-4px);
	}

	.tbl dt {
		order: 1;
		flex: none;
		font-size: var(--fs-xs);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--c-ink-2);
	}

	.tbl dd {
		order: 3;
		margin: 0;
		font-weight: var(--fw-semibold);
		text-align: right;
	}

	.nowrap {
		white-space: nowrap;
	}

	.dd-link {
		display: inline-flex;
		align-items: center;
		min-height: 24px;
		color: var(--c-stamp-ink);
		text-underline-offset: 0.2em;
	}

	.essential,
	.reviewed {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.essential {
		color: var(--c-stamp-ink);
	}

	.reviewed {
		color: var(--c-pine);
	}

	.diamond {
		display: inline-block;
		flex: none;
		width: 8px;
		height: 8px;
		transform: rotate(45deg);
		background: var(--c-stamp);
	}

	.draft {
		margin-top: var(--sp-4);
		padding: var(--sp-2) var(--sp-3);
		border-left: 3px solid var(--c-kraft);
		background: var(--c-paper-2);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	.ctas {
		display: grid;
		gap: var(--sp-3);
		margin-top: var(--sp-4);
	}

	/* 320 px: el CTA en una sola línia (text i farciment més compactes) */
	@media (max-width: 29.99rem) {
		.ctas :global(a.cta-registre) {
			padding-inline: var(--sp-2);
			font-size: 0.8125rem;
			letter-spacing: 0.02em;
		}
	}

	/* ---------- Blocs ---------- */
	.blk h2 {
		margin-bottom: var(--sp-3);
		padding-top: var(--sp-2);
		border-top: var(--bw) solid var(--c-line);
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
	}

	.note {
		margin-bottom: var(--sp-3);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
		max-width: 60ch;
	}

	.ext {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-1);
		min-height: var(--tap);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		color: var(--c-blue);
	}

	/* Restriccions */
	.restr {
		display: grid;
		gap: var(--sp-3);
		margin: 0 0 var(--sp-3);
		padding: 0;
		list-style: none;
	}

	.restr li {
		padding: var(--sp-3) var(--sp-4) var(--sp-1);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-card);
	}

	.restr li.activa {
		border-color: var(--c-stamp);
		border-width: 2px;
		background: var(--c-stamp-soft);
	}

	.restr-head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--sp-2);
	}

	.badge {
		padding: 0 var(--sp-2);
		border-radius: var(--r-xs);
		background: var(--c-stamp);
		color: var(--c-on-stamp);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--ls-caps);
		text-transform: uppercase;
	}

	.restr-when {
		margin-top: var(--sp-1);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	/* Mapa */
	.map {
		margin: 0;
	}

	.map-img {
		position: relative;
		overflow: hidden;
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-lg);
		background: var(--c-paper-2);
		box-shadow: var(--sh-2);
	}

	.map-img img {
		width: 100%;
		height: auto;
		aspect-ratio: 640 / 400;
		object-fit: cover;
	}

	/* La imatge sempre està centrada al cim */
	.pin {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 16px;
		height: 16px;
		margin: -8px 0 0 -8px;
		transform: rotate(45deg);
		background: var(--c-stamp);
		border: 2.5px solid #fff;
		box-shadow: 0 0 0 1px var(--c-stamp);
	}

	.map figcaption {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	/* Text discret però amb àrea tàctil de 44 px d'alt */
	.map figcaption a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		color: inherit;
		text-underline-offset: 0.2em;
	}

	.mapa-tots {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		color: var(--c-stamp-ink);
	}

	/* Llistes de cims */
	.peaks {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.peaks li + li {
		border-top: 1px dashed var(--c-rule);
	}

	.peaks a {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0 var(--sp-3);
		min-height: var(--tap);
		padding: var(--sp-2) 0;
		text-decoration: none;
	}

	.peaks a:hover .pk-name {
		text-decoration: underline;
	}

	.pk-name {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
		font-weight: var(--fw-bold);
	}

	.more {
		display: inline-flex;
		align-items: center;
		justify-self: start;
		min-height: var(--tap);
		margin-top: calc(-1 * var(--sp-5));
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		color: var(--c-stamp-ink);
	}

	.pk-meta {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
		white-space: nowrap;
	}

	@media (min-width: 30rem) {
		.ctas {
			grid-template-columns: auto auto;
			justify-content: start;
		}

		.stamp :global(.segell) {
			width: 6.5rem;
		}

		/* 6,5rem − 2rem − 1,5rem de farciment = 3rem (+ marge per la caixa de línia del H1) */
		.fitxa :global(.crumb.beside-stamp) {
			min-height: 3.75rem;
			padding-right: 6.5rem;
		}

		.fitxa :global(.head) {
			padding: var(--sp-6);
		}
	}

	@media (min-width: 60rem) {
		.fitxa {
			grid-template-columns: minmax(0, 1fr) 18rem;
			gap: var(--sp-10);
		}
	}
</style>
