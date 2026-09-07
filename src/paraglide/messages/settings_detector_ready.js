/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Detector_ReadyInputs */

const zh_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已就绪。翻译前识别并跳过目标语言及无需翻译的语言。`)
};

const zh_tw2_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已就緒。翻譯前辨識並略過目標語言及不需翻譯的語言。`)
};

const en_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ready. Detects text in your target language and excluded languages so it can be skipped before translation.`)
};

const ja_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`準備完了。翻訳先の言語と対象外に設定した言語を検出し、翻訳前にスキップします。`)
};

const ko_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`준비되었습니다. 번역 대상 언어와 제외한 언어를 감지하여 번역 전에 건너뜁니다.`)
};

const fr_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prête. Repère les textes dans la langue cible et les langues exclues pour ne pas les traduire.`)
};

const de_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bereit. Erkennt Texte in der Zielsprache und in ausgeschlossenen Sprachen, damit sie nicht übersetzt werden.`)
};

const es_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lista. Detecta el texto en el idioma de destino y en los idiomas excluidos para omitirlo antes de traducir.`)
};

const ru_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Готово. Текст на языке перевода и исключённых языках распознаётся и пропускается до перевода.`)
};

const pt_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pronta. Identifica textos no idioma de destino e nos idiomas excluídos para ignorá-los antes da tradução.`)
};

const it_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pronto. Riconosce i testi nella lingua di destinazione e nelle lingue escluse, così da non tradurli.`)
};

const ar_settings_detector_ready = /** @type {(inputs: Settings_Detector_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جاهز. يتعرّف على النصوص بلغة الهدف واللغات المستثناة لتخطّيها قبل الترجمة.`)
};

/**
* | output |
* | --- |
* | "Ready. Detects text in your target language and excluded languages so it can be skipped before translation." |
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