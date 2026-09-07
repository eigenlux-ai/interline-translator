/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Section_DescInputs */

const zh_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`使用内置免费引擎，或自备 API 密钥接入 AI 服务。兼容的本地服务可能无需密钥。`)
};

const zh_tw2_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`使用內建免費引擎，或自備 API 金鑰連接 AI 服務。相容的本機服務可能不需金鑰。`)
};

const en_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Use the built-in free engine or connect an AI service with your own API key. Compatible local services may work without a key.`)
};

const ja_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`内蔵の無料エンジンのほか、ご自身の API キーで AI サービスを利用できます。互換性のあるローカルサービスはキーなしで使える場合があります。`)
};

const ko_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`기본 무료 엔진을 사용하거나 API 키로 AI 서비스를 연결하세요. 호환되는 로컬 서비스는 키 없이 사용할 수도 있습니다.`)
};

const fr_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Utilisez le moteur gratuit intégré ou connectez un service d’IA avec votre clé API. Certains services locaux compatibles fonctionnent sans clé.`)
};

const de_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nutzen Sie die integrierte kostenlose Engine oder verbinden Sie einen KI-Dienst mit Ihrem API-Schlüssel. Kompatible lokale Dienste benötigen unter Umständen keinen Schlüssel.`)
};

const es_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Usa el motor gratuito integrado o conecta un servicio de IA con tu clave API. Algunos servicios locales compatibles pueden funcionar sin clave.`)
};

const ru_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Используйте встроенный бесплатный движок или подключите ИИ-сервис со своим API-ключом. Некоторые совместимые локальные сервисы работают без ключа.`)
};

const pt_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Use o motor gratuito integrado ou conecte um serviço de IA com sua chave de API. Alguns serviços locais compatíveis podem funcionar sem chave.`)
};

const it_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Usa il motore gratuito integrato o collega un servizio di IA con la tua chiave API. Alcuni servizi locali compatibili possono funzionare senza chiave.`)
};

const ar_provider_section_desc = /** @type {(inputs: Provider_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استخدم المحرّك المجاني المدمج أو اربط خدمة ذكاء اصطناعي بمفتاح API خاص بك. قد تعمل بعض الخدمات المحلية المتوافقة دون مفتاح.`)
};

/**
* | output |
* | --- |
* | "Use the built-in free engine or connect an AI service with your own API key. Compatible local services may work without a key." |
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