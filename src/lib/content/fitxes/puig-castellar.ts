import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puig Castellar (Santa Coloma de Gramenet)',
	url: 'https://ca.wikipedia.org/wiki/Puig_Castellar_(Santa_Coloma_de_Gramenet)',
	consultat: CONSULTAT
};

const FESTACATALUNYA = {
	nom: 'Festa Catalunya: poblat ibèric de Puig Castellar',
	url: 'https://www.festacatalunya.cat/llocs-interes/poblat-iberic-de-puig-castellar-a-santa-coloma-de-gramenet',
	consultat: CONSULTAT
};

const DIBA_MIRADOR = {
	nom: 'Diputació de Barcelona: mirador del turó del Puig Castellar',
	url: 'https://parcs.diba.cat/ca/web/equipaments/detall-equipament/-/contingut/193969/mirador-turo-puig-castellar',
	consultat: CONSULTAT
};

const DIBA_ACCES = {
	nom: "Parc de la Serralada de Marina: com s'hi arriba",
	url: 'https://parcs.diba.cat/en/web/marina/com-s-hi-arriba',
	consultat: CONSULTAT
};

const DIBA_SLC147 = {
	nom: "Parcs de la Diputació de Barcelona: SL-C 147 De la font de l'Alzina al Puig Castellar",
	url: 'https://view.gooltracking.com/dibaparcs/routes/view/sl-c-147-de-la-font-de-l-alzina-al-puig-castellar',
	consultat: CONSULTAT
};

const SENDERISMEENTREN = {
	nom: "Senderisme en tren: de l'estació de metro Singuerlín a Montcada i Reixac pel Puig Castellar",
	url: 'https://senderismeentren.cat/ruta/3865',
	consultat: CONSULTAT
};

