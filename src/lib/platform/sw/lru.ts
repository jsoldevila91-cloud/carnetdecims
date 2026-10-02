/**
 * Índex LRU (menys usat recentment) per a una cache del service worker.
 *
 * La Cache API no guarda quan es va fer servir cada entrada ni quant ocupa: aquest índex ho
 * porta en memòria (un `Map`, que conserva l'ordre d'inserció: la primera clau és la més
 * antiga) i el SW el desa serialitzat a la cache `meta`. Pur i sense APIs del navegador.
 */

export type LimitsLru = { maxEntrades: number; maxBytes: number };

/** Mida estimada d'una entrada de la qual no es coneix la mida (índex perdut o antic). */
export const MIDA_DESCONEGUDA = 32 * 1024;

export type IndexLruSerialitzat = { v: 1; entrades: Array<[string, number]> };

export class IndexLru {
	readonly limits: LimitsLru;
	#entrades = new Map<string, number>();
	#bytes = 0;

	constructor(limits: LimitsLru) {
		if (limits.maxEntrades < 1 || limits.maxBytes < 1) throw new RangeError('Límits LRU invàlids');
		this.limits = limits;
	}

	get mida(): number {
		return this.#entrades.size;
	}

	get bytes(): number {
		return this.#bytes;
	}

	te(clau: string): boolean {
		return this.#entrades.has(clau);
	}

	/** Claus de la més antiga a la més recent. */
	claus(): string[] {
		return [...this.#entrades.keys()];
	}

	/** Marca l'entrada com a usada ara. Retorna `false` si no hi era. */
	tocar(clau: string): boolean {
		const bytes = this.#entrades.get(clau);
		if (bytes === undefined) return false;
		this.#entrades.delete(clau);
		this.#entrades.set(clau, bytes);
		return true;
	}

	/**
	 * Afegeix (o actualitza) una entrada com la més recent i retorna les claus que s'han de
	 * treure de la cache per tornar dins dels límits (mai la que s'acaba d'afegir, tret que
	 * sola ja superi `maxBytes`: llavors és ella la que no s'ha de desar).
	 */
	afegir(clau: string, bytes: number): string[] {
		const mida = Number.isFinite(bytes) && bytes >= 0 ? Math.round(bytes) : MIDA_DESCONEGUDA;
		if (mida > this.limits.maxBytes) {
			this.eliminar(clau);
			return [clau];
		}
		this.eliminar(clau);
		this.#entrades.set(clau, mida);
		this.#bytes += mida;
		return this.#retalla(clau);
	}

	eliminar(clau: string): boolean {
		const bytes = this.#entrades.get(clau);
		if (bytes === undefined) return false;
		this.#entrades.delete(clau);
		this.#bytes -= bytes;
		return true;
	}

	/**
	 * Alinea l'índex amb les claus que hi ha de debò a la cache: treu les que ja no hi són i
	 * afegeix com a més antigues (mida estimada) les que hi són i l'índex no coneixia.
	 * Retorna les claus a esborrar de la cache si amb això se superen els límits.
	 */
	reconciliar(clausCache: readonly string[]): string[] {
		const reals = new Set(clausCache);
		for (const clau of this.claus()) if (!reals.has(clau)) this.eliminar(clau);
		const noves = clausCache.filter((c) => !this.#entrades.has(c));
		if (noves.length > 0) {
			const anteriors = [...this.#entrades];
			this.#entrades = new Map(noves.map((c) => [c, MIDA_DESCONEGUDA]));
			for (const [c, b] of anteriors) this.#entrades.set(c, b);
			this.#bytes += noves.length * MIDA_DESCONEGUDA;
		}
		return this.#retalla(null);
	}

	serialitzar(): IndexLruSerialitzat {
		return { v: 1, entrades: [...this.#entrades] };
	}

	/** Reconstrueix un índex desat; si les dades no són vàlides, en retorna un de buit. */
	static deserialitzar(dades: unknown, limits: LimitsLru): IndexLru {
		const index = new IndexLru(limits);
		const d = dades as Partial<IndexLruSerialitzat> | null;
		if (!d || d.v !== 1 || !Array.isArray(d.entrades)) return index;
		for (const e of d.entrades) {
			if (Array.isArray(e) && typeof e[0] === 'string' && typeof e[1] === 'number') {
				index.#entrades.delete(e[0]);
				index.#entrades.set(e[0], Math.max(0, e[1]));
			}
		}
		index.#bytes = [...index.#entrades.values()].reduce((a, b) => a + b, 0);
		return index;
	}

	#retalla(protegida: string | null): string[] {
		const fora: string[] = [];
		for (const [clau, bytes] of this.#entrades) {
			if (this.#entrades.size <= this.limits.maxEntrades && this.#bytes <= this.limits.maxBytes) {
				break;
			}
			if (clau === protegida) continue;
			this.#entrades.delete(clau);
			this.#bytes -= bytes;
			fora.push(clau);
		}
		return fora;
	}
}
