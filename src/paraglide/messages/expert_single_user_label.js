/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ text: NonNullable<unknown> }} Expert_Single_User_LabelInputs */

const zh_expert_single_user_label = /** @type {(inputs: Expert_Single_User_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`单条翻译 · 用户模板（必须包含 ${i?.text}）`)
};

const zh_tw2_expert_single_user_label = /** @type {(inputs: Expert_Single_User_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`單筆翻譯 · 使用者範本（必須包含 ${i?.text}）`)
};

const en_expert_single_user_label = /** @type {(inputs: Expert_Single_User_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Single translation · user template (must contain ${i?.text})`)
};

const ja_expert_single_user_label = /** @type {(inputs: Expert_Single_User_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`単発翻訳 · ユーザーテンプレート（${i?.text} 必須）`)
};

const ko_expert_single_user_label = /** @type {(inputs: Expert_Single_User_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`단건 번역 · 사용자 템플릿(${i?.text} 필수)`)
};

const fr_expert_single_user_label = /** @type {(inputs: Expert_Single_User_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Traduction unitaire · modèle utilisateur (${i?.text} requis)`)
};

const de_expert_single_user_label = /** @type {(inputs: Expert_Single_User_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Einzelübersetzung · User-Vorlage (muss ${i?.text} enthalten)`)
};

const es_expert_single_user_label = /** @type {(inputs: Expert_Single_User_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Traducción única · plantilla de usuario (debe contener ${i?.text})`)
};

const ru_expert_single_user_label = /** @type {(inputs: Expert_Single_User_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Одиночный перевод · шаблон сообщения (обязателен ${i?.text})`)
};

const pt_expert_single_user_label = /** @type {(inputs: Expert_Single_User_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Tradução individual · template do usuário (deve conter ${i?.text})`)
};

const it_expert_single_user_label = /** @type {(inputs: Expert_Single_User_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Traduzione singola · template utente (deve contenere ${i?.text})`)
};

const ar_expert_single_user_label = /** @type {(inputs: Expert_Single_User_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ترجمة فردية · قالب المستخدم (يجب أن يتضمن ${i?.text})`)
};

/**
* | output |
* | --- |
* | "Single translation · user template (must contain {text})" |
*
* @param {Expert_Single_User_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const expert_single_user_label = /** @type {((inputs: Expert_Single_User_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expert_Single_User_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_expert_single_user_label(inputs)
	if (locale === "zh-TW") return zh_tw2_expert_single_user_label(inputs)
	if (locale === "en") return en_expert_single_user_label(inputs)
	if (locale === "ja") return ja_expert_single_user_label(inputs)
	if (locale === "ko") return ko_expert_single_user_label(inputs)
	if (locale === "fr") return fr_expert_single_user_label(inputs)
	if (locale === "de") return de_expert_single_user_label(inputs)
	if (locale === "es") return es_expert_single_user_label(inputs)
	if (locale === "ru") return ru_expert_single_user_label(inputs)
	if (locale === "pt") return pt_expert_single_user_label(inputs)
	if (locale === "it") return it_expert_single_user_label(inputs)
	return ar_expert_single_user_label(inputs)
});