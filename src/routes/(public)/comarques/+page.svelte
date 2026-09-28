<script lang="ts">
	import { Breadcrumb, JsonLd, NOM_ZONA, PageMeta } from '$lib/ui';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import { ZONES } from '$lib/domain';
	import { CIMS, comarquesAmbCims, cimsPerComarca } from '$lib/data/catalog';
	import { comarquesGraph } from '$lib/seo/jsonld';

	const locale = getLocale();
	const comarques = comarquesAmbCims();

	const jsonLd = comarquesGraph({
		comarques,
		locale,
		title: m.comarques_meta_title(),
		description: m.comarques_meta_description(),
		breadcrumbNames: { inici: m.nav_home(), comarques: m.nav_comarques() }
	});

	const recompte = (slug: string) => {
		const cims = cimsPerComarca(slug);
		const essencials = cims.filter((c) => c.essencial).length;
		return {
			cims: cims.length,
			essencials,
			text: [
				essencials === cims.length
					? null
					: cims.length === 1
						? m.count_cims_one()
						: m.count_cims({ count: cims.length }),
				essencials === 1 ? m.count_essentials_one() : m.count_essentials({ count: essencials })
			]
				.filter(Boolean)
				.join(' · ')
		};
	};

	// Agrupades per zona (ordre de `ZONES`), cadascuna en l'ordre de `comarquesAmbCims()`.
	const grups = ZONES.map((zona) => ({
		zona,
		comarques: comarques.filter((c) => c.zona === zona).map((c) => ({ ...c, ...recompte(c.slug) }))
	})).filter((g) => g.comarques.length > 0);

	const nomesEssencials = CIMS.every((c) => c.essencial);
</script>

<PageMeta title={m.comarques_meta_title()} description={m.comarques_meta_description()} />
<JsonLd data={jsonLd} />

<header class="page-head">
	<Breadcrumb items={[{ name: m.nav_home(), href: href('/') }, { name: m.nav_comarques() }]} />
	<h1 class="x-wide">{m.comarques_title()}</h1>
	<p class="lede">{m.comarques_lede({ count: comarques.length })}</p>
	{#if nomesEssencials}
		<p class="draft" role="note">{m.catalog_only_essentials({ count: CIMS.length })}</p>
	{/if}
</header>

{#each grups as g (g.zona)}
	<section class="zona" aria-labelledby="zona-{g.zona}">
		<h2 id="zona-{g.zona}" class="x-wide">{NOM_ZONA[g.zona]()}</h2>
		<ul class="graella">
			{#each g.comarques as c (c.slug)}
				<li>
					<a href={href(`/comarques/${c.slug}`)}>
						<span class="nom">{c.nom}</span>
						<span class="count mono">
							<span class="diamond" aria-hidden="true"></span>{c.text}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/each}

<style>
	.page-head {
		margin-bottom: var(--sp-6);
	}

	h1 {
		margin-top: var(--sp-1);
		font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1;
	}

	.lede {
		margin-top: var(--sp-3);
		color: var(--c-ink-2);
		max-width: 60ch;
	}

	.draft {
		margin-top: var(--sp-4);
		padding: var(--sp-2) var(--sp-3);
		border-left: 3px solid var(--c-kraft);
		background: var(--c-paper-2);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
		max-width: 70ch;
	}

	.zona + .zona {
		margin-top: var(--sp-8);
	}

	h2 {
		margin-bottom: var(--sp-3);
		padding-top: var(--sp-2);
		border-top: var(--bw) solid var(--c-line);
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
	}

	.graella {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
		gap: var(--sp-3);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.graella a {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--sp-1) var(--sp-3);
		height: 100%;
		min-height: var(--tap);
		padding: var(--sp-3) var(--sp-4);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-card);
		box-shadow: var(--sh-1);
		text-decoration: none;
	}

	.graella a:hover .nom {
		text-decoration: underline;
	}

	.nom {
		font-weight: var(--fw-bold);
	}

	.count {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: var(--fs-xs);
		color: var(--c-stamp-ink);
		white-space: nowrap;
	}

	.diamond {
		display: inline-block;
		flex: none;
		width: 8px;
		height: 8px;
		transform: rotate(45deg);
		background: var(--c-stamp);
	}
</style>
