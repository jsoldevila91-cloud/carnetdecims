<script lang="ts">
	import { Icon } from '$lib/ui';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import { CONTINGUTS } from '$lib/content';
	import { textPla } from '$lib/content/text';
	import { PAGINES_CONTINGUT, type ClauPagina } from '$lib/content/types';
	import PaginaContingut, { NOM_PAGINA } from '../PaginaContingut.svelte';

	const locale = getLocale();
	const SUBPAGINES: readonly ClauPagina[] = ['normativa', 'comValidar', 'repteInfantil'];
	const targetes = SUBPAGINES.map((clau, i) => ({
		clau,
		num: String(i + 1).padStart(2, '0'),
		path: PAGINES_CONTINGUT[clau],
		// La targeta sencera és un enllaç: l'entradeta va sense enllaços interns.
		text: textPla(CONTINGUTS[clau][locale].intro)
	}));
</script>

<PaginaContingut clau="repte">
	{#snippet destacat()}
		<nav aria-labelledby="hub-subpagines">
			<h2 id="hub-subpagines" class="label">{m.hub_subpages_title()}</h2>
			<ul class="targetes">
				{#each targetes as t (t.clau)}
					<li>
						<a class="targeta" href={href(t.path)}>
							<span class="num mono" aria-hidden="true">{t.num}</span>
							<span class="nom x-wide">{NOM_PAGINA[t.clau]()}</span>
							<span class="text">{t.text}</span>
							<Icon name="arrow" size={20} class="fletxa" />
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/snippet}
</PaginaContingut>

<style>
	h2 {
		margin-bottom: var(--sp-3);
	}

	.targetes {
		display: grid;
		gap: var(--sp-4);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.targeta {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: var(--sp-1) var(--sp-3);
		height: 100%;
		padding: var(--sp-4);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-lg);
		background: var(--c-card);
		box-shadow: var(--sh-2);
		text-decoration: none;
		transition:
			transform var(--dur-fast) var(--ease),
			box-shadow var(--dur-fast) var(--ease);
	}

	.targeta:hover {
		transform: translate(-1px, -1px);
		box-shadow: var(--sh-3);
	}

	.targeta:hover .nom {
		text-decoration: underline;
	}

	.num {
		grid-column: 1 / -1;
		color: var(--c-stamp-ink);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--ls-label);
	}

	.nom {
		font-size: var(--fs-md);
		font-weight: var(--fw-black);
		line-height: var(--lh-snug);
		overflow-wrap: break-word;
		min-width: 0;
	}

	.text {
		grid-column: 1 / 2;
		color: var(--c-ink-2);
		font-size: var(--fs-sm);
	}

	.targeta :global(.fletxa) {
		grid-column: 2;
		grid-row: 2 / 4;
		align-self: end;
		color: var(--c-stamp-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.targeta {
			transition: none;
		}
	}

	@media (min-width: 48rem) {
		.targetes {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
