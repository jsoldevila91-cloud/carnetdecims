import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
import BottomSheet from './BottomSheet.svelte';

const body = createRawSnippet(() => ({ render: () => '<p>Contingut del full</p>' }));

function setup(open: boolean) {
	const onclose = vi.fn();
	const screen = render(BottomSheet, {
		open,
		title: 'Registrar una ascensió',
		onclose,
		children: body
	});
	const dialog = () => screen.container.ownerDocument.querySelector('dialog')!;
	return { screen, onclose, dialog };
}

describe('BottomSheet', () => {
	it('tancat: el diàleg no és obert ni visible', async () => {
		const { dialog } = setup(false);
		expect(dialog().open).toBe(false);
		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
	});

	it('obert: diàleg modal amb nom accessible i contingut', async () => {
		const { dialog } = setup(true);
		const sheet = page.getByRole('dialog', { name: 'Registrar una ascensió' });
		await expect.element(sheet).toBeVisible();
		expect(dialog().open).toBe(true);
		expect(dialog().matches(':modal')).toBe(true);
		await expect.element(sheet.getByText('Contingut del full')).toBeVisible();
		await expect
			.element(sheet.getByRole('heading', { level: 2 }))
			.toHaveTextContent('Registrar una ascensió');
	});

	it('el botó Tanca demana tancar', async () => {
		const { onclose } = setup(true);
		await page.getByRole('button', { name: 'Tanca' }).click();
		expect(onclose).toHaveBeenCalledTimes(1);
	});

	it('Esc demana tancar però l’estat el decideix qui el controla', async () => {
		const { onclose, dialog } = setup(true);
		await expect.element(page.getByRole('dialog')).toBeVisible();
		await userEvent.keyboard('{Escape}');
		expect(onclose).toHaveBeenCalledTimes(1);
		// `cancel` es cancel·la: el diàleg continua obert fins que `open` passi a false
		expect(dialog().open).toBe(true);
	});

	it('un clic al fons (fora del panell) demana tancar; un clic a dins, no', async () => {
		const { onclose, dialog } = setup(true);
		await page.getByText('Contingut del full').click();
		expect(onclose).not.toHaveBeenCalled();
		dialog().dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(onclose).toHaveBeenCalledTimes(1);
	});

	it('en passar open a false es tanca i el focus torna a l’element que l’ha obert', async () => {
		const opener = document.createElement('button');
		opener.textContent = 'Obre';
		document.body.appendChild(opener);
		opener.focus();

		const { screen, dialog } = setup(false);
		await screen.rerender({ open: true });
		await expect.element(page.getByRole('dialog')).toBeVisible();
		expect(dialog().contains(document.activeElement)).toBe(true);

		await screen.rerender({ open: false });
		expect(dialog().open).toBe(false);
		expect(document.activeElement).toBe(opener);
		opener.remove();
	});
});
