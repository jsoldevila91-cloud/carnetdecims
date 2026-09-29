<script lang="ts">
	import { cimPerId } from './cim-per-id';
	import type { Ascensio, Metode } from '$lib/domain';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import Icon from './Icon.svelte';
	import Segell from './Segell.svelte';
	import { formatAltitude, formatDataLlarga, formatStampDate } from './format';

	/**
	 * Una ascensió de la llista (progrés i historial): segell, cim (enllaç a la fitxa), data,
	 * mètode i nota. Amb `onedit`/`ondelete` mostra els botons d'editar i esborrar.
	 */
	let {
		ascensio,
		repeticio = false,
		restriccio = false,
		onedit,
		ondelete
	}: {
		ascensio: Ascensio;
		repeticio?: boolean;
		restriccio?: boolean;
		onedit?: () => void;
		ondelete?: () => void;
	} = $props();

	const locale = getLocale();
	const METODE: Record<Metode, () => string> = {
		'a-peu': m.method_a_peu,
		btt: m.method_btt,
		esqui: m.method_esqui,
		raquetes: m.method_raquetes
	};

	const cim = $derived(cimPerId(ascensio.cimId));
	const data = $derived(formatDataLlarga(ascensio.data, locale));
	const dataSegell = $derived.by(() => {
		const [a, mes, dia] = ascensio.data.split('-').map(Number);
		return formatStampDate(new Date(a, mes - 1, dia));
	});
</script>

<article class="fila" data-ascensio={ascensio.id}>
	{#if cim}
		<Segell
			top={cim.nom}
			bottom={dataSegell}
			center={formatAltitude(cim.altitud)}
			sub={cim.essencial ? '◆' : ''}
			tone={repeticio ? 'ink' : 'stamp'}
			size={64}
			texture={false}
		/>
	{/if}
	<div class="cos">
		<h3 class="nom">
			{#if cim}<a href={href(`/cims/${cim.slug}`)}>{cim.nom}</a>{:else}#{ascensio.cimId}{/if}
		</h3>
		<p class="meta mono">
			<time datetime={ascensio.data}>{data}</time> · {METODE[ascensio.metode]()}
		</p>
		{#if repeticio || restriccio}
			<p class="tags">
				{#if repeticio}<span class="tag mono">{m.history_repeat()}</span>{/if}
				{#if restriccio}<span class="tag mono warn">! {m.history_restriction()}</span>{/if}
			</p>
		{/if}
		{#if ascensio.nota}
			<p class="nota"><span class="sr-only">{m.history_note()}: </span>{ascensio.nota}</p>
		{/if}
		{#if onedit || ondelete}
			<div class="accions">
				{#if onedit}
					<button
						type="button"
						class="accio"
						onclick={onedit}
						aria-label={m.history_edit_label({ cim: cim?.nom ?? '', date: data })}
					>
						{m.history_edit()}
					</button>
				{/if}
				{#if ondelete}
					<button
						type="button"
						class="accio del"
						onclick={ondelete}
						aria-label={m.history_delete_label({ cim: cim?.nom ?? '', date: data })}
					>
						<Icon name="close" size={16} />{m.history_delete()}
					</button>
				{/if}
			</div>
		{/if}
	</div>
</article>

<style>
	.fila {
		display: flex;
		gap: var(--sp-3);
		align-items: flex-start;
		padding: var(--sp-3) 0;
		border-bottom: 1px dashed var(--c-rule);
	}

	.cos {
		display: grid;
		gap: 2px;
		min-width: 0;
		flex: 1;
	}

	.nom {
		font-size: var(--fs-md);
		font-stretch: var(--stretch-semi);
		font-weight: var(--fw-heavy);
		line-height: var(--lh-snug);
		overflow-wrap: anywhere;
	}

	.nom a {
		color: inherit;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}

	.meta {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-1);
		margin-top: 2px;
	}

	.tag {
		padding: 1px var(--sp-2);
		border: 1px solid var(--c-line);
		border-radius: var(--r-xs);
		font-size: var(--fs-2xs);
		font-weight: var(--fw-semibold);
		color: var(--c-ink-2);
	}

	.tag.warn {
		border-color: var(--c-stamp-ink);
		color: var(--c-stamp-ink);
	}

	.nota {
		margin-top: var(--sp-1);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
		white-space: pre-line;
		overflow-wrap: anywhere;
	}

	.accions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
		margin-top: var(--sp-1);
	}

	.accio {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-1);
		min-height: var(--tap);
		min-width: var(--tap);
		padding: 0 var(--sp-3);
		background: var(--c-card);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		color: var(--c-ink);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		cursor: pointer;
	}

	.accio.del {
		color: var(--c-stamp-ink);
	}
</style>
