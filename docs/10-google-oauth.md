# 10 · Entrar con Google (Supabase Auth)

> Fase 5. El código está listo y **desactivado**: el botón "Continua amb Google" solo aparece si
> el build tiene `PUBLIC_GOOGLE_AUTH=true` (`wrangler.jsonc` → `vars`, o `.env` en local).
> Las credenciales las crea el usuario. **Nunca** se escribe el _client secret_ en el repo ni en el
> chat: solo va en el panel de Supabase.

Datos fijos:

- Proyecto Supabase: `ckqhdryopasitqtwjyys` (UE).
- URL de retorno de Google (callback de Supabase):
  `https://ckqhdryopasitqtwjyys.supabase.co/auth/v1/callback`
- La app vuelve a `/ca/app/compte` o `/es/app/cuenta` con `?code=` (PKCE); `completarEntradaDesDeUrl`
  hace el intercambio. Esas URLs ya están en las Redirect URLs de Supabase (`docs/09` §2.1).

## 1. Google Cloud Console (https://console.cloud.google.com)

1. **Crear un proyecto** nuevo: nombre `Carnet de Cims` (sin organización está bien).
2. **APIs y servicios → Pantalla de consentimiento de OAuth** (en la consola nueva: _Google Auth
   Platform → Branding / Audience / Data access_):
   - Tipo de usuario: **Externo**.
   - Nombre de la app: `Carnet de Cims`. Correo de asistencia: `hola@carnetdecims.cat`.
   - Logo: opcional (si se sube, Google pide verificar la marca; sin logo no hace falta revisión).
   - Página principal: `https://carnetdecims.cat/ca`.
   - Política de privacidad: `https://carnetdecims.cat/ca/privacitat`.
   - Condiciones del servicio: `https://carnetdecims.cat/ca/avis-legal`.
   - Dominios autorizados: `carnetdecims.cat` y `supabase.co`.
   - Contacto del desarrollador: `hola@carnetdecims.cat`.
   - **Permisos (scopes):** solo `openid`, `.../auth/userinfo.email` y `.../auth/userinfo.profile`
     (no sensibles: no requieren verificación de Google).
   - **Audience / Estado de publicación:** mientras se prueba, "Testing" con tu correo como
     usuario de prueba; para el lanzamiento, **"Publicar app" (In production)**. Con solo esos
     tres scopes la publicación es inmediata.
3. **Credenciales → Crear credenciales → ID de cliente de OAuth** (_Clients → Create client_):
   - Tipo: **Aplicación web**. Nombre: `Carnet de Cims (Supabase)`.
   - **Orígenes de JavaScript autorizados:**
     - `https://carnetdecims.cat`
     - `https://carnetdecims.carnetdecims.workers.dev`
     - `http://localhost:5190`
   - **URI de redireccionamiento autorizados** (solo una):
     - `https://ckqhdryopasitqtwjyys.supabase.co/auth/v1/callback`
   - Guardar y copiar el **ID de cliente** y el **secreto del cliente** (el secreto solo se pega
     en Supabase, paso 2).

## 2. Supabase (https://supabase.com/dashboard/project/ckqhdryopasitqtwjyys)

1. **Authentication → Sign In / Providers → Google:** activar, pegar _Client ID_ y _Client Secret_.
   "Skip nonce checks": desactivado. "Allow users without an email": desactivado.
2. **Authentication → URL Configuration:** comprobar que siguen la Site URL
   `https://carnetdecims.cat` y las Redirect URLs de `docs/09` §2.1 (`https://carnetdecims.cat/**`,
   `https://carnetdecims.carnetdecims.workers.dev/**`, `http://localhost:5190/**`).
3. **Vinculación de cuentas:** Supabase une automáticamente la identidad de Google a la cuenta
   existente con el **mismo correo verificado** (quien ya entra por correo y luego pulsa Google
   conserva sus ascensiones). No hay que activar nada.

## 3. Activar el botón en la app

1. Probar en local: `.env` con `PUBLIC_GOOGLE_AUTH=true`, `npm run dev` y entrar desde
   `http://localhost:5190/ca/app/compte`.
2. En `wrangler.jsonc` → `vars`: `"PUBLIC_GOOGLE_AUTH": "true"`, compilar (con
   `PUBLIC_MODE_BETA=true` mientras dure la beta) y `npx wrangler deploy`.
3. Antes de activarlo en producción: revisar la página de privacidad (Google como medio de
   acceso: qué datos llegan — nombre, correo y foto de perfil — y que no se usan para nada más).

## 4. Notas

- La pantalla de Google dirá "continuar a **ckqhdryopasitqtwjyys.supabase.co**". Para que diga
  `carnetdecims.cat` hace falta el _custom domain_ de Supabase (complemento de pago, p. ej.
  `auth.carnetdecims.cat`); entonces la URI de redirección de Google pasa a ser
  `https://auth.carnetdecims.cat/auth/v1/callback`.
- **Sin probar en la PWA instalada del iPhone:** si iOS abre Google en Safari en lugar de dentro de
  la PWA, la sesión se queda en Safari; en ese caso, en la PWA se entra con el **código** de correo,
  como hoy. Probarlo en un iPhone real antes del lanzamiento.
- Apple Sign-In: cuando llegue la app iOS (Capacitor).
