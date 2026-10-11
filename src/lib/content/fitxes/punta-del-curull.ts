import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Punta del Curull',
	url: 'https://ca.wikipedia.org/wiki/Punta_del_Curull',
	consultat: CONSULTAT
};

const TRES_CAT = {
	nom: '3Cat (SX3): Excursió familiar a les Muntanyes de Prades, a la Costa Daurada',
	url: 'https://www.3cat.cat/tv3/sx3/excursio-familiar-a-les-muntanyes-de-prades-a-la-costa-daurada/noticia/3327701/',
	consultat: CONSULTAT
};

const SURT_DE_CASA = {
	nom: 'Surt de Casa Ponent: Ruta: les Garrigues',
	url: 'https://surtdecasa.cat/ponent/entorn/ruta-les-garrigues',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Punta del Curull',
	url: 'https://reptesmuntanyencs.cat/punta-del-curull/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'punta-del-curull',
	descripcio: {
		ca: [
			"La Punta del Curull és un dels cims de la serra de la Llena, la carena que separa [la Conca de Barberà](/comarques/conca-de-barbera) de les Garrigues, entre els termes de Vilanova de Prades i del Vilosell. La serra és de conglomerat i forma part de l'espai de les Muntanyes de Prades, com la [Mola d'Estat](/cims/mola-d-estat) i el [Tossal de la Baltasana](/cims/tossal-de-la-baltasana).",
			"El cim té dos noms segons el costat des d'on es mira: Punta del Curull a Vilanova de Prades i la Tossa, o tossal del Quico, al Vilosell. A les Garrigues se'l té pel cim més emblemàtic de la comarca, per bé que la Cogulla, a la mateixa carena i amb una torre de vigilància forestal, és una mica més alta. Al capdamunt hi ha un cartell amb el nom i un pessebre.",
			"És una muntanya amb molta prominència, i la vista ho agraeix: la plana, el Prepirineu i el Pirineu per una banda, i per l'altra les Muntanyes de Prades, el Montsant i Vilanova de Prades als peus. La serra, amb els seus cingles de conglomerat, és també una zona d'escalada coneguda.",
			"Des de Vilanova és una sortida de mig matí que es pot fer amb canalla. Si es vol allargar, la volta senyalitzada continua fins als Calaixos de l'Ereldo, un laberint de passadissos entre roques que acaba en una cova fonda."
		],
		es: [
			"La Punta del Curull es una de las cimas de la sierra de la Llena, la cresta que separa [la Conca de Barberà](/comarques/conca-de-barbera) de las Garrigues, entre los términos de Vilanova de Prades y del Vilosell. La sierra es de conglomerado y forma parte del espacio de las Muntanyes de Prades, como la [Mola d'Estat](/cims/mola-d-estat) y el [Tossal de la Baltasana](/cims/tossal-de-la-baltasana).",
			'La cima tiene dos nombres según el lado desde el que se mire: Punta del Curull en Vilanova de Prades y la Tossa, o tossal del Quico, en el Vilosell. En las Garrigues se la tiene por la cima más emblemática de la comarca, aunque la Cogulla, en la misma cresta y con una torre de vigilancia forestal, es algo más alta. Arriba hay un cartel con el nombre y un belén.',
			'Es una montaña con mucha prominencia, y la vista lo agradece: el llano, el Prepirineo y el Pirineo por un lado, y por el otro las Muntanyes de Prades, el Montsant y Vilanova de Prades a los pies. La sierra, con sus riscos de conglomerado, es también una zona de escalada conocida.',
			"Desde Vilanova es una salida de media mañana que se puede hacer con niños. Si se quiere alargar, la vuelta señalizada continúa hasta los Calaixos de l'Ereldo, un laberinto de pasillos entre rocas que termina en una cueva profunda."
		]
	},
	rutes: [
		{
			id: 'vilanova-de-prades',
			nom: {
				ca: 'Circular des de Vilanova de Prades',
				es: 'Circular desde Vilanova de Prades'
			},
			sortida: {
				nom: 'Ermita de Sant Antoni de Pàdua, al costat del cementiri (Vilanova de Prades)'
			},
			tecnicitat: 'cap',
			descripcio: {
				ca: "Es deixa el cotxe a l'ermita de Sant Antoni i es travessa el poble fins a l'església de Sant Salvador, on comença el camí, pel carrer dels Cups. Un sender fressat, amb marques de PR i ferradures grogues, voreja la roca del Sentinella, creua la pista dels Solans, passa a tocar de les coves del Nano i de Bigues i surt a la pista de les antenes; cap a la dreta, pel caire de la serra, s'arriba al cim. El bloc Reptes Muntanyencs hi va comptar 2,2 km i uns 40 minuts de pujada, i 4,4 km amb 166 m de desnivell per a la volta curta. La circular familiar que proposa 3Cat, allargada fins als Calaixos de l'Ereldo, fa 6 km i unes dues hores.",
				es: "Se deja el coche en la ermita de Sant Antoni y se cruza el pueblo hasta la iglesia de Sant Salvador, donde empieza el camino, por la calle dels Cups. Un sendero marcado, con señales de PR y herraduras amarillas, bordea la roca del Sentinella, cruza la pista de los Solans, pasa junto a las cuevas del Nano y de Bigues y sale a la pista de las antenas; hacia la derecha, por el borde de la sierra, se llega a la cima. El blog Reptes Muntanyencs contó 2,2 km y unos 40 minutos de subida, y 4,4 km con 166 m de desnivel para la vuelta corta. La circular familiar que propone 3Cat, alargada hasta los Calaixos de l'Ereldo, tiene 6 km y unas dos horas."
			},
			fonts: [TRES_CAT, REPTES]
		},
		{
			id: 'el-vilosell',
			nom: {
				ca: "Des del Vilosell per l'ermita del Crucifici",
				es: 'Desde el Vilosell por la ermita del Crucifici'
			},
			sortida: { nom: 'Ermita de Sant Sebastià (el Vilosell)' },
			descripcio: {
				ca: "Pel vessant de les Garrigues, Surt de Casa descriu una pujada de poc menys de dues hores. Se surt del Vilosell pel PR-C 184, entre vinyes i cereal, fins a l'ermita del Crucifici, arrecerada sota una gran roca (uns 40 minuts). D'allà un corriol amb marques vermelles s'enfila fort pel bosc en direcció a la font de Marimanya fins a la carena, on es retroben les marques del PR, que se segueixen cap a la dreta fins al cim. Es pot tornar per la Cogulla i Sant Miquel de la Tosca.",
				es: 'Por la vertiente de las Garrigues, Surt de Casa describe una subida de algo menos de dos horas. Se sale del Vilosell por el PR-C 184, entre viñas y cereal, hasta la ermita del Crucifici, resguardada bajo una gran roca (unos 40 minutos). Desde allí una senda con marcas rojas sube fuerte por el bosque en dirección a la font de Marimanya hasta la cresta, donde se recuperan las marcas del PR, que se siguen hacia la derecha hasta la cima. Se puede volver por la Cogulla y Sant Miquel de la Tosca.'
			},
			fonts: [SURT_DE_CASA]
		}
	],
	consells: {
		ca: [
			"L'inici, darrere l'església de Vilanova, despista: sembla que es travessi un solar amb runa abans de trobar el sender bo.",
			"Les ferradures grogues marquen la volta dels Calaixos de l'Ereldo; les blanques i grogues, el PR. Als encreuaments, mira bé quina segueixes.",
			"Si entres a les coves, porta frontal i vigila el cap: l'entrada dels Calaixos obliga a ajupir-se.",
			'No hi ha fonts al camí de Vilanova: porta aigua, encara que la sortida sigui curta.'
		],
		es: [
			'El inicio, detrás de la iglesia de Vilanova, despista: parece que se cruce un solar con escombros antes de dar con el sendero bueno.',
			"Las herraduras amarillas marcan la vuelta de los Calaixos de l'Ereldo; las blancas y amarillas, el PR. En los cruces, mira bien cuál sigues.",
			'Si entras en las cuevas, lleva frontal y cuidado con la cabeza: la entrada de los Calaixos obliga a agacharse.',
			'No hay fuentes en el camino de Vilanova: lleva agua, aunque la salida sea corta.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Punta del Curull?',
				resposta:
					"Des de Vilanova de Prades, uns 40 minuts fins al cim i poc més d'una hora per a la volta curta de 4,4 km, segons el bloc Reptes Muntanyencs. Des del Vilosell, poc menys de dues hores de pujada."
			},
			{
				pregunta: 'Es pot fer amb nens?',
				resposta:
					"Sí. 3Cat la proposa com a excursió familiar: una circular de 6 km i unes dues hores, amb poc desnivell, que passa pel cim i pels Calaixos de l'Ereldo."
			},
			{
				pregunta: 'És el sostre de les Garrigues?',
				resposta:
					'Sovint se la presenta així, i és el cim més conegut de la comarca. La Cogulla, a la mateixa serra de la Llena, és una mica més alta.'
			},
			{
				pregunta: 'La Punta del Curull compta com a cim essencial?',
				resposta:
					"Sí, és un dels quatre [cims essencials](/cims-essencials) de la Conca de Barberà, amb la [Mola d'Estat](/cims/mola-d-estat), [Sant Miquel de Montclar](/cims/sant-miquel-de-montclar) i el [Tossal Gros de Vallbona](/cims/tossal-gros-de-vallbona)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Punta del Curull?',
				resposta:
					'Desde Vilanova de Prades, unos 40 minutos hasta la cima y poco más de una hora para la vuelta corta de 4,4 km, según el blog Reptes Muntanyencs. Desde el Vilosell, algo menos de dos horas de subida.'
			},
			{
				pregunta: '¿Se puede hacer con niños?',
				resposta:
					"Sí. 3Cat la propone como excursión familiar: una circular de 6 km y unas dos horas, con poco desnivel, que pasa por la cima y por los Calaixos de l'Ereldo."
			},
			{
				pregunta: '¿Es el techo de las Garrigues?',
				resposta:
					'A menudo se la presenta así, y es la cima más conocida de la comarca. La Cogulla, en la misma sierra de la Llena, es algo más alta.'
			},
			{
				pregunta: '¿La Punta del Curull cuenta como cima esencial?',
				resposta:
					"Sí, es una de las cuatro [cimas esenciales](/cims-essencials) de la Conca de Barberà, con la [Mola d'Estat](/cims/mola-d-estat), [Sant Miquel de Montclar](/cims/sant-miquel-de-montclar) y el [Tossal Gros de Vallbona](/cims/tossal-gros-de-vallbona)."
			}
		]
	},
	fonts: [VIQUIPEDIA, TRES_CAT, SURT_DE_CASA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
