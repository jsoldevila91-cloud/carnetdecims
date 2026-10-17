<script lang="ts">
	/**
	 * Compartir el carnet (bloc R3), sense servidor:
	 * - imatge PNG 1080×1350 dibuixada al client (`ui/compartir/imatge-carnet.ts`), amb el full de
	 *   compartir del sistema si permet fitxers o, si no, descàrrega;
	 * - enllaç de només lectura (`/{lang}/carnet#c=…`) amb els cims i les dates dins del fragment
	 *   (`enllacCarnet`): el fragment no arriba mai al servidor.
	 */
	import { onMount } from 'svelte';
	import { ascensionsVivesAmbEstat } from '$lib/data/ascensions';
	import { CIMS } from '$lib/data/catalog';
	import { enllacCarnet } from '$lib/data/compartir';
	import {
		avuiLocal,
		entradaCompartir,
		MAX_NOM_COMPARTIT,
		medalles,
		paginesCarnet,
		resumCarnet
	} from '$lib/domain';
	import { Button, Card, EmptyState, PageMeta } from '$lib/ui';
	import { cimPerId } from '$lib/ui/cim-per-id';
	import { inclinacioSegell, inicialsCim } from '$lib/ui/carnet';
	import { formatDataLlarga, romanPage } from '$lib/ui/format';
	import { obrirRegistre, registrarHref } from '$lib/ui/fulls';
	import { nomMedalla } from '$lib/ui/reptes';
	import { titolCarnetCompartit } from '$lib/ui/compartir/carnet-compartit';
	import {
		ALT_IMATGE,
		AMPLE_IMATGE,
		carregarFontsImatge,
		dibuixarImatgeCarnet,
		pngDelCanvas,
		type DadesImatge
	} from '$lib/ui/compartir/imatge-carnet';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	const NOM_MAX = MAX_NOM_COMPARTIT;
	const NOM_FITXER = 'carnetdecims.png';

	const vives = ascensionsVivesAmbEstat();
	const avui = avuiLocal();
	const locale = getLocale();
	const uid = $props.id();

	const ascensions = $derived($vives.ascensions);
	const carnet = $derived(paginesCarnet(ascensions, CIMS, { avui }));
	const resum = $derived(resumCarnet(ascensions, CIMS, { avui }));
	const llistaMedalles = $derived(medalles(ascensions, CIMS, { avui }).reverse());

	const textNivell = $derived(
		resum.nivell === 0 ? m.app_level_none() : m.app_level({ level: String(resum.nivell) })
	);

	// ── Imatge ──────────────────────────────────────────────────────────────
	let canvas: HTMLCanvasElement | undefined = $state();
	let blob = $state<Blob | null>(null);
	let urlImatge = $state<string | null>(null);
	let errorImatge = $state(false);
	let potCompartirFitxer = $state(false);
	let potCompartir = $state(false);

	onMount(() => {
		potCompartir = typeof navigator.share === 'function';
		try {
			const prova = new File([new Blob([''], { type: 'image/png' })], NOM_FITXER, {
				type: 'image/png'
			});
			potCompartirFitxer =
				typeof navigator.canShare === 'function' && navigator.canShare({ files: [prova] });
		} catch {
			potCompartirFitxer = false;
		}
		return () => {
			if (urlImatge) URL.revokeObjectURL(urlImatge);
		};
	});

	const dades = $derived.by((): DadesImatge => {
		const pagina = carnet.pagines[carnet.paginaActual - 1];
		return {
			total: resum.total,
			objectiu: resum.objectiuActual,
			segells: pagina.segells.map((s) => ({
				casella: s.casella,
				inicials: inicialsCim(cimPerId(s.cimId)?.nom ?? '?'),
				essencial: s.essencial,
				espera: !s.comptaPerRepte,
				rotacio: inclinacioSegell(s.ordre)
			})),
			textos: {
				marca: m.brand_name(),
				pagina: m.app_page({ page: romanPage(carnet.paginaActual) }),
				nivell: textNivell,
				essencials: m.app_essentials({
					done: String(resum.essencials.fetes),
					total: String(resum.essencials.total)
				}),
				titolMedalles: m.medals_title(),
				medalles: llistaMedalles.map(nomMedalla),
				senseMedalles: m.share_image_no_medals(),
				mesMedalles: (n) => m.share_image_more_medals({ count: String(n) }),
				data: formatDataLlarga(avui, locale),
				web: 'carnetdecims.cat'
			}
		};
	});

	const altImatge = $derived(
		m.share_image_alt({
			count: String(resum.total),
			target: String(resum.objectiuActual),
			level: textNivell,
			essentials: String(resum.essencials.fetes),
			medals: String(llistaMedalles.length),
			page: romanPage(carnet.paginaActual)
		})
	);

	/** Torna a dibuixar quan canvien les dades (i un cop carregades les fonts). */
	let torn = 0;
	$effect(() => {
		if (!$vives.carregat || !canvas || ascensions.length === 0) return;
		const d = dades;
		const el = canvas;
		const meu = ++torn;
		void (async () => {
			try {
				await carregarFontsImatge();
				if (meu !== torn) return;
				dibuixarImatgeCarnet(el, d);
				const b = await pngDelCanvas(el);
				if (meu !== torn) return;
				if (!b) throw new Error('toBlob');
				if (urlImatge) URL.revokeObjectURL(urlImatge);
				blob = b;
				urlImatge = URL.createObjectURL(b);
				errorImatge = false;
			} catch {
				if (meu === torn) errorImatge = true;
			}
		})();
	});

	function descarregarImatge() {
		if (!urlImatge) return;
		const a = document.createElement('a');
		a.href = urlImatge;
		a.download = NOM_FITXER;
		a.rel = 'noopener';
		a.click();
	}

	async function compartirImatge() {
		if (!blob) return;
		const fitxer = new File([blob], NOM_FITXER, { type: 'image/png' });
		try {
			await navigator.share({ files: [fitxer], title: m.share_image_share_title() });
		} catch (e) {
			// L'usuari ha tancat el full: no és cap error. Si el sistema el rebutja, es descarrega.
			if ((e as DOMException)?.name !== 'AbortError') descarregarImatge();
		}
	}

	// ── Enllaç de només lectura ─────────────────────────────────────────────
	let nom = $state('');
	let enllac = $state('');
	let generant = $state(false);
	let errorEnllac = $state(false);
	let avisCopia = $state('');
	let campEnllac: HTMLInputElement | undefined = $state();

	let tornEnllac = 0;
	$effect(() => {
		if (!$vives.carregat || ascensions.length === 0) return;
		// Un segell per cim (el que mostra el carnet), sense notes, companys ni mètode.
		const entrada = entradaCompartir(ascensions, CIMS, { avui, nom: nom.trim() || undefined });
		const meu = ++tornEnllac;
		generant = true;
		avisCopia = '';
		enllacCarnet(window.location.origin, locale, entrada)
			.then((url) => {
				if (meu !== tornEnllac) return;
				enllac = url;
				errorEnllac = false;
			})
			.catch(() => {
				if (meu === tornEnllac) errorEnllac = true;
			})
			.finally(() => {
				if (meu === tornEnllac) generant = false;
			});
	});

	async function copiar() {
		if (!enllac) return;
		avisCopia = '';
		try {
			await navigator.clipboard.writeText(enllac);
			avisCopia = m.share_link_copied();
		} catch {
			// Sense permís de porta-retalls: se selecciona el text perquè es pugui copiar a mà.
			campEnllac?.focus();
			campEnllac?.select();
			avisCopia = m.share_link_copy_manual();
		}
	}

	async function compartirEnllac() {
		if (!enllac) return;
		const n = nom.trim();
		try {
			await navigator.share({
				title: titolCarnetCompartit(n),
				text: m.share_link_share_text(),
				url: enllac
			});
		} catch {
			// Cancel·lat o no permès: no cal fer res (hi ha el botó Copia).
		}
	}
