import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: "Viquipèdia: la Picossa (Móra d'Ebre)",
	url: "https://ca.wikipedia.org/wiki/La_Picossa_(M%C3%B3ra_d'Ebre)",
	consultat: CONSULTAT
};

const FEEC_RESTRICCIONS = {
	nom: 'FEEC: cims amb restriccions d’accés',
	url: 'https://www.feec.cat/activitats/100-cims/cims-amb-restriccions-dacces/',
	consultat: CONSULTAT
};

const TURISME_RIBERA = {
	nom: "Turisme de la Ribera d'Ebre: la Picossa",
	url: 'https://www.turismeriberaebre.org/ruta/la-picossa/',
	consultat: CONSULTAT
};

const PIOLET = {
	nom: 'El blog de Piolet: ascensió a la Picossa',
	url: 'https://editorialpiolet.com/elblogdepiolet/ca/2020/12/11/ascensio-a-la-picossa/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'la-picossa',
	descripcio: {
		ca: [
			"La Picossa és el cim emblemàtic de Móra d'Ebre, [a la Ribera d'Ebre](/comarques/ribera-d-ebre). Forma part de la serra de Cavalls i és dins de l'espai protegit de les Serres de Pàndols-Cavalls, un relleu sec i rocós de bretxes i dolomies, amb boscos de pi, antigues feixes de pedra seca i cingles on crien rapinyaires. La carena enllaça diversos turons, com la Pena-roja i el cim de l'Estel, coronat amb una estrella metàl·lica.",
			"**Abans d'anar-hi, tingues en compte la restricció d'accés:** la FEEC no valida les ascensions fetes entre el 15 de gener i el 15 de juny, perquè l'accés hi és prohibit durant la nidificació d'espècies amenaçades. Fora d'aquest període, la pujada és lliure. La serra té també memòria de la Guerra Civil: durant la batalla de l'Ebre, segons la Viquipèdia, l'exèrcit republicà hi va tenir un observatori, que va ser bombardejat abans de l'ofensiva final. Al cim hi ha un vèrtex geodèsic.",
			"Des de dalt es domina bona part de la Ribera d'Ebre, amb Móra i el riu als peus. Des de la Pena-roja es veu el vessant oest, amb els Ports, la serra de Cavalls i Corbera d'Ebre, i des del cim de l'Estel la vista és de 360 graus, amb el Montsant, Llaberia, Tivissa, Cardó i els Ports. A l'altra banda del riu hi ha [la Tossa de Tivissa](/cims/la-tossa-tivissa) i, més al nord, [lo Tormo](/cims/lo-tormo), altres cims essencials de la comarca.",
			"La millor època, coincidint amb el període sense restricció, és de mitjan juny a mitjan gener, evitant la calor forta de l'estiu: la tardor i el principi de l'hivern són ideals. La zona és molt seca i no hi ha fonts."
		],
		es: [
			"La Picossa es la cima emblemática de Móra d'Ebre, [en la Ribera d'Ebre](/comarques/ribera-d-ebre). Forma parte de la sierra de Cavalls y está dentro del espacio protegido de las Serres de Pàndols-Cavalls, un relieve seco y rocoso de brechas y dolomías, con pinares, antiguas terrazas de piedra seca y riscos donde crían rapaces. La cresta enlaza varias lomas, como la Pena-roja y el cim de l'Estel, coronado con una estrella metálica.",
			'**Antes de ir, ten en cuenta la restricción de acceso:** la FEEC no valida las ascensiones hechas entre el 15 de enero y el 15 de junio, porque el acceso está prohibido durante la nidificación de especies amenazadas. Fuera de ese período, la subida es libre. La sierra guarda también memoria de la Guerra Civil: durante la batalla del Ebro, según la Viquipèdia, el ejército republicano tuvo aquí un observatorio, que fue bombardeado antes de la ofensiva final. En la cima hay un vértice geodésico.',
			"Desde arriba se domina buena parte de la Ribera d'Ebre, con Móra y el río a los pies. Desde la Pena-roja se ve la vertiente oeste, con los Ports, la sierra de Cavalls y Corbera d'Ebre, y desde el cim de l'Estel la vista es de 360 grados, con el Montsant, Llaberia, Tivissa, Cardó y los Ports. Al otro lado del río está [la Tossa de Tivissa](/cims/la-tossa-tivissa) y, más al norte, [lo Tormo](/cims/lo-tormo), otras cimas esenciales de la comarca.",
			'La mejor época, coincidiendo con el período sin restricción, va de mediados de junio a mediados de enero, evitando el calor fuerte del verano: el otoño y el principio del invierno son ideales. La zona es muy seca y no hay fuentes.'
		]
	},
	rutes: [
		{
			id: 'ermites-sant-jeroni',
			nom: {
				ca: 'Circular des de les ermites de Sant Jeroni i Santa Madrona',
				es: 'Circular desde las ermitas de Sant Jeroni y Santa Madrona'
			},
			sortida: {
				nom: "Ermites de Sant Jeroni i Santa Madrona (Móra d'Ebre)",
				lat: 41.115968,
				lon: 0.574147
			},
			descripcio: {
				ca: "És la ruta que proposa Turisme de la Ribera d'Ebre. Des de l'aparcament de les ermites, a tocar de Móra, es va cap al sud fins a una carena que, en forma de ferradura, porta a la Picossa. Comença amb un bon pendent, però la carena no té dificultats; hi ha un pas una mica més estret que es pot evitar pels flancs. Des del trencall de la Cresta de les Cabres fins al camí de baixada a les ermites hi ha marques de pintura verda i blanca.",
				es: "Es la ruta que propone Turisme de la Ribera d'Ebre. Desde el aparcamiento de las ermitas, junto a Móra, se va hacia el sur hasta una cresta que, en forma de herradura, lleva a la Picossa. Empieza con una buena pendiente, pero la cresta no tiene dificultades; hay un paso algo más estrecho que se puede evitar por los flancos. Desde el desvío de la Cresta de les Cabres hasta el camino de bajada a las ermitas hay marcas de pintura verde y blanca."
			},
			fonts: [TURISME_RIBERA]
		},
		{
			id: 'santa-magdalena',
			nom: {
				ca: 'Volta llarga per la Pena-roja i Santa Magdalena',
				es: 'Vuelta larga por la Pena-roja y Santa Magdalena'
			},
			sortida: { nom: "Ermites de Sant Jeroni i Santa Madrona (Móra d'Ebre)" },
			descripcio: {
				ca: "L'editorial Piolet descriu una volta més exigent que passa per la Pena-roja i l'ermita de Santa Magdalena de Mucoró abans d'arribar a la Picossa: 6,13 km i 421 m de desnivell acumulat, unes 3 h 40 min. La valora com a difícil pel desnivell i el terreny agrest, amb una baixada final per terreny esquerp i molta pedra solta.",
				es: 'La editorial Piolet describe una vuelta más exigente que pasa por la Pena-roja y la ermita de Santa Magdalena de Mucoró antes de llegar a la Picossa: 6,13 km y 421 m de desnivel acumulado, unas 3 h 40 min. La valora como difícil por el desnivel y el terreno agreste, con una bajada final por terreno abrupto y mucha piedra suelta.'
			},
			fonts: [PIOLET]
		}
	],
	consells: {
		ca: [
			"Respecta la restricció del 15 de gener al 15 de juny: l'accés és prohibit per la cria d'espècies amenaçades i, a més, la FEEC no valida les ascensions fetes en aquestes dates.",
			"Porta tota l'aigua que necessitis des de les ermites: a la serra no hi ha cap font.",
			'A l’estiu, surt molt d’hora: la serra és rocosa i solana, i la calor hi és molt forta.',
			'Si fas la volta llarga, els bastons ajuden a la baixada per pedra solta.',
			'La zona és un espai protegit amb rapinyaires: no t’acostis als cingles on crien i no facis soroll.'
		],
		es: [
			'Respeta la restricción del 15 de enero al 15 de junio: el acceso está prohibido por la cría de especies amenazadas y, además, la FEEC no valida las ascensiones hechas en esas fechas.',
			'Lleva toda el agua que necesites desde las ermitas: en la sierra no hay ninguna fuente.',
			'En verano, sal muy temprano: la sierra es rocosa y solana, y el calor es muy fuerte.',
			'Si haces la vuelta larga, los bastones ayudan en la bajada por piedra suelta.',
			'La zona es un espacio protegido con rapaces: no te acerques a los riscos donde crían y no hagas ruido.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quan es pot pujar a la Picossa?',
				resposta:
					"Del 16 de juny al 14 de gener. Del 15 de gener al 15 de juny l'accés és prohibit per la nidificació d'espècies amenaçades i les ascensions no es validen al repte, segons la FEEC. Consulta la [normativa del repte](/repte-100-cims/normativa) per si hi ha canvis."
			},
			{
				pregunta: "D'on surt la pujada a la Picossa?",
				resposta:
					"De l'aparcament de les ermites de Sant Jeroni i Santa Madrona, a tocar de Móra d'Ebre, s'hi arriba des de la carretera de Gandesa. D'allà surt la carena en ferradura que proposa Turisme de la Ribera d'Ebre."
			},
			{
				pregunta: 'És difícil pujar a la Picossa?',
				resposta:
					'La ruta de la carena és curta però concentrada: comença amb força pendent i hi ha algun pas estret, que es pot evitar. La volta llarga per Santa Magdalena és més dura, amb terreny agrest i pedra solta a la baixada.'
			},
			{
				pregunta: 'La Picossa és un cim essencial?',
				resposta: 'Sí, és un dels [cims essencials](/cims-essencials) del repte.'
			}
		],
		es: [
			{
				pregunta: '¿Cuándo se puede subir a la Picossa?',
				resposta:
					'Del 16 de junio al 14 de enero. Del 15 de enero al 15 de junio el acceso está prohibido por la nidificación de especies amenazadas y las ascensiones no se validan en el reto, según la FEEC. Consulta la [normativa del reto](/repte-100-cims/normativa) por si hay cambios.'
			},
			{
				pregunta: '¿Desde dónde sale la subida a la Picossa?',
				resposta:
					"Desde el aparcamiento de las ermitas de Sant Jeroni y Santa Madrona, junto a Móra d'Ebre, al que se llega desde la carretera de Gandesa. De allí sale la cresta en herradura que propone Turisme de la Ribera d'Ebre."
			},
			{
				pregunta: '¿Es difícil subir a la Picossa?',
				resposta:
					'La ruta de la cresta es corta pero concentrada: empieza con bastante pendiente y hay algún paso estrecho, que se puede evitar. La vuelta larga por Santa Magdalena es más dura, con terreno agreste y piedra suelta en la bajada.'
			},
			{
				pregunta: '¿La Picossa es una cima esencial?',
				resposta: 'Sí, es una de las [cimas esenciales](/cims-essencials) del reto.'
			}
		]
	},
	fonts: [VIQUIPEDIA, FEEC_RESTRICCIONS, TURISME_RIBERA, PIOLET],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
