import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-03';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Canigó',
	url: 'https://ca.wikipedia.org/wiki/Canig%C3%B3',
	consultat: CONSULTAT
};

const REFUGI_MARIALLES = {
	nom: 'Refuge de Mariailles: randonnées autour de Mariailles',
	url: 'https://refugedemariailles.fr/randonn%C3%A9es-autour-de-mariailles',
	consultat: CONSULTAT
};

const REFUGI_CORTALETS = {
	nom: 'Refugi dels Cortalets (FFCAM): fitxa descriptiva del refugi (PDF)',
	url: 'https://refugedescortalets.ffcam.fr/csx/scripts/downloader2.php?filename=T004/fichier/03/fe/5lj0pt9wpfvy&mime=application/pdf&originalname=CA_description-refuge_2023.pages.pdf',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'canigo',
	descripcio: {
		ca: [
			"El Canigó és la muntanya símbol de la [Catalunya Nord](/comarques/catalunya-nord). S'aixeca entre el Conflent i el Vallespir, i des de la plana del Rosselló sembla molt més alt del que és perquè gairebé no té muntanyes al davant. La pica, també anomenada pic de Balaig, fa de límit entre els termes de Taurinyà i de Vernet. Des del 2012 el massís té la distinció francesa de Grand Site de France, amb el nom escrit en la grafia catalana.",
			"Pocs cims tenen tanta càrrega simbòlica. La tradició atribueix la primera ascensió al rei Pere el Gran, el 1285, i Jacint Verdaguer en va fer el centre del seu poema «Canigó». Cada 22 de juny s'hi encén la **Flama del Canigó**, que es vetlla al cim tota la nit i baixa l'endemà per encendre les fogueres de Sant Joan a tots els Països Catalans. Al cim hi ha una creu de ferro, on sovint onegen senyeres. I té també un paper científic: a finals del segle XVIII es va fer servir com a vèrtex en la mesura del meridià que va servir per definir el metre.",
			"Com que s'aixeca sol a l'extrem oriental del Pirineu, la vista és molt àmplia: la plana del Rosselló i la costa cap a l'est, el Conflent als peus i, cap a ponent, la carena pirinenca amb el [Puig de Tretzevents](/cims/puig-de-tretzevents) a tocar i les muntanyes del Ripollès i la Cerdanya més enllà.",
			"La temporada bona va de juny a octubre. Al voltant de Sant Joan hi ha molta gent per la Flama. A l'hivern i a la primavera el cim és nevat i la xemeneia pot tenir gel: aleshores és una ascensió d'alta muntanya."
		],
		es: [
			'El Canigó es la montaña símbolo de la [Cataluña Norte](/comarques/catalunya-nord). Se alza entre el Conflent y el Vallespir, y desde la llanura del Rosellón parece mucho más alto de lo que es porque apenas tiene montañas delante. La cima, también llamada pic de Balaig, hace de límite entre los municipios de Taurinyà y Vernet. Desde 2012 el macizo tiene la distinción francesa de Grand Site de France, con el nombre escrito en su grafía catalana.',
			'Pocas cimas tienen tanta carga simbólica. La tradición atribuye la primera ascensión al rey Pedro el Grande, en 1285, y Jacint Verdaguer lo convirtió en el centro de su poema «Canigó». Cada 22 de junio se enciende allí la **Flama del Canigó**, que se vela en la cima toda la noche y baja al día siguiente para encender las hogueras de San Juan en todos los territorios de habla catalana. En la cima hay una cruz de hierro, donde a menudo ondean senyeras. Y tiene también un papel científico: a finales del siglo XVIII sirvió de vértice en la medición del meridiano con la que se definió el metro.',
			'Como se alza solo en el extremo oriental del Pirineo, la vista es muy amplia: la llanura del Rosellón y la costa hacia el este, el Conflent a los pies y, hacia el oeste, la cresta pirenaica con el [Puig de Tretzevents](/cims/puig-de-tretzevents) al lado y las montañas del Ripollès y la Cerdaña más allá.',
			'La buena temporada va de junio a octubre. Alrededor de San Juan hay mucha gente por la Flama. En invierno y primavera la cima está nevada y la chimenea puede tener hielo: entonces es una ascensión de alta montaña.'
		]
	},
	rutes: [
		{
			id: 'marialles-xemeneia',
			nom: {
				ca: 'Des del refugi de Marialles per la xemeneia',
				es: 'Desde el refugio de Marialles por la chimenea'
			},
			sortida: { nom: 'Refugi de Marialles (Castell de Vernet)' },
			desnivellPositiuM: 1096,
			tempsMinuts: 240,
			descripcio: {
				ca: "És l'ascensió clàssica pel vessant oest. Se segueix el GR i després les marques grogues fins a la portella de Vallmanya, i s'acaba per la **xemeneia**, una canal d'uns 70 m sense equipar on cal grimpar amb mans i peus. El refugi avisa que el risc principal és la caiguda de pedres que fan anar els altres excursionistes.",
				es: 'Es la ascensión clásica por la vertiente oeste. Se sigue el GR y después las marcas amarillas hasta la portella de Vallmanya, y se termina por la **chimenea**, una canal de unos 70 m sin equipar donde hay que trepar con manos y pies. El refugio avisa de que el principal riesgo es la caída de piedras que provocan otros excursionistas.'
			},
			fonts: [REFUGI_MARIALLES]
		},
		{
			id: 'cortalets',
			nom: { ca: 'Des del refugi dels Cortalets', es: 'Desde el refugio de los Cortalets' },
			sortida: { nom: 'Refugi dels Cortalets' },
			desnivellPositiuM: 634,
			descripcio: {
				ca: 'Des dels Cortalets el cim queda a uns 634 m de desnivell i no cal passar per la xemeneia. Ja no es pot pujar en cotxe al refugi (llevat dels drethavents): cal arribar-hi a peu, per exemple des del Mas Malet o des del coll de Milleres, amb 3–4 h de camí i més de 1.000 m de desnivell, segons el mateix refugi. Per això sovint es fa en dos dies.',
				es: 'Desde los Cortalets la cima queda a unos 634 m de desnivel y no hay que pasar por la chimenea. Ya no se puede subir en coche al refugio (salvo quienes tienen derecho de paso): hay que llegar a pie, por ejemplo desde el Mas Malet o desde el coll de Milleres, con 3–4 h de camino y más de 1.000 m de desnivel, según el propio refugio. Por eso a menudo se hace en dos días.'
			},
			fonts: [REFUGI_CORTALETS]
		}
	],
	consells: {
		ca: [
			"Si no et sents segur grimpant, evita la xemeneia: puja pels Cortalets o conforma't amb les crestes del Barbet, que el refugi de Marialles proposa com a alternativa sense dificultat tècnica.",
			"A la xemeneia, posa't el casc si en tens i no pugis just a sota d'un altre grup: la caiguda de pedres és el risc principal.",
			"Les pistes del Llec i de Balaig estan tancades al trànsit motoritzat per sobre del Mas Malet i del coll de Milleres: compta a fer a peu l'aproximació.",
			'El refugi dels Cortalets preveu obres de renovació entre el 2026 i el 2029: consulta si és obert abans de planificar-hi la nit.',
			"Al juny, a les canals orientades al nord hi pot quedar neu dura: informa't de l'estat abans de sortir."
		],
		es: [
			'Si no te sientes seguro trepando, evita la chimenea: sube por los Cortalets o confórmate con las crestas del Barbet, que el refugio de Marialles propone como alternativa sin dificultad técnica.',
			'En la chimenea, ponte el casco si tienes y no subas justo debajo de otro grupo: la caída de piedras es el principal riesgo.',
			'Las pistas del Llec y de Balaig están cerradas al tráfico motorizado por encima del Mas Malet y del coll de Milleres: cuenta con hacer a pie la aproximación.',
			'El refugio de los Cortalets prevé obras de renovación entre 2026 y 2029: consulta si está abierto antes de planificar la noche allí.',
			'En junio, en las canales orientadas al norte puede quedar nieve dura: infórmate del estado antes de salir.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar al Canigó?',
				resposta:
					"Des del refugi de Marialles, unes 4 h fins al cim i uns 1.100 m de desnivell, segons el refugi. Des dels Cortalets el desnivell és d'uns 634 m, però abans cal arribar-hi a peu, i per això molta gent hi fa nit."
			},
			{
				pregunta: 'La xemeneia del Canigó és perillosa?',
				resposta:
					"És una canal curta on cal grimpar fàcil, però sense cap equipament i amb pedra que cau quan hi ha gent a sobre. Amb neu o gel és un pas d'alta muntanya. Si no tens experiència, la via dels Cortalets l'evita."
			},
			{
				pregunta: 'Quan es fa la Flama del Canigó?',
				resposta:
					"El 22 de juny s'encén la Flama al cim, s'hi vetlla tota la nit i l'endemà baixa per encendre les fogueres de Sant Joan. Aquells dies la muntanya i els refugis són molt concorreguts."
			},
			{
				pregunta: 'El Canigó compta com a cim essencial del repte?',
				resposta:
					'Sí, és un dels [cims essencials](/cims-essencials) i un dels cims de la Catalunya Nord inclosos al repte. Les condicions de validació són a la [normativa](/repte-100-cims/normativa).'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir al Canigó?',
				resposta:
					'Desde el refugio de Marialles, unas 4 h hasta la cima y unos 1.100 m de desnivel, según el refugio. Desde los Cortalets el desnivel es de unos 634 m, pero antes hay que llegar a pie, y por eso mucha gente hace noche allí.'
			},
			{
				pregunta: '¿La chimenea del Canigó es peligrosa?',
				resposta:
					'Es una canal corta con trepada fácil, pero sin ningún equipamiento y con piedras que caen cuando hay gente encima. Con nieve o hielo es un paso de alta montaña. Si no tienes experiencia, la vía de los Cortalets la evita.'
			},
			{
				pregunta: '¿Cuándo se hace la Flama del Canigó?',
				resposta:
					'El 22 de junio se enciende la Flama en la cima, se vela toda la noche y al día siguiente baja para encender las hogueras de San Juan. Esos días la montaña y los refugios están muy concurridos.'
			},
			{
				pregunta: '¿El Canigó cuenta como cima esencial del reto?',
				resposta:
					'Sí, es una de las [cimas esenciales](/cims-essencials) y una de las cimas de la Cataluña Norte incluidas en el reto. Las condiciones de validación están en la [normativa](/repte-100-cims/normativa).'
			}
		]
	},
	wikiloc: [
		{
			id: 3329231,
			titol: 'Pujada al pic del Canigó des del refugi dels Cortalets',
			url: 'https://ca.wikiloc.com/rutes-senderisme/pujada-al-pic-del-canigo-des-del-refugi-dels-cortalets-3329231'
		},
		{
			id: 15384030,
			titol: 'Canigó per Cortalets (Ruta circular clàssica)',
			url: 'https://ca.wikiloc.com/rutes-senderisme/canigo-per-cortalets-ruta-circular-classica-15384030'
		}
	],
	fonts: [VIQUIPEDIA, REFUGI_MARIALLES, REFUGI_CORTALETS],
	estat: 'esborrany',
	actualitzat: '2026-10-03'
};

export default fitxa;
