/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Plain_DescInputs */

const zh_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`原味直译，不附加任何风格指令（默认）。`)
};

const zh_tw2_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`原味直譯，不附加任何風格指令（預設）。`)
};

const en_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Straight translation with no style directives (default).`)
};

const ja_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`スタイル指示を付けない素直な訳（既定）。`)
};

const ko_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`스타일 지시 없이 그대로 번역합니다(기본값).`)
};

const fr_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduction directe, sans directive de style (par défaut).`)
};

const de_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Direkte Übersetzung ohne Stilvorgaben (Standard).`)
};

const es_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traducción directa sin directrices de estilo (predeterminado).`)
};

const ru_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Прямой перевод без стилевых указаний (по умолчанию).`)
};

const pt_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tradução direta, sem diretivas de estilo (padrão).`)
};

const it_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzione diretta senza direttive di stile (predefinito).`)
};

const ar_style_plain_desc = /** @type {(inputs: Style_Plain_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترجمة مباشرة دون أي توجيهات أسلوبية (الافتراضي).`)
};

/**
* | output |
* | --- |
* | "Straight translation with no style directives (default)." |
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