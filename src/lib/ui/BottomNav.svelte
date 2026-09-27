<script lang="ts">
	import { page } from '$app/state';
	import { pushState } from '$app/navigation';
	import Icon, { type IconName } from './Icon.svelte';
	import { href, internalPath } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	/**
	 * Navegació principal: barra inferior al mòbil (5 destins, Registrar al centre)
	 * i barra lateral a partir de 768 px. Registrar obre un full amb shallow routing;
	 * amb clic modificat o sense JS, l'enllaç porta a la pàgina /app/registrar.
	 */
	type Tab = { path: string; label: () => string; icon: IconName; match: (p: string) => boolean };

	const REGISTER_PATH = '/app/registrar';

	const tabs: Tab[] = [
		{ path: '/app', label: m.nav_home, icon: 'home', match: (p) => p === '/app' },
		{ path: '/mapa', label: m.nav_map, icon: 'map', match: (p) => p === '/mapa' },
		{
			path: REGISTER_PATH,
			label: m.nav_register,
			icon: 'stamp',
			match: (p) => p === REGISTER_PATH
		},
		{
			path: '/cims',
			label: m.nav_peaks,
			icon: 'peak',
			match: (p) => p === '/cims' || p.startsWith('/cims/')
		},
		{ path: '/app/compte', label: m.nav_profile, icon: 'user', match: (p) => p === '/app/compte' }
	];

	const current = $derived(internalPath(page.url.pathname));

	function openRegister(event: MouseEvent) {
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
			return;
		if (current === REGISTER_PATH) return;
		event.preventDefault();
		if (page.state.sheet === 'registrar') return;
		pushState(href(REGISTER_PATH), { sheet: 'registrar' });
	}

	function scrollTopIfActive(event: MouseEvent, active: boolean) {
		// Tocar la pestanya activa torna a dalt, com a les apps natives.
		if (!active) return;
		event.preventDefault();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<nav class="bottom-nav" aria-label={m.nav_label()}>
	<ul>
		{#each tabs as tab (tab.path)}
			{@const active = tab.match(current)}
			{#if tab.path === REGISTER_PATH}
				<li class="register">
					<a
						href={href(tab.path)}
						aria-current={active ? 'page' : undefined}
						onclick={openRegister}
						aria-label={m.nav_register_label()}
					>
						<span class="stamp-btn"><Icon name={tab.icon} size={26} strokeWidth={2} /></span>
						<span class="lbl" aria-hidden="true">{tab.label()}</span>
					</a>
				</li>
			{:else}
				<li>
					<a
						href={href(tab.path)}
						aria-current={active ? 'page' : undefined}
						onclick={(e) => scrollTopIfActive(e, active)}
					>
						<Icon name={tab.icon} strokeWidth={active ? 2.2 : 1.8} />
						<span class="lbl">{tab.label()}</span>
					</a>
				</li>
			{/if}
		{/each}
	</ul>
</nav>

<style>
	.bottom-nav {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: var(--z-nav);
		padding-bottom: var(--safe-bottom);
		background: var(--c-card);
		border-top: var(--bw) solid var(--c-line);
		view-transition-name: bottom-nav;
	}

	ul {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		height: var(--nav-h);
		max-width: 40rem;
		margin: 0 auto;
		padding: 0 var(--sp-1);
		list-style: none;
	}

	a {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3px;
		height: 100%;
		min-width: var(--tap);
		color: var(--c-ink-2);
		text-decoration: none;
		-webkit-tap-highlight-color: transparent;
	}

	.lbl {
		font-family: var(--font-mono);
		font-size: var(--fs-2xs);
		font-weight: var(--fw-medium);
		letter-spacing: var(--ls-caps);
		text-transform: uppercase;
	}

	a[aria-current='page'] {
		color: var(--c-ink);
	}

	a[aria-current='page'] .lbl {
		font-weight: var(--fw-semibold);
	}

	/* Marca de pestanya activa: forma + pes, no només color */
	li:not(.register) a[aria-current='page']::after {
		content: '';
		position: absolute;
		bottom: 6px;
		width: 18px;
		height: 3px;
		background: var(--c-stamp);
	}

	.register a {
		color: var(--c-stamp-ink);
		justify-content: flex-end;
		padding-bottom: 10px;
	}

	.register .lbl {
		font-weight: var(--fw-semibold);
	}

	.stamp-btn {
		display: grid;
		place-items: center;
		width: 3.5rem;
		height: 3.5rem;
		margin-top: -1.75rem;
		border-radius: 50%;
		background: var(--c-stamp);
		color: var(--c-on-stamp);
		border: 3px double var(--c-card);
		box-shadow:
			0 0 0 1.5px var(--c-stamp-ink),
			0 6px 14px -6px rgb(192 57 43 / 0.6);
		transition: transform var(--dur-fast) var(--ease);
	}

	.register a:active .stamp-btn {
		transform: scale(0.95) rotate(-6deg);
	}

	/* ---------- Escriptori: barra lateral ---------- */
	@media (min-width: 48rem) {
		.bottom-nav {
			top: 0;
			right: auto;
			width: var(--rail-w);
			padding: calc(var(--safe-top) + 4.5rem) 0 var(--sp-6);
			border-top: 0;
			border-right: var(--bw) solid var(--c-line);
		}

		ul {
			display: flex;
			flex-direction: column;
			gap: var(--sp-2);
			height: auto;
			padding: 0 var(--sp-2);
		}

		a {
			height: 4.25rem;
			border-radius: var(--r-md);
		}

		a:hover {
			background: var(--c-paper-2);
			color: var(--c-ink);
		}

		li:not(.register) a[aria-current='page']::after {
			bottom: auto;
			left: 0;
			top: 50%;
			width: 3px;
			height: 22px;
			transform: translateY(-50%);
		}

		.register {
			order: -1;
			margin-bottom: var(--sp-4);
		}

		.register a {
			height: auto;
			justify-content: center;
			gap: var(--sp-2);
			padding: var(--sp-2) 0;
		}

		.register a:hover {
			background: none;
		}

		.stamp-btn {
			margin-top: 0;
		}
	}
</style>
