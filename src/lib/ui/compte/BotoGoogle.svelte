<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	/**
	 * Botó "Continua amb Google" segons les directrius de marca de Google Sign-In: logotip "G"
	 * de quatre colors sense modificar, fons blanc amb vora #747775 (tema clar) o fons #131314
	 * amb vora #8E918F (tema fosc), text en caixa normal. Alçada mínima de toc del sistema
	 * (`--tap`, ≥ 44 px). El text el posa qui el fa servir (`messages/`).
	 */
	let { ocupat = false, children, ...rest }: HTMLButtonAttributes & { ocupat?: boolean } = $props();
</script>

<button type="button" class="google" aria-busy={ocupat ? 'true' : undefined} {...rest}>
	<svg class="g" width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
		<path
			fill="#EA4335"
			d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
		/>
		<path
			fill="#4285F4"
			d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
		/>
		<path
			fill="#FBBC05"
			d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
		/>
		<path
			fill="#34A853"
			d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
		/>
	</svg>
	<span>{@render children?.()}</span>
</button>

<style>
	.google {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		min-height: var(--tap);
		padding: 0 var(--sp-4) 0 12px;
		background: #ffffff;
		color: #1f1f1f;
		border: 1px solid #747775;
		border-radius: var(--r-md);
		font-family: inherit;
		font-size: var(--fs-base);
		font-weight: var(--fw-semibold);
		line-height: 1.2;
		text-align: center;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		transition: background-color var(--dur-fast) var(--ease);
	}

	.google:hover:not(:disabled) {
		background: #f2f2f2;
	}

	.google:active:not(:disabled) {
		background: #e8e8e8;
	}

	.google:focus-visible {
		outline: 2px solid var(--c-focus);
		outline-offset: 3px;
	}

	.google:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.g {
		flex: none;
	}

	@media (prefers-color-scheme: dark) {
		.google {
			background: #131314;
			color: #e3e3e3;
			border-color: #8e918f;
		}

		.google:hover:not(:disabled) {
			background: #1f1f20;
		}

		.google:active:not(:disabled) {
			background: #2a2a2b;
		}
	}

	@media (forced-colors: active) {
		.google {
			border-color: ButtonText;
		}
	}
</style>
