<script lang="ts">
	import { fly } from 'svelte/transition';
	import Icon from './Icon.svelte';
	import { toasts } from './toast.svelte';
	import { m } from '$lib/paraglide/messages';
	import { prefersReducedMotion } from '$lib/platform/motion';

	const reduced = prefersReducedMotion();

	// On era el focus abans d'entrar a cada toast (per tornar-l'hi després de "Desfés").
	// No reactiu a propòsit: només es consulta en executar l'acció.
	const anteriors: Record<number, HTMLElement> = {};

	function entra(id: number, event: FocusEvent) {
		toasts.pause(id);
		const previ = event.relatedTarget;
		if (previ instanceof HTMLElement && !previ.closest('.toaster')) anteriors[id] = previ;
	}

	async function executa(id: number) {
		// Clic amb ratolí: el focus d'abans és el que tenia el document.
		const anterior = anteriors[id] ?? null;
		delete anteriors[id];
		await toasts.run(id, anterior);
	}
</script>

<!-- La regió viva existeix sempre perquè els lectors de pantalla anunciïn els canvis. -->
<section class="toaster" aria-label={m.toast_region_label()}>
	<!-- La regió viva envolta la llista (un <ol role=status> trencaria la semàntica de llista). -->
	<div role="status" aria-live="polite" aria-atomic="false">
		<ol>
			{#each toasts.items as toast (toast.id)}
				<li
					class={['toast', toast.tone, { segell: !!toast.segell }]}
					transition:fly={{ y: reduced ? 0 : 16, duration: 200 }}
					onpointerenter={() => toasts.pause(toast.id)}
					onpointerleave={() => toasts.resume(toast.id)}
					onfocusin={(e) => entra(toast.id, e)}
					onfocusout={() => toasts.resume(toast.id)}
				>
					{#if toast.segell}
						<!-- Microanimació de segell: "+1 → 38/100". Decorativa: el comptador és al text sr. -->
						<span class="stamp-ic" aria-hidden="true"
							><Icon name="stamp" size={20} strokeWidth={2} /></span
						>
					{:else if toast.tone === 'success'}<Icon name="check" size={20} />{/if}
					<span class="msg">
						{#if toast.segell}
							<span class="stamp-txt" aria-hidden="true">
								{#if toast.segell.delta > 0}<b class="delta">+{toast.segell.delta}</b><span
										class="arrow">→</span
									>
								{/if}<b>{toast.segell.count}</b>/{toast.segell.target}
							</span>
						{/if}
						<span>{toast.message}</span>{#if toast.sr}<span class="sr-only"> {toast.sr}</span>{/if}
					</span>
					{#if toast.action}
						<button type="button" class="action" onclick={() => executa(toast.id)}>
							{toast.action.label}
						</button>
					{/if}
					<button type="button" class="dismiss" onclick={() => toasts.dismiss(toast.id)}>
						<Icon name="close" size={18} />
						<span class="sr-only">{m.toast_dismiss()}</span>
					</button>
				</li>
			{/each}
		</ol>
	</div>
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
		display: grid;
		flex: 1;
		min-width: 0;
		padding-block: var(--sp-1);
		overflow-wrap: anywhere;
	}

	.stamp-ic {
		display: grid;
		place-items: center;
		flex: none;
		width: 2rem;
		height: 2rem;
		border-radius: var(--r-full);
		background: var(--c-stamp);
		color: var(--c-on-stamp);
		animation: stamp-thump 520ms var(--ease) both;
	}

	.stamp-txt {
		font-size: var(--fs-md);
		line-height: var(--lh-snug);
		white-space: nowrap;
	}

	.delta {
		display: inline-block;
		animation: stamp-pop 520ms 160ms var(--ease) both;
	}

	.arrow {
		margin: 0 0.35em;
	}

	.action {
		flex: none;
		min-height: var(--tap);
		padding: 0 var(--sp-2);
		background: none;
		border: 0;
		color: inherit;
		font-family: var(--font-mono);
		font-weight: var(--fw-bold);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
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

	@keyframes stamp-thump {
		0% {
			transform: scale(1.9) rotate(-18deg);
			opacity: 0;
		}
		60% {
			transform: scale(0.9) rotate(4deg);
			opacity: 1;
		}
		100% {
			transform: none;
		}
	}

	@keyframes stamp-pop {
		from {
			transform: translateY(6px);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.stamp-ic,
		.delta {
			animation: none;
		}
	}

	@media (min-width: 48rem) {
		.toaster {
			bottom: var(--sp-6);
			left: calc(var(--rail-w) + var(--gutter));
		}
	}
</style>
