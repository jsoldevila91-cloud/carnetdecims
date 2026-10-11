import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

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
			"La Mola d'Estat és un tossal de les Muntanyes de Prades, a [la Conca de Barberà](/comarques/conca-de-barbera) i al límit amb el Baix Camp: fa de partió entre els termes de Vimbodí i Poblet i de Prades. És una mola de cim pla i vores tallades en cingle, com tantes d'aquest massís, a la carena que tanca pel sud la vall de Poblet.",
			"El tret que la identifica són les Tres Creus, tres creus metàl·liques clavades a la roca arran del cingle. Seguint la carena cap a llevant, a uns 400 m, hi ha la Taula dels Quatre Batlles, on s'ajunten també els termes de Montblanc i de Mont-ral. La tradició explica que, quan calia fer una tallada de pins, els quatre batlles s'hi reunien per pactar-ne les condicions, perquè alguns boscos eren compartits. Una mica més enllà hi ha el vèrtex geodèsic i la mola dels Quatre Termes.",
			"Des de les creus es domina la vall del Brugent, amb Capafons i Farena, i bona part de les Muntanyes de Prades; pel costat nord s'obre la vall de Poblet. A la mateixa serralada hi ha el [Tossal de la Baltasana](/cims/tossal-de-la-baltasana) i, més a ponent, la [Punta del Curull](/cims/punta-del-curull).",
			'El GR 171 passa a tocar del cim i el refugi dels Cogullons queda a uns 2,7 km per pistes forestals, de manera que la mola es pot fer com a passeig llarg des de dalt o com a ascensió sencera des de Farena, al fons de la vall del Brugent.'
		],
		es: [
			"La Mola d'Estat es un cerro de las Muntanyes de Prades, en [la Conca de Barberà](/comarques/conca-de-barbera) y en el límite con el Baix Camp: hace de linde entre los términos de Vimbodí i Poblet y de Prades. Es una muela de cima llana y bordes cortados en risco, como tantas de este macizo, en la cresta que cierra por el sur el valle de Poblet.",
			'El rasgo que la identifica son las Tres Creus, tres cruces metálicas clavadas en la roca al borde del risco. Siguiendo la cresta hacia levante, a unos 400 m, está la Taula dels Quatre Batlles, donde se juntan también los términos de Montblanc y de Mont-ral. La tradición cuenta que, cuando había que hacer una tala de pinos, los cuatro alcaldes se reunían allí para pactar las condiciones, porque algunos bosques eran compartidos. Algo más allá están el vértice geodésico y la mola dels Quatre Termes.',
			'Desde las cruces se domina el valle del Brugent, con Capafons y Farena, y buena parte de las Muntanyes de Prades; por el lado norte se abre el valle de Poblet. En la misma sierra están el [Tossal de la Baltasana](/cims/tossal-de-la-baltasana) y, más a poniente, la [Punta del Curull](/cims/punta-del-curull).',
			'El GR 171 pasa junto a la cima y el refugio de los Cogullons queda a unos 2,7 km por pistas forestales, de modo que la mola se puede hacer como paseo largo desde arriba o como ascensión entera desde Farena, en el fondo del valle del Brugent.'
		]
	},
	rutes: [
		{
			id: 'farena',
			nom: {
				ca: 'Des de Farena pel refugi dels Cogullons',
				es: 'Desde Farena por el refugio de los Cogullons'
			},
			sortida: { nom: 'Farena (Mont-ral)' },
			descripcio: {
				ca: "La ressenya del bloc Reptes Muntanyencs (2012) surt de Farena pel PR-C 20, l'antic camí de la Bartra i els Cogullons, que encara conserva trossos d'empedrat. Passada la Bartra pren la pista de la Baridana i un camí senyalitzat que puja per la font Freda i la font del Grèvol fins al GR 171 i el refugi dels Cogullons (5,6 km). D'allà se segueix sempre el GR cap a ponent pel colletó d'en Serra, el clot del Llop, la mola dels Quatre Termes i la Taula dels Quatre Batlles fins a les Tres Creus: 8,3 km des de Farena i poc menys de tres hores amb les aturades. El bloc tancava una circular de 13,9 km i 676 m de desnivell positiu per la mola de la Roquerola, amb trams sense camí; tornar pel camí de pujada és més llarg, però no té pèrdua.",
				es: "La reseña del blog Reptes Muntanyencs (2012) sale de Farena por el PR-C 20, el antiguo camino de la Bartra y los Cogullons, que aún conserva trozos de empedrado. Pasada la Bartra toma la pista de la Baridana y un camino señalizado que sube por la font Freda y la font del Grèvol hasta el GR 171 y el refugio de los Cogullons (5,6 km). Desde allí se sigue siempre el GR hacia poniente por el colletó d'en Serra, el clot del Llop, la mola dels Quatre Termes y la Taula dels Quatre Batlles hasta las Tres Creus: 8,3 km desde Farena y algo menos de tres horas con las paradas. El blog cerraba una circular de 13,9 km y 676 m de desnivel positivo por la mola de la Roquerola, con tramos sin camino; volver por el camino de subida es más largo, pero no tiene pérdida."
			},
			fonts: [REPTES, VIQUIPEDIA]
		}
	],
	consells: {
		ca: [
			"Les creus són arran del cingle: no t'hi enfilis ni t'acostis a la vora per fer-te la foto.",
			'Si tanques la circular per la mola de la Roquerola, tingues present que el bloc hi va trobar camins del mapa que ja no existeixen i cap pas per baixar el cingle: no hi improvisis.',
			'Entre el coll de la Cova Fumada i el coll de Viladecabres el camí no té pintura, només algunes fites.',
			'No hi ha fonts segures al recorregut; les que surten al mapa poden no rajar.'
		],
		es: [
			'Las cruces están al borde del risco: no te subas a ellas ni te acerques al borde para hacerte la foto.',
			'Si cierras la circular por la mola de la Roquerola, ten presente que el blog encontró caminos del mapa que ya no existen y ningún paso para bajar el risco: no improvises.',
			'Entre el coll de la Cova Fumada y el coll de Viladecabres el camino no tiene pintura, solo algunos hitos.',
			'No hay fuentes seguras en el recorrido; las que salen en el mapa pueden no manar.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Quant es triga a pujar a la Mola d'Estat des de Farena?",
				resposta:
					'El bloc Reptes Muntanyencs hi va arribar en poc menys de tres hores, aturades incloses, després de 8,3 km pel PR-C 20 i el GR 171. Tota la seva circular, de 13,9 km, li va demanar 3 h 51 min de marxa.'
			},
			{
				pregunta: "Hi ha una manera més curta d'arribar-hi?",
				resposta:
					'El cim és a uns 2,7 km del refugi dels Cogullons per pistes forestals i pel GR 171, amb poc desnivell.'
			},
			{
				pregunta: 'Què són les Tres Creus?',
				resposta:
					'Tres creus metàl·liques clavades a la roca, a la vora del cingle, que identifiquen el cim. A uns 400 m hi ha la Taula dels Quatre Batlles, on la tradició diu que es reunien els batlles dels quatre termes.'
			},
			{
				pregunta: "La Mola d'Estat compta com a cim essencial?",
				resposta:
					'Sí. La llista la situa a la Conca de Barberà, on és un dels quatre [cims essencials](/cims-essencials), tot i que fa partió amb el Baix Camp.'
			}
		],
		es: [
			{
				pregunta: "¿Cuánto se tarda en subir a la Mola d'Estat desde Farena?",
				resposta:
					'El blog Reptes Muntanyencs llegó en algo menos de tres horas, paradas incluidas, tras 8,3 km por el PR-C 20 y el GR 171. Toda su circular, de 13,9 km, le pidió 3 h 51 min de marcha.'
			},
			{
				pregunta: '¿Hay una manera más corta de llegar?',
				resposta:
					'La cima está a unos 2,7 km del refugio de los Cogullons por pistas forestales y por el GR 171, con poco desnivel.'
			},
			{
				pregunta: '¿Qué son las Tres Creus?',
				resposta:
					'Tres cruces metálicas clavadas en la roca, al borde del risco, que identifican la cima. A unos 400 m está la Taula dels Quatre Batlles, donde la tradición dice que se reunían los alcaldes de los cuatro términos.'
			},
			{
				pregunta: "¿La Mola d'Estat cuenta como cima esencial?",
				resposta:
					'Sí. La lista la sitúa en la Conca de Barberà, donde es una de las cuatro [cimas esenciales](/cims-essencials), aunque hace de linde con el Baix Camp.'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
