import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA_SERRA = {
	nom: 'Viquipèdia: Serra de Llaberia',
	url: 'https://ca.wikipedia.org/wiki/Serra_de_Llaberia',
	consultat: CONSULTAT
};

const CONSORCI_GEOLOGIA = {
	nom: 'Consorci de la Serra de Llaberia: geologia',
	url: 'https://www.serrallaberia.org/geologia',
	consultat: CONSULTAT
};

const TRES_CAT = {
	nom: '3Cat: Caminada de descoberta per Llaberia, la muntanya perduda a tocar de la costa',
	url: 'https://www.3cat.cat/3catinfo/caminada-de-descoberta-per-llaberia-la-muntanya-perduda-a-tocar-de-la-costa/noticia-amp/3414288/',
	consultat: CONSULTAT
};

const CESC = {
	nom: 'Centre Excursionista de Sant Celoni: sortida «La Mola de Colldejou i la Serra de Llaberia» (22 de març del 2015)',
	url: 'https://santceloni.cat/ARXIUS/agenda/2015/20150322_MUNTANYA.pdf',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Cavall Bernat de Llaberia',
	url: 'https://reptesmuntanyencs.cat/cavall-bernat-de-llaberia/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'cavall-bernat-de-llaberia',
	descripcio: {
		ca: [
			"El Cavall Bernat de Llaberia és un penyal de la serra de Llaberia, sobre Colldejou i Pratdip, [al Baix Camp](/comarques/baix-camp). La serra s'allarga entre les Muntanyes de Prades i les de Tivissa-Vandellòs i es reconeix pels cingles calcaris, clars i molt regulars, que tallen de cop uns relleus plans al capdamunt. El punt més alt és la Miranda, amb el radar del Servei Meteorològic de Catalunya; el Cavall Bernat queda a l'altre extrem de la carena, passat el Mont-redon.",
			"El Consorci de la Serra de Llaberia explica que a la serra abunden els monòlits i les agulles, fruit de l'erosió càrstica, i que la gent els anomena «cavall bernat»: aquest és el que ha entrat a la llista del repte. El mateix Consorci remarca el valor geològic del conjunt, inclòs a l'inventari d'espais d'interès geològic de Catalunya per un sistema d'encavalcaments i falles inverses que forma klippes de dimensions quilomètriques. L'espai és al PEIN des del Decret 328/1992 i el Consorci, creat el 2004, en gestiona la conservació.",
			'A diferència de la veïna [Mola de Colldejou](/cims/mola-de-colldejou), aquí el camí no arriba al cim. El Centre Excursionista de Sant Celoni, que hi va passar en una travessa de la carena, deixava la pujada final com a opcional perquè cal superar una canal forta i un darrer tram de grimpada de segon grau. És, per tant, un cim per a gent avesada a posar les mans a la roca, i no una excursió per a tothom.',
			"Des de la carena es veu tota la costa de Tarragona a llevant, la serra de l'Argentera i el Priorat a ponent i els Ports i la Terra Alta cap al sud. És un lloc ventós: a les planes de dalt el vent pot arribar a destorbar la marxa, i amb vent fort o roca molla la grimpada final no s'ha de fer."
		],
		es: [
			'El Cavall Bernat de Llaberia es un peñasco de la sierra de Llaberia, sobre Colldejou y Pratdip, [en el Baix Camp](/comarques/baix-camp). La sierra se alarga entre las Muntanyes de Prades y las de Tivissa-Vandellòs y se reconoce por sus riscos calizos, claros y muy regulares, que cortan de golpe unos relieves llanos en lo alto. El punto más alto es la Miranda, con el radar del Servei Meteorològic de Catalunya; el Cavall Bernat queda en el otro extremo de la cresta, pasado el Mont-redon.',
			'El Consorci de la Serra de Llaberia explica que en la sierra abundan los monolitos y las agujas, fruto de la erosión kárstica, y que la gente los llama «cavall bernat»: este es el que ha entrado en la lista del reto. El mismo Consorci subraya el valor geológico del conjunto, incluido en el inventario de espacios de interés geológico de Catalunya por un sistema de cabalgamientos y fallas inversas que forma klippes de dimensiones kilométricas. El espacio está en el PEIN desde el Decreto 328/1992 y el Consorci, creado en 2004, gestiona su conservación.',
			'A diferencia de la vecina [Mola de Colldejou](/cims/mola-de-colldejou), aquí el camino no llega a la cima. El Centre Excursionista de Sant Celoni, que pasó por allí en una travesía de la cresta, dejaba la subida final como opcional porque hay que superar una canal fuerte y un último tramo de trepada de segundo grado. Es, por tanto, una cima para gente acostumbrada a poner las manos en la roca, y no una excursión para todo el mundo.',
			"Desde la cresta se ve toda la costa de Tarragona a levante, la sierra de l'Argentera y el Priorat a poniente y los Ports y la Terra Alta hacia el sur. Es un lugar ventoso: en los llanos de arriba el viento puede llegar a estorbar la marcha, y con viento fuerte o roca mojada la trepada final no debe hacerse."
		]
	},
	rutes: [
		{
			id: 'colldejou-circular',
			nom: {
				ca: 'Circular des de Colldejou pel camí del Recingle',
				es: 'Circular desde Colldejou por el camí del Recingle'
			},
			sortida: { nom: 'Aparcament de la zona esportiva de Colldejou' },
			tecnicitat: 'grimpada',
			descripcio: {
				ca: "El bloc Reptes Muntanyencs hi va pujar el 2016 amb una circular d'11,8 km i 618 m de desnivell positiu (3 h 47 min de marxa): surt de Colldejou, enllaça amb el GR 7, puja per una tartera i la canal del Racó dels Frares fins al camí del Recingle, marcat amb pintura blava, i arriba al peu del penyal pel portell de la Roca Mitjanera; el cim queda a 7,2 km de la sortida. El tram final té dos passos: una canal estreta, on hi havia una cadena, i una fissura de dos o tres metres, vertical i una mica desplomada al capdamunt. El Centre Excursionista de Sant Celoni la gradua de segon grau. Es desgrimpa pel mateix lloc i es torna a Colldejou per la Foradada i el PR-C 96.",
				es: 'El blog Reptes Muntanyencs subió en 2016 con una circular de 11,8 km y 618 m de desnivel positivo (3 h 47 min de marcha): sale de Colldejou, enlaza con el GR 7, sube por una pedrera y la canal del Racó dels Frares hasta el camí del Recingle, marcado con pintura azul, y llega al pie del peñasco por el portell de la Roca Mitjanera; la cima queda a 7,2 km de la salida. El tramo final tiene dos pasos: una canal estrecha, donde había una cadena, y una fisura de dos o tres metros, vertical y algo desplomada en lo alto. El Centre Excursionista de Sant Celoni la gradúa de segundo grado. Se destrepa por el mismo sitio y se vuelve a Colldejou por la Foradada y el PR-C 96.'
			},
			fonts: [REPTES, CESC]
		},
		{
			id: 'carena-de-llaberia',
			nom: {
				ca: 'Travessa de la carena des de la Mola de Colldejou',
				es: 'Travesía de la cresta desde la Mola de Colldejou'
			},
			sortida: { nom: 'Colldejou' },
			tecnicitat: 'grimpada',
			descripcio: {
				ca: 'La sortida del Centre Excursionista de Sant Celoni del 2015 encadenava els dos cims del repte: de Colldejou a la Mola pel GR 7 i el GR 7-3, baixada al coll del Guix, pujada al portell de Llaberia i carena, sense camí, per la Miranda, la Creu de Llaberia i el Mont-redon fins al Cavall Bernat, amb tornada pel coll dels Covaldissos i el camí ral de Colldejou a Pratdip. El club hi comptava 18 km, uns 1.200 m de desnivell i de 8 a 9 hores per a tota la volta, sense cap dificultat tècnica fora de la pujada final al Cavall Bernat: «una forta canal i un últim tram de grimpada de 2n».',
				es: 'La salida del Centre Excursionista de Sant Celoni de 2015 encadenaba las dos cimas del reto: de Colldejou a la Mola por el GR 7 y el GR 7-3, bajada al coll del Guix, subida al portell de Llaberia y cresta, sin camino, por la Miranda, la Creu de Llaberia y el Mont-redon hasta el Cavall Bernat, con regreso por el coll dels Covaldissos y el camino real de Colldejou a Pratdip. El club contaba 18 km, unos 1.200 m de desnivel y de 8 a 9 horas para toda la vuelta, sin ninguna dificultad técnica fuera de la subida final al Cavall Bernat: «una fuerte canal y un último tramo de trepada de 2.º».'
			},
			fonts: [CESC]
		}
	],
	consells: {
		ca: [
			"Els últims metres són una grimpada de segon grau, amb un pas vertical de dos o tres metres que després s'ha de desgrimpar. Si no hi tens experiència, vés-hi amb algú que en tingui i que pugui assegurar-te, o queda't al peu del penyal.",
			"No t'hi posis amb la roca molla ni amb vent fort, i millor no anar-hi sol; en cas d'accident, el telèfon és el 112.",
			'La cadena de la canal és un equipament que el bloc va trobar el 2016: no donis per fet que hi sigui ni que estigui en bon estat.',
			"A la tartera i la canal de sota el Recingle les fites són escasses i hi ha traces que enganyen; si et trobes en terreny exposat, t'has desviat. L'alternativa és pujar pel GR 7 fins al coll del Guix.",
			"A la travessa de la carena, el club demanava frontal, roba d'abric i aigua per a tot el dia."
		],
		es: [
			'Los últimos metros son una trepada de segundo grado, con un paso vertical de dos o tres metros que después hay que destrepar. Si no tienes experiencia, ve con alguien que la tenga y que pueda asegurarte, o quédate al pie del peñasco.',
			'No te metas con la roca mojada ni con viento fuerte, y mejor no ir solo; en caso de accidente, el teléfono es el 112.',
			'La cadena de la canal es un equipamiento que el blog encontró en 2016: no des por hecho que siga allí ni que esté en buen estado.',
			'En la pedrera y la canal de debajo del Recingle los hitos son escasos y hay trazas que engañan; si te ves en terreno expuesto, te has desviado. La alternativa es subir por el GR 7 hasta el coll del Guix.',
			'En la travesía de la cresta, el club pedía frontal, ropa de abrigo y agua para todo el día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Cal grimpar per pujar al Cavall Bernat de Llaberia?',
				resposta:
					'Sí. El camí arriba al peu del penyal i, per fer el cim, cal superar una canal i un tram final de grimpada de segon grau, amb un pas de dos o tres metres vertical. No és un cim de camí.'
			},
			{
				pregunta: 'Quant es triga?',
				resposta:
					'La circular des de Colldejou pel camí del Recingle fa 11,8 km i 618 m de desnivell, amb 3 h 47 min de marxa segons el bloc Reptes Muntanyencs. La travessa de tota la carena des de la Mola de Colldejou, de 18 km, demana de 8 a 9 hores.'
			},
			{
				pregunta: 'Per què es diu Cavall Bernat?',
				resposta:
					"A la serra de Llaberia s'anomenen popularment «cavall bernat» els monòlits i les agulles que l'erosió càrstica ha deixat aïllats, segons el Consorci de la Serra de Llaberia."
			},
			{
				pregunta: 'Es pot combinar amb la Mola de Colldejou?',
				resposta:
					'Sí, seguint la carena per la Miranda, però és una jornada llarga. A la mateixa zona hi ha el [Puig de la Cabrafiga](/cims/puig-de-la-cabrafiga), un altre cim essencial del Baix Camp.'
			}
		],
		es: [
			{
				pregunta: '¿Hay que trepar para subir al Cavall Bernat de Llaberia?',
				resposta:
					'Sí. El camino llega al pie del peñasco y, para hacer cima, hay que superar una canal y un tramo final de trepada de segundo grado, con un paso de dos o tres metros vertical. No es una cima de camino.'
			},
			{
				pregunta: '¿Cuánto se tarda?',
				resposta:
					'La circular desde Colldejou por el camí del Recingle tiene 11,8 km y 618 m de desnivel, con 3 h 47 min de marcha según el blog Reptes Muntanyencs. La travesía de toda la cresta desde la Mola de Colldejou, de 18 km, pide de 8 a 9 horas.'
			},
			{
				pregunta: '¿Por qué se llama Cavall Bernat?',
				resposta:
					'En la sierra de Llaberia se llaman popularmente «cavall bernat» los monolitos y las agujas que la erosión kárstica ha dejado aislados, según el Consorci de la Serra de Llaberia.'
			},
			{
				pregunta: '¿Se puede combinar con la Mola de Colldejou?',
				resposta:
					'Sí, siguiendo la cresta por la Miranda, pero es una jornada larga. En la misma zona está el [Puig de la Cabrafiga](/cims/puig-de-la-cabrafiga), otra cima esencial del Baix Camp.'
			}
		]
	},
	fonts: [VIQUIPEDIA_SERRA, CONSORCI_GEOLOGIA, TRES_CAT, CESC, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
