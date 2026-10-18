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
		id: '2026-10-18-detalls-utils',
		data: '2026-10-18',
		titol: {
			ca: 'Comparteix cada ascensió i obre el mapa des de la fitxa',
			es: 'Comparte cada ascensión y abre el mapa desde la ficha'
		},
		punts: {
			ca: [
				'Comparteix una ascensió: a l’historial i al detall de cada segell, el botó «Comparteix» crea una imatge amb el cim, l’altitud, la comarca i el dia, a punt per a WhatsApp o les xarxes. Es genera al teu mòbil i no hi surten ni les notes ni els companys.',
				'Mapa interactiu des de la fitxa: toca el mapa de qualsevol cim i s’obre el mapa interactiu centrat en aquell cim.',
				'Llista de cims més útil: icona del temps que fa ara a cada cim i un avís als cims amb una restricció d’accés vigent avui.'
			],
			es: [
				'Comparte una ascensión: en el historial y en el detalle de cada sello, el botón «Compartir» crea una imagen con la cima, la altitud, la comarca y el día, lista para WhatsApp o las redes. Se genera en tu móvil y no aparecen ni las notas ni los compañeros.',
				'Mapa interactivo desde la ficha: toca el mapa de cualquier cima y se abre el mapa interactivo centrado en esa cima.',
				'Lista de cimas más útil: icono del tiempo que hace ahora en cada cima y un aviso en las cimas con una restricción de acceso vigente hoy.'
			]
		}
	},
	{
		id: '2026-10-18-compartir-validar',
		data: '2026-10-18',
		titol: {
			ca: 'Comparteix el carnet i prepara la validació',
			es: 'Comparte el carnet y prepara la validación'
		},
		punts: {
			ca: [
				'Comparteix el carnet: una imatge amb els segells, el nivell i les medalles per enviar per WhatsApp o penjar a les xarxes, generada al teu mòbil.',
				'Enllaç de només lectura: qui l’obri veu el teu carnet sense compte. Només porta els cims i les dates (i el nom, si el poses).',
				'Prepara la validació: la llista de les ascensions de l’any amb avisos (restriccions, repeticions, més de 100), en CSV o per imprimir i desar en PDF. Recorda que valida la FEEC a través de la teva entitat.'
			],
			es: [
				'Comparte el carnet: una imagen con los sellos, el nivel y las medallas para enviar por WhatsApp o subir a las redes, generada en tu móvil.',
				'Enlace de solo lectura: quien lo abra ve tu carnet sin cuenta. Solo lleva las cimas y las fechas (y el nombre, si lo pones).',
				'Prepara la validación: la lista de las ascensiones del año con avisos (restricciones, repeticiones, más de 100), en CSV o para imprimir y guardar en PDF. Recuerda que valida la FEEC a través de tu entidad.'
			]
		}
	},
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
