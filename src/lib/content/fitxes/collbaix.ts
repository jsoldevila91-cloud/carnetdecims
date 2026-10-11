import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Collbaix (Manresa)',
	url: 'https://ca.wikipedia.org/wiki/Collbaix_(Manresa)',
	consultat: CONSULTAT
};

const MANRESA = {
	nom: 'Ajuntament de Manresa, Anella Verda: El Collbaix (M1)',
	url: 'https://web.manresa.cat/web/article/7546-el-collbaix-(m1)',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: Collbaix, la talaia del Pla del Bages',
	url: 'https://totnens.cat/que-fem/collbaix-latalaia-del-pla-del-bages/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'collbaix',
	descripcio: {
		ca: [
			"El Collbaix és un turó de cim pla que tanca el pla de Bages per ponent, entre les rieres de Rajadell i de Fonollosa. Hi toquen diversos termes del [Bages](/comarques/bages): segons la Viquipèdia, el vessant de llevant és de Sant Joan de Vilatorrada, el del sud de Manresa, que hi té el punt més alt del municipi, i bona part del cim, de Fonollosa. És el més baix dels tres cims essencials de la comarca; els altres dos són [el Montcau](/cims/montcau) i [l'Elefant](/cims/elefant-roca-de-sant-salvador).",
			"La forma té explicació. La Viquipèdia diu que el turó ha quedat en relleu perquè un estrat de conglomerat resistent protegeix el cim de l'erosió que s'ha endut els terrenys del voltant; l'Ajuntament de Manresa en diu un bon exemple de relleu tabular. El mateix Ajuntament el presenta com un referent geogràfic per als manresans i el destí de moltes excursions, i l'ha inclòs als itineraris de l'Anella Verda.",
			"El cim és una esplanada amb una bandera, una taula d'orientació i un plafó informatiu. Des d'allà, Totnens descriu el pla de Bages als peus i Montserrat al fons. A la pujada es passa per cabanes de pedra seca, entre els camps, i per unes tines de pedra dins del bosc.",
			"És una sortida curta per a tot l'any. L'esplanada del cim és oberta i acaba en un cingle: no és lloc per córrer."
		],
		es: [
			'El Collbaix es un cerro de cima plana que cierra el pla de Bages por poniente, entre las rieras de Rajadell y de Fonollosa. Lo tocan varios términos del [Bages](/comarques/bages): según la Viquipèdia, la vertiente de levante es de Sant Joan de Vilatorrada, la del sur de Manresa, que tiene allí el punto más alto del municipio, y buena parte de la cima, de Fonollosa. Es la más baja de las tres cimas esenciales de la comarca; las otras dos son [el Montcau](/cims/montcau) y [el Elefant](/cims/elefant-roca-de-sant-salvador).',
			'La forma tiene explicación. La Viquipèdia dice que el cerro ha quedado en relieve porque un estrato de conglomerado resistente protege la cima de la erosión que se ha llevado los terrenos de alrededor; el Ayuntamiento de Manresa lo llama un buen ejemplo de relieve tabular. El mismo Ayuntamiento lo presenta como un referente geográfico para los manresanos y el destino de muchas excursiones, y lo ha incluido en los itinerarios del Anillo Verde.',
			'La cima es una explanada con una bandera, una mesa de orientación y un panel informativo. Desde allí, Totnens describe el pla de Bages a los pies y Montserrat al fondo. En la subida se pasa por cabañas de piedra seca, entre los campos, y por unas tinas de piedra dentro del bosque.',
			'Es una salida corta para todo el año. La explanada de la cima es abierta y acaba en un cingle: no es sitio para correr.'
		]
	},
	rutes: [
		{
			id: 'sant-joan',
			nom: {
				ca: 'Des de Sant Joan de Vilatorrada pel GR 3 i les tines',
				es: 'Desde Sant Joan de Vilatorrada por el GR 3 y las tinas'
			},
			sortida: { nom: 'Final del carrer Collbaix (Sant Joan de Vilatorrada)' },
			descripcio: {
				ca: "Totnens la descriu com una ruta fàcil i senyalitzada, de 6,5 km i unes 3 hores amb parades, que fa en circular. Del final del carrer Collbaix segueix una pista, voreja camps i cabanes de pedra seca i enllaça amb el GR 3, de marques blanques i vermelles. Passada una pista asfaltada, un sender s'endinsa al bosc i puja per les tines: és el tram més costerut, amb trossos tan erosionats que semblen una torrentera, però es fa a poc a poc. De baixada, el web tria el camí del Congost, amb trams pedregosos, tot i que també es pot tornar per on s'ha pujat.",
				es: 'Totnens la describe como una ruta fácil y señalizada, de 6,5 km y unas 3 horas con paradas, que hace en circular. Desde el final de la calle Collbaix sigue una pista, bordea campos y cabañas de piedra seca y enlaza con el GR 3, de marcas blancas y rojas. Pasada una pista asfaltada, un sendero se adentra en el bosque y sube por las tinas: es el tramo más empinado, con trozos tan erosionados que parecen una torrentera, pero se hace poco a poco. De bajada, la web elige el camino del Congost, con tramos pedregosos, aunque también se puede volver por donde se ha subido.'
			},
			fonts: [TOTNENS]
		},
		{
			id: 'manresa-anella-verda',
			nom: {
				ca: "Itinerari M1 de l'Anella Verda, des de Manresa",
				es: 'Itinerario M1 del Anillo Verde, desde Manresa'
			},
			sortida: { nom: 'El Congost (Manresa)' },
			descripcio: {
				ca: "L'Ajuntament de Manresa el proposa per pujar-hi des de la ciutat: 11,75 km, 3 hores i 421 m de desnivell, de dificultat mitjana. Són xifres de tot l'itinerari.",
				es: 'El Ayuntamiento de Manresa lo propone para subir desde la ciudad: 11,75 km, 3 horas y 421 m de desnivel, de dificultad media. Son cifras de todo el itinerario.'
			},
			fonts: [MANRESA]
		}
	],
	consells: {
		ca: [
			"L'esplanada del cim acaba en un penya-segat, avisa Totnens: amb canalla, marca'ls fins on poden arribar abans de deixar-los córrer.",
			'El tram de les tines té el terra molt erosionat, com una torrentera: després de pluges demana més atenció.',
			'El cotxe es deixa al final del carrer Collbaix, on comença la pista.',
			"Les cabanes de pedra seca i les tines són patrimoni: mira-les sense enfilar-t'hi.",
			'Des de Manresa la volta és força més llarga: si tens poc temps, surt de Sant Joan.'
		],
		es: [
			'La explanada de la cima acaba en un acantilado, avisa Totnens: con niños, márcales hasta dónde pueden llegar antes de dejarlos correr.',
			'El tramo de las tinas tiene el suelo muy erosionado, como una torrentera: después de lluvias pide más atención.',
			'El coche se deja al final de la calle Collbaix, donde empieza la pista.',
			'Las cabañas de piedra seca y las tinas son patrimonio: míralas sin subirte a ellas.',
			'Desde Manresa la vuelta es bastante más larga: si tienes poco tiempo, sal de Sant Joan.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Collbaix?',
				resposta:
					"Des de Sant Joan de Vilatorrada, Totnens compta unes 3 hores amb nens i parades per a una circular de 6,5 km. Des de Manresa, l'itinerari M1 de l'Anella Verda fa 11,75 km i 421 m de desnivell, també en 3 hores."
			},
			{
				pregunta: 'Es pot pujar al Collbaix amb nens?',
				resposta:
					"Sí: Totnens la proposa com a excursió apta per a famílies, malgrat algun tram costerut. El punt on cal estar a sobre de la canalla és el cim, perquè l'esplanada acaba en un penya-segat."
			},
			{
				pregunta: 'Per què el Collbaix té el cim pla?',
				resposta:
					"Perquè el corona un estrat de conglomerat més resistent que els terrenys del voltant, que l'erosió s'ha anat enduent. Per això l'Ajuntament de Manresa el posa com a exemple de relleu tabular."
			},
			{
				pregunta: 'El Collbaix és de Manresa o de Sant Joan de Vilatorrada?',
				resposta:
					"De tots dos, i també de Fonollosa. El punt més alt del terme de Manresa és aquí, però el repte situa el cim a Sant Joan de Vilatorrada, que és d'on surt la ruta més curta."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Collbaix?',
				resposta:
					'Desde Sant Joan de Vilatorrada, Totnens cuenta unas 3 horas con niños y paradas para una circular de 6,5 km. Desde Manresa, el itinerario M1 del Anillo Verde tiene 11,75 km y 421 m de desnivel, también en 3 horas.'
			},
			{
				pregunta: '¿Se puede subir al Collbaix con niños?',
				resposta:
					'Sí: Totnens la propone como excursión apta para familias, pese a algún tramo empinado. El punto donde hay que estar encima de los niños es la cima, porque la explanada acaba en un acantilado.'
			},
			{
				pregunta: '¿Por qué el Collbaix tiene la cima plana?',
				resposta:
					'Porque lo corona un estrato de conglomerado más resistente que los terrenos de alrededor, que la erosión se ha ido llevando. Por eso el Ayuntamiento de Manresa lo pone como ejemplo de relieve tabular.'
			},
			{
				pregunta: '¿El Collbaix es de Manresa o de Sant Joan de Vilatorrada?',
				resposta:
					'De los dos, y también de Fonollosa. El punto más alto del término de Manresa está aquí, pero el reto sitúa la cima en Sant Joan de Vilatorrada, que es de donde sale la ruta más corta.'
			}
		]
	},
	fonts: [VIQUIPEDIA, MANRESA, TOTNENS],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
