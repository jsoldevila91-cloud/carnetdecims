import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Creu de Santos',
	url: 'https://ca.wikipedia.org/wiki/Creu_de_Santos',
	consultat: CONSULTAT
};

const GEC_CIM = {
	nom: 'Gran Enciclopèdia Catalana: la Creu de Santos',
	url: 'https://www.enciclopedia.cat/gran-enciclopedia-catalana/la-creu-de-santos',
	consultat: CONSULTAT
};

const GEC_SERRA = {
	nom: 'Gran Enciclopèdia Catalana: serra de Cardó',
	url: 'https://www.enciclopedia.cat/gran-enciclopedia-catalana/serra-de-cardo',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Xàquera o Creu de Santos',
	url: 'https://reptesmuntanyencs.cat/xaquera-o-creu-de-santos/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'creu-de-santos',
	descripcio: {
		ca: [
			"La Creu de Santos, també coneguda com la Xàquera o el Tossal de Santos, és el cim culminant de la serra de Cardó, [al Baix Ebre](/comarques/baix-ebre). La Gran Enciclopèdia Catalana la descriu com a termenal dels municipis de Tivenys i Benifallet, i la Viquipèdia hi afegeix Rasquera, a la Ribera d'Ebre. Domina el portell de Xàquera i, segons la Viquipèdia, és de dolomia i queda dins l'espai protegit de les Serres de Cardó-el Boix.",
			"La serra de Cardó és, segons l'Enciclopèdia, un massís de la Serralada Prelitoral de calcàries del Triàsic i el Juràssic carstificades: l'aigua de pluja circula pel subsòl i alimenta uns brolladors medicinals a la cinglera del Sallent, on hi ha el Balneari de Cardó, instal·lat en un antic convent de carmelites. La carena també divideix les aigües que van a l'Ebre de les que van a la mar; els camins vells que la creuen, com el portell de Xàquera, comuniquen amb Tivenys, Tortosa, Rasquera i Móra d'Ebre.",
			"A la serra, l'obaga té alzines, pins, alguns roures, moixeres i teixos, exposats al mestral, i la solana, un matollar degradat de llentiscle, romaní i bruc amb pins blancs i alzines. L'Enciclopèdia anota que els nuclis medievals de Sallent, Cardó i Costumà, i els de la Fullola, la Bassa de Cascall, els Mallorquins, l'Alzina i l'Alentar, han desaparegut del tot.",
			"El cim té dues cimeres properes: la de l'est, amb una gran creu, i la de ponent, amb vèrtex geodèsic, una creu metàl·lica, un pessebre i una caixa de registre, segons la Viquipèdia. El bloc Reptes Muntanyencs hi destaca les vistes amples, amb el delta de l'Ebre, i apunta que l'ascensió no és per fer a l'estiu ni en dies de pluja."
		],
		es: [
			"La Creu de Santos, también conocida como la Xàquera o el Tossal de Santos, es la cima culminante de la sierra de Cardó, [en el Baix Ebre](/comarques/baix-ebre). La Gran Enciclopèdia Catalana la describe como límite de los municipios de Tivenys y Benifallet, y la Viquipèdia añade Rasquera, en la Ribera d'Ebre. Domina el portell de Xàquera y, según la Viquipèdia, es de dolomía y queda dentro del espacio protegido de las Serres de Cardó-el Boix.",
			"La sierra de Cardó es, según la Enciclopèdia, un macizo de la Serralada Prelitoral de calizas del Triásico y el Jurásico karstificadas: el agua de lluvia circula por el subsuelo y alimenta unos manantiales medicinales en el acantilado del Sallent, donde está el Balneari de Cardó, instalado en un antiguo convento de carmelitas. La cresta también divide las aguas que van al Ebro de las que van al mar; los caminos viejos que la cruzan, como el portell de Xàquera, comunican con Tivenys, Tortosa, Rasquera y Móra d'Ebre.",
			"En la sierra, la umbría tiene encinas, pinos, algunos robles, mostajos y tejos, expuestos al mistral, y la solana, un matorral degradado de lentisco, romero y brezo con pinos blancos y encinas. La Enciclopèdia anota que los núcleos medievales de Sallent, Cardó y Costumà, y los de la Fullola, la Bassa de Cascall, els Mallorquins, l'Alzina y l'Alentar, han desaparecido por completo.",
			'La cima tiene dos cumbres próximas: la del este, con una gran cruz, y la de poniente, con vértice geodésico, una cruz metálica, un nacimiento y un buzón de registro, según la Viquipèdia. El blog Reptes Muntanyencs destaca las vistas amplias, con el delta del Ebro, y apunta que la ascensión no es para hacer en verano ni en días de lluvia.'
		]
	},
	rutes: [
		{
			id: 'tivenys-carretera-de-cardo',
			nom: {
				ca: 'Circular des de Tivenys per la carretera de Cardó',
				es: 'Circular desde Tivenys por la carretera de Cardó'
			},
			sortida: { nom: 'Tivenys (carretera de Cardó)' },
			descripcio: {
				ca: "Reptes Muntanyencs documenta una circular que surt de Tivenys per la carretera de Cardó, amb pistes i senders: uns 13 km, uns 834 m de desnivell positiu i 4 h 7 min de marxa efectiva. Segons el seu track, la Creu de Xàquera s'assoleix a 1 h 34 min i la Creu de Santos a 1 h 40 min, a uns 4,7 km de la sortida. El bloc recorda que no és una proposta per fer a l'estiu ni en dies de pluja, que no s'hi troba aigua enlloc, que el recorregut no és gaire complicat i que cal no perdre els senyals de pintura (grogues i vermelles) ni les fites de pedra; també esmenta les restes del corral o casa del Moreno.",
				es: 'Reptes Muntanyencs documenta una circular que sale de Tivenys por la carretera de Cardó, con pistas y senderos: unos 13 km, unos 834 m de desnivel positivo y 4 h 7 min de marcha efectiva. Según su track, la Creu de Xàquera se alcanza a 1 h 34 min y la Creu de Santos a 1 h 40 min, a unos 4,7 km de la salida. El blog recuerda que no es una propuesta para hacer en verano ni en días de lluvia, que no se encuentra agua en ningún sitio, que el recorrido no es muy complicado y que hay que no perder las señales de pintura (amarillas y rojas) ni los hitos de piedra; también menciona los restos del corral o casa del Moreno.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"Segons el bloc, aquesta ruta no és per fer a l'estiu ni en dies de pluja. Tria un dia sec i de temperatura moderada.",
			"El bloc indica que no es troba aigua enlloc: porta tota l'aigua des de la sortida.",
			'Hi ha trams on cal no perdre els senyals de pintura i les fites de pedra; amb boira, no improvisis.',
			'Del cim al corral del Moreno les senyals de pintura grogues són difícils de veure, segons el bloc: tingues el track a punt.',
			"Telèfon d'emergències: 112."
		],
		es: [
			'Según el blog, esta ruta no es para hacer en verano ni en días de lluvia. Elige un día seco y de temperatura moderada.',
			'El blog indica que no se encuentra agua en ningún sitio: lleva toda el agua desde la salida.',
			'Hay tramos donde no hay que perder las señales de pintura y los hitos de piedra; con niebla, no improvises.',
			'De la cima al corral del Moreno las señales de pintura amarillas son difíciles de ver, según el blog: ten el track a punto.',
			'Teléfono de emergencias: 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Creu de Santos?',
				resposta:
					"Reptes Muntanyencs documenta una circular d'uns 13 km des de Tivenys amb 4 h 7 min de marxa efectiva; segons el seu track, la Creu de Santos s'assoleix a 1 h 40 min de la sortida."
			},
			{
				pregunta: 'És difícil?',
				resposta:
					"El bloc diu que el recorregut no és gaire complicat, però que cal seguir bé les senyals de pintura i les fites i que no és una ruta per a l'estiu ni per a dies de pluja."
			},
			{
				pregunta: 'Hi ha aigua pel camí?',
				resposta: 'El bloc indica que no es troba aigua enlloc; porta tota la que necessitis.'
			},
			{
				pregunta: 'La Creu de Santos compta com a cim essencial?',
				resposta:
					"Sí, és un dels [cims essencials](/cims-essencials) del Baix Ebre, amb el [Tossal d'Engrilló](/cims/tossal-d-engrillo) i el [Caro](/cims/caro)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Creu de Santos?',
				resposta:
					'Reptes Muntanyencs documenta una circular de unos 13 km desde Tivenys con 4 h 7 min de marcha efectiva; según su track, la Creu de Santos se alcanza a 1 h 40 min de la salida.'
			},
			{
				pregunta: '¿Es difícil?',
				resposta:
					'El blog dice que el recorrido no es muy complicado, pero que hay que seguir bien las señales de pintura y los hitos y que no es una ruta para el verano ni para días de lluvia.'
			},
			{
				pregunta: '¿Hay agua en el camino?',
				resposta:
					'El blog indica que no se encuentra agua en ningún sitio; lleva toda la que necesites.'
			},
			{
				pregunta: '¿La Creu de Santos cuenta como cima esencial?',
				resposta:
					"Sí, es una de las [cimas esenciales](/cims-essencials) del Baix Ebre, con el [Tossal d'Engrilló](/cims/tossal-d-engrillo) y el [Caro](/cims/caro)."
			}
		]
	},
	fonts: [VIQUIPEDIA, GEC_CIM, GEC_SERRA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
