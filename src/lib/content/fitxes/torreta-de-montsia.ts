import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Torreta de Montsià',
	url: 'https://ca.wikipedia.org/wiki/Torreta_de_Montsi%C3%A0',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Torreta del Montsià des del barranc del Mas de Comú',
	url: 'https://reptesmuntanyencs.cat/torreta-del-montsia/',
	consultat: CONSULTAT
};

const BLOG_CORRAL_NOU = {
	nom: 'Blog de muntanya: Torreta de Montsià des de lo Corral Nou',
	url: 'https://jralsina.blogspot.com/2025/03/torreta-de-montsia-des-de-lo-corral-nou.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'torreta-de-montsia',
	descripcio: {
		ca: [
			"La Torreta és el cim de la serra del Montsià, la serralada calcària que s'alça gairebé arran de mar al sud de les Terres de l'Ebre i dona nom a la comarca [del Montsià](/comarques/montsia). El cim és al límit entre Alcanar i Ulldecona. Tot i no arribar als 800 m, és una muntanya molt destacada: segons la Viquipèdia, té una prominència de més de 600 m, perquè s'aixeca sola entre el Delta i la plana d'Ulldecona.",
			"La serra té dos vessants molt diferents: el que mira al mar, més salvatge i vertical, solcat pels barrancs del Codonyol i del Llop, i l'interior, que baixa més suaument cap a la Foia d'Ulldecona. Al cim hi ha un vèrtex geodèsic i unes antenes abandonades. A la carena hi ha racons coneguts dels excursionistes de la zona, com la Foradada, una gran finestra natural oberta a la roca, i masos abandonats que recorden l'antic aprofitament de la muntanya.",
			"La vista és el gran premi. Cap a llevant es veuen Sant Carles de la Ràpita, la Punta de la Banya i tot el Delta de l'Ebre, i la franja costanera cap al sud; cap a ponent, la Foia d'Ulldecona i, al fons, el massís dels Ports, on hi ha [el Caro](/cims/caro) i [el Tossal dels Tres Reis](/cims/tossal-dels-tres-reis).",
			"Val més reservar-la per als mesos frescos, de la tardor a la primavera. A l'estiu la serra és molt calorosa i no hi ha aigua en el camí; amb vent de mestral, la carena pot ser molt desagradable. Amb pluja i boira, la vista es perd del tot."
		],
		es: [
			"La Torreta es la cima de la sierra del Montsià, la cordillera calcárea que se alza casi junto al mar en el sur de las Terres de l'Ebre y da nombre a la comarca [del Montsià](/comarques/montsia). La cima está en el límite entre Alcanar y Ulldecona. Aunque no llega a los 800 m, es una montaña muy destacada: según la Viquipèdia, tiene una prominencia de más de 600 m, porque se levanta sola entre el Delta y la llanura de Ulldecona.",
			"La sierra tiene dos vertientes muy diferentes: la que mira al mar, más salvaje y vertical, surcada por los barrancos del Codonyol y del Llop, y la interior, que baja más suavemente hacia la Foia d'Ulldecona. En la cima hay un vértice geodésico y unas antenas abandonadas. En la cresta hay rincones conocidos por los excursionistas de la zona, como la Foradada, una gran ventana natural abierta en la roca, y masías abandonadas que recuerdan el antiguo aprovechamiento de la montaña.",
			"La vista es el gran premio. Hacia levante se ven Sant Carles de la Ràpita, la Punta de la Banya y todo el Delta del Ebro, y la franja costera hacia el sur; hacia poniente, la Foia d'Ulldecona y, al fondo, el macizo de los Ports, donde están [el Caro](/cims/caro) y [el Tossal dels Tres Reis](/cims/tossal-dels-tres-reis).",
			'Mejor reservarla para los meses frescos, del otoño a la primavera. En verano la sierra es muy calurosa y no hay agua en el camino; con viento de mistral, la cresta puede ser muy desagradable. Con lluvia y niebla, la vista se pierde por completo.'
		]
	},
	rutes: [
		{
			id: 'mas-de-comu',
			nom: {
				ca: 'Des del barranc del Mas de Comú pel camí de la Torreta',
				es: 'Desde el barranco del Mas de Comú por el camino de la Torreta'
			},
			sortida: { nom: 'Àrea interpretativa del barranc del Mas de Comú (Ulldecona)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Pel vessant d'Ulldecona. Des de l'àrea interpretativa es puja per pistes i senders fins al camí de la Torreta, marcat amb pintura verda; passades les coves del Pare Pasqual hi ha una petita tartera abans del cim. Es pot tornar pel GR 92 cap al Mas de Comú. Reptes Muntanyencs hi dona 8 km i uns 510 m de desnivell en la volta sencera, amb el cim a una mica menys d'una hora i mitja de la sortida.",
				es: 'Por la vertiente de Ulldecona. Desde el área interpretativa se sube por pistas y senderos hasta el camino de la Torreta, marcado con pintura verde; pasadas las cuevas del Pare Pasqual hay una pequeña pedrera antes de la cima. Se puede volver por el GR 92 hacia el Mas de Comú. Reptes Muntanyencs le da 8 km y unos 510 m de desnivel en la vuelta completa, con la cima a algo menos de una hora y media de la salida.'
			},
			fonts: [REPTES]
		},
		{
			id: 'corral-nou-foradada',
			nom: {
				ca: 'Per la carena des de lo Corral Nou i la Foradada',
				es: 'Por la cresta desde lo Corral Nou y la Foradada'
			},
			sortida: { nom: 'Lo Corral Nou (Freginals)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Itinerari llarg pel nord de la serra, des de l'aparcament de lo Corral Nou, a prop de Freginals. Puja amb fort pendent pel bosc, passa per la font d'Andara i la Foradada i fa un llarg recorregut de carena fins a la Torreta, per un corriol poc definit però senyalitzat amb fites. Recomanable només si t'orientes bé.",
				es: 'Itinerario largo por el norte de la sierra, desde el aparcamiento de lo Corral Nou, cerca de Freginals. Sube con fuerte pendiente por el bosque, pasa por la font d’Andara y la Foradada y hace un largo recorrido de cresta hasta la Torreta, por una senda poco definida pero señalizada con hitos. Recomendable solo si te orientas bien.'
			},
			fonts: [BLOG_CORRAL_NOU]
		}
	],
	consells: {
		ca: [
			"Porta tota l'aigua des de l'inici: a la pujada no hi ha fonts fiables.",
			'Al camí de la Torreta, segueix les marques verdes; a la tartera de sota el cim, puja amb calma i sense separar-te del traç.',
			"Per la carena des de lo Corral Nou, el camí és poc definit: porta mapa o track i no t'hi fiïs amb boira.",
			'Evita els dies de mestral fort: la carena és molt exposada.',
			"A l'estiu, surt molt d'hora o tria una altra època: la serra és molt solana."
		],
		es: [
			'Lleva toda el agua desde el inicio: en la subida no hay fuentes fiables.',
			'En el camino de la Torreta, sigue las marcas verdes; en la pedrera de debajo de la cima, sube con calma y sin separarte de la traza.',
			'Por la cresta desde lo Corral Nou, el camino es poco definido: lleva mapa o track y no te fíes con niebla.',
			'Evita los días de mistral fuerte: la cresta está muy expuesta.',
			'En verano, sal muy temprano o elige otra época: la sierra es muy solana.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quina és la ruta més habitual per pujar a la Torreta de Montsià?',
				resposta:
					"La del vessant d'Ulldecona, des de l'àrea interpretativa del barranc del Mas de Comú pel camí de la Torreta, marcat amb pintura verda. Segons Reptes Muntanyencs, el cim és a una mica menys d'una hora i mitja i es pot tornar pel GR 92."
			},
			{
				pregunta: 'Què es veu des de la Torreta de Montsià?',
				resposta:
					"Tot el Delta de l'Ebre, amb la Punta de la Banya i Sant Carles de la Ràpita, la costa cap al sud i, a l'interior, la Foia d'Ulldecona i els Ports."
			},
			{
				pregunta: 'Es pot pujar a la Torreta de Montsià amb nens?',
				resposta:
					'Amb nens que ja caminen bé i en un dia fresc, sí, per la ruta del Mas de Comú. Compta que la pujada és dreta, hi ha un tram de tartera i no hi ha aigua ni ombra a la part alta.'
			},
			{
				pregunta: 'La Torreta de Montsià és un cim essencial?',
				resposta:
					'Sí. La comarca del Montsià en té dos: la Torreta, sostre de la serra que dona nom a la comarca, i el [Tossal dels Tres Reis](/cims/tossal-dels-tres-reis), als Ports, que gairebé li dobla l’altitud.'
			}
		],
		es: [
			{
				pregunta: '¿Cuál es la ruta más habitual para subir a la Torreta de Montsià?',
				resposta:
					'La de la vertiente de Ulldecona, desde el área interpretativa del barranco del Mas de Comú por el camino de la Torreta, marcado con pintura verde. Según Reptes Muntanyencs, la cima está a algo menos de una hora y media y se puede volver por el GR 92.'
			},
			{
				pregunta: '¿Qué se ve desde la Torreta de Montsià?',
				resposta:
					'Todo el Delta del Ebro, con la Punta de la Banya y Sant Carles de la Ràpita, la costa hacia el sur y, en el interior, la Foia d’Ulldecona y los Ports.'
			},
			{
				pregunta: '¿Se puede subir a la Torreta de Montsià con niños?',
				resposta:
					'Con niños que ya caminan bien y en un día fresco, sí, por la ruta del Mas de Comú. Ten en cuenta que la subida es empinada, hay un tramo de pedrera y no hay agua ni sombra en la parte alta.'
			},
			{
				pregunta: '¿La Torreta de Montsià es una cima esencial?',
				resposta:
					'Sí. La comarca del Montsià tiene dos: la Torreta, techo de la sierra que da nombre a la comarca, y el [Tossal dels Tres Reis](/cims/tossal-dels-tres-reis), en los Ports, que casi le dobla la altitud.'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, BLOG_CORRAL_NOU],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
