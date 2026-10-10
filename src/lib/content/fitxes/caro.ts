import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Mont Caro',
	url: 'https://ca.wikipedia.org/wiki/Mont_Caro',
	consultat: CONSULTAT
};

const PARC_ZONA_CARO = {
	nom: 'Parc Natural dels Ports: zona de Caro (itineraris i àrees de lleure)',
	url: 'https://parcsnaturals.gencat.cat/ca/xarxa-de-parcs/ports/gaudeix-del-parc/equipaments-i-itineraris/itineraris-arees-lleure/zona-caro-alfara-roquetes-tortosa',
	consultat: CONSULTAT
};

const PARC_PDF_CARO = {
	nom: 'Parc Natural dels Ports: fullet d’itineraris Cim de Caro, Bassis de Caro i la Barcina (PDF)',
	url: 'https://parcsnaturals.gencat.cat/web/.content/Xarxa-de-parcs/ports/coneix-la-nostra-feina/centre-de-documentacio/inf_x_visita/itineraris/Caro-web-CA-EN.pdf',
	consultat: CONSULTAT
};

const PARC_TOP10 = {
	nom: 'Parc Natural dels Ports: top 10 del parc',
	url: 'https://parcsnaturals.gencat.cat/ca/xarxa-de-parcs/ports/el-parc/top-10-del-parc/index.html',
	consultat: CONSULTAT
};

const PARC_REFUGIS = {
	nom: 'Parc Natural dels Ports: refugis',
	url: 'https://parcsnaturals.gencat.cat/ca/xarxa-de-parcs/ports/gaudeix-del-parc/guia-de-visita/refugis/',
	consultat: CONSULTAT
};

