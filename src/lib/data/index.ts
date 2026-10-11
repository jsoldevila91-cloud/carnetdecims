/**
 * Capa de dades de l'usuari (local-first). El catàleg estàtic és a `$lib/data/catalog`
 * (no es reexporta aquí per no arrossegar Dexie a les pàgines públiques prerenderitzades).
 * El conjunt de municipis (`$lib/data/municipis`) tampoc: es carrega en diferit.
 */
export * from './ascensions';
export * from './origen';
export * from './estadistiques';
