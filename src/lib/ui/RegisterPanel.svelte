<script lang="ts">
	import EmptyState from './EmptyState.svelte';
	import { m } from '$lib/paraglide/messages';

	/**
	 * Contingut de "Registrar ascensió". Es fa servir al full (shallow routing) i a
	 * la pàgina /app/registrar. El formulari real arriba a la fase 4.
	 */
	let { headingLevel = 2 }: { headingLevel?: 2 | 3 } = $props();
</script>

<div class="register-panel">
	<EmptyState title={m.register_soon_title()} icon="stamp" {headingLevel}>
		<p>{m.register_soon_text()}</p>
	</EmptyState>
	<p class="note">{m.register_validation_note()}</p>
</div>

<style>
	.register-panel {
		display: grid;
		gap: var(--sp-4);
	}

	.note {
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
		padding-top: var(--sp-3);
		border-top: 1px dashed var(--c-rule);
	}
</style>
