import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Montclar (Pontils)',
	url: 'https://ca.wikipedia.org/wiki/Montclar_(Pontils)',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Sant Miquel de Montclar',
	url: 'https://reptesmuntanyencs.cat/sant-miquel-de-montclar/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'sant-miquel-de-montclar',
	descripcio: {
		ca: [
			"Sant Miquel de Montclar és el nom amb què la FEEC recull el cim de Montclar, al terme de Pontils, a [la Conca de Barberà](/comarques/conca-de-barbera). El cim del repte és el de Montclar; l'ermita de Sant Miquel i les restes del castell són a prop. Segons la Viquipèdia, és un massís abrupte, de conglomerat, gres i marga, que es distingeix dels cims veïns pel color clar de les seves roques; la vegetació és més aviat arbustiva i baixa, i al cim hi ha un vèrtex geodèsic. Forma part de la Serralada Prelitoral Catalana.",
			"La Viquipèdia anota que a la muntanya hi ha unes restes d'un castell, amb un article propi, i una ermita dedicada a Sant Miquel. Reptes Muntanyencs, que hi puja des del km 1,6 de la carretera TV-2015, parla de «l'ermita i el castell de Sant Miquel del Montclar» com a punts d'interès de la zona.",
			"La ressenya del bloc descriu una circular curta però amb pendent: el cim és «envoltat de cingles de conglomerat d'impossible superació»; per enllaçar amb noves pistes, a més, «s'han de travessar camps de cultiu», i en un tram el sender és «molt difús i gairebé imperceptible». L'itinerari no està senyalitzat, tret d'un pal indicador de diferents destinacions en un encreuament.",
			'Per això, tot i que la distància és curta, cal portar el track i saber orientar-se: el recorregut va per camps, pistes i un sender poc visible.'
		],
		es: [
			'Sant Miquel de Montclar es el nombre con el que la FEEC recoge la cima de Montclar, en el término de Pontils, en [la Conca de Barberà](/comarques/conca-de-barbera). La cima del reto es la de Montclar; la ermita de Sant Miquel y los restos del castillo están cerca. Según la Viquipèdia, es un macizo abrupto, de conglomerado, arenisca y marga, que se distingue de las cimas vecinas por el color claro de sus rocas; la vegetación es más bien arbustiva y baja, y en la cima hay un vértice geodésico. Forma parte de la Serralada Prelitoral Catalana.',
			'La Viquipèdia anota que en la montaña hay unos restos de un castillo, con artículo propio, y una ermita dedicada a Sant Miquel. Reptes Muntanyencs, que sube desde el km 1,6 de la carretera TV-2015, habla de «la ermita y el castillo de Sant Miquel del Montclar» como puntos de interés de la zona.',
			'La reseña del blog describe una circular corta pero con pendiente: la cima está «rodeada de riscos de conglomerado de imposible superación»; para enlazar con nuevas pistas, además, «hay que atravesar campos de cultivo», y en un tramo el sendero es «muy difuso y casi imperceptible». El itinerario no está señalizado, salvo un poste indicador de diferentes destinos en un cruce.',
			'Por eso, aunque la distancia es corta, hay que llevar el track y saber orientarse: el recorrido va por campos, pistas y un sendero poco visible.'
		]
	},
	rutes: [
		{
			id: 'tv-2015',
			nom: {
				ca: 'Circular des de la carretera TV-2015',
				es: 'Circular desde la carretera TV-2015'
			},
			sortida: { nom: 'Km 1,6 de la carretera TV-2015 (Pontils)' },
			descripcio: {
				ca: "Reptes Muntanyencs documenta una circular que surt del km 1,6 de la TV-2015, amb senders i pistes: uns 5,8 km i uns 509 m de desnivell positiu. Segons el seu track, el cim de Montclar s'assoleix als 2,1 km i a 35 min de la sortida. L'itinerari no està senyalitzat, hi ha camps de conreu per travessar i un sender gairebé imperceptible.",
				es: 'Reptes Muntanyencs documenta una circular que sale del km 1,6 de la TV-2015, con senderos y pistas: unos 5,8 km y unos 509 m de desnivel positivo. Según su track, la cima de Montclar se alcanza a los 2,1 km y a 35 min de la salida. El itinerario no está señalizado, hay campos de cultivo que atravesar y un sendero casi imperceptible.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"El bloc no hi troba senyalització, tret d'un pal indicador en un encreuament: porta el track i un mapa de l'ICGC.",
			'Hi ha camps de conreu per travessar: respecta els cultius i els límits de les finques.',
			"Evita els cingles de conglomerat que envolten el cim; el bloc els considera d'impossible superació.",
			"Si el sender és difús, torna enrere abans d'inventar un pas.",
			"Telèfon d'emergències: 112."
		],
		es: [
			'El blog no encuentra señalización, salvo un poste indicador en un cruce: lleva el track y un mapa del ICGC.',
			'Hay campos de cultivo que atravesar: respeta los cultivos y los límites de las fincas.',
			'Evita los riscos de conglomerado que rodean la cima; el blog los considera de imposible superación.',
			'Si el sendero es difuso, da la vuelta antes de inventar un paso.',
			'Teléfono de emergencias: 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Montclar?',
				resposta:
					"Reptes Muntanyencs documenta una circular d'uns 5,8 km des de la TV-2015; segons el seu track, el cim de Montclar queda a 35 min i uns 2,1 km de la sortida."
			},
			{
				pregunta: "És l'ermita de Sant Miquel?",
				resposta:
					"No. El cim del repte és el cim de Montclar; l'ermita de Sant Miquel i les restes del castell són a prop, segons la Viquipèdia."
			},
			{
				pregunta: 'Està senyalitzat?',
				resposta: "El bloc diu que no està senyalitzat, tret d'un pal indicador en un encreuament."
			},
			{
				pregunta: 'Compta com a cim essencial?',
				resposta:
					"Sí, és un dels quatre [cims essencials](/cims-essencials) de la Conca de Barberà, amb la [Mola d'Estat](/cims/mola-d-estat) i la [Punta del Curull](/cims/punta-del-curull)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Montclar?',
				resposta:
					'Reptes Muntanyencs documenta una circular de unos 5,8 km desde la TV-2015; según su track, la cima de Montclar queda a 35 min y unos 2,1 km de la salida.'
			},
			{
				pregunta: '¿Es la ermita de Sant Miquel?',
				resposta:
					'No. La cima del reto es la cima de Montclar; la ermita de Sant Miquel y los restos del castillo están cerca, según la Viquipèdia.'
			},
			{
				pregunta: '¿Está señalizado?',
				resposta: 'El blog dice que no está señalizado, salvo un poste indicador en un cruce.'
			},
			{
				pregunta: '¿Cuenta como cima esencial?',
				resposta:
					"Sí, es una de las cuatro [cimas esenciales](/cims-essencials) de la Conca de Barberà, con la [Mola d'Estat](/cims/mola-d-estat) y la [Punta del Curull](/cims/punta-del-curull)."
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
