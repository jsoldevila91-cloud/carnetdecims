/** Cua de notificacions breus. La mostra `<Toaster />` (un sol cop, al layout arrel). */

export type ToastTone = 'info' | 'success' | 'error';

/** Acció del toast (p. ex. "Desfés"). En executar-la, el toast es tanca. */
export type ToastAction = { label: string; run: () => void | Promise<void> };

/** Segell animat del registre: "+1 → 38/100" (o només "38/100" si no suma). */
export type ToastSegell = { delta: number; count: number; target: number };

export type ToastItem = {
	id: number;
	message: string;
	tone: ToastTone;
	action?: ToastAction;
	segell?: ToastSegell;
	/** Text addicional només per a lectors de pantalla (p. ex. el comptador del segell). */
	sr?: string;
};

type Timer = { handle: ReturnType<typeof setTimeout> | null; remaining: number; start: number };

class Toasts {
	items = $state<ToastItem[]>([]);
	#next = 1;
	#timers = new Map<number, Timer>();

	show(
		message: string,
		{
			tone = 'info',
			duration = 4000,
			action,
			segell,
			sr
		}: {
			tone?: ToastTone;
			duration?: number;
			action?: ToastAction;
			segell?: ToastSegell;
			sr?: string;
		} = {}
	) {
		const id = this.#next++;
		this.items.push({ id, message, tone, action, segell, sr });
		if (duration > 0) {
			this.#timers.set(id, { handle: null, remaining: duration, start: 0 });
			this.resume(id);
		}
		return id;
	}

	dismiss(id: number) {
		const t = this.#timers.get(id);
		if (t?.handle) clearTimeout(t.handle);
		this.#timers.delete(id);
		this.items = this.items.filter((t) => t.id !== id);
	}

	/** Atura el compte enrere (ratolí a sobre o focus a dins: WCAG 2.2.1). */
	pause(id: number) {
		const t = this.#timers.get(id);
		if (!t?.handle) return;
		clearTimeout(t.handle);
		t.handle = null;
		t.remaining -= Date.now() - t.start;
	}

	resume(id: number) {
		const t = this.#timers.get(id);
		if (!t || t.handle) return;
		t.start = Date.now();
		t.handle = setTimeout(() => this.dismiss(id), Math.max(1000, t.remaining));
	}

	async run(id: number) {
		const toast = this.items.find((t) => t.id === id);
		this.dismiss(id);
		await toast?.action?.run();
	}
}

export const toasts = new Toasts();
