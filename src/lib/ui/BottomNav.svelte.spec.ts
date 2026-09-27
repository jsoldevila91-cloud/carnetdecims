import { beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

const mocks = vi.hoisted(() => ({
	page: { url: new URL('http://localhost/ca'), state: {} as { sheet?: 'registrar' } },
	pushState: vi.fn()
}));

vi.mock('$app/state', () => ({ page: mocks.page }));
vi.mock('$app/navigation', () => ({ pushState: mocks.pushState }));

const { default: BottomNav } = await import('./BottomNav.svelte');

function at(pathname: string, state: { sheet?: 'registrar' } = {}) {
	mocks.page.url = new URL(`http://localhost${pathname}`);
	mocks.page.state = state;
	return render(BottomNav);
}

const nav = () => page.getByRole('navigation', { name: 'Navegació principal' });

describe('BottomNav', () => {
	beforeEach(() => mocks.pushState.mockReset());

	it('té 5 destins amb les URL localitzades en català', async () => {
		at('/ca');
		const links = nav().getByRole('link');
		await expect.element(links.nth(4)).toBeInTheDocument();
		const hrefs = links.elements().map((a) => new URL((a as HTMLAnchorElement).href).pathname);
		expect(hrefs).toEqual([
			'/ca/app',
			'/ca/mapa',
			'/ca/app/registrar',
			'/ca/cims',
			'/ca/app/compte'
		]);
	});

	it('Registrar té un nom accessible descriptiu', async () => {
		at('/ca');
		await expect.element(nav().getByRole('link', { name: 'Registrar una ascensió' })).toBeVisible();
	});

	it.each([
		['/ca/app', 'Inici'],
		['/ca/mapa', 'Mapa'],
		['/ca/cims', 'Cims'],
		['/ca/cims/pica-d-estats', 'Cims'],
		['/ca/app/compte', 'Perfil']
	])('a %s marca "%s" com a pàgina actual (i només aquesta)', async (path, label) => {
		at(path);
		await expect
			.element(nav().getByRole('link', { name: label, exact: true }))
			.toHaveAttribute('aria-current', 'page');
		expect(document.querySelectorAll('nav a[aria-current="page"]')).toHaveLength(1);
	});

	it('a la portada cap pestanya és l’actual', async () => {
		at('/ca');
		await expect.element(nav()).toBeVisible();
		expect(document.querySelectorAll('nav a[aria-current="page"]')).toHaveLength(0);
	});

	it('un clic a Registrar obre el full amb shallow routing', async () => {
		at('/ca/cims');
		await nav().getByRole('link', { name: 'Registrar una ascensió' }).click();
		expect(mocks.pushState).toHaveBeenCalledWith('/ca/app/registrar', { sheet: 'registrar' });
	});

	it('amb el full ja obert no afegeix una altra entrada a l’historial', async () => {
		at('/ca/cims', { sheet: 'registrar' });
		await nav().getByRole('link', { name: 'Registrar una ascensió' }).click();
		expect(mocks.pushState).not.toHaveBeenCalled();
	});

	/**
	 * Fa clic a l'enllaç de Registrar i retorna si el component ha cancel·lat la navegació.
	 * Un listener a `window` (s'executa després del del component) evita que el runner navegui.
	 */
	function clickRegister(init: MouseEventInit = {}) {
		const link = document.querySelector<HTMLAnchorElement>('a[href$="/app/registrar"]')!;
		let preventedByComponent = false;
		const guard = (e: Event) => {
			preventedByComponent = e.defaultPrevented;
			e.preventDefault();
		};
		window.addEventListener('click', guard);
		link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ...init }));
		window.removeEventListener('click', guard);
		return { link, preventedByComponent };
	}

	it('amb Ctrl+clic no intercepta (obrir en pestanya nova)', async () => {
		at('/ca/cims');
		await expect.element(nav()).toBeVisible();
		const { preventedByComponent } = clickRegister({ ctrlKey: true });
		expect(mocks.pushState).not.toHaveBeenCalled();
		expect(preventedByComponent).toBe(false);
	});

	it('a la pàgina /app/registrar no obre el full (ja hi ets)', async () => {
		at('/ca/app/registrar');
		await expect.element(nav()).toBeVisible();
		const { link } = clickRegister();
		expect(link.getAttribute('aria-current')).toBe('page');
		expect(mocks.pushState).not.toHaveBeenCalled();
	});
});
