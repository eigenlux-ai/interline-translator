/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Detector_UnavailableInputs */

const zh_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`当前浏览器不支持。将根据文字特征判断，并在翻译后检查译文是否与原文相同。`)
};

const zh_tw2_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`目前瀏覽器不支援。將依文字特徵判斷，並在翻譯後檢查譯文是否與原文相同。`)
};

const en_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unavailable in this browser. Uses writing-system detection and checks for unchanged translations instead.`)
};

const ja_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`このブラウザーでは利用できません。文字の種類による判定と、翻訳後に原文と同じかどうかの確認を行います。`)
};

const ko_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이 브라우저에서는 지원하지 않습니다. 대신 문자 체계로 언어를 판단하고 번역 후 원문과 같은지 확인합니다.`)
};

const fr_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indisponible dans ce navigateur. Le système d’écriture sert à identifier la langue, puis les traductions identiques à l’original sont vérifiées.`)
};

const de_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`In diesem Browser nicht verfügbar. Stattdessen wird das Schriftsystem geprüft und nach der Übersetzung auf unveränderten Text geprüft.`)
};

const es_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No disponible en este navegador. Se analiza el sistema de escritura y se comprueba si la traducción coincide con el original.`)
};

const ru_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Недоступно в этом браузере. Вместо этого проверяется система письма, а после перевода — совпадение с оригиналом.`)
};

const pt_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indisponível neste navegador. O sistema de escrita é analisado e a tradução é verificada para identificar textos iguais ao original.`)
};

const it_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non disponibile in questo browser. Viene analizzato il sistema di scrittura e viene verificato se la traduzione è identica all’originale.`)
};

const ar_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غير متاح في هذا المتصفّح. يُحلَّل نظام الكتابة بدلًا من ذلك، وتُفحص الترجمة للتأكد من عدم تطابقها مع الأصل.`)
};

/**
* | output |
* | --- |
* | "Unavailable in this browser. Uses writing-system detection and checks for unchanged translations instead." |
*
* @param {Settings_Detector_UnavailableInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_detector_unavailable = /** @type {((inputs?: Settings_Detector_UnavailableInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Detector_UnavailableInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_detector_unavailable(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_detector_unavailable(inputs)
	if (locale === "en") return en_settings_detector_unavailable(inputs)
	if (locale === "ja") return ja_settings_detector_unavailable(inputs)
	if (locale === "ko") return ko_settings_detector_unavailable(inputs)
	if (locale === "fr") return fr_settings_detector_unavailable(inputs)
	if (locale === "de") return de_settings_detector_unavailable(inputs)
	if (locale === "es") return es_settings_detector_unavailable(inputs)
	if (locale === "ru") return ru_settings_detector_unavailable(inputs)
	if (locale === "pt") return pt_settings_detector_unavailable(inputs)
	if (locale === "it") return it_settings_detector_unavailable(inputs)
	return ar_settings_detector_unavailable(inputs)
});