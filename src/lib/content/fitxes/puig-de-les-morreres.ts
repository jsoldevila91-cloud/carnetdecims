import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Puig de les Morreres',
	url: 'https://ca.wikipedia.org/wiki/Puig_de_les_Morreres',
	consultat: CONSULTAT
};

const COMA_PEDRA = {
	nom: 'Ajuntament de la Coma i la Pedra: del refugi Bages al Pedró dels Quatre Batlles, el puig de les Morreres i els Orriets',
	url: 'https://www.comapedra.cat/el-municipi/turisme/rutes/del-refugi-bages-al-pedro-dels-quatre-batlles-el-puig-de-les-morreres-i-els-orriets',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS_PEDRO = {
	nom: 'Rutes Pirineus: Pedró dels Quatre Batlles (Port del Comte)',
	url: 'https://www.rutespirineus.cat/rutes/pedro-dels-quatre-batlles-port-del-comte-solsones',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'puig-de-les-morreres',
	descripcio: {
		ca: [
			"El Puig de les Morreres és el punt més alt de la serra de Querol, un tram del massís del Port del Comte, al [Solsonès](/comarques/solsones). El cim queda entre els termes de Guixers i de la Coma i la Pedra, dins l'espai protegit de les Serres d'Odèn – Port del Comte. És un cim calcari, amb un vèrtex geodèsic i una antena que el fa fàcil de reconèixer des de la resta del massís.",
			"Al massís hi ha l'estació d'esquí del Port del Comte, i això condiciona l'excursió: es surt d'una zona d'aparcaments, remuntadors i pistes. L'Ajuntament de la Coma i la Pedra proposa sortir del refugi Bages (1.770 m), al qual s'arriba per una carretera asfaltada de 8 km des de la LV-4241b, prop del coll de Jou. En aquest itinerari, a les Morreres s'hi arriba després de passar pel Pedró dels Quatre Batlles (2.388 m), el punt més alt del massís.",
			"Des del cim, segons l'Ajuntament, es veuen Sant Llorenç de Morunys, el santuari de Lord, l'altiplà de Busa i el Solsonès; des del Pedró, els cims del Pallars, les serres de la vall del Segre, les serralades del sud i bona part del Pirineu. El [Cogul](/cims/el-cogul), a la serra de Busa, és un altre essencial del Solsonès.",
			"La ruta de l'Ajuntament només està parcialment senyalitzada, i després dels Orriets baixa fort fins a una pista d'esquí. L'excursió es fa sobretot a l'estiu i a la tardor; amb neu, Rutes Pirineus avisa del risc d'allaus de placa a la pala final del Pedró dels Quatre Batlles, per on passa l'itinerari."
		],
		es: [
			'El Puig de les Morreres es el punto más alto de la serra de Querol, un tramo del macizo del Port del Comte, en el [Solsonès](/comarques/solsones). La cima queda entre los términos de Guixers y de la Coma i la Pedra, dentro del espacio protegido de las Serres d’Odèn – Port del Comte. Es una cima caliza, con un vértice geodésico y una antena que la hace fácil de reconocer desde el resto del macizo.',
			'En el macizo está la estación de esquí del Port del Comte, y eso condiciona la excursión: se sale de una zona de aparcamientos, remontes y pistas. El Ayuntamiento de la Coma i la Pedra propone salir del refugio Bages (1.770 m), al que se llega por una carretera asfaltada de 8 km desde la LV-4241b, cerca del coll de Jou. En este itinerario, a las Morreres se llega después de pasar por el Pedró dels Quatre Batlles (2.388 m), el punto más alto del macizo.',
			'Desde la cima, según el Ayuntamiento, se ven Sant Llorenç de Morunys, el santuario de Lord, la meseta de Busa y el Solsonès; desde el Pedró, las cimas del Pallars, las sierras del valle del Segre, las cordilleras del sur y buena parte del Pirineo. El [Cogul](/cims/el-cogul), en la serra de Busa, es otra esencial del Solsonès.',
			'La ruta del Ayuntamiento solo está parcialmente señalizada, y después de los Orriets baja fuerte hasta una pista de esquí. La excursión se hace sobre todo en verano y en otoño; con nieve, Rutes Pirineus avisa del riesgo de aludes de placa en la pala final del Pedró dels Quatre Batlles, por donde pasa el itinerario.'
		]
	},
	rutes: [
		{
			id: 'refugi-bages',
			nom: {
				ca: 'Circular des del refugi Bages pel Pedró dels Quatre Batlles',
				es: 'Circular desde el refugio Bages por el Pedró dels Quatre Batlles'
			},
			sortida: { nom: 'Refugi Bages (Port del Comte, 1.770 m)' },
			distanciaKm: 14.8,
			tempsMinuts: 245,
			descripcio: {
				ca: "L'Ajuntament de la Coma i la Pedra descriu una circular de 18,3 km i unes 5 h que puja primer al Pedró dels Quatre Batlles (km 9,4; 2 h 50 min), continua fins al Puig de les Morreres (km 14,8; 4 h 5 min) i passa encara pels Orriets o Cap d'Urdiets (2.145 m) abans de baixar fort fins a una pista d'esquí i tornar al refugi per una pista forestal. Només està parcialment senyalitzada. Si surts de l'aparcament de l'Estivella – Clot de la Vall, la volta es queda en 13,6 km i estalvies 1 h 30 min.",
				es: 'El Ayuntamiento de la Coma i la Pedra describe una circular de 18,3 km y unas 5 h que sube primero al Pedró dels Quatre Batlles (km 9,4; 2 h 50 min), continúa hasta el Puig de les Morreres (km 14,8; 4 h 5 min) y pasa aún por los Orriets o Cap d’Urdiets (2.145 m) antes de bajar fuerte hasta una pista de esquí y volver al refugio por una pista forestal. Solo está parcialmente señalizada. Si sales del aparcamiento de l’Estivella – Clot de la Vall, la vuelta se queda en 13,6 km y ahorras 1 h 30 min.'
			},
			fonts: [COMA_PEDRA]
		},
		{
			id: 'estivella',
			nom: {
				ca: "Des de l'Estivella amb el Pedró dels Quatre Batlles",
				es: 'Desde l’Estivella con el Pedró dels Quatre Batlles'
			},
			sortida: { nom: 'Aparcament Estivella – Clot de la Vall (Port del Comte, 1.935 m)' },
			descripcio: {
				ca: "És la versió escurçada de la circular de l'Ajuntament: des de l'Estivella s'estalvia el tram de bosc de sota, amb més de 200 m de desnivell. Rutes Pirineus descriu el tram comú fins al Pedró dels Quatre Batlles (1 h 30 min des de l'aparcament, pel prat de l'Orri i el prat del Duc) dins d'una circular pròpia de 10,8 km i 590 m que no puja a les Morreres: el seu itinerari deixa el camí de les Morreres en un indicador i torna pel Forat de la Bòfia. Per fer el cim cal seguir, des d'allà, la ruta de l'Ajuntament.",
				es: 'Es la versión acortada de la circular del Ayuntamiento: desde l’Estivella se ahorra el tramo de bosque de abajo, con más de 200 m de desnivel. Rutes Pirineus describe el tramo común hasta el Pedró dels Quatre Batlles (1 h 30 min desde el aparcamiento, por el prat de l’Orri y el prat del Duc) dentro de una circular propia de 10,8 km y 590 m que no sube a las Morreres: su itinerario deja el camino de las Morreres en un indicador y vuelve por el Forat de la Bòfia. Para hacer la cima hay que seguir, desde allí, la ruta del Ayuntamiento.'
			},
			fonts: [COMA_PEDRA, RUTES_PIRINEUS_PEDRO]
		}
	],
	consells: {
		ca: [
			"Al refugi Bages s'hi arriba per 8 km de carretera asfaltada des de la LV-4241b, prop del coll de Jou.",
			"Si la zona del refugi Bages està plena, es pot deixar el cotxe als aparcaments de l'estació.",
			"La ruta només està parcialment senyalitzada: porta un track i no t'hi refiïs només de les marques.",
			"Pots escurçar la jornada sortint de l'Estivella – Clot de la Vall: 13,6 km en lloc de 18,3 i 1 h 30 min menys.",
			"Amb neu, la pala final del Pedró dels Quatre Batlles pot acumular plaques, segons Rutes Pirineus: mira el butlletí d'allaus abans de decidir-te."
		],
		es: [
			'Al refugio Bages se llega por 8 km de carretera asfaltada desde la LV-4241b, cerca del coll de Jou.',
			'Si la zona del refugio Bages está llena, se puede dejar el coche en los aparcamientos de la estación.',
			'La ruta solo está parcialmente señalizada: lleva un track y no te fíes solo de las marcas.',
			'Puedes acortar la jornada saliendo de l’Estivella – Clot de la Vall: 13,6 km en lugar de 18,3 y 1 h 30 min menos.',
			'Con nieve, la pala final del Pedró dels Quatre Batlles puede acumular placas, según Rutes Pirineus: mira el boletín de aludes antes de decidirte.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Puig de les Morreres?',
				resposta:
					"L'Ajuntament de la Coma i la Pedra calcula 4 h 5 min fins al cim a la circular de 18,3 km des del refugi Bages (passant abans pel Pedró dels Quatre Batlles). Sortint de l'Estivella, s'estalvia 1 h 30 min."
			},
			{
				pregunta: "On s'aparca?",
				resposta:
					"Al refugi Bages (1.770 m), a l'estació del Port del Comte, a 8 km per carretera asfaltada des de la LV-4241b; o a l'aparcament de l'Estivella – Clot de la Vall (1.935 m), segons Rutes Pirineus."
			},
			{
				pregunta: 'És una ruta senyalitzada?',
				resposta:
					"Només en part, segons l'Ajuntament. Rutes Pirineus esmenta un indicador on el camí de les Morreres se separa del que torna a l'Estivella, i l'antena del cim fa de referència. Convé portar un track."
			},
			{
				pregunta: 'El Puig de les Morreres compta com a cim essencial?',
				resposta:
					'Sí. És el més alt dels tres essencials del Solsonès i el punt més alt de la serra de Querol; el [Cogul](/cims/el-cogul) i el [Tossal de la Creu](/cims/tossal-de-la-creu) queden per sota.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Puig de les Morreres?',
				resposta:
					'El Ayuntamiento de la Coma i la Pedra calcula 4 h 5 min hasta la cima en la circular de 18,3 km desde el refugio Bages (pasando antes por el Pedró dels Quatre Batlles). Saliendo de l’Estivella, se ahorra 1 h 30 min.'
			},
			{
				pregunta: '¿Dónde se aparca?',
				resposta:
					'En el refugio Bages (1.770 m), en la estación del Port del Comte, a 8 km por carretera asfaltada desde la LV-4241b; o en el aparcamiento de l’Estivella – Clot de la Vall (1.935 m), según Rutes Pirineus.'
			},
			{
				pregunta: '¿Es una ruta señalizada?',
				resposta:
					'Solo en parte, según el Ayuntamiento. Rutes Pirineus menciona un indicador donde el camino de las Morreres se separa del que vuelve a l’Estivella, y la antena de la cima sirve de referencia. Conviene llevar un track.'
			},
			{
				pregunta: '¿El Puig de les Morreres cuenta como cima esencial?',
				resposta:
					'Sí. Es el más alto de los tres esenciales del Solsonès y el punto más alto de la serra de Querol; [el Cogul](/cims/el-cogul) y el [Tossal de la Creu](/cims/tossal-de-la-creu) quedan por debajo.'
			}
		]
	},
	fonts: [VIQUIPEDIA, COMA_PEDRA, RUTES_PIRINEUS_PEDRO],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
