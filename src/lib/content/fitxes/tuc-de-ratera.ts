import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Tuc de Ratera',
	url: 'https://ca.wikipedia.org/wiki/Tuc_de_Ratera',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Tuc de Ratera',
	url: 'https://reptesmuntanyencs.cat/es/tuc-de-ratera-2/',
	consultat: CONSULTAT
};

const VISIT_ARAN = {
	nom: "Visit Val d'Aran: Tuc de Ratèra (esquí de muntanya)",
	url: 'https://www.visitvaldaran.com/en/item/tuc-de-ratera/',
	consultat: CONSULTAT
};

const PARC_FAQ = {
	nom: 'Parc Nacional d’Aigüestortes i Estany de Sant Maurici: preguntes freqüents',
	url: 'https://parcsnaturals.gencat.cat/ca/xarxa-de-parcs/aiguestortes/preguntes-frequents/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tuc-de-ratera',
	descripcio: {
		ca: [
			"El Tuc de Ratera s'alça entre els municipis d'Espot, al [Pallars Sobirà](/comarques/pallars-sobira), i de Naut Aran, a la Val d'Aran, dins del Parc Nacional d'Aigüestortes i Estany de Sant Maurici. La Viquipèdia en dona una prominència de 133 m i un aïllament de 1,9 km, i diu que és de granodiorita. Visit Val d'Aran el presenta com la muntanya més alta del circ de Saboredo, que es veu des del refugi de Saboredo.",
			"És un cim limítrof entre el Pallars i l'Aran. Reptes Muntanyencs el considera un dels més alts de la zona, només superat pels cims de la carena de Colomèrs i per una cota sense nom que en baixa. El cim té dues cotes molt properes, i segons GPS i mapes la més alta és l'occidental.",
			"Per l'Aran, la sortida és el refugi de Saboredo i l'accés, pel port de Ratèra, cap al sud. Pel Pallars, la sortida habitual és el refugi d'Amitges. Segons Reptes Muntanyencs, des d'allà el recorregut combina el camí de Carros de Foc, marcat amb estaques de cap groc, i un tram del GR 11 fins al port de Ratera; la pujada final segueix innombrables rastres i fites, sense més dificultat que el pendent fort, i l'autor en destaca les vistes. Visit Val d'Aran afegeix des del cim vistes dels circs de Saboredo i Colomèrs, al nord, i de la capçalera del parc nacional, al sud.",
			"A peu, la temporada és l'estiu i el principi de la tardor; Reptes Muntanyencs hi va pujar a finals d'agost. A l'hivern, el vessant aranès és una ascensió d'esquí de muntanya des de Saboredo. Dins del parc nacional no es pot acampar ni fer bivac fora dels refugis."
		],
		es: [
			'El Tuc de Ratera se alza entre los municipios de Espot, en el [Pallars Sobirà](/comarques/pallars-sobira), y de Naut Aran, en la Val d’Aran, dentro del Parque Nacional de Aigüestortes i Estany de Sant Maurici. La Viquipèdia le da una prominencia de 133 m y un aislamiento de 1,9 km, y dice que es de granodiorita. Visit Val d’Aran lo presenta como la montaña más alta del circo de Saboredo, que se ve desde el refugio de Saboredo.',
			'Es una cima limítrofe entre el Pallars y el Aran. Reptes Muntanyencs la considera una de las más altas de la zona, solo superada por las cimas de la cresta de Colomèrs y por una cota sin nombre que baja de ella. La cima tiene dos cotas muy próximas, y según GPS y mapas la más alta es la occidental.',
			'Por el Aran, la salida es el refugio de Saboredo y el acceso, por el port de Ratèra, hacia el sur. Por el Pallars, la salida habitual es el refugio de Amitges. Según Reptes Muntanyencs, desde allí el recorrido combina el camino de Carros de Foc, marcado con estacas de cabeza amarilla, y un tramo del GR 11 hasta el port de Ratera; la subida final sigue innumerables rastros e hitos, sin más dificultad que la fuerte pendiente, y el autor destaca sus vistas. Visit Val d’Aran añade desde la cima vistas de los circos de Saboredo y Colomèrs, al norte, y de la cabecera del parque nacional, al sur.',
			'A pie, la temporada es el verano y el principio del otoño; Reptes Muntanyencs subió a finales de agosto. En invierno, la vertiente aranesa es una ascensión de esquí de montaña desde Saboredo. Dentro del parque nacional no se puede acampar ni hacer vivac fuera de los refugios.'
		]
	},
	rutes: [
		{
			id: 'amitges',
			nom: {
				ca: "Circular des del refugi d'Amitges pel port de Ratera",
				es: 'Circular desde el refugio de Amitges por el port de Ratera'
			},
			sortida: { nom: "Refugi d'Amitges (Espot; pista de taxis fins a l'estany de Sant Maurici)" },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Reptes Muntanyencs surt del refugi d'Amitges, segueix els camins de Carros de Foc i el GR 11 fins al port de Ratera i puja al cim per rastres i fites. Compta uns 9,6 km i 694 m de desnivell en una volta en sentit horari, amb 2 h 23 min fins al cim i 4 h 3 min de marxa efectiva més 1 h 5 min d'aturades. S'hi arriba amb el taxi 4x4 fins a Sant Maurici i, d'allà, a peu fins al refugi. L'autor no hi esmenta cap pas de grimpada: la pujada final és dreta, sense camí únic, per rastres i fites.",
				es: 'Reptes Muntanyencs sale del refugio de Amitges, sigue los caminos de Carros de Foc y el GR 11 hasta el port de Ratera y sube a la cima por rastros e hitos. Cuenta unos 9,6 km y 694 m de desnivel en una vuelta en sentido horario, con 2 h 23 min hasta la cima y 4 h 3 min de marcha efectiva más 1 h 5 min de paradas. Se llega con el taxi 4x4 hasta Sant Maurici y, de allí, a pie hasta el refugio. El autor no menciona ningún paso de trepada: la subida final es empinada, sin un camino único, por rastros e hitos.'
			},
			fonts: [REPTES, PARC_FAQ]
		},
		{
			id: 'saboredo',
			nom: {
				ca: 'Des del refugi de Saboredo pel port de Ratèra',
				es: 'Desde el refugio de Saboredo por el port de Ratèra'
			},
			sortida: { nom: 'Refugi de Saboredo (Naut Aran)' },
			descripcio: {
				ca: "Visit Val d'Aran descriu aquesta ruta com a esquí de muntanya: es baixa uns metres a l'estanh deth Miei, es creua la plana cap al sud fins al lac de Naut i es puja fins al port de Ratèra, des d'on la carena sud, menys dreta, porta al cim. Compta 6,5 km, 570 m de desnivell i 2 h de pujada més 1 h de baixada, amb dificultat moderada (BE-S3) i un terreny d'allaus complex. Els últims metres són forts.",
				es: 'Visit Val d’Aran describe esta ruta como esquí de montaña: se baja unos metros al estanh deth Miei, se cruza la llanura hacia el sur hasta el lac de Naut y se sube hasta el port de Ratèra, desde donde la cresta sur, menos empinada, lleva a la cima. Cuenta 6,5 km, 570 m de desnivel y 2 h de subida más 1 h de bajada, con dificultad moderada (BE-S3) y un terreno de aludes complejo. Los últimos metros son fuertes.'
			},
			fonts: [VISIT_ARAN]
		}
	],
	consells: {
		ca: [
			"Els vehicles 4x4 del parc porten d'Espot a l'estany de Sant Maurici; al costat aranès hi ha un servei temporal entre Arties i el pontet de Rius i entre els Banhs de Tredòs i el circ de Colomèrs, segons el parc.",
			"Visit Val d'Aran descriu el terreny d'allaus de la ruta del vessant aranès com a complex: només amb neu estable i material.",
			"Segons Reptes Muntanyencs, el mapa de l'ICGC i el d'Editorial Alpina no situen el port de Ratera al mateix lloc: no t'hi guiïs només pel nom del mapa i porta el track.",
			"Si hi vols dormir, els refugis d'Amitges i de Saboredo són etapes de la travessa Carros de Foc: a l'estiu, reserva amb temps."
		],
		es: [
			'Los vehículos 4x4 del parque llevan de Espot al estany de Sant Maurici; en el lado aranés hay un servicio temporal entre Arties y el pontet de Rius y entre los Banhs de Tredòs y el circo de Colomèrs, según el parque.',
			'Visit Val d’Aran describe el terreno de aludes de la ruta de la vertiente aranesa como complejo: solo con nieve estable y material.',
			'Según Reptes Muntanyencs, el mapa del ICGC y el de Editorial Alpina no sitúan el port de Ratera en el mismo lugar: no te guíes solo por el nombre del mapa y lleva el track.',
			'Si quieres dormir allí, los refugios de Amitges y de Saboredo son etapas de la travesía Carros de Foc: en verano, reserva con tiempo.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Tuc de Ratera?',
				resposta:
					"Reptes Muntanyencs hi arriba en 2 h 23 min des del refugi d'Amitges, aturades incloses. La volta circular fa 9,6 km i 694 m de desnivell, amb 4 h 3 min de marxa efectiva."
			},
			{
				pregunta: 'És un cim fàcil?',
				resposta:
					"Reptes Muntanyencs en valora l'exigència física d'alta i l'orientació de baixa, i no hi esmenta grimpades: la dificultat és el pendent fort de la pujada final. Visit Val d'Aran avisa que els últims metres de la ruta d'esquí del vessant aranès són forts."
			},
			{
				pregunta: 'Quina és la millor base per pujar-hi?',
				resposta:
					"Els refugis d'Amitges (costat d'Espot) i de Saboredo (costat aranès) són les bases de les dues rutes ressenyades. Cal arribar-hi a peu, o amb els vehicles 4x4 del parc fins a Sant Maurici en el cas d'Amitges."
			},
			{
				pregunta: 'El Tuc de Ratera compta com a cim essencial?',
				resposta:
					'Sí, és un dels onze [cims essencials](/cims-essencials) del Pallars Sobirà. Amb 2.861 m, és 3 m més baix que el [Mont-roig](/cims/mont-roig) (2.864 m) i, com el [Gran Tuc de Colomèrs](/cims/gran-tuc-de-colomers), és dins del parc nacional.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Tuc de Ratera?',
				resposta:
					'Reptes Muntanyencs llega en 2 h 23 min desde el refugio de Amitges, paradas incluidas. La vuelta circular hace 9,6 km y 694 m de desnivel, con 4 h 3 min de marcha efectiva.'
			},
			{
				pregunta: '¿Es una cima fácil?',
				resposta:
					'Reptes Muntanyencs valora la exigencia física de alta y la orientación de baja, y no menciona trepadas: la dificultad es la fuerte pendiente de la subida final. Visit Val d’Aran avisa de que los últimos metros de la ruta de esquí de la vertiente aranesa son fuertes.'
			},
			{
				pregunta: '¿Cuál es la mejor base para subir?',
				resposta:
					'Los refugios de Amitges (lado de Espot) y de Saboredo (lado aranés) son las bases de las dos rutas reseñadas. Hay que llegar a pie, o con los vehículos 4x4 del parque hasta Sant Maurici en el caso de Amitges.'
			},
			{
				pregunta: '¿El Tuc de Ratera cuenta como cima esencial?',
				resposta:
					'Sí, es una de las once [cimas esenciales](/cims-essencials) del Pallars Sobirà. Con 2.861 m, es 3 m más bajo que el [Mont-roig](/cims/mont-roig) (2.864 m) y, como el [Gran Tuc de Colomèrs](/cims/gran-tuc-de-colomers), está dentro del parque nacional.'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, VISIT_ARAN, PARC_FAQ],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
