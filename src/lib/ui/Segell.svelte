<script lang="ts">
	/**
	 * Segell de tinta en SVG: text a l'arc superior (nom), a l'arc inferior (data),
	 * xifra central (altitud) i subtítol (comarca / essencial).
	 * Sense `label` és decoratiu (`aria-hidden`); amb `label` és una imatge (`role="img"`).
	 */
	let {
		top,
		bottom = '',
		center = '',
		sub = '',
		tone = 'stamp',
		rotate = 0,
		size = 112,
		texture = true,
		label
	}: {
		top: string;
		bottom?: string;
		center?: string;
		sub?: string;
		tone?: 'stamp' | 'ink';
		rotate?: number;
		size?: number;
		/** Tinta irregular (filtre SVG). Desactiva-ho en llistes llargues. */
		texture?: boolean;
		label?: string;
	} = $props();

	const uid = $props.id();
	const arcTop = `segell-t-${uid}`;
	const arcBottom = `segell-b-${uid}`;
	const inkFilter = `segell-ink-${uid}`;
	const filter = $derived(texture ? `url(#${inkFilter})` : undefined);
</script>

<svg
	class={['segell', tone]}
	viewBox="0 0 120 120"
	width={size}
	height={size}
	style:transform={rotate ? `rotate(${rotate}deg)` : undefined}
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : 'true'}
	focusable="false"
>
	<defs>
		<path id={arcTop} d="M22 60 a38 38 0 1 1 76 0" />
		<path id={arcBottom} d="M17 60 a43 43 0 0 0 86 0" />
		{#if texture}
			<filter id={inkFilter} x="-5%" y="-5%" width="110%" height="110%">
				<feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7" result="n" />
				<feColorMatrix
					in="n"
					type="matrix"
					values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.6 0 0 0 2.3"
					result="a"
				/>
				<feComposite in="SourceGraphic" in2="a" operator="in" />
			</filter>
		{/if}
	</defs>
	<g {filter} fill="none" stroke="currentColor">
		<circle cx="60" cy="60" r="55" stroke-width="3" />
		<circle cx="60" cy="60" r="48" stroke-width="1.2" />
	</g>
	<g {filter} fill="currentColor">
		<text class="arc" font-size="10.5" letter-spacing="1.5">
			<textPath href="#{arcTop}" startOffset="50%" text-anchor="middle"
				>{top.toUpperCase()}</textPath
			>
		</text>
		{#if bottom}
			<text class="arc" font-size="9" letter-spacing="1.2">
				<textPath href="#{arcBottom}" startOffset="50%" text-anchor="middle">{bottom}</textPath>
			</text>
		{/if}
		{#if center}
			<text class="big" x="60" y={sub ? 66 : 70} font-size="21" text-anchor="middle">{center}</text>
		{/if}
		{#if sub}
			<text class="arc" x="60" y="80" font-size="8" text-anchor="middle">{sub.toUpperCase()}</text>
		{/if}
	</g>
</svg>

<style>
	.segell {
		display: block;
		flex: none;
		overflow: visible;
	}

	.stamp {
		color: var(--c-stamp-ink);
	}

	.ink {
		color: var(--c-ink);
	}

	@media (prefers-color-scheme: light) {
		.segell {
			mix-blend-mode: multiply;
		}
	}

	.arc {
		font-family: var(--font-mono);
		font-weight: 600;
	}

	.big {
		font-family: var(--font-wide);
		font-stretch: 125%;
		font-weight: 900;
	}
</style>
