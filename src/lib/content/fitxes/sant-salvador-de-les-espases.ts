import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Sant Salvador de les Espases',
	url: 'https://ca.wikipedia.org/wiki/Sant_Salvador_de_les_Espases',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: "Rutes Pirineus: Pujada a l'ermita de Sant Salvador de les Espases",
	url: 'https://www.rutespirineus.cat/rutes/ruta-sant-salvador-espases',
	consultat: CONSULTAT
};

const FEEC = {
	nom: "FEEC: cims amb restriccions d'accés",
	url: 'https://www.feec.cat/activitats/100-cims/cims-amb-restriccions-dacces/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'sant-salvador-de-les-espases',
	descripcio: {
		ca: [
			"Sant Salvador de les Espases és una ermita dalt d'un espadat aïllat, al costat del congost del Cairat, a l'esquerra del Llobregat, al [Baix Llobregat](/comarques/baix-llobregat). Segons la Viquipèdia, queda al límit dels termes d'Esparreguera, Olesa de Montserrat i Vacarisses, i s'hi arriba des de la Puda de Montserrat.",
			"L'edifici és l'antiga capella del castell de les Espases, del qual només queden vestigis, com una paret i part d'una mitja torre. La Viquipèdia data el castell des del 985 i explica que el 1351 el va comprar el monestir de Montserrat, que en va mantenir la senyoria fins al 1836. L'església, d'una sola nau, sembla gòtica però respon a una reforma del segle XVI; als murs hi ha restes d'un paredat romànic. Està declarada bé cultural d'interès nacional.",
			"Rutes Pirineus afegeix que, a prop de l'ermita, la cova de Sant Salvador és ara vallada, i que a l'ermita hi ha un establiment que obre al públic alguns dies de la setmana. L'entitat qualifica l'excursió de dificultat baixa, tot i el desnivell.",
			'Avís important sobre el repte: la FEEC indica que, mentre durin les obres de consolidació i restauració de la capella, no es validaran les ascensions a aquest cim. La Viquipèdia recorda que el 27 de maig de 2024 es va enfonsar part del sostre. Consulta la regulació vigent abans de planificar-hi la sortida.'
		],
		es: [
			'Sant Salvador de les Espases es una ermita sobre un espolón aislado, junto al congost del Cairat, en la margen izquierda del Llobregat, en el [Baix Llobregat](/comarques/baix-llobregat). Según la Viquipèdia, queda en el límite de los términos de Esparreguera, Olesa de Montserrat y Vacarisses, y se llega desde la Puda de Montserrat.',
			'El edificio es la antigua capilla del castillo de las Espases, del que solo quedan vestigios, como una pared y parte de una media torre. La Viquipèdia data el castillo desde el 985 y explica que en 1351 lo compró el monasterio de Montserrat, que mantuvo el señorío hasta 1836. La iglesia, de una sola nave, parece gótica pero responde a una reforma del siglo XVI; en los muros hay restos de un aparejo románico. Está declarada bien cultural de interés nacional.',
			'Rutes Pirineus añade que, cerca de la ermita, la cueva de Sant Salvador está ahora vallada, y que junto a la ermita hay un establecimiento abierto al público algunos días de la semana. La entidad califica la excursión de dificultad baja, pese al desnivel.',
			'Aviso importante sobre el reto: la FEEC indica que, mientras duren las obras de consolidación y restauración de la capilla, no se validarán las ascensiones a esta cima. La Viquipèdia recuerda que el 27 de mayo de 2024 se hundió parte del techo. Consulta la regulación vigente antes de planificar la salida.'
		]
	},
	rutes: [
		{
			id: 'puda',
			nom: {
				ca: "Des del camí de Can Tovella (la Puda) per la riera de l'Afrau",
				es: "Desde el camí de Can Tovella (la Puda) por la riera de l'Afrau"
			},
			sortida: {
				nom: 'Camí de Can Tovella, la Puda (Olesa de Montserrat), al punt quilomètric 7 de la C-55'
			},
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Rutes Pirineus descriu una ruta lineal de poc més de 4 km, entre anada i tornada, amb 350 m de desnivell i 1 h 45 min efectives sense parades; la fitxa no separa el temps d'anada del de tornada. Comença per la pista i, més amunt, per un corriol que passa per sobre dels túnels del ferrocarril, creua el torrent i fa llaçades; la part final és més abrupta. Segons l'entitat, el camí és pedregós i avança entre matollars. És de dificultat baixa, però amb un desnivell remarcable, i la fitxa avisa de la calor perquè és molt assolellat.",
				es: 'Rutes Pirineus describe una ruta lineal de poco más de 4 km, entre ida y vuelta, con 350 m de desnivel y 1 h 45 min efectivas sin paradas; la ficha no separa el tiempo de ida del de vuelta. Empieza por la pista y, más arriba, por un sendero que pasa por encima de los túneles del ferrocarril, cruza el torrente y hace lazadas; la parte final es más abrupta. Según la entidad, el camino es pedregoso y avanza entre matorrales. Es de dificultad baja, pero con un desnivel destacable, y la ficha avisa del calor porque está muy soleado.'
			},
			fonts: [RUTES_PIRINEUS]
		}
	],
	consells: {
		ca: [
			'Abans de sortir, consulta la regulació vigent de la FEEC: mentre durin les obres de consolidació i restauració de la capella no es validen les ascensions a aquest cim.',
			"Com que el sostre de l'ermita va patir un enfonsament el 2024 (Viquipèdia), no entris en cap espai tancat o vallat i respecta qualsevol senyal d'obres.",
			"Rutes Pirineus avisa que el camí és molt assolellat: a l'estiu, porta aigua i surt d'hora.",
			"La font de Sant Salvador sol estar seca i només raja després de pluges, segons Rutes Pirineus; porta l'aigua de casa.",
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'Antes de salir, consulta la regulación vigente de la FEEC: mientras duren las obras de consolidación y restauración de la capilla no se validan las ascensiones a esta cima.',
			'Como el techo de la ermita sufrió un hundimiento en 2024 (Viquipèdia), no entres en ningún espacio cerrado o vallado y respeta cualquier señal de obras.',
			'Rutes Pirineus avisa de que el camino está muy soleado: en verano, lleva agua y sal temprano.',
			'La fuente de Sant Salvador suele estar seca y solo mana tras las lluvias, según Rutes Pirineus; lleva el agua de casa.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Es valida l'ascens a Sant Salvador de les Espases pel repte?",
				resposta:
					'La FEEC indica que, mentre durin les obres de consolidació i restauració de la capella, no es validaran les ascensions a aquest cim, i que les limitacions es poden modificar o ampliar. Consulta la regulació vigent a la seva pàgina de cims amb restriccions.'
			},
			{
				pregunta: 'Quant es triga a pujar a Sant Salvador de les Espases?',
				resposta:
					'Rutes Pirineus compta 1 h 45 min efectives, anada i tornada, sense parades. El desnivell que dona és de 350 m.'
			},
			{
				pregunta: 'És una ruta difícil?',
				resposta:
					'Rutes Pirineus la classifica com de dificultat baixa, tot i que el desnivell és remarcable. El camí és pedregós i, a la part final, més abrupte.'
			},
			{
				pregunta: 'Qui va tenir la senyoria de les Espases?',
				resposta:
					"Segons la Viquipèdia, el monestir de Montserrat va comprar el castell el 1351 i en va mantenir la senyoria fins al 1836. A Montserrat tens l'[Elefant](/cims/elefant-roca-de-sant-salvador), un altre cim essencial del Bages."
			}
		],
		es: [
			{
				pregunta: '¿Se valida la ascensión a Sant Salvador de les Espases para el reto?',
				resposta:
					'La FEEC indica que, mientras duren las obras de consolidación y restauración de la capilla, no se validarán las ascensiones a esta cima, y que las limitaciones pueden modificarse o ampliarse. Consulta la regulación vigente en su página de cimas con restricciones.'
			},
			{
				pregunta: '¿Cuánto se tarda en subir a Sant Salvador de les Espases?',
				resposta:
					'Rutes Pirineus cuenta 1 h 45 min efectivas, ida y vuelta, sin paradas. El desnivel que da es de 350 m.'
			},
			{
				pregunta: '¿Es una ruta difícil?',
				resposta:
					'Rutes Pirineus la clasifica como de dificultad baja, aunque el desnivel es destacable. El camino es pedregoso y, en la parte final, más abrupto.'
			},
			{
				pregunta: '¿Quién tuvo el señorío de las Espases?',
				resposta:
					'Según la Viquipèdia, el monasterio de Montserrat compró el castillo en 1351 y mantuvo el señorío hasta 1836. En Montserrat tienes el [Elefant](/cims/elefant-roca-de-sant-salvador), otra cima esencial del Bages.'
			}
		]
	},
	fonts: [VIQUIPEDIA, RUTES_PIRINEUS, FEEC],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
