/**
 * `/metodologia`: d'on surten les dades del catàleg, criteris, confiança, revisió i atribucions.
 * Fets verificats contra `scripts/catalog/` (build.ts, fonts/*), `scripts/catalog/informe.md` i
 * docs/03-modelo-datos.md §4 (2026-09-29). Si canvia el catàleg, cal revisar les xifres.
 */
import { TITULAR } from './titular.ts';
import type { Contingut } from './types.ts';

const PDF_ESSENCIALS = 'https://www.feec.cat/wp-content/uploads/2020/02/Essencials-100-cims.pdf';
const FEEC_RESTRICCIONS = 'https://www.feec.cat/activitats/100-cims/cims-amb-restriccions-dacces/';
const FEEC_100_CIMS = 'https://www.feec.cat/activitats/100-cims/';
const ICGC_GEOCODIFICADOR = 'https://openicgc.github.io/geocodificador-doc/';
const OPEN_ICGC = 'https://openicgc.github.io/';
const IGN_GEOSERVICES = 'https://geoservices.ign.fr/';
const WIKIDATA = 'https://www.wikidata.org/';
const OSM_COPYRIGHT = 'https://www.openstreetmap.org/copyright';
const ODBL = 'https://opendatacommons.org/licenses/odbl/1-0/';
const ETALAB = 'https://www.etalab.gouv.fr/licence-ouverte-open-licence/';
const OPENMAPTILES = 'https://openmaptiles.org/';
const MAPTERHORN_ATRIBUCIO = 'https://mapterhorn.com/attribution';

const ACTUALITZAT = '2026-10-02';
const CONSULTAT = '2026-09-28';

