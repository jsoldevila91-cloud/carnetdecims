import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Punta de Montmaneu',
	url: 'https://ca.wikipedia.org/wiki/Punta_de_Montmaneu',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Montmeneu',
	url: 'https://reptesmuntanyencs.cat/montmeneu/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'punta-de-montmaneu',
	descripcio: {
		ca: [
			"La Punta de Montmaneu és una muntanya aïllada de l'extrem occidental de la Depressió Central, al terme de Seròs, [al Segrià](/comarques/segria). Com que tot el que l'envolta és relativament pla, es veu des de molt lluny i, de dalt estant, la vista sobre la plana és molt àmplia els dies clars. És de gres, argila i guix, té un vèrtex geodèsic al cim i dona nom a l'espai natural dels tossals de Montmaneu.",
			"És el cim emblemàtic de la comarca i molta gent el té pel sostre del Segrià, tot i que el puntal dels Escambrons, a Almatret, és uns metres més alt. El nom s'ha escrit sovint Montmeneu, i així consta a la llista del repte; la forma que recull la toponímia és Montmaneu, com el poble de l'Anoia.",
			"A pocs quilòmetres hi ha la Granja d'Escarp i l'aiguabarreig del Segre i el Cinca, un espai fluvial que val la pena lligar amb la pujada. El cim és l'únic essencial del Segrià; a la comarca veïna de les Garrigues hi ha [els Bessons](/cims/els-bessons).",
			'És una excursió curta de mig matí, per pistes entre camps i masades. Convé triar un dia net: amb boira o calitja el cim perd tota la gràcia.'
		],
		es: [
			'La Punta de Montmaneu es una montaña aislada del extremo occidental de la Depresión Central, en el término de Seròs, [en el Segrià](/comarques/segria). Como todo lo que la rodea es relativamente llano, se ve desde muy lejos y, desde arriba, la vista sobre el llano es muy amplia en los días claros. Es de arenisca, arcilla y yeso, tiene un vértice geodésico en la cima y da nombre al espacio natural de los tossals de Montmaneu.',
			'Es la cima emblemática de la comarca y mucha gente la tiene por el techo del Segrià, aunque el puntal dels Escambrons, en Almatret, es unos metros más alto. El nombre se ha escrito a menudo Montmeneu, y así consta en la lista del reto; la forma que recoge la toponimia es Montmaneu, como el pueblo de la Anoia.',
			"A pocos kilómetros están la Granja d'Escarp y el aiguabarreig del Segre y el Cinca, un espacio fluvial que merece la pena enlazar con la subida. La cima es la única esencial del Segrià; en la comarca vecina de las Garrigues están [els Bessons](/cims/els-bessons).",
			'Es una excursión corta de media mañana, por pistas entre campos y masadas. Conviene elegir un día limpio: con niebla o calima la cima pierde toda su gracia.'
		]
	},
	rutes: [
		{
			id: 'mas-de-l-hereu',
			nom: {
				ca: "Circular des del mas de l'Hereu",
				es: "Circular desde el mas de l'Hereu"
			},
			sortida: { nom: "Mas de l'Hereu (Seròs)" },
			descripcio: {
				ca: "La ressenya del bloc Reptes Muntanyencs (2013) fa una circular de 8 km i 248 m de desnivell positiu en 2 h 28 min de marxa, amb el cim a 4,9 km de la sortida. Del mas se segueixen pistes cap al sud-oest, entre camps i masades, fins a un pal indicador del Montmeneu; d'allà una pista porta a una antena i, poc després, un sender curt i molt dret puja al cim. Es baixa pel mateix sender i es torna per la carena cap al nord-oest i per la pista de la vall de Dana, que comença bé i de seguida es fa dolenta. Per arribar al mas hi ha 600 m de pista de terra que poden demanar un vehicle alt.",
				es: 'La reseña del blog Reptes Muntanyencs (2013) hace una circular de 8 km y 248 m de desnivel positivo en 2 h 28 min de marcha, con la cima a 4,9 km de la salida. Desde el mas se siguen pistas hacia el suroeste, entre campos y masadas, hasta un poste indicador del Montmeneu; desde allí una pista lleva a una antena y, poco después, un sendero corto y muy empinado sube a la cima. Se baja por el mismo sendero y se vuelve por la cresta hacia el noroeste y por la pista de la vall de Dana, que empieza bien y enseguida empeora. Para llegar al mas hay 600 m de pista de tierra que pueden pedir un vehículo alto.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'No hi ha aigua en tot el recorregut: porta-la tota des de la sortida.',
			'Les pistes es bifurquen sovint i la senyalització és parcial: porta el track.',
			"Per aquestes pistes hi circulen motos de trial; para l'orella als revolts.",
			'Si vols fer també el puntal dels Escambrons, és a Almatret, a una vintena de quilòmetres per carretera.'
		],
		es: [
			'No hay agua en todo el recorrido: llévala toda desde la salida.',
			'Las pistas se bifurcan a menudo y la señalización es parcial: lleva el track.',
			'Por estas pistas circulan motos de trial; atento en las curvas.',
			'Si quieres hacer también el puntal dels Escambrons, está en Almatret, a una veintena de kilómetros por carretera.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Punta de Montmaneu?',
				resposta:
					"El bloc Reptes Muntanyencs hi va arribar en una hora i mitja, aturades incloses, després de 4,9 km des del mas de l'Hereu. La circular sencera fa 8 km i 248 m de desnivell."
			},
			{
				pregunta: 'És el sostre del Segrià?',
				resposta:
					"És el cim més conegut de la comarca i sovint se'l presenta així, però el puntal dels Escambrons, a Almatret, és uns metres més alt."
			},
			{
				pregunta: "S'escriu Montmaneu o Montmeneu?",
				resposta:
					'La toponímia recull Montmaneu; la forma Montmeneu, molt estesa i present a la llista del repte, es considera una hipercorrecció.'
			},
			{
				pregunta: 'Compta com a cim essencial?',
				resposta:
					"Sí, és l'únic [cim essencial](/cims-essencials) del Segrià a la llista del repte."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Punta de Montmaneu?',
				resposta:
					"El blog Reptes Muntanyencs llegó en una hora y media, paradas incluidas, tras 4,9 km desde el mas de l'Hereu. La circular entera tiene 8 km y 248 m de desnivel."
			},
			{
				pregunta: '¿Es el techo del Segrià?',
				resposta:
					'Es la cima más conocida de la comarca y a menudo se la presenta así, pero el puntal dels Escambrons, en Almatret, es unos metros más alto.'
			},
			{
				pregunta: '¿Se escribe Montmaneu o Montmeneu?',
				resposta:
					'La toponimia recoge Montmaneu; la forma Montmeneu, muy extendida y presente en la lista del reto, se considera una hipercorrección.'
			},
			{
				pregunta: '¿Cuenta como cima esencial?',
				resposta:
					'Sí, es la única [cima esencial](/cims-essencials) del Segrià en la lista del reto.'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
