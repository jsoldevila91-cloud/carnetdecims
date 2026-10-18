<script lang="ts">
	/**
	 * Botó "Comparteix" d'una ascensió (bloc R5): genera al dispositiu una imatge 1080×1350 amb el
	 * cim, l'altitud, la comarca, la data, la marca i el web (`imatge-ascensio.ts`) i l'obre al
	 * full de compartir del sistema; si el navegador no comparteix fitxers, la descarrega.
	 * Sense notes, companys ni mètode. La imatge segueix el tema (clar/fosc) del sistema.
	 *
	 * Si el navegador perd el gest de l'usuari mentre es dibuixa la imatge (`NotAllowedError`), la
	 * imatge queda a punt i la regió viva demana un segon toc.
	 */
	import { comarcaPerSlug } from '$lib/data/catalog';
	import type { DataISO } from '$lib/domain';
	import { getLocale } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import Button from '../Button.svelte';
	import Icon from '../Icon.svelte';
	import { cimPerId } from '../cim-per-id';
	import { dataSegellLlarga } from '../carnet';
	import { formatAltitude, formatDataLlarga } from '../format';
	import { compartirImatge, descarregar } from './compartir-fitxer';
	import { carregarFontsImatge, pngDelCanvas, temaDelSistema } from './imatge-comu';
	import { dibuixarImatgeAscensio, type DadesImatgeAscensio } from './imatge-ascensio';

	let {
		cimId,
		data,
		estil = 'accio'
	}: {
		cimId: number;
		/** Data de l'ascensió (`AAAA-MM-DD`). */
		data: DataISO;
		/** `accio`: botó petit de les files (historial); `boto`: `Button` contornejat (detall). */
		estil?: 'accio' | 'boto';
	} = $props();

	const locale = getLocale();
	const cim = $derived(cimPerId(cimId));
	const dataLlarga = $derived(formatDataLlarga(data, locale));
	const etiqueta = $derived(m.ascent_share_label({ cim: cim?.nom ?? '', date: dataLlarga }));

	let generant = $state(false);
	let avis = $state('');
	/** Imatge ja dibuixada (clau: cim, data i tema) per a un segon toc. */
	let cache: { clau: string; blob: Blob } | null = null;
	let esperaSegonToc = false;

	const nomFitxer = $derived(`carnetdecims-${cim?.slug ?? cimId}-${data}.png`);

	function dades(): DadesImatgeAscensio | null {
		const c = cim;
		if (!c) return null;
		const comarca = comarcaPerSlug(c.comarca)?.nom ?? '';
		const altitud = formatAltitude(c.altitud);
		return {
			nom: c.nom,
			altitud,
			comarca,
			essencial: c.essencial,
			dataSegell: dataSegellLlarga(data),
			tema: temaDelSistema(),
			textos: {
				marca: m.brand_name(),
				etiqueta: m.ascent_share_tag(),
				essencial: m.ascent_share_essential(),
				meta: m.ess_peak_meta({ alt: altitud, comarca }),
				data: dataLlarga,
				web: 'carnetdecims.cat'
			}
		};
	}

	async function generar(d: DadesImatgeAscensio): Promise<Blob | null> {
		const clau = `${cimId}|${data}|${d.tema}|${locale}`;
		if (cache?.clau === clau) return cache.blob;
		await carregarFontsImatge();
		const canvas = document.createElement('canvas');
		dibuixarImatgeAscensio(canvas, d);
		const blob = await pngDelCanvas(canvas);
		if (blob) cache = { clau, blob };
		return blob;
	}

	async function compartir() {
		if (generant) return;
		const d = dades();
		if (!d) return;
		generant = true;
		avis = '';
		try {
			const blob = await generar(d);
			if (!blob) throw new Error('toBlob');
			const resultat = await compartirImatge(blob, nomFitxer, m.ascent_share_title({ cim: d.nom }));
			if (resultat === 'sense-gest') {
				// Segon intent sense gest: el navegador no ho permet; es descarrega.
				if (esperaSegonToc) {
					descarregar(blob, nomFitxer);
					esperaSegonToc = false;
					avis = m.ascent_share_downloaded();
				} else {
					esperaSegonToc = true;
					avis = m.ascent_share_ready();
				}
			} else {
				esperaSegonToc = false;
				avis = resultat === 'descarregat' ? m.ascent_share_downloaded() : '';
			}
		} catch {
			avis = m.ascent_share_error();
		} finally {
			generant = false;
		}
	}
</script>

{#if cim}
	<span class="compartir">
		{#if estil === 'boto'}
			<Button
				variant="outline"
				icon="share"
				onclick={compartir}
				aria-label={etiqueta}
				aria-busy={generant}
				aria-disabled={generant ? 'true' : undefined}
				data-testid="compartir-ascensio"
			>
				{m.ascent_share()}
			</Button>
		{:else}
			<button
				type="button"
				class="accio"
				onclick={compartir}
				aria-label={etiqueta}
				aria-busy={generant}
				aria-disabled={generant ? 'true' : undefined}
				data-testid="compartir-ascensio"
			>
				<Icon name="share" size={16} />{m.ascent_share()}
			</button>
		{/if}
		<span class="viu mono" role="status" aria-live="polite"
			>{generant ? m.ascent_share_preparing() : avis}</span
		>
	</span>
{/if}

<style>
	.compartir {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		row-gap: var(--sp-1);
		min-width: 0;
	}

	.accio {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--sp-1);
		min-height: var(--tap);
		min-width: var(--tap);
		padding: 0 var(--sp-3);
		background: var(--c-card);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		color: var(--c-ink);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		cursor: pointer;
	}

	.accio[aria-disabled='true'] {
		cursor: progress;
		color: var(--c-ink-2);
	}

	/* La regió viva sempre és al document (perquè s'anunciï); buida no ocupa lloc. */
	.viu:not(:empty) {
		margin-inline-start: var(--sp-2);
	}

	.viu {
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		color: var(--c-ink-2);
	}
</style>
