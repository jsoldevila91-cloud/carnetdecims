import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Pic de Salòria',
	url: 'https://ca.wikipedia.org/wiki/Pic_de_Sal%C3%B2ria',
	consultat: CONSULTAT
};

const ENGARRISTA = {
	nom: 'Engarrista: Pic de Salòria (2.789 m)',
	url: 'https://www.engarrista.com/node/179',
	consultat: CONSULTAT
};

const CEP = {
	nom: 'Centre Excursionista del Penedès: Pic de Salòria, Andorra (2789 m)',
	url: 'https://cep.cat/activities/excursionisme-pic-saloria-andorra-2789m/',
	consultat: CONSULTAT
};

const CIMS_PAISOS_CATALANS = {
	nom: 'Rutes pels cims dels Països Catalans: Pic de Salòria per Ós de Civís',
	url: 'https://cimsdelspaisoscatalans.blogspot.com/2012/07/pic-de-saloria-2789-m-per-os-de-civis.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pic-de-saloria',
	descripcio: {
		ca: [
			"El Pic de Salòria, o Bony de Salòria, és el sostre de [l'Alt Urgell](/comarques/alt-urgell). Fa de frontera entre aquesta comarca i el Pallars Sobirà, a la carena que separa els termes de les Valls de Valira i d'Alins, i queda dins del Parc Natural de l'Alt Pirineu. El poble més proper és Ós de Civís, un enclavament de l'Alt Urgell al qual només s'arriba per carretera passant per Andorra.",
			"És una muntanya de perfil suau, de gresos i pissarres, amb pendents coberts de vegetació gairebé tot l'any, tret de quan hi ha neu. El cim és un punt de partió d'aigües entre diverses conques, i un vèrtex geodèsic en marca el punt més alt. Al segle XIX hi va pujar Jacint Verdaguer, els estius del 1882 i el 1883, en dues de les seves excursions pirinenques, i en va parlar en una conferència al Centre Excursionista de Catalunya el 1884.",
			"El coll de Conflent, a uns 2.177 m, és el punt de partida habitual de la pujada. Prop del coll hi ha un búnquer, utilitzat després de la Guerra Civil per perseguir els maquis i vigilar el contraban entre les dues valls. Des del cim, segons la Viquipèdia i les ressenyes consultades, es veuen la serra del Cadí, la [Torreta de l'Orri](/cims/torreta-de-l-orri), la Pica d'Estats i el Sotllo, a més dels cims d'Andorra i del Pallars.",
			"La temporada és d'estiu a la tardor: segons Rutes pels cims dels Països Catalans, la vall d'accés queda impracticable a l'hivern, i amb neu cal piolet i grampons. La part més dura és la pujada del coll a la carena, un pendent fort sense camí clar; amb amenaça de tempesta, la carena és un mal lloc per quedar-s'hi."
		],
		es: [
			'El Pic de Salòria, o Bony de Salòria, es el techo del [Alt Urgell](/comarques/alt-urgell). Hace de frontera entre esta comarca y el Pallars Sobirà, en la cresta que separa los términos de las Valls de Valira y de Alins, y queda dentro del Parque Natural del Alt Pirineu. El pueblo más cercano es Ós de Civís, un enclave del Alt Urgell al que solo se llega por carretera pasando por Andorra.',
			'Es una montaña de perfil suave, de areniscas y pizarras, con pendientes cubiertas de vegetación casi todo el año, salvo cuando hay nieve. La cima es un punto de partición de aguas entre varias cuencas, y un vértice geodésico marca su punto más alto. En el siglo XIX subió Jacint Verdaguer, en los veranos de 1882 y 1883, en dos de sus excursiones pirenaicas, y habló de ello en una conferencia en el Centre Excursionista de Catalunya en 1884.',
			'El coll de Conflent, a unos 2.177 m, es el punto de partida habitual de la subida. Cerca del collado hay un búnker, utilizado después de la Guerra Civil para perseguir a los maquis y vigilar el contrabando entre los dos valles. Desde la cima, según la Viquipèdia y las reseñas consultadas, se ven la sierra del Cadí, la [Torreta de l’Orri](/cims/torreta-de-l-orri), la Pica d’Estats y el Sotllo, además de las cimas de Andorra y del Pallars.',
			'La temporada va del verano al otoño: según Rutes pels cims dels Països Catalans, el valle de acceso queda impracticable en invierno, y con nieve hacen falta piolet y crampones. La parte más dura es la subida del collado a la cresta, una pendiente fuerte sin camino claro; con amenaza de tormenta, la cresta es un mal sitio para quedarse.'
		]
	},
	rutes: [
		{
			id: 'os-de-civis-conflent',
			nom: {
				ca: "Des d'Ós de Civís pel coll de Conflent",
				es: 'Desde Ós de Civís por el coll de Conflent'
			},
			sortida: { nom: 'Pista per sobre de la Borda de la Plana (Ós de Civís, uns 1.700 m)' },
			desnivellPositiuM: 1094,
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "L'asfalt acaba a la Borda de la Plana, un hostal a uns 1.680 m, i la pista que segueix és només per a tot terrenys: el Centre Excursionista del Penedès deixa el vehicle uns revolts més amunt, a uns 1.700 m, i en compta uns 1.094 m de desnivell fins al cim. Es puja fins al coll de Conflent (2.177 m) i d'allà s'enfila el pendent fort, sense camí clar i amb alguna fita escadussera, fins a la carena ampla que porta al cim. Engarrista hi troba un pas curt de mitja grimpada a l'inici del pendent i fa 9 km i uns 1.200 m de desnivell, anada i tornada, en 3 h 30 min.",
				es: 'El asfalto acaba en la Borda de la Plana, un hostal a unos 1.680 m, y la pista que sigue es solo para todoterrenos: el Centre Excursionista del Penedès deja el vehículo unas curvas más arriba, a unos 1.700 m, y cuenta unos 1.094 m de desnivel hasta la cima. Se sube hasta el coll de Conflent (2.177 m) y desde allí se remonta la fuerte pendiente, sin camino claro y con algún hito suelto, hasta la cresta ancha que lleva a la cima. Engarrista encuentra un paso corto de media trepada al inicio de la pendiente y hace 9 km y unos 1.200 m de desnivel, ida y vuelta, en 3 h 30 min.'
			},
			fonts: [ENGARRISTA, CEP, CIMS_PAISOS_CATALANS]
		}
	],
	consells: {
		ca: [
			"La carretera d'Ós de Civís surt de la CG-6, passat Aixovall, a Andorra; la pista a partir de la Borda de la Plana és només per a tot terrenys.",
			'El tram del coll de Conflent a la carena no té camí clar: segueix el track i evita pujar amb boira.',
			'Engarrista descriu la zona com poc visitada i amb camí poc fressat: avisa algú del teu itinerari abans de sortir.',
			'Amb tempesta, la carena és sense refugi: Engarrista hi va ser sorprès per una calamarsada. Si el cel es tapa, baixa.',
			"Ós de Civís només té accés per carretera des d'Andorra: porta la documentació en regla per passar la frontera."
		],
		es: [
			'La carretera de Ós de Civís sale de la CG-6, pasado Aixovall, en Andorra; la pista a partir de la Borda de la Plana es solo para todoterrenos.',
			'El tramo del coll de Conflent a la cresta no tiene camino claro: sigue el track y evita subir con niebla.',
			'Engarrista describe la zona como poco visitada y con camino poco hollado: avisa a alguien de tu itinerario antes de salir.',
			'Con tormenta, la cresta no tiene refugio: Engarrista fue sorprendido allí por una granizada. Si el cielo se cubre, baja.',
			'Ós de Civís solo tiene acceso por carretera desde Andorra: lleva la documentación en regla para cruzar la frontera.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Pic de Salòria?',
				resposta:
					"Engarrista hi va arribar en poc més de dues hores des de la pista per sobre de la Borda de la Plana, i en dona 3 h 30 min anada i tornada. Si s'arriba amb tot terreny al coll de Conflent, el blog Rutes pels cims dels Països Catalans compta 1 h 45 min de pujada (3,3 km i 612 m de desnivell) i 2 h 45 min en total."
			},
			{
				pregunta: 'Es pot arribar en cotxe fins al coll de Conflent?',
				resposta:
					"El blog Rutes pels cims dels Països Catalans diu que la pista no és apta per a turismes a l'estiu i que a l'hivern és intransitable. Engarrista avisa que és només per a tot terrenys."
			},
			{
				pregunta: 'És un cim difícil?',
				resposta:
					"Engarrista el considera fàcil, amb un pas de mitja grimpada a l'inici del pendent i un pendent fort sense camí clar. El Centre Excursionista del Penedès el va programar com a sortida d'iniciació i diu que, sense neu, el que pesa és el desnivell de més de mil metres."
			},
			{
				pregunta: 'El Pic de Salòria compta com a cim essencial?',
				resposta:
					"Sí, i és el més alt dels nou essencials de l'Alt Urgell, per sobre del Monturull i del [Vulturó](/cims/vulturo). Des del cim s'identifiquen la [Pica d'Estats](/cims/pica-d-estats) i el [Pic de Sotllo](/cims/pic-de-sotllo), altres cims del repte."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Pic de Salòria?',
				resposta:
					'Engarrista llegó en poco más de dos horas desde la pista por encima de la Borda de la Plana, y da 3 h 30 min ida y vuelta. Si se llega en todoterreno al coll de Conflent, el blog Rutes pels cims dels Països Catalans cuenta 1 h 45 min de subida (3,3 km y 612 m de desnivel) y 2 h 45 min en total.'
			},
			{
				pregunta: '¿Se puede llegar en coche hasta el coll de Conflent?',
				resposta:
					'El blog Rutes pels cims dels Països Catalans dice que la pista no es apta para turismos en verano y que en invierno es intransitable. Engarrista avisa de que es solo para todoterrenos.'
			},
			{
				pregunta: '¿Es una cima difícil?',
				resposta:
					'Engarrista la considera fácil, con un paso de media trepada al inicio de la pendiente y una pendiente fuerte sin camino claro. El Centre Excursionista del Penedès la programó como salida de iniciación y dice que, sin nieve, lo que pesa es el desnivel de más de mil metros.'
			},
			{
				pregunta: '¿El Pic de Salòria cuenta como cima esencial?',
				resposta:
					'Sí, y es la más alta de las nueve esenciales del Alt Urgell, por encima del Monturull y del [Vulturó](/cims/vulturo). Desde la cima se identifican la [Pica d’Estats](/cims/pica-d-estats) y el [Pic de Sotllo](/cims/pic-de-sotllo), otras cimas del reto.'
			}
		]
	},
	fonts: [VIQUIPEDIA, ENGARRISTA, CEP, CIMS_PAISOS_CATALANS],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
