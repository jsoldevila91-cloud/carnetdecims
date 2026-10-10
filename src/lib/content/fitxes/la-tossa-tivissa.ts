import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: La Tossa (Tivissa)',
	url: 'https://ca.wikipedia.org/wiki/La_Tossa_(Tivissa)',
	consultat: CONSULTAT
};

const VIQUIPEDIA_MUNTANYES = {
	nom: 'Viquipèdia: Muntanyes de Tivissa-Vandellòs',
	url: 'https://ca.wikipedia.org/wiki/Muntanyes_de_Tivissa-Vandell%C3%B2s',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: La Tossa (Tivissa)',
	url: 'https://reptesmuntanyencs.cat/la-tossa/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'la-tossa-tivissa',
	descripcio: {
		ca: [
			"La Tossa és un cim de la serra de Tivissa, al terme de Tivissa, a [la Ribera d'Ebre](/comarques/ribera-d-ebre). Segons la Viquipèdia, és de dolomia, té un vèrtex geodèsic al cim i queda dins l'espai protegit de les Muntanyes de Tivissa-Vandellòs.",
			"Les Muntanyes de Tivissa-Vandellòs són, segons la Viquipèdia, un conjunt de serres de la Serralada Prelitoral amb dos sectors, el de Tivissa, més endins, i el de Vandellòs, a la costa, que sumen uns 25 km de llarg. Són muntanyes seques, esquerpes i gairebé despoblades, amb màquia als costers solans i alzinars a les obagues, on viu l'àguila daurada. El conjunt va entrar al PEIN el 1992. A prop hi ha dos cims essencials més: la [Mola de Genessies](/cims/mola-de-genessies) i el [Molló Puntaire](/cims/mollo-puntaire), el punt més alt d'aquestes muntanyes.",
			'Reptes Muntanyencs hi puja des del Mas de la Marca de Dalt, per una circular de pistes i senders que descriu com a «molt fressats i evidents». Prop del cim hi ha dues agulles singulars, el Gegant i la Geganta, i un panell fotogràfic amb informació dels cims dels voltants. El bloc destaca les vistes de Tivissa des del cim de la roca Verdura i les vistes àmplies en totes direccions.',
			"A l'estiu, segons el bloc, la calor endureix les condicions, perquè la vegetació escasseja i l'aigua també."
		],
		es: [
			"La Tossa es una cima de la serra de Tivissa, en el término de Tivissa, en [la Ribera d'Ebre](/comarques/ribera-d-ebre). Según la Viquipèdia, es de dolomía, tiene un vértice geodésico en la cima y queda dentro del espacio protegido de las Muntanyes de Tivissa-Vandellòs.",
			'Las Muntanyes de Tivissa-Vandellòs son, según la Viquipèdia, un conjunto de sierras de la Serralada Prelitoral con dos sectores, el de Tivissa, más al interior, y el de Vandellòs, en la costa, que suman unos 25 km de largo. Son montañas secas, escarpadas y casi despobladas, con maquia en las laderas solanas y encinares en las umbrías, donde vive el águila real. El conjunto entró en el PEIN en 1992. Cerca hay otras dos cimas esenciales: la [Mola de Genessies](/cims/mola-de-genessies) y el [Molló Puntaire](/cims/mollo-puntaire), el punto más alto de estas montañas.',
			'Reptes Muntanyencs sube desde el Mas de la Marca de Dalt, por una circular de pistas y senderos que describe como «muy trillados y evidentes». Cerca de la cima hay dos agujas singulares, el Gegant y la Geganta, y un panel fotográfico con información de las cimas de los alrededores. El blog destaca las vistas de Tivissa desde la cima de la roca Verdura y las vistas amplias en todas direcciones.',
			'En verano, según el blog, el calor endurece las condiciones, porque la vegetación escasea y el agua también.'
		]
	},
	rutes: [
		{
			id: 'mas-de-la-marca-de-dalt',
			nom: {
				ca: 'Circular des del Mas de la Marca de Dalt',
				es: 'Circular desde el Mas de la Marca de Dalt'
			},
			sortida: { nom: 'Mas de la Marca de Dalt (Tivissa)' },
			descripcio: {
				ca: "Reptes Muntanyencs documenta una circular que surt del Mas de la Marca de Dalt i va per pistes i senders: 7,1 km, uns 460 m de desnivell positiu i 2 h 7 min de marxa efectiva. Segons el seu track, el cim s'assoleix a 1 h 23 min i uns 3,5 km de la sortida. Hi ha pals de fusta, pintura de GR i PR i fites. Pel camí cal superar «un curt i fàcil grau» que porta a un planell a la vista del cim.",
				es: 'Reptes Muntanyencs documenta una circular que sale del Mas de la Marca de Dalt y va por pistas y senderos: 7,1 km, unos 460 m de desnivel positivo y 2 h 7 min de marcha efectiva. Según su track, la cima se alcanza a 1 h 23 min y unos 3,5 km de la salida. Hay postes de madera, pintura de GR y PR e hitos. Por el camino hay que superar «un corto y fácil escalón» que lleva a una explanada a la vista de la cima.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"El bloc avisa que a l'estiu la calor endureix les condicions, perquè la vegetació escasseja i també l'aigua.",
			'Hi ha un curt i fàcil grau abans del planell del cim: no tindràs gaire problema, però vigila amb la roca humida.',
			'El recorregut està senyalitzat amb pals de fusta, pintura de GR i PR i fites; revisa-ho als punts més conflictius.',
			"Porta tota l'aigua des de la sortida.",
			"Telèfon d'emergències: 112."
		],
		es: [
			'El blog avisa de que en verano el calor endurece las condiciones, porque la vegetación escasea y también el agua.',
			'Hay un corto y fácil escalón antes de la explanada de la cima: no tendrás mucho problema, pero vigila con la roca húmeda.',
			'El recorrido está señalizado con postes de madera, pintura de GR y PR e hitos; revísalo en los puntos más conflictivos.',
			'Lleva toda el agua desde la salida.',
			'Teléfono de emergencias: 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Tossa de Tivissa?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 7,1 km des del Mas de la Marca de Dalt amb 2 h 7 min de marxa efectiva; segons el seu track, el cim queda a 1 h 23 min de la sortida.'
			},
			{
				pregunta: 'És una ruta senyalitzada?',
				resposta:
					'Sí. El bloc diu que tot el trajecte és perfectament senyalitzat, amb pals de fusta, pintura de GR i PR i fites.'
			},
			{
				pregunta: 'Quines són les agulles que es veuen?',
				resposta:
					'El bloc esmenta dues agulles singulars, el Gegant i la Geganta, als peus de les quals passa el camí.'
			},
			{
				pregunta: 'La Tossa de Tivissa compta com a cim essencial?',
				resposta:
					"Sí, és un dels tres [cims essencials](/cims-essencials) de la Ribera d'Ebre, amb [la Picossa](/cims/la-picossa) i [Lo Tormo](/cims/lo-tormo)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Tossa de Tivissa?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 7,1 km desde el Mas de la Marca de Dalt con 2 h 7 min de marcha efectiva; según su track, la cima queda a 1 h 23 min de la salida.'
			},
			{
				pregunta: '¿Es una ruta señalizada?',
				resposta:
					'Sí. El blog dice que todo el trayecto está perfectamente señalizado, con postes de madera, pintura de GR y PR e hitos.'
			},
			{
				pregunta: '¿Qué son las agujas que se ven?',
				resposta:
					'El blog menciona dos agujas singulares, el Gegant y la Geganta, a cuyos pies pasa el camino.'
			},
			{
				pregunta: '¿La Tossa de Tivissa cuenta como cima esencial?',
				resposta:
					"Sí, es una de las tres [cimas esenciales](/cims-essencials) de la Ribera d'Ebre, con [la Picossa](/cims/la-picossa) y [Lo Tormo](/cims/lo-tormo)."
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_MUNTANYES, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
