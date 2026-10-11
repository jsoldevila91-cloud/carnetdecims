import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: "Viquipèdia: El Cogulló (el Pont d'Armentera)",
	url: 'https://ca.wikipedia.org/wiki/El_Cogull%C3%B3_(el_Pont_d%27Armentera)',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: El Cogulló de Cabra',
	url: 'https://reptesmuntanyencs.cat/el-cogullo-de-cabra/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'el-cogullo-de-cabra',
	descripcio: {
		ca: [
			"El Cogulló de Cabra és un cim de la serra de Comaverd, a [l'Alt Camp](/comarques/alt-camp). Malgrat el nom, és al terme del Pont d'Armentera, municipi veí de Cabra del Camp i de Sarral; en aquest darrer poble se'l coneix com el cogulló del Quadres. És una muntanya de conglomerat, amb cingles on hi ha vies d'escalada, dins la Serralada Prelitoral.",
			"El punt delicat d'aquest cim no és la dificultat, sinó saber quin és. El que es veu de lluny i crida l'atenció és el roc del Cogulló, una balconada de roca amb barana de fusta que és un mirador de primer ordre; el cim de la llista, en canvi, és un turó arrodonit i voltat de vegetació que queda uns 390 m més al nord-est, sense gairebé res que l'identifiqui tret d'un cartell. Alguns mapes situen el topònim sobre el roc, i molts excursionistes s'hi queden. L'ICGC el posa al turó.",
			'La vista bona és, doncs, la del roc: els barrancs que es despengen a banda i banda de la carena i, si el dia acompanya, un horitzó ampli. Per la serra passen el GR 7 i el GR 175, la Ruta del Cister, i des de Sarral hi puja una ruta local que visita també la cova Cativera.',
			'A la mateixa comarca hi ha dos cims essencials més, la [Tossa Grossa de Montferri](/cims/tossa-grossa-de-montferri) i [el Tossal Gros](/cims/el-tossal-gros), a la serra de Miramar.'
		],
		es: [
			"El Cogulló de Cabra es una cima de la sierra de Comaverd, en [el Alt Camp](/comarques/alt-camp). A pesar del nombre, está en el término del Pont d'Armentera, municipio vecino de Cabra del Camp y de Sarral; en este último pueblo se la conoce como el cogulló del Quadres. Es una montaña de conglomerado, con riscos donde hay vías de escalada, dentro de la Serralada Prelitoral.",
			'El punto delicado de esta cima no es la dificultad, sino saber cuál es. Lo que se ve de lejos y llama la atención es el roc del Cogulló, una balconada de roca con barandilla de madera que es un mirador de primer orden; la cima de la lista, en cambio, es un cerro redondeado y rodeado de vegetación que queda unos 390 m más al noreste, sin casi nada que lo identifique salvo un cartel. Algunos mapas sitúan el topónimo sobre el roc, y muchos excursionistas se quedan allí. El ICGC lo pone en el cerro.',
			'La vista buena es, pues, la del roc: los barrancos que se descuelgan a ambos lados de la cresta y, si el día acompaña, un horizonte amplio. Por la sierra pasan el GR 7 y el GR 175, la Ruta del Cister, y desde Sarral sube una ruta local que visita también la cova Cativera.',
			'En la misma comarca hay otras dos cimas esenciales, la [Tossa Grossa de Montferri](/cims/tossa-grossa-de-montferri) y [el Tossal Gros](/cims/el-tossal-gros), en la sierra de Miramar.'
		]
	},
	rutes: [
		{
			id: 'cabra-del-camp',
			nom: {
				ca: 'Circular des de Cabra del Camp pel roc del Cogulló',
				es: 'Circular desde Cabra del Camp por el roc del Cogulló'
			},
			sortida: { nom: 'Pou de Solivella, barranc del Cogulló (Cabra del Camp)' },
			descripcio: {
				ca: "La ressenya del bloc Reptes Muntanyencs (2015) surt del pou de Solivella, on s'arriba amb turisme per pista de terra, i fa una volta de 6,5 km i 307 m de desnivell positiu en 1 h 34 min de marxa. Es puja per una pista, a estones molt descomposta i pedregosa, fins a la carrerada del Cogulló; d'allà un senderó estret segueix la carena entre conglomerats, protegit per la vegetació, i una altra pista porta al GR 175. Uns 200 m més enllà, un pal indica el cim, a la dreta: una hora i 3,6 km des de la sortida. Es torna pel roc del Cogulló, del qual es baixa per una escala de fusta amb cadena, i pel GR 175, amb barana en el tram més dret.",
				es: 'La reseña del blog Reptes Muntanyencs (2015) sale del pou de Solivella, adonde se llega en turismo por pista de tierra, y hace una vuelta de 6,5 km y 307 m de desnivel positivo en 1 h 34 min de marcha. Se sube por una pista, a ratos muy descompuesta y pedregosa, hasta la carrerada del Cogulló; desde allí una senda estrecha sigue la cresta entre conglomerados, protegida por la vegetación, y otra pista lleva al GR 175. Unos 200 m más allá, un poste indica la cima, a la derecha: una hora y 3,6 km desde la salida. Se vuelve por el roc del Cogulló, del que se baja por una escalera de madera con cadena, y por el GR 175, con barandilla en el tramo más empinado.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"Assegura't de trepitjar el turó del cim i no només el roc: el pal que l'indica és al GR 175, uns 200 m després de la cruïlla que baixa a Cabra i al coll de Sàrria.",
			"L'escala i la cadena del roc del Cogulló demanen les mans lliures; amb la roca molla, val més tornar pel camí de pujada.",
			"Dels cartells de la zona, només un porta al cim. Porta el mapa de l'ICGC, que és el que el situa bé.",
			"L'accés més habitual és a peu des de Cabra del Camp pel GR 7 fins al coll de Sàrria i, d'allà, pel GR 175. No hi ha fonts."
		],
		es: [
			'Asegúrate de pisar el cerro de la cima y no solo el roc: el poste que la indica está en el GR 175, unos 200 m después del cruce que baja a Cabra y al coll de Sàrria.',
			'La escalera y la cadena del roc del Cogulló piden las manos libres; con la roca mojada, es mejor volver por el camino de subida.',
			'De los carteles de la zona, solo uno lleva a la cima. Lleva el mapa del ICGC, que es el que la sitúa bien.',
			'El acceso más habitual es a pie desde Cabra del Camp por el GR 7 hasta el coll de Sàrria y, desde allí, por el GR 175. No hay fuentes.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'El cim és el roc del Cogulló?',
				resposta:
					'No. El roc del Cogulló és el mirador amb barana, més vistós; el cim del repte és un turó arrodonit uns 390 m al nord-est, senyalitzat amb un pal des del GR 175.'
			},
			{
				pregunta: 'Quant es triga a pujar-hi?',
				resposta:
					'Des del pou de Solivella, a Cabra del Camp, el bloc Reptes Muntanyencs hi va arribar en una hora, després de 3,6 km, i va fer tota la volta de 6,5 km en 1 h 34 min de marxa.'
			},
			{
				pregunta: 'Té passos difícils?',
				resposta:
					"La pujada és per pista i sender, sense passos aeris. L'únic tram equipat és la baixada del roc del Cogulló, amb una escala de fusta i una cadena, que es pot evitar tornant per on s'ha pujat."
			},
			{
				pregunta: 'El Cogulló de Cabra compta com a cim essencial?',
				resposta:
					"Sí, és un dels tres [cims essencials](/cims-essencials) de l'Alt Camp, amb la Tossa Grossa de Montferri i el Tossal Gros."
			}
		],
		es: [
			{
				pregunta: '¿La cima es el roc del Cogulló?',
				resposta:
					'No. El roc del Cogulló es el mirador con barandilla, más vistoso; la cima del reto es un cerro redondeado unos 390 m al noreste, señalizado con un poste desde el GR 175.'
			},
			{
				pregunta: '¿Cuánto se tarda en subir?',
				resposta:
					'Desde el pou de Solivella, en Cabra del Camp, el blog Reptes Muntanyencs llegó en una hora, tras 3,6 km, e hizo toda la vuelta de 6,5 km en 1 h 34 min de marcha.'
			},
			{
				pregunta: '¿Tiene pasos difíciles?',
				resposta:
					'La subida es por pista y sendero, sin pasos aéreos. El único tramo equipado es la bajada del roc del Cogulló, con una escalera de madera y una cadena, que se puede evitar volviendo por donde se ha subido.'
			},
			{
				pregunta: '¿El Cogulló de Cabra cuenta como cima esencial?',
				resposta:
					'Sí, es una de las tres [cimas esenciales](/cims-essencials) del Alt Camp, con la Tossa Grossa de Montferri y el Tossal Gros.'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
