import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puig de la Cabrafiga',
	url: 'https://ca.wikipedia.org/wiki/Puig_de_la_Cabrafiga',
	consultat: CONSULTAT
};

const VIQUIPEDIA_PRATDIP = {
	nom: 'Viquipèdia: Pratdip',
	url: 'https://ca.wikipedia.org/wiki/Pratdip',
	consultat: CONSULTAT
};

const VIQUIPEDIA_LLABERIA = {
	nom: 'Viquipèdia: Serra de Llaberia',
	url: 'https://ca.wikipedia.org/wiki/Serra_de_Llaberia',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Puig de la Cabrafiga',
	url: 'https://reptesmuntanyencs.cat/puig-de-la-cabrafiga/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-de-la-cabrafiga',
	descripcio: {
		ca: [
			"El Puig de la Cabrafiga és el contrafort meridional de la serra de Llaberia, al terme de Pratdip, [al Baix Camp](/comarques/baix-camp). La Viquipèdia el descriu com una muntanya triangular i aïllada, ben visible a l'horitzó des de gairebé tota la part costanera de la comarca, de calcària i dolomia. El puig s'alça a l'est de Pratdip, un poble que, segons la mateixa enciclopèdia, té un terme «molt trencat i esquerp», al vessant sud-oriental de la serra de Llaberia.",
			"La muntanya té una història d'aprofitament humà. A prop del coll dels Meners, la Viquipèdia anota les restes d'un establiment ibèric que més tard va esdevenir una fortificació contra la pirateria, el castellet de les Mugues, i hi esmenta antigues mines. Reptes Muntanyencs hi afegeix que dues boques al coll dels Meners se suposa que són d'antigues mines de ferro i que es poden visitar a la baixada.",
			'Llaberia és la serra del costat: entre les Muntanyes de Prades i les de Tivissa-Vandellòs, protegida des del Decret 328/1992 i amb els vessants meridionals afectats per incendis forestals, segons la Viquipèdia. El [Cavall Bernat de Llaberia](/cims/cavall-bernat-de-llaberia) i la [Mola de Colldejou](/cims/mola-de-colldejou) són els altres cims del repte a la mateixa zona.',
			'El bloc descriu un recorregut ben pintat, amb una tartera força vertical i un curt grau on caldrà fer servir les mans. Les vistes, escriu, són molt bones si el dia acompanya, com a gairebé tots els cims del repte.'
		],
		es: [
			'El Puig de la Cabrafiga es el contrafuerte meridional de la sierra de Llaberia, en el término de Pratdip, [en el Baix Camp](/comarques/baix-camp). La Viquipèdia lo describe como una montaña triangular y aislada, bien visible en el horizonte desde casi toda la parte costera de la comarca, de caliza y dolomía. El puig se alza al este de Pratdip, un pueblo que, según la misma enciclopedia, tiene un término «muy quebrado y escarpado», en la vertiente sudoriental de la sierra de Llaberia.',
			'La montaña tiene una historia de aprovechamiento humano. Cerca del coll dels Meners, la Viquipèdia anota los restos de un asentamiento ibérico que más tarde se convirtió en una fortificación contra la piratería, el castellet de les Mugues, y menciona antiguas minas. Reptes Muntanyencs añade que dos bocas en el coll dels Meners se supone que son de antiguas minas de hierro y que se pueden visitar en la bajada.',
			'Llaberia es la sierra de al lado: entre las Muntanyes de Prades y las de Tivissa-Vandellòs, protegida desde el Decreto 328/1992 y con las laderas meridionales afectadas por incendios forestales, según la Viquipèdia. El [Cavall Bernat de Llaberia](/cims/cavall-bernat-de-llaberia) y la [Mola de Colldejou](/cims/mola-de-colldejou) son las otras cimas del reto en la misma zona.',
			'El blog describe un recorrido bien pintado, con una pedrera bastante vertical y un corto escalón donde habrá que usar las manos. Las vistas, escribe, son muy buenas si el día acompaña, como en casi todas las cimas del reto.'
		]
	},
	rutes: [
		{
			id: 'pratdip-t31',
			nom: {
				ca: 'Circular per la cova del Xirico i el coll dels Meners',
				es: 'Circular por la cova del Xirico y el coll dels Meners'
			},
			sortida: { nom: 'Aparcament al km 21,2 de la T-31 (Pratdip)' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Reptes Muntanyencs documenta una circular que surt d'un aparcament al km 21,2 de la T-31 i fa 9,2 km, uns 632 m de desnivell positiu i 2 h 39 min de marxa efectiva; segons el seu track, el cim queda als 4,4 km de la sortida. Passa per la cova del Xirico, el coll de la Cabrafiga i la pista d'accés a Can Xixa, i a la baixada pel coll de la Fita de la Partió, el coll dels Meners, el castellet de les Mugues i el mas abandonat de la Cabrafiga. Hi ha una tartera «força vertical» i, segons el bloc, «un curt grau, no més de dos metres, en el qual caldrà fer servir les mans». Tot el recorregut està ben pintat; el bloc suggereix que el sentit horari costa menys.",
				es: 'Reptes Muntanyencs documenta una circular que sale de un aparcamiento en el km 21,2 de la T-31 y tiene 9,2 km, unos 632 m de desnivel positivo y 2 h 39 min de marcha efectiva; según su track, la cima queda a los 4,4 km de la salida. Pasa por la cova del Xirico, el coll de la Cabrafiga y la pista de acceso a Can Xixa, y en la bajada por el coll de la Fita de la Partió, el coll dels Meners, el castellet de les Mugues y el mas abandonado de la Cabrafiga. Hay una pedrera «bastante vertical» y, según el blog, «un corto escalón, no más de dos metros, en el que habrá que usar las manos». Todo el recorrido está bien pintado; el blog sugiere que el sentido horario cuesta menos.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'Hi ha un curt grau de menys de dos metres on cal fer servir les mans i una tartera força vertical: porta calçat de muntanya i evita-ho amb la roca molla.',
			"Al coll dels Meners es poden visitar dues boques d'antigues mines de ferro, segons el bloc; no hi entris, i mantén-te a distància de les boques.",
			'El bloc recomana pantalons llargs i calçat resistent, perquè els senders són estrets.',
			'Les marques són de pintura blava; el bloc diu que va perdre les marques en alguns llocs però les va retrobar de seguida.',
			"Porta tota l'aigua des de la sortida: el bloc només esmenta la font de la Cabrafiga com a punt d'aigua."
		],
		es: [
			'Hay un corto escalón de menos de dos metros donde hay que usar las manos y una pedrera bastante vertical: lleva calzado de montaña y evítalo con la roca mojada.',
			'En el coll dels Meners se pueden visitar dos bocas de antiguas minas de hierro, según el blog; no entres, y mantente a distancia de las bocas.',
			'El blog recomienda pantalones largos y calzado resistente, porque los senderos son estrechos.',
			'Las marcas son de pintura azul; el blog dice que perdió las marcas en algunos sitios pero las reencontró enseguida.',
			'Lleva toda el agua desde la salida: el blog solo menciona la fuente de la Cabrafiga como punto de agua.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puig de la Cabrafiga?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 9,2 km amb 2 h 39 min de marxa efectiva; segons el seu track, el cim queda als 4,4 km de la sortida.'
			},
			{
				pregunta: 'Cal posar les mans?',
				resposta:
					'Sí, en un curt grau de no més de dos metres, segons el bloc. També hi ha una tartera força vertical.'
			},
			{
				pregunta: 'Està senyalitzat?',
				resposta:
					'El bloc diu que tot el recorregut és perfectament pintat, tot i que en alguns llocs va perdre les marques i les va retrobar de seguida.'
			},
			{
				pregunta: 'El Puig de la Cabrafiga compta com a cim essencial?',
				resposta:
					'Sí, és un dels sis [cims essencials](/cims-essencials) del Baix Camp, amb el Cavall Bernat i la Mola de Colldejou.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puig de la Cabrafiga?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 9,2 km con 2 h 39 min de marcha efectiva; según su track, la cima queda a los 4,4 km de la salida.'
			},
			{
				pregunta: '¿Hay que poner las manos?',
				resposta:
					'Sí, en un corto escalón de no más de dos metros, según el blog. También hay una pedrera bastante vertical.'
			},
			{
				pregunta: '¿Está señalizado?',
				resposta:
					'El blog dice que todo el recorrido está perfectamente pintado, aunque en algunos sitios perdió las marcas y las encontró enseguida.'
			},
			{
				pregunta: '¿El Puig de la Cabrafiga cuenta como cima esencial?',
				resposta:
					'Sí, es una de las seis [cimas esenciales](/cims-essencials) del Baix Camp, con el Cavall Bernat y la Mola de Colldejou.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_PRATDIP, VIQUIPEDIA_LLABERIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
