import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Tossal de Mirapallars i Urgell',
	url: 'https://ca.wikipedia.org/wiki/Tossal_de_Mirapallars_i_Urgell',
	consultat: CONSULTAT
};

const VIQUIPEDIA_MONTSEC = {
	nom: 'Viquipèdia: Montsec de Rúbies',
	url: 'https://ca.wikipedia.org/wiki/Montsec_de_R%C3%BAbies',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Tossal de Mirapallars i Urgell',
	url: 'https://reptesmuntanyencs.cat/tossal-de-mirapallars-i-urgell/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tossal-de-mirapallars',
	descripcio: {
		ca: [
			"El Tossal de Mirapallars i Urgell, o simplement Tossal de Mirapallars, és un cim del Montsec de Rúbies, a [la Noguera](/comarques/noguera), al límit entre el terme de Vilanova de Meià i els de Gavet de la Conca i Llimiana, ja al Pallars Jussà. Segons la Viquipèdia, la roca és calcària, calcarenita i gres. El Montsec de Rúbies és el sector oriental de la serra del Montsec: fa uns 13,5 km de llarg per 5 d'ample i separa la Conca de Tremp de la conca de Meià.",
			"La mateixa Viquipèdia apunta que, des del cim, una línia de cingles s'allarga cap a l'oest fins al Tossal de les Torretes, el punt culminant del massís, amb vèrtex geodèsic. El GR 1 travessa el massís, i la ressenya que fem servir aprofita aquest sender i les pistes que hi connecten. El nom de Montsec de Rúbies serveix per distingir-lo del Montsec d'Ares, on s'alça la [Penya Sant Alís](/cims/penya-sant-alis); abans de la Guerra Civil, segons el bloc Reptes Muntanyencs, el massís es deia Montsec de Meià.",
			"El mateix bloc explica que la muntanya és plena de trinxeres construïdes durant la Guerra Civil. En la ressenya, feta l'agost del 2013, l'autor considera fàcils la pujada i la carena, i més aventurera la baixada, que fa fora de camí per un traçat de roca. També proposa una baixada alternativa pel pas de les Eugues i la pista de la Coma Gran, on diu que no hi ha camí clar en alguns punts.",
			'Com que la ressenya és de fa uns quants anys, convé contrastar-la amb un mapa recent abans de sortir. Si el dia es complica, la carena no té on aixoplugar-se: baixa abans que la tempesta et pesqui, i amb boira no improvisis la baixada fora de camí.'
		],
		es: [
			'El Tossal de Mirapallars i Urgell, o simplemente Tossal de Mirapallars, es una cima del Montsec de Rúbies, en [la Noguera](/comarques/noguera), en el límite entre el término de Vilanova de Meià y los de Gavet de la Conca y Llimiana, ya en el Pallars Jussà. Según la Viquipèdia, la roca es caliza, calcarenita y arenisca. El Montsec de Rúbies es el sector oriental de la sierra del Montsec: mide unos 13,5 km de largo por 5 de ancho y separa la Conca de Tremp de la cuenca de Meià.',
			"La misma Viquipèdia apunta que, desde la cima, una línea de riscos se alarga hacia el oeste hasta el Tossal de les Torretes, el punto culminante del macizo, con vértice geodésico. El GR 1 atraviesa el macizo, y la reseña que usamos aprovecha este sendero y las pistas que conectan con él. El nombre de Montsec de Rúbies sirve para distinguirlo del Montsec d'Ares, donde se alza la [Penya Sant Alís](/cims/penya-sant-alis); antes de la Guerra Civil, según el blog Reptes Muntanyencs, el macizo se llamaba Montsec de Meià.",
			'El mismo blog explica que la montaña está llena de trincheras construidas durante la Guerra Civil. En su reseña, hecha en agosto de 2013, el autor considera fáciles la subida y la cresta, y más aventurera la bajada, que hace fuera de camino por un trazado de roca. También propone una bajada alternativa por el pas de les Eugues y la pista de la Coma Gran, donde dice que no hay camino claro en algunos puntos.',
			'Como la reseña tiene ya unos años, conviene contrastarla con un mapa reciente antes de salir. Si el día se complica, la cresta no tiene dónde resguardarse: baja antes de que te pille la tormenta, y con niebla no improvises la bajada fuera de camino.'
		]
	},
	rutes: [
		{
			id: 'hostal-roig',
			nom: {
				ca: "Circular des de l'Hostal Roig per les Torretes",
				es: 'Circular desde el Hostal Roig por las Torretes'
			},
			sortida: { nom: 'Hostal Roig' },
			descripcio: {
				ca: "La ressenya de Reptes Muntanyencs, del 2013, és una circular de 15,7 km, uns 729 m de desnivell positiu i unes 4 h de marxa, que surt de l'Hostal Roig, accessible per carretera asfaltada. Puja per pistes seguint el GR 1 cap a la Portella Blanca i després per la carena. Segons el seu track, passa pel Tossal de les Torretes a 2 h 03 min de la sortida i arriba al Tossal de Mirapallars, que és l'objectiu principal, a 2 h 33 min. Després continua per la carena fins al puig del Camí Ramader i les Pales del Bosc, i la baixada és fora de camí fins a una pista. Les 2 h 33 min són, doncs, fins al Mirapallars, ja passades les Torretes.",
				es: 'La reseña de Reptes Muntanyencs, de 2013, es una circular de 15,7 km, unos 729 m de desnivel positivo y unas 4 h de marcha, que sale del Hostal Roig, accesible por carretera asfaltada. Sube por pistas siguiendo el GR 1 hacia la Portella Blanca y luego por la cresta. Según su track, pasa por el Tossal de les Torretes a 2 h 03 min de la salida y llega al Tossal de Mirapallars, que es el objetivo principal, a 2 h 33 min. Después continúa por la cresta hasta el puig del Camí Ramader y las Pales del Bosc, y la bajada es fuera de camino hasta una pista. Las 2 h 33 min son, pues, hasta el Mirapallars, ya pasadas las Torretes.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'La ressenya de referència és del 2013. Contrasta-la amb un mapa actual i amb un track recent abans de sortir.',
			'El bloc considera la pujada i la carena fàcils, però la baixada és fora de camí i per terreny de roca; no la facis amb boira.',
			'El circuit passa primer pel Tossal de les Torretes i després pel Mirapallars: calcula les hores en aquest ordre.',
			'El bloc segueix el GR 1 per pistes a la pujada; a la baixada alternativa pel pas de les Eugues, segons ell, el camí no és clar en alguns punts.',
			"Telèfon d'emergències: 112."
		],
		es: [
			'La reseña de referencia es de 2013. Contrástala con un mapa actual y con un track reciente antes de salir.',
			'El blog considera la subida y la cresta fáciles, pero la bajada es fuera de camino y por terreno de roca; no la hagas con niebla.',
			'El circuito pasa primero por el Tossal de les Torretes y luego por el Mirapallars: calcula las horas en ese orden.',
			'El blog sigue el GR 1 por pistas en la subida; en la bajada alternativa por el pas de les Eugues, según él, el camino no es claro en algunos puntos.',
			'Teléfono de emergencias: 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Tossal de Mirapallars?',
				resposta:
					"El bloc Reptes Muntanyencs, en una circular de 15,7 km des de l'Hostal Roig, hi arriba a 2 h 33 min de la sortida, després de passar pel Tossal de les Torretes a 2 h 03 min."
			},
			{
				pregunta: 'És un cim difícil?',
				resposta:
					'El bloc en descriu la pujada i la carena com a fàcils, però la baixada que proposa és fora de camí per terreny de roca. Les pistes se segueixen amb el GR 1.'
			},
			{
				pregunta: 'Per què es diu Montsec de Rúbies?',
				resposta:
					"La Viquipèdia explica que el nom Montsec de Rúbies serveix per distingir-lo del Montsec d'Ares; antigament es deia Montsec de Meià."
			},
			{
				pregunta: 'El Tossal de Mirapallars compta com a cim essencial?',
				resposta:
					'Sí, és un dels quatre [cims essencials](/cims-essencials) de la Noguera, amb la [Pala Alta](/cims/pala-alta), la Penya Sant Alís i Sant Mamet.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Tossal de Mirapallars?',
				resposta:
					'El blog Reptes Muntanyencs, en una circular de 15,7 km desde el Hostal Roig, llega a las 2 h 33 min de la salida, después de pasar por el Tossal de les Torretes a las 2 h 03 min.'
			},
			{
				pregunta: '¿Es una cima difícil?',
				resposta:
					'El blog describe la subida y la cresta como fáciles, pero la bajada que propone es fuera de camino por terreno de roca. Las pistas se siguen con el GR 1.'
			},
			{
				pregunta: '¿Por qué se llama Montsec de Rúbies?',
				resposta:
					"La Viquipèdia explica que el nombre Montsec de Rúbies sirve para distinguirlo del Montsec d'Ares; antiguamente se llamaba Montsec de Meià."
			},
			{
				pregunta: '¿El Tossal de Mirapallars cuenta como cima esencial?',
				resposta:
					'Sí, es una de las cuatro [cimas esenciales](/cims-essencials) de la Noguera, con la [Pala Alta](/cims/pala-alta), la Penya Sant Alís y Sant Mamet.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_MONTSEC, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
