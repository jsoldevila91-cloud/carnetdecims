/**
 * Novetats de cada versió publicada (bloc R2). Una entrada per publicació amb novetats visibles,
 * **de la més nova a la més antiga**. Els textos ca/es són aquí, com la resta de `content/`.
 *
 * Com es mostren (`ui/Novetats.svelte`): el navegador desa a `localStorage`
 * (`CLAU_NOVETATS`) l'`id` de l'última novetat vista. En carregar el web (també després que el
 * service worker activi una versió nova), si hi ha entrades més noves que la vista, s'obre un
 * full amb aquestes. Qui no té res desat i no havia fet servir mai el web (usuari nou) no la
 * veu: només es marca com a vista l'última.
 *
 * Afegir-ne una: posar-la al principi de `NOVETATS` amb un `id` nou i únic (`AAAA-MM-DD-nom`).
 */
export interface Novetat {
	/** Identificador únic i estable (`AAAA-MM-DD-nom`). */
	id: string;
	/** Data de publicació (`AAAA-MM-DD`). */
	data: string;
	titol: { ca: string; es: string };
	punts: { ca: readonly string[]; es: readonly string[] };
}

export const CLAU_NOVETATS = 'carnetdecims:novetat-vista';

export const NOVETATS: readonly Novetat[] = Object.freeze([
	{
		id: '2026-10-17-reptes',
		data: '2026-10-17',
		titol: { ca: 'Reptes, medalles i el teu proper cim', es: 'Retos, medallas y tu próxima cima' },
		punts: {
			ca: [
				'Nova secció Reptes: a més del repte 100 Cims, Totes les comarques, Les 4 estacions, «12 mesos, 12 cims», el Repte infantil i els massissos, amb el progrés i el que et falta.',
				'Medalles: quan completes un repte en guanyes una, amb la data. Les veus a les teves estadístiques.',
				'El teu proper cim: tres cims pendents recomanats per al cap de setmana, segons la distància des del teu municipi, l’època de l’any, la dificultat habitual i la previsió del temps.'
			],
			es: [
				'Nueva sección Retos: además del reto 100 Cims, Todas las comarcas, Las 4 estaciones, «12 meses, 12 cimas», el Reto infantil y los macizos, con el progreso y lo que te falta.',
				'Medallas: cuando completas un reto ganas una, con la fecha. Las ves en tus estadísticas.',
				'Tu próxima cima: tres cimas pendientes recomendadas para el fin de semana, según la distancia desde tu municipio, la época del año, la dificultad habitual y la previsión del tiempo.'
			]
		}
	}
] satisfies Novetat[]);

/**
 * Novetats que cal mostrar.
 * - `vista`: id desat (o `null` si no n'hi ha).
 * - `usuariExistent`: sense id desat, si hi ha indicis que ja havia fet servir el web abans
 *   d'existir les novetats (altres preferències desades). Un usuari nou no en veu cap.
 * Si l'id desat ja no existeix (entrada retirada), no es mostra res.
 */
export function novetatsPerMostrar(
	vista: string | null,
	usuariExistent: boolean,
	novetats: readonly Novetat[] = NOVETATS
): Novetat[] {
	if (vista === null) return usuariExistent ? novetats.slice(0, 1) : [];
	const i = novetats.findIndex((n) => n.id === vista);
	return i <= 0 ? [] : novetats.slice(0, i);
}

/** Id de la novetat més recent (el que es desa en tancar el full), o `null` si no n'hi ha. */
export function darreraNovetat(novetats: readonly Novetat[] = NOVETATS): string | null {
	return novetats[0]?.id ?? null;
}
