<script lang="ts">
	import { PageMeta, formatAltitude } from '$lib/ui';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import { CIMS, COMARQUES } from '$lib/data/catalog';

	// Llista mínima per comarca amb enllaços a les fitxes (el llistat amb filtres arriba al bloc 3b).
	const collator = new Intl.Collator('ca');
	const grups = [...COMARQUES]
		.sort((a, b) => collator.compare(a.nom, b.nom))
		.map((comarca) => ({
			comarca,
			cims: CIMS.filter((c) => c.comarca === comarca.slug).sort((a, b) =>
				collator.compare(a.nom, b.nom)
			)
		}))
		.filter((g) => g.cims.length > 0);
</script>

<PageMeta title={m.peaks_meta_title()} description={m.peaks_meta_description()} />

<header class="page-head">
	<h1 class="x-wide">{m.peaks_title()}</h1>
	<p class="lede">{m.peaks_lede({ count: CIMS.length })}</p>
</header>

<section aria-labelledby="per-comarca">
	<h2 id="per-comarca" class="sr-only">{m.peaks_by_comarca()}</h2>
	<div class="grups">
		{#each grups as { comarca, cims } (comarca.slug)}
			<section class="grup" aria-labelledby="comarca-{comarca.slug}">
				<h3 id="comarca-{comarca.slug}" class="x-wide">
					{comarca.nom} <span class="count mono">{cims.length}</span>
				</h3>
				<ul>
					{#each cims as cim (cim.slug)}
						<li>
							<a href={href(`/cims/${cim.slug}`)}>
								<span class="nom">
									{#if cim.essencial}<span class="diamond" aria-hidden="true"></span>{/if}
									{cim.nom}
									{#if cim.essencial}<span class="sr-only">({m.peaks_essential_short()})</span>{/if}
								</span>
								<span class="alt mono">{formatAltitude(cim.altitud)} m</span>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</section>

<style>
	.page-head {
		margin-bottom: var(--sp-6);
	}

	h1 {
		font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1;
	}

	.lede {
		margin-top: var(--sp-3);
		color: var(--c-ink-2);
		max-width: 50ch;
	}

	.grups {
		display: grid;
		gap: var(--sp-8) var(--sp-10);
	}

	h3 {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: var(--sp-1);
		padding-top: var(--sp-2);
		border-top: var(--bw) solid var(--c-line);
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
	}

	.count {
		font-size: var(--fs-xs);
		font-weight: var(--fw-medium);
		color: var(--c-ink-2);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li + li {
		border-top: 1px dashed var(--c-rule);
	}

	a {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--sp-3);
		min-height: var(--tap);
		padding: var(--sp-2) 0;
		text-decoration: none;
	}

	a:hover .nom {
		text-decoration: underline;
	}

	.nom {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
		font-weight: var(--fw-bold);
	}

	.diamond {
		display: inline-block;
		flex: none;
		width: 8px;
		height: 8px;
		transform: rotate(45deg);
		background: var(--c-stamp);
	}

	.alt {
		flex: none;
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	@media (min-width: 48rem) {
		.grups {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 72rem) {
		.grups {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
