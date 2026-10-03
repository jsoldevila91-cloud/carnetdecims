import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-03';

const RUTES_PIRINEUS = {
	nom: "Rutes Pirineus: Pica d'Estats des de la Vall Ferrera",
	url: 'https://www.rutespirineus.cat/rutes/pica-estats-des-del-refugi-de-la-vall-ferrera',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: Pica d'Estats per Vallferrera",
	url: 'https://dexcursio.net/pica-destats-per-vallferrera/',
	consultat: CONSULTAT
};

const VIQUIPEDIA = {
	nom: "Viquipèdia: Pica d'Estats",
	url: 'https://ca.wikipedia.org/wiki/Pica_d%27Estats',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pica-d-estats',
	descripcio: {
		ca: [
			"La Pica d'Estats és el sostre de Catalunya. És a la carena fronterera entre la Vall Ferrera, al terme d'Alins, [al Pallars Sobirà](/comarques/pallars-sobira), i la vall de Vicdessos, a l'Arieja. El cim queda dins del Parc Natural de l'Alt Pirineu i, pel vessant nord, del Parc Natural Regional dels Pirineus Ariejans.",
			"No és una punta solitària sinó un petit massís de tresmils. A l'oest hi ha el pic Verdaguer i a l'est la punta de Gabarró, i a menys d'un quilòmetre s'alça el [Pic de Sotllo](/cims/pic-de-sotllo), un altre cim del repte que molta gent encadena el mateix dia. La primera ascensió coneguda és del 1864, a càrrec de Henry Russell i Jean-Jacques Denjean. El 1883 hi va pujar Jacint Verdaguer, i per això la punta occidental porta el nom del poeta. Pujar-hi és, per a molts excursionistes catalans, una mena de ritual.",
			"Des de dalt la vista és d'alta muntanya pura: el Montcalm just al costat, els estanys de la vall de Sotllo als peus, les valls de l'Arieja cap al nord i, cap al sud i l'oest, una gran part del Pirineu, d'Andorra a l'Aran. És el cim més alt [dels cims essencials](/cims-essencials) i de [tots els tresmils del repte](/tresmils).",
			"La temporada habitual va de juliol a setembre o principi d'octubre. Fins ben entrat l'estiu hi pot quedar neu a les pales orientades al nord, i a l'hivern i la primavera la ruta passa per terreny amb risc d'allaus. És una sortida llarga: compta-ho bé i surt molt d'hora."
		],
		es: [
			"La Pica d'Estats es el techo de Cataluña. Está en la cresta fronteriza entre la Vall Ferrera, en el municipio de Alins, [en el Pallars Sobirà](/comarques/pallars-sobira), y el valle de Vicdessos, en el Ariège. La cima queda dentro del Parque Natural del Alt Pirineu y, por la vertiente norte, del parque natural regional de los Pirineos del Ariège (Pyrénées Ariégeoises).",
			'No es una punta aislada sino un pequeño macizo de tresmiles. Al oeste está el pico Verdaguer y al este la punta de Gabarró, y a menos de un kilómetro se alza el [Pic de Sotllo](/cims/pic-de-sotllo), otra cima del reto que mucha gente encadena el mismo día. La primera ascensión conocida es de 1864, obra de Henry Russell y Jean-Jacques Denjean. En 1883 subió Jacint Verdaguer, y por eso la punta occidental lleva el nombre del poeta. Para muchos excursionistas catalanes, subir aquí es casi un ritual.',
			'Desde arriba la vista es de alta montaña: el Montcalm justo al lado, los lagos del valle de Sotllo a los pies, los valles del Ariège hacia el norte y, hacia el sur y el oeste, gran parte del Pirineo, de Andorra al Aran. Es la cima más alta [de las cimas esenciales](/cims-essencials) y de [todos los tresmiles del reto](/tresmils).',
			'La temporada habitual va de julio a septiembre o principios de octubre. Hasta bien entrado el verano puede quedar nieve en las palas orientadas al norte, y en invierno y primavera la ruta pasa por terreno con riesgo de aludes. Es una salida larga: calcula bien el tiempo y sal muy temprano.'
		]
	},
	rutes: [
		{
			id: 'vallferrera',
			nom: {
				ca: 'Des de la Molinassa pel refugi de Vallferrera i el port de Sotllo',
				es: 'Desde la Molinassa por el refugio de Vallferrera y el port de Sotllo'
			},
			sortida: { nom: 'Aparcament de la Molinassa (Àreu, 1.805 m)' },
			distanciaKm: 10.2,
			tempsMinuts: 315,
			descripcio: {
				ca: "És la via clàssica pel vessant sud. Des de la Molinassa es passa pel refugi de Vallferrera i es remunta la vall de Sotllo, amb els estanys de Sotllo i d'Estats, fins al port de Sotllo. Allà es fa un breu tram pel vessant francès fins al coll de Riufred i s'acaba per la carena. No té passos tècnics, però hi ha pendents forts i és molt llarga: més de 20 km anada i tornada.",
				es: 'Es la vía clásica por la vertiente sur. Desde la Molinassa se pasa por el refugio de Vallferrera y se remonta el valle de Sotllo, con los lagos de Sotllo y de Estats, hasta el port de Sotllo. Allí se hace un breve tramo por la vertiente francesa hasta el collado de Riufred y se termina por la cresta. No tiene pasos técnicos, pero hay pendientes fuertes y es muy larga: más de 20 km ida y vuelta.'
			},
			fonts: [RUTES_PIRINEUS, DEXCURSIO]
		},
		{
			id: 'vicdessos',
			nom: {
				ca: "Pel vessant francès (vall de l'Artiga)",
				es: "Por la vertiente francesa (valle de l'Artiga)"
			},
			sortida: { nom: "L'Artiga (Auzat, Arieja)" },
			descripcio: {
				ca: "Pel nord s'hi accedeix des de la vall de l'Artiga, a Auzat, passant pel refugi del Pinet i l'estany de Montcalm. Per a qui ve de Catalunya l'accés en cotxe és molt més llarg, però és una alternativa habitual per als excursionistes de l'Arieja.",
				es: "Por el norte se accede desde el valle de l'Artiga, en Auzat, pasando por el refugio del Pinet y el lago de Montcalm. Para quien viene de Cataluña el acceso en coche es mucho más largo, pero es una alternativa habitual para los excursionistas del Ariège."
			},
			fonts: [VIQUIPEDIA]
		}
	],
	consells: {
		ca: [
			"La pista d'Àreu a la Molinassa pot estar en mal estat al final: informa't abans o puja amb un vehicle adequat.",
			"Si vols fer-la en dos dies, el refugi de Vallferrera és a pocs minuts de l'aparcament: reserva-hi plaça a l'estiu.",
			"Amb neu, el barranc de Sotllo té risc d'allaus i calen crampons i piolet; consulta el butlletí d'allaus abans de sortir.",
			"A l'estiu, mira la predicció de tempestes i planteja't girar cua si el temps empitjora: al port de Sotllo i a la carena no hi ha on resguardar-se.",
			'Porta aigua i menjar per a tot el dia; per sobre dels estanys no hi ha fonts segures.'
		],
		es: [
			'La pista de Àreu a la Molinassa puede estar en mal estado al final: infórmate antes o sube con un vehículo adecuado.',
			'Si quieres hacerla en dos días, el refugio de Vallferrera está a pocos minutos del aparcamiento: reserva plaza en verano.',
			'Con nieve, el barranco de Sotllo tiene riesgo de aludes y hacen falta crampones y piolet; consulta el boletín de aludes antes de salir.',
			'En verano, mira la previsión de tormentas y date la vuelta si el tiempo empeora: en el port de Sotllo y en la cresta no hay dónde resguardarse.',
			'Lleva agua y comida para todo el día; por encima de los lagos no hay fuentes seguras.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Quant es triga a pujar a la Pica d'Estats?",
				resposta:
					"Des de l'aparcament de la Molinassa, unes 5 h 15 min fins al cim i unes 10 h anada i tornada sense parades, segons Rutes Pirineus. Molta gent fa nit al refugi de Vallferrera per repartir l'esforç."
			},
			{
				pregunta: "Cal material d'alta muntanya per pujar a la Pica d'Estats?",
				resposta:
					"A l'estiu i sense neu, no: n'hi ha prou amb bon calçat, roba d'abric i experiència en terreny de muntanya. Amb neu, en canvi, calen crampons, piolet i saber-los fer servir, i cal tenir en compte el risc d'allaus."
			},
			{
				pregunta: "Es pot fer la Pica d'Estats i el Pic de Sotllo el mateix dia?",
				resposta:
					"Sí, és habitual. El [Pic de Sotllo](/cims/pic-de-sotllo) és a menys d'un quilòmetre i la ruta normal hi passa a prop. Tots dos compten per separat al repte."
			},
			{
				pregunta: "La Pica d'Estats compta com a cim essencial?",
				resposta:
					'Sí. És un dels [cims essencials](/cims-essencials) del repte i el més alt de tots. Les regles de validació són a la [normativa del repte](/repte-100-cims/normativa).'
			}
		],
		es: [
			{
				pregunta: "¿Cuánto se tarda en subir a la Pica d'Estats?",
				resposta:
					'Desde el aparcamiento de la Molinassa, unas 5 h 15 min hasta la cima y unas 10 h ida y vuelta sin paradas, según Rutes Pirineus. Mucha gente duerme en el refugio de Vallferrera para repartir el esfuerzo.'
			},
			{
				pregunta: "¿Hace falta material de alta montaña para subir a la Pica d'Estats?",
				resposta:
					'En verano y sin nieve, no: basta con buen calzado, ropa de abrigo y experiencia en terreno de montaña. Con nieve, en cambio, hacen falta crampones, piolet y saber usarlos, y hay que tener en cuenta el riesgo de aludes.'
			},
			{
				pregunta: "¿Se pueden hacer la Pica d'Estats y el Pic de Sotllo el mismo día?",
				resposta:
					'Sí, es habitual. El [Pic de Sotllo](/cims/pic-de-sotllo) está a menos de un kilómetro y la ruta normal pasa cerca. Las dos cimas cuentan por separado en el reto.'
			},
			{
				pregunta: "¿La Pica d'Estats cuenta como cima esencial?",
				resposta:
					'Sí. Es una de las [cimas esenciales](/cims-essencials) del reto y la más alta de todas. Las reglas de validación están en la [normativa del reto](/repte-100-cims/normativa).'
			}
		]
	},
	wikiloc: [
		{
			id: 5036904,
			titol: 'Pica d´Estats desde el refugio Vallferrera (sólo ida), Parc Natural Alt Pirineu',
			url: 'https://ca.wikiloc.com/rutes-alpinisme/pica-destats-desde-el-refugio-vallferrera-solo-ida-parc-natural-alt-pirineu-5036904'
		},
		{
			id: 3250196,
			titol: "Pica d'Estats (pel refugi Vallferrera)",
			url: 'https://ca.wikiloc.com/rutes-senderisme/pica-destats-pel-refugi-vallferrera-3250196'
		},
		{
			id: 6701906,
			titol: "Del refugi de Vallferrera a la Pica d'Estats",
			url: 'https://ca.wikiloc.com/rutes-senderisme/del-refugi-de-vallferrera-a-la-pica-destats-6701906'
		}
	],
	fonts: [VIQUIPEDIA, RUTES_PIRINEUS, DEXCURSIO],
	estat: 'esborrany',
	actualitzat: '2026-10-03'
};

export default fitxa;
