import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: castell de Burriac',
	url: 'https://ca.wikipedia.org/wiki/Castell_de_Burriac',
	consultat: CONSULTAT
};

const WILDKIDS = {
	nom: 'Wild Kids: excursión con niños al castillo de Burriac',
	url: 'https://wildkids.es/excursion-con-ninos-castillo-de-burriac/',
	consultat: CONSULTAT
};

const FESTESMAJORS = {
	nom: 'Festes Majors de Catalunya: el castell de Burriac',
	url: 'https://festesmajorsdecatalunya.cat/castell-de-burriac-excursions-catalunya/',
	consultat: CONSULTAT
};

const VIATGEADDICTES = {
	nom: 'Viatgeaddictes: itinerari a peu fins al castell de Burriac',
	url: 'https://www.viatgeaddictes.com/rutes-barcelona/itinerari-a-peu-fins-al-castell-de-burriac-21/',
	consultat: CONSULTAT
};

const TURISMEMARESME = {
	nom: 'Turisme Maresme: castell de Burriac des de Cabrera',
	url: 'https://www.turismemaresme.cat/en/what-to-do/sports/sports-routes/16/burriac-castle-from-cabera',
	consultat: CONSULTAT
};

const CORRECCIO = '2026-10-09';

const DIBA_SLC114 = {
	nom: "Diputació de Barcelona, itineraris senyalitzats: SL-C 114, al castell de Burriac des d'Argentona",
	url: 'https://itineraris-senyalitzats.diba.cat/dibaparcs/routes/view/sl-c-114-al-castell-de-burriac-des-d-argentona',
	consultat: CORRECCIO
};

const DIBA_SLC115 = {
	nom: 'Diputació de Barcelona, itineraris senyalitzats: SL-C 115, al castell de Burriac des de Cabrera de Mar',
	url: 'https://itineraris-senyalitzats.diba.cat/dibaparcs/routes/view/sl-c-115-al-castell-de-burriac-des-de-cabrera-de-mar',
	consultat: CORRECCIO
};

const RUTES_PIRINEUS = {
	nom: "Rutes Pirineus: el castell de Burriac i el Camí de les Fonts des d'Argentona",
	url: 'https://www.rutespirineus.cat/rutes/castell-burriac-argentona',
	consultat: CORRECCIO
};

