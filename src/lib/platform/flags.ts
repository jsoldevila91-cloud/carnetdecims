/**
 * Flags públics del build, sense dependències (ni supabase-js): es poden importar des de les
 * pàgines públiques sense afegir el client del compte al paquet. `supabase.ts` els reexporta.
 */
import { PUBLIC_GOOGLE_AUTH } from '$env/static/public';

/**
 * Valor d'un flag públic del build: només `true`, `1`, `yes` i `on` l'activen; buit, absent o
 * qualsevol altre valor el deixen desactivat.
 */
export function flagActiu(valor: string | undefined | null): boolean {
	const v = valor?.trim().toLowerCase();
	return v === 'true' || v === '1' || v === 'yes' || v === 'on';
}

/**
 * Entrada amb Google activada en aquest build (`PUBLIC_GOOGLE_AUTH`, per defecte desactivada).
 * Només diu que el build l'ofereix; cal també el proveïdor Google configurat a Supabase.
 * També decideix la variant de la política de privadesa (`content/privacitat.ts`).
 */
export const googleAuthActiu: boolean = flagActiu(PUBLIC_GOOGLE_AUTH);
