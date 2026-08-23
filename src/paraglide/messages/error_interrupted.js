/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_InterruptedInputs */

const zh_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻译已中断，重试通常即可解决。`)
};

const zh_tw2_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻譯已中斷，重試通常即可解決。`)
};

const en_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translation interrupted. A retry usually fixes this.`)
};

const ja_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳が中断されました。通常は再試行することで解決します。`)
};

const ko_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역이 중단되었습니다. 다시 시도하면 보통 해결됩니다.`)
};

const fr_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La traduction a été interrompue. Réessayer résout généralement le problème.`)
};

const de_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzung unterbrochen. Ein erneuter Versuch löst das Problem in der Regel.`)
};

const es_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traducción interrumpida. Normalmente se soluciona al reintentar.`)
};

const ru_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевод прерван. Обычно помогает повторная попытка.`)
};

const pt_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A tradução foi interrompida. Tentar novamente costuma resolver.`)
};

const it_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzione interrotta. Di solito riprovando si risolve.`)
};

const ar_error_interrupted = /** @type {(inputs: Error_InterruptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تمت مقاطعة الترجمة. إعادة المحاولة عادة ما تصلح المشكلة.`)
};

/**
* | output |
* | --- |
* | "Translation interrupted. A retry usually fixes this." |
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