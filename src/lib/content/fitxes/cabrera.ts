import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const DIBA_PATRIMONI = {
	nom: "Diputació de Barcelona, Mapes de patrimoni cultural: Mare de Déu de Cabrera (l'Esquirol)",
	url: 'https://patrimonicultural.diba.cat/print/pdf/node/65562',
	consultat: CONSULTAT
};

const TOTNENS = {
	nom: 'Totnens: santuari de Cabrera al Collsacabra amb nens',
	url: 'https://totnens.cat/que-fem/santuari-de-cabrera-al-collsacabra/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'cabrera',
	descripcio: {
		ca: [
			"Cabrera és una mola allargada i voltada de cingles, al cor del Collsacabra, amb un santuari a dalt. El cim és a la Vall d'en Bas, a la [Garrotxa](/comarques/garrotxa), just al límit amb l'Esquirol, a [Osona](/comarques/osona): l'inventari de patrimoni de la Diputació de Barcelona situa el santuari de la Mare de Déu de Cabrera a Sant Julià de Cabrera, i de fet s'hi puja des d'aquest costat. A l'altre extrem del Collsacabra hi ha [la Rocallarga](/cims/rocallarga).",
			"Segons aquest inventari, l'origen del santuari és el castell de Cabrera, de finals del segle IX o inicis del X. Als segles XII i XIII era la capella dels castlans i, alhora, un lloc de devoció de tota la contrada. Els terratrèmols del segle XV la van destruir i, un cop refeta, va deixar de ser capella del castell per convertir-se en santuari popular. L'edifici actual es va aixecar entre el 1611 i el 1641, i el portal conserva la data de 1611. Guardava una imatge de marbre del segle XIII que es va destruir durant la Guerra Civil.",
			"El pla del cim és estret i voltat de cingles. Totnens parla d'una talaia sobre la plana de Vic i situa el punt més alt una mica més enllà de l'església, on hi ha una bandera, després d'un estret rocós que passa arran dels penya-segats.",
			'Al santuari hi ha un restaurant i, segons Totnens, sol haver-hi força gent. Amb boira, pluja o glaç, els graons i el pla del cim demanen molta més prudència.'
		],
		es: [
			"Cabrera es una mole alargada y rodeada de cingles, en el corazón del Collsacabra, con un santuario en lo alto. La cima está en la Vall d'en Bas, en la [Garrotxa](/comarques/garrotxa), justo en el límite con l'Esquirol, en [Osona](/comarques/osona): el inventario de patrimonio de la Diputació de Barcelona sitúa el santuario de la Mare de Déu de Cabrera en Sant Julià de Cabrera, y de hecho se sube desde ese lado. En el otro extremo del Collsacabra está [la Rocallarga](/cims/rocallarga).",
			'Según ese inventario, el origen del santuario es el castillo de Cabrera, de finales del siglo IX o inicios del X. En los siglos XII y XIII era la capilla de los castellanos del castillo y, a la vez, un lugar de devoción de toda la zona. Los terremotos del siglo XV la destruyeron y, una vez rehecha, dejó de ser capilla del castillo para convertirse en santuario popular. El edificio actual se levantó entre 1611 y 1641, y el portal conserva la fecha de 1611. Guardaba una imagen de mármol del siglo XIII que se destruyó durante la Guerra Civil.',
			'El llano de la cima es estrecho y está rodeado de cingles. Totnens habla de una atalaya sobre la plana de Vic y sitúa el punto más alto un poco más allá de la iglesia, donde hay una bandera, tras un estrecho rocoso que pasa al borde de los acantilados.',
			'En el santuario hay un restaurante y, según Totnens, suele haber bastante gente. Con niebla, lluvia o hielo, los escalones y el llano de la cima piden mucha más prudencia.'
		]
	},
	rutes: [
		{
			id: 'sant-julia',
			nom: {
				ca: 'Des de Sant Julià de Cabrera pel coll de Bram i les escales',
				es: 'Desde Sant Julià de Cabrera por el coll de Bram y las escaleras'
			},
			sortida: { nom: "Parròquia de Sant Julià de Cabrera (l'Esquirol)" },
			descripcio: {
				ca: "Totnens surt de la parròquia de Sant Julià de Cabrera, a uns 4 km de la carretera de Vic a Olot. Segueix la pista asfaltada cap al collet de Cabrera, que més amunt es torna camí de terra i entra a la Vall d'en Bas, i puja suaument fins al coll de Bram, al peu de la cinglera. D'allà s'hi pot pujar pel camí de les Marrades o per les escales del Grau Nou, obertes el 1952, que segons el web no tenen perill i porten barana. Compta 7 km en total, 2 h 15 min per a un adult sense parades i 4 h amb nens i parades, i marca la ruta com a Xtreme pels trams de cinglera.",
				es: "Totnens sale de la parroquia de Sant Julià de Cabrera, a unos 4 km de la carretera de Vic a Olot. Sigue la pista asfaltada hacia el collet de Cabrera, que más arriba se vuelve camino de tierra y entra en la Vall d'en Bas, y sube suavemente hasta el coll de Bram, al pie del cingle. Desde allí se puede subir por el camí de les Marrades o por las escaleras del Grau Nou, abiertas en 1952, que según la web no tienen peligro y llevan barandilla. Cuenta 7 km en total, 2 h 15 min para un adulto sin paradas y 4 h con niños y paradas, y marca la ruta como Xtreme por los tramos de cingle."
			},
			fonts: [TOTNENS]
		}
	],
	consells: {
		ca: [
			"Ves-hi d'hora: Totnens avisa que a Sant Julià de Cabrera hi ha poc lloc per aparcar.",
			"Per trepitjar el punt més alt cal passar l'estret rocós del pla de Cabrera, arran de timba: amb nens, de la mà i sense córrer.",
			"El pas de l'Osca, que baixa del cim cap a Sant Julià, té un tram equipat que Totnens considera complicat per a nens petits; les escales del coll de Bram són l'alternativa.",
			'El camí de les Marrades, marcat amb números grocs, permet baixar per un lloc diferent de les escales i tancar la volta.',
			"No t'acostis a la vora dels cingles per fer fotos, i menys amb vent o amb el terra moll."
		],
		es: [
			'Ve temprano: Totnens avisa de que en Sant Julià de Cabrera hay poco sitio para aparcar.',
			'Para pisar el punto más alto hay que pasar el estrecho rocoso del pla de Cabrera, al borde del precipicio: con niños, de la mano y sin correr.',
			"El paso de l'Osca, que baja de la cima hacia Sant Julià, tiene un tramo equipado que Totnens considera complicado para niños pequeños; las escaleras del coll de Bram son la alternativa.",
			'El camí de les Marrades, marcado con números amarillos, permite bajar por un sitio distinto de las escaleras y cerrar la vuelta.',
			'No te acerques al borde de los cingles para hacer fotos, y menos con viento o con el suelo mojado.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Cabrera des de Sant Julià?',
				resposta:
					"Totnens compta 7 km per a tota la volta, amb 2 h 15 min per a un adult sense parades i unes 4 h si s'hi va amb nens i es fan parades."
			},
			{
				pregunta: 'Es pot pujar a Cabrera amb nens?',
				resposta:
					"Totnens la proposa com a sortida familiar, però la marca com a Xtreme pels trams de cinglera. Les escales tenen barana; on cal vigilar de debò és al pla del cim, que passa arran dels penya-segats, i al pas de l'Osca, que val més evitar amb nens petits."
			},
			{
				pregunta: 'De quan és el santuari de Cabrera?',
				resposta:
					"L'edifici actual es va construir entre el 1611 i el 1641, segons l'inventari de patrimoni de la Diputació de Barcelona, en substitució d'una capella anterior lligada al castell de Cabrera."
			},
			{
				pregunta: 'Cabrera és a la Garrotxa o a Osona?',
				resposta:
					"El cim és a la Vall d'en Bas, a la [Garrotxa](/comarques/garrotxa), i el repte el compta en aquesta comarca. El santuari i l'accés habitual, per Sant Julià de Cabrera, són de l'Esquirol, a [Osona](/comarques/osona)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Cabrera desde Sant Julià?',
				resposta:
					'Totnens cuenta 7 km para toda la vuelta, con 2 h 15 min para un adulto sin paradas y unas 4 h si se va con niños y se hacen paradas.'
			},
			{
				pregunta: '¿Se puede subir a Cabrera con niños?',
				resposta:
					"Totnens la propone como salida familiar, pero la marca como Xtreme por los tramos de cingle. Las escaleras tienen barandilla; donde hay que vigilar de verdad es en el llano de la cima, que pasa al borde de los acantilados, y en el paso de l'Osca, que es mejor evitar con niños pequeños."
			},
			{
				pregunta: '¿De cuándo es el santuario de Cabrera?',
				resposta:
					'El edificio actual se construyó entre 1611 y 1641, según el inventario de patrimonio de la Diputació de Barcelona, en sustitución de una capilla anterior ligada al castillo de Cabrera.'
			},
			{
				pregunta: '¿Cabrera está en la Garrotxa o en Osona?',
				resposta:
					"La cima está en la Vall d'en Bas, en la [Garrotxa](/comarques/garrotxa), y el reto la cuenta en esa comarca. El santuario y el acceso habitual, por Sant Julià de Cabrera, son de l'Esquirol, en [Osona](/comarques/osona)."
			}
		]
	},
	fonts: [DIBA_PATRIMONI, TOTNENS],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
