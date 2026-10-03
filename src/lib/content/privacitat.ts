/**
 * `/privacitat` (RGPD), ajustada al que fa el web AVUI (verificat al codi el 2026-09-30):
 * - sense comptes; el registre d'ascensions (bloc 4a) desa les ascensions NOMÉS al dispositiu,
 *   a IndexedDB (BD `carnetdecims`, `data/local/db.ts`), amb exportació JSON, importació i
 *   esborrat total (`data/ascensions.ts`: `exportarDades`, `importarDades`, `esborrarTot`) i
 *   petició d'emmagatzematge persistent (`platform/emmagatzematge.ts`); no surten del dispositiu
 *   (la cua `outbox` és per a la sync futura de la fase 5 i avui no s'envia enlloc);
 * - geolocalització (blocs 4b i 4c, `platform/geolocalitzacio.ts`): només amb un botó («Ordena
 *   per proximitat» dels essencials pendents, «La meva ubicació» del mapa i «Cims a prop»); la
 *   posició es queda en memòria i no es desa ni s'envia;
 * - cap cookie pròpia (Paraglide amb estratègia `url` + `baseLocale`, sense cookie); cap
 *   analítica, publicitat ni Google Fonts (fonts autoallotjades amb @fontsource);
 * - PWA (bloc 4d, verificat el 2026-10-02): el service worker desa a la Cache Storage del
 *   navegador (caches `carnet-*`, `platform/sw/estrategia.ts`) els fitxers del web, les pàgines
 *   públiques visitades i les tessel·les dels mapes, per funcionar sense connexió; dues
 *   preferències tècniques a `localStorage`: `carnetdecims:avis-installacio`
 *   (`platform/installacio.svelte.ts`, avís d'instal·lació rebutjat o app instal·lada) i el
 *   senyal d'"app preparada sense connexió" ja mostrat (`ui/OfflineBanner.svelte`);
 * - `sessionStorage` només el de SvelteKit (`sveltekit:scroll`, `sveltekit:snapshot`): tècnic,
 *   sense dades personals, s'esborra en tancar la pestanya (informe QA 3c);
 * - tercers que reben la IP en carregar recursos: mapes estàtics WMS de l'ICGC
 *   (`geoserveis.icgc.cat`) i de l'IGN (`data.geopf.fr`), vegeu `platform/mapa-estatic.ts`;
 *   mapa interactiu de `/mapa` (bloc 4c, `platform/mapa-estil.ts`, verificat el 2026-10-02 amb
 *   els estils de l'ICGC): estil, tessel·les vectorials, ombrejat, glifs i sprites de l'ICGC
 *   (`geoserveis.icgc.cat`), ombrejat de Mapterhorn (`tiles.mapterhorn.com`) i, a la Catalunya
 *   Nord amb zoom ≥ 10, el Plan IGN WMTS (`data.geopf.fr`); la font d'ortofoto d'Esri de l'estil
 *   fosc té les capes amagades i MapLibre no en demana tessel·les;
 *   la FEEC només si es fa clic a l'enllaç; allotjament a Cloudflare.
 * - Wikiloc (fase 6a, `ui/fitxa/WikilocRecomanada.svelte`, verificat el 2026-10-03): les rutes
 *   recomanades de les fitxes amb contingut són un iframe del widget oficial
 *   (`{idioma}.wikiloc.com/wikiloc/embedv2.do`, `platform/wikiloc.ts`) que NO es crea fins que
 *   l'usuari prem «Mostra la ruta»; aleshores Wikiloc rep la IP i pot posar galetes pròpies.
 *   Els enllaços «Obre a Wikiloc» i «Veure rutes a Wikiloc» només si s'hi fa clic.
 * - meteo (fase 6a, `routes/api/meteo/[slug]`, `server/meteo/`): el navegador només demana
 *   `/api/meteo/{slug}` al nostre origen; el Worker demana la previsió a Open-Meteo amb les
 *   coordenades i l'altitud del cim (cap dada del visitant: ni IP, ni capçaleres, ni galetes) i el
 *   SW en desa la darrera de cada cim consultat (`carnet-meteo-v1`).
 * Cal actualitzar-la abans d'activar: comptes (fase 5, Supabase UE) i analítica (fase 7).
 */
