import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Punta Alta de Comalesbienes',
	url: 'https://ca.wikipedia.org/wiki/Punta_Alta_de_Comalesbienes',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Punta Alta de Comalesbienes',
	url: 'https://reptesmuntanyencs.cat/es/punta-alta-2/',
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
	slug: 'punta-alta',
	descripcio: {
		ca: [
			"La Punta Alta, o Punta Alta de Comalesbienes, és un tresmil de granit de la Vall de Boí, a [l'Alta Ribagorça](/comarques/alta-ribagorca), dins del Parc Nacional d'Aigüestortes i Estany de Sant Maurici. S'alça a llevant del pantà de Cavallers, a la carena que separa la capçalera de Caldes (al nord-oest) de la vall de Comalesbienes (al sud-est), i limita amb el Pic de Comalesbienes, el coll Arenós i el coll de Comalesbienes. Segons la Viquipèdia, té una prominència de 540 m i un aïllament de 4,4 km.",
			"Schrader i H. Passet en van fer la primera ascensió a l'estiu de 1880. Al cim hi ha un vèrtex geodèsic de l'Institut Cartogràfic de Catalunya, i a la llista del repte figura simplement com a Punta Alta. Els tres accessos que recull la Viquipèdia són per la vall de Comalesbienes des de prop de la presa de Cavallers, per la vall de Colieto des del refugi Ventosa i Calvell (estany Gran de Colieto, estany de la Roca i coll Arenós) i pel barranc de Comalespada, també des de la presa, que s'uneix a la ruta de Colieto al coll Arenós.",
			"Reptes Muntanyencs fa una ruta circular en dos dies, dormint a Ventosa i Calvell, un refugi que descriu molt concorregut per formar part de la travessa Carros de Foc. El primer dia és un camí clar fins al refugi; el segon, passat l'estany Gran de Colieto, la ruta entra en un caos de roques i blocs de granit marcat només amb fites i arriba al cim per la carena des del coll Arenós. L'autor hi afegeix la Pala Alta de Sarradé, i amb un dia clar troba excel·lents les vistes de tots dos cims.",
			"La pujada es fa a l'estiu: Reptes Muntanyencs la va fer a finals d'agost. Fora d'aquesta època la neu canvia per complet el terreny del barranc i de la carena, i aquesta fitxa no descriu cap itinerari hivernal; consulta el butlletí d'allaus abans de sortir. El parc nacional no permet l'acampada ni el bivac fora dels refugis."
		],
		es: [
			'La Punta Alta, o Punta Alta de Comalesbienes, es un tresmil de granito de la Vall de Boí, en la [Alta Ribagorça](/comarques/alta-ribagorca), dentro del Parque Nacional de Aigüestortes i Estany de Sant Maurici. Se alza a levante del pantano de Cavallers, en la cresta que separa la cabecera de Caldes (al noroeste) del valle de Comalesbienes (al sureste), y limita con el Pic de Comalesbienes, el coll Arenós y el coll de Comalesbienes. Según la Viquipèdia, tiene una prominencia de 540 m y un aislamiento de 4,4 km.',
			'Schrader y H. Passet hicieron la primera ascensión en el verano de 1880. En la cima hay un vértice geodésico del Institut Cartogràfic de Catalunya, y en la lista del reto figura simplemente como Punta Alta. Los tres accesos que recoge la Viquipèdia son por el valle de Comalesbienes desde cerca de la presa de Cavallers, por el valle de Colieto desde el refugio Ventosa i Calvell (estany Gran de Colieto, estany de la Roca y coll Arenós) y por el barranco de Comalespada, también desde la presa, que se une a la ruta de Colieto en el coll Arenós.',
			'Reptes Muntanyencs hace una ruta circular en dos días, durmiendo en Ventosa i Calvell, un refugio que describe como muy concurrido por formar parte de la travesía Carros de Foc. El primer día es un camino claro hasta el refugio; el segundo, pasado el estany Gran de Colieto, la ruta entra en un caos de rocas y bloques de granito marcado solo con hitos y llega a la cima por la cresta desde el coll Arenós. El autor añade la Pala Alta de Sarradé, y con un día claro considera excelentes las vistas desde ambas cimas.',
			'La subida se hace en verano: Reptes Muntanyencs la hizo a finales de agosto. Fuera de esa época la nieve cambia por completo el terreno del barranco y de la cresta, y esta ficha no describe ningún itinerario invernal; consulta el boletín de aludes antes de salir. El parque nacional no permite la acampada ni el vivac fuera de los refugios.'
		]
	},
	rutes: [
		{
			id: 'ventosa-coll-arenos',
			nom: {
				ca: 'Des de la presa de Cavallers pel refugi Ventosa i Calvell i el coll Arenós',
				es: 'Desde la presa de Cavallers por el refugio Ventosa i Calvell y el coll Arenós'
			},
			sortida: { nom: 'Presa de Cavallers (Vall de Boí, 1.784 m)' },
			descripcio: {
				ca: "El primer dia es puja al refugi Ventosa i Calvell: la Vall de Boí en dona 4,4 km, 431 m de desnivell i 2 h 15 min, pel pletiu de Riumalo i l'estany Negre. El segon dia, Reptes Muntanyencs segueix el camí de Carros de Foc fins a l'estany Gran de Colieto, el deixa cap a l'estany de la Roca i travessa un caos de blocs granítics, marcat amb fites, fins al coll Arenós, des d'on guanya el cim per la carena. Les trepades que esmenta la ressenya són a la Pala Alta de Sarradé, que l'autor hi afegeix: amb aquest cim, la volta des del refugi fa 13,7 km i 1.281 m de desnivell, amb 6 h 46 min de marxa.",
				es: 'El primer día se sube al refugio Ventosa i Calvell: la Vall de Boí da 4,4 km, 431 m de desnivel y 2 h 15 min, por el pletiu de Riumalo y el estany Negre. El segundo día, Reptes Muntanyencs sigue el camino de Carros de Foc hasta el estany Gran de Colieto, lo deja hacia el estany de la Roca y cruza un caos de bloques graníticos, marcado con hitos, hasta el coll Arenós, desde donde gana la cima por la cresta. Las trepadas que menciona la reseña están en la Pala Alta de Sarradé, que el autor añade: con esta cima, la vuelta desde el refugio suma 13,7 km y 1.281 m de desnivel, con 6 h 46 min de marcha.'
			},
			fonts: [REPTES, VALLBOI, VIQUIPEDIA]
		},
		{
			id: 'comalesbienes',
			nom: {
				ca: 'Per la vall de Comalesbienes',
				es: 'Por el valle de Comalesbienes'
			},
			sortida: { nom: 'Prop de la presa de Cavallers (1.743 m)' },
			descripcio: {
				ca: "La Viquipèdia recull l'accés per la vall de Comalesbienes, des d'un punt a 1.743 m prop de la presa de Cavallers. Des del rierol que uneix els dos estanys majors, hi ha dues alternatives: pujar pel Pic de Comalesbienes o pels estanyets al peu del coll de Comalesbienes. Les fonts consultades no donen temps ni desnivell d'aquest itinerari: planifica'l amb mapa i amb una ressenya actual.",
				es: 'La Viquipèdia recoge el acceso por el valle de Comalesbienes, desde un punto a 1.743 m cerca de la presa de Cavallers. Desde el arroyo que une los dos estanys mayores, hay dos alternativas: subir por el Pic de Comalesbienes o por los estanyets al pie del coll de Comalesbienes. Las fuentes consultadas no dan tiempo ni desnivel de este itinerario: planifícalo con mapa y con una reseña actual.'
			},
			fonts: [VIQUIPEDIA]
		}
	],
	consells: {
		ca: [
			'Dorm al refugi Ventosa i Calvell si pots: Reptes Muntanyencs el fa en dos dies perquè fer-ho tot en una sola jornada és, segons ell, molt difícil. Reserva amb antelació, que és un refugi molt concorregut.',
			"El segon dia, al caos de blocs no hi ha camí: segueix les fites i, si hi ha boira, no te n'allunyis. Segons Reptes Muntanyencs, la senyalització (pals grocs i fites) és parcial.",
			"La baixada directa cap als estanys de Comalesbienes que fa l'autor és dreta i relliscosa, i ell mateix la qualifica de perillosa: si no la coneixes, torna pel coll Arenós.",
			'El caos de blocs granítics és llarg i cansat: porta botes de sola rígida, mapa topogràfic o GPS amb el track.',
			"Amb neu al barranc o a la carena, l'ascensió és d'alta muntanya hivernal: piolet, grampons i experiència, i en cas d'emergència, truca al 112."
		],
		es: [
			'Duerme en el refugio Ventosa i Calvell si puedes: Reptes Muntanyencs lo hace en dos días porque hacerlo todo en una sola jornada es, según él, muy difícil. Reserva con antelación, que es un refugio muy concurrido.',
			'El segundo día, en el caos de bloques no hay camino: sigue los hitos y, si hay niebla, no te alejes. Según Reptes Muntanyencs, la señalización (postes amarillos e hitos) es parcial.',
			'La bajada directa hacia los estanys de Comalesbienes que hace el autor es empinada y resbaladiza, y él mismo la califica de peligrosa: si no la conoces, vuelve por el coll Arenós.',
			'El caos de bloques graníticos es largo y cansado: lleva botas de suela rígida, mapa topográfico o GPS con el track.',
			'Con nieve en el barranco o la cresta, la ascensión es de alta montaña invernal: piolet, crampones y experiencia, y en caso de emergencia, llama al 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Punta Alta?',
				resposta:
					'Reptes Muntanyencs hi dedica dos dies: el primer, fins al refugi Ventosa i Calvell (2 h 15 min segons la Vall de Boí) i el segon, la pujada, la carena i la baixada. La volta amb la Pala Alta de Sarradé és de 13,7 km i 1.281 m, amb 6 h 46 min de marxa.'
			},
			{
				pregunta: 'La Punta Alta té grimpada?',
				resposta:
					'La ressenya de Reptes Muntanyencs situa les trepades a la Pala Alta de Sarradé, el cim que hi afegeix. Fins a la Punta Alta descriu un llarg caos de blocs amb fites i la carena final des del coll Arenós, sense detallar-ne els passos. No és un camí de senderisme.'
			},
			{
				pregunta: 'On es pot dormir per fer la Punta Alta?',
				resposta:
					'Al refugi Ventosa i Calvell, a la ruta Carros de Foc. Dins del parc nacional no es pot acampar ni fer bivac.'
			},
			{
				pregunta: 'La Punta Alta compta com a cim essencial?',
				resposta:
					"Sí, és un dels sis [cims essencials](/cims-essencials) de l'Alta Ribagorça. Amb 3.014 m és el segon més alt, per darrere del [Pic de Comaloforno](/cims/pic-de-comaloforno) (3.029 m), i els separen només 15 m."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Punta Alta?',
				resposta:
					'Reptes Muntanyencs le dedica dos días: el primero, hasta el refugio Ventosa i Calvell (2 h 15 min según la Vall de Boí) y el segundo, la subida, la cresta y la bajada. La vuelta con la Pala Alta de Sarradé es de 13,7 km y 1.281 m, con 6 h 46 min de marcha.'
			},
			{
				pregunta: '¿La Punta Alta tiene trepada?',
				resposta:
					'La reseña de Reptes Muntanyencs sitúa las trepadas en la Pala Alta de Sarradé, la cima que añade. Hasta la Punta Alta describe un largo caos de bloques con hitos y la cresta final desde el coll Arenós, sin detallar sus pasos. No es un camino de senderismo.'
			},
			{
				pregunta: '¿Dónde se puede dormir para hacer la Punta Alta?',
				resposta:
					'En el refugio Ventosa i Calvell, en la ruta Carros de Foc. Dentro del parque nacional no se puede acampar ni hacer vivac.'
			},
			{
				pregunta: '¿La Punta Alta cuenta como cima esencial?',
				resposta:
					'Sí, es una de las seis [cimas esenciales](/cims-essencials) de la Alta Ribagorça. Con 3.014 m es la segunda más alta, por detrás del [Pic de Comaloforno](/cims/pic-de-comaloforno) (3.029 m), y las separan solo 15 m.'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, VALLBOI, PARC_FAQ],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
