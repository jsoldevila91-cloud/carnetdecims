/**
 * `noindex` al HTML inicial de la zona `/app` (SPA amb `ssr = false`).
 *
 * Sense SSR, el `<meta name="robots">` de `PageMeta` només apareix després d'executar el JS;
 * el HTML que rep un crawler sense JS només portava la capçalera `X-Robots-Tag`. El hook de
 * servidor l'injecta al shell (`injectarNoindexShell`) i el hook de client el treu en arrencar
 * (`retirarNoindexShell`), abans del primer render: així `PageMeta` en queda l'únic
 * responsable i no hi ha dos meta robots, ni un `noindex` orfe en navegar cap a una pàgina
 * pública.
 */

/** Atribut que marca el meta injectat al shell. */
export const ATRIBUT_SHELL = 'data-robots-shell';

export const META_NOINDEX_SHELL = `<meta name="robots" content="noindex" ${ATRIBUT_SHELL} />`;

/** Rutes (id intern de SvelteKit, sense idioma) que porten `noindex` al shell. */
export function esRutaNoindexShell(routeId: string | null | undefined): boolean {
	return routeId === '/app' || (routeId?.startsWith('/app/') ?? false);
}

/**
 * Afegeix el meta just abans de `</head>`. No fa res si el fragment no conté `</head>` o si
 * ja hi ha un meta robots (p. ex. si algun dia la ruta passa a tenir SSR).
 */
export function injectarNoindexShell(html: string): string {
	if (!html.includes('</head>') || /<meta\s[^>]*name=["']robots["']/i.test(html)) return html;
	return html.replace('</head>', `\t${META_NOINDEX_SHELL}\n\t</head>`);
}

/** Treu el meta del shell (hook de client `init`). */
export function retirarNoindexShell(doc: Pick<Document, 'querySelectorAll'>): void {
	doc.querySelectorAll(`meta[${ATRIBUT_SHELL}]`).forEach((m) => m.remove());
}
