import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: La Morella (Begues)',
	url: 'https://ca.wikipedia.org/wiki/La_Morella_(Begues)',
	consultat: CONSULTAT
};

const DIBA_GR92 = {
	nom: 'Diputació de Barcelona, itineraris senyalitzats: GR 92 Sender del Mediterrani, de la Pleta a la Morella',
	url: 'https://itineraris-senyalitzats.diba.cat/routes/view/gr-92-sender-del-mediterrani-de-la-pleta-a-la-morella',
	consultat: CONSULTAT
};

const BEGUES = {
	nom: 'Ajuntament de Begues: Itinerari pel Parc del Garraf',
	url: 'https://www.begues.cat/begues/llocs-dinteres/itineraris/itinerari-pel-parc-del-garraf.html',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: la Morella al massís del Garraf',
	url: 'https://totnens.cat/que-fem/la-morella-el-cim-del-massis-del-garraf-amb-nens/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'la-morella',
	descripcio: {
		ca: [
			'La Morella és una muntanya del massís del Garraf, al municipi de Begues, al [Baix Llobregat](/comarques/baix-llobregat), dins del Parc del Garraf. Segons la Viquipèdia, és el segon cim més alt del massís, després del Montau, i és de calcàries amb intercalacions de dolomia del Cretaci inferior; el voltant té diversos avencs. Al Baix Llobregat hi ha també [Sant Pere Màrtir](/cims/sant-pere-martir) i [Sant Ramon](/cims/sant-ramon), cims essencials.',
			"Al cim hi ha un vèrtex geodèsic i una creu. La Viquipèdia explica que el GR 92, el sender del Mediterrani, passa per la Morella a l'etapa 21, entre Bruguers i Garraf. L'Ajuntament de Begues recull un itinerari pel Parc del Garraf que té com a objectiu assolir el punt més alt a la Morella.",
			"La sortida habitual és el centre d'informació de la Pleta, al parc. L'itinerari de la Diputació de Barcelona, GR 92 de la Pleta a la Morella, fa 3,5 km, té dificultat baixa i una durada aproximada de 2 h 30 min, amb un desnivell suau; recorre l'interior del Parc del Garraf, amb formes càrstiques com rasclers, dolines i avencs. El primer quilòmetre, de la Pleta al pla de Querol, és una carretera asfaltada amb molt de trànsit i poca visibilitat.",
			"Totnens, que la proposa com a excursió amb nens, parla d'una ruta d'anada i tornada de 7 km i unes 3 h 15 min amb parades, sense gaire desnivell, seguint les marques blanques i vermelles del GR 92. Aconsella no fer-la en ple estiu ni a l'hora de màxima calor, perquè gairebé no hi ha ombra."
		],
		es: [
			'La Morella es una montaña del macizo del Garraf, en el municipio de Begues, en el [Baix Llobregat](/comarques/baix-llobregat), dentro del Parc del Garraf. Según la Viquipèdia, es la segunda cima más alta del macizo, tras el Montau, y es de calizas con intercalaciones de dolomía del Cretácico inferior; los alrededores tienen varios avencs. En el Baix Llobregat están también [Sant Pere Màrtir](/cims/sant-pere-martir) y [Sant Ramon](/cims/sant-ramon), cimas esenciales.',
			'En la cima hay un vértice geodésico y una cruz. La Viquipèdia explica que el GR 92, el sender del Mediterrani, pasa por la Morella en la etapa 21, entre Bruguers y Garraf. El Ayuntamiento de Begues recoge un itinerario por el Parc del Garraf que tiene como objetivo alcanzar el punto más alto en la Morella.',
			'La salida habitual es el centro de información de la Pleta, en el parque. El itinerario de la Diputació de Barcelona, GR 92 de la Pleta a la Morella, tiene 3,5 km, dificultad baja y una duración aproximada de 2 h 30 min, con un desnivel suave; recorre el interior del Parc del Garraf, con formas kársticas como rasclers, dolinas y avencs. El primer kilómetro, de la Pleta al pla de Querol, es una carretera asfaltada con mucho tráfico y poca visibilidad.',
			'Totnens, que la propone como excursión con niños, habla de una ruta de ida y vuelta de 7 km y unas 3 h 15 min con paradas, sin mucho desnivel, siguiendo las marcas blancas y rojas del GR 92. Aconseja no hacerla en pleno verano ni a la hora de máximo calor, porque casi no hay sombra.'
		]
	},
	rutes: [
		{
			id: 'la-pleta',
			nom: {
				ca: 'Des de la Pleta pel GR 92',
				es: 'Desde la Pleta por el GR 92'
			},
			sortida: { nom: "Centre d'informació de la Pleta (Parc del Garraf)" },
			distanciaKm: 3.5,
			descripcio: {
				ca: "La Diputació de Barcelona descriu l'itinerari GR 92 de la Pleta a la Morella amb 3,5 km, dificultat baixa, una durada aproximada de 2 h 30 min i un desnivell suau; recomana portar calçat adequat i aigua, sobretot els mesos de calor. El primer quilòmetre, fins al pla de Querol, és per una carretera asfaltada amb molt de trànsit i poca visibilitat. Totnens el fa d'anada i tornada: 7 km i 3 h 15 min amb parades, pels senyals blancs i vermells del GR 92, i passa pels avencs Emili Sabater i del Llamp.",
				es: 'La Diputació de Barcelona describe el itinerario GR 92 de la Pleta a la Morella con 3,5 km, dificultad baja, una duración aproximada de 2 h 30 min y un desnivel suave; recomienda llevar calzado adecuado y agua, sobre todo los meses de calor. El primer kilómetro, hasta el pla de Querol, es por una carretera asfaltada con mucho tráfico y poca visibilidad. Totnens lo hace de ida y vuelta: 7 km y 3 h 15 min con paradas, por las señales blancas y rojas del GR 92, y pasa por los avencs Emili Sabater y del Llamp.'
			},
			fonts: [DIBA_GR92, TOTNENS]
		}
	],
	consells: {
		ca: [
			'La Diputació de Barcelona avisa que el tram de carretera de la Pleta al pla de Querol té molt de trànsit i poca visibilitat: extrema la precaució.',
			"Segons Totnens, gairebé no hi ha ombra: no hi vagis en ple estiu ni a l'hora de màxima calor, i porta aigua.",
			"Hi ha avencs al voltant de l'itinerari, i Totnens avisa que alguns no estan senyalitzats: no et surtis del camí i vigila els nens.",
			"El GR 92 va marcat amb senyals blancs i vermells: segueix-los i no t'endinsis per altres camins del parc.",
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			'La Diputació de Barcelona avisa de que el tramo de carretera de la Pleta al pla de Querol tiene mucho tráfico y poca visibilidad: extrema la precaución.',
			'Según Totnens, casi no hay sombra: no vayas en pleno verano ni a la hora de máximo calor, y lleva agua.',
			'Hay avencs en torno al itinerario, y Totnens avisa de que algunos no están señalizados: no te salgas del camino y vigila a los niños.',
			'El GR 92 va marcado con señales blancas y rojas: síguelas y no te adentres por otros caminos del parque.',
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Morella?',
				resposta:
					"La Diputació de Barcelona dona 2 h 30 min per al GR 92 de la Pleta a la Morella (3,5 km). Totnens compta 3 h 15 min amb parades per a 7 km d'anada i tornada."
			},
			{
				pregunta: 'Es pot anar a la Morella amb nens?',
				resposta:
					'Totnens la proposa com a excursió amb nens, de desnivell suau, però avisa que no hi ha ombra i que alguns avencs no estan senyalitzats.'
			},
			{
				pregunta: 'Quan és millor anar-hi?',
				resposta:
					"Totnens aconsella no fer-la en ple estiu ni a l'hora de màxima calor, perquè gairebé no hi ha ombra."
			},
			{
				pregunta: 'La Morella és un cim essencial?',
				resposta:
					"Sí. Al [Baix Llobregat](/comarques/baix-llobregat) l'acompanyen [Sant Pere Màrtir](/cims/sant-pere-martir) i [Sant Ramon](/cims/sant-ramon)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Morella?',
				resposta:
					'La Diputació de Barcelona da 2 h 30 min para el GR 92 de la Pleta a la Morella (3,5 km). Totnens cuenta 3 h 15 min con paradas para 7 km de ida y vuelta.'
			},
			{
				pregunta: '¿Se puede ir a la Morella con niños?',
				resposta:
					'Totnens la propone como excursión con niños, de desnivel suave, pero avisa de que no hay sombra y de que algunos avencs no están señalizados.'
			},
			{
				pregunta: '¿Cuándo es mejor ir?',
				resposta:
					'Totnens aconseja no hacerla en pleno verano ni a la hora de máximo calor, porque casi no hay sombra.'
			},
			{
				pregunta: '¿La Morella es una cima esencial?',
				resposta:
					'Sí. En el [Baix Llobregat](/comarques/baix-llobregat) la acompañan [Sant Pere Màrtir](/cims/sant-pere-martir) y [Sant Ramon](/cims/sant-ramon).'
			}
		]
	},
	fonts: [VIQUIPEDIA, DIBA_GR92, BEGUES, TOTNENS],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
