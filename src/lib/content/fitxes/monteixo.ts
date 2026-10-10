import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Monteixo',
	url: 'https://ca.wikipedia.org/wiki/Monteixo',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: 'Rutes Pirineus: ascensió guiada al Monteixo',
	url: 'https://www.rutespirineus.cat/rutes-guiades/ascensio-guiada-al-monteixo',
	consultat: CONSULTAT
};

const PARC = {
	nom: "Parc Natural de l'Alt Pirineu: pautes i consells per als visitants",
	url: 'https://parcsnaturals.gencat.cat/en/xarxa-de-parcs/alt-pirineu/gaudeix-del-parc/consells/pautes-i-consells/index.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'monteixo',
	descripcio: {
		ca: [
			"El Monteixo és una muntanya de la Vallferrera, al terme d'Alins, [al Pallars Sobirà](/comarques/pallars-sobira), dins del Parc Natural de l'Alt Pirineu. La Viquipèdia en dona 434 m de prominència i 6,2 km d'aïllament, i diu que el material és conglomerat. Forma part de la carena que envolta l'estany d'Aixeus (2.400 m), amb el pic de Norís (2.820 m) i lo Sentinella (2.562 m), i al seu peu hi ha Àreu (1.245 m), el poble de la capçalera de la vall.",
			"Rutes Pirineus en destaca el cim piramidal i el presenta com un observatori privilegiat de la [Pica d'Estats](/cims/pica-d-estats), el sostre de Catalunya. La cara oest, la més directa i exigent, puja d'Àreu fins a un bosquet a 2.100 m i continua per una carena rocosa fins al cim; segons la Viquipèdia, és el recorregut de la cursa d'alta muntanya La Cuita al Sol. La cara nord, per pista i un camí amb fites, és menys exigent.",
			"La sortida guiada de Rutes Pirineus entra per l'altra banda: es deixa el cotxe a l'aparcament d'Aixeus, al final d'una pista de terra d'uns 11 km des d'Àreu, i es remunta el barranc d'Aixeus, amb diversos salts d'aigua, fins al circ glacial i l'estany. El tram final és el més dret i pedregós. Rutes Pirineus avisa que en algun punt cal ajudar-se de les mans.",
			"Rutes Pirineus en programa l'ascensió de juny a octubre. Fora d'aquests mesos la neu pot cobrir el tram final, i a l'estiu convé sortir d'hora: és una jornada llarga i les tempestes de tarda són habituals a la capçalera de la Vallferrera."
		],
		es: [
			'El Monteixo es una montaña de la Vallferrera, en el término de Alins, [en el Pallars Sobirà](/comarques/pallars-sobira), dentro del Parque Natural del Alt Pirineu. La Viquipèdia le da 434 m de prominencia y 6,2 km de aislamiento, y dice que el material es conglomerado. Forma parte de la cresta que rodea el estany d’Aixeus (2.400 m), con el pic de Norís (2.820 m) y lo Sentinella (2.562 m), y a su pie está Àreu (1.245 m), el pueblo de la cabecera del valle.',
			'Rutes Pirineus destaca su cima piramidal y lo presenta como un observatorio privilegiado de la [Pica d’Estats](/cims/pica-d-estats), el techo de Cataluña. La cara oeste, la más directa y exigente, sube desde Àreu hasta un bosquete a 2.100 m y sigue por una cresta rocosa hasta la cima; según la Viquipèdia, es el recorrido de la carrera de alta montaña La Cuita al Sol. La cara norte, por pista y un camino con hitos, es menos exigente.',
			'La salida guiada de Rutes Pirineus entra por el otro lado: se deja el coche en el aparcamiento de Aixeus, al final de una pista de tierra de unos 11 km desde Àreu, y se remonta el barranco de Aixeus, con varios saltos de agua, hasta el circo glaciar y el estany. El tramo final es el más empinado y pedregoso. Rutes Pirineus avisa de que en algún punto hay que ayudarse de las manos.',
			'Rutes Pirineus programa la ascensión de junio a octubre. Fuera de esos meses la nieve puede cubrir el tramo final, y en verano conviene salir temprano: es una jornada larga y las tormentas de tarde son habituales en la cabecera de la Vallferrera.'
		]
	},
	rutes: [
		{
			id: 'aixeus',
			nom: {
				ca: "Des de l'aparcament d'Aixeus pel barranc d'Aixeus",
				es: 'Desde el aparcamiento de Aixeus por el barranco de Aixeus'
			},
			sortida: { nom: "Aparcament d'Aixeus (Vallferrera, a uns 11 km d'Àreu per pista de terra)" },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "És la ruta de la sortida guiada de Rutes Pirineus. De l'aparcament d'Aixeus es remunta el barranc, amb diversos salts d'aigua, fins a la base del circ glacial i l'estany d'Aixeus; el tram final, el més dret i pedregós, porta al cim, i la baixada segueix un itinerari en part diferent. La font compta uns 10 km, 1.100 m de desnivell, unes 6 h de marxa efectiva i 7 h 30 min en total. Hi ha corriols, terreny irregular, tarteres i blocs, i en algun punt cal usar les mans.",
				es: 'Es la ruta de la salida guiada de Rutes Pirineus. Del aparcamiento de Aixeus se remonta el barranco, con varios saltos de agua, hasta la base del circo glaciar y el estany d’Aixeus; el tramo final, el más empinado y pedregoso, lleva a la cima, y la bajada sigue un itinerario en parte distinto. La fuente cuenta unos 10 km, 1.100 m de desnivel, unas 6 h de marcha efectiva y 7 h 30 min en total. Hay senderos, terreno irregular, pedreras y bloques, y en algún punto hay que usar las manos.'
			},
			fonts: [RUTES_PIRINEUS]
		},
		{
			id: 'pla-de-la-selva',
			nom: {
				ca: 'Per la cara nord des d’Àreu i el pla de la Selva',
				es: 'Por la cara norte desde Àreu y el pla de la Selva'
			},
			sortida: { nom: 'Àreu (Alins, 1.245 m)' },
			descripcio: {
				ca: "La Viquipèdia descriu la cara nord com una pujada des d'Àreu per la pista forestal del pla de la Farga i el pla de la Selva (1.600 m), practicable només amb 4x4 o vehicles alts, i després per un camí pedregós amb fites que surt d'un rierol a 1.950 m i arriba al cim. La considera menys exigent que la cara oest. La font no en dona temps ni desnivell.",
				es: 'La Viquipèdia describe la cara norte como una subida desde Àreu por la pista forestal del pla de la Farga y el pla de la Selva (1.600 m), practicable solo con 4x4 o vehículos altos, y después por un camino pedregoso con hitos que sale de un arroyo a 1.950 m y llega a la cima. La considera menos exigente que la cara oeste. La fuente no da tiempo ni desnivel.'
			},
			fonts: [VIQUIPEDIA]
		}
	],
	consells: {
		ca: [
			"Comprova l'estat de la pista de terra d'Àreu a Aixeus (uns 11 km) abans de sortir, sobretot si portes un cotxe baix.",
			"La temporada que recomana Rutes Pirineus és de juny a octubre; fora d'aquests mesos, la neu pot cobrir el tram final, dret i pedregós.",
			'Porta aigua i menjar per a tot el dia: la sortida guiada de Rutes Pirineus compta unes 6 h de marxa efectiva.',
			'Respecta les normes del parc: els gossos lligats, sense focs i amb el bivac només per sobre dels 2.000 m de 20 h a 8 h.'
		],
		es: [
			'Comprueba el estado de la pista de tierra de Àreu a Aixeus (unos 11 km) antes de salir, sobre todo si llevas un coche bajo.',
			'La temporada que recomienda Rutes Pirineus es de junio a octubre; fuera de esos meses, la nieve puede cubrir el tramo final, empinado y pedregoso.',
			'Lleva agua y comida para todo el día: la salida guiada de Rutes Pirineus cuenta unas 6 h de marcha efectiva.',
			'Respeta las normas del parque: perros atados, sin fuegos y con el vivac solo por encima de los 2.000 m de 20 h a 8 h.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Monteixo?',
				resposta:
					"Rutes Pirineus compta unes 6 h de marxa efectiva (7 h 30 min amb aturades) per la ruta d'Aixeus, de 10 km i 1.100 m de desnivell, tornada inclosa."
			},
			{
				pregunta: 'Quina és la via menys exigent?',
				resposta:
					"Segons la Viquipèdia, la cara nord: pista forestal fins al pla de la Selva (1.600 m) i camí pedregós amb fites fins al cim. La cara oest, directa des d'Àreu, és la més exigent i és la que fa servir la cursa La Cuita al Sol."
			},
			{
				pregunta: 'Cal posar les mans al Monteixo?',
				resposta:
					"Rutes Pirineus avisa que a la ruta d'Aixeus hi ha algun punt on cal ajudar-se de les mans, i que el tram final és el més dret i pedregós. No és un simple camí de senderisme."
			},
			{
				pregunta: 'El Monteixo compta com a cim essencial?',
				resposta:
					"Sí, és un dels onze [cims essencials](/cims-essencials) del Pallars Sobirà. Amb 2.905 m és el tercer més alt, després de la [Pica d'Estats](/cims/pica-d-estats) i del [Pic de Sotllo](/cims/pic-de-sotllo), que són a la mateixa capçalera de la Vallferrera."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Monteixo?',
				resposta:
					'Rutes Pirineus cuenta unas 6 h de marcha efectiva (7 h 30 min con paradas) por la ruta de Aixeus, de 10 km y 1.100 m de desnivel, vuelta incluida.'
			},
			{
				pregunta: '¿Cuál es la vía menos exigente?',
				resposta:
					'Según la Viquipèdia, la cara norte: pista forestal hasta el pla de la Selva (1.600 m) y camino pedregoso con hitos hasta la cima. La cara oeste, directa desde Àreu, es la más exigente y es la que usa la carrera La Cuita al Sol.'
			},
			{
				pregunta: '¿Hay que poner las manos en el Monteixo?',
				resposta:
					'Rutes Pirineus avisa de que en la ruta de Aixeus hay algún punto donde hay que ayudarse de las manos, y de que el tramo final es el más empinado y pedregoso. No es un simple camino de senderismo.'
			},
			{
				pregunta: '¿El Monteixo cuenta como cima esencial?',
				resposta:
					'Sí, es una de las once [cimas esenciales](/cims-essencials) del Pallars Sobirà. Con 2.905 m es la tercera más alta, después de la [Pica d’Estats](/cims/pica-d-estats) y del [Pic de Sotllo](/cims/pic-de-sotllo), que están en la misma cabecera de la Vallferrera.'
			}
		]
	},
	fonts: [VIQUIPEDIA, RUTES_PIRINEUS, PARC],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
