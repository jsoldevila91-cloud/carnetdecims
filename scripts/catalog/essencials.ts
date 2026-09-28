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
 * - `nom`: tal com surt al PDF (amb l'article en majúscula si el porta). Surt com a
 *   `nom_oficial` i és la base de les consultes a les fonts (no canviar-lo: invalida la caché).
 * - `visible`: nom visible (H1, title, llistats) quan no és el del PDF (vegeu criteris).
 * - `article`: només si el nom visible no el porta ("pujar al Bassegoda").
 *   `revisarArticle` marca els casos dubtosos per a revisió humana (surten a l'informe).
 * - `cerca`: noms alternatius per buscar a les fonts (topònim ICGC, francès a l'IGN...).
 * - `slug`: només quan no s'aplica la regla general (docs/02-arquitectura-seo.md §3.2).
 * - `alies`: altres noms per al cercador de l'app.
 *
 * Criteris del nom visible, l'article i l'slug (revisió SEO/lingüística, 2026-09-28):
 * - Referència principal: el Nomenclàtor/topònims de l'ICGC (decisió del projecte). Si la FEEC i
 *   l'ICGC escriuen el mateix topònim diferent (accents, preposició, article fix), s'usa la
 *   forma de l'ICGC: "Mola de Genessies", "Cap de Boumort", "Torreta de Montsià", "lo Coscollet",
 *   "el Corronco", "Tuc deth Pòrt de Vielha"... Si són noms diferents ("Tossal dels Tres Reis" /
 *   "Tossal del Rei"), es manté el de la FEEC (el conegut) i l'altre queda a `toponim`/`alies`.
 * - Nom popular quan és el que es busca: "Pedraforca" (Pollegó Superior), "L'Elefant" (Roca de
 *   Sant Salvador), "Creu de Santos" (Xàquera), "Costa Pubilla" (Pla de Pujalts).
 * - Article: el fix del topònim ICGC si en té ("lo Tormo", "lo Pilar d'Almenara"); si no, l'ús
 *   general, que per als cims és masculí pel genèric implícit ("el [pic de] Comabona", com el
 *   Costabona, el Comanegra o el Comapedrosa; "el Tristaina", "el Casamanya Nord"). Sense article
 *   els hagiotopònims i santuaris ("a Sant Jeroni", "a Cabrera", "a Bellmunt": el santuari i la
 *   serra de Cabrera/Bellmunt no porten article a l'ICGC ni en l'ús comarcal).
 * - `lo` es contrau com `el`: "al Tormo", "del Tésol" (vegeu `ambDe`).
 * - Slug = nom visible sense accents, amb l'article si el topònim el porta ("els-angels",
 *   "la-picossa"); homònims amb el qualificador de la FEEC o la comarca ("la-tossa-tivissa",
 *   "la-mola-tarragones": "la Mola" per antonomàsia és la de Sant Llorenç del Munt); subcims i
 *   noms populars, popular primer ("pedraforca-pollego-superior", "elefant-roca-de-sant-salvador").
 */
import type { Article } from '../../src/lib/domain/toponims.ts';

export interface EssencialDef {
	comarca: string;
	nom: string;
	visible?: string;
	article?: Article;
	revisarArticle?: string;
	cerca?: string[];
	slug?: string;
	alies?: string[];
}

type Opts = Omit<EssencialDef, 'comarca' | 'nom'>;
type Entrada = string | [string, Opts];

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
		// ICGC: "lo Coscollet"
		['El Coscollet', { visible: 'Lo Coscollet' }],
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
		['Gran Tuc de Colomers', { visible: 'Gran Tuc de Colomèrs', article: 'el' }],
		// ICGC: "el Corronco" (la FEEC escriu "Lo")
		['Lo Corronco', { visible: 'El Corronco', alies: ['Lo Corronco'] }],
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
		['Sant Jeroni', { article: '', alies: ['Sant Jeroni de Montserrat'] }]
	],
	bages: [
		['Collbaix', { article: 'el' }],
		['Montcau', { article: 'el' }],
		[
			"Roca de Sant Salvador (l'Elefant)",
			{
				visible: "L'Elefant",
				slug: 'elefant-roca-de-sant-salvador',
				cerca: ['Roca de Sant Salvador', 'Elefant'],
				alies: ['Roca de Sant Salvador', 'Elefant de Montserrat']
			}
		]
	],
	'baix-camp': [
		[
			'Cavall Bernat de Llaberia',
			{ article: 'el', cerca: ['Cavall Bernat de Llaberia', 'Cavall Bernat'] }
		],
		['Mola de Colldejou', { article: 'la' }],
		['Mola de Genesies', { visible: 'Mola de Genessies', article: 'la' }],
		['Molló Puntaire', { article: 'el' }],
		['Puig de la Cabrafiga', { article: 'el' }],
		['Tossal de la Baltasana', { article: 'el' }]
	],
	'baix-ebre': [
		['Caro', { article: 'el', cerca: ['Mont Caro', 'Caro'], alies: ['Mont Caro'] }],
		["Tossal d'Engrilló", { article: 'el' }],
		[
			'Xàquera o Creu de Santos',
			{
				visible: 'Creu de Santos',
				article: 'la',
				cerca: ['Creu de Santos', 'Xàquera'],
				alies: ['Xàquera']
			}
		]
	],
	'baix-emporda': [
		[
			'Castell de Montgrí',
			{ visible: 'Castell del Montgrí', article: 'el', cerca: ['Castell de Montgrí', 'Montgrí'] }
		]
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
		['Turó de Magarola', { visible: 'Turó de la Magarola', article: 'el' }]
	],
	bergueda: [
		['Cap de la Gallina Pelada', { article: 'el' }],
		["Cogulló d'Estela", { article: 'el' }],
		['Comabona', { article: 'el' }],
		'La Tosa',
		['Penyes Altes', { article: 'les', cerca: ['Penyes Altes', 'Penyes Altes de Moixeró'] }],
		[
			'Pollegó Superior (Pedraforca)',
			{
				visible: 'Pedraforca',
				article: 'el',
				slug: 'pedraforca-pollego-superior',
				cerca: ['Pollegó Superior'],
				alies: ['Pollegó Superior', 'Pollegó Superior del Pedraforca']
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
				visible: 'Tossa Plana de Lles',
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
		['Cabrera', { article: '' }],
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
		['Torreta del Montsià', { visible: 'Torreta de Montsià', article: 'la' }],
		['Tossal dels Tres Reis', { article: 'el', alies: ['Tossal del Rei'] }]
	],
	noguera: [
		['Pala Alta', { article: 'la' }],
		['Penya Sant Alís', { article: 'la', cerca: ['Penya Sant Alís', 'Sant Alís'] }],
		['Sant Mamet', { article: '' }],
		[
			'Tossal de Mira Pallars i Urgell',
			{
				visible: 'Tossal de Mirapallars',
				article: 'el',
				cerca: ['Tossal de Mirapallars i Urgell', 'Tossal de Mira Pallars i Urgell', 'Mirapallars']
			}
		]
	],
	osona: [
		['Bellmunt', { article: '' }],
		['Castell de Milany', { article: 'el', cerca: ['Castell de Milany', 'Milany'] }],
		['Creu de Gurb', { article: 'la' }],
		['Matagalls', { article: 'el' }],
		['Rocallarga', { article: 'la' }]
	],
	'pallars-jussa': [
		['Cap del Boumort', { visible: 'Cap de Boumort', article: 'el' }],
		['Montsent de Pallars', { article: 'el' }],
		['Pic de Peguera', { article: 'el' }],
		['Pica de Cerví', { article: 'la' }],
		['Pui de Lleràs', { article: 'el' }],
		['Sant Corneli', { article: '', cerca: ['Sant Corneli', 'Cap de Sant Corneli'] }],
		['Tuc de la Cometa', { article: 'el' }]
	],
	'pallars-sobira': [
		['Campirme', { article: 'el' }],
		['Lo Tèsol', { visible: 'Lo Tésol' }],
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
	'pla-de-l-estany': [['Sant Patllarí', { visible: 'Sant Patllari', article: '' }]],
	priorat: [['Roca Corbatera', { article: 'la' }]],
	'ribera-d-ebre': [
		'La Picossa',
		['La Tossa (Tivissa)', { slug: 'la-tossa-tivissa', cerca: ['la Tossa'] }],
		'Lo Tormo'
	],
	ripolles: [
		['Balandrau', { article: 'el' }],
		['Bastiments', { article: 'el', cerca: ['Bastiments', 'Pic de Bastiments'] }],
		[
			'Costa Pubilla o Pla de Pujalts',
			{
				visible: 'Costa Pubilla',
				article: 'la',
				cerca: ['Costa Pubilla', 'Pla de Pujalts'],
				alies: ['Pla de Pujalts']
			}
		],
		['Costabona', { article: 'el' }],
		['Puigmal', { article: 'el' }],
		['Taga', { article: 'el' }]
	],
	segarra: [['Tossal de la Creu', { article: 'el' }]],
	segria: [['Punta de Montmeneu', { visible: 'Punta de Montmaneu', article: 'la' }]],
	selva: [
		'Les Agudes',
		['Sant Miquel de Solterra', { article: '' }],
		['Turó de Montsoriu', { article: 'el', cerca: ['Turó de Montsoriu', 'Castell de Montsoriu'] }]
	],
	solsones: ['El Cogul', ['Puig de les Morreres', { article: 'el' }]],
	tarragones: [['La Mola', { slug: 'la-mola-tarragones' }]],
	'terra-alta': [
		['Roques de Benet', { article: 'les' }],
		['Santa Bàrbara', { article: '', cerca: ['Santa Bàrbara', 'Puig de Santa Bàrbara'] }]
	],
	// ICGC: "lo Pilar d'Almenara"
	urgell: [["Pilar d'Almenara", { article: 'lo', cerca: ["Pilar d'Almenara", 'Almenara'] }]],
	'val-d-aran': [
		['Maubèrme', { article: 'el', cerca: ['Tuc de Maubèrme', 'Maubèrme'] }],
		['Montardo', { article: 'el', cerca: ["Montardo d'Aran", 'Montardo'] }],
		['Montcorbison', { article: 'el', cerca: ['Montcorbison', 'Tuc de Montcorbison'] }],
		['Montlude', { article: 'el', cerca: ['Montlude', 'Tuc de Montlude'] }],
		['Tuc de Molieres', { visible: 'Tuc de Molières', article: 'el' }],
		['Tuc deth Port de Vielha', { visible: 'Tuc deth Pòrt de Vielha', article: 'el' }]
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
			{ article: 'el', cerca: ['Pic de Casamanya Nord', 'Casamanya Nord', 'Pic de Casamanya'] }
		],
		['Comapedrosa', { article: 'el', cerca: ['Pic de Comapedrosa', 'Comapedrosa'] }],
		['Pic de la Serrera', { article: 'el' }],
		["Pic Negre d'Envalira", { article: 'el' }],
		['Tristaina', { article: 'el', cerca: ['Pic de Tristaina', 'Tristaina'] }]
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

/** Nom visible: `visible` si n'hi ha; si no, el del PDF. */
export function nomVisible(def: EssencialDef): string {
	return def.visible ?? def.nom;
}

/** Article i nom sense article a partir del nom visible ("La Tosa" → la / "Tosa"). */
export function articleDelNom(def: EssencialDef): { article: Article; base: string } {
	const nom = nomVisible(def);
	const m = RE_ARTICLE.exec(nom);
	if (m) {
		if (def.article !== undefined) throw new Error(`"${nom}" ja porta article`);
		return { article: m[1].toLowerCase() as Article, base: m[2] };
	}
	if (nom.startsWith("L'")) {
		if (def.article !== undefined) throw new Error(`"${nom}" ja porta article`);
		return { article: "l'", base: nom.slice(2) };
	}
	if (def.article === undefined) throw new Error(`Cal indicar l'article de "${nom}"`);
	return { article: def.article, base: nom };
}

/** Les 150 entrades en l'ordre del PDF (l'ordre defineix l'id estable inicial). */
export const ESSENCIALS: EssencialDef[] = Object.entries(LLISTA).flatMap(([comarca, cims]) =>
	cims.map((e): EssencialDef =>
		typeof e === 'string' ? { comarca, nom: e } : { comarca, nom: e[0], ...e[1] }
	)
);
