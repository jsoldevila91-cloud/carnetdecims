import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-04';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: santuari de Bellmunt',
	url: 'https://ca.wikipedia.org/wiki/Santuari_de_Bellmunt',
	consultat: CONSULTAT
};

const FEMTURISME = {
	nom: 'Femturisme: ruta circular al santuari de Bellmunt des de Sant Pere de Torelló',
	url: 'https://femturisme.cat/en/routes/circular-route-to-the-sanctuary-of-bellmunt-des-de-sant-pere-de-torello',
	consultat: CONSULTAT
};

const VALLGESBISAURA = {
	nom: 'La Vall del Ges i el Bisaura: Bellmunt des de Sant Pere de Torelló',
	url: 'https://www.vallgesbisaura.com/caminades/2-bellmunt-des-de-sant-pere-de-torello/',
	consultat: CONSULTAT
};

const MIRADOR = {
	nom: 'Mirador Bellmunt: de Sant Pere de Torelló a Bellmunt pel camí vell',
	url: 'https://www.miradorbellmunt.cat/item/ruta-sant-pere-de-torello-bellmunt-sant-pere-de-torello-pel-cami-vell/',
	consultat: CONSULTAT
};

const SENDERISMEGIRONA = {
	nom: 'Senderisme Girona: ruta 95, de Sant Pere de Torelló al santuari de Bellmunt',
	url: 'https://senderismegirona.org/2020/09/05/ruta-95-sant-pere-de-torello-al-santuari-de-bellmunt/',
	consultat: CONSULTAT
};

