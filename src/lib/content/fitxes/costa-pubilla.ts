import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Cim de Pla de Pujalts (Costa Pubilla)',
	url: 'https://ca.wikipedia.org/wiki/Costa_Pubilla',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: 'Rutes Pirineus: Costa Pubilla - Pla de Pujalts des del santuari de Montgrony',
	url: 'https://www.rutespirineus.cat/rutes/costa-pubilla-pla-de-pujalts-santuari-montgrony-ripolles',
	consultat: CONSULTAT
};

const AJ_PLANOLES = {
	nom: 'Ajuntament de Planoles: cim del Costa Pubilla',
	url: 'https://planoles.cat/rutes-a-peu-i-amb-btt/rutes-a-peu/cim-del-costa-pubilla/',
	consultat: CONSULTAT
};

const MAIFEMCIM = {
	nom: 'Maifemcim: Costa Pubilla o cim de Pla de Pujalts (2.056 m)',
	url: 'https://maifemcim.blogspot.com/2019/10/costa-pubilla-o-cim-de-pla-de-pujalts.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'costa-pubilla',
	descripcio: {
		ca: [
			"La Costa Pubilla, també anomenada cim del Pla de Pujalts, és el punt més alt de la serra de Montgrony, al [Ripollès](/comarques/ripolles). El cim queda entre els termes de Gombrèn, Planoles i Toses, i és de calcàries i pissarres. Al cim hi ha un vèrtex geodèsic. L'Ajuntament de Planoles indica que tota la ruta de pujada és dins l'Espai d'Interès Natural de la Serra de Montgrony.",
			"La sortida clàssica és el santuari de la Mare de Déu de Montgrony, on unes escales de 72 graons tallades a la roca pugen a l'església de Santa Maria; la tradició les atribueix al comte Arnau. A tocar hi ha l'església romànica de Sant Pere de Montgrony. El camí travessa l'estret del Malpàs, un pas estret protegit amb barana sobre el cingle, i passa pel refugi de les Planelles. A la carena de baixada, el búnquer del Roc dels Llamps és un observatori de la línia P, la línia de fortificacions franquista del Pirineu, construït entre el 1950 i el 1952.",
			'Rutes Pirineus descriu una panoràmica de 360 graus: al nord, la vall de Planoles i el [Puigmal](/cims/puigmal); a llevant, la Covil i el [Taga](/cims/taga); al sud, el Baix Ripollès, Osona, el Montseny i Montserrat, i a ponent, la carena de Montgrony, el Cadí oriental i el Pedraforca.',
			"Rutes Pirineus la recomana de primavera a tardor; a l'hivern, un comentari de la ressenya hi esmenta neu a partir dels 1.600 m ja al novembre. La senyalització és escassa i barreja marques de diversos colors, fites i senyals, de manera que convé portar un track."
		],
		es: [
			'La Costa Pubilla, también llamada cima del Pla de Pujalts, es el punto más alto de la serra de Montgrony, en el [Ripollès](/comarques/ripolles). La cima queda entre los términos de Gombrèn, Planoles y Toses, y es de calizas y pizarras. En la cima hay un vértice geodésico. El Ayuntamiento de Planoles indica que toda la ruta de subida está dentro del Espai d’Interès Natural de la Serra de Montgrony.',
			'La salida clásica es el santuario de la Mare de Déu de Montgrony, donde una escalera de 72 peldaños tallados en la roca sube a la iglesia de Santa Maria; la tradición la atribuye al conde Arnau. Al lado está la iglesia románica de Sant Pere de Montgrony. El camino cruza el estret del Malpàs, un paso estrecho protegido con barandilla sobre el cantil, y pasa por el refugio de las Planelles. En la cresta de bajada, el búnker del Roc dels Llamps es un observatorio de la línea P, la línea de fortificaciones franquista del Pirineo, construido entre 1950 y 1952.',
			'Rutes Pirineus describe una panorámica de 360 grados: al norte, el valle de Planoles y el [Puigmal](/cims/puigmal); al este, la Covil y el [Taga](/cims/taga); al sur, el Baix Ripollès, Osona, el Montseny y Montserrat, y al oeste, la cresta de Montgrony, el Cadí oriental y el Pedraforca.',
			'Rutes Pirineus la recomienda de primavera a otoño; en invierno, un comentario de la reseña menciona nieve a partir de los 1.600 m ya en noviembre. La señalización es escasa y mezcla marcas de varios colores, hitos y señales, así que conviene llevar un track.'
		]
	},
	rutes: [
		{
			id: 'montgrony',
			nom: {
				ca: 'Circular des del santuari de Montgrony',
				es: 'Circular desde el santuario de Montgrony'
			},
			sortida: { nom: 'Aparcament del santuari de Montgrony (Gombrèn)' },
			tempsMinuts: 150,
			descripcio: {
				ca: "Rutes Pirineus proposa una circular de 13,6 km, 775 m de desnivell acumulat i 4 h 30 min de marxa sense parades. Es puja per l'estret del Malpàs, el refugi de les Planelles (abandonat segons aquesta ressenya) i els rasos dels Camps fins al coll de Coma Ermada (2 h) i, per la carena cap a l'oest, a la Costa Pubilla (2 h 30 min). Es baixa per la carena, passant pel búnquer, fins al coll de la Bona, les fontetes de Meians i el santuari. Entre el coll de la Bona i les fontetes hi ha blocs grans on ajudar-se de les mans dona seguretat.",
				es: 'Rutes Pirineus propone una circular de 13,6 km, 775 m de desnivel acumulado y 4 h 30 min de marcha sin paradas. Se sube por el estret del Malpàs, el refugio de las Planelles (abandonado según esta reseña) y los rasos dels Camps hasta el coll de Coma Ermada (2 h) y, por la cresta hacia el oeste, a la Costa Pubilla (2 h 30 min). Se baja por la cresta, pasando por el búnker, hasta el coll de la Bona, las fontetes de Meians y el santuario. Entre el coll de la Bona y las fontetes hay bloques grandes donde ayudarse de las manos da seguridad.'
			},
			fonts: [RUTES_PIRINEUS, MAIFEMCIM]
		},
		{
			id: 'coll-de-prat-de-jou',
			nom: {
				ca: 'Des del coll de Prat de Jou (Planoles)',
				es: 'Desde el coll de Prat de Jou (Planoles)'
			},
			sortida: { nom: 'Coll de Prat de Jou (Planoles, accés per Campelles)' },
			desnivellPositiuM: 360,
			distanciaKm: 3.5,
			descripcio: {
				ca: "L'Ajuntament de Planoles proposa un itinerari lineal, de 7 km anada i tornada, marcat amb senyals grogues d'Itinerànnia. Del coll de Prat de Jou, al qual s'arriba amb cotxe per Campelles i on una barrera obliga a deixar-lo, es segueix una pista plana fins al coll Roig (1.713 m), es puja per llomes herbosos al coll de Coma Ermada (1.875 m) i, per la carena cap a l'oest, al cim. Es torna pel mateix camí.",
				es: 'El Ayuntamiento de Planoles propone un itinerario lineal, de 7 km ida y vuelta, marcado con señales amarillas de Itinerànnia. Del coll de Prat de Jou, al que se llega en coche por Campelles y donde una barrera obliga a dejarlo, se sigue una pista llana hasta el coll Roig (1.713 m), se sube por lomas herbosas al coll de Coma Ermada (1.875 m) y, por la cresta hacia el oeste, a la cima. Se vuelve por el mismo camino.'
			},
			fonts: [AJ_PLANOLES]
		}
	],
	consells: {
		ca: [
			'Porta un track: segons Rutes Pirineus, la senyalització de la ruta de Montgrony és escassa i amb molts encreuaments.',
			'Si surts de Gombrèn en lloc del santuari, sumes uns 500 m de pujada i 6,2 km, segons Rutes Pirineus.',
			'A la ruta de Prat de Jou, una barrera impedeix seguir en cotxe: compta amb el tram de pista plana fins al coll Roig a peu.',
			'La baixada per la carena té blocs grans on convé ajudar-se de les mans: vigila-hi si hi ha roca humida.',
			'El santuari de Montgrony té hostatgeria amb restaurant (Maifemcim); consulta si és obert abans de comptar-hi per dinar.'
		],
		es: [
			'Lleva un track: según Rutes Pirineus, la señalización de la ruta de Montgrony es escasa y con muchos cruces.',
			'Si sales de Gombrèn en lugar del santuario, sumas unos 500 m de subida y 6,2 km, según Rutes Pirineus.',
			'En la ruta de Prat de Jou, una barrera impide seguir en coche: cuenta con el tramo de pista llana hasta el coll Roig a pie.',
			'La bajada por la cresta tiene bloques grandes donde conviene ayudarse de las manos: ten cuidado si hay roca húmeda.',
			'El santuario de Montgrony tiene hospedería con restaurante (Maifemcim); consulta si está abierto antes de contar con él para comer.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Costa Pubilla?',
				resposta:
					"Rutes Pirineus situa el cim a 2 h 30 min de marxa efectiva des del santuari de Montgrony, dins d'una circular de 13,6 km i 4 h 30 min. L'Ajuntament de Planoles dona unes 3 h anada i tornada des del coll de Prat de Jou (7 km i 360 m)."
			},
			{
				pregunta: 'Quin és el camí més curt?',
				resposta:
					"El de Planoles, des del coll de Prat de Jou: 7 km anada i tornada i 360 m de desnivell, segons l'Ajuntament. Cal tenir en compte que una barrera impedeix arribar-hi en cotxe més amunt."
			},
			{
				pregunta: 'Quines vistes té?',
				resposta:
					'Segons Rutes Pirineus, una panoràmica completa: del Puigmal i el Taga fins al Montseny i Montserrat, i a ponent el Cadí oriental i el Pedraforca. Maifemcim destaca, des de la carena, les serres del Berguedà i del Ripollès.'
			},
			{
				pregunta: 'La Costa Pubilla compta com a cim essencial?',
				resposta:
					'Sí. És el cinquè dels sis essencials del Ripollès per altitud, només per sobre del [Taga](/cims/taga), i el més alt de la serra de Montgrony.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Costa Pubilla?',
				resposta:
					'Rutes Pirineus sitúa la cima a 2 h 30 min de marcha efectiva desde el santuario de Montgrony, dentro de una circular de 13,6 km y 4 h 30 min. El Ayuntamiento de Planoles da unas 3 h ida y vuelta desde el coll de Prat de Jou (7 km y 360 m).'
			},
			{
				pregunta: '¿Cuál es el camino más corto?',
				resposta:
					'El de Planoles, desde el coll de Prat de Jou: 7 km ida y vuelta y 360 m de desnivel, según el Ayuntamiento. Hay que tener en cuenta que una barrera impide llegar en coche más arriba.'
			},
			{
				pregunta: '¿Qué vistas tiene?',
				resposta:
					'Según Rutes Pirineus, una panorámica completa: del Puigmal y el Taga hasta el Montseny y Montserrat, y al oeste el Cadí oriental y el Pedraforca. Maifemcim destaca, desde la cresta, las sierras del Berguedà y del Ripollès.'
			},
			{
				pregunta: '¿La Costa Pubilla cuenta como cima esencial?',
				resposta:
					'Sí. Es la quinta de las seis esenciales del Ripollès por altitud, solo por encima del [Taga](/cims/taga), y la más alta de la serra de Montgrony.'
			}
		]
	},
	fonts: [VIQUIPEDIA, RUTES_PIRINEUS, AJ_PLANOLES, MAIFEMCIM],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
