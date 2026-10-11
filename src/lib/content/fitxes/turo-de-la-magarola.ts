import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Turó de la Magarola',
	url: 'https://ca.wikipedia.org/wiki/Tur%C3%B3_de_la_Magarola',
	consultat: CONSULTAT
};

const DIBA_RAPINYAIRES = {
	nom: 'Diputació de Barcelona, Xarxa de Parcs Naturals: Collserola, observació de la migració de les aus rapinyaires (2024)',
	url: 'https://parcs.diba.cat/en/web/agenda/-/collserola-observacio-de-la-migracio-de-les-aus-rapinyaires',
	consultat: CONSULTAT
};

const XIRUCA = {
	nom: 'Xiruca: ruta circular al Turó de Magarola (fitxa de ruta en PDF)',
	url: 'https://www.xiruca.com/sites/default/files/track/Tur%C3%B3%20de%20Magarola.pdf',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'turo-de-la-magarola',
	descripcio: {
		ca: [
			'El turó de la Magarola és un cim de la serra de Collserola situat just on es troben els termes de Barcelona, Cerdanyola del Vallès i Sant Cugat del Vallès. És un dels dos cims essencials del [Barcelonès](/comarques/barcelones), amb el [Puig Castellar](/cims/puig-castellar); també a Collserola hi ha [Sant Pere Màrtir](/cims/sant-pere-martir). Segons la Viquipèdia, hi passa el GR 92 i, a pocs metres, el GR 6.',
			"El que el distingeix dels altres turons de la serra són els ocells. Des del 1988, cada setembre i octubre s'hi fa el seguiment de la migració de les aus rapinyaires cap a l'Àfrica, i al cim hi ha una plataforma de fusta amb plafons per als observadors. L'espècie que més s'hi veu és l'aligot vesper, seguida del xoriguer i l'arpella. La Diputació de Barcelona hi organitza una campanya oberta i gratuïta, amb ornitòlegs: la del 2024, la trenta-sisena, va anar del 7 de setembre al 6 d'octubre, de 10 a 13 h. Consulta la regulació vigent i les dates de cada any.",
			'Xiruca en diu un dels millors miradors de Collserola. Des dels bancs del cim descriu la ciutat de Barcelona, Sant Llorenç del Munt i part del Vallès, Montserrat i el Maresme. El nom ve de lluny: la Viquipèdia explica que Magarola ja surt escrit el 985, referit a un altre indret proper a Sant Cugat, i que més tard el va adoptar una família barcelonina, la del palau Magarola del carrer de la Portaferrissa.',
			"És un cim de ciutat, a l'abast del metro i per a tot l'any. A la tardor coincideix amb la campanya d'observació d'ocells; a l'estiu, la ruta té trams de sender amb molta ombra i d'altres, com el turó de Valldaura, on gairebé no n'hi ha."
		],
		es: [
			'El turó de la Magarola es una cima de la sierra de Collserola situada justo donde se encuentran los términos de Barcelona, Cerdanyola del Vallès y Sant Cugat del Vallès. Es una de las dos cimas esenciales del [Barcelonès](/comarques/barcelones), con el [Puig Castellar](/cims/puig-castellar); también en Collserola está [Sant Pere Màrtir](/cims/sant-pere-martir). Según la Viquipèdia, por ella pasa el GR 92 y, a pocos metros, el GR 6.',
			'Lo que la distingue de los demás cerros de la sierra son las aves. Desde 1988, cada septiembre y octubre se hace allí el seguimiento de la migración de las rapaces hacia África, y en la cima hay una plataforma de madera con paneles para los observadores. La especie que más se ve es el abejero europeo, seguido del cernícalo y el aguilucho lagunero. La Diputació de Barcelona organiza una campaña abierta y gratuita, con ornitólogos: la de 2024, la trigésima sexta, fue del 7 de septiembre al 6 de octubre, de 10 a 13 h. Consulta la regulación vigente y las fechas de cada año.',
			'Xiruca la considera uno de los mejores miradores de Collserola. Desde los bancos de la cima describe la ciudad de Barcelona, Sant Llorenç del Munt y parte del Vallès, Montserrat y el Maresme. El nombre viene de lejos: la Viquipèdia explica que Magarola ya aparece escrito en 985, referido a otro lugar cercano a Sant Cugat, y que más tarde lo adoptó una familia barcelonesa, la del palacio Magarola de la calle Portaferrissa.',
			'Es una cima de ciudad, al alcance del metro y para todo el año. En otoño coincide con la campaña de observación de aves; en verano, la ruta tiene tramos de sendero con mucha sombra y otros, como el turó de Valldaura, donde casi no la hay.'
		]
	},
	rutes: [
		{
			id: 'canyelles',
			nom: {
				ca: 'Des del metro de Canyelles pel coll de la Ventosa i el turó de Valldaura',
				es: 'Desde el metro de Canyelles por el coll de la Ventosa y el turó de Valldaura'
			},
			sortida: { nom: 'Estació de metro de Canyelles (L3, Barcelona)' },
			tempsMinuts: 105,
			tecnicitat: 'cap',
			descripcio: {
				ca: "La fitxa de Xiruca la presenta com una ruta circular senzilla, de dificultat baixa: uns 10 km, +450 m i 3 h sense parades, amb el cim a l'1 h 45 min. De Canyelles va a la plaça de Karl Marx, on agafa el GR; puja per la font de Santa Eulàlia (20 min) al coll de la Ventosa (35 min) i, per pista i sender, al portell de Valldaura (1 h 10 min) i al turó de Valldaura (1 h 25 min). Baixa al pas del Rei i segueix les marques del GR en la pujada final. La tornada desfà el camí fins al pas del Rei i baixa pel parc del Laberint i el velòdrom d'Horta.",
				es: 'La ficha de Xiruca la presenta como una ruta circular sencilla, de dificultad baja: unos 10 km, +450 m y 3 h sin paradas, con la cima a la 1 h 45 min. Desde Canyelles va a la plaza de Karl Marx, donde toma el GR; sube por la fuente de Santa Eulàlia (20 min) al coll de la Ventosa (35 min) y, por pista y sendero, al portell de Valldaura (1 h 10 min) y al turó de Valldaura (1 h 25 min). Baja al pas del Rei y sigue las marcas del GR en la subida final. La vuelta deshace el camino hasta el pas del Rei y baja por el parque del Laberint y el velódromo de Horta.'
			},
			fonts: [XIRUCA]
		}
	],
	consells: {
		ca: [
			"Si hi vas per veure rapinyaires, porta prismàtics i comprova abans les dates: la Diputació de Barcelona recorda que fins a dalt del turó només s'hi arriba a peu.",
			"Durant la campanya d'observació, la Diputació indica l'aproximació en cotxe per la carretera de la Rabassada; la resta de l'any, el metro de Canyelles estalvia buscar aparcament.",
			'Abans del coll de la Ventosa la ruta segueix alguns trams curts de carretera: camina per la vora. Al coll i al portell de Valldaura es creua per ponts.',
			"El desviament del GR cap al cim, passat el pas del Rei, surt a l'esquerra i està ben senyalitzat, segons Xiruca.",
			"Xiruca recomana el mapa de la serra de Collserola d'Editorial Alpina, a 1:25.000: a Collserola hi ha moltes pistes i senders que s'assemblen."
		],
		es: [
			'Si vas a ver rapaces, lleva prismáticos y comprueba antes las fechas: la Diputació de Barcelona recuerda que hasta lo alto del cerro solo se llega a pie.',
			'Durante la campaña de observación, la Diputació indica la aproximación en coche por la carretera de la Rabassada; el resto del año, el metro de Canyelles ahorra buscar aparcamiento.',
			'Antes del coll de la Ventosa la ruta sigue algunos tramos cortos de carretera: camina por el borde. En el collado y en el portell de Valldaura se cruza por puentes.',
			'El desvío del GR hacia la cima, pasado el pas del Rei, sale a la izquierda y está bien señalizado, según Xiruca.',
			'Xiruca recomienda el mapa de la sierra de Collserola de Editorial Alpina, a 1:25.000: en Collserola hay muchas pistas y senderos que se parecen.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al turó de la Magarola?',
				resposta:
					'Des del metro de Canyelles, la fitxa de Xiruca hi arriba en 1 h 45 min, passant pel turó de Valldaura. Tota la circular són uns 10 km, +450 m i 3 h sense parades.'
			},
			{
				pregunta: 'Es pot anar al turó de la Magarola en transport públic?',
				resposta:
					"Sí: la ruta que descrivim comença i acaba a l'estació de Canyelles, de la línia 3 del metro de Barcelona."
			},
			{
				pregunta: 'Quan es veuen les rapinyaires a la Magarola?',
				resposta:
					"Al setembre i a l'octubre, quan migren cap al sud. La campanya de la Diputació de Barcelona del 2024 va anar del 7 de setembre al 6 d'octubre, al matí; consulta les dates vigents. L'espècie més vista és l'aligot vesper."
			},
			{
				pregunta: 'És una ruta per fer amb nens?',
				resposta:
					'El terreny és fàcil, de pista i sender, i Xiruca la valora de dificultat baixa, però la volta sencera fa uns 10 km i +450 m: amb canalla petita es fa llarga.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al turó de la Magarola?',
				resposta:
					'Desde el metro de Canyelles, la ficha de Xiruca llega en 1 h 45 min, pasando por el turó de Valldaura. Toda la circular son unos 10 km, +450 m y 3 h sin paradas.'
			},
			{
				pregunta: '¿Se puede ir al turó de la Magarola en transporte público?',
				resposta:
					'Sí: la ruta que describimos empieza y acaba en la estación de Canyelles, de la línea 3 del metro de Barcelona.'
			},
			{
				pregunta: '¿Cuándo se ven las rapaces en la Magarola?',
				resposta:
					'En septiembre y octubre, cuando migran hacia el sur. La campaña de la Diputació de Barcelona de 2024 fue del 7 de septiembre al 6 de octubre, por la mañana; consulta las fechas vigentes. La especie más vista es el abejero europeo.'
			},
			{
				pregunta: '¿Es una ruta para hacer con niños?',
				resposta:
					'El terreno es fácil, de pista y sendero, y Xiruca la valora de dificultad baja, pero la vuelta entera tiene unos 10 km y +450 m: con niños pequeños se hace larga.'
			}
		]
	},
	fonts: [VIQUIPEDIA, DIBA_RAPINYAIRES, XIRUCA],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
