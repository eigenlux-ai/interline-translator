/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Preview_LabelInputs */

const zh_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`系统提示词预览`)
};

const zh_tw2_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`系統提示詞預覽`)
};

const en_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`System prompt preview`)
};

const ja_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`システムプロンプトのプレビュー`)
};

const ko_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`시스템 프롬프트 미리보기`)
};

const fr_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aperçu du prompt système`)
};

const de_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vorschau des System-Prompts`)
};

const es_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vista previa del prompt del sistema`)
};

const ru_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Предпросмотр системного промпта`)
};

const pt_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prévia do prompt do sistema`)
};

const it_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anteprima del prompt di sistema`)
};

const ar_styles_preview_label = /** @type {(inputs: Styles_Preview_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`معاينة موجّه النظام`)
};

/**
* | output |
* | --- |
* | "System prompt preview" |
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