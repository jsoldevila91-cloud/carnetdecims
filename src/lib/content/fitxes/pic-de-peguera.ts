import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Pic de Peguera',
	url: 'https://ca.wikipedia.org/wiki/Pic_de_Peguera',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Pic de Peguera (sostre comarcal)',
	url: 'https://reptesmuntanyencs.cat/pic-de-peguera-sostre-comarcal/',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: 'Rutes Pirineus: Pic de Peguera i pic de Monestero',
	url: 'https://www.rutespirineus.cat/rutes/pic-de-peguera-i-pic-de-monestero',
	consultat: CONSULTAT
};

const PARC_FAQ = {
	nom: 'Parc Nacional d’Aigüestortes i Estany de Sant Maurici: preguntes freqüents',
	url: 'https://parcsnaturals.gencat.cat/ca/xarxa-de-parcs/aiguestortes/preguntes-frequents/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pic-de-peguera',
	descripcio: {
		ca: [
			"El Pic de Peguera és el sostre del [Pallars Jussà](/comarques/pallars-jussa), segons la Viquipèdia. Té 2.983 m i s'alça dins del Parc Nacional d'Aigüestortes i Estany de Sant Maurici, entre el Pallars Sobirà i el Pallars Jussà, als termes de la Torre de Cabdella i d'Espot. Pertany al massís dels Encantats i queda entre la capçalera lacustre de la Vall Fosca i les valls de Monestero i de Peguera, dins del circ de muntanyes de gairebé 3.000 m que encapçala el Flamisell. La roca és granit.",
			"Hi ha dues portes d'entrada. Des d'Espot, la ruta de Rutes Pirineus és una circular de dos dies amb nit al refugi Josep Maria Blanc, que passa pel coll de Monestero i que inclou també el pic de Monestero. Des de la Vall Fosca, Reptes Muntanyencs surt de la presa de Sallente, passa per les antigues vies de vagonetes i els túnels, per l'estany Gento i el refugi de la Colomina, i arriba al coll de Peguera. En tots dos casos, el tram clau és el final: una grimpada per una canal de granit (I-II) segons Rutes Pirineus, o una cresta final d'uns 30 m «ampla però molt aèria» segons Reptes Muntanyencs.",
			"No és, doncs, un tresmil d'excursió: Rutes Pirineus el qualifica d'alta muntanya amb grimpades fàcils i bones preses, que obliguen a usar les mans, i no el recomana a persones no acostumades a grimpar o amb vertigen. Cal anar amb el material i l'experiència adequats i evitar l'hivern.",
			"Segons Rutes Pirineus, la temporada és de finals de primavera a la tardor, si no es vol trobar neu; a l'hivern l'ascensió es complica molt. Al parc nacional, l'acampada i el bivac fora dels refugis estan prohibits."
		],
		es: [
			'El Pic de Peguera es el techo del [Pallars Jussà](/comarques/pallars-jussa), según la Viquipèdia. Tiene 2.983 m y se alza dentro del Parque Nacional de Aigüestortes i Estany de Sant Maurici, entre el Pallars Sobirà y el Pallars Jussà, en los términos de La Torre de Cabdella y de Espot. Pertenece al macizo de los Encantats y queda entre la cabecera lacustre de la Vall Fosca y los valles de Monestero y de Peguera, dentro del circo de montañas de casi 3.000 m que encabeza el Flamisell. La roca es granito.',
			'Hay dos puertas de entrada. Desde Espot, la ruta de Rutes Pirineus es una circular de dos días con noche en el refugio Josep Maria Blanc, que pasa por el coll de Monestero e incluye también el pic de Monestero. Desde la Vall Fosca, Reptes Muntanyencs sale de la presa de Sallente, pasa por las antiguas vías de vagonetas y los túneles, por el estany Gento y el refugio de la Colomina, y llega al coll de Peguera. En ambos casos, el tramo clave es el final: una trepada por una canal de granito (I-II) según Rutes Pirineus, o una cresta final de unos 30 m «ancha pero muy aérea» según Reptes Muntanyencs.',
			'No es, pues, un tresmil de excursión: Rutes Pirineus lo califica de alta montaña con trepadas fáciles y buenas presas, que obligan a usar las manos, y no lo recomienda a personas no acostumbradas a trepar o con vértigo. Hay que ir con el material y la experiencia adecuados y evitar el invierno.',
			'Según Rutes Pirineus, la temporada va de finales de primavera al otoño, si no se quiere encontrar nieve; en invierno la ascensión se complica mucho. En el parque nacional, la acampada y el vivac fuera de los refugios están prohibidos.'
		]
	},
	rutes: [
		{
			id: 'espot-monestero',
			nom: {
				ca: "Des d'Espot pel refugi Josep Maria Blanc i el coll de Monestero",
				es: 'Desde Espot por el refugio Josep Maria Blanc y el coll de Monestero'
			},
			sortida: { nom: 'Aparcament de Prat de Pierró (Espot, 1.645 m)' },
			tecnicitat: 'grimpada',
			descripcio: {
				ca: "Rutes Pirineus planteja una circular de dos dies amb pernoctació al refugi Josep Maria Blanc, a prop de l'estany Tort de Peguera. El segon dia es puja pel costat de l'estany Negre i la coma de Peguera fins al coll de Monestero (2.715 m, 1 h 30 min), i d'allà al pic de Peguera per roques, lloses inclinades i una canal de granit de grau I-II fins a l'aresta sud, que s'enfila entre grans blocs de granit, segurs però en alguns punts una mica aeris. La baixada és pel coll i per la vall de Monestero fins a Sant Maurici. Compta 23 km, 1 h 10 min anada i tornada del coll al Peguera i 6 h 30 min el segon dia, sense parades.",
				es: 'Rutes Pirineus plantea una circular de dos días con pernocta en el refugio Josep Maria Blanc, cerca del estany Tort de Peguera. El segundo día se sube por el lado del estany Negre y la coma de Peguera hasta el coll de Monestero (2.715 m, 1 h 30 min), y de allí al pic de Peguera por rocas, losas inclinadas y una canal de granito de grado I-II hasta la arista sur, que se recorre entre grandes bloques de granito, seguros pero en algunos puntos algo aéreos. La bajada es por el collado y por el valle de Monestero hasta Sant Maurici. Cuenta 23 km, 1 h 10 min ida y vuelta del collado al Peguera y 6 h 30 min el segundo día, sin paradas.'
			},
			fonts: [RUTES_PIRINEUS]
		},
		{
			id: 'sallente',
			nom: {
				ca: 'Des de la presa de Sallente (Vall Fosca)',
				es: 'Desde la presa de Sallente (Vall Fosca)'
			},
			sortida: { nom: 'Presa de Sallente (la Torre de Cabdella, 1.774 m)' },
			tecnicitat: 'grimpada',
			descripcio: {
				ca: "Reptes Muntanyencs surt de la presa de Sallente, on acaba la carretera, i puja amb pintura groga i després fites, amb moltes llaçades, fins a la font de la Coma d'Espós (canal del Pigolo), passa uns antics túnels de vagonetes, el pas de l'Ós i un pendent feixuc fins al coll de Peguera. L'autor va fer l'anada i tornada pel mateix camí amb nit al refugi de la Colomina: 19,7 km, 1.467 m de desnivell i 6 h 50 min sense aturades. Diu que no hi ha dificultat tècnica fins al coll, tot i el pendent, però que la cresta final, d'uns 30 m, ampla però molt aèria, té un parell de passos que demanen experiència de grimpada.",
				es: 'Reptes Muntanyencs sale de la presa de Sallente, donde termina la carretera, y sube con pintura amarilla y luego hitos, con muchas lazadas, hasta la fuente de la Coma d’Espós (canal del Pigolo), pasa unos antiguos túneles de vagonetas, el pas de l’Ós y una pendiente penosa hasta el coll de Peguera. El autor hizo la ida y vuelta por el mismo camino con noche en el refugio de la Colomina: 19,7 km, 1.467 m de desnivel y 6 h 50 min sin paradas. Dice que no hay dificultad técnica hasta el collado, pese a la pendiente, pero que la cresta final, de unos 30 m, ancha pero muy aérea, tiene un par de pasos que piden experiencia de trepada.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'No facis el Peguera sense experiència en grimpada ni si tens vertigen: ho avisen les dues fonts, i la cresta final és ampla però molt aèria.',
			"A la ruta d'Espot, Rutes Pirineus remarca que cal estacionar al pàrquing de Prat de Pierró: la carretera fins a Sant Maurici és d'ús exclusiu dels taxis 4x4.",
			"Si hi puges a principi o a final de temporada, Rutes Pirineus avisa que pot caldre piolet i grampons segons l'estat de la neu.",
			'Els temps de Rutes Pirineus no inclouen parades i són orientatius; amb pluja o boira, no facis ni la canal ni la cresta.',
			"Per repartir l'esforç, les dues fonts dormen en un refugi: el Josep Maria Blanc pel costat d'Espot i el de la Colomina pel de la Vall Fosca. Reserva-hi plaça abans."
		],
		es: [
			'No hagas el Peguera sin experiencia en trepada ni si tienes vértigo: lo avisan las dos fuentes, y la cresta final es ancha pero muy aérea.',
			'En la ruta de Espot, Rutes Pirineus remarca que hay que aparcar en Prat de Pierró: la carretera hasta Sant Maurici es de uso exclusivo de los taxis 4x4.',
			'Si subes a principio o a final de temporada, Rutes Pirineus avisa de que pueden hacer falta piolet y crampones según el estado de la nieve.',
			'Los tiempos de Rutes Pirineus no incluyen paradas y son orientativos; con lluvia o niebla, no hagas ni la canal ni la cresta.',
			'Para repartir el esfuerzo, las dos fuentes duermen en un refugio: el Josep Maria Blanc por el lado de Espot y el de la Colomina por el de la Vall Fosca. Reserva plaza antes.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Pic de Peguera?',
				resposta:
					"Des d'Espot, Rutes Pirineus compta 2 h 50 min el primer dia fins al refugi Josep Maria Blanc i 1 h 30 min el segon fins al coll de Monestero, més 1 h 10 min d'anada i tornada al Peguera. Des de Sallente, Reptes Muntanyencs fa 6 h 50 min d'anada i tornada, sense aturades."
			},
			{
				pregunta: 'El Pic de Peguera té grimpada?',
				resposta:
					"Sí. Rutes Pirineus parla d'una canal de granit de grau I-II i d'una aresta amb blocs, algun punt aeri, i Reptes Muntanyencs d'una cresta final de 30 m molt aèria amb un parell de passos que demanen experiència. No és adequat per a qui no estigui acostumat a grimpar."
			},
			{
				pregunta: 'Des d’on és més fàcil pujar-hi?',
				resposta:
					'Cap dels dos accessos és fàcil, i tots dos acaben amb un tram de grimpada. Per la Vall Fosca, Reptes Muntanyencs no troba cap dificultat tècnica fins al coll de Peguera, tot i el pendent fort; per Espot, la circular de Rutes Pirineus permet afegir el pic de Monestero.'
			},
			{
				pregunta: 'El Pic de Peguera compta com a cim essencial?',
				resposta:
					'Sí, és un dels set [cims essencials](/cims-essencials) del Pallars Jussà i el més alt de la comarca, amb 2.983 m. Li segueix el [Montsent de Pallars](/cims/montsent-de-pallars), de 2.883 m.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Pic de Peguera?',
				resposta:
					'Desde Espot, Rutes Pirineus cuenta 2 h 50 min el primer día hasta el refugio Josep Maria Blanc y 1 h 30 min el segundo hasta el coll de Monestero, más 1 h 10 min de ida y vuelta al Peguera. Desde Sallente, Reptes Muntanyencs hace 6 h 50 min de ida y vuelta, sin paradas.'
			},
			{
				pregunta: '¿El Pic de Peguera tiene trepada?',
				resposta:
					'Sí. Rutes Pirineus habla de una canal de granito de grado I-II y de una arista con bloques, algún punto aéreo, y Reptes Muntanyencs de una cresta final de 30 m muy aérea con un par de pasos que piden experiencia. No es adecuado para quien no esté acostumbrado a trepar.'
			},
			{
				pregunta: '¿Desde dónde es más fácil subir?',
				resposta:
					'Ninguno de los dos accesos es fácil, y ambos terminan con un tramo de trepada. Por la Vall Fosca, Reptes Muntanyencs no encuentra ninguna dificultad técnica hasta el coll de Peguera, pese a la fuerte pendiente; por Espot, la circular de Rutes Pirineus permite añadir el pic de Monestero.'
			},
			{
				pregunta: '¿El Pic de Peguera cuenta como cima esencial?',
				resposta:
					'Sí, es una de las siete [cimas esenciales](/cims-essencials) del Pallars Jussà y la más alta de la comarca, con 2.983 m. Le sigue el [Montsent de Pallars](/cims/montsent-de-pallars), de 2.883 m.'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, RUTES_PIRINEUS, PARC_FAQ],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
