<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import Icon from '../Icon.svelte';
	import type { ApiCompte } from './api';
	import { apiReal } from './api-real';

	/**
	 * Accés discret a "Crea un compte" a la capçalera de la zona /app, només per a anònims.
	 * Es pot amagar (per sempre en aquest navegador): el Perfil continua oferint-ho.
	 * Es carrega sota demanda des d'`AppHeader` (no afegeix Supabase a les pàgines públiques).
	 */
	let { api = apiReal }: { api?: ApiCompte } = $props();

	// svelte-ignore state_referenced_locally
	const { sessio } = api;
	// svelte-ignore state_referenced_locally
	const disponible = api.compteDisponible();

	const CLAU = 'carnetdecims:cta-compte-amagat';
	let amagat = $state(true);

	onMount(() => {
		try {
			amagat = localStorage.getItem(CLAU) === '1';
		} catch {
			amagat = false;
		}
	});

	async function amaga() {
		amagat = true;
		try {
			localStorage.setItem(CLAU, '1');
		} catch {
			/* només per a aquesta visita */
		}
		// El botó desapareix: el focus va al contingut (no a <body>).
		await tick();
		document.getElementById('contingut')?.focus();
	}
</script>

{#if disponible && $sessio.estat === 'anonim' && !amagat}
	<div class="cta-compte">
		<a href={href('/app/compte') + '#compte'}>
			<Icon name="user" size={18} />
			<span><strong>{m.header_cta_account()}</strong> · {m.header_cta_text()}</span>
		</a>
		<button type="button" onclick={amaga}>
			<Icon name="close" size={16} />
			<span class="sr-only">{m.header_cta_dismiss()}</span>
		</button>
	</div>
{/if}

<style>
	.cta-compte {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		width: 100%;
		max-width: var(--content-max);
		margin: 0 auto;
		padding: 0 var(--sp-1) 0 var(--gutter);
		border-bottom: 1px dashed var(--c-rule);
	}

	a {
		display: inline-flex;
		flex: 1;
		align-items: center;
		gap: var(--sp-2);
		min-width: 0;
		min-height: var(--tap);
		color: var(--c-ink-2);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		text-decoration: none;
	}

	a :global(svg) {
		color: var(--c-stamp-ink);
	}

	strong {
		color: var(--c-stamp-ink);
		font-weight: var(--fw-bold);
	}

	a:hover strong {
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	button {
		display: grid;
		flex: none;
		place-items: center;
		width: var(--tap);
		height: var(--tap);
		padding: 0;
		background: none;
		border: 0;
		border-radius: var(--r-sm);
		color: var(--c-ink-2);
		cursor: pointer;
	}

	button:hover {
		color: var(--c-ink);
	}

	@media (min-width: 48rem) {
		.cta-compte {
			--gutter: 2rem;
		}
	}
</style>
