import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: "Viquipèdia: L'Elefant (Montserrat), a partir de D. Balcells, «Montserrat: 50 indrets amb encant» (Cossetània, 2014)",
	url: "https://ca.wikipedia.org/wiki/L'Elefant_(Montserrat)",
	consultat: CONSULTAT
};

const CATALUNYA_ROMANICA = {
	nom: 'Catalunya Romànica: Sant Salvador (Monistrol de Montserrat)',
	url: 'https://www.enciclopedia.cat/catalunya-romanica/sant-salvador-monistrol-de-montserrat',
	consultat: CONSULTAT
};

const TRAVESIA_PIRENAICA = {
	nom: 'Travesía Pirenaica: circular des de Monistrol pel monestir de Montserrat, per canals i ermites',
	url: 'https://travesiapirenaica.com/en/?p=36961',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'elefant-roca-de-sant-salvador',
	descripcio: {
		ca: [
			"L'Elefant és el nom popular de la roca de Sant Salvador, una de les agulles de conglomerat de la Tebaida, la regió de Montserrat que queda just damunt del monestir, al terme de Monistrol de Montserrat ([Bages](/comarques/bages)). Segons la Viquipèdia, és la roca més alta d'aquest sector, veïna de la Mòmia, la Prenyada i la Panxa del Bisbe. Dins del mateix massís, [Sant Jeroni](/cims/sant-jeroni) i [el Montgròs](/cims/montgros) són els altres cims essencials.",
			"El nom li ve de la silueta que es veu des de la banda del monestir, amb una gran trompa de roca que penja pel vessant de llevant. La Viquipèdia precisa un detall que convé saber abans d'anar-hi: el punt més alt no és el cap de l'elefant, sinó una roca que queda al darrere i separada. Per la trompa puja la Boy-Roca, una via d'escalada clàssica oberta el 1960.",
			"A la balma de la mateixa roca s'arrecera l'ermita de Sant Salvador. Catalunya Romànica recull que el 1217 ja hi havia una ermita amb aquesta advocació, habitada per eremites i dependent del monestir de Montserrat, que va quedar malmesa durant la guerra del Francès, es va reconstruir el 1817 i el 1820 tornava a fer d'eremitori.",
			"**No és una excursió de camí.** La descripció de la pujada a peu que recull la Viquipèdia, a partir d'una guia de Cossetània, parla de pendents rocallosos molt inclinats amb alguna grimpada fàcil i d'un pas estret final entre dues parets de roca, curt i poc aeri. Cal saber grimpar i desgrimpar amb seguretat sobre conglomerat: si no en tens experiència, queda't al coll o a l'ermita, que ja són un bon objectiu."
		],
		es: [
			'El Elefant es el nombre popular de la roca de Sant Salvador, una de las agujas de conglomerado de la Tebaida, la región de Montserrat que queda justo encima del monasterio, en el término de Monistrol de Montserrat ([Bages](/comarques/bages)). Según la Viquipèdia, es la roca más alta de este sector, vecina de la Mòmia, la Prenyada y la Panxa del Bisbe. En el mismo macizo, [Sant Jeroni](/cims/sant-jeroni) y [el Montgròs](/cims/montgros) son las otras cimas esenciales.',
			'El nombre le viene de la silueta que se ve desde el lado del monasterio, con una gran trompa de roca que cuelga por la vertiente este. La Viquipèdia precisa un detalle que conviene saber antes de ir: el punto más alto no es la cabeza del elefante, sino una roca que queda detrás y separada. Por la trompa sube la Boy-Roca, una vía de escalada clásica abierta en 1960.',
			'En la balma de la misma roca se resguarda la ermita de Sant Salvador. Catalunya Romànica recoge que en 1217 ya había una ermita con esta advocación, habitada por eremitas y dependiente del monasterio de Montserrat, que quedó dañada durante la guerra de la Independencia, se reconstruyó en 1817 y en 1820 volvía a servir de eremitorio.',
			'**No es una excursión de camino.** La descripción de la subida a pie que recoge la Viquipèdia, a partir de una guía de Cossetània, habla de pendientes rocosas muy inclinadas con alguna trepada fácil y de un paso estrecho final entre dos paredes de roca, corto y poco aéreo. Hay que saber trepar y destrepar con seguridad sobre conglomerado: si no tienes experiencia, quédate en el collado o en la ermita, que ya son un buen objetivo.'
		]
	},
	rutes: [
		{
			id: 'santa-cecilia',
			nom: {
				ca: "Des de Santa Cecília pel camí de l'Arrel i el coll de Sant Salvador",
				es: "Desde Santa Cecília por el camí de l'Arrel y el coll de Sant Salvador"
			},
			sortida: { nom: 'Monestir de Santa Cecília de Montserrat (Marganell)' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Segons l'itinerari que recull la Viquipèdia, es deixa el cotxe a Santa Cecília i se segueix el camí de l'Arrel fins al pla de la Trinitat. Passada l'ermita de la Trinitat, un trencall indicat cap a l'ermita de Sant Salvador puja per pendents forts i pedregosos fins al coll de Sant Salvador. Més enllà, un corriol discret, marcat amb una fita, surt a la dreta cap al cim: s'hi puja amb precaució per roca molt inclinada, amb alguna grimpada fàcil, i al final cal grimpar un pas estret entre dues parets. La font no dona distància, desnivell ni horari.",
				es: "Según el itinerario que recoge la Viquipèdia, se deja el coche en Santa Cecília y se sigue el camí de l'Arrel hasta el pla de la Trinitat. Pasada la ermita de la Trinitat, un desvío indicado hacia la ermita de Sant Salvador sube por pendientes fuertes y pedregosas hasta el coll de Sant Salvador. Más allá, un sendero discreto, marcado con un hito, sale a la derecha hacia la cima: se sube con precaución por roca muy inclinada, con alguna trepada fácil, y al final hay que trepar un paso estrecho entre dos paredes. La fuente no da distancia, desnivel ni horario."
			},
			fonts: [VIQUIPEDIA]
		},
		{
			id: 'monistrol-ermita',
			nom: {
				ca: "Aproximació des de Monistrol fins a l'ermita de Sant Salvador (no puja al cim)",
				es: 'Aproximación desde Monistrol hasta la ermita de Sant Salvador (no sube a la cima)'
			},
			sortida: { nom: "Estació d'FGC de Monistrol de Montserrat" },
			descripcio: {
				ca: "Travesía Pirenaica descriu una circular de 16,1 km i +977 m (5 h 30 min sense parades) que puja pel camí de l'Àngel, la canal del Pou del Gat i la canal Plana, passa per la base de l'Elefant i arriba a l'ermita de Sant Salvador a les 3 h 05 min, abans de baixar al monestir. La revista la valora de dificultat alta pel desnivell i pel terreny inestable i erosionat, i avisa que a la canal del Pou del Gat cal ajudar-se de les mans en algun tram. No inclou la grimpada al cim.",
				es: "Travesía Pirenaica describe una circular de 16,1 km y +977 m (5 h 30 min sin paradas) que sube por el camí de l'Àngel, la canal del Pou del Gat y la canal Plana, pasa por la base del Elefant y llega a la ermita de Sant Salvador a las 3 h 05 min, antes de bajar al monasterio. La revista la valora de dificultad alta por el desnivel y por el terreno inestable y erosionado, y avisa de que en la canal del Pou del Gat hay que ayudarse de las manos en algún tramo. No incluye la trepada a la cima."
			},
			fonts: [TRAVESIA_PIRENAICA]
		}
	],
	consells: {
		ca: [
			'El conglomerat mullat rellisca molt: amb pluja, rosada o boira, deixa la grimpada final per a un altre dia.',
			"Recorda que s'ha de baixar per on s'ha pujat: no t'enfilis a cap pas que no et vegis capaç de desgrimpar.",
			'El corriol del cim surt del camí de manera discreta i només el marca una fita: porta mapa de Montserrat a escala 1:25.000 o un track fiable.',
			"No confonguis la pujada a peu amb les vies d'escalada de la trompa, com la Boy-Roca, que demanen corda i material.",
			'Tota la zona és dins del Parc Natural de la Muntanya de Montserrat: abans de sortir, consulta la regulació vigent del Patronat de la Muntanya.'
		],
		es: [
			'El conglomerado mojado resbala mucho: con lluvia, rocío o niebla, deja la trepada final para otro día.',
			'Recuerda que hay que bajar por donde se ha subido: no te encarames a ningún paso que no te veas capaz de destrepar.',
			'El sendero de la cima sale del camino de forma discreta y solo lo marca un hito: lleva mapa de Montserrat a escala 1:25.000 o un track fiable.',
			'No confundas la subida a pie con las vías de escalada de la trompa, como la Boy-Roca, que piden cuerda y material.',
			'Toda la zona está dentro del Parque Natural de la Montaña de Montserrat: antes de salir, consulta la regulación vigente del Patronat de la Muntanya.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Cal grimpar per fer el cim de l'Elefant?",
				resposta:
					"Sí. La descripció que recull la Viquipèdia parla de pendents rocallosos molt inclinats amb alguna grimpada fàcil i d'un pas estret final entre dues parets de roca, curt i poc aeri. No hi ha cap camí que arribi a dalt caminant."
			},
			{
				pregunta: "Es pot pujar a l'Elefant amb nens o sense experiència?",
				resposta:
					"No ho recomanem. El tram final és de grimpada sobre conglomerat i s'ha de desfer de baixada. Sense experiència en aquest terreny, el coll de Sant Salvador i l'ermita són un final d'excursió més raonable."
			},
			{
				pregunta: "Quin és exactament el cim de l'Elefant?",
				resposta:
					"Segons la Viquipèdia, no és el cap de l'elefant que es veu des del monestir, sinó una roca que queda al darrere i separada, la més alta de la Tebaida."
			},
			{
				pregunta: "Què és l'ermita de Sant Salvador?",
				resposta:
					'Un antic eremitori arrecerat en una balma de la mateixa roca. Catalunya Romànica el documenta el 1217 i explica que es va reconstruir el 1817, després de la guerra del Francès.'
			}
		],
		es: [
			{
				pregunta: '¿Hay que trepar para hacer la cima del Elefant?',
				resposta:
					'Sí. La descripción que recoge la Viquipèdia habla de pendientes rocosas muy inclinadas con alguna trepada fácil y de un paso estrecho final entre dos paredes de roca, corto y poco aéreo. No hay ningún camino que llegue arriba andando.'
			},
			{
				pregunta: '¿Se puede subir al Elefant con niños o sin experiencia?',
				resposta:
					'No lo recomendamos. El tramo final es de trepada sobre conglomerado y hay que deshacerlo de bajada. Sin experiencia en este terreno, el coll de Sant Salvador y la ermita son un final de excursión más razonable.'
			},
			{
				pregunta: '¿Cuál es exactamente la cima del Elefant?',
				resposta:
					'Según la Viquipèdia, no es la cabeza del elefante que se ve desde el monasterio, sino una roca que queda detrás y separada, la más alta de la Tebaida.'
			},
			{
				pregunta: '¿Qué es la ermita de Sant Salvador?',
				resposta:
					'Un antiguo eremitorio resguardado en una balma de la misma roca. Catalunya Romànica lo documenta en 1217 y explica que se reconstruyó en 1817, tras la guerra de la Independencia.'
			}
		]
	},
	fonts: [VIQUIPEDIA, CATALUNYA_ROMANICA, TRAVESIA_PIRENAICA],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
