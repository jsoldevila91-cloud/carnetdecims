import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Tuc de Molières',
	url: 'https://ca.wikipedia.org/wiki/Tuc_de_Moli%C3%A8res',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Tuc de Molières',
	url: 'https://reptesmuntanyencs.cat/tuc-de-molieres/',
	consultat: CONSULTAT
};

const DOSMILS = {
	nom: "Visit Val d'Aran: descobreix els dosmilers de la Val d'Aran",
	url: 'https://www.visitvaldaran.com/descubre-los-dosmiles-la-val-daran/',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: "Rutes Pirineus: ascensió guiada al Tuc de Molières des de l'Artiga de Lin",
	url: 'https://www.rutespirineus.cat/rutes-guiades/ascensio-guiada-tuc-molieres-artiga-de-lin',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tuc-de-molieres',
	descripcio: {
		ca: [
			"El Tuc de Molières és l'únic tresmil dels sis cims essencials de [la Val d'Aran](/comarques/val-d-aran) i, segons Rutes Pirineus, el tresmil més oriental del massís de les Maladetes. Fa de frontera entre Catalunya i Aragó: el vessant est és del terme de Vielha e Mijaran i el vessant oest, del de Benasc, a la Ribagorça aragonesa. També se'l coneix com a Pic de Molières o Pic de Mulleres i, en aragonès, Tuca de Mulleres.",
			"És de granit i el cim és una cresta de blocs de roca. Segons la Viquipèdia, el vessant oest és una llarga tartera amb sis petits estanys d'origen glacial que desguassen cap al Pla d'Aigualluts, on l'aigua s'escola per conductes càrstics fins als Uelhs deth Joèu i acaba a la Garona. El vessant est, el de la vall de Molières, té quatre estanys glacials que alimenten la Noguera Ribagorçana i una gelera permanent sota el cim.",
			"La vall de Molières ha tingut refugi propi: el de la FEEC, inaugurat el 1974 i desmuntat el 2011 pel seu mal estat, va ser substituït aquell mateix estiu pel Refugi Molières, que és lliure i, segons Reptes Muntanyencs, té capacitat per a 18 persones. Visit Val d'Aran el situa a uns 2.400 m i el presenta com a recer per descansar durant la pujada.",
			'La temporada va de juliol a setembre, segons Rutes Pirineus. La vall de Molières és molt exposada a les allaus: si hi ha neu, valora-ho abans de sortir, perquè la grimpada que porta al collet de Molières deixa de ser fàcil amb neu o gel. Són jornades llargues i exigents, amb un desnivell que ronda els 1.400 m només de pujada.'
		],
		es: [
			'El Tuc de Molières es el único tresmil de los seis cims esenciales de [la Val d’Aran](/comarques/val-d-aran) y, según Rutes Pirineus, el tresmil más oriental del macizo de las Maladetas. Hace de frontera entre Cataluña y Aragón: la vertiente este pertenece al término de Vielha e Mijaran y la oeste, al de Benasque, en la Ribagorza aragonesa. También se le conoce como Pic de Molières o Pic de Mulleres y, en aragonés, Tuca de Mulleres.',
			"Es de granito y la cima es una cresta de bloques. Según la Viquipèdia, la vertiente oeste es una larga pedrera con seis pequeños lagos de origen glaciar que desaguan hacia el Plan d'Aiguallut, donde el agua se filtra por conductos kársticos hasta los Uelhs deth Joèu y acaba en el Garona. La vertiente este, la del valle de Molières, tiene cuatro lagos glaciares que alimentan la Noguera Ribagorzana y un helero permanente bajo la cima.",
			'El valle de Molières ha tenido refugio propio: el de la FEEC, inaugurado en 1974 y desmontado en 2011 por su mal estado, fue sustituido ese mismo verano por el Refugio Molières, que es libre y, según Reptes Muntanyencs, tiene capacidad para 18 personas. Visit Val d’Aran lo sitúa a unos 2.400 m y lo presenta como cobijo para descansar durante la subida.',
			'La temporada va de julio a septiembre, según Rutes Pirineus. El valle de Molières está muy expuesto a los aludes: si hay nieve, valóralo antes de salir, porque la trepada que lleva al collet de Molières deja de ser fácil con nieve o hielo. Son jornadas largas y exigentes, con un desnivel que ronda los 1.400 m solo de subida.'
		]
	},
	rutes: [
		{
			id: 'espitau',
			nom: {
				ca: "Des de l'Espitau de Vielha per la vall de Molières",
				es: "Desde l'Espitau de Vielha por el valle de Molières"
			},
			sortida: { nom: 'Espitau de Vielha (boca sud del túnel de Vielha)' },
			desnivellPositiuM: 1429,
			distanciaKm: 7.75,
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "És la pujada més directa: surt de la boca sud del túnel de Vielha i remunta la vall de Molières, primer per una pista ampla, camins fressats i bosc, després per aiguamolls, terreny pedregós i tartera. La fitxa de Reptes Muntanyencs indica 5 h 37 min de marxa fins al cim. La part alta és de terreny franc i molt dret fins al collet de Molières; la mateixa font explica que en un dels salts d'aigua cal ajudar-se de les mans i que l'accés al collet és una grimpada moderada, fàcil per a qui hi està avesat sense neu ni gel. Del collet al cim, una cresta àmplia de blocs. Visit Val d'Aran dona 1.415 m de desnivell i 4 h de pujada.",
				es: 'Es la subida más directa: sale de la boca sur del túnel de Vielha y remonta el valle de Molières, primero por una pista ancha, caminos trillados y bosque, después por zonas húmedas, terreno pedregoso y pedrera. La ficha de Reptes Muntanyencs indica 5 h 37 min de marcha hasta la cima. La parte alta es de terreno franco y muy empinado hasta el collet de Molières; la misma fuente explica que en uno de los saltos de agua hay que ayudarse de las manos y que el acceso al collet es una trepada moderada, fácil para quien está habituado si no hay nieve ni hielo. Del collet a la cima, una cresta amplia de bloques. Visit Val d’Aran da 1.415 m de desnivel y 4 h de subida.'
			},
			fonts: [REPTES, DOSMILS]
		},
		{
			id: 'artiga-de-lin',
			nom: {
				ca: "Des del refugi de l'Artiga de Lin pel coll dels Aranesos",
				es: "Desde el refugio de l'Artiga de Lin por el coll dels Aranesos"
			},
			sortida: { nom: "Aparcament de l'Artiga de Lin (Vielha e Mijaran)" },
			descripcio: {
				ca: "És la clàssica pel vessant nord. Rutes Pirineus la fa amb nit prèvia al refugi de l'Artiga de Lin: sortida de matinada cap al barranc i l'estany de Puis, ascensió pel coll dels Aranesos i l'estany de l'Escaleta, i cim. Si les condicions ho permeten, la baixada s'enllaça pel coll de Toro i el barranc de la Ribera, tancant una volta semicircular. Compta uns 16 km i 1.600 m de desnivell, unes 10 h el dia de l'ascensió, per camins, trams irregulars, tarteres i blocs. La font la reserva per a persones molt ben preparades.",
				es: 'Es la clásica por la vertiente norte. Rutes Pirineus la hace con noche previa en el refugio de Artiga de Lin: salida de madrugada hacia el barranco y el estany de Puis, ascensión por el coll dels Aranesos y el estany de l’Escaleta, y cima. Si las condiciones lo permiten, la bajada se enlaza por el coll de Toro y el barranco de la Ribera, cerrando una vuelta semicircular. Cuenta unos 16 km y 1.600 m de desnivel, unas 10 h el día de la ascensión, por caminos, tramos irregulares, pedreras y bloques. La fuente la reserva para personas muy bien preparadas.'
			},
			fonts: [RUTES_PIRINEUS]
		}
	],
	consells: {
		ca: [
			"Si hi ha neu o gel, no pugis pel collet de Molières sense el material i l'experiència adequats: la grimpada ja no és fàcil i la vall és molt exposada a les allaus (Reptes Muntanyencs).",
			"La fitxa de Reptes Muntanyencs no hi indica fonts. El camí ressegueix el riu bona part de la pujada, però porta tota l'aigua que necessitis des de baix.",
			"Si vols repartir l'esforç, pots dormir al refugi lliure de Molières o, pel vessant nord, al refugi de l'Artiga de Lin, com fa la sortida guiada de Rutes Pirineus.",
			"Com a referència d'equipament, la sortida guiada de Rutes Pirineus demana botes de canya mitjana o alta, jaqueta impermeable, roba d'abric i bastons, i experiència prèvia en terreny d'alta muntanya.",
			"Surt de matinada i planifica el retorn amb marge: la pujada ja és llarga, i els núvols de tempesta de la tarda són habituals a l'estiu."
		],
		es: [
			'Si hay nieve o hielo, no subas por el collet de Molières sin el material y la experiencia adecuados: la trepada ya no es fácil y el valle está muy expuesto a los aludes (Reptes Muntanyencs).',
			'La ficha de Reptes Muntanyencs no indica fuentes. El camino sigue el río buena parte de la subida, pero lleva desde abajo toda el agua que necesites.',
			'Si quieres repartir el esfuerzo, puedes dormir en el refugio libre de Molières o, por la vertiente norte, en el refugio de Artiga de Lin, como hace la salida guiada de Rutes Pirineus.',
			'Como referencia de equipo, la salida guiada de Rutes Pirineus pide botas de caña media o alta, chaqueta impermeable, ropa de abrigo y bastones, y experiencia previa en terreno de alta montaña.',
			'Sal de madrugada y planifica la vuelta con margen: la subida ya es larga, y las nubes de tormenta de la tarde son habituales en verano.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Tuc de Molières?',
				resposta:
					"Des de l'Espitau de Vielha, la fitxa de Reptes Muntanyencs indica 5 h 37 min de marxa fins al cim (1.429 m de desnivell); Visit Val d'Aran en dona 4 h. Per l'Artiga de Lin, Rutes Pirineus parla d'unes 10 h el dia de l'ascensió."
			},
			{
				pregunta: 'El Tuc de Molières és difícil?',
				resposta:
					"Reptes Muntanyencs en valora la dificultat física com a molt alta i explica que cal posar les mans en un dels salts d'aigua i en la grimpada moderada que porta al collet de Molières. Només és assequible sense neu ni gel i amb costum de moure's per terreny dret."
			},
			{
				pregunta: 'Quan és la millor època?',
				resposta:
					'Rutes Pirineus recomana de juliol a setembre. Amb neu, segons Reptes Muntanyencs, la vall de Molières és molt exposada a les allaus: no hi pugis sense formació i material.'
			},
			{
				pregunta: 'El Tuc de Molières compta com a cim essencial?',
				resposta:
					"Sí, és un dels sis [cims essencials](/cims-essencials) de la Val d'Aran i l'únic que arriba als 3.000 m. Amb 3.010 m queda a poc més de 100 m del [Maubèrme](/cims/mauberme), el segon de la llista."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Tuc de Molières?',
				resposta:
					'Desde l’Espitau de Vielha, la ficha de Reptes Muntanyencs indica 5 h 37 min de marcha hasta la cima (1.429 m de desnivel); Visit Val d’Aran da 4 h. Por Artiga de Lin, Rutes Pirineus habla de unas 10 h el día de la ascensión.'
			},
			{
				pregunta: '¿El Tuc de Molières es difícil?',
				resposta:
					'Reptes Muntanyencs valora la dificultad física como muy alta y explica que hay que poner las manos en uno de los saltos de agua y en la trepada moderada que lleva al collet de Molières. Solo es asequible sin nieve ni hielo y con costumbre de moverse por terreno empinado.'
			},
			{
				pregunta: '¿Cuándo es la mejor época?',
				resposta:
					'Rutes Pirineus recomienda de julio a septiembre. Con nieve, según Reptes Muntanyencs, el valle de Molières está muy expuesto a los aludes: no subas sin formación y material.'
			},
			{
				pregunta: '¿El Tuc de Molières cuenta como cima esencial?',
				resposta:
					'Sí, es una de las seis [cimas esenciales](/cims-essencials) de la Val d’Aran y la única que llega a los 3.000 m. Con 3.010 m queda a poco más de 100 m del [Maubèrme](/cims/mauberme), el segundo de la lista.'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, DOSMILS, RUTES_PIRINEUS],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
