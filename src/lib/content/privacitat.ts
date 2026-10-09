/**
 * `/privacitat` (RGPD), ajustada al que fa el web AVUI (revisada el 2026-10-09, beta privada):
 * - registre d'ascensions (bloc 4a) a IndexedDB (BD `carnetdecims`, `data/local/db.ts`), amb
 *   exportació JSON, importació i esborrat total (`data/ascensions.ts`) i petició d'emmagatzematge
 *   persistent (`platform/emmagatzematge.ts`); sense compte, no surten del dispositiu;
 * - comptes opcionals (fase 5, beta privada): accés amb enllaç al correu (Supabase Auth, projecte a
 *   eu-west-1, Irlanda); al núvol, taules `ascensions` (cim, data, mètode, nota) i `perfils` (àlies
 *   opcional), `supabase/migrations/0002_dades_usuari.sql`, amb RLS i supressió del compte
 *   ("Esborra el compte", `/app/compte`) en cascada; la sessió de supabase-js es desa a
 *   localStorage. Si es configura un SMTP propi per als correus d'accés, cal afegir-lo aquí;
 * - responsable del tractament: el nom complet de la persona titular surt NOMÉS a la secció
 *   `responsable` d'aquesta pàgina (decisió de l'usuari, 2026-10-09); a la resta del web, "JSR"
 *   (`titular.ts`), i mai a metadades ni JSON-LD (`continguts.spec.ts` ho comprova);
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
 * Cal actualitzar-la abans d'activar l'analítica (fase 7) o qualsevol altre tractament.
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
const SUPABASE = 'https://supabase.com/';
const SUPABASE_PRIVACY = 'https://supabase.com/privacy';
const SUPABASE_DPA = 'https://supabase.com/legal/dpa';

/**
 * Persona responsable del tractament (art. 13 del RGPD). Només es fa servir a la secció
 * `responsable` d'aquesta pàgina: enlloc més del web, ni a metadades ni a JSON-LD.
 */
export const RESPONSABLE_TRACTAMENT = 'Jonatan Soldevila Rafael';

