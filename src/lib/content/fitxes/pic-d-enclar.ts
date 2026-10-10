import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA_BONY = {
	nom: 'Viquipèdia: Bony de la Pica',
	url: 'https://ca.wikipedia.org/wiki/Bony_de_la_Pica',
	consultat: CONSULTAT
};

const VIQUIPEDIA_ENCLAR = {
	nom: "Viquipèdia: serra d'Enclar",
	url: "https://ca.wikipedia.org/wiki/Serra_d'Enclar",
	consultat: CONSULTAT
};

const RUTES_PIRINEUS_MARGINEDA = {
	nom: 'Rutes Pirineus: Bony de la Pica des de la Margineda i Sispony (Andorra)',
	url: 'https://www.rutespirineus.cat/rutes/bony-de-la-pica-margineda-sispony-andorra',
	consultat: CONSULTAT
};

const VISIT_ANDORRA_MUNTANER = {
	nom: "Visit Andorra: collada de Muntaner – Pic d'Enclar",
	url: 'https://visitandorra.com/en/nature--sports/hiking-route-collada-de-muntaner-pic-d-enclar/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pic-d-enclar',
	descripcio: {
		ca: [
			"El cim que el repte recull com a Pic d'Enclar (Bony de la Pica) és, en realitat, el Bony de la Pica, a l'extrem occidental de la serra d'Enclar, a la frontera entre Catalunya i Andorra. Hi toquen les Valls de Valira, a [l'Alt Urgell](/comarques/alt-urgell), i les parròquies d'Andorra la Vella i Sant Julià de Lòria. No s'ha de confondre amb el Pic d'Enclar pròpiament dit, una mica més baix i situat més a l'est, a la mateixa carena: Rutes Pirineus hi compta uns 15 minuts de l'un a l'altre.",
			"La serra d'Enclar és una carena d'oest a est entre les valls de Sispony i Santa Coloma. El vessant sud, assolellat, desguassa al riu d'Enclar, un afluent de la Valira, i té alzines que s'acosten aquí al seu límit d'altitud a Andorra; el nord, ombrívol, té vegetació eurosiberiana i baixa cap a Sispony i el riu Montaner. Segons la Viquipèdia, la roca és granit del batòlit d'Andorra-Montlluís, i la serra conserva rastres glacials i periglacials. Al Bony de la Pica hi ha un vèrtex geodèsic de l'ICGC.",
			"Rutes Pirineus destaca els contrastos entre els dos vessants i, des de dalt, la panoràmica sobre els cims principals d'Andorra i la vall de la Valira; des del vèrtex es veu el [Pic de Salòria](/cims/pic-de-saloria), i a la baixada, des del rec del Solà, Andorra la Vella. Visit Andorra assenyala que, des de la collada de Muntaner, s'obre la vall catalana d'Ós de Civís.",
			"Segons Rutes Pirineus, l'època bona va de la primavera tardana a la tardor; la mateixa ressenya avisa que, a la baixada del Pic d'Enclar cap a la collada de Montaner, la neu pot durar fins a finals de primavera. El vessant sud, assolellat i amb molt de desnivell, es fa feixuc els dies de calor: comença d'hora."
		],
		es: [
			'La cima que el reto recoge como Pic d’Enclar (Bony de la Pica) es, en realidad, el Bony de la Pica, en el extremo occidental de la serra d’Enclar, en la frontera entre Cataluña y Andorra. En ella se tocan las Valls de Valira, en [el Alt Urgell](/comarques/alt-urgell), y las parroquias de Andorra la Vella y Sant Julià de Lòria. No hay que confundirla con el Pic d’Enclar propiamente dicho, algo más bajo y situado más al este, en la misma cresta: Rutes Pirineus cuenta unos 15 minutos de una cima a la otra.',
			'La serra d’Enclar es una cresta de oeste a este entre los valles de Sispony y Santa Coloma. La vertiente sur, soleada, desagua al río d’Enclar, un afluente de la Valira, y tiene encinas que se acercan aquí a su límite de altitud en Andorra; la norte, umbría, tiene vegetación eurosiberiana y baja hacia Sispony y el río Montaner. Según la Viquipèdia, la roca es granito del batolito de Andorra-Montlluís, y la sierra conserva huellas glaciares y periglaciares. En el Bony de la Pica hay un vértice geodésico del ICGC.',
			'Rutes Pirineus destaca los contrastes entre las dos vertientes y, desde arriba, la panorámica sobre las cimas principales de Andorra y el valle de la Valira; desde el vértice se ve el [Pic de Salòria](/cims/pic-de-saloria), y en la bajada, desde el rec del Solà, Andorra la Vella. Visit Andorra señala que, desde la collada de Muntaner, se abre la vall catalana de Ós de Civís.',
			'Según Rutes Pirineus, la época buena va de la primavera tardía al otoño; la misma reseña avisa de que, en la bajada del Pic d’Enclar hacia la collada de Montaner, la nieve puede durar hasta finales de primavera. La vertiente sur, soleada y con mucho desnivel, se hace pesada los días de calor: empieza temprano.'
		]
	},
	rutes: [
		{
			id: 'margineda-santa-coloma',
			nom: {
				ca: 'Circular des de Santa Coloma per la Margineda i Sispony',
				es: 'Circular desde Santa Coloma por la Margineda y Sispony'
			},
			sortida: { nom: 'Carrer Major, Santa Coloma (Andorra, 960 m)' },
			tempsMinuts: 265,
			tecnicitat: 'grimpada',
			descripcio: {
				ca: "Rutes Pirineus proposa una circular de 24,6 km i 1.625 m de desnivell acumulat. Es puja pel vessant assolellat fins al Bony de la Pica (4 h 25 min de marxa efectiva) i al Pic d'Enclar, i es baixa per la collada de Montaner i l'obaga de Sispony (4 h 35 min més). A uns 2.190 m, un canal dret i pedregós està equipat amb cadenes, i hi ha un altre pas amb una cadena a la pujada des d'Aixàs; de tant en tant cal posar les mans per mantenir l'equilibri. L'orientació és delicada: la circular no està senyalitzada com a tal i combina marques diverses.",
				es: 'Rutes Pirineus propone una circular de 24,6 km y 1.625 m de desnivel acumulado. Se sube por la vertiente soleada hasta el Bony de la Pica (4 h 25 min de marcha efectiva) y al Pic d’Enclar, y se baja por la collada de Montaner y la umbría de Sispony (4 h 35 min más). A unos 2.190 m, una canal empinada y pedregosa está equipada con cadenas, y hay otro paso con una cadena en la subida desde Aixàs; de vez en cuando hay que poner las manos para mantener el equilibrio. La orientación es delicada: la circular no está señalizada como tal y combina marcas diversas.'
			},
			fonts: [RUTES_PIRINEUS_MARGINEDA]
		},
		{
			id: 'sispony-muntaner',
			nom: {
				ca: 'Des de Sispony per la collada de Muntaner',
				es: 'Desde Sispony por la collada de Muntaner'
			},
			sortida: { nom: 'Museu Casa Rull, Sispony (La Massana, Andorra)' },
			descripcio: {
				ca: "Visit Andorra descriu aquesta ruta, que qualifica de difícil, fins al Pic d'Enclar: 7,39 km i 1.055 m de pujada. Surt de Casa Rull, puja per asfalt als cortals de Sispony, entra al bosc de les Carboneres i, per un camí amb marques de GRP, arriba a la collada de Muntaner, des d'on s'obre la vall d'Ós de Civís; d'allà continua pel vessant nord fins al Pic d'Enclar. Per tocar el Bony de la Pica cal seguir la carena cap a l'oest, uns 15 minuts més segons Rutes Pirineus.",
				es: 'Visit Andorra describe esta ruta, que califica de difícil, hasta el Pic d’Enclar: 7,39 km y 1.055 m de subida. Sale de Casa Rull, sube por asfalto a los cortals de Sispony, entra en el bosque de les Carboneres y, por un camino con marcas de GRP, llega a la collada de Muntaner, desde donde se abre la vall d’Ós de Civís; desde allí continúa por la vertiente norte hasta el Pic d’Enclar. Para pisar el Bony de la Pica hay que seguir la cresta hacia el oeste, unos 15 minutos más según Rutes Pirineus.'
			},
			fonts: [VISIT_ANDORRA_MUNTANER, RUTES_PIRINEUS_MARGINEDA]
		}
	],
	consells: {
		ca: [
			"Comprova sobre el mapa quin dels dos cims trepitges: el del repte és el Bony de la Pica, el més occidental i el que té el vèrtex geodèsic; el Pic d'Enclar és el veí de l'est.",
			"Mira la previsió: segons Rutes Pirineus, a la baixada del Pic d'Enclar cap a la collada de Montaner la neu pot durar fins a finals de primavera.",
			'Per a les rutes per sobre de 1.700 m, Visit Andorra recomana el període entre finals de juny i finals de setembre.',
			'Porta un track: el recorregut de la Margineda no està senyalitzat com a circular i combina diversos senders.',
			'Els trams amb cadenes demanen cura si hi ha roca humida o gel; no els facis amb pluja.'
		],
		es: [
			'Comprueba en el mapa qué cima pisas: la del reto es el Bony de la Pica, la más occidental y la que tiene el vértice geodésico; el Pic d’Enclar es la vecina del este.',
			'Mira la previsión: según Rutes Pirineus, en la bajada del Pic d’Enclar hacia la collada de Montaner la nieve puede durar hasta finales de primavera.',
			'Para las rutas por encima de 1.700 m, Visit Andorra recomienda el periodo entre finales de junio y finales de septiembre.',
			'Lleva un track: el recorrido de la Margineda no está señalizado como circular y combina varios senderos.',
			'Los tramos con cadenas piden cuidado si hay roca húmeda o hielo; no los hagas con lluvia.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "El Pic d'Enclar i el Bony de la Pica són el mateix cim?",
				resposta:
					"No. El repte l'anomena Pic d'Enclar (Bony de la Pica), però el cim que s'hi recull és el Bony de la Pica, l'extrem occidental de la serra (2.402 m al mapa 1:10.000 de l'ICGC que cita la Viquipèdia). El Pic d'Enclar, una mica més baix, és a uns 15 minuts de carena i es pot enllaçar en la mateixa jornada."
			},
			{
				pregunta: 'Quant es triga a pujar-hi?',
				resposta:
					"Rutes Pirineus calcula 4 h 25 min de marxa efectiva des de Santa Coloma fins al Bony de la Pica, dins d'una circular de 9 h. Des de Sispony, Visit Andorra dona 7,39 km i 1.055 m de pujada fins al Pic d'Enclar, sense precisar el temps d'anada."
			},
			{
				pregunta: 'Cal material especial?',
				resposta:
					"En condicions d'estiu no cal material d'escalada, però la via de Santa Coloma té un canal equipat amb cadenes i passos on cal posar les mans: no és apta per a qui no tingui peu de muntanya. Segons Rutes Pirineus, entre el Pic d'Enclar i la collada de Montaner pot quedar neu fins a finals de primavera."
			},
			{
				pregunta: 'El Bony de la Pica compta com a cim essencial?',
				resposta:
					"Sí. Per altitud queda entre el [Vulturó](/cims/vulturo) i el Cap del Verd, al mig de la llista d'essencials de l'Alt Urgell, i comparteix amb el Monturull la condició de cim fronterer amb Andorra."
			}
		],
		es: [
			{
				pregunta: '¿El Pic d’Enclar y el Bony de la Pica son la misma cima?',
				resposta:
					'No. El reto lo llama Pic d’Enclar (Bony de la Pica), pero la cima que recoge es el Bony de la Pica, el extremo occidental de la sierra (2.402 m en el mapa 1:10.000 del ICGC que cita la Viquipèdia). El Pic d’Enclar, algo más bajo, está a unos 15 minutos de cresta y se puede enlazar en la misma jornada.'
			},
			{
				pregunta: '¿Cuánto se tarda en subir?',
				resposta:
					'Rutes Pirineus calcula 4 h 25 min de marcha efectiva desde Santa Coloma hasta el Bony de la Pica, dentro de una circular de 9 h. Desde Sispony, Visit Andorra da 7,39 km y 1.055 m de subida hasta el Pic d’Enclar, sin precisar el tiempo de ida.'
			},
			{
				pregunta: '¿Hace falta material especial?',
				resposta:
					'En condiciones de verano no hace falta material de escalada, pero la vía de Santa Coloma tiene una canal equipada con cadenas y pasos en los que hay que poner las manos: no es apta para quien no tenga soltura en montaña. Según Rutes Pirineus, entre el Pic d’Enclar y la collada de Montaner puede quedar nieve hasta finales de primavera.'
			},
			{
				pregunta: '¿El Bony de la Pica cuenta como cima esencial?',
				resposta:
					'Sí. Por altitud queda entre el [Vulturó](/cims/vulturo) y el Cap del Verd, en mitad de la lista de esenciales del Alt Urgell, y comparte con el Monturull la condición de cima fronteriza con Andorra.'
			}
		]
	},
	fonts: [VIQUIPEDIA_BONY, VIQUIPEDIA_ENCLAR, RUTES_PIRINEUS_MARGINEDA, VISIT_ANDORRA_MUNTANER],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
