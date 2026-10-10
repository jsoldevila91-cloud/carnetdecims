import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: El Mont (Albanyà)',
	url: 'https://ca.wikipedia.org/wiki/El_Mont_(Albany%C3%A0)',
	consultat: CONSULTAT
};

const BEUDA = {
	nom: 'Ajuntament de Beuda, turisme: Pujada a la Mare de Déu del Mont',
	url: 'https://turisme.beuda.cat/rutes/pujada-a-la-mare-de-deu-del-mont/',
	consultat: CONSULTAT
};

const ITINERANNIA = {
	nom: 'Itinerànnia: Pujada a la Mare de Déu del Mont des de Beuda, ruta 2',
	url: 'https://www.itinerannia.net/en/routes/climb-to-mare-de-deu-del-mont-from-beuda-route-2-beuda/',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: Mare de Déu del Mont",
	url: 'https://dexcursio.net/mare-de-deu-del-mont/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'el-mont',
	descripcio: {
		ca: [
			"El Mont, o serra del Mont, és un massís del Prepirineu que fa de frontera entre l'[Alt Empordà](/comarques/alt-emporda) i la [Garrotxa](/comarques/garrotxa). Segons la Viquipèdia, queda a l'antic municipi de Bassegoda, avui agregat a Albanyà, a prop de Beuda, i separa la conca de la Muga de la del Fluvià. Dins de l'Alta Garrotxa té com a veí el [Bassegoda](/cims/bassegoda).",
			"La muntanya es coneix sobretot pel santuari que la corona, el de la Mare de Déu del Mont: la Viquipèdia explica que a l'edat mitjana s'anomenava muntanya de Sant Llorenç, que hi va néixer un monestir benedictí, Sant Llorenç del Mont (o de Sous), i que al segle XIV d'aquell monestir va sorgir el santuari. També la recull com la Porta del Pirineu. Segons la mateixa font, a finals del segle XVIII el cim va ser un dels punts de triangulació de l'arc de meridià entre Dunkerque i Barcelona, que va servir per fixar la longitud del metre.",
			"Pujar-hi és una sortida llarga per a un cim d'aquesta alçada, perquè el desnivell s'acumula des del poble de Beuda. D'excursió per Catalunya parla de vistes panoràmiques de 360 graus des de dalt, i recomana roba d'abric fins i tot a l'estiu perquè al cim pot bufar el vent.",
			'Els camins són de pista i de corriols de bosc, sense passos de grimpada descrits per cap de les fonts consultades. El terreny demana cura als trams de més pendent, especialment a la baixada, per evitar relliscades.'
		],
		es: [
			'El Mont, o sierra del Mont, es un macizo del Prepirineo que hace de frontera entre el [Alt Empordà](/comarques/alt-emporda) y la [Garrotxa](/comarques/garrotxa). Según la Viquipèdia, queda en el antiguo municipio de Bassegoda, hoy agregado a Albanyà, cerca de Beuda, y separa la cuenca de la Muga de la del Fluvià. Dentro de la Alta Garrotxa tiene como vecino el [Bassegoda](/cims/bassegoda).',
			'La montaña se conoce sobre todo por el santuario que la corona, el de la Mare de Déu del Mont: la Viquipèdia explica que en la Edad Media se llamaba montaña de Sant Llorenç, que allí nació un monasterio benedictino, Sant Llorenç del Mont (o de Sous), y que en el siglo XIV de aquel monasterio surgió el santuario. También la recoge como la Porta del Pirineu. Según la misma fuente, a finales del siglo XVIII la cima fue uno de los puntos de triangulación del arco de meridiano entre Dunkerque y Barcelona, que sirvió para fijar la longitud del metro.',
			"Subir es una salida larga para una cima de esta altura, porque el desnivel se acumula desde el pueblo de Beuda. D'excursió per Catalunya habla de vistas panorámicas de 360 grados desde arriba, y recomienda ropa de abrigo incluso en verano porque en la cima puede soplar el viento.",
			'Los caminos son de pista y de senderos de bosque, sin pasos de trepada descritos por ninguna de las fuentes consultadas. El terreno pide cuidado en los tramos de más pendiente, sobre todo en la bajada, para evitar resbalones.'
		]
	},
	rutes: [
		{
			id: 'beuda-circular',
			nom: {
				ca: 'Circular des de Beuda pel monestir de Sant Llorenç de Sous',
				es: 'Circular desde Beuda por el monasterio de Sant Llorenç de Sous'
			},
			sortida: {
				nom: "Beuda (carretera asfaltada darrere l'església, encreuament G155 d'Itinerànnia)"
			},
			descripcio: {
				ca: "És la ruta que recull l'Ajuntament de Beuda: surt del poble, per la carretera asfaltada que passa darrere l'església, i puja per un camí marcat fins a la carretera. Passa per la font de Roca Pastora i pel monestir de Sant Llorenç de Sous, continua per carretera i corriol fins a l'aparcament i, finalment, al santuari. La tornada és per un recorregut diferent, pel cingle de Rocapastora, el turó de les Grives, el Castellot i la Font Fresca. Les xifres són de tota la circular: 10,5 km, 805 m de desnivell acumulat de pujada i 4 h 25 min, amb dificultat alta segons l'Ajuntament i Itinerànnia.",
				es: 'Es la ruta que recoge el Ayuntamiento de Beuda: sale del pueblo, por la carretera asfaltada que pasa detrás de la iglesia, y sube por un camino marcado hasta la carretera. Pasa por la fuente de Roca Pastora y por el monasterio de Sant Llorenç de Sous, continúa por carretera y sendero hasta el aparcamiento y, finalmente, al santuario. La vuelta es por un recorrido distinto, por el cingle de Rocapastora, el turó de les Grives, el Castellot y la Font Fresca. Las cifras son de toda la circular: 10,5 km, 805 m de desnivel acumulado de subida y 4 h 25 min, con dificultad alta según el Ayuntamiento e Itinerànnia.'
			},
			fonts: [BEUDA, ITINERANNIA]
		},
		{
			id: 'beuda-placa',
			nom: {
				ca: 'Des de la plaça Major de Beuda, anada i tornada pel mateix camí',
				es: 'Desde la plaza Mayor de Beuda, ida y vuelta por el mismo camino'
			},
			sortida: { nom: "Plaça Major de Beuda, al costat de l'església de Sant Feliu" },
			descripcio: {
				ca: "D'excursió per Catalunya la proposa sortint de la plaça Major, amb trams de pista i corriols boscosos fins al santuari. El web dona 11,67 km, 4 h 32 min i +816 m, tot anada i tornada. Aconsella anar amb precaució als trams de més pendent per evitar relliscades.",
				es: "D'excursió per Catalunya la propone saliendo de la plaza Mayor, con tramos de pista y senderos boscosos hasta el santuario. La web da 11,67 km, 4 h 32 min y +816 m, todo ida y vuelta. Aconseja ir con precaución en los tramos de más pendiente para evitar resbalones."
			},
			fonts: [DEXCURSIO]
		}
	],
	consells: {
		ca: [
			"El desnivell es fa quasi tot de pujada des del poble: reparteix l'esforç i porta aigua de casa.",
			"Al cim pot bufar el vent, segons D'excursió per Catalunya: porta una peça d'abric, fins i tot a l'estiu.",
			'Vigila a la baixada els trams de més pendent: el terreny pot fer relliscar.',
			"Si prefereixes una circular, la tornada pel cingle de Rocapastora i el Castellot de l'Ajuntament de Beuda és un recorregut diferent del de pujada; tria'l amb llum de sobres.",
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'El desnivel se hace casi todo de subida desde el pueblo: reparte el esfuerzo y lleva agua de casa.',
			"En la cima puede soplar el viento, según D'excursió per Catalunya: lleva una prenda de abrigo, incluso en verano.",
			'Vigila en la bajada los tramos de más pendiente: el terreno puede hacer resbalar.',
			'Si prefieres una circular, la vuelta por el cingle de Rocapastora y el Castellot del Ayuntamiento de Beuda es un recorrido distinto al de subida; elígela con luz de sobra.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Mont des de Beuda?',
				resposta:
					"La circular de l'Ajuntament de Beuda i d'Itinerànnia fa 10,5 km i 4 h 25 min en total, amb 805 m de desnivell de pujada. D'excursió per Catalunya compta 4 h 32 min per a 11,67 km, anada i tornada pel mateix camí."
			},
			{
				pregunta: 'El Mont té santuari?',
				resposta:
					'Sí, el de la Mare de Déu del Mont, al cim. Segons la Viquipèdia va néixer al segle XIV a partir del monestir benedictí de Sant Llorenç del Mont.'
			},
			{
				pregunta: 'La ruta del Mont és difícil?',
				resposta:
					"L'Ajuntament de Beuda i Itinerànnia la classifiquen amb dificultat alta, per la llargada i el desnivell. Cap de les fonts descriu passos de grimpada, però sí trams amb pendent a vigilar."
			},
			{
				pregunta: 'El Mont és un cim essencial?',
				resposta:
					"Sí. A l'[Alt Empordà](/comarques/alt-emporda) comparteix la zona amb el [Bassegoda](/cims/bassegoda), també essencial."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Mont desde Beuda?',
				resposta:
					"La circular del Ayuntamiento de Beuda y de Itinerànnia tiene 10,5 km y 4 h 25 min en total, con 805 m de desnivel de subida. D'excursió per Catalunya cuenta 4 h 32 min para 11,67 km, ida y vuelta por el mismo camino."
			},
			{
				pregunta: '¿El Mont tiene santuario?',
				resposta:
					'Sí, el de la Mare de Déu del Mont, en la cima. Según la Viquipèdia nació en el siglo XIV a partir del monasterio benedictino de Sant Llorenç del Mont.'
			},
			{
				pregunta: '¿La ruta del Mont es difícil?',
				resposta:
					'El Ayuntamiento de Beuda e Itinerànnia la clasifican con dificultad alta, por la longitud y el desnivel. Ninguna de las fuentes describe pasos de trepada, pero sí tramos con pendiente que vigilar.'
			},
			{
				pregunta: '¿El Mont es una cima esencial?',
				resposta:
					'Sí. En el [Alt Empordà](/comarques/alt-emporda) comparte la zona con el [Bassegoda](/cims/bassegoda), también esencial.'
			}
		]
	},
	fonts: [VIQUIPEDIA, BEUDA, ITINERANNIA, DEXCURSIO],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
