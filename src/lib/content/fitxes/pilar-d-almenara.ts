import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: "Viquipèdia: Pilar d'Almenara",
	url: "https://ca.wikipedia.org/wiki/Pilar_d'Almenara",
	consultat: CONSULTAT
};

const AJUNTAMENT = {
	nom: "Ajuntament d'Agramunt: el Pilar d'Almenara",
	url: 'https://www.agramunt.cat/el-municipi/historia-i-patrimoni-1/historia/pilar-dalmenara',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: "Totnens: Pilar d'Almenara",
	url: 'https://totnens.cat/que-fem/pilar-dalmenara/',
	consultat: CONSULTAT
};

const MONT_EDITORIAL = {
	nom: "Mont Editorial: lo Pilar d'Almenara pel Canal d'Urgell",
	url: 'https://www.monteditorial.cat/producte/pilar-almenara-canal-urgell/',
	consultat: CONSULTAT
};

const REPTES = {
	nom: "Reptes Muntanyencs: Pilar d'Almenara",
	url: 'https://reptesmuntanyencs.cat/pilar-dalmenara/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pilar-d-almenara',
	descripcio: {
		ca: [
			"Lo Pilar d'Almenara corona la serra d'Almenara, damunt del poble d'Almenara Alta, al municipi d'Agramunt, [a l'Urgell](/comarques/urgell). És un turó modest, de gresos, lutites i margues, que s'aixeca sobre la plana agrícola i forma part de l'espai natural protegit de Bellmunt-Almenara. Tot i la poca altitud, és la gran referència visual de la comarca: la silueta de la torre es reconeix des de molts quilòmetres a la rodona.",
			"El nom del cim ve de la torre que l'ocupa. El Pilar és una torre de guaita circular dels segles XI-XII, d'uns 14 metres d'alçada segons l'Ajuntament d'Agramunt, construïda després de la conquesta cristiana per vigilar les incursions sarraïnes, com les de Verdú o Guimerà. Està declarada bé cultural d'interès nacional. S'hi pot entrar: unes escales exteriors porten a la porta i, a dins, unes escales verticals de ferro pugen fins al terrat. Al costat hi ha les restes de l'ermita romànica de Sant Vicenç i un vèrtex geodèsic.",
			"Des del terrat de la torre la vista és circular: la plana de l'Urgell, la vall del Sió i, segons l'Ajuntament, en dies ben clars fins i tot la Seu Vella de Lleida. També es veu el contrast entre el regadiu que va portar el Canal d'Urgell i el secà de la serra, on viuen ocells estepàris i rapinyaires. No gaire lluny hi ha altres cims planers del repte, com [la Fita Alta](/cims/la-fita-alta) o [el Tossal Gros de Vallbona](/cims/tossal-gros-de-vallbona).",
			"Cada estació hi dona un paisatge diferent. La primavera, amb els camps verds i florits, és el millor moment segons Mont Editorial; a l'estiu la plana és molt calorosa i no hi ha ombra, i a l'hivern la boira de la Depressió Central pot tapar la vista durant dies."
		],
		es: [
			"Lo Pilar d'Almenara corona la sierra de Almenara, sobre el pueblo de Almenara Alta, en el municipio de Agramunt, [en el Urgell](/comarques/urgell). Es una loma modesta, de areniscas, lutitas y margas, que se levanta sobre la llanura agrícola y forma parte del espacio natural protegido de Bellmunt-Almenara. Pese a la poca altitud, es la gran referencia visual de la comarca: la silueta de la torre se reconoce desde muchos kilómetros a la redonda.",
			'El nombre de la cima viene de la torre que la ocupa. El Pilar es una torre de vigía circular de los siglos XI-XII, de unos 14 metros de altura según el Ayuntamiento de Agramunt, construida tras la conquista cristiana para vigilar las incursiones sarracenas, como las de Verdú o Guimerà. Está declarada bien cultural de interés nacional. Se puede entrar: unas escaleras exteriores llevan a la puerta y, dentro, unas escaleras verticales de hierro suben hasta la terraza. Al lado están los restos de la ermita románica de Sant Vicenç y un vértice geodésico.',
			"Desde la terraza de la torre la vista es circular: la llanura del Urgell, el valle del Sió y, según el Ayuntamiento, en días muy claros incluso la Seu Vella de Lleida. También se ve el contraste entre el regadío que trajo el Canal d'Urgell y el secano de la sierra, donde viven aves esteparias y rapaces. No muy lejos hay otras cimas llanas del reto, como [la Fita Alta](/cims/la-fita-alta) o [el Tossal Gros de Vallbona](/cims/tossal-gros-de-vallbona).",
			'Cada estación le da un paisaje distinto. La primavera, con los campos verdes y en flor, es el mejor momento según Mont Editorial; en verano la llanura es muy calurosa y no hay sombra, y en invierno la niebla de la Depresión Central puede tapar la vista durante días.'
		]
	},
	rutes: [
		{
			id: 'carretera-lv3231',
			nom: {
				ca: 'Des del coll de la carretera LV-3231',
				es: 'Desde el collado de la carretera LV-3231'
			},
			sortida: { nom: "Aparcament senyalitzat de la LV-3231 (km 4 des d'Agramunt)" },
			tempsMinuts: 7,
			tecnicitat: 'cap',
			descripcio: {
				ca: "És la manera més ràpida d'arribar-hi, i la que trien moltes famílies. Es deixa el cotxe al costat del rètol de la LV-3231, poc abans del coll, i un caminet fàcil porta a la base de la torre en 5–7 minuts, gairebé sense desnivell, segons l'Ajuntament d'Agramunt i Totnens.",
				es: 'Es la forma más rápida de llegar, y la que eligen muchas familias. Se deja el coche junto al cartel de la LV-3231, poco antes del collado, y un caminito fácil lleva a la base de la torre en 5–7 minutos, casi sin desnivel, según el Ayuntamiento de Agramunt y Totnens.'
			},
			fonts: [TOTNENS, AJUNTAMENT]
		},
		{
			id: 'almenara-alta-canal-urgell',
			nom: {
				ca: "Circular des d'Almenara Alta pel Canal d'Urgell",
				es: "Circular desde Almenara Alta por el Canal d'Urgell"
			},
			sortida: { nom: 'Almenara Alta (Agramunt)' },
			descripcio: {
				ca: "Per fer-ne una excursió de veritat, Mont Editorial proposa una volta des d'Almenara Alta que combina el Pilar amb el Canal d'Urgell i el jaciment del Tossal del Moro: 10,8 km, 150 m de desnivell i unes 2 h 30 min, de dificultat bàsica. El recorregut va per pistes amples entre camps de conreu, amb poca ombra.",
				es: "Para hacer una excursión de verdad, Mont Editorial propone una vuelta desde Almenara Alta que combina el Pilar con el Canal d'Urgell y el yacimiento del Tossal del Moro: 10,8 km, 150 m de desnivel y unas 2 h 30 min, de dificultad básica. El recorrido va por pistas anchas entre campos de cultivo, con poca sombra."
			},
			fonts: [MONT_EDITORIAL, REPTES]
		}
	],
	consells: {
		ca: [
			'Si puges al terrat de la torre amb canalla, vigila a les escales verticals de ferro i a dalt de tot.',
			"A l'estiu, evita les hores centrals: a la serra no hi ha ombra i la plana s'escalfa molt.",
			'Si fas la circular, porta aigua: entre els camps no hi ha fonts.',
			'Respecta els conreus: molts camins passen pel costat de camps sembrats.',
			'És un espai natural protegit amb ocells estepàris: no surtis dels camins a la primavera, quan crien.'
		],
		es: [
			'Si subes a la terraza de la torre con niños, vigila en las escaleras verticales de hierro y arriba del todo.',
			'En verano, evita las horas centrales: en la sierra no hay sombra y la llanura se calienta mucho.',
			'Si haces la circular, lleva agua: entre los campos no hay fuentes.',
			'Respeta los cultivos: muchos caminos pasan junto a campos sembrados.',
			'Es un espacio natural protegido con aves esteparias: no salgas de los caminos en primavera, cuando crían.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Es pot pujar al Pilar d'Almenara amb nens?",
				resposta:
					"Sí, és dels cims més fàcils del repte. Des de l'aparcament de la LV-3231 hi ha uns 5–7 minuts de camí planer fins a la torre, i pujar-hi per dins és una petita aventura per a la canalla, sempre acompanyada."
			},
			{
				pregunta: "Es pot entrar a la torre del Pilar d'Almenara?",
				resposta:
					"Sí. Segons Totnens, unes escales exteriors porten a la porta i a dins hi ha escales verticals de ferro fins al terrat, des d'on hi ha la millor vista de la plana de l'Urgell."
			},
			{
				pregunta: "Hi ha alguna ruta més llarga per pujar al Pilar d'Almenara?",
				resposta:
					"Sí. Mont Editorial proposa una circular de 10,8 km i 150 m de desnivell des d'Almenara Alta, passant pel Canal d'Urgell i el Tossal del Moro, d'unes 2 h 30 min."
			},
			{
				pregunta: "Lo Pilar d'Almenara és un cim essencial?",
				resposta:
					'Sí, i és l’únic [cim essencial](/cims-essencials) de l’Urgell. La [normativa](/repte-100-cims/normativa) no fixa des d’on s’ha de començar a caminar, així que la pujada curta des de la LV-3231 també compta, sempre que l’últim tram el facis a peu.'
			}
		],
		es: [
			{
				pregunta: "¿Se puede subir al Pilar d'Almenara con niños?",
				resposta:
					'Sí, es de las cimas más fáciles del reto. Desde el aparcamiento de la LV-3231 hay unos 5–7 minutos de camino llano hasta la torre, y subir por dentro es una pequeña aventura para los niños, siempre acompañados.'
			},
			{
				pregunta: "¿Se puede entrar en la torre del Pilar d'Almenara?",
				resposta:
					'Sí. Según Totnens, unas escaleras exteriores llevan a la puerta y dentro hay escaleras verticales de hierro hasta la terraza, desde donde está la mejor vista de la llanura del Urgell.'
			},
			{
				pregunta: "¿Hay alguna ruta más larga para subir al Pilar d'Almenara?",
				resposta:
					"Sí. Mont Editorial propone una circular de 10,8 km y 150 m de desnivel desde Almenara Alta, pasando por el Canal d'Urgell y el Tossal del Moro, de unas 2 h 30 min."
			},
			{
				pregunta: "¿Lo Pilar d'Almenara es una cima esencial?",
				resposta:
					'Sí, y es la única [cima esencial](/cims-essencials) del Urgell. La [normativa](/repte-100-cims/normativa) no fija desde dónde hay que empezar a caminar, así que la subida corta desde la LV-3231 también cuenta, siempre que el último tramo lo hagas a pie.'
			}
		]
	},
	fonts: [VIQUIPEDIA, AJUNTAMENT, TOTNENS, MONT_EDITORIAL, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
