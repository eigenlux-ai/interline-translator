/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Display_TranslationInputs */

const zh_display_translation = /** @type {(inputs: Display_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`仅译文`)
};

const zh_tw2_display_translation = /** @type {(inputs: Display_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`僅譯文`)
};

const en_display_translation = /** @type {(inputs: Display_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translation only`)
};

const ja_display_translation = /** @type {(inputs: Display_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`訳文のみ`)
};

const ko_display_translation = /** @type {(inputs: Display_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역만`)
};

const fr_display_translation = /** @type {(inputs: Display_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduction seule`)
};

const de_display_translation = /** @type {(inputs: Display_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nur Übersetzung`)
};

const es_display_translation = /** @type {(inputs: Display_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solo traducción`)
};

const ru_display_translation = /** @type {(inputs: Display_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Только перевод`)
};

const pt_display_translation = /** @type {(inputs: Display_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apenas tradução`)
};

const it_display_translation = /** @type {(inputs: Display_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solo traduzione`)
};

const ar_display_translation = /** @type {(inputs: Display_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الترجمة فقط`)
};

/**
* | output |
* | --- |
* | "Translation only" |
*
* @param {Display_TranslationInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const display_translation = /** @type {((inputs?: Display_TranslationInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Display_TranslationInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_display_translation(inputs)
	if (locale === "zh-TW") return zh_tw2_display_translation(inputs)
	if (locale === "en") return en_display_translation(inputs)
	if (locale === "ja") return ja_display_translation(inputs)
	if (locale === "ko") return ko_display_translation(inputs)
	if (locale === "fr") return fr_display_translation(inputs)
	if (locale === "de") return de_display_translation(inputs)
	if (locale === "es") return es_display_translation(inputs)
	if (locale === "ru") return ru_display_translation(inputs)
	if (locale === "pt") return pt_display_translation(inputs)
	if (locale === "it") return it_display_translation(inputs)
	return ar_display_translation(inputs)
});