import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const RUTES_PIRINEUS = {
	nom: "Rutes Pirineus: pics de Casamanya des del coll d'Ordino",
	url: 'https://www.rutespirineus.cat/rutes/pics-de-casamanya-ordino-andorra',
	consultat: CONSULTAT
};

const RUTAS_PIRINEOS = {
	nom: 'Rutas Pirineos: picos de Casamanya desde el collado de Ordino',
	url: 'https://www.rutaspirineos.org/rutas/pics-de-casamanya-ordino-andorra',
	consultat: CONSULTAT
};

const VISIT_ORDINO = {
	nom: 'VisitOrdino: Pic de Casamanya',
	url: 'https://www.visitordino.com/es/que-hacer/@@route_view/pic-de-casamanya',
	consultat: CONSULTAT
};

const WIKIPEDIA = {
	nom: 'Wikipedia: Casamanya',
	url: 'https://es.wikipedia.org/wiki/Casamanya',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'casamanya-nord',
	descripcio: {
		ca: [
			"El Casamanya és la muntanya que ocupa el centre geogràfic d'[Andorra](/comarques/andorra), a la carena que separa les parròquies d'Ordino i de Canillo. No és un cim únic sinó una cresta amb tres puntes: la sud, la del mig i la nord, que és la més alta i la que compta per al repte. Tot el massís és de roca calcària, de to blanquinós, cosa que el fa fàcil de reconèixer des de bona part del país.",
			"La seva posició el converteix en una divisòria d'aigües: a un costat hi ha la Valira del Nord, que baixa per la vall d'Ordino, i a l'altre la Valira d'Orient, que passa per Canillo. Per això, sense ser dels més alts del Principat, és un dels miradors més apreciats pels andorrans. El camí habitual surt del coll d'Ordino, el port de carretera que uneix les dues parròquies, i travessa el bosc d'Airola, de pi negre, abans de sortir a les pales herboses i pedregoses de la carena.",
			"Des de dalt es domina gairebé tot Andorra: la vall d'Ordino i la Massana, la vall de la Valira d'Orient i, en dies clars, el [Comapedrosa](/cims/comapedrosa), sostre del país, i els cims de la capçalera d'Ordino com la [Tristaina](/cims/tristaina). Cap a l'est s'alça el massís de la [Serrera](/cims/pic-de-la-serrera), un altre cim essencial andorrà.",
			"Sense neu, des de final de primavera fins a la tardor, és una pujada sense passos tècnics. A l'hivern la carena es cobreix de neu i la sortida es fa amb raquetes o esquís, en condicions que demanen experiència. A l'estiu el pendent és molt assolellat i a partir del coll no hi ha aigua: surt d'hora i vigila les tempestes de tarda."
		],
		es: [
			'El Casamanya es la montaña que ocupa el centro geográfico de [Andorra](/comarques/andorra), en la cresta que separa las parroquias de Ordino y Canillo. No es una cima única sino una cresta con tres puntas: la sur, la del medio y la norte, que es la más alta y la que cuenta para el reto. Todo el macizo es de roca caliza, de tono blanquecino, lo que lo hace fácil de reconocer desde buena parte del país.',
			"Su posición lo convierte en una divisoria de aguas: a un lado queda el Valira del Norte, que baja por el valle de Ordino, y al otro el Valira de Oriente, que pasa por Canillo. Por eso, sin ser de los más altos del Principado, es uno de los miradores favoritos de los andorranos. El camino habitual sale del coll d'Ordino, el puerto de carretera que une las dos parroquias, y cruza el bosque de Airola, de pino negro, antes de salir a las laderas herbosas y pedregosas de la cresta.",
			'Desde arriba se domina casi toda Andorra: el valle de Ordino y La Massana, el valle del Valira de Oriente y, en días claros, el [Comapedrosa](/cims/comapedrosa), techo del país, y las cimas de la cabecera de Ordino como la [Tristaina](/cims/tristaina). Hacia el este se alza el macizo de la [Serrera](/cims/pic-de-la-serrera), otra cima esencial andorrana.',
			'Sin nieve, desde finales de primavera hasta el otoño, es una subida sin pasos técnicos. En invierno la cresta se cubre de nieve y la salida se hace con raquetas o esquís, en condiciones que piden experiencia. En verano la ladera es muy soleada y a partir del collado no hay agua: sal temprano y vigila las tormentas de tarde.'
		]
	},
	rutes: [
		{
			id: 'coll-d-ordino',
			nom: {
				ca: "Des del coll d'Ordino per la carena sud",
				es: "Desde el coll d'Ordino por la cresta sur"
			},
			sortida: { nom: "Coll d'Ordino (1.974 m)" },
			tempsMinuts: 115,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "És la ruta normal. Del coll d'Ordino es puja per un camí ben fressat i marcat amb punts grocs fins a la collada de les Vaques i, després, per la llarga carena sud fins al Casamanya Sud, el primer dels tres cims. Segons Rutes Pirineus, s'hi arriba en 1 h 30 min i el Casamanya Nord queda 25 minuts més enllà, seguint la cresta sense entrar al vessant nord, més vertical. Sense passos de mans, el que costa és el pendent, fort, i l'últim tram, pedregós.",
				es: "Es la ruta normal. Desde el coll d'Ordino se sube por un camino muy marcado, con puntos amarillos, hasta la collada de les Vaques y, después, por la larga cresta sur hasta el Casamanya Sud, la primera de las tres cimas. Según Rutes Pirineus, se llega en 1 h 30 min y el Casamanya Nord queda 25 minutos más allá, siguiendo la cresta sin meterse en la vertiente norte, más vertical. Sin pasos de manos, lo que cuesta es la pendiente, fuerte, y el último tramo, pedregoso."
			},
			fonts: [RUTES_PIRINEUS, RUTAS_PIRINEOS, VISIT_ORDINO]
		}
	],
	consells: {
		ca: [
			"L'aparcament del coll d'Ordino és petit: arriba-hi d'hora els caps de setmana d'estiu. S'hi accedeix per la carretera CS-240, tant des d'Ordino com des de Canillo.",
			"Porta tota l'aigua de casa: segons VisitOrdino, a la ruta no n'hi ha.",
			'Si només vas fins al Casamanya Sud, recorda que el cim que compta per al repte és el Nord, el més alt dels tres.',
			'Entre els tres cims, mantén-te al camí que flanqueja pel vessant sud: el costat nord és vertical i rocós.',
			"A l'hivern la ruta canvia del tot: amb neu, consulta el butlletí de perill d'allaus del servei meteorològic d'Andorra i vés-hi només amb material i experiència."
		],
		es: [
			"El aparcamiento del coll d'Ordino es pequeño: llega temprano los fines de semana de verano. Se accede por la carretera CS-240, tanto desde Ordino como desde Canillo.",
			'Lleva toda el agua desde casa: según VisitOrdino, en la ruta no hay.',
			'Si solo vas hasta el Casamanya Sud, recuerda que la cima que cuenta para el reto es la Norte, la más alta de las tres.',
			'Entre las tres cimas, mantente en el sendero que flanquea por la vertiente sur: el lado norte es vertical y rocoso.',
			'En invierno la ruta cambia por completo: con nieve, consulta el boletín de peligro de aludes del servicio meteorológico de Andorra y ve solo con material y experiencia.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Casamanya?',
				resposta:
					"Segons Rutes Pirineus, des del coll d'Ordino s'arriba al Casamanya Sud en 1 h 30 min i al Casamanya Nord en 1 h 55 min, sense parades. Anada i tornada, unes 3 h 10 min de marxa efectiva."
			},
			{
				pregunta: 'El Casamanya és difícil?',
				resposta:
					"No té dificultat tècnica: és un camí ben marcat. El que costa és el desnivell, uns 760 m fins al cim sud segons VisitOrdino, concentrats en poca distància i amb un tram final pedregós. A l'alçada de 2.700 m, el temps pot canviar de pressa."
			},
			{
				pregunta: 'Quin dels tres pics del Casamanya compta per al repte?',
				resposta:
					"El Casamanya Nord, el més alt dels tres. És un dels cinc [cims essencials](/cims-essencials) d'Andorra, amb el Comapedrosa, la Serrera, el Pic Negre d'Envalira i la Tristaina. Si fas cim al Sud, no compta: has de seguir la cresta fins al Nord."
			},
			{
				pregunta: "Es pot pujar al Casamanya a l'hivern?",
				resposta:
					"Sí, però és una altra sortida: la carena queda nevada i cal anar amb raquetes o esquís, saber valorar el perill d'allaus i consultar el butlletí abans de sortir. Sense aquesta experiència, millor fer-lo de juny a octubre."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Casamanya?',
				resposta:
					"Según Rutes Pirineus, desde el coll d'Ordino se llega al Casamanya Sud en 1 h 30 min y al Casamanya Nord en 1 h 55 min, sin paradas. Ida y vuelta, unas 3 h 10 min de marcha efectiva."
			},
			{
				pregunta: '¿El Casamanya es difícil?',
				resposta:
					'No tiene dificultad técnica: es un camino bien marcado. Lo que cuesta es el desnivel, unos 760 m hasta la cima sur según VisitOrdino, concentrados en poca distancia y con un tramo final pedregoso. A 2.700 m, el tiempo puede cambiar rápido.'
			},
			{
				pregunta: '¿Cuál de los tres picos del Casamanya cuenta para el reto?',
				resposta:
					'El Casamanya Nord, el más alto de los tres. Es una de las cinco [cimas esenciales](/cims-essencials) de Andorra, con el Comapedrosa, la Serrera, el Pic Negre d’Envalira y la Tristaina. Si haces cima en el Sud, no cuenta: tienes que seguir la cresta hasta el Nord.'
			},
			{
				pregunta: '¿Se puede subir al Casamanya en invierno?',
				resposta:
					'Sí, pero es otra salida: la cresta está nevada y hay que ir con raquetas o esquís, saber valorar el peligro de aludes y consultar el boletín antes de salir. Sin esa experiencia, mejor hacerlo de junio a octubre.'
			}
		]
	},
	fonts: [WIKIPEDIA, RUTES_PIRINEUS, RUTAS_PIRINEOS, VISIT_ORDINO],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
