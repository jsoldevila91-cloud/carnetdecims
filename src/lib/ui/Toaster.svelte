<script lang="ts">
	import { fly } from 'svelte/transition';
	import Icon from './Icon.svelte';
	import { toasts } from './toast.svelte';
	import { m } from '$lib/paraglide/messages';
	import { prefersReducedMotion } from '$lib/platform/motion';

	const reduced = prefersReducedMotion();
</script>

<!-- La regió viva existeix sempre perquè els lectors de pantalla anunciïn els canvis. -->
<section class="toaster" aria-label={m.toast_region_label()}>
	<ol role="status" aria-live="polite" aria-atomic="false">
		{#each toasts.items as toast (toast.id)}
			<li class={['toast', toast.tone]} transition:fly={{ y: reduced ? 0 : 16, duration: 200 }}>
				{#if toast.tone === 'success'}<Icon name="check" size={20} />{/if}
				<span class="msg">{toast.message}</span>
				<button type="button" class="dismiss" onclick={() => toasts.dismiss(toast.id)}>
					<Icon name="close" size={18} />
					<span class="sr-only">{m.toast_dismiss()}</span>
				</button>
			</li>
		{/each}
	</ol>
</section>

<style>
	.toaster {
		position: fixed;
		left: var(--gutter);
		right: var(--gutter);
		bottom: calc(var(--nav-h) + var(--safe-bottom) + var(--sp-3));
		z-index: var(--z-toast);
		pointer-events: none;
	}

	ol {
		display: grid;
		gap: var(--sp-2);
		max-width: 28rem;
		margin: 0 auto;
		padding: 0;
		list-style: none;
	}

	.toast {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		min-height: var(--tap);
		padding: var(--sp-1) var(--sp-1) var(--sp-1) var(--sp-4);
		background: var(--c-ink);
		color: var(--c-on-ink);
		border-radius: var(--r-md);
		box-shadow: var(--sh-2);
		font-family: var(--font-mono);
		font-size: var(--fs-sm);
		font-weight: var(--fw-medium);
		pointer-events: auto;
	}

	.toast.error {
		background: var(--c-stamp);
		color: var(--c-on-stamp);
	}

	.msg {
		flex: 1;
	}

	.dismiss {
		display: grid;
		place-items: center;
		width: var(--tap);
		height: var(--tap);
		flex: none;
		background: none;
		border: 0;
		color: inherit;
		cursor: pointer;
	}

	@media (min-width: 48rem) {
		.toaster {
			bottom: var(--sp-6);
			left: calc(var(--rail-w) + var(--gutter));
		}
	}
</style>
