import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const RUTES_PIRINEUS_SERRA = {
	nom: 'Rutes Pirineus: rutes a la serra de Sant Honorat',
	url: 'https://www.rutespirineus.cat/rutes/serra-de-sant-honorat',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS_CIRCULAR = {
	nom: 'Rutes Pirineus: ruta circular per la Roca de Sant Honorat i Castell-llebre',
	url: 'https://www.rutespirineus.cat/rutes/ruta-circular-serra-de-sant-honorat',
	consultat: CONSULTAT
};

const VIQUIPEDIA_AUBENC = {
	nom: "Viquipèdia: serra d'Aubenç",
	url: "https://ca.wikipedia.org/wiki/Serra_d'Auben%C3%A7",
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'sant-honorat',
	descripcio: {
		ca: [
			"Les Roques de Sant Honorat són un altiplà penjat damunt de Peramola, a [l'Alt Urgell](/comarques/alt-urgell), a l'extrem sud-oest de l'embassament d'Oliana. Formen la serra de Sant Honorat, al sud de la serra d'Aubenç: una mola calcària que es manté per sobre dels 1.050 metres i que acaba en cingles gairebé verticals; a l'extrem nord, la caiguda supera els 250 metres.",
			"Dalt de l'altiplà, a 1.060 m, queden unes parets de l'antiga ermita de Sant Honorat; segons Rutes Pirineus, el marc de la porta té gravada la data 1725. Entre el coll i la roca s'alça el Roc de la Presó o Picapoll, que, segons la tradició que recull la mateixa ressenya, va servir de presó natural durant les guerres carlines, perquè només té un accés. A la baixada, l'església romànica de Santa Maria de Castell-llebre, documentada l'any 995, s'aguanta a la vora d'un cingle.",
			"És un dels cims més baixos del repte, però la vista és àmplia: des del coll es veuen l'embassament de Rialb al sud i el d'Oliana i la serra de Turp al nord-est; des de l'extrem nord de la roca, la serra d'Aubenç, el Cadí i el Port del Comte, i el Montsec cap a l'oest-sud-oest. L'ascensió comença a Can Boix i guanya uns 330 metres en 1,5 km fins al coll de Sant Honorat, el tram més dret.",
			"Rutes Pirineus la proposa tot l'any, amb les condicions que marquin el temps i la neu. Després de pluja, la roca dels trams de pujada rellisca; a l'estiu, el vessant sud és assolellat i convé sortir d'hora."
		],
		es: [
			'Las Roques de Sant Honorat son una altiplanicie colgada sobre Peramola, en [el Alt Urgell](/comarques/alt-urgell), en el extremo suroeste del embalse de Oliana. Forman la serra de Sant Honorat, al sur de la serra d’Aubenç: una mola caliza que se mantiene por encima de los 1.050 metros y que termina en cantiles casi verticales; en el extremo norte, la caída supera los 250 metros.',
			'Sobre la altiplanicie, a 1.060 m, quedan unas paredes de la antigua ermita de Sant Honorat; según Rutes Pirineus, el marco de la puerta tiene grabada la fecha 1725. Entre el collado y la roca se alza el Roc de la Presó o Picapoll, que, según la tradición que recoge la misma reseña, sirvió de prisión natural durante las guerras carlistas, porque solo tiene un acceso. En la bajada, la iglesia románica de Santa Maria de Castell-llebre, documentada en el año 995, se sostiene al borde de un cantil.',
			'Es una de las cimas más bajas del reto, pero la vista es amplia: desde el collado se ven el embalse de Rialb al sur y el de Oliana y la serra de Turp al noreste; desde el extremo norte de la roca, la serra d’Aubenç, el Cadí y el Port del Comte, y el Montsec hacia el oeste-suroeste. La ascensión empieza en Can Boix y gana unos 330 metros en 1,5 km hasta el coll de Sant Honorat, el tramo más empinado.',
			'Rutes Pirineus la propone todo el año, con las condiciones que marquen el tiempo y la nieve. Después de llover, la roca de los tramos de subida resbala; en verano, la vertiente sur es soleada y conviene salir temprano.'
		]
	},
	rutes: [
		{
			id: 'can-boix',
			nom: {
				ca: 'Circular des de Can Boix (Peramola)',
				es: 'Circular desde Can Boix (Peramola)'
			},
			sortida: { nom: 'Hotel Can Boix (Peramola, 583 m)' },
			tempsMinuts: 85,
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "De Can Boix es puja pel caminet de Sant Honorat, vorejant el torrent de Font Viva, amb zigzags i fites per les Esplugues fins al coll de Sant Honorat (976 m), en una hora. Rutes Pirineus la considera sense dificultat tècnica i apta per a tothom, però recull dos trams curts de roca en pujada fins a l'altiplà i diu que, a l'arcada de pedra, pot caldre ajudar-se de les mans. L'extrem nord de la roca queda a 1 h 25 min de la sortida. La circular sencera, que torna pel Roc de Rombau i Castell-llebre, són 9,6 km, 620 m de desnivell acumulat i 3 h 45 min de marxa sense parades.",
				es: 'Desde Can Boix se sube por el sendero de Sant Honorat, bordeando el torrente de Font Viva, con zigzags e hitos por las Esplugues hasta el coll de Sant Honorat (976 m), en una hora. Rutes Pirineus la considera sin dificultad técnica y apta para todos, pero recoge dos tramos cortos de roca en subida hasta la altiplanicie y dice que, en el arco de piedra, puede hacer falta ayudarse de las manos. El extremo norte de la roca queda a 1 h 25 min de la salida. La circular entera, que vuelve por el Roc de Rombau y Castell-llebre, son 9,6 km, 620 m de desnivel acumulado y 3 h 45 min de marcha sin paradas.'
			},
			fonts: [RUTES_PIRINEUS_CIRCULAR, RUTES_PIRINEUS_SERRA]
		}
	],
	consells: {
		ca: [
			"A Can Boix hi ha lloc per a uns tres cotxes a l'entrada, i un espai obert uns 150 m abans.",
			'Fes la circular en el sentit descrit: així el tram més costerut queda al principi de la jornada.',
			'Vigila els cingles de la Roca de Sant Honorat i del Roc de Rombau, sobretot amb nens: la caiguda supera els 250 metres.',
			"Amb roca humida, vigila els trams de pujada a l'altiplà i el pas de l'arcada de pedra.",
			'Porta un mapa o un track de la ruta: combina camins, corriols i pistes.'
		],
		es: [
			'En Can Boix hay sitio para unos tres coches a la entrada, y un espacio abierto unos 150 m antes.',
			'Haz la circular en el sentido descrito: así el tramo más empinado queda al principio de la jornada.',
			'Vigila los cantiles de la Roca de Sant Honorat y del Roc de Rombau, sobre todo con niños: la caída supera los 250 metros.',
			'Con roca húmeda, vigila los tramos de subida a la altiplanicie y el paso del arco de piedra.',
			'Lleva un mapa o un track de la ruta: combina caminos, sendas y pistas.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Sant Honorat?',
				resposta:
					"Segons Rutes Pirineus, de Can Boix al coll de Sant Honorat hi ha una hora de pujada, i a l'extrem nord de la roca s'hi arriba en 1 h 25 min. La circular sencera amb el Roc de Rombau i Castell-llebre són 3 h 45 min sense parades."
			},
			{
				pregunta: 'Es pot pujar amb nens?',
				resposta:
					"Rutes Pirineus la considera apta per fer amb nens, amb cura als cingles de la roca i del Roc de Rombau. Convé que els petits no es separin del grup a l'altiplà."
			},
			{
				pregunta: 'Què es pot veure al cim?',
				resposta:
					"Les restes de l'ermita de Sant Honorat, amb un gravat de 1725 en un marc de porta, i, des de l'extrem nord, l'embassament d'Oliana, la serra d'Aubenç i, en dies clars, el Cadí, el Port del Comte i el Montsec."
			},
			{
				pregunta: 'Sant Honorat compta com a cim essencial?',
				resposta:
					"Sí, és el més baix dels nou essencials de l'Alt Urgell: 1.068 m, per sota de [Santa Fe](/cims/santa-fe), del [Coscollet](/cims/lo-coscollet) i del [Cogulló de Turp](/cims/cogullo-de-turp). Com que és tan proper a Peramola, es pot encadenar amb una visita a Castell-llebre."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Sant Honorat?',
				resposta:
					'Según Rutes Pirineus, de Can Boix al coll de Sant Honorat hay una hora de subida, y al extremo norte de la roca se llega en 1 h 25 min. La circular entera con el Roc de Rombau y Castell-llebre son 3 h 45 min sin paradas.'
			},
			{
				pregunta: '¿Se puede subir con niños?',
				resposta:
					'Rutes Pirineus la considera apta para hacer con niños, con cuidado en los cantiles de la roca y del Roc de Rombau. Conviene que los pequeños no se separen del grupo en la altiplanicie.'
			},
			{
				pregunta: '¿Qué se puede ver en la cima?',
				resposta:
					'Los restos de la ermita de Sant Honorat, con un grabado de 1725 en el marco de una puerta, y desde el extremo norte, el embalse de Oliana, la serra d’Aubenç y, en días claros, el Cadí, el Port del Comte y el Montsec.'
			},
			{
				pregunta: '¿Sant Honorat cuenta como cima esencial?',
				resposta:
					'Sí, es la más baja de las nueve esenciales del Alt Urgell: 1.068 m, por debajo de [Santa Fe](/cims/santa-fe), del [Coscollet](/cims/lo-coscollet) y del [Cogulló de Turp](/cims/cogullo-de-turp). Al estar tan cerca de Peramola, se puede encadenar con una visita a Castell-llebre.'
			}
		]
	},
	fonts: [RUTES_PIRINEUS_SERRA, RUTES_PIRINEUS_CIRCULAR, VIQUIPEDIA_AUBENC],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
