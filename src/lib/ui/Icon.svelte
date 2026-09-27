<script lang="ts" module>
	/** Icones de traç (24×24) de la proposta Segells. */
	const ICONS = {
		home: ['M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1z'],
		map: ['M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4zM9 4v14M15 6v14'],
		peak: ['M2.5 20 9 8.5l3.5 6 2.5-4 6.5 9.5z', 'M7.5 11.2 9 12.5l1.5-1.3'],
		user: [
			'M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
			'M4.5 20.5c1.4-3.6 4.3-5.5 7.5-5.5s6.1 1.9 7.5 5.5'
		],
		stamp: ['M9.5 3.5h5l-1 7h-3zM5 13.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2.5H5zM6 19.5h12'],
		book: ['M5 4.5h11a2 2 0 0 1 2 2v13H7a2 2 0 0 1-2-2z', 'M5 17.5a2 2 0 0 1 2-2h11M9 8.5h5'],
		search: ['M11 4.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z', 'm20 20-4.2-4.2'],
		back: ['M15 5l-7 7 7 7'],
		arrow: ['M5 12h14M13 6l6 6-6 6'],
		check: ['M5 12.5l4.5 4.5L19 7.5'],
		close: ['M6 6l12 12M18 6 6 18'],
		offline: [
			'M7 18.5h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 10 4.3 4.3 0 0 0 7 18.5z',
			'M3.5 3.5l17 17'
		],
		globe: [
			'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17z',
			'M3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5s1.2-6.1 3.5-8.5z'
		],
		external: ['M14 4.5h5.5V10M19.5 4.5 11 13M18 14v5.5H4.5V6H10']
	} as const;

	export type IconName = keyof typeof ICONS;
</script>

<script lang="ts">
	let {
		name,
		size = 22,
		strokeWidth = 1.8,
		class: className = ''
	}: { name: IconName; size?: number; strokeWidth?: number; class?: string } = $props();
</script>

<svg
	class={['icon', className]}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	focusable="false"
>
	{#each ICONS[name] as d (d)}
		<path {d} />
	{/each}
</svg>

<style>
	.icon {
		flex: none;
	}
</style>
