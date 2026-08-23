/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Input_Hint_3Inputs */

const zh_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` 开头可为这一次改写指定语言。`)
};

const zh_tw2_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` 開頭,可為這一次改寫指定語言。`)
};

const en_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` to pick the language for that one rewrite.`)
};

const ja_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` を付けると、その一回の書き換えの言語を指定できます。`)
};

const ko_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` 를 붙이면 이번 한 번의 바꿔쓰기 언어를 지정할 수 있습니다.`)
};

const fr_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` pour choisir la langue de cette réécriture.`)
};

const de_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` als Präfix, um die Sprache für diese eine Umschreibung zu wählen.`)
};

const es_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` para elegir el idioma de esa reescritura.`)
};

const ru_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` как префикс, чтобы выбрать язык для этой замены.`)
};

const pt_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` para escolher o idioma dessa reescrita.`)
};

const it_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` per scegliere la lingua di quella riscrittura.`)
};

const ar_settings_input_hint_3 = /** @type {(inputs: Settings_Input_Hint_3Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` لتحديد لغة إعادة الصياغة هذه المرة.`)
};

/**
* | output |
* | --- |
* | "to pick the language for that one rewrite." |
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