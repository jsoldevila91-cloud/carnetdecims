/**
 * Com es validen les ascensions del repte (`/repte-100-cims/com-validar`): el procés oficial
 * (entitat + FEEC) i què fa i què no fa Carnet de Cims, que només és un seguiment personal.
 */
import type { Contingut, FontCitada } from './types.ts';

const CONSULTAT = '2026-09-29';
const URL_REGISTRA = 'https://www.feec.cat/activitats/100-cims/registra-el-teu-cim/';

const FONTS_CA: FontCitada[] = [
	{ nom: 'FEEC: Registra el teu cim', url: URL_REGISTRA, consultat: CONSULTAT },
	{
		nom: 'FEEC: Normativa i funcionament',
		url: 'https://www.feec.cat/activitats/100-cims/normativa-i-funcionament/',
		consultat: CONSULTAT
	},
	{
		nom: "FEEC: Full de validació de l'ascensió (individual, PDF)",
		url: 'https://www.feec.cat/wp-content/uploads/2022/11/full_validacio_100_cims_individual_v2.pdf',
		consultat: CONSULTAT
	},
	{
		nom: "FEEC: Full de validació de l'ascensió (grup, PDF)",
		url: 'https://www.feec.cat/wp-content/uploads/2022/11/full_validacio_100_cims_grup_v2.pdf',
		consultat: CONSULTAT
	}
];

const FONTS_ES: FontCitada[] = FONTS_CA.map((f) => ({ ...f, nom: `${f.nom} (en catalán)` }));

