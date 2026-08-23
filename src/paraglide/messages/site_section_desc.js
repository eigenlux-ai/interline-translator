/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Site_Section_DescInputs */

const zh_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`站点的默认翻译行为,以及按站覆盖规则。`)
};

const zh_tw2_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`所有網站的預設翻譯行為,以及逐站覆寫規則。`)
};

const en_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The default behaviour on every site, plus per-site overrides.`)
};

const ja_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`すべてのサイトの既定の翻訳動作と、サイトごとの上書き。`)
};

const ko_site_section_desc = /** @type {(inputs: Site_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`모든 사이트의 기본 번역 동작과 사이트별 재정의.`)
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
* | "The default behaviour on every site, plus per-site overrides." |
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