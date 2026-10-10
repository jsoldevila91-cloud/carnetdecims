import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-03';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Taga',
	url: 'https://ca.wikipedia.org/wiki/Taga',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: excursió al Taga des de Bruguera",
	url: 'https://dexcursio.net/taga/',
	consultat: CONSULTAT
};

const ITINERANNIA = {
	nom: "Itinerànnia: ascens al Taga des de Sant Martí d'Ogassa (ruta 24 Ripollès)",
	url: 'https://www.itinerannia.net/en/routes/ascent-to-taga-from-sant-marti-d-ogassa-route-24-ripolles/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'taga',
	descripcio: {
		ca: [
			"El Taga és el gran mirador del [Ripollès](/comarques/ripolles). S'aixeca a la serra de Conivella, entre les valls del Freser i del Ter, i el cim reparteix els termes de Ribes de Freser, Ogassa i Pardines. És una muntanya de calcàries i lutites amb una forma clara i aïllada que el fa reconeixible des de gran part de la comarca, i per això ha estat sempre un punt de referència per a la gent de la zona.",
			"Tot i que per altitud podria ser boscós, la part alta és pelada i ocupada per prats de pastura, que són els que donen al cim el seu aspecte de gran llom herbat. A dalt hi ha una gran creu i un vèrtex geodèsic. El Taga també té història esportiva: a principis del segle XX s'hi feien curses d'esquí, i se'n conserven fotografies del 1912.",
			'La seva posició avançada respecte del Pirineu axial el converteix en un balcó excepcional: la panoràmica va del [Puigmal](/cims/puigmal) al Canigó, amb les valls de Ribes i de Sant Joan de les Abadesses als peus i la serra Cavallera al costat. Molt a prop hi ha també el [Balandrau](/cims/balandrau), un altre cim del repte de la mateixa comarca.',
			"Fora dels mesos de neu, és una pujada sense complicacions. A l'hivern sol estar nevat i els prats de dalt poden estar glaçats; a l'estiu, el vessant sud és molt assolellat i la carena, sense arbres, no protegeix ni de la calor ni de les tempestes."
		],
		es: [
			'El Taga es el gran mirador del [Ripollès](/comarques/ripolles). Se alza en la sierra de Conivella, entre los valles del Freser y del Ter, y la cima reparte los municipios de Ribes de Freser, Ogassa y Pardines. Es una montaña de calizas y lutitas con una forma clara y aislada que la hace reconocible desde gran parte de la comarca, y por eso ha sido siempre un punto de referencia para la gente de la zona.',
			'Aunque por altitud podría estar cubierta de bosque, la parte alta está pelada y ocupada por prados de pasto, que dan a la cima su aspecto de gran lomo herboso. Arriba hay una gran cruz y un vértice geodésico. El Taga tiene también historia deportiva: a principios del siglo XX se celebraban carreras de esquí, y se conservan fotografías de 1912.',
			'Su posición adelantada respecto al Pirineo axial lo convierte en un balcón excepcional: la panorámica va del [Puigmal](/cims/puigmal) al Canigó, con los valles de Ribes y de Sant Joan de les Abadesses a los pies y la sierra Cavallera al lado. Muy cerca está también el [Balandrau](/cims/balandrau), otra cima del reto de la misma comarca.',
			'Fuera de los meses de nieve, es una subida sin complicaciones. En invierno suele estar nevado y los prados de arriba pueden estar helados; en verano, la vertiente sur es muy soleada y la cresta, sin árboles, no protege ni del calor ni de las tormentas.'
		]
	},
	rutes: [
		{
			id: 'bruguera',
			nom: { ca: 'Des de Bruguera pel coll de Jou', es: 'Desde Bruguera por el coll de Jou' },
			sortida: { nom: 'Bruguera (Ribes de Freser)' },
			desnivellPositiuM: 893,
			tecnicitat: 'cap',
			descripcio: {
				ca: "La pujada clàssica des del poble de Bruguera puja pel bosc fins a una pista asfaltada que mena al coll de Jou, un balcó sobre el Puigmal. D'allà, un corriol clar s'enfila pels prats alpins directament al cim. Segons D'excursió per Catalunya, anada i tornada són uns 10,4 km i unes 4 h 30 min.",
				es: "La subida clásica desde el pueblo de Bruguera sube por el bosque hasta una pista asfaltada que lleva al coll de Jou, un balcón sobre el Puigmal. Desde allí, una senda clara sube por los prados alpinos directamente a la cima. Según D'excursió per Catalunya, ida y vuelta son unos 10,4 km y unas 4 h 30 min."
			},
			fonts: [DEXCURSIO]
		},
		{
			id: 'sant-marti-ogassa',
			nom: { ca: "Circular des de Sant Martí d'Ogassa", es: "Circular desde Sant Martí d'Ogassa" },
			sortida: { nom: "Església de Sant Martí d'Ogassa" },
			descripcio: {
				ca: "Ruta senyalitzada de la xarxa Itinerànnia (marques grogues): des de l'església romànica de Sant Martí d'Ogassa es puja cap al coll de Jou i el cim, i es torna per la portella d'Ogassa. La xarxa la descriu com una circular de 7,7 km, 686 m de desnivell i 3 h 50 min, de dificultat alta.",
				es: "Ruta señalizada de la red Itinerànnia (marcas amarillas): desde la iglesia románica de Sant Martí d'Ogassa se sube hacia el coll de Jou y la cima, y se vuelve por la portella d'Ogassa. La red la describe como una circular de 7,7 km, 686 m de desnivel y 3 h 50 min, de dificultad alta."
			},
			fonts: [ITINERANNIA]
		}
	],
	consells: {
		ca: [
			"Si vas just de temps, es pot arribar en cotxe fins al coll de Jou: des d'allà la pujada al cim és molt més curta.",
			'Porta protecció solar i aigua: a la part alta no hi ha ni ombra ni fonts.',
			"La carena és molt exposada: amb previsió de tempestes, puja d'hora i no t'hi entretinguis.",
			'Als prats hi pastura bestiar: no el molestis i porta el gos lligat.',
			'Amb neu o glaç, els prats del cim es tornen relliscosos i la sortida demana crampons i experiència.'
		],
		es: [
			'Si vas justo de tiempo, se puede llegar en coche hasta el coll de Jou: desde allí la subida a la cima es mucho más corta.',
			'Lleva protección solar y agua: en la parte alta no hay ni sombra ni fuentes.',
			'La cresta está muy expuesta: con previsión de tormentas, sube temprano y no te entretengas.',
			'En los prados pasta el ganado: no lo molestes y lleva el perro atado.',
			'Con nieve o hielo, los prados de la cima se vuelven resbaladizos y la salida exige crampones y experiencia.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Taga?',
				resposta:
					"Des de Bruguera, anada i tornada són unes 4 h 30 min i uns 890 m de desnivell, segons D'excursió per Catalunya. Si es comença al coll de Jou, l'excursió es redueix a uns 3 km anada i tornada."
			},
			{
				pregunta: 'Es pot pujar al Taga amb nens?',
				resposta:
					'Sí, sobretot des del coll de Jou: és curt, sense passos difícils i per prats oberts. Cal tenir en compte que el pendent és fort i que a dalt pot fer vent i fred.'
			},
			{
				pregunta: 'Què es veu des del cim del Taga?',
				resposta:
					'Una panoràmica de 360 graus sobre el Pirineu oriental, del [Puigmal](/cims/puigmal) al Canigó, i les valls del Freser i del Ter als peus.'
			},
			{
				pregunta: 'El Taga és un cim essencial?',
				resposta:
					'Sí. Dels sis essencials del Ripollès és el més baix; el sostre de la comarca és el [Puigmal](/cims/puigmal). Per validar-lo has d’arribar al punt on hi ha la creu i el vèrtex geodèsic.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Taga?',
				resposta:
					"Desde Bruguera, ida y vuelta son unas 4 h 30 min y unos 890 m de desnivel, según D'excursió per Catalunya. Si se empieza en el coll de Jou, la excursión se reduce a unos 3 km ida y vuelta."
			},
			{
				pregunta: '¿Se puede subir al Taga con niños?',
				resposta:
					'Sí, sobre todo desde el coll de Jou: es corto, sin pasos difíciles y por prados abiertos. Hay que tener en cuenta que la pendiente es fuerte y que arriba puede hacer viento y frío.'
			},
			{
				pregunta: '¿Qué se ve desde la cima del Taga?',
				resposta:
					'Una panorámica de 360 grados sobre el Pirineo oriental, del [Puigmal](/cims/puigmal) al Canigó, y los valles del Freser y del Ter a los pies.'
			},
			{
				pregunta: '¿El Taga es una cima esencial?',
				resposta:
					'Sí. De las seis esenciales del Ripollès es la más baja; el techo de la comarca es el [Puigmal](/cims/puigmal). Para validarla tienes que llegar al punto donde están la cruz y el vértice geodésico.'
			}
		]
	},
	wikiloc: [
		{
			id: 56800414,
			titol: 'Taga desde Coll de Jou ( Bruguera)',
			url: 'https://ca.wikiloc.com/rutes-senderisme/taga-desde-coll-de-jou-bruguera-56800414'
		},
		{
			id: 1615838,
			titol: 'El Taga des de Bruguera',
			url: 'https://ca.wikiloc.com/rutes-senderisme/el-taga-des-de-bruguera-1615838'
		}
	],
	fonts: [VIQUIPEDIA, DEXCURSIO, ITINERANNIA],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
