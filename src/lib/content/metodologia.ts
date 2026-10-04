/**
 * `/metodologia`: d'on surten les dades del catàleg, criteris, confiança, revisió i atribucions.
 * Fets verificats contra `scripts/catalog/` (build.ts, fonts/*), `scripts/catalog/informe.md` i
 * docs/03-modelo-datos.md §4 (2026-09-29). Si canvia el catàleg, cal revisar les xifres.
 */
import {
	CRITERIS_LLISTATS_DIFICULTAT,
	ESCALA_DIFICULTAT,
	type NivellDificultat,
	type Tecnicitat
} from '../domain/dificultat.ts';
import type { AppLocale } from '../i18n/routes.ts';
import { TITULAR } from './titular.ts';
import type { Bloc, Contingut, Seccio } from './types.ts';

const PDF_ESSENCIALS = 'https://www.feec.cat/wp-content/uploads/2020/02/Essencials-100-cims.pdf';
const FEEC_RESTRICCIONS = 'https://www.feec.cat/activitats/100-cims/cims-amb-restriccions-dacces/';
const FEEC_100_CIMS = 'https://www.feec.cat/activitats/100-cims/';
const ICGC_GEOCODIFICADOR = 'https://openicgc.github.io/geocodificador-doc/';
const OPEN_ICGC = 'https://openicgc.github.io/';
const IGN_GEOSERVICES = 'https://geoservices.ign.fr/';
const WIKIDATA = 'https://www.wikidata.org/';
const OSM_COPYRIGHT = 'https://www.openstreetmap.org/copyright';
const ODBL = 'https://opendatacommons.org/licenses/odbl/1-0/';
const ETALAB = 'https://www.etalab.gouv.fr/licence-ouverte-open-licence/';
const OPENMAPTILES = 'https://openmaptiles.org/';
const MAPTERHORN_ATRIBUCIO = 'https://mapterhorn.com/attribution';

const ACTUALITZAT = '2026-10-04';
const CONSULTAT = '2026-09-28';

/* -------- Dificultat orientativa: tots els números surten de `ESCALA_DIFICULTAT` (domain) -------- */

/** Enter amb punt de milers (2.500) i decimals amb coma (1,4), com a la resta de textos. */
const num = (n: number): string => {
	const [enter, decimals] = String(n).split('.');
	const ambMilers = enter.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	return decimals ? `${ambMilers},${decimals}` : ambMilers;
};

/** Minuts en format "2 h 30 min". */
const durada = (minuts: number): string => {
	const h = Math.floor(minuts / 60);
	const m = minuts % 60;
	return [h ? `${h} h` : '', m ? `${m} min` : ''].filter(Boolean).join(' ');
};

const NOMS_NIVELL: Record<AppLocale, Record<NivellDificultat, string>> = {
	ca: { 1: 'Fàcil', 2: 'Moderada', 3: 'Exigent', 4: 'Molt exigent' },
	es: { 1: 'Fácil', 2: 'Moderada', 3: 'Exigente', 4: 'Muy exigente' }
};

const NOMS_TECNICITAT: Record<AppLocale, Record<Tecnicitat, string>> = {
	ca: {
		cap: 'camí o pista sense dificultat tècnica',
		'terreny-irregular': 'terreny irregular (tarteres, pedra solta o trams sense camí marcat)',
		'grimpada-facil': 'grimpada fàcil (passos puntuals amb les mans, I)',
		grimpada: 'grimpada continuada o aèria (II o més) o trams amb cadenes',
		'via-equipada': 'via ferrada o trams equipats obligatoris'
	},
	es: {
		cap: 'camino o pista sin dificultad técnica',
		'terreny-irregular': 'terreno irregular (pedreras, piedra suelta o tramos sin camino marcado)',
		'grimpada-facil': 'trepada fácil (pasos puntuales con las manos, I)',
		grimpada: 'trepada continuada o aérea (II o más) o tramos con cadenas',
		'via-equipada': 'vía ferrata o tramos equipados obligatorios'
	}
};

/** Noms curts del pas més tècnic (per a frases). */
const NOMS_TECNICITAT_CURT: Record<AppLocale, Record<Tecnicitat, string>> = {
	ca: {
		cap: 'camí sense dificultat',
		'terreny-irregular': 'terreny irregular',
		'grimpada-facil': 'grimpada fàcil',
		grimpada: 'grimpada',
		'via-equipada': 'via equipada'
	},
	es: {
		cap: 'camino sin dificultad',
		'terreny-irregular': 'terreno irregular',
		'grimpada-facil': 'trepada fácil',
		grimpada: 'trepada',
		'via-equipada': 'vía equipada'
	}
};

