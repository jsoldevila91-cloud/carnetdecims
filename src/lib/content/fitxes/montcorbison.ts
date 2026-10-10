import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Montcorbison',
	url: 'https://ca.wikipedia.org/wiki/Montcorbison',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Montcorbison',
	url: 'https://reptesmuntanyencs.cat/es/montcorbison-2/',
	consultat: CONSULTAT
};

const DOSMILS = {
	nom: "Visit Val d'Aran: descobreix els dosmilers de la Val d'Aran",
	url: 'https://www.visitvaldaran.com/descubre-los-dosmiles-la-val-daran/',
	consultat: CONSULTAT
};

const BASSA = {
	nom: "Rutes Pirineus: Bassa d'Oles i bosc de Baricauba",
	url: 'https://www.rutespirineus.cat/rutes/bassa-d-oles',
	consultat: CONSULTAT
};

const CONSELH = {
	nom: "Conselh Generau d'Aran: regulació d'accessos al medi natural, estiu 2025",
	url: 'https://www.conselharan.org/ca/el-conselh-generau-activa-el-calendari-de-regulacio-daccessos-al-medi-natural-per-a-lestiu-de-2025/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'montcorbison',
	descripcio: {
		ca: [
			"El Montcorbison és el cim més baix dels sis essencials de [la Val d'Aran](/comarques/val-d-aran), però també el més fàcil de situar: s'alça just damunt de la Bassa d'Oles, al terme de Vielha e Mijaran, a poca distància del nucli de Gausac. Pertany a l'espai protegit d'Era Artiga de Lin i el roc que el forma és llicorella, una pissarra fosca.",
			"Al costat, a la mateixa carena, hi ha el Letassi (2.177 m), que és uns quants metres més alt. També es pot fer l'ascensió sencera a peu des de Vielha, i la Viquipèdia recorda una prova de quilòmetre vertical que surt del centre de la vila i arriba al cim en uns 4,2 km amb gairebé 1.200 m de desnivell. L'altra manera, més habitual, és sortir de la Bassa d'Oles, que és a 1.600 m i s'hi arriba per una pista asfaltada que travessa el bosc de Baricauba.",
			"Rutes Pirineus el defineix com un cim arrodonit i tranquil, i aquesta és la seva virtut: ofereix una de les panoràmiques més àmplies de la Val d'Aran sense exigir una gran aproximació. Des de dalt es distingeixen l'Aneto i la Maladeta, i s'abasta bona part de l'Alt i el Mig Aran, amb els pobles de la vall al fons.",
			"Com que no arriba als 2.200 m, la neu s'hi fon abans que als tresmils, però no és una excursió per a qualsevol època. Una nevada pot tapar els trams sense camí i deixar la pista de la bassa impracticable per als cotxes. La temporada més còmoda va de finals de primavera a la tardor, i a l'estiu convé evitar les hores centrals del dia."
		],
		es: [
			'El Montcorbison es la cima más baja de las seis esenciales de [la Val d’Aran](/comarques/val-d-aran), pero también la más fácil de situar: se alza justo encima de la Bassa d’Oles, en el término de Vielha e Mijaran, a poca distancia del núcleo de Gausac. Pertenece al espacio protegido de Era Artiga de Lin y la roca que lo forma es pizarra (llicorella), una piedra oscura.',
			'Al lado, en la misma cresta, está el Letassi (2.177 m), unos metros más alto. También se puede hacer la ascensión entera a pie desde Vielha, y la Viquipèdia recuerda una prueba de kilómetro vertical que sale del centro de la villa y llega a la cima en unos 4,2 km con casi 1.200 m de desnivel. La otra forma, más habitual, es salir de la Bassa d’Oles, que está a 1.600 m y a la que se llega por una pista asfaltada que cruza el bosque de Baricauba.',
			'Rutes Pirineus lo define como una cima redondeada y tranquila, y esa es su virtud: ofrece una de las panorámicas más amplias de la Val d’Aran sin exigir una gran aproximación. Desde arriba se distinguen el Aneto y la Maladeta, y se abarca buena parte del Alt y el Mig Aran, con los pueblos del valle al fondo.',
			'Como no llega a los 2.200 m, la nieve se funde antes que en los tresmiles, pero no es una excursión para cualquier época. Una nevada puede tapar los tramos sin camino y dejar la pista de la bassa impracticable para los coches. La temporada más cómoda va de finales de primavera al otoño, y en verano conviene evitar las horas centrales del día.'
		]
	},
	rutes: [
		{
			id: 'bassa-d-oles',
			nom: {
				ca: "Des de la Bassa d'Oles",
				es: "Desde la Bassa d'Oles"
			},
			sortida: { nom: "Aparcament de la Bassa d'Oles (Vielha e Mijaran, uns 1.600 m)" },
			desnivellPositiuM: 560,
			distanciaKm: 2,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "És la pujada més curta. S'arriba en cotxe a la Bassa d'Oles per la pista asfaltada que surt de Gausac i travessa el bosc de Baricauba, i des de l'aparcament s'enfila un sender d'uns 2 km fins al cim, segons la Viquipèdia. Visit Val d'Aran el descriu marcat amb senyals grogues, hi compta 560 m de desnivell i 2 h 40 min de pujada. Reptes Muntanyencs, que hi puja per aquest vessant, avisa que a la part alta la traça es perd i cal seguir les fites; a la carena el sender torna a ser evident.",
				es: 'Es la subida más corta. Se llega en coche a la Bassa d’Oles por la pista asfaltada que sale de Gausac y cruza el bosque de Baricauba, y desde el aparcamiento sube un sendero de unos 2 km hasta la cima, según la Viquipèdia. Visit Val d’Aran lo describe marcado con señales amarillas, y calcula 560 m de desnivel y 2 h 40 min de subida. Reptes Muntanyencs, que sube por esta vertiente, avisa de que en la parte alta la traza se pierde y hay que seguir los hitos; en la cresta el sendero vuelve a ser evidente.'
			},
			fonts: [VIQUIPEDIA, DOSMILS, REPTES, BASSA]
		},
		{
			id: 'casau',
			nom: {
				ca: 'Circular des de Casau',
				es: 'Circular desde Casau'
			},
			sortida: { nom: 'Aparcament de Casau (Vielha e Mijaran)' },
			descripcio: {
				ca: "Reptes Muntanyencs proposa una volta de gairebé 11 km i uns 1.200 m de desnivell des de Casau, que es fa en unes quatre hores de marxa. Puja per pista i sender fins a la zona sense traça, segueix la carena pel Tuc des Letassi i baixa fort cap a eth Santet, un descens que l'autor recomana fer amb cura pel pendent. El darrer tram és un camí empedrat. Valora la dificultat física com a molt alta.",
				es: 'Reptes Muntanyencs propone una vuelta de casi 11 km y unos 1.200 m de desnivel desde Casau, que se hace en unas cuatro horas de marcha. Sube por pista y sendero hasta la zona sin traza, sigue la cresta por el Tuc des Letassi y baja con fuerte pendiente hacia eth Santet, un descenso que el autor recomienda hacer con cuidado. El último tramo es un camino empedrado. Valora la dificultad física como muy alta.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"Aparca a la Bassa d'Oles, a 1.596 m segons Rutes Pirineus. Al costat de l'aparcament hi ha un refugi forestal remodelat per a grups organitzats, que no és guardat.",
			"El Conselh Generau d'Aran regula l'accés amb vehicle a la Bassa d'Oles les setmanes de més afluència de l'estiu (el 2025, del 28 de juliol al 31 d'agost, de 10 a 17 h). Les dates canvien cada any: consulta la regulació vigent abans d'anar-hi.",
			'Per sobre de la bassa la traça es dilueix: segueix les fites i, amb boira, no et deixis portar pel pendent, que és força continuat.',
			"Va bé sortir d'hora, no només per evitar la calor, sinó perquè és quan més fàcil és veure fauna, segons Visit Val d'Aran.",
			"A l'hivern o amb neu a la pista, la sortida des de la bassa deixa de ser possible en cotxe i la jornada s'allarga: sortir de Vielha o de Gausac a peu és una altra excursió."
		],
		es: [
			'Aparca en la Bassa d’Oles, a 1.596 m según Rutes Pirineus. Junto al aparcamiento hay un refugio forestal remodelado para grupos organizados, que no está guardado.',
			'El Conselh Generau d’Aran regula el acceso en vehículo a la Bassa d’Oles en las semanas de más afluencia del verano (en 2025, del 28 de julio al 31 de agosto, de 10 a 17 h). Las fechas cambian cada año: consulta la regulación vigente antes de ir.',
			'Por encima de la bassa la traza se diluye: sigue los hitos y, con niebla, no te dejes llevar por la pendiente, que es bastante continua.',
			'Conviene salir temprano, no solo para evitar el calor, sino porque es cuando es más fácil ver fauna, según Visit Val d’Aran.',
			'En invierno o con nieve en la pista, la salida desde la bassa deja de ser posible en coche y la jornada se alarga: salir de Vielha o de Gausac a pie es otra excursión.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Montcorbison?',
				resposta:
					"Des de la Bassa d'Oles, Visit Val d'Aran compta 2 h 40 min de pujada per 560 m de desnivell. Per la circular de Casau, Reptes Muntanyencs hi va dedicar unes 4 h de marxa, tornada inclosa, amb prop de 1.200 m de desnivell."
			},
			{
				pregunta: 'És un bon cim per començar al repte?',
				resposta:
					"És el cim més baix dels sis essencials de l'Aran i el que té l'aproximació més curta. Tot i així, per sobre de la bassa hi ha trams sense camí clar, i l'orientació amb boira exigeix atenció."
			},
			{
				pregunta: 'Es pot enllaçar amb el Letassi?',
				resposta:
					'Segons la Viquipèdia, el Letassi (2.177 m) és a la mateixa carena, molt a prop del Montcorbison. Afegir-lo allarga la jornada: planifica la ruta amb un track i no el deixis per al final amb mal temps.'
			},
			{
				pregunta: 'El Montcorbison compta com a cim essencial?',
				resposta:
					"Sí, és un dels sis [cims essencials](/cims-essencials) de la Val d'Aran i el més baix: 2.173 m, enfront dels 2.833 m del [Montardo](/cims/montardo) o dels 3.010 m del [Tuc de Molières](/cims/tuc-de-molieres)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Montcorbison?',
				resposta:
					'Desde la Bassa d’Oles, Visit Val d’Aran calcula 2 h 40 min de subida para 560 m de desnivel. Por la circular de Casau, Reptes Muntanyencs empleó unas 4 h de marcha, vuelta incluida, con cerca de 1.200 m de desnivel.'
			},
			{
				pregunta: '¿Es una buena cima para empezar en el reto?',
				resposta:
					'Es la cima más baja de las seis esenciales del Aran y la que tiene la aproximación más corta. Aun así, por encima de la bassa hay tramos sin camino claro, y la orientación con niebla exige atención.'
			},
			{
				pregunta: '¿Se puede enlazar con el Letassi?',
				resposta:
					'Según la Viquipèdia, el Letassi (2.177 m) está en la misma cresta, muy cerca del Montcorbison. Añadirlo alarga la jornada: planifica la ruta con un track y no lo dejes para el final con mal tiempo.'
			},
			{
				pregunta: '¿El Montcorbison cuenta como cima esencial?',
				resposta:
					'Sí, es una de las seis [cimas esenciales](/cims-essencials) de la Val d’Aran y la más baja: 2.173 m, frente a los 2.833 m del [Montardo](/cims/montardo) o los 3.010 m del [Tuc de Molières](/cims/tuc-de-molieres).'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, DOSMILS, BASSA, CONSELH],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
