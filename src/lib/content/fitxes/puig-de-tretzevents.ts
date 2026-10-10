import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puig dels Tres Vents (Puig de Tretzevents)',
	url: 'https://ca.wikipedia.org/wiki/Puig_de_Tretzevents',
	consultat: CONSULTAT
};

const REPTES_MUNTANYENCS = {
	nom: 'Reptes Muntanyencs: Puig de Tretzevents',
	url: 'https://reptesmuntanyencs.cat/puig-de-tretzevents/',
	consultat: CONSULTAT
};

const RAFA_YANES = {
	nom: 'Rafa Yanes: ruta Puig de Tretzevents (2731 m), Els 100 Cims',
	url: 'https://rafayanes.com/ruta-puig-de-tretzevents-2731-m-els-100-cims/',
	consultat: CONSULTAT
};

const RETOS_Y_RUTAS = {
	nom: 'Retos, rutas y ratos: ascensión al Pic de Tretzevents desde La Llau',
	url: 'https://retosyrutas.blogspot.com/2016/01/ascension-al-pic-de-tretzevents-2731-m.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-de-tretzevents',
	descripcio: {
		ca: [
			'El Puig de Tretzevents (Puig dels Tres Vents, Pic de Tretzevents) és un cim de 2.731 m del massís del Canigó, al Vallespir, a la [Catalunya Nord](/comarques/catalunya-nord), a prop del límit amb el Conflent. El punt principal marca el límit entre els termes de Cortsaví i el Tec. A uns centenars de metres al nord-oest hi ha una punta secundària de 2.727 m, on conflueixen tres valls i tres termes: la del Cadí (Castell de Vernet), la de la Comalada (el Tec) i la del Riuferrer (Arles). Es troba a poc més de 3 km en línia recta al sud-est del cim del Canigó.',
			"Retos, rutas y ratos el presenta com el segon cim més alt del massís, després del [Canigó](/cims/canigo), i assenyala que el Puig Roig, al sud-oest, només fa 7 m menys. Al nord hi ha el Puig Sec, i a tocar del cim, el pas del Tretzevents (la portella dels Tres Vents, a uns 2.620 m). L'accés és llarg: Rafa Yanes compta uns 16 km de pista des de la D115A, dels quals uns 10 són d'asfalt, i recomana un tot terreny; Reptes Muntanyencs avisa que la pista del pla de Sant Guillem pot estar tancada alguns períodes de l'any.",
			'La vista, segons Retos, rutas y ratos, inclou la portella dels Tres Vents, el Puig Roig, la vall de la Coumelade, el Canigó, el Roc Negre, el [Costabona](/cims/costabona), el Carlit i la vall del Riuferrer. Amb bones condicions, Reptes Muntanyencs hi destaca sobretot el Canigó.',
			"És una ruta d'alta muntanya llarga i, en bona part, sense camí evident; la temporada és d'estiu a principis de tardor. Convé portar un track o un mapa IGN i anar-hi amb el temps estable: Retos, rutas y ratos va voler ser al cim abans de les 11 h perquè s'anunciava vent fort a partir del migdia."
		],
		es: [
			'El Puig de Tretzevents (Puig dels Tres Vents, Pic de Tretzevents) es una cima de 2.731 m del macizo del Canigó, en el Vallespir, en la [Cataluña Norte](/comarques/catalunya-nord), cerca del límite con el Conflent. El punto principal marca el límite entre los términos de Cortsaví y el Tec. A unos cientos de metros al noroeste hay una punta secundaria de 2.727 m, donde confluyen tres valles y tres términos: el del Cadí (Castell de Vernet), el de la Comalada (el Tec) y el del Riuferrer (Arles). Se encuentra a poco más de 3 km en línea recta al sureste de la cima del Canigó.',
			'Retos, rutas y ratos la presenta como la segunda cima más alta del macizo, después del [Canigó](/cims/canigo), y señala que el Puig Roig, al suroeste, solo mide 7 m menos. Al norte está el Puig Sec, y junto a la cima, el paso del Tretzevents (la portella dels Tres Vents, a unos 2.620 m). El acceso es largo: Rafa Yanes cuenta unos 16 km de pista desde la D115A, de los que unos 10 son de asfalto, y recomienda un todoterreno; Reptes Muntanyencs avisa de que la pista del pla de Sant Guillem puede estar cerrada algunos períodos del año.',
			'La vista, según Retos, rutas y ratos, incluye la portella dels Tres Vents, el Puig Roig, el valle de la Coumelade, el Canigó, el Roc Negre, el [Costabona](/cims/costabona), el Carlit y el valle del Riuferrer. Con buenas condiciones, Reptes Muntanyencs destaca sobre todo el Canigó.',
			'Es una ruta de alta montaña larga y, en buena parte, sin camino evidente; la temporada va del verano a principios de otoño. Conviene llevar un track o un mapa IGN e ir con el tiempo estable: Retos, rutas y ratos quiso estar en la cima antes de las 11 h porque se anunciaba viento fuerte a partir del mediodía.'
		]
	},
	rutes: [
		{
			id: 'sant-guillem',
			nom: {
				ca: 'Circular des del pla de Sant Guillem',
				es: 'Circular desde el pla de Sant Guillem'
			},
			sortida: { nom: 'Pla de Sant Guillem (≈ 1.310 m)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Reptes Muntanyencs proposa una circular d'uns 18 km, 1.549 m de desnivell positiu i 7 h 8 min en total, al voltant del GR Tour del Canigó i del Tour del Vallespir. Es puja pel puig dels Pastors (1.874 m) i els Tres Vents d'Avall (2.179 m), es passa per la plataforma d'un repetidor (2.679 m) i es corona el cim, a unes 3 h 40 min de la sortida comptant parades. Segons l'autor, un 60-70 % del recorregut no té camí evident i es fa per fites i per la carena; la baixada cap a la portella dels Tres Vents, per un caos de blocs, demana molta atenció.",
				es: 'Reptes Muntanyencs propone una circular de unos 18 km, 1.549 m de desnivel positivo y 7 h 8 min en total, alrededor del GR Tour del Canigó y del Tour del Vallespir. Se sube por el puig dels Pastors (1.874 m) y els Tres Vents d’Avall (2.179 m), se pasa por la plataforma de un repetidor (2.679 m) y se corona la cima, a unas 3 h 40 min de la salida contando paradas. Según el autor, un 60-70 % del recorrido no tiene camino evidente y se hace por hitos y por la cresta; la bajada hacia la portella dels Tres Vents, por un caos de bloques, exige mucha atención.'
			},
			fonts: [REPTES_MUNTANYENCS]
		},
		{
			id: 'bassibes',
			nom: {
				ca: 'Per la collada de les Roques Blanques i el Bassibès',
				es: 'Por la collada de les Roques Blanques y el Bassibès'
			},
			sortida: { nom: 'Pista de Prats de Molló (D115A)' },
			descripcio: {
				ca: "Rafa Yanes descriu una ruta exigent d'uns 21,4 km i 1.354 m de desnivell positiu: un caminet fins a la collada de les Roques Blanques, uns 4 km de pista pel vessant nord, una pala herbosa fins a la carena, una travessia a uns 2.600 m fins al Pic de Bassibès (2.710 m), una baixada forta fins a la portella del Tretzevents (2.621 m) i un últim tram rocós i molt dret fins al cim; la tornada és pel mateix camí. L'autor l'adverteix exigent per a qui estigui acostumat a rutes de 10-12 km i menys de 800 m de desnivell.",
				es: 'Rafa Yanes describe una ruta exigente de unos 21,4 km y 1.354 m de desnivel positivo: un sendero hasta la collada de les Roques Blanques, unos 4 km de pista por la vertiente norte, una pala herbosa hasta la cresta, una travesía a unos 2.600 m hasta el Pic de Bassibès (2.710 m), una bajada fuerte hasta la portella del Tretzevents (2.621 m) y un último tramo rocoso y muy empinado hasta la cima; la vuelta es por el mismo camino. El autor la advierte exigente para quien esté acostumbrado a rutas de 10-12 km y menos de 800 m de desnivel.'
			},
			fonts: [RAFA_YANES]
		}
	],
	consells: {
		ca: [
			"La pista del pla de Sant Guillem pot estar tancada alguns períodes: si és així, Reptes Muntanyencs proposa sortir del veïnat d'Allau.",
			'Porta mapa IGN 2349 ET (Canigou) o Top 25 i un track: la major part del recorregut no té camí marcat.',
			'El primer tram de la baixada cap a la portella dels Tres Vents demana atenció, per les roques i la forta pendent.',
			"Retos, rutas y ratos va sortir de La Llau a les 6 h i volia ser al cim abans de les 11 h per l'anunci de vent fort: calcula un dia llarg.",
			'No comptis amb el refugi de Sant Guillem com a punt de suport: quan hi va passar Retos, rutas y ratos, era tancat.'
		],
		es: [
			'La pista del pla de Sant Guillem puede estar cerrada algunos períodos: si es así, Reptes Muntanyencs propone salir del vecindario de Allau.',
			'Lleva el mapa IGN 2349 ET (Canigou) o Top 25 y un track: la mayor parte del recorrido no tiene camino marcado.',
			'El primer tramo de la bajada hacia la portella dels Tres Vents exige atención, por las rocas y la fuerte pendiente.',
			'Retos, rutas y ratos salió de La Llau a las 6 h y quería estar en la cima antes de las 11 h por el aviso de viento fuerte: calcula un día largo.',
			'No cuentes con el refugio de Sant Guillem como punto de apoyo: cuando pasó Retos, rutas y ratos, estaba cerrado.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puig de Tretzevents?',
				resposta:
					'Reptes Muntanyencs fa la circular de 18 km des de Sant Guillem en 7 h 8 min en total. Retos, rutas y ratos hi va arribar a les 10.30 h sortint a les 6 h de La Llau, en una circular amb més de 2.000 m de desnivell.'
			},
			{
				pregunta: 'És una ruta senyalitzada?',
				resposta:
					'Només en part. Reptes Muntanyencs diu que un 60-70 % no té camí evident i es guia amb fites, i que les marques de pintura del terreny no sempre coincideixen amb el camí del mapa: val més seguir la pintura.'
			},
			{
				pregunta: "Com s'hi arriba en cotxe?",
				resposta:
					"Segons Rafa Yanes, per una pista d'uns 16 km des de la D115A, amb uns 10 km d'asfalt, i convé un tot terreny. Reptes Muntanyencs avisa que la pista de Sant Guillem pot estar tancada."
			},
			{
				pregunta: 'El Puig de Tretzevents compta com a cim essencial?',
				resposta:
					"Sí. Entre els essencials de la Catalunya Nord, el superen en altitud el Carlit, la Torre d'Eina, el Puig Peric, el [Canigó](/cims/canigo) i la [Cambra d'Ase](/cims/cambra-d-ase), però dins del seu massís només el Canigó és més alt."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puig de Tretzevents?',
				resposta:
					'Reptes Muntanyencs hace la circular de 18 km desde Sant Guillem en 7 h 8 min en total. Retos, rutas y ratos llegó a las 10.30 h saliendo a las 6 h de La Llau, en una circular con más de 2.000 m de desnivel.'
			},
			{
				pregunta: '¿Es una ruta señalizada?',
				resposta:
					'Solo en parte. Reptes Muntanyencs dice que un 60-70 % no tiene camino evidente y se guía con hitos, y que las marcas de pintura del terreno no siempre coinciden con el camino del mapa: es mejor seguir la pintura.'
			},
			{
				pregunta: '¿Cómo se llega en coche?',
				resposta:
					'Según Rafa Yanes, por una pista de unos 16 km desde la D115A, con unos 10 km de asfalto, y conviene un todoterreno. Reptes Muntanyencs avisa de que la pista de Sant Guillem puede estar cerrada.'
			},
			{
				pregunta: '¿El Puig de Tretzevents cuenta como cima esencial?',
				resposta:
					'Sí. Entre las esenciales de Catalunya Nord, la superan en altitud el Carlit, la Torre d’Eina, el Puig Peric, el [Canigó](/cims/canigo) y la [Cambra d’Ase](/cims/cambra-d-ase), pero dentro de su macizo solo el Canigó es más alto.'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES_MUNTANYENCS, RAFA_YANES, RETOS_Y_RUTAS],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
