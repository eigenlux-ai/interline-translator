/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ text: NonNullable<unknown> }} Expert_Error_Single_TextInputs */

const zh_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`正文模板必须包含 ${i?.text}，否则待译文本根本不会被发送。`)
};

const zh_tw2_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`內文模板必須包含 ${i?.text}，否則待譯文字根本不會被傳送。`)
};

const en_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The user template must contain ${i?.text}, or the text to translate is never sent at all.`)
};

const ja_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`本文テンプレートには ${i?.text} が必要です。ないと翻訳対象のテキストが送信されません。`)
};

const ko_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`본문 템플릿에는 ${i?.text}가 있어야 합니다. 없으면 번역할 텍스트가 아예 전송되지 않습니다.`)
};

const fr_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Le modèle utilisateur doit contenir ${i?.text}, sinon le texte à traduire n'est jamais envoyé.`)
};

const de_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Die User-Vorlage muss ${i?.text} enthalten, sonst wird der zu übersetzende Text gar nicht gesendet.`)
};

const es_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`La plantilla de usuario debe contener ${i?.text}; si no, el texto a traducir nunca se envía.`)
};

const ru_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Шаблон сообщения должен содержать ${i?.text}, иначе переводимый текст вообще не будет отправлен.`)
};

const pt_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`O modelo de utilizador tem de conter ${i?.text}, caso contrário o texto a traduzir nunca é enviado.`)
};

const it_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Il template utente deve contenere ${i?.text}, altrimenti il testo da tradurre non viene mai inviato.`)
};

const ar_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`يجب أن يتضمن قالب النص ${i?.text}، وإلا فلن يُرسل النص المراد ترجمته أصلاً.`)
};

/**
* | output |
* | --- |
* | "The user template must contain {text}, or the text to translate is never sent at all." |
*
* @param {Expert_Error_Single_TextInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const expert_error_single_text = /** @type {((inputs: Expert_Error_Single_TextInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expert_Error_Single_TextInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_expert_error_single_text(inputs)
	if (locale === "zh-TW") return zh_tw2_expert_error_single_text(inputs)
	if (locale === "en") return en_expert_error_single_text(inputs)
	if (locale === "ja") return ja_expert_error_single_text(inputs)
	if (locale === "ko") return ko_expert_error_single_text(inputs)
	if (locale === "fr") return fr_expert_error_single_text(inputs)
	if (locale === "de") return de_expert_error_single_text(inputs)
	if (locale === "es") return es_expert_error_single_text(inputs)
	if (locale === "ru") return ru_expert_error_single_text(inputs)
	if (locale === "pt") return pt_expert_error_single_text(inputs)
	if (locale === "it") return it_expert_error_single_text(inputs)
	return ar_expert_error_single_text(inputs)
});