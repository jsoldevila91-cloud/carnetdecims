import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puig de Sant Miquel (Rubió)',
	url: 'https://ca.wikipedia.org/wiki/Puig_de_Sant_Miquel_(Rubi%C3%B3)',
	consultat: CONSULTAT
};

const VIQUIPEDIA_ARDESA = {
	nom: "Viquipèdia: Sant Pere d'Ardesa",
	url: 'https://ca.wikipedia.org/wiki/Sant_Pere_d%27Ardesa',
	consultat: CONSULTAT
};

const ANOIA_TURISME = {
	nom: 'Anoia Turisme: Puig de Sant Miquel, el vèrtex de la serra de Rubió',
	url: 'https://anoiaturisme.cat/anoia/puig-de-sant-miquel-el-vertex-de-la-serra-de-rubio',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-de-sant-miquel',
	descripcio: {
		ca: [
			"El Puig de Sant Miquel és la muntanya del municipi de Rubió, a l'[Anoia](/comarques/anoia). La Viquipèdia la situa a la serra de les Maioles, i Anoia Turisme, a la serra de Rubió. A la comarca hi ha també [el Montgròs](/cims/montgros), a Montserrat, un cim essencial d'un caràcter molt diferent.",
			"La Viquipèdia explica que a la falda del puig hi ha l'església de Sant Pere d'Ardesa, que va estar molt degradada fins que va ser restaurada el 2009. El castell d'Ardesa, que presidia el terme, es dedueix que s'alçava entre el cim i l'església, i ha desaparegut. La Viquipèdia d'Ardesa data la primera menció del castell el 989 i situa la construcció de l'església als segles XI i XII; va ser consagrada el 1192.",
			"Al cim hi ha un vèrtex geodèsic i un pessebre, segons la Viquipèdia. Anoia Turisme el presenta com una sortida senzilla per un camí fàcil i còmode, sense gaire desnivell acumulat, que té com a punt de partida l'ermita de Sant Pere d'Ardesa, i diu que des del cim es pot contemplar la plana de l'Anoia.",
			"El tram final és més exigent que la resta: segons Anoia Turisme, un cop decideixes pujar al cim, cal enfilar-se per un camí més exigent que l'anterior. La Viquipèdia d'Ardesa afegeix que, des de la carretera BV-1037, un camí ben senyalitzat mena fins a l'església."
		],
		es: [
			'El Puig de Sant Miquel es la montaña del municipio de Rubió, en la [Anoia](/comarques/anoia). La Viquipèdia la sitúa en la sierra de les Maioles, y Anoia Turisme, en la sierra de Rubió. En la comarca está también [el Montgròs](/cims/montgros), en Montserrat, una cima esencial de un carácter muy distinto.',
			"La Viquipèdia explica que a los pies del puig está la iglesia de Sant Pere d'Ardesa, que estuvo muy degradada hasta que fue restaurada en 2009. El castillo de Ardesa, que presidía el término, se supone que se alzaba entre la cima y la iglesia, y ha desaparecido. La Viquipèdia de Ardesa data la primera mención del castillo en 989 y sitúa la construcción de la iglesia en los siglos XI y XII; fue consagrada en 1192.",
			"En la cima hay un vértice geodésico y un belén, según la Viquipèdia. Anoia Turisme lo presenta como una salida sencilla por un camino fácil y cómodo, sin mucho desnivel acumulado, que tiene como punto de partida la ermita de Sant Pere d'Ardesa, y dice que desde la cima se puede contemplar la llanura de la Anoia.",
			'El tramo final es más exigente que el resto: según Anoia Turisme, una vez decides subir a la cima, hay que encaramarse por un camino más exigente que el anterior. La Viquipèdia de Ardesa añade que, desde la carretera BV-1037, un camino bien señalizado lleva hasta la iglesia.'
		]
	},
	rutes: [
		{
			id: 'sant-pere-d-ardesa',
			nom: {
				ca: "Des de l'ermita de Sant Pere d'Ardesa",
				es: "Desde la ermita de Sant Pere d'Ardesa"
			},
			sortida: { nom: "Ermita de Sant Pere d'Ardesa (Rubió)" },
			descripcio: {
				ca: "Anoia Turisme proposa sortir de l'ermita de Sant Pere d'Ardesa, per un camí fàcil i còmode sense gaire desnivell acumulat. L'últim tram, fins al cim, és per un camí més exigent que l'anterior. La Viquipèdia recull que l'església s'hi arriba des de la BV-1037 per un camí ben senyalitzat.",
				es: "Anoia Turisme propone salir de la ermita de Sant Pere d'Ardesa, por un camino fácil y cómodo sin mucho desnivel acumulado. El último tramo, hasta la cima, es por un camino más exigente que el anterior. La Viquipèdia recoge que a la iglesia se llega desde la BV-1037 por un camino bien señalizado."
			},
			fonts: [ANOIA_TURISME, VIQUIPEDIA_ARDESA]
		}
	],
	consells: {
		ca: [
			"L'últim tram és més exigent que el camí d'aproximació, segons Anoia Turisme: no hi vagis amb presses ni amb sabatilles de passeig.",
			"Per anar a l'ermita, segueix el camí ben senyalitzat que surt de la carretera BV-1037.",
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'El último tramo es más exigente que el camino de aproximación, según Anoia Turisme: no vayas con prisas ni con zapatillas de paseo.',
			'Para ir a la ermita, sigue el camino bien señalizado que sale de la carretera BV-1037.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puig de Sant Miquel?',
				resposta:
					'Anoia Turisme el presenta com una sortida senzilla, per un camí fàcil, sense gaire desnivell acumulat, amb un darrer tram més exigent.'
			},
			{
				pregunta: 'Què hi ha al cim?',
				resposta:
					"Un vèrtex geodèsic i un pessebre, segons la Viquipèdia. A la falda hi ha Sant Pere d'Ardesa, restaurada el 2009."
			},
			{
				pregunta: 'Hi havia un castell?',
				resposta:
					"Sí: el castell d'Ardesa, que presidia el terme de Rubió i del qual la Viquipèdia suposa que s'alçava entre el cim i l'església. Avui ha desaparegut."
			},
			{
				pregunta: 'El Puig de Sant Miquel és un cim essencial?',
				resposta:
					"Sí. A l'[Anoia](/comarques/anoia) l'acompanya [el Montgròs](/cims/montgros), que és molt més exigent."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puig de Sant Miquel?',
				resposta:
					'Anoia Turisme lo presenta como una salida sencilla, por un camino fácil, sin mucho desnivel acumulado, con un último tramo más exigente.'
			},
			{
				pregunta: '¿Qué hay en la cima?',
				resposta:
					"Un vértice geodésico y un belén, según la Viquipèdia. En la falda está Sant Pere d'Ardesa, restaurada en 2009."
			},
			{
				pregunta: '¿Había un castillo?',
				resposta:
					'Sí: el castillo de Ardesa, que presidía el término de Rubió y del que la Viquipèdia supone que se alzaba entre la cima y la iglesia. Hoy ha desaparecido.'
			},
			{
				pregunta: '¿El Puig de Sant Miquel es una cima esencial?',
				resposta:
					'Sí. En la [Anoia](/comarques/anoia) lo acompaña [el Montgròs](/cims/montgros), que es mucho más exigente.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_ARDESA, ANOIA_TURISME],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
