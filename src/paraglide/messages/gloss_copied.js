/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Gloss_CopiedInputs */

const zh_gloss_copied = /** @type {(inputs: Gloss_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已复制`)
};

const zh_tw2_gloss_copied = /** @type {(inputs: Gloss_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已複製`)
};

const en_gloss_copied = /** @type {(inputs: Gloss_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copied`)
};

const ja_gloss_copied = /** @type {(inputs: Gloss_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`コピーしました`)
};

const ko_gloss_copied = /** @type {(inputs: Gloss_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`복사됨`)
};

const fr_gloss_copied = /** @type {(inputs: Gloss_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copié`)
};

const de_gloss_copied = /** @type {(inputs: Gloss_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kopiert`)
};

const es_gloss_copied = /** @type {(inputs: Gloss_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copiado`)
};

const ru_gloss_copied = /** @type {(inputs: Gloss_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Скопировано`)
};

const pt_gloss_copied = /** @type {(inputs: Gloss_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copiado`)
};

const it_gloss_copied = /** @type {(inputs: Gloss_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copiato`)
};

const ar_gloss_copied = /** @type {(inputs: Gloss_CopiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم النسخ`)
};

/**
* | output |
* | --- |
* | "Copied" |
*
* @param {Gloss_CopiedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const gloss_copied = /** @type {((inputs?: Gloss_CopiedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Gloss_CopiedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_gloss_copied(inputs)
	if (locale === "zh-TW") return zh_tw2_gloss_copied(inputs)
	if (locale === "en") return en_gloss_copied(inputs)
	if (locale === "ja") return ja_gloss_copied(inputs)
	if (locale === "ko") return ko_gloss_copied(inputs)
	if (locale === "fr") return fr_gloss_copied(inputs)
	if (locale === "de") return de_gloss_copied(inputs)
	if (locale === "es") return es_gloss_copied(inputs)
	if (locale === "ru") return ru_gloss_copied(inputs)
	if (locale === "pt") return pt_gloss_copied(inputs)
	if (locale === "it") return it_gloss_copied(inputs)
	return ar_gloss_copied(inputs)
});