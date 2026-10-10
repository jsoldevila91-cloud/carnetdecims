import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA_SERRA = {
	nom: "Viquipèdia: serra d'Aubenç",
	url: "https://ca.wikipedia.org/wiki/Serra_d'Auben%C3%A7",
	consultat: CONSULTAT
};

const FEMTURISME_AUBAS = {
	nom: "Femturisme: Lo Coscollet des d'Aubàs (serra d'Aubenç)",
	url: 'https://www.femturisme.cat/en/routes/the-coscollet-from-aubas',
	consultat: CONSULTAT
};

const ENGARRISTA = {
	nom: 'Engarrista: Coscollet (1.610 m)',
	url: 'https://www.engarrista.com/node/924',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS_HONORAT = {
	nom: 'Rutes Pirineus: rutes a la serra de Sant Honorat',
	url: 'https://www.rutespirineus.cat/rutes/serra-de-sant-honorat',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'lo-coscollet',
	descripcio: {
		ca: [
			"Lo Coscollet, també conegut com la Torre d'Aubenç, és el punt més alt de la serra d'Aubenç, una carena calcària del Prepirineu que s'alça al nord d'Oliana, a la dreta del Segre. El cim és al terme de Peramola, a [l'Alt Urgell](/comarques/alt-urgell), tocant a Coll de Nargó. El vessant sud està trencat per cingleres i, segons Femturisme, a sota del cim el penya-segat cau uns 200 metres cap al pantà d'Oliana.",
			"La serra és un espai de transició. El vessant sud és mediterrani; el nord, més humit, té influències eurosiberianes, amb pins, faigs amb boix i alguns avets escadussers. Segons la Viquipèdia, hi viu un conjunt notable d'aus rapinyaires, com el voltor comú, el trencalòs i l'aufrany, i hi ha una bona part de bosc (al voltant del 55 % de la superfície). La zona va entrar al PEIN el 1992 i després va passar a formar part de la xarxa Natura 2000.",
			"Des de dalt es dominen la vall del Segre i els embassaments d'Oliana i de Rialb; en dies clars s'hi veuen bona part del Pirineu i del Prepirineu, i l'autor de la ressenya de Femturisme hi va arribar a veure, un dia d'hivern, des dels Ports de Tortosa fins a la Pica d'Estats i des del Montseny fins a la serra de Guara. Al cim, a més del vèrtex, hi ha una caseta dels bombers per vigilar incendis. La Viquipèdia avisa que les cornises de la serra poden desprendre blocs de roca: no t'atansis al marge.",
			"El camí habitual surt d'Aubàs, un nucli dispers de l'Alt Urgell, i va gran part per l'obaga, entre pins i boix, de manera que es pot fer gairebé tot l'any. A l'hivern, als trams assolellats del pi roig, apareixen els nius de processionària."
		],
		es: [
			'Lo Coscollet, también conocido como Torre d’Aubenç, es el punto más alto de la serra d’Aubenç, una cresta caliza del Prepirineo que se levanta al norte de Oliana, en la margen derecha del Segre. La cima está en el término de Peramola, en [el Alt Urgell](/comarques/alt-urgell), tocando con Coll de Nargó. La vertiente sur está cortada por cantiles y, según Femturisme, bajo la cima el acantilado cae unos 200 metros hacia el pantano de Oliana.',
			'La sierra es un espacio de transición. La vertiente sur es mediterránea; la norte, más húmeda, tiene influencias eurosiberianas, con pinos, hayas con boj y algunos abetos dispersos. Según la Viquipèdia, vive allí un conjunto notable de aves rapaces, como el buitre leonado, el quebrantahuesos y el alimoche, y hay una buena parte de bosque (alrededor del 55 % de la superficie). La zona entró en el PEIN en 1992 y después pasó a formar parte de la red Natura 2000.',
			'Desde arriba se dominan el valle del Segre y los embalses de Oliana y de Rialb; en días claros se ve buena parte del Pirineo y del Prepirineo, y el autor de la reseña de Femturisme llegó a ver, un día de invierno, desde los Ports de Tortosa hasta la Pica d’Estats y desde el Montseny hasta la sierra de Guara. En la cima, además del vértice, hay una caseta de los bomberos para vigilar incendios. La Viquipèdia avisa de que las cornisas de la sierra pueden desprender bloques de roca: no te acerques al borde.',
			'El camino habitual sale de Aubàs, un núcleo disperso del Alt Urgell, y va en gran parte por la umbría, entre pinos y boj, de modo que se puede hacer casi todo el año. En invierno, en los tramos soleados de pino silvestre, aparecen los nidos de procesionaria.'
		]
	},
	rutes: [
		{
			id: 'aubas',
			nom: { ca: "Des d'Aubàs", es: 'Desde Aubàs' },
			sortida: { nom: 'Aubàs (Coll de Nargó / Peramola)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Del nucli d'Aubàs s'agafa un camí a l'esquerra, de pendent constant i poc fressat, que primer segueix una mànega d'aigua i passa per sota d'una línia elèctrica. Més amunt entra en un bosc de pins i boix, arriba a una pista i, passada l'obaga del bosc de Nargó, puja a la carena per un corriol amb fites. Està senyalitzat amb marques grogues i blaves quasi fins al cim. Es torna pel mateix camí.",
				es: 'Del núcleo de Aubàs se toma un camino a la izquierda, de pendiente constante y poco hollado, que primero sigue una manguera de agua y pasa bajo un tendido eléctrico. Más arriba entra en un bosque de pinos y boj, llega a una pista y, pasada la umbría del bosque de Nargó, sube a la cresta por una senda con hitos. Está señalizado con marcas amarillas y azules casi hasta la cima. Se vuelve por el mismo camino.'
			},
			fonts: [FEMTURISME_AUBAS]
		},
		{
			id: 'mas-torrent',
			nom: {
				ca: 'Circular des de Mas Torrent (Peramola)',
				es: 'Circular desde Mas Torrent (Peramola)'
			},
			sortida: { nom: 'Mas Torrent (Peramola)' },
			distanciaKm: 10.1,
			tecnicitat: 'grimpada',
			descripcio: {
				ca: "Ruta llarga pel vessant sud: passa per la Roca del Corb, amb una masia troglodítica, i remunta la canal de la Jaça, molt dreta i amb un tram aeri equipat amb cordes fixes, fins al peu de la cinglera i el cim, a 10,1 km de la sortida. La baixada passa per la casa d'Aubenç, abandonada, i torna per Cortiuda. Engarrista la dona com a circular de 22 km, 1.300 m de desnivell i 7 h 20 min comptant parades.",
				es: 'Ruta larga por la vertiente sur: pasa por la Roca del Corb, con una masía troglodita, y remonta la canal de la Jaça, muy empinada y con un tramo aéreo equipado con cuerdas fijas, hasta el pie del cantil y la cima, a 10,1 km de la salida. La bajada pasa por la casa de Aubenç, abandonada, y vuelve por Cortiuda. Engarrista la da como circular de 22 km, 1.300 m de desnivel y 7 h 20 min contando paradas.'
			},
			fonts: [ENGARRISTA]
		}
	],
	consells: {
		ca: [
			'A Aubàs, Femturisme recomana aparcar per sobre del nucli, a la pista forestal, i no dins del veïnat.',
			"El camí d'Aubàs és poc fressat: segueix les marques grogues i blaves i les fites, sobretot a l'encreuament on la ruta gira a la dreta i en arribar a la carena.",
			"Al marge de la cinglera sobre el pantà d'Oliana hi ha risc de despreniments: no t'hi acostis i no deixis que els nens s'hi acostin.",
			"A l'hivern, vigila les erugues processionàries dels pins als trams assolellats, perilloses per als gossos.",
			"Per la canal de la Jaça (vessant sud) cal portar experiència amb cordes fixes; si hi ha pluja o roques humides, és millor triar la via d'Aubàs."
		],
		es: [
			'En Aubàs, Femturisme recomienda aparcar por encima del núcleo, en la pista forestal, y no dentro del vecindario.',
			'El camino de Aubàs está poco hollado: sigue las marcas amarillas y azules y los hitos, sobre todo en el cruce donde la ruta gira a la derecha y al llegar a la cresta.',
			'En el borde del cantil sobre el pantano de Oliana hay riesgo de desprendimientos: no te acerques ni dejes que lo hagan los niños.',
			'En invierno, ten cuidado con las orugas procesionarias de los pinos en los tramos soleados, peligrosas para los perros.',
			'Por la canal de la Jaça (vertiente sur) hace falta experiencia con cuerdas fijas; si hay lluvia o rocas húmedas, es mejor elegir la vía de Aubàs.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Per on és més fàcil pujar al Coscollet?',
				resposta:
					'Per Aubàs: Femturisme descriu un camí de pendent constant, amb marques grogues i blaves i pista de carena fins al vèrtex, sense esmentar cap pas tècnic. La via del sud, per la canal de la Jaça, és molt més llarga i té un tram amb cordes fixes.'
			},
			{
				pregunta: 'És una excursió llarga?',
				resposta:
					'Per Aubàs és la pujada més curta, però Femturisme no en dona ni distància ni temps. La circular per la canal de la Jaça és una jornada sencera: Engarrista arriba al cim als 10,1 km i tanca la volta en 22 km i 1.300 m de desnivell, amb 7 h 20 min comptant parades.'
			},
			{
				pregunta: 'Què es veu des del cim?',
				resposta:
					"A tocar, la vall del Segre i els embassaments d'Oliana i Rialb; al voltant, el Prepirineu, i al fons, el Pirineu. Un dia clar d'hivern, l'autor de la ressenya de Femturisme hi va identificar el Montseny, la Pica d'Estats, la serra de Guara i els Ports de Tortosa."
			},
			{
				pregunta: 'El Coscollet compta com a cim essencial?',
				resposta:
					"Sí. És un dels nou essencials de l'Alt Urgell i el tercer més baix, per sobre de [Sant Honorat](/cims/sant-honorat) i de Santa Fe, però només 11 metres per sota del [Cogulló de Turp](/cims/cogullo-de-turp), amb qui comparteix la zona."
			}
		],
		es: [
			{
				pregunta: '¿Por dónde es más fácil subir al Coscollet?',
				resposta:
					'Por Aubàs: Femturisme describe un camino de pendiente constante, con marcas amarillas y azules y pista de cresta hasta el vértice, sin mencionar ningún paso técnico. La vía del sur, por la canal de la Jaça, es mucho más larga y tiene un tramo con cuerdas fijas.'
			},
			{
				pregunta: '¿Es una excursión larga?',
				resposta:
					'Por Aubàs es la subida más corta, pero Femturisme no da ni distancia ni tiempo. La circular por la canal de la Jaça es una jornada entera: Engarrista llega a la cima a los 10,1 km y cierra la vuelta en 22 km y 1.300 m de desnivel, con 7 h 20 min contando paradas.'
			},
			{
				pregunta: '¿Qué se ve desde la cima?',
				resposta:
					'Al lado, el valle del Segre y los embalses de Oliana y Rialb; alrededor, el Prepirineo, y al fondo, el Pirineo. Un día claro de invierno, el autor de la reseña de Femturisme identificó el Montseny, la Pica d’Estats, la sierra de Guara y los Ports de Tortosa.'
			},
			{
				pregunta: '¿El Coscollet cuenta como cima esencial?',
				resposta:
					'Sí. Es una de las nueve esenciales del Alt Urgell y la tercera más baja, por encima de [Sant Honorat](/cims/sant-honorat) y de Santa Fe, pero solo 11 metros por debajo del [Cogulló de Turp](/cims/cogullo-de-turp), con quien comparte zona.'
			}
		]
	},
	fonts: [VIQUIPEDIA_SERRA, FEMTURISME_AUBAS, ENGARRISTA, RUTES_PIRINEUS_HONORAT],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
