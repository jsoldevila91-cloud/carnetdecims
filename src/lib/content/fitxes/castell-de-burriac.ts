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
				ca: "Des de l'aparcament de la Font Picant (Cabrera de Mar)",
				es: 'Desde el aparcamiento de la Font Picant (Cabrera de Mar)'
			},
			sortida: { nom: 'Aparcament de la Font Picant (Cabrera de Mar)' },
			desnivellPositiuM: 150,
			distanciaKm: 1.2,
			tempsMinuts: 25,
			tecnicitat: 'cap',
			descripcio: {
				ca: "És l'accés més curt i el que fan les famílies. Es puja per una pista de terra i després per un camí, amb una última rampa curta i forta, fins al castell. Wild Kids i Festes Majors de Catalunya hi donen uns 2,4–2,5 km i 150 m de desnivell anada i tornada pel mateix camí, és a dir, uns 1,2 km d'anada, que es fan en uns 25 minuts.",
				es: 'Es el acceso más corto y el que hacen las familias. Se sube por una pista de tierra y luego por un camino, con una última rampa corta y fuerte, hasta el castillo. Wild Kids y Festes Majors de Catalunya dan unos 2,4–2,5 km y 150 m de desnivel ida y vuelta por el mismo camino, es decir, unos 1,2 km de ida, que se hacen en unos 25 minutos.'
			},
			fonts: [WILDKIDS, FESTESMAJORS, VIQUIPEDIA]
		},
		{
			id: 'cabrera-circular',
			nom: {
				ca: "Circular des de la plaça de l'Església de Cabrera de Mar",
				es: "Circular desde la plaça de l'Església de Cabrera de Mar"
			},
			sortida: { nom: "Plaça de l'Església (Cabrera de Mar)" },
			descripcio: {
				ca: 'Per fer-ne una excursió de mig matí sortint del poble. Viatgeaddictes hi descriu un circuit de 5,5 km i uns 300 m de desnivell, d’1 h 40 min de marxa i dificultat baixa, que passa per la Font Picant i la riera de Cabrera. Turisme Maresme en proposa una versió més llarga, de 8,8 km, pel turó dels Oriols i el turó de l’Infern.',
				es: 'Para hacer una excursión de media mañana saliendo del pueblo. Viatgeaddictes describe un circuito de 5,5 km y unos 300 m de desnivel, de 1 h 40 min de marcha y dificultad baja, que pasa por la Font Picant y la riera de Cabrera. Turisme Maresme propone una versión más larga, de 8,8 km, por el turó dels Oriols y el turó de l’Infern.'
			},
			fonts: [VIATGEADDICTES, TURISMEMARESME]
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
					"Des de l'aparcament de la Font Picant, uns 25 minuts per 1,2 km i 150 m de desnivell, segons Wild Kids. Des de la plaça de l'Església de Cabrera, la circular de Viatgeaddictes són 5,5 km i 1 h 40 min en total."
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
					'Desde el aparcamiento de la Font Picant, unos 25 minutos para 1,2 km y 150 m de desnivel, según Wild Kids. Desde la plaça de l’Església de Cabrera, la circular de Viatgeaddictes son 5,5 km y 1 h 40 min en total.'
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
	fonts: [VIQUIPEDIA, WILDKIDS, FESTESMAJORS, VIATGEADDICTES, TURISMEMARESME],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
