import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puig Neulós',
	url: 'https://ca.wikipedia.org/wiki/Puig_Neul%C3%B3s',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: Puig Neulós des del castell de Requesens",
	url: 'https://dexcursio.net/puig-neulos/',
	consultat: CONSULTAT
};

const ITINERANNIA = {
	nom: 'Itinerànnia: De Requesens al Puig Neulós, ruta circular',
	url: 'https://www.itinerannia.net/en/routes/from-requesens-to-puig-neulos-circular-route/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-neulos',
	descripcio: {
		ca: [
			"El Puig Neulós és el punt culminant de la serra de l'Albera, l'últim tram dels Pirineus abans del mar. El cim el comparteixen la Jonquera, a l'[Alt Empordà](/comarques/alt-emporda), i dos municipis del Rosselló, la Roca d'Albera i Sureda. Segons la Viquipèdia, la carena ja separava els comtats d'Empúries i de Rosselló i, des del tractat dels Pirineus del 1659, fa de frontera entre els estats espanyol i francès. Més a ponent, la mateixa ratlla passa pel [Roc del Comptador](/cims/roc-del-comptador).",
			"El nom vol dir puig ennuvolat: la Viquipèdia en cita la forma llatina Podio Nebuloso en un document del 1322. A dalt hi ha una estació repetidora de televisió i ràdio, que es veu des de bona part del Rosselló i de l'Empordà, i la torre d'en Manel, una piràmide de pedra que Manel Costa va aixecar a finals del segle XIX, que es va enderrocar per instal·lar-hi l'estació i que després s'ha refet.",
			"El vessant sud, el de Requesens, forma part del Paratge Natural d'Interès Nacional de l'Albera. La Viquipèdia en destaca les suredes, els prats pentinats per la tramuntana i la vaca de l'Albera, que hi pastura en llibertat i explica la tanca que ressegueix la carena. Prop del cim hi ha un pou de glaç, que D'excursió per Catalunya troba perfectament conservat. Des de dalt, Itinerànnia descriu la plana de l'Empordà, el Rosselló i el Canigó.",
			"El Neulós fa honor al nom: és una carena de boires i de tramuntana. Amb mal temps, la part alta és molt exposada; al camí de baixada d'Itinerànnia hi ha el refugi de la Tanyareda."
		],
		es: [
			"El Puig Neulós es el punto culminante de la sierra de l'Albera, el último tramo de los Pirineos antes del mar. La cima la comparten la Jonquera, en el [Alt Empordà](/comarques/alt-emporda), y dos municipios del Rosselló, la Roca d'Albera y Sureda. Según la Viquipèdia, la cresta ya separaba los condados de Empúries y de Rosselló y, desde el tratado de los Pirineos de 1659, hace de frontera entre los estados español y francés. Más a poniente, la misma raya pasa por el [Roc del Comptador](/cims/roc-del-comptador).",
			"El nombre significa monte nublado: la Viquipèdia cita la forma latina Podio Nebuloso en un documento de 1322. Arriba hay una estación repetidora de televisión y radio, que se ve desde buena parte del Rosselló y del Empordà, y la torre d'en Manel, una pirámide de piedra que Manel Costa levantó a finales del siglo XIX, que se derribó para instalar la estación y que después se ha rehecho.",
			"La vertiente sur, la de Requesens, forma parte del Paraje Natural de Interés Nacional de l'Albera. La Viquipèdia destaca sus alcornocales, los prados peinados por la tramontana y la vaca de l'Albera, que pasta en libertad y explica la cerca que recorre la cresta. Cerca de la cima hay un pozo de hielo, que D'excursió per Catalunya encuentra perfectamente conservado. Desde arriba, Itinerànnia describe la llanura del Empordà, el Rosselló y el Canigó.",
			'El Neulós hace honor a su nombre: es una cresta de nieblas y de tramontana. Con mal tiempo, la parte alta está muy expuesta; en el camino de bajada de Itinerànnia está el refugio de la Tanyareda.'
		]
	},
	rutes: [
		{
			id: 'requesens',
			nom: {
				ca: 'Circular des de Requesens pel coll del Pou',
				es: 'Circular desde Requesens por el coll del Pou'
			},
			sortida: {
				nom: 'Aparcament prop del castell de Requesens (la Jonquera), per la pista de Cantallops'
			},
			descripcio: {
				ca: "D'excursió per Catalunya descriu una circular de 16,85 km, 872 m de desnivell positiu i 5 h 15 min, de dificultat moderada: de l'encreuament del castell se segueix la pista principal fins al coll del Pou i, d'allà, es pot acabar per la carretera asfaltada que ve del vessant nord o pel camí que ressegueix la tanca de la frontera. Baixa pel coll Pregon, per un corriol de marques grogues escasses. Itinerànnia proposa una volta semblant de 16,26 km, 971 m de pujada i 6 h 20 min, de dificultat alta, que puja per la Mare de Déu de Requesens, el coll Forcat i el roc dels Tres Termes, i torna per la font de la Tanyareda i el coll del Faig.",
				es: "D'excursió per Catalunya describe una circular de 16,85 km, 872 m de desnivel positivo y 5 h 15 min, de dificultad moderada: desde el cruce del castillo se sigue la pista principal hasta el coll del Pou y, desde allí, se puede acabar por la carretera asfaltada que viene de la vertiente norte o por el camino que sigue la cerca de la frontera. Baja por el coll Pregon, por un sendero de marcas amarillas escasas. Itinerànnia propone una vuelta parecida de 16,26 km, 971 m de subida y 6 h 20 min, de dificultad alta, que sube por la Mare de Déu de Requesens, el coll Forcat y el roc dels Tres Termes, y vuelve por la fuente de la Tanyareda y el coll del Faig."
			},
			fonts: [DEXCURSIO, ITINERANNIA]
		}
	],
	consells: {
		ca: [
			"A la pista de Cantallops a Requesens hi ha una porta metàl·lica: segons Itinerànnia, el pas en cotxe no està prohibit, però s'ha de deixar tancada.",
			"L'inici del corriol de baixada al coll Pregon queda mig amagat i les marques grogues són escasses: D'excursió per Catalunya recomana portar mapa o el track.",
			"Porta l'aigua de tot el dia: la mateixa ressenya en recomana un litre i mig com a mínim.",
			'Amb tramuntana forta, la carena és molt incòmoda: mira la predicció de vent abans de sortir, no només la de pluja.',
			"Pel vessant francès la carretera puja fins a l'estació repetidora, però la Viquipèdia avisa que des del coll de l'Ullat és d'ús restringit i s'ha de continuar a peu."
		],
		es: [
			'En la pista de Cantallops a Requesens hay una puerta metálica: según Itinerànnia, el paso en coche no está prohibido, pero hay que dejarla cerrada.',
			"El inicio del sendero de bajada en el coll Pregon queda medio escondido y las marcas amarillas son escasas: D'excursió per Catalunya recomienda llevar mapa o el track.",
			'Lleva el agua de todo el día: la misma reseña recomienda un litro y medio como mínimo.',
			'Con tramontana fuerte, la cresta es muy incómoda: mira la predicción de viento antes de salir, no solo la de lluvia.',
			"Por la vertiente francesa la carretera sube hasta la estación repetidora, pero la Viquipèdia avisa de que desde el coll de l'Ullat es de uso restringido y hay que continuar a pie."
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puig Neulós des de Requesens?',
				resposta:
					"Les dues voltes publicades són de dia sencer: 5 h 15 min per a 16,85 km i 872 m de desnivell positiu segons D'excursió per Catalunya, i 6 h 20 min per a 16,26 km i 971 m segons Itinerànnia. Cap de les dues dona l'horari només de pujada."
			},
			{
				pregunta: 'Es pot arribar al cim en cotxe?',
				resposta:
					"No fins a dalt. Pel vessant nord hi ha una carretera asfaltada des de la Roca d'Albera, però segons la Viquipèdia a partir del coll de l'Ullat és d'ús restringit. Pel sud, les pistes arriben a Requesens i la resta es fa a peu."
			},
			{
				pregunta: "Què és la torre d'en Manel?",
				resposta:
					"Un monument piramidal de pedra que hi ha al cim. Segons la Viquipèdia, el va construir Manel Costa a finals del segle XIX, es va enderrocar quan es va instal·lar l'estació de comunicacions i més tard es va restituir."
			},
			{
				pregunta: 'Per què hi ha una tanca a la carena?',
				resposta:
					"Pel bestiar: la Viquipèdia explica que la vaca de l'Albera pastura en llibertat per aquesta muntanya. La tanca coincideix amb la frontera i una de les variants de pujada la ressegueix des del coll del Pou."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puig Neulós desde Requesens?',
				resposta:
					"Las dos vueltas publicadas son de día entero: 5 h 15 min para 16,85 km y 872 m de desnivel positivo según D'excursió per Catalunya, y 6 h 20 min para 16,26 km y 971 m según Itinerànnia. Ninguna de las dos da el horario solo de subida."
			},
			{
				pregunta: '¿Se puede llegar a la cima en coche?',
				resposta:
					"No hasta arriba. Por la vertiente norte hay una carretera asfaltada desde la Roca d'Albera, pero según la Viquipèdia a partir del coll de l'Ullat es de uso restringido. Por el sur, las pistas llegan a Requesens y el resto se hace a pie."
			},
			{
				pregunta: "¿Qué es la torre d'en Manel?",
				resposta:
					'Un monumento piramidal de piedra que hay en la cima. Según la Viquipèdia, lo construyó Manel Costa a finales del siglo XIX, se derribó cuando se instaló la estación de comunicaciones y más tarde se restituyó.'
			},
			{
				pregunta: '¿Por qué hay una cerca en la cresta?',
				resposta:
					"Por el ganado: la Viquipèdia explica que la vaca de l'Albera pasta en libertad por esta montaña. La cerca coincide con la frontera y una de las variantes de subida la sigue desde el coll del Pou."
			}
		]
	},
	fonts: [VIQUIPEDIA, DEXCURSIO, ITINERANNIA],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
