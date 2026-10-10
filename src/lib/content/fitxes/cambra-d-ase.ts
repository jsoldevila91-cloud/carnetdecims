import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: "Viquipèdia: Cambra d'Ase",
	url: 'https://ca.wikipedia.org/wiki/Cambra_d%27Ase',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: pujada al Cambra d'Ase des d'Eina",
	url: 'https://dexcursio.net/cambra-dase/',
	consultat: CONSULTAT
};

const ALTITUDERANDO = {
	nom: "Altituderando: Cambre d'Aze (2750 m)",
	url: 'https://www.altituderando.com/Cambre-d-Aze-2750m',
	consultat: CONSULTAT
};

const ENGARRISTA = {
	nom: "Engarrista: Nou Fonts, Pic d'Eina, Torre d'Eina i Cambra d'Ase",
	url: 'https://www.engarrista.com/node/301',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'cambra-d-ase',
	descripcio: {
		ca: [
			"El Cambra d'Ase (Cambre d'Aze en francès) és un cim de la Catalunya Nord que es dreça on es troben els termes d'Eina, a l'Alta Cerdanya, i de Planès i Sant Pere dels Forcats, al Conflent. Forma part del Parc Natural Regional dels Pirineus Catalans i la seva cara est cau sobre la Reserva Natural de la Vall d'Eina. La part alta té tres puntes al voltant d'un antic circ glacial, que avui acull l'estació d'esquí de Cambre d'Aze. La del repte és l'oriental, la més alta i escarpada; l'occidental (2.711 m) fa de balcó sobre la Baixa Cerdanya.",
			"És un cim de carena i no de parets, però amb algun pas on cal ajudar-se de les mans. Engarrista avisa que per arribar al cim oriental cal fer una petita grimpada una mica aèria, i que venint de la Torre d'Eina hi ha un tram on cal mig desgrimpar; Altituderando hi descriu una carena curta amb alguns passos fàcils d'escalada al final. El camí de pujada és fort: Dexcursio descriu un pendent sostingut per una pista d'esquí fins al primer cim, a 2.711 m.",
			"La vista, segons Dexcursio, abasta la Cerdanya i el massís del Canigó; Engarrista destaca l'Alta Cerdanya des del cim oriental. Altituderando hi afegeix els estanys del litoral i la Mediterrània, el Pic d'Eina i la Coume Magade. També té corredors d'hivern, com el de la Vermicelle, que Altituderando tracta en una ressenya a part: són activitat d'alpinisme, no d'excursionisme.",
			"El millor és sortir amb cel estable, calçat de muntanya, almenys 1,5 litres d'aigua i un track o mapa. Per la carena s'enllaça amb la [Torre d'Eina](/cims/torre-d-eina) i el Pic d'Eina: Engarrista ho fa en una travessa de 24,1 km i 1.880 m de desnivell que acaba a Planès."
		],
		es: [
			'El Cambra d’Ase (Cambre d’Aze en francés) es una cima de Cataluña Norte que se alza donde se encuentran los términos de Eina, en la Alta Cerdaña, y de Planès y Sant Pere dels Forcats, en el Conflent. Forma parte del Parque Natural Regional de los Pirineos Catalanes y su cara este cae sobre la Reserva Natural de la Vall d’Eina. La parte alta tiene tres puntas alrededor de un antiguo circo glaciar, que hoy acoge la estación de esquí de Cambre d’Aze. La del reto es la oriental, la más alta y escarpada; la occidental (2.711 m) hace de balcón sobre la Baixa Cerdanya.',
			'Es una cima de cresta y no de paredes, pero con algún paso en el que hay que ayudarse de las manos. Engarrista avisa de que para llegar a la cima oriental hay que hacer una pequeña trepada algo aérea, y de que viniendo de la Torre d’Eina hay un tramo en el que hay que destrepar a medias; Altituderando describe una cresta corta con algunos pasos fáciles de escalada al final. La subida es fuerte: Dexcursio describe una pendiente sostenida por una pista de esquí hasta la primera cima, a 2.711 m.',
			'La vista, según Dexcursio, abarca la Cerdanya y el macizo del Canigó; Engarrista destaca la Alta Cerdanya desde la cima oriental. Altituderando añade las lagunas del litoral y el Mediterráneo, el Pic d’Eina y la Coume Magade. También tiene corredores de invierno, como el de la Vermicelle, que Altituderando trata en una reseña aparte: son actividad de alpinismo, no de excursionismo.',
			'Lo mejor es salir con cielo estable, calzado de montaña, al menos 1,5 litros de agua y un track o mapa. Por la cresta se enlaza con la [Torre d’Eina](/cims/torre-d-eina) y el Pic d’Eina: Engarrista lo hace en una travesía de 24,1 km y 1.880 m de desnivel que termina en Planès.'
		]
	},
	rutes: [
		{
			id: 'estacio-d-esqui',
			nom: {
				ca: "Des de l'estació d'esquí de Cambre d'Aze (Eina)",
				es: "Desde la estación de esquí de Cambre d'Aze (Eina)"
			},
			sortida: { nom: "Aparcament superior de l'estació Cambre d'Aze (Eina, ≈ 1.810 m)" },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Dexcursio proposa una circular de 6 km, 5 h 24 min i 1.007 m de desnivell, dificultat alta. Surt de l'aparcament superior per una pista ampla i enfila directament una pista d'esquí fins al primer cim (2.711 m); d'allà una carena evident i aèria porta al cim principal (2.750 m). Es baixa pel vessant oposat per una gran tartera, seguint fites, amb terreny rocós i inestable on Dexcursio demana molta precaució, i després en ziga-zaga pel bosc fins a una àrea de pícnic i la pista de tornada.",
				es: 'Dexcursio propone una circular de 6 km, 5 h 24 min y 1.007 m de desnivel, dificultad alta. Sale del aparcamiento superior por una pista ancha y encara directamente una pista de esquí hasta la primera cima (2.711 m); desde allí una cresta evidente y aérea lleva a la cima principal (2.750 m). Se baja por la ladera opuesta por una gran pedrera, siguiendo hitos, con terreno rocoso e inestable donde Dexcursio pide mucha precaución, y luego en zigzag por el bosque hasta un área de pícnic y la pista de vuelta.'
			},
			fonts: [DEXCURSIO, ENGARRISTA]
		},
		{
			id: 'sant-pere-dels-forcats',
			nom: {
				ca: 'Des de Sant Pere dels Forcats',
				es: 'Desde Sant Pere dels Forcats'
			},
			sortida: { nom: 'Estació repetidora de Sant Pere dels Forcats (≈ 1.835 m)' },
			desnivellPositiuM: 950,
			distanciaKm: 4.5,
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Altituderando la dona com a ruta de dificultat mitjana, de 9 km anada i tornada pel mateix camí i 950 m de desnivell, en unes 5 h calculades a 300 m/h de pujada i 450 m/h de baixada. Surt del repetidor de Sant Pere dels Forcats (1.835 m) i va per bosc de coníferes, rododendres i pastures fins a un circ rocós. El camí de dalt és poc marcat i es guia amb fites; la ressenya aconsella evitar la canal de pedra i guanyar la carena per l'esquerra. Als últims metres hi ha alguns passos fàcils d'escalada.",
				es: 'Altituderando la da como ruta de dificultad media, de 9 km ida y vuelta por el mismo camino y 950 m de desnivel, en unas 5 h calculadas a 300 m/h de subida y 450 m/h de bajada. Sale del repetidor de Sant Pere dels Forcats (1.835 m) y va por bosque de coníferas, rododendros y pastos hasta un circo rocoso. El camino de arriba está poco marcado y se guía con hitos; la reseña aconseja evitar la canal de piedra y ganar la cresta por la izquierda. En los últimos metros hay algunos pasos fáciles de escalada.'
			},
			fonts: [ALTITUDERANDO]
		}
	],
	consells: {
		ca: [
			"Porta botes de muntanya altes, bastons, mapa o track i almenys 1,5 litres d'aigua, com recomana Dexcursio.",
			'A la baixada per la gran tartera, el terreny és inestable i només hi ha fites: baixa amb calma i sense empènyer pedres.',
			"Des de Sant Pere dels Forcats, Altituderando proposa evitar la canal de pedra que puja a la carena i guanyar-la per l'esquerra.",
			"Els corredors de la cara nord són d'alpinisme d'hivern: no els facis servir de ruta excursionista.",
			"Els lectors d'Altituderando hi donen temps reals molt diferents, de 3 h 30 min-4 h fins a 10 h per a una parella gran: planifica amb marge."
		],
		es: [
			'Lleva botas de montaña altas, bastones, mapa o track y al menos 1,5 litros de agua, como recomienda Dexcursio.',
			'En la bajada por la gran pedrera, el terreno es inestable y solo hay hitos: baja con calma y sin empujar piedras.',
			'Desde Sant Pere dels Forcats, Altituderando propone evitar la canal de piedra que sube a la cresta y ganarla por la izquierda.',
			'Los corredores de la cara norte son de alpinismo de invierno: no los uses como ruta excursionista.',
			'Los lectores de Altituderando dan tiempos reales muy distintos, de 3 h 30 min-4 h hasta 10 h para una pareja mayor: planifica con margen.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Quant es triga a pujar al Cambra d'Ase?",
				resposta:
					"Dexcursio calcula 5 h 24 min per a la circular de 6 km i 1.007 m de desnivell des de l'estació d'esquí d'Eina. Altituderando, unes 5 h per a 9 km i 950 m des de Sant Pere dels Forcats."
			},
			{
				pregunta: 'És un cim difícil?',
				resposta:
					'Dexcursio el qualifica de difícil; Altituderando, de moderat. Hi ha una carena aèria, alguns passos de grimpada fàcil als últims metres i una baixada per tartera inestable.'
			},
			{
				pregunta: "Quin dels cims del Cambra d'Ase és el del repte?",
				resposta:
					"L'oriental, de 2.750 m, el més alt i escarpat, on Altituderando situa una creu. L'occidental, de 2.711 m, és el primer que es trepitja si es puja per la pista d'esquí des d'Eina, i d'allà una carena aèria porta a l'oriental."
			},
			{
				pregunta: "El Cambra d'Ase compta com a cim essencial?",
				resposta:
					"Sí, és un dels essencials de la [Catalunya Nord](/comarques/catalunya-nord), i comparteix carena amb la [Torre d'Eina](/cims/torre-d-eina), un altre essencial: Engarrista els encadena en una mateixa travessa."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Cambra d’Ase?',
				resposta:
					'Dexcursio calcula 5 h 24 min para la circular de 6 km y 1.007 m de desnivel desde la estación de esquí de Eina. Altituderando, unas 5 h para 9 km y 950 m desde Sant Pere dels Forcats.'
			},
			{
				pregunta: '¿Es una cima difícil?',
				resposta:
					'Dexcursio la califica de difícil; Altituderando, de moderada. Hay una cresta aérea, algunos pasos de trepada fácil en los últimos metros y una bajada por pedrera inestable.'
			},
			{
				pregunta: '¿Cuál de las cimas del Cambra d’Ase es la del reto?',
				resposta:
					'La oriental, de 2.750 m, la más alta y escarpada, donde Altituderando sitúa una cruz. La occidental, de 2.711 m, es la primera que se pisa si se sube por la pista de esquí desde Eina, y desde allí una cresta aérea lleva a la oriental.'
			},
			{
				pregunta: '¿El Cambra d’Ase cuenta como cima esencial?',
				resposta:
					'Sí, es una de las esenciales de [Catalunya Nord](/comarques/catalunya-nord), y comparte cresta con la [Torre d’Eina](/cims/torre-d-eina), otra esencial: Engarrista las encadena en una misma travesía.'
			}
		]
	},
	fonts: [VIQUIPEDIA, DEXCURSIO, ALTITUDERANDO, ENGARRISTA],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
