/**
 * Resolucions manuals dels casos que l'emparellament automàtic no resol bé.
 *
 * Preferència: en lloc d'escriure coordenades a mà, s'assenyala el registre concret d'una
 * font oberta (topònim ICGC, node OSM, element Wikidata, POI IGN). Així la dada continua
 * sent de la font (amb la seva llicència) i el build és reproduïble. Només quan cap font
 * no té el cim es posen coordenades/altitud amb `font: 'manual'` i una nota de com s'ha
 * comprovat. Tota entrada porta `nota` (surt a l'informe).
 *
 * Clau: `slug` del cim.
 */
import type { Confianca, FontCamp, RestriccioAcces } from '../../src/lib/domain/types.ts';

const RESTRICCIONS_FEEC = 'https://www.feec.cat/activitats/100-cims/cims-amb-restriccions-dacces/';

export interface ResolucioManual {
	/** Tria el topònim ICGC amb aquest nom exacte (i, opcionalment, aquest municipi). */
	icgc?: { nom: string; municipi?: string };
	/** Tria aquest node OSM (natural=peak) com a punt i/o altitud declarada. */
	osm?: number;
	/** Tria aquest element de Wikidata per validar/altitud. */
	wikidata?: string;
	/** Usa el registre `osm`/`wikidata` indicat com a coordenada principal. */
	primari?: 'osm' | 'wikidata';
	/** Tria aquest POI de l'IGN (cleabs). */
	ign?: string;
	/** Coordenades posades a mà (últim recurs). */
	coord?: {
		lat: number;
		lon: number;
		font: FontCamp & { font: 'icgc' | 'ign' | 'osm' | 'wikidata' | 'manual' };
	};
	/** Altitud posada a mà (últim recurs). */
	altitud?: { valor: number; font: FontCamp };
	/** Reassigna la comarca del PDF quan l'ICGC en diu una altra (prevaleix l'ICGC). */
	comarca?: string;
	/** Restriccions d'accés vigents (font: pàgina pública de restriccions de la FEEC). */
	restriccions?: RestriccioAcces[];
	/** Força la confiança (p. ej. baixa si no s'ha pogut verificar). */
	confianca?: Confianca;
	nota: string;
}

