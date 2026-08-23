/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_DimInputs */

const zh_style_dim = /** @type {(inputs: Style_DimInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`弱化`)
};

const zh_tw2_style_dim = /** @type {(inputs: Style_DimInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`淡化`)
};

const en_style_dim = /** @type {(inputs: Style_DimInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dim`)
};

const ja_style_dim = /** @type {(inputs: Style_DimInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`淡く`)
};

const ko_style_dim = /** @type {(inputs: Style_DimInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`흐리게`)
};

const fr_style_dim = /** @type {(inputs: Style_DimInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Atténué`)
};

const de_style_dim = /** @type {(inputs: Style_DimInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gedämpft`)
};

const es_style_dim = /** @type {(inputs: Style_DimInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Atenuado`)
};

const ru_style_dim = /** @type {(inputs: Style_DimInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Приглушённо`)
};

const pt_style_dim = /** @type {(inputs: Style_DimInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Esbatido`)
};

const it_style_dim = /** @type {(inputs: Style_DimInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Attenuato`)
};

const ar_style_dim = /** @type {(inputs: Style_DimInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خافت`)
};

/**
* | output |
* | --- |
* | "Dim" |
*
* @param {Style_DimInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_dim = /** @type {((inputs?: Style_DimInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_DimInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_dim(inputs)
	if (locale === "zh-TW") return zh_tw2_style_dim(inputs)
	if (locale === "en") return en_style_dim(inputs)
	if (locale === "ja") return ja_style_dim(inputs)
	if (locale === "ko") return ko_style_dim(inputs)
	if (locale === "fr") return fr_style_dim(inputs)
	if (locale === "de") return de_style_dim(inputs)
	if (locale === "es") return es_style_dim(inputs)
	if (locale === "ru") return ru_style_dim(inputs)
	if (locale === "pt") return pt_style_dim(inputs)
	if (locale === "it") return it_style_dim(inputs)
	return ar_style_dim(inputs)
});