<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { avuiLocal } from '$lib/domain';
	import { descarregarText } from '$lib/platform/fitxers';
	import { network } from '$lib/platform/network.svelte';
	import { getLocale, href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import BottomSheet from '../BottomSheet.svelte';
	import Button from '../Button.svelte';
	import Card from '../Card.svelte';
	import Icon from '../Icon.svelte';
	import { toasts } from '../toast.svelte';
	import { codiError, type ApiCompte } from './api';
	import { apiReal } from './api-real';
	import EstatNuvolText from './EstatNuvolText.svelte';
	import {
		VIGENCIA_ENLLAC_MS,
		confirmacioValida,
		desaEnllacEnviat,
		emailValid,
		estatNuvol,
		estatPrimerAcces,
		llegeixEnllacEnviat,
		missatgePrimerAcces,
		oblidaEnllacEnviat,
		segonsPerReenviar,
		type EnllacEnviat,
		type MissatgePrimerAcces
	} from './nuvol';

	/**
	 * Secció "El teu compte" del Perfil: entrar amb un enllaç (o el codi) del correu, sense
	 * contrasenya; estat de la sincronització; tancar la sessió i esborrar el compte. En tornar de
	 * l'enllaç (primer accés) anuncia quan s'han desat les ascensions al núvol.
	 */
	let {
		/** Ascensions locals (per al missatge del primer accés); `null` mentre es carreguen. */
		ascensionsLocals,
		api = apiReal
	}: { ascensionsLocals: number | null; api?: ApiCompte } = $props();

	// L'API no canvia durant la vida del component (és una dependència, no un estat).
	// svelte-ignore state_referenced_locally
	const { sessio, estatSync } = api;

	const uid = $props.id();
	const ids = {
		titol: `compte-${uid}`,
		email: `compte-email-${uid}`,
		emailErr: `compte-email-err-${uid}`,
		codi: `compte-codi-${uid}`,
		codiHint: `compte-codi-hint-${uid}`,
		codiErr: `compte-codi-err-${uid}`,
		confirma: `compte-confirma-${uid}`
	};
	const locale = getLocale();
	// svelte-ignore state_referenced_locally
	const disponible = api.compteDisponible();

	const sessioActual = $derived($sessio);
	const usuariEmail = $derived(
		sessioActual.estat === 'autenticat' ? (sessioActual.usuari?.email ?? '') : ''
	);
	const estat = $derived(estatNuvol(sessioActual, $estatSync, network.online));

	let titol: HTMLHeadingElement | undefined = $state();
	let campEmail: HTMLInputElement | undefined = $state();
	let avisEnviat: HTMLDivElement | undefined = $state();
	let avisPrimer: HTMLParagraphElement | undefined = $state();

	// ── Entrar (anònim) ──
	let email = $state('');
	let errorEmail = $state<string | null>(null);
	let enviant = $state(false);
	let enviat = $state<EnllacEnviat | null>(null);
	let ara = $state(Date.now());
	const espera = $derived(enviat ? segonsPerReenviar(enviat.t, ara) : 0);
	let codi = $state('');
	let errorCodi = $state<string | null>(null);
	let verificant = $state(false);
	/** Error en tornar de l'enllaç (caducat, ja fet servir…). */
	let errorEnllac = $state<string | null>(null);

	// ── Primer accés: instant d'entrada i ascensions que hi havia abans ──
	let primerDesDe = $state<number | null>(null);
	let primerAbans = $state<number | null>(null);
	let primerFet = $state<MissatgePrimerAcces | null>(null);

	onMount(() => {
		network.start();
		const e = llegeixEnllacEnviat();
		// L'estat "t'hem enviat un correu" sobreviu una hora (p. ex. si es tanca la pestanya).
		if (e && Date.now() - e.t < VIGENCIA_ENLLAC_MS) {
			enviat = e;
			email = e.email;
		} else if (e) {
			oblidaEnllacEnviat();
		}
		if (!disponible) return;
		// Tornada de l'enllaç del correu: es completa l'entrada i es neteja la URL.
		const desde = Date.now();
		void api.completarEntradaDesDeUrl().then(async (r) => {
			if (r === 'cap') return;
			if (r === 'entrat') {
				iniciaPrimerAcces(desde);
				await tick();
				avisPrimer?.focus();
				return;
			}
			errorEnllac = codiError(r) === 'codi:invalid' ? m.cloud_link_invalid() : textErrorCompte(r);
		});
	});

	function iniciaPrimerAcces(desde: number) {
		primerDesDe = desde;
		primerAbans = ascensionsLocals;
		primerFet = null;
		enviat = null;
		oblidaEnllacEnviat();
	}

	// Compte enrere per reenviar (un tic per segon, només mentre cal).
	$effect(() => {
		if (!enviat || espera === 0) return;
		const id = setInterval(() => (ara = Date.now()), 1000);
		return () => clearInterval(id);
	});

	// Si les ascensions locals encara no s'havien carregat en entrar, es prenen en arribar.
	$effect(() => {
		if (primerDesDe !== null && primerAbans === null && ascensionsLocals !== null) {
			primerAbans = ascensionsLocals;
		}
	});

	const primer = $derived(
		sessioActual.estat === 'autenticat' && primerDesDe !== null && primerFet === null
			? estatPrimerAcces(primerDesDe, $estatSync)
			: null
	);

	$effect(() => {
		if (primer !== 'fet' || primerAbans === null || ascensionsLocals === null) return;
		const missatge = missatgePrimerAcces(primerAbans, ascensionsLocals);
		primerFet = missatge;
		toasts.show(textPrimerFet(missatge), { tone: 'success', duration: 8000 });
	});

	function textPrimerFet(msg: MissatgePrimerAcces): string {
		if (msg.tipus === 'buit') return m.cloud_first_done_empty();
		if (msg.tipus === 'recuperades') return m.cloud_first_downloaded({ count: String(msg.n) });
		if (msg.n === 1) return m.cloud_first_done_one();
		return m.cloud_first_done({ count: String(msg.n) });
	}

	function textErrorCompte(error: unknown): string {
		switch (codiError(error)) {
			case 'email:invalid':
				return m.cloud_email_invalid();
			case 'limit':
				return m.cloud_error_limit();
			case 'xarxa':
				return m.cloud_error_network();
			case 'no-configurat':
				return m.cloud_unavailable();
			case 'codi:invalid':
				return m.cloud_code_invalid();
			default:
				return m.cloud_send_error();
		}
	}

	async function envia(adreca: string): Promise<boolean> {
		if (!network.online) {
			errorEmail = m.cloud_send_offline();
			return false;
		}
		enviant = true;
		errorEmail = null;
		errorEnllac = null;
		try {
			const redirectTo = new URL(href('/app/compte'), location.origin).href;
			await api.entrarAmbEmail(adreca, { redirectTo });
			const t = Date.now();
			desaEnllacEnviat(adreca, t);
			enviat = { email: adreca, t };
			ara = t;
			codi = '';
			errorCodi = null;
			return true;
		} catch (e) {
			errorEmail = textErrorCompte(e);
			return false;
		} finally {
			enviant = false;
		}
	}

	async function enviaFormulari(event: SubmitEvent) {
		event.preventDefault();
		const adreca = email.trim();
		if (!emailValid(adreca)) {
			errorEmail = m.cloud_email_invalid();
			campEmail?.focus();
			return;
		}
		if (await envia(adreca)) {
			await tick();
			avisEnviat?.focus();
		} else {
			campEmail?.focus();
		}
	}

	async function reenvia() {
		if (!enviat || espera > 0) return;
		if (await envia(enviat.email)) {
			toasts.show(m.cloud_resent(), { tone: 'success' });
		} else {
			toasts.show(errorEmail ?? m.cloud_send_error(), { tone: 'error', duration: 8000 });
		}
	}

	async function verificaCodi(event: SubmitEvent) {
		event.preventDefault();
		if (!enviat) return;
		const net = codi.replace(/\s+/g, '');
		if (!/^\d{6,10}$/.test(net)) {
			errorCodi = m.cloud_code_invalid();
			return;
		}
		verificant = true;
		errorCodi = null;
		const desde = Date.now();
		try {
			await api.verificarCodi(enviat.email, net);
			iniciaPrimerAcces(desde);
			await tick();
			avisPrimer?.focus();
		} catch (e) {
			errorCodi = textErrorCompte(e);
		} finally {
			verificant = false;
		}
	}

	async function canviaCorreu() {
		enviat = null;
		errorEmail = null;
		oblidaEnllacEnviat();
		await tick();
		campEmail?.focus();
		campEmail?.select();
	}

	// ── Autenticat ──
	let sincronitzant = $state(false);
	let sortint = $state(false);
	let resolent = $state(false);
	const syncEnCurs = $derived(sincronitzant || !!$estatSync.sincronitzant);

	async function sincronitza() {
		sincronitzant = true;
		try {
			// No llança: els errors queden a `estatSync.error`.
			await api.sincronitzarAra();
			if ($estatSync.error) toasts.show(m.cloud_sync_error(), { tone: 'error', duration: 8000 });
			else toasts.show(m.cloud_sync_done(), { tone: 'success' });
		} catch {
			toasts.show(m.cloud_sync_error(), { tone: 'error', duration: 8000 });
		} finally {
			sincronitzant = false;
		}
	}

	async function resolConflicte(accio: 'fusionar' | 'descartar-locals') {
		resolent = true;
		try {
			toasts.show(m.cloud_conflict_done(), { tone: 'info' });
			await api.resoldreConflicteCompte(accio);
			await enfocaTitol();
		} catch {
			toasts.show(m.register_error_generic(), { tone: 'error' });
		} finally {
			resolent = false;
		}
	}

	async function tancaSessio() {
		sortint = true;
		try {
			await api.sortir();
			primerDesDe = null;
			primerFet = null;
			toasts.show(m.cloud_signed_out(), { tone: 'info', duration: 8000 });
			await enfocaTitol();
		} catch {
			toasts.show(m.cloud_sign_out_error(), { tone: 'error' });
		} finally {
			sortint = false;
		}
	}

	async function enfocaTitol() {
		await tick();
		requestAnimationFrame(() => titol?.focus());
	}

	// ── Esborrar el compte ──
	let confirmar = $state(false);
	let textConfirmacio = $state('');
	let conservarDispositiu = $state(true);
	let esborrant = $state(false);
	let exportant = $state(false);
	const confirmacioOk = $derived(
		confirmacioValida(textConfirmacio, usuariEmail, m.cloud_delete_word())
	);

	function obreEsborrat() {
		textConfirmacio = '';
		conservarDispositiu = true;
		confirmar = true;
	}

	async function exportaCompte() {
		exportant = true;
		try {
			descarregarText(`carnetdecims-compte-${avuiLocal()}.json`, await api.exportarDadesCompte());
			toasts.show(m.account_export_done(), { tone: 'success' });
		} catch (e) {
			toasts.show(codiError(e) === 'xarxa' ? m.cloud_error_network() : m.register_error_generic(), {
				tone: 'error'
			});
		} finally {
			exportant = false;
		}
	}

	async function esborraConfirmat(event: SubmitEvent) {
		event.preventDefault();
		if (!confirmacioOk || esborrant) return;
		esborrant = true;
		try {
			await api.esborrarCompte({ conservarDispositiu });
			confirmar = false;
			primerDesDe = null;
			primerFet = null;
			toasts.show(m.cloud_deleted(), { tone: 'success', duration: 8000 });
			// El botó que ha obert el full ja no hi és (la secció passa a anònim).
			await enfocaTitol();
		} catch (e) {
			toasts.show(codiError(e) === 'xarxa' ? m.cloud_error_network() : m.cloud_delete_error(), {
				tone: 'error',
				duration: 8000
			});
		} finally {
			esborrant = false;
		}
	}
</script>

<Card as="section" padding="md" aria-labelledby={ids.titol} id="compte">
	<h2 id={ids.titol} class="x-wide" tabindex="-1" bind:this={titol}>{m.cloud_title()}</h2>

	{#if !disponible}
		<p>{m.cloud_unavailable()}</p>
	{:else if sessioActual.estat === 'carregant'}
		<p class="carregant mono" role="status">{m.cloud_loading()}</p>
	{:else if sessioActual.estat === 'anonim'}
		<p class="intro">{m.cloud_intro()}</p>

		{#if errorEnllac}
			<p class="primer error" role="alert">{errorEnllac}</p>
		{/if}

		{#if enviat}
			<div class="enviat" tabindex="-1" bind:this={avisEnviat}>
				<p class="enviat-t">
					<span class="ico"><Icon name="mail" /></span>
					<span>{m.cloud_sent({ email: enviat.email })}</span>
				</p>
				<p class="hint">{m.cloud_sent_hint()}</p>
			</div>

			<form class="form codi" onsubmit={verificaCodi} novalidate>
				<label class="label" for={ids.codi}>{m.cloud_code_label()}</label>
				<p id={ids.codiHint} class="hint nomarge">{m.cloud_code_hint()}</p>
				<div class="fila">
					<input
						id={ids.codi}
						class="field mono codi-camp"
						type="text"
						name="codi"
						inputmode="numeric"
						autocomplete="one-time-code"
						maxlength="12"
						bind:value={codi}
						aria-invalid={errorCodi ? 'true' : undefined}
						aria-describedby={errorCodi ? `${ids.codiHint} ${ids.codiErr}` : ids.codiHint}
						disabled={verificant}
					/>
					<Button type="submit" variant="ink" disabled={verificant}>
						{verificant ? m.cloud_entering() : m.cloud_code_submit()}
					</Button>
				</div>
				{#if errorCodi}
					<p id={ids.codiErr} class="err" role="alert">{errorCodi}</p>
				{/if}
			</form>

			<div class="actions">
				{#if espera > 0}
					<p class="hint mono espera">{m.cloud_resend_wait({ seconds: String(espera) })}</p>
				{:else}
					<Button variant="outline" onclick={reenvia} disabled={enviant}>
						{enviant ? m.cloud_sending() : m.cloud_resend()}
					</Button>
				{/if}
				<Button variant="ghost" onclick={canviaCorreu}>{m.cloud_change_email()}</Button>
			</div>
		{:else}
			<p class="hint">{m.cloud_intro_how()}</p>
			<form class="form" onsubmit={enviaFormulari} novalidate>
				<label class="label" for={ids.email}>{m.cloud_email_label()}</label>
				<div class="fila">
					<input
						bind:this={campEmail}
						id={ids.email}
						class="field"
						type="email"
						name="email"
						autocomplete="email"
						inputmode="email"
						autocapitalize="none"
						spellcheck="false"
						required
						bind:value={email}
						aria-invalid={errorEmail ? 'true' : undefined}
						aria-describedby={errorEmail ? ids.emailErr : undefined}
						disabled={enviant}
					/>
					<Button type="submit" variant="stamp" icon="arrow" disabled={enviant}>
						{enviant ? m.cloud_sending() : m.cloud_send()}
					</Button>
				</div>
				{#if errorEmail}
					<p id={ids.emailErr} class="err" role="alert">{errorEmail}</p>
				{/if}
			</form>
			<noscript><p class="err">{m.cloud_noscript()}</p></noscript>
		{/if}
	{:else}
		<p class="qui">
			<span class="label">{m.cloud_signed_in_as()}</span>
			<strong class="email">{usuariEmail}</strong>
		</p>

		{#if primerFet}
			<p class="primer ok" role="status" tabindex="-1" bind:this={avisPrimer}>
				{textPrimerFet(primerFet)}
			</p>
		{:else if primer === 'desant'}
			<p class="primer mono" role="status" tabindex="-1" bind:this={avisPrimer}>
				{m.cloud_first_saving()}
			</p>
		{:else if primer === 'error'}
			<p class="primer error" role="status" tabindex="-1" bind:this={avisPrimer}>
				{m.cloud_first_error()}
			</p>
		{/if}

		<div class={['estat', estat.tipus]}>
			<EstatNuvolText {estat} {locale} />
			{#if estat.tipus === 'error'}
				<p class="hint">
					{$estatSync.error === 'sessio' ? m.cloud_sync_error_session() : m.cloud_sync_error()}
				</p>
			{:else if estat.tipus === 'conflicte'}
				<p class="hint">{m.cloud_conflict_text()}</p>
				<div class="actions">
					<Button variant="ink" onclick={() => resolConflicte('fusionar')} disabled={resolent}>
						{m.cloud_conflict_merge()}
					</Button>
					<Button
						variant="outline"
						onclick={() => resolConflicte('descartar-locals')}
						disabled={resolent}
					>
						{m.cloud_conflict_discard()}
					</Button>
				</div>
				<p class="hint">{m.cloud_conflict_discard_hint()}</p>
			{/if}
		</div>

		<div class="actions">
			<Button
				variant="ink"
				icon="refresh"
				onclick={sincronitza}
				disabled={syncEnCurs || !network.online || estat.tipus === 'conflicte'}
			>
				{#if syncEnCurs}
					{m.cloud_syncing()}
				{:else if estat.tipus === 'error'}
					{m.cloud_sync_retry()}
				{:else}
					{m.cloud_sync_now()}
				{/if}
			</Button>
			<Button variant="outline" onclick={tancaSessio} disabled={sortint}>
				{m.cloud_sign_out()}
			</Button>
		</div>

		<div class="danger">
			<Button variant="outline" class="btn-danger" onclick={obreEsborrat}>
				{m.cloud_delete()}
			</Button>
		</div>
	{/if}

	{#if disponible && sessioActual.estat === 'anonim'}
		<!-- Informació abans de recollir el correu (RGPD art. 13). -->
		<p class="privacy">
			<a href={href('/privacitat')}>{m.account_privacy_link()}</a>
		</p>
	{/if}
</Card>

<!-- Confirmació forta: cal escriure el correu o la paraula clau. -->
<BottomSheet open={confirmar} title={m.cloud_delete_title()} onclose={() => (confirmar = false)}>
	<p class="confirm-text">{m.cloud_delete_text()}</p>
	<div class="export">
		<p>{m.cloud_delete_export_text()}</p>
		<Button variant="outline" icon="install" onclick={exportaCompte} disabled={exportant}>
			{m.cloud_delete_export()}
		</Button>
	</div>
	<form class="form confirm" onsubmit={esborraConfirmat}>
		<label class="check">
			<input type="checkbox" bind:checked={conservarDispositiu} />
			<span>{m.cloud_delete_keep_local()}</span>
		</label>
		{#if !conservarDispositiu}
			<p class="hint nomarge avis-local">{m.cloud_delete_keep_local_hint()}</p>
		{/if}
		<label class="label" for={ids.confirma}>
			{m.cloud_delete_confirm_label({ word: m.cloud_delete_word() })}
		</label>
		<input
			id={ids.confirma}
			class="field"
			type="text"
			autocomplete="off"
			autocapitalize="none"
			spellcheck="false"
			bind:value={textConfirmacio}
		/>
		<div class="confirm-actions">
			<Button type="submit" variant="stamp" disabled={!confirmacioOk || esborrant}>
				{esborrant ? m.cloud_deleting() : m.cloud_delete_confirm_button()}
			</Button>
			<Button variant="outline" onclick={() => (confirmar = false)}>
				{m.account_delete_cancel()}
			</Button>
		</div>
	</form>
</BottomSheet>

<style>
	h2 {
		margin-bottom: var(--sp-2);
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
	}

	h2:focus {
		outline: none;
	}

	h2:focus-visible {
		outline: 2px solid var(--c-focus);
		outline-offset: 4px;
	}

	p {
		color: var(--c-ink-2);
	}

	.intro {
		color: var(--c-ink);
		font-size: var(--fs-md);
		font-weight: var(--fw-semibold);
		line-height: 1.35;
	}

	.hint {
		margin-top: var(--sp-2);
		font-size: var(--fs-sm);
	}

	.carregant {
		font-size: var(--fs-sm);
	}

	.form {
		display: grid;
		gap: var(--sp-2);
		margin-top: var(--sp-4);
	}

	.label {
		font-family: var(--font-mono);
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--c-ink-2);
	}

	.fila {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-3);
	}

	.fila .field {
		flex: 1 1 14rem;
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

	.field[aria-invalid='true'] {
		border-color: var(--c-stamp-ink);
		border-width: 2px;
	}

	.fila :global(.btn) {
		flex: 1 0 auto;
	}

	@media (min-width: 30rem) {
		.fila :global(.btn) {
			flex-grow: 0;
		}
	}

	.err {
		color: var(--c-stamp-ink);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}

	.enviat {
		margin-top: var(--sp-4);
		padding: var(--sp-3) var(--sp-4);
		border: 1.5px solid var(--c-pine);
		border-radius: var(--r-md);
		background: color-mix(in srgb, var(--c-pine) 10%, var(--c-card));
	}

	.enviat:focus {
		outline: none;
	}

	.enviat:focus-visible {
		outline: 2px solid var(--c-focus);
		outline-offset: 3px;
	}

	.enviat-t {
		display: flex;
		gap: var(--sp-2);
		align-items: flex-start;
		color: var(--c-ink);
		font-weight: var(--fw-semibold);
		overflow-wrap: anywhere;
	}

	.ico {
		flex: none;
		color: var(--c-pine);
	}

	.espera {
		margin: 0;
		font-size: var(--fs-xs);
	}

	.qui {
		display: grid;
		gap: 2px;
		margin-top: var(--sp-1);
	}

	.email {
		color: var(--c-ink);
		font-size: var(--fs-md);
		overflow-wrap: anywhere;
	}

	.primer {
		margin-top: var(--sp-3);
		padding: var(--sp-2) var(--sp-3);
		border: 1.5px solid var(--c-rule);
		border-radius: var(--r-sm);
		color: var(--c-ink);
		font-size: var(--fs-sm);
	}

	.primer.ok {
		border-color: var(--c-pine);
		background: color-mix(in srgb, var(--c-pine) 10%, var(--c-card));
		font-weight: var(--fw-semibold);
	}

	.primer.error {
		border-color: var(--c-stamp-ink);
		background: var(--c-stamp-soft);
	}

	.estat {
		margin-top: var(--sp-3);
		padding-top: var(--sp-3);
		border-top: 1px dashed var(--c-rule);
	}

	.estat.error,
	.estat.conflicte {
		padding: var(--sp-3);
		border: 1.5px solid var(--c-stamp-ink);
		border-radius: var(--r-sm);
		background: var(--c-stamp-soft);
	}

	.estat.error .hint,
	.estat.conflicte .hint {
		color: var(--c-ink);
	}

	.actions,
	.danger {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--sp-3);
		margin-top: var(--sp-4);
	}

	.danger {
		padding-top: var(--sp-4);
		border-top: 1px dashed var(--c-rule);
	}

	.danger :global(.btn-danger) {
		color: var(--c-stamp-ink);
		border-color: var(--c-stamp-ink);
	}

	.privacy {
		margin-top: var(--sp-4);
		font-size: var(--fs-sm);
	}

	.privacy a {
		color: var(--c-ink);
		text-underline-offset: 3px;
	}

	.confirm-text {
		color: var(--c-ink);
	}

	.export {
		display: grid;
		justify-items: start;
		gap: var(--sp-2);
		margin-top: var(--sp-4);
		padding: var(--sp-3);
		border: 1px dashed var(--c-rule);
		border-radius: var(--r-md);
	}

	.confirm {
		margin-top: var(--sp-5);
	}

	.confirm .label {
		text-transform: none;
		letter-spacing: 0;
		font-size: var(--fs-sm);
		color: var(--c-ink);
	}

	.nomarge {
		margin-top: 0;
	}

	.codi {
		margin-top: var(--sp-5);
	}

	.fila .codi-camp {
		flex: 0 1 12rem;
		font-size: var(--fs-md);
		font-weight: var(--fw-semibold);
		letter-spacing: 0.2em;
	}

	.check {
		display: flex;
		align-items: flex-start;
		gap: var(--sp-3);
		min-height: var(--tap);
		padding-block: var(--sp-2);
		color: var(--c-ink);
		font-size: var(--fs-sm);
		cursor: pointer;
	}

	.check input {
		flex: none;
		width: 1.25rem;
		height: 1.25rem;
		margin: 0;
		accent-color: var(--c-ink);
	}

	.avis-local {
		color: var(--c-stamp-ink);
		font-weight: var(--fw-semibold);
	}

	.confirm-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-3);
		margin-top: var(--sp-3);
	}
</style>
