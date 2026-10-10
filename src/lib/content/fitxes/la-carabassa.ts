import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const ENGARRISTA = {
	nom: 'Engarrista: la Carbassa (2.736 m)',
	url: 'https://www.engarrista.com/node/668',
	consultat: CONSULTAT
};

const MATARO = {
	nom: 'Agrupació Científico-Excursionista de Mataró: ascensió a la Carabassa',
	url: 'https://www.mataro.cat/ca/portal-entitats/agenda/ascensio-a-la-carabassa-2-736-m-2013-100-cims',
	consultat: CONSULTAT
};

const RAFA_YANES = {
	nom: 'Rafa Yanes: ruta a la Carabassa (2.740 m), Els 100 Cims',
	url: 'https://rafayanes.com/ruta-la-carabassa-2-740-m-els-100-cims/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'la-carabassa',
	descripcio: {
		ca: [
			'La Carabassa, que als mapes i a moltes ressenyes surt com la Carbassa, és un cim ample i poc definit al capdamunt de la serra de Comaermada, al terme de Bellver de Cerdanya, a [la Cerdanya](/comarques/cerdanya). No té parets ni agulles: és un llom herbós on el punt més alt es reconeix per una gran fita i un vèrtex geodèsic.',
			"Des del sud, la ruta surt de Talltendre, un petit nucli agregat de Bellver amb l'església de Sant Iscle i Santa Victòria i el refugi Cal Pere Sidro, que ofereix dormida i àpats; d'allà, la carena puja de manera progressiva i sense senyalització. A l'altra banda, el pla de Campllong, sobre Meranges, enllaça amb el refugi Joaquim Folch i Girona, els estanys d'Engorgs i el Bony del Manyer (2.809 m), on Rafa Yanes va veure marmotes i cavalls pasturant.",
			"La vista, segons Engarrista, abasta la plana de la Cerdanya amb el massís del [Puigmal](/cims/puigmal) al fons, la [Cambra d'Ase](/cims/cambra-d-ase), la [Tossa Plana de Lles](/cims/tossa-plana-de-lles) i la [Tosa](/cims/la-tosa), les estacions de Molina i Masella i el Cadí al sud. És el menys alt dels quatre essencials de la Cerdanya: queda per sota del [Puigpedrós](/cims/puigpedros), de la Tossa Plana i de la [Muga](/cims/la-muga).",
			"La millor època va de finals de primavera a la tardor. La carena mira al sud i la neu hi dura poc, però Engarrista hi va trobar neu dura i ventada per sobre dels 2.300 m i va calçar grampons; afegeix que el risc d'allaus a la carena és baix, però no als vessants laterals. Com que és ampla i sense senyals, amb boira costa saber per on baixar."
		],
		es: [
			'La Carabassa, que en los mapas y en muchas reseñas aparece como la Carbassa, es una cima ancha y poco definida en lo alto de la serra de Comaermada, en el término de Bellver de Cerdanya, en [la Cerdanya](/comarques/cerdanya). No tiene paredes ni agujas: es un lomo herboso donde el punto más alto se reconoce por un gran hito y un vértice geodésico.',
			'Desde el sur, la ruta sale de Talltendre, un pequeño núcleo agregado de Bellver con la iglesia de Sant Iscle i Santa Victòria y el refugio Cal Pere Sidro, que ofrece alojamiento y comidas; desde allí, la cresta sube de manera progresiva y sin señalización. Al otro lado, el pla de Campllong, sobre Meranges, enlaza con el refugio Joaquim Folch i Girona, los estanys d’Engorgs y el Bony del Manyer (2.809 m), donde Rafa Yanes vio marmotas y caballos pastando.',
			'La vista, según Engarrista, abarca la llanura de la Cerdanya con el macizo del [Puigmal](/cims/puigmal) al fondo, la [Cambra d’Ase](/cims/cambra-d-ase), la [Tossa Plana de Lles](/cims/tossa-plana-de-lles) y la [Tosa](/cims/la-tosa), las estaciones de Molina y Masella y el Cadí al sur. Es la menos alta de las cuatro esenciales de la Cerdanya: queda por debajo del [Puigpedrós](/cims/puigpedros), de la Tossa Plana y de la [Muga](/cims/la-muga).',
			'La mejor época va de finales de primavera al otoño. La cresta mira al sur y la nieve dura poco en ella, pero Engarrista encontró nieve dura y venteada por encima de los 2.300 m y se puso crampones; añade que el riesgo de aludes en la cresta es bajo, pero no en las laderas laterales. Como es ancha y sin señales, con niebla cuesta saber por dónde bajar.'
		]
	},
	rutes: [
		{
			id: 'talltendre',
			nom: { ca: 'Des de Talltendre per la carena', es: 'Desde Talltendre por la cresta' },
			sortida: { nom: 'Talltendre (Bellver de Cerdanya)' },
			distanciaKm: 7.6,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Engarrista descriu una pujada llarga, progressiva i suau, a vegades monòtona, que segueix sempre la carena de Comaermada cap al nord: els Orris, el collet de Coma de Fornos i el cim, a 7,6 km de la sortida i en 3 h 37 min comptant les parades. No hi ha senyalització i la carena és poc definida en molts punts, així que cal orientar-se bé. Es torna per la mateixa carena amb una petita variant pel Tossal de l'Amorriador: 15,16 km i 1.165 m de desnivell positiu en total.",
				es: 'Engarrista describe una subida larga, progresiva y suave, a veces monótona, que sigue siempre la cresta de Comaermada hacia el norte: els Orris, el collet de Coma de Fornos y la cima, a 7,6 km de la salida y en 3 h 37 min contando las paradas. No hay señalización y la cresta está poco definida en muchos puntos, así que hay que orientarse bien. Se vuelve por la misma cresta con una pequeña variante por el Tossal de l’Amorriador: 15,16 km y 1.165 m de desnivel positivo en total.'
			},
			fonts: [ENGARRISTA]
		},
		{
			id: 'pla-de-campllong',
			nom: {
				ca: 'Circular des del pla de Campllong (Meranges)',
				es: 'Circular desde el pla de Campllong (Meranges)'
			},
			sortida: { nom: 'Pla de Campllong (Meranges)' },
			descripcio: {
				ca: "A l'aparcament s'arriba per una carretera estreta i molt concorreguda que passa pel poble de Meranges. Una pista i un camí per bosc d'avets porten al refugi Joaquim Folch i Girona, als estanys d'Engorgs i, per la portella de Cal Colomer i el Bony del Manyer (2.809 m), al cim. Les cròniques no coincideixen en les xifres: el club de Mataró dona 12 km i 755 m de desnivell en circular, i Rafa Yanes 14,4 km i 1.262 m, amb una baixada final sense camí marcat i amb pedra solta.",
				es: 'Al aparcamiento se llega por una carretera estrecha y muy concurrida que pasa por el pueblo de Meranges. Una pista y un camino por bosque de abetos llevan al refugio Joaquim Folch i Girona, a los estanys d’Engorgs y, por la portella de Cal Colomer y el Bony del Manyer (2.809 m), a la cima. Las crónicas no coinciden en las cifras: el club de Mataró da 12 km y 755 m de desnivel en circular, y Rafa Yanes 14,4 km y 1.262 m, con una bajada final sin camino marcado y con piedra suelta.'
			},
			fonts: [MATARO, RAFA_YANES]
		}
	],
	consells: {
		ca: [
			'Porta el track: la carena de Comaermada no té senyals, i la baixada de la ruta del pla de Campllong va sense camí marcat.',
			"La carretera de Meranges al pla de Campllong és estreta i molt concorreguda: surt d'hora per trobar aparcament.",
			'Fora de temporada, porta grampons: Engarrista els va necessitar per la neu dura i ventada per sobre dels 2.300 m.',
			"Si hi ha neu, vigila els vessants laterals de la carena: tenen risc d'allaus encara que la carena no."
		],
		es: [
			'Lleva el track: la cresta de Comaermada no tiene señales, y la bajada de la ruta del pla de Campllong va sin camino marcado.',
			'La carretera de Meranges al pla de Campllong es estrecha y muy concurrida: sal temprano para encontrar aparcamiento.',
			'Fuera de temporada, lleva crampones: Engarrista los necesitó por la nieve dura y venteada por encima de los 2.300 m.',
			'Si hay nieve, vigila las laderas laterales de la cresta: tienen riesgo de aludes aunque la cresta no.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Des d'on és més fàcil pujar a la Carabassa?",
				resposta:
					"Engarrista qualifica de fàcil la ruta des de Talltendre (carena progressiva, 7,6 km fins al cim), mentre que Rafa Yanes qualifica d'exigent la del pla de Campllong, amb més desnivell i una baixada sense camí."
			},
			{
				pregunta: 'Quant es triga?',
				resposta:
					'Engarrista hi arriba en 3 h 37 min des de Talltendre, comptant les parades, i fa tot el recorregut de 15,16 km en 5 h 55 min. El club de Mataró preveu unes 6 h per a la circular del pla de Campllong.'
			},
			{
				pregunta: 'Es veu el Puigmal des del cim?',
				resposta:
					"Segons Engarrista, sí: el massís del Puigmal fa de teló de fons de la plana de la Cerdanya, i també es veuen la Cambra d'Ase, la Tossa Plana de Lles, la Tosa, Molina, Masella i el Cadí."
			},
			{
				pregunta: 'La Carabassa compta com a cim essencial?',
				resposta:
					'Sí, és el més baix dels quatre essencials de la Cerdanya, amb el [Puigpedrós](/cims/puigpedros), la [Tossa Plana de Lles](/cims/tossa-plana-de-lles) i la [Muga](/cims/la-muga).'
			}
		],
		es: [
			{
				pregunta: '¿Desde dónde es más fácil subir a la Carabassa?',
				resposta:
					'Engarrista califica de fácil la ruta desde Talltendre (cresta progresiva, 7,6 km hasta la cima), mientras que Rafa Yanes califica de exigente la del pla de Campllong, con más desnivel y una bajada sin camino.'
			},
			{
				pregunta: '¿Cuánto se tarda?',
				resposta:
					'Engarrista llega en 3 h 37 min desde Talltendre, contando las paradas, y hace todo el recorrido de 15,16 km en 5 h 55 min. El club de Mataró prevé unas 6 h para la circular del pla de Campllong.'
			},
			{
				pregunta: '¿Se ve el Puigmal desde la cima?',
				resposta:
					'Según Engarrista, sí: el macizo del Puigmal hace de telón de fondo de la llanura de la Cerdanya, y también se ven la Cambra d’Ase, la Tossa Plana de Lles, la Tosa, Molina, Masella y el Cadí.'
			},
			{
				pregunta: '¿La Carabassa cuenta como cima esencial?',
				resposta:
					'Sí, es la más baja de las cuatro esenciales de la Cerdanya, con el [Puigpedrós](/cims/puigpedros), la [Tossa Plana de Lles](/cims/tossa-plana-de-lles) y la [Muga](/cims/la-muga).'
			}
		]
	},
	fonts: [ENGARRISTA, MATARO, RAFA_YANES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
