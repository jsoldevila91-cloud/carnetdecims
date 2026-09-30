/**
 * `/privacitat` (RGPD), ajustada al que fa el web AVUI (verificat al codi el 2026-09-30):
 * - sense comptes; el registre d'ascensions (bloc 4a) desa les ascensions NOMÉS al dispositiu,
 *   a IndexedDB (BD `carnetdecims`, `data/local/db.ts`), amb exportació JSON, importació i
 *   esborrat total (`data/ascensions.ts`: `exportarDades`, `importarDades`, `esborrarTot`) i
 *   petició d'emmagatzematge persistent (`platform/emmagatzematge.ts`); no surten del dispositiu
 *   (la cua `outbox` és per a la sync futura de la fase 5 i avui no s'envia enlloc);
 * - geolocalització (bloc 4b, `platform/geolocalitzacio.ts`): només amb el botó «Ordena per
 *   proximitat» dels essencials pendents; la posició es queda en memòria i no es desa ni s'envia;
 * - cap `localStorage` ni cookie pròpia (Paraglide amb estratègia
 *   `url` + `baseLocale`, sense cookie); cap analítica, publicitat ni Google Fonts (fonts
 *   autoallotjades amb @fontsource);
 * - `sessionStorage` només el de SvelteKit (`sveltekit:scroll`, `sveltekit:snapshot`): tècnic,
 *   sense dades personals, s'esborra en tancar la pestanya (informe QA 3c);
 * - tercers que reben la IP en carregar recursos: mapes estàtics WMS de l'ICGC
 *   (`geoserveis.icgc.cat`) i de l'IGN (`data.geopf.fr`), vegeu `platform/mapa-estatic.ts`;
 *   Wikiloc i la FEEC només si es fa clic a l'enllaç; allotjament a Cloudflare.
 * Cal actualitzar-la abans d'activar: comptes (fase 5,
 * Supabase UE), meteo (fase 6, Open-Meteo via proxy) i analítica (fase 7).
 */
import { TITULAR } from './titular.ts';
import type { Contingut } from './types.ts';

const RGPD = 'https://eur-lex.europa.eu/eli/reg/2016/679/oj';
const AEPD = 'https://www.aepd.es/';
const CLOUDFLARE_PRIVACY = 'https://www.cloudflare.com/privacypolicy/';
const ICGC = 'https://www.icgc.cat/';
const IGN = 'https://www.ign.fr/';
const WIKILOC = 'https://www.wikiloc.com/';

