import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Tuc de Maubèrme',
	url: 'https://ca.wikipedia.org/wiki/Mauberme',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Maubèrme (tuc de)',
	url: 'https://reptesmuntanyencs.cat/mauberme/',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: Tuc de Maubèrme des de Bagergue",
	url: 'https://dexcursio.net/tuc-de-mauberme/',
	consultat: CONSULTAT
};

const VISIT_ARAN = {
	nom: 'Visit Val d’Aran: ascensió al Tuc de Maubèrme',
	url: 'https://www.visitvaldaran.com/item/ascension-tuc-mauberme/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'mauberme',
	descripcio: {
		ca: [
			"El Maubèrme és el segon cim més alt dels sis que el repte reconeix com a essencials a [la Val d'Aran](/comarques/val-d-aran), només per darrere del [Tuc de Molières](/cims/tuc-de-molieres). Es troba a la carena que separa l'Aran de l'Arieja, a cavall dels termes de Naut Aran i de Santenh, a França. A banda i banda hi té dos ports de la carena: el d'Era Horqueta, al nord-oest, i el d'Orets, al sud-est. Vist des de l'Aran, és la gran muntanya que tanca la capçalera de la vall de l'Unhòla, que baixa cap a Bagergue.",
			"El que distingeix aquest cim és la roca i el que se n'ha extret. El massís és de gresos i lutites, i abunda el mineral de ferro: encara es veuen les restes de les antigues mines d'Orets, amb barraques de miners i galeries a tocar del GR 211. Segons Visit Val d'Aran, els recursos minerals i l'antiga activitat minera expliquen el color rogenc de l'Unhòla. Al peu del cim, el llac de Montoliu és la parada habitual de la pujada.",
			"Des del cim, la vista baixa cap a la vall de l'Unhòla, per on s'ha pujat, i cap al vessant francès de la carena. Visit Val d'Aran destaca els llacs de Liat i de França. L'aproximació és llarga i la pista d'accés exigeix un vehicle adequat, dos factors que condicionen molt la sortida.",
			"La temporada habitual és de juliol a setembre. Fins a mitjan estiu pot quedar neu al coll sota el cim (a mitjans de juliol de 2021, Reptes Muntanyencs hi va trobar una placa). Les tempestes de tarda són freqüents a l'estiu: calcula l'hora de tornada abans de sortir."
		],
		es: [
			"El Maubèrme es la segunda cima más alta de las seis que el reto reconoce como esenciales en [la Val d'Aran](/comarques/val-d-aran), solo por detrás del [Tuc de Molières](/cims/tuc-de-molieres). Está en la cresta que separa el Aran del Ariège, a caballo de los términos de Naut Aran y de Sentein, en Francia. A ambos lados tiene dos puertos de la cresta: el d'Era Horqueta, al noroeste, y el d'Orets, al sureste. Visto desde el Aran, es la gran montaña que cierra la cabecera del valle del Unhòla, que baja hacia Bagergue.",
			'Lo que distingue esta cima es la roca y lo que se ha extraído de ella. El macizo es de areniscas y lutitas, y abunda el mineral de hierro: todavía se ven los restos de las antiguas minas de Orets, con barracones de mineros y galerías junto al GR 211. Según Visit Val d’Aran, los recursos minerales y la antigua actividad minera explican el color rojizo del Unhòla. Al pie de la cima, el lago de Montoliu es la parada habitual de la subida.',
			'Desde la cima, la vista baja hacia el valle del Unhòla, por donde se ha subido, y hacia la vertiente francesa de la cresta. Visit Val d’Aran destaca los lagos de Liat y de Francia. La aproximación es larga y la pista de acceso exige un vehículo adecuado, dos factores que condicionan mucho la salida.',
			'La temporada habitual es de julio a septiembre. Hasta mediados de verano puede quedar nieve en el collado bajo la cima (a mediados de julio de 2021, Reptes Muntanyencs encontró allí una placa). Las tormentas de tarde son frecuentes en verano: calcula la hora de vuelta antes de salir.'
		]
	},
	rutes: [
		{
			id: 'plan-deth-tor',
			nom: {
				ca: 'Des del Plan deth Tor pel llac de Montoliu',
				es: 'Desde el Plan deth Tor por el lago de Montoliu'
			},
			sortida: { nom: 'Plan deth Tor (vall de l’Unhòla, 1.994 m)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Reptes Muntanyencs surt del Plan deth Tor, a 1.994 m, on s'arriba amb un 4x4 per una pista en mal estat que creua diverses torrenteres de l'Unhòla. La pujada segueix la coma Nera fins a un coll, passa pel llac de Montoliu i acaba per un camí pedregós, una zona de pedra descomposta i una canal final amb fites. Reptes Muntanyencs compta unes 3 h 35 min fins al cim, aturades incloses. L'autor remarca que el pas no és aeri, però que una relliscada a la canal pot tenir conseqüències serioses, i torna pel còth de Maubèrme, el llac de Montoliu i el GR 211.",
				es: 'Reptes Muntanyencs sale del Plan deth Tor, a 1.994 m, adonde se llega con un 4x4 por una pista en mal estado que cruza varios torrentes del Unhòla. La subida sigue la coma Nera hasta un collado, pasa por el lago de Montoliu y termina por un camino pedregoso, una zona de piedra suelta y una canal final con hitos. Reptes Muntanyencs cuenta unas 3 h 35 min hasta la cima, paradas incluidas. El autor señala que el paso no es aéreo, pero que un resbalón en la canal puede tener consecuencias serias, y vuelve por el còth de Maubèrme, el lago de Montoliu y el GR 211.'
			},
			fonts: [REPTES, VISIT_ARAN]
		},
		{
			id: 'bagergue',
			nom: {
				ca: "Des de Bagergue per la pista d'Era Llana",
				es: "Desde Bagergue por la pista d'Era Llana"
			},
			sortida: { nom: "Aparcament de la pista d'Era Llana (Bagergue, uns 1.590 m)" },
			descripcio: {
				ca: "Qui no té 4x4 pot fer l'aproximació a peu. D'excursió per Catalunya proposa una volta amb sortida a l'aparcament de la pista d'Era Llana: uns 90 minuts per un camí còmode paral·lel a l'Unhòla fins al Plan deth Tor, després el llac de Montoliu i prop d'una hora de pujada per terreny rocós i dret. El conjunt, anada i tornada amb una variant per les mines d'Orets, suma 21,7 km, 1.489 m de desnivell i més de deu hores.",
				es: "Quien no tenga 4x4 puede hacer la aproximación a pie. D'excursió per Catalunya propone una vuelta con salida en el aparcamiento de la pista d'Era Llana: unos 90 minutos por un camino cómodo paralelo al Unhòla hasta el Plan deth Tor, después el lago de Montoliu y cerca de una hora de subida por terreno rocoso y empinado. El conjunto, ida y vuelta con una variante por las minas de Orets, suma 21,7 km, 1.489 m de desnivel y más de diez horas."
			},
			fonts: [DEXCURSIO]
		}
	],
	consells: {
		ca: [
			"La pista del Plan deth Tor requereix un 4x4: Reptes Muntanyencs la descriu en mal estat als trencaaigües. Sense 4x4, l'aproximació a peu des de Bagergue és d'una hora i mitja per sentit, segons D'excursió per Catalunya.",
			"D'excursió per Catalunya recomana casc per al tram final, que és rocós i amb pedra descomposta: no et col·loquis sota un altre grup.",
			"D'excursió per Catalunya aconsella portar com a mínim dos litres d'aigua, menjar energètic i mapa o GPS amb el track.",
			"Si tornes per les mines d'Orets, al port d'Orets hi ha restes de barraques i un petit refugi lliure, però no hi comptis per dormir-hi.",
			"Surt d'hora i prepara roba d'abric i impermeable encara que sigui estiu: el temps pot canviar de pressa en aquesta carena."
		],
		es: [
			"La pista del Plan deth Tor requiere un 4x4: Reptes Muntanyencs la describe en mal estado en los pasos de agua. Sin 4x4, la aproximación a pie desde Bagergue es de hora y media por sentido, según D'excursió per Catalunya.",
			"D'excursió per Catalunya recomienda casco para el tramo final, que es rocoso y con piedra suelta: no te coloques debajo de otro grupo.",
			"D'excursió per Catalunya aconseja llevar como mínimo dos litros de agua, comida energética y mapa o GPS con el track.",
			'Si vuelves por las minas de Orets, en el port d’Orets hay restos de barracones y un pequeño refugio libre, pero no cuentes con él para dormir.',
			'Sal temprano y prepara ropa de abrigo e impermeable aunque sea verano: el tiempo puede cambiar rápido en esta cresta.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Es pot pujar al Maubèrme sense 4x4?',
				resposta:
					"Sí, però l'aproximació és molt més llarga. Des de Bagergue per la pista d'Era Llana, D'excursió per Catalunya compta 21,7 km, 1.489 m de desnivell i uns 10 h en total, tornada inclosa."
			},
			{
				pregunta: 'El Maubèrme és difícil?',
				resposta:
					"Reptes Muntanyencs en valora l'exigència física d'alta a molt alta i l'orientació de baixa. El tram final és pedregós, amb pedra descomposta i una canal. No és una ruta per a principiants ni per fer amb mala visibilitat."
			},
			{
				pregunta: 'Quant es triga a pujar al Maubèrme?',
				resposta:
					"Reptes Muntanyencs hi va tardar 3 h 35 min de pujada des del Plan deth Tor, comptant les aturades. Des de Bagergue, la volta sencera passa de les deu hores segons D'excursió per Catalunya."
			},
			{
				pregunta: 'El Maubèrme compta com a cim essencial?',
				resposta:
					"Sí, és un dels sis [cims essencials](/cims-essencials) de la Val d'Aran. Amb 2.882 m, és el segon més alt de l'Aran entre els essencials, després del [Tuc de Molières](/cims/tuc-de-molieres), i el [Montardo](/cims/montardo), de 2.833 m, és el tercer."
			}
		],
		es: [
			{
				pregunta: '¿Se puede subir al Maubèrme sin 4x4?',
				resposta:
					"Sí, pero la aproximación es mucho más larga. Desde Bagergue por la pista d'Era Llana, D'excursió per Catalunya cuenta 21,7 km, 1.489 m de desnivel y unas 10 h en total, vuelta incluida."
			},
			{
				pregunta: '¿El Maubèrme es difícil?',
				resposta:
					'Reptes Muntanyencs valora la exigencia física de alta a muy alta y la orientación de baja. El tramo final es pedregoso, con piedra suelta y una canal. No es una ruta para principiantes ni para hacer con poca visibilidad.'
			},
			{
				pregunta: '¿Cuánto se tarda en subir al Maubèrme?',
				resposta:
					"Reptes Muntanyencs tardó 3 h 35 min de subida desde el Plan deth Tor, contando las paradas. Desde Bagergue, la vuelta entera pasa de las diez horas según D'excursió per Catalunya."
			},
			{
				pregunta: '¿El Maubèrme cuenta como cima esencial?',
				resposta:
					'Sí, es una de las seis [cimas esenciales](/cims-essencials) de la Val d’Aran. Con 2.882 m, es la segunda más alta del Aran entre las esenciales, después del [Tuc de Molières](/cims/tuc-de-molieres), y el [Montardo](/cims/montardo), de 2.833 m, es la tercera.'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, DEXCURSIO, VISIT_ARAN],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
