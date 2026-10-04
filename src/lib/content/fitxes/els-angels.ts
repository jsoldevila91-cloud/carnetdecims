import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Santuari dels Àngels',
	url: 'https://ca.wikipedia.org/wiki/Santuari_dels_%C3%80ngels',
	consultat: CONSULTAT
};

const AJ_SANT_MARTI_VELL_RUTA = {
	nom: 'Ajuntament de Sant Martí Vell: ruta de pujada al santuari dels Àngels des de Sant Martí Vell',
	url: 'https://santmartivell.cat/coneix/planols-i-rutes/ruta-pujada-al-santuari-dels-angels-des-de-sant-marti-vell/',
	consultat: CONSULTAT
};

const AJ_SANT_MARTI_VELL_MIRADOR = {
	nom: 'Ajuntament de Sant Martí Vell: els Àngels, mirador de les Gavarres',
	url: 'https://santmartivell.cat/parentpage/els-angels-mirador-de-les-gavarres-emporda/',
	consultat: CONSULTAT
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: santuari dels Àngels des de Sant Daniel",
	url: 'https://dexcursio.net/santuari-dels-angels/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'els-angels',
	descripcio: {
		ca: [
			"Els Àngels és el nom amb què tothom coneix el Puig Alt, el cim on s'alça el santuari de la Mare de Déu dels Àngels, al massís de les Gavarres. És dins el terme de Sant Martí Vell, [al Gironès](/comarques/girones), molt a prop del límit amb el Baix Empordà, i s'hi arriba per la carretera de Girona a Madremanya, molt freqüentada per ciclistes. A diferència de molts cims, aquí trobaràs un edifici gran, una hostatgeria amb restaurant i una zona de pícnic enjardinada.",
			"El santuari té més de sis segles d'història. La llicència per construir-hi una capella es va donar el 1409 i la primera obra es va acabar cap al 1423. Va ser saquejat el 1710, durant la guerra de Successió, i reconstruït el 1735; el 1809, amb la guerra del Francès, va tornar a quedar destruït, i es va refer a partir del 1814. La imatge actual de la Mare de Déu és del 1943. El 8 d'agost de 1958 Salvador Dalí i Gala s'hi van casar en una cerimònia íntima, un fet que encara atreu visitants. La festa del santuari és el 2 d'agost, i molts pobles de l'entorn hi tenen el seu aplec o hi pugen en pelegrinatge.",
			"El nom de mirador de les Gavarres li escau: des del pla dels Àngels es veu la plana de Girona, l'Alt i el Baix Empordà, la Selva i, en dies clars, el Pirineu i el Montseny. Al nord-oest, a la mateixa serra, hi ha el [castell de Sant Miquel](/cims/castell-de-sant-miquel), l'altre cim essencial de la comarca, i és habitual encadenar-los en una sola sortida.",
			"Es pot pujar en qualsevol època de l'any. A l'estiu els camins de les Gavarres són calorosos i és millor anar-hi a primera hora; a la tardor, la castanyeda que es travessa des de Sant Martí Vell és un dels trams més agradables. Al voltant del 2 d'agost i els caps de setmana hi ha força gent."
		],
		es: [
			'Els Àngels es el nombre con el que todo el mundo conoce el Puig Alt, la cima en la que se alza el santuario de la Mare de Déu dels Àngels, en el macizo de les Gavarres. Está en el municipio de Sant Martí Vell, [en el Gironès](/comarques/girones), muy cerca del límite con el Baix Empordà, y se llega por la carretera de Girona a Madremanya, muy frecuentada por ciclistas. A diferencia de muchas cimas, aquí encontrarás un gran edificio, una hospedería con restaurante y una zona de pícnic ajardinada.',
			'El santuario tiene más de seis siglos de historia. La licencia para construir una capilla se concedió en 1409 y la primera obra se terminó hacia 1423. Fue saqueado en 1710, durante la guerra de Sucesión, y reconstruido en 1735; en 1809, con la guerra de la Independencia, volvió a quedar destruido, y se rehízo a partir de 1814. La imagen actual de la Virgen es de 1943. El 8 de agosto de 1958 Salvador Dalí y Gala se casaron aquí en una ceremonia íntima, un hecho que aún atrae visitantes. La fiesta del santuario es el 2 de agosto, y muchos pueblos del entorno celebran allí su aplec o suben en peregrinación.',
			'El nombre de mirador de las Gavarres le va bien: desde el pla dels Àngels se ve la llanura de Girona, el Alt y el Baix Empordà, la Selva y, en días claros, el Pirineo y el Montseny. Al noroeste, en la misma sierra, está el [castell de Sant Miquel](/cims/castell-de-sant-miquel), la otra cima esencial de la comarca, y es habitual encadenar ambas en una sola salida.',
			'Se puede subir en cualquier época del año. En verano los caminos de las Gavarres son calurosos y es mejor ir a primera hora; en otoño, el castañar que se cruza desde Sant Martí Vell es uno de los tramos más agradables. Alrededor del 2 de agosto y los fines de semana hay bastante gente.'
		]
	},
	rutes: [
		{
			id: 'sant-marti-vell',
			nom: { ca: 'Des de Sant Martí Vell', es: 'Desde Sant Martí Vell' },
			sortida: { nom: 'Sant Martí Vell (nucli antic)' },
			desnivellPositiuM: 473,
			distanciaKm: 5.5,
			tempsMinuts: 105,
			tecnicitat: 'cap',
			descripcio: {
				ca: "És l'itinerari núm. 2 del municipi, senyalitzat en color lila. Del poble medieval, el camí segueix primer la riera de Boscals i després una pista forestal més ombrívola entre pins i alzines, passa per la castanyeda d'en Gatell i surt a la plana dels Àngels, ja a tocar del santuari. És una pujada sostinguda però sense passos on calgui posar les mans; es pot tornar pel mateix camí o fer una circular per la font de la Pixarella.",
				es: 'Es el itinerario n.º 2 del municipio, señalizado en color lila. Desde el pueblo medieval, el camino sigue primero la riera de Boscals y después una pista forestal más sombría entre pinos y encinas, pasa por el castañar de en Gatell y sale a la plana dels Àngels, ya junto al santuario. Es una subida sostenida pero sin pasos en los que haya que poner las manos; se puede volver por el mismo camino o hacer una circular por la font de la Pixarella.'
			},
			fonts: [AJ_SANT_MARTI_VELL_RUTA]
		},
		{
			id: 'girona-sant-daniel',
			nom: { ca: 'Des de Sant Daniel (Girona)', es: 'Desde Sant Daniel (Girona)' },
			sortida: { nom: 'Monestir de Sant Daniel (Girona)' },
			descripcio: {
				ca: "Des de la vall de Sant Daniel, a tocar de Girona, un camí senyalitzat puja pel bosc de les Gavarres, travessa diverses vegades la carretera GIV-6703 (compte amb el trànsit) i acaba per la pista que ve de Juià. D'excursió per Catalunya la descriu com una anada i tornada de 16 km, 615 m de desnivell acumulat i 3 h 30 min, sense trams de grimpada.",
				es: "Desde el valle de Sant Daniel, junto a Girona, un camino señalizado sube por el bosque de las Gavarres, cruza varias veces la carretera GIV-6703 (cuidado con el tráfico) y termina por la pista que viene de Juià. D'excursió per Catalunya la describe como una ida y vuelta de 16 km, 615 m de desnivel acumulado y 3 h 30 min, sin tramos de trepada."
			},
			fonts: [DEXCURSIO]
		}
	],
	consells: {
		ca: [
			'Des de Sant Martí Vell segueix les marques lila de l\'itinerari núm. 2; amb les marques taronja pots tancar una circular per la font de la Pixarella.',
			"Si vens des de Girona, als encreuaments amb la carretera dels Àngels passen molts cotxes i ciclistes: travessa amb atenció.",
			"Al santuari hi ha restaurant i bar, però consulta'n l'horari abans de comptar-hi per dinar.",
			"Porta prou aigua a l'estiu: la pujada és per bosc, però les Gavarres són caloroses a les hores centrals.",
			'El massís de les Gavarres és un espai natural protegit: respecta els camins i no encenguis foc.'
		],
		es: [
			'Desde Sant Martí Vell sigue las marcas lila del itinerario n.º 2; con las marcas naranja puedes cerrar una circular por la font de la Pixarella.',
			'Si vienes desde Girona, en los cruces con la carretera de los Àngels pasan muchos coches y ciclistas: cruza con atención.',
			'En el santuario hay restaurante y bar, pero consulta el horario antes de contar con él para comer.',
			'Lleva agua suficiente en verano: la subida es por bosque, pero las Gavarres son calurosas en las horas centrales.',
			'El macizo de las Gavarres es un espacio natural protegido: respeta los caminos y no enciendas fuego.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar als Àngels des de Sant Martí Vell?',
				resposta:
					"Segons l'Ajuntament de Sant Martí Vell, l'itinerari senyalitzat fa 5,5 km d'anada i 473 m de desnivell positiu, i es fa en aproximadament 1 h 45 min de pujada. La tornada pel mateix camí és més ràpida."
			},
			{
				pregunta: 'Es pot pujar als Àngels amb nens?',
				resposta:
					"Sí, amb nens acostumats a caminar: són pistes i camins de bosc sense passos tècnics, i a dalt hi ha zona de pícnic i restaurant. La pujada és sostinguda, així que val la pena fer-la amb calma. També s'hi pot arribar en cotxe per la carretera de Madremanya, però així no compta l'esforç."
			},
			{
				pregunta: 'És veritat que Dalí es va casar al santuari dels Àngels?',
				resposta:
					'Sí. Salvador Dalí i Gala s\'hi van casar el 8 d\'agost de 1958, en una cerimònia íntima. El santuari actual és fruit de diverses reconstruccions després de les guerres del 1710 i del 1809.'
			},
			{
				pregunta: 'Els Àngels compten com a cim essencial?',
				resposta:
					'Sí, és un dels [cims essencials](/cims-essencials) del repte i un dels dos del Gironès, amb el [castell de Sant Miquel](/cims/castell-de-sant-miquel). Les condicions per validar-lo són a la [normativa](/repte-100-cims/normativa).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a els Àngels desde Sant Martí Vell?',
				resposta:
					'Según el Ayuntamiento de Sant Martí Vell, el itinerario señalizado tiene 5,5 km de ida y 473 m de desnivel positivo, y se hace en aproximadamente 1 h 45 min de subida. La vuelta por el mismo camino es más rápida.'
			},
			{
				pregunta: '¿Se puede subir a els Àngels con niños?',
				resposta:
					'Sí, con niños acostumbrados a caminar: son pistas y caminos de bosque sin pasos técnicos, y arriba hay zona de pícnic y restaurante. La subida es sostenida, así que vale la pena hacerla con calma. También se puede llegar en coche por la carretera de Madremanya, pero así no cuenta el esfuerzo.'
			},
			{
				pregunta: '¿Es verdad que Dalí se casó en el santuario de els Àngels?',
				resposta:
					'Sí. Salvador Dalí y Gala se casaron aquí el 8 de agosto de 1958, en una ceremonia íntima. El santuario actual es fruto de varias reconstrucciones tras las guerras de 1710 y de 1809.'
			},
			{
				pregunta: '¿Els Àngels cuenta como cima esencial?',
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) del reto y una de las dos del Gironès, con el [castell de Sant Miquel](/cims/castell-de-sant-miquel). Las condiciones para validarla están en la [normativa](/repte-100-cims/normativa).'
			}
		]
	},
	fonts: [VIQUIPEDIA, AJ_SANT_MARTI_VELL_RUTA, AJ_SANT_MARTI_VELL_MIRADOR, DEXCURSIO],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
