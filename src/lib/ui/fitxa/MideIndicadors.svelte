<script lang="ts">
	import Icon from '../Icon.svelte';
	import { m } from '$lib/paraglide/messages';
	import type { Mide } from '$lib/domain';

	/**
	 * Valoració MIDE d'una ruta: 4 eixos (medi, itinerari, desplaçament, esforç) d'1 a 5.
	 * Cada eix és text llegible ("Medi · 3 de 5 · Diversos factors de risc."): els quadrets només
	 * reforcen el valor (forma + farciment, no només color) i van amagats als lectors de pantalla.
	 */
	let { mide, titolId }: { mide: Mide; titolId: string } = $props();

	type Eix = keyof Mide;
	type Valor = Mide[Eix];
	type Textos = Record<Valor, () => string>;

	const EIXOS: { eix: Eix; nom: () => string; textos: Textos }[] = [
		{
			eix: 'medi',
			nom: m.cim_mide_medi,
			textos: {
				1: m.cim_mide_medi_1,
				2: m.cim_mide_medi_2,
				3: m.cim_mide_medi_3,
				4: m.cim_mide_medi_4,
				5: m.cim_mide_medi_5
			}
		},
		{
			eix: 'itinerari',
			nom: m.cim_mide_itinerari,
			textos: {
				1: m.cim_mide_itinerari_1,
				2: m.cim_mide_itinerari_2,
				3: m.cim_mide_itinerari_3,
				4: m.cim_mide_itinerari_4,
				5: m.cim_mide_itinerari_5
			}
		},
		{
			eix: 'desplacament',
			nom: m.cim_mide_desplacament,
			textos: {
				1: m.cim_mide_desplacament_1,
				2: m.cim_mide_desplacament_2,
				3: m.cim_mide_desplacament_3,
				4: m.cim_mide_desplacament_4,
				5: m.cim_mide_desplacament_5
			}
		},
		{
			eix: 'esforc',
			nom: m.cim_mide_esforc,
			textos: {
				1: m.cim_mide_esforc_1,
				2: m.cim_mide_esforc_2,
				3: m.cim_mide_esforc_3,
				4: m.cim_mide_esforc_4,
				5: m.cim_mide_esforc_5
			}
		}
	];

	/** Web oficial del MIDE (Método de Información de Excursiones). */
	const MIDE_URL = 'https://mide.montanasegura.com/';
</script>

<div class="mide">
	<p class="cap">
		<span class="label" id={titolId}>{m.cim_mide_title()}</span>
		<a class="que" href={MIDE_URL} rel="external noopener" target="_blank">
			{m.cim_mide_what()}<Icon name="external" size={13} strokeWidth={2} />
			<span class="sr-only">{m.external_new_tab()}</span>
		</a>
	</p>
	<ul aria-labelledby={titolId}>
		{#each EIXOS as e (e.eix)}
			{@const valor = mide[e.eix]}
			<li>
				<span class="nom">{e.nom()}</span>
				<span class="pips" aria-hidden="true">
					{#each [1, 2, 3, 4, 5] as n (n)}
						<span class={['pip', { ple: n <= valor }]}></span>
					{/each}
				</span>
				<span class="valor mono">{m.cim_mide_value({ valor })}</span>
				<span class="expl">{e.textos[valor]()}</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	.mide {
		display: grid;
		gap: var(--sp-2);
	}

	.cap {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0 var(--sp-3);
	}

	.que {
		display: inline-flex;
		align-items: center;
		gap: 2px;
		min-height: var(--tap);
		color: var(--c-stamp-ink);
		font-size: var(--fs-sm);
		font-weight: var(--fw-semibold);
		text-underline-offset: 2px;
	}

	ul {
		display: grid;
		gap: var(--sp-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* Mòbil: nom · quadrets · valor en una línia; explicació a sota. */
	li {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto auto;
		align-items: center;
		gap: 2px var(--sp-2);
		padding: var(--sp-2) 0;
		border-top: 1px dashed var(--c-rule);
	}

	.nom {
		font-weight: var(--fw-bold);
		font-size: var(--fs-sm);
	}

	.pips {
		display: inline-flex;
		gap: 3px;
	}

	/* Buit = només vora; ple = farcit: es distingeix sense color. */
	.pip {
		width: 12px;
		height: 12px;
		border: 1.5px solid var(--c-ink);
		border-radius: 2px;
	}

	.pip.ple {
		background: var(--c-ink);
	}

	.valor {
		font-size: var(--fs-xs);
		font-weight: var(--fw-semibold);
		white-space: nowrap;
	}

	.expl {
		grid-column: 1 / -1;
		font-size: var(--fs-sm);
		color: var(--c-ink-2);
	}
</style>
