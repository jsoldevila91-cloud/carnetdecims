<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLElement> & {
		/** Element semàntic que envolta la targeta. */
		as?: 'div' | 'section' | 'article' | 'aside' | 'li';
		/** `raised` = full de carnet amb ombra dura; `flat` = només vora; `dashed` = forat per omplir. */
		variant?: 'raised' | 'flat' | 'dashed';
		padding?: 'sm' | 'md' | 'lg';
		children: Snippet;
	};

	let {
		as = 'div',
		variant = 'raised',
		padding = 'md',
		class: className,
		children,
		...rest
	}: Props = $props();
</script>

<svelte:element this={as} class={['card', variant, `pad-${padding}`, className]} {...rest}>
	{@render children()}
</svelte:element>

<style>
	.card {
		position: relative;
		background: var(--c-card);
		color: var(--c-ink);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-lg);
	}

	.raised {
		box-shadow: var(--sh-3);
	}

	.dashed {
		border-style: dashed;
		border-color: var(--c-ink-2);
		background: transparent;
	}

	.pad-sm {
		padding: var(--sp-3);
	}

	.pad-md {
		padding: var(--sp-4);
	}

	.pad-lg {
		padding: var(--sp-6);
	}
</style>
