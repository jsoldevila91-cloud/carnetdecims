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
		external: ['M14 4.5h5.5V10M19.5 4.5 11 13M18 14v5.5H4.5V6H10'],
		plus: ['M12 5v14M5 12h14'],
		minus: ['M5 12h14'],
		locate: [
			'M12 5.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13z',
			'M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3'
		],
		expand: ['M4.5 9V4.5H9M15 4.5h4.5V9M19.5 15v4.5H15M9 19.5H4.5V15'],
		shrink: ['M9 4.5V9H4.5M19.5 9H15V4.5M15 19.5V15h4.5M4.5 15H9v4.5'],
		list: ['M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01'],
		filter: ['M4 6h16M7 12h10M10 18h4'],
		compass: ['M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17z', 'm15.5 8.5-2 5-5 2 2-5z'],
		/** Botó Comparteix d'iOS (quadrat amb fletxa cap amunt): instruccions d'instal·lació. */
		share: ['M12 3.5v11M8.5 7 12 3.5 15.5 7', 'M9 10H6.5v10.5h11V10H15'],
		/** "Afegeix a la pantalla d'inici" d'iOS. */
		'add-square': ['M5 4.5h14v15H5z', 'M12 8.5v7M8.5 12h7'],
		install: ['M12 4v10.5M7.5 10 12 14.5 16.5 10', 'M5 19.5h14'],
		refresh: ['M19.5 12a7.5 7.5 0 1 1-2.2-5.3', 'M19.5 4.5v4h-4'],
		/** Núvol (compte): tot desat, canvis pendents, error. */
		'cloud-check': [
			'M7 18.5h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 10 4.3 4.3 0 0 0 7 18.5z',
			'm9.5 14 2 2 3.5-3.5'
		],
		'cloud-up': [
			'M7 18.5h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 10 4.3 4.3 0 0 0 7 18.5z',
			'M12 16.5V12M10 14l2-2 2 2'
		],
		'cloud-alert': [
			'M7 18.5h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 10 4.3 4.3 0 0 0 7 18.5z',
			'M12 11.5v3M12 16.5h.01'
		],
		/** Dispositiu (dades només al mòbil). */
		device: [
			'M8 3.5h8a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z',
			'M11 17.5h2'
		],
		mail: ['M4 6.5h16v11H4z', 'm4.5 7 7.5 6 7.5-6']
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
