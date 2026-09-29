<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/i18n';
	import { CIMS, cimsDelLlistat } from '$lib/data/catalog';
	import { formatAltitude } from '$lib/ui';
	import { ambAltitud, nomAmbArticle } from '$lib/seo/fitxa-cim';
	import PaginaLlistat from '../PaginaLlistat.svelte';

	const cims = cimsDelLlistat('tresmils');
	const count = cims.length;
	const [mesAlt] = cims;
	// "la Pica d'Estats (3.143 m)"
	const sostre = ambAltitud(
		nomAmbArticle(mesAlt.nom_amb_article, getLocale()),
		formatAltitude(mesAlt.altitud)
	);
	// Catàleg només d'essencials (fase 2): "els 5 tresmils del repte" seria fals; es diu "essencials".
	const nomesEssencials = CIMS.every((c) => c.essencial);
</script>

<PaginaLlistat
	id="tresmils"
	{cims}
	titol={m.tresmils_title()}
	metaTitol={nomesEssencials
		? m.tresmils_meta_title_essentials({ count })
		: m.tresmils_meta_title({ count })}
	descripcio={nomesEssencials
		? m.tresmils_meta_description_essentials({ count })
		: m.tresmils_meta_description({ count })}
	entradeta={nomesEssencials
		? m.tresmils_lede_essentials({ count, cim: sostre })
		: m.tresmils_lede({ count, cim: sostre })}
	nomCurt={m.explore_tresmils()}
/>
