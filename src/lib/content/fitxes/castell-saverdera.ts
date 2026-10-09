import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Castell de Verdera',
	url: 'https://ca.wikipedia.org/wiki/Castell_de_Sant_Salvador_de_Verdera',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: 'Rutes Pirineus: Sant Salvador des de Sant Pere de Rodes',
	url: 'https://www.rutespirineus.cat/rutes/castell-sant-salvador-de-verdera-des-de-sant-pere-de-rodes',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: castell Saverdera des del monestir de Sant Pere de Rodes',
	url: 'https://totnens.cat/que-fem/castell-saverdera/',
	consultat: CONSULTAT
};

const PORT_DE_LA_SELVA = {
	nom: 'Ajuntament del Port de la Selva: del Port de la Selva a Sant Pere de Rodes per la Selva de Mar (GR 11)',
	url: 'https://www.elportdelaselva.cat/en/tourism/what-to-do/hiking-trails/from-el-port-de-la-selva-to-sant-pere-de-rodes-through-la-selva-de-mar-gr11/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'castell-saverdera',
	descripcio: {
		ca: [
			"El castell de Sant Salvador de Verdera, o castell Saverdera, ocupa el punt més alt de la serra de Rodes, la carena que tanca per l'oest la península del cap de Creus, [a l'Alt Empordà](/comarques/alt-emporda). És dins el terme del Port de la Selva i del Parc Natural del Cap de Creus, i forma un conjunt inseparable amb el monestir de Sant Pere de Rodes, que s'aixeca uns metres més avall al mateix vessant.",
			"Les ruïnes que es veuen avui són el resultat de dues etapes. El castell romànic, dels comtes d'Empúries, va ser donat el 974 pel comte Gausfred I al monestir, i durant segles monjos i comtes se'n van disputar el control. El 1283 el comte Ponç Hug IV el va ocupar i en va refer les defenses davant la guerra amb França; amb la croada del 1285 les tropes franceses el van ocupar durant sis mesos. Més tard va passar als ducs de Medinaceli, i el 1708, durant la guerra de Successió, va quedar en bona part destruït. Encara s'hi reconeixen l'església de Sant Salvador, la base de la torre mestra, torres semicirculars i una cisterna coberta. És bé cultural d'interès nacional des del 1993.",
			"És un dels millors miradors de l'Empordà. Es domina el golf de Roses i tota la plana empordanesa, el cap de Creus i el Port de la Selva als peus, i cap al nord l'Albera i el Pirineu, amb el massís del Canigó al fons.",
			"Es pot fer tot l'any, però la tramuntana hi bufa sovint amb molta força i a l'estiu el sol és intens. Els caps de setmana i a l'estiu el monestir rep molts visitants, i és millor arribar-hi d'hora."
		],
		es: [
			'El castell de Sant Salvador de Verdera, o castell Saverdera, ocupa el punto más alto de la sierra de Rodes, la cresta que cierra por el oeste la península del cap de Creus, [en el Alt Empordà](/comarques/alt-emporda). Está en el municipio de El Port de la Selva y dentro del Parc Natural del Cap de Creus, y forma un conjunto inseparable con el monasterio de Sant Pere de Rodes, que se alza unos metros más abajo en la misma ladera.',
			'Las ruinas que se ven hoy son el resultado de dos etapas. El castillo románico, de los condes de Empúries, fue donado en 974 por el conde Gausfred I al monasterio, y durante siglos monjes y condes se disputaron su control. En 1283 el conde Ponç Hug IV lo ocupó y rehízo sus defensas ante la guerra con Francia; con la cruzada de 1285 las tropas francesas lo ocuparon durante seis meses. Más tarde pasó a los duques de Medinaceli, y en 1708, durante la guerra de Sucesión, quedó en buena parte destruido. Aún se reconocen la iglesia de Sant Salvador, la base de la torre del homenaje, torres semicirculares y una cisterna cubierta. Es bien cultural de interés nacional desde 1993.',
			"Es uno de los mejores miradores del Empordà. Se domina el golfo de Roses y toda la llanura ampurdanesa, el cap de Creus y El Port de la Selva a los pies, y hacia el norte l'Albera y el Pirineo, con el macizo del Canigó al fondo.",
			'Se puede hacer todo el año, pero la tramontana sopla a menudo con mucha fuerza y en verano el sol es intenso. Los fines de semana y en verano el monasterio recibe muchos visitantes, y es mejor llegar temprano.'
		]
	},
	rutes: [
		{
			id: 'sant-pere-de-rodes',
			nom: {
				ca: 'Des del monestir de Sant Pere de Rodes',
				es: 'Desde el monasterio de Sant Pere de Rodes'
			},
			sortida: { nom: 'Monestir de Sant Pere de Rodes (el Port de la Selva)' },
			desnivellPositiuM: 165,
			distanciaKm: 0.8,
			tempsMinuts: 20,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "De l'aparcament del monestir s'arriba a peu fins al conjunt monumental, i d'allà un corriol estret i senyalitzat s'enfila en ziga-zaga entre la brolla, amb uns primers graons de pedra, fins a les ruïnes del castell. Rutes Pirineus el valora com un passeig curt sense dificultats, però el corriol és estret i rocallós i, com avisa Totnens, hi ha trams de roca on els infants poden necessitar ajuda.",
				es: 'Desde el aparcamiento del monasterio se llega a pie hasta el conjunto monumental, y desde allí una senda estrecha y señalizada sube en zigzag entre el matorral, con unos primeros escalones de piedra, hasta las ruinas del castillo. Rutes Pirineus lo valora como un paseo corto sin dificultades, pero la senda es estrecha y rocosa y, como avisa Totnens, hay tramos de roca en los que los niños pueden necesitar ayuda.'
			},
			fonts: [RUTES_PIRINEUS, TOTNENS]
		},
		{
			id: 'port-de-la-selva-gr11',
			nom: {
				ca: 'Des del Port de la Selva per la Selva de Mar (GR 11)',
				es: 'Desde El Port de la Selva por la Selva de Mar (GR 11)'
			},
			sortida: { nom: 'Aparcament dels Horts (el Port de la Selva)' },
			descripcio: {
				ca: "Per qui vol fer-ho a peu des del mar. L'itinerari municipal passa per la Selva de Mar, puja pel camí dels Dijous entre feixes abandonades i murs de pedra seca i arriba al monestir, des d'on cal afegir el tram final fins al castell. Fins al monestir, l'Ajuntament el dona com a anada i tornada de 10,9 km, 590 m de desnivell i 4 h 15 min, i el considera exigent.",
				es: 'Para quien quiere hacerlo a pie desde el mar. El itinerario municipal pasa por La Selva de Mar, sube por el camí dels Dijous entre bancales abandonados y muros de piedra seca y llega al monasterio, desde donde hay que añadir el tramo final hasta el castillo. Hasta el monasterio, el Ayuntamiento lo da como ida y vuelta de 10,9 km, 590 m de desnivel y 4 h 15 min, y lo considera exigente.'
			},
			fonts: [PORT_DE_LA_SELVA]
		}
	],
	consells: {
		ca: [
			"Aprofita la sortida per visitar el monestir de Sant Pere de Rodes, que és just al costat del camí (l'entrada és de pagament).",
			'Amb tramuntana forta, vigila al corriol i a les ruïnes: el vent és molt violent a la carena.',
			'Porta calçat de muntanya: el corriol és curt però estret i pedregós, i amb nens petits cal donar-los la mà als trams de roca.',
			"Les ruïnes no tenen baranes: no deixis que els nens s'enfilin als murs.",
			'És dins el Parc Natural del Cap de Creus: no surtis dels camins senyalitzats i no encenguis foc.'
		],
		es: [
			'Aprovecha la salida para visitar el monasterio de Sant Pere de Rodes, que está justo al lado del camino (la entrada es de pago).',
			'Con tramontana fuerte, ten cuidado en la senda y en las ruinas: el viento es muy violento en la cresta.',
			'Lleva calzado de montaña: la senda es corta pero estrecha y pedregosa, y con niños pequeños hay que darles la mano en los tramos de roca.',
			'Las ruinas no tienen barandillas: no dejes que los niños se suban a los muros.',
			'Está dentro del Parc Natural del Cap de Creus: no salgas de los caminos señalizados y no enciendas fuego.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al castell de Sant Salvador de Verdera?',
				resposta:
					'Des del monestir de Sant Pere de Rodes, uns 20 minuts de pujada i 15 de baixada pel mateix camí, segons Rutes Pirineus. Són uns 1,6 km anada i tornada i uns 165 m de desnivell.'
			},
			{
				pregunta: 'Es pot pujar al castell Saverdera amb nens?',
				resposta:
					'Sí, és una pujada curta i molt agraïda. Només cal tenir present que el corriol és estret i en alguns punts rocallós, i que a dalt les ruïnes no tenen proteccions. Amb tramuntana forta, millor deixar-ho per a un altre dia.'
			},
			{
				pregunta: 'Es pot pujar a peu des del Port de la Selva?',
				resposta:
					"Sí, pel GR 11 i la Selva de Mar fins al monestir, i d'allà al castell. Només fins al monestir, l'Ajuntament del Port de la Selva compta 10,9 km anada i tornada, 590 m de desnivell i 4 h 15 min."
			},
			{
				pregunta: 'El castell Saverdera compta com a cim essencial?',
				resposta:
					"Sí, és un dels [cims essencials](/cims-essencials) del repte i un dels de l'Alt Empordà. Les condicions per validar-lo són a la [normativa](/repte-100-cims/normativa)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al castell de Sant Salvador de Verdera?',
				resposta:
					'Desde el monasterio de Sant Pere de Rodes, unos 20 minutos de subida y 15 de bajada por el mismo camino, según Rutes Pirineus. Son unos 1,6 km ida y vuelta y unos 165 m de desnivel.'
			},
			{
				pregunta: '¿Se puede subir al castell Saverdera con niños?',
				resposta:
					'Sí, es una subida corta y muy agradecida. Solo hay que tener presente que la senda es estrecha y en algunos puntos rocosa, y que arriba las ruinas no tienen protecciones. Con tramontana fuerte, mejor dejarlo para otro día.'
			},
			{
				pregunta: '¿Se puede subir a pie desde El Port de la Selva?',
				resposta:
					'Sí, por el GR 11 y La Selva de Mar hasta el monasterio, y desde allí al castillo. Solo hasta el monasterio, el Ayuntamiento de El Port de la Selva cuenta 10,9 km ida y vuelta, 590 m de desnivel y 4 h 15 min.'
			},
			{
				pregunta: '¿El castell Saverdera cuenta como cima esencial?',
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) del reto y una de las del Alt Empordà. Las condiciones para validarla están en la [normativa](/repte-100-cims/normativa).'
			}
		]
	},
	fonts: [VIQUIPEDIA, RUTES_PIRINEUS, TOTNENS, PORT_DE_LA_SELVA],
	estat: 'esborrany',
	actualitzat: '2026-10-09'
};

export default fitxa;
