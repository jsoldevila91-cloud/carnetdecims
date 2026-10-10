import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const REPTES = {
	nom: 'Reptes Muntanyencs: Tuc de la Cometa (Llesuí)',
	url: 'https://reptesmuntanyencs.cat/tuc-de-la-cometa/',
	consultat: CONSULTAT
};

const FEEC = {
	nom: 'FEEC: Tuc de la Cometa',
	url: 'https://www.feec.cat/activitats/100-cims/cim/tuc-de-la-cometa/',
	consultat: CONSULTAT
};

const VIQUIPEDIA_MONTSENT = {
	nom: 'Viquipèdia: Montsent',
	url: 'https://ca.wikipedia.org/wiki/Montsent_de_Pallars',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tuc-de-la-cometa',
	descripcio: {
		ca: [
			"El Tuc de la Cometa és un cim limítrof entre el [Pallars Jussà](/comarques/pallars-jussa) i el Pallars Sobirà que domina l'antiga estació d'esquí de Llessui, al terme de Sort. Reptes Muntanyencs el situa al mateix cordal que el [Montsent de Pallars](/cims/montsent-de-pallars), un altre cim essencial, i explica que es poden encadenar tots dos en una sola caminada.",
			"El punt de sortida és l'antiga estació d'esquí de Llessui, a 1.977 m, a la qual s'arriba amb un cotxe normal, a poc a poc, per una pista de terra. Les restes de les instal·lacions encara fan de guia: Reptes Muntanyencs explica que els pilons de la línia d'arrossegament orienten la baixada. El cim, en canvi, és discret. Segons la mateixa ressenya, no hi ha el piló ni la base del vèrtex geodèsic, però el punt més alt és clar, i queda marcat per un munt de pedres.",
			'Des de dalt, si el dia ho permet, Reptes Muntanyencs hi veu Montserrat i el [Pedraforca](/cims/pedraforca-pollego-superior), aquest darrere de la serra del Cadí. La volta es pot allargar amb dos cims propers, el cap de Cabrità i el tossal dels Altars.',
			"La ruta és una volta circular curta, de pistes i camp a través, sense itinerari senyalitzat. Reptes Muntanyencs la va fer a finals d'agost; l'època bona és de l'estiu a la tardor, sense neu, i a l'estiu convé baixar abans de les tempestes de tarda."
		],
		es: [
			'El Tuc de la Cometa es una cima limítrofe entre el [Pallars Jussà](/comarques/pallars-jussa) y el Pallars Sobirà que domina la antigua estación de esquí de Llessui, en el término de Sort. Reptes Muntanyencs la sitúa en el mismo cordal que el [Montsent de Pallars](/cims/montsent-de-pallars), otra cima esencial, y explica que se pueden encadenar las dos en una sola caminata.',
			'El punto de salida es la antigua estación de esquí de Llessui, a 1.977 m, a la que se llega con un coche normal, despacio, por una pista de tierra. Los restos de las instalaciones todavía sirven de guía: Reptes Muntanyencs explica que los pilones de la línea de arrastre orientan la bajada. La cima, en cambio, es discreta. Según la misma reseña, no están ni el pilón ni la base del vértice geodésico, pero el punto más alto es claro y queda marcado por un montón de piedras.',
			'Desde arriba, si el día lo permite, Reptes Muntanyencs ve Montserrat y el [Pedraforca](/cims/pedraforca-pollego-superior), este detrás de la sierra del Cadí. La vuelta se puede alargar con dos cimas cercanas, el cap de Cabrità y el tossal dels Altars.',
			'La ruta es una vuelta circular corta, de pistas y campo a través, sin itinerario señalizado. Reptes Muntanyencs la hizo a finales de agosto; la buena época va del verano al otoño, sin nieve, y en verano conviene bajar antes de las tormentas de tarde.'
		]
	},
	rutes: [
		{
			id: 'llessui',
			nom: {
				ca: "Circular des de l'antiga estació de Llessui",
				es: 'Circular desde la antigua estación de Llessui'
			},
			sortida: { nom: "Antiga estació d'esquí de Llessui (Sort, 1.977 m)" },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Reptes Muntanyencs fa una volta en sentit horari que surt de l'antiga estació, combina pistes i camp a través i creua a gual el barranc sec del Portell. Passa pel rocall del pletiu de les Ordigues. Els pilons de la línia d'arrossegament guien la baixada, i l'orientació és de dificultat baixa. La ressenya compta 9,7 km i 689 m de desnivell, amb 2 h 50 min de marxa i 33 min d'aturades; el cim s'assoleix a la 1 h 38 min, comptant aturades. No esmenta passos de grimpada.",
				es: 'Reptes Muntanyencs hace una vuelta en sentido horario que sale de la antigua estación, combina pistas y campo a través y cruza a gual el barranco seco del Portell. Pasa por el pedregal del pletiu de les Ordigues. Los pilones de la línea de arrastre guían la bajada, y la orientación es de dificultad baja. La reseña cuenta 9,7 km y 689 m de desnivel, con 2 h 50 min de marcha y 33 min de paradas; la cima se alcanza a la 1 h 38 min, contando paradas. No menciona pasos de trepada.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"No hi ha itinerari senyalitzat: porta el track o un mapa, tot i que l'orientació és de dificultat baixa segons l'autor.",
			"Condueix amb calma per la pista de terra fins a l'antiga estació: segons Reptes Muntanyencs hi arriba un cotxe normal, però a poc a poc.",
			"Segons Reptes Muntanyencs, hi ha una font prop d'una cabana, al revolt anterior, i el barranc del Pletiu passa per sota la pista: tot i així, surt amb aigua.",
			'El cap de Cabrità i el tossal dels Altars són opcionals: afegeix-los només si tens temps i bona visibilitat.',
			"Si l'enllaces amb el Montsent de Pallars, calcula una jornada llarga i vigila les tempestes de tarda a l'estiu."
		],
		es: [
			'No hay itinerario señalizado: lleva el track o un mapa, aunque la orientación es de dificultad baja según el autor.',
			'Conduce con calma por la pista de tierra hasta la antigua estación: según Reptes Muntanyencs llega un coche normal, pero despacio.',
			'Según Reptes Muntanyencs, hay una fuente cerca de una cabaña, en la curva anterior, y el barranc del Pletiu pasa bajo la pista: aun así, sal con agua.',
			'El cap de Cabrità y el tossal dels Altars son opcionales: añádelos solo si tienes tiempo y buena visibilidad.',
			'Si lo enlazas con el Montsent de Pallars, calcula una jornada larga y vigila las tormentas de tarde en verano.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Tuc de la Cometa?',
				resposta:
					"Reptes Muntanyencs hi arriba en 1 h 38 min des de l'antiga estació de Llessui, aturades incloses. La volta circular sencera són 9,7 km, 689 m de desnivell i uns 3 h 22 min en total."
			},
			{
				pregunta: 'Es pot fer amb nens?',
				resposta:
					'Reptes Muntanyencs en valora la dificultat física com a moderada i la de progressió com a baixa, sense passos de grimpada, però no hi ha camí marcat i el recorregut fa gairebé 10 km. Valora si els infants hi estan acostumats.'
			},
			{
				pregunta: 'Es pot fer amb el Montsent de Pallars?',
				resposta:
					"Sí. Segons Reptes Muntanyencs, el Tuc de la Cometa i el Montsent són al mateix cordal i es poden assolir tots dos en una sola caminada, tot i que la ressenya no en descriu l'itinerari: planifica'l amb mapa i track."
			},
			{
				pregunta: 'El Tuc de la Cometa compta com a cim essencial?',
				resposta:
					'Sí, és un dels set [cims essencials](/cims-essencials) del Pallars Jussà. Amb 2.445 m és el quart en alçada de la llista, per sota de la [Pica de Cerví](/cims/pica-de-cervi) (2.753 m).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Tuc de la Cometa?',
				resposta:
					'Reptes Muntanyencs llega en 1 h 38 min desde la antigua estación de Llessui, paradas incluidas. La vuelta circular entera son 9,7 km, 689 m de desnivel y unas 3 h 22 min en total.'
			},
			{
				pregunta: '¿Se puede hacer con niños?',
				resposta:
					'Reptes Muntanyencs valora la dificultad física como moderada y la de progresión como baja, sin pasos de trepada, pero no hay camino marcado y el recorrido hace casi 10 km. Valora si los niños están acostumbrados.'
			},
			{
				pregunta: '¿Se puede hacer con el Montsent de Pallars?',
				resposta:
					'Sí. Según Reptes Muntanyencs, el Tuc de la Cometa y el Montsent están en el mismo cordal y se pueden alcanzar los dos en una sola caminata, aunque la reseña no describe el itinerario: planifícalo con mapa y track.'
			},
			{
				pregunta: '¿El Tuc de la Cometa cuenta como cima esencial?',
				resposta:
					'Sí, es una de las siete [cimas esenciales](/cims-essencials) del Pallars Jussà. Con 2.445 m es la cuarta en altura de la lista, por debajo de la [Pica de Cerví](/cims/pica-de-cervi) (2.753 m).'
			}
		]
	},
	fonts: [REPTES, FEEC, VIQUIPEDIA_MONTSENT],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
