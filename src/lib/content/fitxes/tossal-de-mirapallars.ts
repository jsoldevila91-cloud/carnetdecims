import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Tossal de Mirapallars i Urgell',
	url: 'https://ca.wikipedia.org/wiki/Tossal_de_Mirapallars_i_Urgell',
	consultat: CONSULTAT
};

const VIQUIPEDIA_MONTSEC = {
	nom: 'Viquipèdia: Montsec de Rúbies',
	url: 'https://ca.wikipedia.org/wiki/Montsec_de_R%C3%BAbies',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Tossal de Mirapallars i Urgell',
	url: 'https://reptesmuntanyencs.cat/tossal-de-mirapallars-i-urgell/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tossal-de-mirapallars',
	descripcio: {
		ca: [
			"El Tossal de Mirapallars i Urgell, o simplement Tossal de Mirapallars, és un dels cims de la carena del Montsec de Rúbies, a [la Noguera](/comarques/noguera), al límit amb el Pallars Jussà: hi toquen el terme de Vilanova de Meià i els de Llimiana i Gavet de la Conca. El Montsec de Rúbies és el sector oriental del Montsec, d'uns 13,5 km de llarg per 5 d'ample, entre la Conca de Tremp i la conca de Meià.",
			"La muntanya té dues cares molt diferents, amb parets calcàries al vessant meridional i pendents forts al septentrional. Del cim cap a ponent, la cinglera s'allarga fins al Tossal de les Torretes, el punt més alt del massís i de la comarca, on hi ha el vèrtex geodèsic.",
			'El GR 1 travessa el massís pel vessant nord, i la carena conserva trinxeres de la Guerra Civil, mig amagades per la vegetació. El relleu és càrstic, amb forats i cavitats com la cova o forat del Gel, a prop de la pista de pujada.',
			"L'altre gran cim del Montsec inclòs al repte és la [Penya Sant Alís](/cims/penya-sant-alis), al Montsec d'Ares. Aquí la pujada és força més llarga i, com que la carena és oberta i sense aixopluc, demana un dia estable."
		],
		es: [
			'El Tossal de Mirapallars i Urgell, o simplemente Tossal de Mirapallars, es una de las cimas de la cresta del Montsec de Rúbies, en [la Noguera](/comarques/noguera), en el límite con el Pallars Jussà: confluyen el término de Vilanova de Meià y los de Llimiana y Gavet de la Conca. El Montsec de Rúbies es el sector oriental del Montsec, de unos 13,5 km de largo por 5 de ancho, entre la Conca de Tremp y la cuenca de Meià.',
			'La montaña tiene dos caras muy distintas, con paredes calizas en la vertiente meridional y pendientes fuertes en la septentrional. De la cima hacia poniente, el farallón se alarga hasta el Tossal de les Torretes, el punto más alto del macizo y de la comarca, donde está el vértice geodésico.',
			'El GR 1 atraviesa el macizo por la vertiente norte, y la cresta conserva trincheras de la Guerra Civil, medio ocultas por la vegetación. El relieve es kárstico, con simas y cavidades como la cueva o forat del Gel, cerca de la pista de subida.',
			"La otra gran cima del Montsec incluida en el reto es la [Penya Sant Alís](/cims/penya-sant-alis), en el Montsec d'Ares. Aquí la subida es bastante más larga y, como la cresta es abierta y sin resguardo, pide un día estable."
		]
	},
	rutes: [
		{
			id: 'hostal-roig',
			nom: {
				ca: "Circular des de l'Hostal Roig per les Torretes",
				es: 'Circular desde el Hostal Roig por las Torretes'
			},
			sortida: { nom: 'Hostal Roig' },
			descripcio: {
				ca: "És la volta pel vessant nord que descriu el bloc Reptes Muntanyencs (2013): 15,7 km, 729 m de desnivell positiu i 4 h de marxa. De l'Hostal Roig, on s'arriba per carretera, se segueix la pista del GR 1 en direcció a la portella Blanca, amb un parell de dreceres senyalitzades, i abans de la portella es pren una altra pista que puja a la carena i al Tossal de les Torretes (unes 2 h). Es torna enrere per la carena, fàcil, fins al Tossal de Mirapallars, mitja hora més enllà, i es continua fins al puig del Camí Ramader i les Pales del Bosc, d'on es baixa sense camí, per terreny pedregós, fins a una pista. Qui només vulgui el Mirapallars pot tornar pel camí de pujada.",
				es: 'Es la vuelta por la vertiente norte que describe el blog Reptes Muntanyencs (2013): 15,7 km, 729 m de desnivel positivo y 4 h de marcha. Desde el Hostal Roig, adonde se llega por carretera, se sigue la pista del GR 1 en dirección a la portella Blanca, con un par de atajos señalizados, y antes de la portella se toma otra pista que sube a la cresta y al Tossal de les Torretes (unas 2 h). Se vuelve atrás por la cresta, fácil, hasta el Tossal de Mirapallars, media hora más allá, y se continúa hasta el puig del Camí Ramader y las Pales del Bosc, de donde se baja sin camino, por terreno pedregoso, hasta una pista. Quien solo quiera el Mirapallars puede volver por el camino de subida.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'La baixada de les Pales del Bosc és fora de camí. Amb boira o si no hi veus clar, torna per la carena i la pista del GR 1: és més llarg, però no té pèrdua.',
			'No hi ha aigua en tot el recorregut i la carena no té ombra.',
			'Passades les Pales del Bosc, la carena queda tallada abans de la roca Alta: no intentis continuar-hi.',
			'La ressenya és del 2013. Porta un mapa actual i el track, perquè les dreceres i els cartells poden haver canviat.'
		],
		es: [
			'La bajada de las Pales del Bosc es fuera de camino. Con niebla o si no lo ves claro, vuelve por la cresta y la pista del GR 1: es más largo, pero no tiene pérdida.',
			'No hay agua en todo el recorrido y la cresta no tiene sombra.',
			'Pasadas las Pales del Bosc, la cresta queda cortada antes de la roca Alta: no intentes continuar.',
			'La reseña es de 2013. Lleva un mapa actual y el track, porque los atajos y los carteles pueden haber cambiado.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Tossal de Mirapallars?',
				resposta:
					"Des de l'Hostal Roig, passant abans pel Tossal de les Torretes, el bloc Reptes Muntanyencs hi va arribar en 2 h 33 min, aturades incloses. Tota la circular, de 15,7 km, li va demanar 4 h de marxa."
			},
			{
				pregunta: 'És un cim difícil?',
				resposta:
					"La pujada es fa per pista i la carena és fàcil de seguir. La part delicada de la circular és la baixada, sense camí; es pot evitar tornant per on s'ha pujat."
			},
			{
				pregunta: 'Es pot fer el mateix dia el Tossal de les Torretes?',
				resposta:
					'Sí: és a la mateixa carena, a uns 2 km a ponent, i la pista de pujada hi passa abans. És el sostre de la Noguera i de tot el Montsec.'
			},
			{
				pregunta: 'El Tossal de Mirapallars compta com a cim essencial?',
				resposta:
					'Sí, és un dels quatre [cims essencials](/cims-essencials) de la Noguera, amb la [Pala Alta](/cims/pala-alta), la Penya Sant Alís i [Sant Mamet](/cims/sant-mamet).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Tossal de Mirapallars?',
				resposta:
					'Desde el Hostal Roig, pasando antes por el Tossal de les Torretes, el blog Reptes Muntanyencs llegó en 2 h 33 min, paradas incluidas. Toda la circular, de 15,7 km, le pidió 4 h de marcha.'
			},
			{
				pregunta: '¿Es una cima difícil?',
				resposta:
					'La subida se hace por pista y la cresta es fácil de seguir. La parte delicada de la circular es la bajada, sin camino; se puede evitar volviendo por donde se ha subido.'
			},
			{
				pregunta: '¿Se puede hacer el mismo día el Tossal de les Torretes?',
				resposta:
					'Sí: está en la misma cresta, a unos 2 km a poniente, y la pista de subida pasa antes por él. Es el techo de la Noguera y de todo el Montsec.'
			},
			{
				pregunta: '¿El Tossal de Mirapallars cuenta como cima esencial?',
				resposta:
					'Sí, es una de las cuatro [cimas esenciales](/cims-essencials) de la Noguera, con la [Pala Alta](/cims/pala-alta), la Penya Sant Alís y [Sant Mamet](/cims/sant-mamet).'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_MONTSEC, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
