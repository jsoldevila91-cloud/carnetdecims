/**
 * Ascensions duplicades (entre dispositius i en importar). Funcions pures. Vegeu
 * `docs/03-modelo-datos.md` §2 ("Duplicados").
 *
 * **Clau de duplicat.** Dues ascensions **vives** amb el mateix cim, la mateixa data i el mateix
 * mètode són la mateixa ascensió (p. ex. registrada al mòbil i a l'ordinador, o importada d'un
 * fitxer d'un altre compte). No hi entren:
 * - la nota ni els companys: són el contingut que es fusiona, no la identitat;
 * - `createdAt`: cada dispositiu el posa en registrar-la; tampoc no cal que coincideixi (el cas de
 *   `createdAt` idèntic és un duplicat més, i el desempat és per id);
 * - les làpides: un esborrat és una decisió de l'usuari i no es "fusiona" amb res.
 * El mètode sí: el mateix cim el mateix dia amb mètodes diferents (p. ex. a peu i amb esquís) pot
 * ser una altra activitat, i davant del dubte no es fusiona. Pel repte, el mateix cim el mateix
 * dia només compta una vegada, així que fusionar no fa perdre progrés.
 *
 * **Guanyadora determinista** (`ordreGuanyadora`): `createdAt` més antic; empat, l'id menor. No
 * depèn del rellotge ni del dispositiu: dos dispositius amb les mateixes files fan el mateix pla.
 *
 * **Fusió del contingut** (`fusionarContingut`), també determinista:
 * - nota: les notes no buides diferents, en l'ordre de la guanyadora (una nota continguda dins
 *   d'una altra no es repeteix), unides amb una línia en blanc. Així no es perd mai text que
 *   l'usuari ha escrit. Si la unió passa del límit (`notaMax`), es queda la nota no buida de
 *   l'`updatedAt` més recent. Repetir la fusió amb el resultat no canvia res (idempotent);
 * - companys: la unió (sense repetits per `clauCompany`, primer la grafia de la guanyadora), fins
 *   a `COMPANYS_MAX`. Si cap fila no porta la clau `companys`, el resultat tampoc (vegeu
 *   `FilaAscensio`).
 *
 * **Instant del pla** (`instantFusio`): l'`updatedAt` més gran del grup + 1 ms. Guanya la regla
 * LWW de la sync sobre totes les versions del grup, però no sobre un canvi real posterior, i dos
 * dispositius que apliquen el mateix pla produeixen exactament les mateixes files (convergeixen
 * sense coordinació, com la purga de làpides).
 */
import { COMPANYS_MAX, clauCompany } from './diari';
import type { InstantISO, Metode } from './types';

/** El que cal d'una ascensió per detectar i fusionar duplicats (`FilaAscensio` ho compleix). */
export interface AscensioDuplicable {
	id: string;
	cimId: number;
	data: string;
	metode: Metode;
	nota: string | null;
	/** Absent = la fila no en sap res (vegeu `FilaAscensio`). */
	companys?: readonly string[];
	createdAt: InstantISO;
	updatedAt: InstantISO;
	deletedAt?: InstantISO | null;
}

/** Límit de la nota per defecte (el mateix que `NOTA_MAX` de la capa de dades). */
export const NOTA_MAX_FUSIO = 500;

/** Separador entre notes fusionades (una línia en blanc). */
export const SEPARADOR_NOTES = '\n\n';

/** Clau de duplicat: cim, data i mètode. */
export function clauDuplicat(a: Pick<AscensioDuplicable, 'cimId' | 'data' | 'metode'>): string {
	return `${a.cimId}|${a.data}|${a.metode}`;
}

/** Són la mateixa ascensió? (dues files diferents, vives i amb la mateixa clau) */
export function sonDuplicats(a: AscensioDuplicable, b: AscensioDuplicable): boolean {
	return a.id !== b.id && !a.deletedAt && !b.deletedAt && clauDuplicat(a) === clauDuplicat(b);
}

