/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Section_DescInputs */

const zh_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`内置的免费机器翻译,加上你自己添加的 LLM 服务商(自备密钥)。`)
};

const zh_tw2_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`內建的免費機器翻譯,加上你自己新增的 LLM 服務商(自備金鑰)。`)
};

const en_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The built-in free machine translation, plus LLM providers you add (bring your own key).`)
};

const ja_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`内蔵の無料機械翻訳に加え、自分で追加した LLM プロバイダー(キーはご自身で用意)。`)
};

const ko_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`기본 제공되는 무료 기계 번역과, 직접 추가한 LLM 제공자(키는 직접 준비).`)
};

const fr_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La traduction automatique gratuite intégrée, plus les fournisseurs LLM que vous ajoutez (avec votre propre clé).`)
};

const de_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Die integrierte kostenlose maschinelle Übersetzung, dazu selbst hinzugefügte LLM-Anbieter (mit eigenem Schlüssel).`)
};

const es_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La traducción automática gratuita integrada, más los proveedores de LLM que añadas (con tu propia clave).`)
};

const ru_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Встроенный бесплатный машинный перевод плюс добавленные вами LLM-провайдеры (со своим ключом).`)
};

const pt_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A tradução automática gratuita integrada, mais os fornecedores de LLM que você adicionar (com a sua própria chave).`)
};

const it_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La traduzione automatica gratuita integrata, più i provider LLM che aggiungi (con la tua chiave).`)
};

const ar_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الترجمة الآلية المجانية المدمجة، إضافةً إلى مزوّدي نماذج LLM الذين تضيفهم (بمفتاحك الخاص).`)
};

/**
* | output |
* | --- |
* | "The built-in free machine translation, plus LLM providers you add (bring your own key)." |
*
* @param {Provider_Section_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_section_desc = /** @type {((inputs?: Provider_Section_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Section_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_section_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_section_desc(inputs)
	if (locale === "en") return en_provider_section_desc(inputs)
	if (locale === "ja") return ja_provider_section_desc(inputs)
	if (locale === "ko") return ko_provider_section_desc(inputs)
	if (locale === "fr") return fr_provider_section_desc(inputs)
	if (locale === "de") return de_provider_section_desc(inputs)
	if (locale === "es") return es_provider_section_desc(inputs)
	if (locale === "ru") return ru_provider_section_desc(inputs)
	if (locale === "pt") return pt_provider_section_desc(inputs)
	if (locale === "it") return it_provider_section_desc(inputs)
	return ar_provider_section_desc(inputs)
});