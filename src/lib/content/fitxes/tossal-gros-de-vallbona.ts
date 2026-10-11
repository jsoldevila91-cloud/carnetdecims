import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const WIKIPEDIA = {
	nom: 'Wikipedia: Tossal Gros de Vallbona',
	url: 'https://en.wikipedia.org/wiki/Tossal_Gros_de_Vallbona',
	consultat: CONSULTAT
};

const RUTA_CISTER = {
	nom: 'La Ruta del Cister: La Serra del Tallat, PR-C 58',
	url: 'https://larutadelcister.info/ca/node/4128',
	consultat: CONSULTAT
};

const SURT_DE_CASA = {
	nom: 'Surt de Casa Ponent: Saps què són els PR?',
	url: 'https://surtdecasa.cat/ponent/entorn/saps-que-son-els-pr',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Tossal Gros de Vallbona',
	url: 'https://reptesmuntanyencs.cat/tossal-gros-de-vallbona/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tossal-gros-de-vallbona',
	descripcio: {
		ca: [
			"El Tossal Gros de Vallbona és el punt més alt de la serra del Tallat, la carena que separa [la Conca de Barberà](/comarques/conca-de-barbera) de l'Urgell. El cim fa de límit entre els termes de l'Espluga de Francolí i de Vallbona de les Monges, i a l'Urgell se'l té pel sostre de la comarca.",
			"La carena està ocupada avui per un parc eòlic: es camina entre aerogeneradors, per les pistes que hi donen servei. El vessant de l'Urgell és, segons La Ruta del Cister, potser el més boscós de tota la comarca, i la carena fa de mirador sobre la Conca de Barberà. A la mateixa serra hi ha el santuari del Tallat, d'origen gòtic, aixecat on al segle XI hi havia hagut una torre de defensa.",
			'El GR 171 passa pel peu del cim i el GR 175, la Ruta del Cister, uneix per aquí els monestirs de Poblet i de Vallbona de les Monges. Això fa que el tossal es pugui combinar fàcilment amb una visita als monestirs o als pobles de Senan, Montblanquet i Rocallaura.',
			"És una pujada curta i sense dificultat, adequada per fer amb canalla. Amb boira la vista desapareix i els molins són l'única referència; amb vent, el soroll de les pales acompanya tota la caminada."
		],
		es: [
			"El Tossal Gros de Vallbona es el punto más alto de la sierra del Tallat, la cresta que separa [la Conca de Barberà](/comarques/conca-de-barbera) del Urgell. La cima hace de límite entre los términos de l'Espluga de Francolí y de Vallbona de les Monges, y en el Urgell se la tiene por el techo de la comarca.",
			'La cresta está ocupada hoy por un parque eólico: se camina entre aerogeneradores, por las pistas que les dan servicio. La vertiente del Urgell es, según La Ruta del Cister, quizá la más boscosa de toda la comarca, y la cresta hace de mirador sobre la Conca de Barberà. En la misma sierra está el santuario del Tallat, de origen gótico, levantado donde en el siglo XI hubo una torre de defensa.',
			'El GR 171 pasa por el pie de la cima y el GR 175, la Ruta del Cister, une por aquí los monasterios de Poblet y de Vallbona de les Monges. Eso permite combinar fácilmente el tossal con una visita a los monasterios o a los pueblos de Senan, Montblanquet y Rocallaura.',
			'Es una subida corta y sin dificultad, adecuada para hacer con niños. Con niebla la vista desaparece y los molinos son la única referencia; con viento, el ruido de las palas acompaña toda la caminata.'
		]
	},
	rutes: [
		{
			id: 'senan',
			nom: {
				ca: 'Circular des de Senan pel GR 171',
				es: 'Circular desde Senan por el GR 171'
			},
			sortida: { nom: 'Senan (carrer del Portal de Senan)' },
			tecnicitat: 'cap',
			descripcio: {
				ca: "És la volta curta que descriu el bloc Reptes Muntanyencs: 5,6 km, 204 m de desnivell positiu i 1 h 11 min de marxa. De Senan se surt cap al sud-est, es passa un dipòsit d'aigua i es puja per pistes sense complicació, triant a cada cruïlla la que guanya alçada, fins a retrobar el GR 171 al peu del cim; un sender curt hi puja directe. Es torna a Senan sense deixar els senyals blancs i vermells del GR. A Senan s'hi arriba per carretera des de l'Espluga de Francolí o dels Omells de na Gaia.",
				es: "Es la vuelta corta que describe el blog Reptes Muntanyencs: 5,6 km, 204 m de desnivel positivo y 1 h 11 min de marcha. De Senan se sale hacia el sureste, se pasa un depósito de agua y se sube por pistas sin complicación, eligiendo en cada cruce la que gana altura, hasta recuperar el GR 171 al pie de la cima; un sendero corto sube directo. Se vuelve a Senan sin dejar las señales blancas y rojas del GR. A Senan se llega por carretera desde l'Espluga de Francolí o desde els Omells de na Gaia."
			},
			fonts: [REPTES, WIKIPEDIA]
		},
		{
			id: 'pr-c-58',
			nom: {
				ca: 'PR-C 58, la serra del Tallat des de Rocallaura',
				es: 'PR-C 58, la sierra del Tallat desde Rocallaura'
			},
			sortida: { nom: 'Carretera de Rocallaura (Vallbona de les Monges)' },
			descripcio: {
				ca: "Pel costat de l'Urgell, La Ruta del Cister proposa el PR-C 58, una circular de 15,35 km, 3 h 50 min i 424 m de desnivell positiu per la part alta de la serra, amb pas pel santuari del Tallat, Rocallaura i Montblanquet. El Tossal Gros és una derivació d'1,1 km i uns 20 minuts des del sender principal. Tot el recorregut segueix marques blanques i grogues; el santuari queda a una hora de la sortida.",
				es: 'Por el lado del Urgell, La Ruta del Cister propone el PR-C 58, una circular de 15,35 km, 3 h 50 min y 424 m de desnivel positivo por la parte alta de la sierra, con paso por el santuario del Tallat, Rocallaura y Montblanquet. El Tossal Gros es una derivación de 1,1 km y unos 20 minutos desde el sendero principal. Todo el recorrido sigue marcas blancas y amarillas; el santuario queda a una hora de la salida.'
			},
			fonts: [RUTA_CISTER, SURT_DE_CASA]
		}
	],
	consells: {
		ca: [
			"A la pujada des de Senan hi ha moltes cruïlles de pistes del parc eòlic: porta el track o el mapa, perquè amb boira totes s'assemblen.",
			'No baixis pel vessant sud del tossal: és molt dret i no té camí.',
			"No hi ha fonts al recorregut curt: surt de Senan amb l'aigua que necessitis."
		],
		es: [
			'En la subida desde Senan hay muchos cruces de pistas del parque eólico: lleva el track o el mapa, porque con niebla todas se parecen.',
			'No bajes por la vertiente sur del tossal: es muy empinada y no tiene camino.',
			'No hay fuentes en el recorrido corto: sal de Senan con el agua que necesites.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Tossal Gros de Vallbona?',
				resposta:
					"Des de Senan, la circular de 5,6 km i 204 m de desnivell es fa en poc més d'una hora de marxa, segons el bloc Reptes Muntanyencs. Pel PR-C 58, tota la volta de la serra demana 3 h 50 min, més 20 minuts de la derivació al cim."
			},
			{
				pregunta: 'Es pot fer amb nens?',
				resposta:
					'Sí: des de Senan és un recorregut curt per pistes i pel GR 171, sense cap pas difícil.'
			},
			{
				pregunta: "És el sostre de l'Urgell?",
				resposta:
					"La Ruta del Cister el presenta com el cim més alt de la comarca de l'Urgell. El cim és al límit amb la Conca de Barberà, que és on el situa el repte."
			},
			{
				pregunta: 'Compta com a cim essencial?',
				resposta:
					"Sí, és un dels quatre [cims essencials](/cims-essencials) de la Conca de Barberà, amb la [Mola d'Estat](/cims/mola-d-estat), la [Punta del Curull](/cims/punta-del-curull) i [Sant Miquel de Montclar](/cims/sant-miquel-de-montclar)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Tossal Gros de Vallbona?',
				resposta:
					'Desde Senan, la circular de 5,6 km y 204 m de desnivel se hace en poco más de una hora de marcha, según el blog Reptes Muntanyencs. Por el PR-C 58, toda la vuelta de la sierra pide 3 h 50 min, más 20 minutos de la derivación a la cima.'
			},
			{
				pregunta: '¿Se puede hacer con niños?',
				resposta:
					'Sí: desde Senan es un recorrido corto por pistas y por el GR 171, sin ningún paso difícil.'
			},
			{
				pregunta: '¿Es el techo del Urgell?',
				resposta:
					'La Ruta del Cister lo presenta como la cima más alta de la comarca del Urgell. La cima está en el límite con la Conca de Barberà, que es donde la sitúa el reto.'
			},
			{
				pregunta: '¿Cuenta como cima esencial?',
				resposta:
					"Sí, es una de las cuatro [cimas esenciales](/cims-essencials) de la Conca de Barberà, con la [Mola d'Estat](/cims/mola-d-estat), la [Punta del Curull](/cims/punta-del-curull) y [Sant Miquel de Montclar](/cims/sant-miquel-de-montclar)."
			}
		]
	},
	fonts: [WIKIPEDIA, RUTA_CISTER, SURT_DE_CASA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
