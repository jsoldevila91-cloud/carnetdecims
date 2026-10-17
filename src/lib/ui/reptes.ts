/**
 * Utilitats de la UI dels reptes (bloc R2): textos (Paraglide) i enllaços. La lògica és a
 * `$lib/domain/reptes.ts`; aquí només hi ha presentació.
 */
import {
	ID_REPTE_CENT_CIMS,
	NIVELL_MAXIM,
	OBJECTIU_REPTE,
	clauMissatgeRepte,
	repteDeId,
	repteDeSlug,
	type Medalla,
	type MotiuRecomanacio,
	type Repte
} from '$lib/domain';
import { m } from '$lib/paraglide/messages';

type Missatges = Record<string, ((p?: Record<string, string>) => string) | undefined>;
const missatges = m as unknown as Missatges;

/** Missatge per clau dinàmica (els reptes i els motius tenen claus derivades de l'id). */
function missatge(clau: string, params?: Record<string, string>): string {
	return missatges[clau]?.(params) ?? clau;
}

export function nomRepte(id: string): string {
	return missatge(clauMissatgeRepte(id, 'nom'));
}

export function descripcioRepte(id: string): string {
	return missatge(clauMissatgeRepte(id, 'descripcio'));
}

/** Slug del repte en l'idioma (l'URL interna és `/app/reptes/{slug}`). */
export function slugRepte(repte: Repte, locale: string): string {
	return locale === 'es' ? repte.slug.es : repte.slug.ca;
}

/**
 * Repte d'un slug, en l'idioma actual o, si no hi és, en l'altre (el selector d'idioma conserva
 * el slug de l'URL i el de l'altre idioma pot ser diferent: `repte-infantil` / `reto-infantil`).
 */
export function repteDeSlugQualsevol(slug: string, locale: string): Repte | undefined {
	const primer = locale === 'es' ? 'es' : 'ca';
	const segon = primer === 'es' ? 'ca' : 'es';
	return repteDeSlug(slug, primer) ?? repteDeSlug(slug, segon);
}

/** Nom d'una medalla: el del repte i, al 100 Cims, el nivell ("Repte 100 Cims · 2×100"). */
export function nomMedalla(md: Pick<Medalla, 'repteId' | 'nivell'>): string {
	const nom = repteDeId(md.repteId) ? nomRepte(md.repteId) : md.repteId;
	if (md.repteId !== ID_REPTE_CENT_CIMS) return nom;
	return m.medal_level_name({ name: nom, level: nivellText(md.nivell) });
}

/** "100", "2×100" … "5×100". */
export function nivellText(nivell: number): string {
	const n = Math.max(1, Math.min(NIVELL_MAXIM, nivell));
	return n === 1 ? String(OBJECTIU_REPTE) : `${n}×${OBJECTIU_REPTE}`;
}

/** Clau única d'una medalla (per comparar abans/després). */
export function clauMedalla(md: Pick<Medalla, 'repteId' | 'nivell'>): string {
	return `${md.repteId}#${md.nivell}`;
}

/** Medalles de `despres` que no eren a `abans`. */
export function medallesNoves<T extends Pick<Medalla, 'repteId' | 'nivell'>>(
	abans: readonly T[],
	despres: readonly T[]
): T[] {
	const vistes = new Set(abans.map(clauMedalla));
	return despres.filter((md) => !vistes.has(clauMedalla(md)));
}

/** Text llegible d'un motiu de "El teu proper cim" (`proper_cim_motiu_*`). */
export function textMotiu(motiu: MotiuRecomanacio): string {
	const clau = `proper_cim_motiu_${motiu.clau.replace(/-/g, '_')}`;
	const params: Record<string, string> = {};
	if (motiu.km !== undefined) params.km = String(motiu.km);
	if (motiu.nivell !== undefined) params.nivell = nivellDificultatText(motiu.nivell);
	if (motiu.repteId !== undefined) params.repte = nomRepte(motiu.repteId);
	if (motiu.falten !== undefined) params.falten = String(motiu.falten);
	return missatge(clau, params);
}

function nivellDificultatText(n: number): string {
	switch (n) {
		case 1:
			return m.proper_cim_nivell_1();
		case 2:
			return m.proper_cim_nivell_2();
		case 3:
			return m.proper_cim_nivell_3();
		default:
			return m.proper_cim_nivell_4();
	}
}

/**
 * Dies de la sortida per a "El teu proper cim": el cap de setmana vinent (dissabte i diumenge);
 * si avui és dissabte, dissabte i diumenge; si és diumenge, només avui.
 */
export function capDeSetmanaVinent(avui: string): string[] {
	const [a, mes, d] = avui.split('-').map(Number);
	const data = new Date(Date.UTC(a, mes - 1, d));
	const dia = data.getUTCDay(); // 0 diumenge … 6 dissabte
	const iso = (dt: Date) => dt.toISOString().slice(0, 10);
	const suma = (n: number) => new Date(data.getTime() + n * 86_400_000);
	if (dia === 0) return [avui];
	const finsDissabte = 6 - dia;
	return [iso(suma(finsDissabte)), iso(suma(finsDissabte + 1))];
}
