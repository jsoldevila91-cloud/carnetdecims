import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const MIRADOR = {
	nom: 'Mirador: Mont-roig',
	url: 'https://en.mirador.cat/Pyrenees/Mont-roig',
	consultat: CONSULTAT
};

const FEEC_REFUGI = {
	nom: 'FEEC: refugi Mont-roig «Enric Pujol»',
	url: 'https://www.feec.cat/fem-muntanya/refugis/refugi/refugi-mont-roig-enric-pujol/',
	consultat: CONSULTAT
};

const SENSUS = {
	nom: 'Sensus (blog): Els colors del Mont-roig (2.864 m)',
	url: 'https://www.sensus.cat/els-colors-del-mont-roig-2-864-m/',
	consultat: CONSULTAT
};

const ALBERTREK = {
	nom: 'La luz de la montaña (blog): Mont-roig (2.864 m)',
	url: 'https://albertrek.blogspot.com/2017/04/mont-roig-2864-m_21.html',
	consultat: CONSULTAT
};

const PARC = {
	nom: "Parc Natural de l'Alt Pirineu: pautes i consells per als visitants",
	url: 'https://parcsnaturals.gencat.cat/en/xarxa-de-parcs/alt-pirineu/gaudeix-del-parc/consells/pautes-i-consells/index.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'mont-roig',
	descripcio: {
		ca: [
			"El Mont-roig és una muntanya fronterera entre Catalunya i l'Occitània, a la capçalera de la vall de Cardós i de la d'Unarre, al [Pallars Sobirà](/comarques/pallars-sobira). Segons Mirador, s'estén per tres termes del Pallars Sobirà (Alt Àneu, la Guingueta d'Àneu i Lladorre) i per la comuna occitana de Coflens, a la vall de Salau, i té una prominència de 648 m.",
			"El Mont-roig té tres cims en una carena de 700 m: el de llevant (2.847 m) porta el vèrtex geodèsic, el punt més alt (2.864 m) s'assoleix seguint la carena cap al nord-est, i el Mont-roig Nord (2.856 m) queda a l'extrem oest, separat del principal per una canal molt dreta, la canal Central, que en complica l'accés des del cim principal. El blog Sensus relaciona el nom amb la pedra ferruginosa, rogenca, que hi predomina, i fa notar que les vetes de la roca, de dalt a baix, recorden la glacera que va omplir la vall.",
			"Al vessant sud hi ha dos refugis: el refugi Mont-roig «Enric Pujol», a 2.287 m segons la FEEC, a l'esquerra del desguàs de l'estany Inferior de la Gallina, i el refugi de l'estany de la Gola, a 2.231 m, construït el 2010. La FEEC especifica que el primer és un refugi d'emergència: no s'hi pot fer activitat d'oci i la pernoctació només és acceptable si és imprescindible.",
			"La temporada més segura és de mitjan juliol a principi de tardor. Durant el desglaç, de juny a mitjan juliol, Sensus avisa que els rius poden ser difícils de creuar; a la primavera la pujada és una sortida amb neu, d'alta muntanya hivernal."
		],
		es: [
			'El Mont-roig es una montaña fronteriza entre Cataluña y Occitania, en la cabecera del valle de Cardós y del de Unarre, en el [Pallars Sobirà](/comarques/pallars-sobira). Según Mirador, se extiende por tres términos del Pallars Sobirà (Alt Àneu, La Guingueta d’Àneu y Lladorre) y por la comuna occitana de Coflens, en el valle de Salau, y tiene una prominencia de 648 m.',
			'El Mont-roig tiene tres cimas en una cresta de 700 m: la de levante (2.847 m) lleva el vértice geodésico, el punto más alto (2.864 m) se alcanza siguiendo la cresta hacia el nordeste, y el Mont-roig Nord (2.856 m) queda en el extremo oeste, separado del principal por una canal muy empinada, la canal Central, que complica su acceso desde la cima principal. El blog Sensus relaciona el nombre con la piedra ferruginosa, rojiza, que predomina, y señala que las vetas de la roca, de arriba abajo, recuerdan el glaciar que llenó el valle.',
			'En la vertiente sur hay dos refugios: el refugio Mont-roig «Enric Pujol», a 2.287 m según la FEEC, a la izquierda del desagüe del estany Inferior de la Gallina, y el refugio del estany de la Gola, a 2.231 m, construido en 2010. La FEEC especifica que el primero es un refugio de emergencia: no se puede hacer actividad de ocio y el pernocte solo es aceptable si es imprescindible.',
			'La temporada más segura va de mediados de julio a principios de otoño. Durante el deshielo, de junio a mediados de julio, Sensus avisa de que los ríos pueden ser difíciles de cruzar; en primavera la subida es una salida con nieve, de alta montaña invernal.'
		]
	},
	rutes: [
		{
			id: 'quanca',
			nom: {
				ca: 'Des de Quanca pel refugi Mont-roig i la carena nord-est',
				es: 'Desde Quanca por el refugio Mont-roig y la cresta nordeste'
			},
			sortida: { nom: 'Quanca (Bordes de Quanca, Lladorre; accés per Tavascan)' },
			descripcio: {
				ca: "Segons la FEEC, a Quanca s'arriba en vehicle des de Tavascan. Des d'allà es camina cap al nord, en direcció al port de Tavascan, i després es gira a l'oest per la Roia de Mollàs, pel tram de l'Alta Ruta Pirinenca, fins al refugi (2 h 45 min). El blog Sensus hi afegeix unes 2 h 15 min del refugi al cim, per l'estany de la Gallina, la collada de Mont-roig i el pic de Tartera, i calcula uns 1.200 m de desnivell en total. El darrer tram és de carena: el blog La luz de la montaña la descriu sense gaire dificultat però amb algun pas aeri, i Sensus la recomana a gent avesada a l'alta muntanya i demana compte amb les timbes. Abans del refugi hi ha trams drets entre lloses.",
				es: 'Según la FEEC, a Quanca se llega en vehículo desde Tavascan. Desde allí se camina hacia el norte, en dirección al port de Tavascan, y después se gira al oeste por la Roia de Mollàs, por el tramo de la Alta Ruta Pirenaica, hasta el refugio (2 h 45 min). El blog Sensus añade unas 2 h 15 min del refugio a la cima, por el estany de la Gallina, la collada de Mont-roig y el pic de Tartera, y calcula unos 1.200 m de desnivel en total. El último tramo es de cresta: el blog La luz de la montaña la describe sin mucha dificultad pero con algún paso aéreo, y Sensus la recomienda a gente habituada a la alta montaña y pide cuidado con los cortados. Antes del refugio hay tramos empinados entre losas.'
			},
			fonts: [FEEC_REFUGI, SENSUS, ALBERTREK, MIRADOR]
		}
	],
	consells: {
		ca: [
			"El refugi Mont-roig és d'emergència segons la FEEC: no hi comptis per pernoctar. Planifica una jornada llarga, d'unes 5 h de pujada si sumes els temps de la FEEC i de Sensus.",
			"Durant el desglaç, de juny a mitjan juliol, els rius poden ser difícils de creuar, segons Sensus; el desguàs de l'estany de la Gallina pot complicar-se amb molta aigua.",
			'Els trams drets entre lloses abans del refugi no tenen dificultat real, però Sensus no els aconsella a qui tingui vertigen.',
			'A la carena, ves amb compte amb les timbes i els passos aeris; no passis a la cresta amb vent fort.',
			'Respecta les normes del parc natural: gossos lligats, sense focs i bivac només per sobre dels 2.000 m.'
		],
		es: [
			'El refugio Mont-roig es de emergencia según la FEEC: no cuentes con él para pernoctar. Planifica una jornada larga, de unas 5 h de subida si sumas los tiempos de la FEEC y de Sensus.',
			'Durante el deshielo, de junio a mediados de julio, los ríos pueden ser difíciles de cruzar, según Sensus; el desagüe del estany de la Gallina puede complicarse con mucha agua.',
			'Los tramos empinados entre losas antes del refugio no tienen dificultad real, pero Sensus no los aconseja a quien tenga vértigo.',
			'En la cresta, ten cuidado con los precipicios y los pasos aéreos; no pases a la cresta con viento fuerte.',
			'Respeta las normas del parque natural: perros atados, sin fuegos y vivac solo por encima de los 2.000 m.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Mont-roig?',
				resposta:
					'Segons la FEEC, de Quanca al refugi són 2 h 45 min a peu. Sensus compta 2 h 15 min més del refugi al cim, 1 h 45 min de baixada fins al refugi i unes 2 h més fins al cotxe.'
			},
			{
				pregunta: 'És difícil el Mont-roig?',
				resposta:
					"Sensus el qualifica de dificultat mitjana, sobretot pel darrer tram de carena, i el recomana a gent avesada a l'alta muntanya; el blog La luz de la montaña parla d'una carena sense gaire dificultat però amb algun pas aeri. Cal bona forma i no patir vertigen."
			},
			{
				pregunta: 'Es pot dormir al refugi del Mont-roig?',
				resposta:
					"És un refugi lliure de la FEEC, de 9 places, però és d'emergència: no és per a activitats d'oci i només s'hi pot pernoctar si és imprescindible, per exemple per mal temps o un accident. No el comptis com a allotjament per a l'ascensió."
			},
			{
				pregunta: 'El Mont-roig compta com a cim essencial?',
				resposta:
					"Sí, el Mont-roig de 2.864 m és un dels onze [cims essencials](/cims-essencials) del Pallars Sobirà. El superen només la [Pica d'Estats](/cims/pica-d-estats), el [Pic de Sotllo](/cims/pic-de-sotllo) i el [Monteixo](/cims/monteixo)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Mont-roig?',
				resposta:
					'Según la FEEC, de Quanca al refugio son 2 h 45 min a pie. Sensus cuenta 2 h 15 min más del refugio a la cima, 1 h 45 min de bajada hasta el refugio y unas 2 h más hasta el coche.'
			},
			{
				pregunta: '¿Es difícil el Mont-roig?',
				resposta:
					'Sensus lo califica de dificultad media, sobre todo por el último tramo de cresta, y lo recomienda a gente habituada a la alta montaña; el blog La luz de la montaña habla de una cresta sin mucha dificultad pero con algún paso aéreo. Hace falta buena forma y no sufrir vértigo.'
			},
			{
				pregunta: '¿Se puede dormir en el refugio del Mont-roig?',
				resposta:
					'Es un refugio libre de la FEEC, de 9 plazas, pero es de emergencia: no es para actividades de ocio y solo se puede pernoctar si es imprescindible, por ejemplo por mal tiempo o un accidente. No cuentes con él como alojamiento para la ascensión.'
			},
			{
				pregunta: '¿El Mont-roig cuenta como cima esencial?',
				resposta:
					'Sí, el Mont-roig de 2.864 m es una de las once [cimas esenciales](/cims-essencials) del Pallars Sobirà. Lo superan solo la [Pica d’Estats](/cims/pica-d-estats), el [Pic de Sotllo](/cims/pic-de-sotllo) y el [Monteixo](/cims/monteixo).'
			}
		]
	},
	fonts: [MIRADOR, FEEC_REFUGI, SENSUS, ALBERTREK, PARC],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
