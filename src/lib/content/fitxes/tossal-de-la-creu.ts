import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Tossal de la Creu (Segarra)',
	url: 'https://ca.wikipedia.org/wiki/Tossal_de_la_Creu_(Segarra)',
	consultat: CONSULTAT
};

const DECIMENCIM = {
	nom: 'De cim en cim: Tossal de la Creu',
	url: 'https://www.decimencim.cat/2022/11/tossal-de-la-creu/',
	consultat: CONSULTAT
};

const ELS_100_CIMS = {
	nom: 'El repte dels 100 cims: Tossal de la Creu',
	url: 'https://els100cims.blogspot.com/2014/08/tossal-de-la-creu.html',
	consultat: CONSULTAT
};

const ELS_NOSTRES_CENT_CIMS = {
	nom: 'Els nostres cent cims: Tossal de la Creu (Segarra)',
	url: 'https://elsnostrescentcims.blogspot.com/2013/07/tossal-de-la-creu-segarra.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tossal-de-la-creu',
	descripcio: {
		ca: [
			"El Tossal de la Creu, també conegut com a Tossal de Puig-redon, és un turó que s'aixeca entre els termes de Biosca i Torà, al nord de la serra de l'Aguda. L'ICGC situa Torà i Biosca al [Solsonès](/comarques/solsones), tot i que la FEEC i alguns blogs el posen a la Segarra. És el més baix dels tres cims essencials del Solsonès.",
			'És un turó baix, de margues, calcàries i gresos segons la Viquipèdia, voltat de camps de secà. Dalt hi ha un vèrtex geodèsic, una bandera gastada i una creu sobre una columna de pedra; De cim en cim explica que es van fer la foto a la creu, tot i que el punt més alt és el vèrtex. No hi ha senyalització: la pujada segueix un camí tènue amb fites.',
			"Durant la pujada, segons De cim en cim, es veuen el Soler, la plana i el Tossal Sud; Els nostres cent cims afegeix que el tossal es distingeix bé en acostar-se a les Freixes. No és un cim de grans panoràmiques, i amb boira, com la que va trobar l'autor d'El repte dels 100 cims l'agost de 2014, no es veu res. Aquest mateix blog proposa combinar-lo amb altres cims propers, com la serra de Pinós o el castell de Boixadors.",
			"Es pot fer tot l'any; a l'estiu, millor a primera hora per evitar la calor. El repte dels 100 cims en valora la dificultat com a molt baixa (esforç 1 sobre 5) i l'orientació com a fàcil, però avisa que l'accés en cotxe per pistes és confús i que la baixada no està marcada."
		],
		es: [
			'El Tossal de la Creu, también conocido como Tossal de Puig-redon, es un cerro que se alza entre los términos de Biosca y Torà, al norte de la serra de l’Aguda. El ICGC sitúa Torà y Biosca en el [Solsonès](/comarques/solsones), aunque la FEEC y algunos blogs lo ponen en la Segarra. Es el más bajo de las tres cimas esenciales del Solsonès.',
			'Es un cerro bajo, de margas, calizas y areniscas según la Viquipèdia, rodeado de campos de secano. Arriba hay un vértice geodésico, una bandera gastada y una cruz sobre una columna de piedra; De cim en cim explica que se hicieron la foto en la cruz, aunque el punto más alto es el vértice. No hay señalización: la subida sigue un camino tenue con hitos.',
			'Durante la subida, según De cim en cim, se ven el Soler, la llanura y el Tossal Sud; Els nostres cent cims añade que el cerro se distingue bien al acercarse a les Freixes. No es una cima de grandes panorámicas, y con niebla, como la que encontró el autor de El repte dels 100 cims en agosto de 2014, no se ve nada. Ese mismo blog propone combinarlo con otras cimas cercanas, como la serra de Pinós o el castillo de Boixadors.',
			'Se puede hacer todo el año; en verano, mejor a primera hora para evitar el calor. El repte dels 100 cims valora la dificultad como muy baja (esfuerzo 1 sobre 5) y la orientación como fácil, pero avisa de que el acceso en coche por pistas es confuso y de que la bajada no está marcada.'
		]
	},
	rutes: [
		{
			id: 'presa-del-duc',
			nom: {
				ca: 'Circular des de la presa del Duc (Torà)',
				es: 'Circular desde la presa del Duc (Torà)'
			},
			sortida: { nom: 'Presa del Duc (Torà)' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "De cim en cim proposa una circular d'11 km i 540 m de desnivell acumulat, fàcil, de 3 h 2 min en total (2 h 28 min en moviment). Surt per un sender marcat que, abans del primer quilòmetre, s'enfila amb petites grimpades en trams rocosos, que els autors superen sense problemes; després segueix pistes i, prop del Soler, puja al cim per un camí de fites que no sempre es troben. La baixada és més dreta i menys clara que la pujada: els autors la van improvisar en part seguint el track.",
				es: 'De cim en cim propone una circular de 11 km y 540 m de desnivel acumulado, fácil, de 3 h 2 min en total (2 h 28 min en movimiento). Sale por un sendero marcado que, antes del primer kilómetro, sube con pequeñas trepadas en tramos rocosos, que los autores superan sin problemas; después sigue pistas y, cerca del Soler, sube a la cima por un camino de hitos que no siempre se encuentran. La bajada es más empinada y menos clara que la subida: los autores la improvisaron en parte siguiendo el track.'
			},
			fonts: [DECIMENCIM]
		},
		{
			id: 'mas-el-soler',
			nom: {
				ca: 'Circular curta des del Mas el Soler',
				es: 'Circular corta desde el Mas el Soler'
			},
			sortida: { nom: 'Mas el Soler (Torà)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "El repte dels 100 cims fa una circular de 2,8 km i uns 74 m de pujada acumulada (48 min caminant, 1 h 45 min amb parades), pel Soler, la carena, el tossal, les Freixes, els Plans i el Tros dels Cirerers. S'hi arriba amb cotxe per pistes que despisten, de manera que l'autor ofereix un track. La pujada segueix un camí tènue amb fites; la baixada té poca senyalització i convé tenir una mica d'experiència.",
				es: 'El repte dels 100 cims hace una circular de 2,8 km y unos 74 m de subida acumulada (48 min caminando, 1 h 45 min con paradas), por el Soler, la cresta, el tossal, les Freixes, els Plans y el Tros dels Cirerers. Se llega en coche por pistas que despistan, de modo que el autor ofrece un track. La subida sigue un camino tenue con hitos; la bajada tiene poca señalización y conviene tener algo de experiencia.'
			},
			fonts: [ELS_100_CIMS, ELS_NOSTRES_CENT_CIMS]
		}
	],
	consells: {
		ca: [
			"Descarrega el track abans de sortir: l'accés per pistes i el camí de pujada amb fites despisten, i la baixada del cim no està gens clara.",
			'De cim en cim recomana vorejar els camps de conreu per no trepitjar el sembrat.',
			'A Cal Verdaguer, De cim en cim hi va trobar tres gossos sorollosos i deslligats: passa-hi amb calma.',
			'No hi ha fonts a la ruta, segons El repte dels 100 cims: porta aigua.',
			'A la circular de la presa del Duc, un dels trencalls té un senyal de camí tancat i un pas amb cadena que costa de veure: segueix el track.'
		],
		es: [
			'Descarga el track antes de salir: el acceso por pistas y el camino de subida con hitos despistan, y la bajada de la cima no está nada clara.',
			'De cim en cim recomienda bordear los campos de cultivo para no pisar el sembrado.',
			'En Cal Verdaguer, De cim en cim encontró tres perros ruidosos y sueltos: pasa con calma.',
			'No hay fuentes en la ruta, según El repte dels 100 cims: lleva agua.',
			'En la circular de la presa del Duc, uno de los desvíos tiene una señal de camino cerrado y un paso con cadena que cuesta ver: sigue el track.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Tossal de la Creu?',
				resposta:
					"Depèn de la sortida: El repte dels 100 cims fa una circular de 2,8 km i 74 m de pujada en 48 min caminant; De cim en cim, una de més llarga d'11 km i 540 m des de la presa del Duc en 2 h 28 min en moviment."
			},
			{
				pregunta: 'És a la Segarra o al Solsonès?',
				resposta:
					"La Viquipèdia i l'ICGC el situen al Solsonès, entre Biosca i Torà; la FEEC i alguns blogs el posen a la Segarra. El catàleg d'aquesta web segueix l'ICGC."
			},
			{
				pregunta: 'És una ruta senyalitzada?',
				resposta:
					'No. El repte dels 100 cims indica que no hi ha cap senyalització i que el camí de pujada és tènue, amb fites; la baixada tampoc està marcada. Convé portar un track.'
			},
			{
				pregunta: 'El Tossal de la Creu compta com a cim essencial?',
				resposta:
					'Sí. És el més baix dels tres essencials del Solsonès, per sota del [Cogul](/cims/el-cogul) i del [Puig de les Morreres](/cims/puig-de-les-morreres).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Tossal de la Creu?',
				resposta:
					'Depende de la salida: El repte dels 100 cims hace una circular de 2,8 km y 74 m de subida en 48 min caminando; De cim en cim, una más larga de 11 km y 540 m desde la presa del Duc en 2 h 28 min en movimiento.'
			},
			{
				pregunta: '¿Está en la Segarra o en el Solsonès?',
				resposta:
					'La Viquipèdia y el ICGC lo sitúan en el Solsonès, entre Biosca y Torà; la FEEC y algunos blogs lo ponen en la Segarra. El catálogo de esta web sigue al ICGC.'
			},
			{
				pregunta: '¿Es una ruta señalizada?',
				resposta:
					'No. El repte dels 100 cims indica que no hay ninguna señalización y que el camino de subida es tenue, con hitos; la bajada tampoco está marcada. Conviene llevar un track.'
			},
			{
				pregunta: '¿El Tossal de la Creu cuenta como cima esencial?',
				resposta:
					'Sí. Es el más bajo de los tres esenciales del Solsonès, por debajo del [Cogul](/cims/el-cogul) y del [Puig de les Morreres](/cims/puig-de-les-morreres).'
			}
		]
	},
	fonts: [VIQUIPEDIA, DECIMENCIM, ELS_100_CIMS, ELS_NOSTRES_CENT_CIMS],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
