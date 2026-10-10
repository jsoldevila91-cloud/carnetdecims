import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const REPTES = {
	nom: 'Reptes Muntanyencs: El Corronco (Boí-Taüll)',
	url: 'https://reptesmuntanyencs.cat/es/el-corronco-2/',
	consultat: CONSULTAT
};

const REPTES_CERVI = {
	nom: 'Reptes Muntanyencs: Pica de Cerví',
	url: 'https://reptesmuntanyencs.cat/pica-de-cervi/',
	consultat: CONSULTAT
};

const VIQUIPEDIA_CERVI = {
	nom: 'Viquipèdia: Pica de Cerví',
	url: 'https://ca.wikipedia.org/wiki/Pica_de_Cerv%C3%AD',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'el-corronco',
	descripcio: {
		ca: [
			"El Corronco (oficialment, lo Corronco) és un cim de la Vall de Boí, a [l'Alta Ribagorça](/comarques/alta-ribagorca), que s'alça a ponent de l'estació d'esquí de Boí-Taüll. No és un tuc aïllat: és l'extrem d'una carena llarga que, venint de l'estació, obliga a passar abans per cims més alts, com la Pica Cerví de Durro i el Cap dels Vedats d'Erta, també anomenat Pica Cerví d'Erill. Aquest és el que dona caràcter a l'excursió: el Corronco, amb 2.543 m, és l'objectiu del dia, però no el punt més alt del recorregut.",
			"Entre el port d'Erta i el coll de Comaportell la carena és pelada i pedregosa; del coll al Corronco predomina l'herba, amb descensos «atarterats», segons Reptes Muntanyencs. A la carena no hi ha camí clar. L'autor baixa pel vessant nord, a tocar del tall de les Raspes del Corronco, cap als clots Navarsals; a partir d'aquí el corriol desapareix, sembla que per esllavissades, i cal flanquejar sense perdre alçada.",
			"Reptes Muntanyencs considera el Cap dels Vedats d'Erta un bon mirador: al sud hi situa Montserrat, el Montsec i Mont-rebei; al nord-oest, la Maladeta i el [Tuc de Molières](/cims/tuc-de-molieres), i al nord, el Besiberri i el [Comaloforno](/cims/pic-de-comaloforno). Des del mateix Corronco es veu Durro i l'embassament d'Escales.",
			"L'itinerari és una jornada llarga i sense senyalitzar. Amb neu o en condicions d'hivern, l'autor avisa que la situació pot ser molt diferent de la que va trobar al juny de 2012, quan no va veure dificultats tècniques."
		],
		es: [
			'El Corronco (oficialmente, lo Corronco) es una cima de la Vall de Boí, en la [Alta Ribagorça](/comarques/alta-ribagorca), que se alza a poniente de la estación de esquí de Boí-Taüll. No es un tuc aislado: es el extremo de una cresta larga que, viniendo de la estación, obliga a pasar antes por cimas más altas, como la Pica Cerví de Durro y el Cap dels Vedats d’Erta, también llamado Pica Cerví d’Erill. Eso es lo que da carácter a la excursión: el Corronco, con 2.543 m, es el objetivo del día, pero no el punto más alto del recorrido.',
			'Entre el port d’Erta y el coll de Comaportell la cresta es pelada y pedregosa; del collado al Corronco predomina la hierba, con descensos «atarterados», según Reptes Muntanyencs. En la cresta no hay camino claro. El autor baja por la vertiente norte, junto al corte de las Raspes del Corronco, hacia los clots Navarsals; a partir de ahí la senda desaparece, al parecer por deslizamientos, y hay que flanquear sin perder altura.',
			'Reptes Muntanyencs considera el Cap dels Vedats d’Erta un buen mirador: al sur sitúa Montserrat, el Montsec y Mont-rebei; al noroeste, la Maladeta y el [Tuc de Molières](/cims/tuc-de-molieres), y al norte, el Besiberri y el [Comaloforno](/cims/pic-de-comaloforno). Desde el propio Corronco se ve Durro y el embalse de Escales.',
			'El itinerario es una jornada larga y sin señalizar. Con nieve o en condiciones de invierno, el autor avisa de que la situación puede ser muy distinta de la que encontró en junio de 2012, cuando no vio dificultades técnicas.'
		]
	},
	rutes: [
		{
			id: 'boi-taull',
			nom: {
				ca: "Circular des de l'estació de Boí-Taüll per la carena sud",
				es: 'Circular desde la estación de Boí-Taüll por la cresta sur'
			},
			sortida: { nom: "Aparcament de l'estació d'esquí de Boí-Taüll (Vall de Boí)" },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Reptes Muntanyencs surt de l'aparcament de l'estació, pujant per les pistes en direcció sud i seguint una pista forestal que remunta al port d'Erta. D'allà gira cap a ponent per la carena, supera la Pica Cerví de Durro i continua cap al nord-oest fins al Corronco, amb unes 3 h 35 min de pujada, aturades incloses, segons la taula de la ressenya. Les trepades curtes i un parell de passos complicats a la carena són el punt més exigent; no hi ha cap senyalització. La volta sencera fa 17,7 km i 1.383 m de desnivell, en uns 5 h 51 min de marxa i 1 h 4 min d'aturades.",
				es: 'Reptes Muntanyencs sale del aparcamiento de la estación, subiendo por las pistas en dirección sur y siguiendo una pista forestal que remonta hasta el port d’Erta. Desde allí gira hacia poniente por la cresta, supera la Pica Cerví de Durro y continúa hacia el noroeste hasta el Corronco, con unas 3 h 35 min de subida, paradas incluidas, según la tabla de la reseña. Las trepadas cortas y un par de pasos complicados en la cresta son lo más exigente; no hay ninguna señalización. La vuelta entera hace 17,7 km y 1.383 m de desnivel, en unas 5 h 51 min de marcha y 1 h 4 min de paradas.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'Porta aigua de sobra: segons Reptes Muntanyencs, no hi ha cap font en tot el recorregut.',
			"Hi pots arribar en cotxe normal per carretera asfaltada fins a l'aparcament de l'estació, però la ruta és sense senyalitzar i, un cop a la carena, el camí desapareix: no la facis amb boira.",
			'A la baixada, passats els clots Navarsals, el corriol es perd: Reptes Muntanyencs recomana flanquejar sense perdre alçada. Porta el track al mòbil o al GPS.',
			"Surt d'hora i comprova la previsió: la carena és llarga i oberta, i a l'estiu convé baixar abans de les tempestes de tarda.",
			"Si hi vas amb neu, no et refiïs de la descripció d'estiu: l'autor adverteix que les condicions poden ser molt diferents."
		],
		es: [
			'Lleva agua de sobra: según Reptes Muntanyencs, no hay ninguna fuente en todo el recorrido.',
			'Puedes llegar en coche normal por carretera asfaltada hasta el aparcamiento de la estación, pero la ruta no está señalizada y, una vez en la cresta, el camino desaparece: no la hagas con niebla.',
			'En la bajada, pasados los clots Navarsals, la senda se pierde: Reptes Muntanyencs recomienda flanquear sin perder altura. Lleva el track en el móvil o el GPS.',
			'Sal temprano y comprueba la previsión: la cresta es larga y abierta, y en verano conviene bajar antes de las tormentas de tarde.',
			'Si vas con nieve, no te fíes de la descripción de verano: el autor advierte de que las condiciones pueden ser muy distintas.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Corronco?',
				resposta:
					"Segons la ressenya de Reptes Muntanyencs, unes 3 h 35 min fins al cim des de l'aparcament de Boí-Taüll, aturades incloses. La volta circular sencera, 17,7 km i 1.383 m de desnivell, suma 5 h 51 min caminant."
			},
			{
				pregunta: 'El Corronco té passos difícils?',
				resposta:
					"Reptes Muntanyencs esmenta trepades curtes i un parell de passos complicats a la carena, que amb les precaucions normals no han de preocupar. No hi va trobar dificultats tècniques al juny, però la navegació sense camí i el pedregam fan l'excursió exigent."
			},
			{
				pregunta: 'Es pot enllaçar amb la Pica de Cerví?',
				resposta:
					"La [Pica de Cerví](/cims/pica-de-cervi), cim essencial del Pallars Jussà, s'alça uns quilòmetres al sud-est, però és una altra ruta: Reptes Muntanyencs la fa sortint de la cabana del Carant, a Erta."
			},
			{
				pregunta: 'El Corronco compta com a cim essencial?',
				resposta:
					"Sí, és un dels sis [cims essencials](/cims-essencials) de l'Alta Ribagorça. Amb 2.543 m és el tercer més baix, per sobre només de la [Pala del Teller](/cims/pala-del-teller) i del [Tossal de les Roies de Cardet](/cims/tossal-de-les-roies-de-cardet)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Corronco?',
				resposta:
					'Según la reseña de Reptes Muntanyencs, unas 3 h 35 min hasta la cima desde el aparcamiento de Boí-Taüll, paradas incluidas. La vuelta circular entera, 17,7 km y 1.383 m de desnivel, suma 5 h 51 min andando.'
			},
			{
				pregunta: '¿El Corronco tiene pasos difíciles?',
				resposta:
					'Reptes Muntanyencs menciona trepadas cortas y un par de pasos complicados en la cresta, que con las precauciones normales no deben preocupar. No encontró dificultades técnicas en junio, pero la navegación sin camino y la pedrera hacen la excursión exigente.'
			},
			{
				pregunta: '¿Se puede enlazar con la Pica de Cerví?',
				resposta:
					'La [Pica de Cerví](/cims/pica-de-cervi), cima esencial del Pallars Jussà, se alza unos kilómetros al sureste, pero es otra ruta: Reptes Muntanyencs la hace saliendo de la cabaña del Carant, en Erta.'
			},
			{
				pregunta: '¿El Corronco cuenta como cima esencial?',
				resposta:
					'Sí, es una de las seis [cimas esenciales](/cims-essencials) de la Alta Ribagorça. Con 2.543 m es el tercero más bajo, por encima solo de la [Pala del Teller](/cims/pala-del-teller) y del [Tossal de les Roies de Cardet](/cims/tossal-de-les-roies-de-cardet).'
			}
		]
	},
	fonts: [REPTES, REPTES_CERVI, VIQUIPEDIA_CERVI],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
