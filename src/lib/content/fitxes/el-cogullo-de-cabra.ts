import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: "Viquipèdia: El Cogulló (el Pont d'Armentera)",
	url: 'https://ca.wikipedia.org/wiki/El_Cogull%C3%B3_(el_Pont_d%27Armentera)',
	consultat: CONSULTAT
};

const VIQUIPEDIA_MUNICIPI = {
	nom: "Viquipèdia: El Pont d'Armentera",
	url: 'https://ca.wikipedia.org/wiki/El_Pont_d%27Armentera',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: El Cogulló de Cabra',
	url: 'https://reptesmuntanyencs.cat/el-cogullo-de-cabra/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'el-cogullo-de-cabra',
	descripcio: {
		ca: [
			"El Cogulló de Cabra, que la Viquipèdia recull com a el Cogulló, és una muntanya del terme del Pont d'Armentera, a [l'Alt Camp](/comarques/alt-camp). La Viquipèdia en dona l'alçada segons el mapa topogràfic de l'ICC, hi situa un conglomerat amb gres i marga i el col·loca dins l'espai del Sistema prelitoral central. La llista del repte l'anomena Cogulló de Cabra, i és un dels tres cims essencials de l'Alt Camp, amb la [Tossa Grossa de Montferri](/cims/tossa-grossa-de-montferri).",
			"El Pont d'Armentera és una vila i municipi de l'Alt Camp, banyat pel riu Gaià. Segons la Viquipèdia, limita amb Pontils, el Pla de Santa Maria, Cabra del Camp, Aiguamúrcia, Querol i Sarral. Dins el terme hi ha el nucli de Selmella, on es conserva el castell, una construcció romànica del segle X declarada bé cultural d'interès nacional. Segons la mateixa font, els primers pobladors van ser els romans, vinculats a l'aqüeducte que abastia Tarraco pel Gaià.",
			"Reptes Muntanyencs recorre la muntanya per una circular amb una pujada per pista, de vegades molt descomposta i pedregosa. El bloc diu que l'itinerari no presenta perill en cap moment ni té passos aeris perquè la vegetació protegeix el camí. Prop del cim hi ha el roc del Cogulló, amb una barana de fusta i una escala de fusta amb cadena d'acer. El bloc diu que, si el dia acompanya, les vistes són molt bones.",
			"El recorregut segueix el GR-175 en algun tram, i els cartells i pals de direcció tenen poca presència: només un d'ells, ja gairebé a tocar del cim, indica el camí per accedir-hi. Convé portar el track i no confiar només en els cartells."
		],
		es: [
			"El Cogulló de Cabra, que la Viquipèdia recoge como el Cogulló, es una montaña del término del Pont d'Armentera, en [el Alt Camp](/comarques/alt-camp). La Viquipèdia da su altura según el mapa topográfico del ICC, sitúa un conglomerado con arenisca y marga y lo coloca dentro del espacio del Sistema prelitoral central. La lista del reto lo llama Cogulló de Cabra, y es una de las tres cimas esenciales del Alt Camp, con la [Tossa Grossa de Montferri](/cims/tossa-grossa-de-montferri).",
			"El Pont d'Armentera es una villa y municipio del Alt Camp, bañado por el río Gaià. Según la Viquipèdia, limita con Pontils, el Pla de Santa Maria, Cabra del Camp, Aiguamúrcia, Querol y Sarral. Dentro del término está el núcleo de Selmella, donde se conserva el castillo, una construcción románica del siglo X declarada bien cultural de interés nacional. Según la misma fuente, los primeros pobladores fueron los romanos, vinculados al acueducto que abastecía Tarraco por el Gaià.",
			'Reptes Muntanyencs recorre la montaña por una circular con una subida por pista, a veces muy descompuesta y pedregosa. El blog dice que el itinerario no presenta peligro en ningún momento ni tiene pasos aéreos porque la vegetación protege el camino. Cerca de la cima está el roc del Cogulló, con una barandilla de madera y una escalera de madera con cadena de acero. El blog dice que, si el día acompaña, las vistas son muy buenas.',
			'El recorrido sigue el GR-175 en algún tramo, y los carteles y postes de dirección tienen poca presencia: solo uno de ellos, ya casi junto a la cima, indica el camino para acceder a ella. Conviene llevar el track y no fiarse solo de los carteles.'
		]
	},
	rutes: [
		{
			id: 'barranc-del-cogullo',
			nom: {
				ca: 'Circular pel barranc del Cogulló i el roc del Cogulló',
				es: 'Circular por el barranc del Cogulló y el roc del Cogulló'
			},
			sortida: { nom: 'Barranc del Cogulló / carrerada del Cogulló' },
			descripcio: {
				ca: "Reptes Muntanyencs documenta una circular que surt del barranc del Cogulló i va per pistes i senders: uns 6,5 km, uns 307 m de desnivell positiu i 1 h 34 min de marxa efectiva. Segons el seu track, el cim s'assoleix a 1 h 02 min i uns 3,6 km de la sortida, i el roc del Cogulló, a 1 h 10 min. La pujada és sempre per una pista que a estones és molt descomposta i pedregosa; el bloc afirma que no hi ha perill ni passos aeris, i que hi ha cartells informatius i un pal de direccions.",
				es: 'Reptes Muntanyencs documenta una circular que sale del barranc del Cogulló y va por pistas y senderos: unos 6,5 km, unos 307 m de desnivel positivo y 1 h 34 min de marcha efectiva. Según su track, la cima se alcanza a 1 h 02 min y unos 3,6 km de la salida, y el roc del Cogulló, a 1 h 10 min. La subida es siempre por una pista que a ratos está muy descompuesta y pedregosa; el blog afirma que no hay peligro ni pasos aéreos, y que hay carteles informativos y un poste de direcciones.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			'La pista de pujada és, segons el bloc, a estones molt descomposta i pedregosa: porta calçat de muntanya.',
			"El bloc nota que els indicadors no marquen el camí fins al cim tret d'un, quan ja n'ets a tocar: porta el track.",
			"Per anar al roc del Cogulló, el bloc descriu una barana i una escala de fusta amb cadena d'acer: té cura amb la roca humida.",
			'El GR-175 pot servir-te de referència en alguns trams de la circular.',
			"Telèfon d'emergències: 112."
		],
		es: [
			'La pista de subida es, según el blog, a ratos muy descompuesta y pedregosa: lleva calzado de montaña.',
			'El blog anota que los indicadores no marcan el camino hasta la cima salvo uno, cuando ya estás junto a ella: lleva el track.',
			'Para ir al roc del Cogulló, el blog describe una barandilla y una escalera de madera con cadena de acero: ten cuidado con la roca húmeda.',
			'El GR-175 puede servirte de referencia en algunos tramos de la circular.',
			'Teléfono de emergencias: 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Cogulló de Cabra?',
				resposta:
					"Reptes Muntanyencs documenta una circular d'uns 6,5 km amb 1 h 34 min de marxa efectiva; segons el seu track, el cim queda a 1 h 02 min de la sortida."
			},
			{
				pregunta: 'Té passos difícils?',
				resposta:
					'El bloc afirma que no presenta perill en cap moment ni té passos aeris, perquè la vegetació protegeix el camí; la pista és, però, a estones descomposta i pedregosa.'
			},
			{
				pregunta: 'Què és el roc del Cogulló?',
				resposta:
					"És un punt a prop del cim amb una barana de fusta i una escala de fusta amb cadena d'acer, segons el bloc."
			},
			{
				pregunta: 'El Cogulló de Cabra compta com a cim essencial?',
				resposta:
					"Sí, és un dels tres [cims essencials](/cims-essencials) de l'Alt Camp, amb la [Tossa Grossa de Montferri](/cims/tossa-grossa-de-montferri) i el Tossal Gros."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Cogulló de Cabra?',
				resposta:
					'Reptes Muntanyencs documenta una circular de unos 6,5 km con 1 h 34 min de marcha efectiva; según su track, la cima queda a 1 h 02 min de la salida.'
			},
			{
				pregunta: '¿Tiene pasos difíciles?',
				resposta:
					'El blog afirma que no presenta peligro en ningún momento ni tiene pasos aéreos, porque la vegetación protege el camino; la pista está, eso sí, a ratos descompuesta y pedregosa.'
			},
			{
				pregunta: '¿Qué es el roc del Cogulló?',
				resposta:
					'Es un punto cerca de la cima con una barandilla de madera y una escalera de madera con cadena de acero, según el blog.'
			},
			{
				pregunta: '¿El Cogulló de Cabra cuenta como cima esencial?',
				resposta:
					'Sí, es una de las tres [cimas esenciales](/cims-essencials) del Alt Camp, con la [Tossa Grossa de Montferri](/cims/tossa-grossa-de-montferri) y el Tossal Gros.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_MUNICIPI, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
