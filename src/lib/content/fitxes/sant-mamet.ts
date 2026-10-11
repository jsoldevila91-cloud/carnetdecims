import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Muntanya de Sant Mamet',
	url: 'https://ca.wikipedia.org/wiki/Muntanya_de_Sant_Mamet',
	consultat: CONSULTAT
};

const CATALUNYA_ROMANICA = {
	nom: 'Enciclopèdia Catalana, Catalunya Romànica: Sant Mamet (Vilanova de Meià)',
	url: 'https://www.enciclopedia.cat/catalunya-romanica/sant-mamet-vilanova-de-meia',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Sant Mamet',
	url: 'https://reptesmuntanyencs.cat/sant-mamet/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'sant-mamet',
	descripcio: {
		ca: [
			"Sant Mamet és el punt culminant de la muntanya del mateix nom, una serra prepirinenca de [la Noguera](/comarques/noguera) repartida entre els termes d'Alòs de Balaguer, Artesa de Segre, Vilanova de Meià i Camarasa. Queda aïllada entre el Montsec de Rúbies, al nord, i la serra Carbonera, al sud, i és una muntanya calcària de lloms arrodonits, amb uns rasos aplanats per l'erosió al capdamunt i poca vegetació. Als vessants hi havia hagut mines de bauxita.",
			"El nom li ve de la capella de Sant Mamet, al capdamunt de la serra. Catalunya Romànica la considera una possible capella eremítica, pel lloc apartat on és, i recorda que l'advocació és de les antigues: ja surt en un document del 1231, quan Jaume de Cervera, senyor de Meià, i la seva muller Miracle d'Urgell van donar al monestir de Santa Maria de Meià la plana de Malagostar, al costat de la serra de Sant Mamet. Les restes conservades, segons la mateixa obra, no corresponen a cap edifici romànic. L'ermita és encara avui destí de romeries el dia del sant.",
			"La posició entre serres en fa un mirador ampli: es veuen de cara els cingles del Montsec de Rúbies, on hi ha el [Tossal de Mirapallars](/cims/tossal-de-mirapallars), tot el Montsec d'Ares i bona part del Pirineu. El cel d'aquesta part de la Noguera és fosc i net, i el cim és un lloc habitual d'observació astronòmica.",
			'Fa de mal pujar-hi amb calor: gairebé no hi ha ombra ni aigua. La carena, en canvi, és llarga i suau, i un cop a dalt es camina sense esforç amb el cim sempre a la vista.'
		],
		es: [
			'Sant Mamet es el punto culminante de la montaña del mismo nombre, una sierra prepirenaica de [la Noguera](/comarques/noguera) repartida entre los términos de Alòs de Balaguer, Artesa de Segre, Vilanova de Meià y Camarasa. Queda aislada entre el Montsec de Rúbies, al norte, y la sierra Carbonera, al sur, y es una montaña caliza de lomas redondeadas, con unos rasos aplanados por la erosión en lo alto y poca vegetación. En sus laderas hubo minas de bauxita.',
			"El nombre le viene de la capilla de Sant Mamet, en lo alto de la sierra. Catalunya Romànica la considera una posible capilla eremítica, por el lugar apartado en que está, y recuerda que la advocación es de las antiguas: ya aparece en un documento de 1231, cuando Jaume de Cervera, señor de Meià, y su mujer Miracle d'Urgell donaron al monasterio de Santa Maria de Meià la llanura de Malagostar, junto a la sierra de Sant Mamet. Los restos conservados, según la misma obra, no corresponden a ningún edificio románico. La ermita es todavía hoy destino de romerías el día del santo.",
			"La posición entre sierras la convierte en un mirador amplio: se ven de frente los riscos del Montsec de Rúbies, donde está el [Tossal de Mirapallars](/cims/tossal-de-mirapallars), todo el Montsec d'Ares y buena parte del Pirineo. El cielo de esta parte de la Noguera es oscuro y limpio, y la cima es un lugar habitual de observación astronómica.",
			'Cuesta subir con calor: apenas hay sombra ni agua. La cresta, en cambio, es larga y suave, y una vez arriba se camina sin esfuerzo con la cima siempre a la vista.'
		]
	},
	rutes: [
		{
			id: 'la-granolla',
			nom: {
				ca: 'Circular des de la Granolla (Alòs de Balaguer)',
				es: 'Circular desde la Granolla (Alòs de Balaguer)'
			},
			sortida: { nom: 'La Granolla (Alòs de Balaguer)' },
			descripcio: {
				ca: "La ressenya del bloc Reptes Muntanyencs, del 2015, puja pel vessant d'Alòs: una circular de 14,1 km i 755 m de desnivell positiu en 3 h 41 min de marxa, amb el cim a 7,4 km i unes dues hores de la sortida. Surt per un sender estret amb pintura verda, travessa el barranc del Torrent, on cal trobar una gran fita, i s'enfila sense treva fins al ras de Sant Mamet; des d'allà segueix la carena, amb el cim a la vista durant una hora. Es baixa per la pista de la Malagosta i el coll de Ferrús. A la Granolla s'hi arriba per pista de terra, amb vehicle alt. Els altres accessos habituals surten de Santa Maria de Meià, pel coll d'Orenga, i de la vall d'Ariet.",
				es: "La reseña del blog Reptes Muntanyencs, de 2015, sube por la vertiente de Alòs: una circular de 14,1 km y 755 m de desnivel positivo en 3 h 41 min de marcha, con la cima a 7,4 km y unas dos horas de la salida. Sale por un sendero estrecho con pintura verde, cruza el barranc del Torrent, donde hay que encontrar un gran hito, y sube sin tregua hasta el ras de Sant Mamet; desde allí sigue la cresta, con la cima a la vista durante una hora. Se baja por la pista de la Malagosta y el coll de Ferrús. A la Granolla se llega por pista de tierra, con vehículo alto. Los otros accesos habituales salen de Santa Maria de Meià, por el coll d'Orenga, y del valle de Ariet."
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'Evita els dies de calor forta: la pujada té molt poc arbrat i el bloc no va trobar aigua enlloc, ni tan sols a la font del cim, que no rajava.',
			'El recinte del cim està envoltat per una tanca; no la saltis per fer drecera i entra-hi per la pista.',
			'El primer sender és estret i fa de mal passar quan és moll. Al barranc del Torrent el camí es desdibuixa fins que es troba la fita.',
			"Des d'Alòs de Balaguer puja una pista fins al cim. L'Ajuntament la recomanava per a tot terreny, segons el bloc: no t'hi aventuris amb un turisme sense informar-te'n al poble.",
			"El dia de l'aplec l'ermita s'omple de gent."
		],
		es: [
			'Evita los días de calor fuerte: la subida tiene muy poco arbolado y el blog no encontró agua en ningún sitio, ni siquiera en la fuente de la cima, que no manaba.',
			'El recinto de la cima está rodeado por una valla; no la saltes para atajar y entra por la pista.',
			'El primer sendero es estrecho y se pasa mal cuando está mojado. En el barranc del Torrent el camino se desdibuja hasta que se encuentra el hito.',
			'Desde Alòs de Balaguer sube una pista hasta la cima. El Ayuntamiento la recomendaba para todoterreno, según el blog: no te aventures con un turismo sin informarte en el pueblo.',
			'El día de la romería la ermita se llena de gente.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Sant Mamet?',
				resposta:
					'Per la volta de la Granolla, el bloc Reptes Muntanyencs va arribar al cim en unes dues hores (7,4 km) i va fer tota la circular, de 14,1 km i 755 m de desnivell, en 3 h 41 min de marxa.'
			},
			{
				pregunta: 'És una ascensió difícil?',
				resposta:
					"La ressenya no hi descriu cap pas tècnic: són senders i pistes. El que pesa és la llargada, el desnivell i la manca d'ombra i d'aigua."
			},
			{
				pregunta: "D'on ve el nom?",
				resposta:
					'De la capella de Sant Mamet que hi ha al capdamunt de la serra, una advocació antiga que ja apareix en un document del 1231.'
			},
			{
				pregunta: 'Sant Mamet compta com a cim essencial?',
				resposta:
					'Sí, és un dels quatre [cims essencials](/cims-essencials) de la Noguera, amb la [Pala Alta](/cims/pala-alta), la [Penya Sant Alís](/cims/penya-sant-alis) i el Tossal de Mirapallars.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Sant Mamet?',
				resposta:
					'Por la vuelta de la Granolla, el blog Reptes Muntanyencs llegó a la cima en unas dos horas (7,4 km) e hizo toda la circular, de 14,1 km y 755 m de desnivel, en 3 h 41 min de marcha.'
			},
			{
				pregunta: '¿Es una ascensión difícil?',
				resposta:
					'La reseña no describe ningún paso técnico: son senderos y pistas. Lo que pesa es la longitud, el desnivel y la falta de sombra y de agua.'
			},
			{
				pregunta: '¿De dónde viene el nombre?',
				resposta:
					'De la capilla de Sant Mamet que hay en lo alto de la sierra, una advocación antigua que ya aparece en un documento de 1231.'
			},
			{
				pregunta: '¿Sant Mamet cuenta como cima esencial?',
				resposta:
					'Sí, es una de las cuatro [cimas esenciales](/cims-essencials) de la Noguera, con la [Pala Alta](/cims/pala-alta), la [Penya Sant Alís](/cims/penya-sant-alis) y el Tossal de Mirapallars.'
			}
		]
	},
	fonts: [VIQUIPEDIA, CATALUNYA_ROMANICA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
