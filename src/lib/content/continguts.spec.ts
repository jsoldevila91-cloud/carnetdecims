import { describe, expect, it } from 'vitest';
import { SLUGS_CIMS } from '$lib/data/catalog';
import { LOCALES, PRERENDER_PATHS, slugsComarquesAmbCims } from '$lib/i18n/routes';
import { CONTINGUTS, PAGINES_CONTINGUT, clauPerCami, contingutPerCami } from './index';
import { MARCADORS_PENDENTS, PATRO_PENDENT, pendentsDe } from './pendents';
import { destinsEnllacos } from './text';
import { TITULAR } from './titular';
import type { Bloc, ClauPagina, PaginaContingut } from './types';

/** Pàgines institucionals i legals (bloc 3c, backend). El hub el prova `repte.spec.ts`. */
const PROPIES: ClauPagina[] = ['metodologia', 'sobreElProjecte', 'avisLegal', 'privacitat'];

const CAMINS_EXISTENTS = new Set<string>([
	...PRERENDER_PATHS,
	...SLUGS_CIMS.map((s) => `/cims/${s}`),
	...slugsComarquesAmbCims().map((s) => `/comarques/${s}`),
	// Zona de l'app (SPA, noindex): només les pàgines que s'enllacen des del contingut.
	'/app',
	'/app/validacio'
]);

const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function textsEnLinia(p: PaginaContingut): string[] {
	const deBloc = (b: Bloc): string[] => (b.tipus === 'llista' ? b.items : [b.text]);
	return [
		...p.seccions.flatMap((s) => s.blocs.flatMap(deBloc)),
		...(p.faq ?? []).map((f) => f.resposta)
	];
}

describe('índex de continguts', () => {
	it('CONTINGUTS té les 8 pàgines de PAGINES_CONTINGUT en ca i es', () => {
		expect(Object.keys(CONTINGUTS).sort()).toEqual(Object.keys(PAGINES_CONTINGUT).sort());
		for (const c of Object.values(CONTINGUTS)) expect(Object.keys(c).sort()).toEqual([...LOCALES]);
	});

	it('contingutPerCami: camí intern deslocalitzat (tolera la barra final)', () => {
		expect(contingutPerCami('/metodologia')).toBe(CONTINGUTS.metodologia);
		expect(contingutPerCami('/repte-100-cims/normativa/')).toBe(CONTINGUTS.normativa);
		expect(clauPerCami('/privacitat')).toBe('privacitat');
		expect(contingutPerCami('/privacidad')).toBeUndefined();
		expect(contingutPerCami('/cims')).toBeUndefined();
		expect(contingutPerCami('/')).toBeUndefined();
	});
});

