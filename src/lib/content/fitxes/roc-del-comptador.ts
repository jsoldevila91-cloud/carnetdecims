import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Roc del Comptador',
	url: 'https://ca.wikipedia.org/wiki/Roc_del_Comptador',
	consultat: CONSULTAT
};

const MACANET = {
	nom: 'Ajuntament de Maçanet de Cabrenys: de castell a castell, camí de Maçanet de Cabrenys a Reiners',
	url: 'https://xn--maanetdecabrenys-dpb.cat/destinacio/de-castell-a-castell-cami-de-macanet-de-cabrenys-a-reiners',
	consultat: CONSULTAT
};

const FEMTURISME = {
	nom: 'Femturisme: ruta per la carena del Roc de Fraussa des del santuari de les Salines',
	url: 'https://femturisme.cat/rutes/ruta-per-la-carena-del-roc-de-fraussa-des-del-santuari-de-les-salines',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: Roc de Fraussa i Roc del Comptador des de la Vajol",
	url: 'https://dexcursio.net/roc-de-fraussa-roc-del-comptador/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'roc-del-comptador',
	descripcio: {
		ca: [
			"El Roc del Comptador és un promontori de granit a la carena de la serra de les Salines, que fa de frontera entre Maçanet de Cabrenys, a l'[Alt Empordà](/comarques/alt-emporda), i Ceret, al Vallespir. Segons la Viquipèdia, queda entre el Roc de Fraussa, a ponent, i el Moixer, el de les antenes, a llevant. És el punt més alt de la comarca, per damunt del [Bassegoda](/cims/bassegoda) i del [Puig Neulós](/cims/puig-neulos).",
			"Convé saber què es busca abans de sortir, perquè els noms d'aquesta carena ballen. La Viquipèdia explica que la cartografia francesa anomena Roc de France o de Frausa la mateixa cota que l'ICGC i la FEEC anomenen Roc del Comptador, i Femturisme hi afegeix que al cim mateix hi ha una inscripció que diu Roc de Frausa. Les tres puntes són a pocs minuts l'una de l'altra, de manera que el més pràctic és fer-les totes.",
			"A baix, el santuari de les Salines és el punt de partida habitual. L'Ajuntament de Maçanet de Cabrenys explica que els maçanetencs hi van bastir una capella a la Mare de Déu el 1271 i que el nom ve de la sal que es donava al bestiar que hi pasturava. La pujada va per una fageda que a Femturisme li recorda el Montseny, i el coll dels Pous deu el nom als antics pous de neu, dels quals se'n conserven dos.",
			"Dalt hi ha una creu petita i una vista llarga de la carena. Des del Moixer, Femturisme descriu el golf de Roses, el cap de Creus, la plana del Rosselló i el Canigó. És una carena oberta al vent i a la boira; amb neu o glaç, els blocs del final demanen una prudència que a l'estiu no cal."
		],
		es: [
			'El Roc del Comptador es un promontorio de granito en la cresta de la sierra de les Salines, que hace de frontera entre Maçanet de Cabrenys, en el [Alt Empordà](/comarques/alt-emporda), y Ceret, en el Vallespir. Según la Viquipèdia, queda entre el Roc de Fraussa, a poniente, y el Moixer, el de las antenas, a levante. Es el punto más alto de la comarca, por encima del [Bassegoda](/cims/bassegoda) y del [Puig Neulós](/cims/puig-neulos).',
			'Conviene saber qué se busca antes de salir, porque los nombres de esta cresta bailan. La Viquipèdia explica que la cartografía francesa llama Roc de France o de Frausa a la misma cota que el ICGC y la FEEC llaman Roc del Comptador, y Femturisme añade que en la propia cima hay una inscripción que dice Roc de Frausa. Las tres puntas están a pocos minutos una de otra, así que lo más práctico es hacerlas todas.',
			'Abajo, el santuario de les Salines es el punto de partida habitual. El Ayuntamiento de Maçanet de Cabrenys explica que los vecinos levantaron allí una capilla a la Virgen en 1271 y que el nombre viene de la sal que se daba al ganado que pastaba en la zona. La subida va por un hayedo que a Femturisme le recuerda el Montseny, y el coll dels Pous debe su nombre a los antiguos pozos de nieve, de los que se conservan dos.',
			'Arriba hay una cruz pequeña y una vista larga de la cresta. Desde el Moixer, Femturisme describe el golfo de Roses, el cabo de Creus, la llanura del Rosselló y el Canigó. Es una cresta abierta al viento y a la niebla; con nieve o hielo, los bloques del final piden una prudencia que en verano no hace falta.'
		]
	},
	rutes: [
		{
			id: 'salines',
			nom: {
				ca: 'Circular des del santuari de les Salines pel coll dels Pous i el Moixer',
				es: 'Circular desde el santuario de les Salines por el coll dels Pous y el Moixer'
			},
			sortida: { nom: 'Santuari de la Mare de Déu de les Salines (Maçanet de Cabrenys)' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Femturisme descriu una circular de 9 km, 594 m de desnivell positiu acumulat i 4 h en total. Del santuari puja fort pel bosc, amb marques de GR, fins al coll dels Pous; d'allà, per la fageda i seguint marques grogues, fins a les antenes del Moixer. El Roc del Comptador queda a menys de deu minuts per la carena: els últims metres no tenen marques i es pugen grimpant pels millors passos entre els blocs de granit. La ruta continua cap al Roc de Fraussa i torna pel GR 10, pel vessant nord. La valora de fàcil, amb alguna petita grimpada per pujar als Rocs.",
				es: 'Femturisme describe una circular de 9 km, 594 m de desnivel positivo acumulado y 4 h en total. Desde el santuario sube fuerte por el bosque, con marcas de GR, hasta el coll dels Pous; desde allí, por el hayedo y siguiendo marcas amarillas, hasta las antenas del Moixer. El Roc del Comptador queda a menos de diez minutos por la cresta: los últimos metros no tienen marcas y se suben trepando por los mejores pasos entre los bloques de granito. La ruta continúa hacia el Roc de Fraussa y vuelve por el GR 10, por la vertiente norte. La valora de fácil, con alguna pequeña trepada para subir a los Rocs.'
			},
			fonts: [FEMTURISME]
		},
		{
			id: 'la-vajol',
			nom: {
				ca: 'Circular llarga des de la Vajol pel Moixer',
				es: 'Circular larga desde la Vajol por el Moixer'
			},
			sortida: { nom: 'Pista del santuari de les Salines, a 1,5 km de la Vajol' },
			descripcio: {
				ca: "D'excursió per Catalunya proposa una circular de 16 km, +1.123 m i 7 h 03 min, de dificultat moderada. Surt de la pista de terra que neix a un quilòmetre i mig de la Vajol, passa per la font del Cucut i puja per la pista asfaltada fins al Moixer. D'allà recorre la carena fins als dos Rocs i torna al coll dels Pous, d'on un corriol baixa directe al santuari; la pista principal tanca la volta fins al cotxe.",
				es: "D'excursió per Catalunya propone una circular de 16 km, +1.123 m y 7 h 03 min, de dificultad moderada. Sale de la pista de tierra que nace a un kilómetro y medio de la Vajol, pasa por la fuente del Cucut y sube por la pista asfaltada hasta el Moixer. Desde allí recorre la cresta hasta los dos Rocs y vuelve al coll dels Pous, de donde un sendero baja directo al santuario; la pista principal cierra la vuelta hasta el coche."
			},
			fonts: [DEXCURSIO]
		}
	],
	consells: {
		ca: [
			'El cim és el promontori de la creu, el primer que es troba venint del Moixer: no et refiïs només dels rètols, que en aquesta carena barregen Fraussa, Frausa i França.',
			"Els blocs del final es pugen i es baixen amb les mans: amb el granit moll o amb gebre, mira't-ho des del camí.",
			'Segons Femturisme, a la tardor la fullaraca desdibuixa el camí de la fageda: segueix les marques grogues i porta el mapa.',
			"D'excursió per Catalunya recomana botes de canya mitjana o alta i un mínim de dos litres d'aigua per a la volta llarga.",
			'La carena és frontera i hi ha tanques de bestiar: deixa els passos tal com els trobis.'
		],
		es: [
			'La cima es el promontorio de la cruz, el primero que se encuentra viniendo del Moixer: no te fíes solo de los rótulos, que en esta cresta mezclan Fraussa, Frausa y França.',
			'Los bloques del final se suben y se bajan con las manos: con el granito mojado o con escarcha, míralo desde el camino.',
			'Según Femturisme, en otoño la hojarasca desdibuja el camino del hayedo: sigue las marcas amarillas y lleva el mapa.',
			"D'excursió per Catalunya recomienda botas de caña media o alta y un mínimo de dos litros de agua para la vuelta larga.",
			'La cresta es frontera y hay cercas de ganado: deja los pasos tal como los encuentres.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Roc del Comptador?',
				resposta:
					"La circular de Femturisme des del santuari de les Salines fa 9 km i 594 m de desnivell positiu, amb 4 h en total. La de D'excursió per Catalunya des de la Vajol s'allarga fins a 16 km, +1.123 m i 7 h 03 min."
			},
			{
				pregunta: 'El Roc del Comptador és difícil?',
				resposta:
					"Femturisme valora la ruta de fàcil, sense cap dificultat especial, però avisa d'alguna petita grimpada per pujar als Rocs: els últims metres del Comptador es fan sense marques, entre blocs de granit."
			},
			{
				pregunta: 'El Roc del Comptador i el Roc de Fraussa són el mateix cim?',
				resposta:
					"No, però es confonen sovint. Segons la Viquipèdia, els mapes francesos anomenen Roc de France o de Frausa la cota que l'ICGC i la FEEC anomenen Roc del Comptador. Les dues puntes i el Moixer són molt a prop."
			},
			{
				pregunta: "És el sostre de l'Alt Empordà?",
				resposta:
					"Sí: és el cim més alt de la comarca. D'excursió per Catalunya en diu el veritable sostre de l'Alt Empordà, per distingir-lo del Roc de Fraussa, més conegut."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Roc del Comptador?',
				resposta:
					"La circular de Femturisme desde el santuario de les Salines tiene 9 km y 594 m de desnivel positivo, con 4 h en total. La de D'excursió per Catalunya desde la Vajol se alarga hasta 16 km, +1.123 m y 7 h 03 min."
			},
			{
				pregunta: '¿El Roc del Comptador es difícil?',
				resposta:
					'Femturisme valora la ruta de fácil, sin ninguna dificultad especial, pero avisa de alguna pequeña trepada para subir a los Rocs: los últimos metros del Comptador se hacen sin marcas, entre bloques de granito.'
			},
			{
				pregunta: '¿El Roc del Comptador y el Roc de Fraussa son la misma cima?',
				resposta:
					'No, pero se confunden a menudo. Según la Viquipèdia, los mapas franceses llaman Roc de France o de Frausa a la cota que el ICGC y la FEEC llaman Roc del Comptador. Las dos puntas y el Moixer están muy cerca.'
			},
			{
				pregunta: '¿Es el techo del Alt Empordà?',
				resposta:
					"Sí: es la cima más alta de la comarca. D'excursió per Catalunya lo llama el verdadero techo del Alt Empordà, para distinguirlo del Roc de Fraussa, más conocido."
			}
		]
	},
	fonts: [VIQUIPEDIA, MACANET, FEMTURISME, DEXCURSIO],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
