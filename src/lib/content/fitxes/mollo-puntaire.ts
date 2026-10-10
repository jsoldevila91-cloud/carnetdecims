import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Molló Puntaire',
	url: 'https://ca.wikipedia.org/wiki/Moll%C3%B3_Puntaire',
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
	nom: 'Reptes Muntanyencs: Molló Puntaire',
	url: 'https://reptesmuntanyencs.cat/mollo-puntaire/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'mollo-puntaire',
	descripcio: {
		ca: [
			"El Molló Puntaire és el cim més alt de les Muntanyes de Tivissa-Vandellòs, a la Serralada Prelitoral, dins el terme de Vandellòs i l'Hospitalet de l'Infant, [al Baix Camp](/comarques/baix-camp). La Viquipèdia en descriu la roca com a dolomita, hi anota un vèrtex geodèsic al cim i el relaciona amb els Dedalts de Vandellòs, nom amb què la Gran Enciclopèdia Catalana agrupa el Puntaire i la mola del Grèvol.",
			"L'espai és protegit i amb un caràcter molt marcat: la Viquipèdia parla de muntanyes seques, esquerpes i gairebé despoblades, de calcàries amb cingles i barrancs, amb màquia i garriga als costers solans i alzinars a les obagues. El conjunt va entrar al PEIN pel Decret 328/1992 i forma part de la xarxa Natura 2000. A prop hi ha la [Mola de Genessies](/cims/mola-de-genessies), també essencial, i a la serra veïna de Tivissa [la Tossa](/cims/la-tossa-tivissa).",
			"El bloc Reptes Muntanyencs, que hi va pujar el març del 2016 des de la masia de Castelló, a Masboquera, parla de la serralada com del conjunt de les serres de Mestral. Pel camí esmenta les restes del mas de Navaies, el forat del Vent o collet de la Creu, i una pedra d'erosió que anomena el Bolet. Quant a les vistes, les descriu com a molt bones i diu que abasten des del Pirineu fins al Delta, tot i que el dia que hi va anar la boira les va limitar.",
			"Una part de la ruta segueix el GR 192, i la resta combina pistes i senders. No hi ha cap font d'aigua al recorregut segons el bloc, de manera que convé sortir amb tota l'aigua."
		],
		es: [
			"El Molló Puntaire es la cima más alta de las Muntanyes de Tivissa-Vandellòs, en la Serralada Prelitoral, dentro del término de Vandellòs i l'Hospitalet de l'Infant, [en el Baix Camp](/comarques/baix-camp). La Viquipèdia describe su roca como dolomita, anota un vértice geodésico en la cima y lo relaciona con los Dedalts de Vandellòs, nombre con el que la Gran Enciclopèdia Catalana agrupa el Puntaire y la mola del Grèvol.",
			'El espacio es protegido y de carácter muy marcado: la Viquipèdia habla de montañas secas, escarpadas y casi despobladas, de calizas con riscos y barrancos, con maquia y garriga en las laderas solanas y encinares en las umbrías. El conjunto entró en el PEIN por el Decreto 328/1992 y forma parte de la red Natura 2000. Cerca está la [Mola de Genessies](/cims/mola-de-genessies), también esencial, y en la sierra vecina de Tivissa [la Tossa](/cims/la-tossa-tivissa).',
			'El blog Reptes Muntanyencs, que subió en marzo de 2016 desde la masía de Castelló, en Masboquera, habla de la cordillera como del conjunto de las serres de Mestral. En el camino menciona los restos del mas de Navaies, el forat del Vent o collet de la Creu, y una piedra de erosión que llama el Bolet. En cuanto a las vistas, las describe como muy buenas y dice que abarcan desde el Pirineo hasta el Delta, aunque el día que fue la niebla las limitó.',
			'Una parte de la ruta sigue el GR 192, y el resto combina pistas y senderos. No hay ninguna fuente de agua en el recorrido según el blog, de modo que conviene salir con toda el agua.'
		]
	},
	rutes: [
		{
			id: 'castello-circular',
			nom: {
				ca: 'Circular des de la masia de Castelló pel GR 192',
				es: 'Circular desde la masía de Castelló por el GR 192'
			},
			sortida: { nom: 'Masia de Castelló (Masboquera, Vandellòs i l’Hospitalet de l’Infant)' },
			descripcio: {
				ca: "Reptes Muntanyencs documenta una circular en sentit horari que surt de la masia de Castelló, accessible per carretera asfaltada. Fa 12,7 km, uns 589 m de desnivell positiu i 4 h 25 min de marxa efectiva; segons el seu track, el cim s'assoleix als 6 km de la sortida, passant pel coll de la Creu, la caseta de Pere Bou, la portella del Xato i la portella de les Llongues. La baixada passa per la font de Navaies i enllaça amb el GR 192 fins al punt de partida. El bloc la qualifica de «pistes i senders», amb senyalització parcial amb pintura de GR i PR.",
				es: 'Reptes Muntanyencs documenta una circular en sentido horario que sale de la masía de Castelló, accesible por carretera asfaltada. Tiene 12,7 km, unos 589 m de desnivel positivo y 4 h 25 min de marcha efectiva; según su track, la cima se alcanza a los 6 km de la salida, pasando por el coll de la Creu, la caseta de Pere Bou, la portella del Xato y la portella de les Llongues. La bajada pasa por la font de Navaies y enlaza con el GR 192 hasta el punto de partida. El blog la califica de «pistas y senderos», con señalización parcial de pintura de GR y PR.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'El recorregut combina pistes i senders i la senyalització és parcial: porta un track i un mapa, sobretot amb boira.',
			"El bloc anota que no hi ha fonts d'aigua al recorregut: surt amb tota l'aigua que necessitis.",
			"La ressenya és del 2016; comprova l'estat dels camins i les marques abans de sortir.",
			"El bloc comença la pujada pel GR 192 des de l'aparcament de la masia; tingues-lo com a referència per orientar-te.",
			"En cas d'emergència, 112."
		],
		es: [
			'El recorrido combina pistas y senderos y la señalización es parcial: lleva un track y un mapa, sobre todo con niebla.',
			'El blog anota que no hay fuentes de agua en el recorrido: sal con toda el agua que necesites.',
			'La reseña es de 2016; comprueba el estado de los caminos y las marcas antes de salir.',
			'El blog empieza la subida por el GR 192 desde el aparcamiento de la masía; tenlo como referencia para orientarte.',
			'En caso de emergencia, 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Molló Puntaire?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 12,7 km des de la masia de Castelló amb 4 h 25 min de marxa efectiva; segons el seu track, el cim és als 6 km de la sortida.'
			},
			{
				pregunta: 'Quin és el punt de sortida més habitual?',
				resposta:
					'El bloc surt de la masia de Castelló, a Masboquera, accessible per carretera asfaltada, i segueix el GR 192.'
			},
			{
				pregunta: 'Què es veu des del cim?',
				resposta:
					"El bloc parla d'unes vistes molt bones que abasten des del Pirineu fins al Delta, tot i que el dia de la seva ascensió la boira les limitava."
			},
			{
				pregunta: 'El Molló Puntaire compta com a cim essencial?',
				resposta:
					'Sí, és un dels sis [cims essencials](/cims-essencials) del Baix Camp, i és el punt més alt de les Muntanyes de Tivissa-Vandellòs.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Molló Puntaire?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 12,7 km desde la masía de Castelló con 4 h 25 min de marcha efectiva; según su track, la cima está a 6 km de la salida.'
			},
			{
				pregunta: '¿Cuál es el punto de salida más habitual?',
				resposta:
					'El blog sale de la masía de Castelló, en Masboquera, accesible por carretera asfaltada, y sigue el GR 192.'
			},
			{
				pregunta: '¿Qué se ve desde la cima?',
				resposta:
					'El blog habla de unas vistas muy buenas que abarcan desde el Pirineo hasta el Delta, aunque el día de su ascensión la niebla las limitaba.'
			},
			{
				pregunta: '¿El Molló Puntaire cuenta como cima esencial?',
				resposta:
					'Sí, es una de las seis [cimas esenciales](/cims-essencials) del Baix Camp, y es el punto más alto de las Muntanyes de Tivissa-Vandellòs.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_MUNTANYES, GEC, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
