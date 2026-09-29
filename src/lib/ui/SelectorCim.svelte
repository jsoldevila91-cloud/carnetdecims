<script lang="ts">
	import { tick } from 'svelte';
	import { CIMS, comarcaPerSlug } from '$lib/data/catalog';
	import type { CimCataleg } from '$lib/domain';
	import { m } from '$lib/paraglide/messages';
	import { formatAltitude } from './format';
	import { textCerca } from './filtre-cims';
	import { MAX_RESULTATS_CERCA, cercarCims } from './registre';

	/**
	 * Selector de cim amb cerca (patró combobox ARIA 1.2 amb llista en línia, sense popup
	 * flotant: cap dins del full a 320 px). Sense accents ni apòstrofs, per nom, àlies o comarca.
	 * Fletxes per moure's, Retorn per triar, Esc per netejar. Triat, es mostra la targeta del cim
	 * amb el botó "Canvia".
	 */
	let {
		cimId = $bindable(null),
		error,
		errorId
	}: {
		cimId?: number | null;
		/** Missatge d'error del camp (text visible, enllaçat amb `aria-describedby`). */
		error?: string;
		errorId: string;
	} = $props();

	const uid = $props.id();
	const inputId = `cim-${uid}`;
	const listId = `cim-list-${uid}`;
	const hintId = `cim-hint-${uid}`;
	const labelId = `cim-label-${uid}`;

	const textos = new Map(CIMS.map((c) => [c.id, textCerca(c, comarcaPerSlug(c.comarca)?.nom)]));

	let consulta = $state('');
	let actiu = $state(-1);
	let cercant = $state(false);
	let input: HTMLInputElement | undefined = $state();
	let canvia: HTMLButtonElement | undefined = $state();

	const triat = $derived(cimId === null ? undefined : CIMS.find((c) => c.id === cimId));
	const obert = $derived(!triat || cercant);
	const tots = $derived(cercarCims(consulta, CIMS, textos));
	const resultats = $derived(tots.slice(0, MAX_RESULTATS_CERCA));
	const expandit = $derived(obert && consulta.trim() !== '');

	$effect(() => {
		// Nova consulta: el primer resultat queda actiu (Retorn el tria directament).
		void consulta;
		actiu = resultats.length > 0 ? 0 : -1;
	});

	export function focus() {
		if (obert) input?.focus();
		else canvia?.focus();
	}

	async function triar(cim: CimCataleg) {
		cimId = cim.id;
		cercant = false;
		consulta = '';
		await tick();
		canvia?.focus();
	}

	async function obrirCerca() {
		cercant = true;
		await tick();
		input?.focus();
	}

	async function onkeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown' && resultats.length > 0) {
			event.preventDefault();
			actiu = (actiu + 1) % resultats.length;
		} else if (event.key === 'ArrowUp' && resultats.length > 0) {
			event.preventDefault();
			actiu = actiu <= 0 ? resultats.length - 1 : actiu - 1;
		} else if (event.key === 'Enter') {
			// Retorn no envia el formulari des del cercador.
			event.preventDefault();
			if (actiu >= 0 && resultats[actiu]) await triar(resultats[actiu]);
		} else if (event.key === 'Escape') {
			if (consulta) {
				// Esc buida la cerca i no tanca el full.
				event.preventDefault();
				event.stopPropagation();
				consulta = '';
			} else if (triat && cercant) {
				event.preventDefault();
				event.stopPropagation();
				cercant = false;
				await tick();
				canvia?.focus();
			}
		}
	}

	$effect(() => {
		// L'opció activa sempre visible dins de la llista.
		if (actiu < 0) return;
		document.getElementById(`${listId}-${actiu}`)?.scrollIntoView({ block: 'nearest' });
	});

	const nomComarca = (c: CimCataleg) => comarcaPerSlug(c.comarca)?.nom ?? '';
	const describedby = $derived([hintId, error ? errorId : null].filter(Boolean).join(' '));
</script>