describe.each(PROPIES)('pàgina %s', (clau) => {
	it.each(LOCALES)('%s: metadades dins dels límits i data de revisió ISO', (locale) => {
		const p = CONTINGUTS[clau][locale];
		expect(p.title.length).toBeLessThanOrEqual(60);
		expect(p.description.length).toBeLessThanOrEqual(155);
		expect(p.description.length).toBeGreaterThan(70);
		expect(p.actualitzat).toMatch(DATA_ISO);
		expect(p.noindex).toBeFalsy();
		const ids = p.seccions.map((s) => s.id);
		for (const id of ids) expect(id).toMatch(ID);
		expect(new Set(ids).size).toBe(ids.length);
		for (const f of p.fonts ?? []) {
			expect(f.url).toMatch(/^https:\/\//);
			if (f.consultat) expect(f.consultat).toMatch(DATA_ISO);
		}
	});

	it.each(LOCALES)('%s: enllaços interns existents i externs https', (locale) => {
		for (const text of textsEnLinia(CONTINGUTS[clau][locale])) {
			for (const desti of destinsEnllacos(text)) {
				if (desti.startsWith('/')) {
					// `/cami#ancora`: el camí ha d'existir i, si és una pàgina de contingut, l'àncora
					// ha de ser una de les seves seccions.
					const [cami, ancora] = desti.split('#');
					expect(CAMINS_EXISTENTS, desti).toContain(cami);
					if (ancora !== undefined) {
						const pagDesti = contingutPerCami(cami);
						expect(pagDesti, desti).toBeDefined();
						expect(
							pagDesti![locale].seccions.map((s) => s.id),
							desti
						).toContain(ancora);
					}
				} else expect(desti).toMatch(/^https:\/\/[^\s]+$/);
			}
			// Cap enllaç mal format (p. ex. `[text] (destí)` o destí http://).
			expect(text).not.toMatch(/\]\s+\(|\]\(http:/);
		}
	});

	it('ca i es tenen les mateixes seccions', () => {
		const ids = (l: 'ca' | 'es') => CONTINGUTS[clau][l].seccions.map((s) => s.id);
		expect(ids('es')).toEqual(ids('ca'));
		expect(CONTINGUTS[clau].es.faq?.length).toBe(CONTINGUTS[clau].ca.faq?.length);
	});
});

describe('dades del titular i marcadors pendents', () => {
	it('legals i contacte fan servir el titular i el correu decidits', () => {
		for (const clau of ['avisLegal', 'privacitat'] as const) {
			for (const l of LOCALES) {
				const text = JSON.stringify(CONTINGUTS[clau][l]);
				expect(text).toContain(TITULAR.nom);
				expect(text).toContain(TITULAR.correu);
			}
		}
		for (const l of LOCALES) {
			expect(JSON.stringify(CONTINGUTS.metodologia[l])).toContain(TITULAR.correu);
			expect(JSON.stringify(CONTINGUTS.sobreElProjecte[l])).toContain(TITULAR.correu);
		}
	});

	it('les pàgines pròpies no porten cap altre correu que el de contacte', () => {
		const propies = PROPIES.map((c) => CONTINGUTS[c]);
		const correus = JSON.stringify(propies).match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g) ?? [];
		expect(new Set(correus)).toEqual(new Set([TITULAR.correu]));
	});

	it('pendentsDe troba els marcadors, fins i tot els escrits a mà', () => {
		expect(pendentsDe({ a: ['x [PENDENT: nom] y', { b: '[PENDIENTE: correo]' }] })).toEqual([
			'[PENDENT: nom]',
			'[PENDIENTE: correo]'
		]);
		for (const m of MARCADORS_PENDENTS) expect(m).toMatch(new RegExp(PATRO_PENDENT.source));
	});

	/** Inventari: cap contingut no pot portar marcadors pendents. */
	it('inventari de marcadors pendents: buit', () => {
		expect(MARCADORS_PENDENTS).toEqual([]);
		expect(pendentsDe(CONTINGUTS)).toEqual([]);
	});

	it('el nom complet del responsable del tractament només surt a privacitat#responsable', async () => {
		const { RESPONSABLE_TRACTAMENT } = await import('./privacitat');
		const cognom = RESPONSABLE_TRACTAMENT.split(' ')[1];
		for (const l of LOCALES) {
			const pagina = CONTINGUTS.privacitat[l];
			const amb = pagina.seccions.filter((s) => JSON.stringify(s).includes(cognom));
			expect(amb.map((s) => s.id)).toEqual(['responsable']);
			expect(`${pagina.title} ${pagina.description} ${pagina.h1} ${pagina.intro}`).not.toContain(
				cognom
			);
			for (const clau of Object.keys(CONTINGUTS) as (keyof typeof CONTINGUTS)[]) {
				if (clau !== 'privacitat')
					expect(JSON.stringify(CONTINGUTS[clau][l]), clau).not.toContain(cognom);
			}
		}
		const { readFileSync } = await import('node:fs');
		for (const fitxer of [
			'messages/ca.json',
			'messages/es.json',
			'src/lib/seo/jsonld.ts',
			'src/lib/content/titular.ts'
		]) {
			expect(readFileSync(fitxer, 'utf8'), fitxer).not.toContain(cognom);
		}
	});

	it('la persona responsable només surt amb les inicials', () => {
		expect(TITULAR.responsable).toBe('JSR');
		for (const l of LOCALES) {
			expect(JSON.stringify(CONTINGUTS.sobreElProjecte[l])).toContain('JSR');
		}
	});
});

describe('privadesa amb i sense «Continua amb Google»', () => {
	it('la política vigent (Google desactivat) no diu que es pugui entrar amb Google', async () => {
		const { privacitat, privacitatAmbGoogle } = await import('./privacitat');
		expect(CONTINGUTS.privacitat).toBe(privacitat);
		for (const l of LOCALES) {
			const text = JSON.stringify(privacitat[l]);
			expect(text).not.toMatch(/amb Google|con Google|Google Ireland/);
			// Mateixes seccions en totes dues variants: només canvia el text.
			expect(privacitatAmbGoogle[l].seccions.map((s) => s.id)).toEqual(
				privacitat[l].seccions.map((s) => s.id)
			);
		}
	});

	it('la variant amb Google explica proveïdor, dades, ús del correu, base jurídica i que és opcional', async () => {
		const { privacitatAmbGoogle } = await import('./privacitat');
		const ca = JSON.stringify(privacitatAmbGoogle.ca);
		const es = JSON.stringify(privacitatAmbGoogle.es);
		for (const text of [ca, es]) {
			expect(text).toContain('Google Ireland Limited');
			expect(text).toContain('6.1.b');
			expect(text).toContain('https://policies.google.com/privacy');
		}
		expect(ca).toContain('Només fem servir el correu');
		expect(ca).toContain('És opcional: sempre pots entrar amb el correu.');
		expect(es).toContain('Solo usamos el correo');
		expect(es).toContain('Es opcional: siempre puedes entrar con el correo.');
	});
});

