<script lang="ts">
	import { onMount, tick, untrack } from 'svelte';
	import type { Municipi } from '$lib/domain';
	import { sessio } from '$lib/data/compte';
	import { FONT_MUNICIPIS } from '$lib/data/municipis';
	import { ErrorOrigen, desarOrigen, esborrarOrigen, origen } from '$lib/data/origen';
	import { m } from '$lib/paraglide/messages';
	import Button from './Button.svelte';
	import SelectorMunicipi from './SelectorMunicipi.svelte';

	/**
	 * Preferència "Municipi d'origen" (bloc R1): estat actual, text de privacitat, cercador per
	 * triar-lo o canviar-lo i botó per treure'l. Viu a `/app/compte` i al full que s'obre des de
	 * les estadístiques ("El cim més llunyà"). Sense encapçalament propi: el posa qui l'usa.
	 *
	 * Casos: sense municipi; amb municipi; codi desat que ja no és al conjunt (cal tornar-lo a
	 * triar); error `origen:desconegut` en desar. El municipi és una dada personal: no va a cap
	 * URL ni a cap registre.
	 */
	let {
		cercaInicial = false,
		onfet
	}: {
		/** Obre directament el cercador (p. ex. al full de les estadístiques). */
		cercaInicial?: boolean;
		/** Desat o tret correctament (p. ex. per tancar el full). */
		onfet?: () => void;
	} = $props();

	const est = origen();
	let cercant = $state(untrack(() => cercaInicial));
	let desant = $state(false);
	let error = $state('');
	let missatge = $state('');
	let selector: SelectorMunicipi | undefined = $state();
	let botoTria: HTMLElement | undefined;

	const capRetriar = $derived($est.carregat && $est.codi !== null && $est.municipi === null);

	onMount(() => {
		if (!cercaInicial) return;
		// Dins del full: `showModal` posa el focus al primer control ("Tanca"); el cercador és
		// l'acció esperada. Al frame següent, quan el diàleg ja és obert.
		const id = requestAnimationFrame(() => selector?.focus());
		return () => cancelAnimationFrame(id);
	});

	function desaBoto(node: HTMLElement) {
		botoTria = node;
		return () => {
			if (botoTria === node) botoTria = undefined;
		};
	}

	async function obrirCerca() {
		cercant = true;
		error = '';
		await tick();
		selector?.focus();
	}

	async function tancarCerca() {
		cercant = false;
		await tick();
		botoTria?.focus();
	}

	async function desar(mun: Municipi) {
		if (desant) return;
		desant = true;
		error = '';
		try {
			await desarOrigen(mun.codi);
			missatge = m.origin_saved({ municipi: mun.nom });
			await tancarCerca();
			onfet?.();
		} catch (e) {
			error = e instanceof ErrorOrigen ? m.origin_error_unknown() : m.origin_error_generic();
		} finally {
			desant = false;
		}
	}

	async function treure() {
		if (desant) return;
		desant = true;
		error = '';
		try {
			await esborrarOrigen();
			missatge = m.origin_removed();
			cercant = false;
			await tick();
			botoTria?.focus();
			onfet?.();
		} catch {
			error = m.origin_error_generic();
		} finally {
			desant = false;
		}
	}
</script>

<div class="origen" data-testid="origen-municipi">
	<p>{m.origin_text()}</p>
	<p class="privacitat">
		{$sessio.estat === 'autenticat' ? m.origin_privacy_cloud() : m.origin_privacy_local()}
	</p>

	<div class="actual" aria-busy={!$est.carregat}>
		{#if !$est.carregat}
			<p class="mono estat">{m.origin_loading()}</p>
		{:else if $est.municipi}
			<p class="valor">
				<span class="etiqueta mono">{m.origin_current_label()}</span>
				<b>{$est.municipi.nom}</b>
				<span class="comarca">({$est.municipi.comarca})</span>
			</p>
		{:else if capRetriar}
			<p class="avis">{m.origin_rechoose()}</p>
		{:else}
			<p class="estat">{m.origin_none()}</p>
		{/if}
	</div>

	{#if cercant}
		<div class="cerca">
			<SelectorMunicipi bind:this={selector} onselect={desar} />
			<p class="nota">{m.origin_outside()}</p>
			<div class="accions">
				<Button variant="outline" size="sm" onclick={tancarCerca}>{m.origin_cancel()}</Button>
			</div>
		</div>
	{:else}
		<div class="accions">
			<Button
				variant={$est.codi ? 'outline' : 'ink'}
				icon="search"
				onclick={obrirCerca}
				disabled={desant}
				{@attach desaBoto}
			>
				{$est.codi ? m.origin_change() : m.origin_choose()}
			</Button>
			{#if $est.codi}
				<Button variant="ghost" onclick={treure} disabled={desant}>{m.origin_remove()}</Button>
			{/if}
		</div>
	{/if}

	{#if error}<p class="error" role="alert">{error}</p>{/if}
	<p class="mono estat-viu" role="status">{missatge}</p>
	<p class="font">{m.origin_source({ font: FONT_MUNICIPIS })}</p>
</div>

<style>
	.origen {
		display: grid;
		gap: var(--sp-2);
	}

	p {
		color: var(--c-ink-2);
	}

	.privacitat {
		font-size: var(--fs-sm);
	}

	.actual {
		padding: var(--sp-3) 0;
		border-top: 1px dashed var(--c-rule);
		border-bottom: 1px dashed var(--c-rule);
	}

	.valor {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0 var(--sp-2);
		color: var(--c-ink);
		overflow-wrap: anywhere;
	}

	.etiqueta {
		flex: 1 1 100%;
		font-size: var(--fs-2xs);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--c-ink-2);
	}

	.valor b {
		font-size: var(--fs-md);
	}

	.comarca {
		color: var(--c-ink-2);
	}

	.estat {
		font-size: var(--fs-sm);
	}

	.avis,
	.error {
		padding: var(--sp-2) var(--sp-3);
		border: 1.5px solid var(--c-stamp-ink);
		border-radius: var(--r-sm);
		background: var(--c-stamp-soft);
		color: var(--c-ink);
		font-size: var(--fs-sm);
	}

	.cerca {
		display: grid;
		gap: var(--sp-2);
	}

	.nota,
	.font {
		font-size: var(--fs-xs);
	}

	.accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--sp-3);
		margin-top: var(--sp-1);
	}

	.estat-viu {
		font-size: var(--fs-xs);
	}

	.estat-viu:empty {
		display: none;
	}
</style>
