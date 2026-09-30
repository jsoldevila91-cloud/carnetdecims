// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			/** Full inferior obert amb shallow routing (el botó enrere el tanca). */
			sheet?: 'registrar' | 'editar' | 'segell';
			/** Registrar: slug del cim preseleccionat (des de la fitxa). */
			cim?: string;
			/** Editar / detall del segell: id de l'ascensió. */
			ascensio?: string;
		}
	}
}

export {};
