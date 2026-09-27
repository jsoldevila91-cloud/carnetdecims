import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { test, expect, gotoHydrated, mainNav, settleAnimations, ROUTES } from './fixtures';

/** WCAG 2.2 AA (inclou 2.0/2.1 A i AA). */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function expectNoAxeViolations(page: Page) {
	await page.evaluate(() => document.fonts.ready);
	await settleAnimations(page);
	const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
	const summary = violations.map((v) => ({
		id: v.id,
		impact: v.impact,
		nodes: v.nodes.slice(0, 5).map((n) => `${n.target.join(' ')} → ${n.failureSummary}`)
	}));
	expect(summary, 'violacions axe').toEqual([]);
}

const PAGES = [
	...Object.values(ROUTES.ca),
	ROUTES.es.home,
	ROUTES.es.peaks,
	ROUTES.es.app,
	ROUTES.es.account
];

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`axe · ${colorScheme}`, () => {
		test.use({ colorScheme });

		for (const url of PAGES) {
			test(`${url} sense violacions WCAG 2.2 AA`, async ({ page }) => {
				await gotoHydrated(page, url);
				await expectNoAxeViolations(page);
			});
		}

		test('404 sense violacions WCAG 2.2 AA', async ({ page, consoleGuard }) => {
			consoleGuard.allow(/Failed to load resource.*404/);
			await page.goto('/ca/no-existeix');
			await expectNoAxeViolations(page);
		});

		test('full Registrar obert sense violacions WCAG 2.2 AA', async ({ page }) => {
			await gotoHydrated(page, ROUTES.ca.peaks);
			await mainNav(page).getByRole('link', { name: 'Registrar una ascensió' }).click();
			await expect(page.getByRole('dialog')).toBeVisible();
			await expectNoAxeViolations(page);
		});
	});
}

test.describe('Mode fosc', () => {
	test.use({ colorScheme: 'dark' });

	test('els tokens canvien de tema segons el sistema', async ({ page }) => {
		await page.goto(ROUTES.ca.home);
		const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
		// Fons fosc: luminància baixa
		const [r, g, b] = bg.match(/\d+/g)!.map(Number);
		expect((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255).toBeLessThan(0.3);
	});
});

test.describe('Objectius tàctils i reflow', () => {
	test('els enllaços de la navegació principal fan ≥ 44×44 px', async ({ page }) => {
		await page.goto(ROUTES.ca.home);
		const boxes = await mainNav(page)
			.getByRole('link')
			.evaluateAll((els) =>
				els.map((e) => e.getBoundingClientRect()).map((r) => [r.width, r.height])
			);
		expect(boxes).toHaveLength(5);
		for (const [w, h] of boxes) {
			expect(w).toBeGreaterThanOrEqual(44);
			expect(h).toBeGreaterThanOrEqual(44);
		}
	});

	test('sense scroll horitzontal a 320 px', async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 640 });
		const urls = [...Object.values(ROUTES.ca), ...Object.values(ROUTES.es)];
		for (const url of urls) {
			await page.goto(url);
			await page.waitForLoadState('networkidle');
			const { overflow, culprit } = await page.evaluate(() => {
				const vw = document.documentElement.clientWidth;
				const wide = [...document.querySelectorAll<HTMLElement>('main *')].find(
					(el) => el.getBoundingClientRect().right > vw + 0.5
				);
				return {
					overflow: document.documentElement.scrollWidth - vw,
					culprit: wide ? `${wide.tagName.toLowerCase()}.${wide.className}` : null
				};
			});
			expect.soft(overflow, `${url} desborda horitzontalment (${culprit})`).toBeLessThanOrEqual(0);
		}
	});
});
