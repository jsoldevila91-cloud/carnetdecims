import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-11';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Tossal del Rei (Tossal dels Tres Reis)',
	url: 'https://ca.wikipedia.org/wiki/Tossal_dels_Tres_Reis',
	consultat: CONSULTAT
};

const PARC_REGULACIO = {
	nom: "Parc Natural dels Ports: regulació d'activitats",
	url: 'https://parcsnaturals.gencat.cat/ca/xarxa-de-parcs/ports/gaudeix-del-parc/consells/regulacio-dactivitats/',
	consultat: CONSULTAT
};

const PARC_FOU = {
	nom: 'Parc Natural dels Ports: la Fou (la Sénia)',
	url: 'https://parcsnaturals.gencat.cat/ca/xarxa-de-parcs/ports/gaudeix-del-parc/equipaments-i-itineraris/itineraris-arees-lleure/fou-la-senia/',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Tossal del Rei',
	url: 'https://reptesmuntanyencs.cat/tossal-del-rei/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'tossal-dels-tres-reis',
	descripcio: {
		ca: [
			"El Tossal dels Tres Reis, que als mapes surt com a Tossal del Rei, és a la part meridional del massís dels Ports, [al Montsià](/comarques/montsia), al terme de la Sénia. És el trifini de Catalunya, el País Valencià i l'Aragó: hi termenegen la Sénia, la Pobla de Benifassà, per la part de Fredes, i Vall-de-roures, al Matarranya. Queda a prop del punt més occidental de Catalunya.",
			"El nom popular recorda que aquí es trobaven els tres antics regnes de la Corona d'Aragó. Al cim, un munt de pedres en simbolitza el punt d'encontre, i un rètol de ferro amb tres banderes metàl·liques marca la partió; és costum col·locar-s'hi de manera que es toquin els tres territoris alhora.",
			"El vessant català forma part del Parc Natural dels Ports i el valencià, del Parc Natural de la Tinença de Benifassà. L'accés habitual no és per Catalunya, sinó pel poble de Fredes, al País Valencià, que és a uns 1.100 m d'altitud i deixa el cim a una passejada.",
			"Per això és una ascensió curta i suau. Els altres cims essencials dels Ports, el [Caro](/cims/caro) i el [Tossal d'Engrilló](/cims/tossal-d-engrillo), queden força més al nord; al Montsià, l'altre essencial és la [Torreta de Montsià](/cims/torreta-de-montsia)."
		],
		es: [
			'El Tossal dels Tres Reis, que en los mapas aparece como Tossal del Rei, está en la parte meridional del macizo de los Ports, [en el Montsià](/comarques/montsia), en el término de la Sénia. Es el trifinio de Catalunya, el País Valencià y Aragón: confluyen la Sénia, la Pobla de Benifassà, por la parte de Fredes, y Vall-de-roures (Valderrobres), en el Matarranya. Queda cerca del punto más occidental de Catalunya.',
			'El nombre popular recuerda que aquí se encontraban los tres antiguos reinos de la Corona de Aragón. En la cima, un montón de piedras simboliza el punto de encuentro, y un rótulo de hierro con tres banderas metálicas marca la linde; es costumbre colocarse de manera que se toquen los tres territorios a la vez.',
			'La vertiente catalana forma parte del Parc Natural dels Ports y la valenciana, del Parc Natural de la Tinença de Benifassà. El acceso habitual no es por Catalunya, sino por el pueblo de Fredes, en el País Valencià, que está a unos 1.100 m de altitud y deja la cima a un paseo.',
			"Por eso es una ascensión corta y suave. Las otras cimas esenciales de los Ports, el [Caro](/cims/caro) y el [Tossal d'Engrilló](/cims/tossal-d-engrillo), quedan bastante más al norte; en el Montsià, la otra esencial es la [Torreta de Montsià](/cims/torreta-de-montsia)."
		]
	},
	rutes: [
		{
			id: 'fredes',
			nom: {
				ca: 'Des de Fredes pel coll dels Tombadors',
				es: 'Desde Fredes por el coll dels Tombadors'
			},
			sortida: { nom: 'Fredes (la Pobla de Benifassà, País Valencià)' },
			tecnicitat: 'cap',
			descripcio: {
				ca: "És el camí que fa gairebé tothom. A la sortida de Fredes es pren la pista forestal que puja al coll dels Tombadors, una cruïlla de tres camins; també s'hi pot arribar per un sender que estalvia pista, poc clar al començament. Al coll es gira a l'esquerra i se segueix el camí principal, passant per l'ermita de Sant Miquel d'Espinalva, fins al cim. El bloc Reptes Muntanyencs hi va comptar 4,2 km i 1 h 15 min des de Fredes, aturades incloses. La senyalització és escassa. Es torna pel mateix camí o pel GR 7, que es troba poc més enllà del cim.",
				es: "Es el camino que hace casi todo el mundo. A la salida de Fredes se toma la pista forestal que sube al coll dels Tombadors, un cruce de tres caminos; también se puede llegar por un sendero que ahorra pista, poco claro al principio. En el collado se gira a la izquierda y se sigue el camino principal, pasando por la ermita de Sant Miquel d'Espinalva, hasta la cima. El blog Reptes Muntanyencs contó 4,2 km y 1 h 15 min desde Fredes, paradas incluidas. La señalización es escasa. Se vuelve por el mismo camino o por el GR 7, que se encuentra poco más allá de la cima."
			},
			fonts: [VIQUIPEDIA, REPTES]
		}
	],
	consells: {
		ca: [
			'Torna per on has pujat o pel GR 7. La baixada pel mas del Paraire i el Salt de Robert que fa el bloc és un camí vell i perdedor, amb trams sense traça: només per a gent amb experiència en aquest terreny.',
			'Hi ha diverses pistes i pocs senyals: porta mapa o track, sobretot si hi ha boira.',
			'No hi ha fonts al recorregut.',
			'Als Ports es fan batudes de porc senglar entre setembre i març (web del Parc Natural dels Ports, consulta del 2026); al costat valencià regeixen les normes de la Tinença de Benifassà. Consulta la regulació vigent.'
		],
		es: [
			'Vuelve por donde has subido o por el GR 7. La bajada por el mas del Paraire y el Salt de Robert que hace el blog es un camino viejo y perdedor, con tramos sin traza: solo para gente con experiencia en este terreno.',
			'Hay varias pistas y pocas señales: lleva mapa o track, sobre todo si hay niebla.',
			'No hay fuentes en el recorrido.',
			'En los Ports se hacen batidas de jabalí entre septiembre y marzo (web del Parc Natural dels Ports, consulta de 2026); en el lado valenciano rigen las normas de la Tinença de Benifassà. Consulta la regulación vigente.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Tossal dels Tres Reis?',
				resposta:
					"Des de Fredes, el bloc Reptes Muntanyencs hi va arribar en 1 h 15 min, aturades incloses, després de 4,2 km. El poble ja és a uns 1.100 m d'altitud, de manera que el desnivell és modest."
			},
			{
				pregunta: 'Per què es diu dels Tres Reis?',
				resposta:
					"Perquè el cim és el punt on es tocaven els tres antics regnes de la Corona d'Aragó. Avui hi conflueixen Catalunya, el País Valencià i l'Aragó."
			},
			{
				pregunta: 'Es pot pujar des de Catalunya?',
				resposta:
					"El cim és al terme de la Sénia, però l'accés habitual és des de Fredes, al País Valencià, on s'arriba per carretera des de la Sénia."
			},
			{
				pregunta: 'Compta com a cim essencial?',
				resposta:
					'Sí, és un dels dos [cims essencials](/cims-essencials) del Montsià, amb la [Torreta de Montsià](/cims/torreta-de-montsia).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Tossal dels Tres Reis?',
				resposta:
					'Desde Fredes, el blog Reptes Muntanyencs llegó en 1 h 15 min, paradas incluidas, tras 4,2 km. El pueblo ya está a unos 1.100 m de altitud, de modo que el desnivel es modesto.'
			},
			{
				pregunta: '¿Por qué se llama dels Tres Reis?',
				resposta:
					'Porque la cima es el punto donde se tocaban los tres antiguos reinos de la Corona de Aragón. Hoy confluyen Catalunya, el País Valencià y Aragón.'
			},
			{
				pregunta: '¿Se puede subir desde Catalunya?',
				resposta:
					'La cima está en el término de la Sénia, pero el acceso habitual es desde Fredes, en el País Valencià, adonde se llega por carretera desde la Sénia.'
			},
			{
				pregunta: '¿Cuenta como cima esencial?',
				resposta:
					'Sí, es una de las dos [cimas esenciales](/cims-essencials) del Montsià, con la [Torreta de Montsià](/cims/torreta-de-montsia).'
			}
		]
	},
	fonts: [VIQUIPEDIA, PARC_FOU, PARC_REGULACIO, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-11'
};

export default fitxa;
