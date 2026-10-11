import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Pic del Vent',
	url: 'https://ca.wikipedia.org/wiki/Pic_del_Vent',
	consultat: CONSULTAT
};

const SENDERS_CALDES = {
	nom: 'Ajuntament de Caldes de Montbui: Els senders de Caldes de Montbui (plànol)',
	url: 'https://www.caldesdemontbui.cat/media/repository//migrated/documents/0000000000_senders_caldes.pdf',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: Pic del Vent al coll del Farell, Caldes de Montbui',
	url: 'https://totnens.cat/que-fem/senderisme-amb-nens-pic-del-vent-al-coll-del-farell-caldes-de-montbui/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pic-del-vent',
	descripcio: {
		ca: [
			"El Pic del Vent, també conegut com el Farell, és el punt més alt de la serra del Farell, al terme de Caldes de Montbui ([Vallès Oriental](/comarques/valles-oriental)). És un cim de pujada curta, que s'acostuma a fer des de l'església de Sant Sebastià de Montmajor o des del mirador de la serra Llisa. L'altre cim essencial de la comarca és [el Tagamanent](/cims/tagamanent).",
			"Dalt hi ha força senyals que hi puja gent: una taula d'orientació, un pal amb la senyera, uns bancs de fusta i una placa dels Amics dels Senders, el grup de senderistes de Caldes. La Viquipèdia explica que hi havia hagut un vèrtex geodèsic, del qual només queda la base.",
			"La taula d'orientació té feina. Segons Totnens, s'hi veuen el Vallès i bona part del Barcelonès, la Mola i el Montcau, Montserrat, el Montseny, els cingles de Bertí, la serralada Litoral i, al fons, la serra del Cadí.",
			"És un cim per a qualsevol època de l'any i per a mig matí. Només la part final, més rocosa, i la primera canal, de pedra solta, demanen mirar on es posen els peus, sobretot de baixada o després de ploure."
		],
		es: [
			'El Pic del Vent, también conocido como el Farell, es el punto más alto de la sierra del Farell, en el término de Caldes de Montbui ([Vallès Oriental](/comarques/valles-oriental)). Es una cima de subida corta, que suele hacerse desde la iglesia de Sant Sebastià de Montmajor o desde el mirador de la serra Llisa. La otra cima esencial de la comarca es [el Tagamanent](/cims/tagamanent).',
			'Arriba hay bastantes señales de que sube gente: una mesa de orientación, un asta con la senyera, unos bancos de madera y una placa de los Amics dels Senders, el grupo de senderistas de Caldes. La Viquipèdia explica que había habido un vértice geodésico, del que solo queda la base.',
			'La mesa de orientación tiene trabajo. Según Totnens, se ven el Vallès y buena parte del Barcelonès, la Mola y el Montcau, Montserrat, el Montseny, los cingles de Bertí, la cordillera Litoral y, al fondo, la sierra del Cadí.',
			'Es una cima para cualquier época del año y para media mañana. Solo la parte final, más rocosa, y la primera canal, de piedra suelta, piden mirar dónde se ponen los pies, sobre todo de bajada o después de llover.'
		]
	},
	rutes: [
		{
			id: 'montmajor',
			nom: {
				ca: "Des de l'església de Sant Sebastià de Montmajor",
				es: 'Desde la iglesia de Sant Sebastià de Montmajor'
			},
			sortida: { nom: 'Església de Sant Sebastià de Montmajor (Caldes de Montbui)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Totnens la proposa com a sortida amb nens, sense donar-ne la distància ni l'horari. De l'esplanada de l'església se segueixen les marques blanques i grogues: una pista, un desviament a l'esquerra i una canal de pujada forta, amb terreny rocallós i pedres soltes, fins a una pista forestal on hi ha una alzina enorme i una torre d'alta tensió. Després alterna pista i sender fins a una altra alzina, on un pal assenyala el camí del cim. Els últims metres, per una zona més rocosa, són una mica més complicats, però segons el web els nens hi pugen sense problemes al seu ritme.",
				es: 'Totnens la propone como salida con niños, sin dar la distancia ni el horario. Desde la explanada de la iglesia se siguen las marcas blancas y amarillas: una pista, un desvío a la izquierda y una canal de subida fuerte, con terreno rocoso y piedras sueltas, hasta una pista forestal donde hay una encina enorme y una torre de alta tensión. Después alterna pista y sendero hasta otra encina, donde un poste señala el camino de la cima. Los últimos metros, por una zona más rocosa, son algo más complicados, pero según la web los niños suben sin problemas a su ritmo.'
			},
			fonts: [TOTNENS]
		},
		{
			id: 'serra-llisa',
			nom: {
				ca: 'Sender del Pic del Vent des del mirador de la serra Llisa',
				es: 'Sendero del Pic del Vent desde el mirador de la serra Llisa'
			},
			sortida: { nom: 'Mirador de la serra Llisa (Caldes de Montbui)' },
			desnivellPositiuM: 120,
			descripcio: {
				ca: "És el sender que l'Ajuntament de Caldes de Montbui recull al plànol dels seus camins: un recorregut que es desvia del PR-C 9 per fer el cim, amb marques grogues i blanques. El plànol hi posa 2 km, 120 m de desnivell i 35 minuts, i el resumeix amb quatre paraules: pujada curta però forta.",
				es: 'Es el sendero que el Ayuntamiento de Caldes de Montbui recoge en el plano de sus caminos: un recorrido que se desvía del PR-C 9 para hacer la cima, con marcas amarillas y blancas. El plano le pone 2 km, 120 m de desnivel y 35 minutos, y lo resume en cuatro palabras: subida corta pero fuerte.'
			},
			fonts: [SENDERS_CALDES]
		}
	],
	consells: {
		ca: [
			"A Sant Sebastià de Montmajor s'aparca a l'esplanada de l'església, on hi ha un restaurant; s'hi arriba des de Caldes per la C-59 i la BV-1243, passant per la urbanització del Farell.",
			'La primera canal té pedra solta: de baixada, fes-la a poc a poc i amb els nens al davant.',
			"Les primeres marques blanques i grogues, segons Totnens, són en un mur de pedra i en un pal de fusta: busca-les abans d'arrencar.",
			'Si vols allargar la sortida, el PR-C 9 enllaça Caldes amb Sant Sebastià de Montmajor i passa a prop del cim; el plànol municipal en dona el traçat.',
			'El plànol municipal resumeix el sender com una pujada curta però forta: amb canalla, no et refiïs dels 35 minuts.'
		],
		es: [
			'En Sant Sebastià de Montmajor se aparca en la explanada de la iglesia, donde hay un restaurante; se llega desde Caldes por la C-59 y la BV-1243, pasando por la urbanización del Farell.',
			'La primera canal tiene piedra suelta: de bajada, hazla despacio y con los niños delante.',
			'Las primeras marcas blancas y amarillas, según Totnens, están en un muro de piedra y en un poste de madera: búscalas antes de arrancar.',
			'Si quieres alargar la salida, el PR-C 9 enlaza Caldes con Sant Sebastià de Montmajor y pasa cerca de la cima; el plano municipal da su trazado.',
			'El plano municipal resume el sendero como una subida corta pero fuerte: con niños, no te fíes de los 35 minutos.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Pic del Vent?',
				resposta:
					"El plànol de senders de l'Ajuntament de Caldes dona 35 minuts, 2 km i 120 m de desnivell per al sender que hi puja des del mirador de la serra Llisa. Des de Sant Sebastià de Montmajor, Totnens no en publica l'horari."
			},
			{
				pregunta: 'Es pot pujar al Pic del Vent amb nens?',
				resposta:
					'Sí. Totnens la presenta com una sortida per fer senderisme amb nens i diu que hi pugen sense complicacions, al seu ritme, encara que els últims metres siguin més rocosos.'
			},
			{
				pregunta: 'On es deixa el cotxe?',
				resposta:
					"A l'esplanada de l'església de Sant Sebastià de Montmajor, si es fa la ruta de Totnens. El sender municipal surt del mirador de la serra Llisa."
			},
			{
				pregunta: 'El Pic del Vent i el Farell són el mateix cim?',
				resposta:
					'Sí: segons la Viquipèdia, el Pic del Vent també és conegut com el Farell, el mateix nom que porten la serra, el coll i la urbanització.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Pic del Vent?',
				resposta:
					'El plano de senderos del Ayuntamiento de Caldes da 35 minutos, 2 km y 120 m de desnivel para el sendero que sube desde el mirador de la serra Llisa. Desde Sant Sebastià de Montmajor, Totnens no publica el horario.'
			},
			{
				pregunta: '¿Se puede subir al Pic del Vent con niños?',
				resposta:
					'Sí. Totnens la presenta como una salida para hacer senderismo con niños y dice que suben sin complicaciones, a su ritmo, aunque los últimos metros sean más rocosos.'
			},
			{
				pregunta: '¿Dónde se deja el coche?',
				resposta:
					'En la explanada de la iglesia de Sant Sebastià de Montmajor, si se hace la ruta de Totnens. El sendero municipal sale del mirador de la serra Llisa.'
			},
			{
				pregunta: '¿El Pic del Vent y el Farell son la misma cima?',
				resposta:
					'Sí: según la Viquipèdia, el Pic del Vent también se conoce como el Farell, el mismo nombre que llevan la sierra, el collado y la urbanización.'
			}
		]
	},
	fonts: [VIQUIPEDIA, SENDERS_CALDES, TOTNENS],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
