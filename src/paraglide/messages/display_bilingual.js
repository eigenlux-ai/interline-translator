/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Display_BilingualInputs */

const zh_display_bilingual = /** @type {(inputs: Display_BilingualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`双语对照`)
};

const zh_tw2_display_bilingual = /** @type {(inputs: Display_BilingualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`雙語對照`)
};

const en_display_bilingual = /** @type {(inputs: Display_BilingualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bilingual`)
};

const ja_display_bilingual = /** @type {(inputs: Display_BilingualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`対訳`)
};

const ko_display_bilingual = /** @type {(inputs: Display_BilingualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`대역`)
};

const fr_display_bilingual = /** @type {(inputs: Display_BilingualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bilingue`)
};

const de_display_bilingual = /** @type {(inputs: Display_BilingualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Zweisprachig`)
};

const es_display_bilingual = /** @type {(inputs: Display_BilingualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bilingüe`)
};

const ru_display_bilingual = /** @type {(inputs: Display_BilingualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Двуязычно`)
};

const pt_display_bilingual = /** @type {(inputs: Display_BilingualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bilíngue`)
};

const it_display_bilingual = /** @type {(inputs: Display_BilingualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bilingue`)
};

const ar_display_bilingual = /** @type {(inputs: Display_BilingualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ثنائي اللغة`)
};

/**
* | output |
* | --- |
* | "Bilingual" |
*
* @param {Display_BilingualInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const display_bilingual = /** @type {((inputs?: Display_BilingualInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Display_BilingualInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_display_bilingual(inputs)
	if (locale === "zh-TW") return zh_tw2_display_bilingual(inputs)
	if (locale === "en") return en_display_bilingual(inputs)
	if (locale === "ja") return ja_display_bilingual(inputs)
	if (locale === "ko") return ko_display_bilingual(inputs)
	if (locale === "fr") return fr_display_bilingual(inputs)
	if (locale === "de") return de_display_bilingual(inputs)
	if (locale === "es") return es_display_bilingual(inputs)
	if (locale === "ru") return ru_display_bilingual(inputs)
	if (locale === "pt") return pt_display_bilingual(inputs)
	if (locale === "it") return it_display_bilingual(inputs)
	return ar_display_bilingual(inputs)
});