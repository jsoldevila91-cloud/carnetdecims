# 08 · Ideas de producto (2026-10-05)

> Ideas del usuario aterrizadas por Claude. El equipo de agentes las afinará al planificar cada bloque.
> Principios: lo que funciona **sin cuenta y en el dispositivo** va antes del lanzamiento; lo que necesita **servidor, cuentas o datos de otros usuarios** va tras la fase 5. Nada que comprometa la privacidad sin consentimiento explícito.

## 1. Visión: "Carnet de Cims" es un carnet de montaña, no solo del 100 Cims

**Idea:** que la web no parezca 100 % centrada en el 100 Cims; que este sea el reto destacado, entre otros.

**Cómo:**

- Portada y app: el mensaje principal pasa de "seguiment del repte 100 Cims" a **"el teu carnet de muntanya"**. El 100 Cims aparece como **reto destacado** (tarjeta grande), con los demás retos al lado.
- Navegación: una sección **"Reptes"** (lista de retos con progreso y medallas). El carnet I–V sigue siendo el del 100 Cims.
- El catálogo de cimas crece **poco a poco con datos del ICGC** (decisión del usuario), más allá de las 522, de modo que haya cimas que no pertenecen al 100 Cims.
- **SEO:** se mantienen las páginas del 100 Cims (tienen búsquedas) y se añaden páginas de otros retos.

## 2. Retos propios paralelos y medallas

**Idea:** retos divertidos además del 100 Cims, con medallas en el perfil.

**Cómo (motor genérico):**

- Un reto es un **dato**, no código: `{ id, nom, descripcio, condicio }`, donde la condición combina un **conjunto de cimas** (filtro: comarca, zona, altitud, esencial, massís, lista fija) con una **regla** (N cimas distintas, todas, una por comarca, una por estación del año, en un periodo, con un método…).
- Función pura `avaluarRepte(repte, ascensions, cataleg)` → `{ progres, completat, dataCompletat, pendents }`. Medalla al completarlo, con fecha. Todo funciona **sin cuenta**.

**Propuestas de retos iniciales** (para elegir):

| Reto                    | Regla                                                                           |
| ----------------------- | ------------------------------------------------------------------------------- |
| **Totes les comarques** | 1 cima en cada comarca (+ Andorra y Catalunya Nord)                             |
| **Sostres comarcals**   | el punto más alto de cada comarca (requiere ampliar el catálogo con el ICGC)    |
| **Tresmils**            | todas las cimas ≥ 3.000 m del catálogo                                          |
| **Les 4 estacions**     | 1 cima en primavera, estiu, tardor e hivern del mismo año                       |
| **12 mesos, 12 cims**   | 1 cima nueva cada mes durante un año                                            |
| **Hivernal**            | X cimas con método esquí o raquetes                                             |
| **Massissos**           | todas las cimas de un macizo (Montseny, Montserrat, Sant Llorenç, Ports, Cadí…) |
| **Mar i muntanya**      | cimas con vista al mar / comarcas costeras                                      |
| **Cims amb nens**       | X cimas del listado familiar                                                    |
| **Repte infantil**      | ya existe (50 cimas, de 7 a 14 años)                                            |

**Ojo con la marca:** los retos propios llevan nombres propios, nunca "100 Cims X".

## 3. Estadísticas personales en el perfil

**Sin cuenta (antes del lanzamiento):**

- **% por comarca** (ya existe parcialmente en `/app/comarques`), **% por reto**, % de esenciales, % del catálogo total.
- **"El cim que més has fet"**: contador de ascensiones por cima (las repeticiones ya se guardan) y ranking personal.
- **"El cim més llunyà"**: requiere que el usuario indique **su municipio de origen** (lista de municipios del ICGC, no la dirección exacta; se guarda solo en el dispositivo; opcional). La distancia es la del municipio a la cima.
- Otros datos fáciles: altitud acumulada de las cimas, cima más alta, primer y último sello, mejor año, racha de meses seguidos con alguna cima.

**Con cuentas (fase 5+):**

- **"Ets del X % que més cims ha pujat"**: percentil calculado en el servidor con datos **agregados y anónimos** de los usuarios con cuenta. Requiere **consentimiento** (opt-in) y explicarlo en la política de privacidad. No se muestra con pocos usuarios (umbral mínimo para no identificar a nadie).