const REFUGI_CARO = {
	nom: 'Refugi de Caro: senderisme',
	url: 'https://refugicaro.com/ca/senderisme/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'caro',
	descripcio: {
		ca: [
			"El Caro, o Mont Caro, és el cim més alt dels Ports i, alhora, de les Terres de l'Ebre i de la província de Tarragona. És al terme de Roquetes, [al Baix Ebre](/comarques/baix-ebre), dins del Parc Natural dels Ports, un massís calcari i dolomític de cingles, agulles i barrancs que forma part de la Reserva de la Biosfera de les Terres de l'Ebre i de la xarxa Natura 2000.",
			"A diferència de la majoria de cims del repte, al Caro s'hi arriba per una carretera asfaltada que puja de Roquetes pel Caragol, i al cim hi ha diverses antenes de televisió, ràdio i telefonia. Això no li treu interès: el mirador, equipat amb plafons i adaptat a persones amb mobilitat reduïda, és el gran balcó dels Ports. Segons la Viquipèdia, el nom ve d'una arrel preromana que voldria dir 'roca, penyal', emparentada amb el basc (h)arri. A la zona viuen la cabra salvatge i molts rapinyaires, i els pins prenen formes torçades pel mestral, el vent de dalt.",
			"El parc explica que, en dies clars, des del cim es veu la vall de l'Ebre fins al Delta i fins i tot l'illa de Mallorca. Cap a l'interior s'estenen les valls i les moles dels Ports, amb cims com [el Tossal d'Engrilló](/cims/tossal-d-engrillo) o, més al sud, [el Tossal dels Tres Reis](/cims/tossal-dels-tres-reis), on es troben Catalunya, Aragó i el País Valencià.",
			"El Caro no té temporada tancada, però el vent hi mana: el mestral bufa fort i fred, i a l'hivern hi pot glaçar i nevar. A l'estiu, la pujada a peu es fa més agradable a primera hora: el parc recomana portar aigua abundant, protecció solar i barret."
		],
		es: [
			"El Caro, o Mont Caro, es la cima más alta de los Ports y, a la vez, de las Terres de l'Ebre y de la provincia de Tarragona. Está en el término de Roquetes, [en el Baix Ebre](/comarques/baix-ebre), dentro del Parque Natural dels Ports, un macizo calcáreo y dolomítico de riscos, agujas y barrancos que forma parte de la Reserva de la Biosfera de las Terres de l'Ebre y de la red Natura 2000.",
			"A diferencia de la mayoría de cimas del reto, al Caro se llega por una carretera asfaltada que sube desde Roquetes por el Caragol, y en la cima hay varias antenas de televisión, radio y telefonía. Eso no le quita interés: el mirador, equipado con paneles y adaptado a personas con movilidad reducida, es el gran balcón de los Ports. Según la Viquipèdia, el nombre viene de una raíz prerromana que significaría 'roca, peñasco', emparentada con el vasco (h)arri. En la zona viven la cabra montés y muchas rapaces, y los pinos toman formas retorcidas por el mistral, el viento de arriba.",
			"El parque explica que, en días claros, desde la cima se ve el valle del Ebro hasta el Delta e incluso la isla de Mallorca. Hacia el interior se extienden los valles y las muelas de los Ports, con cimas como [el Tossal d'Engrilló](/cims/tossal-d-engrillo) o, más al sur, [el Tossal dels Tres Reis](/cims/tossal-dels-tres-reis), donde se encuentran Cataluña, Aragón y la Comunidad Valenciana.",
			'El Caro no tiene temporada cerrada, pero aquí manda el viento: el mistral sopla fuerte y frío, y en invierno puede helar y nevar. En verano, la subida a pie es más agradable a primera hora: el parque recomienda llevar agua abundante, protección solar y sombrero.'
		]
	},
	rutes: [
		{
			id: 'esquirol-coll-dels-pallers',
			nom: {
				ca: "Circular des de l'Esquirol pel coll dels Pallers",
				es: "Circular desde l'Esquirol por el coll dels Pallers"
			},
			sortida: { nom: "Aparcament de l'Esquirol (1.097 m)", lat: 40.80722, lon: 0.33722 },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "És l'itinerari senyalitzat del parc. Des de l'aparcament de l'Esquirol es puja pel Mascar fins al coll dels Pallers entre pinedes de pi roig i pinassa, i es continua per la carena, ventosa i amb poca vegetació, fins al cim. La baixada segueix en part l'antic camí de Caro, un sender pedregós i dret que creua la carretera. Són 7,5 km i 560 m de desnivell en total, unes 2 h 45 min de marxa, amb dificultat mitjana segons el parc.",
				es: "Es el itinerario señalizado del parque. Desde el aparcamiento de l'Esquirol se sube por el Mascar hasta el coll dels Pallers entre pinares de pino silvestre y pino laricio, y se sigue por la cresta, ventosa y con poca vegetación, hasta la cima. La bajada sigue en parte el antiguo camino de Caro, un sendero pedregoso y empinado que cruza la carretera. Son 7,5 km y 560 m de desnivel en total, unas 2 h 45 min de marcha, con dificultad media según el parque."
			},
			fonts: [PARC_PDF_CARO, PARC_ZONA_CARO]
		},
		{
			id: 'refugi-de-caro',
			nom: { ca: 'Des del refugi de Caro', es: 'Desde el refugio de Caro' },
			sortida: { nom: 'Refugi de Caro (1.110 m)' },
			descripcio: {
				ca: "El refugi de Caro, guardat i a prop del Mascar, és un bon camp base per pujar-hi a peu i per fer travesses pels GR 7 i GR 171. El refugi proposa una circular de 7,3 km i uns 400 m de desnivell fins al cim, i una variant pel coll dels Pallers d'uns 7,7 km i 440 m, totes dues de dificultat moderada.",
				es: 'El refugio de Caro, guardado y cerca del Mascar, es un buen campo base para subir a pie y para hacer travesías por los GR 7 y GR 171. El refugio propone una circular de 7,3 km y unos 400 m de desnivel hasta la cima, y una variante por el coll dels Pallers de unos 7,7 km y 440 m, ambas de dificultad moderada.'
			},
			fonts: [REFUGI_CARO, PARC_REFUGIS]
		}
	],
	consells: {
		ca: [
			"Per arribar a l'Esquirol, puja de Roquetes per la T-342 cap als Reguers i segueix la carretera del Caragol fins al creuament senyalitzat; l'aparcament és 1,5 km més enllà, en direcció a Fredes.",
			'Abriga’t: el mestral bufa sovint fort a la carena i al cim, i fa baixar molt la sensació de temperatura.',
			"A l'antic camí de Caro, pedregós i dret, baixa amb calma i vigila els trams on creua la carretera.",
			"Porta el gos lligat i no acampis: al parc només es permet l'acampada a l'àrea dels Ateus, a Horta de Sant Joan.",
			"Compte amb el temps de llum a l'hivern: el parc recorda que els temps de marxa no inclouen les parades."
		],
		es: [
			"Para llegar a l'Esquirol, sube desde Roquetes por la T-342 hacia els Reguers y sigue la carretera del Caragol hasta el cruce señalizado; el aparcamiento está 1,5 km más allá, en dirección a Fredes.",
			'Abrígate: el mistral sopla a menudo fuerte en la cresta y en la cima, y hace bajar mucho la sensación de temperatura.',
			'En el antiguo camino de Caro, pedregoso y empinado, baja con calma y vigila los tramos donde cruza la carretera.',
			'Lleva el perro atado y no acampes: en el parque solo se permite la acampada en el área dels Ateus, en Horta de Sant Joan.',
			'Ten en cuenta las horas de luz en invierno: el parque recuerda que los tiempos de marcha no incluyen las paradas.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a fer la ruta del Caro des de l’Esquirol?',
				resposta:
					'El parc natural calcula unes 2 h 45 min de marxa per a la circular de 7,5 km i 560 m de desnivell que puja pel coll dels Pallers i baixa per l’antic camí de Caro, sense comptar les parades.'
			},
			{
				pregunta: 'Si pujo al Caro en cotxe, compta per al repte?',
				resposta:
					"No. Al cim s'hi pot arribar per carretera, però el repte només admet ascensions sense mitjans motoritzats. Consulta la [normativa del repte](/repte-100-cims/normativa)."
			},
			{
				pregunta: 'Es veu el Delta de l’Ebre des del Caro?',
				resposta:
					'Sí. Segons el Parc Natural dels Ports, el mirador del cim ofereix una àmplia vista de la plana de l’Ebre fins al Delta i, en dies clars, fins i tot de Mallorca.'
			},
			{
				pregunta: 'El Caro és un cim essencial?',
				resposta:
					'Sí. És el més alt dels tres [cims essencials](/cims-essencials) del Baix Ebre, amb el [Tossal d’Engrilló](/cims/tossal-d-engrillo) i la Creu de Santos, i el sostre de les Terres de l’Ebre.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en hacer la ruta del Caro desde l’Esquirol?',
				resposta:
					'El parque natural calcula unas 2 h 45 min de marcha para la circular de 7,5 km y 560 m de desnivel que sube por el coll dels Pallers y baja por el antiguo camino de Caro, sin contar las paradas.'
			},
			{
				pregunta: 'Si subo al Caro en coche, ¿cuenta para el reto?',
				resposta:
					'No. A la cima se puede llegar por carretera, pero el reto solo admite ascensiones sin medios motorizados. Consulta la [normativa del reto](/repte-100-cims/normativa).'
			},
			{
				pregunta: '¿Se ve el Delta del Ebro desde el Caro?',
				resposta:
					'Sí. Según el Parque Natural dels Ports, el mirador de la cima ofrece una amplia vista de la llanura del Ebro hasta el Delta y, en días claros, incluso de Mallorca.'
			},
			{
				pregunta: '¿El Caro es una cima esencial?',
				resposta:
					'Sí. Es la más alta de las tres [cimas esenciales](/cims-essencials) del Baix Ebre, con el [Tossal d’Engrilló](/cims/tossal-d-engrillo) y la Creu de Santos, y el techo de las Terres de l’Ebre.'
			}
		]
	},
	fonts: [VIQUIPEDIA, PARC_ZONA_CARO, PARC_PDF_CARO, PARC_TOP10, PARC_REFUGIS, REFUGI_CARO],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
