import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: "Viquipèdia: Tossal d'Engrilló",
	url: 'https://ca.wikipedia.org/wiki/Tossal_d%27Engrill%C3%B3',
	consultat: CONSULTAT
};

const VIQUIPEDIA_PARC = {
	nom: 'Viquipèdia: Parc Natural dels Ports',
	url: 'https://ca.wikipedia.org/wiki/Parc_Natural_dels_Ports',
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
			"El Tossal d'Engrilló és una muntanya dels Ports de Tortosa-Beseit, [al Baix Ebre](/comarques/baix-ebre), al límit amb la Terra Alta: la Viquipèdia el situa entre els termes de Paüls, d'Horta de Sant Joan i de Prat de Comte. Queda dins el Parc Natural dels Ports i té un vèrtex geodèsic al cim. Les roques són calcàries, dolomies i margues.",
			"El Parc Natural dels Ports es va declarar el 12 de juny del 2001 pel Decret 160/2001 i fa 35.050 ha. Segons la Viquipèdia, hi predominen les roques carbonatades, d'on surten gorges, coves i surgències, i el punt més alt és el [Caro](/cims/caro), de 1.441 m. Una altra cim essencial de la serralada, ja a la banda meridional, és el [Tossal dels Tres Reis](/cims/tossal-dels-tres-reis); i a Horta de Sant Joan hi ha les [Roques de Benet](/cims/roques-de-benet) i [Santa Bàrbara](/cims/santa-barbara).",
			"Hiking Iberia, que inclou el tossal en una circular per l'oest del parc, el presenta com un segon cim, després de la Punta de l'Aigua, i en destaca les parets rocoses escarpades. Reptes Muntanyencs hi afegeix que els camins passen a tocar de coves i avencs, que va trobar «un petit avenc que ens dificultava el pas» i que l'itinerari passa per tota mena de terreny: pistes, camins, senders i alguns trams fora de camí. Al cim, segons aquest bloc, les vistes panoràmiques són molt bones.",
			"Les dues ressenyes són circulars llargues que surten de Paüls, de manera que es tracta d'una jornada completa de muntanya i no d'una passejada. Convé conèixer bé l'orientació, perquè segons el bloc la senyalització al començament és escassa i només millora a partir d'un coll."
		],
		es: [
			"El Tossal d'Engrilló es una montaña de los Ports de Tortosa-Beseit, [en el Baix Ebre](/comarques/baix-ebre), en el límite con la Terra Alta: la Viquipèdia lo sitúa entre los términos de Paüls, de Horta de Sant Joan y de Prat de Comte. Queda dentro del Parc Natural dels Ports y tiene un vértice geodésico en la cima. Las rocas son calizas, dolomías y margas.",
			'El Parc Natural dels Ports se declaró el 12 de junio de 2001 por el Decreto 160/2001 y tiene 35.050 ha. Según la Viquipèdia, predominan las rocas carbonatadas, de las que salen gargantas, cuevas y surgencias, y el punto más alto es el [Caro](/cims/caro), de 1.441 m. Otra cima esencial de la sierra, ya en la parte meridional, es el [Tossal dels Tres Reis](/cims/tossal-dels-tres-reis); y en Horta de Sant Joan están las [Roques de Benet](/cims/roques-de-benet) y [Santa Bàrbara](/cims/santa-barbara).',
			"Hiking Iberia, que incluye el tossal en una circular por el oeste del parque, lo presenta como un segundo pico, después de la Punta de l'Aigua, y destaca sus paredes rocosas escarpadas. Reptes Muntanyencs añade que los caminos pasan junto a cuevas y simas, que encontró «un pequeño pozo que le dificultaba el paso» y que el itinerario pasa por todo tipo de terreno: pistas, caminos, senderos y algunos tramos fuera de camino. En la cima, según este blog, las vistas panorámicas son muy buenas.",
			'Las dos reseñas son circulares largas que salen de Paüls, de modo que se trata de una jornada completa de montaña y no de un paseo. Conviene conocer bien la orientación, porque según el blog la señalización al principio es escasa y solo mejora a partir de un collado.'
		]
	},
	rutes: [
		{
			id: 'pauls-punta-de-l-aigua',
			nom: {
				ca: "Circular des de Paüls per la Punta de l'Aigua",
				es: "Circular desde Paüls por la Punta de l'Aigua"
			},
			sortida: { nom: 'Cementiri de Paüls' },
			descripcio: {
				ca: "Hiking Iberia proposa una circular que surt del costat del cementiri de Paüls i la qualifica de dificultat mitjana (5/15): 15,9 km, 6 h i 1.093 m de desnivell total, per pistes sense asfaltar i senders, amb senyalització blanquivermella parcial, fites i senyals. Passa pel coll de la Gilaberta, puja a la Punta de l'Aigua, continua cap al Montsagre d'Horta, arriba al Tossal d'Engrilló, baixa al coll de la Refoia i torna pel barranc del Montsagre. Les xifres són del circuit complet, que inclou la Punta de l'Aigua, no només de la pujada al tossal.",
				es: "Hiking Iberia propone una circular que sale junto al cementerio de Paüls y la califica de dificultad media (5/15): 15,9 km, 6 h y 1.093 m de desnivel total, por pistas sin asfaltar y senderos, con señalización blanquirroja parcial, hitos y señales. Pasa por el coll de la Gilaberta, sube a la Punta de l'Aigua, continúa hacia el Montsagre d'Horta, llega al Tossal d'Engrilló, baja al coll de la Refoia y regresa por el barranc del Montsagre. Las cifras son del circuito completo, que incluye la Punta de l'Aigua, no solo de la subida al tossal."
			},
			fonts: [HIKINGIBERIA]
		},
		{
			id: 'pauls-circular-bloc',
			nom: {
				ca: 'Circular des de Paüls en sentit horari',
				es: 'Circular desde Paüls en sentido horario'
			},
			sortida: { nom: 'Paüls' },
			descripcio: {
				ca: "Reptes Muntanyencs documenta una altra circular de Paüls, en sentit horari: 14,7 km, uns 1.087 m de desnivell positiu i 4 h 15 min de marxa efectiva; el cim arriba als 8,9 km de la sortida i a 3 h 12 min. També passa per la Punta de l'Aigua. Hi ha senyals de PR, pintura vermella i fites; al començament, però, hi ha poca senyalització, i millora a partir del coll.",
				es: "Reptes Muntanyencs documenta otra circular de Paüls, en sentido horario: 14,7 km, unos 1.087 m de desnivel positivo y 4 h 15 min de marcha efectiva; la cima llega a los 8,9 km de la salida y a 3 h 12 min. También pasa por la Punta de l'Aigua. Hay señales de PR, pintura roja e hitos; al comienzo, sin embargo, hay poca señalización, y mejora a partir del collado."
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"Els dos recorreguts documentats són circulars llargues, de més de 14 km i prop de 1.100 m de desnivell: planifica una jornada sencera i surt d'hora.",
			'Segons el bloc, al començament hi ha poca senyalització i millora a partir del coll. Porta un track i un mapa.',
			"Els camins passen a prop de coves i avencs: no te n'apropis a les boques.",
			'Hiking Iberia indica senyalització blanquivermella parcial, fites i senyals; atenció als encreuaments dels camins.',
			'Consulta la normativa vigent del Parc Natural dels Ports abans de sortir.'
		],
		es: [
			'Los dos recorridos documentados son circulares largas, de más de 14 km y cerca de 1.100 m de desnivel: planifica una jornada entera y sal temprano.',
			'Según el blog, al comienzo hay poca señalización y mejora a partir del collado. Lleva un track y un mapa.',
			'Los caminos pasan cerca de cuevas y simas: no te acerques a las bocas.',
			'Hiking Iberia indica señalización blanquirroja parcial, hitos y señales; atención a los cruces de caminos.',
			'Consulta la normativa vigente del Parc Natural dels Ports antes de salir.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Quant es triga a pujar al Tossal d'Engrilló?",
				resposta:
					"Hiking Iberia calcula 6 h per a la circular de 15,9 km des de Paüls, que també puja a la Punta de l'Aigua. Reptes Muntanyencs hi dedica 4 h 15 min de marxa efectiva en 14,7 km, amb el cim a 3 h 12 min de la sortida."
			},
			{
				pregunta: 'Hi ha un camí senyalitzat?',
				resposta:
					"Parcialment. Hiking Iberia parla de senyalització blanquivermella parcial, fites i senyals; el bloc diu que al començament n'hi ha poca i que millora a partir del coll."
			},
			{
				pregunta: 'Hi ha perills al camí?',
				resposta:
					'Reptes Muntanyencs anota que els camins passen a tocar de coves i avencs i que va trobar un petit avenc que li dificultava el pas; a més, part del recorregut és fora de camí.'
			},
			{
				pregunta: "El Tossal d'Engrilló compta com a cim essencial?",
				resposta:
					'Sí, és un dels cims essencials dels Ports, amb el [Tossal dels Tres Reis](/cims/tossal-dels-tres-reis), el [Caro](/cims/caro), les [Roques de Benet](/cims/roques-de-benet) i [Santa Bàrbara](/cims/santa-barbara). Consulta la [llista de cims essencials](/cims-essencials).'
			}
		],
		es: [
			{
				pregunta: "¿Cuánto se tarda en subir al Tossal d'Engrilló?",
				resposta:
					"Hiking Iberia calcula 6 h para la circular de 15,9 km desde Paüls, que también sube a la Punta de l'Aigua. Reptes Muntanyencs dedica 4 h 15 min de marcha efectiva en 14,7 km, con la cima a 3 h 12 min de la salida."
			},
			{
				pregunta: '¿Hay un camino señalizado?',
				resposta:
					'Parcialmente. Hiking Iberia habla de señalización blanquirroja parcial, hitos y señales; el blog dice que al comienzo hay poca y que mejora a partir del collado.'
			},
			{
				pregunta: '¿Hay peligros en el camino?',
				resposta:
					'Reptes Muntanyencs anota que los caminos pasan junto a cuevas y simas y que encontró un pequeño pozo que le dificultaba el paso; además, parte del recorrido es fuera de camino.'
			},
			{
				pregunta: "¿El Tossal d'Engrilló cuenta como cima esencial?",
				resposta:
					'Sí, es una de las cimas esenciales de los Ports, con el [Tossal dels Tres Reis](/cims/tossal-dels-tres-reis), el [Caro](/cims/caro), las [Roques de Benet](/cims/roques-de-benet) y [Santa Bàrbara](/cims/santa-barbara). Consulta la [lista de cimas esenciales](/cims-essencials).'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_PARC, HIKINGIBERIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
