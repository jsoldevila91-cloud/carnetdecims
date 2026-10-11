import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

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
			"La Penya Sant Alís, o simplement Sant Alís, és el punt més alt del Montsec d'Ares, el tram de la serra comprès entre els congostos de Mont-rebei i de Terradets. És a [la Noguera](/comarques/noguera), al límit amb el Pallars Jussà, entre els termes d'Àger i de Sant Esteve de la Sarga. El Montsec d'Ares fa uns 20 km de llarg per 10 d'ample i separa la vall d'Àger de la Conca de Tremp.",
			"Com a tot el Montsec, la carena es manté gairebé sempre a la mateixa alçada: pel sud cau en un cingle continu sobre la vall d'Àger. Sant Alís és el segon cim de tota la serra, només un metre per sota del Tossal de les Torretes, que és al Montsec de Rúbies, al costat del [Tossal de Mirapallars](/cims/tossal-de-mirapallars). El cim és un tossal ample amb un vèrtex geodèsic i una caseta metàl·lica. Hi queda també una antiga rampa d'obra per al parapent, en desús perquè es considera poc segura; els parapentistes surten ara d'un punt més baix, prop del coll d'Ares.",
			"La vista és el motiu de la pujada. En dies clars es distingeixen Montserrat, el Pedraforca, la Pica d'Estats, l'Aneto i el Mont Perdut, a més de la plana de Lleida i de tot el fil de la serra; la Viquipèdia hi afegeix el Montseny, el Caro, les muntanyes de Prades i el Montsant, la serra de Guara i el Moncayo.",
			"Hi ha una pista que arriba fins a dalt, de manera que la caminada és curta i sense cap pas difícil. El que cal vigilar és el temps: la carena és pelada, sense cap aixopluc, i les tempestes s'hi presenten de pressa. A la mateixa carretera hi ha l'Observatori Astronòmic del Montsec."
		],
		es: [
			"La Penya Sant Alís, o simplemente Sant Alís, es el punto más alto del Montsec d'Ares, el tramo de la sierra comprendido entre los desfiladeros de Mont-rebei y de Terradets. Está en [la Noguera](/comarques/noguera), en el límite con el Pallars Jussà, entre los términos de Àger y de Sant Esteve de la Sarga. El Montsec d'Ares mide unos 20 km de largo por 10 de ancho y separa el valle de Àger de la Conca de Tremp.",
			"Como en todo el Montsec, la cresta se mantiene casi siempre a la misma altura: por el sur cae en un risco continuo sobre el valle de Àger. Sant Alís es la segunda cima de toda la sierra, solo un metro por debajo del Tossal de les Torretes, que está en el Montsec de Rúbies, junto al [Tossal de Mirapallars](/cims/tossal-de-mirapallars). La cima es un cerro ancho con un vértice geodésico y una caseta metálica. Queda también una antigua rampa de obra para el parapente, en desuso porque se considera poco segura; los parapentistas despegan ahora de un punto más bajo, cerca del coll d'Ares.",
			"La vista es el motivo de la subida. En días claros se distinguen Montserrat, el Pedraforca, la Pica d'Estats, el Aneto y el Monte Perdido, además del llano de Lleida y de todo el hilo de la sierra; la Viquipèdia añade el Montseny, el Caro, las montañas de Prades y el Montsant, la sierra de Guara y el Moncayo.",
			'Hay una pista que llega hasta arriba, de modo que la caminata es corta y sin ningún paso difícil. Lo que hay que vigilar es el tiempo: la cresta es pelada, sin ningún resguardo, y las tormentas se presentan deprisa. En la misma carretera está el Observatori Astronòmic del Montsec.'
		]
	},
	rutes: [
		{
			id: 'observatori',
			nom: {
				ca: "Des de la carretera de l'Observatori del Montsec",
				es: 'Desde la carretera del Observatori del Montsec'
			},
			sortida: {
				nom: "Aparcament i mirador de la carretera de l'Observatori del Montsec (entre Àger i Sant Esteve de la Sarga)"
			},
			distanciaKm: 2,
			tecnicitat: 'cap',
			descripcio: {
				ca: "Femturisme el descriu com un itinerari molt senzill i apte per a tots els públics: es deixa el cotxe a l'aparcament que hi ha al costat de la carretera que puja a l'Observatori, on hi ha un mirador, i es fan a peu els darrers 2 km de pista forestal. Es pot seguir sempre la pista o guanyar la carena per corriols fins a un primer turó amb una càmera web i una estació meteorològica, retrobar la pista al coll del Pas dels Pous de Glaç, vorejar el Cap del Ras per l'obaga i, des d'un collet, agafar una pista antiga que deixa al cim. Es torna per la pista, que voreja la carena pel nord.",
				es: 'Femturisme lo describe como un itinerario muy sencillo y apto para todos los públicos: se deja el coche en el aparcamiento que hay junto a la carretera que sube al Observatori, donde hay un mirador, y se hacen a pie los últimos 2 km de pista forestal. Se puede seguir siempre la pista o ganar la cresta por sendas hasta un primer cerro con una cámara web y una estación meteorológica, recuperar la pista en el coll del Pas dels Pous de Glaç, bordear el Cap del Ras por la umbría y, desde un collado, tomar una pista antigua que deja en la cima. Se vuelve por la pista, que bordea la cresta por el norte.'
			},
			fonts: [FEMTURISME]
		}
	],
	consells: {
		ca: [
			"No t'acostis a la vora del cingle sud ni baixis a les feixes que corren per sota de la carena: no són camins i se'n surt grimpant.",
			'Amb previsió de tempesta, deixa-ho per a un altre dia; a la carena no hi ha on arrecerar-se.',
			"També es pot sortir de la zona d'enlairament de parapent, prop del coll d'Ares: per la pista, anar i tornar són uns 5 km amb poc més de 150 m de desnivell, segons el track del bloc Reptes Muntanyencs.",
			'No hi ha aigua ni ombra en tot el recorregut.'
		],
		es: [
			'No te acerques al borde del risco sur ni bajes a las fajas que corren por debajo de la cresta: no son caminos y se sale de ellas trepando.',
			'Con previsión de tormenta, déjalo para otro día; en la cresta no hay dónde resguardarse.',
			"También se puede salir de la zona de despegue de parapente, cerca del coll d'Ares: por la pista, ir y volver son unos 5 km con poco más de 150 m de desnivel, según el track del blog Reptes Muntanyencs.",
			'No hay agua ni sombra en todo el recorrido.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Des d'on es puja més fàcilment a la Penya Sant Alís?",
				resposta:
					"Des de l'aparcament de la carretera de l'Observatori del Montsec, entre Àger i Sant Esteve de la Sarga. Queden uns 2 km de pista forestal fins al cim, sense cap dificultat."
			},
			{
				pregunta: 'Es pot fer amb nens?',
				resposta:
					"Sí: és una pista forestal amb poc desnivell i Femturisme la considera apta per a tots els públics. L'única precaució és no deixar-los acostar al cingle del costat sud."
			},
			{
				pregunta: 'La Penya Sant Alís és el cim més alt del Montsec?',
				resposta:
					"És el més alt del Montsec d'Ares. El sostre de tota la serra és el Tossal de les Torretes, al Montsec de Rúbies, un metre més alt."
			},
			{
				pregunta: 'Compta com a cim essencial?',
				resposta:
					'Sí, és un dels quatre [cims essencials](/cims-essencials) de la Noguera, amb la [Pala Alta](/cims/pala-alta), [Sant Mamet](/cims/sant-mamet) i el Tossal de Mirapallars.'
			}
		],
		es: [
			{
				pregunta: '¿Desde dónde se sube con más facilidad a la Penya Sant Alís?',
				resposta:
					'Desde el aparcamiento de la carretera del Observatori del Montsec, entre Àger y Sant Esteve de la Sarga. Quedan unos 2 km de pista forestal hasta la cima, sin ninguna dificultad.'
			},
			{
				pregunta: '¿Se puede hacer con niños?',
				resposta:
					'Sí: es una pista forestal con poco desnivel y Femturisme la considera apta para todos los públicos. La única precaución es no dejar que se acerquen al risco del lado sur.'
			},
			{
				pregunta: '¿La Penya Sant Alís es la cima más alta del Montsec?',
				resposta:
					"Es la más alta del Montsec d'Ares. El techo de toda la sierra es el Tossal de les Torretes, en el Montsec de Rúbies, un metro más alto."
			},
			{
				pregunta: '¿Cuenta como cima esencial?',
				resposta:
					'Sí, es una de las cuatro [cimas esenciales](/cims-essencials) de la Noguera, con la [Pala Alta](/cims/pala-alta), [Sant Mamet](/cims/sant-mamet) y el Tossal de Mirapallars.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_MONTSEC, FEMTURISME, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
