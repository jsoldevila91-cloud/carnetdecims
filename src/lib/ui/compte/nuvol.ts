/**
 * Lògica pura de la UI del compte i del núvol (sense Svelte ni Supabase): estat que es mostra,
 * temps relatiu, validació del correu, confirmació d'esborrat i la marca "enllaç enviat" que
 * permet reconèixer el primer accés en tornar de l'enllaç del correu.
 */

/** Forma mínima de `sessio` (`$lib/data/compte`) que necessita la UI. */
export interface SessioUi {
	estat: 'carregant' | 'anonim' | 'autenticat';
	usuari?: { id: string; email?: string | null } | null;
}

/** Forma mínima d'`estatSync` (`$lib/data/sync`) que necessita la UI. */
export interface SyncUi {
	pendents: number;
	ultimaSync?: Date | string | number | null;
	error?: unknown;
	/** Hi ha una sync en curs. */
	sincronitzant?: boolean;
	/** El dispositiu té dades d'un altre compte: cal que l'usuari triï abans de sincronitzar. */
	conflicte?: string | null;
}

export type EstatNuvol =
	| { tipus: 'carregant' }
	| { tipus: 'local' }
	| { tipus: 'error' }
	| { tipus: 'conflicte' }
	| { tipus: 'pendents'; pendents: number; offline: boolean }
	| { tipus: 'mai' }
	| { tipus: 'ok'; ultimaSync: Date };

/** Converteix `ultimaSync` (Date, ISO o mil·lisegons) en una data vàlida, o `null`. */
export function dataSync(valor: SyncUi['ultimaSync']): Date | null {
	if (valor === null || valor === undefined || valor === '') return null;
	const d = valor instanceof Date ? valor : new Date(valor);
	return Number.isNaN(d.getTime()) ? null : d;
}

/** Què s'ha de mostrar segons la sessió i la sincronització. L'error mana sobre els pendents. */
export function estatNuvol(sessio: SessioUi, sync: SyncUi, online = true): EstatNuvol {
	if (sessio.estat === 'carregant') return { tipus: 'carregant' };
	if (sessio.estat === 'anonim') return { tipus: 'local' };
	if (sync.conflicte) return { tipus: 'conflicte' };
	if (sync.error && online) return { tipus: 'error' };
	if (sync.pendents > 0) return { tipus: 'pendents', pendents: sync.pendents, offline: !online };
	const ultima = dataSync(sync.ultimaSync);
	return ultima ? { tipus: 'ok', ultimaSync: ultima } : { tipus: 'mai' };
}

/**
 * "fa 2 min", "fa 3 h", "ahir"… amb `Intl.RelativeTimeFormat` en format curt. Per sota d'un
 * minut retorna `null` (la UI hi posa "ara mateix").
 */
export function tempsRelatiu(desde: Date, ara: Date, locale: string): string | null {
	const s = Math.round((ara.getTime() - desde.getTime()) / 1000);
	if (s < 60) return null;
	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'short' });
	const min = Math.floor(s / 60);
	if (min < 60) return rtf.format(-min, 'minute');
	const h = Math.floor(min / 60);
	if (h < 24) return rtf.format(-h, 'hour');
	return rtf.format(-Math.floor(h / 24), 'day');
}

/** Validació mínima (la de debò la fa el servidor): text@domini.tld sense espais. */
export function emailValid(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/** Confirmació forta de l'esborrat: el correu del compte o la paraula clau (sense majúscules). */
export function confirmacioValida(
	text: string,
	email: string | null | undefined,
	paraula: string
): boolean {
	const t = text.trim().toLocaleLowerCase();
	if (!t) return false;
	if (t === paraula.trim().toLocaleLowerCase()) return true;
	return !!email && t === email.trim().toLocaleLowerCase();
}

// ── Marca "enllaç enviat" (localStorage) ──

export const CLAU_ENLLAC = 'carnetdecims:enllac-enviat';
/** Temps que es considera vàlid l'enllaç enviat (per mostrar l'estat "t'hem enviat un correu"). */
export const VIGENCIA_ENLLAC_MS = 60 * 60 * 1000;
/** Temps màxim per reconèixer el primer accés (l'usuari pot obrir el correu més tard). */
export const VIGENCIA_PRIMER_ACCES_MS = 7 * 24 * 60 * 60 * 1000;
export const ESPERA_REENVIAR_S = 60;

export interface EnllacEnviat {
	email: string;
	/** Instant de l'enviament (ms): compte enrere per reenviar. */
	t: number;
}

type Magatzem = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function magatzem(): Magatzem | null {
	try {
		return typeof localStorage === 'undefined' ? null : localStorage;
	} catch {
		return null;
	}
}

export function desaEnllacEnviat(email: string, t: number, m: Magatzem | null = magatzem()): void {
	try {
		m?.setItem(CLAU_ENLLAC, JSON.stringify({ email, t } satisfies EnllacEnviat));
	} catch {
		/* sense emmagatzematge: l'estat "enviat" no sobreviu a una recàrrega */
	}
}

export function llegeixEnllacEnviat(m: Magatzem | null = magatzem()): EnllacEnviat | null {
	try {
		const raw = m?.getItem(CLAU_ENLLAC);
		if (!raw) return null;
		const v = JSON.parse(raw) as Partial<EnllacEnviat>;
		return typeof v.email === 'string' && typeof v.t === 'number'
			? { email: v.email, t: v.t }
			: null;
	} catch {
		return null;
	}
}

export function oblidaEnllacEnviat(m: Magatzem | null = magatzem()): void {
	try {
		m?.removeItem(CLAU_ENLLAC);
	} catch {
		/* res */
	}
}

/** Segons que falten per poder tornar a enviar l'enllaç (0 = ja es pot). */
export function segonsPerReenviar(enviatA: number, ara: number): number {
	return Math.max(0, Math.ceil(ESPERA_REENVIAR_S - (ara - enviatA) / 1000));
}

export type PrimerAcces = 'desant' | 'fet' | 'error' | 'conflicte';

/**
 * Estat del primer accés (s'acaba d'entrar amb l'enllaç o el codi a l'instant `desde`): `fet`
 * quan hi ha hagut una sincronització completa posterior i no queda res pendent. El conflicte
 * (dades d'un altre compte al dispositiu) té la seva pròpia UI.
 */
export function estatPrimerAcces(desde: number, sync: SyncUi): PrimerAcces {
	if (sync.conflicte) return 'conflicte';
	if (sync.error) return 'error';
	const ultima = dataSync(sync.ultimaSync);
	if (ultima && ultima.getTime() >= desde && sync.pendents === 0 && !sync.sincronitzant) {
		return 'fet';
	}
	return 'desant';
}

export type MissatgePrimerAcces =
	{ tipus: 'desades'; n: number } | { tipus: 'recuperades'; n: number } | { tipus: 'buit' };

/**
 * Què es diu en acabar el primer accés: les ascensions que hi havia al dispositiu s'han desat al
 * núvol; si no n'hi havia cap però n'han baixat del núvol (canvi de mòbil), s'han recuperat.
 */
export function missatgePrimerAcces(abans: number, despres: number): MissatgePrimerAcces {
	if (abans > 0) return { tipus: 'desades', n: abans };
	if (despres > 0) return { tipus: 'recuperades', n: despres };
	return { tipus: 'buit' };
}
