/**
 * Hub del repte (`/repte-100-cims`): què és el repte dels 100 Cims, qui l'organitza, com
 * funciona, cims essencials i nivells. Text propi, resumit a partir de les pàgines públiques
 * de la FEEC (vegeu `fonts`). Web no oficial: la referència vinculant és la FEEC.
 */
import type { Contingut, FontCitada } from './types.ts';

const CONSULTAT = '2026-09-29';

const FONTS_CA: FontCitada[] = [
	{
		nom: 'FEEC: Llistat «100 Cims»',
		url: 'https://www.feec.cat/activitats/100-cims/',
		consultat: CONSULTAT
	},
	{
		nom: 'FEEC: Què és el repte dels «100 Cims»?',
		url: 'https://www.feec.cat/activitats/100-cims/que-es-el-repte-dels-100-cims/',
		consultat: CONSULTAT
	},
	{
		nom: 'FEEC: Normativa i funcionament',
		url: 'https://www.feec.cat/activitats/100-cims/normativa-i-funcionament/',
		consultat: CONSULTAT
	}
];

const FONTS_ES: FontCitada[] = [
	{ ...FONTS_CA[0], nom: 'FEEC: Llistat «100 Cims» (en catalán)' },
	{ ...FONTS_CA[1], nom: 'FEEC: Què és el repte dels «100 Cims»? (en catalán)' },
	{ ...FONTS_CA[2], nom: 'FEEC: Normativa i funcionament (en catalán)' }
];