export const comValidar: Contingut = {
	ca: {
		title: 'Com validar els cims del repte 100 Cims',
		description:
			"Com es validen les ascensions del repte 100 Cims: registre al web de la FEEC, full signat per l'entitat, terminis i què fa (i què no) Carnet de Cims.",
		h1: 'Com es validen les ascensions del repte 100 Cims',
		intro:
			"Les ascensions les valida la FEEC, sempre a través de l'entitat amb què estàs federat. T'expliquem els passos, els terminis i per què Carnet de Cims no valida res.",
		seccions: [
			{
				id: 'qui-valida',
				titol: 'Qui valida les ascensions',
				blocs: [
					{
						tipus: 'paragraf',
						text: "La validació és cosa de dues parts: el **president o presidenta de la teva entitat** (el club o centre excursionista amb què estàs federat), que avala l'ascensió amb la seva signatura i el segell de l'entitat, i la **FEEC**, que rep el full i compta el cim. Sense aquest full, un cim registrat no compta."
					},
					{
						tipus: 'avis',
						to: 'info',
						text: 'Carnet de Cims **no valida cap ascensió** ni està connectat amb la FEEC: és un seguiment personal i no oficial. Per validar els cims has de seguir el procés de la [FEEC](https://www.feec.cat/activitats/100-cims/registra-el-teu-cim/).'
					}
				]
			},
			{
				id: 'passos',
				titol: 'Pas a pas: de la muntanya a la validació',
				blocs: [
					{
						tipus: 'llista',
						ordenada: true,
						items: [
							"**Puja el cim** d'acord amb la [normativa](/repte-100-cims/normativa): per qualsevol vessant, sense mitjans motoritzats i fora dels períodes de restricció.",
							"**Identifica't al web de la FEEC** amb les teves dades de federat i, a l'àrea privada, registra el cim a l'apartat de registre de cims.",
							"**Omple el full de validació**: l'individual, si hi vas sol o sola, o el de grup, si és una sortida col·lectiva.",
							'**Fes-lo signar i segellar** pel president o presidenta de la teva entitat.',
							"**Envia'l a la FEEC**: per correu electrònic a 100cims@feec.cat, per correu postal o en persona a la seu de la federació.",
							'**Espera la validació**: fins que la FEEC no rep el full, el cim no et compta.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'Tens els formularis i les adreces actualitzades a la pàgina [Registra el teu cim](https://www.feec.cat/activitats/100-cims/registra-el-teu-cim/) de la FEEC.'
					}
				]
			},
			{
				id: 'full-de-validacio',
				titol: 'Què demana el full de validació',
				blocs: [
					{
						tipus: 'paragraf',
						text: "El full és senzill. Hi van les dades de la persona participant (nom, DNI i número de llicència), l'entitat, i per a cada ascensió el cim i la data. Al final, les dades, la signatura (també electrònica) del president o presidenta i el segell de l'entitat."
					},
					{
						tipus: 'paragraf',
						text: "En una **sortida col·lectiva** n'hi ha prou amb un sol full de grup per a totes les persones participants. Per al repte infantil hi ha un full propi, que presenta el pare, la mare o el tutor legal i que inclou la data de naixement."
					},
					{
						tipus: 'paragraf',
						text: "El full no demana fotos ni traces GPS: la garantia és l'aval de l'entitat. La normativa tampoc no diu quines proves pot demanar-te el club, així que pregunta a la teva entitat com ho fa. Guardar una foto al cim o el track mai no sobra."
					}
				]
			},
			{
				id: 'terminis',
				titol: 'Terminis que cal tenir en compte',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'**31 de desembre:** data límit perquè els fulls arribin a la FEEC i les ascensions comptin en aquell any.',
							'**100 cims per any:** és el màxim que es pot presentar per validar cada any.',
							"**Un any de vigència:** un cim registrat al web de la FEEC que passa més d'un any sense full de validació s'esborra.",
							'**Sense termini per a les ascensions:** no hi ha data límit per completar el repte.'
						]
					}
				]
			},
			{
				id: 'reconeixement',
				titol: 'Quan arribes als 100 cims',
				blocs: [
					{
						tipus: 'paragraf',
						text: "Cada any, normalment al maig, la FEEC organitza una trobada on reconeix les persones que han completat el repte l'any anterior i les que han arribat a 200, 300, 400 o 500 cims. El reconeixement és honorífic: no hi ha cap classificació."
					}
				]
			},
			{
				id: 'que-fa-carnet-de-cims',
				titol: 'Què fa i què no fa Carnet de Cims',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Carnet de Cims és una eina independent per seguir el teu repte. Hi pots:'
					},
					{
						tipus: 'llista',
						items: [
							'Consultar els cims per [comarques](/comarques), al [mapa](/mapa) o a la [llista de cims essencials](/cims-essencials).',
							'Veure a cada fitxa si el cim té restriccions i si són vigents avui.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'A més, al [teu carnet](/app) pots anotar les ascensions (es desen al teu dispositiu, sense compte) i veure-les segellades en pàgines de la I a la V, quins essencials et falten i com vas a cada comarca. També t’avisa si en un any passes de 100 cims nous, si repeteixes un cim o si el dia de l’ascensió hi havia una restricció d’accés.'
					},
					{
						tipus: 'paragraf',
						text: 'En canvi, Carnet de Cims **no**:'
					},
					{
						tipus: 'llista',
						items: [
							'Valida ascensions ni les envia a la FEEC.',
							"Està connectat amb el teu compte de federat ni amb l'àrea privada de la FEEC.",
							'Substitueix el full de validació ni la signatura de la teva entitat.',
							'Garanteix que la FEEC comptarà un cim: en cas de dubte, val sempre el criteri de la FEEC.'
						]
					}
				]
			}
		],
		faq: [
			{
				pregunta: 'Carnet de Cims valida les meves ascensions?',
				resposta:
					'No. Carnet de Cims és un seguiment personal i no oficial. Les ascensions les valida la FEEC a partir del full signat pel president o presidenta de la teva entitat.'
			},
			{
				pregunta: 'Necessito fotos o el track GPS per validar un cim?',
				resposta:
					'El full de validació de la FEEC no en demana: la garantia és la signatura de la teva entitat. Pregunta al teu club si té algun criteri propi i, en tot cas, guardar una foto al cim és bona idea.'
			},
			{
				pregunta: 'Puc validar cims si no formo part de cap club?',
				resposta:
					"La normativa només preveu la validació a través del president o presidenta de l'entitat a la qual pertanys. Si no tens clar quina és la teva entitat o com fer-ho, consulta-ho a 100cims@feec.cat."
			},
			{
				pregunta: 'En una sortida en grup, cal un full per persona?',
				resposta:
					'No. En una sortida col·lectiva n’hi ha prou amb un sol full de grup, signat i segellat per l’entitat.'
			},
			{
				pregunta: 'Quant temps tinc per enviar el full de validació?',
				resposta:
					"Un cim registrat al web de la FEEC s'esborra si passa més d'un any sense full de validació. I perquè compti en un any concret, el full ha d'arribar abans del 31 de desembre."
			}
		],
		fonts: FONTS_CA,
		actualitzat: '2026-09-30'
	},
	es: {
		title: 'Cómo validar las cimas del reto 100 Cims',
		description:
			'Cómo se validan las ascensiones del reto 100 Cims: registro en la web de la FEEC, hoja firmada por tu entidad, plazos y qué hace (y qué no) Carnet de Cims.',
		h1: 'Cómo se validan las ascensiones del reto 100 Cims',
		intro:
			'Las ascensiones las valida la FEEC, siempre a través de la entidad con la que estás federado. Te explicamos los pasos, los plazos y por qué Carnet de Cims no valida nada.',
		seccions: [
			{
				id: 'qui-valida',
				titol: 'Quién valida las ascensiones',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'La validación es cosa de dos partes: el **presidente o presidenta de tu entidad** (el club o centro excursionista con el que estás federado), que avala la ascensión con su firma y el sello de la entidad, y la **FEEC**, que recibe la hoja y cuenta la cima. Sin esa hoja, una cima registrada no cuenta.'
					},
					{
						tipus: 'avis',
						to: 'info',
						text: 'Carnet de Cims **no valida ninguna ascensión** ni está conectado con la FEEC: es un seguimiento personal y no oficial. Para validar las cimas tienes que seguir el proceso de la [FEEC](https://www.feec.cat/activitats/100-cims/registra-el-teu-cim/).'
					}
				]
			},
			{
				id: 'passos',
				titol: 'Paso a paso: de la montaña a la validación',
				blocs: [
					{
						tipus: 'llista',
						ordenada: true,
						items: [
							'**Sube la cima** según la [normativa](/repte-100-cims/normativa): por cualquier vertiente, sin medios motorizados y fuera de los periodos de restricción.',
							'**Identifícate en la web de la FEEC** con tus datos de federado y, en el área privada, registra la cima en el apartado de registro de cimas.',
							'**Rellena la hoja de validación**: la individual, si vas por tu cuenta, o la de grupo, si es una salida colectiva.',
							'**Consigue la firma y el sello** del presidente o presidenta de tu entidad.',
							'**Envíala a la FEEC**: por correo electrónico a 100cims@feec.cat, por correo postal o en persona en la sede de la federación.',
							'**Espera la validación**: hasta que la FEEC no recibe la hoja, la cima no te cuenta.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'Tienes los formularios y las direcciones actualizadas en la página [Registra el teu cim](https://www.feec.cat/activitats/100-cims/registra-el-teu-cim/) de la FEEC, en catalán.'
					}
				]
			},
			{
				id: 'full-de-validacio',
				titol: 'Qué pide la hoja de validación',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'La hoja es sencilla. Lleva los datos de la persona participante (nombre, DNI y número de licencia), la entidad y, para cada ascensión, la cima y la fecha. Al final, los datos, la firma (también electrónica) del presidente o presidenta y el sello de la entidad.'
					},
					{
						tipus: 'paragraf',
						text: 'En una **salida colectiva** basta con una sola hoja de grupo para todas las personas participantes. Para el reto infantil hay una hoja propia, que presenta el padre, la madre o el tutor legal y que incluye la fecha de nacimiento.'
					},
					{
						tipus: 'paragraf',
						text: 'La hoja no pide fotos ni tracks GPS: la garantía es el aval de la entidad. La normativa tampoco dice qué pruebas puede pedirte el club, así que pregunta en tu entidad cómo lo hace. Guardar una foto en la cima o el track nunca está de más.'
					}
				]
			},
			{
				id: 'terminis',
				titol: 'Plazos que hay que tener en cuenta',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'**31 de diciembre:** fecha límite para que las hojas lleguen a la FEEC y las ascensiones cuenten ese año.',
							'**100 cimas al año:** es el máximo que se puede presentar para validar cada año.',
							'**Un año de vigencia:** una cima registrada en la web de la FEEC que pasa más de un año sin hoja de validación se borra.',
							'**Sin plazo para las ascensiones:** no hay fecha límite para completar el reto.'
						]
					}
				]
			},
			{
				id: 'reconeixement',
				titol: 'Cuando llegas a las 100 cimas',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Cada año, normalmente en mayo, la FEEC organiza un encuentro en el que reconoce a las personas que completaron el reto el año anterior y a las que han llegado a 200, 300, 400 o 500 cimas. El reconocimiento es honorífico: no hay ninguna clasificación.'
					}
				]
			},
			{
				id: 'que-fa-carnet-de-cims',
				titol: 'Qué hace y qué no hace Carnet de Cims',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Carnet de Cims es una herramienta independiente para seguir tu reto. En ella puedes:'
					},
					{
						tipus: 'llista',
						items: [
							'Consultar las cimas por [comarcas](/comarques), en el [mapa](/mapa) o en la [lista de cimas esenciales](/cims-essencials).',
							'Ver en cada ficha si la cima tiene restricciones y si están vigentes hoy.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'Además, en [tu carnet](/app) puedes anotar las ascensiones (se guardan en tu dispositivo, sin cuenta) y verlas selladas en páginas de la I a la V, qué esenciales te faltan y cómo vas en cada comarca. También te avisa si en un año pasas de 100 cimas nuevas, si repites una cima o si el día de la ascensión había una restricción de acceso.'
					},
					{
						tipus: 'paragraf',
						text: 'En cambio, Carnet de Cims **no**:'
					},
					{
						tipus: 'llista',
						items: [
							'Valida ascensiones ni las envía a la FEEC.',
							'Está conectado con tu cuenta de federado ni con el área privada de la FEEC.',
							'Sustituye la hoja de validación ni la firma de tu entidad.',
							'Garantiza que la FEEC vaya a contar una cima: en caso de duda, vale siempre el criterio de la FEEC.'
						]
					}
				]
			}
		],
		faq: [
			{
				pregunta: '¿Carnet de Cims valida mis ascensiones?',
				resposta:
					'No. Carnet de Cims es un seguimiento personal y no oficial. Las ascensiones las valida la FEEC a partir de la hoja firmada por el presidente o presidenta de tu entidad.'
			},
			{
				pregunta: '¿Necesito fotos o el track GPS para validar una cima?',
				resposta:
					'La hoja de validación de la FEEC no los pide: la garantía es la firma de tu entidad. Pregunta en tu club si tiene algún criterio propio y, en cualquier caso, guardar una foto en la cima es buena idea.'
			},
			{
				pregunta: '¿Puedo validar cimas si no pertenezco a ningún club?',
				resposta:
					'La normativa solo contempla la validación a través del presidente o presidenta de la entidad a la que perteneces. Si no tienes claro cuál es tu entidad o cómo hacerlo, consúltalo en 100cims@feec.cat.'
			},
			{
				pregunta: 'En una salida en grupo, ¿hace falta una hoja por persona?',
				resposta:
					'No. En una salida colectiva basta con una sola hoja de grupo, firmada y sellada por la entidad.'
			},
			{
				pregunta: '¿Cuánto tiempo tengo para enviar la hoja de validación?',
				resposta:
					'Una cima registrada en la web de la FEEC se borra si pasa más de un año sin hoja de validación. Y para que cuente en un año concreto, la hoja tiene que llegar antes del 31 de diciembre.'
			}
		],
		fonts: FONTS_ES,
		actualitzat: '2026-09-30'
	}
};
