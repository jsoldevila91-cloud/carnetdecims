import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import CampCompanys from './CampCompanys.svelte';

describe('CampCompanys', () => {
	it('un nom repetit exacte (el núvol no deduplica) no trenca la llista de xips', async () => {
		render(CampCompanys, { companys: ['Inesa', 'Inesa', 'Pau'], ascensions: [] });
		const xips = page.getByRole('list').getByRole('listitem');
		await expect.element(xips.nth(2)).toBeInTheDocument();
		expect(xips.elements().map((li) => li.querySelector('.nom')?.textContent)).toEqual([
			'Inesa',
			'Inesa',
			'Pau'
		]);
	});
});
