import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: La Tossa (Tivissa)',
	url: 'https://ca.wikipedia.org/wiki/La_Tossa_(Tivissa)',
	consultat: CONSULTAT
};

const VIQUIPEDIA_MUNTANYES = {
	nom: 'Viquipèdia: Muntanyes de Tivissa-Vandellòs',
	url: 'https://ca.wikipedia.org/wiki/Muntanyes_de_Tivissa-Vandell%C3%B2s',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: La Tossa',
	url: 'https://reptesmuntanyencs.cat/la-tossa/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'la-tossa-tivissa',
	descripcio: {
		ca: [
			"La Tossa és un cim de la serra de Tivissa, a [la Ribera d'Ebre](/comarques/ribera-d-ebre), sobre el poble que li dona nom. És una muntanya de dolomia amb un vèrtex geodèsic al capdamunt, dins l'espai protegit de les Muntanyes de Tivissa-Vandellòs, i ocupa l'extrem de mestral del massís; a l'altre cap, tocant a la costa, hi ha el [Molló Puntaire](/cims/mollo-puntaire).",
			"El camí hi puja per davant de dues agulles de roca conegudes com el Gegant i la Geganta. Una mica abans es passa per la roca Verdura, un mirador sobre el poble, i per un plafó fotogràfic que ajuda a posar nom als cims de l'entorn. La xarxa de camins és densa: hi passa el GR 7 i hi ha senders de petit recorregut, pals indicadors i fites.",
			"Des del vèrtex la vista és oberta a tots els vents. La muntanya, com totes les d'aquest massís, és seca i de vegetació escassa; a prop hi ha la [Mola de Genessies](/cims/mola-de-genessies), amb la qual alguns excursionistes la combinen en una jornada molt llarga.",
			"L'estiu no és bona època: la calor hi pica fort i només hi ha una font, la de Sant Blai, al peu de la muntanya."
		],
		es: [
			"La Tossa es una cima de la sierra de Tivissa, en [la Ribera d'Ebre](/comarques/ribera-d-ebre), sobre el pueblo que le da nombre. Es una montaña de dolomía con un vértice geodésico en lo alto, dentro del espacio protegido de las Muntanyes de Tivissa-Vandellòs, y ocupa el extremo noroeste del macizo; en el otro extremo, junto a la costa, está el [Molló Puntaire](/cims/mollo-puntaire).",
			'El camino sube por delante de dos agujas de roca conocidas como el Gegant y la Geganta. Un poco antes se pasa por la roca Verdura, un mirador sobre el pueblo, y por un panel fotográfico que ayuda a poner nombre a las cimas del entorno. La red de caminos es densa: pasa el GR 7 y hay senderos de pequeño recorrido, postes indicadores e hitos.',
			'Desde el vértice la vista está abierta a todos los vientos. La montaña, como todas las de este macizo, es seca y de vegetación escasa; cerca está la [Mola de Genessies](/cims/mola-de-genessies), con la que algunos excursionistas la combinan en una jornada muy larga.',
			'El verano no es buena época: el calor aprieta y solo hay una fuente, la de Sant Blai, al pie de la montaña.'
		]
	},
	rutes: [
		{
			id: 'mas-de-la-marca',
			nom: {
				ca: 'Circular des de Tivissa per la roca Verdura',
				es: 'Circular desde Tivissa por la roca Verdura'
			},
			sortida: { nom: 'Mas de la Marca de Dalt (Tivissa)' },
			descripcio: {
				ca: "La ressenya del bloc Reptes Muntanyencs (2016) fa una circular de 7,1 km i 460 m de desnivell positiu en 2 h 7 min de marxa, amb el cim a 3,5 km de la sortida. Surt pel GR 7 cap al sud-oest i el deixa per un corriol que puja al pas de lo Grau i a la carena, fins a la roca Verdura. D'allà una pista porta al collet de la Llena, on un pal indica la Tossa; un flanqueig amb fites escadusseres arriba al peu del Gegant i la Geganta, i un graó curt i fàcil dona pas al planell del cim. Es baixa pel coll de Montnegret i la font de Sant Blai, on es retroba el GR 7. Es pot escurçar sortint de Sant Blai, on s'arriba amb cotxe per una pista de ciment.",
				es: 'La reseña del blog Reptes Muntanyencs (2016) hace una circular de 7,1 km y 460 m de desnivel positivo en 2 h 7 min de marcha, con la cima a 3,5 km de la salida. Sale por el GR 7 hacia el suroeste y lo deja por una senda que sube al pas de lo Grau y a la cresta, hasta la roca Verdura. Desde allí una pista lleva al collet de la Llena, donde un poste indica la Tossa; un flanqueo con hitos escasos llega al pie del Gegant y la Geganta, y un escalón corto y fácil da paso al rellano de la cima. Se baja por el coll de Montnegret y la font de Sant Blai, donde se recupera el GR 7. Se puede acortar saliendo de Sant Blai, adonde se llega en coche por una pista de cemento.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'Omple la cantimplora a Tivissa o a la font de Sant Blai: no hi ha més aigua.',
			'El primer tros de la baixada cap al coll de Montnegret és un corriol poc marcat; busca la fita que assenyala el sender bo.',
			'A la baixada, el sender més fressat no és sempre el pintat: fes cas dels pals indicadors de la font de Sant Blai.',
			'Si vols enllaçar amb la Mola de Genessies, tingues en compte que és una travessa només per a gent molt entrenada.'
		],
		es: [
			'Llena la cantimplora en Tivissa o en la font de Sant Blai: no hay más agua.',
			'El primer tramo de la bajada hacia el coll de Montnegret es una senda poco marcada; busca el hito que señala el sendero bueno.',
			'En la bajada, el sendero más pisado no siempre es el pintado: haz caso de los postes indicadores de la font de Sant Blai.',
			'Si quieres enlazar con la Mola de Genessies, ten en cuenta que es una travesía solo para gente muy entrenada.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Tossa de Tivissa?',
				resposta:
					'El bloc Reptes Muntanyencs hi va arribar en 1 h 23 min, aturades incloses, després de 3,5 km, i va fer tota la circular de 7,1 km en poc més de dues hores de marxa.'
			},
			{
				pregunta: 'Està ben senyalitzada?',
				resposta:
					"Sí: hi ha pals de fusta, pintura de GR i de PR i fites, i els camins són fressats. Els punts on cal més atenció són el flanqueig cap al Gegant i l'inici de la baixada."
			},
			{
				pregunta: 'Què són el Gegant i la Geganta?',
				resposta:
					"Dues agulles de roca al peu del cim. El camí hi passa per sota abans d'enfilar-se al planell del vèrtex."
			},
			{
				pregunta: 'La Tossa compta com a cim essencial?',
				resposta:
					"Sí, és un dels tres [cims essencials](/cims-essencials) de la Ribera d'Ebre, amb [la Picossa](/cims/la-picossa) i [lo Tormo](/cims/lo-tormo)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Tossa de Tivissa?',
				resposta:
					'El blog Reptes Muntanyencs llegó en 1 h 23 min, paradas incluidas, tras 3,5 km, e hizo toda la circular de 7,1 km en poco más de dos horas de marcha.'
			},
			{
				pregunta: '¿Está bien señalizada?',
				resposta:
					'Sí: hay postes de madera, pintura de GR y de PR e hitos, y los caminos están trillados. Los puntos donde hace falta más atención son el flanqueo hacia el Gegant y el inicio de la bajada.'
			},
			{
				pregunta: '¿Qué son el Gegant y la Geganta?',
				resposta:
					'Dos agujas de roca al pie de la cima. El camino pasa por debajo antes de subir al rellano del vértice.'
			},
			{
				pregunta: '¿La Tossa cuenta como cima esencial?',
				resposta:
					"Sí, es una de las tres [cimas esenciales](/cims-essencials) de la Ribera d'Ebre, con [la Picossa](/cims/la-picossa) y [lo Tormo](/cims/lo-tormo)."
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_MUNTANYES, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