export const metodologia: Contingut = {
	ca: {
		title: 'Metodologia i fonts de les dades dels cims',
		description:
			"Com fem el catàleg de cims del repte 100 Cims: fonts (ICGC, IGN, Wikidata, OSM), criteris d'altitud i coordenades, revisió i llicències.",
		h1: 'Metodologia i fonts de les dades',
		intro:
			"Expliquem d'on surt cada dada del catàleg, com triem quan les fonts no coincideixen i com el revisem. Carnet de Cims és una web independent: aquest catàleg no és el registre oficial de la FEEC.",
		seccions: [
			{
				id: 'abast',
				titol: 'Què inclou el catàleg',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Ara mateix el catàleg té els **150 cims essencials** del repte 100 Cims, a Catalunya, Andorra i la Catalunya Nord. Més endavant hi volem afegir la resta de cims del repte, amb el mateix mètode.'
					},
					{
						tipus: 'paragraf',
						text: "De cada cim en recollim el nom, la comarca, l'altitud, les coordenades, si és essencial i les restriccions d'accés conegudes. Les pots consultar a la [llista de cims](/cims) o per [comarques](/comarques)."
					}
				]
			},
			{
				id: 'fonts',
				titol: "D'on surten les dades",
				blocs: [
					{
						tipus: 'llista',
						items: [
							`**Quins cims són essencials i a quina comarca els situa la FEEC:** la [llista pública de cims essencials](${PDF_ESSENCIALS}) de la FEEC (PDF). No en copiem res més.`,
							`**Coordenades i grafia dels noms a Catalunya:** el [geocodificador de l'ICGC](${ICGC_GEOCODIFICADOR}) (Institut Cartogràfic i Geològic de Catalunya), que dona els topònims oficials. És la font de les coordenades de 134 cims.`,
							"**Altitud de control a Catalunya i a part d'Andorra:** el model d'elevacions del terreny de 5 × 5 m de l'ICGC.",
							`**Catalunya Nord:** les coordenades i les elevacions de la Géoplateforme de l'[IGN](${IGN_GEOSERVICES}) (l'institut cartogràfic francès). Coordenades de 6 cims.`,
							`**[Wikidata](${WIKIDATA}):** l'altitud declarada de la majoria de cims (147) i les coordenades de 10, sobretot a Andorra i en casos revisats a mà.`,
							`**[OpenStreetMap](${OSM_COPYRIGHT}):** comprovació creuada de noms, punts i altituds, i l'altitud de 2 cims. Cap coordenada publicada no surt d'OpenStreetMap.`,
							"**Límits comarcals:** els de l'ICGC, només per comprovar que cada cim és dins de la seva comarca.",
							`**Restriccions d'accés:** la [pàgina de restriccions de la FEEC](${FEEC_RESTRICCIONS}), revisada a mà.`,
							"**Mapes de les fitxes i de les comarques:** el mapa topogràfic de l'ICGC a Catalunya i Andorra, i el Plan IGN a la Catalunya Nord.",
							"**[Mapa interactiu](/mapa):** el mapa base vectorial de l'ICGC (amb dades d'OpenMapTiles i OpenStreetMap fora de Catalunya), l'ombrejat del relleu de l'ICGC i de Mapterhorn i, a la Catalunya Nord, el Plan IGN. Els cims hi són amb les coordenades del catàleg."
						]
					},
					{
						tipus: 'paragraf',
						text: "No reproduïm la taula de cims de la web de la FEEC: ni les altituds ni el nombre d'ascensions. Les altituds i les coordenades les obtenim nosaltres de fonts obertes."
					}
				]
			},
			{
				id: 'criteris',
				titol: 'Com triem quan les fonts no coincideixen',
				blocs: [
					{
						tipus: 'llista',
						items: [
							"**Preval l'ICGC.** Si les fonts discrepen en la comarca, les coordenades o la grafia del nom, ens quedem amb l'ICGC, que és la referència oficial a Catalunya.",
							"**Altitud: la cota més coneguda.** Publiquem la cota que surt als mapes i a les ressenyes, sempre que quedi a ±15 m del punt més alt del model d'elevacions (ICGC, o IGN a la Catalunya Nord) en un radi de 60 m al voltant del cim. No publiquem el màxim brut del model, que pot diferir uns metres de la cota dels mapes. Si cap cota declarada no hi encaixa, fem servir el valor del model arrodonit.",
							"**Andorra.** On no hi ha model d'elevacions oficial, exigim que dues fonts independents coincideixin.",
							'**Noms repetits.** Quan dos cims es diuen igual, triem el que és dins de la comarca assignada i ho deixem documentat.',
							'**Decisions a mà.** Els casos especials (noms repetits, límits comarcals canviats, punts desplaçats) queden anotats amb la seva justificació i la font.'
						]
					}
				]
			},
			{
				id: 'confianca',
				titol: 'Nivells de confiança',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Cada cim té un nivell de confiança que es calcula automàticament en construir el catàleg:'
					},
					{
						tipus: 'llista',
						items: [
							"**Alta:** el nom coincideix a la font principal, una altra font situa el cim a menys de 300 m, almenys dues altituds coincideixen (±15 m), no hi ha cims amb el mateix nom a prop i el punt més alt del model d'elevacions és a tocar de la coordenada.",
							'**Mitjana:** la resta de casos. Solen ser cims resolts a mà o amb alguna dada per confirmar.',
							'**Baixa:** sense coordenades o sense altitud, o amb una coincidència de nom parcial que cap altra font no confirma.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'A 29 de setembre de 2026: 146 cims amb confiança alta, 4 amb confiança mitjana i cap amb confiança baixa.'
					}
				]
			},
			{
				id: 'revisio',
				titol: 'Estat de revisió',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'**Esborrany:** dades obtingudes i comprovades automàticament, però encara no revisades per una persona. La fitxa ho indica amb un avís.',
							"**Revisat:** una persona amb criteri de muntanya n'ha comprovat les dades i els textos."
						]
					},
					{
						tipus: 'paragraf',
						text: "Ara mateix totes les fitxes són esborranys. Més endavant hi afegirem descripcions, accessos i dificultat (MIDE). Els textos es redactaran amb ajuda d'eines d'intel·ligència artificial a partir de fonts citades, i una persona els revisarà abans de marcar la fitxa com a revisada."
					}
				]
			},
			{
				id: 'no-oficial',
				titol: 'Una web no oficial',
				blocs: [
					{
						tipus: 'avis',
						to: 'info',
						text: `Carnet de Cims és una web independent, no oficial i no vinculada a la FEEC. Les dades són orientatives. La llista vigent, la normativa i la validació d'ascensions són les de la [FEEC](${FEEC_100_CIMS}), a través de les entitats.`
					}
				]
			},
			{
				id: 'errors',
				titol: 'Has trobat un error?',
				blocs: [
					{
						tipus: 'paragraf',
						text: `Si una coordenada, una altitud, un nom o una restricció no és correcta, escriu-nos a ${TITULAR.correu}. Indica el cim i, si pots, d'on surt la dada correcta (mapa, ressenya, fotografia del vèrtex geodèsic…). Revisem cada avís i, si cal, corregim el catàleg i n'anotem la font.`
					}
				]
			},
			{
				id: 'llicencies',
				titol: 'Llicències i atribucions',
				blocs: [
					{
						tipus: 'llista',
						items: [
							`Coordenades, topònims, elevacions, límits comarcals i mapes de Catalunya: © Institut Cartogràfic i Geològic de Catalunya ([ICGC](${OPEN_ICGC})), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ca).`,
							`Catalunya Nord: © IGN France (BD TOPO, RGE ALTI, Plan IGN), [Llicència Oberta 2.0](${ETALAB}).`,
							`© [Col·laboradors d'OpenStreetMap](${OSM_COPYRIGHT}), dades sota llicència [ODbL 1.0](${ODBL}).`,
							`Mapa interactiu: © [OpenMapTiles](${OPENMAPTILES}) i, per a l'ombrejat del relleu, © [Mapterhorn](${MAPTERHORN_ATRIBUCIO}).`,
							`Altituds i coordenades complementàries: [Wikidata](${WIKIDATA}), dades en domini públic ([CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.ca)). La citem per transparència.`,
							`Llista de cims essencials: FEEC, repte 100 Cims ([llista pública](${PDF_ESSENCIALS})). Web no oficial; la validació d'ascensions la fa la FEEC a través de les entitats.`
						]
					},
					{
						tipus: 'paragraf',
						text: "Algunes altituds deriven d'OpenStreetMap. Si mai oferim el catàleg com a base de dades descarregable, aquesta part s'oferirà sota llicència ODbL o se substituirà per una altra font."
					},
					{
						tipus: 'paragraf',
						text: '"100 Cims" és una marca de la FEEC. Aquí només s\'utilitza per descriure el repte. Més detalls a l\'[avís legal](/avis-legal).'
					}
				]
			}
		],
		faq: [
			{
				pregunta: "Per què l'altitud d'un cim no coincideix amb la d'una altra font?",
				resposta:
					"Cada font mesura d'una manera: els mapes donen una cota arrodonida i els models d'elevacions, el punt més alt d'una graella. Publiquem la cota més coneguda si encaixa a ±15 m amb el model d'elevacions de l'ICGC o de l'IGN."
			},
			{
				pregunta: 'Les dades de Carnet de Cims són oficials?',
				resposta:
					"No. És una web independent i no oficial. La llista vigent i la validació d'ascensions del repte 100 Cims són les de la FEEC."
			},
			{
				pregunta: "Com puc avisar d'un error en un cim?",
				resposta: `Escriu-nos a ${TITULAR.correu} amb el nom del cim i, si pots, la font de la dada correcta.`
			}
		],
		fonts: [
			{ nom: 'FEEC: llista de cims essencials (PDF)', url: PDF_ESSENCIALS, consultat: CONSULTAT },
			{ nom: "FEEC: cims amb restriccions d'accés", url: FEEC_RESTRICCIONS, consultat: CONSULTAT },
			{
				nom: 'ICGC: documentació del geocodificador',
				url: ICGC_GEOCODIFICADOR,
				consultat: CONSULTAT
			},
			{ nom: 'IGN: Géoplateforme', url: IGN_GEOSERVICES, consultat: CONSULTAT },
			{ nom: "OpenStreetMap: drets d'autor i llicència", url: OSM_COPYRIGHT, consultat: CONSULTAT }
		],
		actualitzat: ACTUALITZAT
	},
	es: {
		title: 'Metodología y fuentes de datos de las cimas',
		description:
			'Cómo hacemos el catálogo de cimas del reto 100 Cims: fuentes (ICGC, IGN, Wikidata, OSM), criterios de altitud y coordenadas, revisión y licencias.',
		h1: 'Metodología y fuentes de los datos',
		intro:
			'Explicamos de dónde sale cada dato del catálogo, cómo elegimos cuando las fuentes no coinciden y cómo lo revisamos. Carnet de Cims es una web independiente: este catálogo no es el registro oficial de la FEEC.',
		seccions: [
			{
				id: 'abast',
				titol: 'Qué incluye el catálogo',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Ahora mismo el catálogo tiene las **150 cimas esenciales** del reto 100 Cims, en Cataluña, Andorra y Cataluña Norte. Más adelante queremos añadir el resto de cimas del reto, con el mismo método.'
					},
					{
						tipus: 'paragraf',
						text: 'De cada cima recogemos el nombre, la comarca, la altitud, las coordenadas, si es esencial y las restricciones de acceso conocidas. Puedes consultarlas en la [lista de cimas](/cims) o por [comarcas](/comarques).'
					}
				]
			},
			{
				id: 'fonts',
				titol: 'De dónde salen los datos',
				blocs: [
					{
						tipus: 'llista',
						items: [
							`**Qué cimas son esenciales y en qué comarca las sitúa la FEEC:** la [lista pública de cimas esenciales](${PDF_ESSENCIALS}) de la FEEC (PDF). No copiamos nada más.`,
							`**Coordenadas y grafía de los nombres en Cataluña:** el [geocodificador del ICGC](${ICGC_GEOCODIFICADOR}) (Institut Cartogràfic i Geològic de Catalunya), que da los topónimos oficiales. Es la fuente de las coordenadas de 134 cimas.`,
							'**Altitud de control en Cataluña y en parte de Andorra:** el modelo de elevaciones del terreno de 5 × 5 m del ICGC.',
							`**Cataluña Norte:** las coordenadas y las elevaciones de la Géoplateforme del [IGN](${IGN_GEOSERVICES}) (el instituto cartográfico francés). Coordenadas de 6 cimas.`,
							`**[Wikidata](${WIKIDATA}):** la altitud declarada de la mayoría de cimas (147) y las coordenadas de 10, sobre todo en Andorra y en casos revisados a mano.`,
							`**[OpenStreetMap](${OSM_COPYRIGHT}):** comprobación cruzada de nombres, puntos y altitudes, y la altitud de 2 cimas. Ninguna coordenada publicada sale de OpenStreetMap.`,
							'**Límites comarcales:** los del ICGC, solo para comprobar que cada cima está dentro de su comarca.',
							`**Restricciones de acceso:** la [página de restricciones de la FEEC](${FEEC_RESTRICCIONS}), revisada a mano.`,
							'**Mapas de las fichas y de las comarcas:** el mapa topográfico del ICGC en Cataluña y Andorra, y el Plan IGN en Cataluña Norte.',
							'**[Mapa interactivo](/mapa):** el mapa base vectorial del ICGC (con datos de OpenMapTiles y OpenStreetMap fuera de Cataluña), el sombreado del relieve del ICGC y de Mapterhorn y, en Cataluña Norte, el Plan IGN. Las cimas aparecen con las coordenadas del catálogo.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'No reproducimos la tabla de cimas de la web de la FEEC: ni las altitudes ni el número de ascensiones. Las altitudes y las coordenadas las obtenemos nosotros de fuentes abiertas.'
					}
				]
			},
			{
				id: 'criteris',
				titol: 'Cómo elegimos cuando las fuentes no coinciden',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'**Prevalece el ICGC.** Si las fuentes discrepan en la comarca, las coordenadas o la grafía del nombre, nos quedamos con el ICGC, que es la referencia oficial en Cataluña.',
							'**Altitud: la cota más conocida.** Publicamos la cota que aparece en los mapas y en las reseñas, siempre que quede a ±15 m del punto más alto del modelo de elevaciones (ICGC, o IGN en Cataluña Norte) en un radio de 60 m alrededor de la cima. No publicamos el máximo bruto del modelo, que puede diferir unos metros de la cota de los mapas. Si ninguna cota declarada encaja, usamos el valor del modelo redondeado.',
							'**Andorra.** Donde no hay modelo de elevaciones oficial, exigimos que dos fuentes independientes coincidan.',
							'**Nombres repetidos.** Cuando dos cimas se llaman igual, elegimos la que está dentro de la comarca asignada y lo dejamos documentado.',
							'**Decisiones a mano.** Los casos especiales (nombres repetidos, límites comarcales cambiados, puntos desplazados) quedan anotados con su justificación y la fuente.'
						]
					}
				]
			},
			{
				id: 'confianca',
				titol: 'Niveles de confianza',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Cada cima tiene un nivel de confianza que se calcula automáticamente al construir el catálogo:'
					},
					{
						tipus: 'llista',
						items: [
							'**Alta:** el nombre coincide en la fuente principal, otra fuente sitúa la cima a menos de 300 m, al menos dos altitudes coinciden (±15 m), no hay cimas con el mismo nombre cerca y el punto más alto del modelo de elevaciones está junto a la coordenada.',
							'**Media:** el resto de casos. Suelen ser cimas resueltas a mano o con algún dato por confirmar.',
							'**Baja:** sin coordenadas o sin altitud, o con una coincidencia de nombre parcial que ninguna otra fuente confirma.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'A 29 de septiembre de 2026: 146 cimas con confianza alta, 4 con confianza media y ninguna con confianza baja.'
					}
				]
			},
			{
				id: 'revisio',
				titol: 'Estado de revisión',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'**Borrador:** datos obtenidos y comprobados automáticamente, pero aún no revisados por una persona. La ficha lo indica con un aviso.',
							'**Revisada:** una persona con criterio de montaña ha comprobado sus datos y sus textos.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'Ahora mismo todas las fichas son borradores. Más adelante añadiremos descripciones, accesos y dificultad (MIDE). Los textos se redactarán con ayuda de herramientas de inteligencia artificial a partir de fuentes citadas, y una persona los revisará antes de marcar la ficha como revisada.'
					}
				]
			},
			{
				id: 'no-oficial',
				titol: 'Una web no oficial',
				blocs: [
					{
						tipus: 'avis',
						to: 'info',
						text: `Carnet de Cims es una web independiente, no oficial y no vinculada a la FEEC. Los datos son orientativos. La lista vigente, la normativa y la validación de ascensiones son las de la [FEEC](${FEEC_100_CIMS}), a través de las entidades.`
					}
				]
			},
			{
				id: 'errors',
				titol: '¿Has encontrado un error?',
				blocs: [
					{
						tipus: 'paragraf',
						text: `Si una coordenada, una altitud, un nombre o una restricción no es correcta, escríbenos a ${TITULAR.correu}. Indica la cima y, si puedes, de dónde sale el dato correcto (mapa, reseña, fotografía del vértice geodésico…). Revisamos cada aviso y, si hace falta, corregimos el catálogo y anotamos la fuente.`
					}
				]
			},
			{
				id: 'llicencies',
				titol: 'Licencias y atribuciones',
				blocs: [
					{
						tipus: 'llista',
						items: [
							`Coordenadas, topónimos, elevaciones, límites comarcales y mapas de Cataluña: © Institut Cartogràfic i Geològic de Catalunya ([ICGC](${OPEN_ICGC})), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es).`,
							`Cataluña Norte: © IGN France (BD TOPO, RGE ALTI, Plan IGN), [Licencia Abierta 2.0](${ETALAB}).`,
							`© [Colaboradores de OpenStreetMap](${OSM_COPYRIGHT}), datos bajo licencia [ODbL 1.0](${ODBL}).`,
							`Mapa interactivo: © [OpenMapTiles](${OPENMAPTILES}) y, para el sombreado del relieve, © [Mapterhorn](${MAPTERHORN_ATRIBUCIO}).`,
							`Altitudes y coordenadas complementarias: [Wikidata](${WIKIDATA}), datos en dominio público ([CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.es)). La citamos por transparencia.`,
							`Lista de cimas esenciales: FEEC, reto 100 Cims ([lista pública](${PDF_ESSENCIALS})). Web no oficial; la validación de ascensiones la hace la FEEC a través de las entidades.`
						]
					},
					{
						tipus: 'paragraf',
						text: 'Algunas altitudes derivan de OpenStreetMap. Si algún día ofrecemos el catálogo como base de datos descargable, esa parte se ofrecerá bajo licencia ODbL o se sustituirá por otra fuente.'
					},
					{
						tipus: 'paragraf',
						text: '"100 Cims" es una marca de la FEEC. Aquí solo se usa para describir el reto. Más detalles en el [aviso legal](/avis-legal).'
					}
				]
			}
		],
		faq: [
			{
				pregunta: '¿Por qué la altitud de una cima no coincide con la de otra fuente?',
				resposta:
					'Cada fuente mide de una manera: los mapas dan una cota redondeada y los modelos de elevaciones, el punto más alto de una cuadrícula. Publicamos la cota más conocida si encaja a ±15 m con el modelo de elevaciones del ICGC o del IGN.'
			},
			{
				pregunta: '¿Los datos de Carnet de Cims son oficiales?',
				resposta:
					'No. Es una web independiente y no oficial. La lista vigente y la validación de ascensiones del reto 100 Cims son las de la FEEC.'
			},
			{
				pregunta: '¿Cómo puedo avisar de un error en una cima?',
				resposta: `Escríbenos a ${TITULAR.correu} con el nombre de la cima y, si puedes, la fuente del dato correcto.`
			}
		],
		fonts: [
			{ nom: 'FEEC: lista de cimas esenciales (PDF)', url: PDF_ESSENCIALS, consultat: CONSULTAT },
			{
				nom: 'FEEC: cimas con restricciones de acceso',
				url: FEEC_RESTRICCIONS,
				consultat: CONSULTAT
			},
			{
				nom: 'ICGC: documentación del geocodificador',
				url: ICGC_GEOCODIFICADOR,
				consultat: CONSULTAT
			},
			{ nom: 'IGN: Géoplateforme', url: IGN_GEOSERVICES, consultat: CONSULTAT },
			{
				nom: 'OpenStreetMap: derechos de autor y licencia',
				url: OSM_COPYRIGHT,
				consultat: CONSULTAT
			}
		],
		actualitzat: ACTUALITZAT
	}
};
