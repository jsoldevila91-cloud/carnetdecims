/**
 * `/avis-legal`: informació general (art. 10 de la LSSI-CE), condicions d'ús, propietat
 * intel·lectual i marques de tercers, responsabilitat, enllaços externs i llei aplicable.
 * Les dades del titular són marcadors pendents (`pendents.ts`): no s'inventa res.
 */
import { TITULAR } from './titular.ts';
import type { Contingut } from './types.ts';

const LSSI = 'https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758';
const FEEC_100_CIMS = 'https://www.feec.cat/activitats/100-cims/';
const FEEC_RESTRICCIONS = 'https://www.feec.cat/activitats/100-cims/cims-amb-restriccions-dacces/';

export const avisLegal: Contingut = {
	ca: {
		title: 'Avís legal',
		description:
			"Avís legal de Carnet de Cims: titular, condicions d'ús, propietat intel·lectual, marques de tercers i responsabilitat. Web independent i no oficial.",
		h1: 'Avís legal',
		intro:
			"Condicions d'ús del web carnetdecims.cat i dades del titular, d'acord amb la Llei 34/2002 de serveis de la societat de la informació i de comerç electrònic (LSSI-CE).",
		seccions: [
			{
				id: 'titular',
				titol: 'Titular del web',
				blocs: [
					{
						tipus: 'llista',
						items: [
							`**Titular:** ${TITULAR.nom}`,
							`**Correu electrònic:** ${TITULAR.correu}`,
							`**Web:** ${TITULAR.web}`
						]
					},
					{
						tipus: 'paragraf',
						text: `Carnet de Cims és un projecte sense activitat econòmica: no té publicitat, subscripcions ni cap servei de pagament. Si mai en tingués, aquí s'hi afegirien les dades identificatives que demana l'article 10 de la [LSSI-CE](${LSSI}).`
					}
				]
			},
			{
				id: 'objecte',
				titol: 'Què és aquest web',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Carnet de Cims és un web informatiu i una eina gratuïta de seguiment personal del repte 100 Cims. Ofereix informació sobre els cims del repte i permet anotar-hi les ascensions pròpies, que es desen al dispositiu de la persona usuària.'
					},
					{
						tipus: 'avis',
						to: 'alerta',
						text: `És un web independent, no oficial i no vinculat a la Federació d'Entitats Excursionistes de Catalunya (FEEC). No és el registre oficial del repte: anotar-hi un cim no el valida. La validació d'ascensions la fa la [FEEC](${FEEC_100_CIMS}) a través de les entitats.`
					}
				]
			},
			{
				id: 'condicions',
				titol: "Condicions d'ús",
				blocs: [
					{
						tipus: 'llista',
						items: [
							"Fer servir el web implica acceptar aquestes condicions. Si no hi estàs d'acord, no el facis servir.",
							"L'accés és lliure i gratuït. Ara mateix no cal registrar-se.",
							"Cal fer-ne un ús lícit i respectuós. No es permet fer-lo servir per a activitats il·lícites, ni intentar-ne alterar el funcionament, ni extreure'n continguts de manera massiva o automatitzada.",
							"Podem modificar el web i aquestes condicions. La data de l'última revisió figura en aquesta pàgina."
						]
					}
				]
			},
			{
				id: 'propietat',
				titol: 'Propietat intel·lectual i marques',
				blocs: [
					{
						tipus: 'paragraf',
						text: `Els textos, el disseny, el codi, el nom i el logotip de Carnet de Cims són del titular, llevat que s'indiqui una altra cosa. No se'n permet la reproducció ni la distribució amb finalitat comercial sense autorització. Per a altres usos, escriu a ${TITULAR.correu}.`
					},
					{
						tipus: 'paragraf',
						text: "Les dades geogràfiques (coordenades, topònims, elevacions, mapes) són de tercers i s'utilitzen d'acord amb les seves llicències: ICGC (CC BY 4.0), IGN France (Llicència Oberta 2.0), OpenStreetMap (ODbL) i Wikidata (CC0). Les atribucions completes són a la [metodologia](/metodologia)."
					},
					{
						tipus: 'avis',
						to: 'info',
						text: '"100 Cims" és una marca de la FEEC. En aquest web només s\'utilitza per descriure el repte al qual fa referència l\'eina, sense cap logotip de la FEEC i sense suggerir cap relació, patrocini ni aprovació per part seva.'
					},
					{
						tipus: 'paragraf',
						text: "Els noms d'altres organitzacions i serveis que s'hi esmenten (ICGC, IGN, OpenStreetMap, Wikidata, Wikiloc…) són dels seus titulars i només s'hi citen com a font o enllaç. Si ets titular d'un dret i creus que algun contingut l'infringeix, escriu-nos i el revisarem de seguida."
					}
				]
			},
			{
				id: 'responsabilitat',
				titol: 'Responsabilitat',
				blocs: [
					{
						tipus: 'avis',
						to: 'alerta',
						text: `L'activitat de muntanya comporta riscos i la fas sota la teva responsabilitat. Abans de sortir, consulta la previsió meteorològica, l'estat del terreny i les [restriccions d'accés](${FEEC_RESTRICCIONS}) vigents, i valora la teva preparació i el material.`
					},
					{
						tipus: 'llista',
						items: [
							'Les dades del web (altituds, coordenades, comarques, restriccions, textos) provenen de fonts obertes, es revisen amb cura i poden contenir errors o estar desactualitzades. Són orientatives i no substitueixen un mapa, una ressenya actualitzada ni la informació oficial.',
							"En la mesura que ho permeti la llei, el titular no es fa responsable dels danys que es puguin derivar de l'ús de la informació del web ni de decisions preses a partir d'ella.",
							"No garantim que el web estigui sempre disponible ni lliure d'errors, tot i que hi posem els mitjans raonables.",
							"Si detectes un error, ens ajudes molt si ens l'expliques: t'ho agraïrem i el corregirem."
						]
					}
				]
			},
			{
				id: 'enllacos',
				titol: 'Enllaços externs',
				blocs: [
					{
						tipus: 'paragraf',
						text: "El web enllaça llocs de tercers (FEEC, ICGC, IGN, Wikiloc…) que s'obren en una pestanya nova. No en controlem els continguts ni les polítiques de privadesa, i no en som responsables. L'enllaç no implica cap relació ni aprovació."
					}
				]
			},
			{
				id: 'dades-personals',
				titol: 'Dades personals',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Com tractem les dades (ara mateix, sense comptes ni cookies de seguiment) ho expliquem a la [política de privadesa](/privacitat).'
					}
				]
			},
			{
				id: 'legislacio',
				titol: 'Legislació aplicable',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Aquestes condicions es regeixen per la legislació espanyola. En cas de conflicte, si la persona usuària actua com a consumidora, seran competents els jutjats i tribunals del seu domicili.'
					}
				]
			}
		],
		actualitzat: '2026-09-29'
	},
	es: {
		title: 'Aviso legal',
		description:
			'Aviso legal de Carnet de Cims: titular, condiciones de uso, propiedad intelectual, marcas de terceros y responsabilidad. Web independiente y no oficial.',
		h1: 'Aviso legal',
		intro:
			'Condiciones de uso de la web carnetdecims.cat y datos del titular, de acuerdo con la Ley 34/2002 de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE).',
		seccions: [
			{
				id: 'titular',
				titol: 'Titular de la web',
				blocs: [
					{
						tipus: 'llista',
						items: [
							`**Titular:** ${TITULAR.nom}`,
							`**Correo electrónico:** ${TITULAR.correu}`,
							`**Web:** ${TITULAR.web}`
						]
					},
					{
						tipus: 'paragraf',
						text: `Carnet de Cims es un proyecto sin actividad económica: no tiene publicidad, suscripciones ni ningún servicio de pago. Si algún día los tuviera, aquí se añadirían los datos identificativos que pide el artículo 10 de la [LSSI-CE](${LSSI}).`
					}
				]
			},
			{
				id: 'objecte',
				titol: 'Qué es esta web',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Carnet de Cims es una web informativa y una herramienta gratuita de seguimiento personal del reto 100 Cims. Ofrece información sobre las cimas del reto y permite anotar las ascensiones propias, que se guardan en el dispositivo de la persona usuaria.'
					},
					{
						tipus: 'avis',
						to: 'alerta',
						text: `Es una web independiente, no oficial y no vinculada a la Federació d'Entitats Excursionistes de Catalunya (FEEC). No es el registro oficial del reto: anotar una cima aquí no la valida. La validación de ascensiones la hace la [FEEC](${FEEC_100_CIMS}) a través de las entidades.`
					}
				]
			},
			{
				id: 'condicions',
				titol: 'Condiciones de uso',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'Usar la web implica aceptar estas condiciones. Si no estás de acuerdo, no la uses.',
							'El acceso es libre y gratuito. Ahora mismo no hace falta registrarse.',
							'Debe hacerse un uso lícito y respetuoso. No se permite usarla para actividades ilícitas, ni intentar alterar su funcionamiento, ni extraer sus contenidos de forma masiva o automatizada.',
							'Podemos modificar la web y estas condiciones. La fecha de la última revisión figura en esta página.'
						]
					}
				]
			},
			{
				id: 'propietat',
				titol: 'Propiedad intelectual y marcas',
				blocs: [
					{
						tipus: 'paragraf',
						text: `Los textos, el diseño, el código, el nombre y el logotipo de Carnet de Cims son del titular, salvo que se indique otra cosa. No se permite su reproducción ni su distribución con fines comerciales sin autorización. Para otros usos, escribe a ${TITULAR.correu}.`
					},
					{
						tipus: 'paragraf',
						text: 'Los datos geográficos (coordenadas, topónimos, elevaciones, mapas) son de terceros y se usan de acuerdo con sus licencias: ICGC (CC BY 4.0), IGN France (Licencia Abierta 2.0), OpenStreetMap (ODbL) y Wikidata (CC0). Las atribuciones completas están en la [metodología](/metodologia).'
					},
					{
						tipus: 'avis',
						to: 'info',
						text: '"100 Cims" es una marca de la FEEC. En esta web solo se usa para describir el reto al que se refiere la herramienta, sin ningún logotipo de la FEEC y sin sugerir ninguna relación, patrocinio ni aprobación por su parte.'
					},
					{
						tipus: 'paragraf',
						text: 'Los nombres de otras organizaciones y servicios que se mencionan (ICGC, IGN, OpenStreetMap, Wikidata, Wikiloc…) son de sus titulares y solo se citan como fuente o enlace. Si eres titular de un derecho y crees que algún contenido lo infringe, escríbenos y lo revisaremos enseguida.'
					}
				]
			},
			{
				id: 'responsabilitat',
				titol: 'Responsabilidad',
				blocs: [
					{
						tipus: 'avis',
						to: 'alerta',
						text: `La actividad de montaña conlleva riesgos y la realizas bajo tu responsabilidad. Antes de salir, consulta la previsión meteorológica, el estado del terreno y las [restricciones de acceso](${FEEC_RESTRICCIONS}) vigentes, y valora tu preparación y el material.`
					},
					{
						tipus: 'llista',
						items: [
							'Los datos de la web (altitudes, coordenadas, comarcas, restricciones, textos) proceden de fuentes abiertas, se revisan con cuidado y pueden contener errores o estar desactualizados. Son orientativos y no sustituyen un mapa, una reseña actualizada ni la información oficial.',
							'En la medida en que lo permita la ley, el titular no se hace responsable de los daños que puedan derivarse del uso de la información de la web ni de decisiones tomadas a partir de ella.',
							'No garantizamos que la web esté siempre disponible ni libre de errores, aunque ponemos los medios razonables.',
							'Si detectas un error, nos ayudas mucho si nos lo cuentas: te lo agradeceremos y lo corregiremos.'
						]
					}
				]
			},
			{
				id: 'enllacos',
				titol: 'Enlaces externos',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'La web enlaza sitios de terceros (FEEC, ICGC, IGN, Wikiloc…) que se abren en una pestaña nueva. No controlamos sus contenidos ni sus políticas de privacidad, y no somos responsables de ellos. El enlace no implica ninguna relación ni aprobación.'
					}
				]
			},
			{
				id: 'dades-personals',
				titol: 'Datos personales',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Cómo tratamos los datos (ahora mismo, sin cuentas ni cookies de seguimiento) lo explicamos en la [política de privacidad](/privacitat).'
					}
				]
			},
			{
				id: 'legislacio',
				titol: 'Legislación aplicable',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Estas condiciones se rigen por la legislación española. En caso de conflicto, si la persona usuaria actúa como consumidora, serán competentes los juzgados y tribunales de su domicilio.'
					}
				]
			}
		],
		actualitzat: '2026-09-29'
	}
};
