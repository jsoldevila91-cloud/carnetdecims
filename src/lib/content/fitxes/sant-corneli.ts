import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: "Viquipèdia: Sant Corneli d'Aramunt",
	url: 'https://ca.wikipedia.org/wiki/Sant_Corneli_d%27Aramunt',
	consultat: CONSULTAT
};

const ENCICLOPEDIA = {
	nom: 'Gran Enciclopèdia Catalana: Sant Corneli',
	url: 'https://www.enciclopedia.cat/gran-enciclopedia-catalana/sant-corneli-0',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Sant Corneli',
	url: 'https://reptesmuntanyencs.cat/sant-corneli/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'sant-corneli',
	descripcio: {
		ca: [
			"Sant Corneli és el cim més baix de la llista d'essencials del [Pallars Jussà](/comarques/pallars-jussa), amb 1.351 m, i també un santuari: l'ermita romànica de Sant Corneli d'Aramunt s'alça al cim de la muntanya de Sant Corneli, al terme de Conca de Dalt. Fins al 1969 el santuari va pertànyer al municipi d'Aramunt. La Gran Enciclopèdia Catalana situa la muntanya al cim de la serra de Sant Corneli, que cap a l'oest continua amb la serra de Carreu.",
			"Segons la Viquipèdia, l'ermita és en bon estat. Durant anys ha servit de refugi per a qui passava per la zona, i un pastor hi va instal·lar una xemeneia per a una estufa. L'any 1939, poc després del final dels combats del Front del Pallars, les tropes franquistes hi van col·locar una gran creu de ciment armat; una ventada la va abatre i només en queden restes. Reptes Muntanyencs coincideix en la descripció del cim: una petita ermita i una gran creu de formigó trencada i abatuda, amb el vèrtex geodèsic, creu l'autor, a la teulada de l'ermita.",
			"Tradicionalment, la gent d'Aramunt pujava a l'ermita el 16 de setembre per la festa del sant. Reptes Muntanyencs en destaca les vistes, i la Viquipèdia recorda que és un cim ventós i fred, motiu pel qual l'ermita ha servit tants anys d'aixopluc.",
			"És un cim prepirinenc que es pot pujar gairebé tot l'any: Reptes Muntanyencs el va fer a finals de gener, sense dificultat, i a la baixada hi va veure un trencalòs. A l'estiu, els trams oberts fan calor."
		],
		es: [
			'Sant Corneli es la cima más baja de la lista de esenciales del [Pallars Jussà](/comarques/pallars-jussa), con 1.351 m, y también un santuario: la ermita románica de Sant Corneli d’Aramunt se alza en la cima de la montaña de Sant Corneli, en el término de Conca de Dalt. Hasta 1969 el santuario perteneció al municipio de Aramunt. La Gran Enciclopèdia Catalana sitúa la montaña en la cima de la sierra de Sant Corneli, que hacia el oeste continúa con la sierra de Carreu.',
			'Según la Viquipèdia, la ermita está en buen estado. Durante años ha servido de refugio para quien pasaba por la zona, y un pastor instaló una chimenea para una estufa. En 1939, poco después del final de los combates del Frente del Pallars, las tropas franquistas colocaron allí una gran cruz de cemento armado; un golpe de viento la derribó y solo quedan restos. Reptes Muntanyencs coincide en la descripción de la cima: una pequeña ermita y una gran cruz de hormigón rota y abatida, con el vértice geodésico, cree el autor, en el tejado de la ermita.',
			'Tradicionalmente, la gente de Aramunt subía a la ermita el 16 de septiembre por la fiesta del santo. Reptes Muntanyencs destaca sus vistas, y la Viquipèdia recuerda que es una cima ventosa y fría, motivo por el que la ermita ha servido tantos años de cobijo.',
			'Es una cima prepirenaica que se puede subir casi todo el año: Reptes Muntanyencs la hizo a finales de enero, sin dificultad, y en la bajada vio un quebrantahuesos. En verano, los tramos abiertos dan calor.'
		]
	},
	rutes: [
		{
			id: 'portells',
			nom: {
				ca: "Des de la collada dels Portells i l'Espluga de les Egües",
				es: 'Desde la collada dels Portells y l’Espluga de les Egües'
			},
			sortida: { nom: 'Espluga de les Egües (Abella de la Conca, 929 m), collada dels Portells' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Reptes Muntanyencs fa un recorregut d'est a oest que comença per uns 3 km de pista pedregosa al costat d'una línia elèctrica i continua per un camí estret i malmès, fet pel bestiar, sense senyals. Des de la collada del Trumfo cal «pujar de pedra en pedra» fins al cim. Compta uns 10 km i 529 m de desnivell, amb 3 h 4 min de marxa i 19 min d'aturades; el cim s'assoleix a l'1 h 55 min, aturades incloses. L'autor avisa que el retorn pot resultar avorrit. Per arribar-hi, cal un vehicle amb molta altura lliure, no necessàriament 4x4, per una pista precària amb moltes pedres soltes.",
				es: 'Reptes Muntanyencs hace un recorrido de este a oeste que empieza por unos 3 km de pista pedregosa junto a una línea eléctrica y continúa por un camino estrecho y deteriorado, hecho por el ganado, sin señales. Desde la collada del Trumfo hay que «subir de piedra en piedra» hasta la cima. Cuenta unos 10 km y 529 m de desnivel, con 3 h 4 min de marcha y 19 min de paradas; la cima se alcanza a la 1 h 55 min, paradas incluidas. El autor avisa de que el regreso puede resultar aburrido. Para llegar, hace falta un vehículo con mucha altura libre, no necesariamente 4x4, por una pista precaria con muchas piedras sueltas.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'La pista és precària i amb moltes pedres soltes: Reptes Muntanyencs recomana un vehicle amb molta altura lliure, no necessàriament 4x4.',
			"No hi ha fonts d'aigua ni itinerari senyalitzat: porta aigua i el track.",
			'Es pot escurçar la sortida amb una pista de 7 km que uneix la base del tossal de Gallinova amb la de Sant Corneli.',
			"Segons l'autor, fins a la collada del Trumfo és apta per a la mainada i per a qui no està avesat a caminar; el tram final, de pedra en pedra, és el que més els agrada.",
			"Observa les restes de la creu i l'ermita des de fora i respecta l'edifici: és un santuari tradicional d'Aramunt."
		],
		es: [
			'La pista es precaria y con muchas piedras sueltas: Reptes Muntanyencs recomienda un vehículo con mucha altura libre, no necesariamente 4x4.',
			'No hay fuentes de agua ni itinerario señalizado: lleva agua y el track.',
			'Se puede acortar la salida con una pista de 7 km que une la base del tossal de Gallinova con la de Sant Corneli.',
			'Según el autor, hasta la collada del Trumfo es apta para los niños y para quien no está habituado a caminar; el tramo final, de piedra en piedra, es el que más les gusta.',
			'Observa los restos de la cruz y la ermita desde fuera y respeta el edificio: es un santuario tradicional de Aramunt.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Sant Corneli?',
				resposta:
					"Reptes Muntanyencs hi arriba a l'1 h 55 min, aturades incloses. El recorregut sencer, d'uns 10 km i 529 m de desnivell, suma 3 h 4 min de marxa més 19 min d'aturades."
			},
			{
				pregunta: 'Es pot fer amb nens?',
				resposta:
					"Reptes Muntanyencs diu que és apta per a la mainada fins a la collada del Trumfo. A partir d'allà cal pujar de pedra en pedra fins al cim. La ruta és de dificultat baixa."
			},
			{
				pregunta: 'Què hi ha al cim?',
				resposta:
					"L'ermita romànica de Sant Corneli d'Aramunt, a uns 1.351 m, i les restes d'una gran creu de ciment armat col·locada el 1939 per les tropes franquistes i abatuda per una ventada, segons la Viquipèdia."
			},
			{
				pregunta: 'Sant Corneli compta com a cim essencial?',
				resposta:
					'Sí, és un dels set [cims essencials](/cims-essencials) del Pallars Jussà i el més baix, amb 1.351 m. Per sobre queda el [Pui de Lleràs](/cims/pui-de-lleras), amb 1.692 m.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Sant Corneli?',
				resposta:
					'Reptes Muntanyencs llega a la 1 h 55 min, paradas incluidas. El recorrido entero, de unos 10 km y 529 m de desnivel, suma 3 h 4 min de marcha más 19 min de paradas.'
			},
			{
				pregunta: '¿Se puede hacer con niños?',
				resposta:
					'Reptes Muntanyencs dice que es apta para los niños hasta la collada del Trumfo. A partir de ahí hay que subir de piedra en piedra hasta la cima. La ruta es de dificultad baja.'
			},
			{
				pregunta: '¿Qué hay en la cima?',
				resposta:
					'La ermita románica de Sant Corneli d’Aramunt, a unos 1.351 m, y los restos de una gran cruz de cemento armado colocada en 1939 por las tropas franquistas y derribada por un golpe de viento, según la Viquipèdia.'
			},
			{
				pregunta: '¿Sant Corneli cuenta como cima esencial?',
				resposta:
					'Sí, es una de las siete [cimas esenciales](/cims-essencials) del Pallars Jussà y la más baja, con 1.351 m. Por encima queda el [Pui de Lleràs](/cims/pui-de-lleras), con 1.692 m.'
			}
		]
	},
	fonts: [VIQUIPEDIA, ENCICLOPEDIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
