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
	nom: "Ajuntament de Castellar del Vallès: Descobreix l'entorn natural, rutes de natura (2020)",
	url: 'https://www.castellarvalles.cat/arxius/document/7493/arxiu/rutesactual574.pdf',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-de-la-creu',
	descripcio: {
		ca: [
			"El Puig de la Creu és la muntanya que domina Castellar del Vallès, al [Vallès Occidental](/comarques/valles-occidental). L'Ajuntament el defineix com el cim més alt de Castellar i com a límit divisori entre els termes de Castellar i Sentmenat. Al cim hi ha l'església de Santa Maria, una de les capelles rurals del segle XII sense ornamentació, segons el consistori, restaurada i modificada en diverses ocasions. A la comarca hi ha també [la Mola de Sant Llorenç del Munt](/cims/la-mola-de-sant-llorenc-del-munt) i [Castellsapera](/cims/castellsapera).",
			'La Viquipèdia recull una llegenda local: segons ella, aquí va morir el drac de Sant Llorenç del Munt. També hi ha un vèrtex geodèsic al cim.',
			"L'Ajuntament proposa dos itineraris per pujar-hi. El primer, anomenat Itinerari pel Puig de la Creu, surt de la font de la plaça Major, passa per les fonts dels Casots, dels Gossos i del Gurri, arriba al Puig de la Creu i torna al nucli per Can Padró i la font del Cosidor. L'Ajuntament el classifica de fàcil i avisa que no està senyalitzat: cal seguir la descripció. Recomana, a dalt, donar la volta a l'ermita per veure la panoràmica.",
			"El segon és una de les rutes de natura de l'Ajuntament: una circular de 5,5 km i 360 m de desnivell que passa per les barraques de pedra seca i torna per un corriol de carena. Gairebé tot el recorregut va per corriols, tret d'alguns trams curts de pista. L'Ajuntament avisa de tenir cura quan es passa per sobre de la pedrera del Sot de Goleres, perquè hi ha trams de baixada pronunciada i pedra, i demana no apropar-se al límit pel perill de caiguda."
		],
		es: [
			'El Puig de la Creu es la montaña que domina Castellar del Vallès, en el [Vallès Occidental](/comarques/valles-occidental). El Ayuntamiento lo define como la cima más alta de Castellar y como límite divisorio entre los términos de Castellar y Sentmenat. En la cima está la iglesia de Santa Maria, una de las capillas rurales del siglo XII sin ornamentación, según el consistorio, restaurada y modificada en varias ocasiones. En la comarca están también [la Mola de Sant Llorenç del Munt](/cims/la-mola-de-sant-llorenc-del-munt) y [Castellsapera](/cims/castellsapera).',
			'La Viquipèdia recoge una leyenda local: según ella, aquí murió el dragón de Sant Llorenç del Munt. También hay un vértice geodésico en la cima.',
			'El Ayuntamiento propone dos itinerarios para subir. El primero, llamado Itinerari pel Puig de la Creu, sale de la fuente de la plaça Major, pasa por las fuentes dels Casots, dels Gossos y del Gurri, llega al Puig de la Creu y vuelve al núcleo por Can Padró y la font del Cosidor. El Ayuntamiento lo clasifica de fácil y avisa de que no está señalizado: hay que seguir la descripción. Recomienda, arriba, dar la vuelta a la ermita para ver la panorámica.',
			'El segundo es una de las rutas de naturaleza del Ayuntamiento: una circular de 5,5 km y 360 m de desnivel que pasa por las barracas de piedra seca y vuelve por un sendero de cresta. Casi todo el recorrido va por senderos, salvo algunos tramos cortos de pista. El Ayuntamiento avisa de tener cuidado al pasar por encima de la cantera del Sot de Goleres, porque hay tramos de bajada pronunciada y piedra, y pide no acercarse al borde por el peligro de caída.'
		]
	},
	rutes: [
		{
			id: 'placa-major',
			nom: {
				ca: 'Itinerari municipal des de la plaça Major de Castellar',
				es: 'Itinerario municipal desde la plaça Major de Castellar'
			},
			sortida: { nom: 'Font de la plaça Major (Castellar del Vallès)' },
			tecnicitat: 'cap',
			descripcio: {
				ca: "Itinerari municipal de 9,3 km, classificat de fàcil, que combina carrers i escales urbanes amb pistes forestals, corriols i senders. Surt de la font de la plaça Major, passa per les fonts dels Casots, dels Gossos i del Gurri fins al Puig de la Creu i torna per Can Padró i la font del Cosidor, acabant a la plaça Major. No està senyalitzat; l'Ajuntament recomana donar la volta a l'ermita del cim per veure la panoràmica. La distància és de la circular sencera.",
				es: 'Itinerario municipal de 9,3 km, clasificado de fácil, que combina calles y escaleras urbanas con pistas forestales, senderos y sendas. Sale de la fuente de la plaça Major, pasa por las fuentes dels Casots, dels Gossos y del Gurri hasta el Puig de la Creu y vuelve por Can Padró y la font del Cosidor, acabando en la plaça Major. No está señalizado; el Ayuntamiento recomienda dar la vuelta a la ermita de la cima para ver la panorámica. La distancia es de la circular entera.'
			},
			fonts: [CASTELLAR_ITINERARI, CASTELLAR_PUIG]
		},
		{
			id: 'barraques',
			nom: {
				ca: 'Ruta de natura per les barraques de pedra seca',
				es: 'Ruta de naturaleza por las barracas de piedra seca'
			},
			sortida: { nom: "Era d'en Petasques (Castellar del Vallès)" },
			descripcio: {
				ca: "Circular de 5,5 km i 360 m de desnivell de la guia de rutes de natura de l'Ajuntament (2020), que es pot fer en els dos sentits. Passa per la drecera del Puig, per sobre de la pedrera del Sot de Goleres, per la pista dels bombers i pel camí de les barraques de pedra seca, arriba al Puig de la Creu i torna pel corriol de la carena en direcció a l'Alzina Balladora i les Fonts Altes. Gairebé tot va per corriols. Cal tenir cura a la pedrera del Sot de Goleres pel perill de caiguda.",
				es: 'Circular de 5,5 km y 360 m de desnivel de la guía de rutas de naturaleza del Ayuntamiento (2020), que se puede hacer en los dos sentidos. Pasa por el atajo del Puig, por encima de la cantera del Sot de Goleres, por la pista de los bomberos y por el camino de las barracas de piedra seca, llega al Puig de la Creu y vuelve por el sendero de la cresta en dirección a la Alzina Balladora y las Fonts Altes. Casi todo va por senderos. Hay que tener cuidado en la cantera del Sot de Goleres por el peligro de caída.'
			},
			fonts: [CASTELLAR_RUTES]
		}
	],
	consells: {
		ca: [
			"Prop de la pedrera del Sot de Goleres hi ha trams de baixada pronunciada i pedra: l'Ajuntament demana no apropar-se al límit pel perill de caiguda.",
			"L'itinerari de la plaça Major no està senyalitzat, segons l'Ajuntament: porta el track o la descripció municipal.",
			"A dalt, dona la volta a l'ermita de Santa Maria per veure la panoràmica, com recomana l'Ajuntament.",
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'Cerca de la cantera del Sot de Goleres hay tramos de bajada pronunciada y piedra: el Ayuntamiento pide no acercarse al borde por el peligro de caída.',
			'El itinerario de la plaça Major no está señalizado, según el Ayuntamiento: lleva el track o la descripción municipal.',
			'Arriba, da la vuelta a la ermita de Santa Maria para ver la panorámica, como recomienda el Ayuntamiento.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quins itineraris hi ha per pujar al Puig de la Creu?',
				resposta:
					"L'itinerari municipal des de la plaça Major fa 9,3 km, circular, i la ruta de natura de les barraques, 5,5 km i 360 m de desnivell."
			},
			{
				pregunta: "L'itinerari és difícil?",
				resposta:
					"L'Ajuntament classifica de fàcil l'itinerari de la plaça Major. A la ruta de natura, gairebé tot va per corriols i cal tenir cura a la pedrera del Sot de Goleres."
			},
			{
				pregunta: 'Què hi ha al cim?',
				resposta:
					"L'església de Santa Maria, una capella rural del segle XII, segons l'Ajuntament, i un vèrtex geodèsic. La Viquipèdia recull la llegenda que hi va morir el drac de Sant Llorenç del Munt."
			},
			{
				pregunta: 'El Puig de la Creu és un cim essencial?',
				resposta:
					"Sí. Al [Vallès Occidental](/comarques/valles-occidental) l'acompanyen [Castellsapera](/cims/castellsapera) i [la Mola de Sant Llorenç del Munt](/cims/la-mola-de-sant-llorenc-del-munt)."
			}
		],
		es: [
			{
				pregunta: '¿Qué itinerarios hay para subir al Puig de la Creu?',
				resposta:
					'El itinerario municipal desde la plaça Major tiene 9,3 km, circular, y la ruta de naturaleza de las barracas, 5,5 km y 360 m de desnivel.'
			},
			{
				pregunta: '¿El itinerario es difícil?',
				resposta:
					'El Ayuntamiento clasifica de fácil el itinerario de la plaça Major. En la ruta de naturaleza, casi todo va por senderos y hay que tener cuidado en la cantera del Sot de Goleres.'
			},
			{
				pregunta: '¿Qué hay en la cima?',
				resposta:
					'La iglesia de Santa Maria, una capilla rural del siglo XII, según el Ayuntamiento, y un vértice geodésico. La Viquipèdia recoge la leyenda de que allí murió el dragón de Sant Llorenç del Munt.'
			},
			{
				pregunta: '¿El Puig de la Creu es una cima esencial?',
				resposta:
					'Sí. En el [Vallès Occidental](/comarques/valles-occidental) lo acompañan [Castellsapera](/cims/castellsapera) y [la Mola de Sant Llorenç del Munt](/cims/la-mola-de-sant-llorenc-del-munt).'
			}
		]
	},
	fonts: [VIQUIPEDIA, CASTELLAR_ITINERARI, CASTELLAR_PUIG, CASTELLAR_RUTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
