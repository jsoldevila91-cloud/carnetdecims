/**
 * Normativa del repte explicada (`/repte-100-cims/normativa`). Redacció pròpia i resumida de la
 * normativa de la FEEC (vigent des de l'1 de gener de 2024; repte infantil, des de l'1 de juliol
 * de 2026). On el text oficial és ambigu (docs/03-modelo-datos.md §3.3) es diu obertament.
 */
import type { Contingut, FontCitada } from './types.ts';

const CONSULTAT = '2026-09-29';
const URL_NORMATIVA = 'https://www.feec.cat/activitats/100-cims/normativa-i-funcionament/';
const URL_RESTRICCIONS = 'https://www.feec.cat/activitats/100-cims/cims-amb-restriccions-dacces/';

const FONTS_CA: FontCitada[] = [
	{ nom: 'FEEC: Normativa i funcionament', url: URL_NORMATIVA, consultat: CONSULTAT },
	{ nom: "FEEC: Cims amb restriccions d'accés", url: URL_RESTRICCIONS, consultat: CONSULTAT },
	{
		nom: 'FEEC: Què és el repte dels «100 Cims»?',
		url: 'https://www.feec.cat/activitats/100-cims/que-es-el-repte-dels-100-cims/',
		consultat: CONSULTAT
	}
];

const FONTS_ES: FontCitada[] = FONTS_CA.map((f) => ({ ...f, nom: `${f.nom} (en catalán)` }));

