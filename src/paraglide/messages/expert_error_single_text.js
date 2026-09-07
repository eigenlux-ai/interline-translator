/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ text: NonNullable<unknown> }} Expert_Error_Single_TextInputs */

const zh_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`用户模板须包含 ${i?.text}，才能将待译文本发送给引擎。`)
};

const zh_tw2_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`使用者範本須包含 ${i?.text}，才能將待譯文字傳送給引擎。`)
};

const en_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Include ${i?.text} in the user template so the text to translate is sent to the engine.`)
};

const ja_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`翻訳する文章を送信できるように、ユーザーテンプレートに ${i?.text} を含めてください。`)
};

const ko_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`번역할 글을 엔진에 보낼 수 있도록 사용자 템플릿에 ${i?.text}를 포함하세요.`)
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
	return /** @type {LocalizedString} */ (`Inclua ${i?.text} no template do usuário para que o texto a traduzir seja enviado ao motor.`)
};

const it_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Il template utente deve contenere ${i?.text}, altrimenti il testo da tradurre non viene mai inviato.`)
};

const ar_expert_error_single_text = /** @type {(inputs: Expert_Error_Single_TextInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أدرج ${i?.text} في قالب المستخدم لإرسال النص المراد ترجمته إلى المحرّك.`)
};

/**
* | output |
* | --- |
* | "Include {text} in the user template so the text to translate is sent to the engine." |
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