import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Pic de Turp',
	url: 'https://ca.wikipedia.org/wiki/Pic_de_Turp',
	consultat: CONSULTAT
};

const VIQUIPEDIA_SERRA = {
	nom: 'Viquipèdia: serra de Turp',
	url: 'https://ca.wikipedia.org/wiki/Serra_de_Turp',
	consultat: CONSULTAT
};

const ENGARRISTA_CAL_FANGUET = {
	nom: 'Engarrista: Serra de Turp (1.620 m)',
	url: 'https://www.engarrista.com/node/1065',
	consultat: CONSULTAT
};

const ENGARRISTA_L401 = {
	nom: 'Engarrista: Cogulló de Turp (1.620 m)',
	url: 'https://www.engarrista.com/node/402',
	consultat: CONSULTAT
};

const BTT_PIRINEUS = {
	nom: 'BTT Pirineus: 100 cims, Cogulló de Turp',
	url: 'https://www.bttpirineus.org/100-cims-cogullo-de-turp/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'cogullo-de-turp',
	descripcio: {
		ca: [
			"El Cogulló de Turp, que l'ICGC recull com a Pic de Turp, és el punt més alt de la serra de Turp, una carena calcària d'uns 6,5 km al Prepirineu occidental. El cim marca el límit entre els termes de Coll de Nargó, Fígols i Alinyà i Oliana, a [l'Alt Urgell](/comarques/alt-urgell), tot i que molts dels camins d'accés surten del Solsonès, des de Llinars i Cambrils (Odèn). Forma part de l'àrea protegida de la serra de Turp i Móra Comdal–Valldan.",
			"És un dels essencials més baixos del repte: dels quatre cims de l'Alt Urgell que no arriben als 2.000 m, és el més alt, per sobre del [Coscollet](/cims/lo-coscollet), de [Sant Honorat](/cims/sant-honorat) i de [Santa Fe](/cims/santa-fe). Al cim hi ha un vèrtex geodèsic i, al vessant sud-est, parets on es practica l'escalada; la via del Guillem, per exemple, arriba fins dalt, però és una activitat a part de l'excursió.",
			"El camí hi deixa traces del passat. A la zona d'Odèn hi ha l'antiga mina Juanita, ara amb cartells que expliquen com s'ha recuperat el terreny, i el Pi de Nerola, un pi roig monumental de 25,5 m que, segons un cartell, fa de parallamps (el 2022 encara tenia l'escorça marcada per un llamp). Més avall queden l'ermita de Santa Pelaia i el petit nucli abandonat de Sant Joan de les Anoves, amb una capella sense teulada i una campana feta amb una bombona de butà.",
			"Engarrista descriu des del cim, al sud i a l'oest, les serres del Boumort, d'Aubenç i de Sant Honorat i l'embassament d'Oliana, a la vall del Segre; cap al nord, si el dia és net, es veu la línia del Pirineu. El camí passa sovint per bosc i, a l'hivern, les obagues poden conservar plaques de neu i gel. Com que no és un cim alt, es pot pujar gairebé tot l'any; els dies més calorosos d'estiu, millor començar a primera hora."
		],
		es: [
			'El Cogulló de Turp, que el ICGC recoge como Pic de Turp, es el punto más alto de la serra de Turp, una cresta caliza de unos 6,5 km en el Prepirineo occidental. La cima marca el límite entre los términos de Coll de Nargó, Fígols i Alinyà y Oliana, en [el Alt Urgell](/comarques/alt-urgell), aunque muchos de los caminos de acceso salen del Solsonès, desde Llinars y Cambrils (Odèn). Forma parte del área protegida de la serra de Turp y Móra Comdal–Valldan.',
			'Es una de las esenciales más bajas del reto: de las cuatro cimas del Alt Urgell que no llegan a los 2.000 m, es la más alta, por encima del [Coscollet](/cims/lo-coscollet), de [Sant Honorat](/cims/sant-honorat) y de [Santa Fe](/cims/santa-fe). En la cima hay un vértice geodésico y, en la vertiente sureste, paredes donde se practica la escalada; la vía del Guillem, por ejemplo, llega hasta arriba, pero es una actividad aparte de la excursión.',
			'El camino deja huellas del pasado. En la zona de Odèn está la antigua mina Juanita, ahora con carteles que explican cómo se ha recuperado el terreno, y el Pi de Nerola, un pino silvestre monumental de 25,5 m que, según un cartel, hace de pararrayos (en 2022 aún tenía la corteza marcada por un rayo). Más abajo quedan la ermita de Santa Pelaia y el pequeño núcleo abandonado de Sant Joan de les Anoves, con una capilla sin tejado y una campana hecha con una bombona de butano.',
			'Engarrista describe desde la cima, al sur y al oeste, las sierras del Boumort, de Aubenç y de Sant Honorat y el embalse de Oliana, en el valle del Segre; hacia el norte, si el día está limpio, se ve la línea del Pirineo. El camino pasa a menudo por bosque y, en invierno, las umbrías pueden conservar placas de nieve y hielo. Como no es una cima alta, se puede subir casi todo el año; en los días más calurosos del verano, mejor empezar a primera hora.'
		]
	},
	rutes: [
		{
			id: 'coll-de-la-coma',
			nom: {
				ca: 'Des de Llinars pel coll de la Coma de Turp',
				es: 'Desde Llinars por el coll de la Coma de Turp'
			},
			sortida: { nom: 'Collada de Cal Fanguet (Llinars, Odèn)' },
			descripcio: {
				ca: "És l'accés més curt de les ressenyes consultades. De Cambrils o Llinars, al Solsonès, una pista de terra pedregosa puja pel coll del Boix fins al coll de la Coma de Turp (1.460 m segons BTT Pirineus; 1.479 m segons Engarrista), on BTT Pirineus deixa la bicicleta. D'allà un camí poc senyalitzat, sovint dins del bosc, remunta els últims 150 m de desnivell fins al vèrtex. Engarrista hi aparca en una cruïlla de pistes, sense lloc condicionat.",
				es: 'Es el acceso más corto de las reseñas consultadas. Desde Cambrils o Llinars, en el Solsonès, una pista de tierra pedregosa sube por el coll del Boix hasta el coll de la Coma de Turp (1.460 m según BTT Pirineus; 1.479 m según Engarrista), donde BTT Pirineus deja la bicicleta. Desde allí un camino poco señalizado, a menudo dentro del bosque, remonta los últimos 150 m de desnivel hasta el vértice. Engarrista aparca en un cruce de pistas, sin aparcamiento habilitado.'
			},
			fonts: [ENGARRISTA_CAL_FANGUET, BTT_PIRINEUS]
		},
		{
			id: 'barranc-de-l-os',
			nom: {
				ca: "Des de la carretera L-401 pel barranc de l'Ós",
				es: "Desde la carretera L-401 por el barranc de l'Ós"
			},
			sortida: { nom: 'Km 4,5 de la L-401 (Fígols i Alinyà)' },
			distanciaKm: 6.3,
			tempsMinuts: 173,
			descripcio: {
				ca: "La via llarga remunta el barranc de l'Ós per un camí antic marcat amb fites i, en alguns trams, amb filades de pedres, fins al coll de la Travessa i, d'allà, al cim. Engarrista hi arriba en 2 h 53 min i 6,3 km; la circular completa, que baixa per l'ermita de Santa Pelaia, Cal Fité i Perles, fa 18,6 km i 1.180 m de desnivell, amb 8 h comptant les parades. L'autor es va desviar després de Can Sadoll: porta el track.",
				es: 'La vía larga remonta el barranc de l’Ós por un camino antiguo marcado con hitos y, en algunos tramos, con hileras de piedras, hasta el coll de la Travessa y, desde allí, a la cima. Engarrista llega en 2 h 53 min y 6,3 km; la circular completa, que baja por la ermita de Santa Pelaia, Cal Fité y Perles, son 18,6 km y 1.180 m de desnivel, con 8 h contando las paradas. El autor se desvió después de Can Sadoll: lleva el track.'
			},
			fonts: [ENGARRISTA_L401]
		}
	],
	consells: {
		ca: [
			"La pista d'accés des de Llinars i Cambrils és de terra i pedregosa: no hi ha aparcament habilitat, així que deixa el cotxe on no tapi cap pista ni entrada de camp.",
			'Porta el track descarregat: el darrer tram fins al vèrtex és poc senyalitzat i passa per dins del bosc, on amb boira costa mantenir la direcció.',
			'Si tanques la circular per la carena cap al Grau i Sant Joan de les Anoves, Engarrista hi troba un tram sense camí marcat i força brut de vegetació, on cal obrir-se pas entre matolls.',
			"A l'hivern, les obagues poden tenir neu i gel; mira la previsió abans de sortir.",
			'Hi ha escaladors a la paret sud-est: no llencis pedres des de la carena.'
		],
		es: [
			'La pista de acceso desde Llinars y Cambrils es de tierra y pedregosa: no hay aparcamiento habilitado, así que deja el coche donde no tape ninguna pista ni entrada de campo.',
			'Lleva el track descargado: el último tramo hasta el vértice está poco señalizado y va por dentro del bosque, donde con niebla cuesta mantener la dirección.',
			'Si cierras la circular por la cresta hacia el Grau y Sant Joan de les Anoves, Engarrista encuentra un tramo sin camino marcado y bastante cerrado de vegetación, donde hay que abrirse paso entre matorrales.',
			'En invierno, las umbrías pueden tener nieve y hielo; mira la previsión antes de salir.',
			'Hay escaladores en la pared sureste: no tires piedras desde la cresta.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quin és el camí més curt al Cogulló de Turp?',
				resposta:
					'El del coll de la Coma de Turp, a prop de 1.470 m, perquè la pista de terra et deixa a uns 150 m de desnivell del cim. Engarrista descriu una circular de 12 km i 820 m de desnivell des de la collada de Cal Fanguet, amb un temps total de 5 h 30 min.'
			},
			{
				pregunta: 'És una ruta adequada per a principiants?',
				resposta:
					'La pujada des del coll de la Coma és curta, però el camí és poc marcat i la carena té trams sense camí. Per això cal portar un track i no val la pena improvisar amb boira. Amb nens grans acostumats a caminar és viable en un dia de bon temps.'
			},
			{
				pregunta: "Hi ha res d'interès a prop del cim?",
				resposta:
					"Sí: l'ermita de Santa Pelaia, Sant Joan de les Anoves (poblat parcialment abandonat), el Pi de Nerola i les restes de la mina Juanita són a pocs quilòmetres de l'itinerari habitual."
			},
			{
				pregunta: 'El Cogulló de Turp compta com a cim essencial?',
				resposta:
					"Sí. És el més alt dels essencials de l'Alt Urgell que queden per sota dels 2.000 m, amb [Sant Honorat](/cims/sant-honorat), el [Coscollet](/cims/lo-coscollet) i Santa Fe."
			}
		],
		es: [
			{
				pregunta: '¿Cuál es el camino más corto al Cogulló de Turp?',
				resposta:
					'El del coll de la Coma de Turp, cerca de 1.470 m, porque la pista de tierra te deja a unos 150 m de desnivel de la cima. Engarrista describe una circular de 12 km y 820 m de desnivel desde la collada de Cal Fanguet, con un tiempo total de 5 h 30 min.'
			},
			{
				pregunta: '¿Es una ruta adecuada para principiantes?',
				resposta:
					'La subida desde el coll de la Coma es corta, pero el camino está poco marcado y la cresta tiene tramos sin camino. Por eso hay que llevar un track y no merece la pena improvisar con niebla. Con niños mayores acostumbrados a caminar es viable en un día de buen tiempo.'
			},
			{
				pregunta: '¿Hay algo de interés cerca de la cima?',
				resposta:
					'Sí: la ermita de Santa Pelaia, Sant Joan de les Anoves (poblado parcialmente abandonado), el Pi de Nerola y los restos de la mina Juanita están a pocos kilómetros del itinerario habitual.'
			},
			{
				pregunta: '¿El Cogulló de Turp cuenta como cima esencial?',
				resposta:
					'Sí. Es la más alta de las esenciales del Alt Urgell que quedan por debajo de los 2.000 m, junto con [Sant Honorat](/cims/sant-honorat), el [Coscollet](/cims/lo-coscollet) y Santa Fe.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_SERRA, ENGARRISTA_CAL_FANGUET, ENGARRISTA_L401, BTT_PIRINEUS],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