export const normativa: Contingut = {
	ca: {
		title: 'Normativa del repte 100 Cims, explicada',
		description:
			'Les regles del repte 100 Cims en clar: llicència federativa, cims essencials, límit de 100 cims per any, mètodes vàlids, restriccions i nivells.',
		h1: 'Normativa del repte 100 Cims, explicada',
		intro:
			"Totes les regles del repte en un sol lloc i amb paraules planeres: qui hi pot participar, quins cims compten, com es validen i què passa amb els essencials. Quan la normativa no és clara, t'ho diem.",
		seccions: [
			{
				id: 'resum',
				titol: 'La normativa en 8 punts',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'Cal tenir **llicència federativa**, de qualsevol modalitat, i com a mínim 7 anys.',
							"Només compten els **522 cims del llistat** de la FEEC, pujats a partir de l'1 de juliol de 2006.",
							'Val qualsevol vessant i qualsevol mitjà **no motoritzat**: a peu, en BTT, amb esquís o amb raquetes.',
							"Des de l'1 de juliol de 2019, els 100 cims han de ser de la llista de **150 essencials**.",
							'Es poden validar com a màxim **100 cims per any**, amb els fulls a la FEEC abans del 31 de desembre.',
							"Cada ascensió l'ha d'avalar el president o presidenta de la teva **entitat**.",
							'Els cims amb **restriccions d’accés** no es validen si es pugen dins del període restringit.',
							'Hi ha reconeixements per a **2×100, 3×100, 4×100 i 5×100** cims i un **repte infantil** de 50 cims.'
						]
					},
					{
						tipus: 'avis',
						to: 'alerta',
						text: "Aquesta és una explicació **no oficial** feta per Carnet de Cims, una web independent sense vinculació amb la FEEC. L'únic text vinculant és la [normativa publicada per la FEEC](https://www.feec.cat/activitats/100-cims/normativa-i-funcionament/), vigent des de l'1 de gener de 2024. Si hi trobes cap diferència, val la de la FEEC."
					}
				]
			},
			{
				id: 'qui-hi-pot-participar',
				titol: 'Qui hi pot participar',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Qualsevol persona amb **llicència federativa**, sigui quin sigui el tipus de llicència, a partir dels 7 anys. El repte no és una competició: no hi ha classificacions per nombre de cims ni per rapidesa, i el reconeixement és honorífic.'
					},
					{
						tipus: 'paragraf',
						text: "La normativa no especifica si la llicència ha d'estar en vigor el mateix dia de cada ascensió o només en el moment de registrar-la i validar-la. Si tens dubtes sobre ascensions fetes en un període sense llicència, consulta-ho amb la teva entitat o amb la comissió dels 100 Cims (100cims@feec.cat)."
					}
				]
			},
			{
				id: 'cims-puntuables',
				titol: 'Quins cims compten i des de quan',
				blocs: [
					{
						tipus: 'paragraf',
						text: "Només puntuen els cims del llistat de la FEEC: 522 muntanyes de Catalunya, Andorra i la Catalunya Nord, vigent des de l'1 de juliol de 2022. Pots explorar-los per [comarques](/comarques), al [mapa](/mapa) o a la [llista de cims](/cims)."
					},
					{
						tipus: 'paragraf',
						text: "Valen les ascensions fetes a partir de l'**1 de juliol de 2006**, data d'inici del repte, a qualsevol cim del llistat vigent. No hi ha cap termini per completar el repte, ni un mínim o un màxim de cims per dia."
					}
				]
			},
			{
				id: 'metodes-valids',
				titol: 'Com s’ha de pujar: mètodes vàlids',
				blocs: [
					{
						tipus: 'paragraf',
						text: "El cim es pot assolir per qualsevol vessant. L'esperit és excursionista, de manera que no es pot fer servir cap mitjà motoritzat. En canvi, sí que valen:"
					},
					{
						tipus: 'llista',
						items: [
							'A peu.',
							'En bicicleta de muntanya (BTT).',
							'Amb esquís.',
							'Amb raquetes de neu.'
						]
					},
					{
						tipus: 'paragraf',
						text: "La normativa no defineix des d'on s'ha de començar a caminar ni un desnivell mínim: el que demana és que el cim es guanyi sense motor."
					}
				]
			},
			{
				id: 'cims-essencials',
				titol: 'Els cims essencials i la regla del 2019',
				blocs: [
					{
						tipus: 'paragraf',
						text: "Des de l'**1 de juliol de 2019**, per superar el repte dels 100 Cims cal fer 100 cims de la llista de [150 essencials](/cims-essencials). La comissió els va triar perquè el repte obligui a conèixer tot el territori, i no només les muntanyes properes a casa. L'ampliació del llistat a 522 cims, el 2022, no va canviar quins són els essencials."
					},
					{
						tipus: 'llista',
						items: [
							'Els cims **no essencials** pujats **abans** de l’1 de juliol de 2019 compten per superar el repte.',
							'Els cims no essencials pujats després d’aquesta data són vàlids, però no es tenen en compte per als nivells 2×100 a 5×100 fins que no has completat els 100 essencials.'
						]
					},
					{
						tipus: 'paragraf',
						text: "**Punt no aclarit:** la normativa no concreta si, un cop fets els 100 essencials, els no essencials pujats abans compten de manera retroactiva per a 2×100 o si només compten els que facis a partir d'aquell moment. Alguns clubs l'expliquen de la primera manera, però la normativa no ho diu enlloc."
					}
				]
			},
			{
				id: 'limit-anual',
				titol: 'Límit de 100 cims per any i terminis',
				blocs: [
					{
						tipus: 'paragraf',
						text: "Cada persona pot presentar un màxim de **100 cims per validar cada any**. Els fulls de validació han d'arribar a la FEEC abans del **31 de desembre** perquè el repte es consideri assolit dins d'aquell any."
					},
					{
						tipus: 'paragraf',
						text: "A més, un cim registrat al web de la FEEC té un any de vigència: si passa més d'un any sense que s'hagi presentat el full de validació, s'esborra i l'hauràs de tornar a registrar."
					},
					{
						tipus: 'paragraf',
						text: "**Punt no aclarit:** el límit es refereix als cims que es presenten per validar, no a les ascensions que fas. La normativa no diu explícitament si els cims que passin de 100 en un any es poden presentar l'any següent, tot i que, com que les ascensions no tenen termini, sembla que sí."
					}
				]
			},
			{
				id: 'nivells',
				titol: 'Nivells: 100, 2×100, 3×100, 4×100 i 5×100',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Cada any, la FEEC reconeix les persones que han completat els 100 Cims i les que arriben a 200, 300, 400 o 500 cims del llistat. També reconeix les entitats que superen les 2.000 ascensions dels seus socis.'
					},
					{
						tipus: 'paragraf',
						text: '**Punt no aclarit:** la normativa no diu si repetir un cim compta per als nivells. Parla de cims «del llistat» i 5×100 són 500 de 522 possibles, cosa que apunta a cims diferents. El criteri de Carnet de Cims és comptar cims diferents i guardar les repeticions només com a historial.'
					}
				]
			},
			{
				id: 'restriccions-acces',
				titol: "Cims amb restriccions d'accés",
				blocs: [
					{
						tipus: 'paragraf',
						text: "La FEEC publica una llista de cims amb l'accés restringit i **no valida les ascensions fetes dins del període de restricció**. Quan hem consultat la llista hi havia quatre cims:"
					},
					{
						tipus: 'llista',
						items: [
							'[La Picossa](/cims/la-picossa), essencial: accés prohibit del 15 de gener al 15 de juny per la nidificació d’espècies amenaçades.',
							'Les Càrcoles: mateixa restricció i mateix període que La Picossa.',
							'[Sant Salvador de les Espases](/cims/sant-salvador-de-les-espases), essencial: no es validen les ascensions mentre durin les obres de la capella.',
							'Roc Roi: no es validen les ascensions de l’1 de desembre a l’1 de juny, època d’hivernada i cria del gall fer.'
						]
					},
					{
						tipus: 'avis',
						to: 'alerta',
						text: 'Aquestes restriccions poden canviar o ampliar-se. Abans de sortir, consulta la [llista vigent de la FEEC](https://www.feec.cat/activitats/100-cims/cims-amb-restriccions-dacces/).'
					}
				]
			},
			{
				id: 'validacio',
				titol: 'Com es validen les ascensions',
				blocs: [
					{
						tipus: 'paragraf',
						text: "Registres el cim a l'àrea privada del web de la FEEC i el president o presidenta de la teva entitat signa i segella un full de validació, que s'envia a la FEEC. Fins que no arriba aquest full, el cim no compta. Tens el procés complet a [com es validen les ascensions](/repte-100-cims/com-validar)."
					}
				]
			},
			{
				id: 'repte-infantil',
				titol: 'El repte infantil',
				blocs: [
					{
						tipus: 'paragraf',
						text: "Des de l'1 de juliol de 2026, els federats d'entre 7 i 14 anys tenen un repte propi: 50 cims qualssevol dels 522, sense distinció d'essencials ni límit anual. Aquests cims també compten per als 100 Cims, amb les regles habituals. Més detalls al [repte infantil](/repte-100-cims/repte-infantil)."
					}
				]
			},
			{
				id: 'punts-no-aclarits',
				titol: 'Què no aclareix la normativa',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Per ser honestos, hi ha qüestions que el text oficial no resol. Mentre no hi hagi una resposta de la FEEC, aquest és el criteri que segueix Carnet de Cims:'
					},
					{
						tipus: 'llista',
						items: [
							'**Repeticions:** per als nivells compten cims diferents; les repeticions queden com a historial.',
							'**Més de 100 cims en un any:** un avís informatiu, sense bloquejar el registre.',
							'**No essencials després de fer els 100:** compten per a 2×100 també si són anteriors, com ho expliquen alguns clubs.',
							'**Llicència el dia de l’ascensió:** no es comprova; és cosa teva i de la teva entitat.',
							'**Cims que surtin del llistat en el futur:** les ascensions es conserven a l’historial, però no sabem si la FEEC les continuarà comptant.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'Per a qualsevol cas concret, la comissió dels 100 Cims resol els dubtes a 100cims@feec.cat.'
					}
				]
			}
		],
		faq: [
			{
				pregunta: 'Quants cims es poden validar en un any?',
				resposta:
					'Un màxim de 100 cims per any. Els fulls de validació han d’arribar a la FEEC abans del 31 de desembre perquè comptin en aquell any.'
			},
			{
				pregunta: 'Els cims no essencials serveixen per a alguna cosa?',
				resposta:
					'Sí. Són vàlids i compten per als nivells 2×100 a 5×100, però no es tenen en compte per a aquests nivells fins que no has fet els 100 essencials. Si els vas pujar abans de l’1 de juliol de 2019, també compten per superar el repte.'
			},
			{
				pregunta: 'Em compten els cims que vaig fer abans del 2019?',
				resposta:
					"Sí. Qualsevol cim del llistat pujat entre l'1 de juliol de 2006 i el 30 de juny de 2019 compta per superar el repte, sigui essencial o no."
			},
			{
				pregunta: 'Compten les ascensions repetides a un mateix cim?',
				resposta:
					'La normativa no ho especifica. Com que els nivells es refereixen a cims «del llistat», el més probable és que només comptin cims diferents. En cas de dubte, pregunta-ho a 100cims@feec.cat.'
			},
			{
				pregunta: 'Hi ha data límit per completar el repte?',
				resposta:
					'No. Les ascensions no tenen termini. Només cal respectar el límit de 100 cims validats per any i l’any de vigència dels cims registrats al web de la FEEC.'
			},
			{
				pregunta: 'Què passa si pujo un cim amb restricció dins del període prohibit?',
				resposta:
					'La FEEC no valida les ascensions fetes durant el període de restricció. A més, en la majoria de casos la restricció protegeix fauna amenaçada: respecta-la.'
			}
		],
		fonts: FONTS_CA,
		actualitzat: '2026-09-29'
	},
	es: {
		title: 'Normativa del reto 100 Cims, explicada',
		description:
			'Las reglas del reto 100 Cims, explicadas: licencia federativa, cimas esenciales, límite de 100 cimas al año, métodos válidos, restricciones y niveles.',
		h1: 'Normativa del reto 100 Cims, explicada',
		intro:
			'Todas las reglas del reto en un solo sitio y en lenguaje claro: quién puede participar, qué cimas cuentan, cómo se validan y qué pasa con las esenciales. Cuando la normativa no es clara, te lo decimos.',
		seccions: [
			{
				id: 'resum',
				titol: 'La normativa en 8 puntos',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'Hace falta **licencia federativa**, de cualquier modalidad, y tener al menos 7 años.',
							'Solo cuentan las **522 cimas de la lista** de la FEEC, subidas a partir del 1 de julio de 2006.',
							'Vale cualquier vertiente y cualquier medio **no motorizado**: a pie, en BTT, con esquís o con raquetas.',
							'Desde el 1 de julio de 2019, las 100 cimas deben ser de la lista de **150 esenciales**.',
							'Se pueden validar como máximo **100 cimas al año**, con las hojas en la FEEC antes del 31 de diciembre.',
							'Cada ascensión la tiene que avalar el presidente o presidenta de tu **entidad**.',
							'Las cimas con **restricciones de acceso** no se validan si se suben dentro del periodo restringido.',
							'Hay reconocimientos para **2×100, 3×100, 4×100 y 5×100** cimas y un **reto infantil** de 50 cimas.'
						]
					},
					{
						tipus: 'avis',
						to: 'alerta',
						text: 'Esta es una explicación **no oficial** de Carnet de Cims, una web independiente sin vinculación con la FEEC. El único texto vinculante es la [normativa publicada por la FEEC](https://www.feec.cat/activitats/100-cims/normativa-i-funcionament/), en catalán y vigente desde el 1 de enero de 2024. Si encuentras alguna diferencia, vale la de la FEEC.'
					}
				]
			},
			{
				id: 'qui-hi-pot-participar',
				titol: 'Quién puede participar',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Cualquier persona con **licencia federativa**, sea cual sea el tipo de licencia, a partir de los 7 años. El reto no es una competición: no hay clasificaciones por número de cimas ni por rapidez, y el reconocimiento es honorífico.'
					},
					{
						tipus: 'paragraf',
						text: 'La normativa no especifica si la licencia tiene que estar en vigor el mismo día de cada ascensión o solo al registrarla y validarla. Si tienes dudas sobre ascensiones hechas en un periodo sin licencia, consúltalo con tu entidad o con la comisión de los 100 Cims (100cims@feec.cat).'
					}
				]
			},
			{
				id: 'cims-puntuables',
				titol: 'Qué cimas cuentan y desde cuándo',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Solo puntúan las cimas de la lista de la FEEC: 522 montañas de Cataluña, Andorra y la Cataluña Norte, vigente desde el 1 de julio de 2022. Puedes explorarlas por [comarcas](/comarques), en el [mapa](/mapa) o en la [lista de cimas](/cims).'
					},
					{
						tipus: 'paragraf',
						text: 'Valen las ascensiones hechas a partir del **1 de julio de 2006**, fecha de inicio del reto, a cualquier cima de la lista vigente. No hay plazo para completar el reto, ni un mínimo o un máximo de cimas por día.'
					}
				]
			},
			{
				id: 'metodes-valids',
				titol: 'Cómo hay que subir: métodos válidos',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'La cima se puede alcanzar por cualquier vertiente. El espíritu es excursionista, así que no se puede usar ningún medio motorizado. En cambio, sí valen:'
					},
					{
						tipus: 'llista',
						items: [
							'A pie.',
							'En bicicleta de montaña (BTT).',
							'Con esquís.',
							'Con raquetas de nieve.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'La normativa no define desde dónde hay que empezar a caminar ni un desnivel mínimo: lo que pide es que la cima se gane sin motor.'
					}
				]
			},
			{
				id: 'cims-essencials',
				titol: 'Las cimas esenciales y la regla de 2019',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Desde el **1 de julio de 2019**, para superar el reto de los 100 Cims hay que hacer 100 cimas de la lista de [150 esenciales](/cims-essencials). La comisión las eligió para que el reto obligue a conocer todo el territorio y no solo las montañas cercanas a casa. La ampliación de la lista a 522 cimas, en 2022, no cambió cuáles son las esenciales.'
					},
					{
						tipus: 'llista',
						items: [
							'Las cimas **no esenciales** subidas **antes** del 1 de julio de 2019 cuentan para superar el reto.',
							'Las no esenciales subidas después de esa fecha son válidas, pero no se tienen en cuenta para los niveles 2×100 a 5×100 hasta que completas las 100 esenciales.'
						]
					},
					{
						tipus: 'paragraf',
						text: '**Punto sin aclarar:** la normativa no concreta si, una vez hechas las 100 esenciales, las no esenciales subidas antes cuentan de forma retroactiva para 2×100 o si solo cuentan las que hagas a partir de ese momento. Algunos clubes lo explican de la primera forma, pero la normativa no lo dice en ningún sitio.'
					}
				]
			},
			{
				id: 'limit-anual',
				titol: 'Límite de 100 cimas al año y plazos',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Cada persona puede presentar como máximo **100 cimas para validar cada año**. Las hojas de validación tienen que llegar a la FEEC antes del **31 de diciembre** para que el reto se considere conseguido dentro de ese año.'
					},
					{
						tipus: 'paragraf',
						text: 'Además, una cima registrada en la web de la FEEC tiene un año de vigencia: si pasa más de un año sin que se haya presentado la hoja de validación, se borra y tendrás que volver a registrarla.'
					},
					{
						tipus: 'paragraf',
						text: '**Punto sin aclarar:** el límite se refiere a las cimas que se presentan para validar, no a las ascensiones que haces. La normativa no dice de forma explícita si las cimas que pasen de 100 en un año se pueden presentar el año siguiente, aunque, como las ascensiones no tienen plazo, parece que sí.'
					}
				]
			},
			{
				id: 'nivells',
				titol: 'Niveles: 100, 2×100, 3×100, 4×100 y 5×100',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Cada año, la FEEC reconoce a las personas que han completado los 100 Cims y a las que llegan a 200, 300, 400 o 500 cimas de la lista. También reconoce a las entidades que superan las 2.000 ascensiones de sus socios.'
					},
					{
						tipus: 'paragraf',
						text: '**Punto sin aclarar:** la normativa no dice si repetir una cima cuenta para los niveles. Habla de cimas «de la lista» y 5×100 son 500 de 522 posibles, lo que apunta a cimas distintas. El criterio de Carnet de Cims es contar cimas distintas y guardar las repeticiones solo como historial.'
					}
				]
			},
			{
				id: 'restriccions-acces',
				titol: 'Cimas con restricciones de acceso',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'La FEEC publica una lista de cimas con acceso restringido y **no valida las ascensiones hechas dentro del periodo de restricción**. Cuando la consultamos había cuatro cimas:'
					},
					{
						tipus: 'llista',
						items: [
							'[La Picossa](/cims/la-picossa), esencial: acceso prohibido del 15 de enero al 15 de junio por la nidificación de especies amenazadas.',
							'Les Càrcoles: misma restricción y mismo periodo que La Picossa.',
							'[Sant Salvador de les Espases](/cims/sant-salvador-de-les-espases), esencial: no se validan las ascensiones mientras duren las obras de la capilla.',
							'Roc Roi: no se validan las ascensiones del 1 de diciembre al 1 de junio, época de invernada y cría del urogallo.'
						]
					},
					{
						tipus: 'avis',
						to: 'alerta',
						text: 'Estas restricciones pueden cambiar o ampliarse. Antes de salir, consulta la [lista vigente de la FEEC](https://www.feec.cat/activitats/100-cims/cims-amb-restriccions-dacces/).'
					}
				]
			},
			{
				id: 'validacio',
				titol: 'Cómo se validan las ascensiones',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Registras la cima en el área privada de la web de la FEEC y el presidente o presidenta de tu entidad firma y sella una hoja de validación, que se envía a la FEEC. Hasta que no llega esa hoja, la cima no cuenta. Tienes el proceso completo en [cómo se validan las ascensiones](/repte-100-cims/com-validar).'
					}
				]
			},
			{
				id: 'repte-infantil',
				titol: 'El reto infantil',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Desde el 1 de julio de 2026, los federados de entre 7 y 14 años tienen un reto propio: 50 cimas cualesquiera de las 522, sin distinguir esenciales ni límite anual. Esas cimas también cuentan para los 100 Cims, con las reglas habituales. Más detalles en el [reto infantil](/repte-100-cims/repte-infantil).'
					}
				]
			},
			{
				id: 'punts-no-aclarits',
				titol: 'Lo que la normativa no aclara',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Siendo honestos, hay cuestiones que el texto oficial no resuelve. Mientras no haya una respuesta de la FEEC, este es el criterio que sigue Carnet de Cims:'
					},
					{
						tipus: 'llista',
						items: [
							'**Repeticiones:** para los niveles cuentan cimas distintas; las repeticiones quedan como historial.',
							'**Más de 100 cimas en un año:** un aviso informativo, sin bloquear el registro.',
							'**No esenciales después de hacer las 100:** cuentan para 2×100 también si son anteriores, como lo explican algunos clubes.',
							'**Licencia el día de la ascensión:** no se comprueba; es cosa tuya y de tu entidad.',
							'**Cimas que salgan de la lista en el futuro:** las ascensiones se conservan en el historial, pero no sabemos si la FEEC las seguirá contando.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'Para cualquier caso concreto, la comisión de los 100 Cims resuelve las dudas en 100cims@feec.cat.'
					}
				]
			}
		],
		faq: [
			{
				pregunta: '¿Cuántas cimas se pueden validar en un año?',
				resposta:
					'Como máximo 100 cimas al año. Las hojas de validación tienen que llegar a la FEEC antes del 31 de diciembre para que cuenten ese año.'
			},
			{
				pregunta: '¿Sirven de algo las cimas no esenciales?',
				resposta:
					'Sí. Son válidas y cuentan para los niveles 2×100 a 5×100, pero no se tienen en cuenta para esos niveles hasta que haces las 100 esenciales. Si las subiste antes del 1 de julio de 2019, también cuentan para superar el reto.'
			},
			{
				pregunta: '¿Me cuentan las cimas que hice antes de 2019?',
				resposta:
					'Sí. Cualquier cima de la lista subida entre el 1 de julio de 2006 y el 30 de junio de 2019 cuenta para superar el reto, sea esencial o no.'
			},
			{
				pregunta: '¿Cuentan las ascensiones repetidas a una misma cima?',
				resposta:
					'La normativa no lo especifica. Como los niveles se refieren a cimas «de la lista», lo más probable es que solo cuenten cimas distintas. Si tienes dudas, pregúntalo en 100cims@feec.cat.'
			},
			{
				pregunta: '¿Hay fecha límite para completar el reto?',
				resposta:
					'No. Las ascensiones no tienen plazo. Solo hay que respetar el límite de 100 cimas validadas al año y el año de vigencia de las cimas registradas en la web de la FEEC.'
			},
			{
				pregunta: '¿Qué pasa si subo una cima con restricción dentro del periodo prohibido?',
				resposta:
					'La FEEC no valida las ascensiones hechas durante el periodo de restricción. Además, en la mayoría de casos la restricción protege fauna amenazada: respétala.'
			}
		],
		fonts: FONTS_ES,
		actualitzat: '2026-09-29'
	}
};
