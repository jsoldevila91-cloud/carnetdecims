import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const WIKIPEDIA = {
	nom: 'Wikipedia: Muntanya de Santa Bàrbara',
	url: 'https://en.wikipedia.org/wiki/Muntanya_de_Santa_B%C3%A0rbara',
	consultat: CONSULTAT
};

const VIQUIPEDIA_HORTA = {
	nom: 'Viquipèdia: Horta de Sant Joan',
	url: 'https://ca.wikipedia.org/wiki/Horta_de_Sant_Joan',
	consultat: CONSULTAT
};

const TERRES_EBRE = {
	nom: "Terres de l'Ebre: Convent de Sant Salvador d'Horta",
	url: 'https://terresdelebre.travel/en/node/678',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Santa Bàrbara',
	url: 'https://reptesmuntanyencs.cat/santa-barbara/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'santa-barbara',
	descripcio: {
		ca: [
			"Santa Bàrbara és una muntanya càrstica d'Horta de Sant Joan, a [la Terra Alta](/comarques/terra-alta), als contraforts nord-occidentals dels Ports de Tortosa-Beseit. A la seva falda hi ha el convent de Sant Salvador d'Horta, també conegut com el Convent dels Àngels, i la ruta més senzilla al cim surt d'Horta de Sant Joan, segons la Wikipedia.",
			"El convent de Sant Salvador és a uns dos quilòmetres d'Horta de Sant Joan, segons la guia de les Terres de l'Ebre. L'església és de l'època dels templers, hi ha un claustre renaixentista i edificis dels segles XIII al XVII, i hi va viure una comunitat franciscana important. Aquesta mateixa font recorda que Pablo Picasso va immortalitzar la muntanya de Santa Bàrbara en pintures fetes durant la seva estada a Horta de Sant Joan; la Viquipèdia precisa que hi va viure els anys 1897–98 i hi va tornar el 1909.",
			"Reptes Muntanyencs hi puja des de Sant Salvador d'Horta en una circular curta, per un terreny pedregós senyalitzat amb fites que porta fins al cim de la muntanya. El bloc descriu una part del recorregut com a terreny mig atarterat, descompost i en fort pendent, i passa per la cova de Sant Salvador. També hi veu una pedra amb els fòssils de dues petxines."
		],
		es: [
			"Santa Bàrbara es una montaña kárstica de Horta de Sant Joan, en [la Terra Alta](/comarques/terra-alta), en los contrafuertes noroccidentales de los Ports de Tortosa-Beseit. A sus pies está el convento de Sant Salvador d'Horta, también conocido como el Convent dels Àngels, y la ruta más sencilla a la cima sale de Horta de Sant Joan, según la Wikipedia.",
			"El convento de Sant Salvador está a unos dos kilómetros de Horta de Sant Joan, según la guía de las Terres de l'Ebre. La iglesia es de la época de los templarios, hay un claustro renacentista y edificios de los siglos XIII al XVII, y vivió allí una comunidad franciscana importante. Esa misma fuente recuerda que Pablo Picasso inmortalizó la montaña de Santa Bàrbara en pinturas hechas durante su estancia en Horta de Sant Joan; la Viquipèdia precisa que vivió allí en 1897–98 y volvió en 1909.",
			"Reptes Muntanyencs sube desde Sant Salvador d'Horta en una circular corta, por un terreno pedregoso señalizado con hitos que lleva hasta la cima de la montaña. El blog describe una parte del recorrido como terreno medio pedregoso, descompuesto y de fuerte pendiente, y pasa por la cova de Sant Salvador. También ve una piedra con los fósiles de dos conchas."
		]
	},
	rutes: [
		{
			id: 'sant-salvador-d-horta',
			nom: {
				ca: "Circular des del convent de Sant Salvador d'Horta",
				es: "Circular desde el convento de Sant Salvador d'Horta"
			},
			sortida: { nom: "Convent de Sant Salvador d'Horta (Horta de Sant Joan)" },
			descripcio: {
				ca: "Reptes Muntanyencs documenta una circular que surt de Sant Salvador d'Horta, per senders: uns 3,4 km, uns 302 m de desnivell positiu i 2 h 1 min de marxa efectiva. Segons el seu track, el cim queda als 2,2 km de la sortida. L'itinerari no està senyalitzat; el tram cap al cim es guia amb fites, i el bloc anota un terreny mig atarterat, descompost i en fort pendent.",
				es: "Reptes Muntanyencs documenta una circular que sale de Sant Salvador d'Horta, por senderos: unos 3,4 km, unos 302 m de desnivel positivo y 2 h 1 min de marcha efectiva. Según su track, la cima queda a los 2,2 km de la salida. El itinerario no está señalizado; el tramo hacia la cima se guía con hitos, y el blog anota un terreno medio pedregoso, descompuesto y de fuerte pendiente."
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'El terreny és pedregós i, en una part, descompost i en fort pendent, segons el bloc: porta calçat de muntanya i pren la baixada amb calma.',
			"Segueix les fites del tram cap al cim; l'itinerari no està senyalitzat.",
			'Pots combinar la pujada amb una visita al convent de Sant Salvador, que és al peu de la muntanya.',
			"Telèfon d'emergències: 112."
		],
		es: [
			'El terreno es pedregoso y, en una parte, descompuesto y de fuerte pendiente, según el blog: lleva calzado de montaña y baja con calma.',
			'Sigue los hitos del tramo hacia la cima; el itinerario no está señalizado.',
			'Puedes combinar la subida con una visita al convento de Sant Salvador, que está al pie de la montaña.',
			'Teléfono de emergencias: 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Santa Bàrbara?',
				resposta:
					"Reptes Muntanyencs documenta una circular d'uns 3,4 km des de Sant Salvador d'Horta amb 2 h 1 min de marxa efectiva; segons el seu track, el cim queda als 2,2 km de la sortida."
			},
			{
				pregunta: 'Per on se sol pujar?',
				resposta:
					"Segons la Wikipedia, la ruta més senzilla és la de Horta de Sant Joan; el bloc surt del convent de Sant Salvador d'Horta."
			},
			{
				pregunta: 'Què té a veure amb Picasso?',
				resposta:
					"Segons la guia de les Terres de l'Ebre, Picasso va immortalitzar la muntanya de Santa Bàrbara en pintures fetes durant la seva estada a Horta de Sant Joan."
			},
			{
				pregunta: 'Santa Bàrbara compta com a cim essencial?',
				resposta:
					'Sí, és un dels [cims essencials](/cims-essencials) de la Terra Alta, amb les [Roques de Benet](/cims/roques-de-benet).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Santa Bàrbara?',
				resposta:
					"Reptes Muntanyencs documenta una circular de unos 3,4 km desde Sant Salvador d'Horta con 2 h 1 min de marcha efectiva; según su track, la cima queda a los 2,2 km de la salida."
			},
			{
				pregunta: '¿Por dónde se suele subir?',
				resposta:
					"Según la Wikipedia, la ruta más sencilla es la de Horta de Sant Joan; el blog sale del convento de Sant Salvador d'Horta."
			},
			{
				pregunta: '¿Qué tiene que ver con Picasso?',
				resposta:
					"Según la guía de las Terres de l'Ebre, Picasso inmortalizó la montaña de Santa Bàrbara en pinturas hechas durante su estancia en Horta de Sant Joan."
			},
			{
				pregunta: '¿Santa Bàrbara cuenta como cima esencial?',
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) de la Terra Alta, con las [Roques de Benet](/cims/roques-de-benet).'
			}
		]
	},
	fonts: [WIKIPEDIA, VIQUIPEDIA_HORTA, TERRES_EBRE, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
