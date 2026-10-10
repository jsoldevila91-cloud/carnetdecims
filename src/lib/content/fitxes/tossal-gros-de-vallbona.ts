import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const WIKIPEDIA = {
	nom: 'Wikipedia: Tossal Gros de Vallbona',
	url: 'https://en.wikipedia.org/wiki/Tossal_Gros_de_Vallbona',
	consultat: CONSULTAT
};

const VIQUIPEDIA_VALLBONA = {
	nom: 'Viquipèdia: Vallbona de les Monges (llista de topònims)',
	url: 'https://ca.wikipedia.org/wiki/Tossal_Gros_de_Vallbona',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Tossal Gros de Vallbona',
	url: 'https://reptesmuntanyencs.cat/tossal-gros-de-vallbona/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tossal-gros-de-vallbona',
	descripcio: {
		ca: [
			"El Tossal Gros de Vallbona és el punt més alt de la serra del Tallat. Cau entre els termes de l'Espluga de Francolí, a [la Conca de Barberà](/comarques/conca-de-barbera), i de Vallbona de les Monges, a l'Urgell. La Wikipedia en anglès assenyala que la ruta més fàcil comença a Senan, on s'arriba amb cotxe des dels Omells de na Gaia o l'Espluga de Francolí. La serra del Tallat, segons la llista de topònims de Vallbona de les Monges, té un parc eòlic compartit amb Passanant i Belltall.",
			"Vallbona de les Monges és coneguda pel monestir de Santa Maria de Vallbona, d'estil gòtic català, amb la tomba de Violant d'Hongria, que apareix a la mateixa llista. El tossal és un dels quatre cims essencials de la Conca de Barberà, amb la [Mola d'Estat](/cims/mola-d-estat), la [Punta del Curull](/cims/punta-del-curull) i [Sant Miquel de Montclar](/cims/sant-miquel-de-montclar).",
			"Reptes Muntanyencs, en una ressenya escrita en castellà, hi puja des de Senan per una pista que, segons diu, no té gaire complicació, i s'ajuda de les senyals blanques i vermelles del GR 171. El mateix bloc afirma que aquest cim, igual que tota la serra del Tallat, està ple de torres eòliques. Aquell dia hi havia molta boira i l'autor no va poder parlar de vistes."
		],
		es: [
			"El Tossal Gros de Vallbona es el punto más alto de la serra del Tallat. Cae entre los términos de l'Espluga de Francolí, en [la Conca de Barberà](/comarques/conca-de-barbera), y de Vallbona de les Monges, en el Urgell. La Wikipedia en inglés señala que la ruta más fácil empieza en Senan, a donde se llega en coche desde els Omells de na Gaia o l'Espluga de Francolí. La serra del Tallat, según la lista de topónimos de Vallbona de les Monges, tiene un parque eólico compartido con Passanant i Belltall.",
			"Vallbona de les Monges es conocida por el monasterio de Santa Maria de Vallbona, de estilo gótico catalán, con la tumba de Violant d'Hongria, que aparece en la misma lista. El tossal es una de las cuatro cimas esenciales de la Conca de Barberà, con la [Mola d'Estat](/cims/mola-d-estat), la [Punta del Curull](/cims/punta-del-curull) y [Sant Miquel de Montclar](/cims/sant-miquel-de-montclar).",
			'Reptes Muntanyencs, en una reseña escrita en castellano, sube desde Senan por una pista que, según dice, no tiene mucha complicación, y se ayuda de las señales blancas y rojas del GR 171. El mismo blog afirma que esta cima, al igual que toda la serra del Tallat, está llena de torres eólicas. Aquel día había mucha niebla y el autor no pudo hablar de vistas.'
		]
	},
	rutes: [
		{
			id: 'senan',
			nom: {
				ca: 'Circular des de Senan pel GR 171',
				es: 'Circular desde Senan por el GR 171'
			},
			sortida: { nom: 'Senan (carrer del Portal de Senan)' },
			descripcio: {
				ca: "Reptes Muntanyencs documenta una circular que surt de Senan, amb pistes, camins i senders: uns 5,6 km, uns 204 m de desnivell positiu i 1 h 11 min de marxa efectiva sense parades. Segueix les senyals blanques i vermelles del GR 171 i, al tram final, hi ha cintes de plàstic d'una cursa. La pàgina no indica el temps ni la distància fins al cim.",
				es: 'Reptes Muntanyencs documenta una circular que sale de Senan, con pistas, caminos y senderos: unos 5,6 km, unos 204 m de desnivel positivo y 1 h 11 min de marcha efectiva sin paradas. Sigue las señales blancas y rojas del GR 171 y, en el tramo final, hay cintas de plástico de una carrera. La página no indica el tiempo ni la distancia hasta la cima.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'El bloc va seguir sempre les senyals blanques i vermelles del GR 171: fes-les servir de guia, sobretot amb boira.',
			'El vessant del sud del tossal no sembla tenir camí i és molt pendent, segons el bloc: no hi baixis.',
			'A la serra del Tallat hi ha un parc eòlic; la ressenya parla de torres eòliques al cim i a tota la serra.',
			"Telèfon d'emergències: 112."
		],
		es: [
			'El blog siguió siempre las señales blancas y rojas del GR 171: úsalas de guía, sobre todo con niebla.',
			'La vertiente sur del tossal no parece tener camino y es muy pendiente, según el blog: no bajes por ahí.',
			'En la serra del Tallat hay un parque eólico; la reseña habla de torres eólicas en la cima y en toda la sierra.',
			'Teléfono de emergencias: 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Des d’on es puja al Tossal Gros de Vallbona?',
				resposta:
					"La ruta més fàcil comença a Senan, segons la Wikipedia, a la qual s'arriba des dels Omells de na Gaia o l'Espluga de Francolí."
			},
			{
				pregunta: 'Quant es triga a pujar-hi?',
				resposta:
					"Reptes Muntanyencs documenta una circular d'uns 5,6 km des de Senan amb 1 h 11 min de marxa efectiva sense parades."
			},
			{
				pregunta: 'Està senyalitzat?',
				resposta:
					"El bloc segueix el GR 171, amb senyals blanques i vermelles, i al tram final troba cintes de plàstic d'una cursa."
			},
			{
				pregunta: 'El Tossal Gros de Vallbona compta com a cim essencial?',
				resposta:
					'Sí, és un dels quatre [cims essencials](/cims-essencials) de la Conca de Barberà.'
			}
		],
		es: [
			{
				pregunta: '¿Desde dónde se sube al Tossal Gros de Vallbona?',
				resposta:
					"La ruta más fácil empieza en Senan, según la Wikipedia, a donde se llega desde els Omells de na Gaia o l'Espluga de Francolí."
			},
			{
				pregunta: '¿Cuánto se tarda en subir?',
				resposta:
					'Reptes Muntanyencs documenta una circular de unos 5,6 km desde Senan con 1 h 11 min de marcha efectiva sin paradas.'
			},
			{
				pregunta: '¿Está señalizado?',
				resposta:
					'El blog sigue el GR 171, con señales blancas y rojas, y en el tramo final encuentra cintas de plástico de una carrera.'
			},
			{
				pregunta: '¿El Tossal Gros de Vallbona cuenta como cima esencial?',
				resposta:
					'Sí, es una de las cuatro [cimas esenciales](/cims-essencials) de la Conca de Barberà.'
			}
		]
	},
	fonts: [WIKIPEDIA, VIQUIPEDIA_VALLBONA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
