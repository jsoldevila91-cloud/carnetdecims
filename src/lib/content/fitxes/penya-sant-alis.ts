import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Sant Alís',
	url: 'https://ca.wikipedia.org/wiki/Sant_Al%C3%ADs',
	consultat: CONSULTAT
};

const VIQUIPEDIA_MONTSEC = {
	nom: "Viquipèdia: Montsec d'Ares",
	url: 'https://ca.wikipedia.org/wiki/Montsec_d%27Ares',
	consultat: CONSULTAT
};

const VIQUIPEDIA_SARGA = {
	nom: 'Viquipèdia: Sant Esteve de la Sarga',
	url: 'https://ca.wikipedia.org/wiki/Sant_Esteve_de_la_Sarga',
	consultat: CONSULTAT
};

const FEMTURISME = {
	nom: 'Femturisme: Cim de Sant Alís a la serra del Montsec',
	url: 'https://femturisme.cat/rutes/cim-de-sant-alis-a-la-serra-del-montsec',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Penya Sant Alís',
	url: 'https://reptesmuntanyencs.cat/penya-sant-alis/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'penya-sant-alis',
	descripcio: {
		ca: [
			"La Penya Sant Alís, o simplement Sant Alís, és el punt més alt del Montsec d'Ares. Cau a [la Noguera](/comarques/noguera), al límit amb el Pallars Jussà, entre els termes d'Àger i de Sant Esteve de la Sarga. Segons la Viquipèdia, el Montsec d'Ares és el tram central de la serra del Montsec: ocupa uns 20 km de llarg per 10 d'ample, separa la Conca de Tremp de la vall d'Àger i té més de 180 coves i cavitats al subsòl.",
			"Cap a ponent, el congost de Mont-rebei, obert per la Noguera Ribagorçana, el separa del Montsec d'Estall. A la serra hi ha també l'Observatori Astronòmic del Montsec, que depèn de l'IEEC i és a la Serrat de la Corona, a prop del coll d'Ares; la carretera que hi puja, entre Àger i Sant Esteve de la Sarga, és el punt de sortida de l'excursió més senzilla al cim.",
			"Femturisme el presenta com el segon cim més alt de tota la serra del Montsec, un metre per sota del Tossal de les Torretes, que és al Montsec de Rúbies, i descriu la cimera com un tossal ample. Al cim hi ha un vèrtex geodèsic i, segons el bloc Reptes Muntanyencs, una caseta metàl·lica. La Viquipèdia recorda que l'antiga rampa d'obra per al parapent ja no s'utilitza perquè es considera insegura; el punt d'enlairament actual és uns 100 m per sota del cim.",
			"Les vistes són el motiu principal de la pujada. Segons Femturisme, «en dies clars, distingirem indrets com Montserrat», i també el Pedraforca, la Pica d'Estats, l'Aneto i el Monte Perdido. El bloc parla d'unes vistes de 360 graus. Com que l'àmplia carena no té un corriol fressat, la boira converteix aquesta excursió fàcil en un recorregut on cal saber orientar-se."
		],
		es: [
			"La Penya Sant Alís, o simplemente Sant Alís, es el punto más alto del Montsec d'Ares. Cae en [la Noguera](/comarques/noguera), en el límite con el Pallars Jussà, entre los términos de Àger y de Sant Esteve de la Sarga. Según la Viquipèdia, el Montsec d'Ares es el tramo central de la sierra del Montsec: ocupa unos 20 km de largo por 10 de ancho, separa la Conca de Tremp del valle de Àger y tiene más de 180 cuevas y cavidades en el subsuelo.",
			"Hacia poniente, el congost de Mont-rebei, abierto por la Noguera Ribagorçana, lo separa del Montsec d'Estall. En la sierra está también el Observatori Astronòmic del Montsec, que depende del IEEC y se encuentra en la Serrat de la Corona, cerca del coll d'Ares; la carretera que sube, entre Àger y Sant Esteve de la Sarga, es el punto de salida de la excursión más sencilla a la cima.",
			'Femturisme lo presenta como la segunda cima más alta de toda la sierra del Montsec, un metro por debajo del Tossal de les Torretes, que está en el Montsec de Rúbies, y describe la cumbre como un cerro ancho. En la cima hay un vértice geodésico y, según el blog Reptes Muntanyencs, una caseta metálica. La Viquipèdia recuerda que la antigua rampa de obra para el parapente ya no se utiliza porque se considera insegura; el punto de despegue actual está unos 100 m por debajo de la cima.',
			"Las vistas son el motivo principal de la subida. Según Femturisme, «en días claros distinguiremos lugares como Montserrat», y también el Pedraforca, la Pica d'Estats, el Aneto y el Monte Perdido. El blog habla de unas vistas de 360 grados. Como la amplia cresta no tiene una senda trillada, la niebla convierte esta excursión fácil en un recorrido donde hay que saber orientarse."
		]
	},
	rutes: [
		{
			id: 'observatori',
			nom: {
				ca: "Des de l'aparcament de la carretera de l'Observatori",
				es: 'Desde el aparcamiento de la carretera del Observatori'
			},
			sortida: {
				nom: "Aparcament de la carretera de l'Observatori del Montsec (entre Àger i Sant Esteve de la Sarga)"
			},
			tecnicitat: 'cap',
			descripcio: {
				ca: "Femturisme defineix aquesta ruta com «un itinerari molt senzill i apte per a tots els públics». Surt de l'aparcament de la carretera de l'Observatori, on hi ha un mirador panoràmic cap al Pirineu i la plana de Lleida. Es pot seguir la carena i petits corriols, que passen per un primer turó amb una càmera web i una estació meteorològica; després es retroba la pista al coll del Pas dels Pous de Glaç, es voreja el Cap del Ras i s'acaba per un camí vell en desús. Els darrers 2 km són de pista forestal, que Femturisme proposa fer a peu. La pàgina no dona ni distància, ni desnivell ni temps.",
				es: 'Femturisme define esta ruta como «un itinerario muy sencillo y apto para todos los públicos». Sale del aparcamiento de la carretera del Observatori, donde hay un mirador panorámico hacia el Pirineo y la llanura de Lleida. Se puede seguir la cresta y pequeñas sendas, que pasan por un primer cerro con una cámara web y una estación meteorológica; luego se retoma la pista en el coll del Pas dels Pous de Glaç, se bordea el Cap del Ras y se termina por un camino viejo en desuso. Los últimos 2 km son de pista forestal, que Femturisme propone recorrer a pie. La página no da ni distancia, ni desnivel ni tiempo.'
			},
			fonts: [FEMTURISME]
		},
		{
			id: 'enlairament-carena',
			nom: {
				ca: "Circular des de l'enlairament de parapent per la carena",
				es: 'Circular desde el despegue de parapente por la cresta'
			},
			sortida: { nom: 'Zona d’enlairament de parapent (Montsec d’Ares)' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "El bloc Reptes Muntanyencs en proposa una circular de 4,9 km, uns 157 m de desnivell positiu i 1 h 25 min de marxa efectiva; segons el seu track, la Penya Sant Alís s'assoleix a 1 h 03 min i 2,4 km de la sortida. El recorregut combina pistes i trams sense camí, no està senyalitzat i inclou «un pas una mica delicat (protegit per vegetació)» i, segons el mateix bloc, «una petita grimpada per sortir de nou a la carena». És una variant menys senzilla que la de l'observatori.",
				es: 'El blog Reptes Muntanyencs propone una circular de 4,9 km, unos 157 m de desnivel positivo y 1 h 25 min de marcha efectiva; según su track, la Penya Sant Alís se alcanza a 1 h 03 min y 2,4 km de la salida. El recorrido combina pistas y tramos sin camino, no está señalizado e incluye «un paso algo delicado (protegido por vegetación)» y, según el mismo blog, «una pequeña trepada para salir de nuevo a la cresta». Es una variante menos sencilla que la del observatorio.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"A l'àmplia carena no hi ha un corriol fressat, segons Femturisme: amb boira, no t'hi aventuris sense track, mapa o brúixola.",
			"Femturisme proposa fer a peu els darrers 2 km de pista forestal fins al cim; prepara't per al tram final per un camí vell en desús.",
			"La variant per la carena del bloc té un pas delicat i una petita grimpada: fes-la només si ho tens clar, i en dubte, torna a la ruta de l'observatori.",
			"No utilitzis l'antiga rampa d'obra del parapent: la Viquipèdia indica que està en desús perquè es considera insegura.",
			"Consulta la predicció del Meteocat abans de sortir i recorda que el telèfon d'emergències és el 112."
		],
		es: [
			'En la amplia cresta no hay una senda trillada, según Femturisme: con niebla, no te aventures sin track, mapa o brújula.',
			'Femturisme propone hacer a pie los últimos 2 km de pista forestal hasta la cima; prepárate para el tramo final por un camino viejo en desuso.',
			'La variante por la cresta del blog tiene un paso delicado y una pequeña trepada: hazla solo si lo tienes claro, y en caso de duda vuelve a la ruta del observatorio.',
			'No utilices la antigua rampa de obra del parapente: la Viquipèdia indica que está en desuso porque se considera insegura.',
			'Consulta la predicción de Meteocat antes de salir y recuerda que el teléfono de emergencias es el 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Des d’on es puja més fàcilment a la Penya Sant Alís?',
				resposta:
					"Femturisme proposa sortir de l'aparcament de la carretera de l'Observatori del Montsec, entre Àger i Sant Esteve de la Sarga, i el defineix com un itinerari molt senzill i apte per a tots els públics."
			},
			{
				pregunta: 'Quant es triga a pujar-hi?',
				resposta:
					"Femturisme no dona temps. El bloc Reptes Muntanyencs, en una circular de 4,9 km des de l'enlairament de parapent, situa el cim a 1 h 03 min de la sortida i la marxa efectiva total en 1 h 25 min."
			},
			{
				pregunta: 'La Penya Sant Alís és el cim més alt del Montsec?',
				resposta:
					"És el punt més alt del Montsec d'Ares. Femturisme afegeix que és el segon cim més alt de tota la serra, un metre per sota del Tossal de les Torretes, que és al Montsec de Rúbies, on hi ha també el [Tossal de Mirapallars](/cims/tossal-de-mirapallars)."
			},
			{
				pregunta: 'Compta com a cim essencial?',
				resposta: 'Sí, és un dels quatre [cims essencials](/cims-essencials) de la Noguera.'
			}
		],
		es: [
			{
				pregunta: '¿Desde dónde se sube con más facilidad a la Penya Sant Alís?',
				resposta:
					'Femturisme propone salir del aparcamiento de la carretera del Observatori del Montsec, entre Àger y Sant Esteve de la Sarga, y lo define como un itinerario muy sencillo y apto para todos los públicos.'
			},
			{
				pregunta: '¿Cuánto se tarda en subir?',
				resposta:
					'Femturisme no da tiempos. El blog Reptes Muntanyencs, en una circular de 4,9 km desde el despegue de parapente, sitúa la cima a 1 h 03 min de la salida y la marcha efectiva total en 1 h 25 min.'
			},
			{
				pregunta: '¿La Penya Sant Alís es la cima más alta del Montsec?',
				resposta:
					"Es el punto más alto del Montsec d'Ares. Femturisme añade que es la segunda cima más alta de toda la sierra, un metro por debajo del Tossal de les Torretes, que está en el Montsec de Rúbies, donde se encuentra también el [Tossal de Mirapallars](/cims/tossal-de-mirapallars)."
			},
			{
				pregunta: '¿Cuenta como cima esencial?',
				resposta: 'Sí, es una de las cuatro [cimas esenciales](/cims-essencials) de la Noguera.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_MONTSEC, VIQUIPEDIA_SARGA, FEMTURISME, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
