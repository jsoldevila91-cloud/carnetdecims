<script lang="ts">
	import { Button, PageMeta } from '$lib/ui';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
</script>

<PageMeta title={m.map_meta_title()} description={m.map_meta_description()} />

<header class="page-head">
	<h1 class="x-wide">{m.map_title()}</h1>
	<p class="lede">{m.map_lede()}</p>
</header>

<!-- Espai reservat (aspect-ratio fix, sense CLS) per a la imatge estàtica + MapLibre diferit (fase 4). -->
<section class="map-frame" aria-labelledby="map-soon">
	<div class="topo" aria-hidden="true"></div>
	<div class="overlay">
		<h2 id="map-soon" class="x-wide">{m.map_placeholder_title()}</h2>
		<p>{m.map_placeholder_text()}</p>
		<Button href={href('/cims')} variant="outline" icon="peak">{m.map_placeholder_cta()}</Button>
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

	.map-frame {
		position: relative;
		display: grid;
		place-items: center;
		aspect-ratio: 4 / 5;
		max-height: 70dvh;
		width: 100%;
		overflow: hidden;
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-lg);
		background: var(--c-paper-2);
		box-shadow: var(--sh-3);
	}

	/* Corbes de nivell suggerides amb CSS (sense dades ni imatges) */
	.topo {
		position: absolute;
		inset: 0;
		background:
			repeating-radial-gradient(
				circle at 30% 40%,
				transparent 0 22px,
				color-mix(in srgb, var(--c-ink) 14%, transparent) 22px 23.5px
			),
			repeating-radial-gradient(
				circle at 75% 70%,
				transparent 0 18px,
				color-mix(in srgb, var(--c-ink) 10%, transparent) 18px 19px
			);
	}

	.overlay {
		position: relative;
		display: grid;
		justify-items: center;
		gap: var(--sp-3);
		max-width: 22rem;
		margin: var(--sp-4);
		padding: var(--sp-6) var(--sp-5);
		text-align: center;
		background: var(--c-card);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-lg);
		box-shadow: var(--sh-2);
	}

	.overlay h2 {
		font-size: var(--fs-md);
		font-weight: var(--fw-black);
	}

	.overlay p {
		color: var(--c-ink-2);
	}

	@media (min-width: 48rem) {
		.map-frame {
			aspect-ratio: 16 / 9;
		}
	}
</style>
