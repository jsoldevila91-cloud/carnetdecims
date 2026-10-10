import type { ContingutFitxa } from './types';

const CONSULTAT = '2026-10-10';

const VIQUIPEDIA = {
	nom: 'Viquipèdia: Penyes Altes de Moixeró',
	url: 'https://ca.wikipedia.org/wiki/Penyes_Altes_de_Moixer%C3%B3',
	consultat: CONSULTAT
};

const VIQUIPEDIA_SERRA = {
	nom: 'Viquipèdia: serra de Moixeró',
	url: 'https://ca.wikipedia.org/wiki/Serra_de_Moixer%C3%B3',
	consultat: CONSULTAT
};

const FEMTURISME = {
	nom: 'Femturisme: Penyes Altes del Moixeró des de Gréixer',
	url: 'https://www.femturisme.cat/ca/rutes/penyes-altes-del-moixero-des-de-greixer',
	consultat: CONSULTAT
};

const FEMTURISME_SERP = {
	nom: 'Femturisme: ruta circular per les Penyes Altes del Moixeró per la canal de la Serp',
	url: 'https://femturisme.cat/es/rutas/ruta-circular-por-las-penyes-altes-del-moixero-por-la-canal-de-la-serp',
	consultat: CONSULTAT
};

const fitxa: ContingutFitxa = {
	slug: 'penyes-altes',
	descripcio: {
		ca: [
			'Les Penyes Altes de Moixeró són el punt més alt de la serra de Moixeró, dins del Parc Natural del Cadí-Moixeró. El cim és al límit entre el [Berguedà](/comarques/bergueda) i la Baixa Cerdanya, als termes de Guardiola de Berguedà, Riu de Cerdanya i Urús, i és on conflueixen les províncies de Barcelona, Lleida i Girona. La serra fa de divisòria entre les conques del Segre i del Llobregat.',
			"La serra de Moixeró va del coll de Pendís al coll de Jou i, a diferència del Cadí, que és calcari i mesozoic, és d'origen paleozoic, format durant l'orogènia herciniana. Als cims dominen les calcàries devonianes, voltades d'esquists carbonífers, i queda un aflorament de riolites a Gréixer. A la serra no hi ha cap poble, només cases escampades i refugis. Als vessants hi ha pi roig i avet, amb faigs fins a uns 1.800 m, on comença el pi negre; per sobre dels 2.000 m, prats i roca blanquinosa.",
			"Segons Femturisme, la Cerdanya es descobreix per primera vegada al collet Raset, a 2.056 m, i des del cim la panoràmica és oberta en totes direccions, amb l'Alt Berguedà al sud i la Cerdanya al nord. Pel mateix itinerari es pot allargar l'excursió fins al Moixeró (2.090 m) o fer una circular en direcció a la [Tosa](/cims/la-tosa) o al coll de Jou.",
			"És una excursió llarga, amb molt de desnivell i, segons Femturisme, sense dificultat tècnica, tot i que l'últim tram per la carena demana alguna grimpada fàcil. La millor època va de finals de primavera a la tardor; amb neu o gel, aquests passos finals canvien molt."
		],
		es: [
			'Las Penyes Altes de Moixeró son el punto más alto de la serra de Moixeró, dentro del Parque Natural del Cadí-Moixeró. La cima está en el límite entre el [Berguedà](/comarques/bergueda) y la Baixa Cerdanya, en los términos de Guardiola de Berguedà, Riu de Cerdanya y Urús, y es donde confluyen las provincias de Barcelona, Lleida y Girona. La sierra hace de divisoria entre las cuencas del Segre y del Llobregat.',
			'La serra de Moixeró va del coll de Pendís al coll de Jou y, a diferencia del Cadí, que es calcáreo y mesozoico, es de origen paleozoico, formado durante la orogenia herciniana. En las cimas dominan las calizas devonianas, rodeadas de esquistos carboníferos, y queda un afloramiento de riolitas en Gréixer. En la sierra no hay ningún pueblo, solo casas dispersas y refugios. En las laderas hay pino silvestre y abeto, con hayas hasta unos 1.800 m, donde empieza el pino negro; por encima de los 2.000 m, prados y roca blanquecina.',
			'Según Femturisme, la Cerdanya se descubre por primera vez en el collet Raset, a 2.056 m, y desde la cima la panorámica es abierta en todas direcciones, con el Alt Berguedà al sur y la Cerdanya al norte. Por el mismo itinerario se puede alargar la excursión hasta el Moixeró (2.090 m) o hacer una circular en dirección a la [Tosa](/cims/la-tosa) o al coll de Jou.',
			'Es una excursión larga, con mucho desnivel y, según Femturisme, sin dificultad técnica, aunque el último tramo por la cresta pide alguna trepada fácil. La mejor época va de finales de primavera al otoño; con nieve o hielo, esos pasos finales cambian mucho.'
		]
	},
	rutes: [
		{
			id: 'greixer',
			nom: {
				ca: 'Des de Gréixer per la canal de la Serp',
				es: 'Desde Gréixer por la canal de la Serp'
			},
			sortida: { nom: 'Pont de Gréixer (carretera del coll de Pal)' },
			tecnicitat: 'grimpada-facil',
			descripcio: {
				ca: "La pista de Gréixer és tancada al trànsit, de manera que es comença des del peu de la carretera. Es passa pel nucli de Gréixer i es puja per la canal de la Serp, marcada amb pintura groga i moltes fites, entre pinedes, rouredes i faigs, fins al collet Raset (2.056 m). D'allà, la carena del GR 150-1 porta a les Penyes Altes; Femturisme hi descriu una grimpada final fàcil, sense dificultat tècnica. La circular completa, amb el Moixeró i la baixada per la font de la Cabrera, fa 14 km i 1.377 m de desnivell en 5 a 6 h.",
				es: 'La pista de Gréixer está cerrada al tráfico, así que se empieza desde el pie de la carretera. Se pasa por el núcleo de Gréixer y se sube por la canal de la Serp, marcada con pintura amarilla y muchos hitos, entre pinares, robledales y hayas, hasta el collet Raset (2.056 m). Desde allí, la cresta del GR 150-1 lleva a las Penyes Altes; Femturisme describe una trepada final fácil, sin dificultad técnica. La circular completa, con el Moixeró y la bajada por la font de la Cabrera, son 14 km y 1.377 m de desnivel en 5 a 6 h.'
			},
			fonts: [FEMTURISME, FEMTURISME_SERP]
		}
	],
	consells: {
		ca: [
			'La pista de Gréixer és tancada al trànsit: compta amb un tram afegit a peu des de la carretera fins al nucli de Gréixer.',
			'La canal de la Serp porta marques de pintura groga i fites, però és una pujada forta; guarda forces per a la carena.',
			"L'últim tram fins al cim té alguna grimpada fàcil; amb roca humida o gelada, pensa-t'ho.",
			"La font de la Cabrera, a la baixada, és l'únic punt d'aigua que esmenta Femturisme: porta aigua suficient per a la pujada.",
			"Pots allargar la ruta fins al Moixeró (2.090 m) o fins a la Tosa; valora l'hora de sortida i el temps abans de decidir-ho."
		],
		es: [
			'La pista de Gréixer está cerrada al tráfico: cuenta con un tramo añadido a pie desde la carretera hasta el núcleo de Gréixer.',
			'La canal de la Serp lleva marcas de pintura amarilla e hitos, pero es una subida fuerte; guarda fuerzas para la cresta.',
			'El último tramo hasta la cima tiene alguna trepada fácil; con roca húmeda o helada, piénsatelo.',
			'La font de la Cabrera, en la bajada, es el único punto de agua que menciona Femturisme: lleva agua suficiente para la subida.',
			'Puedes alargar la ruta hasta el Moixeró (2.090 m) o hasta la Tosa; valora la hora de salida y el tiempo antes de decidirlo.'
		]
	},
	faq: {
		ca: [
			{
				pregunta: 'Quant es triga a pujar a les Penyes Altes?',
				resposta:
					'Femturisme dona de 5 a 6 hores per a la circular de 14 km i 1.377 m de desnivell des del pont de Gréixer, amb el Moixeró inclòs. Femturisme no dona el temps fins al cim, que és el primer dels dos.'
			},
			{
				pregunta: 'Té passos de grimpada?',
				resposta:
					'Femturisme descriu una grimpada final fàcil, sense dificultat tècnica, i no parla de cadenes ni cordes. La resta és camí, canal amb pintura groga i carena.'
			},
			{
				pregunta: 'On són exactament les Penyes Altes?',
				resposta:
					'Entre el Berguedà i la Baixa Cerdanya, als termes de Guardiola de Berguedà, Riu de Cerdanya i Urús. Segons la Viquipèdia, hi conflueixen les províncies de Barcelona, Lleida i Girona.'
			},
			{
				pregunta: 'Les Penyes Altes compten com a cim essencial?',
				resposta:
					'Sí. Són el cinquè dels sis essencials del Berguedà per altitud, per sota de la Gallina Pelada, i el cim més alt de la serra de Moixeró. La [Tosa](/cims/la-tosa) és un altre essencial de la mateixa zona.'
			}
		],
		es: [
			{
				pregunta: '¿Cuánto se tarda en subir a las Penyes Altes?',
				resposta:
					'Femturisme da de 5 a 6 horas para la circular de 14 km y 1.377 m de desnivel desde el pont de Gréixer, con el Moixeró incluido. Femturisme no da el tiempo hasta la cima, que es la primera de las dos.'
			},
			{
				pregunta: '¿Tiene pasos de trepada?',
				resposta:
					'Femturisme describe una trepada final fácil, sin dificultad técnica, y no habla de cadenas ni cuerdas. El resto es camino, canal con pintura amarilla y cresta.'
			},
			{
				pregunta: '¿Dónde están exactamente las Penyes Altes?',
				resposta:
					'Entre el Berguedà y la Baixa Cerdanya, en los términos de Guardiola de Berguedà, Riu de Cerdanya y Urús. Según la Viquipèdia, allí confluyen las provincias de Barcelona, Lleida y Girona.'
			},
			{
				pregunta: '¿Las Penyes Altes cuentan como cima esencial?',
				resposta:
					'Sí. Son la quinta de las seis esenciales del Berguedà por altitud, por debajo de la Gallina Pelada, y la cima más alta de la serra de Moixeró. La [Tosa](/cims/la-tosa) es otra esencial de la misma zona.'
			}
		]
	},
	fonts: [VIQUIPEDIA, VIQUIPEDIA_SERRA, FEMTURISME, FEMTURISME_SERP],
	estat: 'esborrany',
	actualitzat: '2026-10-10'
};

export default fitxa;
