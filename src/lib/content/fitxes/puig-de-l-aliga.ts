import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const TOTNENS = {
	nom: "Totnens: Puig de l'Àliga a Olèrdola",
	url: 'https://totnens.cat/que-fem/puig-de-laliga-a-olerdola/',
	consultat: CONSULTAT
};

const DERUTAENRUTA = {
	nom: "De ruta en ruta: el Puig de l'Àliga del Penedès",
	url: 'https://www.derutaenruta.com/ca/rutes/puig-aliga',
	consultat: CONSULTAT
};

const CIMSPAISOS = {
	nom: "Rutes pels cims dels Països Catalans: Puig de l'Àliga de Canyelles",
	url: 'https://cimsdelspaisoscatalans.blogspot.com/2014/01/puig-de-laliga-de-canyelles-4642-m.html',
	consultat: CONSULTAT
};

const TALAIA = {
	nom: "Agrupació Excursionista Talaia: pujada del pessebre al Puig de l'Àliga (2015)",
	url: 'https://ccbe.feec.cat/docs/aetalaia/Hemeroteca/GMF_Grup_Muntanya_Familia/GMF20151220_051.pdf',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-de-l-aliga',
	descripcio: {
		ca: [
			"El Puig de l'Àliga és l'extrem sud de la serra de la Cogullada, entre els termes de Canyelles i Olèrdola, i fa de frontera entre [el Garraf](/comarques/garraf) i l'Alt Penedès. És un cim allargat, pla i ample a dalt i tallat en cingles pel costat de mar. A les ressenyes apareix tant com a Puig de l'Àliga de Canyelles com del Penedès, segons de quin costat s'hi puja.",
			"Al cim hi ha un vèrtex geodèsic, una gran creu de ferro forjat i, al costat, una torre de guaita forestal. És un cim molt lligat a l'excursionisme local i familiar: grups com l'Agrupació Excursionista Talaia hi han fet la pujada del pessebre per Nadal. Als peus, a Olèrdola, hi ha el conjunt històric del castell d'Olèrdola, amb restes ibèriques, romanes i medievals, que és el punt de sortida de la pujada més fàcil.",
			"La vista és molt àmplia per a l'alçada: cap al nord, la plana del Penedès amb Montserrat al fons; cap al sud, el mar i la costa de Vilanova i la Geltrú; a l'est, el massís del Garraf, i en dies clars també Sant Llorenç del Munt i el Montseny.",
			"Es pot pujar tot l'any, però l'estiu és la pitjor època: el sol pica fort i hi ha poca ombra a la part alta. A l'hivern i a la primavera és una sortida de mig matí molt agradable."
		],
		es: [
			"El Puig de l'Àliga es el extremo sur de la sierra de la Cogullada, entre los municipios de Canyelles y Olèrdola, y hace de frontera entre [el Garraf](/comarques/garraf) y el Alt Penedès. Es una cima alargada, llana y ancha arriba y cortada en riscos por el lado del mar. En las reseñas aparece tanto como Puig de l'Àliga de Canyelles como del Penedès, según desde qué lado se sube.",
			'En la cima hay un vértice geodésico, una gran cruz de hierro forjado y, al lado, una torre de vigilancia forestal. Es una cima muy ligada al excursionismo local y familiar: grupos como la Agrupació Excursionista Talaia han hecho allí la subida del belén por Navidad. A sus pies, en Olèrdola, está el conjunto histórico del castillo de Olèrdola, con restos ibéricos, romanos y medievales, que es el punto de salida de la subida más fácil.',
			'La vista es muy amplia para la altura: hacia el norte, la llanura del Penedès con Montserrat al fondo; hacia el sur, el mar y la costa de Vilanova i la Geltrú; al este, el macizo del Garraf y, en días claros, también Sant Llorenç del Munt y el Montseny.',
			'Se puede subir todo el año, pero el verano es la peor época: el sol aprieta y hay poca sombra en la parte alta. En invierno y en primavera es una salida de media mañana muy agradable.'
		]
	},
	rutes: [
		{
			id: 'castell-d-olerdola',
			nom: {
				ca: "Des de l'aparcament del castell d'Olèrdola pel GR 92-3",
				es: 'Desde el aparcamiento del castillo de Olèrdola por el GR 92-3'
			},
			sortida: { nom: "Aparcament del castell d'Olèrdola" },
			desnivellPositiuM: 145,
			distanciaKm: 2,
			tempsMinuts: 75,
			tecnicitat: 'cap',
			descripcio: {
				ca: "La pujada familiar. Segueix les marques del GR 92-3 per pistes amples i força planeres, travessa una urbanització i acaba per un corriol fins al cim. Totnens hi dona uns 2 km i 145 m de desnivell d'anada, en 1 h 15 min a ritme de nens, i es torna pel mateix camí.",
				es: 'La subida familiar. Sigue las marcas del GR 92-3 por pistas anchas y bastante llanas, cruza una urbanización y termina por un sendero hasta la cima. Totnens da unos 2 km y 145 m de desnivel de ida, en 1 h 15 min a ritmo de niños, y se vuelve por el mismo camino.'
			},
			fonts: [TOTNENS]
		},
		{
			id: 'daltmar',
			nom: { ca: 'Des de la pista de Daltmar', es: 'Desde la pista de Daltmar' },
			sortida: { nom: 'Aparcament de la pista de Daltmar (Olèrdola)' },
			distanciaKm: 3.5,
			descripcio: {
				ca: "Accés per l'altre costat, començant per una pista i un corriol obac pel fons de la vall. De ruta en ruta la classifica com a fàcil: són 7 km anada i tornada pel mateix camí (uns 3,5 km fins al cim) i 1 h 45 min en total, amb una pujada final de pendent fort fins a l'esplanada del cim.",
				es: 'Acceso por el otro lado, empezando por una pista y un sendero umbrío por el fondo del valle. De ruta en ruta la clasifica como fácil: son 7 km ida y vuelta por el mismo camino (unos 3,5 km hasta la cima) y 1 h 45 min en total, con una subida final de pendiente fuerte hasta la explanada de la cima.'
			},
			fonts: [DERUTAENRUTA]
		}
	],
	consells: {
		ca: [
			"Evita les hores centrals dels dies d'estiu: la part alta és molt assolellada; porta prou aigua.",
			"En el pas per la urbanització, fixa't en les marques del GR pintades als pals: és on més fàcilment es perd el camí.",
			"El cingle del costat sud no té protecció: amb nens, queda't a l'esplanada del cim.",
			"Si hi vas amb nens, combina-ho amb la visita al conjunt monumental d'Olèrdola, que té entrada pròpia i horaris.",
			'La torre de guaita és una instal·lació de vigilància forestal: no t’hi enfilis.'
		],
		es: [
			'Evita las horas centrales de los días de verano: la parte alta es muy soleada; lleva agua suficiente.',
			'Al pasar por la urbanización, fíjate en las marcas del GR pintadas en los postes: es donde más fácilmente se pierde el camino.',
			'El risco del lado sur no tiene protección: con niños, quédate en la explanada de la cima.',
			'Si vas con niños, combínalo con la visita al conjunto monumental de Olèrdola, que tiene entrada propia y horarios.',
			'La torre de vigilancia es una instalación forestal: no te subas a ella.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Quant es triga a pujar al Puig de l'Àliga?",
				resposta:
					"Des de l'aparcament del castell d'Olèrdola, Totnens calcula 1 h 15 min d'anada a ritme de nens per uns 2 km i 145 m de desnivell. Des de la pista de Daltmar, De ruta en ruta hi dona 1 h 45 min anada i tornada."
			},
			{
				pregunta: "Es pot pujar al Puig de l'Àliga amb nens?",
				resposta:
					'Sí. Totnens la recomana a partir de 4 anys: és curta, per pistes i camins marcats, i només el tram final té més pendent. Cal vigilar-los a dalt, perquè el costat sud és un cingle.'
			},
			{
				pregunta: "Què hi ha al cim del Puig de l'Àliga?",
				resposta:
					'Un vèrtex geodèsic, una gran creu de ferro forjat i una torre de guaita forestal. Per Nadal, hi ha entitats excursionistes que hi pugen el pessebre.'
			},
			{
				pregunta: "El Puig de l'Àliga és un cim essencial?",
				resposta:
					'Sí, és un dels [cims essencials](/cims-essencials) del repte. A prop, també a Olèrdola, hi ha [la Penya del Papiol](/cims/penya-del-papiol), un altre cim essencial.'
			}
		],
		es: [
			{
				pregunta: "¿Cuánto se tarda en subir al Puig de l'Àliga?",
				resposta:
					'Desde el aparcamiento del castillo de Olèrdola, Totnens calcula 1 h 15 min de ida a ritmo de niños para unos 2 km y 145 m de desnivel. Desde la pista de Daltmar, De ruta en ruta da 1 h 45 min ida y vuelta.'
			},
			{
				pregunta: "¿Se puede subir al Puig de l'Àliga con niños?",
				resposta:
					'Sí. Totnens la recomienda a partir de 4 años: es corta, por pistas y caminos marcados, y solo el tramo final tiene más pendiente. Hay que vigilarlos arriba, porque el lado sur es un risco.'
			},
			{
				pregunta: "¿Qué hay en la cima del Puig de l'Àliga?",
				resposta:
					'Un vértice geodésico, una gran cruz de hierro forjado y una torre de vigilancia forestal. Por Navidad, hay entidades excursionistas que suben el belén.'
			},
			{
				pregunta: "¿El Puig de l'Àliga es una cima esencial?",
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) del reto. Cerca, también en Olèrdola, está [la Penya del Papiol](/cims/penya-del-papiol), otra cima esencial.'
			}
		]
	},
	fonts: [TOTNENS, DERUTAENRUTA, CIMSPAISOS, TALAIA],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
