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
			"El Roc de Madres (el Madres, pic de Madrès en francès) és el punt culminant de la serra de Madres, a la [Catalunya Nord](/comarques/catalunya-nord). Queda al límit dels termes de Censà i Mosset, al Conflent, i toca el del Bosquet, al País de Sault, ja a Occitània; el Capcir s'estén als seus peus per ponent. La Viquipèdia li dona una prominència de 755 m: és un cim ben destacat sobre el Capcir i el Conflent.",
			"Al vessant nord s'obre un gran circ, que Altituderando descriu com un lloc on viuen isards i muflons, amb el salt del Bourro, una agulla gran al fons del circ. Al cim hi ha un orri de pastors de pedra seca, en part ensorrat: Reptes Muntanyencs hi veu un aixopluc en cas de necessitat, però Altituderando avisa que no s'hi pot confiar. Prop de Mosset, la zona del Rouquette va tenir mines de talc, que la ruta de Reptes Muntanyencs deixa de banda.",
			"La vista, per dia clar, va del Canigó a la Cerdanya, el Capcir, el llac de Puigvalador i fins a la plana de l'Aude, segons Altituderando. Rutes Pirineus hi afegeix, des de la ruta del Capcir, el [Carlit](/cims/carlit), els dos [Perics](/cims/puig-peric) i el Bernat Salvatge.",
			'Les ressenyes coincideixen que, sense neu, no hi ha dificultat tècnica, però el recorregut és llarg. Altituderando avisa que a la ruta del coll de Jau hi ha diversos guals sobre la Castellana que demanen atenció segons el cabal: amb el desglaç, creu que dos li haurien donat problemes.'
		],
		es: [
			'El Roc de Madres (el Madres, pic de Madrès en francés) es el punto culminante de la serra de Madres, en la [Cataluña Norte](/comarques/catalunya-nord). Queda en el límite de los términos de Censà y Mosset, en el Conflent, y toca el del Bosquet, en el País de Sault, ya en Occitania; el Capcir se extiende a sus pies por poniente. La Viquipèdia le da una prominencia de 755 m: es una cima bien destacada sobre el Capcir y el Conflent.',
			'En la vertiente norte se abre un gran circo, que Altituderando describe como un lugar donde viven sarrios y muflones, con el salt del Bourro, una gran aguja al fondo del circo. En la cima hay un orri de pastores de piedra seca, en parte derrumbado: Reptes Muntanyencs lo ve como un abrigo en caso de necesidad, pero Altituderando avisa de que no es fiable. Cerca de Mosset, la zona de la Rouquette tuvo minas de talco, que la ruta de Reptes Muntanyencs deja de lado.',
			'La vista, en día claro, va del Canigó a la Cerdanya, el Capcir, el lago de Puyvalador y hasta la llanura del Aude, según Altituderando. Rutes Pirineus añade, desde la ruta del Capcir, el [Carlit](/cims/carlit), los dos [Perics](/cims/puig-peric) y el Bernat Salvatge.',
			'Las reseñas coinciden en que, sin nieve, no hay dificultad técnica, pero el recorrido es largo. Altituderando avisa de que en la ruta del coll de Jau hay varios vados sobre la Castellana que piden atención según el caudal: con el deshielo, cree que dos le habrían dado problemas.'
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
			distanciaKm: 8,
			tempsMinuts: 205,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Rutes Pirineus la presenta com l'itinerari més directe des del Capcir: 16 km anada i tornada pel mateix camí i 1.150 m de desnivell acumulat. Passa pel pont de fusta del rec del Roc Mary, la cabana del Becet (1.570 m) i el refugi de l'Oller (1.825 m), nou i en molt bon estat, amb taula i estufa de llenya, fins al serrat de les Clotes (2.350 m), on es travessa una tanca metàl·lica per passar al vessant nord. Hi ha 3 h 25 min de pujada sense parades; la ressenya parla d'un terreny poc abrupte, sense grans dificultats i amb pendents de 30-35° com a màxim. El tram final no té vegetació.",
				es: 'Rutes Pirineus la presenta como el itinerario más directo desde el Capcir: 16 km ida y vuelta por el mismo camino y 1.150 m de desnivel acumulado. Pasa por el puente de madera del rec del Roc Mary, la cabaña del Becet (1.570 m) y el refugio de l’Oller (1.825 m), nuevo y en muy buen estado, con mesa y estufa de leña, hasta el serrat de les Clotes (2.350 m), donde se cruza una valla metálica para pasar a la vertiente norte. Hay 3 h 25 min de subida sin paradas; la reseña habla de un terreno poco abrupto, sin grandes dificultades y con pendientes de 30-35° como máximo. El tramo final no tiene vegetación.'
			},
			fonts: [RUTES_PIRINEUS_ODELLO]
		},
		{
			id: 'col-de-jau',
			nom: { ca: 'Des del coll de Jau (Mosset)', es: 'Desde el coll de Jau (Mosset)' },
			sortida: { nom: 'Coll de Jau (Mosset, ≈ 1.500 m)' },
			distanciaKm: 9.5,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Altituderando proposa una ruta de dificultat mitjana d'uns 19 km anada i tornada pel mateix camí, 1.100 m de desnivell i 7 h: pista fins al refugi del Callau, sender de PR pel bosc, landa de ginestes, la cabana de la Balmette, el circ nord i un coll abans del cim. Diu que, sense neu, no hi ha dificultat, tot i que el camí del bosc és de vegades dret i confús. Reptes Muntanyencs en fa una circular de 20,7 km i 1.266 m pel Gorg Estelat i el Roc Negre, en bona part fora de camí.",
				es: 'Altituderando propone una ruta de dificultad media de unos 19 km ida y vuelta por el mismo camino, 1.100 m de desnivel y 7 h: pista hasta el refugio del Callau, sendero de PR por el bosque, landa de retamas, la cabaña de la Balmette, el circo norte y un collado antes de la cima. Dice que, sin nieve, no hay dificultad, aunque el camino del bosque es a veces empinado y confuso. Reptes Muntanyencs hace una circular de 20,7 km y 1.266 m por el Gorg Estelat y el Roc Negre, en buena parte fuera de camino.'
			},
			fonts: [ALTITUDERANDO, REPTES_MUNTANYENCS]
		}
	],
	consells: {
		ca: [
			'A la ruta del coll de Jau hi ha diversos guals; comprova el cabal, sobretot en època de desgel.',
			"A la ruta d'Odelló, el refugi de l'Oller (a 1 h 25 min de la sortida) és un bon lloc per descansar, segons Rutes Pirineus; la cabana del Becet només serveix en cas d'extrema emergència.",
			'Reptes Muntanyencs desaconsella la seva circular amb mal temps o boira: bona part va fora de camí, per rastres de bestiar, i hi ha trams drets i cingles.',
			"L'orri del cim és mig ensorrat: no hi comptis com a refugi.",
			"Visita Mosset i la torre dels Perfums si en tens l'oportunitat, com suggereix Reptes Muntanyencs."
		],
		es: [
			'En la ruta del coll de Jau hay varios vados; comprueba el caudal, sobre todo en época de deshielo.',
			'En la ruta de Odelló, el refugio de l’Oller (a 1 h 25 min de la salida) es un buen lugar para descansar, según Rutes Pirineus; la cabaña del Becet solo sirve en caso de extrema emergencia.',
			'Reptes Muntanyencs desaconseja su circular con mal tiempo o niebla: buena parte va fuera de camino, por sendas de ganado, y hay tramos empinados y cortados.',
			'El orri de la cima está medio derrumbado: no cuentes con él como refugio.',
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
					"Segons Rutes Pirineus, no té cap dificultat destacable des d'Odelló, i Altituderando diu el mateix de la ruta del coll de Jau sense neu. És llarg, això sí: 16 km des d'Odelló i 19 des del coll de Jau, anada i tornada."
			},
			{
				pregunta: 'Hi ha refugis pel camí?',
				resposta:
					"A la ruta d'Odelló, el refugi de l'Oller (1.825 m) és nou i té taula i estufa de llenya; la cabana del Becet, segons Rutes Pirineus, és en mal estat i només serveix d'emergència. A la del coll de Jau hi ha el refugi del Callau, que Reptes Muntanyencs va trobar amb aspecte d'abandonat, i la cabana de la Balmette."
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
					'Según Rutes Pirineus, no tiene ninguna dificultad destacable desde Odelló, y Altituderando dice lo mismo de la ruta del coll de Jau sin nieve. Eso sí, es largo: 16 km desde Odelló y 19 desde el coll de Jau, ida y vuelta.'
			},
			{
				pregunta: '¿Hay refugios por el camino?',
				resposta:
					'En la ruta de Odelló, el refugio de l’Oller (1.825 m) es nuevo y tiene mesa y estufa de leña; la cabaña del Becet, según Rutes Pirineus, está en mal estado y solo sirve de emergencia. En la del coll de Jau están el refugio del Callau, que Reptes Muntanyencs encontró con aspecto de abandonado, y la cabaña de la Balmette.'
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
