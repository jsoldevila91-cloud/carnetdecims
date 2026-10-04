import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: "Viquipèdia: la Tosa d'Alp",
	url: 'https://ca.wikipedia.org/wiki/Tosa_d%27Alp',
	consultat: CONSULTAT
};

const XIRUCA = {
	nom: "Xiruca: ascens a la Tosa d'Alp des del coll de Pal",
	url: 'https://www.xiruca.com/rutas/ascenso-tosa-dalp-coll-pal',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: "Rutes Pirineus: la Tosa d'Alp des d'Urús",
	url: 'https://www.rutespirineus.cat/rutes/tosa-alp-des-de-urus-cerdanya',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'la-tosa',
	descripcio: {
		ca: [
			"La Tosa, més coneguda com a Tosa d'Alp, és el cim que tanca per l'est la serra del Moixeró, dins del Parc Natural del Cadí-Moixeró. Al cim s'hi troben quatre termes municipals, Alp, Urús, Das i Bagà, i és el punt de trobada entre la Cerdanya i [el Berguedà](/comarques/bergueda). És de roca calcària i té formes arrodonides, molt diferents de les parets del Cadí que té a ponent.",
			"És una muntanya molt humanitzada. Al vessant nord hi ha les pistes de Masella i al vessant est el sector de la Tosa de la Molina, i al cim mateix s'alça el refugi del Niu de l'Àliga, al qual s'arriba amb telecabina des de la Molina. També hi ha un vèrtex geodèsic, una estació meteorològica automàtica que funciona des del 2014 i, a prop, antigues instal·lacions de telecomunicacions. Tot i això, a peu continua sent una ascensió de muntanya: pel coll de Pal hi passa un GR i pel vessant d'Urús hi puja l'antic camí ral del coll de Jou.",
			"La vista és un dels seus grans atractius. Cap al nord s'obre tota la plana de la Cerdanya, i Rutes Pirineus cita el Pedraforca, el Monturull o el Carlit entre els cims que es veuen en dies clars. Cap a ponent continua la carena del Moixeró, amb les [Penyes Altes](/cims/penyes-altes), un altre cim essencial de la mateixa serra.",
			"Es pot pujar tot l'any, però amb neu la ruta canvia: calen raquetes o grampons i saber valorar el perill d'allaus. A l'estiu, la carena és molt exposada a les tempestes de tarda i al vent: comença d'hora i porta roba d'abric."
		],
		es: [
			"La Tosa, más conocida como Tosa d'Alp, es la cima que cierra por el este la sierra del Moixeró, dentro del Parque Natural del Cadí-Moixeró. En la cima se encuentran cuatro términos municipales, Alp, Urús, Das y Bagà, y es el punto de encuentro entre la Cerdanya y [el Berguedà](/comarques/bergueda). Es de roca caliza y tiene formas redondeadas, muy distintas de las paredes del Cadí que tiene al oeste.",
			"Es una montaña muy humanizada. En la vertiente norte están las pistas de Masella y en la vertiente este el sector de la Tosa de La Molina, y en la misma cima se alza el refugio del Niu de l'Àliga, al que se llega en telecabina desde La Molina. También hay un vértice geodésico, una estación meteorológica automática que funciona desde 2014 y, cerca, antiguas instalaciones de telecomunicaciones. Aun así, a pie sigue siendo una ascensión de montaña: por el coll de Pal pasa un GR y por la vertiente de Urús sube el antiguo camino real del coll de Jou.",
			'La vista es uno de sus grandes atractivos. Hacia el norte se abre toda la llanura de la Cerdanya, y Rutes Pirineus cita el Pedraforca, el Monturull o el Carlit entre las cimas que se ven en días claros. Hacia el oeste sigue la cresta del Moixeró, con las [Penyes Altes](/cims/penyes-altes), otra cima esencial de la misma sierra.',
			'Se puede subir todo el año, pero con nieve la ruta cambia: hacen falta raquetas o crampones y saber valorar el peligro de aludes. En verano, la cresta está muy expuesta a las tormentas de tarde y al viento: empieza temprano y lleva ropa de abrigo.'
		]
	},
	rutes: [
		{
			id: 'coll-de-pal',
			nom: {
				ca: 'Des del coll de Pal per la collada de Comabella',
				es: 'Desde el coll de Pal por la collada de Comabella'
			},
			sortida: { nom: 'Coll de Pal (Bagà, 2.105 m)' },
			distanciaKm: 4,
			tempsMinuts: 80,
			tecnicitat: 'cap',
			descripcio: {
				ca: "És la pujada més curta i la més freqüentada. Des del coll de Pal, on s'arriba per carretera des de Bagà, se segueix el GR fins a la collada de Comabella (50 min) i després la carena llarga i senzilla fins al cim (1 h 20 min en total, segons Xiruca). El camí està senyalitzat amb estaques, fites i marques, i no té passos difícils. Són uns 8 km anada i tornada pel mateix camí.",
				es: 'Es la subida más corta y la más frecuentada. Desde el coll de Pal, al que se llega por carretera desde Bagà, se sigue el GR hasta la collada de Comabella (50 min) y después la cresta larga y sencilla hasta la cima (1 h 20 min en total, según Xiruca). El camino está señalizado con estacas, hitos y marcas, y no tiene pasos difíciles. Son unos 8 km ida y vuelta por el mismo camino.'
			},
			fonts: [XIRUCA]
		},
		{
			id: 'urus',
			nom: {
				ca: "Des d'Urús pel coll de Jou",
				es: 'Desde Urús por el coll de Jou'
			},
			sortida: { nom: "Plaça Major d'Urús (1.264 m)" },
			tempsMinuts: 225,
			descripcio: {
				ca: "Pel vessant de la Cerdanya, Rutes Pirineus proposa sortir d'Urús i pujar pel torrent de Fontllebrera, que es creua diverses vegades, fins al coll de Jou, l'antic pas del camí ral, i d'allà per la carena fins al cim: 3 h 45 min de pujada i més de 1.200 m de desnivell. És una sortida llarga, per a qui vulgui fer el cim sense passar per l'estació d'esquí.",
				es: 'Por la vertiente de la Cerdanya, Rutes Pirineus propone salir de Urús y subir por el torrente de Fontllebrera, que se cruza varias veces, hasta el coll de Jou, el antiguo paso del camino real, y desde allí por la cresta hasta la cima: 3 h 45 min de subida y más de 1.200 m de desnivel. Es una salida larga, para quien quiera hacer la cima sin pasar por la estación de esquí.'
			},
			fonts: [RUTES_PIRINEUS]
		}
	],
	consells: {
		ca: [
			"Si puges amb nens des del coll de Pal, recorda que és un cim de més de 2.500 m: el vent i el fred hi són molt més forts que a baix, fins i tot a l'estiu.",
			"Amb boira, la carena és ampla i fàcil de perdre: segueix les estaques i les fites del GR i no et refiïs de les pistes d'esquí per orientar-te.",
			"A l'hivern, les pistes de Masella i la Molina són zona d'esquí: si hi puges amb raquetes, consulta les normes de l'estació i el butlletí d'allaus.",
			"Si el temps es posa lleig, el refugi del Niu de l'Àliga, al cim, pot servir d'aixopluc; informa't abans dels horaris del refugi i del telecabina."
		],
		es: [
			'Si subes con niños desde el coll de Pal, recuerda que es una cima de más de 2.500 m: el viento y el frío son mucho más fuertes que abajo, incluso en verano.',
			'Con niebla, la cresta es ancha y fácil de perder: sigue las estacas y los hitos del GR y no te fíes de las pistas de esquí para orientarte.',
			'En invierno, las pistas de Masella y La Molina son zona de esquí: si subes con raquetas, consulta las normas de la estación y el boletín de aludes.',
			"Si el tiempo se estropea, el refugio del Niu de l'Àliga, en la cima, puede servir de refugio; infórmate antes de los horarios del refugio y del telecabina."
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Quina és la ruta més fàcil per pujar a la Tosa d'Alp?",
				resposta:
					'La que surt del coll de Pal: segons Xiruca, 1 h 20 min de pujada per un camí senyalitzat i sense passos difícils, i 2 h 15 min anada i tornada sense parades.'
			},
			{
				pregunta: "Es pot pujar a la Tosa d'Alp amb nens?",
				resposta:
					'Des del coll de Pal, sí, si fa bon temps: el camí és curt i fàcil. Cal tenir en compte que el cim supera els 2.500 m i que a la carena hi pot fer molt de vent i fred.'
			},
			{
				pregunta: "Es pot pujar a la Tosa d'Alp amb telecabina?",
				resposta:
					"Sí: el refugi del Niu de l'Àliga, al cim, té accés amb telecabina des de la Molina. Ara bé, perquè l'ascensió tingui sentit com a sortida de muntanya, el més habitual és fer-la a peu."
			},
			{
				pregunta: 'La Tosa compta com a cim essencial?',
				resposta:
					"Sí, és un dels [cims essencials](/cims-essencials) del Berguedà. Com s'ha de validar l'ascensió ho explica la [normativa del repte](/repte-100-cims/normativa)."
			}
		],
		es: [
			{
				pregunta: "¿Cuál es la ruta más fácil para subir a la Tosa d'Alp?",
				resposta:
					'La que sale del coll de Pal: según Xiruca, 1 h 20 min de subida por un camino señalizado y sin pasos difíciles, y 2 h 15 min ida y vuelta sin paradas.'
			},
			{
				pregunta: "¿Se puede subir a la Tosa d'Alp con niños?",
				resposta:
					'Desde el coll de Pal, sí, si hace buen tiempo: el camino es corto y fácil. Hay que tener en cuenta que la cima supera los 2.500 m y que en la cresta puede hacer mucho viento y frío.'
			},
			{
				pregunta: "¿Se puede subir a la Tosa d'Alp en telecabina?",
				resposta:
					"Sí: el refugio del Niu de l'Àliga, en la cima, tiene acceso en telecabina desde La Molina. Ahora bien, para que la ascensión tenga sentido como salida de montaña, lo habitual es hacerla a pie."
			},
			{
				pregunta: '¿La Tosa cuenta como cima esencial?',
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) del Berguedà. Cómo hay que validar la ascensión lo explica la [normativa del reto](/repte-100-cims/normativa).'
			}
		]
	},
	fonts: [VIQUIPEDIA, XIRUCA, RUTES_PIRINEUS],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
