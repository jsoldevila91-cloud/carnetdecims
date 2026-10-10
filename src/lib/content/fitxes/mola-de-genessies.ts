import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Mola de Genessies',
	url: 'https://ca.wikipedia.org/wiki/Mola_de_Genessies',
	consultat: CONSULTAT
};

const VIQUIPEDIA_MUNTANYES = {
	nom: 'Viquipèdia: Muntanyes de Tivissa-Vandellòs',
	url: 'https://ca.wikipedia.org/wiki/Muntanyes_de_Tivissa-Vandell%C3%B2s',
	consultat: CONSULTAT
};

const GEC = {
	nom: "Gran Enciclopèdia Catalana: Vandellòs i l'Hospitalet de l'Infant",
	url: 'https://www.enciclopedia.cat/gran-enciclopedia-catalana/vandellos-i-lhospitalet-de-linfant',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Mola de Genessies',
	url: 'https://reptesmuntanyencs.cat/mola-de-genessies/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'mola-de-genessies',
	descripcio: {
		ca: [
			"La Mola de Genessies és un cim de pedra calcària i dolomia a cavall dels termes de Vandellòs i l'Hospitalet de l'Infant, [al Baix Camp](/comarques/baix-camp), i de Tivissa, ja a la Ribera d'Ebre. La Viquipèdia la situa dins l'espai protegit de les Muntanyes de Tivissa-Vandellòs i hi anota un vèrtex geodèsic al cim. La Gran Enciclopèdia Catalana l'esmenta entre els relleus que voregen la vall del riu de Llastres.",
			"La mateixa Viquipèdia descriu les Muntanyes de Tivissa-Vandellòs com a «seques, esquerpes i gairebé despoblades»: una serralada calcària de costers solans coberts de màquia i garriga, amb alzinars a les obagues, on viu l'àguila daurada. El conjunt va entrar al PEIN pel Decret 328/1992, va ser declarat LIC el 1997 i ZEPA el 2005 i forma part de la xarxa Natura 2000. A prop teniu el [Molló Puntaire](/cims/mollo-puntaire), el cim més alt d'aquestes muntanyes, i [la Tossa de Tivissa](/cims/la-tossa-tivissa).",
			"La Gran Enciclopèdia Catalana ensenya també el patrimoni humà de la muntanya. Al vessant sud-oriental de la mola, per sobre del barranc Fondo, hi ha Gavadà, un nucli despoblat que conserva les restes de la torre circular més antiga del terme; i la masia de Genessies té una torre defensiva del segle XVI. El bloc Reptes Muntanyencs, que recorre la zona, diu que el Mas de Genessies sembla deshabitat però que va tenir la seva importància, i que a prop del cim, on es parla d'un possible poblat ibèric, només hi ha un munt de pedres que fan pensar en tancats de ramats.",
			"El bloc afirma que les vistes des del cim són molt bones. L'autor recomana pantalons llargs per la brossa que hi ha als senders."
		],
		es: [
			"La Mola de Genessies es una cima de piedra caliza y dolomía a caballo de los términos de Vandellòs i l'Hospitalet de l'Infant, [en el Baix Camp](/comarques/baix-camp), y de Tivissa, ya en la Ribera d'Ebre. La Viquipèdia la sitúa dentro del espacio protegido de las Muntanyes de Tivissa-Vandellòs y anota un vértice geodésico en la cima. La Gran Enciclopèdia Catalana la menciona entre los relieves que bordean el valle del río de Llastres.",
			'La misma Viquipèdia describe las Muntanyes de Tivissa-Vandellòs como «secas, escarpadas y casi despobladas»: una sierra caliza de laderas solanas cubiertas de maquia y garriga, con encinares en las umbrías, donde vive el águila real. El conjunto entró en el PEIN por el Decreto 328/1992, fue declarado LIC en 1997 y ZEPA en 2005 y forma parte de la red Natura 2000. Cerca tienes el [Molló Puntaire](/cims/mollo-puntaire), la cima más alta de estas montañas, y [la Tossa de Tivissa](/cims/la-tossa-tivissa).',
			'La Gran Enciclopèdia Catalana enseña también el patrimonio humano de la montaña. En la vertiente sudoriental de la mola, por encima del barranc Fondo, está Gavadà, un núcleo despoblado que conserva los restos de la torre circular más antigua del término; y la masía de Genessies tiene una torre defensiva del siglo XVI. El blog Reptes Muntanyencs, que recorre la zona, dice que el Mas de Genessies parece deshabitado pero que tuvo su importancia, y que cerca de la cima, donde se habla de un posible poblado ibérico, solo hay un montón de piedras que hacen pensar en rediles de ganado.',
			'El blog afirma que las vistas desde la cima son muy buenas. El autor recomienda pantalones largos por la maleza que hay en los senderos.'
		]
	},
	rutes: [
		{
			id: 'cami-de-gavada',
			nom: {
				ca: 'Circular des del camí de Gavadà pel portell de Jovara',
				es: 'Circular desde el camí de Gavadà por el portell de Jovara'
			},
			sortida: { nom: 'Camí de Gavadà (carretera asfaltada)' },
			descripcio: {
				ca: "Reptes Muntanyencs documenta una circular, en sentit antihorari, que surt del camí de Gavadà i fa 9,1 km, uns 458 m de desnivell positiu i 2 h 37 min de marxa efectiva. Passa pel camí de Sant Jaume, el portell de Jovara i el portell d'en Gardell, i segons el seu track el cim arriba als 4,9 km de la sortida; la baixada passa pel coll del Rourar, el barranc Fondo i el Mas de Genessies. Barreja pistes, senders i alguns trams de traça tènue que cal intuir, i uns 1.500 m d'asfalt, sobretot al final. El bloc adverteix que el sender cap al cim no té cap senyalització ni fites.",
				es: "Reptes Muntanyencs documenta una circular, en sentido antihorario, que sale del camí de Gavadà y tiene 9,1 km, unos 458 m de desnivel positivo y 2 h 37 min de marcha efectiva. Pasa por el camí de Sant Jaume, el portell de Jovara y el portell d'en Gardell, y según su track la cima llega a los 4,9 km de la salida; la bajada pasa por el coll del Rourar, el barranc Fondo y el Mas de Genessies. Mezcla pistas, senderos y algunos tramos de traza tenue que hay que intuir, y unos 1.500 m de asfalto, sobre todo al final. El blog advierte de que el sendero a la cima no tiene ninguna señalización ni hitos."
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"El sender cap al cim no té senyalització ni fites, segons el bloc: porta el track i un mapa de l'ICGC, i no hi vagis amb boira.",
			"La ressenya és de novembre del 2015. Comprova l'estat del recorregut abans de sortir.",
			"Hi ha uns 1.500 m d'asfalt, sobretot al final de la circular, segons el bloc.",
			"Porta pantalons llargs: el bloc ho recomana per la brossa dels senders. El bloc anota que no hi ha fonts d'aigua: surt amb tota l'aigua.",
			"Si surts amb calor o vent, recorda que és un recorregut llarg per senders sense marques: val més girar cua que perdre's."
		],
		es: [
			'El sendero a la cima no tiene señalización ni hitos, según el blog: lleva el track y un mapa del ICGC, y no vayas con niebla.',
			'La reseña es de noviembre de 2015. Comprueba el estado del recorrido antes de salir.',
			'Hay unos 1.500 m de asfalto, sobre todo al final de la circular, según el blog.',
			'Lleva pantalones largos: el blog lo recomienda por la maleza de los senderos. El blog anota que no hay fuentes de agua: sal con toda el agua.',
			'Si sales con calor o viento, recuerda que es un recorrido largo por senderos sin marcas: vale más dar la vuelta que perderse.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Mola de Genessies?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 9,1 km amb 2 h 37 min de marxa efectiva; segons el seu track, el cim és als 4,9 km de la sortida.'
			},
			{
				pregunta: 'Està senyalitzat el camí fins al cim?',
				resposta:
					'No. El bloc diu que el sender no té cap senyalització ni fites, de manera que cal portar el track i saber orientar-se.'
			},
			{
				pregunta: 'Hi ha un poblat ibèric al cim?',
				resposta:
					"Es parla d'un possible poblat ibèric, però el bloc només hi va trobar un munt de pedres que fan pensar més en tancats de ramats que en un poblat."
			},
			{
				pregunta: 'La Mola de Genessies compta com a cim essencial?',
				resposta:
					'Sí, és un dels sis [cims essencials](/cims-essencials) del Baix Camp, amb el [Molló Puntaire](/cims/mollo-puntaire).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Mola de Genessies?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 9,1 km con 2 h 37 min de marcha efectiva; según su track, la cima está a 4,9 km de la salida.'
			},
			{
				pregunta: '¿Está señalizado el camino hasta la cima?',
				resposta:
					'No. El blog dice que el sendero no tiene ninguna señalización ni hitos, de modo que hay que llevar el track y saber orientarse.'
			},
			{
				pregunta: '¿Hay un poblado ibérico en la cima?',
				resposta:
					'Se habla de un posible poblado ibérico, pero el blog solo encontró allí un montón de piedras que hacen pensar más en rediles de ganado que en un poblado.'
			},
			{
				pregunta: '¿La Mola de Genessies cuenta como cima esencial?',
				resposta:
					'Sí, es una de las seis [cimas esenciales](/cims-essencials) del Baix Camp, con el [Molló Puntaire](/cims/mollo-puntaire).'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_MUNTANYES, GEC, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
