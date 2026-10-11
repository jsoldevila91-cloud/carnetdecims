import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Mola de Genessies',
	url: 'https://ca.wikipedia.org/wiki/Mola_de_Genessies',
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
	nom: 'Reptes Muntanyencs: Mola de Genessies',
	url: 'https://reptesmuntanyencs.cat/mola-de-genessies/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'mola-de-genessies',
	descripcio: {
		ca: [
			"La Mola de Genessies és una de les moles calcàries de les Muntanyes de Tivissa-Vandellòs, [al Baix Camp](/comarques/baix-camp) i al límit amb la Ribera d'Ebre: fa de partió entre el terme de Vandellòs i l'Hospitalet de l'Infant i el de Tivissa. Tanca per ponent la vall del riu de Llastres i té un vèrtex geodèsic al cim. L'espai és protegit, dins el PEIN des del 1992 i la xarxa Natura 2000.",
			'Pren el nom del mas de Genessies, un dels més vells del massís, avui aparentment deshabitat. Al vessant sud-oriental, damunt el barranc Fondo, el veïnat de Gavadà conserva les restes de la torre més antiga del terme, de planta circular; el 1606 hi va haver una baralla entre colles de bandolers. A prop del cim els mapes situen un poblat ibèric, del qual sobre el terreny no es veu més que un munt de pedres.',
			"Dalt de la mola, envoltada de cingles, la vista és de les àmplies d'aquest tros de costa: Tarragona i el cap de Salou, el delta de l'Ebre, la serra de Cardó i la de Llaberia. A la mateixa serralada hi ha el [Molló Puntaire](/cims/mollo-puntaire), que n'és el punt més alt, i [la Tossa de Tivissa](/cims/la-tossa-tivissa).",
			'Són muntanyes seques i poc trepitjades. Els senders, sovint simples passos de senglar entre la brolla, obliguen a anar amb les cames tapades i a no refiar-se de trobar marques.'
		],
		es: [
			"La Mola de Genessies es una de las muelas calizas de las Muntanyes de Tivissa-Vandellòs, [en el Baix Camp](/comarques/baix-camp) y en el límite con la Ribera d'Ebre: hace de linde entre el término de Vandellòs i l'Hospitalet de l'Infant y el de Tivissa. Cierra por poniente el valle del río de Llastres y tiene un vértice geodésico en la cima. El espacio está protegido, dentro del PEIN desde 1992 y de la red Natura 2000.",
			'Toma el nombre del mas de Genessies, uno de los más viejos del macizo, hoy aparentemente deshabitado. En la vertiente sudoriental, sobre el barranc Fondo, el caserío de Gavadà conserva los restos de la torre más antigua del término, de planta circular; en 1606 hubo allí una pelea entre cuadrillas de bandoleros. Cerca de la cima los mapas sitúan un poblado ibérico, del que sobre el terreno no se ve más que un montón de piedras.',
			'En lo alto de la muela, rodeada de riscos, la vista es de las amplias de este tramo de costa: Tarragona y el cabo de Salou, el delta del Ebro, la sierra de Cardó y la de Llaberia. En la misma sierra están el [Molló Puntaire](/cims/mollo-puntaire), que es su punto más alto, y [la Tossa de Tivissa](/cims/la-tossa-tivissa).',
			'Son montañas secas y poco pisadas. Los senderos, a menudo simples pasos de jabalí entre el matorral, obligan a ir con las piernas tapadas y a no fiarse de encontrar marcas.'
		]
	},
	rutes: [
		{
			id: 'cami-de-gavada',
			nom: {
				ca: 'Circular des del camí de Gavadà pel portell de Jovara',
				es: 'Circular desde el camino de Gavadà por el portell de Jovara'
			},
			sortida: { nom: "Camí de Gavadà (Vandellòs i l'Hospitalet de l'Infant)" },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "La ressenya del bloc Reptes Muntanyencs (2015) fa una circular de 9,1 km i 458 m de desnivell positiu en 2 h 37 min de marxa; el cim hi queda a 4,9 km de la sortida. Puja per una pista, sota una línia elèctrica, fins al portell de Jovara, baixa cap a la font de Jovara i pren un sender sense marques ni fites, mig tapat per la vegetació, fins a la moleta i el portell d'en Gardell. D'allà baixa un tros pel barranc Fondo fins a una gran fita, on comença el sender, ara sí fitat, que puja a la mola. Es baixa per un grau fàcil del costat de ponent fins al coll del Rourar i per un sender atorrentat fins al barranc Fondo i el mas de Genessies; l'últim quilòmetre i mig és d'asfalt.",
				es: "La reseña del blog Reptes Muntanyencs (2015) hace una circular de 9,1 km y 458 m de desnivel positivo en 2 h 37 min de marcha; la cima queda a 4,9 km de la salida. Sube por una pista, bajo una línea eléctrica, hasta el portell de Jovara, baja hacia la font de Jovara y toma un sendero sin marcas ni hitos, medio tapado por la vegetación, hasta la moleta y el portell d'en Gardell. Desde allí baja un trecho por el barranc Fondo hasta un gran hito, donde empieza el sendero, ahora sí con hitos, que sube a la muela. Se baja por un paso fácil del lado de poniente hasta el coll del Rourar y por un sendero muy erosionado hasta el barranc Fondo y el mas de Genessies; el último kilómetro y medio es de asfalto."
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"El tram entre la font de Jovara i el portell d'en Gardell no té cap senyal: cal saber orientar-se i portar el track. Amb boira no és un lloc per improvisar.",
			'Pantalons llargs, encara que faci calor: la brolla esgarrinxa.',
			'No hi ha cap font en tot el recorregut.',
			'Al punt de sortida només hi caben dos o tres cotxes.',
			"La ressenya és del 2015 i l'estat dels senders pot haver canviat."
		],
		es: [
			"El tramo entre la font de Jovara y el portell d'en Gardell no tiene ninguna señal: hay que saber orientarse y llevar el track. Con niebla no es un sitio para improvisar.",
			'Pantalones largos, aunque haga calor: el matorral araña.',
			'No hay ninguna fuente en todo el recorrido.',
			'En el punto de salida solo caben dos o tres coches.',
			'La reseña es de 2015 y el estado de los senderos puede haber cambiado.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Mola de Genessies?',
				resposta:
					"La circular del bloc Reptes Muntanyencs fa 9,1 km i 458 m de desnivell, amb 2 h 37 min de marxa; l'autor va arribar al cim en gairebé dues hores comptant-hi les aturades."
			},
			{
				pregunta: 'Està senyalitzat el camí?',
				resposta:
					"Només en part. Hi ha pistes clares i algun tram de PR, però el sender que s'acosta a la mola no té marques ni fites en un bon tros."
			},
			{
				pregunta: 'Hi ha un poblat ibèric al cim?',
				resposta:
					'Els mapes en situen un a prop del cim. Sobre el terreny només hi ha un munt de pedres, que fan pensar més aviat en tancats de bestiar.'
			},
			{
				pregunta: 'La Mola de Genessies compta com a cim essencial?',
				resposta:
					"Sí. Dels sis [cims essencials](/cims-essencials) del Baix Camp, és el que toca la Ribera d'Ebre."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Mola de Genessies?',
				resposta:
					'La circular del blog Reptes Muntanyencs tiene 9,1 km y 458 m de desnivel, con 2 h 37 min de marcha; el autor llegó a la cima en casi dos horas contando las paradas.'
			},
			{
				pregunta: '¿Está señalizado el camino?',
				resposta:
					'Solo en parte. Hay pistas claras y algún tramo de PR, pero el sendero que se acerca a la muela no tiene marcas ni hitos en un buen trecho.'
			},
			{
				pregunta: '¿Hay un poblado ibérico en la cima?',
				resposta:
					'Los mapas sitúan uno cerca de la cima. Sobre el terreno solo hay un montón de piedras, que hacen pensar más bien en cercados de ganado.'
			},
			{
				pregunta: '¿La Mola de Genessies cuenta como cima esencial?',
				resposta:
					"Sí. De las seis [cimas esenciales](/cims-essencials) del Baix Camp, es la que linda con la Ribera d'Ebre."
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_MUNTANYES, GEC, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
