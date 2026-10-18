# 13 · Entrar con correo + contraseña (Supabase Auth)

> Fase 5. Tercera vía de entrada, **no la principal**: el orden de la pantalla es Google, después
> correo + contraseña y, al final, "Prefereixo rebre un enllaç o un codi". El código está listo y
> **desactivado**: solo aparece si el build tiene `PUBLIC_PASSWORD_AUTH=true` (`wrangler.jsonc` →
> `vars`, o `.env` en local).
>
> La contraseña la guarda Supabase cifrada (bcrypt); la app nunca la ve ni la guarda. Nunca se
> escribe una contraseña real en el repo ni en el chat.

Por qué existe: es lo que esperan muchos usuarios, en la PWA del iPhone evita el viaje a Safari del
enlace del correo y no gasta envíos del SMTP de Hostinger (solo al registrarse y al recuperar la
contraseña).

Datos fijos:

- Proyecto Supabase `ckqhdryopasitqtwjyys` (UE), organización en **plan Free**.
- Vuelta de los correos: `/ca/app/compte` o `/es/app/cuenta` (ya están en las Redirect URLs de
  `docs/09` §2.1).
- Una cuenta = un correo. Quien hoy entra con enlace o con Google puede **crear** una contraseña
  desde su perfil; quien se registra con contraseña puede seguir entrando con enlace o con Google
  (mismo correo verificado).

## 1. Authentication → Sign In / Providers → Email