/** Ordre de preferència: `createdAt` més antic primer; empat, l'id menor. */
export function ordreGuanyadora(
	a: Pick<AscensioDuplicable, 'id' | 'createdAt'>,
	b: Pick<AscensioDuplicable, 'id' | 'createdAt'>
): number {
	if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? -1 : 1;
	return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

/** `updatedAt` més gran del grup + 1 ms (vegeu la capçalera). */
export function instantFusio(grup: readonly Pick<AscensioDuplicable, 'updatedAt'>[]): InstantISO {
	let max = '';
	for (const f of grup) if (f.updatedAt > max) max = f.updatedAt;
	const t = Date.parse(max);
	return Number.isNaN(t) ? max : new Date(t + 1).toISOString();
}

export interface ContingutFusionat {
	nota: string | null;
	/** `undefined` = cap fila del grup no portava la clau `companys`. */
	companys: string[] | undefined;
}

export interface OpcionsFusio {
	/** Llargada màxima de la nota fusionada (caràcters Unicode). Per defecte `NOTA_MAX_FUSIO`. */
	notaMax?: number;
}

/**
 * Contingut fusionat d'un grup de duplicats **ja ordenat** (la guanyadora primer). Vegeu la
 * capçalera per a la regla.
 */
export function fusionarContingut(
	grup: readonly AscensioDuplicable[],
	opcions: OpcionsFusio = {}
): ContingutFusionat {
	const notaMax = opcions.notaMax ?? NOTA_MAX_FUSIO;
	// Notes no buides, sense repetides, en l'ordre del grup.
	const uniques: string[] = [];
	for (const f of grup) {
		const n = f.nota ?? '';
		if (n.trim() !== '' && !uniques.includes(n)) uniques.push(n);
	}
	// Una nota continguda dins d'una altra (p. ex. una fusió anterior) no es repeteix.
	const notes = uniques.filter((n) => !uniques.some((m) => m !== n && m.includes(n)));
	let nota: string | null = null;
	if (notes.length === 1) nota = notes[0];
	else if (notes.length > 1) {
		const unida = notes.join(SEPARADOR_NOTES);
		if (Array.from(unida).length <= notaMax) nota = unida;
		else {
			// No hi cap: la nota no buida de l'edició més recent (empat: l'ordre del grup).
			let recent: AscensioDuplicable | null = null;
			for (const f of grup) {
				if (!f.nota?.trim()) continue;
				if (!recent || f.updatedAt > recent.updatedAt) recent = f;
			}
			nota = recent?.nota ?? null;
		}
	}

	let companys: string[] | undefined;
	if (grup.some((f) => f.companys !== undefined)) {
		companys = [];
		const claus = new Set<string>();
		for (const f of grup) {
			for (const nom of f.companys ?? []) {
				const clau = clauCompany(nom);
				if (claus.has(clau)) continue;
				claus.add(clau);
				companys.push(nom);
			}
		}
		companys = companys.slice(0, COMPANYS_MAX);
	}
	return { nota, companys };
}

/** El contingut fusionat és diferent del de la fila? (nota, presència de la clau i companys) */
export function contingutCanvia(
	fila: Pick<AscensioDuplicable, 'nota' | 'companys'>,
	contingut: ContingutFusionat
): boolean {
	if ((fila.nota ?? null) !== contingut.nota) return true;
	if ((fila.companys === undefined) !== (contingut.companys === undefined)) return true;
	const a = fila.companys ?? [];
	const b = contingut.companys ?? [];
	return a.length !== b.length || a.some((nom, i) => nom !== b[i]);
}

/** Pla per a un grup de duplicats: què es queda, què passa a làpida i amb quin contingut. */
export interface PlaDuplicat<T extends AscensioDuplicable> {
	/** Fila que es queda (tal com és ara: el contingut nou és a `contingut`). */
	guanyadora: T;
	/** Files que passen a làpida (en l'ordre de preferència). */
	perdedores: T[];
	/** Contingut fusionat per a la guanyadora. */
	contingut: ContingutFusionat;
	/** Cal reescriure la guanyadora (el contingut fusionat és diferent del que té)? */
	canviaGuanyadora: boolean;
	/** `updatedAt` per a les escriptures del pla (`instantFusio` del grup). */
	instant: InstantISO;
}

export interface OpcionsPla extends OpcionsFusio {
	/**
	 * Files que passen al davant de l'ordre determinista (p. ex. les locals en importar un fitxer,
	 * per no crear files amb ids d'un altre compte). Entre elles, i entre les altres, mana
	 * `ordreGuanyadora`. **No** s'ha de fer servir a la sync: trencaria la convergència.
	 */
	preferida?: (fila: AscensioDuplicable) => boolean;
}

/**
 * Detecta els grups de duplicats entre les files vives (les làpides s'ignoren) i en fa el pla.
 * Només retorna grups de dues files o més, ordenats per l'id de la guanyadora (determinista).
 */
export function planificarDuplicats<T extends AscensioDuplicable>(
	files: readonly T[],
	opcions: OpcionsPla = {}
): PlaDuplicat<T>[] {
	const perClau = new Map<string, T[]>();
	for (const f of files) {
		if (f.deletedAt) continue;
		const clau = clauDuplicat(f);
		const grup = perClau.get(clau);
		if (grup) {
			if (!grup.some((g) => g.id === f.id)) grup.push(f);
		} else perClau.set(clau, [f]);
	}
	const preferida = opcions.preferida;
	const ordre = (a: T, b: T): number => {
		if (preferida) {
			const pa = preferida(a);
			if (pa !== preferida(b)) return pa ? -1 : 1;
		}
		return ordreGuanyadora(a, b);
	};
	const plans: PlaDuplicat<T>[] = [];
	for (const grup of perClau.values()) {
		if (grup.length < 2) continue;
		const ordenat = [...grup].sort(ordre);
		const [guanyadora, ...perdedores] = ordenat;
		const contingut = fusionarContingut(ordenat, opcions);
		plans.push({
			guanyadora,
			perdedores,
			contingut,
			canviaGuanyadora: contingutCanvia(guanyadora, contingut),
			instant: instantFusio(ordenat)
		});
	}
	return plans.sort((a, b) =>
		a.guanyadora.id < b.guanyadora.id ? -1 : a.guanyadora.id > b.guanyadora.id ? 1 : 0
	);
}
