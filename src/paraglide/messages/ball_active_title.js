/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ball_Active_TitleInputs */

const zh_ball_active_title = /** @type {(inputs: Ball_Active_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`正在翻译此页`)
};

const zh_tw2_ball_active_title = /** @type {(inputs: Ball_Active_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`正在翻譯這一頁`)
};

const en_ball_active_title = /** @type {(inputs: Ball_Active_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translating this page`)
};

const ja_ball_active_title = /** @type {(inputs: Ball_Active_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`このページを翻訳しています`)
};

const ko_ball_active_title = /** @type {(inputs: Ball_Active_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이 페이지를 번역하는 중`)
};

const fr_ball_active_title = /** @type {(inputs: Ball_Active_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduction de cette page en cours`)
};

const de_ball_active_title = /** @type {(inputs: Ball_Active_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Diese Seite wird übersetzt`)
};

const es_ball_active_title = /** @type {(inputs: Ball_Active_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduciendo esta página`)
};

const ru_ball_active_title = /** @type {(inputs: Ball_Active_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Идёт перевод страницы`)
};

const pt_ball_active_title = /** @type {(inputs: Ball_Active_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzindo esta página`)
};

const it_ball_active_title = /** @type {(inputs: Ball_Active_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzione della pagina in corso`)
};

const ar_ball_active_title = /** @type {(inputs: Ball_Active_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ ترجمة هذه الصفحة`)
};

/**
* | output |
* | --- |
* | "Translating this page" |
*
* @param {Ball_Active_TitleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const ball_active_title = /** @type {((inputs?: Ball_Active_TitleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ball_Active_TitleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_ball_active_title(inputs)
	if (locale === "zh-TW") return zh_tw2_ball_active_title(inputs)
	if (locale === "en") return en_ball_active_title(inputs)
	if (locale === "ja") return ja_ball_active_title(inputs)
	if (locale === "ko") return ko_ball_active_title(inputs)
	if (locale === "fr") return fr_ball_active_title(inputs)
	if (locale === "de") return de_ball_active_title(inputs)
	if (locale === "es") return es_ball_active_title(inputs)
	if (locale === "ru") return ru_ball_active_title(inputs)
	if (locale === "pt") return pt_ball_active_title(inputs)
	if (locale === "it") return it_ball_active_title(inputs)
	return ar_ball_active_title(inputs)
});