import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: les Agudes (massís del Montseny)',
	url: 'https://ca.wikipedia.org/wiki/Les_Agudes_(Mass%C3%ADs_del_Montseny)',
	consultat: CONSULTAT
};

const VIQUIPEDIA_ACCIDENT = {
	nom: 'Viquipèdia: accident aeri del Montseny de 1970',
	url: 'https://ca.wikipedia.org/wiki/Accident_aeri_del_Montseny_de_1970',
	consultat: CONSULTAT
};

const ARBUCIES = {
	nom: "Ajuntament d'Arbúcies: homenatge a les 112 víctimes de l'accident d'avió del Montseny",
	url: 'https://www.arbucies.cat/ca/noticies/governacio/homenatge-a-les-112-victimes-de-laccident-davio-del-montseny-en-el-51e-aniversari-de-la-tragedia-.html',
	consultat: CONSULTAT
};

const DIBA_GR52 = {
	nom: "Diputació de Barcelona (Parc Natural del Montseny): GR 5.2, de Sant Marçal a les Agudes i el turó de l'Home",
	url: 'https://itineraris-senyalitzats.diba.cat/dibaparcs/routes/view/581?lang=ca_ES',
	consultat: CONSULTAT
};

const DIBA_SANT_MARCAL = {
	nom: "Diputació de Barcelona (Parc Natural del Montseny): punt d'informació i aparcament de Sant Marçal",
	url: 'https://parcs.diba.cat/en/web/montseny/detall/-/contingut/155678/sant-marcal-i',
	consultat: CONSULTAT
};

const EXPLORA = {
	nom: 'Explora Catalunya: les Agudes des de Sant Marçal',
	url: 'https://www.explora.cat/lesagudes.html',
	consultat: CONSULTAT
};

const DEXCURSIO_PASSAVETS = {
	nom: "D'excursió per Catalunya: excursió al Turó de l'Home i les Agudes des de Passavets",
	url: 'https://dexcursio.net/turo-del-home-i-les-agudes/',
	consultat: CONSULTAT
};

