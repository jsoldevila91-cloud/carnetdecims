import { describe, expect, it } from 'vitest';
import { VARS_COMPTE, VARS_SUPABASE, valorVarWrangler } from './plugin-env-supabase';

describe('valorVarWrangler', () => {
	const jsonc = `{
	// comentari
	"vars": {
		"PUBLIC_MODE_BETA": "true",
		"PUBLIC_SUPABASE_URL": "https://exemple.supabase.co",
		"PUBLIC_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_x",
		"PUBLIC_GOOGLE_AUTH": "false",
		"PUBLIC_PASSWORD_AUTH": "true"
	}
}`;

	it('llegeix la URL i la clau publicable de `vars`', () => {
		expect(VARS_SUPABASE.map((n) => valorVarWrangler(jsonc, n))).toEqual([
			'https://exemple.supabase.co',
			'sb_publishable_x'
		]);
	});

	it('llegeix també els flags de Google i de la contrasenya', () => {
		expect(VARS_COMPTE.map((n) => valorVarWrangler(jsonc, n))).toEqual(['false', 'true']);
	});

	it('retorna undefined si la variable falta o és buida', () => {
		expect(valorVarWrangler('{}', 'PUBLIC_SUPABASE_URL')).toBeUndefined();
		expect(valorVarWrangler('{"PUBLIC_SUPABASE_URL": ""}', 'PUBLIC_SUPABASE_URL')).toBeUndefined();
	});
});
