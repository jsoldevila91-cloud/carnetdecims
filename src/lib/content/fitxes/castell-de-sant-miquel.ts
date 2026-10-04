import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Castell de Sant Miquel (Gironès)',
	url: 'https://ca.wikipedia.org/wiki/Castell_de_Sant_Miquel_(Giron%C3%A8s)',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: 'Rutes Pirineus: Castell de Sant Miquel des de Girona',
	url: 'https://www.rutespirineus.cat/rutes/castell-de-sant-miquel-des-de-girona',
	consultat: CONSULTAT
};

const COSTA_BRAVA = {
	nom: 'Costa Brava Girona (Patronat de Turisme): el castell de Sant Miquel des de Girona',
	url: 'https://costabrava.org/que-fer/rutes-wikiloc/el-castell-de-sant-miquel-des-de-girona/',
	consultat: CONSULTAT
};

const TURISME_GIRONES = {
	nom: 'Turisme Gironès: castell de Sant Miquel',
	url: 'https://turismegirones.cat/en/activitat/sant-miquel-castle/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'castell-de-sant-miquel',
	descripcio: {
		ca: [
			"El castell de Sant Miquel corona la muntanya del mateix nom, a l'extrem nord-oest del massís de les Gavarres, entre els termes de Girona i de Celrà, [al Gironès](/comarques/girones). És un turó boscós d'alzinar que s'aixeca just a llevant de la ciutat, i per això és l'excursió de proximitat per excel·lència de la gent de Girona: s'hi pot pujar a peu des del barri vell sense agafar el cotxe.",
			"Més que un castell, el cim aplega capes d'història. Hi ha restes d'una fortificació medieval (cisternes i els fonaments d'una torre circular) i d'una ermita dedicada a Santa Maria i Sant Miquel, començada a mitjan segle XV. Durant la guerra del Francès el turó va ser un punt clau dels setges de Girona: s'hi van fer forts les tropes napoleòniques i el maig del 1809 hi va haver combats amb tropes catalanes; les espitlleres de l'absis són d'aquella època. El 1848 s'hi van aixecar dues torres de telegrafia òptica, que van quedar en desús quan va arribar el telègraf elèctric, el 1856. La torre restaurada té una escala de cargol que puja fins a dalt.",
			"Des de dalt es domina Girona i, cap a llevant, la plana de l'Empordà, a més de les Gavarres i les valls de l'Onyar i del Ter. Al sud-est, a la mateixa serra, es veu el santuari dels [Àngels](/cims/els-angels), un altre cim essencial de la comarca.",
			"Es pot pujar tot l'any. A l'estiu és millor anar-hi a primera hora, perquè la vall de Sant Daniel i l'alzinar són calorosos a migdia. Els caps de setmana és un camí molt freqüentat per excursionistes, corredors i ciclistes de muntanya."
		],
		es: [
			'El castell de Sant Miquel corona la montaña del mismo nombre, en el extremo noroeste del macizo de les Gavarres, entre los municipios de Girona y Celrà, [en el Gironès](/comarques/girones). Es una colina boscosa de encinar que se alza justo al este de la ciudad, y por eso es la excursión de proximidad por excelencia de los gerundenses: se puede subir a pie desde el barrio viejo sin coger el coche.',
			'Más que un castillo, la cima reúne capas de historia. Hay restos de una fortificación medieval (cisternas y los cimientos de una torre circular) y de una ermita dedicada a Santa Maria y Sant Miquel, iniciada a mediados del siglo XV. Durante la guerra de la Independencia la colina fue un punto clave de los sitios de Girona: se hicieron fuertes las tropas napoleónicas y en mayo de 1809 hubo combates con tropas catalanas; las aspilleras del ábside son de aquella época. En 1848 se levantaron dos torres de telegrafía óptica, que quedaron en desuso cuando llegó el telégrafo eléctrico, en 1856. La torre restaurada tiene una escalera de caracol que sube hasta arriba.',
			'Desde arriba se domina Girona y, hacia el este, la llanura del Empordà, además de las Gavarres y los valles del Onyar y del Ter. Al sureste, en la misma sierra, se ve el santuario de [els Àngels](/cims/els-angels), otra cima esencial de la comarca.',
			'Se puede subir todo el año. En verano es mejor ir a primera hora, porque el valle de Sant Daniel y el encinar son calurosos a mediodía. Los fines de semana es un camino muy frecuentado por excursionistas, corredores y ciclistas de montaña.'
		]
	},
	rutes: [
		{
			id: 'girona-sant-daniel',
			nom: {
				ca: 'Des de Girona per la vall de Sant Daniel',
				es: 'Desde Girona por el valle de Sant Daniel'
			},
			sortida: { nom: 'Plaça de Sant Pere de Galligants (Girona)' },
			desnivellPositiuM: 325,
			distanciaKm: 5,
			tempsMinuts: 85,
			tecnicitat: 'cap',
			descripcio: {
				ca: "Es surt del barri vell, al costat del monestir de Sant Pere de Galligants, i es remunta la vall de Sant Daniel passant pel monestir benedictí i per l'àrea de la font del Ferro. Després el camí creua la riera de Sant Miquel, passa per sota de la carretera N-II i s'enfila per pistes i corriols dins l'alzinar fins al castell. No hi ha cap pas on calgui posar les mans; Rutes Pirineus la fa d'anada i tornada pel mateix camí.",
				es: 'Se sale del barrio viejo, junto al monasterio de Sant Pere de Galligants, y se remonta el valle de Sant Daniel pasando por el monasterio benedictino y por el área de la font del Ferro. Después el camino cruza la riera de Sant Miquel, pasa por debajo de la carretera N-II y sube por pistas y senderos dentro del encinar hasta el castillo. No hay ningún paso en el que haya que poner las manos; Rutes Pirineus la plantea de ida y vuelta por el mismo camino.'
			},
			fonts: [RUTES_PIRINEUS, COSTA_BRAVA]
		}
	],
	consells: {
		ca: [
			"És una ruta d'anada i tornada que surt del mateix barri vell de Girona: no cal cotxe ni buscar aparcament a la muntanya.",
			"Porta aigua i, a l'estiu, surt d'hora: la pujada per l'alzinar és calorosa a les hores centrals del dia.",
			'Comparteixes el camí amb bicicletes de muntanya, sobretot a les baixades: camina atent i amb els nens a prop.',
			"Si puges a la torre, fes-ho amb compte: l'escala de cargol és estreta.",
			"El cim és dins l'espai protegit de les Gavarres: no llencis res i no encenguis foc."
		],
		es: [
			'Es una ruta de ida y vuelta que sale del mismo barrio viejo de Girona: no hace falta coche ni buscar aparcamiento en la montaña.',
			'Lleva agua y, en verano, sal temprano: la subida por el encinar es calurosa en las horas centrales del día.',
			'Compartes el camino con bicicletas de montaña, sobre todo en las bajadas: camina atento y con los niños cerca.',
			'Si subes a la torre, hazlo con cuidado: la escalera de caracol es estrecha.',
			'La cima está dentro del espacio protegido de las Gavarres: no tires nada y no enciendas fuego.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al castell de Sant Miquel des de Girona?',
				resposta:
					'Segons Rutes Pirineus, uns 1 h 25 min de pujada des de la plaça de Sant Pere de Galligants i 1 h 10 min de baixada pel mateix camí, amb uns 9,6 km i 330 m de desnivell en total. És una sortida de mig matí.'
			},
			{
				pregunta: 'Es pot pujar al castell de Sant Miquel amb nens?',
				resposta:
					"Sí. Són camins i pistes sense passos tècnics i diverses fonts la recomanen per anar-hi en família. Amb nens petits, compta que la distància d'anada i tornada (prop de 10 km) és el que més pesa, i porta prou aigua i berenar per fer un pícnic a dalt."
			},
			{
				pregunta: 'Què hi ha al cim del castell de Sant Miquel?',
				resposta:
					"Les restes d'una ermita del segle XV i d'una fortificació medieval, i una torre de telegrafia òptica del 1848 amb escala de cargol. És patrimoni cultural catalogat i des de dalt hi ha vista de 360° sobre Girona i l'Empordà."
			},
			{
				pregunta: 'El castell de Sant Miquel compta com a cim essencial?',
				resposta:
					'Sí, és un dels [cims essencials](/cims-essencials) del repte i, amb [els Àngels](/cims/els-angels), un dels dos del Gironès. Les condicions per validar-lo són a la [normativa](/repte-100-cims/normativa).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al castell de Sant Miquel desde Girona?',
				resposta:
					'Según Rutes Pirineus, 1 h 25 min de subida desde la plaza de Sant Pere de Galligants y 1 h 10 min de bajada por el mismo camino, con unos 9,6 km y 330 m de desnivel en total. Es una salida de media mañana.'
			},
			{
				pregunta: '¿Se puede subir al castell de Sant Miquel con niños?',
				resposta:
					'Sí. Son caminos y pistas sin pasos técnicos y varias fuentes la recomiendan para ir en familia. Con niños pequeños, ten en cuenta que la distancia de ida y vuelta (cerca de 10 km) es lo que más pesa, y lleva agua suficiente y merienda para hacer un pícnic arriba.'
			},
			{
				pregunta: '¿Qué hay en la cima del castell de Sant Miquel?',
				resposta:
					'Los restos de una ermita del siglo XV y de una fortificación medieval, y una torre de telegrafía óptica de 1848 con escalera de caracol. Es patrimonio cultural catalogado y desde arriba hay vista de 360° sobre Girona y el Empordà.'
			},
			{
				pregunta: '¿El castell de Sant Miquel cuenta como cima esencial?',
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) del reto y, con [els Àngels](/cims/els-angels), una de las dos del Gironès. Las condiciones para validarla están en la [normativa](/repte-100-cims/normativa).'
			}
		]
	},
	fonts: [VIQUIPEDIA, RUTES_PIRINEUS, COSTA_BRAVA, TURISME_GIRONES],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
