import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Torre de Madaloc',
	url: 'https://ca.wikipedia.org/wiki/Torre_de_Madeloc',
	consultat: CONSULTAT
};

const TURISME_BLOG = {
	nom: 'Office de Tourisme Pyrénées Méditerranée: Madeloc, la randonnée aux panoramas grandioses',
	url: 'https://www.tourisme-pyrenees-mediterranee.com/en/blog/2025/08/16/madeloc-la-randonnee-aux-panoramas-grandioses/',
	consultat: CONSULTAT
};

const GEOTREK = {
	nom: 'Geotrek Pyrénées Méditerranée (Office de Tourisme): La Tour Madeloc',
	url: 'https://rando.tourisme-pyrenees-mediterranee.fr/trek/13786-La-Tour-Madeloc',
	consultat: CONSULTAT
};

const OEIL_DOS = {
	nom: "L'Œil d'Os: randonnée de la tour de Madeloc",
	url: 'https://loeildeos.com/randonnee-tour-de-la-madeloc/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'torre-de-madeloc',
	descripcio: {
		ca: [
			"La torre de Madeloc (o Madaloc; tour Madeloc en francès) s'aixeca a l'extrem oriental de la serra de l'Albera, sobre Cotlliure (Collioure) i Portvendres (Port-Vendres), a la [Catalunya Nord](/comarques/catalunya-nord). És a la carena que separa les vinyes en terrasses de la Costa Vermella de les valls de l'interior, en un vessant del pic de Tallaferro, i és un dels cims del repte més a prop del mar.",
			"La torre és una talaia medieval de planta circular, d'uns 30 m d'alçada i amb murs de 2 m de gruix, envoltada d'un fossat tallat a la roca. El lloc ja surt documentat el 981 com a «pogium Madalanco», i la torre apareix als documents el 1340. Probablement la va fer construir Jaume II de Mallorca, com la propera torre de la Maçana, i formava part de la xarxa de torres de senyals que, amb fums i focs, avisaven d'atacs des del mar a la costa del Rosselló. També se l'ha anomenada torre del Diable. Avui fa de repetidor de televisió, i al voltant hi ha les restes de les bateries militars del segle XIX, com la de Tallaferro (Taillefer) o la Bateria 500.",
			"La vista és sobretot marinera: als peus queden Cotlliure i Portvendres, les cales de la Costa Vermella i les vinyes de Banyuls, i cap a l'interior, les ondulacions de l'Albera. En dies clars s'hi veu la silueta del Canigó. Seguint la serra cap a ponent, la carena porta al [Puig Neulós](/cims/puig-neulos), el sostre de l'Albera.",
			"És un cim per a la tardor, l'hivern i la primavera. A l'estiu la calor és forta i gairebé no hi ha ombra, i la tramuntana pot bufar amb molta violència: l'oficina de turisme desaconsella fer la sortida amb tramuntana forta."
		],
		es: [
			"La torre de Madeloc (o Madaloc; tour Madeloc en francés) se alza en el extremo oriental de la sierra de l'Albera, sobre Cotlliure (Collioure) y Portvendres (Port-Vendres), en la [Cataluña Norte](/comarques/catalunya-nord). Está en la cresta que separa los viñedos en terrazas de la Costa Vermella de los valles del interior, en una ladera del pic de Tallaferro, y es una de las cimas del reto más cercanas al mar.",
			'La torre es una atalaya medieval de planta circular, de unos 30 m de altura y con muros de 2 m de grosor, rodeada de un foso tallado en la roca. El lugar ya aparece documentado en 981 como «pogium Madalanco», y la torre aparece en los documentos en 1340. Probablemente la mandó construir Jaime II de Mallorca, como la cercana torre de la Maçana, y formaba parte de la red de torres de señales que, con humo y fuego, avisaban de ataques desde el mar en la costa del Rosellón. También se la ha llamado torre del Diable. Hoy hace de repetidor de televisión, y a su alrededor quedan los restos de las baterías militares del siglo XIX, como la de Tallaferro (Taillefer) o la Batería 500.',
			"La vista es sobre todo marinera: a los pies quedan Cotlliure y Portvendres, las calas de la Costa Vermella y los viñedos de Banyuls, y hacia el interior, las ondulaciones de l'Albera. En días claros se ve la silueta del Canigó. Siguiendo la sierra hacia el oeste, la cresta lleva al [Puig Neulós](/cims/puig-neulos), el techo de l'Albera.",
			'Es una cima para el otoño, el invierno y la primavera. En verano el calor es fuerte y casi no hay sombra, y la tramontana puede soplar con mucha violencia: la oficina de turismo desaconseja hacer la salida con tramontana fuerte.'
		]
	},
	rutes: [
		{
			id: 'alts-de-portvendres',
			nom: {
				ca: "Des de la taula d'orientació dels Alts de Portvendres",
				es: 'Desde la mesa de orientación de los Alts de Portvendres'
			},
			sortida: { nom: "Taula d'orientació dels Alts de Portvendres (carretera D86)" },
			tempsMinuts: 30,
			tecnicitat: 'cap',
			descripcio: {
				ca: "És la manera més curta d'arribar-hi. Per la carretera de la carena (route des Crêtes, D86), que surt de la rotonda de sobre Cotlliure cap al coll de Mollo, s'aparca a les antigues casernes amb la taula d'orientació, i des d'allà es puja a peu per la carretereta asfaltada, tancada als cotxes, fins a la torre. L'oficina de turisme hi compta uns 30 minuts; és una pujada constant però sense dificultat tècnica, i molt exposada al sol.",
				es: 'Es la forma más corta de llegar. Por la carretera de la cresta (route des Crêtes, D86), que sale de la rotonda de encima de Cotlliure hacia el coll de Mollo, se aparca en los antiguos cuarteles con la mesa de orientación, y desde allí se sube a pie por la carreterita asfaltada, cerrada a los coches, hasta la torre. La oficina de turismo calcula unos 30 minutos; es una subida constante pero sin dificultad técnica, y muy expuesta al sol.'
			},
			fonts: [TURISME_BLOG, OEIL_DOS]
		},
		{
			id: 'coll-de-la-serra',
			nom: { ca: 'Circular des del coll de la Serra', es: 'Circular desde el coll de la Serra' },
			sortida: { nom: 'Coll de la Serra (Cotlliure)' },
			descripcio: {
				ca: "Itinerari més complet de l'oficina de turisme: del coll de la Serra es va a la bateria i al coll de Tallaferro, es puja a la torre, es baixa a la Bateria 500 i es torna pel GR 10 i el camí de l'aigua (marques grogues) pel coll de la Vallàuria. En total són 8,6 km, 609 m de desnivell i gairebé 4 h, amb dificultat mitjana.",
				es: 'Itinerario más completo de la oficina de turismo: desde el coll de la Serra se va a la batería y al coll de Tallaferro, se sube a la torre, se baja a la Batería 500 y se vuelve por el GR 10 y el camino del agua (marcas amarillas) por el coll de la Vallàuria. En total son 8,6 km, 609 m de desnivel y casi 4 h, con dificultad media.'
			},
			fonts: [GEOTREK]
		}
	],
	consells: {
		ca: [
			'No hi ha cap font al recorregut: porta aigua de sobres, protecció solar i barret.',
			"Amb tramuntana forta, deixa-ho per a un altre dia: a la carena les ràfegues fan perdre l'equilibri.",
			"A l'estiu, surt a primera hora o a última hora de la tarda, i consulta si hi ha restriccions d'accés al massís per risc d'incendi.",
			"La carretera de la carena (D86) és estreta i molt concorreguda a l'estiu: aparca només als llocs habilitats i respecta els senyals de pas prohibit.",
			"La torre és un repetidor i no és visitable per dins: el punt de cim és l'esplanada que l'envolta."
		],
		es: [
			'No hay ninguna fuente en el recorrido: lleva agua de sobra, protección solar y gorra.',
			'Con tramontana fuerte, déjalo para otro día: en la cresta las rachas hacen perder el equilibrio.',
			'En verano, sal a primera hora o al final de la tarde, y consulta si hay restricciones de acceso al macizo por riesgo de incendio.',
			'La carretera de la cresta (D86) es estrecha y muy concurrida en verano: aparca solo en los lugares habilitados y respeta las señales de paso prohibido.',
			'La torre es un repetidor y no se puede visitar por dentro: el punto de cima es la explanada que la rodea.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la torre de Madeloc?',
				resposta:
					"Des de la taula d'orientació dels Alts de Portvendres, a la carretera D86, uns 30 minuts de pujada segons l'oficina de turisme. La circular des del coll de la Serra, en canvi, són gairebé 4 h i 609 m de desnivell."
			},
			{
				pregunta: 'Es pot pujar a la torre de Madeloc amb nens?',
				resposta:
					"Sí, des de la taula d'orientació: és una pujada curta per una carretereta asfaltada tancada als cotxes, sense passos tècnics. El que més cal vigilar és el sol i el vent; amb tramuntana forta, millor no anar-hi."
			},
			{
				pregunta: 'Quina és la història de la torre de Madeloc?',
				resposta:
					'És una torre de guaita medieval, documentada el 1340 i atribuïda a Jaume II de Mallorca, que formava part de la xarxa de torres de senyals de la costa. Avui fa de repetidor de televisió.'
			},
			{
				pregunta: 'La torre de Madeloc compta com a cim essencial?',
				resposta:
					'Sí, i és de lluny el més baix dels vuit [cims essencials](/cims-essencials) de la Catalunya Nord: tots els altres, com el [Canigó](/cims/canigo), passen dels 2.400 m. Per validar-lo n’hi ha prou d’arribar a l’esplanada de la torre.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la torre de Madeloc?',
				resposta:
					'Desde la mesa de orientación de los Alts de Portvendres, en la carretera D86, unos 30 minutos de subida según la oficina de turismo. La circular desde el coll de la Serra, en cambio, son casi 4 h y 609 m de desnivel.'
			},
			{
				pregunta: '¿Se puede subir a la torre de Madeloc con niños?',
				resposta:
					'Sí, desde la mesa de orientación: es una subida corta por una carreterita asfaltada cerrada a los coches, sin pasos técnicos. Lo que más hay que vigilar es el sol y el viento; con tramontana fuerte, mejor no ir.'
			},
			{
				pregunta: '¿Cuál es la historia de la torre de Madeloc?',
				resposta:
					'Es una torre de vigía medieval, documentada en 1340 y atribuida a Jaime II de Mallorca, que formaba parte de la red de torres de señales de la costa. Hoy hace de repetidor de televisión.'
			},
			{
				pregunta: '¿La torre de Madeloc cuenta como cima esencial?',
				resposta:
					'Sí, y es con diferencia la más baja de las ocho [cimas esenciales](/cims-essencials) de la Cataluña Norte: todas las demás, como el [Canigó](/cims/canigo), superan los 2.400 m. Para validarla basta con llegar a la explanada de la torre.'
			}
		]
	},
	fonts: [VIQUIPEDIA, TURISME_BLOG, GEOTREK, OEIL_DOS],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
