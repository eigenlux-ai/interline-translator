/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Interleave_LabelInputs */

const zh_interleave_label = /** @type {(inputs: Interleave_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`逐段对照`)
};

const zh_tw2_interleave_label = /** @type {(inputs: Interleave_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`逐段對照`)
};

const en_interleave_label = /** @type {(inputs: Interleave_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Per-paragraph pairing`)
};

const ja_interleave_label = /** @type {(inputs: Interleave_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`段落ごとに対訳`)
};

const ko_interleave_label = /** @type {(inputs: Interleave_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`문단별 대역`)
};

const fr_interleave_label = /** @type {(inputs: Interleave_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Alignement par paragraphe`)
};

const de_interleave_label = /** @type {(inputs: Interleave_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Absatzweise Gegenüberstellung`)
};

const es_interleave_label = /** @type {(inputs: Interleave_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Alineación por párrafo`)
};

const ru_interleave_label = /** @type {(inputs: Interleave_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Поабзацное сопоставление`)
};

const pt_interleave_label = /** @type {(inputs: Interleave_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Alinhamento por parágrafo`)
};

const it_interleave_label = /** @type {(inputs: Interleave_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Allineamento per paragrafo`)
};

const ar_interleave_label = /** @type {(inputs: Interleave_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مقابلة فقرة بفقرة`)
};

/**
* | output |
* | --- |
* | "Per-paragraph pairing" |
*
* @param {Interleave_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const interleave_label = /** @type {((inputs?: Interleave_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Interleave_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_interleave_label(inputs)
	if (locale === "zh-TW") return zh_tw2_interleave_label(inputs)
	if (locale === "en") return en_interleave_label(inputs)
	if (locale === "ja") return ja_interleave_label(inputs)
	if (locale === "ko") return ko_interleave_label(inputs)
	if (locale === "fr") return fr_interleave_label(inputs)
	if (locale === "de") return de_interleave_label(inputs)
	if (locale === "es") return es_interleave_label(inputs)
	if (locale === "ru") return ru_interleave_label(inputs)
	if (locale === "pt") return pt_interleave_label(inputs)
	if (locale === "it") return it_interleave_label(inputs)
	return ar_interleave_label(inputs)
});