/**
 * Implementació real del contracte de la UI del compte. Importa Supabase: només des de la zona
 * `/app` (SPA) o amb `import()` diferit.
 */
import { exportarDades } from '$lib/data/ascensions';
import {
	canviarContrasenya,
	compteDisponible,
	completarEntradaDesDeUrl,
	contrasenyaDisponible,
	crearCompteAmbContrasenya,
	demanarRestabliment,
	entrarAmbContrasenya,
	entrarAmbEmail,
	entrarAmbGoogle,
	esborrarCompte,
	exportarDadesCompte,
	googleDisponible,
	modeRecuperacio,
	reenviarConfirmacio,
	sessio,
	sortir,
	sortirModeRecuperacio,
	verificarCodi
} from '$lib/data/compte';
import { estatSync, resoldreConflicteCompte, sincronitzarAra } from '$lib/data/sync';
import type { ApiCompte } from './api';

export const apiReal: ApiCompte = {
	sessio,
	estatSync,
	compteDisponible,
	entrarAmbEmail,
	googleDisponible: () => googleDisponible,
	entrarAmbGoogle,
	verificarCodi,
	contrasenyaDisponible: () => contrasenyaDisponible,
	crearCompteAmbContrasenya,
	entrarAmbContrasenya,
	reenviarConfirmacio,
	demanarRestabliment,
	canviarContrasenya,
	modeRecuperacio,
	sortirModeRecuperacio,
	completarEntradaDesDeUrl: () => completarEntradaDesDeUrl(),
	sortir: () => sortir(),
	esborrarCompte,
	exportarDadesCompte,
	exportarDadesLocals: () => exportarDades(),
	sincronitzarAra,
	resoldreConflicteCompte
};
