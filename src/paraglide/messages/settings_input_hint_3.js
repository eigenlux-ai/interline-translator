/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Input_Hint_3Inputs */

const zh_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` 开头，可单独指定本次翻译的目标语言。`)
};

const zh_tw2_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` 開頭，即可單獨指定這次翻譯的目標語言。`)
};

const en_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` to choose the target language for this translation only.`)
};

const ja_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` を付けると、今回の翻訳に限り翻訳先の言語を指定できます。`)
};

const ko_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` 접두어를 붙이면 이번 번역에만 적용할 대상 언어를 지정할 수 있습니다.`)
};

const fr_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` pour choisir la langue de cette traduction uniquement.`)
};

const de_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`, um die Zielsprache nur für diese Übersetzung festzulegen.`)
};

const es_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` para elegir el idioma de destino solo para esta traducción.`)
};

const ru_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`, чтобы выбрать язык только для этого перевода.`)
};

const pt_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` para escolher o idioma de destino apenas desta tradução.`)
};

const it_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` per scegliere la lingua di destinazione solo per questa traduzione.`)
};

const ar_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` لتحديد لغة الهدف لهذه الترجمة فقط.`)
};

/**
* | output |
* | --- |
* | "to choose the target language for this translation only." |
*
* @param {Settings_Input_Hint_3Inputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_input_hint_3 = /** @type {((inputs?: Settings_Input_Hint_3Inputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Input_Hint_3Inputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_input_hint_3(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_input_hint_3(inputs)
	if (locale === "en") return en_settings_input_hint_3(inputs)
	if (locale === "ja") return ja_settings_input_hint_3(inputs)
	if (locale === "ko") return ko_settings_input_hint_3(inputs)
	if (locale === "fr") return fr_settings_input_hint_3(inputs)
	if (locale === "de") return de_settings_input_hint_3(inputs)
	if (locale === "es") return es_settings_input_hint_3(inputs)
	if (locale === "ru") return ru_settings_input_hint_3(inputs)
	if (locale === "pt") return pt_settings_input_hint_3(inputs)
	if (locale === "it") return it_settings_input_hint_3(inputs)
	return ar_settings_input_hint_3(inputs)
});