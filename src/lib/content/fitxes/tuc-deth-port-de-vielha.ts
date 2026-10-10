import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Tuc deth Pòrt de Vielha',
	url: 'https://ca.wikipedia.org/wiki/Tuc_deth_P%C3%B2rt_de_Vielha',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Tuc deth Pòrt de Vielha',
	url: 'https://reptesmuntanyencs.cat/es/tuc-deth-port-de-vielha-2/',
	consultat: CONSULTAT
};

const VISIT_TRAVESSIA = {
	nom: "Visit Val d'Aran: ascensió i travessia del Pòrt de Vielha",
	url: 'https://www.visitvaldaran.com/en/item/ascension-travesia-del-port-vielha/',
	consultat: CONSULTAT
};

const VISIT_TUC = {
	nom: "Visit Val d'Aran: Tuc deth Pòrt de Vielha",
	url: 'https://www.visitvaldaran.com/en/item/tuc-deth-port-vielha/',
	consultat: CONSULTAT
};

const VISIT_MOLIERES = {
	nom: "Visit Val d'Aran: ruta Molières-Conangles",
	url: 'https://www.visitvaldaran.com/en/item/ruta-molieres-conangles/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tuc-deth-port-de-vielha',
	descripcio: {
		ca: [
			"El Tuc deth Pòrt de Vielha és el cim que domina el port de Vielha, el pas històric entre l'Aran i la Ribagorça, al terme de Vielha e Mijaran, a [la Val d'Aran](/comarques/val-d-aran). Pertany a l'àrea protegida de la capçalera de la Noguera Ribagorçana i d'Era Artiga de Lin, i és de granodiorita. Té una prominència de 227 m i un aïllament de 2,5 km, segons la Viquipèdia, i al cim hi ha un vèrtex geodèsic.",
			"A l'estiu, el punt de sortida habitual és l'Espitau de Vielha, l'antic hospital de muntanya de la boca sud del túnel, on passa també el GR 11. Visit Val d'Aran esmenta que la travessia del port passa per antics búnquers militars construïts durant la Guerra Civil, un record del valor estratègic que va tenir aquest pas.",
			"Reptes Muntanyencs el fa en circular: puja per l'estanh Redon i la serra de Fontfreda fins al tuc, baixa al port i torna pel GR fins al Plan dera Espòna. Passat l'estany el sender es desdibuixa, i les fites fan voltar una paret rocosa per la dreta abans d'un darrer tram llarg per terreny pedregós; la baixada cap al nord-oest és pedregosa al principi i, més avall, arenosa i amb pi nan. La carena del tuc, segons Visit Val d'Aran, és sovint ventosa.",
			"A peu, és una sortida d'estiu i de primers de tardor; vigila les tempestes de tarda. A l'hivern és una clàssica d'esquí de muntanya des de la boca nord del túnel: Visit Val d'Aran la recomana només quan la neu cobreix bé les roques de la part alta i avisa que als darrers metres abans del port hi sol haver neu dura o acumulada."
		],
		es: [
			'El Tuc deth Pòrt de Vielha es la cima que domina el port de Vielha, el paso histórico entre el Aran y la Ribagorza, en el término de Vielha e Mijaran, en [la Val d’Aran](/comarques/val-d-aran). Pertenece al área protegida de la cabecera de la Noguera Ribagorçana y de Era Artiga de Lin, y es de granodiorita. Tiene una prominencia de 227 m y un aislamiento de 2,5 km, según la Viquipèdia, y en la cima hay un vértice geodésico.',
			'En verano, el punto de salida habitual es l’Espitau de Vielha, el antiguo hospital de montaña de la boca sur del túnel, por donde pasa también el GR 11. Visit Val d’Aran menciona que la travesía del puerto pasa por antiguos búnkeres militares construidos durante la Guerra Civil, un recuerdo del valor estratégico que tuvo este paso.',
			'Reptes Muntanyencs lo hace en circular: sube por el estanh Redon y la serra de Fontfreda hasta el tuc, baja al puerto y vuelve por el GR hasta el Plan dera Espòna. Pasado el lago el sendero se desdibuja, y los hitos rodean una pared rocosa por la derecha antes de un último tramo largo por terreno pedregoso; la bajada hacia el noroeste es pedregosa al principio y, más abajo, arenosa y con pino rastrero. La cresta del tuc, según Visit Val d’Aran, suele ser ventosa.',
			'A pie, es una salida de verano y de primeros de otoño; vigila las tormentas de tarde. En invierno es una clásica de esquí de montaña desde la boca norte del túnel: Visit Val d’Aran la recomienda solo cuando la nieve cubre bien las rocas de la parte alta y avisa de que en los últimos metros antes del puerto suele haber nieve dura o acumulada.'
		]
	},
	rutes: [
		{
			id: 'espitau-estanh-redon',
			nom: {
				ca: "Circular des de l'Espitau de Vielha per l'estanh Redon",
				es: "Circular desde l'Espitau de Vielha por el estanh Redon"
			},
			sortida: { nom: 'Espitau de Vielha (boca sud del túnel de Vielha)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Reptes Muntanyencs surt de l'aparcament de l'Espitau de Vielha, puja per l'estanh Redon i la serra de Fontfreda, guanya el tuc i baixa pel port, amb marques del GR 211.5, i pel Plan dera Espòna fins al punt de partida. La volta fa uns 11 km, 969 m de desnivell i unes 4 h 51 min de marxa, més 1 h 50 min d'aturades. A la part final hi ha una paret rocosa que se supera per la dreta guiant-se amb fites i terreny ple de pedres, amb la traça «perduda però acotada». Per a la travessia del port des de l'Espitau, Visit Val d'Aran dona 11 km, 6 h i 1.000 m de desnivell, i la qualifica de difícil.",
				es: 'Reptes Muntanyencs sale del aparcamiento de l’Espitau de Vielha, sube por el estanh Redon y la serra de Fontfreda, gana el tuc y baja por el puerto, con marcas del GR 211.5, y por el Plan dera Espòna hasta el punto de partida. La vuelta hace unos 11 km, 969 m de desnivel y unas 4 h 51 min de marcha, más 1 h 50 min de paradas. En la parte final hay una pared rocosa que se supera por la derecha guiándose con hitos y terreno lleno de piedras, con la traza «perdida pero acotada». Para la travesía del puerto desde l’Espitau, Visit Val d’Aran da 11 km, 6 h y 1.000 m de desnivel, y la califica de difícil.'
			},
			fonts: [REPTES, VISIT_TRAVESSIA]
		},
		{
			id: 'boca-nord-fontfreda',
			nom: {
				ca: 'Des de la boca nord del túnel pel llac de Fontfreda (esquí de muntanya)',
				es: 'Desde la boca norte del túnel por el lago de Fontfreda (esquí de montaña)'
			},
			sortida: { nom: 'Aparcament de la boca nord del túnel de Vielha' },
			descripcio: {
				ca: "Visit Val d'Aran proposa una ruta d'esquí de muntanya amb sortida a l'aparcament de la boca nord: bosc d'avets, la vora del riu fins al Pontet i el fons de la vall, deixant el llac de Fontfreda a l'esquerra. Els últims 75 m fins al port són els més drets, sovint amb neu dura o acumulada, i des del port es guanya el tuc per la carena de l'est. Hi compta uns 1.200 m de desnivell i 4 h de pujada, i qualifica el terreny d'allaus de senzill.",
				es: 'Visit Val d’Aran propone una ruta de esquí de montaña con salida en el aparcamiento de la boca norte: bosque de abetos, la orilla del río hasta el Pontet y el fondo del valle, dejando el lago de Fontfreda a la izquierda. Los últimos 75 m hasta el puerto son los más empinados, a menudo con nieve dura o acumulada, y desde el puerto se gana el tuc por la cresta del este. Calcula unos 1.200 m de desnivel y 4 h de subida, y califica el terreno de aludes de sencillo.'
			},
			fonts: [VISIT_TUC]
		}
	],
	consells: {
		ca: [
			"Amb neu dura o gel, no hi pugis sense crampons i piolet: segons Visit Val d'Aran, els últims metres fins al port són drets i la neu hi sol quedar compactada.",
			"Segueix les marques del GR 211.5 i les fites, sobretot a la part final: Reptes Muntanyencs descriu el sender com «perdut però acotat» i l'orientació és sensible a la boira.",
			"Segons Reptes Muntanyencs, només hi ha aigua a la sortida, a l'Espitau de Vielha: omple la cantimplora abans de començar.",
			'La carena és ventosa: porta una capa cortavents encara que a baix faci bon temps.',
			'La baixada pel vessant nord-oest és molt pedregosa al principi i, més avall, arenosa i entre pi baix, segons Reptes Muntanyencs: reserva forces i genolls per al retorn.'
		],
		es: [
			'Con nieve dura o hielo, no subas sin crampones y piolet: según Visit Val d’Aran, los últimos metros hasta el puerto son empinados y la nieve suele quedar compactada.',
			'Sigue las marcas del GR 211.5 y los hitos, sobre todo en la parte final: Reptes Muntanyencs describe el sendero como «perdido pero acotado» y la orientación es sensible a la niebla.',
			'Según Reptes Muntanyencs, solo hay agua en la salida, en l’Espitau de Vielha: llena la cantimplora antes de empezar.',
			'La cresta es ventosa: lleva un cortavientos aunque abajo haga buen tiempo.',
			'La bajada por la vertiente noroeste es muy pedregosa al principio y, más abajo, arenosa y entre pino bajo, según Reptes Muntanyencs: reserva fuerzas y rodillas para la vuelta.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a fer el Tuc deth Pòrt de Vielha?',
				resposta:
					"La volta circular des de l'Espitau de Vielha és d'unes 4 h 51 min de marxa, més 1 h 50 min d'aturades, segons Reptes Muntanyencs. Visit Val d'Aran dona 6 h per a una travessia de 11 km i 1.000 m."
			},
			{
				pregunta: 'És un cim fàcil?',
				resposta:
					"Reptes Muntanyencs valora l'exigència física com a moderada i l'orientació com a baixa, i no esmenta passos amb les mans. Però la part final és pedregosa, amb una paret rocosa que cal superar seguint fites."
			},
			{
				pregunta: "Es pot fer a l'hivern?",
				resposta:
					"Visit Val d'Aran el proposa com a ruta d'esquí de muntanya des de la boca nord del túnel, però només quan la neu és prou gruixuda per cobrir les roques de la part alta. Amb neu dura, el tram final fins al port demana crampons, piolet i experiència."
			},
			{
				pregunta: 'El Tuc deth Pòrt de Vielha compta com a cim essencial?',
				resposta:
					"Sí, és un dels sis [cims essencials](/cims-essencials) de la Val d'Aran. Amb 2.606 m, queda entre el [Montlude](/cims/montlude) i el [Montardo](/cims/montardo) en alçada."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en hacer el Tuc deth Pòrt de Vielha?',
				resposta:
					'La vuelta circular desde l’Espitau de Vielha es de unas 4 h 51 min de marcha, más 1 h 50 min de paradas, según Reptes Muntanyencs. Visit Val d’Aran da 6 h para una travesía de 11 km y 1.000 m.'
			},
			{
				pregunta: '¿Es una cima fácil?',
				resposta:
					'Reptes Muntanyencs valora la exigencia física como moderada y la orientación como baja, y no menciona pasos con las manos. Pero la parte final es pedregosa, con una pared rocosa que hay que superar siguiendo hitos.'
			},
			{
				pregunta: '¿Se puede hacer en invierno?',
				resposta:
					'Visit Val d’Aran lo propone como ruta de esquí de montaña desde la boca norte del túnel, pero solo cuando la nieve es suficientemente gruesa para cubrir las rocas de la parte alta. Con nieve dura, el tramo final hasta el puerto pide crampones, piolet y experiencia.'
			},
			{
				pregunta: '¿El Tuc deth Pòrt de Vielha cuenta como cima esencial?',
				resposta:
					'Sí, es una de las seis [cimas esenciales](/cims-essencials) de la Val d’Aran. Con 2.606 m, queda entre el [Montlude](/cims/montlude) y el [Montardo](/cims/montardo) en altura.'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, VISIT_TRAVESSIA, VISIT_TUC, VISIT_MOLIERES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
