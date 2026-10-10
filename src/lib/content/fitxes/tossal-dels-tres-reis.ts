import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Tossal del Rei (Tossal dels Tres Reis)',
	url: 'https://ca.wikipedia.org/wiki/Tossal_dels_Tres_Reis',
	consultat: CONSULTAT
};

const VIQUIPEDIA_PARC = {
	nom: 'Viquipèdia: Parc Natural dels Ports',
	url: 'https://ca.wikipedia.org/wiki/Parc_Natural_dels_Ports',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Tossal dels Tres Reis',
	url: 'https://reptesmuntanyencs.cat/tossal-del-rei/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tossal-dels-tres-reis',
	descripcio: {
		ca: [
			"El Tossal dels Tres Reis, també anomenat Tossal del Rei, és a la part meridional del massís dels Ports, al [Montsià](/comarques/montsia), al límit amb l'Aragó i el País Valencià. La Viquipèdia en situa el cim al trifini de Catalunya, el País Valencià i Aragó, prop del punt més occidental de Catalunya, al terme de la Sénia; hi termegen la Sénia (Montsià), la Pobla de Benifassà, amb part del terme de Fredes, i Vall-de-roures (Matarranya). Forma part dels Ports de Tortosa-Beseit, dins el Parc Natural dels Ports, i la roca és calcària i marga.",
			"El nom ve del lloc: el cim marca el punt de trobada dels tres antics regnes de la Corona d'Aragó, que una fita de pedres simbolitza. Reptes Muntanyencs hi afegeix un cartell de ferro amb banderes metàl·liques que assenyala la partició dels tres territoris. La Viquipèdia descriu la ruta des de Fredes, pel coll dels Tombadors i l'ermita de Sant Miquel d'Espinalva, fins al cim.",
			"El parc dels Ports es va declarar el 12 de juny del 2001 i abasta unes 35.050 ha. Les roques carbonatades hi donen gorges, coves i surgències, i el punt més alt és el [Caro](/cims/caro), de 1.441 m, mentre que el [Tossal d'Engrilló](/cims/tossal-d-engrillo) és un altre cim del repte al mateix parc.",
			"El bloc Reptes Muntanyencs no hi va poder parlar de vistes: el dia no el va deixar gaudir-ne. En canvi, el qualifica de «itinerari molt més feréstec i aventurer» que d'altres del repte i hi recomana tenir experiència en seguir vells camins. Una part del recorregut és fora de camí, i la senyalització és escassa."
		],
		es: [
			'El Tossal dels Tres Reis, también llamado Tossal del Rei, está en la parte meridional del macizo de los Ports, en el [Montsià](/comarques/montsia), en el límite con Aragón y el País Valenciano. La Viquipèdia sitúa la cima en el trifinio de Catalunya, el País Valenciano y Aragón, cerca del punto más occidental de Catalunya, en el término de la Sénia; lindan allí la Sénia (Montsià), la Pobla de Benifassà, con parte del término de Fredes, y Vall-de-roures (Matarranya). Forma parte de los Ports de Tortosa-Beseit, dentro del Parc Natural dels Ports, y la roca es caliza y marga.',
			"El nombre viene del lugar: la cima marca el punto de encuentro de los tres antiguos reinos de la Corona de Aragón, que un hito de piedras simboliza. Reptes Muntanyencs añade un cartel de hierro con banderas metálicas que señala la partición de los tres territorios. La Viquipèdia describe la ruta desde Fredes, por el coll dels Tombadors y la ermita de Sant Miquel d'Espinalva, hasta la cima.",
			"El parque de los Ports se declaró el 12 de junio de 2001 y abarca unas 35.050 ha. Las rocas carbonatadas dan allí gargantas, cuevas y surgencias, y el punto más alto es el [Caro](/cims/caro), de 1.441 m, mientras que el [Tossal d'Engrilló](/cims/tossal-d-engrillo) es otra cima del reto en el mismo parque.",
			'El blog Reptes Muntanyencs no pudo hablar de vistas: el día no le dejó disfrutarlas. En cambio, lo califica de «itinerario mucho más fragoso y aventurero» que otros del reto y recomienda tener experiencia en seguir viejos caminos. Una parte del recorrido es fuera de camino, y la señalización es escasa.'
		]
	},
	rutes: [
		{
			id: 'fredes',
			nom: {
				ca: 'Circular des de Fredes pel coll dels Tombadors',
				es: 'Circular desde Fredes por el coll dels Tombadors'
			},
			sortida: { nom: 'Fredes (la Pobla de Benifassà, País Valencià)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "La Viquipèdia indica la ruta des de Fredes pel coll dels Tombadors i l'ermita de Sant Miquel d'Espinalva fins al cim. Reptes Muntanyencs documenta una circular des de Fredes: 13,8 km, uns 719 m de desnivell positiu i 3 h 34 min de marxa efectiva; segons el seu track, el cim queda a 1 h 15 min i uns 4,2 km de la sortida. El terreny és «pistes i sense camí» i la senyalització, parcial: «durant el recorregut no trobarem gaire senyalització, així que s'haurà d'anar vigilant».",
				es: "La Viquipèdia indica la ruta desde Fredes por el coll dels Tombadors y la ermita de Sant Miquel d'Espinalva hasta la cima. Reptes Muntanyencs documenta una circular desde Fredes: 13,8 km, unos 719 m de desnivel positivo y 3 h 34 min de marcha efectiva; según su track, la cima queda a 1 h 15 min y unos 4,2 km de la salida. El terreno es «pistas y sin camino» y la señalización, parcial: «durante el recorrido no encontraremos mucha señalización, así que habrá que ir vigilando»."
			},
			fonts: [VIQUIPEDIA, REPTES]
		}
	],
	consells: {
		ca: [
			'El bloc indica que no hi ha gaire senyalització i que cal tenir experiència en seguir vells camins: porta el track i un mapa.',
			"Un tram és «sense camí»: no t'hi aventuris amb boira o amb poca visibilitat.",
			"El punt de sortida documentat, Fredes, és al País Valencià; planifica l'aproximació amb temps.",
			"El cim marca el trifini de tres territoris: respecta la fita i el cartell que l'assenyalen.",
			"Telèfon d'emergències: 112."
		],
		es: [
			'El blog indica que no hay mucha señalización y que hay que tener experiencia en seguir viejos caminos: lleva el track y un mapa.',
			'Un tramo es «sin camino»: no te aventures con niebla o con poca visibilidad.',
			'El punto de salida documentado, Fredes, está en el País Valenciano; planifica la aproximación con tiempo.',
			'La cima marca el trifinio de tres territorios: respeta el hito y el cartel que lo señalan.',
			'Teléfono de emergencias: 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Tossal dels Tres Reis?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 13,8 km des de Fredes amb 3 h 34 min de marxa efectiva; segons el seu track, el cim queda a 1 h 15 min de la sortida.'
			},
			{
				pregunta: 'Per què es diu dels Tres Reis?',
				resposta:
					"Perquè al cim es troben tres territoris, els tres antics regnes de la Corona d'Aragó, que simbolitza una fita de pedres."
			},
			{
				pregunta: 'És una ruta fàcil?',
				resposta:
					'El bloc la defineix com un itinerari feréstec i aventurer, amb tram fora de camí, i demana experiència en seguir vells camins.'
			},
			{
				pregunta: 'El Tossal dels Tres Reis compta com a cim essencial?',
				resposta:
					'Sí, és el [cim essencial](/cims-essencials) del Montsià, amb la [Torreta de Montsià](/cims/torreta-de-montsia).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Tossal dels Tres Reis?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 13,8 km desde Fredes con 3 h 34 min de marcha efectiva; según su track, la cima queda a 1 h 15 min de la salida.'
			},
			{
				pregunta: '¿Por qué se llama dels Tres Reis?',
				resposta:
					'Porque en la cima se encuentran tres territorios, los tres antiguos reinos de la Corona de Aragón, que simboliza un hito de piedras.'
			},
			{
				pregunta: '¿Es una ruta fácil?',
				resposta:
					'El blog la define como un itinerario fragoso y aventurero, con un tramo fuera de camino, y pide experiencia en seguir viejos caminos.'
			},
			{
				pregunta: '¿El Tossal dels Tres Reis cuenta como cima esencial?',
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) del Montsià, con la [Torreta de Montsià](/cims/torreta-de-montsia).'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_PARC, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
