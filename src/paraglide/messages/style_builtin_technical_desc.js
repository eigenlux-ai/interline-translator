/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Builtin_Technical_DescInputs */

const zh_style_builtin_technical_desc = /** @type {(inputs: Style_Builtin_Technical_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API 名与标识符不译，祈使语气，全篇术语一致。`)
};

const zh_tw2_style_builtin_technical_desc = /** @type {(inputs: Style_Builtin_Technical_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API 名與識別碼不譯，祈使語氣，全篇術語一致。`)
};

const en_style_builtin_technical_desc = /** @type {(inputs: Style_Builtin_Technical_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API names stay untranslated, imperative mood, consistent terminology.`)
};

const ja_style_builtin_technical_desc = /** @type {(inputs: Style_Builtin_Technical_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API 名や識別子は訳さず、命令形で、術語を全体で統一します。`)
};

const ko_style_builtin_technical_desc = /** @type {(inputs: Style_Builtin_Technical_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API 이름과 식별자는 번역하지 않고, 명령형과 일관된 용어를 사용합니다.`)
};

const fr_style_builtin_technical_desc = /** @type {(inputs: Style_Builtin_Technical_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Noms d'API non traduits, mode impératif, terminologie cohérente.`)
};

const de_style_builtin_technical_desc = /** @type {(inputs: Style_Builtin_Technical_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API-Namen bleiben unübersetzt, Imperativ, konsistente Terminologie.`)
};

const es_style_builtin_technical_desc = /** @type {(inputs: Style_Builtin_Technical_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nombres de API sin traducir, modo imperativo, terminología coherente.`)
};

const ru_style_builtin_technical_desc = /** @type {(inputs: Style_Builtin_Technical_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Имена API не переводятся, повелительное наклонение, единая терминология.`)
};

const pt_style_builtin_technical_desc = /** @type {(inputs: Style_Builtin_Technical_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nomes de API não traduzidos, modo imperativo, terminologia consistente.`)
};

const it_style_builtin_technical_desc = /** @type {(inputs: Style_Builtin_Technical_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nomi API non tradotti, modo imperativo, terminologia coerente.`)
};

const ar_style_builtin_technical_desc = /** @type {(inputs: Style_Builtin_Technical_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أسماء الواجهات تبقى دون ترجمة، بصيغة أمر ومصطلحات متسقة.`)
};

/**
* | output |
* | --- |
* | "API names stay untranslated, imperative mood, consistent terminology." |
*
* @param {Style_Builtin_Technical_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_builtin_technical_desc = /** @type {((inputs?: Style_Builtin_Technical_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Builtin_Technical_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_builtin_technical_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_style_builtin_technical_desc(inputs)
	if (locale === "en") return en_style_builtin_technical_desc(inputs)
	if (locale === "ja") return ja_style_builtin_technical_desc(inputs)
	if (locale === "ko") return ko_style_builtin_technical_desc(inputs)
	if (locale === "fr") return fr_style_builtin_technical_desc(inputs)
	if (locale === "de") return de_style_builtin_technical_desc(inputs)
	if (locale === "es") return es_style_builtin_technical_desc(inputs)
	if (locale === "ru") return ru_style_builtin_technical_desc(inputs)
	if (locale === "pt") return pt_style_builtin_technical_desc(inputs)
	if (locale === "it") return it_style_builtin_technical_desc(inputs)
	return ar_style_builtin_technical_desc(inputs)
});