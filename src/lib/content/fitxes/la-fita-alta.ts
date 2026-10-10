import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: la Fita Alta',
	url: 'https://ca.wikipedia.org/wiki/La_Fita_Alta',
	consultat: CONSULTAT
};

const RUTA_SERRA = {
	nom: 'Diputació de Lleida (contingut patrocinat a ElNacional.cat): la ruta de la Serra',
	url: 'https://www.elnacional.cat/ca/branded/diputacio-lleida-ruta-de-la-serra_452679_102.html',
	consultat: CONSULTAT
};

const EXCURSIONS_SIDAMON = {
	nom: 'Excursions Festa Major: de Sidamon a la Fita Alta',
	url: 'https://excursions.festamajor.biz/lleida/de-sidamon-a-la-fita-alta/',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: la Fita Alta des de Miralcamp',
	url: 'https://reptesmuntanyencs.cat/la-fita-alta/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'la-fita-alta',
	descripcio: {
		ca: [
			"La Fita Alta és el punt més alt [del Pla d'Urgell](/comarques/pla-d-urgell), entre els termes de Sidamon i Torregrossa. És l'elevació principal de la Serra, un petit altiplà de graves i conreus de secà que s'aixeca uns metres sobre la plana regada pel Canal d'Urgell. Un vèrtex geodèsic en marca el punt culminant; no esperis cingles ni roca, sinó una carena suau d'oliveres, ametllers i marges de pedra.",
			"El seu interès és el paisatge i la història que l'envolta. La Serra la travessa una antiga carrerada, el camí per on baixaven els ramats transhumants, avui convertida en la ruta de la Serra, que uneix Bell-lloc d'Urgell i Miralcamp. A prop hi ha el poblat ibèric del Tossal de les Tenalles, l'Observatori, una fortificació de la Guerra Civil construïda per l'exèrcit republicà el 1938, i el Dipòsit Rodó de Mollerussa, del 1894, una de les primeres construccions de formigó armat de la península, projectada per l'enginyer militar Francesc Macià.",
			"Des de dalt, en dies clars, la vista arriba al Montsec i a les serres del Pirineu central fins a les muntanyes d'Andorra, i cap al sud a les serres prelitorals. Als peus s'estén el mosaic de regadiu i secà que el Canal d'Urgell va transformar des del segle XIX. Si busques altres cims planers de la plana de Lleida, [lo Pilar d'Almenara](/cims/pilar-d-almenara) i [els Bessons](/cims/els-bessons) no queden gaire lluny.",
			"L'estació marca molt la sortida. A l'estiu la calor a la plana és intensa i no hi ha ombra: millor a primera hora o a la tarda. A l'hivern, la boira persistent de la Depressió Central pot amagar tota la vista. A la primavera la Serra és verda i s'hi senten alosa, piula i torlit."
		],
		es: [
			"La Fita Alta es el punto más alto [del Pla d'Urgell](/comarques/pla-d-urgell), entre los términos de Sidamon y Torregrossa. Es la elevación principal de la Serra, un pequeño altiplano de gravas y cultivos de secano que se levanta unos metros sobre la llanura regada por el Canal d'Urgell. Un vértice geodésico marca su punto culminante; no esperes riscos ni roca, sino una loma suave de olivos, almendros y márgenes de piedra.",
			"Su interés es el paisaje y la historia que la rodea. La Serra la atraviesa una antigua cañada, el camino por donde bajaban los rebaños trashumantes, hoy convertida en la ruta de la Serra, que une Bell-lloc d'Urgell y Miralcamp. Cerca están el poblado ibérico del Tossal de les Tenalles, l'Observatori, una fortificación de la Guerra Civil construida por el ejército republicano en 1938, y el Dipòsit Rodó de Mollerussa, de 1894, una de las primeras construcciones de hormigón armado de la península, proyectada por el ingeniero militar Francesc Macià.",
			"Desde arriba, en días claros, la vista llega al Montsec y a las sierras del Pirineo central hasta las montañas de Andorra, y hacia el sur a las sierras prelitorales. A los pies se extiende el mosaico de regadío y secano que el Canal d'Urgell transformó desde el siglo XIX. Si buscas otras cimas llanas de la llanura de Lleida, [lo Pilar d'Almenara](/cims/pilar-d-almenara) y [els Bessons](/cims/els-bessons) no quedan muy lejos.",
			'La estación marca mucho la salida. En verano el calor en la llanura es intenso y no hay sombra: mejor a primera hora o por la tarde. En invierno, la niebla persistente de la Depresión Central puede ocultar toda la vista. En primavera la Serra está verde y se oyen la alondra, el bisbita y el alcaraván.'
		]
	},
	rutes: [
		{
			id: 'sidamon',
			nom: { ca: 'Des de Sidamon', es: 'Desde Sidamon' },
			sortida: { nom: 'Sidamon' },
			distanciaKm: 2.6,
			tempsMinuts: 40,
			tecnicitat: 'cap',
			descripcio: {
				ca: "És la que recomana el mateix poble, i també la més curta. Des de Sidamon es creua el Canal d'Urgell i se segueixen una pista asfaltada i camins de terra entre oliveres fins a la carena, passant per la séquia de la Serra. Segons Excursions Festa Major, el cim és a 2,56 km i uns 40 minuts, i tota la volta circular fa 5,12 km i 1 h 10 min, amb només uns 60 m de desnivell. Està senyalitzada només en part.",
				es: "Es la que recomienda el propio pueblo, y también la más corta. Desde Sidamon se cruza el Canal d'Urgell y se siguen una pista asfaltada y caminos de tierra entre olivos hasta la loma, pasando por la acequia de la Serra. Según Excursions Festa Major, la cima está a 2,56 km y unos 40 minutos, y toda la vuelta circular tiene 5,12 km y 1 h 10 min, con solo unos 60 m de desnivel. Está señalizada solo en parte."
			},
			fonts: [EXCURSIONS_SIDAMON]
		},
		{
			id: 'ruta-de-la-serra',
			nom: { ca: 'Per la ruta de la Serra', es: 'Por la ruta de la Serra' },
			sortida: { nom: "Bell-lloc d'Urgell o Miralcamp" },
			descripcio: {
				ca: "Itinerari llarg que segueix l'antiga carrerada per sis municipis del Pla d'Urgell, de Bell-lloc d'Urgell a Miralcamp, i passa per la Fita Alta. Són 23,6 km, ciclables però amb alguns trams drets, i es poden fer a peu o en bicicleta. Reptes Muntanyencs proposa una versió circular des de Miralcamp de 10,8 km per pistes agrícoles, amb el cim a una hora i mitja.",
				es: 'Itinerario largo que sigue la antigua cañada por seis municipios del Pla d’Urgell, de Bell-lloc d’Urgell a Miralcamp, y pasa por la Fita Alta. Son 23,6 km, ciclables pero con algunos tramos empinados, y se pueden hacer a pie o en bicicleta. Reptes Muntanyencs propone una versión circular desde Miralcamp de 10,8 km por pistas agrícolas, con la cima a una hora y media.'
			},
			fonts: [RUTA_SERRA, REPTES]
		}
	],
	consells: {
		ca: [
			'Amb tan poc desnivell, és una bona primera sortida del repte per a la canalla: camins amples i orientació senzilla.',
			"A l'estiu no hi ha gens d'ombra: porta aigua, gorra i protecció solar.",
			'Els camins travessen finques agrícoles: no trepitgis els conreus i deixa passar la maquinària.',
			"Amb boira, que a l'hivern pot durar dies, la sortida perd tot l'interès de les vistes: consulta la previsió."
		],
		es: [
			'Con tan poco desnivel, es una buena primera salida del reto para los niños: caminos anchos y orientación sencilla.',
			'En verano no hay nada de sombra: lleva agua, gorra y protección solar.',
			'Los caminos atraviesan fincas agrícolas: no pises los cultivos y deja pasar la maquinaria.',
			'Con niebla, que en invierno puede durar días, la salida pierde todo el interés de las vistas: consulta la previsión.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Fita Alta?',
				resposta:
					'Des de Sidamon, uns 40 minuts per 2,56 km de pistes i camins, segons Excursions Festa Major. La volta circular sencera fa 5,12 km i es fa en 1 h 10 min.'
			},
			{
				pregunta: 'Es pot pujar a la Fita Alta amb nens?',
				resposta:
					"Sí, és dels cims més fàcils del repte: el desnivell és mínim i el camí va per pistes i camins de terra entre oliveres. A l'estiu, evita les hores de més sol."
			},
			{
				pregunta: 'Què hi ha a prop de la Fita Alta?',
				resposta:
					"El poblat ibèric del Tossal de les Tenalles, l'Observatori de la Guerra Civil (1938) i, seguint la ruta de la Serra, el Dipòsit Rodó de Mollerussa, del 1894."
			},
			{
				pregunta: 'La Fita Alta és un cim essencial?',
				resposta:
					"Sí. És l'únic [cim essencial](/cims-essencials) del Pla d'Urgell i també el seu sostre, tot i que s'alça només uns metres sobre la plana del Canal d'Urgell."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Fita Alta?',
				resposta:
					'Desde Sidamon, unos 40 minutos para 2,56 km de pistas y caminos, según Excursions Festa Major. La vuelta circular completa tiene 5,12 km y se hace en 1 h 10 min.'
			},
			{
				pregunta: '¿Se puede subir a la Fita Alta con niños?',
				resposta:
					'Sí, es de las cimas más fáciles del reto: el desnivel es mínimo y el camino va por pistas y caminos de tierra entre olivos. En verano, evita las horas de más sol.'
			},
			{
				pregunta: '¿Qué hay cerca de la Fita Alta?',
				resposta:
					"El poblado ibérico del Tossal de les Tenalles, l'Observatori de la Guerra Civil (1938) y, siguiendo la ruta de la Serra, el Dipòsit Rodó de Mollerussa, de 1894."
			},
			{
				pregunta: '¿La Fita Alta es una cima esencial?',
				resposta:
					"Sí. Es la única [cima esencial](/cims-essencials) del Pla d'Urgell y también su techo, aunque solo se alza unos metros sobre la llanura del Canal d'Urgell."
			}
		]
	},
	fonts: [VIQUIPEDIA, RUTA_SERRA, EXCURSIONS_SIDAMON, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
