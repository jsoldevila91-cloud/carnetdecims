import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Castell de Milany',
	url: 'https://ca.wikipedia.org/wiki/Castell_de_Milany',
	consultat: CONSULTAT
};

const VALLFOGONA = {
	nom: 'Ajuntament de Vallfogona de Ripollès: restes del castell de Milany',
	url: 'https://vallfogona.cat/coneix/llocs-dinteres/restes-del-castell-de-milany/',
	consultat: CONSULTAT
};

const VALLFOGONA_RUTES = {
	nom: 'Ajuntament de Vallfogona de Ripollès: rutes de senderisme',
	url: 'https://vallfogona.cat/turisme/rutes-senderisme/',
	consultat: CONSULTAT
};

const FEMTURISME = {
	nom: 'Femturisme: castell de Milany des de Vallfogona de Ripollès',
	url: 'https://femturisme.cat/ca/rutes/castell-de-milany-des-de-vallfogona-de-ripolles',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'castell-de-milany',
	descripcio: {
		ca: [
			"El castell de Milany corona el puig de Milany, al límit entre Vidrà, a [Osona](/comarques/osona), i Vallfogona de Ripollès, que ja és al Ripollès. El turó domina la vall que comunica Vallfogona amb la plana de Vic i forma part de l'espai d'interès natural de les serres de Milany-Santa Magdalena i Puigsacalm-Bellmunt, el mateix que protegeix [Bellmunt](/cims/bellmunt) i [el Puigsacalm](/cims/puigsacalm). Segons la Viquipèdia, és el castell català bastit a més altitud.",
			"El topònim surt per primera vegada el 918 i el castell, el 962. Va ser el centre de la baronia de Milany i, segons la Viquipèdia, va dependre successivament dels comtats d'Osona i de Besalú i del casal de Barcelona; a finals del segle XIII, Dalmau de Palau el va fer reconstruir. Els remences el van prendre el 1462, potser perquè els terratrèmols d'aquell segle ja l'havien malmès, i sembla que es va abandonar en acabar la guerra. L'Ajuntament de Vallfogona recorda que el van ocupar les forces de Verntallat i que a la darreria del segle XVII pertanyia als comtes de Vallfogona.",
			"Avui és una ruïna declarada bé cultural d'interès nacional. Queden les restes de la torre de l'homenatge, d'una sala rectangular que podria haver estat la capella i d'una cisterna. Les excavacions del 2012 al 2014 van deixar al descobert la planta quadrada de la torre, amb parets d'1,6 m de gruix. Femturisme explica que el 2019 hi havia obres de restauració i que es pot pujar al mirador de la torre, amb vistes del Prepirineu, de la Garrotxa al Pedraforca, i del Montseny i Bellmunt cap al sud.",
			"Tota la serra és fageda, i per això Femturisme la recomana a la tardor. És també quan costa més de seguir el camí, perquè la fullaraca el tapa. A l'hivern, a més de 1.500 m, hi pot haver neu i glaç."
		],
		es: [
			'El castell de Milany corona el puig de Milany, en el límite entre Vidrà, en [Osona](/comarques/osona), y Vallfogona de Ripollès, que ya es del Ripollès. El cerro domina el valle que comunica Vallfogona con la plana de Vic y forma parte del espacio de interés natural de las sierras de Milany-Santa Magdalena y Puigsacalm-Bellmunt, el mismo que protege [Bellmunt](/cims/bellmunt) y [el Puigsacalm](/cims/puigsacalm). Según la Viquipèdia, es el castillo catalán construido a mayor altitud.',
			'El topónimo aparece por primera vez en 918 y el castillo, en 962. Fue el centro de la baronía de Milany y, según la Viquipèdia, dependió sucesivamente de los condados de Osona y de Besalú y de la casa de Barcelona; a finales del siglo XIII, Dalmau de Palau lo hizo reconstruir. Los remensas lo tomaron en 1462, quizá porque los terremotos de aquel siglo ya lo habían dañado, y parece que se abandonó al acabar la guerra. El Ayuntamiento de Vallfogona recuerda que lo ocuparon las fuerzas de Verntallat y que a finales del siglo XVII pertenecía a los condes de Vallfogona.',
			'Hoy es una ruina declarada bien cultural de interés nacional. Quedan los restos de la torre del homenaje, de una sala rectangular que podría haber sido la capilla y de una cisterna. Las excavaciones de 2012 a 2014 dejaron al descubierto la planta cuadrada de la torre, con muros de 1,6 m de grosor. Femturisme explica que en 2019 había obras de restauración y que se puede subir al mirador de la torre, con vistas del Prepirineo, de la Garrotxa al Pedraforca, y del Montseny y Bellmunt hacia el sur.',
			'Toda la sierra es hayedo, y por eso Femturisme la recomienda en otoño. Es también cuando más cuesta seguir el camino, porque la hojarasca lo tapa. En invierno, a más de 1.500 m, puede haber nieve y hielo.'
		]
	},
	rutes: [
		{
			id: 'vallfogona',
			nom: {
				ca: 'Circular des de Vallfogona de Ripollès per Santa Magdalena de Cambrils',
				es: 'Circular desde Vallfogona de Ripollès por Santa Magdalena de Cambrils'
			},
			sortida: { nom: 'Nucli de Vallfogona de Ripollès' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Femturisme descriu una circular de 16,8 km, 544 m de desnivell i entre 5 i 6 h, de dificultat moderada. Del poble baixa al pont medieval, on un pal indica el castell a 6 km, i puja amb les marques del GR 3 i el GR 151.1, un dels Camins de l'Abat Oliba: primer per corriol, després mitja hora llarga per la pista del bac de la Portella i finalment per la fageda. L'últim tram fins al castell és una petita grimpada, amb un parell de passadors per agafar-s'hi. La tornada segueix la carena pel PR-C 59 fins a Santa Magdalena de Cambrils (1 h 15 min) i baixa a Vallfogona.",
				es: "Femturisme describe una circular de 16,8 km, 544 m de desnivel y entre 5 y 6 h, de dificultad moderada. Desde el pueblo baja al puente medieval, donde un poste indica el castillo a 6 km, y sube con las marcas del GR 3 y el GR 151.1, uno de los Camins de l'Abat Oliba: primero por sendero, después media hora larga por la pista del bac de la Portella y finalmente por el hayedo. El último tramo hasta el castillo es una pequeña trepada, con un par de pasadores a los que agarrarse. La vuelta sigue la cresta por el PR-C 59 hasta Santa Magdalena de Cambrils (1 h 15 min) y baja a Vallfogona."
			},
			fonts: [FEMTURISME, VALLFOGONA_RUTES]
		}
	],
	consells: {
		ca: [
			"Porta el track o el mapa encara que hi hagi marques: Femturisme diu que la dificultat principal és l'orientació quan cauen les fulles, sobretot a la carena cap a Santa Magdalena.",
			'A la baixada de Santa Magdalena, vora una casa, surten diversos viaranys: allà cal seguir les marques del PR i uns punts liles.',
			'Si no vols fer tota la volta, pots tornar del castell pel camí de pujada; Femturisme també esmenta una baixada més curta per la font de la Tosca i el torrent de la Masica.',
			"El castell s'ha excavat i consolidat fa pocs anys: no t'enfilis als murs ni moguis pedres.",
			"Pel vessant sud s'hi pot pujar des de Vidrà o des de Llaés, segons la mateixa ressenya, que no en dona detalls."
		],
		es: [
			'Lleva el track o el mapa aunque haya marcas: Femturisme dice que la dificultad principal es la orientación cuando caen las hojas, sobre todo en la cresta hacia Santa Magdalena.',
			'En la bajada de Santa Magdalena, junto a una casa, salen varias sendas: allí hay que seguir las marcas del PR y unos puntos lilas.',
			'Si no quieres hacer toda la vuelta, puedes volver del castillo por el camino de subida; Femturisme menciona también una bajada más corta por la font de la Tosca y el torrente de la Masica.',
			'El castillo se ha excavado y consolidado hace pocos años: no te subas a los muros ni muevas piedras.',
			'Por la vertiente sur se puede subir desde Vidrà o desde Llaés, según la misma reseña, que no da detalles.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al castell de Milany des de Vallfogona?',
				resposta:
					'Femturisme compta entre 5 i 6 hores, segons el ritme i les parades, per a la circular de 16,8 km que hi puja pel GR 3 i torna per Santa Magdalena de Cambrils. Al pont medieval de Vallfogona, un pal indica el castell a 6 km.'
			},
			{
				pregunta: 'Hi ha cap pas difícil per arribar al castell?',
				resposta:
					'Només el final: segons Femturisme, per coronar el cim cal fer una petita grimpada, on un parell de passadors ajuden a posar les mans. La resta va per corriol, pista i fageda.'
			},
			{
				pregunta: 'Què queda del castell de Milany?',
				resposta:
					"Restes de la torre de l'homenatge, d'una sala rectangular i d'una cisterna, segons la Viquipèdia. L'Ajuntament de Vallfogona parla de restes escasses d'un conjunt que havia tingut església i cementiri."
			},
			{
				pregunta: 'El castell de Milany és a Osona o al Ripollès?',
				resposta:
					"Fa de partió entre Vidrà, a [Osona](/comarques/osona), i Vallfogona de Ripollès. A la llista del repte figura com a cim d'Osona, encara que la ruta més descrita surt de Vallfogona."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al castell de Milany desde Vallfogona?',
				resposta:
					'Femturisme cuenta entre 5 y 6 horas, según el ritmo y las paradas, para la circular de 16,8 km que sube por el GR 3 y vuelve por Santa Magdalena de Cambrils. En el puente medieval de Vallfogona, un poste indica el castillo a 6 km.'
			},
			{
				pregunta: '¿Hay algún paso difícil para llegar al castillo?',
				resposta:
					'Solo el final: según Femturisme, para coronar la cima hay que hacer una pequeña trepada, donde un par de pasadores ayudan a poner las manos. El resto va por sendero, pista y hayedo.'
			},
			{
				pregunta: '¿Qué queda del castell de Milany?',
				resposta:
					'Restos de la torre del homenaje, de una sala rectangular y de una cisterna, según la Viquipèdia. El Ayuntamiento de Vallfogona habla de restos escasos de un conjunto que había tenido iglesia y cementerio.'
			},
			{
				pregunta: '¿El castell de Milany está en Osona o en el Ripollès?',
				resposta:
					'Hace de linde entre Vidrà, en [Osona](/comarques/osona), y Vallfogona de Ripollès. En la lista del reto figura como cima de Osona, aunque la ruta más descrita sale de Vallfogona.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VALLFOGONA, VALLFOGONA_RUTES, FEMTURISME],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
