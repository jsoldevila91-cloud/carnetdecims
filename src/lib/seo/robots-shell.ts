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

/** Meta robots marcat del shell (`noindex`, o `noindex, nofollow` en mode beta). */
export const metaNoindexShell = (contingut = 'noindex') =>
	`<meta name="robots" content="${contingut}" ${ATRIBUT_SHELL} />`;

export const META_NOINDEX_SHELL = metaNoindexShell();

/** Rutes (id intern de SvelteKit, sense idioma) que porten `noindex` al shell. */
export function esRutaNoindexShell(routeId: string | null | undefined): boolean {
	return routeId === '/app' || (routeId?.startsWith('/app/') ?? false);
}

/**
 * Afegeix el meta just abans de `</head>`. No fa res si el fragment no conté `</head>` o si
 * ja hi ha un meta robots (p. ex. el de `PageMeta` a les pàgines amb SSR, o en mode beta).
 */
export function injectarNoindexShell(html: string, contingut = 'noindex'): string {
	if (!html.includes('</head>') || /<meta\s[^>]*name=["']robots["']/i.test(html)) return html;
	return html.replace('</head>', `\t${metaNoindexShell(contingut)}\n\t</head>`);
}

/** Treu el meta del shell (hook de client `init`). */
export function retirarNoindexShell(doc: Pick<Document, 'querySelectorAll'>): void {
	doc.querySelectorAll(`meta[${ATRIBUT_SHELL}]`).forEach((m) => m.remove());
}

/** Atribut que marca l'avís `<noscript>` injectat al shell. */
export const ATRIBUT_NOSCRIPT = 'data-noscript-shell';

const escapaHtml = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Avís per a qui no té JavaScript a la zona `/app` (SPA sense SSR): sense JS la pàgina queda
 * en blanc, i el registre, el carnet i el compte (formulari del correu) no funcionen.
 * S'afegeix just després de `<body …>`; no fa res si no hi ha `<body` o si ja hi és.
 */
export function injectarAvisNoscript(html: string, text: string): string {
	if (html.includes(ATRIBUT_NOSCRIPT)) return html;
	return html.replace(
		/<body[^>]*>/i,
		(body) =>
			`${body}\n\t\t<noscript ${ATRIBUT_NOSCRIPT}><p style="margin:1rem;padding:1rem;border:2px solid #b3352a;border-radius:8px;font:1rem/1.5 system-ui,sans-serif">${escapaHtml(text)}</p></noscript>`
	);
}
