import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const RUTES_PIRINEUS = {
	nom: 'Rutes Pirineus: Ruta a la Rocallarga als cingles de Tavertet, Collsacabra',
	url: 'https://www.rutespirineus.cat/rutes/volta-de-la-rocallarga-tavertet-collsacabra',
	consultat: CONSULTAT
};

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Rocallarga',
	url: 'https://ca.wikipedia.org/wiki/Rocallarga',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'rocallarga',
	descripcio: {
		ca: [
			"La Rocallarga és el punt culminant dels altiplans de Tavertet, al Collsacabra, dins del terme de Tavertet ([Osona](/comarques/osona)). No és un cim punxegut, sinó el capdamunt d'una carena ampla, de conglomerat, gres i argila segons la Viquipèdia, a tocar dels cingles de Tavertet. L'altre cim essencial del Collsacabra és [Cabrera](/cims/cabrera); a la mateixa comarca hi ha també [Bellmunt](/cims/bellmunt).",
			"El que la fa especial és el que es veu pel camí. La volta que proposa Rutes Pirineus passa per l'ermita romànica de Sant Corneli, que té un dolmen al costat nord, per masies com Rajols i Monteis i, ja a prop del cim, per la balma de Cortils, una gran roca plana que fa de sostre, amb un faig enorme a tocar. Al cim hi ha un vèrtex geodèsic.",
			'Tot i la poca alçada, Rutes Pirineus en diu una de les millors panoràmiques de la contrada: del Mediterrani a Montserrat, passant pel Montseny i les Guilleries.',
			"Es pot fer tot l'any. A l'estiu la calor pot ser sufocant, segons la mateixa guia, i no hi ha cap font en tota la volta; amb boira, en uns altiplans de prats sense senyals, és fàcil desorientar-se."
		],
		es: [
			'La Rocallarga es el punto culminante de los altiplanos de Tavertet, en el Collsacabra, dentro del término de Tavertet ([Osona](/comarques/osona)). No es una cima puntiaguda, sino lo alto de una loma ancha, de conglomerado, arenisca y arcilla según la Viquipèdia, junto a los cingles de Tavertet. La otra cima esencial del Collsacabra es [Cabrera](/cims/cabrera); en la misma comarca está también [Bellmunt](/cims/bellmunt).',
			'Lo que la hace especial es lo que se ve por el camino. La vuelta que propone Rutes Pirineus pasa por la ermita románica de Sant Corneli, que tiene un dolmen en el lado norte, por masías como Rajols y Monteis y, ya cerca de la cima, por la balma de Cortils, una gran roca plana que hace de techo, con un haya enorme al lado. En la cima hay un vértice geodésico.',
			'Pese a la poca altura, Rutes Pirineus la considera una de las mejores panorámicas de la zona: del Mediterráneo a Montserrat, pasando por el Montseny y las Guilleries.',
			'Se puede hacer todo el año. En verano el calor puede ser sofocante, según la misma guía, y no hay ninguna fuente en toda la vuelta; con niebla, en unos altiplanos de prados sin señales, es fácil desorientarse.'
		]
	},
	rutes: [
		{
			id: 'avenc',
			nom: {
				ca: "Des de l'Avenc de Tavertet pel collet de Rajols",
				es: "Desde l'Avenc de Tavertet por el collet de Rajols"
			},
			sortida: { nom: "Apartotel l'Avenc de Tavertet (Tavertet, 1.033 m)" },
			tempsMinuts: 70,
			tecnicitat: 'cap',
			descripcio: {
				ca: "Rutes Pirineus la inclou dins d'una circular de 14,7 km, 550 m de desnivell acumulat i 5 h 30 min que fa una gran volta per Sant Corneli abans de pujar al cim, on arriba a les 4 h 45 min. Qui només vulgui fer la Rocallarga pot enllaçar-ne dos trams: de l'Avenc al collet de Rajols per la pista i la masia de Rajols (50 min) i del collet al cim per la carena, passant per la balma de Cortils (20 min). La baixada directa a l'Avenc, per un corriol que arrenca d'una gran fita i una pista de desembosc, són 45 min. La guia diu que la ruta no té cap dificultat tècnica, però que només està senyalitzada en part.",
				es: "Rutes Pirineus la incluye dentro de una circular de 14,7 km, 550 m de desnivel acumulado y 5 h 30 min que da una gran vuelta por Sant Corneli antes de subir a la cima, adonde llega a las 4 h 45 min. Quien solo quiera hacer la Rocallarga puede enlazar dos tramos: de l'Avenc al collet de Rajols por la pista y la masía de Rajols (50 min) y del collado a la cima por la loma, pasando por la balma de Cortils (20 min). La bajada directa a l'Avenc, por un sendero que arranca de un gran hito y una pista de saca, son 45 min. La guía dice que la ruta no tiene ninguna dificultad técnica, pero que solo está señalizada en parte."
			},
			fonts: [RUTES_PIRINEUS]
		}
	],
	consells: {
		ca: [
			'No trobaràs aigua en tot el recorregut, segons Rutes Pirineus: surt de Tavertet amb la que necessitis.',
			'La senyalització és parcial i hi ha trams de prat sense fites: porta el mapa del Collsacabra i la vall de Sau a 1:25.000, que és el que recomana la guia, o un track.',
			"Per baixar del cim, busca la gran fita que marca l'inici del corriol cap a l'Avenc; si no la veus, no tiris pel dret cap als cingles.",
			'El camí travessa pastures amb tanques per al bestiar: tanca-les darrere teu.',
			"Si fas la volta sencera per Sant Corneli, compta-hi cinc hores i mitja de marxa efectiva i surt d'hora els dies curts."
		],
		es: [
			'No encontrarás agua en todo el recorrido, según Rutes Pirineus: sal de Tavertet con la que necesites.',
			'La señalización es parcial y hay tramos de prado sin hitos: lleva el mapa del Collsacabra y la vall de Sau a 1:25.000, que es el que recomienda la guía, o un track.',
			"Para bajar de la cima, busca el gran hito que marca el inicio del sendero hacia l'Avenc; si no lo ves, no atajes hacia los cingles.",
			'El camino atraviesa pastos con cercas para el ganado: ciérralas detrás de ti.',
			'Si haces la vuelta entera por Sant Corneli, cuenta cinco horas y media de marcha efectiva y sal temprano en los días cortos.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Rocallarga?',
				resposta:
					"Pel camí més directe des de l'Avenc de Tavertet, els horaris de Rutes Pirineus sumen 1 h 10 min de pujada (50 min fins al collet de Rajols i 20 min més fins al cim) i 45 min de baixada. La volta completa per Sant Corneli són 14,7 km i 5 h 30 min."
			},
			{
				pregunta: 'La Rocallarga és difícil?',
				resposta:
					"No té cap dificultat tècnica, segons Rutes Pirineus, que valora de notable la volta sencera només per la llargada i el desnivell. El que demana atenció és l'orientació, perquè la senyalització és parcial."
			},
			{
				pregunta: 'Hi ha aigua pel camí?',
				resposta:
					"No. Rutes Pirineus avisa que no se'n troba en tota l'excursió i que a l'estiu la calor pot ser sufocant."
			},
			{
				pregunta: 'Què és la balma de Cortils?',
				resposta:
					'Una cavitat sota una gran roca plana, a dos minuts escassos del cim venint del collet de Rajols. Rutes Pirineus hi destaca un faig de grans dimensions al costat.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Rocallarga?',
				resposta:
					"Por el camino más directo desde l'Avenc de Tavertet, los horarios de Rutes Pirineus suman 1 h 10 min de subida (50 min hasta el collet de Rajols y 20 min más hasta la cima) y 45 min de bajada. La vuelta completa por Sant Corneli son 14,7 km y 5 h 30 min."
			},
			{
				pregunta: '¿La Rocallarga es difícil?',
				resposta:
					'No tiene ninguna dificultad técnica, según Rutes Pirineus, que valora de notable la vuelta entera solo por la longitud y el desnivel. Lo que pide atención es la orientación, porque la señalización es parcial.'
			},
			{
				pregunta: '¿Hay agua por el camino?',
				resposta:
					'No. Rutes Pirineus avisa de que no se encuentra en toda la excursión y de que en verano el calor puede ser sofocante.'
			},
			{
				pregunta: '¿Qué es la balma de Cortils?',
				resposta:
					'Una cavidad bajo una gran roca plana, a dos minutos escasos de la cima viniendo del collet de Rajols. Rutes Pirineus destaca un haya de grandes dimensiones a su lado.'
			}
		]
	},
	fonts: [RUTES_PIRINEUS, VIQUIPEDIA],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
