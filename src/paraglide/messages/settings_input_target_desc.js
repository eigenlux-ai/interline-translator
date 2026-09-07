/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Input_Target_DescInputs */

const zh_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`选择写作时使用的语言，可与阅读时的目标语言不同。`)
};

const zh_tw2_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`選擇寫作時使用的語言，可與閱讀時的目標語言不同。`)
};

const en_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose a language for writing. This can differ from your reading language.`)
};

const ja_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`文章を書くときの翻訳先を選びます。読むときとは別の言語を設定できます。`)
};

const ko_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`글을 쓸 때 사용할 번역 대상 언어입니다. 읽을 때와 다른 언어로 설정할 수 있습니다.`)
};

const fr_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisissez la langue dans laquelle traduire vos messages. Elle peut différer de votre langue de lecture.`)
};

const de_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wählen Sie die Zielsprache für Ihre eigenen Texte. Sie kann von Ihrer Lesesprache abweichen.`)
};

const es_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Elige el idioma al que traducir tus mensajes. Puede ser distinto del idioma que usas para leer.`)
};

const ru_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Выберите язык для перевода ваших сообщений. Он может отличаться от языка, на котором вы читаете.`)
};

const pt_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escolha o idioma para traduzir suas mensagens. Ele pode ser diferente do idioma que você usa para ler.`)
};

const it_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scegli la lingua in cui tradurre i tuoi messaggi. Può essere diversa da quella che usi per leggere.`)
};

const ar_settings_input_target_desc = /** @type {(inputs: Settings_Input_Target_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر اللغة التي تريد ترجمة رسائلك إليها. يمكن أن تختلف عن لغة القراءة.`)
};

/**
* | output |
* | --- |
* | "Choose a language for writing. This can differ from your reading language." |
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