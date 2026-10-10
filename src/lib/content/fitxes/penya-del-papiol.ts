import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const OLERDOLA = {
	nom: "Ajuntament d'Olèrdola: el Papiol",
	url: 'https://www.olerdola.cat/guia/marcador/el-papiol',
	consultat: CONSULTAT
};

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Penya del Papiol',
	url: 'https://ca.wikipedia.org/wiki/Penya_del_Papiol',
	consultat: CONSULTAT
};

const XIRUCA = {
	nom: 'Xiruca: circular a la Penya del Papiol',
	url: 'https://www.xiruca.com/sites/default/files/track/PenyaPapiol_imprimir.pdf',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'penya-del-papiol',
	descripcio: {
		ca: [
			"La Penya del Papiol és un turó del municipi d'Olèrdola, a l'[Alt Penedès](/comarques/alt-penedes), i un contrafort de la Serralada Litoral. L'Ajuntament d'Olèrdola el descriu com una talaia formidable sobre la depressió del Penedès, i explica que el nom ve de pòpia, una paraula per a un turó baix i arrodonit, de base ampla; el 992 ja apareix documentat com a terme de Viladellops. A la mateixa comarca hi ha un altre cim essencial: [el Castellot](/cims/el-castellot).",
			"La Viquipèdia en recorda el vèrtex geodèsic i que és un cim essencial del repte. Segons l'Ajuntament, des del cim es veu la serralada Prelitoral i Montserrat, una catifa de vinyes i Vilafranca del Penedès, i, cap al mar, el massís del Garraf i les vessants boscoses de la costa.",
			"La ruta de Xiruca és una circular de dificultat baixa entre vinyes que passa per l'ermita romànica del Sant Sepulcre, del segle XII i de propietat particular, que no es pot visitar però es veu bé des del camí. Surt de Sant Miquel d'Olèrdola, on es deixa el cotxe davant de l'ajuntament, i arriba al cim a l'1 h 20 min. El darrer tram abans de la cima és una senda estreta d'uns 110 m de desnivell en pujada contínua, que surt de la finca de Cal Jesús.",
			"A la tornada, pel GR 92.3, la guia descriu un descens marcat per una senda pedregosa i en alguns punts desfeta, amb un petit pas de roca inclinat on hi ha una corda instal·lada per ajudar a baixar-lo. El camí passa per sobre la pedrera d'Olèrdola."
		],
		es: [
			'La Penya del Papiol es un cerro del municipio de Olèrdola, en el [Alt Penedès](/comarques/alt-penedes), y un contrafuerte de la Serralada Litoral. El Ayuntamiento de Olèrdola lo describe como una atalaya formidable sobre la depresión del Penedès, y explica que el nombre viene de pòpia, una palabra para un cerro bajo y redondeado, de base ancha; en 992 ya aparece documentado como término de Viladellops. En la misma comarca hay otra cima esencial: [el Castellot](/cims/el-castellot).',
			'La Viquipèdia recuerda su vértice geodésico y que es una cima esencial del reto. Según el Ayuntamiento, desde la cima se ve la cordillera Prelitoral y Montserrat, una alfombra de viñas y Vilafranca del Penedès, y, hacia el mar, el macizo del Garraf y las vertientes boscosas de la costa.',
			"La ruta de Xiruca es una circular de dificultad baja entre viñas que pasa por la ermita románica del Sant Sepulcre, del siglo XII y de propiedad particular, que no se puede visitar pero se ve bien desde el camino. Sale de Sant Miquel d'Olèrdola, donde se deja el coche frente al ayuntamiento, y llega a la cima a la 1 h 20 min. El último tramo antes de la cima es una senda estrecha de unos 110 m de desnivel en subida continua, que sale de la finca de Cal Jesús.",
			'A la vuelta, por el GR 92.3, la guía describe un descenso marcado por una senda pedregosa y en algunos puntos deshecha, con un pequeño paso de roca inclinado donde hay una cuerda instalada para ayudar a bajarlo. El camino pasa por encima de la cantera de Olèrdola.'
		]
	},
	rutes: [
		{
			id: 'sant-miquel-d-olerdola',
			nom: {
				ca: "Circular des de Sant Miquel d'Olèrdola pel Sant Sepulcre",
				es: "Circular desde Sant Miquel d'Olèrdola por el Sant Sepulcre"
			},
			sortida: { nom: "Aparcament de Sant Miquel d'Olèrdola, davant de l'ajuntament" },
			tempsMinuts: 80,
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Xiruca la dona com a circular de dificultat baixa, d'uns 8 km, +350 m i 2 h sense parades en total, i recomana el mapa del Parc del Foix i el Parc d'Olèrdola d'Editorial Piolet. S'arriba a la Penya del Papiol a l'1 h 20 min de marxa. La pujada final és una senda estreta d'uns 110 m de desnivell; la baixada pel GR 92.3 és pedregosa i té un petit pas de roca inclinat amb una corda instal·lada. Les xifres de distància i desnivell són de la circular sencera.",
				es: "Xiruca la da como circular de dificultad baja, de unos 8 km, +350 m y 2 h sin paradas en total, y recomienda el mapa del Parc del Foix y el Parc d'Olèrdola de Editorial Piolet. Se llega a la Penya del Papiol a la 1 h 20 min de marcha. La subida final es una senda estrecha de unos 110 m de desnivel; la bajada por el GR 92.3 es pedregosa y tiene un pequeño paso de roca inclinado con una cuerda instalada. Las cifras de distancia y desnivel son de la circular entera."
			},
			fonts: [XIRUCA]
		}
	],
	consells: {
		ca: [
			'A la baixada pel GR 92.3 hi ha un petit pas de roca inclinat amb corda instal·lada, segons Xiruca: baixa-hi amb calma i no ho facis amb la roca mullada.',
			"L'ermita del Sant Sepulcre és de propietat particular i no es pot visitar: mira-la des del camí.",
			"Xiruca recomana el mapa del Parc del Foix i el Parc d'Olèrdola, d'Editorial Piolet, a 1:20.000.",
			'Al darrer tram, una senda estreta surt de la finca de Cal Jesús: segueix el cartell que ho indica.',
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'En la bajada por el GR 92.3 hay un pequeño paso de roca inclinado con cuerda instalada, según Xiruca: baja con calma y no lo hagas con la roca mojada.',
			'La ermita del Sant Sepulcre es de propiedad particular y no se puede visitar: mírala desde el camino.',
			"Xiruca recomienda el mapa del Parc del Foix y el Parc d'Olèrdola, de Editorial Piolet, a 1:20.000.",
			'En el último tramo, una senda estrecha sale de la finca de Cal Jesús: sigue el cartel que lo indica.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Penya del Papiol?',
				resposta:
					"Xiruca compta 1 h 20 min fins al cim des de l'aparcament de Sant Miquel d'Olèrdola, dins d'una circular d'uns 8 km, +350 m i 2 h sense parades."
			},
			{
				pregunta: 'La Penya del Papiol és difícil?',
				resposta:
					'Xiruca la classifica de dificultat baixa, però a la baixada pel GR 92.3 hi ha un petit pas de roca inclinat amb una corda instal·lada.'
			},
			{
				pregunta: "Es pot visitar l'ermita del Sant Sepulcre?",
				resposta:
					'No: segons Xiruca és de propietat particular i no es pot visitar, però es veu bé des del camí.'
			},
			{
				pregunta: 'La Penya del Papiol és un cim essencial?',
				resposta:
					"Sí. A l'[Alt Penedès](/comarques/alt-penedes) l'acompanya [el Castellot](/cims/el-castellot)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Penya del Papiol?',
				resposta:
					"Xiruca cuenta 1 h 20 min hasta la cima desde el aparcamiento de Sant Miquel d'Olèrdola, dentro de una circular de unos 8 km, +350 m y 2 h sin paradas."
			},
			{
				pregunta: '¿La Penya del Papiol es difícil?',
				resposta:
					'Xiruca la clasifica de dificultad baja, pero en la bajada por el GR 92.3 hay un pequeño paso de roca inclinado con una cuerda instalada.'
			},
			{
				pregunta: '¿Se puede visitar la ermita del Sant Sepulcre?',
				resposta:
					'No: según Xiruca es de propiedad particular y no se puede visitar, pero se ve bien desde el camino.'
			},
			{
				pregunta: '¿La Penya del Papiol es una cima esencial?',
				resposta:
					'Sí. En el [Alt Penedès](/comarques/alt-penedes) la acompaña [el Castellot](/cims/el-castellot).'
			}
		]
	},
	fonts: [OLERDOLA, VIQUIPEDIA, XIRUCA],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
