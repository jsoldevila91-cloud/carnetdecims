<script lang="ts">
	import { tick } from 'svelte';
	import { CONTRASENYA_MIN, validarContrasenya } from '$lib/domain/contrasenya';
	import { network } from '$lib/platform/network.svelte';
	import { m } from '$lib/paraglide/messages';
	import Button from '../Button.svelte';
	import type { ApiCompte } from './api';
	import CampContrasenya from './CampContrasenya.svelte';
	import { errorContrasenya, textMotiuContrasenya, type CampError } from './errors-contrasenya';
	import { emailValid } from './nuvol';

	/**
	 * Entrar o crear un compte amb correu + contrasenya (pestanyes "Entra" / "Crea un compte") i
	 * "He oblidat la contrasenya". Quan cal confirmar el correu, ho passa a `onconfirmar` (el pare
	 * mostra l'estat "t'hem enviat un correu" amb el camp del codi).
	 */
	let {
		api,
		urlTornada,
		onentrat,
		onconfirmar,
		disabled = false
	}: {
		api: ApiCompte;
		urlTornada: () => string;
		/** S'ha entrat (sessió iniciada) a l'instant `desde`. */
		onentrat: (desde: number) => void;
		/** Cal confirmar el correu (registre nou o compte sense confirmar): s'ha enviat el correu. */
		onconfirmar: (email: string) => void;
		disabled?: boolean;
	} = $props();

	type Mode = 'entrar' | 'crear' | 'oblit';

	const ids = {
		tabEntrar: 'compte-pwd-tab-entrar',
		tabCrear: 'compte-pwd-tab-crear',
		panell: 'compte-pwd-panell',
		email: 'compte-pwd-email',
		emailErr: 'compte-pwd-email-err',
		contrasenya: 'compte-pwd',
		gen: 'compte-pwd-gen',
		oblitTitol: 'compte-pwd-oblit-titol',
		oblitEmail: 'compte-pwd-oblit-email',
		oblitErr: 'compte-pwd-oblit-err'
	};

	let mode = $state<Mode>('entrar');
	let email = $state('');
	let contrasenya = $state('');
	let enviant = $state(false);
	let errorEmail = $state<string | null>(null);
	let errorPwd = $state<string | null>(null);
	let errorGen = $state<{ text: string; camp: CampError; codi: string | null } | null>(null);
	let oblitEnviat = $state(false);

	let campEmail: HTMLInputElement | undefined = $state();
	let campPwd: HTMLInputElement | undefined = $state();
	let campOblit: HTMLInputElement | undefined = $state();
	let titolOblit: HTMLHeadingElement | undefined = $state();
	let botoOblit: HTMLButtonElement | undefined = $state();
	const tabs: Record<'entrar' | 'crear', HTMLButtonElement | undefined> = $state({
		entrar: undefined,
		crear: undefined
	});

	const ocupat = $derived(enviant || disabled);
	const credencials = $derived(errorGen?.camp === 'tots');

	function netejaErrors() {
		errorEmail = null;
		errorPwd = null;
		errorGen = null;
	}

	function triaTab(nou: 'entrar' | 'crear', enfoca = false) {
		if (mode !== nou) netejaErrors();
		mode = nou;
		if (enfoca) tabs[nou]?.focus();
	}

	function tecladoTabs(event: KeyboardEvent) {
		const actual = mode === 'crear' ? 'crear' : 'entrar';
		let nou: 'entrar' | 'crear' | null = null;
		if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
			nou = actual === 'entrar' ? 'crear' : 'entrar';
		} else if (event.key === 'Home') nou = 'entrar';
		else if (event.key === 'End') nou = 'crear';
		if (!nou) return;
		event.preventDefault();
		triaTab(nou, true);
	}

	/** Mostra l'error al camp que toca i hi porta el focus. */
	function mostraError(err: { text: string; camp: CampError; codi: string | null }) {
		if (err.camp === 'email') {
			errorEmail = err.text;
			campEmail?.focus();
		} else if (err.camp === 'contrasenya') {
			errorPwd = err.text;
			campPwd?.focus();
		} else {
			errorGen = err;
			if (err.camp === 'tots') campPwd?.focus();
		}
	}

	async function envia(event: SubmitEvent) {
		event.preventDefault();
		if (ocupat) return;
		netejaErrors();
		const adreca = email.trim();
		if (!emailValid(adreca)) {
			mostraError({ text: m.cloud_email_invalid(), camp: 'email', codi: 'email:invalid' });
			return;
		}
		if (mode === 'crear') {
			const v = validarContrasenya(contrasenya, adreca);
			if (!v.ok) {
				mostraError({ text: textMotiuContrasenya(v.motiu), camp: 'contrasenya', codi: null });
				return;
			}
		} else if (contrasenya.length === 0) {
			mostraError({ text: textMotiuContrasenya('buida'), camp: 'contrasenya', codi: null });
			return;
		}
		if (!network.online) {
			errorGen = { text: m.cloud_password_offline(), camp: 'formulari', codi: 'xarxa' };
			return;
		}
		enviant = true;
		const desde = Date.now();
		try {
			if (mode === 'crear') {
				const r = await api.crearCompteAmbContrasenya(adreca, contrasenya, {
					redirectTo: urlTornada()
				});
				contrasenya = '';
				if (r === 'entrat') onentrat(desde);
				else onconfirmar(adreca);
			} else {
				await api.entrarAmbContrasenya(adreca, contrasenya);
				contrasenya = '';
				onentrat(desde);
			}
		} catch (e) {
			// Els camps estan desactivats mentre s'envia: cal reactivar-los abans de moure-hi el focus.
			enviant = false;
			await tick();
			mostraError(errorContrasenya(e));
		} finally {
			enviant = false;
		}
	}

	async function reenviaConfirmacio() {
		if (ocupat) return;
		const adreca = email.trim();
		enviant = true;
		try {
			await api.reenviarConfirmacio(adreca, { redirectTo: urlTornada() });
			errorGen = null;
			onconfirmar(adreca);
		} catch (e) {
			enviant = false;
			await tick();
			mostraError(errorContrasenya(e));
		} finally {
			enviant = false;
		}
	}

	async function obreOblit() {
		netejaErrors();
		oblitEnviat = false;
		mode = 'oblit';
		await tick();
		titolOblit?.focus();
	}

	async function tancaOblit() {
		netejaErrors();
		mode = 'entrar';
		await tick();
		botoOblit?.focus();
	}

	async function enviaOblit(event: SubmitEvent) {
		event.preventDefault();
		if (ocupat) return;
		netejaErrors();
		oblitEnviat = false;
		const adreca = email.trim();
		if (!emailValid(adreca)) {
			errorEmail = m.cloud_email_invalid();
			campOblit?.focus();
			return;
		}
		if (!network.online) {
			errorEmail = m.cloud_send_offline();
			return;
		}
		enviant = true;
		try {
			await api.demanarRestabliment(adreca, { redirectTo: urlTornada() });
			oblitEnviat = true;
		} catch (e) {
			const err = errorContrasenya(e);
			errorEmail = err.text;
			enviant = false;
			await tick();
			campOblit?.focus();
		} finally {
			enviant = false;
		}
	}
