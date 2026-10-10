import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puig Neulós',
	url: 'https://ca.wikipedia.org/wiki/Puig_Neul%C3%B3s',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: Puig Neulós des del castell de Requesens",
	url: 'https://dexcursio.net/puig-neulos/',
	consultat: CONSULTAT
};

const ITINERANNIA = {
	nom: 'Itinerànnia: De Requesens al Puig Neulós, ruta circular',
	url: 'https://www.itinerannia.net/en/routes/from-requesens-to-puig-neulos-circular-route/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-neulos',
	descripcio: {
		ca: [
			"El Puig Neulós és el cim més alt de la serra de l'Albera, a la frontera entre Catalunya i França. Segons la Viquipèdia, el comparteixen els termes de la Jonquera, la Roca d'Albera i Sureda, i separa l'[Alt Empordà](/comarques/alt-emporda) del Rosselló. El catàleg el situa a la Jonquera; a l'Alt Empordà hi ha també [el Roc del Comptador](/cims/roc-del-comptador) i [el Mont](/cims/el-mont).",
			"La carena de l'Albera ha estat límit des de molt abans de la frontera actual: la Viquipèdia recorda que separava els comtats d'Empúries i de Rosselló i que, des del Tractat dels Pirineus, el 1659, divideix Espanya i França. El cim, però, no és un lloc de silenci: hi ha una estació repetidora de senyals de televisió i de ràdio, i la Viquipèdia explica que la Torre d'en Manel, que hi havia des de finals del segle XIX, va ser derruïda per instal·lar-hi una estació de comunicacions i després restituïda.",
			"El nom ve de puig, un cim arrodonit, i de neulós, que la Viquipèdia relaciona amb el francès nébuleux, 'cobert de núvols'. Les dues rutes que recull aquesta fitxa surten del castell de Requesens, a la zona de Cantallops, i fan una circular llarga.",
			"D'excursió per Catalunya situa la sortida a l'aparcament proper al castell de Requesens i parla d'una panoràmica excepcional entre l'Empordà i el Rosselló des del cim. És una ruta de dia sencer: la web dona 5 h 15 min de marxa i recomana aigua abundant, mapa o GPS."
		],
		es: [
			"El Puig Neulós es la cima más alta de la sierra de l'Albera, en la frontera entre Catalunya y Francia. Según la Viquipèdia, lo comparten los términos de la Jonquera, la Roca d'Albera y Sureda, y separa el [Alt Empordà](/comarques/alt-emporda) del Rosselló. El catálogo lo sitúa en la Jonquera; en el Alt Empordà están también [el Roc del Comptador](/cims/roc-del-comptador) y [el Mont](/cims/el-mont).",
			"La cresta de l'Albera ha sido límite desde mucho antes de la frontera actual: la Viquipèdia recuerda que separaba los condados de Empúries y de Rosselló y que, desde el Tratado de los Pirineos, en 1659, divide España y Francia. La cima, sin embargo, no es un lugar de silencio: hay una estación repetidora de señales de televisión y radio, y la Viquipèdia explica que la Torre d'en Manel, que existía desde finales del siglo XIX, fue derribada para instalar una estación de comunicaciones y después restituida.",
			"El nombre viene de puig, una cima redondeada, y de neulós, que la Viquipèdia relaciona con el francés nébuleux, 'cubierto de nubes'. Las dos rutas que recoge esta ficha salen del castillo de Requesens, en la zona de Cantallops, y hacen una circular larga.",
			"D'excursió per Catalunya sitúa la salida en el aparcamiento cercano al castillo de Requesens y habla de una panorámica excepcional entre el Empordà y el Rosselló desde la cima. Es una ruta de día entero: la web da 5 h 15 min de marcha y recomienda agua abundante, mapa o GPS."
		]
	},
	rutes: [
		{
			id: 'requesens',
			nom: {
				ca: 'Circular des del castell de Requesens',
				es: 'Circular desde el castillo de Requesens'
			},
			sortida: { nom: 'Aparcament proper al castell de Requesens (Cantallops)' },
			descripcio: {
				ca: "D'excursió per Catalunya descriu una circular de 16,85 km i 872 m de desnivell positiu, 5 h 15 min en total: pista forestal en bon estat fins al coll del Pou i, des d'allà, l'ascensió final al cim; el descens és un corriol amb marques grogues, poc senyalitzat i una mica amagat. Itinerànnia dona una versió de 16,26 km, 971 m de pujada i 6 h 20 min, amb dificultat alta, que passa per la Mare de Déu de Requesens i baixa per Tanyareda i el coll del Faig. En tots dos casos les xifres són de la circular sencera, no només de la pujada.",
				es: "D'excursió per Catalunya describe una circular de 16,85 km y 872 m de desnivel positivo, 5 h 15 min en total: pista forestal en buen estado hasta el coll del Pou y, desde allí, la ascensión final a la cima; el descenso es un sendero con marcas amarillas, poco señalizado y algo escondido. Itinerànnia da una versión de 16,26 km, 971 m de subida y 6 h 20 min, con dificultad alta, que pasa por la Mare de Déu de Requesens y baja por Tanyareda y el coll del Faig. En ambos casos las cifras son de la circular entera, no solo de la subida."
			},
			fonts: [DEXCURSIO, ITINERANNIA]
		}
	],
	consells: {
		ca: [
			"Segons Itinerànnia, l'accés en cotxe per la pista fins a Requesens no està prohibit, però la porta metàl·lica del camí s'ha de tornar a tancar un cop passada.",
			"D'excursió per Catalunya recomana almenys 1,5 litres d'aigua i un mapa o GPS, sobretot per a la baixada, que està poc senyalitzada.",
			'La circular és llarga i el descens està poc marcat: calcula les hores de llum abans de sortir.',
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'Según Itinerànnia, el acceso en coche por la pista hasta Requesens no está prohibido, pero la puerta metálica del camino hay que volver a cerrarla una vez pasada.',
			"D'excursió per Catalunya recomienda al menos 1,5 litros de agua y un mapa o GPS, sobre todo para la bajada, que está poco señalizada.",
			'La circular es larga y el descenso está poco marcado: calcula las horas de luz antes de salir.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puig Neulós?',
				resposta:
					"La circular des del castell de Requesens té 5 h 15 min segons D'excursió per Catalunya (16,85 km, 872 m de desnivell positiu) i 6 h 20 min segons Itinerànnia (16,26 km, 971 m). Són xifres de tota la volta."
			},
			{
				pregunta: 'Es pot pujar al Puig Neulós amb cotxe?',
				resposta:
					"Segons la Viquipèdia, des del vessant francès hi ha una carretera asfaltada fins a l'estació repetidora, però a partir del coll de l'Ullat és d'ús restringit. Des de Requesens, la pista no està prohibida segons Itinerànnia, amb la porta que cal tancar."
			},
			{
				pregunta: 'Què hi ha al cim del Puig Neulós?',
				resposta:
					"Hi ha una estació repetidora de televisió i de ràdio, segons la Viquipèdia, que també explica la història de la Torre d'en Manel."
			},
			{
				pregunta: 'El Puig Neulós és un cim essencial?',
				resposta:
					"Sí. Dins l'[Alt Empordà](/comarques/alt-emporda) tens també [el Roc del Comptador](/cims/roc-del-comptador) i [el Mont](/cims/el-mont)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puig Neulós?',
				resposta:
					"La circular desde el castillo de Requesens tiene 5 h 15 min según D'excursió per Catalunya (16,85 km, 872 m de desnivel positivo) y 6 h 20 min según Itinerànnia (16,26 km, 971 m). Son cifras de toda la vuelta."
			},
			{
				pregunta: '¿Se puede subir al Puig Neulós en coche?',
				resposta:
					"Según la Viquipèdia, desde la vertiente francesa hay una carretera asfaltada hasta la estación repetidora, pero a partir del coll de l'Ullat es de uso restringido. Desde Requesens, la pista no está prohibida según Itinerànnia, con la puerta que hay que cerrar."
			},
			{
				pregunta: '¿Qué hay en la cima del Puig Neulós?',
				resposta:
					"Hay una estación repetidora de televisión y radio, según la Viquipèdia, que también explica la historia de la Torre d'en Manel."
			},
			{
				pregunta: '¿El Puig Neulós es una cima esencial?',
				resposta:
					'Sí. Dentro del [Alt Empordà](/comarques/alt-emporda) tienes también [el Roc del Comptador](/cims/roc-del-comptador) y [el Mont](/cims/el-mont).'
			}
		]
	},
	fonts: [VIQUIPEDIA, DEXCURSIO, ITINERANNIA],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
