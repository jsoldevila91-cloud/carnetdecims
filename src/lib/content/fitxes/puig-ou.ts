import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puig Ou',
	url: 'https://ca.wikipedia.org/wiki/Puig_Ou',
	consultat: CONSULTAT
};

const MUNTANYA_NATURA = {
	nom: "Muntanya i Natura: Ascensió al Talló i el Puig d'Ou (Alta Garrotxa)",
	url: 'https://www.muntanyainatura.org/rutes/guiades/ascensio-tallo-puig-dou-alta-garrotxa',
	consultat: CONSULTAT
};

const BLOG = {
	nom: "A la una a casa: Puig d'Ou i Talló per la vall del Bac",
	url: 'https://alaunaacasa.blogspot.com/2013/04/puig-dou-i-tallo-per-la-vall-del-bac.html',
	consultat: CONSULTAT
};

const ITINERANNIA = {
	nom: "Itinerànnia: De l'hostal de la Vall del Bac a Sant Andreu de Porreres, ruta 2 Vall dels Sentits",
	url: 'https://www.itinerannia.net/en/routes/from-l-hostal-de-la-vall-del-bac-to-sant-andreu-de-porreres-by-la-torre-ruta-2-vall-dels-sentits/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-ou',
	descripcio: {
		ca: [
			"El Puig Ou és una muntanya del municipi de la Vall de Bianya, a la [Garrotxa](/comarques/garrotxa), dins l'àrea protegida de l'Alta Garrotxa. Segons la Viquipèdia, separa la vall del Bac de la vall de Bolòs i Salarsa. A l'Alta Garrotxa hi ha també [el Comanegra](/cims/comanegra) i [el Bassegoda](/cims/bassegoda), també cims essencials del repte.",
			"La manera habitual d'apropar-s'hi és per la vall del Bac. Muntanya i Natura, una entitat muntanyenca, el proposa en una ruta guiada circular amb el Talló, a l'Alta Garrotxa, i la descriu com un itinerari per corriols pedregosos, terreny irregular i pendents pronunciats, amb algun pas aeri, en què cal tenir en compte el notable desnivell a superar en poca distància. L'entitat recomana fer-lo a l'hivern, a la primavera o a la tardor.",
			"D'altra banda, Itinerànnia, la xarxa d'itineraris senyalitzats, recull la ruta 2 de la Vall dels Sentits, que surt de l'antic hostal de la Vall del Bac i va a Sant Andreu de Porreres, una ermita que queda entre els cims del Puig Ou i del Talló. És una ruta de mitja dificultat que no puja al Puig Ou, però serveix per conèixer la zona i les seves ermites.",
			'Porta mapa o GPS: segons el blog consultat, el camí marcat és difícil de veure i les marques poden estar esborrades.'
		],
		es: [
			'El Puig Ou es una montaña del municipio de la Vall de Bianya, en la [Garrotxa](/comarques/garrotxa), dentro del área protegida de la Alta Garrotxa. Según la Viquipèdia, separa el valle del Bac del valle de Bolòs y Salarsa. En la Alta Garrotxa están también [el Comanegra](/cims/comanegra) y [el Bassegoda](/cims/bassegoda), también cimas esenciales del reto.',
			'La manera habitual de acercarse es por el valle del Bac. Muntanya i Natura, una entidad montañera, lo propone en una ruta guiada circular con el Talló, en la Alta Garrotxa, y lo describe como un itinerario por senderos pedregosos, terreno irregular y pendientes pronunciadas, con algún paso aéreo, en el que hay que tener en cuenta el notable desnivel a superar en poca distancia. La entidad recomienda hacerlo en invierno, primavera u otoño.',
			'Por otro lado, Itinerànnia, la red de itinerarios señalizados, recoge la ruta 2 de la Vall dels Sentits, que sale del antiguo hostal de la Vall del Bac y va a Sant Andreu de Porreres, una ermita que queda entre las cimas del Puig Ou y del Talló. Es una ruta de dificultad media que no sube al Puig Ou, pero sirve para conocer la zona y sus ermitas.',
			'Lleva mapa o GPS: según el blog consultado, el camino marcado es difícil de ver y las marcas pueden estar borradas.'
		]
	},
	rutes: [
		{
			id: 'vall-del-bac',
			nom: {
				ca: 'Circular pel Puig Ou i el Talló des de la vall del Bac',
				es: 'Circular por el Puig Ou y el Talló desde la vall del Bac'
			},
			sortida: { nom: 'Hostal de la Vall del Bac (la Vall de Bianya)' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "El blog A la una a casa fa la circular des de la vall del Bac passant per Sant Miquel de la Torre, el coll de Triadú i Sant Andreu de Porreres, i després el Puig d'Ou, el Talló i la tornada per Cal Ferrer: 14,2 km, 1.055 m de desnivell acumulat i 4 h 25 min caminant, 4 h 55 min amb parades, i inclou tots dos cims. El mateix autor assenyala que al Puig d'Ou hi ha un pas on cal posar les mans, i després el terreny és més suau, amb herba; i que el camí marcat (PR) és mal marcat i costa de veure. Muntanya i Natura parla d'algun pas aeri a la circular amb el Talló.",
				es: "El blog A la una a casa hace la circular desde la vall del Bac pasando por Sant Miquel de la Torre, el coll de Triadú y Sant Andreu de Porreres, y después el Puig d'Ou, el Talló y la vuelta por Cal Ferrer: 14,2 km, 1.055 m de desnivel acumulado y 4 h 25 min caminando, 4 h 55 min con paradas, e incluye las dos cimas. El mismo autor señala que en el Puig d'Ou hay un paso donde hay que poner las manos, y después el terreno es más suave, con hierba; y que el camino marcado (PR) está mal marcado y cuesta verlo. Muntanya i Natura habla de algún paso aéreo en la circular con el Talló."
			},
			fonts: [BLOG, MUNTANYA_NATURA]
		},
		{
			id: 'porreres',
			nom: {
				ca: 'Ruta 2 de la Vall dels Sentits fins a Sant Andreu de Porreres (no arriba al cim)',
				es: 'Ruta 2 de la Vall dels Sentits hasta Sant Andreu de Porreres (no llega a la cima)'
			},
			sortida: { nom: 'Antic hostal de la Vall del Bac (la Vall de Bianya)' },
			descripcio: {
				ca: "Itinerànnia la presenta com una ruta de 8,2 km, 341 m de desnivell i unes 3 hores, de dificultat mitjana, que comença a l'antic hostal de la Vall del Bac. L'ermita de Sant Andreu de Porreres queda entre els cims del Puig Ou i del Talló, i l'última part cap a l'ermita és la més dura. Els números són de la ruta, no del Puig Ou.",
				es: 'Itinerànnia la presenta como una ruta de 8,2 km, 341 m de desnivel y unas 3 horas, de dificultad media, que empieza en el antiguo hostal de la Vall del Bac. La ermita de Sant Andreu de Porreres queda entre las cimas del Puig Ou y del Talló, y la última parte hacia la ermita es la más dura. Los números son de la ruta, no del Puig Ou.'
			},
			fonts: [ITINERANNIA]
		}
	],
	consells: {
		ca: [
			"Segons el blog consultat, el camí marcat és mal marcat i costa de veure: porta un track de GPS o un mapa de l'Alta Garrotxa i no segueixis només les marques.",
			"Al Puig d'Ou hi ha un pas on cal posar les mans: no el facis amb la roca mullada ni amb boira.",
			"Muntanya i Natura recomana la zona a l'hivern, a la primavera i a la tardor",
			'Itinerànnia recomana, amb pluges fortes, passar pel pont de Cal Ferrer.',
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'Según el blog consultado, el camino marcado está mal marcado y cuesta verlo: lleva un track de GPS o un mapa de la Alta Garrotxa y no sigas solo las marcas.',
			"En el Puig d'Ou hay un paso donde hay que poner las manos: no lo hagas con la roca mojada ni con niebla.",
			'Muntanya i Natura recomienda la zona en invierno, primavera y otoño',
			'Itinerànnia recomienda, con lluvias fuertes, pasar por el puente de Cal Ferrer.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puig Ou?',
				resposta:
					'El blog A la una a casa fa la circular amb el Talló en 4 h 25 min caminant (4 h 55 min amb parades), per a 14,2 km i 1.055 m de desnivell acumulat. Les xifres inclouen els dos cims.'
			},
			{
				pregunta: 'Cal posar les mans al Puig Ou?',
				resposta:
					"Segons aquest blog, sí: al Puig d'Ou hi ha un pas on cal posar les mans, i després el terreny és més suau. Muntanya i Natura parla d'algun pas aeri a la circular amb el Talló."
			},
			{
				pregunta: 'Quina època és millor?',
				resposta:
					"Muntanya i Natura recomana l'hivern, la primavera i la tardor per a aquesta circular; consulta la predicció i l'estat de la neu abans de sortir."
			},
			{
				pregunta: 'El Puig Ou és un cim essencial?',
				resposta:
					'Sí. La [Garrotxa](/comarques/garrotxa) té també [el Comanegra](/cims/comanegra) i [Cabrera](/cims/cabrera) com a cims essencials.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puig Ou?',
				resposta:
					'El blog A la una a casa hace la circular con el Talló en 4 h 25 min caminando (4 h 55 min con paradas), para 14,2 km y 1.055 m de desnivel acumulado. Las cifras incluyen las dos cimas.'
			},
			{
				pregunta: '¿Hay que poner las manos en el Puig Ou?',
				resposta:
					"Según este blog, sí: en el Puig d'Ou hay un paso donde hay que poner las manos, y después el terreno es más suave. Muntanya i Natura habla de algún paso aéreo en la circular con el Talló."
			},
			{
				pregunta: '¿Qué época es mejor?',
				resposta:
					'Muntanya i Natura recomienda el invierno, la primavera y el otoño para esta circular; consulta la predicción y el estado de la nieve antes de salir.'
			},
			{
				pregunta: '¿El Puig Ou es una cima esencial?',
				resposta:
					'Sí. La [Garrotxa](/comarques/garrotxa) tiene también [el Comanegra](/cims/comanegra) y [Cabrera](/cims/cabrera) como cimas esenciales.'
			}
		]
	},
	fonts: [VIQUIPEDIA, MUNTANYA_NATURA, BLOG, ITINERANNIA],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
