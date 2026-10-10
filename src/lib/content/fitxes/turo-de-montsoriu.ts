import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Castell de Montsoriu',
	url: 'https://ca.wikipedia.org/wiki/Castell_de_Montsoriu',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: "Totnens: castell de Montsoriu d'Arbúcies (excursió i visita)",
	url: 'https://totnens.cat/que-fem/castell-de-montsoriu/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'turo-de-montsoriu',
	descripcio: {
		ca: [
			'El turó de Montsoriu és la muntanya que corona el castell del mateix nom, a la [Selva](/comarques/selva). El catàleg el situa a Sant Feliu de Buixalleu, i la Viquipèdia precisa que el turó queda entre Arbúcies, Sant Feliu de Buixalleu i Breda, dins del Parc Natural del Montseny. A la mateixa comarca hi ha el cim més alt de les Guilleries, [Sant Miquel de Solterra](/cims/sant-miquel-de-solterra).',
			"El que fa singular aquest cim és el castell. La Viquipèdia el presenta com una de les fortaleses gòtiques més imponents del Principat de Catalunya: el nom de Montsoriu apareix ja el 1002 i el castell és mencionat explícitament el 1053. Al segle XIV, els vescomtes de Cabrera el van convertir en un palau residencial, i les seves defenses van resistir un setge reial de Pere III entre el 1365 i el 1371. Va decaure a partir del segle XV i els excursionistes el van redescobrir a començaments del XX. Té tres recintes emmurallats, amb una torre de l'homenatge del segle X, una capella preromànica, una de romànica i una gran cisterna central.",
			"Des del 1998 el castell és del Consell Comarcal de la Selva, que l'està restaurant des del 1995; es pot visitar des del 2011. Des del 2015 es pot fer la visita guiada o passejar-hi pel compte amb una guia adquirida amb l'entrada. Totnens avisa que cal reservar la visita per Internet a la web del castell, i que els infants menors de 13 anys, acompanyats d'adults, entren gratis.",
			'Per això convé comprovar els horaris i les condicions de visita abans de sortir, i no donar-los per fixos: consulta la regulació vigent a la web del castell. La visita es pot combinar amb una excursió curta per pista forestal des del coll de Castellar.'
		],
		es: [
			'El turó de Montsoriu es la montaña que corona el castillo del mismo nombre, en la [Selva](/comarques/selva). El catálogo lo sitúa en Sant Feliu de Buixalleu, y la Viquipèdia precisa que el cerro queda entre Arbúcies, Sant Feliu de Buixalleu y Breda, dentro del Parque Natural del Montseny. En la misma comarca está la cima más alta de las Guilleries, [Sant Miquel de Solterra](/cims/sant-miquel-de-solterra).',
			'Lo que hace singular esta cima es el castillo. La Viquipèdia lo presenta como una de las fortalezas góticas más imponentes del Principado de Catalunya: el nombre de Montsoriu aparece ya en 1002 y el castillo se menciona explícitamente en 1053. En el siglo XIV, los vizcondes de Cabrera lo convirtieron en un palacio residencial, y sus defensas resistieron un asedio real de Pere III entre 1365 y 1371. Decayó a partir del siglo XV y los excursionistas lo redescubrieron a comienzos del XX. Tiene tres recintos amurallados, con una torre del homenaje del siglo X, una capilla prerrománica, una románica y una gran cisterna central.',
			'Desde 1998 el castillo es del Consell Comarcal de la Selva, que lo restaura desde 1995; se puede visitar desde 2011. Desde 2015 se puede hacer la visita guiada o pasear por cuenta propia con una guía adquirida con la entrada. Totnens avisa de que hay que reservar la visita por Internet en la web del castillo, y de que los niños menores de 13 años, acompañados de adultos, entran gratis.',
			'Por eso conviene comprobar los horarios y las condiciones de visita antes de salir, y no darlos por fijos: consulta la regulación vigente en la web del castillo. La visita se puede combinar con una excursión corta por pista forestal desde el coll de Castellar.'
		]
	},
	rutes: [
		{
			id: 'coll-de-castellar',
			nom: {
				ca: 'Des del coll de Castellar per la pista forestal',
				es: 'Desde el coll de Castellar por la pista forestal'
			},
			sortida: { nom: 'Coll de Castellar (aparcament senyalitzat)' },
			tecnicitat: 'cap',
			descripcio: {
				ca: "Totnens la descriu com a fàcil: una pujada a peu per una pista forestal ampla i fàcil de seguir, pel mig d'un bosc on predominen les alzines sureres. El web dona 5,6 km anada i tornada i unes 3 hores comptant pujada, baixada i visita al castell. Un cop a dalt, es pot fer la visita guiada, amb cita prèvia, o seguir l'itinerari marcat. Si tens problemes de mobilitat, Totnens indica que es pot sol·licitar de pujar amb cotxe fins al peu del castell.",
				es: 'Totnens la describe como fácil: una subida a pie por una pista forestal ancha y fácil de seguir, por el medio de un bosque donde predominan los alcornoques. La web da 5,6 km ida y vuelta y unas 3 horas contando subida, bajada y visita al castillo. Una vez arriba, se puede hacer la visita guiada, con cita previa, o seguir el itinerario marcado. Si tienes problemas de movilidad, Totnens indica que se puede solicitar subir en coche hasta el pie del castillo.'
			},
			fonts: [TOTNENS]
		}
	],
	consells: {
		ca: [
			"Reserva la visita al castell per Internet, a la web del castell, abans de sortir; consulta la regulació vigent d'horaris i entrades.",
			'Si no vols pujar a peu, Totnens indica que, amb problemes de mobilitat, es pot sol·licitar pujar en cotxe fins al peu del castell.',
			'Calcula unes 3 hores si inclous la visita, segons Totnens, i no baixis en horari ajustat.',
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'Reserva la visita al castillo por Internet, en la web del castillo, antes de salir; consulta la regulación vigente de horarios y entradas.',
			'Si no quieres subir a pie, Totnens indica que, con problemas de movilidad, se puede solicitar subir en coche hasta el pie del castillo.',
			'Calcula unas 3 horas si incluyes la visita, según Totnens, y no bajes con el horario justo.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al castell de Montsoriu?',
				resposta:
					'Totnens compta unes 3 hores en total, comptant pujada, baixada i visita al castell, per a 5,6 km anada i tornada des del coll de Castellar.'
			},
			{
				pregunta: 'Es pot visitar el castell de Montsoriu?',
				resposta:
					"Sí. Segons la Viquipèdia, es pot visitar des del 2011, i des del 2015 amb visita guiada o amb una guia adquirida amb l'entrada. Totnens indica que cal reservar per Internet; consulta la regulació vigent."
			},
			{
				pregunta: 'Es pot anar-hi amb nens?',
				resposta:
					'Totnens el classifica com a excursió fàcil per una pista forestal ampla, i els menors de 13 anys acompanyats entren gratis. Consulta les condicions vigents a la web del castell.'
			},
			{
				pregunta: 'El turó de Montsoriu és un cim essencial?',
				resposta:
					"Sí. A la [Selva](/comarques/selva) l'acompanya [Sant Miquel de Solterra](/cims/sant-miquel-de-solterra), de les Guilleries."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al castillo de Montsoriu?',
				resposta:
					'Totnens cuenta unas 3 horas en total, contando subida, bajada y visita al castillo, para 5,6 km ida y vuelta desde el coll de Castellar.'
			},
			{
				pregunta: '¿Se puede visitar el castillo de Montsoriu?',
				resposta:
					'Sí. Según la Viquipèdia, se puede visitar desde 2011, y desde 2015 con visita guiada o con una guía adquirida con la entrada. Totnens indica que hay que reservar por Internet; consulta la regulación vigente.'
			},
			{
				pregunta: '¿Se puede ir con niños?',
				resposta:
					'Totnens lo clasifica como excursión fácil por una pista forestal ancha, y los menores de 13 años acompañados entran gratis. Consulta las condiciones vigentes en la web del castillo.'
			},
			{
				pregunta: '¿El turó de Montsoriu es una cima esencial?',
				resposta:
					'Sí. En la [Selva](/comarques/selva) lo acompaña [Sant Miquel de Solterra](/cims/sant-miquel-de-solterra), de las Guilleries.'
			}
		]
	},
	fonts: [VIQUIPEDIA, TOTNENS],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
