import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Turó de la Magarola',
	url: 'https://ca.wikipedia.org/wiki/Tur%C3%B3_de_la_Magarola',
	consultat: CONSULTAT
};

const DIBA_RAPINYAIRES = {
	nom: 'Diputació de Barcelona, parcs: Collserola, observació de la migració de les aus rapinyaires',
	url: 'https://parcs.diba.cat/en/web/agenda/-/collserola-observacio-de-la-migracio-de-les-aus-rapinyaires',
	consultat: CONSULTAT
};

const XIRUCA = {
	nom: 'Xiruca: ruta circular al Turó de Magarola',
	url: 'https://www.xiruca.com/sites/default/files/track/Tur%C3%B3%20de%20Magarola.pdf',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'turo-de-la-magarola',
	descripcio: {
		ca: [
			'El turó de la Magarola és un cim del Parc Natural de Collserola, a la serra de Collserola, on conflueixen els termes de Barcelona, Cerdanyola del Vallès i Sant Cugat del Vallès. El catàleg el situa a Sant Cugat, i a la comarca del [Barcelonès](/comarques/barcelones). A Collserola hi ha també un altre cim essencial, [Sant Pere Màrtir](/cims/sant-pere-martir).',
			"Segons la Viquipèdia, al cim hi ha un vèrtex geodèsic, i per aquest turó passa el GR 92. Des del 1988 s'hi fa el seguiment de la migració de les aus rapinyaires: la Viquipèdia explica que hi ha una plataforma de fusta amb plafons informatius al cim, i que l'espècie més observada és l'aligot vesper. Diputació de Barcelona hi organitza cada any l'observació, amb l'accés a peu fins a dalt del turó i la recomanació de portar prismàtics; el 2024 va ser entre el 7 de setembre i el 6 d'octubre, de 10 a 13 h. Consulta la regulació vigent.",
			"Xiruca el descriu com un dels millors miradors de la serra de Collserola, amb bancs i vèrtex geodèsic al cim. Segons aquesta guia, des d'allà es veuen la ciutat de Barcelona, Sant Llorenç del Munt i part del Vallès, Montserrat i el Maresme.",
			"És una sortida accessible en transport públic, perquè la ruta de Xiruca surt de l'estació de metro de Canyelles. Té trams de sender amb molta ombra i trams del passeig de les Aigües."
		],
		es: [
			'El turó de la Magarola es una cima del Parque Natural de Collserola, en la sierra de Collserola, donde confluyen los términos de Barcelona, Cerdanyola del Vallès y Sant Cugat del Vallès. El catálogo lo sitúa en Sant Cugat, y en la comarca del [Barcelonès](/comarques/barcelones). En Collserola hay también otra cima esencial, [Sant Pere Màrtir](/cims/sant-pere-martir).',
			'Según la Viquipèdia, en la cima hay un vértice geodésico, y por este cerro pasa el GR 92. Desde 1988 se hace allí el seguimiento de la migración de las aves rapaces: la Viquipèdia explica que hay una plataforma de madera con paneles informativos en la cima, y que la especie más observada es el halcón abejero. La Diputació de Barcelona organiza cada año la observación, con el acceso a pie hasta lo alto del cerro y la recomendación de llevar prismáticos; en 2024 fue entre el 7 de septiembre y el 6 de octubre, de 10 a 13 h. Consulta la regulación vigente.',
			'Xiruca lo describe como uno de los mejores miradores de la sierra de Collserola, con bancos y vértice geodésico en la cima. Según esta guía, desde allí se ven la ciudad de Barcelona, Sant Llorenç del Munt y parte del Vallès, Montserrat y el Maresme.',
			'Es una salida accesible en transporte público, porque la ruta de Xiruca sale de la estación de metro de Canyelles. Tiene tramos de sendero con mucha sombra y tramos del passeig de les Aigües.'
		]
	},
	rutes: [
		{
			id: 'canyelles',
			nom: {
				ca: 'Circular des del metro de Canyelles',
				es: 'Circular desde el metro de Canyelles'
			},
			sortida: { nom: 'Estació de metro de Canyelles (L3, Barcelona)' },
			tempsMinuts: 105,
			tecnicitat: 'cap',
			descripcio: {
				ca: "Xiruca la presenta com una sencilla ruta circular de 10 km i +450 m en 3 h sense parades, de dificultat baixa. Surt de l'estació de Canyelles, passa per la font de Santa Eulàlia, el coll de la Ventosa i el turó de Valldaura, i arriba al turó de la Magarola a l'1 h 45 min de marxa; la tornada passa pel pas del Rei i el parc del Laberint fins al velòdrom d'Horta. Les xifres de distància i desnivell són de la circular sencera; el temps fins al cim és el de la ruta.",
				es: 'Xiruca la presenta como una sencilla ruta circular de 10 km y +450 m en 3 h sin paradas, de dificultad baja. Sale de la estación de Canyelles, pasa por la fuente de Santa Eulàlia, el coll de la Ventosa y el turó de Valldaura, y llega al turó de la Magarola a la 1 h 45 min de marcha; la vuelta pasa por el pas del Rei y el parque del Laberint hasta el velódromo de Horta. Las cifras de distancia y desnivel son de la circular entera; el tiempo hasta la cima es el de la ruta.'
			},
			fonts: [XIRUCA]
		}
	],
	consells: {
		ca: [
			"Si hi vas durant la campanya d'observació de rapinyaires, porta prismàtics: la Diputació de Barcelona ho recomana, i l'accés fins dalt del turó és a peu.",
			"Pots fer la ruta en transport públic: Xiruca indica l'accés per la línia 3 del metro, estació de Canyelles.",
			"Xiruca recomana el mapa de la serra de Collserola d'Editorial Alpina, a 1:25.000.",
			'Al turó de Valldaura, que Xiruca descriu amb una torre de vigilància i antenes, les vistes són tapades per la vegetació: no hi paris gaire, segons la guia.',
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'Si vas durante la campaña de observación de rapaces, lleva prismáticos: la Diputació de Barcelona lo recomienda, y el acceso hasta lo alto del cerro es a pie.',
			'Puedes hacer la ruta en transporte público: Xiruca indica el acceso por la línea 3 del metro, estación de Canyelles.',
			'Xiruca recomienda el mapa de la sierra de Collserola de Editorial Alpina, a 1:25.000.',
			'En el turó de Valldaura, que Xiruca describe con una torre de vigilancia y antenas, las vistas están tapadas por la vegetación: no pares mucho, según la guía.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Magarola?',
				resposta:
					"Xiruca compta 1 h 45 min fins al turó de la Magarola des del metro de Canyelles, dins d'una circular de 10 km i 3 h sense parades."
			},
			{
				pregunta: 'Es pot anar a la Magarola amb nens?',
				resposta:
					"Xiruca classifica la ruta de dificultat baixa i la presenta com a sencilla, però són 10 km i +450 m en total: valora-ho segons l'edat i la resistència dels nens."
			},
			{
				pregunta: "Què és l'observació de rapinyaires?",
				resposta:
					"Un seguiment de la migració de les aus rapinyaires que es fa des de la Magarola a la tardor. El 2024 va ser del 7 de setembre al 6 d'octubre, de 10 a 13 h; consulta la regulació vigent."
			},
			{
				pregunta: 'La Magarola és un cim essencial?',
				resposta:
					"Sí. Al [Barcelonès](/comarques/barcelones) és un dels cims essencials del repte, i a Collserola l'acompanya [Sant Pere Màrtir](/cims/sant-pere-martir)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Magarola?',
				resposta:
					'Xiruca cuenta 1 h 45 min hasta el turó de la Magarola desde el metro de Canyelles, dentro de una circular de 10 km y 3 h sin paradas.'
			},
			{
				pregunta: '¿Se puede ir a la Magarola con niños?',
				resposta:
					'Xiruca clasifica la ruta de dificultad baja y la presenta como sencilla, pero son 10 km y +450 m en total: valóralo según la edad y la resistencia de los niños.'
			},
			{
				pregunta: '¿Qué es la observación de rapaces?',
				resposta:
					'Un seguimiento de la migración de las aves rapaces que se hace desde la Magarola en otoño. En 2024 fue del 7 de septiembre al 6 de octubre, de 10 a 13 h; consulta la regulación vigente.'
			},
			{
				pregunta: '¿La Magarola es una cima esencial?',
				resposta:
					'Sí. En el [Barcelonès](/comarques/barcelones) es una de las cimas esenciales del reto, y en Collserola la acompaña [Sant Pere Màrtir](/cims/sant-pere-martir).'
			}
		]
	},
	fonts: [VIQUIPEDIA, DIBA_RAPINYAIRES, XIRUCA],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
