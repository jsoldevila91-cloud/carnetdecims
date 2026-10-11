import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Els Bessons (les Borges Blanques)',
	url: 'https://ca.wikipedia.org/wiki/Els_Bessons_(les_Borges_Blanques)',
	consultat: CONSULTAT
};

const VIQUIPEDIA_EIN = {
	nom: 'Viquipèdia: Els Bessons (Garrigues)',
	url: 'https://ca.wikipedia.org/wiki/Els_Bessons_(Garrigues)',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Els Bessons',
	url: 'https://reptesmuntanyencs.cat/els-bessons/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'els-bessons',
	descripcio: {
		ca: [
			"Els Bessons són un cim emblemàtic de [les Garrigues](/comarques/garrigues), al terme de les Borges Blanques. El nom ve de la forma: són dues elevacions contigües i d'alçada semblant. A la del nord, la principal, hi ha el vèrtex geodèsic, uns bancs i un plafó que ajuda a identificar el que es veu; i el que es veu és la plana de Lleida i, al fons, el Prepirineu.",
			"El cim dona nom a un espai d'interès natural, inclòs al PEIN el 1992, que s'estén també pels termes de Juneda, Cervià de les Garrigues i Castelldans. És terra de transició entre la plana estepària del Segrià i l'Urgell i els boscos de la serra de la Llena: turons suaus, amb conreus de secà d'olivera, ametller i vinya entre vessants de romaní i pinedes petites de pi blanc. S'hi veuen rapinyaires com l'àguila cuabarrada, l'àguila daurada i el duc.",
			"Dins el mateix espai hi ha turons una mica més alts, com la punta dels Marquesos, el tossal del Xivete o la punta del Pouet, però els Bessons són el cim emblemàtic i el que fa de mirador. Des de dalt criden l'atenció les grans basses de reg que alimenten els arbres en una comarca on l'aigua és escassa.",
			"És un passeig curt per pistes i camps, sense ombra ni fonts. La tardor i l'hivern són el bon moment; a l'estiu el sol hi cau de ple."
		],
		es: [
			'Els Bessons son una cima emblemática de [las Garrigues](/comarques/garrigues), en el término de les Borges Blanques. El nombre viene de la forma: son dos elevaciones contiguas y de altura parecida. En la del norte, la principal, están el vértice geodésico, unos bancos y un panel que ayuda a identificar lo que se ve; y lo que se ve es el llano de Lleida y, al fondo, el Prepirineo.',
			'La cima da nombre a un espacio de interés natural, incluido en el PEIN en 1992, que se extiende también por los términos de Juneda, Cervià de les Garrigues y Castelldans. Es tierra de transición entre la llanura esteparia del Segrià y el Urgell y los bosques de la sierra de la Llena: cerros suaves, con cultivos de secano de olivo, almendro y vid entre laderas de romero y pequeños pinares de pino carrasco. Se ven rapaces como el águila perdicera, el águila real y el búho real.',
			'Dentro del mismo espacio hay cerros algo más altos, como la punta dels Marquesos, el tossal del Xivete o la punta del Pouet, pero els Bessons son la cima emblemática y la que hace de mirador. Desde arriba llaman la atención las grandes balsas de riego que alimentan los árboles en una comarca donde el agua es escasa.',
			'Es un paseo corto por pistas y campos, sin sombra ni fuentes. El otoño y el invierno son el buen momento; en verano el sol cae de lleno.'
		]
	},
	rutes: [
		{
			id: 'coll-dels-marquesos',
			nom: {
				ca: 'Des del camí de les Borges Blanques (lo Benifet)',
				es: 'Desde el camino de les Borges Blanques (lo Benifet)'
			},
			sortida: { nom: 'Lo Benifet, coll dels Marquesos (les Borges Blanques)' },
			descripcio: {
				ca: "Segons la Viquipèdia, s'hi puja des de les Borges Blanques o des de la pista forestal del pla del Meno. El bloc Reptes Muntanyencs (2015) va deixar el cotxe a lo Benifet, al peu mateix del cim, on s'arriba amb turisme per pista de terra: pel camí de les Borges Blanques, que és per on ell va tornar, els Bessons queden a poc més d'un quilòmetre i mig i a uns 100 m de desnivell. La seva volta va ser molt més llarga, per encadenar abans la punta dels Marquesos, la punta del Pouet i el tossal del Xivete: 10,9 km, 319 m de desnivell positiu i 2 h 17 min de marxa, gairebé sempre per pistes i sense cap senyal.",
				es: 'Según la Viquipèdia, se sube desde les Borges Blanques o desde la pista forestal del pla del Meno. El blog Reptes Muntanyencs (2015) dejó el coche en lo Benifet, al pie mismo de la cima, adonde se llega en turismo por pista de tierra: por el camino de les Borges Blanques, que es por donde él volvió, els Bessons quedan a poco más de un kilómetro y medio y a unos 100 m de desnivel. Su vuelta fue mucho más larga, para encadenar antes la punta dels Marquesos, la punta del Pouet y el tossal del Xivete: 10,9 km, 319 m de desnivel positivo y 2 h 17 min de marcha, casi siempre por pistas y sin ninguna señal.'
			},
			fonts: [VIQUIPEDIA, REPTES]
		}
	],
	consells: {
		ca: [
			'No hi ha ni una font ni una ombra en tot el recorregut: porta aigua i gorra, encara que sigui hivern.',
			"Tot l'espai és un vedat de caça. En temporada, vesteix colors vius i informa't dels dies de batuda.",
			"Hi ha moltes pistes i cap marca: amb el cim a la vista és difícil perdre's, però un mapa estalvia voltes.",
			'Passaràs vora camps treballats i cabanes, alguna amb gossos: no travessis els conreus.'
		],
		es: [
			'No hay ni una fuente ni una sombra en todo el recorrido: lleva agua y gorra, aunque sea invierno.',
			'Todo el espacio es un coto de caza. En temporada, viste colores vivos e infórmate de los días de batida.',
			'Hay muchas pistas y ninguna marca: con la cima a la vista es difícil perderse, pero un mapa ahorra vueltas.',
			'Pasarás junto a campos trabajados y cabañas, alguna con perros: no cruces los cultivos.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar als Bessons?',
				resposta:
					"Des de lo Benifet, al peu del cim, són poc més d'un quilòmetre i mig i uns 100 m de desnivell, segons el track del bloc Reptes Muntanyencs. La seva volta pels quatre turons de l'espai, de 10,9 km, va demanar 2 h 17 min de marxa."
			},
			{
				pregunta: 'Per què es diuen els Bessons?',
				resposta:
					"Perquè el cim el formen dues elevacions contigües i d'alçada semblant. La principal és la del nord, on hi ha el vèrtex geodèsic."
			},
			{
				pregunta: 'Són el punt més alt de les Garrigues?',
				resposta:
					'No. Dins el mateix espai natural hi ha turons més alts, i la comarca arriba més amunt a la serra de la Llena, on hi ha la [Punta del Curull](/cims/punta-del-curull). Els Bessons en són el cim més conegut.'
			},
			{
				pregunta: 'Compten com a cim essencial?',
				resposta:
					"Sí, són l'únic [cim essencial](/cims-essencials) de les Garrigues a la llista del repte."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a els Bessons?',
				resposta:
					'Desde lo Benifet, al pie de la cima, son poco más de un kilómetro y medio y unos 100 m de desnivel, según el track del blog Reptes Muntanyencs. Su vuelta por los cuatro cerros del espacio, de 10,9 km, pidió 2 h 17 min de marcha.'
			},
			{
				pregunta: '¿Por qué se llaman els Bessons?',
				resposta:
					'Porque la cima la forman dos elevaciones contiguas y de altura parecida. La principal es la del norte, donde está el vértice geodésico.'
			},
			{
				pregunta: '¿Son el punto más alto de las Garrigues?',
				resposta:
					'No. Dentro del mismo espacio natural hay cerros más altos, y la comarca llega más arriba en la sierra de la Llena, donde está la [Punta del Curull](/cims/punta-del-curull). Els Bessons son su cima más conocida.'
			},
			{
				pregunta: '¿Cuentan como cima esencial?',
				resposta:
					'Sí, son la única [cima esencial](/cims-essencials) de las Garrigues en la lista del reto.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_EIN, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
