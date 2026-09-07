/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_InterruptedInputs */

const zh_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻译已中断，请重试。`)
};

const zh_tw2_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻譯已中斷，請再試一次。`)
};

const en_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translation was interrupted. Please try again.`)
};

const ja_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳が中断されました。もう一度お試しください。`)
};

const ko_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역이 중단되었습니다. 다시 시도해 주세요.`)
};

const fr_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La traduction a été interrompue. Veuillez réessayer.`)
};

const de_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Die Übersetzung wurde unterbrochen. Bitte versuchen Sie es erneut.`)
};

const es_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La traducción se ha interrumpido. Vuelve a intentarlo.`)
};

const ru_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевод прерван. Повторите попытку.`)
};

const pt_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A tradução foi interrompida. Tente novamente.`)
};

const it_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La traduzione è stata interrotta. Riprova.`)
};

const ar_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`توقفت الترجمة. يرجى إعادة المحاولة.`)
};

/**
* | output |
* | --- |
* | "Translation was interrupted. Please try again." |
*
* @param {Error_InterruptedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const error_interrupted = /** @type {((inputs?: Error_InterruptedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_InterruptedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_error_interrupted(inputs)
	if (locale === "zh-TW") return zh_tw2_error_interrupted(inputs)
	if (locale === "en") return en_error_interrupted(inputs)
	if (locale === "ja") return ja_error_interrupted(inputs)
	if (locale === "ko") return ko_error_interrupted(inputs)
	if (locale === "fr") return fr_error_interrupted(inputs)
	if (locale === "de") return de_error_interrupted(inputs)
	if (locale === "es") return es_error_interrupted(inputs)
	if (locale === "ru") return ru_error_interrupted(inputs)
	if (locale === "pt") return pt_error_interrupted(inputs)
	if (locale === "it") return it_error_interrupted(inputs)
	return ar_error_interrupted(inputs)
});