export const privacitat: Contingut = {
	ca: {
		title: 'Política de privadesa',
		description:
			'Com tracta Carnet de Cims les teves dades: sense comptes, sense cookies de seguiment ni analítica. Quins serveis reben la IP i quins drets tens.',
		h1: 'Política de privadesa',
		intro:
			"En resum: Carnet de Cims no et demana cap dada ni fa servir cookies de seguiment ni analítica, i les ascensions que registres es desen només al teu dispositiu: no ens arriben. Aquí t'ho expliquem en detall, d'acord amb el Reglament general de protecció de dades (RGPD).",
		seccions: [
			{
				id: 'responsable',
				titol: 'Responsable del tractament',
				blocs: [
					{
						tipus: 'llista',
						items: [`**Responsable:** ${TITULAR.nom}`, `**Contacte:** ${TITULAR.correu}`]
					}
				]
			},
			{
				id: 'que-no-fem',
				titol: 'Què no fem',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'No hi ha comptes ni formularis de registre: no et demanem el nom, el correu ni cap altra dada.',
							"No fem servir cookies de seguiment, de publicitat ni d'analítica, ni cap eina de mesura d'audiència.",
							'No hi ha publicitat, ni botons de xarxes socials, ni continguts incrustats de tercers. Les tipografies es serveixen des del mateix web, no des de Google Fonts.',
							'No elaborem perfils ni prenem decisions automatitzades sobre ningú.'
						]
					}
				]
			},
			{
				id: 'dispositiu',
				titol: 'Dades al teu dispositiu',
				blocs: [
					{
						tipus: 'paragraf',
						text: "Les ascensions que registres (cim, data, mètode i, si en vols posar, una nota) es desen **només al teu dispositiu**, a la base de dades del navegador (IndexedDB). No hi ha comptes ni sincronització: aquestes dades no s'envien a cap servidor, ni al nostre ni al de ningú, i nosaltres no hi tenim accés. El navegador pot demanar-te permís per conservar-les de manera persistent, perquè no les esborri si li falta espai."
					},
					{
						tipus: 'llista',
						items: [
							"**Exportar-les:** des de l'aplicació pots descarregar una còpia en un fitxer JSON i tornar-la a importar en un altre navegador o dispositiu.",
							"**Esborrar-les:** des de l'aplicació pots esborrar totes les teves ascensions del dispositiu. També s'esborren si elimines les dades del lloc a la configuració del navegador. És irreversible: si no tens una còpia exportada, no les podrem recuperar, perquè no les tenim.",
							'**Si perds o canvies el dispositiu**, o esborres les dades del navegador, les ascensions es perden: et recomanem exportar-ne una còpia de tant en tant.',
							"**La teva ubicació:** només si a la llista d'essencials pendents tries ordenar-los per proximitat, i amb el permís que et demana el navegador. La posició es fa servir en aquest dispositiu per calcular les distàncies: no es desa ni s'envia enlloc. Si no dones permís, la llista s'ordena per comarca."
						]
					},
					{
						tipus: 'paragraf',
						text: "No fem servir cookies pròpies ni emmagatzematge local (localStorage). A més, el web guarda informació tècnica de navegació a l'emmagatzematge de sessió (sessionStorage): la posició de desplaçament i l'estat de les pàgines visitades, perquè el botó Enrere funcioni bé. No conté dades personals i s'esborra en tancar la pestanya."
					}
				]
			},
			{
				id: 'tercers',
				titol: 'Serveis de tercers que reben la teva adreça IP',
				blocs: [
					{
						tipus: 'paragraf',
						text: "Per mostrar una pàgina, el navegador es connecta a aquests serveis, que reben l'adreça IP, dades tècniques del navegador i l'adreça del nostre web (origen de la petició). Cadascun els tracta segons la seva política de privadesa:"
					},
					{
						tipus: 'llista',
						items: [
							`**Cloudflare** (allotjament i distribució del web): tracta l'adreça IP i les dades de cada petició per servir les pàgines i protegir el web d'atacs, per encàrrec nostre. Pot implicar transferències fora de l'Espai Econòmic Europeu amb les garanties del RGPD. [Política de privadesa de Cloudflare](${CLOUDFLARE_PRIVACY}).`,
							`**[ICGC](${ICGC})** (Institut Cartogràfic i Geològic de Catalunya): les imatges del mapa de les fitxes de cim i de les pàgines de comarca de Catalunya i Andorra es carreguen des dels seus servidors.`,
							`**[IGN France](${IGN})**: les imatges del mapa dels cims de la Catalunya Nord es carreguen des de la Géoplateforme de l'IGN.`,
							`**[Wikiloc](${WIKILOC})**: només si fas clic al botó de rutes d'una fitxa. Llavors surts del nostre web i s'aplica la política de Wikiloc.`,
							'**Altres enllaços externs** (FEEC, fonts de dades): només si hi fas clic.'
						]
					},
					{
						tipus: 'paragraf',
						text: "Si el servei d'allotjament ha d'aplicar un control de seguretat contra abusos, pot fer servir una cookie tècnica estrictament necessària per a aquesta finalitat."
					}
				]
			},
			{
				id: 'finalitats',
				titol: 'Finalitats, base jurídica i conservació',
				blocs: [
					{
						tipus: 'llista',
						items: [
							"**Servir el web i protegir-lo.** Els registres tècnics de les peticions (IP, data i hora, pàgina, navegador) els tracta Cloudflare per encàrrec nostre. Base jurídica: l'interès legítim a oferir un web segur i operatiu (art. 6.1.f del RGPD). Es conserven durant els terminis de Cloudflare i no els fem servir per elaborar perfils.",
							`**Respondre't si ens escrius.** Si ens envies un correu a ${TITULAR.correu}, fem servir la teva adreça i el missatge només per atendre la consulta. Base jurídica: la teva sol·licitud i el nostre interès legítim a respondre-la. Els conservem el temps necessari per atendre-la i, després, els esborrem.`
						]
					},
					{
						tipus: 'paragraf',
						text: "No venem ni cedim dades a ningú, llevat d'obligació legal."
					}
				]
			},
			{
				id: 'drets',
				titol: 'Els teus drets',
				blocs: [
					{
						tipus: 'paragraf',
						text: `Pots exercir els drets d'accés, rectificació, supressió, oposició, limitació del tractament i portabilitat escrivint a ${TITULAR.correu}. Indica quin dret vols exercir i, si cal, et demanarem el mínim necessari per comprovar la teva identitat. Et respondrem en el termini d'un mes, com estableix el [RGPD](${RGPD}).`
					},
					{
						tipus: 'paragraf',
						text: `Si creus que no hem atès bé la teva sol·licitud, pots presentar una reclamació a l'[Agència Espanyola de Protecció de Dades](${AEPD}).`
					}
				]
			},
			{
				id: 'canvis',
				titol: 'Canvis previstos',
				blocs: [
					{
						tipus: 'paragraf',
						text: "Aquesta política canviarà quan el web incorpori noves funcions. Abans d'activar-les, l'actualitzarem i en canviarem la data de revisió:"
					},
					{
						tipus: 'llista',
						items: [
							"**Comptes opcionals** per sincronitzar el carnet, amb les dades allotjades a la Unió Europea (Supabase), i amb opcions per exportar-les i esborrar-les. També s'hi explicaran les condicions per a menors d'edat (a Espanya, el consentiment propi es pot donar a partir dels 14 anys).",
							'**Previsió meteorològica** a les fitxes de cim, que es demanarà a través del nostre servidor.',
							"**Mesura d'audiència**, si mai n'hi ha: seria sense cookies i sense dades personals identificables."
						]
					}
				]
			}
		],
		actualitzat: '2026-09-30'
	},
	es: {
		title: 'Política de privacidad',
		description:
			'Cómo trata Carnet de Cims tus datos: sin cuentas, sin cookies de seguimiento ni analítica. Qué servicios reciben la IP y qué derechos tienes.',
		h1: 'Política de privacidad',
		intro:
			'En resumen: Carnet de Cims no te pide ningún dato ni usa cookies de seguimiento ni analítica, y las ascensiones que registras se guardan solo en tu dispositivo: no nos llegan. Aquí te lo explicamos en detalle, de acuerdo con el Reglamento general de protección de datos (RGPD).',
		seccions: [
			{
				id: 'responsable',
				titol: 'Responsable del tratamiento',
				blocs: [
					{
						tipus: 'llista',
						items: [`**Responsable:** ${TITULAR.nom}`, `**Contacto:** ${TITULAR.correu}`]
					}
				]
			},
			{
				id: 'que-no-fem',
				titol: 'Qué no hacemos',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'No hay cuentas ni formularios de registro: no te pedimos el nombre, el correo ni ningún otro dato.',
							'No usamos cookies de seguimiento, de publicidad ni de analítica, ni ninguna herramienta de medición de audiencia.',
							'No hay publicidad, ni botones de redes sociales, ni contenidos incrustados de terceros. Las tipografías se sirven desde la propia web, no desde Google Fonts.',
							'No elaboramos perfiles ni tomamos decisiones automatizadas sobre nadie.'
						]
					}
				]
			},
			{
				id: 'dispositiu',
				titol: 'Datos en tu dispositivo',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Las ascensiones que registras (cima, fecha, método y, si quieres, una nota) se guardan **solo en tu dispositivo**, en la base de datos del navegador (IndexedDB). No hay cuentas ni sincronización: estos datos no se envían a ningún servidor, ni al nuestro ni al de nadie, y nosotros no tenemos acceso a ellos. El navegador puede pedirte permiso para conservarlos de forma persistente, para que no los borre si le falta espacio.'
					},
					{
						tipus: 'llista',
						items: [
							'**Exportarlas:** desde la aplicación puedes descargar una copia en un archivo JSON y volver a importarla en otro navegador o dispositivo.',
							'**Borrarlas:** desde la aplicación puedes borrar todas tus ascensiones del dispositivo. También se borran si eliminas los datos del sitio en la configuración del navegador. Es irreversible: si no tienes una copia exportada, no podremos recuperarlas, porque no las tenemos.',
							'**Si pierdes o cambias de dispositivo**, o borras los datos del navegador, las ascensiones se pierden: te recomendamos exportar una copia de vez en cuando.',
							'**Tu ubicación:** solo si en la lista de esenciales pendientes eliges ordenarlas por proximidad, y con el permiso que te pide el navegador. La posición se usa en este dispositivo para calcular las distancias: no se guarda ni se envía a ningún sitio. Si no das permiso, la lista se ordena por comarca.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'No usamos cookies propias ni almacenamiento local (localStorage). Además, la web guarda información técnica de navegación en el almacenamiento de sesión (sessionStorage): la posición de desplazamiento y el estado de las páginas visitadas, para que el botón Atrás funcione bien. No contiene datos personales y se borra al cerrar la pestaña.'
					}
				]
			},
			{
				id: 'tercers',
				titol: 'Servicios de terceros que reciben tu dirección IP',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Para mostrar una página, el navegador se conecta a estos servicios, que reciben la dirección IP, datos técnicos del navegador y la dirección de nuestra web (origen de la petición). Cada uno los trata según su política de privacidad:'
					},
					{
						tipus: 'llista',
						items: [
							`**Cloudflare** (alojamiento y distribución de la web): trata la dirección IP y los datos de cada petición para servir las páginas y proteger la web de ataques, por encargo nuestro. Puede implicar transferencias fuera del Espacio Económico Europeo con las garantías del RGPD. [Política de privacidad de Cloudflare](${CLOUDFLARE_PRIVACY}).`,
							`**[ICGC](${ICGC})** (Institut Cartogràfic i Geològic de Catalunya): las imágenes del mapa de las fichas de cima y de las páginas de comarca de Cataluña y Andorra se cargan desde sus servidores.`,
							`**[IGN France](${IGN})**: las imágenes del mapa de las cimas de Cataluña Norte se cargan desde la Géoplateforme del IGN.`,
							`**[Wikiloc](${WIKILOC})**: solo si pulsas el botón de rutas de una ficha. Entonces sales de nuestra web y se aplica la política de Wikiloc.`,
							'**Otros enlaces externos** (FEEC, fuentes de datos): solo si los pulsas.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'Si el servicio de alojamiento tiene que aplicar un control de seguridad contra abusos, puede usar una cookie técnica estrictamente necesaria para esa finalidad.'
					}
				]
			},
			{
				id: 'finalitats',
				titol: 'Finalidades, base jurídica y conservación',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'**Servir la web y protegerla.** Los registros técnicos de las peticiones (IP, fecha y hora, página, navegador) los trata Cloudflare por encargo nuestro. Base jurídica: el interés legítimo en ofrecer una web segura y operativa (art. 6.1.f del RGPD). Se conservan durante los plazos de Cloudflare y no los usamos para elaborar perfiles.',
							`**Responderte si nos escribes.** Si nos envías un correo a ${TITULAR.correu}, usamos tu dirección y el mensaje solo para atender la consulta. Base jurídica: tu solicitud y nuestro interés legítimo en responderla. Los conservamos el tiempo necesario para atenderla y, después, los borramos.`
						]
					},
					{
						tipus: 'paragraf',
						text: 'No vendemos ni cedemos datos a nadie, salvo obligación legal.'
					}
				]
			},
			{
				id: 'drets',
				titol: 'Tus derechos',
				blocs: [
					{
						tipus: 'paragraf',
						text: `Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo a ${TITULAR.correu}. Indica qué derecho quieres ejercer y, si hace falta, te pediremos lo mínimo necesario para comprobar tu identidad. Te responderemos en el plazo de un mes, como establece el [RGPD](${RGPD}).`
					},
					{
						tipus: 'paragraf',
						text: `Si crees que no hemos atendido bien tu solicitud, puedes presentar una reclamación ante la [Agencia Española de Protección de Datos](${AEPD}).`
					}
				]
			},
			{
				id: 'canvis',
				titol: 'Cambios previstos',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Esta política cambiará cuando la web incorpore nuevas funciones. Antes de activarlas, la actualizaremos y cambiaremos su fecha de revisión:'
					},
					{
						tipus: 'llista',
						items: [
							'**Cuentas opcionales** para sincronizar el carnet, con los datos alojados en la Unión Europea (Supabase), y con opciones para exportarlos y borrarlos. También se explicarán las condiciones para menores de edad (en España, el consentimiento propio puede darse a partir de los 14 años).',
							'**Previsión meteorológica** en las fichas de cima, que se pedirá a través de nuestro servidor.',
							'**Medición de audiencia**, si algún día la hay: sería sin cookies y sin datos personales identificables.'
						]
					}
				]
			}
		],
		actualitzat: '2026-09-30'
	}
};
