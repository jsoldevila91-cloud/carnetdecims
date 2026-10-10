import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Montsent',
	url: 'https://ca.wikipedia.org/wiki/Montsent_de_Pallars',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Montsent de Pallars',
	url: 'https://reptesmuntanyencs.cat/montsent-de-pallars/',
	consultat: CONSULTAT
};

const REPTES_COMETA = {
	nom: 'Reptes Muntanyencs: Tuc de la Cometa (Llesuí)',
	url: 'https://reptesmuntanyencs.cat/tuc-de-la-cometa/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'montsent-de-pallars',
	descripcio: {
		ca: [
			"El Montsent de Pallars s'alça a l'extrem nord del [Pallars Jussà](/comarques/pallars-jussa) i a cavall del Pallars Sobirà, als termes de la Torre de Cabdella i de Sort (l'antic terme de Llessui). És una muntanya del Pirineu axial que separa la vall del Flamisell, a la Vall Fosca, de la capçalera del riu de Berasti, a la Vall d'Àssua, i forma part de la corona de cims que delimita la Vall Fosca. Al sud continua per la serra de la Mainera, que enllaça amb la serra d'Altars pel coll del Triador. La roca és pòrfir, amb marbre.",
			"El nom del mapa és Montsent; en els cercles excursionistes també se'l coneix com a Montsent de Pallars o Montseny de Pallars, per distingir-lo del Montseny. Segons la Viquipèdia, té 245 m de prominència i 3,8 km d'aïllament, i al cim hi ha un vèrtex geodèsic. A la seva ressenya del [Tuc de la Cometa](/cims/tuc-de-la-cometa), un altre cim essencial de la comarca, Reptes Muntanyencs explica que tots dos són al mateix cordal i que es poden assolir en una sola caminada.",
			"Reptes Muntanyencs fa la pujada en una volta circular que surt d'un revolt de la pista de Llessui a Espot, a uns 13,5 km. Travessa el riu de la Mainera per una palanca de fusta, passa per l'Orri Vell i continua sense camí fins a la collada de la Coma d'Espòs, d'on segueix la carena del Montorroio fins al Montsent. L'autor la va fer l'1 d'agost, amb vent a la carena i núvols que s'anaven formant. Des del cim l'horitzó és molt ampli, i durant el recorregut es veuen els estanys de la Mainera, l'estany Gento, orris i un ramat d'isards.",
			"És una sortida d'alta muntanya, amb trams de tartera i pedra i poques fites a la part alta. Es fa sobretot a l'estiu i a la tardor, mentre la pista d'accés és practicable. No hi ha refugi al recorregut; de la collada es veu el de l'estany Gento."
		],
		es: [
			'El Montsent de Pallars se alza en el extremo norte del [Pallars Jussà](/comarques/pallars-jussa) y a caballo del Pallars Sobirà, en los términos de La Torre de Cabdella y de Sort (el antiguo término de Llessui). Es una montaña del Pirineo axial que separa el valle del Flamisell, en la Vall Fosca, de la cabecera del río de Berasti, en la Vall d’Àssua, y forma parte de la corona de cimas que delimita la Vall Fosca. Al sur continúa por la sierra de la Mainera, que enlaza con la sierra de Altars por el coll del Triador. La roca es pórfido, con mármol.',
			'El nombre del mapa es Montsent; en los círculos excursionistas también se le conoce como Montsent de Pallars o Montseny de Pallars, para distinguirlo del Montseny. Según la Viquipèdia, tiene 245 m de prominencia y 3,8 km de aislamiento, y en la cima hay un vértice geodésico. En su reseña del [Tuc de la Cometa](/cims/tuc-de-la-cometa), otra cima esencial de la comarca, Reptes Muntanyencs explica que los dos están en el mismo cordal y que se pueden alcanzar en una sola caminata.',
			'Reptes Muntanyencs hace la subida en una vuelta circular que sale de una curva de la pista de Llessui a Espot, a unos 13,5 km. Cruza el río de la Mainera por una pasarela de madera, pasa por el Orri Vell y sigue sin camino hasta la collada de la Coma d’Espòs, desde donde recorre la cresta del Montorroio hasta el Montsent. El autor la hizo el 1 de agosto, con viento en la cresta y nubes que se iban formando. Desde la cima el horizonte es muy amplio, y durante el recorrido se ven los estanys de la Mainera, el estany Gento, orris y una manada de rebecos.',
			'Es una salida de alta montaña, con tramos de pedrera y piedra y pocos hitos en la parte alta. Se hace sobre todo en verano y otoño, mientras la pista de acceso es practicable. No hay refugio en el recorrido; desde el collado se ve el del estany Gento.'
		]
	},
	rutes: [
		{
			id: 'pista-de-llessui',
			nom: {
				ca: 'Circular des de la pista de Llessui pel Montorroio',
				es: 'Circular desde la pista de Llessui por el Montorroio'
			},
			sortida: { nom: 'Revolt de la pista de Llessui a Espot, a uns 13,5 km (Sort)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Segons Reptes Muntanyencs, a l'inici hi ha un cartell indicador; també es pot deixar el cotxe al pas de la Mainera (15 vehicles), 2,2 km pista enllà, i fer la ruta al revés. La fitxa indica 4x4 per la pista de terra, tot i que l'autor hi va veure també vehicles alts i furgonetes. Del pas de la Mainera surten les estaques de cap groc de l'itinerari dels Orris; passada la palanca sobre el riu, es camina sense camí, entre pedra i tartera, fins a la collada i la carena del Montorroio, amb un descens curt per una canal de tartera marcada amb fites. La volta fa 14,1 km i 1.098 m de desnivell, amb 4 h 37 min de marxa i uns 3 h 45 min aturades incloses fins al cim.",
				es: 'Según Reptes Muntanyencs, al inicio hay un cartel indicador; también se puede dejar el coche en el paso de la Mainera (15 vehículos), a 2,2 km de pista, y hacer la ruta al revés. La ficha indica 4x4 por la pista de tierra, aunque el autor vio también vehículos altos y furgonetas. Del pas de la Mainera salen las estacas de cabeza amarilla del itinerario de los Orris; pasada la pasarela sobre el río, se camina sin camino, entre piedra y pedrera, hasta el collado y la cresta del Montorroio, con un descenso corto por una canal de pedrera marcada con hitos. La vuelta hace 14,1 km y 1.098 m de desnivel, con 4 h 37 min de marcha y unas 3 h 45 min con paradas hasta la cima.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"La pista de terra de Llessui a Espot és llarga: informa't del seu estat abans de sortir i, sense un vehicle alt, compta que potser hauràs de caminar més.",
			"Passat l'Orri Vell, la ruta no està senyalitzada i a la part alta hi ha poques fites: porta el track al mòbil o al GPS.",
			'Si comences al pas de la Mainera, on hi ha un aparcament per a uns quinze vehicles, Reptes Muntanyencs proposa fer la volta en sentit contrari.',
			"Reptes Muntanyencs va fer la ruta amb núvols i vent: porta roba d'abric i protecció de vent fins i tot a l'agost.",
			"Des de la carena es veuen els estanys de la Mainera i l'estany Gento, i no és estrany trobar-hi isards: observa'ls de lluny."
		],
		es: [
			'La pista de tierra de Llessui a Espot es larga: infórmate de su estado antes de salir y, sin un vehículo alto, cuenta con que quizá tengas que caminar más.',
			'Pasado el Orri Vell, la ruta no está señalizada y en la parte alta hay pocos hitos: lleva el track en el móvil o el GPS.',
			'Si empiezas en el pas de la Mainera, donde hay un aparcamiento para unos quince vehículos, Reptes Muntanyencs propone hacer la vuelta en sentido contrario.',
			'Reptes Muntanyencs hizo la ruta con nubes y viento: lleva ropa de abrigo y protección de viento incluso en agosto.',
			'Desde la cresta se ven los estanys de la Mainera y el estany Gento, y no es raro encontrar rebecos: obsérvalos de lejos.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Montsent de Pallars?',
				resposta:
					'Reptes Muntanyencs hi arriba en uns 3 h 45 min des del revolt de la pista de Llessui, aturades incloses. La volta circular sencera té 14,1 km i 1.098 m de desnivell, amb 4 h 37 min de marxa.'
			},
			{
				pregunta: 'Per què es diu Montsent de Pallars?',
				resposta:
					"El topònim és Montsent. En els cercles excursionistes s'hi afegeix «de Pallars», o se'n diu Montseny de Pallars, per distingir-lo del Montseny, segons la Viquipèdia."
			},
			{
				pregunta: 'Cal 4x4 per arribar a la sortida?',
				resposta:
					"La fitxa de Reptes Muntanyencs indica 4x4 per la pista de terra de Llessui a Espot, però l'autor explica que també hi pugen vehicles alts i furgonetes. Informa't de l'estat de la pista abans de sortir."
			},
			{
				pregunta: 'El Montsent de Pallars compta com a cim essencial?',
				resposta:
					'Sí, és un dels set [cims essencials](/cims-essencials) del Pallars Jussà i el segon més alt, amb 2.883 m, després del [Pic de Peguera](/cims/pic-de-peguera) (2.983 m).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Montsent de Pallars?',
				resposta:
					'Reptes Muntanyencs llega en unas 3 h 45 min desde la curva de la pista de Llessui, paradas incluidas. La vuelta circular entera tiene 14,1 km y 1.098 m de desnivel, con 4 h 37 min de marcha.'
			},
			{
				pregunta: '¿Por qué se llama Montsent de Pallars?',
				resposta:
					'El topónimo es Montsent. En los círculos excursionistas se le añade «de Pallars», o se le llama Montseny de Pallars, para distinguirlo del Montseny, según la Viquipèdia.'
			},
			{
				pregunta: '¿Hace falta 4x4 para llegar a la salida?',
				resposta:
					'La ficha de Reptes Muntanyencs indica 4x4 para la pista de tierra de Llessui a Espot, pero el autor explica que también suben vehículos altos y furgonetas. Infórmate del estado de la pista antes de salir.'
			},
			{
				pregunta: '¿El Montsent de Pallars cuenta como cima esencial?',
				resposta:
					'Sí, es una de las siete [cimas esenciales](/cims-essencials) del Pallars Jussà y la segunda más alta, con 2.883 m, después del [Pic de Peguera](/cims/pic-de-peguera) (2.983 m).'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, REPTES_COMETA],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
