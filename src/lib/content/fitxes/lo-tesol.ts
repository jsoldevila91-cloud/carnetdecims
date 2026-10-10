import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Lo Tésol',
	url: 'https://ca.wikipedia.org/wiki/Lo_T%C3%A9sol',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Lo Tésol (Tesó de Son)',
	url: 'https://reptesmuntanyencs.cat/lo-tesol-teso-de-son/',
	consultat: CONSULTAT
};

const PARC_FAQ = {
	nom: 'Parc Nacional d’Aigüestortes i Estany de Sant Maurici: preguntes freqüents',
	url: 'https://parcsnaturals.gencat.cat/ca/xarxa-de-parcs/aiguestortes/preguntes-frequents/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'lo-tesol',
	descripcio: {
		ca: [
			"Lo Tésol, també anomenat Tesó de Son, és un cim del municipi d'Alt Àneu, al [Pallars Sobirà](/comarques/pallars-sobira). La Viquipèdia el situa a la vall de Cabanes, dins del Parc Nacional d'Aigüestortes i Estany de Sant Maurici, i en dona 148 m de prominència. La roca és fil·lita i marbre, i al cim hi ha un vèrtex geodèsic. El segon nom el vincula amb l'antic municipi de Son, el poble des d'on s'accedeix a la pista que porta a la sortida habitual.",
			"La ruta que ressenya Reptes Muntanyencs és una volta circular que surt de l'aparcament del Pla de la Font i enllaça tres punts de la carena: el pic del Pinetó, la Roca Blanca i Lo Tésol. La cresta de la Roca Blanca és l'obstacle principal: l'autor la puja sense problemes, fent servir les mans per facilitar el progrés, i en situa els 20 o 30 metres més compromesos en un tram que deixa el vessant a un costat i el fil de la cresta uns metres per sobre. Just abans del cim hi ha un petit pas d'uns dos metres.",
			"A la plana d'Aires, al començament de la ruta, apareixen els primers cims del Parc Nacional d'Aigüestortes. Des del pic del Pinetó l'horitzó s'obre en totes direccions i es domina la capçalera de la vall de Cabanes, que el Tésol tanca.",
			"La baixada del cim no està senyalitzada: travessa una pendent dreta de nerets i pins que castiga turmells i cuixes abans de sortir a prats oberts. Sense neu, és una ascensió d'estiu i de començament de tardor; la ressenya és de finals de juliol, quan el refugi del Pla de la Font era tancat."
		],
		es: [
			'Lo Tésol, también llamado Tesó de Son, es una cima del municipio de Alt Àneu, en el [Pallars Sobirà](/comarques/pallars-sobira). La Viquipèdia lo sitúa en el valle de Cabanes, dentro del Parque Nacional de Aigüestortes i Estany de Sant Maurici, y le da 148 m de prominencia. La roca es filita y mármol, y en la cima hay un vértice geodésico. El segundo nombre lo vincula con el antiguo municipio de Son, el pueblo desde el que se accede a la pista que lleva a la salida habitual.',
			'La ruta que reseña Reptes Muntanyencs es una vuelta circular que sale del aparcamiento del Pla de la Font y enlaza tres puntos de la cresta: el pic del Pinetó, la Roca Blanca y Lo Tésol. La cresta de la Roca Blanca es el obstáculo principal: el autor la sube sin problemas, usando las manos para facilitar el avance, y sitúa los 20 o 30 metros más comprometidos en un tramo que deja la ladera a un lado y el filo de la cresta unos metros por encima. Justo antes de la cima hay un pequeño paso de unos dos metros.',
			'En la plana d’Aires, al comienzo de la ruta, aparecen las primeras cimas del Parque Nacional de Aigüestortes. Desde el pic del Pinetó el horizonte se abre en todas direcciones y se domina la cabecera del valle de Cabanes, que el Tésol cierra.',
			'La bajada de la cima no está señalizada: cruza una pendiente empinada de rododendros (nerets) y pinos que castiga tobillos y muslos antes de salir a prados abiertos. Sin nieve, es una ascensión de verano y de comienzos de otoño; la reseña es de finales de julio, cuando el refugio del Pla de la Font estaba cerrado.'
		]
	},
	rutes: [
		{
			id: 'pla-de-la-font',
			nom: {
				ca: 'Circular des del Pla de la Font pel Pinetó i la Roca Blanca',
				es: 'Circular desde el Pla de la Font por el Pinetó y la Roca Blanca'
			},
			sortida: { nom: 'Aparcament del Pla de la Font (Alt Àneu, uns 1.989 m)' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Reptes Muntanyencs fa la volta en sentit horari: pic del Pinetó, cresta de la Roca Blanca i Lo Tésol, i baixada sense senyals fins als plans de les Cabanyeres, on enllaça amb el camí senyalitzat de les Estanyeres i la Palomera per tornar al refugi. A la cresta hi ha fites. La volta fa 11,3 km i 1.001 m de desnivell, amb 4 h 20 min de marxa i 1 h 22 min d'aturades; el cim s'assoleix a les 2 h 49 min. Per la pista de terra, l'autor recomana un vehicle alt.",
				es: 'Reptes Muntanyencs hace la vuelta en sentido horario: pic del Pinetó, cresta de la Roca Blanca y Lo Tésol, y bajada sin señales hasta los plans de les Cabanyeres, donde enlaza con el camino señalizado de las Estanyeres y la Palomera para volver al refugio. En la cresta hay hitos. La vuelta hace 11,3 km y 1.001 m de desnivel, con 4 h 20 min de marcha y 1 h 22 min de paradas; la cima se alcanza a las 2 h 49 min. Para la pista de tierra, el autor recomienda un vehículo alto.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'Reptes Muntanyencs descriu dos accessos: per Son, uns 7 km des de la C-26 i una pista estreta on costa creuar-se amb un altre vehicle, o per Estaís i Jou, per una pista més ampla.',
			"A la cresta de la Roca Blanca, segueix les fites i avança amb calma als 20 o 30 m més compromesos. Amb la roca mullada, pren-t'hi més temps.",
			'La baixada és molt dreta i sense camí. Amb pluja o terreny moll és prudent no fer-la, i amb boira cal tenir el track.',
			"Dins del parc nacional no es pot acampar ni fer bivac fora dels refugis, i els gossos han d'anar lligats, segons les preguntes freqüents del parc."
		],
		es: [
			'Reptes Muntanyencs describe dos accesos: por Son, unos 7 km desde la C-26 y una pista estrecha donde cuesta cruzarse con otro vehículo, o por Estaís y Jou, por una pista más ancha.',
			'En la cresta de la Roca Blanca, sigue los hitos y avanza con calma en los 20 o 30 m más comprometidos. Con la roca mojada, tómatelo con más tiempo.',
			'La bajada es muy empinada y sin camino. Con lluvia o terreno mojado es prudente no hacerla, y con niebla hay que llevar el track.',
			'Dentro del parque nacional no se puede acampar ni hacer vivac fuera de los refugios, y los perros deben ir atados, según las preguntas frecuentes del parque.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Lo Tésol?',
				resposta:
					"Segons Reptes Muntanyencs, el cim s'assoleix a les 2 h 49 min des del Pla de la Font, amb el Pinetó i la Roca Blanca pel mig. La volta sencera són 11,3 km, 1.001 m de desnivell i 5 h 40 min incloent-hi les aturades."
			},
			{
				pregunta: 'Cal posar les mans a Lo Tésol?',
				resposta:
					"Sí, a la cresta de la Roca Blanca: l'autor hi fa servir les mans per facilitar el progrés, sobretot en els 20 o 30 m més compromesos. No és un camí d'excursionisme senzill."
			},
			{
				pregunta: 'Cal 4x4 per arribar al Pla de la Font?',
				resposta:
					"Segons Reptes Muntanyencs, amb la pista seca un 4x4 no és del tot necessari, però sí un vehicle alt. L'accés per Estaís i Jou té una pista més ampla. Informa't de l'estat de la pista abans de sortir."
			},
			{
				pregunta: 'Lo Tésol compta com a cim essencial?',
				resposta:
					'Sí, és un dels onze [cims essencials](/cims-essencials) del Pallars Sobirà. Amb 2.700 m, és a mig camí de la llista, entre el [Tuc de la Llança](/cims/tuc-de-la-llanca) (2.659 m) i el [Pic de Moredo](/cims/pic-de-moredo) (2.766 m).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Lo Tésol?',
				resposta:
					'Según Reptes Muntanyencs, la cima se alcanza a las 2 h 49 min desde el Pla de la Font, con el Pinetó y la Roca Blanca por el medio. La vuelta entera son 11,3 km, 1.001 m de desnivel y 5 h 40 min incluyendo las paradas.'
			},
			{
				pregunta: '¿Hay que poner las manos en Lo Tésol?',
				resposta:
					'Sí, en la cresta de la Roca Blanca: el autor usa las manos para facilitar el avance, sobre todo en los 20 o 30 m más comprometidos. No es un camino de senderismo sencillo.'
			},
			{
				pregunta: '¿Hace falta 4x4 para llegar al Pla de la Font?',
				resposta:
					'Según Reptes Muntanyencs, con la pista seca un 4x4 no es del todo necesario, pero sí un vehículo alto. El acceso por Estaís y Jou tiene una pista más ancha. Infórmate del estado de la pista antes de salir.'
			},
			{
				pregunta: '¿Lo Tésol cuenta como cima esencial?',
				resposta:
					'Sí, es una de las once [cimas esenciales](/cims-essencials) del Pallars Sobirà. Con 2.700 m, está a mitad de la lista, entre el [Tuc de la Llança](/cims/tuc-de-la-llanca) (2.659 m) y el [Pic de Moredo](/cims/pic-de-moredo) (2.766 m).'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, PARC_FAQ],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
