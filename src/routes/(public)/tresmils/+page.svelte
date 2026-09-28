<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/i18n';
	import { cimsDelLlistat } from '$lib/data/catalog';
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
</script>

<PaginaLlistat
	id="tresmils"
	{cims}
	titol={m.tresmils_title()}
	metaTitol={m.tresmils_meta_title({ count })}
	descripcio={m.tresmils_meta_description({ count })}
	entradeta={m.tresmils_lede({ count, cim: sostre })}
	nomCurt={m.explore_tresmils()}
/>
