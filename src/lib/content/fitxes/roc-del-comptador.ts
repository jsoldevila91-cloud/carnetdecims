import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Roc del Comptador',
	url: 'https://ca.wikipedia.org/wiki/Roc_del_Comptador',
	consultat: CONSULTAT
};

const MACANET = {
	nom: 'Ajuntament de Maçanet de Cabrenys: de castell a castell, camí a Reiners',
	url: 'https://xn--maanetdecabrenys-dpb.cat/destinacio/de-castell-a-castell-cami-de-macanet-de-cabrenys-a-reiners',
	consultat: CONSULTAT
};

const FEMTURISME = {
	nom: 'Femturisme: ruta per la carena del Roc de Fraussa des del santuari de les Salines',
	url: 'https://www.femturisme.cat/en/routes/route-along-the-carena-of-roc-de-fraussa-from-the-sanctuary-of-les-salines',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: Roc de Fraussa i Roc del Comptador",
	url: 'https://dexcursio.net/roc-de-fraussa-roc-del-comptador/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'roc-del-comptador',
	descripcio: {
		ca: [
			"El Roc del Comptador és un cim de la serra de les Salines, a la carena fronterera entre Maçanet de Cabrenys, a l'[Alt Empordà](/comarques/alt-emporda), i Ceret, al Vallespir. Segons la Viquipèdia, queda entre el Roc de Fraussa i el Moixer, i és un dels cims que molta gent encadena en una mateixa sortida. D'excursió per Catalunya l'anomena el veritable sostre de l'Alt Empordà.",
			"L'excursió gira al voltant del santuari de la Mare de Déu de les Salines. L'Ajuntament de Maçanet de Cabrenys explica que els maçanetencs hi van bastir una capella el 1271, i que el nom de les Salines fa referència al fet que en aquest lloc es donava sal al bestiar de pasturatge. Des del santuari surt la ruta que recull Femturisme, que puja pel bosc fins a les antenes del Moixer i continua per la carena.",
			"Femturisme la descriu com una ruta fàcil, sense dificultat especial, amb algun petit tram de pujada per arribar al Roc de Fraussa i al Contador. L'últim tram fins al Roc del Comptador no és marcat, i s'hi puja triant els millors graons entre els blocs de granit; per això és bo portar un mapa o un track descarregat.",
			'Amb neu o glaç als blocs de granit, la pujada és una altra: consulta la predicció de Meteocat i valora-ho abans de sortir.'
		],
		es: [
			"El Roc del Comptador es una cima de la sierra de les Salines, en la cresta fronteriza entre Maçanet de Cabrenys, en el [Alt Empordà](/comarques/alt-emporda), y Ceret, en el Vallespir. Según la Viquipèdia, queda entre el Roc de Fraussa y el Moixer, y es una de las cimas que mucha gente encadena en una misma salida. D'excursió per Catalunya lo llama el verdadero techo del Alt Empordà.",
			'La excursión gira alrededor del santuario de la Mare de Déu de les Salines. El Ayuntamiento de Maçanet de Cabrenys explica que los maçanetencs levantaron allí una capilla en 1271, y que el nombre de las Salines se refiere a que en este lugar se daba sal al ganado de pasto. Desde el santuario sale la ruta que recoge Femturisme, que sube por el bosque hasta las antenas del Moixer y continúa por la cresta.',
			'Femturisme la describe como una ruta fácil, sin dificultad especial, con algún pequeño tramo de subida para llegar al Roc de Fraussa y al Contador. El último tramo hasta el Roc del Comptador no está marcado, y se sube eligiendo los mejores escalones entre los bloques de granito; por eso conviene llevar un mapa o un track descargado.',
			'Con nieve o hielo en los bloques de granito, la subida es otra: consulta la predicción de Meteocat y valóralo antes de salir.'
		]
	},
	rutes: [
		{
			id: 'salines',
			nom: {
				ca: 'Circular des del santuari de les Salines',
				es: 'Circular desde el santuario de les Salines'
			},
			sortida: { nom: 'Santuari de la Mare de Déu de les Salines (Maçanet de Cabrenys)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Segons Femturisme, es camina des del santuari de les Salines per un camí marcat pel bosc, i des de les antenes del Moixer la carena es recorre en menys de deu minuts fins als Rocs; el camí va amb marques grogues. El darrer tram fins al Roc del Comptador no té marques: s'hi puja triant els millors graons entre els blocs de granit. La ruta té 9 km, 594 m de desnivell acumulat i 4 h en total, circular.",
				es: 'Según Femturisme, se camina desde el santuario de les Salines por un camino marcado por el bosque, y desde las antenas del Moixer la cresta se recorre en menos de diez minutos hasta los Rocs; el camino va con marcas amarillas. El último tramo hasta el Roc del Comptador no tiene marcas: se sube eligiendo los mejores escalones entre los bloques de granito. La ruta tiene 9 km, 594 m de desnivel acumulado y 4 h en total, circular.'
			},
			fonts: [FEMTURISME]
		},
		{
			id: 'la-vajol',
			nom: {
				ca: 'Circular llarga des de la Vajol',
				es: 'Circular larga desde la Vajol'
			},
			sortida: { nom: 'Pista forestal cap al santuari de les Salines (la Vajol)' },
			descripcio: {
				ca: "D'excursió per Catalunya proposa una circular de 16 km, +1.123 m i 7 h 03 min en total: pista asfaltada fins al Moixer, uns cinc minuts de carena fins al Roc de Fraussa i, més enllà, el Roc del Comptador; tornada per la carena fins al coll dels Pous, un camí que baixa al santuari i el camí principal fins al cotxe. Recomana botes de mitja o alta muntanya, almenys 2 litres d'aigua i un track de GPS.",
				es: "D'excursió per Catalunya propone una circular de 16 km, +1.123 m y 7 h 03 min en total: pista asfaltada hasta el Moixer, unos cinco minutos de cresta hasta el Roc de Fraussa y, más allá, el Roc del Comptador; vuelta por la cresta hasta el coll dels Pous, un camino que baja al santuario y el camino principal hasta el coche. Recomienda botas de media o alta montaña, al menos 2 litros de agua y un track de GPS."
			},
			fonts: [DEXCURSIO]
		}
	],
	consells: {
		ca: [
			"L'últim tram no és marcat: porta mapa o un track descarregat i, amb boira, no improvisis dreceres entre els blocs.",
			"D'excursió per Catalunya recomana botes de mitja o alta muntanya, roba d'abric, impermeable i almenys 2 litres d'aigua.",
			'La carena és la frontera amb França: porta un mapa que la marqui i no baixis per un vessant que no coneguis.',
			'Si tries la circular llarga des de la Vajol, calcula més de set hores sense parades i les hores de llum.',
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'El último tramo no está marcado: lleva mapa o un track descargado y, con niebla, no improvises atajos entre los bloques.',
			"D'excursió per Catalunya recomienda botas de media o alta montaña, ropa de abrigo, impermeable y al menos 2 litros de agua.",
			'La cresta es la frontera con Francia: lleva un mapa que la marque y no bajes por una vertiente que no conozcas.',
			'Si eliges la circular larga desde la Vajol, calcula más de siete horas sin paradas y las horas de luz.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Roc del Comptador?',
				resposta:
					"Femturisme dona 4 h per a la circular de 9 km des del santuari de les Salines, amb 594 m de desnivell acumulat. D'excursió per Catalunya en compta 7 h 03 min per a la circular de 16 km des de la Vajol."
			},
			{
				pregunta: 'El Roc del Comptador és difícil?',
				resposta:
					"Femturisme el classifica com a fàcil, sense dificultat especial. L'últim tram, però, no està marcat i s'hi puja entre blocs de granit."
			},
			{
				pregunta: 'Es poden fer el Roc de Fraussa i el Roc del Comptador en una mateixa sortida?',
				resposta:
					"Sí. Les dues rutes d'aquesta fitxa passen pels dos cims, que són a poca distància per la carena."
			},
			{
				pregunta: 'El Roc del Comptador és un cim essencial?',
				resposta:
					"Sí. A l'[Alt Empordà](/comarques/alt-emporda) l'acompanyen [el Puig Neulós](/cims/puig-neulos), [el Mont](/cims/el-mont) i [el Bassegoda](/cims/bassegoda)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Roc del Comptador?',
				resposta:
					"Femturisme da 4 h para la circular de 9 km desde el santuario de les Salines, con 594 m de desnivel acumulado. D'excursió per Catalunya cuenta 7 h 03 min para la circular de 16 km desde la Vajol."
			},
			{
				pregunta: '¿El Roc del Comptador es difícil?',
				resposta:
					'Femturisme lo clasifica como fácil, sin dificultad especial. El último tramo, sin embargo, no está marcado y se sube entre bloques de granito.'
			},
			{
				pregunta: '¿Se pueden hacer el Roc de Fraussa y el Roc del Comptador en una misma salida?',
				resposta:
					'Sí. Las dos rutas de esta ficha pasan por las dos cimas, que están a poca distancia por la cresta.'
			},
			{
				pregunta: '¿El Roc del Comptador es una cima esencial?',
				resposta:
					'Sí. En el [Alt Empordà](/comarques/alt-emporda) lo acompañan [el Puig Neulós](/cims/puig-neulos), [el Mont](/cims/el-mont) y [el Bassegoda](/cims/bassegoda).'
			}
		]
	},
	fonts: [VIQUIPEDIA, MACANET, FEMTURISME, DEXCURSIO],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
