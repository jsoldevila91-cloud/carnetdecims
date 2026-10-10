import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import { MODE_BETA } from '$lib/seo/mode-beta';
import BannerBeta, { CLAU_BETA } from './BannerBeta.svelte';

describe('BannerBeta', () => {
	beforeEach(() => {
		sessionStorage.clear();
		document.documentElement.removeAttribute('data-beta-amagat');
	});

	it('mostra l’avís amb el correu d’opinió', async () => {
		render(BannerBeta, { actiu: true });
		const avis = page.getByRole('complementary', { name: 'Avís de versió beta' });
		await expect.element(avis).toHaveTextContent(/Versió beta privada · Pot contenir errors/);
		await expect
			.element(avis.getByRole('link', { name: 'hola@carnetdecims.cat' }))
			.toHaveAttribute('href', 'mailto:hola@carnetdecims.cat');
	});

	it('es pot amagar per a la sessió', async () => {
		render(BannerBeta, { actiu: true });
		await page.getByRole('button', { name: "Amaga l'avís de la versió beta" }).click();
		await expect.element(page.getByRole('complementary')).not.toBeInTheDocument();
		expect(sessionStorage.getItem(CLAU_BETA)).toBe('1');
		expect(document.documentElement.hasAttribute('data-beta-amagat')).toBe(true);
	});

	it('no surt si ja s’havia amagat en aquesta sessió', async () => {
		sessionStorage.setItem(CLAU_BETA, '1');
		render(BannerBeta, { actiu: true });
		await expect.element(page.getByRole('complementary')).not.toBeInTheDocument();
	});

	it('fora del mode beta no es pinta (sense buit al disseny)', async () => {
		const { container } = render(BannerBeta, { actiu: false });
		await expect.element(page.getByRole('complementary')).not.toBeInTheDocument();
		expect(container.innerHTML.replace(/<!---->/g, '').trim()).toBe('');
	});

	it('per defecte segueix el mode beta del build (MODE_BETA)', async () => {
		render(BannerBeta);
		const avis = page.getByRole('complementary', { name: 'Avís de versió beta' });
		if (MODE_BETA) await expect.element(avis).toBeInTheDocument();
		else await expect.element(avis).not.toBeInTheDocument();
	});
});
