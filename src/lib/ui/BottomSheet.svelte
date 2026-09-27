<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';
	import { m } from '$lib/paraglide/messages';

	/**
	 * Full inferior modal sobre `<dialog>` natiu (`showModal`):
	 * role=dialog implícit, la resta de la pàgina queda inert (focus atrapat),
	 * Esc tanca i el focus torna al control que l'ha obert.
	 * L'estat `open` el controla qui el fa servir (p. ex. `page.state` amb shallow
	 * routing, de manera que el botó enrere del mòbil també el tanca).
	 */
	let {
		open,
		title,
		onclose,
		children
	}: {
		open: boolean;
		title: string;
		/** Demana tancar (Esc, botó, clic al fons). */
		onclose: () => void;
		children: Snippet;
	} = $props();

	let dialog: HTMLDialogElement | undefined = $state();
	const uid = $props.id();
	const titleId = `sheet-title-${uid}`;

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		else if (!open && dialog.open) dialog.close();
	});

	function handleCancel(event: Event) {
		event.preventDefault();
		onclose();
	}

	function handleNativeClose() {
		// El navegador pot tancar el diàleg pel seu compte (p. ex. Esc repetit):
		// sincronitzem l'estat extern.
		if (open) onclose();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === dialog) onclose();
	}
</script>

<dialog
	bind:this={dialog}
	class="sheet"
	aria-labelledby={titleId}
	oncancel={handleCancel}
	onclose={handleNativeClose}
	onclick={handleBackdropClick}
>
	<div class="panel">
		<header class="head">
			<h2 id={titleId} class="x-wide">{title}</h2>
			<button type="button" class="close" onclick={onclose}>
				<Icon name="close" />
				<span class="sr-only">{m.sheet_close()}</span>
			</button>
		</header>
		<div class="body">
			{@render children()}
		</div>
	</div>
</dialog>

<style>
	.sheet {
		position: fixed;
		inset: auto 0 0 0;
		width: 100%;
		max-width: 100%;
		max-height: min(88dvh, 100% - var(--safe-top) - var(--sp-8));
		margin: 0;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--c-ink);
		overflow: visible;
	}

	.sheet[open] {
		animation: sheet-up var(--dur-slow) var(--ease);
	}

	.sheet::backdrop {
		background: var(--c-scrim, rgb(27 42 71 / 0.45));
	}

	.sheet[open]::backdrop {
		animation: fade-in var(--dur) ease-out;
	}

	.panel {
		position: relative;
		display: flex;
		flex-direction: column;
		max-height: inherit;
		background: var(--c-card);
		border-top: var(--bw) solid var(--c-line);
		box-shadow: var(--sh-sheet);
		padding: var(--sp-4) var(--sp-5) calc(var(--sp-5) + var(--safe-bottom));
	}

	/* Vora dentada de segell postal */
	.panel::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: -9px;
		height: 9px;
		background: radial-gradient(circle at 6px 9px, var(--c-card) 5px, transparent 5.5px) 0 0 / 12px
			9px repeat-x;
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-3);
		padding-bottom: var(--sp-3);
		border-bottom: 1px dashed var(--c-rule);
	}

	.head h2 {
		font-size: var(--fs-md);
		font-weight: var(--fw-black);
	}

	.close {
		display: grid;
		place-items: center;
		width: var(--tap);
		height: var(--tap);
		flex: none;
		background: var(--c-card);
		color: var(--c-ink);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		box-shadow: var(--sh-1);
		cursor: pointer;
	}

	.body {
		overflow-y: auto;
		overscroll-behavior: contain;
		padding-top: var(--sp-4);
	}

	@media (min-width: 48rem) {
		.sheet {
			inset: 0;
			margin: auto;
			width: min(36rem, 100% - var(--sp-8));
			height: fit-content;
		}

		.panel {
			border: var(--bw) solid var(--c-line);
			border-radius: var(--r-lg);
			box-shadow: var(--sh-3);
			padding-bottom: var(--sp-6);
		}

		.panel::before {
			display: none;
		}
	}

	@keyframes sheet-up {
		from {
			transform: translateY(100%);
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	:global(html:has(dialog.sheet[open])) {
		overflow: hidden;
	}
</style>
