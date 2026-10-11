/**
 * El conjunt de municipis generat (`npm run municipis:build`): forma, cobertura i coherència amb
 * el catàleg. Si falla després de regenerar-lo, cal revisar el script, no editar el JSON.
 */
import { describe, expect, it } from 'vitest';
import { distanciaKm, esCodiMunicipi, type DadesMunicipis } from '$lib/domain';
import { COMARQUES } from '../catalog/cataleg';
import dades from './municipis.json';
import { FONT_MUNICIPIS, carregarMunicipis, cercarMunicipi, municipiDeCodi } from './index';

describe('conjunt de municipis (ICGC)', () => {
	it('947 municipis de Catalunya, les 7 parròquies d’Andorra i 26 poblacions de la Catalunya Nord', async () => {
		const tots = await carregarMunicipis();
		const perZona = (z: string) => tots.filter((m) => m.zona === z);
		expect(perZona('catalunya')).toHaveLength(947);
		expect(
			perZona('andorra')
				.map((m) => m.nom)
				.sort()
		).toEqual([
			'Andorra la Vella',
			'Canillo',
			'Encamp',
			'Escaldes-Engordany',
			'Ordino',
			'Sant Julià de Lòria',
			'la Massana'
		]);
		expect(perZona('catalunya-nord')).toHaveLength(26);
		expect(tots).toHaveLength(980);
		expect((dades as unknown as DadesMunicipis).font).toMatch(/ICGC/);
		expect(FONT_MUNICIPIS).toMatch(/ICGC.*CC BY 4\.0/);
	});

	it('codis únics i amb el format de cada zona', async () => {
		const tots = await carregarMunicipis();
		expect(new Set(tots.map((m) => m.codi)).size).toBe(tots.length);
		for (const m of tots) {
			expect(esCodiMunicipi(m.codi), m.codi).toBe(true);
			const prefix = m.zona === 'catalunya' ? /^\d{6}$/ : m.zona === 'andorra' ? /^ad:/ : /^cn:/;
			expect(m.codi, m.nom).toMatch(prefix);
		}
	});

	it('noms nets i coordenades dins de la zona (4 decimals)', async () => {
		for (const m of await carregarMunicipis()) {
			expect(m.nom, m.codi).toBe(m.nom.trim());
			expect(m.nom.length, m.codi).toBeGreaterThan(1);
			expect(m.cap === null || (m.cap.trim() === m.cap && m.cap !== m.nom), m.codi).toBe(true);
			expect(m.lat, m.nom).toBeGreaterThan(40.5);
			expect(m.lat, m.nom).toBeLessThan(42.95);
			expect(m.lon, m.nom).toBeGreaterThan(0.1);
			expect(m.lon, m.nom).toBeLessThan(3.35);
			expect(Number(m.lat.toFixed(4)), m.nom).toBe(m.lat);
			expect(Number(m.lon.toFixed(4)), m.nom).toBe(m.lon);
		}
	});

	it('les comarques amb cims al catàleg tenen el mateix slug i nom', async () => {
		const tots = await carregarMunicipis();
		const perSlug = new Map(tots.map((m) => [m.comarcaSlug, m]));
		for (const c of COMARQUES) {
			const m = perSlug.get(c.slug);
			expect(m, c.slug).toBeDefined();
			expect(m!.comarca).toBe(c.nom);
			expect(m!.zona).toBe(c.zona);
		}
		// 43 comarques de Catalunya (el Lluçanès inclòs) + Andorra + Catalunya Nord.
		expect(perSlug.size).toBe(45);
		expect(perSlug.get('llucanes')?.comarca).toBe('Lluçanès');
	});

	it('punts coneguts: el cap de municipi, no el centroide', async () => {
		const bcn = await municipiDeCodi('080193');
		expect(bcn).toMatchObject({ nom: 'Barcelona', comarca: 'Barcelonès', cap: null });
		// Plaça de Sant Jaume ± 2 km.
		expect(distanciaKm(bcn!, { lat: 41.3828, lon: 2.1769 })).toBeLessThan(2);
		const boi = await municipiDeCodi('250432');
		expect(boi).toMatchObject({ nom: 'la Vall de Boí', cap: 'Barruera' });
		expect(distanciaKm(boi!, { lat: 42.505, lon: 0.801 })).toBeLessThan(1);
		expect(await municipiDeCodi('ad:andorra-la-vella')).toMatchObject({
			nom: 'Andorra la Vella',
			comarca: 'Andorra',
			comarcaSlug: 'andorra'
		});
		expect(await municipiDeCodi('cn:perpinya')).toMatchObject({
			nom: 'Perpinyà',
			comarca: 'Catalunya Nord'
		});
		expect(await municipiDeCodi('999999')).toBeNull();
		expect(await municipiDeCodi(null)).toBeNull();
	});

	it('la llista és immutable i es reutilitza entre crides', async () => {
		const a = await carregarMunicipis();
		expect(await carregarMunicipis()).toBe(a);
		expect(Object.isFrozen(a)).toBe(true);
	});
});

describe('cercarMunicipi (sobre el conjunt real)', () => {
	const noms = async (q: string, limit?: number) =>
		(await cercarMunicipi(q, limit ? { limit } : {})).map((m) => m.nom);

	it('sense accents ni apòstrofs, amb article o sense', async () => {
		expect((await noms('hospitalet de llobregat'))[0]).toBe("l'Hospitalet de Llobregat");
		expect((await noms("l'hospitalet de ll"))[0]).toBe("l'Hospitalet de Llobregat");
		expect((await noms('seu d urgell'))[0]).toBe("la Seu d'Urgell");
		expect((await noms('seu durgell'))[0]).toBe("la Seu d'Urgell");
		expect((await noms('puigcerda'))[0]).toBe('Puigcerdà');
		expect((await noms('sant cugat del valles'))[0]).toBe('Sant Cugat del Vallès');
		expect((await noms('vielha'))[0]).toBe('Vielha e Mijaran');
		expect((await noms('perpinya'))[0]).toBe('Perpinyà');
		expect((await noms('ordino'))[0]).toBe('Ordino');
	});

	it('el nom exacte va primer encara que n’hi hagi de més llargs', async () => {
		expect((await noms('vic'))[0]).toBe('Vic');
		expect((await noms('girona'))[0]).toBe('Girona');
		expect((await noms('prades'))[0]).toBe('Prades');
		expect((await noms('prada'))[0]).toBe('Prada');
	});

	it('pel cap de municipi quan té un altre nom', async () => {
		expect(await noms('barruera')).toEqual(['la Vall de Boí']);
		expect(await noms('salardu')).toContain('Naut Aran');
	});

	it('límit per defecte de 20 resultats i res amb la consulta buida', async () => {
		expect(await noms('sant')).toHaveLength(20);
		expect(await noms('sant', 5)).toHaveLength(5);
		expect(await noms('')).toEqual([]);
		expect(await noms('xyzxyz')).toEqual([]);
	});
});
