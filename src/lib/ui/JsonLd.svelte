<script lang="ts">
	/**
	 * Dades estructurades schema.org al `<head>` (un `@graph` per pàgina, docs/02 §5).
	 * S'escapa `<` perquè cap text del contingut pugui tancar l'etiqueta `<script>`.
	 */
	let { data }: { data: Record<string, unknown> } = $props();

	const json = $derived(JSON.stringify(data).replace(/</g, '\\u003c'));
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON serialitzat i escapat -->
	{@html `<script type="application/ld+json">${json}</` + `script>`}
</svelte:head>