const DEXCURSIO_CASTELLETS = {
	nom: "D'excursió per Catalunya: pujada a les Agudes pels Castellets",
	url: 'https://dexcursio.net/les-agudes-pels-castellets/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'les-agudes',
	descripcio: {
		ca: [
			"Les Agudes tenen una cota gairebé idèntica a la del turó de l'Home, el sostre del Montseny, i tots dos cims s'enllacen per la mateixa carena. El cim és a la carena principal del massís, on es troben els termes d'Arbúcies, [a la Selva](/comarques/selva), i de Fogars de Montclús i Montseny, al Vallès Oriental, i és dins el Parc Natural del Montseny, que també és reserva de la biosfera. A diferència del turó de l'Home, coronat per l'observatori meteorològic, les Agudes conserven un aspecte salvatge: un cim de roca i pedra solta, de fil·lites i corneanes, sense cap tros pla.",
			"El cim té una història trista. El 3 de juliol de 1970 un Comet 4 de la companyia Dan-Air, que volava de Manchester a Barcelona, es va estavellar enmig de la boira contra la fageda del vessant nord-est de les Agudes. Hi van morir les 113 persones que hi viatjaven, i és l'accident aeri més greu de la història de Catalunya. Arbúcies i Viladrau en recorden les víctimes amb homenatges als aniversaris de la tragèdia. Pel que fa a l'excursionisme, el cim és un dels clàssics del Montseny: el GR 5.2, que recorre els cims del massís, hi passa de camí entre Sant Marçal i el turó de l'Home.",
			"Des del vèrtex geodèsic, la vista és molt àmplia: el Pirineu i les Guilleries al nord, la plana de Vic a ponent, Montserrat i Collserola al sud, i als peus el pantà de Santa Fe i el castell de Montsoliu. A l'altra banda de la vall de Sant Marçal s'aixeca el [Matagalls](/cims/matagalls), l'altre gran cim del massís.",
			"A l'hivern sovint hi ha neu i glaç, i el vent escombra la carena sense res que l'aturi. La boira és freqüent i, en un cim de pedra sense camí clar, desorienta molt: amb mal temps és millor ajornar la sortida. A la primavera i a la tardor, la fageda del vessant nord és el gran atractiu de la pujada."
		],
		es: [
			"Les Agudes tienen una cota casi idéntica a la del turó de l'Home, el techo del Montseny, y ambas cimas se enlazan por la misma cresta. La cima está en la cresta principal del macizo, donde se encuentran los municipios de Arbúcies, [en la Selva](/comarques/selva), y de Fogars de Montclús y Montseny, en el Vallès Oriental, y está dentro del Parc Natural del Montseny, que también es reserva de la biosfera. A diferencia del turó de l'Home, coronado por el observatorio meteorológico, les Agudes conservan un aspecto salvaje: una cima de roca y piedra suelta, de filitas y corneanas, sin ningún trozo llano.",
			"La cima tiene una historia triste. El 3 de julio de 1970 un Comet 4 de la compañía Dan-Air, que volaba de Manchester a Barcelona, se estrelló en medio de la niebla contra el hayedo de la ladera noreste de les Agudes. Murieron las 113 personas que viajaban a bordo, y es el accidente aéreo más grave de la historia de Cataluña. Arbúcies y Viladrau recuerdan a las víctimas con homenajes en los aniversarios de la tragedia. En cuanto al excursionismo, la cima es un clásico del Montseny: el GR 5.2, que recorre las cimas del macizo, pasa por ella entre Sant Marçal y el turó de l'Home.",
			'Desde el vértice geodésico, la vista es muy amplia: el Pirineo y las Guilleries al norte, la llanura de Vic al oeste, Montserrat y Collserola al sur, y a los pies el pantano de Santa Fe y el castillo de Montsoliu. Al otro lado del valle de Sant Marçal se alza el [Matagalls](/cims/matagalls), la otra gran cima del macizo.',
			'En invierno a menudo hay nieve y hielo, y el viento barre la cresta sin nada que lo frene. La niebla es frecuente y, en una cima de piedra sin camino claro, desorienta mucho: con mal tiempo es mejor aplazar la salida. En primavera y otoño, el hayedo de la ladera norte es el gran atractivo de la subida.'
		]
	},
	rutes: [
		{
			id: 'sant-marcal-gr52',
			nom: { ca: 'Des de Sant Marçal pel GR 5.2', es: 'Desde Sant Marçal por el GR 5.2' },
			sortida: { nom: 'Aparcament de Sant Marçal (Arbúcies)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "És la pujada clàssica des del vessant de la Selva. De l'aparcament gratuït del parc a Sant Marçal, el GR 5.2 s'enfila per la fageda i puja pel fort pendent de la tartera de la Goitadora fins a la carena, que porta al cim entre roques i pedra solta. Explora Catalunya hi descriu una pedrera que no té dificultat per a qui està acostumat a la muntanya, i dona per a la sortida 7,8 km, 640 m de desnivell i 3 h 30 min, amb dificultat exigent.",
				es: 'Es la subida clásica desde la vertiente de la Selva. Desde el aparcamiento gratuito del parque en Sant Marçal, el GR 5.2 sube por el hayedo y por la fuerte pendiente de la tartera de la Goitadora hasta la cresta, que lleva a la cima entre rocas y piedra suelta. Explora Catalunya describe una pedrera que no tiene dificultad para quien está acostumbrado a la montaña, y da para la salida 7,8 km, 640 m de desnivel y 3 h 30 min, con dificultad exigente.'
			},
			fonts: [DIBA_GR52, DIBA_SANT_MARCAL, EXPLORA]
		},
		{
			id: 'passavets-turo-de-l-home',
			nom: {
				ca: "Circular des de Passavets pel turó de l'Home",
				es: "Circular desde Passavets por el turó de l'Home"
			},
			sortida: { nom: 'Aparcament de Passavets (Fogars de Montclús)' },
			descripcio: {
				ca: "Des del vessant del Vallès, D'excursió per Catalunya proposa pujar per la fageda fins al coll Pregon i el turó de l'Home i seguir el camí de carena ben marcat fins a les Agudes, a uns 30 minuts. La circular, que baixa per la font del Briançó, fa 9,6 km, 667 m de desnivell i unes 4 h 15 min, sense passos de grimpada.",
				es: "Desde la vertiente del Vallès, D'excursió per Catalunya propone subir por el hayedo hasta el coll Pregon y el turó de l'Home y seguir el camino de cresta bien marcado hasta les Agudes, a unos 30 minutos. La circular, que baja por la font del Briançó, tiene 9,6 km, 667 m de desnivel y unas 4 h 15 min, sin pasos de trepada."
			},
			fonts: [DEXCURSIO_PASSAVETS]
		},
		{
			id: 'castellets',
			nom: { ca: 'Per la carena dels Castellets', es: 'Por la cresta de los Castellets' },
			sortida: { nom: "Àrea de les Ferreres (Pla d'en Mon)" },
			tecnicitat: 'grimpada',
			descripcio: {
				ca: "Variant per a gent amb experiència. La carena dels Castellets té diverses grimpades de I i II on cal fer servir les mans, en trams aeris; D'excursió per Catalunya recomana el casc per la caiguda de pedres i desaconsella la carena a qui tingui vertigen. Un camí marcat en vermell la flanqueja per una canal.",
				es: "Variante para gente con experiencia. La cresta de los Castellets tiene varias trepadas de I y II en las que hay que usar las manos, en tramos aéreos; D'excursió per Catalunya recomienda el casco por la caída de piedras y desaconseja la cresta a quien tenga vértigo. Un camino marcado en rojo la flanquea por una canal."
			},
			fonts: [DEXCURSIO_CASTELLETS]
		}
	],
	consells: {
		ca: [
			"L'aparcament del parc a Sant Marçal és gratuït; els caps de setmana arriba-hi d'hora, o comença pel de Passavets, a l'altra banda del massís.",
			'El tram final és de pedra solta i pot relliscar, sobretot si ha plogut: porta calçat de muntanya amb bona sola.',
			'Amb boira, no surtis del camí marcat: la carena de roca i les tarteres desorienten.',
			"A l'hivern, amb neu o glaç a la carena, la pujada demana crampons i experiència.",
			'És dins el Parc Natural del Montseny: respecta els camins senyalitzats, no encenguis foc i porta el gos lligat.'
		],
		es: [
			'El aparcamiento del parque en Sant Marçal es gratuito; los fines de semana llega temprano, o empieza por el de Passavets, al otro lado del macizo.',
			'El tramo final es de piedra suelta y puede resbalar, sobre todo si ha llovido: lleva calzado de montaña con buena suela.',
			'Con niebla, no salgas del camino marcado: la cresta de roca y las tarteras desorientan.',
			'En invierno, con nieve o hielo en la cresta, la subida exige crampones y experiencia.',
			'Está dentro del Parc Natural del Montseny: respeta los caminos señalizados, no enciendas fuego y lleva el perro atado.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quina és la ruta més fàcil per pujar a les Agudes?',
				resposta:
					"La circular des de Passavets, que evita la tartera de la Goitadora: puja al turó de l'Home i segueix el camí de carena, ben marcat, fins a les Agudes, a uns 30 minuts. Segons D'excursió per Catalunya, fa 9,6 km i 667 m de desnivell, sense grimpades."
			},
			{
				pregunta: 'Quant es triga a pujar a les Agudes des de Sant Marçal?',
				resposta:
					'Explora Catalunya dona 3 h 30 min per a la sortida des de Sant Marçal, amb 7,8 km i 640 m de desnivell. És una pujada exigent: la tartera de la Goitadora té molt pendent i el tram final és de pedra.'
			},
			{
				pregunta: 'Què va passar a les Agudes el 1970?',
				resposta:
					"El 3 de juliol de 1970 un avió Comet de Dan-Air que anava de Manchester a Barcelona es va estavellar amb boira al vessant nord-est del cim. Hi van morir 113 persones: és l'accident aeri més greu de Catalunya."
			},
			{
				pregunta: 'Les Agudes compten com a cim essencial?',
				resposta:
					'Sí. La Selva té tres [cims essencials](/cims-essencials) i les Agudes en són el més alt; els altres dos són Sant Miquel de Solterra i el turó de Montsoriu. Si hi puges des de Passavets, recorda que el que compta és arribar a les Agudes: el turó de l’Home queda de pas.'
			}
		],
		es: [
			{
				pregunta: '¿Cuál es la ruta más fácil para subir a les Agudes?',
				resposta:
					"La circular desde Passavets, que evita la tartera de la Goitadora: sube al turó de l'Home y sigue el camino de cresta, bien marcado, hasta les Agudes, a unos 30 minutos. Según D'excursió per Catalunya, tiene 9,6 km y 667 m de desnivel, sin trepadas."
			},
			{
				pregunta: '¿Cuánto se tarda en subir a les Agudes desde Sant Marçal?',
				resposta:
					'Explora Catalunya da 3 h 30 min para la salida desde Sant Marçal, con 7,8 km y 640 m de desnivel. Es una subida exigente: la tartera de la Goitadora tiene mucha pendiente y el tramo final es de piedra.'
			},
			{
				pregunta: '¿Qué pasó en les Agudes en 1970?',
				resposta:
					'El 3 de julio de 1970 un avión Comet de Dan-Air que iba de Manchester a Barcelona se estrelló con niebla en la ladera noreste de la cima. Murieron 113 personas: es el accidente aéreo más grave de Cataluña.'
			},
			{
				pregunta: '¿Les Agudes cuenta como cima esencial?',
				resposta:
					'Sí. La Selva tiene tres [cimas esenciales](/cims-essencials) y les Agudes son la más alta; las otras dos son Sant Miquel de Solterra y el turó de Montsoriu. Si subes desde Passavets, recuerda que lo que cuenta es llegar a les Agudes: el turó de l’Home queda de paso.'
			}
		]
	},
	fonts: [
		VIQUIPEDIA,
		VIQUIPEDIA_ACCIDENT,
		ARBUCIES,
		DIBA_GR52,
		DIBA_SANT_MARCAL,
		EXPLORA,
		DEXCURSIO_PASSAVETS,
		DEXCURSIO_CASTELLETS
	],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
