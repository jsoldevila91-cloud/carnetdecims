import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puig de Bassegoda',
	url: 'https://ca.wikipedia.org/wiki/Puig_de_Bassegoda',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: Puig de Bassegoda",
	url: 'https://dexcursio.net/puig-de-bassegoda/',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: "Rutes Pirineus: GR 11, etapa 6, Albanyà - Sant Aniol d'Aguja",
	url: 'https://www.rutespirineus.cat/rutes/gr-11-transpirinenca-etapa-06-albanya-sant-aniol-aguja',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'bassegoda',
	descripcio: {
		ca: [
			"El Bassegoda és un cim rocós de l'Alta Garrotxa, al límit entre el terme d'Albanyà, a l'[Alt Empordà](/comarques/alt-emporda), i el de Montagut i Oix, a la [Garrotxa](/comarques/garrotxa). Segons la Viquipèdia, és dins l'espai protegit de l'Alta Garrotxa i el formen sobretot calcàries i dolomies. A la vora hi ha altres cims essencials del repte, com [el Mont](/cims/el-mont) i [el Comanegra](/cims/comanegra).",
			"La Viquipèdia el descriu com una talaia de roca nua. Al seu peu passa la ruta del GR 11, la travessia dels Pirineus, que a la sisena etapa surt d'Albanyà cap a Sant Aniol d'Aguja i, segons Rutes Pirineus, convida a deixar un moment el camí marcat per pujar fins al cim.",
			'Des de dalt, la mateixa Viquipèdia situa el panorama entre el golf de Roses i el Canigó. És una vista de dia clar: amb calitja o amb núvols baixos, no cal esperar-ne res.',
			"El darrer tram no és un simple caminar. D'excursió per Catalunya explica que els últims metres abans del cim són de grimpada, de manera que no és una sortida per anar-hi amb sabatilles de passeig ni amb nens petits. Amb la roca mullada o amb boira convé no insistir."
		],
		es: [
			'El Bassegoda es una cima rocosa de la Alta Garrotxa, en el límite entre el término de Albanyà, en el [Alt Empordà](/comarques/alt-emporda), y el de Montagut i Oix, en la [Garrotxa](/comarques/garrotxa). Según la Viquipèdia, está dentro del espacio protegido de la Alta Garrotxa y lo forman sobre todo calizas y dolomías. Cerca hay otras cimas esenciales del reto, como [el Mont](/cims/el-mont) y [el Comanegra](/cims/comanegra).',
			"La Viquipèdia lo describe como una atalaya de roca desnuda. A sus pies pasa el GR 11, la travesía de los Pirineos, que en su sexta etapa sale de Albanyà hacia Sant Aniol d'Aguja y, según Rutes Pirineus, invita a dejar un momento el camino marcado para subir hasta la cima.",
			'Desde arriba, la misma Viquipèdia sitúa el panorama entre el golfo de Roses y el Canigó. Es una vista de día claro: con calima o con nubes bajas, no hay que esperar nada.',
			"El último tramo no es un simple paseo. D'excursió per Catalunya cuenta que los últimos metros antes de la cima son de trepada, así que no es una salida para ir con zapatillas de paseo ni con niños pequeños. Con la roca mojada o con niebla conviene no insistir."
		]
	},
	rutes: [
		{
			id: 'can-nou',
			nom: {
				ca: 'Des de Can Nou de Bassegoda pel coll de Bassegoda',
				es: 'Desde Can Nou de Bassegoda por el coll de Bassegoda'
			},
			sortida: { nom: 'Can Nou de Bassegoda (Albanyà)' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "D'excursió per Catalunya la proposa sortint de Can Nou de Bassegoda, a uns 4,5 km del càmping d'Albanyà per una pista que, segons el mateix web, es pot fer amb turisme anant amb compte en algun punt. Des de la masia surt un corriol darrere la casa que passa pel refugi i puja al coll de Bassegoda; després, per una pista, s'arriba al pla de la Bateria, d'on un corriol surt cap al cim. Els últims metres abans del cim són de grimpada. El web dona 16 km i 886 m de desnivell positiu amb 7 h 10 min, tot anada i tornada des d'on va deixar el cotxe. A la baixada, el corriol queda tapat i és fàcil de passar de llarg.",
				es: "D'excursió per Catalunya la propone saliendo de Can Nou de Bassegoda, a unos 4,5 km del camping de Albanyà por una pista que, según la misma web, se puede hacer con turismo yendo con cuidado en algún punto. Desde la masía sale un sendero detrás de la casa que pasa por el refugio y sube al coll de Bassegoda; después, por una pista, se llega al pla de la Bateria, de donde un sendero sale hacia la cima. Los últimos metros antes de la cima son de trepada. La web da 16 km y 886 m de desnivel positivo con 7 h 10 min, todo ida y vuelta desde donde dejó el coche. En la bajada, el sendero queda tapado y es fácil pasarlo de largo."
			},
			fonts: [DEXCURSIO]
		},
		{
			id: 'gr11-albanya',
			nom: {
				ca: "Des d'Albanyà pel GR 11 i desviament al cim",
				es: 'Desde Albanyà por el GR 11 y desvío a la cima'
			},
			sortida: { nom: 'Albanyà' },
			descripcio: {
				ca: "Rutes Pirineus recull la sisena etapa del GR 11, d'Albanyà a Sant Aniol d'Aguja: 16,8 km i +975 m amb 5 h 30 min efectives sense parades, la xifra de tota l'etapa i no pas de la pujada al cim. Segons l'entitat, la pujada fins al coll de Bassegoda és una llarga ascensió per pista de terra amb llaçades (3 h 15 min), i el cim queda a un desviament des del coll de Principi. La mateixa fitxa diu que l'etapa no té dificultat tècnica, però això no inclou el desviament al cim, que no descriu. Hi ha aigua a Albanyà i a Can Nou.",
				es: "Rutes Pirineus recoge la sexta etapa del GR 11, de Albanyà a Sant Aniol d'Aguja: 16,8 km y +975 m con 5 h 30 min efectivas sin paradas, la cifra de toda la etapa y no de la subida a la cima. Según la entidad, la subida hasta el coll de Bassegoda es una larga ascensión por pista de tierra con lazadas (3 h 15 min), y la cima queda en un desvío desde el coll de Principi. La misma ficha dice que la etapa no tiene dificultad técnica, pero eso no incluye el desvío a la cima, que no describe. Hay agua en Albanyà y en Can Nou."
			},
			fonts: [RUTES_PIRINEUS]
		}
	],
	consells: {
		ca: [
			'Els últims metres són de grimpada: puja amb les mans lliures, sense motxilla pesada i, si la roca és mullada o hi ha boira, renuncia-hi.',
			'A la baixada, el corriol que torna al coll queda tapat i és fàcil passar-lo de llarg; baixa sense pressa i, si dubtes, torna al punt on el vas veure per última vegada.',
			"Si hi vas amb cotxe fins a Can Nou, la pista és practicable amb turisme segons D'excursió per Catalunya, però demana atenció en algun punt.",
			'Porta aigua de casa: Rutes Pirineus només en dona a Albanyà i a Can Nou.',
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'Los últimos metros son de trepada: sube con las manos libres, sin mochila pesada y, si la roca está mojada o hay niebla, renuncia.',
			'En la bajada, el sendero que vuelve al coll queda tapado y es fácil pasarlo de largo; baja sin prisa y, si dudas, vuelve al punto donde lo viste por última vez.',
			"Si vas en coche hasta Can Nou, la pista es practicable con turismo según D'excursió per Catalunya, pero pide atención en algún punto.",
			'Lleva agua de casa: Rutes Pirineus solo da agua en Albanyà y en Can Nou.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Bassegoda?',
				resposta:
					"D'excursió per Catalunya dona 7 h 10 min per a 16 km, anada i tornada, sortint de Can Nou de Bassegoda. La part del GR 11 d'Albanyà al coll de Bassegoda és de 3 h 15 min segons Rutes Pirineus, però això no inclou el cim."
			},
			{
				pregunta: 'Cal grimpar per arribar al cim del Bassegoda?',
				resposta:
					"Sí, als últims metres. D'excursió per Catalunya els qualifica de grimpada; Rutes Pirineus no descriu aquest tram. Si no t'hi veus, el coll de Bassegoda ja és un bon objectiu."
			},
			{
				pregunta: 'Quina és la comarca del Bassegoda?',
				resposta:
					"El catàleg el situa a l'[Alt Empordà](/comarques/alt-emporda), amb Albanyà de terme, però el cim és al límit amb Montagut i Oix, a la [Garrotxa](/comarques/garrotxa)."
			},
			{
				pregunta: 'El Bassegoda és un cim essencial del repte?',
				resposta:
					"Sí. Dins de l'Alta Garrotxa, a prop hi ha [el Mont](/cims/el-mont) i [el Comanegra](/cims/comanegra), també essencials."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Bassegoda?',
				resposta:
					"D'excursió per Catalunya da 7 h 10 min para 16 km, ida y vuelta, saliendo de Can Nou de Bassegoda. El tramo del GR 11 de Albanyà al coll de Bassegoda es de 3 h 15 min según Rutes Pirineus, pero eso no incluye la cima."
			},
			{
				pregunta: '¿Hay que trepar para llegar a la cima del Bassegoda?',
				resposta:
					"Sí, en los últimos metros. D'excursió per Catalunya los califica de trepada; Rutes Pirineus no describe ese tramo. Si no te ves capaz, el coll de Bassegoda ya es un buen objetivo."
			},
			{
				pregunta: '¿Cuál es la comarca del Bassegoda?',
				resposta:
					'El catálogo lo sitúa en el [Alt Empordà](/comarques/alt-emporda), con Albanyà de término, pero la cima está en el límite con Montagut i Oix, en la [Garrotxa](/comarques/garrotxa).'
			},
			{
				pregunta: '¿El Bassegoda es una cima esencial del reto?',
				resposta:
					'Sí. Dentro de la Alta Garrotxa, cerca están [el Mont](/cims/el-mont) y [el Comanegra](/cims/comanegra), también esenciales.'
			}
		]
	},
	fonts: [VIQUIPEDIA, DEXCURSIO, RUTES_PIRINEUS],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
