/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Badge_DraftInputs */

const zh_provider_badge_draft = /** @type {(inputs: Provider_Badge_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`草稿`)
};

const zh_tw2_provider_badge_draft = /** @type {(inputs: Provider_Badge_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`草稿`)
};

const en_provider_badge_draft = /** @type {(inputs: Provider_Badge_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draft`)
};

const ja_provider_badge_draft = /** @type {(inputs: Provider_Badge_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`下書き`)
};

const ko_provider_badge_draft = /** @type {(inputs: Provider_Badge_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`초안`)
};

const fr_provider_badge_draft = /** @type {(inputs: Provider_Badge_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Brouillon`)
};

const de_provider_badge_draft = /** @type {(inputs: Provider_Badge_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Entwurf`)
};

const es_provider_badge_draft = /** @type {(inputs: Provider_Badge_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Borrador`)
};

const ru_provider_badge_draft = /** @type {(inputs: Provider_Badge_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Черновик`)
};

const pt_provider_badge_draft = /** @type {(inputs: Provider_Badge_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rascunho`)
};

const it_provider_badge_draft = /** @type {(inputs: Provider_Badge_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bozza`)
};

const ar_provider_badge_draft = /** @type {(inputs: Provider_Badge_DraftInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسوّدة`)
};

/**
* | output |
* | --- |
* | "Draft" |
*
* @param {Provider_Badge_DraftInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_badge_draft = /** @type {((inputs?: Provider_Badge_DraftInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Badge_DraftInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_badge_draft(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_badge_draft(inputs)
	if (locale === "en") return en_provider_badge_draft(inputs)
	if (locale === "ja") return ja_provider_badge_draft(inputs)
	if (locale === "ko") return ko_provider_badge_draft(inputs)
	if (locale === "fr") return fr_provider_badge_draft(inputs)
	if (locale === "de") return de_provider_badge_draft(inputs)
	if (locale === "es") return es_provider_badge_draft(inputs)
	if (locale === "ru") return ru_provider_badge_draft(inputs)
	if (locale === "pt") return pt_provider_badge_draft(inputs)
	if (locale === "it") return it_provider_badge_draft(inputs)
	return ar_provider_badge_draft(inputs)
});