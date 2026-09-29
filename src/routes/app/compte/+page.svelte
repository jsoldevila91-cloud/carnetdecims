<script lang="ts">
	import {
		ErrorImportacio,
		ascensionsVivesAmbEstat,
		esborrarTot,
		exportarDades,
		importarDades
	} from '$lib/data/ascensions';
	import { avuiLocal } from '$lib/domain';
	import { BottomSheet, Button, Card, LanguageSwitcher, PageMeta, toasts } from '$lib/ui';
	import { descarregarText } from '$lib/platform/fitxers';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	const vives = ascensionsVivesAmbEstat();
	const total = $derived($vives.ascensions.length);

	let fitxer: HTMLInputElement | undefined = $state();
	let ocupat = $state(false);
	let confirmar = $state(false);

	async function exportar() {
		ocupat = true;
		try {
			descarregarText(`carnetdecims-${avuiLocal()}.json`, await exportarDades());
			toasts.show(m.account_export_done(), { tone: 'success' });
		} catch {
			toasts.show(m.register_error_generic(), { tone: 'error' });
		} finally {
			ocupat = false;
		}
	}

	async function importar(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const f = input.files?.[0];
		input.value = '';
		if (!f) return;
		ocupat = true;
		try {
			const r = await importarDades(await f.text(), 'fusionar');
			toasts.show(
				m.account_import_done({
					added: String(r.afegides),
					updated: String(r.actualitzades),
					ignored: String(r.ignorades)
				}),
				{ tone: 'success', duration: 8000 }
			);
		} catch (err) {
			const codi = err instanceof ErrorImportacio ? err.codi : null;
			toasts.show(
				codi === 'importacio:versio'
					? m.account_import_error_version()
					: codi === 'importacio:massa-gran'
						? m.account_import_error_size()
						: m.account_import_error(),
				{ tone: 'error', duration: 8000 }
			);
		} finally {
			ocupat = false;
		}
	}

	async function esborrarTotConfirmat() {
		ocupat = true;
		try {
			await esborrarTot();
			confirmar = false;
			toasts.show(m.account_deleted(), { tone: 'success' });
		} catch {
			toasts.show(m.register_error_generic(), { tone: 'error' });
		} finally {
			ocupat = false;
		}
	}
</script>

<PageMeta title={m.account_meta_title()} noindex />

<h1 class="x-wide title">{m.account_title()}</h1>

<div class="stack">
	<Card as="section" padding="md" aria-labelledby="account-data">
		<h2 id="account-data" class="x-wide">{m.account_data_title()}</h2>
		<p>{m.account_data_text()}</p>
		<p class="count mono" aria-live="polite">
			{$vives.carregat ? m.account_data_count({ count: String(total) }) : m.app_loading()}
		</p>
		<div class="actions">
			<Button href={href('/app/historial')} variant="outline" icon="book">
				{m.account_history_link()}
			</Button>
			<Button variant="ink" onclick={exportar} disabled={ocupat || total === 0}>
				{m.account_export()}
			</Button>
		</div>

		<div class="import">
			<Button variant="outline" onclick={() => fitxer?.click()} disabled={ocupat}>
				{m.account_import()}
			</Button>
			<input
				bind:this={fitxer}
				class="sr-only"
				type="file"
				accept="application/json,.json"
				tabindex="-1"
				aria-hidden="true"
				onchange={importar}
			/>
			<p class="hint">{m.account_import_hint()}</p>
		</div>

		<div class="danger">
			<Button
				variant="outline"
				class="btn-danger"
				onclick={() => (confirmar = true)}
				disabled={ocupat || total === 0}
			>
				{m.account_delete_all()}
			</Button>
		</div>

		<p class="privacy">
			<a href={href('/privacitat')}>{m.account_privacy_link()}</a>
		</p>
	</Card>

	<Card as="section" padding="md" variant="flat" aria-labelledby="account-lang">
		<h2 id="account-lang" class="x-wide">{m.account_language_title()}</h2>
		<LanguageSwitcher variant="full" />
	</Card>

	<Card as="section" padding="md" variant="flat" aria-labelledby="account-theme">
		<h2 id="account-theme" class="x-wide">{m.account_theme_title()}</h2>
		<p>{m.account_theme_text()}</p>
	</Card>
</div>

<!-- Confirmació explícita: l'esborrat total no es pot desfer. -->
<BottomSheet
	open={confirmar}
	title={m.account_delete_confirm_title()}
	onclose={() => (confirmar = false)}
>
	<p class="confirm-text">{m.account_delete_confirm_text({ count: String(total) })}</p>
	<div class="confirm-actions">
		<Button variant="stamp" onclick={esborrarTotConfirmat} disabled={ocupat}>
			{m.account_delete_confirm_button()}
		</Button>
		<Button variant="outline" onclick={() => (confirmar = false)}>
			{m.account_delete_cancel()}
		</Button>
	</div>
</BottomSheet>

<style>
	.title {
		margin-bottom: var(--sp-5);
		font-size: clamp(var(--fs-xl), 6vw, var(--fs-2xl));
		font-weight: var(--fw-black);
		line-height: 1;
	}

	.stack {
		display: grid;
		gap: var(--sp-5);
		max-width: 40rem;
		padding-bottom: var(--sp-8);
	}

	h2 {
		margin-bottom: var(--sp-2);
		font-size: var(--fs-sm);
		letter-spacing: 0.02em;
	}

	p {
		color: var(--c-ink-2);
	}

	p + p {
		margin-top: var(--sp-2);
	}

	.count {
		color: var(--c-ink);
		font-weight: var(--fw-semibold);
	}

	.actions,
	.import,
	.danger {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--sp-3);
		margin-top: var(--sp-4);
	}

	.import,
	.danger {
		padding-top: var(--sp-4);
		border-top: 1px dashed var(--c-rule);
	}

	.hint {
		flex: 1 1 14rem;
		font-size: var(--fs-sm);
		margin: 0;
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

	.confirm-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-3);
		margin-top: var(--sp-5);
	}
</style>
