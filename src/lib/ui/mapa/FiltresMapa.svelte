<script lang="ts">
	import { ZONES, type Zona } from '$lib/domain';
	import { FRANGES, FRANGES_ALTITUD, type FranjaAltitud } from '$lib/domain/filtres-cims';
	import {
		comarquesAmbCims,
		filtresMapaActius,
		type EstatFiltre,
		type FiltresMapa
	} from '$lib/data/catalog';
	import { m } from '$lib/paraglide/messages';
	import Chip from '../Chip.svelte';
	import Icon from '../Icon.svelte';
	import { NOM_ZONA } from '../zona';
	import { formatAltitude } from '../format';

	/**
	 * Filtres del mapa (els mateixos que `/cims` + comarca i estat): xips per als més usats i
	 * la resta en un panell desplegable (no modal). Cada canvi crida `onchange` amb un objecte nou.
	 */
	let { filtres, onchange }: { filtres: FiltresMapa; onchange: (f: FiltresMapa) => void } =
		$props();

	let obert = $state(false);
	const uid = $props.id();

	const COMARQUES = comarquesAmbCims();
	const ETIQUETA_FRANJA: Record<FranjaAltitud, () => string> = {
		'fins-1000': m.filters_alt_fins_1000,
		'1000-2000': m.filters_alt_1000_2000,
		'2000-3000': m.filters_alt_2000_3000,
		'des-3000': m.filters_alt_des_3000
	};

	const actius = $derived(filtresMapaActius(filtres));
	/** Filtres actius dins del panell (per al comptador del botó quan és tancat). */
	const nPanell = $derived(
		[
			filtres.zona,
			filtres.comarca,
			filtres.altMin ?? filtres.altMax,
			filtres.estat && filtres.estat !== 'tots' ? filtres.estat : undefined
		].filter((v) => v !== undefined).length
	);

	const franja = $derived.by((): FranjaAltitud | '' | 'personal' => {
		if (filtres.altMin === undefined && filtres.altMax === undefined) return '';
		const min = filtres.altMin ?? 0;
		const max = filtres.altMax ?? Infinity;
		return (
			FRANGES.find((k) => FRANGES_ALTITUD[k][0] === min && FRANGES_ALTITUD[k][1] === max) ??
			'personal'
		);
	});

	function canvia(parcial: Partial<FiltresMapa>) {
		const f: FiltresMapa = { ...filtres, ...parcial };
		for (const k of Object.keys(f) as (keyof FiltresMapa)[]) if (f[k] === undefined) delete f[k];
		onchange(f);
	}

	function canviaFranja(v: string) {
		if (v === '' || !(v in FRANGES_ALTITUD)) {
			canvia({ altMin: undefined, altMax: undefined });
			return;
		}
		const [min, max] = FRANGES_ALTITUD[v as FranjaAltitud];
		canvia({ altMin: min > 0 ? min : undefined, altMax: max !== Infinity ? max : undefined });
	}

	function netejar() {
		onchange({});
		document.getElementById(`fm-q-${uid}`)?.focus();
	}
</script>

<form
	class="filtres"
	role="search"
	aria-label={m.filters_label()}
	onsubmit={(e) => {
		e.preventDefault();
		(document.activeElement as HTMLElement | null)?.blur();
	}}
