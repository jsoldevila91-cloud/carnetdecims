import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Creu de Santos',
	url: 'https://ca.wikipedia.org/wiki/Creu_de_Santos',
	consultat: CONSULTAT
};

const GEC_CIM = {
	nom: 'Gran Enciclopèdia Catalana: la Creu de Santos',
	url: 'https://www.enciclopedia.cat/gran-enciclopedia-catalana/la-creu-de-santos',
	consultat: CONSULTAT
};

const GEC_SERRA = {
	nom: 'Gran Enciclopèdia Catalana: serra de Cardó',
	url: 'https://www.enciclopedia.cat/gran-enciclopedia-catalana/serra-de-cardo',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Xàquera o Creu de Santos',
	url: 'https://reptesmuntanyencs.cat/xaquera-o-creu-de-santos/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'creu-de-santos',
	descripcio: {
		ca: [
			"La Creu de Santos, també coneguda com a Xàquera o tossal de Santos, és el punt culminant de la serra de Cardó, [al Baix Ebre](/comarques/baix-ebre) i al límit amb la Ribera d'Ebre: hi termenegen Tivenys i Benifallet, d'una banda, i Rasquera, de l'altra. El cim té dues puntes molt juntes: l'oriental, amb una gran creu, i l'occidental, amb el vèrtex geodèsic, una creu metàl·lica, un pessebre i una bústia amb el llibre de signatures.",
			"La serra de Cardó és un massís de la Serralada Prelitoral, de calcàries del Triàsic i el Juràssic molt carstificades. L'aigua de pluja s'hi infiltra i reapareix en les fonts medicinals de la cinglera del Sallent, on es va instal·lar el balneari de Cardó aprofitant un antic convent de carmelites. La carena reparteix les aigües entre l'Ebre i la mar, i la travessaven els camins vells de Tivenys, Tortosa, Rasquera i Móra d'Ebre, com el del portell de Xàquera, al peu mateix del cim.",
			"Els dos vessants no s'assemblen. El de Cardó, obac, és de pendents forts i cobert d'alzines i pins, amb roures, moixeres i teixos; el de Tivenys, solell, gairebé no té arbres fora dels barrancs, i hi toca el sol i el vent de ple. A canvi, de la carena estant la vista s'obre fins al delta de l'Ebre.",
			"La majoria d'excursionistes hi pugen pel nord, des del balneari de Cardó, pel camí que enllaça amb la carena prop del cim. Els altres cims essencials de la comarca, el [Caro](/cims/caro) i el [Tossal d'Engrilló](/cims/tossal-d-engrillo), són als Ports, a l'altra banda de l'Ebre."
		],
		es: [
			"La Creu de Santos, también conocida como Xàquera o tossal de Santos, es el punto culminante de la sierra de Cardó, [en el Baix Ebre](/comarques/baix-ebre) y en el límite con la Ribera d'Ebre: confluyen Tivenys y Benifallet, por un lado, y Rasquera, por el otro. La cima tiene dos puntas muy juntas: la oriental, con una gran cruz, y la occidental, con el vértice geodésico, una cruz metálica, un belén y un buzón con el libro de firmas.",
			"La sierra de Cardó es un macizo de la Serralada Prelitoral, de calizas del Triásico y el Jurásico muy karstificadas. El agua de lluvia se infiltra y reaparece en las fuentes medicinales del farallón del Sallent, donde se instaló el balneario de Cardó aprovechando un antiguo convento de carmelitas. La cresta reparte las aguas entre el Ebro y el mar, y la cruzaban los caminos viejos de Tivenys, Tortosa, Rasquera y Móra d'Ebre, como el del portell de Xàquera, al pie mismo de la cima.",
			'Las dos vertientes no se parecen. La de Cardó, umbría, es de pendientes fuertes y está cubierta de encinas y pinos, con robles, mostajos y tejos; la de Tivenys, solana, casi no tiene árboles fuera de los barrancos, y le dan de lleno el sol y el viento. A cambio, desde la cresta la vista se abre hasta el delta del Ebro.',
			"La mayoría de excursionistas suben por el norte, desde el balneario de Cardó, por el camino que enlaza con la cresta cerca de la cima. Las otras cimas esenciales de la comarca, el [Caro](/cims/caro) y el [Tossal d'Engrilló](/cims/tossal-d-engrillo), están en los Ports, al otro lado del Ebro."
		]
	},
	rutes: [
		{
			id: 'tivenys-coll-de-murtero',
			nom: {
				ca: 'Circular des de Tivenys pel coll de Murtero',
				es: 'Circular desde Tivenys por el coll de Murtero'
			},
			sortida: { nom: 'Pista de la carretera de Cardó (Tivenys)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "La ressenya del bloc Reptes Muntanyencs (2012) puja pel vessant sud: una circular de 13 km i 834 m de desnivell positiu en 4 h 7 min de marxa, amb el cim a 4,7 km i 1 h 40 min de la sortida. Es puja per pista fins al coll de Murtero i d'allà se segueix la carena per una senda fitada, sense gaire camí clar, fins a trobar el camí que ve de Cardó i el vèrtex. La baixada, cap al sud-est, segueix senyals de pintura groga, alguns difícils de veure, fins al corral del Moreno, i després senyals vermells pel barranc de Carlos i el coll de Serra Mala. Al punt de sortida s'hi arriba per una pista de terra amb pedra solta, millor amb vehicle alt, i hi caben dos o tres cotxes.",
				es: 'La reseña del blog Reptes Muntanyencs (2012) sube por la vertiente sur: una circular de 13 km y 834 m de desnivel positivo en 4 h 7 min de marcha, con la cima a 4,7 km y 1 h 40 min de la salida. Se sube por pista hasta el coll de Murtero y desde allí se sigue la cresta por una senda con hitos, sin mucho camino claro, hasta encontrar el camino que viene de Cardó y el vértice. La bajada, hacia el sureste, sigue señales de pintura amarilla, algunas difíciles de ver, hasta el corral del Moreno, y después señales rojas por el barranc de Carlos y el coll de Serra Mala. Al punto de salida se llega por una pista de tierra con piedra suelta, mejor con vehículo alto, y caben dos o tres coches.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"Pel vessant de Tivenys no és una sortida d'estiu ni de dia de pluja: no hi ha ombra ni aigua, i amb el terra moll rellisca.",
			"Si puges des del balneari de Cardó, pel vessant obac, porta el mapa de la serra: els pendents són forts i hi ha més d'un camí.",
			'A la baixada pel corral del Moreno, no perdis els senyals de pintura: hi ha un pas una mica complicat sortint del cim i trams tapats per la vegetació al barranc de Carlos.',
			'Si no vols complicacions, baixa del cim pel mateix camí de la carena fins al coll de Murtero.'
		],
		es: [
			'Por la vertiente de Tivenys no es una salida de verano ni de día de lluvia: no hay sombra ni agua, y con el suelo mojado resbala.',
			'Si subes desde el balneario de Cardó, por la vertiente umbría, lleva el mapa de la sierra: las pendientes son fuertes y hay más de un camino.',
			'En la bajada por el corral del Moreno, no pierdas las señales de pintura: hay un paso algo complicado al salir de la cima y tramos tapados por la vegetación en el barranc de Carlos.',
			'Si no quieres complicaciones, baja de la cima por el mismo camino de la cresta hasta el coll de Murtero.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Creu de Santos?',
				resposta:
					'Des de la pista de Tivenys, el bloc Reptes Muntanyencs hi va arribar en 1 h 40 min, aturades incloses, després de 4,7 km. Tota la seva circular, de 13 km i 834 m de desnivell, són 4 h 7 min de marxa.'
			},
			{
				pregunta: "Per on s'hi puja normalment?",
				resposta:
					'La majoria de ressenyes surten del balneari de Cardó, pel vessant nord, que és obac i boscós. El vessant de Tivenys és més solitari i pelat, però permet fer la carena.'
			},
			{
				pregunta: 'Quina de les dues creus és el cim?',
				resposta:
					"Les dues puntes són a tocar i gairebé a la mateixa alçada: l'occidental té el vèrtex geodèsic i la bústia, i l'oriental, la creu gran. Passa per totes dues."
			},
			{
				pregunta: 'La Creu de Santos compta com a cim essencial?',
				resposta:
					'Sí, és un dels tres [cims essencials](/cims-essencials) del Baix Ebre, i ho és des de la primera llista del repte, del 2005.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Creu de Santos?',
				resposta:
					'Desde la pista de Tivenys, el blog Reptes Muntanyencs llegó en 1 h 40 min, paradas incluidas, tras 4,7 km. Toda su circular, de 13 km y 834 m de desnivel, son 4 h 7 min de marcha.'
			},
			{
				pregunta: '¿Por dónde se sube normalmente?',
				resposta:
					'La mayoría de reseñas salen del balneario de Cardó, por la vertiente norte, que es umbría y boscosa. La vertiente de Tivenys es más solitaria y pelada, pero permite recorrer la cresta.'
			},
			{
				pregunta: '¿Cuál de las dos cruces es la cima?',
				resposta:
					'Las dos puntas están pegadas y casi a la misma altura: la occidental tiene el vértice geodésico y el buzón, y la oriental, la cruz grande. Pasa por las dos.'
			},
			{
				pregunta: '¿La Creu de Santos cuenta como cima esencial?',
				resposta:
					'Sí, es una de las tres [cimas esenciales](/cims-essencials) del Baix Ebre, y lo es desde la primera lista del reto, de 2005.'
			}
		]
	},
	fonts: [VIQUIPEDIA, GEC_CIM, GEC_SERRA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
