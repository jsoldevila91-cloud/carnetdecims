import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Cap de la Gallina Pelada',
	url: 'https://ca.wikipedia.org/wiki/Cap_de_la_Gallina_Pelada',
	consultat: CONSULTAT
};

const VIQUIPEDIA_ENSIJA = {
	nom: "Viquipèdia: serra d'Ensija",
	url: "https://ca.wikipedia.org/wiki/Serra_d'Ensija",
	consultat: CONSULTAT
};

const FEMTURISME_FONT_FREDA = {
	nom: "Femturisme: la Gallina Pelada des de la Font Freda (serra d'Ensija)",
	url: 'https://femturisme.cat/ca/rutes/la-gallina-pelada-des-de-la-font-freda-serra-densija',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'cap-de-la-gallina-pelada',
	descripcio: {
		ca: [
			"El Cap de la Gallina Pelada, també conegut com a Cap de Llitzet, és el punt més alt de la serra d'Ensija, al [Berguedà](/comarques/bergueda). La serra s'estén entre Saldes, Gósol, Vallcebre i Fígols, i forma amb els Rasos de Peguera un espai del PEIN. La Viquipèdia li dona una prominència de 1.002 m, una xifra alta per a un cim prepirinenc de 2.300 m.",
			"La serra és el límit sud, a Catalunya, de la vegetació alpina i subalpina: a dalt, prats alpins i pinedes de pi negre amb neret; més avall, pinedes, rouredes de roure martinenc i fagedes als vessants d'ombra. També hi ha un passat miner i, a Fumanya, un jaciment d'empremtes de dinosaures titanosaures, un dels més importants d'Europa de finals del Cretaci segons la Viquipèdia. A la carena, el Serrat Voltor arriba als 2.281 m i la Creu de Ferro als 2.286 m.",
			"Femturisme destaca la vista: al nord, el Pedraforca; a l'est i a l'oest, el Berguedà i la vall de Lord; al sud, en dies clars, Montserrat. El refugi de la Serra d'Ensija President Delgado Úbeda, a un quart d'hora del cim, és el punt de referència de la pujada.",
			"Fora de l'hivern, la pujada no té secrets més enllà del pendent. Amb neu, segons Femturisme, alguns trams de la part alta solen estar gelats, cal pujar amb raquetes i és probable que s'hagi de començar al parc de la Palomera, uns 20 minuts més avall. A l'estiu, els prats de dalt no tenen ombra: surt d'hora."
		],
		es: [
			'El Cap de la Gallina Pelada, también conocido como Cap de Llitzet, es el punto más alto de la serra d’Ensija, en el [Berguedà](/comarques/bergueda). La sierra se extiende entre Saldes, Gósol, Vallcebre y Fígols, y forma con los Rasos de Peguera un espacio del PEIN. La Viquipèdia le da una prominencia de 1.002 m, una cifra alta para una cima prepirenaica de 2.300 m.',
			'La sierra es el límite sur, en Cataluña, de la vegetación alpina y subalpina: arriba, prados alpinos y pinares de pino negro con rododendro; más abajo, pinares, robledales de roble pubescente y hayedos en las laderas de umbría. También hay un pasado minero y, en Fumanya, un yacimiento de huellas de dinosaurios titanosaurios, uno de los más importantes de Europa de finales del Cretácico según la Viquipèdia. En la cresta, el Serrat Voltor llega a los 2.281 m y la Creu de Ferro a los 2.286 m.',
			'Femturisme destaca la vista: al norte, el Pedraforca; al este y al oeste, el Berguedà y la vall de Lord; al sur, en días claros, Montserrat. El refugio de la Serra d’Ensija President Delgado Úbeda, a un cuarto de hora de la cima, es el punto de referencia de la subida.',
			'Fuera del invierno, la subida no tiene más secreto que la pendiente. Con nieve, según Femturisme, algunos tramos de la parte alta suelen estar helados, hay que subir con raquetas y es probable que haya que empezar en el parque de la Palomera, unos 20 minutos más abajo. En verano, los prados de arriba no tienen sombra: sal temprano.'
		]
	},
	rutes: [
		{
			id: 'font-freda',
			nom: { ca: 'Des de la Font Freda (Saldes)', es: 'Desde la Font Freda (Saldes)' },
			sortida: { nom: 'Font Freda (Saldes)' },
			desnivellPositiuM: 705,
			tecnicitat: 'cap',
			descripcio: {
				ca: "És la ruta tradicional. Un camí amb esglaons porta a la Font Freda, i d'allà un sender marcat puja pel bosc vorejant el torrent de la font d'Ensija, amb revolts. Es creuen les Planelles i els plans d'Ensija fins al refugi, i en uns 15 min més, per un petit coll, s'arriba al cim. Femturisme hi indica que no té dificultat tècnica: el que costa és el pendent, i alguns trams del camí estan erosionats. Es torna pel mateix camí.",
				es: 'Es la ruta tradicional. Un camino con escalones lleva a la Font Freda, y desde allí un sendero marcado sube por el bosque bordeando el torrente de la font d’Ensija, con revueltas. Se cruzan les Planelles y los plans d’Ensija hasta el refugio, y en unos 15 min más, por un pequeño collado, se llega a la cima. Femturisme indica que no tiene dificultad técnica: lo que cuesta es la pendiente, y algunos tramos del camino están erosionados. Se vuelve por el mismo camino.'
			},
			fonts: [FEMTURISME_FONT_FREDA]
		},
		{
			id: 'peguera',
			nom: {
				ca: 'Des de Peguera per les Roques de Ferrús',
				es: 'Desde Peguera por les Roques de Ferrús'
			},
			sortida: { nom: 'Peguera' },
			descripcio: {
				ca: "La Viquipèdia la presenta com l'altra via habitual, més espectacular que la de Saldes, passant per les Roques de Ferrús i en bona part pel GR 107. També hi ha una variant poc coneguda des de Saldes pel torrent de les Llobateres, a l'est de la Font Freda, amb trams més drets i una petita grimpada.",
				es: 'La Viquipèdia la presenta como la otra vía habitual, más espectacular que la de Saldes, pasando por les Roques de Ferrús y en buena parte por el GR 107. También hay una variante poco conocida desde Saldes por el torrent de les Llobateres, al este de la Font Freda, con tramos más empinados y una pequeña trepada.'
			},
			fonts: [VIQUIPEDIA]
		}
	],
	consells: {
		ca: [
			"A l'hivern, alguns trams de la part alta solen estar gelats: porta raquetes i, si cal, grampons, segons les condicions.",
			'Amb neu, és possible que hagis de deixar el cotxe al parc de la Palomera, la qual cosa afegeix uns 20 minuts.',
			"La Font Freda és un bon lloc per parar a dinar a la tornada, però no comptis amb aigua més amunt: porta'n des de casa.",
			'Si prefereixes la variant dels Llobateres, compta amb pendents més drets i una petita grimpada, segons la Viquipèdia.',
			"Segons la Viquipèdia, a Fumanya, a la mateixa serra, hi ha un jaciment d'empremtes de dinosaures amb visites guiades: pots fer-hi una parada l'endemà."
		],
		es: [
			'En invierno, algunos tramos de la parte alta suelen estar helados: lleva raquetas y, si hace falta, crampones, según las condiciones.',
			'Con nieve, es posible que tengas que dejar el coche en el parque de la Palomera, lo que añade unos 20 minutos.',
			'La Font Freda es un buen sitio para parar a comer a la vuelta, pero no cuentes con agua más arriba: llévala desde casa.',
			'Si prefieres la variante de les Llobateres, cuenta con pendientes más empinadas y una pequeña trepada, según la Viquipèdia.',
			'Según la Viquipèdia, en Fumanya, en la misma sierra, hay un yacimiento de huellas de dinosaurios con visitas guiadas: puedes hacer una parada al día siguiente.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Gallina Pelada?',
				resposta:
					"Femturisme dona de 3 a 4 hores per a la ruta de la Font Freda (7 km i 705 m de pujada) i, a bon ritme, unes 2 hores. Del refugi d'Ensija al cim són uns 15 minuts."
			},
			{
				pregunta: 'És una ruta tècnica?',
				resposta:
					'Femturisme diu que la ruta de la Font Freda no té dificultat tècnica, però el pendent és fort. Per la variant dels Llobateres, la Viquipèdia parla de trams més drets i una petita grimpada.'
			},
			{
				pregunta: 'Què es veu des del cim?',
				resposta:
					'Segons Femturisme, el Pedraforca al nord, el Berguedà i la vall de Lord, i Montserrat al sud. És el punt més alt de la serra, de manera que la vista és molt oberta.'
			},
			{
				pregunta: 'La Gallina Pelada compta com a cim essencial?',
				resposta:
					"Sí, és el quart dels sis essencials del Berguedà per altitud, per sota del Comabona, de la Tosa i del [Pedraforca](/cims/pedraforca-pollego-superior), i és l'únic de la serra d'Ensija."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Gallina Pelada?',
				resposta:
					'Femturisme da de 3 a 4 horas para la ruta de la Font Freda (7 km y 705 m de subida) y, a buen ritmo, unas 2 horas. Del refugio de Ensija a la cima son unos 15 minutos.'
			},
			{
				pregunta: '¿Es una ruta técnica?',
				resposta:
					'Femturisme dice que la ruta de la Font Freda no tiene dificultad técnica, pero la pendiente es fuerte. En la variante de les Llobateres, la Viquipèdia habla de tramos más empinados y una pequeña trepada.'
			},
			{
				pregunta: '¿Qué se ve desde la cima?',
				resposta:
					'Según Femturisme, el Pedraforca al norte, el Berguedà y la vall de Lord, y Montserrat al sur. Es el punto más alto de la sierra, de modo que la vista es muy abierta.'
			},
			{
				pregunta: '¿La Gallina Pelada cuenta como cima esencial?',
				resposta:
					'Sí, es la cuarta de las seis esenciales del Berguedà por altitud, por debajo del Comabona, de la Tosa y del [Pedraforca](/cims/pedraforca-pollego-superior), y es la única de la serra d’Ensija.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_ENSIJA, FEMTURISME_FONT_FREDA],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
