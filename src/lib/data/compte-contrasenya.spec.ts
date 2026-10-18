import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Cada test torna a importar `compte` (i la capa de dades): amb la màquina carregada triga.
vi.setConfig({ testTimeout: 30_000 });

type Fn = ReturnType<typeof vi.fn>;
type CallbackAuth = (event: string, session: unknown) => void;

/** Estat del client de Supabase simulat (els tests el canvien abans d'importar `compte`). */
const sim = vi.hoisted(() => ({
	configurat: true,
	contrasenya: true,
	signUp: null as unknown as Fn,
	signInWithPassword: null as unknown as Fn,
	resend: null as unknown as Fn,
	resetPasswordForEmail: null as unknown as Fn,
	updateUser: null as unknown as Fn,
	getSession: null as unknown as Fn,
	verifyOtp: null as unknown as Fn,
	onAuthStateChange: null as unknown as Fn,
	callbackAuth: null as CallbackAuth | null
}));

vi.mock('$lib/platform/supabase', () => ({
	supabaseConfigurat: () => sim.configurat,
	googleAuthActiu: false,
	get contrasenyaAuthActiu() {
		return sim.contrasenya;
	},
	sessioDesada: () => null,
	obtenirSupabase: () => ({
		auth: {
			signUp: sim.signUp,
			signInWithPassword: sim.signInWithPassword,
			resend: sim.resend,
			resetPasswordForEmail: sim.resetPasswordForEmail,
			updateUser: sim.updateUser,
			getSession: sim.getSession,
			verifyOtp: sim.verifyOtp,
			onAuthStateChange: sim.onAuthStateChange,
			signOut: vi.fn(async () => ({ error: null }))
		}
	})
}));

async function carregarCompte() {
	vi.resetModules();
	return import('./compte');
}

const REDIRECT = 'https://carnetdecims.cat/ca/app/compte';
const CORREU = 'nom@exemple.cat';
const BONA = 'cims i més cims';
const USUARI = { id: 'u1', email: CORREU };
const SESSIO = { user: USUARI, access_token: 't' };

