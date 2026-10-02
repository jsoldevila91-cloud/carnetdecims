<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { slide } from 'svelte/transition';
	import Icon from './Icon.svelte';
	import { toasts } from './toast.svelte';
	import { network } from '$lib/platform/network.svelte';
	import { aplicarActualitzacio, estatSW } from '$lib/platform/pwa';
	import { m } from '$lib/paraglide/messages';

	/**
	 * Bàners d'estat sota la capçalera:
	 * - sense connexió (discret; en tornar-hi, un toast ho anuncia);
	 * - nova versió de l'app ("Actualitza" activa el SW en espera i recarrega; "Més tard" l'amaga
	 *   fins a la propera visita).
	 * I, un sol cop per dispositiu, el toast "Preparat per funcionar sense connexió" quan el
	 * service worker ha acabat el precache.
	 */
	const CLAU_LLEST_OFFLINE = 'carnetdecims:llest-offline';
	let wasOffline = false;
	let mesTard = $state(false);
	let actualitzant = $state(false);

	onMount(() => network.start());

	$effect(() => {
		if (!network.online) {
			wasOffline = true;
		} else if (wasOffline) {
			wasOffline = false;
			toasts.show(m.online_again(), { tone: 'success' });
		}
	});

	$effect(() => {
		if (!$estatSW.llestOffline) return;
		try {
			if (localStorage.getItem(CLAU_LLEST_OFFLINE)) return;
			localStorage.setItem(CLAU_LLEST_OFFLINE, '1');
		} catch {
			return;
		}
		toasts.show(m.pwa_offline_ready(), { tone: 'success' });
	});

	const novaVersio = $derived($estatSW.actualitzacioDisponible && !mesTard);

	/** El botó desapareix: el focus no pot quedar a <body> (WCAG 2.4.3); va al contingut. */
	async function mesTardFocus() {
		mesTard = true;
		await tick();
		const actiu = document.activeElement;
		// Durant la transició de sortida el botó encara hi és: també compta com a perdut.
		if (!actiu || actiu === document.body || actiu.closest('.offline-region')) {
			document.getElementById('contingut')?.focus();
		}
	}

	async function actualitza() {
		actualitzant = true;
		try {
			await aplicarActualitzacio();
		} finally {
			actualitzant = false;
		}
	}
</script>

<div class="offline-region">
	<div role="status" aria-live="polite">
		{#if !network.online}
			<p class="banner" transition:slide={{ duration: 180 }}>
				<Icon name="offline" size={18} />
				<span>{m.offline_banner()}</span>
			</p>
		{/if}
	</div>
	<div role="status" aria-live="polite">
		{#if novaVersio}
			<div class="banner versio" transition:slide={{ duration: 180 }}>
				<Icon name="refresh" size={18} />
				<span class="txt">{m.pwa_update_text()}</span>
				<button type="button" class="accio" onclick={actualitza} disabled={actualitzant}>
					{m.pwa_update_cta()}
				</button>
				<button type="button" class="accio tanca" onclick={mesTardFocus}>
					<Icon name="close" size={16} />
					<span class="sr-only">{m.pwa_update_later()}</span>
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.offline-region {
		position: sticky;
		top: calc(3.5rem + var(--safe-top) + 1px);
		z-index: var(--z-banner);
	}

	.banner {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--sp-2);
		margin: 0;
		padding: var(--sp-2) var(--gutter);
		background: var(--c-ink);
		color: var(--c-on-ink);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		text-align: center;
	}

	.versio {
		flex-wrap: wrap;
		row-gap: 0;
		padding-block: 0;
		padding-right: var(--sp-1);
		background: var(--c-stamp);
		color: var(--c-on-stamp);
	}

	.txt {
		padding-block: var(--sp-2);
	}

	.accio {
		min-height: var(--tap);
		padding: 0 var(--sp-2);
		background: none;
		border: 0;
		color: inherit;
		font: inherit;
		font-weight: var(--fw-bold);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}

	.accio:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: -4px;
	}

	.accio:disabled {
		opacity: 0.7;
		cursor: progress;
	}

	.tanca {
		display: grid;
		place-items: center;
		width: var(--tap);
		padding: 0;
	}
</style>
