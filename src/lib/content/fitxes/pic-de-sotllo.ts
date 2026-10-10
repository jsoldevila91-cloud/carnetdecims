import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Pic de Sotllo',
	url: 'https://ca.wikipedia.org/wiki/Pic_de_Sotllo',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: 'Rutes Pirineus: Pica d’Estats des de la Vall Ferrera',
	url: 'https://www.rutespirineus.cat/rutes/pica-estats-des-del-refugi-de-la-vall-ferrera',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Pic de Sotllo',
	url: 'https://reptesmuntanyencs.cat/pic-de-sotllo/',
	consultat: CONSULTAT
};

const PARC = {
	nom: "Parc Natural de l'Alt Pirineu: pautes i consells per als visitants",
	url: 'https://parcsnaturals.gencat.cat/en/xarxa-de-parcs/alt-pirineu/gaudeix-del-parc/consells/pautes-i-consells/index.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pic-de-sotllo',
	descripcio: {
		ca: [
			"El Pic de Sotllo és el segon cim més alt dels essencials del [Pallars Sobirà](/comarques/pallars-sobira), només per darrere de la [Pica d'Estats](/cims/pica-d-estats), i un dels dos tresmils de la llista a la comarca. Amb 3.073 m, és a la frontera entre Catalunya i l'Arieja, al massís del Montcalm, a la Vallferrera, dins el Parc Natural de l'Alt Pirineu i del Parc Natural Regional dels Pirineus Ariejans. Els municipis que menciona la Viquipèdia són Alins, a Catalunya, i Ausat, a França. La roca és gres i lutita.",
			"El port de Sotllo és el coll fronterer que el separa de la Pica d'Estats: segons Rutes Pirineus, el Sotllo s'alça a l'oest del port, i la ruta clàssica de la Pica hi passa per sota. Des del port, segons la Viquipèdia, la carena fins al cim del Sotllo és fàcil. L'accés des de la banda catalana segueix la mateixa vall que l'ascensió clàssica de la Pica, pel barranc de Sotllo, i passa pels estanys de Sotllo i d'Estats.",
			"Reptes Muntanyencs hi puja per l'altra banda, la francesa: surt de l'Artigue (Auzat, Arieja), fa nit al refugi de Pinet (2.189 m) i l'endemà enllaça el Sotllo i la Pica d'Estats, amb un total de 21,3 km i 2.420 m de desnivell positiu. Des de mitja pujada al Sotllo hi ha trams on cal posar les mans en diversos punts, i la baixada final cap a Pinet té trams drets i alguns de mal fer. És una opció molt més llarga que la de la Vallferrera.",
			"És un tresmil d'estiu i de primers de tardor. Amb neu, segons Rutes Pirineus, poden baixar allaus per tot el barranc de Sotllo, especialment al pla de la Socauba i als plans de Sotllo. Per a la ruta de la Pica, que comparteix l'aproximació, la mateixa font aconsella dormir al refugi de Vallferrera i sortir de matinada."
		],
		es: [
			'El Pic de Sotllo es la segunda cima más alta de las esenciales del [Pallars Sobirà](/comarques/pallars-sobira), solo por detrás de la [Pica d’Estats](/cims/pica-d-estats), y uno de los dos tresmiles de la lista en la comarca. Con 3.073 m, está en la frontera entre Cataluña y el Ariège, en el macizo del Montcalm, en la Vallferrera, dentro del Parque Natural del Alt Pirineu y del Parque Natural Regional de los Pirineos Ariejanos. Los municipios que menciona la Viquipèdia son Alins, en Cataluña, y Ausat, en Francia. La roca es arenisca y lutita.',
			'El port de Sotllo es el collado fronterizo que lo separa de la Pica d’Estats: según Rutes Pirineus, el Sotllo se alza al oeste del puerto, y la ruta clásica de la Pica pasa por debajo. Desde el puerto, según la Viquipèdia, la cresta hasta la cima del Sotllo es fácil. El acceso desde el lado catalán sigue el mismo valle que la ascensión clásica de la Pica, por el barranc de Sotllo, y pasa por los estanys de Sotllo y de Estats.',
			'Reptes Muntanyencs sube por el otro lado, el francés: sale de l’Artigue (Auzat, Ariège), pasa la noche en el refugio de Pinet (2.189 m) y al día siguiente enlaza el Sotllo y la Pica d’Estats, con un total de 21,3 km y 2.420 m de desnivel positivo. Desde media subida al Sotllo hay tramos donde hay que poner las manos en varios puntos, y la bajada final hacia Pinet tiene tramos empinados y algunos incómodos. Es una opción mucho más larga que la de la Vallferrera.',
			'Es un tresmil de verano y de primeros de otoño. Con nieve, según Rutes Pirineus, pueden caer aludes en todo el barranc de Sotllo, especialmente en el pla de la Socauba y en los plans de Sotllo. Para la ruta de la Pica, que comparte la aproximación, la misma fuente aconseja dormir en el refugio de Vallferrera y salir de madrugada.'
		]
	},
	rutes: [
		{
			id: 'vallferrera',
			nom: {
				ca: 'Des de la Molinassa pel barranc de Sotllo i el port de Sotllo',
				es: 'Desde la Molinassa por el barranc de Sotllo y el port de Sotllo'
			},
			sortida: { nom: 'Aparcament de la Molinassa (Vallferrera, 1.805 m)' },
			descripcio: {
				ca: "La Viquipèdia la presenta com a via normal: puja per la Vallferrera i arriba al port de Sotllo, i d'allà una carena fàcil fins al cim. Rutes Pirineus detalla el tram fins al port, el mateix de l'ascensió clàssica de la Pica d'Estats: refugi de Vallferrera (15 min), estany de Sotllo (2 h 15 min), estany d'Estats (3 h) i port de Sotllo (3 h 45 min), per un barranc de remuntada constant amb salts d'aigua. S'arriba a la Molinassa per una pista de terra d'uns 12 km des d'Àreu, amb una rampa final molt empinada; convé informar-se de l'estat de la pista, sobretot amb cotxe baix.",
				es: 'La Viquipèdia la presenta como vía normal: sube por la Vallferrera y llega al port de Sotllo, y de allí una cresta fácil hasta la cima. Rutes Pirineus detalla el tramo hasta el puerto, el mismo de la ascensión clásica de la Pica d’Estats: refugio de Vallferrera (15 min), estany de Sotllo (2 h 15 min), estany d’Estats (3 h) y port de Sotllo (3 h 45 min), por un barranco de remontada constante con saltos de agua. Se llega a la Molinassa por una pista de tierra de unos 12 km desde Àreu, con una rampa final muy empinada; conviene informarse de su estado, sobre todo con coche bajo.'
			},
			fonts: [VIQUIPEDIA, RUTES_PIRINEUS]
		},
		{
			id: 'artigue',
			nom: {
				ca: "Des de l'Artigue (Arieja) pel refugi de Pinet",
				es: 'Desde l’Artigue (Ariège) por el refugio de Pinet'
			},
			sortida: { nom: 'L’Artigue (Auzat, Arieja)' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Reptes Muntanyencs fa la volta en dos dies, amb sortida de l'Artigue (1.179 m), accessible amb qualsevol cotxe per carretera, i nit al refugi de Pinet. El segon dia puja per la vall de Barz i l'estany d'Estats i pren un corriol marcat amb pintura verda que va directe al cim del Sotllo, sense passar pel port; des de mitja pujada hi ha trams on cal usar les mans en diversos punts. Després continua cap a la Pica d'Estats. La ruta, ben senyalitzada amb pintura i fites, suma 21,3 km i 2.420 m de desnivell positiu, amb 11 h 31 min caminant, i part del recorregut segueix el GRT (variant 61).",
				es: "Reptes Muntanyencs hace la vuelta en dos días, con salida en l’Artigue (1.179 m), accesible con cualquier coche por carretera, y noche en el refugio de Pinet. El segundo día sube por el valle de Barz y el étang d'Estats y toma un sendero marcado con pintura verde que va directo a la cima del Sotllo, sin pasar por el puerto; desde media subida hay tramos donde hay que usar las manos en varios puntos. Después sigue hacia la Pica d’Estats. La ruta, bien señalizada con pintura e hitos, suma 21,3 km y 2.420 m de desnivel positivo, con 11 h 31 min andando, y parte del recorrido sigue el GRT (variante 61)."
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"Informa't de l'estat de la pista de la Molinassa abans de sortir, sobretot si portes un cotxe baix: la rampa final és molt empinada, segons Rutes Pirineus.",
			'Si dorms al refugi de Vallferrera (a 15 min de la Molinassa, amb font al davant), pots sortir de matinada i evitar les hores de més calor.',
			"A l'hivern i amb neu, el barranc de Sotllo és terreny d'allaus: consulta el butlletí abans de sortir.",
			'El port de Sotllo és la frontera amb França; porta documentació per si de cas.',
			"Sense cotxe, Rutes Pirineus calcula unes 3 h a peu d'Àreu al refugi de Vallferrera. L'estat de la pista canvia segons l'època: l'Ajuntament d'Alins en pot informar."
		],
		es: [
			'Infórmate del estado de la pista de la Molinassa antes de salir, sobre todo si llevas un coche bajo: la rampa final es muy empinada, según Rutes Pirineus.',
			'Si duermes en el refugio de Vallferrera (a 15 min de la Molinassa, con fuente delante), puedes salir de madrugada y evitar las horas de más calor.',
			'En invierno y con nieve, el barranc de Sotllo es terreno de aludes: consulta el boletín antes de salir.',
			'El port de Sotllo es la frontera con Francia; lleva documentación por si acaso.',
			'Sin coche, Rutes Pirineus calcula unas 3 h a pie de Àreu al refugio de Vallferrera. El estado de la pista cambia según la época: el Ayuntamiento de Alins puede informar.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Pic de Sotllo?',
				resposta:
					"Rutes Pirineus compta 3 h 45 min de la Molinassa al port de Sotllo; d'allà al cim la Viquipèdia parla d'una carena fàcil. La mateixa Viquipèdia dona unes sis hores de pujada i uns 1.400 m de desnivell per a la via normal."
			},
			{
				pregunta: 'És difícil el Pic de Sotllo?',
				resposta:
					"Per la via de la Vallferrera, la Viquipèdia parla d'una carena fàcil a partir del port. Per la via francesa, Reptes Muntanyencs diu que hi ha trams on cal usar les mans en diversos punts i una baixada final amb trams drets."
			},
			{
				pregunta: 'Es pot fer en un dia?',
				resposta:
					"Des de la Molinassa es pot fer en un dia llarg, però Rutes Pirineus recomana, per a la ruta de la Pica d'Estats que comparteix aproximació, arribar la nit abans i dormir al refugi de Vallferrera per sortir de matinada."
			},
			{
				pregunta: 'El Pic de Sotllo compta com a cim essencial?',
				resposta:
					"Sí, és un dels onze [cims essencials](/cims-essencials) del Pallars Sobirà i, amb 3.073 m, el segon més alt després de la [Pica d'Estats](/cims/pica-d-estats). El [Monteixo](/cims/monteixo), a la mateixa vall, és 168 m més baix."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Pic de Sotllo?',
				resposta:
					'Rutes Pirineus cuenta 3 h 45 min de la Molinassa al port de Sotllo; de allí a la cima la Viquipèdia habla de una cresta fácil. La misma Viquipèdia da unas seis horas de subida y unos 1.400 m de desnivel para la vía normal.'
			},
			{
				pregunta: '¿Es difícil el Pic de Sotllo?',
				resposta:
					'Por la vía de la Vallferrera, la Viquipèdia habla de una cresta fácil a partir del puerto. Por la vía francesa, Reptes Muntanyencs dice que hay tramos donde hay que usar las manos en varios puntos y una bajada final con tramos empinados.'
			},
			{
				pregunta: '¿Se puede hacer en un día?',
				resposta:
					'Desde la Molinassa se puede hacer en un día largo, pero Rutes Pirineus recomienda, para la ruta de la Pica d’Estats que comparte aproximación, llegar la noche antes y dormir en el refugio de Vallferrera para salir de madrugada.'
			},
			{
				pregunta: '¿El Pic de Sotllo cuenta como cima esencial?',
				resposta:
					'Sí, es una de las once [cimas esenciales](/cims-essencials) del Pallars Sobirà y, con 3.073 m, la segunda más alta después de la [Pica d’Estats](/cims/pica-d-estats). El [Monteixo](/cims/monteixo), en el mismo valle, es 168 m más bajo.'
			}
		]
	},
	fonts: [VIQUIPEDIA, RUTES_PIRINEUS, REPTES, PARC],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
