import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: la Muga (Lles de Cerdanya)',
	url: 'https://ca.wikipedia.org/wiki/La_Muga_(Lles_de_Cerdanya)',
	consultat: CONSULTAT
};

const ENGARRISTA = {
	nom: 'Engarrista: la Muga, Tosseta de Vallcivera i Tossa Plana de Lles',
	url: 'https://www.engarrista.com/node/347',
	consultat: CONSULTAT
};

const ESPORTPEDIA_CAP_DEL_REC = {
	nom: 'Enciclopèdia (Esportpedia): refugi de Cap del Rec',
	url: 'https://www.enciclopedia.cat/esportpedia/refugi-de-cap-del-rec',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'la-muga',
	descripcio: {
		ca: [
			"La Muga és un cim del municipi de Lles de Cerdanya, a [la Cerdanya](/comarques/cerdanya), dins de l'espai protegit de la Tossa Plana de Lles-Puigpedrós. La roca és una granodiorita. Amb una prominència de només 143 m, és més aviat un punt alt d'una carena que un cim aïllat: per la banda oest enllaça amb la Mugueta, la Tosseta de Vallcivera i la Tossa Plana de Lles.",
			"Als seus peus hi ha els estanys de la Muga, per on passa la pujada des del Cap del Rec. Al vessant est, la vall de la Llosa, que arrenca a Cal Jan de la Llosa, és el camí del GR-107 o Camí dels Bons Homes fins a la Portella Blanca, i hi queden les restes del castell de la Llosa, que controlava el pas cap a Andorra i l'Arieja.",
			"Engarrista, que hi va pujar per la vall de la Llosa, destaca des de la carena els cims del nord-est d'Andorra i el cim i els llacs de Montmalús, i, des de la [Tossa Plana de Lles](/cims/tossa-plana-de-lles), el Cadí. A l'est, a l'altra banda de la vall de la Llosa, s'alça el [Puigpedrós](/cims/puigpedros), el sostre de la comarca.",
			"És una sortida d'estiu i de tardor: quan Engarrista hi va pujar, un 22 de maig, els estanys encara tenien gel. A l'hivern la pujada demana grampons i piolet, i un lector de la mateixa ressenya hi va trobar, per Setmana Santa del 2015, tanta neu inestable que no va arribar al cim."
		],
		es: [
			'La Muga es una cima del municipio de Lles de Cerdanya, en [la Cerdanya](/comarques/cerdanya), dentro del espacio protegido de la Tossa Plana de Lles-Puigpedrós. La roca es una granodiorita. Con una prominencia de solo 143 m, es más bien un punto alto de una cresta que una cima aislada: por el oeste enlaza con la Mugueta, la Tosseta de Vallcivera y la Tossa Plana de Lles.',
			'A sus pies están los estanys de la Muga, por donde pasa la subida desde el Cap del Rec. En la vertiente este, la vall de la Llosa, que arranca en Cal Jan de la Llosa, es el camino del GR-107 o Camí dels Bons Homes hasta la Portella Blanca, y en ella quedan los restos del castillo de la Llosa, que controlaba el paso hacia Andorra y el Ariège.',
			'Engarrista, que subió por la vall de la Llosa, destaca desde la cresta las cimas del noreste de Andorra y la cima y los lagos de Montmalús, y, desde la [Tossa Plana de Lles](/cims/tossa-plana-de-lles), el Cadí. Al este, al otro lado de la vall de la Llosa, se alza el [Puigpedrós](/cims/puigpedros), el techo de la comarca.',
			'Es una salida de verano y de otoño: cuando Engarrista subió, un 22 de mayo, los lagos aún tenían hielo. En invierno la subida pide crampones y piolet, y un lector de la misma reseña encontró, en Semana Santa de 2015, tanta nieve inestable que no llegó a la cima.'
		]
	},
	rutes: [
		{
			id: 'cal-jan-de-la-llosa',
			nom: {
				ca: 'Des de Cal Jan de la Llosa per Prat Xuixirà',
				es: 'Desde Cal Jan de la Llosa por Prat Xuixirà'
			},
			sortida: { nom: 'Cal Jan de la Llosa (Viliella, Lles de Cerdanya)' },
			distanciaKm: 8.3,
			tempsMinuts: 209,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Una pista llarga per la vall porta a Prat Xuixirà (5,7 km); d'allà s'enfila una canal de tartera sense camí, d'uns 500 m de desnivell en poc més d'un quilòmetre, fins a la carena, i per la carena es va al cim, a 8,3 km i 3 h 29 min de la sortida. Engarrista en calcula 18,8 km i 1.520 m de desnivell en la circular completa amb la Tosseta i la Tossa Plana (8 h 8 min), i avisa que la baixada, que perd més de 1.000 m, és la part dura: el camí que marca el mapa des del Roc Blanc no existeix i el riu de la Llosa es creua per un tronc o mullant-se.",
				es: 'Una pista larga por el valle lleva a Prat Xuixirà (5,7 km); desde allí se sube una canal de pedrera sin camino, de unos 500 m de desnivel en poco más de un kilómetro, hasta la cresta, y por la cresta se llega a la cima, a 8,3 km y 3 h 29 min de la salida. Engarrista calcula 18,8 km y 1.520 m de desnivel en la circular completa con la Tosseta y la Tossa Plana (8 h 8 min), y avisa de que la bajada, que pierde más de 1.000 m, es la parte dura: el camino que marca el mapa desde el Roc Blanc no existe y el río de la Llosa se cruza por un tronco o mojándose.'
			},
			fonts: [ENGARRISTA]
		},
		{
			id: 'cap-del-rec',
			nom: {
				ca: 'Des del refugi del Cap del Rec pels estanys de la Muga',
				es: 'Desde el refugio del Cap del Rec por los estanys de la Muga'
			},
			sortida: { nom: 'Refugi del Cap del Rec (Lles de Cerdanya, 1.960 m)' },
			descripcio: {
				ca: "L'Esportpedia de l'Enciclopèdia presenta el refugi del Cap del Rec, a 1.960 m, com a base per pujar a la Muga i a la Tossa Plana de Lles. L'itinerari habitual puja pel bosc del Bac de la Muga fins als estanys de la Muga i, d'allà, remunta el pendent fort i sense camí marcat que porta a la carena i al cim. No hem trobat cap font fiable amb el temps o el desnivell d'aquesta via: porta el track i calcula una jornada sencera. Es pot allargar per la carena fins a la Mugueta, la Tosseta de Vallcivera i la Tossa Plana de Lles.",
				es: 'La Esportpedia de la Enciclopèdia presenta el refugio del Cap del Rec, a 1.960 m, como base para subir a la Muga y a la Tossa Plana de Lles. El itinerario habitual sube por el bosque del Bac de la Muga hasta los estanys de la Muga y, desde allí, remonta la pendiente fuerte y sin camino marcado que lleva a la cresta y a la cima. No hemos encontrado ninguna fuente fiable con el tiempo o el desnivel de esta vía: lleva el track y calcula una jornada entera. Se puede alargar por la cresta hasta la Mugueta, la Tosseta de Vallcivera y la Tossa Plana de Lles.'
			},
			fonts: [ESPORTPEDIA_CAP_DEL_REC]
		}
	],
	consells: {
		ca: [
			'Els dos accessos tenen trams sense camí: porta el track descarregat i un mapa 1:25.000 de la Tossa Plana - Puigpedrós.',
			'No et fiïs del camí dibuixat als mapes a la baixada per la vall de la Llosa: Engarrista i els seus lectors hi van tenir problemes per seguir el mapa i les fites, i van trobar poc realistes els horaris de la guia.',
			"A l'hivern o amb neu tardana, cal piolet i grampons i experiència: la canal de tartera de la vall de la Llosa i els pendents sobre els estanys són vessants on s'acumula la neu.",
			'Si baixes per la vall de la Llosa, compta amb haver de creuar el riu: Engarrista ho va fer per un tronc o mullant-se els peus.'
		],
		es: [
			'Los dos accesos tienen tramos sin camino: lleva el track descargado y un mapa 1:25.000 de la Tossa Plana - Puigpedrós.',
			'No te fíes del camino dibujado en los mapas en la bajada por la vall de la Llosa: Engarrista y sus lectores tuvieron problemas para seguir el mapa y los hitos, y encontraron poco realistas los horarios de la guía.',
			'En invierno o con nieve tardía, hacen falta piolet, crampones y experiencia: la canal de pedrera de la vall de la Llosa y las laderas sobre los lagos son vertientes donde se acumula la nieve.',
			'Si bajas por la vall de la Llosa, cuenta con tener que cruzar el río: Engarrista lo hizo por un tronco o mojándose los pies.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Muga?',
				resposta:
					'Engarrista hi arriba en 3 h 29 min des de Cal Jan de la Llosa (8,3 km), i tota la volta amb la Tosseta i la Tossa Plana li porta 8 h 8 min. És una jornada sencera: no hi vagis amb el temps just.'
			},
			{
				pregunta: 'És un cim difícil?',
				resposta:
					"Engarrista la qualifica de fàcil, sense passos d'escalada, però amb trams sense camí: la canal de tartera de pujada, d'uns 500 m de desnivell, i una baixada de més de 1.000 m per tartera i pendents forts. És alta muntanya, i amb boira l'orientació es complica."
			},
			{
				pregunta: 'Es pot combinar amb altres cims?',
				resposta:
					'Sí. La carena de la Muga enllaça amb la Mugueta, la Tosseta de Vallcivera i la [Tossa Plana de Lles](/cims/tossa-plana-de-lles), i Engarrista les encadena en la mateixa jornada.'
			},
			{
				pregunta: 'La Muga compta com a cim essencial?',
				resposta:
					'Sí. Entre els quatre essencials de la Cerdanya, és el tercer en altitud, per sota del [Puigpedrós](/cims/puigpedros) i de la Tossa Plana de Lles, i per sobre de la [Carabassa](/cims/la-carabassa).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Muga?',
				resposta:
					'Engarrista llega en 3 h 29 min desde Cal Jan de la Llosa (8,3 km), y toda la vuelta con la Tosseta y la Tossa Plana le lleva 8 h 8 min. Es una jornada entera: no vayas con el tiempo justo.'
			},
			{
				pregunta: '¿Es una cima difícil?',
				resposta:
					'Engarrista la califica de fácil, sin pasos de escalada, pero con tramos sin camino: la canal de pedrera de subida, de unos 500 m de desnivel, y una bajada de más de 1.000 m por pedrera y pendientes fuertes. Es alta montaña, y con niebla la orientación se complica.'
			},
			{
				pregunta: '¿Se puede combinar con otras cimas?',
				resposta:
					'Sí. La cresta de la Muga enlaza con la Mugueta, la Tosseta de Vallcivera y la [Tossa Plana de Lles](/cims/tossa-plana-de-lles), y Engarrista las encadena en la misma jornada.'
			},
			{
				pregunta: '¿La Muga cuenta como cima esencial?',
				resposta:
					'Sí. Entre las cuatro esenciales de la Cerdanya, es la tercera en altitud, por debajo del [Puigpedrós](/cims/puigpedros) y de la Tossa Plana de Lles, y por encima de la [Carabassa](/cims/la-carabassa).'
			}
		]
	},
	fonts: [VIQUIPEDIA, ENGARRISTA, ESPORTPEDIA_CAP_DEL_REC],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
