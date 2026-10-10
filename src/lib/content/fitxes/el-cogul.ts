import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: el Cogul (Navès)',
	url: 'https://ca.wikipedia.org/wiki/El_Cogul_(Nav%C3%A8s)',
	consultat: CONSULTAT
};

const VIQUIPEDIA_BUSA = {
	nom: 'Viquipèdia: serra de Busa',
	url: 'https://ca.wikipedia.org/wiki/Serra_de_Busa',
	consultat: CONSULTAT
};

const ELS_100_CIMS = {
	nom: 'El repte dels 100 cims: el Cogul',
	url: 'https://els100cims.blogspot.com/2011/05/el-cogul.html',
	consultat: CONSULTAT
};

const FEEC = {
	nom: 'FEEC: fitxa del cim el Cogul',
	url: 'https://www.feec.cat/activitats/100-cims/cim/el-cogul/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'el-cogul',
	descripcio: {
		ca: [
			"El Cogul és el punt més alt de la serra de Busa, al terme de Navès, al [Solsonès](/comarques/solsones). La serra és un conjunt de cingleres de conglomerat, dipositat per rius pirinencs fa uns 25 milions d'anys. Forma part de l'espai protegit de les serres de Busa, els Bastets i Lord. Segons la Viquipèdia, el cim es troba al Serrat de les Graelles.",
			"La serra de Busa sembla inaccessible per les cingleres, però al seu cim hi ha un altiplà, el pla de Busa, a uns 1.300 m i entre 500 i 700 m per damunt de les valls. Hi ha la casa Rial, l'única masia habitada tot l'any, i l'església de Sant Cristòfol. Segons la Viquipèdia, durant la guerra del Francès l'altiplà va servir de camp d'instrucció militar, amb un miler de barraques de fusta, i el Capolatell, un cingle aïllat conegut com «la presó», s'utilitzava per tancar-hi presoners. Una llegenda diu que alguns, desesperats, s'hi van estimbar cridant «Mourir à Busa et resurgir à Paris». També es diu que Busa va ser, després de Cadis, el primer lloc d'Espanya a proclamar la Constitució de 1812.",
			"L'itinerari clàssic fa un circuit per la carena: el Cinglalt, la Trassera, el Serrat de la Llebre i el Serrat del Cogul, fins a la creu del Capolat i el Capolatell. Segons l'autor d'El repte dels 100 cims, des de la carena de Busa hi ha bones vistes cap al vessant nord, amb la serra dels Bastets i els Llengots. La tornada passa pel Grau de l'Areny i l'ermita de Sant Iscle i Santa Victòria.",
			"Segons l'autor, no hi ha complicacions tècniques, perquè s'hi va sobretot per pistes i senders en bon estat. L'únic punt on cal parar atenció és el trencall del sender cap als boscos de Casa Vila i el Grau de l'Areny, a pocs centenars de metres de la creu del Capolat. Es pot fer tot l'any; si el dia comença amb boira, l'autor recomana fer la volta en sentit contrari per donar-li temps d'aixecar-se abans d'arribar a la carena."
		],
		es: [
			'El Cogul es el punto más alto de la serra de Busa, en el término de Navès, en el [Solsonès](/comarques/solsones). La sierra es un conjunto de cantiles de conglomerado, depositado por ríos pirenaicos hace unos 25 millones de años. Forma parte del espacio protegido de las sierras de Busa, els Bastets y Lord. Según la Viquipèdia, la cima se encuentra en el Serrat de les Graelles.',
			'La serra de Busa parece inaccesible por los cantiles, pero en su cima hay una altiplanicie, el pla de Busa, a unos 1.300 m y entre 500 y 700 m por encima de los valles. Está la casa Rial, la única masía habitada todo el año, y la iglesia de Sant Cristòfol. Según la Viquipèdia, durante la guerra del Francés la altiplanicie sirvió de campo de instrucción militar, con un millar de barracones de madera, y el Capolatell, un cantil aislado conocido como «la prisión», se usaba para encerrar presos. Una leyenda dice que algunos, desesperados, se despeñaron gritando «Mourir à Busa et resurgir à Paris». También se dice que Busa fue, después de Cádiz, el primer lugar de España en proclamar la Constitución de 1812.',
			'El itinerario clásico hace un circuito por la cresta: el Cinglalt, la Trassera, el Serrat de la Llebre y el Serrat del Cogul, hasta la cruz del Capolat y el Capolatell. Según el autor de El repte dels 100 cims, desde la cresta de Busa hay buenas vistas hacia la vertiente norte, con la sierra dels Bastets y los Llengots. La vuelta pasa por el Grau de l’Areny y la ermita de Sant Iscle i Santa Victòria.',
			'Según el autor, no hay complicaciones técnicas, porque se va sobre todo por pistas y sendas en buen estado. El único punto donde hay que prestar atención es el desvío de la senda hacia los bosques de Casa Vila y el Grau de l’Areny, a pocos cientos de metros de la cruz del Capolat. Se puede hacer todo el año; si el día empieza con niebla, el autor recomienda dar la vuelta en sentido contrario para darle tiempo a levantarse antes de llegar a la cresta.'
		]
	},
	rutes: [
		{
			id: 'cases-baixes-de-posada',
			nom: {
				ca: 'Circular des de les Cases Baixes de Posada',
				es: 'Circular desde les Cases Baixes de Posada'
			},
			sortida: { nom: 'Cases Baixes de Posada (Navès, km 17 de la C-462)' },
			tecnicitat: 'cap',
			descripcio: {
				ca: "El repte dels 100 cims proposa una circular en sentit horari de 15,7 km, 866 m de desnivell acumulat i 4 h 15 min. Surt de les Cases Baixes de Posada, al km 17 de la C-462, i pel Cinglalt, la Trassera, el Serrat de la Llebre i el Serrat del Cogul arriba a la creu del Capolat i al Capolatell. Torna pel Grau de l'Areny i Sant Iscle i Santa Victòria. L'autor no hi veu cap complicació tècnica; només s'ha d'anar amb compte de no perdre el sender cap al Grau de l'Areny.",
				es: 'El repte dels 100 cims propone una circular en sentido horario de 15,7 km, 866 m de desnivel acumulado y 4 h 15 min. Sale de les Cases Baixes de Posada, en el km 17 de la C-462, y por el Cinglalt, la Trassera, el Serrat de la Llebre y el Serrat del Cogul llega a la cruz del Capolat y al Capolatell. Vuelve por el Grau de l’Areny y Sant Iscle i Santa Victòria. El autor no ve ninguna complicación técnica; solo hay que tener cuidado de no perder la senda hacia el Grau de l’Areny.'
			},
			fonts: [ELS_100_CIMS]
		},
		{
			id: 'pla-de-busa',
			nom: { ca: 'Variant curta pel pla de Busa', es: 'Variante corta por el pla de Busa' },
			sortida: { nom: 'Pla de Busa (pista asfaltada, Navès)' },
			descripcio: {
				ca: "El mateix autor assenyala que una pista asfaltada puja fins al pla de Busa, on hi ha el Rial, i que sortint d'allà s'estalvien unes quantes hores de camí; no en dona, però, cap xifra. També hi ha una tornada alternativa que baixa per la Baga de Trasserra fins a Sant Iscle i Santa Victòria, amb un descens pel cingle que un usuari de Wikiloc, citat per l'autor, troba molt interessant.",
				es: 'El mismo autor señala que una pista asfaltada sube hasta el pla de Busa, donde está el Rial, y que saliendo de allí se ahorran varias horas de camino; no da, sin embargo, ninguna cifra. También hay una vuelta alternativa que baja por la Baga de Trasserra hasta Sant Iscle i Santa Victòria, con un descenso por el cantil que un usuario de Wikiloc, citado por el autor, encuentra muy interesante.'
			},
			fonts: [ELS_100_CIMS]
		}
	],
	consells: {
		ca: [
			"Aparcament a les Cases Baixes de Posada, al km 17 de la C-462, on hi ha un pal indicador d'inici i final.",
			"Després de la creu del Capolat, el sender cap als boscos de Casa Vila i el Grau de l'Areny costa de trobar: mira el mapa o el track.",
			"Si fa boira al matí, l'autor aconsella fer la ruta en sentit antihorari.",
			"El Capolatell té cingles verticals: no t'hi acostis a la vora ni deixis que ho facin els nens.",
			"Al pla de Busa, la casa Rial és l'única habitada: respecta la propietat i els camins."
		],
		es: [
			'Aparcamiento en las Cases Baixes de Posada, en el km 17 de la C-462, donde hay un poste indicador de inicio y final.',
			'Después de la cruz del Capolat, la senda hacia los bosques de Casa Vila y el Grau de l’Areny cuesta de encontrar: mira el mapa o el track.',
			'Si hay niebla por la mañana, el autor aconseja hacer la ruta en sentido antihorario.',
			'El Capolatell tiene cantiles verticales: no te acerques al borde ni dejes que lo hagan los niños.',
			'En el pla de Busa, la casa Rial es la única habitada: respeta la propiedad y los caminos.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Cogul?',
				resposta:
					'El repte dels 100 cims indica 4 h 15 min per a la circular de 15,7 km i 866 m de desnivell des de les Cases Baixes de Posada. Si puges amb cotxe fins al pla de Busa, el recorregut és molt més curt.'
			},
			{
				pregunta: 'És una ruta tècnica?',
				resposta:
					"No. L'autor no hi veu complicacions tècniques, perquè s'hi va sobretot per pistes i senders en bon estat. El punt més confús és trobar el sender del Grau de l'Areny."
			},
			{
				pregunta: 'Què és el Capolatell?',
				resposta:
					"És un cingle aïllat de la serra de Busa conegut com «la presó», perquè segons la Viquipèdia s'hi tancaven presoners durant la guerra del Francès. La circular d'El repte dels 100 cims hi passa just després de la creu del Capolat."
			},
			{
				pregunta: 'El Cogul compta com a cim essencial?',
				resposta:
					'Sí. És el segon dels tres essencials del Solsonès per altitud, per sota del [Puig de les Morreres](/cims/puig-de-les-morreres) i per sobre del [Tossal de la Creu](/cims/tossal-de-la-creu), i el punt més alt de la serra de Busa.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Cogul?',
				resposta:
					'El repte dels 100 cims indica 4 h 15 min para la circular de 15,7 km y 866 m de desnivel desde les Cases Baixes de Posada. Si subes en coche hasta el pla de Busa, el recorrido es mucho más corto.'
			},
			{
				pregunta: '¿Es una ruta técnica?',
				resposta:
					'No. El autor no ve complicaciones técnicas, porque se va sobre todo por pistas y sendas en buen estado. El punto más confuso es encontrar la senda del Grau de l’Areny.'
			},
			{
				pregunta: '¿Qué es el Capolatell?',
				resposta:
					'Es un cantil aislado de la serra de Busa conocido como «la prisión», porque según la Viquipèdia se encerraba allí a presos durante la guerra del Francés. La circular de El repte dels 100 cims pasa por él justo después de la cruz del Capolat.'
			},
			{
				pregunta: '¿El Cogul cuenta como cima esencial?',
				resposta:
					'Sí. Es el segundo de los tres esenciales del Solsonès por altitud, por debajo del [Puig de les Morreres](/cims/puig-de-les-morreres) y por encima del [Tossal de la Creu](/cims/tossal-de-la-creu), y el punto más alto de la serra de Busa.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_BUSA, ELS_100_CIMS, FEEC],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
