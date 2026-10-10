import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Bastiments',
	url: 'https://ca.wikipedia.org/wiki/Bastiments',
	consultat: CONSULTAT
};

const ENGARRISTA = {
	nom: "Engarrista: Bastiments (2.883 m) i Pic de l'Infern (2.869 m)",
	url: 'https://www.engarrista.com/node/282',
	consultat: CONSULTAT
};

const FER_MUNTANYA = {
	nom: 'Fer muntanya: Bastiments (aparcament refugi Ulldeter)',
	url: 'https://fermuntanya.blogspot.com/2008/09/bastiments-aparcament-refugi-ulldeter.html',
	consultat: CONSULTAT
};

const PARC_ULLDETER = {
	nom: "Parcs naturals de Catalunya: circ d'Ulldeter",
	url: 'https://parcsnaturals.gencat.cat/ca/xarxa-de-parcs/ter-freser/gaudeix-del-parc/equipaments-i-itineraris/itineraris/itineraris-interpretatius-del-parc-natural/circ-ulldeter/index.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'bastiments',
	descripcio: {
		ca: [
			"El Bastiments, o Pic del Gegant, és un cim de 2.881 m a la frontera entre el [Ripollès](/comarques/ripolles) i el Conflent. S'alça on es troben els termes de Setcases, Queralbs i Fontpedrosa, dins del Parc Natural de les Capçaleres del Ter i del Freser. És de gneis i separa el circ d'Ulldeter, al sud, del de Bacivers, a la cara nord. Segons la Viquipèdia, és el cim pirinenc de més de 2.800 m situat més a l'est.",
			"Ulldeter és el punt de sortida clàssic i té història pròpia. Segons el Parc Natural, el primer refugi de muntanya de la península Ibèrica es va obrir el 1909 a 2.390 m; les filtracions d'aigua el van arruïnar als anys quaranta i l'actual refugi es va inaugurar el 1959. Sota l'antic refugi hi ha l'Ull del Ter, on neix el riu, que arriba al mar a l'Estartit 210 km més avall. Al cim hi ha un vèrtex geodèsic, un pal d'acer en forma de piolet i una creu que el Grup Excursionista i Esportiu Gironí va col·locar el 1994 per al seu 75è aniversari, una mica a l'est del punt més alt.",
			"L'autor del blog Fer muntanya hi va identificar el Canigó i el [Costabona](/cims/costabona) a llevant, el Pic de l'Infern i el [Puigmal](/cims/puigmal) a ponent, el Carlit i les serres franceses al nord, i la Cerdanya i la vall alta del Freser. Des del coll de la Marrana, Engarrista hi afegeix la coma del Freser amb el [Balandrau](/cims/balandrau) al fons.",
			"La Viquipèdia el considera una ascensió relativament fàcil tant a l'estiu com a l'hivern, però Fer muntanya avisa que sovint hi bufa un vent fort i fred i que el risc de boira i de tempesta és alt: baixant, l'autor hi va veure créixer un cumulonimbus. La millor època va de l'estiu a la tardor, amb sortida de bon matí."
		],
		es: [
			'El Bastiments, o Pic del Gegant, es una cima de 2.881 m en la frontera entre el [Ripollès](/comarques/ripolles) y el Conflent. Se alza donde se encuentran los términos de Setcases, Queralbs y Fontpedrosa, dentro del Parque Natural de las Capçaleres del Ter i del Freser. Es de gneis y separa el circo de Ulldeter, al sur, del de Bacivers, en la cara norte. Según la Viquipèdia, es la cima pirenaica de más de 2.800 m situada más al este.',
			'Ulldeter es el punto de salida clásico y tiene historia propia. Según el Parque Natural, el primer refugio de montaña de la península ibérica se abrió en 1909 a 2.390 m; las filtraciones de agua lo arruinaron en los años cuarenta y el actual refugio se inauguró en 1959. Bajo el antiguo refugio está el Ull del Ter, donde nace el río, que llega al mar en l’Estartit 210 km más abajo. En la cima hay un vértice geodésico, un poste de acero en forma de piolet y una cruz que el Grup Excursionista i Esportiu Gironí colocó en 1994 por su 75.º aniversario, algo al este del punto más alto.',
			'El autor del blog Fer muntanya identificó el Canigó y el [Costabona](/cims/costabona) al este, el Pic de l’Infern y el [Puigmal](/cims/puigmal) al oeste, el Carlit y las sierras francesas al norte, y la Cerdanya y el valle alto del Freser. Desde el coll de la Marrana, Engarrista añade la coma del Freser con el [Balandrau](/cims/balandrau) al fondo.',
			'La Viquipèdia lo considera una ascensión relativamente fácil tanto en verano como en invierno, pero Fer muntanya avisa de que a menudo sopla un viento fuerte y frío y de que el riesgo de niebla y de tormenta es alto: bajando, el autor vio crecer un cumulonimbo. La mejor época va del verano al otoño, saliendo temprano.'
		]
	},
	rutes: [
		{
			id: 'ulldeter-marrana',
			nom: {
				ca: "Des d'Ulldeter pel coll de la Marrana",
				es: 'Desde Ulldeter por el coll de la Marrana'
			},
			sortida: { nom: "Aparcament del refugi d'Ulldeter (carretera de Vallter 2000, Setcases)" },
			desnivellPositiuM: 783,
			tempsMinuts: 105,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "És la pujada clàssica. De l'aparcament, el GR 11 porta al refugi d'Ulldeter en uns 20 minuts; d'allà es puja al coll de la Marrana (uns 2.510 m) i, per un llom herbós i una tartera, a la creu i, per un tram pla i rocós, al vèrtex. Fer muntanya hi compta uns 20 min fins al refugi, 45 més fins al coll i 40 fins a la creu, amb 783 m de desnivell i 9,9 km anada i tornada; Engarrista hi arriba en 1 h 57 min i 3,9 km, amb un esmorzar just abans del cim.",
				es: 'Es la subida clásica. Del aparcamiento, el GR 11 lleva al refugio de Ulldeter en unos 20 minutos; desde allí se sube al coll de la Marrana (unos 2.510 m) y, por un lomo herboso y una pedrera, a la cruz y, por un tramo llano y rocoso, al vértice. Fer muntanya cuenta unos 20 min hasta el refugio, 45 más hasta el collado y 40 hasta la cruz, con 783 m de desnivel y 9,9 km ida y vuelta; Engarrista llega en 1 h 57 min y 3,9 km, con un almuerzo justo antes de la cima.'
			},
			fonts: [ENGARRISTA, FER_MUNTANYA]
		}
	],
	consells: {
		ca: [
			"A l'estiu, el perill principal són el vent, la boira i les tempestes de tarda: si veus que el cel s'enfosqueix, no continuïs cap a la carena.",
			'Segons el Parc Natural, cal anar pels camins senyalitzats, portar els gossos lligats i no acampar, fer foc ni volar drons.',
			'Tanca les portes del bestiar i no deixis residus.',
			"A l'hivern, la tartera i el llom poden estar nevats; l'ascensió es converteix en una sortida d'hivern amb material.",
			"Si vols fer una jornada llarga, Engarrista enllaça el Bastiments amb el Pic de l'Infern i altres cims de la carena en una circular de 13,6 km i 1.250 m de desnivell."
		],
		es: [
			'En verano, el peligro principal son el viento, la niebla y las tormentas de tarde: si ves que el cielo se oscurece, no sigas hacia la cresta.',
			'Según el Parque Natural, hay que ir por los caminos señalizados, llevar los perros atados y no acampar, hacer fuego ni volar drones.',
			'Cierra las puertas del ganado y no dejes residuos.',
			'En invierno, la pedrera y el lomo pueden estar nevados; la ascensión se convierte en una salida de invierno con material.',
			'Si quieres hacer una jornada larga, Engarrista enlaza el Bastiments con el Pic de l’Infern y otras cimas de la cresta en una circular de 13,6 km y 1.250 m de desnivel.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Bastiments?',
				resposta:
					"Fer muntanya hi va trigar uns 20 minuts fins al refugi, 45 fins al coll de la Marrana i 40 més fins a la creu: poc menys de dues hores, com Engarrista, que marca 1 h 57 min des de l'aparcament d'Ulldeter."
			},
			{
				pregunta: 'És una ruta fàcil?',
				resposta:
					"La Viquipèdia la considera relativament fàcil a l'estiu i a l'hivern, i Fer muntanya hi veu una pujada clàssica. Però el vent, la boira i les tempestes fan que no s'hagi de subestimar: l'últim tram és de tartera."
			},
			{
				pregunta: 'On es veu el naixement del Ter?',
				resposta:
					"A l'Ull del Ter, a prop de l'antic refugi d'Ulldeter. El circ d'Ulldeter és un itinerari interpretatiu de 4,5 km i 345 m de desnivell que no arriba al cim."
			},
			{
				pregunta: 'El Bastiments compta com a cim essencial?',
				resposta:
					'Sí, és el segon dels sis essencials del Ripollès per altitud, només per sota del [Puigmal](/cims/puigmal), i el més oriental dels cims pirinencs de més de 2.800 m.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Bastiments?',
				resposta:
					'Fer muntanya tardó unos 20 minutos hasta el refugio, 45 hasta el coll de la Marrana y 40 más hasta la cruz: algo menos de dos horas, como Engarrista, que marca 1 h 57 min desde el aparcamiento de Ulldeter.'
			},
			{
				pregunta: '¿Es una ruta fácil?',
				resposta:
					'La Viquipèdia la considera relativamente fácil en verano y en invierno, y Fer muntanya ve una subida clásica. Pero el viento, la niebla y las tormentas hacen que no deba subestimarse: el último tramo es de pedrera.'
			},
			{
				pregunta: '¿Dónde se ve el nacimiento del Ter?',
				resposta:
					'En el Ull del Ter, cerca del antiguo refugio de Ulldeter. El circo de Ulldeter es un itinerario interpretativo de 4,5 km y 345 m de desnivel que no llega a la cima.'
			},
			{
				pregunta: '¿El Bastiments cuenta como cima esencial?',
				resposta:
					'Sí, es la segunda de las seis esenciales del Ripollès por altitud, solo por debajo del [Puigmal](/cims/puigmal), y la más oriental de las cimas pirenaicas de más de 2.800 m.'
			}
		]
	},
	fonts: [VIQUIPEDIA, ENGARRISTA, FER_MUNTANYA, PARC_ULLDETER],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
