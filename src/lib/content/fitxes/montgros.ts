import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Montgròs (el Bruc)',
	url: 'https://ca.wikipedia.org/wiki/Montgr%C3%B2s_(el_Bruc)',
	consultat: CONSULTAT
};

const TRAVESIA_PIRENAICA = {
	nom: 'Travesía Pirenaica: Montgròs desde El Bruc',
	url: 'https://travesiapirenaica.com/en/?p=36852',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'montgros',
	descripcio: {
		ca: [
			"El Montgròs és una muntanya de la serra de Montserrat, dins del Parc Natural de la Muntanya de Montserrat, al terme del Bruc, a l'[Anoia](/comarques/anoia). Segons la Viquipèdia és de conglomerat, amb una forma arrodonida de cúpula, i no és entre els més alts del massís. Un altre cim essencial de Montserrat és [l'Elefant](/cims/elefant-roca-de-sant-salvador), ja al Bages.",
			"La Viquipèdia recull que la primera descripció coneguda de la seva ascensió és d'una excursió del 1880 de Cèsar August Torras, publicada a La Renaixensa, i que Josep Fatjó, a la seva història del 2005, qualifica la pujada de tan penosa com difícil. Al Montgròs també hi ha més de dues desenes de vies d'escalada, que aquesta fitxa no tracta.",
			"Per a qui el vulgui pujar a peu, Travesía Pirenaica en proposa la sortida des del Bruc: un recorregut d'anada i tornada pel mateix camí que, des de la base del massís, passa per la bretxa que parteix Montserrat en dues meitats, amb els Plecs del Llibre, i acaba amb un darrer repetjó cap a l'esquerra. La mateixa fitxa en qualifica la dificultat d'alta: el desnivell és molt marcat en gairebé tot el recorregut.",
			'El web demana tenir en compte algun pas aeri, el dur desnivell de pujada i el gran pendent de baixada, i aconsella baixar amb molta cura. És una ascensió per a gent amb experiència de muntanya, no una passejada; amb humitat o boira convé no insistir.'
		],
		es: [
			'El Montgròs es una montaña de la sierra de Montserrat, dentro del Parque Natural de la Montaña de Montserrat, en el término del Bruc, en la [Anoia](/comarques/anoia). Según la Viquipèdia es de conglomerado, con una forma redondeada de cúpula, y no está entre los más altos del macizo. Otra cima esencial de Montserrat es [el Elefant](/cims/elefant-roca-de-sant-salvador), ya en el Bages.',
			'La Viquipèdia recoge que la primera descripción conocida de su ascensión es de una excursión de 1880 de Cèsar August Torras, publicada en La Renaixensa, y que Josep Fatjó, en su historia de 2005, califica la subida de tan penosa como difícil. En el Montgròs también hay más de dos decenas de vías de escalada, que esta ficha no trata.',
			'Para quien quiera subirlo a pie, Travesía Pirenaica propone la salida desde el Bruc: un recorrido de ida y vuelta por el mismo camino que, desde la base del macizo, pasa por la brecha que parte Montserrat en dos mitades, con los Plecs del Llibre, y acaba con un último repecho hacia la izquierda. La misma ficha califica su dificultad de alta: el desnivel es muy marcado en casi todo el recorrido.',
			'La web pide tener en cuenta algún paso aéreo, el duro desnivel de subida y la gran pendiente de bajada, y aconseja bajar con mucho cuidado. Es una ascensión para gente con experiencia de montaña, no un paseo; con humedad o niebla conviene no insistir.'
		]
	},
	rutes: [
		{
			id: 'el-bruc',
			nom: {
				ca: 'Des del Bruc pels Plecs del Llibre, anada i tornada',
				es: 'Desde el Bruc por los Plecs del Llibre, ida y vuelta'
			},
			sortida: { nom: 'El Bruc' },
			desnivellPositiuM: 833,
			distanciaKm: 5.5,
			tempsMinuts: 150,
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Travesía Pirenaica dona 11 km d'anada i tornada, 833 m de desnivell acumulat (+/-833 m), 2 h 30 min de pujada i 1 h 45 min de baixada, sense parades, i una dificultat alta. L'itinerari passa per la bretxa que parteix Montserrat en dues meitats i pels Plecs del Llibre i acaba amb un darrer repetjó a l'esquerra. El mateix web avisa que cal tenir en compte algun pas aeri, el dur desnivell de pujada i el gran pendent de baixada.",
				es: 'Travesía Pirenaica da 11 km de ida y vuelta, 833 m de desnivel acumulado (+/-833 m), 2 h 30 min de subida y 1 h 45 min de bajada, sin paradas, y una dificultad alta. El itinerario pasa por la brecha que parte Montserrat en dos mitades y por los Plecs del Llibre y acaba con un último repecho a la izquierda. La misma web avisa de que hay que tener en cuenta algún paso aéreo, el duro desnivel de subida y la gran pendiente de bajada.'
			},
			fonts: [TRAVESIA_PIRENAICA]
		}
	],
	consells: {
		ca: [
			"Travesía Pirenaica avisa d'algun pas aeri i d'una baixada de molt pendent: baixa amb molta cura i no ho facis amb la roca mullada.",
			"La pujada és de 2 h 30 min i la baixada d'1 h 45 min sense parades, segons la mateixa font: compta les hores de llum.",
			'Porta aigua de casa i botes de bona sola: el desnivell és molt marcat en gairebé tot el recorregut.',
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'Travesía Pirenaica avisa de algún paso aéreo y de una bajada de mucha pendiente: baja con mucho cuidado y no lo hagas con la roca mojada.',
			'La subida es de 2 h 30 min y la bajada de 1 h 45 min sin paradas, según la misma fuente: cuenta las horas de luz.',
			'Lleva agua de casa y botas de buena suela: el desnivel es muy marcado en casi todo el recorrido.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Montgròs?',
				resposta:
					"Travesía Pirenaica compta 2 h 30 min de pujada i 1 h 45 min de baixada, sense parades, per a 11 km d'anada i tornada des del Bruc, amb 833 m de desnivell."
			},
			{
				pregunta: 'El Montgròs és difícil?',
				resposta:
					"La mateixa font en qualifica la dificultat d'alta, pel desnivell molt marcat, i avisa d'algun pas aeri i d'una baixada de gran pendent."
			},
			{
				pregunta: 'Es pot escalar al Montgròs?',
				resposta:
					"Sí, la Viquipèdia en recull més de dues desenes de vies, però aquesta fitxa tracta només l'ascensió a peu, que no és de rutina: cal experiència de muntanya."
			},
			{
				pregunta: 'El Montgròs és un cim essencial?',
				resposta:
					"Sí. A Montserrat l'acompanya [l'Elefant](/cims/elefant-roca-de-sant-salvador), al Bages, i l'[Anoia](/comarques/anoia) té [el Puig de Sant Miquel](/cims/puig-de-sant-miquel)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Montgròs?',
				resposta:
					'Travesía Pirenaica cuenta 2 h 30 min de subida y 1 h 45 min de bajada, sin paradas, para 11 km de ida y vuelta desde el Bruc, con 833 m de desnivel.'
			},
			{
				pregunta: '¿El Montgròs es difícil?',
				resposta:
					'La misma fuente califica su dificultad de alta, por el desnivel muy marcado, y avisa de algún paso aéreo y de una bajada de gran pendiente.'
			},
			{
				pregunta: '¿Se puede escalar en el Montgròs?',
				resposta:
					'Sí, la Viquipèdia recoge más de dos decenas de vías, pero esta ficha trata solo la ascensión a pie, que no es de rutina: hace falta experiencia de montaña.'
			},
			{
				pregunta: '¿El Montgròs es una cima esencial?',
				resposta:
					'Sí. En Montserrat lo acompaña [el Elefant](/cims/elefant-roca-de-sant-salvador), en el Bages, y la [Anoia](/comarques/anoia) tiene [el Puig de Sant Miquel](/cims/puig-de-sant-miquel).'
			}
		]
	},
	fonts: [VIQUIPEDIA, TRAVESIA_PIRENAICA],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
