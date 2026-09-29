/**
 * Analitzador segur del text en línia del contingut editorial (`src/lib/content/types.ts`).
 *
 * Converteix el text en segments de dades que el component `TextEnLinia.svelte` pinta amb
 * elements de Svelte (sempre escapats): **mai es genera HTML** a partir del text.
 *
 * Sintaxi admesa (la resta es mostra tal qual):
 * - `[text](/cami/intern)`: enllaç intern (camí deslocalitzat; el component el localitza).
 * - `[text](https://…)`: enllaç extern (pestanya nova, `rel="external noopener"`).
 * - `**negreta**`: pot contenir enllaços i marcadors pendents, però no una altra negreta.
 * - `[PENDENT: …]` / `[PENDIENTE: …]` sense destí: marcador de contingut pendent de confirmar.
 *
 * Un destí que no sigui un camí intern (`/…`, no `//…`) ni una URL `https://` vàlida no crea
 * cap enllaç: el fragment sencer es queda com a text (evita `javascript:`, `data:`, `http:`…).
 */

export type SegmentSimple =
	| { tipus: 'text'; text: string }
	| { tipus: 'enllac'; text: string; desti: string; extern: boolean }
	| { tipus: 'pendent'; text: string };

export type Segment = SegmentSimple | { tipus: 'negreta'; fills: SegmentSimple[] };

/** Camí intern deslocalitzat: comença per una sola `/`, sense espais ni caràcters de control. */
const INTERN_RE = /^\/(?!\/)[^\s\\]*$/;

/** `[etiqueta](destí)`: etiqueta sense `[`/`]`; destí sense espais (admet un nivell de parèntesis). */
const ENLLAC_RE = /\[([^[\]\n]+)\]\(((?:[^\s()]|\([^\s()]*\))+)\)/y;

/** `[PENDENT: …]` o `[PENDIENTE: …]` (sense destí al darrere). */
const PENDENT_RE = /\[(?:PENDENT|PENDIENTE):[^[\]\n]*\]/y;

/** Destí extern acceptat: URL absoluta `https:` amb host. */
export function esUrlExterna(desti: string): boolean {
	if (!desti.startsWith('https://')) return false;
	try {
		const url = new URL(desti);
		return url.protocol === 'https:' && url.hostname.length > 0;
	} catch {
		return false;
	}
}

export function esCamiIntern(desti: string): boolean {
	return INTERN_RE.test(desti);
}

function afegirText(segments: SegmentSimple[], text: string) {
	if (!text) return;
	const darrer = segments.at(-1);
	if (darrer?.tipus === 'text') darrer.text += text;
	else segments.push({ tipus: 'text', text });
}

/** Enllaços i marcadors pendents (sense negreta). */
function analitzarSimple(text: string): SegmentSimple[] {
	const segments: SegmentSimple[] = [];
	let i = 0;
	while (i < text.length) {
		const obre = text.indexOf('[', i);
		if (obre === -1) {
			afegirText(segments, text.slice(i));
			break;
		}
		afegirText(segments, text.slice(i, obre));

		ENLLAC_RE.lastIndex = obre;
		const enllac = ENLLAC_RE.exec(text);
		if (enllac) {
			const [sencer, etiqueta, desti] = enllac;
			const extern = esUrlExterna(desti);
			if (extern || esCamiIntern(desti)) {
				segments.push({ tipus: 'enllac', text: etiqueta, desti, extern });
			} else {
				afegirText(segments, sencer);
			}
			i = obre + sencer.length;
			continue;
		}

		PENDENT_RE.lastIndex = obre;
		const pendent = PENDENT_RE.exec(text);
		if (pendent) {
			segments.push({ tipus: 'pendent', text: pendent[0] });
			i = obre + pendent[0].length;
			continue;
		}

		afegirText(segments, '[');
		i = obre + 1;
	}
	return segments;
}

/** Analitza un text en línia i en retorna els segments (text pla, enllaços, negretes, pendents). */
export function analitzarTextEnLinia(text: string): Segment[] {
	const segments: Segment[] = [];
	const parts = text.split('**');
	// Un nombre parell de parts vol dir un `**` sense tancar: l'últim es queda com a text.
	const tancades = parts.length % 2 === 1 ? parts.length : parts.length - 1;
	for (let n = 0; n < parts.length; n++) {
		const part = parts[n];
		const senar = n % 2 === 1;
		const tancada = senar && n < tancades;
		if (tancada && part.trim()) {
			segments.push({ tipus: 'negreta', fills: analitzarSimple(part) });
			continue;
		}
		// Negreta buida (`****`) o `**` sense parella: es mostren els asteriscs tal qual.
		const cru = !senar ? part : tancada ? `**${part}**` : `**${part}`;
		for (const s of analitzarSimple(cru)) {
			const darrer = segments.at(-1);
			if (s.tipus === 'text' && darrer?.tipus === 'text') darrer.text += s.text;
			else segments.push({ ...s });
		}
	}
	return segments;
}
