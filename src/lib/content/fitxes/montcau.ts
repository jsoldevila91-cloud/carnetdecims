import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-03';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: el Montcau',
	url: 'https://ca.wikipedia.org/wiki/El_Montcau',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: excursió al Montcau amb nens',
	url: 'https://totnens.cat/que-fem/montcau/',
	consultat: CONSULTAT
};

const FEMTURISME = {
	nom: "Femturisme: Montcau i la Mola des del coll d'Estenalles",
	url: 'https://femturisme.cat/en/routes/montcau-and-the-mole-from-the-neck-of-pliers',
	consultat: CONSULTAT
};

const DIBA_ESTENALLES = {
	nom: "Diputació de Barcelona: Centre d'Informació del Coll d'Estenalles",
	url: 'https://parcs.diba.cat/en/web/santllorenc/detall/-/contingut/215256/centre-d-informacio-del-coll-d-estenalles',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: el Montcau i la Mola des del coll d'Estenalles",
	url: 'https://dexcursio.net/montcau-i-la-mola/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'montcau',
	descripcio: {
		ca: [
			"El Montcau és el segon cim més alt del massís de Sant Llorenç del Munt, només superat per [la Mola](/cims/la-mola-de-sant-llorenc-del-munt), que és a uns 4 km. El cim fa de límit entre Mura, [al Bages](/comarques/bages), i Sant Llorenç Savall, al Vallès Occidental, i és dins del Parc Natural de Sant Llorenç del Munt i l'Obac. Mirat des del sud té un aspecte de monòlit rocós, tot i que el cim és una carena allargada de nord a sud.",
			"Segons la Viquipèdia, el nom vindria del llatí i voldria dir «muntanya pelada», una descripció que encaixa amb la roca nua de la part alta. Com tot el massís, és fet de conglomerats i lutites, la mateixa pedra que dona les formes arrodonides, els cingles i les coves de la zona. Al cim hi ha un vèrtex geodèsic i una taula d'orientació que ajuda a identificar el que es veu.",
			"I es veu molt: cap al nord, el Bages i, en dies clars, la serralada del Pirineu; cap al sud, la Mola i la plana del Vallès; i a l'oest, Montserrat. Per la seva proximitat a Terrassa i a Sabadell, és un dels cims del repte més fàcils d'encaixar en una matinal, i combina molt bé amb [Castellsapera](/cims/castellsapera) o amb la mateixa Mola.",
			"No té temporada tancada. A l'estiu, millor a primera hora perquè el camí té poca ombra a la part alta i la roca es reescalfa; després de pluges, el conglomerat pot relliscar. Els caps de setmana l'aparcament del coll d'Estenalles s'omple aviat."
		],
		es: [
			"El Montcau es la segunda cima más alta del macizo de Sant Llorenç del Munt, solo superada por [la Mola](/cims/la-mola-de-sant-llorenc-del-munt), que está a unos 4 km. La cima hace de límite entre Mura, [en el Bages](/comarques/bages), y Sant Llorenç Savall, en el Vallès Occidental, y está dentro del Parque Natural de Sant Llorenç del Munt i l'Obac. Visto desde el sur parece un monolito rocoso, aunque la cima es una cresta alargada de norte a sur.",
			'Según la Viquipèdia, el nombre vendría del latín y significaría «montaña pelada», una descripción que encaja con la roca desnuda de la parte alta. Como todo el macizo, está hecho de conglomerados y lutitas, la misma piedra que da las formas redondeadas, los riscos y las cuevas de la zona. En la cima hay un vértice geodésico y una mesa de orientación que ayuda a identificar lo que se ve.',
			'Y se ve mucho: hacia el norte, el Bages y, en días claros, la cordillera del Pirineo; hacia el sur, la Mola y la llanura del Vallès; y al oeste, Montserrat. Por su cercanía a Terrassa y Sabadell, es una de las cimas del reto más fáciles de encajar en una mañana, y combina muy bien con [Castellsapera](/cims/castellsapera) o con la propia Mola.',
			"No tiene temporada cerrada. En verano, mejor a primera hora porque el camino tiene poca sombra en la parte alta y la roca se recalienta; después de lluvias, el conglomerado puede resbalar. Los fines de semana el aparcamiento del coll d'Estenalles se llena pronto."
		]
	},
	rutes: [
		{
			id: 'estenalles',
			nom: { ca: "Des del coll d'Estenalles", es: "Desde el coll d'Estenalles" },
			sortida: { nom: "Coll d'Estenalles (870 m)" },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "La pujada habitual surt de l'aparcament del coll d'Estenalles, al costat del centre d'informació del parc, a la carretera BV-1221 entre Terrassa i Navarcles. Segueix el sender local SL-C 54, primer per una pista i després per un corriol que s'enfila per la carena sud-oest fins al cim, uns 190 m per sobre del coll. L'últim tram és rocós i més dret, amb alguna grimpada curta i sense gaire dificultat (segons Femturisme): cal mirar on es posen els peus.",
				es: "La subida habitual sale del aparcamiento del coll d'Estenalles, junto al centro de información del parque, en la carretera BV-1221 entre Terrassa y Navarcles. Sigue el sendero local SL-C 54, primero por una pista y luego por una senda que sube por la cresta suroeste hasta la cima, unos 190 m por encima del collado. El último tramo es rocoso y más empinado, con alguna trepada corta y sin mucha dificultad (según Femturisme): hay que mirar dónde se ponen los pies."
			},
			fonts: [VIQUIPEDIA, FEMTURISME, DIBA_ESTENALLES, TOTNENS, DEXCURSIO]
		},
		{
			id: 'estenalles-la-mola',
			nom: {
				ca: "Encadenat amb la Mola pel coll d'Eres",
				es: "Encadenado con la Mola por el coll d'Eres"
			},
			sortida: { nom: "Coll d'Estenalles (870 m)" },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Des del Montcau, el mateix SL-C 54 baixa al coll d'Eres i continua per la carena, entre alzinars, fins al monestir de la Mola. Anada i tornada són uns 12 km i 501 m de desnivell, unes 3–4 h segons el ritme, segons Femturisme. A la tornada es pot estalviar la segona pujada al Montcau.",
				es: "Desde el Montcau, el mismo SL-C 54 baja al coll d'Eres y sigue por la cresta, entre encinares, hasta el monasterio de la Mola. Ida y vuelta son unos 12 km y 501 m de desnivel, unas 3–4 h según el ritmo, según Femturisme. A la vuelta se puede evitar la segunda subida al Montcau."
			},
			fonts: [FEMTURISME, TOTNENS, DEXCURSIO]
		}
	],
	consells: {
		ca: [
			"Arriba d'hora: l'aparcament del coll d'Estenalles és petit per a la gent que hi va els caps de setmana.",
			"Al centre d'informació del coll d'Estenalles et poden orientar sobre els camins i l'estat del parc.",
			'Porta aigua: al camí del cim no hi ha fonts fiables.',
			"Amb nens petits, vigila l'últim tram de roca i els corriols estrets que passen arran de cingle si fas la circular per les coves.",
			'Si plou o acaba de ploure, el conglomerat rellisca molt: extrema la prudència a la baixada.'
		],
		es: [
			"Llega temprano: el aparcamiento del coll d'Estenalles es pequeño para la gente que va los fines de semana.",
			"En el centro de información del coll d'Estenalles te pueden orientar sobre los caminos y el estado del parque.",
			'Lleva agua: en el camino de la cima no hay fuentes fiables.',
			'Con niños pequeños, vigila el último tramo de roca y las sendas estrechas que pasan junto al cortado si haces la circular por las cuevas.',
			'Si llueve o acaba de llover, el conglomerado resbala mucho: extrema la prudencia en la bajada.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Montcau?',
				resposta:
					"Des del coll d'Estenalles és una pujada curta: el cim és només uns 190 m més amunt. Totnens proposa una circular de 6 km que un adult fa en unes 2 h sense parades i que amb nens, visitant coves, s'allarga fins a unes 4 h."
			},
			{
				pregunta: 'Es pot pujar al Montcau amb nens?',
				resposta:
					'Sí, és una de les pujades més habituals per estrenar-se al repte amb canalla. Només cal anar amb compte al tram final, més rocós, i als corriols estrets si es fa la volta per les coves.'
			},
			{
				pregunta: 'Es poden fer el Montcau i la Mola el mateix dia?',
				resposta:
					"Sí, és una combinació clàssica. Des del coll d'Estenalles, el sender SL-C 54 passa pel Montcau i continua fins a [la Mola](/cims/la-mola-de-sant-llorenc-del-munt); anada i tornada són uns 12 km segons Femturisme."
			},
			{
				pregunta: 'El Montcau és un cim essencial?',
				resposta:
					'Sí. És un dels tres essencials del Bages, amb l’Elefant (Roca de Sant Salvador) i el Collbaix. Tot i compartir parc amb [la Mola](/cims/la-mola-de-sant-llorenc-del-munt), compta per al Bages i no per al Vallès Occidental.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Montcau?',
				resposta:
					"Desde el coll d'Estenalles es una subida corta: la cima está solo unos 190 m más arriba. Totnens propone una circular de 6 km que un adulto hace en unas 2 h sin paradas y que con niños, visitando cuevas, se alarga hasta unas 4 h."
			},
			{
				pregunta: '¿Se puede subir al Montcau con niños?',
				resposta:
					'Sí, es una de las subidas más habituales para estrenarse en el reto con niños. Solo hay que ir con cuidado en el tramo final, más rocoso, y en las sendas estrechas si se hace la vuelta por las cuevas.'
			},
			{
				pregunta: '¿Se pueden hacer el Montcau y la Mola el mismo día?',
				resposta:
					"Sí, es una combinación clásica. Desde el coll d'Estenalles, el sendero SL-C 54 pasa por el Montcau y sigue hasta [la Mola](/cims/la-mola-de-sant-llorenc-del-munt); ida y vuelta son unos 12 km según Femturisme."
			},
			{
				pregunta: '¿El Montcau es una cima esencial?',
				resposta:
					'Sí. Es una de las tres esenciales del Bages, con l’Elefant (Roca de Sant Salvador) y el Collbaix. Aunque comparte parque con [la Mola](/cims/la-mola-de-sant-llorenc-del-munt), cuenta para el Bages y no para el Vallès Occidental.'
			}
		]
	},
	wikiloc: [
		{
			id: 7893825,
			titol: "Coll d'Estenalles - Montcau - Coll d'Eres",
			url: 'https://ca.wikiloc.com/rutes-a-peu/coll-destenalles-montcau-coll-deres-7893825'
		},
		{
			id: 28755429,
			titol: "Montcau desde el Coll d'Estenalles",
			url: 'https://ca.wikiloc.com/rutes-senderisme/montcau-desde-el-coll-destenalles-28755429'
		}
	],
	fonts: [VIQUIPEDIA, TOTNENS, FEMTURISME, DEXCURSIO, DIBA_ESTENALLES],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
