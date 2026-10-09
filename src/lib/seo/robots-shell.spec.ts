import { describe, expect, it, vi } from 'vitest';
import {
	ATRIBUT_SHELL,
	META_NOINDEX_SHELL,
	esRutaNoindexShell,
	injectarAvisNoscript,
	injectarNoindexShell,
	retirarNoindexShell
} from './robots-shell';

const SHELL = `<!doctype html>
<html lang="ca">
	<head>
		<meta charset="utf-8" />
		<link rel="modulepreload" href="/_app/x.js">
	</head>
	<body><div style="display: contents"><script>/* start */</script></div></body>
</html>`;

describe('esRutaNoindexShell', () => {
	it('només la zona /app', () => {
		for (const id of ['/app', '/app/registrar', '/app/historial', '/app/compte']) {
			expect(esRutaNoindexShell(id)).toBe(true);
		}
		for (const id of ['/', '/cims', '/cims/[slug]', '/applicacio', '/mapa', null, undefined]) {
			expect(esRutaNoindexShell(id)).toBe(false);
		}
	});
});

describe('injectarNoindexShell', () => {
	it('afegeix un sol meta robots noindex dins del head', () => {
		const html = injectarNoindexShell(SHELL);
		const head = html.slice(0, html.indexOf('</head>'));
		expect(head).toContain(META_NOINDEX_SHELL);
		expect(html.match(/name="robots"/g)).toHaveLength(1);
		expect(html.indexOf(META_NOINDEX_SHELL)).toBeLessThan(html.indexOf('<body'));
	});

	it('mode beta: injecta el contingut indicat (noindex, nofollow)', () => {
		const html = injectarNoindexShell(SHELL, 'noindex, nofollow');
		expect(html).toContain(`<meta name="robots" content="noindex, nofollow" ${ATRIBUT_SHELL} />`);
		expect(html.match(/name="robots"/g)).toHaveLength(1);
	});

	it('no duplica si ja hi ha meta robots ni toca fragments sense </head>', () => {
		const ambMeta = SHELL.replace('</head>', '<meta name="robots" content="noindex" /></head>');
		expect(injectarNoindexShell(ambMeta)).toBe(ambMeta);
		expect(injectarNoindexShell('<div>cos</div>')).toBe('<div>cos</div>');
		expect(injectarNoindexShell(injectarNoindexShell(SHELL))).toBe(injectarNoindexShell(SHELL));
	});
});

describe('retirarNoindexShell', () => {
	it('treu els meta marcats', () => {
		const remove = vi.fn();
		const querySelectorAll = vi.fn(() => [{ remove }, { remove }]);
		retirarNoindexShell({ querySelectorAll } as never);
		expect(querySelectorAll).toHaveBeenCalledWith(`meta[${ATRIBUT_SHELL}]`);
		expect(remove).toHaveBeenCalledTimes(2);
	});
});

describe('injectarAvisNoscript', () => {
	const html = '<html><head></head><body data-x="1"><div>app</div></body></html>';

	it('afegeix un únic <noscript> just després de <body> amb el text escapat', () => {
		const out = injectarAvisNoscript(html, "Cal <JavaScript> & l'app");
		expect(out).toMatch(/<body data-x="1">\s*<noscript data-noscript-shell><p [^>]*>/);
		expect(out).toContain('Cal &#60;JavaScript&#62; &#38; l&#39;app');
		expect(injectarAvisNoscript(out, 'x')).toBe(out);
	});

	it('no fa res sense <body>', () => {
		expect(injectarAvisNoscript('<div></div>', 'x')).toBe('<div></div>');
	});
});
