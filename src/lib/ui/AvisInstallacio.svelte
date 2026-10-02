<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { page } from '$app/state';
	import BottomSheet from './BottomSheet.svelte';
	import Button from './Button.svelte';
	import Icon from './Icon.svelte';
	import Logo from './Logo.svelte';
	import { toasts } from './toast.svelte';
	import { installacio } from '$lib/platform/installacio.svelte';
	import { prefersReducedMotion } from '$lib/platform/motion';
	import { m } from '$lib/paraglide/messages';

	/**
	 * Avís d'instal·lació (docs/05 §2): surt **després d'un registre**, quan ja no hi ha cap toast
	 * ni cap full obert (no tapa el "+1" del segell), i no torna si es rebutja. També hi viu el full
	 * d'instruccions d'iOS, que pot obrir el Perfil ("Instal·la l'app").
	 */
	const reduced = prefersReducedMotion();

	onMount(() => {
		const atura = installacio.start();
		const installada = () => toasts.show(m.pwa_installed(), { tone: 'success' });
		window.addEventListener('appinstalled', installada);
		return () => {
			atura();
			window.removeEventListener('appinstalled', installada);
		};
	});

	const visible = $derived(
		installacio.avisPendent &&
			installacio.disponible &&
			toasts.items.length === 0 &&
			!page.state.sheet &&
			!installacio.fullIos
	);

	/** L'avís desapareix: el focus no pot quedar a <body> (WCAG 2.4.3); va al contingut. */
	async function focusSiCal() {
		await tick();
		const actiu = document.activeElement;
		// Durant la transició de sortida el botó encara hi és: també compta com a perdut.
		if (!actiu || actiu === document.body || actiu.closest('.avis-regio')) {
			document.getElementById('contingut')?.focus();
		}
	}

	function rebutjar() {
		installacio.rebutjar();
		void focusSiCal();
	}

	async function installar() {
		if (installacio.natiu) {
			await installacio.installar();
			void focusSiCal();
		} else {
			installacio.fullIos = true;
		}
	}

	function tancarFullIos() {
		installacio.fullIos = false;
		// Des de l'avís, haver vist les instruccions compta com a resposta: no torna a sortir sol.
		if (installacio.avisPendent) installacio.rebutjar();
		// El botó que l'ha obert (a l'avís) ja no hi és; des del Perfil el diàleg ja hi torna.
		requestAnimationFrame(() => void focusSiCal());
	}
</script>

<div class="avis-regio" role="status" aria-live="polite">
	{#if visible}
		<aside
			class="avis"
			aria-labelledby="avis-installacio-t"
			transition:fly={{ y: reduced ? 0 : 24, duration: 220 }}
		>
			<div class="cap">
				<Logo size={36} />
				<div class="text">
					<h2 id="avis-installacio-t" class="x-wide">{m.pwa_install_title()}</h2>
					<p>{m.pwa_install_text()}</p>
				</div>
				<button type="button" class="tanca" onclick={rebutjar}>
					<Icon name="close" size={18} />
					<span class="sr-only">{m.pwa_install_close()}</span>
				</button>
			</div>
			<div class="accions">
				<Button variant="stamp" size="sm" icon="install" onclick={installar}>
					{installacio.natiu ? m.pwa_install_cta() : m.pwa_install_ios_cta()}
				</Button>
				<Button variant="ghost" size="sm" onclick={rebutjar}>
					{m.pwa_install_later()}
				</Button>
			</div>
		</aside>
	{/if}
</div>

<BottomSheet open={installacio.fullIos} title={m.pwa_install_ios_title()} onclose={tancarFullIos}>
	<ol class="passos">
		<li>
			<span class="num mono" aria-hidden="true">1</span>
			<span class="ic" aria-hidden="true"><Icon name="share" /></span>
			<p>{m.pwa_install_ios_step1()}</p>
		</li>
		<li>
			<span class="num mono" aria-hidden="true">2</span>
			<span class="ic" aria-hidden="true"><Icon name="add-square" /></span>
			<p>{m.pwa_install_ios_step2()}</p>
		</li>
		<li>
			<span class="num mono" aria-hidden="true">3</span>
			<span class="ic" aria-hidden="true"><Logo size={22} /></span>
			<p>{m.pwa_install_ios_step3()}</p>
		</li>
	</ol>
	<div class="ok">
		<Button variant="ink" onclick={tancarFullIos}>{m.pwa_install_ios_ok()}</Button>
	</div>
</BottomSheet>

<style>
	.avis-regio {
		position: fixed;
		left: var(--gutter);
		right: var(--gutter);
		bottom: calc(var(--nav-h) + var(--safe-bottom) + var(--sp-3));
		z-index: var(--z-toast);
		pointer-events: none;
	}

	.avis {
		max-width: 28rem;
		margin: 0 auto;
		padding: var(--sp-3) var(--sp-3) var(--sp-3) var(--sp-4);
		background: var(--c-card);
		color: var(--c-ink);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-lg);
		box-shadow: var(--sh-3);
		pointer-events: auto;
	}

	.cap {
		display: flex;
		align-items: flex-start;
		gap: var(--sp-3);
	}

	.cap :global(.logo) {
		margin-top: var(--sp-1);
	}

	.text {
		flex: 1;
		min-width: 0;
	}

	h2 {
		font-size: var(--fs-base);
		line-height: var(--lh-snug);
	}

	p {
		margin-top: var(--sp-1);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	.tanca {
		display: grid;
		place-items: center;
		flex: none;
		width: var(--tap);
		height: var(--tap);
		margin: calc(-1 * var(--sp-2)) calc(-1 * var(--sp-2)) 0 0;
		background: none;
		border: 0;
		border-radius: var(--r-sm);
		color: var(--c-ink-2);
		cursor: pointer;
	}

	.tanca:hover {
		color: var(--c-ink);
	}

	.accions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-2);
		margin-top: var(--sp-3);
		padding-left: calc(36px + var(--sp-3));
	}

	.passos {
		display: grid;
		gap: var(--sp-4);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.passos li {
		display: grid;
		grid-template-columns: auto auto 1fr;
		align-items: start;
		gap: var(--sp-3);
	}

	.num {
		display: grid;
		place-items: center;
		width: 1.75rem;
		height: 1.75rem;
		border: 1.5px solid var(--c-stamp-ink);
		border-radius: var(--r-full);
		color: var(--c-stamp-ink);
		font-size: var(--fs-sm);
		font-weight: var(--fw-bold);
	}

	.ic {
		display: grid;
		place-items: center;
		width: 2.25rem;
		height: 2.25rem;
		margin-top: -0.25rem;
		border-radius: var(--r-sm);
		background: var(--c-paper-2);
		color: var(--c-blue);
	}

	.passos p {
		margin: 0;
		padding-top: 0.15rem;
		color: var(--c-ink);
		font-size: var(--fs-base);
	}

	.ok {
		margin-top: var(--sp-5);
	}

	@media (min-width: 48rem) {
		.avis-regio {
			bottom: var(--sp-6);
			left: calc(var(--rail-w) + var(--gutter));
		}
	}

	@media (max-width: 22rem) {
		.accions {
			padding-left: 0;
		}
	}
</style>