export const privacitat: Contingut = {
	ca: {
		title: 'Política de privadesa',
		description:
			'Com tracta Carnet de Cims les teves dades: compte opcional amb dades a la UE, sense cookies de seguiment ni analítica. Qui les tracta i quins drets tens.',
		h1: 'Política de privadesa',
		intro:
			"En resum: pots fer servir Carnet de Cims sense compte, i aleshores les ascensions es desen només al teu dispositiu. Si crees un compte (opcional), et demanem només el correu i desem el teu carnet en servidors de la Unió Europea per sincronitzar-lo; el pots exportar i esborrar quan vulguis. No fem servir cookies de seguiment ni analítica. Aquí t'ho expliquem en detall, d'acord amb el Reglament general de protecció de dades (RGPD).",
		seccions: [
			{
				id: 'responsable',
				titol: 'Responsable del tractament',
				blocs: [
					{
						tipus: 'llista',
						items: [
							`**Responsable:** ${RESPONSABLE_TRACTAMENT}, titular de ${TITULAR.nom}`,
							`**Contacte:** ${TITULAR.correu}`
						]
					}
				]
			},
			{
				id: 'beta',
				titol: 'Beta privada',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Carnet de Cims és en **beta privada**: una versió de prova oberta a un grup reduït de persones abans del llançament. Pot tenir errors i les funcions poden canviar. Les dades es tracten igual que ho farem després del llançament i amb les mateixes garanties; si alguna cosa canvia, actualitzarem aquesta política i la data de revisió. Et recomanem exportar una còpia del carnet de tant en tant.'
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
							"El compte és opcional: sense compte, no et demanem cap dada. Amb compte, només el correu (i, si vols, un àlies). No et demanem el nom, ni el telèfon, ni l'edat.",
							'No enviem publicitat ni butlletins: el correu només serveix per entrar al compte.',
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
						text: "Les ascensions que registres (cim, data, mètode i, si en vols posar, una nota) es desen al teu dispositiu, a la base de dades del navegador (IndexedDB). **Sense compte, es queden només aquí:** no s'envien a cap servidor i nosaltres no hi tenim accés. Si crees un compte, també se'n desa una còpia al núvol (ho expliquem a l'apartat «Si crees un compte»). El navegador pot demanar-te permís per conservar-les de manera persistent, perquè no les esborri si li falta espai."
					},
					{
						tipus: 'llista',
						items: [
							"**Exportar-les:** des de l'aplicació pots descarregar una còpia en un fitxer JSON i tornar-la a importar en un altre navegador o dispositiu.",
							"**Esborrar-les:** des de l'aplicació pots esborrar totes les teves ascensions del dispositiu. També s'esborren si elimines les dades del lloc a la configuració del navegador. És irreversible: si no tens una còpia exportada, no les podrem recuperar, perquè no les tenim.",
							'**Si perds o canvies el dispositiu**, o esborres les dades del navegador, les ascensions que no tinguis al compte es perden: et recomanem crear un compte o exportar-ne una còpia de tant en tant.',
							"**La teva ubicació:** només quan la demanes amb un botó (ordenar per proximitat els essencials pendents, «La meva ubicació» al mapa o «Cims a prop»), i amb el permís que et demana el navegador. La posició es fa servir en aquest dispositiu per calcular les distàncies o centrar el mapa: no es desa ni s'envia enlloc. Si no dones permís, la resta funciona igual (per exemple, la llista d'essencials s'ordena per comarca)."
						]
					},
					{
						tipus: 'paragraf',
						text: "No fem servir cookies pròpies. Perquè el web funcioni sense connexió, el navegador hi desa una còpia dels fitxers del web, de les pàgines visitades, dels trossos de mapa que has consultat i de l'última previsió meteorològica dels cims que has mirat (memòria cau del service worker); també hi guarda dues preferències tècniques a l'emmagatzematge local (localStorage): si has tancat l'avís d'instal·lació o ja tens l'app instal·lada, i si ja t'hem avisat que l'app està preparada per funcionar sense connexió. Si entres al teu compte, hi guarda també la sessió (un identificador d'accés) perquè no hagis d'entrar cada vegada; s'esborra en tancar la sessió. A més, el web guarda informació tècnica de navegació a l'emmagatzematge de sessió (sessionStorage): la posició de desplaçament i l'estat de les pàgines visitades, perquè el botó Enrere funcioni bé. Res d'això no ens arriba, llevat de la sessió, que identifica el teu compte quan sincronitzes, i ho pots esborrar eliminant les dades del lloc a la configuració del navegador. A banda d'això, Wikiloc pot posar les seves pròpies galetes, però només si obres el mapa d'una de les seves rutes (ho expliquem a l'apartat de serveis de tercers)."
					}
				]
			},
			{
				id: 'compte',
				titol: 'Si crees un compte',
				blocs: [
					{
						tipus: 'paragraf',
						text: "El compte és opcional i serveix per desar el teu carnet al núvol i tenir-lo a tots els teus dispositius. S'hi entra amb un enllaç que t'enviem per correu, sense contrasenya."
					},
					{
						tipus: 'llista',
						items: [
							"**Quines dades:** el teu correu electrònic; les ascensions que registres (cim, data, mètode i la nota, si n'hi poses); un àlies, només si en vols posar; i les dades tècniques del compte (dates d'alta i d'últim accés i registres d'accés amb l'adreça IP, que es guarden per seguretat).",
							"**Per a què:** crear el compte, enviar-te l'enllaç per entrar i desar i sincronitzar el teu carnet entre dispositius. No fem servir el correu per a res més: ni publicitat ni butlletins.",
							"**Base jurídica:** l'execució del servei que ens demanes en crear el compte (art. 6.1.b del RGPD). L'àlies és voluntari i es basa en el teu consentiment (art. 6.1.a), que pots retirar esborrant-lo.",
							`**Encarregat del tractament:** [Supabase](${SUPABASE}) allotja la base de dades i gestiona l'accés per encàrrec nostre, amb servidors a la Unió Europea (Irlanda). Si mai hi accedeix des de fora de l'Espai Econòmic Europeu, ho fa amb les garanties del RGPD (clàusules contractuals tipus), d'acord amb el seu [acord de tractament de dades](${SUPABASE_DPA}) i la seva [política de privadesa](${SUPABASE_PRIVACY}). També és Supabase qui t'envia el correu amb l'enllaç d'accés.`,
							"**Quant de temps:** mentre tinguis el compte. Si l'esborres, s'eliminen el compte i totes les ascensions desades al núvol; les còpies de seguretat del proveïdor, si n'hi ha, es renoven al cap de pocs dies. Les ascensions del teu dispositiu no s'esborren: les pots esborrar a part.",
							"**Menors:** per crear un compte cal tenir 14 anys o més; per sota d'aquesta edat, l'ha de crear el pare, la mare o el tutor legal (art. 7 de la Llei orgànica 3/2018).",
							'Ningú més no veu el teu carnet: cada compte només pot llegir i modificar les seves pròpies dades.'
						]
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
							`**[Supabase](${SUPABASE})** (comptes): només si crees un compte o hi entres. Rep l'adreça IP i les peticions de sincronització, com a encarregat del tractament (vegeu l'apartat «Si crees un compte»).`,
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
							"**Desar i sincronitzar el teu carnet, si crees un compte.** Ho expliquem a l'apartat «Si crees un compte».",
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
						text: "Tens dret d'accés, rectificació, supressió, oposició, limitació del tractament i portabilitat. Si tens compte, molts els pots exercir tu mateix des de «El teu compte», a l'aplicació:"
					},
					{
						tipus: 'llista',
						items: [
							'**Accés i portabilitat:** «Descarrega les meves dades» o «Exporta una còpia (JSON)» et donen totes les teves ascensions en un fitxer que pots fer servir en un altre lloc.',
							'**Rectificació:** pots editar o esborrar cada ascensió. Per canviar el correu del compte, escriu-nos.',
							'**Supressió:** el botó «Esborra el compte» elimina el compte i totes les dades desades al núvol.',
							'**Oposició i limitació del tractament:** escriu-nos i ho atendrem.'
						]
					},
					{
						tipus: 'paragraf',
						text: `Per a qualsevol d'aquests drets, també pots escriure a ${TITULAR.correu}. Indica quin dret vols exercir i, si cal, et demanarem el mínim necessari per comprovar la teva identitat. Et respondrem en el termini d'un mes, com estableix el [RGPD](${RGPD}).`
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
						text: "Aquesta política canviarà quan el web incorpori noves funcions o en sortir de la beta. Abans d'activar-les, l'actualitzarem i en canviarem la data de revisió:"
					},
					{
						tipus: 'llista',
						items: [
							"**Mesura d'audiència**, si mai n'hi ha: seria sense cookies i sense dades personals identificables."
						]
					}
				]
			}
		],
		actualitzat: '2026-10-09'
	},
	es: {
		title: 'Política de privacidad',
		description:
			'Cómo trata Carnet de Cims tus datos: cuenta opcional con datos en la UE, sin cookies de seguimiento ni analítica. Quién los trata y qué derechos tienes.',
		h1: 'Política de privacidad',
		intro:
			'En resumen: puedes usar Carnet de Cims sin cuenta, y entonces las ascensiones se guardan solo en tu dispositivo. Si creas una cuenta (opcional), solo te pedimos el correo y guardamos tu carnet en servidores de la Unión Europea para sincronizarlo; puedes exportarlo y borrarlo cuando quieras. No usamos cookies de seguimiento ni analítica. Aquí te lo explicamos en detalle, de acuerdo con el Reglamento general de protección de datos (RGPD).',
		seccions: [
			{
				id: 'responsable',
				titol: 'Responsable del tratamiento',
				blocs: [
					{
						tipus: 'llista',
						items: [
							`**Responsable:** ${RESPONSABLE_TRACTAMENT}, titular de ${TITULAR.nom}`,
							`**Contacto:** ${TITULAR.correu}`
						]
					}
				]
			},
			{
				id: 'beta',
				titol: 'Beta privada',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Carnet de Cims está en **beta privada**: una versión de prueba abierta a un grupo reducido de personas antes del lanzamiento. Puede tener errores y las funciones pueden cambiar. Los datos se tratan igual que lo haremos tras el lanzamiento y con las mismas garantías; si algo cambia, actualizaremos esta política y su fecha de revisión. Te recomendamos exportar una copia del carnet de vez en cuando.'
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
							'La cuenta es opcional: sin cuenta, no te pedimos ningún dato. Con cuenta, solo el correo (y, si quieres, un alias). No te pedimos el nombre, ni el teléfono, ni la edad.',
							'No enviamos publicidad ni boletines: el correo solo sirve para entrar en la cuenta.',
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
						text: 'Las ascensiones que registras (cima, fecha, método y, si quieres, una nota) se guardan en tu dispositivo, en la base de datos del navegador (IndexedDB). **Sin cuenta, se quedan solo aquí:** no se envían a ningún servidor y nosotros no tenemos acceso a ellas. Si creas una cuenta, también se guarda una copia en la nube (lo explicamos en el apartado «Si creas una cuenta»). El navegador puede pedirte permiso para conservarlas de forma persistente, para que no las borre si le falta espacio.'
					},
					{
						tipus: 'llista',
						items: [
							'**Exportarlas:** desde la aplicación puedes descargar una copia en un archivo JSON y volver a importarla en otro navegador o dispositivo.',
							'**Borrarlas:** desde la aplicación puedes borrar todas tus ascensiones del dispositivo. También se borran si eliminas los datos del sitio en la configuración del navegador. Es irreversible: si no tienes una copia exportada, no podremos recuperarlas, porque no las tenemos.',
							'**Si pierdes o cambias de dispositivo**, o borras los datos del navegador, las ascensiones que no tengas en la cuenta se pierden: te recomendamos crear una cuenta o exportar una copia de vez en cuando.',
							'**Tu ubicación:** solo cuando la pides con un botón (ordenar por proximidad las esenciales pendientes, «Mi ubicación» en el mapa o «Cimas cerca»), y con el permiso que te pide el navegador. La posición se usa en este dispositivo para calcular las distancias o centrar el mapa: no se guarda ni se envía a ningún sitio. Si no das permiso, el resto funciona igual (por ejemplo, la lista de esenciales se ordena por comarca).'
						]
					},
					{
						tipus: 'paragraf',
						text: 'No usamos cookies propias. Para que la web funcione sin conexión, el navegador guarda una copia de los archivos de la web, de las páginas visitadas, de los fragmentos de mapa que has consultado y de la última previsión meteorológica de las cimas que has mirado (memoria caché del service worker); también guarda dos preferencias técnicas en el almacenamiento local (localStorage): si has cerrado el aviso de instalación o ya tienes la app instalada, y si ya te hemos avisado de que la app está preparada para funcionar sin conexión. Si entras en tu cuenta, guarda también la sesión (un identificador de acceso) para que no tengas que entrar cada vez; se borra al cerrar la sesión. Además, la web guarda información técnica de navegación en el almacenamiento de sesión (sessionStorage): la posición de desplazamiento y el estado de las páginas visitadas, para que el botón Atrás funcione bien. Nada de esto nos llega, salvo la sesión, que identifica tu cuenta cuando sincronizas, y puedes borrarlo eliminando los datos del sitio en la configuración del navegador. Aparte de eso, Wikiloc puede poner sus propias cookies, pero solo si abres el mapa de una de sus rutas (lo explicamos en el apartado de servicios de terceros).'
					}
				]
			},
			{
				id: 'compte',
				titol: 'Si creas una cuenta',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'La cuenta es opcional y sirve para guardar tu carnet en la nube y tenerlo en todos tus dispositivos. Se entra con un enlace que te enviamos por correo, sin contraseña.'
					},
					{
						tipus: 'llista',
						items: [
							'**Qué datos:** tu correo electrónico; las ascensiones que registras (cima, fecha, método y la nota, si la pones); un alias, solo si quieres ponerlo; y los datos técnicos de la cuenta (fechas de alta y de último acceso y registros de acceso con la dirección IP, que se guardan por seguridad).',
							'**Para qué:** crear la cuenta, enviarte el enlace para entrar y guardar y sincronizar tu carnet entre dispositivos. No usamos el correo para nada más: ni publicidad ni boletines.',
							'**Base jurídica:** la ejecución del servicio que nos pides al crear la cuenta (art. 6.1.b del RGPD). El alias es voluntario y se basa en tu consentimiento (art. 6.1.a), que puedes retirar borrándolo.',
							`**Encargado del tratamiento:** [Supabase](${SUPABASE}) aloja la base de datos y gestiona el acceso por encargo nuestro, con servidores en la Unión Europea (Irlanda). Si alguna vez accede desde fuera del Espacio Económico Europeo, lo hace con las garantías del RGPD (cláusulas contractuales tipo), de acuerdo con su [acuerdo de tratamiento de datos](${SUPABASE_DPA}) y su [política de privacidad](${SUPABASE_PRIVACY}). También es Supabase quien te envía el correo con el enlace de acceso.`,
							'**Cuánto tiempo:** mientras tengas la cuenta. Si la borras, se eliminan la cuenta y todas las ascensiones guardadas en la nube; las copias de seguridad del proveedor, si las hay, se renuevan a los pocos días. Las ascensiones de tu dispositivo no se borran: puedes borrarlas aparte.',
							'**Menores:** para crear una cuenta hay que tener 14 años o más; por debajo de esa edad, debe crearla el padre, la madre o el tutor legal (art. 7 de la Ley Orgánica 3/2018).',
							'Nadie más ve tu carnet: cada cuenta solo puede leer y modificar sus propios datos.'
						]
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
							`**[Supabase](${SUPABASE})** (cuentas): solo si creas una cuenta o entras en ella. Recibe la dirección IP y las peticiones de sincronización, como encargado del tratamiento (ver el apartado «Si creas una cuenta»).`,
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
							'**Guardar y sincronizar tu carnet, si creas una cuenta.** Lo explicamos en el apartado «Si creas una cuenta».',
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
						text: 'Tienes derecho de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad. Si tienes cuenta, muchos puedes ejercerlos tú mismo desde «Tu cuenta», en la aplicación:'
					},
					{
						tipus: 'llista',
						items: [
							'**Acceso y portabilidad:** «Descargar mis datos» o «Exportar una copia (JSON)» te dan todas tus ascensiones en un archivo que puedes usar en otro sitio.',
							'**Rectificación:** puedes editar o borrar cada ascensión. Para cambiar el correo de la cuenta, escríbenos.',
							'**Supresión:** el botón «Borrar la cuenta» elimina la cuenta y todos los datos guardados en la nube.',
							'**Oposición y limitación del tratamiento:** escríbenos y lo atenderemos.'
						]
					},
					{
						tipus: 'paragraf',
						text: `Para cualquiera de estos derechos, también puedes escribir a ${TITULAR.correu}. Indica qué derecho quieres ejercer y, si hace falta, te pediremos lo mínimo necesario para comprobar tu identidad. Te responderemos en el plazo de un mes, como establece el [RGPD](${RGPD}).`
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
						text: 'Esta política cambiará cuando la web incorpore nuevas funciones o al salir de la beta. Antes de activarlas, la actualizaremos y cambiaremos su fecha de revisión:'
					},
					{
						tipus: 'llista',
						items: [
							'**Medición de audiencia**, si algún día la hay: sería sin cookies y sin datos personales identificables.'
						]
					}
				]
			}
		],
		actualitzat: '2026-10-09'
	}
};
