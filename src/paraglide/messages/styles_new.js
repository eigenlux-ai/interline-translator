/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_NewInputs */

const zh_styles_new = /** @type {(inputs: Styles_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`新建风格`)
};

const zh_tw2_styles_new = /** @type {(inputs: Styles_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`新建風格`)
};

const en_styles_new = /** @type {(inputs: Styles_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New style`)
};

const ja_styles_new = /** @type {(inputs: Styles_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`新規スタイル`)
};

const ko_styles_new = /** @type {(inputs: Styles_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`새 스타일`)
};

const fr_styles_new = /** @type {(inputs: Styles_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouveau style`)
};

const de_styles_new = /** @type {(inputs: Styles_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Neuer Stil`)
};

const es_styles_new = /** @type {(inputs: Styles_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nuevo estilo`)
};

const ru_styles_new = /** @type {(inputs: Styles_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Новый стиль`)
};

const pt_styles_new = /** @type {(inputs: Styles_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Novo estilo`)
};

const it_styles_new = /** @type {(inputs: Styles_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nuovo stile`)
};

const ar_styles_new = /** @type {(inputs: Styles_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نمط جديد`)
};

/**
* | output |
* | --- |
* | "New style" |
*
* @param {Styles_NewInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_new = /** @type {((inputs?: Styles_NewInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_NewInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_new(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_new(inputs)
	if (locale === "en") return en_styles_new(inputs)
	if (locale === "ja") return ja_styles_new(inputs)
	if (locale === "ko") return ko_styles_new(inputs)
	if (locale === "fr") return fr_styles_new(inputs)
	if (locale === "de") return de_styles_new(inputs)
	if (locale === "es") return es_styles_new(inputs)
	if (locale === "ru") return ru_styles_new(inputs)
	if (locale === "pt") return pt_styles_new(inputs)
	if (locale === "it") return it_styles_new(inputs)
	return ar_styles_new(inputs)
});