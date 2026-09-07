/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Quick_Add_DescInputs */

const zh_provider_quick_add_desc = /** @type {(inputs: Provider_Quick_Add_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`支持主流 AI 服务商，以及兼容 OpenAI 或 Anthropic 协议的本地与云端服务。`)
};

const zh_tw2_provider_quick_add_desc = /** @type {(inputs: Provider_Quick_Add_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`支援主流 AI 服務商，以及相容 OpenAI 或 Anthropic 協定的本機與雲端服務。`)
};

const en_provider_quick_add_desc = /** @type {(inputs: Provider_Quick_Add_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connect AI providers or local and cloud services compatible with OpenAI or Anthropic.`)
};

const ja_provider_quick_add_desc = /** @type {(inputs: Provider_Quick_Add_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`主要 AI サービスや、OpenAI / Anthropic 互換のローカル・クラウドサービスに接続できます。`)
};

const ko_provider_quick_add_desc = /** @type {(inputs: Provider_Quick_Add_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`주요 AI 제공업체와 OpenAI 또는 Anthropic 호환 로컬·클라우드 서비스를 연결하세요.`)
};

const fr_provider_quick_add_desc = /** @type {(inputs: Provider_Quick_Add_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connectez des fournisseurs IA ou des services locaux et cloud compatibles avec OpenAI ou Anthropic.`)
};

const de_provider_quick_add_desc = /** @type {(inputs: Provider_Quick_Add_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`KI-Anbieter oder lokale und Cloud-Dienste verbinden, die mit OpenAI oder Anthropic kompatibel sind.`)
};

const es_provider_quick_add_desc = /** @type {(inputs: Provider_Quick_Add_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Conecta proveedores de IA o servicios locales y en la nube compatibles con OpenAI o Anthropic.`)
};

const ru_provider_quick_add_desc = /** @type {(inputs: Provider_Quick_Add_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Подключайте ИИ-провайдеров, локальные и облачные сервисы, совместимые с OpenAI или Anthropic.`)
};

const pt_provider_quick_add_desc = /** @type {(inputs: Provider_Quick_Add_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Conecte provedores de IA ou serviços locais e na nuvem compatíveis com OpenAI ou Anthropic.`)
};

const it_provider_quick_add_desc = /** @type {(inputs: Provider_Quick_Add_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Collega fornitori IA o servizi locali e cloud compatibili con OpenAI o Anthropic.`)
};

const ar_provider_quick_add_desc = /** @type {(inputs: Provider_Quick_Add_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اربط مزوّدي الذكاء الاصطناعي أو الخدمات المحلية والسحابية المتوافقة مع OpenAI أو Anthropic.`)
};

/**
* | output |
* | --- |
* | "Connect AI providers or local and cloud services compatible with OpenAI or Anthropic." |
*
* @param {Provider_Quick_Add_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_quick_add_desc = /** @type {((inputs?: Provider_Quick_Add_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Quick_Add_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_quick_add_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_quick_add_desc(inputs)
	if (locale === "en") return en_provider_quick_add_desc(inputs)
	if (locale === "ja") return ja_provider_quick_add_desc(inputs)
	if (locale === "ko") return ko_provider_quick_add_desc(inputs)
	if (locale === "fr") return fr_provider_quick_add_desc(inputs)
	if (locale === "de") return de_provider_quick_add_desc(inputs)
	if (locale === "es") return es_provider_quick_add_desc(inputs)
	if (locale === "ru") return ru_provider_quick_add_desc(inputs)
	if (locale === "pt") return pt_provider_quick_add_desc(inputs)
	if (locale === "it") return it_provider_quick_add_desc(inputs)
	return ar_provider_quick_add_desc(inputs)
});