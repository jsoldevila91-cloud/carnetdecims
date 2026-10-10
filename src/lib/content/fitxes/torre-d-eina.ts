import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: "Viquipèdia: Torre d'Eina",
	url: 'https://ca.wikipedia.org/wiki/Torre_d%27Eina',
	consultat: CONSULTAT
};

const RAFA_YANES = {
	nom: "Rafa Yanes: ruta Torre d'Eina (2.830 m), Els 100 Cims",
	url: 'https://rafayanes.com/ruta-torre-deina-2-830-m-els-100-cims/',
	consultat: CONSULTAT
};

const REPTES_MUNTANYENCS = {
	nom: "Reptes Muntanyencs: Torre d'Eina i Pic de Noufonts",
	url: 'https://reptesmuntanyencs.cat/es/torre-deina-3/',
	consultat: CONSULTAT
};

const MONTANA_PASO_A_PASO = {
	nom: "Montaña paso a paso: la Torre d'Eina",
	url: 'https://montana-paso-a-paso.blogspot.com/2021/09/la-torre-deina.html',
	consultat: CONSULTAT
};

const ENGARRISTA = {
	nom: "Engarrista: Nou Fonts, Pic d'Eina, Torre d'Eina i Cambra d'Ase",
	url: 'https://www.engarrista.com/node/301',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'torre-d-eina',
	descripcio: {
		ca: [
			"La Torre d'Eina (la Tour d'Eyne en francès), també anomenada Torre del Serrat del Lloser, és un cim de 2.830 m d'un contrafort nord de la carena axial, entre l'Alta Cerdanya i el Conflent. Queda on es troben els termes d'Eina, Fontpedrosa i Planès, a la [Catalunya Nord](/comarques/catalunya-nord), i s'hi arriba tant des de la vall de Núria com des del vessant de l'Alta Cerdanya.",
			"Segons el blog Montaña paso a paso, des del cim es veuen el coll de Núria, el Pic d'Eina, el Noufonts, la [Cambra d'Ase](/cims/cambra-d-ase) i, al fons, el [Puigmal](/cims/puigmal). El Pic d'Eina, el veí, és segons Engarrista un vèrtex important administrativament, on es troben la Cerdanya, el Conflent i el Ripollès, i el punt on conflueixen les conques del Segre, el Ter i la Tet. Al cim hi ha una creu de ferro i un llibre de signatures en una bústia, instal·lats per la Societat Excursionista Pimpinela de l'Hospitalet de Llobregat, segons la Viquipèdia.",
			"La ruta clàssica surt de l'estació del cremallera de Núria, remunta la coma d'Eina pel sender de la Solana d'Eina fins al pla de les Barraques i al coll d'Eina, i continua per la carena fins al Pic d'Eina i la Torre. Rafa Yanes en dona uns 14 km anada i tornada i poc més de 1.000 m de desnivell, i afegeix que el tram del Pic d'Eina a la Torre pot ser una mica aeri. L'alternativa és la vall d'Eina des del poble d'Eina, més llarga.",
			"La temporada és l'estiu i el principi de tardor: Rafa Yanes recomana fer-lo sense neu, també per veure els colors de la roca. Segons Reptes Muntanyencs, la boira i sobretot el gel compliquen molt el pas del Pic d'Eina a la Torre, el tram més delicat. Si puges amb el cremallera, comprova l'horari del darrer tren de baixada."
		],
		es: [
			'La Torre d’Eina (la Tour d’Eyne en francés), también llamada Torre del Serrat del Lloser, es una cima de 2.830 m de un contrafuerte norte de la cresta axial, entre la Alta Cerdanya y el Conflent. Queda donde se encuentran los términos de Eina, Fontpedrosa y Planès, en la [Cataluña Norte](/comarques/catalunya-nord), y se llega tanto desde el valle de Núria como desde la vertiente de la Alta Cerdanya.',
			'Según el blog Montaña paso a paso, desde la cima se ven el coll de Núria, el Pic d’Eina, el Noufonts, la [Cambra d’Ase](/cims/cambra-d-ase) y, al fondo, el [Puigmal](/cims/puigmal). El Pic d’Eina, el vecino, es según Engarrista un vértice importante administrativamente, donde se encuentran la Cerdanya, el Conflent y el Ripollès, y el punto donde confluyen las cuencas del Segre, el Ter y el Tet. En la cima hay una cruz de hierro y un libro de firmas en un buzón, instalados por la Societat Excursionista Pimpinela de l’Hospitalet de Llobregat, según la Viquipèdia.',
			'La ruta clásica sale de la estación del cremallera de Núria, remonta la coma d’Eina por el sendero de la Solana d’Eina hasta el pla de les Barraques y el coll d’Eina, y continúa por la cresta hasta el Pic d’Eina y la Torre. Rafa Yanes da unos 14 km ida y vuelta y algo más de 1.000 m de desnivel, y añade que el tramo del Pic d’Eina a la Torre puede ser algo aéreo. La alternativa es el valle de Eina desde el pueblo de Eina, más larga.',
			'La temporada es el verano y el principio del otoño: Rafa Yanes recomienda hacerlo sin nieve, también para ver los colores de la roca. Según Reptes Muntanyencs, la niebla y sobre todo el hielo complican mucho el paso del Pic d’Eina a la Torre, el tramo más delicado. Si subes con el cremallera, comprueba el horario del último tren de bajada.'
		]
	},
	rutes: [
		{
			id: 'nuria',
			nom: { ca: "Des de Núria pel coll d'Eina", es: "Desde Núria por el coll d'Eina" },
			sortida: { nom: 'Núria (Queralbs, ≈ 1.950 m)' },
			distanciaKm: 7,
			tempsMinuts: 157,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Rafa Yanes la qualifica de moderada: uns 14 km anada i tornada pel mateix camí i poc més de 1.000 m de desnivell. Es remunta el riu de la Coma d'Eina, es creua i es puja per la Solana d'Eina fins al pla de les Barraques i el coll d'Eina; d'allà, al Pic d'Eina, i per la carena, en uns 30 minuts, a la Torre. Segons el track de Reptes Muntanyencs, la Torre queda a 2 h 37 min de Núria; aquesta ressenya la combina amb el Noufonts en una circular de 18,8 km, 1.484 m de desnivell i 5 h 31 min de marxa.",
				es: 'Rafa Yanes la califica de moderada: unos 14 km ida y vuelta por el mismo camino y algo más de 1.000 m de desnivel. Se remonta el río de la Coma d’Eina, se cruza y se sube por la Solana d’Eina hasta el pla de les Barraques y el coll d’Eina; desde allí, al Pic d’Eina, y por la cresta, en unos 30 minutos, a la Torre. Según el track de Reptes Muntanyencs, la Torre queda a 2 h 37 min de Núria; esta reseña la combina con el Noufonts en una circular de 18,8 km, 1.484 m de desnivel y 5 h 31 min de marcha.'
			},
			fonts: [RAFA_YANES, REPTES_MUNTANYENCS]
		},
		{
			id: 'vall-d-eina',
			nom: { ca: "Des del poble d'Eina per la vall", es: 'Desde el pueblo de Eina por el valle' },
			sortida: { nom: "Aparcament d'Eina (1.599 m)" },
			descripcio: {
				ca: "El blog Montaña paso a paso descriu una circular d'uns 20 km, 1.300 m de desnivell i 7 h amb pauses, de dificultat alta. Pel riu d'Eina i l'Orri de Baix (2.050 m), el pla de les Fonts (2.230 m) i el pla de la Beguda (2.335 m) es creua el riu i una carena amb marques blanques porta al cim; la pujada final és molt dreta i la baixada, d'un pendent molt fort. Hi ha marmotes a partir de l'Orri de Baix.",
				es: 'El blog Montaña paso a paso describe una circular de unos 20 km, 1.300 m de desnivel y 7 h con pausas, de dificultad alta. Por el río de Eina y l’Orri de Baix (2.050 m), el pla de les Fonts (2.230 m) y el pla de la Beguda (2.335 m) se cruza el río y una cresta con marcas blancas lleva a la cima; la subida final es muy empinada y la bajada, de pendiente muy fuerte. Hay marmotas a partir de l’Orri de Baix.'
			},
			fonts: [MONTANA_PASO_A_PASO]
		}
	],
	consells: {
		ca: [
			"Comprova l'horari del darrer cremallera de baixada de Núria abans de sortir.",
			"La fitxa de Reptes Muntanyencs no hi compta fonts més enllà de l'inici: omple l'aigua a Núria.",
			"El tram del Pic d'Eina a la Torre és una mica aeri; amb boira, gel o vent, valora no continuar.",
			"Si vols enllaçar amb el Cambra d'Ase, Engarrista avisa que la jornada és molt llarga (24,1 km, 1.880 m, 10 h 35 min) i que hi ha un tram on cal destrepar.",
			"El blog de la vall d'Eina cita marmotes a partir de l'Orri de Baix: observa-les de lluny."
		],
		es: [
			'Comprueba el horario del último cremallera de bajada de Núria antes de salir.',
			'La ficha de Reptes Muntanyencs no cuenta fuentes más allá del inicio: llena el agua en Núria.',
			'El tramo del Pic d’Eina a la Torre es algo aéreo; con niebla, hielo o viento, valora no continuar.',
			'Si quieres enlazar con el Cambra d’Ase, Engarrista avisa de que la jornada es muy larga (24,1 km, 1.880 m, 10 h 35 min) y de que hay un tramo en el que hay que destrepar.',
			'El blog del valle de Eina cita marmotas a partir de l’Orri de Baix: obsérvalas de lejos.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Quant es triga a pujar a la Torre d'Eina des de Núria?",
				resposta:
					"Rafa Yanes dona uns 14 km i poc més de 1.000 m de desnivell anada i tornada, i uns 30 minuts del Pic d'Eina a la Torre. Al track de Reptes Muntanyencs, la Torre queda a 2 h 37 min de la sortida, i la circular amb el Noufonts suma 6 h 15 min amb les parades."
			},
			{
				pregunta: 'Té passos tècnics?',
				resposta:
					"Rafa Yanes diu que no hi ha punts tècnics conflictius, però que el tram després del Pic d'Eina pot ser una mica aeri. El blog de la vall d'Eina esmenta una pujada final molt dreta per la carena."
			},
			{
				pregunta: "Es pot pujar des d'Eina?",
				resposta:
					"Sí, per la vall d'Eina: Montaña paso a paso hi marca 20 km i 1.300 m de desnivell en una circular de 7 h amb pauses. És una via més llarga i de dificultat alta."
			},
			{
				pregunta: "La Torre d'Eina compta com a cim essencial?",
				resposta:
					'Sí. És el segon dels vuit essencials de la Catalunya Nord per altitud, només per sota del [Carlit](/cims/carlit); el [Canigó](/cims/canigo), amb 2.784 m, queda per sota.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Torre d’Eina desde Núria?',
				resposta:
					'Rafa Yanes da unos 14 km y algo más de 1.000 m de desnivel ida y vuelta, y unos 30 minutos del Pic d’Eina a la Torre. En el track de Reptes Muntanyencs, la Torre queda a 2 h 37 min de la salida, y la circular con el Noufonts suma 6 h 15 min con las paradas.'
			},
			{
				pregunta: '¿Tiene pasos técnicos?',
				resposta:
					'Rafa Yanes dice que no hay puntos técnicos conflictivos, pero que el tramo tras el Pic d’Eina puede ser algo aéreo. El blog del valle de Eina menciona una subida final muy empinada por la cresta.'
			},
			{
				pregunta: '¿Se puede subir desde Eina?',
				resposta:
					'Sí, por el valle de Eina: Montaña paso a paso marca 20 km y 1.300 m de desnivel en una circular de 7 h con pausas. Es una vía más larga y de dificultad alta.'
			},
			{
				pregunta: '¿La Torre d’Eina cuenta como cima esencial?',
				resposta:
					'Sí. Es el segundo de los ocho esenciales de Cataluña Norte por altitud, solo por debajo del [Carlit](/cims/carlit); el [Canigó](/cims/canigo), con 2.784 m, queda por debajo.'
			}
		]
	},
	fonts: [VIQUIPEDIA, RAFA_YANES, REPTES_MUNTANYENCS, MONTANA_PASO_A_PASO, ENGARRISTA],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
