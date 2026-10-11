import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Roques de Benet',
	url: 'https://ca.wikipedia.org/wiki/Roques_de_Benet',
	consultat: CONSULTAT
};

const VIQUIPEDIA_HORTA = {
	nom: 'Viquipèdia: Horta de Sant Joan',
	url: 'https://ca.wikipedia.org/wiki/Horta_de_Sant_Joan',
	consultat: CONSULTAT
};

const SCG = {
	nom: 'Societat Catalana de Geografia (IEC): «Per les Roques de Benet i els Estrets (Horta i Arnes)», Treballs de la SCG, 76 (2013)',
	url: 'https://agora-geografia.iec.cat/files/2019/06/Roques-Benet.pdf',
	consultat: CONSULTAT
};

const SURT_DE_CASA = {
	nom: 'Surt de Casa Ebre: Les Roques de Benet, una experiència entremig dels núvols',
	url: 'https://surtdecasa.cat/ebre/blogs/apassionat-de-la-terra/les-roques-de-benet-una-experiencia-entremig-dels-nuvols',
	consultat: CONSULTAT
};

const PARC_REGULACIO = {
	nom: "Parc Natural dels Ports: regulació d'activitats",
	url: 'https://parcsnaturals.gencat.cat/ca/xarxa-de-parcs/ports/gaudeix-del-parc/consells/regulacio-dactivitats/',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Roques de Benet',
	url: 'https://reptesmuntanyencs.cat/roques-de-benet/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'roques-de-benet',
	descripcio: {
		ca: [
			"Les Roques de Benet s'alcen al terme d'Horta de Sant Joan, a [la Terra Alta](/comarques/terra-alta), dins el Parc Natural dels Ports, separades del poble per una gran plana. Són un conjunt de moles de conglomerat amb parets verticals de gairebé 300 m que cauen a plom sobre un sòcol calcari. La roca de l'esquerra es coneix popularment com el Cap de Gos, pel perfil que té vista de costat; el cim que compta per al repte és el de la mola principal, el Castell.",
			"El nom originari, Bene, és àrab i ja surt a la carta de poblament cristià del segle XII. La Societat Catalana de Geografia, que hi va fer una sortida el 2013, les compara amb els altres massissos de conglomerat de la perifèria de la Depressió Central, amb Montserrat com a model: l'erosió ha aïllat unes moles envoltades de penya-segats. Les parets són terreny d'escalada, i el Castell és l'única de les roques amb un punt feble per on es puja caminant.",
			"Des del cim, un llom ample i pelat, la vista s'estén per un bon tros dels Ports i per la Terra Alta i el Matarranya, amb la plana d'Horta als peus; en un dia clar es veu el Pirineu a l'horitzó. La mateixa crònica de la Societat hi esmenta voltors i cabra salvatge.",
			"Convé triar un dia estable i de bona visibilitat: amb boira no es veu res del que justifica la pujada i el cim, envoltat de timbes, es torna poc agradable. Al mateix terme hi ha [Santa Bàrbara](/cims/santa-barbara), molt més curta, i cap al nord del parc, el [Tossal d'Engrilló](/cims/tossal-d-engrillo)."
		],
		es: [
			'Las Roques de Benet se levantan en el término de Horta de Sant Joan, en [la Terra Alta](/comarques/terra-alta), dentro del Parc Natural dels Ports, separadas del pueblo por una gran llanura. Son un conjunto de muelas de conglomerado con paredes verticales de casi 300 m que caen a plomo sobre un zócalo calizo. La roca de la izquierda se conoce popularmente como el Cap de Gos, por el perfil que tiene vista de lado; la cima que cuenta para el reto es la de la muela principal, el Castell.',
			'El nombre originario, Bene, es árabe y ya aparece en la carta de población cristiana del siglo XII. La Societat Catalana de Geografia, que hizo allí una salida en 2013, las compara con los demás macizos de conglomerado de la periferia de la Depresión Central, con Montserrat como modelo: la erosión ha aislado unas muelas rodeadas de acantilados. Las paredes son terreno de escalada, y el Castell es la única de las rocas con un punto débil por donde se sube andando.',
			'Desde la cima, un lomo ancho y pelado, la vista se extiende por buena parte de los Ports y por la Terra Alta y el Matarranya, con la llanura de Horta a los pies; en un día claro se ve el Pirineo en el horizonte. La misma crónica de la Societat menciona buitres y cabra montés.',
			"Conviene elegir un día estable y de buena visibilidad: con niebla no se ve nada de lo que justifica la subida y la cima, rodeada de precipicios, se vuelve poco agradable. En el mismo término está [Santa Bàrbara](/cims/santa-barbara), mucho más corta, y hacia el norte del parque, el [Tossal d'Engrilló](/cims/tossal-d-engrillo)."
		]
	},
	rutes: [
		{
			id: 'pista-de-les-eres',
			nom: {
				ca: 'Al Castell per la pista de les Eres i la canal',
				es: 'Al Castell por la pista de les Eres y la canal'
			},
			sortida: { nom: 'Inici de la pista forestal de les Eres (Horta de Sant Joan)' },
			desnivellPositiuM: 462,
			distanciaKm: 3.1,
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "És el camí habitual. La Societat Catalana de Geografia el descriu en dos trams des del punt de sortida, a 555 m: primer una pista forestal de 2,1 km que puja fins a la cota 765 i després un quilòmetre, de menys d'una hora, per un corriol de bosc que s'enfila per una canal dreta (75 m de desnivell amb un pendent del 50 %) i acaba pels rasos del cim. La canal és de pedra solta; el bloc Reptes Muntanyencs hi descriu un pas sota un gran roc i una grimpada curta i sense dificultat abans de l'esplanada que precedeix el cim, on un sender fitat ressegueix la paret de ponent. Es baixa pel mateix camí.",
				es: 'Es el camino habitual. La Societat Catalana de Geografia lo describe en dos tramos desde el punto de salida, a 555 m: primero una pista forestal de 2,1 km que sube hasta la cota 765 y después un kilómetro, de menos de una hora, por una senda de bosque que se encarama por una canal empinada (75 m de desnivel con una pendiente del 50 %) y termina por los rasos de la cima. La canal es de piedra suelta; el blog Reptes Muntanyencs describe en ella un paso bajo una gran roca y una trepada corta y sin dificultad antes de la explanada que precede a la cima, donde un sendero con hitos recorre la pared de poniente. Se baja por el mismo camino.'
			},
			fonts: [SCG, SURT_DE_CASA, REPTES]
		}
	],
	consells: {
		ca: [
			'La canal és curta però dreta i de pedra solta, i en algun pas cal posar-hi les mans: no és un camí per a qui no hagi trepitjat mai aquest terreny, i amb la roca molla val més deixar-ho per a un altre dia.',
			"Al cim no t'acostis a les vores. Si segueixes la carena cap al Cap de Gos, una timba barra el pas: gira cua i baixa per on has pujat. Davant de qualsevol incident, 112. Les variants que baixen per la Foradada tenen desgrimpades i no són una excursió.",
			"L'Ajuntament d'Horta de Sant Joan regula l'accés motoritzat al seu terme dins el parc de l'1 de març al 31 d'octubre: només es pot estacionar als aparcaments senyalitzats, mai als camins d'accés, i no de 22 h a 6 h (web del parc, consulta del 2026). Consulta la regulació vigent.",
			"L'escalada a les parets del Castell té una regulació temporal per nidificació de rapinyaires protegits; no afecta el camí de pujada a peu, però respecta la senyalització.",
			'Més enllà del tram inicial, el bloc considera que la pista no és apta per a cotxes baixos.'
		],
		es: [
			'La canal es corta pero empinada y de piedra suelta, y en algún paso hay que apoyar las manos: no es un camino para quien no haya pisado nunca este terreno, y con la roca mojada es mejor dejarlo para otro día.',
			'En la cima no te acerques a los bordes. Si sigues la cresta hacia el Cap de Gos, un precipicio corta el paso: da media vuelta y baja por donde has subido. Ante cualquier incidente, 112. Las variantes que bajan por la Foradada tienen destrepes y no son una excursión.',
			'El Ayuntamiento de Horta de Sant Joan regula el acceso motorizado en su término dentro del parque del 1 de marzo al 31 de octubre: solo se puede estacionar en los aparcamientos señalizados, nunca en los caminos de acceso, y no de 22 h a 6 h (web del parque, consulta de 2026). Consulta la regulación vigente.',
			'La escalada en las paredes del Castell tiene una regulación temporal por nidificación de rapaces protegidas; no afecta al camino de subida a pie, pero respeta la señalización.',
			'Más allá del tramo inicial, el blog considera que la pista no es apta para coches bajos.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Es pot pujar a les Roques de Benet sense escalar?',
				resposta:
					'Sí, al Castell, que és el cim del repte. El camí habitual puja per una canal dreta de pedra solta on en algun pas cal ajudar-se de les mans, sense arribar a ser una escalada. El Cap de Gos i les altres agulles només són accessibles escalant.'
			},
			{
				pregunta: 'Quant es triga a pujar-hi?',
				resposta:
					"La Societat Catalana de Geografia compta una pista forestal de 2,1 km i, després, un quilòmetre final que es fa en menys d'una hora. En total són uns 3 km de pujada i uns 460 m de desnivell des de l'inici de la pista."
			},
			{
				pregunta: "D'on ve el nom de Roques de Benet?",
				resposta:
					"Del nom originari, Bene, d'origen àrab, que ja apareix a la carta de poblament cristià del segle XII."
			},
			{
				pregunta: 'Compten com a cim essencial?',
				resposta:
					'Sí, són un dels dos [cims essencials](/cims-essencials) de la Terra Alta, amb [Santa Bàrbara](/cims/santa-barbara). El punt que cal assolir és el cim del Castell.'
			}
		],
		es: [
			{
				pregunta: '¿Se puede subir a las Roques de Benet sin escalar?',
				resposta:
					'Sí, al Castell, que es la cima del reto. El camino habitual sube por una canal empinada de piedra suelta donde en algún paso hay que ayudarse con las manos, sin llegar a ser una escalada. El Cap de Gos y las demás agujas solo son accesibles escalando.'
			},
			{
				pregunta: '¿Cuánto se tarda en subir?',
				resposta:
					'La Societat Catalana de Geografia cuenta una pista forestal de 2,1 km y, después, un kilómetro final que se hace en menos de una hora. En total son unos 3 km de subida y unos 460 m de desnivel desde el inicio de la pista.'
			},
			{
				pregunta: '¿De dónde viene el nombre de Roques de Benet?',
				resposta:
					'Del nombre originario, Bene, de origen árabe, que ya aparece en la carta de población cristiana del siglo XII.'
			},
			{
				pregunta: '¿Cuentan como cima esencial?',
				resposta:
					'Sí, son una de las dos [cimas esenciales](/cims-essencials) de la Terra Alta, con [Santa Bàrbara](/cims/santa-barbara). El punto que hay que alcanzar es la cima del Castell.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_HORTA, SCG, SURT_DE_CASA, PARC_REGULACIO, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
