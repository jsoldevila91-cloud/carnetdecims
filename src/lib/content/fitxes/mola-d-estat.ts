import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: "Viquipèdia: Mola d'Estat",
	url: 'https://ca.wikipedia.org/wiki/Mola_d%27Estat',
	consultat: CONSULTAT
};

const REPTES = {
	nom: "Reptes Muntanyencs: Mola d'Estat",
	url: 'https://reptesmuntanyencs.cat/mola-destat/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'mola-d-estat',
	descripcio: {
		ca: [
			"La Mola d'Estat és un cim de les Muntanyes de Prades, a [la Conca de Barberà](/comarques/conca-de-barbera), al límit entre els termes de Vimbodí i Poblet i de Prades, ja al Baix Camp. La Viquipèdia en descriu la roca com a gres i argila, parla dels seus cingles i recorda que el GR-171 passa pel cim. Dins les mateixes muntanyes hi ha el [Tossal de la Baltasana](/cims/tossal-de-la-baltasana) i la [Punta del Curull](/cims/punta-del-curull).",
			"La tradició local, recollida per la Viquipèdia, parla dels quatre batlles: quan s'havien de tallar pins, els batlles dels pobles veïns es reunien a la Taula dels Quatre Batlles, a uns 400 m al llarg de la carena, per acordar els límits de la tala, ja que alguns boscos eren compartits. A la vora de la roca hi ha tres creus metàl·liques, les Tres Creus. La Viquipèdia afegeix que el cim és a uns 2,7 km per pistes forestals del refugi dels Cogullons.",
			"Reptes Muntanyencs descriu la mola com un mirador sobre la vall de Capafons i de Farena, per l'oest i el sud, i sobre la vall de Poblet, per la banda nord. També diu que el camí que s'hi enfila va ser molt important i encara conserva restes del seu antic empedrat. La ressenya té trams sense camí, i el bloc no va saber trobar un pas que permetés desgrimpar pel cingle: no hi tallis camí.",
			"El recorregut s'enllaça amb diverses marques: el PR-20 (pintura groga i blanca), el GR-171 (blanca i vermella) i un sender local verd i blanc, mentre que un tram sense pintura es guia només amb algunes fites."
		],
		es: [
			"La Mola d'Estat es una cima de las Muntanyes de Prades, en [la Conca de Barberà](/comarques/conca-de-barbera), en el límite entre los términos de Vimbodí i Poblet y de Prades, ya en el Baix Camp. La Viquipèdia describe su roca como arenisca y arcilla, habla de sus riscos y recuerda que el GR-171 pasa por la cima. Dentro de las mismas montañas están el [Tossal de la Baltasana](/cims/tossal-de-la-baltasana) y la [Punta del Curull](/cims/punta-del-curull).",
			'La tradición local, recogida por la Viquipèdia, habla de los cuatro alcaldes: cuando se tenían que talar pinos, los alcaldes de los pueblos vecinos se reunían en la Taula dels Quatre Batlles, a unos 400 m a lo largo de la cresta, para acordar los límites de la tala, ya que algunos bosques eran compartidos. En el borde de la roca hay tres cruces metálicas, las Tres Creus. La Viquipèdia añade que la cima está a unos 2,7 km por pistas forestales del refugio de los Cogullons.',
			'Reptes Muntanyencs describe la mola como un mirador sobre el valle de Capafons y de Farena, por el oeste y el sur, y sobre el valle de Poblet, por el lado norte. También dice que el camino que sube fue muy importante y todavía conserva restos de su antiguo empedrado. La reseña tiene tramos sin camino, y el blog no supo encontrar un paso que permitiera destrepar el risco: no cortes camino por ahí.',
			'El recorrido se enlaza con varias marcas: el PR-20 (pintura amarilla y blanca), el GR-171 (blanca y roja) y un sendero local verde y blanco, mientras que un tramo sin pintura se guía solo con algunos hitos.'
		]
	},
	rutes: [
		{
			id: 'farena',
			nom: {
				ca: 'Circular des de Farena per la Roquerola',
				es: 'Circular desde Farena por la Roquerola'
			},
			sortida: { nom: 'Farena (Mont-ral)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Reptes Muntanyencs documenta una circular que surt de Farena: 13,9 km, uns 676 m de desnivell positiu i 3 h 51 min de marxa efectiva. Segons el seu track, la Mola d'Estat s'assoleix a 2 h 56 min i 8,3 km de la sortida, i la Mola de la Roquerola, a 3 h 39 min i 10 km. La progressió s'anota com «trams sense camí» i només alguns punts tenen marques de PR i GR; hi ha un sender sense pintura però amb algunes fites.",
				es: "Reptes Muntanyencs documenta una circular que sale de Farena: 13,9 km, unos 676 m de desnivel positivo y 3 h 51 min de marcha efectiva. Según su track, la Mola d'Estat se alcanza a 2 h 56 min y 8,3 km de la salida, y la Mola de la Roquerola, a 3 h 39 min y 10 km. La progresión se anota como «tramos sin camino» y solo algunos puntos tienen marcas de PR y GR; hay un sendero sin pintura pero con algunos hitos."
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'Segons el bloc, hi ha trams sense camí i un sender sense pintura que només té algunes fites: porta el track i un mapa.',
			"La circular continua fins a la Mola de la Roquerola, que és un segon cim del recorregut: no confonguis els temps de l'un i de l'altre.",
			'No intentis baixar pels cingles: el bloc no va trobar cap pas per desgrimpar.',
			'El GR-171 passa pel cim; pots fer-lo servir de referència.',
			"Telèfon d'emergències: 112."
		],
		es: [
			'Según el blog, hay tramos sin camino y un sendero sin pintura que solo tiene algunos hitos: lleva el track y un mapa.',
			'La circular continúa hasta la Mola de la Roquerola, que es una segunda cima del recorrido: no confundas los tiempos de una y otra.',
			'No intentes bajar por los riscos: el blog no encontró ningún paso para destrepar.',
			'El GR-171 pasa por la cima; puedes usarlo de referencia.',
			'Teléfono de emergencias: 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Quant es triga a pujar a la Mola d'Estat?",
				resposta:
					"Reptes Muntanyencs documenta una circular de 13,9 km des de Farena amb 3 h 51 min de marxa efectiva; segons el seu track, la Mola d'Estat queda a 2 h 56 min i 8,3 km de la sortida."
			},
			{
				pregunta: 'Per on passa el GR-171?',
				resposta: "La Viquipèdia indica que el GR-171 passa pel mateix cim de la Mola d'Estat."
			},
			{
				pregunta: 'Què són les Tres Creus?',
				resposta:
					'Tres creus metàl·liques fixades a la vora de la roca, segons la Viquipèdia, a prop de la Taula dels Quatre Batlles, on la tradició diu que es reunien els batlles.'
			},
			{
				pregunta: "La Mola d'Estat compta com a cim essencial?",
				resposta:
					'Sí, és un dels [cims essencials](/cims-essencials) de la Conca de Barberà, amb la [Punta del Curull](/cims/punta-del-curull).'
			}
		],
		es: [
			{
				pregunta: "¿Cuánto se tarda en subir a la Mola d'Estat?",
				resposta:
					"Reptes Muntanyencs documenta una circular de 13,9 km desde Farena con 3 h 51 min de marcha efectiva; según su track, la Mola d'Estat queda a 2 h 56 min y 8,3 km de la salida."
			},
			{
				pregunta: '¿Por dónde pasa el GR-171?',
				resposta: "La Viquipèdia indica que el GR-171 pasa por la propia cima de la Mola d'Estat."
			},
			{
				pregunta: '¿Qué son las Tres Creus?',
				resposta:
					'Tres cruces metálicas fijadas en el borde de la roca, según la Viquipèdia, cerca de la Taula dels Quatre Batlles, donde la tradición dice que se reunían los alcaldes.'
			},
			{
				pregunta: "¿La Mola d'Estat cuenta como cima esencial?",
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) de la Conca de Barberà, con la [Punta del Curull](/cims/punta-del-curull).'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
