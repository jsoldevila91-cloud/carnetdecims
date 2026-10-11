import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: "Viquipèdia: La Mola (Bonastre), amb els itineraris senyalitzats de l'Ajuntament de Bonastre i del Club Excursionista Salouenc",
	url: 'https://ca.wikipedia.org/wiki/La_Mola_(Bonastre)',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: La Mola',
	url: 'https://reptesmuntanyencs.cat/la-mola/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'la-mola-tarragones',
	descripcio: {
		ca: [
			"La Mola és el cim més alt [del Tarragonès](/comarques/tarragones), tot i que amb prou feines passa dels tres-cents metres. És al límit amb el Baix Penedès, a la divisòria dels termes de la Pobla de Montornès i Creixell, d'una banda, i de Bonastre, de l'altra. És un turó calcari i dolomític amb un vèrtex geodèsic al capdamunt.",
			'És un cim modest i de proximitat, a pocs quilòmetres de la costa, al qual es puja des de tots els pobles del voltant: hi ha itineraris senyalitzats des de Bonastre, la Pobla de Montornès, Creixell, Roda de Berà i el castell de Montornès. El GR 92, el sender del Mediterrani, passa pel peu.',
			"Els camins del vessant de la Pobla travessen un paisatge de pedra seca, amb un bon grapat de barraques, un pou —el de Missenguet— i una antiga mina, la de can Gibert. El cim mateix no ofereix vistes; la panoràmica s'obté des d'un mirador natural que hi ha uns metres abans d'arribar-hi.",
			"És una sortida de mig matí. Al Baix Penedès, a tocar, l'altre cim essencial és la [Talaia del Montmell](/cims/talaia-del-montmell)."
		],
		es: [
			'La Mola es la cima más alta [del Tarragonès](/comarques/tarragones), aunque apenas pasa de los trescientos metros. Está en el límite con el Baix Penedès, en la divisoria de los términos de la Pobla de Montornès y Creixell, por un lado, y de Bonastre, por el otro. Es un cerro calizo y dolomítico con un vértice geodésico en lo alto.',
			'Es una cima modesta y de proximidad, a pocos kilómetros de la costa, a la que se sube desde todos los pueblos de alrededor: hay itinerarios señalizados desde Bonastre, la Pobla de Montornès, Creixell, Roda de Berà y el castillo de Montornès. El GR 92, el sendero del Mediterráneo, pasa por el pie.',
			'Los caminos de la vertiente de la Pobla cruzan un paisaje de piedra seca, con un buen puñado de barracas, un pozo —el de Missenguet— y una antigua mina, la de can Gibert. La cima misma no ofrece vistas; la panorámica se obtiene desde un mirador natural que hay unos metros antes de llegar.',
			'Es una salida de media mañana. En el Baix Penedès, al lado, la otra cima esencial es la [Talaia del Montmell](/cims/talaia-del-montmell).'
		]
	},
	rutes: [
		{
			id: 'bonastre',
			nom: {
				ca: 'Des de Bonastre per la ruta blava',
				es: 'Desde Bonastre por la ruta azul'
			},
			sortida: { nom: 'Plaça Major de Bonastre' },
			distanciaKm: 3.4,
			descripcio: {
				ca: "És l'itinerari senyalitzat per l'Ajuntament de Bonastre, de 3,4 km fins al cim: surt de la plaça Major, segueix el torrent de l'Aguilera i l'obaga del Maià, enllaça amb la ruta del Bonastresc i puja pel Mallol fins a la Mola.",
				es: "Es el itinerario señalizado por el Ayuntamiento de Bonastre, de 3,4 km hasta la cima: sale de la plaza Mayor, sigue el torrent de l'Aguilera y la obaga del Maià, enlaza con la ruta del Bonastresc y sube por el Mallol hasta la Mola."
			},
			fonts: [VIQUIPEDIA]
		},
		{
			id: 'la-pobla-de-montornes',
			nom: {
				ca: 'Des de la Pobla de Montornès pel mas Gibert',
				es: 'Desde la Pobla de Montornès por el mas Gibert'
			},
			sortida: { nom: 'La Pobla de Montornès' },
			descripcio: {
				ca: "És la pujada més coneguda, de 4,8 km: se surt en direcció al castell de Montornès, es pren el GR 92 i es passa pel mas Mercader, el mas Gibert i el pou de Missenguet. El bloc Reptes Muntanyencs en va fer el tram final, des de la pista del mas Gibert, amb una volta de 6,5 km i 224 m de desnivell positiu en 1 h 27 min de marxa i el cim a 2,3 km; fins allà, però, hi ha un quilòmetre i mig de pista en molt mal estat, només per a tot terreny. La pujada no té dificultats; l'únic punt delicat és un pal indicador, passat el trencall de la mina de can Gibert, que no assenyala la Mola: cal deixar la pista i girar a la dreta.",
				es: 'Es la subida más conocida, de 4,8 km: se sale en dirección al castillo de Montornès, se toma el GR 92 y se pasa por el mas Mercader, el mas Gibert y el pou de Missenguet. El blog Reptes Muntanyencs hizo el tramo final, desde la pista del mas Gibert, con una vuelta de 6,5 km y 224 m de desnivel positivo en 1 h 27 min de marcha y la cima a 2,3 km; hasta allí, sin embargo, hay un kilómetro y medio de pista en muy mal estado, solo para todoterreno. La subida no tiene dificultades; el único punto delicado es un poste indicador, pasado el desvío de la mina de can Gibert, que no señala la Mola: hay que dejar la pista y girar a la derecha.'
			},
			fonts: [VIQUIPEDIA, REPTES]
		}
	],
	consells: {
		ca: [
			'No pugis amb un turisme per la pista del mas Gibert: surt a peu de la Pobla o de Bonastre.',
			'Els pals indicadors ajuden, però no tots porten el nom de la Mola; porta un mapa o el track.',
			'No hi ha fonts al camí.',
			"Les barraques de pedra seca són patrimoni: mira-les sense enfilar-t'hi ni moure'n pedres."
		],
		es: [
			'No subas con un turismo por la pista del mas Gibert: sal a pie de la Pobla o de Bonastre.',
			'Los postes indicadores ayudan, pero no todos llevan el nombre de la Mola; lleva un mapa o el track.',
			'No hay fuentes en el camino.',
			'Las barracas de piedra seca son patrimonio: míralas sin subirte a ellas ni mover piedras.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: "Des d'on es puja a la Mola?",
				resposta:
					'Des de Bonastre hi ha un itinerari senyalitzat de 3,4 km, i des de la Pobla de Montornès un altre de 4,8 km pel GR 92 i el mas Gibert. També hi ha camins marcats des de Creixell (8,1 km), Roda de Berà (8,6 km) i el castell de Montornès (3,5 km).'
			},
			{
				pregunta: 'Quant es triga?',
				resposta:
					'El bloc Reptes Muntanyencs va fer en 52 minuts, aturades incloses, els 2,3 km finals des del mas Gibert, i en 1 h 27 min de marxa una volta de 6,5 km. Des de Bonastre són 3,4 km de pujada.'
			},
			{
				pregunta: 'Hi ha vistes des del cim?',
				resposta:
					"Des del vèrtex, no gaires. Uns metres abans d'arribar-hi, venint del pou de Missenguet, hi ha un mirador natural amb bona panoràmica."
			},
			{
				pregunta: 'Compta com a cim essencial?',
				resposta:
					"Sí, és l'únic [cim essencial](/cims-essencials) del Tarragonès i el sostre de la comarca."
			}
		],
		es: [
			{
				pregunta: '¿Desde dónde se sube a la Mola?',
				resposta:
					'Desde Bonastre hay un itinerario señalizado de 3,4 km, y desde la Pobla de Montornès otro de 4,8 km por el GR 92 y el mas Gibert. También hay caminos marcados desde Creixell (8,1 km), Roda de Berà (8,6 km) y el castillo de Montornès (3,5 km).'
			},
			{
				pregunta: '¿Cuánto se tarda?',
				resposta:
					'El blog Reptes Muntanyencs hizo en 52 minutos, paradas incluidas, los 2,3 km finales desde el mas Gibert, y en 1 h 27 min de marcha una vuelta de 6,5 km. Desde Bonastre son 3,4 km de subida.'
			},
			{
				pregunta: '¿Hay vistas desde la cima?',
				resposta:
					'Desde el vértice, no muchas. Unos metros antes de llegar, viniendo del pou de Missenguet, hay un mirador natural con buena panorámica.'
			},
			{
				pregunta: '¿Cuenta como cima esencial?',
				resposta:
					'Sí, es la única [cima esencial](/cims-essencials) del Tarragonès y el techo de la comarca.'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
