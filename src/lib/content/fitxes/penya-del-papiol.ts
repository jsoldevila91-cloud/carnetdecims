import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const OLERDOLA = {
	nom: "Ajuntament d'Olèrdola: el Papiol",
	url: 'https://www.olerdola.cat/guia/marcador/el-papiol',
	consultat: CONSULTAT
};

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Penya del Papiol',
	url: 'https://ca.wikipedia.org/wiki/Penya_del_Papiol',
	consultat: CONSULTAT
};

const XIRUCA = {
	nom: 'Xiruca: circular a la Penya del Papiol (fitxa de ruta en PDF)',
	url: 'https://www.xiruca.com/sites/default/files/track/PenyaPapiol_imprimir.pdf',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'penya-del-papiol',
	descripcio: {
		ca: [
			"La Penya del Papiol és un contrafort de la serralada Litoral que s'aixeca damunt de les vinyes del terme d'Olèrdola, a l'[Alt Penedès](/comarques/alt-penedes). L'Ajuntament en diu una talaia formidable sobre la depressió del Penedès i remarca que es veu des de molts punts de la comarca. És el més baix dels dos cims essencials de l'Alt Penedès; l'altre és [el Castellot](/cims/el-castellot).",
			"El nom és antic i descriptiu. Segons l'Ajuntament d'Olèrdola, Papiol ve de pòpia, que en la parla popular designa un turó baix, arrodonit i de base ampla, i ja surt documentat el 992 com a límit de Viladellops. Al peu del turó, la ruta habitual passa a tocar de l'ermita romànica del Sant Sepulcre, del segle XII, que és de propietat particular i només es pot veure des del camí.",
			"Dalt hi ha un vèrtex geodèsic i, segons la fitxa de Xiruca, un llibre de registre. L'Ajuntament hi descriu el panorama amb detall: la serralada Prelitoral i Montserrat al fons, un mosaic de vinyes amb Vilafranca del Penedès al mig i, cap a mar, el massís del Garraf i les pinedes dels vessants costaners.",
			"Xiruca la recomana tot l'any. Com que mig recorregut va per pistes entre vinyes, els dies de calor val més matinar."
		],
		es: [
			'La Penya del Papiol es un contrafuerte de la cordillera Litoral que se levanta sobre los viñedos del término de Olèrdola, en el [Alt Penedès](/comarques/alt-penedes). El Ayuntamiento la llama una atalaya formidable sobre la depresión del Penedès y subraya que se ve desde muchos puntos de la comarca. Es la más baja de las dos cimas esenciales del Alt Penedès; la otra es [el Castellot](/cims/el-castellot).',
			'El nombre es antiguo y descriptivo. Según el Ayuntamiento de Olèrdola, Papiol viene de pòpia, que en el habla popular designa un cerro bajo, redondeado y de base ancha, y ya aparece documentado en 992 como límite de Viladellops. Al pie del cerro, la ruta habitual pasa junto a la ermita románica del Sant Sepulcre, del siglo XII, que es de propiedad particular y solo se puede ver desde el camino.',
			'Arriba hay un vértice geodésico y, según la ficha de Xiruca, un libro de registro. El Ayuntamiento describe el panorama con detalle: la cordillera Prelitoral y Montserrat al fondo, un mosaico de viñas con Vilafranca del Penedès en medio y, hacia el mar, el macizo del Garraf y los pinares de las vertientes costeras.',
			'Xiruca la recomienda todo el año. Como medio recorrido va por pistas entre viñas, los días de calor conviene madrugar.'
		]
	},
	rutes: [
		{
			id: 'sant-miquel-d-olerdola',
			nom: {
				ca: "Des de Sant Miquel d'Olèrdola pel Sant Sepulcre i Can Torres",
				es: "Desde Sant Miquel d'Olèrdola por el Sant Sepulcre y Can Torres"
			},
			sortida: { nom: "Aparcament de davant de l'ajuntament, Sant Miquel d'Olèrdola (180 m)" },
			tempsMinuts: 80,
			tecnicitat: 'cap',
			descripcio: {
				ca: "La fitxa de Xiruca descriu una circular de dificultat baixa, d'uns 8 km, +350 m i 2 h sense parades, que fa el cim a l'1 h 20 min. De l'aparcament creua la C-15 per un pont, passa pel Sant Sepulcre (15 min) i continua per pistes entre vinyes fins a Can Torres (45 min). D'allà, pistes cada cop més boscoses porten a l'entrada de la finca de Cal Jesús, on un cartell indica la senda estreta del cim: 110 m de desnivell en pujada contínua fins a la carena, i una pista de terra fins al punt més alt. Per tancar la volta, Xiruca baixa pel GR 92.3, per una senda pedregosa amb un petit pas de roca inclinat equipat amb una corda; qui el vulgui evitar pot tornar pel camí de pujada.",
				es: 'La ficha de Xiruca describe una circular de dificultad baja, de unos 8 km, +350 m y 2 h sin paradas, que hace cima a la 1 h 20 min. Desde el aparcamiento cruza la C-15 por un puente, pasa por el Sant Sepulcre (15 min) y continúa por pistas entre viñas hasta Can Torres (45 min). Desde allí, pistas cada vez más boscosas llevan a la entrada de la finca de Cal Jesús, donde un cartel indica la senda estrecha de la cima: 110 m de desnivel en subida continua hasta la loma, y una pista de tierra hasta el punto más alto. Para cerrar la vuelta, Xiruca baja por el GR 92.3, por una senda pedregosa con un pequeño paso de roca inclinado equipado con una cuerda; quien quiera evitarlo puede volver por el camino de subida.'
			},
			fonts: [XIRUCA]
		}
	],
	consells: {
		ca: [
			'El pas de la corda és a la baixada pel GR 92.3, passada la casa enrunada de Cal Catantingues: si vas amb nens petits o el terra és moll, torna per on has pujat.',
			"Passat Can Torres, anant cap a la masia de la Barquera, el camí bo trenca a l'esquerra: el marquen un pal petit i una fletxa verda.",
			"La senda del cim arrenca a l'entrada d'una finca particular: segueix el cartell i no entris a la propietat.",
			"El GR 92.3 passa per sobre de la pedrera d'Olèrdola: no surtis de les marques blanques i vermelles.",
			"Xiruca recomana el mapa del Parc del Foix i el Parc d'Olèrdola, d'Editorial Piolet, a 1:20.000."
		],
		es: [
			'El paso de la cuerda está en la bajada por el GR 92.3, pasada la casa en ruinas de Cal Catantingues: si vas con niños pequeños o el suelo está mojado, vuelve por donde has subido.',
			'Pasado Can Torres, yendo hacia la masía de la Barquera, el camino bueno sale a la izquierda: lo marcan un poste pequeño y una flecha verde.',
			'La senda de la cima arranca en la entrada de una finca particular: sigue el cartel y no entres en la propiedad.',
			'El GR 92.3 pasa por encima de la cantera de Olèrdola: no te salgas de las marcas blancas y rojas.',
			"Xiruca recomienda el mapa del Parc del Foix y el Parc d'Olèrdola, de Editorial Piolet, a 1:20.000."
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Penya del Papiol?',
				resposta:
					"La fitxa de Xiruca hi arriba a l'1 h 20 min des de Sant Miquel d'Olèrdola, fent la volta pel Sant Sepulcre i Can Torres. La circular sencera són uns 8 km, +350 m i 2 h sense parades."
			},
			{
				pregunta: 'La Penya del Papiol és difícil?',
				resposta:
					"No: Xiruca la valora de dificultat baixa, i la pujada va per pistes i una senda. L'únic punt delicat és a la baixada pel GR 92.3, on hi ha un petit pas de roca inclinat amb una corda; es pot evitar tornant pel mateix camí."
			},
			{
				pregunta: "Es pot visitar l'ermita del Sant Sepulcre?",
				resposta:
					'Per dins, no. Segons Xiruca és una ermita romànica del segle XII de propietat particular, que es veu prou bé des del camí.'
			},
			{
				pregunta: "D'on ve el nom de Papiol?",
				resposta:
					"De pòpia, segons l'Ajuntament d'Olèrdola: un mot popular per a un turó baix, arrodonit i de base ampla. El topònim consta des de l'any 992."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Penya del Papiol?',
				resposta:
					"La ficha de Xiruca llega a la 1 h 20 min desde Sant Miquel d'Olèrdola, dando la vuelta por el Sant Sepulcre y Can Torres. La circular entera son unos 8 km, +350 m y 2 h sin paradas."
			},
			{
				pregunta: '¿La Penya del Papiol es difícil?',
				resposta:
					'No: Xiruca la valora de dificultad baja, y la subida va por pistas y una senda. El único punto delicado está en la bajada por el GR 92.3, donde hay un pequeño paso de roca inclinado con una cuerda; se puede evitar volviendo por el mismo camino.'
			},
			{
				pregunta: '¿Se puede visitar la ermita del Sant Sepulcre?',
				resposta:
					'Por dentro, no. Según Xiruca es una ermita románica del siglo XII de propiedad particular, que se ve bastante bien desde el camino.'
			},
			{
				pregunta: '¿De dónde viene el nombre de Papiol?',
				resposta:
					'De pòpia, según el Ayuntamiento de Olèrdola: una palabra popular para un cerro bajo, redondeado y de base ancha. El topónimo consta desde el año 992.'
			}
		]
	},
	fonts: [OLERDOLA, VIQUIPEDIA, XIRUCA],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
