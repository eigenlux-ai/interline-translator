/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Sel_CopyInputs */

const zh_sel_copy = /** @type {(inputs: Sel_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`复制`)
};

const zh_tw2_sel_copy = /** @type {(inputs: Sel_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`複製`)
};

const en_sel_copy = /** @type {(inputs: Sel_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copy`)
};

const ja_sel_copy = /** @type {(inputs: Sel_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`コピー`)
};

const ko_sel_copy = /** @type {(inputs: Sel_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`복사`)
};

const fr_sel_copy = /** @type {(inputs: Sel_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copier`)
};

const de_sel_copy = /** @type {(inputs: Sel_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kopieren`)
};

const es_sel_copy = /** @type {(inputs: Sel_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copiar`)
};

const ru_sel_copy = /** @type {(inputs: Sel_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Копировать`)
};

const pt_sel_copy = /** @type {(inputs: Sel_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copiar`)
};

const it_sel_copy = /** @type {(inputs: Sel_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copia`)
};

const ar_sel_copy = /** @type {(inputs: Sel_CopyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نسخ`)
};

/**
* | output |
* | --- |
* | "Copy" |
*
* @param {Sel_CopyInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const sel_copy = /** @type {((inputs?: Sel_CopyInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sel_CopyInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_sel_copy(inputs)
	if (locale === "zh-TW") return zh_tw2_sel_copy(inputs)
	if (locale === "en") return en_sel_copy(inputs)
	if (locale === "ja") return ja_sel_copy(inputs)
	if (locale === "ko") return ko_sel_copy(inputs)
	if (locale === "fr") return fr_sel_copy(inputs)
	if (locale === "de") return de_sel_copy(inputs)
	if (locale === "es") return es_sel_copy(inputs)
	if (locale === "ru") return ru_sel_copy(inputs)
	if (locale === "pt") return pt_sel_copy(inputs)
	if (locale === "it") return it_sel_copy(inputs)
	return ar_sel_copy(inputs)
});