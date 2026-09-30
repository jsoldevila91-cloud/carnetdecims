<script lang="ts">
	import type { Ascensio, Metode, Segell as SegellCarnet, SegellFora } from '$lib/domain';
	import { comarcaPerSlug } from '$lib/data/catalog';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import Button from './Button.svelte';
	import { cimPerId } from './cim-per-id';
	import { dataSegellLlarga } from './carnet';
	import { formatAltitude, formatDataLlarga, romanPage } from './format';
	import Segell from './Segell.svelte';

	/**
	 * Detall d'un segell del carnet (dins del full inferior): cim amb enllaç a la fitxa, data,
	 * mètode, nota, estat per al repte, repeticions i accés a editar o registrar-ne una altra.
	 */
	let {
		segell,
		ascensions,
		onedit,
		onregister
	}: {
		segell: SegellCarnet | SegellFora;
		/** Totes les ascensions vives (per a la nota, el mètode i les repeticions). */
		ascensions: readonly Ascensio[];
		onedit: (id: string) => void;
		onregister: (event: MouseEvent, slug: string) => void;
	} = $props();

	const locale = getLocale();
	const METODE: Record<Metode, () => string> = {
		'a-peu': m.method_a_peu,
		btt: m.method_btt,
		esqui: m.method_esqui,
		raquetes: m.method_raquetes
	};

	const cim = $derived(cimPerId(segell.cimId));
	const comarca = $derived(cim ? comarcaPerSlug(cim.comarca) : undefined);
	const ascensio = $derived(ascensions.find((a) => a.id === segell.ascensioId));
	const repeticions = $derived(
		ascensions
			.filter((a) => a.cimId === segell.cimId && a.id !== segell.ascensioId)
			.sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0))
	);
	const posicio = $derived(
		'casella' in segell
			? segell.comptaPerRepte
				? m.stamp_detail_title({ n: String(segell.casella), page: romanPage(segell.pagina) })
				: m.stamp_detail_position_waiting({ n: String(segell.ordre) })
			: m.stamp_detail_position_extra({ n: String(segell.ordre) })
	);
	const estat = $derived(
		[
			segell.comptaPerRepte ? m.stamp_detail_counts() : m.stamp_detail_waiting(),
			segell.essencial ? m.stamp_detail_essential() : null
		]
			.filter(Boolean)
			.join(' · ')
	);
</script>

<div class="detall">
	<div class="cap">
		<Segell
			top={cim?.nom ?? `#${segell.cimId}`}
			bottom={dataSegellLlarga(segell.data)}
			center={cim ? formatAltitude(cim.altitud) : ''}
			sub={comarca?.nom ?? ''}
			tone={segell.comptaPerRepte ? 'stamp' : 'ink'}
			size={104}
			rotate={-6}
		/>
		<div class="titol">
			<!-- El nom del cim és el títol del full (H2); aquí, l'enllaç a la fitxa. -->
			<p class="posicio mono">{posicio}</p>
			{#if cim}
				<p class="nom">
					<a href={href(`/cims/${cim.slug}`)}>{m.stamp_detail_peak()}</a>
				</p>
				<p class="meta mono">
					{m.ess_peak_meta({ alt: formatAltitude(cim.altitud), comarca: comarca?.nom ?? '' })}
				</p>
			{/if}
		</div>
	</div>

	<dl class="dades">
		<div>
			<dt>{m.stamp_detail_date()}</dt>
			<dd><time datetime={segell.data}>{formatDataLlarga(segell.data, locale)}</time></dd>
		</div>
		{#if ascensio}
			<div>
				<dt>{m.stamp_detail_method()}</dt>
				<dd>{METODE[ascensio.metode]()}</dd>
			</div>
		{/if}
		<div>
			<dt>{m.stamp_detail_status()}</dt>
			<dd class={{ espera: !segell.comptaPerRepte }}>
				{estat}
			</dd>
		</div>
		{#if ascensio?.nota}
			<div class="full">
				<dt>{m.history_note()}</dt>
				<dd class="nota">{ascensio.nota}</dd>
			</div>
		{/if}
	</dl>

	<section class="repes" aria-label={m.stamp_detail_repeats_label()}>
		<p class="repes-t mono">
			{repeticions.length > 0
				? m.stamp_detail_repeats({ count: String(repeticions.length) })
				: m.stamp_detail_repeats_none()}
		</p>
		{#if repeticions.length > 0}
			<ul>
				{#each repeticions as r (r.id)}
					<li class="mono">
						<time datetime={r.data}>{formatDataLlarga(r.data, locale)}</time> · {METODE[r.metode]()}
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<div class="accions">
		{#if ascensio}
			<Button variant="ink" icon="stamp" onclick={() => onedit(ascensio.id)}>
				{m.stamp_detail_edit()}
			</Button>
		{/if}
		{#if cim}
			<Button
				variant="outline"
				href={`${href('/app/registrar')}?cim=${encodeURIComponent(cim.slug)}`}
				onclick={(e: MouseEvent) => onregister(e, cim.slug)}
			>
				{m.stamp_detail_register_again()}
			</Button>
		{/if}
	</div>
</div>

<style>
	.detall {
		display: grid;
		gap: var(--sp-4);
	}

	.cap {
		display: flex;
		align-items: center;
		gap: var(--sp-4);
	}

	.titol {
		min-width: 0;
	}

	.posicio {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.nom {
		margin: var(--sp-1) 0;
		font-weight: var(--fw-bold);
	}

	.nom a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		color: var(--c-ink);
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}

	.meta {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.dades {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
		gap: var(--sp-3);
		margin: 0;
		padding: var(--sp-3) 0;
		border-top: 1px dashed var(--c-rule);
		border-bottom: 1px dashed var(--c-rule);
	}

	.dades .full {
		grid-column: 1 / -1;
	}

	dt {
		font-family: var(--font-mono);
		font-size: var(--fs-2xs);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--c-ink-2);
	}

	dd {
		margin: 0;
		font-weight: var(--fw-semibold);
	}

	dd.espera {
		color: var(--c-ink-2);
	}

	.nota {
		font-weight: normal;
		white-space: pre-line;
		overflow-wrap: anywhere;
	}

	.repes-t {
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
	}

	.repes ul {
		margin: var(--sp-1) 0 0;
		padding-left: var(--sp-4);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.accions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
	}
</style>
