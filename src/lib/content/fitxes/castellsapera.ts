import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Castellsapera',
	url: 'https://ca.wikipedia.org/wiki/Castellsapera',
	consultat: CONSULTAT
};

const MUNTANYAAMBNENS = {
	nom: 'Montaña con los niños: Castellsapera',
	url: 'https://muntanya-amb-nens.blogspot.com/2015/11/castellsapera.html',
	consultat: CONSULTAT
};

const RAFAYANES = {
	nom: 'Rafa Yanes: ruta al Castellsapera',
	url: 'https://rafayanes.com/ruta-castellsapera-939-m-els-100-cims/',
	consultat: CONSULTAT
};

const EXCURSIONISME = {
	nom: 'Excursionisme: el cim de Castellsapera',
	url: 'https://excursionisme.wordpress.com/2010/01/31/el-cim-de-castellsapera/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'castellsapera',
	descripcio: {
		ca: [
			"El Castellsapera és el sostre de la serra de l'Obac, la meitat occidental del Parc Natural de Sant Llorenç del Munt i l'Obac. Fa de partió entre Terrassa i Vacarisses, [al Vallès Occidental](/comarques/valles-occidental), i des de dalt es veuen de cara els dos grans cims del parc: [la Mola](/cims/la-mola-de-sant-llorenc-del-munt) i [el Montcau](/cims/montcau). Al nord s'enllaça amb el coll i el turó de les Tres Creus i, al sud, amb el turó de la Carlina.",
			"És un gran monòlit allargat de conglomerat, la roca de l'Eocè que dona forma a tot el massís, i la Viquipèdia el recull com a punt d'interès geològic. El cim és estret i rocós, amb un aspecte de castell des de diversos punts de vista que, probablement, n'explica el nom; al costat s'hi destaca una altra roca, el Queixal del Porc. Als peus s'obre l'avenc de Castellsapera, amb un pou de 45 m i 84 m de fondària màxima, on a la tardor i a la primavera s'hi refugia el ratpenat de cova.",
			"La carena cimera és una plataforma oberta amb una vista molt completa: la Mola i el Montcau, el Paller de Tot l'Any, Montserrat i, en dies clars, el Pirineu.",
			"Es pot pujar tot l'any, però evita els dies de pluja o just després: la roca i les arrels del pas final rellisquen. A l'estiu, millor a primera hora, perquè la carena és molt exposada al sol."
		],
		es: [
			"El Castellsapera es el techo de la sierra de l'Obac, la mitad occidental del Parque Natural de Sant Llorenç del Munt i l'Obac. Hace de divisoria entre Terrassa y Vacarisses, [en el Vallès Occidental](/comarques/valles-occidental), y desde arriba se ven de frente las dos grandes cimas del parque: [la Mola](/cims/la-mola-de-sant-llorenc-del-munt) y [el Montcau](/cims/montcau). Al norte enlaza con el coll y el turó de les Tres Creus y, al sur, con el turó de la Carlina.",
			'Es un gran monolito alargado de conglomerado, la roca del Eoceno que da forma a todo el macizo, y la Viquipèdia lo recoge como punto de interés geológico. La cima es estrecha y rocosa, con aspecto de castillo desde varios puntos de vista, lo que probablemente explica su nombre; a su lado destaca otra roca, el Queixal del Porc. A sus pies se abre el avenc de Castellsapera, con un pozo de 45 m y 84 m de profundidad máxima, donde en otoño y primavera se refugia el murciélago de cueva.',
			'La cresta cimera es una plataforma abierta con una vista muy completa: la Mola y el Montcau, el Paller de Tot l’Any, Montserrat y, en días claros, el Pirineo.',
			'Se puede subir todo el año, pero evita los días de lluvia o justo después: la roca y las raíces del paso final resbalan. En verano, mejor a primera hora, porque la cresta está muy expuesta al sol.'
		]
	},
	rutes: [
		{
			id: 'alzina-del-salari',
			nom: {
				ca: "Des de l'Alzina del Salari pel coll de les Tres Creus",
				es: "Desde l'Alzina del Salari por el coll de les Tres Creus"
			},
			sortida: { nom: "Aparcament de l'Alzina del Salari (carretera de Terrassa a Talamanca)" },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "La pujada més curta. Per pista i corriol s'arriba al coll de les Tres Creus i d'allà s'encara la carena. Les dues ressenyes consultades coincideixen que el final no és un simple camí: Muntanya amb nens hi descriu un pas una mica exposat sobre conglomerat i una canaleta on cal agafar-se a les arrels, i Rafa Yanes un esglaó de roca de gairebé 2 m que demana una mica d'habilitat. Muntanya amb nens hi calcula una hora d'anada.",
				es: 'La subida más corta. Por pista y sendero se llega al coll de les Tres Creus y desde allí se encara la cresta. Las dos reseñas consultadas coinciden en que el final no es un simple camino: Montaña con los niños describe un paso algo expuesto sobre conglomerado y una canal estrecha donde hay que agarrarse a las raíces, y Rafa Yanes un escalón de roca de casi 2 m que pide algo de habilidad. Montaña con los niños calcula una hora de ida.'
			},
			fonts: [MUNTANYAAMBNENS, RAFAYANES]
		},
		{
			id: 'la-barata',
			nom: { ca: 'Des de la Barata (Terrassa)', es: 'Desde la Barata (Terrassa)' },
			sortida: { nom: 'La Barata (Terrassa)' },
			descripcio: {
				ca: "Accés més llarg pel camí ral de Mura i el collet Estret, amb la font de Cantarelles i un antic forn de calç. Segons la ressenya d'Excursionisme, són uns 7 km i unes 3 h en total, i el tram final puja molt dret per una canal amb arrels; no és recomanable si tens vertigen.",
				es: 'Acceso más largo por el camino real de Mura y el collet Estret, con la font de Cantarelles y un antiguo horno de cal. Según la reseña de Excursionisme, son unos 7 km y unas 3 h en total, y el tramo final sube muy recto por una canal con raíces; no es recomendable si tienes vértigo.'
			},
			fonts: [EXCURSIONISME]
		}
	],
	consells: {
		ca: [
			"El pas final obliga a posar les mans: si vas amb nens, ajuda'ls sobretot a la baixada, que és on costa més.",
			'Amb la roca molla, el conglomerat i les arrels rellisquen molt: millor deixar-ho per a un dia sec.',
			'Si tens vertigen, el tram de carena exposat pot ser incòmode; el coll de les Tres Creus ja és un bon mirador.',
			'Porta calçat amb bona adherència: el pas final és sobre conglomerat.',
			"És un parc natural: no surtis dels camins i no t'acostis a la boca de l'avenc, que és refugi de ratpenats."
		],
		es: [
			'El paso final obliga a poner las manos: si vas con niños, ayúdalos sobre todo en la bajada, que es donde más cuesta.',
			'Con la roca mojada, el conglomerado y las raíces resbalan mucho: mejor dejarlo para un día seco.',
			'Si tienes vértigo, el tramo de cresta expuesto puede ser incómodo; el coll de les Tres Creus ya es un buen mirador.',
			'Lleva calzado con buena adherencia: el paso final es sobre conglomerado.',
			'Es un parque natural: no salgas de los caminos y no te acerques a la boca del avenc, que es refugio de murciélagos.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Cal grimpar per pujar al Castellsapera?',
				resposta:
					'Una mica. Les ressenyes coincideixen que al final hi ha un esglaó de roca de gairebé 2 m i una canaleta amb arrels on cal ajudar-se de les mans, i algun pas una mica exposat. No és difícil, però no és un camí per a tothom.'
			},
			{
				pregunta: 'Es pot pujar al Castellsapera amb nens?',
				resposta:
					"Amb nens que ja estiguin acostumats a posar les mans, sí: Muntanya amb nens la recomana a partir de 4 anys, però amb ajuda d'un adult al pas de roca, sobretot a la baixada."
			},
			{
				pregunta: "D'on ve el nom del Castellsapera?",
				resposta:
					"Segons la Viquipèdia, probablement de l'aspecte de castell que té el cim, un monòlit allargat de conglomerat, vist des de diversos punts del parc."
			},
			{
				pregunta: 'El Castellsapera és un cim essencial?',
				resposta:
					'Sí, és un dels [cims essencials](/cims-essencials) del repte, i amb [la Mola](/cims/la-mola-de-sant-llorenc-del-munt) i [el Montcau](/cims/montcau) completa els grans cims del parc.'
			}
		],
		es: [
			{
				pregunta: '¿Hay que trepar para subir al Castellsapera?',
				resposta:
					'Un poco. Las reseñas coinciden en que al final hay un escalón de roca de casi 2 m y una canal estrecha con raíces donde hay que ayudarse de las manos, y algún paso algo expuesto. No es difícil, pero no es un camino para todo el mundo.'
			},
			{
				pregunta: '¿Se puede subir al Castellsapera con niños?',
				resposta:
					'Con niños que ya estén acostumbrados a poner las manos, sí: Montaña con los niños la recomienda a partir de 4 años, pero con ayuda de un adulto en el paso de roca, sobre todo en la bajada.'
			},
			{
				pregunta: '¿De dónde viene el nombre del Castellsapera?',
				resposta:
					'Según la Viquipèdia, probablemente del aspecto de castillo que tiene la cima, un monolito alargado de conglomerado, vista desde varios puntos del parque.'
			},
			{
				pregunta: '¿El Castellsapera es una cima esencial?',
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) del reto, y con [la Mola](/cims/la-mola-de-sant-llorenc-del-munt) y [el Montcau](/cims/montcau) completa las grandes cimas del parque.'
			}
		]
	},
	fonts: [VIQUIPEDIA, MUNTANYAAMBNENS, RAFAYANES, EXCURSIONISME],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
