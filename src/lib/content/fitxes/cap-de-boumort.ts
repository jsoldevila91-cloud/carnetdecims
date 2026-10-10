import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Cap de Boumort',
	url: 'https://ca.wikipedia.org/wiki/Cap_de_Boumort',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS = {
	nom: "Rutes Pirineus: Cap de Boumort des d'Hortoneda",
	url: 'https://www.rutespirineus.cat/rutes/cap-de-boumort-des-d-hortoneda',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'cap-de-boumort',
	descripcio: {
		ca: [
			"El Cap de Boumort és el punt més alt de la serra de Boumort, la gran serralada prepirinenca que s'estén entre la Noguera Pallaresa i l'Alt Urgell. El cim és al terme de Conca de Dalt, [al Pallars Jussà](/comarques/pallars-jussa), i és de roca calcària, margues i dolomies. Tota la serra és dins de la Reserva Nacional de Caça de Boumort, de més de 13.000 hectàrees, un dels espais amb més fauna salvatge de Catalunya.",
			"Segons Rutes Pirineus, a Boumort hi viu la població de cérvols més gran de Catalunya, una de les colònies de voltor comú més importants del país i una població de trencalòs de les més rellevants d'Europa, a més d'isards, cabirols i senglars. A la tardor, durant la brama, és fàcil sentir i veure els mascles de cérvol bramant i lluitant. Al cim hi ha una gran fita de pedres i un vèrtex geodèsic. Al mateix municipi de Conca de Dalt hi ha un altre cim essencial, [Sant Corneli](/cims/sant-corneli).",
			"La seva situació, aïllada i alta respecte del Prepirineu que l'envolta, el converteix en un mirador privilegiat. En dies clars, Rutes Pirineus hi cita les muntanyes d'Andorra, el [Pedraforca](/cims/pedraforca-pollego-superior) i el Cadí cap a l'est i el massís de la Maladeta cap a ponent.",
			"Les millors èpoques són la primavera i la tardor: a l'hivern hi sol haver neu i a l'estiu hi fa molta calor, sobretot a la part baixa de la pujada. La serra és molt extensa i amb pocs punts de referència: amb boira, l'orientació hi és complicada."
		],
		es: [
			'El Cap de Boumort es el punto más alto de la sierra de Boumort, la gran sierra prepirenaica que se extiende entre la Noguera Pallaresa y el Alt Urgell. La cima está en el término de Conca de Dalt, [en el Pallars Jussà](/comarques/pallars-jussa), y es de roca caliza, margas y dolomías. Toda la sierra está dentro de la Reserva Nacional de Caza de Boumort, de más de 13.000 hectáreas, uno de los espacios con más fauna salvaje de Cataluña.',
			'Según Rutes Pirineus, en Boumort vive la mayor población de ciervos de Cataluña, una de las colonias de buitre leonado más importantes del país y una población de quebrantahuesos de las más relevantes de Europa, además de sarrios, corzos y jabalíes. En otoño, durante la berrea, es fácil oír y ver a los machos de ciervo bramando y luchando. En la cima hay un gran hito de piedras y un vértice geodésico. En el mismo municipio de Conca de Dalt hay otra cima esencial, [Sant Corneli](/cims/sant-corneli).',
			'Su situación, aislada y alta respecto al Prepirineo que la rodea, la convierte en un mirador privilegiado. En días claros, Rutes Pirineus cita las montañas de Andorra, el [Pedraforca](/cims/pedraforca-pollego-superior) y el Cadí hacia el este y el macizo de la Maladeta hacia el oeste.',
			'Las mejores épocas son la primavera y el otoño: en invierno suele haber nieve y en verano hace mucho calor, sobre todo en la parte baja de la subida. La sierra es muy extensa y con pocos puntos de referencia: con niebla, la orientación es complicada.'
		]
	},
	rutes: [
		{
			id: 'hortoneda',
			nom: {
				ca: "Des d'Hortoneda pel refugi de Boumort",
				es: 'Desde Hortoneda por el refugio de Boumort'
			},
			sortida: { nom: 'Hortoneda (Conca de Dalt, 1.003 m)' },
			tempsMinuts: 215,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "S'arriba a Hortoneda per la carretera de Claverol, a 12 km de la Pobla de Segur. La ruta de Rutes Pirineus puja per les bordes de Manyac i de Guerra fins a la carena i el refugi de Boumort (2 h 30 min); d'allà una pista-sender porta a un petit coll herbós i als prats dels Pletius de la Creueta, i un últim tram cap al nord arriba al cim en 3 h 35 min. No hi ha passos tècnics, però Rutes Pirineus avisa que la dificultat és sobretot l'orientació i el desnivell; la seva proposta torna en circular per un altre camí.",
				es: 'Se llega a Hortoneda por la carretera de Claverol, a 12 km de La Pobla de Segur. La ruta de Rutes Pirineus sube por las bordas de Manyac y de Guerra hasta la cresta y el refugio de Boumort (2 h 30 min); desde allí una pista-sendero lleva a un pequeño collado herboso y a los prados de los Pletius de la Creueta, y un último tramo hacia el norte llega a la cima en 3 h 35 min. No hay pasos técnicos, pero Rutes Pirineus avisa de que la dificultad es sobre todo la orientación y el desnivel; su propuesta vuelve en circular por otro camino.'
			},
			fonts: [RUTES_PIRINEUS]
		}
	],
	consells: {
		ca: [
			"Porta mapa i GPS: la ruta d'Hortoneda passa per bordes en ruïnes, pistes i prats on el camí no sempre és evident.",
			"Durant la brama del cérvol, al setembre i l'octubre, mantén-te als camins i no molestis els animals. Informa't també de les activitats de caça a la reserva abans de sortir.",
			"A l'estiu surt molt d'hora i porta molta aigua: la pujada fins a la carena és llarga i calorosa.",
			"El refugi de Boumort, a la carena, pot servir d'aixopluc si el temps canvia."
		],
		es: [
			'Lleva mapa y GPS: la ruta de Hortoneda pasa por bordas en ruinas, pistas y prados donde el camino no siempre es evidente.',
			'Durante la berrea, en septiembre y octubre, mantente en los caminos y no molestes a los animales. Infórmate también de las actividades de caza en la reserva antes de salir.',
			'En verano sal muy temprano y lleva mucha agua: la subida hasta la cresta es larga y calurosa.',
			'El refugio de Boumort, en la cresta, puede servir de resguardo si el tiempo cambia.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Cap de Boumort?',
				resposta:
					"Des d'Hortoneda, Rutes Pirineus hi compta 3 h 35 min de pujada. La seva volta circular completa, amb baixada pel coll de l'Era del Comú, fa 24 km i unes 6 h 45 min de marxa efectiva."
			},
			{
				pregunta: 'El Cap de Boumort és difícil?',
				resposta:
					"No té passos tècnics: el tram final és una pista-sender i prats. La dificultat és la llargada, el desnivell i, sobretot, l'orientació en una serra molt extensa i amb pocs camins marcats."
			},
			{
				pregunta: 'Quan és millor pujar al Cap de Boumort?',
				resposta:
					"A la primavera i a la tardor. A l'hivern hi sol haver neu i a l'estiu fa molta calor. A la tardor, a més, coincideix amb la brama del cérvol, un dels grans atractius de la reserva."
			},
			{
				pregunta: 'El Cap de Boumort compta com a cim essencial?',
				resposta:
					'Sí. És el sostre de la serra de Boumort i un dels [cims essencials](/cims-essencials) del Pallars Jussà, com el veí Sant Corneli, també de Conca de Dalt. Quines proves valen per validar-lo, a la [normativa](/repte-100-cims/normativa).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Cap de Boumort?',
				resposta:
					"Desde Hortoneda, Rutes Pirineus calcula 3 h 35 min de subida. Su vuelta circular completa, con bajada por el coll de l'Era del Comú, tiene 24 km y unas 6 h 45 min de marcha efectiva."
			},
			{
				pregunta: '¿El Cap de Boumort es difícil?',
				resposta:
					'No tiene pasos técnicos: el tramo final es una pista-sendero y prados. La dificultad es la longitud, el desnivel y, sobre todo, la orientación en una sierra muy extensa y con pocos caminos marcados.'
			},
			{
				pregunta: '¿Cuándo es mejor subir al Cap de Boumort?',
				resposta:
					'En primavera y en otoño. En invierno suele haber nieve y en verano hace mucho calor. En otoño, además, coincide con la berrea del ciervo, uno de los grandes atractivos de la reserva.'
			},
			{
				pregunta: '¿El Cap de Boumort cuenta como cima esencial?',
				resposta:
					'Sí. Es el techo de la sierra de Boumort y una de las [cimas esenciales](/cims-essencials) del Pallars Jussà, como su vecina Sant Corneli, también de Conca de Dalt. Qué pruebas sirven para validarla, en la [normativa](/repte-100-cims/normativa).'
			}
		]
	},
	fonts: [VIQUIPEDIA, RUTES_PIRINEUS],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