## 4. Compartir el carnet con un amigo

**Sin cuenta (antes del lanzamiento):**

- **Imagen para compartir**: tarjeta generada en el móvil (carnet con sellos, nº de cimas, medallas) que se comparte con el menú nativo (`navigator.share`) por WhatsApp o Instagram. No sale ningún dato a nuestro servidor.
- **Enlace de solo lectura sin servidor**: la lista de cimas y fechas comprimida dentro del propio enlace (`/carnet#…`). Quien lo abre ve el carnet sin poder editarlo. Sin nombre ni datos personales salvo que el usuario los añada.

**Con cuentas:**

- Perfil público opcional (`/u/{alias}`), activado por el usuario, que se puede desactivar. Amigos o seguidores, más adelante.

## 5. Fotos por cima (futuro) e Instagram

**Preparar ya (sin implementar):** en el modelo de datos, el campo `fotos` en la ascensión y el diseño del almacenamiento (Supabase Storage, UE).

**Cuando llegue (con cuentas):**

- Subida con compresión en el móvil y **eliminación de los metadatos EXIF** (incluida la posición GPS) antes de subir.
- **Permiso explícito por foto** para publicarla en el Instagram oficial de Carnet de Cims, con el **usuario de Instagram** para etiquetarlo y la posibilidad de retirar el permiso. Texto de cesión de derechos claro (licencia no exclusiva, revocable).
- Moderación antes de publicar; límites de tamaño y número; política de privacidad y aviso legal actualizados.

## 6. Utilidad real (por qué usar la app más allá de los sellos)

Ordenado por valor y esfuerzo:

1. **Preparar la validación oficial**: exportar las ascensiones en el formato que pide el club o la FEEC (PDF o CSV listo para imprimir o enviar), con el aviso de > 100 al año y de restricciones. _Valor alto, esfuerzo bajo._
2. **"El teu proper cim"**: recomendación de cimas pendientes según cercanía al municipio de origen, dificultad, época del año y meteo del fin de semana. _Valor alto._
3. **Planificador**: ya hay ficha, rutas, meteo a la altitud de la cima, restricciones, mapa offline y Wikiloc; reunirlo en una vista "Planifica una sortida".
4. **Diari de muntanya**: notas, compañeros y (más adelante) fotos de cada ascensión; recuerdos ordenados.
5. **Alertas** (con cuentas o notificaciones push): restricción que empieza en una cima pendiente, buen tiempo el fin de semana en una cima pendiente cercana.
6. **Retos y medallas** (punto 2) y **estadísticas** (punto 3).

## Encaje en el plan (propuesta)

| Bloque                       | Cuándo                                | Contenido                                                                                                                                                 |
| ---------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **R1 · Estadístiques**       | antes del lanzamiento (tras la 6)     | municipio de origen (opcional, local), "cim que més has fet", "cim més llunyà", % por comarca, por reto y del catálogo, otros datos                       |
| **R2 · Reptes i medalles**   | antes del lanzamiento                 | motor de retos (dato + función pura), 4–6 retos iniciales, sección "Reptes", medallas en el perfil, rediseño de mensajes (100 Cims destacado entre otros) |
| **R3 · Compartir i validar** | antes del lanzamiento                 | imagen del carnet para compartir, enlace de solo lectura sin servidor, exportación para validación oficial                                                |
| **R4 · Proper cim**          | antes o justo después del lanzamiento | recomendación según origen, dificultad, época y meteo                                                                                                     |
| **Fase 5+**                  | con cuentas                           | percentil anónimo con opt-in, perfil público, amigos, fotos con permiso para Instagram, alertas push                                                      |
| **Catálogo**                 | continuo                              | ampliación poco a poco con datos del ICGC (más allá de las 150), sin copiar la tabla de la FEEC                                                           |

## Decisiones abiertas para el usuario

1. ¿Qué retos iniciales del punto 2 te gustan (o propones otros)?
2. ¿Hacemos R1–R3 **antes del lanzamiento** (retrasa la fase 7 unas 3 sesiones) o lanzamos antes y los añadimos después?
3. Percentiles y fotos: ¿de acuerdo en hacerlos solo con cuentas y consentimiento explícito?
