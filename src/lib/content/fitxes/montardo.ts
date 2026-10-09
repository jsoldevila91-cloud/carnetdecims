import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Montardo',
	url: 'https://ca.wikipedia.org/wiki/Montardo',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: Montardo",
	url: 'https://dexcursio.net/montardo/',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Montardo des de la Restanca',
	url: 'https://reptesmuntanyencs.cat/montardo/',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: 'Rutes Pirineus: Montardo i Montardo Petit per Cavallers',
	url: 'https://www.rutespirineus.cat/rutes/montardo-i-petit-montardo-per-cavallers',
	consultat: CONSULTAT
};

const VISIT_ARAN = {
	nom: "Visit Val d'Aran: refugis d'alta muntanya",
	url: 'https://www.visitvaldaran.com/en/refugios-alta-montana-val-daran/',
	consultat: CONSULTAT
};

const CONSELH = {
	nom: "Conselh Generau d'Aran: regulació d'accessos al medi natural, estiu 2025",
	url: 'https://www.conselharan.org/ca/el-conselh-generau-activa-el-calendari-de-regulacio-daccessos-al-medi-natural-per-a-lestiu-de-2025/',
	consultat: '2026-10-09'
};

const fitxa: ContingutFitxa = {
	slug: 'montardo',
	descripcio: {
		ca: [
			"El Montardo (també escrit Montarto) és el gran cim que tanca pel sud la vall d'Arties, al terme de Naut Aran, [a la Val d'Aran](/comarques/val-d-aran). És dins del Parc Nacional d'Aigüestortes i Estany de Sant Maurici, a la carena que separa l'Aran de les valls de la Ribagorça, i és de granodiorita, la roca clara que domina tot aquest sector del parc. Dins del mateix parc nacional, a la capçalera d'Aiguamòg, hi ha dos altres cims essencials del repte: el [Gran Tuc de Colomèrs](/cims/gran-tuc-de-colomers) i el [Tuc de Ratera](/cims/tuc-de-ratera).",
			"La seva silueta piramidal es reconeix des del pla de Beret i des del mateix poble d'Arties, i per això és una de les muntanyes més identificades pels aranesos. A tocar del cim principal hi ha el Montardo Petit, a quinze minuts, que molta gent hi afegeix. La cara nord, l'ombrer deth Montardo, és dreta i perillosa; per contra, el vessant sud és el que fa possible l'ascensió a peu, i a l'hivern és una clàssica de l'esquí de muntanya.",
			"Rutes Pirineus el considera un dels millors miradors de la Val d'Aran: als peus hi ha els estanys de la Restanca i de Cap de Port, cap al sud s'obre el laberint d'estanys del parc nacional i, a l'horitzó, es distingeixen bona part dels tresmils de la Ribagorça. És un bon cim per entendre el relleu glacial de la zona, amb circs, cubetes i tarteres a tot arreu.",
			"La temporada habitual va de juliol a principi d'octubre. Fins entrat l'estiu hi pot quedar neu a les pales altes. Les tempestes de tarda són freqüents a l'agost: surt d'hora i no pugis si el cel ja creix a migdia. A l'estiu, a més, l'accés en cotxe a la vall de Valarties està regulat."
		],
		es: [
			"El Montardo (también escrito Montarto) es la gran cima que cierra por el sur el valle de Arties, en el término de Naut Aran, [en la Val d'Aran](/comarques/val-d-aran). Está dentro del Parque Nacional de Aigüestortes i Estany de Sant Maurici, en la cresta que separa el Aran de los valles de la Ribagorça, y es de granodiorita, la roca clara que domina todo este sector del parque. Dentro del mismo parque nacional, en la cabecera de Aiguamòg, hay otras dos cimas esenciales del reto: el [Gran Tuc de Colomèrs](/cims/gran-tuc-de-colomers) y el [Tuc de Ratera](/cims/tuc-de-ratera).",
			'Su silueta piramidal se reconoce desde el pla de Beret y desde el mismo pueblo de Arties, y por eso es una de las montañas más reconocibles para los araneses. Junto a la cima principal está el Montardo Petit, a quince minutos, que mucha gente añade. La cara norte, el ombrer deth Montardo, es empinada y peligrosa; en cambio, la vertiente sur es la que permite la ascensión a pie, y en invierno es una clásica del esquí de montaña.',
			"Rutes Pirineus lo considera uno de los mejores miradores de la Val d'Aran: a los pies quedan los lagos de la Restanca y de Cap de Port, hacia el sur se abre el laberinto de lagos del parque nacional y, en el horizonte, se distinguen buena parte de los tresmiles de la Ribagorça. Es una buena cima para entender el relieve glaciar de la zona, con circos, cubetas y pedreras por todas partes.",
			'La temporada habitual va de julio a principios de octubre. Hasta bien entrado el verano puede quedar nieve en las palas altas. Las tormentas de tarde son frecuentes en agosto: sal temprano y no subas si a mediodía el cielo ya se está cargando. En verano, además, el acceso en coche al valle de Valarties está regulado.'
		]
	},
	rutes: [
		{
			id: 'restanca',
			nom: {
				ca: 'Des de Valarties pel refugi de la Restanca i el coll de Crestada',
				es: 'Desde Valarties por el refugio de la Restanca y el coll de Crestada'
			},
			sortida: { nom: 'Pontet de Rius (vall de Valarties, Naut Aran)' },
			tempsMinuts: 210,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "És la via més habitual des de l'Aran. Des d'Arties es remunta la vall de Valarties i es puja amb el GR 11 fins a la presa de la Restanca. Després es continua per l'estany de Cap de Port fins al coll de Crestada, on cal sortejar grans blocs de roca seguint les fites, i s'acaba per la carena. Segons D'excursió per Catalunya, la pujada és d'unes 3 h 30 min sense parades; no hi ha passos d'escalada, però sí tarteres i terreny pedregós. Compte: l'accés en cotxe per la pista de Valarties està regulat i depèn de l'època de l'any (a l'estiu, regulació del Conselh Generau d'Aran), així que el punt on hauràs de deixar el cotxe pot canviar; consulta-ho abans de sortir.",
				es: "Es la vía más habitual desde el Aran. Desde Arties se remonta el valle de Valarties y se sube con el GR 11 hasta la presa de la Restanca. Después se sigue por el lago de Cap de Port hasta el coll de Crestada, donde hay que sortear grandes bloques de roca siguiendo los hitos, y se termina por la cresta. Según D'excursió per Catalunya, la subida es de unas 3 h 30 min sin paradas; no hay pasos de escalada, pero sí pedreras y terreno pedregoso. Ojo: el acceso en coche por la pista de Valarties está regulado y depende de la época del año (en verano, regulación del Conselh Generau d'Aran), así que el punto donde tendrás que dejar el coche puede cambiar; consúltalo antes de salir."
			},
			fonts: [DEXCURSIO, REPTES, CONSELH]
		},
		{
			id: 'cavallers',
			nom: {
				ca: 'Des de Cavallers pel refugi Ventosa i Calvell',
				es: 'Desde Cavallers por el refugio Ventosa i Calvell'
			},
			sortida: { nom: "Aparcament de l'embassament de Cavallers (Vall de Boí, 1.730 m)" },
			tempsMinuts: 275,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Pel sud, des de la Vall de Boí, se surt de la presa de Cavallers i es puja per l'estany Negre fins al refugi Ventosa i Calvell (2 h 15 min, segons Rutes Pirineus). D'allà es passa pel coret d'Oelhacrestada i s'arriba al cim pel llom sud-oriental en 2 h 20 min més. Rutes Pirineus no hi destaca cap dificultat, però alerta de pendents considerables i trams de pedres grans. Molta gent el fa en dos dies dormint al refugi.",
				es: "Por el sur, desde la Vall de Boí, se sale de la presa de Cavallers y se sube por el estany Negre hasta el refugio Ventosa i Calvell (2 h 15 min, según Rutes Pirineus). Desde allí se pasa por el coret d'Oelhacrestada y se llega a la cima por el lomo sudoriental en 2 h 20 min más. Rutes Pirineus no destaca ninguna dificultad, pero avisa de pendientes considerables y tramos de piedras grandes. Mucha gente lo hace en dos días durmiendo en el refugio."
			},
			fonts: [RUTES_PIRINEUS]
		}
	],
	consells: {
		ca: [
			"L'accés en cotxe a la vall de Valarties està regulat i depèn de l'època de l'any: a l'estiu el Conselh Generau d'Aran en regula l'accés motoritzat (el 2025, del 15 de juny al 15 de setembre). Consulta abans de sortir les condicions vigents, l'aparcament i el transport alternatiu.",
			"Fora de la regulació, una cadena pot tancar la pista a partir de l'aparcament principal i obligar a caminar uns quilòmetres més des de baix.",
			"Si vols repartir l'esforç, dorm al refugi de la Restanca, del Conselh Generau d'Aran, o al Ventosa i Calvell si puges per Cavallers.",
			'Al coll de Crestada i a la carena el camí es perd entre blocs: segueix les fites i, amb boira, no improvisis dreceres.',
			"Amb neu, la ruta passa per pales amb risc d'allaus: calen crampons, piolet i consultar el butlletí d'allaus abans de sortir."
		],
		es: [
			"El acceso en coche al valle de Valarties está regulado y depende de la época del año: en verano el Conselh Generau d'Aran regula el acceso motorizado (en 2025, del 15 de junio al 15 de septiembre). Consulta antes de salir las condiciones vigentes, el aparcamiento y el transporte alternativo.",
			'Fuera de la regulación, una cadena puede cerrar la pista a partir del aparcamiento principal y obligar a caminar unos kilómetros más desde abajo.',
			"Si quieres repartir el esfuerzo, duerme en el refugio de la Restanca, del Conselh Generau d'Aran, o en el Ventosa i Calvell si subes por Cavallers.",
			'En el coll de Crestada y en la cresta el camino se pierde entre bloques: sigue los hitos y, con niebla, no improvises atajos.',
			'Con nieve, la ruta pasa por palas con riesgo de aludes: hacen falta crampones, piolet y consultar el boletín de aludes antes de salir.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Montardo?',
				resposta:
					"Des de Valarties, unes 3 h 30 min de pujada sense parades segons D'excursió per Catalunya. Des de Cavallers, Rutes Pirineus compta 2 h 15 min fins al refugi Ventosa i Calvell i 2 h 20 min més fins al cim."
			},
			{
				pregunta: 'El Montardo és difícil?',
				resposta:
					"No té passos d'escalada per les rutes normals del sud, però és una ascensió d'alta muntanya llarga, amb tarteres i blocs al tram final. Cal bona forma, saber seguir fites i tenir en compte el temps. La cara nord és una altra cosa: no és una excursió."
			},
			{
				pregunta: 'Es pot fer el Montardo en dos dies?',
				resposta:
					"Sí. Els refugis de la Restanca (vessant aranès) i Ventosa i Calvell (vessant de la Vall de Boí) permeten dormir a prop del cim i fer l'ascensió al matí, quan el temps acostuma a ser més estable."
			},
			{
				pregunta: 'El Montardo compta com a cim essencial?',
				resposta:
					"Sí, és un dels [cims essencials](/cims-essencials) de la Val d'Aran. El Montardo Petit, que és al costat, no és a la llista del repte. Les regles de validació són a la [normativa del repte](/repte-100-cims/normativa)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Montardo?',
				resposta:
					"Desde Valarties, unas 3 h 30 min de subida sin paradas según D'excursió per Catalunya. Desde Cavallers, Rutes Pirineus calcula 2 h 15 min hasta el refugio Ventosa i Calvell y 2 h 20 min más hasta la cima."
			},
			{
				pregunta: '¿El Montardo es difícil?',
				resposta:
					'No tiene pasos de escalada por las rutas normales del sur, pero es una ascensión de alta montaña larga, con pedreras y bloques en el tramo final. Hace falta buena forma, saber seguir hitos y vigilar el tiempo. La cara norte es otra cosa: no es una excursión.'
			},
			{
				pregunta: '¿Se puede hacer el Montardo en dos días?',
				resposta:
					'Sí. Los refugios de la Restanca (vertiente aranesa) y Ventosa i Calvell (vertiente de la Vall de Boí) permiten dormir cerca de la cima y hacer la ascensión por la mañana, cuando el tiempo suele ser más estable.'
			},
			{
				pregunta: '¿El Montardo cuenta como cima esencial?',
				resposta:
					"Sí, es una de las [cimas esenciales](/cims-essencials) de la Val d'Aran. El Montardo Petit, que está al lado, no está en la lista del reto. Las reglas de validación están en la [normativa del reto](/repte-100-cims/normativa)."
			}
		]
	},
	fonts: [VIQUIPEDIA, DEXCURSIO, REPTES, RUTES_PIRINEUS, VISIT_ARAN, CONSELH],
	estat: 'esborrany',
	actualitzat: '2026-10-09'
};

export default fitxa;
