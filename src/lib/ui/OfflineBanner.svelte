<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Icon from './Icon.svelte';
	import { toasts } from './toast.svelte';
	import { network } from '$lib/platform/network.svelte';
	import { m } from '$lib/paraglide/messages';

	/** Bàner discret quan no hi ha connexió; en tornar-hi, un toast ho anuncia. */
	let wasOffline = false;

	onMount(() => network.start());

	$effect(() => {
		if (!network.online) {
			wasOffline = true;
		} else if (wasOffline) {
			wasOffline = false;
			toasts.show(m.online_again(), { tone: 'success' });
		}
	});
</script>

<div class="offline-region" role="status" aria-live="polite">
	{#if !network.online}
		<p class="banner" transition:slide={{ duration: 180 }}>
			<Icon name="offline" size={18} />
			<span>{m.offline_banner()}</span>
		</p>
	{/if}
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
</style>
