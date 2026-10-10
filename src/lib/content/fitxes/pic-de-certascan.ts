import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Pic de Certascan',
	url: 'https://ca.wikipedia.org/wiki/Pic_de_Certascan',
	consultat: CONSULTAT
};

const FEMTURISME = {
	nom: 'Fem Turisme: Pic de Certascan des de la Canalada',
	url: 'https://femturisme.cat/rutes/pic-de-certascan-des-de-la-canalada',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Pic de Certascan',
	url: 'https://reptesmuntanyencs.cat/pic-de-certascan/',
	consultat: CONSULTAT
};

const PARC = {
	nom: "Parc Natural de l'Alt Pirineu: pautes i consells per als visitants",
	url: 'https://parcsnaturals.gencat.cat/en/xarxa-de-parcs/alt-pirineu/gaudeix-del-parc/consells/pautes-i-consells/index.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pic-de-certascan',
	descripcio: {
		ca: [
			"El Pic de Certascan és una muntanya del municipi de Lladorre, al [Pallars Sobirà](/comarques/pallars-sobira), dins del Parc Natural de l'Alt Pirineu. La Viquipèdia en dona 617 m de prominència i un aïllament de 8,3 km, i diu que la roca és gres i lutita. Al cim hi ha un vèrtex geodèsic.",
			"Al peu del cim hi ha l'estany de Certascan, que segons Fem Turisme s'ha considerat tradicionalment el llac natural més gran del Pirineu, almenys del vessant català, i un dels més fondos, amb 96 m. El refugi de Certascan, a 2.236 m segons Reptes Muntanyencs, és prop de l'estany. Reptes Muntanyencs recorda que el recorregut coincideix en part amb la travessia de la Porta del Cel, i Fem Turisme el connecta amb l'Alta Ruta Pirinenca.",
			"Reptes Muntanyencs, que hi va dormir, recomana veure l'estany a primera hora, amb la llum de l'alba, i considera la vista del cim una de les que «treuen el singlot». Des del refugi es pot pensar a allargar la jornada cap al pic de Flamisella.",
			"Segons Fem Turisme, a la Canalada, el punt de sortida habitual, no s'hi pot arribar amb cotxe particular: s'hi va amb els taxis 4x4 que fan excursions als estanys de Lladorre. Les condicions d'accés i el servei poden canviar d'un any a l'altre: consulta'ls abans d'anar-hi. L'alternativa és la presa de Montalto (amb 4x4 recomanat) i unes tres hores a peu fins al refugi, amb uns 800 m de desnivell. La temporada és l'estiu: fins a mitjan juliol hi sol haver neu al coll."
		],
		es: [
			'El Pic de Certascan es una montaña del municipio de Lladorre, en el [Pallars Sobirà](/comarques/pallars-sobira), dentro del Parque Natural del Alt Pirineu. La Viquipèdia le da 617 m de prominencia y un aislamiento de 8,3 km, y dice que la roca es arenisca y lutita. En la cima hay un vértice geodésico.',
			'Al pie de la cima está el estany de Certascan, que según Fem Turisme se ha considerado tradicionalmente el lago natural más grande del Pirineo, al menos de la vertiente catalana, y uno de los más profundos, con 96 m. El refugio de Certascan, a 2.236 m según Reptes Muntanyencs, está cerca del estany. Reptes Muntanyencs recuerda que el recorrido coincide en parte con la travesía de la Porta del Cel, y Fem Turisme lo conecta con la Alta Ruta Pirenaica.',
			'Reptes Muntanyencs, que durmió allí, recomienda ver el lago a primera hora, con la luz del alba, y considera la vista de la cima de las que «quitan el hipo». Desde el refugio se puede pensar en alargar la jornada hacia el pic de Flamisella.',
			'Según Fem Turisme, a la Canalada, el punto de salida habitual, no se puede llegar con coche particular: se va con los taxis 4x4 que hacen excursiones a los lagos de Lladorre. Las condiciones de acceso y el servicio pueden cambiar de un año a otro: consúltalos antes de ir. La alternativa es la presa de Montalto (con 4x4 recomendado) y unas tres horas a pie hasta el refugio, con unos 800 m de desnivel. La temporada es el verano: hasta mediados de julio suele haber nieve en el collado.'
		]
	},
	rutes: [
		{
			id: 'la-canalada',
			nom: {
				ca: 'Des de la Canalada pel refugi i el coll de Certascan',
				es: 'Desde la Canalada por el refugio y el coll de Certascan'
			},
			sortida: { nom: 'La Canalada (Lladorre, pista dels estanys de Romedo)' },
			desnivellPositiuM: 896,
			tempsMinuts: 195,
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Fem Turisme surt de la Canalada, per un corriol marcat amb fites i senyals vermells que enllaça amb l'Alta Ruta Pirinenca, i arriba al refugi de Certascan (45 min). Vorejant l'estany per l'esquerra i remuntant la vall es puja a una canal ampla fins al coll de Certascan (1 h 30 min), on una congesta dreta pot obligar a desviar-se per les roques de la dreta. Del coll al cim hi ha una rampa dura i una tartera, i la font avisa d'un pas aeri per roca abans del cim (1 h). La baixada fins a la Canalada fa 2 h 30 min.",
				es: 'Fem Turisme sale de la Canalada, por un sendero marcado con hitos y señales rojas que enlaza con la Alta Ruta Pirenaica, y llega al refugio de Certascan (45 min). Bordeando el estany por la izquierda y remontando el valle se sube por una canal ancha hasta el coll de Certascan (1 h 30 min), donde un nevero empinado puede obligar a desviarse por las rocas de la derecha. Del collado a la cima hay una rampa dura y una pedrera, y la fuente avisa de un paso aéreo por roca antes de la cima (1 h). La bajada hasta la Canalada hace 2 h 30 min.'
			},
			fonts: [FEMTURISME, REPTES]
		}
	],
	consells: {
		ca: [
			'Fins a mitjan juliol, Fem Turisme recomana portar grampons per pujar al coll, tot i que es poden evitar seguint trams de roca. Crida al refugi abans de sortir per saber les condicions.',
			"Reserva el taxi 4x4 amb antelació i confirma l'hora de recollida a la tarda: la pista de la Canalada no és accessible amb cotxe particular.",
			'La tartera final i les roques relliscoses, sobretot a la baixada, demanen atenció. No et refiïs dels últims metres si hi ha boira.',
			"Si vols veure l'estany a primera hora, com Reptes Muntanyencs, dorm al refugi de Certascan i reserva-hi plaça abans: és una etapa de la Porta del Cel i de l'Alta Ruta Pirinenca."
		],
		es: [
			'Hasta mediados de julio, Fem Turisme recomienda llevar crampones para subir al collado, aunque se pueden evitar siguiendo tramos de roca. Llama al refugio antes de salir para saber las condiciones.',
			'Reserva el taxi 4x4 con antelación y confirma la hora de recogida por la tarde: la pista de la Canalada no es accesible con coche particular.',
			'La pedrera final y las rocas resbaladizas, sobre todo en la bajada, piden atención. No te fíes de los últimos metros si hay niebla.',
			'Si quieres ver el lago a primera hora, como Reptes Muntanyencs, duerme en el refugio de Certascan y reserva plaza antes: es una etapa de la Porta del Cel y de la Alta Ruta Pirenaica.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Pic de Certascan?',
				resposta:
					'Fem Turisme dona 3 h 15 min de pujada des de la Canalada (45 min fins al refugi, 1 h 30 min fins al coll i 1 h fins al cim), amb 896 m de desnivell, i 2 h 30 min de baixada.'
			},
			{
				pregunta: 'Es pot arribar en cotxe a la Canalada?',
				resposta:
					'No amb cotxe particular. Fem Turisme explica que cal contactar amb els taxis 4x4 que fan excursions als llacs de Lladorre, que deixen i recullen els excursionistes. Una alternativa és deixar el cotxe a la presa de Montalto (Fem Turisme hi recomana 4x4) i pujar a peu fins al refugi, unes tres hores.'
			},
			{
				pregunta: 'Té algun pas tècnic?',
				resposta:
					"Fem Turisme el qualifica de dificultat mitjana i parla d'una rampa dura, tartera i un pas aeri per roca abans del cim; a la baixada per la tartera, cal vigilar de no relliscar. Fins a mitjan juliol, una congesta al coll pot obligar a desviar-se per roca o a portar grampons."
			},
			{
				pregunta: 'El Pic de Certascan compta com a cim essencial?',
				resposta:
					"Sí, és un dels onze [cims essencials](/cims-essencials) del Pallars Sobirà. Amb 2.853 m, queda només 11 m per sota del [Mont-roig](/cims/mont-roig) (2.864 m), l'altre gran cim de la capçalera de la vall de Cardós."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Pic de Certascan?',
				resposta:
					'Fem Turisme da 3 h 15 min de subida desde la Canalada (45 min hasta el refugio, 1 h 30 min hasta el collado y 1 h hasta la cima), con 896 m de desnivel, y 2 h 30 min de bajada.'
			},
			{
				pregunta: '¿Se puede llegar en coche a la Canalada?',
				resposta:
					'No con coche particular. Fem Turisme explica que hay que contactar con los taxis 4x4 que hacen excursiones a los lagos de Lladorre, que dejan y recogen a los excursionistas. Una alternativa es dejar el coche en la presa de Montalto (Fem Turisme recomienda 4x4) y subir a pie hasta el refugio, unas tres horas.'
			},
			{
				pregunta: '¿Tiene algún paso técnico?',
				resposta:
					'Fem Turisme lo califica de dificultad media y habla de una rampa dura, pedrera y un paso aéreo por roca antes de la cima; en la bajada por la pedrera, hay que vigilar no resbalar. Hasta mediados de julio, un nevero en el collado puede obligar a desviarse por roca o a llevar crampones.'
			},
			{
				pregunta: '¿El Pic de Certascan cuenta como cima esencial?',
				resposta:
					'Sí, es una de las once [cimas esenciales](/cims-essencials) del Pallars Sobirà. Con 2.853 m, queda solo 11 m por debajo del [Mont-roig](/cims/mont-roig) (2.864 m), la otra gran cima de la cabecera del valle de Cardós.'
			}
		]
	},
	fonts: [VIQUIPEDIA, FEMTURISME, REPTES, PARC],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
