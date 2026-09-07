/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_CloseInputs */

const zh_common_close = /** @type {(inputs: Common_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`关闭`)
};

const zh_tw2_common_close = /** @type {(inputs: Common_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`關閉`)
};

const en_common_close = /** @type {(inputs: Common_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Close`)
};

const ja_common_close = /** @type {(inputs: Common_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`閉じる`)
};

const ko_common_close = /** @type {(inputs: Common_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`닫기`)
};

const fr_common_close = /** @type {(inputs: Common_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fermer`)
};

const de_common_close = /** @type {(inputs: Common_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Schließen`)
};

const es_common_close = /** @type {(inputs: Common_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cerrar`)
};

const ru_common_close = /** @type {(inputs: Common_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Закрыть`)
};

const pt_common_close = /** @type {(inputs: Common_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fechar`)
};

const it_common_close = /** @type {(inputs: Common_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chiudi`)
};

const ar_common_close = /** @type {(inputs: Common_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إغلاق`)
};

/**
* | output |
* | --- |
* | "Close" |
*
* @param {Common_CloseInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const common_close = /** @type {((inputs?: Common_CloseInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_CloseInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_common_close(inputs)
	if (locale === "zh-TW") return zh_tw2_common_close(inputs)
	if (locale === "en") return en_common_close(inputs)
	if (locale === "ja") return ja_common_close(inputs)
	if (locale === "ko") return ko_common_close(inputs)
	if (locale === "fr") return fr_common_close(inputs)
	if (locale === "de") return de_common_close(inputs)
	if (locale === "es") return es_common_close(inputs)
	if (locale === "ru") return ru_common_close(inputs)
	if (locale === "pt") return pt_common_close(inputs)
	if (locale === "it") return it_common_close(inputs)
	return ar_common_close(inputs)
});