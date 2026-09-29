<script lang="ts">
	import { onMount, tick, untrack } from 'svelte';
	import {
		ErrorAscensioNoTrobada,
		ErrorValidacio,
		NOTA_MAX,
		ascensionsVives,
		llistarAscensions,
		validarAscensio,
		type CampAscensio,
		type CodiErrorValidacio,
		type NovaAscensio
	} from '$lib/data/ascensions';
	import { CIMS, cimPerSlug, comarcaPerSlug } from '$lib/data/catalog';
	import {
		DATA_INICI_REPTE,
		METODES,
		avuiLocal,
		esDataIsoValida,
		type Ascensio,
		type Metode
	} from '$lib/domain';
	import { getLocale } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
	import Segell from './Segell.svelte';
	import SelectorCim from './SelectorCim.svelte';
	import { editarAscensio, registrarAscensio } from './accions-ascensio';
	import { formatAltitude, formatDataLlarga, formatStampDate } from './format';
	import { avisosRegistre } from './registre';

	/**
	 * Formulari "Registrar ascensió" (i "Editar"). El mateix component va al full inferior
	 * (shallow routing) i a la pàgina /app/registrar. Valida amb el contracte de dades
	 * (`validarAscensio`), mostra els errors al costat de cada camp i un resum, i avisa sense
	 * bloquejar (restricció d'accés, repetició, límit anual).
	 */
	let {
		cim,
		ascensioId,
		ondone
	}: {
		/** Slug del cim preseleccionat (`?cim=` o des de la fitxa). */
		cim?: string;
		/** Id de l'ascensió que s'edita (mode edició). */
		ascensioId?: string;
		/** Desat correctament (el full es tanca; la pàgina navega). */
		ondone?: (a: Ascensio) => void;
	} = $props();

	const uid = $props.id();
	const ids = {
		resum: `reg-resum-${uid}`,
		cim: `reg-cim-err-${uid}`,
		data: `reg-data-${uid}`,
		metode: `reg-metode-${uid}`,
		nota: `reg-nota-${uid}`
	};
	const locale = getLocale();
	const avui = avuiLocal();
	const vives = ascensionsVives();

	let cimId = $state<number | null>(untrack(() => (cim ? (cimPerSlug(cim)?.id ?? null) : null)));
	let data = $state(avui);
	let metode = $state<Metode>('a-peu');
	let nota = $state('');
	let original = $state<Ascensio | undefined>();
	let carregant = $state(untrack(() => !!ascensioId));
	let intentat = $state(false);
	let desant = $state(false);
	let errorGeneral = $state('');
	let selector: SelectorCim | undefined = $state();
	let form: HTMLFormElement | undefined = $state();

	onMount(async () => {
		if (!ascensioId) return;
		const a = (await llistarAscensions()).find((x) => x.id === ascensioId);
		if (a) {
			original = a;
			cimId = a.cimId;
			data = a.data;
			metode = a.metode;
			nota = a.nota ?? '';
		} else errorGeneral = m.register_error_not_found();
		carregant = false;
	});

	const valors = $derived<NovaAscensio>({
		cimId: cimId ?? -1,
		data,
		metode,
		nota
	});
	const errors = $derived(intentat ? validarAscensio(valors, avui) : []);
	const errorDe = (camp: CampAscensio) => errors.find((e) => e.camp === camp);

	const TEXT_ERROR: Record<CodiErrorValidacio, () => string> = {
		'cimId:desconegut': m.register_error_cim,
		'data:format': m.register_error_date_format,
		'data:anterior-inici': m.register_error_date_before,
		'data:futura': m.register_error_date_future,
		'metode:invalid': m.register_error_method,
		'nota:format': m.register_error_note,
		'nota:massa-llarga': m.register_error_note
	};
	const textError = (camp: CampAscensio) => {
		const e = errorDe(camp);
		return e ? TEXT_ERROR[e.codi]() : undefined;
	};

	const ETIQUETA_METODE: Record<Metode, () => string> = {
		'a-peu': m.method_a_peu,
		btt: m.method_btt,
		esqui: m.method_esqui,
		raquetes: m.method_raquetes
	};

	const cimTriat = $derived(cimId === null ? undefined : CIMS.find((c) => c.id === cimId));
	const avisos = $derived(
		avisosRegistre({ cimId, data }, $vives, CIMS, { excloureId: original?.id ?? ascensioId })
	);
	const llargadaNota = $derived(Array.from(nota).length);

	const dataSegell = $derived.by(() => {
		if (!esDataIsoValida(data)) return '';
		const [a, mes, dia] = data.split('-').map(Number);
		return formatStampDate(new Date(a, mes - 1, dia));
	});

	/** Primer camp amb error: hi va el focus (l'error s'hi llegeix per `aria-describedby`). */
	async function enfocarPrimerError() {
		await tick();
		const primer = errors[0]?.camp;
		if (primer === 'cimId') selector?.focus();
		else if (primer === 'data') form?.querySelector<HTMLElement>(`#${ids.data}`)?.focus();
		else if (primer === 'metode')
			form?.querySelector<HTMLElement>(`input[name="metode-${uid}"]`)?.focus();
		else if (primer === 'nota') form?.querySelector<HTMLElement>(`#${ids.nota}`)?.focus();
	}

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		if (desant || carregant) return;
		intentat = true;
		errorGeneral = '';
		if (validarAscensio(valors, avui).length > 0) {
			await enfocarPrimerError();
			return;
		}
		desant = true;
		try {
			const nova: NovaAscensio = { cimId: cimId!, data, metode, nota };
			const desada = original
				? await editarAscensio(original, nova)
				: await registrarAscensio(nova);
			ondone?.(desada);
		} catch (err) {
			if (err instanceof ErrorValidacio) await enfocarPrimerError();
			else if (err instanceof ErrorAscensioNoTrobada) errorGeneral = m.register_error_not_found();
			else errorGeneral = m.register_error_generic();
		} finally {
			desant = false;
		}
	}
