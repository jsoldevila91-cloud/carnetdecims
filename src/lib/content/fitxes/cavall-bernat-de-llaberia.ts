import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA_SERRA = {
	nom: 'Viquipèdia: Serra de Llaberia',
	url: 'https://ca.wikipedia.org/wiki/Serra_de_Llaberia',
	consultat: CONSULTAT
};

const TRES_CAT = {
	nom: 'CCMA (3Cat): Caminada de descoberta per Llaberia, la muntanya perduda a tocar de la costa',
	url: 'https://www.3cat.cat/3catinfo/caminada-de-descoberta-per-llaberia-la-muntanya-perduda-a-tocar-de-la-costa/noticia-amp/3414288/',
	consultat: CONSULTAT
};

const CESC = {
	nom: 'Centre Excursionista de Sant Celoni: sortida «La Mola de Colldejou i la Serra de Llaberia» (butlletí març-abril 2015)',
	url: 'https://santceloni.cat/ARXIUS/agenda/2015/20150322_MUNTANYA.pdf',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Cavall Bernat de Llaberia',
	url: 'https://reptesmuntanyencs.cat/cavall-bernat-de-llaberia/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'cavall-bernat-de-llaberia',
	descripcio: {
		ca: [
			'El Cavall Bernat de Llaberia és un dels cims de la serra de Llaberia, al límit dels termes de Colldejou i de Pratdip, [al Baix Camp](/comarques/baix-camp). La Viquipèdia situa la serra entre les Muntanyes de Prades i les Muntanyes de Tivissa-Vandellòs i la descriu pels cingles calcaris molt regulars i clars. Hi dominen les calcàries, les margues i les dolomies del Triàsic i el Juràssic, amb un encavalcament geològic visible a Pratdip, Llaberia i Colldejou.',
			"Llaberia és espai protegit des que el Decret 328/1992 la va incorporar al PEIN, i el Consorci de la Serra de Llaberia, creat el 30 d'abril del 2004, en gestiona la conservació, la prevenció d'incendis i l'educació ambiental. Al reportatge de 3Cat sobre una caminada de descoberta, una tècnica del Consorci en destaca el gran valor geològic, i el mitjà afegeix que Llaberia té el klippe més gran de Catalunya. Aquest reportatge puja a la Miranda, el punt més alt de la serra, marcat pel radar del Servei Meteorològic de Catalunya.",
			"El Cavall Bernat és un altre dels cims del repte, tal com ho anota el butlletí del Centre Excursionista de Sant Celoni. El mateix text avisa que pujar-hi és opcional perquè cal pujar una forta canal i un darrer tram de grimpada de 2n grau. Per això aquest cim no es tracta com una excursió de camí: tens bones raons per fer-lo acompanyat i amb un mínim d'experiència de roca. El bloc Reptes Muntanyencs, que hi va pujar el març del 2016, havia llegit que aquest no era un cim per fer en solitari.",
			"El Centre Excursionista de Sant Celoni afirma que des d'aquests cims es pot veure tota la costa de Tarragona, i avisa que és un lloc on sol fer una mica de vent, així que convé portar roba d'abric."
		],
		es: [
			'El Cavall Bernat de Llaberia es una de las cimas de la sierra de Llaberia, en el límite de los términos de Colldejou y de Pratdip, [en el Baix Camp](/comarques/baix-camp). La Viquipèdia sitúa la sierra entre las Muntanyes de Prades y las Muntanyes de Tivissa-Vandellòs y la describe por sus riscos calizos muy regulares y claros. Dominan las calizas, las margas y las dolomías del Triásico y el Jurásico, con un cabalgamiento geológico visible en Pratdip, Llaberia y Colldejou.',
			'Llaberia es espacio protegido desde que el Decreto 328/1992 la incorporó al PEIN, y el Consorci de la Serra de Llaberia, creado el 30 de abril de 2004, gestiona su conservación, la prevención de incendios y la educación ambiental. En el reportaje de 3Cat sobre una caminata de descubrimiento, una técnica del Consorci destaca su gran valor geológico, y el medio añade que Llaberia tiene el klippe más grande de Catalunya. Ese reportaje sube a la Miranda, el punto más alto de la sierra, marcado por el radar del Servei Meteorològic de Catalunya.',
			'El Cavall Bernat es otra de las cimas del reto, tal como lo anota el boletín del Centre Excursionista de Sant Celoni. El mismo texto avisa de que subir es opcional porque hay que remontar una fuerte canal y un último tramo de trepada de 2.º grado. Por eso esta cima no se trata como una excursión de camino: tienes buenas razones para hacerla acompañado y con un mínimo de experiencia de roca. El blog Reptes Muntanyencs, que subió en marzo de 2016, había leído que esta no era una cima para hacer en solitario.',
			'El Centre Excursionista de Sant Celoni afirma que desde estas cimas se puede ver toda la costa de Tarragona, y avisa de que es un lugar donde suele hacer algo de viento, así que conviene llevar ropa de abrigo.'
		]
	},
	rutes: [
		{
			id: 'colldejou-circular',
			nom: {
				ca: 'Circular des de Colldejou pel GR 7 i el camí del Recingle',
				es: 'Circular desde Colldejou por el GR 7 y el camí del Recingle'
			},
			sortida: { nom: 'Zona esportiva de Colldejou' },
			tecnicitat: 'grimpada',
			descripcio: {
				ca: "Segons Reptes Muntanyencs, és una circular de 11,8 km i uns 618 m de desnivell positiu que surt de l'aparcament de la zona esportiva de Colldejou, enllaça amb el GR 7 i puja pel camí del Recingle (pintura blava). El cim queda a uns 7,2 km de la sortida. La part final inclou una canal estreta amb una cadena i un ressalt de dos o tres metres «força verticals», una mica sortint a la part superior; el bloc la marca amb dificultat de progressió «cal grimpar». La baixada passa per la Foradada i enllaça amb el PR C-96 fins a Colldejou.",
				es: 'Según Reptes Muntanyencs, es una circular de 11,8 km y unos 618 m de desnivel positivo que sale del aparcamiento de la zona deportiva de Colldejou, enlaza con el GR 7 y sube por el camí del Recingle (pintura azul). La cima queda a unos 7,2 km de la salida. La parte final incluye una canal estrecha con una cadena y un resalte de dos o tres metros «bastante verticales», algo desplomado en la parte superior; el blog la marca con dificultad de progresión «hay que trepar». La bajada pasa por la Foradada y enlaza con el PR C-96 hasta Colldejou.'
			},
			fonts: [REPTES, CESC]
		},
		{
			id: 'carena-de-llaberia',
			nom: {
				ca: 'Per la carena de Llaberia i el coll dels Covaldissos (sortida del CESC)',
				es: 'Por la cresta de Llaberia y el coll dels Covaldissos (salida del CESC)'
			},
			sortida: { nom: 'Colldejou' },
			tecnicitat: 'grimpada',
			descripcio: {
				ca: "Una sortida del Centre Excursionista de Sant Celoni del 2015 feia una circular de 18 km i uns 1.200 m de desnivell, d'unes 8 a 9 h, que sortia de Colldejou pel GR 7 i el GR 7.3 cap a la Mola de Colldejou, seguia el GR 7 fins al Portell de Llaberia i la carena fins a la Miranda, la Creu de Llaberia, el Mont-redon i, finalment, el Cavall Bernat. El club en feia opcional la pujada: «s'ha de pujar una forta canal i un últim tram de grimpada de 2n». La baixada va pel coll dels Covaldissos, on s'enllaça amb el camí ral de Colldejou a Pratdip fins al poble. Aquestes xifres són del circuit complet i no només fins al Cavall Bernat.",
				es: 'Una salida del Centre Excursionista de Sant Celoni de 2015 hacía una circular de 18 km y unos 1.200 m de desnivel, de unas 8 a 9 h, que salía de Colldejou por el GR 7 y el GR 7.3 hacia la Mola de Colldejou, seguía el GR 7 hasta el Portell de Llaberia y la cresta hasta la Miranda, la Creu de Llaberia, el Mont-redon y, por último, el Cavall Bernat. El club hacía opcional la subida: «hay que remontar una fuerte canal y un último tramo de trepada de 2.º». La bajada va por el coll dels Covaldissos, donde se enlaza con el camí ral de Colldejou a Pratdip hasta el pueblo. Estas cifras son del circuito completo y no solo hasta el Cavall Bernat.'
			},
			fonts: [CESC]
		}
	],
	consells: {
		ca: [
			'No facis aquest cim sol: el bloc havia llegit que no era per fer en solitari, i el CESC en fa opcional la pujada per la forta canal i el tram final de grimpada.',
			"La canal té una cadena i, més amunt, un ressalt vertical de dos o tres metres: calcula'n el temps i no t'hi apressis.",
			"El CESC recomana bastons, llum frontal, esmorzar i dinar i beure suficient per passar el dia, calçat de muntanya, ulleres de sol, crema solar i roba d'abric; l'estona de carena sol fer vent.",
			'El bloc indica pintura blava al camí del Recingle, pintura groga al PR C-96 i la senyalització pròpia del GR 7; als trams alts, fites i un pal indicador, però alguns encreuaments demanen atenció.',
			"Llaberia és un espai protegit i el Consorci hi treballa en prevenció d'incendis: no deixis residus i no facis foc."
		],
		es: [
			'No hagas esta cima solo: el blog había leído que no era para hacer en solitario, y el CESC hace opcional la subida por la fuerte canal y el tramo final de trepada.',
			'La canal tiene una cadena y, más arriba, un resalte vertical de dos o tres metros: calcula el tiempo y no te apresures.',
			'El CESC recomienda bastones, luz frontal, desayuno y comida y beber lo suficiente para pasar el día, calzado de montaña, gafas de sol, crema solar y ropa de abrigo; en la cresta suele hacer viento.',
			'El blog indica pintura azul en el camí del Recingle, pintura amarilla en el PR C-96 y la señalización propia del GR 7; en los tramos altos, hitos y un poste indicador, pero algunos cruces piden atención.',
			'Llaberia es un espacio protegido y el Consorci trabaja allí en prevención de incendios: no dejes residuos y no hagas fuego.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Cavall Bernat?',
				resposta:
					'Segons Reptes Muntanyencs, en una circular de 11,8 km des de Colldejou, el cim queda a uns 7,2 km de la sortida; el bloc hi dedica 3 h 47 min de marxa efectiva en total. El circuit més llarg del CESC, de 18 km, durava unes 8 a 9 h.'
			},
			{
				pregunta: 'Cal grimpar per pujar al Cavall Bernat?',
				resposta:
					"Sí. El bloc ho anota com a «cal grimpar» i el CESC parla d'una forta canal i d'un darrer tram de grimpada de 2n. Hi ha una cadena a la canal i un ressalt vertical de dos o tres metres."
			},
			{
				pregunta: 'Es pot fer sol?',
				resposta:
					'El bloc havia llegit que no era un cim per fer en solitari, i el CESC en fa opcional la pujada. Millor anar-hi acompanyat.'
			},
			{
				pregunta: 'El Cavall Bernat compta com a cim essencial?',
				resposta:
					'Sí. A prop hi ha la [Mola de Colldejou](/cims/mola-de-colldejou) i el [Puig de la Cabrafiga](/cims/puig-de-la-cabrafiga), també cims essencials del Baix Camp.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Cavall Bernat?',
				resposta:
					'Según Reptes Muntanyencs, en una circular de 11,8 km desde Colldejou, la cima queda a unos 7,2 km de la salida; el blog dedica 3 h 47 min de marcha efectiva en total. El circuito más largo del CESC, de 18 km, duraba unas 8 a 9 h.'
			},
			{
				pregunta: '¿Hay que trepar para subir al Cavall Bernat?',
				resposta:
					'Sí. El blog lo anota como «hay que trepar» y el CESC habla de una fuerte canal y de un último tramo de trepada de 2.º. Hay una cadena en la canal y un resalte vertical de dos o tres metros.'
			},
			{
				pregunta: '¿Se puede hacer solo?',
				resposta:
					'El blog había leído que no era una cima para hacer en solitario, y el CESC hace opcional la subida. Mejor ir acompañado.'
			},
			{
				pregunta: '¿El Cavall Bernat cuenta como cima esencial?',
				resposta:
					'Sí. Cerca están la [Mola de Colldejou](/cims/mola-de-colldejou) y el [Puig de la Cabrafiga](/cims/puig-de-la-cabrafiga), también cimas esenciales del Baix Camp.'
			}
		]
	},
	fonts: [VIQUIPEDIA_SERRA, TRES_CAT, CESC, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