</script>

{#if mode === 'oblit'}
	<section class="bloc" aria-labelledby={ids.oblitTitol}>
		<h3 id={ids.oblitTitol} tabindex="-1" bind:this={titolOblit}>
			{m.cloud_password_reset_title()}
		</h3>
		<p class="hint">{m.cloud_password_reset_text()}</p>
		<form class="form" onsubmit={enviaOblit} novalidate>
			<label class="label" for={ids.oblitEmail}>{m.cloud_email_label()}</label>
			<input
				bind:this={campOblit}
				id={ids.oblitEmail}
				class="field"
				type="email"
				name="email"
				autocomplete="email"
				inputmode="email"
				autocapitalize="none"
				spellcheck="false"
				bind:value={email}
				aria-invalid={errorEmail ? 'true' : undefined}
				aria-describedby={errorEmail ? ids.oblitErr : undefined}
				disabled={ocupat}
			/>
			{#if errorEmail}
				<p id={ids.oblitErr} class="err" role="alert">{errorEmail}</p>
			{/if}
			<div class="accions">
				<Button type="submit" variant="ink" disabled={ocupat}>
					{enviant ? m.cloud_password_reset_sending() : m.cloud_password_reset_submit()}
				</Button>
				<Button variant="ghost" onclick={tancaOblit}>{m.cloud_password_reset_back()}</Button>
			</div>
		</form>
		<!-- Neutre: no es revela si el correu té compte. -->
		<div role="status" class="estat-oblit">
			{#if oblitEnviat}
				<p class="ok">{m.cloud_password_reset_sent()}</p>
			{/if}
		</div>
	</section>
{:else}
	<div class="bloc">
		<div class="tabs" role="tablist" aria-label={m.cloud_password_modes_label()}>
			<button
				bind:this={tabs.entrar}
				id={ids.tabEntrar}
				type="button"
				role="tab"
				class="tab"
				aria-selected={mode === 'entrar'}
				aria-controls={ids.panell}
				tabindex={mode === 'entrar' ? 0 : -1}
				onclick={() => triaTab('entrar')}
				onkeydown={tecladoTabs}
			>
				{m.cloud_password_tab_sign_in()}
			</button>
			<button
				bind:this={tabs.crear}
				id={ids.tabCrear}
				type="button"
				role="tab"
				class="tab"
				aria-selected={mode === 'crear'}
				aria-controls={ids.panell}
				tabindex={mode === 'crear' ? 0 : -1}
				onclick={() => triaTab('crear')}
				onkeydown={tecladoTabs}
			>
				{m.cloud_password_tab_sign_up()}
			</button>
		</div>

		<div
			id={ids.panell}
			role="tabpanel"
			aria-labelledby={mode === 'crear' ? ids.tabCrear : ids.tabEntrar}
		>
			<form class="form" onsubmit={envia} novalidate>
				<label class="label" for={ids.email}>{m.cloud_email_label()}</label>
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
					aria-invalid={errorEmail || credencials ? 'true' : undefined}
					aria-describedby={[errorEmail ? ids.emailErr : null, credencials ? ids.gen : null]
						.filter(Boolean)
						.join(' ') || undefined}
					disabled={ocupat}
				/>
				{#if errorEmail}
					<p id={ids.emailErr} class="err" role="alert">{errorEmail}</p>
				{/if}

				<div class="camp-pwd">
					{#key mode}
						<CampContrasenya
							id={ids.contrasenya}
							name={mode === 'crear' ? 'new-password' : 'password'}
							label={m.cloud_password_label()}
							autocomplete={mode === 'crear' ? 'new-password' : 'current-password'}
							hint={mode === 'crear'
								? m.cloud_password_hint({ min: String(CONTRASENYA_MIN) })
								: undefined}
							bind:value={contrasenya}
							bind:input={campPwd}
							error={errorPwd}
							invalid={credencials}
							descritPer={errorGen ? [ids.gen] : []}
							disabled={ocupat}
						/>
					{/key}
				</div>

				{#if errorGen}
					<div id={ids.gen} class="gen" role="alert">
						<p class="err">{errorGen.text}</p>
					</div>
					{#if errorGen.codi === 'correu-no-confirmat'}
						<div class="accions">
							<Button variant="outline" icon="mail" onclick={reenviaConfirmacio} disabled={ocupat}>
								{m.cloud_password_confirm_resend()}
							</Button>
						</div>
					{/if}
				{/if}

				<div class="accions">
					<Button type="submit" variant="stamp" icon="arrow" disabled={ocupat}>
						{#if mode === 'crear'}
							{enviant ? m.cloud_password_creating() : m.cloud_password_sign_up_submit()}
						{:else}
							{enviant ? m.cloud_entering() : m.cloud_password_sign_in_submit()}
						{/if}
					</Button>
					{#if mode === 'entrar'}
						<button type="button" class="enllac" bind:this={botoOblit} onclick={obreOblit}>
							{m.cloud_password_forgot()}
						</button>
					{/if}
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.bloc {
		margin-top: var(--sp-3);
	}

	h3 {
		font-size: var(--fs-base);
	}

	h3:focus {
		outline: none;
	}

	h3:focus-visible {
		outline: 2px solid var(--c-focus);
		outline-offset: 4px;
	}

	.hint {
		margin-top: var(--sp-2);
		color: var(--c-ink-2);
		font-size: var(--fs-sm);
	}

	.tabs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		max-width: 28rem;
		padding: 3px;
		border: var(--bw) solid var(--c-line);
		border-radius: var(--r-md);
		background: var(--c-paper);
	}

	.tab {
		min-height: var(--tap);
		padding: 0 var(--sp-3);
		border: 0;
		border-radius: calc(var(--r-md) - 3px);
		background: transparent;
		color: var(--c-ink-2);
		font-family: var(--font-wide);
		font-stretch: var(--stretch-semi);
		font-weight: var(--fw-heavy);
		font-size: var(--fs-sm);
		letter-spacing: var(--ls-caps);
		text-transform: uppercase;
		cursor: pointer;
	}

	.tab[aria-selected='true'] {
		background: var(--c-ink);
		color: var(--c-paper);
	}

	.tab:focus-visible {
		outline: 2px solid var(--c-focus);
		outline-offset: 2px;
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

	.field {
		width: 100%;
		max-width: 28rem;
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

	.camp-pwd {
		margin-top: var(--sp-2);
	}

	.err {
		margin: 0;
		color: var(--c-stamp-ink);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}

	.gen {
		padding: var(--sp-2) var(--sp-3);
		border: 1.5px solid var(--c-stamp-ink);
		border-radius: var(--r-sm);
		background: var(--c-stamp-soft);
	}

	.gen .err {
		color: var(--c-ink);
	}

	.accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--sp-3);
		margin-top: var(--sp-2);
	}

	.enllac {
		min-height: var(--tap);
		padding: 0 var(--sp-2);
		border: 0;
		background: none;
		color: var(--c-ink);
		font: inherit;
		font-size: var(--fs-sm);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}

	.enllac:focus-visible {
		outline: 2px solid var(--c-focus);
		outline-offset: 2px;
	}

	.estat-oblit .ok {
		margin-top: var(--sp-3);
		padding: var(--sp-2) var(--sp-3);
		border: 1.5px solid var(--c-pine);
		border-radius: var(--r-md);
		background: color-mix(in srgb, var(--c-pine) 10%, var(--c-card));
		color: var(--c-ink);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}
</style>
