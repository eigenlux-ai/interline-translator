/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Ui_Language_DescInputs */

const zh_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`默认使用翻译的目标语言显示界面。`)
};

const zh_tw2_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`預設以翻譯的目標語言顯示介面。`)
};

const en_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`By default, the interface uses your translation target language.`)
};

const ja_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`既定では、翻訳先の言語で画面を表示します。`)
};

const ko_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`기본적으로 번역 대상 언어로 화면을 표시합니다.`)
};

const fr_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Par défaut, l’interface utilise la langue de traduction choisie.`)
};

const de_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Die Oberfläche verwendet standardmäßig die Zielsprache der Übersetzung.`)
};

const es_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`De forma predeterminada, la interfaz utiliza el idioma de destino de la traducción.`)
};

const ru_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`По умолчанию интерфейс использует язык перевода.`)
};

const pt_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Por padrão, a interface usa o idioma de destino da tradução.`)
};

const it_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Per impostazione predefinita, l’interfaccia usa la lingua di destinazione della traduzione.`)
};

const ar_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تستخدم الواجهة لغة الترجمة المستهدفة افتراضيًا.`)
};

/**
* | output |
* | --- |
* | "By default, the interface uses your translation target language." |
*
* @param {Settings_Ui_Language_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_ui_language_desc = /** @type {((inputs?: Settings_Ui_Language_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Ui_Language_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_ui_language_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_ui_language_desc(inputs)
	if (locale === "en") return en_settings_ui_language_desc(inputs)
	if (locale === "ja") return ja_settings_ui_language_desc(inputs)
	if (locale === "ko") return ko_settings_ui_language_desc(inputs)
	if (locale === "fr") return fr_settings_ui_language_desc(inputs)
	if (locale === "de") return de_settings_ui_language_desc(inputs)
	if (locale === "es") return es_settings_ui_language_desc(inputs)
	if (locale === "ru") return ru_settings_ui_language_desc(inputs)
	if (locale === "pt") return pt_settings_ui_language_desc(inputs)
	if (locale === "it") return it_settings_ui_language_desc(inputs)
	return ar_settings_ui_language_desc(inputs)
});