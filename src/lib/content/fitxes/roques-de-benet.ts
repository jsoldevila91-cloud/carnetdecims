import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Roques de Benet',
	url: 'https://ca.wikipedia.org/wiki/Roques_de_Benet',
	consultat: CONSULTAT
};

const VIQUIPEDIA_HORTA = {
	nom: 'Viquipèdia: Horta de Sant Joan',
	url: 'https://ca.wikipedia.org/wiki/Horta_de_Sant_Joan',
	consultat: CONSULTAT
};

const VIQUIPEDIA_PARC = {
	nom: 'Viquipèdia: Parc Natural dels Ports',
	url: 'https://ca.wikipedia.org/wiki/Parc_Natural_dels_Ports',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Roques de Benet',
	url: 'https://reptesmuntanyencs.cat/roques-de-benet/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'roques-de-benet',
	descripcio: {
		ca: [
			"Les Roques de Benet són el conjunt paisatgístic més característic del sector septentrional dels Ports, segons la Viquipèdia, al terme d'Horta de Sant Joan, a [la Terra Alta](/comarques/terra-alta). Pertanyen als Ports de Tortosa-Beseit i queden dins el Parc Natural dels Ports. La Viquipèdia les descriu com unes parets verticals de conglomerat que s'alcen gairebé 300 m i cauen a plom sobre un sòcol calcari, separades d'Horta de Sant Joan per una gran plana.",
			"L'article d'Horta de Sant Joan explica que la roca de l'esquerra s'anomena popularment el Cap de Gos pel seu perfil, que recorda el d'un gos. Sobre el nom, la Viquipèdia indica que «Bene» és d'origen àrab i apareix en la carta de poblament del segle XII. Al mateix terme hi ha [Santa Bàrbara](/cims/santa-barbara), també cim essencial, i a l'oest del parc, el [Tossal d'Engrilló](/cims/tossal-d-engrillo).",
			"La Viquipèdia també descriu un itinerari marcat fins al cim, aplicable a tothom que tingui una mínima forma física, des d'on es veuen la plana i les muntanyes del voltant, i en dies clars el Pirineu. Reptes Muntanyencs hi parla d'un recorregut circular amb un tram de pedres soltes de diferents volums que poden entorpir el pas, i d'un descens vertiginós per terreny atarterat, amb pedra de mala qualitat.",
			'Hi ha, a més, trams on el bloc avisa del perill de caiguda: una gran timba barra el pas i la caiguda seria mortal. Quan no es vol grimpar ni desgrimpar, la solució que dona és seguir el camí fitat.'
		],
		es: [
			'Las Roques de Benet son el conjunto paisajístico más característico del sector septentrional de los Ports, según la Viquipèdia, en el término de Horta de Sant Joan, en [la Terra Alta](/comarques/terra-alta). Pertenecen a los Ports de Tortosa-Beseit y quedan dentro del Parc Natural dels Ports. La Viquipèdia las describe como unas paredes verticales de conglomerado que se elevan casi 300 m y caen a plomo sobre un zócalo calizo, separadas de Horta de Sant Joan por una gran llanura.',
			"El artículo de Horta de Sant Joan explica que la roca de la izquierda se llama popularmente el Cap de Gos por su perfil, que recuerda al de un perro. Sobre el nombre, la Viquipèdia indica que «Bene» es de origen árabe y aparece en la carta de poblamiento del siglo XII. En el mismo término está [Santa Bàrbara](/cims/santa-barbara), también cima esencial, y en el oeste del parque, el [Tossal d'Engrilló](/cims/tossal-d-engrillo).",
			'La Viquipèdia describe también un itinerario marcado hasta la cima, apto para cualquiera con una mínima forma física, desde donde se ven la llanura y las montañas de alrededor, y en días claros el Pirineo. Reptes Muntanyencs habla de un recorrido circular con un tramo de piedras sueltas de distintos volúmenes que pueden entorpecer el paso, y de un descenso vertiginoso por terreno pedregoso, con piedra de mala calidad.',
			'Hay, además, tramos donde el blog avisa del peligro de caída: un gran precipicio cierra el paso y la caída sería mortal. Cuando no se quiere trepar ni destrepar, la solución que da es seguir el camino con hitos.'
		]
	},
	rutes: [
		{
			id: 'pista-de-les-eres',
			nom: {
				ca: 'Circular des de la pista de les Eres',
				es: 'Circular desde la pista de les Eres'
			},
			sortida: { nom: 'Pista de les Eres (Horta de Sant Joan)' },
			descripcio: {
				ca: "Reptes Muntanyencs documenta una circular que surt de la pista de les Eres, amb pistes i senders: 12,2 km, uns 555 m de desnivell positiu i 3 h 27 min de marxa efectiva. Hi ha una fletxa verda al sender inicial, fites al camí i, cap al final, senyals de pintura groga. El bloc recomana, si no es vol grimpar ni desgrimpar, seguir el camí fitat, i avisa d'un descens molt dret per terreny atarterat. Aquestes xifres són de la circular completa, no només de la pujada.",
				es: 'Reptes Muntanyencs documenta una circular que sale de la pista de les Eres, con pistas y senderos: 12,2 km, unos 555 m de desnivel positivo y 3 h 27 min de marcha efectiva. Hay una flecha verde en el sendero inicial, hitos en el camino y, hacia el final, señales de pintura amarilla. El blog recomienda, si no se quiere trepar ni destrepar, seguir el camino con hitos, y avisa de un descenso muy empinado por terreno pedregoso. Estas cifras son de la circular completa, no solo de la subida.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'Segueix el camí fitat si no vols grimpar ni desgrimpar, segons el bloc: no tallis camí cap a les timbes.',
			"El bloc avisa d'un lloc on una gran timba barra el pas i la caiguda seria mortal: no t'hi acostis.",
			'El descens que descriu el bloc és vertiginós, per terreny atarterat, amb pedra de mala qualitat: porta calçat de muntanya.',
			"Si fa estona que no veus senyals, el bloc diu que t'has equivocat: torna enrere.",
			"Consulta la normativa vigent del Parc Natural dels Ports abans de sortir. Telèfon d'emergències: 112."
		],
		es: [
			'Sigue el camino con hitos si no quieres trepar ni destrepar, según el blog: no cortes camino hacia los precipicios.',
			'El blog avisa de un lugar donde un gran precipicio cierra el paso y la caída sería mortal: no te acerques.',
			'El descenso que describe el blog es vertiginoso, por terreno pedregoso, con piedra de mala calidad: lleva calzado de montaña.',
			'Si hace rato que no ves señales, el blog dice que te has equivocado: vuelve atrás.',
			'Consulta la normativa vigente del Parc Natural dels Ports antes de salir. Teléfono de emergencias: 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Es pot pujar a les Roques de Benet sense escalar?',
				resposta:
					'Segons la Viquipèdia, hi ha un itinerari marcat fins al cim apte per a qui tingui una mínima forma física. El bloc recomana seguir el camí fitat si no es vol grimpar ni desgrimpar.'
			},
			{
				pregunta: 'Quant es triga?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 12,2 km des de la pista de les Eres amb 3 h 27 min de marxa efectiva, que inclou la pujada i la tornada.'
			},
			{
				pregunta: 'Per què es diu Roques de Benet?',
				resposta:
					"La Viquipèdia explica que «Bene» és d'origen àrab i apareix en la carta de poblament del segle XII."
			},
			{
				pregunta: 'Compten com a cim essencial?',
				resposta:
					'Sí, són un dels [cims essencials](/cims-essencials) de la Terra Alta, amb [Santa Bàrbara](/cims/santa-barbara).'
			}
		],
		es: [
			{
				pregunta: '¿Se puede subir a las Roques de Benet sin escalar?',
				resposta:
					'Según la Viquipèdia, hay un itinerario marcado hasta la cima apto para quien tenga una mínima forma física. El blog recomienda seguir el camino con hitos si no se quiere trepar ni destrepar.'
			},
			{
				pregunta: '¿Cuánto se tarda?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 12,2 km desde la pista de les Eres con 3 h 27 min de marcha efectiva, que incluye la subida y la vuelta.'
			},
			{
				pregunta: '¿Por qué se llaman Roques de Benet?',
				resposta:
					'La Viquipèdia explica que «Bene» es de origen árabe y aparece en la carta de poblamiento del siglo XII.'
			},
			{
				pregunta: '¿Cuentan como cima esencial?',
				resposta:
					'Sí, son una de las [cimas esenciales](/cims-essencials) de la Terra Alta, con [Santa Bàrbara](/cims/santa-barbara).'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_HORTA, VIQUIPEDIA_PARC, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
