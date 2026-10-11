import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

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
			"El Bassegoda, o puig de Bassegoda, és una punta de roca calcària que sobresurt, aïllada, per damunt dels boscos de l'Alta Garrotxa. És al terme d'Albanyà, a l'[Alt Empordà](/comarques/alt-emporda), just al límit amb Montagut i Oix, que ja és a la Garrotxa. La Viquipèdia en destaca la forma punxeguda i l'aïllament, que el fan fàcil de reconèixer de lluny. A la mateixa Alta Garrotxa hi ha [el Mont](/cims/el-mont) i [el Comanegra](/cims/comanegra).",
			"El cim té un lloc a la literatura catalana: Marià Vayreda hi va situar l'inici de La punyalada, i una placa del Centre Excursionista d'Olot, col·locada el 1971 i restaurada el 1980, ho recorda a dalt. Als seus peus hi ha el veïnat de Bassegoda, que va ser municipi fins al 1969, quan es va annexar a Albanyà; segons Rutes Pirineus, avui hi viuen set persones. Hi queden l'església romànica de Sant Miquel, el refugi de Can Galan i el mas de Can Nou.",
			"La Viquipèdia descriu el cim com una talaia absolutament rocosa, amb vistes del golf de Roses al Canigó. Rutes Pirineus, que hi passa a tocar amb el GR 11, hi afegeix l'Empordà, les Guilleries i el Montseny, i recomana deixar un moment el sender per pujar-hi.",
			"S'hi pot anar tot l'any, però no amb qualsevol temps: els darrers metres són de grimpada sobre roca, i amb pluja, gebre o boira val més quedar-se al coll. L'aproximació és llarga, gairebé tota per pista, de manera que a l'estiu convé matinar."
		],
		es: [
			'El Bassegoda, o puig de Bassegoda, es una punta de roca caliza que sobresale, aislada, por encima de los bosques de la Alta Garrotxa. Está en el término de Albanyà, en el [Alt Empordà](/comarques/alt-emporda), justo en el límite con Montagut i Oix, que ya es de la Garrotxa. La Viquipèdia destaca su forma puntiaguda y su aislamiento, que lo hacen fácil de reconocer de lejos. En la misma Alta Garrotxa están [el Mont](/cims/el-mont) y [el Comanegra](/cims/comanegra).',
			"La cima tiene un lugar en la literatura catalana: Marià Vayreda situó en ella el inicio de La punyalada, y una placa del Centre Excursionista d'Olot, colocada en 1971 y restaurada en 1980, lo recuerda arriba. A sus pies está el vecindario de Bassegoda, que fue municipio hasta 1969, cuando se anexionó a Albanyà; según Rutes Pirineus, hoy viven allí siete personas. Quedan la iglesia románica de Sant Miquel, el refugio de Can Galan y la masía de Can Nou.",
			'La Viquipèdia describe la cima como una atalaya absolutamente rocosa, con vistas del golfo de Roses al Canigó. Rutes Pirineus, que pasa al lado con el GR 11, añade el Empordà, las Guilleries y el Montseny, y recomienda dejar un momento el sendero para subir.',
			'Se puede ir todo el año, pero no con cualquier tiempo: los últimos metros son de trepada sobre roca, y con lluvia, escarcha o niebla es mejor quedarse en el collado. La aproximación es larga, casi toda por pista, así que en verano conviene madrugar.'
		]
	},
	rutes: [
		{
			id: 'can-nou',
			nom: {
				ca: 'Per la pista de Can Nou i el coll de Bassegoda',
				es: 'Por la pista de Can Nou y el coll de Bassegoda'
			},
			sortida: { nom: 'Pista de Can Nou de Bassegoda, a 4,5 km del càmping Bassegoda (Albanyà)' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "D'excursió per Catalunya la fa deixant el cotxe a la pista de Can Nou, 4,5 km més amunt del càmping Bassegoda, a 478 m; diu que la pista es pot fer amb turisme, amb compte en algun punt. Se segueix la pista fins a Can Nou, es puja pel corriol que surt darrere del mas, passa pel refugi i arriba prop del coll de Bassegoda; d'allà, un trencall senyalitzat porta al pla de la Bateria i al caminet del cim. Els últims metres són de grimpada. El web compta 16 km i 886 m de desnivell entre anada i tornada, amb 7 h 10 min de durada total.",
				es: "D'excursió per Catalunya la hace dejando el coche en la pista de Can Nou, 4,5 km más arriba del camping Bassegoda, a 478 m; dice que la pista se puede hacer con turismo, con cuidado en algún punto. Se sigue la pista hasta Can Nou, se sube por el sendero que sale detrás de la masía, pasa por el refugio y llega cerca del coll de Bassegoda; desde allí, un desvío señalizado lleva al pla de la Bateria y al caminito de la cima. Los últimos metros son de trepada. La web cuenta 16 km y 886 m de desnivel entre ida y vuelta, con 7 h 10 min de duración total."
			},
			fonts: [DEXCURSIO]
		},
		{
			id: 'gr11-albanya',
			nom: {
				ca: "Des d'Albanyà pel GR 11 fins al coll de Principi",
				es: 'Desde Albanyà por el GR 11 hasta el coll de Principi'
			},
			sortida: { nom: 'Albanyà (237 m)' },
			descripcio: {
				ca: "És la sisena etapa del GR 11, que Rutes Pirineus descriu fins a Sant Aniol d'Aguja (16,8 km, +975 m i 5 h 30 min en total). Des d'Albanyà puja per pistes asfaltades i de terra, amb més de 800 m de desnivell, fins a Can Nou (2 h 40 min, 769 m) i, per un corriol, al coll de Bassegoda (3 h 15 min, 1.105 m). La pista volta el cim fins al coll de Principi, d'on surt el camí que hi puja. La guia diu que l'etapa no té dificultat tècnica, però no detalla el tram del cim ni el seu horari.",
				es: "Es la sexta etapa del GR 11, que Rutes Pirineus describe hasta Sant Aniol d'Aguja (16,8 km, +975 m y 5 h 30 min en total). Desde Albanyà sube por pistas asfaltadas y de tierra, con más de 800 m de desnivel, hasta Can Nou (2 h 40 min, 769 m) y, por un sendero, al coll de Bassegoda (3 h 15 min, 1.105 m). La pista rodea la cima hasta el coll de Principi, de donde sale el camino que sube. La guía dice que la etapa no tiene dificultad técnica, pero no detalla el tramo de la cima ni su horario."
			},
			fonts: [RUTES_PIRINEUS]
		}
	],
	consells: {
		ca: [
			"Arriba al peu del cim amb les mans lliures i els bastons plegats: el final és de grimpada i s'ha de desgrimpar a la baixada.",
			"De tornada, el corriol que baixa del coll cap al refugi queda mig tapat i és fàcil passar-lo de llarg, segons D'excursió per Catalunya: fixa't on surt quan puges.",
			'Hi ha aigua a Albanyà i a Can Nou, que també fa de bar, segons Rutes Pirineus; més amunt, no en trobaràs.',
			'Si vols partir la pujada en dos dies, el refugi de Can Galan és a deu minuts de Can Nou; segons Rutes Pirineus el gestiona el Centre Excursionista Empordanès i cal reservar-hi.',
			'Si surts del càmping en lloc de pujar amb cotxe per la pista, la mateixa ressenya parla de més de 12 km de pujada i uns 1.000 m de desnivell.'
		],
		es: [
			'Llega al pie de la cima con las manos libres y los bastones plegados: el final es de trepada y hay que destreparlo a la bajada.',
			"A la vuelta, el sendero que baja del collado hacia el refugio queda medio tapado y es fácil pasarlo de largo, según D'excursió per Catalunya: fíjate dónde sale cuando subes.",
			'Hay agua en Albanyà y en Can Nou, que también hace de bar, según Rutes Pirineus; más arriba no encontrarás.',
			'Si quieres partir la subida en dos días, el refugio de Can Galan está a diez minutos de Can Nou; según Rutes Pirineus lo gestiona el Centre Excursionista Empordanès y hay que reservar.',
			'Si sales del camping en lugar de subir en coche por la pista, la misma reseña habla de más de 12 km de subida y unos 1.000 m de desnivel.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Bassegoda?',
				resposta:
					"Des de la pista de Can Nou, D'excursió per Catalunya compta 7 h 10 min de durada total per a 16 km i 886 m de desnivell, anada i tornada. Pel GR 11, Rutes Pirineus dona 3 h 15 min d'Albanyà al coll de Bassegoda, sense comptar la pujada final al cim."
			},
			{
				pregunta: 'Cal grimpar per arribar al cim del Bassegoda?',
				resposta:
					"Sí: els últims metres abans del cim són de grimpada, segons D'excursió per Catalunya. La resta de l'itinerari va per pistes i corriols."
			},
			{
				pregunta: "El Bassegoda és de l'Alt Empordà o de la Garrotxa?",
				resposta:
					"El cim fa de límit entre Albanyà, a l'[Alt Empordà](/comarques/alt-emporda), i Montagut i Oix, a la [Garrotxa](/comarques/garrotxa). El repte el compta entre els cims de l'Alt Empordà."
			},
			{
				pregunta: 'Què té a veure el Bassegoda amb La punyalada?',
				resposta:
					"Marià Vayreda va situar dalt del cim el començament de la novel·la. Segons la Viquipèdia, una placa del Centre Excursionista d'Olot del 1971, restaurada el 1980, ho recorda."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Bassegoda?',
				resposta:
					"Desde la pista de Can Nou, D'excursió per Catalunya cuenta 7 h 10 min de duración total para 16 km y 886 m de desnivel, ida y vuelta. Por el GR 11, Rutes Pirineus da 3 h 15 min de Albanyà al coll de Bassegoda, sin contar la subida final a la cima."
			},
			{
				pregunta: '¿Hay que trepar para llegar a la cima del Bassegoda?',
				resposta:
					"Sí: los últimos metros antes de la cima son de trepada, según D'excursió per Catalunya. El resto del itinerario va por pistas y senderos."
			},
			{
				pregunta: '¿El Bassegoda es del Alt Empordà o de la Garrotxa?',
				resposta:
					'La cima hace de límite entre Albanyà, en el [Alt Empordà](/comarques/alt-emporda), y Montagut i Oix, en la [Garrotxa](/comarques/garrotxa). El reto la cuenta entre las cimas del Alt Empordà.'
			},
			{
				pregunta: '¿Qué tiene que ver el Bassegoda con La punyalada?',
				resposta:
					"Marià Vayreda situó en lo alto de la cima el comienzo de la novela. Según la Viquipèdia, una placa del Centre Excursionista d'Olot de 1971, restaurada en 1980, lo recuerda."
			}
		]
	},
	fonts: [VIQUIPEDIA, DEXCURSIO, RUTES_PIRINEUS],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
