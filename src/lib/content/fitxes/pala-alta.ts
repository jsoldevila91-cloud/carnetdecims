import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Pala Alta',
	url: 'https://ca.wikipedia.org/wiki/Pala_Alta',
	consultat: CONSULTAT
};

const FEMTURISME = {
	nom: 'Femturisme: Pala Alta des de la Mare de Déu de Montalegre',
	url: 'https://femturisme.cat/rutes/pala-alta-des-de-la-mare-de-deu-de-montalegre',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Pala Alta',
	url: 'https://reptesmuntanyencs.cat/pala-alta/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pala-alta',
	descripcio: {
		ca: [
			"La Pala Alta és el cim més alt de la serra de Mont-roig, a [la Noguera](/comarques/noguera), entre els termes de Camarasa i de les Avellanes i Santa Linya. La serra és una carena curta, orientada d'est a oest, que pel vessant sud cau en una cinglera vertical molt freqüentada pels escaladors.",
			"Al capdamunt de la carena, a ponent del cim, hi ha l'ermita de la Mare de Déu de Montalegre, punt de sortida de la volta més habitual. El cim està coronat per un vèrtex geodèsic i una caseta de guaita forestal. Sobre els cingles és fàcil veure-hi voltors i àligues.",
			"La vista s'obre a totes dues bandes. Cap al sud, sobre la plana, la boira d'hivern sol deixar un mar de núvols del qual sobresurten la Serralada Prelitoral i Montserrat, si el dia és clar, i als peus queda el pantà de Sant Llorenç; cap al nord es veuen el pantà de Camarasa, el Montsec i alguns cims del Pirineu. Del Montsec en formen part dos altres cims essencials de la comarca, la [Penya Sant Alís](/cims/penya-sant-alis) i el [Tossal de Mirapallars](/cims/tossal-de-mirapallars).",
			"És una excursió curta de mitja muntanya, però el camí voreja estimballs: un pal indicador ho adverteix a la sortida mateix. El corriol va per l'interior de la carena i no cal acostar-se a la vora per fer el cim."
		],
		es: [
			'La Pala Alta es la cima más alta de la sierra de Mont-roig, en [la Noguera](/comarques/noguera), entre los términos de Camarasa y de les Avellanes i Santa Linya. La sierra es una cresta corta, orientada de este a oeste, que por la vertiente sur cae en un farallón vertical muy frecuentado por los escaladores.',
			'En lo alto de la cresta, a poniente de la cima, está la ermita de la Mare de Déu de Montalegre, punto de salida de la vuelta más habitual. La cima está coronada por un vértice geodésico y una caseta de vigilancia forestal. Sobre los riscos es fácil ver buitres y águilas.',
			'La vista se abre a ambos lados. Hacia el sur, sobre el llano, la niebla de invierno suele dejar un mar de nubes del que sobresalen la Serralada Prelitoral y Montserrat, si el día es claro, y a los pies queda el embalse de Sant Llorenç; hacia el norte se ven el embalse de Camarasa, el Montsec y algunas cimas del Pirineo. Del Montsec forman parte otras dos cimas esenciales de la comarca, la [Penya Sant Alís](/cims/penya-sant-alis) y el [Tossal de Mirapallars](/cims/tossal-de-mirapallars).',
			'Es una excursión corta de media montaña, pero el camino bordea despeñaderos: un poste indicador lo advierte en la misma salida. La senda va por el interior de la cresta y no hace falta acercarse al borde para hacer cima.'
		]
	},
	rutes: [
		{
			id: 'montalegre-coll-de-porta',
			nom: {
				ca: "Circular des de l'ermita de Montalegre pel coll de Porta",
				es: 'Circular desde la ermita de Montalegre por el coll de Porta'
			},
			sortida: { nom: 'Ermita de la Mare de Déu de Montalegre (Camarasa)' },
			descripcio: {
				ca: "Des de l'ermita, un corriol evident surt cap a llevant, entra en un alzinar i va guanyant la carena per turons successius fins al cim. Es continua carenejant, es voreja un altre turó pel nord i es baixa pel tram més dret del recorregut, pedregós però practicable, fins a la pista del coll de Porta, que torna cap a ponent per sota de la cinglera; el darrer tram fins a l'ermita es pot fer per la pista o per una drecera fitada, més dreta, que travessa tarteres. El bloc Reptes Muntanyencs va fer la volta en sentit contrari des de la pista de sota l'ermita: 5,1 km, 318 m de desnivell positiu i 1 h 59 min de marxa.",
				es: 'Desde la ermita, una senda evidente sale hacia levante, entra en un encinar y va ganando la cresta por lomas sucesivas hasta la cima. Se sigue por la cresta, se bordea otra loma por el norte y se baja por el tramo más empinado del recorrido, pedregoso pero practicable, hasta la pista del coll de Porta, que vuelve hacia poniente por debajo del farallón; el último tramo hasta la ermita se puede hacer por la pista o por un atajo con hitos, más empinado, que cruza pedreras. El blog Reptes Muntanyencs hizo la vuelta en sentido contrario desde la pista de debajo de la ermita: 5,1 km, 318 m de desnivel positivo y 1 h 59 min de marcha.'
			},
			fonts: [FEMTURISME, REPTES]
		}
	],
	consells: {
		ca: [
			"Per arribar a l'ermita de Montalegre cal fer gairebé 6 km de pista forestal des de la carretera que surt de Vilanova de la Sal. El bloc la considera apta per a turismes, amb precaució.",
			"A la carena, queda't al corriol: la cinglera sud cau a plom i no hi ha res que protegeixi la vora. Amb boira o vent fort, encara menys.",
			"Si només vols el cim, puja-hi i torna pel mateix corriol des de l'ermita; és el tram més senzill de la volta.",
			'No hi ha fonts ni marques de pintura; el camí és clar, però convé portar el mapa o el track per a la baixada al coll de Porta.'
		],
		es: [
			'Para llegar a la ermita de Montalegre hay que hacer casi 6 km de pista forestal desde la carretera que sale de Vilanova de la Sal. El blog la considera apta para turismos, con precaución.',
			'En la cresta, quédate en la senda: el farallón sur cae a plomo y no hay nada que proteja el borde. Con niebla o viento fuerte, todavía menos.',
			'Si solo quieres la cima, sube y vuelve por la misma senda desde la ermita; es el tramo más sencillo de la vuelta.',
			'No hay fuentes ni marcas de pintura; el camino es claro, pero conviene llevar el mapa o el track para la bajada al coll de Porta.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Per on se sol pujar a la Pala Alta?',
				resposta:
					"Des de l'ermita de la Mare de Déu de Montalegre, que ja és dalt de la carena, per un corriol que va cap a llevant fins al cim. La volta es tanca baixant al coll de Porta i tornant per la pista de sota els cingles."
			},
			{
				pregunta: 'Quant es triga a fer la volta?',
				resposta:
					"El bloc Reptes Muntanyencs hi va comptar 5,1 km, 318 m de desnivell i gairebé dues hores de marxa sortint de la pista de sota l'ermita. Des de l'ermita mateix, el cim queda a poc més d'un quilòmetre."
			},
			{
				pregunta: 'És perillosa la carena?',
				resposta:
					"El corriol passa per l'interior de la carena i no té passos difícils, però al costat sud hi ha una cinglera vertical sense protecció. Cal vigilar els nens i no sortir del camí."
			},
			{
				pregunta: 'La Pala Alta compta com a cim essencial?',
				resposta:
					'Sí, és un dels quatre [cims essencials](/cims-essencials) de la Noguera, amb la Penya Sant Alís, [Sant Mamet](/cims/sant-mamet) i el Tossal de Mirapallars.'
			}
		],
		es: [
			{
				pregunta: '¿Por dónde se suele subir a la Pala Alta?',
				resposta:
					'Desde la ermita de la Mare de Déu de Montalegre, que ya está en lo alto de la cresta, por una senda que va hacia levante hasta la cima. La vuelta se cierra bajando al coll de Porta y regresando por la pista de debajo de los riscos.'
			},
			{
				pregunta: '¿Cuánto se tarda en hacer la vuelta?',
				resposta:
					'El blog Reptes Muntanyencs contó 5,1 km, 318 m de desnivel y casi dos horas de marcha saliendo de la pista de debajo de la ermita. Desde la propia ermita, la cima queda a poco más de un kilómetro.'
			},
			{
				pregunta: '¿Es peligrosa la cresta?',
				resposta:
					'La senda pasa por el interior de la cresta y no tiene pasos difíciles, pero en el lado sur hay un farallón vertical sin protección. Hay que vigilar a los niños y no salirse del camino.'
			},
			{
				pregunta: '¿La Pala Alta cuenta como cima esencial?',
				resposta:
					'Sí, es una de las cuatro [cimas esenciales](/cims-essencials) de la Noguera, con la Penya Sant Alís, [Sant Mamet](/cims/sant-mamet) y el Tossal de Mirapallars.'
			}
		]
	},
	fonts: [VIQUIPEDIA, FEMTURISME, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