</script>

<PageMeta title={m.share_meta_title()} noindex />

<h1 class="x-wide title">{m.share_title()}</h1>
<p class="lede">{m.share_lede()}</p>

{#if !$vives.carregat}
	<p class="mono estat" role="status">{m.app_loading()}</p>
{:else if ascensions.length === 0}
	<EmptyState title={m.share_empty_title()} icon="share">
		<p>{m.share_empty_text()}</p>
		{#snippet actions()}
			<Button
				href={registrarHref()}
				variant="stamp"
				size="lg"
				icon="stamp"
				onclick={(e: MouseEvent) => obrirRegistre(e)}
			>
				{m.app_empty_cta()}
			</Button>
		{/snippet}
	</EmptyState>
{:else}
	<div class="seccions">
		<Card as="section" padding="md" aria-labelledby="{uid}-img">
			<h2 id="{uid}-img" class="x-wide">{m.share_image_title()}</h2>
			<p class="text">{m.share_image_text()}</p>

			<canvas bind:this={canvas} width={AMPLE_IMATGE} height={ALT_IMATGE} hidden></canvas>
			<div class="previ" aria-busy={!urlImatge}>
				{#if urlImatge}
					<img
						src={urlImatge}
						alt={altImatge}
						width={AMPLE_IMATGE}
						height={ALT_IMATGE}
						data-testid="compartir-previsualitzacio"
					/>
				{:else if errorImatge}
					<p role="alert">{m.share_image_error()}</p>
				{:else}
					<p class="mono" role="status">{m.share_image_loading()}</p>
				{/if}
			</div>

			<div class="accions">
				{#if potCompartirFitxer}
					<Button variant="stamp" icon="share" onclick={compartirImatge} disabled={!blob}>
						{m.share_image_share()}
					</Button>
				{/if}
				<Button
					variant={potCompartirFitxer ? 'outline' : 'stamp'}
					icon="download"
					onclick={descarregarImatge}
					disabled={!urlImatge}
				>
					{m.share_image_download()}
				</Button>
			</div>
			<p class="hint">{m.share_image_privacy()}</p>
		</Card>

		<Card as="section" padding="md" aria-labelledby="{uid}-link">
			<h2 id="{uid}-link" class="x-wide">{m.share_link_title()}</h2>
			<p class="text">{m.share_link_text()}</p>

			<div class="camp">
				<label for="{uid}-nom">{m.share_link_name_label()}</label>
				<input
					id="{uid}-nom"
					class="field"
					type="text"
					maxlength={NOM_MAX}
					autocomplete="off"
					bind:value={nom}
					aria-describedby="{uid}-nom-hint"
				/>
				<p id="{uid}-nom-hint" class="hint">
					{m.share_link_name_hint({ max: String(NOM_MAX) })}
				</p>
			</div>

			<div class="privacitat" role="note">
				<p><b>{m.share_link_privacy_title()}</b></p>
				<ul>
					<li>{m.share_link_privacy_1()}</li>
					<li>{m.share_link_privacy_2()}</li>
					<li>{m.share_link_privacy_3()}</li>
				</ul>
			</div>

			<div class="camp">
				<label for="{uid}-url">{m.share_link_url_label()}</label>
				<input
					bind:this={campEnllac}
					id="{uid}-url"
					class="field url mono"
					type="url"
					readonly
					value={enllac}
					aria-busy={generant}
					data-testid="compartir-enllac"
				/>
			</div>
			{#if errorEnllac}
				<p class="error" role="alert">{m.share_link_error()}</p>
			{/if}

			<div class="accions">
				<Button variant="ink" icon="copy" onclick={copiar} disabled={!enllac || generant}>
					{m.share_link_copy()}
				</Button>
				{#if potCompartir}
					<Button
						variant="outline"
						icon="share"
						onclick={compartirEnllac}
						disabled={!enllac || generant}
					>
						{m.share_link_share()}
					</Button>
				{/if}
				{#if enllac && !generant}
					<a class="obrir" href={enllac} target="_blank" rel="noopener"
						>{m.share_link_open()}<span class="sr-only">{m.validation_external_hint()}</span></a
					>
				{/if}
			</div>
			<p class="viu mono" aria-live="polite" data-testid="compartir-avis-copia">{avisCopia}</p>
		</Card>
	</div>

	<p class="tornar"><a href={href('/app')}>← {m.app_title()}</a></p>
{/if}

<style>
	.title {
		margin-bottom: var(--sp-3);
		font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1.05;
	}

	.lede {
		max-width: 44rem;
		color: var(--c-ink-2);
	}

	.estat {
		margin-top: var(--sp-6);
		color: var(--c-ink-2);
	}

	.seccions {
		display: grid;
		gap: var(--sp-6);
		margin-top: var(--sp-6);
	}

	@media (min-width: 64rem) {
		.seccions {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			align-items: start;
		}
	}

	h2 {
		font-size: var(--fs-md);
		font-weight: var(--fw-black);
	}

	.text {
		margin-top: var(--sp-2);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	.previ {
		display: grid;
		place-items: center;
		margin-top: var(--sp-4);
		aspect-ratio: 4 / 5;
		max-width: 26rem;
		border: 1px solid var(--c-rule);
		border-radius: var(--r-md);
		background: var(--c-paper-2);
		overflow: hidden;
	}

	.previ img {
		display: block;
		width: 100%;
		height: auto;
	}

	.previ p {
		padding: var(--sp-4);
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
		text-align: center;
	}

	.accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--sp-3);
		margin-top: var(--sp-4);
	}

	.hint {
		margin-top: var(--sp-2);
		font-size: var(--fs-xs);
		color: var(--c-ink-2);
	}

	.camp {
		display: grid;
		gap: var(--sp-1);
		margin-top: var(--sp-4);
		min-width: 0;
	}

	.camp label {
		font-weight: var(--fw-bold);
		font-size: var(--fs-sm);
	}

	.field {
		width: 100%;
		min-width: 0;
		min-height: var(--tap);
		padding: var(--sp-2) var(--sp-3);
		background: var(--c-paper);
		color: var(--c-ink);
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		font-size: var(--fs-base);
	}

	.url {
		font-size: var(--fs-xs);
		text-overflow: ellipsis;
	}

	.privacitat {
		margin-top: var(--sp-4);
		padding: var(--sp-3) var(--sp-4);
		border: var(--bw) dashed var(--c-line);
		border-radius: var(--r-md);
		font-size: var(--fs-sm);
	}

	.privacitat ul {
		margin: var(--sp-1) 0 0;
		padding-inline-start: var(--sp-5);
	}

	.privacitat li + li {
		margin-top: var(--sp-1);
	}

	.error {
		margin-top: var(--sp-2);
		color: var(--c-stamp-ink);
		font-weight: var(--fw-semibold);
		font-size: var(--fs-sm);
	}

	.obrir {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		color: var(--c-stamp-ink);
	}

	.viu {
		min-height: 1.5em;
		margin-top: var(--sp-2);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		color: var(--c-pine);
	}

	.tornar {
		margin-top: var(--sp-6);
	}

	.tornar a {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		color: var(--c-stamp-ink);
	}
</style>