const MUSEU = {
	nom: 'Museu Torre Balldovina: visita guiada al Puig Castellar',
	url: 'https://museu.gramenet.cat/activitats/detall-activitats/visita-guiada-al-puig-castellar/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-castellar',
	descripcio: {
		ca: [
			"El Puig Castellar és el turó que corona Santa Coloma de Gramenet, [al Barcelonès](/comarques/barcelones), i fa de límit amb Montcada i Reixac. Forma part de la serra de Marina i del Parc de la Serralada de Marina, i és un dels cims del repte més fàcils d'abastar en transport públic: el metro deixa a peu del parc. La Viquipèdia recorda que el turó, de pòrfir, servia de referència als pescadors de Badalona.",
			"El que el fa especial és el **poblat ibèric** que ocupa el cim, el principal i més ben conservat dels voltants de Barcelona. El van fundar els laietans cap al segle VI aC i es va abandonar entre els segles III i II aC. Tenia una planta el·líptica amb tres carrers i més de trenta cases, i s'hi calcula una població d'uns tres-cents habitants. El va descobrir Ferran de Sagarra el 1904–1905; l'Institut d'Estudis Catalans hi va excavar als anys vint i el Centre Excursionista Puigcastellar als cinquanta, i encara en té cura. D'aquí surt el famós crani travessat per un clau que avui es conserva al Museu d'Arqueologia de Catalunya. La visita és lliure i gratuïta, amb plafons i una casa reconstruïda amb el seu molí.",
			"Dalt hi ha un mirador del parc amb un plafó sobre la migració de les rapinyaires. Segons la Diputació, a mesura que puges la vista s'obre sobre el Vallès, el vessant de Collserola, el Barcelonès i el mar.",
			"Els mesos més agradables són de tardor a primavera; a l'estiu, millor a primera hora o al vespre, perquè els vessants del sud fan molta calor."
		],
		es: [
			'El Puig Castellar es el cerro que corona Santa Coloma de Gramenet, [en el Barcelonès](/comarques/barcelones), y hace de límite con Montcada i Reixac. Forma parte de la sierra de Marina y del Parque de la Serralada de Marina, y es una de las cimas del reto más fáciles de alcanzar en transporte público: el metro deja al pie del parque. La Viquipèdia recuerda que el cerro, de pórfido, servía de referencia a los pescadores de Badalona.',
			'Lo que lo hace especial es el **poblado ibérico** que ocupa la cima, el principal y mejor conservado de los alrededores de Barcelona. Lo fundaron los layetanos hacia el siglo VI a. C. y se abandonó entre los siglos III y II a. C. Tenía una planta elíptica con tres calles y más de treinta casas, y se calcula una población de unos trescientos habitantes. Lo descubrió Ferran de Sagarra en 1904–1905; el Institut d’Estudis Catalans excavó en él en los años veinte y el Centre Excursionista Puigcastellar en los cincuenta, y aún cuida de él. De aquí procede el famoso cráneo atravesado por un clavo que hoy se conserva en el Museu d’Arqueologia de Catalunya. La visita es libre y gratuita, con paneles y una casa reconstruida con su molino.',
			'Arriba hay un mirador del parque con un panel sobre la migración de las rapaces. Según la Diputación, a medida que subes la vista se abre sobre el Vallès, la vertiente de Collserola, el Barcelonès y el mar.',
			'Los meses más agradables van del otoño a la primavera; en verano, mejor a primera hora o al atardecer, porque las vertientes del sur dan mucho calor.'
		]
	},
	rutes: [
		{
			id: 'singuerlin',
			nom: {
				ca: "Des de l'estació de metro Singuerlín",
				es: 'Desde la estación de metro Singuerlín'
			},
			sortida: { nom: 'Estació de metro Singuerlín (L9, Santa Coloma de Gramenet)' },
			tempsMinuts: 40,
			tecnicitat: 'cap',
			descripcio: {
				ca: "Segons la Diputació, en uns deu minuts a peu des del metro ja ets dins del parc. Senderisme en tren hi descriu un itinerari fàcil, amb marques taronges, que passa per la plaça de Sant Roc i les fonts del Drapet i de la Bóta i arriba al poblat en uns 40 minuts; té algun tram força dret al costat d'un torrent, però tot és camí i pista.",
				es: 'Según la Diputación, en unos diez minutos a pie desde el metro ya estás dentro del parque. Senderisme en tren describe un itinerario fácil, con marcas naranjas, que pasa por la plaça de Sant Roc y las fuentes del Drapet y de la Bóta y llega al poblado en unos 40 minutos; tiene algún tramo bastante empinado junto a un torrente, pero todo es camino y pista.'
			},
			fonts: [SENDERISMEENTREN, DIBA_ACCES]
		},
		{
			id: 'font-de-l-alzina',
			nom: {
				ca: "Pel SL-C 147 des de la font de l'Alzina",
				es: "Por el SL-C 147 desde la font de l'Alzina"
			},
			sortida: { nom: 'Barri de les Oliveres (Santa Coloma de Gramenet)' },
			descripcio: {
				ca: "Sender local del parc que surt de l'aparcament del barri de les Oliveres i recorre el vessant oest del turó. Segons la Diputació, són 7,8 km i unes 2 h 15 min en total, per una pista ampla i còmoda excepte la pujada final al cim, que és costeruda. El parc avisa que la senyalització està en procés de renovació.",
				es: 'Sendero local del parque que sale del aparcamiento del barrio de les Oliveres y recorre la vertiente oeste del cerro. Según la Diputación, son 7,8 km y unas 2 h 15 min en total, por una pista ancha y cómoda excepto la subida final a la cima, que es empinada. El parque avisa de que la señalización está en proceso de renovación.'
			},
			fonts: [DIBA_SLC147]
		}
	],
	consells: {
		ca: [
			'Ves-hi en metro: la L9 deixa a Singuerlín i la L1 a Santa Coloma; els caps de setmana aparcar a prop del parc és complicat.',
			"Les restes del poblat són fràgils: no t'enfilis als murs ni treguis pedres, i segueix els passos dels plafons.",
			"A l'estiu el sol és fort i hi ha poca ombra a la part alta: porta aigua i gorra.",
			'Si vols entendre bé el jaciment, el Museu Torre Balldovina de Santa Coloma i el Centre Excursionista Puigcastellar hi han organitzat visites guiades.',
			"En època de migració, fixa't en el cel: el plafó del mirador explica quines rapinyaires s'hi poden veure passar."
		],
		es: [
			'Ve en metro: la L9 deja en Singuerlín y la L1 en Santa Coloma; los fines de semana aparcar cerca del parque es complicado.',
			'Los restos del poblado son frágiles: no te subas a los muros ni muevas piedras, y sigue el recorrido de los paneles.',
			'En verano el sol es fuerte y hay poca sombra en la parte alta: lleva agua y gorra.',
			'Si quieres entender bien el yacimiento, el Museu Torre Balldovina de Santa Coloma y el Centre Excursionista Puigcastellar han organizado visitas guiadas.',
			'En época de migración, fíjate en el cielo: el panel del mirador explica qué rapaces se pueden ver pasar.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Com es puja al Puig Castellar en transport públic?',
				resposta:
					'Amb la L9 del metro fins a Singuerlín. Segons la Diputació, en deu minuts a peu entres al parc, i Senderisme en tren calcula uns 40 minuts fins al poblat ibèric per camins senyalitzats.'
			},
			{
				pregunta: 'Es pot pujar al Puig Castellar amb nens?',
				resposta:
					"Sí. És curt, sense passos tècnics i té l'al·licient del poblat ibèric, amb una casa reconstruïda i plafons. Només cal tenir en compte que algun tram és costerut i que a l'estiu fa calor."
			},
			{
				pregunta: 'Es pot visitar el poblat ibèric del Puig Castellar?',
				resposta:
					"Sí, la visita és lliure i gratuïta. Les restes ocupen el cim, amb plafons explicatius i una casa reconstruïda amb un molí a l'interior."
			},
			{
				pregunta: 'El Puig Castellar és un cim essencial?',
				resposta:
					'Sí. El Barcelonès en té dos, el Puig Castellar i el turó de la Magarola, i amb 303 m és un dels [cims essencials](/cims-essencials) més baixos de tot el repte.'
			}
		],
		es: [
			{
				pregunta: '¿Cómo se sube al Puig Castellar en transporte público?',
				resposta:
					'Con la L9 del metro hasta Singuerlín. Según la Diputación, en diez minutos a pie entras en el parque, y Senderisme en tren calcula unos 40 minutos hasta el poblado ibérico por caminos señalizados.'
			},
			{
				pregunta: '¿Se puede subir al Puig Castellar con niños?',
				resposta:
					'Sí. Es corto, sin pasos técnicos y tiene el aliciente del poblado ibérico, con una casa reconstruida y paneles. Solo hay que tener en cuenta que algún tramo es empinado y que en verano hace calor.'
			},
			{
				pregunta: '¿Se puede visitar el poblado ibérico del Puig Castellar?',
				resposta:
					'Sí, la visita es libre y gratuita. Los restos ocupan la cima, con paneles explicativos y una casa reconstruida con un molino en su interior.'
			},
			{
				pregunta: '¿El Puig Castellar es una cima esencial?',
				resposta:
					'Sí. El Barcelonès tiene dos, el Puig Castellar y el turó de la Magarola, y con 303 m es una de las [cimas esenciales](/cims-essencials) más bajas de todo el reto.'
			}
		]
	},
	fonts: [
		VIQUIPEDIA,
		FESTACATALUNYA,
		DIBA_MIRADOR,
		DIBA_ACCES,
		DIBA_SLC147,
		SENDERISMEENTREN,
		MUSEU
	],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
