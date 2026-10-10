import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Talaia del Montmell',
	url: 'https://ca.wikipedia.org/wiki/Talaia_del_Montmell',
	consultat: CONSULTAT
};

const DERUTAENRUTA = {
	nom: 'De ruta en ruta: la Talaia del Montmell',
	url: 'https://www.derutaenruta.com/ca/rutes/talaia-montmell',
	consultat: CONSULTAT
};

const CIMS_PPCC = {
	nom: 'Rutes pels cims dels Països Catalans: Talaia del Montmell',
	url: 'https://cimsdelspaisoscatalans.blogspot.com/2009/06/excursio-la-talaia-del-montmell-861-m.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'talaia-del-montmell',
	descripcio: {
		ca: [
			"La Talaia del Montmell corona la serra del Montmell i és el sostre [del Baix Penedès](/comarques/baix-penedes). És al terme del Montmell, dins de l'espai natural protegit del Montmell-Marmellar, una serra calcària i dolomítica de carenes rocoses i bosc mediterrani que separa el Penedès de l'Alt Camp. Al seu vessant sud neix la riera de la Bisbal.",
			"En poc més d'una hora de camí es travessen molts segles d'història. Pel camí es passa per l'església nova de Sant Miquel, de finals del segle XVI, i per les restes de l'ermita romànica i del castell del Montmell, documentat de molt antic, del qual només queden dos panys de mur sobre la roca de la Dent. Entre el castell i el cim hi ha la punta de la Creu, coronada per una gran creu de formigó. Al cim hi ha un vèrtex geodèsic, una placa i algun pessebre. Abans del castell, uns forats coneguts com les Boques Calentes treuen aire tebi de l'interior de la muntanya.",
			"Des del castell i la carena es domina tot el Baix Penedès i, cap a l'oest, la plana de l'Alt Camp, on s'alça [la Tossa Grossa de Montferri](/cims/tossa-grossa-de-montferri), un altre cim essencial a poca distància. La punta de Sant Miquel i la de la Creu ja són, per si soles, bons miradors abans d'arribar a dalt.",
			"A l'estiu la cara sud és molt calorosa i té poca ombra: millor a primera hora. Després de pluja, els trams de roca entre la Creu i el castell rellisquen."
		],
		es: [
			'La Talaia del Montmell corona la sierra del Montmell y es el techo [del Baix Penedès](/comarques/baix-penedes). Está en el término de el Montmell, dentro del espacio natural protegido del Montmell-Marmellar, una sierra calcárea y dolomítica de crestas rocosas y bosque mediterráneo que separa el Penedès del Alt Camp. En su vertiente sur nace la riera de la Bisbal.',
			'En poco más de una hora de camino se atraviesan muchos siglos de historia. Por el camino se pasa por la iglesia nueva de Sant Miquel, de finales del siglo XVI, y por los restos de la ermita románica y del castillo del Montmell, documentado desde muy antiguo, del que solo quedan dos lienzos de muro sobre la roca de la Dent. Entre el castillo y la cima está la punta de la Creu, coronada por una gran cruz de hormigón. En la cima hay un vértice geodésico, una placa y algún belén. Antes del castillo, unos agujeros conocidos como las Boques Calentes expulsan aire tibio del interior de la montaña.',
			'Desde el castillo y la cresta se domina todo el Baix Penedès y, hacia el oeste, la llanura del Alt Camp, donde se alza [la Tossa Grossa de Montferri](/cims/tossa-grossa-de-montferri), otra cima esencial a poca distancia. La punta de Sant Miquel y la de la Creu ya son, por sí solas, buenos miradores antes de llegar arriba.',
			'En verano la cara sur es muy calurosa y tiene poca sombra: mejor a primera hora. Después de llover, los tramos de roca entre la Creu y el castillo resbalan.'
		]
	},
	rutes: [
		{
			id: 'area-recreativa-sant-miquel',
			nom: {
				ca: "Des de l'àrea recreativa pel castell i la Creu",
				es: 'Desde el área recreativa por el castillo y la Creu'
			},
			sortida: { nom: 'Àrea recreativa del Montmell (pista des de la Juncosa del Montmell)' },
			tempsMinuts: 75,
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Des de l'àrea recreativa, a uns 2 km de pista de la Juncosa del Montmell, es puja per la cara sud fins a l'església de Sant Miquel en uns 20 minuts. D'allà, un corriol dret i rocós porta a l'enforcadura entre el castell i la Creu: segons De ruta en ruta és el tram més complicat i en algun punt cal ajudar-se de les mans. Després, la carena porta suaument a la Talaia, a 1 h 10–1 h 15 min de la sortida. Es pot baixar per l'obaga, pel nord-oest, per camins de bosc més fàcils.",
				es: 'Desde el área recreativa, a unos 2 km de pista de la Juncosa del Montmell, se sube por la cara sur hasta la iglesia de Sant Miquel en unos 20 minutos. Desde allí, una senda empinada y rocosa lleva a la horcada entre el castillo y la Creu: según De ruta en ruta es el tramo más complicado y en algún punto hay que ayudarse de las manos. Después, la cresta lleva suavemente a la Talaia, a 1 h 10–1 h 15 min de la salida. Se puede bajar por la umbría, por el noroeste, por caminos de bosque más fáciles.'
			},
			fonts: [DERUTAENRUTA, CIMS_PPCC]
		},
		{
			id: 'circular-obaga',
			nom: {
				ca: "Circular baixant per l'obaga",
				es: 'Circular bajando por la umbría'
			},
			sortida: { nom: 'Àrea recreativa del Montmell' },
			descripcio: {
				ca: "La volta completa que proposa De ruta en ruta fa 4,6 km i 385 m de desnivell, unes 2 h 30 min en total: puja pel castell i la Creu i torna per la cara nord-oest, a l'ombra. Si no vols fer el tram de mans, pots pujar i baixar per l'obaga, tot i que així et perdràs el castell i la Creu.",
				es: 'La vuelta completa que propone De ruta en ruta tiene 4,6 km y 385 m de desnivel, unas 2 h 30 min en total: sube por el castillo y la Creu y vuelve por la cara noroeste, a la sombra. Si no quieres hacer el tramo de manos, puedes subir y bajar por la umbría, aunque así te perderás el castillo y la Creu.'
			},
			fonts: [DERUTAENRUTA]
		}
	],
	consells: {
		ca: [
			"La pista de la Juncosa a l'àrea recreativa és de terra: puja-hi amb calma i aparca sense tapar els accessos.",
			'Al tram entre Sant Miquel i la Creu, mira bé on poses els peus i les mans; amb pluja, la roca rellisca.',
			"Amb nens petits, la baixada per l'obaga és més amable que el pas de la Creu.",
			"A l'estiu surt molt d'hora: la cara sud té poca ombra.",
			"És un espai natural protegit: respecta les restes del castell i de l'ermita i no surtis dels camins."
		],
		es: [
			'La pista de la Juncosa al área recreativa es de tierra: sube con calma y aparca sin tapar los accesos.',
			'En el tramo entre Sant Miquel y la Creu, mira bien dónde pones los pies y las manos; con lluvia, la roca resbala.',
			'Con niños pequeños, la bajada por la umbría es más amable que el paso de la Creu.',
			'En verano sal muy temprano: la cara sur tiene poca sombra.',
			'Es un espacio natural protegido: respeta los restos del castillo y de la ermita y no salgas de los caminos.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Talaia del Montmell?',
				resposta:
					"Des de l'àrea recreativa, entre 1 h 10 min i 1 h 15 min passant per Sant Miquel, el castell i la Creu, segons Rutes pels cims dels Països Catalans i De ruta en ruta. La circular sencera es fa en unes 2 h 30 min."
			},
			{
				pregunta: 'Cal grimpar per pujar a la Talaia del Montmell?',
				resposta:
					'Pel camí del castell, sí, una mica: entre Sant Miquel i la Creu hi ha un corriol rocós on en algun punt cal ajudar-se de les mans. No és difícil, però requereix atenció, sobretot si la roca és molla.'
			},
			{
				pregunta: 'Què és el castell del Montmell?',
				resposta:
					"Són les restes d'un castell medieval situat a la Dent del Montmell, del qual queden dos panys de mur. A tocar hi ha les restes de l'ermita romànica de Sant Miquel i, més avall, l'església nova del segle XVI."
			},
			{
				pregunta: 'La Talaia del Montmell és un cim essencial?',
				resposta:
					'Sí. Al Baix Penedès no hi ha cap altre [cim essencial](/cims-essencials), i la Talaia n’és també el sostre. [La Tossa Grossa de Montferri](/cims/tossa-grossa-de-montferri), ja a l’Alt Camp, queda a poca distància.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Talaia del Montmell?',
				resposta:
					'Desde el área recreativa, entre 1 h 10 min y 1 h 15 min pasando por Sant Miquel, el castillo y la Creu, según Rutes pels cims dels Països Catalans y De ruta en ruta. La circular completa se hace en unas 2 h 30 min.'
			},
			{
				pregunta: '¿Hay que trepar para subir a la Talaia del Montmell?',
				resposta:
					'Por el camino del castillo, sí, un poco: entre Sant Miquel y la Creu hay una senda rocosa donde en algún punto hay que ayudarse de las manos. No es difícil, pero requiere atención, sobre todo si la roca está mojada.'
			},
			{
				pregunta: '¿Qué es el castillo del Montmell?',
				resposta:
					'Son los restos de un castillo medieval situado en la Dent del Montmell, del que quedan dos lienzos de muro. Junto a él están los restos de la ermita románica de Sant Miquel y, más abajo, la iglesia nueva del siglo XVI.'
			},
			{
				pregunta: '¿La Talaia del Montmell es una cima esencial?',
				resposta:
					'Sí. En el Baix Penedès no hay ninguna otra [cima esencial](/cims-essencials), y la Talaia es también su techo. [La Tossa Grossa de Montferri](/cims/tossa-grossa-de-montferri), ya en el Alt Camp, queda a poca distancia.'
			}
		]
	},
	fonts: [VIQUIPEDIA, DERUTAENRUTA, CIMS_PPCC],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
