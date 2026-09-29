/**
 * UUIDv7 (RFC 9562): 48 bits de temps Unix en ms + 74 bits aleatoris. Es genera al client
 * i no col·lideix entre dispositius; ordenat per temps de creació (bo per als índexs).
 */
export function uuidv7(msUnix: number = Date.now()): string {
	const b = new Uint8Array(16);
	crypto.getRandomValues(b);
	for (let i = 0; i < 6; i++) b[i] = Math.floor(msUnix / 2 ** (8 * (5 - i))) & 0xff;
	b[6] = 0x70 | (b[6] & 0x0f); // versió 7
	b[8] = 0x80 | (b[8] & 0x3f); // variant RFC
	const hex = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const RE_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/** És un UUID RFC (v1–v8) en minúscules canòniques? */
export function esUuid(valor: unknown): valor is string {
	return typeof valor === 'string' && RE_UUID.test(valor);
}
