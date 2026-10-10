import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Pic de Lleràs',
	url: 'https://ca.wikipedia.org/wiki/Pui_de_Ller%C3%A0s',
	consultat: CONSULTAT
};

const ENCICLOPEDIA = {
	nom: 'Gran Enciclopèdia Catalana: la serra de Sant Gervàs i el pui de Lleràs',
	url: 'https://www.enciclopedia.cat/historia-natural-dels-paisos-catalans/la-serra-de-sant-gervas-i-el-pui-de-lleras',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Pui de Lleràs',
	url: 'https://reptesmuntanyencs.cat/es/pui-de-lleras-2/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'pui-de-lleras',
	descripcio: {
		ca: [
			"El Pui de Lleràs és un cim del municipi de Tremp, al [Pallars Jussà](/comarques/pallars-jussa), gairebé al límit amb Conca de Dalt. Segons la Viquipèdia, és on es troben la serra de Castellet i la serra de Sant Salvador, dos contraforts sud-orientals de la serra de Sant Gervàs, i queda dins de l'espai protegit de la Vall Alta de Serradell, Terreta i serra de Sant Gervàs. La roca és conglomerat i gres: la Gran Enciclopèdia Catalana parla de conglomerats massius de tipus montserratí.",
			"El nom té una explicació lingüística. En la pronúncia local, el cim es diu «Pui», no «Puig», i la Viquipèdia ho relaciona amb el dialecte pallarès, on les fricatives i africades palatals finals es redueixen. Fins al 1970 el cim va pertànyer al municipi d'Espluga de Serra, de l'Alta Ribagorça, abans que fos agregat al de Tremp. Al cim hi ha un vèrtex geodèsic i, segons Reptes Muntanyencs, una torre de guaita.",
			"Aquest massís és una transició entre els Prepirineus interiors i els Pirineus axials. La Gran Enciclopèdia Catalana hi destaca les fagedes de la Faiada de Malpàs i de Lleràs, amb plantes nemorals rares als Prepirineus. Reptes Muntanyencs, que descriu la ruta amb pinedes i alzinar, parla de vistes molt àmplies des del cim i recull que, segons l'Ajuntament de la Conca de Dalt, els dies clars s'hi veu Montserrat.",
			"Reptes Muntanyencs la valora de dificultat baixa, per camins i senders. És un cim per a gairebé tot l'any: a l'estiu, les pinedes i l'alzinar fan ombra però els trams oberts són molt assolellats, i a l'hivern l'autor el proposa amb raquetes o esquís de muntanya."
		],
		es: [
			'El Pui de Lleràs es una cima del municipio de Tremp, en el [Pallars Jussà](/comarques/pallars-jussa), casi en el límite con Conca de Dalt. Según la Viquipèdia, es donde se encuentran la sierra de Castellet y la sierra de Sant Salvador, dos contrafuertes sudorientales de la sierra de Sant Gervàs, y queda dentro del espacio protegido de la Vall Alta de Serradell, Terreta y sierra de Sant Gervàs. La roca es conglomerado y arenisca: la Gran Enciclopèdia Catalana habla de conglomerados masivos de tipo montserratino.',
			'El nombre tiene una explicación lingüística. En la pronunciación local, la cima se dice «Pui», no «Puig», y la Viquipèdia lo relaciona con el dialecto pallarés, donde las fricativas y africadas palatales finales se reducen. Hasta 1970 la cima perteneció al municipio de Espluga de Serra, de la Alta Ribagorça, antes de ser agregado al de Tremp. En la cima hay un vértice geodésico y, según Reptes Muntanyencs, una torre de vigía.',
			'Este macizo es una transición entre los Prepirineos interiores y los Pirineos axiales. La Gran Enciclopèdia Catalana destaca los hayedos de la Faiada de Malpàs y de Lleràs, con plantas nemorales raras en los Prepirineos. Reptes Muntanyencs, que describe la ruta con pinares y encinar, habla de vistas muy amplias desde la cima y recoge que, según el Ayuntamiento de la Conca de Dalt, los días claros se ve Montserrat.',
			'Reptes Muntanyencs la valora de dificultad baja, por caminos y senderos. Es una cima para casi todo el año: en verano, los pinares y el encinar dan sombra pero los tramos abiertos están muy expuestos al sol, y en invierno el autor la propone con raquetas o esquís de montaña.'
		]
	},
	rutes: [
		{
			id: 'tarter-gros',
			nom: {
				ca: 'Circular des del serrat del Tarter Gros (bosc de Salàs)',
				es: 'Circular desde el serrat del Tarter Gros (bosque de Salàs)'
			},
			sortida: { nom: 'Serrat del Tarter Gros, encreuament de pistes (bosc de Salàs, 938 m)' },
			tecnicitat: 'cap',
			descripcio: {
				ca: "Reptes Muntanyencs surt de l'aparcament del bosc de Salàs, a 938 m, en un encreuament de pistes, i fa la volta en sentit antihorari. La pujada no té senyals i la baixada, en canvi, està senyalitzada. Va per pistes i senders, creua el barranc de l'Aulesa i el de Font Freda; a la baixada, l'antic camí de Font Freda es va perdent entre la vegetació. Compta 14,5 km i 748 m de desnivell, amb 3 h 43 min de marxa i uns 20 min d'aturades, amb dificultat baixa. L'autor no hi descriu passos on calgui posar les mans; només una drecera opcional, dreta i amb pedra rodona.",
				es: 'Reptes Muntanyencs sale del aparcamiento del bosque de Salàs, a 938 m, en un cruce de pistas, y hace la vuelta en sentido antihorario. La subida no tiene señales y la bajada, en cambio, está señalizada. Va por pistas y senderos, cruza el barranco de l’Aulesa y el de Font Freda; en la bajada, el antiguo camino de Font Freda se va perdiendo entre la vegetación. Cuenta 14,5 km y 748 m de desnivel, con 3 h 43 min de marcha y unos 20 min de paradas, con dificultad baja. El autor no describe pasos donde haya que poner las manos; solo un atajo opcional, empinado y con piedra redonda.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"S'hi arriba amb cotxe normal per una pista de terra en bon estat, des de Salàs de Pallars o des de Santa Engràcia; la de Santa Engràcia és una mica més curta, segons Reptes Muntanyencs.",
			"Segons la ressenya, l'aigua de la font del Forn és de potabilitat dubtosa: porta'n per a tota la sortida.",
			"Els trams oberts són molt exposats al sol, segons l'autor: a l'estiu, surt d'hora i porta protecció solar.",
			'Si hi puges amb nens petits, Reptes Muntanyencs el considera adequat per a infants ja una mica experimentats; evita la drecera empinada i abrupta.',
			"A l'hivern, amb neu, Reptes Muntanyencs proposa fer-lo amb raquetes o esquís de muntanya; en aquest cas, valora el perill d'allaus i la visibilitat."
		],
		es: [
			'Se llega en coche normal por una pista de tierra en buen estado, desde Salàs de Pallars o desde Santa Engràcia; la de Santa Engràcia es algo más corta, según Reptes Muntanyencs.',
			'Según la reseña, el agua de la font del Forn es de potabilidad dudosa: lleva para toda la salida.',
			'Los tramos abiertos están muy expuestos al sol, según el autor: en verano, sal temprano y lleva protección solar.',
			'Si subes con niños pequeños, Reptes Muntanyencs lo considera adecuado para niños ya algo experimentados; evita el atajo empinado y abrupto.',
			'En invierno, con nieve, Reptes Muntanyencs propone hacerlo con raquetas o esquís de montaña; en ese caso, valora el peligro de aludes y la visibilidad.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Pui de Lleràs?',
				resposta:
					"La volta circular que ressenya Reptes Muntanyencs fa 14,5 km i 748 m de desnivell, amb 3 h 43 min de marxa i uns 20 min d'aturades. No hi ha una xifra fiable només d'anada."
			},
			{
				pregunta: 'És una excursió fàcil?',
				resposta:
					'Sí en relació amb altres cims essencials: Reptes Muntanyencs la valora de dificultat baixa en esforç físic, progressió i orientació, per pistes i senders. Cal tenir en compte que és una volta de gairebé 15 km.'
			},
			{
				pregunta: 'Es pot fer amb nens?',
				resposta:
					'Reptes Muntanyencs diu que és adequada per a infants petits que ja estiguin una mica experimentats, tot i la distància. Convé evitar la drecera empinada i abrupta i portar aigua.'
			},
			{
				pregunta: 'El Pui de Lleràs compta com a cim essencial?',
				resposta:
					'Sí, és un dels set [cims essencials](/cims-essencials) del Pallars Jussà i el segon més baix, amb 1.692 m, només per sobre de [Sant Corneli](/cims/sant-corneli) (1.351 m).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Pui de Lleràs?',
				resposta:
					'La vuelta circular que reseña Reptes Muntanyencs hace 14,5 km y 748 m de desnivel, con 3 h 43 min de marcha y unos 20 min de paradas. No hay una cifra fiable solo de ida.'
			},
			{
				pregunta: '¿Es una excursión fácil?',
				resposta:
					'Sí en relación con otras cimas esenciales: Reptes Muntanyencs la valora de dificultad baja en esfuerzo físico, progresión y orientación, por pistas y senderos. Hay que tener en cuenta que es una vuelta de casi 15 km.'
			},
			{
				pregunta: '¿Se puede hacer con niños?',
				resposta:
					'Reptes Muntanyencs dice que es adecuada para niños pequeños que ya estén algo experimentados, a pesar de la distancia. Conviene evitar el atajo empinado y abrupto y llevar agua.'
			},
			{
				pregunta: '¿El Pui de Lleràs cuenta como cima esencial?',
				resposta:
					'Sí, es una de las siete [cimas esenciales](/cims-essencials) del Pallars Jussà y la segunda más baja, con 1.692 m, solo por encima de [Sant Corneli](/cims/sant-corneli) (1.351 m).'
			}
		]
	},
	fonts: [VIQUIPEDIA, ENCICLOPEDIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
