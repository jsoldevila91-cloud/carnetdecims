import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Roca Corbatera',
	url: 'https://ca.wikipedia.org/wiki/Roca_Corbatera',
	consultat: CONSULTAT
};

const PARC_IT10 = {
	nom: 'Parc Natural de la Serra de Montsant: itinerari 10, Roca Corbatera (fitxa en PDF)',
	url: 'https://parcsnaturals.gencat.cat/web/.content/Xarxa-de-parcs/serra-montsant/gaudeix_del_parc/equipaments-itineraris/itineraris/a-peu/10.PNSM-ROCA-CORBATERA-cast.pdf',
	consultat: CONSULTAT
};

const PARC_IT11 = {
	nom: 'Parc Natural de la Serra de Montsant: itinerari 11, Albarca',
	url: 'https://parcsnaturals.gencat.cat/ca/xarxa-de-parcs/serra-montsant/gaudeix-del-parc/equipaments-i-itineraris/itineraris/itineraris-municipals/itinerari-11-albarca/',
	consultat: CONSULTAT
};

const TURISME_PRIORAT = {
	nom: 'Turisme Priorat: Roca Corbatera',
	url: 'https://www.turismepriorat.org/en/what-to-do/places-of-interest/roca-corbatera-corbatera-rock',
	consultat: CONSULTAT
};

