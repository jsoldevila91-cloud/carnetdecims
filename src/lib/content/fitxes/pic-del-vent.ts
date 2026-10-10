import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Pic del Vent',
	url: 'https://ca.wikipedia.org/wiki/Pic_del_Vent',
	consultat: CONSULTAT
};

const SENDERS_CALDES = {
	nom: 'Ajuntament de Caldes de Montbui: Els senders de Caldes de Montbui (plànol)',
	url: 'https://www.caldesdemontbui.cat/media/repository//migrated/documents/0000000000_senders_caldes.pdf',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: Pic del Vent al coll del Farell, Caldes de Montbui',
	url: 'https://totnens.cat/que-fem/senderisme-amb-nens-pic-del-vent-al-coll-del-farell-caldes-de-montbui/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pic-del-vent',
	descripcio: {
		ca: [
			"El Pic del Vent, també conegut com el Farell, és una muntanya del municipi de Caldes de Montbui, al [Vallès Oriental](/comarques/valles-oriental). La Viquipèdia en destaca la pedra calcària i recorda que al cim hi havia un antic vèrtex geodèsic, del qual només queda la base, inutilitzable. L'Ajuntament de Caldes de Montbui l'anomena el punt més alt de la serra del Farell.",
			"És una sortida curta. El plànol Els senders de Caldes de Montbui recull el sender del Pic del Vent com un recorregut que es desvia del PR-C 9 des del mirador de la serra Llisa per pujar al cim, de 2 km, 120 m de desnivell i 35 minuts de durada, amb una nota que resumeix el que l'espera: una pujada curta però forta. Va marcat amb marques grogues i blanques.",
			"Totnens, que el proposa com a sortida amb nens, parteix de l'església de Sant Sebastià de Montmajor, on hi ha un aparcament i un restaurant, i segueix les marques blanques i grogues. Segons aquest web, el primer tram és força dret i amb pedres soltes, i després es fa més practicable. A dalt hi ha una taula d'orientació, un pal de bandera, bancs de fusta i una placa del grup excursionista.",
			"L'últim tram és el més rocós i, segons Totnens, una mica més complicat; el mateix web diu que els nens el poden pujar sense complicacions, a poc a poc."
		],
		es: [
			'El Pic del Vent, también conocido como el Farell, es una montaña del municipio de Caldes de Montbui, en el [Vallès Oriental](/comarques/valles-oriental). La Viquipèdia destaca la piedra caliza y recuerda que en la cima había un antiguo vértice geodésico, del que solo queda la base, inutilizable. El Ayuntamiento de Caldes de Montbui lo llama el punto más alto de la sierra del Farell.',
			'Es una salida corta. El plano Els senders de Caldes de Montbui recoge el sendero del Pic del Vent como un recorrido que se desvía del PR-C 9 desde el mirador de la serra Llisa para subir a la cima, de 2 km, 120 m de desnivel y 35 minutos de duración, con una nota que resume lo que espera: una subida corta pero fuerte. Va marcado con marcas amarillas y blancas.',
			'Totnens, que lo propone como salida con niños, parte de la iglesia de Sant Sebastià de Montmajor, donde hay un aparcamiento y un restaurante, y sigue las marcas blancas y amarillas. Según esta web, el primer tramo es bastante empinado y con piedras sueltas, y luego se hace más practicable. Arriba hay una mesa de orientación, un asta de bandera, bancos de madera y una placa del grupo excursionista.',
			'El último tramo es el más rocoso y, según Totnens, algo más complicado; la misma web dice que los niños lo pueden subir sin complicaciones, poco a poco.'
		]
	},
	rutes: [
		{
			id: 'montmajor',
			nom: {
				ca: "Des de l'església de Sant Sebastià de Montmajor",
				es: 'Desde la iglesia de Sant Sebastià de Montmajor'
			},
			sortida: { nom: 'Església de Sant Sebastià de Montmajor (Caldes de Montbui)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Totnens la descriu amb sortida a l'església de Sant Sebastià de Montmajor, a la vora de la qual es pot aparcar. Es segueixen les marques blanques i grogues per una pista forestal que passa per davant d'una alzina gran i d'una torre d'alta tensió, i un caminet curt arriba al cim. El primer tram és força dret i amb pedres soltes, i es fa més practicable a mesura que s'hi guanya alçada; l'últim, més rocós. El web no dona ni la distància ni el temps ni el desnivell.",
				es: 'Totnens la describe con salida en la iglesia de Sant Sebastià de Montmajor, junto a la cual se puede aparcar. Se siguen las marcas blancas y amarillas por una pista forestal que pasa por delante de una encina grande y de una torre de alta tensión, y un caminito corto llega a la cima. El primer tramo es bastante empinado y con piedras sueltas, y se hace más practicable a medida que se gana altura; el último, más rocoso. La web no da ni la distancia ni el tiempo ni el desnivel.'
			},
			fonts: [TOTNENS]
		},
		{
			id: 'serra-llisa',
			nom: {
				ca: 'Sender del Pic del Vent des del mirador de la serra Llisa',
				es: 'Sendero del Pic del Vent desde el mirador de la serra Llisa'
			},
			sortida: { nom: 'Mirador de la serra Llisa (Caldes de Montbui)' },
			descripcio: {
				ca: "L'Ajuntament de Caldes de Montbui recull al plànol dels seus senders el del Pic del Vent: surt del mirador de la serra Llisa i es desvia del PR-C 9 per pujar al cim. Dona 2 km, 120 m de desnivell i 35 minuts de durada, amb una pujada curta però forta, i va senyalitzat amb marques grogues i blanques.",
				es: 'El Ayuntamiento de Caldes de Montbui recoge en el plano de sus senderos el del Pic del Vent: sale del mirador de la serra Llisa y se desvía del PR-C 9 para subir a la cima. Da 2 km, 120 m de desnivel y 35 minutos de duración, con una subida corta pero fuerte, y va señalizado con marcas amarillas y blancas.'
			},
			fonts: [SENDERS_CALDES]
		}
	],
	consells: {
		ca: [
			"Calça botes o sabatilles amb bona sola: el primer tram té pedres soltes, segons Totnens, i l'últim és més rocós.",
			'Baixa pel mateix camí amb calma: les pedres soltes del primer tram són més traïdores a la baixada que a la pujada.',
			'Si hi vas amb nens, deixa que marquin el ritme: Totnens diu que el poden pujar a poc a poc, sense complicacions.',
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'Calza botas o zapatillas con buena suela: el primer tramo tiene piedras sueltas, según Totnens, y el último es más rocoso.',
			'Baja por el mismo camino con calma: las piedras sueltas del primer tramo son más traicioneras en la bajada que en la subida.',
			'Si vas con niños, deja que marquen el ritmo: Totnens dice que lo pueden subir poco a poco, sin complicaciones.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Pic del Vent?',
				resposta:
					"El sender del plànol de l'Ajuntament de Caldes de Montbui, des del mirador de la serra Llisa, dona 35 minuts per a 2 km i 120 m de desnivell."
			},
			{
				pregunta: 'Es pot pujar al Pic del Vent amb nens?',
				resposta:
					"Totnens el proposa com a excursió amb nens: diu que el poden fer sense complicacions, al seu ritme, tot i que l'últim tram és més rocós i una mica més complicat."
			},
			{
				pregunta: 'On es deixa el cotxe?',
				resposta:
					"Totnens indica l'aparcament de l'església de Sant Sebastià de Montmajor, on també hi ha un restaurant. L'Ajuntament proposa sortir del mirador de la serra Llisa."
			},
			{
				pregunta: 'El Pic del Vent és un cim essencial?',
				resposta:
					"Sí. Al [Vallès Oriental](/comarques/valles-oriental) l'acompanya [el Tagamanent](/cims/tagamanent), que és més alt."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Pic del Vent?',
				resposta:
					'El sendero del plano del Ayuntamiento de Caldes de Montbui, desde el mirador de la serra Llisa, da 35 minutos para 2 km y 120 m de desnivel.'
			},
			{
				pregunta: '¿Se puede subir al Pic del Vent con niños?',
				resposta:
					'Totnens lo propone como excursión con niños: dice que lo pueden hacer sin complicaciones, a su ritmo, aunque el último tramo es más rocoso y algo más complicado.'
			},
			{
				pregunta: '¿Dónde se deja el coche?',
				resposta:
					'Totnens indica el aparcamiento de la iglesia de Sant Sebastià de Montmajor, donde también hay un restaurante. El Ayuntamiento propone salir del mirador de la serra Llisa.'
			},
			{
				pregunta: '¿El Pic del Vent es una cima esencial?',
				resposta:
					'Sí. En el [Vallès Oriental](/comarques/valles-oriental) lo acompaña [el Tagamanent](/cims/tagamanent), que es más alto.'
			}
		]
	},
	fonts: [VIQUIPEDIA, SENDERS_CALDES, TOTNENS],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
