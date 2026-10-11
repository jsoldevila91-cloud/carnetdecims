import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Lo Tormo',
	url: 'https://ca.wikipedia.org/wiki/Lo_Tormo',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Lo Tormo',
	url: 'https://reptesmuntanyencs.cat/lo-tormo/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'lo-tormo',
	descripcio: {
		ca: [
			"Lo Tormo és un cim de [la Ribera d'Ebre](/comarques/ribera-d-ebre), al punt on la serra dels Morers s'ajunta amb la serra del Tormo, que fa de partió entre el terme de la Torre de l'Espanyol, al nord, i el de Garcia, al sud. És una cresta rocosa curta, sobre la plana de Vinebre i el curs de l'Ebre, amb un vèrtex geodèsic al punt més alt.",
			"El cim que compta per al repte és el del vèrtex. Segons l'escala del mapa, el nom apareix també sobre una punta més baixa, una mica més a ponent, i a llevant hi ha encara lo Piló, uns metres més alt que el vèrtex. Al peu de la serra, l'ermita de Santa Magdalena està construïda a l'abric d'una gran balma, sota una paret de roca; el dissabte després de Pasqua s'hi fa un aplec amb subhasta de coques i ball de jotes.",
			"Des de la cresta es veuen la plana de Vinebre i la central nuclear d'Ascó, i des de l'esplanada de l'ermita, el Priorat, la serra de Llaberia i les muntanyes de Vandellòs. Els altres dos cims essencials de la comarca són [la Picossa](/cims/la-picossa) i [la Tossa de Tivissa](/cims/la-tossa-tivissa).",
			"És una sortida molt curta, però de cresta: amb vent fort, roca molla o gel canvia del tot. Qui no s'hi trobi còmode pot evitar els trams més aeris passant per sota de la carena."
		],
		es: [
			"Lo Tormo es una cima de [la Ribera d'Ebre](/comarques/ribera-d-ebre), en el punto donde la sierra dels Morers se junta con la sierra del Tormo, que hace de linde entre el término de la Torre de l'Espanyol, al norte, y el de Garcia, al sur. Es una cresta rocosa corta, sobre el llano de Vinebre y el curso del Ebro, con un vértice geodésico en el punto más alto.",
			'La cima que cuenta para el reto es la del vértice. Según la escala del mapa, el nombre aparece también sobre una punta más baja, algo más a poniente, y a levante está además lo Piló, unos metros más alto que el vértice. Al pie de la sierra, la ermita de Santa Magdalena está construida al abrigo de una gran balma, bajo una pared de roca; el sábado después de Pascua se celebra allí una romería con subasta de cocas y baile de jotas.',
			'Desde la cresta se ven el llano de Vinebre y la central nuclear de Ascó, y desde la explanada de la ermita, el Priorat, la sierra de Llaberia y las montañas de Vandellòs. Las otras dos cimas esenciales de la comarca son [la Picossa](/cims/la-picossa) y [la Tossa de Tivissa](/cims/la-tossa-tivissa).',
			'Es una salida muy corta, pero de cresta: con viento fuerte, roca mojada o hielo cambia por completo. Quien no se sienta cómodo puede evitar los tramos más aéreos pasando por debajo de la cresta.'
		]
	},
	rutes: [
		{
			id: 'santa-magdalena',
			nom: {
				ca: "Circular des de l'ermita de Santa Magdalena",
				es: 'Circular desde la ermita de Santa Magdalena'
			},
			sortida: { nom: 'Ermita de Santa Magdalena' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "La ressenya del bloc Reptes Muntanyencs (2015) fa una volta de 5,6 km i 351 m de desnivell positiu en 1 h 25 min de marxa, amb el cim a 2,7 km i uns 50 minuts de la sortida. De l'ermita, on s'arriba per una pista de formigó, es recula un tros fins a un sender marcat amb una fita, que puja cap a la carena. Un cop a dalt se segueix la cresta per una traça mig perduda entre la vegetació: no és difícil, però té algun tram curt aeri si es va arran del caire. Del vèrtex es baixa cap al sud-est, es passa per lo Piló i s'arriba al coll del pla de la Mola, on es troba el camí que puja de la Torre de l'Espanyol; per la dreta es torna a l'ermita.",
				es: "La reseña del blog Reptes Muntanyencs (2015) hace una vuelta de 5,6 km y 351 m de desnivel positivo en 1 h 25 min de marcha, con la cima a 2,7 km y unos 50 minutos de la salida. Desde la ermita, adonde se llega por una pista de hormigón, se retrocede un trecho hasta un sendero marcado con un hito, que sube hacia la cresta. Una vez arriba se sigue la cresta por una traza medio perdida entre la vegetación: no es difícil, pero tiene algún tramo corto aéreo si se va por el filo. Del vértice se baja hacia el sureste, se pasa por lo Piló y se llega al coll del pla de la Mola, donde se encuentra el camino que sube de la Torre de l'Espanyol; por la derecha se vuelve a la ermita."
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'És un recorregut per a gent acostumada a caminar per crestes. Si et fa respecte, no vagis pel caire: el costat dret, en el sentit de pujada, és més tranquil.',
			'Deixa-ho estar amb vent fort, roca molla o gel.',
			'No hi ha senyals de pintura, només fites i una traça que a estones es perd.',
			"L'aigua de la font de l'ermita no té garantia sanitària: porta la teva.",
			"La majoria de ressenyes pugen des de la Torre de l'Espanyol, pel camí que arriba al coll del pla de la Mola."
		],
		es: [
			'Es un recorrido para gente acostumbrada a andar por crestas. Si te impone, no vayas por el filo: el lado derecho, en el sentido de subida, es más tranquilo.',
			'Déjalo estar con viento fuerte, roca mojada o hielo.',
			'No hay señales de pintura, solo hitos y una traza que a ratos se pierde.',
			'El agua de la fuente de la ermita no tiene garantía sanitaria: lleva la tuya.',
			"La mayoría de reseñas suben desde la Torre de l'Espanyol, por el camino que llega al coll del pla de la Mola."
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Tormo?',
				resposta:
					"Des de l'ermita de Santa Magdalena, uns 50 minuts fins al vèrtex i 1 h 25 min de marxa per a tota la volta de 5,6 km, segons el bloc Reptes Muntanyencs."
			},
			{
				pregunta: 'La cresta és perillosa?',
				resposta:
					"No té passos difícils i és prou ampla, llevat d'un parell de trams molt curts que són aeris si es va pel caire. Es poden evitar per sota. Amb vent, pluja o gel, però, no és recomanable."
			},
			{
				pregunta: "Quin és el cim bo, el del vèrtex o l'altre?",
				resposta:
					'Per al repte, el del vèrtex geodèsic. La punta de ponent és més baixa, i lo Piló, a llevant, tot i ser una mica més alt, no és el cim de la llista.'
			},
			{
				pregunta: 'Lo Tormo compta com a cim essencial?',
				resposta: "Sí, és un dels tres [cims essencials](/cims-essencials) de la Ribera d'Ebre."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Tormo?',
				resposta:
					'Desde la ermita de Santa Magdalena, unos 50 minutos hasta el vértice y 1 h 25 min de marcha para toda la vuelta de 5,6 km, según el blog Reptes Muntanyencs.'
			},
			{
				pregunta: '¿La cresta es peligrosa?',
				resposta:
					'No tiene pasos difíciles y es bastante ancha, salvo un par de tramos muy cortos que son aéreos si se va por el filo. Se pueden evitar por debajo. Con viento, lluvia o hielo, en cambio, no es recomendable.'
			},
			{
				pregunta: '¿Cuál es la cima buena, la del vértice o la otra?',
				resposta:
					'Para el reto, la del vértice geodésico. La punta de poniente es más baja, y lo Piló, a levante, aunque es algo más alto, no es la cima de la lista.'
			},
			{
				pregunta: '¿Lo Tormo cuenta como cima esencial?',
				resposta: "Sí, es una de las tres [cimas esenciales](/cims-essencials) de la Ribera d'Ebre."
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
