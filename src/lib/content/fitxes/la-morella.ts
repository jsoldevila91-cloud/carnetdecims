import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: La Morella (Begues)',
	url: 'https://ca.wikipedia.org/wiki/La_Morella_(Begues)',
	consultat: CONSULTAT
};

const DIBA_GR92 = {
	nom: 'Diputació de Barcelona, itineraris senyalitzats: GR 92 Sender del Mediterrani, de la Pleta a la Morella',
	url: 'https://itineraris-senyalitzats.diba.cat/routes/view/gr-92-sender-del-mediterrani-de-la-pleta-a-la-morella',
	consultat: CONSULTAT
};

const BEGUES = {
	nom: 'Ajuntament de Begues: Itinerari pel Parc del Garraf',
	url: 'https://www.begues.cat/begues/llocs-dinteres/itineraris/itinerari-pel-parc-del-garraf.html',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: la Morella al massís del Garraf',
	url: 'https://totnens.cat/que-fem/la-morella-el-cim-del-massis-del-garraf-amb-nens/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'la-morella',
	descripcio: {
		ca: [
			'La Morella és un dels cims culminants del massís del Garraf, al terme de Begues ([Baix Llobregat](/comarques/baix-llobregat)) i dins del Parc del Garraf. Segons la Viquipèdia, és el segon més alt del massís, després del Montau. És un paisatge de roca calcària, gairebé sense ombra. A la mateixa comarca, [Sant Ramon](/cims/sant-ramon) i [Sant Pere Màrtir](/cims/sant-pere-martir) són altres cims essencials.',
			"El Garraf és un paisatge càrstic, i el camí de la Morella n'és una bona mostra. La Diputació de Barcelona hi assenyala rasclers, dolines i avencs; Totnens en visita dos pel camí, l'avenc Emili Sabater, de 46 m de fondària, i l'avenc del Llamp, de 73 m. La roca, explica la Viquipèdia, és calcària amb intercalacions de dolomies del Cretaci inferior. Al cim hi ha un vèrtex geodèsic.",
			"La vista és de mar i de plana. Totnens hi descriu el delta del Llobregat fins a Barcelona, i l'Ajuntament de Begues, que proposa una volta llarga pel massís amb la Morella com a punt més alt, hi afegeix la plana de Begues, l'interior del Garraf i, en dies clars, el Canigó.",
			"Val més evitar l'estiu: gairebé no hi ha ombra en tot el recorregut, i Totnens desaconsella fer-la en plena calor. La resta de l'any, és una sortida de mig dia."
		],
		es: [
			'La Morella es una de las cimas culminantes del macizo del Garraf, en el término de Begues ([Baix Llobregat](/comarques/baix-llobregat)) y dentro del Parc del Garraf. Según la Viquipèdia, es la segunda más alta del macizo, tras el Montau. Es un paisaje de roca caliza, casi sin sombra. En la misma comarca, [Sant Ramon](/cims/sant-ramon) y [Sant Pere Màrtir](/cims/sant-pere-martir) son otras cimas esenciales.',
			'El Garraf es un paisaje kárstico, y el camino de la Morella es una buena muestra. La Diputació de Barcelona señala lapiaces, dolinas y simas; Totnens visita dos por el camino, el avenc Emili Sabater, de 46 m de profundidad, y el avenc del Llamp, de 73 m. La roca, explica la Viquipèdia, es caliza con intercalaciones de dolomías del Cretácico inferior. En la cima hay un vértice geodésico.',
			'La vista es de mar y de llanura. Totnens describe el delta del Llobregat hasta Barcelona, y el Ayuntamiento de Begues, que propone una vuelta larga por el macizo con la Morella como punto más alto, añade la llanura de Begues, el interior del Garraf y, en días claros, el Canigó.',
			'Es mejor evitar el verano: casi no hay sombra en todo el recorrido, y Totnens desaconseja hacerla en pleno calor. El resto del año, es una salida de medio día.'
		]
	},
	rutes: [
		{
			id: 'la-pleta',
			nom: {
				ca: 'Des de la Pleta pel GR 92',
				es: 'Desde la Pleta por el GR 92'
			},
			sortida: { nom: "Centre d'Informació la Pleta (Parc del Garraf)" },
			distanciaKm: 3.5,
			tecnicitat: 'cap',
			descripcio: {
				ca: "És un tram del GR 92, el Sender del Mediterrani, que la Diputació de Barcelona publica com a itinerari senyalitzat: 3,5 km, dificultat baixa i una durada aproximada de 2 h 30 min, una excursió molt fàcil i de desnivell suau. El primer quilòmetre, de la Pleta al pla de Querol, va per una carretera asfaltada; d'allà una pista tancada al trànsit i, al final, un sender estret porten al cim seguint les marques blanques i vermelles. Totnens, que la fa anant i tornant pel mateix camí, hi compta 7 km i 3 h 15 min amb parades.",
				es: 'Es un tramo del GR 92, el Sender del Mediterrani, que la Diputació de Barcelona publica como itinerario señalizado: 3,5 km, dificultad baja y una duración aproximada de 2 h 30 min, una excursión muy fácil y de desnivel suave. El primer kilómetro, de la Pleta al pla de Querol, va por una carretera asfaltada; desde allí una pista cerrada al tráfico y, al final, un sendero estrecho llevan a la cima siguiendo las marcas blancas y rojas. Totnens, que la hace yendo y volviendo por el mismo camino, cuenta 7 km y 3 h 15 min con paradas.'
			},
			fonts: [DIBA_GR92, TOTNENS, VIQUIPEDIA]
		}
	],
	consells: {
		ca: [
			"La Diputació de Barcelona recomana fer amb el cotxe el tram de la Pleta al pla de Querol, d'un quilòmetre: és una pista asfaltada de trànsit intens i poca visibilitat.",
			'Hi ha avencs a tocar del camí i, segons Totnens, no tots estan senyalitzats: no surtis del sender i porta la canalla de la mà.',
			'Porta calçat adequat i aigua, sobretot els mesos de calor, com demana la Diputació: pràcticament no hi ha ombra.',
			'La Diputació suggereix portar prismàtics per observar la fauna i gaudir de les panoràmiques.',
			"Per la banda de Castelldefels també s'hi puja, pel sender local SL-C 99, de 6,1 km, que surt de Cal Ganxo, segons la Viquipèdia."
		],
		es: [
			'La Diputació de Barcelona recomienda hacer en coche el tramo de la Pleta al pla de Querol, de un kilómetro: es una pista asfaltada de tráfico intenso y poca visibilidad.',
			'Hay simas junto al camino y, según Totnens, no todas están señalizadas: no te salgas del sendero y lleva a los niños de la mano.',
			'Lleva calzado adecuado y agua, sobre todo en los meses de calor, como pide la Diputació: prácticamente no hay sombra.',
			'La Diputació sugiere llevar prismáticos para observar la fauna y disfrutar de las panorámicas.',
			'Por el lado de Castelldefels también se sube, por el sendero local SL-C 99, de 6,1 km, que sale de Cal Ganxo, según la Viquipèdia.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Morella des de la Pleta?',
				resposta:
					"La Diputació de Barcelona dona una durada aproximada de 2 h 30 min per a l'itinerari de 3,5 km. Totnens, amb nens i parades, compta 3 h 15 min per als 7 km d'anada i tornada."
			},
			{
				pregunta: 'Es pot pujar a la Morella amb nens?',
				resposta:
					'Sí: la Diputació la descriu com una excursió molt fàcil i de desnivell suau, i Totnens com una ruta senzilla per fer en família. Cal vigilar dues coses: els avencs del voltant del camí i el sol.'
			},
			{
				pregunta: 'La Morella és el cim més alt del Garraf?',
				resposta:
					"És el segon, segons la Viquipèdia, després del Montau. L'Ajuntament de Begues, però, en parla com del punt més alt del seu itinerari pel parc."
			},
			{
				pregunta: 'Què són els avencs que es veuen pel camí?',
				resposta:
					"Pous naturals oberts a la roca calcària, típics del relleu càrstic del Garraf. Totnens n'assenyala dos a tocar de l'itinerari: l'Emili Sabater, de 46 m, i el del Llamp, de 73 m."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Morella desde la Pleta?',
				resposta:
					'La Diputació de Barcelona da una duración aproximada de 2 h 30 min para el itinerario de 3,5 km. Totnens, con niños y paradas, cuenta 3 h 15 min para los 7 km de ida y vuelta.'
			},
			{
				pregunta: '¿Se puede subir a la Morella con niños?',
				resposta:
					'Sí: la Diputació la describe como una excursión muy fácil y de desnivel suave, y Totnens como una ruta sencilla para hacer en familia. Hay que vigilar dos cosas: las simas del entorno del camino y el sol.'
			},
			{
				pregunta: '¿La Morella es la cima más alta del Garraf?',
				resposta:
					'Es la segunda, según la Viquipèdia, tras el Montau. El Ayuntamiento de Begues, sin embargo, habla de ella como el punto más alto de su itinerario por el parque.'
			},
			{
				pregunta: '¿Qué son las simas que se ven por el camino?',
				resposta:
					'Pozos naturales abiertos en la roca caliza, típicos del relieve kárstico del Garraf. Totnens señala dos junto al itinerario: el Emili Sabater, de 46 m, y el del Llamp, de 73 m.'
			}
		]
	},
	fonts: [VIQUIPEDIA, DIBA_GR92, BEGUES, TOTNENS],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
