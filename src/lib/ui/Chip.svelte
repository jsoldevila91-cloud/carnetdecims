<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * Xip / etiqueta de formulari segellat.
	 * - Amb `pressed` (bindable) és un filtre commutable (`<button aria-pressed>`).
	 * - Sense `pressed` és una etiqueta estàtica (`<span>`).
	 * `essential` afegeix el rombe: l'estat no depèn només del color (forma + text).
	 */
	let {
		pressed = $bindable(),
		tone = 'ink',
		essential = false,
		onchange,
		children
	}: {
		pressed?: boolean;
		tone?: 'ink' | 'stamp' | 'pine' | 'muted';
		essential?: boolean;
		onchange?: (pressed: boolean) => void;
		children: Snippet;
	} = $props();

	function toggle() {
		pressed = !pressed;
		onchange?.(pressed);
	}
</script>

{#if pressed !== undefined}
	<button type="button" class={['chip', 'toggle', tone]} aria-pressed={pressed} onclick={toggle}>
		{#if essential}<span class="diamond" aria-hidden="true"></span>{/if}
		{@render children()}
	</button>
{:else}
	<span class={['chip', 'tag', tone]}>
		{#if essential}<span class="diamond" aria-hidden="true"></span>{/if}
		{@render children()}
	</span>
{/if}

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		flex: none;
		border: var(--bw) solid currentColor;
		border-radius: var(--r-sm);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		letter-spacing: var(--ls-caps);
		text-transform: uppercase;
		white-space: nowrap;
	}

	.tag {
		min-height: 1.5rem;
		padding: 0 var(--sp-2);
		border-radius: var(--r-xs);
	}

	.toggle {
		min-height: var(--tap);
		padding: 0 var(--sp-3);
		background: var(--c-card);
		color: var(--c-ink);
		border-color: var(--c-line);
		cursor: pointer;
	}

	.toggle[aria-pressed='true'] {
		background: var(--c-ink);
		color: var(--c-on-ink);
		border-color: var(--c-ink);
	}

	.toggle.stamp[aria-pressed='true'] {
		background: var(--c-stamp);
		color: var(--c-on-stamp);
		border-color: var(--c-stamp);
	}

	.tag.ink {
		color: var(--c-ink);
	}

	.tag.stamp {
		color: var(--c-stamp-ink);
	}

	.tag.pine {
		color: var(--c-pine);
	}

	.tag.muted {
		color: var(--c-ink-2);
	}

	.diamond {
		width: 8px;
		height: 8px;
		transform: rotate(45deg);
		background: currentColor;
		flex: none;
	}
</style>
