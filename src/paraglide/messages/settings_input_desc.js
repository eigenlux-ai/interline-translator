/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Settings_Input_DescInputs */

const zh_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`在支持的输入框中写好内容后，连续按 ${i?.count} 次空格键，即可将原文替换为译文。`)
};

const zh_tw2_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`在支援的輸入框中寫好內容後，連續按 ${i?.count} 次空白鍵，即可將原文替換成譯文。`)
};

const en_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`After typing in a supported text field, press Space ${i?.count} times in a row to replace your text with its translation.`)
};

const ja_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`対応する入力欄に文章を書き、スペースキーを ${i?.count} 回続けて押すと、原文が訳文に置き換わります。`)
};

const ko_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`지원되는 입력창에 글을 쓴 뒤 스페이스바를 ${i?.count}번 연속으로 누르면 원문이 번역문으로 바뀝니다.`)
};

const fr_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Dans un champ compatible, saisissez votre texte puis appuyez ${i?.count} fois de suite sur la barre d’espace pour le remplacer par sa traduction.`)
};

const de_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Schreiben Sie in ein unterstütztes Eingabefeld und drücken Sie ${i?.count}-mal nacheinander die Leertaste. Ihr Text wird durch die Übersetzung ersetzt.`)
};

const es_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Escribe en un campo compatible y pulsa la barra espaciadora ${i?.count} veces seguidas para sustituir el texto por su traducción.`)
};

const ru_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Введите текст в поддерживаемом поле и нажмите пробел несколько раз подряд, чтобы заменить текст переводом. Число нажатий: ${i?.count}.`)
};

const pt_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Escreva em um campo compatível e pressione a barra de espaço ${i?.count} vezes seguidas para substituir o texto pela tradução.`)
};

const it_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Scrivi in un campo compatibile e premi la barra spaziatrice ${i?.count} volte di seguito per sostituire il testo con la traduzione.`)
};

const ar_settings_input_desc = /** @type {(inputs: Settings_Input_DescInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`اكتب في حقل مدعوم، ثم اضغط مفتاح المسافة بشكل متتالٍ لاستبدال النص بترجمته. عدد الضغطات: ${i?.count}.`)
};

/**
* | output |
* | --- |
* | "After typing in a supported text field, press Space {count} times in a row to replace your text with its translation." |
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