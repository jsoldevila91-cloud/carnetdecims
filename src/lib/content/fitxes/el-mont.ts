import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

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
	nom: "D'excursió per Catalunya: Mare de Déu del Mont des de Beuda",
	url: 'https://dexcursio.net/mare-de-deu-del-mont/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'el-mont',
	descripcio: {
		ca: [
			"El Mont, o la Mare de Déu del Mont pel santuari que té al capdamunt, és el punt més alt de la serra del Mont, el vèrtex sud-oriental de l'Alta Garrotxa. Administrativament, el cim pertany a Albanyà ([Alt Empordà](/comarques/alt-emporda)), dins de l'antic municipi de Bassegoda, i queda just al nord de Beuda, que ja és de la Garrotxa. Segons la Viquipèdia, la serra separa la conca de la Muga de la del Fluvià. El cim essencial més proper és [el Bassegoda](/cims/bassegoda).",
			"A l'edat mitjana se'n deia muntanya de Sant Llorenç, pel monestir benedictí de Sant Llorenç del Mont, o de Sous, les ruïnes del qual encara es troben a mitja pujada. D'aquell monestir en va sortir, al segle XIV, el santuari; l'Ajuntament de Beuda en data l'església, de romànic tardà, a principis d'aquell segle. Jacint Verdaguer hi va fer estada el 1884 i, segons la mateixa font, s'hi conserva la cambra on va acabar el Canigó. La Viquipèdia recull també que, a finals del segle XVIII, el cim va ser un dels vèrtexs de la triangulació del meridià de Dunkerque a Barcelona, la que va servir per definir el metre.",
			"El panorama és el d'un cim avançat sobre la plana. La Viquipèdia hi enumera la Garrotxa, la plana de l'Alt Empordà, el Pla de l'Estany i el Gironès fins a la ciutat de Girona, les Guilleries, el Montseny i el Pirineu oriental, amb el Canigó en primer terme.",
			"Fins al santuari hi arriba una carretera, amb aparcament a dalt, de manera que no és un cim solitari. Qui hi puja a peu des de Beuda fa més de 800 m de desnivell i creua aquesta carretera diverses vegades. S'hi pot anar tot l'any; D'excursió per Catalunya recomana portar roba d'abric fins i tot a l'estiu, pel vent del cim."
		],
		es: [
			'El Mont, o la Mare de Déu del Mont por el santuario que tiene en lo alto, es el punto culminante de la sierra del Mont, el vértice suroriental de la Alta Garrotxa. Administrativamente, la cima pertenece a Albanyà ([Alt Empordà](/comarques/alt-emporda)), dentro del antiguo municipio de Bassegoda, y queda justo al norte de Beuda, que ya es de la Garrotxa. Según la Viquipèdia, la sierra separa la cuenca de la Muga de la del Fluvià. La cima esencial más cercana es [el Bassegoda](/cims/bassegoda).',
			'En la Edad Media se llamaba montaña de Sant Llorenç, por el monasterio benedictino de Sant Llorenç del Mont, o de Sous, cuyas ruinas aún se encuentran a media subida. De aquel monasterio salió, en el siglo XIV, el santuario; el Ayuntamiento de Beuda data su iglesia, de románico tardío, a principios de ese siglo. Jacint Verdaguer se alojó allí en 1884 y, según la misma fuente, se conserva la habitación donde acabó el Canigó. La Viquipèdia recoge también que, a finales del siglo XVIII, la cima fue uno de los vértices de la triangulación del meridiano de Dunkerque a Barcelona, la que sirvió para definir el metro.',
			"El panorama es el de una cima adelantada sobre la llanura. La Viquipèdia enumera la Garrotxa, la llanura del Alt Empordà, el Pla de l'Estany y el Gironès hasta la ciudad de Girona, las Guilleries, el Montseny y el Pirineo oriental, con el Canigó en primer término.",
			"Hasta el santuario llega una carretera, con aparcamiento arriba, así que no es una cima solitaria. Quien sube a pie desde Beuda hace más de 800 m de desnivel y cruza esa carretera varias veces. Se puede ir todo el año; D'excursió per Catalunya recomienda llevar ropa de abrigo incluso en verano, por el viento de la cima."
		]
	},
	rutes: [
		{
			id: 'beuda-circular',
			nom: {
				ca: 'Des de Beuda pel monestir de Sant Llorenç de Sous',
				es: 'Desde Beuda por el monasterio de Sant Llorenç de Sous'
			},
			sortida: { nom: "Beuda, encreuament G155 d'Itinerànnia" },
			desnivellPositiuM: 805,
			descripcio: {
				ca: "És l'itinerari que publiquen l'Ajuntament de Beuda i Itinerànnia: una circular de 10,5 km, 805 m de desnivell acumulat de pujada i 4 h 25 min, de dificultat alta. Surt per la carretera que passa darrere l'església, agafa el camí de la Salve Regina fins a la font de Roca Pastora i el monestir de Sant Llorenç de Sous, i continua amunt, seguint marques grogues i alternant corriol i carretera, fins a l'aparcament i el santuari. La tornada va pel cingle de Rocapastora, el turó de les Grives, el Castellot i la Font Fresca.",
				es: 'Es el itinerario que publican el Ayuntamiento de Beuda e Itinerànnia: una circular de 10,5 km, 805 m de desnivel acumulado de subida y 4 h 25 min, de dificultad alta. Sale por la carretera que pasa detrás de la iglesia, toma el camino de la Salve Regina hasta la fuente de Roca Pastora y el monasterio de Sant Llorenç de Sous, y continúa hacia arriba, siguiendo marcas amarillas y alternando sendero y carretera, hasta el aparcamiento y el santuario. La vuelta va por el cingle de Rocapastora, el turó de les Grives, el Castellot y la Font Fresca.'
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
				ca: "D'excursió per Catalunya fa la mateixa pujada però torna per on ha vingut: 11,67 km, +816 m i 4 h 32 min en total, de dificultat moderada. Explica que es pot estalviar el primer tram de carretera aparcant al pla del Bosc, que passat Can Oliveres el corriol va marcat com a PR, amb pintura blanca i groga, i que a la baixada cal precaució als trams de més pendent.",
				es: "D'excursió per Catalunya hace la misma subida pero vuelve por donde ha venido: 11,67 km, +816 m y 4 h 32 min en total, de dificultad moderada. Explica que se puede ahorrar el primer tramo de carretera aparcando en el pla del Bosc, que pasado Can Oliveres el sendero va marcado como PR, con pintura blanca y amarilla, y que en la bajada hace falta precaución en los tramos de más pendiente."
			},
			fonts: [DEXCURSIO]
		}
	],
	consells: {
		ca: [
			"El camí i la carretera del santuari es creuen diverses vegades, i en algun tram comparteixen l'asfalt: camina per la vora i mira bé abans de travessar.",
			'Les ruïnes de Sant Llorenç de Sous són a peu de camí i trenquen la pujada pel mig: un bon lloc per fer la parada.',
			"La tornada pel Castellot és un camí diferent del de pujada, amb diversos encreuaments d'Itinerànnia: porta'n el mapa o el track.",
			"A dalt bufa vent sovint, segons D'excursió per Catalunya: una capa tallavent no fa nosa ni a l'estiu.",
			'Baixa sense pressa els trams drets del corriol, on és fàcil relliscar.'
		],
		es: [
			'El camino y la carretera del santuario se cruzan varias veces, y en algún tramo comparten el asfalto: camina por el borde y mira bien antes de cruzar.',
			'Las ruinas de Sant Llorenç de Sous están a pie de camino y parten la subida por la mitad: un buen sitio para hacer la parada.',
			'La vuelta por el Castellot es un camino distinto del de subida, con varios cruces de Itinerànnia: lleva el mapa o el track.',
			"Arriba sopla viento a menudo, según D'excursió per Catalunya: un cortavientos no estorba ni en verano.",
			'Baja sin prisa los tramos empinados del sendero, donde es fácil resbalar.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Mont des de Beuda?',
				resposta:
					"La circular de l'Ajuntament de Beuda fa 10,5 km i 4 h 25 min en total, amb 805 m de desnivell de pujada. Anant i tornant pel mateix camí, D'excursió per Catalunya compta 11,67 km i 4 h 32 min."
			},
			{
				pregunta: 'Es pot pujar al Mont amb cotxe?',
				resposta:
					"Sí: una carretera asfaltada arriba fins a l'aparcament del santuari, i l'itinerari a peu la creua. Si el que vols és fer el cim caminant, la sortida habitual és Beuda."
			},
			{
				pregunta: 'La pujada al Mont és difícil?',
				resposta:
					"És llarga més que no pas complicada: l'Ajuntament de Beuda i Itinerànnia la valoren de dificultat alta, i D'excursió per Catalunya, de moderada. Va per carretera, pista i corriols marcats."
			},
			{
				pregunta: 'Què hi va fer Verdaguer, al Mont?',
				resposta:
					"Hi va passar una temporada el 1884, segons la Viquipèdia, i va comparar la serra amb un camell geperut que baixa del Pirineu. L'Ajuntament de Beuda explica que al santuari es conserva la cambra on va acabar el Canigó."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Mont desde Beuda?',
				resposta:
					"La circular del Ayuntamiento de Beuda tiene 10,5 km y 4 h 25 min en total, con 805 m de desnivel de subida. Yendo y volviendo por el mismo camino, D'excursió per Catalunya cuenta 11,67 km y 4 h 32 min."
			},
			{
				pregunta: '¿Se puede subir al Mont en coche?',
				resposta:
					'Sí: una carretera asfaltada llega hasta el aparcamiento del santuario, y el itinerario a pie la cruza. Si lo que quieres es hacer la cima caminando, la salida habitual es Beuda.'
			},
			{
				pregunta: '¿La subida al Mont es difícil?',
				resposta:
					"Es más larga que complicada: el Ayuntamiento de Beuda e Itinerànnia la valoran de dificultad alta, y D'excursió per Catalunya, de moderada. Va por carretera, pista y senderos marcados."
			},
			{
				pregunta: '¿Qué hizo Verdaguer en el Mont?',
				resposta:
					'Pasó allí una temporada en 1884, según la Viquipèdia, y comparó la sierra con un camello jorobado que baja del Pirineo. El Ayuntamiento de Beuda explica que en el santuario se conserva la habitación donde acabó el Canigó.'
			}
		]
	},
	fonts: [VIQUIPEDIA, BEUDA, ITINERANNIA, DEXCURSIO],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
