# 09 · Supabase: cuentas, sincronización y configuración del panel

> Fase 5 (bloque 5a, beta privada). Proyecto Supabase `ckqhdryopasitqtwjyys` (región UE, eu-west-1).
> Este documento recoge lo que **el usuario** tiene que configurar a mano en el panel de Supabase.
> Nunca se escriben en el repo ni en el chat la contraseña de la base de datos, la clave
> `service_role` ni la contraseña del buzón de correo.

## 1. Qué hay en la base de datos

Migraciones versionadas en `supabase/migrations/` (aplicadas con la herramienta MCP de Supabase):

| Migración                         | Contenido                                                                                                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0001_cataleg.sql`                | Catálogo en la nube. **No aplicada**: el catálogo vive en `src/lib/data/catalog/*.json` y aún no hace falta en la BD.                                                   |
| `0002_dades_usuari.sql`           | `ascensions` (RLS estricta, LWW, tombstones, cursor `server_updated_at`), `perfils` (alias opcional), RPC `sync_push(files jsonb)` y `esborrar_compte()`.               |
| `0003_sync_push_id_en_us.sql`     | `sync_push` rechaza un id que ya pertenece a otro usuario (antes contaba como aceptado).                                                                                |
| `0004_esborrar_compte_privat.sql` | La parte `security definer` de `esborrar_compte` pasa al esquema `privat` (no expuesto por la API); `public.esborrar_compte()` queda `security invoker` (advisor 0029). |

- `ascensions.cim_id` no tiene FK a `cims` mientras el catálogo no esté cargado en la BD; se valida el rango en el servidor y el catálogo en el cliente.
- Nota: el servidor admite hasta 2000 caracteres (el cliente limita a 500); la fecha se acepta hasta "hoy en Europe/Madrid + 1 día" por relojes desajustados.
- RLS: `user_id = (select auth.uid())` en select, insert, update y delete. `anon` no tiene ningún permiso sobre estas tablas ni sobre las RPC.

## 2. Configuración del panel (la hace el usuario)

### 2.1 Authentication → URL Configuration

- **Site URL:** `https://carnetdecims.cat`
- **Redirect URLs** (añadir todas):
  - `https://carnetdecims.cat/**`
  - `http://localhost:5190/**`
  - la URL de `workers.dev` que se use para la beta, con `/**` al final (p. ej. `https://carnetdecims.<subdominio>.workers.dev/**`)
  - si se usan _preview URLs_ de Cloudflare: `https://*-carnetdecims.<subdominio>.workers.dev/**`

Si la URL de vuelta no está en la lista, Supabase usa la Site URL y el enlace del correo no llega a `/ca/app/compte`.

### 2.2 Authentication → Sign In / Providers → Email

- **Enable Email provider:** activado. **Confirm email:** activado (por defecto).
- **Email OTP Expiration:** 3600 s (1 hora; por defecto) está bien.
- **Email OTP Length:** 6 (la app acepta de 6 a 10 cifras).
- No hace falta activar contraseñas: la app solo usa enlace + código.

### 2.3 Authentication → Email Templates → **Magic Link**

Supabase usa una sola plantilla para todos los idiomas: el correo va en catalán y castellano.
El enlace lleva `token_hash` (funciona aunque se abra en otro navegador o dispositivo y no lo
"gastan" los antivirus que abren enlaces) y el código sirve para la PWA instalada en el iPhone
(allí el enlace se abre en Safari, no en la app).

**Asunto:**

```
Carnet de Cims · El teu codi d'accés / Tu código de acceso
```

**Cuerpo (HTML, pegar tal cual):**

```html
<div
	style="font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; color: #1d1d1b;"
>
	<h2 style="margin: 0 0 16px;">Carnet de Cims</h2>

	<p>Hola!</p>
	<p>Per entrar al teu Carnet de Cims, toca aquest botó:</p>
	<p>
		<a
			href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email"
			style="display: inline-block; padding: 12px 20px; background: #1d1d1b; color: #ffffff; text-decoration: none; border-radius: 8px;"
			>Entra al Carnet de Cims</a
		>
	</p>
	<p>O escriu aquest codi a la app:</p>
	<p
		style="font-size: 28px; font-weight: bold; letter-spacing: 6px; font-family: ui-monospace, monospace;"
	>
		{{ .Token }}
	</p>
	<p style="color: #555;">
		L'enllaç i el codi caduquen d'aquí a una hora i només es poden fer servir una vegada. Si no has
		demanat entrar, pots ignorar aquest correu.
	</p>

	<hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

	<p>¡Hola!</p>
	<p>
		Para entrar en tu Carnet de Cims, pulsa el botón de arriba o escribe este código en la app:
		<strong style="font-family: ui-monospace, monospace;">{{ .Token }}</strong>
	</p>
	<p style="color: #555;">
		El enlace y el código caducan en una hora y solo se pueden usar una vez. Si no has pedido
		entrar, puedes ignorar este correo.
	</p>

	<hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />
	<p style="color: #777; font-size: 12px;">
		Carnet de Cims (carnetdecims.cat) és un web no oficial de seguiment personal del repte 100 Cims.
		No és el registre oficial: la validació la fa la FEEC. · Web no oficial de seguimiento personal
		del reto 100 Cims; no es el registro oficial.
	</p>
</div>
```

**Confirm signup:** con el enlace mágico (`signInWithOtp`) Supabase crea el usuario y envía la
plantilla **Magic Link** también la primera vez; si en alguna prueba llegara la de "Confirm
signup", pegar en ella el mismo cuerpo (cambiando solo el asunto a `Carnet de Cims · Confirma el
teu correu / Confirma tu correo`).

### 2.4 SMTP

> **Bloqueante para la beta.** El SMTP por defecto de Supabase **solo envía a las direcciones
> de los miembros del equipo de la organización** de Supabase; a cualquier otra responde
> "Email address not authorized" (la app lo muestra como error `servidor`). Además, limita a unos
> pocos correos por hora. Es decir: **con el SMTP por defecto, Inesa no recibirá el correo**.
> Opciones antes del viernes:
>
> 1. **Recomendada:** configurar ya el SMTP propio (buzón `hola@carnetdecims.cat`, pasos abajo).
>    Requiere que el buzón de Hostinger exista y que el DNS del dominio esté activo.
> 2. Si el buzón aún no existe: otro proveedor SMTP con dominio verificado (Resend, Brevo…) con el
>    remitente `hola@carnetdecims.cat`. No usar el Gmail personal (expondría el nombre real).
> 3. No recomendada: invitar a Inesa como miembro del equipo de Supabase (le daría acceso al panel
>    y a los datos de todos los usuarios).
>
> El usuario (JSR) sí recibe correos con el SMTP por defecto: sirve para probar el flujo hoy.

- **SMTP propio (antes de la beta):** SMTP del buzón de Hostinger
  `hola@carnetdecims.cat`. Pasos (los hace el usuario; la contraseña se escribe **solo en el
  panel**, nunca en el chat ni en el repo):
  1. hPanel de Hostinger → Correos → `hola@carnetdecims.cat` → comprobar la configuración SMTP
     (habitualmente servidor `smtp.hostinger.com`, puerto `465` con SSL).
  2. Supabase → Project Settings → Authentication → **SMTP Settings** → _Enable Custom SMTP_.
  3. Sender email: `hola@carnetdecims.cat` · Sender name: `Carnet de Cims` · Host, puerto,
     usuario (`hola@carnetdecims.cat`) y contraseña del buzón.
  4. En el DNS del dominio, revisar **SPF**, **DKIM** y **DMARC** de Hostinger (si no, los correos
     acaban en spam).
  5. Authentication → Rate Limits: subir "emails per hour" (p. ej. 30–100) una vez activo el SMTP.
  6. Enviar una prueba a Gmail y a Outlook y mirar que no caiga en spam.

### 2.5 Otras recomendaciones del panel

- Authentication → Rate Limits: dejar los límites de OTP por defecto (protegen de abuso).
- Authentication → Attack Protection: activar CAPTCHA más adelante si hay abuso (exige cambio en la app).
- Database → Backups: el plan gratuito no tiene PITR; para la beta, exportar de vez en cuando
  (`exportarDadesCompte` por usuario o un `pg_dump` hecho por el usuario).

## 3. Variables de entorno

- `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_PUBLISHABLE_KEY` (clave **publicable** `sb_publishable_…`).
  Son públicas por diseño: lo que protege los datos es la RLS.
- Local: `.env` (no versionado; plantilla en `.env.example`).
- Producción: `vars` de `wrangler.jsonc`. El build las lee de allí si no hay `.env`
  (`src/lib/platform/plugin-env-supabase.ts`), porque `$env/static/public` se resuelve al compilar.

## 4. Contrato para la UI

- `src/lib/data/compte.ts`: `sessio` (store `{ estat: 'carregant' | 'anonim' | 'autenticat', usuari? }`),
  `compteDisponible()`, `entrarAmbEmail(email, { redirectTo })`, `verificarCodi(email, codi)`,
  `completarEntradaDesDeUrl()`, `sortir({ esborrarDades? })`, `esborrarCompte({ conservarDispositiu? })`,
  `exportarDadesCompte()`, `ErrorCompte` (`codi`).
- `src/lib/data/sync.ts`: `estatSync` (store `{ pendents, ultimaSync, sincronitzant, actiu, error?, conflicte? }`),
  `sincronitzarAra()`, `resoldreConflicteCompte('fusionar' | 'descartar-locals')`.

Flujo de sincronización y reglas LWW: `docs/03-modelo-datos.md` §2 y cabecera de `src/lib/data/sync.ts`.

## 5. Pendiente / decisiones abiertas

- **Deduplicación** de ascensiones repetidas entre dispositivos (§2, paso 3 de 03): no está en la
  beta. Con UUIDv7 no hay colisiones, pero la misma salida apuntada en dos móviles aparecerá dos veces.
- Al **cerrar sesión**, los datos se quedan en el dispositivo marcados como del usuario que sale (si
  entra otra cuenta, se le pregunta). Difiere de 03 §2.6 ("vuelven a ser anónimos"): así no se
  mezclan cuentas sin preguntar.
- Google OAuth: no está en la beta (solo correo).
