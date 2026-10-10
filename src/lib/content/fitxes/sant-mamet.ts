import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Muntanya de Sant Mamet',
	url: 'https://ca.wikipedia.org/wiki/Muntanya_de_Sant_Mamet',
	consultat: CONSULTAT
};

const CATALUNYA_ROMANICA = {
	nom: 'Enciclopèdia Catalana, Catalunya Romànica: Sant Mamet (Vilanova de Meià)',
	url: 'https://www.enciclopedia.cat/catalunya-romanica/sant-mamet-vilanova-de-meia',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Sant Mamet',
	url: 'https://reptesmuntanyencs.cat/sant-mamet/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'sant-mamet',
	descripcio: {
		ca: [
			"Sant Mamet és el cim de la muntanya del mateix nom, una serra prepirinenca de [la Noguera](/comarques/noguera) que s'estén entre els termes d'Alòs de Balaguer, Artesa de Segre, Vilanova de Meià i Camarasa. Segons la Viquipèdia, la roca dominant és la calcària, i al cim hi ha uns rasos aplanats per l'erosió. A la zona hi va haver antigues mines de bauxita.",
			"El nom del cim ve de la capella de Sant Mamet que Catalunya Romànica situa al capdamunt de la serra. L'obra de l'Enciclopèdia Catalana apunta que podria ser una capella d'ermità, pel lloc apartat on és, i que la dedicació a sant Mamet es considera antiga. La primera referència documental és de 1231: aquell any Jaume de Cervera, senyor de Meià, la seva muller Miracle d'Urgell i altres persones van donar al monestir de Santa Maria de Meià la plana de Malagostar, al costat de la serra de Sant Mamet. Les restes que s'hi veuen, diu la mateixa font, no corresponen a cap edifici romànic.",
			"El bloc Reptes Muntanyencs situa al cim l'ermita i explica que el dia de Sant Mamet hi pugen diverses romeries a venerar el sant. També hi destaca que és un bon mirador, i que en dies clars les vistes han de ser molt amples. El mateix bloc considera que els desnivells a superar són poc forts, fins i tot fàcils.",
			"El sender, segons el bloc, és molt estret i empipador si és humit, de manera que després de pluja la pujada es fa més incòmoda. A partir d'un punt concret del recorregut, el camí s'aclareix i ja no es perd fins al cim. Convé portar el track, perquè la ressenya és del 2015 i les marques poden haver canviat."
		],
		es: [
			'Sant Mamet es la cima de la montaña del mismo nombre, una sierra prepirenaica de [la Noguera](/comarques/noguera) que se extiende entre los términos de Alòs de Balaguer, Artesa de Segre, Vilanova de Meià y Camarasa. Según la Viquipèdia, la roca dominante es la caliza, y en la cima hay unos rasos aplanados por la erosión. En la zona hubo antiguas minas de bauxita.',
			"El nombre de la cima viene de la capilla de Sant Mamet que Catalunya Romànica sitúa en lo alto de la sierra. La obra de la Enciclopèdia Catalana apunta que podría ser una capilla de ermitaño, por el lugar apartado en que está, y que la dedicación a san Mamet se considera antigua. La primera referencia documental es de 1231: aquel año Jaume de Cervera, señor de Meià, su mujer Miracle d'Urgell y otras personas donaron al monasterio de Santa Maria de Meià la llanura de Malagostar, junto a la sierra de Sant Mamet. Los restos que se ven, dice la misma fuente, no corresponden a ningún edificio románico.",
			'El blog Reptes Muntanyencs sitúa en la cima la ermita y explica que el día de Sant Mamet suben varias romerías a venerar al santo. Destaca también que es un buen mirador, y que en días claros las vistas deben de ser muy amplias. El mismo blog considera que los desniveles a superar son poco fuertes, incluso fáciles.',
			'El sendero, según el blog, es muy estrecho y molesto si está húmedo, de modo que después de lluvia la subida resulta más incómoda. A partir de un punto concreto del recorrido, el camino se aclara y ya no se pierde hasta la cima. Conviene llevar el track, porque la reseña es de 2015 y las marcas pueden haber cambiado.'
		]
	},
	rutes: [
		{
			id: 'la-granolla',
			nom: {
				ca: 'Circular des de la Granolla',
				es: 'Circular desde la Granolla'
			},
			sortida: { nom: 'La Granolla' },
			descripcio: {
				ca: "El bloc Reptes Muntanyencs documenta una circular que surt de la Granolla, amb pistes i senders. Fa 14,1 km, uns 755 m de desnivell positiu i 3 h 41 min de marxa efectiva; segons el seu track, el cim s'assoleix a 2 h 02 min i 7,4 km de la sortida, de manera que la baixada ocupa la resta del circuit. Hi ha senyals de pintura taronja i verda, pals indicadors i una gran fita de pedra que cal localitzar. Al cim hi ha l'ermita i el vèrtex.",
				es: 'El blog Reptes Muntanyencs documenta una circular que sale de la Granolla, con pistas y senderos. Tiene 14,1 km, unos 755 m de desnivel positivo y 3 h 41 min de marcha efectiva; según su track, la cima se alcanza a 2 h 02 min y 7,4 km de la salida, de modo que la bajada ocupa el resto del circuito. Hay señales de pintura naranja y verde, postes indicadores y un gran hito de piedra que hay que localizar. En la cima están la ermita y el vértice.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'El sender és molt estret i empipador si és humit, segons el bloc: després de pluja, calcula més temps a la pujada i més atenció a la baixada.',
			"La ressenya del bloc és del 2015. Les marques de pintura taronja i verda i els pals indicadors poden haver canviat; porta un track i un mapa de l'ICGC.",
			"El dia de Sant Mamet pugen romeries a l'ermita, segons el bloc: si hi vas aquell dia, compta amb gent.",
			"La circular combina senders i pistes: porta tota l'aigua que necessitis des de la sortida.",
			"En cas d'emergència, truca al 112."
		],
		es: [
			'El sendero es muy estrecho y molesto si está húmedo, según el blog: después de lluvia, calcula más tiempo en la subida y más atención en la bajada.',
			'La reseña del blog es de 2015. Las marcas de pintura naranja y verde y los postes indicadores pueden haber cambiado; lleva un track y un mapa del ICGC.',
			'El día de Sant Mamet suben romerías a la ermita, según el blog: si vas ese día, cuenta con gente.',
			'La circular combina senderos y pistas: lleva toda el agua que necesites desde la salida.',
			'En caso de emergencia, llama al 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Sant Mamet?',
				resposta:
					'El bloc Reptes Muntanyencs, en una circular de 14,1 km que surt de la Granolla, situa el cim a 2 h 02 min de la sortida i la marxa efectiva total en 3 h 41 min.'
			},
			{
				pregunta: 'És una ascensió difícil?',
				resposta:
					'El bloc afirma que els desnivells a superar són poc forts, fins i tot fàcils. La circular que documenta, però, fa 14,1 km, i el sender és estret i empipador si és humit.'
			},
			{
				pregunta: 'Què hi ha al cim de Sant Mamet?',
				resposta:
					"Segons el bloc, l'ermita de Sant Mamet i un vèrtex geodèsic. Catalunya Romànica recull la primera referència documental de la serra, del 1231."
			},
			{
				pregunta: 'Sant Mamet compta com a cim essencial?',
				resposta:
					'Sí, és un dels quatre [cims essencials](/cims-essencials) de la Noguera, amb la [Pala Alta](/cims/pala-alta), la Penya Sant Alís i el Tossal de Mirapallars.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Sant Mamet?',
				resposta:
					'El blog Reptes Muntanyencs, en una circular de 14,1 km que sale de la Granolla, sitúa la cima a 2 h 02 min de la salida y la marcha efectiva total en 3 h 41 min.'
			},
			{
				pregunta: '¿Es una ascensión difícil?',
				resposta:
					'El blog afirma que los desniveles a superar son poco fuertes, incluso fáciles. La circular que documenta, sin embargo, tiene 14,1 km, y el sendero es estrecho y molesto si está húmedo.'
			},
			{
				pregunta: '¿Qué hay en la cima de Sant Mamet?',
				resposta:
					'Según el blog, la ermita de Sant Mamet y un vértice geodésico. Catalunya Romànica recoge la primera referencia documental de la sierra, de 1231.'
			},
			{
				pregunta: '¿Sant Mamet cuenta como cima esencial?',
				resposta:
					'Sí, es una de las cuatro [cimas esenciales](/cims-essencials) de la Noguera, con la [Pala Alta](/cims/pala-alta), la Penya Sant Alís y el Tossal de Mirapallars.'
			}
		]
	},
	fonts: [VIQUIPEDIA, CATALUNYA_ROMANICA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
