/**
 * Comarques i zones que fa servir la llista d'essencials de la FEEC (PDF públic).
 * Dades fàctiques: noms oficials de les comarques (Llei 1/2019 i posteriors) i el codi
 * de comarca de l'ICGC (el que retorna el Geocodificador com a `id_comarca`).
 * Andorra i Catalunya Nord no tenen codi ICGC.
 */
import type { Article } from '../../src/lib/domain/toponims.ts';
import type { Zona } from '../../src/lib/domain/types.ts';

export interface ComarcaDef {
	slug: string;
	/** Nom sense article, com a títol ("Alt Camp"). */
	nom: string;
	article: Article;
	zona: Zona;
	/** `id_comarca` de l'ICGC (1..43) o `null` fora de Catalunya. */
	codiIcgc: number | null;
	/** Noms amb què l'ICGC anomena la comarca (per comparar amb el geocodificador). */
	nomIcgc?: string;
}

export const COMARQUES: ComarcaDef[] = [
	{ slug: 'alt-camp', nom: 'Alt Camp', article: "l'", zona: 'catalunya', codiIcgc: 1 },
	{ slug: 'alt-emporda', nom: 'Alt Empordà', article: "l'", zona: 'catalunya', codiIcgc: 2 },
	{ slug: 'alt-penedes', nom: 'Alt Penedès', article: "l'", zona: 'catalunya', codiIcgc: 3 },
	{ slug: 'alt-urgell', nom: 'Alt Urgell', article: "l'", zona: 'catalunya', codiIcgc: 4 },
	{ slug: 'alta-ribagorca', nom: 'Alta Ribagorça', article: "l'", zona: 'catalunya', codiIcgc: 5 },
	{ slug: 'anoia', nom: 'Anoia', article: "l'", zona: 'catalunya', codiIcgc: 6 },
	{ slug: 'bages', nom: 'Bages', article: 'el', zona: 'catalunya', codiIcgc: 7 },
	{ slug: 'baix-camp', nom: 'Baix Camp', article: 'el', zona: 'catalunya', codiIcgc: 8 },
	{ slug: 'baix-ebre', nom: 'Baix Ebre', article: 'el', zona: 'catalunya', codiIcgc: 9 },
	{ slug: 'baix-emporda', nom: 'Baix Empordà', article: 'el', zona: 'catalunya', codiIcgc: 10 },
	{
		slug: 'baix-llobregat',
		nom: 'Baix Llobregat',
		article: 'el',
		zona: 'catalunya',
		codiIcgc: 11
	},
	{ slug: 'baix-penedes', nom: 'Baix Penedès', article: 'el', zona: 'catalunya', codiIcgc: 12 },
	{ slug: 'barcelones', nom: 'Barcelonès', article: 'el', zona: 'catalunya', codiIcgc: 13 },
	{ slug: 'bergueda', nom: 'Berguedà', article: 'el', zona: 'catalunya', codiIcgc: 14 },
	{ slug: 'cerdanya', nom: 'Cerdanya', article: 'la', zona: 'catalunya', codiIcgc: 15 },
	{
		slug: 'conca-de-barbera',
		nom: 'Conca de Barberà',
		article: 'la',
		zona: 'catalunya',
		codiIcgc: 16
	},
	{ slug: 'garraf', nom: 'Garraf', article: 'el', zona: 'catalunya', codiIcgc: 17 },
	{ slug: 'garrigues', nom: 'Garrigues', article: 'les', zona: 'catalunya', codiIcgc: 18 },
	{ slug: 'garrotxa', nom: 'Garrotxa', article: 'la', zona: 'catalunya', codiIcgc: 19 },
	{ slug: 'girones', nom: 'Gironès', article: 'el', zona: 'catalunya', codiIcgc: 20 },
	{ slug: 'maresme', nom: 'Maresme', article: 'el', zona: 'catalunya', codiIcgc: 21 },
	{ slug: 'moianes', nom: 'Moianès', article: 'el', zona: 'catalunya', codiIcgc: 42 },
	{ slug: 'montsia', nom: 'Montsià', article: 'el', zona: 'catalunya', codiIcgc: 22 },
	{ slug: 'noguera', nom: 'Noguera', article: 'la', zona: 'catalunya', codiIcgc: 23 },
	{ slug: 'osona', nom: 'Osona', article: '', zona: 'catalunya', codiIcgc: 24 },
	{ slug: 'pallars-jussa', nom: 'Pallars Jussà', article: 'el', zona: 'catalunya', codiIcgc: 25 },
	{
		slug: 'pallars-sobira',
		nom: 'Pallars Sobirà',
		article: 'el',
		zona: 'catalunya',
		codiIcgc: 26
	},
	{ slug: 'pla-d-urgell', nom: "Pla d'Urgell", article: 'el', zona: 'catalunya', codiIcgc: 27 },
	{
		slug: 'pla-de-l-estany',
		nom: "Pla de l'Estany",
		article: 'el',
		zona: 'catalunya',
		codiIcgc: 28
	},
	{ slug: 'priorat', nom: 'Priorat', article: 'el', zona: 'catalunya', codiIcgc: 29 },
	{ slug: 'ribera-d-ebre', nom: "Ribera d'Ebre", article: 'la', zona: 'catalunya', codiIcgc: 30 },
	{ slug: 'ripolles', nom: 'Ripollès', article: 'el', zona: 'catalunya', codiIcgc: 31 },
	{ slug: 'segarra', nom: 'Segarra', article: 'la', zona: 'catalunya', codiIcgc: 32 },
	{ slug: 'segria', nom: 'Segrià', article: 'el', zona: 'catalunya', codiIcgc: 33 },
	{ slug: 'selva', nom: 'Selva', article: 'la', zona: 'catalunya', codiIcgc: 34 },
	{ slug: 'solsones', nom: 'Solsonès', article: 'el', zona: 'catalunya', codiIcgc: 35 },
	{ slug: 'tarragones', nom: 'Tarragonès', article: 'el', zona: 'catalunya', codiIcgc: 36 },
	{ slug: 'terra-alta', nom: 'Terra Alta', article: 'la', zona: 'catalunya', codiIcgc: 37 },
	{ slug: 'urgell', nom: 'Urgell', article: "l'", zona: 'catalunya', codiIcgc: 38 },
	{
		slug: 'val-d-aran',
		nom: "Val d'Aran",
		article: 'la',
		zona: 'catalunya',
		codiIcgc: 39,
		nomIcgc: 'Aran'
	},
	{
		slug: 'valles-occidental',
		nom: 'Vallès Occidental',
		article: 'el',
		zona: 'catalunya',
		codiIcgc: 40
	},
	{
		slug: 'valles-oriental',
		nom: 'Vallès Oriental',
		article: 'el',
		zona: 'catalunya',
		codiIcgc: 41
	},
	{ slug: 'andorra', nom: 'Andorra', article: '', zona: 'andorra', codiIcgc: null },
	{
		slug: 'catalunya-nord',
		nom: 'Catalunya Nord',
		article: 'la',
		zona: 'catalunya-nord',
		codiIcgc: null
	}
];
