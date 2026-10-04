import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: turó de Tagamanent',
	url: 'https://ca.wikipedia.org/wiki/Tur%C3%B3_de_Tagamanent',
	consultat: CONSULTAT
};

const DIBA = {
	nom: 'Diputació de Barcelona: el conjunt monumental de Tagamanent estrena un nou servei d’informació',
	url: 'https://www.diba.cat/ca/web/sala-de-premsa/-/el-conjunt-monumental-de-tagamanent-al-parc-natural-del-montseny-estrena-un-nou-servei-d-informacio',
	consultat: CONSULTAT
};

const ECOLOGISTES = {
	nom: 'Ecologistes de Catalunya: Tagamanent',
	url: 'https://ecologistes.cat/tagamanent-abellera-catalana/',
	consultat: CONSULTAT
};

const SARRIAPETITS = {
	nom: 'Sarrià Petits: Pla de la Calma i turó de Tagamanent',
	url: 'https://www.sarriapetits.com/pla-de-la-calma-i-turo-de-tagamanent/',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: turó del Tagamanent',
	url: 'https://totnens.cat/que-fem/turo-del-tagamanent/',
	consultat: CONSULTAT
};

const DERUTAENRUTA = {
	nom: 'De ruta en ruta: el Tagamanent des de Figaró-Montmany',
	url: 'https://www.derutaenruta.com/ca/rutes/tagamanent-desde-figaro-montmany',
	consultat: CONSULTAT
};

const FIGARO = {
	nom: 'Ajuntament de Figaró-Montmany: PR-C 213 de Figaró al turó de Tagamanent',
	url: 'https://www.figaro-montmany.cat/municipi/rutes-i-senderisme/rutes-i-camins-senyalitzats/pr-c-213-de-figaro-al-turo-de-tagamanent.html',
	consultat: CONSULTAT
};

