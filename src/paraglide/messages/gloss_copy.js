/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Gloss_CopyInputs */

const zh_gloss_copy = /** @type {(inputs: Gloss_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`复制译文`)
};

const zh_tw2_gloss_copy = /** @type {(inputs: Gloss_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`複製譯文`)
};

const en_gloss_copy = /** @type {(inputs: Gloss_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copy translation`)
};

const ja_gloss_copy = /** @type {(inputs: Gloss_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`訳文をコピー`)
};

const ko_gloss_copy = /** @type {(inputs: Gloss_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역문 복사`)
};

const fr_gloss_copy = /** @type {(inputs: Gloss_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copier la traduction`)
};

const de_gloss_copy = /** @type {(inputs: Gloss_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzung kopieren`)
};

const es_gloss_copy = /** @type {(inputs: Gloss_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copiar la traducción`)
};

const ru_gloss_copy = /** @type {(inputs: Gloss_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Копировать перевод`)
};

const pt_gloss_copy = /** @type {(inputs: Gloss_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copiar a tradução`)
};

const it_gloss_copy = /** @type {(inputs: Gloss_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copia la traduzione`)
};

const ar_gloss_copy = /** @type {(inputs: Gloss_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نسخ الترجمة`)
};

/**
* | output |
* | --- |
* | "Copy translation" |
*
* @param {Gloss_CopyInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const gloss_copy = /** @type {((inputs?: Gloss_CopyInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Gloss_CopyInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_gloss_copy(inputs)
	if (locale === "zh-TW") return zh_tw2_gloss_copy(inputs)
	if (locale === "en") return en_gloss_copy(inputs)
	if (locale === "ja") return ja_gloss_copy(inputs)
	if (locale === "ko") return ko_gloss_copy(inputs)
	if (locale === "fr") return fr_gloss_copy(inputs)
	if (locale === "de") return de_gloss_copy(inputs)
	if (locale === "es") return es_gloss_copy(inputs)
	if (locale === "ru") return ru_gloss_copy(inputs)
	if (locale === "pt") return pt_gloss_copy(inputs)
	if (locale === "it") return it_gloss_copy(inputs)
	return ar_gloss_copy(inputs)
});