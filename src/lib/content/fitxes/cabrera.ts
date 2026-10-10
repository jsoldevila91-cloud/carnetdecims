import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const DIBA_PATRIMONI = {
	nom: "Diputació de Barcelona, Patrimoni cultural: Mare de Déu de Cabrera (l'Esquirol)",
	url: 'https://patrimonicultural.diba.cat/print/pdf/node/65562',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: santuari de Cabrera al Collsacabra',
	url: 'https://totnens.cat/que-fem/santuari-de-cabrera-al-collsacabra/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'cabrera',
	descripcio: {
		ca: [
			"Cabrera és la muntanya del Collsacabra que corona el santuari de la Mare de Déu de Cabrera. El catàleg la situa a la Vall d'en Bas, a la [Garrotxa](/comarques/garrotxa); l'inventari de patrimoni de la Diputació de Barcelona ubica el santuari a Sant Julià de Cabrera, a l'Esquirol, a l'[Osona](/comarques/osona), de manera que el cim és a cavall de les dues comarques. Un altre cim essencial del Collsacabra és [la Rocallarga](/cims/rocallarga).",
			"El santuari és el que dona sentit al cim. Segons l'inventari, el seu origen cal buscar-lo al castell de Cabrera, entre finals del segle IX o començaments del següent; als segles XII i XIII era la capella dels castlans de Cabrera i, a la vegada, un lloc de devoció de tota la contrada. Després de la destrucció dels terratrèmols del segle XV i de la restauració posterior, va deixar de ser capella del castell per convertir-se en el santuari popular. L'edifici actual es va aixecar entre el 1611 i el 1641, i el portal porta datat el 1611. El santuari custodiava una imatge de marbre del segle XIII, que es va perdre durant la Guerra Civil.",
			"Per pujar-hi, Totnens proposa sortir de Sant Julià de Cabrera, on cal deixar el cotxe a la parròquia. La ruta comença per pista asfaltada que després es converteix en un camí de terra, amb trams de bosc i prats, i s'acosta a la cinglera: Totnens la marca com a Xtreme pels trams de cingle i demana extremar la precaució si s'hi va amb nens. Hi ha escales amb barana, que segons el web no tenen perill.",
			"El web avisa també que cal vigilar amb els nens al pas del Pla de Cabrera, i que al pas de l'Osca el tram equipat pot ser una mica complicat per fer-lo amb nens petits. El santuari acostuma a estar força concorregut i, segons Totnens, té un restaurant."
		],
		es: [
			"Cabrera es la montaña del Collsacabra que corona el santuario de la Mare de Déu de Cabrera. El catálogo la sitúa en la Vall d'en Bas, en la [Garrotxa](/comarques/garrotxa); el inventario de patrimonio de la Diputació de Barcelona ubica el santuario en Sant Julià de Cabrera, en l'Esquirol, en [Osona](/comarques/osona), de modo que la cima está a caballo de las dos comarcas. Otra cima esencial del Collsacabra es [la Rocallarga](/cims/rocallarga).",
			'El santuario es lo que da sentido a la cima. Según el inventario, su origen hay que buscarlo en el castillo de Cabrera, entre finales del siglo IX o comienzos del siguiente; en los siglos XII y XIII era la capilla de los castellanos de Cabrera y, a la vez, un lugar de devoción de toda la comarca. Tras la destrucción de los terremotos del siglo XV y la restauración posterior, dejó de ser capilla del castillo para convertirse en el santuario popular. El edificio actual se levantó entre 1611 y 1641, y el portal lleva fechado 1611. El santuario custodiaba una imagen de mármol del siglo XIII, que se perdió durante la Guerra Civil.',
			'Para subir, Totnens propone salir de Sant Julià de Cabrera, donde hay que dejar el coche en la parroquia. La ruta empieza por pista asfaltada que luego se convierte en un camino de tierra, con tramos de bosque y prados, y se acerca a la cinglera: Totnens la marca como Xtreme por los tramos de cingle y pide extremar la precaución si se va con niños. Hay escaleras con barandilla, que según la web no tienen peligro.',
			"La web avisa también de que hay que vigilar a los niños en el paso del Pla de Cabrera, y de que en el paso de l'Osca el tramo equipado puede ser algo complicado para hacerlo con niños pequeños. El santuario suele estar bastante concurrido y, según Totnens, tiene un restaurante."
		]
	},
	rutes: [
		{
			id: 'sant-julia',
			nom: {
				ca: 'Des de Sant Julià de Cabrera',
				es: 'Desde Sant Julià de Cabrera'
			},
			sortida: { nom: "Parròquia de Sant Julià de Cabrera (l'Esquirol)" },
			descripcio: {
				ca: 'Totnens la descriu amb sortida a Sant Julià de Cabrera, on es deixa el cotxe a la parròquia. Puja per pista asfaltada que esdevé camí de terra, amb trams de bosc i prats; les escales no tenen perill i tenen barana. El web dona 7 km i, per a un adult sense parades, unes 2 h 15 min; amb parades, 4 h. Són xifres de la sortida sencera, i la ruta té trams de cingle que Totnens marca com a Xtreme.',
				es: 'Totnens la describe con salida en Sant Julià de Cabrera, donde se deja el coche en la parroquia. Sube por pista asfaltada que se convierte en camino de tierra, con tramos de bosque y prados; las escaleras no tienen peligro y tienen barandilla. La web da 7 km y, para un adulto sin paradas, unas 2 h 15 min; con paradas, 4 h. Son cifras de la salida entera, y la ruta tiene tramos de cingle que Totnens marca como Xtreme.'
			},
			fonts: [TOTNENS]
		}
	],
	consells: {
		ca: [
			"Els trams de cingle són delicats: vigila els nens, sobretot al pas del Pla de Cabrera i al pas de l'Osca, segons Totnens.",
			"Totnens recomana anar-hi d'hora perquè no hi ha gaire lloc per aparcar.",
			"No t'acostis a la vora dels cingles per fer fotos i evita aquests trams amb pluja o boira.",
			"Amb nens petits, valora abans de sortir el tram equipat del pas de l'Osca: segons Totnens pot ser complicat per a ells.",
			'Aquesta fitxa orienta, no substitueix un mapa topogràfic ni la valoració de les condicions del dia.'
		],
		es: [
			"Los tramos de cingle son delicados: vigila a los niños, sobre todo en el paso del Pla de Cabrera y en el paso de l'Osca, según Totnens.",
			'Totnens recomienda ir temprano porque no hay mucho sitio para aparcar.',
			'No te acerques al borde de los cingles para hacer fotos y evita esos tramos con lluvia o niebla.',
			"Con niños pequeños, valora antes de salir el tramo equipado del paso de l'Osca: según Totnens puede ser complicado para ellos.",
			'Esta ficha orienta, no sustituye un mapa topográfico ni la valoración de las condiciones del día.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Cabrera?',
				resposta:
					'Totnens compta uns 7 km i unes 2 h 15 min per a un adult sense parades, i 4 h amb parades, des de Sant Julià de Cabrera.'
			},
			{
				pregunta: 'Es pot pujar a Cabrera amb nens?',
				resposta:
					"Totnens el proposa com a excursió amb nens, però avisa que cal extremar la precaució als trams de cingle, al pas del Pla de Cabrera i al tram equipat del pas de l'Osca, que pot ser complicat per a nens petits."
			},
			{
				pregunta: 'Què és el santuari de Cabrera?',
				resposta:
					"L'edifici actual és del 1611–1641, segons l'inventari de la Diputació de Barcelona, i substitueix una capella més antiga lligada al castell de Cabrera."
			},
			{
				pregunta: 'Cabrera és un cim essencial?',
				resposta:
					"Sí. És a cavall de la [Garrotxa](/comarques/garrotxa) i l'[Osona](/comarques/osona), i al Collsacabra l'acompanya [la Rocallarga](/cims/rocallarga)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Cabrera?',
				resposta:
					'Totnens cuenta unos 7 km y unas 2 h 15 min para un adulto sin paradas, y 4 h con paradas, desde Sant Julià de Cabrera.'
			},
			{
				pregunta: '¿Se puede subir a Cabrera con niños?',
				resposta:
					"Totnens lo propone como excursión con niños, pero avisa de que hay que extremar la precaución en los tramos de cingle, en el paso del Pla de Cabrera y en el tramo equipado del paso de l'Osca, que puede ser complicado para niños pequeños."
			},
			{
				pregunta: '¿Qué es el santuario de Cabrera?',
				resposta:
					'El edificio actual es de 1611–1641, según el inventario de la Diputació de Barcelona, y sustituye a una capilla más antigua ligada al castillo de Cabrera.'
			},
			{
				pregunta: '¿Cabrera es una cima esencial?',
				resposta:
					'Sí. Está a caballo de la [Garrotxa](/comarques/garrotxa) y [Osona](/comarques/osona), y en el Collsacabra la acompaña [la Rocallarga](/cims/rocallarga).'
			}
		]
	},
	fonts: [DIBA_PATRIMONI, TOTNENS],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
