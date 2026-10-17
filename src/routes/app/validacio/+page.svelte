<script lang="ts">
	/**
	 * Prepara la validació (bloc R3): llista de les ascensions d'un any per presentar-les a
	 * l'entitat i a la FEEC, amb els avisos (restricció, repetició, més de 100…), les excloses
	 * amb el motiu, descàrrega CSV i full imprimible (o PDF des del diàleg d'impressió).
	 * Carnet de Cims no valida res: només ajuda a preparar el paper. Tot es calcula al client.
	 */
	import { ascensionsVivesAmbEstat } from '$lib/data/ascensions';
	import { CIMS, COMARQUES, comarcaPerSlug } from '$lib/data/catalog';
	import {
		avuiLocal,
		type Metode,
		anysAmbAscensions,
		csvValidacio,
		dataFull,
		exportValidacio,
		terminiValidacio,
		type AvisValidacio,
		type MotiuExclusio
	} from '$lib/domain';
	import { descarregarText } from '$lib/platform/fitxers';
	import { URL_FULL_VALIDACIO_INDIVIDUAL, URL_REGISTRA } from '$lib/content/com-validar';
	import { Button, Card, EmptyState, Icon, PageMeta } from '$lib/ui';
	import { cimPerId } from '$lib/ui/cim-per-id';
	import { formatAltitude, formatDataLlarga } from '$lib/ui/format';
	import { obrirRegistre, registrarHref } from '$lib/ui/fulls';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	type Avis = AvisValidacio;

	const vives = ascensionsVivesAmbEstat();
	const avui = avuiLocal();
	const locale = getLocale();
	const uid = $props.id();

	const ascensions = $derived($vives.ascensions);
	const anys = $derived([...anysAmbAscensions(ascensions)].sort((a, b) => b - a));
	const termini = terminiValidacio(avui);

	/** Any triat; per defecte, l'any en curs si té ascensions (si no, el més recent). */
	let anyTriat = $state<number | null>(null);
	const any = $derived(
		anyTriat !== null && anys.includes(anyTriat)
			? anyTriat
			: anys.includes(termini.any)
				? termini.any
				: (anys[0] ?? termini.any)
	);

	/** Opcional: només les ascensions a partir d'aquesta data (si ja se n'ha presentat una part). */
	let desDe = $state('');
	const desDeValid = $derived(
		/^\d{4}-\d{2}-\d{2}$/.test(desDe) && desDe.startsWith(`${any}-`) ? desDe : undefined
	);

	const exp = $derived(
		exportValidacio(ascensions, CIMS, any, desDeValid ? { desDe: desDeValid } : {})
	);

	const TEXT_AVIS: Record<Avis, () => string> = {
		restriccio: m.validation_warning_restriction,
		repetit: m.validation_warning_repeated,
		'mes-de-100': m.validation_warning_over_100,
		'en-espera': m.validation_warning_waiting,
		'fora-del-repte': m.validation_warning_out
	};
	const TEXT_METODE: Record<Metode, () => string> = {
		'a-peu': m.method_a_peu,
		btt: m.method_btt,
		esqui: m.method_esqui,
		raquetes: m.method_raquetes
	};

	const TEXT_MOTIU: Record<MotiuExclusio, () => string> = {
		esborrada: m.validation_reason_deleted,
		metode: m.validation_reason_method,
		'fora-del-repte': m.validation_reason_out,
		futura: m.validation_reason_future,
		'cim-desconegut': m.validation_reason_unknown
	};
	const textMotiu = (motiu: MotiuExclusio) => TEXT_MOTIU[motiu]?.() ?? motiu;

	const nomCim = (id: number) => cimPerId(id)?.nom ?? `#${id}`;
	const comarcaCim = (id: number) => {
		const c = cimPerId(id);
		return c ? (comarcaPerSlug(c.comarca)?.nom ?? '') : '';
	};
	const altitudCim = (id: number) => {
		const c = cimPerId(id);
		return c ? `${formatAltitude(c.altitud)} m` : '';
	};

	const textTermini = $derived(
		termini.dies <= 0
			? m.validation_deadline_today({ date: formatDataLlarga(termini.dataLimit, locale) })
			: termini.dies === 1
				? m.validation_deadline_one({ date: formatDataLlarga(termini.dataLimit, locale) })
				: m.validation_deadline({
						date: formatDataLlarga(termini.dataLimit, locale),
						count: String(termini.dies),
						year: String(termini.any)
					})
	);

	function descarregarCsv() {
		const csv = csvValidacio(
			exp,
			CIMS,
			{
				capcalera: [
					m.validation_col_num(),
					m.validation_col_date(),
					m.validation_col_peak(),
					m.validation_col_altitude(),
					m.validation_col_comarca(),
					m.validation_col_method(),
					m.validation_col_warnings()
				],
				avis: Object.fromEntries(Object.entries(TEXT_AVIS).map(([k, f]) => [k, f()])) as Record<
					Avis,
					string
				>,
				metode: Object.fromEntries(Object.entries(TEXT_METODE).map(([k, f]) => [k, f()])) as Record<
					Metode,
					string
				>
			},
			COMARQUES
		);
		descarregarText(`carnetdecims-validacio-${exp.any}.csv`, csv, 'text/csv');
	}

	function imprimir() {
		window.print();
	}
