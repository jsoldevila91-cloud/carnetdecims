import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Pic de Moredo',
	url: 'https://ca.wikipedia.org/wiki/Pic_de_Moredo',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Pic de Moredo',
	url: 'https://reptesmuntanyencs.cat/pic-de-moredo/',
	consultat: CONSULTAT
};

const PARC = {
	nom: "Parc Natural de l'Alt Pirineu: pautes i consells per als visitants",
	url: 'https://parcsnaturals.gencat.cat/en/xarxa-de-parcs/alt-pirineu/gaudeix-del-parc/consells/pautes-i-consells/index.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pic-de-moredo',
	descripcio: {
		ca: [
			"El Pic de Moredo, que la Viquipèdia també anomena Roca Blanca, és una muntanya de marbre del municipi d'Alt Àneu, [al Pallars Sobirà](/comarques/pallars-sobira). La Viquipèdia la inclou al massís de Beret, dins del Parc Natural de l'Alt Pirineu, i en dona una prominència de 889 m i un aïllament de 8,4 km.",
			"Reptes Muntanyencs fa la pujada en dos dies, des d'Isil: el primer dia, uns 1.000 m de desnivell fins al refugi d'Airoto, lliure i propietat del Club Excursionista Gràcia; el segon, per la collada del Clot de Moredo fins a un coll de la carena i, d'allà, al cim sense camí clar. Hi ha fites, però no prou per orientar-se, i l'autor insisteix que cal seguir un track o orientar-se molt bé, sobretot en aquesta segona fase. L'autor puja per una canal d'herba dreta, evitant unes lloses de pedra, i acaba per una carena curta, fàcil i ampla, sense exposició; la baixada travessa herba i blocs fora de camí abans del llarg descens fins a Isil.",
			"Des del cim, l'autor descriu una vista molt àmplia, en totes direccions. La zona és, a més, sensible per a la fauna: la ressenya demana fer silenci, no sortir del camí, portar el gos lligat i no molestar els nius.",
			"L'època bona és l'estiu: l'autor la va fer a mitjan juliol i desaconsella el tram sense camí amb pluja, boira o neu escassa o de mala qualitat."
		],
		es: [
			'El Pic de Moredo, que la Viquipèdia también llama Roca Blanca, es una montaña de mármol del municipio de Alt Àneu, en el [Pallars Sobirà](/comarques/pallars-sobira). La Viquipèdia la incluye en el macizo de Beret, dentro del Parque Natural del Alt Pirineu, y le da una prominencia de 889 m y un aislamiento de 8,4 km.',
			'Reptes Muntanyencs hace la subida en dos días, desde Isil: el primer día, unos 1.000 m de desnivel hasta el refugio de Airoto, libre y propiedad del Club Excursionista Gràcia; el segundo, por la collada del Clot de Moredo hasta un collado de la cresta y, de allí, a la cima sin camino claro. Hay hitos, pero no los suficientes para orientarse, y el autor insiste en que hay que seguir un track u orientarse muy bien, sobre todo en esa segunda fase. El autor sube por una canal de hierba empinada, evitando unas losas de piedra, y termina por una cresta corta, fácil y ancha, sin exposición; la bajada cruza hierba y bloques fuera de camino antes del largo descenso hasta Isil.',
			'Desde la cima, el autor describe una vista muy amplia, en todas direcciones. La zona es, además, sensible para la fauna: la reseña pide guardar silencio, no salirse del camino, llevar al perro atado y no molestar a los nidos.',
			'La buena época es el verano: el autor la hizo a mediados de julio y desaconseja el tramo sin camino con lluvia, niebla o nieve escasa o de mala calidad.'
		]
	},
	rutes: [
		{
			id: 'isil-airoto',
			nom: {
				ca: "Des d'Isil pel refugi d'Airoto",
				es: 'Desde Isil por el refugio de Airoto'
			},
			sortida: { nom: 'Isil (Alt Àneu)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Segons Reptes Muntanyencs, es puja d'Isil al refugi d'Airoto en unes 4 h 10 min, amb un camí que al principi no està senyalitzat però es veu molt fressat. L'endemà, per la collada del Clot de Moredo s'arriba a un coll de la carena; d'allà al cim no hi ha camí clar i l'autor hi puja per una canal herbosa i una carena curta. Del refugi al cim, unes 3 h amb aturades. La ressenya, semicircular, compta uns 19,7 km i 1.975 m de desnivell, amb 8 h 4 min de marxa. Una pista per a 4x4 arriba a uns 2.000 m, prop de la cabana de Portiero, i escurça la pujada.",
				es: 'Según Reptes Muntanyencs, se sube de Isil al refugio de Airoto en unas 4 h 10 min, con un camino que al principio no está señalizado pero se ve muy trillado. Al día siguiente, por la collada del Clot de Moredo se llega a un collado de la cresta; de allí a la cima no hay camino claro y el autor sube por una canal herbosa y una cresta corta. Del refugio a la cima, unas 3 h con paradas. La reseña, semicircular, cuenta unos 19,7 km y 1.975 m de desnivel, con 8 h 4 min de marcha. Una pista para 4x4 llega a unos 2.000 m, cerca de la cabaña de Portiero, y acorta la subida.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"El refugi d'Airoto és lliure: té tarima amb matalassos per a unes vuit persones, cuina, estufa de llenya i emissora d'emergència, però l'ocupació és per ordre d'arribada i no hi ha plaça garantida. Pensa en un pla B.",
			'Porta el track al mòbil o GPS: els senyals són insuficients a la segona fase i amb boira la sortida del coll és delicada.',
			"No hi vagis amb pluja, boira ni amb neu escassa o dolenta, segons l'autor de la ressenya.",
			"A la zona hi ha fauna sensible: silenci, gos lligat i no et banyis als estanys d'alta muntanya; les cremes solars i els repel·lents afecten els amfibis.",
			"Amb 4x4 pots escurçar l'aproximació per la pista que arriba prop de la cabana de Portiero, a uns 2.000 m; si no, compta la llarga pujada des d'Isil."
		],
		es: [
			'El refugio de Airoto es libre: tiene tarima con colchones para unas ocho personas, cocina, estufa de leña y emisora de emergencia, pero la ocupación es por orden de llegada y no hay plaza garantizada. Piensa en un plan B.',
			'Lleva el track en el móvil o GPS: las señales son insuficientes en la segunda fase y con niebla la salida del collado es delicada.',
			'No vayas con lluvia, niebla ni con nieve escasa o mala, según el autor de la reseña.',
			'En la zona hay fauna sensible: silencio, perro atado y no te bañes en los lagos de alta montaña; las cremas solares y los repelentes afectan a los anfibios.',
			'Con 4x4 puedes acortar la aproximación por la pista que llega cerca de la cabaña de Portiero, a unos 2.000 m; si no, cuenta con la larga subida desde Isil.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Pic de Moredo?',
				resposta:
					"Reptes Muntanyencs el va fer en dos dies: unes 4 h 10 min d'Isil al refugi d'Airoto i unes 3 h més fins al cim, aturades incloses. La ressenya completa, semicircular, suma 19,7 km i 1.975 m de desnivell."
			},
			{
				pregunta: 'Hi ha camí fins al cim?',
				resposta:
					'No de manera clara. Reptes Muntanyencs diu que, del coll al cim, hi ha fites però no són fiables (algunes porten a una altra vall), i recomana seguir un track.'
			},
			{
				pregunta: 'Es pot dormir al refugi d’Airoto?',
				resposta:
					"És un refugi lliure del Club Excursionista Gràcia, amb tarima amb matalassos per a unes vuit persones. L'ocupació és per ordre d'arribada i no hi ha plaça garantida, segons Reptes Muntanyencs."
			},
			{
				pregunta: 'El Pic de Moredo compta com a cim essencial?',
				resposta:
					'Sí, és un dels onze [cims essencials](/cims-essencials) del Pallars Sobirà. Amb 2.766 m, és del mateix massís de Beret que el [Tuc de la Llança](/cims/tuc-de-la-llanca) (2.659 m), segons la Viquipèdia.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Pic de Moredo?',
				resposta:
					'Reptes Muntanyencs lo hizo en dos días: unas 4 h 10 min de Isil al refugio de Airoto y unas 3 h más hasta la cima, paradas incluidas. La reseña completa, semicircular, suma 19,7 km y 1.975 m de desnivel.'
			},
			{
				pregunta: '¿Hay camino hasta la cima?',
				resposta:
					'No de forma clara. Reptes Muntanyencs dice que, del collado a la cima, hay hitos pero no son fiables (algunos llevan a otro valle), y recomienda seguir un track.'
			},
			{
				pregunta: '¿Se puede dormir en el refugio de Airoto?',
				resposta:
					'Es un refugio libre del Club Excursionista Gràcia, con tarima con colchones para unas ocho personas. La ocupación es por orden de llegada y no hay plaza garantizada, según Reptes Muntanyencs.'
			},
			{
				pregunta: '¿El Pic de Moredo cuenta como cima esencial?',
				resposta:
					'Sí, es una de las once [cimas esenciales](/cims-essencials) del Pallars Sobirà. Con 2.766 m, es del mismo macizo de Beret que el [Tuc de la Llança](/cims/tuc-de-la-llanca) (2.659 m), según la Viquipèdia.'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, PARC],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
