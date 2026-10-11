import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Montgròs (el Bruc)',
	url: 'https://ca.wikipedia.org/wiki/Montgr%C3%B2s_(el_Bruc)',
	consultat: CONSULTAT
};

const TRAVESIA_PIRENAICA = {
	nom: 'Travesía Pirenaica: Montserrat, subida al Montgròs (1.133 m) desde El Bruc',
	url: 'https://travesiapirenaica.com/en/?p=36852',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'montgros',
	descripcio: {
		ca: [
			"El Montgròs és una gran mola de conglomerat en forma de cúpula, al bell mig de la serra de Montserrat i dins del parc natural, al terme del Bruc ([Anoia](/comarques/anoia)). La Viquipèdia remarca que no és dels cims més alts del massís, però sí un dels miradors més ben situats, justament perquè queda al centre: a ponent, les Agulles i els Frares Encantats; a llevant, la canal del Migdia i [Sant Jeroni](/cims/sant-jeroni). Més enllà, a la Tebaida, hi ha [l'Elefant](/cims/elefant-roca-de-sant-salvador).",
			"Va ser un dels primers racons de la part central de Montserrat que es van explicar per escrit. El 1880, Cèsar August Torras va publicar a La Renaixensa el relat d'una ascensió al Montgròs, que la Viquipèdia cita a través de la història de l'escalada a Montserrat de Josep Fatjó (2005). Torras hi escrivia que la pujada era tan penosa com difícil i que la mola només era accessible per un sol indret, la font de la Cadireta. Avui hi ha camí, però l'itinerari continua sent el mateix.",
			"Des del Bruc, la pujada travessa primer un paisatge d'oliveres i pi blanc, remunta el torrent del Bassal dels Gats fins al coll de l'Ajaguda i entra a la canal del Migdia, la bretxa que parteix Montserrat en dues meitats. Travesía Pirenaica hi destaca l'ombra d'alzines i boixos i els peus de grèvol, auró i teix que hi han quedat com a relictes. Al capdamunt, el panorama abasta bona part de les agulles del massís.",
			"El tram final és el que demana més atenció: dues canals rocoses de pendent fort, una de les quals és la de la Salamandra, i algun pas aeri. No hi ha aigua en tot el recorregut i la calor s'hi nota: és una sortida per fer amb temps fresc i roca seca."
		],
		es: [
			'El Montgròs es una gran mole de conglomerado en forma de cúpula, en pleno centro de la sierra de Montserrat y dentro del parque natural, en el término del Bruc ([Anoia](/comarques/anoia)). La Viquipèdia subraya que no es de las cimas más altas del macizo, pero sí uno de los miradores mejor situados, precisamente porque queda en el centro: a poniente, las Agulles y los Frares Encantats; a levante, la canal del Migdia y [Sant Jeroni](/cims/sant-jeroni). Más allá, en la Tebaida, está [el Elefant](/cims/elefant-roca-de-sant-salvador).',
			'Fue uno de los primeros rincones de la parte central de Montserrat que se contaron por escrito. En 1880, Cèsar August Torras publicó en La Renaixensa el relato de una ascensión al Montgròs, que la Viquipèdia cita a través de la historia de la escalada en Montserrat de Josep Fatjó (2005). Torras escribía que la subida era tan penosa como difícil y que la mole solo era accesible por un único lugar, la fuente de la Cadireta. Hoy hay camino, pero el itinerario sigue siendo el mismo.',
			"Desde el Bruc, la subida atraviesa primero un paisaje de olivos y pino carrasco, remonta el torrente del Bassal dels Gats hasta el coll de l'Ajaguda y entra en la canal del Migdia, la brecha que parte Montserrat en dos mitades. Travesía Pirenaica destaca allí la sombra de encinas y bojes y los pies de acebo, arce y tejo que han quedado como relictos. Arriba, el panorama abarca buena parte de las agujas del macizo.",
			'El tramo final es el que pide más atención: dos canales rocosas de fuerte pendiente, una de ellas la de la Salamandra, y algún paso aéreo. No hay agua en todo el recorrido y el calor se nota: es una salida para hacer con tiempo fresco y roca seca.'
		]
	},
	rutes: [
		{
			id: 'el-bruc',
			nom: {
				ca: 'Des del Bruc per la canal del Migdia i la font de la Cadireta',
				es: 'Desde el Bruc por la canal del Migdia y la fuente de la Cadireta'
			},
			sortida: { nom: 'El Bruc Residencial, avinguda de la Moreneta (el Bruc, 405 m)' },
			desnivellPositiuM: 833,
			distanciaKm: 5.5,
			tempsMinuts: 150,
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Travesía Pirenaica la descriu com una ruta lineal d'11 km entre anada i tornada i 833 m de desnivell acumulat: 2 h 30 min de pujada (5,5 km) i 1 h 45 min de baixada, sense parades, amb dificultat alta. Surt del Bruc Residencial (405 m), puja pel camí del Bassal dels Gats fins al coll de l'Ajaguda (829 m, 1 h 25 min), baixa una mica fins a la canal del Migdia i la remunta fins al desviament del Montgròs (952 m, 2 h). D'allà, passada la font de la Cadireta, s'enfila per dues canals rocoses de pendent pronunciat, amb marques de PR, fins a un collet, i un últim repetjó a l'esquerra porta al cim. La revista avisa d'algun pas aeri i recomana baixar amb molta cura.",
				es: "Travesía Pirenaica la describe como una ruta lineal de 11 km entre ida y vuelta y 833 m de desnivel acumulado: 2 h 30 min de subida (5,5 km) y 1 h 45 min de bajada, sin paradas, con dificultad alta. Sale del Bruc Residencial (405 m), sube por el camí del Bassal dels Gats hasta el coll de l'Ajaguda (829 m, 1 h 25 min), baja un poco hasta la canal del Migdia y la remonta hasta el desvío del Montgròs (952 m, 2 h). Desde allí, pasada la fuente de la Cadireta, se encarama por dos canales rocosas de pendiente pronunciada, con marcas de PR, hasta un collado, y un último repecho a la izquierda lleva a la cima. La revista avisa de algún paso aéreo y recomienda bajar con mucho cuidado."
			},
			fonts: [TRAVESIA_PIRENAICA]
		}
	],
	consells: {
		ca: [
			"Carrega tota l'aigua des de casa: Travesía Pirenaica avisa que no n'hi ha en tot el recorregut, que al Bruc Residencial no hi ha comerços i que la de la font de la Cadireta no és accessible.",
			'Les canals finals són de roca, molt dretes, i es baixen pel mateix lloc: plega els bastons per tenir les mans lliures, reserva forces per a la baixada i evita-les amb el conglomerat moll.',
			"Poc abans del coll de l'Ajaguda cal deixar el camí del torrent per un sender marcat amb fites que surt a l'esquerra: para-hi atenció.",
			"S'hi pot arribar en autobús: segons la mateixa ressenya, la línia Barcelona-Igualada pel Bruc té parada al Bruc Residencial.",
			"Les parets del Montgròs tenen vies d'escalada llargues; res a veure amb la pujada a peu, que és la que expliquem aquí."
		],
		es: [
			'Carga toda el agua desde casa: Travesía Pirenaica avisa de que no la hay en todo el recorrido, de que en el Bruc Residencial no hay comercios y de que la de la fuente de la Cadireta no es accesible.',
			'Las canales finales son de roca, muy empinadas, y se bajan por el mismo sitio: pliega los bastones para tener las manos libres, reserva fuerzas para la bajada y evítalas con el conglomerado mojado.',
			"Poco antes del coll de l'Ajaguda hay que dejar el camino del torrente por un sendero marcado con hitos que sale a la izquierda: presta atención.",
			'Se puede llegar en autobús: según la misma reseña, la línea Barcelona-Igualada por el Bruc tiene parada en el Bruc Residencial.',
			'Las paredes del Montgròs tienen vías de escalada largas; nada que ver con la subida a pie, que es la que explicamos aquí.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Montgròs des del Bruc?',
				resposta:
					'Travesía Pirenaica compta 2 h 30 min de pujada i 1 h 45 min de baixada, sense parades, per a 11 km entre anada i tornada i 833 m de desnivell acumulat. Amb parades, calcula unes 5 hores.'
			},
			{
				pregunta: 'El Montgròs és difícil?',
				resposta:
					"És una pujada exigent: la ressenya la valora de dificultat alta pel desnivell, molt marcat en gairebé tot el recorregut, i avisa de dues canals rocoses de pendent fort i d'algun pas aeri al tram final. No és una ruta per estrenar-se a Montserrat."
			},
			{
				pregunta: 'Hi ha cap altra manera de pujar-hi?',
				resposta:
					"Sí. La Viquipèdia explica que la font de la Cadireta també s'assoleix des de Santa Cecília, baixant per la canal del Migdia, i que pel vessant oest s'hi arriba des del coll del Montgròs, pel camí que ve d'Agulles."
			},
			{
				pregunta: 'Què es veu des del cim del Montgròs?',
				resposta:
					"Segons la Viquipèdia, les Agulles i els Frares Encantats a ponent, el Bruc al sud i la canal del Migdia i Sant Jeroni a llevant. Travesía Pirenaica hi afegeix el Moro i l'Albarda Castellana."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Montgròs desde el Bruc?',
				resposta:
					'Travesía Pirenaica cuenta 2 h 30 min de subida y 1 h 45 min de bajada, sin paradas, para 11 km entre ida y vuelta y 833 m de desnivel acumulado. Con paradas, calcula unas 5 horas.'
			},
			{
				pregunta: '¿El Montgròs es difícil?',
				resposta:
					'Es una subida exigente: la reseña la valora de dificultad alta por el desnivel, muy marcado en casi todo el recorrido, y avisa de dos canales rocosas de fuerte pendiente y de algún paso aéreo en el tramo final. No es una ruta para estrenarse en Montserrat.'
			},
			{
				pregunta: '¿Hay alguna otra forma de subir?',
				resposta:
					'Sí. La Viquipèdia explica que a la fuente de la Cadireta también se llega desde Santa Cecília, bajando por la canal del Migdia, y que por la vertiente oeste se llega desde el coll del Montgròs, por el camino que viene de Agulles.'
			},
			{
				pregunta: '¿Qué se ve desde la cima del Montgròs?',
				resposta:
					'Según la Viquipèdia, las Agulles y los Frares Encantats a poniente, el Bruc al sur y la canal del Migdia y Sant Jeroni a levante. Travesía Pirenaica añade el Moro y la Albarda Castellana.'
			}
		]
	},
	fonts: [VIQUIPEDIA, TRAVESIA_PIRENAICA],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
