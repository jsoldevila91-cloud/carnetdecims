/**
 * Marcadors de dades encara desconegudes que surten als textos institucionals. No s'inventa cap
 * dada: mentre no hi hagi la real, el text porta el marcador tal qual, i un test (o QA) ha de
 * fallar abans del llançament si en queda algun. El titular i el correu ja són a `titular.ts`.
 *
 * NIF i domicili del titular (art. 10 LSSI-CE) no es publiquen: el projecte no té activitat
 * econòmica. Si mai en té, o quan arribin els comptes (fase 5: cal identificar la persona
 * responsable del tractament, art. 13 RGPD), s'hi han d'afegir.
 *
 * Format: `[PENDENT: …]` en català i `[PENDIENTE: …]` en castellà. No van mai dins d'un enllaç
 * `[text](destí)`: com que no els segueix `(`, el component els pinta com a text.
 */

/**
 * Marcadors coneguts que encara surten als continguts. Ara no n'hi ha cap: si se n'afegeix un,
 * s'ha de posar aquí (ca i es) i el test d'inventari fallarà fins que s'ompli.
 */
export const MARCADORS_PENDENTS: readonly string[] = [];

/** Qualsevol marcador pendent, també els que no són a la llista (p. ex. escrits a mà). */
export const PATRO_PENDENT = /\[(?:PENDENT|PENDIENTE):[^\]]*\]/g;

/**
 * Marcadors pendents que conté un valor qualsevol (text, objecte de contingut…), recorrent-ne
 * totes les cadenes. Serveix per als tests de llançament: `pendentsDe(CONTINGUTS)` ha de ser `[]`.
 */
export function pendentsDe(valor: unknown): string[] {
	const trobats = new Set<string>();
	const visita = (v: unknown): void => {
		if (typeof v === 'string') {
			for (const m of v.matchAll(PATRO_PENDENT)) trobats.add(m[0]);
		} else if (Array.isArray(v)) {
			v.forEach(visita);
		} else if (v !== null && typeof v === 'object') {
			Object.values(v).forEach(visita);
		}
	};
	visita(valor);
	return [...trobats];
}
