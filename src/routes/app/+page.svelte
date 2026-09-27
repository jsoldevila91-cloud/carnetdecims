<script lang="ts">
	import { page } from '$app/state';
	import { pushState } from '$app/navigation';
	import { Button, Card, EmptyState, PageMeta, romanPage } from '$lib/ui';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	// Encara no hi ha dades (arriben amb Dexie a la fase 4): carnet buit.
	const count = 0;
	const level = 1;
	const pages = [1, 2, 3, 4, 5];
	const ticks = [0, 25, 50, 75, 100];

	function openRegister(event: MouseEvent) {
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
			return;
		event.preventDefault();
		if (page.state.sheet !== 'registrar') pushState(href('/app/registrar'), { sheet: 'registrar' });
	}
</script>

<PageMeta title={m.app_meta_title()} noindex />

<h1 class="x-wide title">{m.app_title()}</h1>

<Card as="section" padding="md" class="passport" aria-label={m.app_progress_label()}>
	<div class="top">
		<span class="label">{m.app_page({ page: romanPage(level) })}</span>
		<span class="label level">{m.app_level({ level: String(level) })}</span>
	</div>
	<div class="row">
		<p class="count">{count}<small>{m.app_count_of()}</small></p>
		<ol class="pages" aria-label={m.app_pages_label()}>
			{#each pages as p (p)}
				<li class={{ cur: p === level }} aria-current={p === level ? 'step' : undefined}>
					{romanPage(p)}
				</li>
			{/each}
		</ol>
	</div>
	<div class="ruler" role="img" aria-label={m.app_ruler_label({ count: String(count) })}>
		<div class="track"></div>
		<div class="fill" style:width="{count}%"></div>
		<div class="ticks" aria-hidden="true">
			{#each ticks as t (t)}<span>{t}</span>{/each}
		</div>
	</div>
	<p class="remaining mono">{m.app_remaining({ count: String(100 - count) })}</p>
</Card>

<div class="empty">
	<EmptyState title={m.app_empty_title()} icon="stamp">
		<p>{m.app_empty_text()}</p>
		{#snippet actions()}
			<Button
				href={href('/app/registrar')}
				variant="stamp"
				size="lg"
				icon="stamp"
				onclick={openRegister}
			>
				{m.app_empty_cta()}
			</Button>
			<Button href={href('/cims')} variant="outline" size="lg" icon="peak">
				{m.home_cta_secondary()}
			</Button>
		{/snippet}
	</EmptyState>
</div>

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

	.empty {
		margin-top: var(--sp-8);
	}
</style>
