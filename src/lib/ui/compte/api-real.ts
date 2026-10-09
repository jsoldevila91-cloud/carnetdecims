/**
 * Implementació real del contracte de la UI del compte. Importa Supabase: només des de la zona
 * `/app` (SPA) o amb `import()` diferit.
 */
import {
	compteDisponible,
	completarEntradaDesDeUrl,
	entrarAmbEmail,
	esborrarCompte,
	exportarDadesCompte,
	sessio,
	sortir,
	verificarCodi
} from '$lib/data/compte';
import { estatSync, resoldreConflicteCompte, sincronitzarAra } from '$lib/data/sync';
import type { ApiCompte } from './api';

export const apiReal: ApiCompte = {
	sessio,
	estatSync,
	compteDisponible,
	entrarAmbEmail,
	verificarCodi,
	completarEntradaDesDeUrl: () => completarEntradaDesDeUrl(),
	sortir: () => sortir(),
	esborrarCompte,
	exportarDadesCompte,
	sincronitzarAra,
	resoldreConflicteCompte
};
