<script lang="ts">
	// Pàgina offline (prerenderitzada a /ca/offline i /es/offline). El service worker la serveix,
	// des del precache, a qualsevol navegació sense xarxa cap a una pàgina que no té desada
	// (`src/service-worker.ts`); l'URL de la barra d'adreces és la que s'havia demanat.
	import { Button, EmptyState, PageMeta } from '$lib/ui';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	function tornaHoAProvar() {
		window.location.reload();
	}
</script>

<PageMeta title={m.offline_page_title()} noindex />

<div class="offline">
	<EmptyState title={m.offline_page_title()} icon="offline" headingLevel={1}>
		<p>{m.offline_page_text()}</p>
		{#snippet actions()}
			<Button variant="ink" icon="refresh" block onclick={tornaHoAProvar}>
				{m.offline_page_retry()}
			</Button>
			<Button href={href('/app')} variant="outline" icon="stamp" block
				>{m.offline_page_carnet()}</Button
			>
			<Button href={href('/app/registrar')} variant="outline" icon="plus" block>
				{m.offline_page_register()}
			</Button>
		{/snippet}
	</EmptyState>
</div>

<style>
	.offline {
		display: grid;
		gap: var(--sp-3);
		max-width: 36rem;
		margin: var(--sp-8) auto 0;
	}

	/* Accions apilades i de la mateixa amplada (al mòbil, totes a l'abast del polze). */
	.offline :global(.actions) {
		display: grid;
		width: min(100%, 20rem);
	}

	.offline :global(.actions .btn) {
		justify-content: center;
	}
</style>
