<script lang="ts">
	import { ascensionsVivesAmbEstat } from '$lib/data/ascensions';
	import { CIMS } from '$lib/data/catalog';
	import { avuiLocal, distanciaKm, essencialsPendentsOrdenades, type Punt } from '$lib/domain';
	import { Button, PageMeta } from '$lib/ui';
	import FilaEssencial from '$lib/ui/FilaEssencial.svelte';
	import { demanarPosicio, type ErrorPosicio } from '$lib/platform/geolocalitzacio';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	const vives = ascensionsVivesAmbEstat();
	const avui = avuiLocal();
	const TOTAL_ESSENCIALS = CIMS.filter((c) => c.essencial).length;

	/** Posició de l'usuari: només es demana en prémer el botó, mai en carregar la pàgina. */
	let posicio = $state<Punt | null>(null);
	let buscant = $state(false);
	let error = $state<ErrorPosicio | null>(null);

	const pendents = $derived(
		essencialsPendentsOrdenades($vives.ascensions, CIMS, { avui, des: posicio })
	);

	const ERRORS: Record<ErrorPosicio, () => string> = {
		denegada: m.ess_error_denied,
		'no-disponible': m.ess_error_unavailable,
		temps: m.ess_error_timeout,
		'no-suportada': m.ess_error_unsupported
	};

	async function perProximitat() {
		buscant = true;
		error = null;
		const r = await demanarPosicio();
		buscant = false;
		if (r.ok) posicio = r.punt;
		else error = r.error;
	}

	function perComarca() {
		posicio = null;
		error = null;
	}

	const distancia = (lat: number | null, lon: number | null) =>
		posicio && lat !== null && lon !== null ? distanciaKm(posicio, { lat, lon }) : null;
</script>

<PageMeta title={m.ess_meta_title()} noindex />

<p class="crumb mono"><a href={href('/app')}>← {m.app_title()}</a></p>
<h1 class="x-wide title">{m.ess_title()}</h1>

{#if !$vives.carregat}
	<p class="mono estat" role="status">{m.app_loading()}</p>
{:else if pendents.length === 0}
	<p class="lede">{m.ess_all_done()}</p>
{:else}
	<p class="lede">
		{m.ess_lede({ count: String(pendents.length), total: String(TOTAL_ESSENCIALS) })}
	</p>

	<div class="ordre">
		<!-- Un sol botó (el focus no es perd en canviar d'ordre); ocupat, `aria-disabled`. -->
		<Button
			variant={posicio ? 'outline' : 'ink'}
			icon="map"
			aria-disabled={buscant}
			onclick={() => (buscant ? undefined : posicio ? perComarca() : perProximitat())}
		>
			{posicio ? m.ess_sort_default() : m.ess_sort_proximity()}
		</Button>
		<p class="hint">{m.ess_privacy()}</p>
	</div>

	<p class="estat mono" role="status">
		{buscant ? m.ess_locating() : posicio ? m.ess_sorted_distance() : m.ess_sorted_default()}
	</p>
	{#if error}
		<p class="error" role="alert">{ERRORS[error]()}</p>
	{/if}

	<ul class="llista">
		{#each pendents as cim (cim.id)}
			<li><FilaEssencial {cim} distanciaKm={distancia(cim.lat, cim.lon)} /></li>
		{/each}
	</ul>
{/if}

<style>
	.crumb {
		margin-bottom: var(--sp-2);
		font-size: var(--fs-xs);
	}

	.crumb a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		color: var(--c-ink-2);
	}

	.title {
		margin-bottom: var(--sp-3);
		font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1;
	}

	.lede {
		color: var(--c-ink-2);
	}

	.ordre {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--sp-3);
		margin-top: var(--sp-4);
	}

	.hint {
		flex: 1 1 14rem;
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.estat {
		margin-top: var(--sp-3);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.error {
		margin-top: var(--sp-2);
		padding: var(--sp-2) var(--sp-3);
		border: 1.5px solid var(--c-stamp-ink);
		border-radius: var(--r-sm);
		background: var(--c-stamp-soft);
		font-size: var(--fs-sm);
	}

	.llista {
		margin: var(--sp-3) 0 var(--sp-8);
		padding: 0;
		list-style: none;
	}
</style>