export const repte: Contingut = {
	ca: {
		title: 'Repte 100 Cims: què és i com funciona',
		description:
			'El repte 100 Cims de la FEEC explicat: 522 cims, 150 essencials, qui hi pot participar, com es validen les ascensions i els nivells de 2×100 a 5×100.',
		h1: 'Repte 100 Cims: què és i com funciona',
		intro:
			"El repte dels 100 Cims proposa pujar a cent muntanyes d'una llista de 522 cims de Catalunya, Andorra i la Catalunya Nord. Aquí t'expliquem com funciona, pas a pas i amb paraules planeres.",
		seccions: [
			{
				id: 'que-es',
				titol: 'Què és el repte dels 100 Cims',
				blocs: [
					{
						tipus: 'paragraf',
						text: "És una proposta excursionista per conèixer el país a peu: cada persona tria cent cims d'un llistat de 522 muntanyes representatives, des de turons de baixa muntanya fins als tresmils del Pirineu, i els va pujant al seu ritme. No és una competició: no hi ha classificacions ni cap termini per acabar-lo."
					},
					{
						tipus: 'paragraf',
						text: "Dins del llistat hi ha 150 cims marcats com a **essencials**, repartits per tot el territori perquè el repte no es limiti a les muntanyes més properes a casa. Des del 2019, els cent cims que compten per superar el repte han de ser d'aquesta llista (els pujats abans conserven la validesa). Els pots consultar a la [llista dels 150 cims essencials](/cims-essencials)."
					},
					{
						tipus: 'avis',
						to: 'info',
						text: 'Carnet de Cims és una web independent i **no oficial**, sense cap vinculació amb la FEEC. El que llegiràs aquí és un resum amb paraules nostres: la referència vàlida és sempre la [normativa publicada per la FEEC](https://www.feec.cat/activitats/100-cims/normativa-i-funcionament/).'
					}
				]
			},
			{
				id: 'qui-lorganitza',
				titol: 'Qui organitza el repte: la FEEC',
				blocs: [
					{
						tipus: 'paragraf',
						text: "El repte l'organitza la Federació d'Entitats Excursionistes de Catalunya (FEEC) des de l'1 de juliol de 2006. Una comissió de la mateixa federació tria els cims del llistat, n'actualitza la normativa i resol els dubtes. El llistat actual, de 522 cims, és vigent des de l'1 de juliol de 2022."
					},
					{
						tipus: 'paragraf',
						text: "Per participar-hi cal tenir **llicència federativa** (de qualsevol modalitat) i un mínim de 7 anys. La FEEC és qui valida les ascensions, sempre a través de l'entitat o club amb què la persona està federada, i cada primavera fa un reconeixement a qui ha completat el repte l'any anterior."
					}
				]
			},
			{
				id: 'com-funciona',
				titol: 'Com funciona, pas a pas',
				blocs: [
					{
						tipus: 'llista',
						ordenada: true,
						items: [
							"**Federa't** a través d'una entitat excursionista (club o centre excursionista).",
							'**Tria els cims** del llistat que et vinguin de gust: pots començar per [comarques](/comarques) o pel [mapa](/mapa).',
							'**Puja-hi** per qualsevol vessant i sense cap mitjà motoritzat: a peu, en BTT, amb esquís o amb raquetes.',
							"**Registra l'ascensió** a l'àrea privada del web de la FEEC i fes que el president o presidenta de la teva entitat signi el full de validació.",
							'**Envia el full a la FEEC** abans del 31 de desembre perquè les ascensions comptin en aquell any. Es poden validar un màxim de 100 cims per any.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'Tens el detall de cada regla a la [normativa del repte, explicada](/repte-100-cims/normativa), i el procés de validació a [com es validen les ascensions](/repte-100-cims/com-validar).'
					}
				]
			},
			{
				id: 'cims-essencials',
				titol: 'Els 150 cims essencials',
				blocs: [
					{
						tipus: 'paragraf',
						text: "Des de l'1 de juliol de 2019, per superar el repte cal fer 100 cims de la llista de 150 essencials. Els cims no essencials del llistat són vàlids, però no compten per als nivells superiors fins que no s'han completat els 100 essencials. Els cims no essencials pujats **abans** d'aquella data sí que compten per superar el repte."
					},
					{
						tipus: 'paragraf',
						text: "Entre els essencials hi ha muntanyes tan conegudes com el [Pedraforca](/cims/pedraforca-pollego-superior), la [Pica d'Estats](/cims/pica-d-estats), sostre de Catalunya amb 3.143 m, o el [Canigó](/cims/canigo), a la Catalunya Nord. També n'hi ha a [Andorra](/comarques/andorra) i en gairebé totes les comarques: el [Pallars Sobirà](/comarques/pallars-sobira) és la comarca amb més cims essencials."
					}
				]
			},
			{
				id: 'nivells',
				titol: 'Nivells del repte: de 100 a 5×100',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Un cop superat el repte dels 100 Cims, la FEEC també reconeix qui arriba a 200, 300, 400 i 500 cims del llistat: són els nivells 2×100, 3×100, 4×100 i 5×100. El reconeixement és honorífic.'
					},
					{
						tipus: 'paragraf',
						text: 'La normativa no diu explícitament si les pujades repetides a un mateix cim compten per a aquests nivells. Com que parla de cims «del llistat» i el llistat en té 522, tot apunta que es compten cims diferents. Ho expliquem millor a la [normativa](/repte-100-cims/normativa).'
					}
				]
			},
			{
				id: 'restriccions',
				titol: "Cims amb restriccions d'accés",
				blocs: [
					{
						tipus: 'paragraf',
						text: "Alguns cims tenen l'accés limitat en determinades èpoques, per exemple per la nidificació d'espècies protegides, i la FEEC no valida les ascensions fetes durant aquests períodes. Entre els essencials és el cas de [La Picossa](/cims/la-picossa), tancada del 15 de gener al 15 de juny, i de [Sant Salvador de les Espases](/cims/sant-salvador-de-les-espases), mentre durin les obres a la capella. Abans de sortir, consulta sempre la llista actualitzada de la FEEC."
					}
				]
			},
			{
				id: 'repte-infantil',
				titol: 'El repte infantil: 50 cims per a nens i nenes',
				blocs: [
					{
						tipus: 'paragraf',
						text: "Des de l'1 de juliol de 2026 hi ha una versió per a federats d'entre 7 i 14 anys: 50 cims qualssevol del llistat, sense distinció d'essencials i sense límit anual. Ho expliquem tot a la pàgina del [repte infantil](/repte-100-cims/repte-infantil)."
					}
				]
			},
			{
				id: 'per-on-comencar',
				titol: 'Per on començar',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'Mira els cims que tens més a prop a la [llista de comarques](/comarques) o al [mapa](/mapa).',
							'Si busques reptes d’alta muntanya, comença pels [tresmils](/tresmils) o pels [cims més alts](/cims-mes-alts).',
							'Consulta la [llista completa de cims](/cims), amb la fitxa, el mapa i les restriccions de cadascun.',
							'Anota cada ascensió al [teu carnet](/app): es desa al teu dispositiu, sense compte, i cada cim hi queda segellat en pàgines de la I a la V, una per cada 100 cims. Hi veus quins essencials et falten, els més propers primer si vols, i com vas a cada comarca. És un seguiment personal que no substitueix la validació de la FEEC.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'De moment, Carnet de Cims mostra els 150 cims essencials; la resta de cims del llistat s’hi aniran afegint.'
					}
				]
			}
		],
		faq: [
			{
				pregunta: 'Quants cims té el repte dels 100 Cims?',
				resposta:
					"El llistat té 522 cims de Catalunya, Andorra i la Catalunya Nord. D'aquests, 150 són essencials, i des del juliol del 2019 cal fer-ne 100 d'aquesta llista per superar el repte."
			},
			{
				pregunta: 'Cal estar federat per fer els 100 Cims?',
				resposta:
					"Sí. La normativa demana tenir llicència federativa, de qualsevol modalitat, i les ascensions les ha d'avalar l'entitat amb què estàs federat. Pots pujar els cims sense llicència, però no te'ls validaran."
			},
			{
				pregunta: 'Hi ha un termini per acabar el repte?',
				resposta:
					'No. Les ascensions no tenen termini, però només es poden validar 100 cims per any i els fulls de validació han d’arribar a la FEEC abans del 31 de desembre per comptar en aquell any.'
			},
			{
				pregunta: 'Es poden fer els cims en bicicleta o amb esquís?',
				resposta:
					'Sí. Val qualsevol mitjà no motoritzat: a peu, en BTT, amb esquís o amb raquetes de neu, i per qualsevol vessant del cim.'
			},
			{
				pregunta: 'Carnet de Cims és la web oficial del repte?',
				resposta:
					'No. Carnet de Cims és una eina independent que explica el repte i et permet anotar les teves ascensions per seguir el progrés. La normativa, el llistat oficial i la validació són de la FEEC: consulta sempre el [web de la FEEC](https://www.feec.cat/activitats/100-cims/).'
			}
		],
		fonts: FONTS_CA,
		actualitzat: '2026-09-30'
	},
	es: {
		title: 'Reto 100 Cims: qué es y cómo funciona',
		description:
			'El reto 100 Cims de la FEEC explicado: 522 cimas, 150 esenciales, quién puede participar, cómo se validan las ascensiones y los niveles de 2×100 a 5×100.',
		h1: 'Reto 100 Cims: qué es y cómo funciona',
		intro:
			'El reto de los 100 Cims consiste en subir cien montañas de una lista de 522 cimas de Cataluña, Andorra y la Cataluña Norte. Te contamos cómo funciona, paso a paso y sin tecnicismos.',
		seccions: [
			{
				id: 'que-es',
				titol: 'Qué es el reto de los 100 Cims',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Es una propuesta excursionista para conocer el territorio a pie: cada persona elige cien cimas de una lista de 522 montañas representativas, desde colinas de baja montaña hasta los tresmiles del Pirineo, y las va subiendo a su ritmo. No es una competición: no hay clasificaciones ni plazo para terminarlo.'
					},
					{
						tipus: 'paragraf',
						text: 'Dentro de la lista hay 150 cimas marcadas como **esenciales** («essencials»), repartidas por todo el territorio para que el reto no se quede en las montañas más cercanas a casa. Desde 2019, las cien cimas que cuentan para superar el reto tienen que ser de esa lista (las subidas antes conservan su validez). Puedes consultarlas en la [lista de las 150 cimas esenciales](/cims-essencials).'
					},
					{
						tipus: 'avis',
						to: 'info',
						text: 'Carnet de Cims es una web independiente y **no oficial**, sin ninguna vinculación con la FEEC. Lo que leerás aquí es un resumen con nuestras palabras: la referencia válida es siempre la [normativa publicada por la FEEC](https://www.feec.cat/activitats/100-cims/normativa-i-funcionament/), en catalán.'
					}
				]
			},
			{
				id: 'qui-lorganitza',
				titol: 'Quién organiza el reto: la FEEC',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Lo organiza la Federació d’Entitats Excursionistes de Catalunya (FEEC) desde el 1 de julio de 2006. Una comisión de la propia federación elige las cimas de la lista, actualiza la normativa y resuelve las dudas. La lista actual, de 522 cimas, está vigente desde el 1 de julio de 2022.'
					},
					{
						tipus: 'paragraf',
						text: 'Para participar hay que tener **licencia federativa** (de cualquier modalidad) y un mínimo de 7 años. La FEEC es quien valida las ascensiones, siempre a través de la entidad o club con el que la persona está federada, y cada primavera reconoce a quienes completaron el reto el año anterior.'
					}
				]
			},
			{
				id: 'com-funciona',
				titol: 'Cómo funciona, paso a paso',
				blocs: [
					{
						tipus: 'llista',
						ordenada: true,
						items: [
							'**Federarte** a través de una entidad excursionista (club o centro excursionista).',
							'**Elegir las cimas** de la lista que te apetezcan: puedes empezar por [comarcas](/comarques) o por el [mapa](/mapa).',
							'**Subirlas** por cualquier vertiente y sin ningún medio motorizado: a pie, en BTT, con esquís o con raquetas.',
							'**Registrar la ascensión** en el área privada de la web de la FEEC y conseguir que el presidente o presidenta de tu entidad firme la hoja de validación.',
							'**Enviar la hoja a la FEEC** antes del 31 de diciembre para que las ascensiones cuenten ese año. Se pueden validar como máximo 100 cimas al año.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'Tienes el detalle de cada regla en la [normativa del reto, explicada](/repte-100-cims/normativa), y el proceso de validación en [cómo se validan las ascensiones](/repte-100-cims/com-validar).'
					}
				]
			},
			{
				id: 'cims-essencials',
				titol: 'Las 150 cimas esenciales',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Desde el 1 de julio de 2019, para superar el reto hay que hacer 100 cimas de la lista de 150 esenciales. Las cimas no esenciales de la lista son válidas, pero no cuentan para los niveles superiores hasta completar las 100 esenciales. Las no esenciales subidas **antes** de esa fecha sí cuentan para superar el reto.'
					},
					{
						tipus: 'paragraf',
						text: 'Entre las esenciales hay montañas tan conocidas como el [Pedraforca](/cims/pedraforca-pollego-superior), la [Pica d’Estats](/cims/pica-d-estats), techo de Cataluña con 3.143 m, o el [Canigó](/cims/canigo), en la Cataluña Norte. También las hay en [Andorra](/comarques/andorra) y en casi todas las comarcas: el [Pallars Sobirà](/comarques/pallars-sobira) es la comarca con más cimas esenciales.'
					}
				]
			},
			{
				id: 'nivells',
				titol: 'Niveles del reto: de 100 a 5×100',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Una vez superado el reto de los 100 Cims, la FEEC también reconoce a quien llega a 200, 300, 400 y 500 cimas de la lista: son los niveles 2×100, 3×100, 4×100 y 5×100. El reconocimiento es honorífico.'
					},
					{
						tipus: 'paragraf',
						text: 'La normativa no dice de forma explícita si las subidas repetidas a una misma cima cuentan para estos niveles. Como habla de cimas «de la lista» y la lista tiene 522, todo apunta a que se cuentan cimas distintas. Lo explicamos mejor en la [normativa](/repte-100-cims/normativa).'
					}
				]
			},
			{
				id: 'restriccions',
				titol: 'Cimas con restricciones de acceso',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Algunas cimas tienen el acceso limitado en ciertas épocas, por ejemplo por la nidificación de especies protegidas, y la FEEC no valida las ascensiones hechas durante esos periodos. Entre las esenciales es el caso de [La Picossa](/cims/la-picossa), cerrada del 15 de enero al 15 de junio, y de [Sant Salvador de les Espases](/cims/sant-salvador-de-les-espases), mientras duren las obras en la capilla. Antes de salir, consulta siempre la lista actualizada de la FEEC.'
					}
				]
			},
			{
				id: 'repte-infantil',
				titol: 'El reto infantil: 50 cimas para niños y niñas',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Desde el 1 de julio de 2026 existe una versión para federados de entre 7 y 14 años: 50 cimas cualesquiera de la lista, sin distinguir esenciales y sin límite anual. Lo explicamos todo en la página del [reto infantil](/repte-100-cims/repte-infantil).'
					}
				]
			},
			{
				id: 'per-on-comencar',
				titol: 'Por dónde empezar',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'Mira qué cimas tienes más cerca en la [lista de comarcas](/comarques) o en el [mapa](/mapa).',
							'Si buscas alta montaña, empieza por los [tresmiles](/tresmils) o por las [cimas más altas](/cims-mes-alts).',
							'Consulta la [lista completa de cimas](/cims), con la ficha, el mapa y las restricciones de cada una.',
							'Anota cada ascensión en [tu carnet](/app): se guarda en tu dispositivo, sin cuenta, y cada cima queda sellada en páginas de la I a la V, una por cada 100 cimas. Ves qué esenciales te faltan, las más cercanas primero si quieres, y cómo vas en cada comarca. Es un seguimiento personal que no sustituye la validación de la FEEC.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'Por ahora, Carnet de Cims muestra las 150 cimas esenciales; el resto de cimas de la lista se irán añadiendo.'
					}
				]
			}
		],
		faq: [
			{
				pregunta: '¿Cuántas cimas tiene el reto de los 100 Cims?',
				resposta:
					'La lista tiene 522 cimas de Cataluña, Andorra y la Cataluña Norte. De ellas, 150 son esenciales, y desde julio de 2019 hay que hacer 100 de esa lista para superar el reto.'
			},
			{
				pregunta: '¿Hay que estar federado para hacer los 100 Cims?',
				resposta:
					'Sí. La normativa exige licencia federativa, de cualquier modalidad, y las ascensiones las tiene que avalar la entidad con la que estás federado. Puedes subir las cimas sin licencia, pero no te las validarán.'
			},
			{
				pregunta: '¿Hay un plazo para terminar el reto?',
				resposta:
					'No. Las ascensiones no tienen plazo, pero solo se pueden validar 100 cimas al año y las hojas de validación deben llegar a la FEEC antes del 31 de diciembre para contar ese año.'
			},
			{
				pregunta: '¿Se pueden hacer las cimas en bicicleta o con esquís?',
				resposta:
					'Sí. Vale cualquier medio no motorizado: a pie, en BTT, con esquís o con raquetas de nieve, y por cualquier vertiente de la cima.'
			},
			{
				pregunta: '¿Carnet de Cims es la web oficial del reto?',
				resposta:
					'No. Carnet de Cims es una herramienta independiente que explica el reto y te permite anotar tus ascensiones para seguir tu progreso. La normativa, la lista oficial y la validación son de la FEEC: consulta siempre la [web de la FEEC](https://www.feec.cat/activitats/100-cims/).'
			}
		],
		fonts: FONTS_ES,
		actualitzat: '2026-09-30'
	}
};
