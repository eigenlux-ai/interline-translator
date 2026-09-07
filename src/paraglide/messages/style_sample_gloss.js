/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Sample_GlossInputs */

const zh_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`在此预览译文样式`)
};

const zh_tw2_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`在此預覽譯文樣式`)
};

const en_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Preview of translation appearance`)
};

const ja_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`訳文の表示プレビュー`)
};

const ko_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역문 표시 미리보기`)
};

const fr_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aperçu de l’apparence du texte traduit`)
};

const de_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vorschau der Darstellung`)
};

const es_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vista previa de la apariencia`)
};

const ru_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Предпросмотр оформления перевода`)
};

const pt_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prévia da aparência da tradução`)
};

const it_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anteprima dell’aspetto della traduzione`)
};

const ar_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`معاينة مظهر الترجمة`)
};

/**
* | output |
* | --- |
* | "Preview of translation appearance" |
*
* @param {Style_Sample_GlossInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_sample_gloss = /** @type {((inputs?: Style_Sample_GlossInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Sample_GlossInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_sample_gloss(inputs)
	if (locale === "zh-TW") return zh_tw2_style_sample_gloss(inputs)
	if (locale === "en") return en_style_sample_gloss(inputs)
	if (locale === "ja") return ja_style_sample_gloss(inputs)
	if (locale === "ko") return ko_style_sample_gloss(inputs)
	if (locale === "fr") return fr_style_sample_gloss(inputs)
	if (locale === "de") return de_style_sample_gloss(inputs)
	if (locale === "es") return es_style_sample_gloss(inputs)
	if (locale === "ru") return ru_style_sample_gloss(inputs)
	if (locale === "pt") return pt_style_sample_gloss(inputs)
	if (locale === "it") return it_style_sample_gloss(inputs)
	return ar_style_sample_gloss(inputs)
});