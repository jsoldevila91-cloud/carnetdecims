import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

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
			"La Creu de Gurb és el turó que corona el terme de Gurb, a l'[Osona](/comarques/osona), a prop de Vic. Porta dos noms: el de la creu de ferro que el corona des de fa més d'un segle, segons D'excursió per Catalunya, i el de Turó del Castell de Gurb, que és el que fa servir l'Ajuntament en les rutes de pujada. Dins de la comarca hi ha més cims essencials, com [el Castell de Milany](/cims/castell-de-milany) i [la Rocallarga](/cims/rocallarga).",
			"La Viquipèdia explica que el castell s'alça darrere mateix de la vella església parroquial de Sant Andreu: la primera menció és de l'any 886, com a castrum Gorbi, i el 1273 s'hi documenta una capella dedicada a Sant Esteve. Avui només en queden les bases dels murs, una torre i una cisterna; una excavació del 1968 va deixar al descobert la base d'una gran torre circular. El conjunt és bé cultural d'interès nacional.",
			"El turó és una sortida curta des del poble. L'Ajuntament de Gurb recull dues rutes de pujada al turó del castell: una de 3,5 km des de la Zona Esportiva, i una de 3,6 km des de l'Ausoneta, amb un camí en ziga-zaga que arriba al castell des de la masia del Romeu. Totnens en proposa dues més, des del Bosc Encantat i des de l'església de Sant Andreu, totes dues d'anada i tornada pel mateix camí.",
			"D'excursió per Catalunya avisa que alguns trams són costeruts, amb girs pronunciats i arrels que sobresurten. Als nens petits que no estan acostumats a caminar, Totnens adverteix que la ruta els pot resultar dura."
		],
		es: [
			"La Creu de Gurb es el cerro que corona el término de Gurb, en [Osona](/comarques/osona), cerca de Vic. Tiene dos nombres: el de la cruz de hierro que lo corona desde hace más de un siglo, según D'excursió per Catalunya, y el de Turó del Castell de Gurb, que es el que usa el Ayuntamiento en las rutas de subida. Dentro de la comarca hay más cimas esenciales, como [el Castell de Milany](/cims/castell-de-milany) y [la Rocallarga](/cims/rocallarga).",
			'La Viquipèdia explica que el castillo se alza justo detrás de la vieja iglesia parroquial de Sant Andreu: la primera mención es del año 886, como castrum Gorbi, y en 1273 se documenta una capilla dedicada a Sant Esteve. Hoy solo quedan las bases de los muros, una torre y una cisterna; una excavación de 1968 dejó al descubierto la base de una gran torre circular. El conjunto es bien cultural de interés nacional.',
			"El cerro es una salida corta desde el pueblo. El Ayuntamiento de Gurb recoge dos rutas de subida al cerro del castillo: una de 3,5 km desde la Zona Esportiva, y una de 3,6 km desde l'Ausoneta, con un camino en zigzag que llega al castillo desde la masía del Romeu. Totnens propone dos más, desde el Bosc Encantat y desde la iglesia de Sant Andreu, ambas de ida y vuelta por el mismo camino.",
			"D'excursió per Catalunya avisa de que algunos tramos son empinados, con giros pronunciados y raíces que sobresalen. A los niños pequeños que no están acostumbrados a caminar, Totnens advierte que la ruta les puede resultar dura."
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
				ca: "Ruta de pujada de l'Ajuntament de Gurb: surt de la Zona Esportiva per un camí asfaltat que va a la masia de Cal Corbo i després per un camí poc marcat entre camps de conreu, i continua per un sender i un bosc de ribera. Enfila el turó del castell. Dona 3,5 km.",
				es: 'Ruta de subida del Ayuntamiento de Gurb: sale de la Zona Esportiva por un camino asfaltado que va a la masía de Cal Corbo y después por un camino poco marcado entre campos de cultivo, y continúa por un sendero y un bosque de ribera. Sube al cerro del castillo. Da 3,5 km.'
			},
			fonts: [GURB_ZONA_ESPORTIVA]
		},
		{
			id: 'ausoneta',
			nom: {
				ca: "Des de l'Ausoneta per la masia del Romeu",
				es: "Desde l'Ausoneta por la masía del Romeu"
			},
			sortida: { nom: "l'Ausoneta (Gurb)" },
			descripcio: {
				ca: "Altra ruta de pujada de l'Ajuntament: surt de l'Ausoneta, travessa conreus i el torrent de l'Esperança i, a la masia del Romeu, un camí en ziga-zaga puja fins al castell de Gurb. Són 3,6 km.",
				es: "Otra ruta de subida del Ayuntamiento: sale de l'Ausoneta, atraviesa cultivos y el torrent de l'Esperança y, en la masía del Romeu, un camino en zigzag sube hasta el castillo de Gurb. Son 3,6 km."
			},
			fonts: [GURB_AUSONETA]
		},
		{
			id: 'vic-circular',
			nom: {
				ca: 'Circular des de Vic pel camí dels Sis Pins',
				es: 'Circular desde Vic por el camí dels Sis Pins'
			},
			sortida: { nom: 'Aparcament del Col·legi Andersen (Vic)' },
			descripcio: {
				ca: "D'excursió per Catalunya la proposa com a circular que surt de l'aparcament del Col·legi Andersen, a Vic: 9,92 km, +374 m i 2 h 07 min, de dificultat moderada. L'últim tram passa pels Terrassos Blancs, i la baixada més directa és pel camí dels Sis Pins. Les xifres són de la circular sencera.",
				es: "D'excursió per Catalunya la propone como circular que sale del aparcamiento del Col·legi Andersen, en Vic: 9,92 km, +374 m y 2 h 07 min, de dificultad moderada. El último tramo pasa por los Terrassos Blancs, y la bajada más directa es por el camí dels Sis Pins. Las cifras son de la circular entera."
			},
			fonts: [DEXCURSIO]
		}
	],
	consells: {
		ca: [
			"Alguns trams són costeruts, amb girs pronunciats i arrels que sobresurten, segons D'excursió per Catalunya: vigila els peus, sobretot a la baixada.",
			"Si surts de la Zona Esportiva, el camí entre camps és poc marcat, segons l'Ajuntament: segueix la descripció.",
			'Amb nens que no estan acostumats a caminar, Totnens avisa que la ruta pot resultar-los dura; ves-hi amb calma.',
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			"Algunos tramos son empinados, con giros pronunciados y raíces que sobresalen, según D'excursió per Catalunya: vigila los pies, sobre todo en la bajada.",
			'Si sales de la Zona Esportiva, el camino entre campos está poco marcado, según el Ayuntamiento: sigue la descripción.',
			'Con niños que no están acostumbrados a caminar, Totnens avisa de que la ruta puede resultarles dura; ve con calma.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Creu de Gurb?',
				resposta:
					"L'Ajuntament de Gurb dona 3,5 km de pujada des de la Zona Esportiva i 3,6 km des de l'Ausoneta, sense indicar-ne el temps. D'excursió per Catalunya compta 2 h 07 min per a la circular de 9,92 km des de Vic."
			},
			{
				pregunta: 'Es pot pujar a la Creu de Gurb amb nens?',
				resposta:
					'Totnens el proposa com una ruta majoritàriament fàcil per a famílies, amb un tram de pujada forta, i avisa que pot ser dura per als més petits que no estan acostumats a caminar.'
			},
			{
				pregunta: 'Què hi ha al cim?',
				resposta:
					'Les restes del castell de Gurb, amb les bases dels murs, una torre i una cisterna, i la gran creu de ferro que corona el turó, segons la Viquipèdia.'
			},
			{
				pregunta: 'La Creu de Gurb és un cim essencial?',
				resposta:
					"Sí. A l'[Osona](/comarques/osona) l'acompanyen [el Castell de Milany](/cims/castell-de-milany) i [la Rocallarga](/cims/rocallarga)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Creu de Gurb?',
				resposta:
					"El Ayuntamiento de Gurb da 3,5 km de subida desde la Zona Esportiva y 3,6 km desde l'Ausoneta, sin indicar el tiempo. D'excursió per Catalunya cuenta 2 h 07 min para la circular de 9,92 km desde Vic."
			},
			{
				pregunta: '¿Se puede subir a la Creu de Gurb con niños?',
				resposta:
					'Totnens lo propone como una ruta mayoritariamente fácil para familias, con un tramo de subida fuerte, y avisa de que puede ser dura para los más pequeños que no están acostumbrados a caminar.'
			},
			{
				pregunta: '¿Qué hay en la cima?',
				resposta:
					'Los restos del castillo de Gurb, con las bases de los muros, una torre y una cisterna, y la gran cruz de hierro que corona el cerro, según la Viquipèdia.'
			},
			{
				pregunta: '¿La Creu de Gurb es una cima esencial?',
				resposta:
					'Sí. En [Osona](/comarques/osona) la acompañan [el Castell de Milany](/cims/castell-de-milany) y [la Rocallarga](/cims/rocallarga).'
			}
		]
	},
	fonts: [VIQUIPEDIA, GURB_ZONA_ESPORTIVA, GURB_AUSONETA, TOTNENS, DEXCURSIO],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
