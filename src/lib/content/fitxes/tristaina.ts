import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VISIT_ORDINO_PIC = {
	nom: 'VisitOrdino: Pic de Tristaina',
	url: 'https://www.visitordino.com/ca/que-fer/@@route_view/pic-de-tristaina',
	consultat: CONSULTAT
};

const VISIT_ANDORRA = {
	nom: 'Visit Andorra: ruta de senderisme dels estanys de Tristaina',
	url: 'https://visitandorra.com/en/nature--sports/hiking-route-estanys-de-tristaina/',
	consultat: CONSULTAT
};

const ENGARRISTA = {
	nom: 'Engarrista: pics de Tristaina i estany Forcat',
	url: 'https://www.engarrista.com/node/638',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tristaina',
	descripcio: {
		ca: [
			"La Tristaina és la muntanya que tanca pel nord la vall d'Arcalís, a la parròquia d'Ordino, [a Andorra](/comarques/andorra). La seva carena fa de frontera amb França i té diverses puntes; la més alta és el pic de Tristaina, el que compta per al repte. Als peus, en un circ glacial obert al sud, hi ha els tres estanys de Tristaina, un dels paisatges d'alta muntanya més visitats del país.",
			"Tot el sector és dins del domini d'Ordino-Arcalís, i l'estació d'esquí fa que el punt de partida ja sigui a més de 2.000 m. Al començament del camí dels estanys hi ha l'escultura Arcalís 91, de l'artista Mauro Staccioli. Els estanys s'escalonen al llarg de la pujada: el Primer, el del Mig i el de Més Amunt, l'últim a uns 2.330 m segons Visit Andorra. Per sobre, el camí abandona la zona de passeig i entra en terreny de muntanya de debò.",
			"VisitOrdino reconeix que no és dels cims més alts d'Andorra, però el recomana per les vistes. Des de la carena fronterera es dominen alhora els estanys de Tristaina, a un costat, i les valls de l'Arieja, a l'altre. A la mateixa parròquia d'Ordino hi ha un altre cim essencial ben diferent, el [Casamanya](/cims/casamanya-nord), i a l'oest s'aixeca el [Comapedrosa](/cims/comapedrosa), sostre del país.",
			"La temporada habitual per pujar a peu va de juliol a principi d'octubre; abans hi sol haver neu a les canals i a la tartera de sota la carena. A l'estiu, la carretera d'Arcalís es talla al trànsit durant el dia, i les tempestes de tarda són freqüents: comença d'hora per poder-les evitar."
		],
		es: [
			'La Tristaina es la montaña que cierra por el norte el valle de Arcalís, en la parroquia de Ordino, [en Andorra](/comarques/andorra). Su cresta hace de frontera con Francia y tiene varias puntas; la más alta es el pic de Tristaina, el que cuenta para el reto. A sus pies, en un circo glaciar abierto al sur, están los tres lagos de Tristaina, uno de los paisajes de alta montaña más visitados del país.',
			'Todo el sector está dentro del dominio de Ordino-Arcalís, y la estación de esquí hace que el punto de partida ya esté a más de 2.000 m. Al principio del camino de los lagos está la escultura Arcalís 91, del artista Mauro Staccioli. Los lagos se escalonan a lo largo de la subida: el Primer, el del Mig y el de Més Amunt, el último a unos 2.330 m según Visit Andorra. Por encima, el camino deja la zona de paseo y entra en terreno de montaña de verdad.',
			'VisitOrdino reconoce que no es de las cimas más altas de Andorra, pero la recomienda por las vistas. Desde la cresta fronteriza se dominan a la vez los lagos de Tristaina, a un lado, y los valles del Ariège, al otro. En la misma parroquia de Ordino hay otra cima esencial muy distinta, el [Casamanya](/cims/casamanya-nord), y al oeste se alza el [Comapedrosa](/cims/comapedrosa), techo del país.',
			'La temporada habitual para subir a pie va de julio a principios de octubre; antes suele haber nieve en las canales y en la pedrera bajo la cresta. En verano, la carretera de Arcalís se corta al tráfico durante el día, y las tormentas de tarde son frecuentes: empieza temprano para poder evitarlas.'
		]
	},
	rutes: [
		{
			id: 'arcalis',
			nom: {
				ca: "Des de la coma d'Arcalís pels estanys",
				es: "Desde la coma d'Arcalís por los lagos"
			},
			sortida: { nom: "Coma d'Arcalís (estació d'Ordino-Arcalís)" },
			desnivellPositiuM: 680,
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "És la ruta normal. Se surt de la coma d'Arcalís i es puja pel sender dels estanys, molt ben marcat amb punts grocs, fins a l'estany del Mig i el de Més Amunt. Allà es deixa l'estany i comença la pujada forta: primer una tartera i després un pendent dret amb alguna grimpada petita fins a la carena, que se segueix cap a la dreta uns 200 m fins al cim. VisitOrdino la qualifica de difícil i hi indica passos perillosos: uns 6 km i 680 m de desnivell, unes 4 h en total.",
				es: "Es la ruta normal. Se sale de la coma d'Arcalís y se sube por el sendero de los lagos, muy bien marcado con puntos amarillos, hasta el lago del Mig y el de Més Amunt. Allí se deja el lago y empieza la subida fuerte: primero una pedrera y después una pendiente empinada con alguna trepada corta hasta la cresta, que se sigue hacia la derecha unos 200 m hasta la cima. VisitOrdino la califica de difícil e indica pasos peligrosos: unos 6 km y 680 m de desnivel, unas 4 h en total."
			},
			fonts: [VISIT_ORDINO_PIC, ENGARRISTA]
		}
	],
	consells: {
		ca: [
			"De final de juny a mitjan setembre, la carretera d'Arcalís es tanca als cotxes de 8.30 h a 17.30 h; en aquest horari s'hi pot pujar amb el telecabina de Tristaina. Consulta horaris i preus a l'estació abans d'anar-hi.",
			"Fins als estanys el camí és un passeig familiar; a partir de l'estany de Més Amunt la pujada és una altra cosa. Si vas amb nens, els estanys ja són una bona sortida.",
			"A la tartera i a la pujada a la carena hi pot haver pedres soltes: no pugis just a sota d'un altre grup i porta casc si en tens.",
			"Amb neu, la pala de sota la carena és dreta i exposada: calen grampons, piolet i experiència, i cal consultar el butlletí de perill d'allaus."
		],
		es: [
			'De finales de junio a mediados de septiembre, la carretera de Arcalís se cierra a los coches de 8.30 h a 17.30 h; en ese horario se puede subir con el telecabina de Tristaina. Consulta horarios y precios en la estación antes de ir.',
			'Hasta los lagos el camino es un paseo familiar; a partir del lago de Més Amunt la subida es otra cosa. Si vas con niños, los lagos ya son una buena salida.',
			'En la pedrera y en la subida a la cresta puede haber piedras sueltas: no subas justo debajo de otro grupo y lleva casco si tienes.',
			'Con nieve, la pala bajo la cresta es empinada y expuesta: hacen falta crampones, piolet y experiencia, y hay que consultar el boletín de peligro de aludes.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al pic de Tristaina?',
				resposta:
					"VisitOrdino calcula unes 4 h per a tot el recorregut des de la coma d'Arcalís, amb uns 6 km i 680 m de desnivell. Compta amb més temps si hi afegeixes parades als estanys."
			},
			{
				pregunta: 'El pic de Tristaina és difícil?',
				resposta:
					'Fins als estanys, no. La pujada final, en canvi, té una tartera, molt pendent i alguna grimpada petita, i VisitOrdino la classifica com a difícil i amb passos perillosos. Cal peu segur i bon temps.'
			},
			{
				pregunta: 'Es pot fer amb nens?',
				resposta:
					'La ruta dels estanys de Tristaina, sí: Visit Andorra la considera fàcil. El cim ja no és una sortida per a mainada petita, per la tartera i la grimpada final.'
			},
			{
				pregunta: 'La Tristaina compta com a cim essencial?',
				resposta:
					"Sí, és un dels [cims essencials](/cims-essencials) d'Andorra. Pots consultar com es valida a la [normativa del repte](/repte-100-cims/normativa)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al pic de Tristaina?',
				resposta:
					"VisitOrdino calcula unas 4 h para todo el recorrido desde la coma d'Arcalís, con unos 6 km y 680 m de desnivel. Cuenta con más tiempo si añades paradas en los lagos."
			},
			{
				pregunta: '¿El pic de Tristaina es difícil?',
				resposta:
					'Hasta los lagos, no. La subida final, en cambio, tiene una pedrera, mucha pendiente y alguna trepada corta, y VisitOrdino la clasifica como difícil y con pasos peligrosos. Hace falta pie seguro y buen tiempo.'
			},
			{
				pregunta: '¿Se puede hacer con niños?',
				resposta:
					'La ruta de los lagos de Tristaina, sí: Visit Andorra la considera fácil. La cima ya no es una salida para niños pequeños, por la pedrera y la trepada final.'
			},
			{
				pregunta: '¿La Tristaina cuenta como cima esencial?',
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) de Andorra. Puedes consultar cómo se valida en la [normativa del reto](/repte-100-cims/normativa).'
			}
		]
	},
	fonts: [VISIT_ORDINO_PIC, VISIT_ANDORRA, ENGARRISTA],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