import { TITULAR } from './titular.ts';
import type { Contingut } from './types.ts';

const RGPD = 'https://eur-lex.europa.eu/eli/reg/2016/679/oj';
const AEPD = 'https://www.aepd.es/';
const CLOUDFLARE_PRIVACY = 'https://www.cloudflare.com/privacypolicy/';
const ICGC = 'https://www.icgc.cat/';
const IGN = 'https://www.ign.fr/';
const MAPTERHORN = 'https://mapterhorn.com/';
const WIKILOC = 'https://www.wikiloc.com/';
const WIKILOC_PRIVACY = 'https://www.wikiloc.com/wikiloc/privacy.html';
const OPEN_METEO = 'https://open-meteo.com/';

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
							"**La teva ubicació:** només quan la demanes amb un botó (ordenar per proximitat els essencials pendents, «La meva ubicació» al mapa o «Cims a prop»), i amb el permís que et demana el navegador. La posició es fa servir en aquest dispositiu per calcular les distàncies o centrar el mapa: no es desa ni s'envia enlloc. Si no dones permís, la resta funciona igual (per exemple, la llista d'essencials s'ordena per comarca)."
						]
					},
					{
						tipus: 'paragraf',
						text: "No fem servir cookies pròpies. Perquè el web funcioni sense connexió, el navegador hi desa una còpia dels fitxers del web, de les pàgines visitades, dels trossos de mapa que has consultat i de l'última previsió meteorològica dels cims que has mirat (memòria cau del service worker); també hi guarda dues preferències tècniques a l'emmagatzematge local (localStorage): si has tancat l'avís d'instal·lació o ja tens l'app instal·lada, i si ja t'hem avisat que l'app està preparada per funcionar sense connexió. A més, el web guarda informació tècnica de navegació a l'emmagatzematge de sessió (sessionStorage): la posició de desplaçament i l'estat de les pàgines visitades, perquè el botó Enrere funcioni bé. Res d'això conté dades personals ni ens arriba, i ho pots esborrar eliminant les dades del lloc a la configuració del navegador. A banda d'això, Wikiloc pot posar les seves pròpies galetes, però només si obres el mapa d'una de les seves rutes (ho expliquem a l'apartat de serveis de tercers)."
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
							`**[ICGC](${ICGC})** (Institut Cartogràfic i Geològic de Catalunya): les imatges del mapa de les fitxes de cim, de les pàgines de comarca i del mapa general, i les tessel·les, la tipografia i les icones del [mapa interactiu](/mapa), es carreguen des dels seus servidors.`,
							`**[Mapterhorn](${MAPTERHORN})**: quan fas servir el mapa interactiu, l'ombrejat del relleu es carrega des dels seus servidors.`,
							`**[IGN France](${IGN})**: les imatges del mapa dels cims de la Catalunya Nord, i el Plan IGN del mapa interactiu quan t'hi apropes, es carreguen des de la Géoplateforme de l'IGN.`,
							`**[Open-Meteo](${OPEN_METEO})** (previsió meteorològica de les fitxes de cim): **no rep la teva IP**. El teu navegador només demana la previsió al nostre servidor, i és el nostre servidor qui la demana a Open-Meteo amb les coordenades i l'altitud del cim, sense cap dada teva.`,
							`**[Wikiloc](${WIKILOC})** (rutes recomanades d'algunes fitxes de cim): el mapa de cada ruta **no es carrega fins que prems «Mostra la ruta»**; abans no es fa cap connexió amb Wikiloc. Quan el prems, el navegador carrega el mapa des dels servidors de Wikiloc, que rep la teva adreça IP i pot fer servir les seves pròpies galetes, sota la seva responsabilitat i d'acord amb la seva [política de privadesa](${WIKILOC_PRIVACY}). Els enllaços «Obre a Wikiloc» i «Veure rutes a Wikiloc» et porten al seu web només si hi fas clic.`,
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
							"**Mesura d'audiència**, si mai n'hi ha: seria sense cookies i sense dades personals identificables."
						]
					}
				]
			}
		],
		actualitzat: '2026-10-03'
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
							'**Tu ubicación:** solo cuando la pides con un botón (ordenar por proximidad las esenciales pendientes, «Mi ubicación» en el mapa o «Cimas cerca»), y con el permiso que te pide el navegador. La posición se usa en este dispositivo para calcular las distancias o centrar el mapa: no se guarda ni se envía a ningún sitio. Si no das permiso, el resto funciona igual (por ejemplo, la lista de esenciales se ordena por comarca).'
						]
					},
					{
						tipus: 'paragraf',
						text: 'No usamos cookies propias. Para que la web funcione sin conexión, el navegador guarda una copia de los archivos de la web, de las páginas visitadas, de los fragmentos de mapa que has consultado y de la última previsión meteorológica de las cimas que has mirado (memoria caché del service worker); también guarda dos preferencias técnicas en el almacenamiento local (localStorage): si has cerrado el aviso de instalación o ya tienes la app instalada, y si ya te hemos avisado de que la app está preparada para funcionar sin conexión. Además, la web guarda información técnica de navegación en el almacenamiento de sesión (sessionStorage): la posición de desplazamiento y el estado de las páginas visitadas, para que el botón Atrás funcione bien. Nada de esto contiene datos personales ni nos llega, y puedes borrarlo eliminando los datos del sitio en la configuración del navegador. Aparte de eso, Wikiloc puede poner sus propias cookies, pero solo si abres el mapa de una de sus rutas (lo explicamos en el apartado de servicios de terceros).'
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
							`**[ICGC](${ICGC})** (Institut Cartogràfic i Geològic de Catalunya): las imágenes del mapa de las fichas de cima, de las páginas de comarca y del mapa general, y las teselas, la tipografía y los iconos del [mapa interactivo](/mapa), se cargan desde sus servidores.`,
							`**[Mapterhorn](${MAPTERHORN})**: cuando usas el mapa interactivo, el sombreado del relieve se carga desde sus servidores.`,
							`**[IGN France](${IGN})**: las imágenes del mapa de las cimas de Cataluña Norte, y el Plan IGN del mapa interactivo al acercarte, se cargan desde la Géoplateforme del IGN.`,
							`**[Open-Meteo](${OPEN_METEO})** (previsión meteorológica de las fichas de cima): **no recibe tu IP**. Tu navegador solo pide la previsión a nuestro servidor, y es nuestro servidor quien la pide a Open-Meteo con las coordenadas y la altitud de la cima, sin ningún dato tuyo.`,
							`**[Wikiloc](${WIKILOC})** (rutas recomendadas de algunas fichas de cima): el mapa de cada ruta **no se carga hasta que pulsas «Mostrar la ruta»**; antes no se establece ninguna conexión con Wikiloc. Cuando lo pulsas, el navegador carga el mapa desde los servidores de Wikiloc, que recibe tu dirección IP y puede usar sus propias cookies, bajo su responsabilidad y según su [política de privacidad](${WIKILOC_PRIVACY}). Los enlaces «Abrir en Wikiloc» y «Ver rutas en Wikiloc» te llevan a su web solo si haces clic en ellos.`,
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
							'**Medición de audiencia**, si algún día la hay: sería sin cookies y sin datos personales identificables.'
						]
					}
				]
			}
		],
		actualitzat: '2026-10-03'
	}
};
