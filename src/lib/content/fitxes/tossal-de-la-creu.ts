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
			"El Tossal de la Creu, també conegut com a Tossal de Puig-redon, és un turó de 658 m que s'aixeca entre els termes de Biosca i Torà, al nord de la serra de l'Aguda. L'ICGC situa Torà i Biosca al [Solsonès](/comarques/solsones), tot i que la FEEC i alguns blogs el posen a la Segarra. És el més baix dels tres cims essencials del Solsonès.",
			"És un turó baix, entre camps de conreu. Segons la Viquipèdia, és de margues, calcàries i gresos. Al cim hi ha un vèrtex geodèsic, una bandera i una creu de metall; De cim en cim explica que la creu és la que van triar per a la foto oficial del cim, tot i que el punt més alt és el vèrtex. El camí, sense senyalització oficial, es guia amb fites de pedra que l'autor demana de mantenir i engrandir.",
			"Les vistes són sobre la plana i el Soler; durant la pujada es veu el Tossal Sud, un altre cim proper. Un altre blog diu que el tossal es veu clarament en acostar-se a les Freixes. Els dies de boira, com el de l'ascensió d'agost de 2014, no es veu res. Si vols aprofitar la sortida, els blogs proposen combinar-lo amb altres cims del repte de la zona, i el poble de Torà mereix una parada.",
			"Els 100 cims valora la dificultat com a molt baixa (esforç 1 sobre 5) i la orientació com a fàcil, però ressalta que l'accés en cotxe per pistes és confús i que la baixada és poc clara."
		],
		es: [
			'El Tossal de la Creu, también conocido como Tossal de Puig-redon, es un cerro de 658 m que se alza entre los términos de Biosca y Torà, al norte de la serra de l’Aguda. El ICGC sitúa Torà y Biosca en el [Solsonès](/comarques/solsones), aunque la FEEC y algunos blogs lo ponen en la Segarra. Es el más bajo de las tres cimas esenciales del Solsonès.',
			'Es un cerro bajo, entre campos de cultivo. Según la Viquipèdia, es de margas, calizas y areniscas. En la cima hay un vértice geodésico, una bandera y una cruz de metal; De cim en cim explica que la cruz es la que eligieron para la foto oficial de la cima, aunque el punto más alto es el vértice. El camino, sin señalización oficial, se guía con hitos de piedra que el autor pide mantener y ampliar.',
			'Las vistas son sobre la llanura y el Soler; durante la subida se ve el Tossal Sud, otra cima cercana. Otro blog dice que el cerro se ve claramente al acercarse a les Freixes. En días de niebla, como el de la ascensión de agosto de 2014, no se ve nada. Si quieres aprovechar la salida, los blogs proponen combinarlo con otras cimas del reto de la zona, y el pueblo de Torà merece una parada.',
			'Els 100 cims valora la dificultad como muy baja (esfuerzo 1 sobre 5) y la orientación como fácil, pero resalta que el acceso en coche por pistas es confuso y que la bajada es poco clara.'
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
				ca: "De cim en cim proposa una circular d'11 km i 540 m de desnivell acumulat, fàcil, de 3 h 2 min en total (2 h 28 min en moviment). Surt per un camí marcat que s'enfila amb petites grimpades de roca durant el primer quilòmetre, segueix pistes i, prop del Soler, deixa la pista per un camí de fites difícils de trobar fins al cim. La baixada és el tram més empinat i menys clar: l'autor es va guiar amb fites i GPS.",
				es: 'De cim en cim propone una circular de 11 km y 540 m de desnivel acumulado, fácil, de 3 h 2 min en total (2 h 28 min en movimiento). Sale por un camino marcado que sube con pequeñas trepadas de roca durante el primer kilómetro, sigue pistas y, cerca del Soler, deja la pista por un camino de hitos difíciles de encontrar hasta la cima. La bajada es el tramo más empinado y menos claro: el autor se guió con hitos y GPS.'
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
				ca: "Els 100 cims fa una circular de 2,8 km i uns 74 m de pujada acumulada (48 min caminant, 1 h 45 min amb parades), pel Soler, la carena, el tossal, les Freixes, els Plans i el Tros dels Cirerers. S'hi arriba amb cotxe per pistes que despisten, de manera que l'autor ofereix un track. La pujada segueix un camí tènue amb fites; la baixada té poca senyalització i convé tenir una mica d'experiència.",
				es: 'Els 100 cims hace una circular de 2,8 km y unos 74 m de subida acumulada (48 min caminando, 1 h 45 min con paradas), por el Soler, la cresta, el tossal, les Freixes, els Plans y el Tros dels Cirerers. Se llega en coche por pistas que despistan, de modo que el autor ofrece un track. La subida sigue un camino tenue con hitos; la bajada tiene poca señalización y conviene tener algo de experiencia.'
			},
			fonts: [ELS_100_CIMS, ELS_NOSTRES_CENT_CIMS]
		}
	],
	consells: {
		ca: [
			"Descarrega el track abans de sortir: l'accés per pistes i el camí de pujada amb fites despisten, i la baixada del cim no està gens clara.",
			'De cim en cim recomana evitar els camps de conreu que es creuen: segueix els camins.',
			'Un blog avisa que, prop de Cal Verdaguer, hi ha gossos que borden però no són agressius; fes-hi pas sense córrer.',
			'No hi ha fonts a la ruta, segons Els 100 cims: porta aigua.',
			"Una ressenya del 2021 va haver de girar cua prop del molí del Fontanet per un camí cobert de vegetació: comprova l'estat del tram abans d'afegir-lo a la ruta."
		],
		es: [
			'Descarga el track antes de salir: el acceso por pistas y el camino de subida con hitos despistan, y la bajada de la cima no está nada clara.',
			'De cim en cim recomienda evitar los campos de cultivo que se cruzan: sigue los caminos.',
			'Un blog avisa de que, cerca de Cal Verdaguer, hay perros que ladran pero no son agresivos; pasa sin correr.',
			'No hay fuentes en la ruta, según Els 100 cims: lleva agua.',
			'Una reseña de 2021 tuvo que dar la vuelta cerca del molino del Fontanet por un camino cubierto de vegetación: comprueba el estado del tramo antes de añadirlo a la ruta.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Tossal de la Creu?',
				resposta:
					"Depèn de la sortida: Els 100 cims fa una circular de 2,8 km i 74 m de pujada en 48 min caminant; De cim en cim, una de més llarga d'11 km i 540 m des de la presa del Duc en 2 h 28 min en moviment."
			},
			{
				pregunta: 'És a la Segarra o al Solsonès?',
				resposta:
					"La Viquipèdia i l'ICGC el situen al Solsonès, entre Biosca i Torà; la FEEC i alguns blogs el posen a la Segarra. El catàleg d'aquesta web segueix l'ICGC."
			},
			{
				pregunta: 'És una ruta senyalitzada?',
				resposta:
					'No. Els 100 cims indica que no hi ha cap senyalització oficial i que el camí de pujada és tènue amb fites; la baixada és poc clara. Convé portar un track.'
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
					'Depende de la salida: Els 100 cims hace una circular de 2,8 km y 74 m de subida en 48 min caminando; De cim en cim, una más larga de 11 km y 540 m desde la presa del Duc en 2 h 28 min en movimiento.'
			},
			{
				pregunta: '¿Está en la Segarra o en el Solsonès?',
				resposta:
					'La Viquipèdia y el ICGC lo sitúan en el Solsonès, entre Biosca y Torà; la FEEC y algunos blogs lo ponen en la Segarra. El catálogo de esta web sigue al ICGC.'
			},
			{
				pregunta: '¿Es una ruta señalizada?',
				resposta:
					'No. Els 100 cims indica que no hay ninguna señalización oficial y que el camino de subida es tenue con hitos; la bajada es poco clara. Conviene llevar un track.'
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