const DERUTAENRUTA = {
	nom: 'De ruta en ruta: el santuari de Bellmunt des de Vidrà',
	url: 'https://www.derutaenruta.com/ca/rutes/santuari-bellmunt-vidra',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'bellmunt',
	descripcio: {
		ca: [
			'Bellmunt és el cim de la serra del mateix nom, al terme de Sant Pere de Torelló, [a Osona](/comarques/osona), i el santuari que el corona fa de talaia sobre la plana de Vic, la vall del Ges i el Bisaura. Té a prop altres cims essencials del Prepirineu oriental com [el Castell de Milany](/cims/castell-de-milany) o [el Puigsacalm](/cims/puigsacalm).',
			"El santuari està construït directament sobre la roca viva i arran de la cinglera. La Viquipèdia recull que, ja l'any 1020, al cim hi havia el castell de Ça Reganyada, i que l'església apareix per primer cop el 1240 en el testament de Pere de Serra. L'edifici actual és fruit de les grans reformes del 1587 al 1607 (la data que porta la llinda de l'entrada), i el 1623 s'hi va encarregar un nou retaule a l'escultor Domènec Casimira, de Ripoll. Malmès durant la Guerra Civil, es va restaurar després, i avui és bé cultural d'interès local i té restaurant i hostatgeria al mateix edifici.",
			"El mirador del santuari és un dels més complets d'Osona: tota la plana de Vic als peus, la vall del Ges i el Bisaura, i el Pirineu oriental. Segons Femturisme, en dies clars també s'hi reconeixen Montserrat i el Montseny.",
			"La millor època és la tardor, quan les rouredes i les fagedes del camí canvien de color. A l'hivern, el vessant nord pot tenir gel i neu durant dies, i les fulles mortes del camí rellisquen."
		],
		es: [
			'Bellmunt es la cima de la sierra del mismo nombre, en el municipio de Sant Pere de Torelló, [en Osona](/comarques/osona), y el santuario que la corona hace de atalaya sobre la llanura de Vic, el valle del Ges y el Bisaura. Tiene cerca otras cimas esenciales del Prepirineo oriental como [el Castell de Milany](/cims/castell-de-milany) o [el Puigsacalm](/cims/puigsacalm).',
			'El santuario está construido directamente sobre la roca viva y al borde del risco. La Viquipèdia recoge que, ya en el año 1020, en la cima estaba el castillo de Ça Reganyada, y que la iglesia aparece por primera vez en 1240 en el testamento de Pere de Serra. El edificio actual es fruto de las grandes reformas de 1587 a 1607 (la fecha que lleva el dintel de la entrada), y en 1623 se encargó un nuevo retablo al escultor Domènec Casimira, de Ripoll. Dañado durante la Guerra Civil, se restauró después, y hoy es bien cultural de interés local y tiene restaurante y hospedería en el mismo edificio.',
			'El mirador del santuario es uno de los más completos de Osona: toda la llanura de Vic a los pies, el valle del Ges y el Bisaura, y el Pirineo oriental. Según Femturisme, en días claros también se reconocen Montserrat y el Montseny.',
			'La mejor época es el otoño, cuando los robledales y los hayedos del camino cambian de color. En invierno, la vertiente norte puede tener hielo y nieve durante días, y las hojas secas del camino resbalan.'
		]
	},
	rutes: [
		{
			id: 'sant-pere-de-torello',
			nom: {
				ca: 'Des de Sant Pere de Torelló pel camí vell',
				es: 'Desde Sant Pere de Torelló por el camí vell'
			},
			sortida: { nom: 'Sant Pere de Torelló' },
			tecnicitat: 'terreny-irregular',
			descripcio: {
				ca: "És el camí original, anterior a la carretera. Surt del poble, deixa l'asfalt passat el cementiri i s'enfila per una pujada de pedra molt dreta, amb roques polides, fins a l'Alzina Grossa (abatuda pel temporal Gloria el 2020); d'allà, entre rouredes i fagedes, el pendent s'estova fins al santuari. Hi ha marques blanques i vermelles durant bona part de la pujada. La circular de La Vall del Ges i el Bisaura fa 11,6 km i unes 3 h 20 min en total.",
				es: 'Es el camino original, anterior a la carretera. Sale del pueblo, deja el asfalto pasado el cementerio y sube por una cuesta de piedra muy empinada, con rocas pulidas, hasta l’Alzina Grossa (derribada por el temporal Gloria en 2020); desde allí, entre robledales y hayedos, la pendiente se suaviza hasta el santuario. Hay marcas blancas y rojas durante buena parte de la subida. La circular de La Vall del Ges i el Bisaura tiene 11,6 km y unas 3 h 20 min en total.'
			},
			fonts: [VALLGESBISAURA, FEMTURISME, MIRADOR]
		},
		{
			id: 'vidra',
			nom: { ca: 'Des de Vidrà pel salt del Molí', es: 'Desde Vidrà por el salt del Molí' },
			sortida: { nom: 'Pavelló municipal de Vidrà' },
			descripcio: {
				ca: "Accés pel vessant nord, més llarg i feréstec. De ruta en ruta hi descriu una circular de 10 km, uns 600 m de desnivell i unes 4 h 30 min, que passa pel pont de Salgueda i pel salt del Molí, una cascada d'uns 20 m. La pujada final és forta i, com que és obaga, a l'hivern hi dura més el gel i la neu.",
				es: 'Acceso por la vertiente norte, más largo y agreste. De ruta en ruta describe una circular de 10 km, unos 600 m de desnivel y unas 4 h 30 min, que pasa por el puente de Salgueda y por el salt del Molí, una cascada de unos 20 m. La subida final es fuerte y, como es umbría, en invierno el hielo y la nieve duran más.'
			},
			fonts: [DERUTAENRUTA]
		}
	],
	consells: {
		ca: [
			"El santuari és arran de cingle: a l'esplanada i al mirador, vigila molt els nens.",
			'A la tardor i a l’hivern les fulles mortes i la pedra polida del camí vell rellisquen, sobretot a la baixada.',
			"Si vols una sortida més curta, Mirador Bellmunt proposa començar el camí vell a l'esplanada de sota la masia de la Redortra: unes 2 h 30 min en total, de dificultat baixa.",
			"El restaurant i l'hostatgeria del santuari tenen horaris propis: consulta'ls si hi vols dinar o dormir."
		],
		es: [
			'El santuario está al borde del risco: en la explanada y en el mirador, vigila mucho a los niños.',
			'En otoño e invierno las hojas secas y la piedra pulida del camí vell resbalan, sobre todo en la bajada.',
			'Si quieres una salida más corta, Mirador Bellmunt propone empezar el camí vell en la explanada bajo la masía de la Redortra: unas 2 h 30 min en total, de dificultad baja.',
			'El restaurante y la hospedería del santuario tienen horarios propios: consúltalos si quieres comer o dormir.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a Bellmunt?',
				resposta:
					"Depèn d'on comencis. La circular des de Sant Pere de Torelló de La Vall del Ges i el Bisaura fa unes 3 h 20 min en total; començant a la Redortra, Mirador Bellmunt hi dona unes 2 h 30 min anada i tornada."
			},
			{
				pregunta: 'Es pot pujar a Bellmunt amb nens?',
				resposta:
					'Sí, si ja caminen una mica: el camí vell no té passos tècnics, però la pujada inicial de pedra és molt dreta. La variant curta des de la Redortra és la més adequada. A dalt, compte amb la cinglera.'
			},
			{
				pregunta: 'Es pot dormir al santuari de Bellmunt?',
				resposta:
					"Sí, segons la Viquipèdia el santuari té servei de restaurant i d'hostatgeria al mateix edifici. Convé reservar amb antelació."
			},
			{
				pregunta: 'Bellmunt és un cim essencial?',
				resposta:
					"Sí. A Osona comparteix la categoria amb el [Matagalls](/cims/matagalls), el Castell de Milany, la Creu de Gurb i Rocallarga, i té una particularitat: el santuari del cim fa de restaurant i d'hostatgeria."
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a Bellmunt?',
				resposta:
					'Depende de dónde empieces. La circular desde Sant Pere de Torelló de La Vall del Ges i el Bisaura dura unas 3 h 20 min en total; empezando en la Redortra, Mirador Bellmunt da unas 2 h 30 min ida y vuelta.'
			},
			{
				pregunta: '¿Se puede subir a Bellmunt con niños?',
				resposta:
					'Sí, si ya caminan algo: el camí vell no tiene pasos técnicos, pero la subida inicial de piedra es muy empinada. La variante corta desde la Redortra es la más adecuada. Arriba, cuidado con el risco.'
			},
			{
				pregunta: '¿Se puede dormir en el santuario de Bellmunt?',
				resposta:
					'Sí, según la Viquipèdia el santuario tiene servicio de restaurante y hospedería en el mismo edificio. Conviene reservar con antelación.'
			},
			{
				pregunta: '¿Bellmunt es una cima esencial?',
				resposta:
					'Sí. En Osona comparte la categoría con el [Matagalls](/cims/matagalls), el Castell de Milany, la Creu de Gurb y Rocallarga, y tiene una particularidad: el santuario de la cima hace de restaurante y hospedería.'
			}
		]
	},
	fonts: [VIQUIPEDIA, FEMTURISME, VALLGESBISAURA, MIRADOR, SENDERISMEGIRONA, DERUTAENRUTA],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
