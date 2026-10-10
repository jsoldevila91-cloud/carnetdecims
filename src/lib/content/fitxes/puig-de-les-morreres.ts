import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puig de les Morreres',
	url: 'https://ca.wikipedia.org/wiki/Puig_de_les_Morreres',
	consultat: CONSULTAT
};

const COMA_PEDRA = {
	nom: 'Ajuntament de la Coma i la Pedra: del refugi Bages al Pedró dels Quatre Batlles, el puig de les Morreres i els Orriets',
	url: 'https://www.comapedra.cat/el-municipi/turisme/rutes/del-refugi-bages-al-pedro-dels-quatre-batlles-el-puig-de-les-morreres-i-els-orriets',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS_PEDRO = {
	nom: 'Rutes Pirineus: Pedró dels Quatre Batlles (Port del Comte)',
	url: 'https://www.rutespirineus.cat/rutes/pedro-dels-quatre-batlles-port-del-comte-solsones',
	consultat: CONSULTAT
};

const WIKIPEDIA_PORT = {
	nom: 'Wikipedia: Port del Comte',
	url: 'https://en.wikipedia.org/wiki/Port_del_Comte',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-de-les-morreres',
	descripcio: {
		ca: [
			"El Puig de les Morreres és el punt més alt de la serra de Querol, un tram del massís del Port del Comte, al [Solsonès](/comarques/solsones). El cim queda entre els termes de Guixers i de la Coma i la Pedra, dins l'espai protegit de les Serres d'Odèn – Port del Comte. La Viquipèdia en dona 2.212 m (el catàleg, 2.211), una prominència de 104 m i un aïllament de 3,5 km, i hi ha un vèrtex geodèsic al cim. És de calcària.",
			"El Port del Comte és sobretot una estació d'esquí del Prepirineu, amb una base a 1.700 m i un cim a 2.400 m, i això condiciona l'excursió: es surt d'una zona d'aparcaments, remuntadors i pistes. L'Ajuntament de la Coma i la Pedra proposa sortir del refugi Bages (1.770 m), al qual s'arriba per una carretera asfaltada de 8 km des de la LV-4241b, prop del coll de Jou. El Puig de les Morreres s'aconsegueix després del Pedró dels Quatre Batlles (2.388 m), el punt més alt del massís.",
			"Des del cim, segons l'Ajuntament, es veuen Sant Llorenç de Morunys, el santuari de Lord, l'altiplà de Busa i el Solsonès; des del Pedró, els cims del Pallars, les serres de la vall del Segre, les serralades del sud i bona part del Pirineu. El [Cogul](/cims/el-cogul), a la serra de Busa, és un altre essencial del Solsonès.",
			"La ruta de l'Ajuntament només està parcialment senyalitzada i descriu la baixada final com a forta però clara. Femturisme proposa, a més, una circular amb raquetes pel Pedró dels Quatre Batlles, de manera que a l'hivern la zona canvia del tot."
		],
		es: [
			'El Puig de les Morreres es el punto más alto de la serra de Querol, un tramo del macizo del Port del Comte, en el [Solsonès](/comarques/solsones). La cima queda entre los términos de Guixers y de la Coma i la Pedra, dentro del espacio protegido de las Serres d’Odèn – Port del Comte. La Viquipèdia le da 2.212 m (el catálogo, 2.211), una prominencia de 104 m y un aislamiento de 3,5 km, y hay un vértice geodésico en la cima. Es de caliza.',
			'El Port del Comte es sobre todo una estación de esquí del Prepirineo, con una base a 1.700 m y una cima a 2.400 m, y eso condiciona la excursión: se sale de una zona de aparcamientos, remontes y pistas. El Ayuntamiento de la Coma i la Pedra propone salir del refugio Bages (1.770 m), al que se llega por una carretera asfaltada de 8 km desde la LV-4241b, cerca del coll de Jou. El Puig de les Morreres se alcanza después del Pedró dels Quatre Batlles (2.388 m), el punto más alto del macizo.',
			'Desde la cima, según el Ayuntamiento, se ven Sant Llorenç de Morunys, el santuario de Lord, la meseta de Busa y el Solsonès; desde el Pedró, las cimas del Pallars, las sierras del valle del Segre, las cordilleras del sur y buena parte del Pirineo. El [Cogul](/cims/el-cogul), en la serra de Busa, es otra esencial del Solsonès.',
			'La ruta del Ayuntamiento solo está parcialmente señalizada y describe la bajada final como fuerte pero clara. Femturisme propone, además, una circular con raquetas por el Pedró dels Quatre Batlles, de modo que en invierno la zona cambia por completo.'
		]
	},
	rutes: [
		{
			id: 'refugi-bages',
			nom: {
				ca: 'Circular des del refugi Bages pel Pedró dels Quatre Batlles',
				es: 'Circular desde el refugio Bages por el Pedró dels Quatre Batlles'
			},
			sortida: { nom: 'Refugi Bages (Port del Comte, 1.770 m)' },
			descripcio: {
				ca: "L'Ajuntament de la Coma i la Pedra descriu una circular d'uns 18,3 km i 5 h que passa pel Pedró dels Quatre Batlles (a 9,4 km, 2 h 50 min) i pel Puig de les Morreres (a 14,8 km, 4 h 5 min) i acaba als Orriets (Cap d'Urdiets). Entre el Pedró i les Morreres es passa pel portell de l'Ós (2.092 m). Només està parcialment senyalitzada i la baixada final és forta però clara. Es pot escurçar sortint de l'aparcament de l'Estivella – Clot de la Vall, que estalvia uns 4,7 km i 1 h 30 min.",
				es: 'El Ayuntamiento de la Coma i la Pedra describe una circular de unos 18,3 km y 5 h que pasa por el Pedró dels Quatre Batlles (a 9,4 km, 2 h 50 min) y por el Puig de les Morreres (a 14,8 km, 4 h 5 min) y acaba en los Orriets (Cap d’Urdiets). Entre el Pedró y las Morreres se pasa por el portell de l’Ós (2.092 m). Solo está parcialmente señalizada y la bajada final es fuerte pero clara. Se puede acortar saliendo del aparcamiento de l’Estivella – Clot de la Vall, que ahorra unos 4,7 km y 1 h 30 min.'
			},
			fonts: [COMA_PEDRA]
		},
		{
			id: 'estivella',
			nom: {
				ca: "Des de l'Estivella amb el Pedró dels Quatre Batlles",
				es: 'Desde l’Estivella con el Pedró dels Quatre Batlles'
			},
			sortida: { nom: 'Aparcament Estivella – Clot de la Vall (Port del Comte, 1.935 m)' },
			descripcio: {
				ca: "Rutes Pirineus proposa una circular de 10,8 km i 590 m de desnivell acumulat, 4 h de marxa sense parades, que arriba al Pedró dels Quatre Batlles en 1 h 30 min des de l'aparcament i torna per les basses i el Forat de la Bòfia. El Puig de les Morreres hi surt com a ampliació opcional: en una indicació, prop dels prats de les Basses, es deixa el camí de les Morreres i es va cap al nord.",
				es: 'Rutes Pirineus propone una circular de 10,8 km y 590 m de desnivel acumulado, 4 h de marcha sin paradas, que llega al Pedró dels Quatre Batlles en 1 h 30 min desde el aparcamiento y vuelve por las charcas y el Forat de la Bòfia. El Puig de les Morreres aparece como ampliación opcional: en una indicación, cerca de los prados de las Basses, se deja el camino de las Morreres y se va hacia el norte.'
			},
			fonts: [RUTES_PIRINEUS_PEDRO]
		}
	],
	consells: {
		ca: [
			"La carretera al Port del Comte surt de la LV-4241 a Solsona; al coll de Jou, hi ha el trencall que porta a l'estació.",
			"Si la zona del refugi Bages està plena, es pot deixar el cotxe als aparcaments de l'estació.",
			"La ruta només està parcialment senyalitzada: porta un track i no t'hi refiïs només de les marques.",
			"Pots escurçar la jornada sortint de l'Estivella – Clot de la Vall, que estalvia uns 4,7 km i 1 h 30 min.",
			"A l'hivern, la zona canvia: Femturisme proposa una ruta amb raquetes pel Pedró; comprova la predicció i l'estat de la neu."
		],
		es: [
			'La carretera al Port del Comte sale de la LV-4241 en Solsona; en el coll de Jou está el desvío que lleva a la estación.',
			'Si la zona del refugio Bages está llena, se puede dejar el coche en los aparcamientos de la estación.',
			'La ruta solo está parcialmente señalizada: lleva un track y no te fíes solo de las marcas.',
			'Puedes acortar la jornada saliendo de l’Estivella – Clot de la Vall, que ahorra unos 4,7 km y 1 h 30 min.',
			'En invierno la zona cambia: Femturisme propone una ruta con raquetas por el Pedró; comprueba la predicción y el estado de la nieve.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puig de les Morreres?',
				resposta:
					"L'Ajuntament de la Coma i la Pedra calcula 4 h 5 min fins al cim a la circular de 18,3 km des del refugi Bages (passant abans pel Pedró dels Quatre Batlles). Sortint de l'Estivella, s'estalvia 1 h 30 min."
			},
			{
				pregunta: "On s'aparca?",
				resposta:
					"Al refugi Bages (1.770 m), a l'estació del Port del Comte, a 8 km per carretera asfaltada des de la LV-4241b; o a l'aparcament de l'Estivella – Clot de la Vall (1.935 m), segons Rutes Pirineus."
			},
			{
				pregunta: 'És una ruta senyalitzada?',
				resposta:
					"Només en part, segons l'Ajuntament. Rutes Pirineus parla d'un indicador prop dels prats de les Basses on es deixa el camí de les Morreres. Convé portar un track."
			},
			{
				pregunta: 'El Puig de les Morreres compta com a cim essencial?',
				resposta:
					'Sí. És el més alt dels tres essencials del Solsonès i el punt més alt de la serra de Querol; el [Cogul](/cims/el-cogul) i el [Tossal de la Creu](/cims/tossal-de-la-creu) queden per sota.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puig de les Morreres?',
				resposta:
					'El Ayuntamiento de la Coma i la Pedra calcula 4 h 5 min hasta la cima en la circular de 18,3 km desde el refugio Bages (pasando antes por el Pedró dels Quatre Batlles). Saliendo de l’Estivella, se ahorra 1 h 30 min.'
			},
			{
				pregunta: '¿Dónde se aparca?',
				resposta:
					'En el refugio Bages (1.770 m), en la estación del Port del Comte, a 8 km por carretera asfaltada desde la LV-4241b; o en el aparcamiento de l’Estivella – Clot de la Vall (1.935 m), según Rutes Pirineus.'
			},
			{
				pregunta: '¿Es una ruta señalizada?',
				resposta:
					'Solo en parte, según el Ayuntamiento. Rutes Pirineus habla de un indicador cerca de los prados de las Basses donde se deja el camino de las Morreres. Conviene llevar un track.'
			},
			{
				pregunta: '¿El Puig de les Morreres cuenta como cima esencial?',
				resposta:
					'Sí. Es el más alto de los tres esenciales del Solsonès y el punto más alto de la serra de Querol; [el Cogul](/cims/el-cogul) y el [Tossal de la Creu](/cims/tossal-de-la-creu) quedan por debajo.'
			}
		]
	},
	fonts: [VIQUIPEDIA, COMA_PEDRA, RUTES_PIRINEUS_PEDRO, WIKIPEDIA_PORT],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
