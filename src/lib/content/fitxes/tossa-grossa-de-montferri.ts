import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Tossa Grossa de Montferri',
	url: 'https://ca.wikipedia.org/wiki/Tossa_Grossa_de_Montferri',
	consultat: CONSULTAT
};

const DERUTAENRUTA = {
	nom: 'De ruta en ruta: la Tossa Grossa de Montferri',
	url: 'https://www.derutaenruta.com/es/rutes/tossa-grossa-montferri',
	consultat: CONSULTAT
};

const NENES = {
	nom: 'Con los niños a cuestas: Tossa Grossa de Montferri',
	url: 'https://conlosnenesacuestas.blogspot.com/2017/05/tossa-grossa-de-montferri.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tossa-grossa-de-montferri',
	descripcio: {
		ca: [
			"La Tossa Grossa de Montferri és un turó de dolomies i calcàries que domina el poble de Montferri, [a l'Alt Camp](/comarques/alt-camp). És el punt culminant d'una petita serra coberta de pinedes i envoltada de vinyes, oliveres i marges de pedra seca. El cim el marca un vèrtex geodèsic.",
			"El que fa singular aquesta excursió és el patrimoni que hi ha pel camí. Molt a prop del cim, sobre la mateixa carena, s'alça la Torre del Moro, una torre de guaita cilíndrica d'uns 8 metres, a 376 m d'altitud segons De ruta en ruta. I a la sortida, el santuari de la Mare de Déu de Montserrat de Montferri, obra modernista de Josep Maria Jujol, deixeble de Gaudí, que amb les seves columnes i cúpules evoca la silueta de la muntanya de Montserrat. Val la pena combinar-hi la visita.",
			"Des de dalt es veu tota la plana de l'Alt Camp, tancada per la serra del Montmell, on hi ha [la Talaia del Montmell](/cims/talaia-del-montmell), i pel massís de Bonastre, on hi ha [la Mola](/cims/la-mola-tarragones), el sostre del Tarragonès. En dies clars, cap a l'oest es distingeixen els relleus del Montsant.",
			"A l'estiu, la pujada es fa pesada amb la calor i convé sortir d'hora; després de pluja, el sender pedregós de la pujada rellisca. La primavera i la tardor són les millors èpoques."
		],
		es: [
			'La Tossa Grossa de Montferri es una loma de dolomías y calizas que domina el pueblo de Montferri, [en el Alt Camp](/comarques/alt-camp). Es el punto culminante de una pequeña sierra cubierta de pinares y rodeada de viñas, olivos y márgenes de piedra seca. La cima la marca un vértice geodésico.',
			'Lo que hace singular esta excursión es el patrimonio que hay por el camino. Muy cerca de la cima, sobre la misma cresta, se alza la Torre del Moro, una torre de vigía cilíndrica de unos 8 metros, a 376 m de altitud según De ruta en ruta. Y en la salida, el santuario de la Mare de Déu de Montserrat de Montferri, obra modernista de Josep Maria Jujol, discípulo de Gaudí, que con sus columnas y cúpulas evoca la silueta de la montaña de Montserrat. Vale la pena combinar la visita.',
			'Desde arriba se ve toda la llanura del Alt Camp, cerrada por la sierra del Montmell, donde está [la Talaia del Montmell](/cims/talaia-del-montmell), y por el macizo de Bonastre, donde está [la Mola](/cims/la-mola-tarragones), el techo del Tarragonès. En días claros, hacia el oeste se distinguen los relieves del Montsant.',
			'En verano, la subida se hace pesada con el calor y conviene salir temprano; después de llover, el sendero pedregoso de la subida resbala. La primavera y el otoño son las mejores épocas.'
		]
	},
	rutes: [
		{
			id: 'santuari-montferri',
			nom: {
				ca: 'Circular des del santuari de Montferri per la Torre del Moro',
				es: 'Circular desde el santuario de Montferri por la Torre del Moro'
			},
			sortida: { nom: 'Santuari de la Mare de Déu de Montserrat (Montferri)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "El primer tram és gairebé pla, entre camps de conreu. Després el camí entra a la pineda i s'enfila per un sender cada vegada més pedregós i descompost fins a la carena, que és el tram més dret. Dalt, es gira a l'esquerra per la carena fins a la Torre del Moro i el cim, i es baixa resseguint la cresta, amb pujades i baixades. De ruta en ruta hi dona 8,7 km i 360 m de desnivell, unes 3 h en total.",
				es: 'El primer tramo es casi llano, entre campos de cultivo. Después el camino entra en el pinar y sube por un sendero cada vez más pedregoso y descompuesto hasta la cresta, que es el tramo más empinado. Arriba, se gira a la izquierda por la cresta hasta la Torre del Moro y la cima, y se baja siguiendo la cresta, con subidas y bajadas. De ruta en ruta le da 8,7 km y 360 m de desnivel, unas 3 h en total.'
			},
			fonts: [DERUTAENRUTA, NENES]
		}
	],
	consells: {
		ca: [
			'El santuari de Jujol només obre en horaris limitats: consulta-ho abans si el vols visitar per dins.',
			'La Torre del Moro té uns graons metàl·lics molt separats: amb nens, vigila o deixa-ho per a més endavant.',
			'Amb canalla petita, la ruta té dreceres que escurcen la volta; el tram més dur és la pujada pedregosa fins a la carena.',
			'Porta aigua i protecció solar: fora de la pineda hi ha poca ombra.',
			'Respecta els conreus i els marges de pedra seca dels primers quilòmetres.'
		],
		es: [
			'El santuario de Jujol solo abre en horarios limitados: consúltalo antes si quieres visitarlo por dentro.',
			'La Torre del Moro tiene unos peldaños metálicos muy separados: con niños, vigila o déjalo para más adelante.',
			'Con niños pequeños, la ruta tiene atajos que acortan la vuelta; el tramo más duro es la subida pedregosa hasta la cresta.',
			'Lleva agua y protección solar: fuera del pinar hay poca sombra.',
			'Respeta los cultivos y los márgenes de piedra seca de los primeros kilómetros.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a fer la ruta de la Tossa Grossa de Montferri?',
				resposta:
					'La volta circular des del santuari fa 8,7 km i 360 m de desnivell, unes 3 h en total segons De ruta en ruta. Si hi vas amb nens i amb parades, compta mig dia.'
			},
			{
				pregunta: 'Es pot pujar a la Tossa Grossa de Montferri amb nens?',
				resposta:
					'Sí, és una ruta habitual per a famílies. El tram més exigent és la pujada per un sender pedregós fins a la carena; dalt, la Torre del Moro i les vistes fan de premi.'
			},
			{
				pregunta: 'Què és la Torre del Moro?',
				resposta:
					"És una antiga torre de guaita cilíndrica, d'uns 8 metres, situada a la carena molt a prop del cim. S'hi pot pujar per uns graons metàl·lics, molt separats entre ells."
			},
			{
				pregunta: 'La Tossa Grossa de Montferri és un cim essencial?',
				resposta:
					'Sí. L’Alt Camp en té tres, la Tossa Grossa de Montferri, el Cogulló de Cabra i el Tossal Gros, i aquest, amb 387 m, és el més modest. Al cim que compta hi ha el vèrtex geodèsic, no a la Torre del Moro.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en hacer la ruta de la Tossa Grossa de Montferri?',
				resposta:
					'La vuelta circular desde el santuario tiene 8,7 km y 360 m de desnivel, unas 3 h en total según De ruta en ruta. Si vas con niños y con paradas, cuenta media jornada.'
			},
			{
				pregunta: '¿Se puede subir a la Tossa Grossa de Montferri con niños?',
				resposta:
					'Sí, es una ruta habitual para familias. El tramo más exigente es la subida por un sendero pedregoso hasta la cresta; arriba, la Torre del Moro y las vistas hacen de premio.'
			},
			{
				pregunta: '¿Qué es la Torre del Moro?',
				resposta:
					'Es una antigua torre de vigía cilíndrica, de unos 8 metros, situada en la cresta muy cerca de la cima. Se puede subir por unos peldaños metálicos, muy separados entre sí.'
			},
			{
				pregunta: '¿La Tossa Grossa de Montferri es una cima esencial?',
				resposta:
					'Sí. El Alt Camp tiene tres, la Tossa Grossa de Montferri, el Cogulló de Cabra y el Tossal Gros, y esta, con 387 m, es la más modesta. En la cima que cuenta está el vértice geodésico, no en la Torre del Moro.'
			}
		]
	},
	fonts: [VIQUIPEDIA, DERUTAENRUTA, NENES],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
