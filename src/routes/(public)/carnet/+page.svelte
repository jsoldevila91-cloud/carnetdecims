<script lang="ts">
	/**
	 * Carnet compartit de només lectura (bloc R3): `/ca/carnet#c=…`, `/es/carnet#c=…`.
	 *
	 * El shell es prerenderitza (`noindex, nofollow`, fora del sitemap, al precache del SW) i el
	 * contingut es pinta només al client a partir del fragment, que no arriba mai al servidor.
	 * No es fa servir cap dada local (ni Dexie): el carnet és el de l'enllaç.
	 */
	import { onMount } from 'svelte';
	import { CIMS } from '$lib/data/catalog';
	import { llegeixEnllac } from '$lib/data/compartir';
	import { avuiLocal } from '$lib/domain';
	import { Button, PageMeta } from '$lib/ui';
	import CarnetCompartit from '$lib/ui/compartir/CarnetCompartit.svelte';
	import {
		estatDeLectura,
		titolCarnetCompartit,
		type EstatCarnetCompartit
	} from '$lib/ui/compartir/carnet-compartit';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	let estat = $state<EstatCarnetCompartit>({ tipus: 'carregant' });

	async function llegir() {
		const fragment = window.location.hash;
		if (!fragment || fragment === '#') {
			estat = { tipus: 'error' };
			return;
		}
		estat = { tipus: 'carregant' };
		try {
			estat = estatDeLectura(await llegeixEnllac(fragment, CIMS, avuiLocal()));
		} catch {
			estat = { tipus: 'error' };
		}
	}

	onMount(() => {
		void llegir();
		const onHash = () => void llegir();
		window.addEventListener('hashchange', onHash);
		return () => window.removeEventListener('hashchange', onHash);
	});

	const titol = $derived(titolCarnetCompartit(estat.tipus === 'ok' ? estat.carnet.nom : undefined));
</script>

<PageMeta title={titol} noindex nofollow />

<div class="compartit">
	{#if estat.tipus === 'ok'}
		<CarnetCompartit carnet={estat.carnet} />
	{:else}
		<h1 class="x-wide title">{m.shared_title()}</h1>
		{#if estat.tipus === 'error'}
			<p class="error" role="alert" data-testid="carnet-compartit-error">
				{m.shared_invalid()}
			</p>
		{:else}
			<p class="mono estat" role="status">{m.shared_loading()}</p>
			<noscript><p class="error">{m.shared_noscript()}</p></noscript>
		{/if}
	{/if}

	<aside class="cta" aria-labelledby="cta-t">
		<h2 id="cta-t" class="x-wide">{m.shared_cta_title()}</h2>
		<p>{m.shared_cta_text()}</p>
		<Button href={href('/app')} variant="stamp" icon="stamp" rel="nofollow">
			{m.shared_cta()}
		</Button>
	</aside>
</div>

<style>
	.compartit {
		max-width: 52rem;
	}

	.title {
		margin-bottom: var(--sp-3);
		font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1.05;
	}

	.estat {
		color: var(--c-ink-2);
	}

	.error {
		max-width: 44rem;
		padding: var(--sp-3) var(--sp-4);
		border: 2px solid var(--c-stamp-ink);
		border-radius: var(--r-md);
		background: var(--c-stamp-soft);
		font-weight: var(--fw-semibold);
	}

	.cta {
		display: grid;
		justify-items: start;
		gap: var(--sp-3);
		max-width: 44rem;
		margin-top: var(--sp-10);
		padding: var(--sp-5);
		border: var(--bw) dashed var(--c-line);
		border-radius: var(--r-lg);
	}

	.cta h2 {
		font-size: var(--fs-md);
		font-weight: var(--fw-black);
	}

	.cta p {
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}
</style>
