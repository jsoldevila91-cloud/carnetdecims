/**
 * Estat de la pàgina del carnet compartit (`/carnet`, bloc R3) a partir del resultat de
 * `llegeixEnllac` (`$lib/data/compartir`). Funció pura (sense DOM).
 */
import {
	esErrorCarnet,
	type CarnetCompartit,
	type ErrorCarnetCompartit
} from '$lib/domain/carnet-compartit';
import { m } from '$lib/paraglide/messages';

export type EstatCarnetCompartit =
	{ tipus: 'carregant' } | { tipus: 'error' } | { tipus: 'ok'; carnet: CarnetCompartit };

/** Un enllaç il·legible (o sense cap entrada vàlida ni descartada) és un error per a la UI. */
export function estatDeLectura(
	resultat: CarnetCompartit | ErrorCarnetCompartit
): EstatCarnetCompartit {
	if (esErrorCarnet(resultat)) return { tipus: 'error' };
	return { tipus: 'ok', carnet: resultat };
}

/**
 * La preposició "de" s'apostrofa davant del nom: comença per vocal o per h muda + vocal
 * ("Carnet d'Inesa", "d'Úrsula", "d'Helena"), però no davant de i/u semivocals (i, u, hi, hu
 * seguides de vocal: "Carnet de Iu", "de Iolanda", "de Huang").
 */
export function comencaPerVocal(nom: string): boolean {
	const net = nom.normalize('NFC').trim();
	if (/^h?[iu][aeiouàèéíòóú]/i.test(net)) return false;
	return /^h?[aeiouàèéíïòóúü]/i.test(net);
}

/** Títol del carnet: "Carnet d'Inesa", "Carnet de Pere" o, sense nom, "Un carnet compartit". */
export function titolCarnetCompartit(nom: string | undefined): string {
	const net = nom?.trim();
	if (!net) return m.shared_title();
	return comencaPerVocal(net)
		? m.shared_title_named_vowel({ name: net })
		: m.shared_title_named({ name: net });
}
