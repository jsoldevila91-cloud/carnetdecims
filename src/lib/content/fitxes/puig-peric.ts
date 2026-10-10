import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puig Peric',
	url: 'https://ca.wikipedia.org/wiki/Puig_Peric',
	consultat: CONSULTAT
};

const ELS_PERDUTS = {
	nom: 'Els perduts: ascensión al Puig Peric (2810 m) y Petit Peric (2690 m)',
	url: 'https://elsperdutscat.blogspot.com/2010/10/ascension-al-puig-peric-2810-m-y-petit.html',
	consultat: CONSULTAT
};

const TRIO_PYRENEES = {
	nom: 'Trio Pyrénées: Puig Péric',
	url: 'https://www.trio-pyrenees.com/ca/puig_peric/',
	consultat: CONSULTAT
};

const RANDOZONE = {
	nom: 'Randozone: Puig Péric depuis Formiguères',
	url: 'https://www.randozone.com/outdoor/43/puig-peric-depuis-formigueres',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-peric',
	descripcio: {
		ca: [
			"El Puig Peric (Pic Péric en francès, Peric Gran) és un cim de 2.810 m del massís del Carlit, a la frontera entre l'Alta Cerdanya i el Capcir, a la [Catalunya Nord](/comarques/catalunya-nord). Queda a l'extrem nord-oest del terme dels Angles, prop del d'Angostrina i Vilanova de les Escaldes i de Formiguères, i molt a prop del límit amb el Donasà, ja a l'Arieja. Forma part del Parc Natural Regional dels Pirineus Catalans. Té un veí més baix, el Petit Peric (2.690 m), que els excursionistes solen enllaçar.",
			'La Viquipèdia destaca que el Puig Peric domina el llac de la Bollosa (les Bulloses) i la vall de la Lladura, i que el nom es pronuncia segons el capcinès, la varietat de català del Capcir. El vessant nord ja mira al Donasà, al país de Foix. Segons Els perduts, el [Carlit](/cims/carlit), el cim més alt del massís, es veu al fons des de la carena i des del cim.',
			"Hi ha dues maneres clàssiques d'acostar-s'hi. Des del llac de les Bulloses, una ruta circular de 19 km i 810 m de desnivell, segons Els perduts, remunta una carena amb pujades i baixades i, segons l'autor, dos o tres passos que cal fer amb molta cura. Des de l'estació de Formiguères, Trio Pyrénées proposa una circular de 16 km i uns 1.500 m de desnivell, d'unes 7 h, que passa pel refugi de Camporells i puja pel Petit Peric per una carena amb fites, dreta però fàcil.",
			"És un cim d'estiu i principis de tardor. Segons Els perduts, al juliol i a l'agost cal deixar el cotxe a la barrera de la carretera de les Bulloses i agafar l'autobús que hi puja tot el dia. La ruta és llarga: l'autor volia sortir a les 7 h, ho va fer a les 9 h i hi va trobar a la carena un vent fort i a ratxes."
		],
		es: [
			'El Puig Peric (Pic Péric en francés, Peric Gran) es una cima de 2.810 m del macizo del Carlit, en la frontera entre la Alta Cerdaña y el Capcir, en la [Cataluña Norte](/comarques/catalunya-nord). Queda en el extremo noroeste del término de Els Angles, cerca del de Angostrina i Vilanova de les Escaldes y de Formiguères, y muy cerca del límite con el Donasà, ya en el Ariège. Forma parte del Parque Natural Regional de los Pirineos Catalanes. Tiene un vecino más bajo, el Petit Peric (2.690 m), que los excursionistas suelen enlazar.',
			'La Viquipèdia destaca que el Puig Peric domina el lago de la Bollosa (les Bulloses) y el valle de la Lladura, y que el nombre se pronuncia según el capcinès, la variedad de catalán del Capcir. La vertiente norte ya mira al Donasà, en el país de Foix. Según Els perduts, el [Carlit](/cims/carlit), la cima más alta del macizo, se ve al fondo desde la cresta y desde la cima.',
			'Hay dos formas clásicas de acercarse. Desde el lago de las Bulloses, una ruta circular de 19 km y 810 m de desnivel, según Els perduts, remonta una cresta con subidas y bajadas y, según el autor, dos o tres pasos que hay que hacer con mucho cuidado. Desde la estación de Formiguères, Trio Pyrénées propone una circular de 16 km y unos 1.500 m de desnivel, de unas 7 h, que pasa por el refugio de Camporells y sube por el Petit Peric por una cresta con hitos, empinada pero fácil.',
			'Es una cima de verano y principios de otoño. Según Els perduts, en julio y agosto hay que dejar el coche en la barrera de la carretera de las Bulloses y coger el autobús que sube durante todo el día. La ruta es larga: el autor quería salir a las 7 h, lo hizo a las 9 h y encontró en la cresta un viento fuerte y racheado.'
		]
	},
	rutes: [
		{
			id: 'bulloses',
			nom: {
				ca: 'Des del llac de les Bulloses',
				es: 'Desde el lago de las Bulloses'
			},
			sortida: { nom: 'Presa de les Bulloses (Els Angles)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Els perduts va sortir de la presa, va vorejar el llac per l'esquerra (GR i marques grogues) i, en lloc d'agafar el GR cap a la balmeta, va travessar una passarel·la de fusta i va pujar pel bosc cap al nord amb fites. Al coll es tria entre el Petit Peric a la dreta i el Puig Peric a l'esquerra. La carena fa pujades i baixades, amb dos o tres passos que demanen molta cura. L'autor dona 19 km i 810 m de desnivell per a la circular, que li va ocupar unes 10 h de la sortida a la tornada.",
				es: 'Els perduts salió de la presa, bordeó el lago por la izquierda (GR y marcas amarillas) y, en lugar de tomar el GR hacia la balmeta, cruzó una pasarela de madera y subió por el bosque hacia el norte con hitos. En el collado se elige entre el Petit Peric a la derecha y el Puig Peric a la izquierda. La cresta tiene subidas y bajadas, con dos o tres pasos que piden mucho cuidado. El autor da 19 km y 810 m de desnivel para la circular, que le ocupó unas 10 h de la salida a la vuelta.'
			},
			fonts: [ELS_PERDUTS]
		},
		{
			id: 'formigueres',
			nom: {
				ca: 'Circular des de Formiguères pels llacs de Camporells',
				es: 'Circular desde Formiguères por los lagos de Camporells'
			},
			sortida: { nom: 'Arribada del telemix de Formiguères' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Trio Pyrénées descriu una circular d'uns 16 km i 1.500 m de pujada, de 7 h, des de dalt del telemix: la serra del Mauri fins a uns 2.400 m, baixada al refugi de Camporells, carena fins al Petit Peric (amb fites, dreta però fàcil), coll i cim del Peric, i tornada pels llacs. Randozone la planteja des del poble de Formiguères (1.740 m), també en unes 7 h, passant pels llacs de Camporells i tornant per la vall de la Lladura. La baixada per la Basseta pot tenir passos delicats amb neu.",
				es: 'Trio Pyrénées describe una circular de unos 16 km y 1.500 m de subida, de 7 h, desde lo alto del telemix: la serra del Mauri hasta unos 2.400 m, bajada al refugio de Camporells, cresta hasta el Petit Peric (con hitos, empinada pero fácil), collado y cima del Peric, y vuelta por los lagos. Randozone la plantea desde el pueblo de Formiguères (1.740 m), también en unas 7 h, pasando por los lagos de Camporells y volviendo por la vall de la Lladura. La bajada por la Basseta puede tener pasos delicados con nieve.'
			},
			fonts: [TRIO_PYRENEES, RANDOZONE]
		}
	],
	consells: {
		ca: [
			"Al juliol i a l'agost, segons Els perduts, cal aparcar a la barrera de la carretera de les Bulloses i agafar l'autobús; mira els horaris actuals abans d'anar-hi.",
			"Surt d'hora: l'autor d'Els perduts volia començar a les 7 h, va sortir a les 9 h i va tornar unes 10 h després.",
			'La carena té dos o tres passos que demanen cura; amb ventades fortes, millor no continuar.',
			'A la sortida de Formiguères, la baixada per la Basseta pot tenir passos delicats amb neu, segons Trio Pyrénées: amb neu, desfés el camí de pujada.',
			'Al refugi de Camporells (guardat) es pot menjar i reservar nit, segons Trio Pyrénées; hi ha una zona de bivac autoritzada al costat.'
		],
		es: [
			'En julio y agosto, según Els perduts, hay que aparcar en la barrera de la carretera de las Bulloses y coger el autobús; mira los horarios actuales antes de ir.',
			'Sal temprano: el autor de Els perduts quería empezar a las 7 h, salió a las 9 h y volvió unas 10 h después.',
			'La cresta tiene dos o tres pasos que piden cuidado; con rachas fuertes, mejor no seguir.',
			'En la salida de Formiguères, la bajada por la Basseta puede tener pasos delicados con nieve, según Trio Pyrénées: con nieve, deshaz el camino de subida.',
			'En el refugio de Camporells (guardado) se puede comer y reservar noche, según Trio Pyrénées; hay una zona de vivac autorizada al lado.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puig Peric?',
				resposta:
					'Segons Els perduts, uns 10 h de circular de 19 km (810 m) des de les Bulloses comptant parades; Trio Pyrénées i Randozone, unes 7 h per a la circular des de Formiguères (16 km i 1.500 m).'
			},
			{
				pregunta: 'Té passos tècnics?',
				resposta:
					"Els perduts descriu una carena amb pujades i baixades i dos o tres passos que cal fer amb molta cura; Trio Pyrénées, una carena amb fites, dreta però fàcil. Cap de les dues ressenyes hi descriu passos d'escalada, però cal peu segur."
			},
			{
				pregunta: 'Es pot enllaçar amb el Petit Peric?',
				resposta:
					'Sí, és el que fan les dues rutes: el Petit Peric (2.690 m) és a la mateixa carena i es pot passar de pujada o de baixada.'
			},
			{
				pregunta: 'El Puig Peric compta com a cim essencial?',
				resposta:
					"Sí. És el tercer dels vuit essencials de la Catalunya Nord per altitud, després del [Carlit](/cims/carlit) i de la [Torre d'Eina](/cims/torre-d-eina), i queda per sobre del [Canigó](/cims/canigo)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puig Peric?',
				resposta:
					'Según Els perduts, unas 10 h de circular de 19 km (810 m) desde las Bulloses contando paradas; Trio Pyrénées y Randozone, unas 7 h para la circular desde Formiguères (16 km y 1.500 m).'
			},
			{
				pregunta: '¿Tiene pasos técnicos?',
				resposta:
					'Els perduts describe una cresta con subidas y bajadas y dos o tres pasos que hay que hacer con mucho cuidado; Trio Pyrénées, una cresta con hitos, empinada pero fácil. Ninguna de las dos reseñas describe pasos de escalada, pero hace falta pie seguro.'
			},
			{
				pregunta: '¿Se puede enlazar con el Petit Peric?',
				resposta:
					'Sí, es lo que hacen las dos rutas: el Petit Peric (2.690 m) está en la misma cresta y se puede pasar de subida o de bajada.'
			},
			{
				pregunta: '¿El Puig Peric cuenta como cima esencial?',
				resposta:
					'Sí. Es la tercera de las ocho esenciales de Cataluña Norte por altitud, tras el [Carlit](/cims/carlit) y la [Torre d’Eina](/cims/torre-d-eina), y queda por encima del [Canigó](/cims/canigo).'
			}
		]
	},
	fonts: [VIQUIPEDIA, ELS_PERDUTS, TRIO_PYRENEES, RANDOZONE],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
