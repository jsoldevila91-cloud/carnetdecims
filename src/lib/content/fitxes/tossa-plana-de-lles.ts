import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Pic de la Portelleta (Tossa Plana de Lles)',
	url: 'https://ca.wikipedia.org/wiki/Tossa_Plana_de_Lles',
	consultat: CONSULTAT
};

const RUTES_PIRINEUS_PRADELL = {
	nom: 'Rutes Pirineus: Tossa Plana de Lles des del Pradell',
	url: 'https://www.rutespirineus.cat/rutes/tossa-plana-de-lles-des-del-pradell',
	consultat: CONSULTAT
};

const CERDANYA_ORG = {
	nom: 'Cerdanya.org: Tossa Plana de Lles',
	url: 'https://cerdanya.org/en/ruta/tossa-plana-de-lles/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tossa-plana-de-lles',
	descripcio: {
		ca: [
			"La Tossa Plana de Lles, que a Andorra es coneix com a Pic de la Portelleta, és una muntanya fronterera entre la Baixa Cerdanya, al terme de Lles de Cerdanya, i la parròquia andorrana d'Escaldes-Engordany. Pertany a l'espai protegit de la Tossa Plana de Lles i el Puigpedrós i és una de les set muntanyes d'Andorra que superen els 2.900 m. La roca és una granodiorita.",
			"La ruta normal puja pel vessant de sol de la Cerdanya, per pendents herbosos, i segons Rutes Pirineus no té trams tècnics. Al costat del camí queda el clot de Setut, amb la Bassota i l'Estany Gran, i el coll de Setut, un pas que, segons la mateixa ressenya, feien servir els contrabandistes de la postguerra. A la mateixa carena fronterera hi ha el [Monturull](/cims/monturull) i la [Muga](/cims/la-muga).",
			"Rutes Pirineus destaca, als peus del cim, les valls andorranes del Madriu i de Perafita i, al sud, la cara nord del Cadí. En dies clars, segons la Viquipèdia, la vista arriba a la Maladeta, la Pica d'Estats, bona part del Pallars i d'Andorra i, a llevant, el Conflent i el Canigó.",
			"La temporada va de la primavera a la tardor. A l'hivern, segons Rutes Pirineus, la neu tanca la pista d'accés i la pujada demana raquetes o esquís de muntanya. L'accés amb vehicle privat fins al Pradell és restringit, de manera que, fora dels dies de la llançadora, cal sumar-hi la pujada a peu des del Cap del Rec."
		],
		es: [
			'La Tossa Plana de Lles, que en Andorra se conoce como Pic de la Portelleta, es una montaña fronteriza entre la Baixa Cerdanya, en el término de Lles de Cerdanya, y la parroquia andorrana de Escaldes-Engordany. Pertenece al espacio protegido de la Tossa Plana de Lles y el Puigpedrós y es una de las siete montañas de Andorra que superan los 2.900 m. La roca es una granodiorita.',
			'La ruta normal sube por la vertiente soleada de la Cerdanya, por pendientes herbosas, y según Rutes Pirineus no tiene tramos técnicos. Junto al camino queda el clot de Setut, con la Bassota y el Estany Gran, y el coll de Setut, un paso que, según la misma reseña, usaban los contrabandistas de la posguerra. En la misma cresta fronteriza están el [Monturull](/cims/monturull) y la [Muga](/cims/la-muga).',
			'Rutes Pirineus destaca, a los pies de la cima, los valles andorranos del Madriu y de Perafita y, al sur, la cara norte del Cadí. En días claros, según la Viquipèdia, la vista llega a la Maladeta, la Pica d’Estats, buena parte del Pallars y de Andorra y, a levante, el Conflent y el Canigó.',
			'La temporada va de la primavera al otoño. En invierno, según Rutes Pirineus, la nieve cierra la pista de acceso y la subida pide raquetas o esquís de montaña. El acceso en vehículo privado hasta el Pradell está restringido, de modo que, fuera de los días de la lanzadera, hay que sumar la subida a pie desde el Cap del Rec.'
		]
	},
	rutes: [
		{
			id: 'pradell',
			nom: { ca: 'Des del refugi del Pradell', es: 'Desde el refugio del Pradell' },
			sortida: { nom: 'Refugi del Pradell (Lles de Cerdanya, 2.115 m)' },
			desnivellPositiuM: 790,
			distanciaKm: 3.6,
			tempsMinuts: 135,
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Del refugi del Pradell, a 2.115 m, el camí puja pel vessant de sol entre pins negres, travessa el pla de les Someres i continua per pendents herbosos molt drets i terreny rocós fins al cim. Rutes Pirineus la qualifica de notable, sense trams tècnics però en alta muntanya, i hi compta 7,1 km anada i tornada pel mateix camí. Segons Cerdanya.org, el camí és tènue en alguns punts i es guia amb marques de pintura i fites; a l'últim tram, hi ha un altiplà de granit pedregós.",
				es: 'Desde el refugio del Pradell, a 2.115 m, el camino sube por la vertiente soleada entre pinos negros, atraviesa el pla de les Someres y continúa por pendientes herbosas muy empinadas y terreno rocoso hasta la cima. Rutes Pirineus la califica de notable, sin tramos técnicos pero en alta montaña, y cuenta 7,1 km ida y vuelta por el mismo camino. Según Cerdanya.org, el camino es tenue en algunos puntos y se guía con marcas de pintura e hitos; en el último tramo hay una meseta de granito pedregoso.'
			},
			fonts: [RUTES_PIRINEUS_PRADELL, CERDANYA_ORG]
		},
		{
			id: 'cap-del-rec',
			nom: { ca: 'Des del refugi del Cap del Rec', es: 'Desde el refugio del Cap del Rec' },
			sortida: { nom: 'Refugi del Cap del Rec (Lles de Cerdanya)' },
			desnivellPositiuM: 950,
			tempsMinuts: 150,
			descripcio: {
				ca: "Cerdanya.org proposa sortir del Cap del Rec pel camí 18 (GR 11) fins al Pradell i seguir pel camí 19, marcat amb rectangles grocs. Entra en una pineda i puja pel pendent fort al pla de les Someres (2.335 m), amb una cabana en ruïnes, a uns 35 min del Pradell. D'allà, una carena herbosa porta a l'ampli vessant sud i a l'altiplà pedregós del cim, en unes 2 h 30 min des de la sortida.",
				es: 'Cerdanya.org propone salir del Cap del Rec por el camino 18 (GR 11) hasta el Pradell y seguir por el camino 19, marcado con rectángulos amarillos. Entra en una pineda y sube por la fuerte pendiente al pla de les Someres (2.335 m), con una cabaña en ruinas, a unos 35 min del Pradell. Desde allí, una cresta herbosa lleva a la amplia ladera sur y a la meseta pedregosa de la cima, en unas 2 h 30 min desde la salida.'
			},
			fonts: [CERDANYA_ORG]
		}
	],
	consells: {
		ca: [
			"Del 1 d'agost a l'11 de setembre hi ha una llançadora des del refugi del Cap del Rec fins al Pradell; la resta de l'any, el camí 18 puja a peu pel mateix itinerari.",
			'No hi ha fonts a la ruta: porta aigua per a tot el dia.',
			"El refugi del Pradell sol estar tancat; les claus es demanen amb antelació al Cap del Rec o a l'Ajuntament de Lles de Cerdanya.",
			"El camí és tènue a la part alta: fixa't en les marques de pintura i no segueixis el corriol cap a la bassa de Setut.",
			'Gran part del recorregut és exposat al sol: porta protecció solar i gorra fins i tot els dies frescos.'
		],
		es: [
			'Del 1 de agosto al 11 de septiembre hay una lanzadera desde el refugio del Cap del Rec hasta el Pradell; el resto del año, el camino 18 sube a pie por el mismo itinerario.',
			'No hay fuentes en la ruta: lleva agua para todo el día.',
			'El refugio del Pradell suele estar cerrado; las llaves se piden con antelación en el Cap del Rec o en el Ayuntamiento de Lles de Cerdanya.',
			'El camino es tenue en la parte alta: fíjate en las marcas de pintura y no sigas la senda hacia la bassa de Setut.',
			'Gran parte del recorrido está expuesto al sol: lleva protección solar y gorra incluso los días frescos.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Tossa Plana de Lles?',
				resposta:
					'Rutes Pirineus dona 2 h 15 min de pujada des del Pradell, amb uns 790 m de desnivell. Cerdanya.org en calcula 2 h 30 min des del Cap del Rec, amb uns 950 m.'
			},
			{
				pregunta: 'És un cim tècnic?',
				resposta:
					"Segons Rutes Pirineus, no té trams tècnics, però el terreny és d'alta muntanya i el temps hi canvia ràpid. Cerdanya.org avisa que el camí és tènue en alguns punts de la part alta."
			},
			{
				pregunta: "Es pot pujar a l'hivern?",
				resposta:
					"Rutes Pirineus indica que la neu tanca la pista d'accés a l'hivern i suggereix raquetes o esquís de muntanya si hi ha condicions. Consulta la predicció de Meteocat i l'estat de la neu abans."
			},
			{
				pregunta: 'La Tossa Plana de Lles compta com a cim essencial?',
				resposta:
					'Sí. Dels quatre essencials de la Cerdanya, només el [Puigpedrós](/cims/puigpedros) és més alt. La [Muga](/cims/la-muga) i la [Carabassa](/cims/la-carabassa) queden per sota.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Tossa Plana de Lles?',
				resposta:
					'Rutes Pirineus da 2 h 15 min de subida desde el Pradell, con unos 790 m de desnivel. Cerdanya.org calcula 2 h 30 min desde el Cap del Rec, con unos 950 m.'
			},
			{
				pregunta: '¿Es una cima técnica?',
				resposta:
					'Según Rutes Pirineus, no tiene tramos técnicos, pero el terreno es de alta montaña y el tiempo cambia rápido. Cerdanya.org avisa de que el camino es tenue en algunos puntos de la parte alta.'
			},
			{
				pregunta: '¿Se puede subir en invierno?',
				resposta:
					'Rutes Pirineus indica que la nieve cierra la pista de acceso en invierno y sugiere raquetas o esquís de montaña si hay condiciones. Consulta la predicción de Meteocat y el estado de la nieve antes.'
			},
			{
				pregunta: '¿La Tossa Plana de Lles cuenta como cima esencial?',
				resposta:
					'Sí. De las cuatro esenciales de la Cerdaña, solo el [Puigpedrós](/cims/puigpedros) es más alto. La [Muga](/cims/la-muga) y la [Carabassa](/cims/la-carabassa) quedan por debajo.'
			}
		]
	},
	fonts: [VIQUIPEDIA, RUTES_PIRINEUS_PRADELL, CERDANYA_ORG],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
