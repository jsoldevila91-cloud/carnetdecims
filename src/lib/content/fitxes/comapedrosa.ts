import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-03';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Comapedrosa',
	url: 'https://ca.wikipedia.org/wiki/Comapedrosa',
	consultat: CONSULTAT
};

const PARC_REFUGI = {
	nom: 'Parc Natural Comunal de les Valls del Comapedrosa: itinerari 3, camí del refugi de Comapedrosa (PDF)',
	url: 'https://comapedrosa.ad/continguts/multimedia/gestio_documental/PNVC_ITINERARIS_03_REF_COMA.pdf',
	consultat: CONSULTAT
};

const PARC_CIM = {
	nom: "Parc Natural Comunal de les Valls del Comapedrosa: itinerari 4, ascens a l'Alt de Comapedrosa (PDF)",
	url: 'https://comapedrosa.ad/continguts/multimedia/gestio_documental/PNVC_ITINERARIS_04_ALT_COMA.pdf',
	consultat: CONSULTAT
};

const PARC_ITINERARIS = {
	nom: 'Parc Natural Comunal de les Valls del Comapedrosa: itineraris',
	url: 'https://comapedrosa.ad/en/itineraries/',
	consultat: CONSULTAT
};

const PARC_INFO = {
	nom: "Parc Natural Comunal de les Valls del Comapedrosa: punt d'informació del parc",
	url: 'https://comapedrosa.ad/ca/punt-informacio-del-parc/',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: "Rutes Pirineus: pic de Comapedrosa des d'Arinsal",
	url: 'https://www.rutespirineus.cat/rutes/pic-de-comapedrosa-arinsal-andorra',
	consultat: '2026-10-04'
};

