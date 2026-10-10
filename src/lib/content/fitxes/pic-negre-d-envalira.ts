import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VISIT_ANDORRA = {
	nom: "Visit Andorra: ruta de senderisme al pic Negre d'Envalira",
	url: 'https://visitandorra.com/en/nature--sports/hiking-trail-pic-negre-de-envalira/',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: "Rutes Pirineus: estany de les Abelletes i pics d'Envalira",
	url: 'https://www.rutespirineus.cat/rutes/estany-abelletes-i-pics-envalira-pas-de-la-casa',
	consultat: CONSULTAT
};

const WIKIPEDIA = {
	nom: "Wikipedia: Pic Negre d'Envalira",
	url: 'https://en.wikipedia.org/wiki/Pic_Negre_d%27Envalira',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pic-negre-d-envalira',
	descripcio: {
		ca: [
			"El pic Negre d'Envalira és a la carena fronterera entre la parròquia d'Encamp, [a Andorra](/comarques/andorra), i França, just a sobre del Pas de la Casa. És un dels quatre pics d'Envalira, el grup de cims que envolta el port d'Envalira i les pistes de Grau Roig, i té la cara nord tallada en espadats gairebé verticals que cauen cap a Grau Roig.",
			"El punt de partida és ja a més de 2.100 m, i per això, tot i que el cim passa dels 2.800 m, la pujada només suma uns 700 m de desnivell. El camí passa per l'estany de les Abelletes i el coll dels Isards, que segons Visit Andorra deu el nom al pas freqüent d'isards, i puja a prop d'un telecadira de l'estació. Molt a prop hi ha la Portella Blanca, el punt on es troben Andorra, França i l'Estat espanyol.",
			"Des de dalt es dominen els circs glacials del voltant, amb el circ dels Pessons, les crestes del Pirineu oriental i, als peus, el Pas de la Casa i la vall que baixa cap a l'Arieja. Dins d'Andorra, altres cims essencials com el [Casamanya](/cims/casamanya-nord) o el [pic de la Serrera](/cims/pic-de-la-serrera) queden cap al nord-oest.",
			"Visit Andorra recomana pujar-hi entre final de juny i final de setembre, tot i que de maig a octubre també pot ser practicable segons la neu. A la primavera hi pot quedar neu al coll. És terreny d'alta muntanya: a l'estiu, vigila les tempestes de tarda i no t'hi quedis si el cel es carrega."
		],
		es: [
			"El pic Negre d'Envalira está en la cresta fronteriza entre la parroquia de Encamp, [en Andorra](/comarques/andorra), y Francia, justo encima del Pas de la Casa. Es uno de los cuatro picos de Envalira, el grupo de cimas que rodea el port d'Envalira y las pistas de Grau Roig, y su cara norte son paredes casi verticales que caen hacia Grau Roig.",
			'El punto de partida está ya a más de 2.100 m, y por eso, aunque la cima supera los 2.800 m, la subida solo suma unos 700 m de desnivel. El camino pasa por el lago de les Abelletes y el coll dels Isards, que según Visit Andorra debe su nombre al paso frecuente de sarrios, y sube cerca de un telesilla de la estación. Muy cerca está la Portella Blanca, el punto donde se encuentran Andorra, Francia y España.',
			'Desde arriba se dominan los circos glaciares de alrededor, con el circo dels Pessons, las crestas del Pirineo oriental y, a los pies, el Pas de la Casa y el valle que baja hacia el Ariège. Dentro de Andorra, otras cimas esenciales como el [Casamanya](/cims/casamanya-nord) o el [pic de la Serrera](/cims/pic-de-la-serrera) quedan hacia el noroeste.',
			'Visit Andorra recomienda subir entre finales de junio y finales de septiembre, aunque de mayo a octubre también puede ser practicable según la nieve. En primavera puede quedar nieve en el collado. Es terreno de alta montaña: en verano, vigila las tormentas de tarde y no te quedes si el cielo se carga.'
		]
	},
	rutes: [
		{
			id: 'pas-de-la-casa',
			nom: {
				ca: "Des del Pas de la Casa per l'estany de les Abelletes",
				es: 'Desde el Pas de la Casa por el lago de les Abelletes'
			},
			sortida: { nom: 'Pas de la Casa (Encamp, 2.120 m)' },
			desnivellPositiuM: 696,
			distanciaKm: 3.8,
			tempsMinuts: 95,
			tecnicitat: 'cap',
			descripcio: {
				ca: "Del Pas de la Casa se segueixen les marques grogues fins a l'estany de les Abelletes (20 min) i el coll dels Isards (1 h). Després es passa pel port de Fontnegra, es travessa el llom ample de la carena i es flanqueja la pala del pic pel vessant sud per un camí força marcat. Rutes Pirineus situa el cim a 1 h 35 min, i Visit Andorra hi compta 3,83 km i 696 m de desnivell, sense cap dificultat tècnica tot i ser alta muntanya.",
				es: 'Desde el Pas de la Casa se siguen las marcas amarillas hasta el lago de les Abelletes (20 min) y el coll dels Isards (1 h). Después se pasa por el port de Fontnegra, se cruza el lomo ancho de la cresta y se flanquea la pala del pico por la vertiente sur por un camino bastante marcado. Rutes Pirineus sitúa la cima a 1 h 35 min, y Visit Andorra calcula 3,83 km y 696 m de desnivel, sin ninguna dificultad técnica aunque sea alta montaña.'
			},
			fonts: [VISIT_ANDORRA, RUTES_PIRINEUS]
		}
	],
	consells: {
		ca: [
			"Si tens temps, des del cim pots continuar deu minuts fins al pic d'Envalira, el veí, i tornar pel mateix camí, com proposa Rutes Pirineus.",
			'Al coll dels Isards hi arriba una via ferrada: no la confonguis amb el camí; la ruta normal és el sender amb marques grogues.',
			'Amb boira, el llom de la carena és ample i fàcil de perdre: segueix les marques i porta mapa o GPS.',
			"Amb neu, la pala del pic i el coll tenen risc d'allaus: consulta el butlletí del servei meteorològic d'Andorra i porta grampons i piolet."
		],
		es: [
			"Si tienes tiempo, desde la cima puedes seguir diez minutos hasta el pic d'Envalira, el vecino, y volver por el mismo camino, como propone Rutes Pirineus.",
			'Al coll dels Isards llega una vía ferrata: no la confundas con el camino; la ruta normal es el sendero con marcas amarillas.',
			'Con niebla, el lomo de la cresta es ancho y fácil de perder: sigue las marcas y lleva mapa o GPS.',
			'Con nieve, la pala del pico y el collado tienen riesgo de aludes: consulta el boletín del servicio meteorológico de Andorra y lleva crampones y piolet.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Quant es triga a pujar al pic Negre d'Envalira?",
				resposta:
					"Des del Pas de la Casa, 1 h 35 min segons Rutes Pirineus, amb uns 3,8 km i 696 m de desnivell segons Visit Andorra. Anada i tornada, unes 3 h de marxa efectiva sumant-hi el pic d'Envalira."
			},
			{
				pregunta: "El pic Negre d'Envalira és difícil?",
				resposta:
					"Visit Andorra el classifica com a moderat i diu que no té cap dificultat tècnica. El que pesa és l'alçada: el cim passa dels 2.800 m i a la carena hi pot fer molt de vent i fred."
			},
			{
				pregunta: "Es pot pujar al pic Negre d'Envalira amb nens?",
				resposta:
					"Amb nens acostumats a caminar i amb bon temps, és factible: el camí és marcat i sense passos tècnics. Ara bé, són gairebé 700 m de desnivell a més de 2.100 m d'altitud; si no, l'estany de les Abelletes ja és una bona sortida."
			},
			{
				pregunta: "El pic Negre d'Envalira compta com a cim essencial?",
				resposta:
					"Sí. Dels cinc [cims essencials](/cims-essencials) d'Andorra, és el de l'extrem oriental, a tocar de França; els altres són el Comapedrosa, la Serrera, la Tristaina i el [Casamanya](/cims/casamanya-nord)."
			}
		],
		es: [
			{
				pregunta: "¿Cuánto se tarda en subir al pic Negre d'Envalira?",
				resposta:
					"Desde el Pas de la Casa, 1 h 35 min según Rutes Pirineus, con unos 3,8 km y 696 m de desnivel según Visit Andorra. Ida y vuelta, unas 3 h de marcha efectiva sumando el pic d'Envalira."
			},
			{
				pregunta: "¿El pic Negre d'Envalira es difícil?",
				resposta:
					'Visit Andorra lo clasifica como moderado y dice que no tiene ninguna dificultad técnica. Lo que pesa es la altitud: la cima supera los 2.800 m y en la cresta puede hacer mucho viento y frío.'
			},
			{
				pregunta: "¿Se puede subir al pic Negre d'Envalira con niños?",
				resposta:
					'Con niños acostumbrados a caminar y con buen tiempo, es factible: el camino está marcado y sin pasos técnicos. Ahora bien, son casi 700 m de desnivel a más de 2.100 m de altitud; si no, el lago de les Abelletes ya es una buena salida.'
			},
			{
				pregunta: "¿El pic Negre d'Envalira cuenta como cima esencial?",
				resposta:
					'Sí. De las cinco [cimas esenciales](/cims-essencials) de Andorra, es la del extremo oriental, junto a Francia; las otras son el Comapedrosa, la Serrera, la Tristaina y el [Casamanya](/cims/casamanya-nord).'
			}
		]
	},
	fonts: [WIKIPEDIA, VISIT_ANDORRA, RUTES_PIRINEUS],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
