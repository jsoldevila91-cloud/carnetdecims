import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Madres (Roc de Madres)',
	url: 'https://ca.wikipedia.org/wiki/Roc_de_Madres',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS_ODELLO = {
	nom: "Rutes Pirineus: Roc de Madres des d'Odelló de Ral",
	url: 'https://www.rutaspirineos.org/rutas/roc-de-madres-desde-odello',
	consultat: CONSULTAT
};

const ALTITUDERANDO = {
	nom: 'Altituderando: Pic de Madrès (2469 m) au départ du col de Jau',
	url: 'https://www.altituderando.com/Pic-de-Madres-2469m-au-depart-du-col-de-Jau',
	consultat: CONSULTAT
};

const REPTES_MUNTANYENCS = {
	nom: 'Reptes Muntanyencs: Roc de Madres',
	url: 'https://reptesmuntanyencs.cat/roc-de-madres/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'roc-de-madres',
	descripcio: {
		ca: [
			"El Roc de Madres (el Madres, pic de Madrès en francès) és el punt culminant de la serra de Madres, a l'extrem sud-oest d'aquesta serra, a la [Catalunya Nord](/comarques/catalunya-nord). Queda entre els termes de Censà i Mosset, al Conflent, i toca el del Bosquet, al País de Sault (Occitània). La serra de Madres es reparteix entre el Capcir, el Conflent, la Fenolleda i el País de Sault. La Viquipèdia dona una prominència de 755 m i una cota de 2.443 m al text i de 2.469 m a la fitxa; altres fonts parlen de 2.466 i 2.481 m.",
			"Al vessant nord s'obre un gran circ, que Altituderando descriu com un lloc on viuen isards i muflons, amb el salt del Bourro, una agulla gran al fons del circ. L'orri de pastors del cim és en part ensorrat, i en alguns itineraris serveix d'aixopluc d'emergència. Prop de Mosset, la zona del Rouquette va tenir mines de talc, que la ruta de Reptes Muntanyencs deixa de banda.",
			"La vista, per dia clar, va del Canigó a la Cerdanya, el Capcir, el llac de Puigvalador i fins a la plana de l'Aude, segons Altituderando. Rutes Pirineus afegeix, des de la ruta de Capcir, el Carlit, els Puigs Perics i el Bernat Salvatge. El [Puig Peric](/cims/puig-peric) i el [Carlit](/cims/carlit) són els altres grans cims del Capcir.",
			'Les ressenyes coincideixen que, sense neu, no hi ha dificultat tècnica, però el recorregut és llarg. Altituderando avisa que a la ruta del coll de Jau hi ha diversos guals sobre la Castellane, que poden ser delicats segons el cabal, sobretot a la desfeta.'
		],
		es: [
			'El Roc de Madres (el Madres, pic de Madrès en francés) es el punto culminante de la serra de Madres, en el extremo suroeste de esta sierra, en la [Cataluña Norte](/comarques/catalunya-nord). Queda entre los términos de Censà y Mosset, en el Conflent, y toca el del Bosquet, en el País de Sault (Occitania). La serra de Madres se reparte entre el Capcir, el Conflent, la Fenolleda y el País de Sault. La Viquipèdia da una prominencia de 755 m y una cota de 2.443 m en el texto y de 2.469 m en la ficha; otras fuentes hablan de 2.466 y 2.481 m.',
			'En la vertiente norte se abre un gran circo, que Altituderando describe como un lugar donde viven sarrios y muflones, con el salt del Bourro, una gran aguja al fondo del circo. El orri de pastores de la cima está en parte derrumbado, y en algunos itinerarios sirve de abrigo de emergencia. Cerca de Mosset, la zona de la Rouquette tuvo minas de talco, que la ruta de Reptes Muntanyencs deja de lado.',
			'La vista, en día claro, va del Canigó a la Cerdaña, el Capcir, el lago de Puyvalador y hasta la llanura del Aude, según Altituderando. Rutes Pirineus añade, desde la ruta del Capcir, el Carlit, los Puigs Perics y el Bernat Salvatge. El [Puig Peric](/cims/puig-peric) y el [Carlit](/cims/carlit) son las otras grandes cimas del Capcir.',
			'Las reseñas coinciden en que, sin nieve, no hay dificultad técnica, pero el recorrido es largo. Altituderando avisa de que en la ruta del coll de Jau hay varios vados sobre la Castellane, que pueden ser delicados según el caudal, sobre todo en el deshielo.'
		]
	},
	rutes: [
		{
			id: 'odello',
			nom: {
				ca: "Des d'Odelló de Ral (Capcir)",
				es: 'Desde Odelló de Ral (Capcir)'
			},
			sortida: { nom: 'Odelló de Ral (Capcir, ≈ 1.510 m)' },
			tempsMinuts: 205,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Rutes Pirineus la presenta com l'itinerari més directe des del Capcir, de 16 km i 1.150 m de desnivell acumulat. Passa per una passarel·la de fusta, la cabana del Becet i el refugi de l'Oller, un refugi lliure molt nou amb taula i estufa de llenya, fins al serrat de les Clotes, on una tanca metàl·lica permet canviar de vessant. Hi ha 3 h 25 min de pujada sense parades; la font assenyala que no hi ha cap dificultat destacable. El tram final fa pendents suaus, sense vegetació.",
				es: 'Rutes Pirineus la presenta como el itinerario más directo desde el Capcir, de 16 km y 1.150 m de desnivel acumulado. Pasa por una pasarela de madera, la cabaña del Becet y el refugio de l’Oller, un refugio libre muy nuevo con mesa y estufa de leña, hasta el serrat de les Clotes, donde una valla metálica permite cambiar de vertiente. Hay 3 h 25 min de subida sin paradas; la fuente señala que no hay ninguna dificultad destacable. El tramo final tiene pendientes suaves, sin vegetación.'
			},
			fonts: [RUTES_PIRINEUS_ODELLO]
		},
		{
			id: 'col-de-jau',
			nom: { ca: 'Des del coll de Jau (Mosset)', es: 'Desde el coll de Jau (Mosset)' },
			sortida: { nom: 'Coll de Jau (Mosset, ≈ 1.500 m)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Altituderando proposa una ruta de dificultat mitjana d'uns 19 km anada i tornada, 1.100 m de desnivell i 7 h: bosc llarg i salvatge, landa de ginestes, el refugi del Callau, la cabana de la Balmette a l'entrada del circ, i un coll abans del cim. Diu que, sense neu, no hi ha dificultat, tot i que el camí del bosc és de vegades dret i poc evident. Reptes Muntanyencs en recull una versió circular de 20,7 km i 1.266 m, pel Roc Negre.",
				es: 'Altituderando propone una ruta de dificultad media de unos 19 km ida y vuelta, 1.100 m de desnivel y 7 h: bosque largo y salvaje, landa de retamas, el refugio del Callau, la cabaña de la Balmette a la entrada del circo, y un collado antes de la cima. Dice que, sin nieve, no hay dificultad, aunque el camino del bosque es a veces empinado y poco evidente. Reptes Muntanyencs recoge una versión circular de 20,7 km y 1.266 m, por el Roc Negre.'
			},
			fonts: [ALTITUDERANDO, REPTES_MUNTANYENCS]
		}
	],
	consells: {
		ca: [
			'A la ruta del coll de Jau hi ha diversos guals; comprova el cabal, sobretot en època de desgel.',
			"A la ruta d'Odelló, el refugi de l'Oller (a 1 h 25 min de la sortida) és un bon lloc per descansar, segons Rutes Pirineus; la cabana del Becet només serveix en cas d'extrema emergència.",
			'Reptes Muntanyencs recomana no fer la circular amb mal temps ni amb boira, perquè no hi ha itinerari senyalitzat.',
			"L'orri del cim serveix d'aixopluc d'emergència, però no és un refugi: no hi comptis per dormir.",
			"Visita Mosset i la torre dels Perfums si en tens l'oportunitat, com suggereix Reptes Muntanyencs."
		],
		es: [
			'En la ruta del coll de Jau hay varios vados; comprueba el caudal, sobre todo en época de deshielo.',
			'En la ruta de Odelló, el refugio de l’Oller (a 1 h 25 min de la salida) es un buen lugar para descansar, según Rutes Pirineus; la cabaña del Becet solo sirve en caso de extrema emergencia.',
			'Reptes Muntanyencs recomienda no hacer la circular con mal tiempo ni con niebla, porque no hay itinerario señalizado.',
			'El orri de la cima sirve de abrigo de emergencia, pero no es un refugio: no cuentes con él para dormir.',
			'Visita Mosset y la torre dels Perfums si tienes la oportunidad, como sugiere Reptes Muntanyencs.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Roc de Madres?',
				resposta:
					"Rutes Pirineus dona 3 h 25 min de pujada des d'Odelló de Ral (16 km i 1.150 m anada i tornada, 5 h 25 min en total). Altituderando, 7 h en total des del coll de Jau (19 km i 1.100 m)."
			},
			{
				pregunta: 'És un cim difícil?',
				resposta:
					"Segons Rutes Pirineus, no té cap dificultat destacable des d'Odelló, i Altituderando diu el mateix de la ruta del coll de Jau sense neu. És una excursió llarga i de pendent suau."
			},
			{
				pregunta: 'Per què les cotes no coincideixen?',
				resposta:
					'La Viquipèdia dona 2.443 m al text i 2.469 m a la fitxa; Reptes Muntanyencs parla de 2.481 m. Altituderando i Rutes Pirineus fan servir 2.469 m, la mateixa que el catàleg del repte.'
			},
			{
				pregunta: 'El Roc de Madres compta com a cim essencial?',
				resposta:
					'Sí. És el setè dels vuit essencials de la Catalunya Nord per altitud, només per sobre de la [Torre de Madeloc](/cims/torre-de-madeloc).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Roc de Madres?',
				resposta:
					'Rutes Pirineus da 3 h 25 min de subida desde Odelló de Ral (16 km y 1.150 m ida y vuelta, 5 h 25 min en total). Altituderando, 7 h en total desde el coll de Jau (19 km y 1.100 m).'
			},
			{
				pregunta: '¿Es una cima difícil?',
				resposta:
					'Según Rutes Pirineus, no tiene ninguna dificultad destacable desde Odelló, y Altituderando dice lo mismo de la ruta del coll de Jau sin nieve. Es una excursión larga y de pendiente suave.'
			},
			{
				pregunta: '¿Por qué las cotas no coinciden?',
				resposta:
					'La Viquipèdia da 2.443 m en el texto y 2.469 m en la ficha; Reptes Muntanyencs habla de 2.481 m. Altituderando y Rutes Pirineus usan 2.469 m, la misma que el catálogo del reto.'
			},
			{
				pregunta: '¿El Roc de Madres cuenta como cima esencial?',
				resposta:
					'Sí. Es el séptimo de los ocho esenciales de Cataluña Norte por altitud, solo por encima de la [Torre de Madeloc](/cims/torre-de-madeloc).'
			}
		]
	},
	fonts: [VIQUIPEDIA, RUTES_PIRINEUS_ODELLO, ALTITUDERANDO, REPTES_MUNTANYENCS],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
