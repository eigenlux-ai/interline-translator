/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Popup_Style_LabelInputs */

const zh_popup_style_label = /** @type {(inputs: Popup_Style_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻译风格`)
};

const zh_tw2_popup_style_label = /** @type {(inputs: Popup_Style_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻譯風格`)
};

const en_popup_style_label = /** @type {(inputs: Popup_Style_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Style`)
};

const ja_popup_style_label = /** @type {(inputs: Popup_Style_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`スタイル`)
};

const ko_popup_style_label = /** @type {(inputs: Popup_Style_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`스타일`)
};

const fr_popup_style_label = /** @type {(inputs: Popup_Style_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Style`)
};

const de_popup_style_label = /** @type {(inputs: Popup_Style_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stil`)
};

const es_popup_style_label = /** @type {(inputs: Popup_Style_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estilo`)
};

const ru_popup_style_label = /** @type {(inputs: Popup_Style_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Стиль`)
};

const pt_popup_style_label = /** @type {(inputs: Popup_Style_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estilo`)
};

const it_popup_style_label = /** @type {(inputs: Popup_Style_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stile`)
};

const ar_popup_style_label = /** @type {(inputs: Popup_Style_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النمط`)
};

/**
* | output |
* | --- |
* | "Style" |
*
* @param {Popup_Style_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const popup_style_label = /** @type {((inputs?: Popup_Style_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Popup_Style_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_popup_style_label(inputs)
	if (locale === "zh-TW") return zh_tw2_popup_style_label(inputs)
	if (locale === "en") return en_popup_style_label(inputs)
	if (locale === "ja") return ja_popup_style_label(inputs)
	if (locale === "ko") return ko_popup_style_label(inputs)
	if (locale === "fr") return fr_popup_style_label(inputs)
	if (locale === "de") return de_popup_style_label(inputs)
	if (locale === "es") return es_popup_style_label(inputs)
	if (locale === "ru") return ru_popup_style_label(inputs)
	if (locale === "pt") return pt_popup_style_label(inputs)
	if (locale === "it") return it_popup_style_label(inputs)
	return ar_popup_style_label(inputs)
});