import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: "Viquipèdia: Tossal d'Engrilló",
	url: 'https://ca.wikipedia.org/wiki/Tossal_d%27Engrill%C3%B3',
	consultat: CONSULTAT
};

const PARC_REFOIA = {
	nom: "Parc Natural dels Ports: el Molí i la Refoia (itinerari del Teix i el Tossal d'Engrilló)",
	url: 'https://parcsnaturals.gencat.cat/ca/xarxa-de-parcs/ports/gaudeix-del-parc/equipaments-i-itineraris/itineraris-arees-lleure/moli-refoia-prat-de-comte/',
	consultat: CONSULTAT
};

const PARC_REGULACIO = {
	nom: "Parc Natural dels Ports: regulació d'activitats",
	url: 'https://parcsnaturals.gencat.cat/ca/xarxa-de-parcs/ports/gaudeix-del-parc/consells/regulacio-dactivitats/',
	consultat: CONSULTAT
};

const HIKINGIBERIA = {
	nom: "Hiking Iberia: Punta de l'Aigua y Tossal d'Engrilló (ruta 193)",
	url: 'https://www.hikingiberia.com/resources/routes/es/parc-natural-ports-punta-aigua-tossal-engrillo.pdf',
	consultat: CONSULTAT
};

const REPTES = {
	nom: "Reptes Muntanyencs: Tossal d'Engrilló",
	url: 'https://reptesmuntanyencs.cat/tossal-dengrillo/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tossal-d-engrillo',
	descripcio: {
		ca: [
			"El Tossal d'Engrilló és al sector nord del Parc Natural dels Ports, [al Baix Ebre](/comarques/baix-ebre) i al límit amb la Terra Alta: hi conflueixen els termes de Paüls, Prat de Comte i Horta de Sant Joan. El parc el presenta, amb la Refoia i els Montsagres, com un dels conjunts paisatgístics més significatius de l'espai. És el punt més alt de la serra del Montsagre d'Horta i té un vèrtex geodèsic al cim.",
			"Al peu del tossal, la Refoia és un replà més frescal que el vessant de Paüls, amb pastures, pinedes de pi negral i una bassa al coll Roig. A la pista que hi puja hi ha el teix d'Engrilló, un arbre monumental que dona nom a l'itinerari senyalitzat del parc. La muntanya acaba en parets escarpades i el cim s'aboca a un precipici.",
			"Des de dalt es veuen les valls interiors dels Ports, la Terra Alta i el Matarranya, amb Horta de Sant Joan i les [Roques de Benet](/cims/roques-de-benet) en primer terme, i fins a la desembocadura de l'Ebre. El vent que sol bufar en aquestes serres neteja l'aire, però també fa incòmoda l'estona al cim.",
			"Hi ha dues maneres ben diferents de pujar-hi: la volta curta des de la Refoia, si s'hi arriba amb vehicle alt o a peu pel GR 171, o una circular llarga des de Paüls que encadena la Punta de l'Aigua i el tossal. Els altres cims essencials dels Ports són el [Caro](/cims/caro) i el [Tossal dels Tres Reis](/cims/tossal-dels-tres-reis)."
		],
		es: [
			"El Tossal d'Engrilló está en el sector norte del Parc Natural dels Ports, [en el Baix Ebre](/comarques/baix-ebre) y en el límite con la Terra Alta: confluyen en él los términos de Paüls, Prat de Comte y Horta de Sant Joan. El parque lo presenta, con la Refoia y los Montsagres, como uno de los conjuntos paisajísticos más significativos del espacio. Es el punto más alto de la sierra del Montsagre d'Horta y tiene un vértice geodésico en la cima.",
			'Al pie del tossal, la Refoia es un rellano más fresco que la vertiente de Paüls, con pastos, pinares de pino laricio y una balsa en el coll Roig. En la pista que sube está el tejo de Engrilló, un árbol monumental que da nombre al itinerario señalizado del parque. La montaña termina en paredes escarpadas y la cima se asoma a un precipicio.',
			'Desde arriba se ven los valles interiores de los Ports, la Terra Alta y el Matarranya, con Horta de Sant Joan y las [Roques de Benet](/cims/roques-de-benet) en primer término, y hasta la desembocadura del Ebro. El viento que suele soplar en estas sierras limpia el aire, pero también hace incómodo el rato en la cima.',
			"Hay dos maneras muy distintas de subir: la vuelta corta desde la Refoia, si se llega con vehículo alto o a pie por el GR 171, o una circular larga desde Paüls que encadena la Punta de l'Aigua y el tossal. Las otras cimas esenciales de los Ports son el [Caro](/cims/caro) y el [Tossal dels Tres Reis](/cims/tossal-dels-tres-reis)."
		]
	},
	rutes: [
		{
			id: 'refoia-teix',
			nom: {
				ca: "Itinerari del Teix i el Tossal d'Engrilló, des de la Refoia",
				es: "Itinerario del Teix y el Tossal d'Engrilló, desde la Refoia"
			},
			sortida: { nom: 'Aparcament de la Refoia (Paüls)' },
			descripcio: {
				ca: "És l'itinerari senyalitzat del Parc Natural dels Ports: una circular de 6,3 km, 240 m de desnivell i 1 h 30 min sense parades, de dificultat baixa segons el parc, que surt de l'aparcament de la Refoia, passa pel teix d'Engrilló i puja al tossal. La dificultat és arribar a la Refoia: el parc recomana vehicle tot terreny (uns 20 minuts des de Prat de Comte o des de Paüls). A peu pel GR 171 són 4,1 km, 541 m de desnivell i 1 h 30 min des de Paüls fins a la bassa del coll Roig, o 7,3 km, 520 m i 2 h des de l'àrea del Molí, a Prat de Comte.",
				es: 'Es el itinerario señalizado del Parc Natural dels Ports: una circular de 6,3 km, 240 m de desnivel y 1 h 30 min sin paradas, de dificultad baja según el parque, que sale del aparcamiento de la Refoia, pasa por el tejo de Engrilló y sube al tossal. La dificultad es llegar a la Refoia: el parque recomienda vehículo todoterreno (unos 20 minutos desde Prat de Comte o desde Paüls). A pie por el GR 171 son 4,1 km, 541 m de desnivel y 1 h 30 min desde Paüls hasta la balsa del coll Roig, o 7,3 km, 520 m y 2 h desde el área del Molí, en Prat de Comte.'
			},
			fonts: [PARC_REFOIA]
		},
		{
			id: 'pauls-punta-de-l-aigua',
			nom: {
				ca: "Circular des de Paüls per la Punta de l'Aigua",
				es: "Circular desde Paüls por la Punta de l'Aigua"
			},
			sortida: { nom: 'Cementiri de Paüls' },
			descripcio: {
				ca: "La guia Hiking Iberia proposa una circular de 15,9 km, 6 h i 1.093 m de desnivell total, de dificultat mitjana, que surt del cementiri de Paüls per pistes i senders, amb senyals blancs i vermells en una part, fites i pals. Puja primer a la Punta de l'Aigua, continua pel coll de la Gilaberta i el Montsagre d'Horta fins al tossal i torna a Paüls per la Refoia. Aquestes xifres són de tota la volta amb els dos cims. El bloc Reptes Muntanyencs, que va fer un recorregut semblant el 2010, hi trobava poca senyalització fins al coll de l'Avenc i algun tram sense camí definit.",
				es: "La guía Hiking Iberia propone una circular de 15,9 km, 6 h y 1.093 m de desnivel total, de dificultad media, que sale del cementerio de Paüls por pistas y senderos, con señales blancas y rojas en una parte, hitos y postes. Sube primero a la Punta de l'Aigua, continúa por el coll de la Gilaberta y el Montsagre d'Horta hasta el tossal y vuelve a Paüls por la Refoia. Estas cifras son de toda la vuelta con las dos cimas. El blog Reptes Muntanyencs, que hizo un recorrido parecido en 2010, encontraba poca señalización hasta el coll de l'Avenc y algún tramo sin camino definido."
			},
			fonts: [HIKINGIBERIA, REPTES]
		}
	],
	consells: {
		ca: [
			"Decideix abans per on hi vas: des de la Refoia és una volta d'una hora i mitja; des de Paüls, una jornada sencera amb més de mil metres de desnivell.",
			'Per pujar a la Refoia amb cotxe el parc recomana tot terreny. Amb un turisme, compta de fer a peu el tram del GR 171.',
			"El cim s'acaba en un precipici: no t'acostis a la vora, sobretot amb vent.",
			"Una part del parc coincideix amb la Reserva Nacional de Caça dels Ports de Tortosa i Beseit, que programa batudes de porc senglar entre setembre i març (web del parc, consulta del 2026). Mira'n el calendari abans de sortir i consulta la regulació vigent.",
			"A la volta llarga, el bloc situava aigua a les fonts del Montsagre d'Horta i del Montsagre de Paüls, sense garanties de potabilitat: porta la teva."
		],
		es: [
			'Decide antes por dónde vas: desde la Refoia es una vuelta de hora y media; desde Paüls, una jornada entera con más de mil metros de desnivel.',
			'Para subir a la Refoia en coche el parque recomienda todoterreno. Con un turismo, cuenta con hacer a pie el tramo del GR 171.',
			'La cima termina en un precipicio: no te acerques al borde, sobre todo con viento.',
			'Una parte del parque coincide con la Reserva Nacional de Caça dels Ports de Tortosa i Beseit, que programa batidas de jabalí entre septiembre y marzo (web del parque, consulta de 2026). Mira el calendario antes de salir y consulta la regulación vigente.',
			"En la vuelta larga, el blog situaba agua en las fuentes del Montsagre d'Horta y del Montsagre de Paüls, sin garantías de potabilidad: lleva la tuya."
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Quina és la manera més curta de pujar al Tossal d'Engrilló?",
				resposta:
					"L'itinerari del Teix i el Tossal d'Engrilló, del Parc Natural dels Ports: una circular de 6,3 km, 240 m de desnivell i 1 h 30 min des de l'aparcament de la Refoia, on el parc recomana arribar amb tot terreny."
			},
			{
				pregunta: 'Quant es triga des de Paüls?',
				resposta:
					"Pel GR 171 hi ha 1 h 30 min, 4,1 km i 541 m de desnivell fins a la bassa del coll Roig, a la Refoia, on comença l'itinerari del tossal. La circular llarga per la Punta de l'Aigua que descriu Hiking Iberia demana unes 6 h."
			},
			{
				pregunta: 'Està senyalitzat?',
				resposta:
					"L'itinerari de la Refoia és un dels senyalitzats pel parc, i el GR 171 uneix Paüls, la Refoia i Prat de Comte. A la circular per la Punta de l'Aigua la senyalització és parcial i hi ha trams de fites."
			},
			{
				pregunta: "El Tossal d'Engrilló compta com a cim essencial?",
				resposta:
					'Sí, és un dels tres [cims essencials](/cims-essencials) del Baix Ebre, amb el [Caro](/cims/caro) i la [Creu de Santos](/cims/creu-de-santos).'
			}
		],
		es: [
			{
				pregunta: "¿Cuál es la manera más corta de subir al Tossal d'Engrilló?",
				resposta:
					"El itinerario del Teix y el Tossal d'Engrilló, del Parc Natural dels Ports: una circular de 6,3 km, 240 m de desnivel y 1 h 30 min desde el aparcamiento de la Refoia, adonde el parque recomienda llegar con todoterreno."
			},
			{
				pregunta: '¿Cuánto se tarda desde Paüls?',
				resposta:
					"Por el GR 171 hay 1 h 30 min, 4,1 km y 541 m de desnivel hasta la balsa del coll Roig, en la Refoia, donde empieza el itinerario del tossal. La circular larga por la Punta de l'Aigua que describe Hiking Iberia pide unas 6 h."
			},
			{
				pregunta: '¿Está señalizado?',
				resposta:
					"El itinerario de la Refoia es uno de los señalizados por el parque, y el GR 171 une Paüls, la Refoia y Prat de Comte. En la circular por la Punta de l'Aigua la señalización es parcial y hay tramos de hitos."
			},
			{
				pregunta: "¿El Tossal d'Engrilló cuenta como cima esencial?",
				resposta:
					'Sí, es una de las tres [cimas esenciales](/cims-essencials) del Baix Ebre, con el [Caro](/cims/caro) y la [Creu de Santos](/cims/creu-de-santos).'
			}
		]
	},
	fonts: [VIQUIPEDIA, PARC_REFOIA, PARC_REGULACIO, HIKINGIBERIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
