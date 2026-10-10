import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: "Viquipèdia: Puig d'Ossa (muntanya de Sant Pere Màrtir)",
	url: 'https://ca.wikipedia.org/wiki/Muntanya_de_Sant_Pere_M%C3%A0rtir',
	consultat: CONSULTAT
};

const DERUTAENRUTA = {
	nom: 'De ruta en ruta: pujada a Sant Pere Màrtir',
	url: 'https://www.derutaenruta.com/ca/rutes/sant-pere-martir',
	consultat: CONSULTAT
};

const BUXAWEB = {
	nom: 'Caminar per Collserola: ascensió a Sant Pere Màrtir des de la plaça Mireia',
	url: 'https://buxaweb.blog/2019/07/15/ascensio-sant-pere-martir/',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Sant Pere Màrtir',
	url: 'https://reptesmuntanyencs.cat/sant-pere-martir/',
	consultat: CONSULTAT
};

const LAMEVABARCELONA = {
	nom: 'La meva Barcelona: passeig de les Aigües i les bateries antiaèries de Sant Pere Màrtir',
	url: 'https://www.lamevabarcelona.com/passeig-de-les-aigues-i-les-bateries-antiaeries-de-sant-pere-martir/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'sant-pere-martir',
	descripcio: {
		ca: [
			"Sant Pere Màrtir, també anomenat puig d'Ossa, és l'extrem sud de la serra de Collserola i el turó que tothom reconeix des de les entrades de Barcelona per la gran torre de telecomunicacions que el corona. Al cim s'hi troben els termes de Barcelona, Esplugues de Llobregat i Sant Just Desvern, aquests dos [al Baix Llobregat](/comarques/baix-llobregat), i és dins del Parc Natural de Collserola. Seguint la serra cap al nord hi ha el [turó de la Magarola](/cims/turo-de-la-magarola), l'altre cim essencial de Collserola.",
			"És un cim amb molta història per a la seva alçada. La Viquipèdia en recull el nom antic, Monte de Ursa, documentat l'any 986, i indicis d'un assentament ibèric al cim. Al segle XVII s'hi va aixecar l'ermita de Sant Pere Màrtir, on els pobles del voltant hi anaven en aplec el 29 d'abril; el 1792 es va abandonar i es va convertir en fortificació militar. Entre el 1834 i el 1856 va tenir una torre de telegrafia òptica de la línia de Montjuïc cap a l'Ordal, Lleida i València, i durant la Guerra Civil s'hi van instal·lar bateries antiaèries per defensar Barcelona dels bombardejos, que van caure el gener del 1939. Avui se'n poden veure les restes recuperades, les ruïnes de l'ermita i una torre de guaita contra incendis.",
			'Des de dalt la vista abraça tota Barcelona fins al mar, el delta i la plana del Llobregat, el Garraf i, cap al nord, la carena de Collserola fins al Tibidabo.',
			"Si hi vas per la vista, tria un dia clar: amb calitja, el mar i el Garraf es desdibuixen. A l'estiu, millor a primera hora: bona part del camí és a ple sol."
		],
		es: [
			"Sant Pere Màrtir, también llamado puig d'Ossa, es el extremo sur de la sierra de Collserola y el cerro que todo el mundo reconoce desde las entradas de Barcelona por la gran torre de telecomunicaciones que lo corona. En la cima confluyen los municipios de Barcelona, Esplugues de Llobregat y Sant Just Desvern, estos dos [en el Baix Llobregat](/comarques/baix-llobregat), y está dentro del Parque Natural de Collserola. Siguiendo la sierra hacia el norte está el [turó de la Magarola](/cims/turo-de-la-magarola), la otra cima esencial de Collserola.",
			'Es una cima con mucha historia para su altura. La Viquipèdia recoge su nombre antiguo, Monte de Ursa, documentado en el año 986, e indicios de un asentamiento ibérico en la cima. En el siglo XVII se levantó la ermita de Sant Pere Màrtir, a la que los pueblos de alrededor acudían en romería el 29 de abril; en 1792 se abandonó y se convirtió en fortificación militar. Entre 1834 y 1856 tuvo una torre de telegrafía óptica de la línea de Montjuïc hacia el Ordal, Lleida y Valencia, y durante la Guerra Civil se instalaron baterías antiaéreas para defender Barcelona de los bombardeos, que cayeron en enero de 1939. Hoy se pueden ver sus restos recuperados, las ruinas de la ermita y una torre de vigilancia contra incendios.',
			'Desde arriba la vista abarca toda Barcelona hasta el mar, el delta y el llano del Llobregat, el Garraf y, hacia el norte, la cresta de Collserola hasta el Tibidabo.',
			'Si vas por la vista, elige un día claro: con calima, el mar y el Garraf se desdibujan. En verano, mejor a primera hora: buena parte del camino va a pleno sol.'
		]
	},
	rutes: [
		{
			id: 'sant-joan-de-deu',
			nom: {
				ca: "Des de l'Hospital Sant Joan de Déu pel mirador dels Xiprers",
				es: 'Desde el Hospital Sant Joan de Déu por el mirador dels Xiprers'
			},
			sortida: { nom: 'Hospital Sant Joan de Déu (Esplugues de Llobregat)' },
			tempsMinuts: 45,
			tecnicitat: 'cap',
			descripcio: {
				ca: "Accés des de la part baixa d'Esplugues, molt ben comunicat. Segons De ruta en ruta, per camins de terra i corriols ben marcats s'arriba al mirador dels Xiprers en uns 25 minuts i al cim en uns 45. La volta circular, baixant per l'àrea de lleure de la plaça Mireia, fa 4,5 km i uns 260 m de desnivell.",
				es: 'Acceso desde la parte baja de Esplugues, muy bien comunicado. Según De ruta en ruta, por caminos de tierra y senderos bien marcados se llega al mirador dels Xiprers en unos 25 minutos y a la cima en unos 45. La vuelta circular, bajando por el área de ocio de la plaça Mireia, tiene 4,5 km y unos 260 m de desnivel.'
			},
			fonts: [DERUTAENRUTA]
		},
		{
			id: 'placa-mireia',
			nom: { ca: 'Des de la plaça Mireia', es: 'Desde la plaça Mireia' },
			sortida: { nom: 'Plaça Mireia (Esplugues de Llobregat)' },
			descripcio: {
				ca: "La pujada més curta, des de l'àrea de lleure i aparcament de la plaça Mireia. Caminar per Collserola la descriu per pista i camí asfaltat, de dificultat baixa, amb uns 127 m de desnivell en la volta circular de 4 km; hi ha una variant pel llom des del mirador dels Xiprers més dreta però més bonica.",
				es: 'La subida más corta, desde el área de ocio y aparcamiento de la plaça Mireia. Caminar per Collserola la describe por pista y camino asfaltado, de dificultad baja, con unos 127 m de desnivel en la vuelta circular de 4 km; hay una variante por el lomo desde el mirador dels Xiprers más empinada pero más bonita.'
			},
			fonts: [BUXAWEB, REPTES]
		}
	],
	consells: {
		ca: [
			"Si vas en transport públic, la sortida des d'Esplugues és la més pràctica; la plaça Mireia, els caps de setmana, té l'aparcament ple de bon matí.",
			"Combina-hi la visita a les bateries antiaèries: La meva Barcelona explica que el Museu Can Tinturé n'hi organitza visites guiades.",
			'A la zona del cim hi ha instal·lacions de telecomunicacions tancades: respecta els tancats i els senyals.',
			'Porta aigua a l’estiu: la part alta té poca ombra.',
			'És un parc natural molt freqüentat per ciclistes i corredors: camina pels laterals de les pistes i no surtis dels camins.'
		],
		es: [
			'Si vas en transporte público, la salida desde Esplugues es la más práctica; la plaça Mireia, los fines de semana, tiene el aparcamiento lleno desde temprano.',
			'Combina la visita con las baterías antiaéreas: La meva Barcelona explica que el Museu Can Tinturé organiza visitas guiadas.',
			'En la zona de la cima hay instalaciones de telecomunicaciones cerradas: respeta los vallados y las señales.',
			'Lleva agua en verano: la parte alta tiene poca sombra.',
			'Es un parque natural muy frecuentado por ciclistas y corredores: camina por los laterales de las pistas y no salgas de los caminos.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Sant Pere Màrtir?',
				resposta:
					"Des de l'Hospital Sant Joan de Déu, uns 45 minuts segons De ruta en ruta. Des de la plaça Mireia és més curt: Caminar per Collserola hi calcula uns 35 minuts de pujada."
			},
			{
				pregunta: 'Es pot pujar a Sant Pere Màrtir amb nens?',
				resposta:
					"Sí. Són camins i pistes ben marcats, sense passos tècnics, i a la plaça Mireia hi ha una àrea de lleure amb servei de bar. Les restes de les bateries i de l'ermita fan la pujada més entretinguda."
			},
			{
				pregunta: 'Què és la torre que hi ha al cim de Sant Pere Màrtir?',
				resposta:
					'És una torre de telecomunicacions instal·lada als anys setanta, segons la Viquipèdia. Al costat hi ha les ruïnes de l’ermita del segle XVII, una torre de guaita contra incendis i les bateries antiaèries de la Guerra Civil.'
			},
			{
				pregunta: 'Sant Pere Màrtir és un cim essencial?',
				resposta:
					'Sí. És un dels quatre [cims essencials](/cims-essencials) del Baix Llobregat, amb [Sant Ramon](/cims/sant-ramon), la Morella i Sant Salvador de les Espases. El [turó de la Magarola](/cims/turo-de-la-magarola), a la mateixa serra de Collserola, compta per al Barcelonès.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Sant Pere Màrtir?',
				resposta:
					'Desde el Hospital Sant Joan de Déu, unos 45 minutos según De ruta en ruta. Desde la plaça Mireia es más corto: Caminar per Collserola calcula unos 35 minutos de subida.'
			},
			{
				pregunta: '¿Se puede subir a Sant Pere Màrtir con niños?',
				resposta:
					'Sí. Son caminos y pistas bien marcados, sin pasos técnicos, y en la plaça Mireia hay un área de ocio con servicio de bar. Los restos de las baterías y de la ermita hacen la subida más entretenida.'
			},
			{
				pregunta: '¿Qué es la torre que hay en la cima de Sant Pere Màrtir?',
				resposta:
					'Es una torre de telecomunicaciones instalada en los años setenta, según la Viquipèdia. Al lado están las ruinas de la ermita del siglo XVII, una torre de vigilancia contra incendios y las baterías antiaéreas de la Guerra Civil.'
			},
			{
				pregunta: '¿Sant Pere Màrtir es una cima esencial?',
				resposta:
					'Sí. Es una de las cuatro [cimas esenciales](/cims-essencials) del Baix Llobregat, con [Sant Ramon](/cims/sant-ramon), la Morella y Sant Salvador de les Espases. El [turó de la Magarola](/cims/turo-de-la-magarola), en la misma sierra de Collserola, cuenta para el Barcelonès.'
			}
		]
	},
	fonts: [VIQUIPEDIA, DERUTAENRUTA, BUXAWEB, REPTES, LAMEVABARCELONA],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
