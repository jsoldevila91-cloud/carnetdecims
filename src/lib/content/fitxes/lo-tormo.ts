import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Lo Tormo',
	url: 'https://ca.wikipedia.org/wiki/Lo_Tormo',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Lo Tormo',
	url: 'https://reptesmuntanyencs.cat/lo-tormo/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'lo-tormo',
	descripcio: {
		ca: [
			"Lo Tormo és un cim de la [Ribera d'Ebre](/comarques/ribera-d-ebre), al límit entre els termes de Torre de l'Espanyol i Garcia. Segons la Viquipèdia, és el punt on es troben la serra dels Morers i la serra del Tormo, de bretxa i dolomia, i pertany a la serra de Montsant, dins el Parc Natural de la Serra de Montsant. Al cim hi ha el vèrtex geodèsic de l'Institut Cartogràfic.",
			"El repte l'inclou, i la Viquipèdia en recull un itinerari que passa «per les Mines i la Capelleta». El bloc Reptes Muntanyencs hi puja des de l'ermita de Santa Magdalena, un lloc singular perquè, segons diu, es va construir a l'abric d'una enorme paret de roca que la cobreix.",
			"El camí és una circular curta, per la cresta, que el bloc considera senzilla: la part de la cresta no és complicada, tot i que en determinats trams és aèria si es fa arrambat al caire, i el pas és molt fàcil i prou ample, llevat d'un parell de trams molt curts. La traça és difuminada i a estones només alguna fita ajuda a seguir el bon camí.",
			"L'esplanada on es deixa el cotxe és, segons el bloc, un bon mirador cap al Baix Camp i el Priorat. Si vols veure un altre cim de la serra de Montsant, la [Roca Corbatera](/cims/roca-corbatera) és al Priorat; i a la mateixa comarca de la Ribera d'Ebre hi ha [la Tossa de Tivissa](/cims/la-tossa-tivissa) i [la Picossa](/cims/la-picossa)."
		],
		es: [
			"Lo Tormo es una cima de la [Ribera d'Ebre](/comarques/ribera-d-ebre), en el límite entre los términos de Torre de l'Espanyol y Garcia. Según la Viquipèdia, es el punto donde se encuentran la serra dels Morers y la serra del Tormo, de brecha y dolomía, y pertenece a la sierra de Montsant, dentro del Parc Natural de la Serra de Montsant. En la cima está el vértice geodésico del Institut Cartogràfic.",
			'El reto lo incluye, y la Viquipèdia recoge un itinerario que pasa «por les Mines i la Capelleta». El blog Reptes Muntanyencs sube desde la ermita de Santa Magdalena, un lugar singular porque, según dice, se construyó al abrigo de una enorme pared de roca que la cubre.',
			'El camino es una circular corta, por la cresta, que el blog considera sencilla: la parte de la cresta no es complicada, aunque en determinados tramos es aérea si se hace pegado al borde, y el paso es muy fácil y bastante ancho, salvo un par de tramos muy cortos. La traza es difuminada y a ratos solo algún hito ayuda a seguir el buen camino.',
			"La explanada donde se deja el coche es, según el blog, un buen mirador hacia el Baix Camp y el Priorat. Si quieres ver otra cima de la sierra de Montsant, la [Roca Corbatera](/cims/roca-corbatera) está en el Priorat; y en la propia comarca de la Ribera d'Ebre están [la Tossa de Tivissa](/cims/la-tossa-tivissa) y [la Picossa](/cims/la-picossa)."
		]
	},
	rutes: [
		{
			id: 'santa-magdalena',
			nom: {
				ca: "Circular des de l'ermita de Santa Magdalena",
				es: 'Circular desde la ermita de Santa Magdalena'
			},
			sortida: { nom: 'Ermita de Santa Magdalena' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Reptes Muntanyencs documenta una circular que surt de l'ermita de Santa Magdalena: 5,6 km, uns 351 m de desnivell positiu i 1 h 25 min de marxa efectiva. Segons el seu track, el cim s'assoleix a uns 50 min i uns 2,7 km de la sortida. El camí segueix una «traça difuminada», amb fites. Aquesta part de la cresta, diu, «no és complicada, tot i que en determinats trams és aèria si la fem arrambats al caire».",
				es: 'Reptes Muntanyencs documenta una circular que sale de la ermita de Santa Magdalena: 5,6 km, unos 351 m de desnivel positivo y 1 h 25 min de marcha efectiva. Según su track, la cima se alcanza a unos 50 min y unos 2,7 km de la salida. El camino sigue una «traza difuminada», con hitos. Esta parte de la cresta, dice, «no es complicada, aunque en determinados tramos es aérea si la hacemos pegados al borde».'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'Segons el bloc, la cresta és aèria en determinats trams si es fa arrambat al caire: camina lluny de la vora, sobretot amb vent.',
			'La traça és difuminada i les fites són escadusseres: porta un track.',
			"El cim és dins el Parc Natural de la Serra de Montsant: respecta'n les normes d'ús.",
			"Telèfon d'emergències: 112."
		],
		es: [
			'Según el blog, la cresta es aérea en determinados tramos si se hace pegado al borde: camina lejos del borde, sobre todo con viento.',
			'La traza es difuminada y los hitos son escasos: lleva un track.',
			'La cima está dentro del Parc Natural de la Serra de Montsant: respeta sus normas de uso.',
			'Teléfono de emergencias: 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Lo Tormo?',
				resposta:
					"Reptes Muntanyencs documenta una circular de 5,6 km des de l'ermita de Santa Magdalena amb 1 h 25 min de marxa efectiva; segons el seu track, el cim queda a uns 50 min de la sortida."
			},
			{
				pregunta: 'És un cim difícil?',
				resposta:
					"El bloc diu que la part de la cresta no és complicada, tot i que en determinats trams és aèria si es fa arrambat al caire; el pas és molt fàcil i prou ample, llevat d'un parell de trams molt curts."
			},
			{
				pregunta: 'On és el cim, exactament?',
				resposta:
					"Segons la Viquipèdia, és entre els termes de Torre de l'Espanyol i Garcia, on es troben la serra dels Morers i la serra del Tormo."
			},
			{
				pregunta: 'Lo Tormo compta com a cim essencial?',
				resposta: "Sí, és un dels tres [cims essencials](/cims-essencials) de la Ribera d'Ebre."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Lo Tormo?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 5,6 km desde la ermita de Santa Magdalena con 1 h 25 min de marcha efectiva; según su track, la cima queda a unos 50 min de la salida.'
			},
			{
				pregunta: '¿Es una cima difícil?',
				resposta:
					'El blog dice que la parte de la cresta no es complicada, aunque en determinados tramos es aérea si se hace pegado al borde; el paso es muy fácil y bastante ancho, salvo un par de tramos muy cortos.'
			},
			{
				pregunta: '¿Dónde está la cima, exactamente?',
				resposta:
					"Según la Viquipèdia, entre los términos de Torre de l'Espanyol y Garcia, donde se encuentran la serra dels Morers y la serra del Tormo."
			},
			{
				pregunta: '¿Lo Tormo cuenta como cima esencial?',
				resposta: "Sí, es una de las tres [cimas esenciales](/cims-essencials) de la Ribera d'Ebre."
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
