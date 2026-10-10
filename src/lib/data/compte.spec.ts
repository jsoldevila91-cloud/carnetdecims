import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { errorAuth } from './compte';

describe('errorAuth: classificació dels errors de Supabase Auth', () => {
	it('400 email_address_invalid ("… is invalid") és un correu invàlid, no un codi incorrecte', () => {
		const e = errorAuth({
			status: 400,
			code: 'email_address_invalid',
			message: 'Email address "inesa@exemple.con" is invalid'
		});
		expect(e.codi).toBe('email:invalid');
	});

	it('validation_failed també és un correu invàlid', () => {
		expect(
			errorAuth({ status: 400, code: 'validation_failed', message: 'invalid format' }).codi
		).toBe('email:invalid');
	});

	it('sense error_code, un missatge de correu invàlid es reconeix pel text', () => {
		expect(errorAuth({ status: 400, message: 'Email address "a@b.con" is invalid' }).codi).toBe(
			'email:invalid'
		);
	});

	it('otp_expired i missatges de token caducat/invàlid són codi:invalid', () => {
		expect(
			errorAuth({ status: 403, code: 'otp_expired', message: 'Token has expired or is invalid' })
				.codi
		).toBe('codi:invalid');
		expect(errorAuth({ status: 403, message: 'Token has expired or is invalid' }).codi).toBe(
			'codi:invalid'
		);
	});

	it('límit de correus (429 o over_*_limit) té prioritat', () => {
		expect(errorAuth({ status: 429, code: 'over_email_send_rate_limit', message: 'x' }).codi).toBe(
			'limit'
		);
		expect(errorAuth({ status: 400, code: 'over_request_rate_limit', message: 'x' }).codi).toBe(
			'limit'
		);
	});

	it('5xx és error de servidor encara que el text digui "invalid"', () => {
		expect(errorAuth({ status: 500, message: 'invalid state' }).codi).toBe('servidor');
	});
});
