/**
 * Catàleg estàtic de cims (fase 2: les 150 essencials). Generat per `npm run catalog:build`
 * (`scripts/catalog/`); no editeu els JSON a mà. Vegeu `docs/03-modelo-datos.md` §4.
 */
import type { CimCataleg, ComarcaCataleg } from '$lib/domain';
import cimsJson from './cims.json';
import comarquesJson from './comarques.json';

/** Versió del catàleg (`cims.cataleg_versio` a Postgres). */
export const CATALEG_VERSIO = '2026-09-essencials';

// El JSON es valida a `catalog.spec.ts` (enums, rangs, fonts); aquí només es tipa.
export const CIMS = cimsJson as unknown as readonly CimCataleg[];
export const COMARQUES = comarquesJson as unknown as readonly ComarcaCataleg[];
