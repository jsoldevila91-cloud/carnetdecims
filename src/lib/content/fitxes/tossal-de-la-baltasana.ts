import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Tossal de la Baltasana',
	url: 'https://ca.wikipedia.org/wiki/Tossal_de_la_Baltasana',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: Tossal de la Baltasana a Prades',
	url: 'https://totnens.cat/que-fem/tossal-de-la-baltasana-a-prades/',
	consultat: CONSULTAT
};

const FEMTURISME = {
	nom: 'Femturisme: Tossal de la Baltasana o la Torre des de Prades (circular)',
	url: 'https://femturisme.cat/en/routes/tossal-de-la-baltasana-or-the-tower-from-pradas-circular',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Tossal de la Baltasana des de Prades',
	url: 'https://reptesmuntanyencs.cat/es/tossal-de-la-baltasana-2/',
	consultat: CONSULTAT
};

const ESCAPADA = {
	nom: 'Escapada amb nens: excursió al Tossal de la Baltasana des de Prades',
	url: 'https://www.escapadaambnens.com/activitat/834/excursio-al-tossal-de-la-baltasana-des-de-prades/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tossal-de-la-baltasana',
	descripcio: {
		ca: [
			"El Tossal de la Baltasana és el sostre de les muntanyes de Prades i, alhora, el punt més alt [del Baix Camp](/comarques/baix-camp) i de la [Conca de Barberà](/comarques/conca-de-barbera), les dues comarques que s'hi toquen. El cim és entre els termes de Prades i de Vimbodí i Poblet, a uns 2 km de la vila de Prades, i forma part de la carena que separa la conca de l'Ebre de la del Francolí. Tot el massís és un espai protegit, amb grans boscos de pi roig, alzina i castanyer.",
			"La singularitat botànica del lloc és el roure reboll: segons la Viquipèdia, aquí hi ha l'única població d'aquest roure de tot Catalunya, i al coll de la Foguina un plafó informatiu n'explica la història. Al cim hi trobaràs el vèrtex geodèsic, una taula d'orientació, un penell i una placa del centenari de la FEEC, i també una petita torre amb repetidors i una estació meteorològica, que explica per què a la zona també l'anomenen la Torre.",
			'La vista abraça bona part del sud de Catalunya. Als peus hi ha Prades i, més enllà, la serra de Montsant amb [la Roca Corbatera](/cims/roca-corbatera), [la Mola de Colldejou](/cims/mola-de-colldejou), les antenes de la Mussara i, al fons, els Ports. Segons Femturisme, els dies molt clars es pot arribar a distingir el Pirineu, del Puigmal al Mont Perdut.',
			"A l'estiu, Prades és un bon refugi de la calor del Camp, i els boscos donen ombra a bona part del camí. A l'hivern, a 1.200 m, hi pot fer fred i bufar vent a la carena, i el camí pot tenir gel. La tardor, amb els castanyers i els roures canviant de color, és potser el millor moment."
		],
		es: [
			'El Tossal de la Baltasana es el techo de las montañas de Prades y, a la vez, el punto más alto [del Baix Camp](/comarques/baix-camp) y de la [Conca de Barberà](/comarques/conca-de-barbera), las dos comarcas que se tocan en él. La cima está entre los términos de Prades y de Vimbodí i Poblet, a unos 2 km de la villa de Prades, y forma parte de la cresta que separa la cuenca del Ebro de la del Francolí. Todo el macizo es un espacio protegido, con grandes bosques de pino silvestre, encina y castaño.',
			'La singularidad botánica del lugar es el roble melojo (roure reboll): según la Viquipèdia, aquí está la única población de este roble de toda Cataluña, y en el coll de la Foguina un panel informativo explica su historia. En la cima encontrarás el vértice geodésico, una mesa de orientación, una veleta y una placa del centenario de la FEEC, y también una pequeña torre con repetidores y una estación meteorológica, que explica por qué en la zona también la llaman la Torre.',
			'La vista abarca buena parte del sur de Cataluña. A los pies está Prades y, más allá, la sierra de Montsant con [la Roca Corbatera](/cims/roca-corbatera), [la Mola de Colldejou](/cims/mola-de-colldejou), las antenas de la Mussara y, al fondo, los Ports. Según Femturisme, los días muy claros se puede llegar a distinguir el Pirineo, del Puigmal al Monte Perdido.',
			'En verano, Prades es un buen refugio del calor del Camp, y los bosques dan sombra a buena parte del camino. En invierno, a 1.200 m, puede hacer frío y soplar viento en la cresta, y el camino puede tener hielo. El otoño, con los castaños y los robles cambiando de color, es quizá el mejor momento.'
		]
	},
	rutes: [
		{
			id: 'prades-gr171',
			nom: { ca: 'Des de Prades pel GR 171', es: 'Desde Prades por el GR 171' },
			sortida: { nom: 'Prades (carrer dels Colomers)' },
			tempsMinuts: 50,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "La pujada clàssica surt del carrer dels Colomers, a la part alta de Prades, i segueix tota l'estona les marques blanques i vermelles del GR 171 per pista forestal i corriols, passant pel coll de la Foguina i el coll del Bosc. Reptes Muntanyencs hi arriba en uns 50 minuts i la descriu com una excursió molt fàcil; Totnens avisa que l'últim tram és rocós i una mica més dret.",
				es: 'La subida clásica sale de la calle dels Colomers, en la parte alta de Prades, y sigue todo el rato las marcas blancas y rojas del GR 171 por pista forestal y sendas, pasando por el coll de la Foguina y el coll del Bosc. Reptes Muntanyencs llega en unos 50 minutos y la describe como una excursión muy fácil; Totnens avisa de que el último tramo es rocoso y algo más empinado.'
			},
			fonts: [REPTES, TOTNENS, FEMTURISME]
		},
		{
			id: 'prades-coves-d-en-pere',
			nom: {
				ca: "Circular per les Coves d'en Pere i l'Abellera",
				es: "Circular por las Coves d'en Pere y l'Abellera"
			},
			sortida: { nom: 'Prades (plaça Major)' },
			descripcio: {
				ca: "Per fer-ne una volta, des del cim es baixa per un camí que surt darrere de la caseta cap a les Coves d'en Pere, uns abrics de roca, el mirador de la Roca del Gríngol i l'ermita de la Mare de Déu de l'Abellera, i es torna a Prades per l'antic camí ramader de Poblet. Reptes Muntanyencs hi dona 10,98 km i 330 m de desnivell, unes 2 h 20 min de marxa; avisa que a la baixada final les marques es perden.",
				es: "Para hacer una vuelta, desde la cima se baja por un camino que sale detrás de la caseta hacia las Coves d'en Pere, unos abrigos de roca, el mirador de la Roca del Gríngol y la ermita de la Mare de Déu de l'Abellera, y se vuelve a Prades por el antiguo camino ganadero de Poblet. Reptes Muntanyencs le da 10,98 km y 330 m de desnivel, unas 2 h 20 min de marcha; avisa de que en la bajada final las marcas se pierden."
			},
			fonts: [REPTES, FEMTURISME, ESCAPADA]
		}
	],
	consells: {
		ca: [
			'A Prades pots aparcar a la zona del camp de futbol o de la benzinera, a tocar del carrer dels Colomers on comença el GR 171.',
			"Amb nens, la pujada pel GR i la baixada per les Coves d'en Pere fan una sortida molt completa; compta més temps del que marquen les ressenyes si entreu a les coves.",
			"Vigila l'últim tram de pujada, més rocós, sobretot si ha plogut o hi ha gel.",
			"A la baixada per l'Abellera, les marques escassegen al final: porta el mapa o el track.",
			'A les muntanyes de Prades, a l’estiu, consulta el Pla Alfa per si hi ha restriccions d’accés per risc d’incendi.'
		],
		es: [
			'En Prades puedes aparcar en la zona del campo de fútbol o de la gasolinera, junto a la calle dels Colomers donde empieza el GR 171.',
			"Con niños, la subida por el GR y la bajada por las Coves d'en Pere forman una salida muy completa; cuenta más tiempo del que marcan las reseñas si entráis en las cuevas.",
			'Vigila el último tramo de subida, más rocoso, sobre todo si ha llovido o hay hielo.',
			'En la bajada por l’Abellera, las marcas escasean al final: lleva el mapa o el track.',
			'En las montañas de Prades, en verano, consulta el Pla Alfa por si hay restricciones de acceso por riesgo de incendio.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Tossal de la Baltasana des de Prades?',
				resposta:
					'Uns 50 minuts pel GR 171, segons Reptes Muntanyencs. Si fas la volta tornant per les Coves d’en Pere i l’Abellera, compta unes 2 h 30 min de marxa en total.'
			},
			{
				pregunta: 'Es pot pujar al Tossal de la Baltasana amb nens?',
				resposta:
					"Sí. Totnens i Escapada amb nens la recomanen per a famílies: el camí és ben marcat i les Coves d'en Pere engresquen la canalla. Només cal anar amb compte al tram final, que és rocós."
			},
			{
				pregunta: 'Per què també l’anomenen la Torre?',
				resposta:
					'Al cim hi ha una petita torre amb repetidors i una estació meteorològica, al costat del vèrtex geodèsic. Femturisme recull aquest nom alternatiu del tossal.'
			},
			{
				pregunta: 'El Tossal de la Baltasana és un cim essencial?',
				resposta:
					'Sí. És el sostre dels sis [cims essencials](/cims-essencials) del Baix Camp, per sobre de [la Mola de Colldejou](/cims/mola-de-colldejou). Tot i que també és el sostre de la Conca de Barberà, al repte compta com a cim del Baix Camp.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Tossal de la Baltasana desde Prades?',
				resposta:
					'Unos 50 minutos por el GR 171, según Reptes Muntanyencs. Si haces la vuelta regresando por las Coves d’en Pere y l’Abellera, cuenta unas 2 h 30 min de marcha en total.'
			},
			{
				pregunta: '¿Se puede subir al Tossal de la Baltasana con niños?',
				resposta:
					"Sí. Totnens y Escapada amb nens la recomiendan para familias: el camino está bien marcado y las Coves d'en Pere entusiasman a los pequeños. Solo hay que ir con cuidado en el tramo final, que es rocoso."
			},
			{
				pregunta: '¿Por qué también la llaman la Torre?',
				resposta:
					'En la cima hay una pequeña torre con repetidores y una estación meteorológica, junto al vértice geodésico. Femturisme recoge este nombre alternativo del tossal.'
			},
			{
				pregunta: '¿El Tossal de la Baltasana es una cima esencial?',
				resposta:
					'Sí. Es el techo de las seis [cimas esenciales](/cims-essencials) del Baix Camp, por encima de [la Mola de Colldejou](/cims/mola-de-colldejou). Aunque también es el techo de la Conca de Barberà, en el reto cuenta como cima del Baix Camp.'
			}
		]
	},
	fonts: [VIQUIPEDIA, TOTNENS, FEMTURISME, REPTES, ESCAPADA],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
