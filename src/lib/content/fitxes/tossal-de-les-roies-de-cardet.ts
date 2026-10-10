import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Tossal de les Roies de Cardet',
	url: 'https://ca.wikipedia.org/wiki/Tossal_de_les_Roies_de_Cardet',
	consultat: CONSULTAT
};

const VALLBOI = {
	nom: 'Vall de Boí: Cara Amón, ruta de curses de muntanya a les Roies de Cardet',
	url: 'https://vallboi.cat/en/node/608',
	consultat: CONSULTAT
};

const ROMANICA = {
	nom: 'Catalunya Romànica: Sant Salvador de Barruera',
	url: 'https://www.enciclopedia.cat/catalunya-romanica/sant-salvador-de-barruera-la-vall-de-boi',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tossal-de-les-roies-de-cardet',
	descripcio: {
		ca: [
			"El Tossal de les Roies de Cardet és un cim modest en una zona de grans muntanyes: 2.445 m entre els termes de la Vall de Boí i de Vilaller, a [l'Alta Ribagorça](/comarques/alta-ribagorca). La Viquipèdia en dona una prominència de només 55 m i un aïllament de 324 m, i diu que la roca predominant és la quarsita. Al cim hi ha un vèrtex geodèsic.",
			"La Vall de Boí publica la ruta Cara Amón, pensada per a curses de muntanya, que surt de Barruera, a 1.090 m, i arriba al cim en 4,4 km amb 1.360 m de desnivell: un pendent mitjà de l'ordre del 30 %. La fitxa la qualifica d'avançada i avisa que és una ruta d'alta muntanya, molt exigent físicament i tècnicament, que no s'ha de fer a l'hivern ni amb mal temps.",
			"El camí passa pel costat de les ruïnes de l'ermita de Sant Salvador. Catalunya Romànica situa aquest edifici en un lloc elevat entre la serra de Cardet i la Punta lo Faro, a la riba dreta de la Noguera de Tor, al nord-oest de Barruera, i explica que avui en queden poques restes; per l'aparell, semblant al de Sant Quirc de Taüll, en proposa una datació de finals del segle XII o posterior. La mateixa font hi calcula una hora i mitja a peu des de Barruera.",
			"Tot i que no arriba als 2.500 m, és una pujada d'alta muntanya per l'esforç que exigeix. Tria un dia estable de finals de primavera a la tardor i comença d'hora: amb pluja o boira, el tram rocós final és un risc innecessari."
		],
		es: [
			'El Tossal de les Roies de Cardet es una cima modesta en una zona de grandes montañas: 2.445 m entre los términos de la Vall de Boí y de Vilaller, en la [Alta Ribagorça](/comarques/alta-ribagorca). La Viquipèdia le da una prominencia de solo 55 m y un aislamiento de 324 m, y dice que la roca predominante es la cuarcita. En la cima hay un vértice geodésico.',
			'La Vall de Boí publica la ruta Cara Amón, pensada para carreras de montaña, que sale de Barruera, a 1.090 m, y llega a la cima en 4,4 km con 1.360 m de desnivel: una pendiente media del orden del 30 %. La ficha la califica de avanzada y avisa de que es una ruta de alta montaña, muy exigente física y técnicamente, que no se debe hacer en invierno ni con mal tiempo.',
			'El camino pasa junto a las ruinas de la ermita de Sant Salvador. Catalunya Romànica sitúa este edificio en un lugar elevado entre la sierra de Cardet y la Punta lo Faro, en la margen derecha de la Noguera de Tor, al noroeste de Barruera, y explica que hoy quedan pocos restos; por el aparejo, parecido al de Sant Quirc de Taüll, propone una datación de finales del siglo XII o posterior. La misma fuente calcula una hora y media a pie desde Barruera.',
			'Aunque no llega a los 2.500 m, es una subida de alta montaña por el esfuerzo que exige. Elige un día estable de finales de primavera al otoño y empieza temprano: con lluvia o niebla, el tramo rocoso final es un riesgo innecesario.'
		]
	},
	rutes: [
		{
			id: 'barruera',
			nom: {
				ca: 'Cara Amón des de Barruera per Sant Salvador',
				es: 'Cara Amón desde Barruera por Sant Salvador'
			},
			sortida: { nom: 'Barruera, vora el càmping Boneta (Vall de Boí, 1.090 m)' },
			desnivellPositiuM: 1360,
			distanciaKm: 4.4,
			descripcio: {
				ca: "Segons la fitxa de la Vall de Boí, la ruta comença al costat del càmping Boneta, travessa el carrer Major de Barruera i enfila un corriol molt dret que s'uneix a la pista forestal que puja cap a l'ermita romànica de Sant Salvador. Prop de l'ermita, a uns 1.575 m, deixa la pista i puja directament pel canar, vorejant la carena, fins a un tram final de terreny rocós que porta al cim. La baixada es fa pel mateix camí. La fitxa avisa que és una ruta d'alta muntanya, molt exigent, i que no s'ha de fer a l'hivern ni amb mal temps.",
				es: 'Según la ficha de la Vall de Boí, la ruta empieza junto al camping Boneta, cruza la calle Mayor de Barruera y remonta un sendero muy empinado que enlaza con la pista forestal que sube hacia la ermita románica de Sant Salvador. Cerca de la ermita, a unos 1.575 m, deja la pista y sube directamente por el canar, bordeando la cresta, hasta un tramo final de terreno rocoso que lleva a la cima. La bajada se hace por el mismo camino. La ficha avisa de que es una ruta de alta montaña, muy exigente, y de que no se debe hacer en invierno ni con mal tiempo.'
			},
			fonts: [VALLBOI, ROMANICA]
		}
	],
	consells: {
		ca: [
			"No hi vagis a l'hivern ni amb previsió dubtosa: la fitxa de la Vall de Boí ho desaconsella explícitament.",
			"Pujar 1.360 m en 4,4 km és un esforç continu i dret: dosifica't des de baix i reserva forces per al tram rocós final.",
			"La ruta puja i baixa pel mateix camí: planifica l'hora de tornada per baixar amb llum i sense pressa pel corriol dret.",
			'Porta bastons i botes amb bona subjecció per al tram de roques final; el track GPX es pot descarregar de la fitxa de la Vall de Boí.',
			'Si vols veure les ruïnes de Sant Salvador sense fer el cim, Catalunya Romànica calcula una hora i mitja a peu des de Barruera.'
		],
		es: [
			'No vayas en invierno ni con previsión dudosa: la ficha de la Vall de Boí lo desaconseja explícitamente.',
			'Subir 1.360 m en 4,4 km es un esfuerzo continuo y empinado: dosifícate desde abajo y reserva fuerzas para el tramo rocoso final.',
			'La ruta sube y baja por el mismo camino: planifica la hora de vuelta para bajar con luz y sin prisa por el sendero empinado.',
			'Lleva bastones y botas con buen agarre para el tramo de rocas final; el track GPX se puede descargar de la ficha de la Vall de Boí.',
			'Si quieres ver las ruinas de Sant Salvador sin hacer la cima, Catalunya Romànica calcula una hora y media a pie desde Barruera.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant desnivell té el Tossal de les Roies de Cardet?',
				resposta:
					'La ruta Cara Amón de la Vall de Boí dona 1.360 m de desnivell en 4,4 km, des de Barruera (1.090 m) fins al cim. És una pujada molt dreta: calcula el temps segons el teu ritme en desnivells forts i la baixada pel mateix camí.'
			},
			{
				pregunta: 'És una ruta fàcil per ser un cim de 2.445 m?',
				resposta:
					"No. La Vall de Boí la classifica com a ruta avançada i avisa que és d'alta muntanya, molt exigent físicament i tècnicament, i que no s'ha de fer a l'hivern ni amb mal temps."
			},
			{
				pregunta: 'Hi ha alguna cosa a veure pel camí?',
				resposta:
					"Sí: les ruïnes de l'ermita de Sant Salvador de Barruera, d'època romànica, que Catalunya Romànica data de finals del segle XII o posterior. L'edifici és molt enrunat i només en queden restes minses."
			},
			{
				pregunta: 'El Tossal de les Roies de Cardet compta com a cim essencial?',
				resposta:
					"Sí, és un dels sis [cims essencials](/cims-essencials) de l'Alta Ribagorça. Amb 2.445 m és el segon més baix, per sobre només de la [Pala del Teller](/cims/pala-del-teller), i el [Corronco](/cims/el-corronco) és uns 100 m més alt."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto desnivel tiene el Tossal de les Roies de Cardet?',
				resposta:
					'La ruta Cara Amón de la Vall de Boí da 1.360 m de desnivel en 4,4 km, desde Barruera (1.090 m) hasta la cima. Es una subida muy empinada: calcula el tiempo según tu ritmo en desniveles fuertes y la bajada por el mismo camino.'
			},
			{
				pregunta: '¿Es una ruta fácil para ser una cima de 2.445 m?',
				resposta:
					'No. La Vall de Boí la clasifica como ruta avanzada y avisa de que es de alta montaña, muy exigente física y técnicamente, y de que no se debe hacer en invierno ni con mal tiempo.'
			},
			{
				pregunta: '¿Hay algo que ver por el camino?',
				resposta:
					'Sí: las ruinas de la ermita de Sant Salvador de Barruera, de época románica, que Catalunya Romànica data de finales del siglo XII o posterior. El edificio está muy hundido y solo quedan restos mínimos.'
			},
			{
				pregunta: '¿El Tossal de les Roies de Cardet cuenta como cima esencial?',
				resposta:
					'Sí, es una de las seis [cimas esenciales](/cims-essencials) de la Alta Ribagorça. Con 2.445 m es el segundo más bajo, por encima solo de la [Pala del Teller](/cims/pala-del-teller), y el [Corronco](/cims/el-corronco) es unos 100 m más alto.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VALLBOI, ROMANICA],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
