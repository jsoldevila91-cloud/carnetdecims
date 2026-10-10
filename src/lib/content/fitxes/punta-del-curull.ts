import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Punta del Curull',
	url: 'https://ca.wikipedia.org/wiki/Punta_del_Curull',
	consultat: CONSULTAT
};

const REPTES = {
	nom: 'Reptes Muntanyencs: Punta del Curull des de Vilanova de Prades',
	url: 'https://reptesmuntanyencs.cat/punta-del-curull/',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'punta-del-curull',
	descripcio: {
		ca: [
			"La Punta del Curull és el cim de la serra de la Llena, entre els termes de Vilanova de Prades, a [la Conca de Barberà](/comarques/conca-de-barbera), i del Vilosell, a les Garrigues. La Viquipèdia la situa dins l'espai protegit de les Muntanyes de Prades, n'anota el conglomerat com a roca i la inclou a la llista dels 100 cims de la FEEC. Dins el mateix espai hi ha la [Mola d'Estat](/cims/mola-d-estat) i el [Tossal de la Baltasana](/cims/tossal-de-la-baltasana).",
			"Reptes Muntanyencs, que hi puja des de Vilanova de Prades, la descriu com una excursió molt fàcil i còmoda que es pot fer en una matinal. Surt de l'ermita de Sant Antoni, per senders i pistes, i el recorregut es troba perfectament senyalitzat amb pintura de PR, amb uns senyals de pintura groga en forma d'U invertida. El bloc destaca que la muntanya pot presumir de prominència i que per això les vistes són molt bones.",
			"El principi té una cosa particular: segons el bloc, sembla que s'avança per un solar amb runa, però al final apareix un sender ben fressat, i hi ha una zona de cingleres al davant que cal superar. Pel camí es passa a tocar de les coves del Nano i de Bigues, que el bloc no va visitar."
		],
		es: [
			"La Punta del Curull es la cima de la sierra de la Llena, entre los términos de Vilanova de Prades, en [la Conca de Barberà](/comarques/conca-de-barbera), y del Vilosell, en las Garrigues. La Viquipèdia la sitúa dentro del espacio protegido de las Muntanyes de Prades, anota el conglomerado como roca y la incluye en la lista de los 100 cims de la FEEC. Dentro del mismo espacio están la [Mola d'Estat](/cims/mola-d-estat) y el [Tossal de la Baltasana](/cims/tossal-de-la-baltasana).",
			'Reptes Muntanyencs, que sube desde Vilanova de Prades, la describe como una excursión muy fácil y cómoda que se puede hacer en una mañana. Sale de la ermita de Sant Antoni, por senderos y pistas, y el recorrido está perfectamente señalizado con pintura de PR, con unas señales de pintura amarilla en forma de U invertida. El blog destaca que la montaña puede presumir de prominencia y que por eso las vistas son muy buenas.',
			'El principio tiene algo particular: según el blog, parece que se avanza por un solar con escombros, pero al final aparece un sendero bien trillado, y hay una zona de riscos delante que hay que superar. Por el camino se pasa junto a las cuevas del Nano y de Bigues, que el blog no visitó.'
		]
	},
	rutes: [
		{
			id: 'vilanova-de-prades',
			nom: {
				ca: "Circular des de l'ermita de Sant Antoni (Vilanova de Prades)",
				es: 'Circular desde la ermita de Sant Antoni (Vilanova de Prades)'
			},
			sortida: { nom: 'Ermita de Sant Antoni (Vilanova de Prades)' },
			descripcio: {
				ca: "Reptes Muntanyencs documenta una circular que surt de l'ermita de Sant Antoni, per senders i pistes: 4,4 km, uns 166 m de desnivell positiu i 1 h 03 min de marxa efectiva. Segons el seu track, el cim s'assoleix a 39 min i uns 2,2 km de la sortida. La senyalització és de pintura de PR i de senyals de pintura groga en forma d'U invertida.",
				es: 'Reptes Muntanyencs documenta una circular que sale de la ermita de Sant Antoni, por senderos y pistas: 4,4 km, unos 166 m de desnivel positivo y 1 h 03 min de marcha efectiva. Según su track, la cima se alcanza a 39 min y unos 2,2 km de la salida. La señalización es de pintura de PR y de señales de pintura amarilla en forma de U invertida.'
			},
			fonts: [REPTES]
		}
	],
	consells: {
		ca: [
			"El bloc el defineix com a molt fàcil i còmode, però cal superar una zona de cingleres: no t'hi apressis.",
			'Al principi del camí sembla que vagis per un solar amb runa; continua, perquè acaba en un sender fressat.',
			"Segueix les marques de PR i els senyals de pintura groga en forma d'U invertida.",
			'Pel camí hi ha les coves del Nano i de Bigues; el bloc no les va visitar, i convé no entrar-hi sense experiència ni llum.',
			"Telèfon d'emergències: 112."
		],
		es: [
			'El blog lo define como muy fácil y cómodo, pero hay que superar una zona de riscos: no te apresures.',
			'Al comienzo del camino parece que vayas por un solar con escombros; continúa, porque acaba en un sendero trillado.',
			'Sigue las marcas de PR y las señales de pintura amarilla en forma de U invertida.',
			'Por el camino están las cuevas del Nano y de Bigues; el blog no las visitó, y conviene no entrar sin experiencia ni luz.',
			'Teléfono de emergencias: 112.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a la Punta del Curull?',
				resposta:
					"Reptes Muntanyencs documenta una circular de 4,4 km des de l'ermita de Sant Antoni amb 1 h 03 min de marxa efectiva; segons el seu track, el cim queda a 39 min de la sortida."
			},
			{
				pregunta: 'És una excursió fàcil?',
				resposta:
					'El bloc la defineix com a molt fàcil i còmoda, de matinal, però hi ha una zona de cingleres que cal superar.'
			},
			{
				pregunta: 'Està senyalitzada?',
				resposta:
					"Sí. El bloc diu que tot el recorregut es troba perfectament senyalitzat amb pintura de PR i uns senyals de pintura groga en forma d'U invertida."
			},
			{
				pregunta: 'La Punta del Curull compta com a cim essencial?',
				resposta:
					"Sí, és un dels quatre [cims essencials](/cims-essencials) de la Conca de Barberà, amb la [Mola d'Estat](/cims/mola-d-estat)."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a la Punta del Curull?',
				resposta:
					'Reptes Muntanyencs documenta una circular de 4,4 km desde la ermita de Sant Antoni con 1 h 03 min de marcha efectiva; según su track, la cima queda a 39 min de la salida.'
			},
			{
				pregunta: '¿Es una excursión fácil?',
				resposta:
					'El blog la define como muy fácil y cómoda, de mañana, pero hay una zona de riscos que hay que superar.'
			},
			{
				pregunta: '¿Está señalizada?',
				resposta:
					'Sí. El blog dice que todo el recorrido está perfectamente señalizado con pintura de PR y unas señales de pintura amarilla en forma de U invertida.'
			},
			{
				pregunta: '¿La Punta del Curull cuenta como cima esencial?',
				resposta:
					"Sí, es una de las cuatro [cimas esenciales](/cims-essencials) de la Conca de Barberà, con la [Mola d'Estat](/cims/mola-d-estat)."
			}
		]
	},
	fonts: [VIQUIPEDIA, REPTES],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
