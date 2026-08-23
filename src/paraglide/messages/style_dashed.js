/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_DashedInputs */

const zh_style_dashed = /** @type {(inputs: Style_DashedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`虚线`)
};

const zh_tw2_style_dashed = /** @type {(inputs: Style_DashedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`虛線`)
};

const en_style_dashed = /** @type {(inputs: Style_DashedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dashed`)
};

const ja_style_dashed = /** @type {(inputs: Style_DashedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`破線`)
};

const ko_style_dashed = /** @type {(inputs: Style_DashedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`파선`)
};

const fr_style_dashed = /** @type {(inputs: Style_DashedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tirets`)
};

const de_style_dashed = /** @type {(inputs: Style_DashedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gestrichelt`)
};

const es_style_dashed = /** @type {(inputs: Style_DashedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Discontinuo`)
};

const ru_style_dashed = /** @type {(inputs: Style_DashedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Штрихи`)
};

const pt_style_dashed = /** @type {(inputs: Style_DashedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tracejado`)
};

const it_style_dashed = /** @type {(inputs: Style_DashedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tratteggiato`)
};

const ar_style_dashed = /** @type {(inputs: Style_DashedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متقطّع`)
};

/**
* | output |
* | --- |
* | "Dashed" |
*
* @param {Style_DashedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_dashed = /** @type {((inputs?: Style_DashedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_DashedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_dashed(inputs)
	if (locale === "zh-TW") return zh_tw2_style_dashed(inputs)
	if (locale === "en") return en_style_dashed(inputs)
	if (locale === "ja") return ja_style_dashed(inputs)
	if (locale === "ko") return ko_style_dashed(inputs)
	if (locale === "fr") return fr_style_dashed(inputs)
	if (locale === "de") return de_style_dashed(inputs)
	if (locale === "es") return es_style_dashed(inputs)
	if (locale === "ru") return ru_style_dashed(inputs)
	if (locale === "pt") return pt_style_dashed(inputs)
	if (locale === "it") return it_style_dashed(inputs)
	return ar_style_dashed(inputs)
});