/**
 * Utilitats de topònims: slugs (docs/02-arquitectura-seo.md §3.2) i formes amb
 * article/preposició per a textos com "pujar al Pedraforca" o "cims del Berguedà".
 * Funcions pures; les fa servir el script del catàleg i la UI.
 */

/** Articles catalans que pot portar un topònim (`''` = sense article). */
export const ARTICLES = ['el', 'la', "l'", 'els', 'les', 'lo', ''] as const;
export type Article = (typeof ARTICLES)[number];

/** Treu accents i diacrítics (à → a, ç → c, l·l → ll). */
export function senseAccents(s: string): string {
	// Marques combinatòries (Unicode "Mark") després de descompondre en NFD.
	return s.normalize('NFD').replace(/\p{M}/gu, '').replace(/·/g, '');
}

/**
 * Slug: minúscules, sense accents ni apòstrofs, paraules separades per guions.
 * `Pica d'Estats` → `pica-d-estats`.
 */
export function slugify(s: string): string {
	return senseAccents(s)
		.toLowerCase()
		.replace(/[’']/g, '-')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/** Format de slug vàlid (el que genera `slugify`). */
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** El nom comença per vocal o h muda (per apostrofar "l'" i "d'"). */
function comencaPerVocal(nom: string): boolean {
	return /^[aeiouàèéíòóú]/i.test(nom) || /^h[aeiouàèéíòóú]/i.test(nom);
}

/**
 * Nom amb article en minúscula: ("Pedraforca", "el") → "el Pedraforca".
 * El nom ha d'anar sense l'article (vegeu `separarArticle`).
 */
export function ambArticle(nom: string, article: Article): string {
	if (!article) return nom;
	if (article === "l'") return `l'${nom}`;
	return `${article} ${nom}`;
}

/** Contracció amb "de": del, de la, de l', dels, de les, de lo, d'/de. */
export function ambDe(nom: string, article: Article): string {
	switch (article) {
		case 'el':
			return `del ${nom}`;
		case 'els':
			return `dels ${nom}`;
		case '':
			return comencaPerVocal(nom) ? `d'${nom}` : `de ${nom}`;
		default:
			return `de ${ambArticle(nom, article)}`;
	}
}

/** Contracció amb "a": al, a la, a l', als, a les, a lo, a. */
export function ambA(nom: string, article: Article): string {
	switch (article) {
		case 'el':
			return `al ${nom}`;
		case 'els':
			return `als ${nom}`;
		default:
			return `a ${ambArticle(nom, article)}`;
	}
}

/**
 * Separa l'article inicial d'un nom amb article en minúscula ("el Pedraforca" →
 * { article: 'el', nom: 'Pedraforca' }). Serveix per derivar "a"/"per" a partir de
 * `nom_amb_article`.
 */
export function separarArticle(ambArt: string): { article: Article; nom: string } {
	const m = /^(el|la|els|les|lo) (.+)$/.exec(ambArt);
	if (m) return { article: m[1] as Article, nom: m[2] };
	if (ambArt.startsWith("l'")) return { article: "l'", nom: ambArt.slice(2) };
	return { article: '', nom: ambArt };
}
