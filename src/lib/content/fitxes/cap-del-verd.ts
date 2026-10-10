import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA_SERRA = {
	nom: 'Viquipèdia: serra del Verd',
	url: 'https://ca.wikipedia.org/wiki/Serra_del_Verd',
	consultat: CONSULTAT
};

const CARLES_DANON = {
	nom: 'De punta a punta: Cap del Verd des de Gósol',
	url: 'https://carlesdanon.blogspot.com/2016/01/cap-del-verd-des-de-gosol.html',
	consultat: CONSULTAT
};

const CORBELLA_COMA = {
	nom: 'Fent camí: Cap del Verd pel Solsonès, per La Coma i la Pedra',
	url: 'https://jmcorbella.blogspot.com/2019/06/cap-del-verd-pel-solsones-per-la-coma-i.html',
	consultat: CONSULTAT
};

const RELLEUS = {
	nom: 'relleus.cat: ruta als tres cims de la serra del Verd',
	url: 'https://relleus.cat/tres-cims-serra-del-verd/',
	consultat: CONSULTAT
};

const MUNTANYA_I_NATURA = {
	nom: 'Muntanya i Natura: Cap del Verd des de Gósol',
	url: 'https://www.muntanyainatura.org/rutes/guiades/cap-del-verd-des-de-gosol',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'cap-del-verd',
	descripcio: {
		ca: [
			"El Cap del Verd és el punt més alt de la serra del Verd, una carena calcària del Prepirineu que s'alça al sud-oest de Gósol, com una continuació de la serra del Cadí. El cim queda just on es toquen tres comarques: el vessant sud pertany a la Coma i la Pedra, al Solsonès; el nord-oest, a Josa i Tuixén, a [l'Alt Urgell](/comarques/alt-urgell), i el nord-est, a Gósol, al Berguedà. És un dels cims que la llista dels essencials assigna a l'Alt Urgell, tot i que per al muntanyenc és sobretot un cim de frontera entre tres valls.",
			"La serra no té parets ni agulles com les de la veïna [Pedraforca](/cims/pedraforca-pollego-superior): és un massís de pendents herbosos i relleu càrstic suau, amb dolines a l'altiplà del Prat Navidal i pastures d'altura a banda i banda de la collada dels Belitres. Per això el Cap del Verd es pot pujar sense grimpar, però no és una passejada: els desnivells són llargs i el vessant solsonès arriba a tenir una tartera forta. A mig camí des de Gósol es passa per l'ermita de Santa Margarida, un bon punt de referència per orientar-se.",
			"Des del cim s'obre una panoràmica de 360 graus. Segons Muntanya i Natura, hi destaquen el Pedraforca, la serra del Cadí, la d'Ensija, el Port del Comte i la vall de Lord amb l'embassament de la Llosa del Cavall; en dies molt clars s'hi afegeixen el Montseny i Montserrat. A les pastures del Prat d'Aubes és fàcil veure isards.",
			"El millor moment va de finals de primavera a la tardor, quan els prats estan nets de neu. Com que alguns trams del camí són poc evidents, convé portar el track descarregat i no confiar només en les fites. A l'estiu, sortir d'hora et deixa marge davant les tempestes de tarda."
		],
		es: [
			'El Cap del Verd es el punto más alto de la serra del Verd, una cresta caliza del Prepirineo que se levanta al suroeste de Gósol, como continuación de la sierra del Cadí. La cima queda justo donde se tocan tres comarcas: la vertiente sur pertenece a la Coma i la Pedra, en el Solsonès; el noroeste, a Josa i Tuixén, en [el Alt Urgell](/comarques/alt-urgell), y el noreste, a Gósol, en el Berguedà. Es una de las cimas que la lista de esenciales asigna al Alt Urgell, aunque para el montañero es sobre todo una cima de frontera entre tres valles.',
			'La sierra no tiene paredes ni agujas como la vecina [Pedraforca](/cims/pedraforca-pollego-superior): es un macizo de pendientes herbosas y relieve kárstico suave, con dolinas en la altiplanicie del Prat Navidal y pastos de altura a ambos lados del collado dels Belitres. Por eso el Cap del Verd se sube sin trepar, pero no es un paseo: los desniveles son largos y la vertiente solsonense llega a tener una pedrera fuerte. A medio camino desde Gósol se pasa por la ermita de Santa Margarida, un buen punto de referencia para orientarse.',
			'Desde la cima se abre una panorámica de 360 grados. Según Muntanya i Natura, destacan el Pedraforca, la sierra del Cadí, la de Ensija, el Port del Comte y la vall de Lord con el embalse de la Llosa del Cavall; en días muy claros se suman el Montseny y Montserrat. En los pastos del Prat d’Aubes es fácil ver sarrios.',
			'El mejor momento va de finales de primavera al otoño, cuando los prados están limpios de nieve. Como algunos tramos del camino son poco evidentes, conviene llevar el track descargado y no fiarse solo de los hitos. En verano, salir temprano te deja margen ante las tormentas de tarde.'
		]
	},
	rutes: [
		{
			id: 'gosol',
			nom: {
				ca: "Des de Gósol per Santa Margarida i el portell de l'Ós",
				es: "Desde Gósol por Santa Margarida y el portell de l'Ós"
			},
			sortida: { nom: 'Gósol (Berguedà)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "És la pujada més directa i la que fan servir les sortides guiades. Del poble es puja per pistes i corriols de bosc fins a l'ermita de Santa Margarida, es remunta fins al coll de Mola i, per un camí que s'esvaeix, fins al portell de l'Ós. D'allà una pista suau porta a un coll de la carena i, per pastures, al cim. Segons les cròniques consultades no hi ha passos tècnics, però el camí final des de la collada dels Belitres és poc marcat i convé seguir el track.",
				es: 'Es la subida más directa y la que usan las salidas guiadas. Del pueblo se sube por pistas y sendas de bosque hasta la ermita de Santa Margarida, se remonta hasta el coll de Mola y, por un camino que se difumina, hasta el portell de l’Ós. Desde allí una pista suave lleva a un collado de la cresta y, por pastos, a la cima. Según las crónicas consultadas no hay pasos técnicos, pero el camino final desde la collada dels Belitres está poco marcado y conviene seguir el track.'
			},
			fonts: [CARLES_DANON, MUNTANYA_I_NATURA, RELLEUS]
		},
		{
			id: 'la-pedra',
			nom: {
				ca: 'Des de la Pedra (la Coma i la Pedra)',
				es: 'Desde la Pedra (la Coma i la Pedra)'
			},
			sortida: { nom: 'La Pedra (la Coma i la Pedra)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "La via del Solsonès surt de la Pedra, el nucli més petit del municipi, i segueix una pista fins a l'era del Dan i la font del Cinglà. Després passa per la collada del Prat Major i el coll de Veís, i enfila una tartera molt dreta marcada amb pintura groga, el tram més dur. Passada la tartera, la carena es puja sense dificultat. Es pot baixar per la collada dels Belitres i el collet del Prat de les Saleres, un descens més costerut del que sembla.",
				es: 'La vía del Solsonès sale de la Pedra, el núcleo más pequeño del municipio, y sigue una pista hasta la era del Dan y la fuente del Cinglà. Después pasa por la collada del Prat Major y el coll de Veís, y encara una pedrera muy empinada marcada con pintura amarilla, el tramo más duro. Pasada la pedrera, la cresta se sube sin dificultad. Se puede bajar por la collada dels Belitres y el collet del Prat de les Saleres, un descenso más empinado de lo que parece.'
			},
			fonts: [CORBELLA_COMA]
		}
	],
	consells: {
		ca: [
			"Muntanya i Natura destaca diverses fonts al recorregut des de Gósol, però no hi ha cap refugi ni punt d'avituallament: puja amb prou aigua i menjar per a tot el dia.",
			"Al coll de Mola s'arriba en cotxe per una pista forestal des de Gósol o Tuixén, segons relleus.cat: informa't de l'estat abans d'anar-hi i no hi vagis si està embarrada.",
			'Des de la collada dels Belitres fins al cim el camí és poc visible; amb boira, torna enrere i no improvisis.',
			'Si puges per la Coma i la Pedra, escull la tartera amb sol i sec: amb pluja o neu recent és relliscosa.',
			"La serra és un espai del PEIN amb ramats a les pastures: deixa tancades les tanques de bestiar que trobis (a la via de la Pedra n'hi ha diverses). La Viquipèdia cita la gran afluència de boletaires a la tardor i els abocaments com a pressions sobre l'espai: no hi deixis res."
		],
		es: [
			'Muntanya i Natura destaca varias fuentes en el recorrido desde Gósol, pero no hay refugio ni punto de avituallamiento: sube con agua y comida suficientes para todo el día.',
			'Al coll de Mola se llega en coche por una pista forestal desde Gósol o Tuixén, según relleus.cat: infórmate del estado antes de ir y no vayas si está embarrada.',
			'Desde la collada dels Belitres hasta la cima el camino se ve poco; con niebla, da la vuelta y no improvises.',
			'Si subes por la Coma i la Pedra, elige la pedrera con sol y en seco: con lluvia o nieve reciente resbala.',
			'La sierra es un espacio del PEIN con rebaños en los pastos: deja cerradas las vallas del ganado que encuentres (en la vía de la Pedra hay varias). La Viquipèdia cita la gran afluencia de buscadores de setas en otoño y los vertidos como presiones sobre el espacio: no dejes nada.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Des d'on és més fàcil pujar al Cap del Verd?",
				resposta:
					'Segons les cròniques, des de Gósol: el camí és més llarg però progressiu i sense tartera forta. Des de la Pedra, al Solsonès, el tram central és una tartera molt dreta. Cap de les dues vies té passos que demanin les mans, però totes dues són dies llargs.'
			},
			{
				pregunta: 'Quin recorregut fan les rutes que enllacen la serra?',
				resposta:
					"Relleus.cat proposa una circular d'uns 16 km i uns 1.570 m de desnivell des del coll de Mola que enllaça el Cap d'Urdet, la serra del Gall i el Cap del Verd, amb un temps de 4 h 34 min; el Cap del Verd és l'últim cim i hi arriba al km 11,8. És una jornada exigent per a qui busqui només el cim."
			},
			{
				pregunta: 'A quina comarca és el Cap del Verd?',
				resposta:
					"El punt més alt toca tres comarques: Solsonès, Berguedà i Alt Urgell. Al repte dels 100 Cims s'inclou entre els [cims de l'Alt Urgell](/comarques/alt-urgell), però la pujada habitual es fa des de Gósol (Berguedà) o la Coma i la Pedra (Solsonès)."
			},
			{
				pregunta: 'El Cap del Verd compta com a cim essencial?',
				resposta:
					"Sí. És el cinquè en altitud dels nou essencials de l'Alt Urgell, per sota del Pic de Salòria, del Monturull, del [Vulturó](/cims/vulturo) i del Pic d'Enclar (Bony de la Pica)."
			}
		],
		es: [
			{
				pregunta: '¿Desde dónde es más fácil subir al Cap del Verd?',
				resposta:
					'Según las crónicas, desde Gósol: el camino es más largo pero progresivo y sin pedrera fuerte. Desde la Pedra, en el Solsonès, el tramo central es una pedrera muy empinada. Ninguna de las dos vías tiene pasos que pidan las manos, pero ambas son días largos.'
			},
			{
				pregunta: '¿Qué recorrido hacen las rutas que enlazan la sierra?',
				resposta:
					'Relleus.cat propone una circular de unos 16 km y unos 1.570 m de desnivel desde el coll de Mola que enlaza el Cap d’Urdet, la serra del Gall y el Cap del Verd, con un tiempo de 4 h 34 min; el Cap del Verd es la última cima y llega a ella en el km 11,8. Es una jornada exigente para quien solo busque la cima.'
			},
			{
				pregunta: '¿En qué comarca está el Cap del Verd?',
				resposta:
					'El punto más alto toca tres comarcas: Solsonès, Berguedà y Alt Urgell. En el reto de los 100 Cims se incluye entre las [cimas del Alt Urgell](/comarques/alt-urgell), pero la subida habitual se hace desde Gósol (Berguedà) o la Coma i la Pedra (Solsonès).'
			},
			{
				pregunta: '¿El Cap del Verd cuenta como cima esencial?',
				resposta:
					'Sí. Es la quinta en altitud de las nueve esenciales del Alt Urgell, por debajo del Pic de Salòria, del Monturull, del [Vulturó](/cims/vulturo) y del Pic d’Enclar (Bony de la Pica).'
			}
		]
	},
	fonts: [VIQUIPEDIA_SERRA, CARLES_DANON, CORBELLA_COMA, RELLEUS, MUNTANYA_I_NATURA],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
