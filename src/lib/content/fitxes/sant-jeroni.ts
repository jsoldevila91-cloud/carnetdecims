import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-03';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Sant Jeroni (Montserrat)',
	url: 'https://ca.wikipedia.org/wiki/Sant_Jeroni_(Montserrat)',
	consultat: CONSULTAT
};

const PATRONAT = {
	nom: 'Patronat de la Muntanya de Montserrat: itinerari del Monestir al cim de Sant Jeroni',
	url: 'https://muntanyamontserrat.gencat.cat/ca/el_parc/senderisme/itineraris_montserrat/monestir_cim_sant_jeroni/',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: 'Rutes Pirineus: la Miranda de Sant Jeroni a Montserrat',
	url: 'https://www.rutespirineus.cat/rutes/ascensio-miranda-sant-jeroni-montserrat',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'sant-jeroni',
	descripcio: {
		ca: [
			"Sant Jeroni és el punt més alt de Montserrat. El cim, també anomenat la Miranda de Sant Jeroni, és on es troben els termes del Bruc, [a l'Anoia](/comarques/anoia), i de Marganell i Monistrol de Montserrat, al Bages, dins del Parc Natural de la Muntanya de Montserrat. Com tota la muntanya, és fet de conglomerat, i el camí hi arriba entre agulles i monòlits que només es veuen en aquest massís.",
			"El nom ve de l'antiga ermita de Sant Jeroni, una de les que els ermitans de Montserrat van escampar per la muntanya. La capella encara es manté a tocar del cim, al costat de l'antiga ermita, i per sota hi ha els miradors que fan famós el lloc, com el de Mossèn Cinto. Sant Jeroni també té història científica: a finals del segle XVIII va ser un dels vèrtexs de la triangulació del meridià que va servir per definir el metre, i el senyal es va construir davant mateix de la capella. Avui hi ha un vèrtex geodèsic i una taula d'orientació.",
			"La vista és potser la més celebrada de la Catalunya central: segons el Patronat de la Muntanya, amb dia clar es pot identificar el relleu del Pirineu als Ports i fins i tot Mallorca. Al voltant, les agulles de Montserrat i cims del repte tan propers com el [Montgròs](/cims/montgros) o [l'Elefant](/cims/elefant-roca-de-sant-salvador).",
			"Es pot pujar tot l'any. El Patronat demana prudència a l'estiu, per la calor, i a l'hivern, amb fred, boira o pluja. Hi ha trams amb risc de despreniments: no surtis dels camins senyalitzats."
		],
		es: [
			'Sant Jeroni es el punto más alto de Montserrat. La cima, también llamada la Miranda de Sant Jeroni, es donde confluyen los municipios de el Bruc, [en la Anoia](/comarques/anoia), y de Marganell y Monistrol de Montserrat, en el Bages, dentro del Parque Natural de la Montaña de Montserrat. Como toda la montaña, está hecha de conglomerado, y el camino llega entre agujas y monolitos que solo se ven en este macizo.',
			'El nombre viene de la antigua ermita de Sant Jeroni, una de las que los ermitaños de Montserrat repartieron por la montaña. La capilla sigue en pie junto a la cima, al lado de la antigua ermita, y por debajo están los miradores que hacen famoso el lugar, como el de Mossèn Cinto. Sant Jeroni tiene también historia científica: a finales del siglo XVIII fue uno de los vértices de la triangulación del meridiano con la que se definió el metro, y la señal se construyó justo delante de la capilla. Hoy hay un vértice geodésico y una mesa de orientación.',
			"La vista es quizá la más celebrada de la Cataluña central: según el Patronat de la Muntanya, con día claro se puede identificar el relieve del Pirineo a los Ports e incluso Mallorca. Alrededor, las agujas de Montserrat y cimas del reto tan cercanas como el [Montgròs](/cims/montgros) o [l'Elefant](/cims/elefant-roca-de-sant-salvador).",
			'Se puede subir todo el año. El Patronat pide prudencia en verano, por el calor, y en invierno, con frío, niebla o lluvia. Hay tramos con riesgo de desprendimientos: no salgas de los caminos señalizados.'
		]
	},
	rutes: [
		{
			id: 'monestir-sant-miquel',
			nom: {
				ca: 'Des del monestir pel camí de Sant Miquel',
				es: 'Desde el monasterio por el camino de Sant Miquel'
			},
			sortida: { nom: 'Estació del cremallera de Montserrat (705 m)' },
			tempsMinuts: 155,
			tecnicitat: 'cap',
			descripcio: {
				ca: "Ruta a peu sencera des del monestir: es puja pel camí de l'ermita de Sant Miquel fins a l'altiplà del funicular de Sant Joan i es continua fins al cim. Rutes Pirineus la planteja gairebé circular, amb 10,1 km, 565 m de desnivell i unes 4 h en total, baixant pel torrent de Santa Maria.",
				es: 'Ruta a pie completa desde el monasterio: se sube por el camino de la ermita de Sant Miquel hasta el altiplano del funicular de Sant Joan y se continúa hasta la cima. Rutes Pirineus la plantea casi circular, con 10,1 km, 565 m de desnivel y unas 4 h en total, bajando por el torrente de Santa Maria.'
			},
			fonts: [RUTES_PIRINEUS]
		},
		{
			id: 'funicular-sant-joan',
			nom: { ca: 'Des del funicular de Sant Joan', es: 'Desde el funicular de Sant Joan' },
			sortida: { nom: 'Pla de les Taràntules (estació superior del funicular de Sant Joan)' },
			tecnicitat: 'cap',
			descripcio: {
				ca: "La manera més còmoda. Des de l'estació superior del funicular, el camí passa per les Gorres i el mirador de la serra de les Paparres, travessa un torrent per una passera de fusta i arriba a la capella de Sant Jeroni. El Patronat el descriu com un itinerari de dificultat moderada, de 7 km i unes 2 h 30 min, amb tornada pel mateix camí o pel camí vell de Sant Jeroni fins al monestir.",
				es: 'La forma más cómoda. Desde la estación superior del funicular, el camino pasa por las Gorres y el mirador de la sierra de les Paparres, cruza un torrente por una pasarela de madera y llega a la capilla de Sant Jeroni. El Patronat lo describe como un itinerario de dificultad moderada, de 7 km y unas 2 h 30 min, con vuelta por el mismo camino o por el camí vell de Sant Jeroni hasta el monasterio.'
			},
			fonts: [PATRONAT]
		}
	],
	consells: {
		ca: [
			"Si puges amb el funicular de Sant Joan, consulta l'horari de l'últim trajecte de baixada.",
			"Els caps de setmana l'aparcament del monestir s'omple aviat; el cremallera i l'aeri són una bona alternativa.",
			"A l'estiu surt d'hora: a Montserrat hi ha poca ombra i la roca acumula molta calor.",
			"Hi ha zones senyalitzades amb risc de despreniments: no t'aturis a sota de les parets.",
			'Porta els gossos lligats, tal com demana el Patronat.'
		],
		es: [
			'Si subes en el funicular de Sant Joan, consulta el horario del último trayecto de bajada.',
			'Los fines de semana el aparcamiento del monasterio se llena pronto; el cremallera y el aéreo son una buena alternativa.',
			'En verano sal temprano: en Montserrat hay poca sombra y la roca acumula mucho calor.',
			'Hay zonas señalizadas con riesgo de desprendimientos: no te pares debajo de las paredes.',
			'Lleva los perros atados, tal como pide el Patronat.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Sant Jeroni?',
				resposta:
					"Des del monestir, a peu, unes 2 h 35 min fins al cim segons Rutes Pirineus. Amb el funicular de Sant Joan l'excursió s'escurça: el Patronat la calcula en unes 2 h 30 min per a tot l'itinerari."
			},
			{
				pregunta: 'Es pot pujar a Sant Jeroni amb nens?',
				resposta:
					"Sí, sobretot si s'agafa el funicular de Sant Joan: el camí és ben senyalitzat i sense passos difícils. L'últim tram té escales, i als miradors cal vigilar de prop els més petits."
			},
			{
				pregunta: 'Què es veu des de Sant Jeroni?',
				resposta:
					"Segons el Patronat, des de la taula d'orientació del cim es pot identificar el relleu des del Pirineu fins als Ports i, amb dies molt clars, Mallorca."
			},
			{
				pregunta: 'Sant Jeroni és un cim essencial?',
				resposta:
					'Sí, és un dels [cims essencials](/cims-essencials) del repte. A Montserrat també hi ha el [Montgròs](/cims/montgros), molt a prop.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Sant Jeroni?',
				resposta:
					'Desde el monasterio, a pie, unas 2 h 35 min hasta la cima según Rutes Pirineus. Con el funicular de Sant Joan la excursión se acorta: el Patronat la calcula en unas 2 h 30 min para todo el itinerario.'
			},
			{
				pregunta: '¿Se puede subir a Sant Jeroni con niños?',
				resposta:
					'Sí, sobre todo si se coge el funicular de Sant Joan: el camino está bien señalizado y sin pasos difíciles. El último tramo tiene escaleras, y en los miradores hay que vigilar de cerca a los más pequeños.'
			},
			{
				pregunta: '¿Qué se ve desde Sant Jeroni?',
				resposta:
					'Según el Patronat, desde la mesa de orientación de la cima se puede identificar el relieve desde el Pirineo hasta los Ports y, en días muy claros, Mallorca.'
			},
			{
				pregunta: '¿Sant Jeroni es una cima esencial?',
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) del reto. En Montserrat también está el [Montgròs](/cims/montgros), muy cerca.'
			}
		]
	},
	wikiloc: [
		{
			id: 8460531,
			titol: 'Montserrat: Del Monestir a Sant Jeroni',
			url: 'https://ca.wikiloc.com/rutes-senderisme/montserrat-del-monestir-a-sant-jeroni-8460531'
		},
		{
			id: 2457000,
			titol: 'FUNICULAR SANT JOAN- SANT JERONI- MONASTERIO',
			url: 'https://ca.wikiloc.com/rutes-senderisme/funicular-sant-joan-sant-jeroni-monasterio-2457000'
		}
	],
	fonts: [VIQUIPEDIA, PATRONAT, RUTES_PIRINEUS],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
