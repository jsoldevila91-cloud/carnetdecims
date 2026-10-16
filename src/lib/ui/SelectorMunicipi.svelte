<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { Municipi } from '$lib/domain';
	import { carregarMunicipis, cercarMunicipi } from '$lib/data/municipis';
	import { m } from '$lib/paraglide/messages';
	import Button from './Button.svelte';

	/**
	 * Cercador de municipi d'origen (patró combobox ARIA 1.2 amb llista en línia, com
	 * `SelectorCim`). El conjunt de municipis (~18 kB gzip) es baixa en muntar el component, no
	 * abans. Sense accents ni apòstrofs; també pel nom del nucli principal ("Barruera").
	 * Fletxes per moure's, Retorn per triar, Esc per buidar. El text que s'escriu no surt del
	 * component (ni URL ni registres).
	 */
	let {
		onselect
	}: {
		onselect: (municipi: Municipi) => void;
	} = $props();

	const MAX = 20;
	const uid = $props.id();
	const inputId = `mun-${uid}`;
	const listId = `mun-list-${uid}`;
	const hintId = `mun-hint-${uid}`;
	const labelId = `mun-label-${uid}`;

	let carrega = $state<'carregant' | 'ok' | 'error'>('carregant');
	let consulta = $state('');
	let trobats = $state<Municipi[]>([]);
	let actiu = $state(-1);
	let input: HTMLInputElement | undefined = $state();
	let reintent: HTMLElement | undefined;

	const resultats = $derived(trobats.slice(0, MAX));
	const expandit = $derived(carrega === 'ok' && consulta.trim() !== '');

	async function carregar() {
		carrega = 'carregant';
		try {
			await carregarMunicipis();
			carrega = 'ok';
		} catch {
			carrega = 'error';
		}
	}

	onMount(() => {
		void carregar();
	});

	export function focus() {
		if (carrega === 'error') reintent?.focus();
		else input?.focus();
	}

	$effect(() => {
		const q = consulta;
		if (carrega !== 'ok' || !q.trim()) {
			trobats = [];
			actiu = -1;
			return;
		}
		let viu = true;
		// Un més del màxim: així se sap si cal dir "continua escrivint".
		void cercarMunicipi(q, { limit: MAX + 1 }).then((r) => {
			if (!viu) return;
			trobats = r;
			actiu = r.length > 0 ? 0 : -1;
		});
		return () => {
			viu = false;
		};
	});

	$effect(() => {
		if (actiu < 0) return;
		document.getElementById(`${listId}-${actiu}`)?.scrollIntoView({ block: 'nearest' });
	});

	function triar(mun: Municipi) {
		consulta = '';
		onselect(mun);
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown' && resultats.length > 0) {
			event.preventDefault();
			actiu = (actiu + 1) % resultats.length;
		} else if (event.key === 'ArrowUp' && resultats.length > 0) {
			event.preventDefault();
			actiu = actiu <= 0 ? resultats.length - 1 : actiu - 1;
		} else if (event.key === 'Enter') {
			event.preventDefault();
			if (actiu >= 0 && resultats[actiu]) triar(resultats[actiu]);
		} else if (event.key === 'Escape' && consulta) {
			// Esc buida la cerca i no tanca el full.
			event.preventDefault();
			event.stopPropagation();
			consulta = '';
		}
	}

	function desaReintent(node: HTMLElement) {
		reintent = node;
		return () => {
			if (reintent === node) reintent = undefined;
		};
	}

	async function tornaAProvar() {
		await carregar();
		await tick();
		focus();
	}
</script>

<div class="selector">
	<label class="lbl label" id={labelId} for={inputId}>{m.origin_search_label()}</label>
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
		aria-describedby={hintId}
		disabled={carrega === 'error'}
		{onkeydown}
	/>
	<span id={hintId} class="hint">{m.origin_search_hint()}</span>

	<ul id={listId} class="llista" role="listbox" aria-labelledby={labelId} hidden={!expandit}>
		{#each resultats as mun, i (mun.codi)}
			<!-- El focus és sempre al camp (aria-activedescendant); el clic tria l'opció. -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<li
				id="{listId}-{i}"
				role="option"
				aria-selected={i === actiu}
				class={{ actiu: i === actiu }}
				onpointerdown={(e) => e.preventDefault()}
				onclick={() => triar(mun)}
			>
				<span class="o-nom">{mun.nom}</span>
				<span class="o-meta mono">
					{mun.cap ? `${mun.comarca} · ${m.origin_head({ cap: mun.cap })}` : mun.comarca}
				</span>
			</li>
		{/each}
	</ul>

	{#if carrega === 'carregant'}
		<p class="estat mono" role="status">{m.origin_loading()}</p>
	{:else if carrega === 'error'}
		<div class="error" role="alert">
			<p>{m.origin_load_error()}</p>
			<Button variant="ink" size="sm" icon="refresh" onclick={tornaAProvar} {@attach desaReintent}>
				{m.origin_retry()}
			</Button>
		</div>
	{:else if expandit}
		<p class="estat mono" role="status">
			{#if trobats.length === 0}
				{m.origin_no_results()}
			{:else}
				{trobats.length > MAX
					? `${m.origin_results({ count: String(resultats.length) })} · ${m.origin_more()}`
					: m.origin_results({ count: String(resultats.length) })}
			{/if}
		</p>
	{/if}
</div>

<style>
	.selector {
		display: grid;
		gap: var(--sp-1);
	}

	.hint {
		display: block;
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
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

	.cerca:disabled {
		opacity: 0.55;
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
		overflow-wrap: anywhere;
	}

	.o-meta {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.estat {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.error {
		display: grid;
		justify-items: start;
		gap: var(--sp-2);
		margin-top: var(--sp-2);
		padding: var(--sp-3);
		border: 1.5px solid var(--c-stamp-ink);
		border-radius: var(--r-sm);
		background: var(--c-stamp-soft);
		font-size: var(--fs-sm);
	}
</style>
