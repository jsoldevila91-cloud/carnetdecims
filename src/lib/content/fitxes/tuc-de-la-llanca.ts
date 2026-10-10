import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Tuc de la Llança',
	url: 'https://ca.wikipedia.org/wiki/Tuc_de_la_Llan%C3%A7a',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Tuc de la Llança',
	url: 'https://reptesmuntanyencs.cat/es/tuc-de-la-llanca-2/',
	consultat: CONSULTAT
};

const BACIVER = {
	nom: 'Rutes Pirineus: estany de Baciver des del pla de Beret',
	url: 'https://www.rutespirineus.cat/rutes/estany-de-baciver-val-aran-beret',
	consultat: CONSULTAT
};

const PARC = {
	nom: "Parc Natural de l'Alt Pirineu: pautes i consells per als visitants",
	url: 'https://parcsnaturals.gencat.cat/en/xarxa-de-parcs/alt-pirineu/gaudeix-del-parc/consells/pautes-i-consells/index.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tuc-de-la-llanca',
	descripcio: {
		ca: [
			"El Tuc de la Llança és un cim del massís de Beret, al municipi d'Alt Àneu, [al Pallars Sobirà](/comarques/pallars-sobira), dins del Parc Natural de l'Alt Pirineu. Segons la Viquipèdia, és un dels cims que envolten el circ de Baciver, en marca el límit sud de la serra d'Escornacrabes i és de granodiorita. Una carena en direcció sud-est l'uneix amb el cap del Muntanyó d'Àreu, i al cim hi ha un vèrtex geodèsic.",
			"El que el fa conegut és el fred. Segons la Viquipèdia, el 6 de gener del 2021 l'estació meteorològica del Clot del Tuc de la Llança, en una clotada propera al cim, va registrar −34,1 °C, aleshores la temperatura més baixa mesurada a la península Ibèrica. L'endemà, l'estació de Vega de Liordes (Cantàbria) va marcar −35,8 °C, i el 8 de gener es va arribar a −34,8 °C, nou rècord de fred a Catalunya.",
			"La telecadira del Tuc de la Llança, de l'estació de Baqueira-Beret, arriba al cim pel vessant oest. Reptes Muntanyencs hi puja des del port de la Bonaigua en una volta circular per la carena del Tuc de la Cigalera i el Muntanyó d'Àreu, sense camí senyalitzat, per vessants d'herba i trams de roca, fins a un cim que descriu com un caos de pedres. L'autor en destaca les vistes, àmplies en totes direccions.",
			"Reptes Muntanyencs hi va pujar a principis de desembre, abans que la neu cobrís el terreny. Sense neu, la temporada va de l'estiu a la tardor; amb neu, és una ascensió hivernal en terreny d'allaus, al costat de les pistes d'esquí: porta el material adequat i consulta el butlletí d'allaus de l'ICGC abans de sortir."
		],
		es: [
			'El Tuc de la Llança es una cima del macizo de Beret, en el municipio de Alt Àneu, en el [Pallars Sobirà](/comarques/pallars-sobira), dentro del Parque Natural del Alt Pirineu. Según la Viquipèdia, es una de las cimas que rodean el circo de Baciver, marca el límite sur de la sierra de Escornacrabes y es de granodiorita. Una cresta en dirección sureste lo une con el cap del Muntanyó d’Àreu, y en la cima hay un vértice geodésico.',
			'Lo que lo hace conocido es el frío. Según la Viquipèdia, el 6 de enero de 2021 la estación meteorológica del Clot del Tuc de la Llança, en una hondonada cercana a la cima, registró −34,1 °C, entonces la temperatura más baja medida en la península ibérica. Al día siguiente, la estación de Vega de Liordes (Cantabria) marcó −35,8 °C, y el 8 de enero se llegó a −34,8 °C, nuevo récord de frío en Cataluña.',
			'El telesilla del Tuc de la Llança, de la estación de Baqueira-Beret, llega a la cima por la vertiente oeste. Reptes Muntanyencs sube desde el port de la Bonaigua en una vuelta circular por la cresta del Tuc de la Cigalera y el Muntanyó d’Àreu, sin camino señalizado, por laderas de hierba y tramos de roca, hasta una cima que describe como un caos de piedras. El autor destaca sus vistas, amplias en todas direcciones.',
			'Reptes Muntanyencs subió a principios de diciembre, antes de que la nieve cubriera el terreno. Sin nieve, la temporada va del verano al otoño; con nieve, es una ascensión invernal en terreno de aludes, junto a las pistas de esquí: lleva el material adecuado y consulta el boletín de aludes del ICGC antes de salir.'
		]
	},
	rutes: [
		{
			id: 'bonaigua',
			nom: {
				ca: 'Circular des del port de la Bonaigua',
				es: 'Circular desde el port de la Bonaigua'
			},
			sortida: { nom: 'Port de la Bonaigua (estació de Baqueira-Beret)' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Reptes Muntanyencs surt del port de la Bonaigua, a peu de la carretera C-28. La volta encadena el Tuc de la Cigalera, el Pic del Pla de Moredo i el Tuc del Muntanyó d'Àreu per vessants d'herba sense camí, amb rastres a les carenes i trams de roca, i inclou una canal herbosa molt dreta que pot ser problemàtica si és mullada. La carena directa entre el Muntanyó d'Àreu i la Llança, l'autor la descriu com molt complicada i la va evitar. Segons la ressenya, són 952 m de desnivell i 3 h 42 min de marxa, amb el cim cap a les 2 h 45 min comptant aturades; la tornada passa pel Tuc des Arcoils i baixa per una pista d'esquí o per corriols de bestiar.",
				es: 'Reptes Muntanyencs sale del port de la Bonaigua, junto a la carretera C-28. La vuelta encadena el Tuc de la Cigalera, el Pic del Pla de Moredo y el Tuc del Muntanyó d’Àreu por laderas de hierba sin camino, con rastros en las crestas y tramos de roca, e incluye una canal herbosa muy empinada que puede ser problemática si está mojada. La cresta directa entre el Muntanyó d’Àreu y la Llança, el autor la describe como muy complicada y la evitó. Según la reseña, son 952 m de desnivel y 3 h 42 min de marcha, con la cima hacia las 2 h 45 min contando paradas; la vuelta pasa por el Tuc des Arcoils y baja por una pista de esquí o por senderos de ganado.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"Evita la canal herbosa molt inclinada quan està mullada o glaçada: Reptes Muntanyencs l'assenyala com a punt problemàtic.",
			"No intentis la carena entre el cap del Muntanyó d'Àreu i la Llança sense informació prèvia: l'autor la va descartar per molt complicada.",
			"A l'hivern és zona d'estació d'esquí i d'allaus: porta el material, consulta el butlletí abans de sortir i no envaeixis les pistes obertes.",
			"La sortida, al port de la Bonaigua, ja és a uns 2.070 m: el desnivell és moderat, però l'orientació sense camí demana bona visibilitat."
		],
		es: [
			'Evita la canal herbosa muy inclinada cuando está mojada o helada: Reptes Muntanyencs la señala como punto problemático.',
			'No intentes la cresta entre el cap del Muntanyó d’Àreu y la Llança sin información previa: el autor la descartó por muy complicada.',
			'En invierno es zona de estación de esquí y de aludes: lleva el material, consulta el boletín antes de salir y no invadas las pistas abiertas.',
			'La salida, en el port de la Bonaigua, ya está a unos 2.070 m: el desnivel es moderado, pero la orientación sin camino pide buena visibilidad.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Tuc de la Llança?',
				resposta:
					'Reptes Muntanyencs hi arriba cap a les 2 h 45 min des del port de la Bonaigua, aturades incloses. La volta circular sencera, de 952 m de desnivell, suma 3 h 42 min de marxa.'
			},
			{
				pregunta: 'Per què és famós el Tuc de la Llança?',
				resposta:
					"Per les temperatures extremes. Segons la Viquipèdia, el 6 de gener del 2021 l'estació del Clot del Tuc de la Llança, a tocar del cim, va registrar −34,1 °C, aleshores un mínim per a la península Ibèrica, i el 8 de gener es va arribar a −34,8 °C, rècord de fred a Catalunya."
			},
			{
				pregunta: 'Hi ha camí fins al cim?',
				resposta:
					"Reptes Muntanyencs la descriu com una ruta sense itinerari senyalitzat, amb rastres, vessants d'herba i trams de roca. La tornada passa pel Tuc des Arcoils i baixa per una pista d'esquí o per corriols de bestiar."
			},
			{
				pregunta: 'El Tuc de la Llança compta com a cim essencial?',
				resposta:
					'Sí, és un dels onze [cims essencials](/cims-essencials) del Pallars Sobirà. Amb 2.659 m és el tercer més baix de la llista, i comparteix el massís de Beret amb el [Pic de Moredo](/cims/pic-de-moredo).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Tuc de la Llança?',
				resposta:
					'Reptes Muntanyencs llega hacia las 2 h 45 min desde el port de la Bonaigua, paradas incluidas. La vuelta circular entera, de 952 m de desnivel, suma 3 h 42 min de marcha.'
			},
			{
				pregunta: '¿Por qué es famoso el Tuc de la Llança?',
				resposta:
					'Por las temperaturas extremas. Según la Viquipèdia, el 6 de enero de 2021 la estación del Clot del Tuc de la Llança, junto a la cima, registró −34,1 °C, entonces un mínimo para la península ibérica, y el 8 de enero se llegó a −34,8 °C, récord de frío en Cataluña.'
			},
			{
				pregunta: '¿Hay camino hasta la cima?',
				resposta:
					'Reptes Muntanyencs la describe como una ruta sin itinerario señalizado, con rastros, laderas de hierba y tramos de roca. La vuelta pasa por el Tuc des Arcoils y baja por una pista de esquí o por senderos de ganado.'
			},
			{
				pregunta: '¿El Tuc de la Llança cuenta como cima esencial?',
				resposta:
					'Sí, es una de las once [cimas esenciales](/cims-essencials) del Pallars Sobirà. Con 2.659 m es la tercera más baja de la lista, y comparte el macizo de Beret con el [Pic de Moredo](/cims/pic-de-moredo).'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, BACIVER, PARC],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
