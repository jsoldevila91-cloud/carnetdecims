<script module lang="ts">
	/** Clau de sessionStorage. `app.html` la llegeix abans de pintar (`html[data-beta-amagat]`). */
	export const CLAU_BETA = 'carnetdecims:beta-amagat';
	export const CORREU_OPINIO = 'hola@carnetdecims.cat';
</script>

<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Icon from './Icon.svelte';
	import { m } from '$lib/paraglide/messages';

	/**
	 * Avís discret "Versió beta privada" a totes les pàgines. Es pot amagar per a la sessió del
	 * navegador. Surt a l'HTML prerenderitzat; si ja s'havia amagat, un script d'`app.html`
	 * l'amaga abans del primer pintat (sense salt de disseny en hidratar).
	 */
	let visible = $state(true);

	onMount(() => {
		try {
			visible = sessionStorage.getItem(CLAU_BETA) !== '1';
		} catch {
			visible = true;
		}
	});

	async function amaga() {
		visible = false;
		try {
			sessionStorage.setItem(CLAU_BETA, '1');
		} catch {
			/* només fins a la propera navegació completa */
		}
		document.documentElement.setAttribute('data-beta-amagat', '');
		await tick();
		document.getElementById('contingut')?.focus();
	}
</script>

{#if visible}
	<aside class="beta" aria-label={m.beta_banner_label()}>
		<p>
			{m.beta_banner_text()}
			<a href="mailto:{CORREU_OPINIO}">{CORREU_OPINIO}</a>
		</p>
		<button type="button" onclick={amaga}>
			<Icon name="close" size={16} />
			<span class="sr-only">{m.beta_banner_close()}</span>
		</button>
	</aside>
{/if}

<style>
	.beta {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		width: 100%;
		max-width: var(--content-max);
		margin: 0 auto;
		padding: 0 var(--sp-1) 0 var(--gutter);
		border-bottom: 1px dashed var(--c-rule);
		color: var(--c-ink-2);
		font-family: var(--font-mono);
		font-size: var(--fs-2xs);
		line-height: 1.45;
	}

	:global(html[data-beta-amagat]) .beta {
		display: none;
	}

	p {
		flex: 1;
		min-width: 0;
		margin: 0;
		padding-block: var(--sp-2);
	}

	a {
		color: var(--c-ink);
		font-weight: var(--fw-semibold);
		text-underline-offset: 2px;
		overflow-wrap: anywhere;
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
		.beta {
			--gutter: 2rem;
		}
	}
</style>