/** Secció "Dificultat orientativa" (ancla `#dificultat-orientativa`, l'enllacen les fitxes). */
function seccioDificultat(locale: AppLocale): Seccio {
	const ca = locale === 'ca';
	const nom = NOMS_NIVELL[locale];
	const { metresPerKmEsforc, minutsPerKmEsforc, factorNomesDesnivell, llindarsKmEsforc } =
		ESCALA_DIFICULTAT.esforc;
	const [l1, l2, l3] = llindarsKmEsforc;
	const [a2, a3] = ESCALA_DIFICULTAT.altitud.llindarsM;
	const tecnica = (Object.entries(ESCALA_DIFICULTAT.tecnica) as [Tecnicitat, NivellDificultat][])
		.map(([t, n]) => `${NOMS_TECNICITAT[locale][t]} → ${nom[n]}`)
		.join('; ');
	const facils = CRITERIS_LLISTATS_DIFICULTAT['cims-facils'];
	const nens = CRITERIS_LLISTATS_DIFICULTAT['cims-amb-nens'];
	const nivellsNens = ESCALA_DIFICULTAT.nivells
		.filter((n) => n.nivell <= nens.nivellMax)
		.map((n) => nom[n.nivell])
		.join(' o ');
	const tecnicitatsNens = nens.tecnicitats.map((t) => NOMS_TECNICITAT_CURT[locale][t]).join(' o ');

	const blocs: Bloc[] = ca
		? [
				{
					tipus: 'paragraf',
					text: "La **dificultat orientativa** és una estimació pròpia de Carnet de Cims per a la ruta normal de cada cim amb fitxa completa. **No és el MIDE** ni cap valoració oficial (ni de la FEEC ni de cap altra entitat): serveix per comparar cims d'un cop d'ull. Té quatre nivells:"
				},
				{
					tipus: 'llista',
					items: [
						`**${nom[1]}:** excursió curta per camí, sense passos on calgui posar les mans i per sota dels ${num(a2)} m. Per a qualsevol persona acostumada a caminar.`,
						`**${nom[2]}:** cal una mica més de forma física: més desnivell o distància, terreny pedregós, algun pas puntual amb les mans o un cim d'alta muntanya.`,
						`**${nom[3]}:** jornada llarga o amb molt desnivell, grimpades continuades o amb cadenes, o cims de més de ${num(a3)} m. Cal experiència de muntanya.`,
						`**${nom[4]}:** recorregut molt llarg o amb via equipada obligatòria. Només per a excursionistes amb experiència i bona forma física.`
					]
				},
				{
					tipus: 'paragraf',
					text: "**Quines dades fem servir.** De la ruta normal, només l'anada: el desnivell positiu, la distància, el temps, el pas més tècnic segons les fonts i l'altitud del cim. Cada dada de la ruta surt d'una font citada a la fitxa; no n'inventem cap. Amb aquestes dades calculem tres factors i el nivell final és **el més alt** dels tres: cap factor no en compensa un altre."
				},
				{
					tipus: 'llista',
					items: [
						`**Esforç (km-esforç d'anada):** la distància en km més el desnivell positiu dividit per ${num(metresPerKmEsforc)} (${num(metresPerKmEsforc)} m de pujada equivalen a 1 km pla). Si no tenim totes dues dades, fem servir el temps d'anada (1 km-esforç cada ${num(minutsPerKmEsforc)} min) o, només amb el desnivell, desnivell / ${num(metresPerKmEsforc)} × ${num(factorNomesDesnivell)}. Fins a ${num(l1)} → ${nom[1]}; fins a ${num(l2)} → ${nom[2]}; fins a ${num(l3)} → ${nom[3]}; més de ${num(l3)} → ${nom[4]}.`,
						`**Pas més tècnic:** ${tecnica}.`,
						`**Altitud del cim:** per sota dels ${num(a2)} m no hi suma; de ${num(a2)} a ${num(a3 - 1)} m, com a mínim ${nom[2]}; a partir de ${num(a3)} m, com a mínim ${nom[3]}. Fa de mínim, però sola no basta per calcular la dificultat.`
					]
				},
				{
					tipus: 'paragraf',
					text: "**Quan és aproximada.** Si a la ruta li falta alguna dada amb font (el desnivell, la distància o el pas més tècnic, o el temps quan no hi ha desnivell i distància), la dificultat surt marcada com a **aproximada**. Si no hi ha prou dades ni per a l'esforç ni per al pas més tècnic, no en mostrem cap."
				},
				{
					tipus: 'paragraf',
					text: `**Llistats.** Els [cims fàcils](/cims-facils) són els que tenen la ruta normal de nivell ${nom[facils.nivellMax]}. Els [cims per fer amb nens](/cims-amb-nens) tenen nivell ${nivellsNens}, com a pas més tècnic ${tecnicitatsNens} (sense grimpades) i com a màxim ${num(nens.desnivellMaxM)} m de desnivell i ${durada(nens.tempsMaxMinuts)} d'anada quan se'n coneixen. En tots dos cal que la ruta tingui l'esforç calculat i el pas més tècnic amb font. Els llistats creixen a mesura que completem fitxes.`
				},
				{
					tipus: 'paragraf',
					text: "**MIDE.** El MIDE (Mètode d'Informació d'Excursions) és un sistema de valoració estandarditzat. Només el mostrem quan una font fiable el publica per a aquella ruta, i sempre amb la font citada; no el calculem mai nosaltres."
				},
				{
					tipus: 'avis',
					to: 'alerta',
					text: "La dificultat real depèn de la meteorologia, de l'estat del terreny (neu, gel, pedra mullada o solta), de l'època de l'any i de la teva forma física i experiència. Una ruta fàcil a l'estiu pot ser perillosa a l'hivern. Consulta la previsió, informa't de l'estat del camí, no dubtis a girar cua i, en cas d'emergència, truca al 112."
				}
			]
		: [
				{
					tipus: 'paragraf',
					text: 'La **dificultad orientativa** es una estimación propia de Carnet de Cims para la ruta normal de cada cima con ficha completa. **No es el MIDE** ni ninguna valoración oficial (ni de la FEEC ni de ninguna otra entidad): sirve para comparar cimas de un vistazo. Tiene cuatro niveles:'
				},
				{
					tipus: 'llista',
					items: [
						`**${nom[1]}:** excursión corta por camino, sin pasos donde haya que poner las manos y por debajo de los ${num(a2)} m. Para cualquier persona acostumbrada a caminar.`,
						`**${nom[2]}:** hace falta algo más de forma física: más desnivel o distancia, terreno pedregoso, algún paso puntual con las manos o una cima de alta montaña.`,
						`**${nom[3]}:** jornada larga o con mucho desnivel, trepadas continuadas o con cadenas, o cimas de más de ${num(a3)} m. Hace falta experiencia de montaña.`,
						`**${nom[4]}:** recorrido muy largo o con vía equipada obligatoria. Solo para excursionistas con experiencia y buena forma física.`
					]
				},
				{
					tipus: 'paragraf',
					text: '**Qué datos usamos.** De la ruta normal, solo la ida: el desnivel positivo, la distancia, el tiempo, el paso más técnico según las fuentes y la altitud de la cima. Cada dato de la ruta sale de una fuente citada en la ficha; no inventamos ninguno. Con estos datos calculamos tres factores y el nivel final es **el más alto** de los tres: ningún factor compensa a otro.'
				},
				{
					tipus: 'llista',
					items: [
						`**Esfuerzo (km-esfuerzo de ida):** la distancia en km más el desnivel positivo dividido por ${num(metresPerKmEsforc)} (${num(metresPerKmEsforc)} m de subida equivalen a 1 km llano). Si no tenemos ambos datos, usamos el tiempo de ida (1 km-esfuerzo cada ${num(minutsPerKmEsforc)} min) o, solo con el desnivel, desnivel / ${num(metresPerKmEsforc)} × ${num(factorNomesDesnivell)}. Hasta ${num(l1)} → ${nom[1]}; hasta ${num(l2)} → ${nom[2]}; hasta ${num(l3)} → ${nom[3]}; más de ${num(l3)} → ${nom[4]}.`,
						`**Paso más técnico:** ${tecnica}.`,
						`**Altitud de la cima:** por debajo de los ${num(a2)} m no suma; de ${num(a2)} a ${num(a3 - 1)} m, como mínimo ${nom[2]}; a partir de ${num(a3)} m, como mínimo ${nom[3]}. Actúa como mínimo, pero por sí sola no basta para calcular la dificultad.`
					]
				},
				{
					tipus: 'paragraf',
					text: '**Cuándo es aproximada.** Si a la ruta le falta algún dato con fuente (el desnivel, la distancia o el paso más técnico, o el tiempo cuando no hay desnivel y distancia), la dificultad aparece marcada como **aproximada**. Si no hay datos suficientes ni para el esfuerzo ni para el paso más técnico, no mostramos ninguna.'
				},
				{
					tipus: 'paragraf',
					text: `**Listados.** Las [cimas fáciles](/cims-facils) son las que tienen la ruta normal de nivel ${nom[facils.nivellMax]}. Las [cimas para hacer con niños](/cims-amb-nens) tienen nivel ${nivellsNens}, como paso más técnico ${tecnicitatsNens} (sin trepadas) y como máximo ${num(nens.desnivellMaxM)} m de desnivel y ${durada(nens.tempsMaxMinuts)} de ida cuando se conocen. En ambos hace falta que la ruta tenga el esfuerzo calculado y el paso más técnico con fuente. Los listados crecen a medida que completamos fichas.`
				},
				{
					tipus: 'paragraf',
					text: '**MIDE.** El MIDE (Método de Información de Excursiones) es un sistema de valoración estandarizado. Solo lo mostramos cuando una fuente fiable lo publica para esa ruta, y siempre con la fuente citada; nunca lo calculamos nosotros.'
				},
				{
					tipus: 'avis',
					to: 'alerta',
					text: 'La dificultad real depende de la meteorología, del estado del terreno (nieve, hielo, roca mojada o suelta), de la época del año y de tu forma física y experiencia. Una ruta fácil en verano puede ser peligrosa en invierno. Consulta la previsión, infórmate del estado del camino, no dudes en darte la vuelta y, en caso de emergencia, llama al 112.'
				}
			];

	return {
		id: 'dificultat-orientativa',
		titol: ca ? 'Dificultat orientativa' : 'Dificultad orientativa',
		blocs
	};
}

