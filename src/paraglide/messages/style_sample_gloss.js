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
	return /** @type {LocalizedString} */ (`Preview translation style`)
};

const ja_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ここで訳文スタイルをプレビュー`)
};

const ko_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`여기서 번역 스타일 미리보기`)
};

const fr_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aperçu du style de traduction`)
};

const de_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzungsstil-Vorschau`)
};

const es_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vista previa del estilo de traducción`)
};

const ru_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Предпросмотр стиля перевода`)
};

const pt_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pré-visualização do estilo de tradução`)
};

const it_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anteprima stile traduzione`)
};

const ar_style_sample_gloss = /** @type {(inputs: Style_Sample_GlossInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`معاينة نمط الترجمة`)
};

/**
* | output |
* | --- |
* | "Preview translation style" |
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