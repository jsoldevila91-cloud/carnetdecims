import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const RUTES_PIRINEUS = {
	nom: "Rutes Pirineus: l'ermita de Santa Fe d'Organyà",
	url: 'https://www.rutespirineus.cat/rutes/ermita-de-santa-fe-organya-urgell',
	consultat: CONSULTAT
};

const CAMINA_PIRINEUS = {
	nom: 'Camina Pirineus: OR1 Santa Fe',
	url: 'https://www.caminapirineus.com/ca/xarxa-de-senders/itineraris-a-la-carta/@@route/or1-santa-fe',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: "Totnens: muntanya de Santa Fe d'Organyà",
	url: 'https://totnens.cat/que-fem/muntanya-de-santa-fe-dorganya/',
	consultat: CONSULTAT
};

const AJUNTAMENT = {
	nom: "Ajuntament d'Organyà: ruta de Santa Fe (circular)",
	url: 'https://www.organya.cat/el-municipi/turisme/turisme/rutes/ruta-de-santa-fe-1',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'santa-fe',
	descripcio: {
		ca: [
			"La muntanya de Santa Fe s'alça just a sobre d'Organyà, [a l'Alt Urgell](/comarques/alt-urgell), i domina aquest tram de la vall del Segre. És una serra prepirinenca de calcària, amb cingles i parets a la cara que mira al poble, i boscos de pi i matollar de romaní als vessants. A dalt de tot, enfilada sobre un esperó de roca, hi ha l'ermita de Santa Fe, que dona nom al cim.",
			"El poble que té als peus és conegut perquè a la rectoria s'hi van trobar, el 1904, les Homilies d'Organyà, un dels textos més antics escrits en català (l'original es conserva a la Biblioteca de Catalunya). La muntanya també té lligam amb Jacint Verdaguer: segons Rutes Pirineus, el poeta va pujar a l'ermita el 1883 i en va deixar constància al seu dietari d'excursions, i al coll Marí hi ha una escultura que ho recorda. A l'ermita es manté el costum de tocar la campana tres vegades.",
			"Des de l'ermita es veu bona part de la vall del Segre i de les serres prepirinenques que l'envolten. A les parets calcàries de sota el cim és habitual veure-hi voltors planant. A la mateixa comarca, el [Cogulló de Turp](/cims/cogullo-de-turp) és un altre cim prepirinenc del repte.",
			"Com que no arriba als 1.300 m, es pot pujar tot l'any. A l'estiu el vessant que mira a Organyà és molt assolellat i calorós: surt a primera hora o tria un dia fresc. A l'hivern, en canvi, és una bona alternativa quan els cims alts del Pirineu estan nevats."
		],
		es: [
			'La montaña de Santa Fe se alza justo encima de Organyà, [en el Alt Urgell](/comarques/alt-urgell), y domina este tramo del valle del Segre. Es una sierra prepirenaica de caliza, con riscos y paredes en la cara que mira al pueblo, y bosques de pino y matorral de romero en las laderas. Arriba del todo, encaramada sobre un espolón de roca, está la ermita de Santa Fe, que da nombre a la cima.',
			"El pueblo que tiene a sus pies es conocido porque en la rectoría se encontraron, en 1904, las Homilies d'Organyà, uno de los textos más antiguos escritos en catalán (el original se conserva en la Biblioteca de Catalunya). La montaña también tiene relación con Jacint Verdaguer: según Rutes Pirineus, el poeta subió a la ermita en 1883 y lo dejó escrito en su diario de excursiones, y en el coll Marí hay una escultura que lo recuerda. En la ermita se mantiene la costumbre de tocar la campana tres veces.",
			'Desde la ermita se ve buena parte del valle del Segre y de las sierras prepirenaicas que lo rodean. En las paredes calizas bajo la cima es habitual ver buitres planeando. En la misma comarca, el [Cogulló de Turp](/cims/cogullo-de-turp) es otra cima prepirenaica del reto.',
			'Como no llega a los 1.300 m, se puede subir todo el año. En verano la ladera que mira a Organyà es muy soleada y calurosa: sal a primera hora o elige un día fresco. En invierno, en cambio, es una buena alternativa cuando las cimas altas del Pirineo están nevadas.'
		]
	},
	rutes: [
		{
			id: 'organya-coll-mari',
			nom: {
				ca: "Des d'Organyà pel coll Marí",
				es: 'Desde Organyà por el coll Marí'
			},
			sortida: { nom: 'Plaça de les Homilies (Organyà, 558 m)' },
			desnivellPositiuM: 640,
			distanciaKm: 4.2,
			tempsMinuts: 90,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "És la pujada clàssica des del poble. Es passa pel molí i el mas de la Borda i es puja per un corriol dins la pineda, que creua diverses vegades l'antic camí de carro, fins al coll Marí i el monument a Verdaguer. Després es continua pel collet de Prats fins a l'ermita. Rutes Pirineus hi calcula 1 h 30 min de pujada i avisa que, passat el coll Marí, el camí ressegueix la cinglera amb algun tram una mica aeri, sense dificultat tècnica; el que pesa és el desnivell.",
				es: 'Es la subida clásica desde el pueblo. Se pasa junto al molino y el mas de la Borda y se sube por un sendero dentro del pinar, que cruza varias veces el antiguo camino de carro, hasta el coll Marí y el monumento a Verdaguer. Después se sigue por el collet de Prats hasta la ermita. Rutes Pirineus calcula 1 h 30 min de subida y avisa de que, pasado el coll Marí, el camino sigue el risco con algún tramo algo aéreo, sin dificultad técnica; lo que pesa es el desnivel.'
			},
			fonts: [RUTES_PIRINEUS, CAMINA_PIRINEUS]
		},
		{
			id: 'cal-fenollet',
			nom: {
				ca: 'Des de Cal Fenollet pel grau de Fenollet (amb nens)',
				es: 'Desde Cal Fenollet por el grau de Fenollet (con niños)'
			},
			sortida: { nom: "Dipòsit d'aigua de Cal Fenollet (Organyà)" },
			desnivellPositiuM: 380,
			distanciaKm: 3.6,
			tempsMinuts: 100,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Totnens proposa aquesta variant per fer amb mainada a partir de 4 anys: comença més amunt, a prop del dipòsit d'aigua de Cal Fenollet, i estalvia gran part del desnivell. Combina sender i pista, amb algun tram de rocam com el grau de Fenollet i el pas del Corretjor, on hi ha una tanca per al bestiar. Són uns 3,6 km i 1 h 40 min d'anada, i la tornada es fa pel mateix camí.",
				es: 'Totnens propone esta variante para ir con niños a partir de 4 años: empieza más arriba, cerca del depósito de agua de Cal Fenollet, y ahorra buena parte del desnivel. Combina sendero y pista, con algún tramo de roca como el grau de Fenollet y el pas del Corretjor, donde hay una valla para el ganado. Son unos 3,6 km y 1 h 40 min de ida, y la vuelta se hace por el mismo camino.'
			},
			fonts: [TOTNENS]
		}
	],
	consells: {
		ca: [
			"A prop del dipòsit de Cal Fenollet hi ha poc lloc per aparcar: arriba-hi d'hora, sobretot els caps de setmana.",
			"Si vols fer una volta més llarga, l'Ajuntament d'Organyà proposa una ruta circular que passa pel grau de Fenollet i la font Bordonera.",
			"A l'estiu porta prou aigua i protecció solar: el camí des del poble va per un vessant molt exposat al sol.",
			"Al tram final, amb nens, vigila els trossos de roca i els cingles que hi ha sota l'ermita."
		],
		es: [
			'Cerca del depósito de Cal Fenollet hay poco sitio para aparcar: llega temprano, sobre todo los fines de semana.',
			'Si quieres hacer una vuelta más larga, el Ayuntamiento de Organyà propone una ruta circular que pasa por el grau de Fenollet y la font Bordonera.',
			'En verano lleva agua suficiente y protección solar: el camino desde el pueblo va por una ladera muy expuesta al sol.',
			'En el tramo final, con niños, vigila los tramos de roca y los riscos que hay bajo la ermita.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Quant es triga a pujar a Santa Fe des d'Organyà?",
				resposta:
					"Des de la plaça d'Organyà, 1 h 30 min de pujada i una hora de baixada segons Rutes Pirineus; Camina Pirineus hi dona 4,2 km i 640 m de desnivell fins a l'ermita. Des de Cal Fenollet, Totnens hi compta 1 h 40 min d'anada a ritme de família."
			},
			{
				pregunta: "Es pot pujar a Santa Fe d'Organyà amb nens?",
				resposta:
					'Sí. La ruta des del dipòsit de Cal Fenollet té uns 380 m de desnivell i Totnens la recomana per a infants a partir de 4 anys. Té algun tram de rocam, així que convé anar-hi amb calçat de muntanya.'
			},
			{
				pregunta: 'Què té a veure Verdaguer amb Santa Fe?',
				resposta:
					"Jacint Verdaguer hi va pujar el 1883 i ho va anotar al seu dietari. Per això al coll Marí, al camí que puja des d'Organyà, hi ha una escultura dedicada al poeta."
			},
			{
				pregunta: 'Santa Fe compta com a cim essencial?',
				resposta:
					"Sí. L'Alt Urgell té nou [cims essencials](/cims-essencials), i Santa Fe és un dels dos que no arriben als 1.300 m, amb Sant Honorat: és el que pots fer quan els de la capçalera, com el [Monturull](/cims/monturull), estan nevats."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Santa Fe desde Organyà?',
				resposta:
					'Desde la plaza de Organyà, 1 h 30 min de subida y una hora de bajada según Rutes Pirineus; Camina Pirineus da 4,2 km y 640 m de desnivel hasta la ermita. Desde Cal Fenollet, Totnens calcula 1 h 40 min de ida a ritmo de familia.'
			},
			{
				pregunta: '¿Se puede subir a Santa Fe de Organyà con niños?',
				resposta:
					'Sí. La ruta desde el depósito de Cal Fenollet tiene unos 380 m de desnivel y Totnens la recomienda para niños a partir de 4 años. Tiene algún tramo de roca, así que conviene ir con calzado de montaña.'
			},
			{
				pregunta: '¿Qué tiene que ver Verdaguer con Santa Fe?',
				resposta:
					'Jacint Verdaguer subió en 1883 y lo anotó en su diario. Por eso en el coll Marí, en el camino que sube desde Organyà, hay una escultura dedicada al poeta.'
			},
			{
				pregunta: '¿Santa Fe cuenta como cima esencial?',
				resposta:
					'Sí. El Alt Urgell tiene nueve [cimas esenciales](/cims-essencials), y Santa Fe es una de las dos que no llegan a los 1.300 m, con Sant Honorat: es la que puedes hacer cuando las de cabecera, como el [Monturull](/cims/monturull), están nevadas.'
			}
		]
	},
	fonts: [RUTES_PIRINEUS, CAMINA_PIRINEUS, TOTNENS, AJUNTAMENT],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
