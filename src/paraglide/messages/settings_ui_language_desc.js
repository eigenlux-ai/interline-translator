/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Ui_Language_DescInputs */

const zh_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`默认跟随目标语言——界面说你正在阅读的语言`)
};

const zh_tw2_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`預設跟隨目標語言——介面說你正在閱讀的語言`)
};

const en_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Follows the target language by default — the UI speaks the language you read`)
};

const ja_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`既定では翻訳先の言語に従います——あなたが読んでいる言語で表示します`)
};

const ko_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`기본적으로 번역 대상 언어를 따릅니다 — 화면이 당신이 읽는 언어로 표시됩니다`)
};

const fr_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suit la langue cible par défaut — l'interface parle la langue que vous lisez`)
};

const de_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Folgt standardmäßig der Zielsprache — die Oberfläche spricht die Sprache, die Sie lesen`)
};

const es_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sigue el idioma de destino por defecto: la interfaz habla el idioma que lees`)
};

const ru_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`По умолчанию следует за языком перевода — интерфейс говорит на языке, который вы читаете`)
};

const pt_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Segue o idioma de destino por padrão — a interface fala o idioma que você lê`)
};

const it_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Segue la lingua di destinazione per impostazione predefinita — l'interfaccia parla la lingua che leggi`)
};

const ar_settings_ui_language_desc = /** @type {(inputs: Settings_Ui_Language_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تتبع لغة الهدف افتراضيًا — تتحدث الواجهة اللغة التي تقرأها`)
};

/**
* | output |
* | --- |
* | "Follows the target language by default — the UI speaks the language you read" |
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