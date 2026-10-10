import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Montlude',
	url: 'https://ca.wikipedia.org/wiki/Montlude',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Montlude',
	url: 'https://reptesmuntanyencs.cat/montlude/',
	consultat: CONSULTAT
};

const DOSMILS = {
	nom: "Visit Val d'Aran: descobreix els dosmilers de la Val d'Aran",
	url: 'https://www.visitvaldaran.com/descubre-los-dosmiles-la-val-daran/',
	consultat: CONSULTAT
};

const ESQUI = {
	nom: "Visit Val d'Aran: Montlude i Uishèra, ruta amb esquís des d'Arres",
	url: 'https://www.visitvaldaran.com/fr/item/montlude-2ruta/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'montlude',
	descripcio: {
		ca: [
			"El Montlude és la gran muntanya del Baix Aran: s'alça entre els termes de Les i de Vilamòs, a [la Val d'Aran](/comarques/val-d-aran), dins l'espai protegit de Sant Joan de Toran. El roc és de fil·lita, una roca metamòrfica. Visit Val d'Aran recorda que es pot pujar per tots els vessants i que l'anomenen la «muntanya de la llum».",
			"Segons la Viquipèdia, té una prominència de 357 m i el cim més alt més proper és a 9,1 km: per això destaca tant des del fons de la vall. Visit Val d'Aran esmenta el projecte Montlude Màgic, que vol recuperar els antics camins de pujada des de cinc pobles: Vilamòs, Arres, Bossòst, Les i Canejan. Al cim principal hi ha un vèrtex geodèsic i una creu. Reptes Muntanyencs explica que, al seu entendre, el vèrtex és uns 4 m més alt que l'altre cim, el de l'esquerra, que el mapa d'Alpina marcava com a cota màxima.",
			"Visit Val d'Aran destaca la vista del massís de la Maladeta des de l'aresta est, i Reptes Muntanyencs hi remarca sobretot l'Aneto.",
			"Segons Visit Val d'Aran, l'ascens més habitual surt de Vilamòs per la pista d'Uishèra, però la ruta que recomana és la del vessant nord, des de Les per la pista del Portet i l'estany de Laujò. Les rutes descrites superen els 1.100 m de desnivell i ocupen bona part del dia. Tria un dia estable de l'estiu o la tardor: Reptes Muntanyencs desaconsella la carena del Barracomica amb neu o terreny moll."
		],
		es: [
			'El Montlude es la gran montaña del Baix Aran: se alza entre los términos de Les y de Vilamòs, en [la Val d’Aran](/comarques/val-d-aran), dentro del espacio protegido de Sant Joan de Toran. La roca es filita, una roca metamórfica. Visit Val d’Aran recuerda que se puede subir por todas sus vertientes y que se la conoce como la «montaña de la luz».',
			'Según la Viquipèdia, tiene una prominencia de 357 m y la cima más alta más cercana está a 9,1 km: por eso destaca tanto desde el fondo del valle. Visit Val d’Aran menciona el proyecto Montlude Màgic, que quiere recuperar los antiguos caminos de subida desde cinco pueblos: Vilamòs, Arres, Bossòst, Les y Canejan. En la cima principal hay un vértice geodésico y una cruz. Reptes Muntanyencs explica que, a su entender, el vértice es unos 4 m más alto que la otra cima, la de la izquierda, que el mapa de Alpina marcaba como cota máxima.',
			'Visit Val d’Aran destaca la vista del macizo de la Maladeta desde la arista este, y Reptes Muntanyencs subraya sobre todo el Aneto.',
			'Según Visit Val d’Aran, la ascensión más habitual sale de Vilamòs por la pista de Uishèra, pero la ruta que recomienda es la de la vertiente norte, desde Les por la pista del Portet y el estany de Laujò. Las rutas descritas superan los 1.100 m de desnivel y ocupan buena parte del día. Elige un día estable de verano u otoño: Reptes Muntanyencs desaconseja la cresta del Barracomica con nieve o terreno mojado.'
		]
	},
	rutes: [
		{
			id: 'artigossa',
			nom: {
				ca: "Circular des dels plans d'Artigossa pel coll de Laujò",
				es: "Circular desde los plans d'Artigossa por el coll de Laujò"
			},
			sortida: { nom: "Plans d'Artigossa (pista forestal, Aran)" },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Reptes Muntanyencs fa una volta que surt dels plans d'Artigossa, enfila la pujada cap al coll de Laujò, passa la cabana de Laujò i guanya la carena del Barracomica fins al cim. Segons l'autor, a la carena del Barracomica, en un punt amb roca i arbres, cal fer una desgrimpada (ell la va evitar per l'esquerra, per herba dreta), i va veure poques marques del PR C-114. En total, 1.282 m de desnivell i 5 h 14 min de marxa, tornada inclosa. L'autor creu que cal un vehicle tot terreny, no necessàriament 4x4, per als darrers 7 o 8 km de pista.",
				es: "Reptes Muntanyencs hace una vuelta que sale de los plans d'Artigossa, remonta hacia el coll de Laujò, pasa la cabaña de Laujò y gana la cresta del Barracomica hasta la cima. Según el autor, en la cresta del Barracomica, en un punto con roca y árboles, hay que destrepar (él lo evitó por la izquierda, por hierba empinada), y vio pocas marcas del PR C-114. En total, 1.282 m de desnivel y 5 h 14 min de marcha, vuelta incluida. El autor cree que hace falta un vehículo todoterreno, no necesariamente 4x4, para los últimos 7 u 8 km de pista."
			},
			fonts: [REPTES]
		},
		{
			id: 'portet-laujo',
			nom: {
				ca: 'Des de Les per la pista del Portet i l’estany de Laujò',
				es: 'Desde Les por la pista del Portet y el estany de Laujò'
			},
			sortida: { nom: 'Pista del Portet (Les)' },
			descripcio: {
				ca: "Visit Val d'Aran proposa pujar en 4x4 des de Les per la pista del Portet, passar per Bordius i deixar el vehicle al pal indicador on comença la pujada per l'estany de Laujò. El final es fa per l'aresta est, després del coll de Barracomica. La fitxa la qualifica de dificultat mitjana, amb 1.130 m de desnivell i 3 h 30 min, i la presenta com una excursió de dia sencer. La pista d'Uishèra, des de Vilamòs, és l'alternativa més habitual.",
				es: 'Visit Val d’Aran propone subir en 4x4 desde Les por la pista del Portet, pasar por Bordius y dejar el vehículo en el poste indicador donde empieza la subida por el estany de Laujò. El final se hace por la arista este, después del coll de Barracomica. La ficha la califica de dificultad media, con 1.130 m de desnivel y 3 h 30 min, y la presenta como una excursión de día completo. La pista de Uishèra, desde Vilamòs, es la alternativa más habitual.'
			},
			fonts: [DOSMILS]
		}
	],
	consells: {
		ca: [
			"Verifica abans de sortir l'estat de les pistes de terra de Vilamòs i del Portet, perquè la jornada depèn del vehicle: Reptes Muntanyencs hi recomana un 4x4 o un vehicle alt.",
			"Els senyals del PR són escassos i, passat el coll de Laujò, l'autor de Reptes Muntanyencs no va trobar ni fites ni marques durant uns 1.700 m: porta mapa o GPS i no confiïs només en la pintura.",
			"No facis la carena del Barracomica amb neu ni amb el terreny moll: la desgrimpada es complica i les conseqüències d'una relliscada pesen molt.",
			"A l'hivern és una ascensió d'esquí de muntanya: Visit Val d'Aran en descriu una des d'Arres, qualificada de difícil i en terreny d'allaus exigent. Només amb experiència i neu estable."
		],
		es: [
			'Verifica antes de salir el estado de las pistas de tierra de Vilamòs y del Portet, porque la jornada depende del vehículo: Reptes Muntanyencs recomienda un 4x4 o un vehículo alto.',
			'Las marcas del PR son escasas y, pasado el coll de Laujò, el autor de Reptes Muntanyencs no encontró hitos ni marcas durante unos 1.700 m: lleva mapa o GPS y no confíes solo en la pintura.',
			'No hagas la cresta del Barracomica con nieve ni con el terreno mojado: la destrepada se complica y las consecuencias de un resbalón pesan mucho.',
			'En invierno es una ascensión de esquí de montaña: Visit Val d’Aran describe una desde Arres, calificada de difícil y en terreno de aludes exigente. Solo con experiencia y nieve estable.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Montlude?',
				resposta:
					"Reptes Muntanyencs hi dedica 5 h 14 min de marxa a la volta circular des dels plans d'Artigossa (1.282 m de desnivell). Visit Val d'Aran dona 3 h 30 min i 1.130 m per la pista del Portet."
			},
			{
				pregunta: 'Cal cotxe 4x4 per al Montlude?',
				resposta:
					"Segons Reptes Muntanyencs, cal un cotxe tot terreny amb prou alçada lliure per als darrers 7 o 8 km de pista, no necessàriament 4x4. Visit Val d'Aran proposa el 4x4 per la pista del Portet."
			},
			{
				pregunta: 'Té algun pas difícil?',
				resposta:
					'Reptes Muntanyencs esmenta una desgrimpada curta a la carena del Barracomica i recomana no fer-la amb neu o terreny moll. La resta és terreny de sender, trams amb fites i trams sense camí.'
			},
			{
				pregunta: 'El Montlude compta com a cim essencial?',
				resposta:
					"Sí, és un dels sis [cims essencials](/cims-essencials) de la Val d'Aran i, amb 2.518 m, el segon més baix dels sis, per sobre només del [Montcorbison](/cims/montcorbison)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Montlude?',
				resposta:
					'Reptes Muntanyencs le dedica 5 h 14 min de marcha en la vuelta circular desde los plans d’Artigossa (1.282 m de desnivel). Visit Val d’Aran da 3 h 30 min y 1.130 m por la pista del Portet.'
			},
			{
				pregunta: '¿Hace falta coche 4x4 para el Montlude?',
				resposta:
					'Según Reptes Muntanyencs, hace falta un coche todoterreno con suficiente altura libre para los últimos 7 u 8 km de pista, no necesariamente 4x4. Visit Val d’Aran propone el 4x4 por la pista del Portet.'
			},
			{
				pregunta: '¿Tiene algún paso difícil?',
				resposta:
					'Reptes Muntanyencs menciona una destrepada corta en la cresta del Barracomica y recomienda no hacerla con nieve o terreno mojado. El resto es terreno de sendero, tramos con hitos y tramos sin camino.'
			},
			{
				pregunta: '¿El Montlude cuenta como cima esencial?',
				resposta:
					'Sí, es una de las seis [cimas esenciales](/cims-essencials) de la Val d’Aran y, con 2.518 m, la segunda más baja de las seis, solo por encima del [Montcorbison](/cims/montcorbison).'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, DOSMILS, ESQUI],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
