import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Pala Alta',
	url: 'https://ca.wikipedia.org/wiki/Pala_Alta',
	consultat: CONSULTAT
};

const FEMTURISME = {
	nom: 'Femturisme: Pala Alta des de la Mare de Déu de Montalegre',
	url: 'https://femturisme.cat/rutes/pala-alta-des-de-la-mare-de-deu-de-montalegre',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Pala Alta',
	url: 'https://reptesmuntanyencs.cat/pala-alta/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pala-alta',
	descripcio: {
		ca: [
			"La Pala Alta és el cim més alt de la serra de Mont-roig, a [la Noguera](/comarques/noguera), entre els termes de les Avellanes i Santa Linya i de Camarasa. Segons la Viquipèdia, la muntanya és d'una roca calcària combinada amb calcarenita i gres, i queda dins l'espai protegit de l'Aiguabarreig Segre-Noguera Pallaresa. És un dels quatre cims essencials de la comarca, amb la [Penya Sant Alís](/cims/penya-sant-alis), [Sant Mamet](/cims/sant-mamet) i el [Tossal de Mirapallars](/cims/tossal-de-mirapallars).",
			"El cim està coronat per un vèrtex geodèsic i una caseta de guaita forestal, i l'excursió més habitual surt de l'ermita de la Mare de Déu de Montalegre. Femturisme explica que s'hi arriba per una pista forestal de gairebé sis quilòmetres des de la carretera que surt de Vilanova de la Sal; això vol dir que l'aproximació en cotxe forma part de la jornada i que convé comptar-la abans de decidir l'hora de sortida.",
			"Femturisme descriu el camí inicial com un corriol que entra en un bosc típicament mediterrani, dominat per l'alzina, amb un pal indicador que avisa dels precipicis que hi ha durant el recorregut. Pel camí hi ha un petit roc que fa de mirador. Des del cim, diu el mateix text, s'albira «tot el mar de boira interior» i les muntanyes de la Serralada Prelitoral i Montserrat. El bloc Reptes Muntanyencs també hi destaca les vistes cap al pantà de Camarasa i cap al de Sant Llorenç.",
			'La carena és el tram que demana més atenció. El bloc descriu parets verticals que cauen a plom i, en una part del camí, un sender pedregós que transita una mica apartat de la carena, per on recomana caminar amb molt de compte. La baixada, segons Femturisme, és forta: el corriol «baixa amb força» cap al coll de Porta. Amb boira o terra molla, pren la baixada amb més calma i no et facis drecera cap als cingles.'
		],
		es: [
			'La Pala Alta es la cima más alta de la sierra de Mont-roig, en [la Noguera](/comarques/noguera), entre los términos de les Avellanes i Santa Linya y de Camarasa. Según la Viquipèdia, la montaña es de roca caliza combinada con calcarenita y arenisca, y queda dentro del espacio protegido del Aiguabarreig Segre-Noguera Pallaresa. Es una de las cuatro cimas esenciales de la comarca, junto con la [Penya Sant Alís](/cims/penya-sant-alis), [Sant Mamet](/cims/sant-mamet) y el [Tossal de Mirapallars](/cims/tossal-de-mirapallars).',
			'La cima está coronada por un vértice geodésico y una caseta de vigilancia forestal, y la excursión más habitual sale de la ermita de la Mare de Déu de Montalegre. Femturisme explica que se llega por una pista forestal de casi seis kilómetros desde la carretera que sale de Vilanova de la Sal; eso significa que la aproximación en coche forma parte de la jornada y conviene contarla antes de decidir la hora de salida.',
			'Femturisme describe el camino inicial como una senda que entra en un bosque típicamente mediterráneo, dominado por la encina, con un poste indicador que avisa de los precipicios que hay durante el recorrido. Por el camino hay una pequeña roca que hace de mirador. Desde la cima, dice el mismo texto, se divisa «todo el mar de niebla interior» y las montañas de la Serralada Prelitoral y Montserrat. El blog Reptes Muntanyencs destaca también las vistas hacia el embalse de Camarasa y hacia el de Sant Llorenç.',
			'La cresta es el tramo que pide más atención. El blog describe paredes verticales que caen a plomo y, en una parte del camino, un sendero pedregoso que transcurre algo apartado de la cresta, por donde recomienda caminar con mucho cuidado. La bajada, según Femturisme, es fuerte: la senda «baja con fuerza» hacia el coll de Porta. Con niebla o suelo mojado, afronta la bajada con más calma y no tomes atajos hacia los riscos.'
		]
	},
	rutes: [
		{
			id: 'montalegre-coll-de-porta',
			nom: {
				ca: "Circular des de l'ermita de Montalegre pel coll de Porta",
				es: 'Circular desde la ermita de Montalegre por el coll de Porta'
			},
			sortida: { nom: 'Ermita de la Mare de Déu de Montalegre (Camarasa)' },
			descripcio: {
				ca: "Femturisme proposa una circular per la serra de Mont-roig que comença a l'ermita de Montalegre. Un corriol, amb un pal indicador, enfila cap al cim per un bosc d'alzines; pel camí hi ha un petit roc amb vistes que, segons el text, també podria servir per baixar directe per una canal. La baixada és forta fins al coll de Porta, des d'on es torna a l'ermita per la pista. Cap xifra de longitud ni de desnivell a la pàgina de Femturisme. El bloc Reptes Muntanyencs, amb una circular que surt de la pista de Montalegre, hi compta 5,1 km, uns 318 m de desnivell positiu i 1 h 59 min de marxa efectiva; segons el seu track, el cim s'assoleix a 1 h 17 min i 2,6 km de la sortida. L'itinerari, diu el bloc, no està senyalitzat.",
				es: 'Femturisme propone una circular por la sierra de Mont-roig que empieza en la ermita de Montalegre. Una senda, con un poste indicador, se encamina a la cima por un bosque de encinas; por el camino hay una pequeña roca con vistas que, según el texto, también podría servir para bajar directo por una canal. La bajada es fuerte hasta el coll de Porta, desde donde se vuelve a la ermita por la pista. Ninguna cifra de longitud ni de desnivel en la página de Femturisme. El blog Reptes Muntanyencs, con una circular que sale de la pista de Montalegre, cuenta 5,1 km, unos 318 m de desnivel positivo y 1 h 59 min de marcha efectiva; según su track, la cima se alcanza a 1 h 17 min y 2,6 km de la salida. El itinerario, dice el blog, no está señalizado.'
			},
			fonts: [FEMTURISME, REPTES]
		}
	],
	consells: {
		ca: [
			"L'ermita de Montalegre és al final d'una pista forestal de gairebé 6 km des de la carretera de Vilanova de la Sal, segons Femturisme. Compta el temps d'aproximació abans de fixar l'hora de sortida.",
			'Un pal indicador avisa dels precipicis durant el recorregut: no abandonis el corriol per tallar cap als cingles.',
			"El bloc Reptes Muntanyencs indica que l'itinerari no està senyalitzat; porta el track i un mapa topogràfic de l'ICGC, sobretot amb boira.",
			"A la carena hi ha parets que cauen a plom: camina-hi amb molt de compte i no t'acostis a les vores amb vent.",
			"A la baixada pel coll de Porta el corriol és fort; els bastons ajuden. En cas d'emergència, 112."
		],
		es: [
			'La ermita de Montalegre está al final de una pista forestal de casi 6 km desde la carretera de Vilanova de la Sal, según Femturisme. Cuenta el tiempo de aproximación antes de fijar la hora de salida.',
			'Un poste indicador avisa de los precipicios durante el recorrido: no abandones la senda para cortar hacia los riscos.',
			'El blog Reptes Muntanyencs indica que el itinerario no está señalizado; lleva el track y un mapa topográfico del ICGC, sobre todo con niebla.',
			'En la cresta hay paredes que caen a plomo: camina con mucho cuidado y no te acerques a los bordes con viento.',
			'En la bajada por el coll de Porta la senda es fuerte; los bastones ayudan. En caso de emergencia, 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Per on se sol pujar a la Pala Alta?',
				resposta:
					"Femturisme proposa la circular que surt de l'ermita de la Mare de Déu de Montalegre, a la qual s'arriba per una pista forestal de gairebé 6 km des de la carretera de Vilanova de la Sal."
			},
			{
				pregunta: 'Quant es triga a pujar a la Pala Alta?',
				resposta:
					'Femturisme no hi dóna temps. El bloc Reptes Muntanyencs, en una circular de 5,1 km que surt de la pista de Montalegre, situa el cim a 1 h 17 min de la sortida i la marxa efectiva total en 1 h 59 min.'
			},
			{
				pregunta: 'Hi ha perill a la Pala Alta?',
				resposta:
					'Hi ha precipicis: un pal indicador ho adverteix al començament del recorregut, i el bloc descriu parets que cauen a plom a la carena. Cal anar-hi amb compte, sobretot amb boira.'
			},
			{
				pregunta: 'La Pala Alta compta com a cim essencial?',
				resposta:
					'Sí, és un dels quatre [cims essencials](/cims-essencials) de la Noguera, amb la Penya Sant Alís, Sant Mamet i el Tossal de Mirapallars.'
			}
		],
		es: [
			{
				pregunta: '¿Por dónde se suele subir a la Pala Alta?',
				resposta:
					'Femturisme propone la circular que sale de la ermita de la Mare de Déu de Montalegre, a la que se llega por una pista forestal de casi 6 km desde la carretera de Vilanova de la Sal.'
			},
			{
				pregunta: '¿Cuánto se tarda en subir a la Pala Alta?',
				resposta:
					'Femturisme no da tiempos. El blog Reptes Muntanyencs, en una circular de 5,1 km que sale de la pista de Montalegre, sitúa la cima a 1 h 17 min de la salida y la marcha efectiva total en 1 h 59 min.'
			},
			{
				pregunta: '¿Hay peligro en la Pala Alta?',
				resposta:
					'Hay precipicios: un poste indicador lo advierte al comienzo del recorrido, y el blog describe paredes que caen a plomo en la cresta. Hay que ir con cuidado, sobre todo con niebla.'
			},
			{
				pregunta: '¿La Pala Alta cuenta como cima esencial?',
				resposta:
					'Sí, es una de las cuatro [cimas esenciales](/cims-essencials) de la Noguera, con la Penya Sant Alís, Sant Mamet y el Tossal de Mirapallars.'
			}
		]
	},
	fonts: [VIQUIPEDIA, FEMTURISME, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
