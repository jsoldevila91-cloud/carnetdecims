import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const GALLIFA_ERMITA = {
	nom: 'Ajuntament de Gallifa: ermita de Sant Sadurní',
	url: 'https://www.gallifa.cat/el-municipi/turisme/llocs-dinteres/ermita-de-sant-sadurni.html',
	consultat: CONSULTAT
};

const GALLIFA_RUTA = {
	nom: 'Ajuntament de Gallifa: ruta Sant Sadurní de Gallifa',
	url: 'https://www.gallifa.cat/el-municipi/turisme/rutes/sant-sadurni-de-gallifa.html',
	consultat: CONSULTAT
};

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Sant Sadurní de Gallifa',
	url: 'https://ca.wikipedia.org/wiki/Sant_Sadurn%C3%AD_de_Gallifa',
	consultat: CONSULTAT
};

const CODINES = {
	nom: 'Ajuntament de Sant Feliu de Codines: Sant Sadurní (Gallifa)',
	url: 'https://www.santfeliudecodines.cat/turisme/llocs-dinteres/sant-sadurni-gallifa.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'sant-sadurni-de-gallifa',
	descripcio: {
		ca: [
			"Sant Sadurní de Gallifa és l'ermita que corona la Mola, una muntanya voltada de cingles al nord-est del poble de Gallifa, al [Vallès Occidental](/comarques/valles-occidental). Segons la Viquipèdia, l'ermita dona nom als cingles de Sant Sadurní, que envolten gairebé tota la Mola. No s'ha de confondre amb [la Mola de Sant Llorenç del Munt](/cims/la-mola-de-sant-llorenc-del-munt), que es veu des d'aquí i és a la mateixa comarca.",
			"El lloc ja surt documentat el 939. L'Ajuntament de Gallifa explica que l'ermita es va construir dins d'una fortificació, de la qual només queda un tros de mur, que als segles IX i X feia de límit entre els comtats de Barcelona i d'Osona. La Viquipèdia descriu una capella preromànica del segle X amb un absis de finals del XI, decorat amb arcuacions llombardes. El 1316 era un petit priorat del monestir de Sant Pere de la Portella; el 1604, el bisbe hi va prohibir dir missa pel mal estat de l'edifici, i el 1714 s'hi va adossar la casa dels ermitans, avui abandonada.",
			"Al costat mateix de l'ermita hi ha el mirador de la Guineu, arran de cingle. L'Ajuntament hi enumera el Prepirineu, Moià, Centelles i el Puigsagordi, Sant Feliu de Codines, el Vallès, la Mola de Sant Llorenç i Montserrat.",
			"És una pujada de bosc, curta i de pendent suau, que es pot fer tot l'any. Dalt, el mirador i el voltant de l'ermita són arran de cingle."
		],
		es: [
			'Sant Sadurní de Gallifa es la ermita que corona la Mola, una montaña rodeada de cingles al noreste del pueblo de Gallifa, en el [Vallès Occidental](/comarques/valles-occidental). Según la Viquipèdia, la ermita da nombre a los cingles de Sant Sadurní, que rodean casi toda la Mola. No hay que confundirla con [la Mola de Sant Llorenç del Munt](/cims/la-mola-de-sant-llorenc-del-munt), que se ve desde aquí y está en la misma comarca.',
			'El lugar ya aparece documentado en 939. El Ayuntamiento de Gallifa explica que la ermita se construyó dentro de una fortificación, de la que solo queda un trozo de muro, que en los siglos IX y X hacía de límite entre los condados de Barcelona y de Osona. La Viquipèdia describe una capilla prerrománica del siglo X con un ábside de finales del XI, decorado con arquillos lombardos. En 1316 era un pequeño priorato del monasterio de Sant Pere de la Portella; en 1604, el obispo prohibió decir misa en ella por el mal estado del edificio, y en 1714 se le adosó la casa de los ermitaños, hoy abandonada.',
			'Junto a la ermita está el mirador de la Guineu, al borde del cingle. El Ayuntamiento enumera el Prepirineo, Moià, Centelles y el Puigsagordi, Sant Feliu de Codines, el Vallès, la Mola de Sant Llorenç y Montserrat.',
			'Es una subida de bosque, corta y de pendiente suave, que se puede hacer todo el año. Arriba, el mirador y el entorno de la ermita están al borde del cingle.'
		]
	},
	rutes: [
		{
			id: 'sant-feliu-de-codines',
			nom: {
				ca: 'Des de la pista de la Roca pel collet de Sant Sadurní',
				es: 'Desde la pista de la Roca por el collet de Sant Sadurní'
			},
			sortida: {
				nom: "Inici de la pista d'accés a la Roca, entre Sant Feliu de Codines i Gallifa"
			},
			desnivellPositiuM: 430,
			tempsMinuts: 90,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "És l'itinerari que publica l'Ajuntament de Sant Feliu de Codines: 8,2 km i 2 h 50 min entre anada i tornada, amb 430 m de pujada. Surt de la pista de la Roca, a uns 4 km de Sant Feliu, on hi ha un cartell i una cadena. Als 20 minuts travessa la riera de la Roca i s'enfila pel bosc, amb trams molt erosionats i d'altres de llargs i planers; passa pel collet de Pedra (1 h 05 min) i el collet de Sant Sadurní (1 h 15 min), i un sender rocós porta a l'ermita a l'hora i mitja. La fitxa municipal diu que la pujada és força suau i que no és exigent d'orientació, amb marques blanques i grogues en alguns trams. La tornada baixa de la cinglera al collet per un senderó i desfà el camí.",
				es: 'Es el itinerario que publica el Ayuntamiento de Sant Feliu de Codines: 8,2 km y 2 h 50 min entre ida y vuelta, con 430 m de subida. Sale de la pista de la Roca, a unos 4 km de Sant Feliu, donde hay un cartel y una cadena. A los 20 minutos cruza la riera de la Roca y sube por el bosque, con tramos muy erosionados y otros largos y llanos; pasa por el collet de Pedra (1 h 05 min) y el collet de Sant Sadurní (1 h 15 min), y un sendero rocoso lleva a la ermita a la hora y media. La ficha municipal dice que la subida es bastante suave y que no es exigente de orientación, con marcas blancas y amarillas en algunos tramos. La vuelta baja del cingle al collado por un senderillo y deshace el camino.'
			},
			fonts: [CODINES]
		},
		{
			id: 'gallifa-volta',
			nom: {
				ca: 'Volta a Sant Sadurní des de Gallifa',
				es: 'Vuelta a Sant Sadurní desde Gallifa'
			},
			sortida: { nom: 'Gallifa' },
			descripcio: {
				ca: "L'Ajuntament de Gallifa recomana una ruta senderista circular que dona la volta a Sant Sadurní i n'enllaça el traçat, sense publicar-ne la distància ni l'horari. També hi ha itineraris que hi pugen des de Castellterçol.",
				es: 'El Ayuntamiento de Gallifa recomienda una ruta senderista circular que da la vuelta a Sant Sadurní y enlaza su trazado, sin publicar la distancia ni el horario. También hay itinerarios que suben desde Castellterçol.'
			},
			fonts: [GALLIFA_RUTA, GALLIFA_ERMITA]
		}
	],
	consells: {
		ca: [
			"Al mirador de la Guineu i a tot el voltant de l'ermita, el terra acaba en cingle: vigila la canalla i no t'hi acostis per fer fotos.",
			'El camí de la riera té trams molt erosionats: porta calçat que agafi bé, sobretot per a la baixada.',
			"La pista de la Roca té una cadena a l'entrada: deixa el cotxe a fora sense tapar el pas.",
			"Des de Gallifa o des de Castellterçol hi ha altres camins: prepara'ls amb un mapa, perquè aquí només detallem el de la pista de la Roca.",
			'La casa dels ermitans està abandonada: no hi entris.'
		],
		es: [
			'En el mirador de la Guineu y en todo el entorno de la ermita, el suelo acaba en cingle: vigila a los niños y no te acerques para hacer fotos.',
			'El camino de la riera tiene tramos muy erosionados: lleva calzado que agarre bien, sobre todo para la bajada.',
			'La pista de la Roca tiene una cadena en la entrada: deja el coche fuera sin tapar el paso.',
			'Desde Gallifa o desde Castellterçol hay otros caminos: prepáralos con un mapa, porque aquí solo detallamos el de la pista de la Roca.',
			'La casa de los ermitaños está abandonada: no entres.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Sant Sadurní de Gallifa?',
				resposta:
					"Una hora i mitja des de la pista de la Roca, segons l'itinerari de l'Ajuntament de Sant Feliu de Codines, que compta 2 h 50 min i 8,2 km entre anada i tornada, amb 430 m de pujada."
			},
			{
				pregunta: 'Es pot pujar a Sant Sadurní de Gallifa amb nens?',
				resposta:
					"Sí, si ja caminen una estona: la fitxa municipal diu que la pujada és força suau i fàcil de seguir. El que demana atenció és el cim, perquè el mirador i el pla de l'ermita donen directament al cingle."
			},
			{
				pregunta: "De quan és l'ermita de Sant Sadurní?",
				resposta:
					'La Viquipèdia la descriu com una capella preromànica del segle X amb un absis de finals del XI. El lloc consta des del 939 i el 1316 era un priorat de Sant Pere de la Portella.'
			},
			{
				pregunta: 'És la mateixa Mola que la de Sant Llorenç del Munt?',
				resposta:
					'No. El cim on hi ha Sant Sadurní també es diu la Mola, però és a Gallifa. La Mola de Sant Llorenç del Munt, amb el monestir, és un altre cim essencial del Vallès Occidental, i es veu des del mirador de la Guineu.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Sant Sadurní de Gallifa?',
				resposta:
					'Una hora y media desde la pista de la Roca, según el itinerario del Ayuntamiento de Sant Feliu de Codines, que cuenta 2 h 50 min y 8,2 km entre ida y vuelta, con 430 m de subida.'
			},
			{
				pregunta: '¿Se puede subir a Sant Sadurní de Gallifa con niños?',
				resposta:
					'Sí, si ya caminan un rato: la ficha municipal dice que la subida es bastante suave y fácil de seguir. Lo que pide atención es la cima, porque el mirador y el llano de la ermita dan directamente al cingle.'
			},
			{
				pregunta: '¿De cuándo es la ermita de Sant Sadurní?',
				resposta:
					'La Viquipèdia la describe como una capilla prerrománica del siglo X con un ábside de finales del XI. El lugar consta desde 939 y en 1316 era un priorato de Sant Pere de la Portella.'
			},
			{
				pregunta: '¿Es la misma Mola que la de Sant Llorenç del Munt?',
				resposta:
					'No. La cima donde está Sant Sadurní también se llama la Mola, pero está en Gallifa. La Mola de Sant Llorenç del Munt, con el monasterio, es otra cima esencial del Vallès Occidental, y se ve desde el mirador de la Guineu.'
			}
		]
	},
	fonts: [GALLIFA_ERMITA, GALLIFA_RUTA, VIQUIPEDIA, CODINES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
