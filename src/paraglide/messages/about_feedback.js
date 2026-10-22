/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} About_FeedbackInputs */

const zh_about_feedback = /** @type {(inputs: About_FeedbackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`反馈与问题`)
};

const zh_tw2_about_feedback = /** @type {(inputs: About_FeedbackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`回饋與問題`)
};

const en_about_feedback = /** @type {(inputs: About_FeedbackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Feedback & issues`)
};

const ja_about_feedback = /** @type {(inputs: About_FeedbackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`フィードバック・不具合報告`)
};

const ko_about_feedback = /** @type {(inputs: About_FeedbackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`피드백 및 문제 신고`)
};

const fr_about_feedback = /** @type {(inputs: About_FeedbackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Commentaires et problèmes`)
};

const de_about_feedback = /** @type {(inputs: About_FeedbackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Feedback und Fehlerberichte`)
};

const es_about_feedback = /** @type {(inputs: About_FeedbackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Comentarios y problemas`)
};

const ru_about_feedback = /** @type {(inputs: About_FeedbackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отзывы и сообщения об ошибках`)
};

const pt_about_feedback = /** @type {(inputs: About_FeedbackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Comentários e problemas`)
};

const it_about_feedback = /** @type {(inputs: About_FeedbackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Feedback e problemi`)
};

const ar_about_feedback = /** @type {(inputs: About_FeedbackInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الملاحظات والمشكلات`)
};

/**
* | output |
* | --- |
* | "Feedback & issues" |
*
* @param {About_FeedbackInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const about_feedback = /** @type {((inputs?: About_FeedbackInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<About_FeedbackInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_about_feedback(inputs)
	if (locale === "zh-TW") return zh_tw2_about_feedback(inputs)
	if (locale === "en") return en_about_feedback(inputs)
	if (locale === "ja") return ja_about_feedback(inputs)
	if (locale === "ko") return ko_about_feedback(inputs)
	if (locale === "fr") return fr_about_feedback(inputs)
	if (locale === "de") return de_about_feedback(inputs)
	if (locale === "es") return es_about_feedback(inputs)
	if (locale === "ru") return ru_about_feedback(inputs)
	if (locale === "pt") return pt_about_feedback(inputs)
	if (locale === "it") return it_about_feedback(inputs)
	return ar_about_feedback(inputs)
});