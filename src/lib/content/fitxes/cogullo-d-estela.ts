import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: "Viquipèdia: Cogulló d'Estela",
	url: 'https://ca.wikipedia.org/wiki/Cogull%C3%B3_d%27Estela',
	consultat: CONSULTAT
};

const ESTRIS = {
	nom: "Estris: del santuari de la Mare de Déu de Corbera al Cogulló d'Estela",
	url: 'https://www.estris.cat/rebost-recursos/veure-rebost-recursos/2023-03-08-del-santuari-de-la-Mare-de-Deu-de-Corbera-al-cogullo-dEstela',
	consultat: CONSULTAT
};

const ELS_FEIXUCS = {
	nom: "Els feixucs: el Cogulló d'Estela des del santuari de Corbera",
	url: 'https://elsfeixucs.wordpress.com/2016/10/03/el-cogullo-destela-des-del-santuari-de-corbera/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'cogullo-d-estela',
	descripcio: {
		ca: [
			"El Cogulló d'Estela, o Cim d'Estela, és un turó de conglomerat dels Rasos de Peguera, al terme de Castellar del Riu, al [Berguedà](/comarques/bergueda). Destaca, aïllat, damunt dels Plans de Tagast, d'Espinalbet i del santuari de Corbera, i durant bona part de la pujada fa parella amb la roca d'Auró, un turó de forma gairebé idèntica.",
			"L'excursió habitual surt del santuari de la Mare de Déu de Corbera, a uns 2,5 km d'Espinalbet per una pista asfaltada. El camí travessa la pineda ombrívola, passa pel mas en ruïnes de Can Deu, creua el torrent de Tagast i arriba a la font de Tagast, que Estris recomana per fer una parada. Després, pels plans de Tagast, flanqueja la torreta dels Enginyers i la roca d'Auró fins al coll d'Estela, on hi ha la font d'Estela.",
			"La creu de ferro del cim és el seu senyal d'identitat. Segons Estris, des de dalt es veuen l'embassament de la Baells, la serra de la Petita i Berga, el cap de Tartaneda, la vall de Lord i el Port del Comte, els Rasos de Peguera i la serra del Verd; en dies clars, també Montserrat, la serra de l'Obac i el Montseny.",
			"L'últim tram, per la carena, té un parell de parets que demanen certa perícia, i el cim és força exposat: cal anar-hi amb cura, sobretot amb vent o roca humida. Estris proposa la ruta tot l'any i l'adreça a grups a partir de 9 anys."
		],
		es: [
			'El Cogulló d’Estela, o Cim d’Estela, es un cerro de conglomerado de los Rasos de Peguera, en el término de Castellar del Riu, en el [Berguedà](/comarques/bergueda). Destaca, aislado, sobre los Plans de Tagast, Espinalbet y el santuario de Corbera, y durante buena parte de la subida forma pareja con la roca d’Auró, un cerro de forma casi idéntica.',
			'La excursión habitual sale del santuario de la Mare de Déu de Corbera, a unos 2,5 km de Espinalbet por una pista asfaltada. El camino atraviesa el pinar umbrío, pasa por la masía en ruinas de Can Deu, cruza el torrente de Tagast y llega a la fuente de Tagast, que Estris recomienda para hacer una parada. Después, por los plans de Tagast, flanquea la torreta dels Enginyers y la roca d’Auró hasta el coll d’Estela, donde está la font d’Estela.',
			'La cruz de hierro de la cima es su seña de identidad. Según Estris, desde arriba se ven el embalse de la Baells, la serra de la Petita y Berga, el cap de Tartaneda, la vall de Lord y el Port del Comte, los Rasos de Peguera y la serra del Verd; en días claros, también Montserrat, la serra de l’Obac y el Montseny.',
			'El último tramo, por la cresta, tiene un par de paredes que piden cierta pericia, y la cima está bastante expuesta: hay que ir con cuidado, sobre todo con viento o roca húmeda. Estris propone la ruta todo el año y la dirige a grupos a partir de 9 años.'
		]
	},
	rutes: [
		{
			id: 'corbera',
			nom: {
				ca: "Des del santuari de Corbera pel coll d'Estela",
				es: "Desde el santuario de Corbera por el coll d'Estela"
			},
			sortida: { nom: 'Santuari de la Mare de Déu de Corbera (Espinalbet, Castellar del Riu)' },
			desnivellPositiuM: 450,
			distanciaKm: 3,
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Una pista forestal i un corriol surten del santuari cap a Can Deu i la font de Tagast; el camí, amb marques blanques i grogues, gira a l'esquerra cap al coll d'Estela i segueix el llom fins al cim. Estris la dona com a circular de 3 a 4 h amb 450 m de pujada, i Els feixucs, com a anada i tornada d'uns 6 km, uns 500 m de desnivell i poc més de tres hores. Estris parla de parets que demanen perícia i d'un cim força exposat; Els feixucs, d'algun tros una mica aeri just abans del cim.",
				es: 'Una pista forestal y una senda salen del santuario hacia Can Deu y la fuente de Tagast; el camino, con marcas blancas y amarillas, gira a la izquierda hacia el coll d’Estela y sigue el lomo hasta la cima. Estris la da como circular de 3 a 4 h con 450 m de subida, y Els feixucs, como ida y vuelta de unos 6 km, unos 500 m de desnivel y algo más de tres horas. Estris habla de paredes que piden pericia y de una cima bastante expuesta; Els feixucs, de algún trozo algo aéreo justo antes de la cima.'
			},
			fonts: [ESTRIS, ELS_FEIXUCS]
		}
	],
	consells: {
		ca: [
			"Des d'Espinalbet, una pista asfaltada (el camí del coll d'Estela) porta en cotxe al santuari de Corbera, on es pot aparcar.",
			"El camí passa pel mas en ruïnes de Can Deu i creua el torrent de Tagast, que segons Estris sol dur aigua tot l'any.",
			"Si tens vertigen, valora no fer l'últim tram: l'autor d'Els feixucs, que en té, es va quedar al peu de la grimpada final mentre la resta del grup pujava en uns cinc minuts.",
			"Porta aigua i menjar: Estris recomana les fonts de Tagast i d'Estela per parar."
		],
		es: [
			'Desde Espinalbet, una pista asfaltada (el camí del coll d’Estela) lleva en coche al santuario de Corbera, donde se puede aparcar.',
			'El camino pasa por la masía en ruinas de Can Deu y cruza el torrente de Tagast, que según Estris suele llevar agua todo el año.',
			'Si tienes vértigo, valora no hacer el último tramo: el autor de Els feixucs, que lo sufre, se quedó al pie de la trepada final mientras el resto del grupo subía en unos cinco minutos.',
			'Lleva agua y comida: Estris recomienda las fuentes de Tagast y de Estela para parar.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Quant es triga a pujar al Cogulló d'Estela?",
				resposta:
					'Estris calcula de 3 a 4 hores amb parades curtes per a la circular des del santuari de Corbera (450 m de desnivell positiu). Els feixucs hi va tardar poc més de tres hores en anar i tornar pel mateix camí.'
			},
			{
				pregunta: 'És una ruta per a nens?',
				resposta:
					"Estris l'adreça a grups a partir de 9 anys. Els últims metres tenen un parell de parets i el cim és força exposat, de manera que els petits han d'anar sempre ben acompanyats."
			},
			{
				pregunta: 'Té passos amb cadenes?',
				resposta:
					"Cap de les ressenyes consultades no n'esmenta. Estris parla de parets que demanen certa perícia i d'un cim força exposat: si dubtes, el coll d'Estela és un bon lloc per girar cua."
			},
			{
				pregunta: "El Cogulló d'Estela compta com a cim essencial?",
				resposta:
					'Sí, i és el més baix dels sis essencials del Berguedà, amb 1.870 m al catàleg, molt per sota de la [Gallina Pelada](/cims/cap-de-la-gallina-pelada) i del [Pedraforca](/cims/pedraforca-pollego-superior).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Cogulló d’Estela?',
				resposta:
					'Estris calcula de 3 a 4 horas con paradas cortas para la circular desde el santuario de Corbera (450 m de desnivel positivo). Els feixucs tardó algo más de tres horas en ir y volver por el mismo camino.'
			},
			{
				pregunta: '¿Es una ruta para niños?',
				resposta:
					'Estris la dirige a grupos a partir de 9 años. Los últimos metros tienen un par de paredes y la cima está bastante expuesta, así que los pequeños deben ir siempre bien acompañados.'
			},
			{
				pregunta: '¿Tiene pasos con cadenas?',
				resposta:
					'Ninguna de las reseñas consultadas los menciona. Estris habla de paredes que piden cierta pericia y de una cima bastante expuesta: si dudas, el coll d’Estela es un buen sitio para darse la vuelta.'
			},
			{
				pregunta: '¿El Cogulló d’Estela cuenta como cima esencial?',
				resposta:
					'Sí, y es la más baja de las seis esenciales del Berguedà, con 1.870 m en el catálogo, muy por debajo de la [Gallina Pelada](/cims/cap-de-la-gallina-pelada) y del [Pedraforca](/cims/pedraforca-pollego-superior).'
			}
		]
	},
	fonts: [VIQUIPEDIA, ESTRIS, ELS_FEIXUCS],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
