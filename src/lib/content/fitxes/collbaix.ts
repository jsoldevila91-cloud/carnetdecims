import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Collbaix (Manresa)',
	url: 'https://ca.wikipedia.org/wiki/Collbaix_(Manresa)',
	consultat: CONSULTAT
};

const MANRESA = {
	nom: 'Ajuntament de Manresa, Anella Verda: El Collbaix (M1)',
	url: 'https://web.manresa.cat/web/article/7546-el-collbaix-(m1)',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: Collbaix, la talaia del Pla del Bages',
	url: 'https://totnens.cat/que-fem/collbaix-latalaia-del-pla-del-bages/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'collbaix',
	descripcio: {
		ca: [
			"El Collbaix és un turó del Pla de Bages, que el catàleg situa a Sant Joan de Vilatorrada, al [Bages](/comarques/bages). Segons la Viquipèdia, és el punt més alt del terme de Manresa i es reparteix entre els termes de Manresa, Sant Joan de Vilatorrada i Fonollosa. A la comarca, l'altre cim essencial és [l'Elefant](/cims/elefant-roca-de-sant-salvador), a Montserrat.",
			"La Viquipèdia explica que un estrat de conglomerat resistent protegeix de l'erosió el cim pla, i l'Ajuntament de Manresa el considera un bon exemple de relleu tabular. L'Ajuntament el defineix com un clar referent geogràfic per als manresans i com a destí habitual d'excursions matinals.",
			'Totnens, que el proposa com a ruta per a famílies, el descriu com una ruta fàcil i senyalitzada, per senders ben marcats i corriols, amb sortida al final del carrer Collbaix, a Sant Joan de Vilatorrada. El cim és una gran esplanada, amb vistes panoràmiques sobre el Pla de Bages i la muntanya de Montserrat.',
			'Atenció a dalt: Totnens avisa que cal vigilar perquè el cim acaba en un penya-segat. A la baixada hi ha trams pedregosos i alguns trams del camí, molt erosionats, semblen un torrent.'
		],
		es: [
			'El Collbaix es un cerro del Pla de Bages, que el catálogo sitúa en Sant Joan de Vilatorrada, en el [Bages](/comarques/bages). Según la Viquipèdia, es el punto más alto del término de Manresa y se reparte entre los términos de Manresa, Sant Joan de Vilatorrada y Fonollosa. En la comarca, la otra cima esencial es [el Elefant](/cims/elefant-roca-de-sant-salvador), en Montserrat.',
			'La Viquipèdia explica que un estrato de conglomerado resistente protege de la erosión la cima plana, y el Ayuntamiento de Manresa lo considera un buen ejemplo de relieve tabular. El Ayuntamiento lo define como un claro referente geográfico para los manresanos y como destino habitual de excursiones matinales.',
			'Totnens, que lo propone como ruta para familias, lo describe como una ruta fácil y señalizada, por sendas bien marcadas y senderos, con salida al final de la calle Collbaix, en Sant Joan de Vilatorrada. La cima es una gran explanada, con vistas panorámicas sobre el Pla de Bages y la montaña de Montserrat.',
			'Atención arriba: Totnens avisa de que hay que vigilar porque la cima acaba en un acantilado. En la bajada hay tramos pedregosos y algunos tramos del camino, muy erosionados, parecen un torrente.'
		]
	},
	rutes: [
		{
			id: 'sant-joan',
			nom: {
				ca: 'Des del carrer Collbaix, a Sant Joan de Vilatorrada',
				es: 'Desde la calle Collbaix, en Sant Joan de Vilatorrada'
			},
			sortida: { nom: 'Final del carrer Collbaix (Sant Joan de Vilatorrada)' },
			descripcio: {
				ca: 'Totnens la descriu com una ruta fàcil i senyalitzada, per senders ben marcats, corriols i pistes, amb algun tram de pujada una mica més costerut que es pot fer a poc a poc. El web dona 6,5 km i 3 hores amb parades; a la baixada hi ha trams pedregosos.',
				es: 'Totnens la describe como una ruta fácil y señalizada, por sendas bien marcadas, senderos y pistas, con algún tramo de subida algo más empinado que se puede hacer despacio. La web da 6,5 km y 3 horas con paradas; en la bajada hay tramos pedregosos.'
			},
			fonts: [TOTNENS]
		},
		{
			id: 'manresa-anella-verda',
			nom: {
				ca: "Itinerari M1 de l'Anella Verda des del Congost, a Manresa",
				es: 'Itinerario M1 del Anillo Verde desde el Congost, en Manresa'
			},
			sortida: { nom: 'El Congost, al costat del camp de futbol (Manresa)' },
			descripcio: {
				ca: "L'Ajuntament de Manresa recull l'itinerari El Collbaix (M1) de l'Anella Verda, de dificultat mitjana, amb 11,75 km, 3 hores i 421 m de desnivell, i sortida al Congost, al costat del camp de futbol.",
				es: 'El Ayuntamiento de Manresa recoge el itinerario El Collbaix (M1) del Anillo Verde, de dificultad media, con 11,75 km, 3 horas y 421 m de desnivel, y salida en el Congost, junto al campo de fútbol.'
			},
			fonts: [MANRESA]
		}
	],
	consells: {
		ca: [
			'El cim acaba en un penya-segat: vigila-hi, sobretot amb nens, segons Totnens.',
			'A la baixada hi ha trams pedregosos i alguns trams molt erosionats que semblen un torrent: baixa amb calma i no hi vagis amb pluja.',
			"Si vols una sortida més llarga, l'itinerari M1 de l'Anella Verda de Manresa fa 11,75 km i 421 m de desnivell, segons l'Ajuntament.",
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'La cima acaba en un acantilado: vigila, sobre todo con niños, según Totnens.',
			'En la bajada hay tramos pedregosos y algunos tramos muy erosionados que parecen un torrente: baja con calma y no vayas con lluvia.',
			'Si quieres una salida más larga, el itinerario M1 del Anillo Verde de Manresa tiene 11,75 km y 421 m de desnivel, según el Ayuntamiento.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Collbaix?',
				resposta:
					"Totnens compta 3 hores amb parades per a la ruta de 6,5 km des del carrer Collbaix. L'Ajuntament de Manresa dona 3 hores per a la circular M1 de 11,75 km."
			},
			{
				pregunta: 'Es pot pujar al Collbaix amb nens?',
				resposta:
					'Totnens el proposa com a ruta per a famílies, fàcil i senyalitzada. Al cim, que acaba en un penya-segat, cal vigilar els nens.'
			},
			{
				pregunta: 'Per què es diu relleu tabular?',
				resposta:
					"Perquè un estrat de conglomerat resistent protegeix de l'erosió el cim pla, segons la Viquipèdia; l'Ajuntament de Manresa el posa com a bon exemple."
			},
			{
				pregunta: 'El Collbaix és un cim essencial?',
				resposta:
					"Sí. Al [Bages](/comarques/bages) l'acompanya [l'Elefant](/cims/elefant-roca-de-sant-salvador), a Montserrat."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Collbaix?',
				resposta:
					'Totnens cuenta 3 horas con paradas para la ruta de 6,5 km desde la calle Collbaix. El Ayuntamiento de Manresa da 3 horas para la circular M1 de 11,75 km.'
			},
			{
				pregunta: '¿Se puede subir al Collbaix con niños?',
				resposta:
					'Totnens lo propone como ruta para familias, fácil y señalizada. En la cima, que acaba en un acantilado, hay que vigilar a los niños.'
			},
			{
				pregunta: '¿Por qué se habla de relieve tabular?',
				resposta:
					'Porque un estrato de conglomerado resistente protege de la erosión la cima plana, según la Viquipèdia; el Ayuntamiento de Manresa lo pone como buen ejemplo.'
			},
			{
				pregunta: '¿El Collbaix es una cima esencial?',
				resposta:
					'Sí. En el [Bages](/comarques/bages) lo acompaña [el Elefant](/cims/elefant-roca-de-sant-salvador), en Montserrat.'
			}
		]
	},
	fonts: [VIQUIPEDIA, MANRESA, TOTNENS],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
