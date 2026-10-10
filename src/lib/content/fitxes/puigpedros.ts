import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puigpedrós',
	url: 'https://ca.wikipedia.org/wiki/Puigpedr%C3%B3s',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: 'Rutes Pirineus: Puigpedrós (2.915 m) per Engorgs des del refugi del Malniu',
	url: 'https://www.rutespirineus.cat/rutes/puigpedros-per-engorgs-des-del-refugi-del-malniu',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: excursió al Puigpedrós (2.915 m) des del refugi de Malniu",
	url: 'https://dexcursio.net/puigpedros/',
	consultat: CONSULTAT
};

const MONTEDITORIAL = {
	nom: 'Monteditorial: Puigpedrós pel refugi de Malniu',
	url: 'https://www.monteditorial.cat/producte/puigpedros-pel-refugi-de-malniu/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puigpedros',
	descripcio: {
		ca: [
			"El Puigpedrós és el sostre de la Baixa Cerdanya i el cim més alt de les comarques gironines. S'aixeca a la carena fronterera que separa [la Cerdanya](/comarques/cerdanya) de l'Alta Cerdanya, on es troben els termes de Meranges, Ger i Guils de Cerdanya amb el de Porta, i és dins l'espai protegit de la Tossa Plana de Lles-Puigpedrós. És una muntanya de granodiorita, ampla i de vessants suaus per la banda sud, envoltada de circs glacials i estanys.",
			"El nom ho diu tot: un «puig» coronat de roca, perquè el cim és un caos de blocs de granit. A l'Alta Cerdanya també se li diu Puig de Campcardós, per l'altiplà que l'envolta i pels cards que creixen als prats a l'estiu. La pujada clàssica surt del refugi de Malniu, sobre Meranges, i passa pel circ glacial d'Engorgs i el refugi Joaquim Folch i Girona.",
			"Des del cim, la vista abasta la plana de la Cerdanya, la serra del Cadí al sud, les muntanyes d'Andorra a ponent i el Canigó a llevant, a més dels estanys que queden als peus. A tocar, cap al sud-oest, s'estén la carena que porta a la [Tossa Plana de Lles](/cims/tossa-plana-de-lles), un altre cim del repte.",
			"La millor època va de finals de juny a principis d'octubre. Fora de temporada el cim és nevat i l'ascensió es fa amb raquetes o esquís, amb risc d'allaus. A l'estiu són habituals les tempestes de tarda, i la carena final, oberta i sense refugi, no és lloc per quedar-s'hi amb mal temps."
		],
		es: [
			'El Puigpedrós es el techo de la Baixa Cerdanya y la cima más alta de las comarcas gerundenses. Se alza en la cresta fronteriza que separa [la Cerdanya](/comarques/cerdanya) de la Alta Cerdanya, donde se encuentran los municipios de Meranges, Ger y Guils de Cerdanya con el de Porta, y está dentro del espacio protegido de la Tossa Plana de Lles-Puigpedrós. Es una montaña de granodiorita, ancha y de laderas suaves por el lado sur, rodeada de circos glaciares y lagos.',
			'El nombre lo dice todo: un «puig» coronado de roca, porque la cima es un caos de bloques de granito. En la Alta Cerdanya también se le llama Puig de Campcardós, por la altiplanicie que lo rodea y por los cardos que crecen en los prados en verano. La subida clásica sale del refugio de Malniu, sobre Meranges, y pasa por el circo glaciar de Engorgs y el refugio Joaquim Folch i Girona.',
			'Desde la cima, la vista abarca la llanura de la Cerdanya, la sierra del Cadí al sur, las montañas de Andorra al oeste y el Canigó al este, además de los lagos que quedan a los pies. Al lado, hacia el suroeste, se extiende la cresta que lleva a la [Tossa Plana de Lles](/cims/tossa-plana-de-lles), otra cima del reto.',
			'La mejor época va de finales de junio a principios de octubre. Fuera de temporada la cima está nevada y la ascensión se hace con raquetas o esquís, con riesgo de aludes. En verano son habituales las tormentas de tarde, y la cresta final, abierta y sin refugio, no es lugar para quedarse con mal tiempo.'
		]
	},
	rutes: [
		{
			id: 'malniu-engorgs',
			nom: {
				ca: 'Des del refugi de Malniu per Engorgs',
				es: 'Desde el refugio de Malniu por Engorgs'
			},
			sortida: { nom: 'Aparcament del refugi de Malniu (Meranges)' },
			tempsMinuts: 225,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Del refugi es pren el GR 11, que flanqueja pel bosc de Corniols fins al refugi Joaquim Folch i Girona, al circ d'Engorgs (1 h 45 min). Allà es deixa el GR i es puja cap al nord-est per terreny obert fins a la portella de Meranges, i després se segueix tota la carena fins al cim, per un terreny ondulat i amb molt poques fites. Rutes Pirineus situa el cim a 3 h 45 min de la sortida i proposa baixar per l'estany de Malniu, en una circular de 13,1 km i 900 m de desnivell.",
				es: 'Desde el refugio se toma el GR 11, que flanquea por el bosque de Corniols hasta el refugio Joaquim Folch i Girona, en el circo de Engorgs (1 h 45 min). Allí se deja el GR y se sube hacia el noreste por terreno abierto hasta la portella de Meranges, y después se sigue toda la cresta hasta la cima, por un terreno ondulado y con muy pocos hitos. Rutes Pirineus sitúa la cima a 3 h 45 min de la salida y propone bajar por el estany de Malniu, en una circular de 13,1 km y 900 m de desnivel.'
			},
			fonts: [RUTES_PIRINEUS]
		},
		{
			id: 'malniu-molleres',
			nom: {
				ca: 'Circular curta pel coll de les Molleres',
				es: 'Circular corta por el coll de les Molleres'
			},
			sortida: { nom: 'Aparcament del refugi de Malniu (Meranges)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Variant més curta de D'excursió per Catalunya: deixa aviat el GR 11 per un camí marcat amb fites cap al coll de les Molleres (el desviament no sempre és evident) i acaba pel caos de blocs de granit del cim; es baixa per l'estany de Malniu. En total, 8 km, 744 m de desnivell i unes 4 h 15 min.",
				es: "Variante más corta de D'excursió per Catalunya: deja pronto el GR 11 por un camino marcado con hitos hacia el coll de les Molleres (el desvío no siempre es evidente) y termina por el caos de bloques de granito de la cima; se baja por el estany de Malniu. En total, 8 km, 744 m de desnivel y unas 4 h 15 min."
			},
			fonts: [DEXCURSIO]
		}
	],
	consells: {
		ca: [
			"Al refugi de Malniu s'hi arriba per una pista de 8 km des de Meranges, i l'aparcament és de pagament (3 € per vehicle i dia, segons les fonts consultades).",
			"Porta el track o un mapa: per sobre del refugi d'Engorgs i a la carena hi ha poques fites i, amb boira, és fàcil desorientar-se.",
			'El cim és un amuntegament de blocs de granit: calçat de muntanya i atenció on poses els peus.',
			"Surt d'hora a l'estiu: les tempestes de tarda són freqüents i la carena és molt exposada.",
			"Amb neu, l'ascensió canvia del tot (raquetes o esquís, crampons i risc d'allaus): consulta la predicció abans de sortir."
		],
		es: [
			'Al refugio de Malniu se llega por una pista de 8 km desde Meranges, y el aparcamiento es de pago (3 € por vehículo y día, según las fuentes consultadas).',
			'Lleva el track o un mapa: por encima del refugio de Engorgs y en la cresta hay pocos hitos y, con niebla, es fácil desorientarse.',
			'La cima es un amontonamiento de bloques de granito: calzado de montaña y atención a dónde pisas.',
			'Sal temprano en verano: las tormentas de tarde son frecuentes y la cresta está muy expuesta.',
			'Con nieve, la ascensión cambia por completo (raquetas o esquís, crampones y riesgo de aludes): consulta la predicción antes de salir.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puigpedrós des de Malniu?',
				resposta:
					"Per Engorgs, Rutes Pirineus situa el cim a 3 h 45 min del refugi de Malniu, i tota la circular en 6 h. La variant del coll de les Molleres de D'excursió per Catalunya és més curta: 8 km i unes 4 h 15 min en total."
			},
			{
				pregunta: 'El Puigpedrós és difícil?',
				resposta:
					"Amb bon temps no té passos de grimpada, però és alta muntanya: terreny obert amb poques fites, un cim de blocs de granit i molt desnivell. És una bona primera ascensió a prop dels tres mil metres si es té una mica d'experiència."
			},
			{
				pregunta: 'Quin és el cim més alt de les comarques de Girona?',
				resposta:
					'El Puigpedrós, que també és el sostre de la Baixa Cerdanya, per sobre de la veïna Tossa Plana de Lles.'
			},
			{
				pregunta: 'El Puigpedrós compta com a cim essencial?',
				resposta:
					'Sí, i és el més alt dels quatre [cims essencials](/cims-essencials) de la Cerdanya, per sobre de la [Tossa Plana de Lles](/cims/tossa-plana-de-lles), la Muga i la Carabassa. També surt a la llista dels [cims més alts del repte](/cims-mes-alts).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puigpedrós desde Malniu?',
				resposta:
					"Por Engorgs, Rutes Pirineus sitúa la cima a 3 h 45 min del refugio de Malniu, y toda la circular en 6 h. La variante del coll de les Molleres de D'excursió per Catalunya es más corta: 8 km y unas 4 h 15 min en total."
			},
			{
				pregunta: '¿El Puigpedrós es difícil?',
				resposta:
					'Con buen tiempo no tiene pasos de trepada, pero es alta montaña: terreno abierto con pocos hitos, una cima de bloques de granito y mucho desnivel. Es una buena primera ascensión cerca de los tres mil metros si se tiene algo de experiencia.'
			},
			{
				pregunta: '¿Cuál es la cima más alta de las comarcas de Girona?',
				resposta:
					'El Puigpedrós, que también es el techo de la Baixa Cerdanya, por encima de la vecina Tossa Plana de Lles.'
			},
			{
				pregunta: '¿El Puigpedrós cuenta como cima esencial?',
				resposta:
					'Sí, y es la más alta de las cuatro [cimas esenciales](/cims-essencials) de la Cerdanya, por encima de la [Tossa Plana de Lles](/cims/tossa-plana-de-lles), la Muga y la Carabassa. También aparece en la lista de las [cimas más altas del reto](/cims-mes-alts).'
			}
		]
	},
	fonts: [VIQUIPEDIA, RUTES_PIRINEUS, DEXCURSIO, MONTEDITORIAL],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