const fitxa: ContingutFitxa = {
	slug: 'comapedrosa',
	descripcio: {
		ca: [
			"El Comapedrosa és la muntanya més alta d'[Andorra](/comarques/andorra). S'aixeca a l'extrem nord-oest del país, a la parròquia de la Massana, prop de la frontera amb el Pallars Sobirà i l'Arieja, i dona nom al Parc Natural Comunal de les Valls del Comapedrosa, l'espai protegit més alpí del Principat. També se l'anomena l'Alt de Comapedrosa.",
			"El nom es llegeix sol: una «coma», una vall alta i oberta, i «pedrosa», plena de pedra. La primera ascensió documentada és del 22 de setembre de 1858, quan una comissió hispanoandorrana que fixava la frontera hi va pujar convençuda que la ratlla passava pel cim. El vessant oest cau cap a l'estany Negre, i l'est baixa en grans pales gairebé 900 m fins al pla de l'Estany, un paisatge glacial de tarteres, estanys i congestes que sovint duren fins a l'estiu.",
			"La vista abasta bona part del Pirineu central i oriental: el veí [Monteixo](/cims/monteixo), el massís de la [Pica d'Estats](/cims/pica-d-estats) a pocs quilòmetres, les valls andorranes cap a l'est i les muntanyes del Pallars a ponent. És un dels cims de més de 2.900 metres del repte amb una aproximació relativament curta.",
			"La temporada habitual va de juny a octubre. El parc avisa que fora d'aquests mesos el perill d'allaus pot ser elevat i demana consultar el butlletí abans d'entrar-hi. A l'estiu, compta amb les tempestes de tarda i amb neu a l'últim tram fins ben entrat juny."
		],
		es: [
			"El Comapedrosa es la montaña más alta de [Andorra](/comarques/andorra). Se alza en el extremo noroeste del país, en la parroquia de La Massana, cerca de la frontera con el Pallars Sobirà y el Ariège, y da nombre al Parque Natural Comunal de les Valls del Comapedrosa, el espacio protegido más alpino del Principado. También se le llama l'Alt de Comapedrosa.",
			"El nombre se entiende solo: una «coma», un valle alto y abierto, y «pedrosa», lleno de piedra. La primera ascensión documentada es del 22 de septiembre de 1858, cuando una comisión hispanoandorrana que fijaba la frontera subió convencida de que la raya pasaba por la cima. La vertiente oeste cae hacia el estany Negre, y la este baja en grandes palas casi 900 m hasta el pla de l'Estany, un paisaje glaciar de pedreras, lagos y neveros que a menudo duran hasta el verano.",
			"La vista abarca buena parte del Pirineo central y oriental: el vecino [Monteixo](/cims/monteixo), el macizo de la [Pica d'Estats](/cims/pica-d-estats) a pocos kilómetros, los valles andorranos hacia el este y las montañas del Pallars al oeste. Es una de las cimas de más de 2.900 metros del reto con una aproximación relativamente corta.",
			'La temporada habitual va de junio a octubre. El parque avisa de que fuera de esos meses el peligro de aludes puede ser elevado y pide consultar el boletín antes de entrar. En verano, cuenta con tormentas de tarde y con nieve en el último tramo hasta bien entrado junio.'
		]
	},
	rutes: [
		{
			id: 'arinsal-refugi',
			nom: {
				ca: 'Des del riu Pollós (Arinsal) pel refugi de Comapedrosa',
				es: 'Desde el riu Pollós (Arinsal) por el refugio de Comapedrosa'
			},
			sortida: { nom: 'Berenador del riu Pollós (Arinsal, la Massana)' },
			desnivellPositiuM: 1327,
			distanciaKm: 6,
			tempsMinuts: 240,
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "És la via normal i suma dos itineraris del parc. El primer segueix el GR 11 pel camí de les Carboneres i l'obaga de Comapedrosa fins al refugi (2 h, 2,7 km i 650 m de desnivell). El segon travessa la pleta de Comapedrosa, puja fort fins a les basses de l'estany Negre i s'enfila cap al cim (2 h, 3,3 km i 677 m). El parc adverteix que l'últim tram és el més dur i que cal ser-hi extremadament prudent: és pedregós i, segons Rutes Pirineus, en alguns trams de la carena cal ajudar-se de les mans.",
				es: 'Es la vía normal y suma dos itinerarios del parque. El primero sigue el GR 11 por el camino de les Carboneres y la umbría de Comapedrosa hasta el refugio (2 h, 2,7 km y 650 m de desnivel). El segundo cruza la pleta de Comapedrosa, sube fuerte hasta las balsas del estany Negre y se encarama hacia la cima (2 h, 3,3 km y 677 m). El parque advierte de que el último tramo es el más duro y que hay que ser extremadamente prudente: es pedregoso y, según Rutes Pirineus, en algunos tramos de la cresta hay que ayudarse de las manos.'
			},
			fonts: [PARC_REFUGI, PARC_CIM, RUTES_PIRINEUS]
		},
		{
			id: 'baiau',
			nom: { ca: 'Tornada pel port de Baiau', es: 'Vuelta por el port de Baiau' },
			sortida: { nom: 'Refugi de Comapedrosa' },
			descripcio: {
				ca: "Com a variant de baixada, el parc proposa sortir del cim cap a l'oest en direcció al port de Baiau i enllaçar amb el GR 11 fins a l'estany Negre, on es retroba el camí de pujada. Permet fer una petita volta per la carena sense repetir tot l'itinerari.",
				es: 'Como variante de bajada, el parque propone salir de la cima hacia el oeste en dirección al port de Baiau y enlazar con el GR 11 hasta el estany Negre, donde se recupera el camino de subida. Permite hacer una pequeña vuelta por la cresta sin repetir todo el itinerario.'
			},
			fonts: [PARC_CIM]
		}
	],
	consells: {
		ca: [
			"Si vols repartir l'esforç, fes nit al refugi de Comapedrosa: té 48 places i servei de restauració de principi de juny a mitjan setembre, segons el parc.",
			"Consulta el butlletí de perill d'allaus del servei meteorològic d'Andorra si hi ha neu.",
			"L'últim tram cap al cim és molt dret: vés-hi amb calma i no pugis just a sota d'un altre grup.",
			"Surt d'hora a l'estiu i baixa abans que es formin les tempestes.",
			'Per arribar a Arinsal, segueix la carretera CG4 des de la Massana i els indicadors del parc.'
		],
		es: [
			'Si quieres repartir el esfuerzo, duerme en el refugio de Comapedrosa: tiene 48 plazas y servicio de comidas de principios de junio a mediados de septiembre, según el parque.',
			'Consulta el boletín de peligro de aludes del servicio meteorológico de Andorra si hay nieve.',
			'El último tramo hacia la cima es muy empinado: tómatelo con calma y no subas justo debajo de otro grupo.',
			'Sal temprano en verano y baja antes de que se formen las tormentas.',
			'Para llegar a Arinsal, sigue la carretera CG4 desde La Massana y las indicaciones del parque.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Comapedrosa?',
				resposta:
					'Segons els itineraris del parc, unes 4 h des del riu Pollós, a Arinsal: 2 h fins al refugi de Comapedrosa i 2 h més fins al cim, amb uns 1.300 m de desnivell en total.'
			},
			{
				pregunta: 'El Comapedrosa és difícil?',
				resposta:
					"No té passos d'escalada, però és una ascensió d'alta muntanya llarga i amb molt desnivell. El tram final és el més dur i el parc hi demana extremar la prudència. Amb neu, calen material i experiència."
			},
			{
				pregunta: 'Es pot fer el Comapedrosa en dos dies?',
				resposta:
					'Sí, és una opció molt habitual: el primer dia es puja al refugi de Comapedrosa i el segon es fa el cim i es baixa a Arinsal.'
			},
			{
				pregunta: 'El Comapedrosa compta al repte encara que sigui a Andorra?',
				resposta:
					'Sí. El repte inclou cims de Catalunya, Andorra i la Catalunya Nord, i el Comapedrosa és un dels [cims essencials](/cims-essencials).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Comapedrosa?',
				resposta:
					'Según los itinerarios del parque, unas 4 h desde el riu Pollós, en Arinsal: 2 h hasta el refugio de Comapedrosa y 2 h más hasta la cima, con unos 1.300 m de desnivel en total.'
			},
			{
				pregunta: '¿El Comapedrosa es difícil?',
				resposta:
					'No tiene pasos de escalada, pero es una ascensión de alta montaña larga y con mucho desnivel. El tramo final es el más duro y el parque pide extremar la prudencia. Con nieve, hacen falta material y experiencia.'
			},
			{
				pregunta: '¿Se puede hacer el Comapedrosa en dos días?',
				resposta:
					'Sí, es una opción muy habitual: el primer día se sube al refugio de Comapedrosa y el segundo se hace la cima y se baja a Arinsal.'
			},
			{
				pregunta: '¿El Comapedrosa cuenta en el reto aunque esté en Andorra?',
				resposta:
					'Sí. El reto incluye cimas de Cataluña, Andorra y la Cataluña Norte, y el Comapedrosa es una de las [cimas esenciales](/cims-essencials).'
			}
		]
	},
	wikiloc: [
		{
			id: 39995825,
			titol: 'Arinsal - Refugi de Comapredrosa - Estany negre - Pic de comapedrosa',
			url: 'https://ca.wikiloc.com/rutes-senderisme/arinsal-refugi-de-comapredrosa-estany-negre-pic-de-comapedrosa-39995825'
		},
		{
			id: 7622220,
			titol:
				"Arinsal-Pleta de Comapedrosa-Estany negre-Pic de Comapedrosa-Refugi del Pla de l'Estany-Arinsal",
			url: 'https://ca.wikiloc.com/rutes-senderisme/arinsal-pleta-de-comapedrosa-estany-negre-pic-de-comapedrosa-refugi-del-pla-de-lestany-arinsal-7622220'
		}
	],
	fonts: [VIQUIPEDIA, PARC_ITINERARIS, PARC_REFUGI, PARC_CIM, RUTES_PIRINEUS, PARC_INFO],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
