import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Pic de la Serrera',
	url: 'https://ca.wikipedia.org/wiki/Pic_de_la_Serrera',
	consultat: CONSULTAT
};

const RP_RANSOL = {
	nom: 'Rutes Pirineus: estanys de Ransol i pic de la Serrera per la vall de Ransol',
	url: 'https://www.rutespirineus.cat/rutes/pic-de-la-serrera-canillo-vall-de-ransol',
	consultat: CONSULTAT
};

const RP_SORTENY = {
	nom: 'Rutes Pirineus: pic de la Serrera per la vall de Sorteny',
	url: 'https://www.rutespirineus.cat/rutes/pic-de-la-serrera-ordino-vall-de-sorteny',
	consultat: CONSULTAT
};

const VISIT_ORDINO = {
	nom: 'VisitOrdino: Pic de la Serrera',
	url: 'https://www.visitordino.com/rutes/pic-de-la-serrera',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pic-de-la-serrera',
	descripcio: {
		ca: [
			"El pic de la Serrera és a la frontera entre la parròquia d'Ordino, [a Andorra](/comarques/andorra), i el terme d'Aston, a l'Arieja. Forma part del massís d'Aston i domina dues valls andorranes molt freqüentades pels excursionistes: la de Sorteny, protegida com a parc natural, a ponent, i la de Ransol, a la parròquia de Canillo, a llevant. Entre totes dues hi ha la collada dels Meners, el pas per on arriben al cim les dues rutes clàssiques.",
			"És el quart cim més alt d'Andorra i un dels sis del país que passen dels 2.900 m. El vessant més conegut és la pala sud, una gran pendent que es veu de lluny. La zona té un passat miner: VisitOrdino explica que al camí de Sorteny hi ha restes d'explotacions de ferro dels segles XVII al XIX. A la vall de Sorteny també és fàcil veure-hi isards.",
			"Per la seva posició central, és un bon observatori sobre tots els cims andorrans. En dies clars, Rutes Pirineus cita el [Comapedrosa](/cims/comapedrosa), la Roca Entravessada, el Medacorba, la [Pica d'Estats](/cims/pica-d-estats) i fins i tot l'Aneto entre les muntanyes que es distingeixen des de dalt.",
			"Quan la neu s'ha fos de les pales, cap a l'estiu, la pujada és una excursió llarga però sense passos tècnics. A l'hivern es puja amb neu i gel, i aleshores l'ascensió és una sortida d'alta muntanya que demana material i experiència. A l'estiu, compte amb les tempestes de tarda: per sobre de la collada dels Meners no hi ha on aixoplugar-se."
		],
		es: [
			'El pic de la Serrera está en la frontera entre la parroquia de Ordino, [en Andorra](/comarques/andorra), y el término de Aston, en el Ariège. Forma parte del macizo de Aston y domina dos valles andorranos muy frecuentados por los excursionistas: el de Sorteny, protegido como parque natural, al oeste, y el de Ransol, en la parroquia de Canillo, al este. Entre ambos está la collada dels Meners, el paso por el que llegan a la cima las dos rutas clásicas.',
			'Es la cuarta cima más alta de Andorra y una de las seis del país que superan los 2.900 m. La vertiente más conocida es la pala sur, una gran pendiente que se ve de lejos. La zona tiene un pasado minero: VisitOrdino explica que en el camino de Sorteny hay restos de explotaciones de hierro de los siglos XVII al XIX. En el valle de Sorteny también es fácil ver sarrios.',
			"Por su posición central, es un buen observatorio sobre todas las cimas andorranas. En días claros, Rutes Pirineus cita el [Comapedrosa](/cims/comapedrosa), la Roca Entravessada, el Medacorba, la [Pica d'Estats](/cims/pica-d-estats) e incluso el Aneto entre las montañas que se distinguen desde arriba.",
			'Cuando la nieve se ha fundido en las palas, hacia el verano, la subida es una excursión larga pero sin pasos técnicos. En invierno se sube con nieve y hielo, y entonces la ascensión es una salida de alta montaña que exige material y experiencia. En verano, cuidado con las tormentas de tarde: por encima de la collada dels Meners no hay dónde resguardarse.'
		]
	},
	rutes: [
		{
			id: 'ransol',
			nom: {
				ca: 'Des de la coma de Ransol pels estanys i la collada dels Meners',
				es: 'Desde la coma de Ransol por los lagos y la collada dels Meners'
			},
			sortida: { nom: 'Final de la carretera de la coma de Ransol (Canillo, 1.944 m)' },
			tempsMinuts: 145,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Del poble de Ransol se segueix la carretera de la coma de Ransol fins al final, on hi ha una petita esplanada per aparcar. El camí remunta la vall pels prats i passa pels estanys de Ransol (1 h) fins al circ i la collada dels Meners (2 h 05 min). L'últim tram puja per un pendent herbós i pedregós força dret fins al cim, que Rutes Pirineus situa a 2 h 25 min. Cap pas demana les mans, però el desnivell és considerable.",
				es: 'Desde el pueblo de Ransol se sigue la carretera de la coma de Ransol hasta el final, donde hay una pequeña explanada para aparcar. El camino remonta el valle por los prados y pasa por los lagos de Ransol (1 h) hasta el circo y la collada dels Meners (2 h 05 min). El último tramo sube por una pendiente herbosa y pedregosa bastante empinada hasta la cima, que Rutes Pirineus sitúa a 2 h 25 min. Ningún paso exige las manos, pero el desnivel es considerable.'
			},
			fonts: [RP_RANSOL]
		},
		{
			id: 'sorteny',
			nom: {
				ca: 'Des del parc natural de la vall de Sorteny',
				es: 'Desde el parque natural de la vall de Sorteny'
			},
			sortida: { nom: 'Aparcament de la Canya de la Rabassa (Ordino, 1.783 m)' },
			desnivellPositiuM: 1133,
			distanciaKm: 6.1,
			tempsMinuts: 225,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Des de l'aparcament del parc natural es passa pel refugi de la Borda de Sorteny i es puja al pas de la Serrera i la pleta de la Serrera, amb una cabana de pastor. Després es remunta fins a la collada dels Meners, entre tarteres, i s'acaba pel pendent final. Rutes Pirineus hi compta 3 h 45 min de pujada, i VisitOrdino, que la qualifica de difícil, uns 12 km i 1.133 m de desnivell anada i tornada pel mateix camí.",
				es: 'Desde el aparcamiento del parque natural se pasa por el refugio de la Borda de Sorteny y se sube al pas de la Serrera y la pleta de la Serrera, con una cabaña de pastor. Después se remonta hasta la collada dels Meners, entre pedreras, y se termina por la pendiente final. Rutes Pirineus calcula 3 h 45 min de subida, y VisitOrdino, que la califica de difícil, unos 12 km y 1.133 m de desnivel ida y vuelta por el mismo camino.'
			},
			fonts: [RP_SORTENY, VISIT_ORDINO]
		}
	],
	consells: {
		ca: [
			"A la ruta de Sorteny no hi ha aigua segons VisitOrdino: porta'n prou per a tot el dia.",
			"El refugi de la Borda de Sorteny, guardat, i la cabana de la pleta de la Serrera poden servir per repartir l'ascensió o aixoplugar-se si el temps canvia.",
			'No baixis per terreny sense camí si no tens experiència: Rutes Pirineus avisa que la variant de baixada de la seva volta per Sorteny passa per terreny molt irregular i pedregós.',
			"Amb neu, les pales de sota el cim tenen risc d'allaus: consulta el butlletí del servei meteorològic d'Andorra i porta grampons i piolet."
		],
		es: [
			'En la ruta de Sorteny no hay agua según VisitOrdino: lleva suficiente para todo el día.',
			'El refugio de la Borda de Sorteny, guardado, y la cabaña de la pleta de la Serrera pueden servir para repartir la ascensión o resguardarse si el tiempo cambia.',
			'No bajes por terreno sin camino si no tienes experiencia: Rutes Pirineus avisa de que la variante de bajada de su vuelta por Sorteny pasa por terreno muy irregular y pedregoso.',
			'Con nieve, las palas bajo la cima tienen riesgo de aludes: consulta el boletín del servicio meteorológico de Andorra y lleva crampones y piolet.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al pic de la Serrera?',
				resposta:
					"Des de la coma de Ransol, unes 2 h 25 min segons Rutes Pirineus. Des de l'aparcament de Sorteny, unes 3 h 45 min de pujada; VisitOrdino hi compta unes 7 h anada i tornada."
			},
			{
				pregunta: 'Quina és la ruta més curta per pujar a la Serrera?',
				resposta:
					'La de la vall de Ransol, a Canillo: surt més amunt i passa pels estanys de Ransol fins a la collada dels Meners. La de Sorteny és més llarga però travessa el parc natural.'
			},
			{
				pregunta: 'La Serrera té passos difícils?',
				resposta:
					"No hi ha grimpades a les rutes normals, però sí tarteres i un tram final molt dret. VisitOrdino la classifica com a difícil i hi indica passos perillosos. Amb neu, és una ascensió d'alta muntanya."
			},
			{
				pregunta: 'El pic de la Serrera compta com a cim essencial?',
				resposta:
					'Sí. Entre els [cims essencials](/cims-essencials) andorrans, només el [Comapedrosa](/cims/comapedrosa) el supera en altitud. Compta tant si hi puges per Ransol com per Sorteny.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al pic de la Serrera?',
				resposta:
					'Desde la coma de Ransol, unas 2 h 25 min según Rutes Pirineus. Desde el aparcamiento de Sorteny, unas 3 h 45 min de subida; VisitOrdino calcula unas 7 h ida y vuelta.'
			},
			{
				pregunta: '¿Cuál es la ruta más corta para subir a la Serrera?',
				resposta:
					'La del valle de Ransol, en Canillo: sale más arriba y pasa por los lagos de Ransol hasta la collada dels Meners. La de Sorteny es más larga pero cruza el parque natural.'
			},
			{
				pregunta: '¿La Serrera tiene pasos difíciles?',
				resposta:
					'No hay trepadas en las rutas normales, pero sí pedreras y un tramo final muy empinado. VisitOrdino la clasifica como difícil e indica pasos peligrosos. Con nieve, es una ascensión de alta montaña.'
			},
			{
				pregunta: '¿El pic de la Serrera cuenta como cima esencial?',
				resposta:
					'Sí. Entre las [cimas esenciales](/cims-essencials) andorranas, solo el [Comapedrosa](/cims/comapedrosa) la supera en altitud. Cuenta tanto si subes por Ransol como por Sorteny.'
			}
		]
	},
	fonts: [VIQUIPEDIA, RP_RANSOL, RP_SORTENY, VISIT_ORDINO],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
