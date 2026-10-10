import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-03';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: la Mola (Sant Llorenç del Munt)',
	url: 'https://ca.wikipedia.org/wiki/La_Mola_(Sant_Lloren%C3%A7_del_Munt)',
	consultat: CONSULTAT
};

const VIQUIPEDIA_MONJOS = {
	nom: 'Viquipèdia: camí dels Monjos',
	url: 'https://ca.wikipedia.org/wiki/Cam%C3%AD_dels_Monjos',
	consultat: CONSULTAT
};

const DIBA_MONJOS = {
	nom: "Diputació de Barcelona: el Parc Natural de Sant Llorenç del Munt i l'Obac millora el camí dels Monjos",
	url: 'https://parcs.diba.cat/en/web/l-informatiu/-/sant-lloren%C3%A7-el-parc-natural-de-sant-lloren%C3%A7-del-munt-i-l-obac-millora-el-cam%C3%AD-dels-monjos-l-acc%C3%A9s-a-peu-al-conjunt-monumental-de-la-mola',
	consultat: CONSULTAT
};

const FEMTURISME = {
	nom: "Femturisme: Montcau i la Mola des del coll d'Estenalles",
	url: 'https://femturisme.cat/en/routes/montcau-and-the-mole-from-the-neck-of-pliers',
	consultat: CONSULTAT
};

const TOTNENS_MONTCAU = {
	nom: 'Totnens: excursió al Montcau amb nens',
	url: 'https://totnens.cat/que-fem/montcau/',
	consultat: '2026-10-04'
};

const DEXCURSIO = {
	nom: "D'excursió per Catalunya: el Montcau i la Mola des del coll d'Estenalles",
	url: 'https://dexcursio.net/montcau-i-la-mola/',
	consultat: '2026-10-04'
};

