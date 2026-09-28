/**
 * Llista de 150 cims essencials del repte 100 Cims, tal com apareix al PDF públic de la FEEC
 * (https://www.feec.cat/wp-content/uploads/2020/02/Essencials-100-cims.pdf, 6 pàgines,
 * consultat el 2026-09-28). És un fet (quins cims són essencials i a quina comarca els
 * assigna la FEEC); no es copia res més de la web de la FEEC.
 *
 * Correccions d'extracció del PDF: "El Castelllot" → "El Castellot", "Ta g a" → "Taga",
 * "Ta g a m a n e n t" → "Tagamanent"; apòstrof tipogràfic (’) → recte (').
 *
 * Camps per cim:
 * - `nom`: tal com surt al PDF (amb l'article en majúscula si el porta).
 * - `article`: només si el PDF no el porta; és l'ús habitual en català ("pujar al Bassegoda").
 *   `revisarArticle` marca els casos dubtosos per a revisió humana (surten a l'informe).
 * - `cerca`: noms alternatius per buscar a les fonts (topònim ICGC, francès a l'IGN...).
 * - `slug`: només quan no s'aplica la regla general (docs/02-arquitectura-seo.md §3.2).
 * - `alies`: altres noms per al cercador de l'app.
 */
import type { Article } from '../../src/lib/domain/toponims.ts';

export interface EssencialDef {
	comarca: string;
	nom: string;
	article?: Article;
	revisarArticle?: string;
	cerca?: string[];
	slug?: string;
	alies?: string[];
}

type Opts = Omit<EssencialDef, 'comarca' | 'nom'>;
type Entrada = string | [string, Opts];

const LO = 'Article dialectal "lo": comprovar les formes "de lo" / "a lo".';

