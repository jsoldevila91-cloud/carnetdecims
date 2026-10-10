import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Monturull',
	url: 'https://ca.wikipedia.org/wiki/Monturull',
	consultat: CONSULTAT
};

const HIKINGIBERIA = {
	nom: 'Hiking Iberia: Pyrenees, Monturull',
	url: 'https://www.hikingiberia.com/en/routes/pyrenees-monturull/',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS_PERA = {
	nom: 'Rutes Pirineus: estanys de la Pera des de les Pollineres (Lles de Cerdanya)',
	url: 'https://www.rutespirineus.cat/rutes/estanys-de-la-pera-pollineres-lles-cerdanya',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'monturull',
	descripcio: {
		ca: [
			"El Monturull, també conegut com la Torre dels Soldats o la Torreta del Soldat, és un cim fronterer on es troben tres termes: les Valls de Valira, a [l'Alt Urgell](/comarques/alt-urgell); Lles de Cerdanya, a la Cerdanya, i la parròquia d'Escaldes-Engordany, a Andorra. La Viquipèdia el situa dins de dos espais protegits, el de la Tossa Plana de Lles i el Puigpedrós i el de la vall del Madriu-Perafita-Claror, i el descriu de roca metamòrfica.",
			"L'aproximació habitual és per la banda cerdana. Es surt de les Pollineres i es puja als estanys de la Pera, dos llacs d'origen glacial (el gran, a uns 2.350 m, i el petit, a 2.310 m) en un circ als peus del Pic de Perafita. A la vora hi ha el refugi dels Estanys de la Pera (2.357 m), de la FEEC, on es pot fer un cafè o un refresc. Del refugi, el GR 11 s'enfila cap al portell de Sant Vicenç i el Pic de Perafita; seguint la carena cap al sud-oest apareix el Monturull.",
			"Rutes Pirineus el compta entre els cims més freqüentats de la carena fronterera entre la Cerdanya i Andorra. La gràcia de la pujada és el tram de cresta entre el portell de Sant Vicenç, el Pic de Perafita i el coll de Claró, amb el vessant andorrà del Madriu-Perafita-Claror a un costat i els estanys de la Pera a l'altre. A la mateixa carena hi ha altres essencials, com la [Tossa Plana de Lles](/cims/tossa-plana-de-lles) i el [Puigpedrós](/cims/puigpedros).",
			"La temporada és l'estiu i la tardor, quan la pista de terra de les Pollineres és oberta. Segons Rutes Pirineus, l'accés amb cotxe privat a les pistes de Lles i d'Aransa és restringit; fora de la temporada de la llançadora, la sortida es fa des del Fornell i la caminada s'allarga considerablement. És alta muntanya: a l'estiu, surt d'hora per evitar les tempestes de tarda."
		],
		es: [
			'El Monturull, también conocido como la Torre dels Soldats o la Torreta del Soldat, es una cima fronteriza donde se encuentran tres términos: las Valls de Valira, en [el Alt Urgell](/comarques/alt-urgell); Lles de Cerdanya, en la Cerdaña, y la parroquia de Escaldes-Engordany, en Andorra. La Viquipèdia lo sitúa dentro de dos espacios protegidos, el de la Tossa Plana de Lles y el Puigpedrós y el del valle del Madriu-Perafita-Claror, y lo describe de roca metamórfica.',
			'La aproximación habitual es por el lado cerdano. Se sale de las Pollineres y se sube a los estanys de la Pera, dos lagos de origen glaciar (el grande, a unos 2.350 m, y el pequeño, a 2.310 m) en un circo a los pies del Pic de Perafita. Cerca está el refugio de los Estanys de la Pera (2.357 m), de la FEEC, donde se puede tomar un café o un refresco. Desde el refugio, el GR 11 sube hacia el portell de Sant Vicenç y el Pic de Perafita; siguiendo la cresta hacia el suroeste aparece el Monturull.',
			'Rutes Pirineus lo cuenta entre las cimas más frecuentadas de la cresta fronteriza entre la Cerdanya y Andorra. La gracia de la subida es el tramo de cresta entre el portell de Sant Vicenç, el Pic de Perafita y el coll de Claró, con la vertiente andorrana del Madriu-Perafita-Claror a un lado y los estanys de la Pera al otro. En la misma cresta hay otras esenciales, como la [Tossa Plana de Lles](/cims/tossa-plana-de-lles) y el [Puigpedrós](/cims/puigpedros).',
			'La temporada es el verano y el otoño, cuando la pista de tierra de las Pollineres está abierta. Según Rutes Pirineus, el acceso en coche privado a las pistas de Lles y de Aransa está restringido; fuera de la temporada de la lanzadera, la salida se hace desde el Fornell y la caminata se alarga considerablemente. Es alta montaña: en verano, sal temprano para evitar las tormentas de tarde.'
		]
	},
	rutes: [
		{
			id: 'pollineres',
			nom: {
				ca: "Des de les Pollineres per l'estany de la Pera i el Perafita",
				es: 'Desde las Pollineres por el estany de la Pera y el Perafita'
			},
			sortida: { nom: 'Les Pollineres (Lles de Cerdanya, 2.140 m)' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Circular d'uns 10 km i 3 h 45 min segons Hiking Iberia. De les Pollineres es puja al refugi dels Estanys de la Pera; del refugi, pel GR 11, al portell de Sant Vicenç, i per la carena al Pic de Perafita. Es baixa al coll de Claró i, des d'allà, el Monturull és una pujada curta amb passos on cal posar les mans de tant en tant. Es torna pel coll de Claró i el gran estany, i per pista fins a les Pollineres.",
				es: 'Circular de unos 10 km y 3 h 45 min según Hiking Iberia. De las Pollineres se sube al refugio de los Estanys de la Pera; del refugio, por el GR 11, al portell de Sant Vicenç, y por la cresta al Pic de Perafita. Se baja al coll de Claró y, desde allí, el Monturull es una subida corta con pasos en los que hay que poner las manos de vez en cuando. Se vuelve por el coll de Claró y el gran estany, y por pista hasta las Pollineres.'
			},
			fonts: [HIKINGIBERIA, RUTES_PIRINEUS_PERA, VIQUIPEDIA]
		}
	],
	consells: {
		ca: [
			"Entre l'1 d'agost i l'11 de setembre hi ha una llançadora a les Pollineres des del refugi del Cap del Rec (Lles) i des del Fornell (Aransa). La resta de l'any, la sortida és al Fornell i el recorregut s'allarga.",
			'Els passos finals del Monturull demanen les mans: no hi pugis amb pluja ni amb roca humida.',
			'Entre el portell de Sant Vicenç i el Perafita, la carena es fa seguint fites: Hiking Iberia indica marques blanques i vermelles, blanques i grogues i fites.',
			'Pots fer una pausa al refugi dels Estanys de la Pera (FEEC): serveix begudes i refrigeris, però comprova si és obert abans de comptar-hi.',
			"Amb boira, valora girar cua: entre el Perafita i el coll de Claró el recorregut va per carena i t'has de guiar per fites."
		],
		es: [
			'Entre el 1 de agosto y el 11 de septiembre hay una lanzadera a las Pollineres desde el refugio del Cap del Rec (Lles) y desde el Fornell (Aransa). El resto del año, la salida es en el Fornell y el recorrido se alarga.',
			'Los pasos finales del Monturull piden las manos: no subas con lluvia ni con roca húmeda.',
			'Entre el portell de Sant Vicenç y el Perafita, la cresta se hace siguiendo hitos: Hiking Iberia indica marcas blancas y rojas, blancas y amarillas e hitos.',
			'Puedes hacer una pausa en el refugio de los Estanys de la Pera (FEEC): sirve bebidas y refrigerios, pero comprueba si está abierto antes de contar con él.',
			'Con niebla, valora darte la vuelta: entre el Perafita y el coll de Claró el recorrido va por la cresta y te guías por hitos.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Des d'on es puja al Monturull?",
				resposta:
					'El camí clàssic surt de les Pollineres (Lles de Cerdanya), a 2.140 m, i passa pel refugi dels Estanys de la Pera i el Pic de Perafita. Hi ha una altra via, des de la vall de Claror, a Andorra, que la Viquipèdia també cita.'
			},
			{
				pregunta: 'Quant dura la circular?',
				resposta:
					"Hiking Iberia calcula 10 km, 3 h 45 min i uns 807 m de diferència d'altitud per a la circular des de les Pollineres."
			},
			{
				pregunta: 'És un cim fàcil?',
				resposta:
					'Hiking Iberia la qualifica de dificultat mitjana (6 sobre 15) i avisa que, a la pujada final, hi ha trams on cal posar les mans i vigilar on es posen els peus. Convé mirar el temps i evitar la roca humida.'
			},
			{
				pregunta: 'El Monturull compta com a cim essencial?',
				resposta:
					"Sí. És el segon essencial de l'Alt Urgell per altitud, per sota del Pic de Salòria. A prop, a la Cerdanya, també hi ha la [Tossa Plana de Lles](/cims/tossa-plana-de-lles), un altre essencial de la mateixa zona."
			}
		],
		es: [
			{
				pregunta: '¿Desde dónde se sube al Monturull?',
				resposta:
					'El camino clásico sale de las Pollineres (Lles de Cerdanya), a 2.140 m, y pasa por el refugio de los Estanys de la Pera y el Pic de Perafita. Hay otra vía, desde la vall de Claror, en Andorra, que la Viquipèdia también cita.'
			},
			{
				pregunta: '¿Cuánto dura la circular?',
				resposta:
					'Hiking Iberia calcula 10 km, 3 h 45 min y unos 807 m de diferencia de altitud para la circular desde las Pollineres.'
			},
			{
				pregunta: '¿Es una cima fácil?',
				resposta:
					'Hiking Iberia la califica de dificultad media (6 sobre 15) y avisa de que, en la subida final, hay tramos en los que hay que poner las manos y vigilar dónde se pisa. Conviene mirar el tiempo y evitar la roca húmeda.'
			},
			{
				pregunta: '¿El Monturull cuenta como cima esencial?',
				resposta:
					'Sí. Es la segunda esencial del Alt Urgell por altitud, por debajo del Pic de Salòria. Cerca, en la Cerdaña, también está la [Tossa Plana de Lles](/cims/tossa-plana-de-lles), otra esencial de la misma zona.'
			}
		]
	},
	fonts: [VIQUIPEDIA, HIKINGIBERIA, RUTES_PIRINEUS_PERA],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