</script>

<form bind:this={form} class="register-panel" novalidate {onsubmit} aria-busy={carregant}>
	<!-- Resum d'errors: regió viva sempre present (s'anuncia en aparèixer). -->
	<div id={ids.resum} class="resum-viu" aria-live="polite">
		{#if errors.length > 0 || errorGeneral}
			<div class="resum" role="group" aria-labelledby="{ids.resum}-t">
				<p id="{ids.resum}-t" class="resum-t">
					<Icon name="close" size={18} />{errorGeneral || m.register_errors_title()}
				</p>
				{#if errors.length > 0}
					<ul>
						{#each errors as e (e.codi)}
							<li>{TEXT_ERROR[e.codi]()}</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
	</div>

	<div class="slip">
		<div class="line">
			<SelectorCim bind:this={selector} bind:cimId error={textError('cimId')} errorId={ids.cim} />
		</div>

		<div class="line">
			<label class="label" for={ids.data}>{m.register_date_label()}</label>
			<input
				id={ids.data}
				class="field date"
				type="date"
				required
				min={DATA_INICI_REPTE}
				max={avui}
				bind:value={data}
				aria-invalid={errorDe('data') ? 'true' : undefined}
				aria-describedby="{ids.data}-hint{errorDe('data') ? ` ${ids.data}-err` : ''}"
			/>
			<span id="{ids.data}-hint" class="hint mono">{m.register_date_hint()}</span>
			{#if errorDe('data')}<p id="{ids.data}-err" class="err">{textError('data')}</p>{/if}
		</div>

		<fieldset class="line" aria-describedby={errorDe('metode') ? `${ids.metode}-err` : undefined}>
			<legend class="label">{m.register_method_label()}</legend>
			<div class="checks">
				{#each METODES as met (met)}
					<label class="check">
						<input type="radio" name="metode-{uid}" value={met} bind:group={metode} />
						<span class="box" aria-hidden="true"
							><Icon name="check" size={16} strokeWidth={3} /></span
						>
						<span>{ETIQUETA_METODE[met]()}</span>
					</label>
				{/each}
			</div>
			{#if errorDe('metode')}<p id="{ids.metode}-err" class="err">{textError('metode')}</p>{/if}
		</fieldset>

		<div class="line last">
			<label class="label" for={ids.nota}>{m.register_note_label()}</label>
			<textarea
				id={ids.nota}
				class="field nota"
				rows="3"
				maxlength={NOTA_MAX}
				bind:value={nota}
				aria-invalid={errorDe('nota') ? 'true' : undefined}
				aria-describedby="{ids.nota}-count{errorDe('nota') ? ` ${ids.nota}-err` : ''}"></textarea>
			<span id="{ids.nota}-count" class="hint mono count"
				>{m.register_note_count({ count: String(llargadaNota), max: String(NOTA_MAX) })}</span
			>
			{#if errorDe('nota')}<p id="{ids.nota}-err" class="err">{textError('nota')}</p>{/if}
		</div>
	</div>

	<!-- Avisos no bloquejants: s'anuncien en aparèixer. -->
	<div class="avisos" aria-live="polite">
		{#each avisos as avis (avis.tipus)}
			<p class={['avis', avis.tipus]}>
				<span class="avis-ic" aria-hidden="true">!</span>
				<span>
					{#if avis.tipus === 'restriccio'}
						{avis.incerta ? m.register_warn_restriction_uncertain() : m.register_warn_restriction()}
					{:else if avis.tipus === 'repeticio'}
						{m.register_warn_repeat({ date: formatDataLlarga(avis.dataAnterior, locale) })}
					{:else}
						{m.register_warn_year({ year: String(avis.any), count: String(avis.cimsNoves) })}
					{/if}
				</span>
			</p>
		{/each}
	</div>

	<div class="preview">
		{#if cimTriat && dataSegell}
			<Segell
				top={cimTriat.nom}
				bottom={dataSegell}
				center={formatAltitude(cimTriat.altitud)}
				sub={cimTriat.essencial
					? `◆ ${m.register_essential()}`
					: (comarcaPerSlug(cimTriat.comarca)?.nom ?? '')}
				rotate={-7}
				size={88}
				label={m.register_preview_label({
					name: cimTriat.nom,
					altitude: formatAltitude(cimTriat.altitud),
					date: formatDataLlarga(data, locale)
				})}
			/>
		{:else}
			<span class="slot" aria-hidden="true"><Icon name="stamp" size={30} /></span>
		{/if}
		<p class="note">
			{m.register_local_note()}
			{m.register_validation_note()}
		</p>
	</div>

	<Button type="submit" variant="stamp" size="lg" icon="stamp" block disabled={desant || carregant}>
		{desant ? m.register_saving() : original ? m.register_save_edit() : m.register_submit()}
	</Button>
</form>

<style>
	.register-panel {
		display: grid;
		gap: var(--sp-4);
	}

	.resum-viu:empty {
		display: none;
	}

	.resum {
		padding: var(--sp-3) var(--sp-4);
		border: 2px solid var(--c-stamp-ink);
		border-radius: var(--r-md);
		background: var(--c-stamp-soft);
		color: var(--c-ink);
	}

	.resum-t {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		font-weight: var(--fw-bold);
		color: var(--c-stamp-ink);
	}

	.resum ul {
		margin: var(--sp-1) 0 0;
		padding-left: var(--sp-6);
		font-size: var(--fs-sm);
	}

	.slip {
		background: var(--c-card);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-lg);
		box-shadow: var(--sh-3);
		padding: var(--sp-1) var(--sp-4) var(--sp-3);
	}

	.line {
		display: grid;
		gap: var(--sp-1);
		min-width: 0;
		margin: 0;
		padding: var(--sp-3) 0;
		border: 0;
		border-bottom: 1px solid var(--c-rule);
	}

	.line.last {
		border-bottom: 0;
		padding-bottom: 0;
	}

	legend {
		float: left;
		width: 100%;
		padding: 0;
	}

	.field {
		width: 100%;
		min-height: var(--tap);
		padding: var(--sp-2) var(--sp-3);
		background: var(--c-paper);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		font-size: var(--fs-base);
	}

	.field[aria-invalid='true'] {
		border-color: var(--c-stamp-ink);
		border-width: 2px;
	}

	.date {
		font-family: var(--font-mono);
		font-weight: var(--fw-semibold);
		letter-spacing: 0.04em;
		max-width: 14rem;
	}

	.nota {
		resize: vertical;
		line-height: var(--lh-body);
		background:
			repeating-linear-gradient(transparent 0 calc(1lh - 1px), var(--c-rule) calc(1lh - 1px) 1lh) 0
				var(--sp-2) / 100% calc(100% - var(--sp-2)) no-repeat,
			var(--c-paper);
	}

	.hint {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.count {
		justify-self: end;
	}

	.err {
		color: var(--c-stamp-ink);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}

	.checks {
		clear: both;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0 var(--sp-3);
		padding-top: var(--sp-1);
	}

	.check {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		min-height: var(--tap);
		font-weight: var(--fw-semibold);
		cursor: pointer;
	}

	/* Ràdio natiu (radiogroup accessible) amb aparença de casella del carnet. */
	.check input {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		opacity: 0;
		cursor: pointer;
	}

	.box {
		display: grid;
		place-items: center;
		flex: none;
		width: 1.5rem;
		height: 1.5rem;
		border: 1.8px solid var(--c-line);
		border-radius: var(--r-xs);
		background: var(--c-paper);
		color: var(--c-stamp-ink);
	}

	.box :global(svg) {
		opacity: 0;
	}

	.check input:checked + .box {
		border-width: 2.5px;
		border-color: var(--c-stamp-ink);
	}

	.check input:checked + .box :global(svg) {
		opacity: 1;
	}

	.check input:focus-visible + .box {
		outline: 3px solid var(--c-focus);
		outline-offset: 2px;
	}

	.avisos:empty {
		display: none;
	}

	.avisos {
		display: grid;
		gap: var(--sp-2);
	}

	.avis {
		display: flex;
		gap: var(--sp-3);
		padding: var(--sp-3);
		border: var(--bw) dashed var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-paper-2);
		font-size: var(--fs-sm);
	}

	.avis-ic {
		display: grid;
		place-items: center;
		flex: none;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: var(--r-full);
		background: var(--c-ink);
		color: var(--c-on-ink);
		font-family: var(--font-mono);
		font-weight: var(--fw-bold);
	}

	.avis.restriccio .avis-ic {
		background: var(--c-stamp);
		color: var(--c-on-stamp);
	}

	.preview {
		display: flex;
		align-items: center;
		gap: var(--sp-4);
	}

	.slot {
		display: grid;
		place-items: center;
		flex: none;
		width: 88px;
		height: 88px;
		border: 2px dashed var(--c-rule);
		border-radius: var(--r-full);
		color: var(--c-ink-2);
	}

	.note {
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}
</style>
