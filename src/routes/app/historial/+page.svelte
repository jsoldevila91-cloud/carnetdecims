<script lang="ts">
	import type { Ascensio } from '$lib/domain';
	import { ascensionsVivesAmbEstat } from '$lib/data/ascensions';
	import { CIMS } from '$lib/data/catalog';
	import { ascensionsEnRestriccio, ascensionsValides, avuiLocal } from '$lib/domain';
	import { Button, Chip, EmptyState, PageMeta } from '$lib/ui';
	import FilaAscensio from '$lib/ui/FilaAscensio.svelte';
	import { esborrarAmbDesfer } from '$lib/ui/accions-ascensio';
	import { obrirEdicio, obrirRegistre, registrarHref } from '$lib/ui/fulls';
	import { agruparPerAny, idsRepeticions } from '$lib/ui/registre';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	const vives = ascensionsVivesAmbEstat();

	/** Esborra amb Desfés; el focus passa a la fila del costat (o al contingut) i no es perd. */
	async function esborrar(a: Ascensio) {
		const fila = document.activeElement?.closest('li');
		const costat = (
			fila?.nextElementSibling ?? fila?.previousElementSibling
		)?.querySelector<HTMLElement>('button');
		await esborrarAmbDesfer(a);
		(costat ?? document.getElementById('contingut'))?.focus();
	}

	const llista = $derived($vives.ascensions);
	/**
	 * Vista "Diari": només les ascensions amb nota o companys. L'estat és a la memòria de la
	 * pàgina (no a la URL): és un filtre de les dades personals.
	 */
	let nomesDiari = $state(false);
	const esDiari = (a: Ascensio) => !!a.nota?.trim() || a.companys.length > 0;
	const diari = $derived(llista.filter(esDiari));
	const grups = $derived(agruparPerAny(nomesDiari ? diari : llista));
	// Mateix criteri que el carnet: les repeticions es calculen sobre les ascensions vàlides
	// (`ascensionsValides`); les invàlides (abans del 01/07/2006, futures…) són "fora del repte".
	const avui = avuiLocal();
	const valides = $derived(ascensionsValides(llista, CIMS, avui));
	const repeticions = $derived(idsRepeticions(valides));
	const foraRepte = $derived.by(() => {
		const ok = new Set(valides.map((a) => a.id));
		return new Set(llista.filter((a) => !ok.has(a.id)).map((a) => a.id));
	});
	const enRestriccio = $derived(
		new Set(ascensionsEnRestriccio(llista, CIMS).map((a) => a.ascensio.id))
	);
</script>

<PageMeta title={m.history_meta_title()} noindex />

<h1 class="x-wide title">{m.history_title()}</h1>

{#if !$vives.carregat}
	<p class="lede mono" role="status">{m.app_loading()}</p>
{:else if llista.length === 0}
	<EmptyState title={m.history_empty_title()} icon="book">
		<p>{m.history_empty_text()}</p>
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
	<p class="lede">{m.history_lede({ count: String(llista.length) })}</p>
	<div class="top-actions">
		<Button
			href={registrarHref()}
			variant="stamp"
			icon="stamp"
			onclick={(e: MouseEvent) => obrirRegistre(e)}
		>
			{m.app_register_more()}
		</Button>
		<Button href={href('/app')} variant="outline" icon="home">{m.app_title()}</Button>
	</div>

	<div class="filtre">
		<Chip bind:pressed={nomesDiari}>{m.history_diary_filter()}</Chip>
		<p class="filtre-hint">{m.history_diary_hint()}</p>
	</div>
	<p class="filtre-estat mono" role="status">
		{nomesDiari ? m.history_diary_count({ count: String(diari.length) }) : ''}
	</p>
	{#if nomesDiari && diari.length === 0}
		<p class="buit">{m.history_diary_empty()}</p>
	{/if}

	{#each grups as grup (grup.any)}
		<section class="any" aria-labelledby="any-{grup.any}">
			<h2 id="any-{grup.any}" class="x-wide">
				{grup.any}
				<span class="n mono">{m.history_year_count({ count: String(grup.ascensions.length) })}</span
				>
			</h2>
			<ul class="llista">
				{#each grup.ascensions as a (a.id)}
					<li>
						<FilaAscensio
							ascensio={a}
							repeticio={repeticions.has(a.id)}
							foraRepte={foraRepte.has(a.id)}
							restriccio={enRestriccio.has(a.id)}
							onedit={() => obrirEdicio(a.id)}
							ondelete={() => esborrar(a)}
						/>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
{/if}

<style>
	.title {
		margin-bottom: var(--sp-3);
		font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1;
	}

	.lede {
		color: var(--c-ink-2);
	}

	.top-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-3);
		margin: var(--sp-4) 0 var(--sp-2);
	}

	.filtre {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--sp-2) var(--sp-3);
		margin-top: var(--sp-4);
	}

	.filtre-hint {
		flex: 1 1 14rem;
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.filtre-estat {
		margin-top: var(--sp-2);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.buit {
		margin-top: var(--sp-4);
		padding: var(--sp-4);
		border: var(--bw) dashed var(--c-ink-2);
		border-radius: var(--r-lg);
		color: var(--c-ink-2);
		max-width: 44rem;
	}

	.any {
		margin-top: var(--sp-6);
		max-width: 44rem;
	}

	.any h2 {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--sp-3);
		padding-bottom: var(--sp-2);
		border-bottom: var(--bw) solid var(--c-line);
		font-size: var(--fs-lg);
	}

	.n {
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		font-stretch: normal;
		text-transform: none;
		letter-spacing: 0;
		color: var(--c-ink-2);
	}

	.llista {
		margin: 0;
		padding: 0;
		list-style: none;
	}
</style>
