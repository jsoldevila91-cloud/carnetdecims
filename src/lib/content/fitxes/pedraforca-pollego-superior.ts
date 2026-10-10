import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-03';

const PARC_ESTASEN = {
	nom: 'Parc Natural del Cadí-Moixeró: itinerari 22, Pedraforca pel refugi Lluís Estasen (PDF)',
	url: 'https://parcsnaturals.gencat.cat/web/.content/Xarxa-de-parcs/Cadi/gaudeix_del_parc/equipaments-i-itineraris/itinerari/a-peu/22.PNCM-PEDRAFORCA-PEL-REFUGI-LLUIS-ESTASEN-cat.pdf',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS_GOSOL = {
	nom: 'Rutes Pirineus: Pedraforca des de Gósol',
	url: 'https://www.rutespirineus.cat/rutes/pedraforca-per-gosol-bergueda',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pedraforca-pollego-superior',
	descripcio: {
		ca: [
			"El Pedraforca és la muntanya més reconeixible de Catalunya. S'aixeca aïllat entre els termes de Saldes i Gósol, a l'extrem occidental [del Berguedà](/comarques/bergueda), i forma part del Parc Natural del Cadí-Moixeró. El cim del repte és el **Pollegó Superior**, la punta més alta del massís; a migdia hi ha el Pollegó Inferior i, entre tots dos, l'Enforcadura, la collada que dona a la muntanya la seva silueta de forca.",
			"El nom ho diu tot: «pedra en forma de forca». La forma ve de l'erosió desigual de les calcàries dures i de les margues més toves que les acompanyen, dins d'un relleu de mantells de corriment format durant l'orogènia alpina. El 1982 el massís va ser declarat paratge natural d'interès nacional i el 2004 es va integrar al parc natural. També és un lloc clau de l'escalada catalana: el 1928 Lluís Estasen i els seus companys van obrir la paret nord, i el refugi que hi ha als peus porta el seu nom. La llegenda hi fa trobar les bruixes la nit de Cap d'Any, i Verdaguer el va fer servir com a imatge de la terra.",
			"Des del cim es veu la serra del Cadí a tocar, amb el [Comabona](/cims/comabona) i els cims veïns, la serra d'Ensija i, al fons, bona part del Pirineu i de la Catalunya central. Per la seva posició separada de les grans serres, la vista és molt oberta en totes direccions.",
			"Quan les canals ja no tenen neu, de finals de primavera a la tardor, és el moment de pujar-hi. A l'estiu hi ha molta gent i tempestes a la tarda; a l'hivern les canals i l'Enforcadura poden tenir neu i gel, i aleshores l'ascensió és una activitat d'alta muntanya que demana material i experiència."
		],
		es: [
			'El Pedraforca es la montaña más reconocible de Cataluña. Se alza aislado entre los municipios de Saldes y Gósol, en el extremo occidental [del Berguedà](/comarques/bergueda), dentro del Parque Natural del Cadí-Moixeró. La cima del reto es el **Pollegó Superior**, la punta más alta del macizo; al sur queda el Pollegó Inferior y, entre ambos, la Enforcadura, el collado que da a la montaña su silueta de horca.',
			'El nombre lo dice todo: en catalán, «piedra en forma de horca». Esa forma se debe a la erosión desigual de las calizas duras y las margas más blandas, en un relieve de mantos de corrimiento levantado durante la orogenia alpina. En 1982 el macizo se declaró paraje natural de interés nacional y en 2004 se integró en el parque natural. Es además un lugar clave de la escalada catalana: en 1928 Lluís Estasen y sus compañeros abrieron la pared norte, y el refugio que hay a sus pies lleva su nombre. La leyenda sitúa allí a las brujas la noche de Fin de Año, y Verdaguer lo usó como imagen de la tierra catalana.',
			'Desde la cima se ve la sierra del Cadí muy cerca, con el [Comabona](/cims/comabona) y las cumbres vecinas, la sierra de Ensija y, al fondo, buena parte del Pirineo y de la Cataluña central. Al estar separado de las grandes sierras, la vista es muy abierta en todas direcciones.',
			'Cuando las canales ya no tienen nieve, de finales de primavera al otoño, es el momento de subir. En verano hay mucha gente y tormentas por la tarde; en invierno las canales y la Enforcadura pueden tener nieve y hielo, y entonces la ascensión es una actividad de alta montaña que exige material y experiencia.'
		]
	},
	rutes: [
		{
			id: 'gosol',
			nom: { ca: "Des de Gósol per l'Enforcadura", es: 'Desde Gósol por la Enforcadura' },
			sortida: { nom: 'Gósol (Hostal Cal Franciscó, 1.415 m)' },
			desnivellPositiuM: 1100,
			distanciaKm: 4.2,
			tempsMinuts: 210,
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "És la via d'ascens amb menys dificultat tècnica. Es puja per bosc fins a la serra de la Tossa, després per la tartera de Gósol fins a l'Enforcadura i, finalment, per una canal rocosa on cal ajudar-se de les mans en alguns trams. Es torna pel mateix camí. Prop del cim no t'acostis a la vora dels cingles.",
				es: 'Es la vía de ascenso con menos dificultad técnica. Se sube por bosque hasta la sierra de la Tossa, luego por la pedrera de Gósol hasta la Enforcadura y, al final, por una canal rocosa donde hay que usar las manos en algunos tramos. Se vuelve por el mismo camino. Cerca de la cima, no te acerques al borde de los cortados.'
			},
			fonts: [RUTES_PIRINEUS_GOSOL]
		},
		{
			id: 'gresolet-verdet',
			nom: {
				ca: 'Des del mirador de Gresolet pel coll del Verdet',
				es: 'Desde el mirador de Gresolet por el collado del Verdet'
			},
			sortida: { nom: 'Aparcament del mirador de Gresolet (Saldes)' },
			tecnicitat: 'grimpada',
			descripcio: {
				ca: "Ruta circular del parc natural: 8,9 km, 1.100 m de desnivell i unes 5 h en total, valorada com a molt exigent. Puja pel refugi Lluís Estasen fins al coll del Verdet i continua per la canal del Verdet, un pas equipat on cal grimpar uns 120 m. Es baixa per l'Enforcadura i el camí que voreja la tartera de Saldes: no es recomana baixar per la mateixa tartera, molt degradada i amb risc d'accidents.",
				es: 'Ruta circular del parque natural: 8,9 km, 1.100 m de desnivel y unas 5 h en total, valorada como muy exigente. Sube por el refugio Lluís Estasen hasta el collado del Verdet y sigue por la canal del Verdet, un paso equipado donde hay que trepar unos 120 m. Se baja por la Enforcadura y el sendero que bordea la pedrera de Saldes: no se recomienda bajar por la propia pedrera, muy degradada y con riesgo de accidentes.'
			},
			fonts: [PARC_ESTASEN]
		}
	],
	consells: {
		ca: [
			'Si no tens experiència en grimpades, puja per Gósol: evita la canal del Verdet.',
			"Evita baixar per la tartera de Saldes: les autoritats i els serveis d'emergència ho desaconsellen pel desgast del terreny i el risc d'accidents; fes servir el camí senyalitzat que la voreja.",
			"Surt d'hora a l'estiu: les tempestes de tarda són habituals i la roca mullada és molt relliscosa.",
			"A l'aparcament del mirador de Gresolet hi ha unes 25 places; en alguns estius el parc ha regulat l'accés motoritzat a la zona, consulta-ho abans de sortir.",
			"Amb neu o gel, l'ascensió requereix crampons, piolet i experiència. En cas d'emergència, truca al 112."
		],
		es: [
			'Si no tienes experiencia trepando, sube por Gósol: evita la canal del Verdet.',
			'Evita bajar por la pedrera de Saldes: las autoridades y los servicios de emergencia lo desaconsejan por el desgaste del terreno y el riesgo de accidentes; usa el sendero señalizado que la bordea.',
			'En verano sal temprano: las tormentas de tarde son habituales y la roca mojada resbala mucho.',
			'El aparcamiento del mirador de Gresolet tiene unas 25 plazas; algunos veranos el parque ha regulado el acceso motorizado a la zona, consúltalo antes de salir.',
			'Con nieve o hielo, la ascensión requiere crampones, piolet y experiencia. En caso de emergencia, llama al 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Pedraforca?',
				resposta:
					"Des de Gósol, unes 3 h 30 min fins al Pollegó Superior i gairebé 7 h anada i tornada sense parades, segons Rutes Pirineus. La circular del parc des del mirador de Gresolet s'estima en unes 5 h en total."
			},
			{
				pregunta: 'Quina és la ruta més fàcil per pujar al Pedraforca?',
				resposta:
					"La de Gósol per l'Enforcadura, perquè evita la grimpada de la canal del Verdet. Tot i així, l'últim tram és una canal rocosa on cal fer servir les mans: no és una excursió per a qualsevol."
			},
			{
				pregunta: 'Es pot pujar al Pedraforca amb nens?',
				resposta:
					"Només amb nens grans, acostumats a la muntanya i a grimpar, i sempre amb un adult experimentat. L'última part té trams aeris, pedra solta i molta gent a l'estiu. Per a famílies, el mirador de Gresolet és una alternativa amb vistes a la cara nord."
			},
			{
				pregunta: 'El Pedraforca és un cim essencial del repte 100 Cims?',
				resposta:
					"Sí, però el que compta és el Pollegó Superior: l'Enforcadura és el coll de pas, no el cim. Al Berguedà comparteix la llista amb el [Comabona](/cims/comabona) i [la Tosa](/cims/la-tosa), tots dos una mica més alts."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Pedraforca?',
				resposta:
					'Desde Gósol, unas 3 h 30 min hasta el Pollegó Superior y casi 7 h ida y vuelta sin paradas, según Rutes Pirineus. La circular del parque desde el mirador de Gresolet se estima en unas 5 h en total.'
			},
			{
				pregunta: '¿Cuál es la ruta más fácil para subir al Pedraforca?',
				resposta:
					'La de Gósol por la Enforcadura, porque evita la trepada de la canal del Verdet. Aun así, el último tramo es una canal rocosa donde hay que usar las manos: no es una excursión para cualquiera.'
			},
			{
				pregunta: '¿Se puede subir al Pedraforca con niños?',
				resposta:
					'Solo con niños mayores, acostumbrados a la montaña y a trepar, y siempre con un adulto con experiencia. La última parte tiene tramos aéreos, piedra suelta y mucha gente en verano. Para familias, el mirador de Gresolet es una alternativa con vistas a la cara norte.'
			},
			{
				pregunta: '¿El Pedraforca es una cima esencial del reto 100 Cims?',
				resposta:
					'Sí, pero lo que cuenta es el Pollegó Superior: la Enforcadura es el collado de paso, no la cima. En el Berguedà comparte la lista con el [Comabona](/cims/comabona) y [la Tosa](/cims/la-tosa), ambos algo más altos.'
			}
		]
	},
	wikiloc: [
		{
			id: 2319964,
			titol: 'Pedraforca des de Gósol',
			url: 'https://ca.wikiloc.com/rutes-alpinisme/pedraforca-des-de-gosol-2319964'
		},
		{
			id: 103120761,
			titol: 'GÓSOL - PEDRAFORCA - GÓSOL (tornada lineal). Pollegó Superior, 2.506m. KMV - KV',
			url: 'https://es.wikiloc.com/rutas-senderismo/gosol-pedraforca-gosol-tornada-lineal-pollego-superior-2-506m-kmv-103120761'
		},
		{
			id: 4998159,
			titol:
				'Pedraforca (Pollegó Superior) por el collado del Verdet y Enforcadura, P.N. Cadí-Moixeró',
			url: 'https://ca.wikiloc.com/rutes-alpinisme/pedraforca-pollego-superior-por-el-collado-del-verdet-y-enforcadura-p-n-cadi-moixero-4998159'
		}
	],
	fonts: [
		{
			nom: 'Viquipèdia: Pedraforca',
			url: 'https://ca.wikipedia.org/wiki/Pedraforca',
			consultat: CONSULTAT
		},
		PARC_ESTASEN,
		RUTES_PIRINEUS_GOSOL,
		{
			nom: "Govern.cat: els parcs naturals regulen l'accés motoritzat a l'estiu",
			url: 'https://govern.cat/gov/notes-premsa/422643/els-parcs-naturals-regulen-de-nou-aquest-estiu-l-acces-motoritzat-per-evitar-aglomeracions-que-posin-en-risc-la-capacitat-d-acollida-del-medi-natural',
			consultat: CONSULTAT
		}
	],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
