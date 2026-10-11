import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puig Ou',
	url: 'https://ca.wikipedia.org/wiki/Puig_Ou',
	consultat: CONSULTAT
};

const MUNTANYA_NATURA = {
	nom: "Muntanya i Natura: Ascensió al Talló i el puig d'Ou (Alta Garrotxa)",
	url: 'https://www.muntanyainatura.org/rutes/guiades/ascensio-tallo-puig-dou-alta-garrotxa',
	consultat: CONSULTAT
};

const BLOG = {
	nom: "A la una a casa: Puig d'Ou i Talló per la vall del Bac (2013)",
	url: 'https://alaunaacasa.blogspot.com/2013/04/puig-dou-i-tallo-per-la-vall-del-bac.html',
	consultat: CONSULTAT
};

const ITINERANNIA = {
	nom: "Itinerànnia: De l'hostal de la Vall del Bac a Sant Andreu de Porreres, ruta 2 de la Vall dels Sentits",
	url: 'https://www.itinerannia.net/en/routes/from-l-hostal-de-la-vall-del-bac-to-sant-andreu-de-porreres-by-la-torre-ruta-2-vall-dels-sentits/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-ou',
	descripcio: {
		ca: [
			"El Puig Ou, que molts escriuen puig d'Ou, és una muntanya de la Vall de Bianya, a la [Garrotxa](/comarques/garrotxa). Segons la Viquipèdia, separa la vall del Bac, al sud, de la de Bolòs i Salarsa, al nord. És un racó de l'Alta Garrotxa poc trepitjat, a mig camí entre Sant Pau de Segúries i Oix. A la mateixa comarca hi ha [el Comanegra](/cims/comanegra) i [el Puigsacalm](/cims/puigsacalm).",
			"Sol fer-se juntament amb el Talló, el cim veí. Entre tots dos queda Sant Andreu de Porreres, l'antiga parròquia de la vall del Bac, que Itinerànnia documenta des del 946; més avall hi ha la torre de la vall del Bac i l'església de Sant Miquel de la Torre. Muntanya i Natura, una empresa de guies que hi organitza sortides, parla d'alzinars, fagedes i boixedes i del congost de Bodelquer.",
			'A dalt hi ha una creu i, uns metres més enllà, un vèrtex geodèsic. Muntanya i Natura en diu un cim modest però agraït per les vistes i per la solitud.',
			"Aquests guies el recomanen a l'hivern, la primavera i la tardor, i no a l'estiu. Amb neu o amb la roca molla, la cresta del final i les baixades, llargues i pronunciades, demanen més prudència."
		],
		es: [
			"El Puig Ou, que muchos escriben puig d'Ou, es una montaña de la Vall de Bianya, en la [Garrotxa](/comarques/garrotxa). Según la Viquipèdia, separa el valle del Bac, al sur, del de Bolòs y Salarsa, al norte. Es un rincón de la Alta Garrotxa poco pisado, a medio camino entre Sant Pau de Segúries y Oix. En la misma comarca están [el Comanegra](/cims/comanegra) y [el Puigsacalm](/cims/puigsacalm).",
			'Suele hacerse junto con el Talló, la cima vecina. Entre ambos queda Sant Andreu de Porreres, la antigua parroquia del valle del Bac, que Itinerànnia documenta desde 946; más abajo están la torre del valle del Bac y la iglesia de Sant Miquel de la Torre. Muntanya i Natura, una empresa de guías que organiza salidas allí, habla de encinares, hayedos y bojedales y del desfiladero de Bodelquer.',
			'Arriba hay una cruz y, unos metros más allá, un vértice geodésico. Muntanya i Natura lo llama una cima modesta pero agradecida por las vistas y por la soledad.',
			'Estos guías lo recomiendan en invierno, primavera y otoño, y no en verano. Con nieve o con la roca mojada, la cresta del final y las bajadas, largas y pronunciadas, piden más prudencia.'
		]
	},
	rutes: [
		{
			id: 'vall-del-bac',
			nom: {
				ca: "Des de l'hostal de la Vall del Bac per la carena de la Coma",
				es: 'Desde el hostal de la Vall del Bac por la loma de la Coma'
			},
			sortida: { nom: 'Antic hostal de la Vall del Bac (la Vall de Bianya)' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "El blog A la una a casa la va ressenyar el 2013. Surt de l'hostal de la Vall del Bac (578 m) i segueix un PR de marques velles i mig esborrades per Sant Miquel de la Torre i Sant Andreu de Porreres fins a una carena damunt de la Coma (860 m, 1 h 27 min). Allà deixa el camí i puja carena amunt, sense traça clara i amb molt pendent, entre herba, rocs i boixos; poc abans del cim passa una petita cresta de rocs on cal posar les mans. Arriba a dalt a les 2 h 15 min. La volta sencera amb el Talló fa 14,2 km, 1.055 m de desnivell acumulat i 4 h 25 min de marxa.",
				es: 'El blog A la una a casa la reseñó en 2013. Sale del hostal de la Vall del Bac (578 m) y sigue un PR de marcas viejas y medio borradas por Sant Miquel de la Torre y Sant Andreu de Porreres hasta una loma por encima de la Coma (860 m, 1 h 27 min). Allí deja el camino y sube loma arriba, sin traza clara y con mucha pendiente, entre hierba, rocas y bojes; poco antes de la cima pasa una pequeña cresta de rocas donde hay que poner las manos. Llega arriba a las 2 h 15 min. La vuelta entera con el Talló tiene 14,2 km, 1.055 m de desnivel acumulado y 4 h 25 min de marcha.'
			},
			fonts: [BLOG, MUNTANYA_NATURA]
		}
	],
	consells: {
		ca: [
			"No comptis amb les marques: la ressenya parla d'un PR molt mal marcat i d'un tram de carena sense camí. Porta el mapa de l'Alta Garrotxa a 1:25.000 i un track.",
			'Muntanya i Natura hi descriu corriols pedregosos, pendents pronunciats i algun pas aeri, i recomana bastons i botes de canya mitjana o calçat amb bona adherència.',
			"A l'antic hostal hi ha lloc per aparcar i una font, segons Itinerànnia: omple-hi les ampolles abans de sortir.",
			'Si la riera baixa crescuda, Itinerànnia aconsella passar pel pont de Cal Ferrer en lloc de travessar-la a gual.',
			"Si només vols conèixer la vall, la ruta 2 de la Vall dels Sentits d'Itinerànnia arriba fins a Sant Andreu de Porreres (8,2 km, 341 m i unes 3 h), sense pujar al cim."
		],
		es: [
			'No cuentes con las marcas: la reseña habla de un PR muy mal marcado y de un tramo de loma sin camino. Lleva el mapa de la Alta Garrotxa a 1:25.000 y un track.',
			'Muntanya i Natura describe senderos pedregosos, pendientes pronunciadas y algún paso aéreo, y recomienda bastones y botas de caña media o calzado con buena adherencia.',
			'En el antiguo hostal hay sitio para aparcar y una fuente, según Itinerànnia: llena allí las botellas antes de salir.',
			'Si la riera baja crecida, Itinerànnia aconseja pasar por el puente de Cal Ferrer en lugar de vadearla.',
			'Si solo quieres conocer el valle, la ruta 2 de la Vall dels Sentits de Itinerànnia llega hasta Sant Andreu de Porreres (8,2 km, 341 m y unas 3 h), sin subir a la cima.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puig Ou des de la vall del Bac?',
				resposta:
					"El blog A la una a casa hi va trigar 2 h 15 min des de l'hostal de la Vall del Bac, i 4 h 25 min de marxa per a tota la volta amb el Talló (14,2 km i 1.055 m de desnivell acumulat). És l'horari d'una sortida concreta, del 2013, no un temps oficial."
			},
			{
				pregunta: 'Cal posar les mans per fer el cim?',
				resposta:
					"Segons aquesta ressenya, sí: poc abans del cim hi ha una petita cresta de rocs on cal ajudar-se de les mans. Muntanya i Natura, que el considera de poca dificultat tècnica, parla d'algun pas aeri."
			},
			{
				pregunta: 'Es pot pujar al Puig Ou amb nens?',
				resposta:
					"No és el cim més indicat: la pujada és molt dreta, té un tram sense camí i un pas de mans. Per a una sortida familiar a la mateixa vall, la ruta d'Itinerànnia fins a Sant Andreu de Porreres és més adequada."
			},
			{
				pregunta: 'Què és el Talló?',
				resposta:
					"El cim veí, una mica més baix, a l'altra banda de Sant Andreu de Porreres. Les dues fonts que descriuen la pujada al Puig Ou hi enllacen el Talló en una mateixa circular."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puig Ou desde el valle del Bac?',
				resposta:
					'El blog A la una a casa tardó 2 h 15 min desde el hostal de la Vall del Bac, y 4 h 25 min de marcha para toda la vuelta con el Talló (14,2 km y 1.055 m de desnivel acumulado). Es el horario de una salida concreta, de 2013, no un tiempo oficial.'
			},
			{
				pregunta: '¿Hay que poner las manos para hacer la cima?',
				resposta:
					'Según esa reseña, sí: poco antes de la cima hay una pequeña cresta de rocas donde hay que ayudarse de las manos. Muntanya i Natura, que lo considera de poca dificultad técnica, habla de algún paso aéreo.'
			},
			{
				pregunta: '¿Se puede subir al Puig Ou con niños?',
				resposta:
					'No es la cima más indicada: la subida es muy empinada, tiene un tramo sin camino y un paso de manos. Para una salida familiar en el mismo valle, la ruta de Itinerànnia hasta Sant Andreu de Porreres es más adecuada.'
			},
			{
				pregunta: '¿Qué es el Talló?',
				resposta:
					'La cima vecina, algo más baja, al otro lado de Sant Andreu de Porreres. Las dos fuentes que describen la subida al Puig Ou enlazan el Talló en una misma circular.'
			}
		]
	},
	fonts: [VIQUIPEDIA, MUNTANYA_NATURA, BLOG, ITINERANNIA],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
