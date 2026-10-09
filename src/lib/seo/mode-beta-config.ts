/**
 * Mode beta (beta privada): tot el lloc es publica amb `noindex, nofollow` fins al llançament
 * (docs/02-arquitectura-seo.md §7.1).
 *
 * Sense dependències de `$lib` ni del runtime: ho importa `vite.config.ts` (via
 * `plugin-mode-beta.ts`) per decidir el valor al build. El valor que manen les pàgines, el hook
 * de servidor i els sitemaps és el **del build** (`mode-beta.ts`): les pàgines són prerenderitzades
 * i Cloudflare les serveix com a fitxers estàtics, sense passar pel Worker.
 *
 * Ordre de prioritat de `PUBLIC_MODE_BETA`:
 * 1. variable d'entorn del build (`process.env`, `.env`, "Build variables" de Cloudflare);
 * 2. `vars.PUBLIC_MODE_BETA` de `wrangler.jsonc` (font de veritat versionada);
 * 3. per defecte, **beta** (`true`): si falta la variable, el lloc no s'indexa.
 */

export const NOM_VARIABLE_MODE_BETA = 'PUBLIC_MODE_BETA';

/** Valor de `X-Robots-Tag` i del meta robots de totes les respostes en mode beta. */
export const ROBOTS_BETA = 'noindex, nofollow';

/** Només `false`, `0`, `no` i `off` desactiven el mode beta; qualsevol altre valor (o cap) l'activa. */
export function esModeBeta(valor: string | undefined | null): boolean {
	const v = valor?.trim().toLowerCase();
	return !(v === 'false' || v === '0' || v === 'no' || v === 'off');
}

/** Llegeix `vars.PUBLIC_MODE_BETA` del text de `wrangler.jsonc` (string o booleà), si hi és. */
export function valorModeBetaWrangler(jsonc: string): string | undefined {
	const m = new RegExp(`"${NOM_VARIABLE_MODE_BETA}"\\s*:\\s*(?:"([^"]*)"|(true|false))`).exec(
		jsonc
	);
	return m ? (m[1] ?? m[2]) : undefined;
}

/** Decideix el mode beta: entorn del build > `wrangler.jsonc` > `true`. */
export function resoldreModeBeta(
	valorEntorn: string | undefined,
	valorWrangler: string | undefined
): boolean {
	const valor = valorEntorn?.trim() ? valorEntorn : valorWrangler;
	return esModeBeta(valor);
}

const INICI_BLOC = '# === INICI MODE BETA (generat per plugin-mode-beta; no editar) ===';
const FI_BLOC = '# === FI MODE BETA ===';

/** Bloc de `_headers` (Workers Static Assets) per a les pàgines prerenderitzades i els fitxers. */
export const BLOC_HEADERS_BETA = `${INICI_BLOC}\n/*\n  X-Robots-Tag: ${ROBOTS_BETA}\n${FI_BLOC}\n`;

/**
 * Contingut del `_headers` de l'arrel (l'adapter de Cloudflare el copia a la sortida i hi afegeix
 * les seves regles). En beta hi posa el bloc al principi; fora de beta el treu. Conserva les
 * regles manuals que hi pugui haver. `undefined` = el fitxer no ha d'existir.
 */
export function aplicarBlocBeta(contingut: string | undefined, beta: boolean): string | undefined {
	const inici = contingut?.indexOf(INICI_BLOC) ?? -1;
	const fi = contingut?.indexOf(FI_BLOC) ?? -1;
	const sense =
		contingut !== undefined && inici >= 0 && fi > inici
			? contingut.slice(0, inici) + contingut.slice(fi + FI_BLOC.length).replace(/^\r?\n/, '')
			: (contingut ?? '');
	const resultat = beta ? BLOC_HEADERS_BETA + sense : sense;
	return resultat.trim() ? resultat : undefined;
}
