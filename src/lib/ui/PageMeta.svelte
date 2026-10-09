<script lang="ts">
	import { page } from '$app/state';
	import { SITE_ORIGIN, getLocale, internalPath, locales, type Locale } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import { baseLocale, localizeHref } from '$lib/paraglide/runtime';
	import { MODE_BETA, ROBOTS_BETA } from '$lib/seo/mode-beta';

	/**
	 * `<title>`, description, canonical, hreflang (ca, es, x-default → ca) i Open Graph/Twitter.
	 * - Les pàgines `noindex` no publiquen canonical, alternates ni OG.
	 * - `alternates`: idiomes on aquesta pàgina existeix i és indexable. Només s'emparellen
	 *   versions indexables en tots dos idiomes (docs/02 §6): si la versió `es` d'una fitxa
	 *   encara no està revisada, passa `alternates={['ca']}` i marca la `es` com a `noindex`.
	 * - `image`: URL absoluta de la imatge OG (1200×630). Sense imatge, targeta `summary`.
	 * - **Mode beta** (`PUBLIC_MODE_BETA`, docs/02 §7.1): totes les pàgines porten
	 *   `noindex, nofollow`; la resta (canonical, OG) es manté perquè el dia del llançament només
	 *   canviï el meta robots.
	 */
	let {
		title,
		description,
		noindex = false,
		alternates = locales,
		image,
		type = 'website'
	}: {
		title: string;
		description?: string;
		noindex?: boolean;
		alternates?: readonly Locale[];
		image?: string;
		type?: 'website' | 'article';
	} = $props();

	const SUFFIX = ' · Carnet de Cims';
	const MAX_TITLE = 60;
	const OG_LOCALE: Record<Locale, string> = { ca: 'ca_ES', es: 'es_ES' };

	// El sufix de marca només s'afegeix si el títol hi cap (docs/02 §4.1).
	const fullTitle = $derived(title.length + SUFFIX.length <= MAX_TITLE ? title + SUFFIX : title);
	const path = $derived(internalPath(page.url.pathname));
	const abs = (locale: Locale) => SITE_ORIGIN + localizeHref(path, { locale });
	const locale = $derived(getLocale());
	const canonical = $derived(abs(locale));
	const paired = $derived(alternates.length > 1 && alternates.includes(locale));
	const robots = $derived(MODE_BETA ? ROBOTS_BETA : noindex ? 'noindex' : undefined);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	{#if description}<meta name="description" content={description} />{/if}
	{#if robots}<meta name="robots" content={robots} />{/if}
	{#if !noindex}
		<link rel="canonical" href={canonical} />
		{#if paired}
			{#each alternates as alt (alt)}
				<link rel="alternate" hreflang={alt} href={abs(alt)} />
			{/each}
			{#if alternates.includes(baseLocale)}
				<link rel="alternate" hreflang="x-default" href={abs(baseLocale)} />
			{/if}
		{/if}

		<meta property="og:site_name" content={m.brand_name()} />
		<meta property="og:type" content={type} />
		<meta property="og:title" content={title} />
		{#if description}<meta property="og:description" content={description} />{/if}
		<meta property="og:url" content={canonical} />
		<meta property="og:locale" content={OG_LOCALE[locale]} />
		{#if paired}
			{#each alternates.filter((l) => l !== locale) as alt (alt)}
				<meta property="og:locale:alternate" content={OG_LOCALE[alt]} />
			{/each}
		{/if}
		{#if image}<meta property="og:image" content={image} />{/if}
		<meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
	{/if}
</svelte:head>
