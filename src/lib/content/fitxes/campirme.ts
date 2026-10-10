import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Campirme',
	url: 'https://ca.wikipedia.org/wiki/Campirme',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Campirme',
	url: 'https://reptesmuntanyencs.cat/campirme/',
	consultat: CONSULTAT
};

const PARC = {
	nom: "Parc Natural de l'Alt Pirineu: pautes i consells per als visitants",
	url: 'https://parcsnaturals.gencat.cat/en/xarxa-de-parcs/alt-pirineu/gaudeix-del-parc/consells/pautes-i-consells/index.html',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'campirme',
	descripcio: {
		ca: [
			"El Campirme és el punt més alt de la serra de Campirme, a [la comarca del Pallars Sobirà](/comarques/pallars-sobira). El cim marca el límit entre dos termes: el de la Guingueta d'Àneu (l'antic terme d'Unarre) i el de la Vall de Cardós (l'antic Estaon). Segons la Viquipèdia, és a l'extrem nord d'Estaon, al nord-est d'Unarre, entre el turó de Vialada, al sud, i el coll de Finestres, al nord. Queda dins el Parc Natural de l'Alt Pirineu, és de gres i lutita i al cim hi ha un vèrtex geodèsic.",
			"Té una prominència de només 79 m: el que dona caràcter a la pujada és el recorregut i el terreny. Reptes Muntanyencs la fa en una volta circular que surt de Gavàs, puja pel barranc dels Rumiets i torna per la carena fins al coll del cap de Socorto (Montalto als mapes d'Alpina). El terreny és obert i amable, amb una ginesta atapeïda als vessants baixos i trams sense camí. Al vessant de pujada al cim hi ha velles trinxeres, que l'autor atribueix al bàndol nacional de la Guerra Civil, i prop del coll, una cabana de pedra seca que pot servir d'aixopluc en cas de necessitat.",
			"Des del cim, l'autor destaca el pic de Pilàs, molt a prop, i els estanys que el mapa de l'ICGC anomena de Campirme i Editorial Alpina, de Soliguera.",
			"L'època més còmoda és de finals de primavera a la tardor, quan la carena és neta de neu; la ressenya és d'un dia d'agost. A l'estiu, surt d'hora per evitar la calor dels vessants baixos i les tempestes de tarda."
		],
		es: [
			'El Campirme es el punto más alto de la sierra de Campirme, en [la comarca del Pallars Sobirà](/comarques/pallars-sobira). La cima marca el límite entre dos términos: el de La Guingueta d’Àneu (el antiguo término de Unarre) y el de la Vall de Cardós (el antiguo Estaon). Según la Viquipèdia, está en el extremo norte de Estaon, al nordeste de Unarre, entre el turó de Vialada, al sur, y el coll de Finestres, al norte. Queda dentro del Parque Natural del Alt Pirineu, es de arenisca y lutita y en la cima hay un vértice geodésico.',
			'Tiene una prominencia de solo 79 m: lo que da carácter a la subida es el recorrido y el terreno. Reptes Muntanyencs la hace en una vuelta circular que sale de Gavàs, sube por el barranc dels Rumiets y vuelve por la cresta hasta el collado del cap de Socorto (Montalto en los mapas de Alpina). El terreno es abierto y amable, con una retama tupida en las laderas bajas y tramos sin camino. En la vertiente de subida a la cima hay viejas trincheras, que el autor atribuye al bando nacional de la Guerra Civil, y cerca del collado, una cabaña de piedra seca que puede servir de cobijo en caso de necesidad.',
			'Desde la cima, el autor destaca el pic de Pilàs, muy cerca, y los lagos que el mapa del ICGC llama de Campirme y Editorial Alpina, de Soliguera.',
			'La época más cómoda va de finales de primavera al otoño, cuando la cresta está limpia de nieve; la reseña es de un día de agosto. En verano, sal temprano para evitar el calor de las laderas bajas y las tormentas de tarde.'
		]
	},
	rutes: [
		{
			id: 'gavas',
			nom: {
				ca: 'Circular des de Gavàs pel cap de Socorto',
				es: 'Circular desde Gavàs por el cap de Socorto'
			},
			sortida: { nom: 'Gavàs (Vall de Cardós), aparcament al final de la carretera' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "Reptes Muntanyencs surt de l'aparcament de Gavàs, on s'arriba en cotxe normal per carretera asfaltada. La volta combina senders i trams fora de camí, amb la ginesta com a obstacle, i només a l'inici es conserven vells senyals de pintura groga. Segons l'autor, no hi ha dificultats tècniques: l'exigència és física i ve de la manca de camí en diversos trams. Compta 18,4 km, 1.430 m de desnivell, 5 h 5 min de marxa i 1 h d'aturades; el cim s'assoleix cap a les 3 h de la sortida.",
				es: 'Reptes Muntanyencs sale del aparcamiento de Gavàs, adonde se llega en coche normal por carretera asfaltada. La vuelta combina senderos y tramos fuera de camino, con la retama como obstáculo, y solo al inicio se conservan viejas señales de pintura amarilla. Según el autor, no hay dificultades técnicas: la exigencia es física y viene de la falta de camino en varios tramos. Cuenta 18,4 km, 1.430 m de desnivel, 5 h 5 min de marcha y 1 h de paradas; la cima se alcanza hacia las 3 h de la salida.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"Porta mapa o GPS amb el track: l'orientació és moderada segons Reptes Muntanyencs i només hi ha senyals de pintura groga, vells, al començament.",
			"La ginesta i la vegetació baixa fora de camí s'enganxen a les cames: pantalons llargs o polaines ajuden a la pujada final.",
			"Pel recorregut hi ha una cabana de pedra seca que pot servir d'aixopluc en cas de necessitat, sense comptar-hi per dormir.",
			"El parc natural només permet el bivac per sobre dels 2.000 m, de 20 h a 8 h i una sola nit al mateix lloc. No es poden encendre focs i els gossos han d'anar lligats."
		],
		es: [
			'Lleva mapa o GPS con el track: la orientación es moderada según Reptes Muntanyencs y solo hay señales de pintura amarilla, viejas, al comienzo.',
			'La retama y la vegetación baja fuera de camino se enganchan en las piernas: pantalones largos o polainas ayudan en la subida final.',
			'En el recorrido hay una cabaña de piedra seca que puede servir de cobijo en caso de necesidad, sin contar con ella para dormir.',
			'El parque natural solo permite el vivac por encima de los 2.000 m, de 20 h a 8 h y una sola noche en el mismo lugar. No se pueden encender fuegos y los perros deben ir atados.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Campirme?',
				resposta:
					"Reptes Muntanyencs hi arriba cap a les 3 h de la sortida de Gavàs. La volta circular sencera, de 18,4 km i 1.430 m de desnivell, suma 5 h 5 min de marxa més 1 h d'aturades."
			},
			{
				pregunta: 'El Campirme té passos difícils?',
				resposta:
					"No, segons l'autor de la ressenya, que no hi troba dificultats tècniques. Sí que és exigent físicament, sobretot per la llargada i pels trams sense camí."
			},
			{
				pregunta: 'Es pot fer amb nens?',
				resposta:
					"Reptes Muntanyencs en valora l'exigència física d'alta, amb un recorregut de més de 18 km. No és una sortida per a infants, ni tampoc per fer en un dia amb mala visibilitat."
			},
			{
				pregunta: 'El Campirme compta com a cim essencial?',
				resposta:
					"Sí, és un dels onze [cims essencials](/cims-essencials) del Pallars Sobirà i el segon més baix, amb 2.633 m, per sobre només de la [Torreta de l'Orri](/cims/torreta-de-l-orri)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Campirme?',
				resposta:
					'Reptes Muntanyencs llega hacia las 3 h de la salida de Gavàs. La vuelta circular entera, de 18,4 km y 1.430 m de desnivel, suma 5 h 5 min de marcha más 1 h de paradas.'
			},
			{
				pregunta: '¿El Campirme tiene pasos difíciles?',
				resposta:
					'No, según el autor de la reseña, que no encuentra dificultades técnicas. Sí es exigente físicamente, sobre todo por la longitud y por los tramos sin camino.'
			},
			{
				pregunta: '¿Se puede hacer con niños?',
				resposta:
					'Reptes Muntanyencs valora la exigencia física de alta, con un recorrido de más de 18 km. No es una salida para niños, ni tampoco para hacer en un día con mala visibilidad.'
			},
			{
				pregunta: '¿El Campirme cuenta como cima esencial?',
				resposta:
					'Sí, es una de las once [cimas esenciales](/cims-essencials) del Pallars Sobirà y la segunda más baja, con 2.633 m, por encima solo de la [Torreta de l’Orri](/cims/torreta-de-l-orri).'
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES, PARC],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
