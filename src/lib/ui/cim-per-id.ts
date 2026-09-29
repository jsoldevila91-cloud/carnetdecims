import { CIMS } from '$lib/data/catalog';
import type { CimCataleg } from '$lib/domain';

let perId: ReadonlyMap<number, CimCataleg> | null = null;

/** Cim del catàleg per id (índex creat la primera vegada). */
export function cimPerId(id: number): CimCataleg | undefined {
	perId ??= new Map(CIMS.map((c) => [c.id, c]));
	return perId.get(id);
}
