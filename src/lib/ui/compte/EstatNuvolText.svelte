<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Icon, { type IconName } from '../Icon.svelte';
	import { tempsRelatiu, type EstatNuvol } from './nuvol';

	/**
	 * Icona + text de l'estat del núvol (el text és el que es llegeix; la icona és decorativa).
	 * El temps relatiu ("fa 2 min") s'actualitza cada 30 s sense regió viva: no s'anuncia a cada
	 * canvi de minut.
	 */
	let {
		estat,
		locale,
		/** Versió curta per a l'indicador del carnet. */
		curt = false
	}: { estat: EstatNuvol; locale: string; curt?: boolean } = $props();

	let ara = $state(Date.now());

	$effect(() => {
		if (estat.tipus !== 'ok') return;
		ara = Date.now();
		const id = setInterval(() => (ara = Date.now()), 30_000);
		return () => clearInterval(id);
	});

	const icona = $derived.by((): IconName => {
		switch (estat.tipus) {
			case 'local':
				return 'device';
			case 'error':
			case 'conflicte':
				return 'cloud-alert';
			case 'pendents':
				return 'cloud-up';
			default:
				return 'cloud-check';
		}
	});

	const quan = $derived(
		estat.tipus === 'ok'
			? (tempsRelatiu(estat.ultimaSync, new Date(ara), locale) ?? m.cloud_just_now())
			: ''
	);

	const text = $derived.by(() => {
		switch (estat.tipus) {
			case 'carregant':
				return m.cloud_loading();
			case 'local':
				return m.cloud_status_local();
			case 'error':
				return m.cloud_status_error();
			case 'conflicte':
				return m.cloud_conflict_title();
			case 'pendents':
				return estat.pendents === 1
					? m.cloud_sync_pending_one()
					: m.cloud_sync_pending({ count: String(estat.pendents) });
			case 'mai':
				return m.cloud_sync_never();
			case 'ok':
				return curt ? `${m.cloud_status_ok()} · ${quan}` : m.cloud_sync_ok({ when: quan });
		}
		return '';
	});
</script>

<span class={['estat-nuvol', estat.tipus]}>
	<Icon name={icona} size={20} />
	<span class="txt">
		{text}{#if estat.tipus === 'pendents' && estat.offline}<span class="sub">
				· {m.cloud_sync_offline()}</span
			>{/if}
	</span>
</span>

<style>
	.estat-nuvol {
		display: inline-flex;
		align-items: flex-start;
		gap: var(--sp-2);
		color: var(--c-ink);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}

	.estat-nuvol :global(svg) {
		margin-top: -1px;
	}

	.ok :global(svg),
	.mai :global(svg) {
		color: var(--c-pine);
	}

	.pendents :global(svg) {
		color: var(--c-blue);
	}

	.error :global(svg),
	.conflicte :global(svg) {
		color: var(--c-stamp-ink);
	}

	.local :global(svg),
	.carregant :global(svg) {
		color: var(--c-ink-2);
	}

	.sub {
		font-weight: var(--fw-regular, 400);
		color: var(--c-ink-2);
	}
</style>
