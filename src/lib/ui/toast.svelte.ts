/** Cua de notificacions breus. La mostra `<Toaster />` (un sol cop, al layout arrel). */

export type ToastTone = 'info' | 'success' | 'error';

export type ToastItem = {
	id: number;
	message: string;
	tone: ToastTone;
};

class Toasts {
	items = $state<ToastItem[]>([]);
	#next = 1;

	show(
		message: string,
		{ tone = 'info', duration = 4000 }: { tone?: ToastTone; duration?: number } = {}
	) {
		const id = this.#next++;
		this.items.push({ id, message, tone });
		if (duration > 0) setTimeout(() => this.dismiss(id), duration);
		return id;
	}

	dismiss(id: number) {
		this.items = this.items.filter((t) => t.id !== id);
	}
}

export const toasts = new Toasts();
