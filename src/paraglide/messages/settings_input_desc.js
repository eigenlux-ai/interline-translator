/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Settings_Input_DescInputs */

const zh_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`在任意输入框打字后,连按 ${i?.count} 下空格,就地翻译你写的内容。`)
};

const zh_tw2_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`在任何輸入框打字後,連按 ${i?.count} 下空白鍵,就地翻譯你寫的內容。`)
};

const en_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Type in any field, then tap the space bar ${i?.count} times in a row — what you wrote is translated in place.`)
};

const ja_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`どの入力欄でも、打ち込んだあとスペースキーを ${i?.count} 回続けて押すと、書いた内容をその場で翻訳します。`)
};

const ko_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`어떤 입력창에서든 입력한 뒤 스페이스바를 ${i?.count}번 연달아 누르면, 쓴 내용을 그 자리에서 번역합니다.`)
};

const fr_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Tapez dans n'importe quel champ, puis appuyez sur la barre d'espace ${i?.count} fois de suite — ce que vous avez écrit est traduit sur place.`)
};

const de_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Tippen Sie in ein beliebiges Feld und drücken Sie dann ${i?.count}-mal hintereinander die Leertaste — das Geschriebene wird an Ort und Stelle übersetzt.`)
};

const es_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Escribe en cualquier campo y luego pulsa la barra espaciadora ${i?.count} veces seguidas: lo que escribiste se traduce en el sitio.`)
};

const ru_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Наберите текст в любом поле, затем нажмите пробел ${i?.count} раза подряд — написанное переводится на месте.`)
};

const pt_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Escreva em qualquer campo e depois pressione a barra de espaço ${i?.count} vezes seguidas — o que escreveu é traduzido no local.`)
};

const it_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Scrivi in un campo qualsiasi, poi premi la barra spaziatrice ${i?.count} volte di seguito — ciò che hai scritto viene tradotto sul posto.`)
};

const ar_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`اكتب في أي حقل، ثم اضغط مفتاح المسافة ${i?.count} مرات متتالية — يُترجَم ما كتبته في مكانه.`)
};

/**
* | output |
* | --- |
* | "Type in any field, then tap the space bar {count} times in a row — what you wrote is translated in place." |
*
* @param {Settings_Input_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_input_desc = /** @type {((inputs: Settings_Input_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Input_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_input_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_input_desc(inputs)
	if (locale === "en") return en_settings_input_desc(inputs)
	if (locale === "ja") return ja_settings_input_desc(inputs)
	if (locale === "ko") return ko_settings_input_desc(inputs)
	if (locale === "fr") return fr_settings_input_desc(inputs)
	if (locale === "de") return de_settings_input_desc(inputs)
	if (locale === "es") return es_settings_input_desc(inputs)
	if (locale === "ru") return ru_settings_input_desc(inputs)
	if (locale === "pt") return pt_settings_input_desc(inputs)
	if (locale === "it") return it_settings_input_desc(inputs)
	return ar_settings_input_desc(inputs)
});