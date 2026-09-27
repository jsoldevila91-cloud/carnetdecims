<script lang="ts">
	import '$lib/ui/styles/fonts.css';
	import '$lib/ui/styles/tokens.css';
	import '$lib/ui/styles/base.css';
	import archivoLatin from '@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2?url';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import {
		AppHeader,
		BottomNav,
		BottomSheet,
		OfflineBanner,
		RegisterPanel,
		SiteFooter,
		Toaster
	} from '$lib/ui';
	import { m } from '$lib/paraglide/messages';
	import { prefersReducedMotion, supportsViewTransitions } from '$lib/platform/motion';

	let { children } = $props();

	// View Transitions entre pantalles; sense suport o amb moviment reduït, navegació normal.
	onNavigate((navigation) => {
		if (!supportsViewTransitions() || prefersReducedMotion()) return;
		if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	function closeSheet() {
		// El full s'ha obert amb pushState: tornar enrere el tanca i restaura l'URL.
		history.back();
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/svg+xml" />
	<link rel="preload" href={archivoLatin} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<a class="skip-link" href="#contingut">{m.skip_to_content()}</a>

<div class="shell">
	<AppHeader />
	<OfflineBanner />
	<main id="contingut" tabindex="-1">
		{@render children()}
	</main>
	<SiteFooter />
</div>

<BottomNav />
<Toaster />

<BottomSheet
	open={page.state.sheet === 'registrar'}
	title={m.register_title()}
	onclose={closeSheet}
>
	<RegisterPanel />
</BottomSheet>

<style>
	.shell {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		padding-bottom: calc(var(--nav-h) + var(--safe-bottom));
	}

	main {
		flex: 1;
		width: 100%;
		max-width: var(--content-max);
		margin: 0 auto;
		padding: var(--sp-5) var(--gutter) 0;
		view-transition-name: main;
	}

	main:focus {
		outline: none;
	}

	@media (min-width: 48rem) {
		.shell {
			padding-bottom: 0;
			padding-left: var(--rail-w);
		}

		main {
			--gutter: 2rem;
			padding-top: var(--sp-8);
		}
	}
</style>
