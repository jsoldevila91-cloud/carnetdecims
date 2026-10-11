import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Castell de Montsoriu',
	url: 'https://ca.wikipedia.org/wiki/Castell_de_Montsoriu',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: castell de Montsoriu (excursió i visita)',
	url: 'https://totnens.cat/que-fem/castell-de-montsoriu/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'turo-de-montsoriu',
	descripcio: {
		ca: [
			"El turó de Montsoriu és un turó boscós del Parc Natural del Montseny, amb un castell que n'ocupa el capdamunt. És al terme de Sant Feliu de Buixalleu, a la [Selva](/comarques/selva), tocant al d'Arbúcies i a prop de Breda. A la mateixa comarca, els altres dos cims essencials són molt més alts: [les Agudes](/cims/les-agudes) i [Sant Miquel de Solterra](/cims/sant-miquel-de-solterra).",
			"Aquí el cim és el castell, que la Viquipèdia considera una de les fortaleses gòtiques més imponents de Catalunya. El topònim surt escrit el 1002 i el castell, el 1053. Va ser la casa dels vescomtes de Cabrera, que al segle XIV el van convertir en palau. Entre el 1365 i el 1371, Pere el Cerimoniós el va fer assetjar amb 1.200 homes i no el va poder prendre. Té tres recintes de muralla, una torre de l'homenatge de la segona meitat del segle X, una capella preromànica i una gran cisterna central.",
			'El setge va fracassar, en part, per la mateixa raó que avui fa atractiva la pujada: des de dalt es domina tot. La Viquipèdia hi enumera Arbúcies, Breda, Sant Celoni i Hostalric, i fins i tot Blanes i Palafolls, a la costa, a més del corredor entre el Montseny i el Montnegre.',
			"Després de segles d'abandó, el castell s'ha restaurat sota un patronat que presideix el Consell Comarcal de la Selva, i des del març del 2015 es pot visitar amb guia o per lliure. Com que el castell ocupa el cim, convé mirar-ne els horaris abans de sortir: consulta la regulació vigent al web del castell."
		],
		es: [
			'El turó de Montsoriu es un cerro boscoso del Parque Natural del Montseny, con un castillo que ocupa su parte alta. Está en el término de Sant Feliu de Buixalleu, en la [Selva](/comarques/selva), tocando al de Arbúcies y cerca de Breda. En la misma comarca, las otras dos cimas esenciales son mucho más altas: [les Agudes](/cims/les-agudes) y [Sant Miquel de Solterra](/cims/sant-miquel-de-solterra).',
			'Aquí la cima es el castillo, que la Viquipèdia considera una de las fortalezas góticas más imponentes de Catalunya. El topónimo aparece escrito en 1002 y el castillo, en 1053. Fue la casa de los vizcondes de Cabrera, que en el siglo XIV lo convirtieron en palacio. Entre 1365 y 1371, Pedro el Ceremonioso lo hizo sitiar con 1.200 hombres y no pudo tomarlo. Tiene tres recintos de muralla, una torre del homenaje de la segunda mitad del siglo X, una capilla prerrománica y una gran cisterna central.',
			'El asedio fracasó, en parte, por la misma razón que hoy hace atractiva la subida: desde arriba se domina todo. La Viquipèdia enumera Arbúcies, Breda, Sant Celoni y Hostalric, e incluso Blanes y Palafolls, en la costa, además del corredor entre el Montseny y el Montnegre.',
			'Tras siglos de abandono, el castillo se ha restaurado bajo un patronato que preside el Consell Comarcal de la Selva, y desde marzo de 2015 se puede visitar con guía o por libre. Como el castillo ocupa la cima, conviene mirar los horarios antes de salir: consulta la regulación vigente en la web del castillo.'
		]
	},
	rutes: [
		{
			id: 'coll-de-castellar',
			nom: {
				ca: 'Des del coll de Castellar per la pista del castell',
				es: 'Desde el coll de Castellar por la pista del castillo'
			},
			sortida: { nom: 'Coll de Castellar (aparcament senyalitzat)' },
			tecnicitat: 'cap',
			descripcio: {
				ca: "Totnens la descriu com una pujada a peu per una pista forestal ampla i fàcil de seguir, entre alzines sureres, des de l'aparcament del coll de Castellar fins al peu del castell. Hi compta 5,6 km entre anada i tornada i unes 3 hores sumant-hi la visita. Diu que s'hi pot pujar amb cotxet, tot i que l'interior del castell no hi és accessible. A dalt, la visita lliure segueix un itinerari marcat en groc amb vint punts.",
				es: 'Totnens la describe como una subida a pie por una pista forestal ancha y fácil de seguir, entre alcornoques, desde el aparcamiento del coll de Castellar hasta el pie del castillo. Cuenta 5,6 km entre ida y vuelta y unas 3 horas sumando la visita. Dice que se puede subir con cochecito, aunque el interior del castillo no es accesible con él. Arriba, la visita libre sigue un itinerario marcado en amarillo con veinte puntos.'
			},
			fonts: [TOTNENS]
		}
	],
	consells: {
		ca: [
			"Reserva l'entrada abans d'anar-hi: Totnens indica que la visita es reserva per Internet al web del castell.",
			'Si hi vas amb canalla, la visita guiada dura entre 1 h i 1 h 30 min, segons el mateix web, i els menors de 13 anys acompanyats no paguen; consulta la regulació vigent.',
			"La mateixa entrada serveix per al Museu Etnològic del Montseny, la Gabella, a Arbúcies, on s'exposen les troballes del castell.",
			'Amb problemes de mobilitat es pot demanar de pujar en cotxe fins al peu del castell, segons Totnens.',
			"Durant la visita es pot pujar als murs i a la torre de l'homenatge, que és on hi ha la millor vista."
		],
		es: [
			'Reserva la entrada antes de ir: Totnens indica que la visita se reserva por Internet en la web del castillo.',
			'Si vas con niños, la visita guiada dura entre 1 h y 1 h 30 min, según la misma web, y los menores de 13 años acompañados no pagan; consulta la regulación vigente.',
			'La misma entrada sirve para el Museu Etnològic del Montseny, la Gabella, en Arbúcies, donde se exponen los hallazgos del castillo.',
			'Con problemas de movilidad se puede pedir subir en coche hasta el pie del castillo, según Totnens.',
			'Durante la visita se puede subir a los muros y a la torre del homenaje, que es donde está la mejor vista.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al castell de Montsoriu?',
				resposta:
					"Totnens compta 5,6 km entre anada i tornada des del coll de Castellar i unes 3 hores en total, incloent-hi la visita al castell. La pujada sola, per pista ampla, n'és la part curta."
			},
			{
				pregunta: 'Cal pagar entrada per fer el cim?',
				resposta:
					'El castell ocupa el capdamunt del turó i la visita és de pagament, amb reserva prèvia segons Totnens. Abans de sortir, comprova al web del castell els horaris i les condicions vigents.'
			},
			{
				pregunta: 'És una bona sortida amb nens?',
				resposta:
					"Sí: la pista és ampla i fàcil, s'hi pot pujar amb cotxet fins al castell i la visita guiada, segons Totnens, inclou llegendes de bruixes i cavallers. Dins del castell hi ha escales i murs, on cal vigilar-los."
			},
			{
				pregunta: 'Per què és important el castell de Montsoriu?',
				resposta:
					'Va ser la residència dels vescomtes de Cabrera i, segons la Viquipèdia, és una de les fortaleses gòtiques més imponents de Catalunya. Va resistir un setge reial de sis anys, del 1365 al 1371.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al castillo de Montsoriu?',
				resposta:
					'Totnens cuenta 5,6 km entre ida y vuelta desde el coll de Castellar y unas 3 horas en total, incluyendo la visita al castillo. La subida sola, por pista ancha, es la parte corta.'
			},
			{
				pregunta: '¿Hay que pagar entrada para hacer la cima?',
				resposta:
					'El castillo ocupa la parte alta del cerro y la visita es de pago, con reserva previa según Totnens. Antes de salir, comprueba en la web del castillo los horarios y las condiciones vigentes.'
			},
			{
				pregunta: '¿Es una buena salida con niños?',
				resposta:
					'Sí: la pista es ancha y fácil, se puede subir con cochecito hasta el castillo y la visita guiada, según Totnens, incluye leyendas de brujas y caballeros. Dentro del castillo hay escaleras y muros, donde hay que vigilarlos.'
			},
			{
				pregunta: '¿Por qué es importante el castillo de Montsoriu?',
				resposta:
					'Fue la residencia de los vizcondes de Cabrera y, según la Viquipèdia, es una de las fortalezas góticas más imponentes de Catalunya. Resistió un asedio real de seis años, de 1365 a 1371.'
			}
		]
	},
	fonts: [VIQUIPEDIA, TOTNENS],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
