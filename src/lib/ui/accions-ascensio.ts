/**
 * Accions d'ascensió amb resposta a la UI (registre optimista, docs/05 §1): desa a IndexedDB,
 * mostra el toast amb el segell "+1 → n/100" i "Desfés". Mai no espera la xarxa.
 * Importa Dexie: només es fa servir des de la zona app i del full carregat sota demanda.
 */
import {
	actualitzarAscensio,
	afegirAscensio,
	esborrarAscensio,
	llistarAscensions,
	restaurarAscensio,
	type NovaAscensio
} from '$lib/data/ascensions';
import { CIMS } from '$lib/data/catalog';
import { avuiLocal, calcularEstatRepte, type Ascensio } from '$lib/domain';
import { demanarPersistencia } from '$lib/platform/emmagatzematge';
import { installacio } from '$lib/platform/installacio.svelte';
import { m } from '$lib/paraglide/messages';
import { marcadorRepte } from './registre';
import { toasts } from './toast.svelte';

/** Durada dels toasts amb "Desfés" (es pausa amb el ratolí a sobre o el focus a dins). */
const DURADA_DESFES = 8000;

const nomCim = (cimId: number) => CIMS.find((c) => c.id === cimId)?.nom ?? '';

/**
 * Primer botó de la fila de l'ascensió `id` (historial o progrés), si és a la pàgina. La llista
 * viva s'actualitza de manera asíncrona (liveQuery): s'espera uns quants fotogrames.
 */
async function filaAscensio(id: string): Promise<HTMLElement | null> {
	if (typeof document === 'undefined') return null;
	const selector = `[data-ascensio="${CSS.escape(id)}"]`;
	for (let i = 0; i < 30; i++) {
		const fila = document.querySelector<HTMLElement>(selector);
		if (fila) return fila.querySelector<HTMLElement>('button, a') ?? null;
		await new Promise((r) => requestAnimationFrame(r));
	}
	return null;
}

/** Desfà i retorna on ha d'anar el focus (la fila afectada, si n'hi ha; si no, `null`). */
async function desfer(
	accio: () => Promise<unknown>,
	focusId?: string
): Promise<HTMLElement | null> {
	try {
		await accio();
		toasts.show(m.toast_undone());
		return focusId ? await filaAscensio(focusId) : null;
	} catch {
		toasts.show(m.register_error_generic(), { tone: 'error' });
		return null;
	}
}

/**
 * Registra una ascensió nova. Toast amb el segell i el comptador del carnet abans → després
 * (les repeticions i les no essencials posteriors al 2019 no sumen). Després de la primera
 * ascensió demana emmagatzematge persistent. Després d'un registre (mai en entrar) es pot oferir
 * instal·lar l'app (`AvisInstallacio`).
 * @throws ErrorValidacio (el formulari ja valida abans)
 */
export async function registrarAscensio(nova: NovaAscensio): Promise<Ascensio> {
	const abans = await llistarAscensions();
	const desada = await afegirAscensio(nova);
	if (abans.length === 0) void demanarPersistencia();

	const avui = avuiLocal();
	const mAbans = marcadorRepte(calcularEstatRepte(abans, CIMS, avui));
	const mDespres = marcadorRepte(calcularEstatRepte([...abans, desada], CIMS, avui));
	const delta = Math.max(0, mDespres.comptador - mAbans.comptador);
	const cim = nomCim(desada.cimId);

	toasts.show(
		delta > 0 ? m.register_toast_saved({ cim }) : m.register_toast_saved_nocount({ cim }),
		{
			tone: 'success',
			duration: DURADA_DESFES,
			segell: { delta, count: mDespres.comptador, target: mDespres.objectiu },
			sr: m.register_toast_count({
				count: String(mDespres.comptador),
				target: String(mDespres.objectiu)
			}),
			action: { label: m.toast_undo(), run: () => desfer(() => esborrarAscensio(desada.id)) }
		}
	);
	installacio.despresDeRegistrar();
	return desada;
}

/** Desa els canvis d'una ascensió. "Desfés" hi torna els valors anteriors. */
export async function editarAscensio(previ: Ascensio, canvis: NovaAscensio): Promise<Ascensio> {
	const desada = await actualitzarAscensio(previ.id, { ...canvis, nota: canvis.nota ?? '' });
	toasts.show(m.register_toast_updated(), {
		tone: 'success',
		duration: DURADA_DESFES,
		action: {
			label: m.toast_undo(),
			run: () =>
				desfer(
					() =>
						actualitzarAscensio(previ.id, {
							cimId: previ.cimId,
							data: previ.data,
							metode: previ.metode,
							nota: previ.nota ?? ''
						}),
					previ.id
				)
		}
	});
	return desada;
}

/** Esborra una ascensió (làpida) amb "Desfés". */
export async function esborrarAmbDesfer(a: Ascensio): Promise<void> {
	try {
		await esborrarAscensio(a.id);
	} catch {
		toasts.show(m.register_error_generic(), { tone: 'error' });
		return;
	}
	toasts.show(m.history_deleted({ cim: nomCim(a.cimId) }), {
		duration: DURADA_DESFES,
		action: { label: m.toast_undo(), run: () => desfer(() => restaurarAscensio(a.id), a.id) }
	});
}
