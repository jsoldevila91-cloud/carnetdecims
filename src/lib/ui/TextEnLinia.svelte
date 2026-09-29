<script lang="ts">
	import Icon from './Icon.svelte';
	import { analitzarTextEnLinia, type SegmentSimple } from './text-en-linia';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	/**
	 * Text en línia del contingut editorial: enllaços interns (localitzats), externs, negreta i
	 * marcadors `[PENDENT: …]`. Tot es pinta amb elements de Svelte, que escapen el text:
	 * no hi ha cap `{@html}`.
	 */
	let { text }: { text: string } = $props();

	const segments = $derived(analitzarTextEnLinia(text));

	/** `/cami#ancora` → camí localitzat + àncora (el patró de ruta no inclou el fragment). */
	function hrefIntern(desti: string): string {
		const tall = desti.search(/[?#]/);
		return tall === -1 ? href(desti) : href(desti.slice(0, tall)) + desti.slice(tall);
	}
</script>

{#snippet simple(s: SegmentSimple)}
	{#if s.tipus === 'enllac' && s.extern}<a
			class="ext"
			href={s.desti}
			rel="external noopener"
			target="_blank"
			>{s.text}<Icon name="external" size={13} strokeWidth={2} /><span class="sr-only"
				>{' ' + m.content_new_tab()}</span
			></a
		>{:else if s.tipus === 'enllac'}<a href={hrefIntern(s.desti)}>{s.text}</a
		>{:else if s.tipus === 'pendent'}<mark class="pendent" title={m.content_pending_title()}
			>{s.text}</mark
		>{:else}{s.text}{/if}
{/snippet}

{#each segments as s, i (i)}{#if s.tipus === 'negreta'}<strong
			>{#each s.fills as f, j (j)}{@render simple(f)}{/each}</strong
		>{:else}{@render simple(s)}{/if}{/each}

<style>
	a {
		color: var(--c-stamp-ink);
		font-weight: var(--fw-semibold);
		text-underline-offset: 2px;
	}

	.ext :global(.icon) {
		display: inline;
		margin-left: 2px;
		vertical-align: -0.1em;
	}

	/* Contingut pendent de confirmar: visible tal qual, però destacat perquè no passi per bo. */
	.pendent {
		padding: 0 0.25em;
		border: 1px dashed var(--c-stamp-ink);
		border-radius: var(--r-xs);
		background: var(--c-stamp-soft);
		color: var(--c-ink);
		font-family: var(--font-mono);
		font-size: 0.9em;
		box-decoration-break: clone;
		-webkit-box-decoration-break: clone;
	}
</style>
