/**
 * Utilitats geogràfiques sense dependències: WGS84/ETRS89 ↔ UTM (fus 31N, EPSG:25831)
 * amb les sèries de Krüger (precisió mil·limètrica) i distància de Haversine.
 * ETRS89 i WGS84 es consideren equivalents (diferència < 1 m, irrellevant aquí).
 */

const A = 6378137;
const F = 1 / 298.257222101; // GRS80
const K0 = 0.9996;
const E0 = 500000;
const LON0 = (3 * Math.PI) / 180; // meridià central del fus 31

const N = F / (2 - F);
const A_ = (A / (1 + N)) * (1 + N ** 2 / 4 + N ** 4 / 64);
const ALPHA = [
	N / 2 - (2 / 3) * N ** 2 + (5 / 16) * N ** 3,
	(13 / 48) * N ** 2 - (3 / 5) * N ** 3,
	(61 / 240) * N ** 3
];
const BETA = [
	N / 2 - (2 / 3) * N ** 2 + (37 / 96) * N ** 3,
	(1 / 48) * N ** 2 + (1 / 15) * N ** 3,
	(17 / 480) * N ** 3
];
const DELTA = [
	2 * N - (2 / 3) * N ** 2 - 2 * N ** 3,
	(7 / 3) * N ** 2 - (8 / 5) * N ** 3,
	(56 / 15) * N ** 3
];

/** WGS84 (graus) → UTM 31N (metres). */
export function aUtm31(lat: number, lon: number): { x: number; y: number } {
	const phi = (lat * Math.PI) / 180;
	const dl = (lon * Math.PI) / 180 - LON0;
	const k = (2 * Math.sqrt(N)) / (1 + N);
	const t = Math.sinh(Math.atanh(Math.sin(phi)) - k * Math.atanh(k * Math.sin(phi)));
	const xi = Math.atan2(t, Math.cos(dl));
	const eta = Math.atanh(Math.sin(dl) / Math.sqrt(1 + t * t));
	let x = eta;
	let y = xi;
	for (let j = 1; j <= 3; j++) {
		x += ALPHA[j - 1] * Math.cos(2 * j * xi) * Math.sinh(2 * j * eta);
		y += ALPHA[j - 1] * Math.sin(2 * j * xi) * Math.cosh(2 * j * eta);
	}
	return { x: E0 + K0 * A_ * x, y: K0 * A_ * y };
}

/** UTM 31N (metres) → WGS84 (graus). */
export function deUtm31(x: number, y: number): { lat: number; lon: number } {
	const xi = y / (K0 * A_);
	const eta = (x - E0) / (K0 * A_);
	let xp = xi;
	let ep = eta;
	for (let j = 1; j <= 3; j++) {
		xp -= BETA[j - 1] * Math.sin(2 * j * xi) * Math.cosh(2 * j * eta);
		ep -= BETA[j - 1] * Math.cos(2 * j * xi) * Math.sinh(2 * j * eta);
	}
	const chi = Math.asin(Math.sin(xp) / Math.cosh(ep));
	let phi = chi;
	for (let j = 1; j <= 3; j++) phi += DELTA[j - 1] * Math.sin(2 * j * chi);
	const lon = LON0 + Math.atan2(Math.sinh(ep), Math.cos(xp));
	return { lat: (phi * 180) / Math.PI, lon: (lon * 180) / Math.PI };
}

/** Distància en metres (Haversine, radi mitjà 6.371 km). */
export function distanciaM(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
	const R = 6371008.8;
	const r = Math.PI / 180;
	const dLat = (b.lat - a.lat) * r;
	const dLon = (b.lon - a.lon) * r;
	const h =
		Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
	return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export const arrodonir = (v: number, dec: number) => Math.round(v * 10 ** dec) / 10 ** dec;
