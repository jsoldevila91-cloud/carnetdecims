import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: La Mola (Bonastre)',
	url: 'https://ca.wikipedia.org/wiki/La_Mola_(Bonastre)',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: La Mola',
	url: 'https://reptesmuntanyencs.cat/la-mola/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'la-mola-tarragones',
	descripcio: {
		ca: [
			'La Mola és el cim més alt de la comarca del [Tarragonès](/comarques/tarragones), segons la Viquipèdia. Es troba a la divisòria dels termes de Bonastre, al Baix Penedès, i de la Pobla de Montornès i Creixell, ja al Tarragonès, i la Viquipèdia la situa a la Serra Llarga. La roca és dolomia i calcària, i al cim hi ha un vèrtex geodèsic.',
			"Des de la rodalia hi arriben diversos itineraris senyalitzats, de 3,4 a 8,6 km segons el punt de partida; el detall és a la ruta corresponent d'aquesta fitxa.",
			"Reptes Muntanyencs la va fer des del Mas Gibert en una circular curta per senders i pistes, i diu que no presenta dificultats especials. Pel camí es troba un bon catàleg de cabanes de pedra seca i unes barres de ferro que en el seu moment degueren fer de suport d'alguna porta. El cim, segons el bloc, no ofereix vistes, però en un mirador proper hi ha unes estupendes vistes del territori.",
			'El bloc adverteix que la senyalització és parcial: hi ha algun pal, però el senyal no indica la direcció a seguir per arribar a la Mola, i la tornada es fa pel GR-92.'
		],
		es: [
			'La Mola es la cima más alta de la comarca del [Tarragonès](/comarques/tarragones), según la Viquipèdia. Se encuentra en la divisoria de los términos de Bonastre, en el Baix Penedès, y de la Pobla de Montornès y Creixell, ya en el Tarragonès, y la Viquipèdia la sitúa en la Serra Llarga. La roca es dolomía y caliza, y en la cima hay un vértice geodésico.',
			'Desde los alrededores llegan varios itinerarios señalizados, de 3,4 a 8,6 km según el punto de partida; el detalle está en la ruta correspondiente de esta ficha.',
			'Reptes Muntanyencs la hizo desde el Mas Gibert en una circular corta por senderos y pistas, y dice que no presenta dificultades especiales. Por el camino se encuentra un buen catálogo de cabañas de piedra seca y unas barras de hierro que en su momento debieron de ser el soporte de alguna puerta. La cima, según el blog, no ofrece vistas, pero en un mirador cercano hay unas estupendas vistas del territorio.',
			'El blog advierte de que la señalización es parcial: hay algún poste, pero la señal no indica la dirección a seguir para llegar a la Mola, y la vuelta se hace por el GR-92.'
		]
	},
	rutes: [
		{
			id: 'mas-gibert',
			nom: {
				ca: 'Circular des del Mas Gibert',
				es: 'Circular desde el Mas Gibert'
			},
			sortida: { nom: 'Mas Gibert' },
			descripcio: {
				ca: 'Reptes Muntanyencs documenta una circular que surt del Mas Gibert, per senders i pistes: 6,5 km, uns 224 m de desnivell positiu i 1 h 27 min de marxa efectiva. Segons el seu track, el cim queda a uns 2,3 km de la sortida. Diu que no presenta dificultats especials; la senyalització és parcial i la tornada va pel GR-92.',
				es: 'Reptes Muntanyencs documenta una circular que sale del Mas Gibert, por senderos y pistas: 6,5 km, unos 224 m de desnivel positivo y 1 h 27 min de marcha efectiva. Según su track, la cima queda a unos 2,3 km de la salida. Dice que no presenta dificultades especiales; la señalización es parcial y la vuelta va por el GR-92.'
			},
			fonts: [REPTES]
		},
		{
			id: 'itineraris-senyalitzats',
			nom: {
				ca: 'Itineraris senyalitzats des de Bonastre, la Pobla de Montornès i Creixell',
				es: 'Itinerarios señalizados desde Bonastre, la Pobla de Montornès y Creixell'
			},
			sortida: { nom: 'Bonastre' },
			descripcio: {
				ca: 'Segons la Viquipèdia, hi ha rutes senyalitzades des de Bonastre (uns 3,4 km), la Pobla de Montornès (uns 4,8 km), Creixell (uns 8,1 km, per camí asfaltat), Roda de Berà (uns 8,6 km, per pista asfaltada) i el castell de Montornès (uns 3,5 km). Són distàncies fins al cim; la font no hi dona ni desnivells ni temps.',
				es: 'Según la Viquipèdia, hay rutas señalizadas desde Bonastre (unos 3,4 km), la Pobla de Montornès (unos 4,8 km), Creixell (unos 8,1 km, por camino asfaltado), Roda de Berà (unos 8,6 km, por pista asfaltada) y el castell de Montornès (unos 3,5 km). Son distancias hasta la cima; la fuente no da desniveles ni tiempos.'
			},
			fonts: [VIQUIPEDIA]
		}
	],
	consells: {
		ca: [
			'El bloc nota que la senyalització és parcial i que algun senyal no indica la direcció per arribar a la Mola: porta un track.',
			'El cim no té vistes, segons el bloc, però hi ha un mirador proper amb bones vistes del territori.',
			'A la tornada pots fer servir el GR-92, que el bloc va seguir.',
			"Telèfon d'emergències: 112."
		],
		es: [
			'El blog anota que la señalización es parcial y que alguna señal no indica la dirección para llegar a la Mola: lleva un track.',
			'La cima no tiene vistas, según el blog, pero hay un mirador cercano con buenas vistas del territorio.',
			'A la vuelta puedes usar el GR-92, que el blog siguió.',
			'Teléfono de emergencias: 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Mola?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 6,5 km des del Mas Gibert amb 1 h 27 min de marxa efectiva; segons el seu track, el cim queda a uns 2,3 km de la sortida.'
			},
			{
				pregunta: 'Des d’on és més curt?',
				resposta:
					'Segons la Viquipèdia, les rutes senyalitzades més curtes són des de Bonastre (uns 3,4 km) i des del castell de Montornès (uns 3,5 km).'
			},
			{
				pregunta: 'Hi ha vistes des del cim?',
				resposta:
					"El bloc diu que el cim no ofereix vistes, però que en un mirador proper n'hi ha unes d'estupendes del territori."
			},
			{
				pregunta: 'La Mola compta com a cim essencial?',
				resposta:
					'Sí, és el [cim essencial](/cims-essencials) del Tarragonès i el més alt de la comarca.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Mola?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 6,5 km desde el Mas Gibert con 1 h 27 min de marcha efectiva; según su track, la cima queda a unos 2,3 km de la salida.'
			},
			{
				pregunta: '¿Desde dónde es más corto?',
				resposta:
					'Según la Viquipèdia, las rutas señalizadas más cortas son desde Bonastre (unos 3,4 km) y desde el castell de Montornès (unos 3,5 km).'
			},
			{
				pregunta: '¿Hay vistas desde la cima?',
				resposta:
					'El blog dice que la cima no ofrece vistas, pero que en un mirador cercano hay unas estupendas del territorio.'
			},
			{
				pregunta: '¿La Mola cuenta como cima esencial?',
				resposta:
					'Sí, es la [cima esencial](/cims-essencials) del Tarragonès y la más alta de la comarca.'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
