import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Tossal Gros (Figuerola del Camp)',
	url: 'https://ca.wikipedia.org/wiki/Tossal_Gros_(Figuerola_del_Camp)',
	consultat: CONSULTAT
};

const VIQUIPEDIA_SERRA = {
	nom: 'Viquipèdia: Serra de Miramar',
	url: 'https://ca.wikipedia.org/wiki/Serra_de_Miramar',
	consultat: CONSULTAT
};

const DIARI_TARRAGONA = {
	nom: 'Diari de Tarragona: De ruta por Tarragona, las ciudades del mundo (Miramar)',
	url: 'https://www.diaridetarragona.com/cultura/254289/ruta-tarragona-ciudades-mundo.html',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: El tossal Gros',
	url: 'https://reptesmuntanyencs.cat/tossal-gros/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'el-tossal-gros',
	descripcio: {
		ca: [
			"El Tossal Gros és el punt més alt de la serra de Miramar, la carena calcària que separa [l'Alt Camp](/comarques/alt-camp) de la Conca de Barberà. El cim fa de partió entre els termes de Figuerola del Camp i de Montblanc. La serra, que agrupa les de les Guixeres, Carbonària i Jordà, s'allarga uns 13 km de nord-est a sud-oest entre el coll de Cabra i el Francolí, i a més del Tossal Gros hi destaquen la Cogulla i el tossal de la Somerota.",
			"El tossal té una silueta inconfusible, de barret punxegut, que el fa reconeixible tant des de la plana de Valls com des de la de Montblanc. El cim corona un cingle d'uns set-cents metres de llarg i una seixantena d'alt, la traça d'una falla. Al seu peu hi ha el castell de Prenafeta, i a l'altre vessant, Miramar, el llogaret que dona nom a la serra: un poble que es va arribar a quedar amb un sol veí, Joan Queralt, i que el geògraf Josep Iglésies va retratar a «Les ciutats del món» (1948).",
			"La serra fa de pantalla entre la costa i l'interior, i el cim és un mirador d'horitzó ampli; de Miramar estant, la plana del Camp s'estén fins al mar. L'altre cim essencial proper és [el Cogulló de Cabra](/cims/el-cogullo-de-cabra), a la serra de Comaverd.",
			'És una muntanya fàcil, de camins amples i ben indicats, però gairebé sense ombra: amb sol fort es fa pesada. Les pluges, aquí, es concentren a la tardor i a la primavera.'
		],
		es: [
			'El Tossal Gros es el punto más alto de la sierra de Miramar, la cresta caliza que separa [el Alt Camp](/comarques/alt-camp) de la Conca de Barberà. La cima hace de linde entre los términos de Figuerola del Camp y de Montblanc. La sierra, que agrupa las de les Guixeres, Carbonària y Jordà, se alarga unos 13 km de noreste a suroeste entre el coll de Cabra y el Francolí, y además del Tossal Gros destacan en ella la Cogulla y el tossal de la Somerota.',
			'El tossal tiene una silueta inconfundible, de sombrero puntiagudo, que lo hace reconocible tanto desde el llano de Valls como desde el de Montblanc. La cima corona un risco de unos setecientos metros de largo y unos sesenta de alto, la traza de una falla. A su pie está el castillo de Prenafeta, y en la otra vertiente, Miramar, la aldea que da nombre a la sierra: un pueblo que llegó a quedarse con un solo vecino, Joan Queralt, y que el geógrafo Josep Iglésies retrató en «Les ciutats del món» (1948).',
			'La sierra hace de pantalla entre la costa y el interior, y la cima es un mirador de horizonte amplio; desde Miramar, el llano del Camp se extiende hasta el mar. La otra cima esencial cercana es [el Cogulló de Cabra](/cims/el-cogullo-de-cabra), en la sierra de Comaverd.',
			'Es una montaña fácil, de caminos anchos y bien indicados, pero casi sin sombra: con sol fuerte se hace pesada. Las lluvias, aquí, se concentran en otoño y en primavera.'
		]
	},
	rutes: [
		{
			id: 'prenafeta',
			nom: {
				ca: 'Circular des de Prenafeta pel coll de la Coloma',
				es: 'Circular desde Prenafeta por el coll de la Coloma'
			},
			sortida: { nom: 'Prenafeta (Montblanc)' },
			tecnicitat: 'cap',
			descripcio: {
				ca: "La ressenya del bloc Reptes Muntanyencs (2011) fa una volta de 6,2 km i 395 m de desnivell positiu en 1 h 35 min de marxa. De Prenafeta se surt pel camí de Cabra seguint els pals indicadors del coll de l'Era del Caterí i, després, els del coll de la Coloma, on s'assoleix la carena; d'allà es gira a la dreta i en uns 250 m s'és al cim, a 4,3 km de la sortida. Es baixa per l'altre costat cap al coll de Prenafeta, deixant a la dreta el trencall del castell, fins a retrobar el camí de Cabra. Són pistes amples en bon estat i camins fressats, amb pals indicadors a totes les cruïlles.",
				es: "La reseña del blog Reptes Muntanyencs (2011) hace una vuelta de 6,2 km y 395 m de desnivel positivo en 1 h 35 min de marcha. De Prenafeta se sale por el camino de Cabra siguiendo los postes indicadores del coll de l'Era del Caterí y, después, los del coll de la Coloma, donde se alcanza la cresta; desde allí se gira a la derecha y en unos 250 m se está en la cima, a 4,3 km de la salida. Se baja por el otro lado hacia el coll de Prenafeta, dejando a la derecha el desvío del castillo, hasta recuperar el camino de Cabra. Son pistas anchas en buen estado y caminos trillados, con postes indicadores en todos los cruces."
			},
			fonts: [REPTES]
		},
		{
			id: 'miramar',
			nom: {
				ca: 'Des de Miramar',
				es: 'Desde Miramar'
			},
			sortida: { nom: 'Miramar (Figuerola del Camp)' },
			descripcio: {
				ca: "Pel vessant de l'Alt Camp, el punt de sortida és Miramar, on s'arriba per un trencall del quilòmetre 27 de la N-240; passada l'església romànica de Sant Mateu, una pista forestal porta a una petita zona d'aparcament. Del poble surten senders com el GR 7 i la ruta del Tossal Gros i la Cogulla, l'altre cim destacat de la serra.",
				es: 'Por la vertiente del Alt Camp, el punto de salida es Miramar, adonde se llega por un desvío del kilómetro 27 de la N-240; pasada la iglesia románica de Sant Mateu, una pista forestal lleva a una pequeña zona de aparcamiento. Del pueblo salen senderos como el GR 7 y la ruta del Tossal Gros y la Cogulla, la otra cima destacada de la sierra.'
			},
			fonts: [DIARI_TARRAGONA]
		}
	],
	consells: {
		ca: [
			"No hi ha aigua en tot el recorregut i l'arbrat és escàs fins al tram final: a l'estiu, matina.",
			'El cim corona un cingle: vigila la canalla a la vora.',
			'Una pista arriba amb cotxe fins al coll de la Coloma des de tots dos vessants, però el tossal es mereix la pujada a peu.',
			"Si surts de Miramar, hi ha una petita zona d'aparcament a la pista forestal, passada l'església."
		],
		es: [
			'No hay agua en todo el recorrido y el arbolado es escaso hasta el tramo final: en verano, madruga.',
			'La cima corona un risco: vigila a los niños en el borde.',
			'Una pista llega en coche hasta el coll de la Coloma desde ambas vertientes, pero el tossal merece la subida a pie.',
			'Si sales de Miramar, hay una pequeña zona de aparcamiento en la pista forestal, pasada la iglesia.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Tossal Gros?',
				resposta:
					'Des de Prenafeta, el bloc Reptes Muntanyencs hi va arribar en 1 h 12 min, aturades incloses, després de 4,3 km, i va completar la circular de 6,2 km i 395 m de desnivell en 1 h 35 min de marxa.'
			},
			{
				pregunta: 'Quin Tossal Gros és el del repte?',
				resposta:
					"El de la serra de Miramar, entre Figuerola del Camp i Montblanc. No s'ha de confondre amb el Tossal Gros de Mont-ral, a les Muntanyes de Prades, ni amb el [Tossal Gros de Vallbona](/cims/tossal-gros-de-vallbona), a la serra del Tallat."
			},
			{
				pregunta: 'Està senyalitzat?',
				resposta:
					'Sí. El camí de Prenafeta té pals indicadors del consell comarcal a totes les cruïlles, i de Miramar surt la ruta del Tossal Gros i la Cogulla.'
			},
			{
				pregunta: 'Compta com a cim essencial?',
				resposta:
					"Sí, és un dels tres [cims essencials](/cims-essencials) de l'Alt Camp, amb el Cogulló de Cabra i la [Tossa Grossa de Montferri](/cims/tossa-grossa-de-montferri)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Tossal Gros?',
				resposta:
					'Desde Prenafeta, el blog Reptes Muntanyencs llegó en 1 h 12 min, paradas incluidas, tras 4,3 km, y completó la circular de 6,2 km y 395 m de desnivel en 1 h 35 min de marcha.'
			},
			{
				pregunta: '¿Qué Tossal Gros es el del reto?',
				resposta:
					'El de la sierra de Miramar, entre Figuerola del Camp y Montblanc. No hay que confundirlo con el Tossal Gros de Mont-ral, en las Muntanyes de Prades, ni con el [Tossal Gros de Vallbona](/cims/tossal-gros-de-vallbona), en la sierra del Tallat.'
			},
			{
				pregunta: '¿Está señalizado?',
				resposta:
					'Sí. El camino de Prenafeta tiene postes indicadores del consell comarcal en todos los cruces, y de Miramar sale la ruta del Tossal Gros y la Cogulla.'
			},
			{
				pregunta: '¿Cuenta como cima esencial?',
				resposta:
					'Sí, es una de las tres [cimas esenciales](/cims-essencials) del Alt Camp, con el Cogulló de Cabra y la [Tossa Grossa de Montferri](/cims/tossa-grossa-de-montferri).'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_SERRA, DIARI_TARRAGONA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
