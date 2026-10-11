import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Montclar (Pontils)',
	url: 'https://ca.wikipedia.org/wiki/Montclar_(Pontils)',
	consultat: CONSULTAT
};

const CATROM_ESGLESIA = {
	nom: 'Enciclopèdia Catalana, Catalunya Romànica: Sant Miquel de Montclar (Pontils)',
	url: 'https://www.enciclopedia.cat/catalunya-romanica/sant-miquel-de-montclar-pontils',
	consultat: CONSULTAT
};

const CATROM_CASTELL = {
	nom: 'Enciclopèdia Catalana, Catalunya Romànica: Castell de Montclar (Pontils)',
	url: 'https://www.enciclopedia.cat/catalunya-romanica/castell-de-montclar-pontils',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Sant Miquel de Montclar',
	url: 'https://reptesmuntanyencs.cat/sant-miquel-de-montclar/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'sant-miquel-de-montclar',
	descripcio: {
		ca: [
			"Sant Miquel de Montclar és el nom amb què el repte recull el cim de Montclar, al terme de Pontils, a [la Conca de Barberà](/comarques/conca-de-barbera). És un massís abrupte que destaca entre les muntanyes del voltant per l'alçada i pel color clar de la roca, amb una vegetació baixa i arbustiva. El punt que compta és el del vèrtex geodèsic; l'ermita de Sant Miquel i la torre del castell són uns centenars de metres més enllà, a la mateixa carena.",
			"La muntanya té una història llarga. El lloc de Montclar ja es documenta l'any 1013, quan el castell era de Sal·la de Santa Perpètua, que el va vendre al seu nebot Borrell, bisbe de Vic. Era una fortalesa de frontera, amb el terme entre els comtats de Barcelona i d'Osona-Manresa, i el 1072 va passar al comte Ramon Berenguer I. Avui en queda una torre al capdamunt. L'església de Sant Miquel, antiga parròquia, apareix per primera vegada el 1154 en una butlla del papa Anastasi IV.",
			'Des de la torre i des del cim hi ha una bona panoràmica sobre la conca alta del Gaià i sobre la plana de la Conca de Barberà. Vist des de la carretera de Vallespinosa, el Montclar sembla tancat per cingles de conglomerat, però el bloc Reptes Muntanyencs explica que és accessible per tots quatre costats.',
			"És una sortida curta, de mig matí, per fer amb temps fresc: no hi ha aigua ni gaire ombra. Els altres cims essencials de la comarca són la [Mola d'Estat](/cims/mola-d-estat), la [Punta del Curull](/cims/punta-del-curull) i el [Tossal Gros de Vallbona](/cims/tossal-gros-de-vallbona)."
		],
		es: [
			'Sant Miquel de Montclar es el nombre con el que el reto recoge la cima de Montclar, en el término de Pontils, en [la Conca de Barberà](/comarques/conca-de-barbera). Es un macizo abrupto que destaca entre las montañas de alrededor por su altura y por el color claro de la roca, con una vegetación baja y arbustiva. El punto que cuenta es el del vértice geodésico; la ermita de Sant Miquel y la torre del castillo están unos cientos de metros más allá, en la misma cresta.',
			'La montaña tiene una historia larga. El lugar de Montclar ya se documenta en el año 1013, cuando el castillo era de Sal·la de Santa Perpètua, que lo vendió a su sobrino Borrell, obispo de Vic. Era una fortaleza de frontera, con el término entre los condados de Barcelona y de Osona-Manresa, y en 1072 pasó al conde Ramon Berenguer I. Hoy queda una torre en lo alto. La iglesia de Sant Miquel, antigua parroquia, aparece por primera vez en 1154 en una bula del papa Anastasio IV.',
			'Desde la torre y desde la cima hay una buena panorámica sobre la cuenca alta del Gaià y sobre el llano de la Conca de Barberà. Visto desde la carretera de Vallespinosa, el Montclar parece cerrado por riscos de conglomerado, pero el blog Reptes Muntanyencs explica que es accesible por sus cuatro lados.',
			"Es una salida corta, de media mañana, para hacer con tiempo fresco: no hay agua ni mucha sombra. Las otras cimas esenciales de la comarca son la [Mola d'Estat](/cims/mola-d-estat), la [Punta del Curull](/cims/punta-del-curull) y el [Tossal Gros de Vallbona](/cims/tossal-gros-de-vallbona)."
		]
	},
	rutes: [
		{
			id: 'biure',
			nom: {
				ca: 'Des de Biure per la pista de Sant Miquel',
				es: 'Desde Biure por la pista de Sant Miquel'
			},
			sortida: { nom: 'Biure' },
			descripcio: {
				ca: "És l'accés que descriu Catalunya Romànica per arribar al castell: des del poble de Biure s'agafa la pista que mena a Sant Miquel, a la dreta; al primer trencall es va a la dreta, al segon a l'esquerra i al tercer, sota una línia d'alta tensió, també a l'esquerra. Una part de la pista es pot fer amb cotxe. Al final, un corriol s'enfila fins al capdamunt del puig, on hi ha la torre i l'ermita. El vèrtex del cim és a la mateixa carena, cap al sud, per camí evident.",
				es: 'Es el acceso que describe Catalunya Romànica para llegar al castillo: desde el pueblo de Biure se toma la pista que lleva a Sant Miquel, a la derecha; en el primer desvío se va a la derecha, en el segundo a la izquierda y en el tercero, bajo una línea de alta tensión, también a la izquierda. Una parte de la pista se puede hacer en coche. Al final, una senda sube hasta lo alto del cerro, donde están la torre y la ermita. El vértice de la cima está en la misma cresta, hacia el sur, por camino evidente.'
			},
			fonts: [CATROM_CASTELL, REPTES]
		},
		{
			id: 'tv-2015',
			nom: {
				ca: 'Circular des de la carretera de Vallespinosa',
				es: 'Circular desde la carretera de Vallespinosa'
			},
			sortida: { nom: 'Clot de Comadevaques, km 1,6 de la TV-2015 (Pontils)' },
			descripcio: {
				ca: "El bloc Reptes Muntanyencs (2012) hi va pujar pel sud: surt de la carretera per una pista cap al nord, deixa el llit de la riera i guanya la carena amb un flanqueig sense camí; seguint-la arriba al vèrtex en 2,1 km i uns 35 minuts, i tot seguit a l'ermita i el castell. Va baixar per un sender i una pista cap al clot de Sant Miquel i va tancar la volta travessant camps de conreu, amb 5,8 km en total. No hi ha cap senyalització.",
				es: 'El blog Reptes Muntanyencs (2012) subió por el sur: sale de la carretera por una pista hacia el norte, deja el cauce de la riera y gana la cresta con un flanqueo sin camino; siguiéndola llega al vértice en 2,1 km y unos 35 minutos, y a continuación a la ermita y el castillo. Bajó por un sendero y una pista hacia el clot de Sant Miquel y cerró la vuelta cruzando campos de cultivo, con 5,8 km en total. No hay ninguna señalización.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"No et quedis a l'ermita: el cim del repte és el vèrtex geodèsic de Montclar, a l'altre cap de la carena.",
			"Cap dels dos accessos està senyalitzat. Porta el mapa de l'ICGC o un track, sobretot per trobar els trencalls de la pista de Biure.",
			'Pel costat de Vallespinosa cal travessar camps de vinya i de cereal per tancar la volta: passa per les vores i no trepitgis el sembrat.',
			"La torre del castell és una ruïna: no t'hi enfilis."
		],
		es: [
			'No te quedes en la ermita: la cima del reto es el vértice geodésico de Montclar, en el otro extremo de la cresta.',
			'Ninguno de los dos accesos está señalizado. Lleva el mapa del ICGC o un track, sobre todo para dar con los desvíos de la pista de Biure.',
			'Por el lado de Vallespinosa hay que cruzar campos de viña y de cereal para cerrar la vuelta: pasa por los bordes y no pises el sembrado.',
			'La torre del castillo es una ruina: no te subas a ella.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'On és exactament el cim de Sant Miquel de Montclar?',
				resposta:
					"És el cim de Montclar, on hi ha el vèrtex geodèsic. L'ermita de Sant Miquel i la torre del castell queden uns centenars de metres més enllà, seguint la carena."
			},
			{
				pregunta: 'Quant es triga a pujar-hi?',
				resposta:
					'Des de la carretera de Vallespinosa, el bloc Reptes Muntanyencs va arribar al vèrtex en uns 35 minuts i 2,1 km, i va fer una circular de 5,8 km en 1 h 47 min de marxa.'
			},
			{
				pregunta: 'Què en queda, del castell de Montclar?',
				resposta:
					'Una torre al capdamunt de la muntanya. El castell es documenta des del 1013 i el 1072 va ser venut al comte de Barcelona Ramon Berenguer I.'
			},
			{
				pregunta: 'Compta com a cim essencial?',
				resposta:
					'Sí, amb el nom de Sant Miquel de Montclar, i és un dels quatre [cims essencials](/cims-essencials) de la Conca de Barberà.'
			}
		],
		es: [
			{
				pregunta: '¿Dónde está exactamente la cima de Sant Miquel de Montclar?',
				resposta:
					'Es la cima de Montclar, donde está el vértice geodésico. La ermita de Sant Miquel y la torre del castillo quedan unos cientos de metros más allá, siguiendo la cresta.'
			},
			{
				pregunta: '¿Cuánto se tarda en subir?',
				resposta:
					'Desde la carretera de Vallespinosa, el blog Reptes Muntanyencs llegó al vértice en unos 35 minutos y 2,1 km, e hizo una circular de 5,8 km en 1 h 47 min de marcha.'
			},
			{
				pregunta: '¿Qué queda del castillo de Montclar?',
				resposta:
					'Una torre en lo alto de la montaña. El castillo se documenta desde 1013 y en 1072 fue vendido al conde de Barcelona Ramon Berenguer I.'
			},
			{
				pregunta: '¿Cuenta como cima esencial?',
				resposta:
					'Sí, con el nombre de Sant Miquel de Montclar, y es una de las cuatro [cimas esenciales](/cims-essencials) de la Conca de Barberà.'
			}
		]
	},
	fonts: [VIQUIPEDIA, CATROM_ESGLESIA, CATROM_CASTELL, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