const AEC = {
	nom: 'Agrupació Excursionista de Catalunya: Roca Corbatera des d’Albarca (itinerari amb horaris)',
	url: 'https://www.aec.cat/contingut/socis171517161717/rocacorbatera.htm',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'roca-corbatera',
	descripcio: {
		ca: [
			"La Roca Corbatera corona la serra de Montsant i és, alhora, el sostre [del Priorat](/comarques/priorat). El cim és al terme de la Morera de Montsant, dins del Parc Natural de la Serra de Montsant, i domina la Serra Major, l'altiplà calcari i pelat que corona el massís. Per sota, les cingleres de conglomerat cauen cap a Cornudella, Albarca i la vall del Montsant, i només es poden superar pels graus, els antics camins de pas que són una de les singularitats del parc.",
			"Montsant és una muntanya de llarga tradició eremítica, i el camí al cim passa a prop de llocs que en són testimoni: l'ermita de la Mare de Déu de Montsant, al peu d'una cinglera, i la Cova Santa, on segons la llegenda van viure els primers ermitans. Ja a la carena hi ha el Crist de la Sang, una ofrena de la Secció Excursionista del Reus Deportiu per commemorar el centenari de l'excursionisme català (1876-1976). Al cim, al costat del vèrtex geodèsic, hi trobaràs un monòlit d'homenatge i un pessebre.",
			"Per la seva posició aïllada, la vista és molt àmplia. Turisme Priorat explica que, amb dies clars, s'arriba a veure el Pirineu i fins i tot Mallorca. Més a prop es reconeixen la Serra Major i l'interior salvatge de Montsant, Siurana, el pantà, el Priorat de vinyes i costers i, cap al nord-est, les muntanyes de Prades, on s'alça [el Tossal de la Baltasana](/cims/tossal-de-la-baltasana).",
			"L'estiu és la temporada difícil: fa molta calor i hi ha poca ombra, i per això el parc recomana sortir a primera hora o a mitja tarda. Amb boira, la Serra Major és un altiplà sense referències i el parc desaconsella accedir-hi. A la tardor i a la primavera és quan el Montsant es gaudeix més."
		],
		es: [
			'La Roca Corbatera corona la sierra de Montsant y es, a la vez, el techo [del Priorat](/comarques/priorat). La cima está en el término de la Morera de Montsant, dentro del Parque Natural de la Serra de Montsant, y domina la Serra Major, el altiplano calcáreo y pelado que corona el macizo. Por debajo, los riscos de conglomerado caen hacia Cornudella, Albarca y el valle del Montsant, y solo se pueden superar por los graus, los antiguos pasos de montaña que son una de las singularidades del parque.',
			'Montsant es una montaña de larga tradición eremítica, y el camino a la cima pasa cerca de lugares que lo atestiguan: la ermita de la Mare de Déu de Montsant, al pie de un risco, y la Cova Santa, donde según la leyenda vivieron los primeros ermitaños. Ya en la cresta está el Crist de la Sang, una ofrenda de la Secció Excursionista del Reus Deportiu para conmemorar el centenario del excursionismo catalán (1876-1976). En la cima, junto al vértice geodésico, encontrarás un monolito de homenaje y un belén.',
			'Por su posición aislada, la vista es muy amplia. Turisme Priorat explica que, en días claros, se llega a ver el Pirineo e incluso Mallorca. Más cerca se reconocen la Serra Major y el interior salvaje de Montsant, Siurana y su embalse, el Priorat de viñas y laderas y, hacia el nordeste, las montañas de Prades, donde se alza [el Tossal de la Baltasana](/cims/tossal-de-la-baltasana).',
			'El verano es la temporada difícil: hace mucho calor y hay poca sombra, y por eso el parque recomienda salir a primera hora o a media tarde. Con niebla, la Serra Major es un altiplano sin referencias y el parque desaconseja acceder a ella. En otoño y en primavera es cuando más se disfruta el Montsant.'
		]
	},
	rutes: [
		{
			id: 'albarca-grau-gran',
			nom: {
				ca: "Des d'Albarca pel Pla del Grau Gran",
				es: 'Desde Albarca por el Pla del Grau Gran'
			},
			sortida: { nom: 'Albarca (Cornudella de Montsant), 815 m' },
			tempsMinuts: 60,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "És l'accés més suau al cim. Des d'Albarca es va cap a l'oest pel GR, passant pels Hostalets, i es puja per bosc fins a la pista d'Ulldemolins i el Pla del Grau Gran; allà es deixa la pista i un sender marcat com a PR porta fins al cim. Segons l'Agrupació Excursionista de Catalunya, el cim és a uns 60 minuts del poble, i la part alta és de terreny pedregós i vegetació escassa. De tornada, o desfàs el camí o baixes per l'ermita de la Mare de Déu.",
				es: 'Es el acceso más suave a la cima. Desde Albarca se va hacia el oeste por el GR, pasando por los Hostalets, y se sube por bosque hasta la pista de Ulldemolins y el Pla del Grau Gran; allí se deja la pista y un sendero marcado como PR lleva hasta la cima. Según la Agrupació Excursionista de Catalunya, la cima está a unos 60 minutos del pueblo, y la parte alta es de terreno pedregoso y vegetación escasa. Para volver, o deshaces el camino o bajas por la ermita de la Mare de Déu.'
			},
			fonts: [AEC, PARC_IT11]
		},
		{
			id: 'albarca-mare-de-deu',
			nom: {
				ca: "Circular d'Albarca per l'ermita de la Mare de Déu",
				es: 'Circular de Albarca por la ermita de la Mare de Déu'
			},
			sortida: { nom: 'Albarca (Cornudella de Montsant)' },
			descripcio: {
				ca: "És l'itinerari 11 del parc: es puja directament a l'ermita de la Mare de Déu de Montsant pel grau de la Mare de Déu, que salva la cinglera nord amb un pendent molt fort, es camina per la Serra Major fins a la Roca Corbatera i es torna a Albarca pel Grau Gran. El parc li dona 4,7 km i unes 2 h en total, amb dificultat mitjana-alta.",
				es: 'Es el itinerario 11 del parque: se sube directamente a la ermita de la Mare de Déu de Montsant por el grau de la Mare de Déu, que salva el risco norte con una pendiente muy fuerte, se camina por la Serra Major hasta la Roca Corbatera y se vuelve a Albarca por el Grau Gran. El parque le da 4,7 km y unas 2 h en total, con dificultad media-alta.'
			},
			fonts: [PARC_IT11]
		},
		{
			id: 'sant-joan-del-codolar',
			nom: {
				ca: 'Circular des de Sant Joan del Codolar pel grau de Montsant',
				es: 'Circular desde Sant Joan del Codolar por el grau de Montsant'
			},
			sortida: { nom: 'Ermita de Sant Joan del Codolar (Cornudella de Montsant), 750 m' },
			descripcio: {
				ca: 'Itinerari 10 del parc, pel vessant sud. Es puja a la Serra Major pel grau de Montsant (o del Tomaset), un antic camí de ferradura, es passa pel Pla del Moloner, la Cova Santa i el Crist de la Sang fins al cim, i es baixa pel Pla del Grau i el camí de la Llisera. Són 8,3 km i 500 m de desnivell en total, unes 3 h 30 min, sense passos equipats i amb marques de GR, segons el parc.',
				es: 'Itinerario 10 del parque, por la vertiente sur. Se sube a la Serra Major por el grau de Montsant (o del Tomaset), un antiguo camino de herradura, se pasa por el Pla del Moloner, la Cova Santa y el Crist de la Sang hasta la cima, y se baja por el Pla del Grau y el camino de la Llisera. Son 8,3 km y 500 m de desnivel en total, unas 3 h 30 min, sin pasos equipados y con marcas de GR, según el parque.'
			},
			fonts: [PARC_IT10]
		}
	],
	consells: {
		ca: [
			'Amb boira, no pugis a la Serra Major: és un altiplà sense referències on és fàcil perdre el camí.',
			"Porta prou aigua: a la part alta gairebé no n'hi ha i a l'estiu la calor apreta des de primera hora.",
			"A Sant Joan del Codolar s'hi arriba per una pista cimentada de 4 km des de Cornudella i l'aparcament és petit, d'unes 15 places segons el parc.",
			'Després de pluja, els camins pedregosos i el camí de la Llisera rellisquen: baixa amb calma.',
			"Al parc, els gossos han d'anar lligats i l'acampada lliure està prohibida. A l'estiu, consulta el Pla Alfa per si hi ha restriccions per risc d'incendi."
		],
		es: [
			'Con niebla, no subas a la Serra Major: es un altiplano sin referencias donde es fácil perder el camino.',
			'Lleva agua suficiente: en la parte alta casi no hay y en verano el calor aprieta desde primera hora.',
			'A Sant Joan del Codolar se llega por una pista cementada de 4 km desde Cornudella y el aparcamiento es pequeño, de unas 15 plazas según el parque.',
			'Después de llover, los caminos pedregosos y el camino de la Llisera resbalan: baja con calma.',
			'En el parque, los perros deben ir atados y la acampada libre está prohibida. En verano, consulta el Pla Alfa por si hay restricciones por riesgo de incendio.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quina és la manera més fàcil de pujar a la Roca Corbatera?',
				resposta:
					"La pujada des d'Albarca pel Pla del Grau Gran, que segueix pista i sender marcat i evita les cingleres. Segons l'Agrupació Excursionista de Catalunya, s'arriba al cim en uns 60 minuts des del poble."
			},
			{
				pregunta: 'Quant es triga a fer la volta des de Sant Joan del Codolar?',
				resposta:
					'El parc natural calcula unes 3 h 30 min per a la circular de 8,3 km i 500 m de desnivell que puja pel grau de Montsant, passa per la Cova Santa i el cim, i torna pel camí de la Llisera.'
			},
			{
				pregunta: 'Es pot pujar a la Roca Corbatera amb nens?',
				resposta:
					"Des d'Albarca pel Grau Gran és una sortida assequible per a famílies que ja caminen, amb una hora de pujada aproximadament. Evita els dies de boira i de calor, i vigila a prop de les cingleres de la Serra Major."
			},
			{
				pregunta: 'La Roca Corbatera és un cim essencial?',
				resposta:
					'Sí. Al Priorat no hi ha cap altre [cim essencial](/cims-essencials), i aquest n’és a més el sostre. Si hi vols sumar l’ermita de la Mare de Déu de Montsant, l’itinerari 11 del parc hi passa.'
			}
		],
		es: [
			{
				pregunta: '¿Cuál es la forma más fácil de subir a la Roca Corbatera?',
				resposta:
					'La subida desde Albarca por el Pla del Grau Gran, que sigue pista y sendero marcado y evita los riscos. Según la Agrupació Excursionista de Catalunya, se llega a la cima en unos 60 minutos desde el pueblo.'
			},
			{
				pregunta: '¿Cuánto se tarda en hacer la vuelta desde Sant Joan del Codolar?',
				resposta:
					'El parque natural calcula unas 3 h 30 min para la circular de 8,3 km y 500 m de desnivel que sube por el grau de Montsant, pasa por la Cova Santa y la cima, y vuelve por el camino de la Llisera.'
			},
			{
				pregunta: '¿Se puede subir a la Roca Corbatera con niños?',
				resposta:
					'Desde Albarca por el Grau Gran es una salida asequible para familias que ya caminan, con una hora de subida aproximadamente. Evita los días de niebla y de calor, y vigila cerca de los riscos de la Serra Major.'
			},
			{
				pregunta: '¿La Roca Corbatera es una cima esencial?',
				resposta:
					'Sí. En el Priorat no hay ninguna otra [cima esencial](/cims-essencials), y esta es además su techo. Si quieres sumar la ermita de la Mare de Déu de Montsant, el itinerario 11 del parque pasa por ella.'
			}
		]
	},
	fonts: [VIQUIPEDIA, PARC_IT10, PARC_IT11, TURISME_PRIORAT, AEC],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
