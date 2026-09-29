/**
 * Dades del titular del web (decisió de l'usuari, bloc 3c). Es fan servir a l'avís legal, la
 * privadesa, "Sobre el projecte" i la metodologia (canal per reportar errors).
 *
 * El projecte no té activitat econòmica: no es publiquen NIF ni domicili (art. 10 LSSI-CE).
 * Si n'hi ha mai (publicitat, subscripcions) o arriben els comptes (fase 5), cal revisar-ho.
 */
export const TITULAR = {
	nom: 'Carnet de Cims',
	correu: 'hola@carnetdecims.cat',
	web: 'carnetdecims.cat'
} as const;