const DECIMENCIM = {
	nom: 'De cim en cim: Tagamanent',
	url: 'https://www.decimencim.cat/2016/05/tagamanent/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tagamanent',
	descripcio: {
		ca: [
			"El Tagamanent és el turó que tanca per l'oest el pla de la Calma, l'altiplà de pastures del Montseny, i cau en cingleres sobre la vall del Congost. Pertany al municipi de Tagamanent, [al Vallès Oriental](/comarques/valles-oriental), dins del Parc Natural del Montseny. Segons la Viquipèdia, el turó és de calcàries i dolomies, i des de la vall del Congost es reconeix pel seu perfil de penya-segat.",
			"Al capdamunt hi ha l'església de **Santa Maria de Tagamanent** i les restes del castell, que ja apareix documentat l'any 945 i que va dependre dels comtes de Barcelona. L'església és romànica, del segle XII, però el terratrèmol del 1448 la va malmetre i es va refer sobre les ruïnes. El conjunt és bé cultural d'interès nacional i la Diputació de Barcelona hi va acabar unes obres de consolidació el 2019. Pel camí es passa per les ruïnes de l'ermita de Sant Martí, i a la sortida hi ha la masia del Bellver, que avui fa de punt d'informació del parc i de restaurant.",
			"És un mirador molt complet per al poc esforç que demana: a sota hi ha la vall del Congost i, al davant, els cingles de Bertí; més enllà es veuen [la Mola](/cims/la-mola-de-sant-llorenc-del-munt) i Montserrat, i cap al nord-est el [Matagalls](/cims/matagalls) i la resta del Montseny. Segons l'Ajuntament de Figaró-Montmany, en dies clars la vista abasta del Canigó al Port del Comte.",
			"Es pot pujar tot l'any. Per la pista que porta al Bellver hi pot haver gel o neu algun dia d'hivern, i a l'estiu el pla de la Calma és més fresc que la plana, però a ple sol. Els caps de setmana és una sortida molt concorreguda per famílies."
		],
		es: [
			"El Tagamanent es el cerro que cierra por el oeste el pla de la Calma, la meseta de pastos del Montseny, y cae en riscos sobre el valle del Congost. Pertenece al municipio de Tagamanent, [en el Vallès Oriental](/comarques/valles-oriental), dentro del Parque Natural del Montseny. Según la Viquipèdia, el cerro es de calizas y dolomías, y desde el valle del Congost se reconoce por su perfil de acantilado.",
			'En lo alto está la iglesia de **Santa Maria de Tagamanent** y los restos del castillo, documentado ya en el año 945 y que dependió de los condes de Barcelona. La iglesia es románica, del siglo XII, pero el terremoto de 1448 la dañó y se rehízo sobre las ruinas. El conjunto es bien cultural de interés nacional y la Diputación de Barcelona terminó en él unas obras de consolidación en 2019. Por el camino se pasa por las ruinas de la ermita de Sant Martí, y en la salida está la masía del Bellver, que hoy es punto de información del parque y restaurante.',
			'Es un mirador muy completo para el poco esfuerzo que pide: abajo queda el valle del Congost y, enfrente, los riscos de Bertí; más allá se ven [la Mola](/cims/la-mola-de-sant-llorenc-del-munt) y Montserrat, y hacia el nordeste el [Matagalls](/cims/matagalls) y el resto del Montseny. Según el Ayuntamiento de Figaró-Montmany, en días claros la vista abarca del Canigó al Port del Comte.',
			'Se puede subir todo el año. En la pista que lleva al Bellver puede haber hielo o nieve algún día de invierno, y en verano el pla de la Calma es más fresco que la llanura, pero a pleno sol. Los fines de semana es una salida muy concurrida por familias.'
		]
	},
	rutes: [
		{
			id: 'bellver',
			nom: { ca: 'Des del Bellver (pla de la Calma)', es: 'Desde el Bellver (pla de la Calma)' },
			sortida: { nom: 'El Bellver (Tagamanent)' },
			tempsMinuts: 30,
			tecnicitat: 'cap',
			descripcio: {
				ca: "És l'accés més curt i el més familiar. Del punt d'informació del Bellver es baixa entre feixes fins al coll de Sant Martí i un corriol ben fressat entre alzines s'enfila, sense cap pas complicat, fins a l'església. Segons Ecologistes de Catalunya i Sarrià Petits, petits i grans hi arriben en una mitja hora.",
				es: 'Es el acceso más corto y el más familiar. Desde el punto de información del Bellver se baja entre bancales hasta el coll de Sant Martí y un sendero muy pisado entre encinas sube, sin ningún paso complicado, hasta la iglesia. Según Ecologistas de Cataluña y Sarrià Petits, pequeños y mayores llegan en una media hora.'
			},
			fonts: [ECOLOGISTES, SARRIAPETITS, DIBA, TOTNENS]
		},
		{
			id: 'figaro',
			nom: { ca: 'Des de Figaró pel PR-C 33', es: 'Desde Figaró por el PR-C 33' },
			sortida: { nom: 'Figaró (Figaró-Montmany)' },
			tempsMinuts: 150,
			descripcio: {
				ca: "La pujada de veritat, amb sortida a l'estació de tren de Figaró. Segons De ruta en ruta, s'arriba al cim en unes 2 h 30 min, passant per la creu de Can Coll, amb una pujada constant pràcticament des del principi. L'Ajuntament proposa també el PR-C 213, un circuit d'una mica menys de 17 km i uns 750 m de desnivell per la vall de Vallcàrquera.",
				es: 'La subida de verdad, con salida en la estación de tren de Figaró. Según De ruta en ruta, se llega a la cima en unas 2 h 30 min, pasando por la creu de Can Coll, con una subida constante prácticamente desde el principio. El Ayuntamiento propone también el PR-C 213, un circuito de algo menos de 17 km y unos 750 m de desnivel por el valle de Vallcàrquera.'
			},
			fonts: [DERUTAENRUTA, FIGARO]
		}
	],
	consells: {
		ca: [
			"La pista asfaltada que puja al Bellver és estreta i plena de revolts: condueix amb calma i aparca només als espais habilitats.",
			"El punt d'informació del conjunt monumental obre els caps de setmana i festius al matí; consulta l'horari al web del parc abans d'anar-hi.",
			"Si vas en tren, la ruta des de Figaró és llarga i costeruda: porta prou aigua, perquè a l'estiu la pujada és calorosa.",
			"Les cingleres del cim no tenen protecció: vigila els nens a prop de l'església i del mirador.",
			'És un parc natural: no surtis dels camins, no deixis deixalles i respecta el bestiar del pla de la Calma.'
		],
		es: [
			'La pista asfaltada que sube al Bellver es estrecha y con muchas curvas: conduce con calma y aparca solo en los espacios habilitados.',
			'El punto de información del conjunto monumental abre los fines de semana y festivos por la mañana; consulta el horario en la web del parque antes de ir.',
			'Si vas en tren, la ruta desde Figaró es larga y empinada: lleva agua suficiente, porque en verano la subida es calurosa.',
			'Los riscos de la cima no tienen protección: vigila a los niños cerca de la iglesia y del mirador.',
			'Es un parque natural: no salgas de los caminos, no dejes residuos y respeta el ganado del pla de la Calma.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Tagamanent?',
				resposta:
					"Des del Bellver, una mitja hora per un corriol sense dificultat, segons Ecologistes de Catalunya. Des de l'estació de Figaró, unes 2 h 30 min d'anada amb una pujada sostinguda, segons De ruta en ruta."
			},
			{
				pregunta: 'Es pot pujar al Tagamanent amb nens?',
				resposta:
					"Sí, és una de les sortides més fàcils del Montseny. Des del Bellver el camí és curt i ben marcat i hi ha nens petits que el fan sencer caminant. Només cal anar amb compte a les cingleres del cim, que no tenen barana."
			},
			{
				pregunta: 'Què hi ha al cim del Tagamanent?',
				resposta:
					"L'església romànica de Santa Maria i les restes del castell, documentat l'any 945. El conjunt és bé cultural d'interès nacional i té un punt d'informació obert els caps de setmana."
			},
			{
				pregunta: 'El Tagamanent és un cim essencial?',
				resposta:
					'Sí, és un dels [cims essencials](/cims-essencials) del repte. Es pot combinar amb una passejada pel pla de la Calma o, en una altra sortida, amb el [Matagalls](/cims/matagalls).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Tagamanent?',
				resposta:
					'Desde el Bellver, una media hora por un sendero sin dificultad, según Ecologistas de Cataluña. Desde la estación de Figaró, unas 2 h 30 min de ida con una subida sostenida, según De ruta en ruta.'
			},
			{
				pregunta: '¿Se puede subir al Tagamanent con niños?',
				resposta:
					'Sí, es una de las salidas más fáciles del Montseny. Desde el Bellver el camino es corto y está bien marcado, y hay niños pequeños que lo hacen entero andando. Solo hay que tener cuidado en los riscos de la cima, que no tienen barandilla.'
			},
			{
				pregunta: '¿Qué hay en la cima del Tagamanent?',
				resposta:
					'La iglesia románica de Santa Maria y los restos del castillo, documentado en el año 945. El conjunto es bien cultural de interés nacional y tiene un punto de información abierto los fines de semana.'
			},
			{
				pregunta: '¿El Tagamanent es una cima esencial?',
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) del reto. Se puede combinar con un paseo por el pla de la Calma o, en otra salida, con el [Matagalls](/cims/matagalls).'
			}
		]
	},
	fonts: [VIQUIPEDIA, DIBA, ECOLOGISTES, SARRIAPETITS, TOTNENS, DERUTAENRUTA, FIGARO, DECIMENCIM],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
