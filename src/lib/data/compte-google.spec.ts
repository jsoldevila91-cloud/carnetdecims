import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Cada test torna a importar `compte` (i la capa de dades): amb la màquina carregada triga.
vi.setConfig({ testTimeout: 30_000 });

/** Estat del client de Supabase simulat (els tests el canvien abans d'importar `compte`). */
const sim = vi.hoisted(() => ({
	configurat: true,
	google: true,
	signInWithOAuth: null as unknown as ReturnType<typeof vi.fn>,
	getSession: null as unknown as ReturnType<typeof vi.fn>
}));

vi.mock('$lib/platform/supabase', () => ({
	supabaseConfigurat: () => sim.configurat,
	get googleAuthActiu() {
		return sim.google;
	},
	sessioDesada: () => null,
	obtenirSupabase: () => ({
		auth: {
			signInWithOAuth: sim.signInWithOAuth,
			getSession: sim.getSession,
			onAuthStateChange: vi.fn()
		}
	})
}));

async function carregarCompte() {
	vi.resetModules();
	return import('./compte');
}

beforeEach(() => {
	sim.configurat = true;
	sim.google = true;
	sim.signInWithOAuth = vi.fn(async () => ({
		data: { provider: 'google', url: 'x' },
		error: null
	}));
	sim.getSession = vi.fn(async () => ({ data: { session: null }, error: null }));
});

afterEach(() => vi.resetModules());

describe('googleDisponible', () => {
	it('cert només amb Supabase configurat i PUBLIC_GOOGLE_AUTH actiu', async () => {
		expect((await carregarCompte()).googleDisponible).toBe(true);
		sim.google = false;
		expect((await carregarCompte()).googleDisponible).toBe(false);
		sim.google = true;
		sim.configurat = false;
		expect((await carregarCompte()).googleDisponible).toBe(false);
	});
});

describe('entrarAmbGoogle', () => {
	it('crida signInWithOAuth amb el proveïdor google i el redirectTo', async () => {
		const { entrarAmbGoogle } = await carregarCompte();
		await entrarAmbGoogle({ redirectTo: 'https://carnetdecims.cat/ca/app/compte' });
		expect(sim.signInWithOAuth).toHaveBeenCalledWith({
			provider: 'google',
			options: { redirectTo: 'https://carnetdecims.cat/ca/app/compte' }
		});
	});

	it('desactivat: llança no-configurat sense cridar Supabase', async () => {
		sim.google = false;
		const { entrarAmbGoogle, ErrorCompte } = await carregarCompte();
		const e = await entrarAmbGoogle({ redirectTo: 'https://x/' }).catch((err: unknown) => err);
		expect(e).toBeInstanceOf(ErrorCompte);
		expect(e).toMatchObject({ codi: 'no-configurat' });
		expect(sim.signInWithOAuth).not.toHaveBeenCalled();
	});

	it('errors: excepció de fetch → xarxa; error d’Auth → mateixa classificació que el correu', async () => {
		const { entrarAmbGoogle } = await carregarCompte();
		sim.signInWithOAuth.mockRejectedValueOnce(new TypeError('Failed to fetch'));
		await expect(entrarAmbGoogle({ redirectTo: 'https://x/' })).rejects.toMatchObject({
			codi: 'xarxa'
		});
		sim.signInWithOAuth.mockResolvedValueOnce({
			data: { provider: 'google', url: null },
			error: { status: 429, code: 'over_request_rate_limit', message: 'x' }
		});
		await expect(entrarAmbGoogle({ redirectTo: 'https://x/' })).rejects.toMatchObject({
			codi: 'limit'
		});
		sim.signInWithOAuth.mockResolvedValueOnce({
			data: { provider: 'google', url: null },
			error: { status: 500, message: 'Unsupported provider' }
		});
		await expect(entrarAmbGoogle({ redirectTo: 'https://x/' })).rejects.toMatchObject({
			codi: 'servidor'
		});
	});
});

describe('retorn de Google: completarEntradaDesDeUrl', () => {
	const URL_BASE = 'https://carnetdecims.cat/ca/app/compte';

	it('?code= (PKCE): espera la sessió que bescanvia supabase-js', async () => {
		const { completarEntradaDesDeUrl } = await carregarCompte();
		sim.getSession.mockResolvedValueOnce({ data: { session: { user: { id: 'u' } } }, error: null });
		expect(await completarEntradaDesDeUrl(new URL(`${URL_BASE}?code=abc`))).toBe('entrat');
		// Sense sessió (p. ex. el verificador PKCE és en un altre navegador): codi:invalid.
		expect(await completarEntradaDesDeUrl(new URL(`${URL_BASE}?code=abc`))).toMatchObject({
			codi: 'codi:invalid'
		});
	});

	it("cancel·lació de l'usuari (?error=access_denied&error_description=…) → cancelat", async () => {
		const { completarEntradaDesDeUrl } = await carregarCompte();
		const r = await completarEntradaDesDeUrl(
			new URL(`${URL_BASE}?error=access_denied&error_description=The+user+denied+access`)
		);
		expect(r).toMatchObject({ codi: 'cancelat' });
		// També al fragment (flux implícit).
		expect(
			await completarEntradaDesDeUrl(new URL(`${URL_BASE}#error=access_denied`))
		).toMatchObject({ codi: 'cancelat' });
		expect(sim.getSession).not.toHaveBeenCalled();
	});

	it('errorEntradaUrl: classificació dels errors que tornen a la URL', async () => {
		const { errorEntradaUrl } = await carregarCompte();
		expect(errorEntradaUrl(null, null)).toBeNull();
		expect(errorEntradaUrl('access_denied', null)?.codi).toBe('cancelat');
		expect(errorEntradaUrl('access_denied', 'access_denied')?.codi).toBe('cancelat');
		// L'enllaç del correu caducat també porta `access_denied`, però amb `error_code`.
		expect(errorEntradaUrl('access_denied', 'otp_expired')?.codi).toBe('codi:invalid');
		expect(errorEntradaUrl('invalid_request', 'flow_state_expired')?.codi).toBe('codi:invalid');
		expect(errorEntradaUrl('invalid_request', 'flow_state_not_found')?.codi).toBe('codi:invalid');
		expect(errorEntradaUrl('server_error', 'over_request_rate_limit')?.codi).toBe('limit');
		expect(errorEntradaUrl('server_error', 'unexpected_failure')?.codi).toBe('servidor');
		expect(errorEntradaUrl('server_error', null)?.codi).toBe('servidor');
	});
});
