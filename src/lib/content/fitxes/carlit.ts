import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Carlit',
	url: 'https://ca.wikipedia.org/wiki/Carlit',
	consultat: CONSULTAT
};

const VIQUIPEDIA_MASSIS = {
	nom: 'Viquipèdia: massís del Carlit',
	url: 'https://ca.wikipedia.org/wiki/Mass%C3%ADs_del_Carlit',
	consultat: CONSULTAT
};

const TOPOPYRENEES = {
	nom: 'Topopyrénées: randonnée Pic Carlit (2921 m)',
	url: 'https://www.topopyrenees.com/randonnee-pic-carlit-2921m/',
	consultat: CONSULTAT
};

const DECATHLON_OUTDOOR = {
	nom: 'Decathlon Outdoor: Pic Carlit, randonnée au sommet des Pyrénées-Orientales',
	url: 'https://www.decathlon-outdoor.com/fr-fr/inspire/france/randonnee-pic-carlit',
	consultat: CONSULTAT
};

const MUNTANYA_I_NATURA = {
	nom: 'Muntanya i Natura: ascensió al Carlit des de les Bulloses',
	url: 'https://www.muntanyainatura.org/en/rutes/guiades/ascensio-carlit-des-de-les-bulloses',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'carlit',
	descripcio: {
		ca: [
			"El Carlit (Pic Carlit o Pica del Carlit; pic Carlit en francès) és el cim més alt de tota la Cerdanya i de la [Catalunya Nord](/comarques/catalunya-nord). És al terme d'Angostrina i Vilanova de les Escaldes, a l'Alta Cerdanya, i dona nom a un massís granític que fa de frontera natural entre la Cerdanya i el Capcir, al sud, i les terres occitanes del nord. Del seu entorn neixen tres aigües: l'Aravó a ponent, la Tet a llevant, en un circ glacial, i el riu d'Angostrina al sud.",
			"El que fa únic el Carlit és l'altiplà d'estanys que s'estén als seus peus. L'aproximació clàssica des de les Bulloses passa per una corrua de llacs d'origen glacial (el Viver, les Dugues, els Trebens, el Sobirà…) abans d'enfilar-se pel con final de granit. També té una història curiosa: tot i que sovint es cita l'ascensió de Henry Russell el 1864, el 1611 ja hi havia pujat el clergue Joan Trigall en una expedició científica. Sobre l'origen del nom no hi ha acord: Joan Coromines el relaciona amb un «desert de cards», i altres autors li busquen un origen basc.",
			"Com que no té cap cim més alt al voltant, la vista és immensa: el Canigó a llevant, la serra del Cadí i la Pica d'Estats al sud-oest i, en dies clars, el Mont Valier, ja a l'Arieja. Als peus queden els estanys del massís, i al nord-est el veí [Puig Peric](/cims/puig-peric), un altre cim del repte.",
			"La temporada bona va de juny a octubre. A principis d'estiu pot quedar neu a les canals del con final i, a l'hivern, és una ascensió d'alta muntanya. Al juliol i a l'agost hi puja molta gent, i les tempestes de tarda són freqüents: cal sortir d'hora."
		],
		es: [
			'El Carlit (Pic Carlit o Pica del Carlit; pic Carlit en francés) es la cima más alta de toda la Cerdaña y de la [Cataluña Norte](/comarques/catalunya-nord). Está en el municipio de Angostrina i Vilanova de les Escaldes, en la Alta Cerdaña, y da nombre a un macizo granítico que hace de frontera natural entre la Cerdaña y el Capcir, al sur, y las tierras occitanas del norte. De su entorno nacen tres ríos: el Aravó al oeste, el Tet al este, en un circo glaciar, y el río de Angostrina al sur.',
			'Lo que hace único al Carlit es la altiplanicie de lagos que se extiende a sus pies. La aproximación clásica desde les Bulloses pasa por una sucesión de lagos de origen glaciar (el Viver, les Dugues, els Trebens, el Sobirà…) antes de subir por el cono final de granito. También tiene una historia curiosa: aunque a menudo se cita la ascensión de Henry Russell en 1864, en 1611 ya había subido el clérigo Joan Trigall en una expedición científica. Sobre el origen del nombre no hay acuerdo: Joan Coromines lo relaciona con un «desierto de cardos», y otros autores le buscan un origen vasco.',
			"Como no tiene ninguna cima más alta alrededor, la vista es inmensa: el Canigó al este, la sierra del Cadí y la Pica d'Estats al suroeste y, en días claros, el Mont Valier, ya en el Ariège. A los pies quedan los lagos del macizo, y al noreste el vecino [Puig Peric](/cims/puig-peric), otra cima del reto.",
			'La buena temporada va de junio a octubre. A principios de verano puede quedar nieve en las canales del cono final y, en invierno, es una ascensión de alta montaña. En julio y agosto sube mucha gente, y las tormentas de tarde son frecuentes: hay que salir temprano.'
		]
	},
	rutes: [
		{
			id: 'bulloses',
			nom: { ca: 'Des de la presa de les Bulloses', es: 'Desde la presa de les Bulloses' },
			sortida: { nom: 'Presa de les Bulloses (Angostrina i Vilanova de les Escaldes)' },
			desnivellPositiuM: 975,
			distanciaKm: 7.4,
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "De la presa, un sender ben marcat travessa l'altiplà passant per l'estany Negre, els Trebens i el Sobirà, fins a un petit estany a uns 2.600 m. Allà el paisatge es torna mineral i el pendent s'accentua per un pedregar fins al con final, on, segons Topopyrénées i Decathlon Outdoor, cal posar de tant en tant les mans al granit en uns passos fàcils però una mica exposats. Anada i tornada pel mateix camí són uns 14–15 km i uns 1.000 m de desnivell.",
				es: 'Desde la presa, un sendero bien marcado cruza la altiplanicie pasando por el estany Negre, els Trebens y el Sobirà, hasta un pequeño lago a unos 2.600 m. Allí el paisaje se vuelve mineral y la pendiente se acentúa por un pedregal hasta el cono final, donde, según Topopyrénées y Decathlon Outdoor, hay que poner de vez en cuando las manos en el granito en unos pasos fáciles pero algo expuestos. Ida y vuelta por el mismo camino son unos 14–15 km y unos 1.000 m de desnivel.'
			},
			fonts: [DECATHLON_OUTDOOR, TOPOPYRENEES, MUNTANYA_I_NATURA]
		}
	],
	consells: {
		ca: [
			"Al juliol i a l'agost la carretera de la presa de les Bulloses està tancada als cotxes de 7 a 19 h: cal aparcar al Pla de Barrès i pujar amb la llançadora. Fora d'aquests mesos s'hi pot arribar en cotxe.",
			"Surt d'hora: l'excursió completa són unes 6–7 h i les tempestes d'estiu arriben sovint a la tarda.",
			'Al con final, amb vertigen o amb neu tardana, val més girar cua: els passos són fàcils però exposats i el terreny és pedregós.',
			"Si a principis d'estiu queda neu al tram final, cal crampons i experiència.",
			"L'altiplà dels estanys és molt freqüentat a l'estiu: no surtis dels senders, no acampis fora de les zones permeses i emporta't les deixalles."
		],
		es: [
			'En julio y agosto la carretera de la presa de les Bulloses está cerrada a los coches de 7 a 19 h: hay que aparcar en el Pla de Barrès y subir en lanzadera. Fuera de esos meses se puede llegar en coche.',
			'Sal temprano: la excursión completa son unas 6–7 h y las tormentas de verano llegan a menudo por la tarde.',
			'En el cono final, con vértigo o con nieve tardía, mejor darse la vuelta: los pasos son fáciles pero expuestos y el terreno es pedregoso.',
			'Si a principios de verano queda nieve en el tramo final, hacen falta crampones y experiencia.',
			'La altiplanicie de los lagos está muy frecuentada en verano: no salgas de los senderos, no acampes fuera de las zonas permitidas y llévate la basura.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Carlit des de les Bulloses?',
				resposta:
					'Decathlon Outdoor calcula unes 7 h anada i tornada per a 14,9 km i 975 m de desnivell, i Topopyrénées unes 6 h 30 min per a 14 km i uns 1.000 m. Compta més de la meitat del temps per a la pujada.'
			},
			{
				pregunta: 'El Carlit és difícil?',
				resposta:
					"No té passos de grimpada continuada, però els últims metres del con final demanen posar les mans en alguns passos fàcils i una mica exposats, i el desnivell és important. Cal experiència bàsica d'alta muntanya i no tenir vertigen."
			},
			{
				pregunta: "Com s'arriba a les Bulloses a l'estiu?",
				resposta:
					"Al juliol i a l'agost no es pot pujar en cotxe fins a la presa entre les 7 i les 19 h. Cal deixar el cotxe al Pla de Barrès i agafar la llançadora; fora d'aquest horari o d'aquests mesos, la carretera és oberta."
			},
			{
				pregunta: 'El Carlit compta com a cim essencial?',
				resposta:
					'Sí, és un dels [cims essencials](/cims-essencials) del repte, el sostre de la Catalunya Nord i un dels [cims més alts del repte](/cims-mes-alts).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Carlit desde les Bulloses?',
				resposta:
					'Decathlon Outdoor calcula unas 7 h ida y vuelta para 14,9 km y 975 m de desnivel, y Topopyrénées unas 6 h 30 min para 14 km y unos 1.000 m. Cuenta con más de la mitad del tiempo para la subida.'
			},
			{
				pregunta: '¿El Carlit es difícil?',
				resposta:
					'No tiene pasos de trepada continuada, pero los últimos metros del cono final exigen poner las manos en algunos pasos fáciles y algo expuestos, y el desnivel es importante. Hace falta experiencia básica de alta montaña y no tener vértigo.'
			},
			{
				pregunta: '¿Cómo se llega a les Bulloses en verano?',
				resposta:
					'En julio y agosto no se puede subir en coche hasta la presa entre las 7 y las 19 h. Hay que dejar el coche en el Pla de Barrès y coger la lanzadera; fuera de ese horario o de esos meses, la carretera está abierta.'
			},
			{
				pregunta: '¿El Carlit cuenta como cima esencial?',
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) del reto, el techo de la Cataluña Norte y una de las [cimas más altas del reto](/cims-mes-alts).'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_MASSIS, DECATHLON_OUTDOOR, TOPOPYRENEES, MUNTANYA_I_NATURA],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
