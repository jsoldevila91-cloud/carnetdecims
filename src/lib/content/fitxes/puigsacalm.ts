import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puigsacalm',
	url: 'https://ca.wikipedia.org/wiki/Puigsacalm',
	consultat: CONSULTAT
};

const MONTEDITORIAL = {
	nom: 'Monteditorial: Puigsacalm des de Bracons',
	url: 'https://www.monteditorial.cat/producte/puigsacalm-des-de-bracons/',
	consultat: CONSULTAT
};

const FEMTURISME = {
	nom: 'Femturisme: Puigsacalm des del coll de Bracons',
	url: 'https://femturisme.cat/en/routes/puigsacalm-from-coll-de-bracons',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: Puigsacalm des de la collada de Bracons amb nens',
	url: 'https://totnens.cat/que-fem/puigsacalm/',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS_JOANETES = {
	nom: 'Rutas Pirineos: Puigsacalm y Puig dels Llops desde Joanetes',
	url: 'https://www.rutaspirineos.org/rutas/puigsacalm-y-puig-dels-llops-desde-joanetes',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puigsacalm',
	descripcio: {
		ca: [
			"El Puigsacalm és el punt més alt de la serralada Transversal i un dels grans cims [de la Garrotxa](/comarques/garrotxa). És al terme de la Vall d'en Bas, sobre la vall del Ter i la plana d'en Bas, i forma part de l'espai protegit de les serres de Milany-Santa Magdalena i Puigsacalm-Bellmunt. Per la banda de la Vall d'en Bas, la muntanya cau en cingleres verticals; per la banda de Vidrà i Bracons, en canvi, mostra un llom suau de prats i fagedes.",
			"El cim, de margues i gresos, té un vèrtex geodèsic i una història científica poc coneguda: a finals del segle XVIII s'hi van fer observacions i triangulacions per mesurar el meridià de Dunkerque a Barcelona, el treball que va permetre definir la longitud del metre. A pocs minuts al nord hi ha el Puig dels Llops, el cim bessó, que molta gent hi afegeix. La pujada des de la collada de Bracons és una de les excursions més populars de la comarca, sobretot a la tardor, quan la fageda canvia de color.",
			'Des de dalt es veu gairebé tota la Garrotxa, el Pirineu oriental i bona part de les comarques gironines i de la Catalunya central; la ruta de Monteditorial esmenta també la Serralada Litoral i el cap de Creus. Cap al nord-oest hi ha la serra de Milany i, una mica més enllà, el [castell de Milany](/cims/castell-de-milany), i al sud, ja al Collsacabra, el cingle de [Cabrera](/cims/cabrera).',
			"A l'hivern hi pot haver neu i glaç al tram de fageda, i els prats oberts dels Rasos de Manter es tornen fàcilment desorientadors amb boira, que en aquesta zona és freqüent. La tardor és l'època preferida per la fageda."
		],
		es: [
			"El Puigsacalm es el punto más alto de la cordillera Transversal y una de las grandes cimas [de la Garrotxa](/comarques/garrotxa). Está en el municipio de la Vall d'en Bas, sobre el valle del Ter y la llanura de En Bas, y forma parte del espacio protegido de las sierras de Milany-Santa Magdalena y Puigsacalm-Bellmunt. Por el lado de la Vall d'en Bas, la montaña cae en riscos verticales; por el lado de Vidrà y Bracons, en cambio, muestra un lomo suave de prados y hayedos.",
			'La cima, de margas y areniscas, tiene un vértice geodésico y una historia científica poco conocida: a finales del siglo XVIII se hicieron observaciones y triangulaciones para medir el meridiano de Dunkerque a Barcelona, el trabajo que permitió definir la longitud del metro. A pocos minutos al norte está el Puig dels Llops, la cima gemela, que mucha gente añade. La subida desde la collada de Bracons es una de las excursiones más populares de la comarca, sobre todo en otoño, cuando el hayedo cambia de color.',
			'Desde arriba se ve casi toda la Garrotxa, el Pirineo oriental y buena parte de las comarcas gerundenses y de la Cataluña central; la ruta de Monteditorial menciona también la Cordillera Litoral y el cap de Creus. Hacia el noroeste está la sierra de Milany y, un poco más allá, el [castell de Milany](/cims/castell-de-milany), y al sur, ya en el Collsacabra, el risco de [Cabrera](/cims/cabrera).',
			'En invierno puede haber nieve y hielo en el tramo de hayedo, y los prados abiertos de los Rasos de Manter se vuelven fácilmente desorientadores con niebla, que en esta zona es frecuente. El otoño es la época preferida por el hayedo.'
		]
	},
	rutes: [
		{
			id: 'collada-de-bracons',
			nom: { ca: 'Des de la collada de Bracons', es: 'Desde la collada de Bracons' },
			sortida: { nom: 'Collada de Bracons (aparcament)' },
			desnivellPositiuM: 420,
			distanciaKm: 4,
			tempsMinuts: 120,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "És la ruta clàssica i la més fàcil. De l'aparcament de la collada, el primer tram és el més dret i rocallós; després el camí, senyalitzat amb les marques del GR 151.1 i grogues, es suavitza per la collada de Sant Bartomeu i la font Tornadissa, travessa els prats dels Rasos de Manter i torna a entrar a la fageda per arribar al cim. Monteditorial la considera una ruta familiar; es torna pel mateix camí, amb 1 h 30 min de baixada.",
				es: 'Es la ruta clásica y la más fácil. Desde el aparcamiento de la collada, el primer tramo es el más empinado y rocoso; después el camino, señalizado con las marcas del GR 151.1 y amarillas, se suaviza por la collada de Sant Bartomeu y la font Tornadissa, cruza los prados de los Rasos de Manter y vuelve a entrar en el hayedo para llegar a la cima. Monteditorial la considera una ruta familiar; se vuelve por el mismo camino, con 1 h 30 min de bajada.'
			},
			fonts: [MONTEDITORIAL, FEMTURISME, TOTNENS]
		},
		{
			id: 'joanetes-ganxos',
			nom: {
				ca: 'Des de Joanetes pels Ganxos Nous',
				es: 'Desde Joanetes por los Ganxos Nous'
			},
			sortida: { nom: "Església de Sant Romà de Joanetes (la Vall d'en Bas)" },
			tempsMinuts: 285,
			tecnicitat: 'via-equipada',
			descripcio: {
				ca: "Ruta de muntanya per a gent experimentada, des del fons de la vall. Puja per l'ermita de Santa Magdalena del Mont i el pas dels Burros, amb una corda, i supera la cinglera per la canal dels Ganxos Nous, equipada amb graons metàl·lics i passamans. Rutas Pirineos hi compta 4 h 45 min fins al Puigsacalm i avisa de passos aeris, desaconsellats amb vertigen i perillosos amb la roca mullada.",
				es: 'Ruta de montaña para gente experimentada, desde el fondo del valle. Sube por la ermita de Santa Magdalena del Mont y el pas dels Burros, con una cuerda, y supera el risco por la canal de los Ganxos Nous, equipada con peldaños metálicos y pasamanos. Rutas Pirineos calcula 4 h 45 min hasta el Puigsacalm y avisa de pasos aéreos, desaconsejados con vértigo y peligrosos con la roca mojada.'
			},
			fonts: [RUTES_PIRINEUS_JOANETES]
		}
	],
	consells: {
		ca: [
			"L'aparcament de la collada de Bracons és a la carretera entre la Vall d'en Bas i Vic; els caps de setmana, i sobretot a la tardor, convé arribar-hi d'hora.",
			'Amb boira, vigila als Rasos de Manter: són prats oberts on és fàcil perdre el camí, com adverteix Femturisme.',
			'Si vas amb nens, fes amb calma el primer tram, que és el que té més pendent.',
			'La via dels Ganxos només és per a qui té experiència en passos equipats i no té vertigen; amb la roca mullada, evita-la.',
			"A l'hivern, amb neu o glaç a la fageda, porta calçat adequat i informa't de l'estat del camí."
		],
		es: [
			"El aparcamiento de la collada de Bracons está en la carretera entre la Vall d'en Bas y Vic; los fines de semana, y sobre todo en otoño, conviene llegar temprano.",
			'Con niebla, ten cuidado en los Rasos de Manter: son prados abiertos donde es fácil perder el camino, como advierte Femturisme.',
			'Si vas con niños, haz con calma el primer tramo, que es el que tiene más pendiente.',
			'La vía de los Ganxos solo es para quien tiene experiencia en pasos equipados y no tiene vértigo; con la roca mojada, evítala.',
			'En invierno, con nieve o hielo en el hayedo, lleva calzado adecuado e infórmate del estado del camino.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puigsacalm des de Bracons?',
				resposta:
					'Segons Monteditorial, són 4 km i 420 m de desnivell, amb unes 2 h de pujada i 1 h 30 min de baixada pel mateix camí. Femturisme compta entre 3 h 30 min i 4 h 30 min per a tota la sortida.'
			},
			{
				pregunta: 'Es pot pujar al Puigsacalm amb nens?',
				resposta:
					"Sí, des de la collada de Bracons, amb nens que ja estiguin acostumats a caminar: Monteditorial la classifica com a ruta familiar i Totnens la recomana prenent-s'ho amb calma al primer tram, el més dret. La via de Joanetes no és per a nens."
			},
			{
				pregunta: 'Quina diferència hi ha entre el Puigsacalm i el Puig dels Llops?',
				resposta:
					"Són dos cims veïns de la mateixa carena. El Puigsacalm és el més alt i el que compta per al repte; el Puig dels Llops és a pocs minuts al nord i molta gent l'hi afegeix."
			},
			{
				pregunta: 'El Puigsacalm compta com a cim essencial?',
				resposta:
					'Sí. És un dels quatre [cims essencials](/cims-essencials) de la Garrotxa i el segon més alt després del Comanegra. Per validar-lo has d’arribar al vèrtex del Puigsacalm: el Puig dels Llops no és a la llista.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puigsacalm desde Bracons?',
				resposta:
					'Según Monteditorial, son 4 km y 420 m de desnivel, con unas 2 h de subida y 1 h 30 min de bajada por el mismo camino. Femturisme calcula entre 3 h 30 min y 4 h 30 min para toda la salida.'
			},
			{
				pregunta: '¿Se puede subir al Puigsacalm con niños?',
				resposta:
					'Sí, desde la collada de Bracons, con niños que ya estén acostumbrados a caminar: Monteditorial la clasifica como ruta familiar y Totnens la recomienda tomándoselo con calma en el primer tramo, el más empinado. La vía de Joanetes no es para niños.'
			},
			{
				pregunta: '¿Qué diferencia hay entre el Puigsacalm y el Puig dels Llops?',
				resposta:
					'Son dos cimas vecinas de la misma cresta. El Puigsacalm es la más alta y la que cuenta para el reto; el Puig dels Llops está a pocos minutos al norte y mucha gente lo añade.'
			},
			{
				pregunta: '¿El Puigsacalm cuenta como cima esencial?',
				resposta:
					'Sí. Es una de las cuatro [cimas esenciales](/cims-essencials) de la Garrotxa y la segunda más alta después del Comanegra. Para validarla tienes que llegar al vértice del Puigsacalm: el Puig dels Llops no está en la lista.'
			}
		]
	},
	fonts: [VIQUIPEDIA, MONTEDITORIAL, FEMTURISME, TOTNENS, RUTES_PIRINEUS_JOANETES],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
