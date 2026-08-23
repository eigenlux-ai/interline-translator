/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_CardInputs */

const zh_style_card = /** @type {(inputs: Style_CardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`卡片`)
};

const zh_tw2_style_card = /** @type {(inputs: Style_CardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`卡片`)
};

const en_style_card = /** @type {(inputs: Style_CardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Card`)
};

const ja_style_card = /** @type {(inputs: Style_CardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`カード`)
};

const ko_style_card = /** @type {(inputs: Style_CardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`카드`)
};

const fr_style_card = /** @type {(inputs: Style_CardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Carte`)
};

const de_style_card = /** @type {(inputs: Style_CardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Karte`)
};

const es_style_card = /** @type {(inputs: Style_CardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tarjeta`)
};

const ru_style_card = /** @type {(inputs: Style_CardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Карточка`)
};

const pt_style_card = /** @type {(inputs: Style_CardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cartão`)
};

const it_style_card = /** @type {(inputs: Style_CardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scheda`)
};

const ar_style_card = /** @type {(inputs: Style_CardInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`بطاقة`)
};

/**
* | output |
* | --- |
* | "Card" |
*
* @param {Style_CardInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_card = /** @type {((inputs?: Style_CardInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_CardInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_card(inputs)
	if (locale === "zh-TW") return zh_tw2_style_card(inputs)
	if (locale === "en") return en_style_card(inputs)
	if (locale === "ja") return ja_style_card(inputs)
	if (locale === "ko") return ko_style_card(inputs)
	if (locale === "fr") return fr_style_card(inputs)
	if (locale === "de") return de_style_card(inputs)
	if (locale === "es") return es_style_card(inputs)
	if (locale === "ru") return ru_style_card(inputs)
	if (locale === "pt") return pt_style_card(inputs)
	if (locale === "it") return it_style_card(inputs)
	return ar_style_card(inputs)
});