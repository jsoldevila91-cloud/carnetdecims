import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: Sant Miquel de Solterra, el sostre de les Guilleries",
	url: 'https://dexcursio.net/sant-miquel-de-solterra/',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: Sant Miquel de Solterra o de les Formigues',
	url: 'https://totnens.cat/que-fem/sant-miquel-de-solterra-o-de-les-formigues/',
	consultat: CONSULTAT
};

const SANTHILARI = {
	nom: 'Ajuntament de Sant Hilari Sacalm: ruta guiada a Sant Miquel de les Formigues',
	url: 'https://www.santhilari.cat/agenda/ruta-guiada-a-sant-miquel-de-les-formigues/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'sant-miquel-de-solterra',
	descripcio: {
		ca: [
			"Sant Miquel de Solterra, o Sant Miquel de les Formigues, és la muntanya que Totnens situa entre Sant Hilari Sacalm i Osor, a la [Selva](/comarques/selva). L'Ajuntament de Sant Hilari Sacalm l'anomena el cim més alt de les Guilleries en presentar-ne l'excursió guiada. A la mateixa comarca hi ha un altre cim essencial, [el Turó de Montsoriu](/cims/turo-de-montsoriu), molt més baix.",
			"Dalt del cim hi ha les restes del castell de Solterra, amb una torre circular, una petita capella dedicada a Sant Miquel i una creu de ferro decorada amb tres formigues, d'on ve el nom popular. D'excursió per Catalunya explica que aquestes formigues donen nom al lloc; Totnens recull la llegenda: segons ella, les formigues entraven a l'església i una va picar la cama de la imatge de Sant Miquel; en sortir-ne sang, l'arcàngel es va enfadar i les va maleir. Per això, al peu de la creu hi ha formigues de ferro blanques i vermelles.",
			"D'excursió per Catalunya descriu l'excursió com a fàcil i adequada per a tots els públics, per una pista forestal amb castanyers que es converteix en sender cap al final; Totnens, que parla de la pista com a ampla i còmoda, avisa que l'últim quilòmetre, pel sender, no és accessible amb cotxet.",
			"Al peu del penyal final hi ha dues opcions, segons D'excursió per Catalunya: una grimpada curta, sense dificultat tècnica, fins a la creu, o un camí més planer que voreja el penyal. Qui no vulgui posar les mans a la roca pot optar per la segona."
		],
		es: [
			'Sant Miquel de Solterra, o Sant Miquel de les Formigues, es la montaña que Totnens sitúa entre Sant Hilari Sacalm y Osor, en la [Selva](/comarques/selva). El Ayuntamiento de Sant Hilari Sacalm la llama la cima más alta de las Guilleries al presentar la excursión guiada. En la misma comarca hay otra cima esencial, [el Turó de Montsoriu](/cims/turo-de-montsoriu), mucho más bajo.',
			"En lo alto hay los restos del castillo de Solterra, con una torre circular, una pequeña capilla dedicada a Sant Miquel y una cruz de hierro decorada con tres hormigas, de donde viene el nombre popular. D'excursió per Catalunya explica que esas hormigas dan nombre al lugar; Totnens recoge la leyenda: según ella, las hormigas entraban en la iglesia y una picó la pierna de la imagen de Sant Miquel; al salir sangre, el arcángel se enfadó y las maldijo. Por eso, al pie de la cruz hay hormigas de hierro blancas y rojas.",
			"D'excursió per Catalunya describe la excursión como fácil y apta para todos los públicos, por una pista forestal con castaños que se convierte en sendero hacia el final; Totnens, que habla de la pista como ancha y cómoda, avisa de que el último kilómetro, por el sendero, no es accesible con cochecito.",
			"Al pie del peñasco final hay dos opciones, según D'excursió per Catalunya: una trepada corta, sin dificultad técnica, hasta la cruz, o un camino más llano que rodea el peñasco. Quien no quiera poner las manos en la roca puede optar por la segunda."
		]
	},
	rutes: [
		{
			id: 'abeuradors',
			nom: {
				ca: 'Des de la font dels Abeuradors, a Sant Hilari Sacalm',
				es: 'Desde la font dels Abeuradors, en Sant Hilari Sacalm'
			},
			sortida: { nom: 'Font dels Abeuradors (Sant Hilari Sacalm)' },
			descripcio: {
				ca: "D'excursió per Catalunya la proposa com a ruta lineal, d'anada i tornada pel mateix camí: 8 km i +265 m en 2 h 30 min en total, de dificultat fàcil. Es puja per una pista forestal amb castanyers que acaba en sender; Totnens posa la distància en 4 km. Al final hi ha l'opció de la grimpada curta o del camí que voreja el penyal. L'Ajuntament de Sant Hilari Sacalm hi organitza una ruta guiada lineal de 8 km d'anada i tornada.",
				es: "D'excursió per Catalunya la propone como ruta lineal, de ida y vuelta por el mismo camino: 8 km y +265 m en 2 h 30 min en total, de dificultad fácil. Se sube por una pista forestal con castaños que acaba en sendero; Totnens pone la distancia en 4 km. Al final está la opción de la trepada corta o del camino que rodea el peñasco. El Ayuntamiento de Sant Hilari Sacalm organiza allí una ruta guiada lineal de 8 km de ida y vuelta."
			},
			fonts: [DEXCURSIO, TOTNENS, SANTHILARI]
		}
	],
	consells: {
		ca: [
			"Si no vols posar les mans a la roca, pren el camí que voreja el penyal: D'excursió per Catalunya el recull com a alternativa a la grimpada final.",
			"Amb cotxet o amb nens molt petits, compte amb l'últim quilòmetre: Totnens avisa que, pel sender, no és accessible amb cotxet.",
			"D'excursió per Catalunya recomana calçat de muntanya, aigua, protecció solar a l'estiu, jaqueta tallavents i mòbil carregat.",
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			"Si no quieres poner las manos en la roca, toma el camino que rodea el peñasco: D'excursió per Catalunya lo recoge como alternativa a la trepada final.",
			'Con cochecito o con niños muy pequeños, cuidado con el último kilómetro: Totnens avisa de que, por el sendero, no es accesible con cochecito.',
			"D'excursió per Catalunya recomienda calzado de montaña, agua, protección solar en verano, chaqueta cortavientos y móvil cargado.",
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Sant Miquel de Solterra?',
				resposta:
					"D'excursió per Catalunya compta 2 h 30 min en total, anada i tornada, per a 8 km i +265 m des de la font dels Abeuradors. Totnens situa la distància en 4 km, sense indicar la durada."
			},
			{
				pregunta: 'Es pot pujar a Sant Miquel de Solterra amb nens?',
				resposta:
					"Totnens el proposa com a excursió familiar i D'excursió per Catalunya el qualifica de fàcil, adequat per a tots els públics. L'últim quilòmetre, pel sender, no és accessible amb cotxet."
			},
			{
				pregunta: 'Cal grimpar al final?',
				resposta:
					"Segons D'excursió per Catalunya, hi ha dues opcions al peu del penyal: una grimpada curta i sense dificultat tècnica, o un camí més planer que el voreja."
			},
			{
				pregunta: 'Per què es diu Sant Miquel de les Formigues?',
				resposta:
					'Per la llegenda que recull Totnens i per la creu del cim, amb formigues de ferro. La [Selva](/comarques/selva) té un altre cim essencial, [el Turó de Montsoriu](/cims/turo-de-montsoriu).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Sant Miquel de Solterra?',
				resposta:
					"D'excursió per Catalunya cuenta 2 h 30 min en total, ida y vuelta, para 8 km y +265 m desde la font dels Abeuradors. Totnens sitúa la distancia en 4 km, sin indicar la duración."
			},
			{
				pregunta: '¿Se puede subir a Sant Miquel de Solterra con niños?',
				resposta:
					"Totnens lo propone como excursión familiar y D'excursió per Catalunya lo califica de fácil, apto para todos los públicos. El último kilómetro, por el sendero, no es accesible con cochecito."
			},
			{
				pregunta: '¿Hay que trepar al final?',
				resposta:
					"Según D'excursió per Catalunya, hay dos opciones al pie del peñasco: una trepada corta y sin dificultad técnica, o un camino más llano que lo rodea."
			},
			{
				pregunta: '¿Por qué se llama Sant Miquel de les Formigues?',
				resposta:
					'Por la leyenda que recoge Totnens y por la cruz de la cima, con hormigas de hierro. La [Selva](/comarques/selva) tiene otra cima esencial, [el Turó de Montsoriu](/cims/turo-de-montsoriu).'
			}
		]
	},
	fonts: [DEXCURSIO, TOTNENS, SANTHILARI],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
