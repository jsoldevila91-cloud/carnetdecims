<script lang="ts">
	import Icon from './Icon.svelte';
	import Logo from './Logo.svelte';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	/** Peu amb l'avís de web no oficial. "100 Cims" només com a descriptor, sense logos FEEC. */
	const FEEC_URL = 'https://www.feec.cat/';
	const year = new Date().getFullYear();
</script>

<footer class="site-footer">
	<div class="inner">
		<p class="brand">
			<Logo size={22} />
			<span>{m.brand_name()}</span>
		</p>
		<p class="tagline">{m.brand_tagline()}</p>
		<nav class="explora" aria-label={m.explore_label()}>
			<ul>
				<li><a href={href('/cims')}>{m.explore_all()}</a></li>
				<li><a href={href('/comarques')}>{m.explore_comarques()}</a></li>
				<li><a href={href('/cims-essencials')}>{m.explore_essentials()}</a></li>
				<li><a href={href('/tresmils')}>{m.explore_tresmils()}</a></li>
				<li><a href={href('/cims-mes-alts')}>{m.explore_highest()}</a></li>
			</ul>
		</nav>
		<p class="disclaimer">{m.footer_disclaimer()}</p>
		<nav aria-label={m.footer_nav_label()}>
			<ul>
				<li>
					<a href={FEEC_URL} rel="external noopener" target="_blank">
						{m.footer_feec_link()}
						<Icon name="external" size={14} />
					</a>
				</li>
			</ul>
		</nav>
		<details class="sources">
			<summary>{m.attribution_title()}</summary>
			<ul>
				<li>{m.attribution_list()}</li>
				<li>{m.attribution_icgc()}</li>
				<li>{m.attribution_ign()}</li>
				<li>{m.attribution_osm()}</li>
				<li>{m.attribution_wikidata()}</li>
			</ul>
		</details>
		<p class="copy">{m.footer_copyright({ year: String(year) })}</p>
	</div>
</footer>

<style>
	.site-footer {
		margin-top: var(--sp-12);
		border-top: var(--bw) solid var(--c-line);
		background: var(--c-paper-2);
		color: var(--c-ink-2);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		line-height: 1.6;
	}

	.inner {
		display: grid;
		gap: var(--sp-2);
		max-width: var(--content-max);
		margin: 0 auto;
		padding: var(--sp-6) var(--gutter) var(--sp-8);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		color: var(--c-stamp-ink);
		font-family: var(--font-wide);
		font-stretch: var(--stretch-wide);
		font-weight: var(--fw-heavy);
		font-size: var(--fs-sm);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.tagline {
		color: var(--c-ink);
		font-weight: var(--fw-semibold);
	}

	.disclaimer {
		max-width: 60ch;
		padding-top: var(--sp-2);
		border-top: 1px dashed var(--c-rule);
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--sp-4);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* Atribucions (llicències CC BY / ODbL): discretes, plegades per defecte */
	.sources {
		font-size: var(--fs-2xs);
	}

	.sources summary {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		cursor: pointer;
		text-decoration: underline dotted;
		text-underline-offset: 3px;
	}

	.sources ul {
		display: grid;
		gap: var(--sp-1);
		max-width: 70ch;
	}

	a {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		min-height: var(--tap);
		color: var(--c-ink);
		font-weight: var(--fw-semibold);
	}
</style>
