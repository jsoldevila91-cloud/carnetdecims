import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Pica de Cerví',
	url: 'https://ca.wikipedia.org/wiki/Pica_de_Cerv%C3%AD',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Pica de Cerví',
	url: 'https://reptesmuntanyencs.cat/pica-de-cervi/',
	consultat: CONSULTAT
};

const REPTES_CORRONCO = {
	nom: 'Reptes Muntanyencs: El Corronco (Boí-Taüll)',
	url: 'https://reptesmuntanyencs.cat/es/el-corronco-2/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pica-de-cervi',
	descripcio: {
		ca: [
			"La Pica de Cerví és al terme de Sarroca de Bellera, al [Pallars Jussà](/comarques/pallars-jussa), a la part nord-oest del municipi, en un petit apèndix que s'endinsa una mica en el de la Vall de Boí. Segons la Viquipèdia, queda just al sud de l'estació d'esquí de Boí-Taüll, al sud-est de la Pica de Cerví de Durro, a llevant del Cap dels Vedats d'Erta i al sud del Bony de l'Aigua Blanca. També s'anomena Pica de Serbi o Pica de Cerbi. És de llicorella, té una prominència de 317 m i un aïllament de 2,8 km.",
			"No s'ha de confondre amb la Pica Cerví de Durro, una altra cota de la zona que la ruta del [Corronco](/cims/el-corronco) supera abans d'arribar al seu cim. Reptes Muntanyencs situa la Pica de Cerví aïllada de les grans serres del sector nord pallarès, entre la vall de Manyanet i la del port d'Erta, i hi puja des de la cabana del Carant, a Erta, on s'arriba per pista de terra.",
			"La sortida és una volta circular sense camí ni senyalització. Hi ha una carena amb turons i crestes cada cop més estretes, un punt que l'autor va considerar infranquejable i va flanquejar per l'esquerra, un pas estret entre roques i una baixada per la tartera del vessant nord-oest. L'autor insisteix que es pot patir un fort cansament mental, per l'ús continuat de la navegació i la tartera. Quan es va esvair la boira, l'autor en va gaudir les vistes, tot i les instal·lacions de les pistes d'esquí.",
			"La ressenya és de principis d'octubre, una bona època per a aquesta muntanya sense neu. Aleshores, la pista de Castellàs era practicable amb un turisme normal; la de Sentís, més deteriorada, només ho era per a un SUV o un 4x4. Comprova'n l'estat abans de sortir."
		],
		es: [
			'La Pica de Cerví está en el término de Sarroca de Bellera, en el [Pallars Jussà](/comarques/pallars-jussa), en la parte noroeste del municipio, en un pequeño apéndice que se adentra un poco en el de la Vall de Boí. Según la Viquipèdia, queda justo al sur de la estación de esquí de Boí-Taüll, al sureste de la Pica de Cerví de Durro, a levante del Cap dels Vedats d’Erta y al sur del Bony de l’Aigua Blanca. También se llama Pica de Serbi o Pica de Cerbi. Es de pizarra (llicorella), tiene una prominencia de 317 m y un aislamiento de 2,8 km.',
			'No hay que confundirla con la Pica Cerví de Durro, otra cota de la zona que la ruta del [Corronco](/cims/el-corronco) supera antes de llegar a su cima. Reptes Muntanyencs sitúa la Pica de Cerví aislada de las grandes sierras del sector norte pallarés, entre el valle de Manyanet y el del port d’Erta, y sube desde la cabaña del Carant, en Erta, adonde se llega por pista de tierra.',
			'La salida es una vuelta circular sin camino ni señalización. Hay una cresta con cerros y crestas cada vez más estrechas, un punto que el autor consideró infranqueable y flanqueó por la izquierda, un paso estrecho entre rocas y una bajada por la pedrera de la vertiente noroeste. El autor insiste en que se puede sufrir un fuerte cansancio mental, por el uso continuado de la navegación y la pedrera. Cuando se disipó la niebla, el autor disfrutó de las vistas, a pesar de las instalaciones de las pistas de esquí.',
			'La reseña es de principios de octubre, una buena época para esta montaña sin nieve. Entonces, la pista de Castellàs era practicable con un turismo normal; la de Sentís, más deteriorada, solo lo era para un SUV o un 4x4. Comprueba su estado antes de salir.'
		]
	},
	rutes: [
		{
			id: 'carant',
			nom: {
				ca: 'Circular des de la cabana del Carant (Erta)',
				es: 'Circular desde la cabaña del Carant (Erta)'
			},
			sortida: { nom: 'Cabana del Carant, a Erta (Sarroca de Bellera / la Vall de Boí)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Reptes Muntanyencs fa una volta en sentit antihorari. No hi ha camí ni senyals; en una de les portelles només s'hi veuen pedres remogudes. Les crestes s'estrenyen i un punt es flanqueja per l'esquerra. La baixada és per una tartera del vessant nord-oest i un pas estret entre roques. El primer tram, fins a la carena, puja amb un pendent mitjà del 33 %. Són 10,9 km i 1.256 m de desnivell, amb 5 h 7 min de marxa i 1 h 49 min d'aturades; el cim s'assoleix a les 4 h aproximadament.",
				es: 'Reptes Muntanyencs hace una vuelta en sentido antihorario. No hay camino ni señales; en una de las portillas solo se ven piedras removidas. Las crestas se estrechan y un punto se flanquea por la izquierda. La bajada es por una pedrera de la vertiente noroeste y un paso estrecho entre rocas. El primer tramo, hasta la cresta, sube con una pendiente media del 33 %. Son 10,9 km y 1.256 m de desnivel, con 5 h 7 min de marcha y 1 h 49 min de paradas; la cima se alcanza a las 4 h aproximadamente.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"Porta un track: Reptes Muntanyencs avisa que no hi ha camí ni senyalització en tota la volta, i l'orientació és essencial amb boira.",
			"El primer tram té un pendent del 33 %: dosifica l'esforç, perquè la volta suma 1.256 m de desnivell i unes set hores amb aturades.",
			"La baixada per la tartera del vessant nord-oest és el que l'autor destaca com a repte: baixa amb calma i sense córrer.",
			"Informa't de l'estat de les pistes de Castellàs i de Sentís; l'any 2021 la de Sentís només era apta per a un SUV o un 4x4."
		],
		es: [
			'Lleva un track: Reptes Muntanyencs avisa de que no hay camino ni señalización en toda la vuelta, y la orientación es esencial con niebla.',
			'El primer tramo tiene una pendiente del 33 %: dosifica el esfuerzo, porque la vuelta suma 1.256 m de desnivel y unas siete horas con paradas.',
			'La bajada por la pedrera de la vertiente noroeste es lo que el autor destaca como reto: baja con calma y sin correr.',
			'Infórmate del estado de las pistas de Castellàs y de Sentís; en 2021 la de Sentís solo era apta para un SUV o un 4x4.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Pica de Cerví?',
				resposta:
					'Reptes Muntanyencs hi arriba en unes 4 h des de la cabana del Carant. La volta sencera són 10,9 km i 1.256 m de desnivell, amb 5 h 7 min caminant i 1 h 49 min aturat.'
			},
			{
				pregunta: 'Hi ha camí fins al cim?',
				resposta:
					"No. Segons Reptes Muntanyencs, és una ruta d'alta muntanya sense camí ni senyalització, amb crestes cada cop més estretes i una baixada per tartera. L'orientació és essencial."
			},
			{
				pregunta: 'És la mateixa que la Pica de Cerví de Durro?',
				resposta:
					"No. La Pica Cerví de Durro és una cota més baixa, al nord-oest, que forma part de la carena que recorre la ruta del [Corronco](/cims/el-corronco). La Pica de Cerví del repte és a Sarroca de Bellera, just al sud de l'estació de Boí-Taüll."
			},
			{
				pregunta: 'La Pica de Cerví compta com a cim essencial?',
				resposta:
					'Sí, és un dels set [cims essencials](/cims-essencials) del Pallars Jussà. Amb 2.753 m és el tercer més alt, per darrere del [Pic de Peguera](/cims/pic-de-peguera) i del [Montsent de Pallars](/cims/montsent-de-pallars).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Pica de Cerví?',
				resposta:
					'Reptes Muntanyencs llega en unas 4 h desde la cabaña del Carant. La vuelta entera son 10,9 km y 1.256 m de desnivel, con 5 h 7 min andando y 1 h 49 min parado.'
			},
			{
				pregunta: '¿Hay camino hasta la cima?',
				resposta:
					'No. Según Reptes Muntanyencs, es una ruta de alta montaña sin camino ni señalización, con crestas cada vez más estrechas y una bajada por pedrera. La orientación es esencial.'
			},
			{
				pregunta: '¿Es la misma que la Pica de Cerví de Durro?',
				resposta:
					'No. La Pica Cerví de Durro es una cota más baja, al noroeste, que forma parte de la cresta que recorre la ruta del [Corronco](/cims/el-corronco). La Pica de Cerví del reto está en Sarroca de Bellera, justo al sur de la estación de Boí-Taüll.'
			},
			{
				pregunta: '¿La Pica de Cerví cuenta como cima esencial?',
				resposta:
					'Sí, es una de las siete [cimas esenciales](/cims-essencials) del Pallars Jussà. Con 2.753 m es la tercera más alta, por detrás del [Pic de Peguera](/cims/pic-de-peguera) y del [Montsent de Pallars](/cims/montsent-de-pallars).'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, REPTES_CORRONCO],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
