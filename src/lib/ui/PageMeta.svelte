<script lang="ts">
	import { page } from '$app/state';
	import { SITE_ORIGIN, getLocale, internalPath, locales } from '$lib/i18n';
	import { baseLocale, localizeHref } from '$lib/paraglide/runtime';

	/**
	 * `<title>`, description, canonical i hreflang (ca, es, x-default → ca).
	 * Les pàgines `noindex` no publiquen canonical ni alternates.
	 */
	let {
		title,
		description,
		noindex = false
	}: { title: string; description?: string; noindex?: boolean } = $props();

	const SUFFIX = ' · Carnet de Cims';
	const MAX_TITLE = 60;

	// El sufix de marca només s'afegeix si el títol hi cap (docs/02 §4.1).
	const fullTitle = $derived(title.length + SUFFIX.length <= MAX_TITLE ? title + SUFFIX : title);
	const path = $derived(internalPath(page.url.pathname));
	const abs = (locale: (typeof locales)[number]) => SITE_ORIGIN + localizeHref(path, { locale });
</script>

<svelte:head>
	<title>{fullTitle}</title>
	{#if description}<meta name="description" content={description} />{/if}
	{#if noindex}
		<meta name="robots" content="noindex" />
	{:else}
		<link rel="canonical" href={abs(getLocale())} />
		{#each locales as locale (locale)}
			<link rel="alternate" hreflang={locale} href={abs(locale)} />
		{/each}
		<link rel="alternate" hreflang="x-default" href={abs(baseLocale)} />
	{/if}
</svelte:head>
