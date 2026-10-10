import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Mola de Colldejou',
	url: 'https://ca.wikipedia.org/wiki/Mola_de_Colldejou',
	consultat: CONSULTAT
};

const VIQUIPEDIA_CASTELL = {
	nom: 'Viquipèdia: Castell de la Mola (Colldejou)',
	url: 'https://ca.wikipedia.org/wiki/Castell_de_la_Mola_(Colldejou)',
	consultat: CONSULTAT
};

const AJUNTAMENT = {
	nom: 'Ajuntament de Colldejou: rutes de dificultat mitjana-baixa (ruta 8, la Mola pel GR 7)',
	url: 'https://www.colldejou.cat/dificultat-mitjana-baixa/',
	consultat: CONSULTAT
};

const DIARI_TARRAGONA = {
	nom: 'Diari de Tarragona: Mola de Colldejou, a la conquista del cielo del Baix Camp',
	url: 'https://www.diaridetarragona.com/cultura/ocio/mola-de-colldejou-a-la-conquista-del-cielo-del-baix-camp-BG14124566',
	consultat: CONSULTAT
};

const CAMINO = {
	nom: 'Camino con Santiago: ruta a la Mola de Colldejou',
	url: 'https://caminoconsantiago.com/ruta/excursion-mola-colldejou/',
	consultat: CONSULTAT
};