describe('privadesa: correus del compte per Hostinger', () => {
	it('totes les variants diuen que els correus surten per Hostinger, encarregat, i no per Supabase sol', async () => {
		const { privacitatSegons } = await import('./privacitat');
		for (const g of [false, true]) {
			for (const c of [false, true]) {
				const p = privacitatSegons(g, c);
				const ca = JSON.stringify(p.ca);
				const es = JSON.stringify(p.es);
				for (const text of [ca, es]) {
					expect(text).toContain('https://www.hostinger.com/legal/privacy-policy');
					expect(text).toContain('hola@carnetdecims.cat');
					expect(text).not.toMatch(/Supabase qui t'envia|Supabase quien te envía/);
				}
				expect(ca).toContain('**Correus del compte:**');
				expect(ca).toContain("fa d'encarregat del tractament per encàrrec nostre");
				expect(ca).toContain("La bústia de correu l'allotja Hostinger");
				expect(es).toContain('**Correos de la cuenta:**');
				expect(es).toContain('actúa como encargado del tratamiento por encargo nuestro');
				expect(es).toContain('El buzón de correo lo aloja Hostinger');
				// Amb contrasenya, també la confirmació i el restabliment.
				expect(ca.includes("l'enllaç per restablir la contrasenya")).toBe(c);
				expect(es.includes('el enlace para restablecer la contraseña')).toBe(c);
			}
		}
	});
});

describe('privadesa amb i sense correu + contrasenya', () => {
	const COMBINACIONS = [
		[false, false],
		[true, false],
		[false, true],
		[true, true]
	] as const;

	it('sense contrasenya, privacitatSegons retorna les constants i no parla de contrasenya', async () => {
		const { privacitat, privacitatAmbGoogle, privacitatSegons } = await import('./privacitat');
		expect(privacitatSegons(false, false)).toBe(privacitat);
		expect(privacitatSegons(true, false)).toBe(privacitatAmbGoogle);
		for (const l of LOCALES) {
			for (const p of [privacitat, privacitatAmbGoogle]) {
				const text = JSON.stringify(p[l]);
				expect(text).not.toMatch(/bcrypt|amb contrasenya|con contraseña/);
				// Text vigent intacte: l'accés és «sense contrasenya».
				expect(text).toMatch(/sense contrasenya|sin contraseña/);
			}
		}
	});

	it('les quatre combinacions tenen les mateixes seccions i la mateixa data', async () => {
		const { privacitat, privacitatSegons } = await import('./privacitat');
		for (const [g, c] of COMBINACIONS) {
			const p = privacitatSegons(g, c);
			for (const l of LOCALES) {
				expect(p[l].seccions.map((s) => s.id)).toEqual(privacitat[l].seccions.map((s) => s.id));
				// La data no canvia mentre el flag estigui desactivat (es canvia en activar-lo).
				expect(p[l].actualitzat).toBe(privacitat[l].actualitzat);
			}
		}
	});

	it('amb contrasenya explica hash, que no la veiem, correus, base jurídica i esborrat', async () => {
		const { privacitatSegons } = await import('./privacitat');
		for (const g of [false, true]) {
			const p = privacitatSegons(g, true);
			const ca = JSON.stringify(p.ca);
			const es = JSON.stringify(p.es);
			for (const text of [ca, es]) {
				expect(text).toContain('bcrypt');
				expect(text).toContain('6.1.b');
				expect(text).not.toMatch(/sense contrasenya|sin contraseña/);
			}
			expect(ca).toContain('**Entrar amb contrasenya (opcional):**');
			expect(ca).toContain('nosaltres no la veiem i no la podem recuperar');
			expect(ca).toContain("t'enviem un correu per confirmar l'adreça");
			expect(ca).toContain('un enllaç per triar-ne una de nova');
			expect(ca).toContain("La contrasenya s'esborra amb el compte.");
			expect(ca).toContain('o amb el teu correu i una contrasenya');
			expect(es).toContain('**Entrar con contraseña (opcional):**');
			expect(es).toContain('nosotros no la vemos y no podemos recuperarla');
			expect(es).toContain('te enviamos un correo para confirmar la dirección');
			expect(es).toContain('un enlace para elegir una nueva');
			expect(es).toContain('La contraseña se borra con la cuenta.');
			expect(es).toContain('o con tu correo y una contraseña');
			// Google només hi surt si el seu flag també és actiu.
			expect(ca.includes('Google Ireland Limited')).toBe(g);
			expect(es.includes('Google Ireland Limited')).toBe(g);
		}
	});
});
