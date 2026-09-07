/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Site_Section_DescInputs */

const zh_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`设置默认翻译方式，也可为特定网站单独指定规则。`)
};

const zh_tw2_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定預設翻譯方式，也可為特定網站個別指定規則。`)
};

const en_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose a default translation behavior and add rules for individual sites.`)
};

const ja_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`既定の翻訳方法を設定し、サイトごとに個別のルールを追加できます。`)
};

const ko_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`기본 번역 방식을 정하고 사이트별로 규칙을 추가할 수 있습니다.`)
};

const fr_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le comportement par défaut sur chaque site, plus les exceptions par site.`)
};

const de_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Das Standardverhalten auf jeder Website, dazu Ausnahmen pro Website.`)
};

const es_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`El comportamiento por defecto en cada sitio, más las excepciones por sitio.`)
};

const ru_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Поведение по умолчанию на каждом сайте и переопределения для отдельных сайтов.`)
};

const pt_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`O comportamento padrão em cada site, mais as exceções por site.`)
};

const it_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Il comportamento predefinito su ogni sito, più le eccezioni per singolo sito.`)
};

const ar_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`السلوك الافتراضي في كل موقع، إضافةً إلى استثناءات لكل موقع.`)
};

/**
* | output |
* | --- |
* | "Choose a default translation behavior and add rules for individual sites." |
*
* @param {Site_Section_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const site_section_desc = /** @type {((inputs?: Site_Section_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Site_Section_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_site_section_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_site_section_desc(inputs)
	if (locale === "en") return en_site_section_desc(inputs)
	if (locale === "ja") return ja_site_section_desc(inputs)
	if (locale === "ko") return ko_site_section_desc(inputs)
	if (locale === "fr") return fr_site_section_desc(inputs)
	if (locale === "de") return de_site_section_desc(inputs)
	if (locale === "es") return es_site_section_desc(inputs)
	if (locale === "ru") return ru_site_section_desc(inputs)
	if (locale === "pt") return pt_site_section_desc(inputs)
	if (locale === "it") return it_site_section_desc(inputs)
	return ar_site_section_desc(inputs)
});