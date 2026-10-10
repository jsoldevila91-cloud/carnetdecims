import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Castell de Milany',
	url: 'https://ca.wikipedia.org/wiki/Castell_de_Milany',
	consultat: CONSULTAT
};

const VALLFOGONA = {
	nom: 'Ajuntament de Vallfogona de Ripollès: restes del castell de Milany',
	url: 'https://vallfogona.cat/coneix/llocs-dinteres/restes-del-castell-de-milany/',
	consultat: CONSULTAT
};

const VALLFOGONA_RUTES = {
	nom: 'Ajuntament de Vallfogona de Ripollès: rutes de senderisme',
	url: 'https://vallfogona.cat/turisme/rutes-senderisme/',
	consultat: CONSULTAT
};

const FEMTURISME = {
	nom: 'Femturisme: castell de Milany des de Vallfogona de Ripollès',
	url: 'https://femturisme.cat/ca/rutes/castell-de-milany-des-de-vallfogona-de-ripolles',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'castell-de-milany',
	descripcio: {
		ca: [
			"El castell de Milany corona el turó de Milany, que el catàleg situa a Vallfogona de Ripollès, a l'[Osona](/comarques/osona), al límit amb el Ripollès. Segons la Viquipèdia, el turó queda a la ratlla dels termes de Vallfogona i Vidrà, dins de l'espai protegit de les serres de Milany-Santa Magdalena i Puigsacalm-Bellmunt, i el castell és el de Catalunya construït a més altitud. A la comarca, [la Creu de Gurb](/cims/creu-de-gurb) i [la Rocallarga](/cims/rocallarga) són altres cims essencials.",
			"La Viquipèdia recull que el nom de Milany apareix el 918 i la primera menció del castell és del 962. Va ser el centre de la baronia de Milany, va passar per diversos senyors, entre els quals els comtes d'Osona i de Besalú i la casa comtal de Barcelona, i a finals del segle XIII Dalmau de Palau el va reconstruir i fortificar. Els remences el van prendre el 1462 i, després de la guerra, va quedar abandonat. L'Ajuntament de Vallfogona data la fortificació al segle X i explica que, més tard, va passar als comtes de Barcelona, als vescomtes de Bas i, el 1600, als comtes de Vallfogona.",
			"Avui n'hi ha poca cosa, i l'Ajuntament parla de restes escasses. Les excavacions de la Diputació de Girona, entre el 2011 i el 2014, van deixar al descobert la planta quadrada de la torre principal, de parets d'1,6 m de gruix, i s'hi veuen també una cambra rectangular i una cisterna. Femturisme explica que el castell estava en obres de restauració l'any 2019.",
			"La sortida més coneguda és una circular des de Vallfogona de Ripollès, una gran excursió per fer a la tardor segons Femturisme. El camí és ben marcat amb senyals de GR i PR; la dificultat principal és l'orientació quan cauen les fulles."
		],
		es: [
			'El castell de Milany corona el cerro de Milany, que el catálogo sitúa en Vallfogona de Ripollès, en [Osona](/comarques/osona), en el límite con el Ripollès. Según la Viquipèdia, el cerro queda en la raya de los términos de Vallfogona y Vidrà, dentro del espacio protegido de las sierras de Milany-Santa Magdalena y Puigsacalm-Bellmunt, y el castillo es el de Catalunya construido a mayor altitud. En la comarca, [la Creu de Gurb](/cims/creu-de-gurb) y [la Rocallarga](/cims/rocallarga) son otras cimas esenciales.',
			'La Viquipèdia recoge que el nombre de Milany aparece en 918 y la primera mención del castillo es de 962. Fue el centro de la baronía de Milany, pasó por varios señores, entre ellos los condes de Osona y de Besalú y la casa condal de Barcelona, y a finales del siglo XIII Dalmau de Palau lo reconstruyó y fortificó. Los remensas lo tomaron en 1462 y, tras la guerra, quedó abandonado. El Ayuntamiento de Vallfogona data la fortificación en el siglo X y explica que, más tarde, pasó a los condes de Barcelona, a los vizcondes de Bas y, en 1600, a los condes de Vallfogona.',
			'Hoy queda poca cosa, y el Ayuntamiento habla de restos escasos. Las excavaciones de la Diputació de Girona, entre 2011 y 2014, dejaron al descubierto la planta cuadrada de la torre principal, de muros de 1,6 m de grosor, y se ven también una cámara rectangular y una cisterna. Femturisme explica que el castillo estaba en obras de restauración en 2019.',
			'La salida más conocida es una circular desde Vallfogona de Ripollès, una gran excursión para hacer en otoño según Femturisme. El camino está bien marcado con señales de GR y PR; la dificultad principal es la orientación cuando caen las hojas.'
		]
	},
	rutes: [
		{
			id: 'vallfogona',
			nom: {
				ca: 'Circular des de Vallfogona de Ripollès',
				es: 'Circular desde Vallfogona de Ripollès'
			},
			sortida: { nom: 'Nucli de Vallfogona de Ripollès' },
			descripcio: {
				ca: "Femturisme descriu una circular de 16,8 km, 544 m de desnivell i entre 5 i 6 h segons ritme i parades, de dificultat moderada. Es deixa el cotxe al nucli de Vallfogona, tot el camí està ben marcat amb senyals de GR i PR i la dificultat principal és l'orientació quan cauen les fulles; cal no desviar-se per alguns viaranys que hi ha a prop d'una casa. Les xifres són de la circular sencera.",
				es: 'Femturisme describe una circular de 16,8 km, 544 m de desnivel y entre 5 y 6 h según ritmo y paradas, de dificultad moderada. Se deja el coche en el núcleo de Vallfogona, todo el camino está bien marcado con señales de GR y PR y la dificultad principal es la orientación cuando caen las hojas; hay que no desviarse por algunas sendas que hay cerca de una casa. Las cifras son de la circular entera.'
			},
			fonts: [FEMTURISME]
		},
		{
			id: 'pr-c-59',
			nom: {
				ca: 'Pel PR-C 59 des de Santa Magdalena de Cambrils',
				es: 'Por el PR-C 59 desde Santa Magdalena de Cambrils'
			},
			sortida: { nom: 'Església de la Salut (Vallfogona de Ripollès)' },
			descripcio: {
				ca: "L'Ajuntament de Vallfogona recull la ruta de Vallfogona a Santa Magdalena de Cambrils: 12 km i de 4 a 5 hores, amb sortida davant de l'església de la Salut. Des de Santa Magdalena, el PR-C 59 continua fins al castell de Milany. Les xifres són de la ruta de Vallfogona a Santa Magdalena i tornada, que no arriba al castell.",
				es: 'El Ayuntamiento de Vallfogona recoge la ruta de Vallfogona a Santa Magdalena de Cambrils: 12 km y de 4 a 5 horas, con salida frente a la iglesia de la Salut. Desde Santa Magdalena, el PR-C 59 continúa hasta el castell de Milany. Las cifras son de la ruta de Vallfogona a Santa Magdalena y vuelta, que no llega al castillo.'
			},
			fonts: [VALLFOGONA_RUTES]
		}
	],
	consells: {
		ca: [
			"Segons Femturisme, la dificultat és l'orientació quan cauen les fulles: porta mapa o GPS i vigila els viaranys que surten prop de les cases.",
			"Són restes: no t'enfilis als murs.",
			'Femturisme calcula entre 5 i 6 hores per a la circular: compta les hores de llum, sobretot a la tardor.',
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'Según Femturisme, la dificultad es la orientación cuando caen las hojas: lleva mapa o GPS y vigila las sendas que salen cerca de las casas.',
			'Son restos: no te subas a los muros.',
			'Femturisme calcula entre 5 y 6 horas para la circular: cuenta las horas de luz, sobre todo en otoño.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al castell de Milany?',
				resposta:
					'Femturisme compta entre 5 i 6 hores per a la circular de 16,8 km i 544 m de desnivell des de Vallfogona de Ripollès.'
			},
			{
				pregunta: 'Quina història té el castell?',
				resposta:
					"Segons la Viquipèdia, el castell consta des del 962, va ser el centre de la baronia de Milany i va quedar abandonat després de la guerra remença. L'Ajuntament de Vallfogona el data al segle X."
			},
			{
				pregunta: 'Hi ha res per veure al cim?',
				resposta:
					"Només restes: la planta de la torre principal, una cambra i una cisterna segons la Viquipèdia, i un tros de mur i una cambra de volta apuntada segons l'Ajuntament."
			},
			{
				pregunta: 'El castell de Milany és un cim essencial?',
				resposta:
					"Sí. A l'[Osona](/comarques/osona) l'acompanyen [la Creu de Gurb](/cims/creu-de-gurb) i [la Rocallarga](/cims/rocallarga)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al castillo de Milany?',
				resposta:
					'Femturisme cuenta entre 5 y 6 horas para la circular de 16,8 km y 544 m de desnivel desde Vallfogona de Ripollès.'
			},
			{
				pregunta: '¿Qué historia tiene el castillo?',
				resposta:
					'Según la Viquipèdia, el castillo consta desde 962, fue el centro de la baronía de Milany y quedó abandonado tras la guerra remensa. El Ayuntamiento de Vallfogona lo data en el siglo X.'
			},
			{
				pregunta: '¿Hay algo que ver en la cima?',
				resposta:
					'Solo restos: la planta de la torre principal, una cámara y una cisterna según la Viquipèdia, y un trozo de muro y una cámara de bóveda apuntada según el Ayuntamiento.'
			},
			{
				pregunta: '¿El castell de Milany es una cima esencial?',
				resposta:
					'Sí. En [Osona](/comarques/osona) lo acompañan [la Creu de Gurb](/cims/creu-de-gurb) y [la Rocallarga](/cims/rocallarga).'
			}
		]
	},
	fonts: [VIQUIPEDIA, VALLFOGONA, VALLFOGONA_RUTES, FEMTURISME],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
