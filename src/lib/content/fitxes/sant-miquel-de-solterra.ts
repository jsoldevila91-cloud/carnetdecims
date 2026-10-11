import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: Sant Miquel de Solterra, el sostre de les Guilleries",
	url: 'https://dexcursio.net/sant-miquel-de-solterra/',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: Sant Miquel de Solterra o de les Formigues',
	url: 'https://totnens.cat/que-fem/sant-miquel-de-solterra-o-de-les-formigues/',
	consultat: CONSULTAT
};

const SANTHILARI = {
	nom: 'Ajuntament de Sant Hilari Sacalm: ruta guiada a Sant Miquel de les Formigues',
	url: 'https://www.santhilari.cat/agenda/ruta-guiada-a-sant-miquel-de-les-formigues/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'sant-miquel-de-solterra',
	descripcio: {
		ca: [
			"Sant Miquel de Solterra, també conegut com Sant Miquel de les Formigues, és el cim més alt de les Guilleries. Queda entre Sant Hilari Sacalm i Osor, a la [Selva](/comarques/selva), tot envoltat de bosc. L'Ajuntament de Sant Hilari hi organitza sortides guiades. A la mateixa comarca hi ha [les Agudes](/cims/les-agudes), al Montseny, i [el Turó de Montsoriu](/cims/turo-de-montsoriu).",
			"El nom popular ve d'una llegenda que recull Totnens. La muntanya era plena de formigues, que entraven fins i tot a l'església; un dia van enfilar-se per l'espasa de la imatge de sant Miquel i una li va pessigar la cama. En sortir-ne una gota de sang, l'arcàngel va cobrar vida i les va maleir, a elles i a totes les que hi pugessin després. Per això la creu de ferro del cim porta formigues: tres, segons D'excursió per Catalunya, plantades damunt la torre circular que queda del castell de Solterra. Al costat hi ha la capella de Sant Miquel i un vèrtex geodèsic.",
			"La pujada és un passeig de bosc: castanyers, roures i faigs a la pista, i una fageda espessa al sender final. Des de dalt, D'excursió per Catalunya hi descriu el Montseny, els Pirineus i la plana de la Selva, i Totnens hi afegeix el Cadí i el Collsacabra.",
			"La sortida és curta i es pot fer en qualsevol època de l'any. Amb el terra moll, val més voltar el penyal del cim pel sender que no pas grimpar-hi."
		],
		es: [
			'Sant Miquel de Solterra, también conocido como Sant Miquel de les Formigues, es la cima más alta de las Guilleries. Queda entre Sant Hilari Sacalm y Osor, en la [Selva](/comarques/selva), rodeada de bosque. El Ayuntamiento de Sant Hilari organiza salidas guiadas. En la misma comarca están [les Agudes](/cims/les-agudes), en el Montseny, y [el Turó de Montsoriu](/cims/turo-de-montsoriu).',
			"El nombre popular viene de una leyenda que recoge Totnens. La montaña estaba llena de hormigas, que entraban incluso en la iglesia; un día treparon por la espada de la imagen de san Miguel y una le pellizcó la pierna. Al salir una gota de sangre, el arcángel cobró vida y las maldijo, a ellas y a todas las que subieran después. Por eso la cruz de hierro de la cima lleva hormigas: tres, según D'excursió per Catalunya, plantadas sobre la torre circular que queda del castillo de Solterra. Al lado están la capilla de Sant Miquel y un vértice geodésico.",
			"La subida es un paseo de bosque: castaños, robles y hayas en la pista, y un hayedo espeso en el sendero final. Desde arriba, D'excursió per Catalunya describe el Montseny, los Pirineos y la llanura de la Selva, y Totnens añade el Cadí y el Collsacabra.",
			'La salida es corta y se puede hacer en cualquier época del año. Con el suelo mojado, es mejor rodear el peñasco de la cima por el sendero que trepar por él.'
		]
	},
	rutes: [
		{
			id: 'abeuradors',
			nom: {
				ca: 'Des de la font dels Abeuradors',
				es: 'Desde la font dels Abeuradors'
			},
			sortida: { nom: 'Font dels Abeuradors (Sant Hilari Sacalm)' },
			distanciaKm: 4,
			tecnicitat: 'cap',
			descripcio: {
				ca: "És una ruta lineal de 4 km fins al cim: 8 km entre anada i tornada segons D'excursió per Catalunya, que hi compta +265 m i 2 h 30 min en total i la valora de fàcil. Els tres primers quilòmetres van per una pista ampla que puja suaument, amb un tram compartit amb el GR 83, fins a la font Sa Guarda. Allà un senyal indica el sender, més dret i estret, que s'enfila per la fageda amb pals i marques blaves. Al peu del penyal del cim es pot triar: una grimpada curta fins a la creu o un camí planer que el volta per l'esquerra i arriba a dalt sense posar les mans.",
				es: "Es una ruta lineal de 4 km hasta la cima: 8 km entre ida y vuelta según D'excursió per Catalunya, que cuenta +265 m y 2 h 30 min en total y la valora de fácil. Los tres primeros kilómetros van por una pista ancha que sube suavemente, con un tramo compartido con el GR 83, hasta la font Sa Guarda. Allí una señal indica el sendero, más empinado y estrecho, que sube por el hayedo con postes y marcas azules. Al pie del peñasco de la cima se puede elegir: una trepada corta hasta la cruz o un camino llano que lo rodea por la izquierda y llega arriba sin poner las manos."
			},
			fonts: [DEXCURSIO, TOTNENS, SANTHILARI]
		}
	],
	consells: {
		ca: [
			"A la font dels Abeuradors s'hi arriba en cotxe per uns 7 km de pista des de Sant Hilari, segons Totnens, i hi ha poc lloc per aparcar: val la pena matinar.",
			"No comptis amb la font per omplir: D'excursió per Catalunya avisa que acostuma a rajar molt poc.",
			"L'últim quilòmetre, pel sender de la fageda, no es pot fer amb cotxet; fins a la font Sa Guarda, la pista és ampla i compacta.",
			'Al sender final el camí es desdibuixa en algun punt: Totnens diu que cal arribar fins a una marca blava en un tronc i girar en rodó per encarar el cim.',
			"L'Ajuntament de Sant Hilari programa rutes guiades al cim, amb inscripció prèvia a l'Oficina de Turisme."
		],
		es: [
			'A la font dels Abeuradors se llega en coche por unos 7 km de pista desde Sant Hilari, según Totnens, y hay poco sitio para aparcar: vale la pena madrugar.',
			"No cuentes con la fuente para llenar: D'excursió per Catalunya avisa de que suele manar muy poco.",
			'El último kilómetro, por el sendero del hayedo, no se puede hacer con cochecito; hasta la font Sa Guarda, la pista es ancha y compacta.',
			'En el sendero final el camino se desdibuja en algún punto: Totnens dice que hay que llegar hasta una marca azul en un tronco y dar media vuelta para encarar la cima.',
			'El Ayuntamiento de Sant Hilari programa rutas guiadas a la cima, con inscripción previa en la Oficina de Turismo.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Sant Miquel de Solterra?',
				resposta:
					"D'excursió per Catalunya compta 2 h 30 min entre anada i tornada des de la font dels Abeuradors, per a 8 km i +265 m. L'Ajuntament de Sant Hilari Sacalm també parla d'una ruta lineal de 8 km en total."
			},
			{
				pregunta: 'Es pot pujar a Sant Miquel de les Formigues amb nens?',
				resposta:
					"Sí: Totnens la proposa com a sortida familiar i D'excursió per Catalunya la veu adequada per a tots els públics. Només el darrer quilòmetre, pel sender, té una mica més de pendent, i no és apte per a cotxets."
			},
			{
				pregunta: 'Cal grimpar per arribar a la creu?',
				resposta:
					'No és obligatori. Al peu del penyal hi ha una grimpada curta i, com a alternativa, un camí més planer que el volta i porta igualment al cim.'
			},
			{
				pregunta: 'Per què es diu Sant Miquel de les Formigues?',
				resposta:
					'Per la llegenda de les formigues que van pessigar la imatge de sant Miquel i van ser maleïdes. La creu de ferro del cim, amb formigues de ferro al peu, la recorda.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Sant Miquel de Solterra?',
				resposta:
					"D'excursió per Catalunya cuenta 2 h 30 min entre ida y vuelta desde la font dels Abeuradors, para 8 km y +265 m. El Ayuntamiento de Sant Hilari Sacalm también habla de una ruta lineal de 8 km en total."
			},
			{
				pregunta: '¿Se puede subir a Sant Miquel de les Formigues con niños?',
				resposta:
					"Sí: Totnens la propone como salida familiar y D'excursió per Catalunya la ve adecuada para todos los públicos. Solo el último kilómetro, por el sendero, tiene algo más de pendiente, y no es apto para cochecitos."
			},
			{
				pregunta: '¿Hay que trepar para llegar a la cruz?',
				resposta:
					'No es obligatorio. Al pie del peñasco hay una trepada corta y, como alternativa, un camino más llano que lo rodea y lleva igualmente a la cima.'
			},
			{
				pregunta: '¿Por qué se llama Sant Miquel de les Formigues?',
				resposta:
					'Por la leyenda de las hormigas que pellizcaron la imagen de san Miguel y fueron maldecidas. La cruz de hierro de la cima, con hormigas de hierro al pie, la recuerda.'
			}
		]
	},
	fonts: [DEXCURSIO, TOTNENS, SANTHILARI],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
