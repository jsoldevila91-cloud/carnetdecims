import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import BannerBeta, { CLAU_BETA } from './BannerBeta.svelte';

describe('BannerBeta', () => {
	beforeEach(() => {
		sessionStorage.clear();
		document.documentElement.removeAttribute('data-beta-amagat');
	});

	it('mostra l’avís amb el correu d’opinió', async () => {
		render(BannerBeta);
		const avis = page.getByRole('complementary', { name: 'Avís de versió beta' });
		await expect.element(avis).toHaveTextContent(/Versió beta privada · Pot contenir errors/);
		await expect
			.element(avis.getByRole('link', { name: 'hola@carnetdecims.cat' }))
			.toHaveAttribute('href', 'mailto:hola@carnetdecims.cat');
	});

	it('es pot amagar per a la sessió', async () => {
		render(BannerBeta);
		await page.getByRole('button', { name: "Amaga l'avís de la versió beta" }).click();
		await expect.element(page.getByRole('complementary')).not.toBeInTheDocument();
		expect(sessionStorage.getItem(CLAU_BETA)).toBe('1');
		expect(document.documentElement.hasAttribute('data-beta-amagat')).toBe(true);
	});

	it('no surt si ja s’havia amagat en aquesta sessió', async () => {
		sessionStorage.setItem(CLAU_BETA, '1');
		render(BannerBeta);
		await expect.element(page.getByRole('complementary')).not.toBeInTheDocument();
	});
});
