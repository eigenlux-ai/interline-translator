/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Builtin_Academic_DescInputs */

const zh_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`正式书面语，术语精确，保留原文的谨慎限定。`)
};

const zh_tw2_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`正式書面語，術語精確，保留原文的謹慎限定。`)
};

const en_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Formal register, precise terminology, hedged claims preserved.`)
};

const ja_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`フォーマルな文体。正確な術語を用い、原文の慎重な限定を保持します。`)
};

const ko_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`격식체와 정확한 용어, 원문의 신중한 한정 표현을 유지합니다.`)
};

const fr_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Registre soutenu, terminologie précise, nuances prudentes préservées.`)
};

const de_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Formales Register, präzise Terminologie, vorsichtige Einschränkungen bleiben erhalten.`)
};

const es_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Registro formal, terminología precisa, matices cautelosos preservados.`)
};

const ru_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Формальный стиль, точная терминология, осторожные формулировки сохраняются.`)
};

const pt_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Registo formal, terminologia precisa, ressalvas do original preservadas.`)
};

const it_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Registro formale, terminologia precisa, cautele dell'originale preservate.`)
};

const ar_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أسلوب رسمي ومصطلحات دقيقة مع الحفاظ على تحفّظات الأصل.`)
};

/**
* | output |
* | --- |
* | "Formal register, precise terminology, hedged claims preserved." |
*
* @param {Style_Builtin_Academic_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_builtin_academic_desc = /** @type {((inputs?: Style_Builtin_Academic_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Builtin_Academic_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_builtin_academic_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_style_builtin_academic_desc(inputs)
	if (locale === "en") return en_style_builtin_academic_desc(inputs)
	if (locale === "ja") return ja_style_builtin_academic_desc(inputs)
	if (locale === "ko") return ko_style_builtin_academic_desc(inputs)
	if (locale === "fr") return fr_style_builtin_academic_desc(inputs)
	if (locale === "de") return de_style_builtin_academic_desc(inputs)
	if (locale === "es") return es_style_builtin_academic_desc(inputs)
	if (locale === "ru") return ru_style_builtin_academic_desc(inputs)
	if (locale === "pt") return pt_style_builtin_academic_desc(inputs)
	if (locale === "it") return it_style_builtin_academic_desc(inputs)
	return ar_style_builtin_academic_desc(inputs)
});