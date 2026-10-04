import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: "Viquipèdia: Puig de la Caritat (l'Estany)",
	url: "https://ca.wikipedia.org/wiki/Puig_de_la_Caritat_(l'Estany)",
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: "Totnens: Puig de la Caritat a l'Estany",
	url: 'https://totnens.cat/que-fem/puig-de-la-caritat-a-lestany/',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Puig de la Caritat',
	url: 'https://reptesmuntanyencs.cat/puig-de-la-caritat/',
	consultat: CONSULTAT
};

const MAIFEMCIM = {
	nom: 'Mai fem cim: Puig de la Caritat',
	url: 'https://maifemcim.blogspot.com/2020/03/puig-de-la-caritat-1013-m.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-de-la-caritat',
	descripcio: {
		ca: [
			"El Puig de la Caritat és el turó que domina el poble de l'Estany per l'oest, [al Moianès](/comarques/moianes). És un cim suau, de margues, calcàries i lutites, envoltat de camps i boscos, i forma part de l'espai protegit del Moianès i la riera de Muntanyola. Al cim hi ha un vèrtex geodèsic i una creu de pedra.",
			"El nom el lliga a una història que recullen diverses ressenyes excursionistes: el 1481, quan una plaga de llagosta amenaçava les collites, l'abat del monestir de l'Estany va pujar en processó al cim a beneir el terme, i després es va repartir pa i vi entre la gent, una «caritat». La tradició de beneir el terme des del cim s'ha mantingut, el 3 de maig. A baix, el monestir de Santa Maria de l'Estany, fundat al segle XI i amb un claustre romànic de capitells molt treballats, és la gran visita del poble i el complement natural de l'excursió.",
			"Per la poca alçada que guanya, la vista és molt àmplia: a l'est, les Guilleries i el Collsacabra; al nord, la serralada Transversal i el Prepirineu; a l'oest, Montserrat. Totnens hi destaca també el [Matagalls](/cims/matagalls), Cabrera i el Puigsacalm.",
			"Es pot fer tot l'any. A l'hivern l'altiplà del Moianès és fred; a l'estiu, millor anar-hi a primera hora."
		],
		es: [
			"El Puig de la Caritat es el cerro que domina el pueblo de l'Estany por el oeste, [en el Moianès](/comarques/moianes). Es una cima suave, de margas, calizas y lutitas, rodeada de campos y bosques, y forma parte del espacio protegido del Moianès i la riera de Muntanyola. En la cima hay un vértice geodésico y una cruz de piedra.",
			'Su nombre se asocia a una historia que recogen varias reseñas excursionistas: en 1481, cuando una plaga de langosta amenazaba las cosechas, el abad del monasterio de l’Estany subió en procesión a la cima a bendecir el término, y después se repartió pan y vino entre la gente, una «caridad». La tradición de bendecir el término desde la cima se ha mantenido, el 3 de mayo. Abajo, el monasterio de Santa Maria de l’Estany, fundado en el siglo XI y con un claustro románico de capiteles muy trabajados, es la gran visita del pueblo y el complemento natural de la excursión.',
			'Para la poca altura que gana, la vista es muy amplia: al este, las Guilleries y el Collsacabra; al norte, la cordillera Transversal y el Prepirineo; al oeste, Montserrat. Totnens destaca también el [Matagalls](/cims/matagalls), Cabrera y el Puigsacalm.',
			'Se puede hacer todo el año. En invierno el altiplano del Moianès es frío; en verano, mejor ir a primera hora.'
		]
	},
	rutes: [
		{
			id: 'l-estany',
			nom: { ca: "Des del poble de l'Estany", es: "Desde el pueblo de l'Estany" },
			sortida: { nom: "L'Estany (prop de l'església de Santa Maria)" },
			tempsMinuts: 20,
			tecnicitat: 'cap',
			descripcio: {
				ca: 'Surt del mateix poble i puja per pistes i camins marcats, en part pel GR, fins al cim. Totnens hi calcula uns 20 minuts de pujada i una volta circular de 5 km i unes 2 h passejant; Reptes Muntanyencs, sortint del cementiri, hi arriba en menys de mitja hora per pistes i camins de dificultat baixa. Algun tram de la baixada circular és més complicat.',
				es: 'Sale del mismo pueblo y sube por pistas y caminos marcados, en parte por el GR, hasta la cima. Totnens calcula unos 20 minutos de subida y una vuelta circular de 5 km y unas 2 h paseando; Reptes Muntanyencs, saliendo del cementerio, llega en menos de media hora por pistas y caminos de dificultad baja. Algún tramo de la bajada circular es más complicado.'
			},
			fonts: [TOTNENS, REPTES, VIQUIPEDIA]
		},
		{
			id: 'l-estany-llarga',
			nom: {
				ca: "Volta llarga des de l'Estany",
				es: "Vuelta larga desde l'Estany"
			},
			sortida: { nom: "L'Estany" },
			descripcio: {
				ca: 'Si et sap greu que sigui tan curta, Mai fem cim hi proposa una volta de 8,4 km i 220 m de desnivell acumulat, unes 3 h en total, per pistes i corriols entre camps i boscos, que es pot allargar fins al turó de Bellver.',
				es: 'Si se te queda corta, Mai fem cim propone una vuelta de 8,4 km y 220 m de desnivel acumulado, unas 3 h en total, por pistas y senderos entre campos y bosques, que se puede alargar hasta el turó de Bellver.'
			},
			fonts: [MAIFEMCIM]
		}
	],
	consells: {
		ca: [
			'Aparca al poble sense ocupar els accessos als camps i a les masies.',
			'A la baixada circular hi ha algun tram més dret i trencat: amb nens petits, pots tornar pel mateix camí de pujada.',
			"Combina l'excursió amb la visita al monestir de Santa Maria de l'Estany; consulta'n els horaris abans d'anar-hi.",
			"Els camins travessen finques de conreu: no trepitgis els sembrats i tanca les barreres si n'hi ha.",
			'Amb boira, a dalt hi ha poques referències: segueix les marques del GR.'
		],
		es: [
			'Aparca en el pueblo sin ocupar los accesos a los campos y a las masías.',
			'En la bajada circular hay algún tramo más empinado y roto: con niños pequeños, puedes volver por el mismo camino de subida.',
			'Combina la excursión con la visita al monasterio de Santa Maria de l’Estany; consulta sus horarios antes de ir.',
			'Los caminos cruzan fincas de cultivo: no pises los sembrados y cierra las barreras si las hay.',
			'Con niebla, arriba hay pocas referencias: sigue las marcas del GR.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puig de la Caritat?',
				resposta:
					"Uns 20 minuts des del poble de l'Estany, segons Totnens. La volta circular sencera, d'uns 5 km, es fa en unes 2 h passejant."
			},
			{
				pregunta: 'Es pot pujar al Puig de la Caritat amb nens?',
				resposta:
					'Sí, és una de les excursions més fàcils del repte: curta, per pistes i camins marcats i sense passos tècnics. Si fas la volta circular, vigila en algun tram de baixada més complicat.'
			},
			{
				pregunta: "D'on ve el nom del Puig de la Caritat?",
				resposta:
					"Segons Mai fem cim, d'una processó del 1481: durant una plaga de llagosta, l'abat de l'Estany va pujar a beneir el terme i després es va repartir pa i vi a la gent. La benedicció del terme se segueix fent el 3 de maig."
			},
			{
				pregunta: 'El Puig de la Caritat és un cim essencial?',
				resposta:
					'Sí, és un dels [cims essencials](/cims-essencials) del repte i l’únic del Moianès.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puig de la Caritat?',
				resposta:
					"Unos 20 minutos desde el pueblo de l'Estany, según Totnens. La vuelta circular completa, de unos 5 km, se hace en unas 2 h paseando."
			},
			{
				pregunta: '¿Se puede subir al Puig de la Caritat con niños?',
				resposta:
					'Sí, es una de las excursiones más fáciles del reto: corta, por pistas y caminos marcados y sin pasos técnicos. Si haces la vuelta circular, cuidado en algún tramo de bajada más complicado.'
			},
			{
				pregunta: '¿De dónde viene el nombre del Puig de la Caritat?',
				resposta:
					'Según Mai fem cim, de una procesión de 1481: durante una plaga de langosta, el abad de l’Estany subió a bendecir el término y después se repartió pan y vino a la gente. La bendición del término se sigue haciendo el 3 de mayo.'
			},
			{
				pregunta: '¿El Puig de la Caritat es una cima esencial?',
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) del reto y la única del Moianès.'
			}
		]
	},
	fonts: [VIQUIPEDIA, TOTNENS, REPTES, MAIFEMCIM],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
