<script lang="ts">
	import type { Ascensio } from '$lib/domain';
	import { ascensionsVivesAmbEstat } from '$lib/data/ascensions';
	import { CIMS } from '$lib/data/catalog';
	import { ascensionsEnRestriccio, ascensionsValides, avuiLocal } from '$lib/domain';
	import { Button, EmptyState, PageMeta } from '$lib/ui';
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
	const grups = $derived(agruparPerAny(llista));
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