<div class="selector">
	{#if triat && !cercant}
		<span class="lbl label" id={labelId}>{m.register_cim_label()}</span>
		<div class="triat">
			<div class="v">
				<b class="nom">{triat.nom}</b>
				<button
					bind:this={canvia}
					type="button"
					class="canvia"
					onclick={obrirCerca}
					aria-label={m.register_cim_change_label({ name: triat.nom })}
				>
					{m.register_cim_change()}
				</button>
			</div>
			<span class="hint mono">
				{#if triat.essencial}<span class="ess">◆ {m.register_essential()}</span><span class="sep"
						>·</span
					>
				{/if}{m.register_cim_selected({
					altitude: formatAltitude(triat.altitud),
					comarca: nomComarca(triat)
				})}
			</span>
		</div>
	{:else}
		<label class="lbl label" id={labelId} for={inputId}>{m.register_cim_label()}</label>
		<input
			bind:this={input}
			bind:value={consulta}
			id={inputId}
			class="cerca"
			type="text"
			role="combobox"
			autocomplete="off"
			autocapitalize="off"
			spellcheck="false"
			enterkeyhint="search"
			aria-autocomplete="list"
			aria-expanded={expandit}
			aria-controls={listId}
			aria-activedescendant={expandit && actiu >= 0 ? `${listId}-${actiu}` : undefined}
			aria-describedby={describedby}
			aria-invalid={error ? 'true' : undefined}
			placeholder={m.register_cim_search_label()}
			{onkeydown}
		/>
		<span id={hintId} class="hint mono">{m.register_cim_search_hint()}</span>

		<ul id={listId} class="llista" role="listbox" aria-labelledby={labelId} hidden={!expandit}>
			{#each resultats as cim, i (cim.id)}
				<!-- El focus és sempre al camp (aria-activedescendant); el clic tria l'opció. -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li
					id="{listId}-{i}"
					role="option"
					aria-selected={i === actiu}
					class={{ actiu: i === actiu }}
					onpointerdown={(e) => e.preventDefault()}
					onclick={() => triar(cim)}
				>
					<span class="o-nom">{cim.nom}</span>
					<span class="o-meta mono">
						{#if cim.essencial}<span class="ess" title={m.register_essential()}>◆</span>
						{/if}{formatAltitude(cim.altitud)} m · {nomComarca(cim)}
					</span>
				</li>
			{/each}
		</ul>
		{#if expandit}
			<p class="estat mono" role="status">
				{#if tots.length === 0}
					{m.register_cim_no_results()}
				{:else}
					{m.register_cim_results({
						count: String(tots.length)
					})}{#if tots.length > resultats.length}
						· {m.register_cim_more()}{/if}
				{/if}
			</p>
		{/if}
	{/if}

	{#if error}<p id={errorId} class="err">{error}</p>{/if}
</div>

<style>
	.selector {
		display: grid;
		gap: var(--sp-1);
	}

	.v {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--sp-3);
	}

	.nom {
		font-stretch: var(--stretch-semi);
		font-weight: var(--fw-heavy);
		font-size: var(--fs-lg);
		line-height: var(--lh-snug);
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.canvia {
		flex: none;
		min-height: var(--tap);
		min-width: var(--tap);
		padding: 0 var(--sp-2);
		margin-right: calc(-1 * var(--sp-2));
		background: none;
		border: 0;
		color: var(--c-stamp-ink);
		font-family: var(--font-mono);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}

	.hint {
		display: block;
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.ess {
		color: var(--c-stamp-ink);
		font-weight: var(--fw-semibold);
	}

	.sep {
		margin: 0 0.4em;
	}

	.cerca {
		width: 100%;
		min-height: var(--tap);
		padding: var(--sp-2) var(--sp-3);
		background: var(--c-paper);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		font-size: var(--fs-base);
	}

	.cerca[aria-invalid='true'] {
		border-color: var(--c-stamp-ink);
		border-width: 2px;
	}

	.llista {
		max-height: 15rem;
		overflow-y: auto;
		overscroll-behavior: contain;
		margin: var(--sp-1) 0 0;
		padding: 0;
		list-style: none;
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-card);
	}

	.llista[hidden] {
		display: none;
	}

	.llista li {
		display: grid;
		gap: 2px;
		min-height: var(--tap);
		padding: var(--sp-2) var(--sp-3);
		border-bottom: 1px solid var(--c-rule);
		cursor: pointer;
	}

	.llista li:last-child {
		border-bottom: 0;
	}

	.llista li.actiu {
		background: var(--c-paper-2);
		box-shadow: inset 4px 0 0 var(--c-stamp-ink);
	}

	.o-nom {
		font-weight: var(--fw-bold);
	}

	.o-meta {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.estat {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.err {
		color: var(--c-stamp-ink);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}
</style>
