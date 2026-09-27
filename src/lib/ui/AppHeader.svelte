<script lang="ts">
	import Logo from './Logo.svelte';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
</script>

<header class="app-header">
	<div class="inner">
		<a class="brand" href={href('/')} aria-label={m.brand_home_label()}>
			<Logo size={26} />
			<span class="name">{m.brand_name()}</span>
		</a>
		<LanguageSwitcher />
	</div>
</header>

<style>
	.app-header {
		position: sticky;
		top: 0;
		z-index: var(--z-header);
		padding-top: var(--safe-top);
		background: color-mix(in srgb, var(--c-paper) 92%, transparent);
		backdrop-filter: blur(6px);
		border-bottom: 1px dashed var(--c-rule);
		view-transition-name: app-header;
	}

	.inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sp-3);
		max-width: var(--content-max);
		min-height: 3.5rem;
		margin: 0 auto;
		padding: 0 var(--gutter);
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: var(--sp-2);
		min-height: var(--tap);
		color: var(--c-stamp-ink);
		text-decoration: none;
	}

	.name {
		font-stretch: var(--stretch-wide);
		font-weight: var(--fw-heavy);
		font-size: var(--fs-sm);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
</style>
