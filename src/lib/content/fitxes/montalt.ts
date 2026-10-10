import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Montalt (Dosrius)',
	url: 'https://ca.wikipedia.org/wiki/Montalt_(Dosrius)',
	consultat: CONSULTAT
};

const SURTDECASA = {
	nom: 'Surt de Casa: les 10 millors excursions pel Maresme',
	url: 'https://surtdecasa.cat/barcelona/entorn/10-millors-excursions-pel-maresme',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'montalt',
	descripcio: {
		ca: [
			"El Montalt és un contrafort de la Serralada Litoral al [Maresme](/comarques/maresme), entre la serra del Corredor i el Montnegre. Segons la Viquipèdia, el cim es reparteix entre els termes de Sant Andreu de Llavaneres, Dosrius i Sant Vicenç de Montalt, i el catàleg el situa a Dosrius. Juntament amb la serra del Corredor, forma el massís del Corredor, que el coll del Bruc i la creu de Rupit connecten. L'altre cim essencial del Maresme és [el castell de Burriac](/cims/castell-de-burriac).",
			'Surt de Casa el descriu com el cim que queda entre el Corredor i el Montnegre. Prop del punt més alt hi ha un vèrtex geodèsic de primer ordre, on solen arribar els excursionistes, segons la Viquipèdia, i per Nadal és tradició posar-hi un petit pessebre.',
			"L'ascensió final es fa deixant la pista forestal i agafant un dels tres corriols que arriben fins al cim; la Viquipèdia en cita tres punts de sortida: el coll de la Ferradura, el coll de Paietes i la Brolleta de Montalt. La Viquipèdia avisa que les pedres poden ser relliscoses quan el terra és moll.",
			"Una de les maneres de pujar-hi és la que recull Surt de Casa amb el títol Al Montalt per Sant Andreu de Llavaneres: surt del parc de la Font de la Llorita i segueix el camí de les masies de Llavaneres per sortir de la població; després va per corriols i pistes fins al Montalt, i a la tornada passa pel cementiri i per l'ermita de Sant Sebastià."
		],
		es: [
			'El Montalt es un contrafuerte de la Serralada Litoral en el [Maresme](/comarques/maresme), entre la sierra del Corredor y el Montnegre. Según la Viquipèdia, la cima se reparte entre los términos de Sant Andreu de Llavaneres, Dosrius y Sant Vicenç de Montalt, y el catálogo lo sitúa en Dosrius. Junto con la sierra del Corredor, forma el macizo del Corredor, que el coll del Bruc y la creu de Rupit conectan. La otra cima esencial del Maresme es [el castell de Burriac](/cims/castell-de-burriac).',
			'Surt de Casa lo describe como la cima que queda entre el Corredor y el Montnegre. Junto al punto más alto hay un vértice geodésico de primer orden, donde suelen llegar los excursionistas, según la Viquipèdia, y por Navidad es tradición poner allí un pequeño belén.',
			'La ascensión final se hace dejando la pista forestal y tomando uno de los tres senderos que llegan hasta la cima; la Viquipèdia cita tres puntos de salida: el coll de la Ferradura, el coll de Paietes y la Brolleta de Montalt. La Viquipèdia avisa de que las piedras pueden estar resbaladizas cuando el suelo está mojado.',
			'Una de las maneras de subir es la que recoge Surt de Casa con el título Al Montalt per Sant Andreu de Llavaneres: sale del parque de la Font de la Llorita y sigue el camino de las masías de Llavaneres para salir de la población; después va por senderos y pistas hasta el Montalt, y a la vuelta pasa por el cementerio y por la ermita de Sant Sebastià.'
		]
	},
	rutes: [
		{
			id: 'llavaneres',
			nom: {
				ca: 'Des de Sant Andreu de Llavaneres pel parc de la Font de la Llorita',
				es: 'Desde Sant Andreu de Llavaneres por el parque de la Font de la Llorita'
			},
			sortida: { nom: 'Parc de la Font de la Llorita (Sant Andreu de Llavaneres)' },
			descripcio: {
				ca: "Surt de Casa la presenta com la ruta 6 de les deu millors excursions pel Maresme: s'enfila pel parc de la Font de la Llorita i pel camí de les masies de Llavaneres per deixar la població, continua per corriols i pistes fins al Montalt i, a la tornada, passa pel cementiri i per l'ermita de Sant Sebastià.",
				es: 'Surt de Casa la presenta como la ruta 6 de las diez mejores excursiones por el Maresme: se encarama por el parque de la Font de la Llorita y por el camino de las masías de Llavaneres para dejar la población, continúa por senderos y pistas hasta el Montalt y, a la vuelta, pasa por el cementerio y por la ermita de Sant Sebastià.'
			},
			fonts: [SURTDECASA]
		},
		{
			id: 'corriols',
			nom: {
				ca: 'Pels tres corriols finals (coll de la Ferradura, coll de Paietes, Brolleta de Montalt)',
				es: 'Por los tres senderos finales (coll de la Ferradura, coll de Paietes, Brolleta de Montalt)'
			},
			sortida: { nom: 'Coll de la Ferradura (Dosrius)' },
			descripcio: {
				ca: "La Viquipèdia descriu l'ascensió final per un dels tres corriols que surten de la pista forestal i arriben al cim, des del coll de la Ferradura, el coll de Paietes o la Brolleta de Montalt. Avisa que les pedres poden ser relliscoses amb el terra moll.",
				es: 'La Viquipèdia describe la ascensión final por uno de los tres senderos que salen de la pista forestal y llegan a la cima, desde el coll de la Ferradura, el coll de Paietes o la Brolleta de Montalt. Avisa de que las piedras pueden ser resbaladizas con el suelo mojado.'
			},
			fonts: [VIQUIPEDIA]
		}
	],
	consells: {
		ca: [
			'Amb el terra moll les pedres dels corriols finals poden ser relliscoses, segons la Viquipèdia: calça sola amb bona adherència.',
			"Surt de Casa tanca la ruta de Llavaneres pel cementiri i l'ermita de Sant Sebastià; planifica la tornada amb llum de sobres.",
			'Mesura la distància i el temps amb un mapa abans de sortir i compta les hores de llum.',
			"Per Nadal, segons la Viquipèdia, es posa un petit pessebre al cim: respecta'l.",
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'Con el suelo mojado las piedras de los senderos finales pueden ser resbaladizas, según la Viquipèdia: calza suela con buen agarre.',
			'Surt de Casa cierra la ruta de Llavaneres por el cementerio y la ermita de Sant Sebastià; planifica la vuelta con luz de sobra.',
			'Mide la distancia y el tiempo con un mapa antes de salir y cuenta las horas de luz.',
			'Por Navidad, según la Viquipèdia, se pone un pequeño belén en la cima: respétalo.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Per on es puja al Montalt?',
				resposta:
					'Segons la Viquipèdia, deixant la pista forestal i agafant un dels tres corriols que arriben al cim, des del coll de la Ferradura, el coll de Paietes o la Brolleta de Montalt. Surt de Casa proposa pujar des de Sant Andreu de Llavaneres.'
			},
			{
				pregunta: 'A quins municipis pertany el cim?',
				resposta:
					'La Viquipèdia el reparteix entre Sant Andreu de Llavaneres, Dosrius i Sant Vicenç de Montalt; el catàleg el situa a Dosrius.'
			},
			{
				pregunta: 'Què hi ha al cim del Montalt?',
				resposta:
					'Un vèrtex geodèsic de primer ordre, i per Nadal un petit pessebre, segons la Viquipèdia.'
			},
			{
				pregunta: 'El Montalt és un cim essencial?',
				resposta:
					"Sí. Al [Maresme](/comarques/maresme) l'acompanya [el castell de Burriac](/cims/castell-de-burriac)."
			}
		],
		es: [
			{
				pregunta: '¿Por dónde se sube al Montalt?',
				resposta:
					'Según la Viquipèdia, dejando la pista forestal y tomando uno de los tres senderos que llegan a la cima, desde el coll de la Ferradura, el coll de Paietes o la Brolleta de Montalt. Surt de Casa propone subir desde Sant Andreu de Llavaneres.'
			},
			{
				pregunta: '¿A qué municipios pertenece la cima?',
				resposta:
					'La Viquipèdia la reparte entre Sant Andreu de Llavaneres, Dosrius y Sant Vicenç de Montalt; el catálogo la sitúa en Dosrius.'
			},
			{
				pregunta: '¿Qué hay en la cima del Montalt?',
				resposta:
					'Un vértice geodésico de primer orden, y por Navidad un pequeño belén, según la Viquipèdia.'
			},
			{
				pregunta: '¿El Montalt es una cima esencial?',
				resposta:
					'Sí. En el [Maresme](/comarques/maresme) lo acompaña [el castell de Burriac](/cims/castell-de-burriac).'
			}
		]
	},
	fonts: [VIQUIPEDIA, SURTDECASA],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
