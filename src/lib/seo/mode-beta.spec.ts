import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
	BLOC_HEADERS_BETA,
	ROBOTS_BETA,
	aplicarBlocBeta,
	esModeBeta,
	resoldreModeBeta,
	valorModeBetaWrangler
} from './mode-beta-config';
import { MODE_BETA } from './mode-beta';

describe('esModeBeta', () => {
	it('per defecte (sense valor o amb qualsevol valor) és beta', () => {
		for (const v of [undefined, null, '', 'true', 'TRUE', '1', 'sí', ' qualsevol ']) {
			expect(esModeBeta(v)).toBe(true);
		}
	});
	it('només false/0/no/off el desactiven', () => {
		for (const v of ['false', 'False', ' FALSE ', '0', 'no', 'off']) {
			expect(esModeBeta(v)).toBe(false);
		}
	});
});

describe('resoldreModeBeta', () => {
	it("l'entorn del build mana sobre wrangler.jsonc", () => {
		expect(resoldreModeBeta('false', 'true')).toBe(false);
		expect(resoldreModeBeta('true', 'false')).toBe(true);
	});
	it('sense entorn, mana wrangler.jsonc; sense res, beta', () => {
		expect(resoldreModeBeta(undefined, 'false')).toBe(false);
		expect(resoldreModeBeta('  ', 'false')).toBe(false);
		expect(resoldreModeBeta(undefined, undefined)).toBe(true);
	});
});

describe('valorModeBetaWrangler', () => {
	it('llegeix el valor (string o booleà) i ignora els comentaris sense cometes', () => {
		expect(valorModeBetaWrangler('{ "vars": { "PUBLIC_MODE_BETA": "false" } }')).toBe('false');
		expect(valorModeBetaWrangler('{ "vars": { "PUBLIC_MODE_BETA" : true } }')).toBe('true');
		expect(valorModeBetaWrangler('// PUBLIC_MODE_BETA=false\n{}')).toBeUndefined();
	});
	it('wrangler.jsonc del repo: beta fins al llançament', () => {
		const jsonc = readFileSync('wrangler.jsonc', 'utf8');
		expect(esModeBeta(valorModeBetaWrangler(jsonc))).toBe(true);
	});
});

describe('aplicarBlocBeta (_headers)', () => {
	it('en beta, X-Robots-Tag noindex, nofollow per a totes les rutes', () => {
		const out = aplicarBlocBeta(undefined, true);
		expect(out).toBe(BLOC_HEADERS_BETA);
		expect(out).toMatch(/^\/\*\n {2}X-Robots-Tag: noindex, nofollow$/m);
	});
	it('fora de beta, sense fitxer (o només amb les regles manuals)', () => {
		expect(aplicarBlocBeta(undefined, false)).toBeUndefined();
		expect(aplicarBlocBeta(BLOC_HEADERS_BETA, false)).toBeUndefined();
		const manual = '/feed.xml\n  Cache-Control: no-cache\n';
		expect(aplicarBlocBeta(BLOC_HEADERS_BETA + manual, false)).toBe(manual);
	});
	it('idempotent i conserva les regles manuals', () => {
		const manual = '/feed.xml\n  Cache-Control: no-cache\n';
		const un = aplicarBlocBeta(manual, true);
		expect(un).toBe(BLOC_HEADERS_BETA + manual);
		expect(aplicarBlocBeta(un, true)).toBe(un);
	});
});

describe('MODE_BETA (build)', () => {
	it('és un booleà definit al build i el valor del meta és noindex, nofollow', () => {
		expect(typeof MODE_BETA).toBe('boolean');
		expect(ROBOTS_BETA).toBe('noindex, nofollow');
	});
});
