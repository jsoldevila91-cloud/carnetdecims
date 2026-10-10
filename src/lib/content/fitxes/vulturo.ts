import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Vulturó',
	url: 'https://ca.wikipedia.org/wiki/Vulturó',
	consultat: CONSULTAT
};

const VIQUIPEDIA_CADI = {
	nom: 'Viquipèdia: serra del Cadí',
	url: 'https://ca.wikipedia.org/wiki/Serra_del_Cad%C3%AD',
	consultat: CONSULTAT
};

const SUBIRCUMBRES = {
	nom: 'Subir cumbres: Torreta del Cadí (2562 m) y Vulturó (2650 m)',
	url: 'https://subircumbres.com/2023/07/12/torreta-del-cadi-2562m-y-vulturo-2650m/',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS_CADINELL = {
	nom: 'Rutes Pirineus: El Cadinell (2.113 m) des de Josa de Cadí',
	url: 'https://www.rutespirineus.cat/rutes/el-cadinell-des-de-josa-de-cadi',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'vulturo',
	descripcio: {
		ca: [
			"El Vulturó, també anomenat Puig de la Canal Baridana, és el cim més alt de la serra del Cadí i de tot el Prepirineu català. S'alça al Parc Natural del Cadí-Moixeró, entre els termes de Josa i Tuixén i de Cava, a [l'Alt Urgell](/comarques/alt-urgell). Té una prominència de 871 metres, de manera que domina un territori molt ampli: a la banda nord, la serra cau en una cinglera de més de 500 metres sobre el Baridà; a la banda sud, el relleu és més suau.",
			"El Cadí és una serra llarga, d'uns 22,6 km d'est a oest, formada sobretot per calcàries i margues, amb calcàries eocenes als cims. El Vulturó és el punt més alt d'aquesta carena i té al costat altres cims coneguts, com la Torreta del Cadí, el Pujolar de Roca Grossa i el Costa Cabirolera. La precipitació supera els 1.200 mm l'any, bona part en forma de neu, i la vegetació passa de la pineda de pi roig i de pi negre, que arriba als 2.000–2.100 m, a les pastures de muntanya. Cap a llevant hi ha el [Comabona](/cims/comabona), l'altre essencial del Cadí.",
			"Com que no té cap cim més alt a gairebé 19 km a la rodona, la vista queda oberta cap a tots els costats. Pujant per la Torreta del Cadí, Subir cumbres hi destaca la cara nord, molt vertical, amb canals dretes i estrats inclinats; des del Vulturó, cap a l'est, la silueta del Costa Cabirolera, el tercer cim de la serra.",
			"És una excursió de dia llarg, amb una pujada forta i constant. Convé fer-la sense neu, a l'estiu o a principis de tardor: segons la Viquipèdia, als cims del Cadí la neu sol durar de novembre a abril. Amb neu, el Cadí passa a ser alta muntanya: hi ha risc d'allaus i cal material d'hivern i experiència; consulta la predicció de Meteocat i l'estat de la neu abans de sortir."
		],
		es: [
			'El Vulturó, también llamado Puig de la Canal Baridana, es la cima más alta de la sierra del Cadí y de todo el Prepirineo catalán. Se alza en el Parque Natural del Cadí-Moixeró, entre los términos de Josa i Tuixén y de Cava, en [el Alt Urgell](/comarques/alt-urgell). Tiene una prominencia de 871 metros, de modo que domina un territorio muy amplio: por el norte, la sierra cae en un cantil de más de 500 metros sobre el Baridà; por el sur, el relieve es más suave.',
			'El Cadí es una sierra larga, de unos 22,6 km de este a oeste, formada sobre todo por calizas y margas, con calizas eocenas en las cimas. El Vulturó es el punto más alto de esa cresta y tiene al lado otras cimas conocidas, como la Torreta del Cadí, el Pujolar de Roca Grossa y el Costa Cabirolera. La precipitación supera los 1.200 mm al año, buena parte en forma de nieve, y la vegetación pasa del pinar de pino silvestre y de pino negro, que llega a los 2.000–2.100 m, a los pastos de montaña. Hacia levante está el [Comabona](/cims/comabona), la otra esencial del Cadí.',
			'Como no tiene ninguna cima más alta en casi 19 km a la redonda, la vista queda abierta hacia todos los lados. Subiendo por la Torreta del Cadí, Subir cumbres destaca su cara norte, muy vertical, con canales empinadas y estratos inclinados; desde el Vulturó, hacia el este, la silueta del Costa Cabirolera, la tercera cima de la sierra.',
			'Es una excursión de día largo, con una subida fuerte y constante. Conviene hacerla sin nieve, en verano o a principios de otoño: según la Viquipèdia, en las cimas del Cadí la nieve suele durar de noviembre a abril. Con nieve, el Cadí pasa a ser alta montaña: hay riesgo de aludes y hace falta material de invierno y experiencia; consulta la predicción de Meteocat y el estado de la nieve antes de salir.'
		]
	},
	rutes: [
		{
			id: 'josa-de-cadi',
			nom: {
				ca: 'Des de Josa de Cadí pel coll de Jovell',
				es: 'Desde Josa de Cadí por el coll de Jovell'
			},
			sortida: { nom: "Josa de Cadí (aparcament a l'entrada del poble, 1.393 m)" },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Del poble s'arriba al coll de Jovell (1.792 m) pel GR 150.1, passant per l'església de Santa Maria; fins aquí, Rutes Pirineus ho fa en 1 h 15 min. Més amunt, amb marques de GR i fites però sovint havent de buscar el pas, la pujada és forta per calcària i pedra petita fins a la Torreta del Cadí. D'allà se segueix la carena pel Pujolar de Roca Grossa, el Puig de les Gralleres i el coll de la Canal Baridana. Segons el relat de Subir cumbres, hi ha algun pas on cal posar la mà, una cadena en un pas de roca (a uns 2.200 m) que l'autor troba innecessària i un petit ressalt rocós per accedir al cim; va trigar 4 h 32 min a arribar-hi passant per la Torreta.",
				es: 'Del pueblo se llega al coll de Jovell (1.792 m) por el GR 150.1, pasando por la iglesia de Santa Maria; hasta aquí, Rutes Pirineus lo hace en 1 h 15 min. Más arriba, con marcas de GR e hitos pero a menudo teniendo que buscar el paso, la subida es fuerte por caliza y piedra menuda hasta la Torreta del Cadí. Desde allí se sigue la cresta por el Pujolar de Roca Grossa, el Puig de les Gralleres y el coll de la Canal Baridana. Según el relato de Subir cumbres, hay algún paso en el que hay que echar la mano, una cadena en un paso de roca (a unos 2.200 m) que el autor considera innecesaria y un pequeño resalte rocoso para acceder a la cima; tardó 4 h 32 min en llegar pasando por la Torreta.'
			},
			fonts: [SUBIRCUMBRES, RUTES_PIRINEUS_CADINELL]
		}
	],
	consells: {
		ca: [
			'Segons Rutes Pirineus, a la ruta del Cadinell des de Josa (que comparteix el tram fins al coll de Jovell) no hi ha fonts: porta aigua per a tot el dia.',
			'Per sobre del coll de Jovell hi ha marques i fites, però sovint cal buscar el pas, i la baixada fora de camí que fa Subir cumbres és pesada i amb boix tancat: porta un track descarregat i un mapa 1:25.000.',
			"Amb boira o amb neu al Cadí, no segueixis cap a la carena: l'orientació i el terreny es compliquen.",
			"A l'estiu, surt d'hora: a la carena no hi ha cap refugi per aixoplugar-se si arriben tempestes.",
			'Pertany al Parc Natural del Cadí-Moixeró: respecta la normativa del parc i no deixis residus.'
		],
		es: [
			'Según Rutes Pirineus, en la ruta del Cadinell desde Josa (que comparte el tramo hasta el coll de Jovell) no hay fuentes: lleva agua para todo el día.',
			'Por encima del coll de Jovell hay marcas e hitos, pero a menudo hay que buscar el paso, y la bajada fuera de camino que hace Subir cumbres es pesada y con boj cerrado: lleva un track descargado y un mapa 1:25.000.',
			'Con niebla o con nieve en el Cadí, no sigas hacia la cresta: la orientación y el terreno se complican.',
			'En verano, sal temprano: en la cresta no hay ningún refugio donde resguardarse si llegan tormentas.',
			'Pertenece al Parque Natural del Cadí-Moixeró: respeta la normativa del parque y no dejes residuos.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Vulturó?',
				resposta:
					'Subir cumbres hi va trigar 4 h 32 min des de Josa de Cadí, passant per la Torreta, i 6 h 52 min en tot el recorregut, amb 17,9 km i 1.650 m de desnivell. Fins al coll de Jovell, Rutes Pirineus hi compta 1 h 15 min.'
			},
			{
				pregunta: 'És un cim difícil?',
				resposta:
					'No és una escalada, però la pujada és forta, el camí costa de seguir i, segons Subir cumbres, hi ha algun pas on cal posar la mà i un petit ressalt de roca just abans del cim. Cal bona forma física, saber orientar-se i portar un track.'
			},
			{
				pregunta: 'Es pot pujar amb nens?',
				resposta:
					"No és l'excursió més indicada: l'itinerari de Subir cumbres suma 1.650 m de desnivell, el camí és poc evident i a la pujada des de Josa no hi ha fonts. Millor reservar-la per a joves i adults amb experiència."
			},
			{
				pregunta: 'El Vulturó compta com a cim essencial?',
				resposta:
					"Sí. És el tercer essencial més alt de l'Alt Urgell, després del Pic de Salòria i del Monturull, i el més alt de la serra del Cadí; l'altre essencial de la serra és el [Comabona](/cims/comabona)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Vulturó?',
				resposta:
					'Subir cumbres tardó 4 h 32 min desde Josa de Cadí, pasando por la Torreta, y 6 h 52 min en todo el recorrido, con 17,9 km y 1.650 m de desnivel. Hasta el coll de Jovell, Rutes Pirineus cuenta 1 h 15 min.'
			},
			{
				pregunta: '¿Es una cima difícil?',
				resposta:
					'No es una escalada, pero la subida es fuerte, el camino cuesta de seguir y, según Subir cumbres, hay algún paso en el que hay que echar la mano y un pequeño resalte de roca justo antes de la cima. Hace falta buena forma física, saber orientarse y llevar un track.'
			},
			{
				pregunta: '¿Se puede subir con niños?',
				resposta:
					'No es la excursión más indicada: el itinerario de Subir cumbres suma 1.650 m de desnivel, el camino es poco evidente y en la subida desde Josa no hay fuentes. Mejor reservarla para jóvenes y adultos con experiencia.'
			},
			{
				pregunta: '¿El Vulturó cuenta como cima esencial?',
				resposta:
					'Sí. Es la tercera esencial más alta del Alt Urgell, tras el Pic de Salòria y el Monturull, y la más alta de la sierra del Cadí; la otra esencial de la sierra es el [Comabona](/cims/comabona).'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_CADI, SUBIRCUMBRES, RUTES_PIRINEUS_CADINELL],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