beforeEach(() => {
	sim.configurat = true;
	sim.contrasenya = true;
	sim.callbackAuth = null;
	sim.signUp = vi.fn(async () => ({
		data: { user: { ...USUARI, identities: [{ provider: 'email' }] }, session: null },
		error: null
	}));
	sim.signInWithPassword = vi.fn(async () => ({
		data: { user: USUARI, session: SESSIO },
		error: null
	}));
	sim.resend = vi.fn(async () => ({ data: {}, error: null }));
	sim.resetPasswordForEmail = vi.fn(async () => ({ data: {}, error: null }));
	sim.updateUser = vi.fn(async () => ({ data: { user: USUARI }, error: null }));
	sim.getSession = vi.fn(async () => ({ data: { session: SESSIO }, error: null }));
	sim.verifyOtp = vi.fn(async () => ({ data: { user: USUARI, session: SESSIO }, error: null }));
	sim.onAuthStateChange = vi.fn((cb: CallbackAuth) => {
		sim.callbackAuth = cb;
		return { data: { subscription: { unsubscribe: () => {} } } };
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.resetModules();
});

/** Valor actual d'un store de lectura. */
function valor<T>(store: { subscribe(run: (v: T) => void): () => void }): T {
	let v!: T;
	store.subscribe((x) => (v = x))();
	return v;
}

describe('contrasenyaDisponible', () => {
	it('cert només amb Supabase configurat i PUBLIC_PASSWORD_AUTH actiu', async () => {
		expect((await carregarCompte()).contrasenyaDisponible).toBe(true);
		sim.contrasenya = false;
		expect((await carregarCompte()).contrasenyaDisponible).toBe(false);
		sim.contrasenya = true;
		sim.configurat = false;
		expect((await carregarCompte()).contrasenyaDisponible).toBe(false);
	});

	it('desactivat: totes les operacions llancen no-configurat sense cridar Supabase', async () => {
		sim.contrasenya = false;
		const c = await carregarCompte();
		const crides = [
			() => c.crearCompteAmbContrasenya(CORREU, BONA, { redirectTo: REDIRECT }),
			() => c.entrarAmbContrasenya(CORREU, BONA),
			() => c.reenviarConfirmacio(CORREU, { redirectTo: REDIRECT }),
			() => c.demanarRestabliment(CORREU, { redirectTo: REDIRECT }),
			() => c.canviarContrasenya(BONA)
		];
		for (const crida of crides) {
			await expect(crida()).rejects.toMatchObject({ codi: 'no-configurat' });
		}
		for (const f of [
			sim.signUp,
			sim.signInWithPassword,
			sim.resend,
			sim.resetPasswordForEmail,
			sim.updateUser,
			sim.getSession
		]) {
			expect(f).not.toHaveBeenCalled();
		}
	});
});

describe('crearCompteAmbContrasenya', () => {
	it('crida signUp amb el correu normalitzat, la contrasenya tal qual i emailRedirectTo', async () => {
		const { crearCompteAmbContrasenya } = await carregarCompte();
		const r = await crearCompteAmbContrasenya(' Nom@Exemple.CAT ', ` ${BONA} `, {
			redirectTo: REDIRECT
		});
		expect(r).toBe('confirmar-correu');
		expect(sim.signUp).toHaveBeenCalledWith({
			email: CORREU,
			password: ` ${BONA} `,
			options: { emailRedirectTo: REDIRECT }
		});
	});

	it('correu ja registrat (usuari ofuscat amb identities: []): també confirmar-correu', async () => {
		sim.signUp.mockResolvedValueOnce({
			data: { user: { id: 'ofuscat', email: CORREU, identities: [] }, session: null },
			error: null
		});
		const { crearCompteAmbContrasenya } = await carregarCompte();
		expect(await crearCompteAmbContrasenya(CORREU, BONA, { redirectTo: REDIRECT })).toBe(
			'confirmar-correu'
		);
	});

	it('amb la confirmació desactivada (ja hi ha sessió): entrat', async () => {
		sim.signUp.mockResolvedValueOnce({ data: { user: USUARI, session: SESSIO }, error: null });
		const { crearCompteAmbContrasenya } = await carregarCompte();
		expect(await crearCompteAmbContrasenya(CORREU, BONA, { redirectTo: REDIRECT })).toBe('entrat');
	});

	it('valida al client abans de cridar Supabase', async () => {
		const { crearCompteAmbContrasenya } = await carregarCompte();
		const o = { redirectTo: REDIRECT };
		await expect(crearCompteAmbContrasenya('no-es-un-correu', BONA, o)).rejects.toMatchObject({
			codi: 'email:invalid'
		});
		await expect(crearCompteAmbContrasenya(CORREU, '', o)).rejects.toMatchObject({
			codi: 'contrasenya:buida'
		});
		await expect(crearCompteAmbContrasenya(CORREU, 'curta', o)).rejects.toMatchObject({
			codi: 'contrasenya:curta'
		});
		await expect(crearCompteAmbContrasenya(CORREU, 'à'.repeat(37), o)).rejects.toMatchObject({
			codi: 'contrasenya:llarga'
		});
		await expect(crearCompteAmbContrasenya(CORREU, 'NOM@exemple.cat', o)).rejects.toMatchObject({
			codi: 'contrasenya:igual-correu'
		});
		expect(sim.signUp).not.toHaveBeenCalled();
	});

	it('errors del servidor: weak_password, signup_disabled, límit i xarxa', async () => {
		const { crearCompteAmbContrasenya } = await carregarCompte();
		const o = { redirectTo: REDIRECT };
		sim.signUp.mockResolvedValueOnce({
			data: { user: null, session: null },
			error: { status: 422, code: 'weak_password', message: 'x', reasons: ['pwned'] }
		});
		await expect(crearCompteAmbContrasenya(CORREU, BONA, o)).rejects.toMatchObject({
			codi: 'contrasenya:filtrada'
		});
		sim.signUp.mockResolvedValueOnce({
			data: { user: null, session: null },
			error: { status: 422, code: 'signup_disabled', message: 'Signups not allowed' }
		});
		await expect(crearCompteAmbContrasenya(CORREU, BONA, o)).rejects.toMatchObject({
			codi: 'no-disponible'
		});
		sim.signUp.mockResolvedValueOnce({
			data: { user: null, session: null },
			error: { status: 429, code: 'over_email_send_rate_limit', message: 'x' }
		});
		await expect(crearCompteAmbContrasenya(CORREU, BONA, o)).rejects.toMatchObject({
			codi: 'limit'
		});
		sim.signUp.mockRejectedValueOnce(new TypeError('Failed to fetch'));
		await expect(crearCompteAmbContrasenya(CORREU, BONA, o)).rejects.toMatchObject({
			codi: 'xarxa'
		});
	});
});

describe('entrarAmbContrasenya', () => {
	it('crida signInWithPassword i retorna l’usuari', async () => {
		const { entrarAmbContrasenya } = await carregarCompte();
		expect(await entrarAmbContrasenya(' NOM@exemple.cat', 'curta')).toEqual(USUARI);
		// A l'entrada no s'aplica la llargada mínima: ho decideix el servidor.
		expect(sim.signInWithPassword).toHaveBeenCalledWith({ email: CORREU, password: 'curta' });
	});

	it('correu invàlid o contrasenya buida: no crida Supabase', async () => {
		const { entrarAmbContrasenya } = await carregarCompte();
		await expect(entrarAmbContrasenya('x', BONA)).rejects.toMatchObject({ codi: 'email:invalid' });
		await expect(entrarAmbContrasenya(CORREU, '')).rejects.toMatchObject({
			codi: 'contrasenya:buida'
		});
		expect(sim.signInWithPassword).not.toHaveBeenCalled();
	});

	it('credencials incorrectes i correu no confirmat', async () => {
		const { entrarAmbContrasenya } = await carregarCompte();
		sim.signInWithPassword.mockResolvedValueOnce({
			data: { user: null, session: null },
			error: { status: 400, code: 'invalid_credentials', message: 'Invalid login credentials' }
		});
		await expect(entrarAmbContrasenya(CORREU, BONA)).rejects.toMatchObject({
			codi: 'credencials'
		});
		sim.signInWithPassword.mockResolvedValueOnce({
			data: { user: null, session: null },
			error: { status: 400, code: 'email_not_confirmed', message: 'Email not confirmed' }
		});
		await expect(entrarAmbContrasenya(CORREU, BONA)).rejects.toMatchObject({
			codi: 'correu-no-confirmat'
		});
	});
});

describe('reenviarConfirmacio i demanarRestabliment', () => {
	it('reenviarConfirmacio crida resend de tipus signup amb emailRedirectTo', async () => {
		const { reenviarConfirmacio } = await carregarCompte();
		await reenviarConfirmacio('Nom@exemple.cat', { redirectTo: REDIRECT });
		expect(sim.resend).toHaveBeenCalledWith({
			type: 'signup',
			email: CORREU,
			options: { emailRedirectTo: REDIRECT }
		});
		sim.resend.mockResolvedValueOnce({
			data: {},
			error: { status: 429, code: 'over_email_send_rate_limit', message: 'x' }
		});
		await expect(reenviarConfirmacio(CORREU, { redirectTo: REDIRECT })).rejects.toMatchObject({
			codi: 'limit'
		});
	});

	it('demanarRestabliment crida resetPasswordForEmail amb redirectTo', async () => {
		const { demanarRestabliment } = await carregarCompte();
		await demanarRestabliment(' nom@EXEMPLE.cat ', { redirectTo: REDIRECT });
		expect(sim.resetPasswordForEmail).toHaveBeenCalledWith(CORREU, { redirectTo: REDIRECT });
		await expect(demanarRestabliment('x@', { redirectTo: REDIRECT })).rejects.toMatchObject({
			codi: 'email:invalid'
		});
		sim.resetPasswordForEmail.mockRejectedValueOnce(new TypeError('Failed to fetch'));
		await expect(demanarRestabliment(CORREU, { redirectTo: REDIRECT })).rejects.toMatchObject({
			codi: 'xarxa'
		});
	});
});

describe('canviarContrasenya', () => {
	it('amb sessió: crida updateUser amb la contrasenya nova', async () => {
		const { canviarContrasenya } = await carregarCompte();
		await canviarContrasenya(BONA);
		expect(sim.updateUser).toHaveBeenCalledWith({ password: BONA });
	});

	it('sense sessió: sessio, sense cridar updateUser', async () => {
		sim.getSession.mockResolvedValueOnce({ data: { session: null }, error: null });
		const { canviarContrasenya } = await carregarCompte();
		await expect(canviarContrasenya(BONA)).rejects.toMatchObject({ codi: 'sessio' });
		expect(sim.updateUser).not.toHaveBeenCalled();
	});

	it('valida la nova (també que no sigui el correu de la sessió)', async () => {
		const { canviarContrasenya } = await carregarCompte();
		await expect(canviarContrasenya('curta')).rejects.toMatchObject({ codi: 'contrasenya:curta' });
		await expect(canviarContrasenya(CORREU)).rejects.toMatchObject({
			codi: 'contrasenya:igual-correu'
		});
		expect(sim.updateUser).not.toHaveBeenCalled();
	});

	it('errors del servidor: same_password, reauthentication_needed, sessió perduda', async () => {
		const { canviarContrasenya } = await carregarCompte();
		sim.updateUser.mockResolvedValueOnce({
			data: { user: null },
			error: { status: 422, code: 'same_password', message: 'x' }
		});
		await expect(canviarContrasenya(BONA)).rejects.toMatchObject({ codi: 'contrasenya:igual' });
		sim.updateUser.mockResolvedValueOnce({
			data: { user: null },
			error: { status: 400, code: 'reauthentication_needed', message: 'x' }
		});
		await expect(canviarContrasenya(BONA)).rejects.toMatchObject({ codi: 'reautenticacio' });
		sim.updateUser.mockResolvedValueOnce({
			data: { user: null },
			error: { status: 400, name: 'AuthSessionMissingError', message: 'Auth session missing!' }
		});
		await expect(canviarContrasenya(BONA)).rejects.toMatchObject({ codi: 'sessio' });
	});
});

describe('recuperació: completarEntradaDesDeUrl i modeRecuperacio', () => {
	it('?token_hash=…&type=recovery: verifyOtp de tipus recovery → recuperacio', async () => {
		const c = await carregarCompte();
		expect(valor(c.modeRecuperacio)).toBe(false);
		const r = await c.completarEntradaDesDeUrl(new URL(`${REDIRECT}?token_hash=abc&type=recovery`));
		expect(sim.verifyOtp).toHaveBeenCalledWith({ token_hash: 'abc', type: 'recovery' });
		expect(r).toBe('recuperacio');
		expect(valor(c.modeRecuperacio)).toBe(true);
		// Desar la contrasenya nova en surt.
		await c.canviarContrasenya(BONA);
		expect(valor(c.modeRecuperacio)).toBe(false);
	});

	it('sortirModeRecuperacio i un enllaç d’un altre tipus en surten', async () => {
		const c = await carregarCompte();
		await c.completarEntradaDesDeUrl(new URL(`${REDIRECT}?token_hash=abc&type=recovery`));
		c.sortirModeRecuperacio();
		expect(valor(c.modeRecuperacio)).toBe(false);
		await c.completarEntradaDesDeUrl(new URL(`${REDIRECT}?token_hash=abc&type=recovery`));
		expect(await c.completarEntradaDesDeUrl(new URL(`${REDIRECT}?token_hash=d&type=email`))).toBe(
			'entrat'
		);
		expect(valor(c.modeRecuperacio)).toBe(false);
	});

	it('type=signup i type=email són una entrada normal', async () => {
		const { completarEntradaDesDeUrl } = await carregarCompte();
		expect(await completarEntradaDesDeUrl(new URL(`${REDIRECT}?token_hash=a&type=signup`))).toBe(
			'entrat'
		);
		expect(sim.verifyOtp).toHaveBeenLastCalledWith({ token_hash: 'a', type: 'signup' });
		expect(await completarEntradaDesDeUrl(new URL(`${REDIRECT}?token_hash=b&type=email`))).toBe(
			'entrat'
		);
		expect(sim.verifyOtp).toHaveBeenLastCalledWith({ token_hash: 'b', type: 'email' });
	});

	it('enllaç de recuperació caducat → codi:invalid', async () => {
		sim.verifyOtp.mockResolvedValueOnce({
			data: { user: null, session: null },
			error: { status: 403, code: 'otp_expired', message: 'Token has expired or is invalid' }
		});
		const c = await carregarCompte();
		const r = await c.completarEntradaDesDeUrl(new URL(`${REDIRECT}?token_hash=x&type=recovery`));
		expect(r).toMatchObject({ codi: 'codi:invalid' });
		expect(valor(c.modeRecuperacio)).toBe(false);
	});

	it('contrasenya desactivada: l’enllaç de recuperació només fa entrar', async () => {
		sim.contrasenya = false;
		const { completarEntradaDesDeUrl } = await carregarCompte();
		expect(
			await completarEntradaDesDeUrl(new URL(`${REDIRECT}?token_hash=abc&type=recovery`))
		).toBe('entrat');
	});

	it('?code= (PKCE) amb l’esdeveniment PASSWORD_RECOVERY → recuperacio', async () => {
		vi.stubGlobal('window', {});
		const c = await carregarCompte();
		// supabase-js emet PASSWORD_RECOVERY en un setTimeout després de desar la sessió.
		sim.getSession.mockImplementationOnce(async () => {
			setTimeout(() => sim.callbackAuth?.('PASSWORD_RECOVERY', null), 0);
			return { data: { session: SESSIO }, error: null };
		});
		expect(await c.completarEntradaDesDeUrl(new URL(`${REDIRECT}?code=abc`))).toBe('recuperacio');
		expect(valor(c.modeRecuperacio)).toBe(true);
		// En tancar la sessió (SIGNED_OUT) en surt.
		sim.callbackAuth?.('SIGNED_OUT', null);
		expect(valor(c.modeRecuperacio)).toBe(false);
	});

	it('?code= sense PASSWORD_RECOVERY (Google o enllaç d’accés) → entrat', async () => {
		vi.stubGlobal('window', {});
		const { completarEntradaDesDeUrl } = await carregarCompte();
		expect(await completarEntradaDesDeUrl(new URL(`${REDIRECT}?code=abc`))).toBe('entrat');
	});
});

describe('errorAuth: errors de contrasenya', () => {
	it('mapeja els codis de Supabase Auth', async () => {
		const { errorAuth } = await carregarCompte();
		const codi = (e: Parameters<typeof errorAuth>[0]) => errorAuth(e).codi;
		expect(codi({ status: 400, code: 'invalid_credentials', message: 'x' })).toBe('credencials');
		expect(codi({ status: 400, code: 'email_not_confirmed', message: 'x' })).toBe(
			'correu-no-confirmat'
		);
		expect(codi({ status: 422, code: 'weak_password', message: 'x', reasons: ['pwned'] })).toBe(
			'contrasenya:filtrada'
		);
		expect(
			codi({ status: 422, code: 'weak_password', message: 'x', reasons: ['length', 'pwned'] })
		).toBe('contrasenya:filtrada');
		expect(codi({ status: 422, code: 'weak_password', message: 'x', reasons: ['length'] })).toBe(
			'contrasenya:curta'
		);
		expect(
			codi({ status: 422, code: 'weak_password', message: 'x', reasons: ['characters'] })
		).toBe('contrasenya:feble');
		expect(codi({ status: 422, code: 'weak_password', message: 'x' })).toBe('contrasenya:feble');
		expect(codi({ status: 422, code: 'same_password', message: 'x' })).toBe('contrasenya:igual');
		expect(codi({ status: 400, code: 'reauthentication_needed', message: 'x' })).toBe(
			'reautenticacio'
		);
		expect(codi({ status: 422, code: 'signup_disabled', message: 'x' })).toBe('no-disponible');
		expect(codi({ status: 400, code: 'email_provider_disabled', message: 'x' })).toBe(
			'no-disponible'
		);
		expect(codi({ status: 400, name: 'AuthSessionMissingError', message: 'x' })).toBe('sessio');
		expect(codi({ status: 0, message: 'Failed to fetch' })).toBe('xarxa');
	});

	it('validation_failed: contrasenya si el missatge en parla; si no, correu', async () => {
		const { errorAuth } = await carregarCompte();
		expect(
			errorAuth({
				status: 422,
				code: 'validation_failed',
				message: 'Password cannot be longer than 72 characters'
			}).codi
		).toBe('contrasenya:llarga');
		expect(
			errorAuth({
				status: 422,
				code: 'validation_failed',
				message: 'Signup requires a valid password'
			}).codi
		).toBe('contrasenya:feble');
		expect(
			errorAuth({ status: 400, code: 'validation_failed', message: 'invalid format' }).codi
		).toBe('email:invalid');
	});

	it('sense error_code (GoTrue antic): pel text', async () => {
		const { errorAuth } = await carregarCompte();
		expect(errorAuth({ status: 400, message: 'Invalid login credentials' }).codi).toBe(
			'credencials'
		);
		expect(errorAuth({ status: 400, message: 'Email not confirmed' }).codi).toBe(
			'correu-no-confirmat'
		);
	});
});
