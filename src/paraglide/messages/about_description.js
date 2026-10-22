/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} About_DescriptionInputs */

const zh_about_description = /** @type {(inputs: About_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`版本、项目链接与第三方许可声明。`)
};

const zh_tw2_about_description = /** @type {(inputs: About_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`版本、專案連結與第三方授權聲明。`)
};

const en_about_description = /** @type {(inputs: About_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Version, project links and third-party notices.`)
};

const ja_about_description = /** @type {(inputs: About_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`バージョン、プロジェクトへのリンク、第三者のライセンス表記。`)
};

const ko_about_description = /** @type {(inputs: About_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`버전, 프로젝트 링크 및 타사 라이선스 고지.`)
};

const fr_about_description = /** @type {(inputs: About_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Version, liens du projet et mentions de tiers.`)
};

const de_about_description = /** @type {(inputs: About_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Version, Projektlinks und Hinweise zu Drittanbietern.`)
};

const es_about_description = /** @type {(inputs: About_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Versión, enlaces del proyecto y avisos de terceros.`)
};

const ru_about_description = /** @type {(inputs: About_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Версия, ссылки на проект и уведомления третьих сторон.`)
};

const pt_about_description = /** @type {(inputs: About_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Versão, links do projeto e avisos de terceiros.`)
};

const it_about_description = /** @type {(inputs: About_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Versione, link del progetto e avvisi di terze parti.`)
};

const ar_about_description = /** @type {(inputs: About_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإصدار وروابط المشروع وإشعارات الجهات الخارجية.`)
};

/**
* | output |
* | --- |
* | "Version, project links and third-party notices." |
*
* @param {About_DescriptionInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const about_description = /** @type {((inputs?: About_DescriptionInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<About_DescriptionInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_about_description(inputs)
	if (locale === "zh-TW") return zh_tw2_about_description(inputs)
	if (locale === "en") return en_about_description(inputs)
	if (locale === "ja") return ja_about_description(inputs)
	if (locale === "ko") return ko_about_description(inputs)
	if (locale === "fr") return fr_about_description(inputs)
	if (locale === "de") return de_about_description(inputs)
	if (locale === "es") return es_about_description(inputs)
	if (locale === "ru") return ru_about_description(inputs)
	if (locale === "pt") return pt_about_description(inputs)
	if (locale === "it") return it_about_description(inputs)
	return ar_about_description(inputs)
});