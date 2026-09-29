<script lang="ts">
	import { ascensionsVivesAmbEstat } from '$lib/data/ascensions';
	import { CIMS } from '$lib/data/catalog';
	import { avuiLocal, calcularEstatRepte } from '$lib/domain';
	import { Button, Card, EmptyState, PageMeta, romanPage } from '$lib/ui';
	import FilaAscensio from '$lib/ui/FilaAscensio.svelte';
	import { obrirRegistre, registrarHref } from '$lib/ui/fulls';
	import { marcadorRepte } from '$lib/ui/registre';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	const vives = ascensionsVivesAmbEstat();
	const avui = avuiLocal();
	const pages = [1, 2, 3, 4, 5];
	const ticks = [0, 25, 50, 75, 100];

	const estat = $derived(calcularEstatRepte($vives.ascensions, CIMS, avui));
	const marcador = $derived(marcadorRepte(estat));
	// La llista ja ve ordenada per data desc (i creació desc).
	const recents = $derived($vives.ascensions.slice(0, 3));
</script>

<PageMeta title={m.app_meta_title()} noindex />

<h1 class="x-wide title">{m.app_title()}</h1>

<Card
	as="section"
	padding="md"
	class="passport"
	aria-label={m.app_progress_label()}
	aria-busy={!$vives.carregat}
>
	<div class="top">
		<span class="label">{m.app_page({ page: romanPage(marcador.pagina) })}</span>
		<span class="label level">
			{marcador.nivell === 0 ? m.app_level_none() : m.app_level({ level: String(marcador.nivell) })}
		</span>
	</div>
	<div class="row">
		<p class="count" class:skeleton={!$vives.carregat}>
			{marcador.comptador}<small>{m.app_count_of({ target: String(marcador.objectiu) })}</small>
		</p>
		<ol class="pages" aria-label={m.app_pages_label()}>
			{#each pages as p (p)}
				<li
					class={{ cur: p === marcador.pagina, done: p < marcador.pagina }}
					aria-current={p === marcador.pagina ? 'step' : undefined}
				>
					{romanPage(p)}
				</li>
			{/each}
		</ol>
	</div>
	<div
		class="ruler"
		role="img"
		aria-label={m.app_ruler_label({
			count: String(marcador.comptador),
			target: String(marcador.objectiu)
		})}
	>
		<div class="track"></div>
		<div class="fill" style:width="{marcador.dinsPagina}%"></div>
		<div class="ticks" aria-hidden="true">
			{#each ticks as t (t)}<span>{t + (marcador.pagina - 1) * 100}</span>{/each}
		</div>
	</div>
	<p class="remaining mono">
		{m.app_remaining({ count: String(marcador.falten) })} ·
		{m.app_essentials({
			done: String(estat.progres100.essencialsAssolides),
			total: String(estat.progres100.totalEssencials)
		})}
	</p>
</Card>

{#if !$vives.carregat}
	<p class="loading mono" role="status">{m.app_loading()}</p>
{:else if $vives.ascensions.length === 0}
	<div class="empty">
		<EmptyState title={m.app_empty_title()} icon="stamp">
			<p>{m.app_empty_text()}</p>
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
				<Button href={href('/cims')} variant="outline" size="lg" icon="peak">
					{m.home_cta_secondary()}
				</Button>
			{/snippet}
		</EmptyState>
	</div>
{:else}
	<section class="recents" aria-labelledby="recents-t">
		<h2 id="recents-t" class="x-wide">{m.app_recent_title()}</h2>
		<ul class="llista">
			{#each recents as a (a.id)}
				<li><FilaAscensio ascensio={a} /></li>
			{/each}
		</ul>
		<div class="actions">
			<Button href={href('/app/historial')} variant="outline" icon="book">
				{m.app_history_link()}
			</Button>
			<Button
				href={registrarHref()}
				variant="stamp"
				icon="stamp"
				onclick={(e: MouseEvent) => obrirRegistre(e)}
			>
				{m.app_register_more()}
			</Button>
		</div>
	</section>
{/if}

<style>
	.title {
		margin-bottom: var(--sp-5);
		font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1;
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: var(--sp-2);
		border-bottom: 1px dashed var(--c-rule);
	}

	.level {
		color: var(--c-stamp-ink);
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--sp-3);
		margin-top: var(--sp-3);
	}

	.count {
		font-stretch: var(--stretch-wide);
		font-weight: var(--fw-black);
		font-size: var(--fs-display);
		line-height: 0.85;
		letter-spacing: -0.02em;
		white-space: nowrap;
	}

	.count small {
		font-size: var(--fs-lg);
		font-weight: var(--fw-bold);
		color: var(--c-ink-2);
		letter-spacing: 0;
	}

	.pages {
		display: flex;
		flex-wrap: wrap;
		min-width: 0;
		gap: 5px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.pages li {
		display: grid;
		place-items: end center;
		width: 1.875rem;
		height: 2.375rem;
		padding-bottom: 3px;
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-xs);
		background: var(--c-card);
		font-family: var(--font-mono);
		font-size: var(--fs-2xs);
		font-weight: var(--fw-semibold);
	}

	.pages li.cur {
		border-width: 2.5px;
		border-color: var(--c-stamp-ink);
		color: var(--c-stamp-ink);
	}

	.ruler {
		position: relative;
		height: 1.75rem;
		margin-top: var(--sp-4);
	}

	.track,
	.fill {
		position: absolute;
		left: 0;
		top: 0;
		height: 10px;
		border-radius: 2px;
	}

	.track {
		right: 0;
		border: var(--bw) solid var(--c-line);
		background: repeating-linear-gradient(
			90deg,
			transparent 0 calc(10% - 1px),
			var(--c-rule) calc(10% - 1px) 10%
		);
	}

	.fill {
		background: var(--c-ink);
	}

	.ticks {
		position: absolute;
		left: 0;
		right: 0;
		top: 13px;
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: var(--fs-2xs);
		color: var(--c-ink-2);
	}

	.remaining {
		margin-top: var(--sp-1);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.pages li.done {
		background: var(--c-ink);
		color: var(--c-on-ink);
	}

	.skeleton {
		color: transparent;
		background: var(--c-paper-2);
		border-radius: var(--r-sm);
	}

	.loading {
		margin-top: var(--sp-6);
		color: var(--c-ink-2);
	}

	.empty,
	.recents {
		margin-top: var(--sp-8);
	}

	.recents h2 {
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
	}

	.llista {
		margin: var(--sp-2) 0 0;
		padding: 0;
		list-style: none;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-3);
		margin-top: var(--sp-5);
	}
</style>
