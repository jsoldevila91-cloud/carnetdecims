<script lang="ts">
	import { tick } from 'svelte';
	import { CONTRASENYA_MIN, validarContrasenya } from '$lib/domain/contrasenya';
	import { network } from '$lib/platform/network.svelte';
	import { m } from '$lib/paraglide/messages';
	import Button from '../Button.svelte';
	import type { ApiCompte } from './api';
	import CampContrasenya from './CampContrasenya.svelte';
	import { errorContrasenya, textMotiuContrasenya } from './errors-contrasenya';

	/**
	 * Formulari "contrasenya nova" de la sessió actual (mode recuperació i secció del perfil).
	 * Sense camp de confirmació: el botó per mostrar-la permet revisar-la, i si s'equivoca pot
	 * restablir-la amb el correu (recomanació NIST SP 800-63B i GOV.UK).
	 */
	let {
		api,
		email,
		onfet,
		oncancel,
		textCancel = m.cloud_password_cancel()
	}: {
		api: ApiCompte;
		/** Correu del compte: camp `username` ocult per als gestors i validació "no el correu". */
		email: string;
		onfet: () => void;
		oncancel?: () => void;
		textCancel?: string;
	} = $props();

	const uid = $props.id();
	const ids = { camp: `compte-pwd-nova-${uid}`, err: `compte-pwd-nova-gen-${uid}` };

	let nova = $state('');
	let camp: HTMLInputElement | undefined = $state();
	let desant = $state(false);
	let errorCamp = $state<string | null>(null);
	let errorGen = $state<string | null>(null);

	async function desa(event: SubmitEvent) {
		event.preventDefault();
		if (desant) return;
		errorCamp = null;
		errorGen = null;
		const v = validarContrasenya(nova, email);
		if (!v.ok) {
			errorCamp = textMotiuContrasenya(v.motiu);
			camp?.focus();
			return;
		}
		if (!network.online) {
			errorGen = m.cloud_error_network();
			return;
		}
		desant = true;
		try {
			await api.canviarContrasenya(nova);
			nova = '';
			onfet();
		} catch (e) {
			const err = errorContrasenya(e);
			// El camp està desactivat mentre es desa: cal reactivar-lo abans de moure-hi el focus.
			desant = false;
			await tick();
			if (err.camp === 'contrasenya') {
				errorCamp = err.text;
				camp?.focus();
			} else errorGen = err.text;
		} finally {
			desant = false;
		}
	}
</script>

<form class="form" onsubmit={desa} novalidate>
	<!-- Perquè el gestor de contrasenyes sàpiga de quin compte és la contrasenya nova. -->
	<input type="email" name="username" autocomplete="username" value={email} readonly hidden />
	<CampContrasenya
		id={ids.camp}
		name="new-password"
		label={m.cloud_password_new_label()}
		autocomplete="new-password"
		hint={m.cloud_password_hint({ min: String(CONTRASENYA_MIN) })}
		bind:value={nova}
		bind:input={camp}
		error={errorCamp}
		descritPer={errorGen ? [ids.err] : []}
		disabled={desant}
	/>
	{#if errorGen}
		<p id={ids.err} class="err" role="alert">{errorGen}</p>
	{/if}
	<div class="accions">
		<Button type="submit" variant="ink" disabled={desant}>
			{desant ? m.cloud_password_saving() : m.cloud_password_save()}
		</Button>
		{#if oncancel}
			<Button variant="ghost" onclick={oncancel} disabled={desant}>{textCancel}</Button>
		{/if}
	</div>
</form>

<style>
	.form {
		display: grid;
		gap: var(--sp-3);
		margin-top: var(--sp-3);
	}

	.err {
		margin: 0;
		color: var(--c-stamp-ink);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}

	.accions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--sp-3);
	}
</style>
