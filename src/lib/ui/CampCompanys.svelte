<script lang="ts">
	import { tick } from 'svelte';
	import {
		COMPANYS_MAX,
		COMPANY_MAX_CARACTERS,
		normalitzarCompany,
		normalitzarCompanys,
		suggerirCompanys,
		type AscensioAmbCompanys,
		type ErrorCompanys
	} from '$lib/domain';
	import { m } from '$lib/paraglide/messages';
	import Icon from './Icon.svelte';

	/**
	 * Camp "Companys" del diari de muntanya (formulari de registre i d'edició). Plegat per defecte
	 * perquè no destorbi el registre ràpid al cim; s'obre sol si l'ascensió ja en té.
	 *
	 * - Xips amb botó "Treu" (≥ 44 px) + entrada amb autocompletat (combobox ARIA 1.2 amb llista en
	 *   línia, com `SelectorCim`): Retorn o coma afegeixen el text escrit; amb les fletxes es tria
	 *   un suggeriment. Amb l'entrada buida, els companys més habituals surten com a botons.
	 * - Validació en viu amb `normalitzarCompanys` (repetits, massa noms, noms massa llargs). Els
	 *   límits només es mostren quan s'hi acosten.
	 * - El text escrit i no afegit encara (`text`) el formulari també el desa en enviar.
	 * Els noms són dades de terceres persones: no surten mai a la URL ni als registres.
	 */
	let {
		companys = $bindable([]),
		text = $bindable(''),
		ascensions,
		error
	}: {
		companys?: string[];
		/** Nom que s'està escrivint (encara no és una xip). */
		text?: string;
		/** Ascensions vives (per als suggeriments). */
		ascensions: readonly AscensioAmbCompanys[];
		/** Error del formulari en enviar (text visible). */
		error?: string;
	} = $props();

	const uid = $props.id();
	const ids = {
		panell: `companys-panell-${uid}`,
		input: `companys-input-${uid}`,
		label: `companys-label-${uid}`,
		hint: `companys-hint-${uid}`,
		llista: `companys-sugg-${uid}`,
		err: `companys-err-${uid}`,
		limits: `companys-limits-${uid}`
	};
	const AVIS_CARACTERS = COMPANY_MAX_CARACTERS - 10;
	const AVIS_COMPANYS = COMPANYS_MAX - 2;

	let obert = $state(false);
	let actiu = $state(-1);
	let avis = $state('');
	let errorLocal = $state('');
	let input: HTMLInputElement | undefined = $state();
	let llistaXips: HTMLUListElement | undefined = $state();

	// En editar, els companys arriben després de muntar: si n'hi ha, el camp s'obre.
	$effect(() => {
		if (companys.length > 0) obert = true;
	});

	const caracters = $derived(Array.from(normalitzarCompany(text)).length);
	const massaLlarg = $derived(caracters > COMPANY_MAX_CARACTERS);
	const suggeriments = $derived(
		text.trim() ? suggerirCompanys(ascensions, { text, exclou: companys, limit: 6 }) : []
	);
	const habituals = $derived(
		text.trim() || companys.length >= COMPANYS_MAX
			? []
			: suggerirCompanys(ascensions, { exclou: companys, limit: 5 })
	);
	const expandit = $derived(suggeriments.length > 0);

	$effect(() => {
		// Text nou: cap suggeriment actiu (Retorn afegeix el que s'ha escrit).
		void text;
		actiu = -1;
	});

	const TEXT_ERROR: Record<ErrorCompanys, () => string> = {
		massa: () => m.partners_error_many({ max: String(COMPANYS_MAX) }),
		'massa-llarg': () => m.partners_error_long({ max: String(COMPANY_MAX_CARACTERS) }),
		format: m.partners_error_format
	};

	const errorVisible = $derived(
		massaLlarg ? TEXT_ERROR['massa-llarg']() : errorLocal || error || ''
	);
	/** Límits: només quan s'hi acosta (caràcters del nom que s'escriu, nombre de companys). */
	const limits = $derived(
		[
			caracters >= AVIS_CARACTERS
				? m.partners_chars({ count: String(caracters), max: String(COMPANY_MAX_CARACTERS) })
				: null,
			companys.length >= AVIS_COMPANYS
				? m.partners_count({ count: String(companys.length), max: String(COMPANYS_MAX) })
				: null
		]
			.filter(Boolean)
			.join(' · ')
	);
	const describedby = $derived(
		[ids.hint, limits ? ids.limits : null, errorVisible ? ids.err : null].filter(Boolean).join(' ')
	);

	/** Obre el camp i hi posa el focus (p. ex. si el formulari hi troba un error). */
	export async function focus() {
		obert = true;
		await tick();
		input?.focus();
	}

	async function commuta() {
		obert = !obert;
		if (obert) {
			await tick();
			input?.focus();
		}
	}

	/** Afegeix un nom. Retorna `false` si no s'ha pogut (l'error ja es mostra). */
	function afegir(nom: string): boolean {
		const net = normalitzarCompany(nom);
		if (!net) return true;
		const r = normalitzarCompanys([...companys, net]);
		if (!r.ok) {
			errorLocal = TEXT_ERROR[r.error]();
			return false;
		}
		errorLocal = '';
		text = '';
		if (r.companys.length === companys.length) {
			avis = m.partners_duplicate({ nom: net });
			return true;
		}
		companys = r.companys;
		avis = m.partners_added({ nom: net });
		return true;
	}

	async function afegirHabitual(nom: string) {
		afegir(nom);
		await tick();
		input?.focus();
	}

	async function treure(i: number) {
		const nom = companys[i];
		companys = companys.filter((_, j) => j !== i);
		errorLocal = '';
		avis = m.partners_removed({ nom });
		await tick();
		// El focus va a la xip que ocupa el lloc (o l'anterior); si no en queda cap, a l'entrada.
		const botons = llistaXips?.querySelectorAll<HTMLButtonElement>('button') ?? [];
		(botons[Math.min(i, botons.length - 1)] ?? input)?.focus();
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown' && expandit) {
			event.preventDefault();
			actiu = (actiu + 1) % suggeriments.length;
		} else if (event.key === 'ArrowUp' && expandit) {
			event.preventDefault();
			actiu = actiu <= 0 ? suggeriments.length - 1 : actiu - 1;
		} else if (event.key === 'Enter') {
			// Retorn no envia el formulari des d'aquest camp.
			event.preventDefault();
			afegir(actiu >= 0 && suggeriments[actiu] ? suggeriments[actiu] : text);
		} else if (event.key === 'Escape' && (text || actiu >= 0)) {
			// Esc buida l'entrada i no tanca el full.
			event.preventDefault();
			event.stopPropagation();
			text = '';
		}
	}

	/**
	 * La coma separa noms (també en enganxar "Inesa, Pau"). Es fa a l'`input` i no al `keydown`:
	 * els teclats virtuals d'Android no sempre envien la tecla.
	 */
	function oninput(event: Event & { currentTarget: HTMLInputElement }) {
		if (errorLocal) errorLocal = '';
		const valor = event.currentTarget.value;
		if (!valor.includes(',')) return;
		const parts = valor.split(',');
		const resta = parts.pop() ?? '';
		for (let i = 0; i < parts.length; i++) {
			if (!afegir(parts[i])) {
				// No hi cap (massa noms o massa llarg): el text es queda per corregir-lo.
				text = [...parts.slice(i), resta].join(',');
				return;
			}
		}
		text = resta;
	}
