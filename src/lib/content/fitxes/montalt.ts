import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Montalt (Dosrius)',
	url: 'https://ca.wikipedia.org/wiki/Montalt_(Dosrius)',
	consultat: CONSULTAT
};

const SURTDECASA = {
	nom: 'Surt de Casa: les 10 millors excursions pel Maresme',
	url: 'https://surtdecasa.cat/barcelona/entorn/10-millors-excursions-pel-maresme',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'montalt',
	descripcio: {
		ca: [
			"El Montalt és un contrafort de la Serralada Litoral, al [Maresme](/comarques/maresme), situat entre la serra del Corredor i el Montnegre. Segons la Viquipèdia, se'l reparteixen tres termes: Dosrius, al nord, que és on cau el cim; Sant Andreu de Llavaneres, al sud-oest, i Sant Vicenç de Montalt, al sud-est. Amb la serra del Corredor forma el massís del Corredor, unit pel coll del Bruc i la creu de Rupit. L'altre cim essencial del Maresme és [el castell de Burriac](/cims/castell-de-burriac).",
			"On s'acostuma a arribar no és ben bé el punt més alt, sinó una mica més a llevant, on hi ha un vèrtex geodèsic de primer ordre sobre una llosa de pedra. La Viquipèdia explica que hi ha una bústia on els excursionistes deixen escrit el nom i la data, i que per Nadal és tradició pujar-hi un petit pessebre.",
			"És una muntanya de moltes entrades. Surt de Casa recorda que s'hi puja des de qualsevol dels pobles que l'envolten, Sant Andreu de Llavaneres, Dosrius, Arenys de Munt i Sant Vicenç de Montalt, i en proposa dues rutes. Totes acaben igual: es deixa la pista forestal i s'agafa un dels tres corriols que pugen al cim, des del coll de la Ferradura, des del coll de Paietes o des de la Brolleta de Montalt.",
			"Es pot fer en qualsevol època de l'any. La Viquipèdia avisa que la pujada no té gaire dificultat fins als corriols finals, on hi ha pedres que rellisquen quan el terra és moll."
		],
		es: [
			'El Montalt es un contrafuerte de la Serralada Litoral, en el [Maresme](/comarques/maresme), situado entre la sierra del Corredor y el Montnegre. Según la Viquipèdia, se lo reparten tres términos: Dosrius, al norte, que es donde cae la cima; Sant Andreu de Llavaneres, al suroeste, y Sant Vicenç de Montalt, al sureste. Con la sierra del Corredor forma el macizo del Corredor, unido por el coll del Bruc y la creu de Rupit. La otra cima esencial del Maresme es [el castell de Burriac](/cims/castell-de-burriac).',
			'Donde se suele llegar no es exactamente el punto más alto, sino un poco más a levante, donde hay un vértice geodésico de primer orden sobre una losa de piedra. La Viquipèdia explica que hay un buzón donde los excursionistas dejan escrito su nombre y la fecha, y que por Navidad es tradición subir un pequeño belén.',
			'Es una montaña de muchas entradas. Surt de Casa recuerda que se sube desde cualquiera de los pueblos que la rodean, Sant Andreu de Llavaneres, Dosrius, Arenys de Munt y Sant Vicenç de Montalt, y propone dos rutas. Todas acaban igual: se deja la pista forestal y se toma uno de los tres senderos que suben a la cima, desde el coll de la Ferradura, desde el coll de Paietes o desde la Brolleta de Montalt.',
			'Se puede hacer en cualquier época del año. La Viquipèdia avisa de que la subida no tiene mucha dificultad hasta los senderos finales, donde hay piedras que resbalan cuando el suelo está mojado.'
		]
	},
	rutes: [
		{
			id: 'llavaneres',
			nom: {
				ca: 'Des de Sant Andreu de Llavaneres pel parc de la Font de la Llorita',
				es: 'Desde Sant Andreu de Llavaneres por el parque de la Font de la Llorita'
			},
			sortida: { nom: 'Parc de la Font de la Llorita (Sant Andreu de Llavaneres)' },
			descripcio: {
				ca: "És una de les deu excursions pel Maresme que tria Surt de Casa. Surt del poble pel parc de la Font de la Llorita i el camí de les masies de Llavaneres, i s'endinsa per corriols i pistes fins al Montalt. La tornada passa pel cementiri i per l'ermita de Sant Sebastià. La revista no en publica la distància, el desnivell ni l'horari.",
				es: 'Es una de las diez excursiones por el Maresme que elige Surt de Casa. Sale del pueblo por el parque de la Font de la Llorita y el camino de las masías de Llavaneres, y se adentra por senderos y pistas hasta el Montalt. La vuelta pasa por el cementerio y por la ermita de Sant Sebastià. La revista no publica la distancia, el desnivel ni el horario.'
			},
			fonts: [SURTDECASA, VIQUIPEDIA]
		},
		{
			id: 'arenys-de-munt',
			nom: {
				ca: "Des d'Arenys de Munt pel parc de Lourdes",
				es: 'Desde Arenys de Munt por el parque de Lourdes'
			},
			sortida: { nom: 'Parc de Lourdes (Arenys de Munt)' },
			descripcio: {
				ca: "L'altra proposta de Surt de Casa comença al parc de Lourdes d'Arenys de Munt, segueix el cartell del parc del Montnegre i trenca a l'esquerra per anar pujant fins a una cruïlla. Segons la revista, el camí cap al Montalt està ben indicat i la baixada també se segueix amb facilitat.",
				es: 'La otra propuesta de Surt de Casa empieza en el parque de Lourdes de Arenys de Munt, sigue el cartel del parque del Montnegre y gira a la izquierda para ir subiendo hasta un cruce. Según la revista, el camino hacia el Montalt está bien indicado y la bajada también se sigue con facilidad.'
			},
			fonts: [SURTDECASA]
		}
	],
	consells: {
		ca: [
			'Després de ploure, vigila les pedres dels corriols finals, que és on rellisca.',
			'Cap de les dues rutes publicades porta distància ni horari: mesura-la abans sobre un mapa de la zona i tria el poble de sortida segons el temps que tinguis.',
			'El vèrtex i la bústia són una mica a llevant del punt més alt: si arribes a dalt i no els veus, continua uns metres per la carena.',
			"Si hi puges per Nadal i trobes el pessebre, deixa'l on és.",
			"Si no coneixes la zona, tingues present que la ruta d'Arenys de Munt, segons Surt de Casa, està ben indicada."
		],
		es: [
			'Después de llover, vigila las piedras de los senderos finales, que es donde resbala.',
			'Ninguna de las dos rutas publicadas lleva distancia ni horario: mídela antes sobre un mapa de la zona y elige el pueblo de salida según el tiempo que tengas.',
			'El vértice y el buzón están un poco a levante del punto más alto: si llegas arriba y no los ves, continúa unos metros por la loma.',
			'Si subes por Navidad y encuentras el belén, déjalo donde está.',
			'Si no conoces la zona, ten presente que la ruta de Arenys de Munt, según Surt de Casa, está bien indicada.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Per on es puja al Montalt?',
				resposta:
					"Des de qualsevol dels pobles del voltant. Surt de Casa descriu una ruta des de Sant Andreu de Llavaneres i una altra des d'Arenys de Munt; en tots els casos, el final és un dels tres corriols que deixen la pista forestal al coll de la Ferradura, al coll de Paietes o a la Brolleta de Montalt."
			},
			{
				pregunta: 'Quant es triga a pujar al Montalt?',
				resposta:
					"Depèn molt del poble de sortida, i les ressenyes que recollim no en donen l'horari. Calcula-ho sobre el mapa abans de sortir."
			},
			{
				pregunta: 'A quin municipi és el cim del Montalt?',
				resposta:
					'El cim és de Dosrius, però la muntanya es reparteix també entre Sant Andreu de Llavaneres i Sant Vicenç de Montalt.'
			},
			{
				pregunta: 'Què hi ha dalt del Montalt?',
				resposta:
					"Un vèrtex geodèsic de primer ordre sobre una llosa de pedra i una bústia per deixar-hi constància de l'ascensió, segons la Viquipèdia. Per Nadal, s'hi puja un pessebre."
			}
		],
		es: [
			{
				pregunta: '¿Por dónde se sube al Montalt?',
				resposta:
					'Desde cualquiera de los pueblos de alrededor. Surt de Casa describe una ruta desde Sant Andreu de Llavaneres y otra desde Arenys de Munt; en todos los casos, el final es uno de los tres senderos que dejan la pista forestal en el coll de la Ferradura, en el coll de Paietes o en la Brolleta de Montalt.'
			},
			{
				pregunta: '¿Cuánto se tarda en subir al Montalt?',
				resposta:
					'Depende mucho del pueblo de salida, y las reseñas que recogemos no dan el horario. Calcúlalo sobre el mapa antes de salir.'
			},
			{
				pregunta: '¿En qué municipio está la cima del Montalt?',
				resposta:
					'La cima es de Dosrius, pero la montaña se reparte también entre Sant Andreu de Llavaneres y Sant Vicenç de Montalt.'
			},
			{
				pregunta: '¿Qué hay en lo alto del Montalt?',
				resposta:
					'Un vértice geodésico de primer orden sobre una losa de piedra y un buzón para dejar constancia de la ascensión, según la Viquipèdia. Por Navidad se sube un belén.'
			}
		]
	},
	fonts: [VIQUIPEDIA, SURTDECASA],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