</script>

<PageMeta title={m.validation_meta_title()} noindex />

<div class="pantalla">
	<h1 class="x-wide title">{m.validation_title()}</h1>
	<p class="lede">{m.validation_lede()}</p>

	<p class="avis-oficial" role="note">
		<Icon name="clipboard" size={20} />
		<span>
			{m.validation_not_official()}
			<a href={href('/repte-100-cims/com-validar')}>{m.validation_how_link()}</a>
			·
			<a href={URL_FULL_VALIDACIO_INDIVIDUAL} rel="noopener external" target="_blank"
				>{m.validation_official_sheet_link()}<span class="sr-only"
					>{m.validation_external_hint()}</span
				></a
			>
			·
			<a href={URL_REGISTRA} rel="noopener external" target="_blank"
				>{m.validation_feec_link()}<span class="sr-only">{m.validation_external_hint()}</span></a
			>
		</span>
	</p>

	<p class="termini mono" data-testid="validacio-termini">{textTermini}</p>

	{#if !$vives.carregat}
		<p class="mono estat" role="status">{m.app_loading()}</p>
	{:else if anys.length === 0}
		<EmptyState title={m.validation_empty_title()} icon="clipboard">
			<p>{m.validation_empty_text()}</p>
			{#snippet actions()}
				<Button
					href={registrarHref()}
					variant="stamp"
					size="lg"
					icon="stamp"
					onclick={(e: MouseEvent) => obrirRegistre(e)}
				>
					{m.app_empty_cta()}
				</Button>
			{/snippet}
		</EmptyState>
	{:else}
		<Card
			as="section"
			padding="md"
			variant="flat"
			aria-labelledby="{uid}-opcions"
			class="validacio-opcions"
		>
			<h2 id="{uid}-opcions" class="sr-only">{m.validation_options_title()}</h2>
			<div class="camps">
				<div class="camp">
					<label for="{uid}-any">{m.validation_year_label()}</label>
					<select
						id="{uid}-any"
						class="field"
						value={String(any)}
						onchange={(e) => {
							anyTriat = Number(e.currentTarget.value);
							desDe = '';
						}}
					>
						{#each anys as a (a)}
							<option value={String(a)}>{a}</option>
						{/each}
					</select>
				</div>
				<div class="camp">
					<label for="{uid}-des">{m.validation_from_label()}</label>
					<input
						id="{uid}-des"
						class="field date"
						type="date"
						min="{any}-01-01"
						max="{any}-12-31"
						bind:value={desDe}
						aria-describedby="{uid}-des-hint"
					/>
					<p id="{uid}-des-hint" class="hint">{m.validation_from_hint()}</p>
				</div>
			</div>
		</Card>

		<p class="resum" role="status" data-testid="validacio-resum">
			{m.validation_summary({
				count: String(exp.files.length),
				year: String(exp.any),
				new: String(exp.totalNous)
			})}
		</p>

		{#if exp.superaMaxim}
			<p class="alerta" role="note" data-testid="validacio-supera">
				<span class="signe" aria-hidden="true">!</span>
				<span>{m.validation_over_max({ count: String(exp.totalNous), year: String(exp.any) })}</span
				>
			</p>
		{/if}

		<div class="accions">
			<Button
				variant="ink"
				icon="download"
				onclick={descarregarCsv}
				disabled={exp.files.length === 0}
			>
				{m.validation_download_csv()}
			</Button>
			<Button variant="outline" icon="print" onclick={imprimir} disabled={exp.files.length === 0}>
				{m.validation_print()}
			</Button>
		</div>
		<p class="hint">{m.validation_print_hint()}</p>

		{#if exp.files.length === 0}
			<p class="buit">{m.validation_no_rows({ year: String(exp.any) })}</p>
		{:else}
			<div class="taula-wrap">
				<table class="taula" data-testid="validacio-taula">
					<caption class="sr-only">
						{m.validation_table_caption({ year: String(exp.any) })}
					</caption>
					<thead>
						<tr>
							<th scope="col" class="c-num">{m.validation_col_num()}</th>
							<th scope="col">{m.validation_col_peak()}</th>
							<th scope="col" class="c-data">{m.validation_col_date()}</th>
						</tr>
					</thead>
					<tbody>
						{#each exp.files as f (f.ascensioId)}
							<tr class={{ amb: f.avisos.length > 0 }}>
								<td class="c-num mono">{f.num}</td>
								<th scope="row" class="c-cim">
									<b>{nomCim(f.cimId)}</b>
									<small>{comarcaCim(f.cimId)} · {altitudCim(f.cimId)}</small>
									{#if f.avisos.length > 0}
										<ul class="avisos">
											{#each f.avisos as a (a)}
												<li class={['avis', a]}>
													<span class="signe" aria-hidden="true">!</span>{TEXT_AVIS[a]()}
												</li>
											{/each}
										</ul>
									{/if}
								</th>
								<td class="c-data">
									<span class="sr-only">{formatDataLlarga(f.data, locale)}</span>
									<span class="mono" aria-hidden="true">{dataFull(f.data)}</span>
									<small>{TEXT_METODE[f.metode]()}</small>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}

		{#if exp.excloses.length > 0}
			<section class="excloses" aria-labelledby="{uid}-excl" data-testid="validacio-excloses">
				<h2 id="{uid}-excl" class="x-wide">
					{m.validation_excluded_title({ count: String(exp.excloses.length) })}
				</h2>
				<p class="hint">{m.validation_excluded_text()}</p>
				<ul>
					{#each exp.excloses as e (e.ascensioId)}
						<li>
							<b>{nomCim(e.cimId)}</b>
							<span class="mono">{formatDataLlarga(e.data, locale)}</span>
							<span class="motiu">{textMotiu(e.motiu)}</span>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	{/if}
</div>

<!-- Full imprimible (només a la impressió): en blanc i negre, amb espais per escriure a mà. -->
{#if $vives.carregat && exp.files.length > 0}
	<div class="full-impres" aria-hidden="true">
		<header>
			<h2>{m.validation_print_title({ year: String(exp.any) })}</h2>
			<dl class="dades">
				<div>
					<dt>{m.validation_print_name()}</dt>
					<dd></dd>
				</div>
				<div>
					<dt>{m.validation_print_id()}</dt>
					<dd></dd>
				</div>
				<div>
					<dt>{m.validation_print_licence()}</dt>
					<dd></dd>
				</div>
				<div>
					<dt>{m.validation_print_club()}</dt>
					<dd></dd>
				</div>
			</dl>
		</header>
		<table>
			<thead>
				<tr>
					<th scope="col">{m.validation_col_num()}</th>
					<th scope="col">{m.validation_col_date()}</th>
					<th scope="col">{m.validation_col_peak()}</th>
					<th scope="col">{m.validation_col_altitude()}</th>
					<th scope="col">{m.validation_col_comarca()}</th>
					<th scope="col">{m.validation_col_method()}</th>
					<th scope="col">{m.validation_col_warnings()}</th>
				</tr>
			</thead>
			<tbody>
				{#each exp.files as f (f.ascensioId)}
					<tr>
						<td>{f.num}</td>
						<td class="nw">{dataFull(f.data)}</td>
						<td>{nomCim(f.cimId)}</td>
						<td class="nw">{altitudCim(f.cimId)}</td>
						<td>{comarcaCim(f.cimId)}</td>
						<td>{TEXT_METODE[f.metode]()}</td>
						<td>{f.avisos.map((a) => TEXT_AVIS[a]()).join('; ')}</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<footer>
			<p>{m.validation_print_footer()}</p>
			<p>{m.validation_print_generated({ date: formatDataLlarga(avui, locale) })}</p>
		</footer>
	</div>
{/if}

<style>
	.title {
		margin-bottom: var(--sp-3);
		font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1.05;
	}

	.lede {
		max-width: 44rem;
		color: var(--c-ink-2);
	}

	.avis-oficial {
		display: flex;
		gap: var(--sp-2);
		max-width: 44rem;
		margin-top: var(--sp-4);
		padding: var(--sp-3) var(--sp-4);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-paper-2);
		font-size: var(--fs-sm);
	}

	.avis-oficial :global(svg) {
		flex: none;
		margin-top: 1px;
	}

	.avis-oficial a {
		color: var(--c-ink);
		font-weight: var(--fw-semibold);
		text-underline-offset: 3px;
		overflow-wrap: anywhere;
	}

	.termini {
		max-width: 44rem;
		margin-top: var(--sp-3);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		color: var(--c-stamp-ink);
	}

	.estat {
		margin-top: var(--sp-6);
		color: var(--c-ink-2);
	}

	:global(.validacio-opcions) {
		max-width: 44rem;
		margin-top: var(--sp-5);
	}

	.camps {
		display: grid;
		gap: var(--sp-4);
	}

	@media (min-width: 36rem) {
		.camps {
			grid-template-columns: 10rem minmax(0, 1fr);
		}
	}

	.camp {
		display: grid;
		gap: var(--sp-1);
		align-content: start;
		min-width: 0;
	}

	.camp label {
		font-weight: var(--fw-bold);
		font-size: var(--fs-sm);
	}

	.field {
		width: 100%;
		min-height: var(--tap);
		padding: var(--sp-2) var(--sp-3);
		background: var(--c-paper);
		color: var(--c-ink);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		font-size: var(--fs-base);
	}

	.date {
		max-width: 14rem;
		font-family: var(--font-mono);
		font-weight: var(--fw-semibold);
	}

	.hint {
		margin-top: var(--sp-1);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
		max-width: 44rem;
	}

	.resum {
		margin-top: var(--sp-5);
		font-weight: var(--fw-bold);
	}

	.alerta {
		display: flex;
		gap: var(--sp-2);
		max-width: 44rem;
		margin-top: var(--sp-3);
		padding: var(--sp-2) var(--sp-3);
		border: 1.5px solid var(--c-stamp-ink);
		border-radius: var(--r-sm);
		background: var(--c-stamp-soft);
		font-size: var(--fs-sm);
	}

	.signe {
		display: inline-grid;
		place-items: center;
		flex: none;
		width: 1.15em;
		height: 1.15em;
		margin-inline-end: 0.35em;
		border: 1.5px solid currentColor;
		border-radius: 50%;
		font-size: 0.85em;
		font-weight: var(--fw-black);
		line-height: 1;
	}

	.alerta .signe {
		color: var(--c-stamp-ink);
		margin-top: 2px;
	}

	.accions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-3);
		margin-top: var(--sp-4);
	}

	.buit {
		margin-top: var(--sp-4);
		padding: var(--sp-4);
		border: var(--bw) dashed var(--c-ink-2);
		border-radius: var(--r-lg);
		color: var(--c-ink-2);
		max-width: 44rem;
	}

	.taula-wrap {
		max-width: 44rem;
		margin-top: var(--sp-5);
	}

	.taula {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
	}

	.taula thead th {
		padding: var(--sp-2);
		border-bottom: var(--bw) solid var(--c-line);
		font-family: var(--font-mono);
		font-size: var(--fs-2xs);
		font-weight: var(--fw-semibold);
		text-align: start;
		text-transform: uppercase;
		letter-spacing: var(--ls-caps);
		color: var(--c-ink-2);
	}

	.taula td,
	.taula tbody th {
		padding: var(--sp-2);
		border-bottom: 1px dashed var(--c-rule);
		vertical-align: top;
		text-align: start;
		font-weight: var(--fw-regular);
	}

	.c-num {
		width: 2.75rem;
	}

	.c-data {
		width: 6.5rem;
	}

	@media (min-width: 40rem) {
		.c-data {
			width: 9rem;
		}
	}

	.c-cim b {
		display: block;
		font-weight: var(--fw-bold);
		overflow-wrap: anywhere;
	}

	.taula small {
		display: block;
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.c-data .mono {
		font-size: var(--fs-sm);
	}

	.avisos {
		display: grid;
		gap: var(--sp-1);
		margin: var(--sp-2) 0 0;
		padding: 0;
		list-style: none;
	}

	.avis {
		display: flex;
		align-items: flex-start;
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		color: var(--c-stamp-ink);
	}

	.avis.en-espera,
	.avis.fora-del-repte,
	.avis.repetit {
		color: var(--c-ink);
	}

	.avis .signe {
		margin-top: 1px;
	}

	.excloses {
		max-width: 44rem;
		margin-top: var(--sp-8);
		padding-top: var(--sp-2);
		border-top: 1.5px solid var(--c-ink);
	}

	.excloses h2 {
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}

	.excloses ul {
		display: grid;
		gap: var(--sp-2);
		margin: var(--sp-3) 0 0;
		padding: 0;
		list-style: none;
	}

	.excloses li {
		display: grid;
		gap: 2px;
		padding: var(--sp-2) var(--sp-3);
		border: 1px solid var(--c-rule);
		border-radius: var(--r-sm);
		font-size: var(--fs-sm);
	}

	.excloses b {
		overflow-wrap: anywhere;
	}

	.excloses .mono {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.motiu {
		color: var(--c-ink-2);
	}

	/* ── Full imprimible ── */
	.full-impres {
		display: none;
	}

	@page {
		margin: 14mm 12mm;
	}

	@media print {
		/* Només el full: fora capçalera, navegació, peu, fulls i avisos (són fora de <main>). */
		:global(.skip-link),
		:global(.shell ~ *),
		:global(.shell > :not(main)),
		:global(main > :not(.full-impres)) {
			display: none !important;
		}

		:global(html),
		:global(body),
		:global(.shell),
		:global(main) {
			min-height: 0 !important;
			margin: 0 !important;
			padding: 0 !important;
			max-width: none !important;
			background: #fff !important;
			color: #000 !important;
		}

		.full-impres {
			display: block;
			color: #000;
			background: #fff;
			font-family: var(--font-wide);
			font-size: 10pt;
			line-height: 1.3;
		}

		.full-impres h2 {
			font-size: 14pt;
			font-weight: 900;
			margin: 0 0 4mm;
		}

		.dades {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 3mm 8mm;
			margin: 0 0 6mm;
		}

		.dades div {
			display: flex;
			align-items: flex-end;
			gap: 2mm;
		}

		.dades dt {
			font-weight: 700;
			white-space: nowrap;
		}

		.dades dd {
			flex: 1;
			min-height: 7mm;
			margin: 0;
			border-bottom: 1px solid #000;
		}

		.full-impres table {
			width: 100%;
			border-collapse: collapse;
		}

		.full-impres th,
		.full-impres td {
			padding: 1.5mm 2mm;
			border: 1px solid #000;
			text-align: start;
			vertical-align: top;
		}

		.full-impres thead th {
			font-size: 8.5pt;
			text-transform: uppercase;
			background: #fff;
		}

		.full-impres thead {
			display: table-header-group;
		}

		.full-impres tr {
			break-inside: avoid;
		}

		.nw {
			white-space: nowrap;
		}

		.full-impres footer {
			margin-top: 5mm;
			font-size: 8.5pt;
		}

		.full-impres footer p + p {
			margin-top: 1mm;
		}
	}
</style>
