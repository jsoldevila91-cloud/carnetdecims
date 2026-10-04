<script lang="ts">
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';
	import { PAGINES_CONTINGUT } from '$lib/content/types';

	/**
	 * Avisos dels llistats de dificultat (`/cims-facils`, `/cims-amb-nens`): la dificultat és una
	 * estimació pròpia (no és el MIDE), enllaç a la metodologia i, si n'hi ha, un consell de
	 * seguretat.
	 */
	let { seguretat }: { seguretat?: string } = $props();
</script>

<div class="avisos">
	<p>
		{m.difficulty_list_disclaimer()}
		<a href="{href(PAGINES_CONTINGUT.metodologia)}#dificultat-orientativa">
			{m.difficulty_list_method_link()}
		</a>
	</p>
	{#if seguretat}
		<p>{seguretat}</p>
	{/if}
</div>

<style>
	.avisos {
		display: grid;
		gap: var(--sp-2);
		margin-top: var(--sp-3);
		max-width: 70ch;
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}

	a {
		display: inline-flex;
		align-items: center;
		min-height: 24px;
		color: var(--c-stamp-ink);
		font-weight: var(--fw-semibold);
		text-underline-offset: 2px;
	}
</style>
