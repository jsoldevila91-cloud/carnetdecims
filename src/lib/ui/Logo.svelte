<script lang="ts">
	/** Marca: segell circular amb una muntanya. Decoratiu (el text l'acompanya). */
	let { size = 28 }: { size?: number } = $props();
</script>

<svg
	class="logo"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.5"
	aria-hidden="true"
	focusable="false"
>
	<circle cx="12" cy="12" r="10.8" />
	<circle cx="12" cy="12" r="8.4" stroke-dasharray="1.2 1.4" />
	<path d="M6.2 15.8 10 9.6l2.2 3.4 1.6-2.2 4 5z" fill="currentColor" stroke="none" />
</svg>

<style>
	.logo {
		flex: none;
		color: var(--c-stamp-ink);
	}
</style>
