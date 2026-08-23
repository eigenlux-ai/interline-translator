/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Display_LabelInputs */

const zh_display_label = /** @type {(inputs: Display_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`显示`)
};

const zh_tw2_display_label = /** @type {(inputs: Display_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`顯示`)
};

const en_display_label = /** @type {(inputs: Display_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Display`)
};

const ja_display_label = /** @type {(inputs: Display_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`表示`)
};

const ko_display_label = /** @type {(inputs: Display_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`표시`)
};

const fr_display_label = /** @type {(inputs: Display_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Affichage`)
};

const de_display_label = /** @type {(inputs: Display_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anzeige`)
};

const es_display_label = /** @type {(inputs: Display_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vista`)
};

const ru_display_label = /** @type {(inputs: Display_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Вид`)
};

const pt_display_label = /** @type {(inputs: Display_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exibição`)
};

const it_display_label = /** @type {(inputs: Display_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Visualizzazione`)
};

const ar_display_label = /** @type {(inputs: Display_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`العرض`)
};

/**
* | output |
* | --- |
* | "Display" |
*
* @param {Display_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const display_label = /** @type {((inputs?: Display_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Display_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_display_label(inputs)
	if (locale === "zh-TW") return zh_tw2_display_label(inputs)
	if (locale === "en") return en_display_label(inputs)
	if (locale === "ja") return ja_display_label(inputs)
	if (locale === "ko") return ko_display_label(inputs)
	if (locale === "fr") return fr_display_label(inputs)
	if (locale === "de") return de_display_label(inputs)
	if (locale === "es") return es_display_label(inputs)
	if (locale === "ru") return ru_display_label(inputs)
	if (locale === "pt") return pt_display_label(inputs)
	if (locale === "it") return it_display_label(inputs)
	return ar_display_label(inputs)
});