/**
 * Instal·lació de la PWA (implementació web). docs/05-frontend-arquitectura.md §2:
 *
 * - Android i escriptori: es captura `beforeinstallprompt` i es mostra un avís propi
 *   **després d'un registre** (mai en entrar), descartable i que no torna si es rebutja.
 * - iOS (Safari no instal·lat): no hi ha esdeveniment; es mostra un full amb instruccions
 *   "Comparteix → Afegeix a la pantalla d'inici".
 * - En mode `standalone` (ja instal·lada) no es mostra res.
 *
 * Els components el llegeixen d'aquí; a Capacitor no caldrà (l'app ja és nativa).
 */

/** `beforeinstallprompt` (Chromium); no és a lib.dom. */
interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>;
}

/** Preferència local: l'avís automàtic s'ha rebutjat (o ja s'ha instal·lat). */
export const CLAU_AVIS_REBUTJAT = 'carnetdecims:avis-installacio';

function llegeix(clau: string): string | null {
	try {
		return localStorage.getItem(clau);
	} catch {
		return null;
	}
}

function desa(clau: string, valor: string) {
	try {
		localStorage.setItem(clau, valor);
	} catch {
		// Mode privat o emmagatzematge bloquejat: l'avís pot tornar en una altra sessió.
	}
}

/** iPhone, iPod o iPad (també l'iPad que s'anuncia com a Mac amb pantalla tàctil). */
export function esIos(nav: Pick<Navigator, 'userAgent' | 'maxTouchPoints'>): boolean {
	return (
		/iPad|iPhone|iPod/.test(nav.userAgent) ||
		(/Macintosh/.test(nav.userAgent) && nav.maxTouchPoints > 1)
	);
}

class Installacio {
	/** L'app s'executa instal·lada (`display-mode: standalone` o `navigator.standalone` a iOS). */
	standalone = $state(false);
	/** iOS sense instal·lar: cal explicar-ho amb el full d'instruccions. */
	ios = $state(false);
	/** L'avís automàtic (després d'un registre) està esperant el moment de mostrar-se. */
	avisPendent = $state(false);
	/** Full d'instruccions d'iOS obert. */
	fullIos = $state(false);
	#prompt = $state<BeforeInstallPromptEvent | null>(null);
	#started = false;

	/** El navegador ofereix el diàleg d'instal·lació natiu (Chromium). */
	get natiu(): boolean {
		return this.#prompt !== null;
	}

	/** Es pot oferir "Instal·la l'app" (natiu o amb instruccions d'iOS). */
	get disponible(): boolean {
		return !this.standalone && (this.natiu || this.ios);
	}

	/** Comença a escoltar. Retorna la funció per aturar-ho. */
	start(): () => void {
		if (typeof window === 'undefined' || this.#started) return () => {};
		this.#started = true;
		const mq = window.matchMedia('(display-mode: standalone)');
		const actualitza = () => {
			this.standalone =
				mq.matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
			this.ios = !this.standalone && esIos(navigator);
		};
		actualitza();

		const capturar = (e: Event) => {
			// Sense el mini-infobar del navegador: l'avís el decideix l'app.
			e.preventDefault();
			this.#prompt = e as BeforeInstallPromptEvent;
		};
		const installada = () => {
			this.#prompt = null;
			this.avisPendent = false;
			desa(CLAU_AVIS_REBUTJAT, 'installada');
		};
		window.addEventListener('beforeinstallprompt', capturar);
		window.addEventListener('appinstalled', installada);
		mq.addEventListener('change', actualitza);
		return () => {
			this.#started = false;
			window.removeEventListener('beforeinstallprompt', capturar);
			window.removeEventListener('appinstalled', installada);
			mq.removeEventListener('change', actualitza);
		};
	}

	/**
	 * Després de registrar una ascensió: si es pot instal·lar i l'avís no s'ha rebutjat mai,
	 * queda pendent (el mostra `AvisInstallacio` quan no hi ha toasts ni fulls oberts).
	 */
	despresDeRegistrar() {
		if (this.disponible && llegeix(CLAU_AVIS_REBUTJAT) === null) this.avisPendent = true;
	}

	/** "Ara no" o tancar l'avís: no torna a sortir sol (el Perfil sempre l'ofereix). */
	rebutjar() {
		this.avisPendent = false;
		desa(CLAU_AVIS_REBUTJAT, 'rebutjat');
	}

	/**
	 * Instal·la: diàleg natiu (un sol ús per esdeveniment) o, a iOS, el full d'instruccions.
	 * Retorna `true` si l'usuari l'ha acceptat.
	 */
	async installar(): Promise<boolean> {
		const prompt = this.#prompt;
		if (!prompt) {
			if (this.ios) this.fullIos = true;
			return false;
		}
		this.#prompt = null;
		this.avisPendent = false;
		try {
			await prompt.prompt();
			const { outcome } = await prompt.userChoice;
			desa(CLAU_AVIS_REBUTJAT, outcome === 'accepted' ? 'installada' : 'rebutjat');
			return outcome === 'accepted';
		} catch {
			return false;
		}
	}
}

export const installacio = new Installacio();