export const metodologia: Contingut = {
	ca: {
		title: 'Metodologia i fonts de les dades dels cims',
		description:
			"Com fem el catàleg de cims del repte 100 Cims: fonts (ICGC, IGN, Wikidata, OSM), criteris d'altitud i coordenades, revisió i llicències.",
		h1: 'Metodologia i fonts de les dades',
		intro:
			"Expliquem d'on surt cada dada del catàleg, com triem quan les fonts no coincideixen i com el revisem. Carnet de Cims és una web independent: aquest catàleg no és el registre oficial de la FEEC.",
		seccions: [
			{
				id: 'abast',
				titol: 'Què inclou el catàleg',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Ara mateix el catàleg té els **150 cims essencials** del repte 100 Cims, a Catalunya, Andorra i la Catalunya Nord. Més endavant hi volem afegir la resta de cims del repte, amb el mateix mètode.'
					},
					{
						tipus: 'paragraf',
						text: "De cada cim en recollim el nom, la comarca, l'altitud, les coordenades, si és essencial i les restriccions d'accés conegudes. Les pots consultar a la [llista de cims](/cims) o per [comarques](/comarques)."
					}
				]
			},
			{
				id: 'fonts',
				titol: "D'on surten les dades",
				blocs: [
					{
						tipus: 'llista',
						items: [
							`**Quins cims són essencials i a quina comarca els situa la FEEC:** la [llista pública de cims essencials](${PDF_ESSENCIALS}) de la FEEC (PDF). No en copiem res més.`,
							`**Coordenades i grafia dels noms a Catalunya:** el [geocodificador de l'ICGC](${ICGC_GEOCODIFICADOR}) (Institut Cartogràfic i Geològic de Catalunya), que dona els topònims oficials. És la font de les coordenades de 134 cims.`,
							"**Altitud de control a Catalunya i a part d'Andorra:** el model d'elevacions del terreny de 5 × 5 m de l'ICGC.",
							`**Catalunya Nord:** les coordenades i les elevacions de la Géoplateforme de l'[IGN](${IGN_GEOSERVICES}) (l'institut cartogràfic francès). Coordenades de 6 cims.`,
							`**[Wikidata](${WIKIDATA}):** l'altitud declarada de la majoria de cims (147) i les coordenades de 10, sobretot a Andorra i en casos revisats a mà.`,
							`**[OpenStreetMap](${OSM_COPYRIGHT}):** comprovació creuada de noms, punts i altituds, i l'altitud de 2 cims. Cap coordenada publicada no surt d'OpenStreetMap.`,
							"**Límits comarcals:** els de l'ICGC, només per comprovar que cada cim és dins de la seva comarca.",
							`**Restriccions d'accés:** la [pàgina de restriccions de la FEEC](${FEEC_RESTRICCIONS}), revisada a mà.`,
							"**Mapes de les fitxes i de les comarques:** el mapa topogràfic de l'ICGC a Catalunya i Andorra, i el Plan IGN a la Catalunya Nord.",
							"**[Mapa interactiu](/mapa):** el mapa base vectorial de l'ICGC (amb dades d'OpenMapTiles i OpenStreetMap fora de Catalunya), l'ombrejat del relleu de l'ICGC i de Mapterhorn i, a la Catalunya Nord, el Plan IGN. Els cims hi són amb les coordenades del catàleg."
						]
					},
					{
						tipus: 'paragraf',
						text: "No reproduïm la taula de cims de la web de la FEEC: ni les altituds ni el nombre d'ascensions. Les altituds i les coordenades les obtenim nosaltres de fonts obertes."
					}
				]
			},
			{
				id: 'criteris',
				titol: 'Com triem quan les fonts no coincideixen',
				blocs: [
					{
						tipus: 'llista',
						items: [
							"**Preval l'ICGC.** Si les fonts discrepen en la comarca, les coordenades o la grafia del nom, ens quedem amb l'ICGC, que és la referència oficial a Catalunya.",
							"**Altitud: la cota més coneguda.** Publiquem la cota que surt als mapes i a les ressenyes, sempre que quedi a ±15 m del punt més alt del model d'elevacions (ICGC, o IGN a la Catalunya Nord) en un radi de 60 m al voltant del cim. No publiquem el màxim brut del model, que pot diferir uns metres de la cota dels mapes. Si cap cota declarada no hi encaixa, fem servir el valor del model arrodonit.",
							"**Andorra.** On no hi ha model d'elevacions oficial, exigim que dues fonts independents coincideixin.",
							'**Noms repetits.** Quan dos cims es diuen igual, triem el que és dins de la comarca assignada i ho deixem documentat.',
							'**Decisions a mà.** Els casos especials (noms repetits, límits comarcals canviats, punts desplaçats) queden anotats amb la seva justificació i la font.'
						]
					}
				]
			},
			{
				id: 'confianca',
				titol: 'Nivells de confiança',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Cada cim té un nivell de confiança que es calcula automàticament en construir el catàleg:'
					},
					{
						tipus: 'llista',
						items: [
							"**Alta:** el nom coincideix a la font principal, una altra font situa el cim a menys de 300 m, almenys dues altituds coincideixen (±15 m), no hi ha cims amb el mateix nom a prop i el punt més alt del model d'elevacions és a tocar de la coordenada.",
							'**Mitjana:** la resta de casos. Solen ser cims resolts a mà o amb alguna dada per confirmar.',
							'**Baixa:** sense coordenades o sense altitud, o amb una coincidència de nom parcial que cap altra font no confirma.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'A 29 de setembre de 2026: 146 cims amb confiança alta, 4 amb confiança mitjana i cap amb confiança baixa.'
					}
				]
			},
			{
				id: 'revisio',
				titol: 'Estat de revisió',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'**Esborrany:** dades obtingudes i comprovades automàticament, però encara no revisades per una persona. La fitxa ho indica amb un avís.',
							"**Revisat:** una persona amb criteri de muntanya n'ha comprovat les dades i els textos."
						]
					},
					{
						tipus: 'paragraf',
						text: "Ara mateix totes les fitxes són esborranys. Les que ja tenen contingut inclouen descripció, accessos i [dificultat orientativa](/metodologia#dificultat-orientativa); el MIDE només hi surt quan una font el publica. Els textos es redactaran amb ajuda d'eines d'intel·ligència artificial a partir de fonts citades, i una persona els revisarà abans de marcar la fitxa com a revisada."
					}
				]
			},
			seccioDificultat('ca'),
			{
				id: 'no-oficial',
				titol: 'Una web no oficial',
				blocs: [
					{
						tipus: 'avis',
						to: 'info',
						text: `Carnet de Cims és una web independent, no oficial i no vinculada a la FEEC. Les dades són orientatives. La llista vigent, la normativa i la validació d'ascensions són les de la [FEEC](${FEEC_100_CIMS}), a través de les entitats.`
					}
				]
			},
			{
				id: 'errors',
				titol: 'Has trobat un error?',
				blocs: [
					{
						tipus: 'paragraf',
						text: `Si una coordenada, una altitud, un nom o una restricció no és correcta, escriu-nos a ${TITULAR.correu}. Indica el cim i, si pots, d'on surt la dada correcta (mapa, ressenya, fotografia del vèrtex geodèsic…). Revisem cada avís i, si cal, corregim el catàleg i n'anotem la font.`
					}
				]
			},
			{
				id: 'llicencies',
				titol: 'Llicències i atribucions',
				blocs: [
					{
						tipus: 'llista',
						items: [
							`Coordenades, topònims, elevacions, límits comarcals i mapes de Catalunya: © Institut Cartogràfic i Geològic de Catalunya ([ICGC](${OPEN_ICGC})), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ca).`,
							`Catalunya Nord: © IGN France (BD TOPO, RGE ALTI, Plan IGN), [Llicència Oberta 2.0](${ETALAB}).`,
							`© [Col·laboradors d'OpenStreetMap](${OSM_COPYRIGHT}), dades sota llicència [ODbL 1.0](${ODBL}).`,
							`Mapa interactiu: © [OpenMapTiles](${OPENMAPTILES}) i, per a l'ombrejat del relleu, © [Mapterhorn](${MAPTERHORN_ATRIBUCIO}).`,
							`Altituds i coordenades complementàries: [Wikidata](${WIKIDATA}), dades en domini públic ([CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.ca)). La citem per transparència.`,
							`Llista de cims essencials: FEEC, repte 100 Cims ([llista pública](${PDF_ESSENCIALS})). Web no oficial; la validació d'ascensions la fa la FEEC a través de les entitats.`
						]
					},
					{
						tipus: 'paragraf',
						text: "Algunes altituds deriven d'OpenStreetMap. Si mai oferim el catàleg com a base de dades descarregable, aquesta part s'oferirà sota llicència ODbL o se substituirà per una altra font."
					},
					{
						tipus: 'paragraf',
						text: '"100 Cims" és una marca de la FEEC. Aquí només s\'utilitza per descriure el repte. Més detalls a l\'[avís legal](/avis-legal).'
					}
				]
			}
		],
		faq: [
			{
				pregunta: "Per què l'altitud d'un cim no coincideix amb la d'una altra font?",
				resposta:
					"Cada font mesura d'una manera: els mapes donen una cota arrodonida i els models d'elevacions, el punt més alt d'una graella. Publiquem la cota més coneguda si encaixa a ±15 m amb el model d'elevacions de l'ICGC o de l'IGN."
			},
			{
				pregunta: 'Les dades de Carnet de Cims són oficials?',
				resposta:
					"No. És una web independent i no oficial. La llista vigent i la validació d'ascensions del repte 100 Cims són les de la FEEC."
			},
			{
				pregunta: "Com puc avisar d'un error en un cim?",
				resposta: `Escriu-nos a ${TITULAR.correu} amb el nom del cim i, si pots, la font de la dada correcta.`
			}
		],
		fonts: [
			{ nom: 'FEEC: llista de cims essencials (PDF)', url: PDF_ESSENCIALS, consultat: CONSULTAT },
			{ nom: "FEEC: cims amb restriccions d'accés", url: FEEC_RESTRICCIONS, consultat: CONSULTAT },
			{
				nom: 'ICGC: documentació del geocodificador',
				url: ICGC_GEOCODIFICADOR,
				consultat: CONSULTAT
			},
			{ nom: 'IGN: Géoplateforme', url: IGN_GEOSERVICES, consultat: CONSULTAT },
			{ nom: "OpenStreetMap: drets d'autor i llicència", url: OSM_COPYRIGHT, consultat: CONSULTAT }
		],
		actualitzat: ACTUALITZAT
	},
	es: {
		title: 'Metodología y fuentes de datos de las cimas',
		description:
			'Cómo hacemos el catálogo de cimas del reto 100 Cims: fuentes (ICGC, IGN, Wikidata, OSM), criterios de altitud y coordenadas, revisión y licencias.',
		h1: 'Metodología y fuentes de los datos',
		intro:
			'Explicamos de dónde sale cada dato del catálogo, cómo elegimos cuando las fuentes no coinciden y cómo lo revisamos. Carnet de Cims es una web independiente: este catálogo no es el registro oficial de la FEEC.',
		seccions: [
			{
				id: 'abast',
				titol: 'Qué incluye el catálogo',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Ahora mismo el catálogo tiene las **150 cimas esenciales** del reto 100 Cims, en Cataluña, Andorra y Cataluña Norte. Más adelante queremos añadir el resto de cimas del reto, con el mismo método.'
					},
					{
						tipus: 'paragraf',
						text: 'De cada cima recogemos el nombre, la comarca, la altitud, las coordenadas, si es esencial y las restricciones de acceso conocidas. Puedes consultarlas en la [lista de cimas](/cims) o por [comarcas](/comarques).'
					}
				]
			},
			{
				id: 'fonts',
				titol: 'De dónde salen los datos',
				blocs: [
					{
						tipus: 'llista',
						items: [
							`**Qué cimas son esenciales y en qué comarca las sitúa la FEEC:** la [lista pública de cimas esenciales](${PDF_ESSENCIALS}) de la FEEC (PDF). No copiamos nada más.`,
							`**Coordenadas y grafía de los nombres en Cataluña:** el [geocodificador del ICGC](${ICGC_GEOCODIFICADOR}) (Institut Cartogràfic i Geològic de Catalunya), que da los topónimos oficiales. Es la fuente de las coordenadas de 134 cimas.`,
							'**Altitud de control en Cataluña y en parte de Andorra:** el modelo de elevaciones del terreno de 5 × 5 m del ICGC.',
							`**Cataluña Norte:** las coordenadas y las elevaciones de la Géoplateforme del [IGN](${IGN_GEOSERVICES}) (el instituto cartográfico francés). Coordenadas de 6 cimas.`,
							`**[Wikidata](${WIKIDATA}):** la altitud declarada de la mayoría de cimas (147) y las coordenadas de 10, sobre todo en Andorra y en casos revisados a mano.`,
							`**[OpenStreetMap](${OSM_COPYRIGHT}):** comprobación cruzada de nombres, puntos y altitudes, y la altitud de 2 cimas. Ninguna coordenada publicada sale de OpenStreetMap.`,
							'**Límites comarcales:** los del ICGC, solo para comprobar que cada cima está dentro de su comarca.',
							`**Restricciones de acceso:** la [página de restricciones de la FEEC](${FEEC_RESTRICCIONS}), revisada a mano.`,
							'**Mapas de las fichas y de las comarcas:** el mapa topográfico del ICGC en Cataluña y Andorra, y el Plan IGN en Cataluña Norte.',
							'**[Mapa interactivo](/mapa):** el mapa base vectorial del ICGC (con datos de OpenMapTiles y OpenStreetMap fuera de Cataluña), el sombreado del relieve del ICGC y de Mapterhorn y, en Cataluña Norte, el Plan IGN. Las cimas aparecen con las coordenadas del catálogo.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'No reproducimos la tabla de cimas de la web de la FEEC: ni las altitudes ni el número de ascensiones. Las altitudes y las coordenadas las obtenemos nosotros de fuentes abiertas.'
					}
				]
			},
			{
				id: 'criteris',
				titol: 'Cómo elegimos cuando las fuentes no coinciden',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'**Prevalece el ICGC.** Si las fuentes discrepan en la comarca, las coordenadas o la grafía del nombre, nos quedamos con el ICGC, que es la referencia oficial en Cataluña.',
							'**Altitud: la cota más conocida.** Publicamos la cota que aparece en los mapas y en las reseñas, siempre que quede a ±15 m del punto más alto del modelo de elevaciones (ICGC, o IGN en Cataluña Norte) en un radio de 60 m alrededor de la cima. No publicamos el máximo bruto del modelo, que puede diferir unos metros de la cota de los mapas. Si ninguna cota declarada encaja, usamos el valor del modelo redondeado.',
							'**Andorra.** Donde no hay modelo de elevaciones oficial, exigimos que dos fuentes independientes coincidan.',
							'**Nombres repetidos.** Cuando dos cimas se llaman igual, elegimos la que está dentro de la comarca asignada y lo dejamos documentado.',
							'**Decisiones a mano.** Los casos especiales (nombres repetidos, límites comarcales cambiados, puntos desplazados) quedan anotados con su justificación y la fuente.'
						]
					}
				]
			},
			{
				id: 'confianca',
				titol: 'Niveles de confianza',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Cada cima tiene un nivel de confianza que se calcula automáticamente al construir el catálogo:'
					},
					{
						tipus: 'llista',
						items: [
							'**Alta:** el nombre coincide en la fuente principal, otra fuente sitúa la cima a menos de 300 m, al menos dos altitudes coinciden (±15 m), no hay cimas con el mismo nombre cerca y el punto más alto del modelo de elevaciones está junto a la coordenada.',
							'**Media:** el resto de casos. Suelen ser cimas resueltas a mano o con algún dato por confirmar.',
							'**Baja:** sin coordenadas o sin altitud, o con una coincidencia de nombre parcial que ninguna otra fuente confirma.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'A 29 de septiembre de 2026: 146 cimas con confianza alta, 4 con confianza media y ninguna con confianza baja.'
					}
				]
			},
			{
				id: 'revisio',
				titol: 'Estado de revisión',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'**Borrador:** datos obtenidos y comprobados automáticamente, pero aún no revisados por una persona. La ficha lo indica con un aviso.',
							'**Revisada:** una persona con criterio de montaña ha comprobado sus datos y sus textos.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'Ahora mismo todas las fichas son borradores. Las que ya tienen contenido incluyen descripción, accesos y [dificultad orientativa](/metodologia#dificultat-orientativa); el MIDE solo aparece cuando una fuente lo publica. Los textos se redactarán con ayuda de herramientas de inteligencia artificial a partir de fuentes citadas, y una persona los revisará antes de marcar la ficha como revisada.'
					}
				]
			},
			seccioDificultat('es'),
			{
				id: 'no-oficial',
				titol: 'Una web no oficial',
				blocs: [
					{
						tipus: 'avis',
						to: 'info',
						text: `Carnet de Cims es una web independiente, no oficial y no vinculada a la FEEC. Los datos son orientativos. La lista vigente, la normativa y la validación de ascensiones son las de la [FEEC](${FEEC_100_CIMS}), a través de las entidades.`
					}
				]
			},
			{
				id: 'errors',
				titol: '¿Has encontrado un error?',
				blocs: [
					{
						tipus: 'paragraf',
						text: `Si una coordenada, una altitud, un nombre o una restricción no es correcta, escríbenos a ${TITULAR.correu}. Indica la cima y, si puedes, de dónde sale el dato correcto (mapa, reseña, fotografía del vértice geodésico…). Revisamos cada aviso y, si hace falta, corregimos el catálogo y anotamos la fuente.`
					}
				]
			},
			{
				id: 'llicencies',
				titol: 'Licencias y atribuciones',
				blocs: [
					{
						tipus: 'llista',
						items: [
							`Coordenadas, topónimos, elevaciones, límites comarcales y mapas de Cataluña: © Institut Cartogràfic i Geològic de Catalunya ([ICGC](${OPEN_ICGC})), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es).`,
							`Cataluña Norte: © IGN France (BD TOPO, RGE ALTI, Plan IGN), [Licencia Abierta 2.0](${ETALAB}).`,
							`© [Colaboradores de OpenStreetMap](${OSM_COPYRIGHT}), datos bajo licencia [ODbL 1.0](${ODBL}).`,
							`Mapa interactivo: © [OpenMapTiles](${OPENMAPTILES}) y, para el sombreado del relieve, © [Mapterhorn](${MAPTERHORN_ATRIBUCIO}).`,
							`Altitudes y coordenadas complementarias: [Wikidata](${WIKIDATA}), datos en dominio público ([CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.es)). La citamos por transparencia.`,
							`Lista de cimas esenciales: FEEC, reto 100 Cims ([lista pública](${PDF_ESSENCIALS})). Web no oficial; la validación de ascensiones la hace la FEEC a través de las entidades.`
						]
					},
					{
						tipus: 'paragraf',
						text: 'Algunas altitudes derivan de OpenStreetMap. Si algún día ofrecemos el catálogo como base de datos descargable, esa parte se ofrecerá bajo licencia ODbL o se sustituirá por otra fuente.'
					},
					{
						tipus: 'paragraf',
						text: '"100 Cims" es una marca de la FEEC. Aquí solo se usa para describir el reto. Más detalles en el [aviso legal](/avis-legal).'
					}
				]
			}
		],
		faq: [
			{
				pregunta: '¿Por qué la altitud de una cima no coincide con la de otra fuente?',
				resposta:
					'Cada fuente mide de una manera: los mapas dan una cota redondeada y los modelos de elevaciones, el punto más alto de una cuadrícula. Publicamos la cota más conocida si encaja a ±15 m con el modelo de elevaciones del ICGC o del IGN.'
			},
			{
				pregunta: '¿Los datos de Carnet de Cims son oficiales?',
				resposta:
					'No. Es una web independiente y no oficial. La lista vigente y la validación de ascensiones del reto 100 Cims son las de la FEEC.'
			},
			{
				pregunta: '¿Cómo puedo avisar de un error en una cima?',
				resposta: `Escríbenos a ${TITULAR.correu} con el nombre de la cima y, si puedes, la fuente del dato correcto.`
			}
		],
		fonts: [
			{ nom: 'FEEC: lista de cimas esenciales (PDF)', url: PDF_ESSENCIALS, consultat: CONSULTAT },
			{
				nom: 'FEEC: cimas con restricciones de acceso',
				url: FEEC_RESTRICCIONS,
				consultat: CONSULTAT
			},
			{
				nom: 'ICGC: documentación del geocodificador',
				url: ICGC_GEOCODIFICADOR,
				consultat: CONSULTAT
			},
			{ nom: 'IGN: Géoplateforme', url: IGN_GEOSERVICES, consultat: CONSULTAT },
			{
				nom: 'OpenStreetMap: derechos de autor y licencia',
				url: OSM_COPYRIGHT,
				consultat: CONSULTAT
			}
		],
		actualitzat: ACTUALITZAT
	}
};
