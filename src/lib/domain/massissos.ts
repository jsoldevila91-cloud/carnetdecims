/**
 * Massissos del repte "Massissos" (bloc R2). El catàleg no té cap camp `massis`: aquesta és una
 * **llista curada** de slugs del catàleg, no un càlcul. És reproduïble i verificable perquè:
 *
 * - cada slug ha d'existir al catàleg (`massissos.spec.ts` ho comprova contra `cims.json`);
 * - cada cim ha de caure dins la caixa (`bbox`, WGS84) del massís, que fa de control geogràfic
 *   (el test també ho comprova: si una coordenada del catàleg canvia molt, salta);
 * - només hi ha massissos amb ≥ `MIN_CIMS_MASSIS` cims del catàleg.
 *
 * **Fonts** (consultades per delimitar cada massís; no se'n copia cap taula): límits dels espais
 * naturals protegits de la Generalitat (PEIN / parcs naturals: Montseny, Muntanya de Montserrat,
 * Sant Llorenç del Munt i l'Obac, Els Ports, Cadí-Moixeró, Paratge natural de Poblet / Muntanyes
 * de Prades, Serra del Montsec) i el mapa topogràfic de l'ICGC. Criteri conservador: un cim de
 * frontera dubtosa no s'hi posa si l'usuari no ho decideix: el Puig de la Creu de Castellar
 * **no** és de Sant Llorenç; el Turó de Montsoriu (Montseny), Santa Bàrbara (Ports), el Pedraforca
 * i la Tosa (Cadí-Moixeró) **sí** que hi són (decisió de l'usuari, R2). Per afegir-ne un: slug + revisar la caixa + test.
 *
 * El catàleg no s'edita mai a mà: si un slug canvia a `npm run catalog:build`, el test falla i
 * s'actualitza aquesta llista.
 */
import type { Bbox } from './geo';

export const MIN_CIMS_MASSIS = 3;

export interface Massis {
	/** Identificador estable (també forma l'id del repte: `massis-<id>`). */
	id: string;
	/** Slugs del catàleg (`Cim.slug`). */
	cims: readonly string[];
	/** Caixa de control [oest, sud, est, nord] (graus WGS84). */
	bbox: Bbox;
}

export const MASSISSOS: readonly Massis[] = Object.freeze([
	{
		id: 'montseny',
		cims: ['matagalls', 'les-agudes', 'tagamanent', 'turo-de-montsoriu'],
		bbox: [2.2, 41.7, 2.56, 41.85]
	},
	{
		id: 'montserrat',
		cims: ['sant-jeroni', 'montgros', 'elefant-roca-de-sant-salvador'],
		bbox: [1.76, 41.57, 1.86, 41.63]
	},
	{
		id: 'sant-llorenc-del-munt',
		cims: ['la-mola-de-sant-llorenc-del-munt', 'castellsapera', 'montcau'],
		bbox: [1.94, 41.62, 2.05, 41.7]
	},
	{
		id: 'ports',
		cims: [
			'caro',
			'tossal-dels-tres-reis',
			'roques-de-benet',
			'tossal-d-engrillo',
			'santa-barbara'
		],
		bbox: [0.1, 40.7, 0.42, 40.97]
	},
	{
		id: 'cadi-moixero',
		cims: ['comabona', 'vulturo', 'penyes-altes', 'pedraforca-pollego-superior', 'la-tosa'],
		bbox: [1.55, 42.22, 1.9, 42.33]
	},
	{
		id: 'prades',
		cims: ['tossal-de-la-baltasana', 'punta-del-curull', 'mola-d-estat'],
		bbox: [0.93, 41.3, 1.09, 41.38]
	},
	{
		id: 'montsec',
		cims: ['penya-sant-alis', 'tossal-de-mirapallars', 'sant-mamet'],
		bbox: [0.7, 41.95, 1.0, 42.06]
	}
] satisfies Massis[]);
