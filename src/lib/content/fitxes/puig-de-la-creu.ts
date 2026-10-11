import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puig de la Creu (Castellar del Vallès)',
	url: 'https://ca.wikipedia.org/wiki/Puig_de_la_Creu_(Castellar_del_Vall%C3%A8s)',
	consultat: CONSULTAT
};

const CASTELLAR_ITINERARI = {
	nom: 'Ajuntament de Castellar del Vallès: Itinerari pel Puig de la Creu',
	url: 'https://www.castellarvalles.cat/26417/descriptiu/-271/',
	consultat: CONSULTAT
};

const CASTELLAR_PUIG = {
	nom: 'Ajuntament de Castellar del Vallès: El Puig de la Creu',
	url: 'https://www.castellarvalles.cat/34109/descriptiu/-284?m=2',
	consultat: CONSULTAT
};

const CASTELLAR_RUTES = {
	nom: "Ajuntament de Castellar del Vallès: Descobreix l'entorn natural de Castellar del Vallès (2020), ruta 1",
	url: 'https://www.castellarvalles.cat/arxius/document/7493/arxiu/rutesactual574.pdf',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-de-la-creu',
	descripcio: {
		ca: [
			"El Puig de la Creu és la muntanya que Castellar del Vallès té al damunt, al [Vallès Occidental](/comarques/valles-occidental). L'Ajuntament el descriu com el cim més alt del terme, una bona talaia i el límit amb Sentmenat. Des del poble s'hi puja a peu, sense agafar el cotxe. Els seus veïns de comarca són [la Mola de Sant Llorenç del Munt](/cims/la-mola-de-sant-llorenc-del-munt) i [Sant Sadurní de Gallifa](/cims/sant-sadurni-de-gallifa).",
			"Dalt hi ha l'església de Santa Maria del Puig de la Creu. Segons l'Ajuntament, s'ha restaurat i modificat diverses vegades, però pertany al grup de capelles rurals del segle XII sense ornamentació. Hi ha també un vèrtex geodèsic, i una llegenda que recull la Viquipèdia: aquí hauria vingut a morir el drac de Sant Llorenç del Munt.",
			"L'Ajuntament recomana fer la volta a l'ermita per veure tota la panoràmica; la guia municipal de rutes de natura ho resumeix dient que s'hi arriba tenint Castellar a vista d'ocell. Pel vessant del poble, la pujada passa per barraques de pedra seca i per un seguit de fonts.",
			"És un cim de proximitat, que es pot fer en qualsevol estació; a l'estiu, millor d'hora."
		],
		es: [
			'El Puig de la Creu es la montaña que Castellar del Vallès tiene encima, en el [Vallès Occidental](/comarques/valles-occidental). El Ayuntamiento lo describe como la cima más alta del término, una buena atalaya y el límite con Sentmenat. Desde el pueblo se sube a pie, sin coger el coche. Sus vecinas de comarca son [la Mola de Sant Llorenç del Munt](/cims/la-mola-de-sant-llorenc-del-munt) y [Sant Sadurní de Gallifa](/cims/sant-sadurni-de-gallifa).',
			'Arriba está la iglesia de Santa Maria del Puig de la Creu. Según el Ayuntamiento, se ha restaurado y modificado varias veces, pero pertenece al grupo de capillas rurales del siglo XII sin ornamentación. Hay también un vértice geodésico, y una leyenda que recoge la Viquipèdia: aquí habría venido a morir el dragón de Sant Llorenç del Munt.',
			'El Ayuntamiento recomienda dar la vuelta a la ermita para ver toda la panorámica; la guía municipal de rutas de naturaleza lo resume diciendo que se llega con Castellar a vista de pájaro. Por la vertiente del pueblo, la subida pasa por barracas de piedra seca y por una serie de fuentes.',
			'Es una cima de proximidad, que se puede hacer en cualquier estación; en verano, mejor temprano.'
		]
	},
	rutes: [
		{
			id: 'placa-major',
			nom: {
				ca: 'Des de la plaça Major de Castellar per la font dels Casots',
				es: 'Desde la plaza Mayor de Castellar por la font dels Casots'
			},
			sortida: { nom: 'Font de la plaça Major (Castellar del Vallès)' },
			tecnicitat: 'cap',
			descripcio: {
				ca: "L'Ajuntament el publica com un itinerari circular de 9,3 km, de dificultat fàcil i sense senyalitzar. De la plaça Major surt pels carrers General Boadella i Sant Llorenç, travessa uns horts i agafa una pista forestal fins a la font dels Casots i la font dels Gossos. D'allà puja per corriols fins a retrobar la pista que porta al Puig de la Creu. La tornada baixa per un corriol amb senyals grocs fins a la font del Gurri i continua per Can Padró i la font del Cosidor fins a l'Era d'en Petasques i el centre del poble.",
				es: "El Ayuntamiento lo publica como un itinerario circular de 9,3 km, de dificultad fácil y sin señalizar. Desde la plaza Mayor sale por las calles General Boadella y Sant Llorenç, atraviesa unos huertos y toma una pista forestal hasta la font dels Casots y la font dels Gossos. Desde allí sube por senderos hasta reencontrar la pista que lleva al Puig de la Creu. La vuelta baja por un sendero con señales amarillas hasta la font del Gurri y continúa por Can Padró y la font del Cosidor hasta la Era d'en Petasques y el centro del pueblo."
			},
			fonts: [CASTELLAR_ITINERARI, CASTELLAR_PUIG]
		},
		{
			id: 'barraques',
			nom: {
				ca: 'Ruta de natura per les barraques de pedra seca i la carena',
				es: 'Ruta de naturaleza por las barracas de piedra seca y la loma'
			},
			sortida: { nom: "Era d'en Petasques (Castellar del Vallès)" },
			descripcio: {
				ca: "És la ruta 1 de la guia municipal del 2020: una circular de 5,5 km i 360 m de desnivell, de dificultat moderada, que es pot fer en tots dos sentits. De l'Era d'en Petasques puja pel Bosc de Pedres i la drecera del Puig, passa per sobre de la pedrera del Sot de Goleres, segueix la pista dels bombers i el camí de les barraques de pedra seca fins al cim, i torna pel corriol de la carena cap a l'Alzina Balladora i les Fonts Altes. Gairebé tota va per corriols.",
				es: "Es la ruta 1 de la guía municipal de 2020: una circular de 5,5 km y 360 m de desnivel, de dificultad moderada, que se puede hacer en ambos sentidos. Desde la Era d'en Petasques sube por el Bosc de Pedres y la drecera del Puig, pasa por encima de la cantera del Sot de Goleres, sigue la pista de los bomberos y el camino de las barracas de piedra seca hasta la cima, y vuelve por el sendero de la loma hacia la Alzina Balladora y las Fonts Altes. Casi toda va por senderos."
			},
			fonts: [CASTELLAR_RUTES]
		}
	],
	consells: {
		ca: [
			"Damunt de la pedrera del Sot de Goleres hi ha trams de baixada pronunciada i pedra: l'Ajuntament demana no acostar-se al límit, perquè hi ha perill de caiguda.",
			"L'itinerari de la plaça Major no està senyalitzat, tret d'un tram de baixada amb senyals grocs: porta'n la descripció municipal o un track.",
			'Si busques la versió curta, la ruta de les barraques fa 5,5 km, gairebé tota per corriol i amb 360 m de desnivell.',
			"A dalt, fes el tomb a l'ermita per veure tota la panoràmica, com recomana l'Ajuntament.",
			'Les fonts donen nom a mig itinerari, però no donis per fet que ragin: porta aigua.'
		],
		es: [
			'Encima de la cantera del Sot de Goleres hay tramos de bajada pronunciada y piedra: el Ayuntamiento pide no acercarse al borde, porque hay peligro de caída.',
			'El itinerario de la plaza Mayor no está señalizado, salvo un tramo de bajada con señales amarillas: lleva la descripción municipal o un track.',
			'Si buscas la versión corta, la ruta de las barracas tiene 5,5 km, casi toda por sendero y con 360 m de desnivel.',
			'Arriba, da la vuelta a la ermita para ver toda la panorámica, como recomienda el Ayuntamiento.',
			'Las fuentes dan nombre a medio itinerario, pero no des por hecho que manen: lleva agua.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puig de la Creu?',
				resposta:
					"L'Ajuntament de Castellar publica dues circulars, de 9,3 km des de la plaça Major i de 5,5 km i 360 m de desnivell per les barraques de pedra seca, però no en dona l'horari."
			},
			{
				pregunta: 'És una excursió difícil?',
				resposta:
					"No. L'Ajuntament classifica de fàcil l'itinerari de la plaça Major i de moderada la ruta de les barraques, que és més curta però va gairebé tota per corriol. L'únic punt on cal anar amb compte és el pas per sobre de la pedrera del Sot de Goleres."
			},
			{
				pregunta: 'Què hi ha al cim del Puig de la Creu?',
				resposta:
					"L'església de Santa Maria, una capella rural que l'Ajuntament inclou entre les del segle XII sense ornamentació, i un vèrtex geodèsic."
			},
			{
				pregunta: 'Es pot fer amb nens?',
				resposta:
					'La guia municipal marca la ruta de les barraques com una sortida per anar-hi amb la família. Amb canalla, cal tenir-los a prop al tram de damunt de la pedrera.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puig de la Creu?',
				resposta:
					'El Ayuntamiento de Castellar publica dos circulares, de 9,3 km desde la plaza Mayor y de 5,5 km y 360 m de desnivel por las barracas de piedra seca, pero no da el horario.'
			},
			{
				pregunta: '¿Es una excursión difícil?',
				resposta:
					'No. El Ayuntamiento clasifica de fácil el itinerario de la plaza Mayor y de moderada la ruta de las barracas, que es más corta pero va casi toda por sendero. El único punto donde hay que ir con cuidado es el paso por encima de la cantera del Sot de Goleres.'
			},
			{
				pregunta: '¿Qué hay en la cima del Puig de la Creu?',
				resposta:
					'La iglesia de Santa Maria, una capilla rural que el Ayuntamiento incluye entre las del siglo XII sin ornamentación, y un vértice geodésico.'
			},
			{
				pregunta: '¿Se puede hacer con niños?',
				resposta:
					'La guía municipal marca la ruta de las barracas como una salida para ir con la familia. Con niños, hay que tenerlos cerca en el tramo de encima de la cantera.'
			}
		]
	},
	fonts: [VIQUIPEDIA, CASTELLAR_ITINERARI, CASTELLAR_PUIG, CASTELLAR_RUTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
