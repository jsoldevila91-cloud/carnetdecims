import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const GALLIFA_ERMITA = {
	nom: 'Ajuntament de Gallifa: ermita de Sant Sadurní',
	url: 'https://www.gallifa.cat/el-municipi/turisme/llocs-dinteres/ermita-de-sant-sadurni.html',
	consultat: CONSULTAT
};

const GALLIFA_RUTA = {
	nom: 'Ajuntament de Gallifa: ruta Sant Sadurní de Gallifa',
	url: 'https://www.gallifa.cat/el-municipi/turisme/rutes/sant-sadurni-de-gallifa.html',
	consultat: CONSULTAT
};

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Sant Sadurní de Gallifa',
	url: 'https://ca.wikipedia.org/wiki/Sant_Sadurn%C3%AD_de_Gallifa',
	consultat: CONSULTAT
};

const CODINES = {
	nom: 'Ajuntament de Sant Feliu de Codines: Sant Sadurní (Gallifa)',
	url: 'https://www.santfeliudecodines.cat/turisme/llocs-dinteres/sant-sadurni-gallifa.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'sant-sadurni-de-gallifa',
	descripcio: {
		ca: [
			"Sant Sadurní de Gallifa és l'ermita que corona la Mola, al municipi de Gallifa, al [Vallès Occidental](/comarques/valles-occidental). Segons la Viquipèdia, dona nom als cingles de Sant Sadurní, que envolten gairebé tota la Mola. Al Vallès Occidental hi ha també [el Puig de la Creu](/cims/puig-de-la-creu) i [la Mola de Sant Llorenç del Munt](/cims/la-mola-de-sant-llorenc-del-munt), un altre cim amb el mateix nom.",
			"L'Ajuntament de Gallifa data l'ermita al segle XI i diu que ja s'esmenta el 939; el 1316 era un petit priorat del monestir de Sant Pere de la Portella, de la diòcesi d'Urgell. La Viquipèdia la descriu com una capella preromànica del segle X, amb absis de finals del segle XI i nau única coberta amb volta de canó, i recull que el 1604 el bisbe va prohibir-hi dir missa. L'edifici s'aixeca dins d'una fortificació de la qual només queda un tros de mur.",
			"A tocar de l'ermita hi ha el mirador de la Guineu. L'Ajuntament de Gallifa parla d'una panoràmica excel·lent sobre el Vallès i el Moianès des del cim de la Mola, i de vistes del Prepirineu, Moià, Centelles i el Puigsagordi des del mirador.",
			"Segons la Viquipèdia, s'hi arriba a peu per diversos camins que surten de Castellterçol, de Gallifa o de Sant Feliu de Codines. L'Ajuntament de Gallifa proposa una ruta senderista que dona la volta a Sant Sadurní de Gallifa; l'Ajuntament de Sant Feliu de Codines, una pujada des de la pista d'accés a la Roca."
		],
		es: [
			'Sant Sadurní de Gallifa es la ermita que corona la Mola, en el municipio de Gallifa, en el [Vallès Occidental](/comarques/valles-occidental). Según la Viquipèdia, da nombre a los cingles de Sant Sadurní, que rodean casi toda la Mola. En el Vallès Occidental están también [el Puig de la Creu](/cims/puig-de-la-creu) y [la Mola de Sant Llorenç del Munt](/cims/la-mola-de-sant-llorenc-del-munt), otra cima con el mismo nombre.',
			'El Ayuntamiento de Gallifa data la ermita en el siglo XI y dice que ya se menciona en 939; en 1316 era un pequeño priorato del monasterio de Sant Pere de la Portella, de la diócesis de Urgell. La Viquipèdia la describe como una capilla prerrománica del siglo X, con ábside de finales del siglo XI y nave única cubierta con bóveda de cañón, y recoge que en 1604 el obispo prohibió decir misa en ella. El edificio se alza dentro de una fortificación de la que solo queda un trozo de muro.',
			'Junto a la ermita está el mirador de la Guineu. El Ayuntamiento de Gallifa habla de una panorámica excelente sobre el Vallès y el Moianès desde la cima de la Mola, y de vistas del Prepirineo, Moià, Centelles y el Puigsagordi desde el mirador.',
			'Según la Viquipèdia, se llega a pie por varios caminos que salen de Castellterçol, de Gallifa o de Sant Feliu de Codines. El Ayuntamiento de Gallifa propone una ruta senderista que da la vuelta a Sant Sadurní de Gallifa; el Ayuntamiento de Sant Feliu de Codines, una subida desde la pista de acceso a la Roca.'
		]
	},
	rutes: [
		{
			id: 'sant-feliu-de-codines',
			nom: {
				ca: "Des de la pista d'accés a la Roca (Sant Feliu de Codines)",
				es: 'Desde la pista de acceso a la Roca (Sant Feliu de Codines)'
			},
			sortida: {
				nom: "Inici de la pista d'accés a la Roca, entre Sant Feliu de Codines i Gallifa"
			},
			descripcio: {
				ca: "L'Ajuntament de Sant Feliu de Codines descriu un itinerari de 8,2 km, 2 h 50 min i 860 m de desnivell acumulat (+430 m, -430 m), que surt de la pista d'accés a la Roca. Segons la fitxa, hi ha trams molt erosionats i d'altres de llargs i planers, la pujada és força suau, i al collet de Sant Sadurní, que arriba a l'1 h 40 min, es continua pel camí de pujada fins a la cinglera i el mirador. Són xifres de tot l'itinerari, no de la pujada.",
				es: 'El Ayuntamiento de Sant Feliu de Codines describe un itinerario de 8,2 km, 2 h 50 min y 860 m de desnivel acumulado (+430 m, -430 m), que sale de la pista de acceso a la Roca. Según la ficha, hay tramos muy erosionados y otros largos y llanos, la subida es bastante suave, y en el collet de Sant Sadurní, que se alcanza a la 1 h 40 min, se continúa por el camino de subida hasta el cingle y el mirador. Son cifras de todo el itinerario, no de la subida.'
			},
			fonts: [CODINES]
		},
		{
			id: 'gallifa-volta',
			nom: {
				ca: 'Ruta senderista que dona la volta a Sant Sadurní de Gallifa',
				es: 'Ruta senderista que da la vuelta a Sant Sadurní de Gallifa'
			},
			sortida: { nom: 'Gallifa' },
			descripcio: {
				ca: "L'Ajuntament de Gallifa recull una ruta senderista circular que dona la volta a Sant Sadurní de Gallifa, amb un enllaç al track.",
				es: 'El Ayuntamiento de Gallifa recoge una ruta senderista circular que da la vuelta a Sant Sadurní de Gallifa, con un enlace al track.'
			},
			fonts: [GALLIFA_RUTA]
		}
	],
	consells: {
		ca: [
			"L'Ajuntament de Sant Feliu de Codines descriu trams molt erosionats al camí: vigila els peus, sobretot a la baixada.",
			'No confonguis aquesta Mola amb la de Sant Llorenç del Munt: són dos cims diferents i amb camins diferents.',
			"Quan arribis al mirador de la Guineu, no t'acostis a la vora del cingle.",
			'Tria la sortida amb el mapa a la mà: hi ha camins des de Castellterçol, Gallifa i Sant Feliu de Codines, segons la Viquipèdia.',
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'El Ayuntamiento de Sant Feliu de Codines describe tramos muy erosionados en el camino: vigila los pies, sobre todo en la bajada.',
			'No confundas esta Mola con la de Sant Llorenç del Munt: son dos cimas distintas y con caminos distintos.',
			'Cuando llegues al mirador de la Guineu, no te acerques al borde del cingle.',
			'Elige la salida con el mapa en la mano: hay caminos desde Castellterçol, Gallifa y Sant Feliu de Codines, según la Viquipèdia.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Sant Sadurní de Gallifa?',
				resposta:
					"L'Ajuntament de Sant Feliu de Codines dona 2 h 50 min per a l'itinerari de 8,2 km des de la pista d'accés a la Roca, i el collet de Sant Sadurní s'hi troba a l'1 h 40 min."
			},
			{
				pregunta: "Quina història té l'ermita?",
				resposta:
					"L'Ajuntament de Gallifa la data al segle XI i la documenta el 939; el 1316 era un priorat de Sant Pere de la Portella. La Viquipèdia la descriu com una capella preromànica."
			},
			{
				pregunta: 'Hi ha mirador?',
				resposta:
					"Sí, el mirador de la Guineu, a tocar de l'ermita, segons l'Ajuntament de Gallifa."
			},
			{
				pregunta: 'Sant Sadurní de Gallifa és un cim essencial?',
				resposta:
					"Sí. Al [Vallès Occidental](/comarques/valles-occidental) l'acompanyen [el Puig de la Creu](/cims/puig-de-la-creu) i [Castellsapera](/cims/castellsapera)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Sant Sadurní de Gallifa?',
				resposta:
					'El Ayuntamiento de Sant Feliu de Codines da 2 h 50 min para el itinerario de 8,2 km desde la pista de acceso a la Roca, y el collet de Sant Sadurní se encuentra a la 1 h 40 min.'
			},
			{
				pregunta: '¿Qué historia tiene la ermita?',
				resposta:
					'El Ayuntamiento de Gallifa la data en el siglo XI y la documenta en 939; en 1316 era un priorato de Sant Pere de la Portella. La Viquipèdia la describe como una capilla prerrománica.'
			},
			{
				pregunta: '¿Hay mirador?',
				resposta:
					'Sí, el mirador de la Guineu, junto a la ermita, según el Ayuntamiento de Gallifa.'
			},
			{
				pregunta: '¿Sant Sadurní de Gallifa es una cima esencial?',
				resposta:
					'Sí. En el [Vallès Occidental](/comarques/valles-occidental) lo acompañan [el Puig de la Creu](/cims/puig-de-la-creu) y [Castellsapera](/cims/castellsapera).'
			}
		]
	},
	fonts: [GALLIFA_ERMITA, GALLIFA_RUTA, VIQUIPEDIA, CODINES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
