/**
 * Rellotge injectable de la capa de dades: tots els instants (`createdAt`, `updatedAt`,
 * `deletedAt`) i l'"avui" de les validacions surten d'aquí, perquè els tests puguin fixar
 * la data sense temporitzadors falsos (que interfereixen amb IndexedDB).
 */
const RELLOTGE_REAL = (): Date => new Date();

let rellotge: () => Date = RELLOTGE_REAL;

/** Instant actual segons el rellotge configurat. */
export function ara(): Date {
	return rellotge();
}

/** Canvia el rellotge (tests). Sense argument, torna al rellotge real. */
export function establirRellotge(fn?: () => Date): void {
	rellotge = fn ?? RELLOTGE_REAL;
}

/**
 * Instant ISO per a una escriptura, estrictament posterior a `anterior` (si n'hi ha): així
 * dues edicions seguides en el mateix mil·lisegon no empaten en la regla LWW de la sync.
 */
export function instantEscriptura(anterior?: string | null): string {
	let t = ara().getTime();
	if (anterior) {
		const prev = Date.parse(anterior);
		if (!Number.isNaN(prev) && t <= prev) t = prev + 1;
	}
	return new Date(t).toISOString();
}
