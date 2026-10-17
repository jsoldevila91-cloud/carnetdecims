/**
 * Estabilitat dels ids del catàleg (bloc R3).
 *
 * `Cim.id` és la clau de les ascensions desades (Dexie i Supabase) i dels enllaços compartits
 * (`/ca/carnet#c=…`). `scripts/catalog/build.ts` l'assigna per la posició a `ESSENCIALS`
 * (`i + 1`): si algú reordena o treu un cim d'aquella llista, els ids canvien en silenci i les
 * dades de tothom apunten a un altre cim. Aquest test fixa cada id al seu `nom_oficial` (el nom
 * del PDF de la FEEC, que no es canvia mai: vegeu `scripts/catalog/essencials.ts`).
 *
 * Regla: la llista només creix pel final. En ampliar el catàleg, afegiu els ids nous a
 * `ids-estables.json`; no en modifiqueu ni n'esborreu cap.
 */
import { describe, expect, it } from 'vitest';
import { CIMS } from './cataleg';
import fixats from './ids-estables.json';

const ids = fixats.ids as Record<string, string>;

describe('ids estables del catàleg', () => {
	it('cada id fixat continua sent el mateix cim', () => {
		const perId = new Map(CIMS.map((c) => [c.id, c.nom_oficial]));
		for (const [id, nom] of Object.entries(ids)) {
			expect(perId.get(Number(id)), `id ${id}`).toBe(nom);
		}
	});

	it('els ids nous només poden anar després del darrer fixat', () => {
		const maxFixat = Math.max(...Object.keys(ids).map(Number));
		for (const c of CIMS) {
			if (c.id <= maxFixat) expect(ids[String(c.id)], `id ${c.id} no fixat`).toBeDefined();
		}
	});
});
