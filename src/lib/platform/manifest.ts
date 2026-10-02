/**
 * Manifest de la PWA, un per idioma (`/manifest-ca.webmanifest`, `/manifest-es.webmanifest`),
 * prerenderitzat a `src/routes/manifest-[lang].webmanifest`. docs/05-frontend-arquitectura.md §2.
 *
 * Les icones les genera `npm run pwa:icones` (`scripts/pwa/icones.ts`) i les captures
 * `scripts/pwa/captures.ts`; tots dos escriuen a `static/`.
 */
import { localizePath, type AppLocale } from '$lib/i18n/routes';
import { m } from '$lib/paraglide/messages';

/** `--c-paper` del tema clar (tokens.css): barra d'estat i pantalla d'inici. */
export const COLOR_TEMA = '#f6f2e9';
/** `--c-paper` del tema fosc: només per al `<meta name="theme-color">` amb `media`. */
export const COLOR_TEMA_FOSC = '#10172a';

/** Camí del manifest de cada idioma (l'enllaça `src/app.html`). */
export const manifestPath = (locale: AppLocale) => `/manifest-${locale}.webmanifest` as const;

export interface WebManifest {
	id: string;
	name: string;
	short_name: string;
	description: string;
	lang: string;
	dir: 'ltr';
	start_url: string;
	scope: string;
	display: 'standalone';
	theme_color: string;
	background_color: string;
	categories: string[];
	icons: Array<{ src: string; sizes: string; type: string; purpose?: string }>;
	shortcuts: Array<{
		name: string;
		short_name?: string;
		url: string;
		icons: Array<{ src: string; sizes: string; type: string }>;
	}>;
	screenshots: Array<{
		src: string;
		sizes: string;
		type: string;
		form_factor: 'narrow' | 'wide';
		label: string;
	}>;
}

/** Mides de les captures (`scripts/pwa/captures.ts`): mòbil 9:16 i escriptori 16:9. */
export const CAPTURES = {
	narrow: { amplada: 1080, alcada: 1920 },
	wide: { amplada: 1920, alcada: 1080 }
} as const;

const ICONA_DRECERA = [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }];

export function webManifest(locale: AppLocale): WebManifest {
	const opts = { locale };
	const app = (path: string, font = 'pwa') => `${localizePath(path, locale)}?source=${font}`;
	return {
		// Mateix `id` en tots dos idiomes: és una sola app encara que s'instal·li des de /es.
		id: '/app',
		name: 'Carnet de Cims',
		short_name: 'Carnet de Cims',
		description: m.pwa_manifest_description({}, opts),
		lang: locale,
		dir: 'ltr',
		start_url: app('/app'),
		scope: '/',
		display: 'standalone',
		theme_color: COLOR_TEMA,
		background_color: COLOR_TEMA,
		categories: ['sports', 'travel', 'lifestyle'],
		icons: [
			{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
			{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
			{
				src: '/icons/maskable-512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable'
			},
			{
				src: '/icons/monochrome-512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'monochrome'
			}
		],
		shortcuts: [
			{
				name: m.pwa_shortcut_register({}, opts),
				url: app('/app/registrar', 'pwa-drecera'),
				icons: ICONA_DRECERA
			},
			{
				name: m.pwa_shortcut_map({}, opts),
				url: app('/mapa', 'pwa-drecera'),
				icons: ICONA_DRECERA
			},
			{
				name: m.pwa_shortcut_nearby({}, opts),
				url: app('/app/a-prop', 'pwa-drecera'),
				icons: ICONA_DRECERA
			},
			{
				name: m.pwa_shortcut_carnet({}, opts),
				url: app('/app', 'pwa-drecera'),
				icons: ICONA_DRECERA
			}
		],
		screenshots: (['narrow', 'wide'] as const).map((form_factor) => ({
			src: `/screenshots/${locale}-${form_factor}.webp`,
			sizes: `${CAPTURES[form_factor].amplada}x${CAPTURES[form_factor].alcada}`,
			type: 'image/webp',
			form_factor,
			label:
				form_factor === 'narrow'
					? m.pwa_screenshot_narrow({}, opts)
					: m.pwa_screenshot_wide({}, opts)
		}))
	};
}
