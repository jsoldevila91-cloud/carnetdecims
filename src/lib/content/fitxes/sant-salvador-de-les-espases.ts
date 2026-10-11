import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Sant Salvador de les Espases',
	url: 'https://ca.wikipedia.org/wiki/Sant_Salvador_de_les_Espases',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: "Rutes Pirineus: Pujada a l'ermita de Sant Salvador de les Espases",
	url: 'https://www.rutespirineus.cat/rutes/ruta-sant-salvador-espases',
	consultat: CONSULTAT
};

const FEEC = {
	nom: "FEEC: cims amb restriccions d'accés",
	url: 'https://www.feec.cat/activitats/100-cims/cims-amb-restriccions-dacces/',
	consultat: CONSULTAT
};

const OLESA = {
	nom: "Ajuntament d'Olesa de Montserrat: reunió amb la propietat de Sant Salvador de les Espases (1 de juliol de 2024)",
	url: 'https://www.olesademontserrat.cat/article/reunio-olesa-esparreguera-propietat-sant-salvador-espases',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'sant-salvador-de-les-espases',
	descripcio: {
		ca: [
			"Sant Salvador de les Espases és una ermita enfilada en una aresta de conglomerat sobre el congost del Cairat, a la riba esquerra del Llobregat, al nord del [Baix Llobregat](/comarques/baix-llobregat). Segons la Viquipèdia, és just al punt on es troben els termes d'Olesa de Montserrat, Esparreguera i Vacarisses. Té Montserrat al davant, amb [Sant Jeroni](/cims/sant-jeroni) com a punt més alt, i és un dels cims essencials més baixos del repte.",
			"La capella era la del castell de les Espases, que la Viquipèdia documenta des del 985 i del qual només queden una paret i part d'una torre. El 1351 el va adquirir el monestir de Montserrat, que en va conservar la senyoria fins al 1836. L'església, d'una sola nau i volta baixa, respon a una reforma del segle XVI, es va restaurar el 1924 i el 1985 i està declarada bé cultural d'interès nacional. El nom no ve de cap batalla, tot i la llegenda de la pluja d'espases: fa referència al relleu espadat.",
			"**Situació actual.** El 27 de maig de 2024 es va enfonsar part del sostre de la capella. L'Ajuntament d'Olesa de Montserrat va explicar l'1 de juliol de 2024 que s'havia requerit a la propietat, que és privada, tancar els accessos al conjunt i prohibir el pas pel camí que hi puja des de la C-55 (la Puda) a l'altura del torrent de l'Afrau, perquè el mur oest de l'ermita amenaçava de caure sobre aquest camí. La FEEC, per la seva banda, no valida les ascensions a aquest cim mentre durin les obres de consolidació i restauració. Abans de planificar res, consulta la regulació vigent als ajuntaments d'Olesa i d'Esparreguera i a la FEEC.",
			"El camí de la Puda és, justament, la ruta que descriuen les guies: una pujada curta i molt assolellada, entre matolls i roca rogenca, que Rutes Pirineus valora de dificultat baixa. La recollim perquè és la ruta de referència, però no s'ha de fer mentre el pas estigui prohibit."
		],
		es: [
			'Sant Salvador de les Espases es una ermita encaramada a una arista de conglomerado sobre el congost del Cairat, en la orilla izquierda del Llobregat, al norte del [Baix Llobregat](/comarques/baix-llobregat). Según la Viquipèdia, está justo donde se encuentran los términos de Olesa de Montserrat, Esparreguera y Vacarisses. Tiene Montserrat enfrente, con [Sant Jeroni](/cims/sant-jeroni) como punto más alto, y es una de las cimas esenciales más bajas del reto.',
			'La capilla era la del castillo de les Espases, que la Viquipèdia documenta desde 985 y del que solo quedan una pared y parte de una torre. En 1351 lo adquirió el monasterio de Montserrat, que conservó el señorío hasta 1836. La iglesia, de una sola nave y bóveda baja, responde a una reforma del siglo XVI, se restauró en 1924 y en 1985 y está declarada bien cultural de interés nacional. El nombre no viene de ninguna batalla, pese a la leyenda de la lluvia de espadas: alude al relieve escarpado.',
			"**Situación actual.** El 27 de mayo de 2024 se hundió parte del techo de la capilla. El Ayuntamiento de Olesa de Montserrat explicó el 1 de julio de 2024 que se había requerido a la propiedad, que es privada, cerrar los accesos al conjunto y prohibir el paso por el camino que sube desde la C-55 (la Puda) a la altura del torrente de l'Afrau, porque el muro oeste de la ermita amenazaba con caer sobre ese camino. La FEEC, por su parte, no valida las ascensiones a esta cima mientras duren las obras de consolidación y restauración. Antes de planificar nada, consulta la regulación vigente en los ayuntamientos de Olesa y de Esparreguera y en la FEEC.",
			'El camino de la Puda es, precisamente, la ruta que describen las guías: una subida corta y muy soleada, entre matorral y roca rojiza, que Rutes Pirineus valora de dificultad baja. La recogemos porque es la ruta de referencia, pero no debe hacerse mientras el paso esté prohibido.'
		]
	},
	rutes: [
		{
			id: 'puda',
			nom: {
				ca: "Des de la Puda pel torrent de l'Afrau (pas afectat pel tancament del 2024)",
				es: "Desde la Puda por el torrente de l'Afrau (paso afectado por el cierre de 2024)"
			},
			sortida: {
				nom: 'Camí de Can Tovella, la Puda (Olesa de Montserrat), poc després del km 7 de la C-55'
			},
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Rutes Pirineus la descriu com una ruta lineal de 4,3 km entre anada i tornada, amb 350 m de desnivell acumulat: 55 min de pujada i 1 h 45 min en total, sense parades. Surt del camí de Can Tovella (97 m), deixa la pista del Llobregat per un corriol senyalitzat, passa per les agulles del Petintó, un forn de calç i la font de Sant Salvador, i s'enfila fent llaçades fins a l'ermita. Segons la guia, el camí és pedregós i avança entre matollars. Aquest és el camí que el 2024 es va demanar tancar pel risc d'esfondrament: consulta la regulació vigent.",
				es: 'Rutes Pirineus la describe como una ruta lineal de 4,3 km entre ida y vuelta, con 350 m de desnivel acumulado: 55 min de subida y 1 h 45 min en total, sin paradas. Sale del camí de Can Tovella (97 m), deja la pista del Llobregat por un sendero señalizado, pasa por las agujas del Petintó, un horno de cal y la fuente de Sant Salvador, y sube en lazadas hasta la ermita. Según la guía, el camino es pedregoso y avanza entre matorrales. Este es el camino que en 2024 se pidió cerrar por el riesgo de derrumbe: consulta la regulación vigente.'
			},
			fonts: [RUTES_PIRINEUS, OLESA]
		}
	],
	consells: {
		ca: [
			"No passis cap tanca ni cartell de prohibició: el risc que va motivar el tancament és la caiguda d'un mur sobre el camí, i des de baix no es veu.",
			'Si la teva intenció és validar el cim, espera: la FEEC no accepta ascensions mentre durin les obres i avisa que les limitacions es poden modificar o ampliar.',
			'Quan el pas torni a estar obert, tingues present que tota la pujada és al sol: Rutes Pirineus recomana anar amb compte en època de calor.',
			"La font de Sant Salvador sol estar seca i només raja després de pluges, segons la mateixa guia: surt amb l'aigua que necessitis.",
			"La cova de Sant Salvador, poc abans de l'ermita, està tancada amb una reixa: es mira des de fora."
		],
		es: [
			'No cruces ninguna valla ni cartel de prohibición: el riesgo que motivó el cierre es la caída de un muro sobre el camino, y desde abajo no se ve.',
			'Si tu intención es validar la cima, espera: la FEEC no acepta ascensiones mientras duren las obras y avisa de que las limitaciones pueden modificarse o ampliarse.',
			'Cuando el paso vuelva a estar abierto, ten presente que toda la subida va al sol: Rutes Pirineus recomienda ir con cuidado en época de calor.',
			'La fuente de Sant Salvador suele estar seca y solo mana tras las lluvias, según la misma guía: sal con el agua que necesites.',
			'La cueva de Sant Salvador, poco antes de la ermita, está cerrada con una reja: se mira desde fuera.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Es pot pujar ara a Sant Salvador de les Espases?',
				resposta:
					"L'estiu del 2024, després de l'esfondrament d'una part de la capella, l'Ajuntament d'Olesa va informar que s'havia demanat tancar els accessos al conjunt i prohibir el pas pel camí de la Puda. No donem per fet que la situació hagi canviat: consulta la regulació vigent als ajuntaments d'Olesa i d'Esparreguera abans d'anar-hi."
			},
			{
				pregunta: "La FEEC valida l'ascensió a Sant Salvador de les Espases?",
				resposta:
					'No mentre durin les obres de consolidació i restauració de la capella, segons la pàgina de cims amb restriccions de la FEEC. Pots consultar com funciona la validació a la [normativa del repte](/repte-100-cims/normativa).'
			},
			{
				pregunta: 'Quant es triga a pujar-hi des de la Puda?',
				resposta:
					'Rutes Pirineus compta 55 min de pujada i 1 h 45 min entre anada i tornada, sense parades, per a 4,3 km i 350 m de desnivell acumulat. Són dades de la ruta en condicions normals, no una invitació a fer-la amb el pas tancat.'
			},
			{
				pregunta: 'Què en queda, del castell de les Espases?',
				resposta:
					"Molt poc: segons la Viquipèdia, una paret al capdamunt de la roca i part d'una torre. El castell consta des del 985 i el monestir de Montserrat en va tenir la senyoria del 1351 al 1836."
			}
		],
		es: [
			{
				pregunta: '¿Se puede subir ahora a Sant Salvador de les Espases?',
				resposta:
					'En verano de 2024, tras el derrumbe de una parte de la capilla, el Ayuntamiento de Olesa informó de que se había pedido cerrar los accesos al conjunto y prohibir el paso por el camino de la Puda. No damos por hecho que la situación haya cambiado: consulta la regulación vigente en los ayuntamientos de Olesa y de Esparreguera antes de ir.'
			},
			{
				pregunta: '¿La FEEC valida la ascensión a Sant Salvador de les Espases?',
				resposta:
					'No mientras duren las obras de consolidación y restauración de la capilla, según la página de cimas con restricciones de la FEEC. Puedes consultar cómo funciona la validación en la [normativa del reto](/repte-100-cims/normativa).'
			},
			{
				pregunta: '¿Cuánto se tarda en subir desde la Puda?',
				resposta:
					'Rutes Pirineus cuenta 55 min de subida y 1 h 45 min entre ida y vuelta, sin paradas, para 4,3 km y 350 m de desnivel acumulado. Son datos de la ruta en condiciones normales, no una invitación a hacerla con el paso cerrado.'
			},
			{
				pregunta: '¿Qué queda del castillo de les Espases?',
				resposta:
					'Muy poco: según la Viquipèdia, una pared en lo alto de la roca y parte de una torre. El castillo consta desde 985 y el monasterio de Montserrat tuvo su señorío de 1351 a 1836.'
			}
		]
	},
	fonts: [VIQUIPEDIA, RUTES_PIRINEUS, FEEC, OLESA],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
