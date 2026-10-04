import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Sant Patllari',
	url: 'https://ca.wikipedia.org/wiki/Sant_Patllari',
	consultat: CONSULTAT
};

const CEC_BANYOLES = {
	nom: "Centre Excursionista de Banyoles: Conèixer el Pla de l'Estany, Pujarnol i Sant Patllari",
	url: 'https://cecbanyoles.cat/coneixer-el-pla-de-lestany-pujarnol-i-sant-patllari-porqueres/',
	consultat: CONSULTAT
};

const COSTA_BRAVA = {
	nom: 'Costa Brava Girona (Patronat de Turisme): ruta de Pujarnol a Sant Patllari',
	url: 'https://costabrava.org/que-fer/rutes-wikiloc/ruta-de-pujarnol-a-sant-patllari/',
	consultat: CONSULTAT
};

const TURISME_PLA_ESTANY = {
	nom: "Turisme Pla de l'Estany: ruta de l'Estany a Sant Patllari",
	url: 'https://turisme.plaestany.cat/item-turistic/2-ruta-de-lestany-a-sant-patllari/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'sant-patllari',
	descripcio: {
		ca: [
			"Sant Patllari és el cim de la serra del mateix nom, al terme de Porqueres, a l'extrem sud-oest [del Pla de l'Estany](/comarques/pla-de-l-estany). És un turó boscós d'alzines, roures i pins que fa de transició entre la plana de Banyoles i el massís de Rocacorba, i és el cim de referència de la comarca, que gairebé no té altres muntanyes.",
			"Al capdamunt hi ha una petita ermita romànica d'una sola nau i absis semicircular, documentada a principis del segle XIV, amb un petit refugi lliure al costat, i un vèrtex geodèsic. Els camins que hi pugen estan plens de llegendes: a la pujada des de Pujarnol es passa per la Pedra de la Mà de Déu, una roca amb l'empremta d'una mà que la tradició local atribueix a un origen diví, i el folklore de la zona parla de trobades entre bruixes i nois geperuts. El poblet de Pujarnol, amb l'església de Sant Cebrià i el seu petit cementiri, és el punt de sortida més habitual.",
			"Des del cim i des del mirador de la pujada es veu la plana i l'estany de Banyoles, el massís de Rocacorba i, en dies clars, el Montgrí i el Canigó. La vegetació, però, cada vegada tapa més la vista des del mateix cim.",
			"Es pot pujar tot l'any. És una bona sortida d'hivern i de tardor; a l'estiu el bosc fa ombra, però convé evitar les hores centrals. Els caps de setmana la carretera de Rocacorba és molt freqüentada per ciclistes."
		],
		es: [
			"Sant Patllari es la cima de la sierra del mismo nombre, en el municipio de Porqueres, en el extremo suroeste [del Pla de l'Estany](/comarques/pla-de-l-estany). Es una colina boscosa de encinas, robles y pinos que hace de transición entre la llanura de Banyoles y el macizo de Rocacorba, y es la cima de referencia de la comarca, que casi no tiene otras montañas.",
			'En lo alto hay una pequeña ermita románica de una sola nave y ábside semicircular, documentada a principios del siglo XIV, con un pequeño refugio libre al lado, y un vértice geodésico. Los caminos que suben están llenos de leyendas: en la subida desde Pujarnol se pasa por la Pedra de la Mà de Déu, una roca con la huella de una mano que la tradición local atribuye a un origen divino, y el folclore de la zona habla de encuentros entre brujas y jóvenes jorobados. El pueblecito de Pujarnol, con la iglesia de Sant Cebrià y su pequeño cementerio, es el punto de salida más habitual.',
			'Desde la cima y desde el mirador de la subida se ve la llanura y el lago de Banyoles, el macizo de Rocacorba y, en días claros, el Montgrí y el Canigó. La vegetación, sin embargo, tapa cada vez más la vista desde la propia cima.',
			'Se puede subir todo el año. Es una buena salida de invierno y de otoño; en verano el bosque da sombra, pero conviene evitar las horas centrales. Los fines de semana la carretera de Rocacorba está muy frecuentada por ciclistas.'
		]
	},
	rutes: [
		{
			id: 'pujarnol',
			nom: { ca: 'Des de Pujarnol', es: 'Desde Pujarnol' },
			sortida: { nom: 'Església de Sant Cebrià de Pujarnol (Porqueres)' },
			desnivellPositiuM: 224,
			tecnicitat: 'cap',
			descripcio: {
				ca: "La pujada més curta. Des de Pujarnol, el Centre Excursionista de Banyoles la descriu per un tram de la carretera de Rocacorba, pistes forestals i corriols, amb alguna pujada dreta, passant pel roure del Puig, la font de les Comes, el mirador i la Pedra de la Mà de Déu, i hi compta uns 224 m de desnivell fins a l'ermita. Es pot tornar pel coll Tallat per un camí ample; el Patronat de Turisme Costa Brava dona per a la circular 6,1 km, 299 m de desnivell i unes 2 h 30 min.",
				es: 'La subida más corta. Desde Pujarnol, el Centre Excursionista de Banyoles la describe por un tramo de la carretera de Rocacorba, pistas forestales y senderos, con alguna subida empinada, pasando por el roure del Puig, la font de les Comes, el mirador y la Pedra de la Mà de Déu, y calcula unos 224 m de desnivel hasta la ermita. Se puede volver por el coll Tallat por un camino ancho; el Patronato de Turismo Costa Brava da para la circular 6,1 km, 299 m de desnivel y unas 2 h 30 min.'
			},
			fonts: [CEC_BANYOLES, COSTA_BRAVA]
		},
		{
			id: 'porqueres-estany',
			nom: { ca: "Circular des de l'estany de Banyoles", es: 'Circular desde el lago de Banyoles' },
			sortida: { nom: 'Església de Santa Maria de Porqueres' },
			descripcio: {
				ca: "Per fer-la llarga, la ruta senyalitzada de Turisme Pla de l'Estany surt de l'església romànica de Santa Maria de Porqueres, a la vora de l'estany, passa pel mirador del Puig Clarà i puja a l'ermita per camins de bosc. És una circular de 16,2 km, 536 m de desnivell i unes 4 h 50 min, de dificultat mitjana.",
				es: "Para hacerla larga, la ruta señalizada de Turisme Pla de l'Estany sale de la iglesia románica de Santa Maria de Porqueres, a orillas del lago, pasa por el mirador del Puig Clarà y sube a la ermita por caminos de bosque. Es una circular de 16,2 km, 536 m de desnivel y unas 4 h 50 min, de dificultad media."
			},
			fonts: [TURISME_PLA_ESTANY]
		}
	],
	consells: {
		ca: [
			'Si surts de Pujarnol, aparca sense obstaculitzar els accessos del poble: és un nucli molt petit.',
			'Vigila al tram de carretera de Rocacorba: és estreta i hi passen molts ciclistes.',
			"El refugi del costat de l'ermita és lliure i petit (unes 8 places, segons Turisme Pla de l'Estany): deixa'l net.",
			'Porta aigua: la font de les Comes, a la pujada, està tapada.',
			'Si vas amb nens, la Pedra de la Mà de Déu i les llegendes del camí són un bon reclam per animar-los a pujar.'
		],
		es: [
			'Si sales de Pujarnol, aparca sin obstaculizar los accesos del pueblo: es un núcleo muy pequeño.',
			'Ten cuidado en el tramo de carretera de Rocacorba: es estrecha y pasan muchos ciclistas.',
			"El refugio junto a la ermita es libre y pequeño (unas 8 plazas, según Turisme Pla de l'Estany): déjalo limpio.",
			'Lleva agua: la font de les Comes, en la subida, está tapada.',
			'Si vas con niños, la Pedra de la Mà de Déu y las leyendas del camino son un buen reclamo para animarlos a subir.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Sant Patllari?',
				resposta:
					"Des de Pujarnol és una pujada curta, d'uns 224 m de desnivell segons el CE Banyoles; la circular per coll Tallat fa 6,1 km i unes 2 h 30 min en total. Des de l'estany de Banyoles, la ruta llarga són unes 4 h 50 min."
			},
			{
				pregunta: 'Es pot pujar a Sant Patllari amb nens?',
				resposta:
					"Sí: des de Pujarnol són pistes i corriols de bosc, amb algun tram dret però sense passos difícils, i el desnivell és moderat. A dalt hi ha l'ermita i el refugi per fer-hi una parada."
			},
			{
				pregunta: 'Què és la Pedra de la Mà de Déu?',
				resposta:
					"És una roca del camí de Pujarnol a Sant Patllari amb una forma que recorda l'empremta d'una mà, que la llegenda local atribueix a Déu. És una de les curiositats de la pujada."
			},
			{
				pregunta: 'Sant Patllari compta com a cim essencial?',
				resposta:
					"Sí, és un dels [cims essencials](/cims-essencials) del repte i l'únic del Pla de l'Estany. Les condicions per validar-lo són a la [normativa](/repte-100-cims/normativa)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Sant Patllari?',
				resposta:
					'Desde Pujarnol es una subida corta, de unos 224 m de desnivel según el CE Banyoles; la circular por coll Tallat tiene 6,1 km y unas 2 h 30 min en total. Desde el lago de Banyoles, la ruta larga son unas 4 h 50 min.'
			},
			{
				pregunta: '¿Se puede subir a Sant Patllari con niños?',
				resposta:
					'Sí: desde Pujarnol son pistas y senderos de bosque, con algún tramo empinado pero sin pasos difíciles, y el desnivel es moderado. Arriba están la ermita y el refugio para hacer una parada.'
			},
			{
				pregunta: '¿Qué es la Pedra de la Mà de Déu?',
				resposta:
					'Es una roca del camino de Pujarnol a Sant Patllari con una forma que recuerda la huella de una mano, que la leyenda local atribuye a Dios. Es una de las curiosidades de la subida.'
			},
			{
				pregunta: '¿Sant Patllari cuenta como cima esencial?',
				resposta:
					"Sí, es una de las [cimas esenciales](/cims-essencials) del reto y la única del Pla de l'Estany. Las condiciones para validarla están en la [normativa](/repte-100-cims/normativa)."
			}
		]
	},
	fonts: [VIQUIPEDIA, CEC_BANYOLES, COSTA_BRAVA, TURISME_PLA_ESTANY],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
