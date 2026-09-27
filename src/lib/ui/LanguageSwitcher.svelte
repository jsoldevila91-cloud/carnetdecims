<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { endonym, getLocale, href, internalPath, locales } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	/**
	 * Selector d'idioma: enllaços reals a la ruta equivalent (`/ca/cims` ↔ `/es/cimas`).
	 * Navegació de document complet (`data-sveltekit-reload`) perquè `<html lang>`
	 * i els missatges es regenerin des del servidor, com recomana Paraglide.
	 */
	let { variant = 'compact' }: { variant?: 'compact' | 'full' } = $props();

	const current = $derived(getLocale());

	// La query (filtres) només es pot llegir al client: les pàgines públiques es prerenderitzen.
	let search = $state('');
	afterNavigate(({ to }) => {
		search = to?.url.search ?? '';
	});
</script>

<nav class={['langs', variant]} aria-label={m.lang_label()}>
	<ul>
		{#each locales as locale (locale)}
			<li>
				<a
					href={href(internalPath(page.url.pathname), locale) + search}
					hreflang={locale}
					lang={locale}
					aria-current={locale === current ? 'true' : undefined}
					data-sveltekit-reload
					title={locale === current ? undefined : m.lang_switch_to({ language: endonym(locale) })}
				>
					{#if variant === 'compact'}
						<span aria-hidden="true">{locale.toUpperCase()}</span>
						<span class="sr-only">{endonym(locale)}</span>
					{:else}
						{endonym(locale)}
					{/if}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	ul {
		display: flex;
		gap: var(--sp-1);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	a {
		display: grid;
		place-items: center;
		min-width: var(--tap);
		min-height: var(--tap);
		padding: 0 var(--sp-2);
		border: var(--bw) solid transparent;
		border-radius: var(--r-sm);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--ls-caps);
		color: var(--c-ink-2);
		text-decoration: none;
	}

	a:hover {
		color: var(--c-ink);
		border-color: var(--c-rule);
	}

	a[aria-current='true'] {
		color: var(--c-ink);
		border-color: var(--c-line);
		background: var(--c-card);
	}

	.full a {
		font-size: var(--fs-sm);
		padding: 0 var(--sp-4);
		letter-spacing: 0;
	}
</style>
