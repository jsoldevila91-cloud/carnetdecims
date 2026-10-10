import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Comanegra',
	url: 'https://ca.wikipedia.org/wiki/Comanegra',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: Comanegra des de Beget",
	url: 'https://dexcursio.net/comanegra_beget/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'comanegra',
	descripcio: {
		ca: [
			"El Comanegra és el punt més alt de la [Garrotxa](/comarques/garrotxa), segons la Viquipèdia, i queda al municipi de Montagut i Oix, dins l'àrea protegida de l'Alta Garrotxa. La mateixa font el situa al lloc on es troben tres termes: Montagut i Oix, la Menera, al Vallespir, i Camprodon, al Ripollès. A la zona hi ha també [el Bassegoda](/cims/bassegoda) i [el Puig Ou](/cims/puig-ou), cims essencials de l'Alta Garrotxa.",
			"Al cim hi ha un vèrtex geodèsic i, segons D'excursió per Catalunya, una torre de vigilància. El web parla de vistes de 360 graus sobre el Pirineu, el Canigó, el golf de Roses i les valls garrotxines, i el recomana a la primavera per a la fageda que s'hi puja, un bosc humit i ombrívol.",
			"La pujada més descrita és la circular des de Beget. D'excursió per Catalunya comença a l'aparcament habilitat a l'entrada del poble, puja per un camí que s'enfila de manera decidida pel bosc i torna per un descens que descriu com a molt pronunciat i directe; recomana pals de tresc. El descens inicial del Comanegra, segons el mateix web, no és gaire definit: cal seguir les marques grogues i, per evitar l'últim tram per carretera, estar atent.",
			"Es tracta d'una jornada llarga, amb molt desnivell acumulat. Fora de l'estiu pot haver-hi neu i glaç a la part alta; consulta la predicció i les condicions abans de sortir i no t'hi aventuris amb boira."
		],
		es: [
			'El Comanegra es el punto más alto de la [Garrotxa](/comarques/garrotxa), según la Viquipèdia, y queda en el municipio de Montagut i Oix, dentro del área protegida de la Alta Garrotxa. La misma fuente lo sitúa donde se encuentran tres términos: Montagut i Oix, la Menera, en el Vallespir, y Camprodon, en el Ripollès. En la zona están también [el Bassegoda](/cims/bassegoda) y [el Puig Ou](/cims/puig-ou), cimas esenciales de la Alta Garrotxa.',
			"En la cima hay un vértice geodésico y, según D'excursió per Catalunya, una torre de vigilancia. La web habla de vistas de 360 grados sobre el Pirineo, el Canigó, el golfo de Roses y los valles de la Garrotxa, y lo recomienda en primavera por el hayedo por el que se sube, un bosque húmedo y sombrío.",
			"La subida más descrita es la circular desde Beget. D'excursió per Catalunya empieza en el aparcamiento habilitado a la entrada del pueblo, sube por un camino que se encarama con decisión por el bosque y vuelve por un descenso que describe como muy pronunciado y directo; recomienda bastones. El descenso inicial del Comanegra, según la misma web, no está muy definido: hay que seguir las marcas amarillas y, para evitar el último tramo por carretera, estar atento.",
			'Es una jornada larga, con mucho desnivel acumulado. Fuera del verano puede haber nieve y hielo en la parte alta; consulta la predicción y las condiciones antes de salir y no te aventures con niebla.'
		]
	},
	rutes: [
		{
			id: 'beget',
			nom: {
				ca: 'Circular des de Beget',
				es: 'Circular desde Beget'
			},
			sortida: { nom: "Aparcament habilitat a l'entrada de Beget (Beget)" },
			descripcio: {
				ca: "D'excursió per Catalunya descriu una circular de 18,6 km, +1.415 m i 6 h 30 min en total, que surt i acaba a Beget. El camí s'enfila de manera decidida per un bosc humit i ombrívol; al cim hi ha un vèrtex geodèsic i una torre de vigilància, i el descens inicial no és gaire definit. La baixada és molt pronunciada i directa, i convé seguir les marques grogues. Les xifres són de la circular sencera.",
				es: "D'excursió per Catalunya describe una circular de 18,6 km, +1.415 m y 6 h 30 min en total, que sale y acaba en Beget. El camino se encarama con decisión por un bosque húmedo y sombrío; en la cima hay un vértice geodésico y una torre de vigilancia, y el descenso inicial no está muy definido. La bajada es muy pronunciada y directa, y conviene seguir las marcas amarillas. Las cifras son de la circular entera."
			},
			fonts: [DEXCURSIO]
		}
	],
	consells: {
		ca: [
			"La circular fa 18,6 km i +1.415 m segons D'excursió per Catalunya: planifica-la com una jornada sencera i calcula les hores de llum.",
			'El descens és molt pronunciat i directe: els pals de tresc, que el web recomana, protegeixen els genolls.',
			'El descens inicial no és gaire definit: segueix les marques grogues i, amb boira, no improvisis.',
			"Al final, el web avisa de no perdre l'atenció si vols evitar l'últim tram per carretera.",
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			"La circular tiene 18,6 km y +1.415 m según D'excursió per Catalunya: planifícala como una jornada entera y calcula las horas de luz.",
			'El descenso es muy pronunciado y directo: los bastones, que la web recomienda, protegen las rodillas.',
			'El descenso inicial no está muy definido: sigue las marcas amarillas y, con niebla, no improvises.',
			'Al final, la web avisa de no perder la atención si quieres evitar el último tramo por carretera.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Comanegra?',
				resposta:
					"D'excursió per Catalunya compta 6 h 30 min per a la circular de 18,6 km des de Beget, amb +1.415 m. Són xifres de la volta sencera."
			},
			{
				pregunta: 'És el punt més alt de la Garrotxa?',
				resposta:
					"Sí, segons la Viquipèdia. Queda al municipi de Montagut i Oix, a l'Alta Garrotxa."
			},
			{
				pregunta: 'Calen pals de tresc?',
				resposta:
					"D'excursió per Catalunya els recomana pel descens, que descriu com a molt pronunciat i directe."
			},
			{
				pregunta: 'El Comanegra és un cim essencial?',
				resposta:
					"Sí. A la [Garrotxa](/comarques/garrotxa) l'acompanyen [Cabrera](/cims/cabrera) i [el Puig Ou](/cims/puig-ou)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Comanegra?',
				resposta:
					"D'excursió per Catalunya cuenta 6 h 30 min para la circular de 18,6 km desde Beget, con +1.415 m. Son cifras de la vuelta entera."
			},
			{
				pregunta: '¿Es el punto más alto de la Garrotxa?',
				resposta:
					'Sí, según la Viquipèdia. Queda en el municipio de Montagut i Oix, en la Alta Garrotxa.'
			},
			{
				pregunta: '¿Hacen falta bastones?',
				resposta:
					"D'excursió per Catalunya los recomienda para el descenso, que describe como muy pronunciado y directo."
			},
			{
				pregunta: '¿El Comanegra es una cima esencial?',
				resposta:
					'Sí. En la [Garrotxa](/comarques/garrotxa) lo acompañan [Cabrera](/cims/cabrera) y [el Puig Ou](/cims/puig-ou).'
			}
		]
	},
	fonts: [VIQUIPEDIA, DEXCURSIO],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
