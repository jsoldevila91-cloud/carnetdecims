import { describe, expect, it, vi } from 'vitest';
import {
	ATRIBUT_SHELL,
	META_NOINDEX_SHELL,
	esRutaNoindexShell,
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
