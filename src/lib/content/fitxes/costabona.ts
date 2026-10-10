import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Costabona',
	url: 'https://ca.wikipedia.org/wiki/Costabona',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: pujada al Costabona des de Setcases",
	url: 'https://dexcursio.net/costabona-des-de-setcases/',
	consultat: CONSULTAT
};

const PENINSULA_BLOG = {
	nom: 'Península Blog: Pic de Costabona (2.465 m), circular desde Setcases',
	url: 'https://peninsulablog.com/2021/07/25/pic-de-costabona-2-465-m-circular-desde-setcases/',
	consultat: CONSULTAT
};

const RIPOLLES_TURISME_FONDA = {
	nom: 'Ripollès Turisme: pujada al Costabona per la Collada Fonda',
	url: 'https://ripollesturisme.cat/en/ruta-senderisme/pujada-al-costabona-per-la-collada-fonda/',
	consultat: CONSULTAT
};

const RIPOLLES_TURISME_VOLTA = {
	nom: 'Ripollès Turisme: la gran volta al Costabona',
	url: 'https://ripollesturisme.cat/en/ruta-senderisme/la-gran-volta-al-costabona/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'costabona',
	descripcio: {
		ca: [
			"El Costabona és un massís granític de 2.465 m a la frontera entre Setcases, al [Ripollès](/comarques/ripolles), i Prats de Molló i la Presta, al Vallespir, a Catalunya Nord. Separa les valls del Tec i del Ter i queda dins del Parc Natural de les Capçaleres del Ter i del Freser. La Viquipèdia el descriu com l'últim gran cim d'aquesta carena cap a llevant i com una de les excursions més triades del massís del Canigó.",
			"Té un patrimoni industrial poc habitual: a uns 2.300 m del vessant oriental, ja en terme de Prats de Molló, hi ha les mines de scheelita (tungstat de calci), a les quals es va construir una pista forestal que ara es troba en mal estat. Al coll de Pal, un antic pas fronterer a 2.318 m, s'hi veu la fita fronterera número 513 i, segons Península Blog, una taula d'interpretació i elements commemoratius al cim.",
			"La vista, segons la Viquipèdia, abasta a llevant el golf de Roses i la plana del Rosselló, separats per la serra de l'Albera; al nord, el Canigó, les Esquerdes de Rojà i la vall del Tec; i a ponent, els cims del circ d'Ulldeter, com el Gra de Fajol i el [Bastiments](/cims/bastiments). Al cim hi ha un vèrtex geodèsic, diverses creus i una bústia metàl·lica.",
			"A la baixada de la ruta de Setcases hi ha el refugi Jaume Farré (Dexcursio l'escriu Jaume Ferrer), un refugi lliure en bon estat segons Península Blog, envoltat de vaques i cavalls; hi pot haver mosques i olor. Amb boira, Dexcursio aconsella fer el tram final passant pel coll de Pal, i avisa que la baixada per fites des del coll pot despistar."
		],
		es: [
			'El Costabona es un macizo granítico de 2.465 m en la frontera entre Setcases, en el [Ripollès](/comarques/ripolles), y Prats de Molló i la Presta, en el Vallespir, en Cataluña Norte. Separa los valles del Tec y del Ter y queda dentro del Parque Natural de las Capçaleres del Ter i del Freser. La Viquipèdia lo describe como la última gran cima de esta cresta hacia levante y como una de las excursiones más elegidas del macizo del Canigó.',
			'Tiene un patrimonio industrial poco habitual: a unos 2.300 m de la vertiente oriental, ya en término de Prats de Molló, están las minas de scheelita (tungstato de calcio), a las que se construyó una pista forestal que ahora está en mal estado. En el coll de Pal, un antiguo paso fronterizo a 2.318 m, se ve el mojón fronterizo número 513 y, según Península Blog, una mesa de interpretación y elementos conmemorativos en la cima.',
			'La vista, según la Viquipèdia, abarca a levante el golfo de Roses y la llanura del Rosellón, separados por la sierra de l’Albera; al norte, el Canigó, las Esquerdes de Rojà y el valle del Tec; y a poniente, las cimas del circo de Ulldeter, como el Gra de Fajol y el [Bastiments](/cims/bastiments). En la cima hay un vértice geodésico, varias cruces y un buzón metálico.',
			'En la bajada de la ruta de Setcases está el refugio Jaume Farré (Dexcursio lo escribe Jaume Ferrer), un refugio libre en buen estado según Península Blog, rodeado de vacas y caballos; puede haber moscas y olor. Con niebla, Dexcursio aconseja hacer el tramo final pasando por el coll de Pal, y avisa de que la bajada por hitos desde el collado puede despistar.'
		]
	},
	rutes: [
		{
			id: 'setcases',
			nom: {
				ca: 'Circular des de Setcases pel coll de Pal',
				es: 'Circular desde Setcases por el coll de Pal'
			},
			sortida: { nom: 'Setcases (aparcament del poble)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Es creua el Ter i es puja pel GR 11 fins al coll de Lliens, per una pista forestal fins a la Collada Fonda i, des d'allà, per un sender marcat al llom i al coll de Pal. Un camí curt i senzill porta al cim, segons Península Blog, que la descriu sense dificultat tècnica però amb força exigència física. Es baixa pel coll de Pal i un corriol amb fites fins al refugi Jaume Farré. Dexcursio calcula 19,8 km, 7 h 30 min i 1.253 m de desnivell; Península Blog, 19 km, 1.215 m i 6 h 30 min netes.",
				es: 'Se cruza el Ter y se sube por el GR 11 hasta el coll de Lliens, por una pista forestal hasta la Collada Fonda y, desde allí, por un sendero marcado al lomo y al coll de Pal. Un camino corto y sencillo lleva a la cima, según Península Blog, que la describe sin dificultad técnica pero con bastante exigencia física. Se baja por el coll de Pal y una senda con hitos hasta el refugio Jaume Farré. Dexcursio calcula 19,8 km, 7 h 30 min y 1.253 m de desnivel; Península Blog, 19 km, 1.215 m y 6 h 30 min netas.'
			},
			fonts: [DEXCURSIO, PENINSULA_BLOG]
		},
		{
			id: 'collada-fonda',
			nom: {
				ca: 'Circular curta per la Collada Fonda',
				es: 'Circular corta por la Collada Fonda'
			},
			sortida: { nom: 'Collada Fonda (Molló / Setcases)' },
			descripcio: {
				ca: "Ripollès Turisme publica una circular de 8,2 km, 659 m de desnivell acumulat, 3 h 45 min i dificultat mitjana, que descriu com relativament fàcil per a una ruta d'alta muntanya. La Collada Fonda queda a 1.907 m i, segons Península Blog, molta gent hi aparca per pujar al cim. La pàgina no detalla els punts de pas: convé descarregar-ne el track.",
				es: 'Ripollès Turisme publica una circular de 8,2 km, 659 m de desnivel acumulado, 3 h 45 min y dificultad media, que describe como relativamente fácil para una ruta de alta montaña. La Collada Fonda queda a 1.907 m y, según Península Blog, mucha gente aparca allí para subir a la cima. La página no detalla los puntos de paso: conviene descargar el track.'
			},
			fonts: [RIPOLLES_TURISME_FONDA, PENINSULA_BLOG]
		}
	],
	consells: {
		ca: [
			"Amb boira, puja l'últim tram pel coll de Pal i no directament per la carena, com aconsella Dexcursio, i porta el track per a la baixada per fites.",
			"Porta 2 litres d'aigua com a mínim i protecció solar: gran part de la ruta de Setcases és descoberta.",
			'El refugi Jaume Farré és lliure i hi pasturen vaques i cavalls; Dexcursio el proposa com a lloc per fer una pausa.',
			'Les antigues mines de scheelita del vessant del Vallespir, a uns 2.300 m, tenen una pista en mal estat: no hi comptis com a accés.',
			'Si vols fer la gran volta de 31 km i 2.213 m de desnivell, Ripollès Turisme la planteja en dos dies i amb dificultat alta.'
		],
		es: [
			'Con niebla, sube el último tramo por el coll de Pal y no directamente por la cresta, como aconseja Dexcursio, y lleva el track para la bajada por hitos.',
			'Lleva 2 litros de agua como mínimo y protección solar: gran parte de la ruta de Setcases está descubierta.',
			'El refugio Jaume Farré es libre y allí pastan vacas y caballos; Dexcursio lo propone como lugar para hacer una pausa.',
			'Las antiguas minas de scheelita de la vertiente del Vallespir, a unos 2.300 m, tienen una pista en mal estado: no cuentes con ella como acceso.',
			'Si quieres hacer la gran vuelta de 31 km y 2.213 m de desnivel, Ripollès Turisme la plantea en dos días y con dificultad alta.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Costabona?',
				resposta:
					'Dexcursio calcula 7 h 30 min per a la circular de 19,8 km des de Setcases; Península Blog, 6 h 30 min netes per a 19 km. Ripollès Turisme proposa una circular de 8,2 km i 3 h 45 min per la Collada Fonda.'
			},
			{
				pregunta: 'És una ruta tècnica?',
				resposta:
					'Península Blog la descriu sense dificultat tècnica però amb força exigència física. La baixada per fites del coll de Pal és poc evident: convé portar un track.'
			},
			{
				pregunta: 'Què es veu des del cim?',
				resposta:
					'Segons la Viquipèdia, el golf de Roses i la plana del Rosselló a llevant, el Canigó i la vall del Tec al nord, i el Gra de Fajol i el Bastiments a ponent.'
			},
			{
				pregunta: 'El Costabona compta com a cim essencial?',
				resposta:
					"Sí. Per altitud, al Ripollès només el superen el [Puigmal](/cims/puigmal), el [Bastiments](/cims/bastiments) i el [Balandrau](/cims/balandrau). És l'essencial del Ripollès situat més a llevant, a tocar del Vallespir."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Costabona?',
				resposta:
					'Dexcursio calcula 7 h 30 min para la circular de 19,8 km desde Setcases; Península Blog, 6 h 30 min netas para 19 km. Ripollès Turisme propone una circular de 8,2 km y 3 h 45 min por la Collada Fonda.'
			},
			{
				pregunta: '¿Es una ruta técnica?',
				resposta:
					'Península Blog la describe sin dificultad técnica pero con bastante exigencia física. La bajada por hitos desde el coll de Pal es poco evidente: conviene llevar un track.'
			},
			{
				pregunta: '¿Qué se ve desde la cima?',
				resposta:
					'Según la Viquipèdia, el golfo de Roses y la llanura del Rosellón a levante, el Canigó y el valle del Tec al norte, y el Gra de Fajol y el Bastiments a poniente.'
			},
			{
				pregunta: '¿El Costabona cuenta como cima esencial?',
				resposta:
					'Sí. Por altitud, en el Ripollès solo la superan el [Puigmal](/cims/puigmal), el [Bastiments](/cims/bastiments) y el [Balandrau](/cims/balandrau). Es la esencial del Ripollès situada más al este, junto al Vallespir.'
			}
		]
	},
	fonts: [VIQUIPEDIA, DEXCURSIO, PENINSULA_BLOG, RIPOLLES_TURISME_FONDA, RIPOLLES_TURISME_VOLTA],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
