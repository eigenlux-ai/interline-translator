/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Input_Target_DescInputs */

const zh_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`你写作的语言,通常与阅读目标相反`)
};

const zh_tw2_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`你寫作的語言,通常與閱讀目標相反`)
};

const en_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The language you write into — usually the opposite of your reading target`)
};

const ja_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`あなたが書く言語。ふつう読む側とは逆になります`)
};

const ko_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`당신이 쓰는 언어. 보통 읽는 대상과 반대입니다`)
};

const fr_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La langue dans laquelle vous écrivez — en général l'inverse de votre langue de lecture`)
};

const de_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Die Sprache, in der Sie schreiben — meist das Gegenteil Ihrer Lesesprache`)
};

const es_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`El idioma en el que escribes, normalmente el opuesto al que lees`)
};

const ru_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Язык, на котором вы пишете, — обычно противоположный тому, что читаете`)
};

const pt_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`O idioma em que você escreve — normalmente o oposto do que lê`)
};

const it_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La lingua in cui scrivi — di solito l'opposto di quella che leggi`)
};

const ar_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اللغة التي تكتب بها — عادةً عكس لغة قراءتك`)
};

/**
* | output |
* | --- |
* | "The language you write into — usually the opposite of your reading target" |
*
* @param {Settings_Input_Target_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_input_target_desc = /** @type {((inputs?: Settings_Input_Target_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Input_Target_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_input_target_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_input_target_desc(inputs)
	if (locale === "en") return en_settings_input_target_desc(inputs)
	if (locale === "ja") return ja_settings_input_target_desc(inputs)
	if (locale === "ko") return ko_settings_input_target_desc(inputs)
	if (locale === "fr") return fr_settings_input_target_desc(inputs)
	if (locale === "de") return de_settings_input_target_desc(inputs)
	if (locale === "es") return es_settings_input_target_desc(inputs)
	if (locale === "ru") return ru_settings_input_target_desc(inputs)
	if (locale === "pt") return pt_settings_input_target_desc(inputs)
	if (locale === "it") return it_settings_input_target_desc(inputs)
	return ar_settings_input_target_desc(inputs)
});