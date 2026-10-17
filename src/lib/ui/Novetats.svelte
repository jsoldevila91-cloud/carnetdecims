<script lang="ts">
	import { onMount, tick } from 'svelte';
	import {
		CLAU_NOVETATS,
		darreraNovetat,
		novetatsPerMostrar,
		type Novetat
	} from '$lib/content/novetats';
	import BottomSheet from './BottomSheet.svelte';
	import Button from './Button.svelte';
	import { formatDataLlarga } from './format';
	import { getLocale } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	/**
	 * Full de novetats després d'una actualització (bloc R2). Vegeu `content/novetats.ts`.
	 * `localStorage` pot no estar disponible (navegació privada, bloquejat): llavors no es mostra
	 * res i el web funciona igual.
	 */
	const locale = getLocale() === 'es' ? 'es' : 'ca';
	let novetats = $state<Novetat[]>([]);
	let obert = $state(false);

	function llegir(clau: string): string | null {
		try {
			return localStorage.getItem(clau);
		} catch {
			return null;
		}
	}

	function desar(id: string | null) {
		if (!id) return;
		try {
			localStorage.setItem(CLAU_NOVETATS, id);
		} catch {
			// sense emmagatzematge: no es recorda (es tornaria a mostrar)
		}
	}

	/** Indicis que el navegador ja havia fet servir el web (altres preferències pròpies desades). */
	function usuariExistent(): boolean {
		try {
			for (let i = 0; i < localStorage.length; i++) {
				const k = localStorage.key(i);
				if (k && k.startsWith('carnetdecims:') && k !== CLAU_NOVETATS) return true;
			}
		} catch {
			// sense accés
		}
		return false;
	}

	onMount(() => {
		let disponible = true;
		try {
			void localStorage.length;
		} catch {
			disponible = false;
		}
		if (!disponible) return;
		const vista = llegir(CLAU_NOVETATS);
		const perMostrar = novetatsPerMostrar(vista, vista === null && usuariExistent());
		if (perMostrar.length === 0) {
			// Usuari nou (o ja ho ha vist tot): es marca la darrera com a vista sense mostrar-la.
			if (vista === null) desar(darreraNovetat());
			return;
		}
		novetats = perMostrar;
		obert = true;
	});

	/**
	 * El full s'obre sol (cap control l'ha obert): en tancar-lo, el navegador deixaria el focus a
	 * <body>. Va al contingut principal (WCAG 2.4.3), si l'usuari no l'ha mogut ja.
	 */
	async function tancar() {
		obert = false;
		desar(darreraNovetat());
		await tick();
		requestAnimationFrame(() => {
			const actiu = document.activeElement;
			if (actiu && actiu !== document.body && actiu.isConnected) return;
			document.getElementById('contingut')?.focus();
		});
	}
</script>

<BottomSheet open={obert} title={m.news_title()} onclose={tancar}>
	<div class="novetats" data-testid="novetats">
		{#each novetats as n (n.id)}
			<section class="entrada" aria-labelledby="nov-{n.id}">
				<h3 id="nov-{n.id}">{n.titol[locale]}</h3>
				<p class="data mono"><time datetime={n.data}>{formatDataLlarga(n.data, locale)}</time></p>
				<ul>
					{#each n.punts[locale] as p, i (i)}
						<li>{p}</li>
					{/each}
				</ul>
			</section>
		{/each}
		<Button variant="ink" onclick={tancar}>{m.news_close()}</Button>
	</div>
</BottomSheet>

<style>
	.novetats {
		display: grid;
		justify-items: start;
		gap: var(--sp-5);
	}

	.entrada {
		display: grid;
		gap: var(--sp-2);
	}

	h3 {
		font-stretch: var(--stretch-semi);
		font-weight: var(--fw-heavy);
		font-size: var(--fs-lg);
	}

	.data {
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	ul {
		display: grid;
		gap: var(--sp-2);
		margin: 0;
		padding-left: var(--sp-5);
	}
</style>
