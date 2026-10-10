import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: "Viquipèdia: Torreta de l'Orri",
	url: 'https://ca.wikipedia.org/wiki/Torreta_de_l%27Orri',
	consultat: CONSULTAT
};

const REPTES = {
	nom: "Reptes Muntanyencs: Torreta de l'Orri des de Port Ainé",
	url: 'https://reptesmuntanyencs.cat/torreta-de-lorri-4/',
	consultat: CONSULTAT
};

const GOTERRIS = {
	nom: "Goterris: la Torreta de l'Orri",
	url: 'https://xgoterris.blogspot.com/2020/03/la-torreta-de-lorri.html',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: "Rutes Pirineus: Torreta de l'Orri per les Comes de Rubió",
	url: 'https://www.rutespirineus.cat/rutes/torreta-orri-per-les-comes-de-rubio',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'torreta-de-l-orri',
	descripcio: {
		ca: [
			"La Torreta de l'Orri és el punt més alt del massís de l'Orri, la gran muntanya arrodonida que s'alça entre Sort i la Seu d'Urgell, al sud del Parc Natural de l'Alt Pirineu. El cim és al terme de Soriguera, [al Pallars Sobirà](/comarques/pallars-sobira), i limita amb el de Rialp. Pel vessant nord s'estén l'estació d'esquí de Port Ainé, i pel sud el massís baixa cap a les comes de Rubió i el Port del Cantó, a tocar [de l'Alt Urgell](/comarques/alt-urgell).",
			"És fàcil de reconèixer de lluny per les dues grans antenes de telecomunicacions del cim, al costat d'un vèrtex geodèsic. La roca és de gres i lutites, i el relleu és de pales amples i prats d'alta muntanya, sense les crestes esmolades dels cims veïns del Pirineu axial. La muntanya té fins i tot un lloc a la literatura: part de la novel·la «Una tempesta» (2009), d'Imma Monsó, hi passa.",
			"Com que és una muntanya força aïllada, la vista és molt àmplia: cap al nord, la barrera del Pirineu axial; cap al sud, el Prepirineu, i cap a l'est, la cara nord de la serra del Cadí. És un bon mirador per aprendre a identificar els cims del Pallars i de l'Urgell, amb un esforç moderat si s'hi puja des de l'estació.",
			"Es pot fer gairebé tot l'any. A l'estiu, la pujada des de Port Ainé és curta; a l'hivern, l'estació d'esquí ocupa el vessant i molta gent hi puja amb raquetes, però amb neu cal valorar el perill d'allaus fora de les pistes. El cim és molt exposat al vent: porta roba d'abric fins i tot a l'agost i baixa si s'acosta una tempesta."
		],
		es: [
			"La Torreta de l'Orri es el punto más alto del macizo de l'Orri, la gran montaña redondeada que se alza entre Sort y La Seu d'Urgell, al sur del Parque Natural del Alt Pirineu. La cima está en el término de Soriguera, [en el Pallars Sobirà](/comarques/pallars-sobira), y limita con el de Rialp. Por la vertiente norte se extiende la estación de esquí de Port Ainé, y por el sur el macizo baja hacia las comes de Rubió y el Port del Cantó, junto [al Alt Urgell](/comarques/alt-urgell).",
			'Se reconoce de lejos por las dos grandes antenas de telecomunicaciones de la cima, junto a un vértice geodésico. La roca es de areniscas y lutitas, y el relieve es de laderas amplias y prados de alta montaña, sin las crestas afiladas de las cimas vecinas del Pirineo axial. La montaña tiene incluso un lugar en la literatura: parte de la novela «Una tempesta» (2009), de Imma Monsó, transcurre aquí.',
			'Como es una montaña bastante aislada, la vista es muy amplia: hacia el norte, la barrera del Pirineo axial; hacia el sur, el Prepirineo, y hacia el este, la cara norte de la sierra del Cadí. Es un buen mirador para aprender a identificar las cimas del Pallars y del Urgell, con un esfuerzo moderado si se sube desde la estación.',
			'Se puede hacer casi todo el año. En verano, la subida desde Port Ainé es corta; en invierno, la estación de esquí ocupa la ladera y mucha gente sube con raquetas, pero con nieve hay que valorar el peligro de aludes fuera de las pistas. La cima está muy expuesta al viento: lleva ropa de abrigo incluso en agosto y baja si se acerca una tormenta.'
		]
	},
	rutes: [
		{
			id: 'port-aine',
			nom: {
				ca: "Des de l'estació de Port Ainé",
				es: 'Desde la estación de Port Ainé'
			},
			sortida: { nom: 'Estació de Port Ainé (Rialp, 1.969 m)' },
			tempsMinuts: 92,
			tecnicitat: 'cap',
			descripcio: {
				ca: "És la pujada amb menys desnivell i la que té més sentit en família. S'arriba en cotxe per carretera asfaltada des de Rialp fins a l'estació, i es puja per les pistes d'esquí i el serrat de la Coma del Forn, amb marques grogues, fins al cim. Segons Reptes Muntanyencs, el cim és a 1 h 32 min i la major part del recorregut va per pistes, sense cap pas difícil. El desnivell entre l'estació i el cim és de menys de 500 m.",
				es: 'Es la subida con menos desnivel y la que más sentido tiene en familia. Se llega en coche por carretera asfaltada desde Rialp hasta la estación, y se sube por las pistas de esquí y el serrat de la Coma del Forn, con marcas amarillas, hasta la cima. Según Reptes Muntanyencs, la cima está a 1 h 32 min y la mayor parte del recorrido va por pistas, sin ningún paso difícil. El desnivel entre la estación y la cima es de menos de 500 m.'
			},
			fonts: [REPTES, GOTERRIS]
		},
		{
			id: 'rubio',
			nom: {
				ca: 'Des de Rubió pel refugi de les Comes de Rubió',
				es: 'Desde Rubió por el refugio de las Comes de Rubió'
			},
			sortida: { nom: 'Rubió (Soriguera, 1.648 m)' },
			tempsMinuts: 240,
			descripcio: {
				ca: 'Pel vessant sud, Rutes Pirineus proposa sortir del poble de Rubió, a la carretera del Port del Cantó, i pujar per pista i camí fins al refugi de les Comes de Rubió (1 h 30 min) i el coll de Rubió, i després pels prats de la carena fins al cim (4 h en total). És una sortida molt més llarga, de les que no es recomanen amb nens petits.',
				es: 'Por la vertiente sur, Rutes Pirineus propone salir del pueblo de Rubió, en la carretera del Port del Cantó, y subir por pista y camino hasta el refugio de las Comes de Rubió (1 h 30 min) y el coll de Rubió, y después por los prados de la cresta hasta la cima (4 h en total). Es una salida mucho más larga, de las que no se recomiendan con niños pequeños.'
			},
			fonts: [RUTES_PIRINEUS]
		}
	],
	consells: {
		ca: [
			"Les marques grogues de la pujada des de Port Ainé no sempre es veuen bé entre les pistes: amb boira, orienta't amb les antenes del cim i un mapa.",
			"Al cim gairebé sempre hi fa vent. Porta una capa i alguna cosa d'abric, també a l'estiu.",
			"A l'hivern, si hi puges amb raquetes, respecta les pistes obertes als esquiadors i consulta el perill d'allaus abans de sortir de l'àrea esquiable.",
			'El refugi de les Comes de Rubió, guardat, és una bona base si vols fer la ruta llarga des del sud o repartir-la en dos dies.'
		],
		es: [
			'Las marcas amarillas de la subida desde Port Ainé no siempre se ven bien entre las pistas: con niebla, oriéntate con las antenas de la cima y un mapa.',
			'En la cima casi siempre sopla el viento. Lleva un cortavientos y algo de abrigo, también en verano.',
			'En invierno, si subes con raquetas, respeta las pistas abiertas a los esquiadores y consulta el peligro de aludes antes de salir del área esquiable.',
			'El refugio de las Comes de Rubió, guardado, es una buena base si quieres hacer la ruta larga desde el sur o repartirla en dos días.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Es pot pujar a la Torreta de l'Orri amb nens?",
				resposta:
					"Des de Port Ainé, sí: és una pujada curta, d'1 h 32 min segons Reptes Muntanyencs, per pistes i sense passos difícils. Recorda que és un cim de gairebé 2.450 m, exposat al vent i a les tempestes d'estiu."
			},
			{
				pregunta: "Quina és la ruta més fàcil per pujar a la Torreta de l'Orri?",
				resposta:
					"La que surt de l'estació d'esquí de Port Ainé, on s'arriba per carretera asfaltada des de Rialp. La ruta des de Rubió pel refugi de les Comes de Rubió és molt més llarga: unes 4 h de pujada segons Rutes Pirineus."
			},
			{
				pregunta: "Què són les antenes del cim de la Torreta de l'Orri?",
				resposta:
					'Són instal·lacions de telecomunicacions que fan el cim molt reconeixible des de lluny. Al costat hi ha un vèrtex geodèsic, que marca el punt culminant.'
			},
			{
				pregunta: "La Torreta de l'Orri compta com a cim essencial?",
				resposta:
					'Sí. El Pallars Sobirà té onze [cims essencials](/cims-essencials), de la [Pica d’Estats](/cims/pica-d-estats) avall, i la Torreta de l’Orri és el més baix de tots.'
			}
		],
		es: [
			{
				pregunta: "¿Se puede subir a la Torreta de l'Orri con niños?",
				resposta:
					'Desde Port Ainé, sí: es una subida corta, de 1 h 32 min según Reptes Muntanyencs, por pistas y sin pasos difíciles. Recuerda que es una cima de casi 2.450 m, expuesta al viento y a las tormentas de verano.'
			},
			{
				pregunta: "¿Cuál es la ruta más fácil para subir a la Torreta de l'Orri?",
				resposta:
					'La que sale de la estación de esquí de Port Ainé, adonde se llega por carretera asfaltada desde Rialp. La ruta desde Rubió por el refugio de las Comes de Rubió es mucho más larga: unas 4 h de subida según Rutes Pirineus.'
			},
			{
				pregunta: "¿Qué son las antenas de la cima de la Torreta de l'Orri?",
				resposta:
					'Son instalaciones de telecomunicaciones que hacen la cima muy reconocible desde lejos. Al lado hay un vértice geodésico, que marca el punto culminante.'
			},
			{
				pregunta: "¿La Torreta de l'Orri cuenta como cima esencial?",
				resposta:
					'Sí. El Pallars Sobirà tiene once [cimas esenciales](/cims-essencials), de la [Pica d’Estats](/cims/pica-d-estats) hacia abajo, y la Torreta de l’Orri es la más baja de todas.'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, GOTERRIS, RUTES_PIRINEUS],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