const ENGARRISTA = {
	nom: 'En Garrista: Mola de Colldejou per la canaleta del Bondia',
	url: 'https://www.engarrista.com/node/1318',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'mola-de-colldejou',
	descripcio: {
		ca: [
			"La Mola de Colldejou és una de les siluetes més fàcils de reconèixer del Camp de Tarragona: un gran altiplà de més d'un quilòmetre de llarg envoltat de cingles, que s'alça sobre el poble de Colldejou, [al Baix Camp](/comarques/baix-camp). Forma part de la Serralada Prelitoral, al nord de la serra de Llaberia, i és dins de l'espai protegit de la Serra de Llaberia. Des de la costa es reconeix per la silueta plana, com una taula posada damunt de les serres.",
			"Al punt més alt hi ha les restes del Castell de la Mola, una torre circular de pedra seca construïda durant la tercera guerra carlina per fer de telègraf òptic, com la torre de l'Esquirol de Cambrils: amb un sistema de taulers, s'hi enviaven senyals visibles a quilòmetres. Avui està declarada bé cultural d'interès nacional. Segons la Viquipèdia, el lloc podria haver acollit un poblat ibèric, i la tradició diu que el bandoler Carrasclet s'hi va amagar al segle XVIII. El Diari de Tarragona recorda també que el 1939 s'hi va estavellar a prop un avió alemany de transport.",
			"L'altiplà és un mirador de primer ordre. Es veuen la Costa Daurada i la plana del Camp, les muntanyes de Prades, la serra de Montsant amb [la Roca Corbatera](/cims/roca-corbatera) i, molt a prop, les crestes de la serra de Llaberia, on s'alça [el Cavall Bernat de Llaberia](/cims/cavall-bernat-de-llaberia), també essencial.",
			"La millor època és de la tardor a la primavera. A l'estiu el camí és molt exposat al sol i la pujada final, per la canal, es fa feixuga amb calor. Després de pluja, la roca de la part alta rellisca."
		],
		es: [
			'La Mola de Colldejou es una de las siluetas más fáciles de reconocer del Camp de Tarragona: un gran altiplano de más de un kilómetro de largo rodeado de riscos, que se alza sobre el pueblo de Colldejou, [en el Baix Camp](/comarques/baix-camp). Forma parte de la Cordillera Prelitoral, al norte de la sierra de Llaberia, y está dentro del espacio protegido de la Serra de Llaberia. Desde la costa se reconoce por su silueta plana, como una mesa puesta sobre las sierras.',
			"En el punto más alto están los restos del Castell de la Mola, una torre circular de piedra seca construida durante la tercera guerra carlista como telégrafo óptico, como la torre de l'Esquirol de Cambrils: con un sistema de tableros se enviaban señales visibles a kilómetros. Hoy está declarada bien cultural de interés nacional. Según la Viquipèdia, el lugar podría haber albergado un poblado ibérico, y la tradición dice que el bandolero Carrasclet se escondió allí en el siglo XVIII. El Diari de Tarragona recuerda también que en 1939 se estrelló cerca un avión alemán de transporte.",
			'El altiplano es un mirador de primer orden. Se ven la Costa Daurada y la llanura del Camp, las montañas de Prades, la sierra de Montsant con [la Roca Corbatera](/cims/roca-corbatera) y, muy cerca, las crestas de la sierra de Llaberia, donde se alza [el Cavall Bernat de Llaberia](/cims/cavall-bernat-de-llaberia), también esencial.',
			'La mejor época va del otoño a la primavera. En verano el camino está muy expuesto al sol y la subida final, por la canal, se hace pesada con calor. Después de llover, la roca de la parte alta resbala.'
		]
	},
	rutes: [
		{
			id: 'colldejou-gr7',
			nom: {
				ca: 'Circular des de Colldejou pel GR 7 i la Canal de la Cova',
				es: 'Circular desde Colldejou por el GR 7 y la Canal de la Cova'
			},
			sortida: { nom: 'Colldejou (aparcament del poble)' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "És la ruta clàssica que proposa l'Ajuntament: es puja pel GR 7 cap al Coll Roig, passant per la Font Freda i la Font Seca, es pren el GR 7.3 i s'entra a la Canal de la Cova fins a l'altiplà; la baixada es fa pel Coll del Guix. La canal és el tram més dur, amb molt pendent i roca relliscosa; segons el Diari de Tarragona, no és escalada, però agafar-se als blocs ajuda a avançar. Les ressenyes donen a la circular uns 8,5 km i entre 500 i 560 m de desnivell.",
				es: 'Es la ruta clásica que propone el Ayuntamiento: se sube por el GR 7 hacia el Coll Roig, pasando por la Font Freda y la Font Seca, se toma el GR 7.3 y se entra en la Canal de la Cova hasta el altiplano; la bajada se hace por el Coll del Guix. La canal es el tramo más duro, con mucha pendiente y roca resbaladiza; según el Diari de Tarragona, no es escalada, pero agarrarse a los bloques ayuda a avanzar. Las reseñas dan a la circular unos 8,5 km y entre 500 y 560 m de desnivel.'
			},
			fonts: [AJUNTAMENT, DIARI_TARRAGONA, CAMINO]
		},
		{
			id: 'colldejou-coll-del-guix',
			nom: {
				ca: 'Pujada i baixada pel Coll del Guix',
				es: 'Subida y bajada por el Coll del Guix'
			},
			sortida: { nom: 'Colldejou (plaça de l’Església)' },
			descripcio: {
				ca: "Qui prefereixi evitar la canal pot fer el sentit contrari de la circular i pujar pel Coll del Guix, per la pista de Colldejou a Llaberia i després un corriol marcat com a GR 7.3 que arriba a l'altiplà per la bassa de la Mola. Camino con Santiago adverteix que fer la circular al revés, baixant per la canal, és tècnicament més delicat.",
				es: 'Quien prefiera evitar la canal puede hacer el sentido contrario de la circular y subir por el Coll del Guix, por la pista de Colldejou a Llaberia y luego una senda marcada como GR 7.3 que llega al altiplano por la balsa de la Mola. Camino con Santiago advierte que hacer la circular al revés, bajando por la canal, es técnicamente más delicado.'
			},
			fonts: [CAMINO, AJUNTAMENT]
		}
	],
	consells: {
		ca: [
			"Aparca a l'entrada alta del poble i segueix les marques blanques i vermelles del GR 7 fins al desviament del GR 7.3.",
			'Els bastons ajuden a la pujada per la canal i, sobretot, a la baixada: el darrer tram de roca rellisca.',
			"No hi ha aigua segura a dalt de la Mola: omple les ampolles abans de sortir. La bassa de l'altiplà no és per beure.",
			"A l'estiu, surt molt d'hora: la pujada és solana i no hi ha ombra un cop deixes el bosc.",
			"L'altiplà s'acaba en cingles verticals: no t'apropis a les vores, sobretot amb vent o amb canalla."
		],
		es: [
			'Aparca en la entrada alta del pueblo y sigue las marcas blancas y rojas del GR 7 hasta el desvío del GR 7.3.',
			'Los bastones ayudan en la subida por la canal y, sobre todo, en la bajada: el último tramo de roca resbala.',
			'No hay agua segura arriba de la Mola: llena las botellas antes de salir. La balsa del altiplano no es para beber.',
			'En verano, sal muy temprano: la subida es solana y no hay sombra una vez dejas el bosque.',
			'El altiplano termina en riscos verticales: no te acerques a los bordes, sobre todo con viento o con niños.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Mola de Colldejou?',
				resposta:
					"La circular clàssica des del poble fa uns 8,5 km i entre 500 i 560 m de desnivell segons les ressenyes. Compta amb mig dia: la pujada per la canal és curta però dreta, i dalt de l'altiplà val la pena caminar fins al castell i les vores."
			},
			{
				pregunta: 'Cal grimpar per pujar a la Mola de Colldejou?',
				resposta:
					'Per la Canal de la Cova hi ha trams drets i rocosos on és útil agafar-se als blocs, sense ser escalada. Si no t’hi sents còmode, puja pel Coll del Guix, que és més suau.'
			},
			{
				pregunta: 'Què és la torre que hi ha dalt de la Mola?',
				resposta:
					"És el Castell de la Mola, una torre de pedra seca de la tercera guerra carlina que feia de telègraf òptic. Està protegida com a bé cultural d'interès nacional."
			},
			{
				pregunta: 'La Mola de Colldejou és un cim essencial?',
				resposta:
					'Sí. És un dels sis [cims essencials](/cims-essencials) del Baix Camp, amb el [Tossal de la Baltasana](/cims/tossal-de-la-baltasana), sostre de les muntanyes de Prades, o el Cavall Bernat, a la serra de Llaberia, just al sud de la Mola.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Mola de Colldejou?',
				resposta:
					'La circular clásica desde el pueblo tiene unos 8,5 km y entre 500 y 560 m de desnivel según las reseñas. Cuenta con media jornada: la subida por la canal es corta pero empinada, y arriba del altiplano vale la pena caminar hasta el castillo y los bordes.'
			},
			{
				pregunta: '¿Hay que trepar para subir a la Mola de Colldejou?',
				resposta:
					'Por la Canal de la Cova hay tramos empinados y rocosos donde es útil agarrarse a los bloques, sin ser escalada. Si no te sientes cómodo, sube por el Coll del Guix, que es más suave.'
			},
			{
				pregunta: '¿Qué es la torre que hay arriba de la Mola?',
				resposta:
					'Es el Castell de la Mola, una torre de piedra seca de la tercera guerra carlista que hacía de telégrafo óptico. Está protegida como bien cultural de interés nacional.'
			},
			{
				pregunta: '¿La Mola de Colldejou es una cima esencial?',
				resposta:
					'Sí. Es una de las seis [cimas esenciales](/cims-essencials) del Baix Camp, con el [Tossal de la Baltasana](/cims/tossal-de-la-baltasana), techo de las montañas de Prades, o el Cavall Bernat, en la sierra de Llaberia, justo al sur de la Mola.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_CASTELL, AJUNTAMENT, DIARI_TARRAGONA, CAMINO, ENGARRISTA],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