const fitxa: ContingutFitxa = {
	slug: 'castell-de-burriac',
	descripcio: {
		ca: [
			"El castell de Burriac corona el turó del mateix nom, a la serralada Litoral, sobre el límit entre Cabrera de Mar i Argentona, [al Maresme](/comarques/maresme). Turisme Maresme el presenta com el símbol de Cabrera. Uns quilòmetres al nord-est hi ha el [Montalt](/cims/montalt), l'altre cim essencial de la comarca.",
			"El turó ha estat ocupat des de molt abans del castell: la Viquipèdia hi distingeix una talaia ibèrica, una fortificació romana dels segles II–I aC i el castell medieval dels segles XI al XV. El primer document que el cita és del 1017, en una donació de la comtessa Ermessenda a Berenguer Ramon I, i a l'edat mitjana també se'l coneixia com a castell de Sant Vicenç. El 1471 va passar a Pere Joan Ferrer, baró del Maresme, que el va reformar a fons; al segle XVIII va deixar de fer-se servir i el 1990 el va comprar l'Ajuntament de Cabrera. Avui en queden la torre de l'homenatge, una cisterna i la capella de Sant Vicenç, i és bé cultural d'interès nacional.",
			"Des de dalt es domina la costa del Maresme i, cap a l'interior, segons Viatgeaddictes, el Montnegre, el Montseny i els cingles de Bertí.",
			"És una sortida per a qualsevol època de l'any. A l'estiu, puja a primera hora o a la tarda, perquè el vessant de mar és molt assolellat; a l'hivern, en dies serens, la visibilitat sobre la costa és més bona."
		],
		es: [
			'El castillo de Burriac corona el cerro del mismo nombre, en la cordillera Litoral, sobre el límite entre Cabrera de Mar y Argentona, [en el Maresme](/comarques/maresme). Turisme Maresme lo presenta como el símbolo de Cabrera. Unos kilómetros al nordeste está el [Montalt](/cims/montalt), la otra cima esencial de la comarca.',
			'El cerro estuvo ocupado mucho antes del castillo: la Viquipèdia distingue una atalaya ibérica, una fortificación romana de los siglos II–I a. C. y el castillo medieval de los siglos XI al XV. El primer documento que lo cita es de 1017, en una donación de la condesa Ermessenda a Berenguer Ramon I, y en la Edad Media también se le conocía como castillo de Sant Vicenç. En 1471 pasó a Pere Joan Ferrer, barón del Maresme, que lo reformó a fondo; en el siglo XVIII dejó de usarse y en 1990 lo compró el Ayuntamiento de Cabrera. Hoy quedan la torre del homenaje, una cisterna y la capilla de Sant Vicenç, y es bien cultural de interés nacional.',
			'Desde arriba se domina la costa del Maresme y, hacia el interior, según Viatgeaddictes, el Montnegre, el Montseny y los riscos de Bertí.',
			'Es una salida para cualquier época del año. En verano, sube a primera hora o por la tarde, porque la vertiente de mar es muy soleada; en invierno, en días despejados, la visibilidad sobre la costa es mejor.'
		]
	},
	rutes: [
		{
			id: 'font-picant',
			nom: {
				ca: "Des del parc de la Font Picant d'Argentona pel SL-C 114",
				es: 'Desde el parque de la Font Picant de Argentona por el SL-C 114'
			},
			sortida: { nom: 'Parc de la Font Picant (Argentona)' },
			tempsMinuts: 45,
			tecnicitat: 'cap',
			descripcio: {
				ca: "És la pujada clàssica pel vessant d'Argentona. El sender local SL-C 114, senyalitzat per la Diputació de Barcelona, surt de la plaça de l'Església d'Argentona i fa 3,1 km fins al castell, amb dificultat mitjana; molta gent el comença al parc de la Font Picant, la font de l'antic balneari. Des del parc, un corriol puja cap al sud fins a les Roques Encantades, entre pins pinyers i blocs de roca, passa per sota del turó dels Oriols i acaba per pista fins al castell. Rutes Pirineus hi compta uns 45 minuts sense parades (25 fins a les Roques Encantades i 20 més fins al castell).",
				es: "Es la subida clásica por la vertiente de Argentona. El sendero local SL-C 114, señalizado por la Diputació de Barcelona, sale de la plaça de l'Església de Argentona y tiene 3,1 km hasta el castillo, con dificultad media; mucha gente lo empieza en el parque de la Font Picant, la fuente del antiguo balneario. Desde el parque, un sendero sube hacia el sur hasta las Roques Encantades, entre pinos piñoneros y bloques de roca, pasa por debajo del turó dels Oriols y termina por pista hasta el castillo. Rutes Pirineus calcula unos 45 minutos sin paradas (25 hasta las Roques Encantades y 20 más hasta el castillo)."
			},
			fonts: [DIBA_SLC114, RUTES_PIRINEUS]
		},
		{
			id: 'cabrera-pista',
			nom: {
				ca: 'Des de Cabrera de Mar per la pista forestal',
				es: 'Desde Cabrera de Mar por la pista forestal'
			},
			sortida: { nom: 'Aparcament de terra al final de la rambla de Cabrera de Mar' },
			desnivellPositiuM: 150,
			distanciaKm: 1.2,
			tempsMinuts: 25,
			tecnicitat: 'cap',
			descripcio: {
				ca: "És l'accés més curt i el que fan les famílies. Se surt de l'aparcament de terra que hi ha al final de la rambla de Cabrera de Mar, al costat de la pista forestal, que és tancada als vehicles amb una cadena. Es puja per la pista i després per un camí, amb una última rampa curta i forta, fins al castell. Wild Kids i Festes Majors de Catalunya hi donen uns 2,4–2,5 km i 150 m de desnivell anada i tornada pel mateix camí, és a dir, uns 1,2 km d'anada, que es fan en uns 25 minuts.",
				es: 'Es el acceso más corto y el que hacen las familias. Se sale del aparcamiento de tierra que hay al final de la rambla de Cabrera de Mar, junto a la pista forestal, que está cerrada a los vehículos con una cadena. Se sube por la pista y luego por un camino, con una última rampa corta y fuerte, hasta el castillo. Wild Kids y Festes Majors de Catalunya dan unos 2,4–2,5 km y 150 m de desnivel ida y vuelta por el mismo camino, es decir, unos 1,2 km de ida, que se hacen en unos 25 minutos.'
			},
			fonts: [WILDKIDS, FESTESMAJORS, VIQUIPEDIA]
		},
		{
			id: 'cabrera-circular',
			nom: {
				ca: 'Circular des del centre de Cabrera de Mar pel SL-C 115',
				es: 'Circular desde el centro de Cabrera de Mar por el SL-C 115'
			},
			sortida: { nom: 'Plaça del Poble (Cabrera de Mar)' },
			descripcio: {
				ca: "Per fer-ne una excursió de mig matí sortint del poble. El sender local SL-C 115, senyalitzat per la Diputació de Barcelona, és una circular de 9 km que surt de la plaça del Poble de Cabrera de Mar i puja al castell, amb dificultat mitjana i unes 2 h 30 min de marxa. Turisme Maresme en descriu una versió semblant, de 8,8 km, pel turó dels Oriols i el turó de l'Infern; Viatgeaddictes en proposa una de més curta, de 5,5 km i uns 300 m de desnivell, que passa per la riera de Cabrera.",
				es: "Para hacer una excursión de media mañana saliendo del pueblo. El sendero local SL-C 115, señalizado por la Diputació de Barcelona, es una circular de 9 km que sale de la plaça del Poble de Cabrera de Mar y sube al castillo, con dificultad media y unas 2 h 30 min de marcha. Turisme Maresme describe una versión parecida, de 8,8 km, por el turó dels Oriols y el turó de l'Infern; Viatgeaddictes propone una más corta, de 5,5 km y unos 300 m de desnivel, que pasa por la riera de Cabrera."
			},
			fonts: [DIBA_SLC115, TURISMEMARESME, VIATGEADDICTES]
		}
	],
	consells: {
		ca: [
			'Els caps de setmana l’aparcament proper al castell s’omple: arriba d’hora o puja a peu des del poble.',
			"Abans del castell hi ha una pujada curta però forta, d'uns 50 m de desnivell segons Wild Kids: amb nens petits, ves amb calma i vigila a la baixada.",
			"El castell és un bé cultural protegit: no t'enfilis als murs ni a la torre.",
			"Porta aigua i protecció solar: el camí és curt però al vessant de mar fa calor gran part de l'any.",
			"Segons Festes Majors de Catalunya, s'hi fan visites guiades teatralitzades: consulta'n l'agenda si vols conèixer-ne la història sobre el terreny."
		],
		es: [
			'Los fines de semana el aparcamiento cercano al castillo se llena: llega temprano o sube a pie desde el pueblo.',
			'Antes del castillo hay una subida corta pero fuerte, de unos 50 m de desnivel según Wild Kids: con niños pequeños, ve con calma y vigila en la bajada.',
			'El castillo es un bien cultural protegido: no te subas a los muros ni a la torre.',
			'Lleva agua y protección solar: el camino es corto pero en la vertiente de mar hace calor gran parte del año.',
			'Según Festes Majors de Catalunya, se hacen visitas guiadas teatralizadas: consulta su agenda si quieres conocer la historia sobre el terreno.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al castell de Burriac?',
				resposta:
					"Des del parc de la Font Picant d'Argentona, uns 45 minuts segons Rutes Pirineus. El camí més curt surt de l'aparcament de terra del final de la rambla de Cabrera de Mar: uns 25 minuts per 1,2 km i 150 m de desnivell, segons Wild Kids. La circular del SL-C 115 des del centre de Cabrera fa 9 km i unes 2 h 30 min."
			},
			{
				pregunta: 'Es pot pujar al castell de Burriac amb nens?',
				resposta:
					'Sí, és una de les excursions familiars més conegudes del Maresme. Wild Kids la recomana a partir de 3–4 anys: és curta i per pista i camí, amb només una rampa final més forta.'
			},
			{
				pregunta: 'Es pot entrar al castell de Burriac?',
				resposta:
					"Les restes són a l'aire lliure i es poden veure en arribar al cim: la torre de l'homenatge, la cisterna i la capella. És un bé cultural d'interès nacional, així que cal respectar-ne els murs."
			},
			{
				pregunta: 'El castell de Burriac és un cim essencial?',
				resposta:
					'Sí, és un dels [cims essencials](/cims-essencials) del repte, i amb el [Montalt](/cims/montalt) completa els cims del Maresme.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al castillo de Burriac?',
				resposta:
					'Desde el parque de la Font Picant de Argentona, unos 45 minutos según Rutes Pirineus. El camino más corto sale del aparcamiento de tierra del final de la rambla de Cabrera de Mar: unos 25 minutos para 1,2 km y 150 m de desnivel, según Wild Kids. La circular del SL-C 115 desde el centro de Cabrera tiene 9 km y unas 2 h 30 min.'
			},
			{
				pregunta: '¿Se puede subir al castillo de Burriac con niños?',
				resposta:
					'Sí, es una de las excursiones familiares más conocidas del Maresme. Wild Kids la recomienda a partir de 3–4 años: es corta y por pista y camino, con solo una rampa final más fuerte.'
			},
			{
				pregunta: '¿Se puede entrar en el castillo de Burriac?',
				resposta:
					'Los restos están al aire libre y se pueden ver al llegar a la cima: la torre del homenaje, la cisterna y la capilla. Es un bien cultural de interés nacional, así que hay que respetar sus muros.'
			},
			{
				pregunta: '¿El castillo de Burriac es una cima esencial?',
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) del reto, y con el [Montalt](/cims/montalt) completa las cimas del Maresme.'
			}
		]
	},
	fonts: [
		VIQUIPEDIA,
		DIBA_SLC114,
		DIBA_SLC115,
		RUTES_PIRINEUS,
		WILDKIDS,
		FESTESMAJORS,
		VIATGEADDICTES,
		TURISMEMARESME
	],
	estat: 'esborrany',
	actualitzat: '2026-10-09'
};

export default fitxa;
