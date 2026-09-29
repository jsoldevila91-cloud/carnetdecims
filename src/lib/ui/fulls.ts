/**
 * Fulls inferiors com a estat de ruta (shallow routing, docs/05 §1): el botó enrere del mòbil
 * els tanca. Amb clic modificat (pestanya nova) o sense JS, l'enllaç porta a la pàgina completa.
 */
import { pushState } from '$app/navigation';
import { page } from '$app/state';
import { href } from '$lib/i18n';

/** Clic principal sense modificadors (els altres obren l'enllaç com sempre). */
export function esClicSimple(event: MouseEvent): boolean {
	return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

/** URL de la pàgina de registre, amb el cim preseleccionat si n'hi ha. */
export function registrarHref(cim?: string): string {
	return cim ? `${href('/app/registrar')}?cim=${encodeURIComponent(cim)}` : href('/app/registrar');
}

/** `onclick` d'un enllaç a /app/registrar: obre el full de registre. */
export function obrirRegistre(event: MouseEvent, cim?: string): void {
	if (!esClicSimple(event)) return;
	event.preventDefault();
	if (page.state.sheet) return;
	pushState(registrarHref(cim), cim ? { sheet: 'registrar', cim } : { sheet: 'registrar' });
}

/** Obre el full d'edició d'una ascensió (mateixa URL). */
export function obrirEdicio(id: string): void {
	if (page.state.sheet) return;
	pushState('', { sheet: 'editar', ascensio: id });
}
