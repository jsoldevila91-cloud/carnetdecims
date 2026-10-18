/**
 * `/privacitat` (RGPD), ajustada al que fa el web AVUI (revisada el 2026-10-18, beta privada):
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
 *   preferències tècniques a `localStorage`: `carnetdecims:novetat-vista`, `carnetdecims:avis-installacio`
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
 * - bloc R1 (verificat el 2026-10-16):
 *   · companys del diari (`domain/diari.ts`): noms o àlies en text lliure, fins a 10 de 40
 *     caràcters per ascensió; es desen a la fila de l'ascensió (IndexedDB i, amb sessió,
 *     `public.ascensions.companys`, migració 0005), surten a l'exportació (versió 2, també la del
 *     compte) i s'esborren amb `esborrarTot` i `esborrar_compte`. Esborrar UNA ascensió en deixa la
 *     làpida, que conserva nota i companys 10 minuts (`FINESTRA_DESFER_MS`, per al «Desfés») i
 *     després es buida (`data/local/lapides.ts`), també al núvol i a l'exportació del compte;
 *   · municipi d'origen (`data/origen.ts`): només el codi del municipi, taula `preferencies`
 *     d'IndexedDB i, amb sessió, `public.perfils.origen_municipi` (RPC `sync_origen`); a
 *     l'exportació (`preferencies.origen`); `esborrarTot` i `esborrar_compte` l'esborren;
 *   · llista de municipis (`data/municipis/`): JSON estàtic del propi build (amb hash, del mateix
 *     origen), baixat amb `fetch` en diferit; la cerca es fa en memòria (`cercarMunicipis`), sense
 *     xarxa;
 *   · estadístiques (`data/estadistiques.ts`): calculades al client; no desen ni envien res.
 * - bloc R3 (2026-10-17): secció `compartir`. Imatge per compartir dibuixada amb canvas al client
 *   (`ui/compartir/imatge-carnet.ts`); enllaç `/{idioma}/carnet#c=…` amb cims, dates i nom opcional
 *   al fragment (`domain/carnet-compartit.ts`, `data/compartir.ts`; sense notes, companys, mètode ni
 *   ids), que no arriba mai al servidor ni es desa; llista de validació (`domain/validacio.ts`, CSV i
 *   impressió) generada al client, sense nom, DNI ni llicència (el full imprès els deixa en blanc).
 * - bloc R5 (2026-10-18): imatge d'una ascensió (`ui/compartir/imatge-ascensio.ts`, canvas al
 *   client) amb dades del catàleg i la data; sense nota, companys ni mètode. Temps actual de les
 *   llistes (`/cims`, `/app/essencials`): `GET /api/meteo/ara` al nostre origen, sense paràmetres
 *   (una foto de tot el catàleg, `ui/info-rapida-llista.svelte.ts`): no revela quins cims té
 *   pendents l'usuari; el Worker la demana a Open-Meteo amb coordenades i altitud dels cims; el SW
 *   no la desa (`xarxa`). Les restriccions vigents es calculen al client.
 * - fase 5 (2026-10-18): deduplicació d'ascensions (`domain/duplicats.ts`: mateix cim, data i
 *   mètode; es fusionen nota i companys) a la sync i a la importació. «Continua amb Google»
 *   (`PUBLIC_GOOGLE_AUTH`, desactivat): amb el flag actiu es mostra `privacitatAmbGoogle`.
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
const GOOGLE_PRIVACY = 'https://policies.google.com/privacy';

/**
 * Persona responsable del tractament (art. 13 del RGPD). Només es fa servir a la secció
 * `responsable` d'aquesta pàgina: enlloc més del web, ni a metadades ni a JSON-LD.
 */
export const RESPONSABLE_TRACTAMENT = 'Jonatan Soldevila Rafael';

/**
 * Política de privadesa segons si el build ofereix «Continua amb Google» (`googleAuthActiu`,
 * `platform/flags.ts`). Sense Google (avui) no se'n diu res: només es pot entrar amb el correu.
 * Amb Google s'hi afegeixen el proveïdor d'identitat (Google Ireland Limited), les dades que
 * envia (correu, nom i foto), que només fem servir el correu, la base jurídica i que és opcional.
 * Abans d'activar el flag a producció, cal posar a `actualitzat` la data d'activació.
 */
