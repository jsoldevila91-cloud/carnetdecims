<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import Icon, { type IconName } from './Icon.svelte';

	type Common = {
		/** `stamp` = acció principal (vermell segell), `ink` = tinta, `outline` = full amb ombra. */
		variant?: 'stamp' | 'ink' | 'outline' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		block?: boolean;
		icon?: IconName;
		children: Snippet;
	};
	type Props =
		| (Common & HTMLAnchorAttributes & { href: string })
		| (Common & HTMLButtonAttributes & { href?: undefined });

	let {
		variant = 'ink',
		size = 'md',
		block = false,
		icon,
		children,
		class: className,
		...rest
	}: Props = $props();

	const classes = $derived(['btn', `btn-${variant}`, `btn-${size}`, { block }, className]);
</script>

{#if rest.href !== undefined}
	<a class={classes} {...rest as HTMLAnchorAttributes}>
		{#if icon}<Icon name={icon} />{/if}
		<span>{@render children()}</span>
	</a>
{:else}
	<button
		class={classes}
		type={(rest as HTMLButtonAttributes).type ?? 'button'}
		{...rest as HTMLButtonAttributes}
	>
		{#if icon}<Icon name={icon} />{/if}
		<span>{@render children()}</span>
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--sp-2);
		min-height: var(--tap);
		padding: 0 var(--sp-5);
		border: var(--bw) solid transparent;
		border-radius: var(--r-md);
		font-family: var(--font-wide);
		font-stretch: var(--stretch-semi);
		font-weight: var(--fw-heavy);
		font-size: var(--fs-sm);
		letter-spacing: var(--ls-caps);
		line-height: 1.1;
		text-align: center;
		text-transform: uppercase;
		text-decoration: none;
		cursor: pointer;
		transition:
			transform var(--dur-fast) var(--ease),
			box-shadow var(--dur-fast) var(--ease);
		-webkit-tap-highlight-color: transparent;
	}

	.btn:active {
		transform: translate(1px, 1px);
	}

	.btn:disabled,
	.btn[aria-disabled='true'] {
		cursor: not-allowed;
		opacity: 0.55;
		transform: none;
	}

	.btn-sm {
		min-height: 2.25rem;
		padding: 0 var(--sp-3);
		font-size: var(--fs-xs);
	}

	.btn-lg {
		min-height: 3.25rem;
		font-size: var(--fs-base);
	}

	.block {
		display: flex;
		width: 100%;
	}

	.btn-stamp {
		background: var(--c-stamp);
		color: var(--c-on-stamp);
	}

	.btn-ink {
		background: var(--c-ink);
		color: var(--c-on-ink);
	}

	.btn-outline {
		background: var(--c-card);
		color: var(--c-ink);
		border-color: var(--c-line);
		box-shadow: var(--sh-2);
	}

	.btn-outline:active {
		box-shadow: var(--sh-1);
	}

	.btn-ghost {
		background: transparent;
		color: var(--c-ink);
		text-decoration: underline;
		text-underline-offset: 0.25em;
	}
</style>
