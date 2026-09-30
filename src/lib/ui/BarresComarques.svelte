<script lang="ts">
	import type { ProgresComarca } from '$lib/domain';
	import { comarcaPerSlug } from '$lib/data/catalog';
	import { href } from '$lib/i18n';
	import { m } from '$lib/paraglide/messages';

	/**
	 * Progrés per comarca: barres accessibles (`role="meter"` amb nom i valor en text) i enllaç a
	 * la pàgina pública de la comarca.
	 */
	let { comarques }: { comarques: readonly ProgresComarca[] } = $props();

	const nom = (slug: string) => comarcaPerSlug(slug)?.nom ?? slug;
	const pad = (n: number) => String(n).padStart(2, '0');
</script>

<ul class="barres">
	{#each comarques as c (c.comarca)}
		{@const valor = m.com_meter_value({ done: String(c.fets), total: String(c.total) })}
		<li>
			<div class="fila">
				<a href={href(`/comarques/${c.comarca}`)}>{nom(c.comarca)}</a>
				<span class="xifra mono" aria-hidden="true">
					{m.com_count({ done: pad(c.fets), total: pad(c.total) })}
				</span>
			</div>
			<div
				class="meter"
				role="meter"
				aria-label={nom(c.comarca)}
				aria-valuemin={0}
				aria-valuemax={c.total}
				aria-valuenow={c.fets}
				aria-valuetext={valor}
			>
				<span style:width="{c.total > 0 ? (c.fets / c.total) * 100 : 0}%"></span>
			</div>
			{#if c.essencialsTotal > 0}
				<p class="ess mono">
					{m.com_essentials({ done: String(c.essencialsFets), total: String(c.essencialsTotal) })}
				</p>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.barres {
		display: grid;
		gap: var(--sp-3);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.fila {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--sp-3);
	}

	.fila a {
		display: inline-flex;
		align-items: center;
		min-height: 2rem;
		font-weight: var(--fw-bold);
		color: var(--c-ink);
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}

	.xifra {
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
	}

	.meter {
		height: 10px;
		border: var(--bw) solid var(--c-line);
		border-radius: 2px;
		background: repeating-linear-gradient(
			90deg,
			transparent 0 calc(10% - 1px),
			var(--c-rule) calc(10% - 1px) 10%
		);
		overflow: hidden;
	}

	.meter span {
		display: block;
		height: 100%;
		background: var(--c-ink);
	}

	.ess {
		margin-top: 2px;
		font-size: var(--fs-2xs);
		color: var(--c-ink-2);
	}
</style>
