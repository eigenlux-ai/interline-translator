/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Param_Max_Tokens_DescInputs */

const zh_provider_param_max_tokens_desc = /** @type {(inputs: Provider_Param_Max_Tokens_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`设得太低会截断整页批量翻译。`)
};

const zh_tw2_provider_param_max_tokens_desc = /** @type {(inputs: Provider_Param_Max_Tokens_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設太低會截斷整頁批量翻譯。`)
};

const en_provider_param_max_tokens_desc = /** @type {(inputs: Provider_Param_Max_Tokens_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Set too low, this truncates whole-page batch translation.`)
};

const ja_provider_param_max_tokens_desc = /** @type {(inputs: Provider_Param_Max_Tokens_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`低くしすぎると、ページ一括翻訳が途中で切れます。`)
};

const ko_provider_param_max_tokens_desc = /** @type {(inputs: Provider_Param_Max_Tokens_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`너무 낮게 잡으면 페이지 일괄 번역이 잘립니다.`)
};

const fr_provider_param_max_tokens_desc = /** @type {(inputs: Provider_Param_Max_Tokens_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une valeur trop basse tronque la traduction pleine page en lot.`)
};

const de_provider_param_max_tokens_desc = /** @type {(inputs: Provider_Param_Max_Tokens_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Zu niedrig gesetzt, schneidet das die Ganzseiten-Batch-Übersetzung ab.`)
};

const es_provider_param_max_tokens_desc = /** @type {(inputs: Provider_Param_Max_Tokens_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un valor demasiado bajo trunca la traducción por lotes de la página completa.`)
};

const ru_provider_param_max_tokens_desc = /** @type {(inputs: Provider_Param_Max_Tokens_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Слишком низкое значение обрезает пакетный перевод всей страницы.`)
};

const pt_provider_param_max_tokens_desc = /** @type {(inputs: Provider_Param_Max_Tokens_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Um valor demasiado baixo trunca a tradução da página inteira em lote.`)
};

const it_provider_param_max_tokens_desc = /** @type {(inputs: Provider_Param_Max_Tokens_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un valore troppo basso tronca la traduzione batch dell'intera pagina.`)
};

const ar_provider_param_max_tokens_desc = /** @type {(inputs: Provider_Param_Max_Tokens_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`القيمة المنخفضة أكثر من اللازم تقطع ترجمة الصفحة الكاملة على دفعات.`)
};

/**
* | output |
* | --- |
* | "Set too low, this truncates whole-page batch translation." |
*
* @param {Provider_Param_Max_Tokens_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_param_max_tokens_desc = /** @type {((inputs?: Provider_Param_Max_Tokens_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Param_Max_Tokens_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_param_max_tokens_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_param_max_tokens_desc(inputs)
	if (locale === "en") return en_provider_param_max_tokens_desc(inputs)
	if (locale === "ja") return ja_provider_param_max_tokens_desc(inputs)
	if (locale === "ko") return ko_provider_param_max_tokens_desc(inputs)
	if (locale === "fr") return fr_provider_param_max_tokens_desc(inputs)
	if (locale === "de") return de_provider_param_max_tokens_desc(inputs)
	if (locale === "es") return es_provider_param_max_tokens_desc(inputs)
	if (locale === "ru") return ru_provider_param_max_tokens_desc(inputs)
	if (locale === "pt") return pt_provider_param_max_tokens_desc(inputs)
	if (locale === "it") return it_provider_param_max_tokens_desc(inputs)
	return ar_provider_param_max_tokens_desc(inputs)
});