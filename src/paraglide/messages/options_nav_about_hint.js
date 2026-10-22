/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_Nav_About_HintInputs */

const zh_options_nav_about_hint = /** @type {(inputs: Options_Nav_About_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`项目与许可证`)
};

const zh_tw2_options_nav_about_hint = /** @type {(inputs: Options_Nav_About_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`專案與授權`)
};

const en_options_nav_about_hint = /** @type {(inputs: Options_Nav_About_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Project & licenses`)
};

const ja_options_nav_about_hint = /** @type {(inputs: Options_Nav_About_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`プロジェクトとライセンス`)
};

const ko_options_nav_about_hint = /** @type {(inputs: Options_Nav_About_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`프로젝트 및 라이선스`)
};

const fr_options_nav_about_hint = /** @type {(inputs: Options_Nav_About_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Projet et licences`)
};

const de_options_nav_about_hint = /** @type {(inputs: Options_Nav_About_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Projekt und Lizenzen`)
};

const es_options_nav_about_hint = /** @type {(inputs: Options_Nav_About_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Proyecto y licencias`)
};

const ru_options_nav_about_hint = /** @type {(inputs: Options_Nav_About_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Проект и лицензии`)
};

const pt_options_nav_about_hint = /** @type {(inputs: Options_Nav_About_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Projeto e licenças`)
};

const it_options_nav_about_hint = /** @type {(inputs: Options_Nav_About_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Progetto e licenze`)
};

const ar_options_nav_about_hint = /** @type {(inputs: Options_Nav_About_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المشروع والتراخيص`)
};

/**
* | output |
* | --- |
* | "Project & licenses" |
*
* @param {Options_Nav_About_HintInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_nav_about_hint = /** @type {((inputs?: Options_Nav_About_HintInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_Nav_About_HintInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_nav_about_hint(inputs)
	if (locale === "zh-TW") return zh_tw2_options_nav_about_hint(inputs)
	if (locale === "en") return en_options_nav_about_hint(inputs)
	if (locale === "ja") return ja_options_nav_about_hint(inputs)
	if (locale === "ko") return ko_options_nav_about_hint(inputs)
	if (locale === "fr") return fr_options_nav_about_hint(inputs)
	if (locale === "de") return de_options_nav_about_hint(inputs)
	if (locale === "es") return es_options_nav_about_hint(inputs)
	if (locale === "ru") return ru_options_nav_about_hint(inputs)
	if (locale === "pt") return pt_options_nav_about_hint(inputs)
	if (locale === "it") return it_options_nav_about_hint(inputs)
	return ar_options_nav_about_hint(inputs)
});