import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Castell del Montgrí',
	url: 'https://ca.wikipedia.org/wiki/Castell_del_Montgr%C3%AD',
	consultat: CONSULTAT
};

const PARC_NATURAL = {
	nom: 'Parc Natural del Montgrí, les Illes Medes i el Baix Ter (Generalitat): ruta 01, Castell del Montgrí (PDF)',
	url: 'https://parcsnaturals.gencat.cat/web/.content/Xarxa-de-parcs/montgri-illes-medes-baix-ter/gaudeix-parc/equipaments-itineraris/it-terrestres/01.PNM-CASTELL-MONTGRI-cat.pdf',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: "Rutes Pirineus: Castell del Montgrí i zona d'interès natural de les Dunes",
	url: 'https://www.rutespirineus.cat/rutes/castell-montgri-i-zona-interes-natural-de-les-dunes',
	consultat: CONSULTAT
};

const CPNL = {
	nom: "De viatges i llibres (CPNL): pujada al castell de Montgrí, «el botó de la roda de l'Empordà»",
	url: 'https://blogs.cpnl.cat/viatgesillibres/2019/03/31/pujada-al-castell-de-montgri-el-boto-de-la-roda-de-lemporda/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'castell-del-montgri',
	descripcio: {
		ca: [
			"El castell del Montgrí corona la muntanya calcària que s'aixeca just al nord de Torroella de Montgrí, [al Baix Empordà](/comarques/baix-emporda), a pocs quilòmetres del mar. La serra, pelada i blanquinosa, és dins el Parc Natural del Montgrí, les Illes Medes i el Baix Ter, i la silueta quadrada del castell, visible des de gairebé tota la plana, n'és la imatge més coneguda. Josep Pla el va anomenar «el botó de la roda de l'Empordà», perquè tot el país sembla girar al seu voltant.",
			"És un castell que no es va acabar mai. El rei Jaume II el va fer començar el 1294 per plantar cara als comtes d'Empúries, rivals de la corona en aquesta part de l'Empordà, però les obres es van aturar cap al 1301-1302, quan el comtat va deixar de ser una amenaça. En va quedar un recinte de planta quadrada amb quatre torres cilíndriques als angles, muralles emmerletades i un pati interior buit. És bé cultural d'interès nacional i es va restaurar a partir del 1985. Pel camí de pujada hi ha tres capelles, estacions d'un antic rosari, i la creu del coll de Santa Caterina, lligades a la llegenda d'una imatge de la santa que un pastor hauria trobat entre les roques.",
			"Des de dalt es domina tota la plana de l'Empordà. Es veuen l'Estartit i les illes Medes, la badia de Roses, la platja de Pals i, cap al nord, el Pirineu. Des del coll de Santa Caterina, a mig camí, també hi ha una bona vista de l'ermita del mateix nom.",
			"Es pot pujar tot l'any, però és una muntanya seca i sense ombra: a l'estiu cal anar-hi a primera hora o a última hora de la tarda. La tramuntana hi bufa amb força i, en dies de vent fort, el parc avisa del risc de caigudes. La primavera i la tardor són les millors èpoques."
		],
		es: [
			'El castell del Montgrí corona la montaña caliza que se alza justo al norte de Torroella de Montgrí, [en el Baix Empordà](/comarques/baix-emporda), a pocos kilómetros del mar. La sierra, pelada y blanquecina, está dentro del Parc Natural del Montgrí, les Illes Medes i el Baix Ter, y la silueta cuadrada del castillo, visible desde casi toda la llanura, es su imagen más conocida. Josep Pla lo llamó «el botón de la rueda del Empordà», porque toda la comarca parece girar a su alrededor.',
			'Es un castillo que nunca se terminó. El rey Jaime II mandó empezarlo en 1294 para hacer frente a los condes de Empúries, rivales de la corona en esta parte del Empordà, pero las obras se detuvieron hacia 1301-1302, cuando el condado dejó de ser una amenaza. Quedó un recinto de planta cuadrada con cuatro torres cilíndricas en las esquinas, murallas almenadas y un patio interior vacío. Es bien cultural de interés nacional y se restauró a partir de 1985. En el camino de subida hay tres capillas, estaciones de un antiguo rosario, y la cruz del coll de Santa Caterina, ligadas a la leyenda de una imagen de la santa que un pastor habría encontrado entre las rocas.',
			"Desde arriba se domina toda la llanura del Empordà. Se ven l'Estartit y las islas Medes, la bahía de Roses, la playa de Pals y, hacia el norte, el Pirineo. Desde el coll de Santa Caterina, a medio camino, también hay una buena vista de la ermita del mismo nombre.",
			'Se puede subir todo el año, pero es una montaña seca y sin sombra: en verano hay que ir a primera hora o al final de la tarde. La tramontana sopla con fuerza y, en días de viento fuerte, el parque avisa del riesgo de caídas. La primavera y el otoño son las mejores épocas.'
		]
	},
	rutes: [
		{
			id: 'torroella-santa-caterina',
			nom: {
				ca: 'Des de Torroella pel coll de Santa Caterina',
				es: 'Desde Torroella por el coll de Santa Caterina'
			},
			sortida: { nom: 'Aparcament del Roser (Torroella de Montgrí)' },
			desnivellPositiuM: 255,
			distanciaKm: 2.45,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "És la ruta 01 del parc natural, senyalitzada amb les marques del GR. De l'aparcament, una pista puja suaument entre conreus abandonats fins al Pedrigolet, una tartera, i després un sender amb murs de pedra seca passa per les tres capelles i arriba a la creu de Santa Caterina. L'últim tram, un sender pedregós, s'enfila pel llom fins al castell. El parc la considera una ruta de caire familiar, sense passos equipats; anada i tornada són 4,9 km i unes 2 h.",
				es: 'Es la ruta 01 del parque natural, señalizada con las marcas del GR. Desde el aparcamiento, una pista sube suavemente entre cultivos abandonados hasta el Pedrigolet, un pedregal, y después un sendero con muros de piedra seca pasa por las tres capillas y llega a la cruz de Santa Caterina. El último tramo, un sendero pedregoso, sube por el lomo hasta el castillo. El parque la considera una ruta de carácter familiar, sin pasos equipados; ida y vuelta son 4,9 km y unas 2 h.'
			},
			fonts: [PARC_NATURAL]
		},
		{
			id: 'circular-dunes',
			nom: { ca: 'Circular per les Dunes', es: 'Circular por las Dunes' },
			sortida: { nom: 'Camí de les Dunes (Torroella de Montgrí)' },
			descripcio: {
				ca: "Rutes Pirineus proposa pujar al castell pel coll de Santa Caterina (1 h), seguir la carena fins al Montplà i baixar per l'àrea de lleure de les Dunes i un bosc crescut sobre una antiga duna. En total són 9,7 km, 400 m de desnivell i 3 h; adverteix que la baixada des del castell cap al coll d'en Garrigàs demana molta atenció.",
				es: "Rutes Pirineus propone subir al castillo por el coll de Santa Caterina (1 h), seguir la cresta hasta el Montplà y bajar por el área de ocio de les Dunes y un bosque crecido sobre una antigua duna. En total son 9,7 km, 400 m de desnivel y 3 h; advierte de que la bajada desde el castillo hacia el coll d'en Garrigàs exige mucha atención."
			},
			fonts: [RUTES_PIRINEUS]
		}
	],
	consells: {
		ca: [
			"Porta aigua: el parc avisa que a la muntanya no hi ha fonts amb garanties sanitàries, i no hi ha gens d'ombra.",
			"L'aparcament gratuït del Roser, a la zona de benvinguda del Montgrí, és al nord del poble, just on comença el sender.",
			'Amb tramuntana forta, vigila als trams pedregosos i a les muralles del castell: el risc de caiguda augmenta.',
			"Al parc, el trànsit motoritzat per les pistes està tancat del 15 de juny al 15 de setembre; els gossos han d'anar lligats i no es pot acampar ni fer foc.",
			"Si vas amb nens, la pujada al pati i a les torres del castell és part de la gràcia, però vigila'ls a prop dels merlets."
		],
		es: [
			'Lleva agua: el parque avisa de que en la montaña no hay fuentes con garantías sanitarias, y no hay nada de sombra.',
			'El aparcamiento gratuito del Roser, en la zona de bienvenida del Montgrí, está al norte del pueblo, justo donde empieza el sendero.',
			'Con tramontana fuerte, ten cuidado en los tramos pedregosos y en las murallas del castillo: el riesgo de caída aumenta.',
			'En el parque, el tráfico motorizado por las pistas está cerrado del 15 de junio al 15 de septiembre; los perros deben ir atados y no se puede acampar ni hacer fuego.',
			'Si vas con niños, subir al patio y a las torres del castillo es parte de la gracia, pero vigílalos cerca de las almenas.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al castell del Montgrí?',
				resposta:
					"Des de l'aparcament del Roser, la ruta del parc natural fa 4,9 km anada i tornada, 255 m de desnivell i unes 2 h en total. Rutes Pirineus calcula 1 h des de Torroella fins al castell."
			},
			{
				pregunta: 'Es pot pujar al castell del Montgrí amb nens?',
				resposta:
					"Sí: el parc natural la presenta com una ruta de caire familiar i sense passos equipats. Només cal vigilar al tram de tartera i al sender pedregós final, i evitar les hores de calor a l'estiu."
			},
			{
				pregunta: 'Es pot entrar dins el castell del Montgrí?',
				resposta:
					"Sí, el recinte és obert: es pot entrar al pati i, per una escala de cargol d'una de les torres, pujar a les muralles. És un castell inacabat, de manera que a dins no hi ha estances, només els murs."
			},
			{
				pregunta: 'El castell del Montgrí compta com a cim essencial?',
				resposta:
					"Sí, és un dels [cims essencials](/cims-essencials) del repte i l'únic del Baix Empordà. Les condicions per validar-lo són a la [normativa](/repte-100-cims/normativa)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al castell del Montgrí?',
				resposta:
					'Desde el aparcamiento del Roser, la ruta del parque natural tiene 4,9 km ida y vuelta, 255 m de desnivel y unas 2 h en total. Rutes Pirineus calcula 1 h desde Torroella hasta el castillo.'
			},
			{
				pregunta: '¿Se puede subir al castell del Montgrí con niños?',
				resposta:
					'Sí: el parque natural la presenta como una ruta de carácter familiar y sin pasos equipados. Solo hay que vigilar en el tramo de pedregal y en el sendero pedregoso final, y evitar las horas de calor en verano.'
			},
			{
				pregunta: '¿Se puede entrar en el castell del Montgrí?',
				resposta:
					'Sí, el recinto está abierto: se puede entrar en el patio y, por una escalera de caracol de una de las torres, subir a las murallas. Es un castillo inacabado, así que dentro no hay estancias, solo los muros.'
			},
			{
				pregunta: '¿El castell del Montgrí cuenta como cima esencial?',
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) del reto y la única del Baix Empordà. Las condiciones para validarla están en la [normativa](/repte-100-cims/normativa).'
			}
		]
	},
	fonts: [VIQUIPEDIA, PARC_NATURAL, RUTES_PIRINEUS, CPNL],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
