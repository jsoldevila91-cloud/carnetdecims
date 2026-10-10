import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Montbaig',
	url: 'https://ca.wikipedia.org/wiki/Montbaig',
	consultat: CONSULTAT
};

const SANTCLIMENT = {
	nom: 'Ajuntament de Sant Climent de Llobregat: ermita de Sant Ramon',
	url: 'https://www.santclimentdellobregat.cat/el-municipi/turisme/llocs-dinteres/ermita-de-sant-ramon.html',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: "Totnens: pujada a l'ermita de Sant Ramon Nonat (Montbaig, Sant Boi)",
	url: 'https://totnens.cat/que-fem/ermita-de-sant-ramon/',
	consultat: CONSULTAT
};

const NATURALOCAL = {
	nom: "Natura Local: pujada a l'ermita de Sant Ramon",
	url: 'https://naturalocal.net/en/routes-trekking-catalunya/routes-trekking-barcelona/routes-trekking-sant-boi-de-llobregat/pujada-lermita-de-sant-ramon',
	consultat: CONSULTAT
};

const DECIMENCIM = {
	nom: 'De cim en cim: Sant Ramon i Sant Antoni',
	url: 'https://www.decimencim.cat/2015/06/sant-ramon-i-sant-antoni/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'sant-ramon',
	descripcio: {
		ca: [
			"Sant Ramon és el nom popular del Montbaig, el turó de llicorella que s'alça a l'oest de la plana del Llobregat, [al Baix Llobregat](/comarques/baix-llobregat). Al cim s'hi troben els termes de Sant Boi de Llobregat, Sant Climent de Llobregat i Viladecans. A l'edat mitjana era la muntanya de Golbes, un nom que encara conserva la font que hi ha de camí. Segons la Viquipèdia, fins als anys cinquanta tota la muntanya era de vinya i cirerers; després es va abandonar i avui és coberta de pins, alzines i roures.",
			"L'ermita de **Sant Ramon Nonat**, patró dels nadons, es va construir entre el 1885 i el 1887, quan Josep Estruch i Comella la va fer aixecar en memòria dels seus pares. Abans, al cim només hi havia una fita que marcava els termes. Cada any, l'últim cap de setmana d'agost, els tres municipis hi celebren conjuntament l'aplec de Sant Ramon. Al costat hi ha un bar restaurant i un centre d'interpretació del paisatge del Baix Llobregat.",
			"La vista sobre l'àrea metropolitana és molt àmplia: el delta i la plana del Llobregat, el Garraf, l'Ordal i Collserola, amb Montserrat i el Montseny al fons. La Viquipèdia i l'Ajuntament de Sant Climent coincideixen que, en dies molt clars, s'arriba a albirar la serra de Tramuntana de Mallorca.",
			"Els dies de vent, el cim és molt desagradable, i a l'estiu convé anar-hi a primera hora."
		],
		es: [
			'Sant Ramon es el nombre popular del Montbaig, el cerro de pizarra que se alza al oeste del llano del Llobregat, [en el Baix Llobregat](/comarques/baix-llobregat). En la cima confluyen los municipios de Sant Boi de Llobregat, Sant Climent de Llobregat y Viladecans. En la Edad Media era la montaña de Golbes, un nombre que aún conserva la fuente que hay de camino. Según la Viquipèdia, hasta los años cincuenta toda la montaña era de viña y cerezos; después se abandonó y hoy está cubierta de pinos, encinas y robles.',
			'La ermita de **Sant Ramon Nonat**, patrón de los recién nacidos, se construyó entre 1885 y 1887, cuando Josep Estruch i Comella la mandó levantar en memoria de sus padres. Antes, en la cima solo había un mojón que marcaba los términos. Cada año, el último fin de semana de agosto, los tres municipios celebran conjuntamente el aplec de Sant Ramon. Al lado hay un bar restaurante y un centro de interpretación del paisaje del Baix Llobregat.',
			'La vista sobre el área metropolitana es muy amplia: el delta y el llano del Llobregat, el Garraf, el Ordal y Collserola, con Montserrat y el Montseny al fondo. La Viquipèdia y el Ayuntamiento de Sant Climent coinciden en que, en días muy claros, se llega a divisar la sierra de Tramuntana de Mallorca.',
			'Los días de viento, la cima es muy desagradable, y en verano conviene ir a primera hora.'
		]
	},
	rutes: [
		{
			id: 'sant-boi-golbes',
			nom: {
				ca: 'Des de Sant Boi per la font de Golbes',
				es: 'Desde Sant Boi por la font de Golbes'
			},
			sortida: { nom: 'Carrer del Camí de Golbes (Sant Boi de Llobregat)' },
			distanciaKm: 2.75,
			tecnicitat: 'cap',
			descripcio: {
				ca: 'La pujada més coneguda, per una pista forestal sense asfaltar i ben compactada que passa per la font de Golbes. Totnens la qualifica de fàcil: són 5,5 km i unes 2 h anada i tornada pel mateix camí, i si no surts de la pista es pot fer amb cotxet. Natura Local en proposa una variant circular de 5,3 km i 260 m de desnivell, baixant per corriols de bosc que rellisquen quan són molls.',
				es: 'La subida más conocida, por una pista forestal sin asfaltar y bien compactada que pasa por la font de Golbes. Totnens la califica de fácil: son 5,5 km y unas 2 h ida y vuelta por el mismo camino, y si no sales de la pista se puede hacer con carrito. Natura Local propone una variante circular de 5,3 km y 260 m de desnivel, bajando por senderos de bosque que resbalan cuando están mojados.'
			},
			fonts: [TOTNENS, NATURALOCAL]
		},
		{
			id: 'sant-climent',
			nom: { ca: "Des de Sant Climent per l'Angla", es: "Desde Sant Climent por l'Angla" },
			sortida: { nom: "L'Angla (Sant Climent de Llobregat)" },
			descripcio: {
				ca: "L'Ajuntament de Sant Climent proposa pujar-hi des de la zona de l'Angla, creuant la nova passera de l'estret de Roques i seguint després un camí de bosc. És una alternativa tranquil·la per a qui ve de l'interior del massís.",
				es: "El Ayuntamiento de Sant Climent propone subir desde la zona de l'Angla, cruzando la nueva pasarela del estret de Roques y siguiendo después un camino de bosque. Es una alternativa tranquila para quien viene del interior del macizo."
			},
			fonts: [SANTCLIMENT]
		}
	],
	consells: {
		ca: [
			'Si vas amb cotxet, no surtis de la pista principal: les dreceres i els corriols de bosc no hi són aptes.',
			'Evita els dies de vent fort: al cim, desprotegit, es fa molt pesat.',
			"La font de Golbes queda de camí, però porta aigua igualment, sobretot a l'estiu.",
			'La pista és compartida amb ciclistes i corredors: camina pel costat i vigila els nens a les baixades.',
			"Si vols veure-hi ambient, l'últim cap de setmana d'agost s'hi fa l'aplec de Sant Ramon."
		],
		es: [
			'Si vas con carrito, no salgas de la pista principal: los atajos y los senderos de bosque no son aptos.',
			'Evita los días de viento fuerte: en la cima, desprotegida, se hace muy pesado.',
			'La font de Golbes queda de camino, pero lleva agua igualmente, sobre todo en verano.',
			'La pista se comparte con ciclistas y corredores: camina por el lado y vigila a los niños en las bajadas.',
			'Si quieres ver ambiente, el último fin de semana de agosto se celebra el aplec de Sant Ramon.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Sant Ramon?',
				resposta:
					'Des de Sant Boi, Totnens calcula unes 2 h anada i tornada per uns 5,5 km de pista. La variant circular de Natura Local fa 5,3 km i 1 h 50 min en total.'
			},
			{
				pregunta: 'Es pot pujar a Sant Ramon amb cotxet?',
				resposta:
					"Sí, si se segueix tota l'estona la pista forestal principal, que és ampla i ben compactada, segons Totnens. Pels corriols de bosc, en canvi, no és possible, i per fer-los recomana nens a partir de 7–8 anys."
			},
			{
				pregunta: "Quan es va construir l'ermita de Sant Ramon?",
				resposta:
					"Entre el 1885 i el 1887, per iniciativa de Josep Estruch i Comella, segons l'Ajuntament de Sant Climent. Està dedicada a Sant Ramon Nonat i cada mes d'agost hi té lloc l'aplec."
			},
			{
				pregunta: 'Sant Ramon és un cim essencial?',
				resposta:
					'Sí, i amb 295 m cap dels quatre [cims essencials](/cims-essencials) del Baix Llobregat no és més baix. Els altres són [Sant Pere Màrtir](/cims/sant-pere-martir), a l’altra banda del riu, [la Morella](/cims/la-morella), al massís del Garraf, i Sant Salvador de les Espases.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Sant Ramon?',
				resposta:
					'Desde Sant Boi, Totnens calcula unas 2 h ida y vuelta para unos 5,5 km de pista. La variante circular de Natura Local tiene 5,3 km y 1 h 50 min en total.'
			},
			{
				pregunta: '¿Se puede subir a Sant Ramon con carrito?',
				resposta:
					'Sí, si se sigue todo el rato la pista forestal principal, que es ancha y está bien compactada, según Totnens. Por los senderos de bosque, en cambio, no es posible, y para hacerlos recomienda niños a partir de 7–8 años.'
			},
			{
				pregunta: '¿Cuándo se construyó la ermita de Sant Ramon?',
				resposta:
					'Entre 1885 y 1887, por iniciativa de Josep Estruch i Comella, según el Ayuntamiento de Sant Climent. Está dedicada a Sant Ramon Nonat y cada mes de agosto acoge el aplec.'
			},
			{
				pregunta: '¿Sant Ramon es una cima esencial?',
				resposta:
					'Sí, y con 295 m ninguna de las cuatro [cimas esenciales](/cims-essencials) del Baix Llobregat es más baja. Las otras son [Sant Pere Màrtir](/cims/sant-pere-martir), al otro lado del río, [la Morella](/cims/la-morella), en el macizo del Garraf, y Sant Salvador de les Espases.'
			}
		]
	},
	fonts: [VIQUIPEDIA, SANTCLIMENT, TOTNENS, NATURALOCAL, DECIMENCIM],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
