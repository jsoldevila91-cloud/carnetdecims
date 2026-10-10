import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: "Viquipèdia: L'Elefant (Montserrat)",
	url: "https://ca.wikipedia.org/wiki/L'Elefant_(Montserrat)",
	consultat: CONSULTAT
};

const CATALUNYA_ROMANICA = {
	nom: 'Catalunya Romànica: Sant Salvador (Monistrol de Montserrat)',
	url: 'https://www.enciclopedia.cat/catalunya-romanica/sant-salvador-monistrol-de-montserrat',
	consultat: CONSULTAT
};

const TRAVESIA_PIRENAICA = {
	nom: "Travesía Pirenaica: circular a l'Elefant des de Monistrol de Montserrat",
	url: 'https://travesiapirenaica.com/en/?p=36961',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'elefant-roca-de-sant-salvador',
	descripcio: {
		ca: [
			"L'Elefant, o roca de Sant Salvador, és una roca del massís de Montserrat, a la zona de la Tebaida, que el catàleg situa al terme de Monistrol de Montserrat, al [Bages](/comarques/bages). Segons la Viquipèdia, és de conglomerat, i el nom ve de la semblança amb un elefant que es veu des de la banda del monestir. Un altre cim essencial de Montserrat és [el Montgròs](/cims/montgros), ja a l'Anoia.",
			"Sota la roca hi ha l'ermita de Sant Salvador, resguardada en una balma. Catalunya Romànica recull que el 1217 ja hi havia una ermita dedicada a Sant Salvador habitada per eremites, que depenia del monestir de Montserrat, i que es va reconstruir el 1817 després de les destrosses de la guerra del Francès; el 1820 tornava a fer-se servir com a eremitori.",
			"La Viquipèdia explica que l'accés a peu al cim passa pel Camí de l'Arrel des de Santa Cecília fins al pla de la Trinitat, després per pendents costeruts i pedregosos fins al coll de Sant Salvador, i que al final cal grimpar un pas estret entre dues parets de roca. És, per tant, una ascensió amb un pas de grimpada, no una excursió de camí fàcil.",
			"La mateixa roca és també una paret d'escalada: la Viquipèdia hi recull la via Boy Roca, oberta el 1960. Aquesta fitxa tracta només l'ascensió a peu."
		],
		es: [
			'El Elefant, o roca de Sant Salvador, es una roca del macizo de Montserrat, en la zona de la Tebaida, que el catálogo sitúa en el término de Monistrol de Montserrat, en el [Bages](/comarques/bages). Según la Viquipèdia, es de conglomerado, y el nombre viene del parecido con un elefante que se ve desde el lado del monasterio. Otra cima esencial de Montserrat es [el Montgròs](/cims/montgros), ya en la Anoia.',
			'Bajo la roca está la ermita de Sant Salvador, resguardada en una balma. Catalunya Romànica recoge que en 1217 ya había una ermita dedicada a Sant Salvador habitada por eremitas, que dependía del monasterio de Montserrat, y que se reconstruyó en 1817 tras los destrozos de la guerra del Francés; en 1820 volvía a usarse como eremitorio.',
			"La Viquipèdia explica que el acceso a pie a la cima pasa por el Camí de l'Arrel desde Santa Cecília hasta el pla de la Trinitat, después por pendientes empinadas y pedregosas hasta el coll de Sant Salvador, y que al final hay que trepar un paso estrecho entre dos paredes de roca. Es, por tanto, una ascensión con un paso de trepada, no una excursión de camino fácil.",
			'La misma roca es también una pared de escalada: la Viquipèdia recoge la vía Boy Roca, abierta en 1960. Esta ficha trata solo la ascensión a pie.'
		]
	},
	rutes: [
		{
			id: 'santa-cecilia',
			nom: {
				ca: "Des de Santa Cecília pel Camí de l'Arrel i el coll de Sant Salvador",
				es: "Desde Santa Cecília por el Camí de l'Arrel y el coll de Sant Salvador"
			},
			sortida: { nom: 'Monestir de Santa Cecília de Montserrat' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "La Viquipèdia descriu l'accés a peu des de Santa Cecília: s'agafa el Camí de l'Arrel fins al pla de la Trinitat i es puja per pendents costeruts i pedregosos fins al coll de Sant Salvador. Al final, cal grimpar un pas estret entre dues parets de roca.",
				es: "La Viquipèdia describe el acceso a pie desde Santa Cecília: se toma el Camí de l'Arrel hasta el pla de la Trinitat y se sube por pendientes empinadas y pedregosas hasta el coll de Sant Salvador. Al final, hay que trepar un paso estrecho entre dos paredes de roca."
			},
			fonts: [VIQUIPEDIA]
		},
		{
			id: 'monistrol-circular',
			nom: {
				ca: "Circular des de Monistrol de Montserrat pel camí de l'Àngel (passa per la base de l'Elefant)",
				es: "Circular desde Monistrol de Montserrat por el camí de l'Àngel (pasa por la base del Elefant)"
			},
			sortida: { nom: 'Monistrol de Montserrat' },
			descripcio: {
				ca: "Travesía Pirenaica proposa una circular de 16,1 km, +977 m i -985 m, unes 7 hores amb parades i 5 h 30 min de marxa sense parades, de dificultat alta. Passa per la base de l'Elefant i després per les ermites de Sant Salvador i Sant Benet; el web no la dona com a ruta al cim. La canal del Pou del Gat posa a prova la coordinació de mans i peus per salvar algun pas rocós, i el web parla de terreny inestable i erosionat i recomana bastons. Les xifres són de la circular sencera.",
				es: 'Travesía Pirenaica propone una circular de 16,1 km, +977 m y -985 m, unas 7 horas con paradas y 5 h 30 min de marcha sin paradas, de dificultad alta. Pasa por la base del Elefant y después por las ermitas de Sant Salvador y Sant Benet; la web no la da como ruta a la cima. La canal del Pou del Gat pone a prueba la coordinación de manos y pies para salvar algún paso rocoso, y la web habla de terreno inestable y erosionado y recomienda bastones. Las cifras son de la circular entera.'
			},
			fonts: [TRAVESIA_PIRENAICA]
		}
	],
	consells: {
		ca: [
			'El tram final exigeix grimpar un pas estret entre dues parets de roca: no el facis amb la roca mullada ni amb pressa.',
			'Travesía Pirenaica parla de terreny inestable i erosionat i recomana bastons per a la pujada i la baixada de la circular de Monistrol.',
			"Aquesta fitxa tracta l'ascensió a peu; no confonguis la via d'escalada Boy Roca amb la ruta del repte.",
			"Montserrat és un parc natural: consulta'n la regulació vigent abans de sortir.",
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'El tramo final exige trepar un paso estrecho entre dos paredes de roca: no lo hagas con la roca mojada ni con prisa.',
			'Travesía Pirenaica habla de terreno inestable y erosionado y recomienda bastones para la subida y la bajada de la circular de Monistrol.',
			'Esta ficha trata la ascensión a pie; no confundas la vía de escalada Boy Roca con la ruta del reto.',
			'Montserrat es un parque natural: consulta su regulación vigente antes de salir.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Cal grimpar per arribar a l'Elefant?",
				resposta:
					"Segons la Viquipèdia, sí: al final de l'ascensió a peu cal grimpar un pas estret entre dues parets de roca. La resta és un camí per pendents costeruts i pedregosos."
			},
			{
				pregunta: "Quant es triga a pujar a l'Elefant?",
				resposta:
					"La circular de Monistrol que proposa Travesía Pirenaica fa 16,1 km, 5 h 30 min sense parades i unes 7 hores amb parades, però passa per la base de l'Elefant."
			},
			{
				pregunta: "Què és l'ermita de Sant Salvador?",
				resposta:
					'Una ermita sota la roca, resguardada en una balma. Catalunya Romànica la documenta el 1217, habitada per eremites i dependent del monestir de Montserrat.'
			},
			{
				pregunta: "L'Elefant és un cim essencial?",
				resposta:
					"Sí. A Montserrat l'acompanya [el Montgròs](/cims/montgros), i al [Bages](/comarques/bages) hi ha també [el Collbaix](/cims/collbaix)."
			}
		],
		es: [
			{
				pregunta: '¿Hay que trepar para llegar al Elefant?',
				resposta:
					'Según la Viquipèdia, sí: al final de la ascensión a pie hay que trepar un paso estrecho entre dos paredes de roca. El resto es un camino por pendientes empinadas y pedregosas.'
			},
			{
				pregunta: '¿Cuánto se tarda en subir al Elefant?',
				resposta:
					'La circular de Monistrol que propone Travesía Pirenaica hace 16,1 km, 5 h 30 min sin paradas y unas 7 horas con paradas, pero pasa por la base del Elefant.'
			},
			{
				pregunta: '¿Qué es la ermita de Sant Salvador?',
				resposta:
					'Una ermita bajo la roca, resguardada en una balma. Catalunya Romànica la documenta en 1217, habitada por eremitas y dependiente del monasterio de Montserrat.'
			},
			{
				pregunta: '¿El Elefant es una cima esencial?',
				resposta:
					'Sí. En Montserrat lo acompaña [el Montgròs](/cims/montgros), y en el [Bages](/comarques/bages) está también [el Collbaix](/cims/collbaix).'
			}
		]
	},
	fonts: [VIQUIPEDIA, CATALUNYA_ROMANICA, TRAVESIA_PIRENAICA],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
