/**
 * Repte infantil dels 100 Cims (`/repte-100-cims/repte-infantil`): vigent des de l'1 de juliol
 * de 2026. Redacció pròpia a partir de la normativa de la FEEC; els dubtes que el text no resol
 * es diuen com a tals (docs/03-modelo-datos.md §3.3, punt 6).
 */
import type { Contingut, FontCitada } from './types.ts';

const CONSULTAT = '2026-09-29';

const FONTS_CA: FontCitada[] = [
	{
		nom: 'FEEC: Normativa i funcionament (apartat «Repte Infantil dels 100 Cims»)',
		url: 'https://www.feec.cat/activitats/100-cims/normativa-i-funcionament/',
		consultat: CONSULTAT
	},
	{
		nom: 'FEEC: Full de validació del repte infantil (PDF)',
		url: 'https://www.feec.cat/wp-content/uploads/2025/07/full_validacio_100_cims_repte_infantil.pdf',
		consultat: CONSULTAT
	}
];

const FONTS_ES: FontCitada[] = FONTS_CA.map((f) => ({ ...f, nom: `${f.nom} (en catalán)` }));

export const repteInfantil: Contingut = {
	ca: {
		title: 'Repte infantil 100 Cims: 50 cims per a nens',
		description:
			'El repte infantil dels 100 Cims, en clar: 50 cims per a federats de 7 a 14 anys, sense essencials ni límit anual, des de l’1 de juliol de 2026.',
		h1: 'Repte infantil dels 100 Cims: 50 cims per a nens i nenes',
		intro:
			"Des de l'1 de juliol de 2026, els nens i nenes federats de 7 a 14 anys tenen un repte a la seva mida: 50 cims del llistat, triats lliurement. T'expliquem com funciona i com començar.",
		seccions: [
			{
				id: 'que-es',
				titol: 'Què és el repte infantil',
				blocs: [
					{
						tipus: 'paragraf',
						text: "És una versió simplificada i complementària del [repte dels 100 Cims](/repte-100-cims), pensada perquè els més petits s'aficionin a la muntanya i coneguin el país amb un objectiu assumible i un primer reconeixement."
					},
					{
						tipus: 'paragraf',
						text: "Va començar l'**1 de juliol de 2026**, i les ascensions fetes abans d'aquesta data no compten per al repte infantil."
					},
					{
						tipus: 'avis',
						to: 'info',
						text: 'Resum no oficial de Carnet de Cims, web independent sense vinculació amb la FEEC. El text vàlid és la [normativa de la FEEC](https://www.feec.cat/activitats/100-cims/normativa-i-funcionament/).'
					}
				]
			},
			{
				id: 'qui-hi-pot-participar',
				titol: 'Qui hi pot participar',
				blocs: [
					{
						tipus: 'paragraf',
						text: "Nens i nenes **d'entre 7 i 14 anys, tots dos inclosos**, amb **llicència federativa** de qualsevol tipus. Compta l'edat que tenen el dia de cada ascensió, no la del dia que es presenta el full."
					}
				]
			},
			{
				id: 'com-funciona',
				titol: 'Com funciona',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'Cal fer **50 cims** qualssevol dels 522 del llistat de la FEEC.',
							'**No hi ha distinció entre essencials i no essencials**: tots valen igual.',
							'**No hi ha límit anual** de cims validats, a diferència del repte adult.',
							'Valen els mateixos mètodes que al repte adult: a peu, en BTT, amb esquís o amb raquetes, sense mitjans motoritzats.',
							'També s’apliquen les [restriccions d’accés](/repte-100-cims/normativa#restriccions-acces) de determinats cims.'
						]
					}
				]
			},
			{
				id: 'com-validar',
				titol: 'Com es validen els cims',
				blocs: [
					{
						tipus: 'paragraf',
						text: "El procediment és el mateix que al repte adult (registre al web de la FEEC i aval de l'entitat), però amb un **full de validació propi** del repte infantil. Aquest full el presenta el pare, la mare o el tutor legal, hi consta la data de naixement de l'infant i l'ha de signar i segellar el president o presidenta de l'entitat. Tens el procés detallat a [com es validen les ascensions](/repte-100-cims/com-validar)."
					}
				]
			},
			{
				id: 'repte-adult',
				titol: 'I després, els 100 Cims',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Els cims del repte infantil **també compten per al repte dels 100 Cims**, però amb les regles habituals: per superar-lo calen 100 [cims essencials](/cims-essencials), amb un màxim de 100 cims validats per any. Si els 50 cims infantils són essencials, el camí cap als 100 queda molt avançat.'
					}
				]
			},
			{
				id: 'idees-per-comencar',
				titol: 'Idees per començar amb nens',
				blocs: [
					{
						tipus: 'paragraf',
						text: "Al llistat hi ha cims de baixa muntanya, a prop de les ciutats, que poden ser una bona primera sortida. Per exemple, el [Puig Castellar](/cims/puig-castellar), de 303 m, al Barcelonès, o el [Castell del Montgrí](/cims/castell-del-montgri), també de 303 m, al Baix Empordà. L'altitud, però, no ho diu tot: mira sempre el desnivell, la durada i l'estat del camí abans de sortir."
					},
					{
						tipus: 'llista',
						items: [
							'Busca els cims més propers a casa a la [llista de comarques](/comarques) o al [mapa](/mapa).',
							'Tria rutes curtes al principi i ves allargant a mesura que el nen o la nena guanyi confiança.',
							'Anota les ascensions al [carnet](/app), que es desa al dispositiu i no demana compte. De moment hi ha un sol carnet per dispositiu, sense perfils per a cada infant.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'De moment, Carnet de Cims mostra els 150 cims essencials; per al repte infantil també valen la resta dels 522 del llistat de la FEEC.'
					}
				]
			},
			{
				id: 'dubtes',
				titol: 'Què no aclareix la normativa',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'**Cims repetits:** la normativa parla de «50 cims» qualssevol, cosa que fa pensar en 50 cims diferents, però no ho diu explícitament.',
							"**Presentar els fulls després dels 15 anys:** com que compta l'edat el dia de l'ascensió, sembla que les ascensions fetes abans de fer els 15 es poden presentar més tard, però la normativa no ho concreta.",
							"**Terminis:** com que el procediment és el mateix que al repte adult, tot indica que també hi valen el 31 de desembre i l'any de vigència dels cims registrats al web, però no s'hi esmenten expressament."
						]
					},
					{
						tipus: 'paragraf',
						text: 'Per resoldre qualsevol cas concret, pregunta a la comissió dels 100 Cims: 100cims@feec.cat.'
					}
				]
			}
		],
		faq: [
			{
				pregunta: 'A partir de quina edat es pot fer el repte infantil?',
				resposta:
					"A partir dels 7 anys i fins als 14, tots dos inclosos. Compta l'edat del dia de cada ascensió."
			},
			{
				pregunta: 'Cal que el nen o la nena estigui federat?',
				resposta:
					'Sí. Cal tenir llicència federativa, de qualsevol tipus, igual que al repte adult.'
			},
			{
				pregunta: 'Els 50 cims han de ser essencials?',
				resposta:
					'No. Al repte infantil valen tots els 522 cims del llistat, sense distinció. Ara bé, si més endavant vol superar els 100 Cims, allà sí que caldran 100 essencials.'
			},
			{
				pregunta: 'Compten les ascensions que vam fer abans del juliol del 2026?',
				resposta:
					"Per al repte infantil, no: només valen les fetes a partir de l'1 de juliol de 2026. Per al repte adult, en canvi, poden comptar si compleixen la normativa habitual."
			},
			{
				pregunta: 'Els cims del repte infantil compten per als 100 Cims?',
				resposta:
					'Sí, però amb les regles del repte adult: distinció entre essencials i no essencials i un màxim de 100 cims validats per any.'
			}
		],
		fonts: FONTS_CA,
		actualitzat: '2026-09-29'
	},
	es: {
		title: 'Reto infantil 100 Cims: 50 cimas para niños',
		description:
			'El reto infantil de los 100 Cims, explicado: 50 cimas para federados de 7 a 14 años, sin esenciales ni límite anual, desde el 1 de julio de 2026.',
		h1: 'Reto infantil de los 100 Cims: 50 cimas para niños y niñas',
		intro:
			'Desde el 1 de julio de 2026, los niños y niñas federados de 7 a 14 años tienen un reto a su medida: 50 cimas de la lista, elegidas libremente. Te explicamos cómo funciona y cómo empezar.',
		seccions: [
			{
				id: 'que-es',
				titol: 'Qué es el reto infantil',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Es una versión simplificada y complementaria del [reto de los 100 Cims](/repte-100-cims), pensada para que los más pequeños se aficionen a la montaña y conozcan el territorio con un objetivo asumible y un primer reconocimiento.'
					},
					{
						tipus: 'paragraf',
						text: 'Empezó el **1 de julio de 2026**, y las ascensiones hechas antes de esa fecha no cuentan para el reto infantil.'
					},
					{
						tipus: 'avis',
						to: 'info',
						text: 'Resumen no oficial de Carnet de Cims, web independiente sin vinculación con la FEEC. El texto válido es la [normativa de la FEEC](https://www.feec.cat/activitats/100-cims/normativa-i-funcionament/), en catalán.'
					}
				]
			},
			{
				id: 'qui-hi-pot-participar',
				titol: 'Quién puede participar',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Niños y niñas **de entre 7 y 14 años, ambos incluidos**, con **licencia federativa** de cualquier tipo. Cuenta la edad que tienen el día de cada ascensión, no la del día en que se presenta la hoja.'
					}
				]
			},
			{
				id: 'com-funciona',
				titol: 'Cómo funciona',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'Hay que hacer **50 cimas** cualesquiera de las 522 de la lista de la FEEC.',
							'**No se distingue entre esenciales y no esenciales**: todas valen igual.',
							'**No hay límite anual** de cimas validadas, a diferencia del reto adulto.',
							'Valen los mismos métodos que en el reto adulto: a pie, en BTT, con esquís o con raquetas, sin medios motorizados.',
							'También se aplican las [restricciones de acceso](/repte-100-cims/normativa#restriccions-acces) de algunas cimas.'
						]
					}
				]
			},
			{
				id: 'com-validar',
				titol: 'Cómo se validan las cimas',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'El procedimiento es el mismo que en el reto adulto (registro en la web de la FEEC y aval de la entidad), pero con una **hoja de validación propia** del reto infantil. Esta hoja la presenta el padre, la madre o el tutor legal, incluye la fecha de nacimiento del niño o la niña y la tiene que firmar y sellar el presidente o presidenta de la entidad. Tienes el proceso detallado en [cómo se validan las ascensiones](/repte-100-cims/com-validar).'
					}
				]
			},
			{
				id: 'repte-adult',
				titol: 'Y después, los 100 Cims',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'Las cimas del reto infantil **también cuentan para el reto de los 100 Cims**, pero con las reglas habituales: para superarlo hacen falta 100 [cimas esenciales](/cims-essencials), con un máximo de 100 cimas validadas al año. Si las 50 cimas infantiles son esenciales, el camino hacia las 100 queda muy avanzado.'
					}
				]
			},
			{
				id: 'idees-per-comencar',
				titol: 'Ideas para empezar con niños',
				blocs: [
					{
						tipus: 'paragraf',
						text: 'En la lista hay cimas de baja montaña, cerca de las ciudades, que pueden ser una buena primera salida. Por ejemplo, el [Puig Castellar](/cims/puig-castellar), de 303 m, en el Barcelonès, o el [Castell del Montgrí](/cims/castell-del-montgri), también de 303 m, en el Baix Empordà. Eso sí, la altitud no lo dice todo: mira siempre el desnivel, la duración y el estado del camino antes de salir.'
					},
					{
						tipus: 'llista',
						items: [
							'Busca las cimas más cercanas a casa en la [lista de comarcas](/comarques) o en el [mapa](/mapa).',
							'Elige rutas cortas al principio y ve alargándolas a medida que el niño o la niña gane confianza.',
							'Anota las ascensiones en el [carnet](/app), que se guarda en el dispositivo y no pide cuenta. Por ahora hay un solo carnet por dispositivo, sin perfiles para cada peque.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'Por ahora, Carnet de Cims muestra las 150 cimas esenciales; para el reto infantil también valen el resto de las 522 de la lista de la FEEC.'
					}
				]
			},
			{
				id: 'dubtes',
				titol: 'Lo que la normativa no aclara',
				blocs: [
					{
						tipus: 'llista',
						items: [
							'**Cimas repetidas:** la normativa habla de «50 cimas» cualesquiera, lo que hace pensar en 50 cimas distintas, pero no lo dice explícitamente.',
							'**Presentar las hojas después de los 15 años:** como cuenta la edad el día de la ascensión, parece que las ascensiones hechas antes de cumplir 15 se pueden presentar más tarde, pero la normativa no lo concreta.',
							'**Plazos:** como el procedimiento es el mismo que en el reto adulto, todo indica que también valen el 31 de diciembre y el año de vigencia de las cimas registradas en la web, pero no se mencionan expresamente.'
						]
					},
					{
						tipus: 'paragraf',
						text: 'Para resolver cualquier caso concreto, pregunta a la comisión de los 100 Cims: 100cims@feec.cat.'
					}
				]
			}
		],
		faq: [
			{
				pregunta: '¿A partir de qué edad se puede hacer el reto infantil?',
				resposta:
					'A partir de los 7 años y hasta los 14, ambos incluidos. Cuenta la edad del día de cada ascensión.'
			},
			{
				pregunta: '¿El niño o la niña tiene que estar federado?',
				resposta:
					'Sí. Hace falta licencia federativa, de cualquier tipo, igual que en el reto adulto.'
			},
			{
				pregunta: '¿Las 50 cimas tienen que ser esenciales?',
				resposta:
					'No. En el reto infantil valen las 522 cimas de la lista, sin distinción. Eso sí, si más adelante quiere superar los 100 Cims, ahí harán falta 100 esenciales.'
			},
			{
				pregunta: '¿Cuentan las ascensiones que hicimos antes de julio de 2026?',
				resposta:
					'Para el reto infantil, no: solo valen las hechas a partir del 1 de julio de 2026. Para el reto adulto, en cambio, pueden contar si cumplen la normativa habitual.'
			},
			{
				pregunta: '¿Las cimas del reto infantil cuentan para los 100 Cims?',
				resposta:
					'Sí, pero con las reglas del reto adulto: distinción entre esenciales y no esenciales y un máximo de 100 cimas validadas al año.'
			}
		],
		fonts: FONTS_ES,
		actualitzat: '2026-09-29'
	}
};
