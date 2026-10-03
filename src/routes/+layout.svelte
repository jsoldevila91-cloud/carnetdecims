<script lang="ts">
	import '$lib/ui/styles/fonts.css';
	import '$lib/ui/styles/tokens.css';
	import '$lib/ui/styles/base.css';
	import archivoLatin from '@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2?url';
	import { onMount, tick } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import {
		AppHeader,
		BottomNav,
		BottomSheet,
		Button,
		OfflineBanner,
		SiteFooter,
		Toaster
	} from '$lib/ui';
	import AvisInstallacio from '$lib/ui/AvisInstallacio.svelte';
	import { carregarRegistre, precarregarRegistreQuanOcios } from '$lib/ui/carrega-registre';
	import { m } from '$lib/paraglide/messages';
	import { prefersReducedMotion, supportsViewTransitions } from '$lib/platform/motion';
	import { registrarServiceWorker } from '$lib/platform/pwa';

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

	// Formulari del full: es carrega sota demanda i es precarrega en segon pla (en línia i ociós).
	onMount(() => precarregarRegistreQuanOcios());

	// Service worker (ús sense connexió i avís de nova versió): només al client.
	onMount(() => void registrarServiceWorker());
	let intentsCarrega = $state(0);
	// `intent` fa que el bloc {#await} torni a demanar el mòdul en reintentar.
	const carregaFormulari = (intent: number) => (void intent, carregarRegistre());

	async function reintentaCarrega() {
		intentsCarrega++;
		// El botó desapareix mentre es carrega: el focus torna al formulari o al botó de nou.
		const carregat = await carregarRegistre().then(
			() => true,
			() => false
		);
		if (!carregat && navigator.onLine) {
			// Ja hi ha connexió però el navegador recorda l'import fallit (mapa de mòduls): es
			// recarrega el document. L'URL del full de registre és /app/registrar(?cim=…), així
			// que s'obre la pàgina completa amb el mateix cim.
			location.reload();
			return;
		}
		const selector = carregat
			? 'dialog.sheet[open] .body :is(input, textarea, button)'
			: 'dialog.sheet[open] .carrega-error button';
		await tick();
		document.querySelector<HTMLElement>(selector)?.focus();
	}

	/**
	 * En aparèixer l'error de càrrega, el focus va a "Torna-ho a provar" (l'única acció útil):
	 * `showModal` l'havia deixat a "Tanca". Es fa al frame següent perquè el diàleg ja sigui obert.
	 */
	function enfocarEnMuntar(node: HTMLElement) {
		const id = requestAnimationFrame(() => node.focus());
		return () => cancelAnimationFrame(id);
	}

	function closeSheet() {
		// El full s'ha obert amb pushState: tornar enrere el tanca i restaura l'URL.
		history.back();
	}
</script>

<svelte:head>
	<!-- Favicons: a src/app.html (també als shells SPA de /app). -->
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
<AvisInstallacio />

<BottomSheet
	open={page.state.sheet === 'registrar' || page.state.sheet === 'editar'}
	title={page.state.sheet === 'editar' ? m.register_edit_title() : m.register_title()}
	onclose={closeSheet}
>
	<!-- Es carrega en obrir-lo: el formulari (i Dexie) no pesa a les pàgines públiques. -->
	{#await carregaFormulari(intentsCarrega)}
		<p class="carrega mono" role="status">{m.register_loading()}</p>
	{:then { default: RegisterPanel }}
		<RegisterPanel cim={page.state.cim} ascensioId={page.state.ascensio} ondone={closeSheet} />
	{:catch}
		<div class="carrega-error" role="alert">
			<p>{m.register_load_error()}</p>
			<Button variant="ink" onclick={reintentaCarrega} {@attach enfocarEnMuntar}>
				{m.register_load_retry()}
			</Button>
		</div>
	{/await}
</BottomSheet>

<style>
	.carrega {
		color: var(--c-ink-2);
		font-size: var(--fs-sm);
	}

	.carrega-error {
		display: grid;
		justify-items: start;
		gap: var(--sp-4);
		padding: var(--sp-4);
		border: 2px solid var(--c-stamp-ink);
		border-radius: var(--r-md);
		background: var(--c-stamp-soft);
	}

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
