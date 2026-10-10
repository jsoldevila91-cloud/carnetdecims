import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const RUTES_PIRINEUS = {
	nom: 'Rutes Pirineus: Ruta a la Rocallarga als cingles de Tavertet, Collsacabra',
	url: 'https://www.rutespirineus.cat/rutes/volta-de-la-rocallarga-tavertet-collsacabra',
	consultat: CONSULTAT
};

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Rocallarga',
	url: 'https://ca.wikipedia.org/wiki/Rocallarga',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'rocallarga',
	descripcio: {
		ca: [
			"La Rocallarga és un cim dels cingles de Tavertet, al Collsacabra, al terme de Tavertet, a l'[Osona](/comarques/osona). Segons la Viquipèdia, és de conglomerat, gres i argila. Dins del mateix Collsacabra, [Cabrera](/cims/cabrera) és l'altre cim essencial de la zona.",
			"Rutes Pirineus en situa la pujada en una circular que surt de l'Apartotel l'Avenc de Tavertet i recorre els cingles. Abans de la Rocallarga es passa per la masia de Rajols, pel collet de Rajols i per l'ermita romànica de Sant Corneli, amb un dolmen al costat de l'ermita; més endavant, per la masia de Monteis i per la balma de Cortils.",
			"El web diu que des de la Rocallarga hi ha una de les millors vistes panoràmiques de la contrada. Per baixar, cal seguir fins a trobar la gran fita que marca la baixada, primer per un corriol i després per una pista de desembosc que torna a l'Avenc.",
			"Rutes Pirineus qualifica la sortida de notable per la llargada i el desnivell, però hi puntualitza que no presenta cap dificultat tècnica. No hi ha aigua en tota l'excursió: a l'estiu, la calor es nota. El mapa que recomana és el Collsacabra, vall de Sau, a 1:25.000."
		],
		es: [
			'La Rocallarga es una cima de los cingles de Tavertet, en el Collsacabra, en el término de Tavertet, en [Osona](/comarques/osona). Según la Viquipèdia, es de conglomerado, arenisca y arcilla. Dentro del mismo Collsacabra, [Cabrera](/cims/cabrera) es la otra cima esencial de la zona.',
			"Rutes Pirineus sitúa la subida en una circular que sale del Apartotel l'Avenc de Tavertet y recorre los cingles. Antes de la Rocallarga se pasa por la masía de Rajols, por el collet de Rajols y por la ermita románica de Sant Corneli, con un dolmen junto a la ermita; más adelante, por la masía de Monteis y por la balma de Cortils.",
			"La web dice que desde la Rocallarga hay una de las mejores vistas panorámicas de la comarca. Para bajar hay que seguir hasta encontrar el gran hito que marca la bajada, primero por un sendero y después por una pista de saca que vuelve a l'Avenc.",
			'Rutes Pirineus califica la salida de notable por la longitud y el desnivel, pero puntualiza que no presenta ninguna dificultad técnica. No hay agua en toda la excursión: en verano, el calor se nota. El mapa que recomienda es el Collsacabra, vall de Sau, a 1:25.000.'
		]
	},
	rutes: [
		{
			id: 'avenc',
			nom: {
				ca: "Circular des de l'Avenc de Tavertet per Sant Corneli",
				es: "Circular desde l'Avenc de Tavertet por Sant Corneli"
			},
			sortida: { nom: "Apartotel l'Avenc de Tavertet (Tavertet)" },
			tempsMinuts: 285,
			tecnicitat: 'cap',
			descripcio: {
				ca: "Rutes Pirineus descriu una caminada circular de 14,7 km que surt i acaba a l'Apartotel l'Avenc de Tavertet. Primer segueix la pista asfaltada que travessa el pla Boixer i enllaça Tavertet amb la carretera de Rupit; passa per la masia de Rajols, el collet de Rajols i l'ermita de Sant Corneli (2 h 15 min des de la sortida), i arriba a la Rocallarga a les 4 h 45 min de marxa efectiva. Tota la circular fa 14,7 km i 550 m de desnivell acumulat. L'entitat afirma que la ruta no presenta cap dificultat tècnica; tot i això, només està parcialment senyalitzada, i cal vigilar l'orientació.",
				es: "Rutes Pirineus describe una caminata circular de 14,7 km que sale y acaba en el Apartotel l'Avenc de Tavertet. Primero sigue la pista asfaltada que cruza el pla Boixer y enlaza Tavertet con la carretera de Rupit; pasa por la masía de Rajols, el collet de Rajols y la ermita de Sant Corneli (2 h 15 min desde la salida), y llega a la Rocallarga a las 4 h 45 min de marcha efectiva. Toda la circular hace 14,7 km y 550 m de desnivel acumulado. La entidad afirma que la ruta no presenta ninguna dificultad técnica; aun así, solo está parcialmente señalizada, y hay que vigilar la orientación."
			},
			fonts: [RUTES_PIRINEUS]
		}
	],
	consells: {
		ca: [
			"No hi ha aigua en tota l'excursió, segons Rutes Pirineus: porta-la de casa, sobretot a l'estiu, quan la calor pot ser molt intensa.",
			'El camí només està senyalitzat en part: baixa de la Rocallarga cap a la gran fita que marca la baixada i no segueixis altres traces.',
			"Caminaràs a prop de cingles: no t'acostis a la vora per fer fotos i vigila els nens.",
			'El recorregut és llarg (14,7 km): compta les hores de llum abans de sortir.',
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'No hay agua en toda la excursión, según Rutes Pirineus: llévala de casa, sobre todo en verano, cuando el calor puede ser muy intenso.',
			'El camino solo está señalizado en parte: baja de la Rocallarga hacia el gran hito que marca la bajada y no sigas otras trazas.',
			'Caminarás cerca de cingles: no te acerques al borde para hacer fotos y vigila a los niños.',
			'El recorrido es largo (14,7 km): cuenta las horas de luz antes de salir.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Rocallarga?',
				resposta:
					"Segons Rutes Pirineus, a la circular de 14,7 km des de l'Avenc de Tavertet hi arribes a les 4 h 45 min de marxa efectiva, i la volta sencera en compta 5 h 30 min."
			},
			{
				pregunta: 'La Rocallarga és difícil?',
				resposta:
					'Rutes Pirineus la valora com a notable per la llargada i el desnivell, però diu que no presenta cap dificultat tècnica. Només hi ha senyalització parcial.'
			},
			{
				pregunta: 'Hi ha aigua pel camí a la Rocallarga?',
				resposta:
					"No: Rutes Pirineus adverteix que no es troba aigua en tota l'excursió, i que a l'estiu la calor pot ser molt intensa. Cal sortir amb l'aigua de casa."
			},
			{
				pregunta: 'La Rocallarga és un cim essencial?',
				resposta:
					"Sí. A l'[Osona](/comarques/osona) l'acompanyen altres cims essencials del repte, i [Cabrera](/cims/cabrera) és el més proper, també al Collsacabra."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Rocallarga?',
				resposta:
					"Según Rutes Pirineus, en la circular de 14,7 km desde l'Avenc de Tavertet llegas a las 4 h 45 min de marcha efectiva, y la vuelta entera cuenta 5 h 30 min."
			},
			{
				pregunta: '¿La Rocallarga es difícil?',
				resposta:
					'Rutes Pirineus la valora como notable por la longitud y el desnivel, pero dice que no presenta ninguna dificultad técnica. Solo hay señalización parcial.'
			},
			{
				pregunta: '¿Hay agua en el camino a la Rocallarga?',
				resposta:
					'No: Rutes Pirineus advierte de que no se encuentra agua en toda la excursión, y de que en verano el calor puede ser muy intenso. Hay que salir con el agua de casa.'
			},
			{
				pregunta: '¿La Rocallarga es una cima esencial?',
				resposta:
					'Sí. En [Osona](/comarques/osona) la acompañan otras cimas esenciales del reto, y [Cabrera](/cims/cabrera) es la más cercana, también en el Collsacabra.'
			}
		]
	},
	fonts: [RUTES_PIRINEUS, VIQUIPEDIA],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
