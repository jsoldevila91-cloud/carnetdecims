import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-03';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puigmal',
	url: 'https://ca.wikipedia.org/wiki/Puigmal',
	consultat: CONSULTAT
};

const VIATJAR_NURIA = {
	nom: "Viatjar és descobrir: Puigmal des de Núria per la Coma de l'Embut",
	url: 'https://viatjaresdescobrir.cat/2022/07/16/puigmal-des-de-nuria/',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS_FONTALBA = {
	nom: 'Rutes Pirineus: Puigmal per Fontalba',
	url: 'https://www.rutespirineus.cat/rutes/puigmal-per-fontalba',
	consultat: CONSULTAT
};

const DEXCURSIO_NURIA = {
	nom: "D'excursió per Catalunya: ruta al Puigmal des de Núria",
	url: 'https://dexcursio.net/puigmal-des-de-nuria/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puigmal',
	descripcio: {
		ca: [
			"El Puigmal és la gran muntanya que tanca per ponent la Vall de Núria. El cim és a la frontera, entre el terme de Queralbs, [al Ripollès](/comarques/ripolles), i el d'Er, a l'Alta Cerdanya, i és el punt més alt de l'Alt Ter. És una muntanya ampla i arrodonida, de gresos i pissarres, sense les parets verticals d'altres cims del Pirineu: per això, amb bon temps, és una de les maneres més assequibles de superar els 2.900 metres.",
			"Al cim hi ha una creu de ferro i una placa amb versos de Jacint Verdaguer dedicats a la vista que s'hi contempla. La relació del Puigmal amb Núria és antiga: el santuari i el cremallera, que puja des de Ribes de Freser i Queralbs, el converteixen en un dels cims de gairebé tres mil metres més freqüentats per qui fa les primeres sortides d'alta muntanya. Al seu voltant s'estén una carena llarga cap a la [Torre d'Eina](/cims/torre-d-eina) i els cims de Noufonts, amb els quals es pot encadenar.",
			"Gràcies a la seva posició avançada, la panoràmica és molt àmplia: la Cerdanya i el Cadí cap a l'oest, el Canigó a l'est, les valls del Ripollès i el Pirineu oriental gairebé sencer. En dies clars, la plana de la Cerdanya queda als peus com un mapa.",
			"De juny a octubre la pujada és una excursió d'estiu. Fora d'aquests mesos el cim sol estar nevat i l'ascensió canvia del tot: la Coma de l'Embut i els vessants ventats poden tenir plaques i gel. A l'estiu, el vent i les tempestes són els principals perills d'una carena tan exposada."
		],
		es: [
			'El Puigmal es la gran montaña que cierra por el oeste la Vall de Núria. La cima está en la frontera, entre el municipio de Queralbs, [en el Ripollès](/comarques/ripolles), y el de Er, en la Alta Cerdaña, y es el punto más alto del Alt Ter. Es una montaña ancha y redondeada, de areniscas y pizarras, sin las paredes verticales de otras cumbres del Pirineo: por eso, con buen tiempo, es una de las formas más asequibles de superar los 2.900 metros.',
			"En la cima hay una cruz de hierro y una placa con versos de Jacint Verdaguer dedicados a la vista que se contempla. La relación del Puigmal con Núria es antigua: el santuario y el tren cremallera, que sube desde Ribes de Freser y Queralbs, lo convierten en una de las cimas de casi tres mil metros más frecuentadas por quien hace sus primeras salidas de alta montaña. A su alrededor se extiende una larga cresta hacia la [Torre d'Eina](/cims/torre-d-eina) y las cimas de Noufonts, que se pueden encadenar.",
			'Gracias a su posición avanzada, la panorámica es muy amplia: la Cerdaña y el Cadí hacia el oeste, el Canigó al este, los valles del Ripollès y casi todo el Pirineo oriental. En días claros, la llanura de la Cerdaña queda a los pies como un mapa.',
			"De junio a octubre la subida es una excursión de verano. Fuera de esos meses la cima suele estar nevada y la ascensión cambia por completo: la Coma de l'Embut y las laderas venteadas pueden tener placas y hielo. En verano, el viento y las tormentas son los principales peligros de una cresta tan expuesta."
		]
	},
	rutes: [
		{
			id: 'nuria-embut',
			nom: { ca: "Des de Núria per la Coma de l'Embut", es: "Desde Núria por la Coma de l'Embut" },
			sortida: { nom: 'Santuari de Núria (Queralbs)' },
			desnivellPositiuM: 928,
			distanciaKm: 4.7,
			tecnicitat: 'cap',
			descripcio: {
				ca: "És la pujada clàssica. Del santuari, on s'arriba amb el cremallera, el camí remunta el torrent de la Coma de l'Embut, molt dret al principi, i després s'enfila pel llom fins al cim. No hi ha passos tècnics, però el pendent és sostingut. Es pot tornar pel mateix camí o fer una circular baixant per Fontalba.",
				es: "Es la subida clásica. Desde el santuario, al que se llega en tren cremallera, el camino remonta el torrente de la Coma de l'Embut, muy empinado al principio, y luego sube por el lomo hasta la cima. No hay pasos técnicos, pero la pendiente es sostenida. Se puede volver por el mismo camino o hacer una circular bajando por Fontalba."
			},
			fonts: [VIATJAR_NURIA, DEXCURSIO_NURIA]
		},
		{
			id: 'fontalba',
			nom: { ca: 'Des de la collada de Fontalba', es: 'Desde el collado de Fontalba' },
			sortida: { nom: 'Collada de Fontalba (2.070 m)' },
			tempsMinuts: 110,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "La pista de Queralbs a Fontalba permet començar més amunt i pujar per la carena del cim de la Dou i el Borrut. És el camí més curt, però a l'estiu l'accés motoritzat a la pista pot estar regulat. Rutes Pirineus el planteja com una circular que baixa per la Coma de l'Embut i Núria.",
				es: "La pista de Queralbs a Fontalba permite empezar más arriba y subir por la cresta del cim de la Dou y el Borrut. Es el camino más corto, pero en verano el acceso motorizado a la pista puede estar regulado. Rutes Pirineus lo plantea como una circular que baja por la Coma de l'Embut y Núria."
			},
			fonts: [RUTES_PIRINEUS_FONTALBA]
		}
	],
	consells: {
		ca: [
			"Si puges amb el cremallera, consulta l'horari de l'últim tren de baixada i calcula-hi el temps de marge.",
			"Abans d'anar en cotxe a Fontalba, comprova si l'accés a la pista està regulat (Queralbs Natura informa de les dates i de la reserva).",
			"La carena és molt exposada al vent: porta roba d'abric fins i tot a l'estiu.",
			"Amb boira, el llom ample del Puigmal pot desorientar; porta el track o un mapa i no te'n separis.",
			"Amb neu, la Coma de l'Embut pot tenir risc d'allaus; l'ascensió hivernal demana material i experiència."
		],
		es: [
			'Si subes en cremallera, consulta el horario del último tren de bajada y calcula un margen de tiempo.',
			'Antes de ir en coche a Fontalba, comprueba si el acceso a la pista está regulado (Queralbs Natura informa de fechas y reservas).',
			'La cresta está muy expuesta al viento: lleva ropa de abrigo incluso en verano.',
			'Con niebla, el lomo ancho del Puigmal puede desorientar; lleva el track o un mapa y no te separes del camino.',
			"Con nieve, la Coma de l'Embut puede tener riesgo de aludes; la ascensión invernal exige material y experiencia."
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puigmal des de Núria?',
				resposta:
					"Per la Coma de l'Embut són uns 9,4 km anada i tornada, uns 930 m de desnivell i unes 4 h 30 min de marxa efectiva en total, segons Viatjar és descobrir. Des de la collada de Fontalba, Rutes Pirineus situa el cim a 1 h 50 min."
			},
			{
				pregunta: 'El Puigmal és difícil?',
				resposta:
					"Sense neu no té passos tècnics, però frega els tres mil metres: el desnivell és considerable, l'altitud es nota i la carena és exposada al vent i a les tempestes. Cal forma física i experiència bàsica de muntanya."
			},
			{
				pregunta: 'Es pot pujar al Puigmal amb nens?',
				resposta:
					"Amb nens grans i acostumats a caminar, sí, en un dia d'estiu estable i sortint d'hora. El cremallera fins a Núria ajuda molt. Amb nens petits és millor quedar-se pels camins de la vall."
			},
			{
				pregunta: 'El Puigmal compta com a cim essencial?',
				resposta:
					'Sí, i és el sostre dels sis essencials del Ripollès, per sobre del [Bastiments](/cims/bastiments) i del [Taga](/cims/taga). També surt a la llista dels [cims més alts del repte](/cims-mes-alts).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puigmal desde Núria?',
				resposta:
					"Por la Coma de l'Embut son unos 9,4 km ida y vuelta, unos 930 m de desnivel y unas 4 h 30 min de marcha efectiva en total, según Viatjar és descobrir. Desde el collado de Fontalba, Rutes Pirineus sitúa la cima a 1 h 50 min."
			},
			{
				pregunta: '¿El Puigmal es difícil?',
				resposta:
					'Sin nieve no tiene pasos técnicos, pero roza los tres mil metros: el desnivel es considerable, la altitud se nota y la cresta está expuesta al viento y a las tormentas. Hace falta forma física y experiencia básica de montaña.'
			},
			{
				pregunta: '¿Se puede subir al Puigmal con niños?',
				resposta:
					'Con niños mayores y acostumbrados a caminar, sí, en un día de verano estable y saliendo temprano. El cremallera hasta Núria ayuda mucho. Con niños pequeños es mejor quedarse en los caminos del valle.'
			},
			{
				pregunta: '¿El Puigmal cuenta como cima esencial?',
				resposta:
					'Sí, y es el techo de las seis esenciales del Ripollès, por encima del [Bastiments](/cims/bastiments) y del [Taga](/cims/taga). También aparece en la lista de las [cimas más altas del reto](/cims-mes-alts).'
			}
		]
	},
	wikiloc: [
		{
			id: 13099835,
			titol: "De Núria al Puigmal per la Coma de l'Embut",
			url: 'https://www.wikiloc.com/hiking-trails/de-nuria-al-puigmal-per-la-coma-de-lembut-13099835'
		},
		{
			id: 18566593,
			titol: "Puigmal desde Núria (por Coma de l'Embut)",
			url: 'https://www.wikiloc.com/hiking-trails/puigmal-desde-nuria-por-coma-de-lembut-18566593'
		}
	],
	fonts: [VIQUIPEDIA, VIATJAR_NURIA, DEXCURSIO_NURIA, RUTES_PIRINEUS_FONTALBA],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
