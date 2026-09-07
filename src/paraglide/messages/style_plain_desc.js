/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Plain_DescInputs */

const zh_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`不添加额外风格指令，按原文翻译（默认）。`)
};

const zh_tw2_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`不加入額外風格指令，依原文翻譯（預設）。`)
};

const en_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translate without additional style instructions (default).`)
};

const ja_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`追加のスタイル指示を付けずに翻訳します（既定）。`)
};

const ko_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`추가 문체 지시 없이 원문에 충실하게 번역합니다(기본값).`)
};

const fr_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduction sans consignes de style supplémentaires (par défaut).`)
};

const de_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzung ohne zusätzliche Stilvorgaben (Standard).`)
};

const es_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traducción sin instrucciones de estilo adicionales (predeterminado).`)
};

const ru_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевод без дополнительных указаний по стилю (по умолчанию).`)
};

const pt_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tradução sem instruções de estilo adicionais (padrão).`)
};

const it_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzione senza istruzioni di stile aggiuntive (predefinito).`)
};

const ar_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترجمة دون توجيهات أسلوبية إضافية (الافتراضي).`)
};

/**
* | output |
* | --- |
* | "Translate without additional style instructions (default)." |
*
* @param {Style_Plain_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_plain_desc = /** @type {((inputs?: Style_Plain_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Plain_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_plain_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_style_plain_desc(inputs)
	if (locale === "en") return en_style_plain_desc(inputs)
	if (locale === "ja") return ja_style_plain_desc(inputs)
	if (locale === "ko") return ko_style_plain_desc(inputs)
	if (locale === "fr") return fr_style_plain_desc(inputs)
	if (locale === "de") return de_style_plain_desc(inputs)
	if (locale === "es") return es_style_plain_desc(inputs)
	if (locale === "ru") return ru_style_plain_desc(inputs)
	if (locale === "pt") return pt_style_plain_desc(inputs)
	if (locale === "it") return it_style_plain_desc(inputs)
	return ar_style_plain_desc(inputs)
});