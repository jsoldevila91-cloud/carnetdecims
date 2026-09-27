<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon, { type IconName } from './Icon.svelte';

	/** Estat buit: "forat" de segell per omplir + títol + text + accions. */
	let {
		title,
		icon = 'stamp',
		headingLevel = 2,
		children,
		actions
	}: {
		title: string;
		icon?: IconName;
		headingLevel?: 1 | 2 | 3;
		children?: Snippet;
		actions?: Snippet;
	} = $props();
</script>

<div class="empty">
	<span class="slot" aria-hidden="true"><Icon name={icon} size={30} /></span>
	<svelte:element this={`h${headingLevel}`} class="title x-wide">{title}</svelte:element>
	{#if children}<div class="text">{@render children()}</div>{/if}
	{#if actions}<div class="actions">{@render actions()}</div>{/if}
</div>

<style>
	.empty {
		display: grid;
		justify-items: center;
		gap: var(--sp-3);
		padding: var(--sp-8) var(--sp-4);
		text-align: center;
		border: var(--bw) dashed var(--c-ink-2);
		border-radius: var(--r-lg);
	}

	.slot {
		display: grid;
		place-items: center;
		width: 5rem;
		height: 5rem;
		border: 2px dashed var(--c-stamp-ink);
		border-radius: 50%;
		color: var(--c-stamp-ink);
		transform: rotate(-6deg);
	}

	.title {
		font-size: var(--fs-lg);
		font-weight: var(--fw-black);
		line-height: var(--lh-snug);
	}

	.text {
		max-width: 38ch;
		color: var(--c-ink-2);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--sp-3);
		margin-top: var(--sp-2);
	}
</style>
