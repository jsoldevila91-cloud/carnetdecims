import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Pic de Comaloforno',
	url: 'https://ca.wikipedia.org/wiki/Pic_de_Comaloforno',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: 'Rutes Pirineus: Besiberri Sud i Comaloforno pels estanys de Gémena',
	url: 'https://www.rutespirineus.cat/rutes/besiberri-sud-i-comaloforno-pels-estanys-de-gemena',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: Comaloforno i Besiberri Sud",
	url: 'https://dexcursio.net/comaloforno-i-besiberri-sud/',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Pic de Comaloforno',
	url: 'https://reptesmuntanyencs.cat/es/pic-de-comaloforno-2/',
	consultat: CONSULTAT
};

const VALLBOI = {
	nom: 'Vall de Boí: Marmot Trail, de la presa de Cavallers al refugi Ventosa i Calvell',
	url: 'https://www.vallboi.cat/en/route/route-marmot',
	consultat: CONSULTAT
};

const PARC_FAQ = {
	nom: 'Parc Nacional d’Aigüestortes i Estany de Sant Maurici: preguntes freqüents',
	url: 'https://parcsnaturals.gencat.cat/ca/xarxa-de-parcs/aiguestortes/preguntes-frequents/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pic-de-comaloforno',
	descripcio: {
		ca: [
			"El Pic de Comaloforno és el més alt dels sis cims essencials de l'[Alta Ribagorça](/comarques/alta-ribagorca). Es troba al terme de la Vall de Boí, dins del Parc Nacional d'Aigüestortes i Estany de Sant Maurici, a la carena del massís del Besiberri, entre la vall de Besiberri (a ponent) i la capçalera de Caldes (a llevant). Queda a tocar del Besiberri Sud i és l'extrem nord-occidental del massís de Comalestorres. Segons la Viquipèdia, té 689 m de prominència i 13 km d'aïllament, i al cim hi ha un vèrtex geodèsic.",
			"Henri Brulle, Jean Bazillac i Célestin Passet en van fer la primera ascensió el 25 de juliol de 1882. El nom, segons la Viquipèdia, ve d'una «coma de la forna», és a dir, una petita cavitat o forat a la roca com els que s'obren a la cresta del pic. És granit, i el relleu que l'envolta és de grans canals, tarteres i estanys glacials: Reptes Muntanyencs destaca, a la vall de Llubriqueto, els estanys Gelats i els de Gémena.",
			"El Comaloforno no és una pujada fàcil. Rutes Pirineus en valora la dificultat d'alta (F+), amb passos puntuals de I i II on cal posar les mans, i la recomana a persones amb experiència en alta muntanya i en tarteres, sense vertigen i amb bon sentit de l'orientació. La roca de la cresta és descomposta i es belluga, i la baixada per l'oest és inestable, dreta i amb pocs senyals.",
			"La temporada és l'estiu i l'inici de la tardor, segons Rutes Pirineus. A principi d'estiu o a final de temporada probablement caldran piolet i grampons, i a la tartera sota la paret del cim hi solen quedar congestes fins a mitjan estiu. La mateixa font recomana casc."
		],
		es: [
			'El Pic de Comaloforno es la más alta de las seis cimas esenciales de la [Alta Ribagorça](/comarques/alta-ribagorca). Se encuentra en el término de la Vall de Boí, dentro del Parque Nacional de Aigüestortes i Estany de Sant Maurici, en la cresta del macizo del Besiberri, entre el valle de Besiberri (a poniente) y la cabecera de Caldes (a levante). Queda junto al Besiberri Sud y es el extremo noroccidental del macizo de Comalestorres. Según la Viquipèdia, tiene 689 m de prominencia y 13 km de aislamiento, y en la cima hay un vértice geodésico.',
			'Henri Brulle, Jean Bazillac y Célestin Passet hicieron la primera ascensión el 25 de julio de 1882. El nombre, según la Viquipèdia, viene de una «coma de la forna», es decir, una pequeña cavidad o agujero en la roca como los que se abren en la cresta del pico. Es granito, y el relieve que lo rodea es de grandes canales, pedreras y lagos glaciares: Reptes Muntanyencs destaca, en el valle de Llubriqueto, los estanys Gelats y los de Gémena.',
			'El Comaloforno no es una subida fácil. Rutes Pirineus valora su dificultad de alta (F+), con pasos puntuales de I y II donde hay que poner las manos, y la recomienda a personas con experiencia en alta montaña y en pedreras, sin vértigo y con buen sentido de la orientación. La roca de la cresta es descompuesta y se mueve, y la bajada por el oeste es inestable, empinada y con pocas señales.',
			'La temporada es el verano y el inicio del otoño, según Rutes Pirineus. A principios de verano o a final de temporada probablemente harán falta piolet y crampones, y en la pedrera bajo la pared de la cima suelen quedar neveros hasta mediados de verano. La misma fuente recomienda casco.'
		]
	},
	rutes: [
		{
			id: 'gemena',
			nom: {
				ca: 'Pels estanys de Gémena i la collada d’Abellers',
				es: 'Por los estanys de Gémena y la collada d’Abellers'
			},
			sortida: { nom: 'Aparcament de Toirigo (Vall de Boí, 1.497 m)' },
			tecnicitat: 'grimpada',
			descripcio: {
				ca: "Rutes Pirineus surt de l'aparcament de Toirigo, remunta la vall de Llubriqueto fins al pla de la Cabana i l'estany de Gémena de Baix i puja per terreny molt pedregós i una canal força dreta fins a la collada d'Abellers. D'allà puja al Besiberri Sud i segueix la cresta cap al Comaloforno, que es pot fer pel fil o flanquejant pel vessant occidental, amb un pas de grimpada obligada i passos puntuals de I i II. Arriba al Comaloforno en unes 6 h 25 min de marxa; la volta sencera, amb els dos cims, fa 15 km i uns 1.600 m de desnivell i 10 h 10 min de marxa efectiva.",
				es: 'Rutes Pirineus sale del aparcamiento de Toirigo, remonta el valle de Llubriqueto hasta el pla de la Cabana y el estany de Gémena de Baix y sube por terreno muy pedregoso y una canal bastante empinada hasta la collada d’Abellers. De allí sube al Besiberri Sud y sigue la cresta hacia el Comaloforno, que se puede hacer por el filo o flanqueando por la vertiente occidental, con un paso de trepada obligada y pasos puntuales de I y II. Llega al Comaloforno en unas 6 h 25 min de marcha; la vuelta entera, con las dos cimas, suma 15 km y unos 1.600 m de desnivel y 10 h 10 min de marcha efectiva.'
			},
			fonts: [RUTES_PIRINEUS, REPTES, DEXCURSIO]
		},
		{
			id: 'cavallers',
			nom: {
				ca: 'Per la capçalera de Caldes des de la presa de Cavallers',
				es: 'Por la cabecera de Caldes desde la presa de Cavallers'
			},
			sortida: { nom: 'Presa de Cavallers (Vall de Boí, 1.784 m)' },
			descripcio: {
				ca: "La Viquipèdia presenta aquesta com la via més habitual: des de la presa de Cavallers, pel Pas de l'Ós i l'estany Gelat de Comaloforno. El primer tram, de la presa al refugi Ventosa i Calvell (2.215 m), el publica la Vall de Boí: 4,4 km, 431 m de desnivell i 2 h 15 min, pel pletiu de Riumalo i l'estany Negre. Aquesta fitxa no en detalla el tram final fins al cim: abans de sortir, informa-te'n al refugi.",
				es: 'La Viquipèdia presenta esta como la vía más habitual: desde la presa de Cavallers, por el Pas de l’Ós y el estany Gelat de Comaloforno. El primer tramo, de la presa al refugio Ventosa i Calvell (2.215 m), lo publica la Vall de Boí: 4,4 km, 431 m de desnivel y 2 h 15 min, por el pletiu de Riumalo y el estany Negre. Esta ficha no detalla el tramo final hasta la cima: antes de salir, infórmate en el refugio.'
			},
			fonts: [VIQUIPEDIA, VALLBOI]
		}
	],
	consells: {
		ca: [
			"Porta casc: Rutes Pirineus el recomana, i Reptes Muntanyencs descriu pedra petita i descomposta a la canaleta de sortida a la collada d'Abellers.",
			'No et plantegis la baixada pel vessant oest sense experiència: Rutes Pirineus la descriu com a terreny inestable, molt dret i amb pocs senyals, amb passos estrets i aeris. Si no ho veus clar, desfés el camí de pujada.',
			"Rutes Pirineus recomana portar 3 litres d'aigua per persona, i la fitxa de Reptes Muntanyencs no indica cap font.",
			"A principi d'estiu i a la tardor, valora portar piolet i grampons; sota el cim sol romandre neu ben entrat l'estiu.",
			"La normativa del parc nacional no permet acampar ni fer bivac: si vols repartir l'esforç, dorm al refugi Ventosa i Calvell."
		],
		es: [
			'Lleva casco: Rutes Pirineus lo recomienda, y Reptes Muntanyencs describe piedra pequeña y descompuesta en la canaleta de salida a la collada d’Abellers.',
			'No te plantees la bajada por la vertiente oeste sin experiencia: Rutes Pirineus la describe como terreno inestable, muy empinado y con pocas señales, con pasos estrechos y aéreos. Si no lo ves claro, deshaz el camino de subida.',
			'Rutes Pirineus recomienda llevar 3 litros de agua por persona, y la ficha de Reptes Muntanyencs no indica ninguna fuente.',
			'A comienzos de verano y en otoño, valora llevar piolet y crampones; bajo la cima suele quedar nieve hasta bien entrado el verano.',
			'La normativa del parque nacional no permite acampar ni hacer vivac: si quieres repartir el esfuerzo, duerme en el refugio Ventosa i Calvell.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Comaloforno?',
				resposta:
					'Des de Toirigo, Rutes Pirineus compta unes 6 h 25 min fins al Comaloforno, passant pel Besiberri Sud, i 10 h 10 min de marxa efectiva per a la volta sencera (15 km, 1.600 m de desnivell). És una jornada molt llarga.'
			},
			{
				pregunta: 'El Comaloforno és difícil?',
				resposta:
					"Sí. Rutes Pirineus el valora com a ruta d'alta muntanya (F+), amb passos puntuals de I i II, pedra descomposta a la cresta i una baixada per l'oest inestable. És una ascensió per a persones amb experiència en alta muntanya, sense vertigen i amb bon sentit d'orientació."
			},
			{
				pregunta: 'Es pot combinar amb el Besiberri Sud?',
				resposta:
					"Sí: Rutes Pirineus, D'excursió per Catalunya i Reptes Muntanyencs descriuen rutes que enllacen els dos cims per la cresta que els uneix."
			},
			{
				pregunta: 'El Comaloforno compta com a cim essencial?',
				resposta:
					"Sí, és un dels sis [cims essencials](/cims-essencials) de l'Alta Ribagorça i el més alt de tots, amb 3.029 m. Li segueixen la [Punta Alta](/cims/punta-alta) (3.014 m) i el [Gran Tuc de Colomèrs](/cims/gran-tuc-de-colomers) (2.933 m)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Comaloforno?',
				resposta:
					'Desde Toirigo, Rutes Pirineus cuenta unas 6 h 25 min hasta el Comaloforno, pasando por el Besiberri Sud, y 10 h 10 min de marcha efectiva para la vuelta entera (15 km, 1.600 m de desnivel). Es una jornada muy larga.'
			},
			{
				pregunta: '¿El Comaloforno es difícil?',
				resposta:
					'Sí. Rutes Pirineus lo valora como ruta de alta montaña (F+), con pasos puntuales de I y II, piedra descompuesta en la cresta y una bajada por el oeste inestable. Es una ascensión para personas con experiencia en alta montaña, sin vértigo y con buen sentido de la orientación.'
			},
			{
				pregunta: '¿Se puede combinar con el Besiberri Sud?',
				resposta:
					'Sí: Rutes Pirineus, D’excursió per Catalunya y Reptes Muntanyencs describen rutas que enlazan las dos cimas por la cresta que las une.'
			},
			{
				pregunta: '¿El Comaloforno cuenta como cima esencial?',
				resposta:
					'Sí, es una de las seis [cimas esenciales](/cims-essencials) de la Alta Ribagorça y la más alta de todas, con 3.029 m. Le siguen la [Punta Alta](/cims/punta-alta) (3.014 m) y el [Gran Tuc de Colomèrs](/cims/gran-tuc-de-colomers) (2.933 m).'
			}
		]
	},
	fonts: [VIQUIPEDIA, RUTES_PIRINEUS, DEXCURSIO, REPTES, VALLBOI, PARC_FAQ],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
