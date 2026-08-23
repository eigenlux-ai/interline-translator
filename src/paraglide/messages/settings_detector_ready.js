/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Detector_ReadyInputs */

const zh_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已就绪,非目标语言在翻译前即被跳过`)
};

const zh_tw2_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已就緒,非目標語言會在翻譯前先略過`)
};

const en_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ready — non-target languages are skipped before translating`)
};

const ja_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`準備完了——翻訳先以外の言語は翻訳前にスキップします`)
};

const ko_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`준비됨 — 대상이 아닌 언어는 번역 전에 건너뜁니다`)
};

const fr_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prête — les langues autres que la cible sont ignorées avant la traduction`)
};

const de_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bereit — Sprachen außer der Zielsprache werden vor dem Übersetzen übersprungen`)
};

const es_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lista: los idiomas distintos del destino se omiten antes de traducir`)
};

const ru_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Готово — языки, кроме целевого, пропускаются до перевода`)
};

const pt_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pronta — os idiomas que não são o destino são ignorados antes de traduzir`)
};

const it_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pronto — le lingue diverse dalla destinazione vengono saltate prima di tradurre`)
};

const ar_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جاهز — تُتخطّى اللغات غير الهدف قبل الترجمة`)
};

/**
* | output |
* | --- |
* | "Ready — non-target languages are skipped before translating" |
*
* @param {Settings_Detector_ReadyInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_detector_ready = /** @type {((inputs?: Settings_Detector_ReadyInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Detector_ReadyInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_detector_ready(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_detector_ready(inputs)
	if (locale === "en") return en_settings_detector_ready(inputs)
	if (locale === "ja") return ja_settings_detector_ready(inputs)
	if (locale === "ko") return ko_settings_detector_ready(inputs)
	if (locale === "fr") return fr_settings_detector_ready(inputs)
	if (locale === "de") return de_settings_detector_ready(inputs)
	if (locale === "es") return es_settings_detector_ready(inputs)
	if (locale === "ru") return ru_settings_detector_ready(inputs)
	if (locale === "pt") return pt_settings_detector_ready(inputs)
	if (locale === "it") return it_settings_detector_ready(inputs)
	return ar_settings_detector_ready(inputs)
});