export const MANUAL: Record<string, ResolucioManual> = {
	'pic-d-enclar': {
		icgc: { nom: 'Bony de la Pica' },
		nota:
			'El PDF diu "Pic d\'Enclar (Bony de la Pica)". Són dos cims diferents (~1 km): el Bony de la Pica ' +
			"(2.405 m, fronterer Alt Urgell–Andorra) i el Pic d'Enclar (2.383 m). Es tria el Bony de la Pica: és " +
			'el que toca l\'Alt Urgell i la Viquipèdia (article "Bony de la Pica", consultat 2026-09-28) diu que ' +
			'és al llistat dels 100 Cims. Confirmar.'
	},
	'sant-jeroni': {
		icgc: { nom: 'Sant Jeroni', municipi: 'Marganell' },
		nota:
			'Homònim a Sant Pere de Riudebitlles (Alt Penedès). Es tria Sant Jeroni de Montserrat (sostre del ' +
			"massís, límit Bages–Anoia), coherent amb l'assignació a l'Anoia."
	},
	montcau: {
		icgc: { nom: 'Montcau', municipi: 'Sant Llorenç Savall' },
		nota:
			'Homònim "el Montcau" a Montserrat (Monistrol, Bages). Es tria el Montcau de Sant Llorenç del Munt ' +
			'(límit Mura, Bages – Sant Llorenç Savall, Vallès Occidental), el cim conegut com a Montcau.'
	},
	'el-castellot': {
		icgc: { nom: 'el Castellot', municipi: 'Castellví de la Marca' },
		nota:
			"Homònim a Sant Pere de Ribes (Garraf, MDT 198 m). Es tria el de Castellví de la Marca (465 m), l'únic " +
			"dins l'Alt Penedès i corroborat per OSM i Wikidata."
	},
	vulturo: {
		icgc: { nom: 'el Vulturó', municipi: 'Josa i Tuixén' },
		nota: 'Homònim a Odèn (Solsonès). Es tria el Vulturó de la serra del Cadí (Alt Urgell, 2.649 m).'
	},
	'mont-roig': {
		icgc: { nom: 'Mont-roig', municipi: 'Lladorre' },
		nota:
			'Hi ha un segon topònim ICGC "Mont-roig" sense comarca a ~500 m (MDT 2.846 m, vessant nord). ' +
			'Es tria el de Lladorre: coincideix amb el màxim del MDT (2.864 m), OSM i Wikidata.'
	},
	'la-picossa': {
		icgc: { nom: 'la Picossa', municipi: 'Móra d Ebre' },
		restriccions: [
			{
				tipus: 'fauna',
				periodeIniciMmdd: '01-15',
				periodeFiMmdd: '06-15',
				dataInici: null,
				dataFi: null,
				fontUrl: RESTRICCIONS_FEEC
			}
		],
		nota:
			"Homònim a Capçanes (Priorat). La Picossa del repte és la de Móra d'Ebre, 499 m (Viquipèdia, " +
			'"La Picossa (Móra d\'Ebre)", consultat 2026-09-28). Restricció per fauna 15/01–15/06.'
	},
	'sant-salvador-de-les-espases': {
		restriccions: [
			{
				tipus: 'obres',
				periodeIniciMmdd: null,
				periodeFiMmdd: null,
				dataInici: null,
				dataFi: null,
				fontUrl: RESTRICCIONS_FEEC
			}
		],
		nota: 'Restricció per obres (pàgina de restriccions de la FEEC, consultada 2026-09-28).'
	},
	'lo-tormo': {
		coord: {
			lat: 41.17903,
			lon: 0.64346,
			font: {
				font: 'icgc',
				ref: 'vèrtex geodèsic 252136001',
				url: 'https://www.icgc.cat/',
				nota: 'Vèrtex geodèsic ICGC 252136001 (cota 523 m, mapa ICGC 1:10.000).'
			}
		},
		altitud: {
			valor: 523,
			font: { font: 'icgc', ref: 'vèrtex geodèsic 252136001', url: 'https://www.icgc.cat/' }
		},
		nota:
			'El geocodificador ICGC donava l’etiqueta del topònim (198 m del cim, 509 m). Es pren el vèrtex ' +
			'geodèsic ICGC del cim (verificat per QA 2026-09-28).'
	},
	'sant-miquel-de-montclar': {
		coord: {
			lat: 41.46573,
			lon: 1.34565,
			font: {
				font: 'icgc',
				ref: 'cim de Montclar (Pontils)',
				url: 'https://www.icgc.cat/',
				nota: 'Cim de Montclar, 948 m (mapa ICGC 1:10.000), no l’ermita de Sant Miquel (245 m).'
			}
		},
		nota:
			'El geocodificador ICGC apuntava a l’ermita (edificació històrica). Es pren el cim de Montclar ' +
			'(verificat per QA 2026-09-28).'
	},
	'la-tossa-tivissa': {
		icgc: { nom: 'la Tossa', municipi: 'Tivissa' },
		nota: 'El PDF ja la qualifica "(Tivissa)". Homònim a Benifallet (Baix Ebre) descartat.'
	},
	'la-mola-de-sant-llorenc-del-munt': {
		icgc: { nom: 'la Mola', municipi: 'Matadepera' },
		nota: 'Homònim "la Mola" de Gallifa (943 m). Es tria la Mola de Sant Llorenç del Munt (1.103 m).'
	},
	'tossal-de-la-creu': {
		icgc: { nom: 'Tossal de la Creu', municipi: 'Torà' },
		comarca: 'solsones',
		nota:
			'El Tossal de la Creu o de Puig-redon (658 m, entre Biosca i Torà; Viquipèdia "Tossal de la Creu ' +
			"(Segarra)\", consultat 2026-09-28). La FEEC l'assigna a la Segarra, però l'ICGC situa Torà i " +
			"Biosca al Solsonès: prevaleix l'ICGC (decisió 2026-09-28). L'automàtic triava un homònim de " +
			'Guissona (526 m).'
	},
	'la-carabassa': {
		primari: 'wikidata',
		wikidata: 'Q6461537',
		confianca: 'mitjana',
		nota:
			'L\'ICGC té un cim "la Carbassa" (Bellver de Cerdanya) a 565 m al sud, amb 2.736 m al MDT. El punt de ' +
			'Wikidata (2.740 m) coincideix amb el màxim del MDT (2.739,7 m): es pren aquest. Confirmar quin és el ' +
			'cim del repte.'
	},
	'puig-de-tretzevents': {
		primari: 'wikidata',
		wikidata: 'Q7838888',
		confianca: 'mitjana',
		nota:
			'L\'IGN no el troba per nom i OSM no té node amb nom. El topònim ICGC "Puig de Tretzevents" és a ' +
			'504 m i només fa 2.702 m al RGE ALTI; el punt de Wikidata coincideix amb el màxim (2.731,7 m).'
	},
	'casamanya-nord': {
		confianca: 'mitjana',
		nota:
			'Sense MDT oficial a Andorra en aquest punt. OSM dona 2.757 m al node "Casamanya Nord" i Wikidata ' +
			'2.750 m ("Pic de Casamanya"); es pren Wikidata (regla general) però cal verificar la cota amb el ' +
			"mapa oficial d'Andorra."
	},
	'pic-negre-d-envalira': {
		primari: 'wikidata',
		wikidata: 'Q15918235',
		nota:
			'El node OSM "Pic Negre d\'Envalira" (2.815,8 m) és a 157 m del punt més alt; el MDT de l\'ICGC dona ' +
			'2.822,4 m a 7 m del punt de Wikidata (2.822 m). Es fa servir el punt de Wikidata.'
	},
	caro: {
		altitud: {
			valor: 1441,
			font: {
				font: 'manual',
				ref: 'cota popular del Caro',
				url: 'https://en.wikipedia.org/wiki/Mont_Caro',
				nota:
					'Cota més coneguda del Caro: 1.441 m (correcció de l’usuari, 2026-10-05; la fan servir la ' +
					'majoria de ressenyes i la Viquipèdia en anglès). Wikidata i la Viquipèdia en català donen ' +
					'1.442 m.'
			}
		},
		nota:
			'Altitud: es pren la cota popular (1.441 m) en lloc de la de Wikidata (1.442 m), per la regla ' +
			'"cota més coneguda" (correcció de l’usuari, 2026-10-05).'
	},
	'la-fita-alta': {
		altitud: {
			valor: 286,
			font: {
				font: 'icgc',
				ref: 'Mapa topogràfic de Catalunya 1:10.000',
				url: 'https://www.icgc.cat/',
				nota: 'Cota de la Fita Alta (Sidamon) al mapa topogràfic 1:10.000 de l’ICGC: 286 m.'
			}
		},
		nota:
			'Wikidata dona 289 m; el mapa 1:10.000 de l’ICGC (i el text de la Viquipèdia, que el cita) dona ' +
			'286 m. Prevaleix l’ICGC (correcció de l’usuari, 2026-10-05).'
	}
};
