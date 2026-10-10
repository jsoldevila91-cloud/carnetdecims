import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const CERDANYA = {
	nom: 'Turisme Cerdanya: Comabona',
	url: 'https://cerdanya.org/ruta/comabona/',
	consultat: CONSULTAT
};

const BERGUEDA = {
	nom: 'Turisme del Berguedà: ascensió al Comabona des de les Bassotes',
	url: 'https://www.elbergueda.cat/ca/pag524/pl205/rutes-a-peu-per-les-7-cares-del-pedraforca/id697/ascensio-al-comabona-des-de-les-bassotes.htm',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'comabona',
	descripcio: {
		ca: [
			"El Comabona és un dels cims més alts de la serra del Cadí, a la part oriental de la serra, on el Cadí s'acosta al Moixeró. Fa de partió entre la Cerdanya, al nord, i [el Berguedà](/comarques/bergueda), al sud, i és dins del Parc Natural del Cadí-Moixeró. La cara nord cau en cingleres cap a la plana cerdana, i la sud baixa més suau cap al clot de Comabona.",
			"El nom té història: a la Cerdanya la muntanya es coneix com a Tancalaporta, i Comabona és el nom berguedà, el que s'ha imposat entre els excursionistes. Pel camí de pujada des del nord es passa pel pas dels Gosolans, que comunica la Cerdanya amb el vessant de Gósol. Segons Turisme Cerdanya, Pablo Picasso el va travessar l'estiu del 1906, quan va acabar la seva estada a Gósol.",
			"Turisme Cerdanya el considera un dels millors miradors de la Cerdanya, i des del Berguedà se'n destaca la vista sobre la cara nord del [Pedraforca](/cims/pedraforca-pollego-superior), la menys coneguda. Cap a l'est, la carena continua pel coll de Tancalaporta cap al Moixeró i les [Penyes Altes](/cims/penyes-altes).",
			"Sense neu, de juny a octubre, la pujada des de Prat d'Aguiló no té complicacions. Fins ben entrat maig hi sol haver congestes abans del pas dels Gosolans, i amb neu el pendent d'aquest pas és fort i calen piolet i grampons. A l'estiu, compte amb les tempestes de tarda a la carena."
		],
		es: [
			'El Comabona es una de las cimas más altas de la sierra del Cadí, en la parte oriental de la sierra, donde el Cadí se acerca al Moixeró. Hace de divisoria entre la Cerdanya, al norte, y [el Berguedà](/comarques/bergueda), al sur, y está dentro del Parque Natural del Cadí-Moixeró. La cara norte cae en riscos hacia la llanura ceretana, y la sur baja más suave hacia el clot de Comabona.',
			'El nombre tiene historia: en la Cerdanya la montaña se conoce como Tancalaporta, y Comabona es el nombre bergadán, el que se ha impuesto entre los excursionistas. En el camino de subida desde el norte se pasa por el pas dels Gosolans, que comunica la Cerdanya con la vertiente de Gósol. Según Turisme Cerdanya, Pablo Picasso lo cruzó en el verano de 1906, al terminar su estancia en Gósol.',
			'Turisme Cerdanya lo considera uno de los mejores miradores de la Cerdanya, y desde el Berguedà se destaca la vista sobre la cara norte del [Pedraforca](/cims/pedraforca-pollego-superior), la menos conocida. Hacia el este, la cresta sigue por el coll de Tancalaporta hacia el Moixeró y las [Penyes Altes](/cims/penyes-altes).',
			"Sin nieve, de junio a octubre, la subida desde Prat d'Aguiló no tiene complicaciones. Hasta bien entrado mayo suele haber neveros antes del pas dels Gosolans, y con nieve la pendiente de este paso es fuerte y hacen falta piolet y crampones. En verano, cuidado con las tormentas de tarde en la cresta."
		]
	},
	rutes: [
		{
			id: 'prat-d-aguilo',
			nom: {
				ca: "Des de Prat d'Aguiló pel pas dels Gosolans",
				es: "Desde Prat d'Aguiló por el pas dels Gosolans"
			},
			sortida: { nom: "Prat d'Aguiló (1.980 m)" },
			desnivellPositiuM: 604,
			tempsMinuts: 90,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "És la ruta més curta, pel vessant cerdà. Es puja amb cotxe per la pista de Montellà fins a Prat d'Aguiló i, passat el refugi, s'enfila un pedregar calcari fins al pas dels Gosolans (1 h). D'allà se segueix la carena del Cadí cap a l'est, pel cim d'Aguiló i el puig de la Font Tordera, fins al Comabona. Turisme Cerdanya la qualifica de fàcil: 1 h 30 min d'anada i uns 600 m de desnivell, tornant pel mateix camí.",
				es: "Es la ruta más corta, por la vertiente ceretana. Se sube en coche por la pista de Montellà hasta Prat d'Aguiló y, pasado el refugio, se remonta una pedrera caliza hasta el pas dels Gosolans (1 h). Desde allí se sigue la cresta del Cadí hacia el este, por el cim d'Aguiló y el puig de la Font Tordera, hasta el Comabona. Turisme Cerdanya la califica de fácil: 1 h 30 min de ida y unos 600 m de desnivel, volviendo por el mismo camino."
			},
			fonts: [CERDANYA]
		},
		{
			id: 'bassotes',
			nom: {
				ca: 'Circular des del coll de les Bassotes',
				es: 'Circular desde el coll de les Bassotes'
			},
			sortida: { nom: 'Coll de les Bassotes (Gósol)' },
			descripcio: {
				ca: "Pel vessant berguedà, Turisme del Berguedà proposa una volta d'uns 16 km i 950 m de desnivell, unes 5 h 30 min en total, que puja pel pas dels Gosolans i carena fins al cim. Hi ha trams poc marcats i pedregosos, i cal saber-se orientar. A l'hivern no s'hi pot arribar amb cotxe.",
				es: 'Por la vertiente bergadana, Turisme del Berguedà propone una vuelta de unos 16 km y 950 m de desnivel, unas 5 h 30 min en total, que sube por el pas dels Gosolans y sigue la cresta hasta la cima. Hay tramos poco marcados y pedregosos, y hay que saber orientarse. En invierno no se puede llegar en coche.'
			},
			fonts: [BERGUEDA]
		}
	],
	consells: {
		ca: [
			"La pista de Montellà a Prat d'Aguiló fa 13 km i no sempre és en bon estat: vés-hi amb calma i amb un vehicle adequat.",
			"El refugi de Prat d'Aguiló, guardat, és a deu minuts de l'aparcament i va bé per fer-hi nit o per informar-te de l'estat del pas.",
			'Fins a maig hi pot haver congestes abans del pas dels Gosolans: amb neu dura, calen piolet i grampons.',
			"La carena és ampla però exposada: amb boira o tempesta no t'hi entretinguis i baixa pel mateix camí."
		],
		es: [
			"La pista de Montellà a Prat d'Aguiló tiene 13 km y no siempre está en buen estado: ve con calma y con un vehículo adecuado.",
			"El refugio de Prat d'Aguiló, guardado, está a diez minutos del aparcamiento y va bien para pasar la noche o para informarte del estado del paso.",
			'Hasta mayo puede haber neveros antes del pas dels Gosolans: con nieve dura, hacen falta piolet y crampones.',
			'La cresta es ancha pero expuesta: con niebla o tormenta no te entretengas y baja por el mismo camino.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Comabona?',
				resposta:
					"Des de Prat d'Aguiló, 1 h 30 min de pujada i 1 h de baixada segons Turisme Cerdanya, amb uns 600 m de desnivell. La volta des del coll de les Bassotes és molt més llarga: unes 5 h 30 min en total."
			},
			{
				pregunta: 'Quina és la ruta més fàcil per pujar al Comabona?',
				resposta:
					"La de Prat d'Aguiló, pel pas dels Gosolans i la carena del Cadí. Té un tram de pedregar, però cap pas on calgui grimpar, i és la que té menys desnivell."
			},
			{
				pregunta: 'Per què el Comabona també es diu Tancalaporta?',
				resposta:
					'Tancalaporta és el nom amb què la muntanya es coneix a la Cerdanya; Comabona és el nom berguedà, el més estès entre els excursionistes. Tots dos designen el mateix cim.'
			},
			{
				pregunta: 'El Comabona compta com a cim essencial?',
				resposta:
					'Sí. Amb 2.548 m, encapçala els [cims essencials](/cims-essencials) del Berguedà, per sobre de [la Tosa](/cims/la-tosa) i del Pedraforca. El que compta és el cim, no el vessant: el pots validar pujant tant des de la Cerdanya com des de Gósol.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Comabona?',
				resposta:
					"Desde Prat d'Aguiló, 1 h 30 min de subida y 1 h de bajada según Turisme Cerdanya, con unos 600 m de desnivel. La vuelta desde el coll de les Bassotes es mucho más larga: unas 5 h 30 min en total."
			},
			{
				pregunta: '¿Cuál es la ruta más fácil para subir al Comabona?',
				resposta:
					"La de Prat d'Aguiló, por el pas dels Gosolans y la cresta del Cadí. Tiene un tramo de pedrera, pero ningún paso en el que haya que trepar, y es la que tiene menos desnivel."
			},
			{
				pregunta: '¿Por qué el Comabona también se llama Tancalaporta?',
				resposta:
					'Tancalaporta es el nombre con el que la montaña se conoce en la Cerdanya; Comabona es el nombre bergadán, el más extendido entre los excursionistas. Los dos designan la misma cima.'
			},
			{
				pregunta: '¿El Comabona cuenta como cima esencial?',
				resposta:
					'Sí. Con 2.548 m, encabeza las [cimas esenciales](/cims-essencials) del Berguedà, por encima de [la Tosa](/cims/la-tosa) y del Pedraforca. Lo que cuenta es la cima, no la vertiente: puedes validarla subiendo tanto desde la Cerdanya como desde Gósol.'
			}
		]
	},
	fonts: [CERDANYA, BERGUEDA],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
