import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const AJUNTAMENT = {
	nom: 'Ajuntament de Castellví de la Marca: els secrets del Castellot',
	url: 'https://www.castellvidelamarca.cat/endinsat-a-la-marca/els-secrets-del-castellot',
	consultat: CONSULTAT
};

const DERUTAENRUTA = {
	nom: 'De ruta en ruta: el Castellot',
	url: 'https://www.derutaenruta.com/ca/rutes/castellot',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: el Castellot de Castellví de la Marca',
	url: 'https://totnens.cat/que-fem/el-castellot-de-castellvi-de-la-marca/',
	consultat: CONSULTAT
};

const ARASA = {
	nom: 'Josep Arasa i Ferrer (VilaWeb): Històries del Penedès, el Castellot de Castellví de la Marca',
	url: 'https://blocs.mesvilaweb.cat/elbarrinaire/histories-del-penedesel-castellot-de-castellvi-de-la-marca/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'el-castellot',
	descripcio: {
		ca: [
			"El Castellot és un turó acinglerat del terme de Castellví de la Marca, [a l'Alt Penedès](/comarques/alt-penedes), que s'aboca en un penya-segat sobre la riera de Marmellar. És el conjunt historicoarqueològic més conegut del municipi i un dels grans miradors de la plana del Penedès, entre pinedes i vinyes. Uns quants quilòmetres a l'est hi ha [la Penya del Papiol](/cims/penya-del-papiol) i [el Puig de l'Àliga](/cims/puig-de-l-aliga), els altres cims essencials del Penedès i el Garraf.",
			"El nom ve de les restes del castell de Castellvell de la Marca, que apareix per primer cop el 977 en una venda del comte Borrell de Barcelona, quan aquestes terres eren frontera. Cap al 1023 va passar als Castellvell, un dels llinatges feudals més poderosos de la Marca del Penedès. La torre mestra era rodona, d'uns 10 m d'alçada i amb murs de 165 cm de gruix, i s'hi entrava a mitja alçada per una escala de fusta que es podia retirar en cas de perill. Al costat hi ha les restes de l'església romànica de Sant Miquel, la capella del castell, on des del 1293 hi havia un capellà que deia missa cada dia.",
			'Des del cim es domina gairebé tota la plana del Penedès, amb el mosaic de vinyes i pinedes, i les serres que la tanquen.',
			"Qualsevol època hi va bé. A l'estiu, puja a primera hora: el tram final és costerut i a ple sol. La tardor, amb les vinyes canviant de color, és un dels millors moments per anar-hi."
		],
		es: [
			"El Castellot es un cerro rodeado de riscos del municipio de Castellví de la Marca, [en el Alt Penedès](/comarques/alt-penedes), que se asoma en un acantilado sobre la riera de Marmellar. Es el conjunto histórico-arqueológico más conocido del municipio y uno de los grandes miradores de la llanura del Penedès, entre pinares y viñas. Unos kilómetros al este están [la Penya del Papiol](/cims/penya-del-papiol) y [el Puig de l'Àliga](/cims/puig-de-l-aliga), las otras cimas esenciales del Penedès y el Garraf.",
			'El nombre viene de los restos del castillo de Castellvell de la Marca, que aparece por primera vez en 977 en una venta del conde Borrell de Barcelona, cuando estas tierras eran frontera. Hacia 1023 pasó a los Castellvell, uno de los linajes feudales más poderosos de la Marca del Penedès. La torre maestra era redonda, de unos 10 m de altura y con muros de 165 cm de grosor, y se entraba a media altura por una escalera de madera que se podía retirar en caso de peligro. Al lado están los restos de la iglesia románica de Sant Miquel, la capilla del castillo, donde desde 1293 había un capellán que decía misa cada día.',
			'Desde la cima se domina casi toda la llanura del Penedès, con el mosaico de viñas y pinares, y las sierras que la cierran.',
			'Cualquier época va bien. En verano, sube a primera hora: el tramo final es empinado y a pleno sol. El otoño, con las viñas cambiando de color, es uno de los mejores momentos para ir.'
		]
	},
	rutes: [
		{
			id: 'cases-noves-de-la-riera',
			nom: {
				ca: 'Des de les Cases Noves de la Riera',
				es: 'Desde les Cases Noves de la Riera'
			},
			sortida: { nom: 'Aparcament de les Cases Noves de la Riera (Castellví de la Marca)' },
			desnivellPositiuM: 209,
			distanciaKm: 3.14,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "És l'itinerari que proposa l'Ajuntament: 3,14 km d'anada i 209 m de desnivell, amb una pujada constant però agradable pel bosc. Segons De ruta en ruta, que hi baixa pel PR-C 154-1, el tram final cap al castell és força costerut i més pedregós.",
				es: 'Es el itinerario que propone el Ayuntamiento: 3,14 km de ida y 209 m de desnivel, con una subida constante pero agradable por el bosque. Según De ruta en ruta, que baja por el PR-C 154-1, el tramo final hacia el castillo es bastante empinado y más pedregoso.'
			},
			fonts: [AJUNTAMENT, DERUTAENRUTA]
		},
		{
			id: 'sant-sadurni',
			nom: {
				ca: "Des de l'ermita de Sant Sadurní",
				es: 'Desde la ermita de Sant Sadurní'
			},
			sortida: { nom: 'Ermita de Sant Sadurní (Castellví de la Marca)' },
			descripcio: {
				ca: "La proposta familiar de Totnens surt de l'esplanada de l'ermita de Sant Sadurní i combina camins asfaltats, corriols de bosc i pistes, amb una pujada més pronunciada al final. Són uns 7 km anada i tornada, unes 3 h amb parades. De ruta en ruta hi passa als 25 minuts de la seva circular i arriba al cim en 1 h 10 min des de la riera de Marmellar.",
				es: 'La propuesta familiar de Totnens sale de la explanada de la ermita de Sant Sadurní y combina caminos asfaltados, senderos de bosque y pistas, con una subida más pronunciada al final. Son unos 7 km ida y vuelta, unas 3 h con paradas. De ruta en ruta pasa por ella a los 25 minutos de su circular y llega a la cima en 1 h 10 min desde la riera de Marmellar.'
			},
			fonts: [TOTNENS, DERUTAENRUTA]
		}
	],
	consells: {
		ca: [
			'El cim acaba en una cinglera sense protecció al costat de les ruïnes: amb nens, no us hi acosteu.',
			'Hi ha un corriol de baixada més directe i dret a prop del castell; Totnens no el recomana amb nens petits.',
			'Porta aigua i protecció solar: la part alta és molt exposada al sol.',
			"Les restes del castell i de l'església són fràgils: no t'enfilis als murs.",
			"L'Ajuntament hi ha organitzat visites guiades gratuïtes amb reserva prèvia; consulta l'agenda si vols conèixer-ne la història sobre el terreny."
		],
		es: [
			'La cima termina en un risco sin protección junto a las ruinas: con niños, no os acerquéis.',
			'Hay un sendero de bajada más directo y empinado cerca del castillo; Totnens no lo recomienda con niños pequeños.',
			'Lleva agua y protección solar: la parte alta está muy expuesta al sol.',
			'Los restos del castillo y de la iglesia son frágiles: no te subas a los muros.',
			'El Ayuntamiento ha organizado visitas guiadas gratuitas con reserva previa; consulta la agenda si quieres conocer la historia sobre el terreno.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Castellot?',
				resposta:
					"Des de la riera de Marmellar, De ruta en ruta arriba al cim en 1 h 10 min. L'itinerari de l'Ajuntament des de les Cases Noves de la Riera fa 3,14 km d'anada i 209 m de desnivell."
			},
			{
				pregunta: 'Es pot pujar al Castellot amb nens?',
				resposta:
					'Sí, és una excursió familiar habitual del Penedès. El camí no té passos tècnics, però el final és costerut i pedregós, i a dalt hi ha una cinglera sense protecció on cal vigilar molt els nens.'
			},
			{
				pregunta: 'Què queda del castell del Castellot?',
				resposta:
					"Les restes de la torre mestra, rodona, i de l'església romànica de Sant Miquel. El castell està documentat des del 977 i va ser dels Castellvell, un dels grans llinatges de la Marca del Penedès."
			},
			{
				pregunta: 'El Castellot és un cim essencial?',
				resposta:
					'Sí. L’Alt Penedès en té dos, el Castellot i [la Penya del Papiol](/cims/penya-del-papiol), i el Castellot és el més alt dels dos. Per validar-lo cal arribar al cim per qualsevol camí i sense motor, tal com explica la [normativa](/repte-100-cims/normativa).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Castellot?',
				resposta:
					'Desde la riera de Marmellar, De ruta en ruta llega a la cima en 1 h 10 min. El itinerario del Ayuntamiento desde les Cases Noves de la Riera tiene 3,14 km de ida y 209 m de desnivel.'
			},
			{
				pregunta: '¿Se puede subir al Castellot con niños?',
				resposta:
					'Sí, es una excursión familiar habitual del Penedès. El camino no tiene pasos técnicos, pero el final es empinado y pedregoso, y arriba hay un risco sin protección donde hay que vigilar mucho a los niños.'
			},
			{
				pregunta: '¿Qué queda del castillo del Castellot?',
				resposta:
					'Los restos de la torre maestra, redonda, y de la iglesia románica de Sant Miquel. El castillo está documentado desde 977 y fue de los Castellvell, uno de los grandes linajes de la Marca del Penedès.'
			},
			{
				pregunta: '¿El Castellot es una cima esencial?',
				resposta:
					'Sí. El Alt Penedès tiene dos, el Castellot y [la Penya del Papiol](/cims/penya-del-papiol), y el Castellot es la más alta de las dos. Para validarla hay que llegar a la cima por cualquier camino y sin motor, como explica la [normativa](/repte-100-cims/normativa).'
			}
		]
	},
	fonts: [AJUNTAMENT, DERUTAENRUTA, TOTNENS, ARASA],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
