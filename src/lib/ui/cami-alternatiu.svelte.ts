/**
 * Camí intern de la pàgina actual en cada idioma, quan no és el mateix camí amb el segment
 * traduït: p. ex. el detall d'un repte, que té slug propi per idioma (`/app/reptes/repte-infantil`
 * ↔ `/app/reptes/reto-infantil`). La pàgina el posa en muntar-se i el treu en desmuntar-se; el
 * selector d'idioma (`LanguageSwitcher`) el fa servir si és de la pàgina actual.
 */
export type CamisPerIdioma = Readonly<Record<string, string>>;

class CamiAlternatiu {
	valor = $state<CamisPerIdioma | null>(null);
}

export const camiAlternatiu = new CamiAlternatiu();
