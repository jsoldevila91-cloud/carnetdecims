<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Icon from '../Icon.svelte';

	/**
	 * Camp de contrasenya amb botó per mostrar-la (`aria-pressed`), pista opcional i error lligats
	 * amb `aria-describedby`. `id` i `name` estables per als gestors de contrasenyes.
	 */
	let {
		id,
		name,
		label,
		autocomplete,
		value = $bindable(''),
		input = $bindable(),
		hint,
		error = null,
		/** Ids d'altres missatges que també descriuen el camp (p. ex. un error de tot el formulari). */
		descritPer = [],
		invalid = false,
		disabled = false
	}: {
		id: string;
		name: string;
		label: string;
		autocomplete: 'current-password' | 'new-password';
		value?: string;
		input?: HTMLInputElement;
		hint?: string;
		error?: string | null;
		descritPer?: string[];
		invalid?: boolean;
		disabled?: boolean;
	} = $props();

	let visible = $state(false);
	const idHint = $derived(`${id}-hint`);
	const idErr = $derived(`${id}-err`);
	const descrit = $derived(
		[hint ? idHint : null, error ? idErr : null, ...descritPer].filter(Boolean).join(' ') ||
			undefined
	);
</script>

<div class="camp">
	<label class="label" for={id}>{label}</label>
	{#if hint}
		<p id={idHint} class="hint">{hint}</p>
	{/if}
	<div class="caixa">
		<input
			bind:this={input}
			{id}
			{name}
			class="field"
			type={visible ? 'text' : 'password'}
			{autocomplete}
			autocapitalize="none"
			spellcheck="false"
			bind:value
			aria-invalid={error || invalid ? 'true' : undefined}
			aria-describedby={descrit}
			{disabled}
		/>
		<button
			type="button"
			class="ull"
			aria-pressed={visible}
			aria-controls={id}
			aria-label={m.cloud_password_show()}
			onclick={() => (visible = !visible)}
		>
			<Icon name={visible ? 'eye-off' : 'eye'} />
		</button>
	</div>
	{#if error}
		<p id={idErr} class="err" role="alert">{error}</p>
	{/if}
</div>

<style>
	.camp {
		display: grid;
		gap: var(--sp-2);
	}

	.label {
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--c-ink-2);
	}

	.hint {
		margin: 0;
		color: var(--c-ink-2);
		font-size: var(--fs-sm);
	}

	.caixa {
		display: flex;
		align-items: stretch;
		max-width: 28rem;
	}

	.field {
		flex: 1;
		width: 100%;
		min-width: 0;
		min-height: var(--tap);
		padding: var(--sp-2) var(--sp-3);
		background: var(--c-paper);
		color: var(--c-ink);
		border: var(--bw) solid var(--c-line);
		border-right: 0;
		border-radius: var(--r-md) 0 0 var(--r-md);
		font-size: var(--fs-base);
	}

	.field[aria-invalid='true'] {
		border-color: var(--c-stamp-ink);
		border-width: 2px;
		border-right: 0;
	}

	.ull {
		display: inline-grid;
		place-items: center;
		flex: none;
		width: var(--tap);
		min-height: var(--tap);
		padding: 0;
		background: var(--c-paper);
		color: var(--c-ink-2);
		border: var(--bw) solid var(--c-line);
		border-radius: 0 var(--r-md) var(--r-md) 0;
		cursor: pointer;
	}

	.ull[aria-pressed='true'] {
		background: var(--c-ink);
		color: var(--c-paper);
	}

	.ull:focus-visible {
		outline: 2px solid var(--c-focus);
		outline-offset: 2px;
	}

	.err {
		margin: 0;
		color: var(--c-stamp-ink);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}
</style>