>
	<div class="cerca">
		<label for="fm-q-{uid}" class="sr-only">{m.filters_search()}</label>
		<Icon name="search" size={20} />
		<input
			id="fm-q-{uid}"
			type="search"
			value={filtres.q ?? ''}
			oninput={(e) => canvia({ q: e.currentTarget.value.slice(0, 80) || undefined })}
			placeholder={m.filters_search_placeholder()}
			autocomplete="off"
			spellcheck="false"
			enterkeyhint="search"
			maxlength="80"
		/>
	</div>

	<div class="xips">
		<Chip
			pressed={filtres.essencial === true}
			tone="stamp"
			essential
			onchange={(v) => canvia({ essencial: v ? true : undefined })}
		>
			{m.filters_essentials()}
		</Chip>
		<Chip
			pressed={filtres.estat === 'pendent'}
			onchange={(v) => canvia({ estat: v ? 'pendent' : undefined })}
		>
			{m.map_filters_pending()}
		</Chip>
		<button
			type="button"
			class="mes"
			aria-expanded={obert}
			aria-controls="fm-panell-{uid}"
			onclick={() => (obert = !obert)}
		>
			<Icon name="filter" size={18} />
			{m.map_filters_more()}
			{#if nPanell > 0}<span class="n mono">{nPanell}</span>{/if}
		</button>
		{#if actius}
			<button type="button" class="netejar" onclick={netejar}>{m.filters_clear()}</button>
		{/if}
	</div>

	<div id="fm-panell-{uid}" class="panell" hidden={!obert}>
		<div class="camp">
			<label for="fm-zona-{uid}">{m.filters_zone()}</label>
			<select
				id="fm-zona-{uid}"
				value={filtres.zona ?? ''}
				onchange={(e) => canvia({ zona: (e.currentTarget.value || undefined) as Zona | undefined })}
			>
				<option value="">{m.filters_zone_all()}</option>
				{#each ZONES as z (z)}
					<option value={z}>{NOM_ZONA[z]()}</option>
				{/each}
			</select>
		</div>
		<div class="camp">
			<label for="fm-comarca-{uid}">{m.map_filter_comarca()}</label>
			<select
				id="fm-comarca-{uid}"
				value={filtres.comarca ?? ''}
				onchange={(e) => canvia({ comarca: e.currentTarget.value || undefined })}
			>
				<option value="">{m.map_filter_comarca_all()}</option>
				{#each COMARQUES as c (c.slug)}
					<option value={c.slug}>{c.nom}</option>
				{/each}
			</select>
		</div>
		<div class="camp">
			<label for="fm-alt-{uid}">{m.filters_altitude()}</label>
			<select
				id="fm-alt-{uid}"
				value={franja}
				onchange={(e) => canviaFranja(e.currentTarget.value)}
			>
				<option value="">{m.filters_altitude_all()}</option>
				{#each FRANGES as f (f)}
					<option value={f}>{ETIQUETA_FRANJA[f]()}</option>
				{/each}
				{#if franja === 'personal'}
					<option value="personal">
						{m.map_filter_alt_custom({
							min: formatAltitude(filtres.altMin ?? 0),
							max: filtres.altMax !== undefined ? formatAltitude(filtres.altMax) : '…'
						})}
					</option>
				{/if}
			</select>
		</div>
		<div class="camp">
			<label for="fm-estat-{uid}">{m.map_filter_state()}</label>
			<select
				id="fm-estat-{uid}"
				value={filtres.estat ?? 'tots'}
				onchange={(e) => {
					const v = e.currentTarget.value as EstatFiltre;
					canvia({ estat: v === 'tots' ? undefined : v });
				}}
			>
				<option value="tots">{m.map_filter_state_all()}</option>
				<option value="fet">{m.map_filter_state_done()}</option>
				<option value="pendent">{m.map_filter_state_pending()}</option>
			</select>
		</div>
	</div>
</form>

<style>
	.filtres {
		display: grid;
		gap: var(--sp-3);
	}

	.cerca {
		position: relative;
		display: flex;
		align-items: center;
		color: var(--c-ink-2);
	}

	.cerca :global(.icon) {
		position: absolute;
		left: var(--sp-3);
		pointer-events: none;
	}

	input[type='search'],
	select {
		width: 100%;
		min-height: var(--tap);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-card);
		color: var(--c-ink);
		/* 16 px: iOS no fa zoom en enfocar */
		font-size: var(--fs-base);
	}

	input[type='search'] {
		height: 3rem;
		padding: 0 var(--sp-3) 0 calc(var(--sp-3) + 28px);
		box-shadow: var(--sh-2);
	}

	input[type='search']::placeholder {
		color: var(--c-ink-2);
		opacity: 1;
	}

	select {
		padding: 0 var(--sp-3);
	}

	.xips {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
	}

	.mes,
	.netejar {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: var(--tap);
		padding: 0 var(--sp-3);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-sm);
		background: var(--c-card);
		color: var(--c-ink);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--ls-caps);
		text-transform: uppercase;
		cursor: pointer;
	}

	.mes[aria-expanded='true'] {
		background: var(--c-paper-2);
	}

	.netejar {
		border-style: dashed;
		background: transparent;
	}

	.n {
		display: inline-grid;
		place-items: center;
		min-width: 1.25rem;
		height: 1.25rem;
		padding: 0 4px;
		border-radius: var(--r-full);
		background: var(--c-ink);
		color: var(--c-on-ink);
		font-size: var(--fs-2xs);
		letter-spacing: 0;
	}

	.panell {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--sp-3);
		padding: var(--sp-4);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-lg);
		background: var(--c-card);
	}

	.panell[hidden] {
		display: none;
	}

	.camp {
		display: grid;
		gap: var(--sp-1);
		min-width: 0;
	}

	label {
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--ls-caps);
		text-transform: uppercase;
		color: var(--c-ink-2);
	}

	@media (min-width: 48rem) {
		.panell {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
</style>
