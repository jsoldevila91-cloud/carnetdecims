import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Els Bessons (les Borges Blanques)',
	url: 'https://ca.wikipedia.org/wiki/Els_Bessons_(les_Borges_Blanques)',
	consultat: CONSULTAT
};

const VIQUIPEDIA_EIN = {
	nom: 'Viquipèdia: Els Bessons (Garrigues)',
	url: 'https://ca.wikipedia.org/wiki/Els_Bessons_(Garrigues)',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Els Bessons',
	url: 'https://reptesmuntanyencs.cat/els-bessons/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'els-bessons',
	descripcio: {
		ca: [
			"Els Bessons són el punt més alt de l'espai natural i agroforestal del mateix nom, al terme de les Borges Blanques, a [les Garrigues](/comarques/garrigues). La Viquipèdia els descriu com un bon mirador sobre el Pla de Lleida i els Prepirineus i en dona la roca com a lutita i gres. L'ascens es pot començar a les Borges Blanques o des de la pista del Pla del Meno.",
			"L'espai d'interès natural dels Bessons fa uns 426 ha i toca els termes de Juneda, les Borges Blanques, Cervià de les Garrigues i Castelldans. Segons la Viquipèdia, és una zona de transició entre la plana esteparia del Segrià i l'Urgell i les àrees boscoses més altes de la serra de la Llena; són turons suaus que només arriben als 400–600 m, amb capes de calcària consolidada entre estrats argilosos. El paisatge és un mosaic de conreus de secà (olivera, vinya, ametller) entre turons coberts de vegetació natural contínua. Hi dominen el romaní i la maleïda, amb petits pinars de pi blanc.",
			'La fauna destaca per les rapinyaires: àguila cuabarrada, àguila daurada i duc, que cacen als matollars gràcies al conill; i per les aus estèpiques, com el gaig blau i el torlit. Per la proximitat, la [Punta del Curull](/cims/punta-del-curull), a la serra de la Llena, toca també el terme del Vilosell, a les Garrigues.',
			"Reptes Muntanyencs, que hi puja des del coll dels Marquesos, recorda que gairebé el 80 % del recorregut es fa per pistes, que no hi ha gens d'aigua i que el camí es fa a cel obert, amb pocs arbres i el sol de ple. Al cim hi ha un vèrtex geodèsic, un pessebre i, una mica darrere, un panell fotogràfic."
		],
		es: [
			'Els Bessons son el punto más alto del espacio natural y agroforestal del mismo nombre, en el término de les Borges Blanques, en [les Garrigues](/comarques/garrigues). La Viquipèdia los describe como un buen mirador sobre el Pla de Lleida y los Prepirineos y da la roca como lutita y arenisca. El ascenso se puede empezar en les Borges Blanques o desde la pista del Pla del Meno.',
			'El espacio de interés natural de Els Bessons tiene unas 426 ha y toca los términos de Juneda, les Borges Blanques, Cervià de les Garrigues y Castelldans. Según la Viquipèdia, es una zona de transición entre la llanura esteparia del Segrià y el Urgell y las áreas boscosas más altas de la serra de la Llena; son cerros suaves que solo llegan a los 400–600 m, con capas de caliza consolidada entre estratos arcillosos. El paisaje es un mosaico de cultivos de secano (olivo, viña, almendro) entre cerros cubiertos de vegetación natural continua. Dominan el romero y la aliaga, con pequeños pinares de pino carrasco.',
			'La fauna destaca por las rapaces: águila perdicera, águila real y búho real, que cazan en los matorrales gracias al conejo; y por las aves esteparias, como la carraca y el alcaraván. Por la proximidad, la [Punta del Curull](/cims/punta-del-curull), en la serra de la Llena, toca también el término del Vilosell, en las Garrigues.',
			'Reptes Muntanyencs, que sube desde el coll dels Marquesos, recuerda que casi el 80 % del recorrido se hace por pistas, que no hay nada de agua y que el camino se hace a cielo abierto, con pocos árboles y el sol de lleno. En la cima hay un vértice geodésico, un belén y, algo detrás, un panel fotográfico.'
		]
	},
	rutes: [
		{
			id: 'coll-dels-marquesos',
			nom: {
				ca: 'Circular des del coll dels Marquesos',
				es: 'Circular desde el coll dels Marquesos'
			},
			sortida: { nom: 'Coll dels Marquesos (les Borges Blanques)' },
			descripcio: {
				ca: "Reptes Muntanyencs documenta una circular que surt del coll dels Marquesos, amb pistes i senders: 10,9 km, uns 319 m de desnivell positiu i 2 h 17 min de marxa efectiva. Segons el seu track, el cim queda a uns 9,2 km de la sortida. Gairebé el 80 % del recorregut és per pistes, en millor o pitjor estat; no hi ha aigua i l'itinerari no està senyalitzat, tret d'un encreuament amb un pal i un cartell de prohibició de circulació motoritzada.",
				es: 'Reptes Muntanyencs documenta una circular que sale del coll dels Marquesos, con pistas y senderos: 10,9 km, unos 319 m de desnivel positivo y 2 h 17 min de marcha efectiva. Según su track, la cima queda a unos 9,2 km de la salida. Casi el 80 % del recorrido es por pistas, en mejor o peor estado; no hay agua y el itinerario no está señalizado, salvo un cruce con un poste y un cartel de prohibición de circulación motorizada.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"Segons el bloc, tot el camí es fa a cel obert, amb pocs arbres i el sol de ple: evita les hores centrals a l'estiu i porta gorra i crema.",
			"No hi ha gens d'aigua en tot el recorregut, segons el bloc: porta-la des de baix.",
			"L'itinerari no està senyalitzat, tret d'un encreuament amb un pal: porta el track.",
			"Un cartell prohibeix la circulació motoritzada a la pista: respecta'l.",
			"Telèfon d'emergències: 112."
		],
		es: [
			'Según el blog, todo el camino se hace a cielo abierto, con pocos árboles y el sol de lleno: evita las horas centrales en verano y lleva gorra y crema.',
			'No hay nada de agua en todo el recorrido, según el blog: llévala desde abajo.',
			'El itinerario no está señalizado, salvo un cruce con un poste: lleva el track.',
			'Un cartel prohíbe la circulación motorizada en la pista: respétalo.',
			'Teléfono de emergencias: 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar als Bessons?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 10,9 km des del coll dels Marquesos amb 2 h 17 min de marxa efectiva; segons el seu track, el cim queda als 9,2 km de la sortida.'
			},
			{
				pregunta: 'Per on es pot començar?',
				resposta:
					"Segons la Viquipèdia, l'ascens es pot començar a les Borges Blanques o des de la pista del Pla del Meno; el bloc surt del coll dels Marquesos."
			},
			{
				pregunta: 'Hi ha aigua pel camí?',
				resposta: "El bloc diu que no hi ha gens d'aigua en tot el recorregut; porta-la de casa."
			},
			{
				pregunta: 'Els Bessons compten com a cim essencial?',
				resposta: "Sí, és l'únic [cim essencial](/cims-essencials) de les Garrigues."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Els Bessons?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 10,9 km desde el coll dels Marquesos con 2 h 17 min de marcha efectiva; según su track, la cima queda a los 9,2 km de la salida.'
			},
			{
				pregunta: '¿Por dónde se puede empezar?',
				resposta:
					'Según la Viquipèdia, el ascenso se puede empezar en les Borges Blanques o desde la pista del Pla del Meno; el blog sale del coll dels Marquesos.'
			},
			{
				pregunta: '¿Hay agua en el camino?',
				resposta: 'El blog dice que no hay nada de agua en todo el recorrido; llévala de casa.'
			},
			{
				pregunta: '¿Els Bessons cuentan como cima esencial?',
				resposta: 'Sí, es la única [cima esencial](/cims-essencials) de las Garrigues.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_EIN, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
