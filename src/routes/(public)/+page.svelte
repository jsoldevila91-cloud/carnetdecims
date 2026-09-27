<script lang="ts">
	import { Button, Card, JsonLd, PageMeta, Segell } from '$lib/ui';
	import { getLocale, href } from '$lib/i18n';
	import { homeGraph } from '$lib/seo/jsonld';
	import { m } from '$lib/paraglide/messages';

	const jsonLd = homeGraph({
		locale: getLocale(),
		title: m.home_meta_title(),
		description: m.home_meta_description(),
		orgDescription: m.seo_org_description()
	});

	const steps = [
		{ n: '01', title: m.home_step1_title, text: m.home_step1_text },
		{ n: '02', title: m.home_step2_title, text: m.home_step2_text },
		{ n: '03', title: m.home_step3_title, text: m.home_step3_text }
	];
</script>

<PageMeta title={m.home_meta_title()} description={m.home_meta_description()} />
<JsonLd data={jsonLd} />

<section class="hero" aria-labelledby="home-title">
	<div class="copy">
		<p class="label kicker">{m.home_kicker()}</p>
		<h1 id="home-title" class="x-wide">{m.home_title()}</h1>
		<p class="lede">{m.home_lede()}</p>
		<div class="ctas">
			<Button href={href('/app')} variant="stamp" size="lg" icon="book">
				{m.home_cta_primary()}
			</Button>
			<Button href={href('/cims')} variant="outline" size="lg" icon="peak">
				{m.home_cta_secondary()}
			</Button>
		</div>
	</div>
	<div class="art">
		<Segell top={m.brand_name()} bottom="I II III IV V" center="100" size={220} rotate={-8} />
	</div>
</section>

<section class="steps" aria-labelledby="steps-title">
	<h2 id="steps-title" class="section-title x-wide">{m.home_steps_title()}</h2>
	<ol>
		{#each steps as step (step.n)}
			<Card as="li" padding="md">
				<span class="num mono" aria-hidden="true">{step.n}</span>
				<h3 class="x-wide">{step.title()}</h3>
				<p>{step.text()}</p>
			</Card>
		{/each}
	</ol>
</section>

<section class="unofficial" aria-labelledby="unofficial-title">
	<h2 id="unofficial-title" class="section-title x-wide">{m.home_unofficial_title()}</h2>
	<p>{m.footer_disclaimer()}</p>
</section>

<style>
	.hero {
		display: grid;
		gap: var(--sp-6);
		align-items: center;
		padding-bottom: var(--sp-8);
	}

	.kicker {
		color: var(--c-stamp-ink);
		margin-bottom: var(--sp-2);
	}

	h1 {
		font-size: clamp(var(--fs-xl), 7vw, var(--fs-3xl));
		font-weight: var(--fw-black);
		line-height: 1;
		letter-spacing: -0.005em;
	}

	.lede {
		margin-top: var(--sp-4);
		max-width: 44ch;
		font-size: var(--fs-md);
		color: var(--c-ink-2);
	}

	.ctas {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-3);
		margin-top: var(--sp-6);
	}

	.art {
		display: grid;
		place-items: center;
		order: -1;
	}

	.art :global(.segell) {
		width: min(10rem, 45vw);
		height: auto;
	}

	.section-title {
		margin-bottom: var(--sp-4);
		padding-top: var(--sp-2);
		border-top: var(--bw) solid var(--c-line);
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
	}

	.steps ol {
		display: grid;
		gap: var(--sp-4);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.num {
		display: block;
		color: var(--c-stamp-ink);
		font-weight: var(--fw-semibold);
		font-size: var(--fs-xs);
		letter-spacing: var(--ls-label);
	}

	.steps h3 {
		margin: var(--sp-1) 0 var(--sp-2);
		font-size: var(--fs-md);
		font-weight: var(--fw-black);
	}

	.steps p {
		color: var(--c-ink-2);
	}

	.unofficial {
		margin-top: var(--sp-10);
	}

	.unofficial p {
		max-width: 60ch;
		color: var(--c-ink-2);
	}

	@media (min-width: 48rem) {
		.hero {
			grid-template-columns: 1fr auto;
			padding: var(--sp-6) 0 var(--sp-12);
		}

		.art {
			order: 0;
		}

		.art :global(.segell) {
			width: 14rem;
		}

		.steps ol {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
