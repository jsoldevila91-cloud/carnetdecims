import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Gran Tuc de Colomèrs',
	url: 'https://ca.wikipedia.org/wiki/Gran_Tuc_de_Colomers',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Gran Tuc de Colomèrs',
	url: 'https://reptesmuntanyencs.cat/gran-tuc-de-colomers/',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: Refugi de Colomers",
	url: 'https://dexcursio.net/refugi-de-colomers/',
	consultat: CONSULTAT
};

const VISIT_ARAN = {
	nom: 'Visit Val d’Aran: ascensió al Gran Tuc de Colomèrs',
	url: 'https://www.visitvaldaran.com/en/item/gran-tuc-colomers/',
	consultat: CONSULTAT
};

const CONSELH = {
	nom: "Conselh Generau d'Aran: regulació d'accessos al medi natural, estiu 2025",
	url: 'https://www.conselharan.org/ca/el-conselh-generau-activa-el-calendari-de-regulacio-daccessos-al-medi-natural-per-a-lestiu-de-2025/',
	consultat: CONSULTAT
};

const PARC_FAQ = {
	nom: 'Parc Nacional d’Aigüestortes i Estany de Sant Maurici: preguntes freqüents',
	url: 'https://parcsnaturals.gencat.cat/ca/xarxa-de-parcs/aiguestortes/preguntes-frequents/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'gran-tuc-de-colomers',
	descripcio: {
		ca: [
			"El Gran Tuc de Colomèrs és un cim de tres comarques: s'alça al límit dels termes de la Vall de Boí ([Alta Ribagorça](/comarques/alta-ribagorca)), d'Espot (Pallars Sobirà) i de Naut Aran (Val d'Aran), dins del Parc Nacional d'Aigüestortes i Estany de Sant Maurici. És granit i fa de nus de les carenes de la vall de Contraix, de Colomers d'Espot i del circ de Colomèrs. El vèrtex geodèsic marca el punt més alt, de 2.933,4 m, amb una prominència de 185 m, segons la Viquipèdia.",
			"La gràcia de la pujada és el paisatge que s'ha de creuar. Pel costat aranès, Visit Val d'Aran la presenta com una ascensió per una zona d'estanys excepcional i avisa que és fàcil trobar-hi neu en qualsevol època de l'any. L'itinerari clàssic passa pel refugi de Colomèrs, a 2.135 m, i travessa un circ glacial ple d'estanys i grans pedregams. Reptes Muntanyencs el va fer en dos dies, dormint al refugi.",
			"No hi ha un sender senyalitzat fins al cim. Segons Reptes Muntanyencs, entre l'estanh Gelat i el pas cap al cim no hi ha senyalització oficial i cal guiar-se per fites; la pujada s'enfila per una canal amb una grimpada curta i fàcil per superar una roca gran, i la tornada es fa pel portau de Colomèrs, per una canal de blocs que l'autor baixa amb molta cura. El dia que hi va pujar, el vent del cim no convidava a quedar-s'hi gaire.",
			"La temporada habitual és l'estiu, quan l'accés en vehicle privat a la ribèra d'Aiguamòg està regulat pel Conselh Generau d'Aran (el 2025, del 15 de juny al 15 de setembre) i hi funciona un servei de taxis que acosta al refugi. Les dates canvien cada any: consulta la regulació vigent abans d'anar-hi. Dins del parc nacional estan prohibits l'acampada i el bivac, i els gossos han d'anar lligats."
		],
		es: [
			'El Gran Tuc de Colomèrs es una cima de tres comarcas: se alza en el límite de los términos de la Vall de Boí ([Alta Ribagorça](/comarques/alta-ribagorca)), de Espot (Pallars Sobirà) y de Naut Aran (Val d’Aran), dentro del Parque Nacional de Aigüestortes i Estany de Sant Maurici. Es granito y hace de nudo de las crestas del valle de Contraix, de Colomers d’Espot y del circo de Colomèrs. El vértice geodésico marca el punto más alto, de 2.933,4 m, con una prominencia de 185 m, según la Viquipèdia.',
			'La gracia de la subida es el paisaje que hay que cruzar. Por el lado aranés, Visit Val d’Aran la presenta como una ascensión por una zona de lagos excepcional y avisa de que es fácil encontrar nieve en cualquier época del año. El itinerario clásico pasa por el refugio de Colomèrs, a 2.135 m, y cruza un circo glaciar lleno de lagos y grandes pedreras. Reptes Muntanyencs lo hizo en dos días, durmiendo en el refugio.',
			'No hay un sendero señalizado hasta la cima. Según Reptes Muntanyencs, entre el estanh Gelat y el paso hacia la cima no hay señalización oficial y hay que guiarse por hitos; la subida remonta una canal con una trepada corta y fácil para superar una roca grande, y la vuelta se hace por el portau de Colomèrs, por una canal de bloques que el autor baja con mucho cuidado. El día que subió, el viento de la cima no invitaba a quedarse mucho.',
			"La temporada habitual es el verano, cuando el acceso en vehículo privado a la ribèra d'Aiguamòg está regulado por el Conselh Generau d’Aran (en 2025, del 15 de junio al 15 de septiembre) y funciona un servicio de taxis que acerca al refugio. Las fechas cambian cada año: consulta la regulación vigente antes de ir. Dentro del parque nacional están prohibidos la acampada y el vivac, y los perros deben ir atados."
		]
	},
	rutes: [
		{
			id: 'banhs-de-tredos',
			nom: {
				ca: 'Des dels Banhs de Tredòs pel refugi de Colomèrs',
				es: 'Desde los Banhs de Tredòs por el refugio de Colomèrs'
			},
			sortida: { nom: 'Aparcament dels Banhs de Tredòs (Naut Aran)' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "És la ruta habitual i la que descriu Reptes Muntanyencs. Des de l'aparcament dels Banhs de Tredòs es puja al refugi de Colomèrs (D'excursió per Catalunya compta 4,5 km, uns 400 m de desnivell i entre 1 h 15 min i 1 h 30 min); a l'estiu, el taxi 4x4 estalvia bona part d'aquest tram. L'endemà s'arriba a l'estanh Gelat i es puja pel pedregam i una canal fins al cim; la tornada es fa pel portau de Colomèrs. Comptant des de la parada del taxi, el circuit de Reptes Muntanyencs fa 18,2 km i uns 1.370 m de desnivell, amb unes 8 h 30 min de marxa.",
				es: 'Es la ruta habitual y la que describe Reptes Muntanyencs. Desde el aparcamiento de los Banhs de Tredòs se sube al refugio de Colomèrs (D’excursió per Catalunya cuenta 4,5 km, unos 400 m de desnivel y entre 1 h 15 min y 1 h 30 min); en verano, el taxi 4x4 ahorra buena parte de este tramo. Al día siguiente se llega al estanh Gelat y se sube por el pedregal y una canal hasta la cima; la vuelta se hace por el portau de Colomèrs. Contando desde la parada del taxi, el circuito de Reptes Muntanyencs suma 18,2 km y unos 1.370 m de desnivel, con unas 8 h 30 min de marcha.'
			},
			fonts: [REPTES, DEXCURSIO, VISIT_ARAN]
		},
		{
			id: 'colomers-d-espot',
			nom: {
				ca: "Des de Colomers d'Espot per l'estany del Bergús",
				es: "Desde Colomers d'Espot por el estany del Bergús"
			},
			sortida: { nom: "Colomers d'Espot (Pallars Sobirà)" },
			descripcio: {
				ca: "La Viquipèdia recull els accessos principals des de la banda catalana: el de la vall d'Aiguamòg, per l'Agulha deth Gran Tuc o pel portau de Colomèrs; el de la vall de Contraix, deixant el camí abans de l'estany de Contraix per arribar als Estanys Gelats i a la collada del sud; i el de Colomers d'Espot, per l'estany del Bergús i cap a ponent fins a la collada del sud. Les fonts consultades no donen temps ni desnivell d'aquestes variants.",
				es: 'La Viquipèdia recoge los accesos principales desde la vertiente catalana: el del valle de Aiguamòg, por la Agulha deth Gran Tuc o por el portau de Colomèrs; el del valle de Contraix, dejando el camino antes del estany de Contraix para llegar a los Estanys Gelats y al collado del sur; y el de Colomers d’Espot, por el estany del Bergús y hacia poniente hasta el collado del sur. Las fuentes consultadas no dan tiempo ni desnivel de estas variantes.'
			},
			fonts: [VIQUIPEDIA]
		}
	],
	consells: {
		ca: [
			'Reserva el refugi de Colomèrs amb antelació: Reptes Muntanyencs fa la ruta en dos dies i dormir allà acurta molt la jornada del cim.',
			"El pedregam és llarg i cansat, i entre l'estanh Gelat i el cim no hi ha senyals oficials: segueix les fites i, amb boira, no t'allunyis del camí conegut.",
			'La baixada del portau de Colomèrs és una canal de blocs grans: Reptes Muntanyencs la fa amb molta cura, i amb el terreny moll encara en demana més.',
			"Dins del parc nacional no es pot pernoctar fora dels refugis, ni acampar ni fer bivac, i els gossos han d'anar lligats, segons les preguntes freqüents del parc.",
			"Segons el parc nacional, a la Val d'Aran hi ha un servei temporal de vehicles entre els Banhs de Tredòs i el circ de Colomèrs: informa't dels dies i de la regulació d'accés a la ribèra d'Aiguamòg abans de sortir."
		],
		es: [
			'Reserva el refugio de Colomèrs con antelación: Reptes Muntanyencs hace la ruta en dos días y dormir allí acorta mucho la jornada de la cima.',
			'El pedregal es largo y cansado, y entre el estanh Gelat y la cima no hay señales oficiales: sigue los hitos y, con niebla, no te alejes del camino conocido.',
			'La bajada del portau de Colomèrs es una canal de bloques grandes: Reptes Muntanyencs la hace con mucho cuidado, y con el terreno mojado aún pide más.',
			'Dentro del parque nacional no se puede pernoctar fuera de los refugios, ni acampar ni hacer vivac, y los perros deben ir atados, según las preguntas frecuentes del parque.',
			'Según el parque nacional, en la Val d’Aran hay un servicio temporal de vehículos entre los Banhs de Tredòs y el circo de Colomèrs: infórmate de los días y de la regulación de acceso a la ribera de Aiguamòg antes de salir.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Es pot fer el Gran Tuc de Colomèrs en un sol dia?',
				resposta:
					'Reptes Muntanyencs el va fer en dos dies, dormint al refugi. El seu circuit, des de la parada del taxi, suma 18,2 km, uns 1.370 m de desnivell i unes vuit hores i mitja de marxa, amb una dificultat física molt alta: en un sol dia és una jornada molt llarga.'
			},
			{
				pregunta: 'Hi ha grimpada al Gran Tuc de Colomèrs?',
				resposta:
					"Reptes Muntanyencs esmenta una grimpada curta, fàcil i gens perillosa per superar una roca gran a la canal de pujada. La resta és pedregam i canals de fort desnivell, sense senyalització oficial entre l'estanh Gelat i el cim."
			},
			{
				pregunta: 'On es pot dormir per pujar al Gran Tuc de Colomèrs?',
				resposta:
					"Al refugi de Colomèrs, a 2.135 m, que segons D'excursió per Catalunya té unes 40 places, àpats i dutxes. Reserva amb antelació a l'estiu. Dins del parc nacional no es pot acampar ni fer bivac."
			},
			{
				pregunta: 'El Gran Tuc de Colomèrs compta com a cim essencial?',
				resposta:
					"Sí, és un dels sis [cims essencials](/cims-essencials) de l'Alta Ribagorça. Amb 2.933 m és el tercer en alçada d'aquests sis, després del [Pic de Comaloforno](/cims/pic-de-comaloforno) i de la [Punta Alta](/cims/punta-alta)."
			}
		],
		es: [
			{
				pregunta: '¿Se puede hacer el Gran Tuc de Colomèrs en un solo día?',
				resposta:
					'Reptes Muntanyencs lo hizo en dos días, durmiendo en el refugio. Su circuito, desde la parada del taxi, suma 18,2 km, unos 1.370 m de desnivel y unas ocho horas y media de marcha, con una dificultad física muy alta: en un solo día es una jornada muy larga.'
			},
			{
				pregunta: '¿Hay trepada en el Gran Tuc de Colomèrs?',
				resposta:
					'Reptes Muntanyencs menciona una trepada corta, fácil y nada peligrosa para superar una roca grande en la canal de subida. El resto es pedregal y canales de fuerte desnivel, sin señalización oficial entre el estanh Gelat y la cima.'
			},
			{
				pregunta: '¿Dónde se puede dormir para subir al Gran Tuc de Colomèrs?',
				resposta:
					'En el refugio de Colomèrs, a 2.135 m, que según D’excursió per Catalunya tiene unas 40 plazas, comidas y duchas. Reserva con antelación en verano. Dentro del parque nacional no se puede acampar ni hacer vivac.'
			},
			{
				pregunta: '¿El Gran Tuc de Colomèrs cuenta como cima esencial?',
				resposta:
					'Sí, es una de las seis [cimas esenciales](/cims-essencials) de la Alta Ribagorça. Con 2.933 m es el tercero en altura de esos seis, después del [Pic de Comaloforno](/cims/pic-de-comaloforno) y de la [Punta Alta](/cims/punta-alta).'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, DEXCURSIO, VISIT_ARAN, CONSELH, PARC_FAQ],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
