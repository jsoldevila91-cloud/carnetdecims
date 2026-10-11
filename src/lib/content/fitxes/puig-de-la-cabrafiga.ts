import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puig de la Cabrafiga',
	url: 'https://ca.wikipedia.org/wiki/Puig_de_la_Cabrafiga',
	consultat: CONSULTAT
};

const VIQUIPEDIA_PRATDIP = {
	nom: 'Viquipèdia: Pratdip',
	url: 'https://ca.wikipedia.org/wiki/Pratdip',
	consultat: CONSULTAT
};

const CONSORCI_SOLANS = {
	nom: 'Consorci de la Serra de Llaberia: Ascensió pels Solans (Pratdip)',
	url: 'https://www.serrallaberia.org/ascencio-pels-solans-pratdip',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Puig de la Cabrafiga',
	url: 'https://reptesmuntanyencs.cat/puig-de-la-cabrafiga/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-de-la-cabrafiga',
	descripcio: {
		ca: [
			"El Puig de la Cabrafiga és el contrafort meridional de la serra de Llaberia, al terme de Pratdip, [al Baix Camp](/comarques/baix-camp). És una muntanya isolada, de perfil triangular, que es veu a l'horitzó des de gairebé tota la part costanera de la comarca. Queda a llevant del poble, separada dels cims principals de la serra pel coll de la Llena, en un terme que la Viquipèdia descriu com a molt trencat i esquerp.",
			"A la mateixa carena, cap al sud, hi ha el puig i el castellet de les Mugues. A prop del coll dels Meners es conserven les restes d'un assentament ibèric que més tard es va fer servir de fortificació contra la pirateria, i als voltants hi ha boques d'antigues mines, que són les que donen nom al coll. Des del mirador dels Solans, sobre Pratdip, el Consorci de la Serra de Llaberia assenyala la Cabrafiga i les Mugues com els puigs que deixen entreveure un tros de plana i de mar.",
			"Si el dia és clar i el vent ho permet, el cim dona una vista extensa, tot i que no de gran abast. És terreny sec i molt pedregós, de senders estrets entre la brolla, com a totes les muntanyes d'aquest racó de la serra.",
			'Pots completar la visita a la serra amb el [Cavall Bernat de Llaberia](/cims/cavall-bernat-de-llaberia), que exigeix grimpar, o amb la [Mola de Colldejou](/cims/mola-de-colldejou), tots dos cims essencials del repte.'
		],
		es: [
			'El Puig de la Cabrafiga es el contrafuerte meridional de la sierra de Llaberia, en el término de Pratdip, [en el Baix Camp](/comarques/baix-camp). Es una montaña aislada, de perfil triangular, que se ve en el horizonte desde casi toda la parte costera de la comarca. Queda a levante del pueblo, separada de las cimas principales de la sierra por el coll de la Llena, en un término que la Viquipèdia describe como muy quebrado y abrupto.',
			'En la misma cresta, hacia el sur, están el puig y el castellet de les Mugues. Cerca del coll dels Meners se conservan los restos de un asentamiento ibérico que más tarde se usó como fortificación contra la piratería, y en los alrededores hay bocas de antiguas minas, que son las que dan nombre al collado. Desde el mirador de los Solans, sobre Pratdip, el Consorci de la Serra de Llaberia señala la Cabrafiga y las Mugues como los puigs que dejan entrever un trozo de llanura y de mar.',
			'Si el día es claro y el viento lo permite, la cima ofrece una vista extensa, aunque no de gran alcance. Es terreno seco y muy pedregoso, de senderos estrechos entre el matorral, como en todas las montañas de este rincón de la sierra.',
			'Puedes completar la visita a la sierra con el [Cavall Bernat de Llaberia](/cims/cavall-bernat-de-llaberia), que exige trepar, o con la [Mola de Colldejou](/cims/mola-de-colldejou), ambas cimas esenciales del reto.'
		]
	},
	rutes: [
		{
			id: 'pratdip-t31',
			nom: {
				ca: 'Circular des de la T-31 pel coll de la Cabrafiga i el coll dels Meners',
				es: 'Circular desde la T-31 por el coll de la Cabrafiga y el coll dels Meners'
			},
			sortida: { nom: 'Aparcament al km 21,2 de la T-31 (Pratdip)' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "La ressenya del bloc Reptes Muntanyencs, del 2015, fa una circular de 9,2 km i 632 m de desnivell positiu en 2 h 39 min de marxa; el cim hi queda a 4,4 km de la sortida. Puja per la cova del Xirico, el coll d'Abelles i el coll de la Cabrafiga fins a la pista formigonada del coll de la Llena, i d'allà al cim per un sender que remunta una tartera dreta de pedra menuda i supera un graó curt, de no més de dos metres, on cal fer servir les mans. Es baixa pel coll de la Fita de la Partió i el coll dels Meners fins al mas de la Cabrafiga. Tota la volta està marcada amb pintura blava, tot i que en algun punt de la pujada les marques es perden.",
				es: "La reseña del blog Reptes Muntanyencs, de 2015, hace una circular de 9,2 km y 632 m de desnivel positivo en 2 h 39 min de marcha; la cima queda a 4,4 km de la salida. Sube por la cova del Xirico, el coll d'Abelles y el coll de la Cabrafiga hasta la pista hormigonada del coll de la Llena, y de allí a la cima por un sendero que remonta una pedrera empinada de piedra menuda y supera un escalón corto, de no más de dos metros, donde hay que usar las manos. Se baja por el coll de la Fita de la Partió y el coll dels Meners hasta el mas de la Cabrafiga. Toda la vuelta está marcada con pintura azul, aunque en algún punto de la subida las marcas se pierden."
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"La tartera de sota el cim és dreta i de pedra petita, que llisca: de pujada cansa i de baixada demana calma. L'autor de la ressenya recomanava fer la volta en sentit horari per estalviar-se-la de pujada.",
			"El graó de dos metres es passa amb les mans; evita'l amb la roca molla i ajuda els qui no hi estiguin acostumats.",
			'Porta pantalons llargs i bon calçat: els senders són molt estrets, fins al punt que els bastons hi fan nosa, i el terra és pedregós.',
			"No hi ha aigua potable al recorregut; la font de la Cabrafiga és un toll d'aigua estancada.",
			"Les boques de mina del coll dels Meners queden fora del camí i s'hi arriba amb una desgrimpada: mira-les de lluny."
		],
		es: [
			'La pedrera de debajo de la cima es empinada y de piedra pequeña, que resbala: de subida cansa y de bajada pide calma. El autor de la reseña recomendaba hacer la vuelta en sentido horario para ahorrársela de subida.',
			'El escalón de dos metros se pasa con las manos; evítalo con la roca mojada y ayuda a quienes no estén acostumbrados.',
			'Lleva pantalones largos y buen calzado: los senderos son muy estrechos, hasta el punto de que los bastones estorban, y el suelo es pedregoso.',
			'No hay agua potable en el recorrido; la fuente de la Cabrafiga es una charca de agua estancada.',
			'Las bocas de mina del coll dels Meners quedan fuera del camino y se llega con un destrepe: míralas de lejos.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puig de la Cabrafiga?',
				resposta:
					'La circular de 9,2 km i 632 m de desnivell des de la T-31 es fa en 2 h 39 min de marxa, segons el bloc Reptes Muntanyencs, que va arribar al cim en menys de dues hores comptant-hi les aturades.'
			},
			{
				pregunta: 'Cal grimpar?',
				resposta:
					'Hi ha un sol pas on cal posar les mans, un graó de no més de dos metres abans de la carena, i una tartera dreta. No és una grimpada sostinguda, però tampoc un passeig.'
			},
			{
				pregunta: 'Està senyalitzat?',
				resposta:
					'Sí, amb pintura blava a tota la volta i cartells als encreuaments. A la tartera i sota la carena les marques costen de seguir; el camí es retroba aviat.'
			},
			{
				pregunta: 'El Puig de la Cabrafiga compta com a cim essencial?',
				resposta:
					'Sí, és un [cim essencial](/cims-essencials) del Baix Camp, el més baix dels tres que hi ha a la serra de Llaberia.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puig de la Cabrafiga?',
				resposta:
					'La circular de 9,2 km y 632 m de desnivel desde la T-31 se hace en 2 h 39 min de marcha, según el blog Reptes Muntanyencs, que llegó a la cima en menos de dos horas contando las paradas.'
			},
			{
				pregunta: '¿Hay que trepar?',
				resposta:
					'Hay un solo paso donde hay que apoyar las manos, un escalón de no más de dos metros antes de la cresta, y una pedrera empinada. No es una trepada sostenida, pero tampoco un paseo.'
			},
			{
				pregunta: '¿Está señalizado?',
				resposta:
					'Sí, con pintura azul en toda la vuelta y carteles en los cruces. En la pedrera y bajo la cresta las marcas cuestan de seguir; el camino se recupera pronto.'
			},
			{
				pregunta: '¿El Puig de la Cabrafiga cuenta como cima esencial?',
				resposta:
					'Sí, es una [cima esencial](/cims-essencials) del Baix Camp, la más baja de las tres que hay en la sierra de Llaberia.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_PRATDIP, CONSORCI_SOLANS, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
