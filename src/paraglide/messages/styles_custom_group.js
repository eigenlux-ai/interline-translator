/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Custom_GroupInputs */

const zh_styles_custom_group = /** @type {(inputs: Styles_Custom_GroupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`自定义风格`)
};

const zh_tw2_styles_custom_group = /** @type {(inputs: Styles_Custom_GroupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`自訂風格`)
};

const en_styles_custom_group = /** @type {(inputs: Styles_Custom_GroupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your styles`)
};

const ja_styles_custom_group = /** @type {(inputs: Styles_Custom_GroupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`カスタムスタイル`)
};

const ko_styles_custom_group = /** @type {(inputs: Styles_Custom_GroupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`내 스타일`)
};

const fr_styles_custom_group = /** @type {(inputs: Styles_Custom_GroupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vos styles`)
};

const de_styles_custom_group = /** @type {(inputs: Styles_Custom_GroupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Eigene Stile`)
};

const es_styles_custom_group = /** @type {(inputs: Styles_Custom_GroupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tus estilos`)
};

const ru_styles_custom_group = /** @type {(inputs: Styles_Custom_GroupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ваши стили`)
};

const pt_styles_custom_group = /** @type {(inputs: Styles_Custom_GroupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Seus estilos`)
};

const it_styles_custom_group = /** @type {(inputs: Styles_Custom_GroupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`I tuoi stili`)
};

const ar_styles_custom_group = /** @type {(inputs: Styles_Custom_GroupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أنماطك`)
};

/**
* | output |
* | --- |
* | "Your styles" |
*
* @param {Styles_Custom_GroupInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_custom_group = /** @type {((inputs?: Styles_Custom_GroupInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_Custom_GroupInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_custom_group(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_custom_group(inputs)
	if (locale === "en") return en_styles_custom_group(inputs)
	if (locale === "ja") return ja_styles_custom_group(inputs)
	if (locale === "ko") return ko_styles_custom_group(inputs)
	if (locale === "fr") return fr_styles_custom_group(inputs)
	if (locale === "de") return de_styles_custom_group(inputs)
	if (locale === "es") return es_styles_custom_group(inputs)
	if (locale === "ru") return ru_styles_custom_group(inputs)
	if (locale === "pt") return pt_styles_custom_group(inputs)
	if (locale === "it") return it_styles_custom_group(inputs)
	return ar_styles_custom_group(inputs)
});