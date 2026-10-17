/**
 * Compressió de bytes per als enllaços sense servidor (bloc R3), amb `CompressionStream`
 * (`deflate-raw`, sense capçalera zlib: 6 bytes menys que `deflate`).
 *
 * Sortida de `comprimeix` = 1 byte de capçalera + dades:
 * - `0` → sense comprimir (el navegador no té `CompressionStream`, ha fallat, o comprimit no
 *   és més curt: amb poques dades deflate pot ocupar més).
 * - `1` → `deflate-raw`.
 *
 * `descomprimeix` posa un límit a la mida descomprimida (protecció contra bombes de
 * descompressió): llegeix a trossos i s'atura en quant el supera. No llança mai.
 */

export const CAPCALERA_SENSE_COMPRIMIR = 0;
export const CAPCALERA_DEFLATE_RAW = 1;

function teCompressio(): boolean {
	return typeof CompressionStream === 'function' && typeof DecompressionStream === 'function';
}

function ambCapcalera(capcalera: number, dades: Uint8Array): Uint8Array {
	const sortida = new Uint8Array(dades.length + 1);
	sortida[0] = capcalera;
	sortida.set(dades, 1);
	return sortida;
}

/**
 * Passa `dades` per un `TransformStream` (compressió o descompressió) i llegeix el resultat a
 * trossos; retorna `null` si supera `maxBytes` o si el flux falla.
 */
async function transforma(
	flux: TransformStream<BufferSource, Uint8Array>,
	dades: Uint8Array,
	maxBytes: number
): Promise<Uint8Array | null> {
	const escriptor = flux.writable.getWriter();
	// Els errors d'escriptura es veuen també a la lectura; aquí només s'evita el rebuig no gestionat.
	escriptor.write(dades as Uint8Array<ArrayBuffer>).catch(() => {});
	escriptor.close().catch(() => {});
	const lector = flux.readable.getReader();
	const trossos: Uint8Array[] = [];
	let total = 0;
	try {
		for (;;) {
			const { done, value } = await lector.read();
			if (done) break;
			total += value.length;
			if (total > maxBytes) {
				await lector.cancel().catch(() => {});
				return null;
			}
			trossos.push(value);
		}
	} catch {
		return null;
	}
	const sortida = new Uint8Array(total);
	let pos = 0;
	for (const t of trossos) {
		sortida.set(t, pos);
		pos += t.length;
	}
	return sortida;
}

/** Comprimeix amb `deflate-raw` si es pot i surt a compte; si no, desa les dades tal qual. */
export async function comprimeix(bytes: Uint8Array): Promise<Uint8Array> {
	if (teCompressio()) {
		try {
			const comprimit = await transforma(
				new CompressionStream('deflate-raw'),
				bytes,
				Number.MAX_SAFE_INTEGER
			);
			if (comprimit !== null && comprimit.length < bytes.length) {
				return ambCapcalera(CAPCALERA_DEFLATE_RAW, comprimit);
			}
		} catch {
			// Formats no suportats en navegadors antics: es desa sense comprimir.
		}
	}
	return ambCapcalera(CAPCALERA_SENSE_COMPRIMIR, bytes);
}

/**
 * Inversa de `comprimeix`. `null` si està buit, la capçalera és desconeguda, les dades són
 * corruptes o truncades, el resultat supera `maxBytes`, o cal descomprimir i el navegador no té
 * `DecompressionStream`.
 */
export async function descomprimeix(
	bytes: Uint8Array,
	maxBytes: number
): Promise<Uint8Array | null> {
	if (bytes.length === 0) return null;
	const dades = bytes.subarray(1);
	if (bytes[0] === CAPCALERA_SENSE_COMPRIMIR) {
		return dades.length <= maxBytes ? dades.slice() : null;
	}
	if (bytes[0] !== CAPCALERA_DEFLATE_RAW || !teCompressio()) return null;
	try {
		return await transforma(new DecompressionStream('deflate-raw'), dades, maxBytes);
	} catch {
		return null;
	}
}