</script>

<div class="companys">
	<button
		type="button"
		class="commuta"
		aria-expanded={obert}
		aria-controls={ids.panell}
		onclick={commuta}
	>
		<span class="signe" aria-hidden="true">{obert ? '−' : '+'}</span>
		<span class="label">
			{!obert && companys.length > 0
				? m.partners_toggle_count({ count: String(companys.length) })
				: m.partners_toggle()}
		</span>
	</button>

	<div id={ids.panell} class="panell" hidden={!obert}>
		{#if companys.length > 0}
			<ul class="xips" aria-label={m.partners_list_label()} bind:this={llistaXips}>
				{#each companys as nom, i (nom)}
					<li class="xip">
						<span class="nom">{nom}</span>
						<button
							type="button"
							class="treu"
							aria-label={m.partners_remove_label({ nom })}
							onclick={() => treure(i)}
						>
							<Icon name="close" size={16} strokeWidth={2.2} />
						</button>
					</li>
				{/each}
			</ul>
		{/if}

		<label class="lbl" id={ids.label} for={ids.input}>{m.partners_label()}</label>
		<div class="entrada">
			<input
				bind:this={input}
				bind:value={text}
				id={ids.input}
				class="camp"
				type="text"
				role="combobox"
				autocomplete="off"
				autocapitalize="words"
				spellcheck="false"
				enterkeyhint="enter"
				aria-autocomplete="list"
				aria-expanded={expandit}
				aria-controls={ids.llista}
				aria-activedescendant={expandit && actiu >= 0 ? `${ids.llista}-${actiu}` : undefined}
				aria-describedby={describedby}
				aria-invalid={errorVisible ? 'true' : undefined}
				{onkeydown}
				{oninput}
			/>
			<button
				type="button"
				class="afegeix"
				onclick={() => {
					afegir(text);
					input?.focus();
				}}
				disabled={!text.trim()}
			>
				<Icon name="plus" size={18} />{m.partners_add()}
			</button>
		</div>
		<span id={ids.hint} class="hint">{m.partners_hint()}</span>

		<ul
			id={ids.llista}
			class="llista"
			role="listbox"
			aria-labelledby={ids.label}
			hidden={!expandit}
		>
			{#each suggeriments as nom, i (nom)}
				<!-- El focus és sempre al camp (aria-activedescendant); el clic tria l'opció. -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li
					id="{ids.llista}-{i}"
					role="option"
					aria-selected={i === actiu}
					class={{ actiu: i === actiu }}
					onpointerdown={(e) => e.preventDefault()}
					onclick={() => afegirHabitual(nom)}
				>
					{nom}
				</li>
			{/each}
		</ul>

		{#if habituals.length > 0}
			<div class="habituals" role="group" aria-label={m.partners_suggestions_label()}>
				{#each habituals as nom (nom)}
					<button
						type="button"
						class="habitual"
						aria-label={m.partners_add_label({ nom })}
						onclick={() => afegirHabitual(nom)}
					>
						<Icon name="plus" size={14} strokeWidth={2.2} />{nom}
					</button>
				{/each}
			</div>
		{/if}

		{#if limits}
			<p id={ids.limits} class="limits mono">{limits}</p>
		{/if}
	</div>

	{#if errorVisible}
		<p id={ids.err} class="err">{errorVisible}</p>
	{/if}
	<!-- Afegit / tret / repetit: s'anuncia sense moure el focus. -->
	<p class="sr-only" aria-live="polite">{avis}</p>
</div>

<style>
	.companys {
		display: grid;
		gap: var(--sp-2);
	}

	.commuta {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
		justify-self: start;
		min-height: var(--tap);
		padding: 0 var(--sp-2) 0 0;
		background: none;
		border: 0;
		color: var(--c-ink);
		cursor: pointer;
	}

	.signe {
		display: grid;
		place-items: center;
		width: 1.5rem;
		height: 1.5rem;
		border: 1.8px solid var(--c-line);
		border-radius: var(--r-xs);
		font-family: var(--font-mono);
		font-weight: var(--fw-bold);
		line-height: 1;
	}

	.panell {
		display: grid;
		gap: var(--sp-1);
	}

	.panell[hidden] {
		display: none;
	}

	.xips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
		margin: 0 0 var(--sp-2);
		padding: 0;
		list-style: none;
	}

	.xip {
		display: inline-flex;
		align-items: center;
		max-width: 100%;
		min-height: var(--tap);
		padding-left: var(--sp-3);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-full);
		background: var(--c-paper-2);
		font-weight: var(--fw-semibold);
	}

	.xip .nom {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.treu {
		display: grid;
		place-items: center;
		flex: none;
		width: var(--tap);
		height: var(--tap);
		margin: -1px 0;
		background: none;
		border: 0;
		border-radius: var(--r-full);
		color: var(--c-ink);
		cursor: pointer;
	}

	.lbl {
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		color: var(--c-ink-2);
	}

	.entrada {
		display: flex;
		gap: var(--sp-2);
		min-width: 0;
	}

	.camp {
		flex: 1 1 auto;
		min-width: 0;
		min-height: var(--tap);
		padding: var(--sp-2) var(--sp-3);
		background: var(--c-paper);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		font-size: var(--fs-base);
	}

	.camp[aria-invalid='true'] {
		border-color: var(--c-stamp-ink);
		border-width: 2px;
	}

	.afegeix {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-1);
		flex: none;
		min-height: var(--tap);
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

	.afegeix:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.hint,
	.limits {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.llista {
		max-height: 13rem;
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
		display: flex;
		align-items: center;
		min-height: var(--tap);
		padding: var(--sp-2) var(--sp-3);
		border-bottom: 1px solid var(--c-rule);
		font-weight: var(--fw-semibold);
		overflow-wrap: anywhere;
		cursor: pointer;
	}

	.llista li:last-child {
		border-bottom: 0;
	}

	.llista li.actiu {
		background: var(--c-paper-2);
		box-shadow: inset 4px 0 0 var(--c-stamp-ink);
	}

	.habituals {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
		margin-top: var(--sp-1);
	}

	.habitual {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-1);
		max-width: 100%;
		min-height: var(--tap);
		padding: 0 var(--sp-3);
		background: transparent;
		border: var(--bw) dashed var(--c-line);
		border-radius: var(--r-full);
		color: var(--c-ink);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		overflow-wrap: anywhere;
		text-align: left;
		cursor: pointer;
	}

	.err {
		color: var(--c-stamp-ink);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}
</style>