const LLISTA: Record<string, Entrada[]> = {
	'alt-camp': [
		'El Cogulló de Cabra',
		'El Tossal Gros',
		['Tossa Grossa de Montferri', { article: 'la' }]
	],
	'alt-emporda': [
		['Bassegoda', { article: 'el', cerca: ['Bassegoda', 'Puig de Bassegoda'] }],
		[
			'Castell Saverdera',
			{
				article: 'el',
				cerca: ['Castell de Verdera', 'Sant Salvador Saverdera', 'Castell Saverdera'],
				alies: ['Sant Salvador Saverdera', 'Castell de Verdera']
			}
		],
		'El Mont',
		['Puig Neulós', { article: 'el', cerca: ['Puig Neulós', 'Neulós'] }],
		['Roc del Comptador', { article: 'el' }]
	],
	'alt-penedes': ['El Castellot', ['Penya del Papiol', { article: 'la' }]],
	'alt-urgell': [
		['Cap del Verd', { article: 'el' }],
		['Cogulló de Turp', { article: 'el' }],
		'El Coscollet',
		['Monturull', { article: 'el', cerca: ['Monturull', 'Pic de Monturull'] }],
		[
			"Pic d'Enclar (Bony de la Pica)",
			{ article: 'el', cerca: ['Bony de la Pica', "Pic d'Enclar"], alies: ['Bony de la Pica'] }
		],
		['Pic de Salòria', { article: 'el' }],
		['Sant Honorat', { article: '', cerca: ['Roques de Sant Honorat', 'Sant Honorat'] }],
		['Santa Fe', { article: '', cerca: ['Santa Fe', 'Tossal de Santa Fe', 'Serrat de Santa Fe'] }],
		['Vulturó', { article: 'el', cerca: ['Vulturó', 'Tossal del Vulturó'] }]
	],
	'alta-ribagorca': [
		['Gran Tuc de Colomers', { article: 'el' }],
		['Lo Corronco', { revisarArticle: LO }],
		['Pala del Teller', { article: 'la' }],
		[
			'Pic de Comaloforno',
			{ article: 'el', cerca: ['Pic de Comaloforno', 'Comaloformo', 'Tuc de Comaloformo'] }
		],
		['Punta Alta', { article: 'la', cerca: ['Punta Alta', 'Punta Alta de Comalesbienes'] }],
		['Tossal de les Roies de Cardet', { article: 'el' }]
	],
	anoia: [
		['Montgròs', { article: 'el' }],
		['Puig de Sant Miquel', { article: 'el' }],
		['Sant Jeroni', { article: '' }]
	],
	bages: [
		['Collbaix', { article: 'el' }],
		['Montcau', { article: 'el' }],
		[
			"Roca de Sant Salvador (l'Elefant)",
			{ article: 'la', cerca: ['Roca de Sant Salvador', 'Elefant'], alies: ["l'Elefant"] }
		]
	],
	'baix-camp': [
		[
			'Cavall Bernat de Llaberia',
			{ article: 'el', cerca: ['Cavall Bernat de Llaberia', 'Cavall Bernat'] }
		],
		['Mola de Colldejou', { article: 'la' }],
		['Mola de Genesies', { article: 'la' }],
		['Molló Puntaire', { article: 'el' }],
		['Puig de la Cabrafiga', { article: 'el' }],
		['Tossal de la Baltasana', { article: 'el' }]
	],
	'baix-ebre': [
		['Caro', { article: 'el', cerca: ['Mont Caro', 'Caro'], alies: ['Mont Caro'] }],
		["Tossal d'Engrilló", { article: 'el' }],
		[
			'Xàquera o Creu de Santos',
			{ article: 'la', cerca: ['Creu de Santos', 'Xàquera'], alies: ['Creu de Santos'] }
		]
	],
	'baix-emporda': [
		['Castell de Montgrí', { article: 'el', cerca: ['Castell de Montgrí', 'Montgrí'] }]
	],
	'baix-llobregat': [
		'La Morella',
		['Sant Pere Màrtir', { article: '' }],
		['Sant Ramon', { article: '' }],
		['Sant Salvador de les Espases', { article: '' }]
	],
	'baix-penedes': [['Talaia del Montmell', { article: 'la' }]],
	barcelones: [
		['Puig Castellar', { article: 'el' }],
		['Turó de Magarola', { article: 'el' }]
	],
	bergueda: [
		['Cap de la Gallina Pelada', { article: 'el' }],
		["Cogulló d'Estela", { article: 'el' }],
		[
			'Comabona',
			{ article: 'el', revisarArticle: 'Ús vacil·lant: "el Comabona" / "la Comabona".' }
		],
		'La Tosa',
		['Penyes Altes', { article: 'les', cerca: ['Penyes Altes', 'Penyes Altes de Moixeró'] }],
		[
			'Pollegó Superior (Pedraforca)',
			{
				article: 'el',
				slug: 'pedraforca-pollego-superior',
				cerca: ['Pollegó Superior'],
				alies: ['Pedraforca']
			}
		]
	],
	cerdanya: [
		'La Carabassa',
		'La Muga',
		['Puigpedrós', { article: 'el' }],
		[
			'Tossa Plana de Lles (pic de la Portelleta)',
			{
				article: 'la',
				cerca: ['Tossa Plana de Lles', 'Pic de la Portelleta'],
				alies: ['Pic de la Portelleta']
			}
		]
	],
	'conca-de-barbera': [
		["Mola d'Estat", { article: 'la' }],
		['Punta del Curull', { article: 'la' }],
		['Sant Miquel de Montclar', { article: '' }],
		['Tossal Gros de Vallbona', { article: 'el' }]
	],
	garraf: [["Puig de l'Àliga", { article: 'el' }]],
	garrigues: ['Els Bessons'],
	garrotxa: [
		[
			'Cabrera',
			{ article: '', revisarArticle: 'Sense article ("pujar a Cabrera")? Comprovar l\'ús local.' }
		],
		['Comanegra', { article: 'el', cerca: ['Comanegra', 'Puig de Comanegra'] }],
		['Puig Ou', { article: 'el' }],
		['Puigsacalm', { article: 'el' }]
	],
	girones: [
		['Castell de Sant Miquel', { article: 'el', cerca: ['Castell de Sant Miquel', 'Sant Miquel'] }],
		['Els Àngels', { cerca: ['Puig dels Àngels', 'els Àngels'] }]
	],
	maresme: [
		['Castell de Burriac', { article: 'el', cerca: ['Castell de Burriac', 'Burriac'] }],
		['Montalt', { article: 'el' }]
	],
	moianes: [['Puig de la Caritat', { article: 'el' }]],
	montsia: [
		['Torreta del Montsià', { article: 'la' }],
		['Tossal dels Tres Reis', { article: 'el' }]
	],
	noguera: [
		['Pala Alta', { article: 'la' }],
		['Penya Sant Alís', { article: 'la', cerca: ['Penya Sant Alís', 'Sant Alís'] }],
		['Sant Mamet', { article: '' }],
		[
			'Tossal de Mira Pallars i Urgell',
			{
				article: 'el',
				cerca: ['Tossal de Mirapallars i Urgell', 'Tossal de Mira Pallars i Urgell', 'Mirapallars']
			}
		]
	],
	osona: [
		['Bellmunt', { article: '', revisarArticle: 'Sense article ("pujar a Bellmunt")? Comprovar.' }],
		['Castell de Milany', { article: 'el', cerca: ['Castell de Milany', 'Milany'] }],
		['Creu de Gurb', { article: 'la' }],
		['Matagalls', { article: 'el' }],
		['Rocallarga', { article: 'la' }]
	],
	'pallars-jussa': [
		['Cap del Boumort', { article: 'el' }],
		['Montsent de Pallars', { article: 'el' }],
		['Pic de Peguera', { article: 'el' }],
		['Pica de Cerví', { article: 'la' }],
		['Pui de Lleràs', { article: 'el' }],
		['Sant Corneli', { article: '', cerca: ['Sant Corneli', 'Cap de Sant Corneli'] }],
		['Tuc de la Cometa', { article: 'el' }]
	],
	'pallars-sobira': [
		['Campirme', { article: 'el' }],
		['Lo Tèsol', { revisarArticle: LO }],
		['Monteixo', { article: 'el' }],
		['Mont-roig', { article: 'el' }],
		['Pic de Certascan', { article: 'el' }],
		['Pic de Moredo', { article: 'el' }],
		['Pic de Sotllo', { article: 'el' }],
		["Pica d'Estats", { article: 'la' }],
		["Torreta de l'Orri", { article: 'la' }],
		['Tuc de la Llança', { article: 'el' }],
		['Tuc de Ratera', { article: 'el' }]
	],
	'pla-d-urgell': ['La Fita Alta'],
	'pla-de-l-estany': [['Sant Patllarí', { article: '' }]],
	priorat: [['Roca Corbatera', { article: 'la' }]],
	'ribera-d-ebre': [
		'La Picossa',
		['La Tossa (Tivissa)', { slug: 'la-tossa-tivissa', cerca: ['la Tossa'] }],
		['Lo Tormo', { revisarArticle: LO }]
	],
	ripolles: [
		['Balandrau', { article: 'el' }],
		['Bastiments', { article: 'el', cerca: ['Bastiments', 'Pic de Bastiments'] }],
		[
			'Costa Pubilla o Pla de Pujalts',
			{ article: 'la', cerca: ['Costa Pubilla', 'Pla de Pujalts'], alies: ['Pla de Pujalts'] }
		],
		['Costabona', { article: 'el' }],
		['Puigmal', { article: 'el' }],
		['Taga', { article: 'el' }]
	],
	segarra: [['Tossal de la Creu', { article: 'el' }]],
	segria: [['Punta de Montmeneu', { article: 'la' }]],
	selva: [
		'Les Agudes',
		['Sant Miquel de Solterra', { article: '' }],
		['Turó de Montsoriu', { article: 'el', cerca: ['Turó de Montsoriu', 'Castell de Montsoriu'] }]
	],
	solsones: ['El Cogul', ['Puig de les Morreres', { article: 'el' }]],
	tarragones: ['La Mola'],
	'terra-alta': [
		['Roques de Benet', { article: 'les' }],
		['Santa Bàrbara', { article: '', cerca: ['Santa Bàrbara', 'Puig de Santa Bàrbara'] }]
	],
	urgell: [["Pilar d'Almenara", { article: 'el', cerca: ["Pilar d'Almenara", 'Almenara'] }]],
	'val-d-aran': [
		['Maubèrme', { article: 'el', cerca: ['Tuc de Maubèrme', 'Maubèrme'] }],
		['Montardo', { article: 'el', cerca: ["Montardo d'Aran", 'Montardo'] }],
		['Montcorbison', { article: 'el', cerca: ['Montcorbison', 'Tuc de Montcorbison'] }],
		['Montlude', { article: 'el', cerca: ['Montlude', 'Tuc de Montlude'] }],
		['Tuc de Molieres', { article: 'el' }],
		['Tuc deth Port de Vielha', { article: 'el' }]
	],
	'valles-occidental': [
		['Castellsapera', { article: 'el' }],
		['La Mola de Sant Llorenç del Munt', { cerca: ['la Mola'] }],
		['Puig de la Creu', { article: 'el' }],
		['Sant Sadurní de Gallifa', { article: '' }]
	],
	'valles-oriental': [
		['Pic del Vent', { article: 'el' }],
		['Tagamanent', { article: 'el' }]
	],
	andorra: [
		[
			'Casamanya Nord',
			{
				article: 'el',
				cerca: ['Pic de Casamanya Nord', 'Casamanya Nord', 'Pic de Casamanya'],
				revisarArticle: '"el Casamanya Nord"?'
			}
		],
		['Comapedrosa', { article: 'el', cerca: ['Pic de Comapedrosa', 'Comapedrosa'] }],
		['Pic de la Serrera', { article: 'el' }],
		["Pic Negre d'Envalira", { article: 'el' }],
		[
			'Tristaina',
			{
				article: 'el',
				cerca: ['Pic de Tristaina', 'Tristaina'],
				revisarArticle: '"el Tristaina" (pic de Tristaina)?'
			}
		]
	],
	'catalunya-nord': [
		[
			"Cambra d'Ase",
			{ article: 'la', cerca: ["Cambra d'Ase", "Cambre d'Aze", "Pic de Cambra d'Ase"] }
		],
		['Canigó', { article: 'el', cerca: ['Pic del Canigó', 'Pic du Canigou', 'Canigó'] }],
		['Carlit', { article: 'el', cerca: ['Puig Carlit', 'Pic Carlit', 'Carlit'] }],
		[
			'Puig de Tretzevents',
			{ article: 'el', cerca: ['Puig de Tretzevents', 'Pic des Treize Vents', 'Tretzevents'] }
		],
		['Puig Peric', { article: 'el', cerca: ['Puig Peric', 'Pic Péric', 'Grand Péric'] }],
		['Roc de Madres', { article: 'el', cerca: ['Roc de Madres', 'Pic de Madrès', 'Madres'] }],
		["Torre d'Eina", { article: 'la', cerca: ["Torre d'Eina", "Tour d'Eyne", "la Torre d'Eina"] }],
		['Torre de Madeloc', { article: 'la', cerca: ['Torre de Madeloc', 'Tour de Madeloc'] }]
	]
};

const RE_ARTICLE = /^(El|La|Els|Les|Lo) (.+)$/;

/** Article i nom sense article a partir del nom del PDF ("La Tosa" → la / "Tosa"). */
export function articleDelNom(def: EssencialDef): { article: Article; base: string } {
	const m = RE_ARTICLE.exec(def.nom);
	if (m) return { article: m[1].toLowerCase() as Article, base: m[2] };
	if (def.nom.startsWith("L'")) return { article: "l'", base: def.nom.slice(2) };
	if (def.article === undefined) throw new Error(`Cal indicar l'article de "${def.nom}"`);
	return { article: def.article, base: def.nom };
}

/** Les 150 entrades en l'ordre del PDF (l'ordre defineix l'id estable inicial). */
export const ESSENCIALS: EssencialDef[] = Object.entries(LLISTA).flatMap(([comarca, cims]) =>
	cims.map((e): EssencialDef =>
		typeof e === 'string' ? { comarca, nom: e } : { comarca, nom: e[0], ...e[1] }
	)
);
