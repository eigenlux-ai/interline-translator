/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Preview_LabelInputs */

const zh_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`组装预览（实际发送的 system prompt）`)
};

const zh_tw2_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`組裝預覽（實際傳送的 system prompt）`)
};

const en_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Assembled preview (the system prompt actually sent)`)
};

const ja_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`組み立てプレビュー（実際に送信される system prompt）`)
};

const ko_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`조립 미리보기(실제 전송되는 system prompt)`)
};

const fr_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aperçu assemblé (le system prompt réellement envoyé)`)
};

const de_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Zusammengesetzte Vorschau (der tatsächlich gesendete System-Prompt)`)
};

const es_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vista previa ensamblada (el system prompt que se envía)`)
};

const ru_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Собранный вид (реально отправляемый system prompt)`)
};

const pt_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pré-visualização montada (o system prompt realmente enviado)`)
};

const it_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anteprima assemblata (il system prompt realmente inviato)`)
};

const ar_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`معاينة مجمّعة (موجّه النظام المُرسل فعلاً)`)
};

/**
* | output |
* | --- |
* | "Assembled preview (the system prompt actually sent)" |
*
* @param {Styles_Preview_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_preview_label = /** @type {((inputs?: Styles_Preview_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_Preview_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_preview_label(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_preview_label(inputs)
	if (locale === "en") return en_styles_preview_label(inputs)
	if (locale === "ja") return ja_styles_preview_label(inputs)
	if (locale === "ko") return ko_styles_preview_label(inputs)
	if (locale === "fr") return fr_styles_preview_label(inputs)
	if (locale === "de") return de_styles_preview_label(inputs)
	if (locale === "es") return es_styles_preview_label(inputs)
	if (locale === "ru") return ru_styles_preview_label(inputs)
	if (locale === "pt") return pt_styles_preview_label(inputs)
	if (locale === "it") return it_styles_preview_label(inputs)
	return ar_styles_preview_label(inputs)
});