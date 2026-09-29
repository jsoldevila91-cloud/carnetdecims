/**
 * `/sobre-el-projecte`: què és Carnet de Cims, independència, què ofereix, full de ruta i
 * contacte. La persona responsable i el contacte són marcadors pendents (`pendents.ts`).
 * Full de ruta resumit de docs/04-plan-fases.md (fases 3–7).
 */
import { PENDENTS_CA, PENDENTS_ES } from './pendents.ts';
import { TITULAR } from './titular.ts';
import type { Contingut } from './types.ts';

const FEEC_100_CIMS = 'https://www.feec.cat/activitats/100-cims/';

export const sobreElProjecte: Contingut = {
	ca: {
		title: 'Sobre el projecte: què és i què preparem',
		description:
			'Carnet de Cims és una eina independent i gratuïta per seguir el repte 100 Cims: llista i mapa de cims i el teu progrés. Què és i què preparem.',
		h1: 'Sobre Carnet de Cims',
		intro:
			'Carnet de Cims és una eina per seguir el teu repte 100 Cims: consultar els cims, preparar sortides i, aviat, anotar les teves ascensions i veure com avança el carnet.',
		seccions: [
			{
				id: 'que-es',
				titol: 'Què és',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'És una web gratuïta, en català i en castellà, pensada per fer-la servir des del mòbil, també a la muntanya. No té publicitat ni subscripcions, i no cal crear cap compte per utilitzar-la.'
					},
					{
						tipus: 'avis',
						to: 'info',
						text: `Carnet de Cims és una web independent, no oficial i no vinculada a la FEEC. El repte 100 Cims és de la [FEEC](${FEEC_100_CIMS}), que en valida les ascensions a través de les entitats. Anotar un cim aquí no el valida: t'expliquem [com es valida](/repte-100-cims/com-validar).`
					}
				]
			},
			{
				id: 'que-hi-trobaras',
				titol: 'Què hi trobaràs',
				blocs: [
					{
						tipus: 'llista',
						items: [
							"Una fitxa de cada cim essencial amb l'altitud, la comarca, el mapa, les restriccions d'accés conegudes i els cims propers: [tots els cims](/cims).",
							'Els cims agrupats per [comarques](/comarques).',
							'Llistats curats: [cims essencials](/cims-essencials), [tresmils](/tresmils) i [cims més alts](/cims-mes-alts).',
							'El repte explicat en llenguatge clar: [normativa](/repte-100-cims/normativa), [com validar les ascensions](/repte-100-cims/com-validar) i [repte infantil](/repte-100-cims/repte-infantil).',
							"D'on surten les dades i com les revisem: [metodologia](/metodologia)."
						]
					}
				]
			},
			{
				id: 'full-de-ruta',
				titol: 'Full de ruta',
				blocs: [
					{
						tipus: 'llista',
						ordenada: true,
						items: [
							'**Web pública (ara):** fitxes de cims, comarques, llistats i la normativa explicada.',
							"**L'aplicació:** registrar ascensions al teu dispositiu, sense compte i sense connexió; el carnet amb el progrés (100, 2×100…); un mapa interactiu amb els cims a prop, i instal·lar-la com una app.",
							'**Comptes opcionals:** per sincronitzar el carnet entre dispositius i tenir-ne còpia, amb les dades allotjades a la Unió Europea, i amb opcions per exportar-les i esborrar-les.',
							'**Continguts:** descripcions, accessos i dificultat (MIDE) revisats per persones, i la previsió meteorològica a cada cim.',
							'**Més cims:** la resta de cims del repte, per lots.'
						]
					},
					{
						tipus: 'paragraf',
						text: "L'ordre és el previst; les dates, orientatives."
					}
				]
			},
			{
				id: 'com-treballem',
				titol: 'Com treballem',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'**Les teves dades, al teu dispositiu.** El carnet funcionarà sense compte; el compte serà opcional. Ho expliquem a la [política de privadesa](/privacitat).',
							"**Fonts obertes i citades.** Cada dada del catàleg té la seva font, i preval la de l'ICGC. Detalls a la [metodologia](/metodologia).",
							'**Respecte al repte i a la FEEC.** "100 Cims" només s\'usa per descriure el repte, sense logotips de la FEEC.',
							"**Revisió humana.** Cap fitxa es dona per revisada sense que una persona n'hagi comprovat les dades."
						]
					}
				]
			},
			{
				id: 'qui-som',
				titol: 'Qui hi ha darrere',
				blocs: [
					{
						tipus: 'paragraf',
						text: `Carnet de Cims és un projecte independent, sense activitat econòmica. ${PENDENTS_CA.presentacio}`
					}
				]
			},
			{
				id: 'contacte',
				titol: 'Contacte',
				blocs: [
					{
						tipus: 'paragraf',
						text: `Per a suggeriments, errors a les dades o qualsevol consulta, escriu a ${TITULAR.correu}. Si formes part de la FEEC o d'una entitat excursionista i vols comentar-nos alguna cosa, també ens hi pots escriure.`
					}
				]
			}
		],
		actualitzat: '2026-09-29'
	},
	es: {
		title: 'Sobre el proyecto: qué es y qué preparamos',
		description:
			'Carnet de Cims es una herramienta independiente y gratuita para seguir el reto 100 Cims: lista y mapa de cimas y tu progreso. Qué es y qué preparamos.',
		h1: 'Sobre Carnet de Cims',
		intro:
			'Carnet de Cims es una herramienta para seguir tu reto 100 Cims: consultar las cimas, preparar salidas y, pronto, anotar tus ascensiones y ver cómo avanza el carnet.',
		seccions: [
			{
				id: 'que-es',
				titol: 'Qué es',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Es una web gratuita, en catalán y en castellano, pensada para usarla desde el móvil, también en la montaña. No tiene publicidad ni suscripciones, y no hace falta crear ninguna cuenta para usarla.'
					},
					{
						tipus: 'avis',
						to: 'info',
						text: `Carnet de Cims es una web independiente, no oficial y no vinculada a la FEEC. El reto 100 Cims es de la [FEEC](${FEEC_100_CIMS}), que valida sus ascensiones a través de las entidades. Anotar una cima aquí no la valida: te explicamos [cómo se valida](/repte-100-cims/com-validar).`
					}
				]
			},
			{
				id: 'que-hi-trobaras',
				titol: 'Qué encontrarás',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'Una ficha de cada cima esencial con la altitud, la comarca, el mapa, las restricciones de acceso conocidas y las cimas cercanas: [todas las cimas](/cims).',
							'Las cimas agrupadas por [comarcas](/comarques).',
							'Listados seleccionados: [cimas esenciales](/cims-essencials), [tresmiles](/tresmils) y [cimas más altas](/cims-mes-alts).',
							'El reto explicado en lenguaje claro: [normativa](/repte-100-cims/normativa), [cómo validar las ascensiones](/repte-100-cims/com-validar) y [reto infantil](/repte-100-cims/repte-infantil).',
							'De dónde salen los datos y cómo los revisamos: [metodología](/metodologia).'
						]
					}
				]
			},
			{
				id: 'full-de-ruta',
				titol: 'Hoja de ruta',
				blocs: [
					{
						tipus: 'llista',
						ordenada: true,
						items: [
							'**Web pública (ahora):** fichas de cimas, comarcas, listados y la normativa explicada.',
							'**La aplicación:** registrar ascensiones en tu dispositivo, sin cuenta y sin conexión; el carnet con el progreso (100, 2×100…); un mapa interactivo con las cimas cercanas, e instalarla como una app.',
							'**Cuentas opcionales:** para sincronizar el carnet entre dispositivos y tener copia, con los datos alojados en la Unión Europea, y con opciones para exportarlos y borrarlos.',
							'**Contenidos:** descripciones, accesos y dificultad (MIDE) revisados por personas, y la previsión meteorológica en cada cima.',
							'**Más cimas:** el resto de cimas del reto, por lotes.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'El orden es el previsto; las fechas, orientativas.'
					}
				]
			},
			{
				id: 'com-treballem',
				titol: 'Cómo trabajamos',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'**Tus datos, en tu dispositivo.** El carnet funcionará sin cuenta; la cuenta será opcional. Lo explicamos en la [política de privacidad](/privacitat).',
							'**Fuentes abiertas y citadas.** Cada dato del catálogo tiene su fuente, y prevalece la del ICGC. Detalles en la [metodología](/metodologia).',
							'**Respeto al reto y a la FEEC.** "100 Cims" solo se usa para describir el reto, sin logotipos de la FEEC.',
							'**Revisión humana.** Ninguna ficha se da por revisada sin que una persona haya comprobado sus datos.'
						]
					}
				]
			},
			{
				id: 'qui-som',
				titol: 'Quién hay detrás',
				blocs: [
					{
						tipus: 'paragraf',
						text: `Carnet de Cims es un proyecto independiente, sin actividad económica. ${PENDENTS_ES.presentacio}`
					}
				]
			},
			{
				id: 'contacte',
				titol: 'Contacto',
				blocs: [
					{
						tipus: 'paragraf',
						text: `Para sugerencias, errores en los datos o cualquier consulta, escribe a ${TITULAR.correu}. Si formas parte de la FEEC o de una entidad excursionista y quieres comentarnos algo, también puedes escribirnos.`
					}
				]
			}
		],
		actualitzat: '2026-09-29'
	}
};