const fitxa: ContingutFitxa = {
	slug: 'la-mola-de-sant-llorenc-del-munt',
	descripcio: {
		ca: [
			"La Mola és el sostre del massís de Sant Llorenç del Munt i un dels cims més visitats de Catalunya: segons la Viquipèdia, rep més de 100.000 visites l'any. El cim és al terme de Matadepera, [al Vallès Occidental](/comarques/valles-occidental), dins del Parc Natural de Sant Llorenç del Munt i l'Obac, i és la gran talaia de Terrassa i Sabadell. A uns 4 km al nord hi ha el [Montcau](/cims/montcau), l'altre gran cim del massís.",
			"El que la fa única és el **monestir de Sant Llorenç del Munt**, que corona el cim. Documentat des del 947, té una església romànica construïda entre el 1045 i el 1064, i el 1931 va ser declarat monument historicoartístic; avui és un bé cultural d'interès nacional. La muntanya és feta de conglomerats, gresos i lutites dipositats per antics deltes fa uns 50 milions d'anys, i l'erosió hi ha deixat cingles, coves i agulles com el Cavall Bernat o el Morral del Drac.",
			"Des de dalt es domina tot el Vallès, la serralada de Marina i Collserola, Montserrat a l'oest i, en dies clars, el Montseny i el Pirineu. La sortida i la posta de sol hi són molt populars.",
			"A l'estiu convé fer-ho a primera hora o al vespre, perquè els camins del vessant sud són molt assolellats. Els caps de setmana hi ha moltíssima gent: si vols tranquil·litat, tria un dia feiner o l'accés pel coll d'Estenalles."
		],
		es: [
			"La Mola es el techo del macizo de Sant Llorenç del Munt y una de las cimas más visitadas de Cataluña: según la Viquipèdia, recibe más de 100.000 visitas al año. La cima está en el municipio de Matadepera, [en el Vallès Occidental](/comarques/valles-occidental), dentro del Parque Natural de Sant Llorenç del Munt i l'Obac, y es la gran atalaya de Terrassa y Sabadell. Unos 4 km al norte está el [Montcau](/cims/montcau), la otra gran cima del macizo.",
			'Lo que la hace única es el **monasterio de Sant Llorenç del Munt**, que corona la cima. Documentado desde 947, tiene una iglesia románica construida entre 1045 y 1064, y en 1931 fue declarado monumento histórico-artístico; hoy es un bien cultural de interés nacional. La montaña está hecha de conglomerados, areniscas y lutitas depositados por antiguos deltas hace unos 50 millones de años, y la erosión ha dejado riscos, cuevas y agujas como el Cavall Bernat o el Morral del Drac.',
			'Desde arriba se domina todo el Vallès, la sierra de Marina y Collserola, Montserrat al oeste y, en días claros, el Montseny y el Pirineo. El amanecer y la puesta de sol son muy populares.',
			"En verano conviene hacerlo a primera hora o al atardecer, porque los caminos de la vertiente sur son muy soleados. Los fines de semana hay muchísima gente: si buscas tranquilidad, elige un día laborable o el acceso por el coll d'Estenalles."
		]
	},
	rutes: [
		{
			id: 'cami-dels-monjos',
			nom: {
				ca: 'Pel camí dels Monjos (PR-C 31) des de Matadepera',
				es: 'Por el camí dels Monjos (PR-C 31) desde Matadepera'
			},
			sortida: { nom: 'Els Dipòsits (Matadepera)' },
			desnivellPositiuM: 481,
			distanciaKm: 2.6,
			tecnicitat: 'cap',
			descripcio: {
				ca: "És la pujada més popular. El tram final del camí medieval que unia els monestirs de Sant Cugat i de Sant Llorenç del Munt surt de la zona dels Dipòsits, a Matadepera, i en uns 2,6 km i 481 m de desnivell s'enfila de manera sostinguda fins al monestir. El parc hi va renovar el 2023 el ferm per frenar l'erosió causada pel pas d'unes 200.000 persones l'any.",
				es: 'Es la subida más popular. El tramo final del camino medieval que unía los monasterios de Sant Cugat y de Sant Llorenç del Munt sale de la zona de els Dipòsits, en Matadepera, y en unos 2,6 km y 481 m de desnivel sube de forma sostenida hasta el monasterio. El parque renovó en 2023 el firme para frenar la erosión causada por el paso de unas 200.000 personas al año.'
			},
			fonts: [VIQUIPEDIA_MONJOS, VIQUIPEDIA, DIBA_MONJOS]
		},
		{
			id: 'estenalles',
			nom: {
				ca: "Des del coll d'Estenalles (SL-C 54)",
				es: "Desde el coll d'Estenalles (SL-C 54)"
			},
			sortida: { nom: "Coll d'Estenalles" },
			distanciaKm: 6,
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "Accés pel nord, més llarg però més tranquil i ombrívol. El sender local SL-C 54 passa pel cim del Montcau (amb una grimpada curta i fàcil al final) i el coll d'Eres i segueix la carena fins al monestir: anada i tornada són uns 12 km i 501 m de desnivell, unes 3–4 h segons Femturisme.",
				es: "Acceso por el norte, más largo pero más tranquilo y sombreado. El sendero local SL-C 54 pasa por la cima del Montcau (con una trepada corta y fácil al final) y el coll d'Eres y sigue la cresta hasta el monasterio: ida y vuelta son unos 12 km y 501 m de desnivel, unas 3–4 h según Femturisme."
			},
			fonts: [FEMTURISME, VIQUIPEDIA, TOTNENS_MONTCAU, DEXCURSIO]
		}
	],
	consells: {
		ca: [
			"Fes servir els camins senyalitzats i no facis dreceres: l'erosió del vessant sud és un problema greu per al parc.",
			'El servei de bar-restaurant del monestir ha tingut períodes de tancament: porta aigua i menjar per si de cas.',
			"A l'estiu, puja a primera hora: el camí dels Monjos és molt exposat al sol.",
			'Si hi vas a veure la posta de sol, porta frontal per a la baixada.',
			"Els caps de setmana l'aparcament de la zona de Matadepera s'omple; valora arribar-hi d'hora."
		],
		es: [
			'Usa los caminos señalizados y no hagas atajos: la erosión de la vertiente sur es un problema grave para el parque.',
			'El servicio de bar-restaurante del monasterio ha tenido periodos de cierre: lleva agua y comida por si acaso.',
			'En verano, sube a primera hora: el camí dels Monjos está muy expuesto al sol.',
			'Si vas a ver la puesta de sol, lleva frontal para la bajada.',
			'Los fines de semana el aparcamiento de la zona de Matadepera se llena; valora llegar temprano.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quina és la manera més ràpida de pujar a la Mola?',
				resposta:
					'El camí dels Monjos des de Matadepera: són uns 2,6 km i uns 480 m de desnivell, segons la Viquipèdia. És curt però costerut i molt concorregut.'
			},
			{
				pregunta: 'Es pot pujar a la Mola amb nens?',
				resposta:
					"Sí, és una de les excursions familiars més clàssiques de l'àrea de Barcelona. El camí és ample i ben senyalitzat; només cal tenir en compte que la pujada és sostinguda i que a l'estiu fa molta calor."
			},
			{
				pregunta: 'Es pot visitar el monestir de Sant Llorenç del Munt?',
				resposta:
					"El conjunt monumental és al mateix cim i és un bé cultural d'interès nacional. Hi ha un punt d'informació del parc; el servei de bar-restaurant ha tingut temporades de tancament, consulta-ho abans d'anar-hi."
			},
			{
				pregunta: 'La Mola és un cim essencial?',
				resposta:
					'Sí, i és el més alt dels quatre essencials del Vallès Occidental, per sobre del [Castellsapera](/cims/castellsapera). Es pot combinar amb el [Montcau](/cims/montcau) en una sola sortida, tot i que aquest compta per al Bages.'
			}
		],
		es: [
			{
				pregunta: '¿Cuál es la forma más rápida de subir a la Mola?',
				resposta:
					'El camí dels Monjos desde Matadepera: son unos 2,6 km y unos 480 m de desnivel, según la Viquipèdia. Es corto pero empinado y muy concurrido.'
			},
			{
				pregunta: '¿Se puede subir a la Mola con niños?',
				resposta:
					'Sí, es una de las excursiones familiares más clásicas del área de Barcelona. El camino es ancho y está bien señalizado; solo hay que tener en cuenta que la subida es sostenida y que en verano hace mucho calor.'
			},
			{
				pregunta: '¿Se puede visitar el monasterio de Sant Llorenç del Munt?',
				resposta:
					'El conjunto monumental está en la propia cima y es un bien cultural de interés nacional. Hay un punto de información del parque; el servicio de bar-restaurante ha tenido temporadas de cierre, consúltalo antes de ir.'
			},
			{
				pregunta: '¿La Mola es una cima esencial?',
				resposta:
					'Sí, y es la más alta de las cuatro esenciales del Vallès Occidental, por encima del [Castellsapera](/cims/castellsapera). Se puede combinar con el [Montcau](/cims/montcau) en una sola salida, aunque este cuenta para el Bages.'
			}
		]
	},
	wikiloc: [
		{
			id: 22996844,
			titol: 'La Mola por el Camí dels Monjos',
			url: 'https://ca.wikiloc.com/rutes-senderisme/la-mola-por-el-cami-dels-monjos-22996844'
		},
		{
			id: 12348009,
			titol: 'La Mola. Sant Llorenç del Munt. Camí dels monjos.',
			url: 'https://ca.wikiloc.com/rutes-senderisme/la-mola-sant-llorenc-del-munt-cami-dels-monjos-12348009'
		}
	],
	fonts: [VIQUIPEDIA, VIQUIPEDIA_MONJOS, DIBA_MONJOS, FEMTURISME, TOTNENS_MONTCAU, DEXCURSIO],
	estat: 'esborrany',
	actualitzat: '2026-10-04'
};

export default fitxa;
