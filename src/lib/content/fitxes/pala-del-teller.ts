import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Pala del Teller',
	url: 'https://ca.wikipedia.org/wiki/Pala_del_Teller',
	consultat: CONSULTAT
};

const ENCICLOPEDIA = {
	nom: 'Gran Enciclopèdia Catalana: la serra de Sant Gervàs i el pui de Lleràs',
	url: 'https://www.enciclopedia.cat/historia-natural-dels-paisos-catalans/la-serra-de-sant-gervas-i-el-pui-de-lleras',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Pala del Teller (Adons)',
	url: 'https://reptesmuntanyencs.cat/pala-del-teller/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pala-del-teller',
	descripcio: {
		ca: [
			"La Pala del Teller és el punt més alt de la serra de Sant Gervàs, una alineació de roca calcària que s'estén a cavall de [l'Alta Ribagorça](/comarques/alta-ribagorca) i del Pallars Jussà. El cim marca el límit entre el terme de Tremp i el del Pont de Suert, i és dins l'espai protegit de la Vall Alta de Serradell, Terreta i serra de Sant Gervàs. La Viquipèdia en dona una prominència de 554 m i un aïllament de 12,5 km: és una muntanya que domina el seu entorn.",
			"La Gran Enciclopèdia Catalana descriu la serra com un conjunt de calcàries mesozoiques compactes amb intercalacions de margues, amb pinedes de pi roig i sotabosc de roureda com a masses forestals més extenses. A les obagues més fresques hi ha boscos de caducifolis i fagedes, mentre que als vessants del sud la cobertura vegetal s'ha degradat molt, cosa que afavoreix l'erosió. Els rapinyaires hi són diversos i abundants. Un detall administratiu curiós: la part del terme de Tremp que arriba al cim pertanyia antigament al terme d'Espluga de Serra, de l'Alta Ribagorça.",
			"La volta de Reptes Muntanyencs passa pel Pertús i per l'Avedoga d'Adons, el segon cim del dia, a ponent de la Pala. Des del cim, segons l'autor, el que domina el paisatge cap al nord és l'Aneto.",
			"És una serra prepirinenca baixa i assolellada: la calor d'estiu s'hi fa notar i l'autor de la ressenya, que la va fer un dia calorós de juny, recomana evitar els dies més forts de l'estiu. La primavera i la tardor són més agradables. La ruta surt d'Adons, on s'arriba en cotxe normal per carretera asfaltada."
		],
		es: [
			'La Pala del Teller es el punto más alto de la sierra de Sant Gervàs, una alineación de roca caliza que se extiende a caballo de la [Alta Ribagorça](/comarques/alta-ribagorca) y del Pallars Jussà. La cima marca el límite entre el término de Tremp y el de El Pont de Suert, y está dentro del espacio protegido de la Vall Alta de Serradell, Terreta y sierra de Sant Gervàs. La Viquipèdia le da una prominencia de 554 m y un aislamiento de 12,5 km: es una montaña que domina su entorno.',
			'La Gran Enciclopèdia Catalana describe la sierra como un conjunto de calizas mesozoicas compactas con intercalaciones de margas, con pinares de pino silvestre y sotobosque de robledal como masas forestales más extensas. En las umbrías más frescas hay bosques de caducifolios y hayedos, mientras que en las laderas del sur la cobertura vegetal se ha degradado mucho, lo que favorece la erosión. Las rapaces son diversas y abundantes. Un detalle administrativo curioso: la parte del término de Tremp que llega a la cima pertenecía antiguamente al término de Espluga de Serra, de la Alta Ribagorça.',
			'La vuelta de Reptes Muntanyencs pasa por el Pertús y por la Avedoga d’Adons, la segunda cima del día, al oeste de la Pala. Desde la cima, según el autor, lo que domina el paisaje hacia el norte es el Aneto.',
			'Es una sierra prepirenaica baja y soleada: el calor de verano se nota y el autor de la reseña, que la hizo un día caluroso de junio, recomienda evitar los días más fuertes del verano. La primavera y el otoño son más agradables. La ruta sale de Adons, adonde se llega en coche normal por carretera asfaltada.'
		]
	},
	rutes: [
		{
			id: 'adons',
			nom: {
				ca: "Circular des d'Adons pel coll de Sant Roc",
				es: 'Circular desde Adons por el coll de Sant Roc'
			},
			sortida: { nom: 'Adons, vora la font i Cal Ramon (Tremp)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Reptes Muntanyencs fa una volta en sentit antihorari que surt d'Adons, on s'arriba en cotxe per carretera asfaltada. Una pista porta al coll de Sant Roc d'Adons i, a partir d'aquí, la ruta combina fites, trams de camí i trams sense camí per prats, bosc i terreny pedregós. Entre cims no hi ha sender i la baixada per la pala de l'Avedoga demana cura. La volta fa uns 15 km i 917 m de desnivell, amb 4 h 34 min de marxa i 1 h 12 min d'aturades; l'autor valora la dificultat física de moderada i l'orientació, de moderada a alta.",
				es: 'Reptes Muntanyencs hace una vuelta en sentido antihorario que sale de Adons, adonde se llega en coche por carretera asfaltada. Una pista lleva al coll de Sant Roc d’Adons y, a partir de ahí, la ruta combina hitos, tramos de camino y tramos sin camino por prados, bosque y terreno pedregoso. Entre cimas no hay sendero y la bajada por la pala de la Avedoga pide cuidado. La vuelta hace unos 15 km y 917 m de desnivel, con 4 h 34 min de marcha y 1 h 12 min de paradas; el autor valora la dificultad física de moderada y la orientación, de moderada a alta.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"Porta mapa o GPS amb el track: Reptes Muntanyencs avisa que el camí es perd en diversos sectors i que entre cims no hi ha sender; l'orientació hi és de moderada a alta.",
			"Evita els dies més calorosos de l'estiu: l'autor va fer la ruta al juny i ho recomana així.",
			"La Gran Enciclopèdia Catalana remarca la diversitat de rapinyaires de la serra; un bon lloc per observar-los sense molestar-los és la presa d'Escales.",
			"L'única font que indica la ressenya és la d'Adons, davant de Cal Ramon: omple-hi la cantimplora abans de sortir.",
			"A les baixades dretes, sobretot a la pala de l'Avedoga, Reptes Muntanyencs aconsella trepitjar amb cura i allunyar-se de la vora dels cingles."
		],
		es: [
			'Lleva mapa o GPS con el track: Reptes Muntanyencs avisa de que el camino se pierde en varios sectores y de que entre cimas no hay sendero; la orientación es de moderada a alta.',
			'Evita los días más calurosos del verano: el autor hizo la ruta en junio y así lo recomienda.',
			'La Gran Enciclopèdia Catalana destaca la diversidad de rapaces de la sierra; un buen lugar para observarlas sin molestarlas es la presa de Escales.',
			'La única fuente que indica la reseña es la de Adons, frente a Cal Ramon: llena allí la cantimplora antes de salir.',
			'En las bajadas empinadas, sobre todo en la pala de la Avedoga, Reptes Muntanyencs aconseja pisar con cuidado y alejarse del borde de los cortados.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Pala del Teller?',
				resposta:
					"La volta circular que ressenya Reptes Muntanyencs, des d'Adons, són uns 15 km i 917 m de desnivell, amb 4 h 34 min de marxa més 1 h 12 min d'aturades. Les fonts consultades no donen cap xifra només d'anada."
			},
			{
				pregunta: 'La Pala del Teller és de Tremp o del Pont de Suert?',
				resposta:
					"El cim és al límit dels dos termes: la Viquipèdia el situa entre Tremp (Pallars Jussà) i el Pont de Suert (Alta Ribagorça). Al catàleg del repte consta a l'Alta Ribagorça."
			},
			{
				pregunta: 'Hi ha camí marcat fins al cim?',
				resposta:
					"No del tot. Reptes Muntanyencs descriu una pista fins al coll de Sant Roc d'Adons i, després, fites, trams de camí i trams sense camí; entre cims no hi ha sender."
			},
			{
				pregunta: 'La Pala del Teller compta com a cim essencial?',
				resposta:
					"Sí, és un dels sis [cims essencials](/cims-essencials) de l'Alta Ribagorça i el més baix de tots: 1.889 m, enfront dels 3.029 m del [Pic de Comaloforno](/cims/pic-de-comaloforno)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Pala del Teller?',
				resposta:
					'La vuelta circular que reseña Reptes Muntanyencs, desde Adons, son unos 15 km y 917 m de desnivel, con 4 h 34 min de marcha más 1 h 12 min de paradas. Las fuentes consultadas no dan ninguna cifra solo de ida.'
			},
			{
				pregunta: '¿La Pala del Teller es de Tremp o de El Pont de Suert?',
				resposta:
					'La cima está en el límite de los dos términos: la Viquipèdia la sitúa entre Tremp (Pallars Jussà) y El Pont de Suert (Alta Ribagorça). En el catálogo del reto consta en la Alta Ribagorça.'
			},
			{
				pregunta: '¿Hay camino marcado hasta la cima?',
				resposta:
					'No del todo. Reptes Muntanyencs describe una pista hasta el coll de Sant Roc d’Adons y, después, hitos, tramos de camino y tramos sin camino; entre cimas no hay sendero.'
			},
			{
				pregunta: '¿La Pala del Teller cuenta como cima esencial?',
				resposta:
					'Sí, es una de las seis [cimas esenciales](/cims-essencials) de la Alta Ribagorça y la más baja de todas: 1.889 m, frente a los 3.029 m del [Pic de Comaloforno](/cims/pic-de-comaloforno).'
			}
		]
	},
	fonts: [VIQUIPEDIA, ENCICLOPEDIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
