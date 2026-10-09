/**
 * Tipus de la BD de Supabase (esquema `public`), generats amb `generate_typescript_types` després
 * de les migracions 0002–0004 (`supabase/migrations/`). Regenerar-los quan canviï l'esquema.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type MetodeSql = 'a_peu' | 'btt' | 'esqui' | 'raquetes';

export type Database = {
	__InternalSupabase: {
		PostgrestVersion: '14.18';
	};
	public: {
		Tables: {
			ascensions: {
				Row: {
					cim_id: number;
					created_at: string;
					data: string;
					deleted_at: string | null;
					id: string;
					metode: MetodeSql;
					nota: string | null;
					server_updated_at: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					cim_id: number;
					created_at: string;
					data: string;
					deleted_at?: string | null;
					id: string;
					metode: MetodeSql;
					nota?: string | null;
					server_updated_at?: string;
					updated_at: string;
					user_id?: string;
				};
				Update: {
					cim_id?: number;
					created_at?: string;
					data?: string;
					deleted_at?: string | null;
					id?: string;
					metode?: MetodeSql;
					nota?: string | null;
					server_updated_at?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			perfils: {
				Row: {
					alias: string | null;
					created_at: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					alias?: string | null;
					created_at?: string;
					updated_at?: string;
					user_id?: string;
				};
				Update: {
					alias?: string | null;
					created_at?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
		};
		Views: { [_ in never]: never };
		Functions: {
			esborrar_compte: { Args: never; Returns: undefined };
			sync_push: { Args: { files: Json }; Returns: Json };
		};
		Enums: { metode: MetodeSql };
		CompositeTypes: { [_ in never]: never };
	};
};

export type FilaAscensioSql = Database['public']['Tables']['ascensions']['Row'];
