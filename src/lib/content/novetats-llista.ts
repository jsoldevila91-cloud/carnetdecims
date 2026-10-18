/**
 * Llista de novetats (bloc R2), sense dependències de l'entorn: la importen `novetats.ts` (que hi
 * aplica els flags del build) i els tests E2E (Playwright, fora de Vite, no resolen `$env`).
 *
 * Una entrada per publicació amb novetats visibles, **de la més nova a la més antiga**. Afegir-ne
 * una: posar-la al principi de `TOTES_LES_NOVETATS` amb un `id` nou i únic (`AAAA-MM-DD-nom`).
 *
 * `nomesSi`: l'entrada només es mostra si el build té actiu aquest flag (funció encara
 * desactivada). En activar el flag a producció, cal posar a l'entrada l'`id` i la `data`
 * d'activació i deixar-la la primera, perquè la vegin també qui ja ha vist les anteriors.
 */
export interface Novetat {
	/** Identificador únic i estable (`AAAA-MM-DD-nom`). */
	id: string;
	/** Data de publicació (`AAAA-MM-DD`). */
	data: string;
	titol: { ca: string; es: string };
	punts: { ca: readonly string[]; es: readonly string[] };
	/** Flag del build que ha d'estar actiu perquè l'entrada es mostri (absent: sempre). */
	nomesSi?: FlagNovetat;
}

/** Flags del build que poden condicionar una novetat (`platform/flags.ts`). */
export type FlagNovetat = 'contrasenya';

export const TOTES_LES_NOVETATS: readonly Novetat[] = Object.freeze([
	{
		// Només amb PUBLIC_PASSWORD_AUTH actiu (activat i publicat el 2026-10-18).
		id: '2026-10-18-contrasenya',
		data: '2026-10-18',
		nomesSi: 'contrasenya',
		titol: {
			ca: 'Entra amb el correu i una contrasenya',
			es: 'Entra con tu correo y una contraseña'
		},
		punts: {
			ca: [
				'Ara també pots entrar al compte amb el teu correu i una contrasenya, sense haver d’esperar cap correu. És opcional: Google i l’enllaç o el codi per correu continuen funcionant igual.',
				'Si ja tens compte, pots afegir-hi una contrasenya des del teu perfil. Si l’oblides, te n’enviem un enllaç per correu per triar-ne una de nova.',
				'La contrasenya es desa xifrada: nosaltres no la veiem mai. Si vols, el navegador la pot recordar perquè entrar sigui encara més ràpid.'
			],
			es: [
				'Ahora también puedes entrar en la cuenta con tu correo y una contraseña, sin tener que esperar ningún correo. Es opcional: Google y el enlace o el código por correo siguen funcionando igual.',
				'Si ya tienes cuenta, puedes añadirle una contraseña desde tu perfil. Si la olvidas, te enviamos un enlace por correo para elegir una nueva.',
				'La contraseña se guarda cifrada: nosotros no la vemos nunca. Si quieres, el navegador puede recordarla para que entrar sea aún más rápido.'
			]
		}
	},
	{
		id: '2026-10-18-sense-duplicats',
		data: '2026-10-18',
		titol: {
			ca: 'Sense ascensions duplicades',
			es: 'Sin ascensiones duplicadas'
		},
		punts: {
			ca: [
				'Si apuntes la mateixa ascensió (el mateix cim, el mateix dia i amb el mateix mètode) al mòbil i a l’ordinador, en sincronitzar el compte es desa una sola vegada i se n’ajunten les notes i els companys.',
				'Si importes una còpia que ja havies importat, o la d’un altre compte, les ascensions que ja tens no es dupliquen.',
				'Si un canvi no es pot desar al núvol, ara t’ho diem clarament: queda desat en aquest dispositiu i en pots descarregar una còpia.'
			],
			es: [
				'Si apuntas la misma ascensión (la misma cima, el mismo día y con el mismo método) en el móvil y en el ordenador, al sincronizar la cuenta se guarda una sola vez y se juntan las notas y los compañeros.',
				'Si importas una copia que ya habías importado, o la de otra cuenta, las ascensiones que ya tienes no se duplican.',
				'Si un cambio no se puede guardar en la nube, ahora te lo decimos claramente: queda guardado en este dispositivo y puedes descargar una copia.'
			]
		}
	},
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
 * Entrades que es mostren amb aquests flags del build: les que no tenen `nomesSi` i les que tenen
 * el seu flag actiu. Un flag absent compta com a desactivat. Manté l'ordre.
 */
export function novetatsActives(
	novetats: readonly Novetat[],
	flags: Partial<Record<FlagNovetat, boolean>>
): Novetat[] {
	return novetats.filter((n) => n.nomesSi === undefined || flags[n.nomesSi] === true);
}
