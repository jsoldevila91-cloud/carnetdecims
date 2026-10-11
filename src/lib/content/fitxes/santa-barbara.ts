import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const WIKIPEDIA = {
	nom: 'Wikipedia: Muntanya de Santa Bàrbara',
	url: 'https://en.wikipedia.org/wiki/Muntanya_de_Santa_B%C3%A0rbara',
	consultat: CONSULTAT
};

const VIQUIPEDIA_HORTA = {
	nom: 'Viquipèdia: Horta de Sant Joan',
	url: 'https://ca.wikipedia.org/wiki/Horta_de_Sant_Joan',
	consultat: CONSULTAT
};

const TERRES_EBRE = {
	nom: "Terres de l'Ebre: Convent de Sant Salvador d'Horta",
	url: 'https://terresdelebre.travel/en/node/678',
	consultat: CONSULTAT
};

const DIARI_TARRAGONA = {
	nom: 'Diari de Tarragona: De ruta por Tarragona, la montaña de Picasso',
	url: 'https://www.diaridetarragona.com/ocio/193671/de-ruta-por-tarragona-la-montana-de-picasso-pc18929273.html',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Santa Bàrbara',
	url: 'https://reptesmuntanyencs.cat/santa-barbara/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'santa-barbara',
	descripcio: {
		ca: [
			"Santa Bàrbara és la muntanya que tanca Horta de Sant Joan pel costat dels Ports, a [la Terra Alta](/comarques/terra-alta): un contrafort nord-occidental dels Ports de Tortosa-Beseit que s'alça a uns dos quilòmetres del poble. Al peu hi ha el convent de Sant Salvador d'Horta, o de la Mare de Déu dels Àngels, d'on surt el camí que puja al cim.",
			"El convent té una església de l'època dels templers, un claustre renaixentista i edificis dels segles XIII al XVII, i va acollir una comunitat franciscana important; al segle XVI hi va viure fra Salvador. El camí de pujada passa per la cova i l'agulla de Sant Salvador i per un seguit de petites ermites mig amagades en el paisatge, i al capdamunt queden les ruïnes de la capella de Santa Bàrbara.",
			'La muntanya és també la de Picasso. De jove va passar una llarga temporada a Horta convidat pel seu amic Manuel Pallarès, fill del poble, va pujar a Santa Bàrbara i la va pintar diverses vegades; hi va tornar el 1909, en plena època cubista. Deia que a Horta havia après tot el que sabia.',
			"Des del camí i des del cim es veuen les serres de Pàndols i Cavalls, els Ports amb les [Roques de Benet](/cims/roques-de-benet) i els pobles d'Horta, Bot i Arnes. És una sortida curta, de mig matí, però no planera: el camí guanya alçada de pressa i la baixada és per terreny descompost."
		],
		es: [
			"Santa Bàrbara es la montaña que cierra Horta de Sant Joan por el lado de los Ports, en [la Terra Alta](/comarques/terra-alta): un contrafuerte noroccidental de los Ports de Tortosa-Beseit que se levanta a unos dos kilómetros del pueblo. A sus pies está el convento de Sant Salvador d'Horta, o de la Mare de Déu dels Àngels, de donde sale el camino que sube a la cima.",
			'El convento tiene una iglesia de la época de los templarios, un claustro renacentista y edificios de los siglos XIII al XVII, y acogió a una comunidad franciscana importante; en el siglo XVI vivió allí fray Salvador. El camino de subida pasa por la cueva y la aguja de Sant Salvador y por una serie de pequeñas ermitas medio escondidas en el paisaje, y en lo alto quedan las ruinas de la capilla de Santa Bàrbara.',
			'La montaña es también la de Picasso. De joven pasó una larga temporada en Horta invitado por su amigo Manuel Pallarès, hijo del pueblo, subió a Santa Bàrbara y la pintó varias veces; volvió en 1909, en plena época cubista. Decía que en Horta había aprendido todo lo que sabía.',
			'Desde el camino y desde la cima se ven las sierras de Pàndols y Cavalls, los Ports con las [Roques de Benet](/cims/roques-de-benet) y los pueblos de Horta, Bot y Arnes. Es una salida corta, de media mañana, pero no llana: el camino gana altura deprisa y la bajada es por terreno descompuesto.'
		]
	},
	rutes: [
		{
			id: 'sant-salvador-d-horta',
			nom: {
				ca: "Circular des del convent de Sant Salvador d'Horta",
				es: "Circular desde el convento de Sant Salvador d'Horta"
			},
			sortida: { nom: "Convent de Sant Salvador d'Horta (Horta de Sant Joan)" },
			desnivellPositiuM: 268,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Al convent hi ha un plafó amb el mapa del sender. El Diari de Tarragona hi compta una volta de 3,69 km i 268 m de desnivell positiu, de dificultat moderada: curta, però amb pendents pronunciats, algun tram exposat al buit i una baixada de pedra solta que rellisca. Es puja planejant sota les parets fins a la cova de Sant Salvador, es volta la muntanya amb una pujada sostinguda i, en un replà amb xiprers, es deixa el sender per un tram pedregós amb fites que mena a les ruïnes del cim. Es baixa per l'altre vessant, de nou fins al convent. Si surts a peu d'Horta, afegeix-hi 4 km i una hora.",
				es: 'En el convento hay un panel con el mapa del sendero. El Diari de Tarragona cuenta una vuelta de 3,69 km y 268 m de desnivel positivo, de dificultad moderada: corta, pero con pendientes pronunciadas, algún tramo expuesto al vacío y una bajada de piedra suelta que resbala. Se sube llaneando bajo las paredes hasta la cueva de Sant Salvador, se rodea la montaña con una subida sostenida y, en un rellano con cipreses, se deja el sendero por un tramo pedregoso con hitos que lleva a las ruinas de la cima. Se baja por la otra vertiente, de nuevo hasta el convento. Si sales a pie de Horta, añade 4 km y una hora.'
			},
			fonts: [DIARI_TARRAGONA, REPTES]
		}
	],
	consells: {
		ca: [
			"El punt que es dona per cim són les ruïnes. Més enllà hi ha una creu de ferro a la qual s'arriba per un pas una mica aeri: amb vent ratxat, deixa-ho estar.",
			"La baixada per l'altre vessant és dreta i de pedra solta: porta calçat amb bona sola i no hi baixis corrent. Amb nens petits o gent insegura, val més tornar pel camí de pujada.",
			"Els corriols que s'enfilen drets per les canals són accessos dels escaladors, no dreceres: segueix el sender principal.",
			"No comptis amb aigua pel camí. Pots lligar la sortida amb la visita al convent i al Centre Picasso d'Horta."
		],
		es: [
			'El punto que se da por cima son las ruinas. Más allá hay una cruz de hierro a la que se llega por un paso algo aéreo: con viento racheado, déjalo estar.',
			'La bajada por la otra vertiente es empinada y de piedra suelta: lleva calzado con buena suela y no bajes corriendo. Con niños pequeños o gente insegura, es mejor volver por el camino de subida.',
			'Las sendas que trepan directas por las canales son accesos de los escaladores, no atajos: sigue el sendero principal.',
			'No cuentes con agua en el camino. Puedes enlazar la salida con la visita al convento y al Centre Picasso de Horta.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Santa Bàrbara?',
				resposta:
					'La volta des del convent de Sant Salvador fa 3,69 km i 268 m de desnivell, segons el Diari de Tarragona. El bloc Reptes Muntanyencs hi va estar dues hores de marxa, amb el cim poc després de la meitat del recorregut.'
			},
			{
				pregunta: 'És una excursió per fer amb nens?',
				resposta:
					'És curta, però té pendents forts, algun tram exposat i una baixada de pedra solta. Amb nens acostumats a caminar per muntanya es pot fer amb atenció; no és un passeig.'
			},
			{
				pregunta: 'Què hi ha al cim?',
				resposta:
					'Les ruïnes de la capella de Santa Bàrbara i, una mica més enllà, una creu de ferro. Pel camí es passa per la cova de Sant Salvador i per diverses ermites.'
			},
			{
				pregunta: 'Quina relació té amb Picasso?',
				resposta:
					'Picasso va viure una temporada a Horta de Sant Joan de jove i hi va tornar el 1909. Va pujar a la muntanya i la va pintar en diverses obres.'
			},
			{
				pregunta: 'Santa Bàrbara compta com a cim essencial?',
				resposta:
					'Sí, és un dels dos [cims essencials](/cims-essencials) de la Terra Alta, amb les [Roques de Benet](/cims/roques-de-benet).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Santa Bàrbara?',
				resposta:
					'La vuelta desde el convento de Sant Salvador tiene 3,69 km y 268 m de desnivel, según el Diari de Tarragona. El blog Reptes Muntanyencs empleó dos horas de marcha, con la cima poco después de la mitad del recorrido.'
			},
			{
				pregunta: '¿Es una excursión para hacer con niños?',
				resposta:
					'Es corta, pero tiene pendientes fuertes, algún tramo expuesto y una bajada de piedra suelta. Con niños acostumbrados a andar por montaña se puede hacer con atención; no es un paseo.'
			},
			{
				pregunta: '¿Qué hay en la cima?',
				resposta:
					'Las ruinas de la capilla de Santa Bàrbara y, algo más allá, una cruz de hierro. Por el camino se pasa por la cueva de Sant Salvador y por varias ermitas.'
			},
			{
				pregunta: '¿Qué relación tiene con Picasso?',
				resposta:
					'Picasso vivió una temporada en Horta de Sant Joan de joven y volvió en 1909. Subió a la montaña y la pintó en varias obras.'
			},
			{
				pregunta: '¿Santa Bàrbara cuenta como cima esencial?',
				resposta:
					'Sí, es una de las dos [cimas esenciales](/cims-essencials) de la Terra Alta, con las [Roques de Benet](/cims/roques-de-benet).'
			}
		]
	},
	fonts: [WIKIPEDIA, VIQUIPEDIA_HORTA, TERRES_EBRE, DIARI_TARRAGONA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