export function crearPrivacitat(google: boolean): Contingut {
	/** Text segons la variant: `g(ambGoogle, senseGoogle)`. */
	const g = (amb: string, sense: string): string => (google ? amb : sense);
	/** Elements de llista que només surten amb Google. */
	const nomesGoogle = (...items: string[]): string[] => (google ? items : []);
	return {
		ca: {
			title: 'Política de privadesa',
			description:
				'Com tracta Carnet de Cims les teves dades: compte opcional amb dades a la UE, sense cookies de seguiment ni analítica. Qui les tracta i quins drets tens.',
			h1: 'Política de privadesa',
			intro: `En resum: pots fer servir Carnet de Cims sense compte, i aleshores les ascensions es desen només al teu dispositiu. Si crees un compte (opcional), ${g("només fem servir el teu correu (l'escrius tu o, si entres amb Google, ens el passa Google)", 'et demanem només el correu')} i desem el teu carnet en servidors de la Unió Europea per sincronitzar-lo; el pots exportar i esborrar quan vulguis. No fem servir cookies de seguiment ni analítica. Aquí t'ho expliquem en detall, d'acord amb el Reglament general de protecció de dades (RGPD).`,
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
								`El compte és opcional: sense compte, no et demanem cap dada. Amb compte, només el correu (i, si vols, un àlies i el teu municipi d'origen). No et demanem el nom, ni l'adreça, ni el telèfon, ni l'edat.${g(' Si entres amb Google, Google també ens envia el teu nom i la foto del perfil, però no els fem servir.', '')}`,
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
							text: "Les ascensions que registres (cim, data, mètode i, si en vols posar, una nota i els noms dels companys) es desen al teu dispositiu, a la base de dades del navegador (IndexedDB). **Sense compte, es queden només aquí:** no s'envien a cap servidor i nosaltres no hi tenim accés. Si crees un compte, també se'n desa una còpia al núvol (ho expliquem a l'apartat «Si crees un compte»). El navegador pot demanar-te permís per conservar-les de manera persistent, perquè no les esborri si li falta espai."
						},
						{
							tipus: 'llista',
							items: [
								"**Exportar-les:** des de l'aplicació pots descarregar una còpia en un fitxer JSON (amb les ascensions, les notes, els companys i el municipi d'origen) i tornar-la a importar en un altre navegador o dispositiu. Si importes una ascensió que ja tens (el mateix cim, el mateix dia i amb el mateix mètode), no es duplica: es desa una sola vegada i se n'ajunten les notes i els companys.",
								"**Esborrar-les:** des de l'aplicació («Esborra totes les dades») pots esborrar del dispositiu totes les teves ascensions, amb les notes i els companys, i el municipi d'origen. També s'esborren si elimines les dades del lloc a la configuració del navegador. És irreversible: si no tens una còpia exportada, no les podrem recuperar, perquè no les tenim.",
								'**Si perds o canvies el dispositiu**, o esborres les dades del navegador, les ascensions que no tinguis al compte es perden: et recomanem crear un compte o exportar-ne una còpia de tant en tant.',
								"**La teva ubicació:** només quan la demanes amb un botó (ordenar per proximitat els essencials pendents, «La meva ubicació» al mapa o «Cims a prop»), i amb el permís que et demana el navegador. La posició es fa servir en aquest dispositiu per calcular les distàncies o centrar el mapa: no es desa ni s'envia enlloc. Si no dones permís, la resta funciona igual (per exemple, la llista d'essencials s'ordena per comarca).",
								"**El teu municipi d'origen (opcional):** si l'indiques, el fem servir per calcular a quina distància tens els cims, com el més llunyà que has pujat. Només desem el municipi, mai l'adreça. Es desa al dispositiu i, si tens compte, també al compte. El pots canviar o treure quan vulguis des del teu perfil, a l'aplicació, i surt a l'exportació. La llista de municipis es baixa del mateix web, com un fitxer més: la cerca es fa al teu dispositiu i no s'envia enlloc.",
								"**Els companys del diari (opcional):** a cada ascensió pots anotar amb qui hi has pujat, amb noms o àlies en text lliure. Són dades d'altres persones: et recomanem posar-hi només el nom de pila o un àlies, i fer-ho amb el seu permís. Es tracten igual que la nota: es desen amb l'ascensió al dispositiu i, si tens compte, també al compte, i surten a l'exportació. Els pots treure en qualsevol moment editant l'ascensió. Si esborres una ascensió, la nota i els companys es conserven 10 minuts perquè la puguis recuperar amb «Desfés», i després s'esborren, també del compte. Tots s'esborren alhora amb «Esborra totes les dades» (al dispositiu) o en esborrar el compte (al núvol).",
								"**Les estadístiques** (el cim que més has fet, el més llunyà, amb qui has pujat més…) es calculen al teu dispositiu a partir de les ascensions i del municipi d'origen. També els **reptes i les medalles**, que no es desen enlloc: es tornen a calcular cada vegada a partir de les ascensions. I **«El teu proper cim»** tria els cims recomanats al teu dispositiu; per a la previsió del temps només demana al nostre servidor la de cada cim candidat, sense el teu municipi ni cap altra dada teva. No es desa ni s'envia res més."
							]
						},
						{
							tipus: 'paragraf',
							text: "No fem servir cookies pròpies. Perquè el web funcioni sense connexió, el navegador hi desa una còpia dels fitxers del web, de les pàgines visitades, dels trossos de mapa que has consultat i de l'última previsió meteorològica dels cims que has mirat (memòria cau del service worker); també hi guarda tres preferències tècniques a l'emmagatzematge local (localStorage): si has tancat l'avís d'instal·lació o ja tens l'app instal·lada, si ja t'hem avisat que l'app està preparada per funcionar sense connexió i quina és l'última novetat del web que has vist (per no tornar-te-la a mostrar). Si entres al teu compte, hi guarda també la sessió (un identificador d'accés) perquè no hagis d'entrar cada vegada; s'esborra en tancar la sessió. A més, el web guarda informació tècnica de navegació a l'emmagatzematge de sessió (sessionStorage): la posició de desplaçament i l'estat de les pàgines visitades, perquè el botó Enrere funcioni bé. Res d'això no ens arriba, llevat de la sessió, que identifica el teu compte quan sincronitzes, i ho pots esborrar eliminant les dades del lloc a la configuració del navegador. A banda d'això, Wikiloc pot posar les seves pròpies galetes, però només si obres el mapa d'una de les seves rutes (ho expliquem a l'apartat de serveis de tercers)."
						}
					]
				},
				{
					id: 'compartir',
					titol: 'Compartir el carnet i preparar la validació',
					blocs: [
						{
							tipus: 'llista',
							items: [
								"**Les imatges per compartir** (la del carnet i la de cada ascensió) es dibuixen al teu dispositiu i no s'envien a cap servidor. Només surten del dispositiu si tu les comparteixes amb una altra aplicació. La d'una ascensió només porta el cim, l'altitud, la comarca i el dia: no hi surten ni la nota, ni els companys, ni el mètode.",
								"**L'enllaç de només lectura** porta dins els cims i les dates de les ascensions del carnet i, si n'hi poses, el nom que vulguis mostrar. No porta les notes, els companys ni el mètode. Aquestes dades van al fragment de l'enllaç (la part posterior al «#»), que el navegador no envia mai al servidor: no les rebem ni les desem enlloc, i la pàgina que obre l'enllaç les llegeix al dispositiu de qui l'obre.",
								"**Qualsevol persona que tingui l'enllaç pot veure aquestes dades**, i qualsevol que el rebi el pot reenviar. Comparteix-lo només amb qui vulguis. Un enllaç ja enviat no es pot desactivar, perquè no es desa enlloc.",
								"**La llista per a la validació** (CSV o versió per imprimir o desar en PDF) es genera al teu dispositiu i no surt d'aquí, llevat que tu l'enviïs. No et demanem ni desem el DNI ni el número de llicència: al full imprès hi queden en blanc perquè els escriguis a mà."
							]
						}
					]
				},
				{
					id: 'compte',
					titol: 'Si crees un compte',
					blocs: [
						{
							tipus: 'paragraf',
							text: `El compte és opcional i serveix per desar el teu carnet al núvol i tenir-lo a tots els teus dispositius. S'hi entra amb un enllaç que t'enviem per correu, sense contrasenya${g(', o, si ho prefereixes, amb el teu compte de Google', '')}. Si apuntes la mateixa ascensió (el mateix cim, el mateix dia i amb el mateix mètode) en dos dispositius, es desa una sola vegada i se n'ajunten les notes i els companys.`
						},
						{
							tipus: 'llista',
							items: [
								`**Quines dades:** el teu correu electrònic${g(' (i, si entres amb Google, el nom i la foto del perfil que ens envia Google)', '')}; les ascensions que registres (cim, data, mètode i, si n'hi poses, la nota i els companys); un àlies i el municipi d'origen, només si en vols posar; i les dades tècniques del compte (dates d'alta i d'últim accés i registres d'accés amb l'adreça IP, que es guarden per seguretat).`,
								`**Per a què:** crear el compte, enviar-te l'enllaç per entrar${g(' o identificar-te amb Google', '')} i desar i sincronitzar el teu carnet entre dispositius. No fem servir el correu per a res més: ni publicitat ni butlletins.`,
								...nomesGoogle(
									`**Entrar amb Google (opcional):** si tries «Continua amb Google», Google Ireland Limited fa de proveïdor d'identitat: hi entres a la pàgina de Google i, amb el teu permís, Google ens envia el teu correu, el nom i la foto del perfil. Només fem servir el correu, per crear el compte i identificar-te. El nom i la foto es guarden amb les dades tècniques del compte, no es mostren ni es fan servir per a res i s'esborren amb el compte. No rebem la teva contrasenya de Google ni cap altra dada del teu compte de Google. Base jurídica: l'execució del servei que ens demanes (art. 6.1.b del RGPD). És opcional: sempre pots entrar amb el correu. Google tracta les dades del teu compte de Google com a responsable, d'acord amb la seva [política de privadesa](${GOOGLE_PRIVACY}).`
								),
								"**Base jurídica:** l'execució del servei que ens demanes en crear el compte (art. 6.1.b del RGPD). L'àlies i el municipi d'origen són voluntaris i es basen en el teu consentiment (art. 6.1.a), que pots retirar esborrant-los.",
								`**Encarregat del tractament:** [Supabase](${SUPABASE}) allotja la base de dades i gestiona l'accés per encàrrec nostre, amb servidors a la Unió Europea (Irlanda). Si mai hi accedeix des de fora de l'Espai Econòmic Europeu, ho fa amb les garanties del RGPD (clàusules contractuals tipus), d'acord amb el seu [acord de tractament de dades](${SUPABASE_DPA}) i la seva [política de privadesa](${SUPABASE_PRIVACY}). També és Supabase qui t'envia el correu amb l'enllaç d'accés.`,
								"**Quant de temps:** mentre tinguis el compte. Si l'esborres, s'eliminen el compte i totes les dades desades al núvol (les ascensions amb les notes i els companys, l'àlies i el municipi d'origen); les còpies de seguretat del proveïdor, si n'hi ha, es renoven al cap de pocs dies. Les dades del teu dispositiu es conserven, llevat que en esborrar el compte triïs esborrar-les també; si no, les pots esborrar a part.",
								"**Menors:** per crear un compte cal tenir 14 anys o més; per sota d'aquesta edat, l'ha de crear el pare, la mare o el tutor legal (art. 7 de la Llei orgànica 3/2018).",
								'Ningú més no veu el teu carnet al núvol: cada compte només pot llegir i modificar les seves pròpies dades. (Si en comparteixes un enllaç, les dades hi van dins i no passen pel núvol; ho expliquem a «Compartir el carnet i preparar la validació».)'
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
								`**[Open-Meteo](${OPEN_METEO})** (previsió meteorològica de les fitxes de cim i d'«El teu proper cim», i temps actual de la llista de cims i dels essencials): **no rep la teva IP**. El teu navegador només demana les dades al nostre servidor, i és el nostre servidor qui les demana a Open-Meteo amb les coordenades i l'altitud dels cims, sense cap dada teva. Per al temps actual de les llistes, el navegador demana sempre el de tot el catàleg, de manera que la petició no diu quins cims tens fets o pendents.`,
								`**[Wikiloc](${WIKILOC})** (rutes recomanades d'algunes fitxes de cim): el mapa de cada ruta **no es carrega fins que prems «Mostra la ruta»**; abans no es fa cap connexió amb Wikiloc. Quan el prems, el navegador carrega el mapa des dels servidors de Wikiloc, que rep la teva adreça IP i pot fer servir les seves pròpies galetes, sota la seva responsabilitat i d'acord amb la seva [política de privadesa](${WIKILOC_PRIVACY}). Els enllaços «Obre a Wikiloc» i «Veure rutes a Wikiloc» et porten al seu web només si hi fas clic.`,
								`**[Supabase](${SUPABASE})** (comptes): només si crees un compte o hi entres. Rep l'adreça IP i les peticions de sincronització, com a encarregat del tractament (vegeu l'apartat «Si crees un compte»).`,
								...nomesGoogle(
									`**[Google](${GOOGLE_PRIVACY})** (entrar amb Google): només si tries «Continua amb Google». A la seva pàgina d'entrada, Google rep la teva adreça IP i pot fer servir les seves pròpies galetes, sota la seva responsabilitat (vegeu l'apartat «Si crees un compte»).`
								),
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
								"**Accés i portabilitat:** «Descarrega les meves dades» o «Exporta una còpia (JSON)» et donen en un fitxer totes les teves ascensions, amb les notes i els companys, i el municipi d'origen, perquè les puguis fer servir en un altre lloc.",
								"**Rectificació:** pots editar o esborrar cada ascensió, i canviar o treure el municipi d'origen. Per canviar el correu del compte, escriu-nos.",
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
			actualitzat: '2026-10-18'
		},
		es: {
			title: 'Política de privacidad',
			description:
				'Cómo trata Carnet de Cims tus datos: cuenta opcional con datos en la UE, sin cookies de seguimiento ni analítica. Quién los trata y qué derechos tienes.',
			h1: 'Política de privacidad',
			intro: `En resumen: puedes usar Carnet de Cims sin cuenta, y entonces las ascensiones se guardan solo en tu dispositivo. Si creas una cuenta (opcional), ${g('solo usamos tu correo (lo escribes tú o, si entras con Google, nos lo pasa Google)', 'solo te pedimos el correo')} y guardamos tu carnet en servidores de la Unión Europea para sincronizarlo; puedes exportarlo y borrarlo cuando quieras. No usamos cookies de seguimiento ni analítica. Aquí te lo explicamos en detalle, de acuerdo con el Reglamento general de protección de datos (RGPD).`,
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
								`La cuenta es opcional: sin cuenta, no te pedimos ningún dato. Con cuenta, solo el correo (y, si quieres, un alias y tu municipio de origen). No te pedimos el nombre, ni la dirección, ni el teléfono, ni la edad.${g(' Si entras con Google, Google también nos envía tu nombre y la foto del perfil, pero no los usamos.', '')}`,
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
							text: 'Las ascensiones que registras (cima, fecha, método y, si quieres, una nota y los nombres de los compañeros) se guardan en tu dispositivo, en la base de datos del navegador (IndexedDB). **Sin cuenta, se quedan solo aquí:** no se envían a ningún servidor y nosotros no tenemos acceso a ellas. Si creas una cuenta, también se guarda una copia en la nube (lo explicamos en el apartado «Si creas una cuenta»). El navegador puede pedirte permiso para conservarlas de forma persistente, para que no las borre si le falta espacio.'
						},
						{
							tipus: 'llista',
							items: [
								'**Exportarlas:** desde la aplicación puedes descargar una copia en un archivo JSON (con las ascensiones, las notas, los compañeros y el municipio de origen) y volver a importarla en otro navegador o dispositivo. Si importas una ascensión que ya tienes (la misma cima, el mismo día y con el mismo método), no se duplica: se guarda una sola vez y se juntan las notas y los compañeros.',
								'**Borrarlas:** desde la aplicación («Borrar todos los datos») puedes borrar del dispositivo todas tus ascensiones, con las notas y los compañeros, y el municipio de origen. También se borran si eliminas los datos del sitio en la configuración del navegador. Es irreversible: si no tienes una copia exportada, no podremos recuperarlas, porque no las tenemos.',
								'**Si pierdes o cambias de dispositivo**, o borras los datos del navegador, las ascensiones que no tengas en la cuenta se pierden: te recomendamos crear una cuenta o exportar una copia de vez en cuando.',
								'**Tu ubicación:** solo cuando la pides con un botón (ordenar por proximidad las esenciales pendientes, «Mi ubicación» en el mapa o «Cimas cerca»), y con el permiso que te pide el navegador. La posición se usa en este dispositivo para calcular las distancias o centrar el mapa: no se guarda ni se envía a ningún sitio. Si no das permiso, el resto funciona igual (por ejemplo, la lista de esenciales se ordena por comarca).',
								'**Tu municipio de origen (opcional):** si lo indicas, lo usamos para calcular a qué distancia tienes las cimas, como la más lejana que has subido. Solo guardamos el municipio, nunca la dirección. Se guarda en el dispositivo y, si tienes cuenta, también en la cuenta. Puedes cambiarlo o quitarlo cuando quieras desde tu perfil, en la aplicación, y aparece en la exportación. La lista de municipios se descarga de la propia web, como un archivo más: la búsqueda se hace en tu dispositivo y no se envía a ningún sitio.',
								'**Los compañeros del diario (opcional):** en cada ascensión puedes anotar con quién has subido, con nombres o alias en texto libre. Son datos de otras personas: te recomendamos poner solo el nombre de pila o un alias, y hacerlo con su permiso. Se tratan igual que la nota: se guardan con la ascensión en el dispositivo y, si tienes cuenta, también en la cuenta, y aparecen en la exportación. Puedes quitarlos en cualquier momento editando la ascensión. Si borras una ascensión, la nota y los compañeros se conservan 10 minutos para que puedas recuperarla con «Deshacer», y después se borran, también de la cuenta. Todos se borran a la vez con «Borrar todos los datos» (en el dispositivo) o al borrar la cuenta (en la nube).',
								'**Las estadísticas** (la cima que más has hecho, la más lejana, con quién has subido más…) se calculan en tu dispositivo a partir de las ascensiones y del municipio de origen. También los **retos y las medallas**, que no se guardan en ningún sitio: se vuelven a calcular cada vez a partir de las ascensiones. Y **«Tu próxima cima»** elige las cimas recomendadas en tu dispositivo; para la previsión del tiempo solo pide a nuestro servidor la de cada cima candidata, sin tu municipio ni ningún otro dato tuyo. No se guarda ni se envía nada más.'
							]
						},
						{
							tipus: 'paragraf',
							text: 'No usamos cookies propias. Para que la web funcione sin conexión, el navegador guarda una copia de los archivos de la web, de las páginas visitadas, de los fragmentos de mapa que has consultado y de la última previsión meteorológica de las cimas que has mirado (memoria caché del service worker); también guarda tres preferencias técnicas en el almacenamiento local (localStorage): si has cerrado el aviso de instalación o ya tienes la app instalada, si ya te hemos avisado de que la app está preparada para funcionar sin conexión y cuál es la última novedad de la web que has visto (para no volver a mostrártela). Si entras en tu cuenta, guarda también la sesión (un identificador de acceso) para que no tengas que entrar cada vez; se borra al cerrar la sesión. Además, la web guarda información técnica de navegación en el almacenamiento de sesión (sessionStorage): la posición de desplazamiento y el estado de las páginas visitadas, para que el botón Atrás funcione bien. Nada de esto nos llega, salvo la sesión, que identifica tu cuenta cuando sincronizas, y puedes borrarlo eliminando los datos del sitio en la configuración del navegador. Aparte de eso, Wikiloc puede poner sus propias cookies, pero solo si abres el mapa de una de sus rutas (lo explicamos en el apartado de servicios de terceros).'
						}
					]
				},
				{
					id: 'compartir',
					titol: 'Compartir el carnet y preparar la validación',
					blocs: [
						{
							tipus: 'llista',
							items: [
								'**Las imágenes para compartir** (la del carnet y la de cada ascensión) se dibujan en tu dispositivo y no se envían a ningún servidor. Solo salen del dispositivo si tú las compartes con otra aplicación. La de una ascensión solo lleva la cima, la altitud, la comarca y el día: no aparecen ni la nota, ni los compañeros, ni el método.',
								'**El enlace de solo lectura** lleva dentro las cimas y las fechas de las ascensiones del carnet y, si lo pones, el nombre que quieras mostrar. No lleva las notas, los compañeros ni el método. Estos datos van en el fragmento del enlace (la parte que sigue a «#»), que el navegador nunca envía al servidor: no los recibimos ni los guardamos en ningún sitio, y la página que abre el enlace los lee en el dispositivo de quien lo abre.',
								'**Cualquier persona que tenga el enlace puede ver estos datos**, y cualquiera que lo reciba puede reenviarlo. Compártelo solo con quien quieras. Un enlace ya enviado no se puede desactivar, porque no se guarda en ningún sitio.',
								'**La lista para la validación** (CSV o versión para imprimir o guardar en PDF) se genera en tu dispositivo y no sale de aquí, salvo que tú la envíes. No te pedimos ni guardamos el DNI ni el número de licencia: en la hoja impresa quedan en blanco para que los escribas a mano.'
							]
						}
					]
				},
				{
					id: 'compte',
					titol: 'Si creas una cuenta',
					blocs: [
						{
							tipus: 'paragraf',
							text: `La cuenta es opcional y sirve para guardar tu carnet en la nube y tenerlo en todos tus dispositivos. Se entra con un enlace que te enviamos por correo, sin contraseña${g(' o, si lo prefieres, con tu cuenta de Google', '')}. Si apuntas la misma ascensión (la misma cima, el mismo día y con el mismo método) en dos dispositivos, se guarda una sola vez y se juntan las notas y los compañeros.`
						},
						{
							tipus: 'llista',
							items: [
								`**Qué datos:** tu correo electrónico${g(' (y, si entras con Google, el nombre y la foto del perfil que nos envía Google)', '')}; las ascensiones que registras (cima, fecha, método y, si los pones, la nota y los compañeros); un alias y el municipio de origen, solo si quieres ponerlos; y los datos técnicos de la cuenta (fechas de alta y de último acceso y registros de acceso con la dirección IP, que se guardan por seguridad).`,
								`**Para qué:** crear la cuenta, enviarte el enlace para entrar${g(' o identificarte con Google', '')} y guardar y sincronizar tu carnet entre dispositivos. No usamos el correo para nada más: ni publicidad ni boletines.`,
								...nomesGoogle(
									`**Entrar con Google (opcional):** si eliges «Continuar con Google», Google Ireland Limited actúa como proveedor de identidad: entras en la página de Google y, con tu permiso, Google nos envía tu correo, el nombre y la foto del perfil. Solo usamos el correo, para crear la cuenta e identificarte. El nombre y la foto se guardan con los datos técnicos de la cuenta, no se muestran ni se usan para nada y se borran con la cuenta. No recibimos tu contraseña de Google ni ningún otro dato de tu cuenta de Google. Base jurídica: la ejecución del servicio que nos pides (art. 6.1.b del RGPD). Es opcional: siempre puedes entrar con el correo. Google trata los datos de tu cuenta de Google como responsable, de acuerdo con su [política de privacidad](${GOOGLE_PRIVACY}).`
								),
								'**Base jurídica:** la ejecución del servicio que nos pides al crear la cuenta (art. 6.1.b del RGPD). El alias y el municipio de origen son voluntarios y se basan en tu consentimiento (art. 6.1.a), que puedes retirar borrándolos.',
								`**Encargado del tratamiento:** [Supabase](${SUPABASE}) aloja la base de datos y gestiona el acceso por encargo nuestro, con servidores en la Unión Europea (Irlanda). Si alguna vez accede desde fuera del Espacio Económico Europeo, lo hace con las garantías del RGPD (cláusulas contractuales tipo), de acuerdo con su [acuerdo de tratamiento de datos](${SUPABASE_DPA}) y su [política de privacidad](${SUPABASE_PRIVACY}). También es Supabase quien te envía el correo con el enlace de acceso.`,
								'**Cuánto tiempo:** mientras tengas la cuenta. Si la borras, se eliminan la cuenta y todos los datos guardados en la nube (las ascensiones con las notas y los compañeros, el alias y el municipio de origen); las copias de seguridad del proveedor, si las hay, se renuevan a los pocos días. Los datos de tu dispositivo se conservan, salvo que al borrar la cuenta elijas borrarlos también; si no, puedes borrarlos aparte.',
								'**Menores:** para crear una cuenta hay que tener 14 años o más; por debajo de esa edad, debe crearla el padre, la madre o el tutor legal (art. 7 de la Ley Orgánica 3/2018).',
								'Nadie más ve tu carnet en la nube: cada cuenta solo puede leer y modificar sus propios datos. (Si compartes un enlace, los datos van dentro y no pasan por la nube; lo explicamos en «Compartir el carnet y preparar la validación».)'
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
								`**[Open-Meteo](${OPEN_METEO})** (previsión meteorológica de las fichas de cima y de «Tu próxima cima», y tiempo actual de la lista de cimas y de las esenciales): **no recibe tu IP**. Tu navegador solo pide los datos a nuestro servidor, y es nuestro servidor quien los pide a Open-Meteo con las coordenadas y la altitud de las cimas, sin ningún dato tuyo. Para el tiempo actual de las listas, el navegador pide siempre el de todo el catálogo, así que la petición no dice qué cimas tienes hechas o pendientes.`,
								`**[Wikiloc](${WIKILOC})** (rutas recomendadas de algunas fichas de cima): el mapa de cada ruta **no se carga hasta que pulsas «Mostrar la ruta»**; antes no se establece ninguna conexión con Wikiloc. Cuando lo pulsas, el navegador carga el mapa desde los servidores de Wikiloc, que recibe tu dirección IP y puede usar sus propias cookies, bajo su responsabilidad y según su [política de privacidad](${WIKILOC_PRIVACY}). Los enlaces «Abrir en Wikiloc» y «Ver rutas en Wikiloc» te llevan a su web solo si haces clic en ellos.`,
								`**[Supabase](${SUPABASE})** (cuentas): solo si creas una cuenta o entras en ella. Recibe la dirección IP y las peticiones de sincronización, como encargado del tratamiento (ver el apartado «Si creas una cuenta»).`,
								...nomesGoogle(
									`**[Google](${GOOGLE_PRIVACY})** (entrar con Google): solo si eliges «Continuar con Google». En su página de acceso, Google recibe tu dirección IP y puede usar sus propias cookies, bajo su responsabilidad (ver el apartado «Si creas una cuenta»).`
								),
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
								'**Acceso y portabilidad:** «Descargar mis datos» o «Exportar una copia (JSON)» te dan en un archivo todas tus ascensiones, con las notas y los compañeros, y el municipio de origen, para que puedas usarlas en otro sitio.',
								'**Rectificación:** puedes editar o borrar cada ascensión, y cambiar o quitar el municipio de origen. Para cambiar el correo de la cuenta, escríbenos.',
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
			actualitzat: '2026-10-18'
		}
	};
}

/** Política vigent: sense entrada amb Google (`PUBLIC_GOOGLE_AUTH` desactivat). */
export const privacitat: Contingut = crearPrivacitat(false);

/** Variant per al build amb `PUBLIC_GOOGLE_AUTH` actiu (la tria `PaginaContingut`). */
export const privacitatAmbGoogle: Contingut = crearPrivacitat(true);
