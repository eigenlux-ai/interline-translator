/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ball_Always_SiteInputs */

const zh_ball_always_site = /** @type {(inputs: Ball_Always_SiteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`总是翻译此站`)
};

const zh_tw2_ball_always_site = /** @type {(inputs: Ball_Always_SiteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`總是翻譯這個網站`)
};

const en_ball_always_site = /** @type {(inputs: Ball_Always_SiteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Always translate this site`)
};

const ja_ball_always_site = /** @type {(inputs: Ball_Always_SiteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`このサイトを常に翻訳`)
};

const ko_ball_always_site = /** @type {(inputs: Ball_Always_SiteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이 사이트 항상 번역`)
};

const fr_ball_always_site = /** @type {(inputs: Ball_Always_SiteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Toujours traduire ce site`)
};

const de_ball_always_site = /** @type {(inputs: Ball_Always_SiteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Diese Website immer übersetzen`)
};

const es_ball_always_site = /** @type {(inputs: Ball_Always_SiteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traducir siempre este sitio`)
};

const ru_ball_always_site = /** @type {(inputs: Ball_Always_SiteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Всегда переводить этот сайт`)
};

const pt_ball_always_site = /** @type {(inputs: Ball_Always_SiteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzir sempre este site`)
};

const it_ball_always_site = /** @type {(inputs: Ball_Always_SiteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduci sempre questo sito`)
};

const ar_ball_always_site = /** @type {(inputs: Ball_Always_SiteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترجمة هذا الموقع دائمًا`)
};

/**
* | output |
* | --- |
* | "Always translate this site" |
*
* @param {Ball_Always_SiteInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const ball_always_site = /** @type {((inputs?: Ball_Always_SiteInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ball_Always_SiteInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_ball_always_site(inputs)
	if (locale === "zh-TW") return zh_tw2_ball_always_site(inputs)
	if (locale === "en") return en_ball_always_site(inputs)
	if (locale === "ja") return ja_ball_always_site(inputs)
	if (locale === "ko") return ko_ball_always_site(inputs)
	if (locale === "fr") return fr_ball_always_site(inputs)
	if (locale === "de") return de_ball_always_site(inputs)
	if (locale === "es") return es_ball_always_site(inputs)
	if (locale === "ru") return ru_ball_always_site(inputs)
	if (locale === "pt") return pt_ball_always_site(inputs)
	if (locale === "it") return it_ball_always_site(inputs)
	return ar_ball_always_site(inputs)
});