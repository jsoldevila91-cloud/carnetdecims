import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Castell de Gurb',
	url: 'https://ca.wikipedia.org/wiki/Castell_de_Gurb',
	consultat: CONSULTAT
};

const GURB_ZONA_ESPORTIVA = {
	nom: 'Ajuntament de Gurb: Pujada al turó del castell de Gurb, ruta des de la Zona Esportiva',
	url: 'https://www.gurb.cat/el-municipi/turisme/rutes/pujada-al-turo-del-castell-de-gurb-ruta-des-de-la-zona-esportiva-de-gurb.html',
	consultat: CONSULTAT
};

const GURB_AUSONETA = {
	nom: "Ajuntament de Gurb: Pujada al turó del castell de Gurb, ruta des de l'Ausoneta",
	url: 'https://www.gurb.cat/el-municipi/turisme/rutes/pujada-al-turo-del-castell-de-gurb-ruta-des-de-lausoneta.html',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: la Creu de Gurb',
	url: 'https://totnens.cat/que-fem/la-creu-de-gurb/',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: Creu de Gurb",
	url: 'https://dexcursio.net/creu-de-gurb/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'creu-de-gurb',
	descripcio: {
		ca: [
			"La Creu de Gurb és un turó que s'alça damunt de la plana de Vic, al centre del terme de Gurb ([Osona](/comarques/osona)). La Viquipèdia calcula que queda uns 300 m per sobre de la Plana, i per això es veu de lluny. L'Ajuntament en diu turó del Castell de Gurb; el nom popular li ve de la gran creu de ferro que, segons D'excursió per Catalunya, el corona des de fa més d'un segle. A la mateixa comarca, [Bellmunt](/cims/bellmunt) i [la Rocallarga](/cims/rocallarga) són altres cims essencials.",
			"El castell és l'origen del poble. La documentació de Vic esmenta el castrum Gorbi a partir del 886, i el 1273 hi consta una capella dedicada a sant Esteve. Segons la Viquipèdia, cap al segle XV ja devia estar abandonat com a habitatge; el 1968, un grup de veïns de Gurb hi va excavar i en va treure a la llum la base d'una gran torre circular, fragments de muralla, l'arrencada d'un arc i la cisterna. El conjunt és bé cultural d'interès nacional.",
			"El camí també té coses a veure. Al peu del turó hi ha l'església vella de Sant Andreu de Gurb, que D'excursió per Catalunya documenta des del 942, amb campanar preromànic; el Bosc Encantat, pensat per a la canalla; l'ermita de Sant Roc, del 1886, i els Terrassos Blancs, unes margues grises d'aspecte lunar. A dalt hi ha una senyera i una taula d'orientació circular instal·lada l'any 2000.",
			"És una sortida de mig dia, que D'excursió per Catalunya recomana com a matinal. Després de pluges, el corriol final, costerut i amb arrels, demana més atenció."
		],
		es: [
			"La Creu de Gurb es un cerro que se levanta sobre la plana de Vic, en el centro del término de Gurb ([Osona](/comarques/osona)). La Viquipèdia calcula que queda unos 300 m por encima de la Plana, y por eso se ve de lejos. El Ayuntamiento lo llama turó del Castell de Gurb; el nombre popular le viene de la gran cruz de hierro que, según D'excursió per Catalunya, lo corona desde hace más de un siglo. En la misma comarca, [Bellmunt](/cims/bellmunt) y [la Rocallarga](/cims/rocallarga) son otras cimas esenciales.",
			'El castillo es el origen del pueblo. La documentación de Vic menciona el castrum Gorbi a partir de 886, y en 1273 consta una capilla dedicada a san Esteban. Según la Viquipèdia, hacia el siglo XV ya debía de estar abandonado como vivienda; en 1968, un grupo de vecinos de Gurb lo excavó y sacó a la luz la base de una gran torre circular, fragmentos de muralla, el arranque de un arco y la cisterna. El conjunto es bien cultural de interés nacional.',
			"El camino también tiene cosas que ver. Al pie del cerro está la iglesia vieja de Sant Andreu de Gurb, que D'excursió per Catalunya documenta desde 942, con campanario prerrománico; el Bosc Encantat, pensado para los niños; la ermita de Sant Roc, de 1886, y los Terrassos Blancs, unas margas grises de aspecto lunar. Arriba hay una senyera y una mesa de orientación circular instalada en el año 2000.",
			"Es una salida de medio día, que D'excursió per Catalunya recomienda como matinal. Después de lluvias, el sendero final, empinado y con raíces, pide más atención."
		]
	},
	rutes: [
		{
			id: 'zona-esportiva',
			nom: {
				ca: 'Des de la Zona Esportiva de Gurb per Sant Andreu',
				es: 'Desde la Zona Esportiva de Gurb por Sant Andreu'
			},
			sortida: { nom: 'Zona Esportiva de Gurb' },
			distanciaKm: 3.5,
			descripcio: {
				ca: "És una de les dues pujades que publica l'Ajuntament de Gurb, de 3,5 km. Surt de la Zona Esportiva cap a ponent pel camí asfaltat de Cal Corbo, continua per un camí poc marcat entre camps fins a Can Jupeta i arriba a Sant Andreu de Gurb. Després de creuar el torrent del Sitjar i un bosc de ribera, s'enfila per una zona de margues blaves i agafa el sender que puja fins al turó. La fitxa municipal no en dona el desnivell ni l'horari.",
				es: 'Es una de las dos subidas que publica el Ayuntamiento de Gurb, de 3,5 km. Sale de la Zona Esportiva hacia poniente por el camino asfaltado de Cal Corbo, continúa por un camino poco marcado entre campos hasta Can Jupeta y llega a Sant Andreu de Gurb. Tras cruzar el torrente del Sitjar y un bosque de ribera, se encarama por una zona de margas azules y toma el sendero que sube hasta el cerro. La ficha municipal no da el desnivel ni el horario.'
			},
			fonts: [GURB_ZONA_ESPORTIVA]
		},
		{
			id: 'ausoneta',
			nom: {
				ca: "Des de l'Ausoneta per la masia del Romeu",
				es: "Desde l'Ausoneta por la masía del Romeu"
			},
			sortida: { nom: "L'Ausoneta (Gurb)" },
			distanciaKm: 3.6,
			descripcio: {
				ca: "L'altra pujada municipal fa 3,6 km. De l'Ausoneta passa pel pont de la C-17 i per sota de la C-25, travessa el torrent de l'Esperança i segueix el camí asfaltat fins a la masia del Romeu, on comença el sender que puja fent ziga-zagues fins al castell. Per aquest vessant baixa també el camí dels Sis Pins, que D'excursió per Catalunya descriu fins a la masia del Romeu: costerut, amb girs tancats i arrels que sobresurten.",
				es: "La otra subida municipal tiene 3,6 km. Desde l'Ausoneta pasa por el puente de la C-17 y por debajo de la C-25, cruza el torrente de l'Esperança y sigue el camino asfaltado hasta la masía del Romeu, donde empieza el sendero que sube en zigzag hasta el castillo. Por esta vertiente baja también el camí dels Sis Pins, que D'excursió per Catalunya describe hasta la masía del Romeu: empinado, con giros cerrados y raíces que sobresalen."
			},
			fonts: [GURB_AUSONETA, DEXCURSIO]
		},
		{
			id: 'vic-circular',
			nom: {
				ca: 'Circular des de Vic pel Bosc Encantat i els Terrassos Blancs',
				es: 'Circular desde Vic por el Bosc Encantat y los Terrassos Blancs'
			},
			sortida: { nom: 'Aparcament del Col·legi Andersen (Vic)' },
			descripcio: {
				ca: "D'excursió per Catalunya proposa una circular de 9,92 km, +374 m i 2 h 07 min. De Vic va per carretera estreta fins a Sant Andreu de Gurb (uns 45 min), passa pel Bosc Encantat i l'ermita de Sant Roc i puja pels Terrassos Blancs fins a un cartell on arrenca el corriol final, estret i en ziga-zaga, d'uns 20 minuts. Baixa pel camí dels Sis Pins fins a la masia del Romeu, en 20 o 25 minuts.",
				es: "D'excursió per Catalunya propone una circular de 9,92 km, +374 m y 2 h 07 min. Desde Vic va por carretera estrecha hasta Sant Andreu de Gurb (unos 45 min), pasa por el Bosc Encantat y la ermita de Sant Roc y sube por los Terrassos Blancs hasta un cartel donde arranca el sendero final, estrecho y en zigzag, de unos 20 minutos. Baja por el camí dels Sis Pins hasta la masía del Romeu, en 20 o 25 minutos."
			},
			fonts: [DEXCURSIO]
		}
	],
	consells: {
		ca: [
			"Amb nens, la sortida curta és des del Bosc Encantat: Totnens hi compta 3,8 km de ruta lineal, fàcil tret d'un tram de bosc amb força desnivell, estret i amb arrels.",
			"Si surts de la Zona Esportiva, el tram entre camps fins a Can Jupeta és poc marcat, segons l'Ajuntament: porta la descripció municipal o un mapa.",
			'El camí dels Sis Pins és la baixada més directa, però també la més dreta: si has pujat cansat, torna per on has vingut.',
			"D'excursió per Catalunya explica que es pot evitar l'última pujada forta per un sender més planer que passa pel mirador dels Terrassos.",
			"Les restes del castell són poques i baixes: mira-les sense enfilar-t'hi."
		],
		es: [
			'Con niños, la salida corta es desde el Bosc Encantat: Totnens cuenta 3,8 km de ruta lineal, fácil salvo un tramo de bosque con bastante desnivel, estrecho y con raíces.',
			'Si sales de la Zona Esportiva, el tramo entre campos hasta Can Jupeta está poco marcado, según el Ayuntamiento: lleva la descripción municipal o un mapa.',
			'El camí dels Sis Pins es la bajada más directa, pero también la más empinada: si has subido cansado, vuelve por donde has venido.',
			"D'excursió per Catalunya explica que se puede evitar la última subida fuerte por un sendero más llano que pasa por el mirador dels Terrassos.",
			'Los restos del castillo son pocos y bajos: míralos sin subirte a ellos.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Creu de Gurb?',
				resposta:
					"L'Ajuntament de Gurb publica dues pujades de 3,5 km (des de la Zona Esportiva) i 3,6 km (des de l'Ausoneta), sense horari. D'excursió per Catalunya compta 2 h 07 min per a una circular de 9,92 km i +374 m des de Vic."
			},
			{
				pregunta: 'Es pot pujar a la Creu de Gurb amb nens?',
				resposta:
					"Sí, amb calma. Totnens la considera fàcil tret d'un tram de bosc amb força desnivell, i avisa que als més petits, si no estan acostumats a caminar, se'ls pot fer costa amunt."
			},
			{
				pregunta: 'Què hi ha dalt de la Creu de Gurb?',
				resposta:
					"La creu de ferro, una senyera, una taula d'orientació i les restes del castell de Gurb: bases de murs, d'una torre circular i una cisterna, segons la Viquipèdia."
			},
			{
				pregunta: 'Què són els Terrassos Blancs?',
				resposta:
					"Unes formacions de margues de tons grisos que hi ha al vessant del turó. D'excursió per Catalunya en diu que creen una atmosfera gairebé lunar; l'Ajuntament en parla com de margues blaves."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Creu de Gurb?',
				resposta:
					"El Ayuntamiento de Gurb publica dos subidas de 3,5 km (desde la Zona Esportiva) y 3,6 km (desde l'Ausoneta), sin horario. D'excursió per Catalunya cuenta 2 h 07 min para una circular de 9,92 km y +374 m desde Vic."
			},
			{
				pregunta: '¿Se puede subir a la Creu de Gurb con niños?',
				resposta:
					'Sí, con calma. Totnens la considera fácil salvo un tramo de bosque con bastante desnivel, y avisa de que a los más pequeños, si no están acostumbrados a caminar, se les puede hacer cuesta arriba.'
			},
			{
				pregunta: '¿Qué hay en lo alto de la Creu de Gurb?',
				resposta:
					'La cruz de hierro, una senyera, una mesa de orientación y los restos del castillo de Gurb: bases de muros, de una torre circular y una cisterna, según la Viquipèdia.'
			},
			{
				pregunta: '¿Qué son los Terrassos Blancs?',
				resposta:
					"Unas formaciones de margas de tonos grises que hay en la ladera del cerro. D'excursió per Catalunya dice que crean una atmósfera casi lunar; el Ayuntamiento habla de margas azules."
			}
		]
	},
	fonts: [VIQUIPEDIA, GURB_ZONA_ESPORTIVA, GURB_AUSONETA, TOTNENS, DEXCURSIO],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
