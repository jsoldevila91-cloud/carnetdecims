import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-03';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Matagalls',
	url: 'https://ca.wikipedia.org/wiki/Matagalls',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: Matagalls des de Collformic',
	url: 'https://totnens.cat/que-fem/matagalls-des-de-collformic/',
	consultat: CONSULTAT
};

const DERUTAENRUTA = {
	nom: 'De ruta en ruta: el Matagalls per Collformic',
	url: 'https://www.derutaenruta.com/ca/rutes/collformic-matagalls',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'matagalls',
	descripcio: {
		ca: [
			"El Matagalls és el cim del Montseny que mira a [Osona](/comarques/osona). La seva carena reparteix els termes del Brull i Viladrau amb el de Montseny, al Vallès Oriental, i forma part del Parc Natural del Montseny. És el tercer cim més alt del massís, després del Turó de l'Home i de [les Agudes](/cims/les-agudes), i el seu perfil arrodonit, pelat a la part alta pel vent, es reconeix des de tota la plana de Vic.",
			"Al cim hi ha una gran creu dedicada a mossèn Cinto Verdaguer, un vèrtex geodèsic i una placa en record de Jaume Oliveras i Brossa, l'excursionista que va inspirar la travessa Matagalls-Montserrat, una caminada d'un dia que uneix les dues muntanyes. El segon diumenge de juliol s'hi celebra l'Aplec del Matagalls, amb més de setanta edicions. A finals del segle XVIII, el cim també va servir de punt de triangulació en la mesura del meridià de Dunkerque a Barcelona.",
			'La vista és de les més completes de la Catalunya central: la plana de Vic i les Guilleries als peus, el Pirineu en dies clars, i cap al sud la resta del Montseny i les serralades del Vallès. Molt a prop hi ha també el [Tagamanent](/cims/tagamanent), un altre cim essencial del massís.',
			"Es pot pujar tot l'any. A l'hivern la part alta pot tenir neu i gel, i a la carena hi bufa sovint un vent fort i fred; a l'estiu, en canvi, és un bon refugi de la calor de la plana. A la tardor les fagedes del vessant de Viladrau són especialment boniques."
		],
		es: [
			"El Matagalls es la cima del Montseny que mira a [Osona](/comarques/osona). Su cresta reparte los municipios de el Brull y Viladrau con el de Montseny, en el Vallès Oriental, y forma parte del Parque Natural del Montseny. Es la tercera cima más alta del macizo, tras el Turó de l'Home y [les Agudes](/cims/les-agudes), y su perfil redondeado, pelado en la parte alta por el viento, se reconoce desde toda la llanura de Vic.",
			'En la cima hay una gran cruz dedicada a mosén Cinto Verdaguer, un vértice geodésico y una placa en recuerdo de Jaume Oliveras i Brossa, el excursionista que inspiró la travesía Matagalls-Montserrat, una caminata de un día que une las dos montañas. El segundo domingo de julio se celebra el Aplec del Matagalls, con más de setenta ediciones. A finales del siglo XVIII, la cima también sirvió de punto de triangulación en la medición del meridiano de Dunkerque a Barcelona.',
			'La vista es de las más completas de la Cataluña central: la llanura de Vic y las Guilleries a los pies, el Pirineo en días claros y, hacia el sur, el resto del Montseny y las sierras del Vallès. Muy cerca está también el [Tagamanent](/cims/tagamanent), otra cima esencial del macizo.',
			'Se puede subir todo el año. En invierno la parte alta puede tener nieve y hielo, y en la cresta sopla a menudo un viento fuerte y frío; en verano, en cambio, es un buen refugio del calor de la llanura. En otoño los hayedos de la vertiente de Viladrau son especialmente bonitos.'
		]
	},
	rutes: [
		{
			id: 'collformic',
			nom: { ca: 'Des de Collformic pel GR 5.2', es: 'Desde Collformic por el GR 5.2' },
			sortida: { nom: 'Collformic (el Brull)' },
			desnivellPositiuM: 555,
			distanciaKm: 3.6,
			tempsMinuts: 75,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: 'És la pujada més directa i concorreguda. Comença amb unes escales de pissarra, passa per la creu Carlina, el pla de la Barraca, un antic pou de glaç i la font del Matagalls, i acaba per un llom pelat fins a la creu. Tot el camí segueix les marques del GR 5.2.',
				es: 'Es la subida más directa y concurrida. Empieza con unos escalones de pizarra, pasa por la cruz Carlina, el pla de la Barraca, un antiguo pozo de nieve y la fuente del Matagalls, y termina por un lomo pelado hasta la cruz. Todo el camino sigue las marcas del GR 5.2.'
			},
			fonts: [TOTNENS, VIQUIPEDIA]
		},
		{
			id: 'collformic-sant-segimon',
			nom: { ca: 'Circular per Sant Segimon', es: 'Circular por Sant Segimon' },
			sortida: { nom: 'Collformic (el Brull)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: 'Variant circular de 9,8 km i 660 m de desnivell (unes 4 h 15 min amb parades), segons De ruta en ruta: es puja pel GR 5.2 i es baixa pel PR-C 205 cap al santuari de Sant Segimon, encastat a la roca del vessant de Viladrau.',
				es: 'Variante circular de 9,8 km y 660 m de desnivel (unas 4 h 15 min con paradas), según De ruta en ruta: se sube por el GR 5.2 y se baja por el PR-C 205 hacia el santuario de Sant Segimon, encajado en la roca de la vertiente de Viladrau.'
			},
			fonts: [DERUTAENRUTA, TOTNENS]
		}
	],
	consells: {
		ca: [
			"L'aparcament de Collformic s'omple els caps de setmana: arriba d'hora o evita les hores punta.",
			"Porta una capa d'abric encara que faci bo a baix: al cim hi pot bufar un vent molt fred.",
			'Amb boira, el llom de dalt és ample i sense referències; segueix les marques del GR 5.2.',
			"A l'hivern, amb glaç, unes cadenes o crampons lleugers fan la pujada molt més segura.",
			"És un parc natural molt freqüentat: no surtis dels camins, emporta't les deixalles i consulta la normativa del parc."
		],
		es: [
			'El aparcamiento de Collformic se llena los fines de semana: llega temprano o evita las horas punta.',
			'Lleva una capa de abrigo aunque abajo haga bueno: en la cima puede soplar un viento muy frío.',
			'Con niebla, el lomo de arriba es ancho y sin referencias; sigue las marcas del GR 5.2.',
			'En invierno, con hielo, unas cadenas o crampones ligeros hacen la subida mucho más segura.',
			'Es un parque natural muy frecuentado: no salgas de los caminos, llévate tus residuos y consulta la normativa del parque.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Matagalls des de Collformic?',
				resposta:
					"Al voltant d'1 h 15 min per uns 3,6 km i uns 555 m de desnivell, segons Totnens i la Viquipèdia. Amb la baixada pel mateix camí, la sortida sencera es fa en una matinal."
			},
			{
				pregunta: 'Es pot pujar al Matagalls amb nens?',
				resposta:
					'Sí. És una de les pujades clàssiques per a famílies que ja caminen una mica: el camí és clar i ben marcat, tot i que el pendent és constant i a dalt pot fer fred i vent.'
			},
			{
				pregunta: 'Què és la Matagalls-Montserrat?',
				resposta:
					"És una travessa a peu que uneix el cim del Matagalls amb Montserrat en una sola jornada, inspirada per l'excursionista Jaume Oliveras i Brossa, que té una placa al cim. Si t'interessa l'altre extrem, mira la fitxa de [Sant Jeroni](/cims/sant-jeroni)."
			},
			{
				pregunta: 'El Matagalls és un cim essencial?',
				resposta: 'Sí, és un dels [cims essencials](/cims-essencials) del repte.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Matagalls desde Collformic?',
				resposta:
					'Alrededor de 1 h 15 min para unos 3,6 km y unos 555 m de desnivel, según Totnens y la Viquipèdia. Bajando por el mismo camino, la salida completa cabe en una mañana.'
			},
			{
				pregunta: '¿Se puede subir al Matagalls con niños?',
				resposta:
					'Sí. Es una de las subidas clásicas para familias que ya caminan algo: el camino es claro y está bien marcado, aunque la pendiente es constante y arriba puede hacer frío y viento.'
			},
			{
				pregunta: '¿Qué es la Matagalls-Montserrat?',
				resposta:
					'Es una travesía a pie que une la cima del Matagalls con Montserrat en una sola jornada, inspirada por el excursionista Jaume Oliveras i Brossa, que tiene una placa en la cima. Si te interesa el otro extremo, mira la ficha de [Sant Jeroni](/cims/sant-jeroni).'
			},
			{
				pregunta: '¿El Matagalls es una cima esencial?',
				resposta: 'Sí, es una de las [cimas esenciales](/cims-essencials) del reto.'
			}
		]
	},
	wikiloc: [
		{
			id: 6797802,
			titol: 'Cim Matagalls des de Collformic, pel GR 5.2',
			url: 'https://ca.wikiloc.com/rutes-senderisme/cim-matagalls-des-de-collformic-pel-gr-5-2-6797802'
		},
		{
			id: 1603049,
			titol: 'Collformic - Matagalls',
			url: 'https://ca.wikiloc.com/rutes-senderisme/collformic-matagalls-1603049'
		}
	],
	fonts: [VIQUIPEDIA, TOTNENS, DERUTAENRUTA],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
