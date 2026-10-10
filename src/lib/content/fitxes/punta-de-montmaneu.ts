import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Punta de Montmaneu',
	url: 'https://ca.wikipedia.org/wiki/Punta_de_Montmaneu',
	consultat: CONSULTAT
};

const WIKIPEDIA = {
	nom: 'Wikipedia: Montmeneu',
	url: 'https://en.wikipedia.org/wiki/Montmeneu',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Punta de Montmeneu',
	url: 'https://reptesmuntanyencs.cat/montmeneu/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'punta-de-montmaneu',
	descripcio: {
		ca: [
			"La Punta de Montmaneu és un turó solitari del terme de Seròs, al [Segrià](/comarques/segria). Segons la Viquipèdia, és una muntanya aïllada de la part occidental de la Depressió Central i, com que els voltants són força plans, es veu des de lluny. La roca és de gres, argila i guix, hi ha un vèrtex geodèsic al cim, i la Viquipèdia el situa dins l'espai protegit de Seròs-Tossals de Montmaneu.",
			"La Punta de Montmaneu és l'únic cim essencial del Segrià a la llista del repte. Segons el bloc Reptes Muntanyencs, si es tria el dia correcte les vistes seran molt bones: aquí conflueixen els rius Segre i Cinca i creen un espai aquàtic i vegetal especial.",
			"El bloc hi puja des del Mas de l'Hereu en una circular de pistes, alguns corriols i un sender final fins al cim. Al començament la pista és en bon estat, però ràpidament es torna deficient. El cim s'indica amb un pal indicador que marca la direcció a seguir, i el camí es reconeix per una fita amb una marca de pintura que sembla de GR."
		],
		es: [
			'La Punta de Montmaneu es un cerro solitario del término de Seròs, en el [Segrià](/comarques/segria). Según la Viquipèdia, es una montaña aislada de la parte occidental de la Depressió Central y, como los alrededores son bastante llanos, se ve desde lejos. La roca es de arenisca, arcilla y yeso, hay un vértice geodésico en la cima, y la Viquipèdia la sitúa dentro del espacio protegido de Seròs-Tossals de Montmaneu.',
			'La Punta de Montmaneu es la única cima esencial del Segrià en la lista del reto. Según el blog Reptes Muntanyencs, si se elige el día correcto las vistas serán muy buenas: aquí confluyen los ríos Segre y Cinca y crean un espacio acuático y vegetal especial.',
			"El blog sube desde el Mas de l'Hereu en una circular de pistas, algunas sendas y un sendero final hasta la cima. Al comienzo la pista está en buen estado, pero rápidamente se vuelve deficiente. La cima se indica con un poste indicador que marca la dirección a seguir, y el camino se reconoce por un hito con una marca de pintura que parece de GR."
		]
	},
	rutes: [
		{
			id: 'mas-de-l-hereu',
			nom: {
				ca: "Circular des del Mas de l'Hereu",
				es: "Circular desde el Mas de l'Hereu"
			},
			sortida: { nom: "Mas de l'Hereu (Seròs)" },
			descripcio: {
				ca: "Reptes Muntanyencs documenta una circular que surt del Mas de l'Hereu, majoritàriament per pistes i amb alguns corriols i un sender fins al cim: 8 km, uns 248 m de desnivell positiu i 2 h 28 min de marxa efectiva. Segons el seu track, el cim queda als 4,9 km de la sortida. La pista comença en bon estat i s'empitjora de pressa; hi ha una fita amb una marca de pintura que sembla de GR i un pal indicador cap al cim.",
				es: "Reptes Muntanyencs documenta una circular que sale del Mas de l'Hereu, mayoritariamente por pistas y con algunas sendas y un sendero hasta la cima: 8 km, unos 248 m de desnivel positivo y 2 h 28 min de marcha efectiva. Según su track, la cima queda a los 4,9 km de la salida. La pista empieza en buen estado y empeora deprisa; hay un hito con una marca de pintura que parece de GR y un poste indicador hacia la cima."
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'La pista empitjora de pressa després del començament, segons el bloc: compta amb més temps del previst.',
			'Tria un dia clar: el bloc destaca que, amb dia correcte, les vistes seran molt bones.',
			'Segueix la fita amb pintura de GR i el pal indicador cap al cim.',
			"Porta tota l'aigua des de la sortida.",
			"Telèfon d'emergències: 112."
		],
		es: [
			'La pista empeora deprisa tras el comienzo, según el blog: cuenta con más tiempo del previsto.',
			'Elige un día claro: el blog destaca que, con un día correcto, las vistas serán muy buenas.',
			'Sigue el hito con pintura de GR y el poste indicador hacia la cima.',
			'Lleva toda el agua desde la salida.',
			'Teléfono de emergencias: 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Punta de Montmaneu?',
				resposta:
					"Reptes Muntanyencs documenta una circular de 8 km des del Mas de l'Hereu amb 2 h 28 min de marxa efectiva; segons el seu track, el cim queda als 4,9 km de la sortida."
			},
			{
				pregunta: 'És una ruta difícil?',
				resposta:
					'El bloc la fa majoritàriament per pistes, algunes en mal estat, amb corriols i un sender fins al cim; la dificultat de progressió que anota és baixa.'
			},
			{
				pregunta: 'Què es veu des del cim?',
				resposta:
					'El bloc diu que, si el dia acompanya, les vistes són molt bones, amb la confluència dels rius Segre i Cinca.'
			},
			{
				pregunta: 'Compta com a cim essencial?',
				resposta: "Sí, és l'únic [cim essencial](/cims-essencials) del Segrià."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Punta de Montmaneu?',
				resposta:
					"Reptes Muntanyencs documenta una circular de 8 km desde el Mas de l'Hereu con 2 h 28 min de marcha efectiva; según su track, la cima queda a los 4,9 km de la salida."
			},
			{
				pregunta: '¿Es una ruta difícil?',
				resposta:
					'El blog la hace mayoritariamente por pistas, algunas en mal estado, con sendas y un sendero hasta la cima; la dificultad de progresión que anota es baja.'
			},
			{
				pregunta: '¿Qué se ve desde la cima?',
				resposta:
					'El blog dice que, si el día acompaña, las vistas son muy buenas, con la confluencia de los ríos Segre y Cinca.'
			},
			{
				pregunta: '¿Cuenta como cima esencial?',
				resposta: 'Sí, es la única [cima esencial](/cims-essencials) del Segrià.'
			}
		]
	},
	fonts: [VIQUIPEDIA, WIKIPEDIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
