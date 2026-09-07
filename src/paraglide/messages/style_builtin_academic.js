/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Builtin_AcademicInputs */

const zh_style_builtin_academic = /** @type {(inputs: Style_Builtin_AcademicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`学术严谨`)
};

const zh_tw2_style_builtin_academic = /** @type {(inputs: Style_Builtin_AcademicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`學術嚴謹`)
};

const en_style_builtin_academic = /** @type {(inputs: Style_Builtin_AcademicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Academic`)
};

const ja_style_builtin_academic = /** @type {(inputs: Style_Builtin_AcademicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`学術的`)
};

const ko_style_builtin_academic = /** @type {(inputs: Style_Builtin_AcademicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`학술체`)
};

const fr_style_builtin_academic = /** @type {(inputs: Style_Builtin_AcademicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Académique`)
};

const de_style_builtin_academic = /** @type {(inputs: Style_Builtin_AcademicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Akademisch`)
};

const es_style_builtin_academic = /** @type {(inputs: Style_Builtin_AcademicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Académico`)
};

const ru_style_builtin_academic = /** @type {(inputs: Style_Builtin_AcademicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Академический`)
};

const pt_style_builtin_academic = /** @type {(inputs: Style_Builtin_AcademicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Acadêmico`)
};

const it_style_builtin_academic = /** @type {(inputs: Style_Builtin_AcademicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Accademico`)
};

const ar_style_builtin_academic = /** @type {(inputs: Style_Builtin_AcademicInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أكاديمي`)
};

/**
* | output |
* | --- |
* | "Academic" |
*
* @param {Style_Builtin_AcademicInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_builtin_academic = /** @type {((inputs?: Style_Builtin_AcademicInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Builtin_AcademicInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_builtin_academic(inputs)
	if (locale === "zh-TW") return zh_tw2_style_builtin_academic(inputs)
	if (locale === "en") return en_style_builtin_academic(inputs)
	if (locale === "ja") return ja_style_builtin_academic(inputs)
	if (locale === "ko") return ko_style_builtin_academic(inputs)
	if (locale === "fr") return fr_style_builtin_academic(inputs)
	if (locale === "de") return de_style_builtin_academic(inputs)
	if (locale === "es") return es_style_builtin_academic(inputs)
	if (locale === "ru") return ru_style_builtin_academic(inputs)
	if (locale === "pt") return pt_style_builtin_academic(inputs)
	if (locale === "it") return it_style_builtin_academic(inputs)
	return ar_style_builtin_academic(inputs)
});