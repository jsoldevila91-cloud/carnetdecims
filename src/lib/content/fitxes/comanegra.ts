import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Comanegra',
	url: 'https://ca.wikipedia.org/wiki/Comanegra',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: Comanegra des de Beget",
	url: 'https://dexcursio.net/comanegra_beget/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'comanegra',
	descripcio: {
		ca: [
			"El Comanegra és el sostre de la [Garrotxa](/comarques/garrotxa). El cim és de Montagut i Oix, a l'Alta Garrotxa, i fa de trifini: segons la Viquipèdia, hi conflueixen aquest terme, el de Camprodon, al Ripollès, i el de la Menera, al Vallespir. Més al sud, dins de la mateixa Alta Garrotxa, hi ha [el Puig Ou](/cims/puig-ou) i [el Bassegoda](/cims/bassegoda).",
			'Té una curiositat geogràfica que pocs cims poden dir: la Viquipèdia el recull com el punt més meridional de la França continental. La ratlla de frontera puja fins aquí des del coll de Malrem i, a la carena, una tanca per al bestiar la fa ben visible.',
			"Al cim hi ha un vèrtex geodèsic i una torre de vigilància. D'excursió per Catalunya hi descriu una vista de 360 graus sobre el Pirineu, el Canigó, el golf de Roses i les valls de la Garrotxa. Pel camí, la pujada des de Beget travessa un bosc humit i ombrívol i una fageda que, segons el mateix web, a la primavera és el millor del recorregut.",
			"És una sortida de tot el dia i de molt desnivell. A l'hivern, la part alta pot tenir neu i glaç, i la baixada per la bassa de Monars, poc marcada al principi, es complica amb boira."
		],
		es: [
			'El Comanegra es el techo de la [Garrotxa](/comarques/garrotxa). La cima es de Montagut i Oix, en la Alta Garrotxa, y hace de trifinio: según la Viquipèdia, allí confluyen ese término, el de Camprodon, en el Ripollès, y el de la Menera, en el Vallespir. Más al sur, dentro de la misma Alta Garrotxa, están [el Puig Ou](/cims/puig-ou) y [el Bassegoda](/cims/bassegoda).',
			'Tiene una curiosidad geográfica que pocas cimas pueden contar: la Viquipèdia lo recoge como el punto más meridional de la Francia continental. La raya de frontera sube hasta aquí desde el coll de Malrem y, en la cresta, una cerca para el ganado la hace bien visible.',
			"En la cima hay un vértice geodésico y una torre de vigilancia. D'excursió per Catalunya describe una vista de 360 grados sobre el Pirineo, el Canigó, el golfo de Roses y los valles de la Garrotxa. Por el camino, la subida desde Beget atraviesa un bosque húmedo y sombrío y un hayedo que, según la misma web, en primavera es lo mejor del recorrido.",
			'Es una salida de todo el día y de mucho desnivel. En invierno, la parte alta puede tener nieve y hielo, y la bajada por la bassa de Monars, poco marcada al principio, se complica con niebla.'
		]
	},
	rutes: [
		{
			id: 'beget',
			nom: {
				ca: 'Circular des de Beget pel coll de Malrem i la bassa de Monars',
				es: 'Circular desde Beget por el coll de Malrem y la bassa de Monars'
			},
			sortida: { nom: "Aparcament de l'entrada de Beget (Camprodon)" },
			descripcio: {
				ca: "D'excursió per Catalunya descriu una circular de 18,6 km, +1.415 m i 6 h 30 min, que valora de difícil. Es travessa Beget i, després de l'última casa, un sender de marques grogues s'enfila pel bosc fins a l'oratori de Sant Antoni de Can França, a una hora, i continua fins al coll de Malrem (1.189 m). Allà gira a la dreta, seguint la tanca de la frontera, i guanya la serra Llarga de Monars, una carena aèria que acaba amb una rampa dura fins al cim. La baixada busca la bassa de Monars, cau de dret fins a les ruïnes del mas de la Figuera i torna per pista.",
				es: "D'excursió per Catalunya describe una circular de 18,6 km, +1.415 m y 6 h 30 min, que valora de difícil. Se cruza Beget y, tras la última casa, un sendero de marcas amarillas se encarama por el bosque hasta el oratorio de Sant Antoni de Can França, a una hora, y continúa hasta el coll de Malrem (1.189 m). Allí gira a la derecha, siguiendo la cerca de la frontera, y gana la serra Llarga de Monars, una cresta aérea que acaba con una rampa dura hasta la cima. La bajada busca la bassa de Monars, cae en picado hasta las ruinas del mas de la Figuera y vuelve por pista."
			},
			fonts: [DEXCURSIO]
		}
	],
	consells: {
		ca: [
			'Del cim a la bassa de Monars el camí no és gaire definit: cal anar buscant fites i alguna marca groga, amb la bassa com a referència. Amb boira, val més tornar pel camí de pujada.',
			"La baixada de la bassa cap al mas de la Figuera és molt dreta: D'excursió per Catalunya recomana pals, tant per a les pujades fortes com per protegir els genolls.",
			"Porta dos litres d'aigua com a mínim, que és el que aconsella la ressenya.",
			"A la pista de tornada, passada una última pujada, surt una drecera a la dreta en un revolt molt tancat a l'esquerra: estalvia el tram final de carretera fins a Beget.",
			'La pista de tornada encara reserva una pujada al final: no ho donis tot a la baixada.'
		],
		es: [
			'De la cima a la bassa de Monars el camino no está muy definido: hay que ir buscando hitos y alguna marca amarilla, con la balsa como referencia. Con niebla, es mejor volver por el camino de subida.',
			"La bajada de la balsa hacia el mas de la Figuera es muy empinada: D'excursió per Catalunya recomienda bastones, tanto para las subidas fuertes como para proteger las rodillas.",
			'Lleva dos litros de agua como mínimo, que es lo que aconseja la reseña.',
			'En la pista de vuelta, pasada una última subida, sale un atajo a la derecha en una curva muy cerrada a la izquierda: ahorra el tramo final de carretera hasta Beget.',
			'La pista de vuelta aún reserva una subida al final: no lo des todo en la bajada.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Comanegra des de Beget?',
				resposta:
					"D'excursió per Catalunya compta 6 h 30 min per a tota la circular, de 18,6 km i +1.415 m. De Beget a l'oratori de Sant Antoni de Can França hi ha, segons la mateixa ressenya, una hora de pujada constant."
			},
			{
				pregunta: 'El Comanegra és el cim més alt de la Garrotxa?',
				resposta:
					'Sí. La Viquipèdia el descriu com la muntanya més alta de la comarca i, alhora, com el punt més meridional de la França continental.'
			},
			{
				pregunta: 'És una ruta difícil?',
				resposta:
					"És llarga i dura: D'excursió per Catalunya la valora de difícil pel desnivell i avisa que la carena és aèria i que el primer tram de la baixada és poc definit. No hi descriu passos de grimpada."
			},
			{
				pregunta: 'Hi ha cap altra manera de pujar-hi?',
				resposta:
					"El camí de Beget creua, a Sant Antoni de Can França, una pista forestal que ve de Rocabruna, i el mateix web té una altra ressenya des d'aquest poble. Aquí només detallem la de Beget."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Comanegra desde Beget?',
				resposta:
					"D'excursió per Catalunya cuenta 6 h 30 min para toda la circular, de 18,6 km y +1.415 m. De Beget al oratorio de Sant Antoni de Can França hay, según la misma reseña, una hora de subida constante."
			},
			{
				pregunta: '¿El Comanegra es la cima más alta de la Garrotxa?',
				resposta:
					'Sí. La Viquipèdia lo describe como la montaña más alta de la comarca y, a la vez, como el punto más meridional de la Francia continental.'
			},
			{
				pregunta: '¿Es una ruta difícil?',
				resposta:
					"Es larga y dura: D'excursió per Catalunya la valora de difícil por el desnivel y avisa de que la cresta es aérea y de que el primer tramo de la bajada está poco definido. No describe pasos de trepada."
			},
			{
				pregunta: '¿Hay alguna otra forma de subir?',
				resposta:
					'El camino de Beget cruza, en Sant Antoni de Can França, una pista forestal que viene de Rocabruna, y la misma web tiene otra reseña desde ese pueblo. Aquí solo detallamos la de Beget.'
			}
		]
	},
	fonts: [VIQUIPEDIA, DEXCURSIO],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
