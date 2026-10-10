import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Balandrau',
	url: 'https://ca.wikipedia.org/wiki/Balandrau',
	consultat: CONSULTAT
};

const ENGARRISTA = {
	nom: 'Engarrista: Balandrau i Camí dels Enginyers',
	url: 'https://www.engarrista.com/node/167',
	consultat: CONSULTAT
};

const CIMS_PAISOS_CATALANS = {
	nom: 'Rutes pels cims dels Països Catalans: Balandrau (2.585 m) des de Tregurà',
	url: 'https://cimsdelspaisoscatalans.blogspot.com/2010/01/balandrau-2585-m.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'balandrau',
	descripcio: {
		ca: [
			"El Balandrau és una muntanya de 2.585 m de la serra que separa les valls de Ribes i de Camprodon, entre Queralbs i Vilallonga de Ter, al [Ripollès](/comarques/ripolles). Pertany al Parc Natural de les Capçaleres del Ter i del Freser. És de roques metamòrfiques (esquist, gneis i marbre) i al cim hi ha un vèrtex geodèsic de l'ICGC.",
			"El nom del Balandrau va lligat al 30 de desembre del 2000. Aquell dia, un temporal sobtat, amb ratxes de vent de més de 150 km/h i temperatures extremes, hi va causar set morts; en la mateixa jornada n'hi va haver dos més a la Coma de l'Orri i un a Port Ainé. La Viquipèdia en parla com la tragèdia de muntanya més greu viscuda al Pirineu català, i TV3 la va repassar el 2021 al documental «Balandrau, infern glaçat». La lliçó és clara: a l'hivern, un cim de pendents suaus i ruta coneguda pot ser mortal si el temps es gira.",
			"Des del cim es veuen el Taga al sud i la coma del Freser al nord, amb la Jaça de les Eugues i el Bastiments, segons Engarrista. La ressenya de 2010 de Rutes pels cims dels Països Catalans hi afegeix, al sud, la vall de Ribes, la Cavallera, el Bassegoda, el Puigsacalm, el Montseny i Montserrat; a l'oest, el Cadí, i a l'est, el Canigó. Cap al nord, la mateixa ressenya hi situa la línia de cims del [Puigmal](/cims/puigmal) al [Bastiments](/cims/bastiments).",
			"Segons la Viquipèdia, hi ha una ruta pel nord, des del refugi de Coma de Vaca, i una altra pel sud, des de la collada de Fontlletera. La ressenya de Tregurà recomana la primavera o la tardor, perquè a l'estiu la calor apreta, i per a l'hivern aconsella esquís o raquetes."
		],
		es: [
			'El Balandrau es una montaña de 2.585 m de la sierra que separa los valles de Ribes y de Camprodon, entre Queralbs y Vilallonga de Ter, en el [Ripollès](/comarques/ripolles). Pertenece al Parque Natural de las Capçaleres del Ter i del Freser. Es de rocas metamórficas (esquisto, gneis y mármol) y en la cima hay un vértice geodésico del ICGC.',
			'El nombre del Balandrau va unido al 30 de diciembre de 2000. Aquel día, un temporal repentino, con rachas de viento de más de 150 km/h y temperaturas extremas, causó siete muertes en esta montaña; en la misma jornada hubo dos más en la Coma de l’Orri y una en Port Ainé. La Viquipèdia lo describe como la tragedia de montaña más grave vivida en el Pirineo catalán, y TV3 la repasó en 2021 en el documental «Balandrau, infern glaçat». La lección es clara: en invierno, una cima de pendientes suaves y ruta conocida puede ser mortal si el tiempo se tuerce.',
			'Desde la cima se ven el Taga al sur y la coma del Freser al norte, con la Jaça de les Eugues y el Bastiments, según Engarrista. La reseña de 2010 de Rutes pels cims dels Països Catalans añade, al sur, el valle de Ribes, la Cavallera, el Bassegoda, el Puigsacalm, el Montseny y Montserrat; al oeste, el Cadí, y al este, el Canigó. Hacia el norte, la misma reseña sitúa la línea de cimas del [Puigmal](/cims/puigmal) al [Bastiments](/cims/bastiments).',
			'Según la Viquipèdia, hay una ruta por el norte, desde el refugio de Coma de Vaca, y otra por el sur, desde el collado de Fontlletera. La reseña de Tregurà recomienda la primavera o el otoño, porque en verano el calor aprieta, y para el invierno aconseja esquís o raquetas.'
		]
	},
	rutes: [
		{
			id: 'coma-de-vaca',
			nom: {
				ca: 'Des de Queralbs per les gorges del Freser i Coma de Vaca',
				es: 'Desde Queralbs por las gargantas del Freser y Coma de Vaca'
			},
			sortida: { nom: 'Pont de Daió (Queralbs)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Engarrista surt del petit aparcament de la central del Daió, travessa la passarel·la i segueix el riu Freser per les gorges, passant pel salt del Grill, fins al refugi de Coma de Vaca, en 1 h 45 min. Allà deixa el camí i puja molt dret, sense traça clara, al cim. Es baixa per la carena al coll dels Tres Pics i es torna a Coma de Vaca. La jornada d'Engarrista, que seguia pel camí dels Enginyers fins a Núria i baixava a Queralbs, va sumar unes 9 h comptant parades i més de 1.900 m de pujada.",
				es: 'Engarrista sale del pequeño aparcamiento de la central del Daió, cruza la pasarela y sigue el río Freser por las gargantas, pasando por el salt del Grill, hasta el refugio de Coma de Vaca, en 1 h 45 min. Allí deja el camino y sube muy empinado, sin traza clara, a la cima. Se baja por la cresta al coll dels Tres Pics y se vuelve a Coma de Vaca. La jornada de Engarrista, que seguía por el camí dels Enginyers hasta Núria y bajaba a Queralbs, sumó unas 9 h contando paradas y más de 1.900 m de subida.'
			},
			fonts: [ENGARRISTA]
		},
		{
			id: 'tregura',
			nom: {
				ca: 'Des de Tregurà per la collada de Fontlletera',
				es: 'Desde Tregurà por la collada de Fontlletera'
			},
			sortida: { nom: 'Pista forestal de Tregurà (≈ 1.975 m)' },
			desnivellPositiuM: 700,
			tempsMinuts: 115,
			descripcio: {
				ca: "La ressenya de 2010 descriu la via del sud: des de Tregurà, una pista forestal d'uns 6,5 km amb una barrera, i després un camí per la collada de Fontlletera (2.125 m), la font Lletera (2.255 m), el coll dels Tres Pics (2.385 m) i el cim dels Tres Pics, fins al Balandrau. L'autor hi arriba en 1 h 55 min, amb uns 700 m de desnivell, i baixa pel mateix camí en 1 h 15 min. Avisa que, si entra la boira, és un terreny on és fàcil perdre's i que no hi ha aigua pel camí.",
				es: 'La reseña de 2010 describe la vía del sur: desde Tregurà, una pista forestal de unos 6,5 km con una barrera, y luego un camino por la collada de Fontlletera (2.125 m), la font Lletera (2.255 m), el coll dels Tres Pics (2.385 m) y la cima dels Tres Pics, hasta el Balandrau. El autor llega en 1 h 55 min, con unos 700 m de desnivel, y baja por el mismo camino en 1 h 15 min. Avisa de que, si entra la niebla, es un terreno donde es fácil perderse y de que no hay agua por el camino.'
			},
			fonts: [CIMS_PAISOS_CATALANS]
		}
	],
	consells: {
		ca: [
			"A l'hivern, no hi pugis amb previsió de vent o torb: el 30 de desembre del 2000 hi va haver set morts per ventades de més de 150 km/h. Si el pronòstic anuncia un canvi de temps, deixa-ho per a un altre dia.",
			"Si entra la boira, gira cua aviat: la ressenya de Tregurà avisa que el terreny, obert i sense referències, es presta a perdre's.",
			'A la via del sud no hi ha aigua: porta tot el que necessitis. Per la via de Coma de Vaca, el refugi és un punt de suport.',
			"La pista forestal de Tregurà té una barrera a l'encreuament i no hi ha aparcament habilitat: deixa el cotxe a la vora sense tapar el pas."
		],
		es: [
			'En invierno, no subas con previsión de viento o ventisca: el 30 de diciembre de 2000 hubo siete muertes por rachas de más de 150 km/h. Si el pronóstico anuncia un cambio de tiempo, déjalo para otro día.',
			'Si entra la niebla, date la vuelta pronto: la reseña de Tregurà avisa de que el terreno, abierto y sin referencias, se presta a perderse.',
			'En la vía del sur no hay agua: lleva todo lo que necesites. Por la vía de Coma de Vaca, el refugio es un punto de apoyo.',
			'La pista forestal de Tregurà tiene una barrera en el cruce y no hay aparcamiento habilitado: deja el coche al borde sin tapar el paso.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Balandrau?',
				resposta:
					'Segons Rutes pels cims dels Països Catalans, 1 h 55 min de pujada i 1 h 15 min de baixada des de la pista de Tregurà, amb uns 700 m de desnivell. Des de Queralbs per les gorges del Freser és una jornada molt més llarga: Engarrista arriba al refugi de Coma de Vaca en 1 h 45 min i encara li queda tota la pujada al cim.'
			},
			{
				pregunta: 'És una ruta tècnica?',
				resposta:
					"Les fonts consultades no esmenten passos d'escalada, però hi ha trams de pujada forta sense traça clara i, amb boira o torb, orientar-se és complicat."
			},
			{
				pregunta: "Es pot pujar a l'hivern?",
				resposta:
					"La ressenya de Tregurà hi aconsella esquís o raquetes, però és terreny d'alta muntanya hivernal: només amb bona previsió, material i experiència. El temporal del 30 de desembre del 2000 hi va causar set morts."
			},
			{
				pregunta: 'El Balandrau compta com a cim essencial?',
				resposta:
					'Sí. És el tercer dels sis essencials del Ripollès per altitud, per sota del [Puigmal](/cims/puigmal) i del [Bastiments](/cims/bastiments).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Balandrau?',
				resposta:
					'Según Rutes pels cims dels Països Catalans, 1 h 55 min de subida y 1 h 15 min de bajada desde la pista de Tregurà, con unos 700 m de desnivel. Desde Queralbs por las gargantas del Freser es una jornada mucho más larga: Engarrista llega al refugio de Coma de Vaca en 1 h 45 min y aún le queda toda la subida a la cima.'
			},
			{
				pregunta: '¿Es una ruta técnica?',
				resposta:
					'Las fuentes consultadas no mencionan pasos de escalada, pero hay tramos de subida fuerte sin traza clara y, con niebla o ventisca, orientarse es complicado.'
			},
			{
				pregunta: '¿Se puede subir en invierno?',
				resposta:
					'La reseña de Tregurà aconseja esquís o raquetas, pero es terreno de alta montaña invernal: solo con buena previsión, material y experiencia. El temporal del 30 de diciembre de 2000 causó allí siete muertes.'
			},
			{
				pregunta: '¿El Balandrau cuenta como cima esencial?',
				resposta:
					'Sí. Es la tercera de las seis esenciales del Ripollès por altitud, por debajo del [Puigmal](/cims/puigmal) y del [Bastiments](/cims/bastiments).'
			}
		]
	},
	fonts: [VIQUIPEDIA, ENGARRISTA, CIMS_PAISOS_CATALANS],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