(https://supabase.com/dashboard/project/ckqhdryopasitqtwjyys/auth/providers)

1. **Enable Email provider:** activado (ya lo está).
2. **Confirm email:** activado (ya lo está). Sin confirmar el correo no se puede entrar con
   contraseña (la app lo dice y ofrece reenviar el correo).
3. **Secure password change:** **desactivado**. Si se activa, Supabase exige haber entrado hace
   poco para cambiar la contraseña y la app pediría volver a entrar (error `reautenticacio`).
4. **Secure email change:** como esté (la app no cambia el correo).
5. **Minimum password length:** `10` (la app ya exige 10 antes de enviar; así el servidor también).
6. **Password requirements:** _No required characters_ (recomendación del NIST: longitud, no
   mezclas obligatorias).
7. **Prevent use of leaked passwords** (comprobación con HaveIBeenPwned): **solo en planes Pro o
   superiores**. Con el plan Free no aparece o no se puede activar. La app ya traduce el error
   (`contrasenya:filtrada`) por si algún día se activa. No se comprueba desde el navegador para no
   mandar nada a un tercero.
8. **Save**.

## 2. Authentication → Email Templates

Supabase usa una sola plantilla por tipo para todos los idiomas: los correos van en catalán y
castellano, como el de Magic Link (`docs/09` §2.3). El enlace lleva `token_hash`: funciona aunque
se abra en otro navegador o dispositivo.

### 2.1 Reset Password

**Asunto:**

```
Carnet de Cims · Tria una contrasenya nova / Elige una contraseña nueva
```

**Cuerpo (HTML, pegar tal cual):**

```html
<div
	style="font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; color: #1d1d1b;"
>
	<h2 style="margin: 0 0 16px;">Carnet de Cims</h2>

	<p>Hola!</p>
	<p>Has demanat una contrasenya nova per al teu Carnet de Cims. Prem aquest botó per triar-la:</p>
	<p>
		<a
			href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery"
			style="display: inline-block; padding: 12px 20px; background: #1d1d1b; color: #ffffff; text-decoration: none; border-radius: 8px;"
			>Tria una contrasenya nova</a
		>
	</p>
	<p style="color: #555;">
		L'enllaç caduca d'aquí a una hora i només es pot fer servir una vegada. Si no ho has demanat tu,
		pots ignorar aquest correu: la teva contrasenya no canviarà.
	</p>

	<hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

	<p>¡Hola!</p>
	<p>
		Has pedido una contraseña nueva para tu Carnet de Cims. Pulsa el botón de arriba para elegirla.
	</p>
	<p style="color: #555;">
		El enlace caduca en una hora y solo se puede usar una vez. Si no lo has pedido tú, puedes
		ignorar este correo: tu contraseña no cambiará.
	</p>

	<hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />
	<p style="color: #777; font-size: 12px;">
		Carnet de Cims (carnetdecims.cat) és un web no oficial de seguiment personal del repte 100 Cims.
		No és el registre oficial: la validació la fa la FEEC. · Web no oficial de seguimiento personal
		del reto 100 Cims; no es el registro oficial: la validación la hace la FEEC.
	</p>
</div>
```

### 2.2 Confirm signup

Es el correo que recibe quien se registra con contraseña. `type=email` es el mismo que usa el
enlace de acceso, así que la app ya lo entiende; el código sirve para la PWA del iPhone.

**Asunto:**

```
Carnet de Cims · Confirma el teu correu / Confirma tu correo
```

**Cuerpo (HTML, pegar tal cual):**

```html
<div
	style="font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; color: #1d1d1b;"
>
	<h2 style="margin: 0 0 16px;">Carnet de Cims</h2>

	<p>Hola!</p>
	<p>Gràcies per crear el teu Carnet de Cims. Prem aquest botó per confirmar el correu i entrar:</p>
	<p>
		<a
			href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email"
			style="display: inline-block; padding: 12px 20px; background: #1d1d1b; color: #ffffff; text-decoration: none; border-radius: 8px;"
			>Confirma el correu</a
		>
	</p>
	<p>O escriu aquest codi a l'app:</p>
	<p
		style="font-size: 28px; font-weight: bold; letter-spacing: 6px; font-family: ui-monospace, monospace;"
	>
		{{ .Token }}
	</p>
	<p style="color: #555;">
		L'enllaç i el codi caduquen d'aquí a una hora. Si no has creat cap compte, pots ignorar aquest
		correu.
	</p>

	<hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

	<p>¡Hola!</p>
	<p>
		Gracias por crear tu Carnet de Cims. Pulsa el botón de arriba para confirmar el correo y entrar,
		o escribe este código en la app:
		<strong style="font-family: ui-monospace, monospace;">{{ .Token }}</strong>
	</p>
	<p style="color: #555;">
		El enlace y el código caducan en una hora. Si no has creado ninguna cuenta, puedes ignorar este
		correo.
	</p>

	<hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />
	<p style="color: #777; font-size: 12px;">
		Carnet de Cims (carnetdecims.cat) és un web no oficial de seguiment personal del repte 100 Cims.
		No és el registre oficial: la validació la fa la FEEC. · Web no oficial de seguimiento personal
		del reto 100 Cims; no es el registro oficial: la validación la hace la FEEC.
	</p>
</div>
```

### 2.3 Password Changed (si aparece en el panel)

Si el panel ofrece la notificación "Password changed" (avisos de seguridad), activarla. Es
opcional.

- **Asunto:** `Carnet de Cims · La contrasenya ha canviat / Tu contraseña ha cambiado`
- **Texto ca:** "La contrasenya del teu Carnet de Cims ha canviat. Si no has estat tu, entra amb
  un enllaç del correu, tria'n una de nova i escriu-nos a hola@carnetdecims.cat."
- **Texto es:** "La contraseña de tu Carnet de Cims ha cambiado. Si no has sido tú, entra con un
  enlace del correo, elige una nueva y escríbenos a hola@carnetdecims.cat."

## 3. Authentication → Rate Limits

Los valores por defecto están bien. Entrar con contraseña no envía correos; registrarse y
"He oblidat la contrasenya" sí, y cuentan en el mismo límite de correos por hora que el enlace
(`docs/09` §2.4). Si hay abuso: CAPTCHA (Attack Protection), que exige un cambio en la app.

## 4. Activar en la app

1. Probar en local con una **cuenta de prueba** (nunca la cuenta real en `localhost`): `.env` con
   `PUBLIC_PASSWORD_AUTH=true`, `npm run dev` y `http://localhost:5190/ca/app/compte`. Probar:
   crear cuenta → correo de confirmación → entrar; "He oblidat la contrasenya" → correo → nueva
   contraseña; desde el perfil, crear la contraseña de una cuenta que entraba con enlace.
2. En `wrangler.jsonc` → `vars`: `"PUBLIC_PASSWORD_AUTH": "true"`, compilar (con
   `PUBLIC_MODE_BETA=true` mientras dure la beta) y `npx wrangler deploy`.
3. Al activarlo: cambiar la fecha `actualitzat` de la privacitat (`src/lib/content/privacitat.ts`;
   la variante con contraseña ya está escrita y la elige `privacitatSegons`) y poner el `id` y la
   `data` del día de activación a la novedad `*-contrasenya` de
   `src/lib/content/novetats-llista.ts` (solo se muestra con el flag activo; debe quedar la
   primera de la lista).

## 5. Notas

- Supabase no dice si un correo ya existe al registrarse (para no revelar quién tiene cuenta): si
  existe, no envía nada y la app muestra el mismo mensaje ("si ja tens compte, entra o restableix
  la contrasenya").
- La contraseña tiene un máximo de 72 bytes (límite de bcrypt).
- El gestor de contraseñas del navegador funciona: los campos llevan `autocomplete="email"`,
  `current-password` y `new-password`.
