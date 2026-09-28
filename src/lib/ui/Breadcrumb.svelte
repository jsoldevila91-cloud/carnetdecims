<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import { m } from '$lib/paraglide/messages';

	/**
	 * Molla de pa visible. Ha de coincidir amb el `BreadcrumbList` del JSON-LD de la pàgina
	 * (mateixos noms i ordre). L'últim element és la pàgina actual (sense enllaç).
	 */
	let {
		items,
		class: className
	}: {
		items: readonly { name: string; href?: string }[];
		class?: ClassValue;
	} = $props();
</script>

<nav class={['crumb', className]} aria-label={m.breadcrumb_label()}>
	<ol>
		{#each items as item, i (i)}
			{#if item.href && i < items.length - 1}
				<li><a href={item.href}>{item.name}</a></li>
			{:else}
				<li aria-current="page">{item.name}</li>
			{/if}
		{/each}
	</ol>
</nav>

<style>
	ol {
		display: flex;
		flex-wrap: wrap;
		margin: 0;
		padding: 0;
		list-style: none;
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--c-ink-2);
	}

	li + li::before {
		content: '›';
		margin: 0 var(--sp-2);
		color: var(--c-ink-2);
	}

	a {
		display: inline-block;
		padding: var(--sp-2) 0;
		color: var(--c-stamp-ink);
		font-weight: var(--fw-semibold);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	[aria-current] {
		padding: var(--sp-2) 0;
	}
</style>
