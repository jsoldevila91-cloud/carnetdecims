import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puig de Sant Miquel (Rubió)',
	url: 'https://ca.wikipedia.org/wiki/Puig_de_Sant_Miquel_(Rubi%C3%B3)',
	consultat: CONSULTAT
};

const VIQUIPEDIA_ARDESA = {
	nom: "Viquipèdia: Sant Pere d'Ardesa",
	url: 'https://ca.wikipedia.org/wiki/Sant_Pere_d%27Ardesa',
	consultat: CONSULTAT
};

const ANOIA_TURISME = {
	nom: 'Anoia Turisme: Puig de Sant Miquel, el vèrtex de la serra de Rubió',
	url: 'https://anoiaturisme.cat/anoia/puig-de-sant-miquel-el-vertex-de-la-serra-de-rubio',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-de-sant-miquel',
	descripcio: {
		ca: [
			"El Puig de Sant Miquel és el cim de la serra de Rubió, o de les Maioles, com en diu la Viquipèdia, al terme de Rubió, a l'[Anoia](/comarques/anoia). És una muntanya modesta, de les que es pugen en un passeig. Els altres dos cims essencials de la comarca, [el Montgròs](/cims/montgros) i [Sant Jeroni](/cims/sant-jeroni), són a Montserrat.",
			"El que té d'especial és al peu, no pas a dalt. A la falda sud-oest hi ha l'església romànica de Sant Pere d'Ardesa, d'una sola nau i amb un absis decorat amb lesenes i arcuacions llombardes. La Viquipèdia en documenta la primera notícia el 1082 i la consagració el 1192; va passar molts anys amb el sostre esfondrat, fins que es va restaurar el 2009. El castell d'Ardesa, citat des del 989, se suposa que s'aixecava entre l'església i el cim, però no en queda res.",
			"La vista és la raó per pujar-hi. Anoia Turisme la descriu punt per punt: al sud, la plana de l'Anoia, amb Igualada, i les serres d'Ancosa, Queralt, Miralles i el Tallat; a ponent, les planes de la Segarra i de l'Urgell; al nord, la serra de Rubió amb els seus molins de vent, la de Pinós i, més enllà, el Montsec i uns Pirineus que costen de veure; a llevant, el pla de Bages, el Montseny, Sant Llorenç del Munt i Montserrat.",
			'Al cim hi ha un vèrtex geodèsic i, segons la Viquipèdia, un pessebre. Amb un panorama tan llarg, val la pena triar un dia clar.'
		],
		es: [
			'El Puig de Sant Miquel es la cima de la sierra de Rubió, o de les Maioles, como la llama la Viquipèdia, en el término de Rubió, en la [Anoia](/comarques/anoia). Es una montaña modesta, de las que se suben en un paseo. Las otras dos cimas esenciales de la comarca, [el Montgròs](/cims/montgros) y [Sant Jeroni](/cims/sant-jeroni), están en Montserrat.',
			"Lo que tiene de especial está al pie, no arriba. En la falda suroeste está la iglesia románica de Sant Pere d'Ardesa, de una sola nave y con un ábside decorado con lesenas y arquillos lombardos. La Viquipèdia documenta su primera noticia en 1082 y la consagración en 1192; pasó muchos años con el techo hundido, hasta que se restauró en 2009. El castillo de Ardesa, citado desde 989, se supone que se levantaba entre la iglesia y la cima, pero no queda nada.",
			'La vista es la razón para subir. Anoia Turisme la describe punto por punto: al sur, la llanura de la Anoia, con Igualada, y las sierras de Ancosa, Queralt, Miralles y el Tallat; a poniente, las llanuras de la Segarra y del Urgell; al norte, la sierra de Rubió con sus molinos de viento, la de Pinós y, más allá, el Montsec y unos Pirineos que cuesta ver; a levante, el pla de Bages, el Montseny, Sant Llorenç del Munt y Montserrat.',
			'En la cima hay un vértice geodésico y, según la Viquipèdia, un belén. Con un panorama tan largo, vale la pena elegir un día claro.'
		]
	},
	rutes: [
		{
			id: 'sant-pere-d-ardesa',
			nom: {
				ca: "Per Sant Pere d'Ardesa",
				es: "Por Sant Pere d'Ardesa"
			},
			sortida: { nom: 'Trencall de Can Tudó, al km 2 de la BV-1037 (Rubió)' },
			descripcio: {
				ca: "Anoia Turisme la presenta com una ruta senzilla i sense gaire desnivell acumulat, amb bones vistes tot el trajecte: un camí fàcil i còmode porta fins als peus de l'ermita de Sant Pere d'Ardesa i, d'allà, cal enfilar-se al cim per un camí més exigent. Segons la Viquipèdia, a l'església s'hi arriba des de la BV-1037, a la qual s'accedeix pel trencall de Rubió del km 55 de l'N-II: al segon quilòmetre es pren el trencall de la dreta, cap a Can Tudó, i un camí ben senyalitzat continua fins a l'ermita. Cap de les dues fonts en dona la distància ni l'horari.",
				es: "Anoia Turisme la presenta como una ruta sencilla y sin mucho desnivel acumulado, con buenas vistas todo el trayecto: un camino fácil y cómodo lleva hasta los pies de la ermita de Sant Pere d'Ardesa y, desde allí, hay que subir a la cima por un camino más exigente. Según la Viquipèdia, a la iglesia se llega desde la BV-1037, a la que se accede por el desvío de Rubió del km 55 de la N-II: en el segundo kilómetro se toma el desvío de la derecha, hacia Can Tudó, y un camino bien señalizado continúa hasta la ermita. Ninguna de las dos fuentes da la distancia ni el horario."
			},
			fonts: [ANOIA_TURISME, VIQUIPEDIA_ARDESA]
		}
	],
	consells: {
		ca: [
			"El tram de l'ermita al cim és més exigent que el camí d'arribada: porta un calçat que agafi, no sabatilles de passeig.",
			"No hi ha cap dada publicada de temps ni de distància: mira't el recorregut al mapa de l'ICGC abans de sortir i calcula'l amb marge.",
			"Guarda una estona per a Sant Pere d'Ardesa: l'absis, amb les arcuacions llombardes, es veu bé des de fora.",
			'Cap al nord, els Pirineus queden mig tapats per la serra de Pinós i, segons Anoia Turisme, es veuen amb dificultat: no els donis per segurs.',
			"Si hi trobes el pessebre del cim, deixa'l com està."
		],
		es: [
			'El tramo de la ermita a la cima es más exigente que el camino de llegada: lleva un calzado que agarre, no zapatillas de paseo.',
			'No hay ningún dato publicado de tiempo ni de distancia: mira el recorrido en el mapa del ICGC antes de salir y calcúlalo con margen.',
			"Guarda un rato para Sant Pere d'Ardesa: el ábside, con los arquillos lombardos, se ve bien desde fuera.",
			'Hacia el norte, los Pirineos quedan medio tapados por la sierra de Pinós y, según Anoia Turisme, se ven con dificultad: no los des por seguros.',
			'Si encuentras el belén de la cima, déjalo como está.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puig de Sant Miquel?',
				resposta:
					"Les fonts que descriuen la ruta no en donen l'horari. Anoia Turisme en parla com d'una ruta senzilla, sense gaire desnivell acumulat, amb un tram final més exigent des de Sant Pere d'Ardesa."
			},
			{
				pregunta: 'Què es veu des del cim?',
				resposta:
					"Segons Anoia Turisme, la plana de l'Anoia amb Igualada al sud, la Segarra i l'Urgell a ponent, la serra de Rubió i el Montsec al nord, i el Montseny, Sant Llorenç del Munt i Montserrat a llevant."
			},
			{
				pregunta: "Què és Sant Pere d'Ardesa?",
				resposta:
					'Una església romànica al peu del puig, consagrada el 1192 i restaurada el 2009 després de molts anys en ruïnes, segons la Viquipèdia. És el punt de pas de la ruta habitual.'
			},
			{
				pregunta: 'Hi havia un castell, al Puig de Sant Miquel?',
				resposta:
					"El castell d'Ardesa, que la Viquipèdia documenta des del 989 i que presidia l'antic terme. Se suposa que era entre el cim i l'església, però ha desaparegut del tot."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puig de Sant Miquel?',
				resposta:
					"Las fuentes que describen la ruta no dan el horario. Anoia Turisme habla de una ruta sencilla, sin mucho desnivel acumulado, con un tramo final más exigente desde Sant Pere d'Ardesa."
			},
			{
				pregunta: '¿Qué se ve desde la cima?',
				resposta:
					'Según Anoia Turisme, la llanura de la Anoia con Igualada al sur, la Segarra y el Urgell a poniente, la sierra de Rubió y el Montsec al norte, y el Montseny, Sant Llorenç del Munt y Montserrat a levante.'
			},
			{
				pregunta: "¿Qué es Sant Pere d'Ardesa?",
				resposta:
					'Una iglesia románica al pie del puig, consagrada en 1192 y restaurada en 2009 tras muchos años en ruinas, según la Viquipèdia. Es el punto de paso de la ruta habitual.'
			},
			{
				pregunta: '¿Había un castillo en el Puig de Sant Miquel?',
				resposta:
					'El castillo de Ardesa, que la Viquipèdia documenta desde 989 y que presidía el antiguo término. Se supone que estaba entre la cima y la iglesia, pero ha desaparecido del todo.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_ARDESA, ANOIA_TURISME],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
