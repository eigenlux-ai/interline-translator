/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Detector_UnavailableInputs */

const zh_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`当前浏览器不支持(回退为文字系统判断加译后校验)`)
};

const zh_tw2_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`目前的瀏覽器不支援(改用文字系統判斷加譯後校驗)`)
};

const en_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not supported by this browser (falls back to script heuristics plus a post-translation check)`)
};

const ja_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`このブラウザーでは非対応(文字体系による判定と翻訳後チェックに切り替えます)`)
};

const ko_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이 브라우저에서는 지원되지 않습니다(문자 체계 판별과 번역 후 확인으로 대체)`)
};

const fr_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non pris en charge par ce navigateur (repli sur l'analyse de l'écriture et une vérification après traduction)`)
};

const de_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Von diesem Browser nicht unterstützt (Rückfall auf Schrifterkennung und eine Prüfung nach der Übersetzung)`)
};

const es_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No compatible con este navegador (se recurre al análisis de la escritura y a una comprobación posterior)`)
};

const ru_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Не поддерживается этим браузером (используются определение по письменности и проверка после перевода)`)
};

const pt_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Não suportado por este navegador (recorre à análise da escrita e a uma verificação após a tradução)`)
};

const it_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non supportato da questo browser (ricorre all'analisi della scrittura e a un controllo dopo la traduzione)`)
};

const ar_settings_detector_unavailable = /** @type {(inputs: Settings_Detector_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`غير مدعوم في هذا المتصفّح (يُستعاض عنه بتحليل نظام الكتابة وفحص بعد الترجمة)`)
};

/**
* | output |
* | --- |
* | "Not supported by this browser (falls back to script heuristics plus a post-translation check)" |
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