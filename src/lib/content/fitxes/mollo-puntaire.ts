import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Molló Puntaire',
	url: 'https://ca.wikipedia.org/wiki/Moll%C3%B3_Puntaire',
	consultat: CONSULTAT
};

const VIQUIPEDIA_MUNTANYES = {
	nom: 'Viquipèdia: Muntanyes de Tivissa-Vandellòs',
	url: 'https://ca.wikipedia.org/wiki/Muntanyes_de_Tivissa-Vandell%C3%B2s',
	consultat: CONSULTAT
};

const GEC = {
	nom: "Gran Enciclopèdia Catalana: Vandellòs i l'Hospitalet de l'Infant",
	url: 'https://www.enciclopedia.cat/gran-enciclopedia-catalana/vandellos-i-lhospitalet-de-linfant',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Molló Puntaire',
	url: 'https://reptesmuntanyencs.cat/mollo-puntaire/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'mollo-puntaire',
	descripcio: {
		ca: [
			"El Molló Puntaire és, segons la Viquipèdia, el cim més alt de les Muntanyes de Tivissa-Vandellòs. És al terme de Vandellòs i l'Hospitalet de l'Infant, [al Baix Camp](/comarques/baix-camp). Forma part dels Dedalts de Vandellòs, la filera de moles que separa la vall del riu de Llastres de la mar, amb les Moles, la tossa de l'Alzina i la mola del Grèvol. Al cim hi ha un vèrtex geodèsic.",
			"És una d'aquelles muntanyes que es veuen des de la carretera de la costa, travessada per línies elèctriques, i que poca gent s'atura a pujar. Amb la serra de Llaberia, les muntanyes de Tivissa-Vandellòs formen les anomenades serres de Mestral: un relleu calcari de cingles i barrancs, sec i molt ventat, protegit dins el PEIN des del 1992. A les pistes de pujada és fàcil trobar fòssils entre les pedres.",
			"Els cims arriben gairebé a tocar del mar, i per això la vista abasta des del delta de l'Ebre fins al Pirineu quan el mestral ha netejat l'aire. A ponent queden la [Mola de Genessies](/cims/mola-de-genessies) i [la Tossa de Tivissa](/cims/la-tossa-tivissa), els altres dos cims essencials d'aquestes muntanyes.",
			"El mestral hi bufa sovint amb força i no hi ha fonts al recorregut: són dos factors que pesen més que el desnivell a l'hora de triar el dia."
		],
		es: [
			"El Molló Puntaire es, según la Viquipèdia, la cima más alta de las Muntanyes de Tivissa-Vandellòs. Está en el término de Vandellòs i l'Hospitalet de l'Infant, [en el Baix Camp](/comarques/baix-camp). Forma parte de los Dedalts de Vandellòs, la hilera de muelas que separa el valle del río de Llastres del mar, con las Moles, la tossa de l'Alzina y la mola del Grèvol. En la cima hay un vértice geodésico.",
			'Es una de esas montañas que se ven desde la carretera de la costa, cruzada por líneas eléctricas, y que poca gente se detiene a subir. Con la sierra de Llaberia, las montañas de Tivissa-Vandellòs forman las llamadas serres de Mestral: un relieve calizo de riscos y barrancos, seco y muy ventoso, protegido dentro del PEIN desde 1992. En las pistas de subida es fácil encontrar fósiles entre las piedras.',
			'Las cimas llegan casi a tocar el mar, y por eso la vista abarca desde el delta del Ebro hasta el Pirineo cuando el mistral ha limpiado el aire. A poniente quedan la [Mola de Genessies](/cims/mola-de-genessies) y [la Tossa de Tivissa](/cims/la-tossa-tivissa), las otras dos cimas esenciales de estas montañas.',
			'El mistral sopla a menudo con fuerza y no hay fuentes en el recorrido: son dos factores que pesan más que el desnivel a la hora de elegir el día.'
		]
	},
	rutes: [
		{
			id: 'castello-circular',
			nom: {
				ca: 'Circular des de Castelló pel GR 192',
				es: 'Circular desde Castelló por el GR 192'
			},
			sortida: { nom: "Masia de Castelló (Masboquera, Vandellòs i l'Hospitalet de l'Infant)" },
			descripcio: {
				ca: "La ressenya del bloc Reptes Muntanyencs (2016) surt del veïnat de Castelló, on s'arriba per carretera, i fa una circular de 12,7 km i 589 m de desnivell positiu en 4 h 25 min de marxa. Puja pel GR 192, una pista de terra i ciment que supera els graus de Castelló fins al coll de la Creu, i continua per pistes cap a la caseta de Pere Bou i la portella del Xato. Passada la portella de les Llongues, el camí es desdibuixa entre la vegetació els darrers metres abans del cim, a uns 6 km de la sortida. Es baixa per la font i el coll de Navaies i pel PR fins a retrobar el GR 192 i el coll de la Creu.",
				es: 'La reseña del blog Reptes Muntanyencs (2016) sale del caserío de Castelló, adonde se llega por carretera, y hace una circular de 12,7 km y 589 m de desnivel positivo en 4 h 25 min de marcha. Sube por el GR 192, una pista de tierra y cemento que supera los graus de Castelló hasta el coll de la Creu, y continúa por pistas hacia la caseta de Pere Bou y la portella del Xato. Pasada la portella de les Llongues, el camino se desdibuja entre la vegetación en los últimos metros antes de la cima, a unos 6 km de la salida. Se baja por la fuente y el coll de Navaies y por el PR hasta recuperar el GR 192 y el coll de la Creu.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'A prop del cim hi ha diverses traces que confonen, sobretot amb boira: tingues el track a mà.',
			"Des de Castelló també surt el PR-C 92 cap al coll de les Moles, amb passos equipats (canal Llarga, pas de la Cadireta) i una cresta. No és la ruta normal: demana experiència i roca seca, i no s'ha de fer amb vent fort.",
			'No hi ha aigua de confiança en tot el recorregut.',
			'El vent de mestral hi bufa amb força; mira la previsió abans de sortir.'
		],
		es: [
			'Cerca de la cima hay varias trazas que confunden, sobre todo con niebla: ten el track a mano.',
			'Desde Castelló sale también el PR-C 92 hacia el coll de les Moles, con pasos equipados (canal Llarga, pas de la Cadireta) y una cresta. No es la ruta normal: pide experiencia y roca seca, y no debe hacerse con viento fuerte.',
			'No hay agua de confianza en todo el recorrido.',
			'El mistral sopla con fuerza; mira la previsión antes de salir.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Molló Puntaire?',
				resposta:
					"Per la circular de Castelló, el bloc Reptes Muntanyencs va arribar al cim després d'uns 6 km i 2 h 20 min, aturades incloses. Tota la volta, de 12,7 km, són 4 h 25 min de marxa."
			},
			{
				pregunta: 'És difícil?',
				resposta:
					'Per la pista del GR 192 la ressenya no descriu cap pas tècnic: és una excursió llarga per pistes i senders, amb senyalització parcial. La variant pel PR-C 92 i el pas de la Cadireta és una altra cosa: té passos equipats.'
			},
			{
				pregunta: 'Què es veu des del cim?',
				resposta: "La costa, el delta de l'Ebre i, amb l'aire net, fins al Pirineu."
			},
			{
				pregunta: 'El Molló Puntaire compta com a cim essencial?',
				resposta: 'Sí, és un dels sis [cims essencials](/cims-essencials) del Baix Camp.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Molló Puntaire?',
				resposta:
					'Por la circular de Castelló, el blog Reptes Muntanyencs llegó a la cima tras unos 6 km y 2 h 20 min, paradas incluidas. Toda la vuelta, de 12,7 km, son 4 h 25 min de marcha.'
			},
			{
				pregunta: '¿Es difícil?',
				resposta:
					'Por la pista del GR 192 la reseña no describe ningún paso técnico: es una excursión larga por pistas y senderos, con señalización parcial. La variante por el PR-C 92 y el pas de la Cadireta es otra cosa: tiene pasos equipados.'
			},
			{
				pregunta: '¿Qué se ve desde la cima?',
				resposta: 'La costa, el delta del Ebro y, con el aire limpio, hasta el Pirineo.'
			},
			{
				pregunta: '¿El Molló Puntaire cuenta como cima esencial?',
				resposta: 'Sí, es una de las seis [cimas esenciales](/cims-essencials) del Baix Camp.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_MUNTANYES, GEC, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
